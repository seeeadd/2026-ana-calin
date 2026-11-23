# Slide paintings (Ana's live webinar slides)

Made with this repo's paint engine for The Exit Plan Day 1 slides (Nov 22-23, 2026). The deck itself, its kit and
every rule live in seeeadd/ah-launch-library, `clients/ana-calin/design/` (start at `DESIGN_SYSTEM.md`).

| file | what |
|---|---|
| `gen_people.py` → `studio-people.html` | the two meeting scenes from three recurring characters, drawn once and mirrored |
| `studio-day1.html` | ticket roll, hot dog, cash bundle, single bill, the three Venn watercolour circles |
| `render_layers.py` | Python port of `../render.js` (renders each `g[data-mat]` layer for `../paint.py`) |
| `out/meet-wt.webp` | Writer (older, silver curls, glasses, green) with the New teacher |
| `out/meet-tp.webp` | New teacher (dark bob, pink clip, blue) with the Parent (a man, beard, mustard) |

The characters are fixed: the same person always looks the same, and the writer's "colleague" is the new teacher.

Run: `python3 gen_people.py && python3 render_layers.py studio-people.html meet-tp,meet-wt && python3 ../paint.py meet-tp`
(paint.py needs opencv-python-headless, numpy, pillow; point its OUT to `out/`).
