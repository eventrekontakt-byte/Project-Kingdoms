// Project Kingdoms 0.1 — test world. All transition targets are explicit.
export const MAP_W=48,MAP_H=36;
export const START={map:"overworld",floor:0,x:12,y:17};
const inside=(x,y,w,h)=>x>=0&&y>=0&&x<w&&y<h;
export function mapSize(map){return map==="overworld"?{w:MAP_W,h:MAP_H}:{w:17,h:13};}
export function tileAt(map,floor,x,y){
 const {w,h}=mapSize(map);if(!inside(x,y,w,h))return "void";
 if(map==="overworld"){
  if(x===24&&y===20)return "door";
  if(x>=20&&x<=28&&y>=12&&y<=20)return "wall";
  if((x===5&&y>=4&&y<=30)||(y===28&&x>=5&&x<=34))return "water";
  if((x*17+y*31+x*y*7)%47===0)return "tree";
  if(y===21&&x>=10&&x<=36)return "road";
  return "grass";
 }
 if(x===8&&y===12&&floor===0)return "door";
 if(x===0||y===0||x===w-1||y===h-1)return "wall";
 if(x===3&&y===3&&floor<2)return "stairs-up-a";
 if(x===13&&y===3&&floor<2)return "stairs-up-b";
 if(x===3&&y===9&&floor>0)return "stairs-down-a";
 if(x===13&&y===9&&floor>0)return "stairs-down-b";
 if(y===6&&x>=5&&x<=11&&x!==8)return "wall";
 return floor===0?"stone":floor===1?"wood":"marble";
}
export function blocked(map,floor,x,y){
 const t=tileAt(map,floor,x,y);return ["void","wall","tree","water"].includes(t);
}
export function transitionAt(map,floor,x,y){
 const tile=tileAt(map,floor,x,y);
 if(map==="overworld"&&tile==="door")return {map:"keep",floor:0,x:8,y:11};
 if(map==="keep"&&floor===0&&tile==="door")return {map:"overworld",floor:0,x:24,y:21};
 if(tile.startsWith("stairs-up-")){const lane=tile.endsWith("a")?3:13;return {map:"keep",floor:floor+1,x:lane,y:9};}
 if(tile.startsWith("stairs-down-")){const lane=tile.endsWith("a")?3:13;return {map:"keep",floor:floor-1,x:lane,y:3};}
 return null;
}
export function mapName(map,floor){return map==="overworld"?"Pogranicze — mapa testowa":`Warownia — piętro ${floor}`;}
export const COLORS={void:"#050a0e",wall:"#36404a",tree:"#285b34",water:"#225d8c",road:"#8a7a60",grass:"#416f45",stone:"#777a78",wood:"#927b56",marble:"#8d9ba3",door:"#e4b64c","stairs-up-a":"#ad87dd","stairs-up-b":"#ad87dd","stairs-down-a":"#8863c0","stairs-down-b":"#8863c0"};
