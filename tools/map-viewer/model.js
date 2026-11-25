import {ruralColor,validateRuralAreas} from "../../engine/mfs/rural-areas.js?v=0.3.42";
import {roomTopology,ACCESS_COLORS} from "../../engine/mfs/room-topology.js?v=0.3.33.2";
import {compileMap} from "../../engine/mfs/core.js?v=0.3.29";
import {playerStartCells} from "../../engine/mfs/furniture-placement.js?v=0.3.32.2";
import {rasterize,VERSION} from "../../engine/mfs/core.js?v=0.3.29";
import {readValidationInputs,validateMap,PROFILES} from "../../engine/mfs/validator.js?v=0.3.35";
export const LAYERS=[["terrain","Teren","#698753"],["rural","Uprawy i tereny gospodarcze","#ae9659"],["water","Woda","#326e9c"],["elevation","Wysokość","#c9a98b"],["parcels","Działki","#b4ce87"],["roads","Drogi i place","#baa17d"],["fortifications","Fortyfikacje","#b9bdc5"],["buildings","Budynki / ściany","#aa805d"],["vegetation","Roślinność","#285d38"],["infrastructure","Infrastruktura","#e4b86b"],["objects","Wyposażenie","#aa805d"],["decorations","Dekoracje podłogi i ścian","#d49e77"],["surfaceProps","Drobne przedmioty na meblach","#f2cf86"],["lighting","Oświetlenie","#f2d770"],["portals","Portale","#edc865"],["stations","Stanowiska NPC","#53c6d0"],["playerStarts","Interakcja gracza","#9ccc77"],["access","Dostęp / pokoje","#b591d7"],["npcZones","Strefy NPC","#7db4f3"],["collision","Kolizje / progi","#e36c72"]];
export const PALETTE={grass:"#57794b",meadow:"#7a9658",water:"#326e9c",road:"#baa17d",stone:"#94938c",wood:"#b39972",wall:"#4a5058",tree:"#285d38",object:"#ad8050",void:"#161e26",hill:"#69774d","forest-floor":"#3e5e3b",rock:"#76766b",marble:"#d2d1c5",rampart:"#a4a6a3"};
const colors=Object.fromEntries(LAYERS.map(([k,n,c])=>[k,c])),list=x=>Array.isArray(x)?x:[],safe=/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.json$/;
export function registryEntries(world,review){
 if(world.schemaVersion!==VERSION||review.schemaVersion!==VERSION||!Array.isArray(world.locations)||!Array.isArray(review.locations))throw Error("Nieprawidłowy rejestr");
 const seen=new Set(),out=[];
 for(const [source,rows] of [["world",world.locations],["review",review.locations]])for(const e of rows){
  const key=e.mapId+"@"+e.mapRevision,profile=e.profile||"final";
  if(typeof e.mapId!=="string"||!Number.isInteger(e.mapRevision)||e.mapRevision<1||!safe.test(e.manifest||"")||!PROFILES.includes(profile)||seen.has(key))throw Error("Błędna lub powtórzona rewizja "+key);
  seen.add(key);out.push({...e,key,profile,source});
 }return out;
}
export async function loadRegistry(base,fetcher=fetch){
 const read=async p=>{const r=await fetcher(base+p,{cache:"no-cache"});if(!r.ok)throw Error("Brak "+p);return r.json();};
 return registryEntries(await read("world.json"),await read("review.json"));
}
export async function loadRevision(base,e,fetcher=fetch){
 const proxy=(url,opts)=>url===base+"world.json"?Promise.resolve({ok:true,json:async()=>({schemaVersion:VERSION,locations:[e]})}):fetcher(url,opts);
 const [{manifest,data,failures}]=await readValidationInputs(base,proxy,e.profile);
 if(manifest.mapId!==e.mapId||manifest.mapRevision!==e.mapRevision)throw Error("Niezgodność rewizji");
 const {report,bundle}=validateMap(manifest,data,e.profile);
 for(const issue of validateRuralAreas(manifest,data)){report.counts.ERROR++;report.entries.push({severity:"ERROR",code:"RURAL_AREAS",file:"terrain.json",objectId:issue.objectId,message:issue.message,sceneId:manifest.mapId});report.playable=false;report.readyForPublication=false;}
 for(const f of failures){report.counts.ERROR++;report.entries.push({severity:"ERROR",code:"MFS_SCHEMA",file:f.file,message:f.message,sceneId:manifest.mapId});}
 if(failures.length){report.playable=false;report.readyForPublication=false;}
 let previewBundle=bundle;if(!previewBundle&&e.profile==="final"&&!report.counts.ERROR&&!failures.length){try{previewBundle=compileMap({...manifest,status:"approved"},data);}catch{}}
 return {manifest,data,report,bundle:failures.length?null:bundle,previewBundle,entry:e};
}
export function cell(x,y,w,h){return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<w&&y<h?y*w+x:null;}
export function bounds(c,w){let x=Infinity,y=Infinity,r=-1,b=-1;for(const k of c){x=Math.min(x,k%w);y=Math.min(y,Math.floor(k/w));r=Math.max(r,k%w);b=Math.max(b,Math.floor(k/w));}return {x,y,w:r-x+1,h:b-y+1};}
export function sceneOptions(p){return [{id:p.manifest.mapId,label:(p.manifest.underground?"Podziemia — ":"Zewnętrze — ")+p.manifest.name},...list(p.data.interiors).map(f=>({id:f.id,label:(list(p.data.buildings).find(b=>b.id===f.buildingId)?.name||f.buildingId)+" · poziom "+f.level}))];}
export function makeScene(p,id){
 const m=p.manifest,d=p.data,f=id===m.mapId?null:list(d.interiors).find(f=>f.id===id);
 if(id!==m.mapId&&!f)throw Error("Nieznana scena");
 const w=f?f.width:m.width,h=f?f.height:m.height;
 if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>1024||h>1024)throw Error("Błędny rozmiar");
 const actual=p.bundle?.scenes.get(id)||null,visual=f?(p.previewBundle||p.bundle)?.scenes.get(id)||null:null,items=[],issues=[];if(visual){visual.floorTile=f.floorTile;visual.decorations=f.decorations||[];}const topology=f?roomTopology(f,d.portals):null;
 function add(o,layer,g=o.geometry,color=colors[layer],extra={}){
  try{const cells=rasterize(g,w,h);items.push({id:o.id,name:o.name||o.type||o.kind||o.id,layer,cells,b:bounds(cells,w),color,record:o,...extra});}catch(e){issues.push({id:o.id,message:e.message});}
 }
 const point=(o,l,a,extra)=>add(o,l,{type:"point",x:a?.x,y:a?.y},colors[l],extra);
 const object=(o,l)=>{add(o,l);for(const s of list(o.stations))point(s,"stations",s.approach);};
 if(f){add(f,"terrain",f.geometry,PALETTE[f.floorTile]);for(const a of list(f.decorations))add(a,a.mount==="surface"?"surfaceProps":"decorations");for(const a of list(f.walls))add(a,"buildings",a.geometry,PALETTE.wall);for(const a of list(f.objects)){object(a,"objects");if(a.playerInteraction)for(const [i,q] of playerStartCells(f,a,d.portals).entries())point({id:a.id+".start"+(i+1),name:"Podejście gracza — "+a.name,relatedObjectId:a.id},"playerStarts",q);}if(topology&&!topology.issues.length){for(const r of topology.rooms)items.push({id:r.id,name:r.type+" · "+r.access,layer:"access",cells:r.cells,b:bounds(r.cells,w),color:ACCESS_COLORS[r.access]||"#aaa",record:r});}else for(const a of list(f.rooms))point({...a,name:a.type+" (kotwica; brak pełnej strefy)"},"access",a.anchor);for(const a of list(f.lighting))object(a,"lighting");}
 else{
  for(const a of list(d.terrain?.regions))add(a,a.rural?"rural":a.tile==="water"?"water":"terrain",a.geometry,a.rural?ruralColor(a):PALETTE[a.tile]||"#888");
  for(const a of list(d.terrain?.elevations))add(a,"elevation");
  const occupied=new Set(list(d.buildings).map(b=>b.parcelId));
  for(const a of list(d.parcels))add(a,"parcels",a.geometry,colors.parcels,{occupied:occupied.has(a.id)});
  for(const a of list(d.roads))add(a,"roads");for(const a of list(d.fortifications?.elements))add(a,"fortifications");for(const a of list(d.buildings))add(a,"buildings");
  for(const a of list(d.infrastructure))object(a,/tree|plant|bush|vegetation/.test(a.type)?"vegetation":/light|lamp|torch/.test(a.type)?"lighting":"infrastructure");
  for(const a of list(d.npcZones))if(a.sceneId===id)add(a,"npcZones");
 }
 for(const a of list(d.portals))for(const e of [a.a,a.b])if(e?.sceneId===id)point(a,"portals",e.trigger,{arrival:e.arrival});
 for(const a of list(m.spawnPoints))if(a.sceneId===id)point(a,"stations",a,{spawn:true});
 const collision=new Set(),triggers=new Set();
 if(actual)for(let k=0;k<w*h;k++){if(actual.blocked(k%w,Math.floor(k/w)))collision.add(k);if(actual.portals.has(k))triggers.add(k);}
 return {id,w,h,actual,visual,topology,collision,triggers,issues,items:items.sort((a,b)=>LAYERS.findIndex(l=>l[0]===a.layer)-LAYERS.findIndex(l=>l[0]===b.layer)),background:f?"void":d.terrain?.defaultTile};
}
export function hits(s,x,y,visible){const k=cell(x,y,s.w,s.h),rank={portals:0,stations:1,playerStarts:1,objects:2,surfaceProps:1.8,decorations:2.5,buildings:3,fortifications:4,infrastructure:5,vegetation:6,lighting:7,rural:7.5,parcels:8,roads:9,access:10,npcZones:11,elevation:12,water:13,terrain:14};return k===null?[]:s.items.filter(a=>visible.has(a.layer)&&a.cells.has(k)).sort((a,b)=>rank[a.layer]-rank[b.layer]);}
export function fit(w,h,vw,vh){const s=Math.max(.05,Math.min((vw-16)/w,(vh-16)/h));return {s,x:(vw-w*s)/2,y:(vh-h*s)/2};}
export function zoomAt(c,s,x,y){s=Math.max(.05,Math.min(96,s));const r=s/c.s;return {s,x:x-(x-c.x)*r,y:y-(y-c.y)*r};}
export function tile(c,x,y){return {x:Math.floor((x-c.x)/c.s),y:Math.floor((y-c.y)/c.s)};}
export function distance(a,b){return {direct:Math.hypot(a.x-b.x,a.y-b.y),grid:Math.abs(a.x-b.x)+Math.abs(a.y-b.y)};}
