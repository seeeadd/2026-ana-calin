# Ana Calin · The Exit Plan · video handoff (context transfer for a new chat)

Written Nov 4, 2026 from the full working chat (Oct 25 to Nov 4): every message Sean sent, the session summaries,
and the studio notes in this repo. Paste this whole file into the new chat as the first message, then add the video.

Sean is the designer/operator building Ana's funnel. Ana Calin is the client. Sean talks fast and casually, often
by voice, with typos; read for intent. When he says "publish" it means push the work branch to main.

---

## 0. The job in the new chat

Make the **registration page video**: Ana's real talking-head opt-in video, edited, with our motion graphics in her
art style. It replaces the still in the page's video slot (`index.html`, `#vsl`, `VSL_SRC` in the page script).

**What exists now**
- Ana's opt-in video: **portrait (9:16), with burned-in subtitles.** Sean is asking her for a version without
  subtitles. Use the subtitled one to start the edit (cut, timing, structure), and swap the clean one in later.
  Never build captions on top of her burned-in ones in the final; our captions replace them.
- An all-animated film from Nov 1 (`tools/film/film.html`, about 2:23), made before she filmed. It has the running
  sunflower character Sean wants back. Reuse its scenes, characters and engine.
- The script: Google Doc "Video scripts" (1gucrM1CSXePCjJLi7amuwTMw3May_ztkqgOC-QUG8L4), section **01
  Registration page** (section 3 below). Her recording may differ from it; the recording wins, the doc gives the
  beats and the editing notes.

**Frame:** the video must not be 9:16. Sean prefers **4:3 (1440 x 1080)** over 16:9.
**Catch:** the registration page's video window is **1.548:1** (measured: 676 x 437 at a 1440 px screen). A 4:3
file would be cropped about 14% top and bottom. So ask Sean once:
- (a) change the window to 4:3: the `.iph.win .scr` aspect-ratio in `index.html`, plus the painted window
  overlay's offsets (`.wn-art`, `.wn-flo`);
- (b) render at about 1.55:1 (1560 x 1008).

Recommend (a) if he wants 4:3.

**Before anything else in the new chat:**
1. Read `playbook/` (`README`, `SOP`, `brand-ana`, `graphics`, `motion`, `video-editing`, `feedback-log`).
2. Probe her video with `ffprobe`: length, fps, resolution, audio.
3. Transcribe it if there's no script match (`whisper` if installed; otherwise use her burned-in subtitles plus the
   script doc).
4. Map her real sentences to the beats in the shot plan below.

**Sean's ideas, all on the table** (he said "all of them, I don't know"):
1. AI-generated background (Sean makes it in Gemini; Claude writes the prompt).
2. A full video (not just a talking head).
3. Her own video, blurred, filling the sides behind the portrait.
4. Her video on top of the motion graphics we made.

**Recommendation to put to him (not decided yet):** one system that uses all four, by beat.
- **Anchor:** Ana stays on screen almost all the time (the Nov 1 motion study's rule 1: keep one anchor, change the
  world around it). Her portrait sits as a framed window, Loom-style or inside a painted frame, on a background
  built from our painted world (paper, the Greek window/door, her room), not a flat blur.
- **Default shot (talking):** 4:3; her 9:16 clip about 60% of the height, left or right third, in a painted frame
  with a soft close shadow; the other side carries the beat's graphic or caption.
- **Cut-aways (proof and the three days):** full-frame motion graphics from `film.html` (the sunflower runner, the
  tower of the "usual order", the door, the slides), with Ana shrunk to a small camera tile in a corner (she's still
  present), as in the Day 1-3 screen-share decks on the page.
- **Blurred fill:** only as a fallback behind her when no graphic is planned, and tinted to the cream paper so it
  never looks like a phone video stuck in a landscape frame.
- **AI background:** optional; only for one establishing scene (her studio in Greece behind the frame). Sean
  generates it; we never generate images ourselves.

Ask him before building, then make a 20 to 30 second test of the default shot plus one cut-away, show it, and
only then do the full cut. He hates waiting: say how long each step takes and send drafts as they exist.

---

## 0b. Shot plan, beat by beat (a starting point; her real timing wins)

**Shot types**
- **A, talking:** Ana's portrait in the painted frame (`img/vip/paint/ana-frame.webp` style, or the painted Greek
  window), on the right two-thirds. The left third holds the caption or a small graphic.
- **B, cut-away:** a full-frame graphic, with Ana in a camera tile in the bottom-right corner (rounded, 4 px ink
  border, "Ana" label, as `.camtile` in film.html).
- **C, close:** only Ana, pushed in slowly; caption only.

| # | her line (script) | shot | picture | motion / transition | caption |
|---|---|---|---|---|---|
| 1 | "best workshop yet ... completely free" | A | her room behind the frame: whitewash, the window to the sea (film.html scene 3 room), string lights | the shutters open onto her in the first 0.8 s (the page's door move, fast) | Build proof before you leave. |
| 2 | "It's called The Exit Plan." | A | The Exit Plan wordmark lettered in on the left | ink draws the title as said | It's called The Exit Plan. Free, and live. |
| 3 | the word "exit"; idea + spreadsheet; build proof first | B | a painted idea note and a spreadsheet tilt and wobble; a proof stamp (painted postmark) lands on a real sales notification | stamp: anticipation, press, settle | Proof first: something people will pay for. |
| 4 | three live days, backward from income; audience or not | B | the sunflower runner jogs along three day tiles (Dec tiles without dates: "Day 1 / 2 / 3") | the runner is the wipe into the next beat | Three live days. Bring what you know. |
| 5 | "I'm Ana Calin ... How We Grow" | A | How We Grow wordmark on the left | signature writes in (page pink) | I'm Ana Calin. I write How We Grow. |
| 6 | $1.4M without sales calls; 16,907 buyers | B | two separate counters, real numbers, on painted paper tags; Ana's tile stays | each counts up as said (no bounce) | $1.4M, no sales calls / 16,907 buyers |
| 7 | "first workshop sold two copies ... Very efficient." | C | her face, nothing else | slow push-in; hold on the dry line | My first workshop sold two copies. |
| 8 | the usual order: idea, build, audience, find out | B | film.html's tower of blocks, labelled in her words, wobbling | the tower wobbles, then tips | The order most of us were taught. |
| 9 | her order now: AI reads real questions first | B | real-looking comments and replies (film.html scene 5), grouped by the same question; a highlighter marks the repeats. No robots, no glow | the cards slide on arcs into groups | Now I start with what people keep asking for. |
| 10 | past students: it still works; this starts earlier | A | small "Been to a workshop before?" note on the left | note settles | The Exit Plan starts earlier. |
| 11 | Day 1, find a problem / first readers | B | the Day 1 teaser slides (`img/slides/day1a`, `day1b`) in the screen-share frame, method redacted | page-turn into the slide; a cursor and her ink ring the key box | Day 1 · Find the problem |
| 12 | Day 2, put numbers on it | B | Day 2 slides (`day2a`, `day2b`); income, price and buyers fitting together | numbers slot into place on arcs | Day 2 · Put numbers on it |
| 13 | Day 3, put it out there (the email) | B | Day 3 slides (`day3a`, `day3b`); an email being written in her voice | a pencil writes the subject line | Day 3 · Put it out there |
| 14 | by the end: idea, numbers, email | A | three painted objects drop into an envelope on the left | envelope seals with her sunflower wax seal | One idea. The numbers. The email. |
| 15 | the gift: the Exit Number calculator | B | the real calculator (`/exit-number/` screenshot) with its logo; a goal typed in, the buyers needed fill in | typing, then the result counts | Your gift: the Exit Number calculator |
| 16 | "Put your name and email in the form ... see you live." | A | the sunflower runner runs to the edge of the frame and points off-screen toward the form beside the video | he hops, points, holds | Your seat is in the form. See you live. |

**Notes**
- Keep the order of her actual recording. If a line is missing, drop the row. Don't add claims she didn't say.
- No dates anywhere (the date insert is recorded later).
- Two shot types should alternate so it never feels static; never more than about 12 s of the same shot.
- Optional, one place only: Sean's ideas of an AI background (shot A, row 1, behind the frame) and a blurred copy of
  her video (a fallback for A).

---

## 1. Project facts (do not get these wrong)

- **Event:** The Exit Plan, a free 3-day live event (Sean now says "event", the old copy said "workshop") with Ana
  Calin, on Zoom.
- **Dates:** **Tue Dec 8 to Thu Dec 10, 2026.** Each session runs 12:00 pm New York (7:00 pm Greece, 5:00 pm
  London, 9:00 am Los Angeles) and lasts about 90 minutes. Older material says Nov 17 to 19 and is wrong. The video
  script says **don't bake dates into the core video**; they go in a separate insert recorded later.
- **Ana:** How We Grow newsletter on Substack, about 80,000 readers. The business has made $1.4M from workshops and
  programs with 0 sales calls; 16,907 buyers (script). She lives in a village in Greece, works about two hours a
  day, paints, and has a toddler. Her first workshop sold two copies.
- **Proof that may be shown:**
  - Jill Hart: "$3K in a month from a 300ish audience".
  - $3,200 from 547 subscribers.
  - $2,400 from 198 subscribers.

  These are labelled "from Ana's past challenge, results vary". **Do not use the old "47 of 300 said yes" or
  "$47" stories** (removed on purpose).
- **Gift:** the Exit Number calculator (a planning tool, not a prediction). Registrants get it after 7 quick
  questions.
- **Prize:** five people win a 1:1 session with Ana, drawn from those still live at the end of Day 3.
- **Site:** https://exitplan.howwegrowtoday.com, served by Vercel.
- **Repo and branch:** github seeeadd/2026-ana-calin, local `/home/user/2026-ana-calin`. Work on
  `claude/quirky-franklin-etidvi`; push to main only when Sean says "publish". `.vercelignore` keeps `tools/` off
  the live site.
- **Commit rules:** don't create PRs unless asked, no model names in commits, no em dashes in copy.
- **Never:** send anything to leads; put Stripe keys or secrets in chat; apply the test codes ExitPlan99 or
  ExitPlan100 on the pages.

---

## 2. The page the video lives on

- The registration page hero has a painted Greek window (blue shutters swing open) with the video inside it, an
  iPad-style frame (thin bezel, black top bar with camera), a play button over a still. The same is planned for the
  VIP page (`vip/index.html`, its own `VSL_SRC`, inside a painted door).
- The video starts muted with captions on the page, so **the first lines must work with no sound**. First frame:
  Ana speaking plus a readable caption. **No logo intro.**
- Keep the file small for web: H.264, `-movflags +faststart`, about CRF 23, 1440 x 1080 (and a 1080 x 810 copy).
  Static grain only, never per-frame grain (an 89 MB render taught us that).

---

## 3. The script (registration video, from the Google Doc) and its editing notes

Spoken beats, in order:
1. The hook:
   - "I'm running what I think is my best workshop yet. And for the first time, it is completely free."
   - "It's called The Exit Plan."
2. "Exit": never leave a job on a nice idea and a spreadsheet; build proof first.
3. Three live days working backward from the income you want. You can join with or without an audience; you don't
   need a course idea; bring what you know.
4. "I'm Ana Calin." The proof: How We Grow; $1.4M without sales calls; 16,907 buyers.
5. "My first workshop sold two copies. ... Very efficient." (dry humour)
6. The usual order (idea, build, audience, then find out) versus her order now: AI helps her read real questions,
   comments and replies before she builds; it doesn't choose for her.
7. To past students: what you learned still works; The Exit Plan begins earlier.
8. The three days:
   - Day 1, find a problem people already try to solve (and first readers if you have none).
   - Day 2, put numbers on it (cheap isn't always easier; income, price and buyers must fit).
   - Day 3, put it out there (write the email, in your own voice).
9. By the end: one idea ready for real people, the numbers, the email.
10. The gift: the Exit Number calculator.
11. "Put your name and email in the form, and I will see you live."

Editing notes from the doc (follow them):
- First frame: Ana speaking, caption "Build proof before you leave." The next caption introduces The Exit Plan.
- At "two copies", **stay on Ana**; the dry line is the pattern interrupt.
- Proof: show $1.4M and 16,907 as **separate factual captions**; both are replaceable pickups.
- At the updated approach, show Ana working inside her real business. Don't reveal her method; no generic AI
  animation.
- The three days: one outcome each in her words, "Find the problem" / "Put numbers on it" / "Put it out there".
  Show outputs, keep her process off screen.
- End with the form already visible beside the video (it is, on the page). **No second CTA.**
- General: captions at most two short lines; change the visual when the thought changes, proof appears or the
  viewer must act; real work, real tools, real page controls; no motion added only to keep the screen busy.
  Remove repeated takes and setup chatter; keep natural breaths.

---

## 4. The existing film system (reuse it)

Folder: `tools/film/` (not deployed).

| file | what it is |
|---|---|
| `film.html` | the full animated registration film (Nov 1), 1920 x 1080, `window.render(t)` and `window.DUR` (143 s). Scenes: running in place (the wheel), the usual order (the wobbling tower of blocks), Ana's room in Greece (stats, laptop, envelopes as readers, the phone that never rings), the two-sale workshop, real comments asking the same question, the order changes (tower falls, Day 1 to 3, the door to 2027), the three days as live sessions with the teaser slides and her camera tile, results, the exit number, the five 1:1s, "save your free seat" pointing to the form |
| `motion.html` | the 13 s motion test (the first short) |
| `slides.html` | the six teaser slides (`?s=`), method hidden with black redaction bars, lock stickers, "N / 52" page numbers; renders in `img/slides/day1a..day3b.webp` |
| `stage.html` | paper-desk still frames, a **rejected** direction (too much paper, not enough action); reference only |
| `render.js` | frame-exact renderer (Playwright + ffmpeg). `FILM=film.html node tools/film/render.js out.mp4 30` renders the video; `SUB=2` gives motion blur (renders 2 sub-frames and blends them with `tmix`); `CRF=` sets quality; `T_FROM`/`T_TO` render a stretch so renders can run in parallel and be joined; `--sheet <dir>/x.png 3,12,20,...` writes a contact sheet of single frames for checking staging |
| `tex/` | Sean's textures: paper-cream, linen, quilt, kraft, kraft-aged, dotgrid-crumpled, notebook-spiral, stucco, halftones, grains, Greek windows and doors |
| `cut/` | Sean's cut-out stickers (PNG): notebook, gold clip, pink folder, billboard, bulb, cat reading, computer, camera, hands (pointing, pencil, magnifier), olive branch, sprout, daisy, string lights, stamps, postmarks, torn paper strips, oval frame, lamp, dresser, chaise |

Serve the repo locally first: `cd /home/user/2026-ana-calin && python3 -m http.server 8767`. The renderer loads
`http://localhost:8767/tools/film/...`. The page waits for `body[data-ready]`.

**The running sunflower (Sean wants him in the new video):**
- Her sunflower smiley mark with **two ink legs** (round black feet) and, in HTML scenes, arms.
- In `film.html`: `runnerGroup()` around line 220, placed by `placeRunner()`. He runs in place on the wheel
  (0:00, legs swinging `sin(phase)*38deg`, a little bounce `abs(sin)`, a soft shadow that shrinks as he lifts),
  then stops and settles.
- The HTML-scene version is `BUD(id, width, x, y)` posed with `pose(id, {x, y, j (jump), sq (squash), r (lean),
  lp/la (walk phase/amp), legs:[a,b], al/ar (arm raise), ht (head tilt), bang, sh (shadow)})`, plus `hop()` and a
  walk-between-stops helper.
- He waves, watches counts, shrugs at the phone, cheers, jumps, points at the form.
- Use him as the recurring guide between beats (the anchor that travels), never as decoration.

**Frame-by-frame rules that worked**
- Every frame is a pure function of time (`render(t)`), so timing is exact and renders are repeatable.
- Static paper grain; motion blur via `SUB`; camera moves via a transform on a big canvas, with centres clamped so
  it never frames outside the drawing.
- Caption boxes fade in with their words, never empty first.
- Check a contact sheet before every full render. A full render takes about 10 min at `SUB=1` and about 20 at
  `SUB=2`.

**What Sean said about the film (follow it)**
- First attempt (papers and text): "not what I expected ... a bit too much text ... more action, more visuals than
  papers ... a real animation, real motion graphics, not just papers."
- Then: "very cute, but this is just one piece of info ... we're not going to include the dates yet ... a longer
  video ... the door does not look good, improve the animation of the door."
- On animation everywhere: "Real animation, not just stop motion." "Where are the real animations? These are just
  slides and flaps." "I don't want pops, pulses, and slides." "Very premium, specific, and appropriate to the
  context of the concept."
- On the hero door: "more 3D-looking, it looks flat ... faster and smoother, they might skip and scroll past it if
  it loads this slow ... more details on the flowers and pots."
- Paused Nov 1: "continue this later because she's going to film a talking head video soon, and we can put some
  stuff on top or have her as a loom-type video in some areas."

---

## 5. Ana's art style (the updated one; full study in `tools/paint/STUDY.md`)

**Brand**
- Sunflower yellow `#FFD400`, hot pink `#F72585`, warm black ink `#1A1412` (never pure black).
- Ink greys: `#3D332E`, `#7A6A60`.
- Cream paper `#FFF8EE`; supporting tints: blue `#BFD7EC`/`#9DBEDD`, pink `#FFC6DE`, yellow `#FFE27A`.
- Fonts: Instrument Serif for headlines and pulled lines, Manrope for everything read, Nothing You Could Do for
  handwriting.
- The sunflower smiley mark; her How We Grow wordmark (`img/how-we-grow-wordmark.png`); a cartoon Ana favicon
  (`img/fav/header-ana.png`).

**Her world:**
- Greek village: whitewash, Aegean blue shutters, bougainvillea pink, terracotta, olive, sunflowers in pots.
- Morning coffee, letters and envelopes (her newsletter), her own big colourful paintings (pink, turquoise, a plant
  in an orange pot), her toddler.

**The look ("a human designer for Ana, not Claude")**
- Painted, not designed: ink line that wobbles, overshoots and breaks; watercolour washes that miss the line and
  darken at the edge; matte gouache with brush streaks; coloured pencil on the paper's tooth; white gouache
  highlights; all on one cream paper.
- Depth from value (a darker glaze on the shadow side), shadows as a soft cool wash, **never** CSS offset shadows,
  thick black card borders or glassmorphism (that "card + thick border + offset shadow" look is what read as
  Claude).
- Colour rationed (under about 10% of a picture) and only on the story; one accent per picture.
- Real objects carry the idea (a red pencil on a printout = review; her phone = WhatsApp; film tins = recordings;
  a second chair at her table = "closer").
- One silhouette per object; a frame inside the frame, broken once; a picture inside the picture; motifs repeated
  (dots, petals).
- Print details: spaced serif small caps, "Nº 01" plate numbers, stamps, postmarks, die-cut sticker edges
  (raw, hand-cut).
- Mixed media is welcome: Sean's Pinterest textures and cut-outs (`tools/film/tex`, `cut`), used subtly, as
  reference or small accents, never solid wallpapers. Check licences before final use.

**How it's made:** the paint engine.
- `tools/paint/studio.html`: each picture is an `<svg data-art>` with `<g data-mat="wash|gouache|ink|pencil|white|shadow|flat|sheet">` layers.
- Render with `node tools/paint/render.js <art>`, then `python3 tools/paint/paint.py <art>`. Output goes to
  `img/vip/paint/<art>.webp`.
- About 90 painted pieces already exist in `img/vip/paint/`: door, window, shutters, laptop, phone, coffee, pencil,
  planner, envelope, wax seal, chairs, table, notes, stamps, sunflower petals, Christmas tree/wreath/holly/star/hat,
  the painted picture frame `ana-frame`, and her painting as a sticker `ana-painting-sticker.svg`.

**No image generators or Canva for graphics.** Sean uses Gemini himself for photos; Claude writes the prompts (and
must keep Ana's real face; Gemini outputs of her must not look AI).

**Seasonal:** the event runs in December, so a light Christmas layer is on the page (painted tree, wreath,
string lights, snow in two sections, a sunflower with a Santa hat and candy cane on the buttons). "A little cute
seasonal spice", never over the top. A touch is fine in the video too (string lights in her room, a hat on the
sunflower).

---

## 6. Motion rules (full study in `tools/paint/MOTION.md`; Sean's 12 motion references)

1. **Keep one anchor, change the world around it** (the horse, the woman on the train). For this video, the anchor
   is Ana (and the sunflower between beats).
2. **Transitions are objects in the story**, never a generic fade, slide or wipe:
   - a door or shutters opening;
   - a page turning;
   - a red thread;
   - a canvas that becomes the scene;
   - an iris.
3. **Real animation, continuous, full frame rate** (not stop motion, not stepped): anticipation, slow in and out,
   arcs, overshoot and settle, overlapping action, secondary motion (leaves sway after the door moves).
4. **Words arrive as they're said**, one at a time, small serif or handwritten, big picture and small type.
5. **The camera discovers**: slow pans and push-ins along a drawing reward looking.
6. **Idle loops** keep a still alive quietly (steam, a foot bobbing, flowers nodding).
7. Every beat is a small story: a state, a turn, a payoff.
8. **Sell the life, not the feature.** Reveals are theatre: the thing waited for comes last.
9. **Restraint:** one palette, one texture family, few things moving at once.
10. **Never:**
    - pops, pulses, bounces for attention, shaking or flashing;
    - countdown pressure;
    - generic AI visuals (glowing brains, robots, sparkles);
    - "busy" motion.

    Even on the page, a too-strong pulse on the form was called distracting and toned down.
11. **Speed:** fast enough that people don't scroll past. Sean asked repeatedly for faster, smoother animation
    (the hero door, the signature).

---

## 7. Jason Fladlien's principles (Sean's foundation for every visual)

Teardown: `/home/user/seeeadd/fladdy/jason-fladlien-videos/01 How to Design Webinar Slides.../teardown.md` and
`playbooks/slides.md`.
- Show, don't tell: screenshot the real thing, source under it.
- The biggest words are the most important; numbers countable; bigger fonts.
- A slide inside a slide (tease), shown at intro, teaching and recap; open loops.
- Two colours, minimalism, "better to look ugly" than glitzy-distracting; functional animation only.
- A mechanism visual with progress.
- One focal object per beat.
- One CTA impossible to miss.

Curiosity: show enough of the real thing to prove it exists, lock the rest ("shown live on Day 2").

---

## 8. Sean's preferences (everything he's corrected, grouped)

**Taste**
- Premium, specific, never generic or "Claude-looking". He spots it instantly ("this feels so Claude").
- Real over invented where proof is needed: real screenshots, real apps copied exactly (Gmail, WhatsApp, Google
  Calendar, Zoom) themed in her brand. Metaphors and painted scenes where the point is a feeling. He'll ask "which
  should be raw and which metaphor?"
- Graphics must mean something and differ from each other ("not just a bunch of things ... specific ... different
  layouts ... not repetitive").
- Charm and colour: he rejected a stripped-down rebuild ("you kind of ruined it ... bring back the charm"). Keep
  what works; improve on top.
- No grey/brown muddy colours ("puke poop grey"). No flat black-grey UI with "no depth".
- Balance: equal, calm spacing. He flags "too scattered", "too tight", "awkward white space", "text pushed to the
  side", "the text doesn't fit".
- Realism details he catches: cropped faces (show her face fully), wrong device frames (thin modern iPad bezel,
  black top bar with camera), unbalanced placements, cut-off animations, things that glitch or disappear on scroll.
  "Make sure your fixes are not a bunch of patches and actually fix the right code."
- Pattern-interrupt badges and stickers are good (giveaway seal, free gift, etc.) but "don't overdo it".
- Trademarked look-alikes are out (we made our own green video-call icon instead of FaceTime's).

**Type and copy**
- Sans serif for anything read, numbers and small lines. Serif for big headlines. He asks to switch lines to sans
  often.
- Bold the key sentence plus a soft yellow highlight (subtle, not loud); skimmable.
- No em dashes. First person from Ana.
- Keep "free" and "3-day live event" visible in headers.
- Labels on form fields.
- Times written with ":00" ("12:00 pm"); the visitor's own time highlighted.

**Ana's look in photos:** she's bolder than first assumed: copper-red hair, red lips, feminine and confident
outfits (her new photo: mauve satin wrap top). Not "blue mommy colours". Never change her face.

**Process**
- He wants results shown fast, with screenshots, and progress narrated briefly. He gets impatient with long silent
  work ("are those literally all you've done after 20 minutes?", "one should only take 8 mins max").
- Give ideas and a plan first for big creative work, then build. Offer variations when unsure.
- "publish" means push to main and verify live.
- He often sends a screenshot with a short note. Find the exact element.

---

## 9. Answers he'll want early in the new chat

- **Aspect:** 4:3, 1440 x 1080 (and a 1080 x 810 web copy).
- **Length:** match her recording (the script is about 3 minutes plus the date insert later).
- **Captions:** ours, two short lines max, Manrope, in brand, words appearing as said; replace her burned-in ones
  once the clean file arrives.
- **Dates:** not in the core video.
- **Music:** none decided; ask.
- **Assets needed from Sean:**
  - the clean (no-subtitle) video;
  - optional Gemini background of her studio;
  - real screenshots for proof beats (her Substack, the two posts if wanted, the real calculator is on the site at
    `/exit-number/`).

---

## 10. Related files

- Page code: `index.html` (registration), `vip/index.html`, `confirmed/`, `vip-confirmed/`, `program/`,
  `exit-number/`; motion in `assets/reg-motion.js`, `assets/vip-motion.js` (GSAP 3.13 + ScrollTrigger,
  self-hosted in `assets/vendor`).
- Studies: `tools/paint/STUDY.md` (art), `tools/paint/MOTION.md` (motion), `tools/paint/PLAN-registration.md`,
  `tools/paint/PLAN-v5.md`.
- Photos: `img/real/` (her Shorts stills and the new studio photo `ana-studio.webp`, see `SOURCE.txt`),
  `img/ana-cabin-3.webp` (First Class photo).
- Everything Sean wrote in the old chat, in order: `tools/film/sean-messages.md`.
- The playbook (rules for graphics, motion, video, and the learning loop): `playbook/`. Read it first; update `playbook/feedback-log.md` after every round of feedback in the new chat.
