import {portalEndpointCells} from "./core.js?v=0.3.29";
// FPS 1.0: validate explicit furniture placement and derive player approach cells.
const dirs=[[0,-1],[1,0],[0,1],[-1,0]],key=(x,y)=>x+","+y,list=x=>Array.isArray(x)?x:[];
function cells(g){if(g?.type!=="rect"||![g.x,g.y,g.w,g.h].every(Number.isInteger)||g.w<1||g.h<1)return [];return Array.from({length:g.w*g.h},(_,i)=>({x:g.x+i%g.w,y:g.y+Math.floor(i/g.w)}));}
export function placementIssues(f,portals=[]){
 const objects=list(f.objects),walls=new Set(list(f.walls).flatMap(w=>cells(w.geometry)).map(p=>key(p.x,p.y))),out=[],used=new Map(),blocked=new Set(objects.flatMap(o=>o.blocking!==false?cells(o.geometry):[]).map(p=>key(p.x,p.y))),thresholds=new Set(list(portals).flatMap(p=>[p.a,p.b].flatMap(portalEndpointCells)).filter(e=>e?.sceneId===f.id&&e.trigger).map(e=>key(e.trigger.x,e.trigger.y)));
 const emit=(o,message,point)=>out.push({objectId:o.id,message,point,sceneId:f.id});
 for(const o of objects){if(!o.placement)continue;const g=o.geometry,cs=cells(g),r=o.rotation||0,rule=o.placement;if(!cs.length||![0,90,180,270].includes(r)){emit(o,"Invalid FPS geometry or orientation",null);continue;}
 if(rule.mode==="wall"||rule.mode==="head"){const dir=(rule.back+r/90)%4;if(!dirs[dir]){emit(o,"Invalid rear direction",null);continue;}const [dx,dy]=dirs[dir],side=cs.filter(p=>dir===0?p.y===g.y:dir===1?p.x===g.x+g.w-1:dir===2?p.y===g.y+g.h-1:p.x===g.x);if(!side.every(p=>walls.has(key(p.x+dx,p.y+dy))&&!thresholds.has(key(p.x+dx,p.y+dy))))emit(o,"Furniture back/head must directly touch a wall",side[0]);}
 if(rule.mode==="table"){const target=objects.find(a=>a.id===o.relatedObjectId&&(/^table_/.test(a.type)||a.type==="desk")),dir=dirs[(rule.front+r/90)%4];if(!dir||!target||!cs.some(p=>cells(target.geometry).some(q=>q.x===p.x+dir[0]&&q.y===p.y+dir[1])))emit(o,"Chair must face linked table/desk",cs[0]);}
 for(const st of list(o.stations)){const p=st.approach;if(!p){emit(o,"Missing FPS station approach",null);continue;}const k=key(p.x,p.y);if(blocked.has(k)||walls.has(k)||thresholds.has(k)||p.x<0||p.y<0||p.x>=f.width||p.y>=f.height)emit(o,"Blocked FPS station",p);if(used.has(k))emit(o,"Shared exclusive station approach with "+used.get(k),p);else used.set(k,o.id);}
 }return out;
}
// Geometry only: caller must separately check permissions, capacity and action reachability.
export function playerStartCells(f,o,portals=[]){
 const cs=cells(o.geometry),blocked=new Set([...list(f.walls),...list(f.objects).filter(a=>a.blocking!==false)].flatMap(a=>cells(a.geometry)).map(p=>key(p.x,p.y))),mask=new Set(cells(f.geometry).map(p=>key(p.x,p.y))),own=new Set(cs.map(p=>key(p.x,p.y))),out=new Map();
 for(const p of list(portals))for(const e of [p.a,p.b].flatMap(portalEndpointCells))if(e?.sceneId===f.id&&e.trigger)blocked.add(key(e.trigger.x,e.trigger.y));
 for(const p of cs)for(const [dx,dy] of dirs){const q={x:p.x+dx,y:p.y+dy},k=key(q.x,q.y);if(mask.has(k)&&!blocked.has(k)&&!own.has(k))out.set(k,q);}return [...out.values()];
}
