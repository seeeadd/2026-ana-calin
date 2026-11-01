"""Ana's paint engine: gives each flat SVG layer (rendered by render.js) a real material, on one shared sheet of paper.

python3 tools/paint/paint.py [art ...]      -> img/vip/paint/<art>.webp (+ tools/paint/out/<art>-preview.jpg)

Materials (a <g data-mat="..."> in studio.html; options as data-* on the group):
  wash     watercolour: transparent, misses the line a little, pigment pools at the edge and in the paper's valleys
  gouache  opaque and matte: brush streaks (data-angle), a dry broken edge
  ink      warm black line: wobbles, varies in weight, breaks where the paper's tooth stands up
  pencil   colour only on the peaks of the paper, with a slight grain
  white    white gouache highlights, broken by the paper
  shadow   a soft, cool grey wash pooled under an object
  flat     exactly as drawn (letterpress type, stamp paper), with the paper's tooth
  sheet    the object's own paper (a stamp, a card): sets the outline of the object, takes the paper's tone
Every picture gets one paper height map, so the wash pools where the pencil skips. The study behind it: STUDY.md.
"""
import json, os, sys
import numpy as np, cv2
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
LAY = os.path.join(HERE, 'layers')
OUT = os.path.join(ROOT, 'img', 'vip', 'paint')
PRE = os.path.join(HERE, 'out')
S = 2.0   # layers are rendered at 2x, so every size below is in CSS px times S


def noise(h, w, sigma, seed):
    r = np.random.default_rng(seed).standard_normal((h, w)).astype(np.float32)
    k = int(sigma * 3) | 1
    n = cv2.GaussianBlur(r, (k, k), sigma) if sigma > 0.6 else r
    return n / (n.std() + 1e-6)


def streaks(h, w, angle, seed, long=9, short=1.4):
    r = np.random.default_rng(seed).standard_normal((h, w)).astype(np.float32)
    n = cv2.GaussianBlur(r, (0, 0), sigmaX=long * S, sigmaY=short * S)
    M = cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1.0)
    n = cv2.warpAffine(n, M, (w, h), borderMode=cv2.BORDER_REFLECT)
    return n / (n.std() + 1e-6)


def paper(h, w, seed):
    """the sheet's height map in 0..1: tooth at four scales and a few fibres"""
    H = 0.45 * noise(h, w, 1.1 * S, seed) + 0.3 * noise(h, w, 2.6 * S, seed + 1) + 0.18 * noise(h, w, 7 * S, seed + 2) + 0.12 * noise(h, w, 30 * S, seed + 3)
    fib = np.zeros((h, w), np.float32); g = np.random.default_rng(seed + 9)
    for _ in range(int(h * w / 9000)):
        x, y = g.uniform(0, w), g.uniform(0, h); a = g.uniform(0, np.pi); L = g.uniform(8, 30) * S
        pts = np.array([[x, y], [x + np.cos(a) * L / 2, y + np.sin(a) * L / 2 + g.normal(0, 2)], [x + np.cos(a) * L, y + np.sin(a) * L]], np.int32)
        cv2.polylines(fib, [pts], False, 1.0, 1, cv2.LINE_AA)
    H = H + 0.6 * cv2.GaussianBlur(fib, (0, 0), 0.7)
    H = (H - H.min()) / (H.max() - H.min())
    return H


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)


def warp(img, h, w, sigma, amp, seed):
    fx = noise(h, w, sigma, seed) * amp; fy = noise(h, w, sigma, seed + 50) * amp
    X, Y = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    return cv2.remap(img, X + fx, Y + fy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)


def load(f):
    a = np.asarray(Image.open(os.path.join(LAY, f)).convert('RGBA')).astype(np.float32) / 255
    return a[..., :3], a[..., 3]


def paint(art, layers):
    first = Image.open(os.path.join(LAY, layers[0]['file'])); w, h = first.size
    seed = sum(map(ord, art))
    H = paper(h, w, seed)
    rgb = np.ones((h, w, 3), np.float32)      # the picture over white
    cov = np.zeros((h, w), np.float32)        # how much of each pixel is paint or object paper
    for i, L in enumerate(layers):
        col, a = load(L['file']); o = L.get('opt', {}); mat = L['mat']; sd = seed + 101 * (i + 1)
        dens = float(o.get('density', 1))
        if a.max() < 0.01: continue
        if mat in ('wash', 'shadow'):
            amp = float(o.get('bleed', 3.2 if mat == 'wash' else 3.5)) * S
            a2 = warp(a, h, w, 14 * S, amp, sd); col = warp(col, h, w, 14 * S, amp, sd)
            if mat == 'shadow': a2 = cv2.GaussianBlur(a2, (0, 0), 7 * S) * 0.7
            inside = (a2 > 0.5).astype(np.uint8)
            dist = cv2.distanceTransform(inside, cv2.DIST_L2, 5) / S
            rim = np.exp(-dist / float(o.get('rim', 2.6))) * inside
            blot = 1 + 0.16 * noise(h, w, 26 * S, sd + 3) + 0.06 * noise(h, w, 6 * S, sd + 4)
            gran = 0.86 + 0.32 * (1 - H)
            D = a2 * blot * gran * (0.78 + 0.5 * rim) * (0.85 if mat == 'wash' else 0.5) * dens
            D = np.clip(D, 0, 1)[..., None]
            rgb *= 1 - D * (1 - col)
            cov = 1 - (1 - cov) * (1 - D[..., 0])
        elif mat in ('gouache', 'white'):
            a2 = warp(a, h, w, 8 * S, 1.6 * S, sd); col = warp(col, h, w, 8 * S, 1.6 * S, sd)
            inside = (a2 > 0.5).astype(np.uint8)
            dist = cv2.distanceTransform(inside, cv2.DIST_L2, 5) / S
            edge = smooth(dist, 0, 2.6)
            dry = smooth(H + 0.25 * noise(h, w, 1.5 * S, sd + 7), 0.72, 0.9)
            A = np.clip(a2 * (1 - (1 - edge) * dry * 0.9), 0, 1)
            if mat == 'white': A *= np.clip(1 - 0.55 * smooth(H, 0.62, 0.95), 0, 1)
            st = streaks(h, w, float(o.get('angle', 0)), sd + 8)
            shade = 1 + float(o.get('streak', 0.022)) * st + 0.03 * (H - 0.5) + 0.025 * noise(h, w, 20 * S, sd + 9)
            c = np.clip(col * shade[..., None], 0, 1)
            A = (A * dens)[..., None]
            rgb = rgb * (1 - A) + c * A
            cov = np.maximum(cov, A[..., 0])
        elif mat == 'ink':
            a2 = warp(a, h, w, 5 * S, 0.7 * S, sd); a2 = warp(a2, h, w, 40 * S, 2.0 * S, sd + 1)
            ab = cv2.GaussianBlur(a2, (0, 0), 0.6 * S)
            A = smooth(ab, 0.1, 0.45)                                              # the line itself
            A *= 0.8 + 0.2 * smooth(noise(h, w, 16 * S, sd + 2), -1, 1)            # pen pressure along the line
            A *= 1 - 0.45 * smooth(H + 0.15 * noise(h, w, 1 * S, sd + 3), 0.84, 1)  # dry breaks on the paper's tooth
            A = np.clip(A * dens, 0, 1)[..., None]
            ink = np.array([float(x) for x in o.get('rgb', '0.23,0.16,0.13').split(',')], np.float32)
            c = np.where(col.sum(2, keepdims=True) > 0.05, col, ink)   # coloured ink keeps its colour
            rgb *= 1 - A * (1 - c)
            cov = np.maximum(cov, A[..., 0])
        elif mat == 'pencil':
            a2 = warp(a, h, w, 6 * S, 0.8 * S, sd)
            A = a2 * (0.5 + 0.5 * smooth(H + 0.18 * noise(h, w, 0.8 * S, sd + 2), 0.3, 0.62)) * 0.95 * dens
            A = np.clip(A, 0, 1)[..., None]
            rgb *= 1 - A * (1 - col)
            cov = np.maximum(cov, A[..., 0])
        elif mat in ('flat', 'sheet'):
            A = a[..., None] * dens
            tone = 1 - (0.045 if mat == 'sheet' else 0.0) * (1 - H)[..., None] - 0.015 * noise(h, w, 30 * S, sd)[..., None]
            c = np.clip(col * tone, 0, 1)
            if mat == 'flat':   # letterpress: the ink skips where the paper is low
                A = A * (1 - 0.5 * smooth(1 - H + 0.15 * noise(h, w, 0.8 * S, sd + 5), 0.62, 0.9))[..., None]
            rgb = rgb * (1 - A) + c * A
            cov = np.maximum(cov, A[..., 0])
    # un-premultiply against white, so the picture sits on any page colour
    al = np.clip(cov, 0, 1)[..., None]
    out = np.where(al > 0.004, 1 - (1 - rgb) / np.maximum(al, 1e-3), 1)
    out = np.clip(out, 0, 1)
    img = np.dstack([out, al[..., 0]])
    img = (img * 255 + 0.5).astype(np.uint8)
    os.makedirs(OUT, exist_ok=True); os.makedirs(PRE, exist_ok=True)
    im = Image.fromarray(img, 'RGBA')
    im.save(os.path.join(OUT, art + '.webp'), quality=88, method=6)
    pv = Image.new('RGB', im.size, (246, 238, 223)); pv.paste(im, (0, 0), im)
    pv.thumbnail((1400, 1400)); pv.save(os.path.join(PRE, art + '-preview.jpg'), quality=88)
    print(art, im.size)


if __name__ == '__main__' and sys.argv[1:2] != ['tile']:
    man = json.load(open(os.path.join(LAY, 'manifest.json')))
    for art in (sys.argv[1:] or man.keys()):
        paint(art, man[art])


def tile(n=512, seed=4):
    """the page's own paper: a seamless tile of warm cotton paper, its tooth lit from the top left"""
    from scipy.ndimage import gaussian_filter
    g = np.random.default_rng(seed)
    def wn(sig): r = gaussian_filter(g.standard_normal((n, n)), sig, mode='wrap'); return r / r.std()
    H = 0.5 * wn(0.9) + 0.32 * wn(2.2) + 0.2 * wn(6) + 0.14 * wn(24)
    fib = np.zeros((n, n))
    for _ in range(140):
        x, y, a, L = g.uniform(0, n), g.uniform(0, n), g.uniform(0, np.pi), g.uniform(6, 22)
        for t in np.linspace(0, L, int(L * 2)):
            fib[int(y + np.sin(a) * t) % n, int(x + np.cos(a) * t) % n] += 1
    H += 0.5 * gaussian_filter(fib, 0.6, mode='wrap')
    gy, gx = np.gradient(gaussian_filter(H, 0.8, mode='wrap'))
    light = -(gx * 0.7 + gy * 0.7)                       # lit from the top left
    tone = 1 + 0.035 * light / (light.std() + 1e-6) - 0.012 * wn(40)
    base = np.array([244, 236, 221], np.float32) / 255     # warm cotton, never white
    img = np.clip(base[None, None, :] * tone[..., None], 0, 1)
    out = os.path.join(ROOT, 'img', 'vip', 'paint', 'paper.webp')
    Image.fromarray((img * 255).astype(np.uint8)).save(out, quality=90); print('paper tile', out)


if __name__ == '__main__' and len(sys.argv) > 1 and sys.argv[1] == 'tile':
    tile()
