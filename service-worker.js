// Project Kingdoms 0.1-alpha: network-first for updates, cache fallback for offline play.
const CACHE_VERSION="kingdoms-alpha-0317-v1";
const ASSETS=["./","./index.html","./manifest.json","./styles/main.css?v=0.3.13","./engine/game.js?v=0.3.17","./engine/world.js?v=0.3.13","./engine/city-one.js?v=0.3.17","./engine/city-interiors.js?v=0.3.13","./engine/bis.js","./engine/elevation.js?v=0.3.13","./engine/plots.js?v=0.3.13","./engine/interiors/templates.js?v=0.3.13","./engine/interiors/tbi.js?v=0.3.13","./engine/buildings.js","./engine/pathfinding.js?v=0.3.13","./engine/world-map.js","./engine/regions.js","./engine/sites.js","./ui/world-map.js","./systems/interactions.js","./ui/controls.js","./save/storage.js?v=0.3.13"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE_VERSION).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("kingdoms-")&&key!==CACHE_VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=="GET"||url.origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE_VERSION);
  try{
   const response=await fetch(req);
   if(response.ok)await cache.put(req,response.clone());
   return response;
  }catch(error){
   const cached=await caches.match(req);
   if(cached)return cached;
   throw error;
  }
 })());
});
