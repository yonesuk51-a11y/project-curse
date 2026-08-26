import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const toolDir=path.dirname(fileURLToPath(import.meta.url));
const v6Dir=path.resolve(toolDir,'..');
const repoDir=path.resolve(v6Dir,'..');
const failures=[];
const passes=[];

const assert=(condition,label)=>{
  if(condition) passes.push(label);
  else failures.push(label);
};

const walk=directory=>fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
  const target=path.join(directory,entry.name);
  return entry.isDirectory()?walk(target):[target];
});

const runtimeFiles=walk(v6Dir).filter(file=>/\.(?:html|css|js)$/.test(file));
const jsFiles=runtimeFiles.filter(file=>file.endsWith('.js'));
const runtimeText=runtimeFiles.map(file=>fs.readFileSync(file,'utf8')).join('\n');
const indexText=fs.readFileSync(path.join(v6Dir,'index.html'),'utf8');
const dataPath=path.join(v6Dir,'assets','js','data.js');
const dataText=fs.readFileSync(dataPath,'utf8');
const cssText=fs.readFileSync(path.join(v6Dir,'assets','css','foundation.css'),'utf8');

assert(runtimeFiles.length>=9,`runtime files found (${runtimeFiles.length})`);
assert(!runtimeText.includes('assets/js/main.js'),'legacy main.js is not loaded by V6 runtime');
assert(!runtimeText.includes('assets/css/style.css'),'legacy style.css is not loaded by V6 runtime');
assert(!/<(?:audio|video|iframe)\b/i.test(runtimeText),'no automatic audio, video, or iframe surface');
assert(indexText.includes('type="module"'),'V6 entry uses ES modules');
assert(indexText.includes('data-boot-skip'),'boot sequence has an explicit skip control');
assert(runtimeText.includes('STAGED RECONSTRUCTION'),'staged record presentation is labelled');
assert(runtimeText.includes('TEXT INTEGRITY'),'record integrity axis is visible');
assert(runtimeText.includes('SOURCE PROVENANCE'),'record provenance axis is visible');
assert(runtimeText.includes('prefers-reduced-motion'),'reduced-motion path exists');
assert(!runtimeText.includes('nhc-squad-group-photo-candidate'),'unselected N.H.C candidates are absent');
assert(!runtimeText.includes('project-curse-world-keyart-concept'),'unselected key art is absent');
assert(!runtimeText.includes('project-curse-unnamed-swordsman'),'unselected character candidates are absent');

for(const file of jsFiles){
  const source=fs.readFileSync(file,'utf8');
  for(const match of source.matchAll(/(?:import\s+(?:[^'";]+?\s+from\s+)?|import\s*\()['"]([^'"]+)['"]/g)){
    const specifier=match[1];
    if(!specifier.startsWith('.')) continue;
    const target=path.resolve(path.dirname(file),specifier);
    assert(fs.existsSync(target),`module import exists: ${path.relative(v6Dir,target)}`);
  }
}

for(const match of indexText.matchAll(/(?:src|href)="([^"#]+)"/g)){
  const reference=match[1].split('?')[0];
  if(/^(?:https?:|mailto:)/.test(reference)) continue;
  const target=path.resolve(v6Dir,reference);
  assert(fs.existsSync(target),`entry asset exists: ${reference}`);
}

for(const match of dataText.matchAll(/(?:cover|original|image):'([^']+)'/g)){
  const reference=match[1];
  const target=path.resolve(v6Dir,reference);
  assert(fs.existsSync(target),`record asset exists: ${reference}`);
}

const data=await import(`${pathToFileURL(dataPath).href}?verify=${Date.now()}`);
assert(data.FACTION_MARKS.length===17,'all 17 faction form studies are registered');
assert(new Set(data.FACTION_MARKS.map(item=>item.id)).size===17,'faction mark IDs are unique');
assert(data.FACTION_MARKS.every(item=>cssText.includes(`[data-mark="${item.id}"]`)),'all 17 faction marks have code-native silhouettes');
assert(data.IMMORTALITY_ACTS.length===4,'Immortality reconstruction has four acts');
assert(data.IMMORTALITY_ACTS.every(item=>item.sourceRef),'every Immortality act cites protected-record times');
assert(data.CULT_INDEX.every(item=>item.sourceRef),'every Cults study cites a protected-record page');
assert(data.WORLD_FOUNDATION.lossDoctrine.length===5,'five-part loss doctrine is registered');
assert(data.CORE_TERMS.length===6,'six core anomaly terms are registered');
assert(data.V6_ERAS.length===6,'1975–2042 history is grouped into six eras');

if(failures.length){
  console.error(`V6 verification failed: ${failures.length}`);
  failures.forEach(item=>console.error(`  FAIL ${item}`));
  process.exitCode=1;
}else{
  console.log(`V6 verification passed: ${passes.length}/${passes.length}`);
  console.log(`  runtime files: ${runtimeFiles.length}`);
  console.log(`  JS modules: ${jsFiles.length}`);
  console.log(`  faction marks: ${data.FACTION_MARKS.length}`);
  console.log(`  protected reconstructions: ${Object.keys(data.ARCHIVE_RECORDS).length}`);
}
