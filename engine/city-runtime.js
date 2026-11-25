// City 1 r2 ground-level runtime; legacy remains the failure fallback.
import {loadMfsWorld,rasterize} from "./mfs/core.js?v=0.3.29";
export const CITY_ID="city_001";
export const isNewCity=map=>map===CITY_ID||map.startsWith(CITY_ID+".");
export async function registryFetcher(base,city,fetcher=fetch){
 const response=await fetcher(base+"world.json",{cache:"no-cache"});if(!response.ok)throw Error("Brak world.json");
 const registry=await response.json(),locations=registry.locations.filter(e=>(e.mapId===CITY_ID)===city);
 return (url,opts)=>url===base+"world.json"?Promise.resolve({ok:true,json:async()=>({...registry,locations})}):fetcher(url,opts);
}
export async function loadCityR2(base,fetcher=fetch){
 const proxy=await registryFetcher(base,true,fetcher),bundles=await loadMfsWorld(base,proxy);
 const b=bundles.find(b=>b.manifest.mapId===CITY_ID);
 if(!b||b.manifest.mapRevision!==2||b.scenes.size!==128||b.buildings.size!==79||[...b.parcels.values()].filter(p=>p.ownershipMode==="standard").length!==96)throw Error("Niekompletna rewizja Miasta 1");
 const exterior=b.scenes.get(CITY_ID);b.buildingCells=new Map();for(const v of b.buildings.values())for(const k of v.cells)b.buildingCells.set(k,v);
 b.plots=[...b.parcels.values()].filter(p=>p.ownershipMode==="standard").map(p=>{const g=p.geometry,v=[...b.buildings.values()].find(v=>v.parcelId===p.id);return {id:p.id,city:CITY_ID,name:p.name,bounds:[g.x,g.y,g.x+g.w-1,g.y+g.h-1],buildingId:v?.id||null,status:v?"occupied":"vacant",buildable:true,legacy:false};});
 const tavern=[...b.buildings.values()].find(v=>v.type==="inn"&&v.district==="D01");
 b.tavern=[...exterior.portals.values()].find(p=>p.map===tavern?.floorIds[0])||null;
 if(!b.tavern)throw Error("Brak wejścia do karczmy");
 return b;
}
export function createCityBackground(bundle,count=24){
 if(!bundle)return [];const s=bundle.scenes.get(CITY_ID),cells=new Set();
 for(const o of s.records.values())if(o.class==="R3"||o.type==="N4")for(const k of rasterize(o.geometry,s.width,s.height))if(!s.blocked(k%s.width,Math.floor(k/s.width))&&!s.doors.has(k)&&!s.portals.has(k))cells.add(k);
 const pool=[...cells].sort((a,b)=>a-b),actors=[];for(let i=0;i<Math.min(count,pool.length);i++){const k=pool[Math.floor((i+.5)*pool.length/count)];actors.push({id:"city-bg-"+i,map:CITY_ID,x:k%s.width,y:Math.floor(k/s.width),direction:"down",name:"Mieszkaniec",role:"Mieszkaniec",simulationClass:"ambient",color:["#8f7659","#677e83","#986761","#7b8861"][i%4],started:-1,duration:380,seed:i+1,nextMove:0});}return actors;
}
export function stepCityBackground(bundle,actors,player,doors,now){
 if(!bundle||player.map!==CITY_ID)return false;const s=bundle.scenes.get(CITY_ID),used=new Set(actors.map(a=>a.y*s.width+a.x));let changed=false;
 const dirs=[[1,0,"right"],[0,1,"down"],[-1,0,"left"],[0,-1,"up"]];
 for(const a of actors){if(now<a.nextMove||Math.abs(a.x-player.x)>32||Math.abs(a.y-player.y)>28)continue;a.seed=(Math.imul(a.seed,1664525)+1013904223)>>>0;a.nextMove=now+650+a.seed%1800;
  for(let i=0;i<4;i++){const [dx,dy,dir]=dirs[(a.seed+i)%4],x=a.x+dx,y=a.y+dy,k=y*s.width+x,old=a.y*s.width+a.x;
   if(s.blocked(x,y)||s.portals.has(k)||s.doors.has(k)||used.has(k)||Math.abs(s.elevation[k]-s.elevation[old])>1||x===player.x&&y===player.y||!["road","stone","grass","meadow"].includes(s.tile(x,y)))continue;
   used.delete(old);used.add(k);a.fromX=a.x;a.fromY=a.y;a.x=x;a.y=y;a.direction=dir;a.started=now;changed=true;break;}
 }return changed;
}
