import {WORLD_WIDTH,WORLD_HEIGHT,SITES,WORLD_START,SITE_COLORS,siteAt,worldTile,roadAt,walkableWorld,terrainCost} from "../engine/world-map.js";
export function setupWorldMap({getState,onEnter,onExit}){
 const overlay=document.getElementById("worldMapOverlay"),canvas=document.getElementById("strategicMap"),ctx=canvas.getContext("2d");
 document.getElementById("viewport").appendChild(overlay);
 const title=document.getElementById("worldRegionTitle"),desc=document.getElementById("worldRegionDescription");
 const enter=document.getElementById("worldEnterBtn"),travel=document.getElementById("worldTravelBtn");
 let camera={x:WORLD_START.x,y:WORLD_START.y},selected=null,zoom=1.2;
 function active(){return !overlay.hidden;}
 function open(){overlay.hidden=false;camera={...getState().worldPosition};render();}
 function close(){overlay.hidden=true;onExit();}
 function move(dir){
  if(!active())return false;
  const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!d)return false;
  const p=getState().worldPosition,nx=p.x+d[0],ny=p.y+d[1];
  if(!walkableWorld(nx,ny))return false;
  p.x=nx;p.y=ny;camera={...p};selected=siteAt(nx,ny);
  getState().worldTravelMinutes=(getState().worldTravelMinutes||0)+terrainCost(nx,ny);
  render();return true;
 }
 function render(){
  if(!active())return;
  const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
  const w=Math.max(1,rect.width),h=Math.max(1,rect.height),size=18*zoom;
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle="#0a1722";ctx.fillRect(0,0,w,h);
  const p=getState().worldPosition;
  const left=Math.max(0,Math.floor(camera.x-w/(2*size))-1),right=Math.min(WORLD_WIDTH-1,Math.ceil(camera.x+w/(2*size))+1);
  const top=Math.max(0,Math.floor(camera.y-h/(2*size))-1),bottom=Math.min(WORLD_HEIGHT-1,Math.ceil(camera.y+h/(2*size))+1);
  const colors={plains:"#597d4b",meadow:"#709457",forest:"#315c40",mountain:"#77766b",water:"#3b7094"};
  for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){
   const sx=(x-camera.x)*size+w/2,sy=(y-camera.y)*size+h/2;
   ctx.fillStyle=roadAt(x,y)?"#a78c66":colors[worldTile(x,y)]||"#1b2832";
   ctx.fillRect(sx,sy,size+.5,size+.5);
  }
  for(const s of SITES){
   const sx=(s.x-camera.x+.5)*size+w/2,sy=(s.y-camera.y+.5)*size+h/2;
   if(sx<0||sy<0||sx>w||sy>h)continue;
   ctx.fillStyle=SITE_COLORS[s.type];ctx.strokeStyle="#111827";ctx.lineWidth=2;
   ctx.beginPath();ctx.arc(sx,sy,Math.max(6,size*.4),0,Math.PI*2);ctx.fill();ctx.stroke();
   ctx.fillStyle="#fff5d6";ctx.font="bold 12px system-ui";ctx.textAlign="center";ctx.textBaseline="bottom";ctx.fillText(s.name,sx,sy-11);
  }
  const px=(p.x-camera.x+.5)*size+w/2,py=(p.y-camera.y+.5)*size+h/2;
  ctx.fillStyle="#58d5ff";ctx.strokeStyle="#ffffff";ctx.lineWidth=2;ctx.beginPath();ctx.arc(px,py,Math.max(5,size*.32),0,Math.PI*2);ctx.fill();ctx.stroke();
  const here=siteAt(p.x,p.y);title.textContent=here?here.name:"Mapa świata — podróż";
  desc.textContent=here?here.description+" • Naciśnij E, aby wejść.":selected?"Cel: "+selected.name+" — podejdź do znacznika.":"Poruszaj się strzałkami lub WASD. Wejście do lokacji: E.";
  enter.disabled=!here;enter.textContent=here?"Wejdź: "+here.name+" (E)":"Stań na polu lokacji";
  travel.disabled=true;travel.hidden=true;
 }
 function interact(){const p=getState().worldPosition,s=siteAt(p.x,p.y);if(!s)return false;close();onEnter(s);return true;}
 canvas.addEventListener("click",e=>{
  const rect=canvas.getBoundingClientRect(),size=18*zoom;
  const x=Math.floor(camera.x+(e.clientX-rect.left-rect.width/2)/size),y=Math.floor(camera.y+(e.clientY-rect.top-rect.height/2)/size);
  selected=siteAt(x,y);render();
 });
 canvas.addEventListener("wheel",e=>{e.preventDefault();zoom=Math.max(.6,Math.min(2.5,zoom+(e.deltaY<0?.15:-.15)));render();},{passive:false});
 document.getElementById("openWorldMap").addEventListener("click",open);
 document.getElementById("closeWorldMap").addEventListener("click",close);
 enter.addEventListener("click",interact);
 document.getElementById("worldTravelBtn").hidden=true;
 new ResizeObserver(()=>{if(active())render();}).observe(canvas);
 return {open,close,move,interact,render,active};
}
