# Handoff: the Ana Calin video chat (Nov 4 to Nov 9, 2026)

Read this first in a fresh chat about Ana's videos. Then read `tools/film/VIDEO-KIT.md` (how to make a video now), then
the playbook repo's `video-editing.md` and `graphics.md` sections 8 and 9. `CLAUDE.md` and `playbook/HANDOFF-main-chat.md`
cover the website and the repo rules; this file covers the videos. Every message Sean sent in this chat and the VIP video
chat is in `playbook/transcripts/video-chat-digest-2026-11-04_to_11-09.md`.

## 1. Who, what, where

- **Sean** runs the work and gives the notes, by voice: words come through loosely ("C" meant "sea", "hyperfocus" meant
  HyperFrames, "Anna" is Ana). **Ana Calin** is the client. Never send anything to her or to leads.
- **The job:** talking-head videos for her event pages (The Exit Plan, a free 3-day live workshop on Zoom). Her real
  recording plays on her painted Greek world, with the sunflower character and the page's own pieces as graphics.
- **Done so far:**
  - **Registration (opt-in) video:** finished and approved ("looks amazing, great job").
  - **VIP video:** finished and published once in a separate chat. A rebuilt opening is ready but not live (section 6).
- **Next:** more page videos as Ana sends recordings. Each one is made with the kit in a fresh chat.

| What | Where |
|---|---|
| Site repo | `~/AnaVideo/2026-ana-calin` = `seeeadd/2026-ana-calin`, branch `claude/quirky-franklin-etidvi` (main = branch at Nov 9) |
| Playbook repo | `~/AnaVideo/afterharvest-design-playbook` = `seeeadd/afterharvest-design-playbook`, same branch name |
| Video kit | `tools/film/kit/`, `tools/film/kit.html`, one folder per video in `tools/film/videos/<id>/`, guide `tools/film/VIDEO-KIT.md` |
| First video's engine | `tools/film/regfull.html` (finished, frozen). Its frames and data are in `tools/film/_local/`, local only |
| Scripts used in this chat | `~/AnaVideo/work/` (`render_fast.sh`, `stills.py`, `speed125.sh`, `patch_seg.sh`, `patch_close.sh`, `adobe/build.py`, `adobe/stt.py`, `adobe/cmp.py`, `sfx/*.py`) |
| Outputs | `~/AnaVideo/out/` (registration) and `~/AnaVideo/out/kit/` (kit renders, VIP) |
| Raw recordings | registration `~/Downloads/AfterHarvest Channel Video.MOV`; VIP `~/Downloads/ana calin vip raw .MP4` |
| Sound effects, song, Adobe audio | `~/Downloads/ana calin sound effects/` |
| Local render server | `ana-render` on port 8768 from `~/.claude/launch.json` (start it with the Browser pane's preview_start, not Bash) |
| Python | `~/LoomAutomation/.venv/bin/python` (faster-whisper small.en, PIL, OpenCV, SciPy). Node modules: `NODE_PATH=~/AnaVideo/work/node_modules` |

## 2. How the videos are hosted (live)

- Both pages play from **Wistia** through `assets/wistia-vsl.js`. A silent preview of the first 8 seconds loops; a press
  restarts her from the top with sound; on phones the portrait version opens full screen, and when it ends the page
  scrolls to the form (registration) or the order card (VIP).
- Media ids:
  - **Registration:** desktop `995puecipz`, phone `z5mv5t5sf5`.
  - **VIP:** desktop `5j7jxvhlbz`, phone `t0jit9k8nm`.
- Do not re-add self-hosted videos to Git. `assets/video/` is in `.gitignore`, and the local copies there are only for
  testing.
- New cut, same page: export the web copy and give Sean the file to upload to Wistia, or swap the media id once he has
  uploaded it.
- **Publishing:** only when Sean says "publish". The main chat's handoff, section 2, has the steps (push to main, then check
  the live page).

## 3. The registration video: final state

- **Shapes:**
  - **Desktop:** 1560x1008, the page window's 1.548:1. Not 4:3, because the painted window art breaks at 4:3.
  - **Phone:** 1080x1920.
  - Two renders of one edit.
- **Length:** 3:12 at normal speed. Sean then asked for **1.25x** for her voice and the picture, with music and effects at
  normal speed, which makes it 2:34.
- **Files in `~/AnaVideo/out/`:**
  - `ana-exit-plan-v10-{desktop,phone}.mp4`: the normal-speed masters, with the paper-edge fix and final mix.
  - `ana-exit-plan-125x-{desktop,phone}.mp4` and `ana-exit-plan-web-125x-*`: the 1.25x cut.
  - `ana-exit-plan-mix.wav` and `-mix-125.wav`: the mixes.
  - `ana-exit-plan-clean-audio.wav`: her voice.
- **Not verified:** which cut went up to Wistia. The main chat set up Wistia, so check the live length (2:34 is the 1.25x
  cut).
- **Cuts:** retakes, false starts and gaps came out. EDL in `tools/film/_local/full-data.js`; cut list in
  `tools/film/SHOT-LIST-registration.md`.
  - **Word clipped by a cut:** the cut at 0:18 had clipped "spreadsheet". The end of the word was restored from the raw
    recording, sped up slightly to fit.
- **Shot types:** Main (her video big, graphics on top), Framed (gold frame on the painted world), Cut-away (the piece
  big, her small).
- **Locations:**
  - **The coast:** painted bay, hills, village and sea, always moving.
  - **Her studio:** pink velvet chair, her painting, a white cabinet, fluted arched wardrobes, a petal pendant, a gold
    mirror, a fish rug.
  - **Her desk room:** an oval travertine desk, her monitor showing her slide, ribbed vase with ranunculus, a candle, a
    pleated lamp, a leaning mirror, a bookcase.
  - The rooms' doors show the moving bay through the glass only. Room art is `tools/film/rooms.html`, painted through the
    paint engine.
- **Room motion:** curtains sway and billow when the sunflower runs past, pendants swing, sunlight shimmers with dust,
  lamps glow, bougainvillea petals fall, the candle flickers, and a cursor moves on her monitor.
- **The sunflower:**
  - Runs in the opening and leaps two pots.
  - Sits on her chair through "only two people".
  - Walks the desk.
  - Points at things.
  - Bounces through the closing hold with both arms up.
- **Closing:**
  - "live." is big and pink.
  - A pulsing "LIVE on Zoom" badge (the page's own LIVE mark) beats harder on her word.
  - "Block the time in your calendar." with a calendar icon.
  - A 1.6 s hold on her smile, ship bells ringing and clock ticks under it.
- **Sound:**
  - Her voice is Adobe Enhance V2, with V1 spliced in for the words V2 changed, and "spreadsheet" from the raw recording.
  - Effects come from her world.
  - Soft sea: muffled in the rooms, quieter on the serious story.
  - "Each Day Gets Better" by John Legend (section 5).
- **Checks run:**
  - OCR scan for dates on every second: none on screen.
  - Speech-to-text of her words against the captions.
  - An independent review of every frame in both shapes. Every must-fix was fixed: the sunflower hidden or missing, cut
    wrists on hands, and clipped or overlapping pieces.

## 4. Sean's video preferences (all of them, from this chat)

The playbook files hold these as rules; this is the full list in one place.

**Look and graphics**
- Her background is a graphic, not AI, not plain blur.
- Graphics go on top of her video as an overlay, and sometimes her video is the main picture with graphics over it.
- On phones (said for VIP), her video can run full under the animations.
- Raw recordings without burned-in subtitles can go full screen.
- Use the page's real pieces first, recorded or copied from its code: form, button, header, cards, map, calculator.
  Make something new only where the page has nothing. Type into the real form, show the real flow, not metaphors.
- Follow Jason Fladlien's rules (`tools/film/FLADLIEN-FOR-VIDEO.md`, `seeeadd/fladdy`).
- Shot list before rendering: line, belief, how it's shown, rule.
- Pinterest assets (`tools/film/pinterest/`, cut-outs in `cut/` and `tex/`): use them, but only on the line they mean.
- No props without a job ("why is the olive plant there?"). No thin "Claude-looking" arrows. No pink on pink. No paper
  behind subtitles. No decorative sparkles.
- Texture and detail: water and landscape textured; rooms need "more details and effort per stuff", real interior
  design from his references (furniture, decor, floors, carpets, wallpaper, paint, textures, lighting, wall art, mirror,
  reflection, flowers).
- Windows show the bay, mountains and water, only in the glass. Walls are not windows.
- New graphics get **at least 2 make-and-judge cycles** before he sees stills (`graphics.md` section 8). If he asks to see
  a draft sooner, send it right away.
- Info pieces sit on top, never underneath, and up high when there's space, clear of the mountains.
- Her face is always whole: crop her video for the face, not the clouds; camera tiles show her whole face; no card over
  her face. Check every instance in both sizes.
- The paper (torn) edge must fully hide the video edge behind it.
- Cut-out hands reach in from the frame's edge, so cut wrists never show.

**The sunflower**
- On screen the whole time with a job, never removed ("Where the hell did you put the sunflower?").
- Arms shorter than his legs.
- Creative: interacts with locations, runs, leaps, sits, points.
- VIP: a king crown ("since he's VIP").

**Captions**
- Her words from the first word, including the opening seconds on phones ("she's making a claim there").
- Readable on any background: sticker outline and glow, no paper. Key words larger.
- The phone opening must not be empty: the first seconds matter most.

**Energy and structure**
- The opening is the showpiece: energetic, fun, creative, background always moving.
- The closing is just as important as the opening.
- The CTA close on a live event: make it feel live and at a set time ("not prerecorded, I have to block this in my
  calendar"). He chose "LIVE on Zoom".
- Vary the location for variety (her room, her workspace; for VIP "reuse bay area and room but different part or diff
  angle, maybe 1 new location", congruent with the VIP page).
- No dates in the core video.

**Sound**
- Cut audio goes to Sean for Adobe Podcast Enhance. He makes V2 (base) and V1 (gentler).
- Adobe changes words ("Exit Plan" became "Exit Fan"). Swap V1 in for those words; use her original only if V1 also
  changes it.
- His ears decide over speech-to-text: he asked for V1 on all swaps, and the original brought back ocean noise.
- Fade her voice in over the first 2 seconds: the start was "a jump scare".
- Sea: "splashing just a little bit", well under the voice. He said it was too loud twice; it ended about 30 dB under
  her voice on the coast, muffled and quieter in rooms.
- Effects from her world, not mouse clicks ("maybe like some bells"), single clean takes, trimmed. He downloads them.
  The file names are deliberate variations; pick the best take.
- Music at the opening and closing only, never the whole video. Instrumental under her voice, no singing under her
  call to action.
  - Heard but not over her: it dips while she talks.
  - Opening about 35 s, louder for the first 10.
  - Closing about 12 s, landing "each day gets better" on her last word.
  - VIP: the "oooh ooh" only once, smooth after, a bit quieter.
- Speed: 1.25x on the registration video, 1.2x on VIP. Voice and picture only; music and effects stay normal speed.

**Pace and communication**
- Show visible progress and drafts early. He hates silent work and long waits ("Chop chop", "thats only like 10 mins
  tops", "its literally a 3 min task").
- Give honest times. Never say something is running before confirming it.
- When he asks "what do you think?", give a recommendation.
- He wants the plan first on a new video, then approval, then build.
- He asks for tokens to stay low: fresh chat per video, batch notes, few review agents.

## 5. Audio recipe that worked (registration)

1. Export the cut audio (`ffmpeg ... pcm_s16le 48k`) and send it to Sean.
2. He returns `Enhance Speech Audio v2.wav` (base) and `v1`. Check they line up with the cut (envelope cross-correlation,
   within a few ms).
3. Transcribe the original and V2 with faster-whisper (`~/AnaVideo/work/adobe/stt.py`) and diff against the captions
   (`cmp.py`). Speech-to-text also mishears her accent ("live" as "life", "proof" as "roof"); only words that differ
   from her original count.
4. Splice the changed words from V1 into V2, at quiet points, with 22 ms equal-power crossfades, matched in tone
   (long-term spectrum ratio) and level (`adobe/build.py`).
5. Loudness: two-pass loudnorm to -16 LUFS, -1.5 dB true peak, padded to the video length.
6. Mix (`tools/film/sfx_mix.py`, now `kit/audio.py`):
   - Effects at single-take peaks about 17 dB under the voice.
   - Sea looped with a crossfade, low-passed 3.8 kHz, about -47 dB RMS on the coast and -52 dB in rooms, ducked under
     the music.
   - Music: notch 1.5 to 5 kHz (her consonants) and dip 50% while she speaks.
   - Limiter at -1.5 dB.
7. Speed: `atempo` on the voice. Effects and music are re-placed on the new timing at normal speed (`SPEED` env).
8. Song joins: "Each Day Gets Better" loops cleanly between 6.24 s and 15.86 s of the song (same bars). The intro at
   15.0 to 16.6 matches the chords just before the hook at 24.6 to 26.18, so the close plays instrumental under her call
   to action and the hook starts on "live". Vocals start at 19.6 s; avoid them under her voice.
9. Effect takes used:

| Effect | Take used |
|---|---|
| Ink stamp | hits at 1.60 and 5.13 s, not the double at 2.91 |
| Door | 0.42 to 1.32 s, 1.45 to 2.05 s, 2.9 to 3.72 s |
| Key ring | 2.28 to 2.92 s |
| Typewriter | keys 0.2 to 2.06 s, not the bell |
| Mouse click | 3.66 s; the file has 3.7 s of silence first |
| Ship bells | from 0.55 s |
| Kalimba | pitched per leap |
| Marimba | single notes climbing |

- **Licence:** the mouse click file looks like a YouTube upload ("Sound Buddy"). Sean was told to check licences for
  the page.

## 6. The VIP video (made in its own chat, `local_693e74e7`)

- Built with the kit as `tools/film/videos/vip/`.
- **Sean's notes there:**
  - Keep "So this is not going to be just three days of you watching me live and go back to your work" (fix the double
    "go").
  - Her background looked like "a cloud": not a fan.
  - Fix the overlaps.
  - Add a WhatsApp logo on the WhatsApp section.
  - Offer Clarity should show the real laptop screenshot more than the mockup.
  - The sunflower gets a king crown.
  - Make the notebook bigger.
  - Use the registration page's new pricing slide.
  - Fix the gap where she repeated "on the".
  - Use his enhanced audio.
  - Music: "oooh ooh" once, smooth, a bit quieter.
  - 1.2x.
- **Status:**
  - The final at 1.2x (1:23) was published to Wistia.
  - Sean later redrew the VIP page door (`img/vip/paint/door*.webp`, hinge now at x 870 of 1110, video under the arch at
    16:9). The door went live; that chat confirmed it live on Nov 4.
  - The VIP video's opening was rebuilt to match the new door, but **not live**. Sean said "forget abt the vod stuff,
    focus on website graphic door change". The rebuilt renders are in `~/AnaVideo/out/kit/` (`vip-final-*`), not
    checked frame by frame.
- **Files:** `~/AnaVideo/out/kit/vip-*`: finals at 1x and 1.2x, web copies, mixes, V1 and V2 audio, stills.

## 7. The video kit (use this for every new video)

- `tools/film/VIDEO-KIT.md`: start each video in a fresh chat with that page.
- **Layers:** five, each rendered on its own (world, actor, her, graphics, captions), so a note only repaints what
  changed.
- **Commands:** `kit/draft.sh` (half size, 15 fps) for every round of notes; `kit/final.sh` once near the end.
- **Measured on 20 s:**
  - one caption change: 14 s / 17 s instead of 49 s / 90 s;
  - a whole 3:12 draft: 2.8 / 4.6 min;
  - a first full final is slower: about 16 / 22 min, estimated.
- **Proof:** the kit's first 20 s matched the finished video (SSIM 0.97 to 0.98).
- **Robustness:** retries and a worker cap. Two render parts once crashed when two sessions rendered at once.
- **Speed:** 1.2x / 1.25x is an option.
- **Tokens:** the first video used about 5.1M new tokens plus 183M cached re-reads in one long chat. Helper agents were
  57% of the new tokens, and the long context cost about 480k tokens per step. The kit's target is about 200k new tokens
  per video:
  - a fresh chat per video;
  - notes in batches;
  - contact sheets instead of frame-by-frame;
  - one review pass at the end;
  - Ultracode off for routine edits.

## 8. Open items

- Confirm which registration cut is on Wistia (1.25x, 2:34, was the last approved).
- VIP: the rebuilt opening door video is not live; it waits on Sean.
- Registration claim: Ana says "less than 300 people on her email list"; Jill's note on the page says "300ish audience".
  Never resolved; ask before reusing that line.
- Remotion was used for one piece only (the income, price and buyers rows). Its licence is free only for individuals
  and companies up to 3 people. HyperFrames was installed but not used.
- `join/index.html` has another session's uncommitted edit in the shared checkout. Don't stage it.
- Disk: `~/AnaVideo/out` 4.1 GB, `~/AnaVideo/work` 6.8 GB, the kit cache about 10 GB per full final
  (`~/AnaVideo/work/kit-cache`, safe to delete after a final). 26 GB free on Nov 9.
- The registration page's final-section photo is now a real one (`img/real/ana-sunshine.webp`). The AI cabin image this
  chat placed was replaced after Ana objected to AI photos of her.

## 9. Mistakes made in this chat (do not repeat)

- Said a render was running when the script wasn't even executable. Confirm with `pgrep` and logs before saying it runs.
- Followed the shot list so literally that the sunflower disappeared. He must stay.
- Told Sean draft videos were out of Git when the commit had only added the ignore rule. `git commit -- <path>` doesn't
  record `git rm --cached` on an ignored path. Commit without a pathspec, then check with `git ls-tree`.
- A `git pull --rebase` in the shared checkout hit a conflict and paused everyone's work. Resolve feedback-log conflicts
  by keeping both sides, finish the rebase, and check the autostash came back.
- Background jobs in side sessions don't always wake them. Nudge or poll in the foreground.
- Long Python audio scripts had small bugs: a crossfade that summed both signals, and a zsh `$b[a]` subscript. Measure
  results, don't assume.
- Ran Python audio scripts against files Sean had since moved: he moved the Adobe files into the sound-effects folder.
  Check paths first.
- One finished-video review ran 2 agents at about 250k tokens. Fine for a final; too heavy for every round.
- Put an AI-generated image of Ana on the page after Sean said "Ana approved". She later objected, and the main chat
  replaced it. Don't put AI images of a client on a page without the client's own yes, and never disguise them as real
  photos.
