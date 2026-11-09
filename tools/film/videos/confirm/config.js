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
  shots: [[0.5, 'W', 0, .0001], [2.1, 'C', 0, .0001], [6.3, 'M', 0, .0001], [16.36, 'C', 0, .0001], [31.2, 'C', 0, .0001], [38.9, 'C', 0, .0001], [43.4, 'M', 0, .0001], [47.28, 'C', 0, .0001], [53.3, 'M', 0, .0001], [73.5, 'F', 0, .0001]],
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
    var add = k.add, img = k.img, strike = k.strike, T = k.T, seg = k.seg, PHONE = k.PHONE, PC = k.PC, clamp = k.clamp, io = k.io;
    /* section titles: her page headline style (serif, key words pink italic) on a soft cream glow, one top band per shape */
    var GLOW = '<div style="position:absolute;left:-7%;right:-7%;top:-26%;bottom:-26%;border-radius:50%;background:radial-gradient(closest-side,rgba(255,248,238,.9),rgba(255,248,238,.72) 52%,rgba(255,248,238,0));filter:blur(5px)"></div>';
    function TT(lines, s0, s1, d, p){ return add('<div style="position:relative">' + GLOW + '<div class="big" style="position:relative;text-align:center;line-height:.98">' + lines.map(function(l){ return '<span class="ln">' + l + '</span>' }).join('') + '</div></div>', s0, s1, d, p, {cls: 'top'}) }
    var TOP = {cls: 'top'};

    /* 1. you're in: the opening, big */
    TT(["You're <i>in.</i>"], 0.6, 2.1, [396, 64, 1000, 110], [20, 200, 1040, 120]);
    /* 2. WhatsApp: the page's own first button; he points at it */
    TT(['Join my <i>WhatsApp</i>'], 2.3, 6.3, [62, 56, 1280, 104], [20, 210, 545, 92]);
    /* the page's own WhatsApp group mockup, building (voice note, then her two messages) beside the button */
    add(img(PC + 'wachat-000.webp'), 2.4, 6.3, [182, 175, 430], [280, 560, 520], TOP).seq = function(t){ return PC + 'wachat-' + ('00' + clamp(Math.round((t - T(2.5)) / (T(6.0) - T(2.5)) * 180), 0, 180)).slice(-3) + '.webp' };
    add(img(PC + 'wa-btn.png'), 2.6, 6.3, [662, 360, 560], [140, 1190, 800], TOP);
    /* 3. a quiet stretch (the email, notifications), then the page's own spam view: take me out of spam */
    /* the page's own spam demo, played: open, Report not spam, In your inbox (196 frames, dates hidden) */
    add(img(PC + 'spam-000.webp'), 12.9, 16.2, [62, 250, 700], [140, 200, 800], TOP).seq = function(t){ var n = clamp(Math.round((t - T(13.0)) / (T(15.7) - T(13.0)) * 195), 0, 195); return PC + 'spam-' + ('00' + n).slice(-3) + '.webp' };
    /* 4. the bedroom: all three sessions in the calendar */
    TT(['All <i>three</i> sessions'], 16.8, 22.2, [62, 56, 1280, 104], [20, 210, 545, 92]);
    /* Sean's own Google Calendar event, set to New York time, his name blurred; the cursor clicks Save on "calendar" */
    add(img(PC + 'gcal-000.webp'), 17.0, 22.2, [292, 150, 820], [60, 560, 960], TOP).seq = function(t){ return PC + 'gcal-' + ('00' + clamp(Math.round((t - T(17.5)) * 30), 0, 59)).slice(-3) + '.webp' };
    /* 5. the 7 quick questions: the page's own question card (question 2; question 1 prints the dates) */
    TT(['<i>7</i> quick questions'], 22.6, 30.2, [62, 56, 1280, 104], [20, 210, 545, 92]);
    add(img(PC + 'survey.png'), 23.3, 30.2, [382, 190, 640], [110, 560, 860], TOP);
    /* 6. the bonus: the real Exit Number calculator, its three example price cards (the page's own $3,000 example) */
    TT(['Your <i>Exit Number</i>'], 31.4, 38.3, [62, 56, 1280, 104], [20, 210, 545, 92]);
    add(img(PC + 'calc-cards.png'), 31.8, 38.3, [202, 310, 1000], [30, 640, 1020], TOP);
    /* 7. reply with one word: in. Her welcome email open in Gmail; "in" is typed on her word, Send, Message sent */
    TT(['Reply with one word: <i>in</i>'], 39.5, 43.3, [62, 56, 1280, 104], [20, 210, 545, 92]);
    add(img(PC + 'gmail-000.webp'), 39.6, 43.4, [372, 165, 760], [90, 600, 900], TOP).seq = function(t){ return PC + 'gmail-' + ('00' + clamp(Math.round((t - T(40.7)) * 30), 0, 89)).slice(-3) + '.webp' };
    /* 8. the Head start page */
    TT(['Your <i>Head start</i> page'], 47.5, 53.3, [62, 56, 1280, 104], [20, 210, 545, 92]);
    add(img(PC + 'sheet-card.png'), 47.7, 53.3, [392, 200, 620], [90, 600, 900], TOP);
    /* 9. what you don't need before day one */
    strike('an offer, an audience', 54.0, 57.2, 55.4, [62, 400, 0, 60], [70, 200, 0, 62]);
    /* 10. come live: her own video becomes a Zoom call (the window chrome, a LIVE badge, your tile with the sunflower, reactions rising on "I would love it") */
    var U = PHONE ? 1.45 : 1, ZH = PHONE ? 1580 : 1008, ZI = PHONE ? 0 : 16, px = function(n){ return Math.round(n * U) + 'px' };
    var IC = {mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>', cam: '<rect x="2.5" y="6" width="13" height="12" rx="2.5"/><path d="m15.5 10.5 6-3.5v10l-6-3.5"/>', ppl: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5.5 5.5 0 0 1 3.5 6"/>', chat: '<path d="M4 5h16v11H9l-5 4Z"/>', heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.6 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>', share: '<rect x="3" y="4.5" width="18" height="13" rx="2"/><path d="M12 14V8m-3 3 3-3 3 3M8 21h8"/>'};
    function zb(k, lb){ return '<span style="display:flex;flex-direction:column;align-items:center;gap:' + px(4) + ';color:#e8e8e8;font:600 ' + px(12.5) + ' Manrope,sans-serif"><svg viewBox="0 0 24 24" style="width:' + px(26) + ';height:' + px(26) + ';fill:none;stroke:#e8e8e8;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round">' + IC[k] + '</svg>' + lb + '</span>' }
    var RX = [['👏', 65.1, 0], ['🎉', 65.45, 1], ['❤️', 66.3, 2], ['❤️', 66.5, 0], ['😍', 66.75, 1], ['👏', 67.0, 2], ['🎉', 67.25, 0]];
    var zoom = add('<div style="position:relative;height:' + ZH + 'px"><div class="zmi" style="position:absolute;inset:0">' +
      '<div style="position:absolute;top:0;right:0;bottom:0;left:' + ZI + 'px;border:' + px(5) + ' solid #2BD957;box-sizing:border-box"></div>' +
      '<div style="position:absolute;left:' + ZI + 'px;right:0;top:0;height:' + px(68) + ';background:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,0));display:flex;align-items:center;gap:' + px(10) + ';padding:0 ' + px(22) + ';box-sizing:border-box;color:#fff;font:700 ' + px(17) + ' Manrope,sans-serif"><svg viewBox="0 0 24 24" style="width:' + px(22) + ';height:' + px(22) + '"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5Z" fill="#2BD957"/><path d="m8.5 12 2.5 2.5 4.5-5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>The Exit Plan<span class="lvpill" style="margin-left:auto;font-size:' + px(17) + '"><span class="lvd"><i></i><i></i><b></b></span>LIVE</span>' + (PHONE ? '<b style="background:#E02828;color:#fff;border-radius:10px;padding:8px 18px;font:700 20px Manrope,sans-serif">Leave</b>' : '') + '</div>' +
      '<div style="position:absolute;right:' + px(22) + ';top:' + px(82) + ';width:' + px(150) + ';height:' + px(100) + ';border-radius:' + px(10) + ';background:#2b2b2b;border:' + px(2) + ' solid rgba(255,255,255,.2);display:grid;place-items:center;box-shadow:0 6px 16px rgba(0,0,0,.3)"><svg viewBox="-60 -60 120 120" style="width:' + px(58) + ';height:' + px(58) + '"><g data-sf></g></svg><span style="position:absolute;left:' + px(8) + ';bottom:' + px(5) + ';color:#fff;font:700 ' + px(12.5) + ' Manrope,sans-serif">You</span></div>' +
      '<div style="position:absolute;left:' + (ZI + 22 * U) + 'px;top:' + px(82) + ';background:rgba(0,0,0,.5);color:#fff;font:700 ' + px(14) + ' Manrope,sans-serif;padding:' + px(5) + ' ' + px(11) + ';border-radius:' + px(6) + '">Ana Calin</div>' +
      (PHONE ? '' : '<div style="position:absolute;left:' + ZI + 'px;right:0;bottom:0;height:' + px(72) + ';background:rgba(24,24,24,.92);display:flex;align-items:center;justify-content:space-around;padding:0 ' + px(12) + '">' + zb('mic', 'Mute') + zb('cam', 'Video') + zb('ppl', 'Participants') + zb('chat', 'Chat') + zb('heart', 'React') + zb('share', 'Share') + '<b style="background:#E02828;color:#fff;border-radius:' + px(8) + ';padding:' + px(7) + ' ' + px(14) + ';font:700 ' + px(14) + ' Manrope,sans-serif">Leave</b></div>') +
      RX.map(function(r){ return '<span class="zrx" style="position:absolute;right:' + px(60 + r[2] * 70) + ';bottom:' + (PHONE ? '200px' : px(110)) + ';font-size:' + px(46) + ';opacity:0;line-height:1">' + r[0] + '</span>' }).join('') +
      '</div></div>', 64.7, 68.0, [923, 0, 869], [0, 0, 1080], {cls: 'top', hold: 1});
    zoom.count = function(t){ var e = zoom.e, a = io(seg(t, T(64.7), T(64.95))) * (1 - io(seg(t, T(67.8), T(68.0)))); e.querySelector('.zmi').style.opacity = a.toFixed(3);
      e.querySelectorAll('.zrx').forEach(function(x, i){ var k = (t - T(RX[i][1])) / 1.5; if (k < 0 || k > 1) { x.style.opacity = 0; return }
        x.style.opacity = (Math.min(1, k * 6) * (1 - Math.max(0, (k - .7) / .3))).toFixed(3); x.style.transform = 'translate(' + (Math.sin(k * 7 + i) * 14 * U).toFixed(1) + 'px,' + (-k * 380 * U).toFixed(1) + 'px) scale(' + (0.6 + Math.min(1, k * 5) * .5).toFixed(3) + ')' }) };
    /* 11. the close: start with WhatsApp */
    add(img(PC + 'wa-btn.png'), 73.6, 300, [100, 420, 720], [80, 1420, 920], TOP).t1 = window.DUR;
  }
};
})();
