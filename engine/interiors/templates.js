import {defineTemplate,resolveInstance,buildOccupancy,validateTemplate} from "./tbi.js?v=0.3.3";
export const TAVERN_MAP="interior-city1-karczma";
export const TAVERN_SIZE={width:36,height:27,floors:3};
const walls=new Set(),furniture=[],decor=[],portals=[];
const k=(f,x,y)=>f+":"+x+":"+y;
function wall(f,x,y){walls.add(k(f,x,y));}
function line(f,x1,y1,x2,y2,doors=[]){for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if(!doors.some(([dx,dy])=>dx===x&&dy===y))wall(f,x,y);}
for(let f=0;f<3;f++){for(let x=0;x<36;x++){wall(f,x,0);wall(f,x,26);}for(let y=0;y<27;y++){wall(f,0,y);wall(f,35,y);}}
walls.delete(k(0,16,26));
// Ground: tavern hall, kitchen, pantry, service room, southern lobby.
line(0,23,1,23,23,[[23,8],[23,9],[23,19]]);
line(0,24,12,34,12,[[29,12]]);
line(0,24,18,34,18,[[29,18]]);
line(0,1,23,34,23,[[17,23],[18,23],[29,23]]);
line(0,11,24,11,25,[[11,25]]);
// First floor: five guest rooms and owner quarters around a corridor.
line(1,1,12,34,12,[[6,12],[17,12],[29,12]]);
line(1,1,16,34,16,[[6,16],[17,16],[29,16]]);
line(1,12,1,12,11,[[12,6]]);
line(1,24,1,24,11,[[24,6]]);
line(1,12,17,12,25,[[12,21]]);
line(1,24,17,24,25,[[24,21]]);
// Cellar: storage, food cellar and locked strongroom.
line(2,20,1,20,25,[[20,8],[20,20]]);
line(2,21,14,34,14,[[27,14]]);
line(2,1,17,19,17,[[10,17]]);
// Matching 3x3 staircase footprints. Arrival one tile beside each portal.
const STAIRS={x:5,y:24},CELLAR_STAIRS={x:29,y:24};
portals.push({from:[0,16,26],to:null,exit:true});
portals.push({from:[0,5,24],to:[1,6,24]},{from:[1,5,24],to:[0,6,24]});
portals.push({from:[0,29,24],to:[2,30,24]},{from:[2,29,24],to:[0,30,24]});
export const TAVERN_STAIRS=STAIRS;
function item(f,id,name,kind,x,y,w=1,h=1,extra={}){
 const o={id:"city1-tavern-"+id,name,kind,x,y,w,h,floor:f,description:extra.description||name,owner:extra.owner??"karczmarz",loot:extra.loot||[],...extra};
 for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(xx<1||xx>=35||yy<1||yy>=27||walls.has(k(f,xx,yy))||furniture.some(p=>p.floor===f&&xx>=p.x&&xx<p.x+p.w&&yy>=p.y&&yy<p.y+p.h)||portals.some(p=>p.from[0]===f&&p.from[1]===xx&&p.from[2]===yy))throw Error("TBI authored overlap "+id+" "+k(f,xx,yy));
 furniture.push(o);
}
function rug(f,x,y,w,h,tone="red"){decor.push({floor:f,style:"rug",x,y,w,h,tone});}
function stair(f,x,y){decor.push({floor:f,style:"staircase",x:x-1,y:y-1,w:3,h:3});}
function lamp(f,x,y){decor.push({floor:f,style:"sconce",x,y,w:1,h:1});}
// Ground floor: fixed hand-authored tables and matching chairs.
item(0,"bar","Lada karczmarza","inspect",2,1,6,1,{style:"counter"});
item(0,"ledger","Księga gości","read",9,2,1,1,{style:"book"});
item(0,"hearth","Duży kominek","fireplace",17,1,3,1,{style:"fireplace"});
const tables=[[4,6,3,2],[13,6,3,2],[4,14,3,2],[13,14,3,2],[9,19,4,2]];
tables.forEach(([x,y,w,h],i)=>{item(0,"table-"+i,"Stół biesiadny","inspect",x,y,w,h,{style:"table",owner:"publiczny"});const chairs=[[x-1,y],[x+w,y],[x-1,y+h-1],[x+w,y+h-1]];chairs.forEach(([cx,cy],j)=>item(0,"chair-"+i+"-"+j,"Krzesło","sit",cx,cy,1,1,{style:"chair",owner:"publiczny"}));});
item(0,"kitchen-stove","Piec kuchenny","inspect",27,1,3,2,{style:"stove"});
item(0,"kitchen-table","Stół roboczy","inspect",27,5,4,2,{style:"table"});
item(0,"kitchen-cupboard","Kredens","container",34,2,1,3,{style:"wardrobe",loot:["Miska","Kubek"]});
item(0,"kitchen-barrel","Beczka","inspect",24,2,1,1,{style:"barrel"});
item(0,"pantry-chest","Skrzynia żywności","container",32,13,2,1,{style:"chest",loot:["Chleb","Ser"]});
item(0,"pantry-shelf","Regał","inspect",24,13,1,3,{style:"shelf"});
item(0,"service-chest","Skrzynia zapasów","container",32,19,2,1,{style:"chest",loot:["Świeca","Sznur"]});
item(0,"service-barrel","Beczka wina","inspect",24,20,1,1,{style:"barrel"});
item(0,"plant-a","Roślina","inspect",22,2,1,1,{style:"plant"});
item(0,"plant-b","Roślina","inspect",1,21,1,1,{style:"plant"});
rug(0,9,10,4,3);rug(0,14,18,3,3,"blue");
for(const [x,y] of [[9,1],[21,1],[25,1],[33,1],[1,10],[22,15],[34,21]])lamp(0,x,y);
// Upper floor: six separate furnished rooms, all wall anchored.
const beds=[[1,2],[14,2],[26,2],[1,19],[14,19],[26,19]];
beds.forEach(([x,y],i)=>{item(1,"bed-"+i,i===5?"Łóżko karczmarza":"Łóżko gościnne","rest",x+1,y-1,2,3,{style:"bed",owner:i===5?"karczmarz":"publiczny"});item(1,"chest-"+i,"Kufer","container",x+6,y-1,2,1,{style:"chest",loot:i===5?["Dokumenty"]:["Ubrania"]});rug(1,x+3,y+5,3,2,i%2?"blue":"red");});
item(1,"wardrobe-1","Szafa","container",34,20,1,3,{style:"wardrobe"});
item(1,"wardrobe-2","Szafa","container",11,3,1,3,{style:"wardrobe"});
item(1,"dresser-1","Komoda","container",18,1,2,1,{style:"dresser"});
item(1,"dresser-2","Komoda","container",2,25,2,1,{style:"dresser"});
for(const [x,y] of [[5,1],[17,1],[29,1],[5,25],[17,25],[29,25]])lamp(1,x,y);
// Cellar: stockrooms and treasury.
for(const [id,x,y] of [["beer",2,2],["wine",5,2],["ale",8,2],["cider",11,2],["water",14,2]])item(2,id,"Beczka "+id,"inspect",x,y,1,1,{style:"barrel"});
item(2,"store-table","Stół magazynowy","inspect",7,8,4,2,{style:"table"});
item(2,"supply-1","Skrzynia zapasów","container",2,18,2,1,{style:"chest",loot:["Ziarno"]});
item(2,"supply-2","Skrzynia zapasów","container",5,18,2,1,{style:"chest",loot:["Suszone mięso"]});
item(2,"cellar-shelf","Regał piwniczny","inspect",21,1,1,4,{style:"shelf"});
item(2,"vault-chest","Zamknięty kufer","container",32,15,2,1,{style:"chest",owner:"karczmarz",loot:["Monety"]});
for(let f=0;f<2;f++)stair(f,5,24);
for(const f of [0,2])stair(f,29,24);
for(const [x,y] of [[1,6],[19,6],[22,6],[34,6],[1,20],[34,20]])lamp(2,x,y);
export const TAVERN_DECOR=decor;
export const TAVERN_TEMPLATE=defineTemplate({id:"tavern-urban-01",size:TAVERN_SIZE,walls,portals,rooms:[{floor:0,type:"dining"},{floor:0,type:"kitchen"},{floor:0,type:"pantry"},{floor:0,type:"service"},{floor:1,type:"guest"},{floor:2,type:"cellar"}],furniture,decor,slots:[]});
export const TAVERN_INSTANCE=resolveInstance(TAVERN_TEMPLATE,{id:TAVERN_MAP,owner:"karczmarz"});
const check=validateTemplate(TAVERN_INSTANCE,TAVERN_SIZE);
if(!check.ok)throw Error("TBI invalid: "+check.errors.join("; "));
const occupancy=buildOccupancy(TAVERN_INSTANCE).occupied;
export const TAVERN_BUILDING_MODEL=TAVERN_INSTANCE;
export function tavernFurniture(f){return TAVERN_INSTANCE.objects.filter(o=>o.floor===f);}
export function tavernDecor(f){return TAVERN_INSTANCE.decorations.filter(o=>o.floor===f);}
export function tavernObject(f,x,y){return occupancy.get(k(f,x,y))||null;}
export function tavernPortals(){return portals;}
export function tavernTile(f,x,y){
 if(f<0||f>=3||x<0||x>=36||y<0||y>=28)return "void";
 if(portals.some(p=>p.from[0]===f&&p.from[1]===x&&p.from[2]===y))return f===0&&y===26?"door":f===1?"stairs-down":f===2?"stairs-up":x===5?"stairs-up":"stairs-down";
 if(walls.has(k(f,x,y)))return "wall";
 if(occupancy.has(k(f,x,y)))return "object";
 return "wood";
}
