// Local minimap: static terrain raster cached separately from low-rate markers.
import {mapSize,tileAt} from "../engine/world.js";
import {CITY_GATES} from "../engine/city-one.js";
export const MIN_ZOOM=.5,MAX_ZOOM=3;
export function clampZoom(value){return Number.isFinite(value)?Math.max(MIN_ZOOM,Math.min(MAX_ZOOM,value)):1;}
export function mapTransform(w,h,mw,mh){
 const scale=Math.min(w/mw,h/mh);
 return {scale,ox:(w-mw*scale)/2,oy:(h-mh*scale)/2};
}
const PALETTE={void:"#101923",wall:"#535764",rampart:"#b0afb0",road:"#bba083",grass:"#435c3d",meadow:"#536c43",tree:"#294b32",water:"#325c82",stone:"#898881",wood:"#9b7956",marble:"#b7b2a8",object:"#634b3e",door:"#e4b64c","stairs-up":"#b787e2","stairs-down":"#8d69c5","forest-floor":"#3d5b38",rock:"#777773",hill:"#69774c"};
const rgb=Object.fromEntries(Object.entries(PALETTE).map(([k,v])=>[k,[parseInt(v.slice(1,3),16),parseInt(v.slice(3,5),16),parseInt(v.slice(5,7),16)]]));
export function createMinimap(canvas,{makeCanvas=()=>document.createElement("canvas"),maxCache=5,interval=250}={}){
 const ctx=canvas.getContext("2d"),cache=new Map();
 let last=-Infinity,lastKey="",builds=0,paints=0;
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
 function draw({player,camera,view,fixed=[],ambient=[],focusId=null,gateStates={},now=performance.now(),force=false,hidden=false}){
  if(hidden)return false;
  const {w:mw,h:mh}=mapSize(player.map);if(!mw||!mh||!view.size)return false;
  const w=canvas.width,h=canvas.height,key=player.map+":"+player.floor+":"+w+":"+h;
  if(!force&&key===lastKey&&now-last<interval)return false;
  last=now;lastKey=key;paints++;
  const {scale,ox,oy}=mapTransform(w,h,mw,mh);
  ctx.fillStyle="#101923";ctx.fillRect(0,0,w,h);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(raster(player.map,player.floor,mw,mh),ox,oy,mw*scale,mh*scale);
  ctx.save();ctx.beginPath();ctx.rect(ox,oy,mw*scale,mh*scale);ctx.clip();
  const dot=(n,color,r)=>{
   if(n.map!==player.map||(n.floor||0)!==player.floor)return;
   const x=ox+(n.x+.5)*scale,y=oy+(n.y+.5)*scale;
   ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
  };
  if(player.map==="site-city1")for(const gate of CITY_GATES)if(gateStates[gate.id]==="closed")dot({map:player.map,x:gate.x,y:gate.y},"#e47566",2.5);
  for(const n of fixed)dot(n,n.important?"#ffe0a0":"#e8e9dd",n.important?1.9:1.2);
  for(const n of ambient)dot(n,n.id===focusId?"#ffe277":"#8ac6b6",n.id===focusId?2.8:1);
  // Camera rectangle uses the actual visible area, not a fixed radius.
  const halfW=view.w/(2*view.size),halfH=view.h/(2*view.size);
  ctx.strokeStyle="#dce9f5";ctx.lineWidth=1;ctx.strokeRect(ox+(camera.x-halfW)*scale,oy+(camera.y-halfH)*scale,2*halfW*scale,2*halfH*scale);
  dot(player,"#68d9ff",3.3);
  ctx.strokeStyle="#172b3a";ctx.lineWidth=1;ctx.beginPath();ctx.arc(ox+(player.x+.5)*scale,oy+(player.y+.5)*scale,3.3,0,Math.PI*2);ctx.stroke();ctx.restore();
  return true;
 }
 return {draw,stats:()=>({builds,paints,cached:cache.size})};
}
