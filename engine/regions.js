// Procedural tactical region prototypes; deterministic, no runtime randomness.
export const REGION_LAYOUTS={
 puszcza:{name:"Puszcza Cieni",width:64,height:44,ground:"forest-floor",seed:19},
 przelecz:{name:"Kamienna Przełęcz",width:64,height:44,ground:"rock",seed:37},
 doliny:{name:"Zielone Doliny",width:64,height:44,ground:"meadow",seed:53},
 jeziora:{name:"Kraina Jezior",width:64,height:44,ground:"grass",seed:71}
};
const hash=(x,y,seed)=>((x*73856093^y*19349663^seed*83492791)>>>0)%100;
export function regionTile(map,x,y){
 const l=REGION_LAYOUTS[map];if(!l)return "void";
 const {width:w,height:h,seed}=l;
 if(x<0||y<0||x>=w||y>=h)return "void";
 // All borders have passable approach strips so entering/exiting regions is possible.
 if(x<=2||y<=2||x>=w-3||y>=h-3)return l.ground;
 if(Math.abs(x-Math.floor(w/2))<=1||Math.abs(y-Math.floor(h/2))<=1)return "road";
 const n=hash(x,y,seed);
 if(map==="puszcza")return n<43?"tree":n<48?"hill":"forest-floor";
 if(map==="przelecz")return n<37?"wall":n<45?"hill":"rock";
 if(map==="doliny")return n<13?"tree":n<25?"meadow":"grass";
 if(map==="jeziora"){
  // Lake basins with broad walkable shores.
  const lake=((x-18)**2/150+(y-13)**2/50<1)||((x-47)**2/120+(y-30)**2/60<1);
  return lake?"water":n<12?"tree":n<25?"meadow":"grass";
 }
 return l.ground;
}
