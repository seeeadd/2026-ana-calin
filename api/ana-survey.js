// The 7 quick questions (confirmation pages) and the exit number (/exit-number/) post here. Two places get them:
//  1. Ana's Google Sheet, one row each, through a small Apps Script web app (tools/survey-sheet.gs, set-up steps at its
//     top). Needs SURVEY_SHEET_URL (the web app's /exec address) and SURVEY_SHEET_KEY (the same secret word as KEY in the
//     script), both Vercel environment variables. This is the complete record.
//  2. Ana's Kit, on the subscriber: one custom field per answer, an "Exit Plan: survey note" field with all seven in one
//     line, and the tag ep_survey_done (ep_exit_number for the calculator). Uses KIT_API_KEY, already set for the
//     registration page; the fields and tags make themselves on first use. Only people already in Kit (they registered
//     through the form) are updated: this never adds anyone to the list. Kit allows about 120 calls a minute, so in a
//     rush some Kit updates can be skipped; the Sheet still has every answer.
// Without either, the pages still work; nothing is stored.
var ORIGINS = /^https:\/\/(2026-ana-calin[a-z0-9-]*\.vercel\.app|exitplan\.howwegrowtoday\.com)$/;
var KEYS = {
  survey: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'],
  exit: ['goal_month', 'price', 'buyers_month', 'buyers_year', 'sub_price', 'subs_needed', 'free_needed']
};

var KIT = 'https://api.kit.com/v4';
// the Kit custom fields, by the label Ana sees in Kit (the API key is looked up from the label)
var FIELDS = {
  survey: [['q1', 'Exit Plan: can be there live'], ['q2', 'Exit Plan: subscribers'], ['q3', 'Exit Plan: bought before'],
           ['q4', 'Exit Plan: work right now'], ['q5', 'Exit Plan: sounds most like'], ['q6', 'Exit Plan: people come for'],
           ['q7', 'Exit Plan: worth it if']],
  exit: [['goal_month', 'Exit Plan: goal per month'], ['price', 'Exit Plan: offer price'], ['buyers_month', 'Exit Plan: people per month']]
};
var NOTE = 'Exit Plan: survey note';
var TAG = { survey: 'ep_survey_done', exit: 'ep_exit_number' };
var cache = { keys: null, tags: {} };   // kept while the function stays warm

function note(a, page) {
  var d = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'America/New_York' });
  var parts = [['live', a.q1], ['subscribers', a.q2], ['bought before', a.q3], ['work', a.q4], ['sounds like', a.q5],
               ['comes to them for', a.q6], ['worth it if they', a.q7]].filter(function (p) { return p[1] });
  return (d + ', ' + (page === 'vip' ? 'VIP' : 'free') + ' page. ' + parts.map(function (p) { return p[0] + ': ' + p[1] }).join('; ') + '.').slice(0, 900);
}

async function toKit(kind, email, a, page) {
  var k = process.env.KIT_API_KEY;
  if (!k || !email) return 'skipped';
  async function call(method, path, body) {
    var r = await fetch(KIT + path, {
      method: method,
      headers: { 'X-Kit-Api-Key': k, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!r.ok) throw new Error('kit_' + method + '_' + r.status);
    return r.status === 204 ? {} : r.json();
  }
  var found = await call('GET', '/subscribers?status=all&email_address=' + encodeURIComponent(email));
  var sub = found.subscribers && found.subscribers[0];
  if (!sub) return 'not_in_kit';
  var labels = FIELDS[kind].map(function (f) { return f[1] }).concat(kind === 'survey' ? [NOTE] : []);
  if (!cache.keys) {
    var list = await call('GET', '/custom_fields?per_page=1000'), keys = {};
    (list.custom_fields || []).forEach(function (f) { keys[f.label] = f.key });
    cache.keys = keys;
  }
  for (var i = 0; i < labels.length; i++) {
    if (!cache.keys[labels[i]]) { var cf = await call('POST', '/custom_fields', { label: labels[i] }); cache.keys[labels[i]] = cf.custom_field.key }
  }
  var fields = {};
  FIELDS[kind].forEach(function (f) { var v = a[f[0]]; if (v != null && v !== '') fields[cache.keys[f[1]]] = String(v).slice(0, 300) });
  if (kind === 'survey') fields[cache.keys[NOTE]] = note(a, page);
  await call('PUT', '/subscribers/' + sub.id, { email_address: sub.email_address, fields: fields });
  var tn = TAG[kind];
  if (!cache.tags[tn]) { var t = await call('POST', '/tags', { name: tn }); cache.tags[tn] = t.tag.id }
  await call('POST', '/tags/' + cache.tags[tn] + '/subscribers/' + sub.id, {});
  return 'ok';
}

// one cell: no line breaks, a sane length, and never a formula (a value starting with = + - @ is stored as text)
function cell(v, n) {
  var s = String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').trim().slice(0, n || 300);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  var origin = req.headers.origin || '';
  if (origin && !ORIGINS.test(origin)) return res.status(403).json({ ok: false });
  var url = process.env.SURVEY_SHEET_URL, key = process.env.SURVEY_SHEET_KEY;
  if ((!url || !key) && !process.env.KIT_API_KEY) return res.status(503).json({ ok: false, error: 'not_configured' });

  var b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b) } catch (e) { b = {} } }
  var kind = KEYS[b.kind] ? b.kind : null;
  if (!kind) return res.status(400).json({ ok: false, error: 'kind' });
  var a = b.answers && typeof b.answers === 'object' ? b.answers : {};
  var email = String(b.email || '').trim().toLowerCase();
  if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254)) email = '';

  var row = {
    kind: kind,
    page: cell(b.page, 10),
    first: cell(b.first, 60),
    email: cell(email, 254),
    ref: cell(b.ref, 80),
    tz: cell(b.tz, 60)
  };
  KEYS[kind].forEach(function (k) { row[k] = cell(a[k], 300) });

  var plain = {};   // the answers as they are, for Kit (the Sheet gets the formula-safe cells above)
  KEYS[kind].forEach(function (k) { if (a[k] != null) plain[k] = String(a[k]).replace(/[\r\n\t]+/g, ' ').trim().slice(0, 300) });
  var sheet = (url && key) ? fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: key, row: row }),
    redirect: 'follow'
  }).then(function (r) {
    if (!r.ok) return 'sheet_' + r.status;
    // the script answers 200 even when it refuses a row: read what it said ({ok:true}, or {ok:false, error:"key"})
    return r.text().then(function (t) {
      try { var j = JSON.parse(t); return j && j.ok ? 'ok' : 'sheet_' + ((j && j.error) || 'refused') } catch (e) { return 'sheet_not_json' }
    });
  }, function () { return 'sheet_unreachable' }) : Promise.resolve('skipped');
  var kit = toKit(kind, email, plain, row.page).catch(function (e) { return String(e.message || e) });
  var out = await Promise.all([sheet, kit]);
  var ok = out[0] === 'ok' || out[1] === 'ok' || out[1] === 'not_in_kit';
  return res.status(ok ? 200 : 502).json({ ok: ok, sheet: out[0], kit: out[1] });
};
