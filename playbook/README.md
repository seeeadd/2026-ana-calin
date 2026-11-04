# The playbook (Claude's machine guide for Sean's pages, graphics, motion and video)

This folder is the memory that carries between chats. Every Claude that works in this repo reads it first and
improves it before finishing. The more it is used, the better it gets.

## Read first, in this order

| file | what it holds | read it when |
|---|---|---|
| `SOP.md` | how a job runs, and how every chat feeds this playbook (the learning loop) | always, first |
| `brand-ana.md` | Ana Calin's brand, world, facts and assets | any work for Ana |
| `graphics.md` | how graphics look and are made (painted, real, stickers, badges), and what reads as "made by Claude" | any visual |
| `motion.md` | how things move on pages and in films; GSAP patterns; what's banned | any animation |
| `video-editing.md` | how videos are cut, framed, captioned, rendered and checked | any video |
| `feedback-log.md` | every correction Sean has given, dated, with the rule it became | before starting, and after every round |

`rules at a glance` below is the one-screen version. If anything here conflicts with a newer line in
`feedback-log.md`, the newer line wins and this file gets fixed.

## Rules at a glance (the ten that matter most)

1. **It must not look made by Claude.** No generic cards with thick borders and offset shadows, no glass, no
   gradients-for-decoration, no stock icons, no evenly sprinkled detail. Painted, real, specific, in the client's
   world.
2. **Real where proof is needed, painted metaphor where a feeling is.** Real screenshots, real apps copied exactly
   in the brand (Gmail, WhatsApp, Google Calendar, Zoom). Decide per graphic and say which.
3. **Every graphic means one specific thing,** and no two sections share a layout.
4. **Motion is real animation:** arcs, anticipation, settle, follow-through. Never pop, pulse, bounce-for-attention,
   generic slide or fade. Fast enough that nobody scrolls past it.
5. **Balance:** even, calm spacing. Nothing scattered, nothing cramped, no awkward gaps, text always fits.
6. **Type:** sans for anything read and for numbers; serif for big headlines. Key lines bold plus a soft yellow
   highlight. No em dashes.
7. **Keep the charm.** Improve on top of what works; never strip a page back to rebuild from scratch.
8. **Fix the right code, not patches.** Find why something glitches, flickers, crops or goes blank.
9. **Show progress fast:** screenshots after every change, short status lines, estimates for anything long.
   Small fixes in minutes.
10. **Publish only when Sean says "publish".** Then push to main and check the live site.

## Folder map

```
playbook/
  README.md         this file
  SOP.md            how a job runs + the learning loop
  brand-ana.md      Ana Calin (client brand)
  graphics.md       graphics system
  motion.md         motion system
  video-editing.md  video system
  feedback-log.md   dated corrections -> rules
tools/paint/        the paint engine (studio.html, paint.py) + the studies STUDY.md, MOTION.md
tools/film/         the film engine (film.html, render.js), tex/ and cut/ assets, HANDOFF-video.md
```

## For a new client

Copy `playbook/` into the new repo, keep `SOP.md`, `graphics.md`, `motion.md`, `video-editing.md` and
`feedback-log.md` (the rules are Sean's, not Ana's), and write a new `brand-<client>.md` from `brand-ana.md`'s
structure.
