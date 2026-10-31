// After a payment: Stripe calls this, and it tags the buyer in Ana's Kit (so a Kit automation sends the right emails)
// and adds a row to the Google Sheet's "Sales" tab (tools/survey-sheet.gs).
//
// Set up in Stripe: Developers > Webhooks > Add endpoint
//   URL: https://exitplan.howwegrowtoday.com/api/stripe-webhook/  (with the final slash: the site redirects without it, and Stripe does not follow redirects)
//   Events: checkout.session.completed and checkout.session.async_payment_succeeded
// Vercel environment variables (Production):
//   STRIPE_SECRET_KEY   a restricted key with read access to Events and Checkout Sessions (rk_live_...)
//   KIT_API_KEY         already set for the registration page
//   KIT_TAG_VIP, KIT_TAG_LAB_FULL, KIT_TAG_LAB_2PAY, KIT_TAG_ID   optional: the Kit tag ids. Without them the tags are
//                       found (or made) by name: ep_vip (its automation sends "You're VIP"), ep_lab_full (the program
//                       paid in full), ep_lab_2pay (2 payments) and ep_registered (every buyer, so someone who paid with
//                       a different email from the one they registered with still gets the workshop emails)
//   STRIPE_PLINK_VIP, STRIPE_PLINK_FULL, STRIPE_PLINK_PLAN  optional: the payment link ids (plink_...). Without them the
//                       link is looked up (the key needs "Payment Links: Read") and matched against the three links below.
//
// Only the three Exit Plan payment links count. Ana's Stripe also sells Money Rewrite, Brand Deals Bootcamp and more;
// those payments reach this endpoint too and are answered "ignored" without touching Kit or the Sheet.
//
// Nothing in the request body is trusted: the event is fetched again from Stripe with the secret key, so a forged call
// can't tag anyone. Kit tags are idempotent, so Stripe's retries are harmless there.
var STRIPE = 'https://api.stripe.com/v1';

async function stripe(path, key) {
  var r = await fetch(STRIPE + path, { headers: { Authorization: 'Bearer ' + key } });
  if (!r.ok) throw new Error('stripe_' + r.status);
  return r.json();
}

// the three Exit Plan payment links (the same as in vip/index.html and assets/offer-settings.js), by the code at the end
// of their buy.stripe.com address
var LINKS = { '28EcN57sQcyC54k6vBc7u0G': 'vip', '6oU7sL14s42654kg6bc7u0H': 'lab_full', '4gMaEX4gEgOS8gwbPVc7u0I': 'lab_plan' };
var seen = {};   // payment link id -> what it sells, while the function stays warm

async function kind(session, key) {
  var pl = session.payment_link || '';
  if (!pl) return null;   // not from a payment link: not one of ours
  if (pl === process.env.STRIPE_PLINK_VIP) return 'vip';
  if (pl === process.env.STRIPE_PLINK_FULL) return 'lab_full';
  if (pl === process.env.STRIPE_PLINK_PLAN) return 'lab_plan';
  if (!(pl in seen)) {
    var link = await stripe('/payment_links/' + pl, key);
    var code = String(link.url || '').replace(/\/+$/, '').split('/').pop();
    seen[pl] = LINKS[code] || null;
  }
  return seen[pl];
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
    var what;
    try { what = await kind(s, key) } catch (e) {
      return res.status(200).json({ ok: true, ignored: 'cannot_read_payment_link', fix: 'give the Stripe key Payment Links: Read' });
    }
    if (!what) return res.status(200).json({ ok: true, ignored: 'not_exit_plan' });
    var amount = typeof s.amount_total === 'number' ? (s.amount_total / 100).toFixed(2) : '';
    var out = { ok: true, kind: what };

    // Kit: the buyer as a subscriber, then the tag whose automation sends the welcome email
    var kitKey = process.env.KIT_API_KEY;
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
      // the tag ids: from the settings, else by name (Kit hands back the existing tag when the name is taken)
      var byName = async function (envId, name) {
        if (envId) return envId;
        var t = await kit('/tags', { name: name });
        if (!t.ok) throw new Error('kit_tag_lookup_' + t.status);
        return (await t.json()).tag.id;
      };
      var tags = [
        what === 'vip' ? await byName(process.env.KIT_TAG_VIP, 'ep_vip') : what === 'lab_plan' ? await byName(process.env.KIT_TAG_LAB_2PAY, 'ep_lab_2pay') : await byName(process.env.KIT_TAG_LAB_FULL, 'ep_lab_full'),
        await byName(process.env.KIT_TAG_ID, 'ep_registered')
      ];
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
