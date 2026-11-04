# Video editing: how Sean wants videos cut, framed and finished

Source: the Nov 1 film rounds, the script doc's editing notes, and Sean's Nov 4 brief. Update this file after
every video round.

## 1. Purpose comes first

- Every video has one job and one action, for example the registration video's "register" (put name and email in
  the form beside it). Everything in the cut serves that action.
- No second CTA.
- The video should make this event look like more effort went into it than anything the client has done before.

## 2. The talking head is the anchor

- When the client has recorded herself, she stays on screen most of the time. Graphics change around her.
- Cut-aways go full frame only for:
  - proof (numbers, screenshots);
  - the three days;
  - the gift.

  During a cut-away she shrinks to a small camera tile in a corner (as in the Day 1-3 screen-share decks on the
  page), so she's never gone for long.
- Stay on her for humour and pattern interrupts. On "My first workshop sold two copies", stay on her face.
- Remove repeated takes and setup chatter; keep natural breaths. Cut on the thought, not on the word.
- **Do a cut pass first** and report it: word gaps from the transcript, audio silences, false starts, garbled lines,
  self-corrections. Say which cuts land under a shot change and which would show as a jump.
- **Three shot types, alternating** (Nov 4):
  - **main:** her video big, with graphics, stickers and the character on top of it. On a phone this is true full
    screen. In a landscape frame she fills the full height and blends into the scene on one side (edge to edge would
    crop her face).
  - **framed:** her video inside a painted frame on the painted world.
  - **cut-away:** the graphics big, her small.

## 3. Frame and format

- **Portrait source (9:16), landscape player.** Never deliver 9:16 for the page.
- **Sean prefers 4:3.** Check the player first: the registration window is **1.548:1** (676 x 437 at 1440 wide),
  so a 4:3 file would lose about 14% top and bottom. Either:
  - change the window's aspect to 4:3 (recommended if Sean wants 4:3; it's one CSS line plus the painted frame's
    offsets);
  - or render at about 1.55:1 (1560 x 1008).

  Ask once, then note the answer here.
- **Two renders of one edit (Nov 4):** the page-window shape for desktop and 9:16 for phones, chosen by the player.
- **Filling the frame around a portrait source:** a graphic, not AI expand or plain blur. Her real sky recoloured into
  a two-colour wash on paper, with a painted world in front.
- **Portrait placement:** her 9:16 clip about 60 to 70% of the frame height, inside a brand frame (painted
  window, painted picture frame or a modern phone), with a soft close shadow, on a built background (painted room,
  paper, Greek window). A raw blurred copy of the same video behind her is the last resort; if used, tint it
  toward the cream paper so it doesn't read as "phone video in a landscape box".
- **Look:** warm, even exposure on her face; skin natural, not smoothed. Don't recolour her clothes or lips.

## 4. Captions (the video autoplays muted)

- The first lines must work with no sound. First frame: her speaking plus a readable caption. No logo intro.
- One short line at a time, two lines max, words appearing as said (each word fades and unblurs in about 0.5 s,
  70 ms apart).
- ~~On torn paper strips (kraft, pink, cream from `tools/film/cut/`), slightly rotated, rotating through the three.~~
  (Nov 4: no paper behind captions.) Straight on the scene: bold ink with a soft cream glow, soft yellow on key words.
  The whole thought is readable at once and each word inks in as she says it.
- **Font:** the film used Instrument Serif at 64 px on 1080p; for a talking head Sean prefers sans for reading,
  so use Manrope 700 to 800 for body captions and keep the serif for single big words or numbers.
- Key numbers get their own caption ($1.4M; 16,907 buyers; 771 likes vs 82).
- Replace burned-in subtitles. While only the subtitled file exists, cut with it and park our captions on a
  separate layer.

## 5. Graphics in the video

- Same system as the pages (`graphics.md`): painted world, real proof, the sunflower character as the guide.
- Reuse existing pieces before drawing new ones:
  - `tools/film/film.html` scenes: the running wheel, the usual-order tower, Ana's room, the two-sale workshop,
    the comments, the order flip, the door to 2027, the live sessions with slides, results, the calculator,
    the 1:1s;
  - `img/slides/` (the teaser slides);
  - `img/vip/paint/` (painted objects);
  - `tools/film/tex` and `cut` (Sean's textures and stickers).
- Show outputs, keep the client's method off screen (redaction bars and lock stickers on slides).
- **No generic AI visuals.** For "AI changed the order", show her real working material (questions, comments,
  replies sorted), never a glowing brain or robot.
- No dates baked into the core video. Dates are a separate insert recorded later.
- **Every object has a job or it comes out.** No props placed to fill space ("why is it there?").
- **Arrows are painted objects:** thick, hand-made, with a real head. Never a thin annotation line.
- **Words on graphics are big and high contrast:** ink on yellow, never pink on pink.
- **Scenery comes from the paint engine,** with texture and detail, never flat vector shapes.

## 6. Transitions

Transitions are objects in the story:
- a door or shutters opening onto the next scene;
- a page turn;
- the sunflower running across the frame as a wipe;
- a red thread drawn from one beat to the next;
- an iris on her face.

Never a stock crossfade or slide.

## 7. Sound

- Her voice first, levelled and clean.
- Music only if Sean asks: soft, warm, under the voice (about -24 dB under speech).
- No whooshes on every move.

## 8. The engine and pipeline

- **Engine:** `tools/film/*.html` pages with `window.render(t)` and `window.DUR`; every frame is a pure function of
  time.
- **Video layers:** play her video as a `<video>` element and seek it in `render(t)`
  (`video.currentTime = t - offset`, then wait for `seeked`), or pre-extract frames with ffmpeg into a folder and
  swap image sources per frame (more reliable for frame-exact renders).
- **Serve:** `cd /home/user/2026-ana-calin && python3 -m http.server 8767`.
- **Contact sheet:** `FILM=<page>.html node tools/film/render.js --sheet <dir>/x.png 2,8,15,...`. Check staging
  before every full render.
- **Full render:** `FILM=<page>.html SUB=2 CRF=20 node tools/film/render.js out.mp4 30`. Use `SUB` for motion
  blur. Render stretches in parallel with `T_FROM`/`T_TO`, then join them with ffmpeg concat.
- **Audio:** mux her audio after the render: `ffmpeg -i video.mp4 -i her.mp4 -map 0:v -map 1:a -c:v copy -c:a aac
  -shortest out.mp4`, offset with `-itsoffset` if the cut moved.
- **Web copy:** H.264, `-movflags +faststart`, CRF about 23, about 1.5 MB per 10 s at 1440 wide. Make a poster
  frame for the player still.
- **Grain:** static only. Per-frame grain bloated a render to 89 MB.

## 9. Before showing Sean

1. **A test first:** 20 to 30 s of the default shot and one cut-away. Don't render the full piece until he says
   it's the direction.
2. **Check the contact sheet against the script beats.** Captions match what she says; no empty caption boxes; no
   cropped face; nothing outside the frame; the first frame is good.
3. **Send it with timings:** "0:00 hook, 0:12 proof...". Say how long the full render will take.
