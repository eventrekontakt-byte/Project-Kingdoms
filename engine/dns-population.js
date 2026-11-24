// DNS 1.0 / Alpha 0.3.28.3 — city zoning and initial population.
// Only real on-screen actors are objects. The city's simulated headcount is metadata.
import {CITY_WIDTH,CITY_HEIGHT,cityTile,cityGateBarrierAt,cityPopulationZone,CITY_VACANT_PLOTS} from "./city-one.js";
import {links,linkFor,at,floorTile,freeAt,enterPortal,leavePortal,wanderInterior} from "./npc-doors.js?v=0.3.27";
const MAX_MEMORY=32,MAX_VISITORS=3;
const CITY="site-city1", CHUNK=12, LIMIT=38, SYNC_MS=650, GRACE_MS=4000;
const NEAR=12, BUFFER=22, HARD_BUFFER=34, SPAWN_BATCH=10, RETRY_MS=1800, SHIFT=8;
const OBSERVE_MS=20000,FOLLOW_MS=60000,MAX_ADVANCED=3,MAX_FOLLOWED=1;
const N=CITY_WIDTH*CITY_HEIGHT;
// Compute the polygon mask once, not on every movement/BFS check.
const urbanMask=new Uint8Array(N);
for(let y=0;y<CITY_HEIGHT;y++)for(let x=0;x<CITY_WIDTH;x++)if(cityPopulationZone(x,y))urbanMask[y*CITY_WIDTH+x]=1;
const urban=(x,y)=>Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<CITY_WIDTH&&y<CITY_HEIGHT&&urbanMask[y*CITY_WIDTH+x]===1;
const publicLink=l=>l&&urban(l.outside.x,l.outside.y)&&/karczma|targ|piekarnia|apteka|biblioteka|switynia|kasyno|kuznia|stajnia/.test(l.id);
const vacant=(x,y)=>CITY_VACANT_PLOTS.some(p=>x>=p.bounds[0]&&x<=p.bounds[2]&&y>=p.bounds[1]&&y<=p.bounds[3]);
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
 if(!urban(x,y))return 0;
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
 if(player.map===CITY&&x===player.x&&y===player.y)return true;
 for(const n of fixed)if(n.map===CITY&&n.x===x&&n.y===y)return true;
 for(const n of actors)if(n.map===CITY&&n.x===x&&n.y===y)return true;
 return false;
}
export const AMBIENT_CONFIG=Object.freeze({chunkSize:CHUNK,maxActive:LIMIT,syncMs:SYNC_MS,despawnGraceMs:GRACE_MS,nearRadius:NEAR,bufferRadius:BUFFER,spawnBatch:SPAWN_BATCH,populationPotential:650,observationMs:OBSERVE_MS,followMs:FOLLOW_MS,maxAdvanced:MAX_ADVANCED,maxFollowed:MAX_FOLLOWED});
export function createAmbientPopulation(){
 return {actors:[],remembered:new Map(),loaded:new Map(),serial:0,lastSync:-Infinity,lastArea:null,nearCount:0,visibleCount:0,generated:0,removed:0,reclaimed:0,focusId:null,manualFocus:false,focusLostAt:0,lastObservationAt:null,suppressUntil:0};
}
export function resetAmbientPopulation(pop){
 pop.actors.length=0;pop.remembered.clear();pop.loaded.clear();pop.lastSync=-Infinity;pop.lastArea=null;pop.nearCount=0;pop.visibleCount=0;pop.serial=0;pop.generated=0;pop.removed=0;pop.reclaimed=0;pop.focusId=null;pop.manualFocus=false;pop.focusLostAt=0;pop.lastObservationAt=null;pop.suppressUntil=0;
}
function density(x,y,clock){
 const type=district(x,y),hour=clock.hour,day=hour>=7&&hour<20;
 if(!day)return type==="market"?1:0;
 return type==="market"?3:type==="craft"?2:type==="housing"?2:type==="castle"?1:1;
}
function candidateSeed(cx,cy,slot,clock){
 return hash(cx*23719 ^ cy*56311 ^ slot*16127 ^ (clock.day||1)*311 ^ Math.floor(clock.hour/4)*701);
}
function distanceToBox(box,x,y){
 return Math.max(0,box.left-x,x-box.right,box.top-y,y-box.bottom);
}
function chooseSpawn(pop,cx,cy,slot,clock,viewRect,gateStates,fixed,player,maxDistance=BUFFER){
 // Try a varied deterministic sample, preferring roads just beyond the visible screen.
 const h=candidateSeed(cx,cy,slot,clock),offset=hash(h^Math.floor(pop.serial/3));
 let best=null,score=Infinity;
 for(let j=0;j<36;j++){
  const k=hash(offset+j*1777),x=cx*CHUNK+k%CHUNK,y=cy*CHUNK+(k>>>12)%CHUNK;
  const dist=distanceToBox(viewRect,x,y);
  if(dist<=2.5||dist>maxDistance)continue;
  const t=terrain(x,y,gateStates);if(!t||vacant(x,y)||peopleAt(fixed,pop.actors,x,y,player))continue;
  const cost=dist*3+(t===2?0:4)+(k%7)/7;
  if(cost<score){score=cost;best={x,y};}
  if(t===2&&dist<=4)break;
 }
 if(!best)return null;
 return makeActor(pop,best.x,best.y,h);
}
function makeActor(pop,x,y,h){
 const role=ROLES[(h>>>3)%ROLES.length],id="ambient-"+(++pop.serial);
 return {id,name:FIRST[(h>>>7)%FIRST.length],role,color:COLORS[(h>>>10)%COLORS.length],
  skin:SKINS[(h>>>15)%SKINS.length],simulationClass:"ambient",important:false,map:CITY,x,y,
  fromX:x,fromY:y,direction:STEPS[h%4][0]?"right":"down",started:-1,duration:350,
  nextMove:0,seed:h,goal:null,talking:false,met:0,createdAt:0,unseenSince:null,
  district:district(x,y),task:"Przechodzi przez miasto",workTitle:"okoliczne ulice",venueName:"mieście",simulationLevel:0,observationMs:0,focusMs:0,visibleLastAt:0,route:[],nextPlan:0};
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
 return {serial:pop.serial,remembered:[...pop.remembered.values()],active:pop.actors.slice(0,LIMIT).map(n=>snapshot(n,now))};
}
function hydrate(r,now){
 return {...r,simulationClass:"ambient",important:false,indoors:r.map!==CITY,visitId:linkFor(r.map)?.id||null,fromX:r.x,fromY:r.y,started:-1,duration:320,nextMove:now+450,goal:null,route:[],nextPlan:0,nextVisit:now+4000,visitUntil:now+(r.remaining||12000),talking:false,followed:false,unseenSince:null,createdAt:now,visibleLastAt:0,simulationLevel:0,observationMs:0,focusMs:0};
}
// Legacy saves may have remembered people outdoors. Keep their identity but
// relocate their stored position to the closest legal town street before activation.
function legacyTownPosition(x,y,gateStates){
 let best=null,cost=Infinity;
 for(let yy=20;yy<140;yy++)for(let xx=24;xx<168;xx++){
  const d=Math.abs(xx-x)+Math.abs(yy-y);if(d>=cost||!urban(xx,yy))continue;
  if(terrain(xx,yy,gateStates)!==2||vacant(xx,yy))continue;
  best={x:xx,y:yy};cost=d;
 }
 return best;
}
function validatedRecord(r,gateStates,remembered=false){
 if(!r||!/^ambient-\d+$/.test(r.id)||typeof r.name!=="string"||!Number.isInteger(r.x)||!Number.isInteger(r.y))return null;
 let p={map:r.map,x:r.x,y:r.y};
 if(r.map===CITY){
  if(!terrain(r.x,r.y,gateStates)){
   if(!remembered)return null;
   const spot=legacyTownPosition(r.x,r.y,gateStates);if(!spot)return null;p={map:CITY,...spot};
  }
 }else{
  const l=linkFor(r.map);
  if(!publicLink(l)||!floorTile(r.map,r.x,r.y)){
   if(!remembered||!l)return null;
   const spot=legacyTownPosition(l.outside.x,l.outside.y,gateStates);if(!spot)return null;p={map:CITY,...spot};
  }
 }
 return {...p,id:r.id,name:r.name.slice(0,50),role:ROLES.includes(r.role)?r.role:"Mieszkaniec",color:COLORS.includes(r.color)?r.color:COLORS[0],skin:SKINS.includes(r.skin)?r.skin:SKINS[0],seed:(Number(r.seed)||1)>>>0,direction:["up","down","left","right"].includes(r.direction)?r.direction:"down",met:Math.max(0,Math.min(999,Number(r.met)||0)),district:typeof r.district==="string"?r.district:district(p.x,p.y),task:typeof r.task==="string"?r.task.slice(0,150):"Spaceruje",workTitle:typeof r.workTitle==="string"?r.workTitle.slice(0,100):"okoliczne ulice",venueName:typeof r.venueName==="string"?r.venueName.slice(0,100):"mieście",remaining:Math.max(0,Math.min(35000,Number(r.remaining)||0))};
}
export function restoreAmbientState(pop,data,now=0,player=null,fixed=[],gateStates={}){
 resetAmbientPopulation(pop);
 if(!data||typeof data!=="object")return;
 pop.serial=Math.max(0,Math.min(1e9,Math.floor(Number(data.serial)||0)));
 const bump=r=>{pop.serial=Math.max(pop.serial,Number(r.id.split("-")[1]));};
 for(const raw of (Array.isArray(data.remembered)?data.remembered:[]).slice(-MAX_MEMORY)){
  const r=validatedRecord(raw,gateStates,true);if(!r||pop.remembered.has(r.id))continue;
  bump(r);pop.remembered.set(r.id,r);
 }
 // Exact active positions take priority over older remembered snapshots.
 const records=new Map();
 for(const raw of (Array.isArray(data.active)?data.active:[]).slice(0,LIMIT)){
  const r=validatedRecord(raw,gateStates);if(!r||records.has(r.id))continue;
  bump(r);records.set(r.id,r);if(pop.remembered.has(r.id))pop.remembered.set(r.id,r);
 }
 for(const r of pop.remembered.values())if(!records.has(r.id))records.set(r.id,r);
 if(!player)return;
 const anchor=player.map===CITY?player:linkFor(player.map)?.outside;
 let visitors=0;
 for(const r of records.values()){
  if(pop.actors.length>=LIMIT)break;
  const pos=r.map===CITY?r:linkFor(r.map)?.outside;
  const nearby=anchor&&pos&&Math.abs(pos.x-anchor.x)<35&&Math.abs(pos.y-anchor.y)<30;
  const same=r.map===player.map&&!player.floor;
  if(!(same&&r.map!==CITY)&&!nearby)continue;
  if(r.map!==CITY&&visitors>=MAX_VISITORS)continue;
  const a=hydrate(r,now);
  if(!freeAt(a.map,a,fixed.concat(pop.actors),player,a))continue;
  pop.actors.push(a);if(a.map!==CITY)visitors++;
 }
}
function activateRemembered(pop,player,box,now,fixed,gateStates,maxNew=SPAWN_BATCH){
 let changed=false,created=0;
 for(const r of pop.remembered.values()){
  if(created>=maxNew||pop.actors.length>=LIMIT||pop.actors.some(a=>a.id===r.id))continue;
  if(r.map!==CITY&&pop.actors.filter(a=>a.map!==CITY).length>=MAX_VISITORS)continue;
  const outside=r.map===CITY&&player.map===CITY&&inside(box,null,r.x,r.y,NEAR)&&!inside(box,null,r.x,r.y,2.5)&&terrain(r.x,r.y,gateStates);
  const insideRoom=r.map!==CITY&&r.map===player.map&&!player.floor&&publicLink(linkFor(r.map))&&floorTile(r.map,r.x,r.y);
  if((outside||insideRoom)&&freeAt(r.map,r,fixed.concat(pop.actors),player,null)){pop.actors.push(hydrate(r,now));created++;changed=true;}
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
 if(!dest||!terrain(n.x,n.y,gateStates)||!terrain(dest.x,dest.y,gateStates))return [];
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
// A local budget follows the camera; remote actors never monopolise the cap.
function actorDistance(a,box){
 const p=a.map===CITY?a:linkFor(a.map)?.outside;
 return p?distanceToBox(box,p.x,p.y):Infinity;
}
function visibleActor(a,player,box,now){
 if(a.map!==player.map||player.floor)return false;
 if(a.map!==CITY)return true; // never unload a visitor in the current room
 if(inside(box,null,a.x,a.y,1.5))return true;
 return a.started>=0&&now<a.started+a.duration&&inside(box,null,a.fromX,a.fromY,1.5);
}
function removeActor(pop,a,now,pressure=false){
 if(pop.remembered.has(a.id)||(a.followed&&(a.met>0||a.focusMs>=OBSERVE_MS)))rememberAmbient(pop,a,now);
 if(pop.focusId===a.id){pop.focusId=null;pop.manualFocus=false;pop.focusLostAt=0;}
 const i=pop.actors.indexOf(a);if(i<0)return false;
 pop.actors.splice(i,1);pop.removed++;if(pressure)pop.reclaimed++;return true;
}
function localTarget(camera,clock){
 const area=district(camera.x,camera.y),day=clock.hour>=7&&clock.hour<20;
 if(!day)return area==="market"?4:1;
 return area==="market"?18:area==="craft"?15:area==="housing"?14:area==="castle"?10:8;
}
export function syncAmbientPopulation(pop,player,camera,view,clock,now,fixed=[],gateStates={}){
 const isCity=player.map===CITY,entrance=isCity?null:linkFor(player.map);
 if(!isCity&&!entrance)return false;
 const anchor=isCity?camera:entrance.outside;
 const old=pop.lastArea,shift=!old||old.map!==player.map||Math.max(Math.abs(anchor.x-old.x),Math.abs(anchor.y-old.y))>=SHIFT;
 if(!shift&&now-pop.lastSync<SYNC_MS)return false;
 pop.lastSync=now;pop.lastArea={map:player.map,x:anchor.x,y:anchor.y};
 const box=isCity?rect(camera,view):{left:anchor.x,right:anchor.x,top:anchor.y,bottom:anchor.y};
 let changed=false;
 // Distant actors are removed immediately; nearby ones keep a short grace period.
 for(const a of [...pop.actors]){
  if(a.map===CITY&&!urban(a.x,a.y)||a.map!==CITY&&!publicLink(linkFor(a.map))){changed=removeActor(pop,a,now,true)||changed;continue;}
  if(visibleActor(a,player,box,now)||a.talking&&a.map===player.map){a.unseenSince=null;continue;}
  const d=actorDistance(a,box);
  if(d<=BUFFER){a.unseenSince=null;continue;}
  if(a.unseenSince==null)a.unseenSince=now;
  if(d>HARD_BUFFER||now-a.unseenSince>=GRACE_MS){
   changed=removeActor(pop,a,now,d>HARD_BUFFER)||changed;
  }
 }
 if(!isCity){
  changed=activateRemembered(pop,player,null,now,fixed,gateStates)||changed;
  pop.nearCount=pop.actors.filter(a=>a.map===player.map).length;pop.visibleCount=player.floor?0:pop.nearCount;
  return changed;
 }
 const nearActors=()=>pop.actors.filter(a=>a.map===CITY&&actorDistance(a,box)<=NEAR).length;
 const desired=urban(Math.floor(camera.x),Math.floor(camera.y))?localTarget(camera,clock):0;
 // Under pressure reclaim the farthest non-visible actors before spawning.
 // A followed actor is protected while nearby; its saved identity survives unloading.
 const need=Math.min(SPAWN_BATCH,Math.max(0,desired-nearActors()));
 const shortage=Math.max(0,need-(LIMIT-pop.actors.length));
 if(shortage){
  const victims=pop.actors.filter(a=>!visibleActor(a,player,box,now)&&!(a.talking&&a.map===player.map)&&actorDistance(a,box)>NEAR)
    .sort((a,b)=>(Boolean(a.followed)-Boolean(b.followed))||actorDistance(b,box)-actorDistance(a,box));
  for(const a of victims.slice(0,shortage))changed=removeActor(pop,a,now,true)||changed;
 }
 // Reappear remembered actors offscreen before creating unrelated new identities.
 const before=pop.actors.length;
 changed=activateRemembered(pop,player,box,now,fixed,gateStates)||changed;
 let budget=Math.max(0,SPAWN_BATCH-(pop.actors.length-before));
 const loX=Math.max(0,Math.floor((box.left-BUFFER)/CHUNK)),hiX=Math.min(Math.ceil(CITY_WIDTH/CHUNK)-1,Math.floor((box.right+BUFFER)/CHUNK));
 const loY=Math.max(0,Math.floor((box.top-BUFFER)/CHUNK)),hiY=Math.min(Math.ceil(CITY_HEIGHT/CHUNK)-1,Math.floor((box.bottom+BUFFER)/CHUNK));
 const chunks=[],counts=new Map(),activeChunks=new Set();
 for(const n of pop.actors)if(n.map===CITY){
  const id=key(Math.floor(n.x/CHUNK),Math.floor(n.y/CHUNK));counts.set(id,(counts.get(id)||0)+1);
 }
 for(let cy=loY;cy<=hiY;cy++)for(let cx=loX;cx<=hiX;cx++){
  const id=key(cx,cy),mx=cx*CHUNK+CHUNK/2,my=cy*CHUNK+CHUNK/2;
  activeChunks.add(id);
  const d=distanceToBox(box,mx,my),dx=mx-camera.x,dy=my-camera.y;
  chunks.push({cx,cy,id,d,score:d*100+Math.hypot(dx,dy)});
 }
 for(const id of pop.loaded.keys())if(!activeChunks.has(id))pop.loaded.delete(id);
 chunks.sort((a,b)=>a.score-b.score);
 // A sector is never permanently marked "loaded"; its live population is counted
 // again. Failed or successful spawn attempts receive a short retry cooldown.
 let near=nearActors();
 for(const c of chunks){
  if(!budget||pop.actors.length>=LIMIT)break;
  const mx=c.cx*CHUNK+CHUNK/2,my=c.cy*CHUNK+CHUNK/2,target=density(mx,my,clock);
  if(!target||(pop.loaded.get(c.id)??-Infinity)>now)continue;
  const missing=target-(counts.get(c.id)||0);if(missing<=0)continue;
  // Prioritise nearby entry ring; fill outer chunks only after the local target.
  const radius=near<desired?NEAR:BUFFER;
  if(c.d>radius+CHUNK/2)continue;
  pop.loaded.set(c.id,now+RETRY_MS);
  for(let slot=0;slot<missing&&budget>0&&pop.actors.length<LIMIT;slot++){
   const n=chooseSpawn(pop,c.cx,c.cy,slot+(counts.get(c.id)||0),clock,box,gateStates,fixed,player,radius);
   if(!n)continue;
   n.createdAt=now;n.nextMove=now+180+n.seed%260;pop.actors.push(n);pop.generated++;budget--;changed=true;
   if(actorDistance(n,box)<=NEAR)near++;
  }
 }
 pop.nearCount=nearActors();pop.visibleCount=pop.actors.filter(a=>a.map===CITY&&inside(box,null,a.x,a.y)).length;
 return changed;
}
// The only time on-screen seeding is allowed: before the first rendered
// frame of a loaded/new campaign. Ordinary streaming still spawns off-screen.
export function primeAmbientPopulation(pop,player,camera,view,clock,now,fixed=[],gateStates={}){
 if(player.map!==CITY){
  if(!publicLink(linkFor(player.map))||player.floor)return false;
  // Preserve actual indoor visitors on load; an older save may have none.
  const l=linkFor(player.map),day=clock.hour>=7&&clock.hour<20;
  if(!day||pop.actors.some(a=>a.map===player.map)||pop.actors.length>=LIMIT||pop.actors.filter(a=>a.map!==CITY).length>=MAX_VISITORS)return false;
  let best=null,score=Infinity;
  // A few nearby walkable floor tiles, never furniture or the entry threshold.
  for(let dy=-5;dy<=5;dy++)for(let dx=-5;dx<=5;dx++){
   const x=player.x+dx,y=player.y+dy,d=Math.abs(dx)+Math.abs(dy);
   if(d<3||d>6||at({x,y},l.inside)||!floorTile(l.map,x,y)||!freeAt(l.map,{x,y},fixed.concat(pop.actors),player,null))continue;
   if(d<score){score=d;best={x,y};}
  }
  if(!best)return false;
  const n=makeActor(pop,best.x,best.y,hash(pop.serial+clock.day*311));Object.assign(n,{map:l.map,indoors:true,visitId:l.id,visitUntil:now+15000,venueName:l.name,task:"Odwiedza: "+l.name,createdAt:now,nextMove:now+600});
  pop.actors.push(n);pop.generated++;return true;
 }
 if(!view.w||!view.h)return false;
 const box=rect(camera,view),candidates=[];
 // Only the actual urban area visible on the saved camera is eligible.
 for(let y=Math.max(0,Math.ceil(box.top+1));y<=Math.min(CITY_HEIGHT-1,Math.floor(box.bottom-1));y++)
  for(let x=Math.max(0,Math.ceil(box.left+1));x<=Math.min(CITY_WIDTH-1,Math.floor(box.right-1));x++){
   const t=terrain(x,y,gateStates),d=Math.abs(x-player.x)+Math.abs(y-player.y);
   if(!t||d<3||vacant(x,y))continue;
   const h=hash(x*23719^y*56311^(clock.day||1)*311^pop.serial);
   candidates.push({x,y,h,score:(t===2?0:20)+h%31+d*.25});
  }
 const day=clock.hour>=7&&clock.hour<20;
 const target=Math.min(day?Math.ceil(localTarget(camera,clock)*.55):2,Math.floor(candidates.length/(day?13:35)));
 const visible=()=>pop.actors.filter(a=>a.map===CITY&&inside(box,null,a.x,a.y)).length;
 let count=visible(),changed=false;
 candidates.sort((a,b)=>a.score-b.score);
 for(const p of candidates){
  if(count>=target||pop.actors.length>=LIMIT)break;
  if(peopleAt(fixed,pop.actors,p.x,p.y,player)||pop.actors.some(a=>a.map===CITY&&Math.max(Math.abs(a.x-p.x),Math.abs(a.y-p.y))<2))continue;
  const n=makeActor(pop,p.x,p.y,p.h);n.createdAt=now;n.nextMove=now+350+n.seed%600;
  pop.actors.push(n);pop.generated++;count++;changed=true;
 }
 return syncAmbientPopulation(pop,player,camera,view,clock,now,fixed,gateStates)||changed;
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
   const l=linkFor(n.map);if(!publicLink(l))continue;
   if(now>=n.visitUntil){
    if(leavePortal(n,l,all,player,now,gateStates)){
     changed=true;if(n.map===CITY){Object.assign(n,{indoors:false,visitId:null,route:[],goal:null,nextVisit:now+18000,task:"Wraca na ulice miasta"});occupied.add(n.x+","+n.y);visitors=Math.max(0,visitors-1);}
    }
   }else if(wanderInterior(n,l,all,player,now))changed=true;
   continue;
  }
  if(!urban(n.x,n.y)||player.map!==CITY&&!n.visitId)continue;
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
   const nearby=links.filter(publicLink).map(l=>({l,dist:Math.abs(l.outside.x-n.x)+Math.abs(l.outside.y-n.y)})).filter(a=>a.dist<=(n.simulationLevel===2?65:16)&&terrain(a.l.outside.x,a.l.outside.y,gateStates)).sort((a,b)=>a.dist-b.dist);
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
  if(!n.goal||Math.abs(n.goal.x-n.x)+Math.abs(n.goal.y-n.y)<=1||(!n.visitId&&n.simulationLevel===0&&distanceToBox(rect(camera,view),n.goal.x,n.goal.y)>NEAR))n.goal=chooseGoal(n,gateStates,camera,view);
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
