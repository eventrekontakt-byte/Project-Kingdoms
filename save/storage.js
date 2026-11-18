import {validLocation,blocked} from "../engine/world.js";
import {defaultObjects} from "../systems/interactions.js";
export const SAVE_KEY="project-kingdoms-alpha-01";
export const SAVE_SCHEMA=2;
export function saveGame(state){
 const payload={schema:SAVE_SCHEMA,app:"0.1-alpha",savedAt:new Date().toISOString(),state:{
  player:{...state.player},camera:{...state.camera},clock:{...state.clock},controlMode:state.controlMode,paused:state.paused,
  objects:structuredClone(state.objects||defaultObjects())
 }};
 try{localStorage.setItem(SAVE_KEY,JSON.stringify(payload));return true;}catch(e){console.error("Save failed",e);return false;}
}
export function loadGame(){
 try{
  const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;
  const data=JSON.parse(raw);if(![1,2].includes(data.schema)||!data.state?.player||!data.state?.clock)return null;
  const p=data.state.player;
  if(!validLocation(p.map,p.floor)||!Number.isInteger(p.x)||!Number.isInteger(p.y)||blocked(p.map,p.floor,p.x,p.y))return null;
  return {...data.state,objects:data.schema===2&&data.state.objects&&typeof data.state.objects==="object"?data.state.objects:defaultObjects()};
 }catch(e){console.error("Load failed",e);return null;}
}
