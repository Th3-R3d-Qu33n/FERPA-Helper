self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("ferpa-cache-v1").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./manifest.json",
        "./src/data/nodes.json",
        "./src/data/chunks.json",
        "./src/data/vectors.index.json",
        "./src/data/vectors.bin"
      ])
    )
  );
});
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
