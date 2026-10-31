// Registrations for the workshop page (index.html): the sign-up popup posts here, and this sends the person to
// Ana's Kit through the v4 API. Posting from the page straight to Kit's public form address gets
// parked by Kit's bot check ("one more step"), which nobody sees, so nobody gets added.
// Needs KIT_API_KEY (a Kit v4 API key, Vercel environment variable). Optional: KIT_SEQUENCE_ID, the
// "EP · Confirmation" sequence, so someone who signs up again gets the "You're in." email again
// (the form's visual automation only runs the first time someone joins the form).
var FORM_ID = process.env.KIT_REG_FORM_ID || '10120079';
var FIELDS = ['ref', 'situation', 'sticky_variant', 'utm_source', 'utm_medium', 'utm_campaign'];
var ORIGINS = /^https:\/\/(2026-ana-calin[a-z0-9-]*\.vercel\.app|exitplan\.howwegrowtoday\.com)$/;

// Every sign-up also goes to the "Registrants" tab of Ana's Google Sheet (tools/survey-sheet.gs), best effort: it waits
// at most 3.5 seconds and never changes the answer. Needs SURVEY_SHEET_URL and SURVEY_SHEET_KEY, as for the survey.
function toSheet(row) {
  var url = process.env.SURVEY_SHEET_URL, key = process.env.SURVEY_SHEET_KEY;
  if (!url || !key) return Promise.resolve();
  var post = fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, redirect: 'follow', body: JSON.stringify({ key: key, row: row }) })
    .catch(function () {});
  return Promise.race([post, new Promise(function (ok) { setTimeout(ok, 3500) })]);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  var origin = req.headers.origin || '';
  if (origin && !ORIGINS.test(origin)) return res.status(403).json({ ok: false });
  var key = process.env.KIT_API_KEY;
  if (!key) return res.status(503).json({ ok: false, error: 'not_configured' });

  var b = req.body || {};
  if (typeof b === 'string') { try { b = Object.fromEntries(new URLSearchParams(b)) } catch (e) { b = {} } }
  if (b.ep_check) return res.status(200).json({ ok: true }); // the hidden honeypot field: only bots fill it
  var email = String(b.email_address || '').trim().toLowerCase();
  var name = String(b.first_name || '').trim().slice(0, 60);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return res.status(400).json({ ok: false, error: 'email' });
  var fields = {};
  FIELDS.forEach(function (k) { var v = b['fields[' + k + ']']; if (v != null && v !== '') fields[k] = String(v).slice(0, 200) });

  var kit = function (path, body) {
    return fetch('https://api.kit.com/v4' + path, {
      method: 'POST',
      headers: { 'X-Kit-Api-Key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    });
  };
  var sheet = function (again, kitResult) {
    return toSheet({ kind: 'register', page: 'reg', first: name, email: email, ref: fields.ref || '', tz: String(b.tz || '').slice(0, 60),
      situation: fields.situation || '', again: again ? 'yes' : '', utm_source: fields.utm_source || '', utm_medium: fields.utm_medium || '',
      utm_campaign: fields.utm_campaign || '', sticky_variant: fields.sticky_variant || '', kit: kitResult });
  };
  try {
    var s = await kit('/subscribers', { email_address: email, first_name: name || null, fields: fields });
    if (s.status === 422 && Object.keys(fields).length) s = await kit('/subscribers', { email_address: email, first_name: name || null });
    if (!s.ok) { await sheet(false, 'error ' + s.status); return res.status(502).json({ ok: false, error: 'kit_subscriber_' + s.status }); }
    var f = await kit('/forms/' + FORM_ID + '/subscribers', { email_address: email, referrer: String(b.referrer || req.headers.referer || '').slice(0, 500) || null });
    if (!f.ok) { await sheet(false, 'error ' + f.status); return res.status(502).json({ ok: false, error: 'kit_form_' + f.status }); }
    var again = f.status === 200; // 200 = already on the form (signed up before), 201 = first time
    if (again && process.env.KIT_SEQUENCE_ID) await kit('/sequences/' + process.env.KIT_SEQUENCE_ID + '/subscribers', { email_address: email });
    await sheet(again, 'ok');
    return res.status(200).json({ ok: true, again: again });
  } catch (e) {
    await sheet(false, 'unreachable');
    return res.status(502).json({ ok: false, error: 'kit_unreachable' });
  }
};
