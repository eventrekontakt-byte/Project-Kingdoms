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
 if(isElevatedPlatform(map,x,y))return [0,CITY_BRIDGE.z];
 if(isBridgeStair(map,x,y))return [0,1];
 return [elevationAt(map,x,y,floor)];
}
export function resolveSurfaceStep(map,from,to,floor=0){
 const fromZ=Number.isInteger(from.z)?from.z:elevationAt(map,from.x,from.y,floor);
 const toBase=elevationAt(map,to.x,to.y,floor);
 if(map!=="site-city1")return {allowed:true,z:toBase};
 const onStair=isBridgeStair(map,from.x,from.y),nextStair=isBridgeStair(map,to.x,to.y);
 const onPlatform=isElevatedPlatform(map,from.x,from.y),nextPlatform=isElevatedPlatform(map,to.x,to.y);
 // Street -> stair -> upper platform, and the reverse direction.
 if(nextStair){
  if(onPlatform&&fromZ===2)return {allowed:true,z:1};
  if(fromZ===0)return {allowed:true,z:1};
  if(onStair&&fromZ===1)return {allowed:true,z:1};
  return {allowed:false,z:fromZ};
 }
 if(onStair&&fromZ===1){
  if(nextPlatform)return {allowed:true,z:2};
  if(!nextPlatform&&toBase===0)return {allowed:true,z:0};
  return {allowed:false,z:fromZ};
 }
 if(onPlatform&&fromZ===2){
  if(nextPlatform)return {allowed:true,z:2};
  return {allowed:false,z:fromZ};
 }
 if(nextPlatform&&fromZ===0)return {allowed:true,z:0}; // beneath the deck
 if(onPlatform&&fromZ===0)return {allowed:true,z:toBase};
 if(fromZ!==toBase&&fromZ!==elevationAt(map,from.x,from.y,floor))return {allowed:false,z:fromZ};
 return {allowed:true,z:toBase};
}

// VIS 1.6: watchtower roof and its balcony share the bridge's elevated deck.
// These surfaces remain independent of ground movement at identical coordinates.
export const CITY_WATCHTOWER={id:"city1-watchtower-test",roof:{x1:39,y1:49,x2:40,y2:51},balcony:{x1:38,y1:50,x2:38,y2:50},z:2,access:{x:40,y:52}};
export function isWatchtowerRoof(map,x,y){
 const b=CITY_WATCHTOWER.roof;
 return map==="site-city1"&&x>=b.x1&&x<=b.x2&&y>=b.y1&&y<=b.y2;
}
export function isWatchtowerBalcony(map,x,y){
 const b=CITY_WATCHTOWER.balcony;
 return map==="site-city1"&&x>=b.x1&&x<=b.x2&&y>=b.y1&&y<=b.y2;
}
export function isElevatedPlatform(map,x,y){
 return isBridgeDeck(map,x,y)||isWatchtowerRoof(map,x,y)||isWatchtowerBalcony(map,x,y);
}
