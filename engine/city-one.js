// Project Kingdoms — City 1 urban plan v0.3.14. Stable, hand-authored hybrid city.
export const CITY_WIDTH=192,CITY_HEIGHT=160;
const DATA=[
["twierdza","Twierdza","🏰",48,34,69,50,"S"],["koszary","Koszary","🛡",32,47,44,55,"S"],["zbrojownia","Zbrojownia","⚔",90,45,101,53,"S"],
["biblioteka","Biblioteka","📚",102,45,114,54,"S"],["karczma","Karczma","🍺",91,81,103,91,"S"],["kasyno","Kasyno","🎲",121,83,133,91,"S"],["kuznia","Kuźnia","⚒",145,91,156,99,"W"],
["piekarnia","Piekarnia","🥖",73,99,83,106,"N"],["targ","Hala targowa","⚖",107,100,122,110,"N"],["stajnia","Stajnia","🐴",137,111,150,121,"N"],["apteka","Apteka","⚗",113,65,122,73,"S"],
["arena","Arena","🏟",43,108,60,121,"N"],["switynia","Świątynia","⛪",68,115,83,127,"N"],["straznica","Strażnica","🗼",155,67,165,77,"W"],["magazyn","Magazyn","📦",154,106,164,116,"W"],
["dom1","Dom 1","⌂",77,65,84,71,"E"],["dom2","Dom 2","⌂",107,117,116,124,"N"],["dom3","Dom 3","⌂",138,63,145,70,"W"],["dom4","Dom 4","⌂",132,125,141,132,"N"],
["mlyn","Młyn","🌾",13,25,23,35,"S"],["farma1","Farma 1","🌱",9,49,21,61,"E"],["farma2","Farma 2","🌱",12,107,25,119,"E"],["tartak","Tartak","🪵",171,36,185,48,"W"],["farma3","Farma 3","🌱",171,111,185,125,"W"]
];
const DECOR=[
["kamienica1","Kamienica",103,61,110,68],["kamienica2","Kamienica",123,62,130,70],["szopa1","Szopa",31,93,37,99],["szopa2","Szopa",146,57,152,63],
["spichlerz","Spichlerz",31,103,39,111],["dom5","Dom",120,118,127,125],["dom6","Dom",87,59,95,66],["warsztat","Warsztat",143,125,153,133],
["kamienica3","Kamienica",105,76,112,82],["kamienica4","Kamienica",117,77,125,82],["kamienica5","Kamienica",77,78,85,85],
["dom7","Dom",35,68,42,75],["dom8","Dom",43,75,50,82],["dom9","Dom",53,84,61,91],["dom10","Dom",65,91,72,97],
["dom11","Dom",147,78,153,85],["dom12","Dom",133,101,141,108],["ogrod","Ogród",43,95,52,103]
];
const rect=(x,y,b)=>x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3];
export const CITY_BUILDINGS=DATA.map(([id,name,icon,x1,y1,x2,y2,facing])=>{
 const door=facing==="N"?{x:Math.floor((x1+x2)/2),y:y1}:facing==="S"?{x:Math.floor((x1+x2)/2),y:y2}:facing==="W"?{x:x1,y:Math.floor((y1+y2)/2)}:{x:x2,y:Math.floor((y1+y2)/2)};
 return {id:"city1-"+id,name,icon,bounds:[x1,y1,x2,y2],facing,door,external:x1<26||x2>166,decorative:false};
}).concat(DECOR.map(([id,name,x1,y1,x2,y2])=>({id:"city1-"+id,name,bounds:[x1,y1,x2,y2],decorative:true,external:false,door:null})));
export const CITY_GATES=[
{id:"north",name:"Brama Północna",x:96,y:20,axis:"vertical",bounds:[94,18,98,22]},
{id:"south",name:"Brama Południowa",x:96,y:139,axis:"vertical",bounds:[94,137,98,141]},
{id:"west",name:"Brama Zachodnia",x:24,y:80,axis:"horizontal",bounds:[22,78,26,82]},
{id:"east",name:"Brama Wschodnia",x:167,y:80,axis:"horizontal",bounds:[165,78,169,82]}];
export const CITY_STAIRS=[];
export function cityGatePart(x,y){
 for(const g of CITY_GATES){if(!rect(x,y,g.bounds))continue;const cross=g.axis==="vertical"?x-g.x:y-g.y;
 return {gate:g,part:Math.abs(cross)===2?"tower":"passage"};}
 return null;
}
export function cityBuildingAt(x,y){return CITY_BUILDINGS.find(b=>rect(x,y,b.bounds))||null;}
export function cityDoorAt(x,y){return CITY_BUILDINGS.find(b=>b.door&&b.door.x===x&&b.door.y===y)||null;}
// Irregular polygon: wider old town, tighter northern shoulders and southern wards.
const OUTLINE=[[79,20],[113,20],[132,26],[150,36],[161,51],[167,67],[167,95],[160,112],[147,128],[120,139],[73,139],[48,131],[31,112],[24,94],[24,67],[31,49],[47,34],[65,25]];
function within(x,y){let inside=false;for(let i=0,j=OUTLINE.length-1;i<OUTLINE.length;j=i++){const a=OUTLINE[i],b=OUTLINE[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
const KEY=(x,y)=>x+","+y;
const WALL=new Set(),INNER=new Set(),ROAD=new Set();
function mark(set,x,y,r=0){for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++)if(x+dx>=0&&y+dy>=0&&x+dx<CITY_WIDTH&&y+dy<CITY_HEIGHT&&Math.hypot(dx,dy)<=r+.25)set.add(KEY(x+dx,y+dy));}
function line(set,a,b,r=0){const n=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]))*2;for(let i=0;i<=n;i++){const t=i/n;mark(set,Math.round(a[0]+(b[0]-a[0])*t),Math.round(a[1]+(b[1]-a[1])*t),r);}}
function path(set,pts,r){for(let i=1;i<pts.length;i++)line(set,pts[i-1],pts[i],r);}
for(let y=1;y<CITY_HEIGHT-1;y++)for(let x=1;x<CITY_WIDTH-1;x++)if(within(x,y)){for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(!within(x+dx,y+dy)){mark(WALL,x,y,1);break;}}
const MAIN=[
[[96,0],[96,20],[97,32],[94,45],[96,60],[95,76],[96,97],[96,117],[96,139],[96,159]],
[[0,80],[24,80],[39,82],[56,78],[72,84],[96,87],[119,85],[140,81],[167,80],[191,80]],
[[35,54],[49,60],[67,66],[85,74],[96,87],[112,100],[132,114],[150,128]],
[[43,116],[60,108],[78,101],[96,87],[117,72],[138,60],[159,53]],
[[44,82],[54,94],[66,108],[79,119],[96,126],[118,125],[137,119]],
[[42,62],[56,55],[70,57],[83,65],[97,74],[113,79],[132,75],[149,72]],
[[52,38],[66,52],[79,60],[93,66],[110,60],[127,49],[143,40]]
];
for(const p of MAIN)path(ROAD,p,2);
const LANES=[
[[35,72],[49,72],[61,78],[75,78],[88,84]],[[44,96],[56,97],[66,102],[80,109]],
[[74,57],[75,72],[70,86],[75,97]],[[114,52],[115,64],[118,77],[123,88]],
[[135,53],[136,68],[142,82],[147,95],[151,109]],[[53,113],[64,121],[79,131]],
[[106,106],[119,112],[130,125]],[[39,85],[36,97],[42,112]],[[153,57],[155,68],[159,81]],
[[84,36],[81,48],[89,60]],[[104,35],[108,47],[116,58]],[[65,89],[79,88],[96,87]],
[[108,94],[123,96],[140,102]],[[92,112],[109,113],[126,110]],[[97,102],[103,108],[112,116]]
];
for(const p of LANES)path(ROAD,p,1);
// Keep the countryside agricultural: only two main approaches outside the city.
for(const key of [...ROAD]){const [x,y]=key.split(",").map(Number);if(!within(x,y)&&!(Math.abs(x-96)<=3||Math.abs(y-80)<=3))ROAD.delete(key);}
// The citadel is a separate walled precinct, with a guarded southern entry.
const CITADEL=[45,31,73,59];
for(let x=CITADEL[0];x<=CITADEL[2];x++)for(let y=CITADEL[1];y<=CITADEL[3];y++)
 if(x<=46||x>=72||y<=32||y>=57)INNER.add(KEY(x,y));
path(ROAD,[[60,58],[60,65],[67,70],[83,77]],1);
for(let y=57;y<=59;y++)for(let x=58;x<=62;x++)INNER.delete(KEY(x,y));
// Wall courses must never pass through buildings or cover the gate passage.
for(const b of CITY_BUILDINGS)for(let y=b.bounds[1]-1;y<=b.bounds[3]+1;y++)for(let x=b.bounds[0]-1;x<=b.bounds[2]+1;x++){WALL.delete(KEY(x,y));INNER.delete(KEY(x,y));}
for(const g of CITY_GATES)for(let y=g.bounds[1];y<=g.bounds[3];y++)for(let x=g.bounds[0];x<=g.bounds[2];x++){WALL.delete(KEY(x,y));INNER.delete(KEY(x,y));}
// Put the staircase on walkable ground exactly next to a wall, with a clear approach.
for(const [x,y] of [[48,60],[69,60],[74,43],[44,43],[96,23],[103,25],[89,25],[96,136],[89,135],[103,135],[27,73],[28,89],[164,73],[163,91],[54,132],[136,121]]){
 if(CITY_BUILDINGS.some(b=>rect(x,y,b.bounds))||WALL.has(KEY(x,y))||INNER.has(KEY(x,y)))continue;
 if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>WALL.has(KEY(x+dx,y+dy))||INNER.has(KEY(x+dx,y+dy))))CITY_STAIRS.push({x,y});
}
// Supplement hand-placed stairs with distributed access along the outer curtain.
for(let y=25;y<136;y+=12)for(const side of [0,1]){
 const candidates=[];
 for(let x=28;x<164;x++)if((side===0?x<96:x>=96)&&!WALL.has(KEY(x,y))&&!INNER.has(KEY(x,y))&&!CITY_BUILDINGS.some(b=>rect(x,y,b.bounds))&&dirsPlaceholder(x,y))candidates.push(x);
 if(candidates.length){const x=candidates[Math.floor(candidates.length/2)];if(!CITY_STAIRS.some(p=>Math.abs(p.x-x)+Math.abs(p.y-y)<7))CITY_STAIRS.push({x,y});}
}
function dirsPlaceholder(x,y){return [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>WALL.has(KEY(x+dx,y+dy)));}
// Build safe approach lanes from each entrance to the closest already connected street.
// Use shortest-path search, never cutting buildings, gates or walls.
const occupied=new Set();for(const b of CITY_BUILDINGS)for(let y=b.bounds[1];y<=b.bounds[3];y++)for(let x=b.bounds[0];x<=b.bounds[2];x++)occupied.add(KEY(x,y));
const forbidden=(x,y)=>x<1||y<1||x>=CITY_WIDTH-1||y>=CITY_HEIGHT-1||occupied.has(KEY(x,y))||WALL.has(KEY(x,y))||INNER.has(KEY(x,y));
const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
for(const b of CITY_BUILDINGS.filter(b=>b.door)){
 const offset={N:[0,-1],S:[0,1],W:[-1,0],E:[1,0]}[b.facing],start=[b.door.x+offset[0],b.door.y+offset[1]];
 if(forbidden(...start))continue;
 const q=[start],prev=new Map([[KEY(...start),null]]);let found=null;
 for(let i=0;i<q.length;i++){const [x,y]=q[i],k=KEY(x,y);if(ROAD.has(k)&&(!b.external||!within(x,y))){found=k;break;}
 for(const [dx,dy] of dirs){const xx=x+dx,yy=y+dy,kk=KEY(xx,yy);if(forbidden(xx,yy)||prev.has(kk)||(b.external&&within(xx,yy)))continue;prev.set(kk,k);q.push([xx,yy]);}}
 for(let at=found;at;at=prev.get(at))ROAD.add(at);
 ROAD.add(KEY(...start));
}
export const CITY_VACANT_PLOTS=[
{id:"city1-vacant-1",name:"Wolna działka 1",bounds:[31,119,37,125],status:"vacant"},
{id:"city1-vacant-2",name:"Wolna działka 2",bounds:[158,121,164,127],status:"vacant"},
{id:"city1-vacant-3",name:"Wolna działka 3",bounds:[12,68,18,74],status:"vacant"},
{id:"city1-vacant-4",name:"Wolna działka 4",bounds:[9,131,18,138],status:"vacant"},
{id:"city1-vacant-5",name:"Wolna działka 5",bounds:[173,91,180,98],status:"vacant"}];
const VACANT=new Set();for(const p of CITY_VACANT_PLOTS)for(let y=p.bounds[1];y<=p.bounds[3];y++)for(let x=p.bounds[0];x<=p.bounds[2];x++)VACANT.add(KEY(x,y));
export function cityTile(x,y){
 if(x<0||y<0||x>=CITY_WIDTH||y>=CITY_HEIGHT)return "void";
 const gate=cityGatePart(x,y);if(gate)return gate.part==="tower"?"rampart":"road";
 const b=cityBuildingAt(x,y);if(b)return b.door?.x===x&&b.door?.y===y?"door":"wall";
 const key=KEY(x,y);
 if(VACANT.has(key))return "meadow";
 if(CITY_STAIRS.some(s=>s.x===x&&s.y===y))return "stairs-up";
 if(INNER.has(key)||WALL.has(key))return "rampart";
 if(ROAD.has(key))return "road";
 if(!within(x,y))return y>130?"meadow":(x*13+y*17)%23===0?"tree":"grass";
 if(x>=88&&x<=107&&y>=82&&y<=100)return "road";
 if(x>=46&&x<=72&&y>=34&&y<=55)return "stone";
 const n=(x*31+y*17+x*y*7)%101;
 return n<4?"tree":n<24?"meadow":"grass";
}
export function cityStepAllowed(x1,y1,x2,y2){
 const a=cityTile(x1,y1),b=cityTile(x2,y2);
 if(a!=="rampart"&&b!=="rampart")return true;
 if(a==="rampart"&&b==="rampart")return true;
 if(a==="stairs-up"||b==="stairs-up")return true;
 return CITY_GATES.some(g=>Math.abs(x1-g.x)<=3&&Math.abs(y1-g.y)<=3&&Math.abs(x2-g.x)<=3&&Math.abs(y2-g.y)<=3);
}
export function cityGateBarrierAt(x,y){return CITY_GATES.find(g=>g.axis==="vertical"?y===g.y&&Math.abs(x-g.x)<=1:x===g.x&&Math.abs(y-g.y)<=1)||null;}
export function cityGateControlNear(x,y){return CITY_GATES.find(g=>Math.abs(x-g.x)+Math.abs(y-g.y)<=4)||null;}
export function cityLayoutIssues(){
 const issues=[];
 for(let i=0;i<CITY_BUILDINGS.length;i++){
 const a=CITY_BUILDINGS[i],A=a.bounds;
 for(let j=i+1;j<CITY_BUILDINGS.length;j++){const b=CITY_BUILDINGS[j],B=b.bounds;if(A[0]<=B[2]&&A[2]>=B[0]&&A[1]<=B[3]&&A[3]>=B[1])issues.push("overlap:"+a.id+":"+b.id);}
 for(const g of CITY_GATES){const G=g.bounds;if(A[0]<=G[2]&&A[2]>=G[0]&&A[1]<=G[3]&&A[3]>=G[1])issues.push("gate:"+a.id+":"+g.id);}
 if(a.door){const [dx,dy]={N:[0,-1],S:[0,1],W:[-1,0],E:[1,0]}[a.facing];if(["wall","rampart","void","water"].includes(cityTile(a.door.x+dx,a.door.y+dy)))issues.push("door:"+a.id);}
 }
 return issues;
}
