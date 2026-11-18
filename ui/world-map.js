import {WORLD_WIDTH,WORLD_HEIGHT,WORLD_COLORS,worldTile,REGIONS,regionById,canTravel} from "../engine/world-map.js";
export function setupWorldMap({getState,onTravel,onEnter}){
 const overlay=document.getElementById("worldMapOverlay"),canvas=document.getElementById("strategicMap"),ctx=canvas.getContext("2d");
 const title=document.getElementById("worldRegionTitle"),desc=document.getElementById("worldRegionDescription"),travel=document.getElementById("worldTravelBtn"),enter=document.getElementById("worldEnterBtn");
 let selected="pogranicze";
 document.getElementById("viewport").appendChild(overlay);
 function open(){selected=getState().worldRegion||"pogranicze";overlay.hidden=false;render();}
 function close(){if(getState().worldRegion==="pogranicze")overlay.hidden=true;}
 function render(){
  const state=getState(),current=state.worldRegion||"pogranicze";
  canvas.width=720;canvas.height=480;const size=52,ox=48,oy=32;
  ctx.fillStyle="#0c1622";ctx.fillRect(0,0,720,480);
  for(let y=0;y<WORLD_HEIGHT;y++)for(let x=0;x<WORLD_WIDTH;x++){
   ctx.fillStyle=WORLD_COLORS[worldTile(x,y)];ctx.fillRect(ox+x*size,oy+y*size,size-2,size-2);
  }
  for(const r of REGIONS){
   const x=ox+r.x*size,y=oy+r.y*size;
   ctx.lineWidth=3;ctx.strokeStyle=r.id===current?"#ffe3a0":r.id===selected?"#7de4ff":"#13212e";
   ctx.strokeRect(x+2,y+2,size-6,size-6);
   ctx.fillStyle=r.id===current?"#ffdd83":"#f2f5f8";ctx.beginPath();ctx.arc(x+size/2,y+size/2,7,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#f9f8f0";ctx.font="bold 11px system-ui";ctx.textAlign="center";
   ctx.fillText(r.name,x+size/2,y-5);
  }
  const region=regionById(selected);
  title.textContent=region?.name||"Nieznany obszar";
  desc.textContent=(region?.description||"")+ (selected===current?" • Obecny region.":"");
  travel.disabled=!canTravel(current,selected);
  travel.textContent=travel.disabled?"Podróż niedostępna":"Podróżuj (2 godziny)";
  document.getElementById("closeWorldMap").disabled=current!=="pogranicze";
  enter.disabled=current!=="pogranicze";
  enter.textContent=current==="pogranicze"?"Wróć do mapy lokacji":"Mapa lokacji jeszcze niedostępna";
 }
 canvas.addEventListener("click",e=>{
  const box=canvas.getBoundingClientRect(),x=Math.floor(((e.clientX-box.left)*canvas.width/box.width-48)/52),y=Math.floor(((e.clientY-box.top)*canvas.height/box.height-32)/52);
  const r=REGIONS.find(r=>r.x===x&&r.y===y);if(r){selected=r.id;render();}
 });
 travel.addEventListener("click",()=>{if(onTravel(selected)){render();}});
 enter.addEventListener("click",()=>{if(getState().worldRegion==="pogranicze"){overlay.hidden=true;onEnter();}});
 document.getElementById("openWorldMap").addEventListener("click",open);
 document.getElementById("closeWorldMap").addEventListener("click",close);
 overlay.addEventListener("click",e=>{if(e.target===overlay&&getState().worldRegion==="pogranicze")overlay.hidden=true;});
 return {render,open,close};
}
