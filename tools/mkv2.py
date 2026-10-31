"""Ana's registration page, layout trial: /v2/ (the live page at / is untouched).

The hero is the live page's own two columns: the video big on the left with the booking card and a small drawing of the three days under it, and on
the right the headline and a seat ticket that holds the sign-up form. Once that ticket scrolls away, the form moves into
a slim copy of the ticket that stays frozen on the right of the page (desktop, 1280 px and wider). The form is the
popup's own form, moved between the two tickets and the popup, so the hidden fields, the situation chips and the Kit
sending all work as they do on the live page.

Copy: the revised registration copy (Oct 31, third version), with no em or en dashes. Built from index.html; run it again
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
R('</head>', '<link rel="stylesheet" href="../assets/wins.css">\n</head>')

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from wins import html as wins_html

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
tstrip = tstrip.replace('<b>about 80,000</b>', '<b>About 80,000</b>')
book = book.replace('save my seat (free)', 'I want my exit plan, free').replace('<small>3 days live</small>', '')
assert 'I want my exit plan, free' in book and '<small>' not in book.split('class="go"')[1]

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
          <p class="tk-k">Free · 3 days live · Nov 17 to 19</p>
          <h3 class="tk-h">Save your free seat<span class="tk-and">Let’s work on your exit plan.</span></h3>
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
      <p class="hsub2" id="hk">You’ve spent years getting good at something. Now you’d like to build something of your own with it. <em>Something that could eventually let you hand in your notice, turn down a client, or have a Tuesday that belongs to you.</em></p>
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

# ---------- the copy of Oct 31, third version (the revised registration copy). En dashes in dates are written "to". ----------
# 2. right under the hero: the three questions, who Ana is, the dates and the first ask; Jill's result beside it
JILL_Q = '“I was able to monetize a 300ish audience and make over $3K in a month.”'
INTRO = """<!-- 2. the opening, after the hero: the three questions as one statement, then Ana answers them, beside her own photo -->
<section class="intro who" id="who">
  <div class="wrap">
    <p class="partner"><span id="pname"></span> sent you here. Here's who I am.</p>
    <h2 class="iq" data-r><span class="l">But what would you sell?</span> <span class="l">Where would the people who buy it come from?</span> <span class="l"><em>And could it earn enough to make a difference?</em></span></h2>
    <div class="igrid">
      <div class="ipic" data-r>
        <figure><img src="../img/real/ana-real-a.webp" alt="Ana Calin" width="405" height="720" loading="lazy"><figcaption>Ana Calin<small>How We Grow</small></figcaption></figure>
      </div>
      <div class="itx" data-r>
        <p class="ilead">I’m Ana Calin. My newsletter business has made <b>$1.4M</b> selling workshops and programs, without sales calls.</p>
        <p>On Nov 17 to 19, I’ll show you the starting point I’d choose today, including what AI has changed about the order I teach. We’ll work on your first paid offer, its price, and the email that puts it up for sale.</p>
        <p>You can start while your current work still pays the bills. You don’t need an audience or an idea ready.</p>
        <div class="igo"><button class="btn open" type="button">I want my exit plan, free""" + ARR + """</button><span class="iwhen">Nov 17 to 19 · 12:00 pm New York<br>Free and live on Zoom</span></div>
        <div class="inotes">
          <p><b>Already work for yourself?</b> Your exit might mean dropping the clients you keep accepting because you need the money. This is for you too.</p>
          <p><b>Been to one of my workshops before?</b> Come see why I’d now start differently, and what that changes about your next offer.</p>
        </div>
      </div>
    </div>
  </div>
</section>

"""
R(between('<!-- 2. who\'s Ana:', '<!-- 3. the three days,'), INTRO)

# ---------- 3. the three days ----------
R(between('    <div class="head" data-r>\n      <span class="eyebrow">Tue Nov 17 to Thu Nov 19', '    <div class="rows">'),
  """    <div class="head" data-r>
      <h2><span class="l">The first offer. The price.</span> <span class="l"><em>The first people who could buy.</em></span></h2>
      <p class="dlede">Three days to work out how what you know could become the beginning of an income of your own.</p>
      <p class="dlede">I’ll bring my actual offers, emails, and numbers. You’ll work on yours during the sessions, with selected examples reviewed live.</p>
    </div>

""")
DAYS = [
    ('17', 'Tuesday, Nov 17', 'The first offer I’d make if I wanted out in 2027.',
     ['If you’re fitting this around a job or client work, the idea you choose matters. You want something you can see yourself selling, to people you know how to reach.',
      'I’ll show you where I’d begin today.'],
     [('Where I’d find my first subscribers if nobody knew my name.', 'A starting point for finding people who could need what you know, before you commit to months of writing and hoping.'),
      ('The paid opportunity you might overlook because it comes easily to you.', 'Years of experience can make something feel obvious. I’ll show you what I look for before dismissing it.'),
      ('What my two-sale workshop taught me about choosing an offer.', 'I knew the subject and had done the work. There was something else I should have checked first.'),
      ('The change that made me rethink the starting point.', 'AI is part of the reason. On Nov 17, I’ll show you what I’d do differently and why it matters when your time is limited.')],
     None, ('You’ll leave with', 'a direction for your offer and the people you want to reach.'),
     'On Day 2, we put a price on it that makes this worth doing.'),
    ('18', 'Wednesday, Nov 18', 'Stop charging as though your experience barely counts.',
     ['You might have spent ten years learning something and still feel uncomfortable asking someone to pay for your help.',
      'Let’s work out what your offer is worth before that discomfort chooses the price.'],
     [('What makes someone willing to pay you when advice on your subject is everywhere.', 'I’ll show you the part of an offer that makes free advice the wrong comparison.'),
      ('The pricing check I use before putting an offer up for sale.', 'So your number has something behind it beyond “I hope nobody thinks that’s too much.”'),
      ('The four words I used when a client asked for my best price.', 'They accepted. I’ll show you the exchange and what matters about it when you’re naming your own number.')],
     None, ('You’ll leave with', 'a defined offer and a price you can stand behind.'),
     'Then comes the moment that turns all this into a real possibility: asking someone to buy.'),
    ('19', 'Thursday, Nov 19', 'Write the email that could bring your first paying customers.',
     ['One of my posts got 771 likes and made nothing. Another got 82 likes and brought in money.',
      'I’ll show you both. The difference matters much more than which one looked successful.'],
     [('What the popular post was missing.', 'You’ll see what changed when my writing gave someone a reason to buy.'),
      ('Why I sent one offer to 300 readers instead of my whole newsletter.', 'I’ll show you the decision behind that, and what it means when choosing who should hear about yours.'),
      ('Where an interested person can lose the reason to say yes.', 'We’ll look at the things people add to an offer because they’re nervous, and what those additions do to the ask.')],
     'Then you’ll write your own sales email with me there. I’ll review selected examples live so you can see what I’d change before you send yours.',
     ('By the end,', 'you’ll have an offer, a price, and a written ask. Something you can take into the world and begin testing while your current work still supports you.'),
     None),
]
dtexts = re.findall(r'<div class="dtext">.*?</div>\s*(?=<div class="art")', s, re.S)
assert len(dtexts) == 3, len(dtexts)
for old, (dd, dname, h3, body, lis, after, out, nxt) in zip(dtexts, DAYS):
    new = ('<div class="dtext">\n'
           '          <div class="dwhen"><span class="dcal" aria-hidden="true"><small>NOV</small><b>%s</b></span><span class="dtx"><b>%s</b><span class="dtm"><span class="pill">12:00 pm New York</span></span></span></div>\n'
           '          <h3>%s</h3>\n%s'
           '          <ul>\n%s\n          </ul>\n%s'
           '          <p class="out"><span>%s</span>%s</p>\n%s'
           '        </div>\n        ') % (dd, dname, h3, ''.join('          <p class="body">%s</p>\n' % b for b in body),
                                          '\n'.join('            ' + LI % ('<b>%s</b> %s' % li) for li in lis),
                                          ('          <p class="body after">%s</p>\n' % after) if after else '', out[0], out[1],
                                          ('          <p class="next">%s</p>\n' % nxt) if nxt else '')
    R(old, new)
# the results after the days: the three numbers from the copy ($3,000+, $3,200, $2,400), all from Ana's past challenge
# (Sean, 2026-10-31). Jill's is her own Substack note, rebuilt word for word. The $3,200 and $2,400 have no screenshots
# yet (the images on Ana's Offer Clarity page are drawn mockups), so they are plain quotes until Ana sends real ones.
from wins import JILL
ICONS = ('<span class="rn-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>'
         '<svg viewBox="0 0 24 24"><path d="M5 5h14v10H9l-4 4Z"/></svg><svg viewBox="0 0 24 24"><path d="M7 7h10l-3-3M17 17H7l3 3M17 7v4M7 17v-4"/></svg>'
         '<svg viewBox="0 0 24 24"><path d="M12 15V4M8 8l4-4 4 4M5 13v6h14v-6"/></svg></span>')
RAW = [('$3,000+', 'in a month, from about 300 readers',
        '<div class="rn"><div class="rn-hd"><span class="rn-av">JH</span><span><b>Jill Hart | World Changer</b><small>Substack note</small></span></div><p><span class="rn-at">Ana Calin</span> ' + JILL[10:] + '</p>' + ICONS + '</div>',
        'Jill Hart, in Ana’s past challenge'),
       ('$3,200', 'from 547 subscribers',
        '<div class="trq"><p>First launch ever. Three emails, launched the same week.</p></div>',
        'A student in Ana’s past challenge'),
       ('$2,400', 'from 198 subscribers',
        '<div class="trq"><p>She almost didn’t start because she thought 198 subscribers wasn’t enough. It was.</p></div>',
        'A student in Ana’s past challenge')]
R(between('    <div class="after" data-r>\n      <p>Come to all three.', '  </div>\n</section>\n\n<!-- 4. is this for you? -->'),
  """    <!-- what a first offer can do with a small list: three results -->
    <div class="trio" data-r>
      <h3 class="trio-h"><span class="l">Small lists.</span> <span class="l"><em>Real results.</em></span></h3>
      <p class="trio-k">From people in Ana’s past challenge</p>
      <div class="trio-g">
""" + ''.join('        <figure class="trr"><b class="trr-n">%s</b><span class="trr-f">%s</span>%s<figcaption>%s</figcaption></figure>\n' % x for x in RAW) + """      </div>
      <p class="trio-n">Individual experiences from Ana’s past challenge. Results vary.</p>
    </div>

    <div class="after" data-r>
      <p><span class="l">Come to all three.</span> <span class="l">Let’s give your 2027 plans something to start from.</span></p>
      <button class="btn open" type="button">I’m in for all three (free)""" + ARR + """</button>
    </div>
""")

# ---------- 4 to 13 ----------
DOOR = ('<svg viewBox="0 0 220 150" aria-hidden="true"><path d="M20 138h180" stroke="#1A1412" stroke-width="3" stroke-linecap="round"/>'
        '<rect x="70" y="30" width="80" height="108" rx="4" fill="#FFF8EE" stroke="#1A1412" stroke-width="3"/>'
        '<rect class="lt" x="74" y="34" width="72" height="100" fill="#FFD400"/><path class="sun" d="M150 136 214 150H150Z" fill="#FFD400" opacity=".75"/>'
        '<g class="dr"><path d="M74 34h72v100l-72 4Z" fill="#F72585" stroke="#1A1412" stroke-width="3" stroke-linejoin="round"/><circle cx="134" cy="88" r="4" fill="#FFD400" stroke="#1A1412" stroke-width="2"/></g>'
        '<rect x="88" y="10" width="44" height="16" rx="3" fill="#2fb36a" stroke="#1A1412" stroke-width="2.6"/><text x="110" y="22" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="10" fill="#fff" letter-spacing="1">EXIT</text>'
        '<path d="M34 120c6-10 14-10 20 0" fill="none" stroke="#7BAE5A" stroke-width="3" stroke-linecap="round"/><use href="#sf" x="30" y="88" width="28" height="28"/></svg>')
CAL = ('<svg viewBox="0 0 220 150" aria-hidden="true"><rect x="30" y="18" width="160" height="120" rx="10" fill="#fff" stroke="#1A1412" stroke-width="3"/>'
       '<path d="M30 40h160" stroke="#1A1412" stroke-width="3"/><rect x="30" y="18" width="160" height="22" rx="10" fill="#F72585" stroke="#1A1412" stroke-width="3"/>'
       + ''.join('<rect class="blk b%d" x="%d" y="%d" width="26" height="18" rx="4" fill="%s" stroke="#1A1412" stroke-width="2"/>' % (k, 40 + (k % 5) * 30, 50 + (k // 5) * 26, '#FFB8D9') for k in range(15))
       + '<rect class="me" x="100" y="76" width="26" height="18" rx="4" fill="#FFD400" stroke="#1A1412" stroke-width="2"/><use class="me" href="#sf" x="104" y="76" width="18" height="18"/></svg>')
POST = ('<svg viewBox="0 0 220 150" aria-hidden="true"><path d="M110 40v98" stroke="#1A1412" stroke-width="5" stroke-linecap="round"/><path d="M60 138h100" stroke="#1A1412" stroke-width="3" stroke-linecap="round"/>'
        '<g class="a1"><path d="M110 46h66l14 13-14 13h-66Z" fill="#FFD400" stroke="#1A1412" stroke-width="3" stroke-linejoin="round"/><text x="140" y="64" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="10" fill="#1A1412">JOB</text></g>'
        '<g class="a2"><path d="M110 80H44l-14 13 14 13h66Z" fill="#F72585" stroke="#1A1412" stroke-width="3" stroke-linejoin="round"/><text x="74" y="98" text-anchor="middle" font-family="Manrope,sans-serif" font-weight="800" font-size="10" fill="#fff">MY OWN</text></g>'
        '<use href="#sf" x="96" y="14" width="28" height="28"/></svg>')
SIT = [('job', DOOR, 'I have a job and want to build something alongside it.', 'I’d like leaving to become a choice I can afford.'),
       ('self', CAL, 'I work for myself.', 'I’d like to earn from what I know without taking on another client.'),
       ('both', POST, 'A bit of both.', 'I’m ready to build something that gives me more options.')]
WHERE = """<!-- 4. where are you right now? Three illustrated choices; the pick goes with the sign-up (hidden field "situation"), and the button answers it -->
<section class="sand where" id="where">
  <div class="wrap">
    <div class="head" data-r><h2>Where are you <em>right now?</em></h2></div>
    <div class="sit3" role="group" aria-label="Where are you right now?" data-r>
""" + ''.join('      <button class="chip sit" type="button" data-v="%s" aria-pressed="false"><span class="sit-art">%s</span><span class="sit-ck" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m5 10.5 3.4 3.4L15 6.8"/></svg></span><b>%s</b><span class="sit-s">%s</span></button>\n' % x for x in SIT) + """    </div>
    <div class="sitgo" data-r><button class="btn open" type="button" data-sitgo><span>I want the plan</span>""" + ARR + """</button><small>free · live on Zoom</small></div>
  </div>
</section>

"""
HOST = """<!-- 5. your host -->
<section class="host" id="host">
  <div class="wrap">
    <div class="hostg">
      <div class="hst-tx" data-r>
        <h2><span class="l">I’m Ana. I wanted more say</span> <span class="l"><em>over how my days went.</em></span></h2>
        <p class="big">These days, I run my newsletter business from a village in Greece, on about two hours of work a day.</p>
        <p>How We Grow has about 80,000 readers and has made $1.4M selling workshops and programs. I’ve never taken a sales call.</p>
        <p class="hpl">My first workshop sold two copies.</p>
        <p>So when someone tells me, “I know my subject, but who would pay me for it?” I understand the question. Being good at something and knowing how to turn it into a business are different skills.</p>
        <p class="hpl">That’s what I teach.</p>
        <p>For these three days, I’m bringing my own offers, emails, and numbers. You’ll see the decisions behind them, including what I would change if I were starting again today.</p>
        <p>Then we’ll work on what this could look like for you.</p>
      </div>
      <div class="hst-pic" data-r>
        <figure class="sq"><img src="../img/ana-hat.webp" alt="Ana Calin" width="520" height="520" loading="lazy"></figure>
      </div>
    </div>
  </div>
</section>

"""
LIFE = """<!-- 6. a life left to enjoy it (from Rose's message to Ana: she wants the income, not a business that eats her up) -->
<section class="sand life" id="life">
  <div class="wrap">
    <div class="lifeg">
      <div class="life-pic" data-r>
        <figure><img src="../img/ana-paris.webp" alt="Ana Calin" width="1000" height="671" loading="lazy"></figure>
        <span class="life-clk" aria-hidden="true"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="#fff" stroke="#1A1412" stroke-width="2.6"/><path d="M20 10v10l7 4" fill="none" stroke="#F72585" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg><b>about two hours a day</b></span>
      </div>
      <div class="life-tx" data-r>
        <h2><span class="l">You want more money.</span> <span class="l"><em>You’d also like some life left to enjoy it.</em></span></h2>
        <p>Leaving a job loses some of its appeal if the business you build takes over your evenings, weekends, and every spare thought.</p>
        <p>I run my newsletter business in about two hours a day. That’s why the time an offer takes matters to me alongside what it could earn.</p>
        <p>During these three days, we’ll work on something you can picture fitting around your life, starting alongside the work that currently pays your bills.</p>
        <div class="igo"><button class="btn open" type="button">I want the plan""" + ARR + """</button></div>
      </div>
    </div>
  </div>
</section>

"""
BRING = """<!-- 7. bring the part you're stuck on -->
<section class="bring" id="bring">
  <div class="wrap">
    <div class="bringg" data-r>
      <h2><span class="l">Bring the part</span> <span class="l"><em>you’re stuck on.</em></span></h2>
      <div class="bring-tx">
        <p>Maybe you can’t see what you’d sell. Maybe you have an idea, but the moment you think about charging for it, you start finding reasons to wait.</p>
        <p class="bring-that">Bring that.</p>
        <p>Each day includes time to work on your own offer. I’ll review selected attendees’ work live and explain what I’d change, so you can recognise the same problems in yours.</p>
        <p>You can ask questions while we’re there. You can make changes while they’re fresh. And you’ll have something written before you close Zoom.</p>
      </div>
    </div>
  </div>
</section>

"""
GIFT = """<!-- 8. your gift: the exit number -->
<section class="gift" id="gift">
  <div class="wrap">
    <div class="gcard" data-r>
      <div class="gart" aria-hidden="true">
        <svg viewBox="0 0 220 260"><rect x="20" y="16" width="180" height="228" rx="24" fill="#FFD400" stroke="#1A1412" stroke-width="5"/><rect x="40" y="38" width="140" height="58" rx="10" fill="#FFF8EE" stroke="#1A1412" stroke-width="4"/><path d="M58 76h70" stroke="#1A1412" stroke-width="5" stroke-linecap="round"/><path d="M146 76h16" stroke="#F72585" stroke-width="5" stroke-linecap="round"/><g fill="#FFF8EE" stroke="#1A1412" stroke-width="4"><rect x="40" y="112" width="38" height="30" rx="8"/><rect x="91" y="112" width="38" height="30" rx="8"/><rect x="142" y="112" width="38" height="30" rx="8"/><rect x="40" y="152" width="38" height="30" rx="8"/><rect x="91" y="152" width="38" height="30" rx="8"/><rect x="40" y="192" width="38" height="30" rx="8"/><rect x="91" y="192" width="38" height="30" rx="8"/></g><rect x="142" y="152" width="38" height="70" rx="8" fill="#F72585" stroke="#1A1412" stroke-width="4"/><use href="#sf" x="128" y="-8" width="84" height="84"/></svg>
      </div>
      <div class="gtx">
        <span class="eyebrow">Your gift</span>
        <h2><span class="l">Put a number on</span> <span class="l"><em>the life you want.</em></span></h2>
        <p>“Enough to leave” is a difficult target to work toward.</p>
        <p>Enough to cover your monthly bills, replace one client, or buy back a day of your week gives you somewhere to start.</p>
        <p>After you register, answer seven quick questions and get your <b>exit number</b>.</p>
        <p>You’ll compare your income goal with a few example prices and see how many purchases those prices would require. You’ll also see what the same goal looks like through paid newsletter subscriptions.</p>
        <p>It’s a way to put your options on paper before deciding what to build.</p>
        <p class="gline">Your goal. Your starting point. Some numbers to work with.</p>
        <p class="gnext"><b>From Nov 4,</b> I’ll also send a small preparation task most days, about 15 minutes each. Do what you can. They’ll help you arrive with material we can use during the workshop.</p>
      </div>
    </div>
  </div>
</section>

"""
TK = '<span class="tk"><svg viewBox="0 0 20 20"><path d="m5 10.5 3.4 3.4L15 6.8"/></svg></span>'
FIT_ITEMS = [("“I haven’t started a newsletter. I wouldn’t know where to find readers.”", "We’ll cover where your first subscribers could come from on Day 1."),
             ("“I write, but it hasn’t turned into money.”", "Let’s look at what you could offer and what would give someone a reason to buy."),
             ("“I’m good at my job. Starting something of my own feels completely different.”", "You can bring the experience you already have. We’ll work on the business part."),
             ("“I work for myself, but my calendar still belongs to everyone else.”", "Your next offer could give you a way to earn beyond another client project."),
             ("“What I know feels too obvious to charge for.”", "That comes up often. Bring it to Day 1 before you rule it out."),
             ("“I’ve bought courses before. I need help applying this to my situation.”", "You’ll work during the sessions and see real examples reviewed live.")]
FIT = """<!-- 9. you can start from here -->
<section class="sand fit">
  <div class="wrap narrow">
    <div class="head" data-r>
      <h2><span class="l">You can start</span> <span class="l"><em>from here.</em></span></h2>
      <p class="tip">Tap the ones that sound like you.</p>
    </div>
    <ul data-r>
""" + ''.join('      <li><button type="button" aria-pressed="false">%s<span class="pain">%s</span><span class="fix"><span>%s</span></span></button></li>\n' % (TK, a, b) for a, b in FIT_ITEMS) + """    </ul>
    <!-- shows after the first tap -->
    <div class="fitgo" id="fitgo" hidden><button class="btn open" type="button">That’s me. I’m in.""" + ARR + """</button><small>free · 3 days live</small></div>
  </div>
</section>

"""
STAR = '<svg viewBox="0 0 20 20"><path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.8l-5.1 2.7 1-5.7-4.1-4 5.7-.8Z"/></svg>'
REVS = [("gustavo", "Gustavo Karakey", "Can I just say that you have over delivered. Wow! It's nice to have a clear map. Still work to do, but much more satisfying, and less wheel spinning. :)"),
        ("jeanette", "Jeanette Martin", "What a brilliant, actionable, organised, inspiring bootcamp. Thank you, Ana."),
        ("adora", "Adora Lee", "I finally see the possibility of monetizing here!")]
REVIEWS = """<!-- 10. see the work behind the numbers, then what readers and students say (verified words only) -->
<section class="revs" id="reviews">
  <div class="wrap">
    <div class="head" data-r>
      <h2><span class="l">See the work</span> <span class="l"><em>behind the numbers.</em></span></h2>
      <p class="hp">I’ll show you the offers and emails behind my business, including the ones that disappointed me.</p>
      <p class="hp">You’ll see what I sent, what happened, and what I learned from it. Then you can judge whether the same decisions could help with your own work.</p>
    </div>
    <h3 class="rv-h" data-r>From readers and students who’ve worked with Ana</h3>
    <div class="rgrid" data-r>
""" + ''.join('      <figure class="rq"><blockquote>%s</blockquote><figcaption><img src="../img/av/%s.webp" alt="" width="80" height="80" loading="lazy"><span><b>%s</b><span class="stars" aria-label="5 stars">%s</span></span></figcaption></figure>\n' % (q, img, n, STAR * 5) for img, n, q in REVS) + """    </div>
    """ + wins_html('../', head=False, jill=False, rose=False).replace('\n', '\n    ') + """
    <p class="wall-src">Individual experiences from Ana’s earlier teaching and challenge. Results vary.</p>
  </div>
</section>

"""
PRIZE = """<!-- 11. the Day 3 draw -->
<section class="prize">
  <div class="wrap">
    <div class="stay" id="stay">
      <div>
        <h2>Five people will get <em>a private session with me.</em></h2>
        <p class="lead">Stay until the end of Day 3 and you could be one of them.</p>
        <p>I’ll draw five names at random from the people still attending live. Each person gets a 1:1 session with me to work through their offer and questions.</p>
        <small>Free to enter. Live attendees only. The draw happens at the end of the Nov 19 session.</small>
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
QS = [("Is it really free?", ["Yes. All three workshop sessions are free. You never have to buy anything, and everything you write during them is yours to keep."]),
      ("Do I need an audience or something ready to sell?", ["No. Day 1 includes finding your first readers and exploring what you could offer. Come with your experience and the questions you’re trying to answer."]),
      ("How much time do I need?", ["About 90 minutes a day on Nov 17, 18, and 19. You’ll do the writing during the sessions.",
                                   "From Nov 4, I’ll also send short preparation tasks, about 15 minutes each. Do what you can; you can still attend if you haven’t completed them."]),
      ("Do I need to use Substack?", ["No. I’ll demonstrate on mine because that’s where I run my newsletter. The workshop is about finding people, making an offer, and asking for the sale."]),
      ("Will this work for my subject?", ["If your experience can help someone do something they want to do, or solve something they’re struggling with, there may be a paid offer worth exploring.",
                                         "You don’t need to teach business. Bring your subject, and we’ll look at the possibilities."]),
      ("Should I come if I’ve attended one of your workshops before?", ["Yes, especially if you’re still deciding what to sell or haven’t put your offer out yet.",
                                                                        "I’ll show you why I’d approach the starting point differently now, then help you carry that through to your price and your first ask."]),
      ("Will I be able to leave my job in 2027?", ["That’s the goal we’re working toward, but I can’t promise when your business will earn enough for you to leave.",
                                                   "These three days give you a starting point you can act on: an offer, a price, and a written ask. You can begin testing it while your current work still pays the bills."])]
FAQ = """<!-- 12. a few things you might be wondering -->
<section class="qa" id="faq">
  <div class="wrap">
    <div class="faqs">
      <div class="fhead" data-r><h2>A few things <em>you might be wondering.</em></h2></div>
      <div data-r>
""" + ''.join('        <details class="faq"%s><summary>%s<i aria-hidden="true"></i></summary>%s</details>\n' % (' open' if i == 0 else '', q, ''.join('<p class="a">%s</p>' % a for a in ans)) for i, (q, ans) in enumerate(QS)) + """      </div>
    </div>
  </div>
</section>

"""
ASK = """<!-- 13. the closing ask -->
<section class="sum">
  <div class="wrap">
    <div class="recap ask" data-r>
      <svg class="fl" style="left:-70px;top:-60px;width:230px;height:230px" aria-hidden="true"><use href="#sfo"/></svg>
      <svg class="fl" style="right:-80px;bottom:-90px;width:260px;height:260px" aria-hidden="true"><use href="#sfo"/></svg>
      <h2><span class="l">Start building</span> <span class="l"><em>the option you wish you had.</em></span></h2>
      <p class="ask-big">Being able to leave a job. Turning down the client you dread hearing from. Having more say over the hours in your week.</p>
      <p>Those are worthwhile reasons to build something of your own.</p>
      <p>Join me for three days and let’s work out what your first paid offer could be, who it could help, and how you’ll put it in front of them.</p>
      <div class="askt"><b>The Exit Plan · Nov 17 to 19</b><span>Three live sessions · About 90 minutes each · Free on Zoom</span></div>
      <div class="go"><button class="btn open" type="button">Yes, I’m coming, free""" + ARR + """</button></div>
    </div>
  </div>
</section>
</div>
</main>

"""
tail = between('<!-- 4. is this for you? -->', '<!-- 9. final CTA')
R(tail, WHERE + HOST + LIFE + BRING + GIFT + FIT + REVIEWS + PRIZE + FAQ + ASK)
R('</main>\n\n<footer>', '\n<footer>')

# ---------- the final ----------
R('<h2>See you <em class="nw">Tuesday, Nov 17.</em></h2>\n        <p class="line">Free. Three live sessions with me. You leave with your offer, your price and your first ask.</p>',
  '<h2>See you <em class="nw">Tuesday, Nov 17.</em></h2>\n'
  '        <p class="line">We’re doing this on Zoom. I once ran a workshop on a fancy platform and spent half of it fixing broken links. That was enough of that.</p>\n'
  '        <p class="line">Bring your experience, your questions, and something to write on.</p>\n'
  '        <p class="ftimes"><b>Tue Nov 17 to Thu Nov 19</b><span>12:00 pm New York · 9:00 am Los Angeles</span><span>5:00 pm London · 7:00 pm Greece</span></p>')
R('<button class="btn open shine" type="button" id="finalBtn">save my seat (free)', '<button class="btn open shine" type="button" id="finalBtn">See you Tuesday, Ana!')
fin = between('<p class="conf">', '      </div>\n    </div>\n  </div>\n</section>\n\n<footer>')
R(fin, '<p class="note">free · live on Zoom</p>\n')

# ---------- the top bar and the phone's bottom bar ----------
R('<button class="fb-id open" type="button" aria-label="The Exit Plan, a free 3-day live workshop with Ana Calin: save my seat">',
  '<button class="fb-id open" type="button" aria-label="The Exit Plan, a free 3-day live workshop, Nov 17 to 19, 12:00 pm New York: save my seat">')
R('<span class="fb-t"><small>THE EXIT PLAN · ANA CALIN</small><b>Free 3-day live workshop</b></span>',
  '<span class="fb-t"><small>THE EXIT PLAN · FREE 3-DAY LIVE WORKSHOP</small><b>Nov 17 to 19 · 12:00 pm New York</b></span>')
fbcd = between('    <div class="fb-cd">', '    <button class="btn sm open" type="button">save my seat (free)')
R(fbcd, '')
R('<button class="btn sm open" type="button">save my seat (free)', '<button class="btn sm open" type="button">I’m in, Ana (it’s free)')
R('<span class="mcd"><span class="ld"><i></i>Day 1 · <b class="md">Tue, Nov 17</b></span><b class="md">12:00 pm New York</b></span><button class="btn open" type="button">save my seat (free)',
  '<span class="mcd"><span class="ld"><i></i><b class="md">Nov 17 to 19</b></span><b class="md">12:00 pm New York</b></span><button class="btn open" type="button">I’m in, Ana (it’s free)')

# ---------- the form: the compact registration form copy ----------
R('<span class="ey">STEP 1 OF 3 · FREE · 3 DAYS LIVE<br>NOV 17 TO 19 · 12:00 PM NEW YORK</span>\n      <h3 id="dlg-h">Save your seat for <em>all three days.</em></h3>',
  '<span class="ey">FREE · 3 DAYS LIVE · NOV 17 TO 19</span>\n      <h3 id="dlg-h">Let’s work on <em>your exit plan.</em></h3>\n      <p class="fsub">Save your seat for all three sessions with Ana.</p>')
R('<button class="btn big send" type="submit">save my seat (free)<svg><use href="#arr"/></svg></button>',
  '<button class="btn big send" type="submit"><span class="sf-b" aria-hidden="true"><svg><use href="#sf"/></svg></span><span class="bt">I’m in, Ana (it’s free)</span><svg class="ar"><use href="#arr"/></svg></button>')
R("<p class=\"note\">You'll get my emails about the workshop and my program. Unsubscribe anytime. No hard feelings, no guilt email.</p>\n      <p class=\"note\">free · live on Zoom<span class=\"lt\"></span></p>",
  "<p class=\"fmeta\">12:00 pm New York · About 90 minutes a day<span class=\"lt\"></span></p>\n      <p class=\"note\">You’ll get emails from me, including workshop details and reminders. Unsubscribe anytime.</p>")

# ---------- the form: a visible label over each field, not just the placeholder ----------
R('<div class="field"><input type="text" name="first_name" placeholder="What your readers call you" autocomplete="given-name" aria-label="First name" required>',
  '<div class="field"><label class="flbl" for="jFirst">First name</label><input type="text" id="jFirst" name="first_name" placeholder="Your first name" autocomplete="given-name" required>')
R('<div class="field"><input type="email" name="email_address" placeholder="The email you actually check" autocomplete="email" inputmode="email" aria-label="Email" required>',
  '<div class="field"><label class="flbl" for="jEmail">Email</label><input type="email" id="jEmail" name="email_address" placeholder="The email you actually check" autocomplete="email" inputmode="email" required>')

# ---------- the new pieces' script: the "where are you" button answers the pick; the fit check shows its button after a tap ----------
R('</body>', """<script>
(function(){
  var SITGO = {job: 'I want out by 2027!', self: 'I want to get paid for what I know', both: 'I want the plan'};
  function sitgo(){ var on = document.querySelector('.chip.sit[aria-pressed="true"]'); document.querySelectorAll('[data-sitgo] span').forEach(function(s){ s.textContent = on ? SITGO[on.getAttribute('data-v')] : 'I want the plan' }) }
  document.querySelectorAll('.chip.sit').forEach(function(c){ c.addEventListener('click', function(){ setTimeout(sitgo, 0) }) });
  var fg = document.getElementById('fitgo');
  document.querySelectorAll('.fit button[aria-pressed]').forEach(function(b){ b.addEventListener('click', function(){ if (fg && fg.hidden) { fg.hidden = false; fg.classList.add('in') } }) });
})();
</script>
</body>""")


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
