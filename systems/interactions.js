import {OBJECTS,objectAt} from "../engine/world.js";
export function defaultObjects(){return Object.fromEntries(Object.values(OBJECTS).map(o=>[o.id,{opened:false,inspected:false}]));}
export function interactionNear(player){
 const positions=[[player.x,player.y],[player.x+1,player.y],[player.x-1,player.y],[player.x,player.y+1],[player.x,player.y-1]];
 for(const [x,y] of positions){const object=objectAt(player.map,player.floor,x,y);if(object)return object;}
 return null;
}
export function interact(state){
 const object=interactionNear(state.player);
 if(!object)return "Nie ma tu niczego do zbadania.";
 const record=state.objects[object.id]||(state.objects[object.id]={opened:false,inspected:false});
 record.inspected=true;
 if(object.kind==="chest"){
  if(record.opened)return `${object.name}: skrzynia jest już otwarta.`;
  record.opened=true;return `${object.name}: otwarto. ${object.description}`;
 }
 return `${object.name}: ${object.description}`;
}
