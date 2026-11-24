import {roomTopology} from "./room-topology.js?v=0.3.33.2";
import {placementIssues} from "./furniture-placement.js?v=0.3.32.2";
import {rasterize,compileMap,VERSION} from "./core.js?v=0.3.29";
export const VALIDATOR_VERSION="1.1.0";
export const PROFILES=["terrain","parcels","roads","fortifications","buildings","interiors","infrastructure","final"];
const PDS={P1:[3,4,5,6],P2:[4,5,8,10],P3:[6,8,12,14],P4:[9,11,18,20],P5:[12,14,26,30],P6:[14,16,40,48]};
const WIDTH={R1:6,R2:5,R3:3,R4:2,R5:1};
const BDS={
 hut:[4,5,5,6,20,30,"R",1,1],house:[5,6,7,8,30,56,"RL",1,2],large_house:[7,8,9,10,48,90,"RLT",1,3],tenement:[6,8,9,12,42,108,"RLU",2,4],merchant_house:[7,8,10,12,48,120,"RLU",1,3],servants_house:[5,6,8,10,30,80,"RL",1,2],annex:[3,4,6,8,12,48,"RL",1,2],kiosk:[3,4,4,5,12,20,"R",1,1],shop:[5,6,7,8,30,56,"RL",1,2],bakery:[5,6,7,8,30,56,"RL",1,2],apothecary:[5,6,7,8,30,56,"RL",1,2],smithy:[5,7,7,9,35,63,"RL",1,2],workshop:[5,7,7,9,35,63,"RL",1,2],inn:[7,9,10,12,55,120,"RLTU",1,3],gaming_house:[6,8,10,12,42,120,"RLT",1,2],market_hall:[8,10,12,16,70,192,"RLU",1,2],warehouse:[6,8,10,12,48,120,"RL",1,2],granary:[5,6,8,10,30,80,"R",1,2],shed:[3,4,5,7,12,35,"R",1,1],barn:[5,7,9,12,35,108,"RL",1,2],stable:[6,8,9,12,48,108,"RLU",1,2],byre:[5,7,9,12,35,108,"RL",1,1],coop:[3,4,5,6,12,30,"R",1,1],mill:[5,6,8,10,30,80,"RL",1,3],sawmill:[6,8,10,12,48,120,"RLU",1,2],brewery:[6,8,10,12,48,120,"RL",1,2],tannery:[5,7,8,10,35,80,"RL",1,2],library:[6,8,10,12,42,120,"RLT",1,3],school:[6,8,10,12,42,120,"RLT",1,2],chapel:[4,6,7,9,24,63,"RT",1,2],temple:[8,10,14,18,70,252,"RLTUD",1,3],clinic:[6,8,10,12,42,120,"RLT",1,2],hall:[8,10,12,16,70,192,"RLTUD",1,3],court:[7,9,12,14,55,168,"RLT",1,3],barracks:[8,10,12,16,70,192,"RLUD",1,3],armory:[6,8,10,12,48,120,"RL",1,2],guardhouse:[4,5,7,8,20,56,"RL",1,2],prison:[7,9,12,14,55,168,"RLUD",1,3],tower:[4,4,7,7,16,49,"R",2,5],donjon:[8,8,12,12,1,144,"R",3,5],gatehouse:[6,6,10,10,30,100,"RU",1,3],keep:[12,16,20,24,160,480,"RLTUD",2,4],arena_hall:[10,12,18,22,100,396,"RUD",1,2],port_office:[5,6,8,10,30,80,"RL",1,2],bathhouse:[6,8,10,12,42,120,"RLU",1,2],guildhall:[7,9,12,14,55,168,"RLTU",1,3]};
const TARGET={settlement:[20,5,12],small_village:[35,12,24],medium_village:[40,24,40],large_village:[50,40,65],small_city:[65,40,70],medium_city:[75,70,120],large_city:[85,120,200],capital:[90,200,350]};
const SOLID=new Set(["void","wall","water","tree","object"]);
const TILES=new Set(["grass","meadow","road","stone","wood","water","wall","tree","rock","hill","forest-floor","marble","void","object","rampart"]);
const int=Number.isInteger, obj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x), list=x=>Array.isArray(x)?x:[], dirs=[[1,0],[-1,0],[0,1],[0,-1]];
const neighbors=(k,w,h)=>dirs.map(([dx,dy])=>[k%w+dx,Math.floor(k/w)+dy]).filter(([x,y])=>x>=0&&y>=0&&x<w&&y<h).map(([x,y])=>y*w+x);
const xy=(k,w)=>({x:k%w,y:Math.floor(k/w)});
const first=s=>s.values().next().value;
function flood(start,allowed,w,h){const seen=new Set(),q=[];if(allowed(start)){q.push(start);seen.add(start);}for(let i=0;i<q.length;i++)for(const k of neighbors(q[i],w,h))if(!seen.has(k)&&allowed(k)){seen.add(k);q.push(k);}return seen;}
function bounds(c,w){let x=Infinity,y=Infinity,r=-1,b=-1;for(const k of c){const a=xy(k,w);x=Math.min(x,a.x);y=Math.min(y,a.y);r=Math.max(r,a.x);b=Math.max(b,a.y);}return {x,y,w:r-x+1,h:b-y+1};}
const inside=(a,b)=>[...a].every(k=>b.has(k));
const overlaps=(a,b)=>[...a].find(k=>b.has(k));
function dims(b,r){return b.w>=r[0]&&b.h>=r[1]&&b.w<=r[2]&&b.h<=r[3]||b.h>=r[0]&&b.w>=r[1]&&b.h<=r[2]&&b.w<=r[3];}
// Orthogonal shape classification: missing rectangles are the only allowed cuts.
function shape(c,w,h){
 const b=bounds(c,w);if(c.size===b.w*b.h)return "R";
 const holes=new Set();for(let y=b.y;y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++){const k=y*w+x;if(!c.has(k))holes.add(k);}
 const cuts=[];while(holes.size){const a=flood(first(holes),k=>holes.has(k),w,h);for(const k of a)holes.delete(k);const t=bounds(a,w);if(a.size!==t.w*t.h)return "?";const edges=[t.x===b.x,t.y===b.y,t.x+t.w===b.x+b.w,t.y+t.h===b.y+b.h];cuts.push({t,edges,n:edges.filter(Boolean).length});}
 // Check all occupied horizontal/vertical runs for minimum wing thickness of three.
 for(let y=b.y;y<b.y+b.h;y++){let n=0;for(let x=b.x;x<=b.x+b.w;x++){if(x<b.x+b.w&&c.has(y*w+x))n++;else{if(n>0&&n<3)return "?";n=0;}}}
 for(let x=b.x;x<b.x+b.w;x++){let n=0;for(let y=b.y;y<=b.y+b.h;y++){if(y<b.y+b.h&&c.has(y*w+x))n++;else{if(n>0&&n<3)return "?";n=0;}}}
 if(cuts.length===1){const a=cuts[0];if(a.n===0&&a.t.w>=3&&a.t.h>=3)return "D";if(a.n===1)return "U";if(a.n===2&&!(a.edges[0]&&a.edges[2])&&!(a.edges[1]&&a.edges[3]))return "L";}
 if(cuts.length===2&&cuts.every(a=>a.n===2&&!(a.edges[0]&&a.edges[2])&&!(a.edges[1]&&a.edges[3]))){const a=cuts[0],d=cuts[1];if(a.edges.some((e,i)=>e&&d.edges[i])&&(a.t.x===d.t.x&&a.t.w===d.t.w||a.t.y===d.t.y&&a.t.h===d.t.h))return "T";}
 return "?";
}
export function validateMap(m,d,profile="final"){
 const stage=PROFILES.indexOf(profile);if(stage<0)throw Error("Unknown validation profile: "+profile);
 const report={validatorVersion:VALIDATOR_VERSION,schemaVersion:VERSION,mapId:m?.mapId??null,mapRevision:m?.mapRevision??null,profile,entries:[],checks:[],counts:{ERROR:0,WARNING:0,INFO:0},stats:{},readyForPublication:false,playable:false};
 let bundle=null;
 const emit=(code,severity,message,file,objectId=null,sceneId=m?.mapId??null,point=null,rule="MFS §22")=>{report.entries.push({code,severity,mapId:report.mapId,sceneId,objectId,coordinates:point,file,rule,message});report.counts[severity]++;};
 const run=(code,at,fn,reason)=>{if(stage<at||reason){report.checks.push({code,status:"skipped",reason:reason||"not required at this stage"});return;}const e=report.counts.ERROR,v=report.counts.WARNING;try{fn();}catch(err){emit(code,"ERROR",String(err.message||err),"manifest.json");}report.checks.push({code,status:report.counts.ERROR>e?"failed":report.counts.WARNING>v?"warning":"passed"});};
 const skip=(code,reason)=>report.checks.push({code,status:"skipped",reason});
 const error=(c,msg,f,o,p=null,s=null,r)=>emit(c,"ERROR",msg,f,o?.id??null,s??m?.mapId??null,p,r);
 const warn=(c,msg,f,o,r)=>emit(c,"WARNING",msg,f,o?.id??null,m?.mapId??null,null,r);
 const w=m?.width,h=m?.height,validSize=int(w)&&int(h)&&w>0&&h>0&&w<=1024&&h<=1024;
 const ids=new Set(),pmap=new Map(),rmap=new Map(),bmap=new Map(),fmap=new Map(),parcels=new Map(),roads=new Set(),built=new Map(),terrain=validSize?Array(w*h).fill(d?.terrain?.defaultTile):[];
 const id=(o,file,scene)=>{if(!obj(o)||typeof o.id!=="string"||!o.id.startsWith(m?.mapId+".")||ids.has(o.id))error("MFS_REF","Missing, invalid or duplicate ID",file,o,null,scene);else ids.add(o.id);};
 const array=(a,file)=>{if(!Array.isArray(a)){error("MFS_SCHEMA","Required array missing or invalid",file,null);return [];}return a;};
 const geo=(o,file,sw=w,sh=h,scene=m?.mapId)=>{try{return rasterize(o.geometry,sw,sh);}catch(e){error("GEO_BOUNDS",e.message,file,o,null,scene);return new Set();}};
 const point=(p,sw=w,sh=h)=>obj(p)&&int(p.x)&&int(p.y)&&p.x>=0&&p.x<sw&&p.y>=0&&p.y<sh?p.y*sw+p.x:null;
 const parts=()=>({terrain:0,parcels:1,roads:2,fortifications:3,buildings:4,portals:5,infrastructure:6,npcZones:6});
 run("MFS_SCHEMA",0,()=>{
  if(!obj(m)||!obj(d)||m.schemaVersion!==VERSION||m.mdsVersion!=="1.0"||!validSize||m.sourceType!=="manual"||!["draft","review","approved","published","archived"].includes(m.status)||typeof m.mapId!=="string"||!m.mapId||!int(m.mapRevision)||m.mapRevision<1||typeof m.name!=="string"||m.tileMeters!==1||m.baseTilePixels!==32||m.elevationStepMeters!==.5||m.interiorScale!==2||m.sectorSize!==16)error("MFS_SCHEMA","Manifest incompatible with MFS 1.0", "manifest.json",m);
  for(const [k,at] of Object.entries(parts()))if(stage>=at){if(!obj(m?.files)||typeof m.files[k]!=="string"||d?.[k]===undefined)error("MFS_SCHEMA","Required layer missing: "+k,"manifest.json",m);}
  if(stage>=5&&(!Array.isArray(m?.interiors)||!Array.isArray(d?.interiors)))error("MFS_SCHEMA","Interiors missing","manifest.json",m);
 });
 if(!validSize||!obj(d)||!obj(m)){report.counts.ERROR=Math.max(1,report.counts.ERROR);return {report,bundle};}
 run("GEO_TERRAIN",0,()=>{
  if(!TILES.has(d.terrain?.defaultTile))error("MFS_SCHEMA","Unknown default tile","terrain.json",null);
  for(const o of array(d.terrain?.regions,"terrain.json")){id(o,"terrain.json");const cs=geo(o,"terrain.json");if(!TILES.has(o.tile))error("MFS_SCHEMA","Unknown terrain tile","terrain.json",o);for(const k of cs)terrain[k]=o.tile;}
  for(const o of list(d.terrain?.elevations)){id(o,"terrain.json");geo(o,"terrain.json");if(!int(o.elevation)||o.elevation< -32768||o.elevation>32767)error("GEO_BOUNDS","Invalid elevation","terrain.json",o);}
 });
 run("PDS_OVERLAP",1,()=>{
  for(const p of array(d.parcels,"parcels.json")){
   id(p,"parcels.json");const cs=geo(p,"parcels.json");pmap.set(p.id,{p,cs});if(!cs.size)continue;
   const b=bounds(cs,w),r=PDS[p.class];if(p.class!=="PS"&&(!r||!dims(b,r)))error("PDS_LIMIT","Parcel dimensions outside class "+p.class,"parcels.json",p,xy(first(cs),w),null,"MDS §16");
   if(p.class==="PS"&&p.ownershipMode==="standard")error("PDS_OVERLAP","Special parcel cannot be standard ownership","parcels.json",p);
   if(flood(first(cs),k=>cs.has(k),w,h).size!==cs.size)error("PDS_OVERLAP","Parcel not connected","parcels.json",p);
   let conflict=null,bad=null;for(const k of cs){if(parcels.has(k)&&conflict===null)conflict=k;else parcels.set(k,p.id);if(SOLID.has(terrain[k])&&bad===null)bad=k;}
   if(conflict!==null)error("PDS_OVERLAP","Parcels overlap","parcels.json",p,xy(conflict,w));
   if(bad!==null)error("PDS_OVERLAP","Parcel contains terrain obstacle","parcels.json",p,xy(bad,w));
  }
 });
 run("RDS_NETWORK",2,()=>{
  for(const r of array(d.roads,"roads.json")){
   id(r,"roads.json");const cs=geo(r,"roads.json");rmap.set(r.id,{r,cs});
   if(WIDTH[r.class]!==r.width||r.geometry?.type==="polyline"&&r.geometry.width!==r.width)error("RDS_NETWORK","Incorrect road width","roads.json",r);
   if(cs.size&&flood(first(cs),k=>cs.has(k),w,h).size!==cs.size)error("RDS_NETWORK","Road has disconnected geometry","roads.json",r);
   if(cs.size&&int(r.width)&&r.width>0&&r.geometry?.type!=="polyline"){
    // Conservative cross-section test for axis-aligned straight mask/rect portions.
    // Complex junctions/diagonals require manual review, not guessed widths.
    const b=bounds(cs,w);if(Math.min(b.w,b.h)<r.width)error("RDS_NETWORK","Road narrower than declared width","roads.json",r);
    else if(r.geometry.type==="rect"&&Math.min(b.w,b.h)!==r.width)error("RDS_NETWORK","Rectangular road width differs from declared width","roads.json",r);
    else if(r.geometry.type!=="rect")warn("RDS_STYLE","Complex road cross-section requires manual review","roads.json",r,"MDS §28");
   }
   let conflict=null,solid=null;for(const k of cs){roads.add(k);if(parcels.has(k)&&conflict===null)conflict=k;if(SOLID.has(terrain[k])&&solid===null)solid=k;}
   if(conflict!==null)error("PDS_OVERLAP","Public road crosses parcel","roads.json",r,xy(conflict,w));
   if(solid!==null)error("RDS_NETWORK","Road crosses terrain obstacle","roads.json",r,xy(solid,w));
   if(r.geometry?.type==="polyline"){const pts=list(r.geometry.points),min={R1:8,R2:8,R3:4,R4:2,R5:2}[r.class];for(let i=2;i<pts.length-1;i++){const a=pts[i-1],b=pts[i];if(Math.abs(a.x-b.x)+Math.abs(a.y-b.y)<min){warn("RDS_STYLE","Short segment between bends","roads.json",r,"MDS §28");break;}}}
  }
  if(pmap.size&&!roads.size)error("RDS_NETWORK","No road network for parcels","roads.json",null);
  if(roads.size&&flood(first(roads),k=>roads.has(k),w,h).size!==roads.size)error("RDS_NETWORK","Road network disconnected","roads.json",null);
 });
 run("PDS_ACCESS",2,()=>{
  for(const {p,cs} of pmap.values()){
   const access=list(p.accessRoadIds);if(!access.length||access.some(a=>!rmap.has(a)))error("MFS_REF","Missing or unknown parcel access road","parcels.json",p);
   else if(!access.some(a=>[...cs].some(k=>neighbors(k,w,h).some(n=>rmap.get(a).cs.has(n)))))error("PDS_ACCESS","Parcel does not touch its declared access road","parcels.json",p);
  }
 });
 run("FDS_GATE",3,()=>{
  const f=d.fortifications;if(!obj(f)||!/^F[0-4]$/.test(f.class)||!Array.isArray(f.elements)){error("MFS_SCHEMA","Invalid fortification plan","fortifications.json",null);return;}
  if(f.class==="F0"&&f.elements.length)error("FDS_GATE","F0 cannot contain fortifications","fortifications.json",null);
  if(f.class!=="F0"&&!f.elements.length)error("FDS_GATE","Fortification class has no elements","fortifications.json",null);
  const walls=new Set(),gates=new Set();
  for(const e of f.elements){id(e,"fortifications.json");const cs=geo(e,"fortifications.json");if(e.kind==="wall"){for(const k of cs)walls.add(k);const q=overlaps(cs,new Set(parcels.keys()));if(q!==undefined)error("PDS_OVERLAP","Wall crosses standard parcel","fortifications.json",e,xy(q,w));}
   else if(e.kind==="gate"){for(const k of cs)gates.add(k);const r=rmap.get(e.roadId);if(!r||!int(e.clearWidth)||e.clearWidth<r.r.width||overlaps(cs,r.cs)===undefined)error("FDS_GATE","Gate does not preserve road width/connection","fortifications.json",e);}
   else if(!["tower","ditch","bridge","rampart","special"].includes(e.kind))error("MFS_SCHEMA","Unknown fortification kind","fortifications.json",e);
  }
  const q=[...walls].find(k=>roads.has(k)&&!gates.has(k));if(q!==undefined)error("FDS_GATE","Wall blocks road outside gate","fortifications.json",null,xy(q,w));
 });
 if(stage>=3&&d.fortifications?.class!=="F0")skip("FDS_RUNTIME","Core 0.3.29 supports F0 only; defensive levels, full gate raster and traversal not implemented");
 run("BDS_CONTAIN",4,()=>{
  for(const b of array(d.buildings,"buildings.json")){
   id(b,"buildings.json");const cs=geo(b,"buildings.json");bmap.set(b.id,{b,cs});const p=pmap.get(b.parcelId);
   if(!p)error("MFS_REF","Unknown building parcel","buildings.json",b);
   else if(!inside(cs,p.cs))error("BDS_CONTAIN","Building extends beyond parcel","buildings.json",b);
   let q=null;for(const k of cs){if(built.has(k)&&q===null)q=k;built.set(k,b.id);}
   if(q!==null)error("BDS_CONTAIN","Buildings overlap","buildings.json",b,xy(q,w));
   if(cs.size&&flood(first(cs),k=>cs.has(k),w,h).size!==cs.size)error("BDS_LIMIT","Building footprint disconnected","buildings.json",b);
   const r=BDS[b.type];if(!r){error("BDS_LIMIT","Unknown BDS building type "+b.type,"buildings.json",b);continue;}
   if(cs.size){const bb=bounds(cs,w),s=shape(cs,w,h);if(!dims(bb,r)||cs.size<r[4]||cs.size>r[5])error("BDS_LIMIT","Building dimensions/area outside BDS","buildings.json",b,null,null,"MDS §21");
    if(b.type==="donjon"||b.type==="gatehouse"||b.type==="tower"&&b.defensive)warn("BDS_LIMIT","Defensive footprint requires FDS-specific review","buildings.json",b,"MDS §21, §40");
    else if(!r[6].includes(s))error("BDS_LIMIT","Footprint shape "+s+" not permitted for "+b.type,"buildings.json",b);
    if(s==="D")warn("BDS_LIMIT","Verify courtyard access manually","buildings.json",b,"MDS §20");
   }
   if(![0,90,180,270].includes(b.rotation??0))error("BDS_LIMIT","Unsupported rotation","buildings.json",b);
  }
 });
 run("PROGRAM_TARGET",4,()=>{
  const t=TARGET[m.kind],standard=[...pmap.values()].filter(({p})=>p.ownershipMode==="standard"&&p.class!=="PS"),occupied=new Set([...bmap.values()].map(({b})=>b.parcelId)),n=standard.length,used=standard.filter(({p})=>occupied.has(p.id)).length;
  report.stats={parcels:pmap.size,standardParcels:n,builtParcels:used,vacantParcels:n-used,buildings:bmap.size,roadTiles:roads.size,builtPercent:n?Math.round(used/n*10000)/100:0};
  if(t){if(n<t[1]||n>t[2])warn("PROGRAM_TARGET","Parcel count outside target "+t[1]+"–"+t[2],"parcels.json",null,"MDS §70");if(used!==Math.round(n*t[0]/100))warn("PROGRAM_TARGET","Initial occupancy differs from "+t[0]+"% target","buildings.json",null,"MDS §17");}
  else if(m.kind!=="test")warn("PROGRAM_TARGET","Individual settlement programme requires manual review","manifest.json",m,"MDS §70");
 });
 run("ISS_SCALE",5,()=>{
  for(const f of array(d.interiors,"interiors")){
   const file="interiors/"+f.id;id(f,file,f.id);fmap.set(f.id,f);const b=bmap.get(f.buildingId);
   if(!b||!list(b.b.floorIds).includes(f.id)){error("MFS_REF","Unknown floor/building relation",file,f,null,f.id);continue;}
   if(!b.cs.size)continue;
   const bb=bounds(b.cs,w),expected=new Set();for(const k of b.cs){const p=xy(k,w),x=2*(p.x-bb.x),y=2*(p.y-bb.y);for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)expected.add((y+dy)*f.width+x+dx);}
   const cs=geo(f,file,f.width,f.height,f.id);
   if(f.width!==bb.w*2||f.height!==bb.h*2||cs.size!==expected.size||!inside(cs,expected))error("ISS_SCALE","Interior does not match 2× exterior footprint",file,f,null,f.id,"MDS §49");
   if(!int(f.level))error("IDS_ACCESS","Invalid floor number",file,f,null,f.id);
   const wallCells=new Set(),objCells=new Set();
   for(const wall of array(f.walls,file)){id(wall,file,f.id);const a=geo(wall,file,f.width,f.height,f.id);if(!inside(a,cs))error("IDS_ACCESS","Wall outside interior",file,wall,null,f.id);for(const k of a)wallCells.add(k);}
   for(const o of array(f.objects,file)){id(o,file,f.id);const a=geo(o,file,f.width,f.height,f.id);if(!inside(a,cs)||overlaps(a,wallCells)!==undefined||overlaps(a,objCells)!==undefined)error("IDS_ACCESS","Furniture collision/outside footprint",file,o,null,f.id);for(const k of a)objCells.add(k);
    for(const st of list(o.stations)){id(st,file,f.id);const k=point(st.approach,f.width,f.height);if(k===null||!cs.has(k)||wallCells.has(k)||a.has(k)||!int(st.capacity)||st.capacity<=0||typeof st.action!=="string")error("RRS_STATION","Invalid interaction station",file,st,st.approach,f.id);}
   }
   for(const r of list(f.rooms)){id(r,file,f.id);if(!/^Z[0-5]$/.test(r.access))error("IDS_ACCESS","Invalid access zone",file,r,r.anchor,f.id);const k=point(r.anchor,f.width,f.height);if(k===null||!cs.has(k)||wallCells.has(k)||objCells.has(k))error("IDS_ACCESS","Invalid room anchor",file,r,r.anchor,f.id);}
  }
  for(const {b} of bmap.values()){
   const fs=list(b.floorIds),levels=fs.map(a=>fmap.get(a)?.level);const r=BDS[b.type];
   if(!fs.length||new Set(fs).size!==fs.length||fs.some(a=>fmap.get(a)?.buildingId!==b.id)||new Set(levels).size!==levels.length||!levels.includes(0))error("IDS_ACCESS","Missing, duplicate or invalid floor references","buildings.json",b);
   if(levels.every(int)&&levels.length&&Math.max(...levels)-Math.min(...levels)+1!==levels.length)error("IDS_ACCESS","Non-contiguous floor levels","buildings.json",b);
   if(r){const above=levels.filter(x=>x>=0).length,below=levels.filter(x=>x<0).length;if(above<r[7]||above>r[8]||below>(["keep","prison"].includes(b.type)?2:1))error("BDS_LIMIT","Floor count outside BDS","buildings.json",b,null,null,"MDS §21");}
  }
 });
 run("FPS_PLACEMENT",5,()=>{for(const f of list(d.interiors))for(const issue of placementIssues(f,d.portals))emit("FPS_PLACEMENT","ERROR",issue.message,"interiors/"+f.id,issue.objectId,f.id,issue.point,"FPS 1.0");},!list(d.interiors).some(f=>list(f.objects).some(o=>o.placement))?"No FPS metadata (legacy map)":undefined);
 run("RTS_TOPOLOGY",5,()=>{for(const f of list(d.interiors))if(f.roomTopologyVersion===1)for(const issue of roomTopology(f,d.portals).issues)emit("RTS_TOPOLOGY","ERROR",issue.message,"interiors/"+f.id,issue.objectId,f.id,issue.point,"RTS 1.0");},!list(d.interiors).some(f=>f.roomTopologyVersion===1)?"Legacy room anchors, no RTS data":undefined);
 run("PORTAL_PAIR",5,()=>{
  const triggers=new Set(),endpoints=[];
  for(const p of array(d.portals,"portals.json")){id(p,"portals.json");if(!["door","stairs"].includes(p.type)||p.direction!=="both")error("PORTAL_PAIR","Portal must be paired door/stairs","portals.json",p);
   const a=p.a,b=p.b;if(!a||!b||a.sceneId===b.sceneId){error("PORTAL_PAIR","Missing or invalid endpoints","portals.json",p);continue;}
   for(const e of [a,b]){const f=fmap.get(e.sceneId),ex=e.sceneId===m.mapId,sw=ex?w:f?.width,sh=ex?h:f?.height;if(!ex&&!f){error("MFS_REF","Unknown portal scene","portals.json",p,e.trigger,e.sceneId);continue;}
    const t=point(e.trigger,sw,sh),v=point(e.arrival,sw,sh);if(t===null||v===null||Math.abs(e.trigger.x-e.arrival.x)+Math.abs(e.trigger.y-e.arrival.y)!==1)error("PORTAL_PAIR","Invalid portal trigger/arrival","portals.json",p,e.trigger,e.sceneId);
    const key=e.sceneId+":"+t;if(triggers.has(key))error("PORTAL_PAIR","Duplicate portal trigger","portals.json",p,e.trigger,e.sceneId);triggers.add(key);endpoints.push({p,e,v});
   }
   if(p.type==="stairs"){const f=fmap.get(a.sceneId),g=fmap.get(b.sceneId);if(!f||!g||f.buildingId!==g.buildingId||Math.abs(f.level-g.level)!==1)error("PORTAL_PAIR","Stairs must connect adjacent floors of same building","portals.json",p);}
  }
  for(const {p,e,v} of endpoints)if(triggers.has(e.sceneId+":"+v))error("PORTAL_PAIR","Arrival on another trigger","portals.json",p,e.arrival,e.sceneId);
 });
 run("NPC_ZONE",6,()=>{
  const vacant=new Set();for(const {p,cs} of pmap.values())if(![...bmap.values()].some(({b})=>b.parcelId===p.id))for(const k of cs)vacant.add(k);
  for(const o of array(d.infrastructure,"infrastructure.json")){id(o,"infrastructure.json");const cs=geo(o,"infrastructure.json");if(o.blocking!==false){const k=overlaps(cs,roads);if(k!==undefined)error("RDS_NETWORK","Blocking infrastructure on road","infrastructure.json",o,xy(k,w));}
   const k=overlaps(cs,vacant);if(k!==undefined&&!o.plannedVegetation)error("PDS_OVERLAP","Infrastructure occupies empty parcel without explicit exception","infrastructure.json",o,xy(k,w));
  }
  for(const z of array(d.npcZones,"npc_zones.json")){id(z,"npc_zones.json");const cs=geo(z,"npc_zones.json");if(!/^N[0-9]$/.test(z.type)||z.sceneId!==m.mapId)error("NPC_ZONE","Unknown zone type or scene","npc_zones.json",z);
   if(z.ambientSpawn===true&&["N0","N6","N7","N8"].includes(z.type))error("NPC_ZONE","Ordinary NPC spawn forbidden for this zone","npc_zones.json",z);
   if(z.ambientSpawn===true&&overlaps(cs,vacant)!==undefined)error("NPC_ZONE","Ordinary NPC spawn on vacant parcel","npc_zones.json",z);
  }
 });
 // Final compiled navigation uses the same raster as gameplay. A portal trigger
 // is not a normal walk-through tile: walking onto it changes scenes.
 run("MFS_COMPILE",7,()=>{
  if(report.counts.ERROR){skip("IDS_ACCESS_RUNTIME","Earlier errors prevent safe compilation");return;}
  try{bundle=compileMap({...m,status:"approved"},d);for(const f of list(d.interiors)){const scene=bundle.scenes.get(f.id);if(scene){scene.floorTile=f.floorTile;if(f.roomTopologyVersion===1)scene.roomTopology=roomTopology(f,d.portals);}}}catch(e){error("MFS_COMPILE",e.message,"manifest.json",m);return;}
  const starts=new Map([[m.mapId,[bundle.spawn]]]),visited=new Map();
  for(const s of bundle.scenes.values())for(const p of s.portals.values()){if(!starts.has(p.map))starts.set(p.map,[]);starts.get(p.map).push(p);}
  for(const s of bundle.scenes.values()){
   const a=starts.get(s.id)||[];if(!a.length){error("IDS_ACCESS","Scene has no entrance","interiors",null,null,s.id);continue;}
   const sw=s.width,sh=s.height,walk=k=>int(k)&&k>=0&&k<sw*sh&&!s.portals.has(k)&&!s.blocked(k%sw,Math.floor(k/sw));
   const reached=flood(point(a[0],sw,sh),walk,sw,sh);visited.set(s.id,reached);
   for(const p of a)if(!reached.has(point(p,sw,sh)))error("IDS_ACCESS","Arrival not reachable from scene entrance","portals.json",null,p,s.id);
   for(const p of s.places)if(!reached.has(point(p,sw,sh)))error("PORTAL_PAIR","Unreachable portal approach","portals.json",p,p,s.id);
   for(const o of s.records.values()){
    if(o.anchor&&!reached.has(point(o.anchor,sw,sh)))error("IDS_ACCESS","Room anchor unreachable","interiors",o,o.anchor,s.id);
    for(const st of list(o.stations))if(!reached.has(point(st.approach,sw,sh)))error("RRS_STATION","Interaction station unreachable","interiors",st,st.approach,s.id);
   }
  }
  // Graph reachability from exterior (isolated mutually connected floor groups fail).
  const seen=new Set([m.mapId]),q=[m.mapId];for(let i=0;i<q.length;i++)for(const p of bundle.scenes.get(q[i]).portals.values())if(!seen.has(p.map)){seen.add(p.map);q.push(p.map);}
  for(const s of bundle.scenes.values())if(!seen.has(s.id))error("IDS_ACCESS","Floor not connected to exterior","interiors",null,null,s.id);
  const ex=bundle.scenes.get(m.mapId),reached=visited.get(m.mapId)||new Set();
  for(const {p,cs} of pmap.values())if(![...cs].some(k=>neighbors(k,w,h).some(n=>roads.has(n)&&reached.has(n))))error("PDS_ACCESS","Parcel inaccessible from playable road network","parcels.json",p);
  for(const {b,cs} of bmap.values()){
   const hasDoor=[...ex.portals].some(([k,p])=>cs.has(k)&&list(b.floorIds).includes(p.map));
   if(!hasDoor)error("PORTAL_PAIR","Building has no exterior entrance","buildings.json",b);
  }
  report.stats.scenes=bundle.scenes.size;report.stats.stations=[...bundle.scenes.values()].reduce((n,s)=>n+[...s.records.values()].reduce((a,o)=>a+list(o.stations).length,0),0);
 });
 if(stage===7){
  skip("RDS_VEHICLES","Vehicle turning/2×2 navigation requires future movement model");
  skip("IDS_PROGRAM","Full room programme, access rights and automatic RRS classification require future catalogues/runtime");
  skip("NPC_RUNTIME","NPC simulation in MFS scenes not enabled");
  skip("MDS_MANUAL","Manual design review, functional programme and warning resolutions required");
 }
 emit("MAP_STATS","INFO","Map statistics recorded","manifest.json");
 report.playable=stage===7&&!!bundle&&report.counts.ERROR===0&&["approved","published"].includes(m.status);
 // No production certification while applicable final checks are missing.
 report.readyForPublication=report.playable&&m.kind!=="test"&&!report.checks.some(c=>c.status==="skipped"||c.status==="warning")&&report.counts.WARNING===0;
 return {report,bundle:report.playable?bundle:null};
}
const SAFE=/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.json$/;
export async function readValidationInputs(base,fetcher=fetch,profile="final"){
 if(!PROFILES.includes(profile))throw Error("Unknown profile");
 const get=async path=>{if(typeof path!=="string"||!SAFE.test(path))throw Error("Unsafe JSON path "+path);const r=await fetcher(base+path,{cache:"no-cache"});if(!r.ok)throw Error("Missing file "+path);return r.json();};
 const world=await get("world.json");if(world.schemaVersion!==VERSION||!Array.isArray(world.locations))throw Error("Invalid world registry");
 const seen=new Set(),out=[],stage=PROFILES.indexOf(profile),layerStage={terrain:0,parcels:1,roads:2,fortifications:3,buildings:4,portals:5,infrastructure:6,npcZones:6};
 for(const e of world.locations){
  if(typeof e.mapId!=="string"||seen.has(e.mapId))throw Error("Duplicate/invalid map ID "+e.mapId);seen.add(e.mapId);
  const m=await get(e.manifest),dir=e.manifest.slice(0,e.manifest.lastIndexOf("/")+1);if(m.mapId!==e.mapId||m.mapRevision!==e.mapRevision)throw Error("Registry revision mismatch");
  const d={},failures=[];for(const [k,i] of Object.entries(layerStage))if(stage>=i){try{if(!SAFE.test(m.files?.[k]||""))throw Error("Missing or unsafe layer path");d[k]=await get(dir+m.files[k]);}catch(err){failures.push({file:m.files?.[k]||k,message:err.message});}}
  if(stage>=5){d.interiors=[];for(const p of list(m.interiors)){try{if(!SAFE.test(p))throw Error("Unsafe interior path");d.interiors.push(await get(dir+p));}catch(err){failures.push({file:p,message:err.message});}}}
  out.push({manifest:m,data:d,failures});
 }return out;
}
export async function validateWorld(base,fetcher=fetch,profile="final"){
 const inputs=await readValidationInputs(base,fetcher,profile);
 return inputs.map(({manifest,data,failures})=>{const result=validateMap(manifest,data,profile);for(const f of failures){result.report.entries.push({code:"MFS_SCHEMA",severity:"ERROR",mapId:manifest.mapId,sceneId:manifest.mapId,objectId:null,coordinates:null,file:f.file,rule:"MFS §22",message:f.message});result.report.counts.ERROR++;}if(failures.length){result.report.playable=false;result.report.readyForPublication=false;result.bundle=null;}return result;});
}
