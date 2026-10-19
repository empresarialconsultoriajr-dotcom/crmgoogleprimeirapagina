// Service worker: cache dos arquivos da aplicação para uso off-line.
const CACHE = 'secreto-v1';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './css/styles.css', './js/app.js', './js/store.js', './js/ui.js', './js/dates.js', './js/progress.js',
  './js/data/days.js', './js/data/content.js', './js/views/index.js', './js/views/home.js', './js/views/journey.js', './js/views/morning.js', './js/views/evening.js',
  './js/views/help.js', './js/views/fast.js', './js/views/relationship.js', './js/views/work.js', './js/views/journal.js', './js/views/progress.js', './js/views/closing.js', './js/views/more.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // fontes externas: rede
  e.respondWith(fetch(e.request).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; }).catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html'))));
});
