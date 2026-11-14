/* Ana's Offer Flow screen recording (Sean, Nov 14): loads only when it scrolls near, plays while on screen, pauses
   when it leaves. With reduced motion, or if the phone refuses to autoplay, the still of the results stays. */
(function(){
  var vs=[].slice.call(document.querySelectorAll('video.ofv[data-src]'));if(!vs.length)return;
  var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;if(still)return;
  function load(v){if(!v.src){v.src=v.getAttribute('data-src')}}
  function play(v){load(v);var p=v.play();if(p&&p.catch)p.catch(function(){})}
  if(!('IntersectionObserver' in window)){vs.forEach(play);return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting)play(e.target);else if(!e.target.paused)e.target.pause()})},{rootMargin:'200px 0px',threshold:0});
  vs.forEach(function(v){io.observe(v)});
})();
