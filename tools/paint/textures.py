"""Subtle section textures for the VIP page, made in code (Sean: use my textures as reference, not the files).

python3 tools/paint/textures.py  ->  img/vip/paint/tx-*.webp (transparent overlays, laid over each section's colour)

  tx-stucco   the whitewash of her Greek door (ref: stucco-white): soft mottling and a few trowel sweeps
  tx-linen    a fine weave for the letter and the price (ref: linen)
  tx-halftone a printed halftone sun fading from one corner (ref: halftone-yellow), for the sunflower week
  tx-gingham  a soft gingham weave for the pink fit check (ref: quilt, the gingham bow)
  tx-grain    a fine paper grain for the footer and the cards
Every tile is seamless, so CSS can repeat it.
"""
import os
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'img', 'vip', 'paint')
g = np.random.default_rng(11)


def wn(n, sig, m=None):
    r = gaussian_filter(g.standard_normal((m or n, n)), sig, mode='wrap')
    return r / (r.std() + 1e-9)


def save(name, rgb, a):
    a = np.clip(a, 0, 1)
    img = np.dstack([np.broadcast_to(np.array(rgb, np.float32) / 255, a.shape + (3,)), a])
    Image.fromarray((img * 255 + .5).astype(np.uint8), 'RGBA').save(os.path.join(OUT, name + '.webp'), quality=90)
    print(name, a.shape, 'alpha max %.3f mean %.3f' % (a.max(), a.mean()))


def stucco(n=640):
    m = 0.55 * wn(n, 40) + 0.35 * wn(n, 12) + 0.25 * wn(n, 3)
    # trowel sweeps: long soft arcs
    sw = np.zeros((n, n))
    yy, xx = np.mgrid[0:n, 0:n]
    for _ in range(14):
        cx, cy, r, w = g.uniform(0, n), g.uniform(0, n), g.uniform(120, 360), g.uniform(10, 26)
        d = np.abs(np.hypot(((xx - cx + n / 2) % n) - n / 2, ((yy - cy + n / 2) % n) - n / 2) - r)
        ang = np.arctan2(yy - cy, xx - cx); seg = (np.sin(ang * g.uniform(1, 2) + g.uniform(0, 6)) > .55)
        sw += np.exp(-(d / w) ** 2) * seg * g.uniform(.4, 1)
    sw = gaussian_filter(sw, 2, mode='wrap')
    fine = 0.6 * wn(n, .8) + 0.4 * wn(n, 2)
    a = 0.02 + 0.008 * m + 0.012 * fine + 0.045 * sw / (sw.max() + 1e-9)
    save('tx-stucco', (150, 128, 104), np.clip(a, 0, .09))


def linen(n=256):
    yy, xx = np.mgrid[0:n, 0:n]
    th = 4.0
    wx = 0.5 + 0.5 * np.cos(2 * np.pi * xx / th + 0.6 * wn(n, 6))
    wy = 0.5 + 0.5 * np.cos(2 * np.pi * yy / th + 0.6 * wn(n, 6))
    slub = np.clip(wn(n, 1.2) * .5 + .5, 0, 1)
    v = (wx * (1 - .5 * wy) + wy * (1 - .5 * wx)) * .5
    a = 0.016 + 0.05 * v * (0.6 + 0.4 * slub)
    save('tx-linen', (120, 96, 70), np.clip(a, 0, .09))


def halftone(w=900, h=760, cell=13):
    """dots shrinking away from the top-right corner, each a little irregular (ink on paper)"""
    a = np.zeros((h, w)); yy, xx = np.mgrid[0:h, 0:w]
    for cy in range(cell // 2, h, cell):
        off = (cy // cell) % 2 * cell / 2
        for cx0 in range(0, w + cell, cell):
            cx = cx0 + off
            d = np.hypot((w - cx) / w, cy / h) / 1.15            # distance from the corner, 0..1
            r = cell * .46 * max(0, 1 - d) ** 1.6
            if r < .45: continue
            x0, x1, y0, y1 = int(max(0, cx - r - 2)), int(min(w, cx + r + 3)), int(max(0, cy - r - 2)), int(min(h, cy + r + 3))
            if x0 >= x1 or y0 >= y1: continue
            jx, jy = g.normal(0, .35), g.normal(0, .35)
            dd = np.hypot(xx[y0:y1, x0:x1] - cx - jx, yy[y0:y1, x0:x1] - cy - jy)
            a[y0:y1, x0:x1] = np.maximum(a[y0:y1, x0:x1], np.clip(r + .6 - dd, 0, 1))
    a *= 0.85 + 0.15 * np.clip(gaussian_filter(g.standard_normal((h, w)), 1.2) * 2, -1, 1)
    save('tx-halftone', (226, 150, 0), a * .42)


def gingham(n=240, band=30):
    yy, xx = np.mgrid[0:n, 0:n]
    bx = ((xx // band) % 2 == 0).astype(float); by = ((yy // band) % 2 == 0).astype(float)
    soft = lambda m: gaussian_filter(m, .7, mode='wrap')
    base = soft(bx) * .5 + soft(by) * .5                      # a stripe alone: half; a crossing: full
    weave = 0.75 + 0.25 * (0.5 + 0.5 * np.cos(2 * np.pi * (xx + yy) / 3.0))
    a = base * weave * 0.06
    save('tx-gingham', (236, 52, 134), np.clip(a, 0, .08))


def grain(n=256):
    a = 0.03 + 0.025 * wn(n, .7) + 0.012 * wn(n, 3)
    save('tx-grain', (70, 50, 30), np.clip(a, 0, .08))


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    stucco(); linen(); halftone(); gingham(); grain()
