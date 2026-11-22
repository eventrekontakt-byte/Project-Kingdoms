import {TAVERN_MAP,TAVERN_SIZE,tavernTile,tavernObject,tavernPortals} from "./interiors/templates.js?v=0.2.9.1";
import {REGION_LAYOUTS,regionTile} from "./regions.js";
import {SITE_LAYOUTS,siteTile} from "./sites.js";
import {CITY_WIDTH,CITY_HEIGHT,CITY_BUILDINGS,cityTile,cityDoorAt} from "./city-one.js";
import {CITY_INTERIORS,interiorTile,interiorMapFor,interiorEntrance} from "./city-interiors.js";
import {BUILDINGS,BUILDING_ENTRIES,roomWall} from "./buildings.js";
// Data-driven locations, floors and explicit paired transitions.
export const START={map:"site-city1",floor:0,x:55,y:76};
export const LOCATIONS={
 ...Object.fromEntries(Object.entries(CITY_INTERIORS).filter(([id])=>id!==TAVERN_MAP).map(([id,l])=>[id,{name:"Miasto 1 — "+l.name,width:l.width,height:l.height,floors:1,base:"wood"}])),
 [TAVERN_MAP]:{name:"Miasto 1 — Karczma",...TAVERN_SIZE,base:"wood"},
 "site-city1":{name:"Miasto 1",width:CITY_WIDTH,height:CITY_HEIGHT,floors:1},
 ...Object.fromEntries(Object.entries(SITE_LAYOUTS).map(([id,l])=>[id,{name:l.name,width:l.width,height:l.height,floors:1}])),
 ...Object.fromEntries(Object.entries(REGION_LAYOUTS).map(([id,l])=>[id,{name:l.name,width:l.width,height:l.height,floors:1}])),
 overworld:{name:"Stara lokacja testowa",width:64,height:44,floors:1},
 keep:{name:"Warownia",width:17,height:13,floors:3,base:"stone"},
 house:{name:"Dom mieszkańca",width:11,height:9,floors:1,base:"wood"},
 inn:{name:"Karczma",width:15,height:11,floors:2,base:"wood"},
 warehouse:{name:"Magazyn",width:13,height:9,floors:1,base:"stone"}
};
export const OBJECTS={
 "keep:0:7:4":{id:"keep-chest",name:"Skrzynia warowni",kind:"chest",description:"Stara skrzynia z zapasami."},
 "house:0:7:4":{id:"house-table",name:"Stół mieszkańca",kind:"inspect",description:"Prosty drewniany stół."},
 "inn:0:9:4":{id:"inn-counter",name:"Lada karczmy",kind:"inspect",description:"Na ladzie leży księga gości."},
 "warehouse:0:6:4":{id:"warehouse-chest",name:"Skrzynia magazynowa",kind:"chest",description:"W środku leżą narzędzia."}
};
const PORTALS=[
 ["overworld",0,24,20,"keep",0,8,11],
 ["keep",0,8,12,"overworld",0,24,21],
 ["overworld",0,35,12,"house",0,1,4],
 ["house",0,0,4,"overworld",0,34,12],
 ["overworld",0,39,23,"inn",0,1,5],
 ["inn",0,0,5,"overworld",0,38,23],
 ["overworld",0,11,31,"warehouse",0,1,4],
 ["warehouse",0,0,4,"overworld",0,10,31]
];
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
for(const building of BUILDINGS){
 const actual=BUILDING_ENTRIES[building.id];
 const matching=PORTALS.find(([map,floor,x,y,target])=>map==="overworld"&&target===building.id);
 if(!matching||matching[2]!==actual.x||matching[3]!==actual.y)throw Error("Building entrance does not face road: "+building.id);
}
for(const b of CITY_BUILDINGS.filter(b=>!b.decorative)){
 if(b.id==="city1-karczma")continue;
 const id=interiorMapFor(b),entry=interiorEntrance(id);
 const offset={N:[0,-1],S:[0,1],W:[-1,0],E:[1,0]}[b.facing];
 PORTALS.push(["site-city1",0,b.door.x,b.door.y,id,0,entry.inside.x,entry.inside.y]);
 PORTALS.push([id,0,entry.door.x,entry.door.y,"site-city1",0,b.door.x+offset[0],b.door.y+offset[1]]);
}
const tavernBuilding=CITY_BUILDINGS.find(b=>b.id==="city1-karczma");
const tavernExterior=[tavernBuilding.door.x,tavernBuilding.door.y+1];
PORTALS.push(["site-city1",0,tavernBuilding.door.x,tavernBuilding.door.y,TAVERN_MAP,0,14,19]);
PORTALS.push([TAVERN_MAP,0,14,21,"site-city1",0,...tavernExterior]);
for(const p of tavernPortals())if(p.to)PORTALS.push([TAVERN_MAP,...p.from,TAVERN_MAP,...p.to]);
const portalIndex=new Map(PORTALS.map(([m,f,x,y,tm,tf,tx,ty])=>[portalKey(m,f,x,y),{map:tm,floor:tf,x:tx,y:ty}]));
export function validLocation(map,floor){return Boolean(LOCATIONS[map]&&Number.isInteger(floor)&&floor>=0&&floor<LOCATIONS[map].floors);}
export function mapSize(map){const l=LOCATIONS[map];return l?{w:l.width,h:l.height}:{w:0,h:0};}
export function objectAt(map,floor,x,y){return map===TAVERN_MAP?tavernObject(floor,x,y):OBJECTS[portalKey(map,floor,x,y)]||null;}
export function transitionAt(map,floor,x,y){return portalIndex.get(portalKey(map,floor,x,y))||null;}
export const DOORS={
 "overworld:0:24:20":{id:"keep-main",name:"Brama warowni",initial:"open"},
 "keep:0:8:12":{id:"keep-main",name:"Brama warowni",initial:"open"},
 "overworld:0:35:12":{id:"house-main",name:"Drzwi domu",initial:"closed"},
 "house:0:0:4":{id:"house-main",name:"Drzwi domu",initial:"closed"},
 "overworld:0:39:23":{id:"inn-main",name:"Drzwi karczmy",initial:"open"},
 "inn:0:0:5":{id:"inn-main",name:"Drzwi karczmy",initial:"open"},
 "overworld:0:11:31":{id:"warehouse-main",name:"Drzwi magazynu",initial:"locked"},
 "warehouse:0:0:4":{id:"warehouse-main",name:"Drzwi magazynu",initial:"locked"}
};
export function doorAt(map,floor,x,y){return DOORS[portalKey(map,floor,x,y)]||null;}
export function defaultDoors(){return Object.fromEntries(Object.values(DOORS).map(d=>[d.id,d.initial]));}
const entrances=BUILDINGS.map(b=>[BUILDING_ENTRIES[b.id].x,BUILDING_ENTRIES[b.id].y]);
export function tileAt(map,floor,x,y){
 if(!validLocation(map,floor))return "void";
 const {w,h}=mapSize(map);
 if(x<0||y<0||x>=w||y>=h)return "void";
 const portal=transitionAt(map,floor,x,y);
 if(portal)return portal.map===map?(portal.floor>floor?"stairs-up":"stairs-down"):"door";
 if(map==="site-city1")return cityTile(x,y);
 if(map===TAVERN_MAP)return tavernTile(floor,x,y);
 if(CITY_INTERIORS[map])return interiorTile(map,x,y);
 if(SITE_LAYOUTS[map])return siteTile(map,x,y);
 if(REGION_LAYOUTS[map])return regionTile(map,x,y);
 if(map==="overworld"){
  if(BUILDINGS.some(({bounds:[x1,y1,x2,y2]})=>x>=x1&&x<=x2&&y>=y1&&y<=y2))return "wall";
  if((x===5&&y>=4&&y<=30)||(y===39&&x>=5&&x<=54))return "water";
  if((y===21&&x>=10&&x<=47)||(x===34&&y>=12&&y<=21)||(x===38&&y>=21&&y<=26)||(x===10&&y>=21&&y<=34))return "road";
  if((x*17+y*31+x*y*7)%47===0&&!entrances.some(([ex,ey])=>Math.abs(ex-x)+Math.abs(ey-y)<=2))return "tree";
  if(x>47&&y<19&&((x*11+y*7)%9)<3)return "hill";
  if(y>31&&x>26&&((x*13+y*5)%8)<3)return "meadow";
  return "grass";
 }
 if(x===0||y===0||x===w-1||y===h-1)return "wall";
 if(roomWall(map,floor,x,y,w,h))return "wall";
 if(objectAt(map,floor,x,y))return "object";
 return LOCATIONS[map].base==="wood"?"wood":floor===2?"marble":"stone";
}
export function blocked(map,floor,x,y){return ["void","wall","tree","water","object"].includes(tileAt(map,floor,x,y));}
export function mapName(map,floor){const l=LOCATIONS[map];return l?`${l.name}${l.floors>1?` — piętro ${floor}`:""}`:"Nieznana lokacja";}
export const COLORS={void:"#050a0e",wall:"#36404a",tree:"#285b34",water:"#225d8c",road:"#8a7a60",rampart:"#a6a7a0",grass:"#416f45","forest-floor":"#365b3a",rock:"#79786c",hill:"#5b7750",meadow:"#689257",stone:"#777a78",wood:"#927b56",marble:"#8d9ba3",door:"#e4b64c","stairs-up":"#ad87dd","stairs-down":"#8863c0",object:"#b68b53"};
