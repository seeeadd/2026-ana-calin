// The video kit's renderer. One engine (kit.html, kit/engine.js), one config per video (videos/<id>/config.js). See VIDEO-KIT.md.
//   node tools/film/kit/kit.js <video> --draft            half size, 15 fps, one flat layer: for showing Sean early
//   node tools/film/kit/kit.js <video> --final            full size, 30 fps, layers composited with ffmpeg
//   options: --shape d|p|d,p   --from s --to s (cut seconds)   --name <file prefix>   --out <dir>   --workers n
//            --web (also the small files for the page)   --speed 1.25 --audio <mix made at that speed> (also a sped-up copy, her last frame held half a second more)
// A plan pass asks the engine what every layer would show on every frame, without painting. Each shot gets a key per layer from that;
// a key already in the cache is not painted again, so a caption note repaints the captions of one shot and nothing else.
const { chromium } = require('playwright');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs'), path = require('path'), crypto = require('crypto'), os = require('os');

const FILM = path.resolve(__dirname, '..'), ROOT = path.resolve(FILM, '../..'), PORT = +(process.env.PORT || 8768), BASE = `http://localhost:${PORT}/tools/film/`;
const HOME = os.homedir(), CACHE = process.env.KIT_CACHE || `${HOME}/AnaVideo/work/kit-cache`, MAXCHUNK = 4; // seconds: longer shots split, so a note stays small
const SHAPES = { d: { w: 1560, h: 1008, q: '', label: 'desktop' }, p: { w: 1080, h: 1920, q: '&v=p', label: 'phone' } };
if (require.main === module && process.argv[2]) { const m = /desktopW:\s*(\d+)/.exec(fs.readFileSync(`${FILM}/videos/${process.argv[2]}/config.js`, 'utf8')); if (m) SHAPES.d.w = +m[1]; } // a page whose window isn't 1560 wide
const MODES = {
  final: { fps: 30, scale: 1, layered: true, crf: 21, preset: 'medium' },
  draft: { fps: 15, scale: .5, layered: false, crf: 27, preset: 'veryfast', jpeg: 82 }
};
// how each layer is captured and kept: bytes go straight from the browser to the file where the format allows it
const KEEP = {
  world: { cap: { format: 'jpeg', quality: 95 }, ext: 'jpgs', demux: 'jpeg_pipe' },
  her: { cap: { format: 'webp', quality: 95 }, ext: 'webps', demux: 'webp_pipe', alpha: 1 },
  thin: { cap: { format: 'png', optimizeForSpeed: true }, ext: 'mov', alpha: 1 } // actor, graphics, captions: mostly empty, and qtrle keeps a repeated frame for nothing
};
const keepOf = l => KEEP[l] || KEEP.thin;

function args() {
  const a = process.argv.slice(2), o = { video: a[0], mode: 'final', shapes: ['d', 'p'], workers: Math.min(8, os.cpus().length - 2) };
  for (let i = 1; i < a.length; i++) {
    if (a[i] === '--draft') o.mode = 'draft'; else if (a[i] === '--final') o.mode = 'final';
    else if (a[i] === '--shape') o.shapes = a[++i].split(','); else if (a[i] === '--from') o.from = +a[++i]; else if (a[i] === '--to') o.to = +a[++i];
    else if (a[i] === '--name') o.name = a[++i]; else if (a[i] === '--out') o.out = a[++i]; else if (a[i] === '--workers') o.workers = +a[++i];
    else if (a[i] === '--web') o.web = true; else if (a[i] === '--speed') o.speed = +a[++i]; else if (a[i] === '--audio') o.audio = a[++i];
    else throw new Error('unknown option ' + a[i]);
  }
  if (!o.video) throw new Error('which video? node kit.js <video> --draft|--final');
  return o;
}
const within = (p, ms, what) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timed out: ' + what)), ms).unref())]);
// another render on the machine starves the browsers: fewer workers rather than crashed ones
function capWorkers(n) { const cpus = os.cpus().length, load = os.loadavg()[0]; if (load <= cpus) return n; const k = Math.max(4, Math.min(n, Math.round(n * cpus / load))); console.log(`  machine is busy (load ${load.toFixed(0)}): ${k} workers`); return k }
const sha = (...x) => { const h = crypto.createHash('sha1'); x.forEach(v => h.update(String(v))); return h.digest('hex').slice(0, 20) };
const secs = t0 => ((Date.now() - t0) / 1000).toFixed(1) + 's';
const stamp = f => { try { const s = fs.statSync(f); return s.size + ':' + Math.round(s.mtimeMs) } catch (e) { return 'missing' } };

async function ensureServer() {
  const up = () => fetch(BASE + 'kit.html', { method: 'HEAD' }).then(r => r.ok, () => false);
  if (await up()) return null;
  const c = spawn('python3', ['-I', `${HOME}/AnaVideo/work/serve.py`, String(PORT), ROOT], { stdio: 'ignore' });
  for (let i = 0; i < 40 && !(await up()); i++) await new Promise(r => setTimeout(r, 150));
  return c;
}

// a page on the film, ready to render. A failed picture stops the render rather than quietly painting without it
async function openFilm(b, video, shape, scale, extra, onError) {
  const s = SHAPES[shape], ctx = await b.newContext({ viewport: { width: s.w, height: s.h } }), p = await ctx.newPage();
  p.on('pageerror', e => onError('page error: ' + e.message));
  if (extra === '&plan=1') await p.route(/\.(webp|png|jpe?g)(\?.*)?$/, r => r.abort());
  else p.on('requestfailed', q => { if (!/fonts\.g/.test(q.url())) onError('failed to load ' + q.url()) });
  await p.goto(`${BASE}kit.html?video=${video}${s.q}${extra || ''}`, { waitUntil: 'load' });
  await p.waitForSelector('body[data-ready]', { state: 'attached', timeout: 120000 });
  return p;
}

// the pieces of the timeline: shot by shot, long shots split
function makeChunks(info, m, from, to) {
  const f0 = Math.round(from * m.fps), f1 = Math.round(to * m.fps), cuts = new Set([f0, f1]), mx = MAXCHUNK * m.fps;
  info.shots.forEach(t => { const f = Math.round(t * m.fps); if (f > f0 && f < f1) cuts.add(f) });
  const c = [...cuts].sort((a, b) => a - b), out = [];
  for (let i = 0; i < c.length - 1; i++) { const n = Math.ceil((c[i + 1] - c[i]) / mx); for (let j = 0; j < n; j++) out.push([c[i] + Math.round((c[i + 1] - c[i]) * j / n), c[i] + Math.round((c[i + 1] - c[i]) * (j + 1) / n)]) }
  return out;
}
const shotOf = (info, m, f) => { let k = 0; info.shots.forEach((t, i) => { if (f >= Math.round(t * m.fps)) k = i }); return k + 1 };

// paint one layer of one chunk into the cache
async function paint(page, cdp, job, m, fail) {
  const L = job.layer, flat = L === 'all', keep = flat ? { cap: { format: 'jpeg', quality: m.jpeg } } : keepOf(L), tmp = `${job.file}.${process.pid}.tmp`;
  await page.evaluate(n => window.KIT.setLayer(n), L);
  await cdp.send('Emulation.setDefaultBackgroundColorOverride', keep.alpha ? { color: { r: 0, g: 0, b: 0, a: 0 } } : {});
  const clip = m.scale === 1 ? {} : { clip: { x: 0, y: 0, width: job.w, height: job.h2, scale: m.scale } };
  let sink, done;
  if (flat) sink = spawn('ffmpeg', ['-y', '-nostdin', '-v', 'error', '-f', 'jpeg_pipe', '-framerate', String(m.fps), '-i', '-', '-c:v', 'libx264', '-preset', m.preset, '-crf', String(m.crf), '-pix_fmt', 'yuv420p', '-video_track_timescale', '30000', '-threads', '2', '-f', 'mp4', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
  else if (keep.ext === 'mov') sink = spawn('ffmpeg', ['-y', '-nostdin', '-v', 'error', '-f', 'png_pipe', '-framerate', String(m.fps), '-i', '-', '-c:v', 'qtrle', '-pix_fmt', 'argb', '-g', '999', '-threads', '2', '-f', 'mov', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
  if (sink) done = new Promise((res, rej) => sink.on('close', c => c ? rej(new Error('ffmpeg failed on ' + L)) : res()));
  const fd = sink ? null : fs.openSync(tmp, 'w'); let last = null, lastH = null, painted = 0;
  try { for (let i = 0; i < job.h.length; i++) {
    if (job.h[i] !== lastH) { await within(page.evaluate(t => window.render(t), (job.f0 + i) / m.fps), 90000, 'frame'); last = Buffer.from((await within(cdp.send('Page.captureScreenshot', { ...keep.cap, captureBeyondViewport: false, ...clip }), 90000, 'screenshot')).data, 'base64'); lastH = job.h[i]; painted++ }
    if (sink) { if (!sink.stdin.write(last)) await new Promise(r => sink.stdin.once('drain', r)) } else fs.writeSync(fd, last);
    if (fail.msg) throw new Error(fail.msg);
  } } catch (e) { if (sink) { done.catch(() => {}); sink.kill('SIGKILL') } else fs.closeSync(fd); try { fs.unlinkSync(tmp) } catch (_) {} throw e }
  if (sink) { sink.stdin.end(); await done } else fs.closeSync(fd);
  fs.renameSync(tmp, job.file);
  return painted;
}

// stack one chunk's layers, grain on top, and encode
function composite(c, order, grain, m, threads) {
  const inp = [], fc = []; let prev = '0:v';
  order.forEach((l, i) => { const k = keepOf(l), fl = c.files[l]; if (k.demux) inp.push('-f', k.demux, '-framerate', String(m.fps), '-i', fl); else inp.push('-i', fl) });
  fc.push(`[0:v]format=gbrp[b0]`); prev = 'b0';
  for (let i = 1; i < order.length; i++) { fc.push(`[${prev}][${i}:v]overlay=format=gbrp:eof_action=repeat[b${i}]`); prev = `b${i}` }
  inp.push('-loop', '1', '-framerate', String(m.fps), '-i', grain);
  fc.push(`[${order.length}:v]format=gbrp[g]`, `[${prev}][g]blend=all_mode=multiply:shortest=1,scale=out_range=pc:out_color_matrix=bt601:flags=accurate_rnd+full_chroma_int,format=yuvj420p[out]`);
  const r = spawnSync('ffmpeg', ['-y', '-nostdin', '-v', 'error', ...inp, '-filter_complex', fc.join(';'), '-map', '[out]', '-frames:v', String(c.f1 - c.f0), '-c:v', 'libx264', '-preset', m.preset, '-crf', String(m.crf), '-color_range', 'pc', '-colorspace', 'bt470bg', '-video_track_timescale', '30000', '-threads', String(threads), '-f', 'mp4', c.tmp], { stdio: 'inherit' });
  if (r.status) throw new Error('composite failed');
  fs.renameSync(c.tmp, c.file);
}
function compositeAsync(c, order, grain, m, threads) {
  return new Promise((res, rej) => {
    const js = `const a=${JSON.stringify([c, order, grain, m, threads])};require(${JSON.stringify(__filename)}).composite(...a)`;
    const k = spawn(process.execPath, ['-e', js], { stdio: 'inherit', env: { ...process.env, KIT_LIB: '1' } });
    k.on('close', x => x ? rej(new Error('composite failed')) : res());
  });
}

async function renderShape(o, shape, m, browserPool) {
  const T0 = Date.now(), s = SHAPES[shape], sc = m.scale, fail = { msg: null };
  const b0 = await chromium.launch(), plan = await openFilm(b0, o.video, shape, 1, '&plan=1', () => {});
  const info = await plan.evaluate(() => ({ ...window.KIT.info(), audio: window.VIDEO.audio }));
  const from = o.from || 0, to = Math.min(o.to == null ? info.dur : o.to, info.dur), chunks = makeChunks(info, m, from, to);
  const pl = await plan.evaluate(([c, f]) => window.KIT.plan(c, f), [chunks, m.fps]);
  await b0.close(); const tPlan = Date.now();
  const salt = sha(fs.readFileSync(`${FILM}/kit.html`), fs.readFileSync(`${FILM}/kit/engine.css`), m.fps, sc, s.w, s.h, m.layered ? '' : [m.jpeg, m.crf, m.preset, 'ts30k']), RECIPE = 'pc601-ts30k';
  const cdir = `${CACHE}/${shape}`; fs.mkdirSync(cdir, { recursive: true });
  const order = info.order, stat = {};
  const layerKey = (l, r) => sha(salt, l, r.h.join(','), r.u.map(u => u + '=' + stamp(path.resolve(FILM, u.split('?')[0]))).join(','));
  // what needs painting
  const jobs = [], rows = chunks.map((ch, i) => {
    const row = { f0: ch[0], f1: ch[1], shot: shotOf(info, m, ch[0]), files: {}, keys: [] };
    if (m.layered) order.forEach(l => { const k = layerKey(l, pl[i][l]), file = `${cdir}/${k}.${l}.${keepOf(l).ext}`; row.files[l] = file; row.keys.push(k); if (!fs.existsSync(file)) jobs.push({ layer: l, f0: ch[0], h: pl[i][l].h, file, shot: row.shot, w: s.w, h2: s.h }) });
    else { const h = pl[i][order[0]].h.map((_, j) => order.map(l => pl[i][l].h[j]).join('.')), u = order.flatMap(l => pl[i][l].u), k = layerKey('all', { h, u }), file = `${cdir}/${k}.all.mp4`; row.file = file; if (!fs.existsSync(file)) jobs.push({ layer: 'all', f0: ch[0], h, file, shot: row.shot, w: s.w, h2: s.h }) }
    return row;
  });
  // one grain per shape, once
  const grain = `${cdir}/${sha(salt, 'grain', stamp(path.resolve(ROOT, 'img/vip/paint/tx-grain.webp')))}.grain.png`;
  const needGrain = m.layered && !fs.existsSync(grain);
  const tot = rows.length * (m.layered ? order.length : 1);
  console.log(`${s.label}: ${rows.length} chunks, ${jobs.length} of ${tot} layer pieces to paint, plan ${((tPlan - T0) / 1000).toFixed(1)}s`);
  const byL = {}; jobs.forEach(j => { (byL[j.layer] = byL[j.layer] || new Set()).add(j.shot) });
  Object.keys(byL).forEach(l => console.log(`  ${l}: shot${byL[l].size > 1 ? 's' : ''} ${[...byL[l]].join(' ')}`));
  // paint
  const q = jobs.slice().sort((a, b) => b.h.length - a.h.length); let painted = 0;
  const nw = Math.min(capWorkers(o.workers), q.length + (needGrain ? 1 : 0));
  const launch = async () => { const b = await chromium.launch(), p = await openFilm(b, o.video, shape, sc, '', e => { fail.msg = fail.msg || e }), cdp = await p.context().newCDPSession(p); return { b, p, cdp } };
  await Promise.all(Array.from({ length: nw }, async (_, w) => {
    let { b, p, cdp } = await launch();
    if (w === 0 && needGrain) { await p.evaluate(() => window.KIT.setLayer('grain')); await cdp.send('Emulation.setDefaultBackgroundColorOverride', {}); fs.writeFileSync(grain, Buffer.from((await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })).data, 'base64')) }
    while (q.length) {
      const j = q.shift();
      try { const n = await paint(p, cdp, j, m, fail); painted += n }
      catch (e) { // a stalled browser or a dropped request: a fresh one takes the job again, up to three times
        j.tries = (j.tries || 0) + 1; if (j.tries >= 3) throw new Error(`${j.layer} shot ${j.shot}: ${e.message}`);
        console.log(`  retry ${j.layer} shot ${j.shot}: ${e.message}`); fail.msg = null; q.push(j); await b.close().catch(() => {}); ({ b, p, cdp } = await launch());
      }
    }
    await b.close();
  }));
  const tPaint = Date.now();
  console.log(`  painted ${painted} frames in ${((tPaint - tPlan) / 1000).toFixed(1)}s`);
  // composite the chunks whose layers changed
  let comp = 0;
  if (m.layered) {
    const todo = [];
    rows.forEach(r => { r.file = `${cdir}/${sha(salt, RECIPE, r.keys.join(','), grain, m.crf, m.preset)}.comp.mp4`; r.tmp = `${r.file}.${process.pid}.tmp`; if (!fs.existsSync(r.file)) todo.push(r) });
    comp = todo.length; const par = Math.max(1, Math.min(capWorkers(o.workers), todo.length)), th = Math.max(2, Math.floor(os.cpus().length / par));
    await Promise.all(Array.from({ length: par }, async () => { while (todo.length) { const c = todo.shift(); await compositeAsync(c, order, grain, m, th).catch(() => compositeAsync(c, order, grain, m, th)) } }));
  }
  const tComp = Date.now();
  if (m.layered) console.log(`  composited ${comp} of ${rows.length} chunks in ${((tComp - tPaint) / 1000).toFixed(1)}s`);
  // join without encoding again; her sound if the config names it
  const out = path.resolve(o.out || `${HOME}/AnaVideo/out/kit`); fs.mkdirSync(out, { recursive: true });
  const file = `${out}/${o.name || o.video}-${o.mode}-${s.label}.mp4`, list = `${file}.txt`, audio = (info.audio || '').replace(/^~/, HOME);
  fs.writeFileSync(list, rows.map(r => `file '${r.file}'`).join('\n') + '\n');
  const au = audio && fs.existsSync(audio) ? ['-ss', String(from), '-t', String(to - from), '-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : [];
  const r = spawnSync('ffmpeg', ['-y', '-nostdin', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, ...au, '-c:v', 'copy', '-movflags', '+faststart', file], { stdio: 'inherit' });
  fs.unlinkSync(list); if (r.status) throw new Error('join failed');
  let last = file;
  if (o.speed && o.speed !== 1) { // her words and the picture sped up after the fact; the sound comes from audio.json at the same speed
    const fast = file.replace(/\.mp4$/, `-${o.speed}x.mp4`), sp = (o.audio || '').replace(/^~/, HOME), au2 = sp ? ['-i', sp, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest'] : [];
    spawnSync('ffmpeg', ['-y', '-nostdin', '-v', 'error', '-i', file, ...au2, '-vf', `setpts=PTS/${o.speed},fps=${m.fps},tpad=stop_mode=clone:stop_duration=0.5`, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', String(m.layered ? 17 : m.crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', fast], { stdio: 'inherit' }); last = fast;
  }
  if (o.web) spawnSync('ffmpeg', ['-y', '-nostdin', '-v', 'error', '-i', last, '-vf', `scale=${shape === 'd' ? 1200 : 720}:-2`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', last.replace(/\.mp4$/, '-web.mp4')], { stdio: 'inherit' });
  console.log(`  ${last}\n  ${s.label} total ${secs(T0)}`);
  return { file, total: (Date.now() - T0) / 1000, painted, comp, jobs: jobs.length };
}

async function main() {
  const o = args(), m = MODES[o.mode], srv = await ensureServer(), T0 = Date.now();
  try { for (const sh of o.shapes) await renderShape(o, sh, m); console.log(`all done in ${secs(T0)}`) }
  finally { if (srv) srv.kill() }
}
if (process.env.KIT_LIB) module.exports = { composite }; else main().catch(e => { console.error(e.message); process.exit(1) });
