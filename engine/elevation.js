// VIS 1.4 — elevation model for locations and future bridges, balconies and roofs.
// Elevation is independent of map floors; it is derived from the current tile.
// This keeps older saves and movement/portal geometry compatible.
import {cityTile,CITY_BUILDINGS} from "./city-one.js";
export const ELEVATION_SCHEMA=1;
export const ELEVATION_UNIT_METERS=1.5;
export const CITY_RAMPART_LEVEL=2;
export const CITY_STAIRS_LEVEL=1;
export function elevationAt(map,x,y,floor=0){
 if(map==="site-city1"){
  const tile=cityTile(x,y);
  return tile==="rampart"?CITY_RAMPART_LEVEL:tile==="stairs-up"?CITY_STAIRS_LEVEL:0;
 }
 // Interior floor number is not terrain height; store separately for later bridges.
 return Math.max(0,Number.isFinite(floor)?Math.trunc(floor):0)*2;
}
export function elevationTransition(map,from,to,floor=0){
 const fromZ=elevationAt(map,from.x,from.y,floor),toZ=elevationAt(map,to.x,to.y,floor);
 return {fromZ,toZ,delta:toZ-fromZ,climbing:toZ>fromZ,descending:toZ<fromZ};
}
export function buildingRoofLevel(building){
 if(!building)return 0;
 const id=building.id;
 const floors=/twierdza|koszary|biblioteka|kasyno|straznica|kamienica/.test(id)?3:
 /karczma|zbrojownia|apteka|magazyn|dom|spichlerz|warsztat/.test(id)?2:1;
 return floors*2;
}
export function elevationMetadata(){
 return {schema:ELEVATION_SCHEMA,unitMeters:ELEVATION_UNIT_METERS,rampart:CITY_RAMPART_LEVEL,
  buildings:CITY_BUILDINGS.map(b=>({id:b.id,roofZ:buildingRoofLevel(b)}))};
}

// VIS 1.5: a bridge has two independent walkable surfaces at the same x/y.
// The demonstrator crosses the east-west road in City 1 at x=40.
export const CITY_BRIDGE={id:"city1-bridge-01",x:40,y1:53,y2:58,z:2,
 stairs:[{x:40,y:52},{x:40,y:59}]};
export function isBridgeDeck(map,x,y){return map==="site-city1"&&x===CITY_BRIDGE.x&&y>=CITY_BRIDGE.y1&&y<=CITY_BRIDGE.y2;}
export function isBridgeStair(map,x,y){return map==="site-city1"&&CITY_BRIDGE.stairs.some(p=>p.x===x&&p.y===y);}
export function surfaceLevels(map,x,y,floor=0){
 if(isBridgeDeck(map,x,y))return [0,CITY_BRIDGE.z];
 if(isBridgeStair(map,x,y))return [0,1];
 return [elevationAt(map,x,y,floor)];
}
export function resolveSurfaceStep(map,from,to,floor=0){
 const fromZ=Number.isInteger(from.z)?from.z:elevationAt(map,from.x,from.y,floor);
 const levels=surfaceLevels(map,to.x,to.y,floor);
 if(map!=="site-city1")return {allowed:true,z:levels[0]};
 const onDeck=isBridgeDeck(map,from.x,from.y),nextDeck=isBridgeDeck(map,to.x,to.y);
 const onStair=isBridgeStair(map,from.x,from.y),nextStair=isBridgeStair(map,to.x,to.y);
 // Only the dedicated stair tiles connect street level to bridge level.
 if(nextStair&&onDeck&&fromZ===2)return {allowed:true,z:1};
 if(onStair&&nextDeck&&fromZ===1)return {allowed:true,z:2};
 if(onStair&&fromZ===1&&!nextDeck)return {allowed:true,z:0};
 if(nextStair&&fromZ===0)return {allowed:true,z:0};
 if(onDeck&&nextDeck&&fromZ===2)return {allowed:true,z:2};
 if(nextDeck&&fromZ===0)return {allowed:true,z:0}; // under the bridge
 if(onDeck&&fromZ===2&&!nextStair)return {allowed:false,z:fromZ};
 if(onDeck&&fromZ===0)return {allowed:true,z:0};
 if(fromZ!==0&&fromZ!==elevationAt(map,from.x,from.y,floor))return {allowed:false,z:fromZ};
 return {allowed:true,z:levels[0]};
}
