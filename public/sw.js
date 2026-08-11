// Minimal hand-rolled service worker for Hesabi.
// Cache-first for static assets so calculators (all of which use manual/
// static fallback data, never live network calls) keep working offline
// once visited. We intentionally do NOT cache HTML navigations across
// locales/routes broadly — only same-origin static assets — to avoid
// serving stale calculator pages after a deploy.
const CACHE_NAME = "hesabi-static-v1";
const STATIC_EXTENSIONS = [".js", ".css", ".svg", ".png", ".woff2", ".ico"];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isStaticAsset = STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));
  if (!isStaticAsset) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch {
        return cached || Response.error();
      }
    })
  );
});
