// NPC 1.1 (0.3.20): 40 hybrid agents with daily destinations, long routes and visual animation.
import {CITY_BUILDINGS,CITY_WIDTH,CITY_HEIGHT,cityTile,cityGateBarrierAt} from "./city-one.js";
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
export const NPC_DEFINITIONS=Array.from({length:40},(_,i)=>{
 const homeBuilding=dwellings[(i*7+14)%dwellings.length];
 const workBuilding=workFor(ROLES[i%8],i);
 const home=doorApproach(homeBuilding),work=doorApproach(workBuilding);
 const market=near(100+(i%7-3)*2,98+((i*3)%9-4)*2);
 const social=doorApproach(findBuilding(i%3===0?"karczma":"targ"));
 return {id:"npc-"+String(i+1).padStart(2,"0"),
 name:FIRST[i%20]+(i>=20?" "+["Starszy","Młodsza","z Doliny","z Północy"][i%4]:""),
 role:ROLES[i%8],color:COLORS[i%8],skin:SKINS[i%5],important:i<12,
 home,work,market,social,homeMap:"interior-"+homeBuilding.id,homeBuilding:homeBuilding.id,workBuilding:workBuilding.id};
});
const visited=new Uint32Array(N),parent=new Int32Array(N),queue=new Int32Array(N);
let searchVersion=0;
const MOVES=[[0,1],[1,0],[0,-1],[-1,0]];
function route(from,to,gateStates={}){
 if(!walkable(to.x,to.y))return [];
 if(from.x===to.x&&from.y===to.y)return [];
 searchVersion++;if(searchVersion>=4294967290){visited.fill(0);searchVersion=1;}
 const start=idx(from.x,from.y),end=idx(to.x,to.y);
 let front=0,back=1;queue[0]=start;visited[start]=searchVersion;parent[start]=-1;
 const max=Math.min(N,7500);
 while(front<back&&front<max){
  const current=queue[front++];if(current===end)break;
  const x=current%WIDTH,y=Math.floor(current/WIDTH);
  const rotation=(from.x+from.y)%4;
  for(let i=0;i<4;i++){
   const [dx,dy]=MOVES[(i+rotation)%4],nx=x+dx,ny=y+dy;
   if(nx<1||ny<1||nx>=WIDTH-1||ny>=HEIGHT-1||!walkable(nx,ny))continue;
   const gate=cityGateBarrierAt(nx,ny);if(gate&&gateStates[gate.id]==="closed")continue;
   const next=idx(nx,ny);if(visited[next]===searchVersion)continue;
   visited[next]=searchVersion;parent[next]=current;queue[back++]=next;
   if(next===end)break;
  }
  if(visited[end]===searchVersion)break;
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
  phase:"",goal:null,steps:[],seed:i*17+3,nextMove:0,started:-1,duration:350,visible:true,indoors:false,roams:0,talking:false}));
}
export function schedulePhase(clock){
 const h=clock.hour;
 return h<6||h>=22?"sleep":h<8?"morning":h<16?"work":h<20?"social":"evening";
}
function scheduleGoal(n,phase){
 if(phase==="sleep"||phase==="evening")return n.home;
 if(phase==="morning"||phase==="work")return n.work;
 return n.social;
}
function roamGoal(n){
 const center=n.goal||n.work;
 // Roaming is a journey of 10–28 tiles, not a random 1-tile oscillation.
 const distance=n.role==="Posłaniec"?20:12+(n.seed%12);
 for(let j=0;j<16;j++){
  const angle=rand(n.seed++)*Math.PI*2;
  const x=center.x+Math.round(Math.cos(angle)*distance),y=center.y+Math.round(Math.sin(angle)*distance);
  const candidate=near(x,y);
  if(walkable(candidate.x,candidate.y)&&Math.abs(candidate.x-n.x)+Math.abs(candidate.y-n.y)>=9)return candidate;
 }
 return scheduleGoal(n,n.phase);
}
function goInside(n){
 n.map=n.homeMap;n.indoors=true;n.x=4+(n.seed%4);n.y=4+(n.seed%3);
 n.fromX=n.x;n.fromY=n.y;n.steps=[];n.started=-1;n.nextMove=0;
}
function comeOutside(n){
 n.map=CITY;n.indoors=false;n.x=n.home.x;n.y=n.home.y;
 n.fromX=n.x;n.fromY=n.y;n.steps=[];n.started=-1;n.nextMove=0;n.phase="";
}
export function stepNPCs(npcs,player,clock,now,gateStates={}){
 const phase=schedulePhase(clock);
 let changed=false;
 const occupied=new Set(npcs.filter(n=>n.map===CITY).map(n=>n.x+","+n.y));
 for(const n of npcs){
  if(n.talking)continue;
  if(n.indoors){
   if(phase!=="sleep"&&phase!=="evening"){comeOutside(n);changed=true;}
   continue;
  }
  const nearby=player.map===CITY&&Math.abs(n.x-player.x)<=29&&Math.abs(n.y-player.y)<=25;
  if(!nearby){
   // Outside the simulated region: only apply coarse schedule relocations.
   if(n.phase!==phase){
    n.phase=phase;n.goal=scheduleGoal(n,phase);n.steps=[];
    if(phase==="sleep"&&n.important){goInside(n);changed=true;}
    else{const p=scheduleGoal(n,phase);n.x=p.x;n.y=p.y;n.fromX=n.x;n.fromY=n.y;n.started=-1;}
   }
   continue;
  }
  if(n.phase!==phase){
   n.phase=phase;n.goal=scheduleGoal(n,phase);n.steps=[];n.roams=0;
  }
  if(now<n.nextMove)continue;
  if(n.x===n.goal.x&&n.y===n.goal.y&&!n.steps.length){
   if(phase==="sleep"&&n.important){goInside(n);changed=true;continue;}
   if(phase==="sleep"){n.nextMove=now+3000;continue;}
   n.roams++;
   n.destination=roamGoal(n);
  }
  const dest=n.destination&&n.steps.length?n.destination:(n.destination&&n.roams>0?n.destination:n.goal);
  if(!n.steps.length){
   n.steps=route(n,dest,gateStates);
   if(!n.steps.length){n.destination=null;n.roams=0;n.nextMove=now+1800;continue;}
  }
  const next=n.steps[0],pos=next.x+","+next.y;
  const gate=cityGateBarrierAt(next.x,next.y);
  if(occupied.has(pos)||(next.x===player.x&&next.y===player.y&&player.map===CITY)||(gate&&gateStates[gate.id]==="closed")){
   n.nextMove=now+450+Math.floor(rand(n.seed++)*350);
   if(gate&&gateStates[gate.id]==="closed")n.steps=[];
   continue;
  }
  occupied.delete(n.x+","+n.y);
  n.fromX=n.x;n.fromY=n.y;n.x=next.x;n.y=next.y;n.steps.shift();
  occupied.add(pos);
  n.direction=next.x>n.fromX?"right":next.x<n.fromX?"left":next.y>n.fromY?"down":"up";
  n.started=now;n.duration=250+(n.seed%4)*40;
  n.nextMove=now+n.duration+50+(n.seed%3)*55;
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
 const greet=clock.hour<12?"Dzień dobry":clock.hour<19?"Witaj, podróżniku":"Dobry wieczór";
 const lines={"Strażnik":"Pilnuję porządku w mieście. Trzymaj się głównych ulic.","Kupiec":"Przybyły nowe towary na targ.","Rzemieślnik":"Pracy nie brakuje, a dobrych narzędzi nigdy za wiele.","Mieszkaniec":"Nasze miasto wciąż się zmienia.","Robotnik":"Od świtu mamy ręce pełne roboty.","Posłaniec":"Mam wiadomości do doręczenia. Droga daleka!"};
 return greet+". "+(lines[n.role]||"Miłego dnia!");
}
export function npcDialogue(n,topic,clock){
 if(topic==="work")return {"Strażnik":"Patroluję bramy i ulice. Zmiana kończy się przed wieczorem.","Kupiec":"Handluję na targowisku; rano jest tam największy ruch.","Rzemieślnik":"Warsztat czeka od rana. Dziś mam sporo zamówień.","Posłaniec":"Przenoszę listy między dzielnicami, czasem poza mury.","Robotnik":"Pomagam przy składach i dostawach.","Mieszkaniec":"Pracuję tam, gdzie akurat jestem potrzebny."}[n.role]||"Każdy ma swoje obowiązki.";
 if(topic==="city")return "Rynek tętni życiem, ale przy murach wciąż trwa rozbudowa. Wieczorami mieszkańcy spotykają się w karczmie.";
 return npcGreeting(n,clock);
}
export function exportNPCState(npcs){return npcs.map(n=>({id:n.id,map:n.map,x:n.x,y:n.y,direction:n.direction,indoors:n.indoors}));}
export function restoreNPCState(npcs,saved){
 if(!Array.isArray(saved))return;
 const savedById=new Map(saved.filter(x=>x&&typeof x.id==="string").map(x=>[x.id,x]));
 for(const n of npcs){
  const data=savedById.get(n.id);if(!data)continue;
  const indoors=data.map===n.homeMap;
  if(!indoors&&data.map!==CITY)continue;
  if(!Number.isInteger(data.x)||!Number.isInteger(data.y))continue;
  if(!indoors&&!walkable(data.x,data.y))continue;
  if(indoors&&(data.x<2||data.y<2||data.x>18||data.y>18))continue;
  n.map=data.map;n.indoors=indoors;n.x=data.x;n.y=data.y;n.fromX=n.x;n.fromY=n.y;
  n.direction=["up","down","left","right"].includes(data.direction)?data.direction:"down";
  n.phase="";n.steps=[];n.started=-1;n.destination=null;n.nextMove=0;
 }
}
