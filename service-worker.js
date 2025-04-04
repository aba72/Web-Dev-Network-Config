const CACHE_NAME = "todo-cache-v1";
const urlsToCache = [
  "./index.html",
  "./styles.css",
  "./script.js",
  "./manifest.json",
  "./diarra.jpg"
];

// Installer le Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker installé !");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).catch((error) => {
      console.error("Erreur lors de la mise en cache :", error);
    })
  );
});

// Activer le Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker activé !");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`Suppression de l'ancien cache : ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepter les requêtes
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      if (event.request.destination === "document") {
        return caches.match("./index.html");
      }
    })
  );
});
