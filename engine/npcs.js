// NPC 1.2 (0.3.21): staggered schedules, eight meeting places, indoor visits and crowd limits.
import {CITY_BUILDINGS,CITY_WIDTH,CITY_HEIGHT,cityTile,cityGateBarrierAt} from "./city-one.js";
import {tileAt,mapSize} from "./world.js";
const FIRST=["Aldric","Berta","Cedryk","Daria","Edmund","Fenna","Gustaw","Hilda","Iwo","Jagna","Konrad","Lena","Marek","Nora","Oskar","Petra","Radomir","Sara","Tomasz","Wera"];
const ROLES=["Strażnik","Kupiec","Rzemieślnik","Mieszkaniec","Mieszkaniec","Robotnik","Posłaniec","Mieszkaniec"];
const COLORS=["#759bc9","#d7a663","#94b67d","#bc92be","#c4a17c","#b8b7a5","#cc8881","#84b4aa"];
const SKINS=["#efc99c","#a66e4c","#ddaf80","#b88460","#e3b78b"];
const CITY="site-city1",WIDTH=CITY_WIDTH,HEIGHT=CITY_HEIGHT,N=WIDTH*HEIGHT;
const IMPASSABLE=new Set(["void","wall","tree","water","object","rampart","stairs-up","stairs-down"]);
const walkCache=new Uint8Array(N);
const idx=(x,y)=>y*WIDTH+x;
const rand=n=>((Math.imul(n,1664525)+1013904223)>>>0)/4294967296;
const dwellings=CITY_BUILDINGS.filter(b=>!b.decorative);
const findBuilding=id=>dwellings.find(b=>b.id==="city1-"+id);
function tileKind(x,y){
 if(x<1||y<1||x>=WIDTH-1||y>=HEIGHT-1)return 0;
 const index=idx(x,y);
 if(!walkCache[index]){
  const t=cityTile(x,y);
  walkCache[index]=IMPASSABLE.has(t)?1:t==="road"?3:2;
 }
 return walkCache[index];
}
const walkable=(x,y)=>tileKind(x,y)>1;
function near(x,y,preferRoad=true){
 let best=null,score=Infinity;
 for(let r=0;r<=12;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
  if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
  const xx=x+dx,yy=y+dy,t=tileKind(xx,yy);if(t<2)continue;
  const cost=r*3+(preferRoad&&t!==3?7:0);
  if(cost<score){score=cost;best={x:xx,y:yy};}
 }
 return best||{x:96,y:132};
}
function doorApproach(b){
 if(!b)return {x:96,y:132};
 const d=b.door||{x:Math.floor((b.bounds[0]+b.bounds[2])/2),y:b.bounds[3]};
 const [dx,dy]={N:[0,-1],S:[0,1],W:[-1,0],E:[1,0]}[b.facing]||[0,1];
 return near(d.x+dx*2,d.y+dy*2);
}
const workFor=(role,i)=>{
 const names=role==="Strażnik"?["straznica","koszary","twierdza"]:role==="Kupiec"?["targ","karczma","apteka"]:
 role==="Rzemieślnik"?["kuznia","piekarnia","tartak"]:role==="Robotnik"?["magazyn","stajnia","mlyn"]:
 role==="Posłaniec"?["biblioteka","targ","straznica"]:["targ","biblioteka","karczma","switynia"];
 return findBuilding(names[i%names.length])||dwellings[0];
};
// Keep crowds distributed around workplaces and social hubs, never stack
// dozens of actors on one tile after off-screen schedule updates.
const usedHome=new Set(),usedWork=new Set(),usedSocial=new Set();
function distinctSpot(origin,used){
 let best=null,bestScore=Infinity;
 for(let radius=0;radius<=12;radius++)for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
  if(Math.max(Math.abs(dx),Math.abs(dy))!==radius)continue;
  const x=origin.x+dx,y=origin.y+dy,kind=tileKind(x,y),k=x+","+y;
  if(kind<2||used.has(k))continue;
  const score=radius*5+(kind===3?0:3)+Math.abs(dx-dy)*.04;
  if(score<bestScore){bestScore=score;best={x,y};}
 }
 const p=best||origin;used.add(p.x+","+p.y);return p;
}
// Quotas: at most six visitors in the tavern; the whole population cannot
// be assigned to the same doorstep. Indoor venues resolve to real BIS/TBI maps.
export const NPC_VENUES=[
 {id:"karczma",name:"Karczma",building:"karczma",capacity:6,indoor:true},
 {id:"rynek",name:"Rynek",point:[102,99],capacity:8,indoor:false},
 {id:"swiatynia",name:"Świątynia",building:"switynia",capacity:4,indoor:true},
 {id:"arena",name:"Plac przy arenie",building:"arena",capacity:5,indoor:false},
 {id:"park",name:"Zielony skwer",point:[68,87],capacity:5,indoor:false},
 {id:"dziedziniec",name:"Dziedziniec twierdzy",point:[58,55],capacity:4,indoor:false},
 {id:"kasyno",name:"Kasyno",building:"kasyno",capacity:3,indoor:true},
 {id:"biblioteka",name:"Biblioteka",building:"biblioteka",capacity:5,indoor:true}
].map(v=>({...v,buildingData:v.building?findBuilding(v.building):null,
 map:v.indoor?"interior-city1-"+v.building:null,
 point:v.point?near(...v.point):doorApproach(findBuilding(v.building))}));
const VENUE_SLOTS=NPC_VENUES.flatMap(v=>Array.from({length:v.capacity},()=>v));
const interiorCache=new Map();
// Use actual passable floor tiles so visitors never materialise in furniture/walls.
function interiorSpot(map,seed=0,occupied=null){
 const dimensions=mapSize(map);if(!dimensions.w||!dimensions.h)return null;
 let spots=interiorCache.get(map);
 if(!spots){
  spots=[];
  const cx=Math.floor(dimensions.w/2),cy=Math.floor(dimensions.h/2);
  for(let y=2;y<dimensions.h-2;y++)for(let x=2;x<dimensions.w-2;x++){
   const t=tileAt(map,0,x,y);
   if(t==="wood"||t==="stone"||t==="marble")spots.push({x,y,score:Math.abs(x-cx)+Math.abs(y-cy)});
  }
  spots.sort((a,b)=>a.score-b.score||a.y-b.y||a.x-b.x);
  interiorCache.set(map,spots);
 }
 if(!spots.length)return null;
 const start=(seed*17)%spots.length;
 for(let j=0;j<spots.length;j++){
  const p=spots[(start+j)%spots.length];
  if(!occupied||!occupied.has(map+":"+p.x+","+p.y))return {x:p.x,y:p.y};
 }
 return null;
}
export const NPC_DEFINITIONS=Array.from({length:40},(_,i)=>{
 const homeBuilding=dwellings[(i*7+14)%dwellings.length];
 const workBuilding=workFor(ROLES[i%8],i);
 const home=distinctSpot(doorApproach(homeBuilding),usedHome),work=distinctSpot(doorApproach(workBuilding),usedWork);
 const market=near(100+(i%7-3)*2,98+((i*3)%9-4)*2);
 const venue=VENUE_SLOTS[(i*13)%VENUE_SLOTS.length];
 const social=distinctSpot(venue.point,usedSocial);
 return {id:"npc-"+String(i+1).padStart(2,"0"),
 name:FIRST[i%20]+(i>=20?" "+["Starszy","Młodsza","z Doliny","z Północy"][i%4]:""),
 role:ROLES[i%8],color:COLORS[i%8],skin:SKINS[i%5],important:i<12,
 home,work,market,social,venueId:venue.id,venueName:venue.name,
 venueMap:venue.map,venueIndoor:venue.indoor,
 homeMap:"interior-"+homeBuilding.id,homeBuilding:homeBuilding.id,
 workMap:"interior-"+workBuilding.id,workBuilding:workBuilding.id,
 workIndoor:["Kupiec","Rzemieślnik","Robotnik"].includes(ROLES[i%8])||i%7===0,
 wakeAt:355+(i*19)%130,workAt:435+(i*31)%110,
 workEndAt:845+(i*37)%225,socialEndAt:1070+(i*23)%205,
 sleepAt:1250+(i*17)%125};
});
// Reused typed arrays keep route planning allocation-light on Android.
const visited=new Uint32Array(N),parent=new Int32Array(N),gScore=new Float32Array(N);
let searchVersion=0;
const MOVES=[[0,1],[1,0],[0,-1],[-1,0]];
function route(from,to,gateStates={}){
 if(!walkable(to.x,to.y)||!walkable(from.x,from.y))return [];
 if(from.x===to.x&&from.y===to.y)return [];
 searchVersion++;if(searchVersion>=4294967290){visited.fill(0);searchVersion=1;}
 const start=idx(from.x,from.y),end=idx(to.x,to.y);
 const distance=(x,y)=>Math.abs(x-to.x)+Math.abs(y-to.y);
 const heap=[];
 const push=(node,g,f)=>{
  const item={node,g,f};let i=heap.length;heap.push(item);
  while(i>0){let p=Math.floor((i-1)/2);if(heap[p].f<=item.f)break;heap[i]=heap[p];i=p;}heap[i]=item;
 };
 const pop=()=>{
  const root=heap[0],last=heap.pop();if(!heap.length)return root;
  let i=0;while(i*2+1<heap.length){
   let c=i*2+1;if(c+1<heap.length&&heap[c+1].f<heap[c].f)c++;
   if(heap[c].f>=last.f)break;heap[i]=heap[c];i=c;
  }
  heap[i]=last;return root;
 };
 visited[start]=searchVersion;gScore[start]=0;parent[start]=-1;push(start,0,distance(from.x,from.y));
 let expanded=0;
 while(heap.length&&expanded++<12500){
  const current=pop();
  if(current.g>gScore[current.node]+.01)continue;
  if(current.node===end)break;
  const x=current.node%WIDTH,y=Math.floor(current.node/WIDTH);
  for(const [dx,dy] of MOVES){
   const nx=x+dx,ny=y+dy,kind=tileKind(nx,ny);if(kind<2)continue;
   const gate=cityGateBarrierAt(nx,ny);if(gate&&gateStates[gate.id]==="closed")continue;
   const next=idx(nx,ny),newG=current.g+(kind===3?1:1.8);
   if(visited[next]===searchVersion&&newG>=gScore[next]-.001)continue;
   visited[next]=searchVersion;gScore[next]=newG;parent[next]=current.node;
   push(next,newG,newG+distance(nx,ny));
  }
 }
 if(visited[end]!==searchVersion)return [];
 const result=[];
 for(let at=end;at!==start;at=parent[at]){
  if(at<0||result.length>1000)return [];
  result.push({x:at%WIDTH,y:Math.floor(at/WIDTH)});
 }
 result.reverse();return result;
}
export function createNPCs(){
 return NPC_DEFINITIONS.map((d,i)=>({...d,map:CITY,x:d.home.x,y:d.home.y,
  fromX:d.home.x,fromY:d.home.y,direction:["down","left","up","right"][i%4],
  phase:"",goal:null,steps:[],seed:i*17+3,nextMove:0,started:-1,duration:350,visible:true,
 indoors:false,indoorActivity:null,roams:0,talking:false,task:"Wraca do domu",insideSince:0}));
}
// Every inhabitant has a separate shift; no city-wide 16:00 crowd surge.
export function schedulePhase(clock,n=null){
 const minutes=(clock.hour||0)*60+(clock.minute||0);
 const wake=n?.wakeAt??390,work=n?.workAt??470,finish=n?.workEndAt??940;
 const socialEnd=n?.socialEndAt??1190,sleep=n?.sleepAt??1320;
 if(minutes<wake||minutes>=sleep)return "sleep";
 if(minutes<work)return "morning";
 if(minutes<finish)return "work";
 if(minutes<socialEnd)return "social";
 return "evening";
}
function scheduleGoal(n,phase){
 if(phase==="sleep"||phase==="evening")return n.home;
 if(phase==="morning"||phase==="work")return n.work;
 return n.social;
}
function phaseLabel(n,phase){
 return {sleep:"Odpoczywa w domu",morning:"Idzie do pracy",work:"Pracuje",social:"Spędza czas: "+n.venueName,evening:"Wraca do domu"}[phase]||"Spaceruje";
}
function indoorDestination(n,phase){
 if(phase==="sleep")return n.homeMap;
 if(phase==="work"&&n.workIndoor)return n.workMap;
 if(phase==="social"&&n.venueIndoor)return n.venueMap;
 return null;
}
function roamGoal(n){
 const center=n.goal||n.work;
 // Courtyards and meeting places encourage short conversation-friendly stops.
 const distance=n.phase==="social"?4+(n.seed%5):n.role==="Posłaniec"?20:12+(n.seed%12);
 for(let j=0;j<16;j++){
  const angle=rand(n.seed++)*Math.PI*2;
  const x=center.x+Math.round(Math.cos(angle)*distance),y=center.y+Math.round(Math.sin(angle)*distance);
  const candidate=near(x,y);
  if(walkable(candidate.x,candidate.y)&&Math.abs(candidate.x-n.x)+Math.abs(candidate.y-n.y)>=4)return candidate;
 }
 return center;
}
function unoccupiedGround(goal,occupied){
 if(!occupied.has(goal.x+","+goal.y))return goal;
 for(let r=1;r<=8;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
  if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
  const x=goal.x+dx,y=goal.y+dy;
  if(walkable(x,y)&&!occupied.has(x+","+y))return {x,y};
 }
 return goal;
}
function enterBuilding(n,map,phase,npcs,now){
 const used=new Set(npcs.filter(o=>o!==n&&o.map===map).map(o=>o.map+":"+o.x+","+o.y));
 const spot=interiorSpot(map,Number(n.id.slice(-2))+n.seed%9,used);
 if(!spot)return false;
 n.map=map;n.indoors=true;n.indoorActivity=phase;n.insideSince=now;
 n.x=spot.x;n.y=spot.y;n.fromX=spot.x;n.fromY=spot.y;
 n.steps=[];n.destination=null;n.started=-1;
 n.nextMove=now+800+(n.seed%9)*200;n.task=phaseLabel(n,phase);
 return true;
}
function comeOutside(n,now,npcs){
 const last=n.indoorActivity;
 const nearDoor=last==="work"?n.work:last==="social"?n.social:n.home;
 // Exiting the building uses its real exterior approach rather than a fixed
 // shared spawn, avoiding NPC stacks beside doors.
 const used=new Set(npcs.filter(o=>o!==n&&o.map===CITY).map(o=>o.x+","+o.y));
 let at=nearDoor;
 if(used.has(at.x+","+at.y)){
  for(let radius=1;radius<=6;radius++){
   let found=null;
   for(let dy=-radius;dy<=radius&&!found;dy++)for(let dx=-radius;dx<=radius;dx++){
    const x=at.x+dx,y=at.y+dy;
    if(walkable(x,y)&&!used.has(x+","+y)){found={x,y};break;}
   }
   if(found){at=found;break;}
  }
 }
 n.map=CITY;n.indoors=false;n.indoorActivity=null;
 n.x=at.x;n.y=at.y;n.fromX=n.x;n.fromY=n.y;n.steps=[];n.destination=null;
 n.started=-1;n.nextMove=now+400;n.roams=0;
}
function moveIndoor(n,player,now,npcs){
 if(now<n.nextMove)return false;
 const occupied=new Set(npcs.filter(o=>o!==n&&o.map===n.map).map(o=>o.x+","+o.y));
 const order=(n.seed++)%4;
 for(let i=0;i<4;i++){
  const [dx,dy]=MOVES[(i+order)%4],x=n.x+dx,y=n.y+dy;
  const tile=tileAt(n.map,0,x,y);
  if(tile!=="wood"&&tile!=="stone"&&tile!=="marble")continue;
  if(x===player.x&&y===player.y||occupied.has(x+","+y))continue;
  n.fromX=n.x;n.fromY=n.y;n.x=x;n.y=y;
  n.direction=dx>0?"right":dx<0?"left":dy>0?"down":"up";
  n.started=now;n.duration=310;n.nextMove=now+1150+(n.seed%6)*180;
  return true;
 }
 n.nextMove=now+1600;return false;
}
export function stepNPCs(npcs,player,clock,now,gateStates={}){
 let changed=false;
 const occupied=new Set(npcs.filter(n=>n.map===CITY).map(n=>n.x+","+n.y));
 for(const n of npcs){
  if(n.talking)continue;
  const phase=schedulePhase(clock,n);
  const changedPhase=n.phase!==phase;
  if(changedPhase){
   n.phase=phase;n.goal=scheduleGoal(n,phase);n.steps=[];n.destination=null;n.roams=0;
   n.task=phaseLabel(n,phase);n.blockedCount=0;
  }
  let closeOutside=player.map===CITY&&n.map===CITY&&
   Math.abs(n.x-player.x)<=29&&Math.abs(n.y-player.y)<=25;
  let insideWithPlayer=n.map!=="site-city1"&&n.map===player.map;
  if(n.indoors){
   if(n.indoorActivity===phase){
    if(insideWithPlayer&&moveIndoor(n,player,now,npcs))changed=true;
    continue;
   }
   // Day's next activity begins with leaving through the building's exit.
   comeOutside(n,now,npcs);changed=true;
   occupied.add(n.x+","+n.y);
   closeOutside=player.map===CITY&&Math.abs(n.x-player.x)<=29&&Math.abs(n.y-player.y)<=25;
   insideWithPlayer=false;
  }
  if(!closeOutside&&!insideWithPlayer){
   // Cheap off-screen simulation: update only on phase changes, without A*.
   if(changedPhase||n.indoorActivity!==null||n.steps.length>0||n.destination||
      (phase==="sleep"&&n.map===CITY)){
    // Finish travel at coarse granularity once the NPC leaves the player's
    // simulation radius: a sleeping resident must not wander outside all night.
    n.steps=[];n.destination=null;
    const indoor=indoorDestination(n,phase);
    if(indoor&&enterBuilding(n,indoor,phase,npcs,now)){changed=true;}
    else{
     const dest=unoccupiedGround(scheduleGoal(n,phase),occupied);occupied.delete(n.x+","+n.y);
     n.map=CITY;n.x=dest.x;n.y=dest.y;n.fromX=n.x;n.fromY=n.y;
     n.steps=[];n.started=-1;n.destination=null;n.nextMove=now+800;
     occupied.add(n.x+","+n.y);changed=true;
    }
   }
   continue;
  }
  if(now<n.nextMove)continue;
  const indoor=indoorDestination(n,phase);
  // Actual transition occurs only after arriving near a venue entrance.
  if(indoor&&Math.abs(n.x-n.goal.x)+Math.abs(n.y-n.goal.y)<=2){
   if(enterBuilding(n,indoor,phase,npcs,now)){occupied.delete(n.x+","+n.y);changed=true;continue;}
  }
  if(!indoor&&n.x===n.goal.x&&n.y===n.goal.y&&!n.steps.length){
   if(phase==="sleep"||phase==="evening"){
    n.nextMove=now+1900;continue;
   }
   n.roams++;n.destination=roamGoal(n);n.nextMove=now+1300+(n.seed%5)*350;continue;
  }
  if(!n.steps.length){
   const dest=n.destination||n.goal;
   n.steps=route(n,dest,gateStates);
   if(!n.steps.length){
    // If a courtyard or entrance is inaccessible, wait before retrying.
    n.destination=null;n.nextMove=now+1200+(n.seed++%5)*270;
    continue;
   }
  }
  const next=n.steps[0],position=next.x+","+next.y;
  const gate=cityGateBarrierAt(next.x,next.y);
  if(occupied.has(position)||(player.map===CITY&&next.x===player.x&&next.y===player.y)||(gate&&gateStates[gate.id]==="closed")){
   n.nextMove=now+320+(n.seed++%6)*100;
   n.blockedCount=(n.blockedCount||0)+1;
   if(n.blockedCount>=4){n.steps=[];n.destination=null;n.blockedCount=0;}
   continue;
  }
  n.blockedCount=0;
  occupied.delete(n.x+","+n.y);
  n.fromX=n.x;n.fromY=n.y;n.x=next.x;n.y=next.y;n.steps.shift();
  occupied.add(position);
  n.direction=next.x>n.fromX?"right":next.x<n.fromX?"left":next.y>n.fromY?"down":"up";
  n.started=now;n.duration=260+(n.seed%4)*35;
  n.nextMove=now+n.duration+65+(n.seed++%3)*65;
  changed=true;
  if(!n.steps.length)n.destination=null;
 }
 return changed;
}
export function npcMoving(npcs,player,now){
 return npcs.some(n=>n.map===player.map&&n.started>=0&&now<n.started+n.duration&&Math.abs(n.x-player.x)<28&&Math.abs(n.y-player.y)<24);
}
export function visibleNPCs(npcs,player){
 return npcs.filter(n=>n.map===player.map&&Math.abs(n.x-player.x)<28&&Math.abs(n.y-player.y)<24);
}
export function nearestNPC(npcs,player){
 return npcs.find(n=>n.map===player.map&&Math.abs(n.x-player.x)+Math.abs(n.y-player.y)<=2);
}
export function npcGreeting(n,clock){
 const greet=n.met>=3?"Znów się spotykamy!":clock.hour<12?"Dzień dobry":clock.hour<19?"Witaj, podróżniku":"Dobry wieczór";
 const lines={"Strażnik":"Pilnuję porządku w mieście. Trzymaj się głównych ulic.","Kupiec":"Przybyły nowe towary na targ.","Rzemieślnik":"Pracy nie brakuje, a dobrych narzędzi nigdy za wiele.","Mieszkaniec":"Nasze miasto wciąż się zmienia.","Robotnik":"Od świtu mamy ręce pełne roboty.","Posłaniec":"Mam wiadomości do doręczenia. Droga daleka!"};
 return greet+". "+(lines[n.role]||"Miłego dnia!");
}
export function npcDialogue(n,topic,clock){
 if(topic==="work")return {"Strażnik":"Patroluję bramy i ulice. Zmiana kończy się przed wieczorem.","Kupiec":"Handluję na targowisku; rano jest tam największy ruch.","Rzemieślnik":"Warsztat czeka od rana. Dziś mam sporo zamówień.","Posłaniec":"Przenoszę listy między dzielnicami, czasem poza mury.","Robotnik":"Pomagam przy składach i dostawach.","Mieszkaniec":"Pracuję tam, gdzie akurat jestem potrzebny."}[n.role]||"Każdy ma swoje obowiązki.";
 if(topic==="city")return "Rynek tętni życiem, ale przy murach wciąż trwa rozbudowa. Mieszkańcy spotykają się w "+n.venueName.toLowerCase()+" i innych częściach miasta.";
 if(topic==="activity")return n.task+". "+(n.indoors?"Jestem teraz wewnątrz budynku.":"Na ulicach zawsze coś się dzieje.");
 if(topic==="rumour"){
  const rumours=[
   "Strażnicy mówią, że przy bramach pojawili się nowi przybysze.",
   "Kupcy liczą na większy ruch w dzielnicy handlowej.",
   "Przy arenie podobno szykuje się wielkie widowisko.",
   "W karczmie można usłyszeć historie o okolicznych ruinach.",
   "Budowniczowie mają jeszcze sporo pracy przy miejskich murach."
  ];
  return rumours[Number(n.id.slice(-2))%rumours.length];
 }
 return npcGreeting(n,clock);
}
export function exportNPCState(npcs){
 return npcs.map(n=>({id:n.id,map:n.map,x:n.x,y:n.y,direction:n.direction,
  indoors:n.indoors,indoorActivity:n.indoorActivity,phase:n.phase,met:n.met||0}));
}
export function restoreNPCState(npcs,saved){
 if(!Array.isArray(saved))return;
 const savedById=new Map(saved.filter(x=>x&&typeof x.id==="string").map(x=>[x.id,x]));
 for(const n of npcs){
  const data=savedById.get(n.id);if(!data)continue;
  const indoors=[n.homeMap,n.workMap,n.venueMap].includes(data.map)&&data.map!==CITY;
  if(!indoors&&data.map!==CITY)continue;
  if(!Number.isInteger(data.x)||!Number.isInteger(data.y))continue;
  const size=mapSize(data.map);
  if(data.x<1||data.y<1||data.x>=size.w-1||data.y>=size.h-1)continue;
  const tile=tileAt(data.map,0,data.x,data.y);
  if(indoors?!["wood","stone","marble"].includes(tile):!walkable(data.x,data.y))continue;
  n.map=data.map;n.indoors=indoors;n.x=data.x;n.y=data.y;
  n.fromX=n.x;n.fromY=n.y;n.met=Math.max(0,Math.min(999,Number(data.met)||0));
  n.direction=["up","down","left","right"].includes(data.direction)?data.direction:"down";
  n.indoorActivity=indoors?["sleep","work","social"].includes(data.indoorActivity)?data.indoorActivity:"sleep":null;
  n.phase=["sleep","morning","work","social","evening"].includes(data.phase)?data.phase:"";
  n.goal=n.phase?scheduleGoal(n,n.phase):null;n.task=phaseLabel(n,n.phase);
  n.steps=[];n.started=-1;n.destination=null;n.nextMove=0;n.roams=0;
 }
}
