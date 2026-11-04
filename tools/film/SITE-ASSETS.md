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

Built in code (record from the page):
- `index.html`: the floating header with the countdown, the ticket-shaped form, the Google Calendar week and invite,
  the video-call icon, the Day 1 to 3 cards with the visitor's own time, the signature animation.
- `confirmed/index.html` and `vip-confirmed/index.html`: the Gmail inbox (with the zoom-in), the WhatsApp chat, the
  calendar steps.
- `vip/index.html`: the one-on-one WhatsApp chat, the VIP pieces.
