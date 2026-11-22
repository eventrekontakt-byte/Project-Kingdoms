// BIS 1.0 — one exterior footprint tile represents 3 interior tiles per axis.
// Shape masks are canonical and independent of rendering, furnishings and plot ownership.
export const BIS_SCALE=3;
export function exteriorFootprint(building){
 const [x1,y1,x2,y2]=building.bounds;
 return {x:x1,y:y1,width:x2-x1+1,height:y2-y1+1};
}
export function normalizeFootprint(building){
 const box=exteriorFootprint(building);
 const cells=building.footprint?.length?building.footprint:
  Array.from({length:box.height},(_,y)=>Array.from({length:box.width},(_,x)=>[x,y])).flat();
 const occupied=new Set();
 for(const [x,y] of cells){
  if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x>=box.width||y>=box.height)throw Error("BIS footprint out of bounds: "+building.id);
  occupied.add(x+","+y);
 }
 if(!occupied.size)throw Error("BIS empty footprint: "+building.id);
 return {box,occupied};
}
export function buildingInteriorSize(building){
 const {box}=normalizeFootprint(building);
 return {width:box.width*BIS_SCALE,height:box.height*BIS_SCALE};
}
export function interiorMask(building){
 const {box,occupied}=normalizeFootprint(building);
 const {width,height}=buildingInteriorSize(building);
 const inside=(x,y)=>x>=0&&y>=0&&x<width&&y<height&&occupied.has(Math.floor(x/BIS_SCALE)+","+Math.floor(y/BIS_SCALE));
 const edge=(x,y)=>inside(x,y)&&(!inside(x-1,y)||!inside(x+1,y)||!inside(x,y-1)||!inside(x,y+1));
 return {width,height,inside,edge};
}
export function interiorDoor(building){
 const mask=interiorMask(building),{width:w,height:h}=mask;
 const [dx,dy]=[building.door.x-building.bounds[0],building.door.y-building.bounds[1]];
 const center={x:dx*BIS_SCALE+1,y:dy*BIS_SCALE+1};
 const vectors={N:[0,1],S:[0,-1],W:[1,0],E:[-1,0]};
 const [vx,vy]=vectors[building.facing];
 const candidates=[];
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(mask.edge(x,y)){
  const ox=x-vx,oy=y-vy;
  if(mask.inside(ox,oy))continue;
  const nx=x+vx,ny=y+vy;
  if(!mask.inside(nx,ny))continue;
  candidates.push({x,y,inside:{x:nx,y:ny},distance:Math.abs(x-center.x)+Math.abs(y-center.y)});
 }
 candidates.sort((a,b)=>a.distance-b.distance);
 if(!candidates.length)throw Error("BIS entrance missing: "+building.id);
 const c=candidates[0];
 return {door:{x:c.x,y:c.y},inside:c.inside,facing:building.facing};
}
// Authoring helper: L/T footprints are arrays of relative exterior cells.
export function shapeFootprint(kind,width,height){
 const cells=[];
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const keep=kind==="L"?(x<Math.ceil(width/3)||y>=Math.floor(height*2/3)):
   kind==="T"?(y<Math.ceil(height/3)||x>=Math.floor(width/3)&&x<Math.ceil(width*2/3)):true;
  if(keep)cells.push([x,y]);
 }
 return cells;
}
