// Persistent strategic geography. All coordinates are tile coordinates.
export const WORLD_WIDTH=120,WORLD_HEIGHT=84;
export const SITES=[
{id:"miasto-krolewskie",name:"Miasto 1",type:"city",faction:"Państwo 1",x:35,y:36,map:"site-city1",description:"Rozbudowane miasto z murami, twierdzą, targiem, warsztatami i farmami."},
{id:"miasto-poludniowe",name:"Miasto 2",type:"city",faction:"Państwo 2",x:88,y:58,map:"site-port",description:"Miasto handlowe nad zatoką."},
{id:"zamek-polnocny",name:"Zamek 1",type:"castle",faction:"Państwo 1",x:53,y:15,map:"site-kruczy",description:"Twierdza strzegąca przełęczy."},
{id:"zamek-poludniowy",name:"Zamek 2",type:"castle",faction:"Państwo 2",x:91,y:36,map:"site-straznica",description:"Forteca na południowym trakcie."},
{id:"wies-brzozowa",name:"Wieś 1",type:"village",faction:"Państwo 1",x:17,y:27,map:"site-brzozowa",description:"Wieś drwali na skraju puszczy."},
{id:"wies-mlinska",name:"Wieś 2",type:"village",faction:"Państwo 1",x:47,y:52,map:"site-mlynska",description:"Osada rolnicza z młynem."},
{id:"wies-rybacka",name:"Wieś 3",type:"village",faction:"Państwo 2",x:70,y:70,map:"site-rybaki",description:"Wioska rybacka."},
{id:"wies-kamienna",name:"Wieś 4",type:"village",faction:"Państwo 2",x:105,y:24,map:"site-kamienna",description:"Osada górników i kamieniarzy."},
{id:"kryjowka-lesna",name:"Kryjówka 1",type:"hideout",faction:"Niezależni",x:10,y:49,map:"site-lesna",description:"Ukryty obóz bandytów."},
{id:"kryjowka-skalna",name:"Kryjówka 2",type:"hideout",faction:"Niezależni",x:107,y:48,map:"site-skalna",description:"Bandyci w skalnych jaskiniach."},
{id:"ruiny",name:"Ruiny 1",type:"landmark",faction:"Niezależni",x:29,y:67,map:"site-ruiny",description:"Pozostałości zapomnianej cywilizacji."},
{id:"kopalnia",name:"Kopalnia 1",type:"landmark",faction:"Państwo 1",x:67,y:23,map:"site-kopalnia",description:"Wyrobiska i górnicze sztolnie."},
{id:"swiatynia",name:"Świątynia 1",type:"landmark",faction:"Niezależni",x:76,y:11,map:"site-swiatynia",description:"Starożytna świątynia."},
{id:"przystan",name:"Przystań 1",type:"landmark",faction:"Państwo 2",x:64,y:48,map:"site-przystan",description:"Przeprawa i punkt handlowy."}
];
export const WORLD_START={x:35,y:38};
export const SITE_BY_MAP=Object.fromEntries(SITES.map(s=>[s.map,s]));
export const SITE_COLORS={city:"#f4ca78",castle:"#d7a9fa",village:"#e7e2bb",hideout:"#e17d79",landmark:"#8fd8d3"};
export function siteAt(x,y){return SITES.find(s=>s.x===x&&s.y===y)||null;}
export function siteById(id){return SITES.find(s=>s.id===id)||null;}
export function siteForMap(map){return SITE_BY_MAP[map]||null;}
export function worldTile(x,y){
 if(x<0||y<0||x>=WORLD_WIDTH||y>=WORLD_HEIGHT)return "void";
 const ridge=Math.sin(x*.115)+Math.cos(y*.13)+Math.sin((x+y)*.052);
 const lake=((x-73)**2/155+(y-61)**2/85<1)||((x-15)**2/130+(y-70)**2/75<1);
 if(lake)return "water";
 if(ridge>1.7&&x>50)return "mountain";
 const noise=(x*17+y*31+x*y*11)%23;
 if(noise<6&&x<55)return "forest";
 return y>49?"meadow":"plains";
}
export function roadAt(x,y){
 // Connected roads joining cities, villages, castles and key landmarks.
 const edges=[[0,4],[0,5],[0,2],[0,11],[0,13],[13,1],[13,3],[1,6],[1,7],[3,7],[0,10],[4,8],[7,9],[2,12]];
 return edges.some(([a,b])=>{
  const p=SITES[a],q=SITES[b],dx=q.x-p.x,dy=q.y-p.y;
  const t=Math.max(0,Math.min(1,((x-p.x)*dx+(y-p.y)*dy)/(dx*dx+dy*dy)));
  return Math.hypot(x-(p.x+t*dx),y-(p.y+t*dy))<.85;
 });
}
export function walkableWorld(x,y){return worldTile(x,y)!=="void";}
// World travel is open-world; difficult terrain is slower but not impassable at this prototype stage.
export function terrainCost(x,y){const t=worldTile(x,y);return t==="mountain"?5:t==="forest"?3:t==="water"?4:roadAt(x,y)?1:2;}

export const FACTIONS=[
 {id:"north",name:"Państwo 1",capital:"miasto-krolewskie",color:"#6d9dc8"},
 {id:"south",name:"Państwo 2",capital:"miasto-poludniowe",color:"#d6a468"}
];
export function factionAt(x,y){
 if(x<0||y<0||x>=WORLD_WIDTH||y>=WORLD_HEIGHT)return null;
 const northern=SITES.filter(s=>s.faction==="Państwo 1");
 const southern=SITES.filter(s=>s.faction==="Państwo 2");
 const distance=sites=>Math.min(...sites.map(s=>Math.hypot((x-s.x)*1.0,(y-s.y)*1.25)));
 const a=distance(northern),b=distance(southern);
 if(Math.min(a,b)>28||Math.abs(a-b)<3)return null;
 return a<b?"north":"south";
}
export function borderAt(x,y){
 const faction=factionAt(x,y);if(!faction)return false;
 return [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>factionAt(x+dx,y+dy)!==faction);
}
