import {person} from './portfolio-data.mjs';
function initPortfolio(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const illustration=document.querySelector('.portfolio-hero-art img');
 function animateHero(){
  if(!illustration||!window.gsap||reduced)return;
  gsap.from(illustration,{opacity:0,y:50,rotation:-3,duration:1.2,ease:'back.out(1.2)'});
  gsap.to(illustration,{y:-7,rotation:.5,duration:3,delay:1.2,ease:'sine.inOut',repeat:-1,yoyo:true});
  gsap.to('.hero-spark',{rotation:100,duration:15,ease:'none',repeat:-1});
 }
 if(window.__two26LoaderDone)animateHero();else document.addEventListener('two26:loaderComplete',animateHero,{once:true});
 const profiles=[
  {title:person.name,subtitle:person.role,image:'satvik.jpg',text:person.bio,tags:['Ahmedabad, Gujarat','Web & mobile','English · Hindi · Gujarati']},
  {title:'The MERN stack',subtitle:'From the first pixel to the database.',image:'mavrixfy-fit-wide.svg',text:'My everyday tools include React.js, Node.js, Express.js and MongoDB. I also work with Next.js, Tailwind CSS, MySQL and Firebase, connecting responsive interfaces to useful data.',tags:['React.js','Node.js','Express.js','MongoDB','REST APIs']},
  {title:'Always learning',subtitle:'Curiosity is part of the process.',image:'satvik-developer-lossless.webp',text:'I’m pursuing a master’s in Information Technology at Ganpat University. My toolkit also includes React Native, Expo and Flutter workflows, plus AI-assisted development tools such as Codex, Claude and Cursor.',tags:['React Native','Expo','Flutter','Git & GitHub','AI-assisted workflows']},
 ];
 let opener;
 const dialog=document.createElement('dialog');dialog.className='portfolio-modal';dialog.setAttribute('data-lenis-prevent','');dialog.setAttribute('aria-labelledby','profile-title');document.body.append(dialog);
 function close(){dialog.close();}
 function open(index,trigger){
  const data=profiles[index];if(!data)return;opener=trigger;
  dialog.innerHTML=`<button class="dialog-close" type="button" aria-label="Close profile">×</button><div class="profile-grid"><img class="profile-image" src="/assets/portfolio/${data.image}" alt="${data.title}"><div class="profile-copy"><h2 id="profile-title">${data.title}</h2><p><strong>${data.subtitle}</strong></p><p>${data.text}</p><div class="profile-tags">${data.tags.map(t=>`<span>${t}</span>`).join('')}</div><div class="profile-links"><a href="${person.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${person.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></div></div></div>`;
  dialog.querySelector('.dialog-close').addEventListener('click',close);dialog.showModal();window.lenis?.stop();
  if(window.gsap&&!reduced)gsap.fromTo(dialog,{opacity:0,y:25,scale:.95},{opacity:1,y:0,scale:1,duration:.45,ease:'back.out(1.25)'});
 }
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
 dialog.addEventListener('close',()=>{window.lenis?.start();opener?.focus({preventScroll:true});});
 document.querySelectorAll('[data-profile]').forEach(card=>{card.addEventListener('click',()=>open(Number(card.dataset.profile),card));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(Number(card.dataset.profile),card);}});});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initPortfolio);else initPortfolio();
