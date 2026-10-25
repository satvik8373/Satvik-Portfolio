import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const out='evidence/original-style-loader';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={screens:[],checks:[],passed:false};
try{
 for(const [width,height] of [[320,720],[390,844],[1535,723]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:5260/',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(120);
  assert.equal(await page.locator('[data-loader-letter]').count(),6);
  assert.equal(await page.locator('[data-loader-ribbon]').count(),1);
  assert.equal(await page.locator('[data-loader-signature]').count(),0);
  assert.equal(await page.locator('.loader-inner svg').getAttribute('viewBox'),'0 0 1451 1004');
  await page.screenshot({path:`${out}/intro-${width}.png`});
  // Scrub only the existing reference timeline for deterministic visual checks.
  await page.evaluate(()=>{
   const tl=gsap.globalTimeline.getChildren(true,false,true).find(t=>t.vars.delay===0.25&&t.timeScale()===1.25);
   if(!tl)throw new Error('Reference logo timeline not found');
   tl.pause().time(2.2);window.__loaderTestTimeline=tl;
  });
  await page.screenshot({path:`${out}/drawing-${width}.png`});
  await page.evaluate(()=>{window.__loaderTestTimeline.time(4.79);});
  const state=await page.locator('.loader-inner svg').evaluate(svg=>{
   const r=svg.getBoundingClientRect();
   return {box:r.toJSON(),letters:[...svg.querySelectorAll('[data-loader-letter]')].map(e=>({letter:e.dataset.loaderLetter,scale:Number(gsap.getProperty(e,'scaleX')),box:e.getBoundingClientRect().toJSON()})),name:svg.getAttribute('aria-label')};
  });
  assert.ok(state.box.width>0&&state.box.height>0);
  assert.ok(state.letters.every(e=>e.scale>.99),'All six letters finish revealing');
  assert.equal([...state.letters].sort((a,b)=>a.box.left-b.box.left).map(e=>e.letter).join(''),'SATVIK','The name reads left to right on one row');
  assert.ok(Math.min(...state.letters.map(e=>e.box.bottom))>Math.max(...state.letters.map(e=>e.box.top)),'All letters share the same line');
  assert.ok(state.letters.every(e=>e.box.left>=0&&e.box.right<=width&&e.box.top>=0&&e.box.bottom<=height),'The complete name stays in the viewport');
  await page.screenshot({path:`${out}/name-${width}.png`});
  await page.evaluate(()=>{window.__loaderTestTimeline.play();});
  await page.waitForFunction(()=>window.__two26LoaderDone===true,{timeout:6000});
  assert.equal(await page.locator('.loader').isVisible(),false);
  await page.waitForTimeout(1200);
  assert.equal(await page.locator('.hero-line').first().evaluate(e=>getComputedStyle(e).opacity),'1');
  assert.deepEqual(errors,[]);report.screens.push({width,height,...state,errors});
  if(width===1535){
   await page.locator('.navbar-wrap .navbar-link-btn[href="/work"]').first().click();
   await page.waitForURL('**/work');
   await page.waitForFunction(()=>window.__two26LoaderDone===true);
   assert.equal(await page.locator('.loader').isVisible(),false);
   report.checks.push('Internal navigation skips the splash');
   await page.reload({waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('.loader').isVisible(),true);
   await page.waitForFunction(()=>window.__two26LoaderDone===true);
   report.checks.push('Reload replays the personal splash');
  }
  await page.close();
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});
 await reduced.goto('http://localhost:5260/',{waitUntil:'load'});
 assert.equal(await reduced.evaluate(()=>window.__two26LoaderDone),true);
 assert.equal(await reduced.locator('.loader').isVisible(),false);
 report.checks.push('Reduced motion skips the splash');await reduced.close();
 report.passed=true;console.log({passed:true,screens:report.screens.length,checks:report.checks});
}catch(error){report.error=error.stack;console.error(error);process.exitCode=1;}
finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();}
