import {validLocation,blocked,defaultDoors} from "../engine/world.js";
import {defaultObjects} from "../systems/interactions.js";
export const SAVE_KEY="project-kingdoms-alpha-01";
export const SAVE_SCHEMA=8;
export function saveGame(state){
 const payload={schema:SAVE_SCHEMA,app:"0.3.4-alpha",savedAt:new Date().toISOString(),state:{
  player:{...state.player},camera:{...state.camera},clock:{...state.clock},controlMode:state.controlMode,paused:state.paused,worldRegion:state.worldRegion||"pogranicze",worldPosition:{...state.worldPosition},worldMode:Boolean(state.worldMode),worldTravelMinutes:state.worldTravelMinutes||0,
  buildingEdits:structuredClone(state.buildingEdits||{}),plotEdits:structuredClone(state.plotEdits||{}),
  inventory:structuredClone(state.inventory||[]),crimes:state.crimes||0,reputation:state.reputation||0,
  objects:structuredClone(state.objects||defaultObjects()),doors:structuredClone(state.doors||defaultDoors())
 }};
 try{localStorage.setItem(SAVE_KEY,JSON.stringify(payload));return true;}catch(e){console.error("Save failed",e);return false;}
}
export function loadGame(){
 try{
  const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;
  const data=JSON.parse(raw);if(![1,2,3,4,5,6,7,8].includes(data.schema)||!data.state?.player||!data.state?.clock)return null;
  const p=data.state.player;
  if(!validLocation(p.map,p.floor)||!Number.isInteger(p.x)||!Number.isInteger(p.y)||blocked(p.map,p.floor,p.x,p.y))return null;
  return {...data.state,plotEdits:data.schema>=8&&data.state.plotEdits&&typeof data.state.plotEdits==="object"?data.state.plotEdits:{},buildingEdits:data.schema>=7&&data.state.buildingEdits&&typeof data.state.buildingEdits==="object"?data.state.buildingEdits:{},worldRegion:data.schema>=4&&typeof data.state.worldRegion==="string"?data.state.worldRegion:"pogranicze",objects:data.schema>=2&&data.state.objects&&typeof data.state.objects==="object"?data.state.objects:defaultObjects(),doors:data.schema>=3&&data.state.doors&&typeof data.state.doors==="object"?{...defaultDoors(),...data.state.doors}:defaultDoors()};
 }catch(e){console.error("Load failed",e);return null;}
}
