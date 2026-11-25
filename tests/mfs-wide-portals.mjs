import assertNode from "node:assert/strict";
import {readFile} from "node:fs/promises";
import * as C from "../engine/mfs/core.js";
import * as M from "../engine/mfs/template-library.js";
import * as F from "../engine/mfs/furniture-placement.js";
import * as R from "../engine/mfs/room-topology.js";
import * as D from "../engine/mfs/decorations.js";
import * as V from "../engine/mfs/validator.js";
import * as W from "../tools/map-viewer/model.js";
export function testGate(C,M,F,R,D,V,W,manifest,data,assert,same,clone){
 const old=C.compileMap(manifest,data),m=manifest.mapId;
 assert(old.scenes.size===4,"legacy scenes");assert(old.scenes.get(m).tile(9,13)==="door","legacy portal");
 const legacyReport=V.validateMap(manifest,data).report;assert(legacyReport.counts.ERROR===0,"legacy validator");
 const wide=clone(data),p=wide.portals[0];p.a.lanes=[0,1].map(i=>({trigger:{x:9+i,y:13},arrival:{x:9+i,y:14},target:i*2}));p.b.lanes=[0,1,2,3].map(i=>({trigger:{x:6+i,y:15},arrival:{x:6+i,y:14},target:Math.floor(i/2)}));
 const bundle=C.compileMap(manifest,wide),s=bundle.scenes.get(m),f=bundle.scenes.get(p.b.sceneId);
 for(const l of p.a.lanes){assert(s.tile(l.trigger.x,l.trigger.y)==="door","external lane tile");const k=l.trigger.y*s.width+l.trigger.x;assert(s.doors.get(k).id===p.id,"shared exterior state");same(s.portals.get(k),{map:f.id,floor:0,...p.b.lanes[l.target].arrival},"external mapping")}
 for(const l of p.b.lanes){const k=l.trigger.y*f.width+l.trigger.x;assert(f.tile(l.trigger.x,l.trigger.y)==="door","interior lane tile");assert(f.doors.get(k).id===p.id,"shared interior state");same(f.portals.get(k),{map:s.id,floor:0,...p.a.lanes[l.target].arrival},"return mapping")}
 const report=V.validateMap(manifest,wide).report;assert(report.counts.ERROR===0,"wide validator: "+JSON.stringify(report.entries.filter(x=>x.severity==="ERROR")));
 for(const [id,n] of [[s.id,2],[f.id,4]]){const v=W.makeScene({manifest,data:wide,bundle,previewBundle:bundle},id);assert(v.items.filter(x=>x.layer==="portals"&&x.id===p.id).length===n,"viewer lanes "+id)}
 const cases=[
  ["noncontiguous",d=>{d.portals[0].b.lanes[2].trigger.x++;d.portals[0].b.lanes[2].arrival.x++}],
  ["invalid target",d=>d.portals[0].a.lanes[0].target=4],
  ["missing other side",d=>delete d.portals[0].b.lanes],
  ["primary mismatch",d=>d.portals[0].a.trigger.x--],
  ["blocked arrival",d=>d.interiors[0].walls.push({id:m+".b001.f0.wall99",geometry:{type:"rect",x:9,y:14,w:1,h:1},kind:"partition"})],
  ["outside footprint",d=>{const q=d.portals[0];q.a.trigger.x=11;q.a.arrival.x=11;for(const [i,l] of q.a.lanes.entries()){l.trigger.x=11+i;l.arrival.x=11+i}}],
  ["stairs span",d=>{const q=d.portals[1];q.a.lanes=[{trigger:q.a.trigger,arrival:q.a.arrival,target:0}];q.b.lanes=[{trigger:q.b.trigger,arrival:q.b.arrival,target:0},{trigger:{x:4,y:10},arrival:{x:4,y:11},target:0}]}]
 ];
 for(const [name,change] of cases){const d=clone(wide);change(d);let rejected=false;try{C.compileMap(manifest,d)}catch{rejected=true}assert(rejected,"accepted invalid "+name);assert(V.validateMap(manifest,d).report.counts.ERROR>0,"validator accepted "+name)}
 const floor=clone(wide.interiors[0]);floor.decorations=[{id:floor.id+".dec999",type:"wall_lantern",name:"Lantern",mount:"wall",geometry:{type:"rect",x:7,y:15,w:1,h:1},rotation:0,blocking:false}];assert(D.decorationIssues(floor,wide.portals).length>0,"decor on secondary lane");
 floor.objects[0].placement={mode:"free"};floor.objects[0].stations[0].approach={x:7,y:15};assert(F.placementIssues(floor,wide.portals).length>0,"station on secondary lane");
 const t={id:"TEST_WIDE",version:1,name:"Wrota testowe",type:"warehouse",shape:"R",width:6,height:8,geometry:{type:"rect",x:0,y:0,w:6,h:8},entry:{x:2,y:7},interiorEntry:{x:4,y:15},entrySpan:{outside:2,inside:4},orientations:[0,90,180,270],dependencies:[],stairs:[],floors:[{partitions:[],roomSplits:[],objects:[],decorations:[],rooms:[{type:"storage",anchor:{x:5,y:5},access:"Z2",functions:[]}]}]};
 const lib={schemaVersion:"1.0.0",mdsVersion:"1.0",furniture:[],buildings:[t]};let rotations=0;
 for(const span of [{outside:1,inside:2},{outside:2,inside:3},{outside:2,inside:4}])for(const rotation of t.orientations){t.entrySpan=span;const a=M.instantiateBuilding(lib,"TEST_WIDE",1,{mapId:"test",id:"test.b1",parcelId:"test.p1",x:10,y:20,rotation});const q=a.portals[0],lanes=C.portalLanes(q);assert(lanes.a.length===span.outside&&lanes.b.length===span.inside,"template span counts");const g=a.building.geometry,inside=(p,g)=>p.x>=g.x&&p.y>=g.y&&p.x<g.x+g.w&&p.y<g.y+g.h;for(const l of lanes.a)assert(inside(l.trigger,g)&&!inside(l.arrival,g),"rotated exterior boundary");const ff=a.interiors[0],walls=new Set(ff.walls.flatMap(o=>[...C.rasterize(o.geometry,ff.width,ff.height)]));for(const l of lanes.b)assert(walls.has(l.trigger.y*ff.width+l.trigger.x)&&!walls.has(l.arrival.y*ff.width+l.arrival.x),"rotated interior boundary");assert(!F.placementIssues(ff,a.portals).length&&!R.roomTopology(ff,a.portals).issues.length&&!D.decorationIssues(ff,a.portals).length,"rotated floor");rotations++}
 return {legacyErrors:legacyReport.counts.ERROR,wideErrors:report.counts.ERROR,lanes:6,rejected:cases.length,rotations,thresholdChecks:2,viewerScenes:2};
}
const get=async p=>JSON.parse(await readFile(new URL("../maps/mfs_test_001/"+p,import.meta.url),"utf8"));
const manifest=await get("manifest.json"),data=Object.fromEntries(await Promise.all(Object.entries(manifest.files).map(async ([k,p])=>[k,await get(p)])));data.interiors=await Promise.all(manifest.interiors.map(get));
const stats=testGate(C,M,F,R,D,V,W,manifest,data,(a,m)=>assertNode.ok(a,m),(a,b,m)=>assertNode.deepEqual(a,b,m),structuredClone);console.log("Wide portal regression",stats);
