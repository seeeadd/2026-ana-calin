/* The registration page, Nov 1: the VIP page's motion added on top of the page's own (tools/paint/PLAN-registration.md).
   Her teaser slides play inside the Day windows, a pencil marks a draft reviewed live, the calculator gives its real
   numbers, each small list is drawn as dots, the key lines are swept in yellow. Each plays when it can be seen and
   only after its own block has faded in; reduced motion shows every final state. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s) };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) };

  /* small lists, made countable: one dot per reader (built even without motion) */
  $$('.trr-cash').forEach(function (d) { var n = +d.dataset.bills, h = ''; for (var i = 0; i < n; i++) h += '<i style="--r:' + (((i * 37) % 9) - 4) * .7 + 'deg"></i>'; d.innerHTML = h });

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

  /* I'm Ana: the sunflower behind her photo is sized to the room around it, so its petals never reach the text */
  (function () {
    var sf = $('.hst-pic .bk-sf'), fig = $('.hst-pic figure'); if (!sf || !fig) return;
    function fit() { sf.style.width = ''; var f = fig.getBoundingClientRect(), cx = f.left + f.width / 2, cy = f.top + f.height * .5, want = f.width * .76, room = 1e9;
      $$('.hst-tx p, .hst-tx h2, .hst-tx .cta2').forEach(function (e) { var r = e.getBoundingClientRect(); if (!r.width) return;
        var dx = Math.max(r.left - cx, 0, cx - r.right), dy = Math.max(r.top - cy, 0, cy - r.bottom); room = Math.min(room, Math.hypot(dx, dy)) });
      var R = Math.max(f.width * .52, Math.min(want, room - 18)); sf.style.width = (2 * R / .97) + 'px';
      sf.style.opacity = R < f.width * .56 ? '0' : '' }
    fit(); addEventListener('resize', fit); if (document.fonts) document.fonts.ready.then(fit);
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

  document.fonts.ready.then(function () {

    /* the hero's numbers count once */
    $$('.hero .stat b').forEach(function (b, i) {
      var t = b.textContent, m = t.match(/([\d.,]+)/); if (!m) return; var v = parseFloat(m[1].replace(/,/g, '')); if (!v) return;
      var dec = (m[1].split('.')[1] || '').length, pre = t.slice(0, m.index), suf = t.slice(m.index + m[1].length);
      count(b, v, 1.6, function (x) { return pre + (dec ? x.toFixed(dec) : Math.round(x).toLocaleString('en-US')) + suf }).delay(.5 + i * .15);
    });

    /* "a life left to enjoy it": the workshop week fills in like a real calendar. The three live sessions drop in on
       Tue to Thu at noon; then the evenings and the weekend light up yellow, the sun comes out, and the note is tied on */
    (function () {
      var g = $('.gw'); if (!g) return;
      var evs = $$('.gw-ev', g), fr = $$('.gw-free', g), sun = $('.gw-sun', g), arw = $('.gw-mk', g), arh = $('.gw-arh', g), hand = $('.gw-hand', g);
      var tl = gsap.timeline();
      tl.from(g, { y: 60, rotation: 6, opacity: 0, duration: .9, ease: 'power3.out' })
        .from(evs, { scaleY: 0, duration: .42, ease: 'power2.out', stagger: .2 }, '+=.15')
        .from(evs, { opacity: 0, duration: .15, stagger: .2 }, '<')
        .from(fr[0], { scaleX: 0, duration: .8, ease: 'power2.inOut' }, '+=.15')
        .from(fr[1], { opacity: 0, duration: .5 }, '-=.25')
        .from(sun, { scale: 0, rotation: -120, duration: .8, ease: 'back.out(2)' }, '-=.3')
        .fromTo(hand, { y: -14, rotation: -12, opacity: 0 }, { y: 0, rotation: -3, opacity: 1, duration: .55, ease: 'back.out(2)' }, '-=.2')
        .add(draw(arw, .9, null, 'power1.inOut'), '-=.1').fromTo(arh, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .3, ease: 'back.out(3)' })
        .to(sun, { rotation: 20, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      when(g, tl, 'top 75%');
      /* money flows: each note or coin lifts off a session block and drifts toward the evenings and the weekend */
      var ms = $$('.gw-m', g), cols = $('.gw-cols', g), flow = gsap.timeline({ paused: true, repeat: -1 });
      ms.forEach(function (m, k) {
        var day = [1, 2, 3][k % 3], x0 = (day + .5) / 7, y0 = 4.75 / 12, x1 = .62 + ((k * 37) % 30) / 100, y1 = .55 + ((k * 53) % 35) / 100, o = { t: 0 }, at = k * .55;
        flow.fromTo(o, { t: 0 }, { t: 1, duration: 3.2, ease: 'sine.inOut', immediateRender: false, onUpdate: function () {
            var t = o.t, W = cols.offsetWidth, H = cols.offsetHeight, x = (x0 + (x1 - x0) * t) * W + Math.sin(t * 9 + k) * 10, y = (y0 + (y1 - y0) * t) * H - Math.sin(Math.PI * t) * H * .18;
            gsap.set(m, { x: x, y: y, rotation: Math.sin(t * 6 + k) * 30 + t * 40, opacity: t < .12 ? t / .12 : t > .8 ? (1 - t) / .2 : 1 }) } }, at);
      });
      ScrollTrigger.create({ trigger: g, start: 'top bottom', end: 'bottom top', onToggle: function (st) { if (st.isActive && tl.time() > 3.4) flow.play(); else flow.pause() } });
      tl.add(function () { flow.play() }, 3.4);
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
      /* her call rings (the phone buzzes twice), Accept is pressed, and the call opens on her face; the timer runs */
      var call = $('#call');
      if (call) {
        var ct = $('.call-t', call), ctl = gsap.timeline({ delay: .4 }), sec = { v: 1 };
        ctl.fromTo(call, { y: 40, rotation: 14, opacity: 0 }, { y: 0, rotation: 5, opacity: 1, duration: .7, ease: 'back.out(1.5)' })
          .to(call, { keyframes: { rotation: [7, 3, 7, 3, 6, 4, 5] }, duration: .55, ease: 'none' }, '+=.2')
          .to(call, { keyframes: { rotation: [7, 3, 7, 3, 6, 4, 5] }, duration: .55, ease: 'none' }, '+=.35')
          .to($('.cb.yes i', call), { scale: .8, duration: .12, yoyo: true, repeat: 1, ease: 'power2.out' }, '+=.3')
          .to($('.call-in', call), { opacity: 0, scale: 1.06, duration: .45, ease: 'power2.in' }, '>-.05')
          .fromTo($('.call-on', call), { opacity: 0, scale: .94 }, { opacity: 1, scale: 1, duration: .5, ease: 'power2.out' }, '<.2')
          .fromTo($('.call-me', call), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease: 'back.out(1.6)' }, '>-.1')
          .to(sec, { v: 14, duration: 13, ease: 'none', onUpdate: function () { ct.textContent = '0:' + String(Math.floor(sec.v)).padStart(2, '0') } }, '<');
        when(st, ctl, 'top 60%');
      }
    })();

    /* host: the overview card: the scorecards come up one by one, today's numbers count, the 2 gets her loop, and the
       line draws from the first workshop to now */
    (function () {
      var c = $('.hrc.gads'); if (!c) return;
      var cards = $$('.ga-c', c), ring = $('.hrc-2 path', c), tl = gsap.timeline();
      tl.from(c, { y: 40, opacity: 0, duration: .7, ease: 'power3.out' })
        .from(cards, { y: 10, opacity: 0, duration: .35, stagger: .1, ease: 'power2.out' }, '-=.3');
      cards.forEach(function (cd, i) { var b = $('b[data-to]', cd); if (!b) return; var to = +b.dataset.to, dec = +(b.dataset.dec || 0), pre = b.dataset.pre || '', suf = b.dataset.suf || '';
        tl.add(count(b, to, 1.1, function (v) { return pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suf }), .5 + i * .12) });
      if (ring) tl.add(draw(ring, .5), .9);
      tl.fromTo($('.ga-ch', c), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 -2% 0 0)', duration: 1.3, ease: 'power2.inOut' }, 1.1);
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
        var bills = $$('.trr-cash i', c), per = v / Math.max(1, bills.length), at = .25 + i * .35, step = Math.min(.06, 1.7 / bills.length);
        n.textContent = '$0';
        bills.forEach(function (b, k) {   /* each note is flicked down onto the pile, and the amount moves on by $100 */
          tr.fromTo(b, { y: -16, x: 6, rotation: -24, scale: 1.25, opacity: 0 }, { y: 0, x: 0, rotation: (((k * 37) % 9) - 4) * .7, scale: 1, opacity: 1, duration: .28, ease: 'back.out(2)', immediateRender: true }, at + k * step)
            .add(function () { n.textContent = '$' + Math.round(Math.min(v, (k + 1) * per)).toLocaleString('en-US') + (plus && k === bills.length - 1 ? '+' : '') }, at + k * step + .12);
        });
        tr.fromTo(n, { scale: 1 }, { scale: 1.12, duration: .16, yoyo: true, repeat: 1, ease: 'power2.out' }, at + bills.length * step + .15);
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
      var cam = $('.gp-cam', gp), doc = $('.gp-doc', gp), gr = $('.gp-ring', gp), lock = $('.gp-lock', gp), L = gr.getTotalLength(); gr.style.strokeDasharray = L + ' ' + (L + 2); gr.style.strokeDashoffset = L;
      /* the camera on her calculator (doc units: the image is 1080 wide): xf = left edge as a share of the width,
         yd = top edge in doc units, wf = how much of the width fills the screen */
      function frame(xf, yd, wf) { return { scale: function () { return 1 / wf }, x: function () { return -xf * cam.offsetWidth / wf }, y: function () { return -yd * (cam.offsetWidth / 1080) / wf } } }
      gsap.set(doc, { transformOrigin: '0 0' });
      var fl = $$('.gp-flow path', gp); fl.forEach(function (q) { var l = q.getTotalLength(); q.style.strokeDasharray = l + ' ' + (l + 2); q.style.strokeDashoffset = l });
      var tk = gsap.timeline(), og = { t: 0 };
      tk.from($('.dev', gp), { y: 40, rotation: -2, opacity: 0, duration: .9, ease: 'power3.out' }, 0)
        .fromTo($('.gp-logo', gp), { scale: 1.8, rotation: -40, opacity: 0 }, { scale: 1, rotation: -10, opacity: 1, duration: .5, ease: 'back.out(2.2)', immediateRender: false }, .7)
        .to($('.gp-logo', gp), { rotation: -6, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 1.3)
        .fromTo(doc, Object.assign({ scale: 1, x: 0, y: 0 }), Object.assign({ duration: 1.2, ease: 'power2.inOut', immediateRender: false }, frame(0, 230, 1)), 1.0)
        .to(doc, Object.assign({ duration: 1.1, ease: 'power2.inOut' }, frame(.3, 300, .45)), 2.5)
        .to(og, { t: 1, duration: .8, ease: 'power1.inOut', onUpdate: function () { gr.style.strokeDashoffset = L * (1 - og.t) } }, 3.5)
        .to(doc, Object.assign({ duration: 1.3, ease: 'power2.inOut' }, frame(0, 716, 1)), 4.7)
        .from(lock, { yPercent: 100, opacity: 0, duration: .5, ease: 'power2.out' }, 5.9)
        .from($('span', lock), { scale: .6, opacity: 0, duration: .45, ease: 'back.out(2)' }, 6.1)
        .from($('.gp-life', gp), { y: 70, x: 30, rotation: 14, opacity: 0, duration: .85, ease: 'back.out(1.4)' }, 6.3)
        .add(function () {   /* the arrow runs from the $3,000 tile on the screen to the postcard's tag */
          var g = gp.getBoundingClientRect(), c = cam.getBoundingClientRect(), r = c.width / 1080, tg = $('.gp-tag', gp).getBoundingClientRect();
          var x0 = (c.left + 380 * r - g.left) / g.width * 100, y0 = (c.top + (972 - 716) * r - g.top) / g.height * 100;
          var x1 = (tg.left + tg.width * .2 - g.left) / g.width * 100, y1 = (tg.top + tg.height * .3 - g.top) / g.height * 100;
          var mx = (x0 + x1) / 2 + 4, my = Math.min(y0, y1) - 2;
          fl[0].setAttribute('d', 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1));
          var a = Math.atan2(y1 - my, x1 - mx), h = 2.6;
          fl[1].setAttribute('d', 'M' + (x1 - h * Math.cos(a - .5)).toFixed(1) + ' ' + (y1 - h * Math.sin(a - .5)).toFixed(1) + ' L' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + (x1 - h * Math.cos(a + .5)).toFixed(1) + ' ' + (y1 - h * Math.sin(a + .5)).toFixed(1));
          fl.forEach(function (q) { var l = q.getTotalLength(); q.style.strokeDasharray = l + ' ' + (l + 2); q.style.strokeDashoffset = l });
          gsap.to(fl, { strokeDashoffset: 0, duration: .6, ease: 'power1.inOut', stagger: .5 }) }, 7.1)
        .from($('.gp-tag', gp), { y: -60, rotation: -60, opacity: 0, duration: 1.4, ease: 'elastic.out(1,.35)' }, 7.0)
        .from($('.gp-num', gp), { clipPath: 'inset(0 100% 0 0)', duration: .8, ease: 'none' }, 7.6)
        .from($('.gp-src', gp), { opacity: 0, y: 8, duration: .6 }, 7.9);
      when(gp, tk);
    }

    /* the closing card: what you get comes in item by item; the total lands last */
    var vs = $('.vstack');
    if (vs) when(vs, gsap.timeline().from($$('li', vs), { x: -14, opacity: 0, duration: .4, stagger: .12, ease: 'power2.out' }, 0).from($('.vtotal b'), { scale: .6, opacity: 0, duration: .5, ease: 'back.out(2.4)' }, .75), 'top 75%');

    ScrollTrigger.refresh();
  });
})();
