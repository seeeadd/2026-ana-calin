/* The VIP page's motion (tools/paint/MOTION.md, PLAN-v5.md). Real animation, not things sliding in: a pencil writes,
   a note flies into a phone and becomes a message, clock hands sweep, paper folds into an envelope, an envelope drops
   into the mailbox, a sticky note slaps onto a calendar, petals fall from the bougainvillea. Each scene plays once
   when it comes into view, then only small idle loops continue. Reduced motion: every scene shows its last frame. */
(function () {
  if (!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin, MorphSVGPlugin);
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s) };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) };
  var rnd = function (a, b) { return a + Math.random() * (b - a) };

  function when(el, tl, start) {
    if (!el) return;
    if (reduce) { tl.progress(1).pause(); return }
    tl.pause();
    ScrollTrigger.create({ trigger: el, start: start || 'top 70%', once: true, onEnter: function () { tl.play() } });
  }
  /* a line drawn by hand: returns a tween that reveals the path and (optionally) keeps a pen on its tip */
  function draw(path, dur, pen, ease) {
    var L = path.getTotalLength(), o = { t: 0 };
    path.style.strokeDasharray = L + ' ' + (L + 2); path.style.strokeDashoffset = L;
    return gsap.to(o, { t: 1, duration: dur, ease: ease || 'power1.inOut', onUpdate: function () {
      path.style.strokeDashoffset = L * (1 - o.t);
      if (pen) { var p = path.getPointAtLength(L * o.t); pen.at(p.x, p.y) } } });
  }
  /* a pencil whose tip is its origin; moves on arcs between points */
  function Pen(g, rot, sc) {
    var self = { x: 0, y: 0, r: rot, s: sc };
    self.at = function (x, y, r) { self.x = x; self.y = y; if (r != null) self.r = r;
      g.setAttribute('transform', 'translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ') rotate(' + self.r.toFixed(2) + ') scale(' + self.s + ')') };
    self.go = function (x, y, dur, lift, r) { var o = { t: 0 }, x0, y0, r0;
      return gsap.to(o, { t: 1, duration: dur, ease: 'power2.inOut', onStart: function () { x0 = self.x; y0 = self.y; r0 = self.r },
        onUpdate: function () { if (x0 == null) { x0 = self.x; y0 = self.y; r0 = self.r } var t = o.t, h = Math.sin(Math.PI * t) * (lift || 0);
          self.at(x0 + (x - x0) * t, y0 + (y - y0) * t - h, r == null ? r0 : r0 + (r - r0) * t) } });
    };
    return self;
  }

  document.fonts.ready.then(function () {

    /* ---------- the header slims down as you scroll; the rail follows the items ---------- */
    var items = $$('.vi .it'), rail = $$('.rail span'), railLn = $('.rail-ln');
    function onScroll() {
      document.body.classList.toggle('scrolled', scrollY > 30);
      if (!rail.length) return;
      var vh = innerHeight, cur = -1, prog = 0;
      items.forEach(function (it, i) { var b = it.getBoundingClientRect(); if (b.top < vh * .55) { cur = i; prog = Math.min(1, Math.max(0, (vh * .55 - b.top) / b.height)) } });
      rail.forEach(function (r, i) { r.classList.toggle('on', i === cur); r.classList.toggle('done', i < cur) });
      if (railLn) railLn.style.setProperty('--rp', cur < 0 ? 0 : ((cur + prog) / items.length).toFixed(3));
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    /* ---------- under the spam note: a pencil arrow draws itself down to the offer; a tap scrolls there ---------- */
    var gv = $('.go-vip');
    if (gv) {
      var ta = gsap.timeline({ delay: reduce ? 0 : 1.4 });
      ta.add(draw($('.gv-l', gv), 1.1, null, 'power1.inOut'), 0).add(draw($('.gv-h', gv), .3, null, 'power1.out'), 1.05)
        .add(function () { if (!reduce) gsap.to(gv, { y: 7, duration: .9, ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: .3 }) });
      if (reduce) ta.progress(1);
      gv.addEventListener('click', function (e) { var t = document.getElementById('vsl'); if (!t) return; e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }) });
    }

    /* ---------- skimmable: each key line is swept with her yellow as it comes into view ---------- */
    var marks = $$('mark.sk');
    if (reduce || !('IntersectionObserver' in window)) marks.forEach(function (m) { m.classList.add('on') });
    else {
      var mo = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { var m = en.target; setTimeout(function () { m.classList.add('on') }, 200); mo.unobserve(m) } }) }, { rootMargin: '0px 0px -15% 0px' });
      marks.forEach(function (m) { mo.observe(m) });
    }

    /* ---------- hero: petals drift down from the bougainvillea once the door is open ---------- */
    var pet = $('.door .petals');
    if (pet && !reduce) {
      var NS = 'http://www.w3.org/2000/svg', cols = ['#E05A92', '#F07AAE', '#C2185B', '#F59BC1'];
      for (var i = 0; i < 16; i++) {
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', 'M0 0 C5 -7 14 -6 14 0 C14 6 5 7 0 0 Z'); p.setAttribute('fill', cols[i % 4]); p.setAttribute('opacity', '0'); pet.appendChild(p);
        (function (p, i) {
          var a = Math.PI * (1 - Math.pow(Math.random(), 1.3) * .5), sx = 505 + Math.cos(a) * 410, sy = 196 - Math.sin(a) * 150;
          var fall = rnd(260, 470), drift = rnd(-70, 90), d = rnd(7, 11);
          var tl = gsap.timeline({ repeat: -1, delay: 2.2 + i * rnd(.4, .8), repeatDelay: rnd(0, 3) });
          tl.set(p, { x: sx, y: sy, rotation: rnd(0, 360), scale: rnd(.7, 1.25), opacity: 0, svgOrigin: '7 0' })
            .to(p, { opacity: .95, duration: .5 }, 0)
            .to(p, { y: sy + fall, duration: d, ease: 'none' }, 0)
            .to(p, { x: sx + drift, duration: d, ease: 'sine.inOut' }, 0)
            .to(p, { rotation: '+=' + rnd(240, 560), duration: d, ease: 'none' }, 0)
            .to(p, { scaleX: .25, duration: .9, repeat: Math.round(d / 1.8), yoyo: true, ease: 'sine.inOut' }, 0)
            .to(p, { opacity: 0, duration: 1.4 }, d - 1.4);
        })(p, i);
      }
    }

    /* ---------- your week: the road draws through it; at each stop the paper changes ---------- */
    var trk = $('.trk');
    if (trk) {
      var tl = gsap.timeline(), roadB = $('.road b', trk);
      if (roadB) tl.fromTo(roadB, { scaleX: 0 }, { scaleX: 1, duration: 4.8, ease: 'none', transformOrigin: '0% 50%' }, 0);
      var c1 = $('.mv-c1', trk); if (c1) tl.add(draw(c1, .9, null, 'power2.inOut'), .3);
      var tag = $('.mv-tag', trk);
      if (tag) tl.fromTo(tag, { rotation: -75, opacity: 0, svgOrigin: '162 52' }, { rotation: 0, opacity: 1, duration: 1.8, ease: 'elastic.out(1,.32)', svgOrigin: '162 52' }, 1.15);
      var sh = $('.mv-sheet', trk), seal = $('.mv-seal', trk), env3 = $('.s3 .wkb > img', trk);
      if (sh) tl.fromTo(sh, { y: -46, opacity: 0 }, { y: -10, opacity: 1, duration: .45, ease: 'power2.out' }, 2.05)
        .to(sh, { scaleY: .5, svgOrigin: '122 72', duration: .3, ease: 'power2.in' }, 2.55)
        .to(sh, { y: 42, scaleY: .15, opacity: 0, duration: .35, ease: 'power2.in' }, 2.85);
      if (env3) tl.fromTo(env3, { scaleY: 1 }, { scaleY: .93, transformOrigin: '50% 100%', duration: .1, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 3.15);
      if (seal) tl.fromTo(seal, { scale: 0, svgOrigin: '118 112' }, { scale: 1, duration: .5, ease: 'back.out(3)', svgOrigin: '118 112' }, 3.25);
      $$('.mv-r1, .mv-r2, .mv-r3, .mv-r4', trk).forEach(function (r, i) { tl.add(draw(r, i ? .3 : .6, null, 'power1.inOut'), 3.4 + (i ? .6 + i * .28 : 0)) });
      var env = $('.mv-env', trk), box = $('.mv-box', trk), l1 = $('.mv-l1', trk), l2 = $('.mv-l2', trk);
      if (env) tl.fromTo(env, { x: -30, y: -95, rotation: -28, opacity: 0, svgOrigin: '120 70' }, { opacity: 1, duration: .2 }, 4.6)
        .to(env, { motionPath: { path: [{ x: -30, y: -95 }, { x: -6, y: -60 }, { x: 0, y: -26 }], curviness: 1.2 }, rotation: 0, duration: .7, ease: 'power2.inOut' }, 4.6)
        .to(env, { y: 70, duration: .35, ease: 'power3.in' }, 5.35);
      if (box) tl.to(box, { scaleY: .94, scaleX: 1.03, transformOrigin: '50% 100%', duration: .1, ease: 'power1.out' }, 5.65)
        .to(box, { scaleY: 1, scaleX: 1, duration: .8, ease: 'elastic.out(1,.35)' }, 5.75);
      if (l1) tl.fromTo(l1, { x: 0, y: 4, scale: .3, opacity: 0, rotation: 0, svgOrigin: '120 88' }, { x: 92, y: -50, scale: 1, opacity: 1, rotation: 14, duration: .8, ease: 'back.out(1.7)', svgOrigin: '120 88' }, 6.0);
      if (l2) tl.fromTo(l2, { x: 0, y: 4, scale: .3, opacity: 0, rotation: 0, svgOrigin: '120 88' }, { x: -98, y: 30, scale: 1, opacity: 1, rotation: -10, duration: .85, ease: 'back.out(1.7)', svgOrigin: '120 88' }, 6.25);
      tl.add(function () { if (reduce) return;
        if (l1) gsap.to(l1, { y: '-=4', rotation: '+=3', duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        if (l2) gsap.to(l2, { y: '-=3', rotation: '-=2', duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: .4 });
        if (tag) gsap.to(tag, { rotation: 4, svgOrigin: '162 52', duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });
      when(trk, tl, 'top 75%');
    }

    /* ---------- Nº 01: the submission slides out of the stack; Ana's red pencil marks it ---------- */
    var rv = $('.art.mv.rv');
    if (rv) {
      var box1 = $('.mv-sheetbox', rv), penG = $('.mv-pen', rv), pen = Pen(penG, -34, .55);
      var s1 = $('.mv-s1', rv), s2 = $('.mv-s2', rv), tick = $('.mv-tick', rv), n1 = $('.mv-n1', rv), n2 = $('.mv-n2', rv);
      var w1 = $('.mv-t1', rv).getComputedTextLength(), w2 = $('.mv-t2', rv).getComputedTextLength();
      pen.at(360, 420); gsap.set(penG, { opacity: 0 });
      [s1, s2, tick].forEach(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L + ' ' + (L + 2); p.style.strokeDashoffset = L });
      function write(clip, x0, base, w, dur) { var o = { t: 0 };
        return gsap.to(o, { t: 1, duration: dur, ease: 'none', onUpdate: function () { var x = o.t * (w + 12);
          clip.setAttribute('width', x.toFixed(1)); pen.at(x0 + x, base - 7 + Math.sin(o.t * w / 3.2) * 4) } }) }
      var t1 = gsap.timeline();
      t1.from($('.l1', rv), { y: 34, opacity: 0, duration: 1, ease: 'power3.out' }, 0)
        .fromTo(box1, { x: 120, y: 150, rotation: 16, scale: .55, opacity: 0 }, { opacity: 1, duration: .25 }, .7)
        .to(box1, { motionPath: { path: [{ x: 120, y: 150 }, { x: 60, y: -40 }, { x: 0, y: 0 }], curviness: 1.3 }, rotation: -3, scale: 1, duration: 1.3, ease: 'power3.inOut' }, .7)
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
        .add(draw(tick, .35, pen, 'power2.in'), 7.35)
        .add(pen.go(380, -60, .8, 30, -60), 7.8)
        ;
      when(rv, t1);

      /* the live Q&A, as Zoom shows it: Claire's question is being answered live; you type yours and send it;
         the list moves up; Ana starts answering yours live */
      var qa = $('.qa', rv);
      if (qa) {
        var tq = gsap.timeline(), q3 = $('.q3', qa), me = $('.q4', qa), ta = $('.qa-ta', qa), ty = $('.qa-ty', qa), ph = $('.qa-ph', qa), send = $('.qa-send', qa);
        var line = 'Can I start selling before my offer is finished?', typed = { n: 0 };
        gsap.set(me, { height: 0, paddingTop: 0, paddingBottom: 0, opacity: 0 });
        var cnt = $('.qa-cnt', qa); if (cnt && !reduce) cnt.textContent = '3';
        tq.from(qa, { x: 40, y: -10, opacity: 0, duration: .9, ease: 'power3.out' }, .3)
          .to($('.a1 svg', q3), { scale: 1.25, duration: .4, yoyo: true, repeat: 3, ease: 'sine.inOut', transformOrigin: '50% 50%' }, 1)
          .to($('.a1', q3), { opacity: 0, duration: .2 }, 2.6)
          .to($('.a2', q3), { opacity: 1, duration: .3 }, 2.65)
          .add(function () { ta.classList.add('on'); ph.style.opacity = 0 }, 3.1)
          .to(typed, { n: line.length, duration: 2.1, ease: 'none', onUpdate: function () { ty.textContent = line.slice(0, Math.round(typed.n)); send.classList.toggle('on', typed.n > 0) } }, 3.3)
          .to(send, { scale: .9, duration: .1, yoyo: true, repeat: 1 }, 5.7)
          .add(function () { ty.textContent = ''; ph.style.opacity = 1; ta.classList.remove('on'); send.classList.remove('on'); if (cnt) cnt.textContent = '4' }, 5.9)
          .to(me, { height: 'auto', paddingTop: '1.7cqw', paddingBottom: '1.5cqw', opacity: 1, duration: .55, ease: 'power2.out' }, 5.9)
          .to($('.a1', me), { opacity: 1, duration: .3 }, 6.9)
          .add(function () { if (!reduce) gsap.to($('.a1 svg', me), { scale: 1.25, duration: .5, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 50%' }) }, 7);
        when(rv, tq);
      }
    }

    /* ---------- Nº 02: the line you're stuck on lifts off your draft and becomes a message to Ana ---------- */
    var wa = $('.art.mv.wa2');
    if (wa) {
      var strip = $('.mv-strip', wa), stripS = $('.mv-strip-s', wa), stripL = $('.mv-strip-l', wa), voice = $('.mv-voice', wa);
      var bars = $$('.mv-bar', wa), clocks = $$('.mv-clock', wa), sun = $('.mv-sun', wa), rays = $('.mv-rays', wa);
      gsap.set(strip, { x: 60, y: 108, opacity: 0 }); gsap.set(voice, { opacity: 0 });
      $$('.mv-wedge', wa).forEach(function (w) { var L = w.getTotalLength(); w.style.strokeDasharray = L + ' ' + L; w.style.strokeDashoffset = L });
      var t2 = gsap.timeline();
      t2.from($('.l2', wa), { y: 34, opacity: 0, duration: 1, ease: 'power3.out' }, 0)
        .from($('.ph', wa), { x: -70, y: 90, rotation: -18, opacity: 0, duration: 1.3, ease: 'power3.out' }, .35)
        .fromTo($('.mv-hl', wa), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: .7, ease: 'power2.inOut' }, 1.3)
        .set(strip, { opacity: 1 }, 2.05)
        .to(strip, { scale: 1.1, y: 96, duration: .35, ease: 'power2.out', transformOrigin: '0% 0%' }, 2.05)
        .to(strip, { motionPath: { path: [{ x: 60, y: 96 }, { x: 250, y: -4 }, { x: 452, y: 258 }], curviness: 1.3 }, scale: 1, duration: 1.25, ease: 'power2.inOut' }, 2.4)
        .to(stripS, { morphSVG: 'M8 0 H92 C96 0 100 4 100 8 V16 C100 20 96 24 92 24 H8 L0 28 L2 18 V8 C2 4 4 0 8 0 Z', fill: '#D9FDD3', duration: 1.25, ease: 'power2.inOut' }, 2.4)
        .to(stripL, { scaleX: .66, y: 4, transformOrigin: '0% 50%', duration: 1.25, ease: 'power2.inOut' }, 2.4)
        .to($('.mv-chat', wa), { y: -40, duration: .6, ease: 'power2.inOut' }, 3.5)
        .to(strip, { y: 218, duration: .6, ease: 'power2.inOut' }, 3.5)
        .fromTo(voice, { y: 16, opacity: 0 }, { y: -6, opacity: 1, duration: .6, ease: 'back.out(2)' }, 4.0);
      clocks.forEach(function (c, i) {
        var w = $('.mv-wedge', c), h = $('.mv-hand', c), cx = +$('circle', c).getAttribute('cx'), L = w.getTotalLength(), o = { t: 0 };
        t2.from(c, { scale: .6, opacity: 0, svgOrigin: cx + ' 402', duration: .5, ease: 'back.out(2)' }, 1.0 + i * .12)
          .to(o, { t: 1, duration: 1.1, ease: 'power1.inOut', onUpdate: function () { w.style.strokeDashoffset = L * (1 - o.t * .5); h.setAttribute('transform', 'rotate(' + (o.t * 180).toFixed(1) + ' ' + cx + ' 402)') } }, 4.6 + i * 1.0);
      });
      if (sun) t2.from(sun, { y: '+=56', duration: 1.6, ease: 'power2.out' }, 7.5);
      t2.add(function () { if (reduce) return;
        gsap.to(bars, { scaleY: function () { return rnd(.35, 1.4) }, transformOrigin: '50% 50%', duration: .28, repeat: -1, yoyo: true, repeatRefresh: true, stagger: { each: .05, from: 'random' }, ease: 'sine.inOut' });
        if (rays) gsap.to(rays, { rotation: 360, svgOrigin: '0 0', duration: 40, repeat: -1, ease: 'none' });
      });
      when(wa, t2);
    }

    /* ---------- Nº 03: her Sprint mock-up behind; the real lesson comes forward; the camera reads the screen ---------- */
    var sp = $('.art.mv.spr');
    if (sp) {
      var t3 = gsap.timeline(), ring = $('.spr-ring', sp), cam = $('.spr-cam', sp);
      /* a region of the screen (fractions of the screenshot): where it starts and how wide it is */
      function look(rx, ry, rw) { var k = 1 / rw; return { scale: k, xPercent: -rx * k * 100, yPercent: -ry * k * 100 } }
      t3.from($('.spr-mock', sp), { y: 30, rotation: 4, opacity: 0, duration: 1, ease: 'power3.out' }, 0)
        .from($('.l3', sp), { y: 110, rotation: -3, scale: .92, opacity: 0, duration: 1.1, ease: 'back.out(1.25)' }, .45)
        .from($('.src', sp), { opacity: 0, y: 8, duration: .6 }, 1.2);
      if (cam && !reduce) {
        var cl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true, defaults: { duration: 1.5, ease: 'power2.inOut' } });
        cl.to(cam, look(.34, .075, .55), 0)                      // the lesson: its title and the "Will it sell?" test
          .to(cam, look(0, .3, .33), '+=3.2')                   // the course outline, this lesson highlighted
          .to(cam, look(0, 0, 1), '+=2.8');                      // the whole screen again
        t3.add(function () { cl.play(0) }, 2.2);
        if (ring) t3.add(draw(ring, .9, null, 'power1.inOut'), 3.8);
      } else if (ring) t3.add(draw(ring, .9, null, 'power1.inOut'), 1.6);
      when(sp, t3);
    }

    /* ---------- Nº 02: Ana opens her 30 minutes; you ask; she's typing; her answer quotes you ---------- */
    var wac = $('.wac');
    if (wac) {
      var mm = function (c) { return $('.' + c, wac) }, dots = $('.dots', wac), s0 = $('.s0', wac), s1 = $('.s1', wac);
      var pop = { opacity: 1, y: 0, scale: 1, duration: .4, ease: 'back.out(1.7)' };
      gsap.set(['m1', 'm2', 'm3', 'm4', 'm5'].map(mm), { opacity: 0, y: 12, scale: .95 });
      gsap.set(dots, { opacity: 0, scale: .9, transformOrigin: '0% 0%' });
      var tc = gsap.timeline();
      tc.to(mm('m1'), Object.assign({ transformOrigin: '100% 100%' }, pop), .4)
        .to(mm('m2'), Object.assign({ transformOrigin: '100% 100%' }, pop), 1.1)
        .add(function () { mm('m1').classList.add('read'); mm('m2').classList.add('read') }, 1.9)
        .to(s0, { opacity: 0, y: -8, duration: .25 }, 2.1)
        .fromTo(s1, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .25 }, 2.15)
        .to(dots, { opacity: 1, scale: 1, duration: .3, ease: 'back.out(2)' }, 2.3)
        .to($$('i', dots), { y: -4, duration: .28, ease: 'sine.inOut', yoyo: true, repeat: 7, stagger: .14 }, 2.4)
        .to(dots, { opacity: 0, scale: .9, duration: .15 }, 4.7)
        .to(mm('m3'), Object.assign({ transformOrigin: '0% 0%' }, pop), 4.75)
        .to(mm('m4'), Object.assign({ transformOrigin: '0% 0%' }, pop), 5.5)
        .to(s1, { opacity: 0, y: -8, duration: .25 }, 5.7)
        .fromTo(s0, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .25 }, 5.75)
        .to(mm('m5'), Object.assign({ transformOrigin: '100% 100%' }, pop), 7)
        .add(function () { mm('m5').classList.add('read') }, 7.8);
      when(wac, tc, 'top 78%');
    }

    /* ---------- Nº 04: "access expires: never", written in by hand ---------- */
    var ex = $('.exp');
    if (ex) {
      var exw = $('.exp-v em', ex), exu = $('.exp-v path', ex), te = gsap.timeline();
      gsap.set(exw, { clipPath: 'inset(0% 100% 0% 0%)' });
      te.to(exw, { clipPath: 'inset(0% 0% 0% 0%)', duration: .9, ease: 'none' }, .5)
        .add(draw(exu, .45, null, 'power2.out'), 1.4);
      when(ex, te, 'top 85%');
    }

    /* ---------- Nº 04: a meeting runs late; the note slaps onto Wednesday; the recording plays ---------- */
    var rc = $('.art.mv.rec');
    if (rc) {
      var stk = $('.mv-sticky', rc), plan = $('.mv-plan', rc), play = $('.mv-play', rc), rip = $('.mv-ripple', rc), icon = $('.mv-icon', rc);
      gsap.set(play, { opacity: 0 });
      var t4 = gsap.timeline();
      t4.from(plan, { y: 30, rotation: -4, opacity: 0, duration: 1, ease: 'power3.out' }, 0)
        .fromTo(stk, { x: -40, y: -200, rotation: -38, scale: 1.4, opacity: 0 }, { opacity: 1, duration: .15 }, .9)
        .to(stk, { x: 0, y: 0, rotation: 2, scale: 1, duration: .6, ease: 'power2.in' }, .9)
        .to(stk, { scaleY: .8, scaleX: 1.14, transformOrigin: '50% 90%', duration: .08, ease: 'power1.out' }, 1.5)
        .to(stk, { scaleY: 1, scaleX: 1, rotation: 0, duration: .9, ease: 'elastic.out(1,.35)' }, 1.58)
        .to(plan, { y: 4, duration: .08, yoyo: true, repeat: 1 }, 1.5)
        .from($('.l4', rc), { x: 60, opacity: 0, duration: 1, ease: 'power3.out' }, 1.9)
        .fromTo(play, { scale: 0, opacity: 1, svgOrigin: '408 330' }, { scale: 1, duration: .5, ease: 'back.out(2.2)', svgOrigin: '408 330' }, 2.7)
        .to(play, { scale: .84, duration: .12, yoyo: true, repeat: 1, svgOrigin: '408 330' }, 3.4)
        .fromTo(rip, { attr: { r: 26 }, opacity: .8 }, { attr: { r: 78 }, opacity: 0, duration: .9, ease: 'power2.out' }, 3.45)
        .to(icon, { morphSVG: 'M-11 -12 H-3 V12 H-11 Z M3 -12 H11 V12 H3 Z', duration: .3, ease: 'power2.inOut' }, 3.5)
        .to(play, { opacity: 0, scale: .7, duration: .5, ease: 'power2.in', svgOrigin: '408 330' }, 4.2);
      t4.add(function () { if (reduce) return;
        gsap.fromTo($('.mv-prog', rc), { width: '6%' }, { width: '100%', duration: 22, ease: 'none', repeat: -1 });
        gsap.to($('.mv-slide', rc), { scale: 1.08, xPercent: -2, duration: 14, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.fromTo($('.replay .ring', rc), { scale: 1, opacity: .7 }, { scale: 1.6, opacity: 0, duration: 1.4, repeat: -1, ease: 'power1.out' });
      }, 3.6);
      when(rc, t4);
    }

    /* ---------- fit check: your chair comes a little closer to Ana's table ---------- */
    var you = $('.seat.two .you');
    if (you) {
      /* it waits away from the table until the card is well in view, then scoots over, bumps closer and settles;
         scroll back up past it and it moves away again, so it plays every time you come down */
      gsap.set(you, { x: 0 });
      var tch = gsap.timeline({ paused: true });
      tch.fromTo(you, { xPercent: -24, rotation: -7 }, { xPercent: -5, rotation: 2, duration: .75, ease: 'power2.in', immediateRender: true })
        .to(you, { xPercent: 5, rotation: -1.5, duration: .3, ease: 'power2.out' })
        .to(you, { xPercent: 3, rotation: 0, duration: .7, ease: 'elastic.out(1,.45)' });
      if (reduce) tch.progress(1);
      else ScrollTrigger.create({ trigger: you, start: 'top 62%', onEnter: function () { tch.play(0) }, onLeaveBack: function () { tch.pause(0) } });
    }

    /* ---------- her letter rises out of the envelope; the seal presses on ---------- */
    var lw = $('.lw');
    if (lw) {
      var t6 = gsap.timeline();
      t6.fromTo($('.letter', lw), { y: 110, rotation: -5 }, { y: 0, rotation: -1.2, duration: 1.4, ease: 'back.out(1.2)' }, 0)
        .fromTo($('.seal', lw), { scale: 2.2, opacity: 0, rotation: -50 }, { scale: 1, opacity: 1, rotation: -12, duration: .45, ease: 'back.out(2.4)' }, 1.1)
        .to($('.seal', lw), { scaleY: .86, scaleX: 1.1, duration: .07, yoyo: true, repeat: 1 }, 1.55);
      when(lw, t6, 'top 75%');
    }
    ScrollTrigger.refresh();
  });
})();
