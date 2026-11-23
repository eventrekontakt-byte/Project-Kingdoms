// NPC 1.3 (0.3.24): stable professions, purposeful jobs, DNS simulation classes.
import {CITY_BUILDINGS,CITY_WIDTH,CITY_HEIGHT,cityTile,cityGateBarrierAt} from "./city-one.js";
import {tileAt,mapSize} from "./world.js";
const FIRST=["Aldric","Berta","Cedryk","Daria","Edmund","Fenna","Gustaw","Hilda","Iwo","Jagna","Konrad","Lena","Marek","Nora","Oskar","Petra","Radomir","Sara","Tomasz","Wera"];
const ROLES=["Strażnik","Kupiec","Rzemieślnik","Mieszkaniec","Robotnik","Mieszkaniec","Posłaniec","Mieszkaniec"];
// Canonical city staff. Their profession, workplace and conversation are one
// profile, never three independent random assignments.
const IMPORTANT_PROFILES=[
 {role:"Dowódca straży",building:"straznica",indoor:false,behavior:"patrol",speech:"Dowodzę strażą miejską. Pełnię służbę przy strażnicy i kontroluję patrole."},
 {role:"Kupiec",building:"targ",indoor:true,behavior:"merchant",speech:"Prowadzę stoisko w hali targowej. Rankiem rozkładam towar i obsługuję klientów."},
 {role:"Kowal",building:"kuznia",indoor:true,behavior:"craft",speech:"Pracuję w kuźni. Naprawiam narzędzia i wykuwam zamówienia."},
 {role:"Karczmarka",building:"karczma",indoor:true,behavior:"innkeeper",speech:"Prowadzę karczmę. Od rana przygotowuję salę dla gości i zajmuję się zapasami."},
 {role:"Piekarz",building:"piekarnia",indoor:true,behavior:"craft",speech:"Pracuję w piekarni. Wypiek zaczynam wcześnie rano."},
 {role:"Zielarka",building:"apteka",indoor:true,behavior:"merchant",speech:"Przyjmuję klientów w aptece. Przygotowuję zioła i mieszanki."},
 {role:"Strażnik",building:"straznica",indoor:false,behavior:"patrol",speech:"Patroluję ulice i bramy miasta. Strażnica jest moim posterunkiem."},
 {role:"Bibliotekarka",building:"biblioteka",indoor:true,behavior:"scholar",speech:"Pracuję w bibliotece. Zajmuję się księgami i miejskimi kronikami."},
 {role:"Stajenny",building:"stajnia",indoor:true,behavior:"service",speech:"Pracuję w stajni. Karmię konie i przygotowuję je do drogi."},
 {role:"Kapłanka",building:"switynia",indoor:true,behavior:"service",speech:"Służę w świątyni. Opiekuję się pielgrzymami i odprawiam obrzędy."},
 {role:"Magazynier",building:"magazyn",indoor:true,behavior:"service",speech:"Pilnuję miejskiego magazynu. Przyjmuję dostawy i wydaję zapasy."},
 {role:"Urzędniczka",building:"twierdza",indoor:true,behavior:"scholar",speech:"Pracuję w twierdzy. Prowadzę rejestry i korespondencję władz miasta."}
];
// DNS stage 1 keeps the founding cast permanent. Dynamic population and
// observation-based promotion will use this metadata in later releases.
export const DNS_RULES={version:"1.0",permanentCount:12,residentCount:28,backgroundEnabled:false};
const COLORS=["#759bc9","#d7a663","#94b67d","#bc92be","#c4a17c","#b8b7a5","#cc8881","#84b4aa"];
const SKINS=["#efc99c","#a66e4c","#ddaf80","#b88460","#e3b78b"];
const CITY="site-city1",WIDTH=CITY_WIDTH,HEIGHT=CITY_HEIGHT,N=WIDTH*HEIGHT;
const IMPASSABLE=new Set(["void","wall","tree","water","object","door","rampart","stairs-up","stairs-down"]);
const walkCache=new Uint8Array(N);
const idx=(x,y)=>y*WIDTH+x;
const rand=n=>((Math.imul(n,1664525)+1013904223)>>>0)/4294967296;
const dwellings=CITY_BUILDINGS.filter(b=>!b.decorative);
// Only residential houses may be assigned as homes: arenas, forges and shops
// are workplaces, never bedrooms. Current four enterable houses accommodate NPCs.
const residences=CITY_BUILDINGS.filter(b=>/^city1-dom[1-4]$/.test(b.id));
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
function doorEntry(b){
 if(!b||!b.door)return {x:96,y:132};
 const [dx,dy]={N:[0,-1],S:[0,1],W:[-1,0],E:[1,0]}[b.facing]||[0,1];
 const x=b.door.x+dx,y=b.door.y+dy;
 // NPCs need an actual accessible entry tile, not a distant pavement marker.
 return near(x,y,false);
}
const workFor=(role,i)=>{
 const names=role==="Strażnik"||role==="Dowódca straży"?["straznica","koszary"]:
 role==="Kupiec"?["targ"]:role==="Rzemieślnik"?["kuznia","piekarnia","tartak"]:
 role==="Robotnik"?["magazyn","stajnia","mlyn"]:
 role==="Posłaniec"?["biblioteka","targ","straznica"]:
 ["targ","biblioteka","stajnia"];
 return findBuilding(names[(i*3+Math.floor(i/5))%names.length])||dwellings[0];
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
 const profile=IMPORTANT_PROFILES[i]||null;
 const role=profile?.role||ROLES[i%8];
 const homeBuilding=residences[(i*7+Math.floor(i/4))%residences.length];
 const workBuilding=(profile?findBuilding(profile.building):null)||workFor(role,i);
 const homeEntry=doorEntry(homeBuilding),workEntry=doorEntry(workBuilding);
 const worksIndoors=profile?profile.indoor:["Kupiec","Rzemieślnik","Robotnik"].includes(role);
 const behavior=profile?.behavior||(role==="Strażnik"?"patrol":role==="Posłaniec"?"courier":role==="Kupiec"?"merchant":role==="Rzemieślnik"?"craft":role==="Robotnik"?"service":"citizen");
 // Outdoor workers and patrols need destinations along streets and squares,
 // never permanent standing spots right on the doorstep of a public building.
 const guardStops=[[96,25],[161,79],[96,133],[30,80],[55,60],[142,80]];
 const outdoorStops=[[61,76],[70,90],[104,113],[133,75],[145,107],[61,116],[119,58],[85,67],[96,127],[128,105],[44,88],[104,72]];
 const base=worksIndoors?doorApproach(workBuilding):near(...(behavior==="patrol"?guardStops[(i*5+Math.floor(i/5))%guardStops.length]:outdoorStops[(i*7)%outdoorStops.length]));
 const home=distinctSpot(doorApproach(homeBuilding),usedHome),work=distinctSpot(base,usedWork);
 const market=near(100+(i%7-3)*2,98+((i*3)%9-4)*2);
 const venue=VENUE_SLOTS[(i*13)%VENUE_SLOTS.length];
 const socialEntry=venue.buildingData?doorEntry(venue.buildingData):venue.point;
 const social=distinctSpot(venue.point,usedSocial);
 return {id:"npc-"+String(i+1).padStart(2,"0"),
 name:FIRST[i%20]+(i>=20?" "+["Starszy","Młodsza","z Doliny","z Północy"][i%4]:""),
 role,color:COLORS[i%8],skin:SKINS[i%5],important:i<12,simulationClass:i<12?"permanent":"resident",behavior,workSpeech:profile?.speech||null,workTitle:workBuilding.name,
 home,work,market,social,homeEntry,workEntry,socialEntry,venueId:venue.id,venueName:venue.name,
 venueMap:venue.map,venueIndoor:venue.indoor,
 homeMap:"interior-"+homeBuilding.id,homeBuilding:homeBuilding.id,
 workMap:"interior-"+workBuilding.id,workBuilding:workBuilding.id,
 workIndoor:worksIndoors,
 wakeAt:355+(i*19)%130,workAt:435+(i*31)%110,
 workEndAt:845+(i*37)%225,socialEndAt:1040+(i*23)%130,
 sleepAt:1200+(i*17)%110};
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
 if(phase==="sleep"||phase==="evening")return n.homeEntry;
 if(phase==="morning"||phase==="work")return n.workIndoor?n.workEntry:n.work;
 return n.venueIndoor?n.socialEntry:n.social;
}
function phaseLabel(n,phase){
 if(phase==="work"){
  return n.behavior==="patrol"?"Patroluje okolice "+n.workTitle:
   n.behavior==="courier"?"Dostarcza wiadomości między dzielnicami":
   n.behavior==="merchant"?"Obsługuje klientów — "+n.workTitle:
   n.behavior==="craft"?"Wykonuje zamówienia — "+n.workTitle:
   n.behavior==="scholar"?"Prowadzi dokumentację — "+n.workTitle:
   n.behavior==="innkeeper"?"Obsługuje gości — "+n.workTitle:
   "Pracuje — "+n.workTitle;
 }
 return {sleep:"Odpoczywa w domu",morning:"Idzie do pracy",social:"Spędza czas: "+n.venueName,evening:"Wraca do domu"}[phase]||"Spaceruje";
}
function indoorDestination(n,phase){
 if(phase==="sleep"||phase==="evening")return n.homeMap;
 if((phase==="work"||phase==="morning")&&n.workIndoor)return n.workMap;
 if(phase==="social"&&n.venueIndoor)return n.venueMap;
 return null;
}
function roamGoal(n){
 const center=n.goal||n.work;
 if(n.phase==="work"&&n.behavior==="patrol"){
  // Guards rotate between concrete street checkpoints instead of circling
  // one square endlessly. Each patrol leg has a clear, reachable destination.
  const stops=[[12,0],[7,10],[-8,12],[-12,0],[-8,-10],[7,-10]];
  for(let j=0;j<stops.length;j++){
   const k=((n.patrolIndex||0)+j)%stops.length;
   const [dx,dy]=stops[k],candidate=near(center.x+dx,center.y+dy);
   if(Math.abs(candidate.x-n.x)+Math.abs(candidate.y-n.y)>=6){
    n.patrolIndex=(k+1)%stops.length;return candidate;
   }
  }
 }
 const distance=n.phase==="social"?4+(n.seed%5):n.behavior==="courier"?20:8+(n.seed%7);
 for(let j=0;j<16;j++){
  const angle=rand(n.seed++)*Math.PI*2;
  const x=center.x+Math.round(Math.cos(angle)*distance);
  const y=center.y+Math.round(Math.sin(angle)*distance);
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
 const nearDoor=last==="work"?n.workEntry:last==="social"?n.socialEntry:n.homeEntry;
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
  n.started=now;n.duration=310;
  // Someone working a counter or a craft station changes position only
  // occasionally; leisure guests have a more active interior walk.
  n.nextMove=now+(n.indoorActivity==="work"?4900:1750)+(n.seed%6)*350;
  return true;
 }
 n.nextMove=now+(n.indoorActivity==="work"?4800:1600);return false;
}
export function stepNPCs(npcs,player,clock,now,gateStates={}){
 let changed=false;
 const occupied=new Set(npcs.filter(n=>n.map===CITY).map(n=>n.x+","+n.y));
 for(const n of npcs){
  if(n.talking)continue;
  const phase=schedulePhase(clock,n);
  const minutes=clock.hour*60+clock.minute;
  // Deadlines safeguard against disconnected streets and door queues: no one
  // stays at a shop overnight after 50 in-game minutes past their bedtime.
  const overdue=phase==="sleep"&&(minutes<n.wakeAt||minutes>=n.sleepAt+50);
  if(overdue&&n.map!==n.homeMap){
   occupied.delete(n.x+","+n.y);
   if(enterBuilding(n,n.homeMap,"sleep",npcs,now)){
    n.phase="sleep";n.goal=n.homeEntry;n.task=phaseLabel(n,"sleep");changed=true;
    continue;
   }
  }
  const changedPhase=n.phase!==phase;
  if(changedPhase){
   n.phase=phase;n.goal=scheduleGoal(n,phase);n.steps=[];n.destination=null;n.roams=0;
   n.task=phaseLabel(n,phase);n.blockedCount=0;
  }
  let closeOutside=player.map===CITY&&n.map===CITY&&
   Math.abs(n.x-player.x)<=29&&Math.abs(n.y-player.y)<=25;
  let insideWithPlayer=n.map!=="site-city1"&&n.map===player.map;
  if(n.indoors){
   if(n.map===indoorDestination(n,phase)){
    // Stay in the same interior across morning→work and evening→night.
    n.indoorActivity=phase;n.task=phaseLabel(n,phase);
    if(insideWithPlayer&&phase!=="sleep"&&moveIndoor(n,player,now,npcs))changed=true;
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
  if(indoor&&Math.abs(n.x-n.goal.x)+Math.abs(n.y-n.goal.y)<=4){
   if(enterBuilding(n,indoor,phase,npcs,now)){occupied.delete(n.x+","+n.y);changed=true;continue;}
  }
  // Keep the selected roam destination until movement can start. The old
  // condition replaced it every tick while the NPC stood at their work spot.
  if(!indoor&&!n.destination&&n.x===n.goal.x&&n.y===n.goal.y&&!n.steps.length){
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
 let closest=null,distance=3;
 for(const n of npcs){
  if(n.map!==player.map)continue;
  const d=Math.abs(n.x-player.x)+Math.abs(n.y-player.y);
  if(d<distance){closest=n;distance=d;}
 }
 return closest;
}
export function npcGreeting(n,clock){
 const greet=n.met>=3?"Znów się spotykamy!":clock.hour<12?"Dzień dobry":clock.hour<19?"Witaj, podróżniku":"Dobry wieczór";
 const lines={"Dowódca straży":"Pilnuję porządku w mieście.","Strażnik":"Pilnuję porządku w mieście.","Kupiec":"Przybyły nowe towary na targ.","Kowal":"Kuźnia ma dziś wiele zamówień.","Karczmarka":"W karczmie zawsze znajdzie się miejsce na rozmowę.","Piekarz":"Rano pachnie świeżym chlebem.","Zielarka":"Zioła mają wiele zastosowań.","Bibliotekarka":"Kroniki kryją niejedną tajemnicę.","Stajenny":"Konie muszą być gotowe do drogi.","Kapłanka":"Świątynia jest otwarta dla potrzebujących.","Magazynier":"Zapasów trzeba pilnować.","Urzędniczka":"Miasto prowadzi wiele spraw.","Rzemieślnik":"Pracy nie brakuje, a dobrych narzędzi nigdy za wiele.","Mieszkaniec":"Nasze miasto wciąż się zmienia.","Robotnik":"Od świtu mamy ręce pełne roboty.","Posłaniec":"Mam wiadomości do doręczenia. Droga daleka!"};
 return greet+". "+(lines[n.role]||"Miłego dnia!");
}
export function npcDialogue(n,topic,clock){
 if(topic==="work"){
  if(n.workSpeech)return n.workSpeech;
  const intro={Strażnik:"Pełnię służbę w mieście.",Kupiec:"Sprzedaję towary.",Rzemieślnik:"Zajmuję się rzemiosłem.",Posłaniec:"Roznoszę listy i wiadomości.",Robotnik:"Pomagam przy dostawach i pracach miejskich.",Mieszkaniec:"Mam codzienne obowiązki."}[n.role]||"Każdy ma swoje obowiązki.";
  return intro+" Moim miejscem pracy jest "+n.workTitle+".";
 }
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
