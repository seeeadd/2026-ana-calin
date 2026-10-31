"""Ana's registration page, layout trial: /v2/ (the live page at / is untouched).

Two columns: the page on the left (the video big, then every section), and on the right a slim column with the headline
and a compact sign-up card that stays frozen below the top bar while you scroll (desktop, 1280 px and wider). The
sign-up form is the popup's own form, moved into that card on desktop and back into the popup on phones, so the
hidden fields, the situation chips and the Kit sending all work as they do on the live page.

Copy: the Google Doc "Registration page copy" (Oct 31). Built from index.html; run it again after the live page changes:
    python3 mkv2.py /home/user/2026-ana-calin
"""
import sys, os, re

ROOT = sys.argv[1]
s = open(os.path.join(ROOT, 'index.html')).read()


def R(old, new, count=1):
    global s
    n = s.count(old)
    assert n == count, 'expected %d, found %d: %s' % (count, n, old[:90])
    s = s.replace(old, new)


def between(a, b):
    """the text from marker a up to (not including) marker b"""
    i = s.index(a)
    j = s.index(b, i)
    return s[i:j]


# ---------- paths: one folder down ----------
s = s.replace('src="img/', 'src="../img/').replace('href="img/', 'href="../img/')
R("var VIP_URL     = 'vip/';", "var VIP_URL     = '../vip/';")
R("var PARTNERS    = 'partners.json';", "var PARTNERS    = '../partners.json';")
R('<meta name="theme-color"', '<meta name="robots" content="noindex">\n<meta name="theme-color"')

# ---------- the hero: the right column becomes the rail; the left gets the big video and the rest of the hero copy ----------
hero = between('<section class="hero" id="hero">', '<main>')
pill = re.search(r'<span class="hpill">.*?</span>\n', hero, re.S).group(0)
h1 = re.search(r'<h1 id="h1".*?</h1>', hero, re.S).group(0)
situ = re.search(r'<div class="situ".*?</div>\s*</div>', hero, re.S).group(0)
proof = re.search(r'<div class="proof">.*?</div>\s*\n', hero, re.S).group(0)
just = re.search(r'<p class="just" id="just" hidden>.*?</p>', hero, re.S).group(0)
tstrip = re.search(r'<div class="tstrip">.*?</div>\s*</div>\s*</div>', hero, re.S).group(0)
vsl = re.search(r'<div class="iph" id="vsl">.*?</div>\s*</div>\s*</div>\s*</div>', hero, re.S).group(0)
tstrip = tstrip.replace('<div class="stat"><b>0</b><small>sales calls</small></div>',
                        '<div class="stat"><b>0</b><small>sales calls</small></div><i></i>\n          <div class="stat"><b>16,907</b><small>buyers</small></div>')
assert '16,907' in tstrip

LI = '<li><svg aria-hidden="true"><use href="#li"/></svg>'
BYTH = ('<ul class="byth">\n'
        '            <li class="bt">By the end of Day 3, you\'ll have:</li>\n'
        '            ' + LI + 'found the thing your readers would actually pay you for</li>\n'
        '            ' + LI + 'a first offer that isn\'t a course, a paid tier, or a year away</li>\n'
        '            ' + LI + 'a price you can say out loud without wincing</li>\n'
        '            ' + LI + 'the email that finally asks people to buy. You\'ll write it with me on Nov 19.</li>\n'
        '          </ul>')
# the hero (left of the frozen ticket): the video and the headline side by side, then the stats and the rest of the copy
new_hero = """<section class="hero" id="hero">
  <svg class="bgflower" aria-hidden="true"><use href="#sfo"/></svg>
  <div class="hwrap">
    <div class="hgrid v2hero">
      <div class="hleft">
        <!-- the VSL: set VSL_SRC in the script when Ana's video is ready. Click to play; this still is the cover. -->
        """ + vsl + """
      </div>
      <div class="hright">
        """ + pill + """        """ + h1 + """
        <p class="hkick2">Already work for yourself? Then your "job" is the client hours. <b>Same plan.</b></p>
        <p class="lede first">If nothing's selling yet, it isn't your list and it isn't your writing. <b>It's the order you were taught to do things in.</b></p>
        """ + situ.replace('class="situ"', 'class="situ mob"').replace('id="situ-l"', 'id="situ-m"').replace('aria-labelledby="situ-l"', 'aria-labelledby="situ-m"') + """
        <div class="hcta">
          <button class="btn big open shine" type="button" id="heroBtn">save my seat (free)<svg><use href="#arr"/></svg></button>
          <p class="note">free · live on Zoom<span class="lt"></span></p>
        </div>
      </div>
    </div>

    """ + tstrip + """

    <div class="hunder">
      <div class="hu1">
        <p class="lede">Your first paid offer doesn't have to be a course, a paid tier, or finished. Your readers have probably already asked you for it. AI changed one step in that order, and on Day 1 I'll show you which one, on my own Substack.</p>
        <p class="when2"><b>Tue Nov 17 to Thu Nov 19</b>12:00 pm New York <i>/</i> 9:00 am Los Angeles <i>/</i> 5:00 pm London <i>/</i> 7:00 pm Greece</p>
        <p class="april">If you did my April challenge: back then I had you build it first. I'd tell you something different now.</p>
      </div>
      <div class="hu2">
        """ + BYTH + """
        <p class="obj"><b>You don't need a bigger list, a paywall or a sales call for any of this.</b> It's free and live on Zoom, three New York lunchtimes in a row (dinner time for me, here in Greece).</p>
      </div>
    </div>
  </div>
</section>

"""
# the frozen column beside the page below the hero: a seat ticket that holds the sign-up form (desktop, 1280 px and wider)
bars = ''.join('<rect x="%d" y="0" width="%d" height="40"/>' % (x, w) for x, w in [(0,2),(4,1),(7,3),(12,1),(15,2),(19,1),(22,3),(27,1),(30,2),(34,1),(37,2),(41,3),(46,1)])
rail = """<!-- the frozen column: a seat ticket with the sign-up form in it. Phones and tablets use the popup instead. -->
  <aside class="v2rail" id="v2rail" aria-label="Save your seat">
    <div class="tksticky">
    <div class="tkshell">
      <div class="tkt" id="rcard">
        <div class="tk-top"><img src="../img/mark.png" alt="" width="34" height="34"><span><small>The Exit Plan</small><b>Your free seat</b></span><em>Admit one</em></div>
        <div class="tk-body">
          <div class="rdates">
            <div class="mt" aria-hidden="true"><span><b>17</b><small>Tue</small></span><span><b>18</b><small>Wed</small></span><span><b>19</b><small>Thu</small></span></div>
            <p class="when"><b>Three live sessions</b>12:00 pm New York / 7:00 pm Greece</p>
          </div>
          """ + situ + """
          <div class="rslot" id="rslot"></div>
        </div>
        <div class="tk-perf" aria-hidden="true"></div>
        <div class="tk-stub">
          <div class="tk-holder"><small>Seat holder</small><b id="tkName">Your name</b></div>
          <div class="tk-meta"><b>Nov 17 + 18 + 19</b><small>Live on Zoom</small></div>
          <svg class="tk-code" viewBox="0 0 48 40" aria-hidden="true">""" + bars + """</svg>
        </div>
      </div>
    </div>
      <p class="xnote">Sign up and answer seven quick questions, and I'll give you your <b>exit number.</b></p>
      """ + proof + """      """ + just + """
    </div>
  </aside>
"""
assert 'id="h1"' in new_hero and 'class="chip"' in rail and 'proofTxt' in rail
R(hero, '')
# hero, then the body: the frozen column rides along the sections up to the recap. The final call to action and the footer sit below.
R('<main>\n', '<main class="v2page">\n<div class="v2body">\n' + rail + new_hero)
R('</main>\n', '')
R('<!-- 9. final CTA: claim your seat -->', '</div>\n</main>\n\n<!-- 9. final CTA: claim your seat -->')

# ---------- your host ----------
R('<h2 class="hname">Ana Calin.</h2>', '<h2 class="hname">I\'m Ana Calin.</h2>')
R('<p class="hsub">I believed the wrong thing about money <em>for ten years.</em></p>',
  '<p class="hsub">For ten years, I believed <em>the wrong thing about money.</em></p>')
bio = re.search(r'<p class="bio drop">.*?</p>', s, re.S).group(0)
R(bio, '<p class="bio drop"><span class="dc">I</span> write How We Grow, a newsletter read by about 80,000 people who want to get paid for their writing. It has made $1.4M so far, on about two hours a day from a village in Greece, and I\'ve never taken a sales call.</p>\n'
  '        <p class="bio">It didn\'t start that way. My first workshop sold two copies, at $47, because I built what I wanted to teach instead of what my readers kept asking me for. I built a whole stadium and forgot to sell tickets. Or hot dogs.</p>\n'
  '        <p class="bio">I\'ve run a lot of workshops on offers since then, and here\'s the thing I keep seeing. People almost always have something worth paying for. What stops them is the little voice asking, "Who would pay for this?" These three days are me showing you what I do instead, on my own screen, with my own numbers.</p>')
R('<p><b>"I wish"</b> tells your brain: fantasy, file it. <b>"I want"</b> tells your brain: start looking for the next step.</p>',
  '<p>Say <b>"I wish"</b> and your brain files it under fantasy. Say <b>"I want"</b> and it starts looking for the next step.</p>')
R('<h3>Senior executive. Big salary. <em>I felt poor.</em></h3><p>I earned more than my parents earned in their whole lives. My belief was "I should be grateful for what I have." It sounds like wisdom. It means: don\'t want more, don\'t ask, don\'t leave.</p>',
  '<h3>Senior executive, big salary, <em>and I still felt poor.</em></h3><p>I was earning more than my parents had earned in their whole lives, and I kept telling myself, "I should be grateful for what I have." It sounds wise, doesn\'t it? What it really meant was don\'t want more, don\'t ask, and definitely don\'t leave.</p>')
R('<p>4 AM on a hotel bathroom floor in Singapore, I said out loud for the first time: "I wish I could do my own thing."</p><p><b>Wish. Not want.</b> It took five more years to hear the difference.</p>',
  '<p>At 4 in the morning, on a hotel bathroom floor in Singapore, I said it out loud for the first time: "I wish I could do my own thing."</p><p><b>I said wish, not want.</b> It took me five more years to hear the difference.</p>')
R('<h3>First four-figure months. <em>Then a six-figure year.</em></h3><p>First six-figure year, baby on my hip, in my forties.</p>',
  '<h3>My first four-figure months, <em>then a six-figure year.</em></h3><p>I had my first six-figure year in my forties, with a baby on my hip.</p>')
R('<p>$1.4M from the newsletter, on two hours a day.</p><p><b>Same skills the whole time.</b> The beliefs changed. The actions followed. The money followed the actions.</p>',
  '<p>$1.4M from the newsletter, and I still work on it about two hours a day.</p><p><b>Honestly, I didn\'t learn some big new skill along the way.</b> I had the same skills back in 2015. What changed was what I believed I was allowed to ask for, and everything else followed from there.</p>')

# ---------- new: what you won't hear from me (after the host) ----------
NOPE = '''
<!-- 2b. what you won't hear from me -->
<section class="nope" id="nope">
  <div class="wrap">
    <div class="head" data-r>
      <span class="eyebrow">What you won't hear from me</span>
      <h2>No "grow your list first" <em>this time.</em></h2>
    </div>
    <div class="ngrid" data-r>
      <ul class="nolist" aria-label="What you won't hear">
        <li><span>post every day for months and wait</span></li>
        <li><span>build a whole course, then hope somebody buys it</span></li>
        <li><span>a launch plan that looks like a NASA schedule</span></li>
        <li><span>"let AI do it for you"</span></li>
      </ul>
      <div class="ntx">
        <p>You won't hear me tell you to post every day for months and wait, or to build a whole course and then hope somebody buys it. You won't get a launch plan that looks like a NASA schedule either, or "let AI do it for you". AI is just the reason the order changed. You've heard the rest already, and some of you paid good money for it.</p>
        <p class="inst"><b>What you get instead</b> is the exact thing I do, on my own screen, with my own replies, my own Substack dashboard and my own numbers. Then we do it on yours, live, while I'm there.</p>
      </div>
    </div>
  </div>
</section>
'''
R('<!-- 3. the three days,', NOPE + '\n<!-- 3. the three days,')

# ---------- the three days ----------
R('<h2>Three sessions. <em>Each one ends with something you made.</em></h2>',
  '<h2>Every day, you write something while I\'m there, <em>so you don\'t log off with just a page of notes.</em></h2>')


def day(old_sub, new_sub, old_out, new_out, old_body, new_body, old_ul, new_lis, nxt):
    R('<p class="body"><b>%s</b></p>' % old_sub, '<p class="body"><b>%s</b></p>' % new_sub)
    R('<p class="out"><span>You leave with:</span> %s</p>' % old_out, '<p class="out">%s</p>' % new_out)
    R('<p class="body">%s</p>' % old_body, '<p class="body">%s</p>' % new_body)
    R(old_ul, '<ul>\n' + ''.join('            <li><svg><use href="#li"/></svg><span>' + li + '</span></li>\n' for li in new_lis) + '          </ul>' + ('\n          <p class="next">%s</p>' % nxt if nxt else ''))


def ul_of(items):
    return '<ul>\n' + ''.join('            <li><svg><use href="#li"/></svg>%s</li>\n' % i for i in items) + '          </ul>'


day("What it is, why AI flipped the order, and where to find yours.",
    "Why AI flipped the order, and the three steps I use to find what readers have already told me they'd pay for.",
    "your one reader, and the problem she'd pay you to fix.",
    "<span>By the end of Day 1,</span> you'll know who your one reader is and what she'd pay you to fix, and you'll have said it in the chat.",
    "You're writing for everyone, which is why nobody pays. So we pick one reader and name her. Then we find the problem she'd pay you to fix, in what you already know.",
    "Your readers have usually told you already. It's sitting in your replies and comments, and it sounds so obvious you've walked straight past it.",
    ul_of(["Why AI flipped the order, and what that means for you", "Who your one reader is, and how to name her", "The problem she'd pay you to fix, written in her words"]),
    ["<b>Copy, count, pick:</b> the three steps I use on my own replies, comments and DMs to find what people would pay for. I'll do it live, on mine.",
     "Why the right idea usually feels too obvious to sell, and why that's exactly how you know it's the one",
     "Why your list size was never the real problem, small or big",
     "Who your one reader is, and how to name her"],
    "Tomorrow, we put a price on her problem.")
day('The one sentence that turns it into something people pay for, and the price question that ends "am I charging too much?"',
    'How to say what you\'re selling so people get it the first time, and the price test that finally ends "am I charging too much?"',
    "your offer, in one sentence, priced.",
    "<span>By the end of Day 2,</span> your offer and its price are written down, and you'll have said both out loud in the chat.",
    "Ten thousand readers and no offer is a hobby with analytics. A few dozen readers and one priced offer is a business. We turn her problem into one offer you can say in a sentence, and we put a price on it.",
    "Please don't price it low just because you're scared. If you're afraid to ask for five dollars, nobody will give you five thousand.",
    ul_of(["The one sentence that says who it's for, what changes and how long it runs", "How to price it, and how to say the price out loud", "At the end, my program, for anyone who wants to keep going with me. You can leave before it."]),
    ["The sentence every offer needs before it goes anywhere near your readers. I'll fix some of yours live.",
     "The one-question price test I use instead of a pricing formula",
     "Why your first price is a proof price, not your final one, and why that makes it so much easier to say out loud",
     "The four words I said when a client asked for my best price (they said yes)"],
    "Tomorrow, you write the email that asks.")
day("The step almost everyone gets wrong, and how to get your first yeses without a sales page or a call.",
    "The step almost everyone gets wrong, and how to get your first yeses without a sales page or a call.",
    "your first ask, written, ready to send.",
    "<span>By the end of Day 3,</span> the email asking your readers to buy is written, and you've picked the day you'll send it.",
    "Readers can't buy what they don't know you sell. So you write the ask that tells them what it is and how to get it, and you leave with it ready to send.",
    "If something is only for you, perfect, keep it to yourself. But if you want people to buy it, you have to tell them it exists. You write that email with me, live, so it doesn't end up in your drafts with everything else.",
    ul_of(["How to ask in your own voice, without apologising for it", "Who to send it to first, and when", "Stay to the end: five people there live win a 1:1 with me"]),
    ["Why one of my posts got 771 likes and made nothing, and another got 82 likes and made $120 (it came down to one sentence)",
     "Why I sent my first ask to 300 of my most consistent readers instead of my whole list, and why 47 of them said yes",
     "How to find your own most consistent readers in your Substack dashboard (about two minutes), and how to ask them without apologizing"],
    None)
R('<p>Come to all three. Each day builds on the one before.</p>', '<p>Please come to all three. Each day builds on the one before.</p>')

# ---------- new: your gift, the exit number (after the days) ----------
GIFT = '''
<!-- 3b. your gift: the exit number -->
<section class="gift" id="gift">
  <div class="wrap">
    <div class="gcard" data-r>
      <div class="gart" aria-hidden="true">
        <svg viewBox="0 0 220 260"><rect x="20" y="16" width="180" height="228" rx="24" fill="#FFD400" stroke="#1A1412" stroke-width="5"/><rect x="40" y="38" width="140" height="58" rx="10" fill="#FFF8EE" stroke="#1A1412" stroke-width="4"/><path d="M58 76h70" stroke="#1A1412" stroke-width="5" stroke-linecap="round"/><path d="M146 76h16" stroke="#F72585" stroke-width="5" stroke-linecap="round"/><g fill="#FFF8EE" stroke="#1A1412" stroke-width="4"><rect x="40" y="112" width="38" height="30" rx="8"/><rect x="91" y="112" width="38" height="30" rx="8"/><rect x="142" y="112" width="38" height="30" rx="8"/><rect x="40" y="152" width="38" height="30" rx="8"/><rect x="91" y="152" width="38" height="30" rx="8"/><rect x="40" y="192" width="38" height="30" rx="8"/><rect x="91" y="192" width="38" height="30" rx="8"/></g><rect x="142" y="152" width="38" height="70" rx="8" fill="#F72585" stroke="#1A1412" stroke-width="4"/><use href="#sf" x="128" y="-8" width="84" height="84"/></svg>
      </div>
      <div class="gtx">
        <span class="eyebrow">Your gift</span>
        <h2>The exit <em>number.</em></h2>
        <p>Sign up, answer seven quick questions, and I'll give you your exit number. It's a little calculator I built that shows how many people would need to say yes for you to leave your job, or to drop the clients you'd rather not have. It also shows the same money the usual way, through paid subscriptions alone. <b>That second number is usually when people stop waiting for a bigger list.</b> There's a pen-and-paper version too, if AI isn't your thing.</p>
        <p class="gnext"><span class="gd">From Nov 4</span>I'll send you a small task most days, about 15 minutes each, so you show up on the 17th with your material ready.</p>
      </div>
    </div>
  </div>
</section>
'''
R('<!-- 4. is this for you? -->', GIFT + '\n<!-- 4. is this for you? -->')

# ---------- fit check ----------
fit_ul = re.search(r'(<section class="sand fit">.*?)(<ul data-r>.*?</ul>)', s, re.S).group(2)
TK = '<span class="tk"><svg viewBox="0 0 20 20"><path d="m5 10.5 3.4 3.4L15 6.8"/></svg></span>'
FIT = [("You write every week and it pays you nothing.", "Then you're exactly who I made this for."),
       ("Readers say lovely things, then never buy.", "They will, once you ask properly. That's Day 3."),
       ("You keep thinking you need more subscribers first.", "You don't. A few dozen readers and one priced offer is already a business."),
       ("You have thousands of subscribers and almost nobody buys.", "Then you've already proved the list isn't the problem. Same fix, and you have more people to ask."),
       ("You already work for yourself.", "Me too. For a while I'd just hired the worst boss I'd ever had: me. If your \"job\" is client hours, it works the same."),
       ("You don't know what you'd even sell.", "Your readers probably do. We'll find it on Day 1."),
       ("You have a job, and no time.", "It's three lunchtimes, about 90 minutes each. I built this whole business on two hours a day, so I get it.")]
R(fit_ul, '<ul data-r>\n' + ''.join('      <li><button type="button" aria-pressed="false">%s<span class="pain">%s</span><span class="fix"><span>%s</span></span></button></li>\n' % (TK, a, b) for a, b in FIT) + '    </ul>')
R('<p class="not" data-r>For writers with something they could teach and at least a few people who read them, from a brand-new newsletter to a few thousand subscribers, but nothing those readers are buying yet.<br>Not for you if you want to grow your list first, or want someone to do it for you.</p>',
  '<p class="not" data-r><b>This is for you</b> if you have something you could teach and at least a few people who read you. A brand-new newsletter is fine, and so is a list of ten thousand, as long as not much is selling yet.<br><b>It\'s not for you</b> if you\'d rather grow your list first, or you want someone to do it for you. Either is fine. Just decide on purpose.</p>')

# ---------- proof ----------
R('<q>Likes are not buyers. <mark>An offer is how you get paid.</mark></q>', '<q>Likes are lovely. <mark>You just can\'t pay the rent with them.</mark></q>')
R('<h2>It works with <em>the list you have,</em> whatever its size.</h2>', '<h2>And this works with <em>the list you have right now,</em> whatever its size.</h2>')
R('<h3 class="wins-t" data-r>Almost none of them happened because of a tactic. <em>They happened the week a belief changed.</em></h3>',
  '<h3 class="wins-t" data-r>Most of these didn\'t happen because of some clever tactic. <em>They happened the week someone stopped asking "who would pay for this?" and made the offer anyway.</em></h3>')

# ---------- the live prize ----------
R('<p>Stay until the end of Day 3. Five people who are there live win a 1:1 with me, <span class="hl">worth $3,000.</span></p>',
  '<p>Stay with me until the end of Day 3. Five people who are still there live win a 1:1 with me, <span class="hl">worth $3,000.</span></p>')
R('<small>Free to enter. Live attendees only. Five names picked at random at the end of Day 3.</small>',
  '<small>Free to enter, live attendees only. I pick the five names at random at the end of Day 3.</small>')

# ---------- questions ----------
faqs = re.search(r'(<div class="faqs">\s*<h2 data-r>Questions</h2>\s*<div data-r>)(.*?)(</div>\s*</div>)', s, re.S)
Q = [("Is it really free?", "Yes, really. All three sessions are free and live, everything you write is yours to keep, and you never have to buy a thing."),
     ("I'm busy. How much time is this really?", "Three sessions of about 90 minutes, and you do the writing during them, so nothing's waiting for you after. From Nov 4 I'll send a small task most days, about 15 minutes each. Skip one and nothing breaks."),
     ("Do I need a big list?", "No. Most of the readers who answered my October survey have fewer than 100 subscribers, or no newsletter yet. That's a normal place to start, I promise you."),
     ("What if my list is already big?", "Then I really want you there. A big list with nothing to sell is one of the most common things I see, and in a way it's the better problem to have, because you have more people to ask. On Day 3 I'll show you why I'd still start with a few hundred of them, not all of them."),
     ("Will this work for my topic?", "If people read you to get better at something, or to get through something, there's usually an offer in it. Most of my readers are teachers, coaches, marketers and health people. The topics are all different, and the step is the same. And if lots of people already write about yours, good. There's room for everyone, even on the same topic. Your readers picked you."),
     ("Will I really be able to leave my job by 2027?", "I can't promise that, and I'd be careful with anyone who does. What I can tell you is that by the end of Day 3 you'll know what you'd sell, for how much and to whom, and your exit number will show you how far that is from your job.")]
R(faqs.group(2), '\n' + ''.join('        <details class="faq"%s><summary>%s<i aria-hidden="true"></i></summary><p class="a">%s</p></details>\n' % (' open' if i == 0 else '', q, a) for i, (q, a) in enumerate(Q)) + '      ')

# ---------- quick recap ----------
R('<p>A free 3-day live workshop with me on how to build the income that lets you leave your job in 2027. You leave with one offer, one price, and your first ask, written.</p>',
  '<p>A free 3-day live workshop with me on how to build the income that lets you leave your job in 2027. We find what your readers would pay for, put a price on it, and write the email that asks them to buy.</p>')
R('<p><b class="big">Tue Nov 17 to Thu Nov 19</b>12:00 pm New York / 7:00 pm Greece, all three days<span class="lt"></span>.</p>',
  '<p><b class="big">Tue Nov 17 to Thu Nov 19</b>12:00 pm New York / 9:00 am Los Angeles / 5:00 pm London / 7:00 pm Greece, all three days<span class="lt"></span>.</p>')
R("<p>Live on Zoom, from anywhere. Come live if you can: that's where we do the work together.</p>",
  "<p>Live on Zoom, from anywhere. I once ran a workshop on a fancy all-in-one platform and spent half of it fixing broken links, so it's Zoom, nothing fancy. Come live if you can, because that's where we do the work together.</p>")

# ---------- final ----------
R('<p class="line">Free. Three live sessions with me. You leave with your offer, your price and your first ask.</p>',
  '<p class="line">Three free lunchtimes with me. Bring the thing you keep meaning to sell, and we\'ll get it ready.</p>')
conf = re.search(r'<p class="conf">.*?</p>\n\s*', s, re.S).group(0)
R(conf, '')
R("<p class=\"note\">After you sign up, you'll get the link to my WhatsApp channel. Your exit number is waiting there, with the voice notes and reminders I don't post anywhere else.</p>",
  "<p class=\"note\">Once you're signed up, join my WhatsApp community so you don't miss my reminders, then answer seven quick questions and I'll give you your exit number.</p>")

# ---------- popup ----------
R("<p class=\"note\">You'll get my emails about the workshop and my program. Unsubscribe anytime. No hard feelings, no guilt email.</p>",
  "<p class=\"note\">You'll get my emails, including the workshop reminders. Unsubscribe anytime. No hard feelings, no guilt email.</p>")

# ---------- script: the form lives in the rail on desktop; buttons there focus it instead of opening the popup ----------
R("  function openM(e){\n    if (e) e.preventDefault();",
  """  /* v2: on desktop the popup's form sits in the rail card; a button focuses it there (or opens the popup when the card is out of view) */
  var wide = matchMedia('(min-width: 1280px)'), rslot = document.getElementById('rslot'), rcard = document.getElementById('rcard'), thanksEl = dlg.querySelector('.thanks');
  function placeForm(){ if (wide.matches) { if (!modal.classList.contains('open')) rslot.appendChild(form) } else dlg.insertBefore(form, thanksEl) }
  if (wide.addEventListener) wide.addEventListener('change', placeForm); else wide.addListener(placeForm);
  placeForm();
  var tkName = document.getElementById('tkName'), tkIn = form.querySelector('[name=first_name]');
  tkIn.addEventListener('input', function(){ var v = tkIn.value.trim(); tkName.textContent = v || 'Your name'; tkName.classList.toggle('set', !!v) });
  function perf(){ var t = document.getElementById('rcard'), pf = t.querySelector('.tk-perf'); t.style.setProperty('--py', (pf.offsetTop) + 'px') }
  perf(); addEventListener('resize', perf); if (document.fonts) document.fonts.ready.then(perf);
  function openM(e){
    if (e) e.preventDefault();
    if (wide.matches) {
      var rr = rcard.getBoundingClientRect();
      if (rr.top > -40 && rr.bottom < innerHeight + 80) {
        var f1 = form.querySelector('[name=first_name]'); f1.focus({preventScroll:true});
        rcard.classList.remove('pulse'); void rcard.offsetWidth; rcard.classList.add('pulse');
        return;
      }
      dlg.insertBefore(form, thanksEl);
    }""")
R("""  function closeM(){
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('noscroll');""",
  """  function closeM(){
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('noscroll');
    placeForm();""")

# ---------- styles ----------
CSS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'v2.css')).read()
i = s.index('</style>'); s = s[:i] + CSS + '\n' + s[i:]

os.makedirs(os.path.join(ROOT, 'v2'), exist_ok=True)
open(os.path.join(ROOT, 'v2', 'index.html'), 'w').write(s)
print('wrote v2/index.html', len(s))
