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

// City gates use the existing rampart height (Z=2); passage remains ground Z=0.
// This module deliberately contains no temporary bridge or watchtower surfaces.
export function resolveSurfaceStep(map,from,to,floor=0){
 const fromZ=Number.isInteger(from.z)?from.z:elevationAt(map,from.x,from.y,floor);
 const nextZ=elevationAt(map,to.x,to.y,floor);
 if(map!=="site-city1")return {allowed:true,z:nextZ};
 const delta=Math.abs(nextZ-fromZ);
 return {allowed:delta<=1||fromZ===nextZ,z:nextZ};
}
