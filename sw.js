const C = 'zr-beta23';
const FILES = ["./", "index.html", "app.js?v=beta23", "app.css?v=beta23", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // žebříček a formulář jdou přímo na síť
  if (e.request.mode === 'navigate') { e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put('index.html', cp)); return r; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok && /\/(img|snd)\//.test(u.pathname)) { const cp = res.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return res; })));
});
