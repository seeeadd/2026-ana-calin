/* A seat is saved only when the registration endpoint confirms success. */
(function (root) {
  async function submit(fetcher, url, data) {
    var response = await fetcher(url, {
      method: 'POST', body: data, headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Registration request failed');
    var result = await response.json();
    if (!result || result.ok !== true) throw new Error('Registration was not confirmed');
    return result;
  }
  var api = { submit: submit };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AnaRegistration = api;
})(typeof window === 'undefined' ? globalThis : window);
