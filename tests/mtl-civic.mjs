import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {loadRegistry,loadRevision,makeScene,sceneOptions} from "../tools/map-viewer/model.js";
import {validateLibrary,instantiateBuilding} from "../engine/mfs/template-library.js";
import {placementIssues} from "../engine/mfs/furniture-placement.js";
import {roomTopology} from "../engine/mfs/room-topology.js";
import {decorationIssues} from "../engine/mfs/decorations.js";
const read=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const fetcher=async p=>{try{const v=await read(p);return {ok:true,json:async()=>v};}catch{return {ok:false};}};
const lib=validateLibrary(await read("templates/mtl/catalog-v10.json"));
const civic=lib.buildings.filter(t=>t.id.startsWith("CIVIC_"));
assert.equal(civic.length,6);
for(const t of civic)for(const rotation of t.orientations){
  const i=instantiateBuilding(lib,t.id,1,{mapId:"test",id:"test.b1",parcelId:"test.p1",x:10,y:10,rotation});
  for(const f of i.interiors){assert.equal(placementIssues(f,i.portals).length,0,t.id);assert.equal(roomTopology(f,i.portals).issues.length,0,t.id);assert.equal(decorationIssues(f,i.portals).length,0,t.id);}
}
const e=(await loadRegistry("maps/",fetcher)).find(e=>e.mapId==="mtl_gallery_001"&&e.mapRevision===10),p=await loadRevision("maps/",e,fetcher);
assert.equal(p.report.counts.ERROR,0);assert.equal(p.report.counts.WARNING,0);assert.equal(p.report.playable,false);
assert.equal(p.data.buildings.length,116);assert.equal(p.data.interiors.length,131);assert.equal(sceneOptions(p).length,132);
for(const f of p.data.interiors.slice(-6)){const s=makeScene(p,f.id);assert.ok(s.visual);assert.equal(s.issues.length,0);}
console.log("MTL civic tests passed");
