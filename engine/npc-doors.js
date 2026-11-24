// Shared ground-floor entrances based on the same portal graph as the player.
import {CITY_BUILDINGS,cityGateBarrierAt} from "./city-one.js";
import {transitionAt,tileAt,mapSize} from "./world.js";
const CITY="site-city1",STEPS=[[1,0],[-1,0],[0,1],[0,-1]];
export const floorTile=(map,x,y)=>["wood","stone","marble"].includes(tileAt(map,0,x,y));
export const at=(n,p)=>n.x===p.x&&n.y===p.y;
export const links=CITY_BUILDINGS.filter(b=>b.door&&!b.decorative).map(b=>{
 const dest=transitionAt(CITY,0,b.door.x,b.door.y);if(!dest)return null;
 const [dx,dy]={N:[0,-1],S:[0,1],W:[-1,0],E:[1,0]}[b.facing];
 const outside={x:b.door.x+dx,y:b.door.y+dy},inside={x:dest.x,y:dest.y};
 const exit=STEPS.map(([a,c])=>({x:inside.x+a,y:inside.y+c})).find(p=>transitionAt(dest.map,0,p.x,p.y)?.map===CITY);
 return exit?{id:b.id,name:b.name,map:dest.map,inside,outside,exit}:null;
}).filter(Boolean);
export const linkFor=map=>links.find(l=>l.map===map);
export function freeAt(map,p,actors,player,n){
 return !(player?.map===map&&!player.floor&&at(player,p))&&!actors.some(a=>a!==n&&a.map===map&&at(a,p));
}
function transfer(n,map,p,now){Object.assign(n,{map,x:p.x,y:p.y,fromX:p.x,fromY:p.y,started:-1,nextMove:now+450});}
function walk(n,p,now){n.fromX=n.x;n.fromY=n.y;n.x=p.x;n.y=p.y;n.direction=n.x>n.fromX?"right":n.x<n.fromX?"left":n.y>n.fromY?"down":"up";n.started=now;n.duration=300;n.nextMove=now+450;}
export function enterPortal(n,l,actors,player,now){
 if(!l||n.map!==CITY||!at(n,l.outside)||!floorTile(l.map,l.inside.x,l.inside.y)||!freeAt(l.map,l.inside,actors,player,n))return false;
 transfer(n,l.map,l.inside,now);return true;
}
function indoorNext(n,target,actors,player){
 const {w,h}=mapSize(n.map),seen=new Set([n.y*w+n.x]),q=[{x:n.x,y:n.y,first:null}];
 for(let i=0;i<q.length&&i<3000;i++)for(const [dx,dy] of STEPS){
  const p=q[i],x=p.x+dx,y=p.y+dy,k=y*w+x;
  if(x<0||y<0||x>=w||y>=h||seen.has(k)||!floorTile(n.map,x,y))continue;
  seen.add(k);const next={x,y},first=p.first||next;
  if(!freeAt(n.map,next,actors,player,n))continue;
  if(at(next,target))return first;q.push({x,y,first});
 }
 return null;
}
export function leavePortal(n,l,actors,player,now,gateStates={},coarse=false){
 if(!l||n.map!==l.map||now<n.nextMove)return false;
 if(!at(n,l.inside)&&!coarse){
  const p=indoorNext(n,l.inside,actors,player);
  if(p){walk(n,p,now);return true;}n.nextMove=now+550;return false;
 }
 const gate=cityGateBarrierAt(l.outside.x,l.outside.y);
 if((gate&&gateStates[gate.id]==="closed")||!freeAt(CITY,l.outside,actors,player,n)){n.nextMove=now+550;return false;}
 transfer(n,CITY,l.outside,now);return true;
}
export function wanderInterior(n,l,actors,player,now){
 if(now<n.nextMove)return false;
 for(let i=0;i<4;i++){
  const [dx,dy]=STEPS[(((n.seed||0)>>>0)+i)%4],p={x:n.x+dx,y:n.y+dy};
  if(at(p,l.inside)||!floorTile(n.map,p.x,p.y)||!freeAt(n.map,p,actors,player,n))continue;
  n.seed=((n.seed||0)+1)>>>0;walk(n,p,now);n.nextMove=now+850+n.seed%4*220;return true;
 }
 n.nextMove=now+550;return false;
}
