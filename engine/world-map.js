// Strategic map (world scale), distinct from the 64x44 tactical location.
export const WORLD_WIDTH=12,WORLD_HEIGHT=8;
export const REGIONS=[
 {id:"pogranicze",name:"Pogranicze",x:5,y:4,terrain:"plains",location:"overworld",entry:{x:12,y:17},description:"Warownia, karczma, dom i magazyn."},
 {id:"puszcza",name:"Puszcza Cieni",x:4,y:3,terrain:"forest",description:"Nieodkryte leśne ostępy."},
 {id:"przelecz",name:"Kamienna Przełęcz",x:6,y:3,terrain:"mountain",description:"Szlak wśród wysokich gór."},
 {id:"doliny",name:"Zielone Doliny",x:6,y:4,terrain:"plains",description:"Żyzne ziemie i osady."},
 {id:"jeziora",name:"Kraina Jezior",x:5,y:5,terrain:"water",description:"Jeziora i przeprawy."}
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
