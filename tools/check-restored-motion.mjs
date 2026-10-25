import fs from 'node:fs/promises';import * as cheerio from 'cheerio';import crypto from 'node:crypto';
const read=async path=>{const select=cheerio.load(await fs.readFile(path,'utf8'));return select('script:not([src])').map((i,e)=>select(e).html()||'').get();};
const original=await read('evidence/template/index.html'),current=await read('index.html');
const checks=['initTwo26HeroAnimation','initProjectCardHover','initServicesPathAnimation','initTestimonialsStack','initFaqAccordion','initTwo26FooterAnimation','initWorkLenis'].map(name=>{const a=original.find(s=>s.includes('function '+name+'('));const b=current.find(s=>s.includes('function '+name+'('));return{name,preserved:Boolean(a&&b&&a===b),sha256:b?crypto.createHash('sha256').update(b).digest('hex'):null};});
const loader=current.find(s=>s.includes('function initTwo26PageLoader('));
const sourceLoader=original.find(s=>s.includes('function initTwo26PageLoader('));
const normalizedLoader=loader?.replace('const letters = [letterT, letterO, letter2, letter6, paths[6]];','const letters = [letterT, letterO, letter2, letter6];').replaceAll('stagger: 0.075,','stagger: 0.1,');
checks.push({name:'Original loader timeline, lifecycle and wipes',preserved:Boolean(sourceLoader&&sourceLoader===normalizedLoader),branding:'SATVIK reads on one line with a handwritten A. Five pop-in glyphs use a 0.075s stagger to retain the original total timing.'});
await fs.writeFile('evidence/restored-motion-check.json',JSON.stringify(checks,null,2));console.log(checks);if(checks.some(c=>!c.preserved))process.exitCode=1;
