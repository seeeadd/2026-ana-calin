# Client: Ana Calin (How We Grow) · The Exit Plan

## Facts (check before using; the newest copy doc wins)

- **Event:** The Exit Plan, a free 3-day live event on Zoom.
  - **Dates:** Tue Dec 8 to Thu Dec 10, 2026.
  - **Time:** 12:00 pm New York (5:00 pm London, 7:00 pm Greece, 9:00 am Los Angeles).
  - **Length:** about 90 minutes a session.
- **Ana:**
  - about 80,000 readers; $1.4M from workshops and programs; 0 sales calls; 16,907 buyers;
  - lives in a village in Greece, works about two hours a day;
  - her first workshop sold two copies.
- **Proof (always labelled "from Ana's past challenge, results vary"):**
  - Jill Hart, $3K in a month from about 300 readers;
  - $3,200 from 547 subscribers;
  - $2,400 from 198.
  - Do not use the old "47 of 300" or "$47" stories.
- **The gift:** the Exit Number calculator (`/exit-number/`), unlocked by 7 survey questions. It's a planning tool,
  not a prediction.
- **The prize:** five 1:1 sessions, drawn from people still live at the end of Day 3.
- **VIP:** $67 once:
  - lifetime recordings;
  - a private WhatsApp group during the event;
  - the live group review;
  - the Offer Clarity Sprint.
- **Program:** The Exit Lab.
- **Site:** https://exitplan.howwegrowtoday.com · **repo:** seeeadd/2026-ana-calin · **work branch:**
  `claude/quirky-franklin-etidvi`.

## Brand

- **Colours:**
  - sunflower `#FFD400` primary, Greek shutter blue `#365F8A` secondary, warm ink `#1A1412`;
  - original pink `#F72585` is a third accent, less prevalent than blue; a pink sticky header and a restrained blush section are welcome. Yellow remains dominant;
  - greys `#3D332E` and `#7A6A60`;
  - cream paper `#FFF8EE`;
  - tints: blue `#BFD7EC` / `#9DBEDD`, pink `#FFC6DE`, yellow `#FFE27A`.
  - Keep original bright #FFD400 on CTA buttons, footer, calculator and accents. The footer retains its original grain. Use quieter cream section grounds with selected light blue/blush areas; never dull the accent yellow to achieve a quieter background.
- **Type:**
  - Instrument Serif for headlines and pulled lines;
  - Manrope for everything read, numbers and small labels;
  - Nothing You Could Do for handwritten notes;
  - Meddon for her signature (traced, written in ink, page pink).
- **Marks:**
  - the sunflower smiley (inline SVG symbol `#sf`, Christmas version `#sfx`);
  - the How We Grow wordmark `img/how-we-grow-wordmark.png`;
  - the cartoon Ana `img/fav/header-ana.png` (VIP version with a crown and pink);
  - the Exit Number calculator logo `img/exit-number-calculator-logo.svg`.
- **Her world:**
  - Greek village: whitewash, blue shutters, bougainvillea, terracotta, olive, sunflowers in pots;
  - coffee, letters and envelopes;
  - her own big paintings (pink, turquoise, a plant in an orange pot);
  - her toddler.
- **Her look (Nov 7):** warm, confident and handmade, with a quieter page. Ana explicitly found the earlier pink-heavy page too girly and crowded. Use yellow, cream and Greek shutter blue; keep pink as a small tertiary accent.
- **Art style:**
  - now: her own big paintings (loose pink and turquoise, a plant in an orange pot) and a simple flat sunflower
    cartoon; warm, hand-made, a little naive;
  - rating: real but thin, so it's elevated in the same direction: the painted look (graphics §3b), with watercolour,
    gouache, pencil, more shadow, texture and detail ("a bit too simple, elevate it");
  - made by Claude with the paint engine; Gemini only for her photos and sometimes badges.
- **Voice:** first person, warm, plain, a little dry ("Very efficient."). No hype, no scolding, no pressure. No em
  dashes.

## Assets

- **Photos:**
  - `img/real/ana-studio.webp` (newest, painting wall);
  - `img/real/ana-real-*` and `ana-live-*` (her Shorts stills);
  - `img/real/ana-sunshine.webp` (Ana’s supplied Nov 7 closing photo; replaces the plane picture on registration);
  - `img/ana-hat.webp`.
- **Originals:**
  - YouTube Short 6AV65yCJNzU (painting wall);
  - Short vxGJ8TjtnC4 (kitchen).

  YouTube's stills are at `i.ytimg.com/vi/<id>/maxres1.jpg` (and `2`, `3`, `default`); the sharp centre is 405 x 720.
- **Painted pieces:** about 90 in `img/vip/paint/`, including:
  - door, window and shutters, laptop, phone, coffee, pencil, planner, envelope, seal, chairs, table, notes,
    stamps, petals;
  - the Christmas set;
  - `ana-frame`, her picture frame;
  - `ana-painting-sticker.svg`, her painting as a sticker.
- **Slides:** `img/slides/day1a..day3b.webp` (redacted teaser slides), `s1..s6`.
- **Sean's mixed media:** `tools/film/tex/` (paper, linen, kraft, dot-grid, Greek windows and doors), `tools/film/cut/`
  (stickers, torn strips, hands, stamps, string lights).

## Pages

| path | page |
|---|---|
| `/` | registration |
| `/vip/` | VIP upsell |
| `/confirmed/` | free confirmation |
| `/vip-confirmed/` | VIP confirmation |
| `/program/` | The Exit Lab |
| `/exit-number/` | calculator |

Registration uses `assets/registration-vsl.js`: Wistia 995puecipz on desktop and z5mv5t5sf5 in the phone overlay. Start loading immediately; use a quiet loading state until the first frame, never the old yellow portrait. The registration script is separate from VIP’s `assets/wistia-vsl.js`.

## Motion and density (Nov 7 follow-up)

- Compact conversation cards inside one softly tinted panel; Justin’s profile portrait sits beside his caption, outside the call photo; never cover either face. Names and descriptions stay tightly grouped.
- Subtle backgrounds in selected sections, with plain sections between them.
- Glass sound control with animated speaker waves; a drawn yellow CTA perimeter with a warm glow and fine texture; a gentle broadcast pulse on the closing word “live,” alongside the upcoming dates.
- Replay illustrations when visitors return; Day slide previews loop while visible. Respect reduced motion.
