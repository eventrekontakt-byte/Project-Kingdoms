// Data-driven locations, floors and explicit paired transitions.
export const START={map:"overworld",floor:0,x:12,y:17};
export const LOCATIONS={
 overworld:{name:"Pogranicze",width:64,height:44,floors:1},
 keep:{name:"Warownia",width:17,height:13,floors:3,base:"stone"},
 house:{name:"Dom mieszkańca",width:11,height:9,floors:1,base:"wood"},
 inn:{name:"Karczma",width:15,height:11,floors:2,base:"wood"},
 warehouse:{name:"Magazyn",width:13,height:9,floors:1,base:"stone"}
};
export const OBJECTS={
 "keep:0:7:4":{id:"keep-chest",name:"Skrzynia warowni",kind:"chest",description:"Stara skrzynia z zapasami."},
 "house:0:5:4":{id:"house-table",name:"Stół mieszkańca",kind:"inspect",description:"Prosty drewniany stół."},
 "inn:0:7:5":{id:"inn-counter",name:"Lada karczmy",kind:"inspect",description:"Na ladzie leży księga gości."},
 "warehouse:0:6:4":{id:"warehouse-chest",name:"Skrzynia magazynowa",kind:"chest",description:"W środku leżą narzędzia."}
};
const PORTALS=[
 ["overworld",0,24,20,"keep",0,8,11],
 ["keep",0,8,12,"overworld",0,24,21],
 ["overworld",0,38,14,"house",0,5,7],
 ["house",0,5,8,"overworld",0,38,15],
 ["overworld",0,42,25,"inn",0,7,9],
 ["inn",0,7,10,"overworld",0,42,26],
 ["overworld",0,14,33,"warehouse",0,6,7],
 ["warehouse",0,6,8,"overworld",0,14,34]
];
for(const [map,floor,x,y,target,targetFloor,tx,ty] of [...PORTALS]){
 // All entry/exit portals are explicitly paired in the table.
}
for(const map of ["keep","inn"]){
 const max=LOCATIONS[map].floors;
 for(let floor=0;floor<max-1;floor++){
  const a=map==="keep"?3:4,b=map==="keep"?13:10;
  for(const x of [a,b]){
   PORTALS.push([map,floor,x,3,map,floor+1,x,LOCATIONS[map].height-4]);
   PORTALS.push([map,floor+1,x,LOCATIONS[map].height-4,map,floor,x,3]);
  }
 }
}
const portalKey=(m,f,x,y)=>`${m}:${f}:${x}:${y}`;
const portalIndex=new Map(PORTALS.map(([m,f,x,y,tm,tf,tx,ty])=>[portalKey(m,f,x,y),{map:tm,floor:tf,x:tx,y:ty}]));
export function validLocation(map,floor){return Boolean(LOCATIONS[map]&&Number.isInteger(floor)&&floor>=0&&floor<LOCATIONS[map].floors);}
export function mapSize(map){const l=LOCATIONS[map];return l?{w:l.width,h:l.height}:{w:0,h:0};}
export function objectAt(map,floor,x,y){return OBJECTS[portalKey(map,floor,x,y)]||null;}
export function transitionAt(map,floor,x,y){return portalIndex.get(portalKey(map,floor,x,y))||null;}
const entrances=[[24,20],[38,14],[42,25],[14,33]];
export function tileAt(map,floor,x,y){
 if(!validLocation(map,floor))return "void";
 const {w,h}=mapSize(map);
 if(x<0||y<0||x>=w||y>=h)return "void";
 const portal=transitionAt(map,floor,x,y);
 if(portal)return portal.map===map?(portal.floor>floor?"stairs-up":"stairs-down"):"door";
 if(map==="overworld"){
  const structures=[[20,12,28,20],[35,10,41,14],[39,21,47,25],[11,29,18,33]];
  if(structures.some(([x1,y1,x2,y2])=>x>=x1&&x<=x2&&y>=y1&&y<=y2))return "wall";
  if((x===5&&y>=4&&y<=30)||(y===39&&x>=5&&x<=54))return "water";
  if((x*17+y*31+x*y*7)%47===0&&!entrances.some(([ex,ey])=>Math.abs(ex-x)+Math.abs(ey-y)<=2))return "tree";
  if((y===21&&x>=10&&x<=47)||(x===38&&y>=14&&y<=25)||(x===14&&y>=21&&y<=34))return "road";
  return "grass";
 }
 if(x===0||y===0||x===w-1||y===h-1)return "wall";
 if(map==="keep"&&y===6&&x>=5&&x<=11&&x!==8)return "wall";
 if(objectAt(map,floor,x,y))return "object";
 return LOCATIONS[map].base==="wood"?"wood":floor===2?"marble":"stone";
}
export function blocked(map,floor,x,y){return ["void","wall","tree","water","object"].includes(tileAt(map,floor,x,y));}
export function mapName(map,floor){const l=LOCATIONS[map];return l?`${l.name}${l.floors>1?` — piętro ${floor}`:""}`:"Nieznana lokacja";}
export const COLORS={void:"#050a0e",wall:"#36404a",tree:"#285b34",water:"#225d8c",road:"#8a7a60",grass:"#416f45",stone:"#777a78",wood:"#927b56",marble:"#8d9ba3",door:"#e4b64c","stairs-up":"#ad87dd","stairs-down":"#8863c0",object:"#b68b53"};
