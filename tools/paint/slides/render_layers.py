"""Python port of tools/paint/render.js: renders each <svg data-art> one <g data-mat> layer at a time, at 2x, for paint.py."""
import sys, json, pathlib
from playwright.sync_api import sync_playwright
HERE = pathlib.Path(__file__).parent; LAY = HERE / 'layers'; LAY.mkdir(exist_ok=True)
page = (HERE / sys.argv[1]).resolve().as_uri(); only = sys.argv[2].split(',') if len(sys.argv) > 2 else []
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 2000, 'height': 1200}, device_scale_factor=2)
    pg.goto(page, wait_until='networkidle'); pg.add_style_tag(content='html,body{background:transparent!important}')
    pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(400)
    mf = LAY / 'manifest.json'; man = json.loads(mf.read_text()) if mf.exists() else {}
    for art in pg.eval_on_selector_all('svg[data-art]', 'a=>a.map(s=>s.dataset.art)'):
        if only and art not in only: continue
        layers = pg.eval_on_selector_all(f'svg[data-art="{art}"] > g[data-mat]', 'g=>g.map(x=>Object.assign({mat:x.dataset.mat,opt:Object.assign({},x.dataset)}))')
        man[art] = []
        for i, L in enumerate(layers):
            pg.evaluate("""([art,i])=>{document.querySelectorAll('svg[data-art]').forEach(s=>s.style.display=s.dataset.art===art?'':'none');
              document.querySelectorAll(`svg[data-art="${art}"] > g[data-mat]`).forEach((g,j)=>g.style.display=j===i?'':'none')}""", [art, i])
            f = f"{art}__{i:02d}_{L['mat']}.png"
            pg.locator(f'svg[data-art="{art}"]').screenshot(path=str(LAY / f), omit_background=True)
            man[art].append(dict(file=f, **L))
        print('layers', art, len(layers))
    mf.write_text(json.dumps(man, indent=1)); b.close()
