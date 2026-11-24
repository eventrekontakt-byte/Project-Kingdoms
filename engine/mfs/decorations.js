import {rasterize} from "./core.js?v=0.3.29";
export function decorationIssues(f,portals=[]){
 const issues=[],mask=rasterize(f.geometry,f.width,f.height),walls=new Set(),objects=new Set(),used=new Set(),ids=new Set();
 for(const a of f.walls||[])for(const k of rasterize(a.geometry,f.width,f.height))walls.add(k);
 for(const a of f.objects||[])for(const k of rasterize(a.geometry,f.width,f.height))objects.add(k);
 const thresholds=new Set(portals.flatMap(p=>[p.a,p.b]).filter(e=>e?.sceneId===f.id).map(e=>e.trigger.y*f.width+e.trigger.x));
 for(const a of f.decorations||[]){const emit=message=>issues.push({objectId:a.id,sceneId:f.id,message,point:{x:a.geometry?.x,y:a.geometry?.y}});try{const cs=rasterize(a.geometry,f.width,f.height);if(typeof a.id!=="string"||!a.id.startsWith(f.id+".")||ids.has(a.id)||a.blocking!==false||!["floor","wall"].includes(a.mount)||![0,90,180,270].includes(a.rotation))emit("Invalid decoration metadata");ids.add(a.id);if([...cs].some(k=>!mask.has(k)||thresholds.has(k)||used.has(k)||(a.mount==="wall"?!walls.has(k):walls.has(k)||objects.has(k))))emit("Decoration conflicts with structure, object or another decoration");for(const k of cs)used.add(k);}catch(e){emit(e.message);}}
 return issues;
}
