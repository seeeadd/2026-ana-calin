"""The VIP video's new scenery, written into studio.html between the VIPSCENE markers: the terrace room (vterrace, its shutters, its lantern).
python3 tools/paint/vip_art.py; node tools/paint/render.js vterrace,vte-sl,vte-sr,vte-pend; python3 tools/paint/paint.py vterrace vte-sl vte-sr vte-pend; copy the webps to tools/film/paint/"""
import math, os, random
HERE = os.path.dirname(os.path.abspath(__file__)); INK = '#3A2A22'; R = random.Random(67); RW, RH = 2000, 1008
HX0, HX1, HY0, HYA, HY1 = 196, 584, 96, 290, 700   # the window: an arch, a hole in the wall. The moving bay sits behind it
arch = f'M{HX0} {HY1} V{HYA} A{(HX1-HX0)/2} {HYA-HY0} 0 0 1 {HX1} {HYA} V{HY1} Z'
tiles = ''; grout = ''
for r, (y0, y1) in enumerate([(772, 816), (816, 872), (872, 944), (944, 1030)]):
    n = 15 - r * 2; sp = (RW + 800) / n
    for i in range(n + 1):
        off = (r % 2) * sp / 2; x0 = -400 + i * sp + off - sp; x1 = x0 + sp; k = lambda x, y: 1000 + (x - 1000) * (1 + (y - 772) / 900)
        tiles += f'<path d="M{k(x0,y0):.0f} {y0} L{k(x1,y0):.0f} {y0} L{k(x1,y1):.0f} {y1} L{k(x0,y1):.0f} {y1} Z" fill="{R.choice(["#C97B52","#D08A5E","#BE6D47","#D6956B","#C4744C"])}"/>'
        grout += f'<path d="M{k(x0,y0):.0f} {y0} L{k(x0,y1):.0f} {y1}"/>'
    grout += f'<path d="M-20 {y1} H{RW+20}"/>'
# plates on the wall, blue and white, the Greek kitchen kind
plates = ''; plate_ink = ''
for cx, cy, r, c in [(800, 250, 58, '#2E6FB0'), (930, 200, 46, '#F2C230'), (1040, 280, 52, '#2E6FB0'), (900, 340, 38, '#46C2B8')]:
    plates += f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#FBF8F1"/><circle cx="{cx}" cy="{cy}" r="{r*.72:.0f}" fill="none" stroke="{c}" stroke-width="7"/><circle cx="{cx}" cy="{cy}" r="{r*.32:.0f}" fill="{c}"/>'
    plate_ink += f'<circle cx="{cx}" cy="{cy}" r="{r}"/>'
# the vine that climbs the far corner: thin stems, pink bracts on the plaster, never pink on pink
stems = ''; leaves = ''; brct = ''
for sx, sy, ex, ey in [(1960, 770, 1640, 90), (1900, 770, 1720, 60), (1990, 500, 1500, 70), (1660, 96, 1180, 84)]:
    pts = [(sx + (ex - sx) * i / 8 + R.uniform(-26, 26), sy + (ey - sy) * i / 8) for i in range(9)]
    stems += 'M' + ' L'.join(f'{a:.0f} {b:.0f}' for a, b in pts) + ' '
    for a, b in pts:
        for _ in range(9):
            x, y = a + R.uniform(-70, 70), b + R.uniform(-54, 54); w = R.uniform(9, 17); rot = R.uniform(0, 180)
            if R.random() < .5: brct += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{w:.0f}" ry="{w*.62:.0f}" transform="rotate({rot:.0f} {x:.0f} {y:.0f})" fill="{R.choice(["#F72585","#EC4E97","#F472AE"])}"/>'
            else: leaves += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{w*1.1:.0f}" ry="{w*.5:.0f}" transform="rotate({rot:.0f} {x:.0f} {y:.0f})" fill="{R.choice(["#2F5E43","#3E7A52","#5C9462"])}"/>'
olive = ''
for cx, cy, n, sp in [(1548, 300, 90, 120), (214, 440, 46, 62)]:
    for _ in range(n):
        a, r = R.uniform(0, 6.28), sp * R.random() ** .6; x, y = cx + math.cos(a) * r, cy + math.sin(a) * r * .78; w = R.uniform(10, 18); rot = R.uniform(-50, 50)
        olive += f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{w:.0f}" ry="{w*.36:.0f}" transform="rotate({rot:.0f} {x:.0f} {y:.0f})" fill="{R.choice(["#5C8A5E","#7BA06C","#3E7A52","#94B27E"])}"/>'
# two sunflowers in pots, the same as beside the page's door
def sunflower(x, y, r):
    pet = ''.join(f'<ellipse cx="{x+math.cos(a)*r*1.05:.0f}" cy="{y+math.sin(a)*r*1.05:.0f}" rx="{r*.52:.0f}" ry="{r*.22:.0f}" transform="rotate({math.degrees(a):.0f} {x+math.cos(a)*r*1.05:.0f} {y+math.sin(a)*r*1.05:.0f})" fill="#F2C230"/>' for a in [i * math.pi / 7 for i in range(14)])
    return pet + f'<circle cx="{x}" cy="{y}" r="{r*.6:.0f}" fill="#7A4A1E"/>'
pot = lambda x, y, w, h: f'<path d="M{x} {y} H{x+w} L{x+w*.85:.0f} {y+h} H{x+w*.15:.0f} Z" fill="#C25B47"/><path d="M{x-6} {y-14} H{x+w+6} V{y} H{x-6} Z" fill="#CF6E58"/>'
pot_ink = lambda x, y, w, h: f'<path d="M{x} {y} L{x+w*.15:.0f} {y+h} H{x+w*.85:.0f} L{x+w} {y} M{x-6} {y-14} H{x+w+6} V{y} H{x-6} Z"/>'
rug = ''; rug_ink = ''
ry0, ry1 = 806, 980; kx = lambda x, y: 1000 + (x - 1000) * (1 + (y - 772) / 900)
for i, c in enumerate(['#2E6FB0', '#FBF8F1', '#F2C230', '#FBF8F1', '#2E6FB0', '#46C2B8', '#FBF8F1', '#C25B47', '#FBF8F1', '#2E6FB0']):
    y0 = ry0 + (ry1 - ry0) * i / 10; y1 = ry0 + (ry1 - ry0) * (i + 1) / 10; a, b = 330, 1120
    rug += f'<path d="M{kx(a,y0):.0f} {y0:.0f} L{kx(b,y0):.0f} {y0:.0f} L{kx(b,y1):.0f} {y1:.0f} L{kx(a,y1):.0f} {y1:.0f} Z" fill="{c}"/>'
rug_ink = f'<path d="M{kx(330,ry0):.0f} {ry0} L{kx(1120,ry0):.0f} {ry0} L{kx(1120,ry1):.0f} {ry1} L{kx(330,ry1):.0f} {ry1} Z"/>'
fringe = ''.join(f'<path d="M{kx(330,ry0)+ (kx(1120,ry0)-kx(330,ry0))*i/60:.0f} {ry0-1} v-9 M{kx(330,ry1)+(kx(1120,ry1)-kx(330,ry1))*i/60:.0f} {ry1} v11"/>' for i in range(61))
plate_sh = ''.join(f'<circle cx="{cx+9}" cy="{cy+12}" r="{r}"/>' for cx, cy, r, c in [(800, 250, 58, 0), (930, 200, 46, 0), (1040, 280, 52, 0), (900, 340, 38, 0)])
vterrace = f"""<svg data-art="vterrace" width="{RW}" height="{RH}" viewBox="0 0 {RW} {RH}">
  <g data-mat="gouache" data-angle="4" data-streak=".025"><path d="M-10 -10 H{RW+10} V{RH+10} H-10 Z {arch}" fill="#F6E7CE" fill-rule="evenodd"/></g>
  <g data-mat="wash" fill="#E9C9A0" data-density=".36"><path d="M-10 -10 H{RW+10} V70 H-10 Z"/></g>
  <g data-mat="gouache" data-angle="0" data-streak=".04"><path d="M-10 610 H{HX0} V754 H-10 Z M{HX1} 610 H{RW+10} V754 H{HX1} Z" fill="#CFE0EA"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.6" fill="none"><path d="M-10 610 H{HX0} M{HX1} 610 H{RW+10}"/></g>
  <g data-mat="wash" fill="#D9A878" data-density=".34"><path d="M1420 40 H{RW+10} V754 H1500 Z"/><path d="M1700 40 H{RW+10} V754 H1700 Z"/><path d="M-10 40 H120 V754 H-10 Z"/><path d="M620 40 H1400 V110 H620 Z"/></g>
  <g data-mat="wash" fill="#B98A5A" data-density=".3"><path d="M-10 40 H{RW+10} V74 H-10 Z"/><path d="M1860 74 H{RW+10} V754 H1860 Z"/></g>
  <g data-mat="gouache" data-angle="2" data-streak=".05"><path d="M-10 752 H{RW+10} V774 H-10 Z" fill="#FBF8F1"/>{tiles}</g>
  <g data-mat="ink" stroke="#7E4A2E" stroke-width="2.2" fill="none" data-density=".75">{grout}</g>
  <g data-mat="wash" fill="#6E3F24" data-density=".42"><path d="M-10 774 H{RW+10} V800 H-10 Z"/><path d="M1400 800 H{RW+10} V{RH+10} H1500 Z"/><path d="M-10 900 H240 V{RH+10} H-10 Z"/></g>
  <g data-mat="gouache" data-angle="4" data-streak=".05">{rug}</g>
  <g data-mat="ink" stroke="#8A7A66" stroke-width="2" fill="none">{fringe}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.8" fill="none">{rug_ink}</g>
  <g data-mat="wash" fill="#FFE4A8" data-density=".55"><path d="M210 780 L590 780 L1010 {RH+10} L420 {RH+10} Z"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.6" fill="none"><path d="M-10 752 H{RW+10} M-10 774 H{RW+10}"/></g>
  <g data-mat="gouache" data-angle="0" data-streak=".03"><path d="{arch} M{HX0+16} {HY1-16} H{HX1-16} V{HYA} A{(HX1-HX0)/2-16} {HYA-HY0-16} 0 0 0 {HX0+16} {HYA} Z" fill="#2E6FB0" fill-rule="evenodd"/><path d="M{HX0-22} {HY1} H{HX1+22} V{HY1+26} H{HX0-22} Z" fill="#FBF8F1"/></g>
  <g data-mat="gouache" data-angle="90" data-streak=".02"><path d="M{(HX0+HX1)/2-5} {HY0+14} H{(HX0+HX1)/2+5} V{HY1-14} H{(HX0+HX1)/2-5} Z M{HX0+14} {HYA-6} H{HX1-14} V{HYA+4} H{HX0+14} Z M{HX0+14} 490 H{HX1-14} V500 H{HX0+14} Z" fill="#2E6FB0"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.2" fill="none"><path d="{arch}"/><path d="M{HX0-22} {HY1} H{HX1+22} V{HY1+26} H{HX0-22} Z"/></g>
  <g data-mat="shadow" fill="#7E6A58" data-density=".4"><path d="M745 650 H1180 L1190 690 H780 Z"/><path d="M1456 772 H1650 L1760 806 H1470 Z"/><path d="M140 772 H296 L380 806 H150 Z"/>{plate_sh}<path d="M{HX1+22} {HY1+26} L{HX1+70} {HY1+58} H{HX0+10} L{HX0-22} {HY1+26} Z"/><path d="M{HX1+2} 240 L{HX1+36} 300 V{HY1} H{HX1+2} Z"/></g>
  <g data-mat="gouache" data-angle="90" data-streak=".03">{plates}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.6" fill="none">{plate_ink}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".06"><path d="M730 620 H1150 V650 H730 Z" fill="#D7A66F"/><path d="M770 650 L786 700 M1110 650 L1094 700" stroke="#8A5A32" stroke-width="10" fill="none"/></g>
  <g data-mat="gouache" data-angle="90" data-streak=".03">{pot(780, 556, 74, 64)}{pot(1010, 548, 92, 72)}<path d="M890 620 V540 H968 V620 Z" fill="#FBF8F1"/><path d="M890 560 H968 V574 H890 Z" fill="#2E6FB0"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.8" fill="none"><path d="M730 620 H1150 V650 H730 Z M890 620 V540 H968 V620 Z"/>{pot_ink(780, 556, 74, 64)}{pot_ink(1010, 548, 92, 72)}</g>
  <g data-mat="ink" stroke="#2F5E43" stroke-width="5" fill="none" stroke-linecap="round"><path d="M817 544 C812 500 824 470 818 430 M1056 536 C1062 480 1048 440 1056 390"/></g>
  <g data-mat="gouache" data-angle="30" data-streak=".05">{sunflower(818, 420, 34)}{sunflower(1056, 376, 42)}</g>
  <g data-mat="gouache" data-angle="90" data-streak=".03">{pot(1470, 660, 160, 112)}{pot(150, 668, 130, 104)}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2" fill="none">{pot_ink(1470, 660, 160, 112)}{pot_ink(150, 668, 130, 104)}</g>
  <g data-mat="ink" stroke="#6E4A2C" stroke-width="7" fill="none" stroke-linecap="round"><path d="{stems}"/><path d="M1550 648 C1540 560 1566 470 1548 360 M215 656 C205 600 224 560 214 500"/></g>
  <g data-mat="gouache" data-angle="20" data-streak=".05">{leaves}</g>
  <g data-mat="gouache" data-angle="60" data-streak=".04">{brct}</g>
  <g data-mat="gouache" data-angle="40" data-streak=".05">{olive}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".07"><path d="M-10 0 H{RW+10} V38 H-10 Z" fill="#B98A5A"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2" fill="none"><path d="M-10 38 H{RW+10}"/></g>
</svg>"""
slats = lambda w, h: ''.join(f'<path d="M6 {y} H{w-6}"/>' for y in range(16, h - 10, 22))
def shutter(name, w=84, h=610):
    return f"""<svg data-art="{name}" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <g data-mat="gouache" data-angle="90" data-streak=".04"><path d="M0 0 H{w} V{h} H0 Z" fill="#2E6FB0"/></g>
  <g data-mat="ink" stroke="#123F73" stroke-width="2.2" fill="none" data-density=".8">{slats(w, h)}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.2" fill="none"><path d="M1 1 H{w-1} V{h-1} H1 Z"/></g>
</svg>"""
vte_pend = f"""<svg data-art="vte-pend" width="240" height="340" viewBox="0 0 240 340">
  <g data-mat="ink" stroke="{INK}" stroke-width="3" fill="none"><path d="M120 0 V128"/></g>
  <g data-mat="gouache" data-angle="90" data-streak=".03"><path d="M70 128 H170 L150 160 H90 Z" fill="#2E6FB0"/><path d="M90 160 H150 L164 262 H76 Z" fill="#FFE29A"/><path d="M76 262 H164 V280 H76 Z" fill="#2E6FB0"/></g>
  <g data-mat="ink" stroke="{INK}" stroke-width="2.2" fill="none"><path d="M70 128 H170 L150 160 H90 Z M90 160 L76 262 H164 L150 160 M120 160 V262 M76 262 V280 H164 V262"/></g>
</svg>"""
block = '<!-- VIPSCENE start: written by vip_art.py -->\n' + '\n'.join([vterrace, shutter('vte-sl'), shutter('vte-sr'), vte_pend]) + '\n<!-- VIPSCENE end -->\n'
p = os.path.join(HERE, 'studio.html'); s = open(p).read()
a = s.find('<!-- VIPSCENE start'); b = s.find('<!-- VIPSCENE end -->')
if a >= 0: s = s[:a] + block + s[b + len('<!-- VIPSCENE end -->\n'):]
else:
    i = s.rfind('<script'); s = s[:i] + block + s[i:]
open(p, 'w').write(s); print('studio written', len(block) // 1024, 'KB')
