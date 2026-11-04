# Video kit

One engine, one small config per video. Every video is `kit.html?video=<id>`. Start each new video in a fresh session with this page and nothing else.

## A new video

1. `cp -r tools/film/videos/_template tools/film/videos/<id>`, replace `CHANGE-ME`.
2. `cut.json`: recording path, what to cut, end. Run `python3 tools/film/kit/prep.py <id> words`, write `captions.txt` from what it prints (`*key word`, `-` line a graphic carries), then `prep.py <id> data` and `prep.py <id> frames`.
3. `config.js`: shots, rooms, sunflower, pieces. The template's comments are the reference. Her page pieces are listed in `SITE-ASSETS.md` (grep it, don't read it all). Check with stills: `python3 tools/film/kit/stills.py <id> a "12.3,45.6"`.
4. `tools/film/kit/draft.sh <id>` and show Sean the draft right away. Reviews run alongside, never as a gate.
5. Sound: `python3 tools/film/kit/audio.py <id> cut`, put that through Adobe Enhance twice (v1, v2), name both in `audio.json`, list the word swaps (`hear` checks them), then `words`, then `mix`.
6. Notes: edit the config, run `draft.sh` again. Only what changed is painted. A one-word caption note is `capEdits` in the config.
7. `tools/film/kit/final.sh <id>` for full size, both shapes, plus web copies. Output goes to `~/AnaVideo/out/kit/`. One review pass, then publish only on Sean's word.

The local server `ana-render` (port 8768) starts by itself if it is down. Add `--from s --to s --shape d` to any render for a piece of the film. For a sped-up delivery set `"speed": 1.25` in `audio.json`, run `mix`, then add `--speed 1.25 --audio <that mix>` to the render: her voice and the picture speed up, music and effects don't. The renderer retries a stalled browser and uses fewer workers on a busy machine; still, don't run two renders at once.

## Added for the VIP video (see `videos/vip/config.js`)

`desktopW` for a page window that isn't 1560 wide. `herH: 1280` keeps her whole recording, for the phone running her full under everything (`layout.p.M`, `strips`). Shot type `W` is her big, centred, torn paper both sides. `roomViews` is another angle on a room, `extraRooms` a new one, `crown` is his hat. A song that needs looping goes through a built bed (`videos/vip/music.py`): measure the bar, line the joins up to the sample. Before each draft, check overlaps in the DOM per shape, and scan every final's text for dates.

## New graphics

Every new location, illustration or key prop gets at least 2 make-and-judge cycles, viewed in context in both shapes, before stills go to Sean, and no video render until he approves the stills. The rules are in `playbook/graphics.md` sections 8 and 9: read those two sections before drawing anything. Keep cycles cheap: stills, a contact sheet, one fresh judge per cycle at most.

## Read and don't read

| Read | Don't read |
|---|---|
| this page | `kit/engine.js` (about 23k tokens), `kit/engine.css` |
| `videos/_template/config.js` | `regfull.html`, `regvid.html`, `film.html` (the first video and older cuts) |
| your own `videos/<id>/*` | `sean-messages.md`, `HANDOFF-video.md`, `SHOT-LIST-registration.md` |
| `videos/registration/config.js`, only by grep, to copy one piece that already exists | `_local/*-data.js`, `_local/*-face.js`, render logs |

Touch the engine only for something no config can say, and then check it with `kit.js registration --from 0 --to 20`: nothing that didn't change should repaint.

## What a note costs

Five layers, each kept on its own: **world** (sky, sea, rooms), **actor** (sunflower, shutters), **her** (video and frame), **graphics** (pieces, arrow, pointer), **captions**. Grain goes on last. A plan pass asks the engine what each layer would show on each frame, without painting, and each shot piece gets a key from that. Same key, no paint.

Measured on the first 20 seconds of the registration video, desktop / phone:

| Job | Old pipeline | Kit |
|---|---|---|
| Full render from nothing | 49 s / 90 s | 98 s / 137 s (five layers instead of one, once) |
| One caption changed | 49 s / 90 s (all of it) | 14 s / 17 s (captions of one shot) |
| Nothing changed | 49 s / 90 s | 2 s / 2 s |
| Draft, half size, 15 fps | none | 22 s / 35 s |
| Whole 3:12 film, draft | none | 2.8 min / 4.6 min, measured |

So: drafts for every round of notes, `final.sh` once near the end, then late notes cost seconds. A whole first final should take about 16 / 22 minutes (scaled from the 20 seconds, not measured).

## Token budget

The first video: 5.1M new tokens and 183M cached re-reads, in one long session. Cached re-reads are context size times calls, so the levers are a small context and few calls. These are targets, not measurements yet.

| Stage | New tokens |
|---|---|
| Start: this page, template, her captions | 10k |
| Config for a 3 minute video | 40k |
| First draft and fixing it, from contact sheets | 40k |
| Each round of Sean's notes | 10k |
| Sound | 15k |
| The one review pass | 40k |
| **Whole video, with 5 rounds of notes** | **about 200k** |

- Stop and start a fresh session when context passes 150k, with a five-line handover.
- Batch tool calls. Look at one contact sheet from `stills.py`, not frame after frame, and at drafts only where a note landed.
- Task review agents: a single final pass. They were 57% of the new tokens last time.
- Run long renders in the background and wait to be told. Don't poll.

## Disk

A final's layers take about 10 GB per video for both shapes (scaled from the 20 seconds); drafts about 100 MB. Delete `~/AnaVideo/work/kit-cache` freely after a final; the only cost is the next render being cold.
