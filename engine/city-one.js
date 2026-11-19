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
["dom1","Dom 1","⌂",18,29,24,35,"E"],
["dom2","Dom 2","⌂",18,44,24,50,"E"],
["dom3","Dom 3","⌂",90,30,96,37,"W"],
["dom4","Dom 4","⌂",90,44,96,50,"W"],
["mlyn","Młyn","🌾",9,12,18,20,"S"],
["farma1","Farma 1","🌱",7,28,17,37,"E"],
["farma2","Farma 2","🌱",6,49,16,59,"E"],
["tartak","Tartak","🪵",91,10,104,20,"S"],
["farma3","Farma 3","🌱",94,57,105,67,"W"]
];
export const CITY_BUILDINGS=B.map(([id,name,icon,x1,y1,x2,y2,facing])=>{
 const door=facing==="N"?{x:Math.floor((x1+x2)/2),y:y1}:facing==="S"?{x:Math.floor((x1+x2)/2),y:y2}:facing==="W"?{x:x1,y:Math.floor((y1+y2)/2)}:{x:x2,y:Math.floor((y1+y2)/2)};
 return {id:"city1-"+id,name,icon,bounds:[x1,y1,x2,y2],facing,door,external:x1<20||x2>92};
});
export const CITY_GATES=[{x:55,y:8},{x:55,y:78},{x:20,y:43},{x:91,y:43}];
const inside=(x,y,[x1,y1,x2,y2])=>x>=x1&&x<=x2&&y>=y1&&y<=y2;
const isRoad=(x,y)=>(
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
export function cityDoorAt(x,y){return CITY_BUILDINGS.find(b=>b.door.x===x&&b.door.y===y)||null;}
export function cityTile(x,y){
 if(x<0||y<0||x>=CITY_WIDTH||y>=CITY_HEIGHT)return "void";
 const b=cityBuildingAt(x,y);
 if(b){if(b.door.x===x&&b.door.y===y)return "door";
  const [x1,y1,x2,y2]=b.bounds;
  return x===x1||x===x2||y===y1||y===y2?"wall":"wood";
 }
 // Walled inner town, four aligned gates, outer farms and sawmill.
 const boundary=(x===20||x===91)&&(y>=8&&y<=78)||(y===8||y===78)&&(x>=20&&x<=91);
 if(boundary){
  if(CITY_GATES.some(g=>Math.abs(x-g.x)<=2&&y===g.y||Math.abs(y-g.y)<=2&&x===g.x))return "road";
  return "wall";
 }
 if(isRoad(x,y))return "road";
 // Door approaches connect to the nearest lane with a clear walkable corridor.
 for(const building of CITY_BUILDINGS){
  const d=building.door;
  if(d.x===x&&(Math.abs(y-d.y)<=4)&&((building.facing==="N"&&y<d.y)||(building.facing==="S"&&y>d.y)))return "road";
  if(d.y===y&&(Math.abs(x-d.x)<=4)&&((building.facing==="W"&&x<d.x)||(building.facing==="E"&&x>d.x)))return "road";
 }
 if(x>=20&&x<=91&&y>=8&&y<=78){
  const n=(x*31+y*17+x*y*7)%101;
  return n<5?"tree":n<16?"meadow":"grass";
 }
 if((x*13+y*23)%29===0)return "tree";
 return y>67?"meadow":"grass";
}
