import {rasterize} from "./core.js?v=0.3.29";
const kinds=new Set(["crop","orchard","pasture","pen","yard","timber","delivery","hay","compost"]),states=new Set(["fallow","plowed","sown","growing","ripe","harvested","active"]),list=x=>Array.isArray(x)?x:[];
export function validateRuralAreas(m,d){
 const areas=list(d.terrain?.regions).filter(a=>a.rural),farms=list(m.ruralComplexes),issues=[],w=m.width,h=m.height;
 if(!areas.length&&!farms.length)return issues;
 const issue=(objectId,message)=>issues.push({objectId,message}),cell=p=>Number.isInteger(p?.x)&&Number.isInteger(p?.y)&&p.x>=0&&p.y>=0&&p.x<w&&p.y<h?p.y*w+p.x:-1,mask=o=>rasterize(o.geometry,w,h),asMap=a=>new Map(a.map(o=>[o.id,o])),am=asMap(areas),fm=asMap(farms),bm=asMap(list(d.buildings)),pm=asMap(list(d.parcels)),im=asMap(list(d.infrastructure));
 const occupied=new Set(),blocked=new Set(),areaCells=new Set(),portalCells=new Set();for(const o of [...list(d.parcels),...list(d.roads),...list(d.buildings)])for(const k of mask(o))occupied.add(k);
 for(const o of list(d.buildings))for(const k of mask(o))blocked.add(k);
 for(const o of list(d.infrastructure))if(o.blocking!==false)for(const k of mask(o))blocked.add(k);
 for(const o of list(d.terrain?.regions))if(["water","wall","void","tree","object"].includes(o.tile))for(const k of mask(o))blocked.add(k);
 for(const p of list(d.portals))for(const e of [p.a,p.b])if(e?.sceneId===m.mapId){portalCells.add(cell(e.trigger));portalCells.add(cell(e.arrival));}
 const start=cell(list(m.spawnPoints).find(p=>p.role==="default")),reached=new Set(),queue=[];if(start>=0&&!blocked.has(start)){queue.push(start);reached.add(start);}for(let i=0;i<queue.length;i++){const k=queue[i],x=k%w,y=Math.floor(k/w);for(const [a,b] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){const n=cell({x:a,y:b});if(n>=0&&!blocked.has(n)&&!reached.has(n)){reached.add(n);queue.push(n);}}}
 if(am.size!==areas.length||fm.size!==farms.length)issue(m.mapId,"Powtórzone identyfikatory terenów lub gospodarstw");
 for(const a of areas){const r=a.rural,cs=mask(a);if(a.geometry.type!=="rect"||!kinds.has(r.kind)||!states.has(r.state)||!fm.has(r.farmId)||!Number.isInteger(r.rowSpacing)||r.rowSpacing<1)issue(a.id,"Nieprawidłowe dane obszaru");
 if([...cs].some(k=>occupied.has(k)||areaCells.has(k)||portalCells.has(k)))issue(a.id,"Obszar nachodzi na budynek, działkę budowlaną, drogę, portal lub inny obszar");for(const k of cs)areaCells.add(k);
 if(!cs.has(cell(r.access))||!reached.has(cell(r.access))||!list(r.approaches).length||list(r.approaches).some(p=>!cs.has(cell(p))||!reached.has(cell(p))))issue(a.id,"Niedostępne stanowisko lub dojście");
 if(!list(fm.get(r.farmId)?.areaIds).includes(a.id))issue(a.id,"Brak powiązania z kompleksem");
 if((r.kind==="crop"&&!["fallow","plowed"].includes(r.state)||r.kind==="orchard")&&!r.crop)issue(a.id,"Brak określenia uprawy");
 }
 for(const f of farms){if(!pm.has(f.parcelId)||!list(f.buildingIds).length||list(f.buildingIds).some(id=>bm.get(id)?.parcelId!==f.parcelId)||list(f.areaIds).some(id=>am.get(id)?.rural?.farmId!==f.id)||im.get(f.wellId)?.farmId!==f.id)issue(f.id,"Niepełne powiązania kompleksu");}
 for(const o of list(d.infrastructure).filter(o=>o.farmId)){if(!fm.has(o.farmId)||o.areaId&&am.get(o.areaId)?.rural?.farmId!==o.farmId)issue(o.id,"Błędne powiązanie infrastruktury");for(const s of list(o.stations))if(!reached.has(cell(s.approach)))issue(o.id,"Niedostępne stanowisko zewnętrzne");}
 return issues;
}
const palettes={wheat:["#73502f","#d4b358"],barley:["#795733","#a4aa53"],vegetables:["#775131","#6baf59"],flax:["#795b37","#89a2d5"],oats:["#8b6b44","#c2a56d"],herbs:["#6c5036","#9bbf65"]};
function box(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);}
function dot(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
export function ruralColor(a){const r=a.rural;return r.kind==="crop"?(r.state==="fallow"?"#957a4e":palettes[r.crop]?.[0]||"#795b37"):r.kind==="orchard"?"#527849":r.kind==="pasture"||r.kind==="pen"?"#77975b":r.kind==="hay"?"#b3a36a":r.kind==="compost"?"#816446":"#a28a65";}
export function drawRuralRegion(c,a,z=10){const g=a.geometry,r=a.rural;if(!r||g?.type!=="rect")return;const {x,y,w,h}=g;box(c,x,y,w,h,ruralColor(a));c.strokeStyle="#b7a584";c.lineWidth=.08;c.strokeRect(x+.04,y+.04,w-.08,h-.08);
 if(r.kind==="crop"){const p=palettes[r.crop]||["#795b37","#a4ab64"],step=r.rowSpacing||2;for(let yy=1;yy<h-1;yy+=step){box(c,x+.6,y+yy,w-1.2,.55,"#5e422c");if(r.state==="fallow"||r.state==="plowed")continue;if(z<3){box(c,x+.65,y+yy+.13,w-1.3,.22,r.state==="harvested"?"#b29a61":p[1]);continue;}for(let xx=1;xx<w-1;xx++){const u=x+xx+.28,v=y+yy+.27;if(r.state==="harvested")box(c,u,v,.23,.10,"#d2bc80");else if(r.crop==="vegetables"||r.crop==="herbs"){dot(c,u,v,.24,p[1]);dot(c,u+.08,v-.07,.12,"#bad486");}else{box(c,u-.035,v-.2,.07,.4,"#6d8646");dot(c,u,v-.13,.10,p[1]);dot(c,u+.1,v,.08,p[1]);}}}box(c,x+.1,y+h-.8,w-.2,.65,"#a68b62");}
 else if(r.kind==="orchard"){for(let yy=1;yy<h-1;yy+=4)box(c,x+.4,y+yy,w-.8,.24,"#8c9965");}
 else if(r.kind==="pasture"||r.kind==="pen"){if(z>=3)for(let yy=1;yy<h-1;yy+=2)for(let xx=1;xx<w-1;xx+=2){box(c,x+xx,y+yy,.08,.28,"#496d39");box(c,x+xx+.11,y+yy+.1,.09,.18,"#a2ba70");}}
 else if(z>=3){for(let yy=1;yy<h-1;yy+=2)for(let xx=1;xx<w-1;xx+=2)dot(c,x+xx+.25,y+yy+.25,.08,"#c1ac82");}
}
export function drawRuralObject(c,o){const g=o.geometry;if(!o.farmId||g?.type!=="rect")return false;const {x,y,w,h}=g,t=o.type;
 if(t==="orchard_tree"){box(c,x+.44,y+.43,.12,.45,"#694a2f");dot(c,x+.5,y+.44,.47,"#365e39");dot(c,x+.4,y+.32,.34,"#5d8e46");for(const [a,b] of [[.26,.36],[.62,.29],[.55,.62]])dot(c,x+a,y+b,.07,o.crop==="apple"?"#c86a4c":"#d9c15d");}
 else if(t==="farm_fence"){const horizontal=w>=h;if(horizontal){box(c,x,y+.32,w,.36,"#8b623c");for(let i=0;i<w;i++)box(c,x+i+.15,y+.13,.2,.74,"#60432f");}else{box(c,x+.32,y,.36,h,"#8b623c");for(let i=0;i<h;i++)box(c,x+.13,y+i+.15,.74,.2,"#60432f");}}
 else if(t==="farm_well"){dot(c,x+w/2,y+h/2,.87,"#857c6c");dot(c,x+w/2,y+h/2,.58,"#343d39");dot(c,x+w/2,y+h/2,.4,"#739ea5");box(c,x+.2,y+.1,w-.4,.2,"#7d5436");}
 else if(t==="rural_work_marker"){dot(c,x+.5,y+.5,.14,"#f0d28f");}
 else if(t==="outdoor_trough"){box(c,x+.06,y+.09,w-.12,h-.18,"#755337");box(c,x+.2,y+.23,w-.4,h-.46,"#829da0");}
 else if(t==="outdoor_hay"){dot(c,x+w/2,y+h/2,.86,"#b8994f");for(let i=0;i<4;i++)box(c,x+.32,y+.4+i*.26,w-.64,.09,"#dac077");}
 else if(t==="outdoor_timber"){for(let i=0;i<4;i++){box(c,x+.1,y+.1+i*.44,w-.2,.35,"#815b3b");dot(c,x+w-.2,y+.27+i*.44,.15,"#d2a36b");}}
 else if(t==="outdoor_delivery"){box(c,x+.15,y+.25,w-.3,h-.6,"#a4774d");dot(c,x+.4,y+h-.2,.22,"#4e4237");dot(c,x+w-.4,y+h-.2,.22,"#4e4237");}
 else if(t==="outdoor_compost"){dot(c,x+w/2,y+h/2,.8,"#60462e");dot(c,x+.6,y+.7,.28,"#8b7047");}
 else return false;return true;
}
