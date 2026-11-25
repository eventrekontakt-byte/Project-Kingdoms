// MFS 1.0 — deterministic geometry + registry + legacy scene adapter.
export const VERSION="1.0.0";
const int=Number.isInteger, key=(x,y)=>x+","+y;
function check(ok,msg){if(!ok)throw new Error("MFS: "+msg);}
function arr(v,n){check(Array.isArray(v),n+" must be an array");return v;}
function coord(p){check(p&&int(p.x)&&int(p.y),"invalid point");return p;}
function ringContains(r,x,y){
 let inside=false;
 for(let i=0,j=r.length-1;i<r.length;j=i++){
  const a=r[j],b=r[i],cross=(x-a.x)*(b.y-a.y)-(y-a.y)*(b.x-a.x);
  // Boundary rule: horizontal ray, half-open upper/lower endpoints; boundary belongs to polygon.
  if(cross===0&&x>=Math.min(a.x,b.x)&&x<=Math.max(a.x,b.x)&&y>=Math.min(a.y,b.y)&&y<=Math.max(a.y,b.y))return true;
  if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)inside=!inside;
 }return inside;
}
export function rasterize(g,w,h){
 check(int(w)&&int(h)&&w>0&&h>0&&w<=1024&&h<=1024,"invalid scene size");
 check(g&&typeof g==="object","missing geometry");
 const cells=new Set();
 const add=(x,y)=>{check(int(x)&&int(y)&&x>=0&&y>=0&&x<w&&y<h,"geometry outside scene: "+x+","+y);cells.add(y*w+x);};
 const rect=(x,y,a,b)=>{check([x,y,a,b].every(int)&&a>0&&b>0&&x>=0&&y>=0&&x+a<=w&&y+b<=h,"invalid rect");for(let yy=y;yy<y+b;yy++)for(let xx=x;xx<x+a;xx++)add(xx,yy);};
 if(g.type==="rect")rect(g.x,g.y,g.w,g.h);
 else if(g.type==="point"){coord(g);add(g.x,g.y);}
 else if(g.type==="mask"){
  let previousY=-1,previousEnd=-1;
  for(const row of arr(g.rows,"mask rows")){check(int(row.y)&&row.y>previousY&&row.y<h&&row.y>=0,"unordered mask rows");previousY=row.y;previousEnd=-1;
   for(const span of arr(row.spans,"mask spans")){check(Array.isArray(span)&&span.length===2&&span.every(int)&&span[0]>=previousEnd&&span[0]>=0&&span[1]>span[0]&&span[1]<=w,"invalid mask span");previousEnd=span[1];for(let x=span[0];x<span[1];x++)add(x,row.y);}
  }
 }else if(g.type==="polygon"){
  const ring=r=>{check(arr(r,"ring").length>=3,"short polygon ring");for(const p of r){coord(p);check(p.x>=0&&p.x<=w&&p.y>=0&&p.y<=h,"polygon vertex outside scene");}return r;};
  const outer=ring(g.points),holes=arr(g.holes||[],"holes").map(ring);
  const xs=outer.map(p=>p.x),ys=outer.map(p=>p.y);
  for(let y=Math.min(...ys);y<Math.max(...ys);y++)for(let x=Math.min(...xs);x<Math.max(...xs);x++)if(ringContains(outer,x+.5,y+.5)&&!holes.some(r=>ringContains(r,x+.5,y+.5)))add(x,y);
 }else if(g.type==="polyline"){
  const ps=arr(g.points,"line points"),width=g.width;check(ps.length>=2&&int(width)&&width>0,"invalid line");
  // Axis-aligned center cells; even widths extend one extra cell toward +x/+y.
  // Diagonal sections use explicit masks in v0.3.29 (no ambiguous automatic raster).
  const lo=Math.floor((width-1)/2),hi=width-lo-1;
  for(let i=1;i<ps.length;i++){
   const a=coord(ps[i-1]),b=coord(ps[i]);check(a.x===b.x||a.y===b.y,"diagonal line requires explicit mask");
   if(a.y===b.y)rect(Math.min(a.x,b.x),a.y-lo,Math.abs(b.x-a.x)+1,width);
   else rect(a.x-lo,Math.min(a.y,b.y),width,Math.abs(b.y-a.y)+1);
   if(i<ps.length-1)rect(b.x-lo,b.y-lo,width,width);
  }
 }else throw Error("MFS: unknown geometry "+g.type);
 check(cells.size>0,"empty geometry");return cells;
}
export function rotateCell(x,y,w,h,rotation){
 check([x,y,w,h].every(int)&&x>=0&&y>=0&&x<w&&y<h,"invalid rotation coordinates");
 switch(rotation){case 0:return {x,y};case 90:return {x:h-1-y,y:x};case 180:return {x:w-1-x,y:h-1-y};case 270:return {x:y,y:w-1-x};default:throw Error("MFS: unsupported rotation");}
}
const TYPES=new Set(["grass","meadow","road","stone","wood","water","wall","tree","rock","hill","forest-floor","marble","void","object","rampart"]);
const SOLID=new Set(["void","wall","water","tree","object"]);
const scenes=new Map();
export function mfsScene(id){return scenes.get(id)||null;}
export function registerMfs(bundle){
 for(const id of bundle.scenes.keys())check(!scenes.has(id),"duplicate registered scene "+id);
 for(const [id,s] of bundle.scenes)scenes.set(id,s);return bundle;
}
function newScene(id,w,h,level,name,base){
 check(typeof id==="string"&&id&&int(w)&&int(h)&&w>0&&h>0&&w<=1024&&h<=1024&&int(level),"invalid scene");
 check(TYPES.has(base),"unknown base tile");
 return {id,width:w,height:h,level,name,tiles:Array(w*h).fill(base),elevation:new Int16Array(w*h),objects:new Map(),portals:new Map(),doors:new Map(),places:[],records:new Map(),tile(x,y){return int(x)&&int(y)&&x>=0&&y>=0&&x<w&&y<h?this.tiles[y*w+x]:"void";},blocked(x,y){return SOLID.has(this.tile(x,y));}};
}
// Optional explicit multi-cell door endpoints. Old maps retain a single implicit lane.
// target indexes a safe arrival lane on the opposite side, not a trigger.
export function portalEndpointCells(e){
 if(!e)return [];
 if(Array.isArray(e.lanes)&&e.lanes.length)return e.lanes.filter(l=>l&&l.trigger&&l.arrival).map(l=>({...l,sceneId:e.sceneId}));
 return [{sceneId:e.sceneId,trigger:e.trigger,arrival:e.arrival,target:0}];
}
export function portalLanes(p){
 const a=p?.a,b=p?.b;
 check(a&&b&&typeof a.sceneId==="string"&&typeof b.sceneId==="string"&&a.sceneId!==b.sceneId,"invalid portal endpoints");
 const wide=a.lanes!==undefined||b.lanes!==undefined;
 const same=(u,v)=>u.x===v.x&&u.y===v.y;
 const side=e=>{
  coord(e.trigger);coord(e.arrival);
  if(wide)check(Array.isArray(e.lanes)&&e.lanes.length>=1&&e.lanes.length<=4,"wide portal requires 1–4 explicit lanes per side");
  const lanes=wide?e.lanes:[{trigger:e.trigger,arrival:e.arrival,target:0}];
  for(const l of lanes){check(l&&typeof l==="object","invalid portal lane");coord(l.trigger);coord(l.arrival);check(int(l.target),"missing portal lane target");}
  check(same(lanes[0].trigger,e.trigger)&&same(lanes[0].arrival,e.arrival),"primary endpoint differs from lane zero");
  const dx=lanes[0].arrival.x-lanes[0].trigger.x,dy=lanes[0].arrival.y-lanes[0].trigger.y;
  check(Math.abs(dx)+Math.abs(dy)===1,"arrival not adjacent to trigger");
  const step=lanes.length>1?{x:lanes[1].trigger.x-lanes[0].trigger.x,y:lanes[1].trigger.y-lanes[0].trigger.y}:null;
  if(step)check(Math.abs(step.x)+Math.abs(step.y)===1&&step.x*dx+step.y*dy===0,"noncontiguous portal span");
  for(const [i,l] of lanes.entries()){
   check(l.arrival.x-l.trigger.x===dx&&l.arrival.y-l.trigger.y===dy,"inconsistent portal lane approach");
   if(step)check(l.trigger.x===lanes[0].trigger.x+i*step.x&&l.trigger.y===lanes[0].trigger.y+i*step.y,"noncontiguous portal span");
  }
  return lanes.map(l=>({...l,sceneId:e.sceneId}));
 };
 if(wide)check(p.type==="door","only doors support multi-cell spans");
 const A=side(a),B=side(b);
 if(wide)check(A.length>1||B.length>1,"use legacy endpoint for single lane");
 for(const [from,to] of [[A,B],[B,A]])for(const l of from)check(l.target>=0&&l.target<to.length,"portal lane target out of range");
 return {a:A,b:B};
}

function pointIndex(s,p){coord(p);check(p.x>=0&&p.x<s.width&&p.y>=0&&p.y<s.height,"point outside "+s.id);return p.y*s.width+p.x;}
const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
function accessible(s,a,b){const start=pointIndex(s,a),end=pointIndex(s,b);if(s.blocked(a.x,a.y)||s.blocked(b.x,b.y))return false;
 const seen=new Set([start]),q=[start];for(let i=0;i<q.length;i++){const n=q[i];if(n===end)return true;const x=n%s.width,y=Math.floor(n/s.width);for(const [dx,dy] of dirs){const xx=x+dx,yy=y+dy,k=yy*s.width+xx;if(!s.blocked(xx,yy)&&!seen.has(k)){seen.add(k);q.push(k);}}}return false;}
export function compileMap(m,data){
 check(m?.schemaVersion===VERSION&&m.mdsVersion==="1.0","unsupported schema/MDS");
 check(m.sourceType==="manual"&&["published","approved"].includes(m.status),"unapproved map");
 check(int(m.mapRevision)&&m.mapRevision>0&&typeof m.mapId==="string"&&m.mapId&&typeof m.name==="string"&&m.tileMeters===1&&m.baseTilePixels===32&&m.elevationStepMeters===.5&&m.interiorScale===2&&m.sectorSize===16,"invalid manifest");
 const ids=new Set(),all=new Map(),record=(o)=>{check(o&&typeof o.id==="string"&&o.id.startsWith(m.mapId+".")&&!ids.has(o.id),"duplicate/invalid ID "+o?.id);ids.add(o.id);return o;};
 const s=newScene(m.mapId,m.width,m.height,0,m.name,data.terrain.defaultTile);all.set(s.id,s);
 const geom=(scene,o)=>rasterize(o.geometry,scene.width,scene.height);
 function paint(scene,cs,t){check(TYPES.has(t),"invalid tile "+t);for(const k of cs)scene.tiles[k]=t;}
 function addObject(scene,o){record(o);check(typeof o.type==="string"&&typeof o.name==="string","invalid object");const cs=geom(scene,o);for(const k of cs){check(!scene.objects.has(k)&&!SOLID.has(scene.tiles[k]),"object collision "+o.id);scene.objects.set(k,{...o,kind:"inspect",description:o.name});if(o.blocking!==false)scene.tiles[k]="object";}scene.records.set(o.id,o);
  for(const st of arr(o.stations||[],"stations")){record(st);check(typeof st.action==="string"&&int(st.capacity)&&st.capacity>0,"invalid station");const k=pointIndex(scene,st.approach);check(!SOLID.has(scene.tiles[k]),"blocked station");}
 }
 for(const o of arr(data.terrain.regions,"terrain.regions")){record(o);paint(s,geom(s,o),o.tile);}
 for(const o of arr(data.terrain.elevations||[],"elevations")){record(o);check(int(o.elevation)&&o.elevation>=-32768&&o.elevation<=32767,"bad elevation");for(const k of geom(s,o))s.elevation[k]=o.elevation;}
 const parcels=new Map(),occupied=new Set();
 for(const p of arr(data.parcels,"parcels")){record(p);const cs=geom(s,p);for(const k of cs){check(!occupied.has(k),"overlapping parcels");occupied.add(k);}parcels.set(p.id,{...p,cells:cs});s.records.set(p.id,p);}
 const roadCells=new Set(),roads=new Set();
 for(const r of arr(data.roads,"roads")){record(r);check(({R1:6,R2:5,R3:3,R4:2,R5:1})[r.class]===r.width,"bad road width");roads.add(r.id);const cs=geom(s,r);for(const k of cs){check(!occupied.has(k),"road crosses parcel");check(!SOLID.has(s.tiles[k]),"road crosses obstacle");roadCells.add(k);}paint(s,cs,"road");s.records.set(r.id,r);}
 for(const p of parcels.values()){check(arr(p.accessRoadIds,"parcel roads").length>0&&p.accessRoadIds.every(id=>roads.has(id)),"invalid road reference "+p.id);
  check([...p.cells].some(k=>dirs.some(([dx,dy])=>{const x=k%s.width+dx,y=Math.floor(k/s.width)+dy;return x>=0&&x<s.width&&y>=0&&y<s.height&&roadCells.has(y*s.width+x);})),"parcel has no road access "+p.id);}
 check(data.fortifications?.class==="F0"&&arr(data.fortifications.elements,"fortifications").length===0,"fortifications not supported by core yet");
 const buildings=new Map(),built=new Set();
 for(const b of arr(data.buildings,"buildings")){record(b);const cs=geom(s,b),p=parcels.get(b.parcelId);check(p,"unknown parcel "+b.parcelId);
  for(const k of cs){check(p.cells.has(k)&&!built.has(k)&&!SOLID.has(s.tiles[k]),"building collision/outside parcel "+b.id);built.add(k);}
  check(typeof b.name==="string"&&typeof b.type==="string","bad building");
  buildings.set(b.id,{...b,cells:cs});paint(s,cs,"wall");s.records.set(b.id,b);
 }
 for(const o of arr(data.infrastructure,"infrastructure"))addObject(s,o);
 for(const z of arr(data.npcZones,"npcZones")){record(z);check(/^N[0-9]$/.test(z.type)&&z.sceneId===s.id,"bad NPC zone");geom(s,z);s.records.set(z.id,z);}
 const floors=new Map();
 for(const f of arr(data.interiors,"interiors")){
  record(f);const b=buildings.get(f.buildingId);check(b,"unknown interior building");check(!all.has(f.id),"duplicate scene");
  check(arr(b.floorIds,"building floors").includes(f.id),"floor not declared");
  const xs=[...b.cells].map(k=>k%s.width),ys=[...b.cells].map(k=>Math.floor(k/s.width)),minX=Math.min(...xs),minY=Math.min(...ys);
  check(f.width===2*(Math.max(...xs)-minX+1)&&f.height===2*(Math.max(...ys)-minY+1),"ISS size mismatch "+f.id);
  const q=newScene(f.id,f.width,f.height,f.level,b.name+" — poziom "+f.level,"void");
  const mask=rasterize(f.geometry,f.width,f.height),expected=new Set();
  for(const k of b.cells){const x=2*(k%s.width-minX),y=2*(Math.floor(k/s.width)-minY);for(let j=0;j<2;j++)for(let i=0;i<2;i++)expected.add((y+j)*q.width+x+i);}
  check(mask.size===expected.size&&[...mask].every(k=>expected.has(k)),"ISS mask mismatch "+f.id);
  paint(q,mask,f.floorTile);
  for(const wall of arr(f.walls,"walls")){record(wall);const cs=geom(q,wall);check([...cs].every(k=>mask.has(k)),"wall outside footprint");paint(q,cs,"wall");}
  for(const o of arr(f.objects,"objects"))addObject(q,o);
  for(const r of arr(f.rooms||[],"rooms")){record(r);const k=pointIndex(q,r.anchor);check(mask.has(k)&&!SOLID.has(q.tiles[k]),"invalid room anchor");q.records.set(r.id,r);}
  all.set(q.id,q);floors.set(q.id,b.id);
 }
 for(const b of buildings.values())check(b.floorIds.length>0&&new Set(b.floorIds).size===b.floorIds.length&&b.floorIds.every(id=>floors.get(id)===b.id),"missing floor "+b.id);
 for(const p of arr(data.portals,"portals")){
  record(p);check(["door","stairs"].includes(p.type)&&p.direction==="both","unsupported portal");
  const a=p.a,b=p.b,lanes=portalLanes(p),sa=all.get(a?.sceneId),sb=all.get(b?.sceneId);check(sa&&sb,"unknown portal scene");
  check(sa!==sb,"portal must connect different scenes");
  const endpoint=(from,to,u,d,index)=>{
   const trigger=pointIndex(from,u.trigger),arrival=pointIndex(to,d.arrival);
   check(!from.portals.has(trigger),"duplicate portal trigger");
   check(!from.objects.has(trigger),"object on portal trigger");
   check(!to.blocked(d.arrival.x,d.arrival.y),"blocked arrival");
   check(pointIndex(to,d.trigger)!==arrival,"arrival on trigger");
   check(Math.abs(u.trigger.x-u.arrival.x)+Math.abs(u.trigger.y-u.arrival.y)===1,"arrival not adjacent to trigger");
   check(!from.blocked(u.arrival.x,u.arrival.y),"blocked approach");
   const tile=p.type==="door"?"door":to.level>from.level?"stairs-up":"stairs-down";
   check(p.type==="door"?from.tiles[trigger]==="wall":!SOLID.has(from.tiles[trigger]),"portal trigger has wrong surface");
   from.tiles[trigger]=tile;
   from.portals.set(trigger,{map:to.id,floor:0,x:d.arrival.x,y:d.arrival.y});
   if(p.type==="door")from.doors.set(trigger,{id:p.id,name:p.name||"Drzwi",initial:"open"});
   from.places.push({id:index===0?p.id:p.id+".lane"+(index+1),name:p.name||tile,kind:"Przejście",x:u.arrival.x,y:u.arrival.y,map:from.id,floor:0});
  };
  if(p.type==="stairs")check(floors.get(sa.id)&&floors.get(sa.id)===floors.get(sb.id)&&Math.abs(sa.level-sb.level)===1,"invalid stairs levels");
  else check(sa===s&&floors.has(sb.id)||sb===s&&floors.has(sa.id),"invalid exterior door");
  if(p.type==="door"){const ext=sa===s?lanes.a:lanes.b,inside=sa===s?sb:sa,building=buildings.get(floors.get(inside.id));check(inside.level===0&&ext.every(e=>building.cells.has(pointIndex(s,e.trigger))&&!building.cells.has(pointIndex(s,e.arrival))),"door not on owning building boundary");}
  for(const [i,u] of lanes.a.entries())endpoint(sa,sb,u,lanes.b[u.target],i);
  for(const [i,u] of lanes.b.entries())endpoint(sb,sa,u,lanes.a[u.target],i);
 }
 for(const q of all.values()){
  for(const [k,d] of q.portals){const target=all.get(d.map);check(!target.portals.has(pointIndex(target,d)),"portal arrival on another trigger");}
  const approaches=q.places;for(let i=1;i<approaches.length;i++)check(accessible(q,approaches[0],approaches[i]),"disconnected portal approaches "+q.id);
  for(const o of new Set(q.objects.values()))for(const st of o.stations||[])check(!q.blocked(st.approach.x,st.approach.y),"blocked final station");
 }
 const spawn=arr(m.spawnPoints,"spawnPoints").find(p=>p.role==="default");check(spawn&&spawn.sceneId===s.id,"missing default spawn");record(spawn);check(!s.blocked(spawn.x,spawn.y)&&!s.portals.has(pointIndex(s,spawn)),"bad spawn");
 for(const p of s.places)check(accessible(s,spawn,p),"unreachable exterior door");
 return {manifest:m,scenes:all,spawn:{map:s.id,floor:0,x:spawn.x,y:spawn.y},parcels,buildings};
}
const REQUIRED=["terrain","parcels","roads","fortifications","buildings","infrastructure","npcZones","portals"];
function safePath(path){check(typeof path==="string"&&/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.json$/.test(path),"unsafe JSON path "+path);return path;}
export async function loadMfsWorld(base,fetcher=fetch){
 const get=async path=>{const response=await fetcher(base+safePath(path),{cache:"no-cache"});check(response.ok,"missing file "+path);return response.json();};
 const world=await get("world.json");check(world.schemaVersion===VERSION,"unsupported world");
 const bundles=[],seen=new Set();
 for(const entry of arr(world.locations,"locations")){
  check(typeof entry.mapId==="string"&&!seen.has(entry.mapId),"duplicate map");seen.add(entry.mapId);
  const path=safePath(entry.manifest),m=await get(path),dir=path.slice(0,path.lastIndexOf("/")+1);
  check(m.mapId===entry.mapId&&m.mapRevision===entry.mapRevision,"manifest registry mismatch");
  const data=Object.fromEntries(await Promise.all(REQUIRED.map(async k=>[k,await get(dir+safePath(m.files?.[k]))])));
  data.interiors=await Promise.all(arr(m.interiors,"interiors").map(p=>get(dir+safePath(p))));
  bundles.push(compileMap(m,data));
 }return bundles;
}
