// After a payment: Stripe calls this, and it tags the buyer in Ana's Kit (so a Kit automation sends the right emails)
// and adds a row to the Google Sheet's "Sales" tab (tools/survey-sheet.gs).
//
// Set up in Stripe: Developers > Webhooks > Add endpoint
//   URL: https://exitplan.howwegrowtoday.com/api/stripe-webhook/  (with the final slash: the site redirects without it, and Stripe does not follow redirects)
//   Events: checkout.session.completed and checkout.session.async_payment_succeeded
// Vercel environment variables (Production):
//   STRIPE_SECRET_KEY   a restricted key with read access to Events and Checkout Sessions (rk_live_...)
//   KIT_API_KEY         already set for the registration page
//   KIT_TAG_VIP         the Kit tag id for VIP buyers (ep_vip): its automation sends the VIP welcome email
//   KIT_TAG_LAB         the Kit tag id for program buyers: its automation sends the program welcome email
//   KIT_TAG_LAB_PLAN    optional: an extra tag for the 2-payment plan
//   STRIPE_PLINK_VIP, STRIPE_PLINK_FULL, STRIPE_PLINK_PLAN  optional: the payment link ids (plink_...), to tell the three
//                       links apart for certain. Without them: a line item named with "VIP" is VIP, a subscription is the plan.
//
// Nothing in the request body is trusted: the event is fetched again from Stripe with the secret key, so a forged call
// can't tag anyone. Kit tags are idempotent, so Stripe's retries are harmless there.
var STRIPE = 'https://api.stripe.com/v1';

async function stripe(path, key) {
  var r = await fetch(STRIPE + path, { headers: { Authorization: 'Bearer ' + key } });
  if (!r.ok) throw new Error('stripe_' + r.status);
  return r.json();
}

function kind(session) {
  var pl = session.payment_link || '';
  if (pl && pl === process.env.STRIPE_PLINK_VIP) return 'vip';
  if (pl && pl === process.env.STRIPE_PLINK_FULL) return 'lab_full';
  if (pl && pl === process.env.STRIPE_PLINK_PLAN) return 'lab_plan';
  var items = (session.line_items && session.line_items.data) || [];
  var names = items.map(function (i) { return (i.description || '') + ' ' + ((i.price && i.price.nickname) || '') }).join(' ');
  if (/\bvip\b/i.test(names)) return 'vip';
  return session.mode === 'subscription' ? 'lab_plan' : 'lab_full';
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  var key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(503).json({ ok: false, error: 'not_configured' });

  var b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b) } catch (e) { b = {} } }
  var id = String(b.id || '');
  if (!/^evt_[A-Za-z0-9]+$/.test(id)) return res.status(400).json({ ok: false, error: 'event' });

  try {
    var ev = await stripe('/events/' + id, key);   // the real event, straight from Stripe
    var type = ev.type;
    if (type !== 'checkout.session.completed' && type !== 'checkout.session.async_payment_succeeded') return res.status(200).json({ ok: true, ignored: type });
    var s0 = ev.data && ev.data.object;
    if (!s0 || !s0.id) return res.status(200).json({ ok: true, ignored: 'no_session' });
    if (type === 'checkout.session.completed' && s0.payment_status === 'unpaid') return res.status(200).json({ ok: true, waiting: 'async_payment' });
    var s = await stripe('/checkout/sessions/' + s0.id + '?expand[]=line_items', key);

    var cd = s.customer_details || {};
    var email = String(cd.email || s.customer_email || '').trim().toLowerCase();
    var first = String(cd.name || '').trim().split(/\s+/)[0].slice(0, 60);
    var what = kind(s);
    var amount = typeof s.amount_total === 'number' ? (s.amount_total / 100).toFixed(2) : '';
    var out = { ok: true, kind: what };

    // Kit: the buyer as a subscriber, then the tag whose automation sends the welcome email
    var kitKey = process.env.KIT_API_KEY;
    var tags = what === 'vip' ? [process.env.KIT_TAG_VIP] : [process.env.KIT_TAG_LAB].concat(what === 'lab_plan' ? [process.env.KIT_TAG_LAB_PLAN] : []);
    tags = tags.filter(Boolean);
    if (kitKey && email) {
      var kit = function (path, body) {
        return fetch('https://api.kit.com/v4' + path, {
          method: 'POST',
          headers: { 'X-Kit-Api-Key': kitKey, 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body)
        });
      };
      var sub = await kit('/subscribers', { email_address: email, first_name: first || null });
      if (!sub.ok) throw new Error('kit_subscriber_' + sub.status);
      for (var i = 0; i < tags.length; i++) {
        var t = await kit('/tags/' + tags[i] + '/subscribers', { email_address: email });
        if (!t.ok) throw new Error('kit_tag_' + t.status);
      }
      out.tagged = tags.length;
    }

    // the Google Sheet: one row per sale (best effort, never blocks the tagging)
    var url = process.env.SURVEY_SHEET_URL, skey = process.env.SURVEY_SHEET_KEY;
    if (url && skey) {
      var promo = (s.total_details && s.total_details.amount_discount) ? (s.total_details.amount_discount / 100).toFixed(2) : '';
      await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, redirect: 'follow',
        body: JSON.stringify({ key: skey, row: { kind: 'sale', page: what, first: first, email: email, ref: s.client_reference_id || '', tz: '',
          product: what, amount: amount, discount: promo, currency: (s.currency || '').toUpperCase(), session: s.id } })
      }).catch(function () {});
    }
    return res.status(200).json(out);
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e.message || e) });   // Stripe retries
  }
};
