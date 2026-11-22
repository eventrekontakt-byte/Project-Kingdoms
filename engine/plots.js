// PLOT 1.0 — stable city parcels. Only management mode exposes their boundaries.
import {CITY_BUILDINGS,CITY_VACANT_PLOTS,cityTile} from "./city-one.js";
export const PLOT_SCHEMA=1;
const rect=b=>({x:b[0],y:b[1],w:b[2]-b[0]+1,h:b[3]-b[1]+1});
export const CITY_PLOTS=Object.freeze([
 ...CITY_BUILDINGS.map(b=>Object.freeze({id:"plot-"+b.id,city:"site-city1",name:b.name,bounds:[...b.bounds],buildingId:b.id,status:"occupied",legacy:true,buildable:true})),
 ...CITY_VACANT_PLOTS.map(p=>Object.freeze({id:"plot-"+p.id,city:"site-city1",name:p.name,bounds:[...p.bounds],buildingId:null,status:"vacant",legacy:false,buildable:true}))
]);
export function plotAt(x,y){return CITY_PLOTS.find(p=>x>=p.bounds[0]&&x<=p.bounds[2]&&y>=p.bounds[1]&&y<=p.bounds[3])||null;}
export function plotById(id){return CITY_PLOTS.find(p=>p.id===id)||null;}
export function plotStatus(plot,edits={}){
 const edit=edits[plot.id]||{};
 return {id:plot.id,name:plot.name,bounds:[...plot.bounds],buildingId:edit.buildingId??plot.buildingId,
 status:edit.status||plot.status,owner:edit.owner||"Miasto 1",legacy:plot.legacy};
}
export function plotBufferValid(bounds,terrain=cityTile){
 const [x1,y1,x2,y2]=bounds;
 for(let y=y1-1;y<=y2+1;y++)for(let x=x1-1;x<=x2+1;x++){
  if(x>=x1&&x<=x2&&y>=y1&&y<=y2)continue;
  if(["road","rampart","wall","door","void","water","stairs-up"].includes(terrain(x,y)))return false;
 }
 return true;
}
export function validateNewPlot(bounds){
 if(!Array.isArray(bounds)||bounds.length!==4||bounds.some(v=>!Number.isInteger(v)))return {ok:false,reason:"Nieprawidłowe współrzędne"};
 const [x1,y1,x2,y2]=bounds;
 if(x1<1||y1<1||x2>=111||y2>=87||x1>x2||y1>y2)return {ok:false,reason:"Poza granicami miasta"};
 if(CITY_PLOTS.some(p=>!(x2<p.bounds[0]-1||x1>p.bounds[2]+1||y2<p.bounds[1]-1||y1>p.bounds[3]+1)))return {ok:false,reason:"Działka koliduje z istniejącą działką lub jej odstępem"};
 if(!plotBufferValid(bounds))return {ok:false,reason:"Wymagany odstęp co najmniej jednej kratki od drogi i murów"};
 for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if(!["grass","meadow","tree"].includes(cityTile(x,y)))return {ok:false,reason:"Teren nie nadaje się pod zabudowę"};
 return {ok:true};
}
export function parcelSummary(edits={}){return CITY_PLOTS.reduce((acc,p)=>{const status=plotStatus(p,edits).status;acc[status]=(acc[status]||0)+1;return acc;},{total:CITY_PLOTS.length});}
