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
vfar = f'''<svg data-art="vfar" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <g data-mat="wash" fill="#BCD2E8" data-density=".85" data-rim="2"><path d="{far}"/></g>
  <g data-mat="wash" fill="#94B4D4" data-density=".7" data-rim="2"><path d="{near}"/></g>
</svg>'''
vland = f'''<svg data-art="vnear" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
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
    body = smooth(Lp) + ' L' + ' L'.join(f'{p[0]:.1f} {p[1]:.1f}' for p in reversed(Rp)) + ' Z'
    x0, y0, bw, bh = box
    hi = smooth([(p[0] * .5 + c[0] * .5, p[1] * .5 + c[1] * .5) for p, c in zip(Lp[6:n - 4], C[6:n - 4])])
    return f'''<svg data-art="{name}" width="{bw}" height="{bh}" viewBox="{x0} {y0} {bw} {bh}">
  <g data-mat="shadow" fill="#6F7F9C" data-density=".4"><g transform="translate(4 7)"><path d="{body}"/></g></g>
  <g data-mat="gouache" data-angle="20" data-streak=".05"><path d="{body}" fill="#F72585"/></g>
  <g data-mat="wash" fill="#B5125F" data-density=".55"><path d="M{Rp[2][0]:.1f} {Rp[2][1]:.1f} L{' L'.join(f'{p[0]:.1f} {p[1]:.1f}' for p in Rp[3:])} L{' L'.join(f'{(p[0]*.55+c[0]*.45):.1f} {(p[1]*.55+c[1]*.45):.1f}' for p, c in reversed(list(zip(Rp[2:], C[2:]))))} Z"/></g>
  <g data-mat="white" fill="none" stroke="#FFD3E6" stroke-width="3" stroke-linecap="round"><path d="{hi}"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.4" fill="none" stroke-linejoin="round"><path d="{smooth(Lp)}"/><path d="{smooth(Rp)}"/><path d="M{Lp[0][0]:.1f} {Lp[0][1]:.1f} L{Rp[0][0]:.1f} {Rp[0][1]:.1f}"/></g>
</svg>'''
va_d = arrow('varrow-d', [(840, 190), (700, 420), (420, 300), (250, 410)], (170, 160, 720, 360), 26, 34, 0, 0)
va_p = arrow('varrow-p', [(330, 210), (640, 420), (470, 760), (230, 860)], (170, 180, 520, 780), 28, 36, 0, 0)

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

# the arrow's head, one piece, carried along the line so the arrow is whole from its first frame
vhead = f'''<svg data-art="vhead" width="140" height="150" viewBox="0 0 140 150">
  <g data-mat="shadow" fill="#6F7F9C" data-density=".4"><path d="M14 8 Q24 74 12 142 Q78 112 132 76 Q76 38 14 8 Z" transform="translate(3 6)"/></g>
  <g data-mat="gouache" data-angle="20" data-streak=".05"><path d="M14 8 Q24 74 12 142 Q78 112 132 76 Q76 38 14 8 Z" fill="#F72585"/></g>
  <g data-mat="wash" fill="#B5125F" data-density=".5"><path d="M18 78 Q78 88 132 76 Q78 112 12 142 Q22 110 18 78 Z"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.6" fill="none" stroke-linejoin="round"><path d="M14 8 Q24 74 12 142 Q78 112 132 76 Q76 38 14 8 Z"/></g>
</svg>'''
# the day sheets: her cream paper, a wash that misses the line, pencil, a wobbly ink edge
def day(name, col, dark, dens):
    edge = cut([(10, 12), (290, 6), (294, 374), (6, 378)], 2.4)
    blot = smooth(ridge([(26, 34), (140, 24), (270, 40)], 44, 9)) + ' ' + ' '.join(f'L{x} {y}' for x, y in [(276, 150), (252, 230), (120, 244), (30, 216)]) + ' Z'
    hatch = ''.join(f'<path d="M{x} {R.uniform(248, 262):.0f} l{R.uniform(16, 30):.0f} {-R.uniform(16, 30):.0f}"/>' for x in range(30, 262, 11))
    return f'''<svg data-art="{name}" width="300" height="390" viewBox="0 0 300 390">
  <g data-mat="shadow" fill="#6F7F9C" data-density=".45"><path d="{edge}" transform="translate(5 8)"/></g>
  <g data-mat="sheet" fill="#FFFBF0"><path d="{edge}"/></g>
  <g data-mat="wash" fill="{col}" data-density="{dens}" data-rim="3"><path d="{blot}"/></g>
  <g data-mat="pencil" stroke="{dark}" stroke-width="3" fill="none" stroke-linecap="round">{hatch}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.9" fill="none" stroke-linejoin="round"><path d="{edge}"/></g>
</svg>'''
vdays = [day('vday1', '#FFD84A', '#E2B400', '1'), day('vday2', '#FFC6DE', '#F08DB9', '.62'), day('vday3', '#BFD7EC', '#8DB6DA', '.62')]
# a solid envelope: opaque paper, a clean silhouette, a wax dot
venv = f'''<svg data-art="venv" width="240" height="206" viewBox="0 0 240 206">
  <g data-mat="shadow" fill="#55617A" data-density=".55"><path d="M14 40 L228 32 L232 186 L10 192 Z" transform="translate(3 9)"/></g>
  <g data-mat="sheet" fill="#FFF9EA"><path d="M14 40 L228 32 L232 186 L10 192 Z"/></g>
  <g data-mat="wash" fill="#BFD0E2" data-density=".55"><path d="M14 40 L120 118 L228 32 L232 60 L120 142 L12 66 Z"/></g>
  <g data-mat="gouache" data-angle="30"><circle cx="120" cy="120" r="19" fill="#F72585"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.3" fill="none" stroke-linejoin="round"><path d="M14 40 L228 32 L232 186 L10 192 Z"/><path d="M14 40 L104 110 M228 32 L136 110 M12 190 L86 128 M232 184 L154 128"/><circle cx="120" cy="120" r="19"/></g>
</svg>'''
vnote = f'''<svg data-art="vnote" width="280" height="230" viewBox="0 0 280 230">
  <g data-mat="shadow" fill="#55617A" data-density=".5"><path d="{cut([(14,14),(266,8),(270,212),(10,218)],2.4)}" transform="translate(4 8)"/></g>
  <g data-mat="sheet" fill="#FFFBF0"><path d="{cut([(14,14),(266,8),(270,212),(10,218)],2.4)}"/></g>
  <g data-mat="wash" fill="#CFE3B0" data-density=".7"><path d="M28 28 L252 22 L256 198 L24 204 Z"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2" fill="none"><path d="{cut([(14,14),(266,8),(270,212),(10,218)],1.6)}"/></g>
</svg>'''
# the torn edge of the scene's paper, lying over her video in the desktop main shot
tp = [(R.uniform(26, 44) + 7 * math.sin(y / 61), y) for y in range(-6, 1020, 14)]
tear = 'M0 -6 L' + ' L'.join(f'{x:.1f} {y}' for x, y in tp) + ' L0 1020 Z'
inner = 'M0 -6 L' + ' L'.join(f'{x-R.uniform(9, 17):.1f} {y}' for x, y in tp) + ' L0 1020 Z'
vtorn = f'''<svg data-art="vtorn" width="90" height="1008" viewBox="0 0 90 1008">
  <g data-mat="shadow" fill="#3C4A63" data-density=".65"><path d="{tear}" transform="translate(9 0)"/></g>
  <g data-mat="sheet" fill="#FFFDF6"><path d="{tear}"/></g>
  <g data-mat="wash" fill="#E7DCC6" data-density=".5"><path d="{inner}"/></g>
</svg>'''

# a small boat for the bay, and the pots he jumps over
vboat = f'''<svg data-art="vboat" width="170" height="170" viewBox="0 0 170 170">
  <g data-mat="shadow" fill="#2C5F92" data-density=".5"><path d="M30 146 Q86 158 146 144 Q88 170 30 146 Z"/></g>
  <g data-mat="sheet" fill="#FFFBF0"><path d="M84 18 C112 50 128 84 134 112 L84 112 Z"/><path d="M78 34 C60 62 46 88 38 112 L78 112 Z"/></g>
  <g data-mat="wash" fill="#F7C9DC" data-density=".65"><path d="M84 70 L124 112 L84 112 Z"/></g>
  <g data-mat="gouache" data-angle="0"><path d="M22 118 L150 116 C144 136 128 146 112 146 L56 147 C40 146 28 136 22 118 Z" fill="#2E5DA8"/><path d="M22 118 L150 116 L148 124 L25 126 Z" fill="#FFFBF0"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.4" fill="none" stroke-linejoin="round"><path d="M81 10 L81 118"/><path d="M84 18 C112 50 128 84 134 112 L84 112"/><path d="M78 34 C60 62 46 88 38 112 L78 112"/><path d="M22 118 L150 116 C144 136 128 146 112 146 L56 147 C40 146 28 136 22 118 Z"/></g>
</svg>'''
vpot = f'''<svg data-art="vpot" width="150" height="190" viewBox="0 0 150 190">
  <g data-mat="shadow" fill="#6A5A4E" data-density=".5"><ellipse cx="78" cy="182" rx="50" ry="6"/></g>
  <g data-mat="gouache" data-angle="80" data-streak=".04"><path d="M72 104 C70 76 74 52 72 30" stroke="#5F8048" stroke-width="7" fill="none"/><path d="M72 66 C50 62 40 48 36 36 C56 34 70 48 72 66 Z M72 50 C90 44 102 30 106 18 C86 18 74 32 72 50 Z" fill="#6F8C52"/></g>
  <g data-mat="gouache" data-angle="90" data-streak=".05"><circle cx="72" cy="24" r="17" fill="#FFD400"/><circle cx="72" cy="24" r="7" fill="#7A4A1E"/></g>
  <g data-mat="gouache" data-angle="0" data-streak=".05"><path d="M36 112 L114 112 L104 180 L46 180 Z" fill="#D2704E"/><path d="M28 98 L122 98 L120 116 L30 116 Z" fill="#E08A62"/></g>
  <g data-mat="wash" fill="#9E4434" data-density=".6"><path d="M92 116 L114 116 L104 180 L86 180 Z"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.4" fill="none" stroke-linejoin="round"><path d="M36 116 L46 180 L104 180 L114 116"/><path d="M28 98 L122 98 L120 116 L30 116 Z"/><circle cx="72" cy="24" r="17"/></g>
</svg>'''


# ---------- her rooms. The windows are real holes, so the moving sea shows through
RW, RH = 2000, 1008
def plaster(hx0, hy0, hx1, hy1):
    return f'M-10 -10 H{RW+10} V{RH+10} H-10 Z M{hx0} {hy0} V{hy1} H{hx1} V{hy0} Z'
def window(x0, y0, x1, y1):
    mx = (x0 + x1) / 2
    sheer = ''
    for k in range(7):
        w = (x1 - x0) * .2 * (k + 1) / 7
        sheer += f'<path d="M{x0-6+w:.0f} {y0} C{x0+w+R.uniform(-5,5):.0f} {y0+120} {x0+w*1.2+R.uniform(-8,8):.0f} {y1-120} {x0-4+w*1.1:.0f} {y1}"/><path d="M{x1+6-w:.0f} {y0} C{x1-w+R.uniform(-5,5):.0f} {y0+120} {x1-w*1.2+R.uniform(-8,8):.0f} {y1-120} {x1+4-w*1.1:.0f} {y1}"/>'
    return dict(
      frame=f'<path d="M{x0-22} {y0-24} H{x1+22} V{y1+6} H{x0-22} Z M{x0} {y0} V{y1} H{x1} V{y0} Z" fill="#FBF8F1" fill-rule="evenodd"/><path d="M{mx-5} {y0} h10 V{y1} h-10 Z M{x0} {y0+(y1-y0)*.42:.0f} H{x1} v9 H{x0} Z" fill="#FBF8F1"/><path d="M{x0-40} {y1+6} H{x1+40} L{x1+32} {y1+30} H{x0-32} Z" fill="#F3EEE3"/>',
      shade=f'<path d="M{x0} {y0} H{x1} V{y0+12} H{x0} Z M{x0} {y0} H{x0+10} V{y1} H{x0} Z" fill="#9FB0C6"/><path d="M{x0-32} {y1+30} H{x1+32} L{x1+20} {y1+46} H{x0-20} Z" fill="#B7BFCA"/>',
      ink=f'<path d="M{x0-22} {y0-24} H{x1+22} V{y1+6} M{x0-22} {y0-24} V{y1+6}"/><path d="M{x0} {y0} H{x1} V{y1} H{x0} Z" stroke-width="1.4"/><path d="M{mx-5} {y0} V{y1} M{mx+5} {y0} V{y1} M{x0} {y0+(y1-y0)*.42:.0f} H{x1}" stroke-width="1.2"/><path d="M{x0-40} {y1+6} H{x1+40} L{x1+32} {y1+30} H{x0-32} Z"/>',
      sheer=sheer,
      rod=f'<path d="M{x0-70} {y0-42} H{x1+70}" stroke="#3A2A22" stroke-width="6" stroke-linecap="round" fill="none"/>',
      sheerpanel=f'<path d="M{x0-46} {y0-40} H{x0+(x1-x0)*.16:.0f} C{x0+(x1-x0)*.2:.0f} {y0+200} {x0+(x1-x0)*.13:.0f} {y1-160} {x0+(x1-x0)*.17:.0f} {y1+90} H{x0-52} Z M{x1+46} {y0-40} H{x1-(x1-x0)*.16:.0f} C{x1-(x1-x0)*.2:.0f} {y0+200} {x1-(x1-x0)*.13:.0f} {y1-160} {x1-(x1-x0)*.17:.0f} {y1+90} H{x1+52} Z" fill="#FFFFFF" fill-opacity=".86"/>')
def floor_planks(y0, y1):
    p = ''
    for i in range(38):
        x = -60 + i * 58
        p += f'<path d="M{x} {y0} L{(x-1000)*1.5+1000:.0f} {y1}"/>'
    for y in (y0 + 34, y0 + 84, y0 + 150):
        for i in range(12):
            x = R.uniform(0, RW); p += f'<path d="M{x:.0f} {y} h{R.uniform(30,90):.0f}"/>'
    return p
def bottle(x, base, w, h, col):
    return f'<path d="M{x-w/2} {base} V{base-h*.62} C{x-w/2} {base-h*.74} {x-w*.18} {base-h*.74} {x-w*.18} {base-h*.84} V{base-h} H{x+w*.18} V{base-h*.84} C{x+w*.18} {base-h*.74} {x+w/2} {base-h*.74} {x+w/2} {base-h*.62} V{base} Z" fill="{col}"/>'
def jar(x, base, w, h, col): return f'<path d="M{x-w/2} {base} V{base-h} H{x+w/2} V{base} Z" fill="{col}"/>'
def brushes(x, base, n=5):
    o = ''
    for i in range(n):
        dx = (i - n / 2) * 7; o += f'<path d="M{x+dx*.5:.0f} {base} L{x+dx:.0f} {base-92-R.uniform(0,26):.0f}"/>'
    return o

W1 = window(700, 240, 1020, 690)
cab_x0, cab_x1 = 640, 1060
studio_doors = ''.join(f'<path d="M{x} 612 V770 M{x+10} 628 h{(cab_x1-cab_x0)/3-40:.0f} v124 h-{(cab_x1-cab_x0)/3-40:.0f} Z"/>' for x in (cab_x0, cab_x0 + 140, cab_x0 + 280))
tubes = ''.join(f'<path d="M{x} 598 l18 -8 l22 6 l-20 8 Z" fill="{c}"/>' for x, c in ((690, '#F72585'), (732, '#1FB5B0'), (800, '#FFD400')))
small = f'<path d="M1150 330 H1470 V640 H1150 Z" fill="#46C2B8"/><path d="M1168 350 C1250 330 1380 360 1452 342 C1460 450 1440 540 1454 622 C1360 640 1260 612 1166 626 C1176 520 1158 430 1168 350 Z" fill="#F46FA8"/>'
smallw = ''.join(f'<path d="M{R.uniform(1180,1430):.0f} {R.uniform(360,600):.0f} q{R.uniform(10,50):.0f} {R.uniform(-30,30):.0f} {R.uniform(30,90):.0f} {R.uniform(-20,20):.0f}" stroke="{R.choice(["#FFD400","#FFFFFF","#1FB5B0","#F9B4CF"])}" stroke-width="{R.uniform(6,14):.0f}" stroke-linecap="round" fill="none"/>' for _ in range(34))
bigstrokes = ''.join(f'<path d="M{R.uniform(250,580):.0f} {R.uniform(130,670):.0f} q{R.uniform(10,50):.0f} {R.uniform(-30,30):.0f} {R.uniform(30,90):.0f} {R.uniform(-20,20):.0f}" stroke="{R.choice(["#FFD400","#FFFFFF","#1FB5B0","#F9B4CF","#F72585"])}" stroke-width="{R.uniform(6,13):.0f}" stroke-linecap="round" fill="none"/>' for _ in range(46))
vstudio = f"""<svg data-art="vstudio" width="{RW}" height="{RH}" viewBox="0 0 {RW} {RH}">
  <g data-mat="gouache" data-angle="4" data-streak=".02"><path d="{plaster(700, 240, 1020, 690)}" fill="#FAF6EE" fill-rule="evenodd"/></g>
  <g data-mat="wash" fill="#D8DEE6" data-density=".42"><path d="M0 0 H{RW} V70 H0 Z"/><path d="M0 70 H180 V770 H0 Z"/><path d="M1700 70 H{RW} V770 H1700 Z"/></g>
  <g data-mat="ink" stroke="#7A6A60" stroke-width="1.6" fill="none" data-density=".7"><path d="M0 70 H{RW}"/></g>
  <g data-mat="gouache" data-angle="2" data-streak=".05"><path d="M-10 770 H{RW+10} V{RH+10} H-10 Z" fill="#CF9A68"/><path d="M-10 752 H{RW+10} V772 H-10 Z" fill="#FBF8F1"/></g>
  <g data-mat="wash" fill="#8F5F36" data-density=".42"><path d="M-10 772 H{RW+10} V800 H-10 Z"/></g>
  <g data-mat="ink" stroke="#6E4A2C" stroke-width="1.5" fill="none" data-density=".7">{floor_planks(772, RH + 40)}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.5" fill="none"><path d="M-10 752 H{RW+10} M-10 772 H{RW+10}"/></g>
  <g data-mat="gouache" data-angle="0" data-streak=".015">{W1['frame']}</g>
  <g data-mat="wash" data-density=".6">{W1['shade']}</g>
  <g data-mat="flat">{W1['sheerpanel']}</g>
  <g data-mat="ink" stroke="#B9BDC6" stroke-width="1.5" fill="none" data-density=".8">{W1['sheer']}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2" fill="none">{W1['ink']}{W1['rod']}</g>
  <g data-mat="shadow" fill="#7E8798" data-density=".42"><path d="M{cab_x0-10} 772 H{cab_x1+22} L{cab_x1+60} 796 H{cab_x0} Z"/><path d="M1150 646 H1500 V664 H1150 Z"/><path d="M212 700 H660 L650 718 H212 Z"/></g>
  <g data-mat="gouache" data-angle="90" data-streak=".015"><path d="M{cab_x0} 612 H{cab_x1} V772 H{cab_x0} Z" fill="#FDFBF5"/><path d="M{cab_x0-12} 596 H{cab_x1+12} V614 H{cab_x0-12} Z" fill="#F5F0E6"/></g>
  <g data-mat="wash" fill="#B9C2CE" data-density=".5"><path d="M{cab_x1-26} 614 H{cab_x1} V772 H{cab_x1-26} Z"/><path d="M{cab_x0} 612 H{cab_x1} V622 H{cab_x0} Z"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.8" fill="none"><path d="M{cab_x0} 612 V772 H{cab_x1} V612 M{cab_x0-12} 596 H{cab_x1+12} V614 H{cab_x0-12} Z"/>{studio_doors}</g>
  <g data-mat="gouache" data-angle="90" data-streak=".03">{bottle(1000, 596, 34, 110, '#2F5E43')}{bottle(950, 596, 28, 84, '#C25B47')}{jar(880, 596, 56, 52, '#BFD7EC')}{jar(760, 596, 48, 46, '#FFE27A')}{tubes}</g>
  <g data-mat="white" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"><path d="M992 586 V510 M944 586 V530 M862 586 V556"/></g>
  <g data-mat="ink" stroke="#8A5A32" stroke-width="4" fill="none" stroke-linecap="round">{brushes(880, 548)}{brushes(760, 552, 4)}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.6" fill="none"><path d="M852 596 V544 H908 V596 M736 596 V550 H784 V596"/></g>
  <g data-mat="gouache" data-angle="20" data-streak=".05">{small}</g>
  <g data-mat="gouache" data-angle="30" data-streak=".06">{smallw}</g>
  <g data-mat="gouache" data-angle="0"><path d="M1130 642 H1520 V660 H1130 Z" fill="#D7A66F"/><path d="M1150 660 L1136 770 M1500 660 L1514 770" stroke="#8A5A32" stroke-width="12" fill="none"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2" fill="none"><path d="M1150 330 H1470 V640 H1150 Z M1130 642 H1520 V660 H1130 Z"/></g>
  <g data-mat="gouache" data-angle="25" data-streak=".06"><path d="M236 110 H626 V690 H236 Z" fill="#E77FB0"/><path d="M430 470 C500 440 590 470 626 450 V690 H420 C410 610 440 540 430 470 Z" fill="#46C2B8"/><path d="M236 110 C300 150 340 120 420 130 C380 200 300 210 236 230 Z" fill="#F4A6C8"/></g>
  <g data-mat="gouache" data-angle="30" data-streak=".06">{bigstrokes}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.2" fill="none"><path d="M236 110 H626 V690 H236 Z"/></g>
  <g data-mat="gouache" data-angle="40" data-streak=".04"><path d="M360 110 L410 18 L446 18 L500 110 H462 L452 90 H404 L394 110 Z M416 66 H440 L428 40 Z" fill="#C9A03C" fill-rule="evenodd"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.6" fill="none"><path d="M360 110 L410 18 L446 18 L500 110 H462 L452 90 H404 L394 110 Z"/></g>
  <g data-mat="gouache" data-angle="0"><path d="M196 690 H676 V708 H196 Z" fill="#E3B987"/><path d="M226 708 L212 770 M646 708 L660 770" stroke="#8A5A32" stroke-width="11" fill="none"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.8" fill="none"><path d="M196 690 H676 V708 H196 Z"/></g>
</svg>"""
W2 = window(240, 200, 620, 660)
book_cols = ['#F72585', '#2E5DA8', '#FFD400', '#46C2B8', '#C25B47', '#FFFBF0', '#2F5E43', '#F9B4CF']
books = ''; bk = ''; x = 1210
while x < 1660:
    w = R.uniform(20, 38); h = R.uniform(92, 136)
    books += f'<path d="M{x:.0f} 344 V{344-h:.0f} H{x+w:.0f} V344 Z" fill="{R.choice(book_cols)}"/>'; bk += f'<path d="M{x:.0f} 344 V{344-h:.0f} H{x+w:.0f} V344"/>'; x += w + R.uniform(0, 3)
books2 = ''; x = 1720
while x < 1960:
    w = R.uniform(20, 36); h = R.uniform(92, 130)
    books2 += f'<path d="M{x:.0f} 560 V{560-h:.0f} H{x+w:.0f} V560 Z" fill="{R.choice(book_cols)}"/>'; bk += f'<path d="M{x:.0f} 560 V{560-h:.0f} H{x+w:.0f} V560"/>'; x += w + R.uniform(0, 3)
grain = ''.join(f'<path d="M{R.uniform(-20,RW):.0f} {R.uniform(810,RH):.0f} q{R.uniform(60,160):.0f} {R.uniform(-5,5):.1f} {R.uniform(140,360):.0f} {R.uniform(-4,4):.1f}"/>' for _ in range(90))
drawers = ''.join(f'<path d="M{x} 836 H{x+300} V980 H{x} Z M{x+120} 906 h60"/>' for x in (420, 760, 1120, 1460))
pencils = ''.join(f'<path d="M{1040+i*7} 786 L{1030+i*14} {700-(i%3)*14}" stroke="{c}" stroke-width="6" stroke-linecap="round" fill="none"/>' for i, c in enumerate(('#F72585', '#FFD400', '#2E5DA8', '#46C2B8')))
vdesk = f"""<svg data-art="vdesk" width="{RW}" height="{RH}" viewBox="0 0 {RW} {RH}">
  <g data-mat="gouache" data-angle="4" data-streak=".02"><path d="{plaster(240, 200, 620, 660)}" fill="#FBF6EA" fill-rule="evenodd"/></g>
  <g data-mat="wash" fill="#FFE9A8" data-density=".4"><path d="M640 0 H{RW} V770 H640 Z"/></g>
  <g data-mat="wash" fill="#D8DEE6" data-density=".38"><path d="M0 0 H{RW} V60 H0 Z"/></g>
  <g data-mat="gouache" data-angle="0" data-streak=".015">{W2['frame']}</g>
  <g data-mat="wash" data-density=".6">{W2['shade']}</g>
  <g data-mat="flat">{W2['sheerpanel']}</g>
  <g data-mat="ink" stroke="#B9BDC6" stroke-width="1.5" fill="none" data-density=".8">{W2['sheer']}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2" fill="none">{W2['ink']}{W2['rod']}</g>
  <g data-mat="shadow" fill="#7E8798" data-density=".4"><path d="M712 616 H1150 V634 H712 Z"/><path d="M1190 356 H1680 V372 H1190 Z"/><path d="M1700 572 H1990 V588 H1700 Z"/></g>
  <g data-mat="gouache" data-angle="20" data-streak=".04"><path d="M700 150 H1140 V610 H700 Z" fill="#C79A6B"/></g>
  <g data-mat="wash" fill="#8A5A32" data-density=".35"><path d="M716 166 H1124 V594 H716 Z"/></g>
  <g data-mat="ink" stroke="#6E4A2C" stroke-width="1" fill="none" data-density=".6">{''.join(f'<path d="M{R.uniform(716,1100):.0f} {R.uniform(170,590):.0f} h{R.uniform(4,16):.0f}"/>' for _ in range(90))}</g>
  <g data-mat="gouache" data-angle="0"><path d="M700 150 H1140 V168 H700 Z M700 592 H1140 V610 H700 Z M700 150 H718 V610 H700 Z M1122 150 H1140 V610 H1122 Z" fill="#FBF8F1"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.8" fill="none"><path d="M700 150 H1140 V610 H700 Z M718 168 H1122 V592 H718 Z"/></g>
  <g data-mat="gouache" data-angle="0"><path d="M1190 344 H1680 V360 H1190 Z M1700 560 H1990 V576 H1700 Z" fill="#D7A66F"/></g>
  <g data-mat="gouache" data-angle="90" data-streak=".04">{books}{books2}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.5" fill="none">{bk}<path d="M1190 344 H1680 V360 H1190 Z M1700 560 H1990 V576 H1700 Z"/></g>
  <g data-mat="gouache" data-angle="70" data-streak=".05"><path d="M1740 344 C1730 300 1790 280 1800 220 C1830 270 1880 280 1860 344 Z" fill="#6F8C52"/><path d="M1760 344 H1850 L1840 420 H1770 Z" fill="#D2704E"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.6" fill="none"><path d="M1760 344 H1850 L1840 420 H1770 Z"/></g>
  <g data-mat="gouache" data-angle="2" data-streak=".06"><path d="M-10 770 H{RW+10} V800 H-10 Z" fill="#E6BC8C"/><path d="M-10 800 H{RW+10} V{RH+10} H-10 Z" fill="#C48B57"/></g>
  <g data-mat="wash" fill="#7C4E2A" data-density=".42"><path d="M-10 800 H{RW+10} V822 H-10 Z"/></g>
  <g data-mat="ink" stroke="#6E4A2C" stroke-width="1.3" fill="none" data-density=".6">{grain}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2" fill="none"><path d="M-10 770 H{RW+10} M-10 800 H{RW+10}"/>{drawers}</g>
  <g data-mat="shadow" fill="#6E5A44" data-density=".5"><path d="M1012 784 H1100 L1120 794 H1012 Z"/><path d="M1590 784 H1750 L1770 794 H1590 Z"/></g>
  <g data-mat="flat">{pencils}</g>
  <g data-mat="gouache" data-angle="90" data-streak=".03"><path d="M1016 786 V712 H1096 V786 Z" fill="#2E5DA8"/><path d="M1596 786 V716 H1716 V786 Z" fill="#FFFBF0"/><path d="M1716 730 C1752 730 1752 772 1716 772 V760 C1736 760 1736 742 1716 742 Z" fill="#FFFBF0"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.8" fill="none"><path d="M1016 786 V712 H1096 V786 Z M1596 786 V716 H1716 V786 Z M1716 730 C1752 730 1752 772 1716 772 M1716 742 C1736 742 1736 760 1716 760"/></g>
  <g data-mat="gouache" data-angle="90"><path d="M1656 748 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0" fill="#FFD400"/><circle cx="1656" cy="748" r="7" fill="#7A4A1E"/></g>
</svg>"""

block = '<!-- VSCENE start: written by vscene_art.py -->\n' + '\n'.join([vstudio, vdesk, vfar, vland, vboat, vpot, vsea, vglint, va_d, va_p, vfree, vtag, vhead, venv, vnote, vtorn] + vdays) + '\n<!-- VSCENE end -->\n'
p = os.path.join(HERE, 'studio.html'); s = open(p).read()
a = s.find('<!-- VSCENE start'); b = s.find('<!-- VSCENE end -->')
if a >= 0: s = s[:a] + block + s[b + len('<!-- VSCENE end -->\n'):]
else:
    i = s.rfind('<script'); s = s[:i] + block + s[i:]
open(p, 'w').write(s)
print('studio written', len(block) // 1024, 'KB')
