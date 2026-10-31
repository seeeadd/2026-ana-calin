const test = require('node:test');
const assert = require('node:assert/strict');
const { submit } = require('../assets/registration-submit.js');

test('confirmed registrations preserve the API result and encoded form fields', async () => {
  const data = new URLSearchParams({ first_name: 'Preview', email_address: 'preview@example.test', 'fields[situation]': 'self' });
  let called;
  const result = await submit(async (...args) => {
    called = args;
    return { ok: true, json: async () => ({ ok: true, again: true }) };
  }, '/api/ana-register', data);
  assert.deepEqual(result, { ok: true, again: true });
  assert.equal(called[0], '/api/ana-register');
  assert.equal(called[1].method, 'POST');
  assert.equal(called[1].body.get('fields[situation]'), 'self');
});
for (const [name, fetcher] of [
  ['HTTP error', async () => ({ ok: false })],
  ['unconfirmed response', async () => ({ ok: true, json: async () => ({ ok: false }) })],
  ['HTML response', async () => ({ ok: true, json: async () => { throw new SyntaxError('Unexpected HTML'); } })],
  ['network failure', async () => { throw new TypeError('Failed to fetch'); }]
]) test(`${name} rejects instead of allowing a success redirect`, async () => {
  await assert.rejects(submit(fetcher, '/api/ana-register', new URLSearchParams()));
});
