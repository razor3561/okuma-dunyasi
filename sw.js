/* Çevrimdışı çalışma: uygulama dosyaları ilk açılışta önbelleğe alınır. */
var SURUM = 'okuma-dunyasi-v1';
var DOSYALAR = ['./', './index.html', './manifest.webmanifest', './simge-192.png', './simge-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(SURUM).then(function (c) { return c.addAll(DOSYALAR); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== SURUM; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function (r) {
    var net = fetch(e.request).then(function (res) {
      if (res && res.ok && new URL(e.request.url).origin === location.origin) { var copy = res.clone(); caches.open(SURUM).then(function (c) { c.put(e.request, copy); }); }
      return res;
    }).catch(function () { return r; });
    return r || net;
  }));
});
