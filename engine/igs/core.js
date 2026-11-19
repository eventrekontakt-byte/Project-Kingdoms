// IGS 1.0: deterministic, editable furniture layout core. No DOM dependencies.
export const BUILDING_SCHEMA=1;
export function seedFromId(id){let h=2166136261;for(const c of String(id)){h=Math.imul(h^c.charCodeAt(0),16777619);}return h>>>0;}
export function randomFromSeed(seed){let s=seed>>>0;return ()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
export const FURNITURE_RULES={
 bed:{wall:true,front:true,sizes:[[2,3],[1,2],[2,2]]},
 wardrobe:{wall:true,front:true,sizes:[[1,3],[1,2]]},
 dresser:{wall:true,front:true,sizes:[[2,1],[1,1]]},
 shelf:{wall:true,front:true,sizes:[[1,3],[2,1]]},
 chest:{wall:true,front:true,sizes:[[1,1],[2,1]]},
 plant:{wall:true,cornerPreferred:true,sizes:[[1,1]]},
 table:{wall:false,front:true,sizes:[[2,2],[3,2],[2,3],[2,4],[3,3]]},
 chair:{near:"table",sizes:[[1,1]]},
 bench:{near:"table",sizes:[[2,1]]},
 fireplace:{wall:true,front:true,sizes:[[2,1]]},
 stove:{wall:true,front:true,sizes:[[3,2]]},
 counter:{wall:true,front:true,sizes:[[4,1]]},
 barrel:{wall:true,sizes:[[1,1]]},
 book:{wall:false,sizes:[[1,1]]}
};
const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
const key=(f,x,y)=>f+":"+x+":"+y;
export function createBuildingModel({id,width,height,floors,architecture,rooms=[],seed=seedFromId(id),furniture=[],decor=[]}){
 return {schema:BUILDING_SCHEMA,id,width,height,floors,seed,architecture,rooms,furniture,decor,edits:{tiles:[],objects:[],removed:[]}};
}
export function occupiedTiles(o){let a=[];for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++)a.push([o.floor,x,y]);return a;}
export function isWallAdjacent(o,tile){return occupiedTiles(o).some(([f,x,y])=>dirs.some(([dx,dy])=>tile(f,x+dx,y+dy)==="wall"));}
export function hasAccessibleSide(o,tile,occupied){
 return occupiedTiles(o).some(([f,x,y])=>dirs.some(([dx,dy])=>{const xx=x+dx,yy=y+dy;return tile(f,xx,yy)!=="wall"&&tile(f,xx,yy)!=="void"&&!occupied.has(key(f,xx,yy))&&!occupiedTiles(o).some(([_,ox,oy])=>ox===xx&&oy===yy);}));
}
export function validateLayout(model,tile,required=[]){
 const occupied=new Set(),issues=[];
 for(const o of model.furniture){
  for(const [f,x,y] of occupiedTiles(o)){
   const k=key(f,x,y);
   if(x<1||y<1||x>=model.width-1||y>=model.height-1||tile(f,x,y)==="wall"||tile(f,x,y)==="void"||occupied.has(k))issues.push("collision:"+o.id+":"+k);
   occupied.add(k);
  }
 }
 for(const o of model.furniture){
  const rule=FURNITURE_RULES[o.style]||{};
  if(rule.wall&&!isWallAdjacent(o,tile))issues.push("wall:"+o.id);
  if(rule.front&&!hasAccessibleSide(o,tile,occupied))issues.push("access:"+o.id);
 }
 // All required door/stair landings must remain connected by 4-way walkable paths.
 const starts=required.filter(([f,x,y])=>!occupied.has(key(f,x,y))&&tile(f,x,y)!=="wall");
 if(starts.length){
  const [first]=starts,queue=[first],seen=new Set([key(...first)]);
  for(let i=0;i<queue.length;i++){
   const [f,x,y]=queue[i];
   for(const [dx,dy] of dirs){const nx=x+dx,ny=y+dy,k=key(f,nx,ny);if(nx<0||ny<0||nx>=model.width||ny>=model.height||seen.has(k)||occupied.has(k)||["wall","void"].includes(tile(f,nx,ny)))continue;seen.add(k);queue.push([f,nx,ny]);}
  }
  for(const p of starts)if(!seen.has(key(...p)))issues.push("route:"+key(...p));
 }
 return {ok:issues.length===0,issues};
}
export function validateRoutes(model,tile,required=[]){
 const occupied=new Set(model.furniture.flatMap(occupiedTiles).map(p=>key(...p)));
 const starts=required.filter(p=>!occupied.has(key(...p)));
 if(!starts.length)return true;
 const queue=[starts[0]],seen=new Set([key(...starts[0])]);
 for(let i=0;i<queue.length;i++){const [f,x,y]=queue[i];for(const [dx,dy] of dirs){const nx=x+dx,ny=y+dy,k=key(f,nx,ny);if(nx<0||ny<0||nx>=model.width||ny>=model.height||seen.has(k)||occupied.has(k)||["wall","void"].includes(tile(f,nx,ny)))continue;seen.add(k);queue.push([f,nx,ny]);}}
 return starts.every(p=>seen.has(key(...p)));
}
export function generateSeating(table,model,tile,{min=2,max=6}={}){
 const rng=randomFromSeed(seedFromId(model.id+":"+table.id)),slots=[];
 for(let x=table.x;x<table.x+table.w;x++){slots.push([x,table.y-1],[x,table.y+table.h]);}
 for(let y=table.y;y<table.y+table.h;y++){slots.push([table.x-1,y],[table.x+table.w,y]);}
 for(let i=slots.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[slots[i],slots[j]]=[slots[j],slots[i]];}
 const target=Math.min(max,Math.max(min,Math.floor(rng()*(max-min+1))+min)),result=[];
 for(const [x,y] of slots){
  if(result.length>=target)break;
  const o={id:table.id+"-seat-"+result.length,style:"chair",name:"Krzesło",kind:"sit",floor:table.floor,x,y,w:1,h:1,owner:"publiczny"};
  const trial={...model,furniture:[...model.furniture,...result,o]};
  if(!model.furniture.concat(result).some(other=>occupiedTiles(other).some(([f,ox,oy])=>f===o.floor&&ox===x&&oy===y)) && tile(o.floor,x,y)!=="wall" && tile(o.floor,x,y)!=="void" && !((model.required||[]).some(([f,rx,ry])=>f===o.floor&&rx===x&&ry===y)) && validateRoutes(trial,tile,model.required||[]))result.push(o);
 }
 return result;
}
export function choosePlacement(model,item,tile,{zone=null,required=[]}={}){
 const rng=randomFromSeed(seedFromId(model.id+":"+item.id)),candidates=[];
 const rule=FURNITURE_RULES[item.style]||{};
 for(let y=1;y<model.height-item.h;y++)for(let x=1;x<model.width-item.w;x++){
  if(zone&&(x<zone.x||y<zone.y||x+item.w>zone.x+zone.w||y+item.h>zone.y+zone.h))continue;
  const candidate={...item,x,y},trial={...model,furniture:[...model.furniture,candidate]};
  if(!validateLayout(trial,tile,required).ok)continue;
  let score=rng()*10;
  if(rule.wall)score+=30;
  if(rule.cornerPreferred){const n=dirs.filter(([dx,dy])=>tile(item.floor,x+dx,y+dy)==="wall").length;score+=n*12;}
  candidates.push({candidate,score});
 }
 candidates.sort((a,b)=>b.score-a.score);
 return candidates[0]?.candidate||null;
}
export function applyBuildingEdits(model,edits){
 const clone={...model,furniture:model.furniture.map(o=>({...o})),decor:model.decor.map(o=>({...o})),edits:{tiles:[...(edits?.tiles||[])],objects:[...(edits?.objects||[])],removed:[...(edits?.removed||[])]}};
 const removed=new Set(clone.edits.removed);clone.furniture=clone.furniture.filter(o=>!removed.has(o.id));
 for(const change of clone.edits.objects){const i=clone.furniture.findIndex(o=>o.id===change.id);if(i>=0)clone.furniture[i]={...clone.furniture[i],...change};else clone.furniture.push({...change});}
 return clone;
}
