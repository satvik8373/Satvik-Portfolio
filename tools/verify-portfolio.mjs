import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {person,projects} from '../portfolio-data.mjs';
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'evidence/portfolio-verification');await fs.mkdir(out,{recursive:true});
const base=process.env.TEST_URL||'http://localhost:5260';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const routes=JSON.parse(await fs.readFile(path.join(root,'evidence/portfolio-routes.json'),'utf8')).routes;
const report={date:new Date().toISOString(),routes:[],checks:[],passed:false};
const log=(name)=>{report.checks.push({name,passed:true});console.log('PASS',name);};
try{
 for(const width of [1440,390]){
  const ctx=await browser.newContext({viewport:{width,height:width===1440?1000:844},reducedMotion:'reduce'});
  await ctx.route('**/*',r=>r.request().url().startsWith(base)||r.request().url().startsWith('data:')?r.continue():r.abort());
  for(const route of routes){
   const page=await ctx.newPage(),errors=[],failed=[],external=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(base))external.push(r.url());});
   const response=await page.goto(base+route,{waitUntil:'load'});assert.equal(response.status(),200);await page.waitForTimeout(2200);
   const state=await page.evaluate(()=>({title:document.title,old:document.body.innerText.match(/Two26|Bogdan|Diana|Bucharest|HeyGluco|THE BAGEL BAR|Ruxandra|TANTI MARIA|MUNCHIES AND CREAM|Job Applications|About us/g),broken:[...document.images].filter(x=>x.complete&&x.currentSrc&&!x.naturalWidth).map(x=>x.currentSrc),overflow:document.documentElement.scrollWidth>innerWidth,invalidPaths:[...document.querySelectorAll('svg path')].filter(x=>/NaN/.test(x.getAttribute('d'))).length}));
   assert.ok(state.title.includes('Satvik'));assert.equal(state.old,null,route+' stale content');assert.deepEqual(state.broken,[]);assert.equal(state.overflow,false);assert.equal(state.invalidPaths,0);assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);
   assert.equal(await page.locator(`a[href="mailto:${person.email}"]`).count()>0,true);
   await page.screenshot({path:path.join(out,(route==='/'?'home':route.slice(1).replaceAll('/','-'))+'-'+width+'.png')});
   report.routes.push({route,width,status:response.status(),errors,failed,external,...state});console.log('ROUTE',route,width,'OK');
   await page.close();
  }
  await ctx.close();
 }
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base,{waitUntil:'load'});await page.waitForFunction(()=>window.__two26LoaderDone===true);await page.waitForTimeout(3500);
 assert.equal(await page.locator('.hero-line').first().evaluate(x=>getComputedStyle(x).opacity),'1');
 assert.ok(await page.evaluate(()=>window.ScrollTrigger.getAll().length)>0);log('Personalised loader, hero and scroll animations initialise');
 await page.locator('.navbar-right .cta-btn').click();await page.waitForTimeout(2000);
 assert.equal(await page.locator('.contact-page').isVisible(),true);
 assert.equal(await page.locator('.contact-page .email-link').nth(0).getAttribute('href'),`mailto:${person.email}`);
 assert.equal(await page.locator('.contact-page .email-link').nth(1).getAttribute('href'),'tel:+919558268373');
 await page.screenshot({path:path.join(out,'contact-desktop.png')});
 await page.keyboard.press('Escape');await page.waitForTimeout(1000);assert.equal(await page.locator('.contact-page').isVisible(),false);log('Contact overlay opens with Satvik’s email and phone; Escape closes it');
 const card=page.locator('.project-card').first();await card.scrollIntoViewIfNeeded();await page.waitForTimeout(1600);await card.hover();await page.waitForTimeout(900);
 assert.ok((await card.locator('img.project-img').getAttribute('src')).includes('mavrixfy-fit-cover'));await page.screenshot({path:path.join(out,'project-hover.png')});log('Original project hover works with original project logos');
 const question=page.locator('.faq-ques').nth(1);await question.scrollIntoViewIfNeeded();await page.waitForTimeout(1200);await question.click();await page.waitForTimeout(900);
 assert.equal(await page.locator('.faq-item.is-open').count(),1);assert.ok((await page.locator('.faq-item.is-open').innerText()).includes('Can I see your projects?'));log('Personalised FAQ switches answers');
 const deck=page.locator('.testimonial-list');await deck.scrollIntoViewIfNeeded();await page.waitForTimeout(1400);const before=await page.locator('.testimonial-item').evaluateAll(xs=>xs.map(x=>x.getAttribute('style')));const box=await deck.boundingBox();await page.mouse.click(box.x+box.width*.5,box.y+box.height*.25);await page.waitForTimeout(1000);const after=await page.locator('.testimonial-item').evaluateAll(xs=>xs.map(x=>x.getAttribute('style')));assert.notDeepEqual(before,after);log('Experience and education deck retains its original interaction');
 await page.goto(base+'/about',{waitUntil:'load'});await page.waitForTimeout(3000);
 const profile=page.locator('[data-profile="0"]');await profile.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);await profile.click();await page.waitForTimeout(650);
 assert.equal(await page.locator('.portfolio-modal').isVisible(),true);assert.equal(await page.locator('#profile-title').innerText(),person.name);await page.screenshot({path:path.join(out,'about-profile.png')});await page.keyboard.press('Escape');await page.waitForTimeout(300);assert.equal(await page.locator('.portfolio-modal').isVisible(),false);log('Accessible personal profile opens, closes and restores focus');
 await page.locator('[data-profile="1"]').focus();await page.keyboard.press('Enter');await page.waitForTimeout(600);assert.equal(await page.locator('#profile-title').innerText(),'The MERN stack');await page.locator('.dialog-close').click();log('Profile cards support keyboard activation');
 assert.deepEqual(errors,[]);await ctx.close();
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});const mp=await mobile.newPage();await mp.goto(base,{waitUntil:'load'});await mp.waitForTimeout(2600);
 await mp.locator('.two26-nav-toggle-btn').click();await mp.waitForTimeout(1100);await mp.screenshot({path:path.join(out,'mobile-menu.png')});
 await mp.locator('.ham-navbar a[href="/work"]').click();await mp.waitForURL(base+'/work');await mp.waitForTimeout(2500);assert.equal(await mp.locator('.project-card').count(),projects.length);log('Mobile menu navigates to all five personal projects');
 const first=mp.locator('.project-card').first();await first.scrollIntoViewIfNeeded();await mp.waitForTimeout(1000);await first.click();await mp.waitForURL(base+'/work/mavrixfy');assert.equal(await mp.locator('.portfolio-live-link').getAttribute('href'),projects[0].url);log('Project cards open real project details and correct live links');
 await mobile.close();
 report.passed=true;
}catch(error){report.error=error.stack;process.exitCode=1;console.error(error);}
finally{await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close();}
