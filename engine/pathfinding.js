// A* navigation on a single floor. Portals are route endpoints, not implicit teleports.
import {blocked,doorAt,mapSize,objectAt} from "./world.js";
const DIRS=[[0,-1],[1,0],[0,1],[-1,0]];
const key=(x,y)=>x+","+y;
export function findRoute(player,goal,doors={}){
 const {w,h}=mapSize(player.map);
 const passable=(x,y)=>{
  if(x<0||y<0||x>=w||y>=h||blocked(player.map,player.floor,x,y))return false;
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
 const targetKeys=new Set(goals.map(p=>key(p.x,p.y)));
 const heuristic=(x,y)=>Math.min(...goals.map(p=>Math.abs(x-p.x)+Math.abs(y-p.y)));
 const start=key(player.x,player.y);
 if(targetKeys.has(start))return {path:[],reason:targetClosed?"Podejdź do drzwi i użyj E / Otwórz.":targetIsObject?"Użyj E / Zbadaj.":"Jesteś na miejscu."};
 const open=[{x:player.x,y:player.y,g:0,f:heuristic(player.x,player.y)}],best=new Map([[start,0]]),parent=new Map(),closed=new Set();
 for(let n=0;open.length&&n<10000;n++){
  open.sort((a,b)=>a.f-b.f||a.g-b.g);
  const current=open.shift(),ck=key(current.x,current.y);
  if(closed.has(ck))continue;
  if(targetKeys.has(ck)){
   const route=[];let at=ck;
   while(at!==start){const [x,y]=at.split(",").map(Number);route.push({x,y});at=parent.get(at);}
   return {path:route.reverse(),reason:null};
  }
  closed.add(ck);
  for(const [dx,dy] of DIRS){
   const x=current.x+dx,y=current.y+dy,k=key(x,y),g=current.g+1;
   if(!passable(x,y)||closed.has(k)||g>=(best.get(k)??Infinity))continue;
   best.set(k,g);parent.set(k,ck);open.push({x,y,g,f:g+heuristic(x,y)});
  }
 }
 return {path:[],reason:"Nie znaleziono trasy do celu."};
}
