import {START,mapSize,tileAt,blocked,transitionAt,mapName,COLORS} from "./world.js";
import {saveGame,loadGame} from "../save/storage.js";
import {setupControls} from "../ui/controls.js";
const $=id=>document.getElementById(id),canvas=$("world"),ctx=canvas.getContext("2d");
const state={player:{...START},camera:{x:START.x,y:START.y,zoom:1},clock:{day:1,hour:8,minute:0},controlMode:"dpad",paused:false};
let path=[],toastTimeout=null,drag=null,keyboardTimer=null,keyboardDirection=null;
function notify(message){const el=$("toast");el.textContent=message;el.classList.add("visible");clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove("visible"),2300);}
function updateClock(minutes){let total=state.clock.minute+state.clock.hour*60+(state.clock.day-1)*1440+minutes;
 state.clock.day=Math.floor(total/1440)+1;state.clock.hour=Math.floor(total%1440/60);state.clock.minute=total%60;
}
function hud(){
 const p=state.player;$("location").textContent=mapName(p.map,p.floor);
 $("coordinates").textContent=`Pozycja: ${p.x}, ${p.y} • ${p.map==="overworld"?"Świat":"Wnętrze"}`;
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
  if(t==="tree"){ctx.fillStyle="#1d4229";ctx.beginPath();ctx.arc(sx+size/2,sy+size/2,size*.29,0,Math.PI*2);ctx.fill();}
  if(t==="door"||t.startsWith("stairs")){ctx.fillStyle="#171b27";ctx.font=`${Math.max(12,size*.5)}px system-ui`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(t==="door"?"▣":t.includes("up")?"↑":"↓",sx+size/2,sy+size/2);}
 }
 ctx.strokeStyle="#ffe69b";ctx.lineWidth=Math.max(2,size*.075);ctx.beginPath();
 for(const [i,step] of path.entries()){const sx=(step.x-cx)*size+w/2+size/2,sy=(step.y-cy)*size+h/2+size/2;i?ctx.lineTo(sx,sy):ctx.moveTo(sx,sy);}ctx.stroke();
 const px=(p.x-cx)*size+w/2+size/2,py=(p.y-cy)*size+h/2+size/2;
 ctx.fillStyle="#6dd4fc";ctx.beginPath();ctx.arc(px,py,Math.max(5,size*.32),0,Math.PI*2);ctx.fill();
 ctx.strokeStyle="#e9fbff";ctx.lineWidth=2;ctx.stroke();
 hud();
}
function follow(){state.camera.x=state.player.x+.5;state.camera.y=state.player.y+.5;}
function move(dir,fromPath=false){
 if(!fromPath)path=[];
 const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!d)return false;
 const p=state.player,nx=p.x+d[0],ny=p.y+d[1];
 if(blocked(p.map,p.floor,nx,ny)){if(!fromPath)notify("Droga zablokowana");draw();return false;}
 p.x=nx;p.y=ny;
 const dest=transitionAt(p.map,p.floor,p.x,p.y);
 if(dest){Object.assign(p,dest);path=[];notify(mapName(p.map,p.floor));}
 follow();draw();return true;
}
function findPath(goal){
 const p=state.player,{w,h}=mapSize(p.map);
 if(goal.x<0||goal.y<0||goal.x>=w||goal.y>=h||blocked(p.map,p.floor,goal.x,goal.y))return [];
 const start=p.x+","+p.y,target=goal.x+","+goal.y,queue=[[p.x,p.y]],seen=new Set([start]),parent=new Map();
 for(let i=0;i<queue.length&&i<4000;i++){
  const [x,y]=queue[i],key=x+","+y;if(key===target){
   const result=[];let cur=key;while(cur!==start){const [xx,yy]=cur.split(",").map(Number);result.push({x:xx,y:yy});cur=parent.get(cur);}return result.reverse();
  }
  for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){const nx=x+dx,ny=y+dy,k=nx+","+ny;
   if(!seen.has(k)&&!blocked(p.map,p.floor,nx,ny)){seen.add(k);parent.set(k,key);queue.push([nx,ny]);}
  }
 }return [];
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
 if(!drag.moved){const goal=toTile(e);path=findPath(goal);notify(path.length?`Wyznaczono trasę: ${path.length} pól`:"Brak dostępnej trasy");draw();}
 drag=null;
});
canvas.addEventListener("pointercancel",()=>drag=null);
canvas.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY<0?1:-1);},{passive:false});
function zoom(delta){state.camera.zoom=Math.max(.25,Math.min(3,Math.round((state.camera.zoom+delta*.25)*100)/100));draw();}
$("zoomIn").addEventListener("click",()=>zoom(1));$("zoomOut").addEventListener("click",()=>zoom(-1));$("centerCamera").addEventListener("click",()=>{follow();draw();});
$("saveBtn").addEventListener("click",()=>{const ok=saveGame(state);$("saveStatus").textContent=ok?"Zapisano kampanię lokalnie":"Nie udało się zapisać";notify(ok?"Gra zapisana":"Błąd zapisu");});
function restore(){const data=loadGame();if(!data){notify("Brak zgodnego zapisu");return;}
 if(blocked(data.player.map,data.player.floor,data.player.x,data.player.y)){notify("Nieprawidłowa pozycja zapisu");return;}
 Object.assign(state.player,data.player);Object.assign(state.clock,data.clock);
 state.camera.zoom=Number.isFinite(data.camera?.zoom)?Math.max(.25,Math.min(3,data.camera.zoom)):1;
 state.controlMode=data.controlMode==="joystick"?"joystick":"dpad";state.paused=Boolean(data.paused);
 follow();controls.setMode(state.controlMode);path=[];draw();notify("Wczytano kampanię");
}
$("loadBtn").addEventListener("click",restore);
$("pauseBtn").addEventListener("click",()=>{state.paused=!state.paused;draw();});
$("newBtn").addEventListener("click",()=>{$("confirmNew").showModal();});
$("confirmNew").addEventListener("close",()=>{if($("confirmNew").returnValue!=="confirm")return;
 Object.assign(state.player,START);Object.assign(state.clock,{day:1,hour:8,minute:0});state.paused=false;path=[];follow();draw();notify("Rozpoczęto nową kampanię");
});
$("menuBtn").addEventListener("click",()=>$("sidePanel").classList.toggle("open"));
const controls=setupControls(dir=>move(dir),mode=>{state.controlMode=mode;});
window.addEventListener("keydown",e=>{
 const dir={ArrowUp:"up",KeyW:"up",ArrowDown:"down",KeyS:"down",ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right"}[e.code];
 if(!dir||e.target?.matches("input,select,textarea"))return;e.preventDefault();
 if(keyboardDirection===dir)return;keyboardDirection=dir;clearInterval(keyboardTimer);move(dir);keyboardTimer=setInterval(()=>move(dir),125);
});
window.addEventListener("keyup",e=>{const dir={ArrowUp:"up",KeyW:"up",ArrowDown:"down",KeyS:"down",ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right"}[e.code];
 if(dir===keyboardDirection){keyboardDirection=null;clearInterval(keyboardTimer);}
});
window.addEventListener("blur",()=>{keyboardDirection=null;clearInterval(keyboardTimer);controls.stop();});
setInterval(()=>{if(path.length){const step=path.shift(),p=state.player,dx=step.x-p.x,dy=step.y-p.y;
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
