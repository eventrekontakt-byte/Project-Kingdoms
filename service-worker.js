// Project Kingdoms 0.1-alpha: network-first for updates, cache fallback for offline play.
const CACHE_VERSION="kingdoms-alpha-016-v1";
const ASSETS=["./","./index.html","./manifest.json","./styles/main.css","./engine/game.js?v=0.1.6","./engine/world.js","./engine/buildings.js","./engine/pathfinding.js","./engine/world-map.js","./ui/world-map.js","./systems/interactions.js","./ui/controls.js","./save/storage.js"];
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
   const cached=await caches.match(req,{ignoreSearch:true});
   if(cached)return cached;
   throw error;
  }
 })());
});
