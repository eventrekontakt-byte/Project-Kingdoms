// Reusable interior template: tavern, with deterministic furniture and persistent instances.
export const TAVERN_MAP="interior-city1-karczma";
export const TAVERN_SIZE={width:30,height:22,floors:2};
const key=(f,x,y)=>f+":"+x+":"+y;
const walls=new Set(),items=new Map(),portals=[],furniture=[];
const wall=(f,x,y)=>walls.add(key(f,x,y));
const partition=(f,x1,y1,x2,y2,doors=[])=>{
 for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if(!doors.some(([dx,dy])=>dx===x&&dy===y))wall(f,x,y);
};
for(let f=0;f<2;f++){
 for(let x=0;x<30;x++){wall(f,x,0);wall(f,x,21);}
 for(let y=0;y<22;y++){wall(f,0,y);wall(f,29,y);}
}
// Ground floor: dining room, kitchen, pantry and utility room.
partition(0,18,1,18,20,[[18,10],[18,11],[18,17]]);
partition(0,19,8,28,8,[[24,8],[25,8]]);
partition(0,1,15,17,15,[[8,15],[9,15]]);
// Upper floor: three guest rooms, owner's quarters and an open stair landing.
partition(1,1,10,28,10,[[6,10],[15,10],[24,10]]);
partition(1,10,1,10,9,[[10,6]]);
partition(1,20,1,20,9,[[20,6]]);
partition(1,10,11,10,20,[[10,16]]);
partition(1,20,11,20,20,[[20,16]]);
walls.delete(key(0,14,21));
// Each stair landing is a single physical coordinate on both floors.
// On arrival the player stands beside the stairs, preventing immediate return.
const STAIRS={x:4,y:18};
portals.push({from:[0,14,21],to:null,exit:true});
portals.push({from:[0,STAIRS.x,STAIRS.y],to:[1,STAIRS.x+1,STAIRS.y]});
portals.push({from:[1,STAIRS.x,STAIRS.y],to:[0,STAIRS.x+1,STAIRS.y]});
export const TAVERN_STAIRS=STAIRS;
function object(f,id,name,kind,x,y,w=1,h=1,extra={}){
 const entry={id:"city1-tavern-"+id,name,kind,x,y,w,h,floor:f,description:extra.description||name,owner:extra.owner??"karczmarz",loot:extra.loot||[],...extra};
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
  const k=key(f,xx,yy);
  if(xx<1||yy<1||xx>=29||yy>=21||walls.has(k)||items.has(k)||portals.some(p=>p.from[0]===f&&p.from[1]===xx&&p.from[2]===yy))
   throw Error("Furniture collision: "+id+" at "+k);
  items.set(k,entry);
 }
 furniture.push(entry);
}
// Furniture placement respects walls, circulation and functional room layout.
object(0,"counter","Lada karczmarza","inspect",2,2,4,1,{style:"counter",description:"Solidna drewniana lada z miejscem do obsługi gości."});
object(0,"ledger","Księga gości","read",7,2,1,1,{style:"book",description:"Rejestr przyjezdnych i rachunków."});
object(0,"fireplace","Kominek","fireplace",13,1,2,1,{style:"fireplace",description:"Kamienny kominek ogrzewający salę."});
object(0,"table-1","Duży stół gościnny","inspect",3,6,3,2,{style:"table",owner:"publiczny"});
object(0,"table-2","Duży stół gościnny","inspect",11,6,3,2,{style:"table",owner:"publiczny"});
object(0,"table-3","Stół gościnny","inspect",10,11,2,3,{style:"table",owner:"publiczny"});
object(0,"chair-1","Krzesło","sit",3,5,1,1,{style:"chair",owner:"publiczny"});
object(0,"chair-2","Krzesło","sit",6,7,1,1,{style:"chair",owner:"publiczny"});
object(0,"chair-3","Krzesło","sit",14,7,1,1,{style:"chair",owner:"publiczny"});
object(0,"chair-4","Krzesło","sit",9,12,1,1,{style:"chair",owner:"publiczny"});
object(0,"stove","Piec kuchenny","inspect",21,1,3,2,{style:"stove",description:"Piec do wypiekania chleba i gotowania."});
object(0,"kitchen-table","Stół roboczy","inspect",24,4,3,2,{style:"table"});
object(0,"pantry","Skrzynia z zapasami","container",26,9,2,1,{style:"chest",loot:["Chleb","Suszone mięso","Jabłko"]});
object(0,"barrel","Beczka piwa","inspect",20,4,1,1,{style:"barrel"});
object(0,"supplies","Skrzynia na zapleczu","container",26,19,2,1,{style:"chest",loot:["Monety: 8","Sznur","Świeca"]});
object(0,"shelf","Regał kuchenny","inspect",20,9,1,3,{style:"shelf"});
// Extra furnishings make rooms lived-in without closing their entrances.
object(0,"extra-bench","Drewniana ława","sit",2,11,2,1,{style:"bench",owner:"publiczny"});
object(0,"extra-bench2","Drewniana ława","sit",14,12,2,1,{style:"bench",owner:"publiczny"});
object(0,"cask-2","Beczka z winem","inspect",27,3,1,1,{style:"barrel"});
object(0,"cupboard","Kredens kuchenny","container",27,1,1,2,{style:"wardrobe",loot:["Miska","Kubek"]});
object(0,"herbs","Donica z ziołami","inspect",16,2,1,1,{style:"plant",owner:"publiczny"});
object(0,"plant-hall","Roślina doniczkowa","inspect",16,13,1,1,{style:"plant",owner:"publiczny"});
object(0,"plant-store","Roślina doniczkowa","inspect",27,13,1,1,{style:"plant",owner:"publiczny"});
object(0,"barrel-store","Beczka zapasowa","inspect",20,19,1,1,{style:"barrel"});
// Guest beds are anchored against walls; wardrobes and chests sit at the perimeter.
object(1,"bed1","Łóżko gościnne","rest",2,2,2,3,{style:"bed",owner:"publiczny"});
object(1,"bed2","Łóżko gościnne","rest",12,2,2,3,{style:"bed",owner:"publiczny"});
object(1,"bed3","Łóżko gościnne","rest",22,2,2,3,{style:"bed",owner:"publiczny"});
object(1,"bed4","Łóżko karczmarza","rest",23,17,2,3,{style:"bed"});
object(1,"guest-chest","Kufer podróżnego","container",7,2,2,1,{style:"chest",owner:"gość",loot:["Monety: 4","List"]});
object(1,"wardrobe","Szafa karczmarza","container",27,16,1,3,{style:"wardrobe",loot:["Klucz","Płaszcz"]});
object(1,"letter","List karczmarza","read",22,13,1,1,{style:"book",description:"List dotyczący dostawy zboża."});
object(1,"dresser","Komoda","container",2,18,2,1,{style:"dresser",loot:["Świeca"]});

// Walkable interior decorations: rugs, stair footprints and ambient light fixtures.
// Stairs have a 3×3 visual footprint, while the portal remains one exact tile.
export const TAVERN_DECOR=[
 {floor:0,style:"rug",x:7,y:9,w:3,h:2,tone:"red"},
 {floor:0,style:"rug",x:2,y:17,w:3,h:3,tone:"red"},
 {floor:0,style:"rug",x:12,y:16,w:3,h:2,tone:"blue"},
 {floor:0,style:"rug",x:22,y:13,w:3,h:2,tone:"red"},
 {floor:1,style:"rug",x:5,y:6,w:3,h:2,tone:"blue"},
 {floor:1,style:"rug",x:14,y:6,w:3,h:2,tone:"red"},
 {floor:1,style:"rug",x:24,y:6,w:3,h:2,tone:"blue"},
 {floor:1,style:"rug",x:5,y:14,w:3,h:2,tone:"red"},
 {floor:1,style:"rug",x:14,y:14,w:3,h:2,tone:"blue"},
 {floor:1,style:"rug",x:23,y:13,w:3,h:2,tone:"red"},
 ...[0,1].map(f=>({floor:f,style:"staircase",x:3,y:17,w:3,h:3})),
 ...[[0,8,2],[0,15,9],[0,23,4],[0,27,16],[1,8,5],[1,18,5],[1,27,12],[1,8,18]].map(([floor,x,y])=>({floor,style:"sconce",x,y,w:1,h:1}))
];
export function tavernDecor(f){return TAVERN_DECOR.filter(o=>o.floor===f);}
object(1,"dresser-guest1","Komoda gościnna","container",5,2,2,1,{style:"dresser",owner:"publiczny",loot:["Świeca"]});
object(1,"dresser-guest2","Komoda gościnna","container",15,2,2,1,{style:"dresser",owner:"publiczny",loot:["Kartka"]});
object(1,"dresser-guest3","Komoda gościnna","container",25,2,2,1,{style:"dresser",owner:"publiczny"});
object(1,"plant-guest","Roślina w donicy","inspect",8,8,1,1,{style:"plant",owner:"publiczny"});
object(1,"plant-landing","Roślina w donicy","inspect",18,18,1,1,{style:"plant",owner:"publiczny"});
object(1,"bench-landing","Ława na korytarzu","sit",12,18,2,1,{style:"bench",owner:"publiczny"});
export function tavernFurniture(f){return furniture.filter(item=>item.floor===f);}
export function tavernTile(f,x,y){
 if(f<0||f>1||x<0||y<0||x>=30||y>=22)return "void";
 if(portals.some(p=>p.from[0]===f&&p.from[1]===x&&p.from[2]===y))return f===0&&y===21?"door":f===0?"stairs-up":"stairs-down";
 if(walls.has(key(f,x,y)))return "wall";
 if(items.has(key(f,x,y)))return "object";
 return "wood";
}
export function tavernObject(f,x,y){return items.get(key(f,x,y))||null;}
export function tavernPortals(){return portals;}
export function tavernObjects(){return [...items.values()];}
export const INTERIOR_TEMPLATES={tavernA:{id:"tavernA",size:TAVERN_SIZE,rooms:["sala gościnna","kuchnia","spiżarnia","zaplecze","pokoje gościnne","pokój karczmarza"],instance:TAVERN_MAP}};
