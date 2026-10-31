# 2026-ana-calin

Ana Calin's pages for The Exit Plan, her free 3-day live workshop (Tue Nov 17 to Thu Nov 19, 2026, 12:00 pm New York),
and The Exit Lab, the program she offers after it. Plain HTML, CSS and JavaScript, no build step. Moved here on Oct 30,
2026 from `seeeadd/2026-or-afterharvest` (folder `ana-calin/workshop/`), where the same pages still run.

## The pages

The project `2026-ana-calin` serves them on https://exitplan.howwegrowtoday.com. Below, the same paths on the project address:

| page | link |
|---|---|
| Registration page | https://2026-ana-calin.vercel.app/ |
| VIP page | https://2026-ana-calin.vercel.app/vip/ |
| VIP, headline A preview | https://2026-ana-calin.vercel.app/vip/?h=A |
| VIP, headline B preview | https://2026-ana-calin.vercel.app/vip/?h=B |
| Registered confirmation | https://2026-ana-calin.vercel.app/confirmed/ |
| Registered confirmation, with a name | https://2026-ana-calin.vercel.app/confirmed/?first=Theia |
| VIP confirmation | https://2026-ana-calin.vercel.app/vip-confirmed/ |
| VIP confirmation, with a name | https://2026-ana-calin.vercel.app/vip-confirmed/?first=Theia |
| Offer, short | https://2026-ana-calin.vercel.app/join/ |
| Offer, long | https://2026-ana-calin.vercel.app/program/ |
| Exit number calculator (after the 7 quick questions) | https://2026-ana-calin.vercel.app/exit-number/ |
| Program welcome (after paying for the program) | https://2026-ana-calin.vercel.app/welcome/ |

Add `?now=2026-11-18T17:00:00Z` (any date and time) to see a page as it looks at that moment: countdowns, doors open
or closed, the VIP deadline.

## Setting up Vercel

1. Vercel, Add New, Project, import `seeeadd/2026-ana-calin`. Framework preset: Other. No build command, no output
   directory.
2. Settings, Environment Variables, ticked for Production: `KIT_API_KEY` (a Kit v4 API key), `KIT_SEQUENCE_ID` (the
   "EP · Confirmation" sequence) and `KIT_TAG_ID` (the id of the `ep_registered` tag). The sign-up popup posts to
   `api/ana-register.js`, which adds the person to Kit through the API; without `KIT_API_KEY` it falls back to Kit's
   own form address, which Kit's bot check can park. `KIT_SEQUENCE_ID` puts someone who signs up again back into the
   confirmation sequence. `KIT_TAG_ID` feeds the live sign-up count and first names (`api/ana-feed.js`). A changed
   variable only reaches the site on the next deployment.
3. The survey, the exit numbers and the sales go to a Google Sheet: set it up with `tools/survey-sheet.gs` (the steps are at
   its top), then add `SURVEY_SHEET_URL` and `SURVEY_SHEET_KEY`.
4. After a payment, `api/stripe-webhook.js` tags the buyer in Kit and adds a row to the sheet. Variables: `STRIPE_SECRET_KEY`
   (restricted, read access to Events and Checkout Sessions), `KIT_TAG_VIP`, `KIT_TAG_LAB`, optional `KIT_TAG_LAB_PLAN`. In
   Stripe, Developers > Webhooks: `https://exitplan.howwegrowtoday.com/api/stripe-webhook`, events
   `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
5. Each Stripe payment link, "After payment" > "Don't show confirmation page" > redirect to:
   VIP `https://exitplan.howwegrowtoday.com/vip-confirmed/`, pay in full `https://exitplan.howwegrowtoday.com/welcome/`,
   2 payments `https://exitplan.howwegrowtoday.com/welcome/?plan=2`. Turn on "Allow promotion codes" for the coupons.
6. If the project gets another name or a custom domain, change the address in these four places, which need a full
   link: `index.html` (the `og:image` share picture) and the three calendar files in `assets/*.ics` (the sheet link).

`vercel.json` keeps the trailing slash on every page (`/vip/`, not `/vip`); the pages' relative links depend on it.

## Settings inside the pages

Each page has a small settings block near the end of its HTML (Kit form ids, video links, checkout links, the WhatsApp
link). The offer pages share `assets/offer-settings.js`. An empty value hides that piece or runs it as a demo that
sends nothing.
