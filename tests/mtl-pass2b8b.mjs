import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import * as C from "../engine/mfs/core.js";
import * as M from "../engine/mfs/template-library.js";
import * as F from "../engine/mfs/furniture-placement.js";
import * as R from "../engine/mfs/room-topology.js";
import * as D from "../engine/mfs/decorations.js";
function inspect(t,lib,api){const {rasterize,instantiateBuilding,placementIssues,roomTopology,decorationIssues}=api;let issues=[],stats=[];for(const rotation of t.orientations){const a=instantiateBuilding({...lib,buildings:[t]},t.id,t.version,{mapId:"audit",id:"audit.b1",parcelId:"audit.p1",x:1,y:1,rotation});for(const f of a.interiors){const tag=`${rotation}/${f.level}`,rt=roomTopology(f,a.portals);for(const e of [...placementIssues(f,a.portals),...rt.issues,...decorationIssues(f,a.portals)])issues.push(`${tag} ${e.message} ${e.objectId}`);
const raster=g=>rasterize(g,f.width,f.height),walls=new Set(f.walls.flatMap(x=>[...raster(x.geometry)])),occ=new Set(),blocked=new Set(walls),idx=p=>p.y*f.width+p.x;
for(const o of f.objects)for(const k of raster(o.geometry)){if(walls.has(k)||occ.has(k))issues.push(`${tag} collision ${o.type} ${k}`);occ.add(k);if(o.blocking!==false)blocked.add(k)}
const ep=a.portals.flatMap(p=>[p.a,p.b].flatMap(api.portalEndpointCells)).filter(e=>e.sceneId===f.id);for(const e of ep){if(occ.has(idx(e.trigger))||occ.has(idx(e.arrival))||blocked.has(idx(e.arrival)))issues.push(`${tag} portal blocked`);blocked.add(idx(e.trigger))}
const start=idx(ep[0].arrival),q=[start],seen=new Set(q);for(let i=0;i<q.length;i++){const k=q[i],x=k%f.width,y=Math.floor(k/f.width);for(const [dx,dy] of [[0,-1],[0,1],[1,0],[-1,0]]){const X=x+dx,Y=y+dy,n=Y*f.width+X;if(X>=0&&Y>=0&&X<f.width&&Y<f.height&&!blocked.has(n)&&!seen.has(n)){seen.add(n);q.push(n)}}}
for(const e of ep)if(!seen.has(idx(e.arrival)))issues.push(`${tag} arrival inaccessible`);
for(const o of f.objects)for(const s of o.stations)if(!seen.has(idx(s.approach)))issues.push(`${tag} unreachable station ${o.type}/${s.action}`);
for(const r of f.rooms)if(!seen.has(idx(r.anchor)))issues.push(`${tag} inaccessible room ${r.type}`);
if(rotation===0)stats.push({level:f.level,rooms:rt.rooms.map(r=>({type:r.type,area:r.area,functions:r.availableFunctions})),stationCount:f.objects.reduce((s,o)=>s+o.stations.length,0),accessibleCells:seen.size});
}}return {issues,stats}}

function verify(t,lib,api){
 const assert=(v,m)=>{if(!v)throw Error(t.id+": "+m)},results=[];
 for(const rotation of t.orientations){
 const a=api.instantiateBuilding({...lib,buildings:[t]},t.id,t.version,{mapId:"audit",id:"audit.b1",parcelId:"audit.p1",x:8,y:8,rotation}),p=a.portals[0],lanes=api.portalLanes(p),m={schemaVersion:"1.0.0",mdsVersion:"1.0",mapId:"audit",mapRevision:1,kind:"test",name:"isolated gate test",sourceType:"manual",status:"approved",width:48,height:48,tileMeters:1,baseTilePixels:32,elevationStepMeters:.5,interiorScale:2,sectorSize:16,spawnPoints:[{id:"audit.spawn",sceneId:"audit",x:1,y:3,role:"default"}]},d={terrain:{defaultTile:"grass",regions:[]},parcels:[{id:"audit.p1",geometry:{type:"rect",x:2,y:2,w:40,h:40},accessRoadIds:["audit.r1"]}],roads:[{id:"audit.r1",class:"R5",width:1,geometry:{type:"rect",x:1,y:2,w:1,h:40}}],fortifications:{class:"F0",elements:[]},buildings:[a.building],infrastructure:[],npcZones:[],interiors:a.interiors,portals:a.portals},bundle=api.compileMap(m,d),s=bundle.scenes.get(p.a.sceneId),f=bundle.scenes.get(p.b.sceneId),floor=a.interiors.find(f=>f.level===0),idx=q=>q.y*f.width+q.x,occupancy=new Set(floor.objects.flatMap(o=>[...api.rasterize(o.geometry,f.width,f.height)])),stations=new Set(floor.objects.flatMap(o=>o.stations.map(s=>idx(s.approach)))),thresholds=new Set(floor.id===p.b.sceneId?lanes.b.map(l=>idx(l.trigger)):[]);
 assert(lanes.a.length===t.entrySpan.outside&&lanes.b.length===t.entrySpan.inside,"lane count");
 for(const [from,to,ls,targets] of [[s,f,lanes.a,lanes.b],[f,s,lanes.b,lanes.a]])for(const l of ls){const k=l.trigger.y*from.width+l.trigger.x,arrival=targets[l.target].arrival,q=from.portals.get(k);assert(from.tile(l.trigger.x,l.trigger.y)==="door"&&from.doors.get(k)?.id===p.id&&q?.map===to.id&&q.x===arrival.x&&q.y===arrival.y,"lane compilation or mapping");assert(!from.blocked(l.arrival.x,l.arrival.y),"blocked approach")}
 let depth=0;
 for(let j=0;j<4;j++){if(lanes.b.every(l=>{const dx=l.arrival.x-l.trigger.x,dy=l.arrival.y-l.trigger.y,q={x:l.arrival.x+j*dx,y:l.arrival.y+j*dy},k=idx(q);return q.x>=0&&q.y>=0&&q.x<f.width&&q.y<f.height&&!f.blocked(q.x,q.y)&&!occupancy.has(k)&&!stations.has(k)&&!thresholds.has(k)&&!f.portals.has(k)}))depth++;else break}
 assert(depth>=2,"insufficient clear depth");
 results.push({rotation,exterior:lanes.a.length,interior:lanes.b.length,depth,compiledScenes:bundle.scenes.size});
 }
 return results;
}
const api={...C,...M,...F,...R,...D};
const read=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const lib=await read("templates/mtl/catalog-v14.json"),prior=await read("templates/mtl/pass2b7-candidates.json"),patch=await read("templates/mtl/pass2b8b-candidates.json");
assert.equal(patch.buildings.length,16);
for(const t of patch.buildings){const old=prior.buildings.find(x=>x.id===t.id);assert.equal(t.version,old.version+1);for(const k of ["geometry","stairs"])assert.deepEqual(t[k],old[k]);assert.deepEqual(t.floors.map(f=>f.objects),old.floors.map(f=>f.objects));assert.deepEqual(inspect(t,lib,api).issues,[]);assert.equal(verify(t,lib,api).length,4);}
console.log("Pass II-B8b wide entrance regression passed");
