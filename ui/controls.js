// Touch buttons support long press. Releasing or cancelling always stops motion.
export function setupControls(onMove,onMode){
 const dpad=document.getElementById("dpad"),joystick=document.getElementById("joystick");
 const modeSelect=document.getElementById("controlMode");
 let held=null,repeat=null,joyPointer=null;
 function stop(){held=null;if(repeat!==null)clearInterval(repeat);repeat=null;}
 function start(dir){stop();held=dir;onMove(dir);repeat=setInterval(()=>{if(held)onMove(held);},125);}
 dpad.querySelectorAll("[data-dir]").forEach(button=>{
  button.addEventListener("pointerdown",e=>{e.preventDefault();button.setPointerCapture(e.pointerId);start(button.dataset.dir);});
  for(const type of ["pointerup","pointercancel","lostpointercapture"])button.addEventListener(type,stop);
 });
 const base=document.getElementById("stickBase"),knob=document.getElementById("stickKnob");
 function resetStick(){joyPointer=null;knob.style.transform="translate(0,0)";stop();}
 function steer(e){const rect=base.getBoundingClientRect(),dx=e.clientX-(rect.left+rect.width/2),dy=e.clientY-(rect.top+rect.height/2);
  const max=45,mag=Math.hypot(dx,dy),ratio=mag?Math.min(1,max/mag):0;
  knob.style.transform=`translate(${dx*ratio}px,${dy*ratio}px)`;
  if(mag<18){stop();return;}
  const dir=Math.abs(dx)>Math.abs(dy)?(dx>0?"right":"left"):(dy>0?"down":"up");
  if(dir!==held)start(dir);
 }
 base.addEventListener("pointerdown",e=>{e.preventDefault();joyPointer=e.pointerId;base.setPointerCapture(e.pointerId);steer(e);});
 base.addEventListener("pointermove",e=>{if(e.pointerId===joyPointer)steer(e);});
 for(const type of ["pointerup","pointercancel","lostpointercapture"])base.addEventListener(type,resetStick);
 function setMode(mode){const joy=mode==="joystick";dpad.hidden=joy;joystick.hidden=!joy;modeSelect.value=joy?"joystick":"dpad";resetStick();onMode(modeSelect.value);}
 modeSelect.addEventListener("change",()=>setMode(modeSelect.value));
 return {setMode,stop};
}
