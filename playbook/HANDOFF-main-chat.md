# Handoff: the main Ana Calin chat (Oct 25 to Nov 8, 2026)

Read this first in a fresh chat, then `CLAUDE.md`, then the playbook repo (`seeeadd/afterharvest-design-playbook`:
`README.md`, `SOP.md`, `clients/ana-calin.md`, newest lines of `feedback-log.md`). The proof behind every line here is in
`playbook/transcripts/main-chat-digest-2026-10-25_to_11-08.md` (every message Sean typed and every longer reply Claude
wrote, in order, secrets removed).

## 1. Who and what

- **Sean** (sean@theseancanela.com) runs the design work. **Ana Calin** is the client (How We Grow, newsletter business,
  about $1.4M, lives in Greece). **Theia** is Sean's teammate on the Stripe side. A **second Claude chat ("the video chat")**
  makes Ana's film and has also been committing to the same branch and publishing to `main` (it added the "2 years later
  I am running a $1.4M business..." line to the waitlist on its own, and redesigned parts of the registration page).
  Always `git fetch` and merge before you touch anything. Never undo its work.
- **The product:** The Exit Plan, a free 3-day live workshop on Zoom, Tue Dec 8 to Thu Dec 10, 2026, 12:00 pm New York,
  about 90 minutes a session. VIP ($67 once) adds lifetime recordings, a private WhatsApp group, a live Friday Dec 11
  review/Q&A, the Offer Clarity Sprint. After the workshop there is a paid program, The Exit Lab (dates in
  `program/`, round 1 Jan 4 to Feb 3, 2027 as of Nov 2, doors close Dec 21).
- **Goal of every UI decision:** opt-ins on the registration page, VIP sales on the VIP page. Sean's order of work:
  desktop and laptop first (done), then speed (mostly done), then tablets (portrait and landscape), then phones (iPhone and
  Android), keeping quality and animation.

## 2. Repos, branch, publishing (the rules that never bend)

- Site repo **`seeeadd/2026-ana-calin`**, static HTML/CSS/JS plus Vercel serverless functions in `api/`.
  Live at **https://exitplan.howwegrowtoday.com** (trailing slashes everywhere: `vercel.json` has `trailingSlash:true`;
  `/api/ana-waitlist` without a slash answers 308, use `/api/ana-waitlist/` when testing with curl).
- Playbook repo **`seeeadd/afterharvest-design-playbook`** (Sean's reusable design/graphics/motion/video/page standards).
  `playbook/` in the site repo is Ana's local copy; the playbook repo wins where they differ.
- **Work branch `claude/quirky-franklin-etidvi`** in both repos.
- **Publish only when Sean says "publish"** (or "push", "pub", "live", "publis"): `git push origin HEAD:main` after
  checking `origin/main` is an ancestor of HEAD (otherwise merge it first). Then wait for the live page to show the change
  (poll with curl, cache-busting `?x=$RANDOM`) and say it is live. Pushes to main sometimes fail once with GitHub
  "fatal error in commit_refs_rules"; retry.
- No pull requests unless asked. No em dashes in any copy. No model names in commits. Commit trailers:
  `Co-Authored-By: Claude ... <noreply@anthropic.com>` and `Claude-Session: ...`.
- Never send anything to leads or Ana. Never put keys or secrets in chat or in the repo. Never invent numbers, names or
  testimonials. No AI images of the client without Sean's approval. Do not copy trademarks exactly (FaceTime logo got a
  different square green shape).
- After any round where Sean corrected or approved something, log it in `playbook/feedback-log.md` in the site repo AND
  `feedback-log.md` in the playbook repo, and push both (pull the playbook repo first, the video chat writes there too).
- Sean's reply habits: he answers screenshots with one-line fixes. Show screenshots after every change (SendUserFile),
  keep status lines short, say what is on the branch and what is live, ask nothing you can decide yourself.

## 3. The site map (what each page is, status at Nov 8)

| URL | What it is | Notes |
|---|---|---|
| `/` | Registration (opt-in). Hero with painted Greek window and Wistia video, frozen form on the right from 1280px, popup form on every CTA, Christmas touches, live ticker | `index.html`. Old version kept at `/v1/`, trial at `/v2/` redirects to `/`. The video chat is actively changing it |
| `/waitlist/` | Early-invite waitlist one-pager (built this chat, see section 7) | noindex, not linked from anywhere |
| `/vip/` | VIP upsell, after registration. Door-framed Wistia video, sticky order card on the right from 1280px, spam note, features, week map, fit check | `vip/index.html` |
| `/confirmed/` and `/vip-confirmed/` | After registering: WhatsApp first, move the email out of Spam/Promotions (realistic Gmail demo), calendar, 7-question survey that unlocks the calculator | survey posts to `/api/ana-survey` |
| `/exit-number/` | The Exit Number calculator (the free gift). Locked until the survey is done; `?sv=1` bypasses for testing | `assets/exit-calc.js` |
| `/program/`, `/join/`, `/welcome/` | The paid program (The Exit Lab) pages and the after-purchase welcome | sunflower-yellow, compact. `/join/` is the short offer page |
| `/deck/` | The teaser slides | |

Serverless functions in `api/`: `ana-register.js` (registration to Kit + sheet), `ana-survey.js` (survey and exit number to the
sheet and to Kit fields), `ana-waitlist.js` (waitlist), `ana-feed.js` (real live registration feed, shows only real data),
`stripe-webhook.js` (sales to the sheet and Kit tags).

Vercel environment variable NAMES (values are in Vercel, never in the repo): `KIT_API_KEY`, `KIT_REG_FORM_ID`,
`KIT_SEQUENCE_ID`, `KIT_TAG_ID`, `KIT_TAG_VIP`, `KIT_TAG_LAB_`, `KIT_TAG_LAB_FULL`, `KIT_WAITLIST_FORM_ID` (optional),
`SURVEY_SHEET_URL`, `SURVEY_SHEET_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_PLINK_VIP`, `STRIPE_PLINK_FULL`, `STRIPE_PLINK_PLAN`.
A changed variable only reaches the site on the next deployment ("publish" or a redeploy).

Google Sheet: "The Exit Plan · survey", owned by sean@theafterharvest.com (Claude's Drive connector is a different
account and cannot see it). Apps Script is `tools/survey-sheet.gs`; the `KEY` inside is Sean's secret word and is NOT in
the repo (`var KEY = 'change-me'` is a placeholder; Sean keeps his copy). Tabs: Registrants, Survey, Exit numbers, Sales,
Summary, and (new) Exit Plan Waitlist. Updating the script: paste, then Deploy > Manage deployments > edit > New version
(the URL must stay the same; a brand-new deployment gives a new URL and breaks the Vercel variable).

Stripe (Ana's account): three payment links (VIP $67, program paid in full, program 2-payment plan), one webhook endpoint
(events `checkout.session.completed` and `checkout.session.async_payment_succeeded`) covering all three, redirects after
payment to `/vip-confirmed/` and `/welcome/`. Ana confirmed the webhook and redirects are done. Test promotion codes exist
(100% off, 99% off); the discount codes are for testing only. "Allow promotion codes" was reported off on the links at one
point: re-check before relying on it. A Money Rewrite webhook of Ana's also hears every sale; she was given a simple
guide to make sure Exit Plan buyers are not tagged by it.

## 4. Timeline of the main chat (what was built, in order)

- **Oct 25 to 28:** `/program` and `/join` (paid offer pages) rebuilt many times until they read as Ana's: sunflower yellow
  as main colour, her real sunflower traced from her logo on every button, button wording ("Start my first paid offer"),
  compact layout like Jay's but with her touches, weeks as one row each. A playbook, transcript and zip were sent out Oct 28.
- **Oct 30:** pages moved to `seeeadd/2026-ana-calin` on Vercel with the `exitplan.howwegrowtoday.com` domain. A 58-second
  teaser (MP4 and a 954 KB email GIF) built from a spec. WhatsApp group pictures (free: her photo with a pink "3-DAY EVENT"
  ring; VIP: Gemini version with crown and a sunflower) and favicons (yellow sunflower everywhere, pink crown for the VIP
  confirmation page only).
- **Oct 31:** the new registration page: two columns, big video, slim ticket-shaped form frozen on the right (labels
  "First name" and "Email" are required, never placeholders only), tried at `/v2/`, then made the main page at `/`.
  Confirmation pages rebuilt (progress, headline, picture, WhatsApp, Gmail "find my email" demo with Spam and Promotions
  scenes, calendar, survey, locked calculator revealed brick-breaker style). Stripe guides, webhook, redirects. Ana's video
  script moved onto the pages because she could not film (kept the old top "Your seat is saved. Four quick steps").
- **Nov 1:** calculator rebuilt to ChatGPT's spec (three price cards, "See my plan at $X"), VIP page copy brought level with
  the registration page, then a full VIP page overhaul with Jason Fladlien's rules (see section 6): painted paper-studio look,
  real screens on painted devices, WhatsApp chat demo, Zoom Q&A window, sunflower on every button, favicon. The registration
  page got the VIP page's techniques added on top (Sean said "you ruined it" when a first rebuild stripped its charm: add, never
  replace). Six teaser slides for Day 1 to 3. A 2:23 film draft for the video chat.
- **Nov 2:** dates moved to Tue Dec 8 (program shifted 21 days). Tickers cut from seven to three, then made slim. Sticky
  bar iterated many times (narrower on scroll, countdown labels under the numbers, bold dates). Headline now "How to Build the
  Business That Pays You for What You Know in 2027". Plane-seat photo in an iPad frame. Five seal badges (the giveaway rosette
  built as vector, others from Gemini prompts, no full refund promise). Christmas touches painted with Ana's paint engine.
- **Nov 3:** Sean's new copy pass (skimmable: bold sentences plus soft yellow highlight on the key phrase only). Ana's
  painting as a transparent hand-cut SVG sticker. Signature animation in the page pink. FaceTime-like icon in green. Sticky
  header and gift section text fixes.
- **Nov 4:** visitor-time localisation everywhere (section 5). Social proof of Ana's collaborators as real call frames
  (Justin Welsh, Mary Bartnikowski, Michael Simmons, Ciler Demiralp, Dr. Nicole Pertillar, Marni Battista) with one checked
  credibility line each. Wistia videos (preview silently loops the first 8 seconds, a press restarts with sound; phones open
  the portrait version full screen). Door and window graphics enlarged. Playbook repo created and filled with page standards
  (`pages/*.md`). Reply to Ana drafted (new photo, less Christmas).
- **Nov 5:** VIP: slim spam note, New York notes beside local times, **sticky order card** on the right from 1280px, city pin
  chips, "Ask me" row rebuilt as words left and live chat right. Then the **waitlist** (section 7). Registration soft hold
  discussed, deferred to Monday.
- **Nov 6 to 8:** waitlist mobile layout (Ana's window beside her bubble), spam tutorial on the thank-you screen, thank-you
  card centred, bigger heading, the "2 years later..." line (added by the other chat; this chat's duplicate was dropped).

## 5. Sean's standing preferences (consolidated; the feedback log has the dated versions)

**Process and tone**
- Show every change as a screenshot. Short status lines. "Publish" is the only trigger for live.
- Do not remove things he asked to keep: the "free" tail on every CTA button, "free 3-day live event" in the header, labels on
  form fields, the sunflower with the Santa hat on buttons and the fairy lights on the frozen form (Christmas stays but less:
  no hero snow, no hat on Ana, snow only in two sections).
- Add on top of what works. If a rebuild loses charm, he will say so and you must bring it back.
- Fix the right code, not patches (a blank ticket on scroll had to be root-caused). Test the real path, not a mock only.
- Answers to "what do you think" should be an opinion with a reason, then wait. Do not build big ideas before a yes if it costs about an hour.

**Visual**
- Must not look made by Claude: no generic cards with thick borders and drop shadows used everywhere, no stock icons, no
  evenly sprinkled detail. Painted gouache look from `tools/paint` (Ana's paint engine), real screens where something must be
  proved (Gmail, WhatsApp, Zoom, Google Calendar copied exactly in Ana's colours), no image generators by Claude (Sean runs
  Gemini himself and gets prompts from Claude; he asks for prompts in a shared style block plus one prompt per asset).
- Colours: sunflower yellow `#FFD400` is the main accent, hot pink `#F72585` second, ink `#1A1412`, cream `#FFF8EE`.
  No muddy grey-beige. Fonts: Instrument Serif for headlines, Manrope for everything read and all numbers (sans for numbers).
- Text: bigger is better for buyers aged 30 to 50 (Jason: "bigger fonts are better"). Body 17 to 18px desktop. No awkward
  one-word last lines (`text-wrap:balance` or `pretty`), no awkward white gaps, text fits everywhere, line breaks hand-set.
- Highlights: the key sentence of a band is bold plus a soft yellow marker (pink marker for the second idea). Never highlight
  two things in a band.
- Motion: real animation (arcs, anticipation, settle), nothing pulsing for attention on the buy path, but the empty form field
  that should be filled next pulses and lights up. Animations must be fast enough that nobody scrolls past them.
- Texts and graphics must never cover each other. When something readable sits on a painting use a soft white glow behind and
  around the words (never a panel under text; Sean rejected a solid panel).
- Compact: Sean wants "compact one-screen no-scroll" pages for one-pagers and tight density elsewhere, but not so tight it is
  hard to read (he flagged both extremes on the waitlist).

**Date and location (applies to every page)**
- Show the visitor's own city, dates and time, with a pin and the city name (read from the device time zone via
  `Intl.DateTimeFormat().resolvedOptions().timeZone`, never hard-coded; Manila only appears when the device says Manila).
  New York stays as the small second line (the emails say New York). Show dates that shift across midnight (Manila sees
  Wed to Fri, Dec 9 to 11, 1:00 AM). Keep "12:00" zeros. Friday's call and the WhatsApp dates adapt too. New York visitors
  see New York and no second line.
- Wording: "Dec 8 to 10" with "to", not dashes. "Three (3)" for the number of free sessions where it helps people picture it.

**Copy**
- Sean's copy docs are word for word; the only edit Claude makes on its own is removing dashes. When he sends new copy,
  rebuild around it; do not shorten.
- "Ana" is spelled Ana even when Sean types Anna. First person for Ana's voice on her pages.
- Proof is always labelled "from Ana's past challenge, results vary". Results trio: $3,000+ / $3,200 / $2,400 (not the old
  "47 of 300" stories). Never promise sales or use a full refund; the guarantee badge says the do-the-work promise.

## 6. Jason Fladlien rules, applied (full file: playbook repo `pages/fladlien-on-pages.md`)

Show do not tell ("how do we show this?"); most important words biggest; one idea per band, built in reading order; motion
only to lead the eye; the framework returns with progress (Day 1 to 3 tracker, step rail, the waitlist's three steps);
show the plan three times with the same labels; slide inside a slide, tease it, lock the how (the waitlist shows her slides
blurred after sign-up); tables built row by row; countable numbers; one visual extended; titles tell a story; cut what does
not persuade; one call to action repeated after each section; scarcity only if real; proof next to the claim; price not giant,
what they get is the biggest thing. Source repo for his teardowns: `seeeadd/fladdy` (about 290 MB, add with add_repo).

## 7. The waitlist (built Nov 5 to 8), current state: LIVE at /waitlist/

**Purpose.** People join with first name and email, and Ana promises: "I'll email you the link to book your free seat one day
before registration opens to the public. You'll also get an early chance to send me a question to answer for the live
workshop." The GPT spec Sean pasted (one clear promise, one optional question, sheet columns) is the source; Sean's own copy
replaced GPT's wording where he gave it.

**Files.** `waitlist/index.html` (one self-contained page), `api/ana-waitlist.js`, `tools/survey-sheet.gs` (waitlist tab),
`tools/waitlist-kit-setup.md`, `tools/waitlist-emails.md`, `tools/waitlist-tests/` (browser test scripts), images
`img/real/ana-optin-gemini.webp` (Sean's Gemini-extended still of Ana from her opt-in video), `img/real/waitlist-bay-art.webp`
(Sean's bay illustration), `img/real/gift-bow.webp`, `img/o/vip/paint/env.webp`, `assets/gmail-demo.css` (shared Gmail demo).

**Page, desktop (one screen, no scroll from 1280x720 up).** Pink striped awning on top (`dk-awning.webp`), sunny sky with rays,
Sean's bay illustration at about 36% opacity along the bottom drifting slowly. Left: Ana's window (the registration page's
painted Greek window with shutters, Gemini still of her, a "Watch soon" badge, no video yet) beside a speech bubble: "I'm
running what I think is my best workshop yet. And for the first time, it is completely free." Headline "My Newsletter Business
Has Already Made $1.4M." (small line) then "Here's What I'd Do First If I Wanted to Leave My Job in 2027." (big). Two copy columns
with dashed dividers and a white glow behind the words. Right: the form card, "Get your invitation one day early.", the
visitor's own workshop time ticket (pin chip + `Tue to Thu, Dec 8 to 10 · 5:00 PM · live` and a small New York line),
the promise, a three-step strip (Today: you join / A day early: your link / Then: public opens), First name and Email with
labels, the yellow button "Send me my early invite, Ana (free)". The next empty field pulses (first name, then email).
There is no sticky header on this page (removed on purpose).

**After sign-up.** The card widens and centres. Heading "You're on the waitlist.", the Gmail spam/Promotions demo from the VIP
page with the name filled in and a pink strip "How to remove it from Spam and Promotions", then a gift box (yellow box,
pink ribbon, gingham bow, tag "A gift from Ana", cream paper letter): "Got something you'd like me to look at during the
workshop?", a ruled writing area for "What's one business decision you'd like my take on?", a permission checkbox unchecked by
default ("Ana can discuss my example during the workshop."), "Send Ana my question". After sending: "Got it. Thanks for telling
me what you're working on. Ana". Her real slides sit blurred (design visible, words not) left and right on screens 1200px
wide and up.

**Phone and tablet.** The information comes first, the form last: Ana's window beside her note, the headline (bigger), the
copy, then the form with the workshop-time ticket inside it. Tested at 390, 360, 320, iPad portrait and landscape.

**Behind it.**
- Sign-up posts JSON to `/api/ana-waitlist`: validates email (shape, throwaway domains, can the domain receive mail), honeypot
  field `ep_check`, origin check. Kit: creates the subscriber and adds the tag `ep_waitlist` (NOT the registration form, so the
  "You're in" email does not fire early). Optional `KIT_WAITLIST_FORM_ID` adds them to a Kit form too.
- The question posts `{email_address, business_question, permission_to_discuss_live}`: saved in the Kit custom field
  "Exit Plan: waitlist question", tags `ep_wl_question` and (if ticked) `ep_wl_discuss_ok`, and the same sheet row.
- Sheet tab **Exit Plan Waitlist**, one row per email: `first_name, email, waitlisted_at, source, business_question,
  permission_to_discuss_live, early_invite_sent_at, registered_at, time_zone, kit`. A second sign-up updates the row and keeps the
  first time. `registered_at` fills itself when the same email registers (the Registrants rows call `markRegistered`).
  `early_invite_sent_at` is filled by hand.
- The registration page prefills first name and email from `?first_name=...&email=...` (the early-invite email link), so booking
  takes one confirmation. `?ref=waitlist` identifies the cohort in the Registrants tab.
- `EARLY_ACCESS` and `PUBLIC_OPENS` (ISO times) at the top of the page script, when filled, print the two dates under "Your
  link" and "Public opens" in the visitor's own time. Both empty today because the dates are not set.

**Kit and email plan** is in `tools/waitlist-kit-setup.md` and `tools/waitlist-emails.md` (welcome, thank-you for the
question, the dates, the early link, the reminder, with a Kit flow, segments and checks). No dates in any email until set.

**Not done / needs Sean (in this order).**
1. Ana's sheet: paste the new `tools/survey-sheet.gs` (keep the KEY), deploy a NEW VERSION of the existing deployment, run
   `testWaitlist` once, delete the test row. Until then the waitlist still saves to Kit but not to the sheet tab.
2. Join the waitlist with a real email and confirm: Active in Kit with tag `ep_waitlist`; a sheet row; the question adds
   `ep_wl_question`. If Kit shows the person as not emailable, create a Kit form and give Claude its ID for `KIT_WAITLIST_FORM_ID`.
3. In Kit add the tag `ep_registered` to the existing registration automation, then build the emails.
4. **The soft hold (Monday Nov 9, Sean's request):** before public registration opens, the root `/` and `/v2/` should send visitors to
   `/waitlist/`, and the early-invite link carries a key (for example `?early=...`) that lets people through to the real form;
   the hold switches itself off on the public date. Build it switched OFF by default so nothing changes for people registering
   today. Needs: the public registration date, and whether the registration link has already been sent to partners or anyone
   (if yes the hold must go in before the waitlist is announced). It is a soft hold, not a lock.
5. Dates: when set, fill `EARLY_ACCESS` and `PUBLIC_OPENS`, add the real dates to emails.
6. A real video of Ana for the waitlist window (the "Watch soon" badge), when it exists.
7. Decide whether the question after sign-up is worth it if every early-invite email is identical (GPT said it only pays off if the
   invite's first line changes per answer; Sean kept it so Ana can pick live examples).

## 8. Other open items

- Tablets (portrait and landscape) layout pass, then phones (iPhone, Android) for the registration and VIP pages. Known phone
  issues from earlier judging: the phone bottom bar overflows at 390 and 320 and lacks the visitor's date/time/city; the
  popup lacks a "for you" line and its eyebrow turns all pink; "About 90 minutes a session" breaks on the side form; the day
  map covers text; "Save your free seat" overflows at 320; the VIP door on phones has the right pot off-screen.
- Remaining speed work (images are already resized and lazy-loaded, headers cached, fonts preloaded).
- Registration film (`tools/film/`, the video chat owns it): follow `tools/film/HANDOFF-video.md`, `SITE-ASSETS.md`,
  `FLADLIEN-FOR-VIDEO.md`; no dates in the core video.
- Sticker work: redo each leaf of Ana's painting sticker to match her painting, one by one (task #38 in the old task list).
- Registration page "tell the video chat": pages use Wistia (`assets/wistia-vsl.js`); the VIP door is a 1032x620 canvas with the
  leaf hinge at x 904 and `door-potr` a separate layer; do not re-add self-hosted videos.
- The playbook repo should get a line for the waitlist standards (done in `feedback-log.md`; a `pages/waitlist.md` file would
  be the natural home if the waitlist pattern is reused for another client).

## 9. How to test (recipes that worked)

Scripts live in `tools/waitlist-tests/` (Playwright; Chromium and Playwright are pre-installed in these cloud sessions, do not
reinstall). Start a static server (`python3 -m http.server 8767` from the repo root, in the background, kill it afterwards,
the tool time limit kills long-lived servers), run a script, read the printed numbers and look at the screenshots.
- `fit.js`: page height and horizontal scroll at 1440x900, 1366x768, 1280x720, 1920x1080 (must equal the viewport: no scroll),
  the thank-you state at the same sizes, phones and tablets.
- `phones.js`: iPhone 390, Android 360, 320, iPad portrait and landscape, before and after sign-up, full-page shots.
- `tzs.js` and `cities.js`: the localised schedule in many real time zones (`timezoneId` in the browser context): Manila,
  London, Tokyo, Sydney, Kolkata, Sao Paulo, UTC, New York.
- API: `tools/waitlist-tests/apitest.js` calls the handler with a mocked `fetch` (Kit and the sheet) in Node:
  sign-up, question, bad email, throwaway domain, honeypot, wrong origin.
- Always measure with the DOM (`getBoundingClientRect`, `scrollWidth`), not by eye. Full-page screenshots show `position:fixed`
  elements (the awning) at the wrong place; that is a screenshot artifact.

## 10. Mistakes made in this chat (do not repeat)

- A Python edit script that raised an error halfway saved NOTHING, and the next screenshots were the old page; twice. After
  every scripted edit, grep the file for the new text before testing.
- After replacing a CSS media-query block, check brace balance (a stray fragment made the whole phone layout collapse).
- `container-type:inline-size` boxes (the Gmail demo) have no intrinsic width: inside a flex column give them `width:100%`.
- Shrinking a heading to make one screen fit made it look too small; give back space from elsewhere first.
- Do not duplicate an edit the other chat already published (check `git log origin/main` before adding copy).
- A Drive connector sees only sean@theseancanela.com, not the survey sheet (owned by sean@theafterharvest.com).
- Do not put secrets (the sheet KEY, Stripe keys, Apps Script deployment URLs) in the repo or chat summaries.
