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

  document.fonts.ready.then(function () {

    /* the hero's numbers count once */
    $$('.hero .stat b').forEach(function (b, i) {
      var t = b.textContent, m = t.match(/([\d.,]+)/); if (!m) return; var v = parseFloat(m[1].replace(/,/g, '')); if (!v) return;
      var dec = (m[1].split('.')[1] || '').length, pre = t.slice(0, m.index), suf = t.slice(m.index + m[1].length);
      count(b, v, 1.6, function (x) { return pre + (dec ? x.toFixed(dec) : Math.round(x).toLocaleString('en-US')) + suf }).delay(.5 + i * .15);
    });

    /* Day 1: You, 0 subscribers, finds three places (after the window has risen) */
    var a1 = $('#art1 .cs1');
    if (a1) {
      var t1 = gsap.timeline({ delay: 1 });
      t1.from($('.cs-h', a1), { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power2.inOut' }, 0)
        .from($('.c1-you', a1), { scale: .4, opacity: 0, duration: .55, ease: 'back.out(2)' }, .5)
        .fromTo($('.c1-paths', a1), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power1.inOut' }, 1)
        .from($$('.c1-c', a1), { scale: .5, opacity: 0, duration: .45, ease: 'back.out(2.2)', stagger: .22 }, 1.6)
        .from($('.cs-lock', a1), { y: 10, opacity: 0, duration: .4 }, 2.5);
      when($('#art1'), t1);
    }

    /* Day 2: the client asks for the best price; four words; accepted */
    var a2 = $('#art2 .cs2');
    if (a2) {
      var t2 = gsap.timeline({ delay: 1 });
      t2.from($('.cs-h', a2), { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power2.inOut' }, 0)
        .from($('.m1', a2), { y: 14, opacity: 0, duration: .45, ease: 'back.out(1.8)' }, .5)
        .from($('.m2', a2), { y: 14, opacity: 0, duration: .45, ease: 'back.out(1.8)' }, 1.3)
        .from($$('.m2 .red i', a2), { scaleX: 0, transformOrigin: '0 50%', duration: .26, stagger: .2, ease: 'power2.out' }, 1.5)
        .from($('.c2-fw', a2), { clipPath: 'inset(0 100% 0 0)', duration: .7, ease: 'none' }, 2.4)
        .from($('.m3', a2), { y: 14, opacity: 0, duration: .45, ease: 'back.out(1.8)' }, 3.1)
        .from($('.m3 .ok i', a2), { scale: 0, rotation: -90, duration: .5, ease: 'back.out(3)' }, 3.3)
        .from($('.cs-lock', a2), { y: 10, opacity: 0, duration: .4 }, 3.7);
      when($('#art2'), t2);
    }

    /* Day 3: 771 likes and $0; 82 likes and money */
    var a3 = $('#art3 .cs3');
    if (a3) {
      var t3 = gsap.timeline({ delay: 1 }), ar = $$('.c3-ar path', a3);
      t3.from($('.cs-h', a3), { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power2.inOut' }, 0)
        .from($('.c3-p.pa', a3), { y: 20, rotation: -8, opacity: 0, duration: .6, ease: 'back.out(1.6)' }, .4)
        .from($('.c3-p.pb', a3), { y: 20, rotation: 8, opacity: 0, duration: .6, ease: 'back.out(1.6)' }, .6)
        .add(count($('.pa .n', a3), 771, 1.6), 1)
        .add(count($('.pb .n', a3), 82, 1.6), 1)
        .from($('.pa .c3-er b', a3), { scale: 1.8, opacity: 0, duration: .4, ease: 'back.out(2)' }, 2.7)
        .from($('.pb .c3-er b', a3), { scaleX: 0, transformOrigin: '0 50%', duration: .45 }, 3)
        .add(draw(ar[0], .8), 3.3).add(draw(ar[1], .25), 4.05)
        .from($('.c3-diff', a3), { clipPath: 'inset(0 100% 0 0)', duration: .8, ease: 'none' }, 4.1);
      when($('#art3'), t3);
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

    /* bring the part you're stuck on: Ana's pencil marks a shared draft; your question is answered live */
    var rv = $('.rvw');
    if (rv) {
      var penG = $('.rv-pen', rv), pen = Pen(penG, -34, .55), n1 = $('.rv-n1', rv), n2 = $('.rv-n2', rv);
      var w1 = $('.rv-t1', rv).getComputedTextLength(), w2 = $('.rv-t2', rv).getComputedTextLength();
      n1.setAttribute('width', 0); n2.setAttribute('width', 0);
      function write(clip, x0, base, ww, dur) { var o2 = { t: 0 };
        return gsap.to(o2, { t: 1, duration: dur, ease: 'none', onUpdate: function () { var x = o2.t * (ww + 30); clip.setAttribute('width', x.toFixed(1)); pen.at(x0 + x, base - 7 + Math.sin(o2.t * ww / 3.2) * 4) } }) }
      pen.at(330, 260);
      var tv = gsap.timeline({ delay: .4 });
      tv.set(penG, { opacity: 1 }, .3)
        .add(pen.go(14, 59, .7, 40, -30), .3)
        .add(draw($('.rv-s1', rv), .75, pen), 1)
        .add(pen.go(14, 83, .25, 6), 1.75)
        .add(draw($('.rv-s2', rv), .35, pen), 2)
        .add(pen.go(16, 186, .45, 10), 2.4)
        .add(write(n1, 14, 192, w1, 1.1), 2.85)
        .add(pen.go(28, 214, .3, 8), 4)
        .add(write(n2, 24, 220, w2, .8), 4.3)
        .add(pen.go(150, 138, .45, 26), 5.15)
        .add(draw($('.rv-tk', rv), .35, pen, 'power2.in'), 5.6)
        .add(pen.go(340, -40, .8, 30, -60), 6)
        .from($('.rv-q', rv), { y: 24, scale: .9, opacity: 0, duration: .5, ease: 'back.out(1.8)' }, 1.8)
        .add(function () { gsap.to($('.rv-st i', rv), { scale: 1.6, duration: .5, yoyo: true, repeat: -1, ease: 'sine.inOut' }) }, 2.4);
      when(rv, tv);
    }

    /* your gift: the calculator's own numbers for a $3,000 goal */
    var xc = $('.xcalc');
    if (xc) {
      var tx = gsap.timeline({ delay: .3 });
      tx.add(count($('.xc-g', xc), 3000, 1.2), 0);
      $$('.xc-c', xc).forEach(function (c, i) { tx.from(c, { y: 18, opacity: 0, duration: .45, ease: 'back.out(1.6)' }, .4 + i * .14).add(count($('.xc-n', c), +$('.xc-n', c).dataset.to, .9), .7 + i * .14) });
      when(xc, tx);
    }

    /* the closing card: what you get comes in item by item; the total lands last */
    var vs = $('.vstack');
    if (vs) when(vs, gsap.timeline().from($$('li', vs), { x: -14, opacity: 0, duration: .4, stagger: .12, ease: 'power2.out' }, 0).from($('.vtotal b'), { scale: .6, opacity: 0, duration: .5, ease: 'back.out(2.4)' }, .75), 'top 75%');

    ScrollTrigger.refresh();
  });
})();
