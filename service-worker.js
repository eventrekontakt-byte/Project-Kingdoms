// Minimal offline cache for alpha 0.1. Update CACHE_VERSION when assets change.
const CACHE_VERSION="kingdoms-alpha-01-v2";
const ASSETS=["./","./index.html","./manifest.json","./styles/main.css","./engine/game.js","./engine/world.js","./ui/controls.js","./save/storage.js"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE_VERSION).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",event=>{if(event.request.method!=="GET"||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put(event.request,copy));}
  return response;
 })));
});
