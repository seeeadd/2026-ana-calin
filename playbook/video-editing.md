> Generic rules for every client. Client specifics (colours, fonts, world, assets) live in `clients/<client>.md`;
> examples below come from Ana Calin's pages, where these rules were learned.

# Video editing: how Sean wants videos cut, framed and finished

Source: the Nov 1 film rounds, the script doc's editing notes, Sean's Nov 4 brief, and every note on Ana's registration
and VIP videos (Nov 4 to Nov 9; full list in `seeeadd/2026-ana-calin` `playbook/HANDOFF-video-chat.md`). Update this file
after every video round.

## 1. Purpose comes first

- Every video has one job and one action, for example the registration video's "register" (put name and email in
  the form beside it). Everything in the cut serves that action.
- No second CTA.
- The video should make this event look like more effort went into it than anything the client has done before.
- **Plan first on a new video:** transcript, cut list, shot list (line, the belief it builds, how it's shown, the
  rule), locations, the character's jobs, the phone layout. Wait for Sean's OK, then build.

## 2. The talking head is the anchor

- When the client has recorded herself, she stays on screen most of the time. Graphics change around her.
- **Three shot types, alternating:**
  - **main:** her video big, with graphics, stickers and the character on top of it as an overlay. On a phone this
    is true full screen, her video under the animations.
  - **framed:** her video inside a painted frame on the painted world.
  - **cut-away:** the graphics big, her small (a camera tile in a corner, so she's never gone for long). Full frame is
    for proof (numbers, screenshots), the days, the gift.
- A raw recording without burned-in subtitles can go full screen at times, in both shapes.
- Stay on her face for humour, pattern interrupts and the humble moments ("my first workshop sold two copies").
- **Cut pass first,** and report it: retakes, false starts, garbled lines, self-corrections, gaps where she isn't
  talking, swallowed or repeated words. Cut on the thought, not on the word. Keep natural breaths.
- Check every cut against the raw recording's word timings: a cut must never clip a word (Ana's "spreadsheet" lost
  its end at a cut and read as "spread" until it was restored).

## 3. Frame and format

- **Two renders of one edit:** the page window's shape for desktop, 9:16 for phones, chosen by the player.
- **Match the page window, not 4:3.** Ana's registration window is 1.548:1, so desktop renders at 1560 x 1008. The
  VIP page puts the video under an arch at 16:9. Measure the player before rendering.
- **Filling the frame around a portrait source:** a graphic, never AI expand or plain blur. Her own sky or background
  can look like "a cloud" behind her; build the scene instead.
- **Crop for the face, not the location:** sit closer and let the crop follow her face (smoothed within each take).
  Sky is a sliver.
- **Look:** warm, even exposure on her face; skin natural, not smoothed. Don't recolour her clothes or lips.
- **Speed:** Sean speeds the final up (1.25x on the registration video, 1.2x on VIP). Speed her voice (pitch kept)
  and the picture; music and effects stay at normal speed, re-placed on the new timing.

## 4. Captions (the video autoplays muted)

- Her words from the first word, including the opening seconds on phones. The first frame is her speaking plus a
  readable caption. No logo intro.
- One short thought at a time, two lines max, each word inking in as she says it.
- **No paper behind captions.** Straight on the scene: bold ink with a thick cream sticker outline and a soft glow,
  key words larger, soft yellow highlight on key phrases, the client's accent colour on one word at most.
- Readable on the busiest background it crosses, in every shape. Two-line captions on phones rise so they never run
  off the bottom.
- **Font:** a sans at 700 to 800 for body captions (Ana: Manrope), the serif for single big words or numbers.
- Key numbers get their own caption ($1.4M; 16,000; 771 likes vs 82).
- Captions must match what she actually says. When the audio is cleaned, check the words again (section 7).

## 5. Graphics in the video

- Same system as the pages: `graphics.md`, including **at least 2 make-and-judge cycles** for every new graphic
  (section 8) and the video graphic rules (section 9). New locations go to Sean as stills before any video render.
- **Use the page's real pieces first,** recorded from the page or copied from its code: the form typed into, the
  button pressed, the header, cards, day map, calculator, slides. Show the real flow, not metaphors. Make something new
  only where the page has nothing.
- Follow Jason Fladlien's rules (`seeeadd/fladdy`; for Ana, `tools/film/FLADLIEN-FOR-VIDEO.md`). The biggest words are
  the ones that matter; one idea per shot; something changes about every six seconds; things appear as she says them.
- **The client's mood board** (Ana: `tools/film/pinterest/`, `cut/`, `tex/`): use it, but each piece lands only on the
  line it means.
- **Locations:** vary them for variety: her home, her workspace, the world outside. Each location gets its own motion,
  the character interacts with its objects, and windows show the world's moving scene in the glass only.
- **The character (Ana's sunflower):** on screen the whole video with a job (runs, leaps, sits, points, celebrates),
  never removed, never hidden behind a piece, never covering one, arms shorter than his legs. Give him a costume when
  the page earns it (the VIP sunflower wears a king crown).
- **Info pieces sit on top and up high** when there's space. Nothing overlaps or clips. Her face is never covered,
  camera tiles show her whole face, and a torn paper edge fully hides the video edge behind it.
- **Every object has a job or it comes out.** No props to fill space. No thin generic arrows: arrows are painted
  objects. No pink on pink. No decorative sparkles. Cut-out hands reach in from the frame edge.
- No dates baked into the core video.
- No generic AI visuals ("AI changed the order" shows her real material, not a glowing brain).

- **Page pieces are cut-outs of the live page, never rectangular crops.** Shoot the element with Playwright on a transparent background (omitBackground; hide the rest of the page with visibility so the element keeps its real shadow and rounded corners; a 30 to 40px margin). Where the page animates (a demo, a gif), freeze it frame by frame (Web Animations currentTime) and play it with `it.seq`, never a still. Show the real tool (the questions, the calculator itself), not its locked teaser or progress bar. Check every frame for dates. (2026-11-09)

## 6. Opening, closing, transitions

- **The opening is the showpiece:** energetic, fun, creative, the background always moving, the character in action,
  captions from the first word. On phones especially, the first seconds must not be empty.
- **The closing is as important as the opening:** the call to action is a designed moment. For a live event, make it
  feel live and at a set time: Ana's close has "live." big, a pulsing "LIVE on Zoom" badge (the page's own LIVE mark)
  hitting on her word, "Block the time in your calendar.", the character celebrating, and a short hold (about 1.6 s)
  on her last frame so it can be read.
- **Transitions are objects in the story:** shutters or a door swinging to the next place, a page turn, the
  character running across as a wipe, a red thread, an iris on her face. Never a stock crossfade or slide.

## 7. Sound

- **Her voice first, levelled and clean,** faded in over the first 2 seconds (a hard start was "a jump scare").
- **Cleaning:** send Sean the cut audio. He runs Adobe Podcast Enhance twice: V2 (stronger, the base) and V1 (gentler).
  Enhance can change words ("Exit Plan" came back as "Exit Fan"). Find changed words by transcribing the original and
  V2 and diffing against the captions. Speech-to-text also mishears her accent, so only words that differ from her
  original count. Splice V1 in for those words at quiet points, matched in level and tone. Use her original only if V1
  also changes a word, and clean it hard, because it carries the ocean noise. Sean's ears decide.
- **Effects from the client's world,** not mouse clicks and whooshes. Sean downloads them; files often hold several
  takes and long silences, so trim to one clean take each. Sit them about 17 dB under the voice, one per real moment:

| Moment | Sound |
|---|---|
| Place changes | shutters or a door, with a breath of chimes |
| The character's leaps and runs | a pitched pluck and footsteps |
| Stamps and crossed-out words | a stamp and a pen |
| Rows and lists landing | climbing notes |
| Each day | a rising bell |
| Unlocking | a key |
| Forms | typing and a click |
| The live close | a bell |

  Leave the serious story silent ("only two people").
- **Ambience** (Ana: the sea) "just a little bit": about 30 dB under her voice, softened, muffled through the door
  inside rooms, quieter on the serious story, stepping back under music. It was too loud twice before landing there.
- **Music at the opening and closing only,** never under the whole video.
  - Instrumental under her voice, never singing under the call to action.
  - Present in her pauses: it gives up her consonant band (about 1.5 to 5 kHz) and dips while she speaks.
  - Ana: about 35 s at the opening, a little louder for the first 10; about 12 s at the close, with the song's hook
    landing on her last word.
  - "Almost the same volume as the sea" was inaudible. About 19 dB under her voice, louder in her pauses, worked.
  - Loop or join a song only at matching bars (measure chroma and onsets).
- You can measure sound but not hear it: tell Sean exactly where to listen.

## 8. The engine and pipeline

- **New videos use the kit** (Ana's repo: `tools/film/VIDEO-KIT.md`): one engine, one small config per video, five
  layers rendered separately (world, actor, her, graphics, captions), so a note only repaints what changed.
- **Drafts for every round** (half size, 15 fps, minutes), the full final once near the end. A full final at full size
  is about 5,800 frames per shape for 3 minutes, so it takes a while; never re-render everything for a one-line note.
- **Robustness:** two renders at once on one machine crashed parts; cap the workers, retry, and check every part has
  all its frames before joining.
- **Web copy:** H.264, `-movflags +faststart`, about 30 MB for a 2 to 3 minute video (1200 wide desktop, 720 wide
  phone).
- **Checks before sending:** an OCR scan for dates on every second; her words against the captions; a contact sheet of
  both shapes for clipped pieces, hidden character, covered face and readability.

## 9. Before showing Sean

1. **Plan first,** then stills for any new graphics (after their make-and-judge cycles), then a draft.
2. **Send drafts early,** labelled as drafts, with honest times. He wants visible progress, not silence.
3. **Send it with timings** ("0:00 hook, 0:12 proof...") and say what was checked by measurement and what needs his
   eyes or ears.
4. **One independent review pass on the final,** not on every round.

## 10. Hosting

- Page videos play from a video host (Ana: Wistia, `assets/wistia-vsl.js`). A silent preview of the first 8 seconds
  loops; a press restarts her from the top with sound; phones open the portrait version full screen, and when it ends
  the page scrolls to the form or order card.
- Never commit video files to the site repo. Give Sean the web copy to upload.

## 11. Keep it cheap

- A fresh chat for each video, starting from the kit guide.
- Notes in batches; contact sheets, not frame by frame; one review agent pass at the end.
- The first video took about 5.1M new tokens in one long chat. The target per video is about 200k.
