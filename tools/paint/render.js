// Renders each <svg data-art> in studio.html one material layer at a time (a <g data-mat> each), for paint.py.
// node tools/paint/render.js [art,art,...]      (the studio is served at http://localhost:8767/tools/paint/studio.html)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const only = (process.argv[2] || '').split(',').filter(Boolean);
  const out = path.join(__dirname, 'layers'); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 2 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8767/tools/paint/studio.html', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: 'html,body{background:transparent!important}' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => document.body.dataset.ready === '1');
  const arts = await p.$$eval('svg[data-art]', a => a.map(s => s.dataset.art));
  const manifest = {};
  for (const art of arts) {
    if (only.length && !only.includes(art)) continue;
    const layers = await p.$$eval(`svg[data-art="${art}"] > g[data-mat]`, g => g.map(x => ({ mat: x.dataset.mat, opt: Object.assign({}, x.dataset) })));
    manifest[art] = [];
    for (let i = 0; i < layers.length; i++) {
      await p.evaluate(([art, i]) => {
        document.querySelectorAll('svg[data-art]').forEach(s => s.style.display = s.dataset.art === art ? '' : 'none');
        document.querySelectorAll(`svg[data-art="${art}"] > g[data-mat]`).forEach((g, j) => g.style.display = j === i ? '' : 'none');
      }, [art, i]);
      const el = await p.$(`svg[data-art="${art}"]`);
      const f = `${art}__${String(i).padStart(2, '0')}_${layers[i].mat}.png`;
      await el.screenshot({ path: path.join(out, f), omitBackground: true });
      manifest[art].push(Object.assign({ file: f }, layers[i]));
    }
  }
  const mf = path.join(out, 'manifest.json');
  const old = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf)) : {};
  fs.writeFileSync(mf, JSON.stringify(Object.assign(old, manifest), null, 1));
  console.log('rendered', Object.keys(manifest).join(', '), errs.length ? errs : '');
  await b.close();
})();
