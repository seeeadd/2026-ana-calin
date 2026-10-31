// The 7 quick questions (confirmation pages) and the exit number (/exit-number/) post here, and this adds one row to
// Ana's Google Sheet through a small Apps Script web app (tools/survey-sheet.gs, set-up steps at its top).
// Needs SURVEY_SHEET_URL (the web app's /exec address) and SURVEY_SHEET_KEY (the same secret word as KEY in the
// script), both Vercel environment variables. Without them the pages still work; nothing is stored.
var ORIGINS = /^https:\/\/(2026-ana-calin[a-z0-9-]*\.vercel\.app|exitplan\.howwegrowtoday\.com)$/;
var KEYS = {
  survey: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'],
  exit: ['goal_month', 'price', 'buyers_month', 'buyers_year', 'sub_price', 'subs_needed', 'free_needed']
};

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
  if (!url || !key) return res.status(503).json({ ok: false, error: 'not_configured' });

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

  try {
    var r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: key, row: row }),
      redirect: 'follow'
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'sheet_' + r.status });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'sheet_unreachable' });
  }
};
