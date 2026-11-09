"""The confirmation video's new place: the view from the hill. We stand high on the mountain, on a whitewashed terrace;
the village tumbles down the slope below us, and the bay is far away. The picture is transparent where the sky and the
sea are: the kit's moving bay (far hills, sea, glints, the boat) shows through a full-width box (extraRooms box).
Written into studio.html between the HILLSCENE markers: vhill (the room), vhi-bou, vhi-oli (branches that sway), vhi-sun (sunflowers in the pot).
python3 tools/paint/hill_art.py; PAGE=http://localhost:8768/tools/paint/studio.html node tools/paint/render.js vhill,vhi-bou,vhi-oli,vhi-sun;
python3 tools/paint/paint.py vhill vhi-bou vhi-oli vhi-sun; copy the webps from img/vip/paint/ to tools/film/paint/"""
import math, os, random
HERE = os.path.dirname(os.path.abspath(__file__)); INK = '#3A2A22'; R = random.Random(711); RW, RH = 2000, 1008


def smooth(pts, close=''):
    d = f'M{pts[0][0]:.1f} {pts[0][1]:.1f}'
    for a, b in zip(pts, pts[1:]):
        d += f' Q{a[0]:.1f} {a[1]:.1f} {(a[0]+b[0])/2:.1f} {(a[1]+b[1])/2:.1f}'
    return d + f' L{pts[-1][0]:.1f} {pts[-1][1]:.1f}' + close


def ridge(keys, step=40, amp=4):
    out = []
    for (x0, y0), (x1, y1) in zip(keys, keys[1:]):
        n = max(1, int((x1 - x0) / step))
        for i in range(n):
            f = i / n; e = f * f * (3 - 2 * f)
            out.append((x0 + (x1 - x0) * f, y0 + (y1 - y0) * e + R.uniform(-amp, amp)))
    out.append(keys[-1]); return out


def y_on(keys, x):
    for (x0, y0), (x1, y1) in zip(keys, keys[1:]):
        if x0 <= x <= x1:
            f = (x - x0) / (x1 - x0); return y0 + (y1 - y0) * f * f * (3 - 2 * f)
    return keys[-1][1]


# the land's top edge: the mountain shoulder high on the left, down to the water in the middle, a headland on the right
EDGE = [(-20, 318), (160, 340), (380, 392), (640, 446), (900, 474), (1180, 482), (1450, 466), (1700, 428), (2020, 392)]
land = smooth(ridge(EDGE, 36, 3), f' L2020 {RH+10} L-20 {RH+10} Z')
# terrace bands across the slope (the old dry-stone terraces), and fields
fields, terr = [], []
for _ in range(40):
    x = R.uniform(-20, 2000); y = R.uniform(y_on(EDGE, x) + 14, 760)
    s = .35 + (y - 400) / 300
    fields.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{R.uniform(60, 150)*s:.0f}" ry="{R.uniform(10, 26)*s:.0f}" fill="{R.choice(["#9DB878", "#AFC389", "#D9C77E", "#C9B676"])}" transform="rotate({R.uniform(-6, 6):.1f} {x:.0f} {y:.0f})"/>')
for _ in range(46):
    x = R.uniform(-20, 2000); y = R.uniform(y_on(EDGE, x) + 10, 760); L = R.uniform(70, 220) * (.35 + (y - 400) / 300)
    terr.append(f'<path d="M{x:.0f} {y:.0f} q{L/2:.0f} {R.uniform(-4, 4):.1f} {L:.0f} {R.uniform(-2, 4):.1f}"/>')

# the village: tiers of cube houses, smaller toward the sea. A stair street runs down through it (left of centre)
STREET = lambda y: 1580 - (760 - y) * 1.9         # x of the stair street at height y: it leaves our terrace (right) and winds down-left
houses = []
CL = [(560, 520, 360), (1120, 560, 300), (1560, 520, 240), (300, 640, 300), (980, 700, 340)]   # cluster centres x, y, radius
for row in range(12):
    yb = 470 + row * 18 + (row * row) * 1.25      # rows spread out toward us
    s = .3 + (yb - 470) / 290 * 1.35              # scale with nearness
    x = R.uniform(-60, 20)
    while x < 2060:
        w = R.uniform(34, 56) * s; h = R.uniform(24, 36) * s
        cx = x + w / 2
        near = max(1 - (math.hypot((cx - a) / r, (yb - b) / (r * .35))) for a, b, r in CL)
        if abs(cx - STREET(yb)) < 34 * s + w / 2 or yb - h < y_on(EDGE, cx) + 10 or yb > 752 or R.random() > near * 1.6:
            x += w * .9; continue
        if yb > 540 or R.random() < .45:     # the far rows thin out, so the water's edge isn't a stamped line
            houses.append((yb, cx, w, h, s))
        x += w + R.uniform(3, 20) * s
houses.sort(key=lambda q: q[0])
walls, sides, roofs, blues, inks, pinks, whites, shade, cyp, cyp_d, olives = [], [], [], [], [], [], [], [], [], [], []
for i, (yb, x, w, h, s) in enumerate(houses):
    y = yb - h; sd = w * R.uniform(.22, .34)
    side_left = x > 1250           # we look down from the left-centre, so we see the side toward the middle
    walls.append(f'<path d="M{x-w/2:.1f} {y:.1f} L{x+w/2:.1f} {y-.5:.1f} L{x+w/2:.1f} {yb:.1f} L{x-w/2:.1f} {yb:.1f} Z" fill="#FFFBF1"/>')
    if side_left:
        sides.append(f'<path d="M{x-w/2:.1f} {y:.1f} L{x-w/2-sd:.1f} {y-2*s:.1f} L{x-w/2-sd:.1f} {yb-2*s:.1f} L{x-w/2:.1f} {yb:.1f} Z"/>')
    else:
        sides.append(f'<path d="M{x+w/2:.1f} {y:.1f} L{x+w/2+sd:.1f} {y-2*s:.1f} L{x+w/2+sd:.1f} {yb-2*s:.1f} L{x+w/2:.1f} {yb:.1f} Z"/>')
    # from above we see the roofs: a flat white roof with a parapet, or terracotta
    rt = 7 * s + 3
    if R.random() < .3:
        roofs.append(f'<path d="M{x-w/2-2*s:.1f} {y+1:.1f} L{x-w*.05:.1f} {y-rt*1.6:.1f} L{x+w/2+2*s:.1f} {y+1:.1f} Z" fill="{R.choice(["#CF6C49", "#D97B55", "#C25B47"])}"/>')
        inks.append(f'<path d="M{x-w/2-2*s:.1f} {y+1:.1f} L{x-w*.05:.1f} {y-rt*1.6:.1f} L{x+w/2+2*s:.1f} {y+1:.1f}"/>')
    else:
        roofs.append(f'<path d="M{x-w/2:.1f} {y:.1f} L{x-w/2+sd*.5:.1f} {y-rt:.1f} L{x+w/2+sd*.5:.1f} {y-rt:.1f} L{x+w/2:.1f} {y:.1f} Z" fill="#F4EEE2"/>')
        inks.append(f'<path d="M{x-w/2:.1f} {y:.1f} L{x-w/2+sd*.5:.1f} {y-rt:.1f} L{x+w/2+sd*.5:.1f} {y-rt:.1f} L{x+w/2:.1f} {y:.1f}"/>')
    inks.append(f'<path d="M{x-w/2:.1f} {y:.1f} V{yb:.1f} M{x+w/2:.1f} {y:.1f} V{yb:.1f} M{x-w/2-1:.1f} {yb:.1f} H{x+w/2+1:.1f}"/>')
    shade.append(f'<path d="M{x-w/2:.1f} {y+1.5*s:.1f} H{x+w/2:.1f} V{y+4*s:.1f} H{x-w/2:.1f} Z"/>')
    dx = x + R.uniform(-w * .25, w * .2); dh = h * .55
    blues.append(f'<path d="M{dx-4*s:.1f} {yb:.1f} V{yb-dh:.1f} Q{dx:.1f} {yb-dh-4*s:.1f} {dx+4*s:.1f} {yb-dh:.1f} V{yb:.1f} Z" fill="{R.choice(["#2E5DA8", "#2E6FB0", "#3D74BE"])}"/>')
    for wx in (x - w * .3, x + w * .3):
        if abs(wx - dx) > 9 * s:
            blues.append(f'<rect x="{wx-3.2*s:.1f}" y="{y+h*.24:.1f}" width="{6.4*s:.1f}" height="{8*s:.1f}" fill="{R.choice(["#2E5DA8", "#3D74BE"])}"/>')
    if i % 6 == 3:                       # bougainvillea over a wall: pink on white, never on pink
        for _ in range(int(14 + 10 * s)):
            bx, by = x + R.choice([-1, 1]) * w / 2 + R.uniform(-6, 6) * s, y + R.uniform(-3, h * .7)
            pinks.append(f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="{R.uniform(1.6, 3.4)*s+.6:.1f}" fill="{R.choice(["#EC4E97", "#F472AE", "#D83A85"])}"/>')
# the church with the blue dome, mid-slope, right of the street
cx, cy, cs = 1060, 560, .75
dome = (f'<path d="M{cx-34*cs} {cy+56*cs} V{cy} H{cx+34*cs} V{cy+56*cs} Z" fill="#FFFBF1"/>'
        f'<path d="M{cx-26*cs} {cy} C{cx-26*cs} {cy-38*cs} {cx+26*cs} {cy-38*cs} {cx+26*cs} {cy} Z" fill="#2F6FB7"/>'
        f'<rect x="{cx-4*cs}" y="{cy+28*cs}" width="{8*cs}" height="{28*cs}" fill="#2E5DA8"/>')
inks.append(f'<path d="M{cx-34*cs} {cy+56*cs} V{cy} H{cx+34*cs} V{cy+56*cs} M{cx-26*cs} {cy} C{cx-26*cs} {cy-38*cs} {cx+26*cs} {cy-38*cs} {cx+26*cs} {cy} M{cx} {cy-29*cs} V{cy-46*cs} M{cx-6*cs} {cy-40*cs} H{cx+6*cs}"/>')
whites.append(f'<path d="M{cx-16*cs} {cy-7*cs} C{cx-15*cs} {cy-18*cs} {cx-8*cs} {cy-24*cs} {cx-2*cs} {cy-25*cs}" fill="none" stroke="#DCEBFA" stroke-width="2.6" stroke-linecap="round"/>')
# cypresses and olives between the houses
for _ in range(26):
    x = R.uniform(0, 2000); y = R.uniform(y_on(EDGE, x) + 20, 740); s = .3 + (y - 400) / 300
    if any(abs(x - hx) < hw / 2 + 6 and -4 < hb - y < hh + 20 for hb, hx, hw, hh, _ in houses): continue
    hgt = R.uniform(46, 70) * s; wd = hgt * .17
    cyp.append(f'<path d="M{x:.1f} {y-hgt:.1f} C{x+wd*1.3:.1f} {y-hgt*.6:.1f} {x+wd:.1f} {y-hgt*.15:.1f} {x+wd*.3:.1f} {y:.1f} L{x-wd*.3:.1f} {y:.1f} C{x-wd:.1f} {y-hgt*.15:.1f} {x-wd*1.2:.1f} {y-hgt*.6:.1f} {x:.1f} {y-hgt:.1f} Z" fill="#2F5E43"/>')
    cyp_d.append(f'<path d="M{x:.1f} {y-hgt*.9:.1f} C{x+wd*.9:.1f} {y-hgt*.55:.1f} {x+wd*.7:.1f} {y-hgt*.15:.1f} {x+wd*.3:.1f} {y:.1f} L{x:.1f} {y:.1f} Z" fill="#1E4633"/>')
for _ in range(170):
    x = R.uniform(-10, 2010); y = R.uniform(y_on(EDGE, x) + 6, 750); s = .3 + (y - 400) / 300
    if any(abs(x - hx) < hw / 2 + 4 and -2 < hb - y < hh + 10 for hb, hx, hw, hh, _ in houses): continue
    r = R.uniform(5, 10) * s
    olives.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{r*1.3:.1f}" ry="{r:.1f}" fill="{R.choice(["#7B9656", "#6F8C52", "#8EAA62"])}"/>')
# the stair street: white steps with blue edges, wider toward us
steps, step_ink = [], []
y = 520
while y < 762:
    s = .3 + (y - 470) / 290 * 1.35; hw = 26 * s + 8; xc = STREET(y); dy = 6 * s + 3
    steps.append(f'<path d="M{xc-hw:.1f} {y:.1f} H{xc+hw:.1f} L{xc+hw+2*s:.1f} {y+dy:.1f} H{xc-hw-2*s:.1f} Z" fill="#FBF6EC"/>')
    step_ink.append(f'<path d="M{xc-hw:.1f} {y:.1f} H{xc+hw:.1f}"/>')
    y += dy
# the terrace we stand on: a whitewashed parapet with a blue-painted coping, across the bottom
PY = 768
parapet = f'<path d="M-20 {PY} H2020 V{RH+10} H-20 Z" fill="#FBF6EC"/>'
coping = f'<path d="M-20 {PY-18} H2020 V{PY+4} H-20 Z" fill="#2E6FB0"/>'
par_ink = f'<path d="M-20 {PY-18} H2020 M-20 {PY+4} H2020"/>'
plaster = ''.join(f'<path d="M{R.uniform(0,2000):.0f} {R.uniform(PY+14, RH-6):.0f} q{R.uniform(20,60):.0f} {R.uniform(-3,3):.1f} {R.uniform(40,120):.0f} {R.uniform(-2,2):.1f}"/>' for _ in range(40))
patches = ''.join(f'<ellipse cx="{R.uniform(0,2000):.0f}" cy="{R.uniform(PY+40, RH-10):.0f}" rx="{R.uniform(30,90):.0f}" ry="{R.uniform(8,22):.0f}" fill="#E9DFCC"/>' for _ in range(14))
par_shadow = f'<path d="M-20 {PY+4} H2020 V{PY+30} H-20 Z"/>'
# the pot on the parapet, left, where the sunflower stands (the sunflowers themselves are vhi-sun, which sways)
PX, PW, PH = 150, 120, 112
pot = f'<path d="M{PX} {PY-18-PH} H{PX+PW} L{PX+PW*.86:.0f} {PY-18} H{PX+PW*.14:.0f} Z" fill="#C25B47"/><path d="M{PX-8} {PY-18-PH-16} H{PX+PW+8} V{PY-18-PH} H{PX-8} Z" fill="#CF6E58"/>'
pot_ink = f'<path d="M{PX} {PY-18-PH} L{PX+PW*.14:.0f} {PY-18} H{PX+PW*.86:.0f} L{PX+PW} {PY-18-PH} M{PX-8} {PY-18-PH-16} H{PX+PW+8} V{PY-18-PH} H{PX-8} Z"/>'
pot_sh = f'<path d="M{PX+PW*.86:.0f} {PY-18-PH} L{PX+PW} {PY-18-PH} L{PX+PW*.86:.0f} {PY-18} Z M{PX+PW*.2:.0f} {PY-18} H{PX+PW*1.25:.0f} L{PX+PW*1.15:.0f} {PY-12} H{PX+PW*.2:.0f} Z"/>'

vhill = f"""<svg data-art="vhill" width="{RW}" height="{RH}" viewBox="0 0 {RW} {RH}">
  <g data-mat="gouache" data-angle="12" data-streak=".05"><path d="{land}" fill="#B7C78C"/></g>
  <g data-mat="wash" data-density=".45">{''.join(fields)}</g>
  <g data-mat="ink" stroke="#6E7A4A" stroke-width=".9" fill="none" data-density=".5">{''.join(terr)}</g>
  <g data-mat="gouache" data-angle="30" data-streak=".03">{''.join(olives)}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".02">{''.join(steps)}</g>
  <g data-mat="ink" stroke="#2E5DA8" stroke-width="1.3" fill="none" data-density=".7">{''.join(step_ink)}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".012">{''.join(walls)}{dome}</g>
  <g data-mat="wash" fill="#93A9C6" data-density=".72">{''.join(sides)}</g>
  <g data-mat="gouache" data-angle="4" data-streak=".03">{''.join(roofs)}</g>
  <g data-mat="shadow" fill="#8B97AE" data-density=".45">{''.join(shade)}</g>
  <g data-mat="flat">{''.join(blues)}</g>
  <g data-mat="gouache" data-angle="90" data-streak=".03">{''.join(cyp)}</g>
  <g data-mat="wash" data-density=".6">{''.join(cyp_d)}</g>
  <g data-mat="flat">{''.join(pinks)}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width=".7" fill="none">{''.join(inks)}</g>
  <g data-mat="white">{''.join(whites)}</g>
  <g data-mat="wash" fill="#EEF2F2" data-density=".55"><path d="{smooth(ridge(EDGE, 36, 2), ' L2020 560 Q1000 600 -20 470 Z')}"/></g>
  <g data-mat="gouache" data-angle="0" data-streak=".02">{parapet}{coping}</g>
  <g data-mat="shadow" fill="#9AA6BC" data-density=".55">{par_shadow}</g>
  <g data-mat="wash" data-density=".35">{patches}</g>
  <g data-mat="ink" stroke="#B9AE9A" stroke-width="1.1" fill="none" data-density=".5">{plaster}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.6" fill="none">{par_ink}</g>
  <g data-mat="gouache" data-angle="80" data-streak=".05">{pot}</g>
  <g data-mat="shadow" fill="#7A4A3A" data-density=".5">{pot_sh}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.6" fill="none">{pot_ink}</g>
</svg>"""


def sunflower(x, y, r):
    pet = ''.join(f'<ellipse cx="{x+math.cos(a)*r*1.05:.0f}" cy="{y+math.sin(a)*r*1.05:.0f}" rx="{r*.52:.0f}" ry="{r*.22:.0f}" transform="rotate({math.degrees(a):.0f} {x+math.cos(a)*r*1.05:.0f} {y+math.sin(a)*r*1.05:.0f})" fill="#F2C230"/>' for a in [i * math.pi / 7 for i in range(14)])
    return pet + f'<circle cx="{x}" cy="{y}" r="{r*.6:.0f}" fill="#7A4A1E"/>'


# vhi-sun: three sunflowers on stems from the pot (240 x 420; the pot's mouth is at the bottom centre)
stems = '<path d="M120 420 C116 330 80 260 66 150 M124 420 C126 320 140 220 150 96 M128 420 C140 340 190 290 196 200"/>'
leaves = ''.join(f'<path d="M{x} {y} q{dx} {-18} {dx*2} {-4} q{-dx} {14} {-dx*2} 4 Z" fill="#6F8C52"/>' for x, y, dx in [(104, 300, -30), (132, 250, 28), (150, 330, 30), (90, 220, -26)])
heads = sunflower(66, 140, 34) + sunflower(150, 86, 40) + sunflower(196, 192, 30)
vhi_sun = f"""<svg data-art="vhi-sun" width="240" height="420" viewBox="0 0 240 420">
  <g data-mat="ink" stroke="#4E6B36" stroke-width="5" fill="none">{stems}</g>
  <g data-mat="gouache" data-angle="40" data-streak=".05">{leaves}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".04">{heads}</g>
  <g data-mat="ink" stroke="#6E4A1E" stroke-width="1.4" fill="none"><circle cx="66" cy="140" r="20"/><circle cx="150" cy="86" r="24"/><circle cx="196" cy="192" r="18"/></g>
</svg>"""


def branch(name, w, h, root, tip, kind):
    """a branch reaching in from the frame's top edge (root on the edge), swaying from there"""
    (rx, ry), (tx, ty) = root, tip
    pts = [(rx + (tx - rx) * i / 7 + R.uniform(-10, 10), ry + (ty - ry) * i / 7 + R.uniform(-8, 8)) for i in range(8)]
    stem = smooth(pts)
    lv, fl = '', ''
    for i, (a, b) in enumerate(pts[1:], 1):
        for k in range(6 if kind == 'oli' else 4):
            ang = R.uniform(0, 2 * math.pi); L = R.uniform(26, 44) if kind == 'oli' else R.uniform(20, 32)
            ex, ey = a + math.cos(ang) * L, b + math.sin(ang) * L * .7
            lv += f'<path d="M{a:.0f} {b:.0f} Q{(a+ex)/2 + 8:.0f} {(b+ey)/2 - 8:.0f} {ex:.0f} {ey:.0f} Q{(a+ex)/2 - 8:.0f} {(b+ey)/2 + 6:.0f} {a:.0f} {b:.0f} Z" fill="{R.choice(["#7E9A62", "#8FA874", "#6F8C52"] if kind == "oli" else ["#5F8048", "#6F8C52"])}"/>'
        if kind == 'bou' and i > 1:
            for _ in range(16):
                fl += f'<circle cx="{a + R.uniform(-22, 22):.0f}" cy="{b + R.uniform(-16, 18):.0f}" r="{R.uniform(5, 9):.1f}" fill="{R.choice(["#EC4E97", "#F472AE", "#D83A85"])}"/>'
    return f"""<svg data-art="{name}" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <g data-mat="ink" stroke="#5A4630" stroke-width="{4 if kind == 'oli' else 3.2}" fill="none"><path d="{stem}"/></g>
  <g data-mat="gouache" data-angle="35" data-streak=".04">{lv}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".03">{fl}</g>
  <g data-mat="ink" stroke="#3E4A2C" stroke-width=".9" fill="none" data-density=".6">{''.join(f'<path d="M{a:.0f} {b:.0f} l{R.uniform(-14,14):.0f} {R.uniform(-10,10):.0f}"/>' for a, b in pts)}</g>
</svg>"""


vhi_bou = branch('vhi-bou', 520, 300, (0, 6), (430, 210), 'bou')
vhi_oli = branch('vhi-oli', 460, 260, (460, 4), (60, 190), 'oli')

block = '<!-- HILLSCENE start: written by hill_art.py -->\n' + '\n'.join([vhill, vhi_sun, vhi_bou, vhi_oli]) + '\n<!-- HILLSCENE end -->\n'
p = os.path.join(HERE, 'studio.html'); s = open(p).read()
a = s.find('<!-- HILLSCENE start'); b = s.find('<!-- HILLSCENE end -->')
if a >= 0: s = s[:a] + block + s[b + len('<!-- HILLSCENE end -->\n'):]
else:
    i = s.rfind('<script'); s = s[:i] + block + s[i:]
open(p, 'w').write(s)
print('studio written', len(block) // 1024, 'KB,', len(houses), 'houses')
