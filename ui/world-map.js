import {WORLD_WIDTH,WORLD_HEIGHT,SITES,WORLD_START,SITE_COLORS,siteAt,worldTile,roadAt,walkableWorld,terrainCost,factionAt,borderAt,FACTIONS} from "../engine/world-map.js";
export function setupWorldMap({getState,onEnter,onExit,onStep}){
 const overlay=document.getElementById("worldMapOverlay"),canvas=document.getElementById("strategicMap"),ctx=canvas.getContext("2d");
 document.getElementById("viewport").appendChild(overlay);
 const title=document.getElementById("worldRegionTitle"),desc=document.getElementById("worldRegionDescription");
 const enter=document.getElementById("worldEnterBtn"),travel=document.getElementById("worldTravelBtn");
 let camera={x:WORLD_START.x,y:WORLD_START.y},selected=null,zoom=1.2,route=[],drag=null,pointers=new Map(),pinchDistance=0,followPlayer=true;
 function active(){return !overlay.hidden;}
 function open(){overlay.hidden=false;route=[];camera={...getState().worldPosition};followPlayer=true;render();}
 function close(){overlay.hidden=true;route=[];onExit();}
 function move(dir,auto=false){
  if(!auto)route=[];
  if(!active())return false;
  const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!d)return false;
  const p=getState().worldPosition,nx=p.x+d[0],ny=p.y+d[1];
  if(!walkableWorld(nx,ny))return false;
  p.x=nx;p.y=ny;if(followPlayer)camera={...p};selected=siteAt(nx,ny);
  const minutes=terrainCost(nx,ny);getState().worldTravelMinutes=(getState().worldTravelMinutes||0)+minutes;onStep(minutes);
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
   const faction=factionAt(x,y);if(faction){ctx.fillStyle=faction==="north"?"#6d9dc824":"#d6a46824";ctx.fillRect(sx,sy,size+.5,size+.5);}
   if(borderAt(x,y)&&size>=5){ctx.strokeStyle="#e8d7a38a";ctx.lineWidth=Math.max(1,size*.08);ctx.strokeRect(sx+1,sy+1,size-2,size-2);}
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
  ctx.strokeStyle="#f5df9c";ctx.lineWidth=2;ctx.beginPath();route.forEach((step,i)=>{const sx=(step.x-camera.x+.5)*size+w/2,sy=(step.y-camera.y+.5)*size+h/2;i?ctx.lineTo(sx,sy):ctx.moveTo(sx,sy);});ctx.stroke();
  const here=siteAt(p.x,p.y);title.textContent=here?here.name:"Mapa świata — podróż";
  const faction=factionAt(p.x,p.y);const territory=faction?FACTIONS.find(f=>f.id===faction)?.name:"Ziemie neutralne";
  desc.textContent=(here?here.description+" • Naciśnij E, aby wejść.":selected?"Cel: "+selected.name+" — podejdź do znacznika.":"Poruszaj się strzałkami lub WASD. Wejście do lokacji: E.")+" • Terytorium: "+territory;
  enter.disabled=!here;enter.textContent=here?"Wejdź: "+here.name+" (E)":"Stań na polu lokacji";
  travel.disabled=true;travel.hidden=true;
 }
 function interact(){const p=getState().worldPosition,s=siteAt(p.x,p.y);if(!s)return false;close();onEnter(s);return true;}
 function zoomBy(delta){zoom=Math.max(.35,Math.min(3.5,Math.round((zoom+delta)*100)/100));render();}
 function center(){camera={...getState().worldPosition};followPlayer=true;render();}
 function screenToTile(clientX,clientY){const rect=canvas.getBoundingClientRect(),size=18*zoom;return {x:Math.floor(camera.x+(clientX-rect.left-rect.width/2)/size),y:Math.floor(camera.y+(clientY-rect.top-rect.height/2)/size)};}
 canvas.addEventListener("pointerdown",e=>{
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
  if(pointers.size>1){drag.moved=true;const p=[...pointers.values()];pinchDistance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
  canvas.setPointerCapture(e.pointerId);
 });
 canvas.addEventListener("pointermove",e=>{
  if(!pointers.has(e.pointerId))return;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pointers.size>=2){const p=[...pointers.values()],distance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(pinchDistance>0)zoomBy((distance-pinchDistance)/250);pinchDistance=distance;if(drag)drag.moved=true;return;}
  if(!drag||drag.id!==e.pointerId)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(Math.abs(dx)+Math.abs(dy)>3){drag.moved=true;followPlayer=false;camera.x=Math.max(0,Math.min(WORLD_WIDTH-1,camera.x-dx/(18*zoom)));camera.y=Math.max(0,Math.min(WORLD_HEIGHT-1,camera.y-dy/(18*zoom)));render();}
  drag.x=e.clientX;drag.y=e.clientY;
 });
 canvas.addEventListener("pointerup",e=>{
  const wasSingle=pointers.size===1;
  pointers.delete(e.pointerId);
  if(wasSingle&&drag&&!drag.moved){
   const {x,y}=screenToTile(e.clientX,e.clientY);selected=siteAt(x,y);
   if(walkableWorld(x,y)){route=findWorldPath(getState().worldPosition,{x,y});followPlayer=true;}
   render();
  }
  drag=null;if(pointers.size<2)pinchDistance=0;
 });
 canvas.addEventListener("pointercancel",e=>{pointers.delete(e.pointerId);drag=null;pinchDistance=0;});
 canvas.addEventListener("wheel",e=>{e.preventDefault();zoomBy(e.deltaY<0?.15:-.15);},{passive:false});
 document.getElementById("worldZoomIn").addEventListener("click",()=>zoomBy(.2));
 document.getElementById("worldZoomOut").addEventListener("click",()=>zoomBy(-.2));
 document.getElementById("worldCenter").addEventListener("click",center);
 document.getElementById("openWorldMap").addEventListener("click",open);
 document.getElementById("closeWorldMap").addEventListener("click",close);
 enter.addEventListener("click",interact);
 document.getElementById("worldTravelBtn").hidden=true;
 new ResizeObserver(()=>{if(active())render();}).observe(canvas);
 setInterval(()=>{if(!active()||!route.length)return;const next=route.shift(),p=getState().worldPosition;const dir=next.x>p.x?"right":next.x<p.x?"left":next.y>p.y?"down":"up";if(!move(dir,true))route=[];},115);
 return {open,close,move,interact,render,active,zoomBy,center};
}

function findWorldPath(start,goal){
 const key=(x,y)=>x+","+y,open=[{...start,g:0,f:0}],best=new Map([[key(start.x,start.y),0]]),parent=new Map();
 const heuristic=(x,y)=>Math.abs(goal.x-x)+Math.abs(goal.y-y);
 for(let i=0;open.length&&i<15000;i++){
  open.sort((a,b)=>a.f-b.f);const p=open.shift(),k=key(p.x,p.y);
  if(p.g!==best.get(k))continue;
  if(p.x===goal.x&&p.y===goal.y){const path=[];let at=k;while(at!==key(start.x,start.y)){const [x,y]=at.split(",").map(Number);path.push({x,y});at=parent.get(at);}return path.reverse();}
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const x=p.x+dx,y=p.y+dy;if(!walkableWorld(x,y))continue;
   const nkey=key(x,y),g=p.g+terrainCost(x,y);
   if(g>=(best.get(nkey)??Infinity))continue;
   best.set(nkey,g);parent.set(nkey,k);open.push({x,y,g,f:g+heuristic(x,y)});
  }
 }
 return [];
}
