// NPC 1.0 — deterministic hybrid population; only nearby agents are simulated.
import {CITY_BUILDINGS} from "./city-one.js";
import {blocked} from "./world.js";
const FIRST=["Aldric","Berta","Cedryk","Daria","Edmund","Fenna","Gustaw","Hilda","Iwo","Jagna","Konrad","Lena","Marek","Nora","Oskar","Petra","Radomir","Sara","Tomasz","Wera"];
const ROLES=["Strażnik","Kupiec","Rzemieślnik","Mieszkaniec","Mieszkaniec","Robotnik","Posłaniec","Mieszkaniec"];
const COLORS=["#7a9bcb","#d9a76c","#8bbf8b","#b58cbf","#c3a27e","#b5b8a2","#d48f83","#8bb7ae"];
const HASH=(n)=>{let v=(n*1664525+1013904223)>>>0;return v/4294967296;};
function valid(x,y){return x>=2&&x<190&&y>=2&&y<158&&!blocked("site-city1",0,x,y);}
function spawnNear(x,y){
 for(let r=0;r<=14;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
  if(Math.abs(dx)!==r&&Math.abs(dy)!==r)continue;
  if(valid(x+dx,y+dy))return {x:x+dx,y:y+dy};
 }
 return {x:96,y:132};
}
export const NPC_DEFINITIONS=Array.from({length:40},(_,i)=>{
 const b=CITY_BUILDINGS.filter(v=>!v.decorative)[(i*7)%CITY_BUILDINGS.filter(v=>!v.decorative).length];
 const [x1,y1,x2,y2]=b.bounds;
 const home=spawnNear(Math.floor((x1+x2)/2)+((i%3)-1)*3,Math.floor((y1+y2)/2)+((i%4)-2)*3);
 return {id:"npc-"+String(i+1).padStart(2,"0"),name:FIRST[i%20]+(i>=20?" "+["Starszy","Młodsza","z Doliny","z Północy"][i%4]:""),role:ROLES[i%8],color:COLORS[i%8],home,important:i<12};
});
export function createNPCs(){return NPC_DEFINITIONS.map((d,i)=>({...d,x:d.home.x,y:d.home.y,visualX:d.home.x,visualY:d.home.y,fromX:d.home.x,fromY:d.home.y,moveAt:0,seed:i*17+3}));}
export function stepNPCs(npcs,player,clock,now){
 if(player.map!=="site-city1")return false;
 let changed=false;
 for(const n of npcs){
  // Distant NPCs retain identity but do not run movement simulation.
  if(Math.abs(n.x-player.x)>24||Math.abs(n.y-player.y)>22)continue;
  if(now<n.moveAt)continue;
  n.moveAt=now+750+Math.floor(HASH(n.seed++)*1400);
  const daytime=clock.hour>=6&&clock.hour<22;
  if(!daytime&&!n.important)continue;
  const radius=n.important?13:7;
  const candidates=[[0,1],[1,0],[0,-1],[-1,0],[0,0]];
  const start=Math.floor(HASH(n.seed++)*candidates.length);
  for(let j=0;j<candidates.length;j++){
   const [dx,dy]=candidates[(start+j)%candidates.length],x=n.x+dx,y=n.y+dy;
   if(Math.abs(x-n.home.x)>radius||Math.abs(y-n.home.y)>radius||!valid(x,y))continue;
   if(x===player.x&&y===player.y)continue;
   if(npcs.some(o=>o!==n&&o.x===x&&o.y===y))continue;
   n.fromX=n.visualX;n.fromY=n.visualY;n.x=x;n.y=y;n.started=now;changed=true;break;
  }
 }
 return changed;
}
export function visibleNPCs(npcs,player){return player.map==="site-city1"?npcs.filter(n=>Math.abs(n.x-player.x)<28&&Math.abs(n.y-player.y)<24):[];}
export function nearestNPC(npcs,player){return player.map==="site-city1"?npcs.find(n=>Math.abs(n.x-player.x)+Math.abs(n.y-player.y)<=2):null;}
export function npcGreeting(n,clock){
 const greeting=clock.hour<12?"Dzień dobry":clock.hour<19?"Witaj, podróżniku":"Dobry wieczór";
 const lines={"Strażnik":"Pilnuję porządku w mieście. Trzymaj się głównych ulic.","Kupiec":"Na targu zawsze znajdzie się coś ciekawego.","Rzemieślnik":"Pracy nie brakuje, a dobrych narzędzi nigdy za wiele.","Mieszkaniec":"Nasze miasto wciąż się zmienia.","Robotnik":"Od świtu mamy ręce pełne roboty.","Posłaniec":"Mam wiadomości do doręczenia. Droga daleka!"};
 return greeting+". "+(lines[n.role]||"Miłego dnia!");
}
