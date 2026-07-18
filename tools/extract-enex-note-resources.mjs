#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {basename,extname,join} from 'node:path';

const [,,sourcePath,noteTitle,outputDirectory]=process.argv;
if(!sourcePath||!noteTitle||!outputDirectory){
  console.error('Usage: node extract-enex-note-resources.mjs <source.enex> <note-title> <output-directory>');
  process.exit(1);
}

const source=readFileSync(sourcePath,'utf8');
const note=source.split('<note>').slice(1).map(chunk=>`<note>${chunk.split('</note>')[0]}</note>`).find(chunk=>chunk.includes(`<title>${noteTitle}</title>`));
if(!note){
  console.error(`Note not found: ${noteTitle}`);
  process.exit(1);
}

mkdirSync(outputDirectory,{recursive:true});
const resourcePattern=/<resource>\s*<data encoding="base64">([\s\S]*?)<\/data>\s*<mime>([^<]+)<\/mime>[\s\S]*?<resource-attributes>[\s\S]*?<file-name>([^<]+)<\/file-name>[\s\S]*?<\/resource-attributes>\s*<\/resource>/g;
const exported=[];
for(const match of note.matchAll(resourcePattern)){
  const bytes=Buffer.from(match[1].replace(/\s+/g,''),'base64');
  const hash=createHash('md5').update(bytes).digest('hex');
  const originalName=match[3].replace(/&amp;/g,'&');
  const mimeExtension=match[2]==='image/png'?'.png':match[2]==='image/jpeg'?'.jpg':'';
  const extension=extname(originalName)||mimeExtension;
  const outputName=`${hash}${extension.toLowerCase()}`;
  writeFileSync(join(outputDirectory,outputName),bytes);
  exported.push({hash,file:outputName,original:basename(originalName),mime:match[2],bytes:bytes.length});
}

console.log(JSON.stringify({title:noteTitle,count:exported.length,files:exported},null,2));
