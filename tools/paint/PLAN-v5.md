# VIP page v5: balance, a premium UI and scroll-driven motion (Sean, Nov 1)

Sean: "placements are not the best yet: some too scattered, some too tight, text doesn't fit; animations are
generic, popping and sliding, I want really premium animations; plan the animation for each graphic instead of
making static visuals. The UI is generic and repetitive, especially the sticky header. Keep 'Do not close the page'
on top."

## UI
- **Sticky header:** light paper glass with a hairline. Left: her mark and "The Exit Plan". Centre: the three steps
  as one thin line with nodes (done, now in pink, next), labels kept. Right: a quiet red dot and "Don't close this
  page" (the confirmation pages' wording), with "Step 2 of 3" beside it. It condenses as you scroll. On phones the
  steps shrink to dots and "Don't close this page" stays.
- **Less repetition:**
  - The four-stamp strip that repeated over every VIP item goes. One sticky index rail sits beside the "What's in
    VIP" section (Jason's mechanism slide, shown once, with progress).
  - Section openers vary: the week centred, the VIP items with the rail, the fit check centred.
  - The decorative VIP lane under the week goes.
- **Text that fits:**
  - Wider week stops, no squeezed lines.
  - "Bring your work to the VIP review" becomes a tag on the path between Thursday and Friday.
  - The item text column gets a set measure.

## Compositions (6:5 stage, two or three objects, one focal device, clear margins, nothing over text)
- 01: laptop centred left (the review), coffee top right, the submissions bottom right with the pencil lying on
  them.
- 02: laptop left (her draft), phone overlapping its right edge, the clocks centred under the laptop.
- 03: the sticky notes top left behind the laptop, the laptop centred (the real lesson), the clean card over the
  bottom-right corner; the source line under the laptop.
- 04: the planner top left behind the laptop, the sticky note on Wednesday, the laptop right (the replay).

## Motion: planned per graphic, driven by scroll, with inertia
- **Engine:** each animated layer carries keyframes (`data-k`) over the scene's scroll progress. Progress is
  smoothed every frame (lerp), so motion glides and settles. Moves run on arcs and ease in and out. Layers move at
  different depths (parallax). Nothing pops, and nothing slides in from off-screen.
- **Hero:** the door swings open on load (anticipation, a 3D swing, settle). The bougainvillea and sunflowers idle.
- **Week:** a line draws through the week as you scroll. Each sheet comes into focus as the line reaches it. The tag
  rides the line from Thursday to Friday.
- **01:** the camera drifts in on the review screen. The top submission slides out of the stack, and the pencil
  rolls a little on it.
- **02:** the phone rises from behind the laptop on an arc and turns into place; the highlight sweeps the line; the
  three wedges fill with scroll, then the sun rises.
- **03:** the five notes tuck behind the laptop, shrinking and fading on arcs; the pink note travels on a long arc
  into the card's place, and the card takes over.
- **04:** the sticky note sails onto Wednesday and lands with a settle; the replay's progress follows the scroll.
- **Fit check:** your chair slides to the table with scroll.
- **Letter:** it rises out of the envelope with scroll.
- **Reduced motion:** everything shows in its final state.
