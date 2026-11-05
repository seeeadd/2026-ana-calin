# Waitlist: what to set up in Kit

Page: /waitlist/. Sign-ups go to /api/ana-waitlist (Kit tag `ep_waitlist`) and to the "Exit Plan Waitlist" tab of Ana's sheet.

## Once, before it goes live
1. Sheet: paste the new `tools/survey-sheet.gs` into Apps Script (keep the same KEY), then Deploy > Manage deployments > edit > New version. Run `testWaitlist` once and delete the test row.
2. Kit: nothing to create by hand. The page makes these tags and this field the first time they are needed:
   - tags `ep_waitlist`, `ep_wl_question`, `ep_wl_discuss_ok`
   - custom field "Exit Plan: waitlist question"
3. In the existing registration automation (the one that fires when someone joins the registration form), add the tag `ep_registered`. Everything below uses it to leave out people who already booked.
4. Join the waitlist yourself with a real email. Check in Kit that you are Active and have the tag `ep_waitlist`. If you show as unconfirmed or cannot be emailed, make a Kit form for the waitlist and send its ID to Claude (it becomes KIT_WAITLIST_FORM_ID in Vercel).

## Automations and broadcasts
A. Welcome (automation, trigger: tag `ep_waitlist` added). Send at once. Subject: "You're on the list". Body: your early booking link arrives one day before registration opens to everyone; check Spam or Promotions and move it to Primary; reply to this email if you have a question. No dates until they are confirmed.
B. Question follow-up (automation, trigger: tag `ep_wl_question` added). One short thank-you from Ana ("Got it. Thanks for telling me what you're working on."). Optional. Ana reads the answers in the Kit field or the sheet column `business_question`; only people with `ep_wl_discuss_ok` may be discussed live.
C. Early invite (broadcast). Send one day before public registration opens. To: tag `ep_waitlist`, excluding tag `ep_registered`. The link is the registration page with their details filled in:
   `https://exitplan.howwegrowtoday.com/?ref=waitlist&first_name={{ subscriber.first_name }}&email={{ subscriber.email_address }}`
   (use Kit's own personalisation tags for first name and email). They press one button to confirm. `?ref=waitlist` shows in the Registrants tab and tells you how many waitlisters booked.
D. Reminder (broadcast or sequence step). About 20 hours after C. To: `ep_waitlist`, excluding `ep_registered`. One line: "Your early link is still open."
E. After they register nothing changes: the confirmation page still leads with WhatsApp, then the calendar, then the seven questions and the exit number; VIP stays the optional next page.

## Numbers to watch
- Share of waitlisters who book = rows in the "Exit Plan Waitlist" tab with `registered_at` filled, divided by all rows.
- Share who send a question = rows with `business_question` filled.
- `early_invite_sent_at` is filled by hand (or a paste) when C goes out.

## When the dates are confirmed
- Tell Claude the early-access date and the public registration date. They go into `EARLY_ACCESS` and `PUBLIC_OPENS` at the top of the page script and show under "Your link" and "Public opens" in each visitor's own time.
- Replace nothing else: the schedule line is already worked out in each visitor's own time zone from Tue Dec 8, 12:00 PM New York.
