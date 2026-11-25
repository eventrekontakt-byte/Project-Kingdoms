import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {loadRegistry,loadRevision,sceneOptions,makeScene} from "../tools/map-viewer/model.js";
import {revisionChoices,revisionSelection,revisionLabel} from "../tools/map-viewer/revision-menu.js";
import {decorationIssues} from "../engine/mfs/decorations.js";
import {drawMfsInterior} from "../engine/mfs/interior-renderer.js";

const read=async p=>JSON.parse(await readFile(new URL("../"+p,import.meta.url),"utf8"));
const fetcher=async p=>{try{const v=await read(p);return {ok:true,json:async()=>v};}catch{return {ok:false};}};
const entries=await loadRegistry("maps/",fetcher);
const gallery=entries.filter(e=>e.mapId==="mtl_gallery_001").sort((a,b)=>b.mapRevision-a.mapRevision);
assert.ok(gallery.length>=9);
const latest=gallery[0],r9=gallery.find(e=>e.mapRevision===9);
assert.ok(r9);
assert.equal(revisionChoices(entries)[0].key,latest.key);
assert.ok(revisionChoices(entries).some(e=>e.mapId==="mfs_test_001"));
assert.equal(revisionChoices(entries).filter(e=>e.mapId==="mtl_gallery_001").length,1);
assert.deepEqual(revisionChoices(entries,true).filter(e=>e.mapId==="mtl_gallery_001").map(e=>e.key),gallery.map(e=>e.key));
for(const e of gallery) assert.deepEqual(revisionSelection(entries,e.key),{key:e.key,archive:e.key!==latest.key});
assert.deepEqual(revisionSelection(entries,null),{key:latest.key,archive:false});
assert.match(revisionLabel(r9,entries),/Wojsko i obronność/);
assert.throws(()=>revisionSelection(entries,"mtl_gallery_001@invalid"),/Brak żądanej rewizji/);

const p=await loadRevision("maps/",r9,fetcher);
assert.equal(p.manifest.status,"review");
assert.equal(p.report.playable,false);
assert.equal(p.report.readyForPublication,false);
assert.equal(p.report.counts.ERROR,0);
assert.equal(p.report.counts.WARNING,0);
assert.equal(p.data.buildings.length,110);
assert.equal(p.data.interiors.length,125);
assert.equal(sceneOptions(p).length,126);
assert.ok(p.previewBundle,"Review-only map must compile for preview");
assert.equal(makeScene(p,p.manifest.mapId).issues.length,0);
let operations=0;
const ctx=new Proxy({},{
  get:(o,k)=>k in o?o[k]:(...args)=>{operations++;assert.ok(args.every(a=>typeof a!=="number"||Number.isFinite(a)));},
  set:(o,k,v)=>(o[k]=v,true)
});
for(const f of p.data.interiors){
  const s=makeScene(p,f.id);
  assert.equal(s.issues.length,0,f.id);
  assert.ok(s.visual,f.id);
  assert.equal(decorationIssues(f,p.data.portals).length,0,f.id);
  drawMfsInterior(ctx,s.visual);
}
assert.ok(operations>0);
console.log("MTL r9 regression passed: 110 buildings, 125 interiors, "+operations+" mock canvas operations");
