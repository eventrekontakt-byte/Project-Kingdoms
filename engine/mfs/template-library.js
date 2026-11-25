// MTL design-time expansion; no runtime randomisation.
export const LIBRARY_SCHEMA="1.0.0";
const rect=(x,y,w,h)=>({type:"rect",x,y,w,h}),clone=x=>JSON.parse(JSON.stringify(x));
function require(ok,m){if(!ok)throw Error("MTL: "+m);}
const rotations=[0,90,180,270];
export function rotatePoint(p,w,h,r){switch(r){case 0:return {x:p.x,y:p.y};case 90:return {x:h-1-p.y,y:p.x};case 180:return {x:w-1-p.x,y:h-1-p.y};case 270:return {x:p.y,y:w-1-p.x};default:throw Error("MTL rotation");}}
function rotateRect(g,w,h,r){const a=rotatePoint({x:g.x,y:g.y},w,h,r),b=rotatePoint({x:g.x+g.w-1,y:g.y+g.h-1},w,h,r);return rect(Math.min(a.x,b.x),Math.min(a.y,b.y),Math.abs(a.x-b.x)+1,Math.abs(a.y-b.y)+1);}
const shift=(p,x,y)=>({x:p.x+x,y:p.y+y});
export function validateLibrary(lib){
 require(lib?.schemaVersion===LIBRARY_SCHEMA&&lib.mdsVersion==="1.0"&&Array.isArray(lib.buildings)&&Array.isArray(lib.furniture),"bad library");
 const keys=new Set();for(const a of [...lib.furniture,...lib.buildings,...(lib.decorations||[]),...(lib.rooms||[]),...(lib.infrastructure||[]),...(lib.terrain||[]),...(lib.fortifications||[])]){const k=a.id+"@"+a.version;require(typeof a.id==="string"&&Number.isInteger(a.version)&&a.version>0&&!keys.has(k),"duplicate/bad template "+k);keys.add(k);}
 for(const b of lib.buildings){require(Number.isInteger(b.width)&&Number.isInteger(b.height)&&b.width>0&&b.height>0&&b.shape==="R"&&b.floors?.length,"bad building "+b.id);const levels=b.floors.map((f,i)=>f.level??i);require(levels.every(Number.isInteger)&&new Set(levels).size===levels.length&&levels.includes(0)&&Math.max(...levels)-Math.min(...levels)+1===levels.length,"invalid floor levels "+b.id);for(const s of b.stairs||[])require(levels.includes(s.from)&&levels.includes(s.to)&&Math.abs(s.from-s.to)===1,"invalid stairs "+b.id);if(b.entrySpan!==undefined){const s=b.entrySpan;require(s&&Number.isInteger(s.outside)&&Number.isInteger(s.inside)&&s.outside>=1&&s.outside<=2&&s.inside>=2&&s.inside<=4,"invalid entry span "+b.id);require(b.entry?.y===b.height-1&&b.interiorEntry?.y===b.height*2-1&&b.entry.x>0&&b.entry.x+s.outside<b.width&&b.interiorEntry.x>0&&b.interiorEntry.x+s.inside<b.width*2,"entry span outside south wall "+b.id);}
 for(const dep of b.dependencies)require(lib.furniture.some(f=>f.id===dep.id&&f.version===dep.version),"missing dependency "+dep.id);}
 return lib;
}
export function instantiateBuilding(lib,templateId,version,opts){
 validateLibrary(lib);const t=lib.buildings.find(a=>a.id===templateId&&a.version===version);require(t,"unknown template/version");
 const {mapId,id,parcelId,x,y,rotation=0}=opts;require(typeof mapId==="string"&&id?.startsWith(mapId+".")&&parcelId?.startsWith(mapId+".")&&Number.isInteger(x)&&Number.isInteger(y)&&rotations.includes(rotation)&&t.orientations.includes(rotation),"bad instance");
 const w=t.width,h=t.height,iw=w*2,ih=h*2,rg=(g,W,H)=>rotateRect(g,W,H,rotation),rp=(p,W,H)=>rotatePoint(p,W,H,rotation),fp=n=>id+".f"+n;
 const ext=rg(t.geometry,w,h),building={id,parcelId,type:t.type,name:opts.name||t.name,geometry:rect(x+ext.x,y+ext.y,ext.w,ext.h),rotation,floorIds:t.floors.map((f,n)=>fp(f.level??n)),templateRef:{id:t.id,version:t.version},functions:[...new Set(t.floors.flatMap(f=>f.rooms.flatMap(r=>r.functions)))]};
 const interiors=t.floors.map((f,n)=>{
  const level=f.level??n,fid=fp(level),box=rg(rect(0,0,iw,ih),iw,ih),walls=[rect(0,0,iw,1),rect(0,ih-1,iw,1),rect(0,1,1,ih-2),rect(iw-1,1,1,ih-2),...f.partitions].map((g,i)=>({id:fid+".wall"+(i+1),geometry:rg(g,iw,ih),kind:i<4?"exterior":"partition"}));
  const objects=f.objects.map((o,i)=>{const dep=t.dependencies.find(d=>d.id===o.type),src=lib.furniture.find(f=>f.id===dep?.id&&f.version===dep.version);require(src,"missing furniture "+o.type);const r=o.rotation||0;require(src.orientations.includes(r),"bad furniture rotation");
   const local=rotateRect(rect(0,0,src.w,src.h),src.w,src.h,r),g=rect(o.x,o.y,local.w,local.h),oid=fid+".o"+(i+1);
   return {id:oid,type:src.id,name:src.name,geometry:rg(g,iw,ih),rotation:(r+rotation)%360,blocking:src.blocking,...(src.placement?{placement:clone(src.placement),playerInteraction:clone(src.playerInteraction),...(Number.isInteger(o.relatedIndex)?{relatedObjectId:fid+".o"+(o.relatedIndex+1)}:{})}:{}),templateRef:{id:src.id,version:src.version},stations:src.stations.map((s,j)=>({id:oid+".s"+(j+1),action:s.action,capacity:s.capacity,approach:rp(shift(rotatePoint(s,src.w,src.h,r),o.x,o.y),iw,ih)}))};});
  const solid=p=>p.x<=0||p.y<=0||p.x>=iw-1||p.y>=ih-1||f.partitions.some(g=>p.x>=g.x&&p.x<g.x+g.w&&p.y>=g.y&&p.y<g.y+g.h);
  const roomCuts=[];for(const split of f.roomSplits||[])for(let k=split.start;k<=split.end;k++){const a=split.axis==="x"?{x:split.at-1,y:k}:{x:k,y:split.at-1},b=split.axis==="x"?{x:split.at,y:k}:{x:k,y:split.at};if(!solid(a)&&!solid(b))roomCuts.push({id:fid+".cut"+(roomCuts.length+1),kind:split.kind,a:rp(a,iw,ih),b:rp(b,iw,ih)});}
  const decorations=(f.decorations||[]).map((o,i)=>{const src=(lib.decorations||[]).find(d=>d.id===o.type);require(src,"missing decoration "+o.type);const r=o.rotation||0,dw=r%180?src.h:src.w,dh=r%180?src.w:src.h;let extra={};if(src.mount==="surface"){const host=objects[o.hostIndex];require(host&&src.allowedHosts.includes(host.type)&&Number.isInteger(o.slot)&&o.slot>=0&&o.slot<4,"invalid surface host/slot");extra={hostId:host.id,slot:(o.slot+rotation/90)%4,allowedHosts:clone(src.allowedHosts),size:src.size};}return {id:fid+".dec"+(i+1),type:src.id,name:src.name,mount:src.mount,geometry:rg(rect(o.x,o.y,dw,dh),iw,ih),rotation:(r+rotation)%360,blocking:false,templateRef:{id:src.id,version:src.version},...extra};});
 return {id:fid,buildingId:id,level,width:box.w,height:box.h,geometry:box,floorTile:f.floorTile??"wood",walls,objects,decorations,...(f.roomSplits?{roomTopologyVersion:1,roomCuts}:{}),rooms:f.rooms.map((r,i)=>({...clone(r),id:fid+".r"+(i+1),anchor:rp(r.anchor,iw,ih)})),templateRef:{id:t.id,version:t.version}};
 });
 const ep=rp(t.entry,w,h),ea=rp({x:t.entry.x,y:t.entry.y+1},w,h),ip=rp(t.interiorEntry,iw,ih),ia=rp({x:t.interiorEntry.x,y:t.interiorEntry.y-1},iw,ih),end=(sceneId,trigger,arrival)=>({sceneId,trigger,arrival});
 const portals=[{id:id+".portal1",name:"Wejście — "+building.name,type:"door",direction:"both",a:end(mapId,shift(ep,x,y),shift(ea,x,y)),b:end(fp(0),ip,ia)}];
 if(t.entrySpan){const {outside,inside}=t.entrySpan,p=portals[0];p.a.lanes=Array.from({length:outside},(_,i)=>({trigger:shift(rp({x:t.entry.x+i,y:t.entry.y},w,h),x,y),arrival:shift(rp({x:t.entry.x+i,y:t.entry.y+1},w,h),x,y),target:Math.floor(i*inside/outside)}));p.b.lanes=Array.from({length:inside},(_,i)=>({trigger:rp({x:t.interiorEntry.x+i,y:t.interiorEntry.y},iw,ih),arrival:rp({x:t.interiorEntry.x+i,y:t.interiorEntry.y-1},iw,ih),target:Math.floor(i*outside/inside)}));}
 for(const [i,s] of t.stairs.entries())portals.push({id:id+".portal"+(i+2),name:"Schody "+s.from+" ↔ "+s.to,type:"stairs",direction:"both",a:end(fp(s.from),rp(s.a.trigger,iw,ih),rp(s.a.arrival,iw,ih)),b:end(fp(s.to),rp(s.b.trigger,iw,ih),rp(s.b.arrival,iw,ih))});
 return {building,interiors,portals};
}
