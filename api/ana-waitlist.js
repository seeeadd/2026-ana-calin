// The early-invite waitlist (/waitlist/): "get your invitation one day before registration opens to the public".
// Two posts come here from the page:
//  1. the sign-up (first_name + email_address): the person goes into Ana's Kit with the tag ep_waitlist (never onto the
//     registration form, so they do not get the "You're in." confirmation email early), and into the "Exit Plan Waitlist"
//     tab of Ana's Google Sheet, one row per email.
//  2. the optional question on the thank-you view (email_address + business_question + permission_to_discuss_live): the
//     answer is kept on the SAME sheet row, in the Kit custom field "Exit Plan: waitlist question", and as tags
//     (ep_wl_question, and ep_wl_discuss_ok when she may discuss it live), so Ana can pick examples for the workshop.
// Needs KIT_API_KEY (already set for the registration page). Optional: KIT_WAITLIST_FORM_ID, a Kit form to add them to as
// well (use it if Ana wants Kit's own confirmation or a visual automation to run on sign-up). The sheet needs
// SURVEY_SHEET_URL and SURVEY_SHEET_KEY, as for the registration page. Without Kit the page answers 503 and nothing is stored.
var dns = require('dns').promises;
var ORIGINS = /^https:\/\/(2026-ana-calin[a-z0-9-]*\.vercel\.app|exitplan\.howwegrowtoday\.com)$/;
var THROWAWAY = /^(mailinator\.com|guerrillamail\.(com|net)|sharklasers\.com|10minutemail\.(com|net)|temp-?mail\.(com|org|net|dev)|yopmail\.(com|fr)|trashmail\.com|getnada\.com|maildrop\.cc|throwawaymail\.com|fakeinbox\.com|dispostable\.com|example\.(com|org|net)|test\.com|domain\.com)$/;
var TAG = 'ep_waitlist';
var FIELD = 'Exit Plan: waitlist question';
var cache = { tags: {}, field: null };   // tag ids, kept while the function stays warm

// Can this email's domain receive mail? Same check as the registration page: only a clear "this domain does not exist" says no.
async function canReceive(domain) {
  var look = function (q) { return Promise.race([q, new Promise(function (ok) { setTimeout(function () { ok('slow') }, 2500) })]) };
  try { await look(dns.resolveMx(domain)); return true } catch (e) { if (e.code !== 'ENOTFOUND') return true }
  try { await look(dns.resolve4(domain)); return true } catch (e) { return e.code !== 'ENOTFOUND' }
}

function toSheet(row) {
  var url = process.env.SURVEY_SHEET_URL, key = process.env.SURVEY_SHEET_KEY;
  if (!url || !key) return Promise.resolve();
  var post = fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, redirect: 'follow', body: JSON.stringify({ key: key, row: row }) })
    .catch(function () {});
  return Promise.race([post, new Promise(function (ok) { setTimeout(ok, 3500) })]);
}

function host(u) { try { return new URL(u).hostname.replace(/^www\./, '') } catch (e) { return '' } }

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  var origin = req.headers.origin || '';
  if (origin && !ORIGINS.test(origin)) return res.status(403).json({ ok: false });
  var key = process.env.KIT_API_KEY;
  if (!key) return res.status(503).json({ ok: false, error: 'not_configured' });

  var b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b) } catch (e) { b = Object.fromEntries(new URLSearchParams(b)) } }
  if (b.ep_check) return res.status(200).json({ ok: true }); // the hidden honeypot field: only bots fill it
  var email = String(b.email_address || '').trim().toLowerCase();
  var name = String(b.first_name || '').trim().slice(0, 60);
  var question = String(b.business_question == null ? '' : b.business_question).replace(/[\r\n\t]+/g, ' ').trim().slice(0, 1000);
  var permission = b.permission_to_discuss_live === true || b.permission_to_discuss_live === 'yes';
  var isAnswer = b.business_question != null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return res.status(400).json({ ok: false, error: 'email' });
  var domain = email.slice(email.lastIndexOf('@') + 1);
  if (THROWAWAY.test(domain)) return res.status(400).json({ ok: false, error: 'email_domain' });
  if (!isAnswer && !(await canReceive(domain))) return res.status(400).json({ ok: false, error: 'email_domain' });

  var kit = function (method, path, body) {
    return fetch('https://api.kit.com/v4' + path, {
      method: method,
      headers: { 'X-Kit-Api-Key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
  };
  // the tag's id, found by name and made the first time it is needed
  async function tagId(label) {
    if (cache.tags[label]) return cache.tags[label];
    var r = await kit('GET', '/tags?per_page=1000');
    if (r.ok) { var j = await r.json(); (j.tags || []).forEach(function (t) { cache.tags[t.name] = t.id }) }
    if (!cache.tags[label]) {
      var c = await kit('POST', '/tags', { name: label });
      if (c.ok) { var cj = await c.json(); cache.tags[label] = cj.tag && cj.tag.id }
    }
    return cache.tags[label];
  }
  async function tag(label) {
    var id = await tagId(label);
    if (!id) return false;
    var r = await kit('POST', '/tags/' + id + '/subscribers', { email_address: email });
    return r.ok;
  }

  var ref = String(b.ref || '').slice(0, 120);
  var source = ref || String(b.utm_campaign || b.utm_source || '').slice(0, 120) || host(String(b.referrer || req.headers.referer || ''));
  var sheet = function (kitResult) {
    return toSheet({ kind: 'waitlist', first: name, email: email, source: source, tz: String(b.tz || '').slice(0, 60),
      business_question: question, permission: isAnswer ? (permission ? 'yes' : 'no') : '', kit: kitResult });
  };

  try {
    if (isAnswer) {
      // the optional question after sign-up: the answer goes on the same row, into a Kit field, and becomes a tag
      if (!question) return res.status(400).json({ ok: false, error: 'question' });
      var ok = true;
      try {
        var found = await kit('GET', '/subscribers?status=all&email_address=' + encodeURIComponent(email));
        var sub = found.ok && (await found.json()).subscribers;
        sub = sub && sub[0];
        if (sub) {
          if (!cache.field) {
            var lf = await kit('GET', '/custom_fields?per_page=1000'), lj = lf.ok ? await lf.json() : {};
            (lj.custom_fields || []).forEach(function (f) { if (f.label === FIELD) cache.field = f.key });
            if (!cache.field) { var cf = await kit('POST', '/custom_fields', { label: FIELD }); if (cf.ok) cache.field = (await cf.json()).custom_field.key }
          }
          if (cache.field) { var f = {}; f[cache.field] = question.slice(0, 500); await kit('PUT', '/subscribers/' + sub.id, { email_address: sub.email_address, fields: f }) }
        }
      } catch (e) { ok = false }
      ok = (await tag('ep_wl_question')) && ok;
      if (permission) ok = (await tag('ep_wl_discuss_ok')) && ok;
      await sheet(ok ? 'ok' : 'kit_partial');
      return res.status(200).json({ ok: true });
    }
    var s = await kit('POST', '/subscribers', { email_address: email, first_name: name || null, state: 'active' });
    if (s.status === 422) s = await kit('POST', '/subscribers', { email_address: email, first_name: name || null });
    if (!s.ok) { await sheet('error ' + s.status); return res.status(502).json({ ok: false, error: 'kit_subscriber_' + s.status }); }
    var tagged = await tag(TAG);
    if (process.env.KIT_WAITLIST_FORM_ID) await kit('POST', '/forms/' + process.env.KIT_WAITLIST_FORM_ID + '/subscribers', { email_address: email });
    await sheet(tagged ? 'ok' : 'tag_failed');
    if (!tagged) return res.status(502).json({ ok: false, error: 'kit_tag' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    await sheet('unreachable');
    return res.status(502).json({ ok: false, error: 'kit_unreachable' });
  }
};
