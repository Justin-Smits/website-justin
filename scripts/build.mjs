import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildFiles} from '../assets/blog-engine.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFile(resolve(root,p),'utf8');
const files=buildFiles(JSON.parse(await read('data/posts.json')),await read('sitemap.xml'),await read('index.html'));
for(const [path,contents]of Object.entries(files)){await mkdir(dirname(resolve(root,path)),{recursive:true});await writeFile(resolve(root,path),contents);}
console.log(`${Object.keys(files).length} blogbestanden gegenereerd. Geen installatie of bundler nodig.`);
