# Waitlist test scripts

Run from the repo root. Start a server first: `python3 -m http.server 8767 &` and kill it afterwards.
Each browser script takes an output folder as its first argument (screenshots go there): `node tools/waitlist-tests/fit.js /tmp/out`.

- `fit.js`: page height and sideways scroll at laptop and desktop sizes, plus the thank-you state; phones and tablets listed too.
- `phones.js`: iPhone, Android, small phone, iPad portrait and landscape, before and after sign-up (API mocked).
- `tzs.js`, `cities.js`: the schedule in many real time zones (browser `timezoneId`).
- `nudge.js`: the pulsing next-field sequence and reduced motion.
- `flow.js`: sign-up, the question, permission default unchecked, registration-page prefill.
- `apitest.js`: `api/ana-waitlist.js` with a mocked Kit and sheet (sign-up, business question with permission, throwaway
  domain, honeypot, wrong origin). Run with `node tools/waitlist-tests/apitest.js`.

Playwright and Chromium are pre-installed in the cloud sessions. Paths inside some scripts point at the old scratch folder;
adjust the screenshot path argument if a script writes somewhere unexpected.
