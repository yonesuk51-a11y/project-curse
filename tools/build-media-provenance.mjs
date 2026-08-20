#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync,readFileSync,readdirSync,statSync,writeFileSync} from 'node:fs';
import {basename,extname,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=fileURLToPath(new URL('../',import.meta.url));
const TARGET='assets/js/data/media-provenance-data.js';
const OVERRIDES='assets/resources/MEDIA_PROVENANCE_OVERRIDES.json';
const MEDIA_EXTENSIONS=new Set(['.png','.jpg','.jpeg','.webp','.gif','.svg','.mp3','.wav','.ogg','.mp4','.webm']);
const TEXT_EXTENSIONS=new Set(['.js','.mjs','.css','.html','.md','.json']);
const overrides=JSON.parse(readFileSync(resolve(ROOT,OVERRIDES),'utf8'));
const referenceOnly=Object.freeze(overrides.referenceOnly||[]);

const walk=(directory,predicate)=>readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
  if(entry.name==='.git'||entry.name==='node_modules') return [];
  const absolute=resolve(directory,entry.name);
  if(entry.isDirectory()) return walk(absolute,predicate);
  return predicate(absolute)?[absolute]:[];
});
const normalized=absolute=>relative(ROOT,absolute).replace(/\\/g,'/');
const mediaFiles=walk(resolve(ROOT,'assets'),absolute=>MEDIA_EXTENSIONS.has(extname(absolute).toLowerCase())).sort((a,b)=>normalized(a).localeCompare(normalized(b)));
const repositoryFiles=walk(ROOT,()=>true).map(normalized);
const textFiles=walk(ROOT,absolute=>TEXT_EXTENSIONS.has(extname(absolute).toLowerCase())&&normalized(absolute)!==TARGET).map(absolute=>({path:normalized(absolute),text:readFileSync(absolute,'utf8')}));
const mediaPaths=mediaFiles.map(normalized);
const mediaSet=new Set(mediaPaths);
const staleOverrides=Object.keys(overrides.assets||{}).filter(path=>!mediaSet.has(path));
const exposedReferenceFiles=repositoryFiles.filter(path=>referenceOnly.some(item=>basename(path)===item.name));

function responsiveParent(path){
  if(!path.startsWith('assets/resources/responsive/')) return null;
  const stem=path.replace('assets/resources/responsive/','assets/resources/').replace(/-w\d+\.webp$/,'');
  return mediaPaths.find(candidate=>candidate.startsWith(stem+'.')&&!candidate.includes('/responsive/'))||null;
}

function usages(path,parent){
  if(parent) return ['assets/js/data/media-manifest.js'];
  const short=path.replace(/^assets\//,'');
  const name=path.split('/').at(-1);
  return textFiles.filter(file=>file.text.includes(path)||file.text.includes(short)||file.text.includes(name)).map(file=>file.path).sort();
}

function baseClassification(path){
  const extension=extname(path).toLowerCase();
  const kind=['.mp3','.wav','.ogg'].includes(extension)?'audio':['.mp4','.webm'].includes(extension)?'video':'image';
  if(path==='assets/favicon.svg'||(/^assets\/faction_marks\/[^/]+\.svg$/.test(path))){
    return {kind,provenance:'INTERFACE',release:'CLEARED',source:'Project Curse 코드 기반 인터페이스 마스터',handling:'증거 이미지가 아닌 UI 자산'};
  }
  if(path.includes('/derived/')&&/_reconstructed-v\d+\.(png|webp)$/i.test(path)){
    return {kind,provenance:'RECONSTRUCTED',release:'PROJECT_GENERATED',source:'Project Curse 설정 브리프 기반 생성형 시각 재구성',handling:'원본 기록으로 표시 금지'};
  }
  if(path.includes('/archive-enex/')){
    return {kind,provenance:'ORIGINAL_SOURCE',release:'SOURCE_REVIEW',source:'Archive ENEX에서 보존한 원본 계열 사본',handling:'원본 계보는 보존하되 공개 사용 권리는 별도 확인'};
  }
  if(path.startsWith('assets/audio/')){
    return {kind,provenance:'UNVERIFIED',release:'LICENSE_REVIEW',source:'기존 Project Curse 음향 자산 묶음',handling:'제작자·원출처·허가 범위 확인 전 공개 승인 금지'};
  }
  if(path.startsWith('assets/video/')){
    return {kind,provenance:'UNVERIFIED',release:'LICENSE_REVIEW',source:'기존 Project Curse 영상 자산 묶음',handling:'영상·내장 음향의 제작자와 사용 범위 확인 필요'};
  }
  if(/^assets\/faction_marks\/[^/]+\.webp$/.test(path)){
    return {kind,provenance:'UNVERIFIED_LEGACY',release:'LICENSE_REVIEW',source:'구형 세력 표식 사본',handling:'SVG 인터페이스 마스터의 대체·계보 참고본'};
  }
  return {kind,provenance:'UNVERIFIED',release:'LICENSE_REVIEW',source:'기존 공개 기록 자산 묶음',handling:'원본 계보·제작자·공개 허가 범위 대조 필요'};
}

const preliminary=new Map();
for(const absolute of mediaFiles){
  const path=normalized(absolute);
  if(path.includes('/responsive/')) continue;
  preliminary.set(path,{...baseClassification(path),...(overrides.assets?.[path]||{})});
}

const assets=mediaFiles.map(absolute=>{
  const path=normalized(absolute);
  const parent=responsiveParent(path);
  const parentClass=parent?preliminary.get(parent):null;
  const classification=parent?{
    kind:'image',provenance:'DELIVERY_DERIVATIVE',release:parentClass?.release||'LICENSE_REVIEW',
    source:`${parent||'UNKNOWN'}의 반응형 WebP 전송 파생본`,handling:'출처 등급과 공개 상태를 원본에서 상속하며 증거 원본을 대체하지 않음'
  }:baseClassification(path);
  Object.assign(classification,overrides.assets?.[path]||{});
  const usedBy=usages(path,parent);
  const bytes=statSync(absolute).size;
  const sha256=createHash('sha256').update(readFileSync(absolute)).digest('hex');
  const protectedScope=usedBy.some(file=>/Cults_871104|Immortality_860201|cinematic-cults|cinematic-immortality/.test(file));
  return {path,...classification,bytes,sha256,usedBy,derivedFrom:parent||undefined,referenced:usedBy.length>0,protectedScope};
});

const countBy=(key)=>Object.fromEntries([...new Set(assets.map(asset=>asset[key]))].sort().map(value=>[value,assets.filter(asset=>asset[key]===value).length]));
const reviewStatuses=new Set(['LICENSE_REVIEW','SOURCE_REVIEW']);
const stats={
  registered:assets.length,
  referenced:assets.filter(asset=>asset.referenced).length,
  unreferenced:assets.filter(asset=>!asset.referenced).length,
  review:assets.filter(asset=>reviewStatuses.has(asset.release)).length,
  managed:assets.filter(asset=>!reviewStatuses.has(asset.release)).length,
  referenceOnly:referenceOnly.length,
  referenceExposure:exposedReferenceFiles.length,
  byKind:countBy('kind'),
  byRelease:countBy('release'),
  byProvenance:countBy('provenance')
};
const reviewQueue=assets.filter(asset=>reviewStatuses.has(asset.release)).sort((a,b)=>{
  const priority={audio:0,video:1,image:2};
  return priority[a.kind]-priority[b.kind]||b.bytes-a.bytes||a.path.localeCompare(b.path);
}).slice(0,12).map(({path,kind,release,source,referenced})=>({path,kind,release,source,referenced}));

const payload={version:'1.0.0',generated:'2026-08-21',policy:'MEDIA PROVENANCE / RELEASE AUDIT',overridesVersion:overrides.version||'UNKNOWN',referenceOnly,referenceExposures:exposedReferenceFiles,stats,reviewQueue,assets};
const output=`// Project Curse 5.42.0 — generated media provenance and release-review ledger.\n(function(root){\n  'use strict';\n  const data=${JSON.stringify(payload,null,2)};\n  const freeze=value=>{if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;Object.values(value).forEach(freeze);return Object.freeze(value);};\n  root.ProjectCurseMediaProvenance=freeze(data);\n})(window);\n`;

if(process.argv.includes('--write')){
  writeFileSync(resolve(ROOT,TARGET),output,'utf8');
  console.log(`WROTE ${TARGET}`);
}else{
  if(!existsSync(resolve(ROOT,TARGET))||readFileSync(resolve(ROOT,TARGET),'utf8')!==output){
    console.error(`STALE ${TARGET}; run node tools/build-media-provenance.mjs --write`);
    process.exitCode=1;
  }
}
console.log(JSON.stringify(stats,null,2));
if(assets.length!==mediaSet.size) process.exitCode=1;
if(staleOverrides.length){
  console.error(`UNKNOWN OVERRIDES\n${staleOverrides.join('\n')}`);
  process.exitCode=1;
}
if(exposedReferenceFiles.length){
  console.error(`REFERENCE-ONLY FILES EXPOSED\n${exposedReferenceFiles.join('\n')}`);
  process.exitCode=1;
}
