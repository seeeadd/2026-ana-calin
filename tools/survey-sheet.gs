/*
  Ana Calin, The Exit Plan: the survey answers and exit numbers, into a Google Sheet.

  Set up once (about 5 minutes):
  1. Make a new Google Sheet, for example "The Exit Plan · survey".
  2. Extensions > Apps Script. Delete what's there, paste this whole file.
  3. Change KEY below to a secret word of your own (letters and numbers, no spaces).
  4. Save, then Deploy > New deployment > type "Web app".
     Execute as: Me. Who has access: Anyone. Deploy, allow access, and copy the "Web app URL" (it ends in /exec).
  5. In Vercel, project 2026-ana-calin > Settings > Environment Variables (Production):
       SURVEY_SHEET_URL = the Web app URL
       SURVEY_SHEET_KEY = the same secret word as KEY
     Then redeploy (a changed variable only reaches the site on the next deployment).

  The tabs "Survey", "Exit numbers" and "Summary" make themselves on the first answer.
  If you change this script later: Deploy > Manage deployments > edit > Version: New version (the URL stays the same).
*/
var KEY = 'change-me';

var TABS = {
  survey: {
    name: 'Survey',
    head: ['Time', 'Page', 'First name', 'Email', 'Ref', 'Time zone',
           'Can be there live', 'Subscribers', 'Bought before', 'Work right now', 'Sounds most like them', 'People come to them for', 'Worth it if they'],
    keys: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7']
  },
  exit: {
    name: 'Exit numbers',
    head: ['Time', 'Page', 'First name', 'Email', 'Ref', 'Time zone',
           'Goal per month ($)', 'Offer price ($)', 'Buyers per month', 'Buyers per year', 'Paid sub price ($/month)', 'Paid subscribers needed', 'Free readers needed (at 5%)'],
    keys: ['goal_month', 'price', 'buyers_month', 'buyers_year', 'sub_price', 'subs_needed', 'free_needed']
  }
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    var b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (b.key !== KEY) return out({ ok: false, error: 'key' });
    var r = b.row || {}, t = TABS[r.kind];
    if (!t) return out({ ok: false, error: 'kind' });
    var sh = tab(t);
    var vals = [new Date(), r.page, r.first, r.email, r.ref, r.tz].concat(t.keys.map(function (k) { return r[k] == null ? '' : r[k] }));
    vals = vals.map(function (v) { return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v });
    sh.appendRow(vals);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out({ ok: true, sheet: 'The Exit Plan survey' }) }

function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON) }

function tab(t) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(t.name);
  if (sh) return sh;
  sh = ss.insertSheet(t.name);
  sh.getRange(1, 1, 1, t.head.length).setValues([t.head]).setFontWeight('bold').setBackground('#FFD400');
  sh.setFrozenRows(1);
  sh.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
  if (t.name === 'Survey') summary(ss);
  return sh;
}

// a live count of every answer, one block per question (multi-answers on "Bought before" count each combination)
function summary(ss) {
  var sh = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  sh.clear();
  var t = TABS.survey, cols = ['G', 'H', 'I', 'J', 'K', 'L', 'M'];
  sh.getRange('A1').setValue('Answers so far').setFontWeight('bold');
  sh.getRange('A2').setFormula('=COUNTA(Survey!A2:A)&" people answered"');
  cols.forEach(function (c, i) {
    var col = 1 + i * 3;
    sh.getRange(4, col).setValue(t.head[6 + i]).setFontWeight('bold').setBackground('#FFF1B3');
    sh.getRange(5, col).setFormula('=IFERROR(QUERY(Survey!' + c + '2:' + c + ', "select ' + c + ', count(' + c + ') where ' + c + ' is not null group by ' + c + ' order by count(' + c + ') desc label count(' + c + ') \'\'", 0), "")');
    sh.setColumnWidth(col, 260);
  });
}
