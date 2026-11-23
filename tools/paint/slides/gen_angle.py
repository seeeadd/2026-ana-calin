"""Day 2 slide 32 (Sean 11-24: "use new angle for this one"): a closer camera on the same two people.
The New teacher at the table, three-quarter close; the Parent large in the near foreground, cut by the frame, so we
sit just behind his shoulder. Same characters and colours as gen_people.py (figure() reused, not redrawn)."""
import importlib.util, pathlib
spec = importlib.util.spec_from_file_location('gp', pathlib.Path(__file__).with_name('gen_people.py')); gp = importlib.util.module_from_spec(spec); spec.loader.exec_module(gp)
INK = gp.INK
def art():
    out = '<svg data-art="meet-tp-close" width="1400" height="560" viewBox="0 0 1400 560"><defs><clipPath id="cpP"><rect x="1030" y="0" width="370" height="560"/></clipPath><clipPath id="cpT"><rect x="0" y="0" width="1400" height="446"/></clipPath></defs>\n'
    T = 'translate(-140,-105) scale(1.7)'
    P = 'translate(-1078,-150) scale(2.3) translate(1400,0) scale(-1,1)'
    back = [
            ('wash', 'fill="#9DB8D6" data-rim="2.2" data-density=".8"', '<path d="M300 140 L322 140 L330 560 L306 560 Z"/><path d="M290 134 L 344 134 L 344 152 L 290 152 Z"/><path d="M300 236 L 340 236 L 340 250 L 300 250 Z"/>')]
    for mat, a, inner in back: out += f'  <g data-mat="{mat}" {a}>{inner}</g>\n'
    for mat, attrs, inner in gp.figure('teacher'): out += f'  <g data-mat="{mat}" {attrs} clip-path="url(#cpT)"><g transform="{T}">{inner}</g></g>\n'
    table = [('wash', 'fill="#D9B98E" data-rim="2.6" data-density=".9"', '<path d="M330 440 L1060 440 L1070 474 L322 474 Z"/>'),
             ('wash', 'fill="#C9A273" data-rim="2.2" data-density=".85"', '<path d="M326 474 L1066 474 L1060 560 L332 560 Z"/>'),
             ('wash', 'fill="#F5F1EA" data-rim="1.8" data-density=".9"', '<path d="M780 382 L 836 382 L 830 438 L 786 438 Z"/>'),
             ('wash', 'fill="#7A5236" data-density=".8" data-rim="1.4"', '<ellipse cx="808" cy="387" rx="25" ry="5"/>'),
             ('sheet', 'fill="#FFFDF7"', '<path d="M560 420 L760 410 L770 444 L566 450 Z"/>'),
             ('pencil', 'fill="none" stroke="#6D7B8C" stroke-width="1.4"', '<path d="M590 426 h120 M592 434 h100 M594 442 h80"/>'),
             ('ink', f'stroke="{INK}" stroke-width="1.8" fill="none" data-j=".9"', '<path d="M330 440 L1060 440 L1070 474 L322 474 Z"/><path d="M326 474 L332 560 M1066 474 L1060 560"/><path d="M780 382 L 836 382 L 830 438 L 786 438 Z"/><path d="M836 392 q20 6 -2 26"/><path d="M309 140 L321 560"/>')]
    for mat, a, inner in table: out += f'  <g data-mat="{mat}" {a}>{inner}</g>\n'
    for mat, attrs, inner in gp.figure('parent'): out += f'  <g data-mat="{mat}" {attrs} clip-path="url(#cpP)"><g transform="{P}">{inner}</g></g>\n'
    return out + '</svg>\n'

def art_wt():
    """meet-wt-close: the mirror of meet-tp-close. The New teacher (mirrored, facing left) across the table; the Writer
    large in the near foreground on the left, cut by the frame."""
    out = '<svg data-art="meet-wt-close" width="1400" height="560" viewBox="0 0 1400 560"><defs><clipPath id="cpW"><rect x="0" y="0" width="1400" height="560"/></clipPath><clipPath id="cpT2"><rect x="0" y="0" width="1400" height="446"/></clipPath></defs>\n'
    T = 'translate(1540,-105) scale(-1.7,1.7)'          # teacher mirrored: faces left, head near x 880
    W = 'translate(-722,-150) scale(2.3)'               # writer facing right, head near x 170
    back = [('wash', 'fill="#9DB8D6" data-rim="2.2" data-density=".8"', '<path d="M1100 140 L1078 140 L1070 560 L1094 560 Z"/><path d="M1110 134 L 1056 134 L 1056 152 L 1110 152 Z"/><path d="M1100 236 L 1060 236 L 1060 250 L 1100 250 Z"/>')]
    for mat, a, inner in back: out += f'  <g data-mat="{mat}" {a}>{inner}</g>\n'
    for mat, attrs, inner in gp.figure('teacher'): out += f'  <g data-mat="{mat}" {attrs} clip-path="url(#cpT2)"><g transform="{T}">{inner}</g></g>\n'
    table = [('wash', 'fill="#D9B98E" data-rim="2.6" data-density=".9"', '<path d="M340 440 L1070 440 L1078 474 L330 474 Z"/>'),
             ('wash', 'fill="#C9A273" data-rim="2.2" data-density=".85"', '<path d="M334 474 L1074 474 L1068 560 L340 560 Z"/>'),
             ('wash', 'fill="#F5F1EA" data-rim="1.8" data-density=".9"', '<path d="M564 382 L 620 382 L 614 438 L 570 438 Z"/>'),
             ('wash', 'fill="#7A5236" data-density=".8" data-rim="1.4"', '<ellipse cx="592" cy="387" rx="25" ry="5"/>'),
             ('sheet', 'fill="#FFFDF7"', '<path d="M640 410 L840 420 L834 450 L630 444 Z"/>'),
             ('pencil', 'fill="none" stroke="#6D7B8C" stroke-width="1.4"', '<path d="M690 426 h120 M698 434 h100 M706 442 h80"/>'),
             ('ink', f'stroke="{INK}" stroke-width="1.8" fill="none" data-j=".9"', '<path d="M340 440 L1070 440 L1078 474 L330 474 Z"/><path d="M334 474 L340 560 M1074 474 L1068 560"/><path d="M564 382 L 620 382 L 614 438 L 570 438 Z"/><path d="M564 392 q-20 6 2 26"/><path d="M1091 140 L1079 560"/>')]
    for mat, a, inner in table: out += f'  <g data-mat="{mat}" {a}>{inner}</g>\n'
    for mat, attrs, inner in gp.figure('writer'): out += f'  <g data-mat="{mat}" {attrs} clip-path="url(#cpW)"><g transform="{W}">{inner}</g></g>\n'
    return out + '</svg>\n'

open('studio-angle.html', 'w').write('<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;padding:20px;background:#eee} svg[data-art]{display:block}</style></head><body>\n' + art() + art_wt() + '</body></html>')
print('ok')
