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


const api={...C,...M,...F,...R,...D};const read=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const lib=await read("templates/mtl/catalog-v14.json"),patch=await read("templates/mtl/pass2b9-candidates.json");
const all={...lib,furniture:[...lib.furniture,...patch.furniture]};const actions={"hand_quern":"mill","harvest_sorting_table":"sort_harvest","tanning_worktable":"tan","cow_stall":"cattle_housing","chicken_perch":"roost","nest_box":"nest_eggs","offering_table":"offering","ritual_lectern":"ritual_read","farm_ladder":null};
assert.equal(patch.furniture.length,9);assert.equal(patch.buildings.length,28);
for(const t of patch.buildings){assert.deepEqual(inspect(t,all,api).issues,[]);for(const rotation of t.orientations){const a=M.instantiateBuilding({...all,buildings:[t]},t.id,t.version,{mapId:"audit",id:"audit.b1",parcelId:"audit.p1",x:1,y:1,rotation});for(const f of a.interiors)for(const o of f.objects)if(Object.hasOwn(actions,o.type)){assert.equal(o.templateRef.version,2);if(actions[o.type]===null)assert.equal(o.stations.length,0);else assert.ok(o.stations.length&&o.stations.every(s=>s.action===actions[o.type]));}}}console.log("II-B9 semantic regression passed");
