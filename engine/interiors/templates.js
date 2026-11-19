// Reusable interior template: tavern, with deterministic furniture and persistent instances.
export const TAVERN_MAP="interior-city1-karczma";
export const TAVERN_SIZE={width:30,height:22,floors:2};
const key=(f,x,y)=>f+":"+x+":"+y;
const walls=new Set(),tiles=new Map(),items=new Map(),portals=[];
const wall=(f,x,y)=>walls.add(key(f,x,y));
const object=(f,id,name,kind,x,y,extra={})=>items.set(key(f,x,y),{id:"city1-tavern-"+id,name,kind,description:extra.description||name,owner:extra.owner||"karczmarz",loot:extra.loot||[],...extra});
for(let f=0;f<2;f++){
 for(let x=0;x<30;x++){wall(f,x,0);wall(f,x,21);}
 for(let y=0;y<22;y++){wall(f,0,y);wall(f,29,y);}
}
const partition=(f,x1,y1,x2,y2,doors=[])=>{
 for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if(!doors.some(p=>p[0]===x&&p[1]===y))wall(f,x,y);
};
// Parter: sala 1..17, kuchnia 19..28, spiżarnia północno-wschodnia.
partition(0,18,1,18,20,[[18,10],[18,11],[18,17]]);
partition(0,19,8,28,8,[[24,8],[25,8]]);
partition(0,1,15,17,15,[[8,15],[9,15]]);
// Piętro: korytarz centralny i cztery pokoje.
partition(1,1,10,28,10,[[6,10],[15,10],[24,10]]);
partition(1,10,1,10,9,[[10,6]]);
partition(1,20,1,20,9,[[20,6]]);
partition(1,10,11,10,20,[[10,16]]);
partition(1,20,11,20,20,[[20,16]]);
// Wejście na południu; schody na obu piętrach w tym samym miejscu.
walls.delete(key(0,14,21));
portals.push({from:[0,14,21],to:null,exit:true});
portals.push({from:[0,4,18],to:[1,4,18]},{from:[1,4,18],to:[0,4,18]});
object(0,"counter","Lada karczmarza","inspect",8,5,{description:"Dębowa lada z księgą zamówień."});
object(0,"ledger","Księga gości","read",9,5,{description:"Rejestr przyjezdnych i rachunków."});
object(0,"fireplace","Kominek","fireplace",3,3,{description:"Kamienny kominek ogrzewający salę."});
for(const [i,x,y] of [[1,5,9],[2,11,9],[3,5,12],[4,12,12]])object(0,"table-"+i,"Stół gościnny","inspect",x,y,{owner:"publiczny",description:"Stół dla gości karczmy."});
object(0,"stove","Piec kuchenny","inspect",23,3,{description:"Rozgrzany piec do przygotowywania posiłków."});
object(0,"pantry","Skrzynia z zapasami","container",26,4,{loot:["Chleb","Suszone mięso","Jabłko"]});
object(0,"barrel","Beczka piwa","inspect",21,5);
object(0,"supplies","Skrzynia na zapleczu","container",25,16,{loot:["Monety: 8","Sznur","Świeca"]});
object(0,"chair","Krzesło","sit",13,4,{owner:"publiczny"});
object(1,"bed1","Łóżko gościnne","rest",5,4,{owner:"publiczny"});
object(1,"bed2","Łóżko gościnne","rest",15,4,{owner:"publiczny"});
object(1,"bed3","Łóżko gościnne","rest",25,4,{owner:"publiczny"});
object(1,"bed4","Łóżko karczmarza","rest",25,16);
object(1,"guest-chest","Kufer podróżnego","container",7,7,{owner:"gość",loot:["Monety: 4","List"]});
object(1,"wardrobe","Szafa karczmarza","container",26,18,{loot:["Klucz","Płaszcz"]});
object(1,"letter","List karczmarza","read",23,14,{description:"List dotyczący dostawy zboża."});
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
