#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync,readFileSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const VERSION='5.15.2co';
const DATA_VERSION='5.15.2cf';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const checks=[];
const path=relative=>ROOT+relative;
const read=relative=>readFileSync(path(relative),'utf8');
const hash=value=>createHash('sha256').update(value).digest('hex');
const add=(name,pass,detail='')=>checks.push({name,pass:!!pass,detail});
const count=(source,needle)=>source.split(needle).length-1;
function article(source,id){
  const start=source.indexOf(`<article class="record-detail" data-record="${id}"`);
  const end=start<0?-1:source.indexOf('</article>',start);
  return start<0||end<0?'':source.slice(start,end+'</article>'.length);
}

const required=[
  'index.html','assets/css/style.css','assets/css/stabilization.css','assets/css/archive-consolidation.css','assets/css/archive-document.css','assets/css/record-cinematic.css','assets/css/world-history.css','assets/css/faction-analysis.css',
  'assets/js/data/site-manifest.js','assets/js/data/canon-registry.js','assets/js/data/faction-analysis-data.js','assets/js/data/archive-registry.js','assets/js/data/archive-document-data.js','assets/js/main.js',
  'assets/js/data/feral-cinematic-data.js','assets/js/data/sakuma-cinematic-data.js',
  'assets/js/core/record-cinematic-registry.js','assets/js/pages/cinematic-cults.js','assets/js/pages/cinematic-immortality.js','assets/js/pages/cinematic-ferals.js','assets/js/pages/cinematic-sakuma.js',
  'assets/js/core/runtime-ownership.js','assets/js/core/menu-audio-runtime.js','assets/js/pages/shared-declutter.js',
  'assets/js/pages/canon-reconciliation.js','assets/js/pages/archive-consolidation.js','assets/js/pages/archive-document.js','assets/js/pages/world-history.js','assets/js/qa/structure-qa.js','assets/js/pages/faction-analysis.js',
  'assets/audio/pc5152am_immortality_scp087_theme.mp3',
  'assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3',
  'assets/audio/pc5152cf_feral_dying_memories_bgm.mp3',
  'assets/audio/pc5152an_cult_radio_static_layer.mp3',
  'docs/Cults_871104/index.html','docs/Immortality_860201/index.html'
];
required.forEach(relative=>add(`required:${relative}`,existsSync(path(relative))));

const index=read('index.html');
const main=read('assets/js/main.js');
const canon=read('assets/js/data/canon-registry.js');
const reconcile=read('assets/js/pages/canon-reconciliation.js');
const manifest=read('assets/js/data/site-manifest.js');
const archiveRegistry=read('assets/js/data/archive-registry.js');
const archiveRuntime=read('assets/js/pages/archive-consolidation.js');
const factionAnalysisSource=read('assets/js/data/faction-analysis-data.js');
const factionAnalysisRuntime=read('assets/js/pages/faction-analysis.js');
const worldHistory=read('assets/js/pages/world-history.js');
const menuAudioRuntime=read('assets/js/core/menu-audio-runtime.js');
const runtimeOwnership=read('assets/js/core/runtime-ownership.js');
const recordCinematicCss=read('assets/css/record-cinematic.css');
const cinematicRegistrySource=read('assets/js/core/record-cinematic-registry.js');
const cinematicCults=read('assets/js/pages/cinematic-cults.js');
const cinematicImmortality=read('assets/js/pages/cinematic-immortality.js');
const cinematicFerals=read('assets/js/pages/cinematic-ferals.js');
const cinematicSakuma=read('assets/js/pages/cinematic-sakuma.js');
const context={window:{}};
vm.createContext(context);
vm.runInContext(manifest,context,{filename:'site-manifest.js'});
vm.runInContext(canon,context,{filename:'canon-registry.js'});
vm.runInContext(factionAnalysisSource,context,{filename:'faction-analysis-data.js'});
vm.runInContext(archiveRegistry,context,{filename:'archive-registry.js'});
vm.runInContext(read('assets/js/data/archive-document-data.js'),context,{filename:'archive-document-data.js'});
vm.runInContext(read('assets/js/data/feral-cinematic-data.js'),context,{filename:'feral-cinematic-data.js'});
vm.runInContext(read('assets/js/data/sakuma-cinematic-data.js'),context,{filename:'sakuma-cinematic-data.js'});
vm.runInContext(cinematicRegistrySource,context,{filename:'record-cinematic-registry.js'});
vm.runInContext(cinematicCults,context,{filename:'cinematic-cults.js'});
vm.runInContext(cinematicImmortality,context,{filename:'cinematic-immortality.js'});
vm.runInContext(cinematicFerals,context,{filename:'cinematic-ferals.js'});
vm.runInContext(cinematicSakuma,context,{filename:'cinematic-sakuma.js'});
const canonData=context.window.ProjectCurseCanon;
const factionAnalysis=context.window.ProjectCurseFactionAnalysis;
const structureData=context.window.ProjectCurseStructure;
const archiveData=context.window.ProjectCurseArchive;
const cinematicData=context.window.ProjectCurseCinematicRegistry;
const ordered=[
  'assets/js/data/site-manifest.js','assets/js/data/canon-registry.js','assets/js/data/faction-analysis-data.js','assets/js/data/archive-registry.js','assets/js/data/archive-document-data.js','assets/js/data/feral-cinematic-data.js','assets/js/data/sakuma-cinematic-data.js',
  'assets/js/core/record-cinematic-registry.js','assets/js/pages/cinematic-cults.js','assets/js/pages/cinematic-immortality.js','assets/js/pages/cinematic-ferals.js','assets/js/pages/cinematic-sakuma.js','assets/js/main.js',
  'assets/js/core/runtime-ownership.js','assets/js/core/menu-audio-runtime.js','assets/js/pages/shared-declutter.js',
  'assets/js/pages/canon-reconciliation.js','assets/js/pages/archive-consolidation.js','assets/js/pages/world-history.js','assets/js/qa/structure-qa.js','assets/js/pages/faction-analysis.js'
];
const positions=ordered.map(owner=>index.indexOf(`src="${owner}"`));
add('script-order',positions.every((position,i)=>position>=0&&(i===0||position>positions[i-1])),positions.join(','));
add('stabilization-css-link',count(index,'href="assets/css/stabilization.css"')===1);
add('archive-css-link',count(index,'href="assets/css/archive-consolidation.css"')===1);
add('record-cinematic-css-link',count(index,'href="assets/css/record-cinematic.css"')===1);
add('record-cinematic-controls',main.includes('pc-cinematic-controls')&&main.includes('scheduleAutomaticAdvance')&&main.includes('ProjectCurseRecordCinematic'));
add('record-cinematic-navigation',main.includes('previousSequence')&&main.includes('toggleSequencePlayback')&&main.includes('restartSequence'));
add('feral-cinematic-runtime',main.includes("const FERALS_RECORD='Ferals_860722'")&&cinematicFerals.includes("id:'Ferals_860722'")&&cinematicFerals.includes('ProjectCurseFeralCinematic?.pages')&&main.includes("recordId!==IMMORTALITY_RECORD && recordId!==SAKUMA_RECORD && cfg.bgm"));
add('sequence-menu-ambient-isolated',main.includes('function silenceMenuAmbientDuringSequence')&&main.includes('ambient.volume=0; ambient.pause()')&&count(main,'silenceMenuAmbientDuringSequence();')>=2);
add('cult-feral-shared-intro-video',cinematicCults.includes("introVideo:'assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4'")&&cinematicFerals.includes("introVideo:'assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4'")&&existsSync(path('assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4')));
add('cult-feral-radio-static-layer',hash(readFileSync(path('assets/audio/pc5152an_cult_radio_static_layer.mp3')))==='3ad8d1b5cb05a8599c4b6058d3c79574b5e6df7c8683631d53a5be7227c4f164'&&main.includes("assets/audio/pc5152an_cult_radio_static_layer.mp3"));
add('archive-return-boot-bypass',index.includes('__pc5152SkipBoot=returning')&&index.includes("get('return')==='archive'")&&main.includes('standalone records return to the archive')&&main.includes('index.html?return=archive#archive-entry')&&read('assets/css/style.css').includes('html.pc5152cf-archive-return #loader'));
add('record-cinematic-short-transitions',main.includes('Math.min(Number(cfg.transitionFallback||3100),1800)')&&main.includes('Math.min(Number(cfg.introFallback||10450),4800)'));
add('immortality-full-length-bgm',statSync(path('assets/audio/pc5152am_immortality_scp087_theme.mp3')).size>9_000_000,statSync(path('assets/audio/pc5152am_immortality_scp087_theme.mp3')).size);
add('cult-full-length-looping-bgm',statSync(path('assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3')).size>8_000_000&&cinematicCults.includes("assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3")&&main.includes('state.bgm.loop = true'),statSync(path('assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3')).size);
add('feral-custom-bgm',statSync(path('assets/audio/pc5152cf_feral_dying_memories_bgm.mp3')).size>1_000_000,statSync(path('assets/audio/pc5152cf_feral_dying_memories_bgm.mp3')).size);
add('canon-faction-owner',factionAnalysisSource.includes('ProjectCurseFactionAnalysis')&&factionAnalysisRuntime.includes('ProjectCurseFactionAnalysis'));
add('canon-relation-owner',Array.isArray(canonData?.relations)&&canonData.relations.length===18&&factionAnalysisRuntime.includes('function relationButton')&&factionAnalysisRuntime.includes('faction.relations.map(relationButton)'));
add('canon-direct-current-names',!canon.includes('Urban Anomaly Containment')&&!canon.includes('신디케이트')&&!canon.includes('하이문')&&!canon.includes('normalizeTerms')&&!factionAnalysisSource.includes('신디케이트')&&!factionAnalysisSource.includes('하이문')&&!factionAnalysisSource.includes('normalizeTerms'));
add('mobile-drawer-single-event-owner',main.includes('lastDrawerActivation')&&main.includes('lastSidebarRouteActivation')&&main.includes('activateSidebarRouteFromEvent')&&main.includes("document.addEventListener('pointerdown',function(e)")&&main.includes("e.target.closest('.side-menu a[data-target]')")&&main.includes('if(now-lastDrawerActivation<650) return true')&&main.includes('if(now-lastSidebarRouteActivation<650) return false')&&!main.includes("['touchend','pointerup'].forEach(type=>"));
add('mobile-drawer-route-closes-cleanly',main.includes("body.classList.toggle('pc5152be-drawer-open',!!open)")&&main.includes("routeTo(link.dataset.target||'terminal-home')"));
add('mobile-legacy-routers-disabled-for-v3',main.includes("const managedStructureV3=window.ProjectCurseStructure?.schema==='project-curse-structure-v3'")&&main.includes("if(window.ProjectCurseStructure?.schema!=='project-curse-structure-v3') sideLinks().forEach")&&main.includes("if(window.ProjectCurseStructure?.schema==='project-curse-structure-v3') return;"));
add('initial-route-terminal-home',index.includes('pc5152ca1-terminal-home active')&&index.includes('class="active" data-target="terminal-home"')&&main.includes("show((location.hash||'#terminal-home').slice(1))")&&menuAudioRuntime.includes("const target=returningToArchive?'archive-entry':'terminal-home'")&&menuAudioRuntime.includes('pc5152cnInitialRoute'));
add('route-clears-inert-synchronously',main.includes("page.removeAttribute('inert')")&&main.includes("page.style.pointerEvents=active?'auto':'none'")&&menuAudioRuntime.includes("page.removeAttribute('inert')")&&menuAudioRuntime.includes("page.style.pointerEvents=active?'auto':'none'"));
add('window-capture-menu-owner',menuAudioRuntime.includes('function routeFromMenuPress')&&menuAudioRuntime.includes("window.addEventListener('touchstart'")&&menuAudioRuntime.includes("window.addEventListener('pointerdown'")&&menuAudioRuntime.includes("window.addEventListener('click'")&&menuAudioRuntime.includes('event.stopImmediatePropagation'));
add('menu-route-seals-drawer-closed',menuAudioRuntime.includes('function setDrawerOpen')&&menuAudioRuntime.includes('function sealDrawerClosed')&&menuAudioRuntime.includes("button.textContent=open?'×':'☰'")&&menuAudioRuntime.includes("localStorage.setItem('pc-main-drawer-open',open?'open':'closed')")&&menuAudioRuntime.includes('requestAnimationFrame(sealDrawerClosed)')&&main.includes('setDrawer(false);'));
add('single-shell-runtime-owner',runtimeOwnership.includes('function claimShell')&&runtimeOwnership.includes(".side-menu a[data-target],.pc5152an-menu,.pc584-main-drawer-toggle")&&runtimeOwnership.includes('replaceListenerTarget')&&menuAudioRuntime.includes('function drawerFromMenuPress')&&menuAudioRuntime.includes('window.ProjectCurseShell=Object.freeze'));
add('runtime-ownership-manifest',structureData?.owners?.runtimeOwnership==='assets/js/core/runtime-ownership.js'&&structureData?.owners?.menuAudio==='assets/js/core/menu-audio-runtime.js');
add('runtime-ownership-qa',read('assets/js/qa/structure-qa.js').includes("['runtimeOwnership','menuAudio','sharedDeclutter','canonReconciliation','archiveIndex']")&&read('assets/js/qa/structure-qa.js').includes('modules.runtimeOwnership?.check?.()'));
add('menu-navigation-cues-disabled',!menuAudioRuntime.includes("play('latch','drawer',180)")&&!menuAudioRuntime.includes("play('contact','route',260)"));
add('retired-region-screen-removed',!index.includes('id="region-map"')&&!index.includes('data-target="region-map"')&&!index.includes('pc5152bd-region-situation-map')&&!index.includes('pc5152bf-regional-map-linked-usability'));
add('retired-relation-screen-removed',!index.includes('id="faction-relation"')&&!index.includes('data-target="faction-relation"'));
add('current-four-screen-manifest',structureData?.screens?.map(screen=>screen.id).join('|')==='terminal-home|history|faction-info|archive-entry');
add('legacy-route-compatibility',menuAudioRuntime.includes("target==='faction-relation'")&&menuAudioRuntime.includes("target==='region-map'||target==='zone-map'"));
add('cinematic-registry-four-records',cinematicData?.ids?.().join('|')==='Cults_871104|Immortality_860201|Ferals_860722|Sakuma_Tape_991028',cinematicData?.ids?.().join('|'));
add('cinematic-record-config-owned-by-modules',![cinematicCults,cinematicImmortality,cinematicFerals,cinematicSakuma].some(source=>!source.includes('ProjectCurseCinematicRegistry?.register'))&&main.includes('cinematicRegistry?.get?.(state.activeRecord)')&&main.includes('cinematicRegistry?.pages?.(recordId)'));
add('retired-expansion-blocks-quarantined',count(main,"if(window.ProjectCurseStructure?.schema==='project-curse-structure-v3') return;")>=5);
[
  'assets/resources/archive-enex/source-records/16b74a6d9fb1cab8522e4ed557cd0b84.mp3',
  'assets/resources/archive-enex/source-records/74b0e497277cdc48a4daf4df1b9241d4.mp3',
  'assets/resources/archive-enex/source-records/fb5ead8ded766fd8d05938b1caf6a18e.jpg',
  'assets/resources/archive-enex/source-records/ca57620ab037144cc82ea9443e85a91e.jpg',
  'assets/resources/archive-enex/source-records/c789dad33bd006ec60d4c737f7e5e2b7.jpg',
  'assets/resources/archive-enex/source-records/074fd0bfd4a4eb91fb3a948b9f2777d8.jpg',
  'assets/resources/archive-enex/source-records/734d86c7b7d166024a3be1993b9ed78a.jpg'
].forEach(relative=>add(`retired-media-removed:${relative}`,!existsSync(path(relative))));
add('cinematic-shell-controls-hidden',recordCinematicCss.includes('body.pc5152h-sequence-open .pc5152an-systembar')&&main.includes("document.body.classList.remove('pc584-main-drawer-open','pc5152be-drawer-open')"));
add('manifest-runtime-version',structureData?.version===VERSION);
add('archive-registry-version',archiveData?.version===DATA_VERSION);
const publicArchiveIds=archiveData?.publicRecords?.map(record=>record.id)||[];
add('archive-nine-record-index',publicArchiveIds.length===9&&publicArchiveIds.slice(0,4).join('|')==='Cults_871104|Immortality_860201|Ferals_860722|Zone_870815',publicArchiveIds.length);
add('archive-all-nine-open',archiveData?.publicRecords?.length===9&&archiveData.publicRecords.every(record=>record.access==='open'));
add('archive-record-ids-unique',new Set(publicArchiveIds).size===publicArchiveIds.length,publicArchiveIds.join('|'));
const videoRecords=archiveData?.publicRecords?.filter(record=>record.format==='video')||[];
const documentRecords=archiveData?.publicRecords?.filter(record=>record.format==='document')||[];
add('archive-video-document-groups',videoRecords.map(record=>record.id).join('|')==='Cults_871104|Immortality_860201|Ferals_860722|Sakuma_Tape_991028'&&documentRecords.length===5&&archiveRuntime.includes("group('video','VIDEO RECORDS','영상 기록')")&&archiveRuntime.includes("group('document','DOCUMENT FILES','문서 기록')"),`${videoRecords.length} video / ${documentRecords.length} document`);
add('archive-display-codes',videoRecords.find(record=>record.id==='Cults_871104')?.code==='CULT-ARCHIVE'&&videoRecords.find(record=>record.id==='Immortality_860201')?.code==='OP-IMMORTALITY');
add('archive-five-standalone-links',archiveData?.publicRecords?.filter(record=>record.href).length===5&&archiveData.publicRecords.filter(record=>record.href).every(record=>existsSync(path(record.href))));
add('archive-cinematic-inline-sequence',archiveData?.publicRecords?.filter(record=>record.presentation==='cinematic').every(record=>!record.href)&&index.indexOf('assets/js/data/archive-document-data.js')<index.indexOf('assets/js/data/feral-cinematic-data.js')&&index.indexOf('assets/js/data/feral-cinematic-data.js')<index.indexOf('assets/js/core/record-cinematic-registry.js')&&index.indexOf('assets/js/pages/cinematic-sakuma.js')<index.indexOf('assets/js/main.js')&&main.includes('const SEQUENCE_RECORDS=new Set(cinematicRegistry?.ids?.()||[])')&&archiveRuntime.includes("record?.presentation==='cinematic'")&&archiveRuntime.includes('window.ProjectCurseRecordCinematic.start(id)'));
add('archive-no-access-limit-label',!archiveRuntime.includes('접근 제한')&&!archiveRuntime.includes('is-restricted')&&archiveRuntime.includes("format==='video'?'영상 재생':'문서 열람'"));
const publicStandaloneRecords=archiveData?.publicRecords?.filter(record=>record.href)||[];
add('archive-five-readable-documents',publicStandaloneRecords.length===5&&publicStandaloneRecords.every(record=>{
  const page=read(record.href);
  return page.includes(`data-archive-document="${record.id}"`)&&page.includes('archive-document-data.js')&&page.includes('archive-document.js')&&!/접근 거부|READ PERMISSION: DENIED|ACCESS: SEALED/.test(page);
}));
add('archive-document-source-single-owner',!existsSync(path('assets/js/data/archive-source-content.js'))&&!read('assets/js/pages/archive-document.js').includes('ProjectCurseArchiveSourceContent'));
add('archive-legacy-index-removed-at-runtime',archiveRuntime.includes("qa(':scope > .archive-groups',wrap).forEach(legacy=>legacy.remove())"));
add('sakuma-inline-gesture-entry',archiveData?.publicRecords?.find(record=>record.id==='Sakuma_Tape_991028')?.presentation==='cinematic'&&!archiveData?.publicRecords?.find(record=>record.id==='Sakuma_Tape_991028')?.href&&read('docs/Sakuma_Tape_991028/index.html').includes('id="sakumaSequenceStart"')&&read('docs/Sakuma_Tape_991028/index.html').includes("start?.('Sakuma_Tape_991028')")&&read('docs/Sakuma_Tape_991028/index.html').indexOf('record-cinematic-registry.js')<read('docs/Sakuma_Tape_991028/index.html').indexOf('cinematic-sakuma.js'));
add('archive-feral-standalone-gesture-fallback',read('docs/Ferals_860722/index.html').includes('기록 열람 시작')&&!read('docs/Ferals_860722/index.html').includes("setTimeout(start,80)")&&read('docs/Ferals_860722/index.html').includes("start?.('Ferals_860722')")&&read('docs/Ferals_860722/index.html').indexOf('record-cinematic-registry.js')<read('docs/Ferals_860722/index.html').indexOf('cinematic-ferals.js'));
const archiveDocumentRuntime=read('assets/js/pages/archive-document.js');
const archiveDocumentData=read('assets/js/data/archive-document-data.js');
add('archive-feral-supplement-discarded',!archiveRegistry.includes('FCR_Archive_890402')&&!archiveDocumentData.includes('FCR_Archive_890402')&&!existsSync(path('docs/FCR_Archive_890402')));
add('archive-genesis-record-discarded',!archiveRegistry.includes('Unknown_Record5_940626')&&!archiveDocumentData.includes('Unknown_Record5_940626')&&!existsSync(path('docs/Unknown_Record5_940626/index.html'))&&!index.includes('새로운 세계를 위한 유전자 기록'));
const restoredDocuments=context.window.ProjectCurseArchiveDocuments?.documents||{};
const restoredZone=restoredDocuments.Zone_870815;
const restoredRedzone=restoredDocuments.Redzone_881120;
const restoredNhcManual=restoredDocuments.NHC_Manual_891219;
const restoredFerals=restoredDocuments.Ferals_860722;
const feralCinematic=context.window.ProjectCurseFeralCinematic;
add('archive-zone-term-colors',archiveDocumentRuntime.includes("'그린존':'green'")&&archiveDocumentRuntime.includes("'레드존':'red'")&&read('assets/css/archive-document.css').includes('.archive-term-black'));
add('archive-rich-document-runtime',archiveDocumentRuntime.includes('appendFigure')&&archiveDocumentRuntime.includes('appendTable')&&archiveDocumentRuntime.includes('section.groups'));
add('archive-zone-guide',restoredZone?.presentation==='guide'&&restoredZone?.sections?.length===4&&JSON.stringify(restoredZone).includes('화이트존은 그린존과 옐로우존 사이에 있는 안전 단계가 아니다')&&JSON.stringify(restoredZone).includes('United Nations Anomaly Containment')&&JSON.stringify(restoredZone).includes('국제연합 산하기관은 아닌 독립기관')&&!JSON.stringify(restoredZone).includes('Level 7'),`${restoredZone?.sections?.length||0} sections / ${JSON.stringify(restoredZone||{}).length} chars`);
add('archive-redzone-not-public',!archiveRegistry.includes("id:'Redzone_881120'"));
add('archive-restored-canon-terms',![restoredZone,restoredRedzone].some(document=>/Urban Anomaly|도시 이상현상 격리국|신디케이트|하이먼/.test(JSON.stringify(document))));
const restoredMedia=[restoredZone?.hero,...(restoredRedzone?.sections||[]).map(section=>section.image)].filter(Boolean);
add('archive-restored-media-links',restoredMedia.length===7&&restoredMedia.every(media=>existsSync(path(media.src.replace(/^\.\.\/\.\.\//,'')))),restoredMedia.length);
add('archive-nhc-manual-not-public',!archiveRegistry.includes("id:'NHC_Manual_891219'"));
add('archive-nhc-canon-reconciled',!/Cursed Gear|Urban Anomaly|도시 이상현상 격리국|신디케이트|하이먼/.test(JSON.stringify(restoredNhcManual)));
const nhcManualMedia=[restoredNhcManual?.hero,...(restoredNhcManual?.sections||[]).map(section=>section.image)].filter(Boolean);
add('archive-nhc-media-links',nhcManualMedia.length===4&&nhcManualMedia.every(media=>existsSync(path(media.src.replace(/^\.\.\/\.\.\//,'')))),nhcManualMedia.length);
add('archive-feral-source-restored',restoredFerals?.sections?.length===8&&JSON.stringify(restoredFerals).length>10000&&JSON.stringify(restoredFerals).includes('Ferals / 괴이')&&JSON.stringify(restoredFerals).includes('Superiors / 상위체')&&JSON.stringify(restoredFerals).includes('Unusuals / Artificial')&&JSON.stringify(restoredFerals).includes('블러드러커 / IMAGE-412CF')&&JSON.stringify(restoredFerals).includes('지하 오컬트 클럽 · P.O.H / IMAGE-782CF')&&JSON.stringify(restoredFerals).includes('오토마톤 시험 / IMAGE-499CF')&&JSON.stringify(restoredFerals).includes('화염방사기 오토마톤 · 전차 모드 / IMAGE-501HS')&&JSON.stringify(restoredFerals).includes('회화 「천사의 현존」 / IMAGE-241HS')&&JSON.stringify(restoredFerals).includes('유령 / IMAGE-751CF'),`${restoredFerals?.sections?.length||0} sections / ${JSON.stringify(restoredFerals||{}).length} chars`);
add('archive-feral-canon-reconciled',JSON.stringify(restoredFerals).includes('초기 현장에서 Superiors를 구분')&&JSON.stringify(restoredFerals).includes('봉인은 대부분의 마법 조작')&&!/Urban Anomaly|도시 이상현상 격리국|신디케이트|하이먼|Cursed Gear/.test(JSON.stringify(restoredFerals)));
const feralMedia=[restoredFerals?.hero,...(restoredFerals?.sections||[]).flatMap(section=>[section.image,...(section.groups||[]).map(group=>group.image)])].filter(Boolean);
add('archive-feral-media-links',feralMedia.length===18&&feralMedia.every(media=>existsSync(path(media.src.replace(/^\.\.\/\.\.\//,'')))),feralMedia.length);
add('archive-feral-term-colors',archiveDocumentRuntime.includes("'Superiors':'superior'")&&archiveDocumentRuntime.includes("'Artificial':'artificial'")&&read('assets/css/archive-document.css').includes('.archive-term-hybrid'));
add('archive-feral-cinematic-term-colors',main.includes('function highlightFeralTerms')&&main.includes("Unusuals:'unusuals'")&&main.includes("Hybrid:'hybrid'")&&main.includes('highlightFeralTerms(escSeq(line))')&&read('assets/css/record-cinematic.css').includes('.pc5152cf-feral-term-unusuals')&&read('assets/css/record-cinematic.css').includes('.pc5152cf-feral-term-hybrid'));
add('archive-feral-organized-slides',feralCinematic?.pages?.length===19&&feralCinematic.pages[0]?.code==='CLASSIFIED MATERIAL / NOTICE'&&feralCinematic.pages.filter(page=>page.layout==='evidenceCenter').length===15&&feralCinematic.pages.filter(page=>String(page.code||'').startsWith('CHAPTER ')).map(page=>page.code).join('|')==='CHAPTER 01 / FERALS'&&!feralCinematic.pages.some(page=>page.group==='doctrine')&&feralCinematic.pages.at(-1)?.group==='return',feralCinematic?.pages?.length||0);
add('archive-feral-no-redundant-opening',!feralCinematic?.pages?.some(page=>page.code==='U.A.C / FERAL CLASSIFICATION'||page.subtitle==='원문 복원·통합 개정본 / 1997.01.27'));
add('archive-feral-slide-media',feralCinematic?.pages?.filter(page=>page.image).length===17&&feralCinematic.pages.filter(page=>page.image).every(page=>existsSync(path(page.image))),feralCinematic?.pages?.filter(page=>page.image).length||0);
add('archive-feral-no-cult-duplicate',!JSON.stringify(restoredFerals).includes('가면을 쓴 존재 / IMAGE-0321')&&!feralCinematic.pages.some(page=>page.subtitle==='IMAGE-0321')&&main.includes('"title": "가면을 쓴 존재"'));
add('archive-feral-reference-frame-mapped',!JSON.stringify(restoredFerals).includes('TRACE-UNIDENTIFIED')&&!JSON.stringify(restoredFerals).includes('분류 보류 · 원본 프레임')&&restoredFerals?.sections?.find(section=>section.title==='Ferals / 괴이')?.image?.src?.includes('cf7fc001f5b5f83c079dbded4da7d3f5.webp')&&restoredFerals.sections.find(section=>section.title==='Ferals / 괴이')?.paragraphs?.length===2&&restoredFerals.sections.find(section=>section.title==='Ferals / 괴이')?.paragraphs?.[0]?.includes('모든 분류 가운데 가장 많은 수')&&restoredFerals.sections.find(section=>section.title==='Ferals / 괴이')?.paragraphs?.[1]?.includes('기원이 주술적이며 이계의 무언가와 연결')&&feralCinematic?.pages?.find(page=>page.code==='CHAPTER 01 / FERALS')?.title==='괴이'&&feralCinematic.pages.find(page=>page.code==='CHAPTER 01 / FERALS')?.layout==='twoColumn'&&feralCinematic.pages.find(page=>page.code==='CHAPTER 01 / FERALS')?.image?.includes('cf7fc001f5b5f83c079dbded4da7d3f5.webp'));
add('archive-feral-compact-source-frames',feralCinematic?.pages?.find(page=>page.code==='CLASSIFICATION MAP / RESTORED')?.layout==='classificationChart'&&feralCinematic.pages.find(page=>page.code==='CLASSIFICATION MAP / RESTORED')?.lines?.length===0&&feralCinematic.pages.find(page=>page.code==='CLASSIFICATION MAP / RESTORED')?.caption==='괴이 단순화 분류도'&&feralCinematic.pages.find(page=>page.code==='CLASSIFICATION MAP / RESTORED')?.credit==='작성자 — 키무라 쿄'&&feralCinematic.pages.find(page=>page.code==='CLASSIFIED MATERIAL / NOTICE')?.layout==='warningNotice'&&feralCinematic.pages.find(page=>page.code==='CLASSIFIED MATERIAL / NOTICE')?.lines?.length===3&&main.includes('buildClassificationChartBlock')&&read('assets/css/record-cinematic.css').includes('.pc5152cf-classification-chart'));
const feralEntitySlides=feralCinematic?.pages?.filter(page=>page.layout==='evidenceCenter'&&page.group!=='feral_system')||[];
const dogSlide=feralEntitySlides.find(page=>page.title==='개');
const failedRitualSlide=feralEntitySlides.find(page=>page.title==='실패한 의식 사례');
const shadowSlide=feralEntitySlides.find(page=>page.title==='그림자의 품에 안긴 죽음');
const shadowVictimSlide=feralEntitySlides.find(page=>page.title==='그림자의 희생자');
const camouflageSlide=feralEntitySlides.find(page=>page.title==='위장의 잔여물');
const bloodlurkerSlide=feralEntitySlides.find(page=>page.title==='블러드러커');
const immatureMimicSlide=feralEntitySlides.find(page=>page.title==='미성숙 미믹');
const windowMimicSlide=feralEntitySlides.find(page=>page.title==='창문 미믹');
const newbornSlide=feralEntitySlides.find(page=>page.title==='신생아');
const occultClubSlide=feralEntitySlides.find(page=>page.title==='지하 오컬트 클럽 · P.O.H');
const automatonTestingSlide=feralEntitySlides.find(page=>page.title==='오토마톤 시험');
const flamethrowerSlide=feralEntitySlides.find(page=>page.title==='화염방사기 오토마톤 · 전차 모드');
const sealsSlide=feralEntitySlides.find(page=>page.title==='봉인');
const angelSlide=feralEntitySlides.find(page=>page.title==='회화 「천사의 현존」');
const ghost751Slide=feralEntitySlides.find(page=>page.title==='유령');
const sourceOnlySlides=[dogSlide,failedRitualSlide,shadowSlide,shadowVictimSlide,camouflageSlide,bloodlurkerSlide,immatureMimicSlide,windowMimicSlide,newbornSlide,occultClubSlide,automatonTestingSlide,flamethrowerSlide,sealsSlide,angelSlide,ghost751Slide];
add('archive-feral-structured-copy',feralEntitySlides.filter(page=>!sourceOnlySlides.includes(page)).every(page=>page.report?.some(line=>line.startsWith('분류 — '))&&page.report?.some(line=>line.startsWith('개체 개요 — '))&&page.report?.some(line=>line.startsWith('식별 단서 — '))&&page.report?.some(line=>line.startsWith('현장 대응 — ')))&&!feralCinematic.pages.some(page=>page.group==='doctrine'||String(page.code||'').startsWith('FIELD DOCTRINE')));
add('archive-feral-source-paragraphs-unlabeled',sourceOnlySlides.every(page=>page&&page.report?.length>0&&page.report.every(line=>!/^(분류|기록 내용|생존 특성|개체 구성|발생 조건|위험 특성|원본 기록|탐지 특성|위협 기록)\s*—/.test(line))));
add('archive-feral-dog-source-faithful',dogSlide?.subtitle==='IMAGE-007CF'&&dogSlide?.frame==='FERALS / PURE / IMAGE-007CF'&&dogSlide?.report?.some(line=>line.includes('아직 인간을 섭취하지 않은 순수형'))&&dogSlide?.report?.some(line=>line.includes('서로 다른 형태의 불멸성'))&&!dogSlide?.report?.some(line=>/위험 및 주요 구역|현장 대응|불멸성은 확인되지 않았다/.test(line)));
add('archive-feral-failed-ritual-source-faithful',failedRitualSlide?.subtitle==='IMAGE-012CF'&&failedRitualSlide?.frame==='FERALS / UNPURE / IMAGE-012CF'&&failedRitualSlide?.report?.some(line=>line.includes('인간의 신체를 기반으로'))&&failedRitualSlide?.report?.some(line=>line.includes('인간 또는 시체를 섭취'))&&failedRitualSlide?.report?.some(line=>line.includes('부분적·완전한 인간 모방'))&&!failedRitualSlide?.report?.some(line=>/위험 및 주요 구역|현장 대응|옐로우존|레드존/.test(line)));
add('archive-feral-shadow-source-faithful',shadowSlide?.group==='ferals'&&shadowSlide?.subtitle==='IMAGE-018CF'&&shadowSlide?.frame==='FERALS / IMAGE-018CF'&&shadowSlide?.report?.some(line=>line.includes('여러 하위 유형'))&&shadowSlide?.report?.some(line=>line.includes('완전히 다른 생태와 삶의 방식'))&&!shadowSlide?.report?.some(line=>/위험 및 주요 구역|현장 대응|빙의|자살/.test(line))&&feralCinematic.pages.indexOf(shadowSlide)===feralCinematic.pages.indexOf(failedRitualSlide)+1);
add('archive-feral-shadow-victim-source-faithful',shadowVictimSlide?.group==='ferals'&&shadowVictimSlide?.subtitle==='VIDEO-1092C1F2'&&shadowVictimSlide?.frame==="VIDEO-1092C1F2 / SHADOW'S VICTIM"&&shadowVictimSlide?.image?.endsWith('video-1092c1f2-shadow-victim.png')&&shadowVictimSlide?.report?.some(line=>line.includes('부분적인 빙의'))&&shadowVictimSlide?.report?.some(line=>line.includes('자살하거나 살인을 저지르면'))&&feralCinematic.pages.indexOf(shadowVictimSlide)===feralCinematic.pages.indexOf(shadowSlide)+1);
add('archive-feral-camouflage-source-faithful',camouflageSlide?.group==='ferals'&&camouflageSlide?.subtitle==='IMAGE-231CF'&&camouflageSlide?.frame==='FERALS / IMAGE-231CF'&&camouflageSlide?.report?.some(line=>line.includes('살아 있는 인간의 신체를 위장 수단이나 미끼로 사용'))&&camouflageSlide?.report?.some(line=>line.includes('고통받는 상태로 남겨진다'))&&!camouflageSlide?.report?.some(line=>/위험 및 주요 구역|현장 대응|생체 검사|옐로우존|레드존/.test(line))&&feralCinematic.pages.indexOf(camouflageSlide)===feralCinematic.pages.indexOf(shadowVictimSlide)+1);
add('archive-feral-bloodlurker-source-faithful',bloodlurkerSlide?.group==='ferals'&&bloodlurkerSlide?.subtitle==='IMAGE-412CF'&&bloodlurkerSlide?.frame==='FERALS / IMAGE-412CF'&&bloodlurkerSlide?.report?.some(line=>line.includes('혈액은 괴이에게 이동 수단이자 사냥 방식'))&&bloodlurkerSlide?.report?.some(line=>line.includes('하수도망을 이용'))&&!bloodlurkerSlide?.report?.some(line=>/위험 및 주요 구역|현장 대응|순간 이동|Extreme|레드존/.test(line))&&feralCinematic.pages.indexOf(bloodlurkerSlide)===feralCinematic.pages.indexOf(camouflageSlide)+1);
add('archive-feral-immature-mimic-source-faithful',immatureMimicSlide?.group==='ferals'&&immatureMimicSlide?.subtitle==='IMAGE-354CF'&&immatureMimicSlide?.frame==='FERALS / IMAGE-354CF'&&immatureMimicSlide?.report?.some(line=>line.includes('신체 기형과 잘못된 해부학적 구조'))&&immatureMimicSlide?.report?.some(line=>line.includes('폭력적인 절차를 수반'))&&!immatureMimicSlide?.report?.some(line=>/위험 및 주요 구역|현장 대응|Artificial Feral|F\.H\.C|연구시설/.test(line))&&feralCinematic.pages.indexOf(immatureMimicSlide)===feralCinematic.pages.indexOf(bloodlurkerSlide)+1);
add('archive-feral-window-mimic-source-faithful',windowMimicSlide?.group==='ferals'&&windowMimicSlide?.subtitle==='IMAGE-477CF'&&windowMimicSlide?.frame==='FERALS / IMAGE-477CF'&&windowMimicSlide?.report?.some(line=>line.includes('주변의 사물로 위장'))&&windowMimicSlide?.report?.some(line=>line.includes('천장에 생긴 창문과 출입문'))&&!windowMimicSlide?.report?.some(line=>/위험 및 주요 구역|현장 대응|IMAGE-203CF|Ferals \/ Unpure|그린존|옐로우존|화이트존/.test(line))&&feralCinematic.pages.indexOf(windowMimicSlide)===feralCinematic.pages.indexOf(immatureMimicSlide)+1);
add('archive-feral-newborn-source-faithful',newbornSlide?.group==='ferals'&&newbornSlide?.subtitle==='IMAGE-083CF'&&newbornSlide?.frame==='IMAGE-083CF'&&newbornSlide?.report?.some(line=>line.includes('세 가지 하위 유형'))&&newbornSlide?.report?.some(line=>line.includes('유충 및 기생성 배아 배양'))&&newbornSlide?.report?.some(line=>line.includes('의식을 통한 소환'))&&!newbornSlide?.report?.some(line=>/위험 및 주요 구역|현장 대응|IMAGE-430CF|Superiors \/ Odious|High|레드존|U\.A\.C|N\.H\.C/.test(line))&&feralCinematic.pages.indexOf(newbornSlide)===feralCinematic.pages.indexOf(windowMimicSlide)+1);
add('archive-feral-occult-club-source-faithful',occultClubSlide?.group==='ferals'&&occultClubSlide?.subtitle==='IMAGE-782CF'&&occultClubSlide?.frame==='IMAGE-782CF / P.O.H'&&occultClubSlide?.image?.endsWith('image-782cf-underground-occult-club.png')&&occultClubSlide?.report?.some(line=>line.includes('모든 형태의 소환'))&&occultClubSlide?.report?.some(line=>line.includes('외부에서 기원'))&&occultClubSlide?.report?.some(line=>line.includes('PSB 또는 키무라 쿄'))&&feralCinematic.pages.indexOf(occultClubSlide)===feralCinematic.pages.indexOf(newbornSlide)+1);
add('archive-feral-automaton-testing-source-faithful',automatonTestingSlide?.group==='ferals'&&automatonTestingSlide?.subtitle==='IMAGE-499CF'&&automatonTestingSlide?.frame==='IMAGE-499CF / AUTOMATON TESTING'&&automatonTestingSlide?.image?.endsWith('image-499cf-automaton-testing.png')&&automatonTestingSlide?.report?.some(line=>line.includes('여러 강령술 의식의 산물'))&&automatonTestingSlide?.report?.some(line=>line.includes('무기를 이식'))&&automatonTestingSlide?.report?.some(line=>line.includes('모두 군에 편입'))&&feralCinematic.pages.indexOf(automatonTestingSlide)===feralCinematic.pages.indexOf(occultClubSlide)+1);
add('archive-feral-mechanical-modification-term',automatonTestingSlide?.report?.some(line=>line.includes('기계화 개조'))&&!automatonTestingSlide?.report?.some(line=>line.includes('사이버네틱')));
add('archive-feral-final-source-sequence',flamethrowerSlide?.subtitle==='IMAGE-501HS'&&flamethrowerSlide?.report?.some(line=>line.includes('허베이 전쟁'))&&sealsSlide?.subtitle==='IMAGE-24400'&&sealsSlide?.report?.some(line=>line.includes('오토마톤을 작동시키고'))&&angelSlide?.subtitle==='IMAGE-241HS'&&angelSlide?.image?.endsWith('image-241hs-angel-presence.png')&&angelSlide?.report?.some(line=>line.includes('날개 달린 천사 수천'))&&ghost751Slide?.subtitle==='IMAGE-751CF'&&ghost751Slide?.report?.some(line=>line.includes('반사면이나 특정 장비'))&&feralCinematic.pages.indexOf(flamethrowerSlide)===feralCinematic.pages.indexOf(automatonTestingSlide)+1&&feralCinematic.pages.indexOf(sealsSlide)===feralCinematic.pages.indexOf(flamethrowerSlide)+1&&feralCinematic.pages.indexOf(angelSlide)===feralCinematic.pages.indexOf(sealsSlide)+1&&feralCinematic.pages.indexOf(ghost751Slide)===feralCinematic.pages.indexOf(angelSlide)+1);
add('archive-feral-short-title',archiveData?.publicRecords?.find(record=>record.id==='Ferals_860722')?.title==='괴이'&&restoredFerals?.title==='괴이'&&read('docs/Ferals_860722/index.html').includes('<title>괴이</title>'));
add('archive-general-reading-layout',archiveDocumentRuntime.includes('archive-doc-reading-grid')&&archiveDocumentRuntime.includes('archive-doc-paragraph')&&archiveDocumentRuntime.includes('IntersectionObserver')&&count(archiveDocumentRuntime,'index.html?return=archive#archive-entry')===3&&read('assets/css/archive-document.css').includes('grid-template-columns:230px minmax(0,1fr)'));
[
  'assets/resources/548f1c4456dc240389f61115de660a7f.webp',
  'assets/resources/0a8342297ac1a847461c57a2726d98b7.webp',
  'assets/resources/4cd826918a7fd80a89342fb22aad527f.webp',
  'assets/resources/archive-enex/redzone/67068590d1271286e41cf77f66a428b7.webp',
  'assets/resources/archive-enex/redzone/d2f655eaa022b5ed59cde51c340fe192.webp',
  'assets/resources/archive-enex/redzone/a514ade5a1c2c20a24197c2edc52b444.webp',
  'assets/resources/archive-enex/redzone/ada9eb5801597f6bc952310e714fe050.webp',
  'assets/resources/archive-enex/nhc-manual/10644a0bb0e2769678f28705099ab750.webp',
  'assets/resources/archive-enex/nhc-manual/a5879fc3786a488b1b4e648d3950dc66.webp',
  'assets/resources/archive-enex/nhc-manual/c2c3ab6a9da838a851a58d644bc7cc37.webp',
  'assets/resources/archive-enex/nhc-manual/61d54ce3546269780708ae7e34e62475.webp',
  'assets/resources/8bb53a89c3baf48d8e3ac2b180f80d0b.webp',
  'assets/resources/b20abfee553be1cf8a7f818a2bd84f23.webp',
  'assets/resources/archive-enex/feral-classification/114223e8cf8c8ea96c6d4ffca6cae2ce.webp',
  'assets/resources/archive-enex/feral-classification/cf7fc001f5b5f83c079dbded4da7d3f5.webp',
  'assets/resources/archive-enex/feral-classification/c7befa50c0dc4cb9cb4738edfddc52ca.webp',
  'assets/resources/archive-enex/feral-classification/76dee84dd67b2de185391c67a3fec272.webp',
  'assets/resources/archive-enex/feral-classification/7c2233b40aae46362c72007abb9723fa.webp',
  'assets/resources/archive-enex/feral-classification/fd084f421df1ee396e4221d624e0af9d.webp',
  'assets/resources/archive-enex/feral-classification/ae910c4a62010fca4fa4759a868fc532.webp',
  'assets/resources/archive-enex/feral-classification/c5a83760bc383945f47889f0abc5213b.webp',
  'assets/resources/archive-enex/feral-classification/c693ac5c451cd7302911b4939cc0453e.webp',
  'assets/resources/archive-enex/feral-classification/f6a6cb52d81f7d2f1e276afcf9b25a5f.webp',
  'assets/resources/archive-enex/feral-classification/c95eb47340d0a9110f9d9b56ca23e079.webp',
  'assets/resources/archive-enex/feral-classification/acbc4774e85c9c21959567b75c666f28.webp',
  'assets/resources/archive-enex/feral-classification/c6ae7deaeec83489dc06eb6bdc655925.webp',
  'assets/resources/archive-enex/feral-classification/image-782cf-underground-occult-club.png',
  'assets/resources/archive-enex/feral-classification/image-499cf-automaton-testing.png'
  ,'assets/resources/archive-enex/feral-classification/image-241hs-angel-presence.png'
  ,'assets/resources/archive-enex/feral-classification/video-1092c1f2-shadow-victim.png'
  ,'assets/resources/archive-enex/cults/image-57-corrupted-cult.png'
].forEach(relative=>add(`archive-source-media:${relative}`,existsSync(path(relative))));
add('cult-warning-and-image-restored',main.includes('CLASSIFIED MATERIAL / WARNING')&&main.includes('타락 및 교단 침투자에 대한 처리는 반부패부서가 전담한다')&&main.includes('assets/resources/archive-enex/cults/image-57-corrupted-cult.png')&&!main.includes('타락교와 혈교 비교')&&!main.includes('FRAME 14 / FIELD WARNING'));
add('cinematic-centered-warning-and-chart-caption',read('assets/css/record-cinematic.css').includes('Final stage alignment shared by Religion and Feral warning frames')&&read('assets/css/record-cinematic.css').includes('.pc5152cf-classification-chart figcaption{display:block!important')&&read('assets/css/record-cinematic.css').includes('text-align:center!important'));
add('archive-no-dossiers',!('dossiers' in (archiveData||{}))&&!archiveRuntime.includes('DOSSIER-'));
add('archive-original-record-runtime',archiveRuntime.includes('data-pc-archive-open')&&archiveRuntime.includes('class="pc-archive-row')&&archiveRuntime.includes('openOriginal'));
add('archive-sequence-entry-restored',archiveRuntime.includes('ProjectCurseShowInternalRecord(id)')&&archiveRuntime.includes('pc-archive-index-host'));
add('archive-no-legacy-card-render',!archiveRuntime.includes('pc5152cf-dossier-card')&&!archiveRuntime.includes('restrictedMarkup')&&!archiveRuntime.includes('copiedSection'));
add('archive-sequence-records-known',publicArchiveIds.slice(0,2).every(id=>index.includes(`data-record="${id}"`)),publicArchiveIds.slice(0,2).join('|'));
add('archive-son-title',archiveData?.publicRecords?.some(record=>record.title==='S.O.N 비인가 장비 유통 기록')&&!archiveRegistry.includes('신디케이트 비인가 장비 유통 기록'));
add('uac-official-name',canonData?.official?.uacEnglish==='United Nations Anomaly Containment');
add('son-official-name',canonData?.official?.syndicateEnglish==='Shadow Of Nemesis'&&canonData?.factions?.syndicate?.name==='S.O.N');
add('poh-criminal-class',canonData?.official?.haimunEnglish==='Power Of Haimun'&&canonData?.factions?.haimun?.name==='P.O.H'&&canonData?.factions?.haimun?.cat==='이탈'&&!canonData?.factionTags?.haimun?.includes('cult'));
add('ushinoda-three-factions',canonData?.ushinodaHierarchy?.factions?.join('|')==='타락교|혈교|그림자교');
add('ushinoda-rank-counts',canonData?.ushinodaHierarchy?.lordsPerFaction===1&&canonData?.ushinodaHierarchy?.apostlesPerFaction===4&&canonData?.ushinodaHierarchy?.apostlesTotal===12);
add('nhc-independent-2001',canonData?.factions?.nhc?.event?.includes('2001년 7월 21일'));
add('sid-independent-2001',canonData?.factions?.sid?.event?.includes('2001년 7월 21일'));
add('uac-official-1993',canonData?.factions?.uac?.event?.includes('1993년 11월 2일'));
add('fhc-amarion-successor',canonData?.factions?.fhc?.summary?.includes('아마리온의 공간 연구와 사업 기반을 승계'));
add('amarion-predecessor',canonData?.factions?.amarion?.sub?.includes('F.H.C의 전신 기업')&&!canonData?.factions?.amarion?.summary?.includes('경쟁'));
const arfEdges=(canonData?.relations||[]).filter(row=>row.a==='arf'||row.b==='arf');
add('ashcrew-hierarchy',arfEdges.some(row=>[row.a,row.b].includes('ashcrew'))&&(canonData?.relations||[]).some(row=>[row.a,row.b].includes('ashcrew')&&[row.a,row.b].includes('cpd')));
add('relation-registry-count',canonData?.relations?.length===18,String(canonData?.relations?.length??0));
add('faction-analysis-seven',factionAnalysis?.order?.join('|')==='uac|nhc|sid|fhc|syndicate|ushinoda|haimun');
add('faction-analysis-groups',factionAnalysis?.groups?.map(group=>group.keys.join(',')).join('|')==='uac,nhc,sid,fhc|syndicate,ushinoda,haimun');
add('faction-analysis-depth',factionAnalysis?.order?.every(key=>factionAnalysis.factions[key]?.overview?.length>=3&&factionAnalysis.factions[key]?.chronology?.length>=5&&factionAnalysis.factions[key]?.relations?.length>=3));
add('faction-single-menu',count(index,'data-target="faction-info"')===1&&count(index,'data-target="faction-relation"')===0&&index.includes('<b>세력 분석실</b>'));
add('faction-unified-runtime',factionAnalysisRuntime.includes('data-pc-faction-owner')&&factionAnalysisRuntime.includes('pc-faction-relation-list'));
add('faction-mark-name-index',factionAnalysisRuntime.includes('pc-faction-card')&&factionAnalysis?.order?.every(key=>!('subtitle' in factionAnalysis.factions[key])));
add('faction-auxiliary-page',factionAnalysisRuntime.includes('pc-faction-back')&&factionAnalysisRuntime.includes('#faction-info/${key}')&&factionAnalysisRuntime.includes('renderDossier'));
add('history-faction-renames',worldHistory.includes('S.O.N')&&worldHistory.includes('P.O.H')&&!/신디케이트|하이문/.test(worldHistory));
add('uac-independent-in-history',worldHistory.includes('UN 산하기관은 아니며')&&factionAnalysisSource.includes('UN 산하기관은 아니며'));
for(const file of [structureData?.audio?.ambient,...Object.values(structureData?.audio?.effects||{})]){
  add(`audio-asset:${file}`,!!file&&existsSync(path(`assets/audio/${file}`)));
}
add('locked-dom-exclusion',reconcile.includes('Cults_871104')&&reconcile.includes('Immortality_860201'));

const locked={
  Cults_871104:{inline:'aefa15d45fd74b868223144455da4dae59b5545f61fd5687a3132d8cf27c3429',standalone:'71b052533c33f3c4d9838a55633be82bb64030d4028be2304a48154fa049a740'},
  Immortality_860201:{inline:'38cd38c7db213c15517284155e7a70f98092cf9cae52e18d0be40b85fe73e993',standalone:'1d6c0fb57135631deb7feed3c4f6845f4bd1337e3b7ad34db78f95b8d5855626'}
};
for(const [id,expected] of Object.entries(locked)){
  const inlineHash=hash(article(index,id));
  const standaloneHash=hash(read(`docs/${id}/index.html`));
  add(`locked-inline:${id}`,inlineHash===expected.inline,inlineHash);
  add(`locked-standalone:${id}`,standaloneHash===expected.standalone,standaloneHash);
}

console.log(`Project Curse ${VERSION} package verification`);
checks.forEach(check=>console.log(`${check.pass?'PASS':'FAIL'}  ${check.name}${check.detail?`  ${check.detail}`:''}`));
const failed=checks.filter(check=>!check.pass);
console.log(`\n${checks.length-failed.length}/${checks.length} checks passed`);
if(failed.length) process.exitCode=1;
