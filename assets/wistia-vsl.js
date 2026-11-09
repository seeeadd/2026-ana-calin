/* Ana's page videos on Wistia (Sean, Nov 4; reworked Nov 9). One player for the registration, VIP and confirmation pages.
   - Every screen: the first seconds play silently on a loop as a preview. It never starts with sound on its own.
   - The first press starts her from the top, with sound. After that it's an ordinary player: pause and play carry on
     from where she was and never restart. When she finishes, the silent preview comes back (a press restarts again).
   - Phones play the portrait edit inline, inside the page's own frame (not full screen), so they can tell it's made
     for the phone. The page's CSS sizes the frame through .wv-port.
   - A light loading animation shows until the first frame plays. A page can bring its own (.vsl-loading); otherwise
     one is added (.wv-load).
   WVSL({box, scr, desktop, phone, previewSec, onPhoneEnd}) */
(function(){
  var loaded = {};
  function load(src, mod){ if (loaded[src] || Array.prototype.some.call(document.scripts, function(s){ return s.src === src })) return;
    loaded[src] = 1; var s = document.createElement('script'); s.src = src; s.async = true; if (mod) s.type = 'module'; document.head.appendChild(s) }
  function player(id, opts){
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

  /* the shared look of the loader and the inline player (the page styles its own frame) */
  var css = document.createElement('style');
  css.textContent =
    '.wv .wv-p{position:absolute;inset:0;display:block;width:100%;height:100%;z-index:1;opacity:0;transition:opacity .35s ease}' +
    '.wv.wv-ready .wv-p{opacity:1}' +
    '.wv .wv-hit{position:absolute;inset:0;z-index:4;cursor:pointer}.wv .wv-hit[hidden]{display:none}' +
    '.wv.playing .vplay{opacity:0!important;pointer-events:none}.wv .scrub{display:none!important}' +
    '.wv-load{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;' +
      'background:linear-gradient(110deg,#f6efe3 8%,#fffaf1 18%,#f6efe3 33%);background-size:220% 100%;animation:wvShim 1.6s linear infinite;' +
      'color:#7A6A60;font:700 12px/1.2 Manrope,system-ui,sans-serif;letter-spacing:.06em;transition:opacity .4s ease}' +
    '.wv-load .wv-ring{width:34px;height:34px;border-radius:50%;border:3px solid rgba(255,212,0,.35);border-top-color:#FFD400;animation:wvSpin .9s linear infinite}' +
    '.wv.wv-ready .wv-load{opacity:0;pointer-events:none}' +
    '@keyframes wvShim{to{background-position:-120% 0}}@keyframes wvSpin{to{transform:rotate(360deg)}}' +
    '@media (prefers-reduced-motion:reduce){.wv-load,.wv-load .wv-ring{animation:none}}' +
    /* the phone (Sean, Nov 9): a titanium edge, a thin black bezel drawn outside the screen, side buttons, the island.
       The screen itself is exactly 9:16, so the portrait edit fills it with no bars */
    '.wv-phone{position:relative;display:block;width:min(66vw,300px);margin:0 auto;padding:11px;border-radius:50px;box-sizing:border-box;' +
      'background:linear-gradient(145deg,#e6e8ec 0%,#9a9ea6 18%,#d9dce1 34%,#7d828a 52%,#c8cbd1 70%,#8f949b 86%,#e2e4e8 100%);' +
      'box-shadow:inset 0 0 0 1px rgba(255,255,255,.55),inset 0 0 0 2px rgba(40,42,48,.35),0 2px 3px rgba(20,20,24,.25),0 40px 60px -28px rgba(10,20,40,.7)}' +
    '.wv-phone:before,.wv-phone:after{content:"";position:absolute;width:4px;border-radius:2px;background:linear-gradient(90deg,#7d828a,#d6d9de 60%,#9a9ea6)}' +
    '.wv-phone:before{left:-3px;top:17%;height:6%;box-shadow:0 calc(var(--wvh,600px)*.09) 0 #a3a7ae,0 calc(var(--wvh,600px)*.18) 0 #a3a7ae}' +
    '.wv-phone:after{right:-3px;top:27%;height:12%}' +
    '.wv-phone>.wv-screen{position:relative!important;inset:auto!important;left:auto!important;top:auto!important;display:block;width:100%!important;height:auto!important;' +
      'aspect-ratio:9/16!important;margin:0!important;border:0!important;border-radius:39px!important;overflow:hidden!important;background:#0b0b0d;box-sizing:border-box;' +
      'box-shadow:0 0 0 8px #060607,0 0 0 9px rgba(255,255,255,.08)!important;transform:none!important}' +
    '.wv-phone>.wv-screen>.wv-isl{position:absolute;z-index:6;left:50%;top:10px;width:32%;height:22px;margin-left:-16%;border-radius:999px;background:#050506;pointer-events:none;' +
      'box-shadow:inset -6px 0 0 -3px #1b2333}' +
    '.wv-phone>.wv-screen>.wv-glass{position:absolute;inset:0;z-index:5;pointer-events:none;border-radius:inherit;' +
      'background:linear-gradient(118deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 26%,rgba(255,255,255,0) 70%,rgba(255,255,255,.06) 100%)}';
  document.head.appendChild(css);

  window.WVSL = function(o){
    var box = o.box, scr = o.scr, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, phone = matchMedia('(max-width:640px)');
    var P = o.previewSec || 8, mode = 'preview', last = 0, w = null, portrait = false, firstFrame = false;
    var frame = o.frame || scr, wrap = null;   /* the element that becomes the phone's screen */
    function phoneOn(on){
      if (on && !wrap) { wrap = document.createElement('span'); wrap.className = 'wv-phone'; frame.parentNode.insertBefore(wrap, frame); wrap.appendChild(frame);
        frame.classList.add('wv-screen'); var isl = document.createElement('i'); isl.className = 'wv-isl'; var gl = document.createElement('i'); gl.className = 'wv-glass';
        frame.appendChild(gl); frame.appendChild(isl); wrap.style.setProperty('--wvh', wrap.offsetHeight + 'px') }
      if (!on && wrap) { wrap.parentNode.insertBefore(frame, wrap); wrap.parentNode.removeChild(wrap); wrap = null; frame.classList.remove('wv-screen');
        [].slice.call(frame.querySelectorAll(':scope > .wv-isl, :scope > .wv-glass')).forEach(function(e){ e.parentNode.removeChild(e) }) }
    }
    box.classList.add('wv');

    /* the loader: the page's own, or a light shimmer with a turning sunflower-yellow ring */
    var own = scr.querySelector('.vsl-loading'), ld = own;
    if (!ld) { ld = document.createElement('span'); ld.className = 'wv-load'; ld.setAttribute('aria-hidden', 'true');
      ld.innerHTML = '<i class="wv-ring"></i><b>Loading Ana’s video</b>'; scr.appendChild(ld); }
    function ready(){ if (firstFrame) return; firstFrame = true; box.classList.add('wv-ready', 'video-ready'); if (own) own.hidden = true; clearTimeout(slow) }
    var slow = setTimeout(function(){ if (firstFrame) return; var b = ld.querySelector('b'), s = ld.querySelector('small');
      if (b) b.textContent = 'The video is taking a moment.'; if (s) s.textContent = 'Tap to try playback.' }, 12000);
    /* our own press target over the player while it previews, so the preview never shows Wistia's controls */
    var hit = document.createElement('span'); hit.className = 'wv-hit'; hit.setAttribute('aria-hidden', 'true'); scr.appendChild(hit);

    function build(){
      portrait = !!(o.phone && phone.matches);
      box.classList.toggle('wv-port', portrait);
      phoneOn(portrait);
      if (w && w.parentNode) w.parentNode.removeChild(w);
      firstFrame = false; box.classList.remove('wv-ready', 'video-ready', 'playing'); if (own) own.hidden = false;
      mode = 'preview'; hit.hidden = false;
      w = player(portrait ? o.phone : o.desktop, {muted: true, autoplay: !reduce, 'silent-autoplay': !reduce ? 'allow' : false,
        'end-video-behavior': 'loop', preload: 'auto', 'controls-visible-on-load': 'false', 'big-play-button': 'false',
        poster: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="9"%3E%3Cpath fill="%23f6efe3" d="M0 0h16v9H0z"/%3E%3C/svg%3E'});
      w.className = 'wv-p';
      w.addEventListener('play', ready); w.addEventListener('loaded-data', ready); w.addEventListener('can-play', ready);
      scr.insertBefore(w, scr.firstChild);
    }
    build();

    function toPreview(){ mode = 'preview'; box.classList.remove('playing'); hit.hidden = false;
      safe(function(){ w.muted = true; if (reduce) w.pause(); else { w.currentTime = 0; playP(w) } }) }
    function start(){
      mode = 'full'; last = 0; box.classList.add('playing'); hit.hidden = true; ready();
      fromTop(w);
    }
    setInterval(function(){
      var t = safe(function(){ return w.currentTime }); if (typeof t !== 'number') return;
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
    function resumePreview(){ if (mode !== 'preview' || reduce || document.hidden) return;
      var r = box.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) playP(w) }
    if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ if (es[0].isIntersecting) resumePreview() }, {threshold: .1}).observe(box);
    document.addEventListener('visibilitychange', resumePreview);
    return {start: start};
  };
})();
