/* The Exit Number: every calculation in one place (spec v1.0, Nov 1 2026). The page, the printed plan and the tests all
   use this file, so they can never disagree.
   Units, all whole numbers held as BigInt so nothing is rounded on the way:
     money   cents                      ($12.34 -> 1234n)
     percent hundredths of a percent    (2.9% -> 290n, 100% -> 10000n)
     hours   hundredths of an hour      (1.5 h -> 150n)
     counts  whole numbers
   Unknown is null, never zero. Explicit zero is 0n. */
(function (root) {
  'use strict';

  var CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD', 'SGD'];
  var SCHEMA = 1, CALC = 1;

  /* ---------- reading what people type ---------- */
  /* kind: money | pct | hours | count. Bounds are in the kind's own units (see above). */
  var FIELDS = {
    goal:     {kind: 'money', min: 1n, max: 100000000n},
    price:    {kind: 'money', min: 1n, max: 100000000n},
    k:        {kind: 'pct',   min: 0n, max: 10000n},
    v:        {kind: 'money', min: 0n, max: 100000000n},
    F:        {kind: 'money', min: 0n, max: 100000000n},
    A:        {kind: 'count', min: 0n, max: 10000000n},
    subs:     {kind: 'count', min: 0n, max: 10000000n},
    r:        {kind: 'pct',   min: 0n, max: 10000n},
    W:        {kind: 'hours', min: 0n, max: 16800n},
    B:        {kind: 'hours', min: 0n, max: 1000000n},
    d:        {kind: 'hours', min: 0n, max: 1000000n},
    H:        {kind: 'hours', min: 0n, max: 1000000n},
    S:        {kind: 'hours', min: 0n, max: 1000000n},
    clientH:  {kind: 'hours', min: 0n, max: 1000000n},
    C:        {kind: 'count', min: 1n, max: 1000000n},
    collected:{kind: 'money', min: 0n, max: 100000000n},
    refunds:  {kind: 'money', min: 0n, max: 100000000n},
    fees:     {kind: 'money', min: 0n, max: 100000000n},
    delivery: {kind: 'money', min: 0n, max: 100000000n},
    fixed:    {kind: 'money', min: 0n, max: 100000000n},
    hours:    {kind: 'hours', min: 0n, max: 1000000n},
    recips:   {kind: 'count', min: 0n, max: 10000000n},
    buyers:   {kind: 'count', min: 0n, max: 10000000n}
  };
  var PLACES = {money: 2, pct: 2, hours: 2, count: 0};

  /* "1,250.5" -> {ok:true, v:125050n}; "" -> {blank:true}; anything else -> {err:"..."} with words a person can act on */
  function parse(field, raw) {
    var f = FIELDS[field];
    var s = String(raw == null ? '' : raw).trim();
    if (s === '') return {blank: true};
    if (/^-/.test(s.replace(/[^\d.\-]/g, ''))) return {err: 'Enter a number of ' + show(f.min, f.kind) + ' or more.'};
    s = s.replace(/[\s,$€£%]/g, '').replace(/^(?:[A-Za-z]{1,3})(?=\d|\.)/, '');
    var places = PLACES[f.kind];
    var re = places ? /^(\d+)(?:\.(\d*))?$/ : /^(\d+)$/;
    var m = s.match(re);
    if (!m || (m[2] !== undefined && m[2].length > places)) {
      return {err: places ? 'Enter a number, with at most ' + places + ' decimals.' : 'Enter a whole number.'};
    }
    var frac = (m[2] || '');
    while (frac.length < places) frac += '0';
    var v = BigInt(m[1].replace(/^0+(?=\d)/, '') + frac);
    if (v < f.min || v > f.max) return {err: 'Enter a number from ' + show(f.min, f.kind) + ' to ' + show(f.max, f.kind) + '.'};
    return {ok: true, v: v};
  }
  /* back to the string we store: 125050n (money) -> "1250.5" */
  function toStr(v, kind) {
    if (v == null) return null;
    var places = PLACES[kind];
    if (!places) return v.toString();
    var neg = v < 0n, a = neg ? -v : v, d = 10n ** BigInt(places);
    var i = (a / d).toString(), fr = (a % d).toString().padStart(places, '0').replace(/0+$/, '');
    return (neg ? '-' : '') + i + (fr ? '.' + fr : '');
  }
  function show(v, kind) {
    var s = toStr(v, kind), p = s.split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return p.join('.') + (kind === 'pct' ? '%' : '');
  }

  /* ---------- small exact helpers ---------- */
  function ceilDiv(a, b) { return a <= 0n ? -((-a) / b) : (a + b - 1n) / b }   /* b > 0 */
  function floorDiv(a, b) { return a >= 0n ? a / b : -(((-a) + b - 1n) / b) }  /* b > 0 */
  /* round half away from zero: x is in units of 1/scale cents -> whole cents */
  function toCents(x, scale) {
    if (scale === 1n) return x;
    var h = scale / 2n;
    return x >= 0n ? (x + h) / scale : -(((-x) + h) / scale);
  }

  /* ---------- the plan for one price ---------- */
  /* in: G, P (cents), basis 'sales'|'profit', k (pct), v, F (cents), A, r, W, mode 'per'|'group'|'undecided'|null,
         B, d, C, H, S, clientH. Any of them may be null (unknown). */
  function scenario(i) {
    var o = {basis: i.basis === 'profit' ? 'profit' : 'sales'};
    var G = i.G, P = i.P;
    o.hasGoal = G != null && G > 0n;
    o.hasPrice = P != null && P > 0n;
    if (!o.hasGoal || !o.hasPrice) return o;

    /* sales before costs: always available */
    o.salesN = ceilDiv(G, P);
    o.salesGross = o.salesN * P;

    /* costs: only when all three are known (zero counts as known) */
    o.costsKnown = i.k != null && i.v != null && i.F != null;
    if (o.costsKnown) {
      o.c = P * (10000n - i.k) - i.v * 10000n;     /* cash left per purchase, in 1/10000 cents */
      o.sellPer = P * i.k;                          /* the percentage costs and allowance per purchase, 1/10000 cents */
      o.F = i.F;
      o.unitLoss = o.c <= 0n;
    }

    /* the purchase count this plan is built on */
    if (o.basis === 'profit') {
      if (!o.costsKnown) { o.N = o.salesN; o.nBasis = 'sales'; o.needCosts = true }
      else if (o.c > 0n) { o.N = ceilDiv((G + i.F) * 10000n, o.c); o.nBasis = 'profit' }
      else { o.N = null; o.impossible = true; o.nBasis = 'profit' }
    } else { o.N = o.salesN; o.nBasis = 'sales' }

    if (o.N != null) {
      o.gross = o.N * P;
      if (o.costsKnown) o.profit = o.N * o.c - i.F * 10000n;   /* 1/10000 cents, before personal tax */
    }

    /* audience: the share of a known group that would need to buy once */
    if (o.N != null && i.A != null) {
      o.A = i.A;
      if (i.A === 0n) o.audZero = true;
      else { o.rate = {num: o.N, den: i.A}; o.overReach = o.N > i.A }
    }
    if (o.N != null && i.r != null) {
      if (i.r === 0n) o.rZero = true;
      else o.reachAtR = ceilDiv(o.N * 10000n, i.r);
    }

    /* time: recurring hours a month, against the hours available */
    var mode = i.mode;
    if (o.N != null && (mode === 'per' || mode === 'group')) {
      var need = i.B != null && i.d != null && (mode === 'per' || (i.C != null && i.H != null));
      if (need) {
        o.groups = mode === 'group' ? ceilDiv(o.N, i.C) : null;
        o.recurring = i.B + o.N * i.d + (mode === 'group' ? o.groups * i.H : 0n);   /* hundredths of an hour */
        if (i.S != null) o.firstCycle = o.recurring + i.S;
        if (i.clientH != null) o.regained = i.clientH - o.recurring;
      } else o.timeMissing = true;
    }
    if (i.W != null) {
      o.budgetU = i.W * 52n;                                  /* units of 1/1200 hour: W x 52 / 12 */
      if (o.recurring != null) {
        o.overU = o.recurring * 12n - o.budgetU;              /* positive: over budget */
        if (mode === 'per' && i.d != null && i.B != null) {
          if (i.d > 0n) o.capacity = o.budgetU >= i.B * 12n ? floorDiv(o.budgetU - i.B * 12n, i.d * 12n) : null;
          else o.noPerBuyerLimit = true;
          o.sharedOver = o.budgetU < i.B * 12n;
        }
      }
    }
    return o;
  }

  /* ---------- what actually happened in a month ---------- */
  function actual(a) {
    var o = {};
    var parts = [a.collected, a.refunds, a.fees, a.delivery, a.fixed];
    o.complete = parts.every(function (x) { return x != null });
    if (a.collected != null && a.refunds != null) o.netCollected = a.collected - a.refunds;
    if (o.complete) o.profit = a.collected - a.refunds - a.fees - a.delivery - a.fixed;   /* cents, before personal tax */
    o.refundsOver = a.collected != null && a.refunds != null && a.refunds > a.collected;
    if (a.recips != null && a.buyers != null) {
      if (a.recips === 0n) o.rateNone = true;
      else if (a.buyers > a.recips) o.rateMismatch = true;
      else o.rate = {num: a.buyers, den: a.recips};
    }
    return o;
  }

  /* ---------- months ---------- */
  function monthsTo(target, now) {
    var m = /^(\d{4})-(\d{2})$/.exec(target || '');
    if (!m) return null;
    var d = now || new Date();
    return (+m[1] * 12 + (+m[2] - 1)) - (d.getFullYear() * 12 + d.getMonth());
  }
  function ym(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') }

  /* ---------- showing numbers ---------- */
  var NF = {};
  function money(x, cur, scale) {
    if (x == null) return '';
    var c = toCents(x, scale == null ? 1n : scale);
    var whole = c % 100n === 0n;
    var key = cur + (whole ? '0' : '2');
    if (!NF[key]) NF[key] = new Intl.NumberFormat('en-US', {style: 'currency', currency: cur, minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: whole ? 0 : 2});
    return NF[key].format(Number(c) / 100);
  }
  function int(x) { return x == null ? '' : show(x, 'count') }
  /* num/den as a percent: one decimal, more only when a positive rate would otherwise show as 0% */
  function pct(num, den) {
    for (var dp = 1; dp <= 7; dp++) {
      var s = 10n ** BigInt(dp);
      var q = (num * 100n * s * 2n + den) / (den * 2n);           /* rounded to dp decimals */
      if (q > 0n || num === 0n || dp === 7) {
        var i = (q / s).toString(), fr = (q % s).toString().padStart(dp, '0');
        if (dp === 1) fr = fr.replace(/0$/, '');
        return (i.replace(/\B(?=(\d{3})+(?!\d))/g, ',')) + (fr ? '.' + fr : '') + '%';
      }
    }
  }
  /* hours: hundredths -> "17.3"; U (1/1200 hour) via hoursU */
  function hrs(h) { return h == null ? '' : one(Number(h) / 100) }
  function hoursU(u) { return u == null ? '' : one(Number(u) / 1200) }
  function one(x) { var s = (Math.round(x * 10) / 10).toFixed(1); return s.replace(/\.0$/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') }

  /* ---------- the saved plan: shape, defaults and import checks ---------- */
  function blankScenario(id, price) {
    return {id: id, price: price, priceEdited: false,
      costs: {k: null, v: null, F: null},
      time: {mode: null, B: null, d: null, C: null, H: null, S: null},
      audience: {A: null, r: null, rSource: null}};
  }
  function newPlan(now) {
    var t = (now || new Date()).toISOString();
    return {schemaVersion: SCHEMA, calculationVersion: CALC, createdAt: t, updatedAt: t, currency: 'USD',
      context: {employment: null, employmentSource: null, subscribers: null, subscribersSource: null, subscribersRange: null, weeklyHours: null, clientHours: null},
      goal: {type: null, amount: null, basis: 'sales', targetMonth: null},
      scenarios: [blankScenario('s1', '50'), blankScenario('s2', '150'), blankScenario('s3', '500')],
      selected: null, actuals: []};
  }
  var EMPLOY = ['job_out', 'job_side', 'self', 'between', 'other'];
  var GOALS = ['extra', 'client', 'leave'];
  var MODES = ['per', 'group', 'undecided'];
  var MONTH = /^(20\d\d|2100)-(0[1-9]|1[0-2])$/;

  /* an imported file is untrusted: every value is re-read through the same checks as typing, unknown keys are dropped,
     and no number from the file is used as a result (results are always recomputed) */
  function validatePlan(obj) {
    var errs = [];
    function fail(m) { errs.push(m); return null }
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {errors: ['This file is not an exit number plan.']};
    if (obj.schemaVersion !== SCHEMA) return {errors: ['This plan was saved by a different version of the calculator.']};
    var p = newPlan();
    function str(x, max) { return typeof x === 'string' && x.length <= (max || 40) ? x : null }
    function val(field, x, where) {
      if (x == null) return null;
      if (typeof x !== 'string' && typeof x !== 'number') return fail(where + ' is not a number.');
      var r = parse(field, String(x));
      if (r.blank) return null;
      if (r.err) return fail(where + ': ' + r.err);
      return toStr(r.v, FIELDS[field].kind);
    }
    function iso(x) { return typeof x === 'string' && x.length <= 40 && !isNaN(Date.parse(x)) ? new Date(x).toISOString() : null }
    p.createdAt = iso(obj.createdAt) || p.createdAt;
    p.updatedAt = iso(obj.updatedAt) || p.updatedAt;
    if (CURRENCIES.indexOf(obj.currency) < 0) fail('The currency is not one this calculator supports.'); else p.currency = obj.currency;
    var cx = obj.context || {};
    if (cx.employment != null) { if (EMPLOY.indexOf(cx.employment) < 0) fail('Work situation is not recognised.'); else p.context.employment = cx.employment }
    p.context.employmentSource = cx.employmentSource === 'survey' || cx.employmentSource === 'user' ? cx.employmentSource : null;
    p.context.subscribers = val('subs', cx.subscribers, 'Current subscribers');
    p.context.subscribersSource = cx.subscribersSource === 'survey' || cx.subscribersSource === 'user' ? cx.subscribersSource : null;
    p.context.subscribersRange = str(cx.subscribersRange, 40);
    p.context.weeklyHours = val('W', cx.weeklyHours, 'Hours available each week');
    p.context.clientHours = val('clientH', cx.clientHours, 'Hours the client takes');
    var g = obj.goal || {};
    if (g.type != null) { if (GOALS.indexOf(g.type) < 0) fail('The goal type is not recognised.'); else p.goal.type = g.type }
    p.goal.amount = val('goal', g.amount, 'Monthly goal');
    p.goal.basis = g.basis === 'profit_before_personal_tax' || g.basis === 'profit' ? 'profit' : 'sales';
    if (g.targetMonth != null) { if (!MONTH.test(String(g.targetMonth))) fail('The target month is not a valid month.'); else p.goal.targetMonth = g.targetMonth }
    var sc = obj.scenarios;
    if (!Array.isArray(sc) || sc.length < 1 || sc.length > 3) fail('A plan holds one to three prices.');
    else {
      p.scenarios = sc.map(function (s, n) {
        s = s || {};
        var id = 's' + (n + 1), o = blankScenario(id, null), w = 'Price ' + (n + 1);
        o.price = val('price', s.price, w);
        o.priceEdited = s.priceEdited === true;
        var c = s.costs || {};
        o.costs = {k: val('k', c.k, w + ' selling costs'), v: val('v', c.v, w + ' cash cost per purchase'), F: val('F', c.F, w + ' fixed costs')};
        var t = s.time || {};
        o.time = {mode: MODES.indexOf(t.mode) >= 0 ? t.mode : null, B: val('B', t.B, w + ' shared hours'), d: val('d', t.d, w + ' hours per purchaser'),
          C: val('C', t.C, w + ' group size'), H: val('H', t.H, w + ' hours per group'), S: val('S', t.S, w + ' setup hours')};
        var a = s.audience || {};
        o.audience = {A: val('A', a.A, w + ' recipients'), r: val('r', a.r, w + ' purchase rate'), rSource: null};
        if (a.rSource && MONTH.test(String(a.rSource.month))) o.audience.rSource = {month: a.rSource.month, price: val('price', a.rSource.price, w + ' rate source price')};
        o._oldId = typeof s.id === 'string' ? s.id.slice(0, 20) : null;
        return o;
      });
      var sel = null;
      p.scenarios.forEach(function (o) { if (obj.selected != null && o._oldId === obj.selected) sel = o.id; delete o._oldId });
      p.selected = sel;
    }
    var ac = obj.actuals;
    if (ac != null && (!Array.isArray(ac) || ac.length > 240)) fail('The recorded results could not be read.');
    else if (ac) {
      p.actuals = ac.map(function (r, n) {
        r = r || {};
        var w = 'Result ' + (n + 1);
        if (!MONTH.test(String(r.month))) { fail(w + ' has no valid month.'); return null }
        var o = {id: 'a' + (n + 1), month: r.month};
        ['collected', 'refunds', 'fees', 'delivery', 'fixed', 'hours', 'recips', 'buyers'].forEach(function (k) { o[k] = val(k, r[k], w) });
        var sn = r.snapshot || {};
        o.snapshot = {basis: sn.basis === 'profit' ? 'profit' : 'sales', goal: val('goal', sn.goal, w + ' goal'), currency: CURRENCIES.indexOf(sn.currency) >= 0 ? sn.currency : p.currency,
          price: val('price', sn.price, w + ' price'), k: val('k', sn.k, w), v: val('v', sn.v, w), F: val('F', sn.F, w), W: val('W', sn.W, w),
          mode: MODES.indexOf(sn.mode) >= 0 ? sn.mode : null, B: val('B', sn.B, w), d: val('d', sn.d, w), C: val('C', sn.C, w), H: val('H', sn.H, w)};
        return o;
      }).filter(Boolean);
    }
    if (errs.length) return {errors: errs};
    return {plan: p};
  }

  /* the numbers a plan stores, read back into BigInt for scenario() */
  function big(field, s) { if (s == null) return null; var r = parse(field, s); return r.ok ? r.v : null }
  function inputs(plan, sc) {
    var t = sc.time, c = sc.costs, a = sc.audience;
    return {G: big('goal', plan.goal.amount), P: big('price', sc.price), basis: plan.goal.basis,
      k: big('k', c.k), v: big('v', c.v), F: big('F', c.F),
      A: big('A', a.A), r: big('r', a.r),
      W: big('W', plan.context.weeklyHours), mode: t.mode, B: big('B', t.B), d: big('d', t.d), C: big('C', t.C), H: big('H', t.H), S: big('S', t.S),
      clientH: plan.goal.type === 'client' ? big('clientH', plan.context.clientHours) : null};
  }
  function snapshotInputs(sn) {
    return {G: big('goal', sn.goal), P: big('price', sn.price), basis: sn.basis, k: big('k', sn.k), v: big('v', sn.v), F: big('F', sn.F),
      W: big('W', sn.W), mode: sn.mode, B: big('B', sn.B), d: big('d', sn.d), C: big('C', sn.C), H: big('H', sn.H), S: null, A: null, r: null, clientH: null};
  }

  var api = {CURRENCIES: CURRENCIES, FIELDS: FIELDS, SCHEMA: SCHEMA, CALC: CALC, parse: parse, toStr: toStr, show: show,
    scenario: scenario, actual: actual, monthsTo: monthsTo, ym: ym, money: money, int: int, pct: pct, hrs: hrs, hoursU: hoursU,
    newPlan: newPlan, blankScenario: blankScenario, validatePlan: validatePlan, inputs: inputs, snapshotInputs: snapshotInputs, big: big,
    ceilDiv: ceilDiv, toCents: toCents};
  if (typeof module === 'object' && module.exports) module.exports = api; else root.ExitCalc = api;
})(this);
