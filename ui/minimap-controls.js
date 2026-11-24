// Touch-friendly independent map controls. No main-map movement until explicit route action.
import {createMinimap,mapTransform,minimapTile,localPlaces,searchPlaces} from "./minimap.js?v=0.3.28.1";
const KEY="kingdoms-minimap-options-v1",clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function setupMinimap({getFrame,onRoute,onCancel,onCenterMain}){
 const $=id=>document.getElementById(id),canvas=$("localMinimap"),panel=$("minimapPanel"),renderer=createMinimap(canvas);
 let prefs={size:"small",zoom:1,npcs:true,camera:true,places:false,collapsed:false};
 try{const v=JSON.parse(localStorage.getItem(KEY)||"null");if(v){if(["small","medium","large","full"].includes(v.size))prefs.size=v.size;if(Number.isFinite(v.zoom))prefs.zoom=clamp(v.zoom,1,6);for(const k of ["npcs","camera","places","collapsed"])if(typeof v[k]==="boolean")prefs[k]=v[k];}}catch{}
 let center=null,following=true,waypoint=null,places=[],mapKey="",drag=null,expanded=false;
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(prefs));}catch{}};
 function apply(){
  panel.dataset.size=prefs.size;
  $("minimapSize").value=prefs.size;$("minimapZoomValue").textContent=Math.round(prefs.zoom*100)+"%";
  $("minimapOut").disabled=prefs.zoom<=1;$("minimapIn").disabled=prefs.zoom>=6;
  $("minimapNPCs").checked=prefs.npcs;$("minimapCamera").checked=prefs.camera;$("minimapPlaces").checked=prefs.places;
  $("minimapBody").hidden=prefs.collapsed;$("minimapToggle").textContent=prefs.collapsed?"Minimapa +":"Minimapa −";
  $("minimapToggle").setAttribute("aria-expanded",String(!prefs.collapsed));
  $("minimapOptions").hidden=!expanded;$("minimapExpand").textContent=expanded?"Gotowe":"Opcje";
  $("minimapExpand").setAttribute("aria-expanded",String(expanded));
  $("minimapExpand").hidden=prefs.collapsed;
  panel.classList.toggle("editing",expanded&&!prefs.collapsed);
 }
 function options(){
  const select=$("minimapResults"),matches=searchPlaces(places,$("minimapSearch").value);
  select.replaceChildren();
  for(const p of matches){const opt=document.createElement("option");opt.value=p.id;opt.textContent=p.name;select.appendChild(opt);}
  $("minimapFind").disabled=!matches.length;
 }
 function targetInfo(){
  $("minimapTarget").textContent=waypoint?"Cel: "+waypoint.name+" ("+waypoint.x+", "+waypoint.y+")":"Brak celu";
  $("minimapRoute").disabled=!waypoint;$("minimapClear").disabled=!waypoint;
 }
 function refresh(force=false){
  const f=getFrame(),p=f.player,key=p.map+":"+p.floor;
  if(key!==mapKey){
   mapKey=key;center=null;following=true;waypoint=null;places=localPlaces(p.map,p.floor);$("minimapSearch").value="";options();targetInfo();
  }
  if(prefs.collapsed||f.hidden)return false;
  // Compact display stays cheap, larger modes use at most 480px raster output.
  const rect=canvas.getBoundingClientRect();
  const w=Math.max(1,Math.min(480,Math.round(rect.width||192))),h=Math.max(1,Math.min(400,Math.round(rect.height||160)));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;force=true;}
  return renderer.draw({...f,force,miniZoom:prefs.zoom,center:following?{x:p.x+.5,y:p.y+.5}:center,showNPCs:prefs.npcs,showCamera:prefs.camera,showPlaces:prefs.places,places,waypoint});
 }
 function selectTarget(p){waypoint={...p};center={x:p.x+.5,y:p.y+.5};following=false;targetInfo();refresh(true);}
 function zoom(delta){prefs.zoom=clamp(Math.round((prefs.zoom+delta)*100)/100,1,6);apply();save();refresh(true);}
 $("minimapToggle").addEventListener("click",()=>{prefs.collapsed=!prefs.collapsed;apply();save();refresh(true);});
 $("minimapExpand").addEventListener("click",()=>{expanded=!expanded;apply();refresh(true);});
 $("minimapSize").addEventListener("change",e=>{prefs.size=e.target.value;apply();save();refresh(true);});
 $("minimapOut").addEventListener("click",()=>zoom(-.5));$("minimapIn").addEventListener("click",()=>zoom(.5));
 $("minimapFollow").addEventListener("click",()=>{following=true;center=null;refresh(true);});
 $("minimapOverview").addEventListener("click",()=>{prefs.zoom=1;center=null;following=true;apply();save();refresh(true);});
 for(const [id,k] of [["minimapNPCs","npcs"],["minimapCamera","camera"],["minimapPlaces","places"]])$(id).addEventListener("change",e=>{prefs[k]=e.target.checked;save();refresh(true);});
 $("minimapSearch").addEventListener("input",options);
 $("minimapFind").addEventListener("click",()=>{const p=places.find(p=>p.id===$("minimapResults").value);if(p)selectTarget(p);});
 $("minimapRoute").addEventListener("click",()=>{if(waypoint){onRoute(waypoint);refresh(true);}});
 $("minimapClear").addEventListener("click",()=>{waypoint=null;onCancel();targetInfo();refresh(true);});
 $("minimapCenterMain").addEventListener("click",()=>{onCenterMain();refresh(true);});
 canvas.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY<0?.5:-.5);},{passive:false});
 function local(e){const b=canvas.getBoundingClientRect();return {x:(e.clientX-b.left)*canvas.width/b.width,y:(e.clientY-b.top)*canvas.height/b.height};}
 canvas.addEventListener("pointerdown",e=>{
  if(drag)return;const t=renderer.transform();if(!t)return;
  const p=local(e);drag={id:e.pointerId,x:p.x,y:p.y,startX:p.x,startY:p.y,moved:false};canvas.setPointerCapture(e.pointerId);
 });
 canvas.addEventListener("pointermove",e=>{
  if(!drag||drag.id!==e.pointerId)return;const p=local(e),t=renderer.transform();if(!t)return;
  if(Math.abs(p.x-drag.startX)+Math.abs(p.y-drag.startY)>5)drag.moved=true;
  if(drag.moved){following=false;center={x:clamp((canvas.width/2-t.ox-(p.x-drag.x))/t.scale,0,t.mw),y:clamp((canvas.height/2-t.oy-(p.y-drag.y))/t.scale,0,t.mh)};refresh(true);}
  drag.x=p.x;drag.y=p.y;
 });
 canvas.addEventListener("pointerup",e=>{
  if(!drag||drag.id!==e.pointerId)return;
  if(!drag.moved){const t=renderer.transform(),p=local(e),tile=t&&minimapTile(t,p.x,p.y,t.mw,t.mh),f=getFrame();
   if(tile){
    const known=places.find(a=>Math.abs(a.x-tile.x)+Math.abs(a.y-tile.y)<=Math.max(1,Math.floor(3/t.scale)));
    selectTarget(known||{...tile,map:f.player.map,floor:f.player.floor,name:"Własny znacznik"});
   }
  }drag=null;
 });
 canvas.addEventListener("pointercancel",()=>{drag=null;});
 apply();targetInfo();return {refresh,resetTarget(){waypoint=null;targetInfo();},stats:renderer.stats};
}
