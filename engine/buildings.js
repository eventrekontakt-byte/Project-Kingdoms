// Deterministic building layout rules shared by exterior and interior.
export const BUILDINGS=[
 {id:"keep",bounds:[20,12,28,20],road:{x:24,y:21},floors:3,entry:{x:24,y:20},inside:{x:8,y:12}},
 {id:"house",bounds:[35,10,41,14],road:{x:34,y:12},floors:1,inside:{x:0,y:4}},
 {id:"inn",bounds:[39,21,47,25],road:{x:38,y:23},floors:2,inside:{x:0,y:5}},
 {id:"warehouse",bounds:[11,29,18,33],road:{x:10,y:31},floors:1,inside:{x:0,y:4}}
];
export function entranceFacingRoad(bounds,road){
 const [x1,y1,x2,y2]=bounds;
 const candidates=[
 {side:"west",x:x1,y:Math.max(y1,Math.min(y2,road.y)),distance:Math.abs(road.x-x1)+Math.max(0,y1-road.y,road.y-y2)},
 {side:"east",x:x2,y:Math.max(y1,Math.min(y2,road.y)),distance:Math.abs(road.x-x2)+Math.max(0,y1-road.y,road.y-y2)},
 {side:"north",x:Math.max(x1,Math.min(x2,road.x)),y:y1,distance:Math.abs(road.y-y1)+Math.max(0,x1-road.x,road.x-x2)},
 {side:"south",x:Math.max(x1,Math.min(x2,road.x)),y:y2,distance:Math.abs(road.y-y2)+Math.max(0,x1-road.x,road.x-x2)}
 ];
 return candidates.sort((a,b)=>a.distance-b.distance)[0];
}
export const BUILDING_ENTRIES=Object.fromEntries(BUILDINGS.map(b=>[b.id,entranceFacingRoad(b.bounds,b.road)]));
export function roomWall(map,floor,x,y,w,h){
 if(map==="keep")return y===6&&x>=5&&x<=11&&x!==8;
 if(map==="house")return x===Math.floor(w/2)&&y>=2&&y<=h-3&&y!==Math.floor(h/2);
 if(map==="inn")return (y===Math.floor(h/2)&&x>=3&&x<=w-3&&x!==7)||(floor===1&&x===Math.floor(w/2)&&y>=2&&y<=h-3&&y!==3);
 if(map==="warehouse")return (x===4||x===9)&&y>=2&&y<=h-3&&y!==Math.floor(h/2);
 return false;
}
