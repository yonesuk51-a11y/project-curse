#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const ROOT=fileURLToPath(new URL('../',import.meta.url));
const VERSION='5.38.0';
const ARCHIVE_VERSION='5.35.0';
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
const audioManifest=read('assets/js/data/audio-manifest.js');
const audioController=read('assets/js/core/audio-controller.js');
const operationState=read('assets/js/core/operation-state.js');
const faction=read('assets/js/pages/faction-analysis.js');
const archive=read('assets/js/pages/archive-consolidation.js');
const documentViewer=read('assets/js/pages/archive-document.js');
const documentCss=read('assets/css/archive-document.css');
const visualEvidenceData=read('assets/js/data/visual-evidence-data.js');
const visualEvidenceCss=read('assets/css/visual-evidence.css');
const mediaManifestSource=read('assets/js/data/media-manifest.js');
const adaptiveMediaRuntime=read('assets/js/core/adaptive-media.js');
const adaptiveMediaCss=read('assets/css/adaptive-media.css');
const qualityPolicyRuntime=read('assets/js/core/quality-policy.js');
const qualityPolicyCss=read('assets/css/quality-policy.css');
const manifest=read('assets/js/data/site-manifest.js');
const registry=read('assets/js/data/archive-registry.js');
const documentData=read('assets/js/data/archive-document-data.js');
const fieldDossierData=read('assets/js/data/field-dossier-data.js');
const immortalityStoryboard=read('assets/js/data/immortality-storyboard.js');
const mapRoomRuntime=read('assets/js/pages/map-room.js');
const mapRoomCss=read('assets/css/map-room.css');
const pilgrimageData=read('assets/js/data/pilgrimage-scenario-data.js');
const pilgrimageState=read('assets/js/core/pilgrimage-state.js');
const verdictState=read('assets/js/core/verdict-archive-state.js');
const pilgrimageRuntime=read('assets/js/pages/pilgrimage-scenario.js');
const pilgrimageCss=read('assets/css/pilgrimage-scenario.css');
const terminalHomeRuntime=read('assets/js/pages/terminal-home.js');
const channelIdentityData=read('assets/js/data/channel-identity-data.js');
const channelIdentityRuntime=read('assets/js/core/channel-identity.js');
const channelIdentityCss=read('assets/css/channel-identity.css');
const performanceTelemetry=read('assets/js/core/performance-telemetry.js');

const context={window:{}};
vm.createContext(context);
for(const file of [
  'assets/js/data/build-info.js','assets/js/data/site-manifest.js','assets/js/data/channel-identity-data.js','assets/js/data/archive-registry.js','assets/js/data/archive-document-data.js','assets/js/data/visual-evidence-data.js','assets/js/data/media-manifest.js','assets/js/data/field-dossier-data.js','assets/js/data/regional-drilldown-data.js','assets/js/data/map-room-data.js',
  'assets/js/data/immortality-storyboard.js',
  'assets/js/core/record-cinematic-registry.js','assets/js/pages/cinematic-cults.js','assets/js/pages/cinematic-immortality.js',
  'assets/js/pages/cinematic-ferals.js','assets/js/pages/cinematic-sakuma.js'
]) vm.runInContext(read(file),context,{filename:file});

check('version:manifest',context.window.ProjectCurseStructure?.version===VERSION,context.window.ProjectCurseStructure?.version);
check('version:archive',context.window.ProjectCurseArchive?.version===ARCHIVE_VERSION,context.window.ProjectCurseArchive?.version);
check('version:documents',context.window.ProjectCurseArchiveDocuments?.version==='5.33.0',context.window.ProjectCurseArchiveDocuments?.version);
check('shell:single-static-home',count(index,'class="uac-shell-home"')===1&&index.includes('data-uac-route="terminal-home"'));
check('shell:no-page-injection',!shell.includes('ensureReturnControl')&&!shell.includes('uac-return-terminal'));
check('shell:home-owned-outside-pages',index.indexOf('class="uac-shell-home"')<index.indexOf('<main class="uac-shell-content"'));
check('shell:route-events',shell.includes('projectcurse:route-will-change')&&shell.includes('projectcurse:screen-committed'));
check('shell:decrypt-effect',read('assets/js/core/transition-controller.js').includes('pc-screen-entering')&&read('assets/css/transition-system.css').includes('@keyframes pc-screen-enter'));
check('shell:button-feedback',shellCss.includes('@keyframes uac-control-scan')&&shellCss.includes('@keyframes uac-control-pulse'));
check('shell:five-channel-identity',context.window.ProjectCurseChannelData?.channels?.length===5&&channelIdentityRuntime.includes('ensureIdentity(item.id)'));
check('shell:identity-preferences',channelIdentityData.includes('project_curse_preferences_v1')&&channelIdentityRuntime.includes('openPreferences')&&channelIdentityCss.includes('.pc-preference-dialog'));
check('shell:identity-root-order',index.indexOf('channel-identity-data.js')>index.indexOf('transition-manifest.js')&&index.indexOf('channel-identity.js')>index.indexOf('terminal-home.js'));
check('shell:live-status-telemetry',performanceTelemetry.includes('ProjectCurseTelemetry=Object.freeze')&&channelIdentityRuntime.includes('pc-channel-live')&&channelIdentityCss.includes('.pc-live-diagnostics'));
check('shell:telemetry-root-order',index.indexOf('performance-telemetry.js')>index.indexOf('verdict-archive-state.js')&&index.indexOf('performance-telemetry.js')<index.indexOf('channel-identity.js'));
check('shell:audio-user-activation-gate',audio.includes("node.preload='none'")&&audio.includes('audioUnlocked=true')&&audio.includes('projectcurse:boot-hidden'));
check('shell:adaptive-quality-policy',index.includes(`assets/js/core/quality-policy.js?v=${VERSION}`)&&index.indexOf('quality-policy.js')<index.indexOf('adaptive-media.js')&&qualityPolicyRuntime.includes('ProjectCurseQuality=Object.freeze')&&qualityPolicyCss.includes('.pc-quality-diagnostics'));
check('shell:adaptive-quality-preference',channelIdentityData.includes("quality:{label:'전송 품질'")&&channelIdentityRuntime.includes('renderQuality'));
check('shell:offline-recovery',qualityPolicyRuntime.includes("root.addEventListener('offline'")&&qualityPolicyRuntime.includes('data-pc-connection-retry')&&adaptiveMediaRuntime.includes('function retryFailed'));
check('shell:readable-settings-overview',channelIdentityRuntime.includes('pc-preference-overview')&&channelIdentityRuntime.includes('자동 최적화됨')&&channelIdentityCss.includes('.pc-preference-overview'));
check('shell:grouped-settings',channelIdentityRuntime.includes("['quality','effects','textReveal']")&&channelIdentityRuntime.includes("['interfaceAudio','ambient']")&&channelIdentityCss.includes('.pc-preference-section'));
check('shell:advanced-session-diagnostics',performanceTelemetry.includes('usedJSHeapSize')&&performanceTelemetry.includes('hiddenDuration')&&channelIdentityRuntime.includes('pc-advanced-diagnostics')&&channelIdentityRuntime.includes('data-pc-diagnostics-refresh'));
check('shell:settings-scroll-and-recovery-hitbox',channelIdentityRuntime.includes("scroll.className='pc-preference-scroll'")&&channelIdentityCss.includes('.pc-preference-scroll')&&qualityPolicyCss.includes('.pc-connection-recovery[hidden]'));

check('faction:no-detail-route',!faction.includes('#faction-info/')&&!faction.includes('pushState')&&!faction.includes('replaceState'));
check('faction:no-history-listeners',!faction.includes('hashchange')&&!faction.includes('popstate'));
check('faction:internal-state',faction.includes('let selected=null')&&faction.includes('renderIndex()')&&faction.includes('renderDossier'));

const documents=context.window.ProjectCurseArchive?.publicRecords?.filter(record=>record.format==='document')||[];
check('archive:nine-documents',documents.length===9,documents.length);
check('archive:no-document-hrefs',documents.every(record=>!record.href));
check('archive:no-page-navigation',!archive.includes('location.href')&&!archive.includes('window.location'));
check('archive:internal-open',archive.includes('ProjectCurseInternalDocumentViewer?.open'));
check('archive:internal-host',count(index,'id="archiveInternalDocument"')===1&&count(index,'id="archiveInternalDocumentBody"')===1);
check('archive:no-iframe',!index.toLowerCase().includes('<iframe'));

check('document:viewer-api',documentViewer.includes('ProjectCurseInternalDocumentViewer=Object.freeze'));
check('document:route-free-toc',documentViewer.includes("el('button','archive-doc-toc-link'")&&!documentViewer.includes('href="#section-')&&!documentViewer.includes("`#section-${"));
check('document:embedded-assets',documentViewer.includes("replace(/^(?:\\.\\.\\/)+/,'')"));
check('document:css-scoped',documentCss.includes('body[data-archive-document]')&&!documentCss.includes('\nbody{'));
check('document:root-loaded',index.includes(`assets/css/archive-document.css?v=${VERSION}`)&&index.includes(`assets/js/pages/archive-document.js?v=${VERSION}`)&&index.includes(`assets/js/data/field-dossier-data.js?v=${VERSION}`));
check('evidence:root-loaded',index.includes(`assets/css/visual-evidence.css?v=${VERSION}`)&&index.includes(`assets/js/data/visual-evidence-data.js?v=${VERSION}`)&&index.indexOf('visual-evidence-data.js')<index.indexOf('field-dossier-data.js'));
check('evidence:provenance-classes',['ORIGINAL','STABILIZED','RECONSTRUCTED','UNVERIFIED'].every(key=>context.window.ProjectCurseVisualEvidence?.classes?.[key]));
check('evidence:document-console',documentViewer.includes('function evidenceConsole(items)')&&documentViewer.includes('archive-evidence-card')&&documentViewer.includes('function openEvidence(index,trigger)'));
check('evidence:comparison-viewer',documentViewer.includes("range.type='range'")&&documentViewer.includes('openEvidenceAsset(src,context={},trigger=null)')&&visualEvidenceCss.includes('.pc-evidence-compare'));
check('evidence:cinematic-handoff',read('assets/js/core/record-cinematic-runtime.js').includes('pc-cinematic-evidence-control')&&read('assets/js/core/record-cinematic-runtime.js').includes("document.body.classList.contains('pc-evidence-open')"));
check('media:manifest-twenty-sources',context.window.ProjectCurseMediaManifest?.version==='1.0.0'&&Object.keys(context.window.ProjectCurseMediaManifest?.assets||{}).length===20);
check('media:root-load-order',index.includes(`assets/css/adaptive-media.css?v=${VERSION}`)&&index.indexOf('media-manifest.js')<index.indexOf('adaptive-media.js')&&index.indexOf('adaptive-media.js')<index.indexOf('archive-document.js'));
check('media:responsive-runtime',adaptiveMediaRuntime.includes('image.srcset=variants.map')&&adaptiveMediaRuntime.includes('function prepareRoute(route')&&adaptiveMediaRuntime.includes('function getDiagnostics()'));
check('media:recovery-states',adaptiveMediaCss.includes('.pc-media-loading>img[data-pc-media]')&&adaptiveMediaCss.includes('.pc-media-ready>.pc-media-recovery')&&adaptiveMediaCss.includes('@media(prefers-reduced-motion:reduce)'));
check('media:document-original-on-demand',documentViewer.includes("mode:isHero?'hero':'display'")&&documentViewer.includes("mode:'thumbnail'")&&documentViewer.includes("mode:'original'"));
check('media:comparison-ready-gate',documentViewer.includes('range.disabled=true')&&documentViewer.includes('range.disabled=!complete')&&documentViewer.includes('Promise.all(pending)'));
check('media:transition-warmup',read('assets/js/core/transition-controller.js').includes('ProjectCurseMedia.prepareRoute')&&read('assets/js/core/transition-controller.js').includes('VISUAL CHANNEL / FRAME ACQUISITION'));
check('media:standalone-shells',['Zone_870815','Unknown_Record1_860204','Unknown_Record2_860205','Unknown_Record3_920711','Unknown_Record4_930314'].every(id=>{const source=read(`docs/${id}/index.html`);return source.includes('adaptive-media.css')&&source.includes('media-manifest.js')&&source.includes('adaptive-media.js');}));

check('audio:persistent-context',audio.includes("setContext('document')")||documentViewer.includes("setContext?.('document')"));
check('audio:no-ambient-rewind',!audio.includes('audio.ambient.currentTime=0'));
check('audio:visibility-resume',audio.includes("else if(ambientAllowed&&audioContext!=='cinematic') startAmbient()"));
check('audio:cinematic-compatibility',audio.includes('stopMenuAmbient')&&audio.includes('resumeMenuAmbient')&&audio.includes('syncAudioState'));
check('audio:semantic-profile-manifest',audioManifest.includes("version:'2.3.0'")&&audioManifest.includes("'archive.filter'")&&audioManifest.includes("'great-black-forest'")&&audioManifest.includes("'dead-zone'")&&audioManifest.includes("'scenario.arm'")&&audioManifest.includes("'recovery-scenario'"));
check('audio:ducking-and-bus-limit',audioController.includes('function duckAmbient')&&audioController.includes('function stopBus')&&audioController.includes('activeByBus'));
check('audio:route-profile-sync',audioController.includes('projectcurse:screen-committed')&&audioController.includes('setProfile'));
check('audio:regional-document-profile',documentViewer.includes('setProfile?.(doc.theme')&&documentViewer.includes("'great-black-forest':'region.forest'")&&documentViewer.includes("'dead-zone':'region.deadzone'"));
check('operation:persistent-owner',operationState.includes('ProjectCurseOperationState')&&operationState.includes('localStorage.setItem')&&operationState.includes('visitBranch')&&operationState.includes('chooseVerdict'));
check('operation:four-outcomes',['execute','detain','cooperate','defer'].every(id=>operationState.includes(`${id}:{`)));
check('operation:document-report',documentViewer.includes('archive-scenario-report')&&documentViewer.includes('data-scenario-verdict')&&documentViewer.includes('data-scenario-reset'));
check('operation:root-loaded',index.includes(`assets/js/core/operation-state.js?v=${VERSION}`)&&index.indexOf('assets/js/core/operation-state.js')>index.indexOf('assets/js/core/audio-controller.js')&&index.indexOf('assets/js/core/operation-state.js')<index.indexOf('assets/js/core/record-cinematic-runtime.js'));
const drilldowns=context.window.ProjectCurseRegionalDrilldown?.districts||[];
check('map:drilldown-root-loaded',index.includes(`assets/js/data/regional-drilldown-data.js?v=${VERSION}`)&&index.indexOf('assets/js/data/regional-drilldown-data.js')<index.indexOf('assets/js/data/map-room-data.js'));
check('map:six-drilldowns',drilldowns.length===6&&drilldowns.reduce((total,detail)=>total+detail.sites.length,0)>=38,`${drilldowns.length} districts`);
check('map:four-level-navigation',mapRoomRuntime.includes('data-map-open-detail')&&mapRoomRuntime.includes('data-map-detail-site')&&mapRoomRuntime.includes('pc-map-breadcrumb'));
check('map:verdict-site-sync',mapRoomRuntime.includes('resolveDetailSite')&&drilldowns.filter(detail=>detail.sites.some(site=>site.verdictStates)).length>=2);
const detailRoutes=drilldowns.flatMap(detail=>detail.routes.map(route=>({detail,route})));
check('map:nineteen-route-traces',detailRoutes.length===19&&detailRoutes.every(({route})=>route.siteIds?.length>=2&&route.risk&&route.signal&&route.rule),detailRoutes.length);
check('map:route-focus-and-layers',mapRoomRuntime.includes('routesForSite')&&mapRoomRuntime.includes('renderDetailOverlays')&&mapRoomRuntime.includes('data-map-detail-layer')&&mapRoomRuntime.includes('data-map-route-step'));
check('scenario:reactive-consequence-resolver',pilgrimageData.includes('variants:')&&pilgrimageState.includes('function matchesCondition(condition,state)')&&pilgrimageState.includes('function resolveEnding(')&&verdictState.includes('resolveEnding?.(entry.scenarioId,entry.endingId,snapshot)'));
check('scenario:sealed-choice-feedback',pilgrimageRuntime.includes('function renderFeedback()')&&pilgrimageRuntime.includes('pendingFeedback')&&pilgrimageCss.includes('.pc-pilgrimage-feedback'));
check('scenario:operation-and-home-sync',mapRoomRuntime.includes('scenarioStageByItem')&&mapRoomRuntime.includes('scenarioState.choices[index]?.ruleOutcome')&&mapRoomCss.includes('is-compromised')&&terminalHomeRuntime.includes('const latestTrace=id=>'));

const cinematicIds=context.window.ProjectCurseCinematicRegistry?.ids?.()||[];
check('cinematic:four-records',cinematicIds.join('|')==='Cults_871104|Immortality_860201|Ferals_860722|Sakuma_Tape_991028',cinematicIds.join('|'));
check('cinematic:archive-starts-registry',archive.includes("record.format==='video'")&&archive.includes('ProjectCurseCinematicRegistry?.get?.(id)'));
const cinematicRuntime=read('assets/js/core/record-cinematic-runtime.js');
const cinematicCss=read('assets/css/record-cinematic.css');
const cinematicMobileCss=read('assets/css/record-cinematic-mobile.css');
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
check('mobile:viewport-safe-area',index.includes('viewport-fit=cover')&&cinematicMobileCss.includes('env(safe-area-inset-bottom)'));
check('mobile:cinematic-override-loaded-last',index.includes(`assets/css/record-cinematic-mobile.css?v=${VERSION}`)&&index.indexOf('assets/css/record-cinematic-mobile.css')>index.indexOf('assets/css/app-shell.css'));
check('mobile:phone-stage-scroll-safe',cinematicMobileCss.includes('@media (max-width:600px)')&&cinematicMobileCss.includes('overflow-y:auto!important')&&cinematicMobileCss.includes('overscroll-behavior:contain!important'));
check('mobile:portrait-video-contained',cinematicMobileCss.includes('.pc5152h-cult-sequence.intro-mode .pc5152h-seq-video')&&cinematicMobileCss.includes('object-fit:contain!important'));
check('mobile:touch-controls',cinematicMobileCss.includes('grid-template-columns:repeat(4,minmax(0,1fr))')&&cinematicMobileCss.includes('min-height:44px!important'));
check('mobile:s24-personnel-pair',cinematicMobileCss.includes('grid-template-columns:repeat(2,minmax(0,1fr))')&&cinematicMobileCss.includes('max-width:430px!important'));
check('mobile:landscape-stage',cinematicMobileCss.includes('@media (orientation:landscape) and (max-height:560px)')&&cinematicMobileCss.includes('grid-template-columns:minmax(0,1fr) minmax(220px,.75fr)'));
check('mobile:intrinsic-photo-frame',cinematicMobileCss.includes('width:min(var(--pc-media-width),88vw)!important')&&cinematicMobileCss.includes('.pc5152h-seq-frame.pc-cinematic-frame-fitted'));
check('mobile:landscape-copy-and-controls-fit',cinematicMobileCss.includes('font-size:6px!important')&&cinematicMobileCss.includes('width:min(680px,calc(100vw - 48px))!important')&&cinematicMobileCss.includes('min-height:36px!important'));
check('cinematic:two-column-raised',cinematicCss.includes('pc5152as-layout-two-column .pc5152h-seq-body')&&cinematicCss.includes('translateY(clamp(-96px,-7vh,-54px))'));
check('cinematic:fullscreen-chapter-transition',cinematicCss.includes('.pc5152h-cult-sequence.video-transition .pc5152m-transition-video')&&cinematicCss.includes('position:fixed!important')&&cinematicCss.includes('height:100dvh!important'));
check('cinematic:transition-plays-full-fallback',cinematicRuntime.includes("Number(cfg.transitionFallback||3750)")&&!cinematicRuntime.includes("Math.min(Number(cfg.transitionFallback||3100),1800)"));
check('audio:cinematic-does-not-replace-ambient',!cinematicRuntime.includes("bus.audio.ambient = new Audio")&&!cinematicRuntime.includes("bus.audio.ambient=new Audio"));
check('audio:cinematic-context-hard-stop',cinematicRuntime.includes("bus.setContext('cinematic')")&&cinematicRuntime.includes('ambient.currentTime=0'));
check('audio:record-route-exit-stop',cinematicRuntime.includes('projectcurse:route-will-change')&&cinematicRuntime.includes("document.body.classList.contains('pc5152h-sequence-open')")&&cinematicRuntime.includes('pc5152h-cult-source-sequence'));
check('audio:profile-bus-cleanup',audioController.includes("if(resolved!==profileId)")&&audioController.includes("stopBus('record')")&&audioController.includes("stopBus('interface')"));
check('audio:single-root-owner',count(index,'assets/js/core/base-runtime.js')===1&&!index.includes('assets/js/main.js'));
check('audio:no-cinematic-bus-installer',!cinematicRuntime.includes('installClearAudioBus')&&!cinematicRuntime.includes('__pc5152cxCinematicCuesInstalled'));
check('audio:sequence-silence-at-entry',count(cinematicRuntime,'silenceMenuAmbientDuringSequence();')>=2);
check('cinematic:single-chapter-boundary-rule',cinematicRuntime.includes("current.group!==next.group&&getSequenceConfig()?.transitionVideo")&&!cinematicRuntime.includes("current.group==='system' && next.group==='cult'"));
const immortalityPages=context.window.ProjectCurseImmortalityStoryboard||[];
check('immortality:canonical-storyboard-loaded',index.includes(`assets/js/data/immortality-storyboard.js?v=${VERSION}`)&&immortalityPages.length===24,immortalityPages.length);
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
for(const ref of fieldDossierData.matchAll(/src:'(\.\.\/\.\.\/assets\/[^']+)'/g)){
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
].every(file=>index.includes(`${file}?v=${VERSION}`)));
check('cache:cinematic-busters',index.includes(`assets/css/record-cinematic.css?v=${VERSION}`)&&index.includes(`assets/js/core/record-cinematic-runtime.js?v=${VERSION}`));
check('cache:mobile-cinematic-buster',index.includes(`assets/css/record-cinematic-mobile.css?v=${VERSION}`));
check('manifest:viewer-owner',manifest.includes("archiveDocumentViewer:'assets/js/pages/archive-document.js'"));
check('registry:no-href-field',!registry.includes("href:'docs/"));

const failed=results.filter(result=>!result.pass);
results.forEach(result=>console.log(`${result.pass?'PASS':'FAIL'} ${result.name}${result.detail?` :: ${result.detail}`:''}`));
console.log(`\n${results.length-failed.length}/${results.length} checks passed`);
if(failed.length) process.exitCode=1;
