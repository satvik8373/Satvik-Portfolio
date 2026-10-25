import {chromium} from 'playwright-core';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
import {projects} from '../portfolio-data.mjs';
const out='evidence/source-project-verification';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={cards:[],biolinks:[],passed:false};
try{
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:5260/work',{waitUntil:'load'});await page.waitForTimeout(2300);
  const cards=page.locator('.projects-list .project-card');assert.equal(await cards.count(),5);
  for(let i=0;i<projects.length;i++){
   const card=cards.nth(i);await card.scrollIntoViewIfNeeded();await page.waitForTimeout(1400);
   const src=await card.locator('.project-img').getAttribute('src');assert.ok(src.includes(projects[i].slug+'-fit-cover.svg'));
   await card.screenshot({path:`${out}/${projects[i].slug}-${width}.png`});
   const rect=await card.boundingBox();assert.ok(rect.x>=-1&&rect.x+rect.width<=width+1);
   report.cards.push({project:projects[i].name,width,source:src,rect});
  }
  const first=cards.first();await first.scrollIntoViewIfNeeded();await page.waitForTimeout(1300);await first.hover();await page.waitForTimeout(800);
  const mask=first.locator('.project-card-mask-overlay .mask-brush-path');assert.ok(Number(await mask.evaluate(x=>getComputedStyle(x).strokeWidth.replace('px','')))>0);
  await first.screenshot({path:`${out}/hover-${width}.png`});
  await page.goto('http://localhost:5260/work/biolinks',{waitUntil:'load'});await page.waitForTimeout(2500);
  assert.equal((await page.locator('h1').innerText()).trim().toLowerCase(),'biolinks');
  assert.ok((await page.locator('.case-narrative').innerText()).includes('Zustand'));assert.equal(await page.locator('.portfolio-live-link').count(),0);
  await page.screenshot({path:`${out}/biolinks-detail-${width}.png`});
  assert.deepEqual(errors,[]);report.biolinks.push({width,errors});await page.close();
 }
 report.passed=true;
}catch(error){report.error=error.stack;console.error(error);process.exitCode=1;}
finally{await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();}
console.log({passed:report.passed,cards:report.cards.length,biolinks:report.biolinks.length});
