"""Builds studio-people.html: two meeting scenes from three recurring characters (drawn in the left seat, mirrored
for the right seat). Sean 11-23: characters differ by role and stay the same person across slides.
New teacher = the writer's colleague (one person)."""
INK = '#3A2A22'
HEAD = "M388 106 C 420 106, 434 128, 432 146 L 440 158 L 432 162 C 432 182, 414 194, 390 194 C 362 194, 344 174, 344 150 C 344 126, 362 106, 388 106 Z"
TORSO = "M318 212 C 340 196, 420 196, 446 214 L 470 300 C 476 330, 470 360, 456 372 L 318 372 C 306 330, 306 260, 318 212 Z"
ARMW = "M430 222 C 470 240, 500 280, 528 306 L 562 318 L 558 332 L 520 326 C 490 306, 462 280, 420 256 Z"
ARMI = "M430 222 C 470 240, 500 280, 528 306 L 562 318"
LEGS = "M330 372 L 470 372 C 500 372, 520 380, 520 400 L 520 500 L 494 500 L 492 404 L 336 404 Z"
LEGI = "M330 372 L 470 372 C 500 372, 520 380, 520 400 L 520 500"
def g(mat, inner, **a):
    attrs = ' '.join(f'{k.replace("_","-")}="{v}"' for k, v in a.items())
    return mat, attrs, inner
def figure(kind):
    L = []
    if kind == 'teacher':     # young, dark bob, blue cardigan, white collar
        top, dark, skin, hair, legs = '#6F9CCB', '#3E6E9E', '#F2D2BC', '#4A3426', '#3F4A5E'
    elif kind == 'writer':    # older, silver curls, round glasses, sage cardigan
        top, dark, skin, hair, legs = '#93AE86', '#5E7A52', '#EBC3A6', '#ADA69C', '#6A5A6E'
    else:                     # parent: man, short hair, beard, mustard jumper
        top, dark, skin, hair, legs = '#E2AE3E', '#A97E18', '#D9A88A', '#5A3E2A', '#8C7A5A'
    L.append(g('wash', f'<path d="{TORSO}"/>', fill=top, data_rim='2.8', data_density='.9'))
    L.append(g('wash', f'<path d="{ARMW}"/>', fill=top, data_rim='2.4', data_density='.9'))
    L.append(g('wash', f'<path d="{LEGS}"/>', fill=legs, data_rim='2.4', data_density='.85'))
    L.append(g('wash', f'<path d="{HEAD}"/><path d="M372 188 L404 188 L402 212 L374 212 Z"/><ellipse cx="566" cy="324" rx="14" ry="8"/>', fill=skin, data_rim='2', data_density='.9'))
    if kind == 'teacher':
        L.append(g('wash', '<path d="M338 196 C 326 110, 370 90, 404 96 C 430 100, 440 118, 436 134 C 420 122, 402 118, 392 122 C 380 130, 378 156, 384 200 C 368 208, 344 206, 338 196 Z"/>', fill=hair, data_rim='2.4', data_density='.92'))
        L.append(g('wash', '<path d="M396 104 L 418 98 L 422 108 L 400 114 Z"/>', fill='#F06BA8', data_rim='1.4', data_density='.95'))
        L.append(g('wash', '<path d="M366 206 L 388 222 L 410 206 L 404 200 L 388 212 L 372 200 Z"/>', fill='#FFFDF7', data_rim='1.6', data_density='.95'))
    elif kind == 'writer':
        curls = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}"/>' for x, y, r in [(352,118,22),(376,100,22),(404,100,20),(426,114,16),(344,146,20),(350,172,18),(366,128,16),(374,118,20),(398,112,18),(416,120,13),(358,142,18)])
        L.append(g('wash', curls, fill=hair, data_rim='2.2', data_density='.95'))
    else:
        L.append(g('wash', '<path d="M348 150 C 344 112, 372 98, 400 100 C 424 102, 434 116, 432 130 C 414 120, 392 118, 376 124 C 366 132, 362 146, 362 158 Z"/>', fill=hair, data_rim='2.2', data_density='.9'))
        L.append(g('wash', '<path d="M374 168 C 380 186, 400 196, 420 190 C 432 184, 436 172, 434 162 L 426 170 C 414 178, 396 176, 384 166 Z"/>', fill=hair, data_rim='2', data_density='.75'))
    L.append(g('wash', '<circle cx="414" cy="170" r="10"/>', fill='#F29A9A', data_density='.45', data_rim='1.2'))
    L.append(g('wash', '<circle cx="414" cy="148" r="4.2"/>', fill='#2A2320', data_density='1', data_rim='1'))
    L.append(g('wash', '<path d="M492 494 L 540 494 C 552 494, 556 506, 548 510 L 492 510 Z"/>', fill='#2E2A28', data_rim='2', data_density='.9'))
    pencil = f'<path d="M324 352 L 452 352 M326 360 L 450 360"/><path d="M520 300 l 12 -16 M526 306 l 12 -16"/>'
    if kind == 'teacher': pencil += '<path d="M380 230 L 384 340"/>'
    if kind == 'parent': pencil += '<path d="M330 236 L 452 236 M330 250 L 456 250"/>'
    L.append(g('pencil', pencil, fill='none', stroke=dark, stroke_width='1.4'))
    face = '<path d="M410 172 q8 3 14 -2"/>'
    if kind == 'teacher': face += '<path d="M352 120 q 20 -18 50 -14 M350 140 q 10 -20 34 -26"/>'
    if kind == 'writer': face += '<path d="M346 118 q6 -8 12 0 M372 98 q6 -8 12 0 M398 96 q6 -8 12 0 M342 150 q6 -8 12 0"/>'
    L.append(g('pencil', face, fill='none', stroke='#2E2018', stroke_width='1.2'))
    ink = f'<path d="{HEAD}"/><path d="{TORSO}"/><path d="{ARMI}"/><path d="{LEGI}"/>'
    if kind == 'writer': ink += '<circle cx="414" cy="148" r="11"/><path d="M403 148 L 380 146"/>'
    L.append(g('ink', ink, stroke=INK, stroke_width='1.6', fill='none', data_j='.9'))
    return L
SHARED_BACK = [
 g('shadow', '<ellipse cx="700" cy="520" rx="560" ry="26"/>', fill='#8E98AA', data_density='.55'),
 g('wash', '<path d="M262 200 L280 200 L290 520 L272 520 Z"/><path d="M256 196 L 300 196 L 300 210 L 256 210 Z"/><path d="M262 260 L 296 260 L 296 270 L 262 270 Z"/><path d="M262 372 L420 372 L420 386 L262 386 Z"/><path d="M400 386 L414 386 L420 520 L406 520 Z"/>'
            '<path d="M1120 200 L1138 200 L1128 520 L1110 520 Z"/><path d="M1100 196 L 1144 196 L 1144 210 L 1100 210 Z"/><path d="M1104 260 L 1138 260 L 1138 270 L 1104 270 Z"/><path d="M980 372 L1138 372 L1138 386 L980 386 Z"/><path d="M986 386 L1000 386 L994 520 L980 520 Z"/>', fill='#9DB8D6', data_rim='2.2', data_density='.8'),
 g('wash', '<path d="M268 360 L424 360 L424 374 L268 374 Z"/><path d="M976 360 L1132 360 L1132 374 L976 374 Z"/>', fill='#E7C27A', data_rim='2', data_density='.9'),
 g('wash', '<path d="M530 318 L870 318 L876 336 L524 336 Z"/>', fill='#D9B98E', data_rim='2.6', data_density='.9'),
 g('wash', '<path d="M690 336 L710 336 L712 500 L688 500 Z"/><path d="M640 500 L760 500 L764 512 L636 512 Z"/>', fill='#BE9868', data_rim='2', data_density='.8'),
]
SHARED_FRONT = [
 g('wash', '<path d="M584 286 L 616 286 L 612 316 L 588 316 Z"/><path d="M790 286 L 822 286 L 818 316 L 794 316 Z"/>', fill='#F5F1EA', data_rim='1.8', data_density='.9'),
 g('wash', '<ellipse cx="600" cy="289" rx="14" ry="3"/><ellipse cx="806" cy="289" rx="14" ry="3"/>', fill='#7A5236', data_density='.8', data_rim='1.4'),
 g('sheet', '<path d="M640 304 L740 298 L746 318 L644 322 Z"/>', fill='#FFFDF7'),
 g('pencil', '<path d="M656 308 h60 M658 314 h50"/>', fill='none', stroke='#6D7B8C', stroke_width='1.2'),
 g('ink', '<path d="M530 318 L870 318 L876 336 L524 336 Z"/><path d="M700 336 L700 500 M640 506 L760 506"/><path d="M271 200 L281 520 M1129 200 L1119 520 M268 366 L424 366 M976 366 L1132 366"/>'
          '<path d="M584 286 L 616 286 L 612 316 L 588 316 Z M790 286 L 822 286 L 818 316 L 794 316 Z"/><path d="M616 292 q12 4 -2 16 M790 292 q-12 4 2 16"/>', stroke=INK, stroke_width='1.6', fill='none', data_j='.9'),
 g('white', '<path d="M540 322 L640 320"/>', fill='none', stroke='#FFFDF7', stroke_width='2.4', stroke_linecap='round'),
]
def art(name, left, right):
    out = f'<svg data-art="{name}" width="1400" height="560" viewBox="0 0 1400 560">\n'
    for mat, attrs, inner in SHARED_BACK: out += f'  <g data-mat="{mat}" {attrs}>{inner}</g>\n'
    for mat, attrs, inner in figure(left): out += f'  <g data-mat="{mat}" {attrs}>{inner}</g>\n'
    for mat, attrs, inner in figure(right): out += f'  <g data-mat="{mat}" {attrs}><g transform="translate(1400,0) scale(-1,1)">{inner}</g></g>\n'
    for mat, attrs, inner in SHARED_FRONT: out += f'  <g data-mat="{mat}" {attrs}>{inner}</g>\n'
    return out + '</svg>\n'
html = ('<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;padding:20px;background:#eee} svg[data-art]{display:block}</style></head><body>\n'
        + art('meet-tp', 'teacher', 'parent') + art('meet-wt', 'writer', 'teacher') + '</body></html>')
open('studio-people.html', 'w').write(html); print('ok')
