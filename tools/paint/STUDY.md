# Ana's paper studio: what the references teach, and how we paint it in code

Written Nov 1, 2026, for the VIP page. This study comes from Sean's 20 references (Hotel Le Luv, the courtyard clipboard,
La Maison Diptyque, Plate 49, Magda Butrym, Julia Charvin, Harrods, the sunflower folder, two postage stamps, the
Letters mailbox, the newspaper with coffee, the ink laptop, the blueprint sticker, the folded map, the travel
journal, the Crayola box, the pink envelope, the hand mirror and the bombé dresser) and from Ana's own world. Sean's
rule: no image generators, no Canva. The references are for study only, so every picture here is drawn and painted
in code.

## 1. Ana's world, before any pixel

- **She paints.** "Everyone jokes about leaving corporate to make art. I did it after 15 years." "This morning I
  painted." Her gallery photo shows big colourful canvases. So the page should feel painted by her hand, not
  designed in a UI kit.
- **She writes letters.** Her newsletter goes out to 79,000 subscribers. Envelopes, stamps, postmarks and handwriting
  are her medium, so the VIP page reads as a parcel from her studio.
- **She lives in Greece.** Whitewashed plaster, Aegean blue shutters and kafeneio chairs, bougainvillea pink,
  terracotta, olive branches, sunflowers, morning coffee, her toddler, chickens in the garden.
- **Her brand.** Sunflower yellow, hot pink, warm black ink, cream; Instrument Serif and Manrope; a sunflower smiley
  mark; a black wide-brim hat and a yellow blazer.
- **What she would never be.** Corporate SaaS, neon, glossy 3D, glassmorphism, or the card-with-a-thick-border-and-
  offset-shadow look. That last one is what made our page read as Claude.

## 1b. Each picture, studied zoomed in (detail sheets: crops at 2x of every reference)

| picture | what is actually in the pixels | what we take |
|---|---|---|
| Hotel Le Luv | warm cream paper with a visible felt tooth; brush-pen ink, thick to thin, broken, ruled lines that stop short and overshoot; the topiary is a tan wash laid first, black ink dabbed over it, the tan showing in the gaps; a brush script beside tiny printed serif caps | two passes (colour wash, then ink over it); lines that don't close; print type next to hand lettering |
| Courtyard clipboard | a real photograph: worn brass with true specular light, sandstone, a blue paper that stands in for the sky | one real object in true light; the object is the joke |
| La Maison Diptyque | uniform technical-pen detail everywhere (ironwork, leaves, wallpaper); one fat calligraphic brush stroke (the O) frames the only coloured house, flat bottle green, gold, pale blue | fine detail plus one bold gesture; colour only inside the frame |
| Plate 49 | flat chromolithograph tints (sage, blush, tan, gold), no gradients; ornaments made by repeating one motif (daisy band, dotted rules, fan); type on a curve with "·" separators; double rules, corner rosettes; caption "Gold, 153, 156, 158 and Black" | a pigment list, not a palette; repeat one motif; print captions |
| Magda Butrym | one hairline weight in gold-taupe on off-white; roses as single spirals; the door leaf is the only red, drawn with its thickness so it reads as opening; spaced light serif caps; a hairline rule with ticks | monoline architecture; the accent is the action |
| Julia Charvin | fine pen, slightly shaky; stone courses as short dashes rather than drawn walls; ironwork curls freehand; colour (watercolour) only on the walking family, two tones in the jeans' folds, paint slightly over the line; a pen signature with flourishes | suggest, don't draw; colour only the story; sign it |
| Harrods | brush ink with dry-brush streaks (white where the brush ran out); windows as quick rectangles; gold gouache dots, each a slightly different shape; hand-painted serif letters; red and green with visible strokes | gesture and speed; rhythm from dabs |
| Sunflower folder | impasto oil ridges inside a plain folder shape | fine art inside a mundane object |
| Sunflower stamp | dark brown outlines (never black); veins inside petals; a pink offset printed behind the petals; cream stamp with slight vignette; scalloped perforation; inner rule with a notch for the "21"; serif caps caption | how a stamp is built: inner rule, notch, number, caption, offset print |
| Swan stamp | an engraving cut out on a peach-to-lavender airmail ground; "24 cents" in letterpress, speckled where the ink didn't take; a faint postmark ring over it; aged edges; tiny lowercase serif captions | distressed letterpress numerals; postmark overprint |
| Letters mailbox | matte gouache with horizontal brush streaks; dry edges where the paper shows; slight colour variation; "Letters" in white painted script; a folk bird with white wing strokes; the letter's handwriting is scribble | gouache physics; white lettering; scribble, never fake words |
| Newspaper and coffee | rough watercolour paper, the tooth visible in the pigment; text as wavy scribble lines; blackletter masthead painted by hand; top view | scribble text; granulation |
| Ink laptop | a shaky double ink line; grey washes in values, each key a dab; white paper left for light; the screen scribbled, one red accent | value painting in one grey; one red on the screen |
| Blueprint sticker | sketch double lines; white die-cut border with a soft shadow | a die-cut edge makes an object |
| Folded map | each panel a slightly different value, so the folds read 3D; blooms in the wash; fold lines in ink | depth from value per plane |
| Travel journal | no outlines at all, colour against colour; muted browns; a brass clip in ochre with one white glint; tiny stamps with squiggles; page edges as thin lines | lost-and-found edges; brass as paint |
| Crayola box | watercolour plus coloured pencil; lettering drawn by hand with white highlights; ornaments copied loosely | pencil on top of wash |
| Pink envelope | strong paper tooth in the pink; pencil construction lines left visible; pencil handwriting; white strokes on the folds; pigment pooled darker at edges | let the pencil show; white on the folds |
| Hand mirror | flat gouache blue; the reflection is one broad white stroke; the pearl border is a string of dots with white glints | ornament by repetition; one stroke of light |
| Bombé dresser | thin brown-grey ink, broken; pale tints (cream, sage, mauve); roses as tiny dabs and dots; lots of white | airy; pattern as dabs |

## 1c. Form: shapes, lines, composition and the idea (notan and colour studies, `refs/form-*.jpg`)

Each picture was reduced to three values (a notan, the shape design underneath) and to a map of where its saturated
colour sits.

**Measured.** Colour covers 1% of Magda Butrym, 3% of Julia Charvin and the mirror, 4% of Crayola, 6% of Hotel Le Luv
and Diptyque, 7% of Harrods and 10% of Plate 49. The mailbox, newspaper, laptop and dresser have no strongly
saturated pixels at all; their colour is muted pigment. Only the photograph (77%) and the Van Gogh folder (25%) are
saturated. Our page had saturated pink and yellow blocks over roughly a third of it.

| picture | shapes and composition | lines | the idea |
|---|---|---|---|
| Hotel Le Luv | strict symmetry; a semicircle awning crowns the door; two topiaries are bookends (circle on a stick on a square, repeated); the darkest masses (doorway, topiaries) frame the entrance; stairs lead in | horizontal courses that stop before the edge, so the drawing dissolves into the paper | the name appears twice: on the awning, in the world, and as the signature on the page |
| Courtyard | worm's-eye view, every line converging; a flat object laid over deep space | real architecture | the paper is the sky; the keys are the home |
| Diptyque | the brand's oval label becomes a giant porthole; context in line, focus in colour; a cutaway shows the floors like a dollhouse; small discoveries (a bird, Big Ben) | fine pen for the city, one bold calligraphic stroke for the frame | "look inside": curiosity built into the frame |
| Plate 49 | panels in bands; a half sun rising from the bottom edge with type following its arc; zigzags; corner squares; bilateral symmetry | rules, dotted rules | decoration is the structure; the page is a specimen with captions |
| Magda Butrym | a frontal, symmetrical arch; the door leaf swings toward us as a thin red sliver; roses grow on the columns; the name is cut into the arch | one hairline weight | "our boutique is opening", told as a door literally opening |
| Julia Charvin | a horizontal frieze of facade; the family walks left to right, the reading direction, toward what's next; the dog leads | facade flat in elevation, figures in profile | life walking past an elegant backdrop: the story in front of the stage |
| Harrods | the building fills the frame, slightly curved for energy; the name runs down the centre column | dots trace the architecture's edges | festive lights drawn as dotted outlines |
| Sunflower folder | a mundane digital shape filled with a masterpiece | none | wit by juxtaposition |
| Sunflower stamp | radial flower centred in a portrait rectangle; the numeral sits in a notch that breaks the inner frame; caption at the foot | brown outline | the frame is broken once, on purpose |
| Swan stamp | the S-curve of the neck leads the eye to "24 cents"; the swan overlaps the inner frame | engraving hatch | the subject steps out of its frame, which gives depth |
| Letters mailbox | one boxy silhouette, front view; the letter enters the slot on a diagonal (action against a rectilinear box); the bird on the box carries a letter too | dry brush edges | the motif repeats inside the object (a rhyme) |
| Newspaper | two rectangles stacked at different angles; one circle (the cup) off-centre over them; top view | scribble | circle against rectangles; morning ritual |
| Laptop | three-quarter view; the screen shows tiny sketches | shaky double line | a picture inside a picture |
| Blueprint | the roll curls as it unrolls; the die-cut outline has a speech-bubble notch | double sketch line | the plan "talks" |
| Folded map | accordion folds at an angle; the silhouette is the fold rhythm; contents simplified to blobs and one river line | fold lines in ink | plane changes give depth |
| Travel journal | open book, dark cover page against light page; things tucked in (a pocket with a card, an envelope); stamps scattered at angles | none (colour against colour) | a collected life |
| Crayola | slightly irregular box; crayon tips at varied heights make a rhythm | pencil | respect for the original packaging, redrawn by hand |
| Pink envelope | open, at an angle; strong flap diagonals; a whole landscape on the postcard inside | pencil construction | a picture inside a picture |
| Hand mirror | symmetrical oval and handle, an icon silhouette; a ring of pearls | gouache edge | one stroke is the reflection |
| Bombé dresser | curvy silhouette, S-curved legs; objects on top balanced asymmetrically (tall vase right, small box left) | thin broken ink | airy elegance |

**What form teaches, in one list**
1. One clear silhouette per object, readable as a thumbnail; the detail lives inside it.
2. A frame inside the frame (arch, oval, stamp, plate), broken once on purpose (the swan, the numeral notch, the
   letter in the slot).
3. Symmetry for invitation (doorways, arches); a diagonal for action (the letter entering, the door opening, the
   envelope open).
4. A picture inside the picture (cutaway, postcard, screen, slide inside a slide) to make people look closer.
5. The brand's motif lives inside the world (roses on the columns, the name on the awning, the bird with a letter).
6. Rhythm by repeating one small element (dots, pearls, dashes, daisies, crayon tips).
7. Colour under 10% of the area, muted, and only on the story.
8. Drawings dissolve into the paper; nothing sits in a box.
9. Movement reads left to right, toward the viewer, toward what's next.

**For Ana, from that**
- **Hero:** her door in Greece, frontal and symmetrical, with her video in the opening (a picture inside the
  picture). Bougainvillea grows on the wall (her motif in the world) and sunflower pots stand as bookends. The one
  accent is the pink door leaf swinging toward us: VIP is a door opening.
- **Each VIP part is one object with one silhouette, set as a stamp:**
  - the review: a printed sheet with a red pencil on the diagonal and a coffee cup's circle over it;
  - WhatsApp: her phone at an angle;
  - the Sprint: the yellow workbook open, cards tucked in its pocket, one pulled out;
  - the recordings: film tins, the film strip unspooling in an S-curve that leads the eye like the swan's neck.
- **The week:** a frieze, a street of five bays that you walk along left to right. Days 1 to 3 are windows, Friday
  is the pink door (VIP), and the last bay opens onto the sea.
- **Fit check:** a row of chairs (the audience, rhythm) or two chairs facing at her table (closeness).
- **Her note:** an open envelope at an angle, the letter coming out, sealed with her sunflower.

## 2. Why a person knows at a glance that these aren't generic

1. **One hand made every mark.** Lines wobble, vary in weight, overshoot corners and leave gaps. Nothing is a
   perfect primitive. A template is made of perfect rectangles; a person can't draw one.
2. **The material shows.** You can tell paper from gouache, watercolour, ink, pencil, brass, wax or velvet. Each has
   its own physics (section 4). Generic design has one material: the screen.
3. **Colour is rationed, and the ration carries the story.** Magda Butrym is all gold line except one red door leaf,
   the one that opens. Julia Charvin draws the street in ink and colours only the family. Diptyque inks the city and
   paints only number 107. Harrods spends gold on the lights and the name. The eye goes where the colour is.
4. **The palette is a few pigments, not a colour picker.** Plate 49 says it outright: "Gold, Black and Three Tints."
   Limited pigments mix into each other and stay in harmony. Digital palettes clash because they never mixed.
5. **Real objects carry the meaning.** A clipboard and brass keys mean a new home. A stamp means a letter. A mailbox
   means "you've got post". Designers pick an object that is the idea instead of an icon that labels it (Jason: "how
   do we show this?").
6. **The object is drawn from life.** Three-quarter views, real perspective, things worn and used: chipped paint, a
   dog-eared journal, coffee on the newspaper. An icon is drawn from no point of view; a person always has one.
7. **Restraint around detail.** The illustrations are dense (Diptyque's tiny candles and books, the dresser's
   roses), but the space around them is empty paper. Generic design spreads medium detail evenly over everything.
8. **Framing devices from print history.** Diptyque's oval, Magda's arch, stamp perforations, Plate 49's
   double-ruled border with a plate number and a caption, the postmark ring. They tell you a craftsperson set this
   page.
9. **Type is lettered or set, never just "a font".** "Letters" and "Crayola" are hand lettered. The printed type is
   classical serif capitals with wide spacing and small captions ("postage stamp · swan", "Plate 49", "320 · Gold,
   153, 156, 158 and Black"). Scribbled lines stand in for body text rather than fake words.
10. **Light comes from one place.** Painted highlights (the mailbox's white edge, the mirror's glass) all agree.
    Shadows are a soft grey wash or nothing; there is never a hard offset shadow.
11. **One idea per picture, and it is an invitation.** A door opening, a letter going into the box, a hand reaching
    for a mirror. The illustration does something; it doesn't decorate.

## 3. How the designer worked (the thought process we copy)

1. **Find the true object.** What object, in Ana's real life, is this idea? A review is red pencil on a printout
   next to her coffee. Questions in WhatsApp are her phone on the table. Lifetime recordings are film reels in
   labelled tins. "A little closer" is a second chair pulled up at her table in Greece.
2. **Choose the pigments.** Ana's paintbox: sunflower, bougainvillea pink, Aegean blue, terracotta, olive, warm black
   ink, whitewash, on cream paper. One accent per picture.
3. **Draw the structure in ink**, loosely, from a point of view; let lines overshoot and break.
4. **Lay flat washes** inside the lines, slightly outside them in places (watercolour never fits the line exactly).
5. **Build depth with value, not effects**: a second, darker glaze on the shadow side; leave the paper bare for light.
6. **Finish with opaque gouache**: white highlights, a few crisp details. Stop early.
7. **Put it on the page like a scan**: on paper, multiplied into it, no box around it.
8. **Set the type like a printer**: small spaced capitals, numbered captions, generous margins.

## 4. Materials, and how each is made in code

The engine is `paint.py`. Every picture is drawn as flat SVG layers (`studio.html`, one group per material). The
browser renders each layer, then `paint.py` gives it its material against one shared sheet of paper. So the pigment
pools in the same valleys of the paper that the pencil skips.

| material | what you see in the references | how the code makes it |
|---|---|---|
| **Cold-press paper** | warm cream; a fine tooth that catches pencil and pools pigment; never pure white | one height map per picture: blurred noise at four scales plus fibres. Washes darken in its valleys, pencil and dry brush only touch its peaks. On the page, a pre-rendered paper tile lit from the top left (relief from the height map) |
| **Watercolour wash** | transparent; edges darker where the pigment dried ("edge darkening"); uneven, with blooms; spills slightly past the ink line | the shape is warped by low-frequency noise so it misses the line; pigment density rises near the edge (distance transform), varies with blotch noise and gathers in paper valleys; applied multiplicatively, so washes glaze over each other |
| **Gouache** | opaque, matte and chalky; brush streaks in one direction; dry, broken edges (the mailbox, the mirror) | less warp; an anisotropic streak texture along the stroke; an edge broken by paper noise; laid over the paper, not multiplied |
| **Ink line** | warm black, not #000; wobble; weight varies; tiny dry breaks; corners overshoot | strokes drawn slightly long; warped by medium noise; weight varied by thresholding a thickened stroke against noise; dry breaks where the paper peaks |
| **Coloured pencil** | colour only on the paper's tooth; directional hatching (Crayola) | the colour mask times a "peaks only" mask of the paper; hatch lines at one angle |
| **White gouache highlight** | a few confident strokes on the light side | opaque cream-white strokes, broken by the paper |
| **Grey wash shadow** | a soft, cool, uneven pool under the object; never a CSS box-shadow | a separate wash layer in blue-grey, low density, very soft |
| **Postage stamp** | perforated edge, inner rule, a number in a classical serif, a tiny caption | perforation cut from the paper sheet with half-circles; serif numerals; caption in spaced caps |
| **Postmark / rubber stamp** | uneven ink, partly missing, rotated, overlapping the stamp | ink text on a circle path with heavy dropouts and pressure variation |
| **Wax seal** | glossy, thick, irregular drip edge; an embossed mark | a painted base with darker drips, the sunflower mark as a lighter relief, one white gouache glint |
| **Brass** | ochre wash with umber shadow and a sharp white glint (the journal's clip) | painted as wash + glaze + highlight, never a metallic gradient |
| **Printed paper on the page** (letter, order card, the sales email) | real paper sitting on the desk, slightly curled; shadow soft and close | HTML on the paper tile; a two-layer shadow (a tight contact shadow plus a wide soft one); a few degrees of rotation; deckled edge for the letter |

## 5. What leaves the page, and what replaces it

- Thick black borders and offset pink shadows become paper that sits on paper, with soft close shadows.
- Coloured rounded "art panels" go. The painted object sits on the page like a scan, with empty paper around it.
- Flat UI icons become four postage stamps, one per VIP part. A stamp is the closest thing to Ana: a letter going out.
- Tracked caps in Manrope become small spaced capitals in the serif, with numbered captions ("Nº 1").
- Outlined giant numerals become a small "Nº 01" set like a plate number.
- The neon-bright pink and yellow stay for the button and the brand marks only. Inside the pictures they become
  pigments.

## 6. The page as one story

A parcel from Ana's studio. At the top is her window in Greece, with her video in it. The order card is a stamp
sheet. Your week is a desk calendar. Each VIP part is a still life on her table:
- the red-pencil review next to her coffee;
- her phone, with the days she'll be in the chat;
- the workbook, where six ideas become one;
- the film tins of the recordings.

The fit check is a seat in the audience or a chair pulled up at her table. Her note is a real letter in a pink
envelope, sealed with her sunflower. Every picture uses the same paper, the same ink and the same light.
