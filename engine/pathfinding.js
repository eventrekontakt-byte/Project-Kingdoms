// A* navigation on a single floor. Portals are route endpoints, not implicit teleports.
import {blocked,doorAt,mapSize,objectAt,transitionAt} from "./world.js";
import {cityStepAllowed,cityGateBarrierAt} from "./city-one.js";
import {elevationAt,resolveSurfaceStep} from "./elevation.js?v=0.3.12";
const DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
const key=(x,y,z=0)=>x+","+y+","+z;
export function findRoute(player,goal,doors={},gateStates={},options={}){
 const {w,h}=mapSize(player.map);
 const passable=(x,y)=>{
  if(x<0||y<0||x>=w||y>=h||blocked(player.map,player.floor,x,y))return false;
  const gate=player.map==="site-city1"?cityGateBarrierAt(x,y):null;
  if(gate&&gateStates[gate.id]==="closed")return false;
  const door=doorAt(player.map,player.floor,x,y);
  return !door||(doors[door.id]||door.initial)==="open";
 };
 const targetIsObject=Boolean(objectAt(player.map,player.floor,goal.x,goal.y));
 const targetDoor=doorAt(player.map,player.floor,goal.x,goal.y);
 const targetClosed=targetDoor&&(doors[targetDoor.id]||targetDoor.initial)!=="open";
 const goals=(targetIsObject||targetClosed)
  ?DIRS.map(([dx,dy])=>({x:goal.x+dx,y:goal.y+dy})).filter(p=>passable(p.x,p.y))
  :[goal].filter(p=>passable(p.x,p.y));
 if(!goals.length)return {path:[],reason:"Cel jest niedostępny."};
 const currentZ=Number.isInteger(player.z)?player.z:elevationAt(player.map,player.x,player.y,player.floor);
 const targetKeys=new Set(goals.map(p=>key(p.x,p.y,elevationAt(player.map,p.x,p.y,player.floor))));
 const heuristic=(x,y)=>Math.min(...goals.map(p=>Math.abs(x-p.x)+Math.abs(y-p.y)));
 const start=key(player.x,player.y,currentZ);
 if(targetKeys.has(start))return {path:[],reason:targetClosed?"Podejdź do drzwi i użyj E / Otwórz.":targetIsObject?"Użyj E / Zbadaj.":"Jesteś na miejscu."};
 const open=[{x:player.x,y:player.y,z:currentZ,g:0,f:heuristic(player.x,player.y)}],best=new Map([[start,0]]),parent=new Map(),closed=new Set();
 for(let n=0;open.length&&n<10000;n++){
  open.sort((a,b)=>a.f-b.f||a.g-b.g);
  const current=open.shift(),ck=key(current.x,current.y,current.z);
  if(closed.has(ck))continue;
  if(targetKeys.has(ck)){
   const route=[];let at=ck;
   while(at!==start){const [x,y,z]=at.split(",").map(Number);route.push({x,y,z});at=parent.get(at);}
   return {path:route.reverse(),reason:null};
  }
  closed.add(ck);
  for(const [dx,dy] of DIRS){
   const x=current.x+dx,y=current.y+dy;
   const step=resolveSurfaceStep(player.map,current,{x,y},player.floor);
   const k=key(x,y,step.z),g=current.g+1;
   if(options.localOnly&&transitionAt(player.map,player.floor,x,y)&&!targetKeys.has(k))continue;
   if(!step.allowed||!passable(x,y)||(player.map==="site-city1"&&!cityStepAllowed(current.x,current.y,x,y))||closed.has(k)||g>=(best.get(k)??Infinity))continue;
   best.set(k,g);parent.set(k,ck);open.push({x,y,z:step.z,g,f:g+heuristic(x,y)});
  }
 }
 return {path:[],reason:"Nie znaleziono trasy do celu."};
}
