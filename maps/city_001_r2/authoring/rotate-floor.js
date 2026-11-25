function rotateFloor(f,rotation){
 if(![0,90,180,270].includes(rotation))throw Error("invalid rotation");if(rotation===0)return f;
 const W=f.width,H=f.height,point=(p)=>rotation===90?{x:H-1-p.y,y:p.x}:rotation===180?{x:W-1-p.x,y:H-1-p.y}:{x:p.y,y:W-1-p.x};
 function visit(v){if(Array.isArray(v))return v.map(visit);if(!v||typeof v!=="object")return v;
  if(v.type==="rect"&&Number.isInteger(v.x)&&Number.isInteger(v.y)){let a=point({x:v.x,y:v.y}),b=point({x:v.x+v.w-1,y:v.y+v.h-1});return {...v,x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.abs(a.x-b.x)+1,h:Math.abs(a.y-b.y)+1};}
  if(v.type==="mask"){const cells=new Map();for(const r of v.rows)for(const [start,end] of r.spans)for(let x=start;x<end;x++){let p=point({x,y:r.y});if(!cells.has(p.y))cells.set(p.y,new Set());cells.get(p.y).add(p.x);}return {type:"mask",rows:[...cells].sort((a,b)=>a[0]-b[0]).map(([y,xs])=>{let spans=[];for(let x of [...xs].sort((a,b)=>a-b)){let a=spans[spans.length-1];if(a&&a[1]===x)a[1]++;else spans.push([x,x+1]);}return {y,spans};})};}
  if(v.type==="polygon")throw Error("Polygon floor geometry requires explicit vertex transform");
  if(Number.isInteger(v.x)&&Number.isInteger(v.y)){let p=point(v);return {...v,...p};}
  const o=Object.fromEntries(Object.entries(v).map(([k,x])=>[k,visit(x)]));if(v.geometry&&Number.isInteger(v.rotation))o.rotation=(v.rotation+rotation)%360;
  return o;
 }
 const out=visit(f);if(rotation%180){out.width=H;out.height=W;}out.instanceOverrides={...out.instanceOverrides,orientation:rotation};return out;
}
