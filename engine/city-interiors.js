// Cached BIS interiors: masks and doors are computed once per building,
// never for every visible tile on every animation frame.
import {CITY_BUILDINGS} from "./city-one.js";
import {buildingInteriorSize,interiorMask,interiorDoor} from "./bis.js";
export const CITY_INTERIORS=Object.fromEntries(CITY_BUILDINGS.filter(b=>!b.decorative).map((b,i)=>{
 const id="interior-"+b.id;
 return [id,{name:b.name,...buildingInteriorSize(b),floors:1,building:b,seed:i+1}];
}));
const GEOMETRY=Object.fromEntries(Object.entries(CITY_INTERIORS).map(([id,l])=>[id,{mask:interiorMask(l.building),entrance:interiorDoor(l.building)}]));
// Small, fixed TBI furnishing sets. All coordinates derive from the room mask;
// wall-side storage and beds never block the central circulation or entrance.
const FURNITURE=Object.fromEntries(Object.entries(CITY_INTERIORS).map(([id,l])=>{
 const {mask,entrance}=GEOMETRY[id],items=[],used=new Set();
 const add=(type,x,y,w,h)=>{
  if(x<1||y<1||x+w>=l.width-1||y+h>=l.height-1)return;
  for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
   if(!mask.inside(xx,yy)||mask.edge(xx,yy)||used.has(xx+","+yy))return;
   if(Math.abs(xx-entrance.inside.x)+Math.abs(yy-entrance.inside.y)<5)return;
   if(Math.abs(xx-Math.floor(l.width/2))<=1||Math.abs(yy-Math.floor(l.height/2))<=1)return;
  }
  const item={id:id+"-"+items.length,type,x,y,w,h,name:{bed:"Łóżko",shelf:"Regał",chest:"Skrzynia",table:"Stół",counter:"Lada",crate:"Skrzynia towarowa"}[type]||type};
  items.push(item);for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)used.add(xx+","+yy);
 };
 const kind=l.building.id.replace("city1-","");
 const storage=/magazyn|zbrojownia|stajnia|tartak|mlyn|farma/.test(kind);
 const residence=/dom|koszary|twierdza/.test(kind);
 const commerce=/piekarnia|apteka|kuznia|biblioteka|kasyno|targ/.test(kind);
 // Top/bottom wall furnishings, with a one-tile walkable gap.
 add(residence?"bed":storage?"crate":"shelf",2,2,residence?2:3,2);
 add(storage?"crate":"shelf",l.width-6,2,3,2);
 add(residence?"chest":storage?"crate":"shelf",2,l.height-4,2,2);
 add(storage?"crate":commerce?"counter":"chest",l.width-7,l.height-4,4,2);
 if(l.width>=24&&l.height>=21){add("table",Math.floor(l.width/2)-5,Math.floor(l.height/2)-5,3,2);add("table",Math.floor(l.width/2)+3,Math.floor(l.height/2)+3,3,2);}
 return [id,{items,byTile:new Map(items.flatMap(item=>Array.from({length:item.w*item.h},(_,i)=>[(item.x+i%item.w)+","+(item.y+Math.floor(i/item.w)),item])))}];
}));
export function interiorFurniture(map){return FURNITURE[map]?.items||[];}
export function interiorObjectAt(map,x,y){const item=FURNITURE[map]?.byTile.get(x+","+y);return item?{id:item.id,name:item.name,kind:"inspect",description:item.name+" we wnętrzu budynku."}:null;}
export function interiorMapFor(b){return "interior-"+b.id;}
export function interiorEntrance(map){return GEOMETRY[map]?.entrance||null;}
export function interiorTile(map,x,y){
 const l=CITY_INTERIORS[map],g=GEOMETRY[map];if(!l||!g)return "void";
 const {mask,entrance:e}=g;
 if(!mask.inside(x,y))return "void";
 if(x===e.door.x&&y===e.door.y)return "door";
 if(mask.edge(x,y))return "wall";
 if(FURNITURE[map]?.byTile.has(x+","+y))return "object";
 return l.seed%3===0?"stone":"wood";
}
