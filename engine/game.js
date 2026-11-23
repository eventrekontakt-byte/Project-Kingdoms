import {createNPCs,stepNPCs,visibleNPCs,nearestNPC,npcGreeting,npcDialogue,npcMoving,exportNPCState,restoreNPCState} from "./npcs.js?v=0.3.22";
import {interiorFurniture} from "./city-interiors.js?v=0.3.13";
import {TAVERN_MAP,tavernFurniture,tavernDecor} from "./interiors/templates.js?v=0.3.12";
import {START,mapSize,tileAt,blocked,transitionAt,mapName,COLORS,objectAt,doorAt,defaultDoors} from "./world.js";
import {defaultObjects,interact,interactionNear,objectActions,useObject} from "../systems/interactions.js";
import {saveGame,loadGame} from "../save/storage.js?v=0.3.22";
import {setupControls} from "../ui/controls.js";
import {findRoute} from "./pathfinding.js?v=0.3.21";
import {setupWorldMap} from "../ui/world-map.js";
import {WORLD_START,siteAt,siteForMap} from "./world-map.js";
import {CITY_BUILDINGS,CITY_GATES,cityDoorAt,cityBuildingAt,cityStepAllowed,cityGateBarrierAt,cityGateControlNear} from "./city-one.js";
import {CITY_PLOTS,plotAt,plotStatus,parcelSummary} from "./plots.js?v=0.3.14";
import {elevationAt,elevationTransition,buildingRoofLevel,ELEVATION_UNIT_METERS,resolveSurfaceStep} from "./elevation.js?v=0.3.12";
const $=id=>document.getElementById(id),canvas=$("world"),ctx=canvas.getContext("2d");
const state={player:{...START,z:0},camera:{x:START.x,y:START.y,zoom:1},clock:{day:1,hour:8,minute:0},controlMode:"dpad",paused:false,objects:defaultObjects(),doors:defaultDoors(),worldRegion:"pogranicze",worldPosition:{...WORLD_START},worldTravelMinutes:0,inventory:[],buildingEdits:{},plotEdits:{},plotMode:false,selectedPlot:null,gateStates:{},crimes:0,reputation:0};
const npcs=createNPCs();state.npcs=npcs;
let activeNpc=null;
let path=[],toastTimeout=null,drag=null,keyboardTimer=null,keyboardDirection=null;
// VIS 1.0: authoritative tile coordinates stay integer; visual coordinates interpolate.
const visual={x:START.x+.5,y:START.y+.5,map:START.map,floor:START.floor,
 fromX:START.x+.5,fromY:START.y+.5,toX:START.x+.5,toY:START.y+.5,
 started:0,duration:150,active:false,cameraTargetX:START.x+.5,cameraTargetY:START.y+.5,
 manualPan:false,lastFrame:0,lastPaint:0};
const VIS={stepMs:150,cameraResponse:10,deadZoneX:.9,deadZoneY:.65};
function snapVisual(){
 const p=state.player;visual.map=p.map;visual.floor=p.floor;
 visual.x=visual.fromX=visual.toX=p.x+.5;visual.y=visual.fromY=visual.toY=p.y+.5;
 visual.z=visual.fromZ=visual.toZ=Number.isInteger(p.z)?p.z:elevationAt(p.map,p.x,p.y,p.floor);
 visual.active=false;visual.cameraTargetX=visual.x;visual.cameraTargetY=visual.y;
 visual.manualPan=false;state.camera.x=visual.x;state.camera.y=visual.y;
}
function startVisualStep(previous,now=performance.now()){
 const p=state.player;
 if(previous.map!==p.map||previous.floor!==p.floor){snapVisual();return;}
 // Use current rendered position as the start of a new step; rapid input never teleports.
 visual.fromX=visual.x;visual.fromY=visual.y;
 visual.fromZ=Number.isFinite(visual.z)?visual.z:(previous.z??elevationAt(previous.map,previous.x,previous.y,previous.floor));
 visual.toZ=Number.isInteger(p.z)?p.z:elevationAt(p.map,p.x,p.y,p.floor);
 visual.toX=p.x+.5;visual.toY=p.y+.5;
 visual.started=now;visual.duration=VIS.stepMs;visual.active=true;
 visual.manualPan=false;
}
function animateVisual(now){
 const dt=visual.lastFrame?Math.min(.05,(now-visual.lastFrame)/1000):1/60;
 visual.lastFrame=now;
 const p=state.player;
 if(visual.map!==p.map||visual.floor!==p.floor){snapVisual();}
 if(visual.active){
  const t=Math.min(1,(now-visual.started)/visual.duration);
  const eased=t*t*(3-2*t);
  visual.x=visual.fromX+(visual.toX-visual.fromX)*eased;
  visual.y=visual.fromY+(visual.toY-visual.fromY)*eased;
  visual.z=visual.fromZ+(visual.toZ-visual.fromZ)*eased;
  if(t>=1)visual.active=false;
 }
 if(!visual.manualPan){
  const dx=visual.x-visual.cameraTargetX,dy=visual.y-visual.cameraTargetY;
  if(Math.abs(dx)>VIS.deadZoneX)visual.cameraTargetX=visual.x-Math.sign(dx)*VIS.deadZoneX;
  if(Math.abs(dy)>VIS.deadZoneY)visual.cameraTargetY=visual.y-Math.sign(dy)*VIS.deadZoneY;
  const a=1-Math.exp(-VIS.cameraResponse*dt);
  state.camera.x+=(visual.cameraTargetX-state.camera.x)*a;
  state.camera.y+=(visual.cameraTargetY-state.camera.y)*a;
 }
 // Do not redraw an idle map 60 times per second on mobile.
 const cameraMoving=Math.abs(visual.cameraTargetX-state.camera.x)+Math.abs(visual.cameraTargetY-state.camera.y)>.002;
 if((visual.active||cameraMoving||npcMoving(npcs,p,now))&&now-visual.lastPaint>=40){draw();visual.lastPaint=now;}
 requestAnimationFrame(animateVisual);
}
function notify(message){const el=$("toast");el.textContent=message;el.classList.add("visible");clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove("visible"),2300);}
function updateClock(minutes){let total=state.clock.minute+state.clock.hour*60+(state.clock.day-1)*1440+minutes;
 state.clock.day=Math.floor(total/1440)+1;state.clock.hour=Math.floor(total%1440/60);state.clock.minute=total%60;
}
function hud(){
 const p=state.player;$("location").textContent=mapName(p.map,p.floor);
 $("coordinates").textContent=strategic?.active()?`Świat: ${state.worldPosition.x}, ${state.worldPosition.y}`:`Pozycja: ${p.x}, ${p.y} • ${siteForMap(p.map)?"Lokacja":"Wnętrze"}`;
 if(p.map==="site-city1")$("coordinates").textContent+=` • poziom Z=${(p.z??elevationAt(p.map,p.x,p.y,p.floor))} (${((p.z??elevationAt(p.map,p.x,p.y,p.floor))*ELEVATION_UNIT_METERS).toFixed(1)} m)`;
 $("clock").textContent=`Dzień ${state.clock.day} • ${String(state.clock.hour).padStart(2,"0")}:${String(state.clock.minute).padStart(2,"0")}${state.paused?" • PAUZA":""}`;
 $("zoomLabel").textContent=Math.round(state.camera.zoom*100)+"%";
 if(p.map==="interior-city1-karczma")$("coordinates").textContent=`Karczma: ${p.x},${p.y} • piętro ${p.floor} • mapa ${mapSize(p.map).w}×${mapSize(p.map).h}`;
 $("pauseBtn").textContent=state.paused?"Wznów":"Pauza";
}
function resize(){const box=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
 canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));
 ctx.setTransform(dpr,0,0,dpr,0,0);draw();
}
function geometry(){return {w:canvas.clientWidth,h:canvas.clientHeight,size:32*state.camera.zoom};}
function ensureValidPosition(){
 const p=state.player,{w,h}=mapSize(p.map);
 if(p.map==="site-city1"&&(!Number.isInteger(p.x)||!Number.isInteger(p.y)||p.x<0||p.y<0||p.x>=w||p.y>=h||blocked(p.map,p.floor,p.x,p.y))){
  Object.assign(p,{x:96,y:132,z:0});path=[];snapVisual();notify("Przeniesiono bohatera na bezpieczną drogę nowego miasta.");
 }
 if(p.map===TAVERN_MAP&&(p.floor<0||p.floor>=3||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<1||p.x>=w-1||p.y<1||p.y>=h-1||blocked(p.map,p.floor,p.x,p.y))){
  Object.assign(p,{floor:0,x:16,y:25});
  snapVisual();path=[];
  notify("Poprawiono pozycję bohatera w karczmie.");
 }
}
function draw(){
 ensureValidPosition();
 if(!Number.isInteger(state.player.z))state.player.z=elevationAt(state.player.map,state.player.x,state.player.y,state.player.floor);
 const {w,h,size}=geometry();if(!w||!h)return;ctx.clearRect(0,0,w,h);
 const p=state.player;
 const {x:cx,y:cy}=state.camera,{w:mw,h:mh}=mapSize(p.map);
 const left=Math.max(0,Math.floor(cx-w/(2*size))-1),right=Math.min(mw-1,Math.ceil(cx+w/(2*size))+1);
 const top=Math.max(0,Math.floor(cy-h/(2*size))-1),bottom=Math.min(mh-1,Math.ceil(cy+h/(2*size))+1);
 for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){
  const t=tileAt(p.map,p.floor,x,y),sx=Math.floor((x-cx)*size+w/2),sy=Math.floor((y-cy)*size+h/2);
  ctx.fillStyle=COLORS[t]||"#333";ctx.fillRect(sx,sy,Math.ceil(size)+1,Math.ceil(size)+1);
  ctx.strokeStyle="#0a182b38";ctx.strokeRect(sx,sy,size,size);
  if(p.map==="site-city1")drawCityTerrain(ctx,t,x,y,sx,sy,size);
  if(t==="tree"){ctx.fillStyle="#1d4229";ctx.beginPath();ctx.arc(sx+size/2,sy+size/2,size*.29,0,Math.PI*2);ctx.fill();}
  if(t==="object"&&p.map!==TAVERN_MAP){const object=objectAt(p.map,p.floor,x,y);const opened=state.objects[object?.id]?.opened;ctx.fillStyle=opened?"#5b4b38":"#d8a45a";ctx.fillRect(sx+size*.2,sy+size*.2,size*.6,size*.6);}
  if(t==="door"){const door=doorAt(p.map,p.floor,x,y);const status=door?(state.doors[door.id]||door.initial):"open";ctx.fillStyle=status==="locked"?"#a63b3b":status==="closed"?"#bc7c36":"#e4b64c";ctx.fillRect(sx+size*.1,sy+size*.1,size*.8,size*.8);}
  if(t==="door"||t.startsWith("stairs")){ctx.fillStyle="#171b27";ctx.font=`${Math.max(12,size*.5)}px system-ui`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(t==="door"?"▣":t.includes("up")?"↑":"↓",sx+size/2,sy+size/2);}
 }
 if(p.map===TAVERN_MAP){drawTavernDecor(p.floor,cx,cy,w,h,size);drawTavernFurniture(p.floor,cx,cy,w,h,size);}
 if(p.map.startsWith("interior-city1-")&&p.map!==TAVERN_MAP){
  for(const o of interiorFurniture(p.map)){
   const x=(o.x-cx)*size+w/2,y=(o.y-cy)*size+h/2,fw=o.w*size,fh=o.h*size;
   if(x+fw<0||y+fh<0||x>w||y>h)continue;
   ctx.fillStyle=o.type==="bed"?"#5d8192":o.type==="table"?"#9e7045":o.type==="shelf"?"#755138":"#9a6638";
   ctx.fillRect(x+size*.08,y+size*.08,fw-size*.16,fh-size*.16);
   ctx.strokeStyle="#382a22";ctx.lineWidth=Math.max(1,size*.06);ctx.strokeRect(x+size*.08,y+size*.08,fw-size*.16,fh-size*.16);
   if(o.type==="bed"){ctx.fillStyle="#dfd3b5";ctx.fillRect(x+size*.22,y+size*.18,fw-size*.44,size*.5);}
   else if(o.type==="shelf"||o.type==="crate"){ctx.strokeStyle="#c9a06b";for(let i=1;i<o.w;i++){ctx.beginPath();ctx.moveTo(x+i*size,y+size*.15);ctx.lineTo(x+i*size,y+fh-size*.15);ctx.stroke();}}
  }
 }
 if(p.map==="site-city1"){drawCityElevation(cx,cy,w,h,size);drawRampartDetails(cx,cy,w,h,size);drawCityGates(cx,cy,w,h,size);if(state.plotMode)drawPlotOverlay(cx,cy,w,h,size);drawCityLabels(cx,cy,w,h,size);}
 drawNPCs(cx,cy,w,h,size);
 ctx.strokeStyle="#ffe69b";ctx.lineWidth=Math.max(2,size*.075);ctx.beginPath();
 for(const [i,step] of path.entries()){const sx=(step.x-cx)*size+w/2+size/2,sy=(step.y-cy)*size+h/2+size/2;i?ctx.lineTo(sx,sy):ctx.moveTo(sx,sy);}ctx.stroke();
 const px=(visual.x-cx)*size+w/2,py=(visual.y-cy)*size+h/2;
 const visualZ=Number.isFinite(visual.z)?visual.z:(p.z??elevationAt(p.map,p.x,p.y,p.floor));
 const elevated=p.map==="site-city1"&&visualZ>0;
 if(elevated){
  // Ground-level shadow displaced from the player: visual height, no halo.
  ctx.fillStyle="#0a162466";ctx.beginPath();
  ctx.ellipse(px+size*.18,py+size*.18,Math.max(5,size*.29),Math.max(3,size*.12),0,0,Math.PI*2);ctx.fill();
 }
 ctx.fillStyle=elevated?"#9be7ff":"#6dd4fc";ctx.beginPath();ctx.arc(px,py-(p.map==="site-city1"?visualZ*size*.07:0),Math.max(5,size*.32),0,Math.PI*2);ctx.fill();
 ctx.strokeStyle="#e9fbff";ctx.lineWidth=2;ctx.stroke();
 hud();
}
// Decorations are rendered behind furniture; rugs and stairs do not block movement.
// Directional, mobile-friendly miniature character sprites (no external image files).
function drawNPCs(cx,cy,w,h,size){
 const now=performance.now();
 for(const n of visibleNPCs(npcs,state.player)){
  const walking=n.started>=0&&now<n.started+n.duration;
  const t=walking?Math.min(1,(now-n.started)/n.duration):1;
  const smooth=t*t*(3-2*t);
  const x=walking?n.fromX+(n.x-n.fromX)*smooth:n.x;
  const y=walking?n.fromY+(n.y-n.fromY)*smooth:n.y;
  const sx=(x+.5-cx)*size+w/2,sy=(y+.5-cy)*size+h/2;
  if(sx<-size||sy<-size||sx>w+size||sy>h+size)continue;
  const bob=walking?Math.abs(Math.sin(t*Math.PI*2))*1.25:0;
  const stride=walking?Math.sin(t*Math.PI*2)*2.6:0;
  const scale=Math.max(7,Math.min(size*.88,30))/24;
  ctx.save();ctx.translate(sx,sy);ctx.scale(scale,scale);ctx.lineCap="round";
  // Ground shadow beneath the moving feet.
  ctx.fillStyle="#07141b80";ctx.beginPath();ctx.ellipse(0,10,8,2.6,0,0,Math.PI*2);ctx.fill();
  const facing=n.direction||"down",faceDown=facing==="down",faceUp=facing==="up";
  const side=facing==="right"?1:facing==="left"?-1:0;
  ctx.strokeStyle="#332b29";ctx.lineWidth=3.6;
  ctx.beginPath();ctx.moveTo(-3,6-bob);ctx.lineTo(-3-stride,10);ctx.moveTo(3,6-bob);ctx.lineTo(3+stride,10);ctx.stroke();
  ctx.fillStyle=n.color;ctx.strokeStyle="#29333b";ctx.lineWidth=1;
  ctx.fillRect(-6,-2-bob,12,10);ctx.strokeRect(-6,-2-bob,12,10);
  // Arms shift opposite to the stepping leg.
  ctx.strokeStyle=n.skin||"#dfb58d";ctx.lineWidth=3.2;
  ctx.beginPath();ctx.moveTo(-6,0-bob);ctx.lineTo(-8+stride*.45,5-bob);
  ctx.moveTo(6,0-bob);ctx.lineTo(8-stride*.45,5-bob);ctx.stroke();
  ctx.fillStyle=n.skin||"#e0b38a";ctx.beginPath();ctx.arc(side*1,-7-bob,5.3,0,Math.PI*2);ctx.fill();
  // Hair/helmet/cap denotes profession rather than a plain colored dot.
  const helmet=n.role==="Strażnik",cap=n.role==="Kupiec"||n.role==="Posłaniec";
  ctx.fillStyle=helmet?"#8e9da6":cap?"#754a34":"#463b32";
  ctx.beginPath();ctx.arc(side*1,-9.7-bob,5.3,Math.PI,Math.PI*2);ctx.fill();
  if(helmet){ctx.fillStyle="#bfcbd0";ctx.fillRect(-5,-11.5-bob,10,2);}
  if(cap){ctx.fillRect(side-6,-12-bob,12,2.2);}
  ctx.fillStyle="#1d2429";
  if(!faceUp){
   if(side!==0){ctx.fillRect(side*4-1,-7-bob,1.5,1.5);}
   else{ctx.fillRect(-3,-7-bob,1.3,1.3);ctx.fillRect(2,-7-bob,1.3,1.3);}
  }else{ctx.fillStyle="#322b2b";ctx.fillRect(-3,-9-bob,6,1);}
  if(n.important){ctx.strokeStyle="#f5d692";ctx.lineWidth=.85;ctx.strokeRect(-7,-14-bob,14,24);}
  ctx.restore();
  if(size>=21&&(n.important||Math.abs(n.x-state.player.x)+Math.abs(n.y-state.player.y)<=3)){
   const font=Math.max(9,Math.min(12,size*.34));
   ctx.textAlign="center";ctx.textBaseline="bottom";ctx.font="bold "+font+"px system-ui";
   const label=n.name,width=ctx.measureText(label).width+8;
   ctx.fillStyle="#15202bcc";ctx.fillRect(sx-width/2,sy-size*.68-font-3,width,font+5);
   ctx.fillStyle="#fff2d8";ctx.fillText(label,sx,sy-size*.68);
  }
 }
}
function drawTavernDecor(floor,cx,cy,w,h,size){
 for(const d of tavernDecor(floor)){
  const x=(d.x-cx)*size+w/2,y=(d.y-cy)*size+h/2,dw=d.w*size,dh=d.h*size;
  if(x+dw<0||y+dh<0||x>w||y>h)continue;
  ctx.save();
  if(d.style==="rug"){
   ctx.fillStyle=d.tone==="blue"?"#355a70":"#813e3b";
   ctx.fillRect(x+size*.12,y+size*.12,dw-size*.24,dh-size*.24);
   ctx.strokeStyle="#d2a869";ctx.lineWidth=Math.max(1,size*.09);
   ctx.strokeRect(x+size*.23,y+size*.23,dw-size*.46,dh-size*.46);
   ctx.strokeStyle="#d8c294";ctx.lineWidth=Math.max(1,size*.035);
   for(let i=0;i<d.w;i++){ctx.beginPath();ctx.moveTo(x+(i+.5)*size,y+size*.12);ctx.lineTo(x+(i+.5)*size,y+size*.28);ctx.moveTo(x+(i+.5)*size,y+dh-size*.12);ctx.lineTo(x+(i+.5)*size,y+dh-size*.28);ctx.stroke();}
  }else if(d.style==="staircase"){
   ctx.fillStyle="#5a4434";ctx.fillRect(x+size*.07,y+size*.07,dw-size*.14,dh-size*.14);
   ctx.fillStyle="#2e2726";ctx.fillRect(x+size*.25,y+size*.2,dw-size*.5,dh-size*.4);
   for(let i=0;i<7;i++){
    const yy=y+size*.18+i*(dh-size*.38)/7;
    ctx.fillStyle=i%2?"#94714e":"#b38a5c";
    ctx.fillRect(x+size*.3,yy,dw-size*.6,(dh-size*.38)/7-1);
    ctx.fillStyle="#d0aa75";ctx.fillRect(x+size*.3,yy,dw-size*.6,Math.max(1,size*.045));
   }
   ctx.fillStyle="#d8c29c";ctx.font=`bold ${Math.max(9,size*.35)}px system-ui`;
   ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(floor===0?"↑":"↓",x+dw/2,y+dh-size*.35);
  }else if(d.style==="sconce"){
   ctx.fillStyle="#7a6550";ctx.fillRect(x+size*.35,y+size*.14,size*.3,size*.5);
   ctx.fillStyle="#f3d9a1";ctx.fillRect(x+size*.43,y+size*.25,size*.14,size*.28);
   ctx.fillStyle="#ffd77d";ctx.beginPath();ctx.arc(x+size*.5,y+size*.18,Math.max(2,size*.13),0,Math.PI*2);ctx.fill();
   const glow=ctx.createRadialGradient(x+size*.5,y+size*.2,0,x+size*.5,y+size*.2,size*1.7);
   glow.addColorStop(0,"#ffdb7645");glow.addColorStop(1,"#ffdb7600");
   ctx.fillStyle=glow;ctx.fillRect(x-size,y-size,dw+2*size,dh+2*size);
  }
  ctx.restore();
 }
}
// Vector furniture tiles: crisp at every zoom, no image downloads required.
function drawTavernFurniture(floor,cx,cy,w,h,size){
 for(const o of tavernFurniture(floor)){
  const x=(o.x-cx)*size+w/2,y=(o.y-cy)*size+h/2,fw=o.w*size,fh=o.h*size;
  if(x+fw<0||y+fh<0||x>w||y>h)continue;
  const inset=Math.max(1,size*.07),round=Math.min(5,size*.13);
  const rect=(rx,ry,rw,rh,fill,stroke="#2d211a")=>{
   ctx.fillStyle=fill;ctx.fillRect(rx,ry,rw,rh);
   ctx.strokeStyle=stroke;ctx.lineWidth=Math.max(.8,size*.045);ctx.strokeRect(rx,ry,rw,rh);
  };
  ctx.save();
  const style=o.style||"chest";
  if(style==="table"||style==="counter"||style==="dresser"){
   rect(x+inset,y+inset,fw-2*inset,fh-2*inset,style==="counter"?"#7b4728":"#956139","#4b2c1c");
   ctx.strokeStyle="#c4935c";ctx.lineWidth=Math.max(1,size*.05);
   for(let i=1;i<o.w;i++){let line=x+i*size;ctx.beginPath();ctx.moveTo(line,y+inset*2);ctx.lineTo(line,y+fh-inset*2);ctx.stroke();}
   if(style==="dresser"){for(let i=0;i<o.w;i++)rect(x+i*size+size*.18,y+fh*.35,size*.64,size*.3,"#704528","#c4935c");}
  }else if(style==="bed"){
   rect(x+inset,y+inset,fw-2*inset,fh-2*inset,"#68432e");
   rect(x+fw*.13,y+fh*.12,fw*.74,fh*.22,"#e6d6b3","#b7a888");
   rect(x+fw*.1,y+fh*.4,fw*.8,fh*.48,"#54788a","#a5b5a8");
   rect(x+fw*.16,y+fh*.52,fw*.68,fh*.07,"#7495a0","#54788a");
  }else if(style==="chest"){
   rect(x+inset,y+inset,fw-2*inset,fh-2*inset,"#86532f");
   rect(x+fw*.12,y+fh*.12,fw*.76,fh*.76,"#a56d37","#4c2e1b");
   rect(x+fw*.45,y+fh*.14,fw*.1,fh*.7,"#d1ad63");
   rect(x+fw*.44,y+fh*.42,fw*.12,fh*.15,"#49331f");
  }else if(style==="wardrobe"||style==="shelf"){
   rect(x+inset,y+inset,fw-2*inset,fh-2*inset,"#69432d");
   if(style==="wardrobe"){rect(x+fw*.15,y+fh*.08,fw*.7,fh*.84,"#95663d");rect(x+fw*.69,y+fh*.45,fw*.08,fh*.08,"#ddbc77");}
   else for(let i=1;i<o.h;i++)rect(x+inset,y+i*size-size*.12,fw-2*inset,size*.2,"#b0814c");
  }else if(style==="fireplace"||style==="stove"){
   rect(x+inset,y+inset,fw-2*inset,fh-2*inset,"#696a68");
   rect(x+fw*.22,y+fh*.18,fw*.56,fh*.64,"#342b27");
   ctx.fillStyle=style==="fireplace"?"#ed853a":"#b54c2f";
   ctx.beginPath();ctx.ellipse(x+fw*.5,y+fh*.57,fw*.19,fh*.23,0,0,Math.PI*2);ctx.fill();
  }else if(style==="barrel"){
   rect(x+fw*.14,y+fh*.08,fw*.72,fh*.84,"#82502c");
   rect(x+fw*.12,y+fh*.25,fw*.76,fh*.1,"#9ca09a");
   rect(x+fw*.12,y+fh*.67,fw*.76,fh*.1,"#9ca09a");
  }else if(style==="bench"){
   rect(x+fw*.07,y+fh*.22,fw*.86,fh*.56,"#92613c");rect(x+fw*.08,y+fh*.08,fw*.84,fh*.18,"#b48652");
  }else if(style==="plant"){
   rect(x+fw*.25,y+fh*.56,fw*.5,fh*.35,"#b06d48");ctx.fillStyle="#4b8050";for(const [dx,dy] of [[.34,.4],[.57,.32],[.7,.47],[.45,.17]]){ctx.beginPath();ctx.arc(x+fw*dx,y+fh*dy,size*.18,0,Math.PI*2);ctx.fill();}
  }else if(style==="chair"){
   rect(x+fw*.18,y+fh*.18,fw*.64,fh*.64,"#865934");
   rect(x+fw*.18,y+fh*.14,fw*.64,fh*.18,"#b48652");
  }else if(style==="book"){
   rect(x+fw*.12,y+fh*.15,fw*.76,fh*.7,"#5c4437");
   rect(x+fw*.2,y+fh*.2,fw*.6,fh*.58,"#e4d1a0");
   ctx.strokeStyle="#967c56";ctx.beginPath();ctx.moveTo(x+fw*.5,y+fh*.2);ctx.lineTo(x+fw*.5,y+fh*.78);ctx.stroke();
  }
  ctx.restore();
 }
}
function drawPlotOverlay(cx,cy,w,h,size){
 for(const plot of CITY_PLOTS){
  const [x1,y1,x2,y2]=plot.bounds;
  const sx=(x1-cx)*size+w/2,sy=(y1-cy)*size+h/2;
  const pw=(x2-x1+1)*size,ph=(y2-y1+1)*size;
  if(sx>w||sy>h||sx+pw<0||sy+ph<0)continue;
  const status=plotStatus(plot,state.plotEdits).status;
  const selected=state.selectedPlot===plot.id;
  ctx.fillStyle=status==="vacant"?"#28c78424":status==="reserved"?"#ffcc4430":"#4c99f51a";
  ctx.fillRect(sx,sy,pw,ph);
  ctx.strokeStyle=selected?"#fff5a4":status==="vacant"?"#58d7a2":status==="reserved"?"#f6c15b":"#72a9f0";
  ctx.lineWidth=selected?Math.max(2,size*.13):Math.max(1,size*.065);
  ctx.setLineDash(selected?[]:[Math.max(3,size*.3),Math.max(2,size*.2)]);
  ctx.strokeRect(sx+1,sy+1,pw-2,ph-2);ctx.setLineDash([]);
  if(status!=="occupied"&&size>=9){
   ctx.fillStyle="#0b1d2bc9";ctx.fillRect(sx+pw/2-13,sy+ph/2-10,26,20);
   ctx.font="bold 12px system-ui";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#ffffff";
   ctx.fillText(String(plot.id.match(/(\d+)$/)?.[1]||"P"),sx+pw/2,sy+ph/2);
  }
 }
}
function refreshPlotPanel(){
 const panel=$("plotInfo");if(!panel)return;
 const summary=parcelSummary(state.plotEdits);
 $("plotModeBtn").textContent=state.plotMode?"Wyłącz widok działek":"Włącz widok działek";
 $("plotStats").textContent=`Działki: ${summary.total} • zabudowane: ${summary.occupied||0} • wolne: ${summary.vacant||0} • zarezerwowane: ${summary.reserved||0}`;
 const plot=CITY_PLOTS.find(p=>p.id===state.selectedPlot);
 if(!plot){panel.textContent="Włącz tryb zarządzania i dotknij działki na mapie."; $("plotReserveBtn").hidden=true;return;}
 const info=plotStatus(plot,state.plotEdits);
 const [x1,y1,x2,y2]=plot.bounds;
 panel.textContent=`${info.name} • ${x2-x1+1}×${y2-y1+1} • ${info.status==="occupied"?"zabudowana":info.status==="reserved"?"zarezerwowana":"wolna"} • właściciel: ${info.owner}`;
 $("plotReserveBtn").hidden=plot.status!=="vacant";
 $("plotReserveBtn").textContent=info.status==="reserved"?"Zwolnij rezerwację":"Zarezerwuj działkę";
}
// VIS 1.1: deterministic height illusion; purely visual, never changes collisions.
const CITY_HEIGHTS=Object.fromEntries(CITY_BUILDINGS.map(b=>{
 const id=b.id;
 const floors=/twierdza|koszary|biblioteka|kasyno|straznica|kamienica/.test(id)?3:
 /karczma|zbrojownia|apteka|magazyn|dom|spichlerz|warsztat/.test(id)?2:1;
 return [id,floors];
}));
// VIS 1.2 — top-down pitched roofs and raised wall walkways, no player halo.
function drawCityElevation(cx,cy,w,h,size){
 for(const b of CITY_BUILDINGS){
  const [x1,y1,x2,y2]=b.bounds;
  const sx=(x1-cx)*size+w/2,sy=(y1-cy)*size+h/2;
  const bw=(x2-x1+1)*size,bh=(y2-y1+1)*size;
  if(sx>w+size||sy>h+size||sx+bw<-size||sy+bh<-size)continue;
  const floors=buildingRoofLevel(b)/2;
  const eave=Math.max(1,size*.13);
  const roofX=sx+eave,roofY=sy+eave,roofW=bw-2*eave,roofH=bh-2*eave;
  const vertical=roofW<roofH*.86;
  const base=b.external?"#805d4a":floors>=3?"#74534d":"#986758";
  ctx.save();
  // The roof is contained within the building footprint. Its pitched planes
  // read as a roof from above without fake detached floating strips.
  ctx.fillStyle="#343138";
  ctx.fillRect(sx+size*.08,sy+size*.08,bw-size*.16,bh-size*.16);
  ctx.fillStyle=base;
  ctx.fillRect(roofX,roofY,roofW,roofH);
  if(vertical){
   ctx.fillStyle="#c18b70";ctx.beginPath();ctx.moveTo(roofX,roofY);ctx.lineTo(roofX+roofW*.5,roofY);ctx.lineTo(roofX+roofW*.5,roofY+roofH);ctx.lineTo(roofX,roofY+roofH);ctx.closePath();ctx.fill();
   ctx.fillStyle="#754c42";ctx.fillRect(roofX+roofW*.5,roofY,roofW*.5,roofH);
  }else{
   ctx.fillStyle="#c18b70";ctx.fillRect(roofX,roofY,roofW,roofH*.5);
   ctx.fillStyle="#754c42";ctx.fillRect(roofX,roofY+roofH*.5,roofW,roofH*.5);
  }
  ctx.strokeStyle="#dfad88";ctx.lineWidth=Math.max(1,size*.045);
  ctx.beginPath();
  if(vertical){ctx.moveTo(roofX+roofW*.5,roofY);ctx.lineTo(roofX+roofW*.5,roofY+roofH);}
  else{ctx.moveTo(roofX,roofY+roofH*.5);ctx.lineTo(roofX+roofW,roofY+roofH*.5);}
  ctx.stroke();
  // Rows of roof tiles follow the slope; tile density adapts to zoom.
  if(size>=8){
   ctx.strokeStyle="#432d2b60";ctx.lineWidth=Math.max(.6,size*.017);
   const pitch=Math.max(5,size*.46);
   if(vertical){
    for(let yy=roofY+pitch;yy<roofY+roofH;yy+=pitch){
     ctx.beginPath();ctx.moveTo(roofX,yy);ctx.lineTo(roofX+roofW,yy);ctx.stroke();
    }
   }else{
    for(let xx=roofX+pitch;xx<roofX+roofW;xx+=pitch){
     ctx.beginPath();ctx.moveTo(xx,roofY);ctx.lineTo(xx,roofY+roofH);ctx.stroke();
    }
   }
  }
  // The visible lower facade conveys height; entrances stay visible.
  const facade=Math.min(size*.46,Math.max(size*.16,(floors-1)*size*.18));
  const edgeY=sy+bh-facade;
  ctx.fillStyle="#554d49e8";ctx.fillRect(sx,edgeY,bw,facade);
  ctx.fillStyle="#b5a59a";ctx.fillRect(sx,edgeY,bw,Math.max(1,size*.08));
  if(floors>1&&size>=16){
   ctx.fillStyle="#dfd0ad";ctx.strokeStyle="#3c3c43";ctx.lineWidth=Math.max(1,size*.035);
   for(let xx=sx+size*.9;xx<sx+bw-size*.7;xx+=size*2.5){
    if(b.door&&Math.abs(xx-(b.door.x-cx+.5)*size-w/2)<size)continue;
    ctx.fillRect(xx,edgeY+facade*.34,size*.38,facade*.4);
    ctx.strokeRect(xx,edgeY+facade*.34,size*.38,facade*.4);
   }
  }
  ctx.restore();
 }
}
// VIS 1.3 — elevated rampart: walkable crest, masonry face, depth and stairs.
function drawRampartDetails(cx,cy,w,h,size){
 if(state.player.map!=="site-city1")return;
 const left=Math.max(0,Math.floor(cx-w/(2*size))-2),right=Math.min(191,Math.ceil(cx+w/(2*size))+2);
 const top=Math.max(0,Math.floor(cy-h/(2*size))-2),bottom=Math.min(159,Math.ceil(cy+h/(2*size))+2);
 const t=(x,y)=>tileAt("site-city1",0,x,y);
 ctx.save();
 for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){
  const tile=t(x,y);
  if(tile!=="rampart"&&tile!=="stairs-up")continue;
  const sx=(x-cx)*size+w/2,sy=(y-cy)*size+h/2;
  if(tile==="stairs-up"){
   // Stair treads run toward the raised wall; show the change in elevation.
   const rightWall=t(x+1,y)==="rampart",leftWall=t(x-1,y)==="rampart";
   const upper=rightWall?"right":leftWall?"left":"up";
   ctx.fillStyle="#776e63";ctx.fillRect(sx,sy,size,size);
   for(let j=0;j<5;j++){
    const shade=95+j*12;
    ctx.fillStyle=`rgb(${shade+13},${shade+11},${shade+3})`;
    if(upper==="right")ctx.fillRect(sx+j*size/5,sy,size/5+1,size);
    else if(upper==="left")ctx.fillRect(sx+(4-j)*size/5,sy,size/5+1,size);
    else ctx.fillRect(sx,sy+(4-j)*size/5,size,size/5+1);
   }
   ctx.strokeStyle="#342f2a";ctx.lineWidth=Math.max(.7,size*.025);
   for(let j=1;j<5;j++){
    ctx.beginPath();
    if(upper==="right"||upper==="left"){ctx.moveTo(sx+j*size/5,sy);ctx.lineTo(sx+j*size/5,sy+size);}
    else{ctx.moveTo(sx,sy+j*size/5);ctx.lineTo(sx+size,sy+j*size/5);}
    ctx.stroke();
   }
   continue;
  }
  // The masonry drop is drawn along the inner edge of the elevated walkway.
  // A shaded face and a long cast shadow on the street make the height legible.
  const faces=[[1,0],[0,1],[-1,0],[0,-1]];
  for(const [dx,dy] of faces){
   const adjacent=t(x+dx,y+dy);
   if(adjacent==="rampart"||adjacent==="stairs-up"||adjacent==="void")continue;
   const inner=adjacent!=="rampart"&&adjacent!=="stairs-up";
   if(!inner)continue;
   const face=Math.max(3,size*.27),shadow=Math.max(3,size*.35);
   ctx.fillStyle="#1b242b55";
   if(dx===1)ctx.fillRect(sx+size,sy+size*.15,shadow,size*.9);
   if(dx===-1)ctx.fillRect(sx-shadow,sy+size*.15,shadow,size*.9);
   if(dy===1)ctx.fillRect(sx+size*.15,sy+size, size*.9,shadow);
   if(dy===-1)ctx.fillRect(sx+size*.15,sy-shadow,size*.9,shadow);
   ctx.fillStyle="#52595a";
   if(dx===1)ctx.fillRect(sx+size-face,sy,face,size);
   if(dx===-1)ctx.fillRect(sx,sy,face,size);
   if(dy===1)ctx.fillRect(sx,sy+size-face,size,face);
   if(dy===-1)ctx.fillRect(sx,sy,size,face);
   ctx.fillStyle="#8f9690";
   if(dx===1)ctx.fillRect(sx+size-face,sy,Math.max(1,size*.06),size);
   if(dx===-1)ctx.fillRect(sx+face-size*.06,sy,Math.max(1,size*.06),size);
   if(dy===1)ctx.fillRect(sx,sy+size-face,size,Math.max(1,size*.06));
   if(dy===-1)ctx.fillRect(sx,sy+face-size*.06,size,Math.max(1,size*.06));
  }
  // Crenellations run along the exterior rim, never around the character.
  const outer=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>t(x+dx,y+dy)!=="rampart"&&t(x+dx,y+dy)!=="stairs-up");
  if(outer&&(x+y)%2===0){
   const lip=Math.max(2,size*.22);
   ctx.fillStyle="#d2d1c6";
   if(t(x-1,y)!=="rampart")ctx.fillRect(sx,sy,lip,size);
   if(t(x+1,y)!=="rampart")ctx.fillRect(sx+size-lip,sy,lip,size);
   if(t(x,y-1)!=="rampart")ctx.fillRect(sx,sy,size,lip);
   if(t(x,y+1)!=="rampart")ctx.fillRect(sx,sy+size-lip,size,lip);
   ctx.strokeStyle="#666a65";ctx.lineWidth=Math.max(.7,size*.025);
   if(t(x-1,y)!=="rampart")ctx.strokeRect(sx,sy,lip,size);
   if(t(x+1,y)!=="rampart")ctx.strokeRect(sx+size-lip,sy,lip,size);
   if(t(x,y-1)!=="rampart")ctx.strokeRect(sx,sy,size,lip);
   if(t(x,y+1)!=="rampart")ctx.strokeRect(sx,sy+size-lip,size,lip);
  }
 }
 ctx.restore();
}
function drawCityGates(cx,cy,w,h,size){
 // Four permanent gatehouses: 5 tiles across the passage, two fortified
 // flanking towers, open 3-tile carriageway and a visible portcullis overhead.
 for(const gate of CITY_GATES){
  const [x1,y1,x2,y2]=gate.bounds??(gate.x===55?[gate.x-2,gate.y-2,gate.x+2,gate.y+2]:[gate.x-2,gate.y-2,gate.x+2,gate.y+2]);
  const sx=(x1-cx)*size+w/2,sy=(y1-cy)*size+h/2;
  const gw=(x2-x1+1)*size,gh=(y2-y1+1)*size;
  if(sx>w+size||sy>h+size||sx+gw<-size||sy+gh<-size)continue;
  const vertical=gate.axis==="vertical";
  ctx.save();
  // Masonry towers on either side of the three-tile roadway.
  for(const side of [-2,2]){
   const tx=vertical?gate.x+side:x1;
   const ty=vertical?y1:gate.y+side;
   const px=(tx-cx)*size+w/2,py=(ty-cy)*size+h/2;
   const tw=vertical?size:gw,th=vertical?gh:size;
   ctx.fillStyle="#454d4e77";ctx.fillRect(px+size*.16,py+size*.22,tw,th);
   ctx.fillStyle="#8f938d";ctx.fillRect(px,py,tw,th);
   ctx.fillStyle="#b8b9ad";ctx.fillRect(px+size*.12,py+size*.12,tw-size*.24,th-size*.24);
   ctx.strokeStyle="#676b68";ctx.lineWidth=Math.max(1,size*.035);
   for(let k=1;k<(vertical?5:5);k++){
    ctx.beginPath();
    if(vertical){ctx.moveTo(px,py+k*size);ctx.lineTo(px+tw,py+k*size);}
    else{ctx.moveTo(px+k*size,py);ctx.lineTo(px+k*size,py+th);}
    ctx.stroke();
   }
   ctx.fillStyle="#e0d9c8";
   for(let k=0;k<5;k+=2){
    if(vertical)ctx.fillRect(px,py+k*size,size*.24,size*.5);
    else ctx.fillRect(px+k*size,py,size*.5,size*.24);
   }
  }
  // Elevated stone lintel marks the gateway without obstructing travel.
  const lx=vertical?(gate.x-1-cx)*size+w/2:sx;
  const ly=vertical?sy:(gate.y-1-cy)*size+h/2;
  const lw=vertical?size*3:gw,lh=vertical?gh:size*3;
  ctx.strokeStyle="#54463a";ctx.lineWidth=Math.max(2,size*.12);
  ctx.strokeRect(lx+size*.07,ly+size*.07,lw-size*.14,lh-size*.14);
  // Open portcullis hangs overhead; closed one blocks the three-tile lane.
  const closed=state.gateStates[gate.id]==="closed";
  ctx.strokeStyle=closed?"#523e2e":"#c9a46b";ctx.lineWidth=Math.max(1,size*(closed?.13:.065));
  if(vertical){
   const yy=(gate.y-cy)*size+h/2;
   for(let k=0;k<4;k++){let xx=(gate.x-1+k-cx)*size+w/2;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx,yy+size*(closed?1:.25));ctx.stroke();}
  }else{
   const xx=(gate.x-cx)*size+w/2;
   for(let k=0;k<4;k++){let yy=(gate.y-1+k-cy)*size+h/2;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+size*(closed?1:.25),yy);ctx.stroke();}
  }
  ctx.restore();
 }
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
  // Three-tile-wide walkable curtain wall, with crenellations on the outer rim.
  const outer=(x===20||x===91||y===8||y===78);
  const inner=(x===22||x===89||y===10||y===76);
  const corner=(x>=20&&x<=22||x>=89&&x<=91)&&(y>=8&&y<=10||y>=76&&y<=78);
  ctx.fillStyle=corner?"#747b7c":outer?"#707875":inner?"#9b9e96":"#b5b0a4";
  ctx.fillRect(sx,sy,size,size);
  ctx.strokeStyle="#656965";ctx.lineWidth=Math.max(.6,size*.035);
  ctx.beginPath();ctx.moveTo(sx,sy+size*.5);ctx.lineTo(sx+size,sy+size*.5);
  ctx.moveTo(sx+size*(seed%2?.25:.7),sy);ctx.lineTo(sx+size*(seed%2?.25:.7),sy+size*.5);ctx.stroke();
  if(inner){ctx.fillStyle="#d4d0c2";ctx.fillRect(sx,sy,size*.13,size);}
  if(outer&&((x+y)%2===0)){
   ctx.fillStyle="#d6d1c4";ctx.fillRect(sx+size*.1,sy+size*.1,size*.8,size*.8);
   ctx.strokeStyle="#555c59";ctx.strokeRect(sx+size*.1,sy+size*.1,size*.8,size*.8);
  }
  if(corner){ctx.strokeStyle="#d5d2c7";ctx.lineWidth=Math.max(1,size*.09);ctx.strokeRect(sx+size*.15,sy+size*.15,size*.7,size*.7);}
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
function follow(){visual.manualPan=false;visual.cameraTargetX=state.player.x+.5;visual.cameraTargetY=state.player.y+.5;}
function move(dir,fromPath=false){
 if(activeNpc)closeNPCDialogue();
 if(strategic?.active())return strategic.move(dir);
 if(!fromPath)path=[];
 const d={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[dir];if(!d)return false;
 const p=state.player,nx=p.x+d[0],ny=p.y+d[1];
 const door=doorAt(p.map,p.floor,nx,ny);if(door&&(state.doors[door.id]||door.initial)!=="open"){if(!fromPath)notify(door.name+": użyj Zbadaj / Otwórz (E)");path=[];draw();return false;}
 if(p.map==="site-city1"){const gate=cityGateBarrierAt(nx,ny);if(gate&&state.gateStates[gate.id]==="closed"){if(!fromPath)notify(gate.name+": krata zamknięta — podejdź i użyj Zbadaj");path=[];draw();return false;}}
 const bounds=mapSize(p.map);
 if(siteForMap(p.map)&&(nx<0||ny<0||nx>=bounds.w||ny>=bounds.h)){
  path=[];strategic.open();notify("Opuszczono lokację — mapa świata");return true;
 }
 if((p.map==="site-city1"&&!cityStepAllowed(p.x,p.y,nx,ny))||blocked(p.map,p.floor,nx,ny)){if(!fromPath)notify("Droga zablokowana");draw();return false;}
 const previous={map:p.map,floor:p.floor,x:p.x,y:p.y,z:p.z};
 const heightChange=p.map==="site-city1"?resolveSurfaceStep(p.map,p,{x:nx,y:ny},p.floor):null;
 if(heightChange&&!heightChange.allowed){if(!fromPath)notify("Potrzebne schody lub przejście na właściwym poziomie");path=[];return false;}
 p.x=nx;p.y=ny;p.z=heightChange?heightChange.z:elevationAt(p.map,nx,ny,p.floor);
 if(heightChange&&heightChange.z===2&&previous.z!==2&&!fromPath)notify("Wejście na chodnik obronny");
 if(heightChange&&heightChange.z===0&&previous.z>0&&!fromPath)notify("Zejście z podwyższenia");
 const dest=transitionAt(p.map,p.floor,p.x,p.y);
 if(dest){Object.assign(p,dest);p.z=elevationAt(p.map,p.x,p.y,p.floor);path=[];if(p.map===TAVERN_MAP){state.camera.zoom=Math.max(0.75,state.camera.zoom);}notify(mapName(p.map,p.floor));}
 startVisualStep(previous);draw();return true;
}
function findPath(goal){
 if(!$("worldMapOverlay").hidden)return [];
 const result=findRoute(state.player,goal,state.doors,state.gateStates);
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
 if(Math.abs(dx)+Math.abs(dy)>3){drag.moved=true;const {size}=geometry();state.camera.x-=dx/size;state.camera.y-=dy/size;visual.manualPan=true;draw();}
 drag.x=e.clientX;drag.y=e.clientY;
});
canvas.addEventListener("pointerup",e=>{if(!drag||drag.id!==e.pointerId)return;
 if(!drag.moved){
  const goal=toTile(e);
  const selected=visibleNPCs(npcs,state.player).find(n=>Math.abs(n.x-goal.x)+Math.abs(n.y-goal.y)<=1);
  if(selected&&!state.plotMode&&Math.abs(selected.x-state.player.x)+Math.abs(selected.y-state.player.y)<=3){showNPCDialogue(selected);drag=null;return;}
  if(state.plotMode&&state.player.map==="site-city1"){
   const plot=plotAt(goal.x,goal.y);state.selectedPlot=plot?.id||null;
   refreshPlotPanel();if(plot)notify(plot.name);draw();
  }else{path=findPath(goal);if(path.length)notify(`Wyznaczono trasę: ${path.length} pól`);draw();}
 }
 drag=null;
});
canvas.addEventListener("pointercancel",()=>drag=null);
canvas.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY<0?1:-1);},{passive:false});
function zoom(delta){state.camera.zoom=Math.max(.25,Math.min(3,Math.round((state.camera.zoom+delta*.25)*100)/100));draw();}
$("plotModeBtn").addEventListener("click",()=>{
 if(state.player.map!=="site-city1"){notify("Zarządzanie działkami jest dostępne w Mieście 1");return;}
 state.plotMode=!state.plotMode;state.selectedPlot=null;path=[];refreshPlotPanel();draw();
});
$("plotReserveBtn").addEventListener("click",()=>{
 const plot=CITY_PLOTS.find(p=>p.id===state.selectedPlot);
 if(!plot||plot.status!=="vacant")return;
 const current=plotStatus(plot,state.plotEdits).status;
 if(current==="reserved")delete state.plotEdits[plot.id];
 else state.plotEdits[plot.id]={status:"reserved"};
 refreshPlotPanel();draw();notify(current==="reserved"?"Zwolniono działkę":"Zarezerwowano działkę");
});
$("zoomIn").addEventListener("click",()=>zoom(1));$("zoomOut").addEventListener("click",()=>zoom(-1));$("centerCamera").addEventListener("click",()=>{visual.manualPan=false;visual.cameraTargetX=visual.x;visual.cameraTargetY=visual.y;draw();});
$("saveBtn").addEventListener("click",()=>{state.worldMode=strategic.active();const ok=saveGame(state);$("saveStatus").textContent=ok?"Zapisano kampanię lokalnie":"Nie udało się zapisać";notify(ok?"Gra zapisana":"Błąd zapisu");});
function restore(){const data=loadGame();if(!data){notify("Brak zgodnego zapisu");return;}
 closeNPCDialogue();restoreNPCState(npcs,data.npcState);
 if(blocked(data.player.map,data.player.floor,data.player.x,data.player.y)){notify("Nieprawidłowa pozycja zapisu");return;}
 Object.assign(state.player,data.player);Object.assign(state.clock,data.clock);state.objects=data.objects||defaultObjects();state.inventory=data.inventory||[];state.plotEdits=data.plotEdits||{};state.gateStates=data.gateStates||{};state.plotMode=false;state.selectedPlot=null;refreshPlotPanel();state.crimes=data.crimes||0;state.reputation=data.reputation||0;state.doors=data.doors||defaultDoors();state.worldRegion="pogranicze";state.worldPosition=data.worldPosition&&Number.isInteger(data.worldPosition.x)&&Number.isInteger(data.worldPosition.y)?{...data.worldPosition}:{...WORLD_START};state.worldTravelMinutes=data.worldTravelMinutes||0;
 state.camera.zoom=Number.isFinite(data.camera?.zoom)?Math.max(.25,Math.min(3,data.camera.zoom)):1;
 state.controlMode=data.controlMode==="joystick"?"joystick":"dpad";state.paused=Boolean(data.paused);
 snapVisual();controls.setMode(state.controlMode);path=[];draw();if(data.worldMode)strategic.open();else strategic.close();notify("Wczytano kampanię");
}
$("loadBtn").addEventListener("click",restore);
$("pauseBtn").addEventListener("click",()=>{state.paused=!state.paused;draw();});
$("newBtn").addEventListener("click",()=>{$("confirmNew").showModal();});
$("confirmNew").addEventListener("close",()=>{if($("confirmNew").returnValue!=="confirm")return;
 closeNPCDialogue();npcs.splice(0,npcs.length,...createNPCs());
 Object.assign(state.player,START);Object.assign(state.clock,{day:1,hour:8,minute:0});state.objects=defaultObjects();state.plotEdits={};state.plotMode=false;state.selectedPlot=null;refreshPlotPanel();state.inventory=[];state.crimes=0;state.reputation=0;state.doors=defaultDoors();state.worldRegion="pogranicze";state.worldPosition={...WORLD_START};state.worldTravelMinutes=0;state.paused=false;document.getElementById("worldMapOverlay").hidden=true;path=[];snapVisual();draw();notify("Rozpoczęto nową kampanię");
});
$("menuBtn").addEventListener("click",()=>$("sidePanel").classList.toggle("open"));
$("fastTravelTavern").addEventListener("click",()=>{
 Object.assign(state.player,{map:TAVERN_MAP,floor:0,x:16,y:25});
 path=[];state.camera.x=16.5;state.camera.y=25.5;state.camera.zoom=Math.max(.75,state.camera.zoom);
 if(!$("worldMapOverlay").hidden)strategic.close();
 $("sidePanel").classList.remove("open");snapVisual();draw();notify("Szybka podróż: Karczma 01");
});
const visitPoints={keep:{x:24,y:21},house:{x:34,y:12},inn:{x:38,y:23},warehouse:{x:10,y:31}};
document.querySelectorAll("[data-visit]").forEach(button=>button.addEventListener("click",()=>{
 const point=visitPoints[button.dataset.visit];if(!point)return;
 Object.assign(state.player,{map:"overworld",floor:0,...point});path=[];snapVisual();draw();
 $("sidePanel").classList.remove("open");notify("Podejdź do żółtych drzwi, aby wejść.");
}));
function showObjectPanel(object){
 let panel=document.getElementById("objectPanel");
 if(!panel){panel=document.createElement("div");panel.id="objectPanel";panel.style.cssText="position:absolute;z-index:50;top:12%;left:5%;width:90%;max-width:420px;background:#172639;border:2px solid #7799b6;border-radius:12px;padding:14px;box-shadow:0 8px 30px #000a";document.getElementById("gameShell").appendChild(panel);}
 panel.replaceChildren();
 const title=document.createElement("h3");title.textContent=object.name;panel.appendChild(title);
 const description=document.createElement("p");description.textContent=object.description;panel.appendChild(description);
 for(const action of objectActions(object,state)){
  const button=document.createElement("button");button.textContent=action.label;button.style.margin="4px";
  button.addEventListener("click",()=>{notify(useObject(state,object,action.id));draw();showObjectPanel(object);});panel.appendChild(button);
 }
 const close=document.createElement("button");close.textContent="Zamknij okno";close.style.margin="4px";close.addEventListener("click",()=>panel.remove());panel.appendChild(close);
}
function closeNPCDialogue(){
 if(activeNpc)activeNpc.talking=false;
 activeNpc=null;
 const panel=$("npcDialoguePanel");if(panel)panel.remove();
}
function showNPCDialogue(n,topic="hello"){
 if(!n)return;
 if(activeNpc!==n){closeNPCDialogue();activeNpc=n;n.talking=true;n.met=Math.min(999,(n.met||0)+1);}
 let panel=$("npcDialoguePanel");
 if(!panel){
  panel=document.createElement("div");panel.id="npcDialoguePanel";
  Object.assign(panel.style,{position:"absolute",left:"8px",right:"8px",bottom:"12px",maxWidth:"480px",
   margin:"auto",boxSizing:"border-box",zIndex:"20",background:"#162432f5",border:"1px solid #b19b70",
   borderRadius:"12px",padding:"14px",boxShadow:"0 8px 30px #0008",color:"#f7ebd4",font:"14px system-ui"});
  $("viewport").appendChild(panel);
 }
 panel.replaceChildren();
 const title=document.createElement("div");title.textContent=n.name+" — "+n.role;
 title.style.fontWeight="bold";title.style.fontSize="16px";title.style.marginBottom="8px";panel.appendChild(title);
 const body=document.createElement("div");body.textContent=topic==="hello"?npcGreeting(n,state.clock):npcDialogue(n,topic,state.clock);
 body.style.marginBottom="12px";body.style.lineHeight="1.4";panel.appendChild(body);
 const row=document.createElement("div");Object.assign(row.style,{display:"flex",flexWrap:"wrap",gap:"6px"});
 const add=(label,fn)=>{const btn=document.createElement("button");btn.textContent=label;
 Object.assign(btn.style,{flex:"1 1 auto",minHeight:"35px",borderRadius:"7px",padding:"6px",
 background:"#33485b",color:"#fff5df",border:"1px solid #6c7680"});btn.addEventListener("click",fn);row.appendChild(btn);};
 add("Czym się zajmujesz?",()=>showNPCDialogue(n,"work"));
 add("Co teraz robisz?",()=>showNPCDialogue(n,"activity"));
 add("Co słychać w mieście?",()=>showNPCDialogue(n,"city"));
 add("Słyszałeś jakieś wieści?",()=>showNPCDialogue(n,"rumour"));
 add("Do widzenia",closeNPCDialogue);
 panel.appendChild(row);
}
function performInteraction(){if(strategic.active()){if(!strategic.interact())notify("Podejdź do oznaczonej lokacji, aby wejść.");return;}
 if(state.player.map==="site-city1"){
  const p=state.player,gate=cityGateControlNear(p.x,p.y);
  if(gate){
   const wasClosed=state.gateStates[gate.id]==="closed";
   if(!wasClosed){
    // Do not close the portcullis on the player's current tile.
    const standing=cityGateBarrierAt(p.x,p.y);
    if(standing?.id===gate.id){notify("Zejdź z progu bramy przed opuszczeniem kraty");return;}
   }
   state.gateStates[gate.id]=wasClosed?"open":"closed";
   path=[];draw();notify(gate.name+": "+(wasClosed?"podniesiono kratę":"opuszczono kratę"));return;
  }
  const building=CITY_BUILDINGS.find(b=>b.door&&Math.abs(b.door.x-p.x)+Math.abs(b.door.y-p.y)<=1);
  if(building){const dest=transitionAt(p.map,p.floor,building.door.x,building.door.y);if(dest){Object.assign(p,dest);path=[];if(p.map==="interior-city1-karczma"){p.x=16;p.y=25;state.camera.zoom=Math.max(.75,state.camera.zoom);}snapVisual();draw();notify("Wejście: "+building.name);return;}}
 }
 const npc=nearestNPC(npcs,state.player);if(npc){showNPCDialogue(npc);return;}
 const obj=interactionNear(state.player);if(obj&&state.player.map==="interior-city1-karczma"){showObjectPanel(obj);path=[];draw();return;}
 notify(interact(state));path=[];draw();}
$("interactBtn").addEventListener("click",performInteraction);
$("interactMobile").addEventListener("click",performInteraction);
const strategic=setupWorldMap({
 getState:()=>state,
 onEnter:site=>{
  Object.assign(state.player,{map:site.map,floor:0,x:site.map==="site-city1"?55:32,y:site.map==="site-city1"?76:22});
  state.worldPosition={x:site.x,y:site.y};path=[];snapVisual();draw();
  notify("Wejście: "+site.name);
 },
 onExit:()=>{snapVisual();draw();},
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
setInterval(()=>{if(!state.paused&&!strategic.active()&&stepNPCs(npcs,state.player,state.clock,performance.now(),state.gateStates))draw();},220);
new ResizeObserver(resize).observe(canvas);
snapVisual();refreshPlotPanel();resize();requestAnimationFrame(animateVisual);
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
