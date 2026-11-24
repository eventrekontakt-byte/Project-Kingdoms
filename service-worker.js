// Project Kingdoms 0.1-alpha: network-first for updates, cache fallback for offline play.
const CACHE_VERSION="kingdoms-alpha-0330-v1";
const ASSETS=["./","./index.html","./manifest.json","./styles/main.css?v=0.3.28.1","./engine/game.js?v=0.3.28.4","./engine/npcs.js?v=0.3.27","./engine/dns-population.js?v=0.3.28.4","./engine/npc-doors.js?v=0.3.27","./engine/world.js","./engine/city-one.js","./engine/city-one.js?v=0.3.28.4","./engine/city-interiors.js?v=0.3.13","./engine/bis.js","./engine/elevation.js?v=0.3.13","./engine/plots.js?v=0.3.13","./engine/interiors/templates.js?v=0.3.13","./engine/interiors/tbi.js?v=0.3.13","./engine/buildings.js","./engine/pathfinding.js?v=0.3.28.1","./engine/world-map.js","./engine/regions.js","./engine/sites.js","./ui/world-map.js","./ui/minimap.js?v=0.3.28.1","./ui/minimap-controls.js?v=0.3.28.1","./systems/interactions.js","./ui/controls.js","./save/storage.js?v=0.3.28.4","./engine/game.js?v=0.3.29","./engine/world.js?v=0.3.29","./save/storage.js?v=0.3.29","./ui/minimap.js?v=0.3.29","./engine/pathfinding.js?v=0.3.29","./systems/interactions.js?v=0.3.29","./ui/minimap-controls.js?v=0.3.29","./engine/npcs.js?v=0.3.29","./engine/dns-population.js?v=0.3.29","./engine/npc-doors.js?v=0.3.29","./engine/elevation.js?v=0.3.29","./maps/world.json","./maps/mfs_test_001/manifest.json","./maps/mfs_test_001/terrain.json","./maps/mfs_test_001/parcels.json","./maps/mfs_test_001/roads.json","./maps/mfs_test_001/fortifications.json","./maps/mfs_test_001/buildings.json","./maps/mfs_test_001/infrastructure.json","./maps/mfs_test_001/npc_zones.json","./maps/mfs_test_001/portals.json","./maps/mfs_test_001/interiors/b001/f0.json","./maps/mfs_test_001/interiors/b001/f1.json","./maps/mfs_test_001/interiors/b001/f2.json","./engine/mfs/core.js?v=0.3.29","./engine/interiors/templates.js?v=0.3.12","./engine/plots.js?v=0.3.14","./engine/interiors/templates.js?v=0.3.3","./engine/game.js?v=0.3.30","./engine/mfs/validator.js?v=0.3.30"];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE_VERSION).then(cache=>cache.addAll(ASSETS.map(path=>new Request(new URL(path,self.registration.scope),{cache:"reload"})))).then(()=>self.skipWaiting()));
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
   const response=await fetch(req,{cache:"no-cache"});
   if(response.ok)await cache.put(req,response.clone());
   return response;
  }catch(error){
   const cached=await cache.match(req)||await caches.match(req);
   if(cached)return cached;
   throw error;
  }
 })());
});
