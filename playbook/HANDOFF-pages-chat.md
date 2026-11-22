# Handoff: the pages chat (Nov 9 to Nov 22, 2026)

Read this first in a fresh chat about Ana's pages, then `CLAUDE.md`, then the playbook repo
(`seeeadd/afterharvest-design-playbook`: `README.md`, `SOP.md`, `pages/page-sop.md`, `clients/ana-calin.md`, the newest
lines of `feedback-log.md`). The two older handoffs still hold: `HANDOFF-main-chat.md` (Oct 25 to Nov 8: pages, repos,
waitlist, Fladlien, mistakes) and `HANDOFF-video-chat.md` (Nov 4 to 9: the video kit). Every message Sean typed in this
chat, in order, is in `playbook/transcripts/pages-chat-digest-2026-11-09_to_11-22.md`. The dated record of every change
is `playbook/feedback-log.md` (lines from 2026-11-09 on).

This chat took the four main pages (registration, VIP, free confirmation, VIP confirmation) from "desktop finished" to
"new copy, VIP world, made for phones and iPads, real video stills, loading states", and found the Kit outage of Nov 17.

## 1. How to work with Sean (what this chat confirmed)

- **He sends a screenshot and one line.** Find the exact element in code, fix it, screenshot it at every width, say in two
  lines what changed and where. He types by voice: read for intent ("maake H kapital on heres" = capital H in "Here's").
- **"Publish" is per change.** A publish covers only what was on the branch when he said it. A new change needs a new
  "Publish" (the auto-mode guard blocks pushes to main otherwise). He sometimes gives it in advance ("Before you publish,
  you can publish" = go ahead and publish once fixed): then publish, and say so.
- **Tell him everything a publish carries.** Other sessions push to the same branch (see section 2). Before pushing
  to main, list `origin/main..HEAD` and name anything that is not yours.
- **He asks for your judgement and wants it straight.** Asked "is the form on top of the video a good idea?", "rows or
  columns?", "keep the fake deadline to motivate them?": give a clear answer with the reason. He accepted "no fake
  deadline" and "rows, not columns" and "a full-screen button, not auto full screen".
- **Options when he asks for options.** "Can you give me the choices for that?" → six first-person lines; he picked one.
- **When he says "make it better" twice, change the idea, not the polish** (the Offer Flow logo took four passes: sticker,
  her sunflower, then painted from scratch in the studio; see `pages/evolution-ana.md`).
- **Messages he forwards to Ana:** short, plain, straight to what happened and what she must do. No "quick heads up", no
  warm-up, no long explanation. If he says "simpler", cut it to three sentences. Written as from Sean.
- **He worries about the audience, not the tech.** "moms on older iPhones", "a 40-year-old's eye", "people might think this
  shit is broken": treat every one of those as a requirement for every page, not only the one he is looking at.

## 2. Repos, branches, other sessions

- Site: `seeeadd/2026-ana-calin`, local `~/AnaVideo/2026-ana-calin`, work branch `claude/quirky-franklin-etidvi`,
  live https://exitplan.howwegrowtoday.com (Vercel, static + `api/`).
- Playbook: `seeeadd/afterharvest-design-playbook`, local `~/AnaVideo/afterharvest-design-playbook`, pushed to `main`
  directly after every logged round (pull first).
- Library: `seeeadd/ah-launch-library` (private), local clone `~/VideoEdit/ref/ah-launch-library` is a sparse, blobless
  clone usually on another chat's branch. Its rules: branch + pull request, never push its `main`. Use a separate
  `git worktree` and `git sparse-checkout add clients/ana-calin` there; don't touch the other chat's branch or files.
- **Other sessions write to the same work branch and publish to main.** In this chat: "Align replay access and calendar
  preparation with current workshop" (95b551e), "Track confirmation-page WhatsApp clicks in Kit" (4752a1f,
  `api/ana-whatsapp.js`, `assets/whatsapp-tracking.js`), and the "remove quitting language" copy pass (9557c11,
  8e8f77c). Always `git fetch` and rebase before pushing; never undo their work.
- **`join/index.html` has uncommitted edits from another session** (Round 1 moved to January: doors close Mon Dec 21,
  Day 1 Mon Jan 4, launch Feb 1 to 3). They are not yours: never commit or discard them. To pull or rebase:
  `git stash -q -- join/index.html && git pull --rebase ... && git stash pop -q` (if the pop conflicts, keep both sides).
- Commit trailer: `Co-Authored-By: Claude <noreply@anthropic.com>`, **no model name** (CLAUDE.md: "No model names in
  commits"; this chat's commits wrongly carried one until Nov 22). No PRs in the site repo unless asked.

## 3. The site at Nov 22 (what each page is now)

### Registration `/` (`index.html`, `assets/reg-mobile.css`, `assets/registration-theme.css`)
- **Headline (Ana's last word, Nov 14):** small proof line "My Newsletter Business Has Made $1.4M." then
  "If I Wanted to *5x My Salary* in 2027, Here's What I'd Build First." Markup is one flowing `.h1b.h1f` span, not fixed
  lines: `text-wrap: balance`, `max-width: 7.2em`, "5x My Salary" and "in 2027," kept whole, "Build&nbsp;First." Every
  screen gets the same lockup (If I Wanted to / 5x My Salary / in 2027, Here's / What I'd Build First.), font about 14%
  bigger than before so the last line fills the column (laptop `min(15.2cqi,95px)`, 641 to 767 px `min(12.4vw,88px)`,
  phones `min(13.1vw,64px)`).
- Headline history (do not reuse the old ones): "How to Build the Income That Lets You Leave Your Job in 2027" →
  "Here's How I'd Build One to Replace My Salary in 2027" (Nov 9) → "...a Newsletter Business to Replace My Salary in 2027"
  (Nov 12) → "If I Wanted to Earn 5x My Salary in 2027, Here's the Newsletter Business I'd Build" (Nov 14) → without "Earn"
  (Sean: keep "to") → Ana's "...Here's What I'd Build First" (Nov 14, "this makes people curious").
- **Hero copy:** the sans lead ("You've spent years getting good at something... alongside the work you already do."),
  then "I'm Ana Calin. For **three (3) free live sessions**, I'll walk you through the exact system I used to go from
  **12 subscribers to a business that crossed $1M** + the step I'd move earlier now that AI has changed the work.", then a
  boxed line: "**Register and answer seven quick questions to get your Exit Number calculator.** Try different prices and
  see how many sales your monthly income goal would take." with "Exit Number calculator" in a soft blue highlighter
  (`mark.hbl`, #1b63a9 at 20%, lower half).
- **Link preview, meta and og must match the headline** (Ana noticed an old preview). Current image
  `img/share-exit-plan-first-h-20261114.jpg`, made from `tools/share-preview/index.html` (render `.art` at 1200x630 with
  Playwright, JPEG q88, new file name every time so apps refetch). Descriptions: "If she wanted to 5x her salary in 2027,
  Here's what she'd build first."
- **Offer Flow section:** painted logo (idea bulb, "Ana's" in her pink handwriting, "✦ FREE AI TOOL" pill), and the app
  window now plays **Ana's real screen recording** (her GIF from monetisesubstack.com/ana-ai-offer-flow, 11 MB, turned into
  `img/offerflow/of-demo.mp4` 0.9 MB + `of-demo.jpg` still of the results; `assets/ofv.js` loads it only when near, pauses
  off screen, keeps the still under reduced motion). The window footer "Opens after you register · **Save my offer
  stack**" is a real button that opens the sign-up popup (readable minimum size, 44px tap area, full width on phones).
- **Sticky bars:** the old A/B cookie `ana_sticky` hid both bars from half of visitors (Sean was in "off"); it is forced
  on (`var variant = 'on'`, the hidden `sticky_variant` field always "on"). Phones: slim top bar `.pbar` (Ana, dates in
  their own city, a "Starts in" pill) slides in after the headline; bottom bar is one 50px full-width button at 17px.
  iPad portrait (768 to 900) uses the laptop header, no bottom bar.
- **Phone and iPad hero order:** headline, promise line, video, who Ana is, the calculator line, then the form.

### VIP `/vip/` (`vip/index.html`, `assets/vip-theme.css`, `assets/vip-mobile.css`)
- A different world from registration on purpose: Greek shutter blue painted as the Aegean (pre-rendered WebP sea tiles,
  never runtime SVG filters), cream headline with sun-yellow italic, the pink door kept, pink otherwise only in Ana's
  signature. The free-vs-VIP table is the second section. Header step "Your VIP upgrade".
- Headline: "Keep the workshop for life. *Get **my** help applying it to your business.*" ("my" bold with a thin pencil
  underline). Order card: "Make me *a VIP.*" with a small tilted crown on the V (Sean picked it from six first-person lines).
- **VIP closes when Day 2 ends: Wed Dec 9, 1:30 pm New York**, for real; the page closes itself at that minute (test with
  `?now=2026-12-09T18:31:00Z`). Never an earlier fake deadline.
- Phones: the header shows "Dec 9 to 11 · 1:00 am / Your time in <city>" with a pin; the week shows local start times.
- Watch prompt is a compact one-line chip ("▶ Watch this video first. ↓"); on sales pages the prompt stays small.

### Free confirmation `/confirmed/` and VIP confirmation `/vip-confirmed/` (`assets/conf.js`, `conf-reg.css`, `conf-vip.css`, `conf-mobile.css`)
- Free one lives in the registration world (yellow shutters, village footer); VIP one in the VIP world (sea, crown).
- Steps as **rows**: 1 WhatsApp (VIP: "Join the VIP ONLY WhatsApp group"), 2 **calendar** ("Most important", red, with
  the reason "Realistically, if it's not on your calendar, you won't come."), 3 email (move it out of Spam/Promotions,
  Gmail demo), 4 the seven questions that unlock the Exit Number calculator (iPad mock, brick wall knocks out per answer,
  "Get your calculator" in the sticky header). Calendar comes before email (Sean agreed Nov 10).
- Every date and time shows in the visitor's own city first with a pink pin, New York small underneath.
- "Watch this video first. I walk you through every step below." pill above the video; the old breakout videos are gone.
- Offer Flow card with the logo and the same real screen recording; "Open Ana's Offer Flow" opens
  https://www.monetisesubstack.com/ana-ai-offer-flow in a new tab (`OFFERFLOW_URL` in both pages' settings).
- The VIP review form ("What would you like me to look at?") sends to the Google Sheet tab "VIP review".

### Waitlist `/waitlist/`
Headline matches registration: "My Newsletter Business Has Already Made $1.4M." / "If I Wanted to *5x My Salary*
in 2027, Here's What I'd Build&nbsp;First." ("in 2027," nowrap).

### Untouched in this chat
`/exit-number/`, `/program/`, `/join/`, `/welcome/` (except other sessions' copy and date edits).

## 4. Shared systems built or changed in this chat

- **One video player for all pages: `assets/wistia-vsl.js` (now `?v=11`).** `WVSL({box, scr, frame, desktop, phone,
  poster, phoneStill, pill, previewSec, onPhoneEnd})`.
  - Laptop: an 8 s silent preview loops; the first press restarts her from the top with sound; after that Wistia's own
    pause and play.
  - Phones (≤640): the portrait edit inside a realistic phone frame (width `min(86vw, 370px, fits the screen height)`),
    a big "Watch full screen" button under it (requestFullscreen, then iPhone's webkitEnterFullscreen).
  - `poster` + `phoneStill:true`: phones show a chosen smiling still and do not autoplay (Wistia starts on its own, the
    script pauses it); a tap starts her with sound; at the end the still comes back.
  - `pill`: how far down the "Tap for sound" pill sits on phones, set per video so it never covers her face.
  - On phones the pill's speaker icon is a round white play button with a pink triangle and a soft pulse (Sean: "people
    might not think it's a video"); laptop and iPad keep the speaker (their video moves).
  - Old browsers (no custom elements) get Wistia's plain iframe.

  | page | desktop | phone | phone still | pill |
  |---|---|---|---|---|
  | registration | 995puecipz | z5mv5t5sf5 | `img/vsl/z5mv5t5sf5-smile.jpg` (152.5 s) | 71% |
  | VIP | qkrlqlwwcr | h1acvjpuks | `h1acvjpuks-smile.jpg` (29.0 s) | 65% |
  | both confirmations | 7fe006bo2z | vy4l2af396 | `vy4l2af396-smile.jpg` (61.0 s) | 82% |

  Stills are cut from Wistia's mp4 (the asset URLs come from `fast.wistia.com/embed/medias/<id>.json`) with ffmpeg at
  q3. Choose them by looking at a contact sheet (every 2 s), then a 0.25 s strip around the best moment: smile, eyes
  open, mouth closed or soft. Ana asked for this ("stop the frame on a scene in which I don't look this drunk").
- **Loading states: `assets/busy.js` (`AnaBusy.on(btn, text, laterText)` / `AnaBusy.off(btn)`, or `data-busy` on a
  link).** Turning ring + "Saving your seat…", after 3.5 s "Taking you to your next step…"; the button keeps its width,
  is disabled, screen readers hear it, and the browser's Back (from Stripe) resets it. On: the registration form, both
  waitlist forms, every VIP buy button ("Opening secure checkout…", header "Opening…"), the VIP no-thanks path ("One
  moment…"), the VIP review form ("Sending…"). Not needed: the Exit Number forms (instant), the survey (saves in the
  background). Any new form or redirecting button gets it.
- **Mobile CSS files** loaded last on each page: `assets/reg-mobile.css`, `assets/vip-mobile.css`,
  `assets/conf-mobile.css`. CSS links are cache-busted with `?v=<first 12 hex of sha256>`; recompute after every edit.
  JS files use a plain number (`wistia-vsl.js?v=11`, `conf.js?v=10`, `busy.js?v=1`); bump it after every edit.
- **Local times:** small scripts rewrite dates into the visitor's city; New York-only lines are protected. The test
  machine is in Manila, so local screenshots show Manila.

## 5. Kit, the Sheet and the APIs

- Sign-up: popup → `api/ana-register.js` → Kit v4 API (`KIT_API_KEY`) → form `10120079` (`KIT_REG_FORM_ID`), plus a
  row in the Google Sheet tab "Registrants" with a **Kit** column ("ok" or "error <status>"). If the API fails the page
  falls back to Kit's public form, which Kit's bot check usually parks: treat those people as not in Kit.
- Everything Kit-related uses the same key: waitlist (`api/ana-waitlist.js`), survey and exit number
  (`api/ana-survey.js`), VIP and program tags (`api/stripe-webhook.js`), the live counter (`api/ana-feed.js`).
- **Nov 17 outage:** from about 22:00 every sign-up logged "error 401". Cause: Ana's Kit account ("Substackulous") was
  unpaid (card failed three times), so Kit blocked the API. Ana paid; checked working Nov 21 (263 on the registered tag).
  **The "error 401" rows from Nov 17 on still have to be added to Kit by Sean or Ana** (CSV import into the registration
  form, or by hand); never add or email leads from here.
- **Read-only health check** (adds nothing): `curl -sL "https://exitplan.howwegrowtoday.com/api/ana-feed/?cb=$RANDOM"`.
  `count` is a number when Kit accepts the key, `null` when it refuses. Note the trailing slash (without it: 308).
- Sheet: `tools/survey-sheet.gs` (tabs Registrants, Survey, Exit numbers, Sales, Exit Plan Waitlist, VIP review,
  Summary). After changing the script: Deploy > Manage deployments > edit > New version.
- Env vars (names only): `KIT_API_KEY`, `KIT_REG_FORM_ID`, `KIT_SEQUENCE_ID`, `KIT_TAG_ID`, `KIT_TAG_VIP`,
  `KIT_TAG_LAB_FULL`, `KIT_TAG_LAB_2PAY`, `KIT_WAITLIST_FORM_ID`, `STRIPE_SECRET_KEY`, `STRIPE_PLINK_VIP`,
  `STRIPE_PLINK_FULL`, `STRIPE_PLINK_PLAN`, `SURVEY_SHEET_URL`, `SURVEY_SHEET_KEY`. A changed variable needs a redeploy.

## 6. Timeline of this chat

- **Nov 9:** VIP page rebuilt in its own blue world (sea, pink door, breathing room, "simplify means cut lines, not
  words"), spam demo with a "Watch how to do it" window, the table as section 2, "Make me a VIP" + crown. Both
  confirmation pages rebuilt (rows, local times, iPad calculator, painted pieces, push-to-act emphasis). VIP deadline set
  to the real end of Day 2. Registration rewritten from Sean's new copy doc (kept what the doc left out: the guests'
  descriptions, the wins line, older reviews). Survey "Something else" boxes. A survey bug from the rebuild (missing brick
  wall ball) found and fixed.
- **Nov 10:** registration round 2 (balanced headline, Offer Flow as a real app, painted logo after four passes), VIP and
  free confirmation new copy, VIP review form to the Sheet, local-time date cards with pins, "Watch this video first",
  calendar before email, VIP "my" underline, VIP tap-for-sound like the others, compact watch chip.
- **Nov 12:** the mobile and iPad pass (section 7), new headline and hero copy, the $1.4M line kept above the headline,
  the sticky A/B test ended.
- **Nov 13:** blue highlight on "Exit Number calculator". Another session removed the quitting language site-wide.
- **Nov 14:** headline changes (5x, without "earn", Ana's "Build First"), waitlist matched, link previews remade, Offer
  Flow link and Ana's screen recording, clickable "Save my offer stack", smiling stills on all four videos, tap-for-sound
  centred, then lowered off her face per video, the balanced headline on all devices, the play button in the pill.
- **Nov 15:** loading states on every form and buy button.
- **Nov 17 to 21:** Kit 401 outage diagnosed (unpaid Kit plan), messages for Ana written, Ana paid, verified working.
- **Nov 22:** this handoff, the playbook and the library brought up to date.

## 7. Phones and iPads: the rules from the mobile pass

Sean: "made for the phone, not just sized for it"; the audience is busy moms 30 to 50, many on older iPhones.
- Video under the description, never the form above the video. The phone mock-up as big as the screen allows.
- A full-screen button under the phone video beats auto full screen on tap (keeps the page and its button in view).
- Never an empty or letterboxed video frame: show her still at once, swap to the player only when it is really playing.
- Sticky header on phones; the bottom button narrow and thin but readable (50px, 17px label). iPad portrait uses the
  laptop header.
- Nothing in a side rail on phones (day badges, plant markers and dates sit beside or above the text); buttons full width
  with balanced labels and "(free)" never alone on a line; banners in sticky headers one line; desktop-only hints (⌘ D)
  get a touch version ("tap Share, then Add Bookmark").
- Check at 320, 390, 820 (iPad) and 1440, plus 1024 and 1920 for headlines. No sideways scroll, ever.

## 8. Rules this chat added (also promoted to the playbook)

- A headline flows and balances; no fixed short lines next to long ones; it fills its column (measure line widths).
- When the headline changes, update the meta, og and twitter descriptions, the og:image:alt and the link preview image.
- Keep the "$1.4M" proof line above the headline unless told otherwise. Title case in the headline, as the rest is.
- Ana's copy: no quitting language ("leave your job", "quit", "side hustle", "leaving date"); "replace my salary" and
  "5x my salary" are fine (they describe the size of the business).
- Anything drawn as a button works as one. Anything that waits shows that it's working.
- Overlays on her videos go where her face isn't: look at the still, set the position per video.
- A cover still is chosen by looking at frames, never the first frame by default.
- Before saying a feature is live, check for switches that hide it (A/B cookies, `?now`, closed states) and test as a
  visitor in the other bucket.
- If the Sheet's Kit column shows "error 401", check Ana's Kit billing first.
- New copy is a layout job: balance, bold the line to read first, keep what the doc leaves out unless told to cut it.
- Simplify means cutting lines and doodles, never words or labels.
- Textures never show their tile; words get calm ground (lighten, don't darken); never runtime SVG filters on large areas.
- A sub-brand logo for her: when two passes miss, paint it from scratch in her own studio style.

## 9. How to test (recipes that worked)

- Local server: `cd ~/AnaVideo/2026-ana-calin && python3 -m http.server 8767` in the background. It is single-threaded:
  run tests one at a time, or you get connection resets that look like bugs.
- Playwright lives in `~/AnaVideo/work/node_modules` (`NODE_PATH=~/AnaVideo/work/node_modules node script.js`); Chromium
  only, no WebKit. Use `devices['iPhone 13']` for phones (a desktop window at 320 is not a phone: it showed a 55 px
  overflow on the VIP confirmation that real phone emulation does not).
- The pages use smooth scroll: scroll with `behavior:'instant'` before screenshots.
- Headless Chromium cannot play Wistia's H.264: the clock stays at 0. Check real playback in the app's built-in browser
  (mobile preset), then reset it to desktop.
- A redirect (Stripe) destroys the page in Playwright before you can read it: watch the button with a MutationObserver
  that `console.log`s, and route the destination with a delay.
- Slow the network on purpose to see loading states: `context.route(/kit\.com|\/api\/|stripe\.com/, delay 7 s)`.
- Measure headline balance: a Range over the headline, its client rects grouped by line, each line's right edge as a
  percentage of the column.
- After publishing: poll the live page with `?cb=$RANDOM` until a string from the change shows; the CDN can serve an old
  copy for a request or two.

## 10. Mistakes made in this chat (do not repeat)

- The VIP-world rebuild dropped a piece the survey needed (the brick wall's ball), so answers stopped moving on. Click
  through every interactive flow after a rebuild.
- The "simplify" pass hid three labels; simplify never removes words.
- Runtime SVG-filter textures made the VIP hero slow; render them to images.
- New class names `.vb/.vs/.vt` clashed with the VIP page's own section classes: give new pieces their own names.
- The sticky bars "worked" in tests but Sean saw none: an A/B cookie hid them for half the visitors.
- The headline was split into fixed lines; after copy changes it left big gaps. Flow and balance it instead.
- The link preview still said "leave my job" after the copy changed; Ana spotted it.
- The first centred "Tap for sound" sat across Ana's face; place overlays per video.

## 11. Open items

- **Add the "error 401" sign-ups (Nov 17 from about 22:00 until Ana paid) to Kit**, and check any VIP purchase in that
  window has the VIP tag. Sean or Ana does this.
- Check the live pages on a real iPhone (a 17 Pro and an older one): stills, play button, full-screen button, loading text.
- Delete the TEST rows in the Sheet (from earlier rounds).
- Licence check of the Pinterest cut-outs used in painted pieces.
- Not confirmed by Sean: the calendar mock's local time; "VIP ONLY" was approved and is live.
- Optional ideas offered and not done: an alert when Kit starts refusing the key; the VIP comparison table as two stacked
  lists on phones; the VIP WhatsApp line "December 8 to 11 · New York dates" next to local times; the calculator question
  that leads with New York time (`assets/conf.js`); the confirmation marquee under reduced motion; three "required" labels
  in step 4; the VIP upsell crown overlapping its card.
