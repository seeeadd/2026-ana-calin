// Renders tools/film/motion.html to video, frame by frame (every frame is render(t), so the timing is exact).
// node tools/film/render.js <out.mp4> [fps=30] [url]        a video
// node tools/film/render.js --sheet <out.png> t1,t2,...     a contact sheet of single frames, to check staging
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const URL0 = 'http://localhost:8767/tools/film/' + (process.env.FILM || 'motion.html');

(async () => {
  const args = process.argv.slice(2);
  const sheet = args[0] === '--sheet';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(sheet ? URL0 : (args[2] || URL0), { waitUntil: 'networkidle' });
  await p.waitForSelector('body[data-ready]', { timeout: 20000 });
  if (sheet) {
    const times = args[2].split(',').map(Number), shots = [];
    for (const t of times) { await p.evaluate(t => window.render(t), t); shots.push(await p.screenshot({ type: 'png' })); }
    const fs = require('fs'), dir = require('path').dirname(args[1]);
    shots.forEach((s, i) => fs.writeFileSync(`${dir}/sheet-${String(i).padStart(2, '0')}.png`, s));
    console.log('frames:', times.length, 'errors:', errs.length ? errs : 'none');
    await b.close(); return;
  }
  // motion blur: render `sub` frames per output frame and let ffmpeg blend them (tmix), keeping every `sub`th
  const out = args[0], fps = +(args[1] || 30), sub = +(process.env.SUB || 2), dur = await p.evaluate(() => window.DUR), n = Math.round(dur * fps * sub);
  const vf = sub > 1 ? ['-vf', `tmix=frames=${sub},framestep=${sub}`] : [];
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps * sub), '-i', '-', ...vf,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', process.env.CRF || '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => window.render(t), i / (fps * sub));
    const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) process.stdout.write(`frame ${i}/${n} (${((Date.now() - t0) / 1000).toFixed(0)}s)\n`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log('done', out, n, 'frames', ((Date.now() - t0) / 1000).toFixed(0) + 's', 'errors:', errs.length ? errs : 'none');
  await b.close();
})();
