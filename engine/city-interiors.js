// Functional, independently sized interiors for every accessible City 1 building.
import {CITY_BUILDINGS} from "./city-one.js";
export const CITY_INTERIORS=Object.fromEntries(CITY_BUILDINGS.filter(b=>!b.decorative).map((b,i)=>{
 const id="interior-"+b.id;
 const large=["twierdza","arena","targ","koszary","stajnia","biblioteka"].some(t=>b.id.endsWith(t));
 const width=large?30:22,height=large?22:17;
 return [id,{name:b.name,width,height,floors:1,building:b,seed:i+1}];
}));
export function interiorMapFor(b){return "interior-"+b.id;}
export function interiorEntrance(map){const l=CITY_INTERIORS[map];return l?{x:Math.floor(l.width/2),y:l.height-2}:null;}
export function interiorTile(map,x,y){
 const l=CITY_INTERIORS[map];if(!l)return "void";
 const {width:w,height:h,seed}=l,mid=Math.floor(w/2);
 if(x<0||y<0||x>=w||y>=h)return "void";
 if(y===h-2&&x===mid)return "door";
 if(x===0||y===0||x===w-1||y===h-1)return "wall";
 // Central aisle, furnished workstations and side rooms; interiors may exceed external footprint.
 if(x===mid||x===mid-1||y===h-3)return "wood";
 if((x===5||x===w-6)&&y>=4&&y<=h-6&&y%5!==0)return "wall";
 if((x>=3&&x<=6||x>=w-7&&x<=w-4)&&y>=4&&y<=h-6&&((y+seed)%5===0||y===4))return "object";
 if(y===3&&x>4&&x<w-5&&x%4===0)return "object";
 return (seed%3===0)?"stone":"wood";
}
