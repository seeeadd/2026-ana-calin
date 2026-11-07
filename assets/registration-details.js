/* Fine outline motion follows the actual button shape, including resized and wrapped labels. */
(function () {
  var ns = 'http://www.w3.org/2000/svg';
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.btn'));
  function fit(button) {
    var svg = button.querySelector('.cta-outline'); if (!svg) return;
    var w = button.clientWidth, h = button.clientHeight; if (!w || !h) return;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var rect = svg.querySelector('rect');
    rect.setAttribute('width', w - 4); rect.setAttribute('height', h - 4);
    rect.setAttribute('rx', Math.min(h / 2 - 2, parseFloat(getComputedStyle(button).borderRadius) || 16));
  }
  var observer = 'ResizeObserver' in window ? new ResizeObserver(function(es){ es.forEach(function(e){ fit(e.target) }) }) : null;
  buttons.forEach(function(button, i){
    if (button.querySelector('.cta-outline')) return;
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class','cta-outline'); svg.setAttribute('aria-hidden','true'); svg.setAttribute('focusable','false');
    svg.innerHTML = '<rect x="2" y="2" fill="none" pathLength="100" />';
    svg.style.setProperty('--trace-delay', (i % 4 * -.7) + 's');
    button.appendChild(svg); fit(button); if (observer) observer.observe(button);
  });
  if (!observer) addEventListener('resize', function(){buttons.forEach(fit)});
})();
