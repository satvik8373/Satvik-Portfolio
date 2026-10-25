import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import opentype from 'opentype.js';
import sharp from 'sharp';
import {person,projects,experience,services,faqs} from '../portfolio-data.mjs';
import {buildProjectArt} from './build-project-art.mjs';
import {personalizeLoader} from './loader-reveal.mjs';

const root=path.resolve(import.meta.dirname,'..');
const assetDir=path.join(root,'assets/portfolio');
await fs.mkdir(assetDir,{recursive:true});
// Encoding-only optimisation of the approved illustration; no crop or redraw.
await sharp(path.join(assetDir,'satvik-developer.png')).webp({lossless:true,effort:6}).toFile(path.join(assetDir,'satvik-developer-lossless.webp'));
const templateDir=path.join(root,'evidence/template');
const oldManifest=JSON.parse(await fs.readFile(path.join(root,'evidence/asset-manifest.json'),'utf8'));
for(const route of oldManifest.routes){
 const file=route==='/'?'index.html':route.slice(1)+'/index.html';
 try{await fs.access(path.join(templateDir,file));}catch{await fs.mkdir(path.dirname(path.join(templateDir,file)),{recursive:true});await fs.copyFile(path.join(root,file),path.join(templateDir,file));}
}
const fontBytes=await fs.readFile(path.join(root,'assets/fa2242828bf3-6aaad679fdb9d914f7f52052_MDNichromeTest-Dark.woff'));
const font=opentype.parse(fontBytes.buffer.slice(fontBytes.byteOffset,fontBytes.byteOffset+fontBytes.byteLength));
const loaderFontBytes=await fs.readFile(path.join(root,'assets/27a12bd3428e-6aaad679fdb9d914f7f52053_NeueMontreal-Regular.otf'));
const loaderFont=opentype.parse(loaderFontBytes.buffer.slice(loaderFontBytes.byteOffset,loaderFontBytes.byteOffset+loaderFontBytes.byteLength));
const glyphs=font.stringToGlyphs('SATVIK');
// Serialize screen-space coordinates directly; avoid the font package's SVG
// formatter flipping paths or producing NaN for floating-point line endpoints.
function pathData(p){const n=v=>String(Number(v.toFixed(3)));return p.commands.map(c=>c.type==='Z'?'Z':c.type==='C'?`C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`:c.type==='Q'?`Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`:`${c.type}${n(c.x)} ${n(c.y)}`).join('');}
function letters(size=100,x=0,y=100){let current=x;return glyphs.map(g=>{const p=pathData(g.getPath(current,y,size));current+=(g.advanceWidth/font.unitsPerEm)*size;return p;});}
const width=font.getAdvanceWidth('SATVIK',100);
const paths=letters();
const wordmark=(fill='#ff5400')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 24 ${width+12} 80" role="img" aria-label="Satvik Patel"><title>Satvik Patel</title>${paths.map(d=>`<path d="${d}" fill="${fill}"/>`).join('')}</svg>`;
await fs.writeFile(path.join(assetDir,'satvik-wordmark.svg'),wordmark());
await fs.writeFile(path.join(assetDir,'favicon.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="25" fill="#ff5400"/><path d="${pathData(font.getPath('S',23,77,78))}" fill="#fae3e2"/></svg>`);
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const b64=async(filename)=>`data:image/${filename.endsWith('.webp')?'webp':filename.endsWith('.svg')?'svg+xml':'png'};base64,${(await fs.readFile(path.join(assetDir,filename))).toString('base64')}`;
await buildProjectArt({assetDir,projects,b64});
await fs.writeFile(path.join(assetDir,'workbench-v2.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 510"><path d="M130 385C-10 270 120 135 210 228S470 520 690 365" fill="none" stroke="#ff5400" stroke-width="18" stroke-linecap="round"/><g transform="rotate(-5 425 270)"><rect x="200" y="160" width="460" height="270" rx="22" fill="#fae3e2" stroke="#111" stroke-width="5"/><rect x="220" y="180" width="420" height="225" rx="8" fill="#111"/><path d="M180 430H680L720 462Q450 500 140 462Z" fill="#ff5400" stroke="#111" stroke-width="5"/><text x="430" y="320" font-family="monospace" font-weight="bold" font-size="88" text-anchor="middle" fill="#ff5400">&lt; / &gt;</text></g>${(await Promise.all(projects.map(async(p,i)=>`<g transform="translate(${55+i*(projects.length>4?145:190)} ${i%2?25:60}) rotate(${i%2?8:-8} 75 75)"><rect width="140" height="135" rx="24" fill="#fff" stroke="#111" stroke-width="4"/><image href="${await b64(p.logo)}" x="25" y="20" width="90" height="90" preserveAspectRatio="xMidYMid meet"/></g>`))).join('')}</svg>`);
const template=async(file)=>cheerio.load(await fs.readFile(path.join(templateDir,file),'utf8'));
const cardSource=await template('index.html');
const cardHtml=cardSource('.project-item').first().toString();
function setImage($,el,src,alt=''){ $(el).attr({src,alt}).removeAttr('srcset sizes'); }
function fillCards($,container,list,more=false){
 const wrapper=$(container);if(!wrapper.length)return;
 wrapper.empty().attr('data-project-count',String(list.length));
 for(const p of list){
  const item=$(cardHtml);if(more)item.attr('class','more-works w-dyn-item');
  item.find('a.project-card').attr({'href':`/work/${p.slug}`,'aria-label':`${p.name} — ${p.category}`});
  setImage($,item.find('.project-img'),`/assets/portfolio/${p.slug}-fit-cover.svg`,`${p.name} original project logo`);
  setImage($,item.find('.project-img-hover'),`/assets/portfolio/${p.slug}-fit-hover.svg`,`${p.name} original project logo, hover presentation`);
  setImage($,item.find('.project-logo-img'),`/assets/portfolio/${p.logo}`,`${p.name} logo`);
  item.find('.project-name-text').text(p.name);item.find('.project-detail-text').text(p.category);
  item.find('.project-img-svg').css('color',p.color);
  wrapper.append(item);
 }
}
function common($,title,description,route){
 $('html').attr('data-portfolio','satvik');$('title').text(title);
 $('meta[name="description"]').attr('content',description);
 $('meta[property="og:title"],meta[name="twitter:title"]').attr('content',title);
 $('meta[property="og:description"],meta[name="twitter:description"]').attr('content',description);
 $('meta[property="og:image"]').attr('content','/assets/portfolio/satvik.jpg');
 $('meta[name="generator"]').remove();$('link[rel="icon"],link[rel="apple-touch-icon"]').remove();
 $('head').append('<link rel="icon" type="image/svg+xml" href="/assets/portfolio/favicon.svg"><meta name="theme-color" content="#fae3e2"><link rel="stylesheet" href="/portfolio.css"><link rel="preload" href="/assets/fa2242828bf3-6aaad679fdb9d914f7f52052_MDNichromeTest-Dark.woff" as="font" type="font/woff" crossorigin>');
 $('.logo-svg').each((i,e)=>$(e).html(wordmark($(e).closest('.contact-page').length?'#f8eee8':'#ff5400')));
 $('.navbar-logo,.navbar-logo-mobile').attr('aria-label','Satvik Patel — Home');
 $('.navbar-timing').html('Ahmedabad, India<br>Web & app developer');
 $('.back-btn-txt').filter((i,e)=>/work/i.test($(e).text())).text('Back to work');
 $('.footer-svg-logo').html(wordmark('#eceae5'));
 $('.footer-rights-text').text('© 2026 Satvik Patel');$('.footer-address').html('Ahmedabad,<br>Gujarat, India');
 $('.footer-link-header').filter((i,e)=>$(e).text()==='Email us').text('Email me');
 $('.footer-heading').text('Got an idea? Let’s make it click.');
 $('.footer-top-right-btm .footer-links-block').html('<span class="footer-signoff">Built with curiosity.<br>And a little caffeine.</span>');
 $('a[href="/about"]').each((i,e)=>{if($(e).hasClass('footer-link'))$(e).text('About me');else $(e).find('.navbar-btn-text,.nav-text,.nav-btn-text').text('About me');});
 // Only change human-visible text nodes, leaving motion code and SVG drawing intact.
 $('body *').contents().filter((i,e)=>e.type==='text'&&!['script','style'].includes(e.parent?.name)).each((i,e)=>{
  e.data=e.data.replaceAll('About us','About me').replaceAll('Email us','Email me').replaceAll('bogdan@two26.studio',person.email).replaceAll('diana@two26.studio',person.email);
 });
 $('a[href^="mailto:"]').attr('href',`mailto:${person.email}`);
 $('.contact-email-wrap').eq(0).find('.email-heading').text('Projects & opportunities');
 $('.contact-email-wrap').eq(0).find('.email-link').text(person.email).attr('href',`mailto:${person.email}`);
 $('.contact-email-wrap').eq(1).find('.email-heading').text('Call me');
 $('.contact-email-wrap').eq(1).find('.email-link').text(person.phone).attr('href','tel:+919558268373');
 $('a[href*="linkedin.com"]').attr({href:person.linkedin,rel:'noopener noreferrer'});
 $('a[href*="instagram.com"],a[href*="behance.net"]').each((i,e)=>{
  const a=$(e);a.attr({href:person.github,rel:'noopener noreferrer','aria-label':'Satvik on GitHub'});
  a.find('.contact-social-link,.footer-link').text('GitHub');
  if(a.hasClass('contact-social')) a.find('.icon').html('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.8-1.6 6.8-7.3a5.6 5.6 0 0 0-1.5-4 5 5 0 0 0-.1-4S17 0 14 1.5a14 14 0 0 0-7 0C4 0 2.8 1 2.8 1a5 5 0 0 0-.1 4 5.6 5.6 0 0 0-1.5 4c0 5.7 3.5 6.9 6.8 7.3A3.5 3.5 0 0 0 7 19v3" transform="translate(2 1) scale(.85)"/></svg>');
 });
 $('.footer .socials').html(`<a class="social-link" href="${person.github}" target="_blank" rel="noopener noreferrer"><span class="footer-link">GitHub</span><span aria-hidden="true">↗</span></a><a class="social-link" href="${person.linkedin}" target="_blank" rel="noopener noreferrer"><span class="footer-link">LinkedIn</span><span aria-hidden="true">↗</span></a>`);
 // Personal lettering within the original stacked composition and timeline.
 $('.loader').attr({role:'status','aria-label':'Loading Satvik Patel’s portfolio'});
 personalizeLoader($,loaderFont,pathData);
 $('script').each((i,e)=>{
  let s=$(e).html()||'';
  if(s.includes('function initTwo26PageLoader(')){
   s=s.replace('const letters = [letterT, letterO, letter2, letter6];','const letters = [letterT, letterO, letter2, letter6, paths[6]];').replaceAll('stagger: 0.1,','stagger: 0.075,');
  }
  if(s.includes('TEAM_DATA')&&s.includes('team-popup-overlay')){$(e).remove();return;}
  $(e).html(s);
 });
 $('script[type="text/x-wf-template"]').remove();
 setImage($,$('.contact-img'),'/assets/portfolio/satvik-developer.png','Satvik at his desk, illustrated');
 $('.project-logo-img').css('object-fit','contain');
 $('body').append('<script type="module" src="/portfolio.js"></script>');
 $('body').attr('data-portfolio-page',route);
}
const home=await template('index.html');
common(home,'Satvik Patel | Full Stack Developer','Satvik Patel — full stack MERN developer in Ahmedabad. Web applications, mobile experiences and thoughtful interfaces.','home');
home('.hero-text h1').html('GOOD IDEAS.<br>GREAT CODE.');
home('.hero-pill.two .hero-pill-text').text('Satvik Patel');home('.hero-pill.one .hero-pill-text').text('Full stack developer');home('.hero-pill.three .hero-pill-text').text('Made in Ahmedabad');
home('.hero-video-loop').html('<div class="portfolio-hero-art"><img src="/assets/portfolio/satvik-developer.png" alt="Illustrated Satvik coding at his desk" fetchpriority="high" width="1536" height="1024"><span class="code-sticker">&lt; ideas into interfaces /&gt;</span><span class="hero-spark spark-one">✳</span><span class="hero-spark spark-two">✳</span></div>');
home('.hero-marquee-tp tspan').text('A LITTLE DESIGN. A LOT OF DEVELOPMENT. • BUILT TO CLICK. • ');
home('.about-text').text('A BIT ABOUT ME');home('.about-para').text(person.bio);
home('.about-pill.first .hero-pill-text').text('React to the rescue');home('.about-pill.second .hero-pill-text').text('Curious by default');home('.about-pill.third .hero-pill-text').text('Details matter');
home('.showcase-slide').each((i,e)=>{const p=projects[i%projects.length];home(e).removeClass('w-background-video w-background-video-atom').removeAttr('data-video-urls data-poster-url data-autoplay data-loop data-wf-ignore').html(`<img class="showcase-slide-img" loading="lazy" src="/assets/portfolio/${p.slug}-fit-wide.svg" alt="${escape(p.name)}">`);});
fillCards(home,'.projects-list',projects);
home('.section-projects .section-about-text').text('Selected projects');home('.projects-end-para').text('FIVE DIFFERENT CHALLENGES. ONE VERY CURIOUS DEVELOPER.');
home('.projects-pill-first .hero-pill-text').text('Web & mobile');home('.projects-pill-second .hero-pill-text').text('Built with React');home('.projects-pill-fourth .hero-pill-text').text('Have a look');
home('.section-services .section-about-text').text('What I work with');home('.section-services .section-heading').text('THIS IS MY THING');
home('.service-layer').each((i,e)=>{const s=services[i];if(!s)return;home(e).find('.service-text').eq(0).text(s[0]);home(e).find('.service-text').eq(1).text(s[1]);home(e).find('.service-block-para').text(s[2]);});
home('.section-testimonials .section-about-text').text('Experience & education');home('.section-testimonials .section-heading').text('A FEW STEPS SO FAR');
home('.testimonial-item').each((i,e)=>{const x=experience[i];home(e).find('.testimonial-heading').text(x.title);home(e).find('.testimonial-pfp-name').text(x.company);home(e).find('.testimonial-pfp-designation').html(`${escape(x.role)}<br>${escape(x.period)}`);home(e).find('.testimonial-card-para').text(x.description);home(e).find('.testimonial-img-wrap').html(`<span class="experience-mark">0${i+1}</span>`);});
home('.faq-item').each((i,e)=>{const f=faqs[i];if(!f){home(e).remove();return;}home(e).find('.faq-ques').text(f[0]);home(e).find('.faq-answer').text(f[1]);});
home('.section-projects').attr('id','selected-work');home('.section-testimonials').attr('id','experience');

const about=await template('about/index.html');common(about,'About Satvik | Developer, builder, curious human','Get to know Satvik Patel: MERN developer, React and React Native builder, based in Ahmedabad, Gujarat.','about');
about('.section-about-hero h1').eq(0).text('ONE DEVELOPER,');about('.section-about-hero h1').eq(1).text('MANY POSSIBILITIES.');
about('.work-hero-pill.one .hero-pill-text').text('Satvik Patel');about('.work-hero-pill.two .hero-pill-text').text('Code & curiosity');
about('.about-hero-para').text('I’m Satvik, a full stack MERN developer in Ahmedabad. I build web and mobile experiences with React, Node.js and a healthy attention to detail.');
setImage(about,about('.about-hero-img'),'/assets/portfolio/satvik-developer.png','Satvik, illustrated at his desk');
about('.about-story-section').each((i,e)=>{about(e).find('.about-story-text').text(i?'WHAT KEEPS ME GOING':'HOW I GOT HERE');about(e).find('.about-story-heading').text(i?'From the interface to the API.':'A curious mind. A builder at heart.');about(e).find('.about-story-para').text(i?'My work spans React.js frontends, Node.js and Express APIs, MongoDB and MySQL databases, and React Native mobile workflows. I like connecting the pieces into something people can actually use.':'I completed my B.Sc. in Information Technology at Ganpat University and am continuing with a master’s in IT. Along the way, I’ve built applications, trained in React.js at TOPS Technologies and worked on real interfaces and integrations through internships.');setImage(about,about(e).find('.about-story-img'),i?'/assets/portfolio/subtrack-fit-cover.svg':'/assets/portfolio/satvik.jpg',i?'SubTrack project artwork':'Satvik Patel');});
about('.about-team .section-about-text').text('THE PERSON. THE TOOLS. THE CURIOSITY.');about('.about-team .section-heading').text('A LITTLE MORE ABOUT ME');
const profiles=[['Satvik Patel','Full Stack MERN Developer','satvik.jpg'],['The MERN stack','My everyday building blocks','mavrixfy-fit-wide.svg'],['Always learning','Web, mobile & what comes next','satvik-developer.png']];
about('.team-card').each((i,e)=>{const x=profiles[i];if(!x){about(e).remove();return;}about(e).attr({role:'button',tabindex:'0','data-profile':String(i),'aria-label':`Read about ${x[0]}`});about(e).find('.team-name').text(x[0]);about(e).find('.team-sub').text(x[1]);setImage(about,about(e).find('.team-img'),'/assets/portfolio/'+x[2],x[0]);});
about('.section-moodboard .section-about-text').text('FROM THE WORKBENCH');about('.section-moodboard .section-heading').text('Behind the code');
about('.moodboard-img').each((i,e)=>{const p=projects[i%projects.length];setImage(about,e,`/assets/portfolio/${p.slug}-fit-wide.svg`,p.name);});
const values=[['MAKE IT USEFUL','A beautiful interface should do something useful. I start with the user’s task and build the experience around it.'],['GET THE DETAILS RIGHT','Responsive layouts, clear states, thoughtful interactions. The little things add up to how an application feels.'],['CONNECT THE PIECES','The frontend, API and database should work as one experience. I care about what happens behind the screen, too.'],['KEEP LEARNING','There is always another tool to understand, a better pattern to try and something new to build. Curiosity is part of the process.']];
about('.section-values-wrapper > .section-about-text').text('HOW I LIKE TO BUILD');about('.section-values').find('*').contents().filter((i,e)=>e.type==='text'&&e.data.includes('The Office Rules')).each((i,e)=>{e.data='How I like to build';});
about('.value-card').each((i,e)=>{about(e).find('.value-heading').text(values[i][0]);about(e).find('.value-para').text(values[i][1]);});
about('.section-what-we-do .section-about-text').text('TOOLS & TECHNOLOGIES');about('.section-what-we-do .section-heading').text('MY EVERYDAY TOOLKIT');
const tools=['React.js','JavaScript','Node.js','Express.js','MongoDB','React Native','Next.js','Tailwind CSS','MySQL','Firebase','Git & GitHub','Vercel','Render','Postman','Expo','Flutter'];
const pill=about('.do-cms--pill').first().toString();about('.do-cms-list').empty();tools.forEach(t=>{const p=about(pill);p.find('.do-pill-text').text(t);about('.do-cms-list').append(p);});

const work=await template('work/index.html');common(work,'Selected Work | Satvik Patel','Explore Mavrixfy, SubTrack, Pranshi Multiplast, Suryoday Fortune and BioLinks — selected development projects by Satvik Patel.','work');
work('.section-work-hero h1').eq(0).text('LESS TALK,');work('.section-work-hero h1').eq(1).text('MORE BUILDING.');work('.work-hero-para').text('Music platforms, finance dashboards and business websites. Different ideas, brought to life with code. Here’s a selection of what I’ve been building.');
work('.work-hero-pill.one .hero-pill-text').text('Selected work');work('.work-hero-pill.two .hero-pill-text').text('Made to work');work('.section-projects-work').remove();fillCards(work,'.projects-list',projects);
setImage(work,work('.cat-work-img'),'/assets/portfolio/workbench-v2.svg','Five projects, one developer’s workbench');
work('.section-projects .section-about-text').text('FIVE PROJECTS. PLENTY OF CURIOSITY.');work('.section-projects .section-heading').text('Selected Works');

const outputs=[['index.html',home],['about/index.html',about],['work/index.html',work]];
for(const p of projects){
 const $=await template('work/heygluco/index.html');common($,`${p.name} | Satvik Patel`,p.summary,'project');
 $('.project-page-heading').text(p.name);$('.section-project-hero').attr('data-project',p.slug);
 setImage($,$('.project-cover-img'),`/assets/portfolio/${p.slug}-fit-wide.svg`,`${p.name} — ${p.category}`);
 $('.section-project-content').html(`<div class="portfolio-case-intro"><div class="case-sidebar"><span class="case-eyebrow">${escape(p.category)}</span><span>${escape(p.stack)}</span>${p.url?`<a class="portfolio-live-link" href="${p.url}" target="_blank" rel="noopener noreferrer">Visit live site <span>↗</span></a>`:'<span class="private-project">Project overview</span>'}</div><div class="case-narrative"><h2>${escape(p.tagline)}</h2><p>${escape(p.summary)}</p><div class="case-copy-grid"><div><h3>The idea</h3><p>${escape(p.context)}</p></div><div><h3>The approach</h3><p>${escape(p.approach)}</p></div></div><div class="case-tags">${p.features.map(f=>`<span>${escape(f)}</span>`).join('')}</div></div></div><div class="case-gallery">${p.siteImage?`<figure><img src="/assets/portfolio/${p.siteImage}" alt="${escape(p.name)} live website screenshot" loading="lazy"><figcaption>A look at the live website.</figcaption></figure>`:`<div class="case-feature-panel"><span>THE BUILDING BLOCKS</span><h2>${escape(p.stack)}</h2><p>${escape(p.features.join(' · '))}</p></div>`}</div>`);
 fillCards($,'.more-works-list',projects.filter(x=>x.slug!==p.slug),true);
 $('.section-projects .section-about-text').text('KEEP EXPLORING');
 outputs.push([`work/${p.slug}/index.html`,$]);
}
for(const [file,$] of outputs){
 $('img[src*="-fit-"]').not('.project-img-hover').each((i,e)=>{
  const src=$(e).attr('src'),p=projects.find(x=>src.includes(`/${x.slug}-fit-`));if(!p)return;
  const frame=$(e).parent();if(frame.find('> .portfolio-art-copy').length)return;
  frame.addClass('portfolio-art-frame').css({'--art-ink':p.ink,'--art-hover-ink':p.color});
  frame.append(`<span class="portfolio-art-copy"><span class="portfolio-art-top"><span>SATVIK PATEL / SELECTED WORK</span><span>${String(projects.indexOf(p)+1).padStart(2,'0')}</span></span><span class="portfolio-art-bottom"><span class="portfolio-art-title">${escape(p.name.toUpperCase())}</span><span class="portfolio-art-category">${escape(p.category)}</span><span class="portfolio-art-stack">${escape(p.stack)}</span></span></span>`);
 });
 await fs.mkdir(path.dirname(path.join(root,file)),{recursive:true});
 const html=$.html().replaceAll('/assets/portfolio/satvik-developer.png','/assets/portfolio/satvik-developer-lossless.webp').replace(/-fit-(cover|hover|wide)\.svg/g,'-fit-$1.svg?v=text2');
 await fs.writeFile(path.join(root,file),html);
}
// Keep any previously shared case-study URLs useful, without showing someone else’s work.
const oldSlugs=['heygluco','bagel-bar','tanti-maria','munchies-and-cream','mvp','yum-yum','merci','lpi'];
for(const slug of oldSlugs){const target='/work';await fs.writeFile(path.join(root,`work/${slug}/index.html`),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><title>Selected Work | Satvik Patel</title></head><body><a href="${target}">Explore Satvik’s projects</a></body></html>`);}
await fs.writeFile(path.join(root,'evidence/portfolio-routes.json'),JSON.stringify({name:person.name,routes:['/','/about','/work',...projects.map(p=>'/work/'+p.slug)],sourceFolder:'E:\\satvik potfolio',generatedIllustration:'/assets/portfolio/satvik-developer.png'},null,2));
console.log('Built Satvik portfolio:',outputs.length,'pages,',projects.length,'projects.');
