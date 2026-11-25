import assert from "node:assert/strict";
import {chromium} from "playwright";
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:853,height:394},isMobile:true,hasTouch:true,serviceWorkers:"block"});
 const errors=[];page.on("pageerror",e=>errors.push(String(e)));
 await page.goto("http://127.0.0.1:8000/",{waitUntil:"domcontentloaded"});
 await page.waitForFunction(()=>document.querySelector("#location").textContent.includes("organiczny"),{},{timeout:60000});
 assert.match(await page.locator("#plotStats").textContent(),/Działki: 96.*zabudowane: 72.*wolne: 24/);
 await page.keyboard.press("ArrowRight");await page.waitForFunction(()=>document.querySelector("#coordinates").textContent.includes("7, 75"));
 await page.evaluate(()=>document.querySelector("#fastTravelTavern").click());await page.waitForFunction(()=>document.querySelector("#location").textContent.includes("Karczma"));
 await page.evaluate(()=>document.querySelector("#mfsReturnBtn").click());await page.waitForFunction(()=>document.querySelector("#location").textContent.includes("organiczny"));
 await page.evaluate(()=>document.querySelector("#saveBtn").click());const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem("project-kingdoms-alpha-01")));assert.equal(saved.state.player.map,"city_001");assert.equal(saved.schema,10);
 await page.evaluate(()=>document.querySelector("#mfsTestBtn").click());await page.waitForFunction(()=>document.querySelector("#location").textContent.includes("Poligon"));
 await page.evaluate(()=>document.querySelector("#mfsReturnBtn").click());await page.waitForFunction(()=>document.querySelector("#location").textContent.includes("organiczny"));
 assert.deepEqual(errors,[]);console.log("Mobile viewport browser smoke: startup, movement, tavern, return, save, MFS test");
}finally{await browser.close();}
