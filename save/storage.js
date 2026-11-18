// Save schema is deliberately separate from app version.
export const SAVE_KEY="project-kingdoms-alpha-01";
export const SAVE_SCHEMA=1;
export function saveGame(state){
 const payload={schema:SAVE_SCHEMA,app:"0.1-alpha",savedAt:new Date().toISOString(),state:{
  player:{...state.player},camera:{...state.camera},clock:{...state.clock},controlMode:state.controlMode,paused:state.paused
 }};
 try{localStorage.setItem(SAVE_KEY,JSON.stringify(payload));return true;}catch(e){console.error("Save failed",e);return false;}
}
export function loadGame(){
 try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;
  const data=JSON.parse(raw);if(data.schema!==SAVE_SCHEMA||!data.state?.player||!data.state?.clock)return null;
  const p=data.state.player;
  if(!["overworld","keep"].includes(p.map)||!Number.isInteger(p.floor)||!Number.isInteger(p.x)||!Number.isInteger(p.y))return null;
  return data.state;
 }catch(e){console.error("Load failed",e);return null;}
}
