#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const ROOT=fileURLToPath(new URL('../',import.meta.url));
const read=(relative)=>readFileSync(ROOT+relative,'utf8');
const hash=(value)=>createHash('sha256').update(value).digest('hex');
const count=(source,needle)=>source.split(needle).length-1;
const results=[];
const check=(name,pass,detail='')=>results.push({name,pass:Boolean(pass),detail});
const article=(source,id)=>{
  const start=source.indexOf(`<article class="record-detail" data-record="${id}"`);
  const end=start<0?-1:source.indexOf('</article>',start);
  return start<0||end<0?'':source.slice(start,end+'</article>'.length);
};

const index=read('index.html');
const shell=read('assets/js/core/app-shell.js');
const shellCss=read('assets/css/app-shell.css');
const audio=read('assets/js/core/base-runtime.js');
const faction=read('assets/js/pages/faction-analysis.js');
const archive=read('assets/js/pages/archive-consolidation.js');
const documentViewer=read('assets/js/pages/archive-document.js');
const documentCss=read('assets/css/archive-document.css');
const manifest=read('assets/js/data/site-manifest.js');
const registry=read('assets/js/data/archive-registry.js');
const documentData=read('assets/js/data/archive-document-data.js');
const immortalityStoryboard=read('assets/js/data/immortality-storyboard.js');

const context={window:{}};
vm.createContext(context);
for(const file of [
  'assets/js/data/site-manifest.js','assets/js/data/archive-registry.js','assets/js/data/archive-document-data.js',
  'assets/js/data/immortality-storyboard.js',
  'assets/js/core/record-cinematic-registry.js','assets/js/pages/cinematic-cults.js','assets/js/pages/cinematic-immortality.js',
  'assets/js/pages/cinematic-ferals.js','assets/js/pages/cinematic-sakuma.js'
]) vm.runInContext(read(file),context,{filename:file});

check('version:manifest',context.window.ProjectCurseStructure?.version==='5.15.2cv',context.window.ProjectCurseStructure?.version);
check('version:archive',context.window.ProjectCurseArchive?.version==='5.15.2cv',context.window.ProjectCurseArchive?.version);
check('version:documents',context.window.ProjectCurseArchiveDocuments?.version==='5.15.2cv',context.window.ProjectCurseArchiveDocuments?.version);
check('shell:single-static-home',count(index,'class="uac-shell-home"')===1&&index.includes('data-uac-route="terminal-home"'));
check('shell:no-page-injection',!shell.includes('ensureReturnControl')&&!shell.includes('uac-return-terminal'));
check('shell:home-owned-outside-pages',index.indexOf('class="uac-shell-home"')<index.indexOf('<main class="uac-shell-content"'));
check('shell:route-events',shell.includes('projectcurse:route-will-change')&&shell.includes('projectcurse:screen-committed'));
check('shell:decrypt-effect',shell.includes('uac-screen-entering')&&shellCss.includes('@keyframes uac-screen-decrypt'));
check('shell:button-feedback',shellCss.includes('@keyframes uac-control-scan')&&shellCss.includes('@keyframes uac-control-pulse'));

check('faction:no-detail-route',!faction.includes('#faction-info/')&&!faction.includes('pushState')&&!faction.includes('replaceState'));
check('faction:no-history-listeners',!faction.includes('hashchange')&&!faction.includes('popstate'));
check('faction:internal-state',faction.includes('let selected=null')&&faction.includes('renderIndex()')&&faction.includes('renderDossier'));

const documents=context.window.ProjectCurseArchive?.publicRecords?.filter(record=>record.format==='document')||[];
check('archive:five-documents',documents.length===5,documents.length);
check('archive:no-document-hrefs',documents.every(record=>!record.href));
check('archive:no-page-navigation',!archive.includes('location.href')&&!archive.includes('window.location'));
check('archive:internal-open',archive.includes('ProjectCurseInternalDocumentViewer?.open'));
check('archive:internal-host',count(index,'id="archiveInternalDocument"')===1&&count(index,'id="archiveInternalDocumentBody"')===1);
check('archive:no-iframe',!index.toLowerCase().includes('<iframe'));

check('document:viewer-api',documentViewer.includes('ProjectCurseInternalDocumentViewer=Object.freeze'));
check('document:route-free-toc',documentViewer.includes("el('button','archive-doc-toc-link'")&&!documentViewer.includes('href="#section-')&&!documentViewer.includes("`#section-${"));
check('document:embedded-assets',documentViewer.includes("replace(/^(?:\\.\\.\\/)+/,'')"));
check('document:css-scoped',documentCss.includes('body[data-archive-document]')&&!documentCss.includes('\nbody{'));
check('document:root-loaded',index.includes('assets/css/archive-document.css?v=5.15.2cv')&&index.includes('assets/js/pages/archive-document.js?v=5.15.2cv'));

check('audio:persistent-context',audio.includes("setContext('document')")||documentViewer.includes("setContext?.('document')"));
check('audio:no-ambient-rewind',!audio.includes('audio.ambient.currentTime=0'));
check('audio:visibility-resume',audio.includes("else if(ambientAllowed&&audioContext!=='cinematic') startAmbient()"));
check('audio:cinematic-compatibility',audio.includes('stopMenuAmbient')&&audio.includes('resumeMenuAmbient')&&audio.includes('syncAudioState'));

const cinematicIds=context.window.ProjectCurseCinematicRegistry?.ids?.()||[];
check('cinematic:four-records',cinematicIds.join('|')==='Cults_871104|Immortality_860201|Ferals_860722|Sakuma_Tape_991028',cinematicIds.join('|'));
check('cinematic:archive-starts-registry',archive.includes("record?.format==='video'")&&archive.includes('ProjectCurseCinematicRegistry?.get?.(id)'));
const cinematicRuntime=read('assets/js/core/record-cinematic-runtime.js');
const cinematicCss=read('assets/css/record-cinematic.css');
check('cinematic:no-mount-loader-runtime',!cinematicRuntime.includes('showMountLoader')&&!cinematicRuntime.includes('recordLoading')&&!cinematicRuntime.includes('mountTitle'));
check('cinematic:direct-launch',cinematicRuntime.includes('const launchSequence=()=>')&&cinematicRuntime.includes('launchSequence();'));
check('cinematic:legacy-loader-blocked',cinematicCss.includes('#recordLoading')&&cinematicCss.includes('display:none!important'));
check('cinematic:no-mount-config',[
  'assets/js/pages/cinematic-cults.js','assets/js/pages/cinematic-immortality.js','assets/js/pages/cinematic-ferals.js','assets/js/pages/cinematic-sakuma.js'
].every(file=>!read(file).includes('mountTitle')&&!read(file).includes('mountLines')&&!read(file).includes('mountHint')));
check('cinematic:intro-panel-runtime-lock',cinematicRuntime.includes('if(panel) panel.hidden=true')&&cinematicRuntime.includes('if(panel) panel.hidden=false'));
check('cinematic:intro-panel-css-lock',cinematicCss.includes('.pc5152h-cult-sequence.intro-mode .pc5152h-seq-panel')&&cinematicCss.includes('.pc5152h-seq-panel[hidden]'));
check('cinematic:intro-video-fullscreen',cinematicCss.includes('.pc5152h-cult-sequence.intro-mode .pc5152h-seq-video')&&cinematicCss.includes('height:100dvh!important'));
check('cinematic:no-photo-drift',!cinematicCss.includes('pcCinematicDrift'));
check('cinematic:natural-ratio-photo-fit',cinematicRuntime.includes('image.naturalWidth/image.naturalHeight')&&cinematicRuntime.includes('--pc-media-width')&&cinematicCss.includes('.pc-cinematic-frame-fitted'));
check('cinematic:portrait-height-contained',cinematicRuntime.includes("(window.innerHeight||720)*.56")&&cinematicCss.includes('max-height:56dvh!important'));
check('cinematic:two-column-raised',cinematicCss.includes('pc5152as-layout-two-column .pc5152h-seq-body')&&cinematicCss.includes('translateY(clamp(-96px,-7vh,-54px))'));
check('cinematic:fullscreen-chapter-transition',cinematicCss.includes('.pc5152h-cult-sequence.video-transition .pc5152m-transition-video')&&cinematicCss.includes('position:fixed!important')&&cinematicCss.includes('height:100dvh!important'));
check('cinematic:transition-plays-full-fallback',cinematicRuntime.includes("Number(cfg.transitionFallback||3750)")&&!cinematicRuntime.includes("Math.min(Number(cfg.transitionFallback||3100),1800)"));
check('audio:cinematic-does-not-replace-ambient',!cinematicRuntime.includes("bus.audio.ambient = new Audio")&&!cinematicRuntime.includes("bus.audio.ambient=new Audio"));
check('audio:cinematic-context-hard-stop',cinematicRuntime.includes("bus.setContext('cinematic')")&&cinematicRuntime.includes('ambient.currentTime=0'));
check('audio:single-root-owner',count(index,'assets/js/core/base-runtime.js')===1&&!index.includes('assets/js/main.js'));
check('audio:no-cinematic-bus-installer',!cinematicRuntime.includes('installClearAudioBus')&&!cinematicRuntime.includes('__pc5152cxCinematicCuesInstalled'));
check('audio:sequence-silence-at-entry',count(cinematicRuntime,'silenceMenuAmbientDuringSequence();')>=2);
check('cinematic:single-chapter-boundary-rule',cinematicRuntime.includes("current.group!==next.group&&getSequenceConfig()?.transitionVideo")&&!cinematicRuntime.includes("current.group==='system' && next.group==='cult'"));
const immortalityPages=context.window.ProjectCurseImmortalityStoryboard||[];
check('immortality:canonical-storyboard-loaded',index.includes('assets/js/data/immortality-storyboard.js?v=5.15.2df')&&immortalityPages.length===24,immortalityPages.length);
check('immortality:automatic-sequential-reveal',cinematicRuntime.includes('scheduleNextSequenceLine(Number(page.firstLineDelay')&&cinematicRuntime.includes('scheduleNextSequenceLine(nextDelay)'));
check('immortality:initial-content-hidden',cinematicCss.includes('Immortality starts from a genuinely blank record face')&&cinematicCss.includes('visibility:hidden!important')&&cinematicCss.includes('.pc5152k-seq-line.visible'));
check('immortality:intro-not-skipped',cinematicRuntime.includes('video.muted=true')&&cinematicRuntime.includes('video.load()')&&!cinematicRuntime.includes('Math.min(Number(cfg.introFallback||10450),4800)'));
check('immortality:personnel-pair',immortalityPages[1]?.people?.[0]?.role==='통신·영상 담당관'&&immortalityPages[1]?.people?.[1]?.role==='기술 지원 요원');
check('immortality:personnel-visible-without-line-gate',cinematicRuntime.includes('pc5152u-person-card is-visible')&&cinematicRuntime.includes('<div class="pc5152u-people-pair">')&&!cinematicRuntime.includes('<div class="pc5152u-people-pair pc5152k-seq-line"'));
check('immortality:personnel-captions-visible',cinematicCss.includes('.pc5152w-person-caption b')&&cinematicCss.includes('.pc5152w-person-caption span')&&cinematicCss.includes('overflow:visible!important'));
check('immortality:corruption-mutations',immortalityPages.filter(page=>page.lineMutation).length===2&&cinematicRuntime.includes('pc5152cz-line-mutated'));
check('immortality:tent-mutation-before-page-end',immortalityPages.find(page=>page.code==='TIME LOG / 17:16')?.lineMutation?.index===0&&immortalityPages.find(page=>page.code==='TIME LOG / 17:16')?.lineMutation?.delay===5200);
check('immortality:tent-exterior-mutation-target',immortalityPages.find(page=>page.code==='TIME LOG / 17:09')?.lineMutation?.index===0);
check('immortality:mutation-targets-story-copy-only',cinematicRuntime.includes('data-story-line=')&&cinematicRuntime.includes("lineEl.dataset.photo!=='1'")&&cinematicRuntime.includes('Number(lineEl.dataset.storyLine)'));
check('immortality:tent-dialogue-own-page',immortalityPages.find(page=>page.code==='TIME LOG / 17:16')?.lines?.length===1&&immortalityPages.find(page=>page.code==='TIME LOG / 17:18')?.lines?.length===4);
check('immortality:first-page-intrusion',immortalityPages[0]?.postFlashLines?.length===26&&immortalityPages[0]?.postFlashLines?.at(-1)==='신은 너무나 외로워 보이신다'&&cinematicRuntime.includes('runImmortalityPostFlash'));
check('immortality:first-page-split-sequence',!immortalityPages[0]?.layout&&!!immortalityPages[0]?.image&&immortalityPages[0]?.firstLineDelay===1400&&cinematicRuntime.includes("return page.image ? 'field-brief'"));
check('immortality:intrusion-replaces-copy',cinematicRuntime.includes('line.remove()')&&cinematicRuntime.includes('pc5152da-postflash-replacement')&&cinematicCss.includes('.pc5152k-seq-lines.pc5152da-postflash-replacement > .pc5152k-seq-line'));
check('immortality:intrusion-audio',existsSync(ROOT+'assets/audio/pc5152db_immortality_intrusion_voice.mp3')&&cinematicRuntime.includes("new Audio(pre+'assets/audio/pc5152db_immortality_intrusion_voice.mp3')")&&cinematicRuntime.includes('playLocal(state.intrusionCue)'));
check('immortality:report-audio-gated-pages',immortalityPages.filter(page=>page.reportAudio).length===3&&immortalityPages.filter(page=>page.reportAudio).every(page=>page.lines?.at(-1)==='보고 중...'));
check('immortality:report-audio-end-advance',existsSync(ROOT+'assets/audio/pc5152db_immortality_report_progress.mp3')&&cinematicRuntime.includes("new Audio(pre+'assets/audio/pc5152db_immortality_report_progress.mp3')")&&cinematicRuntime.includes('audio.onended=complete')&&cinematicRuntime.includes('runImmortalityReportAudio(page)'));
check('immortality:pursuit-range-audio',existsSync(ROOT+'assets/audio/pc5152dd_immortality_pursuit_range.mp3')&&immortalityPages.filter(page=>page.rangeAudio==='latePursuit').length===4&&immortalityPages.find(page=>page.code==='TIME LOG / 18:22')?.rangeAudioStart===true&&immortalityPages.find(page=>page.code==='TIME LOG / 18:42')?.rangeAudio==='latePursuit'&&!immortalityPages.find(page=>page.code==='TIME LOG / 18:44')?.rangeAudio);
check('immortality:pursuit-range-runtime',cinematicRuntime.includes('syncImmortalityRangeAudio(page)')&&cinematicRuntime.includes('state.pursuitCue.loop = true')&&cinematicRuntime.includes("page?.rangeAudio==='latePursuit'")&&cinematicRuntime.includes('page.rangeAudioStart && lineIndex===0'));
check('immortality:image-request-line',immortalityPages[2]?.lines?.at(-1)==='2분대로부터 이미지 전송 요청을 수신받았다.');
check('immortality:bgm-starts-with-intro',cinematicRuntime.includes('if(recordId!==SAKUMA_RECORD && cfg.bgm && state.bgm)')&&!cinematicRuntime.includes('if(recordId===IMMORTALITY_RECORD) state.bgm.currentTime=0'));
check('immortality:mission-complete',immortalityPages.at(-1)?.lines?.[0]==='임무 상태: 완료');
for(const page of immortalityPages){
  if(page.image) check(`immortality:asset:${page.image}`,existsSync(ROOT+page.image));
  for(const person of page.people||[]) check(`immortality:asset:${person.image}`,existsSync(ROOT+person.image));
}
for(const id of cinematicIds){
  const config=context.window.ProjectCurseCinematicRegistry?.get?.(id);
  if(config?.transitionVideo) check(`cinematic:transition-asset:${id}`,existsSync(ROOT+config.transitionVideo),config.transitionVideo);
}

for(const ref of documentData.matchAll(/src:'(\.\.\/\.\.\/assets\/[^']+)'/g)){
  const relative=ref[1].replace(/^(?:\.\.\/)+/,'');
  check(`asset:${relative}`,existsSync(ROOT+relative));
}

const locked={
  Cults_871104:{inline:'aefa15d45fd74b868223144455da4dae59b5545f61fd5687a3132d8cf27c3429',standalone:'71b052533c33f3c4d9838a55633be82bb64030d4028be2304a48154fa049a740'},
  Immortality_860201:{inline:'38cd38c7db213c15517284155e7a70f98092cf9cae52e18d0be40b85fe73e993',standalone:'1d6c0fb57135631deb7feed3c4f6845f4bd1337e3b7ad34db78f95b8d5855626'}
};
for(const [id,expected] of Object.entries(locked)){
  const inlineHash=hash(article(index,id));
  const standaloneHash=hash(read(`docs/${id}/index.html`));
  check(`locked:inline:${id}`,inlineHash===expected.inline,inlineHash);
  check(`locked:standalone:${id}`,standaloneHash===expected.standalone,standaloneHash);
}

check('cache:core-busters',[
  'assets/css/app-shell.css','assets/css/archive-document.css','assets/js/core/app-shell.js','assets/js/core/base-runtime.js',
  'assets/js/pages/archive-document.js','assets/js/pages/archive-consolidation.js','assets/js/pages/faction-analysis.js'
].every(file=>index.includes(`${file}?v=5.15.2cv`)));
check('cache:cinematic-busters',index.includes('assets/css/record-cinematic.css?v=5.15.2df')&&index.includes('assets/js/core/record-cinematic-runtime.js?v=5.15.2df'));
check('manifest:viewer-owner',manifest.includes("archiveDocumentViewer:'assets/js/pages/archive-document.js'"));
check('registry:no-href-field',!registry.includes("href:'docs/"));

const failed=results.filter(result=>!result.pass);
results.forEach(result=>console.log(`${result.pass?'PASS':'FAIL'} ${result.name}${result.detail?` :: ${result.detail}`:''}`));
console.log(`\n${results.length-failed.length}/${results.length} checks passed`);
if(failed.length) process.exitCode=1;
