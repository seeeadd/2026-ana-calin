// Confirmation-page WhatsApp clicks. Adds only ep_wa_click to an existing, active Kit subscriber.
// Uses the same server-only KIT_API_KEY as registration. A click is not proof of group membership.
var ORIGINS = /^https:\/\/(2026-ana-calin[a-z0-9-]*\.vercel\.app|exitplan\.howwegrowtoday\.com)$/;
var tagId;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  if (!ORIGINS.test(req.headers.origin || '')) return res.status(403).json({ ok: false });
  var b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b) } catch (e) { b = null } }
  var email = String((b && b.email) || '').trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'email' });
  }
  var key = process.env.KIT_API_KEY;
  if (!key) return res.status(503).json({ ok: false, error: 'not_configured' });

  var controller = new AbortController();
  var timeout = setTimeout(function () { controller.abort() }, 8000);
  async function kit(method, path, body) {
    var r = await fetch('https://api.kit.com/v4' + path, {
      method: method,
      headers: { 'X-Kit-Api-Key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal
    });
    if (!r.ok) throw new Error('kit_request');
    return r.status === 204 ? {} : r.json();
  }
  try {
    var found = await kit('GET', '/subscribers?status=all&email_address=' + encodeURIComponent(email));
    var sub = (found.subscribers || []).find(function (s) {
      return String(s.email_address || '').toLowerCase() === email && s.state === 'active';
    });
    // Never create subscribers, reactivate unsubscribed addresses, or enroll anyone in a sequence.
    if (!sub) return res.status(200).json({ ok: true, tagged: false });
    if (!tagId) {
      var tag = await kit('POST', '/tags', { name: 'ep_wa_click' });
      if (!tag.tag || !tag.tag.id) throw new Error('kit_tag');
      tagId = tag.tag.id;
    }
    await kit('POST', '/tags/' + encodeURIComponent(tagId) + '/subscribers/' + encodeURIComponent(sub.id), {});
    return res.status(200).json({ ok: true, tagged: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'kit_unreachable' });
  } finally {
    clearTimeout(timeout);
  }
};
