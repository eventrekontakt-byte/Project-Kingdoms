// TBI 1.0 — immutable authored templates and per-building variants.
// Rendering, interactions and collision must read the SAME resolved object list.
export const TBI_SCHEMA=1;
export function stableHash(value){let h=2166136261;for(const c of String(value)){h=Math.imul(h^c.charCodeAt(0),16777619);}return h>>>0;}
export function defineTemplate({id,size,walls,portals,rooms,furniture,decor,slots=[]}){
 const copy=x=>JSON.parse(JSON.stringify(x));
 const model={schema:TBI_SCHEMA,id,size:copy(size),walls:[...walls],portals:copy(portals),rooms:copy(rooms),furniture:copy(furniture),decor:copy(decor),slots:copy(slots)};
 return model;
}
export function resolveInstance(template,{id,owner=null,edits={},variantSeed=stableHash(id)}={}){
 const clone=x=>JSON.parse(JSON.stringify(x));
 const removed=new Set(edits.removedObjects||[]);
 const objects=template.furniture.filter(o=>!removed.has(o.id)).map(clone);
 for(const change of edits.movedObjects||[]){const o=objects.find(o=>o.id===change.id);if(o)Object.assign(o,{x:change.x,y:change.y,floor:change.floor??o.floor});}
 for(const change of edits.addedObjects||[])objects.push(clone(change));
 const decorations=template.decor.map(clone);
 for(const slot of template.slots){
  const choices=slot.choices||[];
  if(!choices.length)continue;
  const choice=choices[stableHash(id+":"+slot.id+":"+variantSeed)%choices.length];
  if(choice)decorations.push({...clone(choice),id:id+":"+slot.id,x:slot.x,y:slot.y,floor:slot.floor,w:choice.w||1,h:choice.h||1});
 }
 return {templateId:template.id,id,owner,objects,decorations,walls:[...template.walls,...(edits.addedWalls||[])].filter(w=>!(edits.removedWalls||[]).includes(w)),portals:clone(template.portals)};
}
export function buildOccupancy(instance){
 const occupied=new Map(),errors=[],walls=new Set(instance.walls);
 for(const o of instance.objects){
  for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){
   const k=o.floor+":"+x+":"+y;
   if(walls.has(k)||occupied.has(k))errors.push("Collision "+o.id+" at "+k);
   occupied.set(k,o);
  }
 }
 return {occupied,walls,errors};
}
export function validateTemplate(instance,{width,height,floors}){
 const {occupied,walls,errors}=buildOccupancy(instance);
 for(const o of instance.objects)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){
  if(x<1||y<1||x>=width-1||y>=height-1||o.floor<0||o.floor>=floors)errors.push("Out of bounds "+o.id);
 }
 for(const p of instance.portals){
  const [f,x,y]=p.from,k=f+":"+x+":"+y;
  if(occupied.has(k))errors.push("Portal obstructed "+k);
 }
 return {ok:errors.length===0,errors};
}
