import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {projects} from '../portfolio-data.mjs';

const out='evidence/fitted-art-verification';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1100,height:800},reducedMotion:'reduce'});
const results=[];
try{
 for(const p of projects)for(const variant of ['cover','hover','wide']){
  const svg=await fs.readFile(`assets/portfolio/${p.slug}-fit-${variant}.svg`,'utf8');
  assert.ok(!svg.includes('<text'),`${p.name} ${variant}: cropped artwork must not contain text`);
 }
 for(const width of [320,390,768,1440])for(const route of ['/','/work','/about','/work/biolinks']){
  await page.setViewportSize({width,height:900});
  await page.goto(`http://localhost:5260${route}`,{waitUntil:'load'});
  await page.evaluate(()=>document.fonts.ready);
  const check=await page.evaluate(()=>{
   let labels=0;const errors=[];
   for(const copy of document.querySelectorAll('.portfolio-art-copy')){
    const frame=copy.parentElement.getBoundingClientRect();
    for(const text of copy.querySelectorAll('span:not(:has(span))')){
     const r=text.getBoundingClientRect();labels++;
     if(r.left<frame.left-1||r.right>frame.right+1||r.top<frame.top-1||r.bottom>frame.bottom+1||text.scrollWidth>text.clientWidth+1)errors.push(text.textContent);
    }
   }
   return {labels,errors};
  });
  assert.ok(check.labels>0);assert.deepEqual(check.errors,[],`${route} ${width}px`);
  results.push({route,width,...check});
  if(route==='/'&&width===1440){
   await page.waitForTimeout(2500);
   const slide=await page.locator('.showcase-slide').first().evaluate(el=>el.outerHTML);
   const preview=await browser.newPage({viewport:{width:520,height:520}});
   const css=await fs.readFile('portfolio.css','utf8');
   await preview.setContent(`<base href="http://localhost:5260/"><style>${css}body{margin:0}.showcase-slide{width:520px;height:520px;overflow:hidden;border-radius:12px}.showcase-slide img{width:100%;height:100%;object-fit:cover}</style>${slide}`);
   await preview.locator('img').evaluate(e=>e.decode());
   await preview.screenshot({path:`${out}/carousel-square.png`});await preview.close();
  }
 }
 await fs.writeFile(`${out}/report.json`,JSON.stringify({passed:true,checks:results},null,2));
 console.log({passed:true,textLayouts:results.length});
}finally{await browser.close();}
