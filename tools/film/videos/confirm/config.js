/* The confirmation video (the page after registering). Her steps, in the page's order: WhatsApp, email, calendar, the 7 quick questions, the Exit Number calculator, the welcome email "in", the Head start page. Times are seconds of her recording. */
(function(){
window.VIDEO = {
  id: 'confirm', desktopW: 1792, herH: 1280, cuts: true, still: true, doorTop: true,
  frames: '_local/confirm/frames', data: ['_local/confirm/data.js', '_local/confirm/face.js'], piecesDir: '_local/confirm/pieces/',
  audio: '~/AnaVideo/out/kit/confirm-mix-1x.wav',
  hold: 1.6,
  layout: {
    d: {W: 1792, zV: 8, bud: 186, RL: [-190, 0], M: [923, 0, 869, 1008], FA: [947, -21, 1], FB: [1382, 30, .47],
      cM: {x: 960, y: 816, w: 800, fs: 58, align: 'center'}, cF: {x: 990, y: 836, w: 760, fs: 58, align: 'center'}, cC: {x: 160, y: 846, w: 1472, fs: 62, align: 'center'}, cW: {x: 396, y: 820, w: 1000, fs: 64, align: 'center'}},
    p: {zV: 8, bud: 190, capT: 1744, capB: 1780, wallM: 1744, hor: 1620, skyH: 1640, RL: [-160, 982], M: [0, 0, 1080, 1920], shM: 1690,
      cM: {x: 40, y: 1392, w: 1000, fs: 70, align: 'center'}, cF: {x: 50, y: 1226, w: 980, fs: 70, align: 'center'}, cC: {x: 50, y: 1484, w: 980, fs: 60, align: 'center'}}
  },
  shots: [[0.5, 'W', 0, .0001], [2.1, 'C', 0, .0001], [6.3, 'M', 0, .0001], [16.36, 'C', 0, .0001], [31.2, 'C', 0, .0001], [38.9, 'M', 0, .0001], [47.28, 'C', 0, .0001], [53.3, 'M', 0, .0001], [73.5, 'F', 0, .0001]],
  punch: [],
  rooms: [[0, 'hill'], [16.36, 'bedroom'], [53.3, 'hill']],
  /* the view from the hill: the room is the village below us, the moving bay shows through the whole top (box) */
  extraRooms: [['hill', 'vhill', [['vhi-bou', -10, -6, 520, 300, 0, 0], ['vhi-oli', 1550, -4, 460, 260, 460, 0], ['vhi-sun', 90, 204, 240, 420, 120, 420]], 360, 1650, 110, [0, 0, 2000, 520]],
    /* the calm bedroom: limewash, linen, one window on the bay; the curtains breathe, the paper pendant sways */
    ['bedroom', 'vbed', [['vbd-cl', 96, 96, 170, 600, 85, 0], ['vbd-cr', 516, 96, 170, 600, 85, 0], ['vbd-pend', 770, -10, 160, 300, 80, 0]], 330, 1370, 250, [170, 110, 440, 530]]],
  strips: [[0, 'paint/vip/s-hill.webp'], [16.36, 'paint/vip/s-bed.webp'], [53.3, 'paint/vip/s-hill.webp']],
  pinkWords: [], lastWordKey: true, capEdits: [], titled: [],
  /* he stands on the terrace wall, runs at each change of place, points at the WhatsApp button, and rests between */
  runner: {
    path: {d: [[0, 300], [2.1, 300], [2.5, 760], [6.3, 760], [6.7, 300], [16.36, 300], [16.8, 200], [31.2, 200], [31.6, 300], [38.9, 300], [47.28, 300], [47.7, 220], [53.3, 220], [53.7, 420], [73.5, 420], [73.9, 300], [200, 300]],
           p: [[0, 130], [2.1, 130], [2.5, 900], [6.3, 900], [6.7, 130], [200, 130]]},
    hops: [[1.4, 40], [17.2, 30], [47.6, 30], [74.2, 40]],
    pointAt: [[3.2, 3.5, 5.6, 5.9, 92, 140], [73.7, 74.0, 75.0, 75.2, 92, 140]]
  },
  arrow: null,
  pieces: function(k){
    var add = k.add, img = k.img, strike = k.strike, T = k.T, seg = k.seg, PHONE = k.PHONE, PC = k.PC;
    /* section titles: her page headline style (serif, key words pink italic) on a soft cream glow, one top band per shape */
    var GLOW = '<div style="position:absolute;left:-7%;right:-7%;top:-26%;bottom:-26%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,248,238,.9),rgba(255,248,238,.72) 52%,rgba(255,248,238,0));filter:blur(5px)"></div>';
    function TT(lines, s0, s1, d, p){ return add('<div style="position:relative">' + GLOW + '<div class="big" style="position:relative;text-align:center;line-height:.98">' + lines.map(function(l){ return '<span class="ln">' + l + '</span>' }).join('') + '</div></div>', s0, s1, d, p, {cls: 'top'}) }
    var TOP = {cls: 'top'};

    /* 1. you're in: the opening, big */
    TT(["You're <i>in.</i>"], 0.6, 2.1, [396, 64, 1000, 110], [20, 200, 1040, 120]);
    /* 2. WhatsApp: the page's own first button; he points at it */
    TT(['Join my <i>WhatsApp</i>'], 2.3, 6.3, [62, 56, 1280, 104], [20, 210, 545, 92]);
    add(img(PC + 'wa-btn.png'), 2.6, 6.3, [330, 360, 760], [80, 760, 920], TOP);
    /* 3. a quiet stretch (the email, notifications), then the page's own spam view: take me out of spam */
    add(img(PC + 'mail-nodate.png'), 11.6, 15.9, [62, 300, 760], [140, 200, 800], {cls: 'top', rot: -1});
    /* 4. the bedroom: all three sessions in the calendar */
    TT(['All <i>three</i> sessions'], 16.8, 22.2, [62, 56, 1280, 104], [20, 210, 545, 92]);
    add(img(PC + 'cal-btn.png'), 17.2, 22.2, [520, 420, 560], [140, 760, 800], TOP);
    /* 5. the 7 quick questions: the page's power bar, 0 of 7 */
    TT(['<i>7</i> quick questions'], 22.6, 30.2, [62, 56, 1280, 104], [20, 210, 545, 92]);
    add(img(PC + 'power.png'), 23.3, 30.2, [450, 300, 700], [100, 700, 880], TOP);
    /* 6. the bonus: the Exit Number calculator they unlock */
    TT(['Your <i>Exit Number</i>'], 31.4, 38.3, [62, 56, 1280, 104], [20, 210, 545, 92]);
    add(img(PC + 'calc.png'), 31.8, 38.3, [620, 190, 330], [300, 600, 480], TOP);
    /* 7. reply with one word: in */
    add('<div style="position:relative">' + GLOW + '<div class="big" style="position:relative;text-align:center"><span class="ln" style="font-size:.6em">Reply with one word:</span><span class="ln"><i>in</i></span></div></div>', 39.5, 43.3, [62, 300, 820, 110], [40, 200, 1000, 110], TOP);
    /* 8. the Head start page */
    TT(['Your <i>Head start</i> page'], 47.5, 53.3, [62, 56, 1280, 104], [20, 210, 545, 92]);
    add(img(PC + 'sheet-nodate.png'), 47.7, 53.3, [420, 200, 660], [90, 640, 900], {cls: 'top', rot: -2});
    /* 9. what you don't need before day one */
    strike('an offer, an audience', 54.0, 57.2, 55.4, [62, 400, 0, 60], [70, 200, 0, 62]);
    /* 10. come live */
    add('<div class="lvw"><div class="lvpill"><span class="lvd"><i></i><i></i><b></b></span>LIVE<span style="font-weight:700;letter-spacing:.02em;opacity:.86">on Zoom</span></div></div>', 64.9, 67.8, [62, 400, 0, 60], [40, 200, 1000, 88], TOP);
    /* 11. the close: start with WhatsApp */
    add(img(PC + 'wa-btn.png'), 73.6, 300, [100, 420, 720], [80, 1420, 920], TOP).t1 = window.DUR;
  }
};
})();
