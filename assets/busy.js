/* A clear "it's working" state on every button that waits on the network or a redirect (Sean, Nov 15: "after you click
   Register it gets stuck for a while and you don't know it's redirecting"). The button keeps its size, shows a turning
   ring and a short line saying what is happening, and after a few seconds a second, reassuring line.
   AnaBusy.on(button, 'Saving your seat', 'Taking you to the next step') · AnaBusy.off(button)
   Buttons and links with data-busy="..." (and optional data-busy2="...") turn busy on click by themselves.
   Coming back with the browser's Back button (from Stripe, say) puts every button back as it was. */
(function(){
  if (window.AnaBusy) return;
  var css = document.createElement('style');
  css.textContent =
    '.is-busy{cursor:progress!important;pointer-events:none}' +
    '.is-busy .ab-l{display:inline-flex;align-items:center;justify-content:center;gap:10px;white-space:nowrap}' +
    '.ab-r{flex:none;width:1.05em;height:1.05em;border-radius:50%;border:2.5px solid currentColor;border-right-color:transparent;opacity:.85;animation:abSpin .8s linear infinite}' +
    '.ab-t{display:inline-block}' +
    '.ab-d::after{content:"";display:inline-block;width:1.1em;text-align:left;animation:abDots 1.2s steps(4,end) infinite}' +
    '@keyframes abSpin{to{transform:rotate(360deg)}}' +
    '@keyframes abDots{0%{content:""}25%{content:"."}50%{content:".."}75%{content:"..."}}' +
    '@media (prefers-reduced-motion:reduce){.ab-r{animation-duration:2.4s}.ab-d::after{animation:none;content:"..."}}';
  document.head.appendChild(css);

  var live = null;
  function say(t){ if (!live) { live = document.createElement('p'); live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite');
    live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;margin:-1px';
    document.body.appendChild(live) } live.textContent = t }

  function label(btn){ return btn.querySelector('.bt') || btn }
  function on(btn, t1, t2){
    if (!btn || btn.classList.contains('is-busy')) return;
    var l = label(btn);
    btn._ab = {html: l.innerHTML, w: btn.style.minWidth, dis: btn.disabled};
    btn.style.minWidth = btn.offsetWidth + 'px';      /* the button keeps its width: nothing jumps */
    btn.classList.add('is-busy'); btn.setAttribute('aria-busy', 'true');
    if ('disabled' in btn && btn.tagName === 'BUTTON') btn.disabled = true;
    l.innerHTML = '<span class="ab-l"><i class="ab-r" aria-hidden="true"></i><span class="ab-t ab-d"></span></span>';
    var tx = l.querySelector('.ab-t'); tx.textContent = t1 || 'One moment';
    say((t1 || 'One moment') + '…');
    if (t2) btn._ab.timer = setTimeout(function(){ if (btn.classList.contains('is-busy')) { tx.textContent = t2; say(t2 + '…') } }, 3500);
  }
  function off(btn){
    if (!btn || !btn._ab) return;
    clearTimeout(btn._ab.timer);
    label(btn).innerHTML = btn._ab.html; btn.style.minWidth = btn._ab.w;
    btn.classList.remove('is-busy'); btn.removeAttribute('aria-busy');
    if (btn.tagName === 'BUTTON') btn.disabled = btn._ab.dis;
    btn._ab = null;
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-busy]');
    if (!b || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0 || b.target === '_blank') return;
    setTimeout(function(){ on(b, b.getAttribute('data-busy'), b.getAttribute('data-busy2')) }, 0);
  });
  /* back from Stripe or the next page: the browser restores this page as it was left, so reset the buttons */
  addEventListener('pageshow', function(e){ if (e.persisted) [].forEach.call(document.querySelectorAll('.is-busy'), off) });
  window.AnaBusy = {on: on, off: off};
})();
