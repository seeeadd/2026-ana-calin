# Motion: how things move (pages and films)

Source: Sean's corrections, his 12 motion references (studied in `tools/paint/MOTION.md`), and the VIP page he
called perfect.

## 1. Banned (every one of these came back as a correction)

- **Effects:** pops, pulses, bounces for attention, shaking, flashing, generic slide-ins and fade-ins. "I don't
  want pops, pulses, and slides." "Just popping and sliding." "Just slides and flaps."
- **Stepped motion:** stop-motion jitter or "on twos". "Real animation, not just stop motion."
- **Busy motion:** anything moving only to fill the screen, or several things competing at once.
- **Slowness:** anything slow enough that people scroll past ("faster and smoother... they might just skip").
- **Strong attention loops:** a strong glow or pulse on a form field that keeps distracting ("I keep getting
  distracted by the light").
- **Glitches:** elements disappearing, flickering, going blank on scroll back, or a first frame that looks broken
  (a "Yes" button cut off before it animates).

## 2. Required: real animation principles

- **Anticipation:** a small move the opposite way first.
- **Easing:** slow in, slow out. Never linear, except for constant spins.
- **Arcs**, not straight lines.
- **Follow-through and settle:** overshoot slightly, then rest.
- **Overlapping action:** parts arrive a beat apart.
- **Secondary motion:** leaves sway after the door swings; steam drifts.

## 3. Motion is planned with the graphic

"Instead of creating the graphic as it is, plan an animation for it." Each animated graphic acts out one small
story: a state, a turn, a payoff. Examples that Sean approved:
- **The door:** the Greek door or shutters swing open on load, in 3D, with the video inside.
- **The chair:** "a little closer" is literally a chair sliding to her table.
- **The pencil:** red pencil marks a draft, words written as said.
- **WhatsApp:** a realistic chat plays, people ask real questions, Ana answers live.
- **Spam rescue:** the Gmail demo where the cursor taps "Not spam", the row moves to the Inbox, then a check.
- **Cash:** notes land on a pile while the amount counts up.
- **The signature:** traced from the font, a nib leads the line, the ink goes on wet and dries. Fast, about a
  second.

## 4. Page motion: the code pattern

- **Library:** GSAP 3.13 with ScrollTrigger, self-hosted (`assets/vendor`). Per-page timelines live in
  `assets/reg-motion.js` and `assets/vip-motion.js`.
- **`when(el, tl, start)`:** plays a timeline once when it scrolls into view (and again if scrolled back past,
  where useful). Idle loops stay tiny (flowers nod, steam).
- **Draw helpers:** `draw(path, dur, pen, ease)` and `Pen` draw ink with a pen that follows the line.
- **Don't fight GSAP with CSS:** never let CSS ease something GSAP moves; nothing moves while its own card is still
  fading in (the chair lesson).
- **Reduced motion:** everything shows its final state (`tl.progress(1)`).
- **Speed:** a graphic finishes its story within about 1 to 2.5 s of being seen. Load animations (the hero door)
  finish in well under 2 s.

## 5. Film motion: the frame-by-frame engine

See `video-editing.md`. The same principles apply, plus:
- **One anchor:** keep it constant and change the world around it.
- **Transitions are objects:** a door, a page turn, a red thread, an iris.
- **Words appear as they're said.**
- **The camera discovers:** slow pans and push-ins.

## 6. Characters

- **The sunflower character:** the brand mark with ink legs and, where needed, arms. He runs, hops, waves, shrugs,
  points.
- **His posing:** posed with `pose()` in `tools/film/film.html`, with squash, lean, walk phase and a shadow that
  shrinks when he lifts.
- **His job:** a guide that carries the viewer between beats, never decoration. Sean wants him in the video.
- **His proportions:** arms always shorter than his legs, with small hands ("so much longer than his legs").
