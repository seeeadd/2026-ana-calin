# SOP: how a job runs, and how the playbook learns

## A. Starting a chat (every time)

1. Read `playbook/README.md`, this file, the client's `brand-*.md`, and the files for the job (`graphics.md`,
   `motion.md`, `video-editing.md`).
2. Read the last 40 lines of `feedback-log.md`. They are the freshest rules.
3. `git fetch` and check you are on the work branch (`claude/quirky-franklin-etidvi` for Ana). Serve the repo locally:
   `cd /home/user/2026-ana-calin && python3 -m http.server 8767`.
4. Restate the job to Sean in two or three lines and the first thing you'll show him. For big creative work, give
   ideas and a plan first, then build.

## B. Doing the work

1. **Find the exact element.** Sean sends a screenshot with a short note ("fix this", "looks weird", "make this
   bigger"). Locate the element in code before changing anything. If two readings are plausible, take the one the
   screenshot shows, and say which you picked.
2. **Decide real vs painted** for every graphic (`graphics.md` section 2).
3. **Plan the motion with the graphic,** not after it (`motion.md`).
4. **Build in small steps and look at every result.** Screenshot at 1440, 1024 and 390 wide (and 320 for tight
   layouts). Read your own screenshot like Sean will: balance, crops, overlaps, text fit, highlight weight.
5. **Run the checks** before saying done: registration test, exit popup, sideways scroll at 320 to 1440, seasonal
   buttons (scripts in the chat's scratchpad; write them again if they're gone: Playwright, check no
   `scrollWidth > innerWidth`, no page errors, forms submit to the VIP page).
6. **Commit to the work branch** after each finished change, with a message that says what changed and why.
7. **Report**: what changed, where to look, a screenshot, and anything still open. Short. No jargon.

## C. Publishing

Only on Sean's "publish" / "pub" / "push it live". Fast-forward push the work branch to main, wait about 40 s,
fetch the live page with a cache-buster and confirm a string from the change is there. If Sean says it "looks the
same", check the live HTML first: usually it's his browser cache (tell him Cmd+Shift+R).

## D. The learning loop (do this before ending ANY turn where Sean corrected or approved something)

The playbook improves only if every chat writes back to it.

1. **Log it.** Add a line to `feedback-log.md`:
   `YYYY-MM-DD · area · "Sean's words (short)" → rule · where applied`.
   - Corrections ("looks bad", "too big", "I said...") always get a line.
   - Approvals with a reason ("this is the most perfect VIP page", "props to that") get a line too: they mark what
     to repeat.
2. **Promote it.** If the same kind of correction appears twice, or Sean states a general preference ("I prefer
   using our graphic techniques"), turn it into a rule in the right file (`graphics.md`, `motion.md`,
   `video-editing.md`, or the brand file), and note the promotion in the log line ("→ promoted to motion.md §3").
3. **Fix contradictions.** If a new correction contradicts a rule, the newer one wins: edit the rule, keep the old
   one struck through with the date, so the history stays readable.
4. **Commit** the playbook change with the work (`playbook: <what was learned>`). Playbook edits never need Sean's
   "publish" to be committed, but they go live with the next publish (the folder is excluded from Vercel by
   `.vercelignore`, so nothing in it is public).
5. **Once a week or at the end of a big round,** reread `feedback-log.md` and fold repeated items into the rule
   files, keeping the log as the record.

## E. Talking to Sean

- He's fast, casual and often types by voice; read for intent, not exact words. "Gay", "meh", "puke poop grey",
  "looks so Claude" all mean "this misses; make it premium and specific".
- He wants short updates and visible progress. If something will take more than 10 minutes, say so first, and send
  drafts as they exist. "One should only take 8 mins max."
- He decides; you recommend. When he asks "what do you think?", give a clear judgement with the reason, even if it
  disagrees with him ("you don't have to agree with me").
- Never fabricate: no invented numbers, testimonials, names or "people registered" counts. Only real data.
- Trademarks: don't copy logos or app icons of real brands closely enough to be mistaken for them, even with small
  changes. Make an original that reads the same way (for example, our green video-call icon instead of FaceTime's).
