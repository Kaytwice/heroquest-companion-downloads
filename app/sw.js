// Only immutable artwork is cached. Appwrite requests and the application bundle go to the network.
const artwork = new Set(["composeResources/heroquest.web.resources/drawable/background_town_gate_closed.webp", "apple-touch-icon.png"]
  .map(name => new URL(name, self.registration.scope).href));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || !artwork.has(event.request.url)) return;
  event.respondWith((async () => {
    const cache = await caches.open("heroquest-phase0-art-v1");
    const cached = await cache.match(event.request);
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok) await cache.put(event.request, response.clone());
    return response;
  })());
});
