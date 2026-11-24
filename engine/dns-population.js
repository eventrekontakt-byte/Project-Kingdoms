// DNS 1.0 / Alpha 0.3.26 — observation-aware hybrid population.
// Only real on-screen actors are objects. The city's simulated headcount is metadata.
import {CITY_WIDTH,CITY_HEIGHT,cityTile,cityGateBarrierAt} from "./city-one.js";
import {links,linkFor,at,floorTile,freeAt,enterPortal,leavePortal,wanderInterior} from "./npc-doors.js?v=0.3.27";
const MAX_MEMORY=32,MAX_VISITORS=3;
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
 return {actors:[],remembered:new Map(),loaded:new Set(),serial:0,lastSync:-Infinity,generated:0,removed:0,focusId:null,manualFocus:false,focusLostAt:0,lastObservationAt:null,suppressUntil:0};
}
export function resetAmbientPopulation(pop){
 pop.actors.length=0;pop.remembered.clear();pop.loaded.clear();pop.lastSync=-Infinity;pop.serial=0;pop.generated=0;pop.removed=0;pop.focusId=null;pop.manualFocus=false;pop.focusLostAt=0;pop.lastObservationAt=null;pop.suppressUntil=0;
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
  pop.focusId=null;pop.manualFocus=false;actor.followed=false;pop.suppressUntil=(pop.lastObservationAt||0)+8000;return false;
 }
 const old=pop.actors.find(a=>a.id===pop.focusId);if(old)old.followed=false;
 pop.focusId=id;pop.manualFocus=true;pop.focusLostAt=0;actor.followed=true;
 return true;
}
export function currentAmbientFocus(pop){return pop.actors.find(a=>a.id===pop.focusId)||null;}
function snapshot(n,now){
 const {id,name,role,color,skin,map,x,y,direction,seed,district,met,task,workTitle,venueName}=n;
 return {id,name,role,color,skin,map,x,y,direction,seed,district,met:met||0,task,workTitle,venueName,remaining:Math.max(0,Math.min(35000,(n.visitUntil||now)-now))};
}
export function rememberAmbient(pop,n,now=0){
 if(!n)return;
 if(!pop.remembered.has(n.id)&&pop.remembered.size>=MAX_MEMORY){
  const ids=[...pop.remembered.keys()].filter(id=>id!==pop.focusId&&!pop.actors.some(a=>a.id===id&&a.talking));
  ids.sort((a,b)=>(pop.remembered.get(a).met>0)-(pop.remembered.get(b).met>0));
  if(!ids.length)return;pop.remembered.delete(ids[0]);
 }
 pop.remembered.delete(n.id);pop.remembered.set(n.id,snapshot(n,now));
}
export function exportAmbientState(pop,now=0){
 for(const n of pop.actors)if(pop.remembered.has(n.id))pop.remembered.set(n.id,snapshot(n,now));
 return {serial:pop.serial,remembered:[...pop.remembered.values()]};
}
function hydrate(r,now){
 return {...r,simulationClass:"ambient",important:false,indoors:r.map!==CITY,visitId:linkFor(r.map)?.id||null,fromX:r.x,fromY:r.y,started:-1,duration:320,nextMove:now+450,goal:null,route:[],nextPlan:0,nextVisit:now+4000,visitUntil:now+(r.remaining||12000),talking:false,followed:false,unseenSince:0,createdAt:now,visibleLastAt:0,simulationLevel:0,observationMs:0,focusMs:0};
}
export function restoreAmbientState(pop,data,now=0,player=null,fixed=[],gateStates={}){
 resetAmbientPopulation(pop);
 if(!data||!Array.isArray(data.remembered))return;
 pop.serial=Math.max(0,Math.min(1e9,Number(data.serial)||0));
 for(const r of data.remembered.slice(-MAX_MEMORY)){
  if(!r||!/^ambient-\d+$/.test(r.id)||typeof r.name!=="string"||!Number.isInteger(r.x)||!Number.isInteger(r.y)||pop.remembered.has(r.id))continue;
  if(r.map===CITY?!terrain(r.x,r.y,gateStates):!linkFor(r.map)||!floorTile(r.map,r.x,r.y))continue;
  pop.serial=Math.max(pop.serial,Number(r.id.split("-")[1]));
  const a=hydrate({...r,name:r.name.slice(0,50),role:typeof r.role==="string"?r.role:"Mieszkaniec",color:COLORS.includes(r.color)?r.color:COLORS[0],skin:SKINS.includes(r.skin)?r.skin:SKINS[0],seed:(Number(r.seed)||1)>>>0,direction:["up","down","left","right"].includes(r.direction)?r.direction:"down",met:Math.max(0,Math.min(999,Number(r.met)||0)),task:typeof r.task==="string"?r.task:"Spaceruje",workTitle:typeof r.workTitle==="string"?r.workTitle:"okoliczne ulice",venueName:typeof r.venueName==="string"?r.venueName:"mieście",remaining:Math.max(0,Math.min(35000,Number(r.remaining)||0))},now);
  pop.remembered.set(a.id,snapshot(a,now));
  if(player&&a.map===player.map&&!player.floor&&Math.abs(a.x-player.x)<35&&Math.abs(a.y-player.y)<30&&freeAt(a.map,a,fixed.concat(pop.actors),player,a))pop.actors.push(a);
 }
}
function activateRemembered(pop,player,box,now,fixed,gateStates){
 let changed=false;
 for(const r of pop.remembered.values()){
  if(pop.actors.length>=LIMIT||pop.actors.some(a=>a.id===r.id))continue;
  const outside=r.map===CITY&&player.map===CITY&&inside(box,null,r.x,r.y,CHUNK*1.8)&&!inside(box,null,r.x,r.y,2.5)&&terrain(r.x,r.y,gateStates);
  const insideRoom=r.map!==CITY&&r.map===player.map&&!player.floor&&floorTile(r.map,r.x,r.y);
  if((outside||insideRoom)&&freeAt(r.map,r,fixed.concat(pop.actors),player,null)){pop.actors.push(hydrate(r,now));changed=true;}
 }
 return changed;
}

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
 const box=rect(camera,view),visible=n=>n.map===CITY&&inside(box,null,n.x,n.y,.15);
 let focus=currentAmbientFocus(pop);
 if(focus&&visible(focus)){pop.focusLostAt=0;}
 else if(focus){
  if(!pop.focusLostAt)pop.focusLostAt=now;
  if(now-pop.focusLostAt>(focus.map===CITY?8500:30000)){
   focus.followed=false;pop.focusId=null;pop.manualFocus=false;focus=null;
  }
 }
 if(!focus&&now>=pop.suppressUntil){
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
   // Exactly one full-priority observed character at once.
   for(const other of pop.actors)if(other!==n&&other.simulationLevel===2){
    other.simulationLevel=1;if(!other.visitId){other.route=[];other.nextPlan=0;}
   }
   n.simulationLevel=2;if(!n.visitId){n.route=[];n.goal=null;n.nextPlan=0;}
   n.task="Podróżuje do wybranego celu w mieście";rememberAmbient(pop,n,now);updated=true;
  }
  if(n.simulationLevel===0&&advanced<MAX_ADVANCED&&n.observationMs>=OBSERVE_MS){
   n.simulationLevel=1;if(!n.visitId){n.goal=null;n.route=[];n.nextPlan=0;}
   n.task="Spaceruje według własnego planu";if(n===focus&&pop.manualFocus)rememberAmbient(pop,n,now);advanced++;updated=true;
  }
 }
 return updated;
}
// Stream only the camera's buffered chunk ring, independently of the full city map.
export function syncAmbientPopulation(pop,player,camera,view,clock,now,fixed=[],gateStates={}){
 if(player.map!==CITY)return activateRemembered(pop,player,null,now,fixed,gateStates);
 if(now-pop.lastSync<SYNC_MS)return false;
 pop.lastSync=now;
 const box=rect(camera,view),buffer=CHUNK*1.8;
 const loX=Math.max(0,Math.floor((box.left-buffer)/CHUNK)),hiX=Math.min(Math.ceil(CITY_WIDTH/CHUNK)-1,Math.floor((box.right+buffer)/CHUNK));
 const loY=Math.max(0,Math.floor((box.top-buffer)/CHUNK)),hiY=Math.min(Math.ceil(CITY_HEIGHT/CHUNK)-1,Math.floor((box.bottom+buffer)/CHUNK));
 let changed=activateRemembered(pop,player,box,now,fixed,gateStates);
 for(let i=pop.actors.length-1;i>=0;i--){
  const a=pop.actors[i];if(a.map!==CITY)continue;
  const inBuffer=inside(box,null,a.x,a.y,buffer);
  if(inBuffer){a.unseenSince=0;continue;}
  if(!a.unseenSince)a.unseenSince=now;
  // Keep anyone still visible, followed, interacting or inside their grace period.
  if(!inside(box,null,a.x,a.y,1)&&!a.talking&&!a.followed&&now-a.unseenSince>GRACE_MS){
   if(pop.focusId===a.id){pop.focusId=null;pop.manualFocus=false;}
   if(pop.remembered.has(a.id))rememberAmbient(pop,a,now);
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
 let changed=false;const occupied=new Set(),all=fixed.concat(pop.actors);
 let visitors=pop.actors.filter(a=>a.visitId).length,plans=0;
 for(const n of fixed)if(n.map===CITY)occupied.add(n.x+","+n.y);
 for(const n of pop.actors)if(n.map===CITY)occupied.add(n.x+","+n.y);
 if(player.map===CITY)occupied.add(player.x+","+player.y);
 for(const n of pop.actors){
  if(now<n.nextMove||n.talking)continue;
  if(n.map!==CITY){
   const l=linkFor(n.map);if(!l)continue;
   if(now>=n.visitUntil){
    if(leavePortal(n,l,all,player,now,gateStates)){
     changed=true;if(n.map===CITY){Object.assign(n,{indoors:false,visitId:null,route:[],goal:null,nextVisit:now+18000,task:"Wraca na ulice miasta"});occupied.add(n.x+","+n.y);visitors=Math.max(0,visitors-1);}
    }
   }else if(wanderInterior(n,l,all,player,now))changed=true;
   continue;
  }
  if(player.map!==CITY&&!n.visitId)continue;
  if(n.visitId){
   const l=links.find(l=>l.id===n.visitId);
   if(l&&at(n,l.outside)){
    const old=n.x+","+n.y;
    if(enterPortal(n,l,all,player,now)){occupied.delete(old);Object.assign(n,{indoors:true,route:[],goal:null,visitUntil:now+15000+hash(n.seed)%12000,task:"Odwiedza: "+l.name});changed=true;}
    else n.nextMove=now+500;
    continue;
   }
   if(!l||(!n.route.length&&now>=n.nextPlan)){
    n.route=l?plannedWalk(n,l.outside,gateStates):[];
    if(!n.route.length){n.visitId=null;n.goal=null;n.nextVisit=now+10000;visitors=Math.max(0,visitors-1);}
   }
  }
  if(!n.visitId&&plans<2&&now>=(n.nextVisit||n.createdAt+3000)&&player.map===CITY&&visitors<(n.simulationLevel===2?MAX_VISITORS:MAX_VISITORS-1)){
   const nearby=links.filter(l=>/karczma|targ|piekarnia|apteka|biblioteka|switynia|kasyno|kuznia|stajnia/.test(l.id)).map(l=>({l,dist:Math.abs(l.outside.x-n.x)+Math.abs(l.outside.y-n.y)})).filter(a=>a.dist<=(n.simulationLevel===2?65:16)&&terrain(a.l.outside.x,a.l.outside.y,gateStates)).sort((a,b)=>a.dist-b.dist);
   n.nextVisit=now+9000+hash(n.seed)%9000;
   for(const {l} of nearby.slice(0,2)){
    if(pop.actors.some(a=>a!==n&&a.visitId===l.id))continue;
    if(plans>=2)break;plans++;
    const route=plannedWalk(n,l.outside,gateStates);
    if(route.length||at(n,l.outside)){Object.assign(n,{visitId:l.id,route,goal:l.outside,nextPlan:now+1000,task:"Idzie do: "+l.name,venueName:l.name});visitors++;break;}
   }
  }
  n.nextMove=now+430+(hash(n.seed++)%450);
  if(n.simulationLevel>0||n.visitId){
   // One route every few seconds per promoted actor; no visual teleport.
   if(!n.visitId&&!n.route.length&&now>=n.nextPlan){
    const destination=longTermGoal(n,gateStates);
    const candidate=plannedWalk(n,destination,gateStates);
    n.nextPlan=now+(candidate.length?3500:4800);
    if(candidate.length){n.goal=destination;n.route=candidate;}
   }
   if(n.route.length){
    const next=n.route[0],key=next.x+","+next.y;
    if(!occupied.has(key)&&terrain(next.x,next.y,gateStates)){
     occupied.delete(n.x+","+n.y);occupied.add(key);
     n.fromX=n.x;n.fromY=n.y;n.x=next.x;n.y=next.y;n.route.shift();
     n.direction=next.x>n.fromX?"right":next.x<n.fromX?"left":next.y>n.fromY?"down":"up";
     n.started=now;n.duration=330;n.nextMove=now+550+(hash(n.seed++)%170);
     n.stalled=0;if(!n.route.length)n.nextPlan=now+1100;
     changed=true;continue;
    }
    n.nextMove=now+290;
    // A blocked step will be re-planned after a modest delay, without
    // rapidly recalculating A* for each passer-by.
    n.stalled=(n.stalled||0)+1;
    if(n.stalled>10){n.route=[];n.nextPlan=now+2500;n.stalled=0;}
    continue;
   }
   n.stalled=0;
   if(n.visitId){n.nextMove=now+350;continue;}
  }
  if(player.map!==CITY)continue;
  if(!n.goal||Math.abs(n.goal.x-n.x)+Math.abs(n.goal.y-n.y)<=1)n.goal=chooseGoal(n,gateStates,camera,view);
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
