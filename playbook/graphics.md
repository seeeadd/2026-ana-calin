# Graphics: how they look and how they're made

Source: Sean's corrections Oct 25 to Nov 4, 2026, his 20 reference images (studied in `tools/paint/STUDY.md`), and
what he approved ("the most perfect VIP page we have ever built").

## 1. The test every graphic must pass

- **Could a stranger tell this was made by Claude?** If yes, it fails. Tells Sean has named:
  - generic cards with a thick black border and an offset shadow;
  - evenly sprinkled medium detail;
  - flat UI icons;
  - default arrows ("looks like every other Claude annotation ever");
  - rebuilt screenshots that look drawn;
  - "Gemini pattern" badges;
  - muddy greys and browns.
- **Does it mean one specific thing?** "I still want the graphics to mean something, not just a bunch of things...
  specific... different layouts... not repetitive."
- **Is it balanced on the page?** Not scattered, not cramped, nothing over text, text fits, no awkward white space.
- **Would the client recognise it as hers?** (Her painting: "I want her to be able to recognize it.")

## 2. Real or painted? Decide for every graphic, and say which

| use REAL (screenshots, real apps, real photos) when | use PAINTED metaphor when |
|---|---|
| it's proof: results, numbers, testimonials, her posts, her sales | it's a feeling: welcome, closeness, relief, momentum |
| the viewer must picture doing it: the Gmail inbox, the WhatsApp chat, the Google Calendar invite, the Zoom call, the form | it's an idea: the "usual order" tower, a door to 2027, a chair pulled closer |
| it's the actual product: the calculator, the course, the slides | it's decoration that also tells the story (Greek window, flowers, seasonal touches) |

**Real apps are copied exactly, then themed in the brand** ("realistic Gmail", "more realistic WhatsApp... Ana-themed",
"make it more Google Ads-accurate", "a raw screenshot instead of something like this, it looks Claude-generated").
Exact layout, spacing, icons and fonts of the app; brand colours only where the app allows them (avatars, accents,
content).

**But never copy a trademark closely.** App icons and logos of real brands get an original stand-in that reads the
same: a green circle with a white camera for a video call, not FaceTime's rounded square.

## 3. The painted look (Ana's; adapt the pigments for other clients)

- **Hand-made marks:** ink lines that wobble, vary in weight, overshoot corners and break.
- **Materials you can tell apart:**
  - watercolour wash that misses the line and darkens at the edge;
  - matte gouache with brush streaks;
  - coloured pencil on the paper's tooth;
  - white gouache highlights;
  - a soft cool grey wash for shadows.
- **One paper under everything:** warm cream with a tooth, never pure white.
- **Depth from value,** a darker glaze on the shadow side. More depth and texture than the brand's flat originals
  ("Ana's art style is a bit too simple, elevate it: more shadows, texture, details").
- **Colour rationed:** under about 10% of a picture, on the story only; one accent per picture.
- **Composition:**
  - one silhouette per object, readable as a thumbnail;
  - a frame inside the frame, broken once on purpose;
  - a picture inside the picture;
  - a repeated motif (dots, petals).
- **Print craft:** spaced serif small caps, "Nº 01" plate numbers, stamps and postmarks, die-cut sticker edges.
- **Stickers:** transparent background, raw hand-cut white border (uneven, straight snips, small overcuts), soft
  close shadow; cut out big enclosed white areas.
- **Detail where it counts:** Sean zooms in. "Add more effort on the curves", "don't remove the curves and textures
  of the leaves and flowers", "more details on the flowers, on the flower pots". Trace from the reference, line
  first, then fill; compare side by side, one element at a time.
- **3D where objects open:** doors and shutters with visible thickness and perspective ("more 3D, it looks flat").

**How it's made:**
1. Draw the picture in `tools/paint/studio.html` as an `<svg data-art="name">` with material layers:
   `<g data-mat="wash|gouache|ink|pencil|white|shadow|flat|sheet">`.
2. Render the layers with `node tools/paint/render.js name`.
3. Paint them with `python3 tools/paint/paint.py name`, which writes `img/vip/paint/name.webp`.

Leave room for shadows inside the canvas so nothing gets cut at the edge.

## 4. What Sean uses Gemini for (and what he doesn't)

- Claude does **not** use image generators or Canva for graphics. "You are the tool."
- Sean runs Gemini himself for **photos of the client** (polish, outfit, location) and sometimes **badges or
  stickers**. Claude writes the prompts. A good prompt:
  - attaches the original real photo first;
  - lists exactly what to keep (face, pose, hands, room);
  - lists what to improve;
  - adds an "avoid" list and follow-up fixes.
- Never change the client's face; it must not look AI.
- When a Gemini photo looks AI, ask for the unedited original (for Ana, her YouTube Short stills, see the
  brand file).

## 5. Pattern-interrupt badges and stickers

- Sean likes badges that "activate the monkey brain" while scrolling: giveaway seals, a free-gift tag, lifetime
  access, doors-close.
- Style that worked: a glossy, traditional seal (gold rim, red satin ribbon, white condensed caps).
- They must have words, spelled exactly.
- Rules:
  - two per page at most;
  - placed where they label the thing next to them (the prize, the gift, the price);
  - never covering content;
  - never promising something not offered (no "full refund").

## 6. UI pieces that must look premium

- **Sticky header:** a floating card with brand cartoon, event line ("free 3-day live event" always visible), the
  date and time, a countdown and the CTA. It shrinks on scroll; height stays the same unless content needs it. No
  flat grey bars "with no depth".
- **Forms:**
  - visible labels ("First name", "Email") and a ticket shape;
  - active and alive, but not pushy ("like they're already in, they just have to sign up");
  - a subtle hint on the first field, never a strong pulse;
  - the visitor's own time and date highlighted, with a clock icon.
- **Buttons:** first-person wording ("I'm in, Ana (it's free)"), a brand icon on the left that animates on hover
  (the sunflower; in December, with a Santa hat and candy cane). Never greyed out.
- **Tickers and live counts:** compact, low-key, real data only (they never show until there are 50 real
  registrants).
- **Frames:**
  - modern devices with thin bezels;
  - photos framed in brand graphics (Ana's painted picture frame) rather than plain rectangles;
  - faces never cropped.

## 7. Seasonal layer (December)

"A little cute seasonal spice, not over the top", made with our own painted techniques: a tree, a wreath,
holly, string lights hanging on the frozen form, glassy white snowflakes in two sections only (not the whole
page), and a hat on the sunflower. It switches off automatically after the date.
