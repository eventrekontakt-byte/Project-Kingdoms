import {START,mapSize,tileAt,blocked,transitionAt,mapName,COLORS,objectAt,doorAt,defaultDoors} from "./world.js";
import {defaultObjects,interact,interactionNear} from "../systems/interactions.js";
import {saveGame,loadGame} from "../save/storage.js";
import {setupControls} from "../ui/controls.js";
import {findRoute} from "./pathfinding.js";
import {setupWorldMap} from "../ui/world-map.js";
import {WORLD_START,siteAt,siteForMap} from "./world-map.js";
import {CITY_BUILDINGS,cityDoorAt,cityBuildingAt,cityStepAllowed} from "./city-one.js";
const $=id=>document.getElementById(id),canvas=$("world"),ctx=canvas.getContext("2d");
const state={player:{...START},camera:{x:START.x,y:START.y,zoom:1},clock:{day:1,hour:8,minute:0},controlMode:"dpad",paused:false,objects:defaultObjects(),doors:defaultDoors(),worldRegion:"pogranicze",worldPosition:{...WORLD_START},worldTravelMinutes:0};
let path=[],toastTimeout=null,drag=null,keyboardTimer=null,keyboardDirection=null;
function notify(message){const el=$("toast");el.textContent=message;el.classList.add("visible");clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove("visible"),2300);}
function updateClock(minutes){let total=state.clock.minute+state.clock.hour*60+(state.clock.day-1)*1440+minutes;
 state.clock.day=Math.floor(total/1440)+1;state.clock.hour=Math.floor(total%1440/60);state.clock.minute=total%60;
}
function hud(){
 const p=state.player;$("location").textContent=mapName(p.map,p.floor);
 $("coordinates").textContent=strategic?.active()?`Świat: ${state.worldPosition.x}, ${state.worldPosition.y}`:`Pozycja: ${p.x}, ${p.y} • ${siteForMap(p.map)?"Lokacja":"Wnętrze"}`;
 $("clock").textContent=`Dzień ${state.clock.day} • ${String(state.clock.hour).padStart(2,"0")}:${String(state.clock.minute).padStart(2,"0")}${state.paused?" • PAUZA":""}`;
 $("zoomLabel").textContent=Math.round(state.camera.zoom*100)+"%";
 $("pauseBtn").textContent=state.paused?"Wznów":"Pauza";
}
function resize(){const box=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
 canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));
 ctx.setTransform(dpr,0,0,dpr,0,0);draw();
}
function geometry(){return {w:canvas.clientWidth,h:canvas.clientHeight,size:32*state.camera.zoom};}
function draw(){
 const {w,h,size}=geometry();if(!w||!h)return;ctx.clearRect(0,0,w,h);
 const {x:cx,y:cy}=state.camera,p=state.player,{w:mw,h:mh}=mapSize(p.map);
 const left=Math.max(0,Math.floor(cx-w/(2*size))-1),right=Math.min(mw-1,Math.ceil(cx+w/(2*size))+1);
 const top=Math.max(0,Math.floor(cy-h/(2*size))-1),bottom=Math.min(mh-1,Math.ceil(cy+h/(2*size))+1);
 for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){
  const t=tileAt(p.map,p.floor,x,y),sx=Math.floor((x-cx)*size+w/2),sy=Math.floor((y-cy)*size+h/2);
  ctx.fillStyle=COLORS[t]||"#333";ctx.fillRect(sx,sy,Math.ceil(size)+1,Math.ceil(size)+1);
  ctx.strokeStyle="#0a182b38";ctx.strokeRect(sx,sy,size,size);
  if(p.map==="site-city1")drawCityTerrain(ctx,t,x,y,sx,sy,size);
  if(t==="tree"){ctx.fillStyle="#1d4229";ctx.beginPath();ctx.arc(sx+size/2,sy+size/2,size*.29,0,Math.PI*2);ctx.fill();}
  if(t==="object"){const object=objectAt(p.map,p.floor,x,y);const opened=state.objects[object?.id]?.opened;ctx.fillStyle=opened?"#5b4b38":"#d8a45a";ctx.fillRect(sx+size*.2,sy+size*.2,size*.6,size*.6);}
  if(t==="door"){const door=doorAt(p.map,p.floor,x,y);const status=door?(state.doors[door.id]||door.initial):"open";ctx.fillStyle=status==="locked"?"#a63b3b":status==="closed"?"#bc7c36":"#e4b64c";ctx.fillRect(sx+size*.1,sy+size*.1,size*.8,size*.8);}
  if(t==="door"||t.startsWith("stairs")){ctx.fillStyle="#171b27";ctx.font=`${Math.max(12,size*.5)}px system-ui`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(t==="door"?"▣":t.includes("up")?"↑":"↓",sx+size/2,sy+size/2);}
 }
 if(p.map==="site-city1")drawCityLabels(cx,cy,w,h,size);
 ctx.strokeStyle="#ffe69b";ctx.lineWidth=Math.max(2,size*.075);ctx.beginPath();
 for(const [i,step] of path.entries()){const sx=(step.x-cx)*size+w/2+size/2,sy=(step.y-cy)*size+h/2+size/2;i?ctx.lineTo(sx,sy):ctx.moveTo(sx,sy);}ctx.stroke();
 const px=(p.x-cx)*size+w/2+size/2,py=(p.y-cy)*size+h/2+size/2;
 ctx.fillStyle="#6dd4fc";ctx.beginPath();ctx.arc(px,py,Math.max(5,size*.32),0,Math.PI*2);ctx.fill();
 ctx.strokeStyle="#e9fbff";ctx.lineWidth=2;ctx.stroke();
 hud();
}
function drawCityLabels(cx,cy,w,h,size){
 const font=Math.max(10,Math.min(16,size*.48));
 ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="bold "+font+"px system-ui";
 for(const b of CITY_BUILDINGS){
  const [x1,y1,x2,y2]=b.bounds;
  const sx=((x1+x2+1)/2-cx)*size+w/2,sy=((y1+y2+1)/2-cy)*size+h/2;
  if(sx<-130||sx>w+130||sy<-50||sy>h+50)continue;
  const tw=ctx.measureText(b.name).width,pad=5,boxHeight=font+8;
  ctx.fillStyle=b.decorative?"#26303bd9":"#101b28eb";
  ctx.fillRect(sx-tw/2-pad,sy-boxHeight/2,tw+pad*2,boxHeight);
  ctx.fillStyle=b.decorative?"#d1d1ce":"#fff3d2";
  ctx.fillText(b.name,sx,sy);
  if(!b.door)continue;
  const dx=(b.door.x-cx+.5)*size+w/2,dy=(b.door.y-cy+.5)*size+h/2;
  ctx.fillStyle="#f9c45a";
  ctx.fillRect(dx-Math.max(2,size*.25),dy-Math.max(2,size*.25),Math.max(4,size*.5),Math.max(4,size*.5));
 }
}
function drawCityTerrain(ctx,t,x,y,sx,sy,size){
 const seed=(x*37+y*19+x*y*7)%13;
 if(t==="road"){
  ctx.fillStyle=seed%3===0?"#b7a18a":"#a9947d";ctx.fillRect(sx,sy,size,size);
  ctx.strokeStyle="#756b61";ctx.lineWidth=Math.max(.5,size*.025);
  ctx.beginPath();ctx.moveTo(sx,sy+size*.5);ctx.lineTo(sx+size,sy+size*.5);
  ctx.moveTo(sx+size*(seed%2?.3:.65),sy);ctx.lineTo(sx+size*(seed%2?.3:.65),sy+size*.5);ctx.stroke();
 }
 if(t==="wood"){
  ctx.fillStyle=seed%3===0?"#72524a":"#8d6353";ctx.fillRect(sx,sy,size,size);
  ctx.strokeStyle="#c79a78";ctx.lineWidth=Math.max(.6,size*.035);
  ctx.beginPath();ctx.moveTo(sx,sy+size*.2);ctx.lineTo(sx+size,sy+size*.2);ctx.moveTo(sx,sy+size*.8);ctx.lineTo(sx+size,sy+size*.8);ctx.stroke();
 }
 if(t==="rampart"){
  ctx.fillStyle="#a7a59c";ctx.fillRect(sx,sy,size,size);
  ctx.strokeStyle="#555c59";ctx.lineWidth=Math.max(.7,size*.08);ctx.strokeRect(sx+size*.1,sy+size*.1,size*.8,size*.8);
 }
 if(t==="wall"){
  const building=cityBuildingAt(x,y);
  if(building){
   const [x1,y1,x2,y2]=building.bounds;
   const edge=x===x1||x===x2||y===y1||y===y2;
   ctx.fillStyle=edge?"#77726c":building.external?"#826a52":"#946957";ctx.fillRect(sx,sy,size,size);
   ctx.strokeStyle=edge?"#c1b6a4":"#b99179";ctx.lineWidth=Math.max(.6,size*.035);
   ctx.beginPath();ctx.moveTo(sx,sy+size*.2);ctx.lineTo(sx+size,sy+size*.2);ctx.moveTo(sx,sy+size*.7);ctx.lineTo(sx+size,sy+size*.7);ctx.stroke();
   return;
  }
  ctx.fillStyle="#85837c";ctx.fillRect(sx,sy,size,size);
  ctx.strokeStyle="#575851";ctx.lineWidth=Math.max(.7,size*.04);
  ctx.strokeRect(sx+size*.07,sy+size*.12,size*.86,size*.75);
  ctx.beginPath();ctx.moveTo(sx,sy+size*.5);ctx.lineTo(sx+size,sy+size*.5);ctx.stroke();
 }
 if(t==="grass"||t==="meadow"){
  ctx.fillStyle=seed<5?"#628350":"#577949";ctx.fillRect(sx,sy,size,size);
  if(size>=12){ctx.strokeStyle="#8da368";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+size*.4,sy+size*.6);ctx.lineTo(sx+size*.5,sy+size*.38);ctx.stroke();}
 }
}
function follow(){state.camera.x=state.player.x+.5;state.camera.y=state.player.y+.5;}
function move(dir,fromPath=false){
 if(strategic?.active())return strategic.move(dir);
 if(!fromPath)path=[];
 const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!d)return false;
 const p=state.player,nx=p.x+d[0],ny=p.y+d[1];
 const door=doorAt(p.map,p.floor,nx,ny);if(door&&(state.doors[door.id]||door.initial)!=="open"){if(!fromPath)notify(door.name+": użyj Zbadaj / Otwórz (E)");path=[];draw();return false;}
 const bounds=mapSize(p.map);
 if(siteForMap(p.map)&&(nx<0||ny<0||nx>=bounds.w||ny>=bounds.h)){
  path=[];strategic.open();notify("Opuszczono lokację — mapa świata");return true;
 }
 if((p.map==="site-city1"&&!cityStepAllowed(p.x,p.y,nx,ny))||blocked(p.map,p.floor,nx,ny)){if(!fromPath)notify("Droga zablokowana");draw();return false;}
 p.x=nx;p.y=ny;
 const dest=transitionAt(p.map,p.floor,p.x,p.y);
 if(dest){Object.assign(p,dest);path=[];notify(mapName(p.map,p.floor));}
 follow();draw();return true;
}
function findPath(goal){
 if(!$("worldMapOverlay").hidden)return [];
 const result=findRoute(state.player,goal,state.doors);
 if(result.reason)notify(result.reason);
 return result.path;
}
function toTile(e){const rect=canvas.getBoundingClientRect(),{size}=geometry();return {
 x:Math.floor(state.camera.x+(e.clientX-rect.left-rect.width/2)/size),
 y:Math.floor(state.camera.y+(e.clientY-rect.top-rect.height/2)/size)
};}
canvas.addEventListener("pointerdown",e=>{drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener("pointermove",e=>{if(!drag||drag.id!==e.pointerId)return;
 const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
 if(Math.abs(dx)+Math.abs(dy)>3){drag.moved=true;const {size}=geometry();state.camera.x-=dx/size;state.camera.y-=dy/size;draw();}
 drag.x=e.clientX;drag.y=e.clientY;
});
canvas.addEventListener("pointerup",e=>{if(!drag||drag.id!==e.pointerId)return;
 if(!drag.moved){const goal=toTile(e);path=findPath(goal);if(path.length)notify(`Wyznaczono trasę: ${path.length} pól`);draw();}
 drag=null;
});
canvas.addEventListener("pointercancel",()=>drag=null);
canvas.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY<0?1:-1);},{passive:false});
function zoom(delta){state.camera.zoom=Math.max(.25,Math.min(3,Math.round((state.camera.zoom+delta*.25)*100)/100));draw();}
$("zoomIn").addEventListener("click",()=>zoom(1));$("zoomOut").addEventListener("click",()=>zoom(-1));$("centerCamera").addEventListener("click",()=>{follow();draw();});
$("saveBtn").addEventListener("click",()=>{state.worldMode=strategic.active();const ok=saveGame(state);$("saveStatus").textContent=ok?"Zapisano kampanię lokalnie":"Nie udało się zapisać";notify(ok?"Gra zapisana":"Błąd zapisu");});
function restore(){const data=loadGame();if(!data){notify("Brak zgodnego zapisu");return;}
 if(blocked(data.player.map,data.player.floor,data.player.x,data.player.y)){notify("Nieprawidłowa pozycja zapisu");return;}
 Object.assign(state.player,data.player);Object.assign(state.clock,data.clock);state.objects=data.objects||defaultObjects();state.doors=data.doors||defaultDoors();state.worldRegion="pogranicze";state.worldPosition=data.worldPosition&&Number.isInteger(data.worldPosition.x)&&Number.isInteger(data.worldPosition.y)?{...data.worldPosition}:{...WORLD_START};state.worldTravelMinutes=data.worldTravelMinutes||0;
 state.camera.zoom=Number.isFinite(data.camera?.zoom)?Math.max(.25,Math.min(3,data.camera.zoom)):1;
 state.controlMode=data.controlMode==="joystick"?"joystick":"dpad";state.paused=Boolean(data.paused);
 follow();controls.setMode(state.controlMode);path=[];draw();if(data.worldMode)strategic.open();else strategic.close();notify("Wczytano kampanię");
}
$("loadBtn").addEventListener("click",restore);
$("pauseBtn").addEventListener("click",()=>{state.paused=!state.paused;draw();});
$("newBtn").addEventListener("click",()=>{$("confirmNew").showModal();});
$("confirmNew").addEventListener("close",()=>{if($("confirmNew").returnValue!=="confirm")return;
 Object.assign(state.player,START);Object.assign(state.clock,{day:1,hour:8,minute:0});state.objects=defaultObjects();state.doors=defaultDoors();state.worldRegion="pogranicze";state.worldPosition={...WORLD_START};state.worldTravelMinutes=0;state.paused=false;document.getElementById("worldMapOverlay").hidden=true;path=[];follow();draw();notify("Rozpoczęto nową kampanię");
});
$("menuBtn").addEventListener("click",()=>$("sidePanel").classList.toggle("open"));
const visitPoints={keep:{x:24,y:21},house:{x:34,y:12},inn:{x:38,y:23},warehouse:{x:10,y:31}};
document.querySelectorAll("[data-visit]").forEach(button=>button.addEventListener("click",()=>{
 const point=visitPoints[button.dataset.visit];if(!point)return;
 Object.assign(state.player,{map:"overworld",floor:0,...point});path=[];follow();draw();
 $("sidePanel").classList.remove("open");notify("Podejdź do żółtych drzwi, aby wejść.");
}));
function performInteraction(){if(strategic.active()){if(!strategic.interact())notify("Podejdź do oznaczonej lokacji, aby wejść.");return;}
 if(state.player.map==="site-city1"){
  const p=state.player,building=CITY_BUILDINGS.find(b=>b.door&&Math.abs(b.door.x-p.x)+Math.abs(b.door.y-p.y)<=1);
  if(building){const dest=transitionAt(p.map,p.floor,building.door.x,building.door.y);if(dest){Object.assign(p,dest);path=[];follow();draw();notify("Wejście: "+building.name);return;}}
 }
 notify(interact(state));path=[];draw();}
$("interactBtn").addEventListener("click",performInteraction);
$("interactMobile").addEventListener("click",performInteraction);
const strategic=setupWorldMap({
 getState:()=>state,
 onEnter:site=>{
  Object.assign(state.player,{map:site.map,floor:0,x:site.map==="site-city1"?55:32,y:site.map==="site-city1"?76:22});
  state.worldPosition={x:site.x,y:site.y};path=[];follow();draw();
  notify("Wejście: "+site.name);
 },
 onExit:()=>{follow();draw();},
 onStep:minutes=>{updateClock(minutes);hud();}
});
$("worldMapMobile").addEventListener("click",()=>$("openWorldMap").click());
const controls=setupControls(dir=>move(dir),mode=>{state.controlMode=mode;});
window.addEventListener("keydown",e=>{
 if(e.code==="Escape"&&!e.repeat&&strategic.active()){e.preventDefault();strategic.close();return;}
 if(e.code==="KeyM"&&!e.repeat&&!e.target?.matches("input,select,textarea")){e.preventDefault();if(strategic.active())strategic.close();else strategic.open();return;}
 if(e.code==="KeyE"&&!e.repeat&&!e.target?.matches("input,select,textarea")){e.preventDefault();performInteraction();return;}
 const dir={ArrowUp:"up",KeyW:"up",ArrowDown:"down",KeyS:"down",ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right"}[e.code];
 if(!dir||e.target?.matches("input,select,textarea"))return;e.preventDefault();
 if(keyboardDirection===dir)return;keyboardDirection=dir;clearInterval(keyboardTimer);move(dir);keyboardTimer=setInterval(()=>move(dir),125);
});
window.addEventListener("keyup",e=>{const dir={ArrowUp:"up",KeyW:"up",ArrowDown:"down",KeyS:"down",ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right"}[e.code];
 if(dir===keyboardDirection){keyboardDirection=null;clearInterval(keyboardTimer);}
});
window.addEventListener("blur",()=>{keyboardDirection=null;clearInterval(keyboardTimer);controls.stop();});
setInterval(()=>{if(path.length&&!strategic.active()){const step=path.shift(),p=state.player,dx=step.x-p.x,dy=step.y-p.y;
  const dir=dx===1&&dy===0?"right":dx===-1&&dy===0?"left":dy===1&&dx===0?"down":dy===-1&&dx===0?"up":null;
  if(!dir||!move(dir,true))path=[];
 }},145);
setInterval(()=>{if(!state.paused){updateClock(1);hud();}},1000);
new ResizeObserver(resize).observe(canvas);
follow();resize();
if("serviceWorker" in navigator){
 let reloadedForUpdate=false;
 navigator.serviceWorker.addEventListener("controllerchange",()=>{
  if(!reloadedForUpdate){reloadedForUpdate=true;window.location.reload();}
 });
 window.addEventListener("load",async()=>{
  try{
   const registration=await navigator.serviceWorker.register("./service-worker.js",{updateViaCache:"none"});
   await registration.update();
  }catch(error){console.warn("Aktualizacja offline niedostępna",error);}
 });
}
