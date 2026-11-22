// City interiors generated from canonical BIS 1.0 exterior footprints.
import {CITY_BUILDINGS} from "./city-one.js";
import {buildingInteriorSize,interiorMask,interiorDoor} from "./bis.js";
export const CITY_INTERIORS=Object.fromEntries(CITY_BUILDINGS.filter(b=>!b.decorative).map((b,i)=>{
 const id="interior-"+b.id;
 return [id,{name:b.name,...buildingInteriorSize(b),floors:1,building:b,seed:i+1}];
}));
export function interiorMapFor(b){return "interior-"+b.id;}
export function interiorEntrance(map){const l=CITY_INTERIORS[map];return l?interiorDoor(l.building):null;}
export function interiorTile(map,x,y){
 const l=CITY_INTERIORS[map];if(!l)return "void";
 const mask=interiorMask(l.building),e=interiorEntrance(map);
 if(!mask.inside(x,y))return "void";
 if(x===e.door.x&&y===e.door.y)return "door";
 if(mask.edge(x,y))return "wall";
 // Cross-shaped public circulation, scaled to the building's actual outline.
 const cx=Math.floor(l.width/2),cy=Math.floor(l.height/2);
 if(Math.abs(x-cx)<=1||Math.abs(y-cy)<=1||Math.abs(x-e.inside.x)+Math.abs(y-e.inside.y)<=3)return "wood";
 // Interiors remain deliberately sparse until dedicated TBI templates are authored.
 return l.seed%3===0?"stone":"wood";
}
