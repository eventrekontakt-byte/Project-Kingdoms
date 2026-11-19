import {OBJECTS,objectAt,doorAt} from "../engine/world.js";
export function defaultObjects(){return Object.fromEntries(Object.values(OBJECTS).map(o=>[o.id,{opened:false,inspected:false}]));}
export function interactionNear(player){
 const positions=[[player.x,player.y],[player.x+1,player.y],[player.x-1,player.y],[player.x,player.y+1],[player.x,player.y-1]];
 for(const [x,y] of positions){const object=objectAt(player.map,player.floor,x,y);if(object)return object;}
 return null;
}
export function interact(state){
 const positions=[[state.player.x+1,state.player.y],[state.player.x-1,state.player.y],[state.player.x,state.player.y+1],[state.player.x,state.player.y-1]];
 for(const [x,y] of positions){const door=doorAt(state.player.map,state.player.floor,x,y);if(!door)continue;
  const status=state.doors?.[door.id]||door.initial;
  if(status==="locked")return door.name+": zamknięte na klucz.";
  state.doors[door.id]=status==="open"?"closed":"open";return door.name+": "+(state.doors[door.id]==="open"?"otwarte.":"zamknięte.");
 }

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

export function objectActions(object,state){
 const rec=state.objects[object.id]||{};
 const actions=[{id:"inspect",label:"Zbadaj"}];
 if(object.kind==="container")actions.push({id:"open",label:rec.opened?"Zamknij":"Otwórz"});
 if(object.kind==="container"&&rec.opened&&(rec.loot||object.loot||[]).length)actions.push({id:"take",label:"Zabierz zawartość"});
 if(object.kind==="read")actions.push({id:"read",label:"Przeczytaj"});
 if(object.kind==="rest")actions.push({id:"rest",label:"Odpocznij"});
 if(object.kind==="sit")actions.push({id:"sit",label:"Usiądź"});
 if(object.kind==="fireplace")actions.push({id:"light",label:rec.lit?"Zgaś":"Rozpal"});
 return actions;
}
export function useObject(state,object,action){
 const rec=state.objects[object.id]||(state.objects[object.id]={opened:false,inspected:false});
 const owned=object.owner&&object.owner!=="publiczny"&&object.owner!=="gracz";
 if(action==="inspect"){rec.inspected=true;return object.name+": "+object.description;}
 if(action==="open"){rec.opened=!rec.opened;return object.name+(rec.opened?": otwarto.":": zamknięto.");}
 if(action==="read"){rec.inspected=true;return object.description;}
 if(action==="take"){
  if(!rec.opened)return "Najpierw otwórz pojemnik.";
  const loot=rec.loot||object.loot||[];
  if(!loot.length)return "Pojemnik jest pusty.";
  state.inventory=state.inventory||[];state.inventory.push(...loot);
  rec.loot=[];rec.taken=true;
  if(owned){state.crimes=(state.crimes||0)+1;state.reputation=(state.reputation||0)-2;}
  return "Zabrano: "+loot.join(", ")+(owned?". Kradzież! Reputacja -2.":"");
 }
 if(action==="rest"){state.clock.hour=(state.clock.hour+8)%24;if(state.clock.hour<8)state.clock.day++;return "Odpoczęto 8 godzin.";}
 if(action==="sit")return "Siadasz na chwilę.";
 if(action==="light"){rec.lit=!rec.lit;return rec.lit?"Rozpalono kominek.":"Zgaszono kominek.";}
 return "Nieznana czynność.";
}
