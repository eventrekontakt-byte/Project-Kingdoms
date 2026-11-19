// City 1 interiors: door orientation matches exterior facade, with an accessible return tile.
import {CITY_BUILDINGS} from "./city-one.js";
export const CITY_INTERIORS=Object.fromEntries(CITY_BUILDINGS.filter(b=>!b.decorative).map((b,i)=>{
 const id="interior-"+b.id;
 const large=["twierdza","arena","targ","koszary","stajnia","biblioteka"].some(t=>b.id.endsWith(t));
 const width=large?30:22,height=large?22:17;
 return [id,{name:b.name,width,height,floors:1,building:b,seed:i+1}];
}));
export function interiorMapFor(b){return "interior-"+b.id;}
export function interiorEntrance(map){
 const l=CITY_INTERIORS[map];if(!l)return null;
 const {width:w,height:h,building:b}=l;
 const midX=Math.floor(w/2),midY=Math.floor(h/2);
 const facing=b.facing;
 const door=facing==="N"?{x:midX,y:0}:facing==="S"?{x:midX,y:h-1}:facing==="W"?{x:0,y:midY}:{x:w-1,y:midY};
 const inside=facing==="N"?{x:midX,y:1}:facing==="S"?{x:midX,y:h-2}:facing==="W"?{x:1,y:midY}:{x:w-2,y:midY};
 return {door,inside,facing};
}
export function interiorTile(map,x,y){
 const l=CITY_INTERIORS[map];if(!l)return "void";
 const {width:w,height:h,seed}=l,mid=Math.floor(w/2);
 if(x<0||y<0||x>=w||y>=h)return "void";
 const e=interiorEntrance(map);
 if(x===e.door.x&&y===e.door.y)return "door";
 if(x===0||y===0||x===w-1||y===h-1)return "wall";
 // A two-tile circulation corridor connects all four potential entrance facades.
 if(Math.abs(x-mid)<=1||Math.abs(y-Math.floor(h/2))<=1||Math.abs(x-e.inside.x)+Math.abs(y-e.inside.y)<=2)return "wood";
 if((x===5||x===w-6)&&y>=4&&y<=h-6&&y%5!==0)return "wall";
 if((x>=3&&x<=6||x>=w-7&&x<=w-4)&&y>=4&&y<=h-6&&((y+seed)%5===0||y===4))return "object";
 if(y===3&&x>4&&x<w-5&&x%4===0)return "object";
 return seed%3===0?"stone":"wood";
}
