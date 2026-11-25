import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {loadCityR2,registryFetcher,createCityBackground,stepCityBackground} from "../engine/city-runtime.js";
import {registerMfs,loadMfsWorld} from "../engine/mfs/core.js?v=0.3.29";
import {findRoute} from "../engine/pathfinding.js";
import {loadGame,SAVE_KEY,LEGACY_BACKUP_KEY} from "../save/storage.js";
import {blocked,doorAt,transitionAt} from "../engine/world.js?v=0.3.29";
const fetcher=async p=>{try{const data=await readFile(new URL("../"+p,import.meta.url),"utf8");return {ok:true,json:async()=>JSON.parse(data)};}catch{return {ok:false};}};
const city=await loadCityR2("maps/",fetcher);
registerMfs(city);
assert.equal(city.scenes.size,128);assert.equal(city.buildings.size,79);assert.equal(city.plots.length,96);assert.equal(city.plots.filter(p=>p.status==="vacant").length,24);
assert.equal(city.spawn.map,"city_001");const s=city.scenes.get(city.spawn.map);
assert.equal(new Set([...s.doors.values()].filter(d=>d.gate).map(d=>d.id)).size,4);
assert.equal(s.worldExits.length,3);
const start={...city.spawn,z:s.elevation[city.spawn.y*s.width+city.spawn.x]};
for(const e of s.worldExits){const route=findRoute(start,e);assert.ok(route.path.length,e.direction+": "+route.reason);}
for(const [k,portal] of s.portals){assert.deepEqual(transitionAt("city_001",0,k%s.width,Math.floor(k/s.width)),portal);assert.ok(!blocked(portal.map,portal.floor,portal.x,portal.y));}
assert.ok(city.tavern&&city.scenes.has(city.tavern.map));
const actors=createCityBackground(city);assert.equal(actors.length,24);stepCityBackground(city,actors,start,{},1000);
assert.ok(actors.every(a=>!blocked(a.map,0,a.x,a.y)));
const saved=new Map(),legacy=JSON.stringify({schema:9,state:{player:{map:"site-city1",floor:0,x:96,y:132},clock:{day:5,hour:11,minute:15},inventory:["test"],plotEdits:{"old":{status:"reserved"}}}});
globalThis.localStorage={getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v)};saved.set(SAVE_KEY,legacy);
const migrated=loadGame();assert.equal(migrated.player.map,"city_001");assert.equal(migrated.clock.day,5);assert.deepEqual(migrated.inventory,["test"]);assert.equal(saved.get(LEGACY_BACKUP_KEY),legacy);assert.equal(saved.get(SAVE_KEY),legacy);
const [old]=await loadMfsWorld("maps/",await registryFetcher("maps/",false,fetcher));assert.equal(old.scenes.size,4);
console.log("City r2 runtime: 128 scenes, 79 buildings, 96 plots, three exits, four gates, portals, background and migration verified");
