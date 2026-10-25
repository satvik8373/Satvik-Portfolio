import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

export async function buildProjectArt({assetDir,projects}){
 const reference=projects.find(p=>p.slug==='mavrixfy');
 const manifest=[];
 for(const p of projects){
  const primary=p.logo;
  const source=path.join(assetDir,primary);
  const sourceBytes=await fs.readFile(source);
  // Keep the original artwork as the source; only its text layout adapts to
  // each rendered frame, independently of the cropped background and logo.
  for(const variant of ['cover','hover','wide']){
   const target=path.join(assetDir,`${p.slug}-${variant}.svg`);
   if(p.slug==='biolinks'){
    const template=await fs.readFile(path.join(assetDir,`${reference.slug}-${variant}.svg`),'utf8');
    const restored=template
     .replace(/data:image\/[^;]+;base64,[^"]+/,`data:image/svg+xml;base64,${sourceBytes.toString('base64')}`)
     .replaceAll(reference.color,p.color).replaceAll(reference.ink,p.ink)
     .replaceAll('MAVRIXFY','BIOLINKS').replaceAll(reference.category,p.category)
     .replaceAll(reference.stack,p.stack).replace('>01</text>','>05</text>');
    await fs.writeFile(target,restored);
   }else{await fs.access(target);}
   const original=await fs.readFile(target,'utf8');
   // Text is laid out as responsive HTML over the frame, not baked into an
   // image that object-fit and the brush mask intentionally crop.
   const fitted=original.replace(/<g\b[^>]*>[\s\S]*?<\/g>/,'');
   await fs.writeFile(path.join(assetDir,`${p.slug}-fit-${variant}.svg`),fitted);
  }
  manifest.push({project:p.name,source:`assets/portfolio/${primary}`,sha256:crypto.createHash('sha256').update(sourceBytes).digest('hex'),usage:'Original artwork with responsive inset text; background/logo keep their original proportions.'});
 }
 await fs.writeFile(path.resolve(assetDir,'../../evidence/project-art-manifest.json'),JSON.stringify(manifest,null,2));
}
