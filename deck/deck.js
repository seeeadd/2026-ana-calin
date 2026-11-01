/* Ana's workshop deck: shared helpers for deck/day1.html, day2.html, day3.html.
   - the 1920x1080 stage scales to its window (a Day window on the page, or the file on its own)
   - headlines are broken by hand (one span per line) and sized so the widest line fills the 820 px column
   - window.DECK.play() runs the day; ?still=1 or ?still=2 shows the end of slide 1 or 2 (PNG exports);
     opened on its own, it plays by itself; in a Day window the page calls DECK.play() when it is in view
   - DECK.on(fn) hears 'talk' and 'quiet', so the page can light Ana's camera while she speaks */
(function () {
  var Q = new URLSearchParams(location.search), still = +Q.get('still') || 0, embedded = window.parent !== window;
  var stage = document.querySelector('.stage');
  function fit() { var k = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = 'translate(' + (innerWidth - 1920 * k) / 2 + 'px,' + (innerHeight - 1080 * k) / 2 + 'px) scale(' + k + ')'; return k }
  fit(); addEventListener('resize', fit);

  var $ = function (s, r) { return (r || document).querySelector(s) }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) };
  var listeners = [];
  var D = window.DECK = { $: $, $$: $$, still: still, embedded: embedded, play: function () {}, reset: function () {}, on: function (f) { listeners.push(f) },
    emit: function (e) { listeners.forEach(function (f) { try { f(e) } catch (x) {} }) } };
  D.k = function () { return stage.getBoundingClientRect().width / 1920 };

  /* headline: words wrapped for word-by-word entrances, size fitted to the column (130 to 190 px), the marker line
     sits above it, and the type block is centred on the illustration */
  D.setHeadline = function (hl, opt) { opt = opt || {}; var W = opt.width || 820;
    $$('.ln', hl).forEach(function (ln) { if (ln.dataset.w) return; ln.dataset.w = 1;
      ln.innerHTML = ln.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>' }).join(' ') });
    hl.style.width = W + 'px'; hl.style.fontSize = '100px';
    var widest = Math.max.apply(null, $$('.ln', hl).map(function (l) { return l.scrollWidth }));
    var fs = Math.max(opt.min || 130, Math.min(opt.max || 190, 100 * W / widest)); hl.style.fontSize = fs + 'px';
    if (opt.top != null) hl.style.top = opt.top + 'px';
    else { var h = hl.offsetHeight, ill = $('.ill'), mid = ill.offsetTop + ill.offsetHeight / 2, gap = 64;
      var top = mid - (h + gap) / 2; hl.style.top = (top + gap) + 'px';
      var mk = $('.mk'); if (mk && opt.marker !== false) mk.style.top = (top - 4) + 'px' }
    $$('.ln.key', hl).forEach(function (ln) { if (!$('.sw', ln)) D.swipe(ln) });
    return fs;
  };

  /* the yellow swipe behind a key line: a hand-made band, revealed left to right */
  D.swipe = function (ln) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'sw'); svg.setAttribute('viewBox', '0 0 100 20'); svg.setAttribute('preserveAspectRatio', 'none');
    svg.innerHTML = '<path d="M1.5 5.2 C20 3.4 52 4.6 98.4 2.8 C99.4 7 99 12 98.6 16.6 C70 17.8 36 16.4 2.2 18.4 C1 13 .8 9 1.5 5.2 Z"/>';
    ln.insertBefore(svg, ln.firstChild); return svg;
  };
  D.swipeIn = function (tl, hl, at) { var s = $$('.sw', hl); if (s.length) tl.fromTo(s, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .6, ease: 'power2.inOut', stagger: .2 }, at); return tl };

  /* stage coordinates of a point in a local svg (so the pencil tip can follow a stroke drawn inside a rotated object) */
  D.toStage = function (svg, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(svg.getScreenCTM()), r = stage.getBoundingClientRect(), k = D.k(); return { x: (q.x - r.left) / k, y: (q.y - r.top) / k } };

  /* Ana's pencil, the deck's anchor: it moves on arcs, writes with its tip on the line, and rests */
  D.Pencil = function (el) {
    var P = { x: 0, y: 0, r: -34, lift: 0 }, W = 320 * 820 / 900, tipX = W * 10 / 320, tipY = W * 60 / 320 / 2;
    function apply() { var l = P.lift; gsap.set(el, { x: P.x - tipX, y: P.y - tipY, rotation: P.r, scale: 1 + l * .07, filter: 'drop-shadow(' + (5 + l * 22).toFixed(1) + 'px ' + (8 + l * 30).toFixed(1) + 'px ' + (5 + l * 16).toFixed(1) + 'px rgba(60,40,25,' + (.3 - l * .12).toFixed(2) + '))' }) }
    P.at = function (x, y, r) { P.x = x; P.y = y; if (r != null) P.r = r; P.lift = 0; apply(); return P };
    /* travel on an arc, lifted off the table (a small dip first: anticipation), then set down with a settle */
    P.go = function (x, y, dur, r, arc) { var o = { t: 0 }, x0, y0, r0;
      return gsap.to(o, { t: 1, duration: dur || .9, ease: 'power2.inOut', onStart: function () { x0 = P.x; y0 = P.y; r0 = P.r },
        onUpdate: function () { var t = o.t, a = arc == null ? 90 : arc; P.lift = Math.sin(Math.PI * t);
          P.x = x0 + (x - x0) * t; P.y = y0 + (y - y0) * t - Math.sin(Math.PI * t) * a + (t < .15 ? Math.sin(t / .15 * Math.PI) * 7 : 0);
          P.r = r == null ? r0 : r0 + (r - r0) * t; apply() } }) };
    P.write = function (path, dur, ease) { var L, o = { t: 0 }, svg = path.ownerSVGElement;
      return gsap.to(o, { t: 1, duration: dur || 1, ease: ease || 'power1.inOut', onStart: function () { L = path.getTotalLength(); path.style.strokeDasharray = L + ' ' + (L + 4) },
        onUpdate: function () { if (L == null) L = path.getTotalLength(); path.style.strokeDashoffset = L * (1 - o.t); var p = path.getPointAtLength(L * o.t), s = D.toStage(svg, p.x, p.y); P.x = s.x; P.y = s.y; P.lift = 0; apply() } }) };
    return P;
  };
  D.along = function (el, path, dur, opt) { opt = opt || {}; var o = { t: 0 }, svg = path.ownerSVGElement, L;
    return gsap.to(o, { t: 1, duration: dur, ease: opt.ease || 'power1.inOut', onStart: function () { L = path.getTotalLength() }, onUpdate: function () { if (L == null) L = path.getTotalLength(); var t = opt.rev ? 1 - o.t : o.t, p = path.getPointAtLength(L * t), s = D.toStage(svg, p.x, p.y); gsap.set(el, { x: s.x, y: s.y - Math.abs(Math.sin(o.t * Math.PI * (opt.steps || 10))) * (opt.bob || 0) }) } }) };
  D.hide = function (path) { var L = path.getTotalLength(); path.style.strokeDasharray = L + ' ' + (L + 4); path.style.strokeDashoffset = L };
  D.draw = function (path, dur, ease) { var L = path.getTotalLength(); path.style.strokeDasharray = L + ' ' + (L + 4);
    return gsap.fromTo(path, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: dur || 1, ease: ease || 'power1.inOut' }) };

  function smooth(pts) { var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) { var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) }
    return d }
  function rng(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 } }
  /* a signature: cursive loops along a baseline (deterministic per seed, so every render is the same) */
  D.signature = function (x0, y0, w, seed) { var r = rng(seed);
    var pts = [[x0, y0 - 3], [x0 + 6, y0 - 27 - r() * 6], [x0 + 10, y0 - 3], [x0 + 4, y0 - 12]], x = x0 + 13;
    while (x < x0 + w) { var tall = r() < .18; pts.push([x + 3, y0 - (tall ? 21 + r() * 6 : 8 + r() * 6)]); pts.push([x + 6 + r() * 3, y0 - r() * 2]); if (r() < .3) pts.push([x + 3, y0 - 5]); x += 9 + r() * 5 }
    pts.push([x + 14, y0 + 5]); pts.push([x + 36, y0 - 2]); return smooth(pts) };
  /* a hand loop around an ellipse, overlapping itself a little where it closes */
  D.loop = function (cx, cy, rx, ry, seed) { var r = rng(seed || 3), pts = [];
    for (var i = 0; i <= 30; i++) { var a = -2.3 + i / 30 * 6.95, k = 1 + .05 * Math.sin(i * 1.3 + r()) + (i > 25 ? .07 : 0); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]) }
    return smooth(pts) };

  /* set an object down on the table: lifted and a touch large, then down with a settle */
  D.placeIn = function (tl, el, at, f) { f = f || {}; var rot = f.rot == null ? 7 : f.rot;
    tl.fromTo(el, { y: f.y == null ? -80 : f.y, x: f.x || 0, scale: f.scale || 1.12, opacity: 0, rotation: '+=' + rot, filter: 'drop-shadow(30px 46px 26px rgba(60,40,25,.16))' },
      { y: 0, x: 0, scale: 1, opacity: 1, rotation: '-=' + rot, filter: 'drop-shadow(3px 5px 4px rgba(60,40,25,.14))', duration: f.dur || .8, ease: 'back.out(1.3)', immediateRender: false }, at);
    return tl };
  /* take an object away: it lifts (anticipation), then slides off on an arc */
  D.takeOut = function (tl, el, at, dx, dy, rot) { tl.to(el, { y: '-=14', scale: 1.04, duration: .18, ease: 'power1.out' }, at)
      .to(el, { x: dx, y: dy || 60, rotation: rot || -12, duration: .7, ease: 'power3.in' }, '>-.02'); return tl };

  /* headline words arrive one at a time, as if said; leave together */
  D.wordsIn = function (tl, hl, at) { tl.fromTo($$('.w', hl), { y: 50, opacity: 0, rotation: 4 }, { y: 0, opacity: 1, rotation: 0, duration: .62, ease: 'power3.out', stagger: .085, immediateRender: false }, at); return tl };
  D.wordsOut = function (tl, hl, at) { tl.to($$('.w', hl), { y: -40, opacity: 0, duration: .34, ease: 'power2.in', stagger: .025 }, at); tl.to($$('.sw', hl), { opacity: 0, duration: .25 }, '<'); return tl };

  /* start: build the timelines (A = slide 1, T = the change and slide 2), then play, or show a still */
  D.start = function (build) {
    var go = function () {
      var parts = build(D) || {}, A = parts.A, T = parts.T;
      [A, T].forEach(function (t) { if (t) t.pause(0) });
      if (still) { if (A) A.progress(1); if (still > 1 && T) T.progress(1); document.documentElement.dataset.ready = 1; return }
      if (T) T.progress(0);
      var playing = null;
      D.play = function () { if (playing) return; playing = gsap.timeline(); if (A) playing.add(A.play(0)); if (T) playing.add(T.play(0), '+=' + (parts.hold || 1.6)) };
      D.reset = function () { if (playing) playing.kill(); playing = null; if (T) T.pause(0); if (A) A.pause(0) };
      document.documentElement.dataset.ready = 1;
      if (!embedded) setTimeout(D.play, 600);
    };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { requestAnimationFrame(function () { requestAnimationFrame(go) }) });
  };
  addEventListener('message', function (e) { if (e.data && e.data.deckPlay) D.play() });
})();
