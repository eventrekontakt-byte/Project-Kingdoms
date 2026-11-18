// Strategic map (world scale), distinct from the 64x44 tactical location.
export const WORLD_WIDTH=12,WORLD_HEIGHT=8;
export const REGIONS=[
 {id:"pogranicze",name:"Pogranicze",x:5,y:4,terrain:"plains",location:"overworld",entry:{x:12,y:17},description:"Warownia, karczma, dom i magazyn."},
 {id:"puszcza",name:"Puszcza Cieni",x:4,y:4,terrain:"forest",location:"puszcza",description:"Nieodkryte leśne ostępy."},
 {id:"przelecz",name:"Kamienna Przełęcz",x:6,y:3,terrain:"mountain",location:"przelecz",description:"Szlak wśród wysokich gór."},
 {id:"doliny",name:"Zielone Doliny",x:6,y:4,terrain:"plains",location:"doliny",description:"Żyzne ziemie i osady."},
 {id:"jeziora",name:"Kraina Jezior",x:5,y:5,terrain:"water",location:"jeziora",description:"Jeziora i przeprawy."}
];
export const WORLD_COLORS={plains:"#65894f",forest:"#315d45",mountain:"#747a79",water:"#356a93",unknown:"#394756"};
export function regionAt(x,y){return REGIONS.find(r=>r.x===x&&r.y===y)||null;}
export function regionById(id){return REGIONS.find(r=>r.id===id)||null;}
export function canTravel(fromId,toId){
 const a=regionById(fromId),b=regionById(toId);
 return Boolean(a&&b&&a.id!==b.id&&Math.abs(a.x-b.x)+Math.abs(a.y-b.y)===1);
}
export function worldTile(x,y){
 if(x<0||y<0||x>=WORLD_WIDTH||y>=WORLD_HEIGHT)return "unknown";
 const r=regionAt(x,y);if(r)return r.terrain;
 const v=(x*17+y*31+x*y*11)%17;
 return v<3?"water":v<7?"forest":v<10?"mountain":"plains";
}

export const REGION_MAPS=Object.fromEntries(REGIONS.map(r=>[r.location,r.id]));
export function regionForMap(map){return REGION_MAPS[map]||null;}
export function adjacentRegion(id,direction){
 const current=regionById(id);if(!current)return null;
 const offsets={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
 const [dx,dy]=offsets[direction]||[0,0];
 return REGIONS.find(r=>r.x===current.x+dx&&r.y===current.y+dy)||null;
}
export function travelEntry(mapWidth,mapHeight,direction,coordinate){
 const x=Math.max(1,Math.min(mapWidth-2,coordinate?.x??Math.floor(mapWidth/2)));
 const y=Math.max(1,Math.min(mapHeight-2,coordinate?.y??Math.floor(mapHeight/2)));
 return direction==="up"?{x,y:mapHeight-2}:direction==="down"?{x,y:1}:direction==="left"?{x:mapWidth-2,y}:direction==="right"?{x:1,y}:{x,y};
}
