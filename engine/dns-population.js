// DNS 1.0 / Alpha 0.3.25 — bounded, camera-streamed ambient population.
// Only real on-screen actors are objects. The city's simulated headcount is metadata.
import {CITY_WIDTH,CITY_HEIGHT,cityTile,cityGateBarrierAt} from "./city-one.js";
const CITY="site-city1", CHUNK=12, LIMIT=38, SYNC_MS=1300, GRACE_MS=14000;
const COLORS=["#879dcb","#af876f","#b1a683","#7bafa7","#ce938f","#a397c4","#9bac83"];
const SKINS=["#eac49e","#9f6c4c","#c38f67","#edb783"];
const ROLES=["Przechodzień","Mieszkaniec","Tragarz","Podróżny","Robotnik"];
const FIRST=["Irena","Stefan","Mila","Szymon","Elena","Wojciech","Talia","Otto","Wanda","Artur","Nina","Mirosław"];
const STEPS=[[1,0],[-1,0],[0,1],[0,-1]];
function hash(x){x=Math.imul(x^x>>>16,0x7feb352d);x=Math.imul(x^x>>>15,0x846ca68b);return (x^x>>>16)>>>0;}
function key(cx,cy){return cx+","+cy;}
function terrain(x,y,gateStates){
 if(x<2||y<2||x>=CITY_WIDTH-2||y>=CITY_HEIGHT-2)return 0;
 const t=cityTile(x,y);
 if(t!=="road"&&t!=="grass"&&t!=="meadow"&&t!=="stone")return 0;
 const gate=cityGateBarrierAt(x,y);
 if(gate&&gateStates?.[gate.id]==="closed")return 0;
 return t==="road"?2:1;
}
function district(x,y){
 if(x>84&&x<133&&y>71&&y<114)return "market";
 if(x>130&&x<166&&y>54&&y<127)return "craft";
 if(x>43&&x<77&&y>28&&y<65)return "castle";
 if(x<27||x>166||y<20||y>140)return "rural";
 return "housing";
}
function rect(camera,view){
 const size=Math.max(1,view.size||32),halfW=(view.w||600)/(2*size),halfH=(view.h||480)/(2*size);
 return {left:camera.x-halfW,right:camera.x+halfW,top:camera.y-halfH,bottom:camera.y+halfH};
}
function inside(a,b,x,y,margin=0){
 return x>=a.left-margin&&x<=a.right+margin&&y>=a.top-margin&&y<=a.bottom+margin;
}
function peopleAt(fixed,actors,x,y,player){
 if(x===player.x&&y===player.y)return true;
 for(const n of fixed)if(n.map===CITY&&n.x===x&&n.y===y)return true;
 for(const n of actors)if(n.map===CITY&&n.x===x&&n.y===y)return true;
 return false;
}
export const AMBIENT_CONFIG=Object.freeze({chunkSize:CHUNK,maxActive:LIMIT,syncMs:SYNC_MS,despawnGraceMs:GRACE_MS,populationPotential:650});
export function createAmbientPopulation(){
 return {actors:[],loaded:new Set(),serial:0,lastSync:-Infinity,generated:0,removed:0};
}
export function resetAmbientPopulation(pop){
 pop.actors.length=0;pop.loaded.clear();pop.lastSync=-Infinity;pop.serial=0;pop.generated=0;pop.removed=0;
}
function density(x,y,clock){
 const type=district(x,y),hour=clock.hour,day=hour>=7&&hour<20;
 if(!day)return type==="market"?1:0;
 return type==="market"?3:type==="craft"?2:type==="housing"?2:type==="castle"?1:1;
}
function candidateSeed(cx,cy,slot,clock){
 return hash(cx*23719 ^ cy*56311 ^ slot*16127 ^ (clock.day||1)*311 ^ Math.floor(clock.hour/4)*701);
}
function chooseSpawn(pop,cx,cy,slot,clock,viewRect,gateStates,fixed,player){
 const h=candidateSeed(cx,cy,slot,clock);
 for(let j=0;j<42;j++){
  const x=cx*CHUNK+((h+j*7+j*j)%CHUNK);
  const y=cy*CHUNK+((h>>>8+j*5+j*j*3)%CHUNK);
  if(inside(viewRect,null,x,y,2.5))continue; // never materialise on camera
  if(!terrain(x,y,gateStates)||peopleAt(fixed,pop.actors,x,y,player))continue;
  const role=ROLES[(h>>>3)%ROLES.length],id="ambient-"+(++pop.serial);
  return {id,name:FIRST[(h>>>7)%FIRST.length],role,color:COLORS[(h>>>10)%COLORS.length],
   skin:SKINS[(h>>>15)%SKINS.length],simulationClass:"ambient",important:false,map:CITY,x,y,
   fromX:x,fromY:y,direction:STEPS[h%4][0]?"right":"down",started:-1,duration:350,
   nextMove:0,seed:h,goal:null,talking:false,met:0,createdAt:0,unseenSince:0,
   district:district(x,y),task:"Przechodzi przez miasto",workTitle:"okoliczne ulice",venueName:"mieście"};
 }
 return null;
}
// Stream only the camera's buffered chunk ring, independently of the full city map.
export function syncAmbientPopulation(pop,player,camera,view,clock,now,fixed=[],gateStates={}){
 if(player.map!==CITY)return false;
 if(now-pop.lastSync<SYNC_MS)return false;
 pop.lastSync=now;
 const box=rect(camera,view),buffer=CHUNK*1.8;
 const loX=Math.max(0,Math.floor((box.left-buffer)/CHUNK)),hiX=Math.min(Math.ceil(CITY_WIDTH/CHUNK)-1,Math.floor((box.right+buffer)/CHUNK));
 const loY=Math.max(0,Math.floor((box.top-buffer)/CHUNK)),hiY=Math.min(Math.ceil(CITY_HEIGHT/CHUNK)-1,Math.floor((box.bottom+buffer)/CHUNK));
 let changed=false;
 for(let i=pop.actors.length-1;i>=0;i--){
  const a=pop.actors[i],inBuffer=inside(box,null,a.x,a.y,buffer);
  if(inBuffer){a.unseenSince=0;continue;}
  if(!a.unseenSince)a.unseenSince=now;
  // Keep anyone still visible, followed, interacting or inside their grace period.
  if(!inside(box,null,a.x,a.y,1)&&!a.talking&&!a.followed&&now-a.unseenSince>GRACE_MS){
   pop.actors.splice(i,1);pop.removed++;changed=true;
  }
 }
 // Re-arm chunks only after the camera leaves them for a time; no per-frame churn.
 const activeChunks=new Set();
 for(let cy=loY;cy<=hiY;cy++)for(let cx=loX;cx<=hiX;cx++)activeChunks.add(key(cx,cy));
 for(const old of [...pop.loaded])if(!activeChunks.has(old))pop.loaded.delete(old);
 for(let cy=loY;cy<=hiY&&pop.actors.length<LIMIT;cy++)for(let cx=loX;cx<=hiX&&pop.actors.length<LIMIT;cx++){
  const id=key(cx,cy);if(pop.loaded.has(id))continue;pop.loaded.add(id);
  const midX=cx*CHUNK+CHUNK/2,midY=cy*CHUNK+CHUNK/2;
  const count=density(midX,midY,clock);
  for(let slot=0;slot<count&&pop.actors.length<LIMIT;slot++){
   let a=chooseSpawn(pop,cx,cy,slot,clock,box,gateStates,fixed,player);
   if(!a)continue;
   a.createdAt=now;a.nextMove=now+500+(a.seed%800);pop.actors.push(a);pop.generated++;changed=true;
  }
 }
 return changed;
}
function chooseGoal(n,gateStates){
 const radius=n.district==="market"?8:12;
 for(let j=0;j<18;j++){
  const h=hash(n.seed+=0x9e3779b9);
  const x=n.x+(h% (radius*2+1))-radius;
  const y=n.y+((h>>>10)%(radius*2+1))-radius;
  const walk=terrain(x,y,gateStates);
  const distance=Math.abs(x-n.x)+Math.abs(y-n.y);
  if(walk&&distance>=5&&(!n.district||district(x,y)===n.district||walk===2))return {x,y};
 }
 return {x:n.x+3,y:n.y};
}
// Very cheap L0 movement: no A*, needs only up to four neighbour checks.
// Opportunistic road preference + consistent goal gives believable traffic.
export function moveAmbientPopulation(pop,player,camera,view,clock,now,fixed=[],gateStates={}){
 if(player.map!==CITY)return false;
 let changed=false;const occupied=new Set();
 for(const n of fixed)if(n.map===CITY)occupied.add(n.x+","+n.y);
 for(const n of pop.actors)occupied.add(n.x+","+n.y);
 occupied.add(player.x+","+player.y);
 for(const n of pop.actors){
  if(now<n.nextMove||n.talking)continue;
  n.nextMove=now+430+(hash(n.seed++)%450);
  const goal=n.goal;
  if(!goal||Math.abs(goal.x-n.x)+Math.abs(goal.y-n.y)<=1)n.goal=chooseGoal(n,gateStates);
  const routes=STEPS.map(([dx,dy],k)=>{
   const nx=n.x+dx,ny=n.y+dy,v=terrain(nx,ny,gateStates);
   return {dx,dy,x:nx,y:ny,score:!v?1e6:(Math.abs(nx-n.goal.x)+Math.abs(ny-n.goal.y))*10-(v===2?4:0)+((hash(n.seed+k)%4)/4)};
  }).sort((a,b)=>a.score-b.score);
  const dest=routes.find(v=>v.score<1e5&&!occupied.has(v.x+","+v.y));
  if(!dest){n.goal=null;continue;}
  // Allow a small detour when blocked rather than jittering in place.
  occupied.delete(n.x+","+n.y);occupied.add(dest.x+","+dest.y);
  n.fromX=n.x;n.fromY=n.y;n.x=dest.x;n.y=dest.y;
  n.direction=dest.dx>0?"right":dest.dx<0?"left":dest.dy>0?"down":"up";
  n.started=now;n.duration=320;n.nextMove=now+n.duration+260+(hash(n.seed++)%420);
  changed=true;
 }
 return changed;
}
export function activeAmbient(pop){return pop.actors;}
