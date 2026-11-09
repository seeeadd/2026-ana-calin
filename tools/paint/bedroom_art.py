"""The confirmation video's calm bedroom (Sean: "a little bit more subtle, last time it was too loud"). Limewash, linen, pale oak;
one soft colour (a pale turquoise pillow), no pink, few objects. A tall window on the left shows the moving bay (the room's box).
Written into studio.html between the BEDSCENE markers: vbed (the room), vbd-cl, vbd-cr (sheer curtains that breathe), vbd-pend (paper pendant).
python3 tools/paint/bedroom_art.py; VW=2100 PAGE=http://localhost:8768/tools/paint/studio.html node tools/paint/render.js vbed,vbd-cl,vbd-cr,vbd-pend;
python3 tools/paint/paint.py vbed vbd-cl vbd-cr vbd-pend; copy the webps from img/vip/paint/ to tools/film/paint/"""
import math, os, random
HERE = os.path.dirname(os.path.abspath(__file__)); INK = '#4A3A30'; R = random.Random(905); RW, RH = 2000, 1008
WX0, WX1, WY0, WYA, WY1 = 170, 610, 110, 300, 640      # the window hole (arched); the box behind it is [170, 110, 440, 530]
FLOOR = 712
arch = f'M{WX0} {WY1} V{WYA} A{(WX1-WX0)/2} {WYA-WY0} 0 0 1 {WX1} {WYA} V{WY1} Z'
wall = f'<path fill-rule="evenodd" d="M-20 -20 H{RW+20} V{FLOOR} H-20 Z {arch}" fill="#F3EEE5"/>'
lime = ''.join(f'<ellipse cx="{R.uniform(0, RW):.0f}" cy="{R.uniform(0, FLOOR):.0f}" rx="{R.uniform(80, 260):.0f}" ry="{R.uniform(40, 120):.0f}" fill="{R.choice(["#ECE4D7", "#F7F3EC", "#E8E0D2"])}"/>' for _ in range(30))
# the window: a deep plaster reveal, a pale oak frame, a sill
reveal = f'<path fill-rule="evenodd" d="M{WX0-34} {WY1+18} V{WYA} A{(WX1-WX0)/2+34} {WYA-WY0+34} 0 0 1 {WX1+34} {WYA} V{WY1+18} Z {arch}" fill="#E6DED0"/>'
frame = (f'<path fill-rule="evenodd" d="M{WX0-8} {WY1} V{WYA} A{(WX1-WX0)/2+8} {WYA-WY0+8} 0 0 1 {WX1+8} {WYA} V{WY1} Z {arch}" fill="#D9C3A0"/>'
         f'<path d="M{(WX0+WX1)/2-5} {WY0} V{WY1} H{(WX0+WX1)/2+5} V{WY0} Z M{WX0} {WYA+120} H{WX1} V{WYA+130} H{WX0} Z" fill="#D9C3A0"/>')
sill = f'<path d="M{WX0-50} {WY1} H{WX1+50} V{WY1+22} H{WX0-50} Z" fill="#EFE7DA"/>'
win_ink = f'<path d="{arch} M{(WX0+WX1)/2} {WY0} V{WY1} M{WX0} {WYA+125} H{WX1} M{WX0-50} {WY1} H{WX1+50} V{WY1+22} H{WX0-50} Z"/>'
# the floor: pale oak boards, a plain rug
floor = f'<path d="M-20 {FLOOR} H{RW+20} V{RH+10} H-20 Z" fill="#D9C4A3"/>'
boards = ''.join(f'<path d="M-20 {y:.0f} H{RW+20}"/>' for y in [FLOOR + 30 + i * (24 + i * 9) for i in range(8)])
joints = ''.join(f'<path d="M{R.uniform(0, RW):.0f} {y:.0f} v{h:.0f}"/>' for y, h in [(FLOOR + 30 + i * (24 + i * 9), 24 + i * 9) for i in range(8)] for _ in range(3))
skirting = f'<path d="M-20 {FLOOR-16} H{RW+20} V{FLOOR+2} H-20 Z" fill="#EFE8DC"/>'
rug = f'<path d="M760 846 H1880 L1940 1000 H700 Z" fill="#EFE7D8"/><path d="M780 858 H1860 L1912 990 H728 Z" fill="none" stroke="#C9A27E" stroke-width="5"/>'
# the bed: a low oak bed, oat linen, two pillows (one pale turquoise), a knitted throw across the foot
BX0, BX1 = 1000, 1700
headboard = f'<path d="M{BX0} 600 V420 Q{BX0} 380 {BX0+40} 380 H{BX1-40} Q{BX1} 380 {BX1} 420 V600 Z" fill="#C9A77F"/>'
pillows = (f'<path d="M{BX0+50} 560 Q{BX0+40} 480 {BX0+110} 478 H{BX0+300} Q{BX0+350} 484 {BX0+340} 560 Z" fill="#F6F1E8"/>'
           f'<path d="M{BX0+330} 566 Q{BX0+322} 488 {BX0+392} 486 H{BX0+590} Q{BX0+640} 492 {BX0+630} 566 Z" fill="#CFE3DF"/>')
duvet = f'<path d="M{BX0-30} 560 Q{BX0+300} 540 {BX1+30} 556 L{BX1+44} 800 Q{BX0+350} 816 {BX0-44} 800 Z" fill="#EDE4D3"/>'
turn = f'<path d="M{BX0-30} 560 Q{BX0+300} 540 {BX1+30} 556 L{BX1+32} 600 Q{BX0+300} 586 {BX0-32} 604 Z" fill="#F7F2E9"/>'
folds = ''.join(f'<path d="M{x:.0f} {562 + R.uniform(-4, 4):.0f} q{R.uniform(-30, 30):.0f} {110:.0f} {R.uniform(-20, 20):.0f} {230:.0f}"/>' for x in range(BX0 + 60, BX1, 120))
throw = f'<path d="M{BX0-40} 700 Q{BX0+350} 690 {BX1+40} 700 L{BX1+44} 800 Q{BX0+350} 816 {BX0-44} 800 Z" fill="#D8C7A8"/>'
throw_rib = ''.join(f'<path d="M{BX0-40 + i * 22:.0f} 702 v96"/>' for i in range(34))
bedbase = f'<path d="M{BX0-50} 800 H{BX1+50} V840 H{BX0-50} Z" fill="#B8956C"/><path d="M{BX0-40} 840 h18 v26 h-18 Z M{BX1+22} 840 h18 v26 h-18 Z" fill="#A07E58"/>'
bed_ink = (f'<path d="M{BX0} 600 V420 Q{BX0} 380 {BX0+40} 380 H{BX1-40} Q{BX1} 380 {BX1} 420 V600"/>'
           f'<path d="M{BX0-30} 560 Q{BX0+300} 540 {BX1+30} 556 L{BX1+44} 800 Q{BX0+350} 816 {BX0-44} 800 Z M{BX0-50} 800 H{BX1+50} V840 H{BX0-50} Z"/>'
           f'<path d="M{BX0+50} 560 Q{BX0+40} 480 {BX0+110} 478 H{BX0+300} Q{BX0+350} 484 {BX0+340} 560 M{BX0+330} 566 Q{BX0+322} 488 {BX0+392} 486 H{BX0+590} Q{BX0+640} 492 {BX0+630} 566"/>')
bed_shadow = f'<path d="M{BX0-60} 866 H{BX1+70} L{BX1+110} 892 H{BX0-40} Z"/><path d="M{BX0-30} 560 Q{BX0+300} 548 {BX1+30} 562 L{BX1+30} 590 Q{BX0+300} 580 {BX0-30} 592 Z"/>'
# the bedside table: pale oak, one drawer; a small vase of white flowers and a book
TX0, TX1, TY = 770, 930, 610
table = f'<path d="M{TX0} {TY} H{TX1} V{TY+190} H{TX0} Z" fill="#CDB08A"/><path d="M{TX0-10} {TY-14} H{TX1+10} V{TY} H{TX0-10} Z" fill="#D9C09A"/>'
table_ink = f'<path d="M{TX0} {TY} V{TY+190} H{TX1} V{TY} M{TX0-10} {TY-14} H{TX1+10} V{TY} H{TX0-10} Z M{TX0+14} {TY+30} H{TX1-14} V{TY+92} H{TX0+14} Z M{(TX0+TX1)/2-12} {TY+60} h24"/>'
book = f'<path d="M{TX0+12} {TY-14} V{TY-36} H{TX0+92} V{TY-14} Z" fill="#B9C9C4"/><path d="M{TX0+16} {TY-36} V{TY-48} H{TX0+84} V{TY-36} Z" fill="#E9DFCB"/>'
vase = f'<path d="M{TX1-46} {TY-14} Q{TX1-56} {TY-50} {TX1-40} {TY-74} H{TX1-24} Q{TX1-8} {TY-50} {TX1-18} {TY-14} Z" fill="#E8EEF0"/>'
stems = ''.join(f'<path d="M{TX1-32} {TY-70} Q{TX1-32 + dx*.4:.0f} {TY-110:.0f} {TX1-32 + dx:.0f} {TY-150 + dy:.0f}"/>' for dx, dy in [(-40, 10), (-12, -20), (16, -6), (40, 18), (0, 30)])
blooms = ''.join(f'<circle cx="{TX1-32 + dx + R.uniform(-4,4):.0f}" cy="{TY-150 + dy + R.uniform(-4,4):.0f}" r="{R.uniform(7, 11):.0f}" fill="#FBF9F4"/>' for dx, dy in [(-40, 10), (-12, -20), (16, -6), (40, 18), (0, 30)] for _ in range(2))
centres = ''.join(f'<circle cx="{TX1-32 + dx:.0f}" cy="{TY-150 + dy:.0f}" r="3" fill="#E2C46A"/>' for dx, dy in [(-40, 10), (-12, -20), (16, -6), (40, 18), (0, 30)])
table_shadow = f'<path d="M{TX0-6} {TY+190} H{TX1+40} L{TX1+60} {TY+206} H{TX0} Z M{TX1+2} {TY} H{TX1+30} V{TY+190} H{TX1+2} Z"/>'
# her painting above the bed, kept small and quiet: a plant in an orange pot, loose turquoise and green, a pale mat
PX0, PY0, PW, PH = 1230, 150, 240, 190
paint = (f'<path d="M{PX0} {PY0} H{PX0+PW} V{PY0+PH} H{PX0} Z" fill="#C8AE86"/><path d="M{PX0+12} {PY0+12} H{PX0+PW-12} V{PY0+PH-12} H{PX0+12} Z" fill="#F5F0E6"/>')
plant = (f'<path d="M{PX0+100} {PY0+150} H{PX0+140} L{PX0+134} {PY0+172} H{PX0+106} Z" fill="#D98A5E"/>'
         + ''.join(f'<ellipse cx="{PX0+120 + dx}" cy="{PY0+110 + dy}" rx="{rx}" ry="{ry}" transform="rotate({a} {PX0+120+dx} {PY0+110+dy})" fill="{c}"/>' for dx, dy, rx, ry, a, c in [(-30, -10, 34, 12, -40, '#8DBFB3'), (26, -20, 36, 12, 35, '#9CC59A'), (-6, -50, 30, 11, -80, '#8DBFB3'), (34, 10, 26, 10, 20, '#B5D3C5'), (-38, 18, 24, 9, -20, '#9CC59A')]))
paint_ink = f'<path d="M{PX0} {PY0} H{PX0+PW} V{PY0+PH} H{PX0} Z M{PX0+12} {PY0+12} H{PX0+PW-12} V{PY0+PH-12} H{PX0+12} Z"/>'
paint_sh = f'<path d="M{PX0+PW} {PY0+8} H{PX0+PW+12} V{PY0+PH+10} H{PX0+10} V{PY0+PH} H{PX0+PW} Z"/>'

vbed = f"""<svg data-art="vbed" width="{RW}" height="{RH}" viewBox="0 0 {RW} {RH}">
  <g data-mat="gouache" data-angle="0" data-streak=".006">{wall}</g>
  <g data-mat="wash" data-density=".3">{lime}</g>
  <g data-mat="gouache" data-angle="90" data-streak=".02">{reveal}</g>
  <g data-mat="gouache" data-angle="90" data-streak=".04">{frame}{sill}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.6" fill="none">{win_ink}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".07">{floor}</g>
  <g data-mat="ink" stroke="#B49870" stroke-width="1.2" fill="none" data-density=".6">{boards}{joints}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".02">{skirting}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".03">{rug}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".03">{paint}{plant}</g>
  <g data-mat="shadow" fill="#9A8C7A" data-density=".45">{paint_sh}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.4" fill="none">{paint_ink}</g>
  <g data-mat="gouache" data-angle="90" data-streak=".05">{headboard}</g>
  <g data-mat="shadow" fill="#9A8C7A" data-density=".5">{bed_shadow}{table_shadow}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".03">{pillows}{duvet}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".02">{turn}</g>
  <g data-mat="ink" stroke="#CDBFA6" stroke-width="1.4" fill="none" data-density=".6">{folds}</g>
  <g data-mat="gouache" data-angle="90" data-streak=".05">{throw}</g>
  <g data-mat="ink" stroke="#BCA886" stroke-width="1.6" fill="none" data-density=".7">{throw_rib}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".05">{bedbase}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.6" fill="none">{bed_ink}</g>
  <g data-mat="gouache" data-angle="90" data-streak=".04">{table}{book}</g>
  <g data-mat="wash" data-density=".55">{vase}</g>
  <g data-mat="ink" stroke="#6F8C52" stroke-width="2" fill="none">{stems}</g>
  <g data-mat="gouache" data-angle="0" data-streak=".02">{blooms}{centres}</g>
  <g data-mat="ink" stroke="{INK}" stroke-width="1.5" fill="none">{table_ink}</g>
</svg>"""


def curtain(name, w=170, h=600):
    folds = ''.join(f'<path d="M{x} 0 Q{x + R.uniform(-6, 6):.0f} {h/2:.0f} {x + R.uniform(-10, 10):.0f} {h}"/>' for x in range(14, w, 22))
    return f"""<svg data-art="{name}" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <g data-mat="wash" fill="#FBF8F2" data-density=".82"><path d="M0 0 H{w} V{h} Q{w*.5:.0f} {h-14} 0 {h} Z"/></g>
  <g data-mat="ink" stroke="#D8CDBB" stroke-width="1.6" fill="none" data-density=".6">{folds}</g>
  <g data-mat="ink" stroke="#B9A88E" stroke-width="3" fill="none"><path d="M0 2 H{w}"/></g>
</svg>"""


vbd_pend = """<svg data-art="vbd-pend" width="160" height="300" viewBox="0 0 160 300">
  <g data-mat="ink" stroke="#7A6A58" stroke-width="2" fill="none"><path d="M80 0 V170"/></g>
  <g data-mat="gouache" data-angle="90" data-streak=".03"><path d="M80 166 C30 170 18 230 30 268 H130 C142 230 130 170 80 166 Z" fill="#F7F1E6"/></g>
  <g data-mat="ink" stroke="#D6C7AE" stroke-width="1.3" fill="none"><path d="M44 200 H116 M34 230 H126 M30 256 H130"/></g>
  <g data-mat="ink" stroke="#4A3A30" stroke-width="1.4" fill="none"><path d="M80 166 C30 170 18 230 30 268 H130 C142 230 130 170 80 166 Z"/></g>
</svg>"""

block = '<!-- BEDSCENE start: written by bedroom_art.py -->\n' + '\n'.join([vbed, curtain('vbd-cl'), curtain('vbd-cr'), vbd_pend]) + '\n<!-- BEDSCENE end -->\n'
p = os.path.join(HERE, 'studio.html'); s = open(p).read()
a = s.find('<!-- BEDSCENE start'); b = s.find('<!-- BEDSCENE end -->')
if a >= 0: s = s[:a] + block + s[b + len('<!-- BEDSCENE end -->\n'):]
else:
    i = s.rfind('<script'); s = s[:i] + block + s[i:]
open(p, 'w').write(s)
print('studio written', len(block) // 1024, 'KB')
