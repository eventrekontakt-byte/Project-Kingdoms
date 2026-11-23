// DNS 1.0 / Alpha 0.3.26 — observation-aware hybrid population.
// Only real on-screen actors are objects. The city's simulated headcount is metadata.
import {CITY_WIDTH,CITY_HEIGHT,cityTile,cityGateBarrierAt} from "./city-one.js";
const CITY="site-city1", CHUNK=12, LIMIT=38, SYNC_MS=1300, GRACE_MS=14000;
const OBSERVE_MS=20000,FOLLOW_MS=60000,MAX_ADVANCED=3,MAX_FOLLOWED=1;
const N=CITY_WIDTH*CITY_HEIGHT;
const visit=new Uint32Array(N),parent=new Int32Array(N),queue=new Int32Array(N);
let searchSerial=0;
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
export const AMBIENT_CONFIG=Object.freeze({chunkSize:CHUNK,maxActive:LIMIT,syncMs:SYNC_MS,despawnGraceMs:GRACE_MS,populationPotential:650,observationMs:OBSERVE_MS,followMs:FOLLOW_MS,maxAdvanced:MAX_ADVANCED,maxFollowed:MAX_FOLLOWED});
export function createAmbientPopulation(){
 return {actors:[],loaded:new Set(),serial:0,lastSync:-Infinity,generated:0,removed:0,focusId:null,manualFocus:false,focusLostAt:0,lastObservationAt:null};
}
export function resetAmbientPopulation(pop){
 pop.actors.length=0;pop.loaded.clear();pop.lastSync=-Infinity;pop.serial=0;pop.generated=0;pop.removed=0;pop.focusId=null;pop.manualFocus=false;pop.focusLostAt=0;pop.lastObservationAt=null;
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
   district:district(x,y),task:"Przechodzi przez miasto",workTitle:"okoliczne ulice",venueName:"mieście",simulationLevel:0,observationMs:0,focusMs:0,visibleLastAt:0,route:[],nextPlan:0};
 }
 return null;
}
// Manual observation selects a real object and preserves its appearance
// and coordinates. Touch it again to release explicit focus.
export function focusAmbient(pop,id){
 const actor=pop.actors.find(a=>a.id===id);
 if(!actor)return false;
 if(pop.focusId===id&&pop.manualFocus){
  pop.focusId=null;pop.manualFocus=false;actor.followed=false;return false;
 }
 const old=pop.actors.find(a=>a.id===pop.focusId);if(old)old.followed=false;
 pop.focusId=id;pop.manualFocus=true;pop.focusLostAt=0;actor.followed=true;
 return true;
}
export function currentAmbientFocus(pop){return pop.actors.find(a=>a.id===pop.focusId)||null;}
function routeKey(x,y){return y*CITY_WIDTH+x;}
function longTermGoal(n,gateStates){
 const landmarks=[[100,98],[79,112],[96,92],[113,103],[72,88],[144,93],[57,63],[130,112]];
 if(n.simulationLevel===2){
  const start=hash(n.seed)%landmarks.length;
  for(let j=0;j<landmarks.length;j++){
   const [x,y]=landmarks[(start+j)%landmarks.length];
   if(terrain(x,y,gateStates)&&Math.abs(x-n.x)+Math.abs(y-n.y)>12)return {x,y};
  }
 }
 const span=n.simulationLevel>=2?24:16;
 for(let j=0;j<24;j++){
  const h=hash(n.seed+j*17921),dx=h%(2*span+1)-span,dy=(h>>>11)%(2*span+1)-span;
  const x=n.x+dx,y=n.y+dy;
  if(terrain(x,y,gateStates)&&Math.abs(dx)+Math.abs(dy)>=10)return {x,y};
 }
 return null;
}
// Bounded path planning is reserved for at most three upgraded passers-by;
// the rest keep their four-neighbour lightweight movement.
function plannedWalk(n,dest,gateStates){
 if(!dest||!terrain(dest.x,dest.y,gateStates))return [];
 const begin=routeKey(n.x,n.y),end=routeKey(dest.x,dest.y);
 if(begin===end)return [];
 if(++searchSerial>4294967000){visit.fill(0);searchSerial=1;}
 visit[begin]=searchSerial;parent[begin]=-1;
 let read=0,write=1;queue[0]=begin;
 while(read<write&&read<6500){
  const at=queue[read++];if(at===end)break;
  const x=at%CITY_WIDTH,y=Math.floor(at/CITY_WIDTH);
  for(let j=0;j<4;j++){
   const [dx,dy]=STEPS[(j+n.seed)%4],nx=x+dx,ny=y+dy;
   if(!terrain(nx,ny,gateStates))continue;
   const next=routeKey(nx,ny);if(visit[next]===searchSerial)continue;
   visit[next]=searchSerial;parent[next]=at;queue[write++]=next;
   if(next===end)break;
  }
  if(visit[end]===searchSerial)break;
 }
 if(visit[end]!==searchSerial)return [];
 const path=[];
 for(let current=end;current!==begin;current=parent[current]){
  if(current<0||path.length>240)return [];
  path.push({x:current%CITY_WIDTH,y:Math.floor(current/CITY_WIDTH)});
 }
 return path.reverse();
}
export function observeAmbientPopulation(pop,player,camera,view,now){
 if(player.map!==CITY){pop.lastObservationAt=null;return false;}
 const dt=pop.lastObservationAt===null?0:Math.max(0,Math.min(550,now-pop.lastObservationAt));
 pop.lastObservationAt=now;
 const box=rect(camera,view),visible=n=>inside(box,null,n.x,n.y,.15);
 let focus=currentAmbientFocus(pop);
 if(focus&&visible(focus)){pop.focusLostAt=0;}
 else if(focus){
  if(!pop.focusLostAt)pop.focusLostAt=now;
  if(now-pop.focusLostAt>8500){
   focus.followed=false;pop.focusId=null;pop.manualFocus=false;focus=null;
  }
 }
 if(!focus){
  // At most one automatically focused pedestrian; proximity and staying
  // close distinguish intentional following from a busy visible market.
  const candidates=pop.actors.filter(n=>visible(n)&&Math.abs(n.x-player.x)+Math.abs(n.y-player.y)<=5);
  candidates.sort((a,b)=>(Math.abs(a.x-player.x)+Math.abs(a.y-player.y))-
    (Math.abs(b.x-player.x)+Math.abs(b.y-player.y))||b.observationMs-a.observationMs);
  focus=candidates[0]||null;
  if(focus){pop.focusId=focus.id;pop.manualFocus=false;pop.focusLostAt=0;}
 }
 let updated=false;
 let advanced=pop.actors.filter(n=>n.simulationLevel>0).length;
 for(const n of pop.actors){
  const onscreen=visible(n),distance=Math.abs(n.x-player.x)+Math.abs(n.y-player.y);
  if(onscreen)n.visibleLastAt=now;
  if(onscreen&&n===focus&&distance<=14){
   n.observationMs+=dt;n.focusMs+=dt;
  }else if(onscreen&&distance<=4){
   n.observationMs+=dt*.25;
  }else n.observationMs=Math.max(0,n.observationMs-dt*.15);
  if(n===focus&&n.simulationLevel===1&&n.focusMs>=FOLLOW_MS){
   n.simulationLevel=2;n.route=[];n.goal=null;n.nextPlan=0;
   n.task="Podróżuje do wybranego celu w mieście";updated=true;
  }
  if(n.simulationLevel===0&&advanced<MAX_ADVANCED&&n.observationMs>=OBSERVE_MS){
   n.simulationLevel=1;n.goal=null;n.route=[];n.nextPlan=0;
   n.task="Spaceruje według własnego planu";advanced++;updated=true;
  }
 }
 return updated;
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
   if(pop.focusId===a.id){pop.focusId=null;pop.manualFocus=false;}
   pop.actors.splice(i,1);pop.removed++;changed=true;
  }
 }
 // Re-arm chunks only after the camera leaves them for a time; no per-frame churn.
 const activeChunks=new Set();
 for(let cy=loY;cy<=hiY;cy++)for(let cx=loX;cx<=hiX;cx++)activeChunks.add(key(cx,cy));
 for(const old of [...pop.loaded])if(!activeChunks.has(old))pop.loaded.delete(old);
 // Fill the closest buffered chunks first; walking crowds arrive from all
 // directions, instead of preferentially filling the northern map rows.
 const chunks=[];
 for(let cy=loY;cy<=hiY;cy++)for(let cx=loX;cx<=hiX;cx++){
  const mx=cx*CHUNK+CHUNK/2,my=cy*CHUNK+CHUNK/2;
  const dx=mx-camera.x,dy=my-camera.y;
  chunks.push({cx,cy,score:dx*dx+dy*dy+hash(cx*997+cy*321)%11});
 }
 chunks.sort((a,b)=>a.score-b.score);
 for(const {cx,cy} of chunks){
  if(pop.actors.length>=LIMIT)break;
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
function chooseGoal(n,gateStates,camera,view){
 // New pedestrians should enter the scene from adjacent streets, rather
 // than wandering indefinitely beyond the camera. Never teleport them.
 const box=rect(camera,view);
 if(!inside(box,null,n.x,n.y,0)){
  const targetX=Math.max(Math.ceil(box.left+2),Math.min(Math.floor(box.right-2),n.x));
  const targetY=Math.max(Math.ceil(box.top+2),Math.min(Math.floor(box.bottom-2),n.y));
  for(let r=0;r<5;r++){
   const x=targetX+(hash(n.seed+r)%5)-2,y=targetY+((hash(n.seed+r)>>>6)%5)-2;
   if(terrain(x,y,gateStates))return {x,y};
  }
 }
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
  if(!goal||Math.abs(goal.x-n.x)+Math.abs(goal.y-n.y)<=1)n.goal=chooseGoal(n,gateStates,camera,view);
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
