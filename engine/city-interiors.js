// Cached BIS interiors: masks and doors are computed once per building,
// never for every visible tile on every animation frame.
import {CITY_BUILDINGS} from "./city-one.js";
import {buildingInteriorSize,interiorMask,interiorDoor} from "./bis.js";
export const CITY_INTERIORS=Object.fromEntries(CITY_BUILDINGS.filter(b=>!b.decorative).map((b,i)=>{
 const id="interior-"+b.id;
 return [id,{name:b.name,...buildingInteriorSize(b),floors:1,building:b,seed:i+1}];
}));
const GEOMETRY=Object.fromEntries(Object.entries(CITY_INTERIORS).map(([id,l])=>[id,{mask:interiorMask(l.building),entrance:interiorDoor(l.building)}]));
export function interiorMapFor(b){return "interior-"+b.id;}
export function interiorEntrance(map){return GEOMETRY[map]?.entrance||null;}
export function interiorTile(map,x,y){
 const l=CITY_INTERIORS[map],g=GEOMETRY[map];if(!l||!g)return "void";
 const {mask,entrance:e}=g;
 if(!mask.inside(x,y))return "void";
 if(x===e.door.x&&y===e.door.y)return "door";
 if(mask.edge(x,y))return "wall";
 return l.seed%3===0?"stone":"wood";
}
