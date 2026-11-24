// Shared deterministic Canvas graphics for MFS interiors. Caller owns camera transform.
function box(c,x,y,w,h,fill,stroke="#3b3028",line=.035){c.fillStyle=fill;c.fillRect(x,y,w,h);if(stroke){c.strokeStyle=stroke;c.lineWidth=line;c.strokeRect(x,y,w,h);}}
function line(c,x,y,x2,y2,color="#49392e",width=.04){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();}
function dot(c,x,y,r,fill){c.fillStyle=fill;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
const wood=["#9b7856","#a4815d","#a17d58","#967351"];
export function drawInteriorTile(c,t,x,y,floor="wood"){
 if(t==="void"){box(c,x,y,1,1,"#192127",null);return;}if(t==="object")t=floor;
 if(t==="wood"){const n=Math.abs((x*37+y*19+x*y*7)%4);box(c,x,y,1,1,wood[n],null);for(const a of [.32,.68])line(c,x,y+a,x+1,y+a,"#74553d",.018);line(c,x+(n%2?.3:.7),y,x+(n%2?.3:.7),y+.32,"#74553d",.018);return;}
 if(t==="wall"){box(c,x,y,1,1,"#535b60",null);box(c,x+.06,y+.05,.88,.83,"#8b918e","#535958");line(c,x+.08,y+.47,x+.92,y+.47,"#606765");line(c,x+.47,y+.05,x+.47,y+.47,"#606765");line(c,x+.72,y+.47,x+.72,y+.88,"#606765");return;}
 if(t==="door"){box(c,x,y,1,1,"#b49a70",null);box(c,x+.08,y+.08,.84,.84,"#785035","#4b382b",.055);for(let i=1;i<4;i++)line(c,x+i*.21+.08,y+.1,x+i*.21+.08,y+.9,"#a87a50");dot(c,x+.75,y+.52,.06,"#e3bf64");return;}
 if(t.startsWith("stairs")){box(c,x,y,1,1,"#6f5d4b");for(let i=1;i<5;i++)line(c,x+.12,y+i*.16,x+.88,y+i*.16,"#d4b792");c.fillStyle="#fff1c9";c.font=".55px sans-serif";c.textAlign="center";c.textBaseline="middle";c.fillText(t.includes("up")?"↑":"↓",x+.5,y+.5);return;}
 box(c,x,y,1,1,t==="stone"?"#9b9a91":t==="marble"?"#d1c9b8":"#8d806d","#756c5d",.015);
}
export function drawInteriorFurniture(c,o){
 const g=o.geometry;if(g?.type!=="rect")return;const r=o.rotation||0,swap=r%180!==0,w=swap?g.h:g.w,h=swap?g.w:g.h,t=o.type;
 c.save();c.translate(g.x+g.w/2,g.y+g.h/2);c.rotate(r*Math.PI/180);c.translate(-w/2,-h/2);box(c,.09,.12,w-.1,h-.12,"#40302455",null);
 if(t.startsWith("bed_")){box(c,.06,.06,w-.12,h-.12,"#74492e");box(c,.14,.2,w-.28,h-.35,"#d8d2bb");box(c,.14,.65,w-.28,h-.8,"#66899a");box(c,.19,.22,w-.38,.32,"#eee6ce","#b6ad97",.025);if(w>1)line(c,w/2,.22,w/2,.54,"#b6ad97");}
 else if(["wardrobe","shelf","weapon_rack"].includes(t)){box(c,.06,.06,w-.12,h-.12,"#6d472c");box(c,.15,.15,w-.3,h-.3,"#ad7d4e");for(let y=.55;y<h-.12;y+=.55)line(c,.15,y,w-.15,y,"#61412b",.06);if(t==="wardrobe"){line(c,.5,.15,.5,h-.15,"#69452d");dot(c,.66,h*.45,.045,"#e1bc72");}else for(let y=.28;y<h-.2;y+=.55)box(c,.25,y,.46,.19,t==="weapon_rack"?"#b9b8af":"#7c9b71",null);}
 else if(["stove","forge","fireplace"].includes(t)){box(c,.05,.06,w-.1,h-.12,"#6b716e");box(c,.16,.18,w-.32,h-.36,"#363c3b");for(let x=.5;x<w;x+=1)dot(c,x,.57,.25,"#151a1c");if(t!=="stove"){dot(c,w/2,h*.65,.25,"#cc733e");dot(c,w/2,h*.65,.11,"#f4c271");}}
 else if(["chair","armchair","throne"].includes(t)){box(c,.16,.16,w-.32,h-.32,"#8a5b39");box(c,.15,h-.28,w-.3,.19,"#593921");box(c,.25,.24,w-.5,h-.55,t==="throne"?"#a75a4b":"#c2a06d");}
 else if(t==="anvil"){box(c,.22,.22,.56,.56,"#805d3a");box(c,.12,.33,.76,.34,"#899298","#343e42");box(c,.34,.22,.36,.56,"#b0b7b8","#343e42");}
 else if(t==="altar"||t==="bath"){box(c,.08,.08,w-.16,h-.16,"#a5a19a");box(c,.22,.2,w-.44,h-.4,t==="bath"?"#74a9bd":"#dbd2b9");}
 else{box(c,.07,.07,w-.14,h-.14,"#80532f");box(c,.14,.14,w-.28,h-.28,"#b58452");for(let y=.42;y<h-.1;y+=.4)line(c,.15,y,w-.15,y,"#8c603a",.025);if(t==="chest"){line(c,.15,h*.45,w-.15,h*.45,"#4d3828",.07);box(c,w*.42,h*.4,.16,.18,"#d6b56f");}if(t==="workbench"||t==="alchemy"){box(c,.24,.24,.25,.5,"#787f80");dot(c,w-.4,.5,.16,"#7098a3");}}
 c.restore();
}
export function drawMfsInterior(c,scene,range={l:0,r:scene.width-1,t:0,b:scene.height-1}){
 const {l,r,t,b}=range;for(let y=t;y<=b;y++)for(let x=l;x<=r;x++)drawInteriorTile(c,scene.tile(x,y),x,y,scene.floorTile||"wood");
 const os=new Map();for(const o of scene.objects.values())os.set(o.id,o);for(const o of os.values()){const g=o.geometry;if(g&&g.x<=r&&g.y<=b&&g.x+g.w>l&&g.y+g.h>t)drawInteriorFurniture(c,o);}
}
