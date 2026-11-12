/* 좀비바이러스 연구실 — 오프라인 실행 (15차)
   · 인터넷이 되면 항상 새 파일을 받고, 안 될 때만 저장해 둔 걸 보여 줘요
   · 인트로 영상(media/)은 브라우저가 조각(Range)으로 받아 가므로 여기서 건드리지 않아요 */
const CACHE = 'zv-v15b';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'img/ch_dojin.png', 'img/ch_seoyeon.png', 'img/ch_minjun.png', 'img/ch_zombie.png','js/core.js', 'js/puzzles.js', 'js/benches.js', 'js/bench3d.js', 'js/sols.js', 'js/imgs.js', 'js/audio.js', 'js/scenes.js', 'js/story.js', 'js/main.js', 'img/s1_w0.jpg', 'img/s1_w1.jpg', 'img/s1_w2.jpg', 'img/s2_w0.jpg', 'img/s2_w1.jpg', 'img/s2_w2.jpg', 'img/s3_w0.jpg', 'img/s3_w1.jpg', 'img/s3_w2.jpg', 'img/s4_w0.jpg', 'img/s4_w1.jpg', 'img/s4_w2.jpg', 'img/s5_w0.jpg', 'img/s5_w1.jpg', 'img/s5_w2.jpg', 'img/s6_w0.jpg', 'img/s6_w1.jpg', 'img/s6_w2.jpg', 'img/s7_w0.jpg', 'img/s7_w1.jpg', 'img/s7_w2.jpg', 'img/s1_w0_open.jpg', 'img/s1_w2_open.jpg', 'img/s2_w0_open.jpg', 'img/s2_w2_open.jpg', 'img/s3_w0_open.jpg', 'img/s3_w2_open.jpg', 'img/s4_w0_open.jpg', 'img/s4_w2_open.jpg', 'img/s5_w0_open.jpg', 'img/s5_w2_open.jpg', 'img/s6_w0_open.jpg', 'img/s6_w2_open.jpg', 'img/s7_w0_open.jpg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()).catch(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => /^zv-v/.test(k) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin || /\/media\//.test(r.url)) return;
  e.respondWith(
    fetch(r).then(res => {
      if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
