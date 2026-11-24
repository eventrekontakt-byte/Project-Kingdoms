import {mfsScene} from "../engine/mfs/core.js?v=0.3.29";
// Local minimap: static terrain raster cached separately from low-rate markers.
import {mapSize,tileAt} from "../engine/world.js?v=0.3.29";
import {CITY_GATES,CITY_BUILDINGS} from "../engine/city-one.js";
export const MIN_ZOOM=1,MAX_ZOOM=3;
export function clampZoom(value){return Number.isFinite(value)?Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,value)):1;}
export function mapTransform(w,h,mw,mh,zoom=1,center=null){
 const scale=Math.min(w/mw,h/mh)*Math.max(1,Math.min(6,zoom));
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 const ox=mw*scale<=w?(w-mw*scale)/2:clamp(w/2-(center?.x??mw/2)*scale,w-mw*scale,0);
 const oy=mh*scale<=h?(h-mh*scale)/2:clamp(h/2-(center?.y??mh/2)*scale,h-mh*scale,0);
 return {scale,ox,oy};
}
export function minimapTile(t,x,y,mw,mh){
 const tx=Math.floor((x-t.ox)/t.scale),ty=Math.floor((y-t.oy)/t.scale);
 return tx>=0&&ty>=0&&tx<mw&&ty<mh?{x:tx,y:ty}:null;
}
export function normalizeSearch(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ł/g,"l").trim();}
export function searchPlaces(places,q){const query=normalizeSearch(q);return places.filter(p=>normalizeSearch(p.name+" "+(p.kind||"")).includes(query));}
export function localPlaces(map,floor){
 const s=mfsScene(map);if(s)return floor===0?s.places:[];
 if(map==="site-city1"){
  return CITY_BUILDINGS.filter(b=>b.door&&!b.decorative).map(b=>{
   const [dx,dy]={N:[0,-1],S:[0,1],W:[-1,0],E:[1,0]}[b.facing];
   return {id:b.id,name:b.name,kind:"Budynek",x:b.door.x+dx,y:b.door.y+dy,map,floor};
  }).concat(CITY_GATES.map(g=>({id:g.id,name:g.name,kind:"Brama",x:g.x,y:g.y,map,floor})));
 }
 const {w,h}=mapSize(map),places=[];
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const tile=tileAt(map,floor,x,y);
  if(["door","stairs-up","stairs-down"].includes(tile))places.push({id:x+","+y,name:(tile==="door"?"Drzwi / wyjście":tile==="stairs-up"?"Schody w górę":"Schody w dół")+" ("+x+", "+y+")",kind:"Przejście",x,y,map,floor});
 }
 return places;
}
const PALETTE={void:"#101923",wall:"#535764",rampart:"#b0afb0",road:"#bba083",grass:"#435c3d",meadow:"#536c43",tree:"#294b32",water:"#325c82",stone:"#898881",wood:"#9b7956",marble:"#b7b2a8",object:"#634b3e",door:"#e4b64c","stairs-up":"#b787e2","stairs-down":"#8d69c5","forest-floor":"#3d5b38",rock:"#777773",hill:"#69774c"};
const rgb=Object.fromEntries(Object.entries(PALETTE).map(([k,v])=>[k,[parseInt(v.slice(1,3),16),parseInt(v.slice(3,5),16),parseInt(v.slice(5,7),16)]]));
export function createMinimap(canvas,{makeCanvas=()=>document.createElement("canvas"),maxCache=5,interval=250}={}){
 const ctx=canvas.getContext("2d"),cache=new Map();
 let last=-Infinity,lastKey="",builds=0,paints=0,transform=null;
 function raster(map,floor,mw,mh){
  const key=map+":"+floor;
  if(cache.has(key)){const v=cache.get(key);cache.delete(key);cache.set(key,v);return v;}
  const c=makeCanvas();c.width=mw;c.height=mh;
  const g=c.getContext("2d"),im=g.createImageData(mw,mh),a=im.data;
  for(let y=0;y<mh;y++)for(let x=0;x<mw;x++){
   const p=rgb[tileAt(map,floor,x,y)]||[60,65,65],i=(y*mw+x)*4;
   a[i]=p[0];a[i+1]=p[1];a[i+2]=p[2];a[i+3]=255;
  }
  g.putImageData(im,0,0);cache.set(key,c);builds++;
  while(cache.size>maxCache)cache.delete(cache.keys().next().value);
  return c;
 }
 function draw({player,camera,view,fixed=[],ambient=[],focusId=null,gateStates={},now=performance.now(),force=false,hidden=false,miniZoom=1,center=null,showNPCs=true,showCamera=true,showPlaces=false,places=[],waypoint=null,route=[]}){
  if(hidden)return false;
  const {w:mw,h:mh}=mapSize(player.map);if(!mw||!mh||!view.size)return false;
  const w=canvas.width,h=canvas.height,key=player.map+":"+player.floor+":"+w+":"+h;
  if(!force&&key===lastKey&&now-last<interval)return false;
  last=now;lastKey=key;paints++;
  const {scale,ox,oy}=mapTransform(w,h,mw,mh,miniZoom,center);transform={scale,ox,oy,mw,mh};
  ctx.fillStyle="#101923";ctx.fillRect(0,0,w,h);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(raster(player.map,player.floor,mw,mh),ox,oy,mw*scale,mh*scale);
  ctx.save();ctx.beginPath();ctx.rect(ox,oy,mw*scale,mh*scale);ctx.clip();
  const dot=(n,color,r)=>{
   if(n.map!==player.map||(n.floor||0)!==player.floor)return;
   const x=ox+(n.x+.5)*scale,y=oy+(n.y+.5)*scale;
   ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  };
  if(player.map==="site-city1")for(const gate of CITY_GATES)if(gateStates[gate.id]==="closed")dot({map:player.map,x:gate.x,y:gate.y},"#e47566",2.5);
  if(showNPCs){for(const n of fixed)dot(n,n.important?"#ffe0a0":"#e8e9dd",n.important?1.9:1.2);
  for(const n of ambient)dot(n,n.id===focusId?"#ffe277":"#8ac6b6",n.id===focusId?2.8:1);}
  if(showPlaces)for(const p of places)dot(p,"#d6aa6a",2);
  if(route.length){ctx.strokeStyle="#f8ce65";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ox+(player.x+.5)*scale,oy+(player.y+.5)*scale);for(const p of route)ctx.lineTo(ox+(p.x+.5)*scale,oy+(p.y+.5)*scale);ctx.stroke();}
  if(waypoint&&waypoint.map===player.map&&waypoint.floor===player.floor){const x=ox+(waypoint.x+.5)*scale,y=oy+(waypoint.y+.5)*scale;ctx.strokeStyle="#ffb64e";ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#ffcf76";ctx.fillRect(x-1,y-1,3,3);}
  // Camera rectangle uses the actual visible area, not a fixed radius.
  const halfW=view.w/(2*view.size),halfH=view.h/(2*view.size);
  if(showCamera){ctx.strokeStyle="#dce9f5";ctx.lineWidth=1;ctx.strokeRect(ox+(camera.x-halfW)*scale,oy+(camera.y-halfH)*scale,2*halfW*scale,2*halfH*scale);}
  dot(player,"#68d9ff",3.3);
  ctx.strokeStyle="#172b3a";ctx.lineWidth=1;ctx.beginPath();ctx.arc(ox+(player.x+.5)*scale,oy+(player.y+.5)*scale,3.3,0,Math.PI*2);ctx.stroke();ctx.restore();
  return true;
 }
 return {draw,transform:()=>transform,stats:()=>({builds,paints,cached:cache.size})};
}
