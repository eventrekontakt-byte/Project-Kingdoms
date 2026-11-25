// Independent subterranean map artwork; geometry remains in MFS data.
function box(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);}
function dot(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
export function drawUndergroundObject(c,o){if(!o.underground||o.geometry?.type!=="rect")return false;const {x,y,w,h}=o.geometry,t=o.type;
 if(t==="cave_crystal"){for(const [a,b,r] of [[.3,.4,.23],[.65,.5,.26],[.48,.18,.17]]){c.fillStyle="#8ac9c9";c.beginPath();c.moveTo(x+a,y+b-r);c.lineTo(x+a+r*.65,y+b);c.lineTo(x+a,y+b+r);c.lineTo(x+a-r*.65,y+b);c.closePath();c.fill();}}
 else if(t==="mine_ore"){box(c,x,y,w,h,"#51575a");for(let i=0;i<6;i++)dot(c,x+.17+i*.28,y+.28+(i%2)*.36,.12,o.name.includes("miedzi")?"#bd895b":o.name.includes("srebra")?"#b9c6c9":"#a48772");}
 else if(t==="crypt_sarcophagus"){box(c,x+.04,y+.08,w-.08,h-.16,"#686e71");box(c,x+.2,y+.16,w-.4,h-.32,"#9b9c92");box(c,x+w*.48,y+.22,.08,h-.44,"#706b60");}
 else if(t==="underground_lamp"){dot(c,x+.5,y+.5,.36,"#80513a");dot(c,x+.5,y+.5,.23,"#e3a44c");dot(c,x+.5,y+.46,.12,"#f8e09a");}
 else if(t==="mine_support"){box(c,x+.3,y,.4,h,"#805a3c");box(c,x+.1,y+.1,.8,.16,"#ac8253");}
 else if(t==="mine_cart"){box(c,x+.12,y+.15,w-.24,h-.3,"#8f7151");box(c,x+.27,y+.25,w-.54,h-.5,"#45464a");for(const a of [.35,w-.35])dot(c,x+a,y+.87,.16,"#343b3d");}
 else if(t==="cave_boulder"){dot(c,x+w/2,y+h/2,.46,"#858789");}
 else if(t==="hideout_bed"){box(c,x+.06,y+.06,w-.12,h-.12,"#87674b");box(c,x+.17,y+.18,w-.34,h-.36,"#978a76");box(c,x+.18,y+.23,.35,h-.46,"#d3c1a1");}
 else if(t==="crypt_relic"||t==="crypt_urn"){dot(c,x+.5,y+.5,.32,"#997b51");dot(c,x+.5,y+.5,.15,"#d5b67a");}
 else{box(c,x+.06,y+.06,w-.12,h-.12,"#775b40");box(c,x+.13,y+.13,w-.26,h-.26,"#ad8b60");}return true;}
