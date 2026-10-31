"""The wins block: real posts from Ana's most recent challenge (word for word, as embedded on
monetisesubstack.com/30-day-substack-challenge), plus two she sent on Oct 31 (Jill Hart's note, Rose's message).
One block for every page that needs proof: python3 tools/wins.py prints it; the pages and tools/mkv2.py use html(prefix)."""

WINS = [  # (file in img/wins, the result, the name, alt text from her page)
    ('highticket', '27 → 88 in 15 days', 'The High-Ticket Closer', 'From 27 to 88 subscribers in 15 days', 364),
    ('suzanne', '+3 paid in week 1', 'Suzanne Harrison', 'Suzanne: #62 Rising, 16 subscribers and 3 paid in a week', 388),
    ('kwame', '+18 in 30 days', 'Kwame Twumasi-Ankrah', 'Kwame: +18 subscribers, 2 paid away from double digits', 353),
    ('asteria', 'First 100 subs', 'Asteria Rose', 'Asteria: first 100 subs', 555),
    ('jessica', '52 subscribers', 'Jessica Donovan', 'Jessica: woke up to 52 subscribers', 275),
    ('jenna', 'Raised her price', 'Jenna Garagiola', 'Jenna: increased the price, updated paid subscription', 378),
    ('stephanie', 'Rebranded in week 1', 'Stephanie Frank', 'Stephanie: rebranded her Substack in week one', 265),
    ('malinda', 'A name she loves', 'Malinda Zarate', 'Malinda: first week of the challenge has been amazing', 342),
    ('andrea', 'On the hot seat', 'Andrea Dell', 'Andrea on the Thursday hot seat', 333),
]
JILL = ('Ana Calin When I first started here she really helped me sort out what was important and where to focus - because of her advise '
        'I was able to monetize a 300ish audience and make over $3K in a month. And she helped me connect the idea of Substack &amp; Skool together.')
ROSE = ('I think your emails are some of the best of the ones I receive. Very focused and come from someone who is many steps ahead of me. '
        'I’m not interested in fluffy “you can do it” type of advice, which is why I read yours.')


def html(prefix='../', head=True, skip=(), jill=True, rose=True):
    cards = []
    if jill: cards.append('<figure class="aw-c aw-note"><span class="aw-r">$3K+ in a month</span><div class="aw-n"><div class="aw-hd"><span class="aw-av">JH</span><span><b>Jill Hart | World Changer</b><small>Substack note</small></span></div>'
                 '<blockquote><span class="aw-at">' + JILL[:9] + '</span>' + JILL[9:] + '</blockquote></div><figcaption>Jill Hart</figcaption></figure>')
    for i, (f, r, n, alt, h) in enumerate([w for w in WINS if w[0] not in skip]):
        cards.append('<figure class="aw-c"><span class="aw-r">%s</span><img src="%simg/wins/%s.webp" alt="%s" width="900" height="%d" loading="lazy"><figcaption>%s</figcaption></figure>' % (r, prefix, f, alt, h, n))
        if i == 3 and rose:
            cards.append('<figure class="aw-c aw-dm"><span class="aw-r">A paid subscriber</span><div class="aw-n"><div class="aw-hd"><span class="aw-av">R</span><span><b>Rose</b><small>Paid subscriber · a message to Ana</small></span></div>'
                         '<blockquote>' + ROSE + '</blockquote></div><figcaption>Rose</figcaption></figure>')
    top = ('<div class="aw-h"><b>From my students and readers.</b> Real posts and messages, word for word.</div>\n' if head else '')
    return ('<!-- the wins: real posts and messages from Ana\'s students and readers (tools/wins.py) -->\n<div class="aw" data-wins>\n' + top
            + '<div class="aw-g">\n' + '\n'.join(cards) + '\n</div>\n<button class="aw-more" type="button" hidden>show all ' + str(len(cards)) + ' wins</button>\n'
            + '<script>(function(){var w=document.currentScript.parentNode,b=w.querySelector(".aw-more");if(matchMedia("(max-width:700px)").matches){w.classList.add("short");b.hidden=false;b.addEventListener("click",function(){w.classList.remove("short");b.hidden=true})}})();</script>\n</div>')


if __name__ == '__main__':
    print(html())
