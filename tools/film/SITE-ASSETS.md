# The landing page's own pieces, for the video

The registration page is in this same repo (`index.html`, live at https://exitplan.howwegrowtoday.com). Everything on
it can go straight into the video, so the video and the page match. Use these before making anything new, and never
redraw a piece that already exists here.

## Rules

- **Use the originals, not `img/o/`.** `img/o/` holds smaller copies made for the web page. The full-size files are
  the ones listed below.
- **Painted pieces can be made bigger.** Each one is drawn in `tools/paint/studio.html` (`<svg data-art="name">`).
  Re-render it larger with `node tools/paint/render.js name` then `python3 tools/paint/paint.py name` when the
  video needs more pixels than the web file has.
- **Pieces built in code** (tickets, form, header, Gmail, WhatsApp, calendar): record them from the page itself. Open
  `index.html` (or the live site) in Playwright at 2x or 3x, screenshot the element, or record its animation. Don't
  rebuild them as a mockup.
- **Same facts as the page:** Dec 8 to 10, 12:00 pm New York; "three (3) free, live sessions"; no dates in the core
  video (see `HANDOFF-video.md`).

## Where things are

| what | file(s) | on the page |
|---|---|---|
| Her window in Greece (wall, flowers, blue shutters) | `img/vip/paint/winh.webp`, `winh-flora.webp`, `shut-l.webp`, `shut-r.webp` | hero, around the video |
| Her painted picture frame | `img/vip/paint/ana-frame.webp` | "Here's who I am" |
| Her painting as a sticker | `img/vip/paint/ana-painting-sticker.svg` | host section |
| The sunflower smiley (also with Santa hat) | inline SVG symbols `#sf` and `#sfx` in `index.html` | buttons, header |
| Brand marks | `img/mark.png`, `img/how-we-grow-wordmark.png`, `img/exit-number-calculator-logo.svg`, cartoon Ana `img/fav/header-ana.png` | header, signature, gift |
| Day 1 to 3 slides | `img/slides/s1.webp` to `s6.webp`, `day1a.webp` to `day3b.webp` | the three days, slide wall |
| Day drawings (one writer through 3 days) | `img/vip/paint/wk1*` to `wk5*` | the day rows |
| "Where are you right now?" drawings | `img/vip/paint/sit-job.webp`, `sit-self.webp`, `sit-both.webp` | choice cards |
| Desk and props | `laptop`, `phone`, `coffee`, `pencil`, `planner`, `notes5`, `note-*`, `env`, `postmark`, `seal`, `stack`, `paper` in `img/vip/paint/` | gift, bring, reviews |
| Gift: calculator | `img/vip/paint/gift-card.webp`, `gift-tag.webp`, `img/vip/raw/calc-tall.webp` | free gift |
| Prize draw: tickets, chairs | `img/vip/paint/chairs-row.webp`, ticket SVG `#tk` in `index.html` | prize section |
| Badges | `img/badges/giveaway.webp`, `free-gift.webp`, `lifetime.webp`, `doors-close.webp` | prize, gift |
| Christmas set | `img/vip/paint/xmas-*.webp` | December only |
| Textures | `img/vip/paint/tx-*.webp` | section backgrounds |
| Ana's real photos | `img/real/` (see `SOURCE.txt`), `img/ana-cabin-3.webp` (First Class), `img/vsl.webp` | hero, host, calendar |
| Student results (real screenshots) | `img/wins/*.webp` | reviews; label them "from Ana's past challenge, results vary" |
| Student faces | `img/av/*.webp` | form proof row |

## The page itself: the form, the buttons, the header, the cards

Not only the drawings: the real UI from the page goes in the video too (the form someone fills in, the button they
press, the countdown, the Day cards), so the viewer sees exactly what they will use. Two ways to get each piece; pick
per shot:

1. **Screenshot or record it from the page (fastest, exact).** Serve the repo (`python3 -m http.server 8767`) or use
   the live site, open it in Playwright at the video's size, scroll the piece into view and take
   `element.screenshot()` at `deviceScaleFactor: 2` or `3`, or record the animation with `recordVideo` /
   frame-by-frame screenshots. Set `timezoneId: 'America/New_York'` so it shows the emails' time. Before the shot you
   can type into the form (`page.fill('#jFirst', 'Sarah')`) to show it being filled.
2. **Bring the code into the film (sharpest, animatable).** Copy the piece's HTML and its CSS from `index.html` into
   the film page, so it renders as real vector text and shapes at any size and can be animated shot by shot (the
   cursor clicks the button, the seat ticket stamps, the countdown ticks).

| piece | where (selector) |
|---|---|
| The form, ticket-shaped, with "Save your free seat" | `#hcard` (hero), `#rcard` (the one that follows on desktop); fields `#jFirst`, `#jEmail` |
| The sign-up popup | `#modal` (open it by clicking any `.btn.open`) |
| The "I'm in, Ana (it's free)" button with the sunflower | `.btn.open` (any; the Christmas hat version is on in December) |
| Floating header: event line, date, countdown, button | `.fb` (appears after a little scroll) |
| Phone bottom bar | `#mbar` (phone width) |
| Headline and pill | `#h1`, `.hpill` |
| Stats strip ($1.4M, about 80,000 readers, 0 sales calls) | `.tstrip` |
| The video in her window | `#vsl` |
| Day 1 to 3 rows, each with its date card | `#days .drow`, date card `.dwhen` |
| Session times by city with pins | `.ftimes` |
| Calendar invite over the First Class photo | `.claim` |
| Prize: the draw tickets | `.tix` |
| Free gift (calculator) | `#gift` |
| Student results | `#reviews` |
| Her signature, written in ink | `.sig-w` |
| The final call to action | `#final` |

Other pages, same two ways:
- `confirmed/index.html` and `vip-confirmed/index.html`: the Gmail inbox (with the zoom-in), the WhatsApp chat, the
  calendar steps.
- `vip/index.html`: the one-on-one WhatsApp chat, the VIP pieces.
