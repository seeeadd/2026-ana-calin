/* The film engine: her stage, her world, the sunflower, pieces, captions. Every frame is render(t), and nothing here knows one video from another:
   what happens when lives in videos/<id>/config.js. Don't read this file to make a video. See VIDEO-KIT.md. */
(function(){
  'use strict';
  var $ = function(id){ return document.getElementById(id) };
  var CFG = window.VIDEO, Q = new URLSearchParams(location.search), PLAN = Q.has('plan'), PHONE = Q.get('v') === 'p', V = PHONE ? 'p' : 'd', PC = CFG.piecesDir || '_local/pieces/';
  var L = PHONE ? {
    W: 1080, H: 1920, skyH: 1560, hor: 1532, capT: 1700, capB: 1736, wallM: 1700, bud: 190, land: [-40, .82], zV: 6,
    M: [0, 0, 1080, 1253], ins: [100, 118, 860, 997], box: [1060, 1256], FA: [10, -30, 1], FB: [575, 8, .46], bw: [118, 100, 141, 100],
    cM: {x: 40, y: 1268, w: 1000, fs: 72, align: 'center'}, cF: {x: 50, y: 1172, w: 980, fs: 76, align: 'center'}, cC: {x: 50, y: 1762, w: 980, fs: 62, align: 'center'}
  } : {
    W: 1560, H: 1008, skyH: 680, hor: 640, capT: 770, capB: 798, wallM: 770, bud: 150, land: [-120, .8], zV: 12,
    M: [691, 0, 869, 1008], ins: [97, 114, 650, 754], box: [844, 1005], FA: [715, -21, 1], FB: [1150, 30, .47], bw: [114, 97, 137, 97],
    cM: {x: 62, y: 84, w: 600, fs: 56, align: 'left'}, cF: {x: 62, y: 84, w: 650, fs: 58, align: 'left'}, cC: {x: 62, y: 836, w: 1436, fs: 62, align: 'left'}
  };
  if (CFG.layout) Object.assign(L, CFG.layout[V] || {});
  if (PHONE) document.body.classList.add('phone');
  var film = $('film'); film.style.width = L.W + 'px'; film.style.height = L.H + 'px'; document.body.style.width = L.W + 'px'; document.body.style.height = L.H + 'px';
  ['world', 'wallsvg', 'thread'].forEach(function(i){ $(i).setAttribute('width', L.W); $(i).setAttribute('height', L.H); $(i).setAttribute('viewBox', '0 0 ' + L.W + ' ' + L.H) });
  $('sky').style.width = L.W + 'px'; $('sky').style.height = L.skyH + 'px'; $('skyF').setAttribute('width', L.W); $('skyF').setAttribute('height', L.skyH);

  var clamp = function(x, a, b){ return Math.max(a, Math.min(b, x)) };
  var io = function(p){ return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2 };
  var outq = function(p){ return 1 - Math.pow(1 - p, 4) };
  var seg = function(t, a, b){ return clamp((t - a) / (b - a), 0, 1) };
  var lerp = function(a, b, p){ return a + (b - a) * p };
  /* seconds of her recording to seconds of the cut */
  function T(s){ var o = 0; for (var i = 0; i < EDL.length; i++) { var a = EDL[i][0], b = EDL[i][1]; if (s < a) return o; if (s <= b) return o + s - a; o += b - a } return o }
  /* caption notes from the config: [recording second inside the chunk, old word, new word] */
  (CFG.capEdits || []).forEach(function(e){ window.CAPS.forEach(function(c){ c.w.forEach(function(w){ if (w.x === e[1] && Math.abs(w.s - e[0]) < 2.5) w.x = e[2] }) }) });
  var HOLD = CFG.hold || 0, DUR0 = window.DUR; window.DUR = DUR0 + HOLD; window.CAPS[window.CAPS.length - 1].t1 = window.DUR;
  var EDL = window.EDL;

  /* ---------- the shots: start (recording seconds), type, crop ---------- */
  var S = CFG.shots.map(function(s){ return s.slice() });
  S.forEach(function(s){ s.t = T(s[0]) });
  var isM = function(x){ return x === 'M' || x === 'W' }, HH = CFG.herH || 835;  /* herH: how tall her frames are, when the whole recording is kept */
  function shotAt(t){ var k = 0; for (var i = 0; i < S.length; i++) if (t >= S[i].t - 1e-4) k = i; return k }
  var CROP = [[1, 0], [1.07, -3], [1.07, 3]];
  /* how much main (m) and how much cut-away (c) at time t; a move takes .45 s around the shot change */
  function mix(t){
    var k = shotAt(t), s = S[k], nx = S[k + 1], m = isM(s[1]) ? 1 : 0, c = s[1] === 'C' ? 1 : 0, w = s[1] === 'W' ? 1 : 0;
    var pv = S[k - 1];
    if (CFG.cuts) return {m: m, c: c, w: w, k: k, type: s[1]};   /* cuts: a layout change is a clean cut, not a resize */
    if (pv && pv[1] !== s[1] && t < s.t + .3) { var p = io(seg(t, s.t - .15, s.t + .3)); m = lerp(isM(pv[1]) ? 1 : 0, m, p); c = lerp(pv[1] === 'C' ? 1 : 0, c, p); w = lerp(pv[1] === 'W' ? 1 : 0, w, p) }
    else if (nx && nx[1] !== s[1] && t > nx.t - .15) { var q = io(seg(t, nx.t - .15, nx.t + .3)); m = lerp(m, isM(nx[1]) ? 1 : 0, q); c = lerp(c, nx[1] === 'C' ? 1 : 0, q); w = lerp(w, nx[1] === 'W' ? 1 : 0, q) }
    return {m: m, c: c, w: w, k: k, type: s[1]};
  }

  /* ---------- painted scenery ---------- */
  var s0 = 7331, R = function(){ s0 = (s0 * 16807) % 2147483647; return s0 / 2147483647 };
  function wobble(y, amp, step){ var p = [], x = -20, end = L.W + 20; while (x <= end) { p.push([x, y + (R() - .5) * amp]); x += step * (.7 + R() * .6) } p.push([end, y + (R() - .5) * amp]); return p }
  function smooth(pts){ var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1); for (var i = 1; i < pts.length; i++) { var a = pts[i - 1], b = pts[i]; d += ' Q' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' ' + ((a[0] + b[0]) / 2).toFixed(1) + ' ' + ((a[1] + b[1]) / 2).toFixed(1) } return d + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + pts[pts.length - 1][1].toFixed(1) }
  var SVGNS = 'http://www.w3.org/2000/svg', Wp = L.W + 20;
  function tile(id, src, w, h, top){ var e = $(id); e.style.left = '0'; e.style.top = top + 'px'; e.style.width = (w * 4) + 'px'; e.style.height = h + 'px';
    [0, 1, 2, 3].forEach(function(i){ var m = document.createElement('img'); m.src = src; m.alt = ''; m.style.cssText = 'position:absolute;top:0;left:' + (i * w) + 'px;width:' + w + 'px;height:' + h + 'px;max-width:none;' + (i % 2 ? 'transform:scaleX(-1)' : ''); e.appendChild(m) }); return w * 2 }
  var lw = 2400 * L.land[1], lh = 240 * L.land[1], sh0 = L.capT + 12 - L.hor;
  var PER = {far: tile('far', 'paint/vfar.webp', lw, lh, L.hor + 8 - lh), near: tile('near', 'paint/vnear.webp', lw, lh, L.hor + 8 - lh), sea: tile('sea', 'paint/vsea.webp', 2000, sh0, L.hor), g1: tile('g1', 'paint/vglint.webp', 2000, sh0, L.hor), g2: tile('g2', 'paint/vglint.webp', 2000, sh0, L.hor)};
  function slide(id, x){ $(id).style.transform = 'translateX(' + (-(((x % PER[id]) + PER[id]) % PER[id])).toFixed(1) + 'px)' }
  var boat = $('boat'), bw0 = PHONE ? 130 : 120; boat.style.width = bw0 + 'px';
  /* three gulls crossing the sky now and then */
  var gs = [0, 1, 2].map(function(){ var p = document.createElementNS(SVGNS, 'path'); $('gulls').appendChild(p); return p });
  function gulls(t){ var per = 17, ph = ((t + 15.2) % per) / per, X = lerp(L.W + 120, -220, ph), Y = (PHONE ? 1250 : 150) + Math.sin(t * .7) * 16;
    gs.forEach(function(p, i){ var fl = Math.sin(t * 7 + i * 1.7) * 9, sz = 19 - i * 3, x = X + i * 62, y = Y + (i === 1 ? -26 : i * 18); p.setAttribute('d', 'M' + (x - sz) + ' ' + (y - fl * .5).toFixed(1) + ' Q' + (x - sz * .45) + ' ' + (y - 7 - fl).toFixed(1) + ' ' + x + ' ' + y + ' Q' + (x + sz * .45) + ' ' + (y - 7 - fl).toFixed(1) + ' ' + (x + sz) + ' ' + (y - fl * .5).toFixed(1)) }) }
  var ct = smooth(wobble(L.capT, 3, 170)), cb = smooth(wobble(L.capB, 3, 190)), wb = 'L' + Wp + ' ' + (L.H + 560) + ' L-20 ' + (L.H + 560) + ' Z';
  $('capF').setAttribute('d', ct + ' L' + Wp + ' ' + (L.capB + 2) + ' L-20 ' + (L.capB + 2) + ' Z');
  $('wallF').setAttribute('d', cb + ' ' + wb); $('wallS').setAttribute('d', cb + ' ' + wb); $('ink1').setAttribute('d', ct); $('ink2').setAttribute('d', cb);
  var JO = [40, 152, 258, 334].map(function(v){ return [v, R() * 6 - 3, R() * 4 - 2] });
  for (var x0 = 0; x0 < L.W + 800; x0 += 400) JO.forEach(function(j){ var l = document.createElementNS(SVGNS, 'path'); l.setAttribute('d', 'M' + (x0 + j[0]) + ' ' + (L.capT + 2) + ' q' + j[1] + ' ' + ((L.capB - L.capT) / 2) + ' ' + j[2] + ' ' + (L.capB - L.capT - 4)); $('capT').appendChild(l) });

  /* ---------- her world: the coast, her studio, her desk. The rooms' windows are holes, so the same sea moves behind them ---------- */
  var RL = L.RL || (PHONE ? [-160, L.capB - 798] : [-200, 0]);
  /* the bay outside: the coast's own painted hills, sea, light and boat, seen only through the glass of the door */
  function tiles(par, src, w, h, top){ var d = document.createElement('div'); d.style.cssText = 'position:absolute;left:0;top:' + top + 'px;width:' + (w * 4) + 'px;height:' + h + 'px'; [0, 1, 2, 3].forEach(function(i){ var m = document.createElement('img'); m.src = src; m.alt = ''; m.style.cssText = 'position:absolute;top:0;left:' + (i * w) + 'px;width:' + w + 'px;height:' + h + 'px;max-width:none;' + (i % 2 ? 'transform:scaleX(-1)' : ''); d.appendChild(m) }); par.appendChild(d); return {e: d, per: w * 2} }
  function room(id, art, sprites, hor, fx, box){
    var e = document.createElement('div'); e.id = id; e.style.cssText = 'position:absolute;left:' + RL[0] + 'px;top:' + RL[1] + 'px;width:2000px;height:1008px;visibility:hidden';
    /* box: [x, y, w, h] of the opening the moving bay shows through; a window by default, the whole view from the hill */
    var BB = box || [150, 90, 480, 650], BX = BB[0], BY = BB[1], BH = BB[3], by = document.createElement('div'); by.style.cssText = 'position:absolute;left:' + BX + 'px;top:' + BY + 'px;width:' + BB[2] + 'px;height:' + BH + 'px;overflow:hidden;background:linear-gradient(#6FB6E2 0%,#A9D8EF ' + Math.round((hor - BY) * .62 / (BH / 100)) + '%,#F5E8CF ' + Math.round((hor - BY) / (BH / 100)) + '%)';
    var h0 = hor - BY, parts = {far: tiles(by, 'paint/vfar.webp', 2400, 240, h0 + 8 - 240), near: tiles(by, 'paint/vnear.webp', 2400, 240, h0 + 8 - 240), sea: tiles(by, 'paint/vsea.webp', 2000, BH - h0, h0), boat: null, g1: tiles(by, 'paint/vglint.webp', 2000, BH - h0, h0), g2: tiles(by, 'paint/vglint.webp', 2000, BH - h0, h0)};
    var bt = document.createElement('img'); bt.src = 'paint/vboat.webp'; bt.alt = ''; bt.style.cssText = 'position:absolute;left:0;top:0;width:96px;max-width:none'; by.insertBefore(bt, parts.g1.e); parts.boat = bt; parts.h0 = h0; parts.bw = BB[2];
    e.innerHTML = '<div style="position:absolute;left:0;width:2000px;bottom:100%;height:' + (RL[1] + 10) + 'px;background:#FAF6EE"></div>'; e.appendChild(by);
    var im = document.createElement('img'); im.src = 'paint/' + art + '.webp'; im.alt = ''; im.style.cssText = 'position:absolute;left:0;top:0;width:2000px;height:1008px;max-width:none'; e.appendChild(im);
    parts.sp = sprites.map(function(q){ var wr = document.createElement('div'); wr.style.cssText = 'position:absolute;left:0;top:0;width:2000px;height:1008px;' + (q[7] || ''); var m = document.createElement('img'); m.src = 'paint/' + q[0] + '.webp'; m.alt = ''; m.style.cssText = 'position:absolute;left:' + q[1] + 'px;top:' + q[2] + 'px;width:' + q[3] + 'px;height:' + q[4] + 'px;max-width:none;transform-origin:' + q[5] + 'px ' + q[6] + 'px'; wr.appendChild(m); e.appendChild(wr); return m });
    var sv = document.createElementNS(SVGNS, 'svg'); sv.setAttribute('viewBox', '0 0 2000 1008'); sv.setAttribute('width', 2000); sv.setAttribute('height', 1008); sv.style.cssText = 'position:absolute;left:0;top:0;overflow:visible'; sv.innerHTML = fx; e.appendChild(sv); parts.fx = sv;
    parts.motes = [].slice.call(sv.querySelectorAll('.mote')); parts.pet = [].slice.call(sv.querySelectorAll('.pet')); $('rooms').appendChild(e); e.parts = parts; return e;
  }
  function motes(n, c){ var o = ''; for (var i = 0; i < n; i++) o += '<circle class="mote" r="' + (1.6 + R() * 2.2).toFixed(1) + '" fill="' + (c || '#FFF6D2') + '"/>'; return o }
  var GL = function(id, c){ return '<defs><radialGradient id="' + id + '"><stop offset="0" stop-color="' + c + '" stop-opacity=".9"/><stop offset=".55" stop-color="' + c + '" stop-opacity=".28"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient></defs>' };
  var BEAM = '<path class="beam" d="M240 270 L480 270 L860 1008 L360 1008 Z" fill="#FFF1C4"/>';
  var pets = ''; for (var pi = 0; pi < 7; pi++) pets += '<path class="pet" d="M0 -6 L6 0 L0 6 L-6 0 Z" fill="' + ['#F72585', '#EC4E97', '#F472AE'][pi % 3] + '"/>';
  var STUDIO = room('studio', 'vstudio', [['vst-sl', 150, 140, 126, 590, 63, 0], ['vst-sr', 434, 140, 126, 590, 63, 0], ['vst-pend', 1040, 0, 480, 360, 240, 0]], 448,
    GL('gLamp', '#FFE29A') + BEAM + '<ellipse class="lamp" cx="1704" cy="360" rx="170" ry="140" fill="url(#gLamp)"/>' + motes(18) + pets);
  var DESK = room('desk', 'vdesk', [['vd-sl', 128, 82, 138, 648, 69, 0], ['vd-sr', 476, 82, 132, 648, 66, 0, 'clip-path:polygon(0 0,100% 0,100% 100%,0 100%,0 0,26.4% 47.4%,26.4% 72%,100% 72%,100% 47.4%,26.4% 47.4%,0 0)'], ['vd-pend', 700, 0, 680, 420, 340, 0]], 430,
    GL('gLamp2', '#FFE9A8') + GL('gFlame', '#FFD27A') + BEAM + '<ellipse class="lamp" cx="1340" cy="630" rx="210" ry="150" fill="url(#gLamp2)"/><circle class="glow" cx="495" cy="726" r="52" fill="url(#gFlame)"/><ellipse class="flame" cx="0" cy="-11" rx="6" ry="12" fill="#FFB84A"/><path class="cursor" d="M0 0 L0 17 L4.6 13 L8 20.6 L11 19.2 L7.8 12 L13.4 12 Z" fill="#191512" stroke="#FFF" stroke-width="1.6"/>' + motes(18));
  var RM = {studio: STUDIO, desk: DESK}, RV = CFG.roomViews || {};  /* roomViews: {room: [x, y, scale, flip, phone x in the room]}: another angle on the same room */
  (CFG.extraRooms || []).forEach(function(q){ RM[q[0]] = room(q[0], q[1], q[2], q[3], GL('gLampX', '#FFE29A') + BEAM + '<ellipse class="lamp" cx="' + q[4] + '" cy="' + q[5] + '" rx="170" ry="140" fill="url(#gLampX)"/>' + motes(18) + pets, q[6]) });
  var SC = CFG.rooms.map(function(k){ return [T(k[0]), k[1]] });
  window.__T = T;
  function roomAt(t){ var cur = SC[0][1]; SC.forEach(function(k){ if (t >= k[0]) cur = k[1] }); return cur }
  function pan(t){ return Math.sin(t * .09) * 10 }
  function rSlide(q, x){ q.e.style.transform = 'translateX(' + (-(((x % q.per) + q.per) % q.per)).toFixed(1) + 'px)' }
  function roomLife(ro, t){
    var P = ro.parts, p = pan(t), d = DS[clamp(Math.floor(t * 30), 0, DS.length - 1)] || 0, sn = Math.sin(t * 1.5);
    /* far things drift slower than the room pans, so the glass reads as glass */
    rSlide(P.far, 500 + Math.sin(t * .03) * 90 - p * .3); rSlide(P.near, 230 + Math.sin(t * .05) * 120 - p * .6); rSlide(P.sea, t * 10); rSlide(P.g1, t * 26); rSlide(P.g2, t * 4); P.g1.e.style.opacity = (.6 + .4 * sn).toFixed(3); P.g2.e.style.opacity = (.6 - .4 * sn).toFixed(3);
    P.boat.style.transform = 'translate(' + (-90 + ((t * 13 + 170) % (P.bw + 80))).toFixed(1) + 'px,' + (P.h0 - 26 + Math.sin(t * 1.3) * 3).toFixed(1) + 'px) rotate(' + (Math.sin(t * 1.1) * 1.8).toFixed(2) + 'deg)';
    /* the curtains lift in the breeze, and billow when he runs past the door */
    var hx = rx(t), hv = Math.abs((rx(t + .02) - rx(t - .02)) / .04), doorX = 355 + RL[0], gust = clamp(1 - Math.abs(hx - doorX) / 340, 0, 1) * clamp(hv / 260, 0, 1);
    var bz = Math.sin(t * .8) * .8 + Math.sin(t * 1.9) * .25;
    P.sp[0].style.transform = 'skewX(' + (bz - gust * 3).toFixed(2) + 'deg) scaleX(' + (1 + Math.sin(t * .6) * .02).toFixed(3) + ')';
    P.sp[1].style.transform = 'skewX(' + (bz * .8 + gust * 3).toFixed(2) + 'deg) scaleX(' + (1 + Math.sin(t * .7 + 1) * .02).toFixed(3) + ')';
    P.sp[2].style.transform = 'rotate(' + (Math.sin(t * .85) * .8).toFixed(2) + 'deg)';
    var q = function(s){ return P.fx.querySelector(s) };
    q('.beam').setAttribute('opacity', (.12 + .035 * Math.sin(t * .5)).toFixed(3)); q('.lamp').setAttribute('opacity', (.82 + .16 * Math.sin(t * 1.1)).toFixed(3));
    P.motes.forEach(function(m, i){ var ph = i * 2.399, u = (t * (.018 + i * .0009) + i * .137) % 1, x = 300 + i * 25 + u * 180 + Math.sin(t * .4 + ph) * 22, y = 330 + ((i * 61) % 300) + u * 120 + Math.cos(t * .33 + ph) * 26; m.setAttribute('cx', x.toFixed(1)); m.setAttribute('cy', y.toFixed(1)); m.setAttribute('opacity', (Math.sin(u * Math.PI) * (.55 + .35 * Math.sin(t * 1.2 + ph))).toFixed(3)) });
    P.pet.forEach(function(m, i){ var u = (t * .085 + i / 7) % 1, x = 520 + i * 7 + Math.sin(u * 9 + i) * 22 + u * 26, y = 200 + u * 500; m.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (u * 400 + i * 40).toFixed(0) + ')'); m.setAttribute('opacity', (Math.min(u * 8, 1) * Math.min((1 - u) * 6, 1)).toFixed(3)) });
    var fl = q('.flame'); if (fl) { var BUDJ = runnerPose(t - 1 / 30).j || 0, lean = BUDJ * .22 + Math.sin(t * 9) * 1.8 + Math.sin(t * 23) * .9, sy = 1 + Math.sin(t * 13) * .1 - Math.min(BUDJ, 60) * .004; fl.setAttribute('transform', 'translate(495 735) rotate(' + lean.toFixed(1) + ') scale(1 ' + sy.toFixed(3) + ')'); q('.glow').setAttribute('opacity', (.8 + .18 * Math.sin(t * 11)).toFixed(3));
      var cu = q('.cursor'), cx = 700 + Math.sin(t * .55) * 130 + Math.sin(t * 1.3) * 26, cy = 590 + Math.sin(t * .8 + 1) * 70; cu.setAttribute('transform', 'translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')') }
  }
  function scene(t, type){
    var cur = roomAt(t), tc = null, near = 1e9; SC.forEach(function(k){ if (k[0] > 0 && Math.abs(t - k[0]) < near) { near = Math.abs(t - k[0]); tc = k[0] } });
    Object.keys(RM).forEach(function(k){ RM[k].style.visibility = cur === k ? 'visible' : 'hidden' }); $('wallsvg').style.visibility = cur === 'coast' ? 'visible' : 'hidden';
    var pn = 'translateX(' + pan(t).toFixed(1) + 'px)', big = PHONE && type === 'C', Z = L.H / 1008;
    Object.keys(RM).forEach(function(k){ var ro = RM[k], v = RV[k]; ro.style.transformOrigin = '0 0'; ro.style.transform = big ? 'translate(' + (-RL[0] - (v && v[4] != null ? v[4] : k === 'desk' ? 170 : 160) * Z + pan(t) * Z).toFixed(1) + 'px,' + (-RL[1]) + 'px) scale(' + Z.toFixed(4) + ')' : pn + (v ? ' translate(' + v[0] + 'px,' + v[1] + 'px) scale(' + (v[3] ? -v[2] : v[2]) + ',' + v[2] + ')' : '') }); if (cur !== 'coast') roomLife(RM[cur], t);
    /* the page's blue shutters swing closed and open on the new place */
    var sl = $('shL'), sr = $('shR'), u = t - tc, on = tc !== null && u > -.26 && u < .32; sl.style.display = sr.style.display = on ? 'block' : 'none'; if (!on) return;
    var ty = mix(tc + .4).type, W0 = PHONE || CFG.doorTop ? L.W : ty === 'M' ? L.M[0] + 9 : ty === 'F' ? L.FA[0] + 45 : L.W, top = PHONE && ty === 'M' && !CFG.doorTop ? (L.shM != null ? L.shM : L.M[3] - 20) : 0, hh = L.H - top, ang = u < 0 ? 88 * (1 - io(seg(u, -.26, 0))) : 88 * io(seg(u, 0, .32));
    [sl, sr].forEach(function(e, i){ if (CFG.doorTop) e.style.zIndex = 40; e.style.width = (W0 / 2 + 2) + 'px'; e.style.height = hh + 'px'; e.style.top = top + 'px'; e.style.left = (i ? W0 / 2 - 1 : 0) + 'px'; e.style.transform = 'perspective(1500px) rotateY(' + (i ? ang : -ang).toFixed(2) + 'deg)' });
  }

  /* Ana and her frame */
  var TN2 = document.createElement('img'); TN2.id = 'torn3'; TN2.src = 'paint/vtorn.webp'; TN2.alt = ''; TN2.style.cssText = 'position:absolute;top:0;width:90px;height:' + L.H + 'px;z-index:13;transform:scaleX(-1);display:none'; film.appendChild(TN2);
  /* strips: on the phone her video is the whole frame, so each place's floor is laid over her, under the sunflower. [recording second, image] */
  var FG = null, FGS = (CFG.strips || []).map(function(k){ return [T(k[0]), k[1]] }); if (PHONE && FGS.length) { FG = document.createElement('img'); FG.id = 'fg'; FG.alt = ''; FG.style.cssText = 'position:absolute;left:0;bottom:0;width:100%;z-index:9'; film.appendChild(FG) }
  var a = $('ana'), vb = $('vb'), afr = a.querySelector('.fr'); vb.style.zIndex = L.zV; a.style.zIndex = L.zV + 1;
  a.style.width = L.box[0] + 'px'; a.style.height = L.box[1] + 'px';
  var bw = L.bw.map(function(v){ return v + 'px' }).join(' ');
  afr.style.borderWidth = bw; afr.style.borderImage = 'url(paint/ana-frame-open.webp) 208 176 248 176/' + bw + ' stretch';
  var ARW = CFG.arrow ? CFG.arrow[V] : null, arw = $('arw'), amP = $('amP'), am = $('am'), arH = $('arH');
  if (ARW) { arw.setAttribute('href', ARW.src); arw.setAttribute('x', ARW.x); arw.setAttribute('y', ARW.y); arw.setAttribute('width', ARW.w); arw.setAttribute('height', ARW.h);
    am.setAttribute('x', 0); am.setAttribute('y', 0); am.setAttribute('width', L.W); am.setAttribute('height', L.H); amP.setAttribute('d', ARW.path) } else arw.style.visibility = arH.style.visibility = 'hidden';

  /* ---------- the sunflower: only in the running beat and at the form ---------- */
  function BUD(id, w, y){
    var leg = '<g class="bl"><path d="M0 0 L0 46" stroke="#1A1412" stroke-width="7" stroke-linecap="round"/><ellipse cx="8" cy="48" rx="13" ry="7" fill="#1A1412"/></g>';
    var arm = '<g class="ba"><path d="M0 0 L0 30" stroke="#1A1412" stroke-width="6" stroke-linecap="round"/><circle cx="0" cy="32" r="6.5" fill="#1A1412"/></g>';
    return '<svg id="' + id + '" width="' + w + '" height="' + (w * 1.25) + '" viewBox="-80 -100 160 200" style="position:absolute;left:' + (-w / 2) + 'px;top:' + (y - w * .625) + 'px;overflow:visible"><ellipse class="bs" cx="0" cy="96" rx="44" ry="9" fill="rgba(60,35,15,.3)"/><g class="bb">' + leg + leg + arm + arm + '<g class="bh"><g transform="scale(1.05)" data-sf="1"></g>' + (CFG.crown ? '<g transform="translate(5 -71) rotate(9) scale(.74)"><path d="M-37 20 L-44 -20 L-21 -3 L0 -32 L21 -3 L44 -20 L37 20 Z" fill="#F2BE27" stroke="#6B4310" stroke-width="3.6" stroke-linejoin="round"/><path d="M-38 12 L38 12 L37 20 L-37 20 Z" fill="#C98F1E" stroke="#6B4310" stroke-width="2.4" stroke-linejoin="round"/><circle cx="0" cy="-34" r="5.5" fill="#F72585" stroke="#6B4310" stroke-width="2.4"/><circle cx="-44" cy="-22" r="4.5" fill="#46C2B8" stroke="#6B4310" stroke-width="2.2"/><circle cx="44" cy="-22" r="4.5" fill="#46C2B8" stroke="#6B4310" stroke-width="2.2"/><circle cx="0" cy="3" r="5" fill="#F72585" stroke="#6B4310" stroke-width="2.2"/><path d="M-30 -3 Q-22 -8 -14 -3" fill="none" stroke="#FFF2B8" stroke-width="3" stroke-linecap="round"/></g>' : '') + '</g></g></svg>';
  }
  var budScale = L.bud * 1.25 / 200, budY = (L.capT + L.capB) / 2 + 2 - 95 * budScale;
  $('bud-wrap').innerHTML = BUD('bud', L.bud, budY);
  function pose(o){
    var e = $('bud'); e.style.display = o.hide ? 'none' : 'block'; if (o.hide) return;
    e.style.transform = 'translate(' + o.x.toFixed(1) + 'px,0)';
    var j = o.j || 0;
    e.querySelector('.bb').setAttribute('transform', 'translate(0 ' + (-j).toFixed(2) + ') rotate(' + (o.r || 0).toFixed(2) + ' 0 90)');
    var Lg = e.querySelectorAll('.bl'), Ar = e.querySelectorAll('.ba');
    for (var i = 0; i < 2; i++) Lg[i].setAttribute('transform', 'translate(' + (i ? 16 : -16) + ' 40) rotate(' + (Math.sin((o.lp || 0) + i * Math.PI) * (o.la || 0)).toFixed(2) + ')');
    Ar[0].setAttribute('transform', 'translate(-34 44) rotate(' + (o.al == null ? 14 : o.al).toFixed(1) + ')');
    Ar[1].setAttribute('transform', 'translate(34 44) rotate(' + (-(o.ar == null ? 14 : o.ar)).toFixed(1) + ')');
    e.querySelector('.bs').setAttribute('rx', (44 * (1 - Math.min(j, 160) / 260)).toFixed(1));
  }
  /* terracotta pots come along the wall; he leaps each one as it reaches him */
  var RN = CFG.runner, POT = (RN.pots || []).map(function(s){ return [T(s)] }), PW = PHONE ? 124 : 104;
  var pots = POT.map(function(){ var m = document.createElement('img'); m.src = 'paint/vpot.webp'; m.alt = ''; m.style.cssText = 'position:absolute;left:0;top:0;z-index:9;width:' + PW + 'px'; $('bud-wrap').appendChild(m); return m });
  /* his path in recording seconds: he runs at every change of beat, and sits quietly on her chair through "only two people" */
  var RX = (PHONE ? RN.path.p : RN.path.d).map(function(k){ return [T(k[0]), k[1]] });
  var DS = [];
  function rx(t){ for (var i = 0; i < RX.length - 1; i++) if (t <= RX[i + 1][0]) { var a0 = RX[i], b0 = RX[i + 1], d0 = b0[0] - a0[0]; return d0 <= 0 ? b0[1] : lerp(a0[1], b0[1], clamp((t - a0[0]) / d0, 0, 1)) } return RX[RX.length - 1][1] }
  /* jumps on the words that matter */
  var HOPS = (RN.hops || []).map(function(h){ return [T(h[0]), h[1]] });
  var POINTS = (RN.points || []).map(function(k){ return [T(k[0]), T(k[1])] });
  var RS0 = RN.backRun ? T(RN.backRun[0]) : -1, RS1 = RN.backRun ? T(RN.backRun[1]) : -1, OPEN = RN.openRun ? T(RN.openRun[0]) : -1, OPEN2 = RN.openRun ? T(RN.openRun[1]) : -1;
  function runnerPose(t){
    var x = rx(t), v = (rx(t + .02) - rx(t - .02)) / .04, sp = Math.abs(v);
    var opening = t < OPEN ? 1 : t < OPEN2 ? 1 - seg(t, OPEN, OPEN2) : 0, runs = Math.max(opening, clamp(sp / 150, 0, 1)), back = t >= RS0 && t < RS1;
    var ph = t * (back ? 20 : 16), o = {x: x, lp: back ? -ph : ph, la: 38 * runs, j: Math.abs(Math.sin(ph)) * 13 * runs, al: lerp(14, 38, runs), ar: lerp(14, 38, runs)};
    o.r = (opening > 0 ? 7 * opening : v > 0 ? 8 * runs : back ? -9 * runs : -8 * runs) + Math.sin(t * 1.3) * 1.3 * (1 - runs);
    for (var i = 0; i < HOPS.length; i++) { var E = HOPS[i][0], pj = seg(t, E - .08, E + .44); if (pj > 0 && pj < 1 && runs < .5) { o.j += Math.sin(pj * Math.PI) * HOPS[i][1]; o.al = o.ar = 150 } }
    /* the opening: two big leaps over the pots, tucked, arms up */
    POT.forEach(function(k){ var pj = seg(t, k[0] - .3, k[0] + .3); if (pj > 0 && pj < 1) { var a2 = Math.sin(pj * Math.PI); o.j += a2 * (PHONE ? 215 : 170); o.la = 16; o.al = o.ar = lerp(38, 130, a2); o.r = lerp(7, -8, pj) } });
    /* "free": the launch */
    (RN.launches || []).forEach(function(k){ var fr = seg(t, T(k[0]), T(k[1])); if (fr > 0 && fr < 1) { o.j += Math.sin(fr * Math.PI) * (PHONE ? k[3] : k[2]); o.al = o.ar = 165 } });
    /* he points at Ana when she says who she is, shrugs at "find out", and points at the form */
    (RN.pointAt || []).forEach(function(k){ var pa = seg(t, T(k[0]), T(k[1])) * (1 - seg(t, T(k[2]), T(k[3]))); if (pa > 0 && runs < .5) o.ar = lerp(14, PHONE ? k[5] : k[4], pa) });
    (RN.shrugs || []).forEach(function(k){ if (t > T(k[0]) && t < T(k[1]) && runs < .5) { var q = Math.sin(seg(t, T(k[0]), T(k[1])) * Math.PI); o.al = o.ar = lerp(14, 72, q) } });
    (RN.formPoints || []).forEach(function(k){ if (t >= T(k[0]) && t < T(k[1]) && runs < .5) { o.ar = PHONE ? k[4] : k[3]; o.al = 14; o.j += Math.sin(seg(t, T(k[0]), T(k[2])) * Math.PI) * 26 } });
    /* in her room he hops up onto the velvet chair and swings his legs; at the desk he points at her screen */
    if (RN.sit) { var SIT0 = T(RN.sit[0]), st = seg(t, SIT0, SIT0 + .42), en = seg(t, T(RN.sit[1]), T(RN.sit[2])); if (st > 0) { var lift = (PHONE ? RN.sit[4] : RN.sit[3]) * (1 - en); o.j = lift * io(st) + Math.sin(st * Math.PI) * 44 * (1 - st); o.la = 15; o.lp = t * 3.2; o.al = 28; o.ar = 28; o.r = Math.sin(t * .9) * 1.6; if (st >= 1 && en <= 0) { var hp = 0; HOPS.forEach(function(h){ var pj = seg(t, h[0] - .08, h[0] + .44); if (pj > 0 && pj < 1) hp = 1 }); if (hp) o.al = o.ar = 120 } } }
    POINTS.forEach(function(k){ var q = seg(t, k[0], k[0] + .24) * (1 - seg(t, k[1] - .2, k[1])); if (q > 0 && runs < .5) o.ar = lerp(14, 92, q) });
    /* the close: he keeps bouncing with both arms up until the end */
    var cl0 = RN.bounceFrom == null ? 1e9 : T(RN.bounceFrom) + .46; if (t > cl0) { var bn = Math.abs(Math.sin((t - cl0) * 4.6)); o.j += bn * 30; o.la = 16; o.lp = t * 9; o.al = o.ar = 150 + Math.sin(t * 9) * 16; o.r = Math.sin(t * 4.6) * 4 }
    o.x0 = x; if (roomAt(t) !== 'coast') o.x += pan(t);
    return o;
  }
  function runner(t){
    var o = runnerPose(t), x = o.x0; pose(o);
    /* each pot's distance is how far the wall still has to slide until his leap */
    pots.forEach(function(m, i){ var th = POT[i][0], dHit = DS[clamp(Math.floor(th * 30), 0, DS.length - 1)], dNow = DS[clamp(Math.floor(t * 30), 0, DS.length - 1)], px0 = x + (dHit - dNow) - PW * .5; m.style.display = t < (RN.potsUntil || 0) && px0 > -220 && px0 < L.W + 40 ? 'block' : 'none'; m.style.transform = 'translate(' + px0.toFixed(1) + 'px,' + ((L.capT + L.capB) / 2 + 4 - PW * 190 / 150).toFixed(1) + 'px)' });
  }
  /* the world slides by exactly as far as he runs */
  var NF0 = Math.ceil(window.DUR * 30) + 2, dd = 0;
  for (var fi = 0; fi < NF0; fi++) { var tf0 = fi / 30, vv = tf0 < OPEN ? 430 : tf0 < OPEN2 ? 430 * (1 - seg(tf0, OPEN, OPEN2)) : Math.abs((rx(tf0 + .02) - rx(tf0 - .02)) / .04) * .6; dd += vv / 30; DS.push(dd) }

  /* ---------- pieces. Each: recording seconds in and out, a place per shape ---------- */
  var box = document.getElementById('pieces'), PIECES = [], TICKS = [];
  function add(html, s0, s1, d, p, o){
    o = o || {}; var e = document.createElement('div'); e.className = 'pc' + (o.cls ? ' ' + o.cls : ''); e.innerHTML = html; box.appendChild(e);
    var P = PHONE ? p : d; e.style.left = P[0] + 'px'; e.style.top = P[1] + 'px'; if (P[2]) e.style.width = P[2] + 'px'; if (P[3]) e.style.fontSize = P[3] + 'px';
    var it = {e: e, t0: T(s0), t1: T(s1), rot: o.rot || 0, wipe: o.wipe, still: s0 === 0, tilt: o.tilt || 0, hold: o.hold, under: /\bunder\b/.test(o.cls || '')}; PIECES.push(it); return it;
  }
  function img(src){ return '<img src="' + src + '" alt="">' }
  /* words struck on her words */
  var STRIKES = [];
  function strike(text, s0, sOut, sHit, d, p){
    var it = add('<span class="strk">' + text + '<svg viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 12 C24 4 62 16 100 6"/></svg></span>', s0, sOut, d, p); it.strikeAt = T(sHit);
    var pth = it.e.querySelector('path'); STRIKES.push([pth, it.strikeAt]);
  }
  /* Pinterest mixed media (tools/film/cut, tex): each piece means the line it lands on */
  function cut(n){ return img('cut/' + n + '.png') }
  /* the page's Day 1 to 3 map, and a row with her situation */
  function mapHtml(words){ var ck = '<svg viewBox="0 0 20 20"><path d="m5 10.5 3.4 3.4L15 6.8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return '<div class="dm">' + [0, 1, 2].map(function(i){ return '<span class="dm-s"><i class="dm-c"><b>' + (i + 1) + '</b>' + ck + '</i><span class="dm-t"><small>Day ' + (i + 1) + '</small>' + (words ? '<b>' + words[i] + '</b>' : '') + '</span></span>' }).join('') + '</div>' }
  function map(words, s0, s1, state, d, p){ var it = add(mapHtml(words), s0, s1, d, p, {cls: 'top'}); if (words) it.e.querySelector('.dm').classList.add('col'); it.e.querySelectorAll('.dm-s').forEach(function(e, i){ e.className = 'dm-s ' + (state[i] || '') ; if (state === 'even') e.style.opacity = 1 }); return it }
  function sit(file, text){ return '<div class="sitr"><img src="../../img/vip/paint/' + file + '.webp" alt="" style="width:' + (PHONE ? 180 : 150) + 'px">' + text + '</div>' }
  CFG.pieces({add: add, img: img, cut: cut, strike: strike, map: map, sit: sit, tick: function(fn){ TICKS.push(fn) }, T: T, seg: seg, lerp: lerp, io: io, outq: outq, clamp: clamp, PHONE: PHONE, V: V, PC: PC, L: L, box: box, $: $});

  function pieces(t, waits){
    PIECES.forEach(function(it){
      if (it.under ? !ACT.under : !ACT.graphics) return;
      var e = it.e, on = t >= it.t0 - 1e-4 && t < it.t1;
      if (!on) { if (e.style.visibility !== 'hidden') { e.style.visibility = 'hidden'; e.style.opacity = 0 } return }
      e.style.visibility = 'visible';
      e.style.setProperty('--p', io(seg(t, it.t0 + .08, it.t0 + .55)).toFixed(3));
      if (it.count) it.count(t);
      if (it.seq) setImg(e.querySelector('img'), it.seq(t), waits);
      if (it.wipe === 1) { e.style.opacity = 1; var p1 = it.still ? 1 : io(seg(t, it.t0, it.t0 + .7)), o1 = io(seg(t, it.t1 - .25, it.t1)); e.querySelectorAll('.ln').forEach(function(l){ l.style.clipPath = 'inset(-20% ' + ((1 - p1) * 103).toFixed(2) + '% -30% ' + (o1 * 103).toFixed(2) + '%)' }); return }
      if (it.wipe === 2) { e.style.opacity = 1; var d = $('sigh'); d.style.clipPath = 'inset(-20% ' + ((1 - io(seg(t, it.t0, it.t0 + .62))) * 103).toFixed(2) + '% -20% 0)'; return }
      if (it.hold) { e.style.opacity = 1; return }
      var q = seg(t, it.t0, it.t0 + .42), ov = q < 1 ? outq(q) + Math.sin(q * Math.PI) * .12 * (1 - q) : 1;
      e.style.opacity = io(seg(t, it.t0, it.t0 + .1)).toFixed(3);
      e.style.transform = 'translateY(' + ((1 - ov) * 56).toFixed(2) + 'px) rotate(' + (it.tilt + (1 - ov) * (it.rot || 2.4)).toFixed(3) + 'deg)';
    });
    if (!ACT.graphics) return;
    TICKS.forEach(function(fn){ fn(t) });
    STRIKES.forEach(function(s){ var L0 = 110; s[0].style.strokeDasharray = L0; s[0].style.strokeDashoffset = (L0 * (1 - io(seg(t, s[1], s[1] + .26)))).toFixed(1) });
    /* the arrow, with its head leading */
    if (!ARW) return;
    var a0 = T(CFG.arrow.from), a1 = T(CFG.arrow.to), a2 = T(CFG.arrow.off), Lt = amP.getTotalLength(), pr = io(seg(t, a0, a1)), vis = t >= a0 && t < a2;
    amP.style.strokeDasharray = Lt + ' ' + (Lt + 20); amP.style.strokeDashoffset = (Lt * (1 - pr)).toFixed(1); arw.style.visibility = arH.style.visibility = vis ? 'visible' : 'hidden';
    if (vis) { var q0 = amP.getPointAtLength(Lt * pr), q2 = amP.getPointAtLength(Math.min(Lt, Lt * pr + 3)), q1 = amP.getPointAtLength(Math.max(0, Lt * pr - 3)), ang = Math.atan2(q2.y - q1.y, q2.x - q1.x) * 180 / Math.PI, hw = ARW.head, hh2 = hw * 150 / 140; arH.setAttribute('width', hw); arH.setAttribute('height', hh2); arH.setAttribute('transform', 'translate(' + q0.x.toFixed(1) + ' ' + q0.y.toFixed(1) + ') rotate(' + ang.toFixed(2) + ') translate(' + (-hw * .16).toFixed(1) + ' ' + (-hh2 * .5).toFixed(1) + ')') }
  }

  /* the camera steps closer on the words that matter, and resets at each new shot */
  var PUNCH = (CFG.punch || []).map(T);
  function punch(t, s, nxt){ var z = 1; PUNCH.forEach(function(p){ if (p > s.t + .05 && p <= t && (!nxt || p < nxt.t)) z *= 1 + .045 * io(seg(t, p - .04, p + .3)) }); return z }

  /* ---------- Ana: main, framed, or small ---------- */
  function ana(t){
    var mx = mix(t), m = mx.m, c = mx.c, s = S[mx.k], nxt = S[mx.k + 1], dur = (nxt ? nxt.t : window.DUR) - s.t, sh = clamp((t - s.t) / dur, 0, 1);
    var f = [lerp(L.FA[0], L.FB[0], c), lerp(L.FA[1], L.FB[1], c), lerp(L.FA[2], L.FB[2], c)];
    var since = t - s.t, sw = !CFG.still && since > 0 && since < 2.2 && !isM(s[1]) ? Math.sin(since * 7) * 1.3 * Math.exp(-since * 2.6) : 0, off = m * (L.H + 260), hx = L.box[0] / 2;
    a.style.visibility = m >= .999 ? 'hidden' : 'visible'; a.style.transformOrigin = hx + 'px 0';
    a.style.transform = 'translate(' + (f[0] + hx * f[2] - hx).toFixed(2) + 'px,' + (f[1] - off).toFixed(2) + 'px) rotate(' + sw.toFixed(3) + 'deg) scale(' + f[2].toFixed(4) + ')';
    var R0 = [f[0] + L.ins[0] * f[2], f[1] + L.ins[1] * f[2], L.ins[2] * f[2], L.ins[3] * f[2]], Vr = R0.map(function(v, i){ return lerp(v, L.M[i], m) }); if (mx.w > 0) { var WR = PHONE ? L.M : [(L.W - 1000) / 2, 0, 1000, L.H]; Vr = Vr.map(function(v, i){ return lerp(v, WR[i], mx.w) }) }
    vb.style.left = Vr[0].toFixed(2) + 'px'; vb.style.top = Vr[1].toFixed(2) + 'px'; vb.style.width = Vr[2].toFixed(2) + 'px'; vb.style.height = Vr[3].toFixed(2) + 'px';
    vb.style.transformOrigin = (f[0] + hx * f[2] - Vr[0]).toFixed(1) + 'px ' + (f[1] - Vr[1]).toFixed(1) + 'px'; vb.style.transform = 'rotate(' + (sw * (1 - m)).toFixed(3) + 'deg)';
    var t2 = $('torn2'); t2.style.display = PHONE && m > .02 ? 'block' : 'none'; if (PHONE) { t2.style.left = (L.W / 2 - 45) + 'px'; t2.style.top = (Vr[1] + Vr[3] - 34 - 560) + 'px'; t2.style.opacity = clamp(m * 2.5, 0, 1).toFixed(3) }
    var tn = $('torn'); tn.style.display = PHONE || m < .02 ? 'none' : 'block'; tn.style.opacity = clamp(m * 2.5, 0, 1).toFixed(3); TN2.style.display = !PHONE && mx.w > .02 ? 'block' : 'none'; TN2.style.left = (Vr[0] + Vr[2] - 78).toFixed(1) + 'px'; TN2.style.opacity = mx.w.toFixed(3); tn.style.left = (Vr[0] - 12).toFixed(1) + 'px';
    var dy = (L.wallM - L.capT) * m, tf = 'translateY(' + dy.toFixed(1) + 'px)'; $('wallsvg').style.transform = tf; $('bud-wrap').style.transform = tf;
    $('wash').style.opacity = (c * .1).toFixed(3);
    /* crop: closer on her in landscape, following her face; shot 20 pushes in the most */
    var cr = CROP[s[2]], push = s[3] || .03, zoom = (PHONE ? 1 : 1.14 - mx.w * .14) * cr[0] * (1 + sh * push) * punch(t, s, nxt), seen = (CFG.herH ? Vr[3] / Vr[2] * 720 : 835) / zoom;
    var fc = window.FACE[clamp(Math.floor(t * 30), 0, window.FACE.length - 1)], top = clamp(fc - seen * .47, 0, HH - seen), mxd = (zoom - 1) / 2 * 100 / zoom, dx = clamp(cr[1], -mxd, mxd);
    $('vid').style.transform = 'translate(' + dx.toFixed(2) + '%,' + (-top / HH * zoom * 100).toFixed(3) + '%) scale(' + zoom.toFixed(4) + ')'; if (CFG.herH) $('vid').style.height = (Vr[2] * HH / 720).toFixed(1) + 'px';
    return mx;
  }

  /* ---------- captions: the whole thought is readable, each word inks in as she says it ---------- */
  var capP = $('capP'), cap = $('cap'), capCur = -1, CAPS = window.CAPS;
  if (CFG.lastWordKey) CAPS[CAPS.length - 1].w[CAPS[CAPS.length - 1].w.length - 1].h = 1;
  var PINK = CFG.pinkWords || [], TITLED = (CFG.titled || []).map(function(k){ return [T(k[0]), T(k[1])] });
  function captions(t, type){
    var k = -1; for (var i = 0; i < CAPS.length; i++) if (t >= CAPS[i].t0 - .001 && t < CAPS[i].t1 + .001) k = i;
    if (k < 0 || CAPS[k].hide) { capP.style.opacity = 0; capCur = -2; return }
    if (k !== capCur) { capCur = k; capP.innerHTML = CAPS[k].w.map(function(w, i, A){ var nx = A[i + 1], cl = w.h ? (PINK.indexOf(w.x) >= 0 ? 'pk' : 'h') : ''; return w.h && nx && nx.h ? '<span class="' + cl + '">' + w.x + ' </span>' : '<span class="' + cl + '">' + w.x + '</span> ' }).join('') }
    var c = CAPS[k], sp = capP.querySelectorAll('span'), P = type === 'C' ? L.cC : type === 'F' ? L.cF : type === 'W' && L.cW ? L.cW : L.cM;
    var titled = !PHONE && type !== 'C' && TITLED.some(function(k){ return t >= k[0] && t < k[1] }); cap.style.left = P.x + 'px'; cap.style.top = (titled ? 316 : P.y) + 'px'; cap.style.width = P.w + 'px'; capP.style.fontSize = P.fs + 'px'; capP.style.textAlign = P.align;
    if (PHONE && type === 'C') { var chh = capP.offsetHeight; if (P.y + chh > L.H - 22) cap.style.top = (L.H - 22 - chh) + 'px' }
    capP.style.opacity = io(seg(t, c.t0 - .02, c.t0 + .1));
    c.w.forEach(function(w, i){ var pw = seg(t, w.t - .05, w.t + .16); sp[i].style.opacity = lerp(.88, 1, pw).toFixed(3); if (w.h) sp[i].style.setProperty('--p', io(seg(t, w.t - .02, w.t + .3)).toFixed(3)) });
  }

  /* her frames: exact, one image per frame of the cut */
  var vid = $('vid'), sky = $('sky'), NF = Math.round(DUR0 * 30);
  function pad(n){ return ('0000' + n).slice(-5) }
  function frames(t, waits){
    var f = clamp(Math.floor(t * 30 + 1e-6), 0, NF - 1) + 1;
    if (ACT.her) setImg(vid, CFG.frames + '/f/' + pad(f) + '.jpg', waits);
    if (FG && ACT.her) { var fgs = FGS[0][1]; FGS.forEach(function(k){ if (t >= k[0]) fgs = k[1] }); setImg(FG, fgs, waits) }
    if (ACT.world) setImg(sky, CFG.frames + (PHONE ? '/b2/' : '/b/') + pad(f) + '.jpg', waits);
  }

  /* ---------- layers: world, actor (the sunflower and shutters), her, graphics, captions. Each paints alone on transparent; ffmpeg stacks them and lays the grain on top ---------- */
  var ROOTS = {
    world: ['#sky', '#world', '#gulls', '#far', '#near', '#sea', '#boat', '#g1', '#g2', '#paper', '#wash', '#rooms', '#wallsvg', '#pieces > .under'],
    actor: CFG.doorTop ? ['#bud-wrap'] : ['#shL', '#shR', '#bud-wrap'],
    door: CFG.doorTop ? ['#shL', '#shR'] : [],
    her: ['#vb', '#torn', '#torn2', '#torn3', '#ana', '#fg'],
    graphics: ['#thread', '#pieces > :not(.under)', '#cursor', '#tap'],
    captions: ['#cap'],
    grain: ['#grain']
  };
  var ORDER = L.zV > 10 ? ['world', 'actor', 'her', 'graphics', 'captions'] : ['world', 'her', 'actor', 'graphics', 'captions'];
  /* doorTop: the shutters are their own top layer and close over everything, her, pieces and captions included */
  if (CFG.doorTop) ORDER.push('door');
  var ALLON = {world: 1, actor: 1, her: 1, under: 1, graphics: 1, captions: 1, door: 1}, ACT = ALLON, LAYER = null, layerCss = document.createElement('style'); document.head.appendChild(layerCss);
  function setLayer(n){
    LAYER = n === 'all' ? null : n; ACT = !LAYER ? ALLON : {world: n === 'world', actor: n === 'actor', her: n === 'her', under: n === 'world', graphics: n === 'graphics', captions: n === 'captions', door: n === 'door'};
    if (!LAYER) { layerCss.textContent = ''; return }
    var off = Object.keys(ROOTS).filter(function(k){ return k !== n && ROOTS[k].length }).map(function(k){ return ROOTS[k].join(',') }).join(',');
    layerCss.textContent = off + '{display:none!important}' + (n === 'world' ? '' : 'html,body,#film{background:' + (n === 'grain' ? '#fff' : 'transparent') + '!important}');
  }
  /* in a plan pass nothing loads or paints: the wanted picture is only noted */
  function setImg(im, url, waits){
    if (PLAN) { im.setAttribute('data-src', url); return }
    if (im.getAttribute('src') !== url) { im.setAttribute('src', url); waits.push(im.decode().catch(function(){})) }
  }

  window.DUR = window.DUR || 190;
  window.render = function(t){
    t = clamp(t, 0, window.DUR);
    var waits = [];
    if (ACT.world) {
      var d = DS[clamp(Math.floor(t * 30), 0, DS.length - 1)];
      $('capT').setAttribute('transform', 'translate(' + (-(d % 400)).toFixed(1) + ' 0)');
      /* everything keeps moving: far hills slowly, the near coast faster, the sea and its light on their own */
      slide('far', d * .05 + t * 1.2 + (CFG.coastX || 0) * .25); slide('near', d * .22 + t * 3.4 + (CFG.coastX || 0)); slide('sea', d * .34 + t * 10);
      var sn = Math.sin(t * 1.5); slide('g1', d * .34 + t * 26); $('g1').style.opacity = (.6 + .4 * sn).toFixed(3);
      slide('g2', d * .34 + t * 4); $('g2').style.opacity = (.6 - .4 * sn).toFixed(3);
      var bspan = L.W + 340, bx = L.W + 120 - ((t * 15 + d * .22 + bspan * .3) % bspan); boat.style.transform = 'translate(' + bx.toFixed(1) + 'px,' + (L.hor + 4 + Math.sin(t * 1.3) * 3).toFixed(1) + 'px) rotate(' + (Math.sin(t * 1.1) * 1.8).toFixed(2) + 'deg)';
      gulls(t);
      /* the sky itself drifts too */
      $('sky').style.transform = 'scale(1.16) translateX(' + (Math.sin(t * .07) * 5 - 1).toFixed(2) + '%)';
    }
    var mx = ACT.captions && LAYER ? mix(t) : ana(t);
    if (ACT.world || ACT.actor || ACT.door) scene(t, mx.type);
    if (ACT.graphics || ACT.under) pieces(t, waits);
    if (ACT.actor) runner(t);
    if (ACT.captions) captions(t, mx.type);
    frames(t, waits);
    return Promise.all(waits);
  };

  /* ---------- the plan pass: what each layer would show on each frame, so only what changed is painted again ---------- */
  function hash(str){ var h1 = 0xdeadbeef, h2 = 0x41c6ce57; for (var i = 0; i < str.length; i++) { var c = str.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677) } h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909); return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36) }
  function walk(el, out, urls){
    if (el.nodeType === 3) { out.push(el.data); return }
    if (el.nodeType !== 1 || el.tagName === 'DEFS' && !el.childNodes.length) return;
    var st = el.style; if (st && (st.visibility === 'hidden' || st.display === 'none' || st.opacity === '0')) return;
    out.push('<', el.tagName); var A = el.attributes;
    for (var i = 0; i < A.length; i++) { var n = A[i].name, v = A[i].value; if (n === 'src' && el.hasAttribute('data-src')) continue; out.push(' ', n, '=', v); if (n === 'src' || n === 'href' || n === 'data-src') urls[v] = 1; else if (n === 'style' && v.indexOf('url(') >= 0) v.replace(/url\("?([^")]+)"?\)/g, function(_, u){ urls[u] = 1 }) }
    out.push('>'); for (var c = el.firstChild; c; c = c.nextSibling) walk(c, out, urls);
  }
  window.KIT = {
    order: ORDER, setLayer: setLayer,
    info: function(){ return {dur: window.DUR, shots: S.map(function(s){ return s.t }), order: ORDER, w: L.W, h: L.H} },
    /* chunks: [[f0, f1), ...]; returns per chunk, per layer, a hash per frame and the pictures it uses */
    plan: function(chunks, fps){
      var els = {}; ORDER.forEach(function(n){ els[n] = [].slice.call(document.querySelectorAll(ROOTS[n].join(','))) });
      return chunks.map(function(ch){ var res = {}; ORDER.forEach(function(n){ res[n] = {h: [], u: {}} });
        for (var f = ch[0]; f < ch[1]; f++) { window.render(f / fps); ORDER.forEach(function(n){ var o = []; els[n].forEach(function(e){ walk(e, o, res[n].u) }); res[n].h.push(hash(o.join(''))) }) }
        ORDER.forEach(function(n){ res[n].u = Object.keys(res[n].u) }); return res });
    }
  };
  if (Q.get('layer')) setLayer(Q.get('layer'));

  Promise.all([fetch('../../exit-number/').then(function(r){ return r.text() }), $('sigh') ? fetch(PC + 'sig.svg').then(function(r){ return r.text() }) : '']).then(function(R2){
    var m = R2[0].match(/<symbol id="sf" viewBox="-60 -60 120 120">([\s\S]*?)<\/symbol>/); var SF = m ? m[1] : '';
    document.querySelectorAll('[data-sf]').forEach(function(g){ g.innerHTML = SF });
    if ($('sigh')) { $('sigh').innerHTML = R2[1]; var sv = $('sigh').querySelector('svg'); sv.style.width = '100%'; sv.style.height = 'auto'; sv.style.display = 'block'; sv.querySelectorAll('path').forEach(function(p){ p.style.strokeDasharray = 'none'; p.style.strokeDashoffset = 0; p.style.opacity = 1; if (!p.closest('mask')) { if (p.getAttribute('fill') !== 'none') p.style.fill = '#D1126F'; if (p.getAttribute('stroke')) p.style.stroke = '#D1126F' } }) }
    if (PLAN) return;
    var imgs = Array.prototype.slice.call(document.images);
    return Promise.all(imgs.map(function(im){ return im.complete ? 0 : new Promise(function(r){ im.onload = im.onerror = r }) }));
  }).then(function(){ return document.fonts.ready }).then(function(){ return window.render(+(new URLSearchParams(location.search).get('t') || 0)) }).then(function(){ document.body.setAttribute('data-ready', '1') });
})();
