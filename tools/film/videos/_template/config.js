/* A new video. Copy this folder to videos/<id>, change `id`, and fill it in. Times are seconds of her recording; T() maps them onto the cut. */
window.VIDEO = {
  id: 'CHANGE-ME',
  frames: '_local/CHANGE-ME/frames', data: ['_local/CHANGE-ME/data.js', '_local/CHANGE-ME/face.js'],  /* what kit/prep.py writes */
  audio: '~/AnaVideo/out/kit/CHANGE-ME-mix.wav',                                                       /* what kit/audio.py writes */
  hold: 1.6,                               /* seconds held on the last frame */
  /* start, type (M main, F framed, C cut-away), crop 0 to 2, optional push-in such as .09 */
  shots: [[0, 'M', 0], [8, 'F', 0], [16, 'C', 0], [24, 'M', 1]],
  punch: [],                               /* the camera steps closer on these words */
  rooms: [[0, 'coast']],                   /* coast, studio, desk: the shutters swing on each change */
  pinkWords: [], lastWordKey: true,        /* words that go pink instead of yellow; the last word of the video is a key word */
  capEdits: [],                            /* a caption note: [recording second, old word, new word]. No need to rerun prep for one word */
  titled: [],                              /* desktop: [from, to] while a title is up, the caption sits below it */
  runner: {                                /* the sunflower. Only `path` is needed; every other list is optional */
    path: {d: [[0, 320], [300, 320]], p: [[0, 130], [300, 130]]},  /* [second, x]: he runs when x changes */
    openRun: null,                         /* [to, eased-off]: runs on the spot from the start, the wall sliding */
    pots: [], potsUntil: 0,                /* seconds he leaps a pot */
    launches: [],                          /* [from, to, height desktop, height phone] */
    backRun: null,                         /* [from, to]: runs backwards */
    hops: [],                              /* [second, height]: jumps on the words that matter */
    pointAt: [],                           /* [raise, up, lower, down, angle desktop, angle phone] */
    shrugs: [], formPoints: [], points: [], sit: null, bounceFrom: null
  },
  arrow: null,                             /* {from, to, off, d: {src, x, y, w, h, path, head}, p: {...}} */
  /* Everything laid on top. add(html, in, out, [left, top, width, font] desktop, same for phone, {cls, rot, tilt, wipe, hold}).
     cls: top (over everything), under (behind the wall), shadowp. wipe 1: the .ln lines wipe on. hold 1: no landing move; set it.count = fn(t) to move it yourself. it.seq = fn(t) swaps its image per frame.
     Helpers: img(src), cut(name from cut/), strike(html, in, out, hit, d, p), map(words or null, in, out, states, d, p), sit(file, text). Classes: big (serif line, mark and i inside), rowb, statc, lbl, snap. */
  pieces: function(k){
    var add = k.add, img = k.img, cut = k.cut, strike = k.strike, map = k.map, sit = k.sit, T = k.T, seg = k.seg, lerp = k.lerp, io = k.io, clamp = k.clamp, PHONE = k.PHONE, V = k.V, PC = k.PC, box = k.box, $ = k.$;
    add('<div class="big"><span class="ln">FIRST LINE</span><span class="ln"><i>second line.</i></span></div>', 0, 4, [62, 92, 620, 96], [0, 1752, 1080, 66], {cls: 'top', wipe: 1});
    add('<div class="big"><mark>A KEY LINE.</mark></div>', 9, 12, [62, 120, 620, 96], [0, 1266, 1080, 110], {cls: 'top'});
    strike(cut('bulb') + 'A CROSSED-OUT WORD', 17, 20, 17.5, [62, 214, 0, 62], [190, 1300, 0, 70]);
    map(null, 25, 28, ['cur', '', ''], [90, 420, 1060, 44], [40, 980, 1000, 40]);
  }
};
