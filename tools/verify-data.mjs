#!/usr/bin/env node
// Project Curse — 데이터·정사·매체 검증. 사용: node tools/verify-data.mjs [저장소 루트]
// index.html(새 단말)의 데이터 스크립트만 순서대로 실행한다. 옛 화면 소스나 검증기를 실행하지 않는다.
// A/C의 데이터 조건을 유지하고, D 혼합 검사의 데이터 조건은 :data로 구분한다.
// owners의 옛 CSS/런타임 경로 값은 메타데이터 비교일 뿐 파일 접근/존재 요구가 아니다.
// 보호 기록의 봉인 해시와 개정판 사실 대조, 화면 동작은 verify-app.mjs가 담당한다.
import {createHash} from 'node:crypto';
import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const VERSION='5.54.0';
const ARCHIVE_VERSION='5.35.0';
const ROOT=resolve(process.argv[2]||fileURLToPath(new URL('../',import.meta.url)))+sep;
const checks=[];
const path=relative=>ROOT+relative;
const read=relative=>readFileSync(path(relative),'utf8');
const hash=value=>createHash('sha256').update(value).digest('hex');
const add=(name,pass,detail='')=>checks.push({name,pass:!!pass,detail});
const MEDIA_EXTENSIONS=new Set(['.png','.jpg','.jpeg','.webp','.gif','.svg','.mp3','.wav','.ogg','.mp4','.webm']);
const fileTree=directory=>readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
  if(['.git','node_modules','.swap-sim'].includes(entry.name)) return [];
  const absolute=directory+entry.name;
  if(entry.isDirectory()) return fileTree(absolute+'/');
  return [absolute.slice(ROOT.length).replace(/\\/g,'/')];
});
const mediaTree=directory=>fileTree(directory).filter(relative=>MEDIA_EXTENSIONS.has(relative.slice(relative.lastIndexOf('.')).toLowerCase()));
function article(source,id){
  const start=source.indexOf(`<article class="record-detail" data-record="${id}"`);
  const end=start<0?-1:source.indexOf('</article>',start);
  return start<0||end<0?'':source.slice(start,end+'</article>'.length);
}

function verify(){
  // C: 옛 표시층 파일 50개 제외, 기존 파일 78개와 새 앱 진입점/추가 데이터 3개 확인.
  const required=[
    "index.html",
    "assets/favicon.svg",
    "assets/js/data/build-info.js",
    "assets/js/data/site-manifest.js",
    "assets/js/data/audio-manifest.js",
    "assets/js/data/transition-manifest.js",
    "assets/js/data/channel-identity-data.js",
    "assets/js/data/canon-registry.js",
    "assets/js/data/faction-mark-registry.js",
    "assets/js/data/world-history-data.js",
    "assets/js/data/japan-technology-data.js",
    "assets/js/data/faction-lineage-data.js",
    "assets/js/data/world-history-prose-data.js",
    "assets/js/data/incident-registry.js",
    "assets/js/data/faction-analysis-data.js",
    "assets/js/data/personnel-profile-data.js",
    "assets/js/data/personnel-remake-data.js",
    "assets/js/data/personnel-data.js",
    "assets/js/data/archive-registry.js",
    "assets/js/data/archive-document-data.js",
    "assets/js/data/visual-evidence-data.js",
    "assets/js/data/media-manifest.js",
    "assets/js/data/media-provenance-data.js",
    "assets/js/data/field-dossier-data.js",
    "assets/js/data/regional-drilldown-data.js",
    "assets/js/data/pilgrimage-scenario-data.js",
    "assets/js/data/verdict-archive-data.js",
    "assets/js/data/map-room-data.js",
    "assets/js/data/map-signal-index-data.js",
    "assets/js/data/home-intelligence-data.js",
    "assets/js/data/feral-cinematic-data.js",
    "assets/js/data/sakuma-cinematic-data.js",
    "ASSET_POLICY.md",
    "MEDIA_CREDITS.md",
    "WORLD_CANON_LEDGER.md",
    "WRITING_STYLE_GUIDE.md",
    "PERSONNEL_SOURCE_NOTES.md",
    "assets/resources/ASSET_REGISTRY.md",
    "assets/resources/MEDIA_PROVENANCE_OVERRIDES.json",
    "tools/build-media-provenance.mjs",
    "assets/resources/derived/great-black-forest_reconstructed-v1.png",
    "assets/resources/derived/dead-zone-pilgrimage_reconstructed-v1.png",
    "assets/resources/derived/project-curse-world-keyart-concept-v1.png",
    "assets/resources/derived/great-black-forest-unlit-fortress-bell-concept-v1.png",
    "assets/resources/derived/checkpoint-07-five-thermal-concept-v1.png",
    "assets/resources/derived/broken-crown-erased-commander-concept-v1.png",
    "assets/resources/derived/first-apostle-three-traces-reconstruction-concept-v1.png",
    "assets/resources/derived/joint-response-unit-unlisted-eleventh-group-concept-v1.png",
    "assets/resources/derived/nhc-young-soldiers-forward-base-group-photo-concept-v1.png",
    "assets/faction_marks/uac.svg",
    "assets/faction_marks/nhc.svg",
    "assets/faction_marks/sid.svg",
    "assets/faction_marks/fhc.svg",
    "assets/faction_marks/syndicate.svg",
    "assets/faction_marks/ushinoda.svg",
    "assets/faction_marks/haimun.svg",
    "assets/faction_marks/ashcrew.svg",
    "assets/faction_marks/arf.svg",
    "assets/faction_marks/cpd.svg",
    "assets/faction_marks/amarion.svg",
    "assets/faction_marks/corruption-cult.svg",
    "assets/faction_marks/blood-cult.svg",
    "assets/faction_marks/shadow-cult.svg",
    "assets/faction_marks/first-apostle.svg",
    "assets/faction_marks/southern-blood.svg",
    "assets/faction_marks/deadzone-blood.svg",
    "assets/audio/pc5152am_immortality_scp087_theme.mp3",
    "assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3",
    "assets/audio/pc5152cf_feral_dying_memories_bgm.mp3",
    "assets/audio/pc5152an_cult_radio_static_layer.mp3",
    "assets/audio/pc5152h_terminal_contact_clear.wav",
    "assets/audio/pc5152f_analog_contact_soft.wav",
    "assets/audio/pc5152h_record_mount_clear.wav",
    "assets/audio/pc5152p_internal_projector_vhs_step.wav",
    "assets/audio/pc5152x_late_log_beep_195s.mp3",
    "assets/audio/pc5152v_field_photo_click_42s.mp3",
    "assets/audio/pc5152v_comm_line_cue_73_74.mp3",
    "docs/Cults_871104/index.html",
    "docs/Immortality_860201/index.html",
    "assets/js/data/world-history-core-data.js",
    "assets/js/data/immortality-storyboard.js"
  ];
  required.forEach(relative=>add(`required:${relative}`,existsSync(path(relative))));

  // index.html(새 단말)에 실제 연결된 데이터만 브라우저와 같은 순서로 적재한다.
  const app=read('index.html');
  const dataScripts=[...app.replace(/<!--[\s\S]*?-->/g,'').matchAll(/<script\b[^>]*\bsrc\s*=\s*["'](assets\/js\/data\/[^"'?#]+\.js)(?:[?#][^"']*)?["'][^>]*>/g)].map(match=>match[1]);
  const requiredData=required.filter(relative=>relative.startsWith('assets/js/data/'));
  const missingData=requiredData.filter(relative=>!dataScripts.includes(relative));
  add('data-script-list',dataScripts.length>0&&new Set(dataScripts).size===dataScripts.length&&missingData.length===0,missingData.join('|'));
  const context={console};
  context.window=context;
  vm.createContext(context);
  const dataSources=new Map();
  let loadError='';
  for(const relative of dataScripts){
    try{
      const source=read(relative);
      dataSources.set(relative,source);
      vm.runInContext(source,context,{filename:relative});
    }catch(error){
      loadError=relative+': '+error.message;
      break;
    }
  }
  add('data-scripts-load',!loadError,dataScripts.length+' files'+(loadError?' / '+loadError:''));
  if(loadError||missingData.length) return;
  const dataSource=relative=>{
    if(!dataSources.has(relative)) throw new Error('Data script not loaded: '+relative);
    return dataSources.get(relative);
  };

  const canon=dataSource('assets/js/data/canon-registry.js');
  const manifest=dataSource('assets/js/data/site-manifest.js');
  const archiveRegistry=dataSource('assets/js/data/archive-registry.js');
  const visualEvidenceData=dataSource('assets/js/data/visual-evidence-data.js');
  const fieldDossierData=dataSource('assets/js/data/field-dossier-data.js');
  const homeIntelligenceData=dataSource('assets/js/data/home-intelligence-data.js');
  const factionAnalysisSource=dataSource('assets/js/data/faction-analysis-data.js');
  const personnelProfileSource=dataSource('assets/js/data/personnel-profile-data.js');
  const personnelRemakeSource=dataSource('assets/js/data/personnel-remake-data.js');
  const personnelDataSource=dataSource('assets/js/data/personnel-data.js');
  const audioManifest=dataSource('assets/js/data/audio-manifest.js');
  const worldHistoryDataSource=dataSource('assets/js/data/world-history-data.js');
  const worldHistoryProseSource=dataSource('assets/js/data/world-history-prose-data.js');
  const mapSignalIndexSource=dataSource('assets/js/data/map-signal-index-data.js');
  const canonData=context.window.ProjectCurseCanon;
  const incidentData=context.window.ProjectCurseIncidentNetwork;
  const worldHistoryData=context.window.ProjectCurseWorldHistoryData;
  const japanTechnology=context.window.ProjectCurseJapanTechnology;
  const factionLineage=context.window.ProjectCurseFactionLineage;
  const worldHistoryProse=context.window.ProjectCurseWorldHistoryProse;
  const factionAnalysis=context.window.ProjectCurseFactionAnalysis;
  const factionMarks=context.window.ProjectCurseFactionMarks;
  const personnelProfiles=context.window.ProjectCursePersonnelProfiles;
  const personnelData=context.window.ProjectCursePersonnel;
  const structureData=context.window.ProjectCurseStructure;
  const archiveData=context.window.ProjectCurseArchive;
  const pilgrimageData=context.window.ProjectCursePilgrimageData;
  const verdictData=context.window.ProjectCurseVerdictArchiveData;
  const visualEvidence=context.window.ProjectCurseVisualEvidence;
  const mediaManifest=context.window.ProjectCurseMediaManifest;
  const mediaProvenance=context.window.ProjectCurseMediaProvenance;
  const channelIdentityData=context.window.ProjectCurseChannelData;
  const mapSignalIndex=context.window.ProjectCurseMapSignalIndex;

  add('channel-identity-six-reader-channels',channelIdentityData?.channels?.length===6&&channelIdentityData.channels.map(channel=>channel.id).join('|')==='terminal-home|map-room|history|faction-info|archive-entry|personnel'&&!channelIdentityData.channels.some(channel=>channel.navTier==='utility'));
  // D 혼합: channel-identity-distinct-themes의 데이터/매체 조건.
  add('channel-identity-distinct-themes:data',new Set(channelIdentityData?.channels?.map(channel=>channel.theme)).size===6);
  add('channel-history-current-telemetry',channelIdentityData?.channels?.find(channel=>channel.id==='history')?.telemetry?.flat().join('|')==='SPAN|ORIGIN?–2042|INDEX|49 RECORDS|ERAS|10');
  // D 혼합: channel-preference-persistence의 데이터/매체 조건.
  add('channel-preference-persistence:data',channelIdentityData?.storageKey==='project_curse_preferences_v1');
  // D 혼합: channel-adaptive-quality-preference의 데이터/매체 조건.
  add('channel-adaptive-quality-preference:data',channelIdentityData?.defaults?.quality==='auto'&&channelIdentityData?.preferences?.quality?.options?.length===3);
  // D 혼합: channel-adaptive-density의 데이터/매체 조건.
  add('channel-adaptive-density:data',channelIdentityData?.density?.storageKey==='project_curse_channel_density_v1'&&channelIdentityData.density.autoCompactMs===1800&&channelIdentityData.density.excluded.join('|')==='terminal-home');
  // D 혼합: telemetry-runtime-owned의 데이터/매체 조건.
  add('telemetry-runtime-owned:data',structureData?.owners?.performanceTelemetry==='assets/js/core/performance-telemetry.js');
  // D 혼합: cult-feral-shared-intro-video의 데이터/매체 조건.
  add('cult-feral-shared-intro-video:data',existsSync(path('assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4')));
  // C 혼합: 음원 SHA-256 유지. 옛 런타임의 참조 문자열은 화면 검증으로 인계.
  add('cult-feral-radio-static-layer',hash(readFileSync(path('assets/audio/pc5152an_cult_radio_static_layer.mp3')))==='3ad8d1b5cb05a8599c4b6058d3c79574b5e6df7c8683631d53a5be7227c4f164');
  add('immortality-full-length-bgm',statSync(path('assets/audio/pc5152am_immortality_scp087_theme.mp3')).size>9_000_000,statSync(path('assets/audio/pc5152am_immortality_scp087_theme.mp3')).size);
  // D 혼합: cult-full-length-looping-bgm의 데이터/매체 조건.
  add('cult-full-length-looping-bgm:data',statSync(path('assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3')).size>8_000_000);
  add('feral-custom-bgm',statSync(path('assets/audio/pc5152cf_feral_dying_memories_bgm.mp3')).size>1_000_000,statSync(path('assets/audio/pc5152cf_feral_dying_memories_bgm.mp3')).size);
  // D 혼합: canon-faction-owner의 데이터/매체 조건.
  add('canon-faction-owner:data',factionAnalysisSource.includes('ProjectCurseFactionAnalysis'));
  // D 혼합: canon-relation-owner의 데이터/매체 조건.
  add('canon-relation-owner:data',Array.isArray(canonData?.relations)&&canonData.relations.length===18);
  add('canon-direct-current-names',!canon.includes('Urban Anomaly Containment')&&!canon.includes('신디케이트')&&!canon.includes('하이문')&&!canon.includes('normalizeTerms')&&!factionAnalysisSource.includes('신디케이트')&&!factionAnalysisSource.includes('하이문')&&!factionAnalysisSource.includes('normalizeTerms'));
  // D 혼합: home-live-intelligence-feed의 데이터/매체 조건.
  add('home-live-intelligence-feed:data',context.window.ProjectCurseHomeIntelligence?.version===VERSION&&context.window.ProjectCurseHomeIntelligence?.signals?.length===4);
  // D 혼합: operation-state-owned의 데이터/매체 조건.
  add('operation-state-owned:data',structureData?.owners?.operationState==='assets/js/core/operation-state.js');
  const unlitPilgrimage=pilgrimageData?.scenarios?.['unlit-fortress'];
  const deadzoneReturn=pilgrimageData?.scenarios?.['deadzone-return'];
  const deadzoneRecovery=pilgrimageData?.scenarios?.['deadzone-recovery'];
  const reactiveStages=Object.values(pilgrimageData?.scenarios||{}).flatMap(scenario=>scenario.stages||[]).filter(stage=>stage.variants?.length);
  add('pilgrimage-six-stage-scenario',unlitPilgrimage?.stages?.length===6&&Object.keys(unlitPilgrimage?.endings||{}).sort().join('|')==='breach|retreat|sanctuary'&&unlitPilgrimage.stages.every(stage=>stage.rule&&stage.choices?.length>=2));
  add('deadzone-six-stage-return-screening',deadzoneReturn?.stages?.length===6&&Object.keys(deadzoneReturn?.endings||{}).sort().join('|')==='approved|fifth|reverse|sealed'&&deadzoneReturn.stages.every(stage=>stage.rule&&stage.choices?.length>=2));
  add('deadzone-four-screening-metrics',deadzoneReturn?.metrics?.map(metric=>metric.key).join('|')==='identity|exposure|coherence|trust'&&deadzoneReturn.stages.every(stage=>stage.choices.every(choice=>deadzoneReturn.metrics.some(metric=>Object.hasOwn(choice.deltas||{},metric.key)))));
  add('deadzone-six-stage-outbound-recovery',deadzoneRecovery?.stages?.length===6&&Object.keys(deadzoneRecovery?.endings||{}).sort().join('|')==='buried|recovered|relay'&&deadzoneRecovery?.unlock?.id==='DZ-VR-04'&&deadzoneRecovery.stages.every(stage=>stage.rule&&stage.choices?.length>=2));
  add('deadzone-recovery-four-metrics',deadzoneRecovery?.metrics?.map(metric=>metric.key).join('|')==='team|tether|depth|echo'&&deadzoneRecovery.stages.every(stage=>stage.choices.every(choice=>deadzoneRecovery.metrics.some(metric=>Object.hasOwn(choice.deltas||{},metric.key)))));
  // D 혼합: pilgrimage-persistent-state의 데이터/매체 조건.
  add('pilgrimage-persistent-state:data',structureData?.owners?.pilgrimageState==='assets/js/core/pilgrimage-state.js');
  // D 혼합: pilgrimage-reactive-cross-stage-variants의 데이터/매체 조건.
  add('pilgrimage-reactive-cross-stage-variants:data',pilgrimageData?.version==='2.2.0'&&reactiveStages.length>=10&&[unlitPilgrimage,deadzoneReturn,deadzoneRecovery].every(scenario=>scenario.stages.some(stage=>stage.variants?.length)),reactiveStages.length);
  add('pilgrimage-reactive-ending-variants',deadzoneRecovery?.endings?.recovered?.variants?.length>=1&&deadzoneRecovery?.endings?.relay?.variants?.length>=1&&JSON.stringify(deadzoneRecovery.endings).includes('처음부터 있던 중계자'));
  add('pilgrimage-three-record-boundaries',[unlitPilgrimage,deadzoneReturn,deadzoneRecovery].every(scenario=>scenario.fixedFacts?.length===3&&scenario.decisionStandard&&scenario.canonBoundary?.includes('중앙')));
  add('verdict-ten-outcome-records',verdictData?.records?.length===10&&new Set(verdictData.records.map(record=>`${record.scenarioId}:${record.endingId}`)).size===10&&verdictData.records.filter(record=>record.scenarioId==='unlit-fortress').length===3&&verdictData.records.filter(record=>record.scenarioId==='deadzone-return').length===4&&verdictData.records.filter(record=>record.scenarioId==='deadzone-recovery').length===3);
  // D 혼합: verdict-gated-recovery-chain의 데이터/매체 조건.
  add('verdict-gated-recovery-chain:data',verdictData?.records?.find(record=>record.id==='DZ-VR-04')?.unlockScenario==='deadzone-recovery');
  // D 혼합: verdict-persistent-snapshots의 데이터/매체 조건.
  add('verdict-persistent-snapshots:data',structureData?.owners?.verdictArchiveState==='assets/js/core/verdict-archive-state.js');
  // D 혼합: single-shell-runtime-owner의 데이터/매체 조건.
  add('single-shell-runtime-owner:data',structureData?.owners?.shellRuntime==='assets/js/core/app-shell.js');
  // D 혼합: menu-navigation-semantic-cues의 데이터/매체 조건.
  add('menu-navigation-semantic-cues:data',audioManifest.includes("'menu.open'")&&audioManifest.includes("'menu.close'")&&audioManifest.includes("'menu.select'"));
  add('current-six-reader-channel-manifest',structureData?.screens?.map(screen=>screen.id).join('|')==='terminal-home|map-room|history|faction-info|archive-entry|personnel'&&!structureData.screens.some(screen=>screen.navTier==='utility'));
  // D 혼합: audio-controller-owned의 데이터/매체 조건.
  add('audio-controller-owned:data',audioManifest.includes('ProjectCurseAudioManifest'));
  add('semantic-field-audio',context.window.ProjectCurseAudioManifest?.version==='2.3.1'&&['archive.filter','map.layer','map.signal','map.brief','operation.step','history.open','faction.open','incident.link','scenario.reveal','scenario.complete','pilgrimage.enter','pilgrimage.step','pilgrimage.danger','pilgrimage.complete','pilgrimage.exit','screening.enter','screening.step','screening.mismatch','screening.complete','screening.exit'].every(event=>context.window.ProjectCurseAudioManifest.events[event]));
  add('semantic-evidence-audio',['evidence.open','evidence.compare','evidence.filter','evidence.close'].every(event=>context.window.ProjectCurseAudioManifest?.events?.[event]));
  add('acoustic-screen-profiles',['terminal-home','map-room','history','faction-info','archive-entry','media-audit','personnel','document','great-black-forest','dead-zone','guide','scenario','recovery-scenario'].every(profile=>context.window.ProjectCurseAudioManifest?.profiles?.[profile]));
  // D 혼합: recovery-semantic-audio의 데이터/매체 조건.
  add('recovery-semantic-audio:data',['recovery.enter','recovery.tether','recovery.contain','recovery.echo','recovery.complete','recovery.exit'].every(event=>context.window.ProjectCurseAudioManifest?.events?.[event]));
  // D 혼합: northern-brief-semantic-audio의 데이터/매체 조건.
  add('northern-brief-semantic-audio:data',context.window.ProjectCurseAudioManifest?.events?.['map.brief']?.cue==='scan'&&context.window.ProjectCurseAudioManifest.events['map.brief'].bus==='interface'&&context.window.ProjectCurseAudioManifest.events['map.brief'].gain<=.42&&context.window.ProjectCurseAudioManifest.events['map.brief'].cooldown>=700);
  const canonGeography=canonData?.geography||{};
  add('geography-name-authority',canonGeography.greatBlackForest?.primary==='대흑림'&&canonGeography.greatBlackForest?.scope==='남아메리카 내륙 이상권'&&canonGeography.greatBlackForest?.legacy?.some(item=>item.label==='남방 데드존'&&item.authority.includes('폐기'))&&canonGeography.deadZone?.primary==='북미 데드존'&&canonGeography.deadZone?.scope==='북아메리카 내륙 무응답권'&&canonGeography.southernTheater?.primary==='남방권');
  add('geography-blood-surface-boundary',canonData?.geographyRules?.bloodSurfaces?.northSea?.kind==='단일 사건명'&&canonData?.geographyRules?.bloodSurfaces?.greatBlackForest?.kind==='복수 현장의 구전명'&&canonData?.geographyRules?.bloodSurfaces?.greatBlackForest?.relation?.includes('북해 사건과의 공통 기원은 확인되지 않았다')&&read('WORLD_CANON_LEDGER.md').includes('혈성 수면 기록 분리'));
  // D 혼합: transition-controller-owned의 데이터/매체 조건.
  add('transition-controller-owned:data',context.window.ProjectCurseTransitions?.screens&&Object.keys(context.window.ProjectCurseTransitions.screens).length===7);
  // D 혼합: map-room-owned의 데이터/매체 조건.
  add('map-room-owned:data',context.window.ProjectCurseMapRoom?.regions?.length>=5&&context.window.ProjectCurseMapRoom?.operations?.length>=3);
  const namedMapRegions=context.window.ProjectCurseMapRoom?.regions?.filter(region=>region.nomenclature)||[];
  // D 혼합: map-region-name-authority의 데이터/매체 조건.
  add('map-region-name-authority:data',context.window.ProjectCurseMapRoom?.version==='map-room-v11'&&namedMapRegions.map(region=>region.id).join('|')==='northamerica|southamerica'&&namedMapRegions.every(region=>region.nomenclature?.primary&&region.nomenclature?.scope&&region.nomenclature?.boundary));
  // D 혼합: deadzone-return-operation-map의 데이터/매체 조건.
  add('deadzone-return-operation-map:data',context.window.ProjectCurseMapRoom?.operations?.some(operation=>operation.id==='op-deadzone-return'&&operation.steps?.length===6));
  // D 혼합: deadzone-recovery-operation-map의 데이터/매체 조건.
  add('deadzone-recovery-operation-map:data',context.window.ProjectCurseMapRoom?.operations?.some(operation=>operation.id==='op-deadzone-recovery'&&operation.steps?.length===6&&operation.unlockVerdict==='DZ-VR-04'));
  const drilldowns=context.window.ProjectCurseRegionalDrilldown?.districts||[];
  add('regional-drilldown-owned',structureData?.owners?.regionalDrilldownData==='assets/js/data/regional-drilldown-data.js'&&drilldowns.length===8&&context.window.ProjectCurseMapRoom?.drilldowns===drilldowns,drilldowns.length);
  const recoveredBriefings=drilldowns.filter(detail=>detail.visual&&detail.signalBrief);
  add('regional-recovered-briefing-network',recoveredBriefings.length===8&&new Set(recoveredBriefings.map(detail=>detail.visual.src)).size===8&&recoveredBriefings.every(detail=>existsSync(path(detail.visual.src))&&!detail.visual.src.includes('candidate')&&detail.visual.siteIds?.every(id=>detail.sites.some(site=>site.id===id))&&detail.signalBrief.siteIds?.every(id=>detail.sites.some(site=>site.id===id))&&detail.signalBrief.lanes?.length===2&&detail.signalBrief.checks?.length===3&&detail.signalBrief.log?.length===3),recoveredBriefings.map(detail=>detail.id).join('|'));
  add('regional-drilldown-coverage',drilldowns.filter(detail=>detail.region==='eastasia').length===1&&drilldowns.filter(detail=>detail.region==='europe').length===1&&drilldowns.filter(detail=>detail.region==='southamerica').length===3&&drilldowns.filter(detail=>detail.region==='northamerica').length===3&&drilldowns.reduce((total,detail)=>total+detail.sites.length,0)>=56);
  // D 혼합: regional-northern-front-briefing의 데이터/매체 조건.
  add('regional-northern-front-briefing:data',drilldowns.some(detail=>detail.id==='eastasia-northern-front'&&detail.terrain==='front'&&detail.sites.length===9&&detail.routes.length===3&&detail.sites.some(site=>site.history==='2038-06-29-sixth-northern-line')&&detail.visual?.src?.includes('northern-front-duplicate-signal-reconstruction')&&detail.visual?.history==='2026-08-20-northern-reversal'&&detail.signalBrief?.lanes?.length===2&&detail.signalBrief?.checks?.length===3&&detail.signalBrief?.log?.length===3));
  // D 혼합: regional-europe-north-sea-briefing의 데이터/매체 조건.
  add('regional-europe-north-sea-briefing:data',drilldowns.some(detail=>detail.id==='europe-north-sea-blockade'&&detail.terrain==='northsea'&&detail.operation==='op-immortality'&&detail.sites.length===9&&detail.routes.length===3&&detail.sites.some(site=>site.id==='europe-blood-lake'&&site.incident==='evt-blood-lake'&&site.records?.join('|')==='Immortality_860201|Unknown_Record2_860205')&&detail.visual?.src?.includes('north-sea-blood-lake-blockade')&&detail.visual?.assetId==='VEA-NS-BL-01'&&detail.signalBrief?.title==='회수 접근 / 마지막 신호 역전')&&visualEvidence?.known?.['assets/resources/derived/north-sea-blood-lake-blockade-reconstruction-concept-v1.png']?.assetId==='VEA-NS-BL-01');
  add('regional-blood-surface-separation',context.window.ProjectCurseRegionalDrilldown?.version==='regional-drilldown-v4'&&drilldowns.find(detail=>detail.id==='gbf-western-marches')?.sites?.find(site=>site.id==='gbf-blood-lake')?.label==='피의 호수 흔적 05'&&drilldowns.find(detail=>detail.id==='gbf-western-marches')?.sites?.find(site=>site.id==='gbf-blood-lake')?.status?.includes('북해 사건과 연결 미확인')&&drilldowns.find(detail=>detail.id==='deadzone-kingdom-graves')?.sites?.find(site=>site.id==='grave-memorial')?.meta?.includes('타 권역 혈성 수면과 연결 미확인'));
  add('regional-deadzone-silent-interior-briefing',drilldowns.some(detail=>detail.id==='deadzone-silent-interior'&&detail.terrain==='silent'&&detail.sites.length===6&&detail.routes.length===3&&detail.visual?.src?.includes('dead-zone-silent-interior-map-termination')&&detail.visual?.assetId==='VEA-DZ-SI-01'&&detail.signalBrief?.checks?.some(check=>check.value==='시간값 반환'))&&visualEvidence?.known?.['assets/resources/derived/dead-zone-silent-interior-map-termination-concept-v1.png']?.assetId==='VEA-DZ-SI-01');
  // D 혼합: regional-verdict-sync의 데이터/매체 조건.
  add('regional-verdict-sync:data',drilldowns.some(detail=>detail.id==='gbf-coastal-belt'&&detail.sites.filter(site=>site.verdictStates).length>=4)&&drilldowns.some(detail=>detail.id==='deadzone-return-corridor'&&detail.sites.some(site=>site.verdictStates)));
  const detailRoutes=drilldowns.flatMap(detail=>detail.routes.map(route=>({detail,route})));
  add('regional-twenty-five-owned-routes',detailRoutes.length===25&&detailRoutes.every(({route})=>route.siteIds?.length>=2&&route.risk&&route.signal&&route.rule),detailRoutes.length);
  add('regional-route-site-integrity',detailRoutes.every(({detail,route})=>route.siteIds.every(id=>detail.sites.some(site=>site.id===id))));
  add('shared-incident-network',incidentData?.version===VERSION&&incidentData.incidentList.length>=7&&incidentData.incidents['evt-southern-mobilization']?.operation==='op-southern-coup');
  add('southern-coup-operation',context.window.ProjectCurseMapRoom?.operations?.some(operation=>operation.id==='op-southern-coup'&&operation.steps.length>=6&&operation.directive));
  // D 혼합: geographic-route-layer의 데이터/매체 조건.
  add('geographic-route-layer:data',context.window.ProjectCurseMapRoom?.routes?.length>=4);
  const synchronyEvent=context.window.ProjectCurseMapRoom?.synchronyEvents?.find(event=>event.id==='three-night-silence');
  add('three-night-synchrony-ten-points',synchronyEvent?.points?.length===10&&synchronyEvent.points.filter(point=>point.region==='southamerica'&&point.kind==='castle').length===6&&synchronyEvent.points.filter(point=>point.region==='northamerica'&&point.kind==='checkpoint').length===4,synchronyEvent?.points?.length);
  add('three-night-synchrony-no-route',synchronyEvent?.connection==='UNRESOLVED'&&synchronyEvent.route===null&&!('points' in (synchronyEvent.route||{}))&&synchronyEvent.boundary.includes('지리적 연결'));
  // D 혼합: history-map-rendered-marker-gate의 데이터/매체 조건.
  add('history-map-rendered-marker-gate:data',context.window.ProjectCurseIncidentNetwork?.incidents?.['evt-amarion-foundation']?.coordinates?.length===2&&!context.window.ProjectCurseMapRoom?.markers?.some(marker=>marker.incident==='evt-amarion-foundation'));
  // D 혼합: signal-index-owner의 데이터/매체 조건.
  add('signal-index-owner:data',structureData?.owners?.mapSignalIndex==='assets/js/data/map-signal-index-data.js');
  add('signal-index-twenty-nine-contacts',mapSignalIndex?.items?.length===29&&mapSignalIndex.items.filter(item=>item.category==='event').length===8&&mapSignalIndex.items.filter(item=>item.category==='site').length===5&&mapSignalIndex.items.filter(item=>item.category==='operation').length===5&&mapSignalIndex.items.filter(item=>item.category==='synchrony').length===10&&mapSignalIndex.items.filter(item=>item.category==='withheld').length===1,mapSignalIndex?.items?.length);
  // D 혼합: signal-index-canon-boundary의 데이터/매체 조건.
  add('signal-index-canon-boundary:data',mapSignalIndex?.items?.filter(item=>item.mapStatus==='withheld').map(item=>item.target.id).join('|')==='evt-amarion-foundation'&&mapSignalIndex.items.filter(item=>item.category==='synchrony').every(item=>item.mapStatus==='independent'&&item.unresolved)&&mapSignalIndexSource.includes("status:'MAP POSITION WITHHELD'"));
  // cinematic-registry-four-records: 실행 모듈 검사라 verify-app.d/archive.mjs의 four-independent-cinematics가 등록 순서까지 이어받았다.
  [
    'assets/resources/archive-enex/source-records/16b74a6d9fb1cab8522e4ed557cd0b84.mp3',
    'assets/resources/archive-enex/source-records/74b0e497277cdc48a4daf4df1b9241d4.mp3',
    'assets/resources/archive-enex/source-records/fb5ead8ded766fd8d05938b1caf6a18e.jpg',
    'assets/resources/archive-enex/source-records/ca57620ab037144cc82ea9443e85a91e.jpg',
    'assets/resources/archive-enex/source-records/c789dad33bd006ec60d4c737f7e5e2b7.jpg',
    'assets/resources/archive-enex/source-records/074fd0bfd4a4eb91fb3a948b9f2777d8.jpg',
    'assets/resources/archive-enex/source-records/734d86c7b7d166024a3be1993b9ed78a.jpg'
  ].forEach(relative=>add(`retired-media-removed:${relative}`,!existsSync(path(relative))));
  add('manifest-runtime-version',structureData?.version===VERSION);
  add('manifest-runtime-schema-v44',structureData?.schema==='project-curse-v44'&&context.window.ProjectCurseBuild?.schema==='project-curse-v44');
  add('manifest-japan-technology-owner',structureData?.owners?.japanTechnologyData==='assets/js/data/japan-technology-data.js');
  add('manifest-lineage-owner',structureData?.owners?.factionLineage==='assets/js/data/faction-lineage-data.js');
  add('archive-registry-version',archiveData?.version===ARCHIVE_VERSION);
  const publicArchiveIds=archiveData?.publicRecords?.map(record=>record.id)||[];
  add('archive-fifteen-record-index',publicArchiveIds.length===15&&publicArchiveIds.slice(0,4).join('|')==='Cults_871104|Immortality_860201|Ferals_860722|Zone_870815',publicArchiveIds.length);
  add('archive-all-fifteen-open',archiveData?.publicRecords?.length===15&&archiveData.publicRecords.every(record=>record.access==='open'));
  add('archive-record-ids-unique',new Set(publicArchiveIds).size===publicArchiveIds.length,publicArchiveIds.join('|'));
  const videoRecords=archiveData?.publicRecords?.filter(record=>record.format==='video')||[];
  const documentRecords=archiveData?.publicRecords?.filter(record=>record.format==='document')||[];
  // D 혼합: archive-video-document-formats의 데이터/매체 조건.
  add('archive-video-document-formats:data',videoRecords.map(record=>record.id).join('|')==='Cults_871104|Immortality_860201|Ferals_860722|Sakuma_Tape_991028'&&documentRecords.length===11);
  add('archive-classified-record-metadata',archiveData.publicRecords.every(record=>record.category&&record.categoryLabel&&record.date&&record.risk&&record.provenance&&Array.isArray(record.tags))&&new Set(archiveData.publicRecords.map(record=>record.category)).size===6);
  add('archive-provenance-honesty',archiveData.publicRecords.filter(record=>record.provenance==='RECONSTRUCTED').map(record=>record.id).join('|')==='Great_Black_Forest_Region|Dead_Zone_Pilgrimage'&&archiveData.publicRecords.filter(record=>record.provenance==='ORIGINAL').every(record=>record.cover?.includes('/archive-enex/')));
  add('archive-display-codes',videoRecords.find(record=>record.id==='Cults_871104')?.code==='CULT-ARCHIVE'&&videoRecords.find(record=>record.id==='Immortality_860201')?.code==='OP-IMMORTALITY');
  add('archive-eleven-internal-documents',documentRecords.length===11&&documentRecords.every(record=>!record.href)&&documentRecords.every(record=>context.window.ProjectCurseArchiveDocuments?.documents?.[record.id]));
  // D 혼합: archive-cinematic-inline-sequence의 데이터/매체 조건.
  add('archive-cinematic-inline-sequence:data',videoRecords.every(record=>!record.href));
  // D 혼합: archive-eleven-readable-documents의 데이터/매체 조건.
  add('archive-eleven-readable-documents:data',documentRecords.length===11&&documentRecords.every(record=>context.window.ProjectCurseArchiveDocuments?.documents?.[record.id]));
  // D 혼합: archive-document-source-single-owner의 데이터/매체 조건.
  add('archive-document-source-single-owner:data',!existsSync(path('assets/js/data/archive-source-content.js')));
  // D 혼합: sakuma-inline-gesture-entry의 데이터/매체 조건.
  add('sakuma-inline-gesture-entry:data',archiveData?.publicRecords?.find(record=>record.id==='Sakuma_Tape_991028')?.presentation==='cinematic'&&!archiveData?.publicRecords?.find(record=>record.id==='Sakuma_Tape_991028')?.href);
  const archiveDocumentData=dataSource('assets/js/data/archive-document-data.js');
  add('archive-feral-supplement-discarded',!archiveRegistry.includes('FCR_Archive_890402')&&!archiveDocumentData.includes('FCR_Archive_890402')&&!existsSync(path('docs/FCR_Archive_890402')));
  add('archive-genesis-record-discarded',!archiveRegistry.includes('Unknown_Record5_940626')&&!archiveDocumentData.includes('Unknown_Record5_940626')&&!existsSync(path('docs/Unknown_Record5_940626/app.html'))&&!app.includes('새로운 세계를 위한 유전자 기록'));
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
  add('visual-evidence-owner',structureData?.owners?.visualEvidenceData==='assets/js/data/visual-evidence-data.js'&&structureData?.owners?.visualEvidenceCSS==='assets/css/visual-evidence.css'&&visualEvidence?.version==='1.1.0');
  add('visual-evidence-classes',['ORIGINAL','STABILIZED','RECONSTRUCTED','UNVERIFIED'].every(key=>visualEvidence?.classes?.[key])&&read('ASSET_POLICY.md').includes('**UNVERIFIED**'));
  add('visual-evidence-honest-reconstructions',[
    'assets/resources/derived/great-black-forest_reconstructed-v1.png',
    'assets/resources/derived/dead-zone-pilgrimage_reconstructed-v1.png',
    'assets/resources/derived/2005-01-21-ash-crew_001_reconstructed.png',
    'assets/resources/derived/2036-12-12-central-callsign-loss_001_reconstructed.png',
    'assets/resources/derived/2038-06-29-sixth-northern-line_001_reconstructed.png',
    'assets/resources/derived/2042-10-31-three-night-silence_001_reconstructed.png'
  ].every(src=>{const item=visualEvidence?.resolve?.(src);return item?.className==='RECONSTRUCTED'&&item?.originalState==='missing'&&!item?.comparison;}));
  add('visual-evidence-real-comparison-links',visualEvidence?.resolve?.('assets/resources/8bb53a89c3baf48d8e3ac2b180f80d0b.webp')?.comparison?.path?.includes('114223e8cf8c8ea96c6d4ffca6cae2ce')&&visualEvidence?.resolve?.('assets/resources/archive-enex/feral-classification/image-241hs-angel-presence.png')?.comparison?.path?.includes('83d311da1ab7310a567c6023f6151e6c'));
  const provenanceAssets=mediaProvenance?.assets||[];
  const internalOnlyMedia=new Set(JSON.parse(read('assets/resources/MEDIA_PROVENANCE_OVERRIDES.json')).internalOnly||[]);
  const unselectedCandidateMedia=new Set([
    'assets/resources/derived/nhc-regular-field-squad-return-group-photo-concept-v1.png',
    'assets/resources/derived/nhc-regular-field-squad-return-group-photo-hell-style-v2.png',
    'assets/resources/derived/nhc-squad-group-photo-candidate-a-hell.png',
    'assets/resources/derived/nhc-squad-group-photo-candidate-b-pictures.png',
    'assets/resources/derived/nhc-squad-group-photo-candidate-c-cinematic.png',
    'assets/resources/derived/nhc-squad-group-photo-candidate-d-archive.png',
    'assets/resources/derived/project-curse-unnamed-swordsman-candidate-a-refined-v1.png',
    'assets/resources/derived/project-curse-unnamed-swordsman-candidate-b-field-operator-v1.png',
    'assets/resources/derived/project-curse-unnamed-swordsman-candidate-c-hell-v1.png',
    'assets/resources/derived/project-curse-unnamed-swordsman-candidate-d-recovered-v1.png',
    'assets/resources/derived/project-curse-unnamed-swordsman-operator-candidate-a-recon-v1.png',
    'assets/resources/derived/project-curse-unnamed-swordsman-operator-candidate-b-direct-action-v1.png',
    'assets/resources/derived/project-curse-unnamed-swordsman-operator-candidate-c-hell-response-v1.png',
    'assets/resources/derived/project-curse-unnamed-swordsman-operator-candidate-d-blacksite-v1.png',
    'assets/resources/derived/project-curse-hell-portrait-violet-haze-v1.png',
    'assets/resources/derived/project-curse-hell-portrait-violet-haze-v2.png',
    'assets/resources/derived/project-curse-hell-red-threshold-encounter-v1.png',
    'assets/resources/derived/project-curse-hell-red-threshold-encounter-v2.png',
    'assets/resources/derived/project-curse-hell-tactical-swordsman-profile-avatar-v1.png',
    'assets/resources/derived/project-curse-hell-tactical-swordsman-violet-corridor-v1.png',
    'assets/resources/derived/project-curse-terminal-investigation-scene-candidate-a-hell-raw-v1.png',
    'assets/resources/derived/project-curse-terminal-investigation-scene-candidate-b-archive-v1.png',
    'assets/resources/derived/project-curse-terminal-investigation-scene-candidate-c-violet-noir-v1.png',
    'assets/resources/derived/project-curse-terminal-investigation-scene-candidate-d-analog-record-v1.png'
  ]);
  const repositoryMedia=mediaTree(ROOT+'assets/').filter(relative=>!internalOnlyMedia.has(relative)&&!unselectedCandidateMedia.has(relative)).sort();
  const provenancePaths=provenanceAssets.map(asset=>asset.path).sort();
  const forbiddenReferenceNames=new Set(['지옥.zip','Pictures.zip','Pictures2.zip']);
  const exposedReferenceFiles=fileTree(ROOT).filter(relative=>forbiddenReferenceNames.has(relative.split('/').at(-1)));
  add('media-provenance-owner',structureData?.owners?.mediaProvenance==='assets/js/data/media-provenance-data.js'&&mediaProvenance?.version==='1.1.0');
  add('media-provenance-all-272-assets',provenanceAssets.length===272&&repositoryMedia.join('|')===provenancePaths.join('|'),`${provenanceAssets.length} registered / ${repositoryMedia.length} files`);
  add('media-provenance-hash-and-size',provenanceAssets.every(asset=>existsSync(path(asset.path))&&statSync(path(asset.path)).size===asset.bytes&&hash(readFileSync(path(asset.path)))===asset.sha256));
  add('media-provenance-kind-counts',mediaProvenance?.stats?.byKind?.image===242&&mediaProvenance?.stats?.byKind?.audio===23&&mediaProvenance?.stats?.byKind?.video===7);
  add('media-provenance-honest-review',provenanceAssets.filter(asset=>asset.kind==='audio'||asset.kind==='video').every(asset=>asset.release==='LICENSE_REVIEW')&&mediaProvenance?.stats?.review===150&&mediaProvenance?.stats?.managed===122);
  add('media-provenance-internal-keyart-excluded',internalOnlyMedia.has('assets/resources/derived/project-curse-world-keyart-concept-v2.png')&&!provenancePaths.includes('assets/resources/derived/project-curse-world-keyart-concept-v2.png'));
  add('media-provenance-unselected-candidates-excluded',[...unselectedCandidateMedia].every(relative=>!provenancePaths.includes(relative)&&!app.includes(relative.split('/').at(-1))));
  add('media-provenance-reference-boundary',mediaProvenance?.referenceOnly?.map(item=>item.name).join('|')==='지옥.zip|Pictures.zip|Pictures2.zip'&&mediaProvenance?.stats?.referenceExposure===exposedReferenceFiles.length&&exposedReferenceFiles.length===0);
  add('media-provenance-delivery-lineage',provenanceAssets.filter(asset=>asset.provenance==='DELIVERY_DERIVATIVE').length===90&&provenanceAssets.filter(asset=>asset.provenance==='DELIVERY_DERIVATIVE').every(asset=>asset.derivedFrom&&provenancePaths.includes(asset.derivedFrom)));
  add('media-clearance-priority-30',mediaProvenance?.priorityQueue?.length===30&&mediaProvenance?.stats?.priorityAudio===23&&mediaProvenance?.stats?.priorityVideo===7&&mediaProvenance.priorityQueue.every((asset,index)=>asset.rank===index+1&&['audio','video'].includes(asset.kind)&&asset.priorityReason));
  // D 혼합: media-clearance-owner의 데이터/매체 조건.
  add('media-clearance-owner:data',structureData?.owners?.mediaClearanceRuntime==='assets/js/pages/media-clearance.js'&&structureData?.owners?.mediaClearanceCSS==='assets/css/media-clearance.css');
  const responsiveAssets=Object.values(mediaManifest?.assets||{});
  const responsiveVariants=responsiveAssets.flatMap(asset=>asset.variants||[]);
  add('adaptive-media-owner',structureData?.owners?.mediaManifest==='assets/js/data/media-manifest.js'&&structureData?.owners?.adaptiveMediaRuntime==='assets/js/core/adaptive-media.js'&&structureData?.owners?.adaptiveMediaCSS==='assets/css/adaptive-media.css');
  add('adaptive-media-forty-five-sources',mediaManifest?.version==='1.0.0'&&responsiveAssets.length===45&&responsiveVariants.length===90,`${responsiveAssets.length} sources / ${responsiveVariants.length} variants`);
  add('adaptive-media-regional-briefings',['assets/resources/derived/north-sea-blood-lake-blockade-reconstruction-concept-v1.png','assets/resources/derived/dead-zone-silent-interior-map-termination-concept-v1.png'].every(source=>mediaManifest?.assets?.[source]?.variants?.map(variant=>variant.width).join('|')==='480|960'));
  add('adaptive-media-world-history-scenes',['assets/resources/derived/2005-01-21-ash-crew_001_reconstructed.png','assets/resources/derived/2036-12-12-central-callsign-loss_001_reconstructed.png','assets/resources/derived/2038-06-29-sixth-northern-line_001_reconstructed.png','assets/resources/derived/2042-10-31-three-night-silence_001_reconstructed.png'].every(source=>mediaManifest?.assets?.[source]?.variants?.map(variant=>variant.width).join('|')==='480|960'));
  add('adaptive-media-variant-files',responsiveVariants.every(variant=>existsSync(path(variant.src))&&statSync(path(variant.src)).size>500));
  add('adaptive-media-originals-preserved',responsiveAssets.every(asset=>existsSync(path(asset.source))&&asset.variants.every(variant=>statSync(path(variant.src)).size<statSync(path(asset.source)).size)));
  add('quality-policy-owner',structureData?.owners?.qualityPolicy==='assets/js/core/quality-policy.js'&&structureData?.owners?.qualityPolicyCSS==='assets/css/quality-policy.css');
  add('field-dossier-four-records',greatBlackForest?.presentation==='region-dossier'&&deadZonePilgrimage?.presentation==='region-dossier'&&pilgrimRules?.presentation==='guide'&&brokenCrown?.presentation==='scenario');
  const authoredFieldSections=[...(greatBlackForest?.sections||[]),...(deadZonePilgrimage?.sections||[]),...(pilgrimRules?.sections||[])];
  const fieldTranscriptEntries=authoredFieldSections.flatMap(section=>section.transcript||[]);
  add('field-fifteen-authored-sections',authoredFieldSections.length===15&&authoredFieldSections.every(section=>section.record?.code&&section.record?.type&&section.record?.author&&section.record?.recipient&&section.record?.evidence&&section.record?.limit),authoredFieldSections.length);
  add('field-distinct-local-voices',fieldTranscriptEntries.length>=18&&new Set(fieldTranscriptEntries.map(entry=>entry.speaker)).size>=12&&['witness','editor','field','unknown','hostile'].every(tone=>fieldTranscriptEntries.some(entry=>entry.tone===tone)),`${fieldTranscriptEntries.length} fragments / ${new Set(fieldTranscriptEntries.map(entry=>entry.speaker)).size} speakers`);
  add('field-canon-ledger-boundary',read('WORLD_CANON_LEDGER.md').includes('현장 시나리오 정사 경계')&&read('WORLD_CANON_LEDGER.md').includes('브라우저 저장소의 지역 판정')&&read('WORLD_CANON_LEDGER.md').includes('규칙을 지켜 생존했다는 인과'));
  // D 혼합: regional-document-identities의 데이터/매체 조건.
  add('regional-document-identities:data',greatBlackForest?.theme==='great-black-forest'&&greatBlackForest?.telemetry?.length===3&&deadZonePilgrimage?.theme==='dead-zone'&&deadZonePilgrimage?.telemetry?.length===3);
  add('great-black-forest-dossier',greatBlackForest?.sections?.length===5&&JSON.stringify(greatBlackForest).includes('자유의 땅')&&JSON.stringify(greatBlackForest).includes('타락 야생체')&&greatBlackForest?.hero?.caption?.includes('복원 추정본'));
  add('dead-zone-dossier',deadZonePilgrimage?.sections?.length===5&&JSON.stringify(deadZonePilgrimage).includes('순례의 의미')&&JSON.stringify(deadZonePilgrimage).includes('혈교 지부의 분열')&&deadZonePilgrimage?.hero?.caption?.includes('복원 추정본'));
  add('pilgrim-rules-eleven',pilgrimRules?.sections?.length===5&&pilgrimRules.sections.filter(section=>section.table).flatMap(section=>section.table.rows).length===11);
  // D 혼합: broken-crown-branching-scenario의 데이터/매체 조건.
  add('broken-crown-branching-scenario:data',brokenCrown?.sections?.find(section=>section.branches)?.branches?.entries?.length===3&&brokenCrown?.sections?.find(section=>section.title==='6단계 작전 전개')?.table?.rows?.length===6);
  add('reconstructed-image-provenance',read('assets/resources/ASSET_REGISTRY.md').includes('RECONSTRUCTED')&&read('assets/resources/ASSET_REGISTRY.md').includes('복원 추정본')&&statSync(path('assets/resources/derived/great-black-forest_reconstructed-v1.png')).size>1_000_000&&statSync(path('assets/resources/derived/dead-zone-pilgrimage_reconstructed-v1.png')).size>1_000_000);
  add('archive-zone-guide',restoredZone?.presentation==='guide'&&restoredZone?.sections?.length===4&&JSON.stringify(restoredZone).includes('화이트존은 그린존과 옐로우존 사이에 있는 안전 단계가 아니다')&&JSON.stringify(restoredZone).includes('United Nations Anomaly Containment')&&JSON.stringify(restoredZone).includes('국제연합 산하기관은 아닌 독립기관')&&!JSON.stringify(restoredZone).includes('Level 7'),`${restoredZone?.sections?.length||0} sections / ${JSON.stringify(restoredZone||{}).length} chars`);
  add('archive-redzone-not-public',!archiveRegistry.includes("id:'Redzone_881120'"));
  add('archive-restored-canon-terms',![restoredZone,restoredRedzone].some(document=>/Urban Anomaly|도시 이상현상 격리국|신디케이트|하이먼/.test(JSON.stringify(document))));
  const restoredMedia=[restoredZone?.hero,...(restoredRedzone?.sections||[]).map(section=>section.image)].filter(Boolean);
  add('archive-restored-media-links',restoredMedia.length===7&&restoredMedia.every(media=>existsSync(path(media.src.replace(/^\.\.\/\.\.\//,'')))),restoredMedia.length);
  add('archive-nhc-manual-not-public',!archiveRegistry.includes("id:'NHC_Manual_891219'"));
  add('archive-nhc-canon-reconciled',!/Cursed Gear|Urban Anomaly|도시 이상현상 격리국|신디케이트|하이먼/.test(JSON.stringify(restoredNhcManual)));
  const nhcManualMedia=[restoredNhcManual?.hero,...(restoredNhcManual?.sections||[]).map(section=>section.image)].filter(Boolean);
  add('archive-nhc-media-links',nhcManualMedia.length===5&&nhcManualMedia.every(media=>existsSync(path(media.src.replace(/^\.\.\/\.\.\//,'')))),nhcManualMedia.length);
  add('archive-feral-source-restored',restoredFerals?.sections?.length===8&&JSON.stringify(restoredFerals).length>10000&&JSON.stringify(restoredFerals).includes('Ferals / 괴이')&&JSON.stringify(restoredFerals).includes('Superiors / 상위체')&&JSON.stringify(restoredFerals).includes('Unusuals / Artificial')&&JSON.stringify(restoredFerals).includes('블러드러커 / IMAGE-412CF')&&JSON.stringify(restoredFerals).includes('지하 오컬트 클럽 · P.O.H / IMAGE-782CF')&&JSON.stringify(restoredFerals).includes('오토마톤 시험 / IMAGE-499CF')&&JSON.stringify(restoredFerals).includes('화염방사기 오토마톤 · 전차 모드 / IMAGE-501HS')&&JSON.stringify(restoredFerals).includes('회화 「천사의 현존」 / IMAGE-241HS')&&JSON.stringify(restoredFerals).includes('유령 / IMAGE-751CF'),`${restoredFerals?.sections?.length||0} sections / ${JSON.stringify(restoredFerals||{}).length} chars`);
  add('archive-feral-canon-reconciled',JSON.stringify(restoredFerals).includes('초기 현장에서 Superiors를 구분')&&JSON.stringify(restoredFerals).includes('봉인은 대부분의 마법 조작')&&!/Urban Anomaly|도시 이상현상 격리국|신디케이트|하이먼|Cursed Gear/.test(JSON.stringify(restoredFerals)));
  const feralMedia=[restoredFerals?.hero,...(restoredFerals?.sections||[]).flatMap(section=>[section.image,...(section.groups||[]).map(group=>group.image)])].filter(Boolean);
  add('archive-feral-media-links',feralMedia.length===18&&feralMedia.every(media=>existsSync(path(media.src.replace(/^\.\.\/\.\.\//,'')))),feralMedia.length);
  add('archive-feral-organized-slides',feralCinematic?.pages?.length===19&&feralCinematic.pages[0]?.code==='CLASSIFIED MATERIAL / NOTICE'&&feralCinematic.pages.filter(page=>page.layout==='evidenceCenter').length===15&&feralCinematic.pages.filter(page=>String(page.code||'').startsWith('CHAPTER ')).map(page=>page.code).join('|')==='CHAPTER 01 / FERALS'&&!feralCinematic.pages.some(page=>page.group==='doctrine')&&feralCinematic.pages.at(-1)?.group==='return',feralCinematic?.pages?.length||0);
  add('archive-feral-no-redundant-opening',!feralCinematic?.pages?.some(page=>page.code==='U.A.C / FERAL CLASSIFICATION'||page.subtitle==='원문 복원·통합 개정본 / 1997.01.27'));
  add('archive-feral-slide-media',feralCinematic?.pages?.filter(page=>page.image).length===17&&feralCinematic.pages.filter(page=>page.image).every(page=>existsSync(path(page.image))),feralCinematic?.pages?.filter(page=>page.image).length||0);
  // D 혼합: archive-feral-no-cult-duplicate의 데이터/매체 조건.
  add('archive-feral-no-cult-duplicate:data',!JSON.stringify(restoredFerals).includes('가면을 쓴 존재 / IMAGE-0321')&&!feralCinematic.pages.some(page=>page.subtitle==='IMAGE-0321'));
  add('archive-feral-reference-frame-mapped',!JSON.stringify(restoredFerals).includes('TRACE-UNIDENTIFIED')&&!JSON.stringify(restoredFerals).includes('분류 보류 · 원본 프레임')&&restoredFerals?.sections?.find(section=>section.title==='Ferals / 괴이')?.image?.src?.includes('cf7fc001f5b5f83c079dbded4da7d3f5.webp')&&restoredFerals.sections.find(section=>section.title==='Ferals / 괴이')?.paragraphs?.length===2&&restoredFerals.sections.find(section=>section.title==='Ferals / 괴이')?.paragraphs?.[0]?.includes('모든 분류 가운데 가장 많은 수')&&restoredFerals.sections.find(section=>section.title==='Ferals / 괴이')?.paragraphs?.[1]?.includes('기원이 주술적이며 이계의 무언가와 연결')&&feralCinematic?.pages?.find(page=>page.code==='CHAPTER 01 / FERALS')?.title==='괴이'&&feralCinematic.pages.find(page=>page.code==='CHAPTER 01 / FERALS')?.layout==='twoColumn'&&feralCinematic.pages.find(page=>page.code==='CHAPTER 01 / FERALS')?.image?.includes('cf7fc001f5b5f83c079dbded4da7d3f5.webp'));
  // D 혼합: archive-feral-compact-source-frames의 데이터/매체 조건.
  add('archive-feral-compact-source-frames:data',feralCinematic?.pages?.find(page=>page.code==='CLASSIFICATION MAP / RESTORED')?.layout==='classificationChart'&&feralCinematic.pages.find(page=>page.code==='CLASSIFICATION MAP / RESTORED')?.lines?.length===0&&feralCinematic.pages.find(page=>page.code==='CLASSIFICATION MAP / RESTORED')?.caption==='괴이 단순화 분류도'&&feralCinematic.pages.find(page=>page.code==='CLASSIFICATION MAP / RESTORED')?.credit==='작성자 — 키무라 쿄'&&feralCinematic.pages.find(page=>page.code==='CLASSIFIED MATERIAL / NOTICE')?.layout==='warningNotice'&&feralCinematic.pages.find(page=>page.code==='CLASSIFIED MATERIAL / NOTICE')?.lines?.length===3);
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
  // A 혼합: dossiers 데이터 부재를 유지. 옛 카드 렌더러 문자열 검사는 화면 검증으로 인계.
  add('archive-no-dossiers',!('dossiers' in (archiveData||{})));
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
  add('faction-analysis-seventeen',factionAnalysis?.order?.join('|')==='uac|nhc|sid|fhc|ashcrew|arf|cpd|syndicate|ushinoda|haimun|corruption-cult|blood-cult|shadow-cult|first-apostle|southern-blood|deadzone-blood|amarion');
  add('faction-analysis-groups',factionAnalysis?.groups?.map(group=>group.keys.join(',')).join('|')==='uac,nhc,sid,fhc|ashcrew,arf,cpd|syndicate,ushinoda,haimun|corruption-cult,blood-cult,shadow-cult,first-apostle,southern-blood,deadzone-blood|amarion');
  add('faction-analysis-depth',factionAnalysis?.order?.every(key=>factionAnalysis.factions[key]?.overview?.length>=3&&factionAnalysis.factions[key]?.chronology?.length>=5&&factionAnalysis.factions[key]?.relations?.length>=3));
  add('faction-mark-registry-seventeen',factionMarks?.version===VERSION&&Object.keys(factionMarks?.marks||{}).length===17);
  add('faction-mark-eleven-image-masters',factionMarks?.redesigned?.join('|')==='uac|nhc|sid|fhc|syndicate|ushinoda|haimun|ashcrew|arf|cpd|amarion'&&factionMarks.redesigned.every(key=>factionMarks.marks[key]?.asset===`assets/faction_marks/v3/${key}.png`&&factionMarks.marks[key]?.previousAsset===`assets/faction_marks/${key}.svg`&&factionMarks.marks[key]?.legacyAsset?.endsWith('.webp')&&factionMarks.marks[key]?.symbols?.length>=3));
  add('faction-lineage-six-image-masters',factionMarks?.lineageMarks?.join('|')==='corruption-cult|blood-cult|shadow-cult|first-apostle|southern-blood|deadzone-blood'&&factionMarks.lineageMarks.every(key=>factionMarks.marks[key]?.asset===`assets/faction_marks/v3/${key}.png`&&factionMarks.marks[key]?.previousAsset===`assets/faction_marks/${key}.svg`&&factionMarks.marks[key]?.symbols?.length>=3));
  add('faction-mark-assets',Object.values(factionMarks?.marks||{}).every(mark=>existsSync(path(mark.asset))&&existsSync(path(mark.previousAsset))&&(!mark.legacyAsset||existsSync(path(mark.legacyAsset)))));
  add('faction-lineage-schema',factionLineage?.version===VERSION&&factionLineage?.schema==='project-curse-faction-lineage-v1'&&factionLineage?.order?.length===7&&factionLineage?.sects?.join('|')==='corruption-cult|blood-cult|shadow-cult');
  add('faction-lineage-rank-boundary',factionLineage?.rules?.some(rule=>rule.includes('교리상 로드좌 1석과 사도석 4석'))&&factionLineage.rules.some(rule=>rule.includes('센티넬은 계급이 아니라'))&&factionLineage.nodes?.['first-apostle']?.kind.includes('세력 아님'));
  add('faction-lineage-command-states',factionLineage?.edges?.some(edge=>edge.from==='blood-cult'&&edge.to==='southern-blood'&&edge.state==='disputed')&&factionLineage.edges.some(edge=>edge.from==='southern-blood'&&edge.to==='deadzone-blood'&&edge.state==='split'));
  add('faction-lineage-history-links',Object.values(factionLineage?.nodes||{}).every(node=>node.history.every(id=>worldHistoryData?.records?.[id])));
  // D 혼합: faction-mark-name-index의 데이터/매체 조건.
  add('faction-mark-name-index:data',factionAnalysis?.order?.every(key=>!('subtitle' in factionAnalysis.factions[key])));
  add('personnel-profile-schema',personnelProfiles?.version===VERSION&&personnelProfiles?.schema==='project-curse-personnel-profile-v1'&&personnelProfiles?.status==='SUPPLEMENTAL IDENTITY / PROVISIONAL'&&Object.keys(personnelProfiles.profiles||{}).length===56);
  const personnelRemake=context.window.ProjectCursePersonnelRemake;
  add('personnel-remake-schema',personnelRemake?.version===VERSION&&personnelRemake?.schema==='project-curse-personnel-remake-v1'&&Object.keys(personnelRemake.records||{}).length===56&&Object.keys(personnelRemake.groupOverrides||{}).length===10);
  add('personnel-registry-schema',personnelData?.version===VERSION&&personnelData?.schema==='project-curse-personnel-v3'&&personnelData.records.length===56&&personnelData.groups.length===10,`${personnelData?.records?.length||0} records / ${personnelData?.groups?.length||0} groups`);
  add('personnel-registry-unique-ids',new Set(personnelData?.records?.map(record=>record.id)).size===56);
  // D 혼합: personnel-independent-boundary의 데이터/매체 조건.
  add('personnel-independent-boundary:data',!personnelData.byId?.frey&&!/프레이|frey/i.test(personnelProfileSource+personnelRemakeSource+personnelDataSource)&&personnelData?.editorialRule?.includes('개편 정본명'));
  add('personnel-complete-supplemental-dossiers',personnelData?.stats?.profiled===56&&personnelData.records.every(record=>record.identity?.sex&&record.identity?.birth&&record.identity?.age&&record.identity?.origin&&record.identity?.nationality&&record.affiliationSummary&&record.personality?.temperament&&record.personality?.drive&&record.personality?.fear&&record.background?.length>=2&&record.history?.length>=3&&record.fieldNotes?.length),personnelData?.stats?.profiled||0);
  add('personnel-record-year-age-basis',personnelData.records.every(record=>/기록|추정|외형|육체별/.test(record.identity.age)&&!/현재\s*나이/.test(record.identity.age)));
  add('personnel-renamed-alias-preservation',personnelData?.stats?.renamed>=35&&personnelData.records.filter(record=>record.sourceName).every(record=>record.aliases?.includes(record.sourceName))&&personnelData.byId?.maya?.name==='이시카와 마야'&&personnelData.byId?.sasaki?.name==='사사키 토오루'&&personnelData.byId?.baranto?.name==='마테오 오르테가'&&personnelData.byId?.baranto?.aliases?.includes('바란토'));
  add('personnel-distinct-aarons',personnelData.byId?.['aaron-uac']?.name==='에런 벡'&&personnelData.byId?.['aaron-syndicate']?.name==='이드리스 케이지'&&personnelData.byId['aaron-uac'].sourceName==='아론'&&personnelData.byId['aaron-syndicate'].sourceName==='아론');
  add('personnel-world-functions',personnelData.records.every(record=>record.unit&&record.recordFunction&&record.incident)&&personnelData.records.filter(record=>record.abilitySource).every(record=>record.abilityCost));
  add('personnel-legacy-status-boundary',personnelData?.stats?.deceased===3&&personnelData.records.filter(record=>record.status==='deceased').map(record=>record.id).join('|')==='yanami-shinka|duka|reiki'&&personnelData.byId?.dennis?.limits?.some(item=>item.includes('원문이 누락')));
  add('personnel-duplicate-identity-safety',personnelData.byId?.['aaron-uac']?.relationships?.some(item=>item.target==='aaron-syndicate'&&item.certainty==='unresolved')&&personnelData.byId?.['aaron-syndicate']?.relationships?.some(item=>item.target==='aaron-uac'&&item.certainty==='unresolved')&&personnelData.byId?.['brian-alberoz']?.limits?.some(item=>item.includes('관계를 확정하지 않는다')));
  add('personnel-sakuma-cross-affiliation',personnelData.byId?.['sakuma-yuta']?.aliases?.includes('레드 마우스')&&personnelData.byId['sakuma-yuta'].affiliations.map(item=>item.key).join('|')==='uac|fhc|haimun');
  add('personnel-faction-index',personnelData?.factionIndex?.fhc?.length===11&&personnelData?.factionIndex?.ushinoda?.length===12&&personnelData?.factionIndex?.['blood-cult']?.length===1&&personnelData?.factionIndex?.['corruption-cult']?.length===1&&personnelData?.factionIndex?.nhc?.length===5);
  add('personnel-manifest-ownership',structureData?.owners?.personnelProfiles==='assets/js/data/personnel-profile-data.js'&&structureData?.owners?.personnelRemake==='assets/js/data/personnel-remake-data.js'&&structureData?.owners?.personnelData==='assets/js/data/personnel-data.js'&&structureData?.owners?.personnelRuntime==='assets/js/pages/personnel-archive.js'&&structureData?.owners?.personnelCSS==='assets/css/personnel-archive.css');
  // D 혼합: uac-independent-in-history의 데이터/매체 조건.
  add('uac-independent-in-history:data',factionAnalysisSource.includes('UN 산하기관은 아니며'));
  add('history-ten-canon-eras',worldHistoryData?.version===VERSION&&worldHistoryData?.eras?.length===10&&worldHistoryData.eras.map(era=>era.id).join('|')==='deep|origin|exposure|institution|separation|fracture|silence|frontiers|mobilization|aftermath');
  add('history-base-forty-six-evidence-records',Object.keys(worldHistoryData?.records||{}).length===46&&Object.values(worldHistoryData.records).every(record=>worldHistoryData.evidenceLevels[record.evidence]&&worldHistoryData.eras.some(era=>era.id===record.era)));
  // D 혼합: history-deep-world-framework의 데이터/매체 조건.
  add('history-deep-world-framework:data',worldHistoryData?.deepHistoryRecords?.length===8&&worldHistoryData?.worldFramework?.ontology?.length===4&&worldHistoryData.worldFramework.abilitySources?.length===7&&worldHistoryData.worldFramework.civilianSystems?.length===5);
  // 2026-09-25 사용자 설정: 리버스 지점의 민간인 빙의. 네 구분에 끼워 넣지 않고, 분류 근거 기록과 미확인 범위를 함께 둔다.
  const possession=worldHistoryData?.worldFramework?.reverseSiteCivilians;
  add('history-reverse-site-possession:data',Boolean(possession?.label&&possession.rule&&possession.handling&&possession.caution)&&possession.record==='Ferals_860722'&&Boolean(context.window.ProjectCurseArchiveDocuments?.documents?.Ferals_860722?.sections?.some(s=>(s.items||[]).some(t=>t.includes('빙의 상태의 생존자를 자동으로 괴이 분류에 넣지 않는다')))));
  const japanTechRecords=japanTechnology?.records||[];
  const japanTechIds=japanTechRecords.map(record=>record.id).join('|');
  const expectedJapanTechIds='1982-04-06-sixth-instrumentation|1985-09-18-optical-return-test|1987-11-04-jid87-standard|1990-04-12-municipal-mesh-pilot|1992-10-30-sixth-program-dispersal';
  add('history-japan-technology-schema',japanTechnology?.version===VERSION&&japanTechnology?.schema==='project-curse-japan-technology-v1'&&japanTechRecords.length===5&&japanTechnology?.technologies?.length===7&&japanTechnology?.edges?.length===6);
  add('history-fifty-one-total-records',Object.keys(worldHistoryData?.records||{}).length+japanTechRecords.length===51);
  add('history-japan-technology-record-depth',japanTechRecords.every(record=>record.id&&record.date&&record.title&&record.summary&&record.author&&record.recipient&&record.purpose&&record.basis&&record.sourceState&&record.fragments?.length>=3&&worldHistoryData.evidenceLevels[record.evidence]&&worldHistoryData.eras.some(era=>era.id===record.era)));
  add('history-japan-technology-chronology',japanTechIds===expectedJapanTechIds,japanTechIds);
  add('history-japan-public-boundaries',japanTechnology?.publicAnchors?.length===4&&japanTechnology.publicAnchors.map(anchor=>anchor.id).join('|')==='fgcs|optical-network|tron|bubble'&&japanTechnology.publicAnchors.every(anchor=>anchor.fact&&anchor.boundary&&anchor.source&&anchor.url.startsWith('https://')));
  add('history-japan-downstream-lineage',japanTechnology?.technologies?.some(item=>item.record==='2003-02-05-city-barrier'&&item.state==='derived')&&japanTechnology.technologies.some(item=>item.record==='2026-08-20-northern-reversal'&&item.state==='derived')&&worldHistoryProse?.records?.['2003-02-05-city-barrier']?.fragments?.some(fragment=>fragment.text.includes('제6계측계획'))&&worldHistoryProse?.records?.['2026-08-20-northern-reversal']?.fragments?.some(fragment=>fragment.text.includes('JID-87')));
  add('history-japan-separation-policy',japanTechRecords[0]?.fragments?.some(fragment=>fragment.text.includes('하위조직으로 활동하지 않으며'))&&japanTechnology?.publicAnchors?.find(anchor=>anchor.id==='bubble')?.boundary?.includes('버블의 발생이나 붕괴를')&&japanTechRecords.every(record=>!record.summary.includes('F.H.C')));
  add('history-post-2006-chronicle',worldHistoryData?.post2006Records?.length===20&&worldHistoryData.post2006Records.every(record=>record.id&&record.date&&record.title&&record.summary&&record.paragraphs?.length>=3)&&worldHistoryData.records['2030-01-17-broken-crown']?.title==='부서진 왕관 개시');
  const aftermathRecords=worldHistoryData?.post2006Records?.filter(record=>record.era==='aftermath')||[];
  add('history-post-2030-common-chronicle',aftermathRecords.length===6&&aftermathRecords.map(record=>record.id).join('|')==='2031-02-03-branch-seal|2032-08-14-three-bells-compact|2034-04-22-inland-beacon-31|2036-12-12-central-callsign-loss|2038-06-29-sixth-northern-line|2042-10-31-three-night-silence');
  add('history-post-2030-canon-boundary',worldHistoryData?.records?.['2031-02-03-branch-seal']?.summary?.includes('서로 양립할 수 없는 네 작전 결과철')&&worldHistoryData?.records?.['2036-12-12-central-callsign-loss']?.paragraphs?.some(text=>text.includes('중앙조직의 소멸을 선언하지 않았다'))&&worldHistoryData?.records?.['2042-10-31-three-night-silence']?.paragraphs?.some(text=>text.includes('두 지역이 연결됐다는 결론을 보류했다')));
  // D 혼합: history-direct-crosslinks의 데이터/매체 조건.
  add('history-direct-crosslinks:data',aftermathRecords.every(record=>Array.isArray(record.factions)&&Array.isArray(record.records)));
  add('history-incident-date-links',incidentData?.incidents?.['evt-northern-front']?.history==='2026-08-20-northern-reversal'&&incidentData?.incidents?.['evt-deadzone-return']?.history==='2029-04-12-checkpoint-07'&&incidentData?.incidents?.['evt-southern-mobilization']?.history==='2030-01-17-broken-crown');
  add('history-canon-gap-registry',worldHistoryData?.unresolved?.length===6&&worldHistoryData.unresolved.some(item=>item.id==='great-black-forest-boundary')&&worldHistoryData.unresolved.some(item=>item.id==='observer-divergence')&&worldHistoryData.unresolved.some(item=>item.id==='containment-drift')&&worldHistoryData.unresolved.some(item=>item.id==='wielder-ceiling')&&!worldHistoryData.unresolved.some(item=>item.id==='southern-geography'||item.id==='post-2006-chronology'||item.id==='alt-japan-technology')&&read('WORLD_CANON_LEDGER.md').includes('2007–2042 가상 역사 기준점')&&read('WORLD_CANON_LEDGER.md').includes('실제 역사 결합 원칙')&&read('WORLD_CANON_LEDGER.md').includes('일본 기술 도약 기준점'));
  const proseRecords=Object.values(worldHistoryProse?.records||{});
  const proseText=proseRecords.flatMap(record=>record.fragments||[]).map(fragment=>fragment.text).join('\n');
  const proseTypes=new Set(proseRecords.map(record=>record.documentType));
  const fragmentCounts=new Set(proseRecords.map(record=>record.fragments?.length||0));
  add('history-authored-prose-fifty-one',worldHistoryProse?.version===VERSION&&proseRecords.length===46&&japanTechRecords.length===5&&[...proseRecords,...japanTechRecords].every(record=>record.author&&record.recipient&&record.purpose&&record.fragments?.length>=2));
  add('history-prose-canon-id-parity',Object.keys(worldHistoryProse?.records||{}).sort().join('|')===Object.keys(worldHistoryData?.records||{}).sort().join('|')&&structureData?.owners?.worldHistoryProse==='assets/js/data/world-history-prose-data.js');
  add('history-eight-document-voices',Object.keys(worldHistoryProse?.documentTypes||{}).length===8&&proseTypes.size===8);
  add('history-variable-fragment-structure',fragmentCounts.size>=3&&proseRecords.some(record=>record.fragments?.some(fragment=>fragment.kind==='log'))&&proseRecords.some(record=>record.fragments?.some(fragment=>fragment.kind==='quote')));
  add('history-prose-pattern-audit',!/~의 계기가|결국 .*이어졌다|단순한 .*아니었다|진실은 확인되지|라고 판단했다|에 가까웠다|이때부터|두 번째 이유/.test(proseText));
  const pre2031ProseIds=Object.keys(worldHistoryProse?.records||{}).filter(id=>/^\d{4}/.test(id)&&Number(id.slice(0,4))<=2030);
  add('history-1975-2030-explicit-record-limits',pre2031ProseIds.length===32&&pre2031ProseIds.every(id=>worldHistoryProse.recordLimits?.[id]&&worldHistoryProse.records[id].archiveLimit===worldHistoryProse.recordLimits[id]));
  // D 혼합: history-2006-reconstruction-boundary의 데이터/매체 조건.
  add('history-2006-reconstruction-boundary:data',worldHistoryProse?.records?.['2006-12-31-aftermath']?.visual?.src?.includes('joint-response-unit-unlisted-eleventh-group')&&worldHistoryProse.records['2006-12-31-aftermath'].visual.caption.includes('실제 단체사진'));
  add('history-northern-front-reconstruction-boundary',worldHistoryProse?.records?.['2026-08-20-northern-reversal']?.visual?.src==='assets/resources/derived/northern-front-duplicate-signal-reconstruction-concept-v1.png'&&worldHistoryProse.records['2026-08-20-northern-reversal'].visual.className==='RECONSTRUCTED'&&worldHistoryProse.records['2026-08-20-northern-reversal'].visual.caption.includes('실제 전황 사진')&&visualEvidence?.known?.['assets/resources/derived/northern-front-duplicate-signal-reconstruction-concept-v1.png']?.assetId==='VEA-NF-DUP-01');
  const aftermathProse=['2031-02-03-branch-seal','2032-08-14-three-bells-compact','2034-04-22-inland-beacon-31','2036-12-12-central-callsign-loss','2038-06-29-sixth-northern-line','2042-10-31-three-night-silence'].map(id=>worldHistoryProse.records[id]);
  add('history-aftermath-distinct-working-voices',aftermathProse.every(record=>record?.author&&record?.recipient&&record?.purpose&&record.fragments?.length>=3)&&aftermathProse.some(record=>record.fragments.some(fragment=>fragment.label==='봉인실 메모'))&&aftermathProse.some(record=>record.fragments.some(fragment=>fragment.label==='정비반 음성'))&&aftermathProse.some(record=>record.fragments.some(fragment=>fragment.label==='신호장교 구두보고')));
  // D 혼합: faction-three-distinct-field-profiles의 데이터/매체 조건.
  add('faction-three-distinct-field-profiles:data',['uac','ushinoda','blood-cult'].every(key=>factionAnalysis?.factions?.[key]?.profile?.items?.length===3)&&new Set(['uac','ushinoda','blood-cult'].map(key=>factionAnalysis.factions[key].profile.code)).size===3);
  const factionAssessmentFields=['status','lineage','misconception','past','unresolved'];
  // D 혼합: faction-seventeen-context-assessments의 데이터/매체 조건.
  add('faction-seventeen-context-assessments:data',factionAnalysis?.order?.length===17&&factionAnalysis.order.every(key=>factionAssessmentFields.every(field=>factionAnalysis.factions[key]?.assessment?.[field])));
  // D 혼합: faction-first-apostle-visual-boundary의 데이터/매체 조건.
  add('faction-first-apostle-visual-boundary:data',factionAnalysis?.factions?.['first-apostle']?.visual?.className==='RECONSTRUCTED'&&factionAnalysis.factions['first-apostle'].visual.caption.includes('단일 개체 여부'));
  add('faction-nhc-personnel-visual-boundary',factionAnalysis?.factions?.nhc?.visual?.className==='RECONSTRUCTED'&&factionAnalysis.factions.nhc.visual.caption.includes('실제 단체사진')&&factionAnalysis.factions.nhc.visual.caption.includes('소매 표식'));
  // D 혼합: visual-evidence-readable-status-badges의 데이터/매체 조건.
  add('visual-evidence-readable-status-badges:data',visualEvidence?.version==='1.1.0'&&visualEvidence.classes.ORIGINAL.label==='원본 보존'&&visualEvidence.classes.RECONSTRUCTED.label==='복원 추정'&&visualEvidence.classes.UNVERIFIED.label==='출처 대조 대기');
  add('history-1995-public-record-boundary',worldHistoryProse?.records?.['1995-03-20-tokyo-subway']?.fragments?.some(fragment=>fragment.text.includes('도쿄 지하철 공격의 실행 주체와 피해 사실은 공개 수사·재판 기록을 따른다'))&&worldHistoryProse.records['1995-03-20-tokyo-subway'].fragments.some(fragment=>fragment.text.includes('직접적인 인과관계는 등록하지 않는다')));
  add('history-writing-standard',read('WRITING_STYLE_GUIDE.md').includes('기록 작성 전 확인')&&read('WRITING_STYLE_GUIDE.md').includes('기관별 목소리')&&read('WRITING_STYLE_GUIDE.md').includes('실제 역사'));
  const publicAppCopy=app.replace(article(app,'Cults_871104'),'').replace(article(app,'Immortality_860201'),'');
  const publicCopy=[publicAppCopy,worldHistoryDataSource,worldHistoryProseSource,factionAnalysisSource,fieldDossierData,homeIntelligenceData,dataSource('assets/js/data/pilgrimage-scenario-data.js'),dataSource('assets/js/data/verdict-archive-data.js')].join('\n');
  const forbiddenPublicCopy=['정사','캐논','플레이어','독자 선택','시나리오 모드','메인 스토리','AI 이미지','생성 이미지'].filter(term=>publicCopy.includes(term));
  add('public-copy-no-meta-language',forbiddenPublicCopy.length===0,forbiddenPublicCopy.join('|'));
  const publicConceptAssets=['project-curse-world-keyart-concept-v1.png','great-black-forest-unlit-fortress-bell-concept-v1.png','checkpoint-07-five-thermal-concept-v1.png','broken-crown-erased-commander-concept-v1.png','first-apostle-three-traces-reconstruction-concept-v1.png','joint-response-unit-unlisted-eleventh-group-concept-v1.png','nhc-young-soldiers-forward-base-group-photo-concept-v1.png','northern-front-duplicate-signal-reconstruction-concept-v1.png','north-sea-blood-lake-blockade-reconstruction-concept-v1.png','dead-zone-silent-interior-map-termination-concept-v1.png','2005-01-21-ash-crew_001_reconstructed.png','2036-12-12-central-callsign-loss_001_reconstructed.png','2038-06-29-sixth-northern-line_001_reconstructed.png','2042-10-31-three-night-silence_001_reconstructed.png'];
  const publicConceptSources=[fieldDossierData,factionAnalysisSource,worldHistoryProseSource,visualEvidenceData].join('\n');
  // D 혼합: fourteen-concept-images-selectively-integrated의 데이터/매체 조건.
  add('fourteen-concept-images-selectively-integrated:data',publicConceptAssets.every(name=>publicConceptSources.includes(name))&&!publicConceptSources.includes('project-curse-world-keyart-concept-v2.png'));
  add('history-four-new-reconstruction-visuals',['2005-01-21-ash-crew','2036-12-12-central-callsign-loss','2038-06-29-sixth-northern-line','2042-10-31-three-night-silence'].every(id=>worldHistoryProse?.records?.[id]?.visual?.className==='RECONSTRUCTED'&&worldHistoryProse.records[id].visual.src?.includes(`${id}_001_reconstructed.png`)));
  for(const file of [structureData?.audio?.ambient,...Object.values(structureData?.audio?.effects||{})]){
    add(`audio-asset:${file}`,!!file&&existsSync(path(`assets/audio/${file}`)));
  }

}

try{
  if(process.argv.length>3) throw new Error('Usage: node tools/verify-data.mjs [repository-root]');
  verify();
}catch(error){
  add('data-verification-execution',false,error.message);
}

console.log(`Project Curse ${VERSION} data verification`);
checks.forEach(check=>console.log(`${check.pass?'PASS':'FAIL'}  ${check.name}${check.detail?`  ${check.detail}`:''}`));
const failed=checks.filter(check=>!check.pass);
console.log(`\n${checks.length-failed.length}/${checks.length} checks passed`);
if(failed.length) process.exitCode=1;
