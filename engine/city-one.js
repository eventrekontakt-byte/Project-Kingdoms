// City 1: hand-authored, data-driven walled settlement inspired by medieval town plans.
// Bounds are inclusive; door is always on the road-facing wall.
export const CITY_WIDTH=112,CITY_HEIGHT=88;
const B=[
["twierdza","Twierdza","🏰",46,12,65,24,"S"],
["koszary","Koszary","🛡",27,15,39,23,"S"],
["zbrojownia","Zbrojownia","⚔",72,15,83,23,"S"],
["biblioteka","Biblioteka","📚",28,29,39,36,"S"],
["karczma","Karczma","🍺",45,30,56,38,"S"],
["kasyno","Kasyno","🎲",62,30,73,38,"S"],
["kuznia","Kuźnia","⚒",78,30,88,38,"S"],
["piekarnia","Piekarnia","🥖",25,44,36,51,"N"],
["targ","Hala targowa","⚖",42,44,55,52,"N"],
["stajnia","Stajnia","🐴",61,44,73,52,"N"],
["apteka","Apteka","⚗",79,44,88,51,"N"],
["arena","Arena","🏟",26,60,42,70,"N"],
["switynia","Świątynia","⛪",48,60,59,69,"N"],
["straznica","Strażnica","🗼",66,60,76,69,"N"],
["magazyn","Magazyn","📦",81,59,89,68,"N"],
["dom1","Dom 1","⌂",23,29,29,35,"S"],
["dom2","Dom 2","⌂",80,72,88,77,"N"],
["dom3","Dom 3","⌂",94,30,100,37,"W"],
["dom4","Dom 4","⌂",94,44,100,50,"W"],
["mlyn","Młyn","🌾",9,12,18,20,"S"],
["farma1","Farma 1","🌱",7,28,17,37,"S"],
["farma2","Farma 2","🌱",6,49,16,59,"E"],
["tartak","Tartak","🪵",91,10,104,20,"S"],
["farma3","Farma 3","🌱",94,57,105,67,"W"]
];
const DECOR=[["kamienica1","Kamienica",34,76,39,77],["kamienica2","Kamienica",61,74,66,77],["szopa1","Szopa",2,14,6,19],["szopa2","Szopa",103,33,108,39],["spichlerz","Spichlerz",2,69,9,76],["dom5","Dom",102,72,108,78],["dom6","Dom",2,2,9,8],["warsztat","Warsztat",99,80,106,85]];
export const CITY_BUILDINGS=B.map(([id,name,icon,x1,y1,x2,y2,facing])=>{
 const door=facing==="N"?{x:Math.floor((x1+x2)/2),y:y1}:facing==="S"?{x:Math.floor((x1+x2)/2),y:y2}:facing==="W"?{x:x1,y:Math.floor((y1+y2)/2)}:{x:x2,y:Math.floor((y1+y2)/2)};
 return {id:"city1-"+id,name,icon,bounds:[x1,y1,x2,y2],facing,door,external:x1<20||x2>92,decorative:false};
}).concat(DECOR.map(([id,name,x1,y1,x2,y2])=>({id:"city1-"+id,name,bounds:[x1,y1,x2,y2],decorative:true,external:x1<20||x2>92,door:null})));
export const CITY_STAIRS=[{x:21,y:69},{x:90,y:69}];
export const CITY_GATES=[{x:55,y:8},{x:55,y:78},{x:20,y:43},{x:91,y:43}];
const inside=(x,y,[x1,y1,x2,y2])=>x>=x1&&x<=x2&&y>=y1&&y<=y2;
const isRoad=(x,y)=>(
 (x>=53&&x<=57&&y>=0&&y<=87)||
 (y>=41&&y<=44&&x>=0&&x<=111)||
 (x>=53&&x<=58&&y>=8&&y<=78)||
 (y>=40&&y<=43&&x>=19&&x<=92)||
 (y>=26&&y<=28&&x>=20&&x<=92)||
 (y>=55&&y<=57&&x>=20&&x<=92)||
 (x>=20&&x<=22&&y>=25&&y<=78)||
 (x>=91&&x<=93&&y>=25&&y<=78)||
 (y>=72&&y<=75&&x>=20&&x<=92)||
 (y>=9&&y<=11&&x>=20&&x<=92)||
 (x>=42&&x<=44&&y>=24&&y<=72)||
 (x>=76&&x<=78&&y>=24&&y<=72)
);
export function cityBuildingAt(x,y){return CITY_BUILDINGS.find(b=>inside(x,y,b.bounds))||null;}
export function cityDoorAt(x,y){return CITY_BUILDINGS.find(b=>b.door&&b.door.x===x&&b.door.y===y)||null;}
function baseCityTile(x,y){
 if(x<0||y<0||x>=CITY_WIDTH||y>=CITY_HEIGHT)return "void";
 const b=cityBuildingAt(x,y);
 if(b){if(b.door&&b.door.x===x&&b.door.y===y)return "door";
  const [x1,y1,x2,y2]=b.bounds;
  // Exterior roofs are solid; entering is only possible via the designated portal.
  return "wall";
 }
 // Walled inner town, four aligned gates, outer farms and sawmill.
 const boundary=(x===20||x===91)&&(y>=8&&y<=78)||(y===8||y===78)&&(x>=20&&x<=91);
 if(boundary){
  if(CITY_GATES.some(g=>Math.abs(x-g.x)<=2&&y===g.y||Math.abs(y-g.y)<=2&&x===g.x))return "road";
  return "rampart";
 }
 if(CITY_STAIRS.some(p=>p.x===x&&p.y===y))return "stairs-up";
 if(isRoad(x,y))return "road";
 // Market square, well, planted courtyards and small lanes.
 if(x>=45&&x<=52&&y>=39&&y<=43)return "road";
 if(x>=57&&x<=65&&y>=39&&y<=43)return "road";
 if(x>=46&&x<=51&&y>=53&&y<=55)return "road";
 if(x>=57&&x<=63&&y>=53&&y<=55)return "road";
 if((x===47||x===48)&&y===41)return "water";
 if(x>=10&&x<=15&&y>=39&&y<=46)return "meadow";
 // Door approaches connect to the nearest lane with a clear walkable corridor.
 for(const building of CITY_BUILDINGS){
  const d=building.door;if(!d)continue;
  if(d.x===x&&(Math.abs(y-d.y)<=8)&&((building.facing==="N"&&y<d.y)||(building.facing==="S"&&y>d.y)))return "road";
  if(d.y===y&&(Math.abs(x-d.x)<=8)&&((building.facing==="W"&&x<d.x)||(building.facing==="E"&&x>d.x)))return "road";
 }
 if(x>=20&&x<=91&&y>=8&&y<=78){
  const n=(x*31+y*17+x*y*7)%101;
  return n<5?"tree":n<16?"meadow":"grass";
 }
 if((x*13+y*23)%29===0)return "tree";
 return y>67?"meadow":"grass";
}

// Connect every road fragment to the primary street network without cutting through buildings or city walls.
const EXTRA_ROADS=new Set();
const k=(x,y)=>x+","+y;
const originalRoads=new Set();
for(let y=0;y<CITY_HEIGHT;y++)for(let x=0;x<CITY_WIDTH;x++)if(baseCityTile(x,y)==="road")originalRoads.add(k(x,y));
const mainRoad=new Set(),queue=[k(55,76)];mainRoad.add(queue[0]);
for(let i=0;i<queue.length;i++){
 const [x,y]=queue[i].split(",").map(Number);
 for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const xx=x+dx,yy=y+dy,key=k(xx,yy);
  if(originalRoads.has(key)&&!mainRoad.has(key)){mainRoad.add(key);queue.push(key);}
 }
}
const seen=new Set(mainRoad),parents=new Map(),search=[...mainRoad];
for(let i=0;i<search.length;i++){
 const [x,y]=search[i].split(",").map(Number);
 for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const xx=x+dx,yy=y+dy,key=k(xx,yy);
  if(xx<0||yy<0||xx>=CITY_WIDTH||yy>=CITY_HEIGHT||seen.has(key))continue;
  const t=baseCityTile(xx,yy);
  if(["wall","rampart","void","water","door"].includes(t))continue;
  seen.add(key);parents.set(key,k(x,y));search.push(key);
 }
}
for(const point of originalRoads){
 if(mainRoad.has(point)||!seen.has(point))continue;
 let at=point;
 while(at&&!mainRoad.has(at)){
  EXTRA_ROADS.add(at);
  at=parents.get(at);
 }
}
export function cityTile(x,y){
 const tile=baseCityTile(x,y);
 return EXTRA_ROADS.has(k(x,y))&&tile!=="wall"&&tile!=="rampart"&&tile!=="door"?"road":tile;
}
