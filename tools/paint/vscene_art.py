"""Writes the registration video's painted scenery into studio.html (between the VSCENE markers):
vland (Greek coast), vsea, vglint (moving light on the water), varrow-d / varrow-p, vfree, vtag.
python3 tools/paint/vscene_art.py; node tools/paint/render.js vland,...; python3 tools/paint/paint.py vland ..."""
import math, os, random
HERE = os.path.dirname(os.path.abspath(__file__))
INK = '#3A2A22'
R = random.Random(2026)

def smooth(pts, close=None):
    d = f'M{pts[0][0]:.1f} {pts[0][1]:.1f}'
    for a, b in zip(pts, pts[1:]):
        d += f' Q{a[0]:.1f} {a[1]:.1f} {(a[0]+b[0])/2:.1f} {(a[1]+b[1])/2:.1f}'
    d += f' L{pts[-1][0]:.1f} {pts[-1][1]:.1f}'
    return d + (close or '')

def ridge(keys, step=46, amp=5):
    out = []
    for (x0, y0), (x1, y1) in zip(keys, keys[1:]):
        n = max(1, int((x1 - x0) / step))
        for i in range(n):
            f = i / n; e = f * f * (3 - 2 * f)
            out.append((x0 + (x1 - x0) * f, y0 + (y1 - y0) * e + R.uniform(-amp, amp)))
    out.append(keys[-1])
    return out

def hill_y(keys, x):
    for (x0, y0), (x1, y1) in zip(keys, keys[1:]):
        if x0 <= x <= x1:
            f = (x - x0) / (x1 - x0); e = f * f * (3 - 2 * f)
            return y0 + (y1 - y0) * e
    return 999

# ---------- the coast: far mountains, an island, two hillsides, two white villages, olives, cypress, rocks
W, H = 2400, 240
BASE = 236
FAR = [(-20, 120), (160, 92), (360, 118), (620, 84), (900, 126), (1180, 104), (1460, 138), (1720, 96), (2020, 124), (2240, 88), (2420, 112)]
NEAR = [(960, 240), (1130, 150), (1300, 128), (1450, 158), (1620, 240)]
LH = [(-20, 66), (150, 40), (340, 30), (560, 66), (760, 128), (960, 214), (1040, 240)]
RH = [(1560, 240), (1720, 170), (1900, 104), (2120, 62), (2300, 76), (2420, 96)]

def hill_poly(keys, amp=4):
    return smooth(ridge(keys, 40, amp), f' L{keys[-1][0]} {H} L{keys[0][0]} {H} Z')

gou_hills = f'<path d="{hill_poly(LH)}" fill="#B9C98F"/><path d="{hill_poly(RH)}" fill="#AFC389"/>'
patches, terr, trees_g, trees_d, cyp, cyp_w = [], [], [], [], [], []
def on_hill(keys, x0, x1, n, top=8, bot=12):
    for _ in range(n):
        x = R.uniform(x0, x1); yh = hill_y(keys, x)
        if yh > 225: continue
        yield x, R.uniform(yh + top, BASE - bot)
for k, (x0, x1, n) in ((LH, (0, 980, 16)), (RH, (1600, 2400, 13))):
    for x, y in on_hill(k, x0, x1, n):
        rx, ry = R.uniform(40, 110), R.uniform(9, 22)
        patches.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{rx:.0f}" ry="{ry:.0f}" fill="{R.choice(["#86A266", "#94AE70", "#D9C77E"])}" transform="rotate({R.uniform(-9, 9):.1f} {x:.0f} {y:.0f})"/>')
for k, (x0, x1, n) in ((LH, (0, 940, 22)), (RH, (1640, 2400, 18))):
    for x, y in on_hill(k, x0, x1, n):
        L = R.uniform(50, 130)
        terr.append(f'<path d="M{x:.0f} {y:.0f} q{L/2:.0f} {R.uniform(-5, 5):.1f} {L:.0f} {R.uniform(-3, 5):.1f}"/>')
villages = [(LH, 120, 690, 36), (RH, 1800, 2240, 20)]
def house_slots(k, x0, x1, n):
    slots = []
    tries = 0
    while len(slots) < n and tries < 4000:
        tries += 1
        x = R.uniform(x0, x1); yh = hill_y(k, x)
        y = R.uniform(max(yh + 34, 64), BASE - 20)
        w, h = R.uniform(25, 42), R.uniform(19, 30)
        if all(abs(x - a) > (w + c) / 2 + 3 or abs(y - b) > (h + d) / 2 + 8 for a, b, c, d in slots):
            slots.append((x, y, w, h))
    return sorted(slots, key=lambda s: s[1])
houses = []
for k, x0, x1, n in villages:
    houses.append(house_slots(k, x0, x1, n))
for k, (x0, x1, n) in ((LH, (0, 960, 130)), (RH, (1620, 2400, 90))):
    for x, y in on_hill(k, x0, x1, n, 4, 6):
        if any(abs(x - a) < c / 2 + 8 and -6 < b - y < d + 14 for v in houses for a, b, c, d in v): continue
        r = R.uniform(4, 9.5) * (.6 + .6 * (y / H))
        col = R.choice(['#5F8048', '#6F8C52', '#7B9656', '#557544'])
        trees_g.append((y, f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{r*1.25:.1f}" ry="{r:.1f}" fill="{col}"/><ellipse cx="{x+r*.5:.1f}" cy="{y-r*.5:.1f}" rx="{r*.7:.1f}" ry="{r*.55:.1f}" fill="#8EAA62"/>'))
        trees_d.append(f'<path d="M{x-r:.1f} {y+r*.5:.1f} q{r:.1f} {r*.7:.1f} {r*2:.1f} 0"/>')
for k, (x0, x1, n) in ((LH, (40, 900, 15)), (RH, (1660, 2380, 11))):
    for x, y in on_hill(k, x0, x1, n, 10, 12):
        if any(abs(x - a) < c / 2 + 6 and -24 < b - y < d + 8 for v in houses for a, b, c, d in v): continue
        h = R.uniform(30, 52); w = h * .17
        cyp.append(f'<path d="M{x:.1f} {y-h:.1f} C{x+w*1.3:.1f} {y-h*.6:.1f} {x+w:.1f} {y-h*.15:.1f} {x+w*.3:.1f} {y:.1f} L{x-w*.3:.1f} {y:.1f} C{x-w:.1f} {y-h*.15:.1f} {x-w*1.2:.1f} {y-h*.6:.1f} {x:.1f} {y-h:.1f} Z" fill="#2F5E43"/>')
        cyp_w.append(f'<path d="M{x:.1f} {y-h*.9:.1f} C{x+w*.9:.1f} {y-h*.55:.1f} {x+w*.7:.1f} {y-h*.15:.1f} {x+w*.3:.1f} {y:.1f} L{x:.1f} {y:.1f} Z" fill="#1E4633"/>')
walls, side, roofs, doors, inks, pinks, whites = [], [], [], [], [], [], []
for v in houses:
    for i, (x, y, w, h) in enumerate(v):
        s = w * R.uniform(.26, .4)          # the side wall, in shade
        walls.append(f'<path d="M{x-w/2:.1f} {y+R.uniform(-.8,.8):.1f} L{x+w/2:.1f} {y:.1f} L{x+w/2+.6:.1f} {y+h:.1f} L{x-w/2-.6:.1f} {y+h:.1f} Z" fill="#FFFBF1"/><path d="M{x+w/2:.1f} {y:.1f} L{x+w/2+s:.1f} {y-3:.1f} L{x+w/2+s:.1f} {y+h-3:.1f} L{x+w/2:.1f} {y+h:.1f} Z" fill="#EAE4D8"/>')
        side.append(f'<path d="M{x+w/2:.1f} {y:.1f} L{x+w/2+s:.1f} {y-3:.1f} L{x+w/2+s:.1f} {y+h-3:.1f} L{x+w/2:.1f} {y+h:.1f} Z" fill="#93A9C6"/>')
        kind = R.random()
        if kind < .52:   # terracotta roof
            roofs.append(f'<path d="M{x-w/2-2.5:.1f} {y+.5:.1f} L{x-w*.1:.1f} {y-w*.34:.1f} L{x+w/2+s-1:.1f} {y-w*.38:.1f} L{x+w/2+s+2:.1f} {y-2:.1f} L{x+w/2+.6:.1f} {y+1:.1f} Z" fill="{R.choice(["#CF6C49", "#D97B55", "#C25B47"])}"/>')
            inks.append(f'<path d="M{x-w/2-2.5:.1f} {y+.5:.1f} L{x-w*.1:.1f} {y-w*.34:.1f} L{x+w/2+s-1:.1f} {y-w*.38:.1f} M{x-w/2:.1f} {y+1:.1f} L{x+w/2:.1f} {y+.5:.1f}"/>')
        else:            # flat roof, a blue rail
            inks.append(f'<path d="M{x-w/2-1:.1f} {y:.1f} L{x+w/2+.6:.1f} {y-.5:.1f} L{x+w/2+s:.1f} {y-3.5:.1f}"/>')
        inks.append(f'<path d="M{x-w/2:.1f} {y:.1f} L{x-w/2-.4:.1f} {y+h:.1f} M{x+w/2:.1f} {y:.1f} L{x+w/2:.1f} {y+h:.1f}"/>')
        dx = x + R.uniform(-w * .3, w * .1)
        doors.append(f'<path d="M{dx-3:.1f} {y+h:.1f} V{y+h*.45:.1f} Q{dx:.1f} {y+h*.3:.1f} {dx+3:.1f} {y+h*.45:.1f} V{y+h:.1f} Z" fill="#2E5DA8"/>')
        for wx in (x - w * .3, x + w * .28):
            if abs(wx - dx) > 7:
                doors.append(f'<rect x="{wx-2.4:.1f}" y="{y+h*.26:.1f}" width="4.8" height="6" fill="{R.choice(["#2E5DA8", "#3D74BE"])}"/>')
        if i % 5 == 2:   # bougainvillea over a wall
            for _ in range(11):
                bx, by = x - w / 2 + R.uniform(-3, 9), y + R.uniform(-2, h * .8)
                pinks.append(f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="{R.uniform(1.5, 3):.1f}" fill="{R.choice(["#EC4E97", "#F472AE", "#D83A85"])}"/>')
domes = ''
for dx, dy in ((430, 142), (2030, 150)):   # the two white churches with a blue dome
    domes += (f'<path d="M{dx-27} {dy+44} V{dy} H{dx+27} V{dy+44} Z" fill="#FFFBF1"/><path d="M{dx-20} {dy} C{dx-20} {dy-30} {dx+20} {dy-30} {dx+20} {dy} Z" fill="#2F6FB7"/>'
              f'<rect x="{dx-3}" y="{dy+22}" width="6" height="22" fill="#2E5DA8"/><path d="M{dx-1.2} {dy-22} V{dy-36} M{dx-5} {dy-31} H{dx+3}" stroke="#3A2A22" stroke-width="1.6" fill="none"/>')
    inks.append(f'<path d="M{dx-27} {dy+44} V{dy} H{dx+27} V{dy+44} M{dx-20} {dy} C{dx-20} {dy-30} {dx+20} {dy-30} {dx+20} {dy} M{dx-3} {dy+44} V{dy+22} H{dx+3} V{dy+44}"/>')
    whites.append(f'<path d="M{dx-13} {dy-5} C{dx-12} {dy-14} {dx-6} {dy-19} {dx-1} {dy-20}" fill="none" stroke="#DCEBFA" stroke-width="2.2" stroke-linecap="round"/>')
trees_g.sort(key=lambda t: t[0])
# the shore: pale rocks and foam along the waterline
rocks, rocksh, rockink = [], [], []
x = -10
while x < 2420:
    w = R.uniform(14, 58); h = R.uniform(5, 14) * (1.7 if x < 1040 or x > 1560 else .7)
    pts = [(x, BASE + 2), (x + w * .15, BASE - h * .8), (x + w * .5, BASE - h), (x + w * .85, BASE - h * .7), (x + w, BASE + 2)]
    rocks.append(f'<path d="{smooth(pts)} Z" fill="{R.choice(["#E4C9A2", "#D9B48F", "#EAD8B8", "#CFA583"])}"/>')
    rocksh.append(f'<path d="M{x+w*.5:.1f} {BASE-h:.1f} L{x+w*.85:.1f} {BASE-h*.7:.1f} L{x+w:.1f} {BASE+2} L{x+w*.55:.1f} {BASE+2} Z" fill="#8FA2BC"/>')
    if R.random() < .55: rockink.append(f'<path d="{smooth(pts[:4])}"/>')
    x += w * R.uniform(.7, 1.3)
far = smooth(ridge(FAR, 34, 6), f' L2420 {H} L-20 {H} Z'); near = smooth(ridge(NEAR, 30, 4), f' L1620 {H} L960 {H} Z')
vland = f'''<svg data-art="vland" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <g data-mat="wash" fill="#BCD2E8" data-density=".85" data-rim="2"><path d="{far}"/></g>
  <g data-mat="wash" fill="#94B4D4" data-density=".7" data-rim="2"><path d="{near}"/></g>
  <g data-mat="gouache" data-angle="14" data-streak=".05">{gou_hills}</g>
  <g data-mat="wash" data-density=".42">{''.join(patches)}</g>
  <g data-mat="ink" stroke="#5F6F45" stroke-width=".8" fill="none" data-density=".55">{''.join(terr)}</g>
  <g data-mat="gouache" data-angle="30" data-streak=".03">{''.join(t[1] for t in trees_g)}</g>
  <g data-mat="ink" stroke="#2E3F24" stroke-width=".7" fill="none" data-density=".55">{''.join(trees_d)}</g>
  <g data-mat="gouache" data-angle="90" data-streak=".03">{''.join(cyp)}</g>
  <g data-mat="wash" data-density=".6">{''.join(cyp_w)}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".012">{''.join(walls)}{domes}</g>
  <g data-mat="wash" data-density=".75">{''.join(side)}</g>
  <g data-mat="gouache" data-angle="4" data-streak=".03">{''.join(roofs)}</g>
  <g data-mat="flat">{''.join(doors)}</g>
  <g data-mat="flat">{''.join(pinks)}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width=".55" fill="none">{''.join(inks)}</g>
  <g data-mat="white">{''.join(whites)}</g>
  <g data-mat="gouache" data-angle="20" data-streak=".04">{''.join(rocks)}</g>
  <g data-mat="wash" data-density=".6">{''.join(rocksh)}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width=".8" fill="none" data-density=".7">{''.join(rockink)}</g>
</svg>'''

# ---------- the sea: gouache pulled sideways, deeper toward us, wave marks that grow with distance
SW, SH = 2000, 220
bands = [(0, 26, '#BFE3EA'), (18, 56, '#8FCBDD'), (46, 92, '#5FAED2'), (84, 142, '#3F8FC4'), (132, 222, '#2C74B0')]
sea_g = ''
for y0, y1, c in bands:
    top = ridge([(-10, y0), (SW + 10, y0)], 90, 2.5)
    sea_g += f'<path d="{smooth(top, f" L{SW+10} {y1+6} L-10 {y1+6} Z")}" fill="{c}"/>'
lens = []
for _ in range(58):
    y = R.uniform(10, 214); x = R.uniform(-40, SW); L = R.uniform(120, 620) * (.5 + y / 220); t = R.uniform(1.5, 5) * (.6 + y / 90)
    lens.append(f'<path d="M{x:.0f} {y:.1f} Q{x+L/2:.0f} {y-t:.1f} {x+L:.0f} {y:.1f} Q{x+L/2:.0f} {y+t:.1f} {x:.0f} {y:.1f} Z" fill="{R.choice(["#1E5F9C", "#2C74B0", "#2A86B8", "#1B5590"])}"/>')
ticks, ticks2 = [], []
for _ in range(460):
    y = R.uniform(22, 216) ; d = y / 220; w = (5 + 28 * d) * R.uniform(.7, 1.3); h = (.8 + 4 * d) * R.uniform(.6, 1.2); x = R.uniform(0, SW)
    (ticks if R.random() < .7 else ticks2).append(f'<path d="M{x:.1f} {y:.1f} q{w*.25:.1f} {-h:.1f} {w*.5:.1f} 0 q{w*.25:.1f} {h*.7:.1f} {w*.5:.1f} 0"/>')
foam = []
for _ in range(120):
    x = R.uniform(0, SW); w = R.uniform(10, 46)
    foam.append(f'<path d="M{x:.1f} {R.uniform(1,7):.1f} q{w/2:.1f} {R.uniform(-1.5,1.5):.1f} {w:.1f} 0"/>')
vsea = f'''<svg data-art="vsea" width="{SW}" height="{SH}" viewBox="0 0 {SW} {SH}">
  <g data-mat="gouache" data-angle="0" data-streak=".09">{sea_g}</g>
  <g data-mat="wash" data-density=".42" data-rim="1.2">{''.join(lens)}</g>
  <g data-mat="ink" stroke="#143F6E" stroke-width="1.05" fill="none" stroke-linecap="round" data-density=".62">{''.join(ticks)}</g>
  <g data-mat="white" fill="none" stroke="#EAF6FA" stroke-width="1.5" stroke-linecap="round">{''.join(ticks2)}{''.join(foam)}</g>
</svg>'''
gl = []
for _ in range(210):
    y = R.uniform(12, 214); d = y / 220; w = (8 + 42 * d) * R.uniform(.6, 1.4); x = R.uniform(0, SW)
    gl.append(f'<path d="M{x:.1f} {y:.1f} q{w/2:.1f} {R.uniform(-2,2)*d:.1f} {w:.1f} 0" stroke-width="{1.1+2.4*d:.1f}"/>')
vglint = f'''<svg data-art="vglint" width="{SW}" height="{SH}" viewBox="0 0 {SW} {SH}">
  <g data-mat="white" fill="none" stroke="#FFFFFF" stroke-linecap="round">{''.join(gl)}</g>
</svg>'''

# ---------- the arrow: a thick, hand-painted arrow with a real head, one per shape
def arrow(name, P, box, w0, w1, head, headlen):
    n = 60; C = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        C.append((u**3*P[0][0] + 3*u*u*t*P[1][0] + 3*u*t*t*P[2][0] + t**3*P[3][0], u**3*P[0][1] + 3*u*u*t*P[1][1] + 3*u*t*t*P[2][1] + t**3*P[3][1]))
    Lp, Rp = [], []
    for i, (x, y) in enumerate(C):
        a = C[max(i - 1, 0)]; b = C[min(i + 1, n)]
        dx, dy = b[0] - a[0], b[1] - a[1]; m = math.hypot(dx, dy) or 1; nx, ny = -dy / m, dx / m
        t = i / n; hw = (w0 + (w1 - w0) * t) / 2 + math.sin(i * .7) * 1.1 + R.uniform(-.7, .7)
        Lp.append((x + nx * hw, y + ny * hw)); Rp.append((x - nx * hw, y - ny * hw))
    ax, ay = C[-1]; bx, by = C[-4]; dx, dy = ax - bx, ay - by; m = math.hypot(dx, dy); ux, uy = dx / m, dy / m; nx, ny = -uy, ux
    tip = (ax + ux * headlen, ay + uy * headlen)
    h1 = (ax + nx * head - ux * 8, ay + ny * head - uy * 8); h2 = (ax - nx * (head + 3) - ux * 11, ay - ny * (head + 3) - uy * 11)
    body = smooth(Lp) + ' L' + ' L'.join(f'{p[0]:.1f} {p[1]:.1f}' for p in reversed(Rp)) + ' Z'
    hd = f'M{h1[0]:.1f} {h1[1]:.1f} Q{(h1[0]+tip[0])/2+ux*2:.1f} {(h1[1]+tip[1])/2+uy*2:.1f} {tip[0]:.1f} {tip[1]:.1f} Q{(h2[0]+tip[0])/2+ux*3:.1f} {(h2[1]+tip[1])/2+uy*3:.1f} {h2[0]:.1f} {h2[1]:.1f} Q{ax-ux*2:.1f} {ay-uy*2:.1f} {h1[0]:.1f} {h1[1]:.1f} Z'
    x0, y0, bw, bh = box
    hi = smooth([(p[0] * .5 + c[0] * .5, p[1] * .5 + c[1] * .5) for p, c in zip(Lp[6:n - 4], C[6:n - 4])])
    return f'''<svg data-art="{name}" width="{bw}" height="{bh}" viewBox="{x0} {y0} {bw} {bh}">
  <g data-mat="shadow" fill="#6F7F9C" data-density=".4"><g transform="translate(4 7)"><path d="{body}"/><path d="{hd}"/></g></g>
  <g data-mat="gouache" data-angle="20" data-streak=".05"><path d="{body}" fill="#F72585"/><path d="{hd}" fill="#F72585"/></g>
  <g data-mat="wash" fill="#B5125F" data-density=".55"><path d="M{Rp[2][0]:.1f} {Rp[2][1]:.1f} L{' L'.join(f'{p[0]:.1f} {p[1]:.1f}' for p in Rp[3:])} L{' L'.join(f'{(p[0]*.55+c[0]*.45):.1f} {(p[1]*.55+c[1]*.45):.1f}' for p, c in reversed(list(zip(Rp[2:], C[2:]))))} Z"/></g>
  <g data-mat="white" fill="none" stroke="#FFD3E6" stroke-width="3" stroke-linecap="round"><path d="{hi}"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.4" fill="none" stroke-linejoin="round"><path d="{smooth(Lp[:n-1])}"/><path d="{smooth(Rp[:n-1])}"/><path d="M{Lp[0][0]:.1f} {Lp[0][1]:.1f} L{Rp[0][0]:.1f} {Rp[0][1]:.1f}"/><path d="{hd}"/></g>
</svg>'''
va_d = arrow('varrow-d', [(1140, 500), (1010, 214), (560, 214), (372, 408)], (270, 190, 930, 350), 34, 52, 66, 78)
va_p = arrow('varrow-p', [(660, 1000), (500, 860), (352, 960), (338, 1230)], (230, 820, 490, 530), 36, 54, 70, 84)

# ---------- the free sticker: yellow, ink letters, a raw white die-cut edge
def cut(pts, amp):
    o = []
    for a, b in zip(pts, pts[1:] + pts[:1]):
        for i in range(5):
            f = i / 5; o.append((a[0] + (b[0] - a[0]) * f + R.uniform(-amp, amp), a[1] + (b[1] - a[1]) * f + R.uniform(-amp, amp)))
    return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in o) + ' Z'
vfree = f'''<svg data-art="vfree" width="460" height="260" viewBox="0 0 460 260">
  <g data-mat="shadow" fill="#5F6A80" data-density=".5"><path d="{cut([(18,26),(442,14),(450,236),(10,246)],3)}" transform="translate(3 9)"/></g>
  <g data-mat="sheet" fill="#FFFDF7"><path d="{cut([(16,22),(444,12),(450,234),(10,242)],3.2)}"/></g>
  <g data-mat="gouache" data-angle="10" data-streak=".05"><path d="{cut([(36,40),(424,30),(430,214),(30,222)],2)}" fill="#FFD400"/></g>
  <g data-mat="flat"><text x="230" y="172" text-anchor="middle" class="sans" font-weight="800" font-size="138" letter-spacing="2" fill="#1A1412">FREE</text></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.2" fill="none"><path d="{cut([(36,40),(424,30),(430,214),(30,222)],1.4)}"/></g>
</svg>'''
vtag = f'''<svg data-art="vtag" width="360" height="256" viewBox="0 0 360 256">
  <g data-mat="shadow" fill="#6F7F9C" data-density=".45"><path d="M72 22 L348 14 L352 238 L72 238 L12 134 Z" transform="translate(4 8)"/></g>
  <g data-mat="sheet" fill="#FFFAEC"><path d="M72 22 L348 14 L352 238 L72 238 L12 134 Z"/></g>
  <g data-mat="wash" fill="#FFE27A" data-density=".55"><path d="M84 34 L336 26 L340 226 L84 226 L30 134 Z"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.6" fill="none" stroke-linejoin="round"><path d="M72 22 L348 14 L352 238 L72 238 L12 134 Z"/><circle cx="62" cy="130" r="12"/></g>
</svg>'''

block = '<!-- VSCENE start: written by vscene_art.py -->\n' + '\n'.join([vland, vsea, vglint, va_d, va_p, vfree, vtag]) + '\n<!-- VSCENE end -->\n'
p = os.path.join(HERE, 'studio.html'); s = open(p).read()
a = s.find('<!-- VSCENE start'); b = s.find('<!-- VSCENE end -->')
if a >= 0: s = s[:a] + block + s[b + len('<!-- VSCENE end -->\n'):]
else:
    i = s.rfind('<script'); s = s[:i] + block + s[i:]
open(p, 'w').write(s)
print('studio written', len(block) // 1024, 'KB')
