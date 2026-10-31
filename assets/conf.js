/* Ana Calin, the two confirmation pages. Settings come from window.CONF in each page. */
(function(){
  var C = window.CONF || {};

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var qs = new URLSearchParams(location.search), reg = {};
  try { reg = JSON.parse(sessionStorage.getItem('ana_reg') || localStorage.getItem('ana_reg') || '{}') } catch (e) {}
  var first = (qs.get('first') || qs.get('first_name') || reg.first_name || '').trim().split(/\s+/)[0];
  var email = (qs.get('email') || reg.email || '').trim();
  var ref = (qs.get('ref') || reg.ref || '').trim();
  if (first.length > 30) first = '';
  /* keep who they are in this browser, so the exit number page (/exit-number/) can put their name on it and file it under their email */
  if ((first || email) && (!reg.email || reg.email !== email)) { try { localStorage.setItem('ana_reg', JSON.stringify({first_name: first || reg.first_name || '', email: email || reg.email || '', ref: ref || reg.ref || ''})) } catch (e) {} }

  /* the first name in the headline (never the email) */
  if (first) document.querySelectorAll('[data-first]').forEach(function(e){ e.textContent = ', ' + first });
  if (first) document.querySelectorAll('[data-name]').forEach(function(e){ e.textContent = first });

  /* clicks: action_calendar, action_whatsapp, action_sheet, the survey (and the video plays) */
  function track(n){
    try {
      (window.dataLayer = window.dataLayer || []).push({event: n});
      if (window.gtag) gtag('event', n);
      if (window.plausible) plausible(n);
      if (window.fbq) fbq('trackCustom', n);
      if (window.va) va('event', {name: n});
    } catch (e) {}
  }
  document.querySelectorAll('[data-track]').forEach(function(a){ a.addEventListener('click', function(){ track(a.getAttribute('data-track')) }) });

  /* the visitor's own time, when they're outside New York and Greece */
  try {
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz !== 'America/New_York' && tz !== 'Europe/Athens') {
      var p = {};
      new Intl.DateTimeFormat('en-US', {weekday:'short', hour:'numeric', minute:'2-digit', hour12:true}).formatToParts(new Date(Date.UTC(2026,10,17,17,0))).forEach(function(x){ p[x.type] = x.value });
      if (p.weekday && p.hour && p.dayPeriod) document.querySelectorAll('.lt').forEach(function(s){ s.textContent = ' · that’s ' + p.weekday + ' ' + p.hour + ':' + p.minute + ' ' + p.dayPeriod.toLowerCase() + ' for you' });
    }
  } catch (e) {}

  /* Google Calendar: one link per day (Google can't add several events from one link) */
  var SHEET = location.origin + location.pathname.replace(/[^\/]*\/[^\/]*$/, '') + 'assets/sheet.pdf';
  var EV = {
    '20261117': ['Free 3-day live workshop · Day 1 with Ana Calin', 'Day 1: find what your readers would pay for. You leave with your one reader, and the problem she\'d pay you to fix.'],
    '20261118': ['Free 3-day live workshop · Day 2 with Ana Calin', 'Day 2: turn it into an offer, with a price. You leave with your offer, in one sentence, priced.'],
    '20261119': ['Free 3-day live workshop · Day 3 with Ana Calin', 'Day 3: write the ask. You leave with your first ask, written, ready to send. Stay to the end: five people there live win a 1:1 with Ana.'],
    '20261120': ['VIP Q&A with Ana Calin', 'Bring your offer, your price or your ask. Ana works on it with you live.']
  };
  function gcal(text, d0, details, recur){
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text=' + encodeURIComponent(text)
      + '&dates=' + d0 + 'T170000Z/' + d0 + 'T183000Z'
      + (recur ? '&recur=' + encodeURIComponent(recur) : '')
      + '&details=' + encodeURIComponent(details)
      + '&location=' + encodeURIComponent('Your Zoom link is in your email from Ana');
  }
  /* one Google link for every day: a repeating event (daily, 3 times, or 4 with the VIP Q&A on Fri Nov 20),
     in their own calendar so their usual reminders fire. The notes hold each day, with its own lines and links. */
  var vipCal = C.PAGE === 'vip', days = ['20261117', '20261118', '20261119'].concat(vipCal ? ['20261120'] : []);
  var notes = 'Every day at 12:00 pm New York (7:00 pm Greece), live on Zoom. Your Zoom link is in your email from Ana.\n';
  days.forEach(function(d, i){
    var lab = ['DAY 1 · Tue Nov 17', 'DAY 2 · Wed Nov 18', 'DAY 3 · Thu Nov 19', 'VIP Q&A · Fri Nov 20'][i];
    notes += '\n' + lab + '\n' + EV[d][1] + '\n';
  });
  notes += '\nPrint your Head start page before Day 1: ' + SHEET;
  var waLink = vipCal ? C.VIP_GROUP_URL : C.CHANNEL_URL;
  if (waLink) notes += '\n' + (vipCal ? 'Your VIP WhatsApp group: ' : 'Reminders on WhatsApp: ') + waLink;
  var gAll = gcal(vipCal ? 'Ana Calin: live workshop + VIP Q&A (Nov 17 to 20)' : 'Ana Calin: free live workshop (Nov 17 to 19)', '20261117', notes, 'RRULE:FREQ=DAILY;COUNT=' + days.length);
  document.querySelectorAll('a[data-gall]').forEach(function(a){ a.href = gAll; a.target = '_blank'; a.rel = 'noopener' });
  /* a single day (the VIP Q&A card) */
  document.querySelectorAll('a[data-g]').forEach(function(a){
    var d = a.getAttribute('data-g'), e = EV[d];
    a.href = gcal(e[0], d, e[1] + '\n\nPrint your Head start page before Day 1: ' + SHEET);
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* getting ready: the four steps at the top fill the progress bar (saved in this browser only). The seat counts as the
     first 40%; WhatsApp, the inbox, the calendar and the 7 quick questions are 15% each. The smaller things below tick their own cards. */
  var STEPS = C.STEPS || ['wa', 'mail', 'cal', 'survey'], ALL = STEPS.concat(['sheet', 'hi']), st = {}, ST_KEY = 'ana_ready_' + (C.PAGE || 'reg');
  try { st = JSON.parse(localStorage.getItem(ST_KEY) || '{}') } catch (e) {}
  var ticket = document.querySelector('.cxa, .tkt, .pcard'), wasReady = null;
  var CAPS = C.PAGE === 'vip'
    ? ['Your VIP seat is saved. 4 quick steps to go.', '3 steps to go.', '2 steps to go.', 'One step to go: your exit number.', 'All set. See you Tue Nov 17.']
    : ['Your seat is saved. 4 quick steps to go.', '3 steps to go.', '2 steps to go.', 'One step to go: your exit number.', 'All set. See you Tue Nov 17.'];
  function renderReady(){
    var n = 0;
    ALL.forEach(function(s){
      var on = !!st[s]; if (on && STEPS.indexOf(s) > -1) n++;
      document.body.classList.toggle('did-' + s, on);
      document.querySelectorAll('[data-card="' + s + '"],[data-ph="' + s + '"]').forEach(function(e){ e.classList.toggle('done', on) });
      document.querySelectorAll('button[data-step="' + s + '"]').forEach(function(b){ b.setAttribute('aria-pressed', on ? 'true' : 'false') });
    });
    var pct = 40 + Math.round(60 * n / STEPS.length);
    document.querySelectorAll('[data-done]').forEach(function(e){ e.textContent = n });
    document.querySelectorAll('[data-pct]').forEach(function(e){ e.textContent = pct });
    document.querySelectorAll('.cx-prog').forEach(function(e){ e.style.setProperty('--p', pct); e.setAttribute('aria-valuenow', pct) });
    document.querySelectorAll('[data-cap]').forEach(function(e){ e.textContent = CAPS[n] || CAPS[CAPS.length - 1] });
    var ready = n === STEPS.length;
    document.body.classList.toggle('is-ready', ready);
    if (ready && wasReady === false && ticket) burst(ticket, 46);
    wasReady = ready;
  }
  function mark(s, toggle){
    st[s] = toggle ? !st[s] : true;
    try { localStorage.setItem(ST_KEY, JSON.stringify(st)) } catch (e) {}
    renderReady();
  }
  document.querySelectorAll('[data-step]').forEach(function(el){
    el.addEventListener('click', function(e){
      if (el.tagName === 'A' && el.getAttribute('href') === '#') e.preventDefault(); /* a link that isn't set yet (demo) */
      mark(el.getAttribute('data-step'), el.tagName === 'BUTTON');
    });
  });

  /* a burst of her sunflowers and confetti: on arrival, and when the ticket is ready */
  function burst(el, n){
    if (reduce || !el.animate) return;
    var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * .35;
    var cols = ['#F72585', '#FFD400', '#1A1412', '#FF7FB6', '#FFD400'];
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i'), flower = i % 4 === 0;
      p.className = 'cf' + (flower ? ' fl' : '');
      if (flower) p.innerHTML = '<svg><use href="#sf"/></svg>';
      else p.style.background = cols[i % cols.length];
      p.style.left = cx + 'px'; p.style.top = cy + 'px';
      document.body.appendChild(p);
      var a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 260, dx = Math.cos(a) * d, dy = Math.sin(a) * d * .7 - 60;
      var rot = (Math.random() - .5) * 720;
      p.animate([
        {transform: 'translate(-50%,-50%) scale(.4) rotate(0deg)', opacity: 1},
        {transform: 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(1) rotate(' + rot / 2 + 'deg)', opacity: 1, offset: .45},
        {transform: 'translate(calc(-50% + ' + dx * 1.1 + 'px), calc(-50% + ' + (dy + 220) + 'px)) scale(.9) rotate(' + rot + 'deg)', opacity: 0}
      ], {duration: 1500 + Math.random() * 900, easing: 'cubic-bezier(.2,.7,.3,1)'}).onfinish = (function(q){ return function(){ q.remove() } })(p);
    }
  }
  renderReady();
  /* the arrival burst, once the ticket or pass is on screen (on phones it sits under the video) */
  if (ticket && 'IntersectionObserver' in window) {
    var bo2 = new IntersectionObserver(function(es){
      if (!es[0].isIntersecting) return;
      bo2.disconnect(); setTimeout(function(){ burst(ticket, C.PAGE === 'vip' ? 70 : 40) }, 550);
    }, {threshold: .6});
    bo2.observe(ticket);
  }

  /* bookmark: show the shortcut for their computer */
  if (!/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) document.querySelectorAll('.bmk kbd').forEach(function(k){ k.style.display = k.classList.contains('win') ? 'inline-block' : 'none' });

  /* the address her emails come from, in the inbox notice */
  if (C.SENDER) document.querySelectorAll('[data-sender]').forEach(function(e){ e.textContent = C.SENDER });

  /* Meta pixel, for show-up ads to registrants: CompleteRegistration here, Purchase on the VIP confirmation */
  if (C.META_PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', C.META_PIXEL_ID); fbq('track', 'PageView');
    if (C.PAGE === 'vip') fbq('track', 'Purchase', {value: 67, currency: 'USD'}); else fbq('track', 'CompleteRegistration');
  }

  /* links that are settings */
  document.querySelectorAll('[data-link]').forEach(function(a){ var u = C[a.getAttribute('data-link')]; if (u) a.href = u });

  /* the video players. Main: autoplay muted with "tap for sound". Others: click to play. Cover stays when there's no file yet. */
  document.querySelectorAll('.iph[data-src]').forEach(function(ph){
    var src = C[ph.getAttribute('data-src')], v = ph.querySelector('video'), scr = ph.querySelector('.scr');
    if (!src) return;
    var auto = ph.hasAttribute('data-auto') && !reduce;
    function sound(){ v.muted = false; ph.classList.add('on', 'sound'); var pr = v.play(); if (pr && pr.catch) pr.catch(function(){}); track('video_play_' + ph.getAttribute('data-src').toLowerCase()) }
    if (auto) {
      v.src = src; v.muted = true; v.loop = false; v.preload = 'auto';
      var pr = v.play(); if (pr && pr.then) pr.then(function(){ ph.classList.add('on') }).catch(function(){});
    }
    scr.addEventListener('click', function(){
      if (!v.src) v.src = src;
      if (!ph.classList.contains('sound')) { if (auto) v.currentTime = 0; sound() }
      else if (v.paused) v.play(); else v.pause();
    });
    ph.seek = function(t){ if (!v.src) v.src = src; v.currentTime = t; sound() };
  });
  document.querySelectorAll('.chap button').forEach(function(b){
    b.addEventListener('click', function(){
      var ph = document.querySelector('.iph[data-src]');
      if (ph && ph.seek) ph.seek(+b.getAttribute('data-t'));
    });
  });
  document.querySelectorAll('.bo').forEach(function(bo, i){
    bo.addEventListener('click', function(){
      var src = (C.BREAKOUTS || [])[i];
      if (bo.querySelector('video')) return;
      if (!src) { bo.querySelector('.pl > span').textContent = "Ana's answer is on its way"; return }
      var v = document.createElement('video'); v.src = src; v.controls = true; v.playsInline = true; v.autoplay = true;
      bo.querySelector('.th').appendChild(v); track('video_play_breakout_' + (i + 1));
    });
  });

  /* the question forms: a second Kit form each, the email as a hidden field. With no form id, nothing is sent (demo). */
  document.querySelectorAll('.qf').forEach(function(box){
    var f = box.querySelector('form'), id = C[box.getAttribute('data-form')];
    var em = f.querySelector('input[name=email_address]');
    if (email) em.value = email; else { box.classList.add('need-email'); em.type = 'email'; em.required = true }
    f.addEventListener('submit', function(e){
      e.preventDefault();
      if (!f.reportValidity()) return;
      var b = f.querySelector('button[type=submit]'); b.disabled = true;
      function done(){ box.classList.add('done'); track('question_' + box.getAttribute('data-form').toLowerCase()) }
      if (!id) { done(); return }
      fetch('https://app.kit.com/forms/' + id + '/subscriptions', {method:'POST', body:new URLSearchParams(new FormData(f)), headers:{'Accept':'application/json'}}).then(done, done);
    });
  });


  /* ---- step 3: the 7 quick questions, inline on the page, all taps. Then the exit number calculator (/exit-number/).
     The answers post to /api/ana-survey, which adds a row to the Google Sheet (tools/survey-sheet.gs). ---- */
  var isVip = C.PAGE === 'vip';
  var localTime = '';
  try {
    var tz2 = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz2 && tz2 !== 'America/New_York') {
      var q = {};
      new Intl.DateTimeFormat('en-US', {hour:'numeric', minute:'2-digit', hour12:true}).formatToParts(new Date(Date.UTC(2026,10,17,17,0))).forEach(function(x){ q[x.type] = x.value });
      if (q.hour && q.dayPeriod) localTime = 'That’s ' + q.hour + ':' + q.minute + ' ' + q.dayPeriod.toLowerCase() + ' where you are.';
    }
  } catch (e) {}
  var QS = [
    {id:'q1', q:'Can you be there live, 12:00 to 1:30 pm New York, Tue Nov 17 to Thu Nov 19?', note: localTime,
     o:['Yes, all three days', 'Some of it, around work', 'Probably not']},
    {id:'q2', q:'How many subscribers do you have right now?', note:'No newsletter? Pick “None yet.” Every answer here is a normal place to start.',
     o:['None yet', 'Under 100', '100 to 1,000', '1,000 to 10,000', 'More than 10,000']},
    {id:'q3', q:'Have you bought something from me before?', note:'Pick all that fit.', multi:true, only:2,
     o:['Yes, a workshop or course', 'Yes, I’m a paid subscriber', 'Not yet']},
    {id:'q4', q:'What’s your work right now?',
     o:['A job, and I want a way out', 'A job I like, plus something of my own on the side', 'I work for myself: coaching, consulting, freelancing or my own thing', 'Between jobs, or retired', 'Something else']},
    {id:'q5', q:'Which one sounds most like you?', note:'Pick the loudest.',
     o:['“It feels wrong to charge for something that comes easy to me.”', '“I wouldn’t know what to sell.”', '“I need more subscribers first.”', '“Asking for money feels pushy.”', '“I don’t have the time.”', '“This works for other people, not for people like me.”']},
    {id:'q6', q:'What do people come to you for help with?', note:'Pick the closest.',
     o:['Work and career', 'Writing and creativity', 'Health, food or fitness', 'Money and business', 'Family, home and relationships', 'Something else']},
    {id:'q7', q:'By Nov 19, these three days were worth it if I...',
     o:['know what I’d sell', 'have a price I can say without wincing', 'have my first ask written', 'actually send it to someone', 'all of the above, obviously']}
  ];
  var SV_KEY = 'ana_survey2', sv = {a:{}, i:1, done:false};
  try { var sv0 = JSON.parse(localStorage.getItem(SV_KEY) || 'null'); if (sv0 && sv0.a) sv = sv0 } catch (e) {}
  function saveSv(){ try { localStorage.setItem(SV_KEY, JSON.stringify(sv)) } catch (e) {} }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c] }) }
  function answers(){
    var a = {};
    QS.forEach(function(s){ var v = sv.a[s.id]; if (v != null) a[s.id] = [].concat(v).map(function(k){ return s.o[k] }).join(' | ') });
    return a;
  }
  function sendSurvey(){
    track('survey_done');
    var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '' } catch (e) {}
    try {
      return fetch(C.SURVEY_API || '/api/ana-survey', {method:'POST', headers:{'Content-Type':'application/json'}, keepalive:true,
        body: JSON.stringify({kind:'survey', page:isVip ? 'vip' : 'reg', first:first, email:email, ref:ref, tz:tz, answers:answers()})}).catch(function(){});
    } catch (e) {}
  }
  function exitHref(){
    var p = ['p=' + (isVip ? 'vip' : 'reg')];
    if (first) p.push('first=' + encodeURIComponent(first));
    if (sv.done) p.push('sv=1');   /* the calculator opens only after the 7 questions */
    return (C.EXIT_URL || '../exit-number/') + '?' + p.join('&');
  }
  var root = document.getElementById('svx');
  if (root) {
    var LETTERS = 'ABCDEF', dir = 'r';
    /* the locked calculator beside the questions: one segment per answered question, open at 7 of 7 */
    var lockEl = document.getElementById('cxl'), lastPow = -1;
    var power = function(){
      if (!lockEl) return;
      var n = QS.filter(function(s){ var v = sv.a[s.id]; return v != null && [].concat(v).length > 0 }).length;
      lockEl.querySelectorAll('[data-pow]').forEach(function(e){ e.textContent = n });
      lockEl.querySelectorAll('.cxl-seg i').forEach(function(e, k){ e.classList.toggle('on', k < n); e.classList.toggle('new', lastPow > -1 && k === n - 1 && n > lastPow) });
      for (var k = 0; k <= QS.length; k++) lockEl.classList.toggle('p' + k, k === n);
      lockEl.classList.toggle('open', !!sv.done);
      var st = lockEl.querySelector('.cxl-st'); if (st) st.textContent = sv.done ? 'open' : 'locked';
      var go2 = lockEl.querySelector('.cxl-go'); if (go2) go2.href = exitHref();
      lastPow = n;
    };
    var render = function(focus){
      var h, i = sv.i;
      root.classList.toggle('end', !!sv.done && i > QS.length);
      if (i > QS.length) {
        h = '<div class="svx-end"><span class="svx-ok" aria-hidden="true"><svg viewBox="0 0 16 16"><use href="#ck"/></svg></span>'
          + '<h3 id="svx-q" tabindex="-1">Thank you' + (first ? ', ' + esc(first) : '') + '. <em>Your calculator is unlocked.</em></h3>'
          + '<p>Your answers set it up. Put in the monthly number that would give you more choice about work, and a price for your offer. You’ll see how many people it takes, and what the same goal would take through paid subscriptions alone.</p>'
          + '<div class="svx-act"><a class="btn" href="' + esc(exitHref()) + '" data-track="exit_open">open my exit number calculator<svg aria-hidden="true"><use href="#arr"/></svg></a></div>'
          + '<button type="button" class="svx-redo">change my answers</button></div>';
      } else {
        var s = QS[i - 1], v = sv.a[s.id], sel = [].concat(v == null ? [] : v);
        h = '<div class="svx-top"><button type="button" class="svx-back"' + (i === 1 ? ' hidden' : '') + '>&larr; back</button><span class="svx-n" aria-live="polite">Question ' + i + ' of ' + QS.length + '</span><span class="svx-t">about a minute</span></div>'
          + '<div class="svx-bar" aria-hidden="true"><i style="width:' + ((i - 1) / QS.length * 100) + '%"></i></div>'
          + '<h3 id="svx-q" tabindex="-1">' + esc(s.q) + '</h3>' + (s.note ? '<p class="svx-note">' + esc(s.note) + '</p>' : '')
          + '<div class="svx-opts' + (s.multi ? ' multi' : '') + '" role="' + (s.multi ? 'group' : 'radiogroup') + '" aria-labelledby="svx-q">'
          + s.o.map(function(o, k){ var on = sel.indexOf(k) > -1; return '<button type="button" class="svx-o' + (on ? ' on' : '') + '" role="' + (s.multi ? 'checkbox' : 'radio') + '" aria-checked="' + on + '" data-k="' + k + '"><span class="k" aria-hidden="true">' + (s.multi ? '<svg viewBox="0 0 16 16"><use href="#ck"/></svg>' : LETTERS[k]) + '</span><span class="t">' + esc(o) + '</span></button>' }).join('')
          + '</div>' + (s.multi ? '<div class="svx-act"><button type="button" class="btn svx-next"' + (sel.length ? '' : ' disabled') + '>next<svg aria-hidden="true"><use href="#arr"/></svg></button></div>' : '');
      }
      root.innerHTML = h;
      power();
      root.classList.remove('in-r', 'in-l');
      if (focus && !reduce) { void root.offsetWidth; root.classList.add('in-' + dir) }
      if (focus) {
        var hq = root.querySelector('#svx-q'); if (hq) try { hq.focus({preventScroll:true}) } catch (e) { hq.focus() }
        var r = root.getBoundingClientRect(); if (r.top < 70) root.scrollIntoView({block:'start', behavior: reduce ? 'auto' : 'smooth'});
      }
    };
    var go = function(i){ dir = i >= sv.i ? 'r' : 'l'; sv.i = i; saveSv(); render(true) };
    var finish = function(){
      var first_time = !sv.done;
      sv.done = true; sv.i = QS.length + 1; saveSv(); mark('survey'); dir = 'r';
      if (first_time || sv.changed) sendSurvey();
      sv.changed = false; saveSv();
      render(true);
      if (first_time) burst(root, 36);
    };
    root.addEventListener('click', function(e){
      var o = e.target.closest('.svx-o');
      if (o) {
        var s = QS[sv.i - 1], k = +o.getAttribute('data-k');
        sv.changed = sv.done;
        if (s.multi) {
          var cur = [].concat(sv.a[s.id] == null ? [] : sv.a[s.id]), at = cur.indexOf(k);
          if (at > -1) cur.splice(at, 1); else if (k === s.only) cur = [k]; else { cur = cur.filter(function(x){ return x !== s.only }); cur.push(k) }
          sv.a[s.id] = cur; saveSv(); render(false);
          var nb = root.querySelector('.svx-o[data-k="' + k + '"]'); if (nb) nb.focus();
        } else {
          sv.a[s.id] = k; saveSv(); power();
          root.querySelectorAll('.svx-o').forEach(function(x){ x.classList.toggle('on', x === o); x.setAttribute('aria-checked', x === o) });
          var bar = root.querySelector('.svx-bar i'); if (bar) bar.style.width = (sv.i / QS.length * 100) + '%';
          setTimeout(function(){ if (sv.i < QS.length) go(sv.i + 1); else finish() }, reduce ? 0 : 220);
        }
        return;
      }
      if (e.target.closest('.svx-next')) { if (sv.i < QS.length) go(sv.i + 1); else finish(); return }
      if (e.target.closest('.svx-back')) { if (sv.i > 1) go(sv.i - 1); return }
      if (e.target.closest('.svx-redo')) { go(1); return }
      var tr = e.target.closest('[data-track]'); if (tr) track(tr.getAttribute('data-track'));
    });
    /* A to F picks an answer, Enter moves on from the multi-pick question */
    root.addEventListener('keydown', function(e){
      if (sv.i > QS.length || e.metaKey || e.ctrlKey || e.altKey) return;
      var k = LETTERS.indexOf(String(e.key).toUpperCase());
      if (k > -1 && k < QS[sv.i - 1].o.length) { var b = root.querySelector('.svx-o[data-k="' + k + '"]'); if (b) { e.preventDefault(); b.click() } }
    });
    if (sv.done) sv.i = QS.length + 1;
    render(false);
  }
  document.querySelectorAll('a[href="#survey"]').forEach(function(a){ a.addEventListener('click', function(){ track('survey_jump') }) });
  if (C.SENDER) document.querySelectorAll('a[data-mail="gmail"]').forEach(function(a){ a.href = 'https://mail.google.com/mail/u/0/#search/' + encodeURIComponent(C.SENDER) });

  /* second chance at VIP: back to the VIP page with the name and email, gone after Tue Nov 17, 11:59 pm New York */
  var now0 = qs.get('now') ? Date.parse(qs.get('now')) : Date.now();
  if (C.CLOSES && now0 >= C.CLOSES) document.body.classList.add('vip-closed');
  document.querySelectorAll('a.vipback').forEach(function(a){
    var p = [];
    if (first) p.push('first=' + encodeURIComponent(first));
    if (email) p.push('email=' + encodeURIComponent(email));
    if (ref) p.push('ref=' + encodeURIComponent(ref));
    if (p.length) a.href = a.getAttribute('href') + '?' + p.join('&');
  });

  /* reveal */
  var els = document.querySelectorAll('[data-r]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }) }, {rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){ io.observe(e) });
  } else els.forEach(function(e){ e.classList.add('in') });
})();
