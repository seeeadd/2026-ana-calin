/* Ana's page videos on Wistia (Sean, Nov 4; reworked Nov 9; phones reworked Nov 12). One player for the registration,
   VIP and confirmation pages.
   - Every screen: the first seconds play silently on a loop as a preview. It never starts with sound on its own.
   - The first press starts her from the top, with sound. After that it's an ordinary player: pause and play carry on
     from where she was and never restart. When she finishes, the silent preview comes back (a press restarts again).
   - Phones play the portrait edit inline, in a phone frame sized to the screen (not full screen on its own), with a
     clear "Watch full screen" button under it.
   - Phones show Ana's first frame (img/vsl/<phone id>.jpg) straight away. The player only shows once it is really
     playing, so a phone that blocks the silent preview (Low Power Mode, Data Saver, reduced motion, an old iPhone)
     still sees her and the "Tap for sound" button, never an empty or letterboxed frame.
   - Browsers without custom elements (very old phones) get Wistia's plain iframe player instead.
   - phoneStill (Ana, Nov 14: "stop the frame on a scene in which I don't look this drunk"): phones skip the silent preview
     and hold the chosen still (poster) until the press, and go back to it when she finishes.
   WVSL({box, scr, frame, desktop, phone, poster, phoneStill, pill, previewSec, onPhoneEnd}) */
(function(){
  var me = document.currentScript && document.currentScript.src || '';
  var ROOT = me ? me.replace(/assets\/wistia-vsl\.js.*$/, '') : '/';
  var POSTERS = {z5mv5t5sf5: 1, h1acvjpuks: 1, vy4l2af396: 1};   /* phone edits with a saved first frame */
  var loaded = {};
  function load(src, mod){ if (loaded[src] || Array.prototype.some.call(document.scripts, function(s){ return s.src === src })) return;
    loaded[src] = 1; var s = document.createElement('script'); s.src = src; s.async = true; if (mod) s.type = 'module'; document.head.appendChild(s) }
  var MODERN = 'customElements' in window && 'noModule' in document.createElement('script');
  function player(id, opts){
    if (!MODERN) { var f = document.createElement('iframe');
      f.src = 'https://fast.wistia.net/embed/iframe/' + id + '?playsinline=true&videoFoam=false&controlsVisibleOnLoad=true';
      f.setAttribute('allow', 'autoplay; fullscreen'); f.setAttribute('allowfullscreen', ''); f.setAttribute('title', 'Ana’s video');
      f.style.border = '0'; return f }
    load('https://fast.wistia.com/player.js'); load('https://fast.wistia.com/embed/' + id + '.js', true);
    var w = document.createElement('wistia-player'); w.setAttribute('media-id', id);
    Object.keys(opts).forEach(function(k){ if (opts[k] !== false) w.setAttribute(k, opts[k] === true ? '' : opts[k]) });
    return w;
  }
  function safe(f){ try { return f() } catch (e) {} }
  function playP(v){ var p = safe(function(){ return v.play() }); if (p && p.catch) p.catch(function(){}) }
  /* from the top, with sound. Play first: seeking a player that hasn't started yet leaves it paused */
  function fromTop(v){ safe(function(){ v.muted = false; v.volume = 1 }); playP(v);
    safe(function(){ if (v.currentTime > .3) { v.currentTime = 0; playP(v) } }) }
  /* full screen: Wistia's own call first (it uses the iPhone's native player), then the browser's */
  function fullScreen(w){
    if (safe(function(){ var r = w.requestFullscreen(); if (r && r.catch) r.catch(function(){}); return true })) return;
    var v = safe(function(){ return (w.shadowRoot && w.shadowRoot.querySelector('video')) || w.querySelector('video') });
    if (v && v.webkitEnterFullscreen) { safe(function(){ v.webkitEnterFullscreen() }); return }
    safe(function(){ (w.webkitRequestFullscreen || w.webkitRequestFullScreen).call(w) });
  }

  /* the shared look of the loader and the inline player (the page styles its own frame) */
  var css = document.createElement('style');
  css.textContent =
    '.wv .wv-p{position:absolute;inset:0;top:0;left:0;display:block;width:100%;height:100%;z-index:1;opacity:0;transition:opacity .35s ease}' +
    '.wv.wv-ready .wv-p{opacity:1}' +
    '.wv .wv-post{position:absolute;inset:0;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:1;pointer-events:none}' +
    '.wv .wv-hit{position:absolute;inset:0;z-index:4;cursor:pointer;-webkit-tap-highlight-color:transparent}.wv .wv-hit[hidden]{display:none}' +
    '.wv.playing .vplay{opacity:0!important;pointer-events:none}.wv .scrub{display:none!important}' +
    '.wv.wv-old .vplay,.wv.wv-old .wv-hit,.wv.wv-old .wv-post{display:none!important}.wv.wv-old .wv-p{opacity:1}' +
    '.wv-load{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;' +
      'background:linear-gradient(110deg,#f6efe3 8%,#fffaf1 18%,#f6efe3 33%);background-size:220% 100%;animation:wvShim 1.6s linear infinite;' +
      'color:#7A6A60;font:700 12px/1.2 Manrope,system-ui,sans-serif;letter-spacing:.06em;transition:opacity .4s ease}' +
    '.wv-load .wv-ring{width:34px;height:34px;border-radius:50%;border:3px solid rgba(255,212,0,.35);border-top-color:#FFD400;animation:wvSpin .9s linear infinite}' +
    '.wv.wv-ready .wv-load,.wv.wv-shown .wv-load,.wv.wv-shown .vsl-loading{opacity:0!important;pointer-events:none}' +
    '@keyframes wvShim{to{background-position:-120% 0}}@keyframes wvSpin{to{transform:rotate(360deg)}}' +
    '@media (prefers-reduced-motion:reduce){.wv-load,.wv-load .wv-ring{animation:none}}' +
    /* the phone (Sean, Nov 9; bigger Nov 12): a titanium edge, a thin black bezel drawn outside the screen, side buttons,
       the island. The screen is exactly 9:16, so the portrait edit fills it with no bars. It is as big as the phone's
       screen allows: nearly the full width, and never taller than the visible screen, so the whole video fits in view */
    '.wv-phone{position:relative;display:block;width:78vw;width:min(86vw,370px,calc((100vh - 130px) * .5625 + 22px));margin:0 auto;padding:11px;border-radius:50px;box-sizing:border-box;' +
      'background:linear-gradient(145deg,#e6e8ec 0%,#9a9ea6 18%,#d9dce1 34%,#7d828a 52%,#c8cbd1 70%,#8f949b 86%,#e2e4e8 100%);' +
      'box-shadow:inset 0 0 0 1px rgba(255,255,255,.55),inset 0 0 0 2px rgba(40,42,48,.35),0 2px 3px rgba(20,20,24,.25),0 40px 60px -28px rgba(10,20,40,.7)}' +
    '@supports (height:100svh){.wv-phone{width:min(86vw,370px,calc((100svh - 130px) * .5625 + 22px))}}' +
    '.wv-phone:before,.wv-phone:after{content:"";position:absolute;width:4px;border-radius:2px;background:linear-gradient(90deg,#7d828a,#d6d9de 60%,#9a9ea6)}' +
    '.wv-phone:before{left:-3px;top:17%;height:6%;box-shadow:0 calc(var(--wvh,600px)*.09) 0 #a3a7ae,0 calc(var(--wvh,600px)*.18) 0 #a3a7ae}' +
    '.wv-phone:after{right:-3px;top:27%;height:12%}' +
    '.wv-phone>.wv-screen{position:relative!important;inset:auto!important;left:auto!important;top:auto!important;display:block;width:100%!important;height:auto!important;' +
      'aspect-ratio:9/16!important;margin:0!important;border:0!important;border-radius:39px!important;overflow:hidden!important;background:#d9d2c6;box-sizing:border-box;' +
      'box-shadow:0 0 0 8px #060607,0 0 0 9px rgba(255,255,255,.08)!important;transform:none!important}' +
    '@supports not (aspect-ratio:1/1){.wv-phone>.wv-screen{height:0!important;padding-top:177.78%!important}}' +
    '.wv-phone>.wv-screen>.wv-isl{position:absolute;z-index:6;left:50%;top:10px;width:32%;height:22px;margin-left:-16%;border-radius:999px;background:#050506;pointer-events:none;' +
      'box-shadow:inset -6px 0 0 -3px #1b2333}' +
    '.wv-phone>.wv-screen>.wv-glass{position:absolute;inset:0;z-index:5;pointer-events:none;border-radius:inherit;' +
      'background:linear-gradient(118deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 26%,rgba(255,255,255,0) 70%,rgba(255,255,255,.06) 100%)}' +
    /* "Tap for sound" on the phone: one line, low on the screen, clear of her face; the same on every page */
    '.wv.wv-port .vplay{top:var(--wv-pill,63%)!important;bottom:auto!important;left:50%!important;right:auto!important;transform:translate(-50%,-50%)!important;width:max-content!important;max-width:90%!important;' +
      'height:auto!important;min-height:0!important;padding:8px 15px 8px 8px!important;gap:9px!important;border-radius:16px!important;font-size:17px!important;line-height:1.15!important;white-space:nowrap!important;margin:0!important}' +
    '.wv.wv-port .vplay small{font-size:11.5px!important;margin-top:3px!important;white-space:nowrap!important}' +
    '.wv.wv-port .vplay .sound-symbol,.wv.wv-port .vplay .vs,.wv.wv-port .vplay .snd-s{width:38px!important;height:38px!important;border-radius:11px!important}' +
    '.wv.wv-port .vplay .sound-symbol svg,.wv.wv-port .vplay .vs svg,.wv.wv-port .vplay .snd-s svg{width:30px!important;height:30px!important}' +
    '.wv.wv-port .vplay .sound-bars,.wv.wv-port .vplay .vb,.wv.wv-port .vplay .snd-b{margin-left:2px!important;height:22px!important}' +
    /* the full-screen button under the phone: big, labelled, easy to hit */
    '.wv-fs{display:flex;align-items:center;justify-content:center;gap:9px;margin:18px auto 0;min-height:48px;padding:0 22px;border-radius:999px;border:1.5px solid rgba(26,20,18,.22);' +
      'background:#fff;color:#1A1412;font:700 16px/1 Manrope,system-ui,sans-serif;cursor:pointer;box-shadow:0 2px 0 rgba(26,20,18,.12);-webkit-tap-highlight-color:transparent}' +
    '.wv-fs svg{width:20px;height:20px;flex:none}.wv-fs:active{transform:translateY(1px)}' +
    '.wv-fs:focus-visible{outline:3px solid #1A1412;outline-offset:3px}';
  document.head.appendChild(css);

  window.WVSL = function(o){
    var box = o.box, scr = o.scr, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, phone = matchMedia('(max-width:640px)');
    var P = o.previewSec || 8, mode = 'preview', last = 0, w = null, portrait = false, firstFrame = false, post = null, fsb = null;
    var frame = o.frame || scr, wrap = null;   /* the element that becomes the phone's screen */
    function phoneOn(on){
      if (on && !wrap) { wrap = document.createElement('span'); wrap.className = 'wv-phone'; frame.parentNode.insertBefore(wrap, frame); wrap.appendChild(frame);
        frame.classList.add('wv-screen'); var isl = document.createElement('i'); isl.className = 'wv-isl'; var gl = document.createElement('i'); gl.className = 'wv-glass';
        frame.appendChild(gl); frame.appendChild(isl); wrap.style.setProperty('--wvh', wrap.offsetHeight + 'px');
        fsb = document.createElement('button'); fsb.type = 'button'; fsb.className = 'wv-fs';
        fsb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>Watch full screen';
        fsb.addEventListener('click', function(){ if (mode !== 'full') start(); fullScreen(w) });
        wrap.parentNode.insertBefore(fsb, wrap.nextSibling) }
      if (!on && wrap) { wrap.parentNode.insertBefore(frame, wrap); wrap.parentNode.removeChild(wrap); wrap = null; frame.classList.remove('wv-screen');
        if (fsb && fsb.parentNode) fsb.parentNode.removeChild(fsb); fsb = null;
        [].slice.call(frame.querySelectorAll('.wv-isl, .wv-glass')).forEach(function(e){ if (e.parentNode === frame) frame.removeChild(e) }) }
    }
    box.classList.add('wv'); if (!MODERN) box.classList.add('wv-old');
    if (o.pill) box.style.setProperty('--wv-pill', o.pill);   /* phone: how far down the Tap for sound pill sits (Sean, Nov 14: off her face) */

    /* the loader: the page's own, or a light shimmer with a turning sunflower-yellow ring */
    var own = scr.querySelector('.vsl-loading'), ld = own;
    if (!ld) { ld = document.createElement('span'); ld.className = 'wv-load'; ld.setAttribute('aria-hidden', 'true');
      ld.innerHTML = '<i class="wv-ring"></i><b>Loading Ana’s video</b>'; scr.appendChild(ld); }
    /* shown: something worth looking at is on screen (her first frame, or the player). ready: the player itself is playing */
    function shown(){ box.classList.add('wv-shown'); if (own) own.hidden = true; clearTimeout(slow) }
    function ready(){ if (firstFrame) return; firstFrame = true; box.classList.add('wv-ready', 'video-ready'); shown() }
    var slow = setTimeout(function(){ if (firstFrame) return; var b = ld.querySelector('b'), s = ld.querySelector('small');
      if (b) b.textContent = 'The video is taking a moment.'; if (s) s.textContent = 'Tap to try playback.' }, 12000);
    /* our own press target over the player while it previews, so the preview never shows Wistia's controls */
    var hit = document.createElement('span'); hit.className = 'wv-hit'; hit.setAttribute('aria-hidden', 'true'); scr.appendChild(hit);

    function build(){
      portrait = !!(o.phone && phone.matches);
      var id = portrait ? o.phone : o.desktop, src = portrait ? (o.poster || (POSTERS[id] ? ROOT + 'img/vsl/' + id + '.jpg' : '')) : '';
      box.classList.toggle('wv-port', portrait);
      phoneOn(portrait);
      if (w && w.parentNode) w.parentNode.removeChild(w);
      if (post && post.parentNode) post.parentNode.removeChild(post); post = null;
      firstFrame = false; box.classList.remove('wv-ready', 'video-ready', 'playing', 'wv-shown'); if (own) own.hidden = false;
      mode = 'preview'; hit.hidden = false;
      var still = reduce || (portrait && !!o.phoneStill);
      w = player(id, {muted: true, autoplay: !still, 'silent-autoplay': !still ? 'allow' : false,
        'end-video-behavior': 'loop', preload: portrait ? 'metadata' : 'auto', 'controls-visible-on-load': 'false', 'big-play-button': 'false',
        poster: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="9" height="16"%3E%3Cpath fill="%23d9d2c6" d="M0 0h9v16H0z"/%3E%3C/svg%3E'});
      w.className = 'wv-p';
      scr.insertBefore(w, scr.firstChild);
      if (!MODERN) { hit.hidden = true; ready(); return }
      if (src) {   /* her first frame under the player, at once */
        post = document.createElement('img'); post.className = 'wv-post'; post.alt = ''; post.decoding = 'async'; post.src = src;
        post.setAttribute('aria-hidden', 'true'); scr.insertBefore(post, scr.firstChild); shown();
      } else {     /* no saved frame: show the player as soon as it has loaded, as before */
        w.addEventListener('loaded-data', ready); w.addEventListener('can-play', ready);
      }
      w.addEventListener('playing', function(){ setTimeout(function(){ var t = safe(function(){ return w.currentTime }); if (t > .05) ready() }, 300) });
    }
    build();

    function stillMode(){ return reduce || (portrait && !!o.phoneStill) }
    function toPreview(){ mode = 'preview'; box.classList.remove('playing'); hit.hidden = false;
      if (portrait && o.phoneStill && post) { firstFrame = false; box.classList.remove('wv-ready', 'video-ready'); safe(function(){ w.muted = true; w.pause(); w.currentTime = 0 }); return }
      safe(function(){ w.muted = true; if (reduce) w.pause(); else { w.currentTime = 0; playP(w) } }) }
    function start(){
      mode = 'full'; last = 0; box.classList.add('playing'); hit.hidden = true; ready();
      fromTop(w);
    }
    setInterval(function(){
      if (!MODERN) return;
      var t = safe(function(){ return w.currentTime }); if (typeof t !== 'number') return;
      if (mode === 'preview' && portrait && o.phoneStill && post) { if (!safe(function(){ return w.paused })) safe(function(){ w.pause() }); return }   /* Wistia may start it on its own: keep the still */
      if (t > .05) ready();
      if (mode === 'preview' && t > P) safe(function(){ w.currentTime = 0 });
      if (mode === 'full') {
        if (t < last - 1) { toPreview(); if (portrait && o.onPhoneEnd) o.onPhoneEnd() }   /* she finished (the player looped) */
        last = t;
      }
    }, 250);
    /* only the first press restarts; afterwards Wistia's own controls pause and play without restarting */
    hit.addEventListener('click', function(e){ e.preventDefault(); start() });
    /* crossing the phone width while still previewing: switch to the other edit */
    if (o.phone && phone.addEventListener) phone.addEventListener('change', function(){ if (mode === 'preview') build() });
    /* browsers may suspend a muted preview when it scrolls away: resume only the preview */
    function resumePreview(){ if (mode !== 'preview' || stillMode() || document.hidden || !MODERN) return;
      var r = box.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) playP(w) }
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ if (es[0].isIntersecting) resumePreview() }, {threshold: .1}).observe(box);
    document.addEventListener('visibilitychange', resumePreview);
    return {start: start};
  };
})();
