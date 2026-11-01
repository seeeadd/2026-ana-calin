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

  /* the Day 1-3 mechanism: the day being read is current, the ones before it are ticked, the next ones wait faded */
  (function () {
    var st = $$('.dm-s'), rows = $$('.days .drow'); if (!st.length || !rows.length || !('IntersectionObserver' in window)) return;
    function set(k) { st.forEach(function (e, i) { e.classList.toggle('done', i < k); e.classList.toggle('cur', i === k) }) }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) set(rows.indexOf(en.target)) }) }, { rootMargin: '-45% 0px -50% 0px' });
    rows.forEach(function (r) { io.observe(r) });
  })();

  /* the Day windows without motion: each shows its first slide, finished */
  if (!window.gsap || reduce) $$('.dk-f.a').forEach(function (f) { f.src = f.dataset.src + '?still=1' });

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

    /* host: then and now fills in row by row; the 2 gets her pink loop, then today's numbers count up */
    (function () {
      var c = $('.hrc'); if (!c) return;
      var ps = $$('p', c), ring = $('.hrc-2 path', c), tl = gsap.timeline();
      tl.from(c, { y: 50, rotation: -10, opacity: 0, duration: .8, ease: 'back.out(1.4)' });
      ps.forEach(function (p, i) {
        tl.from(p, { opacity: 0, x: -10, duration: .35, ease: 'power2.out' }, i ? '+=.12' : '-=.3');
        var b = $('b[data-to]', p);
        if (b) { var to = +b.dataset.to, dec = +(b.dataset.dec || 0), pre = b.dataset.pre || '', suf = b.dataset.suf || '';
          tl.add(count(b, to, 1.1, function (v) { return pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suf }), '<') }
        if (i === 1) tl.add(draw(ring, .55), '+=.05');
      });
      when(c, tl, 'top 80%');
    })();

    /* ---------- the Day windows: her deck (deck/s1-s6.html) plays as a live screen share ----------
       Each window holds two slides. The first plays when the window is in view while her camera lights up; then the
       deck pushes to the second slide and the fanned card behind becomes the one she just showed. */
    function playSlide(ifr) { var n = 0, iv = setInterval(function () { var w; try { w = ifr.contentWindow } catch (e) {}
      if (w && w.DECK && w.document.documentElement.dataset.ready === '1') { clearInterval(iv); w.DECK.play() } else if (++n > 80) clearInterval(iv) }, 120) }
    [['#art1', 8.6, 7.8], ['#art2', 6.9, 7.2], ['#art3', 7.3, 7.8]].forEach(function (d) {
      var art = $(d[0]); if (!art) return;
      var fa = $('.dk-f.a', art), fb = $('.dk-f.b', art), cam = $('.lv-cam', art), back = $('.lv-back', art); if (!fa || !fb) return;
      var prev = fa.dataset.src.replace('deck/', 'img/slides/').replace('.html', '.webp');
      gsap.set(fb, { x: 0, xPercent: 102 });
      ScrollTrigger.create({ trigger: art, start: 'top bottom+=700', once: true, onEnter: function () { fa.src = fa.dataset.src; fb.src = fb.dataset.src } });
      var tl = gsap.timeline({ delay: .5 });
      tl.add(function () { playSlide(fa); cam.classList.add('talk') }, 0)
        .to(fa, { xPercent: -102, duration: .85, ease: 'power3.inOut' }, d[1])
        .to(fb, { xPercent: 0, duration: .85, ease: 'power3.inOut' }, d[1])
        .add(function () { playSlide(fb) }, d[1] + .55)
        .add(function () { if (back) back.src = prev }, d[1] + .3)
        .fromTo(back, { rotation: 0, x: 0 }, { rotation: -3, x: -10, duration: .3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, d[1] + .3)
        .add(function () { cam.classList.remove('talk') }, d[1] + .55 + d[2]);
      when(art, tl);
    });

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
