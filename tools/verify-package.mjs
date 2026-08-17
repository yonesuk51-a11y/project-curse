#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync,readFileSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const VERSION='5.31.0';
const DATA_VERSION='5.31.0';
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
  'index.html','assets/favicon.svg','assets/css/style.css','assets/css/stabilization.css','assets/css/archive-consolidation.css','assets/css/archive-document.css','assets/css/visual-evidence.css','assets/css/adaptive-media.css','assets/css/verdict-archive.css','assets/css/record-cinematic.css','assets/css/world-history.css','assets/css/faction-analysis.css','assets/css/map-room.css','assets/css/pilgrimage-scenario.css','assets/css/app-shell.css','assets/css/terminal-foundation.css','assets/css/transition-system.css','assets/css/channel-identity.css',
  'assets/js/data/build-info.js','assets/js/data/site-manifest.js','assets/js/data/audio-manifest.js','assets/js/data/transition-manifest.js','assets/js/data/channel-identity-data.js','assets/js/data/canon-registry.js','assets/js/data/incident-registry.js','assets/js/data/faction-analysis-data.js','assets/js/data/archive-registry.js','assets/js/data/archive-document-data.js','assets/js/data/visual-evidence-data.js','assets/js/data/media-manifest.js','assets/js/data/field-dossier-data.js','assets/js/data/regional-drilldown-data.js','assets/js/data/pilgrimage-scenario-data.js','assets/js/data/verdict-archive-data.js','assets/js/data/map-room-data.js','assets/js/data/home-intelligence-data.js','assets/js/main.js','assets/js/core/loading-sequence.js','assets/js/core/base-runtime.js','assets/js/core/audio-controller.js','assets/js/core/adaptive-media.js','assets/js/core/operation-state.js','assets/js/core/pilgrimage-state.js','assets/js/core/verdict-archive-state.js','assets/js/core/performance-telemetry.js','assets/js/core/transition-controller.js','assets/js/core/record-cinematic-runtime.js','assets/js/core/app-shell.js','assets/js/core/channel-identity.js',
  'assets/js/data/feral-cinematic-data.js','assets/js/data/sakuma-cinematic-data.js',
  'assets/js/core/record-cinematic-registry.js','assets/js/pages/cinematic-cults.js','assets/js/pages/cinematic-immortality.js','assets/js/pages/cinematic-ferals.js','assets/js/pages/cinematic-sakuma.js',
  'assets/js/pages/shared-declutter.js',
  'assets/js/pages/canon-reconciliation.js','assets/js/pages/archive-consolidation.js','assets/js/pages/archive-document.js','assets/js/pages/world-history.js','assets/js/pages/faction-analysis.js','assets/js/pages/map-room.js','assets/js/pages/pilgrimage-scenario.js','assets/js/pages/terminal-home.js','ASSET_POLICY.md','assets/resources/ASSET_REGISTRY.md',
  'assets/resources/derived/great-black-forest_reconstructed-v1.png','assets/resources/derived/dead-zone-pilgrimage_reconstructed-v1.png',
  'assets/audio/pc5152am_immortality_scp087_theme.mp3',
  'assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3',
  'assets/audio/pc5152cf_feral_dying_memories_bgm.mp3',
  'assets/audio/pc5152an_cult_radio_static_layer.mp3',
  'assets/audio/pc5152h_terminal_contact_clear.wav',
  'assets/audio/pc5152f_analog_contact_soft.wav',
  'assets/audio/pc5152h_record_mount_clear.wav',
  'assets/audio/pc5152p_internal_projector_vhs_step.wav',
  'assets/audio/pc5152x_late_log_beep_195s.mp3',
  'assets/audio/pc5152v_field_photo_click_42s.mp3',
  'assets/audio/pc5152v_comm_line_cue_73_74.mp3',
  'docs/Cults_871104/index.html','docs/Immortality_860201/index.html'
];
required.forEach(relative=>add(`required:${relative}`,existsSync(path(relative))));

const index=read('index.html');
const main=read('assets/js/core/record-cinematic-runtime.js');
const standaloneRuntime=read('assets/js/main.js');
const canon=read('assets/js/data/canon-registry.js');
const reconcile=read('assets/js/pages/canon-reconciliation.js');
const manifest=read('assets/js/data/site-manifest.js');
const archiveRegistry=read('assets/js/data/archive-registry.js');
const visualEvidenceData=read('assets/js/data/visual-evidence-data.js');
const visualEvidenceCss=read('assets/css/visual-evidence.css');
const mediaManifestSource=read('assets/js/data/media-manifest.js');
const adaptiveMediaRuntime=read('assets/js/core/adaptive-media.js');
const adaptiveMediaCss=read('assets/css/adaptive-media.css');
const fieldDossierData=read('assets/js/data/field-dossier-data.js');
const homeIntelligenceData=read('assets/js/data/home-intelligence-data.js');
const terminalHomeRuntime=read('assets/js/pages/terminal-home.js');
const archiveRuntime=read('assets/js/pages/archive-consolidation.js');
const factionAnalysisSource=read('assets/js/data/faction-analysis-data.js');
const factionAnalysisRuntime=read('assets/js/pages/faction-analysis.js');
const worldHistory=read('assets/js/pages/world-history.js');
const appShell=read('assets/js/core/app-shell.js');
const appShellCss=read('assets/css/app-shell.css');
const foundationCss=read('assets/css/terminal-foundation.css');
const loadingRuntime=read('assets/js/core/loading-sequence.js');
const baseRuntime=read('assets/js/core/base-runtime.js');
const audioManifest=read('assets/js/data/audio-manifest.js');
const audioController=read('assets/js/core/audio-controller.js');
const operationState=read('assets/js/core/operation-state.js');
const pilgrimageDataSource=read('assets/js/data/pilgrimage-scenario-data.js');
const verdictDataSource=read('assets/js/data/verdict-archive-data.js');
const pilgrimageState=read('assets/js/core/pilgrimage-state.js');
const verdictState=read('assets/js/core/verdict-archive-state.js');
const pilgrimageRuntime=read('assets/js/pages/pilgrimage-scenario.js');
const pilgrimageCss=read('assets/css/pilgrimage-scenario.css');
const verdictCss=read('assets/css/verdict-archive.css');
const transitionManifest=read('assets/js/data/transition-manifest.js');
const channelIdentityDataSource=read('assets/js/data/channel-identity-data.js');
const channelIdentityRuntime=read('assets/js/core/channel-identity.js');
const channelIdentityCss=read('assets/css/channel-identity.css');
const performanceTelemetry=read('assets/js/core/performance-telemetry.js');
const incidentRegistrySource=read('assets/js/data/incident-registry.js');
const regionalDrilldownSource=read('assets/js/data/regional-drilldown-data.js');
const transitionController=read('assets/js/core/transition-controller.js');
const transitionCss=read('assets/css/transition-system.css');
const mapRoomDataSource=read('assets/js/data/map-room-data.js');
const mapRoomRuntime=read('assets/js/pages/map-room.js');
const mapRoomCss=read('assets/css/map-room.css');
const recordCinematicCss=read('assets/css/record-cinematic.css');
const cinematicRegistrySource=read('assets/js/core/record-cinematic-registry.js');
const cinematicCults=read('assets/js/pages/cinematic-cults.js');
const cinematicImmortality=read('assets/js/pages/cinematic-immortality.js');
const cinematicFerals=read('assets/js/pages/cinematic-ferals.js');
const cinematicSakuma=read('assets/js/pages/cinematic-sakuma.js');
const context={window:{}};
vm.createContext(context);
vm.runInContext(read('assets/js/data/build-info.js'),context,{filename:'build-info.js'});
vm.runInContext(manifest,context,{filename:'site-manifest.js'});
vm.runInContext(audioManifest,context,{filename:'audio-manifest.js'});
vm.runInContext(transitionManifest,context,{filename:'transition-manifest.js'});
vm.runInContext(channelIdentityDataSource,context,{filename:'channel-identity-data.js'});
vm.runInContext(canon,context,{filename:'canon-registry.js'});
vm.runInContext(incidentRegistrySource,context,{filename:'incident-registry.js'});
vm.runInContext(factionAnalysisSource,context,{filename:'faction-analysis-data.js'});
vm.runInContext(archiveRegistry,context,{filename:'archive-registry.js'});
vm.runInContext(read('assets/js/data/archive-document-data.js'),context,{filename:'archive-document-data.js'});
vm.runInContext(visualEvidenceData,context,{filename:'visual-evidence-data.js'});
vm.runInContext(mediaManifestSource,context,{filename:'media-manifest.js'});
vm.runInContext(fieldDossierData,context,{filename:'field-dossier-data.js'});
vm.runInContext(regionalDrilldownSource,context,{filename:'regional-drilldown-data.js'});
vm.runInContext(pilgrimageDataSource,context,{filename:'pilgrimage-scenario-data.js'});
vm.runInContext(verdictDataSource,context,{filename:'verdict-archive-data.js'});
vm.runInContext(mapRoomDataSource,context,{filename:'map-room-data.js'});
vm.runInContext(homeIntelligenceData,context,{filename:'home-intelligence-data.js'});
vm.runInContext(read('assets/js/data/feral-cinematic-data.js'),context,{filename:'feral-cinematic-data.js'});
vm.runInContext(read('assets/js/data/sakuma-cinematic-data.js'),context,{filename:'sakuma-cinematic-data.js'});
vm.runInContext(cinematicRegistrySource,context,{filename:'record-cinematic-registry.js'});
vm.runInContext(cinematicCults,context,{filename:'cinematic-cults.js'});
vm.runInContext(cinematicImmortality,context,{filename:'cinematic-immortality.js'});
vm.runInContext(cinematicFerals,context,{filename:'cinematic-ferals.js'});
vm.runInContext(cinematicSakuma,context,{filename:'cinematic-sakuma.js'});
const canonData=context.window.ProjectCurseCanon;
const incidentData=context.window.ProjectCurseIncidentNetwork;
const factionAnalysis=context.window.ProjectCurseFactionAnalysis;
const structureData=context.window.ProjectCurseStructure;
const archiveData=context.window.ProjectCurseArchive;
const cinematicData=context.window.ProjectCurseCinematicRegistry;
const pilgrimageData=context.window.ProjectCursePilgrimageData;
const verdictData=context.window.ProjectCurseVerdictArchiveData;
const visualEvidence=context.window.ProjectCurseVisualEvidence;
const mediaManifest=context.window.ProjectCurseMediaManifest;
const channelIdentityData=context.window.ProjectCurseChannelData;
const ordered=[
  'assets/js/data/build-info.js','assets/js/data/site-manifest.js','assets/js/data/audio-manifest.js','assets/js/data/transition-manifest.js','assets/js/data/channel-identity-data.js','assets/js/data/canon-registry.js','assets/js/data/incident-registry.js','assets/js/data/faction-analysis-data.js','assets/js/data/archive-registry.js','assets/js/data/archive-document-data.js','assets/js/data/visual-evidence-data.js','assets/js/data/field-dossier-data.js','assets/js/data/regional-drilldown-data.js','assets/js/data/pilgrimage-scenario-data.js','assets/js/data/verdict-archive-data.js','assets/js/data/map-room-data.js','assets/js/data/home-intelligence-data.js','assets/js/data/feral-cinematic-data.js','assets/js/data/sakuma-cinematic-data.js',
  'assets/js/core/record-cinematic-registry.js','assets/js/pages/cinematic-cults.js','assets/js/pages/cinematic-immortality.js','assets/js/pages/cinematic-ferals.js','assets/js/pages/cinematic-sakuma.js','assets/js/core/loading-sequence.js','assets/js/core/base-runtime.js','assets/js/core/audio-controller.js','assets/js/core/operation-state.js','assets/js/core/pilgrimage-state.js','assets/js/core/verdict-archive-state.js','assets/js/core/performance-telemetry.js','assets/js/core/record-cinematic-runtime.js','assets/js/core/transition-controller.js','assets/js/core/app-shell.js','assets/js/pages/shared-declutter.js',
  'assets/js/pages/canon-reconciliation.js','assets/js/pages/archive-consolidation.js','assets/js/pages/world-history.js','assets/js/pages/faction-analysis.js','assets/js/pages/map-room.js','assets/js/pages/pilgrimage-scenario.js','assets/js/pages/terminal-home.js','assets/js/core/channel-identity.js'
];
const positions=ordered.map(owner=>index.indexOf(`src="${owner}?`));
add('script-order',positions.every((position,i)=>position>=0&&(i===0||position>positions[i-1])),positions.join(','));
add('stabilization-css-link',count(index,'href="assets/css/stabilization.css?')===1);
add('archive-css-link',count(index,'href="assets/css/archive-consolidation.css?')===1);
add('visual-evidence-css-link',count(index,'href="assets/css/visual-evidence.css?')===1);
add('verdict-css-link',count(index,'href="assets/css/verdict-archive.css?')===1);
add('record-cinematic-css-link',count(index,'href="assets/css/record-cinematic.css?')===1);
add('app-shell-css-link',count(index,'href="assets/css/app-shell.css?')===1);
add('foundation-css-link',count(index,'href="assets/css/terminal-foundation.css?')===1);
add('transition-css-link',count(index,'href="assets/css/transition-system.css?')===1);
add('channel-identity-css-link',count(index,'href="assets/css/channel-identity.css?')===1&&index.indexOf('channel-identity.css')>index.indexOf('transition-system.css'));
add('channel-identity-five-channels',channelIdentityData?.channels?.length===5&&channelIdentityData.channels.map(channel=>channel.id).join('|')==='terminal-home|map-room|history|faction-info|archive-entry');
add('channel-identity-distinct-themes',new Set(channelIdentityData?.channels?.map(channel=>channel.theme)).size===5&&['command','cartography','chronology','intelligence','archive'].every(theme=>channelIdentityCss.includes(`[data-pc-channel-theme="${theme}"]`)||channelIdentityCss.includes(`[data-channel-theme="${theme}"]`)));
add('channel-identity-runtime-api',channelIdentityRuntime.includes('ProjectCurseChannelIdentity=Object.freeze')&&channelIdentityRuntime.includes('function ensureIdentity')&&channelIdentityRuntime.includes('projectcurse:screen-committed')&&channelIdentityRuntime.includes("control.setAttribute('aria-current','page')"));
add('channel-preference-persistence',channelIdentityData?.storageKey==='project_curse_preferences_v1'&&channelIdentityRuntime.includes('localStorage.setItem')&&channelIdentityRuntime.includes('data-pc-preference'));
add('channel-preference-audio-buses',channelIdentityRuntime.includes('ProjectCurseAudioControl?.update')&&channelIdentityRuntime.includes("interface:.34")&&channelIdentityRuntime.includes("ambient:preferences.ambient==='on'?1:0"));
add('channel-preference-reduced-motion',channelIdentityRuntime.includes("prefers-reduced-motion: reduce")&&channelIdentityCss.includes(':root[data-pc-effects="reduced"]')&&channelIdentityCss.includes('@media(prefers-reduced-motion:reduce)'));
add('channel-mobile-navigation',channelIdentityCss.includes('@media(max-width:600px)')&&channelIdentityCss.includes('grid-template-columns:1fr!important')&&channelIdentityCss.includes('max-height:calc(100dvh - 82px)')&&channelIdentityRuntime.includes('pc-mobile-preference-link'));
add('telemetry-runtime-owned',structureData?.owners?.performanceTelemetry==='assets/js/core/performance-telemetry.js'&&performanceTelemetry.includes('ProjectCurseTelemetry=Object.freeze')&&performanceTelemetry.includes('getChannelStatus'));
add('telemetry-live-five-channels',['terminal-home','map-room','history','faction-info','archive-entry'].every(id=>performanceTelemetry.includes(`id==='${id}'`))&&channelIdentityRuntime.includes('ProjectCurseTelemetry?.getChannelStatus'));
add('telemetry-performance-observers',performanceTelemetry.includes("observe('largest-contentful-paint'")&&performanceTelemetry.includes("observe('layout-shift'")&&performanceTelemetry.includes("observe('longtask'"));
add('telemetry-boot-and-transition-timing',performanceTelemetry.includes('projectcurse:boot-hidden')&&performanceTelemetry.includes('projectcurse:transition-complete')&&channelIdentityRuntime.includes('data-pc-telemetry="transition"'));
add('audio-deferred-until-activation',baseRuntime.includes("node.preload='none'")&&baseRuntime.includes('audioUnlocked')&&baseRuntime.includes('navigator.userActivation?.hasBeenActive'));
add('record-cinematic-controls',main.includes('pc-cinematic-controls')&&main.includes('scheduleAutomaticAdvance')&&main.includes('ProjectCurseRecordCinematic'));
add('record-cinematic-navigation',main.includes('previousSequence')&&main.includes('toggleSequencePlayback')&&main.includes('restartSequence'));
add('feral-cinematic-runtime',main.includes("const FERALS_RECORD='Ferals_860722'")&&cinematicFerals.includes("id:'Ferals_860722'")&&cinematicFerals.includes('ProjectCurseFeralCinematic?.pages')&&main.includes('state.activeRecord===FERALS_RECORD')&&main.includes('highlightFeralTerms'));
add('sequence-menu-ambient-isolated',main.includes('function silenceMenuAmbientDuringSequence')&&main.includes("bus.setContext==='function'")&&main.includes("bus.setContext('cinematic')")&&main.includes('ambient.pause()')&&count(main,'silenceMenuAmbientDuringSequence();')>=2);
add('cult-feral-shared-intro-video',cinematicCults.includes("introVideo:'assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4'")&&cinematicFerals.includes("introVideo:'assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4'")&&existsSync(path('assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4')));
add('cult-feral-radio-static-layer',hash(readFileSync(path('assets/audio/pc5152an_cult_radio_static_layer.mp3')))==='3ad8d1b5cb05a8599c4b6058d3c79574b5e6df7c8683631d53a5be7227c4f164'&&main.includes("assets/audio/pc5152an_cult_radio_static_layer.mp3"));
add('archive-return-boot-bypass',index.includes('__pc5152SkipBoot=true')&&index.includes("get('return')==='archive'")&&standaloneRuntime.includes('standalone records return to the archive')&&standaloneRuntime.includes('index.html?return=archive#archive-entry')&&read('assets/css/style.css').includes('html.pc5152cf-archive-return #loader'));
add('record-cinematic-configurable-transitions',main.includes('Number(cfg.transitionFallback||3750)')&&main.includes('Number(cfg.introFallback||10450)'));
add('immortality-full-length-bgm',statSync(path('assets/audio/pc5152am_immortality_scp087_theme.mp3')).size>9_000_000,statSync(path('assets/audio/pc5152am_immortality_scp087_theme.mp3')).size);
add('cult-full-length-looping-bgm',statSync(path('assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3')).size>8_000_000&&cinematicCults.includes("assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3")&&main.includes('state.bgm.loop = true'),statSync(path('assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3')).size);
add('feral-custom-bgm',statSync(path('assets/audio/pc5152cf_feral_dying_memories_bgm.mp3')).size>1_000_000,statSync(path('assets/audio/pc5152cf_feral_dying_memories_bgm.mp3')).size);
add('canon-faction-owner',factionAnalysisSource.includes('ProjectCurseFactionAnalysis')&&factionAnalysisRuntime.includes('ProjectCurseFactionAnalysis'));
add('canon-relation-owner',Array.isArray(canonData?.relations)&&canonData.relations.length===18&&factionAnalysisRuntime.includes('function relationButton')&&factionAnalysisRuntime.includes('faction.relations.map(relationButton)'));
add('canon-direct-current-names',!canon.includes('Urban Anomaly Containment')&&!canon.includes('신디케이트')&&!canon.includes('하이문')&&!canon.includes('normalizeTerms')&&!factionAnalysisSource.includes('신디케이트')&&!factionAnalysisSource.includes('하이문')&&!factionAnalysisSource.includes('normalizeTerms'));
add('single-shell-no-sidebar',!index.includes('side-menu')&&!index.includes('uac-shell-drawer')&&!appShell.includes('translateX'));
add('shell-quick-nav-four-links',(index.match(/<a[^>]+data-uac-route="(?:map-room|history|faction-info|archive-entry)"[^>]*>/g)||[]).length>=4&&appShell.includes('closeQuickNav'));
add('home-dashboard-primary-control',index.includes('class="pc-terminal-primary"')&&index.includes('class="pc-terminal-alert"')&&index.includes('class="pc-terminal-recent"'));
add('home-live-intelligence-feed',context.window.ProjectCurseHomeIntelligence?.version===VERSION&&context.window.ProjectCurseHomeIntelligence?.signals?.length===4&&terminalHomeRuntime.includes('ProjectCurseHomeRuntime')&&terminalHomeRuntime.includes('archive?.publicRecords?.length'));
add('home-data-driven-metrics',terminalHomeRuntime.includes('${records} OPEN')&&terminalHomeRuntime.includes('${operations} ACTIVE')&&terminalHomeRuntime.includes('${unresolved} SIGNALS'));
add('home-deep-links',appShell.includes('dataset.uacArchiveRecord')&&appShell.includes('ProjectCurseRuntimeModules?.archiveIndex?.open')&&appShell.includes('dataset.uacMapIncident')&&terminalHomeRuntime.includes('data-uac-map-operation')&&terminalHomeRuntime.includes('data-uac-archive-record'));
add('operation-state-owned',structureData?.owners?.operationState==='assets/js/core/operation-state.js'&&operationState.includes('ProjectCurseOperationState=Object.freeze')&&count(index,'assets/js/core/operation-state.js')===1);
add('operation-state-persistence',operationState.includes("storageKey='pc_operation_broken_crown_v1'")&&operationState.includes('localStorage.setItem')&&operationState.includes('localStorage.removeItem')&&operationState.includes('projectcurse:operation-state-change'));
add('operation-four-verdicts',['execute','detain','cooperate','defer'].every(id=>operationState.includes(`${id}:{`))&&operationState.includes("branchIds=['signal','witness','deadzone']"));
add('operation-safe-reset',operationState.includes('function reset()')&&read('assets/js/pages/archive-document.js').includes('confirmReset')&&read('assets/js/pages/archive-document.js').includes('한 번 더 눌러 초기화 확인'));
add('operation-scenario-report',read('assets/js/pages/archive-document.js').includes('archive-scenario-verdicts')&&read('assets/js/pages/archive-document.js').includes('archive-scenario-report')&&read('assets/js/pages/archive-document.js').includes('operation.chooseVerdict'));
add('operation-map-outcome-sync',mapRoomRuntime.includes('operationStore.getDecision')&&mapRoomRuntime.includes('pc-op-route--verdict')&&mapRoomRuntime.includes('decision?.siteStates')&&mapRoomRuntime.includes('stepStates'));
add('operation-home-resume',terminalHomeRuntime.includes('operationState?.getSummary')&&terminalHomeRuntime.includes('작전 분석 재개')&&terminalHomeRuntime.includes('VERDICT SAVED')&&terminalHomeRuntime.includes('projectcurse:operation-state-change'));
const unlitPilgrimage=pilgrimageData?.scenarios?.['unlit-fortress'];
const deadzoneReturn=pilgrimageData?.scenarios?.['deadzone-return'];
const deadzoneRecovery=pilgrimageData?.scenarios?.['deadzone-recovery'];
const reactiveStages=Object.values(pilgrimageData?.scenarios||{}).flatMap(scenario=>scenario.stages||[]).filter(stage=>stage.variants?.length);
add('pilgrimage-six-stage-scenario',unlitPilgrimage?.stages?.length===6&&Object.keys(unlitPilgrimage?.endings||{}).sort().join('|')==='breach|retreat|sanctuary'&&unlitPilgrimage.stages.every(stage=>stage.rule&&stage.choices?.length>=2));
add('deadzone-six-stage-return-screening',deadzoneReturn?.stages?.length===6&&Object.keys(deadzoneReturn?.endings||{}).sort().join('|')==='approved|fifth|reverse|sealed'&&deadzoneReturn.stages.every(stage=>stage.rule&&stage.choices?.length>=2));
add('deadzone-four-screening-metrics',deadzoneReturn?.metrics?.map(metric=>metric.key).join('|')==='identity|exposure|coherence|trust'&&deadzoneReturn.stages.every(stage=>stage.choices.every(choice=>deadzoneReturn.metrics.some(metric=>Object.hasOwn(choice.deltas||{},metric.key)))));
add('deadzone-six-stage-outbound-recovery',deadzoneRecovery?.stages?.length===6&&Object.keys(deadzoneRecovery?.endings||{}).sort().join('|')==='buried|recovered|relay'&&deadzoneRecovery?.unlock?.id==='DZ-VR-04'&&deadzoneRecovery.stages.every(stage=>stage.rule&&stage.choices?.length>=2));
add('deadzone-recovery-four-metrics',deadzoneRecovery?.metrics?.map(metric=>metric.key).join('|')==='team|tether|depth|echo'&&deadzoneRecovery.stages.every(stage=>stage.choices.every(choice=>deadzoneRecovery.metrics.some(metric=>Object.hasOwn(choice.deltas||{},metric.key)))));
add('pilgrimage-persistent-state',structureData?.owners?.pilgrimageState==='assets/js/core/pilgrimage-state.js'&&pilgrimageState.includes("storageKey='pc_pilgrimage_states_v2'")&&pilgrimageState.includes("legacyKey='pc_pilgrimage_state_v1'")&&pilgrimageState.includes('localStorage.setItem')&&pilgrimageState.includes('projectcurse:pilgrimage-state-change')&&pilgrimageState.includes('function getAllSummaries()')&&pilgrimageState.includes('function choose(choiceId,id=activeScenarioId)'));
add('pilgrimage-immersive-runtime',pilgrimageRuntime.includes('ProjectCursePilgrimageRuntime')&&pilgrimageRuntime.includes('pc-pilgrimage-map')&&pilgrimageRuntime.includes('data-pilgrimage-choice')&&pilgrimageRuntime.includes('overlay.dataset.theme')&&pilgrimageRuntime.includes('한 번 더 누르면 현재 진행이 초기화됩니다'));
add('pilgrimage-map-home-sync',mapRoomRuntime.includes('data-map-open-pilgrimage')&&mapRoomRuntime.includes('resolvePilgrimageTarget')&&mapRoomRuntime.includes("'deadzone-return'")&&terminalHomeRuntime.includes("pilgrimage:'deadzone-return'")&&terminalHomeRuntime.includes('data-uac-pilgrimage')&&appShell.includes('dataset.uacPilgrimage'));
add('pilgrimage-archive-direct-entry',read('assets/js/pages/archive-document.js').includes("doc.sourceId==='Dead_Zone_Pilgrimage'?'deadzone-return'")&&read('assets/js/pages/archive-document.js').includes("doc.sourceId==='Great_Black_Forest_Region'?'unlit-fortress'")&&read('assets/js/pages/archive-document.js').includes('button.dataset.archiveOpenPilgrimage=scenarioId'));
add('pilgrimage-responsive-presentation',pilgrimageCss.includes('@media(max-width:900px)')&&pilgrimageCss.includes('@media(max-width:520px)')&&pilgrimageCss.includes('@media(prefers-reduced-motion:reduce)'));
add('pilgrimage-reactive-cross-stage-variants',pilgrimageData?.version==='2.1.0'&&reactiveStages.length>=10&&[unlitPilgrimage,deadzoneReturn,deadzoneRecovery].every(scenario=>scenario.stages.some(stage=>stage.variants?.length)),reactiveStages.length);
add('pilgrimage-reactive-ending-variants',deadzoneRecovery?.endings?.recovered?.variants?.length>=1&&deadzoneRecovery?.endings?.relay?.variants?.length>=1&&JSON.stringify(deadzoneRecovery.endings).includes('처음부터 있던 중계자'));
add('pilgrimage-reactive-state-resolver',pilgrimageState.includes('function matchesCondition(condition,state)')&&pilgrimageState.includes('function resolveContent(base,state)')&&pilgrimageState.includes('function getStage(')&&pilgrimageState.includes('function resolveEnding('));
add('pilgrimage-sealed-choice-feedback',pilgrimageRuntime.includes('pendingFeedback')&&pilgrimageRuntime.includes('function renderFeedback()')&&pilgrimageRuntime.includes('after.status===\'complete\'?1350:1050')&&pilgrimageCss.includes('.pc-pilgrimage-feedback'));
add('pilgrimage-reactive-verdict-snapshot',verdictState.includes('pilgrimage.resolveEnding?.(entry.scenarioId,entry.endingId,snapshot)')&&verdictState.includes('pilgrimage.getStage?.(entry.scenarioId,stageIndex,snapshot)'));
add('verdict-ten-outcome-records',verdictData?.records?.length===10&&new Set(verdictData.records.map(record=>`${record.scenarioId}:${record.endingId}`)).size===10&&verdictData.records.filter(record=>record.scenarioId==='unlit-fortress').length===3&&verdictData.records.filter(record=>record.scenarioId==='deadzone-return').length===4&&verdictData.records.filter(record=>record.scenarioId==='deadzone-recovery').length===3);
add('verdict-gated-recovery-chain',verdictData?.records?.find(record=>record.id==='DZ-VR-04')?.unlockScenario==='deadzone-recovery'&&pilgrimageRuntime.includes('accessFor(id)')&&read('assets/js/pages/archive-document.js').includes('doc.unlockScenario')&&archiveRuntime.includes("group('deadzone-recovery'"));
add('verdict-persistent-snapshots',structureData?.owners?.verdictArchiveState==='assets/js/core/verdict-archive-state.js'&&verdictState.includes("storageKey='pc_verdict_archive_state_v1'")&&verdictState.includes('choices:(current?.choices||[])')&&verdictState.includes('metrics:{...summary.metrics}')&&verdictState.includes('function getDocument(id)'));
add('verdict-read-and-reset-state',verdictState.includes('function markRead(id)')&&verdictState.includes('function resetRead()')&&verdictState.includes('function clearScenario(scenarioId)')&&verdictState.includes('function clearAll()')&&archiveRuntime.includes('data-verdict-reset'));
add('verdict-archive-presentation',archiveRuntime.includes('FIELD VERDICT ARCHIVE')&&archiveRuntime.includes('pc-verdict-row')&&read('assets/js/pages/archive-document.js').includes("doc.presentation==='verdict'")&&verdictCss.includes('[data-presentation="verdict"]'));
add('verdict-home-and-ending-links',terminalHomeRuntime.includes('projectcurse:verdict-archive-change')&&terminalHomeRuntime.includes('NEW RECORD DECRYPTED')&&pilgrimageRuntime.includes('data-pilgrimage-open-verdict'));
add('mobile-quick-menu',foundationCss.includes('.uac-shell-bar.is-quick-open .uac-shell-quick')&&appShell.includes("switchControl?.addEventListener('click'"));
add('initial-route-terminal-home',index.includes('pc5152ca1-terminal-home active')&&appShell.includes("commitRoute(initialRoute,initialRoute,'replace')"));
add('route-clears-inert-synchronously',appShell.includes("page.removeAttribute('inert')")&&appShell.includes("page.setAttribute('inert','')"));
add('single-shell-runtime-owner',structureData?.owners?.shellRuntime==='assets/js/core/app-shell.js'&&count(index,'assets/js/core/app-shell.js')===1&&!index.includes('assets/js/core/runtime-ownership.js')&&!index.includes('assets/js/core/menu-audio-runtime.js')&&!index.includes('assets/js/main.js'));
add('menu-navigation-cues-disabled',!appShell.includes('playCue')&&!appShell.includes('ProjectCurseAudio'));
add('retired-region-screen-removed',!index.includes('id="region-map"')&&!index.includes('data-target="region-map"')&&!index.includes('pc5152bd-region-situation-map')&&!index.includes('pc5152bf-regional-map-linked-usability'));
add('retired-relation-screen-removed',!index.includes('id="faction-relation"')&&!index.includes('data-target="faction-relation"'));
add('current-five-screen-manifest',structureData?.screens?.map(screen=>screen.id).join('|')==='terminal-home|map-room|history|faction-info|archive-entry');
add('legacy-route-compatibility',appShell.includes("target==='faction-relation'")&&appShell.includes("target==='region-map'||target==='zone-map'"));
add('loading-sequence-owned',loadingRuntime.includes('ProjectCurseLoading')&&loadingRuntime.includes('prefers-reduced-motion')&&loadingRuntime.includes("return hasSeen()?'restore':'cold'")&&index.includes('data-boot-skip'));
add('loading-modes-and-readable-timing',loadingRuntime.includes('duration:7800')&&loadingRuntime.includes('duration:4800')&&loadingRuntime.includes('duration:1050')&&loadingRuntime.includes('duration:3000')&&loadingRuntime.includes('FINAL ACCESS HOLD')&&loadingRuntime.includes('SESSION_KEY=()=>')&&loadingRuntime.includes("get('boot')"));
add('audio-controller-owned',audioManifest.includes('ProjectCurseAudioManifest')&&audioController.includes('ProjectCurseAudioControl')&&index.includes('data-uac-audio-toggle'));
add('semantic-field-audio',context.window.ProjectCurseAudioManifest?.version==='2.1.0'&&['map.layer','map.signal','operation.step','history.open','faction.open','incident.link','scenario.reveal','scenario.complete','pilgrimage.enter','pilgrimage.step','pilgrimage.danger','pilgrimage.complete','pilgrimage.exit','screening.enter','screening.step','screening.mismatch','screening.complete','screening.exit'].every(event=>context.window.ProjectCurseAudioManifest.events[event]));
add('semantic-evidence-audio',['evidence.open','evidence.compare','evidence.filter','evidence.close'].every(event=>context.window.ProjectCurseAudioManifest?.events?.[event]));
add('acoustic-screen-profiles',['terminal-home','map-room','history','faction-info','archive-entry','document','great-black-forest','dead-zone','guide','scenario','recovery-scenario'].every(profile=>context.window.ProjectCurseAudioManifest?.profiles?.[profile]));
add('recovery-semantic-audio',['recovery.enter','recovery.tether','recovery.contain','recovery.echo','recovery.complete','recovery.exit'].every(event=>context.window.ProjectCurseAudioManifest?.events?.[event])&&pilgrimageRuntime.includes("'recovery.complete'")&&pilgrimageRuntime.includes("'recovery-scenario'"));
add('distinct-interface-cues',['pc5152h_terminal_contact_clear.wav','pc5152f_analog_contact_soft.wav','pc5152h_record_mount_clear.wav','pc5152p_internal_projector_vhs_step.wav','pc5152x_late_log_beep_195s.mp3','pc5152v_field_photo_click_42s.mp3','pc5152v_comm_line_cue_73_74.mp3'].every(asset=>baseRuntime.includes(asset)));
add('audio-ducking-and-polyphony',audioController.includes('function duckAmbient')&&audioController.includes('function stopBus')&&audioController.includes("if(event.priority>1){stopBus('interface');stopBus('record');}")&&audioController.includes('event.exclusive!==false'));
add('audio-profile-route-sync',audioController.includes("projectcurse:screen-committed")&&audioController.includes('setProfile(event.detail?.target')&&audioController.includes('data-audio-blocked'));
add('record-audio-route-isolation',main.includes("projectcurse:route-will-change")&&main.includes("document.body.classList.contains('pc5152h-sequence-open')")&&main.includes("pc5152h-cult-source-sequence"));
add('audio-profile-clears-previous-buses',audioController.includes("if(resolved!==profileId)")&&audioController.includes("stopBus('record')")&&audioController.includes("stopBus('interface')"));
add('screen-action-audio',mapRoomRuntime.includes("'operation.step'")&&worldHistory.includes("'history.open'")&&worldHistory.includes("'history.step'")&&factionAnalysisRuntime.includes("'faction.open'")&&factionAnalysisRuntime.includes("'faction.back'"));
add('regional-document-audio',read('assets/js/pages/archive-document.js').includes("'great-black-forest':'region.forest'")&&read('assets/js/pages/archive-document.js').includes("'dead-zone':'region.deadzone'")&&read('assets/js/pages/archive-document.js').includes("scenario:'scenario.arm'"));
add('transition-controller-owned',context.window.ProjectCurseTransitions?.screens&&Object.keys(context.window.ProjectCurseTransitions.screens).length===5&&transitionController.includes('ProjectCurseTransition')&&transitionController.includes("dataset.transitionState='switching'"));
add('transition-state-machine',appShell.includes('transitioning=true')&&appShell.includes('queuedRequest')&&appShell.includes('ProjectCurseTransition.run')&&appShell.includes("history.pushState({route:target}"));
add('screen-identity-presets',transitionCss.includes('coordinate-acquire')&&transitionCss.includes('chronology-rewind')&&transitionCss.includes('dossier-assemble')&&transitionCss.includes('vault-unseal'));
add('archive-return-transition-visible',transitionCss.includes('html.pc5152cf-archive-return #loader')&&transitionCss.includes('#loader.hide'));
add('map-room-owned',context.window.ProjectCurseMapRoom?.regions?.length>=5&&context.window.ProjectCurseMapRoom?.operations?.length>=3&&mapRoomRuntime.includes('ProjectCurseMapRoomRuntime'));
add('deadzone-return-operation-map',context.window.ProjectCurseMapRoom?.operations?.some(operation=>operation.id==='op-deadzone-return'&&operation.steps?.length===6)&&mapRoomRuntime.includes("operation.id==='op-deadzone-return'"));
add('deadzone-recovery-operation-map',context.window.ProjectCurseMapRoom?.operations?.some(operation=>operation.id==='op-deadzone-recovery'&&operation.steps?.length===6&&operation.unlockVerdict==='DZ-VR-04')&&mapRoomRuntime.includes("operation.id==='op-deadzone-recovery'")&&mapRoomRuntime.includes('recoveryUnlocked'));
add('reactive-operation-timeline',mapRoomRuntime.includes('scenarioStageByItem')&&mapRoomRuntime.includes('operationScenarioId')&&mapRoomRuntime.includes('scenarioState.choices[index]?.ruleOutcome')&&['kept','verified','secured','contained','broken','compromised'].every(tone=>mapRoomCss.includes(`is-${tone}`)));
add('reactive-home-field-signal',terminalHomeRuntime.includes('const latestTrace=id=>')&&terminalHomeRuntime.includes('traceLabels')&&terminalHomeRuntime.includes('forestTrace')&&terminalHomeRuntime.includes('recoveryTrace'));
const drilldowns=context.window.ProjectCurseRegionalDrilldown?.districts||[];
add('regional-drilldown-owned',structureData?.owners?.regionalDrilldownData==='assets/js/data/regional-drilldown-data.js'&&drilldowns.length===6&&context.window.ProjectCurseMapRoom?.drilldowns===drilldowns,drilldowns.length);
add('regional-drilldown-balanced',drilldowns.filter(detail=>detail.region==='southamerica').length===3&&drilldowns.filter(detail=>detail.region==='northamerica').length===3&&drilldowns.reduce((total,detail)=>total+detail.sites.length,0)>=38);
add('regional-drilldown-navigation',mapRoomRuntime.includes("mode:'region'")&&mapRoomRuntime.includes("state.mode==='detail'")&&mapRoomRuntime.includes('data-map-detail-site')&&mapRoomRuntime.includes('showDetail(id,siteId)'));
add('regional-drilldown-crosslinks',mapRoomRuntime.includes('renderDetailIntel')&&mapRoomRuntime.includes('data-map-open-record')&&mapRoomRuntime.includes('data-map-open-operation')&&mapRoomRuntime.includes('data-map-open-history'));
add('regional-verdict-sync',drilldowns.some(detail=>detail.id==='gbf-coastal-belt'&&detail.sites.filter(site=>site.verdictStates).length>=4)&&drilldowns.some(detail=>detail.id==='deadzone-return-corridor'&&detail.sites.some(site=>site.verdictStates))&&mapRoomRuntime.includes('resolveDetailSite'));
const detailRoutes=drilldowns.flatMap(detail=>detail.routes.map(route=>({detail,route})));
add('regional-nineteen-owned-routes',detailRoutes.length===19&&detailRoutes.every(({route})=>route.siteIds?.length>=2&&route.risk&&route.signal&&route.rule),detailRoutes.length);
add('regional-route-site-integrity',detailRoutes.every(({detail,route})=>route.siteIds.every(id=>detail.sites.some(site=>site.id===id))));
add('regional-route-focus',mapRoomRuntime.includes('routesForSite')&&mapRoomRuntime.includes('focusedRouteIds')&&mapRoomRuntime.includes('is-focused')&&mapRoomRuntime.includes('is-muted'));
add('regional-tactical-layers',mapRoomRuntime.includes('detailLayers:{routes:true,threats:true,comms:false,distortion:true}')&&['routes','threats','comms','distortion'].every(layer=>mapRoomRuntime.includes(`data-map-detail-layer="${layer}"`))&&mapRoomRuntime.includes('renderDetailOverlays'));
add('regional-route-sequence',mapRoomRuntime.includes('renderRouteSequence')&&mapRoomRuntime.includes('data-map-route-step')&&mapRoomRuntime.includes('CONNECTED ROUTE')&&mapRoomRuntime.includes('route.rule'));
add('shared-incident-network',incidentData?.version===VERSION&&incidentData.incidentList.length>=7&&incidentData.incidents['evt-southern-mobilization']?.operation==='op-southern-coup');
add('southern-coup-operation',context.window.ProjectCurseMapRoom?.operations?.some(operation=>operation.id==='op-southern-coup'&&operation.steps.length>=6&&operation.directive));
add('geographic-layer-controls',mapRoomRuntime.includes('renderGraticule')&&mapRoomRuntime.includes('data-map-layer')&&mapRoomRuntime.includes('state.layers'));
add('geographic-route-layer',context.window.ProjectCurseMapRoom?.routes?.length>=4&&mapRoomRuntime.includes('pc-map-routes')&&mapRoomRuntime.includes("layers:{confirmed:true,estimated:true,zones:true,routes:true}"));
add('incident-screen-crosslinks',mapRoomRuntime.includes('data-map-open-history')&&mapRoomRuntime.includes('data-map-open-faction')&&mapRoomRuntime.includes('data-map-open-record')&&worldHistory.includes('ProjectCurseWorldHistoryRuntime')&&factionAnalysisRuntime.includes('data-pc-faction-incident')&&archiveRuntime.includes('open:openRecord'));
add('cinematic-registry-four-records',cinematicData?.ids?.().join('|')==='Cults_871104|Immortality_860201|Ferals_860722|Sakuma_Tape_991028',cinematicData?.ids?.().join('|'));
add('cinematic-record-config-owned-by-modules',![cinematicCults,cinematicImmortality,cinematicFerals,cinematicSakuma].some(source=>!source.includes('ProjectCurseCinematicRegistry?.register'))&&main.includes('cinematicRegistry?.get?.(state.activeRecord)')&&main.includes('cinematicRegistry?.pages?.(recordId)'));
add('retired-root-runtimes-not-loaded',!index.includes('assets/js/main.js')&&!index.includes('assets/js/core/runtime-ownership.js')&&!index.includes('assets/js/core/menu-audio-runtime.js'));
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
add('manifest-runtime-schema-v22',structureData?.schema==='project-curse-v22'&&context.window.ProjectCurseBuild?.schema==='project-curse-v22');
add('archive-registry-version',archiveData?.version===DATA_VERSION);
const publicArchiveIds=archiveData?.publicRecords?.map(record=>record.id)||[];
add('archive-thirteen-record-index',publicArchiveIds.length===13&&publicArchiveIds.slice(0,4).join('|')==='Cults_871104|Immortality_860201|Ferals_860722|Zone_870815',publicArchiveIds.length);
add('archive-all-thirteen-open',archiveData?.publicRecords?.length===13&&archiveData.publicRecords.every(record=>record.access==='open'));
add('archive-record-ids-unique',new Set(publicArchiveIds).size===publicArchiveIds.length,publicArchiveIds.join('|'));
const videoRecords=archiveData?.publicRecords?.filter(record=>record.format==='video')||[];
const documentRecords=archiveData?.publicRecords?.filter(record=>record.format==='document')||[];
add('archive-video-document-groups',videoRecords.map(record=>record.id).join('|')==='Cults_871104|Immortality_860201|Ferals_860722|Sakuma_Tape_991028'&&documentRecords.length===9&&archiveRuntime.includes("group('video','VIDEO RECORDS','영상 기록')")&&archiveRuntime.includes("group('document','DOCUMENT FILES','문서 기록')"),`${videoRecords.length} video / ${documentRecords.length} document`);
add('archive-display-codes',videoRecords.find(record=>record.id==='Cults_871104')?.code==='CULT-ARCHIVE'&&videoRecords.find(record=>record.id==='Immortality_860201')?.code==='OP-IMMORTALITY');
add('archive-nine-internal-documents',documentRecords.length===9&&documentRecords.every(record=>!record.href)&&documentRecords.every(record=>context.window.ProjectCurseArchiveDocuments?.documents?.[record.id]));
add('archive-cinematic-inline-sequence',videoRecords.every(record=>!record.href)&&videoRecords.every(record=>cinematicData?.get?.(record.id))&&index.indexOf('assets/js/data/archive-document-data.js')<index.indexOf('assets/js/data/feral-cinematic-data.js')&&index.indexOf('assets/js/data/feral-cinematic-data.js')<index.indexOf('assets/js/core/record-cinematic-registry.js')&&index.indexOf('assets/js/pages/cinematic-sakuma.js')<index.indexOf('assets/js/core/record-cinematic-runtime.js')&&main.includes('const SEQUENCE_RECORDS=new Set(cinematicRegistry?.ids?.()||[])')&&archiveRuntime.includes('window.ProjectCurseRecordCinematic.start(id)'));
add('archive-no-access-limit-label',!archiveRuntime.includes('접근 제한')&&!archiveRuntime.includes('is-restricted')&&archiveRuntime.includes("format==='video'?'영상 재생':'문서 열람'"));
add('archive-nine-readable-documents',documentRecords.length===9&&documentRecords.every(record=>context.window.ProjectCurseArchiveDocuments?.documents?.[record.id])&&read('assets/js/pages/archive-document.js').includes('ProjectCurseArchiveDocument'));
add('archive-document-source-single-owner',!existsSync(path('assets/js/data/archive-source-content.js'))&&!read('assets/js/pages/archive-document.js').includes('ProjectCurseArchiveSourceContent'));
add('archive-legacy-index-removed-at-runtime',archiveRuntime.includes("qa(':scope > .archive-groups',wrap).forEach(legacy=>legacy.remove())"));
add('sakuma-inline-gesture-entry',archiveData?.publicRecords?.find(record=>record.id==='Sakuma_Tape_991028')?.presentation==='cinematic'&&!archiveData?.publicRecords?.find(record=>record.id==='Sakuma_Tape_991028')?.href&&read('docs/Sakuma_Tape_991028/index.html').includes('id="sakumaSequenceStart"')&&read('docs/Sakuma_Tape_991028/index.html').includes("start?.('Sakuma_Tape_991028')")&&read('docs/Sakuma_Tape_991028/index.html').indexOf('record-cinematic-registry.js')<read('docs/Sakuma_Tape_991028/index.html').indexOf('cinematic-sakuma.js'));
add('archive-feral-standalone-gesture-fallback',read('docs/Ferals_860722/index.html').includes('기록 열람 시작')&&!read('docs/Ferals_860722/index.html').includes("setTimeout(start,80)")&&read('docs/Ferals_860722/index.html').includes("start?.('Ferals_860722')")&&read('docs/Ferals_860722/index.html').indexOf('record-cinematic-registry.js')<read('docs/Ferals_860722/index.html').indexOf('cinematic-ferals.js'));
const archiveDocumentRuntime=read('assets/js/pages/archive-document.js');
const archiveDocumentData=read('assets/js/data/archive-document-data.js');
add('archive-feral-supplement-discarded',!archiveRegistry.includes('FCR_Archive_890402')&&!archiveDocumentData.includes('FCR_Archive_890402')&&!existsSync(path('docs/FCR_Archive_890402')));
add('archive-genesis-record-discarded',!archiveRegistry.includes('Unknown_Record5_940626')&&!archiveDocumentData.includes('Unknown_Record5_940626')&&!existsSync(path('docs/Unknown_Record5_940626/index.html'))&&!index.includes('새로운 세계를 위한 유전자 기록'));
const restoredDocuments=context.window.ProjectCurseArchiveDocuments?.documents||{};
const greatBlackForest=restoredDocuments.Great_Black_Forest_Region;
const deadZonePilgrimage=restoredDocuments.Dead_Zone_Pilgrimage;
const pilgrimRules=restoredDocuments.Pilgrim_Rules_GBF;
const brokenCrown=restoredDocuments.Operation_Broken_Crown;
const restoredZone=restoredDocuments.Zone_870815;
const restoredRedzone=restoredDocuments.Redzone_881120;
const restoredNhcManual=restoredDocuments.NHC_Manual_891219;
const restoredFerals=restoredDocuments.Ferals_860722;
const feralCinematic=context.window.ProjectCurseFeralCinematic;
add('archive-zone-term-colors',archiveDocumentRuntime.includes("'그린존':'green'")&&archiveDocumentRuntime.includes("'레드존':'red'")&&read('assets/css/archive-document.css').includes('.archive-term-black'));
add('archive-rich-document-runtime',archiveDocumentRuntime.includes('appendFigure')&&archiveDocumentRuntime.includes('appendTable')&&archiveDocumentRuntime.includes('section.groups'));
add('visual-evidence-owner',structureData?.owners?.visualEvidenceData==='assets/js/data/visual-evidence-data.js'&&structureData?.owners?.visualEvidenceCSS==='assets/css/visual-evidence.css'&&visualEvidence?.version==='1.0.0');
add('visual-evidence-classes',['ORIGINAL','STABILIZED','RECONSTRUCTED','UNVERIFIED'].every(key=>visualEvidence?.classes?.[key])&&read('ASSET_POLICY.md').includes('**UNVERIFIED**'));
add('visual-evidence-honest-reconstructions',['assets/resources/derived/great-black-forest_reconstructed-v1.png','assets/resources/derived/dead-zone-pilgrimage_reconstructed-v1.png'].every(src=>{const item=visualEvidence?.resolve?.(src);return item?.className==='RECONSTRUCTED'&&item?.originalState==='missing'&&!item?.comparison;}));
add('visual-evidence-real-comparison-links',visualEvidence?.resolve?.('assets/resources/8bb53a89c3baf48d8e3ac2b180f80d0b.webp')?.comparison?.path?.includes('114223e8cf8c8ea96c6d4ffca6cae2ce')&&visualEvidence?.resolve?.('assets/resources/archive-enex/feral-classification/image-241hs-angel-presence.png')?.comparison?.path?.includes('83d311da1ab7310a567c6023f6151e6c'));
add('visual-evidence-document-console',archiveDocumentRuntime.includes('function evidenceConsole(items)')&&archiveDocumentRuntime.includes('archive-evidence-stats')&&archiveDocumentRuntime.includes('dataset.evidenceFilter')&&archiveDocumentRuntime.includes('currentEvidenceItems=evidenceItems'));
add('visual-evidence-comparison-viewer',archiveDocumentRuntime.includes('function renderEvidenceViewer()')&&archiveDocumentRuntime.includes("range.type='range'")&&archiveDocumentRuntime.includes('openEvidenceAsset(src,context={},trigger=null)')&&visualEvidenceCss.includes('.pc-evidence-compare:after'));
add('visual-evidence-mobile-and-accessible',visualEvidenceCss.includes('@media(max-width:760px)')&&visualEvidenceCss.includes('@media(prefers-reduced-motion:reduce)')&&archiveDocumentRuntime.includes("viewer.setAttribute('aria-modal','true')")&&archiveDocumentRuntime.includes("range.setAttribute('aria-label','두 이미지 비교 경계')"));
add('visual-evidence-cinematic-handoff',main.includes('pc-cinematic-evidence-control')&&main.includes('openEvidenceAsset?.(page.image')&&main.includes("document.body.classList.contains('pc-evidence-open')")&&visualEvidenceCss.includes('.pc-cinematic-evidence-control'));
add('visual-evidence-standalone-documents',['Zone_870815','Unknown_Record1_860204','Unknown_Record2_860205','Unknown_Record3_920711','Unknown_Record4_930314'].every(id=>{const source=read(`docs/${id}/index.html`);return source.includes('visual-evidence.css')&&source.includes('visual-evidence-data.js')&&source.indexOf('visual-evidence-data.js')<source.indexOf('archive-document.js');}));
const responsiveAssets=Object.values(mediaManifest?.assets||{});
const responsiveVariants=responsiveAssets.flatMap(asset=>asset.variants||[]);
add('adaptive-media-owner',structureData?.owners?.mediaManifest==='assets/js/data/media-manifest.js'&&structureData?.owners?.adaptiveMediaRuntime==='assets/js/core/adaptive-media.js'&&structureData?.owners?.adaptiveMediaCSS==='assets/css/adaptive-media.css');
add('adaptive-media-twenty-sources',mediaManifest?.version==='1.0.0'&&responsiveAssets.length===20&&responsiveVariants.length===40,`${responsiveAssets.length} sources / ${responsiveVariants.length} variants`);
add('adaptive-media-variant-files',responsiveVariants.every(variant=>existsSync(path(variant.src))&&statSync(path(variant.src)).size>500));
add('adaptive-media-originals-preserved',responsiveAssets.every(asset=>existsSync(path(asset.source))&&asset.variants.every(variant=>statSync(path(variant.src)).size<statSync(path(asset.source)).size)));
add('adaptive-media-runtime',adaptiveMediaRuntime.includes("image.srcset=variants.map")&&adaptiveMediaRuntime.includes("mode==='original'")&&adaptiveMediaRuntime.includes('function prepareRoute(route')&&adaptiveMediaRuntime.includes('function getDiagnostics()'));
add('adaptive-media-loading-presentation',adaptiveMediaCss.includes('.pc-media-loading>img[data-pc-media]')&&adaptiveMediaCss.includes('.pc-media-recovery')&&adaptiveMediaCss.includes('@media(prefers-reduced-motion:reduce)')&&archiveDocumentRuntime.includes("mode:'original'"));
add('adaptive-media-viewer-gate',archiveDocumentRuntime.includes('range.disabled=true')&&archiveDocumentRuntime.includes("range.disabled=!complete")&&archiveDocumentRuntime.includes('Promise.all(pending)')&&archiveDocumentRuntime.includes('FRAME STABILIZED'));
add('adaptive-media-cinematic',main.includes('data-pc-source=')&&main.includes("ProjectCurseMedia?.enhance?.(bodyEl")&&main.includes("ProjectCurseMedia?.preload?.(prefix()+nextPage.image"));
add('adaptive-media-transition-warmup',transitionController.includes('ProjectCurseMedia.prepareRoute')&&transitionController.includes('VISUAL CHANNEL ACQUISITION'));
add('adaptive-media-root-order',index.includes('assets/css/adaptive-media.css?v=5.31.0')&&index.includes('assets/js/data/media-manifest.js?v=5.31.0')&&index.includes('assets/js/core/adaptive-media.js?v=5.31.0')&&index.indexOf('media-manifest.js')<index.indexOf('adaptive-media.js')&&index.indexOf('adaptive-media.js')<index.indexOf('record-cinematic-runtime.js'));
add('adaptive-media-standalone-documents',['Zone_870815','Unknown_Record1_860204','Unknown_Record2_860205','Unknown_Record3_920711','Unknown_Record4_930314'].every(id=>{const source=read(`docs/${id}/index.html`);return source.includes('adaptive-media.css')&&source.includes('media-manifest.js')&&source.includes('adaptive-media.js')&&source.indexOf('media-manifest.js')<source.indexOf('archive-document.js');}));
add('field-dossier-four-records',greatBlackForest?.presentation==='region-dossier'&&deadZonePilgrimage?.presentation==='region-dossier'&&pilgrimRules?.presentation==='guide'&&brokenCrown?.presentation==='scenario');
add('regional-document-identities',greatBlackForest?.theme==='great-black-forest'&&greatBlackForest?.telemetry?.length===3&&deadZonePilgrimage?.theme==='dead-zone'&&deadZonePilgrimage?.telemetry?.length===3&&archiveDocumentRuntime.includes('dataset.documentTheme')&&read('assets/css/archive-document.css').includes('data-document-theme="great-black-forest"')&&read('assets/css/archive-document.css').includes('data-document-theme="dead-zone"'));
add('great-black-forest-dossier',greatBlackForest?.sections?.length===5&&JSON.stringify(greatBlackForest).includes('자유의 땅')&&JSON.stringify(greatBlackForest).includes('타락 야생체')&&greatBlackForest?.hero?.caption?.includes('복원 추정본'));
add('dead-zone-dossier',deadZonePilgrimage?.sections?.length===5&&JSON.stringify(deadZonePilgrimage).includes('순례의 의미')&&JSON.stringify(deadZonePilgrimage).includes('혈교 지부의 분열')&&deadZonePilgrimage?.hero?.caption?.includes('복원 추정본'));
add('pilgrim-rules-eleven',pilgrimRules?.sections?.length===5&&pilgrimRules.sections.filter(section=>section.table).flatMap(section=>section.table.rows).length===11);
add('broken-crown-branching-scenario',brokenCrown?.sections?.find(section=>section.branches)?.branches?.entries?.length===3&&brokenCrown?.sections?.find(section=>section.title==='6단계 작전 전개')?.table?.rows?.length===6&&archiveDocumentRuntime.includes('appendBranches')&&archiveDocumentRuntime.includes('scenario.complete'));
add('reconstructed-image-provenance',read('assets/resources/ASSET_REGISTRY.md').includes('RECONSTRUCTED')&&read('assets/resources/ASSET_REGISTRY.md').includes('복원 추정본')&&statSync(path('assets/resources/derived/great-black-forest_reconstructed-v1.png')).size>1_000_000&&statSync(path('assets/resources/derived/dead-zone-pilgrimage_reconstructed-v1.png')).size>1_000_000);
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
add('archive-general-reading-layout',archiveDocumentRuntime.includes('archive-doc-reading-grid')&&archiveDocumentRuntime.includes('archive-doc-paragraph')&&archiveDocumentRuntime.includes('IntersectionObserver')&&read('assets/css/archive-document.css').includes('grid-template-columns:230px minmax(0,1fr)'));
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
add('faction-single-menu',count(index,'data-uac-route="faction-info"')>=2&&count(index,'data-uac-route="faction-relation"')===0&&index.includes('<b>정보 분석</b>'));
add('faction-unified-runtime',factionAnalysisRuntime.includes('data-pc-faction-owner')&&factionAnalysisRuntime.includes('pc-faction-relation-list'));
add('faction-mark-name-index',factionAnalysisRuntime.includes('pc-faction-card')&&factionAnalysis?.order?.every(key=>!('subtitle' in factionAnalysis.factions[key])));
add('faction-auxiliary-page',factionAnalysisRuntime.includes('pc-faction-back')&&factionAnalysisRuntime.includes('openDossier')&&factionAnalysisRuntime.includes('renderDossier')&&factionAnalysisRuntime.includes("navigate('faction-info')"));
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
