"""Ana's registration page, layout trial: /v2/ (the live page at / is untouched).

The hero is the live page's own two columns: the video big on the left with the booking card and a small drawing of the three days under it, and on
the right the headline and a seat ticket that holds the sign-up form. Once that ticket scrolls away, the form moves into
a slim copy of the ticket that stays frozen on the right of the page (desktop, 1280 px and wider). The form is the
popup's own form, moved between the two tickets and the popup, so the hidden fields, the situation chips and the Kit
sending all work as they do on the live page.

Copy: Sean's updated registration copy (Oct 31, second version), with no em dashes. Built from index.html; run it again
after the live page changes:
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

LI = '<li><svg aria-hidden="true"><use href="#li"/></svg><span>%s</span></li>'
ARR = '<svg><use href="#arr"/></svg>'

# ---------- the hero ----------
hero = between('<section class="hero" id="hero">', '<main>')
h1 = re.search(r'<h1 id="h1".*?</h1>', hero, re.S).group(0)
proof = re.search(r'<div class="proof">.*?</div>\s*\n', hero, re.S).group(0)
just = re.search(r'<p class="just" id="just" hidden>.*?</p>', hero, re.S).group(0)
tstrip = re.search(r'<div class="tstrip">.*?</div>\s*</div>\s*</div>', hero, re.S).group(0)
vsl = re.search(r'<div class="iph" id="vsl">.*?</div>\s*</div>\s*</div>\s*</div>', hero, re.S).group(0)
# the live hero's booking card under the video (Day 1 slide, dates, button), as on the live page
book = re.search(r'<div class="book">.*?<div class="go">.*?</div>\s*</div>', hero, re.S).group(0)
tstrip = tstrip.replace('<div class="stat"><b>0</b><small>sales calls</small></div>',
                        '<div class="stat"><b>0</b><small>sales calls</small></div><i></i>\n          <div class="stat"><b>16,907</b><small>buyers</small></div>')
assert '16,907' in tstrip

# the sign-up card: the hero has one (the form starts there, on the first screen) and the frozen column has a copy.
# Minimal: the testimonial faces and count on top (the live feed swaps in the real count and the latest names), the
# heading, one line with the dates, then first name, email and the button.
def ticket(tid, slot, hero):
    pr = proof if hero else proof.replace(' id="proofTxt"', '')
    return ("""<div class="tkshell">
      <div class="tkt" id="%s">
        <div class="tk-head">
          """ + pr.strip() + (('\n          ' + just) if hero else '') + """
        </div>
        <div class="tk-body">
          <h3 class="tk-h"><span class="l">Let’s put what you</span> <span class="l">know to work.</span></h3>
          <p class="tk-meta"><span>Free, live on Zoom</span> <i>·</i> <span>Nov 17 to 19</span> <i>·</i> <span>12:00 pm New York</span></p>
          <div class="rslot" id="%s"></div>
        </div>
      </div>
    </div>""") % (tid, slot)

# the drawing under the booking card, small and quiet: what you make on each day, the same example writer as in the
# day rows. Thin lines, no shadows, no tilt, soft colours, so it sits behind the video and the form.
INK, PINK, INK3, YSOFT = '#1A1412', '#F72585', '#7A6A60', '#FFF1B3'
def t(x, y, txt, size=12, weight=700, fill=INK, serif=False, ls=None, anchor=None):
    fam = 'Instrument Serif,Georgia,serif' if serif else 'Manrope,sans-serif'
    return '<text x="%s" y="%s" font-family="%s"%s font-size="%s" fill="%s"%s%s>%s</text>' % (
        x, y, fam, '' if serif else ' font-weight="%d"' % weight, size, fill,
        ' letter-spacing="%s"' % ls if ls else '', ' text-anchor="%s"' % anchor if anchor else '', txt)
CW, CH = 232, 108
def card(x, y, title, day, body):
    return ('<g>'
            + '<rect x="%d" y="%d" width="%d" height="%d" rx="14" fill="#fff" fill-opacity=".72" stroke="%s" stroke-opacity=".16" stroke-width="1.4"/>' % (x, y, CW, CH, INK)
            + (t(x + 14, y + 25, title, 17, fill='#3D332E', serif=True) if title else '')
            + t(x + CW - 14, y + 23, day, 8.5, 800, PINK, ls=1.4, anchor='end')
            + '<path d="M%d %dh%d" stroke="%s" stroke-opacity=".08" stroke-width="1.2"/>' % (x + 12, y + 35, CW - 24, INK)
            + body + '</g>')
X1, X2, X3, Y = 6, 264, 522, 10
c1 = ('<g transform="translate(%d %d) scale(.24)" opacity=".9"><circle r="50" fill="%s" stroke="%s" stroke-width="5"/><path d="M-50 -6C-44-48 44-48 50-6C40-26 22-34 0-34S-40-26-50-6Z" fill="#6B4E3A" stroke="%s" stroke-width="5" stroke-linejoin="round"/><ellipse cx="-16" cy="2" rx="5" ry="7" fill="%s"/><ellipse cx="16" cy="2" rx="5" ry="7" fill="%s"/><path d="M-20 18c4 16 36 16 40 0Z" fill="%s"/></g>' % (X1 + 27, Y + 70, YSOFT, INK, INK, INK, INK, INK)
      + t(X1 + 50, Y + 56, 'SHE’D PAY FOR', 8, 800, INK3, ls=1.3)
      + '<rect x="%d" y="%d" width="80" height="18" fill="%s"/><rect x="%d" y="%d" width="90" height="18" fill="%s"/>' % (X1 + 48, Y + 62, YSOFT, X1 + 48, Y + 82, YSOFT)
      + t(X1 + 51, Y + 76, 'A clear plan', 16.5, fill='#3D332E', serif=True) + t(X1 + 51, Y + 96, 'back to work.', 16.5, fill='#3D332E', serif=True))
c2 = (t(X2 + 14, Y + 56, 'I help mothers after a career', 14.5, fill='#3D332E', serif=True) + t(X2 + 14, Y + 74, 'break get back to work', 14.5, fill='#3D332E', serif=True)
      + t(X2 + 14, Y + 92, 'in six weeks.', 14.5, fill='#3D332E', serif=True)
      + '<path d="M%d %dc13-2 28-2 42 0" fill="none" stroke="%s" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>' % (X2 + 31, Y + 97, PINK)
      + '<path d="M%d %dh44a6 6 0 0 1 6 6v16a6 6 0 0 1-6 6h-44l-10-14Z" fill="#fff" stroke="%s" stroke-opacity=".6" stroke-width="1.4" stroke-linejoin="round"/><circle cx="%d" cy="%d" r="2.4" fill="none" stroke="%s" stroke-opacity=".6" stroke-width="1.2"/>' % (X2 + 172, Y + 70, PINK, X2 + 170, Y + 84, PINK)
      + t(X2 + 197, Y + 89, '$149', 14, 800, PINK, anchor='middle'))
c3 = ('<use href="#sf" x="%d" y="%d" width="18" height="18" opacity=".85"/>' % (X3 + 12, Y + 10)
      + t(X3 + 35, Y + 19, 'You', 10.5, 800, '#3D332E') + t(X3 + 35, Y + 30, 'your newsletter', 8.5, 600, INK3)
      + t(X3 + 14, Y + 64, 'Back to work, by spring.', 18, fill='#3D332E', serif=True)
      + '<circle cx="%d" cy="%d" r="7" fill="%s" stroke="%s" stroke-opacity=".5" stroke-width="1.2"/><path d="m%d %d 2.5 2.5 4.5-5" fill="none" stroke="%s" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' % (X3 + 21, Y + 87, YSOFT, INK, X3 + 17.5, Y + 87, INK)
      + t(X3 + 34, Y + 91, 'Sent to her ten readers', 10, 600, INK3))
arrow = lambda x, y: ('<path d="M%d %dh12" stroke="%s" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1 4"/><path d="M%d %dl4 3.5-4 3.5" fill="none" stroke="%s" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' % (x, y, PINK, x + 13, y - 3.5, PINK))
HMAP = ('<div class="hmap" aria-hidden="true"><svg viewBox="0 0 760 128" role="presentation">'
        + card(X1, Y, 'Reader file', 'DAY 1', c1) + card(X2, Y, 'Your offer', 'DAY 2', c2)
        + card(X3, Y, None, 'DAY 3', c3)
        + arrow(X2 - 20, Y + 56) + arrow(X3 - 20, Y + 56) + '</svg></div>')


new_hero = """<section class="hero" id="hero">
  <svg class="bgflower" aria-hidden="true"><use href="#sfo"/></svg>
  <svg class="bgflower b" aria-hidden="true"><use href="#sfo"/></svg>
  <div class="hwrap hgrid v2h">
    <div class="hleft">
      """ + tstrip + """

      <!-- the VSL: set VSL_SRC in the script when Ana's video is ready. Click to play; this still is the cover. -->
      """ + vsl + """

      """ + book + """

      <!-- what you make on each of the three days -->
      """ + HMAP + """
    </div>

    <div class="hright">
      <span class="hpill"><span class="dot"></span>The Exit Plan<span class="hide-s"> <i>·</i> A free 3-day live workshop with Ana Calin</span></span>
      """ + h1 + """
      <p class="hsub2" id="hk">You’ve spent years getting good at something. Maybe you write about it, and people thank you for helping them. <em>But what could you sell, and could it earn enough to give you more choice about work?</em></p>
      <div class="htk">
        """ + ticket('hcard', 'hslot', True) + """
      </div>
    </div>
  </div>
</section>

"""
R(hero, new_hero)
rail = """<!-- the frozen column: the seat ticket the form moves into once the hero's ticket has scrolled away (1280 px and wider) -->
  <aside class="v2rail" id="v2rail" aria-label="Save your seat">
    <div class="tksticky">
      """ + ticket('rcard', 'rslot', False) + """
    </div>
  </aside>
"""
R('<main>\n', '<main class="v2page">\n<div class="v2body">\n' + rail)

# the Day 3 prize tickets: the new copy gives no dollar value, so the tickets carry none
R('<text x="88" y="50" font-family="Instrument Serif,serif" font-size="30" fill="#1A1412">1:1 with Ana</text>\n      <text x="89" y="78" font-family="Manrope,sans-serif" font-weight="800" font-size="13" letter-spacing="2" fill="#F72585">WORTH $3,000</text>',
  '<text x="88" y="65" font-family="Instrument Serif,serif" font-size="30" fill="#1A1412">1:1 with Ana</text>')

# ---------- 2. a little context (replaces the host letter and her story) ----------
CHIPS = ('<div class="situ" role="group" aria-labelledby="situ-l">\n'
         '        <span class="lbl" id="situ-l">Where are you right now?</span>\n'
         '        <div class="chips">\n'
         '          <button class="chip" type="button" data-v="job" aria-pressed="false">I have a job and write on the side</button>\n'
         '          <button class="chip" type="button" data-v="self" aria-pressed="false">I work for myself</button>\n'
         '          <button class="chip" type="button" data-v="both" aria-pressed="false">A bit of both</button>\n'
         '        </div>\n'
         '      </div>')
CTX = """<!-- 2. a little context, if we haven't met -->
<section class="ctx who" id="who">
  <div class="wrap">
    <div class="cgrid">
      <div class="pol" data-r>
        <figure><img src="../img/ana-hat.webp" alt="Ana Calin" width="520" height="520" loading="lazy"></figure>
      </div>
      <div class="ctx-tx" data-r>
        <p class="partner"><span id="pname"></span> sent you here. Here's who I am.</p>
        <span class="eyebrow">A little context, if we haven’t met</span>
        <h2><span class="l">I’m Ana. I turn what I know</span> <span class="l"><em>into things my readers pay for.</em></span></h2>
        <p class="lead">I write How We Grow on Substack. My newsletter business has made <b>$1.4M</b> selling workshops and programs to readers, without sales calls.</p>
        <p>The advice you usually hear is to grow your audience and keep creating until the money follows. AI has changed a practical part of that process, and it changes the order I’d recommend today. On Day 1, I’ll show you what changed, using my own business.</p>
        <div class="cnotes">
          <p><b>Already self-employed?</b> Your goal might be to stop depending on client work you’d rather turn down. These three days are for you too.</p>
          <p><b>Been to one of my workshops before?</b> What you learned about your readers still matters. Come see what I now do differently with it.</p>
        </div>
      </div>
    </div>
    <div class="cplan" data-r>
      """ + CHIPS + """
      <div class="cgo"><button class="btn open" type="button">I want the plan""" + ARR + """</button><small>free · live on Zoom</small></div>
    </div>
  </div>
</section>

"""
R(between('<!-- 2. who\'s Ana:', '<!-- 3. the three days,'), CTX)

# ---------- 3. the three days ----------
R(between('    <div class="head" data-r>\n      <span class="eyebrow">Tue Nov 17 to Thu Nov 19', '    <div class="rows">'),
  """    <div class="head" data-r>
      <span class="eyebrow">Your three days · Nov 17 to 19</span>
      <h2><span class="l">Open my screen.</span> <span class="l"><em>Then work on yours.</em></span></h2>
      <p class="dlede">Bring somewhere to write. Each day, I’ll show you a real example, then give you time to work on your own. I’ll review some of your work live.</p>
    </div>

""")
DAYS = [
    ('17', 'Tuesday, Nov 17', 'Find the idea worth asking people to pay for.',
     'You might already have the answer buried in a reply, a comment, or a message you answered without thinking. I’ll open my own and show you what I look for.',
     ['The change AI made to my process, and why I’d start in a different order today.',
      'My three-step process for narrowing what readers ask about to one idea worth testing.',
      'Why the thing that feels too obvious to you can still be useful enough to sell.'],
     'One reader, one problem, and an offer idea to test.',
     'Tomorrow, we turn that idea into something you can put a price on.'),
    ('18', 'Wednesday, Nov 18', 'Put your offer into one sentence. Then give it a price.',
     '“I could help with that” isn’t quite an offer yet. We’ll make it clear who it’s for, what you’ll help them do, and what they’re being asked to buy.',
     ['The one sentence every offer needs. I’ll work through examples and fix some of yours live.',
      'The one-question price test I use when a pricing formula won’t help.',
      'The four words I used when a client asked for my best price, and what happened next.'],
     'Your offer sentence and a starting price to test.',
     'Then comes the part that’s easy to leave for “later”: actually asking.'),
    ('19', 'Thursday, Nov 19', 'Write the email that puts your offer in front of people.',
     'One of my posts got 771 likes and made nothing. Another got 82 likes and made $120. I’ll show you the sentence that made the difference, then we’ll write your ask together.',
     ['Why I approached 300 readers instead of my whole list, and how I chose them.',
      'Where I look in my Substack dashboard to find the first people to approach.',
      'How to explain what’s for sale in your own voice, without burying the invitation.'],
     'A drafted sales email, your first audience, and a date to send it.',
     'You’ll have the draft in front of you. I’ll read some out and work on them live.'),
]
dtexts = re.findall(r'<div class="dtext">.*?</div>\s*(?=<div class="art")', s, re.S)
assert len(dtexts) == 3, len(dtexts)
for old, (dd, dname, h3, body, lis, out, nxt) in zip(dtexts, DAYS):
    new = ('<div class="dtext">\n'
           '          <div class="dwhen"><span class="dcal" aria-hidden="true"><small>NOV</small><b>%s</b></span><span class="dtx"><b>%s</b><span class="dtm"><span class="pill">12:00 pm New York</span></span></span></div>\n'
           '          <h3>%s</h3>\n'
           '          <p class="body">%s</p>\n'
           '          <ul>\n%s\n          </ul>\n'
           '          <p class="out"><span>You leave with</span>%s</p>\n'
           '          <p class="next">%s</p>\n'
           '        </div>\n        ') % (dd, dname, h3, body, '\n'.join('            ' + LI % li for li in lis), out, nxt)
    R(old, new)
R(between('    <div class="after" data-r>\n      <p>Come to all three.', '  </div>\n</section>\n\n<!-- 4. is this for you? -->'),
  """    <div class="after" data-r>
      <p><span class="l">Come to all three.</span> <span class="l">Each day builds on the one before.</span></p>
      <button class="btn open" type="button">I’m in for all three (free)""" + ARR + """</button>
    </div>
""")

# ---------- 4 to 10: gift, fit, host, reviews, questions, the Day 3 prize, the recap, then the final ----------
GIFT = """<!-- 4. your gift when you join: the exit number -->
<section class="gift" id="gift">
  <div class="wrap">
    <div class="gcard" data-r>
      <div class="gart" aria-hidden="true">
        <svg viewBox="0 0 220 260"><rect x="20" y="16" width="180" height="228" rx="24" fill="#FFD400" stroke="#1A1412" stroke-width="5"/><rect x="40" y="38" width="140" height="58" rx="10" fill="#FFF8EE" stroke="#1A1412" stroke-width="4"/><path d="M58 76h70" stroke="#1A1412" stroke-width="5" stroke-linecap="round"/><path d="M146 76h16" stroke="#F72585" stroke-width="5" stroke-linecap="round"/><g fill="#FFF8EE" stroke="#1A1412" stroke-width="4"><rect x="40" y="112" width="38" height="30" rx="8"/><rect x="91" y="112" width="38" height="30" rx="8"/><rect x="142" y="112" width="38" height="30" rx="8"/><rect x="40" y="152" width="38" height="30" rx="8"/><rect x="91" y="152" width="38" height="30" rx="8"/><rect x="40" y="192" width="38" height="30" rx="8"/><rect x="91" y="192" width="38" height="30" rx="8"/></g><rect x="142" y="152" width="38" height="70" rx="8" fill="#F72585" stroke="#1A1412" stroke-width="4"/><use href="#sf" x="128" y="-8" width="84" height="84"/></svg>
      </div>
      <div class="gtx">
        <span class="eyebrow">Your gift when you join</span>
        <h2><span class="l">How much would</span> <span class="l"><em>“enough” actually take?</em></span></h2>
        <p>Answer seven quick questions and get your <b>exit number</b>: how many people would need to buy at a given price to reach your income goal. That might mean replacing your salary, or letting go of a client.</p>
        <p>You’ll also see what the same goal would take through paid subscriptions alone. It’s a way to put numbers to the plan, so you can see what you’re working towards.</p>
        <p class="gnext"><b>From Nov 4,</b> I’ll send a small task most days, about 15 minutes, to help you bring useful material to the workshop.</p>
      </div>
    </div>
  </div>
</section>

"""
TK = '<span class="tk"><svg viewBox="0 0 20 20"><path d="m5 10.5 3.4 3.4L15 6.8"/></svg></span>'
FIT_ITEMS = [("You write every week and it pays you nothing.", "Let’s find something useful you could offer those readers."),
             ("People thank you for your help. You don’t know what to sell.", "We’ll look for the specific problem behind those thank‑yous."),
             ("You know your subject. Putting a price on it feels awkward.", "Bring that doubt. We’ll work through a starting price together."),
             ("You earn from clients, but every extra sale costs you more hours.", "Explore an offer built around what you know."),
             ("You have a job, and very little spare time.", "Three sessions of about 90 minutes, with the writing done during them.")]
FIT = """<!-- 5. does this sound familiar? -->
<section class="sand fit">
  <div class="wrap narrow">
    <div class="head" data-r>
      <span class="eyebrow">Does this sound familiar?</span>
      <h2><span class="l">There’s something here.</span> <span class="l"><em>You just haven’t sold it yet.</em></span></h2>
      <p class="tip">Tap the ones that sound like you.</p>
    </div>
    <ul data-r>
""" + ''.join('      <li><button type="button" aria-pressed="false">%s<span class="pain">%s</span><span class="fix"><span>%s</span></span></button></li>\n' % (TK, a, b) for a, b in FIT_ITEMS) + """    </ul>
    <p class="not" data-r>For people with something useful to teach or help others with. You’ll do the work during these sessions, so bring your ideas and a willingness to try.</p>
  </div>
</section>

"""
HOST = """<!-- 6. your host -->
<section class="host" id="host">
  <div class="wrap">
    <div class="hostg">
      <div class="hst-tx" data-r>
        <span class="eyebrow">Your host · Ana Calin</span>
        <h2><span class="l">It can feel obvious</span> <span class="l"><em>when you’re the one who knows.</em></span></h2>
        <p class="big">If you’ve painted for years, mixing a colour or holding a brush feels ordinary. To someone picking one up for the first time, it isn’t.</p>
        <p>That’s easy to forget about your own work. You see what’s simple to you, and wonder who would pay for it.</p>
        <p>My first workshop sold two copies. I’d built what I wanted to teach instead of what my readers kept asking me for. I learned to pay more attention to the asking.</p>
        <p>Now I run How We Grow from a village in Greece, on about two hours a day. For three days, I’ll show you what that looks like in practice.</p>
        <div class="sig">Ana</div>
      </div>
      <div class="hst-pic" data-r>
        <figure><img src="../img/ana-paris.webp" alt="Ana Calin" width="1000" height="671" loading="lazy"></figure>
        <svg class="brush" viewBox="0 0 230 70" aria-hidden="true"><g transform="rotate(-16 115 35)"><path d="M6 35c16-15 40-19 62-12l7 12-7 12c-22 7-46 3-62-12Z" fill="#FFD400" stroke="#1A1412" stroke-width="4" stroke-linejoin="round"/><path d="M20 35h30" stroke="#1A1412" stroke-width="2.6" stroke-linecap="round" opacity=".5"/><rect x="74" y="23" width="36" height="24" rx="4" fill="#EADFCF" stroke="#1A1412" stroke-width="4"/><path d="M110 26h104a9 9 0 0 1 0 18H110Z" fill="#F72585" stroke="#1A1412" stroke-width="4" stroke-linejoin="round"/></g></svg>
      </div>
    </div>
  </div>
</section>

"""
STAR = '<svg viewBox="0 0 20 20"><path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8Z"/></svg>'
REVS = [("gustavo", "Gustavo Karakey", "Can I just say that you have over delivered. Wow! It's nice to have a clear map. Still work to do, but much more satisfying, and less wheel spinning. :)"),
        ("jeanette", "Jeanette Martin", "What a brilliant, actionable, organised, inspiring bootcamp. Thank you, Ana."),
        ("adora", "Adora Lee", "I finally see the possibility of monetizing here!")]
REVIEWS = """<!-- 7. what readers say -->
<section class="sand revs" id="reviews">
  <div class="wrap">
    <div class="head" data-r>
      <span class="eyebrow">From previous workshops</span>
      <h2><span class="l">What readers say</span> <span class="l"><em>about working with me.</em></span></h2>
    </div>
    <div class="rgrid" data-r>
""" + ''.join('      <figure class="rq"><blockquote>%s</blockquote><figcaption><img src="../img/av/%s.webp" alt="" width="80" height="80" loading="lazy"><span><b>%s</b><span class="stars" aria-label="5 stars">%s</span></span></figcaption></figure>\n' % (q, img, n, STAR * 5) for img, n, q in REVS) + """    </div>
    <p class="wall-src">Reviews from Ana’s readers and students, published on her Substack.</p>
  </div>
</section>

"""
QS = [("Is it really free?", "Yes. All three sessions are free and live, everything you write is yours to keep, and you never have to buy a thing."),
      ("Do I need a big list or an idea ready?", "No. A small readership is welcome, and you don’t need an offer idea ready. If you haven’t started writing yet, bring a topic you know and the questions people already ask you. You’ll still need to find people to test your idea with."),
      ("How much time should I set aside?", "About 90 minutes a day, Nov 17 to 19. We do the writing during the sessions. From Nov 4, I’ll also send a small task most days, about 15 minutes. Skip one and nothing breaks."),
      ("Do I need to be on Substack?", "No. I’ll demonstrate on mine because that’s where my readers are. The work (choosing a problem, shaping an offer, and asking people to buy) applies wherever people read you."),
      ("Will this work for my topic?", "If people come to you to get better at something, or to get through something, you may have something useful to offer. We’ll work on a specific problem you can help with, rather than trying to sell your whole subject."),
      ("Will I really be able to leave my job in 2027?", "I can’t promise that. These three days give you an offer idea, a starting price, and an email to test it. Your exit number helps you see the distance between that first offer and the income you want.")]
FAQ = """<!-- 8. a few practical things -->
<section class="qa" id="faq">
  <div class="wrap">
    <div class="faqs">
      <div class="fhead" data-r>
        <span class="eyebrow">A few practical things</span>
        <h2>Before you join.</h2>
      </div>
      <div data-r>
""" + ''.join('        <details class="faq"%s><summary>%s<i aria-hidden="true"></i></summary><p class="a">%s</p></details>\n' % (' open' if i == 0 else '', q, a) for i, (q, a) in enumerate(QS)) + """      </div>
    </div>
  </div>
</section>

"""
PRIZE = """<!-- 9. one more reason to stay for Day 3 -->
<section class="prize">
  <div class="wrap">
    <div class="stay" id="stay">
      <div>
        <h2>One more reason to stay <em>for Day 3.</em></h2>
        <p>At the end, I’ll pick five names at random from the people still there live. Each gets a 1:1 with me.</p>
        <small>Free to enter; live attendees only.</small>
      </div>
      <!-- five seats: five 1:1 tickets fanning out -->
      <div class="tix" aria-hidden="true">
        <div class="t"><svg viewBox="0 0 240 110"><use href="#tk"/></svg></div>
        <div class="t"><svg viewBox="0 0 240 110"><use href="#tk"/></svg></div>
        <div class="t"><svg viewBox="0 0 240 110"><use href="#tk"/></svg></div>
        <div class="t"><svg viewBox="0 0 240 110"><use href="#tk"/></svg></div>
        <div class="t"><svg viewBox="0 0 240 110"><use href="#tk"/></svg></div>
      </div>
    </div>
  </div>
</section>

"""
RECAP = """<!-- 10. the recap: one offer idea, one starting price, one email -->
<section class="sum">
  <div class="wrap">
    <div class="recap" data-r>
      <svg class="fl" style="left:-70px;top:-60px;width:230px;height:230px" aria-hidden="true"><use href="#sfo"/></svg>
      <svg class="fl" style="right:-80px;bottom:-90px;width:260px;height:260px" aria-hidden="true"><use href="#sfo"/></svg>
      <span class="eyebrow">The Exit Plan · Free 3-day live workshop</span>
      <div class="rc three">
        <div><span class="ic"><svg aria-hidden="true"><use href="#sf"/></svg></span><h3>One offer idea.</h3></div>
        <div><span class="ic"><svg viewBox="0 0 52 52" aria-hidden="true"><g transform="rotate(-12 26 26)"><path d="M14 16h26a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H14l-8-10Z" fill="#F72585" stroke="#1A1412" stroke-width="3" stroke-linejoin="round"/><circle cx="14" cy="26" r="3" fill="#fff" stroke="#1A1412" stroke-width="2.2"/><path d="M24 22h12M24 30h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g></svg></span><h3>One starting price.</h3></div>
        <div><span class="ic"><svg viewBox="0 0 52 52" aria-hidden="true"><rect x="7" y="13" width="38" height="27" rx="5" fill="#fff" stroke="#1A1412" stroke-width="3"/><path d="M8 15l18 13 18-13" fill="none" stroke="#1A1412" stroke-width="3" stroke-linejoin="round"/><circle cx="40" cy="14" r="7" fill="#FFD400" stroke="#1A1412" stroke-width="2.4"/><path d="m37 14 2 2 4-4" fill="none" stroke="#1A1412" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><h3>One email, written.</h3></div>
      </div>
      <p class="rtime"><b><span class="nw">Tue Nov 17 to Thu Nov 19</span> · <span class="nw">12:00 pm New York</span></b><span class="nw">9:00 am Los Angeles</span> · <span class="nw">5:00 pm London</span> · <span class="nw">7:00 pm Greece</span></p>
      <div class="go"><button class="btn open" type="button">Yes, I’m coming, free""" + ARR + """</button></div>
    </div>
  </div>
</section>
</div>
</main>

"""
tail = between('<!-- 4. is this for you? -->', '<!-- 9. final CTA')
R(tail, GIFT + FIT + HOST + REVIEWS + FAQ + PRIZE + RECAP)
R('</main>\n\n<footer>', '\n<footer>')

# ---------- the final ----------
R('<h2>See you <em class="nw">Tuesday, Nov 17.</em></h2>\n        <p class="line">Free. Three live sessions with me. You leave with your offer, your price and your first ask.</p>',
  '<h2>See you <em class="nw">Tuesday, Nov 17.</em></h2>\n        <p class="line">Bring the thing you keep meaning to sell. Or just the questions people keep asking you. We’ll start there.</p>')
R('<button class="btn open shine" type="button" id="finalBtn">save my seat (free)', '<button class="btn open shine" type="button" id="finalBtn">See you Tuesday, Ana!')
fin = between('<p class="conf">', '      </div>\n    </div>\n  </div>\n</section>\n\n<footer>')
R(fin, '<p class="note">free · live on Zoom</p>\n')

# ---------- the form: the hero card's button and note ----------
R('<button class="btn big send" type="submit">save my seat (free)<svg><use href="#arr"/></svg></button>',
  '<button class="btn big send" type="submit">I’m in, Ana (it’s free)<svg><use href="#arr"/></svg></button>')
R("<p class=\"note\">You'll get my emails about the workshop and my program. Unsubscribe anytime. No hard feelings, no guilt email.</p>",
  "<p class=\"note\">You’ll get my emails, including workshop reminders. Unsubscribe anytime. No hard feelings.</p>")

# ---------- the form: a visible label over each field, not just the placeholder ----------
R('<div class="field"><input type="text" name="first_name" placeholder="What your readers call you" autocomplete="given-name" aria-label="First name" required>',
  '<div class="field"><label class="flbl" for="jFirst">First name</label><input type="text" id="jFirst" name="first_name" placeholder="What your readers call you" autocomplete="given-name" required>')
R('<div class="field"><input type="email" name="email_address" placeholder="The email you actually check" autocomplete="email" inputmode="email" aria-label="Email" required>',
  '<div class="field"><label class="flbl" for="jEmail">Email</label><input type="email" id="jEmail" name="email_address" placeholder="The email you actually check" autocomplete="email" inputmode="email" required>')

# ---------- script: the form lives in the hero ticket, then the frozen one; buttons focus it instead of opening the popup ----------
R("var mbar = document.getElementById('mbar'), hb = document.getElementById('heroBtn')", "var mbar = document.getElementById('mbar'), hb = document.getElementById('hcard')")
R("  function openM(e){\n    if (e) e.preventDefault();",
  """  /* v2: the form sits in the hero's ticket, and moves into the frozen ticket once the hero's has scrolled away (desktop).
     A button focuses it where it is, or opens the popup when no ticket is in view. */
  var wide = matchMedia('(min-width: 1280px)'), hslot = document.getElementById('hslot'), rslot = document.getElementById('rslot'),
      hcard = document.getElementById('hcard'), rcard = document.getElementById('rcard'), thanksEl = dlg.querySelector('.thanks');
  function homeSlot(){ return (wide.matches && hcard.getBoundingClientRect().bottom < 110) ? rslot : hslot }
  function placeForm(){
    if (modal.classList.contains('open') || (form.contains(document.activeElement) && form.parentNode !== dlg)) return;
    var h = homeSlot(); if (form.parentNode === h) return;
    if (form.parentNode === hslot || form.parentNode === rslot) form.parentNode.style.minHeight = form.offsetHeight + 'px';
    h.style.minHeight = ''; h.appendChild(form); perf(); railOn();
  }
  function perf(){ [hcard, rcard].forEach(function(t){ var hd = t.querySelector('.tk-head'); if (t.offsetParent) t.style.setProperty('--py', (hd.offsetTop + hd.offsetHeight - 1) + 'px') }) }
  if (window.ResizeObserver) { var tro = new ResizeObserver(function(){ perf() }); [hcard, rcard].forEach(function(t){ tro.observe(t.querySelector('.tk-head')) }) }
  function railOn(){ document.getElementById('v2rail').classList.toggle('on', form.parentNode === rslot) }
  var pfRaf = 0; addEventListener('scroll', function(){ if (!pfRaf) pfRaf = requestAnimationFrame(function(){ pfRaf = 0; placeForm() }) }, {passive:true});
  if (wide.addEventListener) wide.addEventListener('change', placeForm); else wide.addListener(placeForm);
  placeForm();
  perf(); addEventListener('resize', perf); if (document.fonts) document.fonts.ready.then(perf);
  function openM(e){
    if (e) e.preventDefault();
    var home = homeSlot(), card = home === rslot ? rcard : hcard, rr = card.getBoundingClientRect();
    if (card.offsetParent && rr.bottom > 120 && rr.top < innerHeight - 120) {
      if (form.parentNode !== home) { home.style.minHeight = ''; home.appendChild(form); perf(); railOn() }
      if (rr.top < 90 || rr.bottom > innerHeight) card.scrollIntoView({block:'center', behavior: reduce ? 'auto' : 'smooth'});
      var f1 = form.querySelector('[name=first_name]'); f1.focus({preventScroll:true});
      card.classList.remove('pulse'); void card.offsetWidth; card.classList.add('pulse');
      return;
    }
    dlg.insertBefore(form, thanksEl);""")
R("""  function closeM(){
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('noscroll');""",
  """  function closeM(){
    modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('noscroll');
    placeForm();""")

# ---------- checks: no em dashes in what a reader sees, nothing from the dropped sections ----------
body = s[s.index('<body'):]
assert '—' not in re.sub(r'<script.*?</script>|<!--.*?-->', '', body, flags=re.S), 'em dash in the page'
for gone in ('class="band"', 'class="nope"', 'class="story"', 'class="wall"', 'heroBtn', 'Quick <em>recap'):
    assert gone not in body, gone

# ---------- styles ----------
CSS = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'v2.css')).read()
i = s.index('</style>'); s = s[:i] + CSS + '\n' + s[i:]

os.makedirs(os.path.join(ROOT, 'v2'), exist_ok=True)
open(os.path.join(ROOT, 'v2', 'index.html'), 'w').write(s)
print('wrote v2/index.html', len(s))
