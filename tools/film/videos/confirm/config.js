/* The confirmation video (the page after registering). Her steps, in the page's order: WhatsApp, email, calendar, the 7 quick questions, the Exit Number calculator, the welcome email "in", the Head start page. Times are seconds of her recording. */
(function(){
window.VIDEO = {
  id: 'confirm', desktopW: 1792, herH: 1280, cuts: true, still: true, doorTop: true,
  frames: '_local/confirm/frames', data: ['_local/confirm/data.js', '_local/confirm/face.js'], piecesDir: '_local/confirm/pieces/',
  audio: '~/AnaVideo/out/kit/confirm-mix.wav',
  hold: 1.6,
  layout: {
    d: {W: 1792, zV: 8, bud: 186, RL: [-190, 0], M: [923, 0, 869, 1008], FA: [947, -21, 1], FB: [1382, 30, .47],
      cM: {x: 960, y: 816, w: 800, fs: 58, align: 'center'}, cF: {x: 990, y: 836, w: 760, fs: 58, align: 'center'}, cC: {x: 160, y: 846, w: 1472, fs: 62, align: 'center'}, cW: {x: 396, y: 820, w: 1000, fs: 64, align: 'center'}},
    p: {zV: 8, bud: 190, capT: 1744, capB: 1780, wallM: 1744, hor: 1620, skyH: 1640, RL: [-160, 982], M: [0, 0, 1080, 1920], shM: 1690,
      cM: {x: 40, y: 1392, w: 1000, fs: 70, align: 'center'}, cF: {x: 50, y: 1226, w: 980, fs: 70, align: 'center'}, cC: {x: 50, y: 1484, w: 980, fs: 60, align: 'center'}}
  },
  shots: [[0.5, 'W', 0, .0001], [2.1, 'C', 0, .0001], [6.3, 'M', 0, .0001], [16.36, 'C', 0, .0001], [31.2, 'C', 0, .0001], [38.9, 'M', 0, .0001], [47.28, 'C', 0, .0001], [53.3, 'M', 0, .0001], [73.5, 'F', 0, .0001]],
  punch: [],
  rooms: [[0, 'hill']],
  /* the view from the hill: the room is the village below us, the moving bay shows through the whole top (box) */
  extraRooms: [['hill', 'vhill', [['vhi-bou', -10, -6, 520, 300, 0, 0], ['vhi-oli', 1550, -4, 460, 260, 460, 0], ['vhi-sun', 90, 204, 240, 420, 120, 420]], 360, 1650, 110, [0, 0, 2000, 520]]],
  strips: [[0, 'paint/vip/s-hill.webp']],
  pinkWords: [], lastWordKey: true, capEdits: [], titled: [],
  runner: { path: {d: [[0, 300], [200, 300]], p: [[0, 130], [200, 130]]} },
  arrow: null,
  pieces: function(k){ }
};
})();
