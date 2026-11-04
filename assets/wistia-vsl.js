/* Ana's page videos on Wistia (Sean, Nov 4): the first seconds play silently on a loop as a preview; a press starts her
   from the top, with sound; when she finishes, the preview comes back. Phones get the portrait version full screen,
   loaded in the background so the tap can start it with sound straight away.
   WVSL({box, scr, desktop, phone, previewSec, onPhoneEnd}) */
(function(){
  var loaded = {};
  function load(src, mod){ if (loaded[src]) return; loaded[src] = 1; var s = document.createElement('script'); s.src = src; s.async = true; if (mod) s.type = 'module'; document.head.appendChild(s) }
  function player(id, opts){
    load('https://fast.wistia.com/player.js'); load('https://fast.wistia.com/embed/' + id + '.js', true);
    var w = document.createElement('wistia-player'); w.setAttribute('media-id', id);
    Object.keys(opts).forEach(function(k){ if (opts[k] !== false) w.setAttribute(k, opts[k] === true ? '' : opts[k]) });
    return w;
  }
  function safe(f){ try { return f() } catch (e) {} }
  /* from the top, with sound. Play first: seeking a player that hasn't started yet leaves it paused */
  function fromTop(v){ safe(function(){ v.muted = false; v.volume = 1; var p = v.play(); if (p && p.catch) p.catch(function(){});
    if (v.currentTime > .3) { v.currentTime = 0; var q = v.play(); if (q && q.catch) q.catch(function(){}) } }) }
  window.WVSL = function(o){
    var box = o.box, scr = o.scr, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, phone = matchMedia('(max-width:640px)');
    var P = o.previewSec || 8, mode = reduce ? 'still' : 'preview', last = 0;
    box.classList.add('wv');
    var w = player(o.desktop, {muted: !reduce, autoplay: !reduce, 'silent-autoplay': !reduce ? 'allow' : false, 'end-video-behavior': 'loop',
      'controls-visible-on-load': 'false', 'big-play-button': 'false', 'play-suspended-off-screen': 'true'});
    w.className = 'wv-p'; scr.insertBefore(w, scr.firstChild);
    /* our own press target over the player while it previews, so the preview never shows Wistia's controls */
    var hit = document.createElement('span'); hit.className = 'wv-hit'; hit.setAttribute('aria-hidden', 'true'); scr.appendChild(hit);

    function toPreview(){ mode = reduce ? 'still' : 'preview'; box.classList.remove('playing'); hit.hidden = false;
      safe(function(){ w.muted = true; if (reduce) w.pause(); else { w.currentTime = 0; w.play() } }) }
    function start(){
      if (phone.matches && o.phone) return startPhone();
      mode = 'full'; last = 0; box.classList.add('playing'); hit.hidden = true;
      fromTop(w);
    }
    setInterval(function(){
      var t = safe(function(){ return w.currentTime }); if (typeof t !== 'number') return;
      if (mode === 'preview' && t > P) safe(function(){ w.currentTime = 0 });
      if (mode === 'full') { if (t < last - 1) toPreview(); last = t }   /* she finished (the player looped): back to the preview */
    }, 250);

    /* phones: the portrait edit, full screen, ready before the tap */
    var ov = null, pw = null;
    if (o.phone) {
      ov = document.createElement('div'); ov.className = 'wv-ov'; ov.setAttribute('aria-hidden', 'true');
      pw = player(o.phone, {'end-video-behavior': 'default', 'big-play-button': 'false', 'controls-visible-on-load': 'true'}); pw.className = 'wv-pp';
      var x = document.createElement('button'); x.type = 'button'; x.className = 'wv-x'; x.setAttribute('aria-label', 'Close the video');
      x.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" stroke="#1A1412" stroke-width="2.2" stroke-linecap="round"/></svg>';
      ov.appendChild(pw); ov.appendChild(x);
      var mount = function(){ if (!ov.parentNode && phone.matches) document.body.appendChild(ov) };
      mount(); phone.addEventListener && phone.addEventListener('change', mount);
      x.addEventListener('click', function(){ shutPhone() });
      setInterval(function(){ if (!ov.classList.contains('on')) return; var t = safe(function(){ return pw.currentTime }), d = safe(function(){ return pw.duration });
        if (d && t >= d - .35) { shutPhone(); if (o.onPhoneEnd) o.onPhoneEnd() } }, 250);
    }
    function startPhone(){
      ov.classList.add('on'); ov.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('wv-lock');
      safe(function(){ w.pause() });
      fromTop(pw);
    }
    function shutPhone(){
      safe(function(){ pw.pause() }); ov.classList.remove('on'); ov.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('wv-lock');
      if (!reduce) safe(function(){ w.currentTime = 0; w.play() });
    }
    scr.addEventListener('click', function(e){ if (mode !== 'full' || phone.matches) { e.preventDefault(); start() } });
    return {start: start};
  };
})();
