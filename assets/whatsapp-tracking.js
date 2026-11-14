/* Tag known registrants when they click WhatsApp on either confirmation page.
   Anonymous visitors still get the link. Keep navigation immediate; Kit runs in the background. */
(function () {
  var sent = {}, pending = {};
  function emailAddress() {
    var qs = new URLSearchParams(location.search), reg = {};
    try { reg = JSON.parse(sessionStorage.getItem('ana_reg') || localStorage.getItem('ana_reg') || '{}') || {} } catch (e) {}
    return String(qs.get('email') || reg.email || '').trim().toLowerCase();
  }
  function record(email, attempt) {
    return fetch('/api/ana-whatsapp/', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ email: email })
    }).then(function (r) {
      if (!r.ok) throw new Error('request');
      return r.json();
    }).then(function (result) {
      if (!result || !result.ok) throw new Error('request');
      if (result.tagged) sent[email] = true;
      delete pending[email];
    }).catch(function () {
      // A brief failure must not permanently mark the click as synced. Retry while this page remains open.
      if (attempt < 2) setTimeout(function () { record(email, attempt + 1) }, (attempt + 1) * 1500);
      else delete pending[email];
    });
  }
  document.querySelectorAll('a[data-track="action_whatsapp"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var href = link.getAttribute('href'), email = emailAddress();
      if (!href || href === '#' || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return;
      if (sent[email] || pending[email]) return;
      pending[email] = true;
      record(email, 0);
    });
  });
})();
