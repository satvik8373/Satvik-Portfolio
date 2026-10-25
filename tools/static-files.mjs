import fs from 'node:fs/promises';
import path from 'node:path';

export async function collectStaticFiles(root){
 const queue=['index.html','portfolio.css','portfolio.js','portfolio-data.mjs'];
 async function pages(directory){
  for(const item of await fs.readdir(path.join(root,directory),{withFileTypes:true})){
   const relative=path.posix.join(directory,item.name);
   if(item.isDirectory())await pages(relative);
   else if(item.name.endsWith('.html'))queue.push(relative);
  }
 }
 await pages('about');await pages('work');
 const included=new Set();
 for(let i=0;i<queue.length;i++){
  const relative=queue[i];if(included.has(relative))continue;
  const absolute=path.resolve(root,relative);
  if(!absolute.startsWith(root+path.sep))throw new Error(`Asset outside project: ${relative}`);
  const stat=await fs.stat(absolute);if(!stat.isFile())continue;
  included.add(relative);
  if(!/\.(?:html|css|js|mjs|svg)$/.test(relative))continue;
  const source=await fs.readFile(absolute,'utf8');
  const refs=[...source.matchAll(/\/assets\/[^\s"'`<>\\)${}]+/g)].map(m=>m[0]);
  if(relative.endsWith('.css'))refs.push(...[...source.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)].map(m=>m[1]));
  for(const ref of refs){
   if(/^(?:https?:|data:|#)/.test(ref)||ref.endsWith('/'))continue;
   const url=new URL(ref,'https://portfolio.local/'+relative);
   const file=decodeURIComponent(url.pathname).slice(1);
   if(!included.has(file))queue.push(file);
  }
 }
 return [...included].sort();
}
