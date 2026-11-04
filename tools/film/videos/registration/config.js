/* The registration video: everything that makes it this video and not another. Times are seconds of her recording; T() maps them onto the cut.
   Copy videos/_template to start a new one. The engine reads this; never the other way round. */
window.VIDEO = {
  id: 'registration',
  frames: '_local/full',                                /* her cut, one image per frame: f/ her, b/ b2/ the sky wash */
  data: ['_local/full-data.js', '_local/full-face.js'], /* EDL, DUR, CAPS from gen_full.py; FACE from facefull.py */
  audio: '~/AnaVideo/out/ana-exit-plan-mix.wav',
  hold: 1.6,                                            /* seconds held on the last frame */
  /* start, type (M main, F framed, C cut-away), crop 0 to 2, optional push-in */
  shots: [[0,'M',0],[8.7,'F',0],[12.76,'F',1],[19.54,'M',0],[23.96,'M',1],[29.22,'C',0],[38.96,'F',0],[44.32,'F',1],[47.8,'M',0],[52.54,'M',1],[54.6,'F',0],[62.56,'F',1],[66.06,'C',0],[77.24,'M',0,.09],[83.84,'M',1],[90.98,'M',2],[95.54,'C',0],[102.92,'F',0],[112.22,'C',0],[117.94,'M',2],[121.84,'C',0],[127.9,'F',1],[132.74,'C',0],[135.48,'M',0],[139.42,'C',0],[148.32,'M',1],[151.56,'C',0],[157.4,'M',2],[161.92,'C',0],[175.68,'M',0],[183.18,'C',0],[194.6,'M',1],[202.96,'C',0],[205.76,'M',0]],
  /* the camera steps closer on these words */
  punch: [6.1, 13.62, 16.6, 22.16, 25.52, 42.82, 48.76, 59.52, 63.3, 81.48, 86.26, 106.24, 119.02, 135.48, 137.88, 147.36, 150.26, 158.56, 179.1, 195.26, 206.34],
  /* where she is: coast, studio, desk. The shutters swing on each change */
  rooms: [[0, 'coast'], [52.54, 'studio'], [90.98, 'desk'], [121.84, 'coast'], [161.92, 'desk'], [202.96, 'coast']],
  /* captions: words on the soft yellow come from *marks in the cut file; these words go pink instead. capEdits: [recording second, old word, new word] */
  pinkWords: ['Cheap', 'live.'], lastWordKey: true, capEdits: [],
  titled: [[0, 4.15], [179.1, 183.18]],                 /* desktop: while a title is up, the caption sits below it */
  /* the sunflower */
  runner: {
    /* his path in recording seconds: he runs at every change of beat, and sits quietly on her chair through "only two people" */
    path: {
      p: [[0, 130], [29.22, 130], [32.3, 960], [32.6, 960], [34.88, 100], [35.6, 130], [52.42, 130], [52.54, 195], [53.4, 540], [76.8, 540], [77.24, 194], [90.9, 194], [90.98, 335], [121.78, 335], [121.84, 130], [132.74, 130], [133.1, 540], [135.48, 540], [135.9, 130], [139.42, 130], [139.9, 540], [145.32, 540], [145.84, 950], [148.32, 950], [148.9, 130], [161.85, 130], [161.92, 335], [190.4, 335], [190.9, 905], [194.6, 905], [195.1, 335], [202.9, 335], [202.96, 130], [203.6, 985], [205.76, 985], [206.3, 540], [210, 540]],
      d: [[0, 320], [29.22, 320], [32.3, 1100], [32.6, 1100], [34.88, 96], [35.9, 320], [52.42, 320], [52.54, 155], [53.4, 440], [76.7, 440], [77.2, 157], [90.9, 157], [90.98, 275], [95.3, 275], [95.8, 1190], [102.9, 1190], [103.4, 275], [121.78, 275], [121.84, 320], [122.3, 200], [132.74, 200], [133.1, 560], [135.48, 560], [135.9, 320], [139.42, 320], [139.9, 1215], [145.32, 1215], [145.84, 940], [148.32, 940], [148.9, 320], [161.85, 320], [161.92, 275], [202.9, 275], [202.96, 300], [204.1, 1130], [205.76, 1130], [206.2, 560], [210, 560]]
    },
    openRun: [4.2, 5.2],                                /* runs on the spot from the start until here, the wall sliding */
    pots: [1.06, 2.76], potsUntil: 6,                   /* terracotta pots: he leaps each as it reaches him */
    launches: [[5.86, 6.42, 190, 240]],                 /* from, to, height desktop, height phone: "free" */
    backRun: [32.6, 34.88],                             /* runs backwards: working back from the income */
    hops: [[6.42, 58], [22.5, 58], [37.2, 66], [45.2, 30], [47.05, 30], [49.38, 50], [60.26, 58], [64.02, 44], [67.8, 60], [73.12, 60], [86.26, 40], [114.02, 66], [122.9, 40], [134.18, 50], [144.16, 56], [147.82, 50], [165.06, 36], [167.76, 36], [170.88, 36], [186.16, 62], [193.1, 40], [206.94, 120]],
    pointAt: [[53.94, 54.2, 55.1, 55.3, 92, 140]],      /* raise, lowered, angle desktop, phone: points at Ana when she says who she is */
    shrugs: [[102, 102.9]],                             /* "find out" */
    formPoints: [[204.05, 205.76, 204.4, 92, 172]],     /* points at the form, with a small hop */
    sit: [77.26, 90.72, 90.98, 142, 112],               /* hops on her chair and swings his legs: from, lift off, off, height desktop, phone */
    points: [[92.3, 94.3], [163, 165.2], [186.3, 188.3]], /* at her screen */
    bounceFrom: 206.94                                  /* the close: bounces, arms up, until the end */
  },
  /* the hand-painted arrow, head leading: from the goal back to Day 1 */
  arrow: {from: 33.5, to: 34.78, off: 34.88,
    d: {src: 'paint/varrow-d.webp', x: 170, y: 160, w: 720, h: 360, path: 'M840 190 C700 420 420 300 250 410', head: 100},
    p: {src: 'paint/varrow-p.webp', x: 170, y: 180, w: 520, h: 780, path: 'M330 210 C640 420 470 760 230 860', head: 104}},
  /* everything laid on top. add(html, in, out, [left, top, width, font] desktop, same for phone, {cls, rot, tilt, wipe, hold}) */
  pieces: function(k){
  var add = k.add, img = k.img, cut = k.cut, strike = k.strike, map = k.map, sit = k.sit, T = k.T, seg = k.seg, lerp = k.lerp, io = k.io, clamp = k.clamp, PHONE = k.PHONE, V = k.V, PC = k.PC, box = k.box, $ = k.$;
  add('<div class="snap">' + img('tex/door-view.webp') + '</div>', 11.32, 15.16, [520, 214, 180], [800, 1190, 210], {cls: 'top', rot: 5, tilt: 3});
  add(cut('hand-pencil'), 48.76, 52.3, [400, 786, 300], [800, 1690, 300], {cls: 'top', rot: -4});
  add(cut('sunflower-news'), 56.84, 58.22, [300, 196, 250], [760, 1290, 260], {cls: 'top', rot: 4, tilt: 3});
  add(cut('hand-magnifier'), 122.9, 127.9, [1060, 560, 270], [2200, 0, 10], {cls: 'top', rot: 4});
  add(cut('hand-point'), 100.46, 102.92, [1000, 610, 150], [850, 1170, 150], {cls: 'top', rot: 6});
  add(cut('cinecam'), 150.26, 151.56, [440, 214, 230], [780, 1320, 250], {cls: 'top', rot: -4});
  add(cut('clip-gold'), 151.7, 157.4, [150, 66, 90], [70, 650, 100], {cls: 'top', rot: 6});
  add(cut('hand-pencil'), 151.9, 155.5, [860, 700, 420], [770, 1684, 330], {cls: 'top', rot: -4});
  add(cut('billboard'), 146.7, 148.32, [130, 190, 940], [40, 880, 1000], {cls: 'under shadowp', rot: 2});
  var lightsA = add(cut('lights-string'), 0, 8.7, [14, -8, 700], [0, -6, 1080], {cls: 'top', hold: 1}); lightsA.count = function(t){ lightsA.e.style.transform = 'rotate(' + (Math.sin(t * 1.6) * .7).toFixed(2) + 'deg)' };
  /* the close: a live event at a set time, so the badge is the page's own LIVE mark, beating, and hitting hard on her word */
  var liveP = add('<div class="lvw"><div class="lvpill"><span class="lvd"><i></i><i></i><b></b></span>LIVE<span style="font-weight:700;letter-spacing:.02em;opacity:.86">on Zoom</span></div></div>', 205.76, 300, [62, 240, 0, 60], [40, 1112, 1000, 88], {cls: 'top', hold: 1}); liveP.t1 = window.DUR;
  liveP.count = function(t){ var t0 = T(205.76), hit = T(206.94), pill = liveP.e.querySelector('.lvpill'), pr = seg(t, t0, t0 + .24), bt = ((t - t0) % .84) / .84, sc = (pr < 1 ? lerp(1.5, 1, pr * pr * pr) : 1) * (1 + .055 * Math.exp(-bt * 5)) * (1 + .24 * (t >= hit ? Math.exp(-(t - hit) * 7) : 0));
    pill.style.opacity = (.25 + .75 * pr).toFixed(3); pill.style.transform = 'scale(' + sc.toFixed(3) + ')'; pill.style.boxShadow = '0 0 0 ' + (bt * 30).toFixed(1) + 'px rgba(255,59,92,' + (.46 * (1 - bt)).toFixed(3) + '),0 10px 22px rgba(30,20,10,.3)';
    [].forEach.call(pill.querySelectorAll('.lvd i'), function(r, i){ var u = (((t - t0) / .84) + i * .5) % 1; r.style.transform = 'scale(' + (1 + u * 2.3).toFixed(3) + ')'; r.style.opacity = (1 - u).toFixed(3) }) };
  var liveL = add('<div class="big"><svg class="lvcal" viewBox="0 0 24 24" fill="none" stroke="#1A1412" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="17.5" rx="3" fill="#FFF8EE"/><path d="M2.5 9.5h19" /><path d="M2.5 7a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v2.5h-19z" fill="#F72585"/><path d="M8 2v4M16 2v4"/><path d="M8.2 15.2l2.6 2.6 5-5.2" stroke="#F72585" stroke-width="2.6"/></svg>Block the time ' + (PHONE ? '' : '<br>') + 'in <mark>your calendar.</mark></div>', 207.2, 300, [62, 392, 620, 68], [40, 1384, 1000, 76], {cls: 'top'}); liveL.t1 = window.DUR;
  var lightsB = add(cut('lights-string'), 205.76, 300, [14, -8, 700], [0, -6, 1080], {cls: 'top', hold: 1}); lightsB.t1 = window.DUR; lightsB.count = function(t){ lightsB.e.style.transform = 'rotate(' + (Math.sin(t * 1.6) * .7).toFixed(2) + 'deg)' };
  add(cut('key-enter'), 204.6, 205.76, [1300, 610, 190], [2200, 0, 10], {cls: 'top', rot: 3});
  /* 1, 6, 35: the line, in the page's type */
  add('<div class="big"><span class="ln">Build proof</span><span class="ln"><i>before you leave.</i></span></div>', 0, 4.15, [62, 92, 620, 96], [0, 1752, 1080, 66], {cls: 'top', wipe: 1});
  var free = add(img('paint/vfree.webp'), 6.1, 7.36, [712, 56, 340], [24, 44, 430], {cls: 'top', hold: 1});
  free.count = function(t){ var pr = seg(t, 6.1, 6.42), sc = t < 6.42 ? lerp(2.1, 1, pr * pr * pr) : 1 - Math.sin(seg(t, 6.42, 6.72) * Math.PI) * .035; free.e.style.opacity = t < 6.42 ? (.3 + .7 * pr).toFixed(3) : 1; free.e.style.transform = 'rotate(' + (t < 6.42 ? lerp(-16, -7, pr) : -7 + Math.sin((t - 6.42) * 7) * 2.2 * Math.exp(-(t - 6.42) * 3)).toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')' };
  var PETALS = []; for (var pi = 0; pi < 14; pi++) { var pm = document.createElement('img'); pm.src = '../../img/vip/paint/petal-' + (pi % 4 + 1) + '.webp'; pm.alt = ''; pm.style.cssText = 'position:absolute;left:0;top:0;z-index:16;width:' + (PHONE ? 70 : 56) + 'px;opacity:0'; box.appendChild(pm); PETALS.push({e: pm, a: pi / 14 * Math.PI * 2 + .3, v: 240 + (pi * 73 % 170), r: (pi % 2 ? 1 : -1) * (280 + pi * 37)}) }
  function petals(t){ var t0 = 6.42, c = PHONE ? [240, 170] : [880, 150]; PETALS.forEach(function(p){ var u = t - t0; if (u < 0 || u > 1.5) { p.e.style.opacity = 0; return } var x = c[0] + Math.cos(p.a) * p.v * u, y = c[1] + Math.sin(p.a) * p.v * u + 300 * u * u; p.e.style.opacity = (1 - seg(u, 1, 1.5)).toFixed(3); p.e.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + (p.r * u).toFixed(1) + 'deg)' }) }
  add('<img class="round" src="' + PC + 'hpill.png" alt="">', 7.36, 8.7, [62, 240, 560], [140, 1440, 800], {cls: 'top shadowp'});
  strike(cut('bulb') + 'a nice idea', 16.6, 18, 17.0, [62, 214, 0, 62], [190, 1300, 0, 70]);
  strike(cut('calc-graphing') + 'a spreadsheet', 17.64, 18, 17.85, [62, 326, 0, 62], [190, 1420, 0, 70]);
  add('<div class="big"><mark>build proof</mark><br><mark>first.</mark></div>', 22.16, 23.96, [62, 120, 620, 134], [0, 1266, 1080, 128], {cls: 'top'});
  /* 8 to 10: the map, the goal, the arrow, the wall */
  map(null, 29.5, 34.88, ['cur', 'cur', 'cur'], [90, 420, 1060, 44], [40, 980, 1000, 40]);
  var goal = add(img(PC + 'goal-' + V + '-0.png'), 33.16, 34.88, [600, 70, 530], [40, 70, 510], {cls: 'top'}); goal.seq = function(t){ return PC + 'goal-' + V + '-' + Math.round(4 * seg(t, T(33.2), T(34.1))) + '.png' };
  var WALL = ['s1', 's3', 's4', 's5', 's6', 'day1b', 'day2a', 'day2b', 'day3a'];
  WALL.forEach(function(n, i){
    var dc = i % 3, dr = Math.floor(i / 3), pc = i % 2, pr = Math.floor(i / 2);
    if (PHONE && i > 5) return;
    add(img('../../img/slides/' + n + '.webp'), 34.88 + i * .16, 38.96, [62 + dc * 360, 50 + dr * 190, 348], [40 + pc * 510, 590 + pr * 300, 490], {cls: 'top shadowp', rot: (i % 2 ? 1 : -1) * 1.2, tilt: (i % 2 ? .5 : -.5)});
  });
  var stp = add('<div style="position:relative">' + img('cut/stamp-red.png') + '<span style="position:absolute;inset:0;display:grid;place-items:center;font-weight:800;letter-spacing:.3em;padding-left:.3em;color:#A5121A">PROOF</span></div>', 37.04, 38.96, [240, 250, 720, 92], [190, 960, 700, 90], {cls: 'top', hold: 1});
  stp.count = function(t){ var pr = seg(t, T(37.04), T(37.22)), sc = t < T(37.22) ? lerp(1.5, 1, pr * pr * pr) : 1 - Math.sin(seg(t, T(37.22), T(37.46)) * Math.PI) * .02; stp.e.style.opacity = t < T(37.22) ? (.25 + .75 * pr).toFixed(3) : 1; stp.e.style.transform = 'rotate(-6deg) scale(' + sc.toFixed(3) + ')' };
  /* 11, 12: can I join */
  add(sit('sit-self', 'I work for myself.'), 41.72, 44.32, [62, 214, 640, 44], [170, 1300, 800, 50], {cls: 'top'});
  add(sit('sit-job', 'I have a job.'), 43.18, 44.32, [62, 346, 640, 44], [170, 1460, 800, 50], {cls: 'top'});
  strike(cut('cat-reading') + 'an audience', 44.78, 47.7, 45.2, [62, 214, 0, 62], [190, 1376, 0, 70]);
  strike(cut('notebook-red') + 'a course idea', 46.74, 47.7, 47.05, [62, 326, 0, 62], [190, 1492, 0, 70]);
  /* 14 to 17: who she is */
  var sig = add('<div id="sigh"></div>', 53.94, 54.6, [62, 214, 560], [250, 1490, 580], {cls: 'top', wipe: 2});
  add(img('../../img/how-we-grow-wordmark.png'), 57.36, 58.22, [62, 214, 210], [420, 1400, 240]);
  add('<div class="statc">' + img(PC + 'stat0.png') + '</div>', 58.78, 66.06, [62, 226, 400], [90, 1360, 500]);
  add('<div class="statc">' + img(PC + 'stat2.png') + '</div>', 62.56, 66.06, [62, 372, 250], [640, 1360, 340]);
  /* 18, 19: proof */
  var cnt = add('<div class="big" style="text-align:center"><mark>over <span class="n">0</span></mark></div>', 66.48, 69.62, [62, 200, 1060, 180], [40, 700, 1000, 170], {cls: 'top'}); cnt.count = function(t){ var n = Math.round(16000 * io(seg(t, T(66.6), T(67.8))) / 10) * 10; cnt.e.querySelector('.n').textContent = n.toLocaleString('en-US') };
  var FACES = ['adora', 'alyssa', 'annemarie', 'gustavo', 'hilde', 'jeanette'];
  add('<div class="fc">' + FACES.map(function(n){ return '<img src="../../img/av/' + n + '.webp" alt="">' }).join('') + '</div>', 67.14, 69.62, [62, 440, 1060, 96], [40, 930, 1000, 110], {cls: 'top', id: 'faces'});
  add('<div class="big" style="font-size:1em">“I was able to monetize a 300ish audience and <mark>make over $3K in a month.</mark>”</div>', 69.62, 77.24, [62, 60, 570, 62], [40, 80, 520, 54], {cls: 'top'});
  add(img(PC + 'jillnote.png'), 70.2, 77.24, [660, 40, 470], [230, 600, 620], {cls: 'top shadowp', tilt: 1.2, rot: 2});
  add('<div class="lbl" style="display:inline-block;background:#FFF8EE;padding:8px 14px;border-radius:10px;color:var(--ink);box-shadow:0 3px 10px rgba(50,35,20,.18)"><b>Jill Hart</b>, in Ana’s past challenge. Individual results vary.</div>', 70.2, 77.24, [62, 280, 590, 25], [60, 1420, 960, 38], {cls: 'top'});
  /* 22: the order we were taught */
  var STEPS = [['pick an idea', 95.72], ['maybe build a niche', 97.22], ['build a thing', 98.56], ['grow the audience', 99.4], ['find out if anyone wants it', 100.46]];
  var RS = [];
  STEPS.forEach(function(s, i){ RS.push(add('<div class="rowb' + (i === 4 ? ' lit' : '') + '"><span class="tk"></span>' + s[0] + '</div>', s[1], 102.92, [90, 64 + i * 142, 1020, 60], [40, 590 + i * 150, 1000, 62], {cls: 'top'})) });
  /* 24: the reveal. The list comes back, a sheet washes it, the new line lands on top */
  STEPS.forEach(function(s, i){ var rr = add('<div class="rowb' + (i === 4 ? ' lit' : '') + '"><span class="tk"></span>' + s[0] + '</div>', 112.22, 114.3, [90, 64 + i * 142, 1020, 60], [40, 590 + i * 150, 1000, 62], {cls: 'top', hold: 1}); rr.count = function(t){ var g = seg(t, T(113.26) + (4 - i) * .05, T(113.26) + (4 - i) * .05 + .7), gg = g * g; rr.e.style.transform = 'translate(' + (-gg * 1500).toFixed(1) + 'px,' + (-Math.sin(g * 2.1) * (120 + i * 30)).toFixed(1) + 'px) rotate(' + (-gg * 42 * (i % 2 ? 1 : -1)).toFixed(2) + 'deg)' } });
  add('<div class="big" style="text-align:center"><span style="font-size:.42em">begins</span></div>', 113.6, 117.94, [62, 6, 1060, 200], [40, 538, 1000, 200], {cls: 'top'});
  var ear = add('<div class="big" style="text-align:center"><i>earlier</i></div>', 114.02, 117.94, [62, 150, 1060, 330], [40, 720, 1000, 330], {cls: 'top', hold: 1}); ear.count = function(t){ var pr = seg(t, T(114.02), T(114.02) + .2), sc = pr < 1 ? lerp(1.7, 1, pr * pr * pr) : 1 - Math.sin(seg(t, T(114.02) + .2, T(114.02) + .5) * Math.PI) * .03; ear.e.style.opacity = (.2 + .8 * pr).toFixed(3); ear.e.style.transform = 'scale(' + sc.toFixed(3) + ') rotate(-2deg)' };
  add('<div class="big" style="text-align:center;background:#FFF8EE;border-radius:18px;padding:.16em .3em .22em;box-shadow:0 8px 22px rgba(50,35,20,.22)">with <mark>deciding what is worth building.</mark></div>', 114.72, 117.94, [90, 500, 1010, 60], [40, 1080, 1000, 84], {cls: 'top'});
  /* 26 to 34: the map comes back further along each time, in her words */
  var DW = ['Find the problem', 'Put numbers on it', 'Put it out there'];
  map(DW, 121.84, 127.9, ['cur', '', ''], [62, 70, 1070, 28], [30, 590, 1020, 44]);
  /* her camera tile sits over the window's corner, framed on her whole face */
  add('<div style="position:relative">' + img(PC + 'art1win.png') + '<div style="position:absolute;right:-2.2%;bottom:-5.5%;width:24%;aspect-ratio:1.3;overflow:hidden;border-radius:16px;background:#2A211D;border:5px solid #3FD06B;box-shadow:0 0 0 5px rgba(63,208,107,.35),0 10px 22px rgba(30,20,10,.3)"><img src="../../img/o/real/ana-studio.webp" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 40%;border-radius:0;box-shadow:none"><span style="position:absolute;left:9px;bottom:8px;padding:3px 10px;border-radius:7px;background:rgba(26,20,18,.72);color:#fff;font:700 15px/1.4 Manrope,sans-serif">Ana</span></div></div>', 122.9, 127.9, [240, 220, 740], [214, 1002, 826], {cls: 'top shadowp'});
  add(img('../../img/slides/s1.webp'), 128.84, 132.74, [62, 214, 640], [220, 1340, 640], {cls: 'top shadowp', tilt: -.8, rot: -1.5});
  map(DW, 132.74, 135.48, ['done', 'cur', ''], [62, 110, 1070, 28], [30, 590, 1020, 44]);
  add('<div class="big" style="text-align:center"><mark>put the numbers on it.</mark></div>', 133.7, 135.48, [62, 330, 1060, 112], [40, 1000, 1000, 118], {cls: 'top'});
  add(PHONE ? img(PC + 'rows-p/element-000.png') : img(PC + 'rows-d/element-000.png'), 139.42, 145.32, [60, 110, 1070], [40, 640, 1000], {cls: 'top', hold: 1}).seq = function(t){ var n = clamp(Math.round((t - T(139.42)) * 30), 0, 165); return PC + 'rows-' + V + '/element-' + ('00' + n).slice(-3) + '.png' };
  map(DW, 145.32, 148.32, ['done', 'done', 'cur'], [62, 110, 1070, 28], [30, 590, 1020, 44]);
  add('<div class="big" style="text-align:center"><mark>put it out there.</mark></div>', 146.94, 148.32, [62, 330, 1060, 130], [40, 1120, 1000, 130], {cls: 'top'});
  add(img(PC + 'email.png'), 151.56, 157.4, [120, 110, 990], [40, 700, 1000], {cls: 'top shadowp', tilt: -.6, rot: -1.2});
  map(['Find the problem', 'Put numbers on it', 'Put it out there'], 161.92, 175.68, ['done', 'done', 'done'], [62, 70, 1070, 28], [30, 590, 1020, 44]);
  var TICK = '<svg viewBox="0 0 20 20"><path d="m5 10.5 3.4 3.4L15 6.8"/></svg>';
  [['one idea', 164.76], ['the numbers behind it', 167.46], ['your audience', 170.68]].forEach(function(s, i){ add('<div class="rowb"><span class="tk">' + TICK + '</span>' + s[0] + '</div>', s[1], 175.68, [150, 196 + i * 132, 930, 60], [40, 950 + i * 136, 1000, 60], {cls: 'top'}) });
  add('<div class="big"><span class="ln">Build proof</span><span class="ln"><i>before you leave.</i></span></div>', 179.1, 183.18, [62, 92, 620, 96], [0, 1742, 1080, 78], {cls: 'top', wipe: 1});
  /* 36, 37: the real next steps, then the real calculator */
  add('<img class="round" src="' + PC + 'vip-saved.png" alt="">', 183.18, 184.82, [160, 240, 900], [40, 700, 1000], {cls: 'top shadowp', rot: 3});
  var pow = add(img(PC + 'pow0.png'), 184.82, 186.1, [200, 240, 800], [60, 700, 960], {cls: 'top'}); pow.seq = function(t){ return PC + 'pow' + Math.round(7 * seg(t, T(184.86), T(186.0))) + '.png' };
  var lg = add(img(PC + 'logo-locked.png'), 186.1, 187.82, [370, 90, 460], [260, 640, 560], {cls: 'top'}); lg.seq = function(t){ return PC + (t < T(186.5) ? 'logo-locked.png' : 'logo-open.png') };
  var g2 = add(img(PC + 'goal-' + V + '-0.png'), 187.82, 194.6, [170, 70, 860], [40, 620, 1000], {cls: 'top'}); g2.seq = function(t){ return PC + 'goal-' + V + '-' + Math.round(4 * seg(t, T(188.66), T(189.5))) + '.png' };
  [190.76, 191.62, 192.58].forEach(function(s, i){ add('<div style="overflow:hidden;border-radius:26px;border:2px solid var(--ink);height:' + (PHONE ? 300 : 232) + 'px;background:#fff">' + img(PC + 'card-d-' + i + '.png') + '</div>', s, 194.6, [62 + i * 358, 240, 340], [320, 770 + i * 312, 440], {cls: 'top shadowp'}) });
  add('<div class="lbl">Example prices.</div>', 192.74, 194.6, [62, 490, 300, 34], [60, 900, 240, 40], {cls: 'top'});
  /* 39: the real form */
  var FMAX = 14;
  var form = add(img(PC + 'form-' + V + '-000.png'), 202.96, 205.76, [150, 18, 900], [40, 560, 860], {cls: 'top', hold: 1}); form.seq = function(t){
    var i = 0; if (t > T(203.2)) i = 1 + Math.floor(5 * seg(t, T(203.2), T(203.85))); if (t > T(203.95)) i = Math.min(FMAX, 6 + Math.floor((FMAX - 6) * seg(t, T(203.95), T(204.85)) + 1));
    return PC + 'form-' + V + '-' + ('00' + Math.min(i, FMAX)).slice(-3) + '.png' };

  var FORM_BTN = PHONE ? [40 + 860 * .5, 560 + 860 * (1422 / 1074) * .78] : [150 + 900 * .5, 18 + 900 * (1284 / 1545) * .75];
  function pointer(t){
    var cur = $('cursor'), tap = $('tap'), g0 = T(188.2), g1 = T(189.9), b0 = T(204.9), b1 = T(205.76), press = T(205.4);
    cur.style.display = 'none'; tap.style.display = 'none';
    if (t >= g0 && t < g1 && !PHONE) { var p = io(seg(t, g0, g0 + .5)); cur.style.display = 'block'; cur.style.transform = 'translate(' + lerp(1100, 860, p) + 'px,' + lerp(420, 130, p) + 'px)' }
    if (t >= b0 && t < b1) {
      var q = io(seg(t, b0, press - .05));
      if (PHONE) { if (t > press - .12 && t < press + .3) { tap.style.display = 'block'; tap.style.left = FORM_BTN[0] + 'px'; tap.style.top = FORM_BTN[1] + 'px'; tap.style.transform = 'scale(' + lerp(.7, 1.15, seg(t, press - .12, press + .3)).toFixed(3) + ')'; tap.style.opacity = (1 - seg(t, press + .1, press + .3)).toFixed(3) } }
      else { cur.style.display = 'block'; var sc = t > press - .04 && t < press + .12 ? .88 : 1; cur.style.transform = 'translate(' + lerp(1120, FORM_BTN[0] + 90, q).toFixed(1) + 'px,' + lerp(240, FORM_BTN[1] - 4, q).toFixed(1) + 'px) scale(' + sc + ')' }
    }
  }
  k.tick(petals); k.tick(pointer);
  }
};
