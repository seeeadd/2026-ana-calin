/* The registration page, Nov 1: the VIP page's motion added on top of the page's own (tools/paint/PLAN-registration.md).
   Her teaser slides play inside the Day windows, a pencil marks a draft reviewed live, the calculator gives its real
   numbers, each small list is drawn as dots, the key lines are swept in yellow. Each plays when it can be seen and
   only after its own block has faded in; reduced motion shows every final state. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s) };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) };

  /* small lists, made countable: one dot per reader (built even without motion) */
  $$('.trr-dots').forEach(function (d) { var n = +d.dataset.n, h = ''; for (var i = 0; i < n; i++) h += '<i></i>'; d.innerHTML = h });

  /* skimmable: each key line is swept with her yellow as it comes into view */
  var marks = $$('mark.sk');
  if (reduce || !('IntersectionObserver' in window)) marks.forEach(function (m) { m.classList.add('on') });
  else {
    var mo = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { var m = en.target; setTimeout(function () { m.classList.add('on') }, 300); mo.unobserve(m) } }) }, { rootMargin: '0px 0px -15% 0px' });
    marks.forEach(function (m) { mo.observe(m) });
  }

  if (!window.gsap || reduce) return;
  gsap.registerPlugin(ScrollTrigger);

  function when(el, tl, start) {
    if (!el) return; tl.pause();
    ScrollTrigger.create({ trigger: el, start: start || 'top 65%', once: true, onEnter: function () { tl.play() } });
  }
  function draw(path, dur, pen, ease) {
    var L = path.getTotalLength(), o = { t: 0 };
    path.style.strokeDasharray = L + ' ' + (L + 2); path.style.strokeDashoffset = L;
    return gsap.to(o, { t: 1, duration: dur, ease: ease || 'power1.inOut', onUpdate: function () {
      path.style.strokeDashoffset = L * (1 - o.t);
      if (pen) { var p = path.getPointAtLength(L * o.t); pen.at(p.x, p.y) } } });
  }
  function count(el, to, dur, fmt) {
    var o = { v: 0 }; fmt = fmt || function (v) { return Math.round(v).toLocaleString('en-US') };
    return gsap.to(o, { v: to, duration: dur || 1.4, ease: 'power2.out', onStart: function () { el.textContent = fmt(0) }, onUpdate: function () { el.textContent = fmt(o.v) }, onComplete: function () { el.textContent = fmt(to) } });
  }
  function Pen(g, rot, sc) {
    var self = { x: 0, y: 0, r: rot || -30 };
    self.at = function (x, y, r) { self.x = x; self.y = y; if (r != null) self.r = r; g.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(' + self.r + ') scale(' + (sc || .55) + ')') };
    self.go = function (x, y, dur, lift, r) { var o = { t: 0 }, x0, y0, r0;
      return gsap.to(o, { t: 1, duration: dur, ease: 'power2.inOut', onStart: function () { x0 = self.x; y0 = self.y; r0 = self.r },
        onUpdate: function () { if (x0 == null) { x0 = self.x; y0 = self.y; r0 = self.r } var t = o.t, h = Math.sin(Math.PI * t) * (lift || 0);
          self.at(x0 + (x - x0) * t, y0 + (y - y0) * t - h, r == null ? r0 : r0 + (r - r0) * t) } }) };
    return self;
  }

  /* the hero: her window's shutters are closed at first; they rattle on the latch, swing open toward us with a settle,
     a few bougainvillea petals fall, and the play button arrives */
  (function () {
    var w = $('.iph.win'); if (!w) return;
    var L = $('.wn-sh.l', w), R = $('.wn-sh.r', w), play = $('.vplay', w), pets = $$('.wn-pet', w);
    gsap.set([L, R], { rotationY: 0 }); gsap.set(play, { opacity: 0, scale: .7 });
    document.documentElement.classList.remove('wn-wait');
    var tl = gsap.timeline({ delay: .45 });
    tl.to(L, { rotationY: -4, duration: .08, yoyo: true, repeat: 3, ease: 'sine.inOut' })
      .to(R, { rotationY: 4, duration: .08, yoyo: true, repeat: 3, ease: 'sine.inOut' }, '<.04')
      .to(L, { rotationY: -76, duration: 1.05, ease: 'back.out(1.3)' }, '+=.06')
      .to(R, { rotationY: 76, duration: 1.05, ease: 'back.out(1.3)' }, '<.09')
      .to(L, { rotationY: -72, duration: .5, ease: 'sine.inOut' }, '>-.2')
      .to(R, { rotationY: 72, duration: .5, ease: 'sine.inOut' }, '<.05')
      .to(play, { opacity: 1, scale: 1, duration: .55, ease: 'back.out(2)', clearProps: 'transform' }, 1.1);
    pets.forEach(function (p, i) {
      var x0 = 6 + i * 9, drift = 30 + i * 22, o = { t: 0 };
      tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: .2 }, .9 + i * .22)
        .to(o, { t: 1, duration: 2.6 + i * .3, ease: 'none', onUpdate: function () {
          var t = o.t; gsap.set(p, { x: x0 + drift * t + Math.sin(t * 7 + i) * 14, y: 10 + t * (150 + i * 40), rotation: t * 260 * (i % 2 ? -1 : 1) }) } }, '<')
        .to(p, { opacity: 0, duration: .5 }, '>-.5');
    });
  })();

  document.fonts.ready.then(function () {

    /* the hero's numbers count once */
    $$('.hero .stat b').forEach(function (b, i) {
      var t = b.textContent, m = t.match(/([\d.,]+)/); if (!m) return; var v = parseFloat(m[1].replace(/,/g, '')); if (!v) return;
      var dec = (m[1].split('.')[1] || '').length, pre = t.slice(0, m.index), suf = t.slice(m.index + m[1].length);
      count(b, v, 1.6, function (x) { return pre + (dec ? x.toFixed(dec) : Math.round(x).toLocaleString('en-US')) + suf }).delay(.5 + i * .15);
    });

    /* "a life left to enjoy it": her week fills in like a real calendar. Each morning gets its two-hour block, dragged
       out from 9 to 11; then the evenings and the weekend light up yellow, the sun comes out, and her note is written */
    (function () {
      var g = $('.gw'); if (!g) return;
      var evs = $$('.gw-ev', g), fr = $$('.gw-free', g), sun = $('.gw-sun', g), arw = $('.gw-arw', g), arh = $('.gw-arh', g), hand = $('.gw-hand', g);
      var tl = gsap.timeline();
      tl.from(g, { y: 60, rotation: 6, opacity: 0, duration: .9, ease: 'power3.out' })
        .from(evs, { scaleY: 0, duration: .42, ease: 'power2.out', stagger: .2 }, '+=.15')
        .from(evs, { opacity: 0, duration: .15, stagger: .2 }, '<')
        .from(fr[0], { scaleX: 0, duration: .8, ease: 'power2.inOut' }, '+=.15')
        .from(fr[1], { opacity: 0, duration: .5 }, '-=.25')
        .from(sun, { scale: 0, rotation: -120, duration: .8, ease: 'back.out(2)' }, '-=.3')
        .add(draw(arw, .6), '-=.2').add(draw(arh, .2))
        .fromTo(hand, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power1.inOut' }, '-=.5')
        .to(sun, { rotation: 20, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      when(g, tl, 'top 75%');
    })();

    /* "See you Tuesday": the Day 1 invite drops onto her photo, a cursor comes in and answers Yes, and Tuesday lights up */
    (function () {
      var g = $('.gi'); if (!g) return;
      var cur = $('.gi-cur', g), yes = $('.gi-y', g), t17 = $('.claim .tiles > div'), o = { t: 0 };
      var tl = gsap.timeline();
      tl.from(g, { y: -70, rotation: -9, opacity: 0, duration: .8, ease: 'back.out(1.5)' })
        .set(cur, { opacity: 1 }, '+=.2')
        .to(o, { t: 1, duration: .9, ease: 'power2.inOut', onUpdate: function () {
          var gr = g.getBoundingClientRect(), yr = yes.getBoundingClientRect(), t = o.t;
          var x1 = (yr.left - gr.left + yr.width * .5) / gr.width * 100, y1 = (yr.top - gr.top + yr.height * .55) / gr.height * 100;
          cur.style.left = (96 + (x1 - 96) * t) + '%'; cur.style.top = (104 + (y1 - 104) * t - Math.sin(Math.PI * t) * 10) + '%' } })
        .to(cur, { scale: .8, duration: .09, yoyo: true, repeat: 1, transformOrigin: '0 0' })
        .add(function () { yes.classList.add('on') }, '<.09')
        .fromTo(yes, { scale: 1 }, { scale: 1.12, duration: .16, yoyo: true, repeat: 1, ease: 'power1.out' }, '<')
        .to(cur, { opacity: 0, x: 18, y: 14, duration: .5 }, '+=.5');
      if (t17) tl.fromTo(t17, { scale: 1 }, { scale: 1.12, rotation: -4, duration: .22, yoyo: true, repeat: 1, ease: 'power2.out' }, '-=.4');
      when(g, tl, 'top 80%');
    })();

    /* the draw: once the five tickets have fanned out, the top one waits for a name and the draw's date is stamped on it */
    (function () {
      var st = $('#stay'), top = $('.tx-top'); if (!st || !top) return;
      var nm = $('.tx-name', top), sp = $('.tx-stamp', top), card = top.querySelector('svg');
      var tl = gsap.timeline({ delay: 1.1 });
      tl.fromTo(nm, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'power1.inOut' })
        .fromTo(sp, { scale: 2.2, opacity: 0, rotation: -40 }, { scale: 1, opacity: .92, rotation: -14, duration: .32, ease: 'power4.in' }, '+=.25')
        .fromTo(card, { y: 0 }, { y: 4, duration: .08, yoyo: true, repeat: 1, ease: 'power1.out' })
        .fromTo(sp, { scale: 1 }, { scale: 1.06, duration: .1, yoyo: true, repeat: 1 }, '<');
      when(st, tl, 'top 60%');
    })();

    /* ---------- the Day windows, as a real screen share ----------
       Ana's cursor travels to what she is talking about, her pink ink rings it, her camera lights up while she talks,
       then the deck moves to her next slide and the card behind becomes the one she just showed. */
    function rel(deck, el) { var d = deck.getBoundingClientRect(), r = el.getBoundingClientRect ? el.getBoundingClientRect() : el;
      return { x: (r.left - d.left) / d.width, y: (r.top - d.top) / d.height, w: r.width / d.width, h: r.height / d.height } }
    function curTo(cur, deck, el, dur, lift, ax, ay) { var o = { t: 0 }, x0, y0, x1, y1;
      return gsap.to(o, { t: 1, duration: dur || .7, ease: 'power2.inOut', onStart: function () {
          x0 = parseFloat(cur.style.left) || 94; y0 = parseFloat(cur.style.top) || 94;
          var r = rel(deck, el); x1 = (r.x + r.w * (ax == null ? .55 : ax)) * 100; y1 = (r.y + r.h * (ay == null ? .55 : ay)) * 100 },
        onUpdate: function () { var t = o.t, h = Math.sin(Math.PI * t) * (lift || 6);
          cur.style.left = (x0 + (x1 - x0) * t) + '%'; cur.style.top = (y0 + (y1 - y0) * t - h) + '%' } }) }
    function click(cur) { return gsap.fromTo(cur, { scale: 1 }, { scale: .82, duration: .09, yoyo: true, repeat: 1, transformOrigin: '0 0' }) }
    /* a hand-drawn loop around an element (or a box), built when it starts so it fits what is on screen */
    function ring(svg, target, pad, dur) { var o = { t: 0 }, path, L;
      return gsap.to(o, { t: 1, duration: dur || .8, ease: 'power1.inOut', onStart: function () {
          var slide = svg.parentNode, r = typeof target === 'function' ? target() : rel(slide, target), p = pad == null ? .02 : pad;
          var cx = (r.x + r.w / 2) * 160, cy = (r.y + r.h / 2) * 90, rx = (r.w / 2 + p) * 160, ry = (r.h / 2 + p * 1.6) * 90, pts = [];
          for (var i = 0; i <= 34; i++) { var a = -1.9 + i / 34 * 6.9, k = 1 + .06 * Math.sin(i * 1.7) + (i > 28 ? .05 : 0); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]) }
          path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', 'M' + pts.map(function (q) { return q[0].toFixed(2) + ' ' + q[1].toFixed(2) }).join(' L'));
          path.setAttribute('style', 'stroke-width:.8'); svg.appendChild(path);
          L = path.getTotalLength(); path.style.strokeDasharray = L + ' ' + (L + 2); path.style.strokeDashoffset = L },
        onUpdate: function () { if (path) path.style.strokeDashoffset = L * (1 - o.t) } }) }
    function underline(svg, target, dur) { var o = { t: 0 }, path, L;
      return gsap.to(o, { t: 1, duration: dur || .6, ease: 'power1.inOut', onStart: function () {
          var r = rel(svg.parentNode, target), x0 = r.x * 160, x1 = (r.x + r.w) * 160, y = (r.y + r.h) * 90 + 1.4;
          path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', 'M' + x0.toFixed(1) + ' ' + y.toFixed(1) + ' C' + (x0 + (x1 - x0) * .3).toFixed(1) + ' ' + (y + 1.2).toFixed(1) + ' ' + (x0 + (x1 - x0) * .7).toFixed(1) + ' ' + (y - .8).toFixed(1) + ' ' + x1.toFixed(1) + ' ' + (y + .4).toFixed(1));
          path.setAttribute('style', 'stroke-width:.8'); svg.appendChild(path);
          L = path.getTotalLength(); path.style.strokeDasharray = L + ' ' + (L + 2); path.style.strokeDashoffset = L },
        onUpdate: function () { if (path) path.style.strokeDashoffset = L * (1 - o.t) } }) }
    function talk(cam, on) { return function () { if (cam) cam.classList.toggle('talk', on) } }
    function advance(tl, at, A, B, back, prevSrc) {
      tl.to(A, { xPercent: -102, duration: .85, ease: 'power3.inOut' }, at)
        .to(B, { xPercent: 0, duration: .85, ease: 'power3.inOut' }, at)
        .add(function () { if (back) back.src = prevSrc }, at + .3)
        .fromTo(back, { rotation: 0, x: 0 }, { rotation: -3, x: -10, duration: .3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, at + .3);
    }
    function setupDay(id, cls) { var art = $(id); if (!art) return null; var deck = $('.cs-deck', art);
      var o = { art: art, deck: deck, A: $('.' + cls, deck), B: $('.csB', deck), cur: $('.cs-cur', deck), cam: $('.lv-cam', art), back: $('.lv-back', art) };
      gsap.set(o.B, { x: 0, xPercent: 102 }); gsap.set(o.cur, { opacity: 0 }); o.cur.style.left = '94%'; o.cur.style.top = '94%';
      o.inkA = $('.cs-ink', o.A); o.inkB = $('.cs-ink', o.B); return o }

    var D1 = setupDay('#art1', 'cs1');
    if (D1) { var A = D1.A, B = D1.B, c = D1.cur, k = $$('.c1-c', A), t1 = gsap.timeline({ delay: 1.1 });
      t1.add(talk(D1.cam, true), 0)
        .from($('.cs-h', A), { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power2.inOut' }, 0)
        .to(c, { opacity: 1, duration: .3 }, .4)
        .add(curTo(c, D1.deck, $('.c1-you', A), .8, 8), .45)
        .from($('.c1-you', A), { scale: .4, opacity: 0, duration: .55, ease: 'back.out(2)' }, .9)
        .add(ring(D1.inkA, $('.c1-you', A), .015), 1.3)
        .fromTo($('.c1-paths', A), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power1.inOut' }, 2)
        .add(curTo(c, D1.deck, k[0], .5, 6, .3, .5), 2.4).from(k[0], { scale: .5, opacity: 0, duration: .4, ease: 'back.out(2.2)' }, 2.75)
        .add(curTo(c, D1.deck, k[1], .45, 5, .3, .5), 3.05).from(k[1], { scale: .5, opacity: 0, duration: .4, ease: 'back.out(2.2)' }, 3.35)
        .add(curTo(c, D1.deck, k[2], .45, 5, .3, .5), 3.65).from(k[2], { scale: .5, opacity: 0, duration: .4, ease: 'back.out(2.2)' }, 3.95)
        .from($('.cs-lock', A), { y: 10, opacity: 0, duration: .4 }, 4.4);
      advance(t1, 5.6, A, B, D1.back, 'img/slides/day1b.webp');
      t1.from($('.cs-h', B), { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power2.inOut' }, 6.3)
        .add(draw($('.b1-ln', B), 1.4), 6.6)
        .add(curTo(c, D1.deck, $('.b1-n', B), .7, 8), 6.8)
        .add(count($('.b1-n', B), 2, 1.2), 7.3)
        .from($('.b1-d1', B), { scale: 0, transformOrigin: '50% 50%', duration: .35, ease: 'back.out(3)' }, 7.4)
        .from($('.b1-d2', B), { scale: 0, transformOrigin: '50% 50%', duration: .35, ease: 'back.out(3)' }, 7.9)
        .from($$('.b1-m i', B), { scaleX: 0, transformOrigin: '0 50%', duration: .4, stagger: .14 }, 6.9)
        .add(ring(D1.inkB, $('.b1-n', B), .02), 8.4)
        .from($('.b-note', B), { y: -50, rotation: -14, opacity: 0, duration: .7, ease: 'back.out(1.6)' }, 9)
        .add(curTo(c, D1.deck, $('.b-note', B), .6, 6, .5, .2), 9.1)
        .from($$('.b-note b', B), { scaleX: 0, transformOrigin: '0 50%', duration: .45, stagger: .16 }, 9.5)
        .from($('.cs-lock', B), { y: 10, opacity: 0, duration: .4 }, 10)
        .add(talk(D1.cam, false), 10.6).to(c, { opacity: 0, duration: .4 }, 10.6);
      when(D1.art, t1);
    }

    var D2 = setupDay('#art2', 'cs2');
    if (D2) { var A2 = D2.A, B2 = D2.B, c2 = D2.cur, li = $$('.b2-ls li', B2), t2 = gsap.timeline({ delay: 1.1 });
      t2.add(talk(D2.cam, true), 0)
        .from($('.cs-h', A2), { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power2.inOut' }, 0)
        .from($('.m1', A2), { y: 14, opacity: 0, duration: .45, ease: 'back.out(1.8)' }, .5)
        .to(c2, { opacity: 1, duration: .3 }, .6)
        .add(curTo(c2, D2.deck, $('.m1 p', A2), .7, 8, .9, .9), .7)
        .add(underline(D2.inkA, $('.m1 p', A2)), 1.3)
        .from($('.m2', A2), { y: 14, opacity: 0, duration: .45, ease: 'back.out(1.8)' }, 2)
        .from($$('.m2 .red i', A2), { scaleX: 0, transformOrigin: '0 50%', duration: .26, stagger: .2, ease: 'power2.out' }, 2.2)
        .add(curTo(c2, D2.deck, $('.m2 .red', A2), .6, 6, .2, .9), 2.2)
        .from($('.c2-fw', A2), { clipPath: 'inset(0 100% 0 0)', duration: .7, ease: 'none' }, 3.1)
        .from($('.m3', A2), { y: 14, opacity: 0, duration: .45, ease: 'back.out(1.8)' }, 3.8)
        .from($('.m3 .ok i', A2), { scale: 0, rotation: -90, duration: .5, ease: 'back.out(3)' }, 4)
        .add(curTo(c2, D2.deck, $('.m3 .ok', A2), .6, 6, .8, .8), 4)
        .add(ring(D2.inkA, $('.m3 .ok', A2), .012), 4.6)
        .from($('.cs-lock', A2), { y: 10, opacity: 0, duration: .4 }, 5.2);
      advance(t2, 6.3, A2, B2, D2.back, 'img/slides/day2a.webp');
      t2.from($('.cs-h', B2), { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power2.inOut' }, 7)
        .from($$('.b2-ls li b', B2), { scaleX: 0, transformOrigin: '0 50%', duration: .35, stagger: .1 }, 7.2)
        .add(curTo(c2, D2.deck, $('i', li[0]), .6, 8), 7.5).add(click(c2), 8.1).add(function () { li[0].classList.add('on') }, 8.15)
        .add(curTo(c2, D2.deck, $('i', li[1]), .35, 3), 8.4).add(click(c2), 8.75).add(function () { li[1].classList.add('on') }, 8.8)
        .add(curTo(c2, D2.deck, $('.b2-tr .kn', B2), .6, 6), 9.1)
        .fromTo($('.b2-tr .kn', B2), { left: '6%' }, { left: '92%', duration: 1.2, ease: 'power2.inOut' }, 9.8)
        .add(function () { var o = { t: 0 }, kn = $('.b2-tr .kn', B2); gsap.to(o, { t: 1, duration: 1.2, ease: 'power2.inOut', onUpdate: function () { var r = rel(D2.deck, kn); c2.style.left = (r.x + r.w * .55) * 100 + '%'; c2.style.top = (r.y + r.h * .55) * 100 + '%' } }) }, 9.8)
        .add(ring(D2.inkB, $('.b2-a b', B2), .012), 11.1)
        .from($('.cs-lock', B2), { y: 10, opacity: 0, duration: .4 }, 11.6)
        .add(talk(D2.cam, false), 12).to(c2, { opacity: 0, duration: .4 }, 12);
      if (D2.B) li.forEach(function () {});
      when(D2.art, t2);
    }

    var D3 = setupDay('#art3', 'cs3');
    if (D3) { var A3 = D3.A, B3 = D3.B, c3 = D3.cur, ar = $$('.c3-ar path', A3);
      var dots = $('.b3-dots', B3), h = '', on = [];
      for (var i = 0; i < 24 * 9; i++) { var cc = i % 24, rr = Math.floor(i / 24), dx = cc - 15.5, dy = (rr - 4) * 1.15; if (dx * dx + dy * dy < 11.5) on.push(i); h += '<i></i>' }
      dots.innerHTML = h; var di = $$('i', dots), hot = on.map(function (q) { return di[q] });
      function hotBox() { var d = B3.getBoundingClientRect(), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        hot.forEach(function (e) { var r = e.getBoundingClientRect(); x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom) });
        return { x: (x0 - d.left) / d.width, y: (y0 - d.top) / d.height, w: (x1 - x0) / d.width, h: (y1 - y0) / d.height } }
      var t3 = gsap.timeline({ delay: 1.1 });
      t3.add(talk(D3.cam, true), 0)
        .from($('.cs-h', A3), { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power2.inOut' }, 0)
        .from($('.c3-p.pa', A3), { y: 20, rotation: -8, opacity: 0, duration: .6, ease: 'back.out(1.6)' }, .4)
        .from($('.c3-p.pb', A3), { y: 20, rotation: 8, opacity: 0, duration: .6, ease: 'back.out(1.6)' }, .6)
        .to(c3, { opacity: 1, duration: .3 }, .8)
        .add(curTo(c3, D3.deck, $('.pa .c3-lk', A3), .7, 8), .9)
        .add(count($('.pa .n', A3), 771, 1.4), 1.3)
        .add(curTo(c3, D3.deck, $('.pa .c3-er b', A3), .5, 5), 2.7)
        .from($('.pa .c3-er b', A3), { scale: 1.8, opacity: 0, duration: .4, ease: 'back.out(2)' }, 3)
        .add(ring(D3.inkA, $('.pa .c3-er b', A3), .012), 3.3)
        .add(curTo(c3, D3.deck, $('.pb .c3-lk', A3), .7, 10), 4)
        .add(count($('.pb .n', A3), 82, 1), 4.3)
        .from($('.pb .c3-er b', A3), { scaleX: 0, transformOrigin: '0 50%', duration: .45 }, 5.2)
        .add(draw(ar[0], .8), 5.5).add(draw(ar[1], .25), 6.25)
        .from($('.c3-diff', A3), { clipPath: 'inset(0 100% 0 0)', duration: .8, ease: 'none' }, 6.3);
      advance(t3, 7.6, A3, B3, D3.back, 'img/slides/day3a.webp');
      t3.from($('.cs-h', B3), { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power2.inOut' }, 8.3)
        .from(di, { scale: 0, duration: .22, stagger: { each: .003, from: 'random' } }, 8.5)
        .add(function () { hot.forEach(function (d, q) { setTimeout(function () { d.classList.add('on') }, q * 16) }) }, 9.4)
        .add(curTo(c3, D3.deck, { getBoundingClientRect: function () { var b = hotBox(), d = D3.deck.getBoundingClientRect(); return { left: d.left + b.x * d.width, top: d.top + b.y * d.height, width: b.w * d.width, height: b.h * d.height } } }, .7, 8), 9.6)
        .add(ring(D3.inkB, hotBox, .015, 1), 10.3)
        .from($('.b-note', B3), { y: -50, rotation: 12, opacity: 0, duration: .7, ease: 'back.out(1.6)' }, 11.2)
        .from($$('.b-note b', B3), { scaleX: 0, transformOrigin: '0 50%', duration: .45, stagger: .16 }, 11.7)
        .from($('.cs-lock', B3), { y: 10, opacity: 0, duration: .4 }, 12.1)
        .add(talk(D3.cam, false), 12.6).to(c3, { opacity: 0, duration: .4 }, 12.6);
      when(D3.art, t3);
    }

    /* the wall of her slides settles in, one after another */
    var sw = $('.swall');
    if (sw) when(sw, gsap.timeline().from($$('.sw-g img', sw), { y: 26, opacity: 0, duration: .6, ease: 'power3.out', stagger: .08 }), 'top 80%');

    /* small lists, real results: the amounts count, then each list fills in dot by dot */
    var tg = $('.trio-g');
    if (tg) {
      var tr = gsap.timeline();
      $$('.trr', tg).forEach(function (c, i) {
        var n = $('.trr-n', c), txt = n.textContent, v = parseInt(txt.replace(/\D/g, ''), 10), plus = /\+$/.test(txt.trim());
        tr.add(count(n, v, 1.5, function (x) { return '$' + Math.round(x).toLocaleString('en-US') + (plus ? '+' : '') }), .2 + i * .15)
          .from($$('.trr-dots i', c), { scale: 0, duration: .2, stagger: { amount: 1.2 } }, .3 + i * .15);
      });
      when(tg, tr, 'top 70%');
    }

    /* bring the part you're stuck on: the attendee's draft on the laptop; the shared sheet arrives; Ana's pencil marks it */
    var rv = $('.rvp');
    if (rv) {
      var box = $('.rvp-sheet', rv), penG = $('.rv-pen', rv), pen = Pen(penG, -34, .55), n1 = $('.rv-n1', rv), n2 = $('.rv-n2', rv);
      var s1 = $('.rv-s1', rv), s2 = $('.rv-s2', rv), tk = $('.rv-tk', rv);
      var w1 = $('.rv-t1', rv).getComputedTextLength(), w2 = $('.rv-t2', rv).getComputedTextLength();
      n1.setAttribute('width', 0); n2.setAttribute('width', 0);
      [s1, s2, tk].forEach(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L + ' ' + (L + 2); p.style.strokeDashoffset = L });
      function write(clip, x0, base, ww, dur) { var o2 = { t: 0 };
        return gsap.to(o2, { t: 1, duration: dur, ease: 'none', onUpdate: function () { var x = o2.t * (ww + 30); clip.setAttribute('width', x.toFixed(1)); pen.at(x0 + x, base - 7 + Math.sin(o2.t * ww / 3.2) * 4) } }) }
      pen.at(360, 420);
      var tv = gsap.timeline();
      tv.from($('.dev', rv), { y: 34, opacity: 0, duration: 1, ease: 'power3.out' }, 0)
        .from($('.rvp-coffee', rv), { scale: .82, rotation: -40, opacity: 0, duration: 1, ease: 'back.out(1.5)' }, .15)
        .fromTo(box, { x: 120, y: 150, rotation: 16, scale: .55, opacity: 0 }, { opacity: 1, duration: .25 }, .7)
        .to(box, { x: 60, y: -40, rotation: 4, scale: .85, duration: .65, ease: 'power2.out' }, .7)
        .to(box, { x: 0, y: 0, rotation: -3, scale: 1, duration: .65, ease: 'power2.inOut' }, 1.35)
        .set(penG, { opacity: 1 }, 1.9)
        .add(pen.go(34, 85, .8, 40, -30), 1.9)
        .add(draw(s1, .75, pen), 2.75)
        .add(pen.go(34, 109, .25, 6), 3.5)
        .add(draw(s2, .35, pen), 3.75)
        .add(pen.go(36, 214, .45, 10), 4.15)
        .add(write(n1, 34, 220, w1, 1.1), 4.6)
        .add(pen.go(48, 242, .3, 8), 5.75)
        .add(write(n2, 44, 248, w2, .8), 6.05)
        .add(pen.go(168, 168, .45, 26), 6.9)
        .add(draw(tk, .35, pen, 'power2.in'), 7.35)
        .add(pen.go(380, -60, .8, 30, -60), 7.8)
        .from($('.rv-q', rv), { y: 24, scale: .9, opacity: 0, duration: .5, ease: 'back.out(1.8)' }, 3.2)
        .add(function () { gsap.to($('.rv-st i', rv), { scale: 1.6, duration: .5, yoyo: true, repeat: -1, ease: 'sine.inOut' }) }, 3.8);
      when(rv, tv);
    }

    /* your gift: the real calculator on a painted laptop; the camera moves in on the prices; the pencil rings one; a note asks */
    var gp = $('.gpaint');
    if (gp) {
      var cam = $('.gp-cam', gp), gr = $('.gp-ring', gp), L = gr.getTotalLength(); gr.style.strokeDasharray = L + ' ' + (L + 2); gr.style.strokeDashoffset = L;
      function look(rx, ry, rw) { var k = 1 / rw; return { scale: k, xPercent: -rx * k * 100, yPercent: -ry * k * 100 } }
      var tk = gsap.timeline(), og = { t: 0 };
      tk.from($('.dev', gp), { y: 40, rotation: -2, opacity: 0, duration: 1, ease: 'power3.out' }, 0)
        .to(cam, Object.assign({ duration: 1.6, ease: 'power2.inOut' }, look(.18, .3, .64)), 1)
        .to(og, { t: 1, duration: .9, ease: 'power1.inOut', onUpdate: function () { gr.style.strokeDashoffset = L * (1 - og.t) } }, 2.8)
        .from($('.gp-note', gp), { y: -70, rotation: -16, opacity: 0, duration: .8, ease: 'back.out(1.6)' }, 3.6)
        .from($('.gp-hand', gp), { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'none' }, 4.3)
        .from($('.gp-src', gp), { opacity: 0, y: 8, duration: .6 }, 4.6);
      when(gp, tk);
    }

    /* the closing card: what you get comes in item by item; the total lands last */
    var vs = $('.vstack');
    if (vs) when(vs, gsap.timeline().from($$('li', vs), { x: -14, opacity: 0, duration: .4, stagger: .12, ease: 'power2.out' }, 0).from($('.vtotal b'), { scale: .6, opacity: 0, duration: .5, ease: 'back.out(2.4)' }, .75), 'top 75%');

    ScrollTrigger.refresh();
  });
})();
