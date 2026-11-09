/* The VIP page's video. The page's own metaphor: the door opens on her, your free seat is saved, pull my chair closer. Times are seconds of her recording. */
(function(){
var MAP = function(x){ return Math.round(100 + (x - 180) / 1340 * 860) };
var PATH = [[1.2, 340], [2.3, 310], [2.96, 310], [3.4, 830], [8.4, 830], [8.8, 180], [11.66, 180], [12.3, 1500], [14, 1500], [14.4, 600], [21.14, 600], [22.84, 250], [24.85, 250], [25.3, 760], [35, 760], [35.4, 180], [37.1, 180], [37.6, 500], [42.9, 500], [43.4, 900], [48.6, 900], [49, 760], [55.7, 760], [56.1, 1520], [63.1, 1520], [63.5, 400], [68.9, 400], [69.3, 1520], [74.5, 1520], [75, 1400], [81, 1400], [81.4, 180], [83.7, 180], [87.2, 700], [91, 700], [91.4, 300], [96.5, 300], [97, 1500], [99.1, 1500], [99.6, 520], [102.1, 520], [102.4, 130], [103.5, 288], [120, 288]];
window.VIDEO = {
  id: 'vip', desktopW: 1792, herH: 1280, crown: true, cuts: true, still: true,   /* simple editing: clean cuts between layouts, no frame swing */
  frames: '_local/vip/frames', data: ['_local/vip/data.js', '_local/vip/face.js'], piecesDir: '_local/vip/pieces/',
  audio: '~/AnaVideo/out/kit/vip-mix-1x.wav',
  hold: 1.6,
  layout: {
    d: {W: 1792, zV: 8, bud: 186, RL: [-190, 0], M: [923, 0, 869, 1008], FA: [947, -21, 1], FB: [1382, 30, .47],
      cM: {x: 62, y: 64, w: 820, fs: 58, align: 'left'}, cF: {x: 62, y: 64, w: 850, fs: 60, align: 'left'}, cC: {x: 62, y: 846, w: 1668, fs: 62, align: 'left'}, cW: {x: 396, y: 820, w: 1000, fs: 64, align: 'center'}},
    p: {zV: 8, bud: 190, capT: 1744, capB: 1780, wallM: 1744, hor: 1620, skyH: 1640, RL: [-160, 982], M: [0, 0, 1080, 1920], shM: 1690,
      cM: {x: 40, y: 1392, w: 1000, fs: 70, align: 'center'}, cF: {x: 50, y: 1226, w: 980, fs: 70, align: 'center'}, cC: {x: 50, y: 1484, w: 980, fs: 60, align: 'center'}}
  },
  /* W is her whole frame, big. On the phone M and W are the same: her video runs full under everything */
  /* her steady (M) and a cut-away (C) only for the proof pieces; one crop, no push */
  shots: [[1.2, 'W', 0, .0001], [2.96, 'M', 0, .0001], [11.66, 'C', 0, .0001], [14, 'M', 0, .0001], [21.14, 'C', 0, .0001], [22.84, 'M', 0, .0001], [24.85, 'C', 0, .0001], [32.42, 'M', 0, .0001], [42.98, 'C', 0, .0001], [48.72, 'M', 0, .0001], [55.84, 'C', 0, .0001], [63.16, 'M', 0, .0001], [68.95, 'C', 0, .0001], [81.2, 'M', 0, .0001], [96.64, 'C', 0, .0001], [99.2, 'M', 0, .0001], [102.18, 'F', 0, .0001]],
  punch: [],   /* no punch-ins, and each shot's push is near zero (4th value): her picture holds still */
  rooms: [[0, 'coast'], [11.66, 'studio'], [24.85, 'coast'], [42.98, 'desk'], [68.95, 'studio'], [81.2, 'coast'], [96.64, 'terrace']],
  coastX: 900,
  /* other angles on the rooms her registration video used: the studio's far end, close on the desk */
  roomViews: {studio: [2490, -115, 1.15, 1, 1240], desk: [-60, -231, 1.3, 0, 170]},
  extraRooms: [['terrace', 'vterrace', [['vte-sl', 112, 96, 84, 604, 84, 0], ['vte-sr', 584, 96, 84, 604, 0, 0], ['vte-pend', 1180, 38, 240, 340, 120, 0]], 430, 1300, 240]],
  strips: [[0, 'paint/vip/s-bay.webp'], [11.66, 'paint/vip/s-studio.webp'], [24.85, 'paint/vip/s-bay.webp'], [42.98, 'paint/vip/s-desk.webp'], [68.95, 'paint/vip/s-studio.webp'], [81.2, 'paint/vip/s-bay.webp'], [96.64, 'paint/vip/s-terrace.webp']],
  pinkWords: ['life.', 'why.'], lastWordKey: true, capEdits: [],
  titled: [],
  runner: {
    path: {d: PATH, p: PATH.map(function(k){ return [k[0], MAP(k[1])] })},
    backRun: [21.14, 22.84],
    launches: [[27.38, 27.9, 150, 190]],                /* WhatsApp: the buzz throws him up */
    hops: [[21.14, 30], [28.04, 30], [46.26, 56], [57.66, 44], [70.88, 50], [80.9, 26], [85.34, 40], [97.24, 66], [101.84, 40]],   /* fewer hops: he rests between beats so the screen can breathe */
    pointAt: [[38.3, 38.6, 41, 41.3, 92, 140], [64.3, 64.6, 65.4, 65.7, 92, 140]],
    shrugs: [[66.24, 67.9], [88.54, 89.3]],
    formPoints: [[100.76, 102.1, 101.1, 92, 172]],
    sit: [103.5, 300, 300, 60, 270]
  },
  arrow: null,
  pieces: function(k){
    var add = k.add, img = k.img, cut = k.cut, strike = k.strike, T = k.T, seg = k.seg, lerp = k.lerp, io = k.io, clamp = k.clamp, PHONE = k.PHONE, PC = k.PC;
    var P = function(n){ return img('../../img/vip/paint/' + n + '.webp') }, TOP = {cls: 'top'}, SET = {cls: 'top', hold: 1};
    var STAMPS = ['mini-rec', 'mini-wa', 'mini-rev', 'mini-spr'];
    /* the framework comes back with progress: done stamps are in colour, the one she's on is lifted */
    function tracker(s0, s1, on, d, p){ var w = (PHONE ? p : d)[2] / 4; add('<div style="display:flex">' + STAMPS.map(function(n, i){ var st = i > on ? 'filter:grayscale(1);opacity:.45' : i === on ? 'transform:translateY(-8%) scale(1.14)' : ''; return '<div style="width:' + w + 'px;' + st + '">' + P(n) + '</div>' }).join('') + '</div>', s0, s1, d, p, TOP) }

    /* the door. Frame 1: she is already speaking in the doorway, the door swinging, and the camera goes through */
    if (!PHONE) {
      var door = add('<div style="position:relative;transform-origin:50% 50%" class="dw"><img src="' + PC + 'doorwall.webp" alt=""><img class="lf" src="' + PC + 'doorleaf.webp" alt="" style="position:absolute;left:19.25%;top:18.08%;width:61.54%;transform-origin:100% 50%"></div>', 1.2, 3.1, [0, 2, 1792], [0, 0, 1080], SET);
      door.count = function(t){ var p = io(seg(t, T(1.5), T(2.95))), lf = door.e.querySelector('.lf'), dw = door.e.querySelector('.dw'); dw.style.transform = 'scale(' + lerp(1.3, 3.4, p).toFixed(3) + ')'; lf.style.transform = 'perspective(1700px) rotateY(' + (-lerp(70, 92, outq(seg(t, T(1.2), T(2.2))))).toFixed(1) + 'deg)' };
    } else {
      var door = add('<div class="dw" style="position:relative;width:1080px;height:1920px;transform-origin:540px 0"><img class="lf" src="' + PC + 'doorleaf.webp" alt="" style="position:absolute;left:0;top:170px;width:1152px;height:1560px;max-width:none;transform-origin:100% 50%"><img src="' + PC + 'doorwall-top.webp" alt="" style="position:absolute;left:-540px;top:-48px;width:2160px;max-width:none"></div>', 1.2, 2.9, [0, 0, 1792], [0, 0, 1080], SET);
      door.count = function(t){ var p = io(seg(t, T(1.7), T(2.85))); door.e.querySelector('.dw').style.transform = 'translateY(' + (-p * 700).toFixed(0) + 'px) scale(' + lerp(1, 1.6, p).toFixed(3) + ')'; door.e.querySelector('.lf').style.transform = 'perspective(3000px) rotateY(' + (-lerp(76, 92, outq(seg(t, T(1.2), T(2.3))))).toFixed(1) + 'deg)' };
    }
    function outq(p){ return 1 - Math.pow(1 - p, 3) }
    var TITLE = '<div class="big"><span class="ln">Keep working with Ana</span><span class="ln"><i>after the workshop.</i></span></div>';
    add(TITLE.replace('class="big"', 'class="big" style="text-align:center"'), 1.2, 2.96, [316, 64, 1160, 56], [20, 200, 1040, 72], SET);
    add('<div class="big"><span class="ln">Keep working</span><span class="ln">with Ana</span><span class="ln"><i>after the workshop.</i></span></div>', 2.96, 8.82, [62, 300, 820, 70], [20, 200, 1040, 76], PHONE ? {cls: 'top', hold: 1} : TOP).e.style.display = PHONE ? 'none' : '';
    if (PHONE) add(TITLE, 5.4, 8.82, [0, 0, 0, 0], [20, 200, 1040, 74], TOP);
    add('<div class="rowb lit"><span class="tk"><svg viewBox="0 0 20 20"><path d="m5 10.5 3.4 3.4L15 6.8"/></svg></span>Your free seat is saved</div>', PHONE ? 5.4 : 2.2, 8.82, [62, 540, 0, 30], [270, 390, 0, 34], TOP);

    /* VIP is for you: the four things pop up, in the order she'll say them */
    STAMPS.forEach(function(n, i){ add(P(n), 3 + i * .42, 5.4, [62 + i * 178, 610, 168], [60 + i * 250, 200, 180], {cls: 'top', rot: [-3, 2, -2, 3][i]}) });

    var BOLD = 'font-family:inherit;font-weight:800;letter-spacing:-.022em;';
    /* the main point of each section: big, centred, one key word marked. Lines are html */
    function TT(lines, s0, s1, d, p){ return add('<div class="big" style="' + BOLD + 'text-align:center;text-transform:uppercase;line-height:1.04">' + lines.map(function(l){ return '<span class="ln">' + l + '</span>' }).join('') + '</div>', s0, s1, d, p, TOP) }
    /* recordings: the new pricing slide on her laptop, with a plain player bar */
    function LAP(w){ var f = w * .03; return '<div style="position:relative">' + img(PC + 'lap.png') + '<div style="position:absolute;left:12.02%;width:75.96%;top:56%;height:16.4%;box-sizing:border-box;padding:0 3%;display:flex;align-items:center;gap:' + f + 'px;background:linear-gradient(transparent,rgba(26,20,18,.8) 60%);color:#fff;font-weight:800;font-size:' + f + 'px;letter-spacing:.06em;white-space:nowrap"><svg viewBox="0 0 40 40" style="flex:none;width:' + (f * 2.2) + 'px;height:' + (f * 2.2) + 'px"><circle cx="20" cy="20" r="20" fill="#F72585"/><path d="M15 11 L30 20 L15 29 Z" fill="#fff"/></svg><span>DAY 2 RECORDING</span><div style="flex:1;height:' + (f * .36) + 'px;border-radius:9px;background:rgba(255,255,255,.4);overflow:hidden"><div style="width:34%;height:100%;background:#F72585"></div></div><span style="color:#FFE27A;letter-spacing:.02em">saved</span></div></div>' }
    TT(PHONE ? ['recordings', '<mark>for life</mark>'] : ['recordings <mark>for life</mark>'], 12.6, 14, [60, 36, 1300, 90], [30, 600, 1020, 88]);
    add(LAP(PHONE ? 760 : 780), 11.66, 14, [320, 150, 780], [160, 810, 760], TOP);
    add('<div style="position:relative">' + cut('notebook-red') + '<div class="big" style="position:absolute;left:10%;top:26%;width:36%;text-align:center;-webkit-text-stroke:0;filter:none;font-size:' + (PHONE ? 46 : 74) + 'px"><i>your own idea</i></div></div>', 15.4, 17.4, [90, 300, 640], [40, 200, 400], {cls: 'top', rot: -3});
    add('<div class="snap">' + img('../../img/slides/s4.webp') + '</div>', 18.2, 21.14, [60, 300, 730], [150, 160, 780], {cls: 'top', rot: -2});
    /* go back: the bar runs backwards and he runs with it */
    TT(['go', '<mark>back</mark>'], 21.14, 22.84, [40, 160, 330, 96], [20, 180, 545, 120]);
    add(LAP(PHONE ? 960 : 720), 21.14, 22.84, [370, 10, 720], [60, 610, 960], TOP);
    var bar = add('<div style="height:26px;border-radius:13px;background:#fff;border:3px solid #1A1412;overflow:hidden"><div class="f" style="height:100%;background:#F72585"></div></div>', 21.14, 22.84, [370, 526, 720], [60, 1300, 960], SET);
    bar.count = function(t){ bar.e.querySelector('.f').style.width = lerp(92, 22, io(seg(t, T(21.14), T(22.7)))).toFixed(1) + '%' };

    /* WhatsApp: the page's own chat, building */
    var chat = add(img(PC + 'chat-000.jpg'), 24.85, 32.42, [110, 20, 392], [20, 20, 530], SET);
    chat.seq = function(t){ var n = clamp(Math.round((t - T(24.85)) / (T(32.42) - T(24.85)) * 59), 0, 59); return PC + 'chat-' + ('00' + n).slice(-3) + '.jpg' };
    add(img('paint/vip/wa.png'), 26.6, 32.42, [860, 36, 160], [740, 600, 140], {cls: 'top', rot: -4});
    TT(PHONE ? ['private', '<mark>WhatsApp</mark>', 'group'] : ['private', '<mark>WhatsApp</mark> group'], 26.9, 32.42, [520, 200, 860, 84], [560, 750, 515, 60]);
    add('<div class="rowb" style="white-space:normal;background:#D9FDD3;border-color:#A8DDA0;line-height:1.2">Do I need more subscribers before I sell anything?</div>', 32.8, 35.02, [90, 400, 760, 46], [110, 200, 860, 54], {cls: 'top', rot: -1});
    if (!PHONE) add('<div class="big" style="text-align:center"><span class="ln" style="font-size:.7em">I\'ll be there for</span><span class="ln" style="text-transform:uppercase;font-family:inherit;font-weight:800;letter-spacing:-.022em"><mark>30 minutes</mark></span><span class="ln"><i>after each session,</i></span><span class="ln" style="font-size:.7em">plus one morning slot.</span></div>', 38.3, 41.9, [62, 280, 840, 92], [40, 1400, 1000, 50], TOP);

    /* the review */
    add(img(PC + 'qa.png'), 42.98, 48.72, [70, 30, 500], [20, 20, 530], TOP);
    TT(['<mark>90 minute</mark>', 'group review', '<i>live</i>'], 46.2, 48.72, [610, 150, 760, 88], [30, 900, 1020, 108]);
    var env = add(P('wk3'), 49.5, 54.68, [230, 320, 460], [40, 200, 320], SET);
    env.count = function(t){ var p = seg(t, T(49.5), T(50.1)); env.e.style.transform = 'translateY(' + (-(1 - p * p) * 700).toFixed(0) + 'px) rotate(' + ((1 - p) * -14).toFixed(2) + 'deg)' };
    add(img(PC + 'review.png'), 55.84, 60.24, [60, 26, 1230], [40, 610, 1000], TOP);
    add('<div style="position:relative">' + img('cut/stamp-red.png') + '<span style="position:absolute;inset:0;display:grid;place-items:center;font-weight:800;letter-spacing:.2em;padding-left:.2em;color:#A5121A">SELECTED</span></div>', 57.66, 60.24, [460, 330, 560, 74], [260, 900, 560, 74], {cls: 'top', rot: -6});
    var em = add(img(PC + 'email-000.png'), 60.24, 63.16, [60, 14, 640], [240, 596, 600], SET);
    em.seq = function(t){ var n = clamp(Math.round((t - T(60.24)) / (T(62.8) - T(60.24)) * 39), 0, 39); return PC + 'email-' + ('00' + n).slice(-3) + '.png' };
    TT(PHONE ? ['what I would', '<mark>change</mark>', 'and <mark>why</mark>'] : ['what I would', '<mark>change</mark> and <mark>why</mark>'], 61.8, 63.16, [710, 90, 660, 72], [20, 150, 545, 66]);
    add('<div class="statc big" style="-webkit-text-stroke:0"><span class="ln" style="font-size:1.45em;font-family:inherit;font-weight:800;letter-spacing:-.022em;text-transform:uppercase;text-align:center"><mark>Selected</mark> submissions</span><span class="ln" style="text-align:center">As many as fit in 90 minutes.</span><span class="ln" style="text-align:center">A personal review isn\'t guaranteed.</span></div>', 64, 68.12, [62, 380, 830, 46], [60, 200, 960, 40], TOP);

    /* the Sprint */
    TT(PHONE ? ['offer', '<mark>clarity</mark>', 'sprint'] : ['offer <mark>clarity</mark> sprint'], 70.52, 76.5, [60, 36, 1300, 88], [20, 205, 545, 80]);
    add(img(PC + 'lap3.png'), 68.95, 76.5, [200, 130, 1000], [20, 600, 1040], TOP);
    /* what it helps with, written on the page's paper, top to bottom as she says it */
    add(P('sub-sheet'), 76.5, 81.2, [300, 8, 690], [160, 590, 760], SET).e.style.opacity = 1;
    [['what you\'re selling', 77.7], ['how you explain <i>this value</i>', 78.9], ['what you charge', 80.5]].forEach(function(l, i){ add('<div class="big"><span class="ln">' + l[0] + '</span></div>', l[1], 81.2, [360, 240 + i * 160, 630, 52], [215, 730 + i * 170, 660, 50], {cls: 'top', wipe: 1}) });
    var hand = add(cut('hand-pencil'), 77.7, 81.2, [1000, 250, 1040], [860, 730, 700], SET);
    hand.count = function(t){ var i = t < T(78.9) ? 0 : t < T(80.5) ? 1 : 2, st = [T(77.7), T(78.9), T(80.5)][i], g = seg(t, st, st + .7); hand.e.style.transform = 'translate(' + ((g - 1) * (PHONE ? 200 : 300)).toFixed(0) + 'px,' + (i * (PHONE ? 170 : 160) + Math.sin(t * 20) * 3).toFixed(1) + 'px)' };

    /* keep going: all four, in colour */
    tracker(85.34, 87.38, 4, [162, 450, 640], [220, 200, 640]);
    TT(['<mark>keep going</mark>'], 85.34, 87.38, [62, 300, 840, 116], [20, 400, 1040, 112]);
    add('<div class="big"><i>"Yes, but what about mine?"</i></div>', 88.2, 91, [62, 380, 840, 104], [40, 200, 1000, 72], TOP);
    strike('just three days of watching', 92, 96.64, 94.8, [62, 400, 0, 60], [70, 200, 0, 62]);

    /* the offer, on the terrace */
    add(img(PC + 'order2.png'), 96.64, 99.2, [90, 14, 590], [20, 16, 540], TOP);
    add('<div class="statc big" style="text-align:center;-webkit-text-stroke:0"><span class="ln"><i>$67</i></span><span class="ln">once</span></div>', 97.24, 99.2, [720, 240, 560, 190], [200, 960, 680, 200], {cls: 'top', rot: -2});
    var seal = add(P('seal'), 98.2, 99.2, [1290, 510, 90], [770, 640, 260], SET);
    seal.count = function(t){ var p = seg(t, T(98.2), T(98.4)); seal.e.style.transform = 'scale(' + lerp(1.15, 1, p * p).toFixed(3) + ')'; seal.e.style.opacity = p > .02 ? 1 : 0 };
    var cta = add(img(PC + 'cta.png'), 99.6, 102.18, [110, 380, 720], [220, 220, 640], SET);
    cta.count = function(t){ cta.e.style.transform = 'none' };

    /* the close: your free seat is the chair. He pulls it up to the table and sits */
    var tb = add(P('vip-table'), 99.2, 300, [-20, 275, 1100], [-138, 1048, 1100], {cls: 'under', hold: 1}); tb.t1 = window.DUR;
    var ch = add(P('vip-chair'), 99.2, 300, [-20, 275, 1100], [-138, 1048, 1100], {cls: 'under', hold: 1}); ch.t1 = window.DUR;
    ch.count = function(t){ ch.e.style.transform = 'translateX(' + lerp(-170, 0, io(seg(t, T(102.5), T(103.5)))).toFixed(1) + 'px)' };
    if (!PHONE) { var last = add('<div class="rowb lit"><span class="tk"><svg viewBox="0 0 20 20"><path d="m5 10.5 3.4 3.4L15 6.8"/></svg></span>Your free seat is saved</div>', 103.34, 300, [460, 300, 0, 40], [240, 1110, 0, 44], TOP); last.t1 = window.DUR; }
  }
};
})();
