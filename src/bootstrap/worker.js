// invoked in worker

global.PHAROS_DATA = {};

global.perfs = ['loadPage', 'domReady', 'redirect', 'lookupDomain', 'ttfb', 'request', 'loadEvent', 'appcache', 'unloadEvent', 'connect'];
global.perfs.forEach((v, k) => global.perfs[v] = k); // eslint-disable-line no-return-assign

global.interval = [
  [0, '0.1s以内'],
  [100, '0.1s-0.25s'],
  [250, '0.25-0.5s'],
  [500, '0.5-1s'],
  [1000, '1-2s'],
  [2000, '2-3s'],
  [3000, '3-4s'],
  [4000, '4-5s'],
  [5000, '5-6s'],
  [6000, '6-7s']
];
