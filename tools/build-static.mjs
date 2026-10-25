import fs from 'node:fs/promises';
import path from 'node:path';
import {collectStaticFiles} from './static-files.mjs';

const root=path.resolve(import.meta.dirname,'..');
const output=path.resolve(root,'dist');
if(path.dirname(output)!==root||path.basename(output)!=='dist')throw new Error('Unexpected build output');
const files=await collectStaticFiles(root);
await fs.rm(output,{recursive:true,force:true});
for(const file of files){
 const destination=path.join(output,file);
 await fs.mkdir(path.dirname(destination),{recursive:true});
 await fs.copyFile(path.join(root,file),destination);
}
console.log(`Packaged ${files.length} runtime files in dist/`);
