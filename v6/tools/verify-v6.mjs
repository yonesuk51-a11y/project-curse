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
const mapDataPath=path.join(v6Dir,'assets','js','map-data.js');
const mapDataText=fs.readFileSync(mapDataPath,'utf8');
const peopleDataPath=path.join(v6Dir,'assets','js','people-data.js');
const peopleDataText=fs.readFileSync(peopleDataPath,'utf8');
const cssText=fs.readFileSync(path.join(v6Dir,'assets','css','foundation.css'),'utf8');

assert(runtimeFiles.length>=9,`runtime files found (${runtimeFiles.length})`);
assert(!runtimeText.includes('assets/js/main.js'),'legacy main.js is not loaded by V6 runtime');
assert(!runtimeText.includes('assets/css/style.css'),'legacy style.css is not loaded by V6 runtime');
assert(!/<(?:audio|video|iframe)\b/i.test(runtimeText),'no automatic audio, video, or iframe surface');
assert(indexText.includes('type="module"'),'V6 entry uses ES modules');
assert(indexText.includes('data-boot-skip'),'boot sequence has an explicit skip control');
assert(indexText.includes('data-v6-content-skip'),'content skip control is routed outside the hash parser');
assert(indexText.includes('href="#/map" data-route="map"'),'evidence map is a primary V6 channel');
assert(indexText.includes('href="#/people" data-route="people"'),'personnel intake is a primary V6 channel');
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
const mapData=await import(`${pathToFileURL(mapDataPath).href}?verify=${Date.now()}`);
const peopleData=await import(`${pathToFileURL(peopleDataPath).href}?verify=${Date.now()}`);
assert(data.V6_BUILD.version==='6.0.0-alpha.4','V6 build is alpha.4');
assert(data.FACTION_MARKS.length===17,'all 17 faction form studies are registered');
assert(new Set(data.FACTION_MARKS.map(item=>item.id)).size===17,'faction mark IDs are unique');
assert(data.FACTION_MARKS.every(item=>cssText.includes(`[data-mark="${item.id}"]`)),'all 17 faction marks have code-native silhouettes');
assert(data.FACTION_MARKS.every(item=>['seal','badge','map'].every(variant=>item.variants.includes(variant))),'all faction marks declare seal, badge, and map variants');
assert(data.FACTION_MARKS.reduce((sum,item)=>sum+item.variants.length,0)===51,'17 marks expose 51 context variants');
assert(data.FACTION_MARKS.every(item=>item.fullName&&item.name&&item.doctrine&&item.cost&&item.nameStatus&&item.markStatus),'every faction mark separates identity, doctrine, cost, name status, and mark status');
assert(data.FACTION_MARKS.every(item=>['official','field-attested','reconstructed','analyst'].includes(item.status)),'faction mark statuses use the four-frame vocabulary');
assert(data.FACTION_MARKS.every(item=>Array.isArray(item.nameLedger)&&item.nameLedger.every(row=>row.name&&row.role)),'all alternate names carry an explicit ledger role');
assert(['seal','badge','map'].every(variant=>cssText.includes(`pc-v6-mark-stage--${variant}`)),'all three mark context frames exist in CSS');
const coreNames=Object.fromEntries(data.FACTION_MARKS.map(item=>[item.id,item.fullName]));
assert(coreNames.uac==='Unified Anomaly Compact','U.A.C A02 name proposal is registered');
assert(coreNames.nhc==='Nonlinear Hazard Command','N.H.C A02 name proposal is registered');
assert(coreNames.sid==='Signal Integrity Directorate','S.I.D A02 name proposal is registered');
assert(coreNames.fhc==='Frontier Habitat Consortium','F.H.C A02 name proposal is registered');
assert(coreNames.son==='Severed Order Network','S.O.N A02 field-name proposal is registered');
assert(coreNames.poh==='Persons on Hold','P.O.H A02 analyst-name proposal is registered');
assert(coreNames.arf==='Asset Recovery Force','A.R.F A02 subunit-name proposal is registered');
assert(coreNames.cpd==='Civilian Processing Division','C.P.D A02 internal-name proposal is registered');
const factionById=Object.fromEntries(data.FACTION_MARKS.map(item=>[item.id,item]));
assert(factionById.amarion.fullName==='Amarion'&&factionById.amarion.name==='아마리온','Amarion is not promoted to an unsupported legal name');
assert(!factionById.uac.nameLedger.some(row=>row.name==='Urban Anomaly Council')&&factionById.uac.nameLedger.some(row=>row.name==='Urban Anomaly Containment'),'U.A.C legacy ledger excludes the unsupported Council expansion');
assert(factionById.nhc.earlyLabel?.kind.includes('OR LATER EDITORIAL LABEL')&&factionById.nhc.earlyLabel?.confidence==='DISPUTED','1984–1986 N.H.C keeps equipment-standard and later-label hypotheses disputed');
assert(factionById.cpd.publicName?.fullName==='Civilian Protection Division'&&factionById.cpd.precursor?.fullName==='Civilian Protection Directive','C.P.D public cover and acronym precursor are separate');
assert(factionById.son.nameStatus!==factionById.son.markStatus&&factionById.poh.nameStatus!==factionById.poh.markStatus,'S.O.N and P.O.H name status stays separate from mark provenance');
assert(data.FACTION_LINEAGE.length>=10,'faction lineage and transaction ledger is registered');
assert(data.FACTION_LINEAGE.every(item=>item.relationType&&['forward','bidirectional','none'].includes(item.direction)),'every faction relation declares type and direction');
assert(data.FACTION_LINEAGE.some(item=>item.from==='nhc-early-label'&&item.to==='nhc'&&item.relationType==='DISPUTED ACRONYM REFERENCE'&&item.direction==='none'&&item.confidence==='DISPUTED'),'N.H.C early label is non-genealogical and disputed');
assert(data.FACTION_LINEAGE.some(item=>item.from==='nhc'&&item.to==='ashcrew'&&item.relationType.includes('SPLIT')),'N.H.C to Ash Crew former-command split is registered');
assert(data.FACTION_LINEAGE.some(item=>item.from==='nhc'&&item.to==='redwolf'&&item.relationType.includes('SPLIT')),'N.H.C to Red Wolf former-command split is registered');
assert(data.FACTION_LINEAGE.some(item=>item.from==='redwolf'&&item.to==='son'&&item.relationType.includes('JOINING')),'Red Wolf personnel joining S.O.N is registered without full succession');
assert(data.FACTION_LINEAGE.some(item=>item.from==='poh'&&item.to==='haimun-cell'&&item.confidence==='DISPUTED'),'P.O.H and Haimun remain separate and disputed');
const factionEntityIds=new Set([...data.FACTION_MARKS,...data.FACTION_ENTITIES].map(item=>item.id));
assert(data.FACTION_LINEAGE.every(item=>factionEntityIds.has(item.from)&&factionEntityIds.has(item.to)),'every faction relation endpoint resolves through mark or entity registries');
assert(data.FACTION_BRANCHES.length===3&&data.FACTION_BRANCHES.every(item=>item.parentId==='fhc'&&item.commandStatus==='DISPUTED'),'F.H.C branches use parent cartouches and disputed command status');
assert(data.IMMORTALITY_ACTS.length===4,'Immortality reconstruction has four acts');
assert(data.IMMORTALITY_ACTS.every(item=>item.sourceRef),'every Immortality act cites protected-record times');
assert(data.CULT_INDEX.every(item=>item.sourceRef),'every Cults study cites a protected-record page');
assert(data.WORLD_FOUNDATION.lossDoctrine.length===5,'five-part loss doctrine is registered');
assert(data.CORE_TERMS.length===6,'six core anomaly terms are registered');
assert(data.V6_ERAS.length===6,'1975–2042 history is grouped into six eras');
assert(mapData.MAP_DISCLOSURE.coordinateType==='DISPLAY_PLOT'&&mapData.MAP_DISCLOSURE.navigation==='PROHIBITED','map coordinates are explicitly non-navigational');
assert(peopleData.PEOPLE_SOURCE.migrationState==='LEGACY INTAKE / NOT V6 CANON','personnel snapshot is explicitly outside adopted V6 canon');
assert(peopleData.PEOPLE_RECORDS.length===56&&peopleData.PEOPLE_GROUPS.length===10,'personnel intake contains fifty-six files in ten legacy groups');
assert(new Set(peopleData.PEOPLE_RECORDS.map(item=>item.id)).size===56,'personnel intake IDs are unique');
assert(!peopleData.PEOPLE_RECORDS.some(item=>item.id==='frey'||item.name==='프레이'),'Frey is not restored as the automatic personnel center');
assert(peopleData.PEOPLE_RECORDS.every(item=>item.v6Adoption==='UNREVIEWED'&&item.current2042==='UNRESOLVED'&&item.v6IncidentLinks.length===0),'all personnel files begin unreviewed with no adopted incident link or 2042 status');
assert(peopleData.PEOPLE_RECORDS.every(item=>item.identity&&item.personality&&item.history?.length&&item.limits?.length),'all fifty-six files retain supplemental identity, motive, history, and explicit record limits');
assert(peopleData.PEOPLE_RECORDS.filter(item=>item.status==='deceased').length===3,'only three legacy files preserve a death entry');
const sakuma=peopleData.PEOPLE_RECORDS.find(item=>item.id==='sakuma-yuta');
assert(sakuma?.aliases.includes('레드 마우스')&&sakuma?.secondaryGroups.includes('haiman'),'Sakuma Yuta and Red Mouse remain one directly linked multi-affiliation file');
assert(peopleData.PEOPLE_RECORDS.filter(item=>item.name.includes('아론')).length===2&&peopleData.PEOPLE_RECORDS.some(item=>item.id==='aaron-uac')&&peopleData.PEOPLE_RECORDS.some(item=>item.id==='aaron-syndicate'),'the two Aaron files remain distinct');
assert(peopleData.PEOPLE_RECORDS.some(item=>item.id==='yanami-shinka')&&peopleData.PEOPLE_RECORDS.some(item=>item.id==='mizumi-yanami'),'Yanami Shinka and Yanami Mizumi remain separate files');
assert(peopleDataText.includes('Generated by v6/tools/build-people-snapshot.mjs'),'personnel intake records its deterministic snapshot builder');
assert(mapData.MAP_REGIONS.length===6,'six evidence-map regions are registered');
assert(mapData.MAP_SIGNALS.length===15,'fifteen world signals are registered');
assert([...mapData.MAP_REGIONS,...mapData.MAP_SIGNALS].every(item=>item.position?.plot&&item.position.geo===null&&item.position.navigation==='PROHIBITED'),'all map entities separate display plots from null geography');
assert(mapData.MAP_SIGNALS.filter(item=>item.operationId==='three-night').length===10,'Three Night has ten independent observation points');
assert(mapData.MAP_CONNECTIONS.every(item=>!item.id.includes('three-night')),'Three Night observation clusters have no route connection');
assert(mapData.MAP_OPERATIONS.length===5,'five operation copies are registered');
const mapImmortality=mapData.MAP_OPERATIONS.find(item=>item.id==='immortality');
const mapThreeNight=mapData.MAP_OPERATIONS.find(item=>item.id==='three-night');
const claimAxes=['occurrence','time','location','cause','relation','outcome'];
const signalClaims=item=>mapData.MAP_CLAIMS.signals[item.id]||(item.operationId==='three-night'?(item.id.startsWith('gbf-')?mapData.MAP_CLAIMS.signals['three-night-gbf']:mapData.MAP_CLAIMS.signals['three-night-dz']):null);
assert(mapData.MAP_SIGNALS.every(item=>claimAxes.every(axis=>signalClaims(item)?.[axis])),'all fifteen map signals resolve six-axis evidence claims');
assert(mapData.MAP_OPERATIONS.every(item=>claimAxes.every(axis=>mapData.MAP_CLAIMS.operations[item.id]?.[axis])),'all five evidence copies expose six-axis claims');
assert(mapData.MAP_OPERATIONS.every(item=>item.presentation&&item.openLabel&&item.lossLabel&&item.factionLabel),'every evidence copy separates presentation, open, loss, and faction labels');
assert(mapData.MAP_OPERATIONS.every(item=>item.schematic?.coordinateType==='DISPLAY_PLOT'&&item.schematic.geo===null&&item.schematic.navigation==='PROHIBITED'),'all five local schematics prohibit geographic navigation');
assert(mapData.MAP_OPERATIONS.every(item=>item.schematic.nodes.length>0&&new Set(item.schematic.nodes.map(node=>node.id)).size===item.schematic.nodes.length),'every local schematic has unique evidence nodes');
assert(mapData.MAP_OPERATIONS.every(item=>item.schematic.nodes.every(node=>Number.isFinite(node.x)&&node.x>=0&&node.x<=100&&Number.isFinite(node.y)&&node.y>=0&&node.y<=100&&Number.isInteger(node.step)&&node.step>=0&&node.step<item.steps.length)),'every schematic node has a valid display plot and record step');
assert(mapData.MAP_OPERATIONS.every(item=>{const ids=new Set(item.schematic.nodes.map(node=>node.id));return item.schematic.links.every(link=>ids.has(link.from)&&ids.has(link.to)&&link.kind&&link.label);}), 'every schematic link resolves two local evidence nodes');
assert(mapData.MAP_OPERATIONS.reduce((sum,item)=>sum+item.schematic.nodes.length,0)===28,'five local schematics expose twenty-eight selectable evidence nodes');
assert(mapThreeNight?.schematic.nodes.length===10&&mapThreeNight?.schematic.links.length===0&&mapThreeNight?.schematic.zones.length===2,'Three Night keeps ten nodes in two unlinked clusters');
assert(mapThreeNight?.schematic.nodes.filter(node=>node.group==='gbf').length===6&&mapThreeNight?.schematic.nodes.filter(node=>node.group==='dz').length===4,'Three Night preserves the six plus four observation split');
assert(mapImmortality?.date.includes('1986.02.01')&&mapImmortality?.date.includes('07.25'),'Blood Lake date conflict remains visible');
assert(mapImmortality?.steps.map(item=>item.time).join(' ').includes('18:06')&&mapImmortality?.steps.map(item=>item.time).join(' ').includes('18:44'),'operation copy retains protected-record critical times');
assert(['16:10','17:02','17:41','18:06','18:42','18:44–19:00'].every(time=>mapImmortality?.schematic.nodes.some(node=>node.code===time)),'Blood Lake schematic uses only the six protected-record time anchors');
const bloodLakeSignal=mapData.MAP_SIGNALS.find(item=>item.id==='blood-lake');
assert(bloodLakeSignal?.factions.length===0,'Blood Lake does not assign a later N.H.C organization mark');
assert(bloodLakeSignal?.summary.includes('후대 편집 라벨 가설')&&mapImmortality?.confidence.includes('N.H.C 표기 성격'),'Blood Lake keeps the 1986 N.H.C label hypotheses unresolved');
assert(mapThreeNight?.date==='2042.10.28–10.31'&&mapThreeNight?.code.includes('61:01'),'Three Night date window and duration are explicit');
assert(mapThreeNight?.steps.some(item=>item.time==='WITHIN WINDOW / ORDER UNRESOLVED')&&!mapThreeNight?.steps.some(item=>/^T\+\d{1,2}:\d{2}$/.test(item.time)),'Three Night avoids invented precise intra-window times');
assert(!mapData.MAP_OPERATIONS.find(item=>item.id==='broken-crown')?.lossLabel.includes('RECORDED'),'hostile plan is not presented as a recorded loss');
const brokenCrown=mapData.MAP_OPERATIONS.find(item=>item.id==='broken-crown');
assert(brokenCrown?.schematic.links.every(link=>link.kind==='hostile-claim')&&brokenCrown?.schematic.label.includes('EXECUTION UNCONFIRMED'),'hostile-plan links remain claims with execution unconfirmed');
assert(!mapDataText.includes('[9.2,55.5]')&&!mapDataText.includes('9.2,55.5'),'unsupported legacy Blood Lake coordinates are absent');
assert(!mapDataText.includes('북해권'),'Blood Lake map does not promote the legacy North Sea claim');
assert(runtimeText.includes('TEMPORAL CORRELATION ONLY / NO ROUTE'),'map labels synchrony as non-route correlation');
assert(runtimeText.includes('15개 관측점 목록 열기'),'all map signals have a non-plot contact index');
assert(runtimeText.includes('data-evidence=')&&runtimeText.includes('data-location='),'map markers expose occurrence and location evidence states');
assert(runtimeText.includes('LOCAL EVIDENCE SCHEMATIC')&&runtimeText.includes('data-operation-plot-node'),'local schematic nodes are rendered as interactive evidence controls');
assert(runtimeText.includes('pc-v6-operation-plot-scroll')&&runtimeText.includes('aria-pressed'),'local schematic provides scroll-region and selection semantics');
assert(cssText.includes('.pc-v6-operation-node')&&cssText.includes('.pc-v6-operation-link.is-hostile-claim')&&cssText.includes('.pc-v6-operation-plot__no-route'),'local schematic visual grammars exist in CSS');
assert(runtimeText.includes('LEGACY PERSONNEL INTAKE')||runtimeText.includes('PEOPLE 05 / LEGACY INTAKE'),'personnel route labels its legacy intake boundary');
assert(runtimeText.includes('NO ADOPTED INCIDENT LINK')&&runtimeText.includes('2042 / 확인 불가'),'personnel dossiers separate missing V6 incident links from current status');
assert(runtimeText.includes('data-person-search')&&runtimeText.includes('data-person-group')&&runtimeText.includes('data-person-filter'),'personnel route exposes search, group, and evidence filters');
assert(cssText.includes('.pc-v6-people-console')&&cssText.includes('.pc-v6-person-dossier')&&cssText.includes('.pc-v6-person-limit'),'personnel channel has index, dossier, and archive-limit presentation');
assert(runtimeText.includes('state.pending')&&runtimeText.includes('pc-v6-route-error'),'route requests queue during transitions and failures have a recovery surface');
assert(runtimeText.includes('seen&&!forced?2600:6200'),'repeat-session boot still has a deliberate loading interval');

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
