# 2026-ana-calin

Ana Calin's pages for The Exit Plan, her free 3-day live workshop (Tue Nov 17 to Thu Nov 19, 2026, 12:00 pm New York),
and The Exit Lab, the program she offers after it. Plain HTML, CSS and JavaScript, no build step. Moved here on Oct 30,
2026 from `seeeadd/2026-or-afterharvest` (folder `ana-calin/workshop/`), where the same pages still run.

## The pages

Once this repo is imported into Vercel as the project `2026-ana-calin`, the links are:

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

Add `?now=2026-11-18T17:00:00Z` (any date and time) to see a page as it looks at that moment: countdowns, doors open
or closed, the VIP deadline.

## Setting up Vercel

1. Vercel, Add New, Project, import `seeeadd/2026-ana-calin`. Framework preset: Other. No build command, no output
   directory.
2. Settings, Environment Variables: `KIT_API_KEY` (a Kit v4 API key) and `KIT_TAG_ID` (the id of the `ep_registered`
   tag). These feed the live sign-up count and first names on the registration page (`api/ana-feed.js`). Without them
   the page simply shows no count and no names.
3. If the project gets another name or a custom domain, change the address in these four places, which need a full
   link: `index.html` (the `og:image` share picture) and the three calendar files in `assets/*.ics` (the sheet link).

`vercel.json` keeps the trailing slash on every page (`/vip/`, not `/vip`); the pages' relative links depend on it.

## Settings inside the pages

Each page has a small settings block near the end of its HTML (Kit form ids, video links, checkout links, the WhatsApp
link). The offer pages share `assets/offer-settings.js`. An empty value hides that piece or runs it as a demo that
sends nothing.
