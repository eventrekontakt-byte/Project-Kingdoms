import {SITES} from "./world-map.js";
export const SITE_LAYOUTS=Object.fromEntries(SITES.filter(s=>s.map!=="overworld").map(s=>[s.map,{name:s.name,width:64,height:44,floors:1,site:s}]));
function hash(x,y,seed){return ((x*73856093^y*19349663^seed*83492791)>>>0)%100;}
export function siteTile(map,x,y){
 const l=SITE_LAYOUTS[map];if(!l)return "void";
 if(x<0||y<0||x>=64||y>=44)return "void";
 const {site:s}=l,seed=s.x*31+s.y*17;
 if(x<=2||y<=2||x>=61||y>=41)return "grass";
 const city=s.type==="city",village=s.type==="village",castle=s.type==="castle",hideout=s.type==="hideout";
 const centralRoad=Math.abs(x-32)<=2||Math.abs(y-22)<=2;
 if(centralRoad)return "road";
 if(city||village||castle){
  const blocks=city?[[9,8,18,16],[23,8,30,16],[37,8,49,17],[11,27,23,36],[39,27,53,36]]:castle?[[17,10,46,13],[17,30,46,33],[17,10,20,33],[43,10,46,33]]:[[13,11,23,19],[40,11,49,19],[14,29,24,36]];
  if(blocks.some(([a,b,c,d])=>x>=a&&x<=c&&y>=b&&y<=d)){
   // Each rectangular block has a road-facing doorway, rather than an impassable solid rectangle.
   if(blocks.some(([a,b,c,d])=>x===Math.floor((a+c)/2)&&y===d))return "road";
   return "wall";
  }
  if(village&&x>26&&x<38&&y>27&&y<39)return "meadow";
  if(city&&x>26&&x<37&&y>27&&y<39)return "meadow";
 }
 const n=hash(x,y,seed);
 if(s.id==="wies-rybacka"||s.id==="miasto-poludniowe"||s.id==="przystan")return x>52&&y<35?"water":x>=48&&x<=53&&y>=18&&y<=25?"road":n<12?"tree":"grass";
 if(s.id==="kopalnia"||s.id==="wies-kamienna"||s.id==="kryjowka-skalna")return n<24?"wall":n<35?"hill":"rock";
 if(hideout||s.id==="wies-brzozowa")return n<35?"tree":"forest-floor";
 if(s.id==="ruiny"||s.id==="swiatynia")return n<19?"wall":"rock";
 return n<12?"tree":n<23?"meadow":"grass";
}
