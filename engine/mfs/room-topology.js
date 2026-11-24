// RTS 1.0: structural walls and authored open edges, not furniture, define room components.
import {rasterize} from "./core.js?v=0.3.29";
export const ACCESS_COLORS={Z0:"#8fcf82",Z1:"#e1cb67",Z2:"#e8a85f",Z3:"#77a8e1",Z4:"#b99be1",Z5:"#e47e88"};
const list=x=>Array.isArray(x)?x:[],edge=(a,b)=>a<b?a+":"+b:b+":"+a;
export function roomTopology(f,portals=[]){
 const w=f.width,h=f.height,issues=[],rooms=[],byCell=new Map(),byObject=new Map(),links=[],cuts=new Map();
 const issue=(message,objectId=f.id,point=null)=>issues.push({message,objectId,point,sceneId:f.id});
 const idx=p=>p&&Number.isInteger(p.x)&&Number.isInteger(p.y)&&p.x>=0&&p.x<w&&p.y>=0&&p.y<h?p.y*w+p.x:null;
 const pt=k=>({x:k%w,y:Math.floor(k/w)}),neighbors=k=>{const {x,y}=pt(k);return [[x-1,y],[x+1,y],[x,y-1],[x,y+1]].map(([x,y])=>idx({x,y})).filter(k=>k!==null);};
 let mask,walls=new Set();try{mask=rasterize(f.geometry,w,h);for(const a of list(f.walls))for(const k of rasterize(a.geometry,w,h))walls.add(k);}catch(e){issue(e.message);return {rooms,byCell,byObject,links,issues};}
 const floor=new Set([...mask].filter(k=>!walls.has(k))),cutIds=new Set();
 for(const c of list(f.roomCuts)){const a=idx(c.a),b=idx(c.b);if(typeof c.id!=="string"||cutIds.has(c.id)||c.kind!=="open"||!floor.has(a)||!floor.has(b)||!neighbors(a).includes(b)||cuts.has(edge(a,b))){issue("Invalid or duplicate room boundary",c.id,c.a);continue;}cutIds.add(c.id);cuts.set(edge(a,b),{...c,ak:a,bk:b});}
 const components=[],componentOf=new Map();
 for(const start of floor){if(componentOf.has(start))continue;const id=components.length,q=[start],cells=new Set([start]);componentOf.set(start,id);for(let i=0;i<q.length;i++)for(const k of neighbors(q[i]))if(floor.has(k)&&!componentOf.has(k)&&!cuts.has(edge(q[i],k))){componentOf.set(k,id);cells.add(k);q.push(k);}components.push({cells,anchors:[]});}
 for(const r of list(f.rooms)){const c=componentOf.get(idx(r.anchor));if(c===undefined){issue("Room anchor outside room floor",r.id,r.anchor);continue;}components[c].anchors.push(r);}
 const byComponent=new Map();for(const [i,c] of components.entries()){if(c.anchors.length!==1){issue(c.anchors.length?"Multiple anchors in connected zone; declare boundary":"Unassigned floor area",c.anchors[0]?.id||f.id,pt(c.cells.values().next().value));continue;}
 const r=c.anchors[0],record={...r,cells:c.cells,objectIds:[],stationIds:[],availableFunctions:[],neighborIds:[],portalIds:[],area:c.cells.size,kind:"enclosed"};rooms.push(record);byComponent.set(i,record);for(const k of c.cells)byCell.set(k,record.id);}
 const byId=new Map(rooms.map(r=>[r.id,r]));
 for(const c of cuts.values()){const a=componentOf.get(c.ak),b=componentOf.get(c.bk);if(a===b){issue("Boundary does not separate zones",c.id,c.a);continue;}const ra=byComponent.get(a),rb=byComponent.get(b);if(!ra||!rb)continue;ra.kind=rb.kind="open_zone";if(!ra.neighborIds.includes(rb.id))ra.neighborIds.push(rb.id);if(!rb.neighborIds.includes(ra.id))rb.neighborIds.push(ra.id);links.push({id:c.id,kind:"open",a:c.a,b:c.b,roomA:ra.id,roomB:rb.id});}
 for(const o of list(f.objects)){let cs;try{cs=rasterize(o.geometry,w,h);}catch(e){issue(e.message,o.id);continue;}const ids=new Set([...cs].map(k=>byCell.get(k)));if(ids.size!==1||ids.has(undefined)){issue("Furniture spans room boundaries or is outside assigned room",o.id,pt(cs.values().next().value));continue;}const id=ids.values().next().value,r=byId.get(id);byObject.set(o.id,id);r.objectIds.push(o.id);
 for(const s of list(o.stations)){const sid=byCell.get(idx(s.approach));if(!sid){issue("Station outside assigned room floor",s.id,s.approach);continue;}const sr=byId.get(sid);sr.stationIds.push(s.id);if(!sr.availableFunctions.includes(s.action))sr.availableFunctions.push(s.action);}}
 for(const p of list(portals))for(const e of [p.a,p.b])if(e?.sceneId===f.id){const id=byCell.get(idx(e.arrival));if(id){const r=byId.get(id);if(!r.portalIds.includes(p.id))r.portalIds.push(p.id);}}
 return {rooms,byCell,byObject,links,issues};
}
export function roomAt(t,x,y,w){return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&x<w&&y>=0?t.byCell.get(y*w+x)||null:null;}
