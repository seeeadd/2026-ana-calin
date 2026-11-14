const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');

function api(fetcher, key = 'test-only-key') {
  const sandbox = { module: { exports: {} }, process: { env: { KIT_API_KEY: key } }, fetch: fetcher,
    AbortController, setTimeout, clearTimeout };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'api/ana-whatsapp.js'), 'utf8'), sandbox);
  return async (body, extra = {}) => {
    const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; },
      status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; } };
    await sandbox.module.exports({ method: 'POST', headers: { origin: 'https://exitplan.howwegrowtoday.com' }, body, ...extra }, res);
    return res;
  };
}
const response = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });

test('server tags the exact active subscriber and preserves plus-address identity', async () => {
  const calls = [];
  const handler = api(async (url, opts) => {
    calls.push({ url, opts });
    if (opts.method === 'GET') return response({ subscribers: [{ id: 12, email_address: 'person+test@example.com', state: 'active' }] });
    if (url.endsWith('/tags')) return response({ tag: { id: 34 } });
    return response({});
  });
  const out = await handler({ email: ' Person+Test@example.com ' });
  assert.equal(out.code, 200);
  assert.equal(out.body.tagged, true);
  assert.equal(calls[0].url, 'https://api.kit.com/v4/subscribers?status=all&email_address=person%2Btest%40example.com');
  assert.equal(JSON.parse(calls[1].opts.body).name, 'ep_wa_click');
  assert.equal(calls[2].url, 'https://api.kit.com/v4/tags/34/subscribers/12');
  assert.equal(out.headers['Cache-Control'], 'no-store');
  assert.equal(JSON.stringify(out.body).includes('test-only-key'), false);
  await handler({ email: 'person+test@example.com' });
  assert.equal(calls.filter(c => c.url.endsWith('/tags')).length, 1);
  assert.equal(calls.some(c => /\/forms\/|\/sequences\//.test(c.url)), false);
});

test('server refuses bad input, foreign origins, reads, and missing configuration', async () => {
  let calls = 0;
  const handler = api(async () => { calls++; throw new Error('must not run'); });
  assert.equal((await handler({ email: 'bad' })).code, 400);
  assert.equal((await handler('{broken')).code, 400);
  assert.equal((await handler(null)).code, 400);
  assert.equal((await handler({ email: 'test@example.com' }, { method: 'GET' })).code, 405);
  assert.equal((await handler({ email: 'test@example.com' }, { headers: { origin: 'https://other.example' } })).code, 403);
  assert.equal((await handler({ email: 'test@example.com' }, { headers: {} })).code, 403);
  assert.equal((await api(async () => {}, '')({ email: 'test@example.com' })).code, 503);
  assert.equal(calls, 0);
});

for (const [label, subscribers] of [
  ['unknown', []], ['unsubscribed', [{ id: 1, email_address: 'test@example.com', state: 'cancelled' }]],
  ['different subscriber', [{ id: 2, email_address: 'someone@example.com', state: 'active' }]]
]) test('server does not create or change an ' + label, async () => {
  let count = 0;
  const result = await api(async () => { count++; return response({ subscribers }); })({ email: 'test@example.com' });
  assert.equal(result.code, 200);
  assert.equal(result.body.tagged, false);
  assert.equal(count, 1);
});

test('Kit failure stays a failure, and a later click can retry', async () => {
  const handler = api(async () => response({}, 429));
  const result = await handler({ email: 'test@example.com' });
  assert.equal(result.code, 502);
  assert.equal(result.body.ok, false);
});

function page({ email = '', search = '', fetcher, storageFails = false } = {}) {
  const listeners = [], calls = [], retries = [];
  const sandbox = {
    location: { search }, URLSearchParams,
    sessionStorage: { getItem() { if (storageFails) throw new Error('blocked'); return email ? JSON.stringify({ email }) : null; } },
    localStorage: { getItem() { return null; } },
    document: { querySelectorAll(selector) {
      assert.equal(selector, 'a[data-track="action_whatsapp"]');
      return [0, 1, 2, 3].map(() => ({ getAttribute: () => 'https://exitplan.howwegrowtoday.com/whatsapp/',
        addEventListener(type, callback) { assert.equal(type, 'click'); listeners.push(callback); } }));
    } },
    fetch(url, options) { calls.push({ url, options }); return fetcher ? fetcher(url, options) : Promise.resolve(response({ ok: true, tagged: true })); },
    setTimeout(callback) { retries.push(callback); }
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/whatsapp-tracking.js'), 'utf8'), sandbox);
  return { calls, listeners, retries };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('page records only an actual click, never blocks navigation, and deduplicates all buttons', async () => {
  const p = page({ email: 'person+test@example.com' });
  assert.equal(p.calls.length, 0);
  p.listeners[0](); p.listeners[1]();
  await settle(); p.listeners[2]();
  assert.equal(p.calls.length, 1);
  assert.equal(p.calls[0].url, '/api/ana-whatsapp/');
  assert.equal(p.calls[0].options.keepalive, true);
  assert.equal(JSON.parse(p.calls[0].options.body).email, 'person+test@example.com');
});

test('explicit page identity wins over an older browser signup', async () => {
  const p = page({ email: 'old@example.com', search: '?email=current%2Btest%40example.com' });
  p.listeners[0](); await settle();
  assert.equal(JSON.parse(p.calls[0].options.body).email, 'current+test@example.com');
});

test('anonymous visits and blocked storage leave WhatsApp usable without guessing identity', () => {
  for (const p of [page(), page({ email: 'bad' }), page({ storageFails: true })]) {
    assert.doesNotThrow(() => p.listeners[0]());
    assert.equal(p.calls.length, 0);
  }
});

test('failed requests retry and are only marked complete after Kit acknowledges', async () => {
  let attempts = 0;
  const p = page({ email: 'test@example.com', fetcher: () => {
    attempts++;
    return attempts === 1 ? Promise.reject(new Error('offline')) : Promise.resolve(response({ ok: true, tagged: true }));
  } });
  p.listeners[0](); await settle();
  assert.equal(p.retries.length, 1);
  p.retries.shift()(); await settle();
  p.listeners[0](); await settle();
  assert.equal(attempts, 2);
});

test('both confirmation pages load the tracker after settings and links are initialized', () => {
  for (const name of ['confirmed', 'vip-confirmed']) {
    const html = fs.readFileSync(path.join(root, name, 'index.html'), 'utf8');
    assert.equal(html.split('assets/whatsapp-tracking.js').length - 1, 1);
    assert.ok(html.indexOf('assets/whatsapp-tracking.js') > html.indexOf('assets/conf.js'));
  }
});
