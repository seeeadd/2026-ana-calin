# Waitlist emails and the Kit flow (copy to paste, in Ana's voice, no dates until they are set)

Fill the [BRACKETS] when the dates are confirmed. Plain-looking emails, from Ana's own address, no big images: they land in the inbox more often and read like a note from her.

## The flow, in order
| When | What | Who gets it | Kit |
|---|---|---|---|
| At once | 1. Welcome | everyone who joins | automation, trigger: tag `ep_waitlist` added |
| When they send a question | 2. Thank you | people who send one | automation, trigger: tag `ep_wl_question` added |
| When the dates are set | 3. The dates | `ep_waitlist` | one broadcast |
| 1 day before public registration | 4. Your early link | `ep_waitlist`, not `ep_registered` | broadcast |
| About 20 hours later | 5. Still open | `ep_waitlist`, not `ep_registered` | broadcast |
| After they book | 6. Nothing new | | the existing "EP · Confirmation" email and the confirmation page (WhatsApp first, then calendar, then the seven questions) do this job |

Segments to make once in Kit (saved filters, so you never rebuild them):
- Waitlist, not booked yet = tag `ep_waitlist` and not tag `ep_registered`
- Sent a question = tag `ep_wl_question`
- May be discussed live = tag `ep_wl_discuss_ok`

Rules: one email per day at most; never email the early link to anyone without `ep_waitlist`; send 4 and 5 only to "not booked yet".

---

## 1. Welcome (sent at once)
Subject: You're on the list
Preview text: Your early link arrives one day before everyone else gets it.

Hi {{ subscriber.first_name }},

You're on the waitlist for The Exit Plan.

Here's what happens next:
- I'll email you your link to book your free seat one day before registration opens to the public.
- I'll send you the dates and times as soon as they're set, in your own time zone.
- Nothing to do until then.

One small thing: please move this email to your Primary inbox (in Gmail, drag it there or tap "Not spam" if it landed in Spam). That way my early link doesn't get lost.

If you didn't get to send me a question on the page, reply to this email with the one business decision you'd like my take on. I'll choose a few examples to work through live.

Ana

---

## 2. Thank you for the question (sent when they send one)
Subject: Got your question
Preview text: I'll read every one.

Hi {{ subscriber.first_name }},

Thanks for telling me what you're working on. I read every one.

I'll choose a few examples to work through live during the workshop, so you can hear what I'd look at and why. If I pick yours and you said I could discuss it, I'll let you know ahead of time.

Your early link is still coming one day before registration opens to everyone.

Ana

---

## 3. The dates are set
Subject: The dates for The Exit Plan
Preview text: Three live sessions, free, on Zoom.

Hi {{ subscriber.first_name }},

The dates are set.

The Exit Plan is three live sessions on Zoom, about 90 minutes each:
[DAY 1 DATE], [DAY 2 DATE], [DAY 3 DATE], all at [TIME] New York time.
Here is that in your time: [LINK TO /waitlist/, it shows each visitor their own city and time]

Your early link to book your free seat arrives on [EARLY DATE]. Registration opens to everyone on [PUBLIC DATE].

Ana

---

## 4. Your early link (send one day before public registration)
Subject A: Your early link is here
Subject B: {{ subscriber.first_name }}, your free seat is ready to book
Preview text: One button. This link opens a day before everyone else gets it.

Hi {{ subscriber.first_name }},

As promised, here is your link to book your free seat for The Exit Plan, a day before I share it with everyone:

[ BOOK MY FREE SEAT ]  ->  https://exitplan.howwegrowtoday.com/?ref=waitlist&first_name={{ subscriber.first_name }}&email={{ subscriber.email_address }}

Your name and email are already filled in. Press the button once to confirm.

The Exit Plan is three live sessions on Zoom, about 90 minutes each. Free. I'll show you what I'd sell first, where I'd look for customers if nobody knew my name, and why AI has changed the order I'd do things in.

When: [DATES] at [TIME] New York time ([LINK TO /waitlist/ for your own time]).

After you book, you'll land on a page with the next steps: first the WhatsApp group, then adding the sessions to your calendar.

Ana

P.S. Booking opens to everyone tomorrow. If you book today, your seat is already saved.

---

## 5. Still open (about 20 hours later, only to people who have not booked)
Subject: Still open: your early link
Preview text: Booking opens to everyone tomorrow.

Hi {{ subscriber.first_name }},

A quick note: I haven't seen your booking yet, and your early link is still open.

[ BOOK MY FREE SEAT ]  ->  same link as email 4

It takes one press. Booking opens to everyone [TOMORROW / ON PUBLIC DATE].

Ana

---

## After they book (email 6)
Nothing new to write. They get the normal confirmation and land on the confirmation page. The sheet fills `registered_at` on its own and Kit gets the tag `ep_registered`, so emails 4 and 5 stop.

## Check before sending 4
1. Open the link yourself from a test address: the name and email must be filled in on the registration form.
2. Register with that test address and confirm: `ep_registered` appears in Kit, `registered_at` fills in the sheet tab.
3. Confirm the registration link really lets someone book a full day before the public announcement (it must not be held back).
