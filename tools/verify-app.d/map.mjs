import vm from 'node:vm';
import assert from 'node:assert/strict';

// 옛 상태 저장소와 반응형 분기를 독립 기준으로 실행해 대조한다.
export default function verifyMap({add,read,context,app,historyIds,archiveIds,opIds}) {
  const source=read('assets/app/js/screens/map.js').replace(/\r\n/g,'\n');
  const stateSource=read('assets/app/js/pc-state.js').replace(/\r\n/g,'\n');
  const legacyMap=read('tools/fixtures/legacy-app/assets/js/pages/map-room.js').replace(/\r\n/g,'\n');
  const stateSources=['operation-state','pilgrimage-state','verdict-archive-state'].map(n=>read(`tools/fixtures/legacy-app/assets/js/core/${n}.js`));
  const equal=(a,b)=>assert.equal(JSON.stringify(a),JSON.stringify(b));
  // 2026-09-25 승인된 이름과 표 머리의 전체 문자열만 바꾼 기대값이다.
  // 단어를 일괄 치환하지 않으므로 다른 문장·식별자·판정·저장값은 여전히 원문과 같아야 한다.
  const approvedLegacyText = new Map([
    [
      "성위대 지휘관이 남방 특수부대 출신이라는 기록과, 그가 생존해 있을 경우 처형하라는 명령문이 함께 회수됐다.",
      "성위대 지휘관이 혈맹 특수부대 출신이라는 기록과, 그가 생존해 있을 경우 처형하라는 명령문이 함께 회수됐다."
    ],
    [
      "남부 혈교 강경파의 전후 지휘권",
      "남방 혈맹 강경파의 전후 지휘권"
    ],
    [
      "어느 선택도 남부 혈교를 우시노다 중앙 혈교의 확정 후계로 만들지 않으며, 데드존 혈교를 남부 지휘 아래 재편입시키지 않는다. 같은 표식·의식·일시적 교신은 동일한 지휘 계보의 증거가 아니다.",
      "어느 선택도 남방 혈맹을 혈교의 확정 후계로 만들지 않으며, 데드존 혈교를 혈맹 지휘 아래 재편입시키지 않는다. 같은 표식·의식·일시적 교신은 동일한 지휘 계보의 증거가 아니다."
    ],
    [
      "처형 명령의 원 발신자와 지휘관의 실제 충성은 확인되지 않았다. 남부 강경파가 전후 지휘권을 장악했다는 결론도 승인되지 않았다.",
      "처형 명령의 원 발신자와 지휘관의 실제 충성은 확인되지 않았다. 혈맹 강경파가 전후 지휘권을 장악했다는 결론도 승인되지 않았다."
    ],
    [
      "현재 지도 사본에서 지휘망 붕괴와 소환진 재활성 위험을 추적한다. 남부 전체의 권력 승계는 미확정이다.",
      "현재 지도 사본에서 지휘망 붕괴와 소환진 재활성 위험을 추적한다. 혈맹 전체의 권력 승계는 미확정이다."
    ],
    [
      "지휘관이 남방 명령에 불복한 것인지, 더 깊은 침투를 위해 협조한 것인지는 판단할 수 없다.",
      "지휘관이 혈맹 명령에 불복한 것인지, 더 깊은 침투를 위해 협조한 것인지는 판단할 수 없다."
    ],
    [
      "남부 강경파의 공개 적대, 지휘관의 장기 충성, 데드존 혈교의 공식 가담 여부는 확정되지 않았다.",
      "혈맹 강경파의 공개 적대, 지휘관의 장기 충성, 데드존 혈교의 공식 가담 여부는 확정되지 않았다."
    ],
    [
      "현재 지도 사본에 공동 차단선과 비인가 교신을 표시한다. 데드존 혈교가 남부 또는 U.A.C 지휘에 편입된 것은 아니다.",
      "현재 지도 사본에 공동 차단선과 비인가 교신을 표시한다. 데드존 혈교가 혈맹 또는 U.A.C 지휘에 편입된 것은 아니다."
    ],
    [
      "남부 쿠데타",
      "남방 쿠데타"
    ],
    [
      "남부 해안의 집단 소환과 성위대 침투가 한 작전으로 수렴한다. 지휘 계통은 이미 오염됐다.",
      "남방 해안의 집단 소환과 성위대 침투가 한 작전으로 수렴한다. 지휘 계통은 이미 오염됐다."
    ],
    [
      "열람 상태",
      "읽음 상태"
    ]
  ]);
  const approvedLegacy = value => {
    if (typeof value === 'string') return approvedLegacyText.get(value) ?? value;
    if (Array.isArray(value)) return value.map(approvedLegacy);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, approvedLegacy(item)]));
    return value;
  };
  const equalLegacy = (before, after) => equal(approvedLegacy(before), after);
  const check=(name,run)=>{try{const result=run();add(name,true,result||'');}catch(error){add(name,false,error.message);}};
  function runtime(modern,seed={}) {
    const storage=new Map(Object.entries(seed));
    const listeners=new Map();
    const c={...context,Date:class extends Date{constructor(...args){super(...(args.length?args:['2042-01-02T03:04:05Z']));}static now(){return 2272244645000;}},
      localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
      document:{addEventListener:(n,f)=>{if(!listeners.has(n))listeners.set(n,[]);listeners.get(n).push(f);},dispatchEvent:e=>{for(const f of listeners.get(e.type)||[])f(e);}},
      CustomEvent:class {constructor(type,options){this.type=type;Object.assign(this,options);}}
    };
    c.window=c;vm.createContext(c);
    if(modern)vm.runInContext(stateSource,c);
    else stateSources.forEach(s=>vm.runInContext(s,c));
    return {P:c.ProjectCursePilgrimageState,V:c.ProjectCurseVerdictArchiveState,O:c.ProjectCurseOperationState,storage};
  }
  check('copied-operation-text-approved-names',()=>{
    const old=runtime(false);equalLegacy(old.O.canonBoundary,context.ProjectCurseMapScreenData.canonBoundary);equalLegacy(old.O.decisions,context.ProjectCurseMapScreenData.decisions);
  });
  check('copied-theaters-approved-names-and-site-mappings-verbatim',()=>{
    const c={};vm.createContext(c);
    for(const key of ['theaters','scenarioStageByItem']){
      const pattern=key==='theaters'?/const theaters=\[[\s\S]*?\n    \];/:/const scenarioStageByItem=\{[\s\S]*?\n    \};/;
      const match=legacyMap.match(pattern);assert.ok(match,key);vm.runInContext(match[0]+`;this.result=${key};`,c);equalLegacy(c.result,context.ProjectCurseMapScreenData[key]);
    }
  });
  check('operation-four-decisions-and-reload-parity',()=>{
    for(const decision of Object.keys(context.ProjectCurseMapScreenData.decisions)){
      const old=runtime(false),next=runtime(true);
      assert.equal(next.O.chooseVerdict(decision),false);
      for(const id of old.O.branchIds){old.O.visitBranch(id);next.O.visitBranch(id);equal(old.O.get(),next.O.get());}
      old.O.chooseVerdict(decision);next.O.chooseVerdict(decision);equalLegacy(old.O.getSummary(),next.O.getSummary());
      for(const step of [-1,2,99]){old.O.setMapStep(step);next.O.setMapStep(step);equal(old.O.get(),next.O.get());}
      equalLegacy(old.O.getSummary(),runtime(true,Object.fromEntries(old.storage)).O.getSummary());
    }
  });
  check('all-reactive-pilgrimage-paths-and-verdict-documents',()=>{
    const old=runtime(false),next=runtime(true);let states=0,ends=0;const reached=new Set();
    for(const id of Object.keys(context.ProjectCursePilgrimageData.scenarios)){
      const queue=[[]];
      while(queue.length){
        const path=queue.pop();old.P.reset(id);next.P.reset(id);old.P.start(id);next.P.start(id);
        for(const choice of path){assert.ok(old.P.choose(choice,id));assert.ok(next.P.choose(choice,id));}
        equal(old.P.get(id),next.P.get(id));equal(old.P.getSummary(id),next.P.getSummary(id));equal(old.P.getStage(id),next.P.getStage(id));states++;
        if(old.P.get(id).status==='complete'){
          ends++;reached.add(`${id}/${old.P.get(id).ending}`);equal(old.V.list(),next.V.list());
          for(const entry of old.V.list().filter(e=>e.unlocked))equalLegacy(old.V.getDocument(entry.id),next.V.getDocument(entry.id));
        }else{
          assert.ok(path.length<8,'scenario failed to terminate');
          for(const choice of old.P.getStage(id).choices)queue.push([...path,choice.id]);
        }
      }
    }
    assert.equal(reached.size,10);return `${states} states / ${ends} terminal paths / ${reached.size} endings`;
  });
  check('legacy-v1-and-corrupt-save-migration',()=>{
    const seeds=[{pc_pilgrimage_state_v1:JSON.stringify({status:'active',step:2,signal:42,fear:33,corruption:22})},
      {pc_pilgrimage_states_v2:'broken-json',pc_operation_broken_crown_v1:'broken-json',pc_verdict_archive_state_v1:'broken-json'},
      {pc_operation_broken_crown_v1:JSON.stringify({visited:['signal','bad','signal'],mapStep:999,verdict:'bad'}),pc_pilgrimage_states_v2:JSON.stringify({states:{'deadzone-return':{status:'oops',step:999,metrics:{exposure:999,identity:-10}}}})}];
    for(const seed of seeds){const a=runtime(false,seed),b=runtime(true,seed);equal(a.P.getAllSummaries(),b.P.getAllSummaries());equal(a.O.get(),b.O.get());equal(a.V.list(),b.V.list());}
    assert.throws(()=>runtime(true).P.get('absent-scenario'),/Unknown/);
  });
  check('verdict-read-reset-delete-and-snapshot-parity',()=>{
    const a=runtime(false),b=runtime(true),id='deadzone-return';
    for(const r of [a,b]){r.P.start(id);while(r.P.get(id).status==='active')r.P.choose(r.P.getStage(id).choices[0].id,id);}
    const entry=a.V.list().find(e=>e.unlocked),record=b.V.getDocument(entry.id);
    for(const r of [a,b])r.V.markRead(entry.id);equal(a.V.list(),b.V.list());
    for(const r of [a,b])r.V.resetRead();equal(a.V.list(),b.V.list());
    for(const r of [a,b])r.P.reset(id);equal(a.V.list(),b.V.list());equal(record,b.V.getDocument(entry.id));
    for(const r of [a,b]){r.P.start(id);while(r.P.get(id).status==='active')r.P.choose(r.P.getStage(id).choices[0].id,id);r.V.clearScenario(id);r.V.capture(id);}
    equal(a.V.list(),b.V.list());assert.equal(b.V.isUnlocked(entry.id),false);
    equal(runtime(true,Object.fromEntries(b.storage)).V.list(),b.V.list());
    for(const r of [a,b])r.V.clearAll();equal(a.V.list(),b.V.list());
  });
  check('slot-and-new-runtime-only',()=>{
    assert.match(app,/<!-- slot:map-data -->\s*<script src="assets\/js\/data\/map-screen-data\.js\?v=6\.0\.0(?:-[0-9a-f]{8})?"><\/script>/);
    assert.doesNotMatch(app,/<script src="assets\/js\/(?:pages\/map-room|pages\/pilgrimage-scenario|core\/(?:pilgrimage|operation|verdict-archive)-state)/);
    assert.doesNotMatch(source,/innerHTML|insertAdjacentHTML|createElement\(/);
  });
  check('map-geometry-and-complete-catalog',()=>{
    const d=context.ProjectCurseMapRoom;assert.equal(d.operations.length,5);assert.equal(d.drilldowns.length,8);
    assert.equal(d.synchronyEvents[0].points.length,10);assert.equal(context.ProjectCurseMapSignalIndex.items.length,29);
    for(const op of d.operations)for(const s of op.steps){assert.ok(s.time&&s.title&&s.note&&s.route.length);for(const u of s.units)assert.ok(['normal','unstable','split','unknown','lost'].includes(u.status));}
    for(const d of context.ProjectCurseMapRoom.drilldowns)for(const r of d.routes)for(const id of r.siteIds)assert.ok(d.sites.some(s=>s.id===id),id);
    for(const e of d.synchronyEvents)assert.ok(historyIds.has(e.history));
    for(const s of Object.values(context.ProjectCursePilgrimageData.scenarios)){assert.ok(opIds.has(s.operation));for(const id of s.records)assert.ok(archiveIds.has(id)||context.ProjectCurseVerdictArchiveData.records?.some(e=>e.id===id),id);}
  });
  check('playback-lifecycle-and-motion-guard',()=>{
    for(const token of ['PC.missing(',"PC.screen({id:'map-room'",'root.clearInterval(timer)','controller?.abort()',"reducedFx()||view?.kind!=='op'",'root.document.hidden',"event.key===' '","['ArrowLeft','ArrowRight']","if(state.layers.routes&&!syncEvent)","if(state.layers.synchrony)","addEventListener('pc:fx',onMotion",'clearReaction()'] )assert.ok(source.includes(token),token);
    const css=read('assets/app/css/screens/map.css');
    assert.match(css,/html\[data-fx="reduced"\]/);
    assert.doesNotMatch(css,/@media\s*\(prefers-reduced-motion/);
    for(const effect of ['tc-map-scan','tc-map-breathe','tc-map-ring','tc-map-route-flow','tc-map-denied'])assert.ok(css.includes(`@keyframes ${effect}`),effect);
    assert.match(css,/tc-map-scan 7s linear infinite/);
    assert.match(css,/tc-map-denied \.28s ease-out 1/);
    assert.ok([...css.matchAll(/translateX\((-?[\d.]+)px\)/g)].every(match=>Math.abs(Number(match[1]))<=4));
  });
  check('screen-routes-search-and-playback-execution',()=>{
    const {c,host,screen,timers,media,timeouts,audio}=screenHarness(context,source,stateSource);
    const show=p=>screen.show(p,c.PCApp),button=name=>host.all().find(n=>n.dataset.action===name),click=(name,key)=>{const b=host.all().find(n=>n.dataset.action===name&&(key===undefined||n.dataset.key===key));assert.ok(b,name);host.emit('click',b);};
    show([]);assert.ok(host.textContent.includes('북부전선'));
    const search=host.querySelector('#tc-map-search');search.value='no-such-map-record';host.emit('input',search);assert.ok(host.textContent.includes('MAP RECORD NOT FOUND'));click('clear-search');assert.ok(host.querySelector('#tc-map-count').textContent.includes('29'));click('filter','synchrony');assert.ok(host.querySelector('#tc-map-count').textContent.includes('10'));
    for(const p of [['op','no-such-op'],['region','no-such-region'],['incident','missing'],['synchrony','missing'],['pilgrimage','missing'],['verdict','missing']]){show(p);assert.ok(host.textContent.includes('MAP RECORD NOT FOUND'),p.join('/'));}
    const d=context.ProjectCurseMapRoom;
    for(const r of d.regions)show(['region',r.id]);
    for(const d of context.ProjectCurseMapRoom.drilldowns){show(['region',d.id]);for(const s of d.sites)show(['region',d.id,'site',s.id]);}
    for(const m of d.markers)show(['marker',m.id]);
    for(const e of d.synchronyEvents){show(['synchrony',e.id]);for(const pt of e.points){show(['synchrony',e.id,pt.id]);show(['synchrony',pt.id]);}}
    for(const s of Object.keys(context.ProjectCursePilgrimageData.scenarios))show(['pilgrimage',s]);
    show(['op','op-deadzone-recovery']);assert.ok(host.textContent.includes('DZ-VR-04'));assert.equal(button('play'),undefined);
    show(['op','op-immortality']);click('next');let current=host.all().find(n=>n.dataset.action==='step'&&n.attrs['aria-current']==='step');assert.equal(current.dataset.key,'1');
    host.emit('keydown',button('play'),'ArrowRight');current=host.all().find(n=>n.dataset.action==='step'&&n.attrs['aria-current']==='step');assert.equal(current.dataset.key,'2');
    host.emit('keydown',button('play'),' ');assert.equal(timers.size,1);for(const fn of [...timers.values()])fn();current=host.all().find(n=>n.dataset.action==='step'&&n.attrs['aria-current']==='step');assert.equal(current.dataset.key,'3');
    click('play');assert.equal(timers.size,0);click('play');media.matches=true;media.emit('change',media);assert.equal(timers.size,0);assert.equal(button('play').disabled,true);click('play');assert.equal(timers.size,0);
    media.matches=false;media.emit('change',media);click('play');assert.equal(timers.size,1);screen.hide();assert.equal(timers.size,0);assert.equal(host.events.get('click').size,0);
    show(['op','op-immortality']);assert.equal(host.events.get('click').size,1);click('play');assert.equal(timers.size,1);screen.hide();assert.equal(timers.size,0);
  });

  check('brief-labels-and-operational-information',()=>{
    const {c,host,screen}=screenHarness(context,source,stateSource);
    screen.show([],c.PCApp);
    const english=text=>(text.match(/\b[A-Z][A-Z0-9_./-]{2,}\b/g)||[]).length;
    const full=english(host.visibleText()),brief=english(host.visibleText(true));
    assert.ok(brief<=full/2,`${brief} / ${full}`);
    for(const item of context.ProjectCurseMapRoom.operations)assert.ok(host.visibleText(true).includes(item.label));
    assert.ok(host.visibleText(true).includes('CRITICAL / PARTIAL'));
    screen.show(['op','op-immortality'],c.PCApp);
    const op=context.ProjectCurseMapRoom.operations.find(item=>item.id==='op-immortality');
    assert.ok(host.visibleText(true).includes(op.steps[0].time));
    assert.ok(host.visibleText(true).includes(op.steps[0].units[0].id));
    assert.ok(host.visibleText(true).includes(`X ${op.steps[0].units[0].x}`));
    screen.hide();return `전체 ${full}개 / 간략 ${brief}개 영문 토큰 · DOM 대역 기준`;
  });
  check('approved-screen-words-and-detail-heroes',()=>{
    const {c,host,screen}=screenHarness(context,source,stateSource),heads=[];
    const screenHead=c.PCApp.screenHead;
    c.PCApp.screenHead=(id,options)=>{heads.push({id,...options});return screenHead(id,options);};
    screen.show([],c.PCApp);
    assert.equal(heads.at(-1).title,'작전 지도');assert.equal(heads.at(-1).hero,undefined);
    assert.equal(host.querySelector('.tc-map-toolbar').getAttribute('aria-label'),'작전 지도 탐색');
    assert.ok(host.querySelectorAll('a').some(a=>a.textContent==='지도 목록'&&a.attrs.href==='#map-room'));
    for(const word of ['신호 목록','지역 목록','지역 상세 지도','작전 진행'])assert.ok(host.visibleText(true).includes(word),word);
    const paths=[['region','world'],['region','eastasia-northern-front'],['marker','tokyo'],['synchrony','three-night-silence'],['op','op-immortality'],['pilgrimage','unlit-fortress'],['verdict'],['op','없는-작전']];
    for(const parts of paths){screen.show(parts,c.PCApp);assert.equal(heads.at(-1).hero,false,parts.join('/'));}
    screen.show(['synchrony','three-night-silence'],c.PCApp);
    const terms=()=>host.querySelectorAll('dt').map(node=>node.textContent);
    assert.ok(terms().includes('성채 타종 장부'));assert.ok(terms().includes('관측 지점'));
    screen.show(['op','op-immortality'],c.PCApp);
    assert.ok(host.textContent.includes('현재까지의 통신 기록'));assert.ok(terms().includes('지역'));
    const operation=context.ProjectCurseMapRoom.operations.find(item=>item.id==='op-immortality');
    assert.ok(host.textContent.includes(operation.summary));assert.ok(host.textContent.includes(operation.steps[0].note));
    assert.doesNotMatch(source,/상황 관제|관제 목록|신호 색인|작전 경과|권역 상세도|교신 기록|위치 보류/);
    const copy=context.ProjectCurseMapScreenData.copy;
    assert.equal(copy.timelineUnknown,'연도 알 수 없음');assert.ok(copy.withheld.startsWith('위치 공개 보류는'));
    assert.ok(copy.signalBoundary.includes('관측 지점'));assert.ok(copy.archive.includes('판정 기록'));
    screen.hide();
  });
  check('verdict-korean-fields-and-verbatim-body',()=>{
    const {c,host,screen}=screenHarness(context,source,stateSource),P=c.ProjectCursePilgrimageState,V=c.ProjectCurseVerdictArchiveState;
    P.start('deadzone-return');while(P.get('deadzone-return').status==='active')P.choose(P.getStage('deadzone-return').choices[0].id,'deadzone-return');
    const entry=V.list().find(item=>item.unlocked),document=V.getDocument(entry.id);
    screen.show(['verdict',entry.id],c.PCApp);
    const terms=host.querySelectorAll('dt').map(node=>node.textContent);
    for(const term of ['읽음 상태','기록 코드','문서 종류','보낸 곳','받는 곳','근거','기록 한계'])assert.ok(terms.includes(term),term);
    const record=document.sections[0].record;
    for(const [key,value] of Object.entries(record))assert.ok((key==='code'?host.visibleText():host.visibleText(true)).includes(value),key);
    assert.ok(!host.visibleText(true).includes(record.code));
    for(const section of document.sections){for(const text of section.paragraphs||[])assert.ok(host.textContent.includes(text));if(section.quote)assert.ok(host.textContent.includes(section.quote));}
    screen.hide();
  });
  check('fx-override-static-layers-and-listener-cleanup',()=>{
    const {c,host,screen,timers,timeouts,media}=screenHarness(context,source,stateSource);
    const show=parts=>screen.show(parts,c.PCApp),click=action=>host.emit('click',host.all().find(n=>n.dataset.action===action));
    media.matches=true;c.PCApp.fx=()=> 'full';
    show(['op','op-immortality']);click('next');click('play');assert.equal(timers.size,1);
    assert.equal(host.dataset.mapFx,'full');
    const routes=host.querySelectorAll('.tc-map-route-segment').length;
    assert.ok(routes>0);assert.ok(host.querySelector('.tc-map-ring'));assert.ok(host.querySelector('.tc-map-scan'));
    c.PCApp.fx=()=> 'reduced';c.document.emit('pc:fx',c.document,undefined,{mode:'reduced'});
    assert.equal(timers.size,0);assert.equal(host.dataset.mapFx,'reduced');assert.equal(host.querySelectorAll('.tc-map-route-segment').length,routes);
    assert.ok(host.querySelector('.tc-map-ring'));assert.ok(host.querySelector('.tc-map-scan'));
    c.PCApp.fx=()=> 'full';c.document.emit('pc:fx',c.document,undefined,{mode:'full'});click('play');assert.equal(timers.size,1);
    media.emit('change',media);assert.equal(timers.size,1);
    show(['synchrony',context.ProjectCurseMapRoom.synchronyEvents[0].id]);
    assert.equal(host.querySelectorAll('.tc-map-ring').length,10);assert.equal(host.querySelectorAll('.tc-map-route-segment').length,0);
    show(['marker','black-river']);assert.ok(host.querySelector('.tc-map-ring.is-selected'));
    show(['op','op-deadzone-recovery']);assert.equal(host.dataset.mapReaction,'denied');assert.equal(timeouts.size,1);
    screen.hide();assert.equal(timeouts.size,0);assert.equal(timers.size,0);assert.equal(c.document.events.get('pc:fx').size,0);assert.equal(media.events.get('change').size,0);
    show([]);show([]);assert.equal(c.document.events.get('pc:fx').size,1);screen.hide();
  });
  check('evidence-inspection-count-hooks-and-optional-threat',()=>{
    const {c,host,screen,threats}=screenHarness(context,source,stateSource);c.PCApp.threat=level=>threats.push(level);
    for(const op of context.ProjectCurseMapRoom.operations)screen.show(['op',op.id],c.PCApp);
    // 현재 다섯 작전에는 허용된 명시 등급이 없다. 보안 BLACK을 치명으로 해석하지 않는다.
    assert.equal(threats.length,0);
    for(const detail of context.ProjectCurseMapRoom.drilldowns){
      screen.show(['region',detail.id],c.PCApp);
      for(const img of host.querySelectorAll('.tc-evidence-media img')){assert.equal(img.closest('a'),null);assert.ok(img.closest('figure'));}
      const hooks=host.querySelectorAll('[data-tc-anomaly]');assert.ok(hooks.length<=2);
      for(const hook of hooks){assert.equal(hook.dataset.tcAnomaly,'count');assert.equal(hook.closest('a,button,h1,h2,h3,input'),null);}
    }
    screen.show(['region','deadzone-return-corridor'],c.PCApp);assert.equal(host.querySelector('[data-tc-anomaly="count"]').textContent,'5개 검출');
    screen.hide();
    const data=context.ProjectCurseMapRoom;
    const fixture={...context,ProjectCurseMapRoom:{...data,operations:data.operations.map((op,i)=>i===0?{...op,threatLevel:'critical'}:op)}};
    const next=screenHarness(fixture,source,stateSource);next.c.PCApp.threat=level=>next.threats.push(level);next.screen.show(['op',data.operations[0].id],next.c.PCApp);assert.deepEqual(next.threats,['critical']);next.screen.hide();
  });
  check('critical-choice-unread-verdict-and-sound-in-reduced',()=>{
    const {c,host,screen,timeouts,audio}=screenHarness(context,source,stateSource);
    const show=parts=>screen.show(parts,c.PCApp),click=(action,key)=>{const button=host.all().find(n=>n.dataset.action===action&&(key===undefined||n.dataset.key===key));assert.ok(button,action);host.emit('click',button);};
    show(['pilgrimage','deadzone-return']);click('start','deadzone-return');
    const stage=c.ProjectCursePilgrimageState.getStage('deadzone-return'),choice=stage.choices.find(item=>item.tone==='danger'||['broken','compromised'].includes(item.ruleOutcome));assert.ok(choice);
    click('choice',choice.id);assert.ok(['critical','denied'].includes(host.dataset.mapReaction));assert.equal(timeouts.size,1);
    c.PCApp.fx=()=> 'reduced';c.document.emit('pc:fx',c.document,undefined,{mode:'reduced'});assert.equal(timeouts.size,0);assert.equal(host.dataset.mapReaction,undefined);
    const count=audio.length;
    while(c.ProjectCursePilgrimageState.get('deadzone-return').status==='active')click('choice',c.ProjectCursePilgrimageState.getStage('deadzone-return').choices[0].id);
    assert.ok(audio.length>count);assert.equal(timeouts.size,0);show(['verdict']);assert.ok(host.querySelector('.tc-map-new'));
    const entry=c.ProjectCurseVerdictArchiveState.list().find(item=>item.unlocked&&item.unread);assert.ok(entry);show(['verdict',entry.id]);show(['verdict']);assert.equal(host.querySelector('.tc-map-new'),null);
    for(const name of audio)assert.ok(context.ProjectCurseAudioManifest.events[name],name);
    screen.hide();
  });

  check('timeline-dates-unknown-zones-and-operations',()=>{
    const {c,host,screen}=screenHarness(context,source,stateSource);screen.show([],c.PCApp);
    const slider=host.querySelector('#tc-map-year'),point=id=>host.querySelector(`[data-contact="${id}"]`);
    assert.equal(slider.attrs.type,'range');assert.equal(slider.attrs.min,1975);assert.equal(slider.attrs.max,2042);assert.equal(Number(slider.value),2042);
    assert.equal(slider.attrs['aria-valuetext'],'2042년');assert.equal(point('blood-lake-site').dataset.mapYear,'1986');
    assert.equal(point('dead-interior').dataset.mapYear,'');assert.equal(point('unlit-fortress').dataset.mapYear,'');
    slider.value=1985;host.emit('input',slider);
    assert.equal(point('blood-lake-site').dataset.timeState,'future');assert.equal(point('blood-lake-site').attrs.tabindex,'-1');
    assert.equal(point('dead-interior').dataset.timeState,'unknown');assert.equal(point('dead-interior').attrs.tabindex,'0');
    assert.ok(host.querySelectorAll('.tc-map-zone').every(n=>n.dataset.timeState==='unknown'));
    const operationRow=host.all().find(n=>n.tag==='a'&&n.attrs.href==='#map-room/op/op-southern-coup'&&n.closest('.tc-map-catalog-entry'));
    assert.ok(operationRow);assert.equal(operationRow.parentElement.hidden,true);
    slider.value=1986;host.emit('input',slider);assert.equal(point('blood-lake-site').dataset.timeState,'known');
    slider.value=2042;host.emit('input',slider);assert.equal(operationRow.parentElement.hidden,false);
    screen.show(['region','eastasia-northern-front'],c.PCApp);
    assert.equal(point('north-sixth-line').dataset.mapYear,'2038');assert.equal(point('north-joint-command').dataset.mapYear,'2018');
    assert.equal(point('north-lanzhou-perimeter').dataset.mapYear,'');screen.hide();
    // 구역에 날짜가 주어졌을 때도 표식과 같은 연도 판정을 쓴다.
    const fixture={...context,ProjectCurseMapRoom:{...context.ProjectCurseMapRoom,zones:context.ProjectCurseMapRoom.zones.map((z,i)=>i===0?{...z,date:'2008.09.06'}:z)}};
    const next=screenHarness(fixture,source,stateSource);next.screen.show([],next.c.PCApp);const range=next.host.querySelector('#tc-map-year');range.value=2007;next.host.emit('input',range);
    assert.equal(next.host.querySelector('.tc-map-zone').dataset.timeState,'future');next.screen.hide();
  });
  check('timeline-play-reduced-and-hidden-cleanup',()=>{
    const {c,host,screen,timers,timeouts}=screenHarness(context,source,stateSource);screen.show([],c.PCApp);
    const click=name=>host.emit('click',host.querySelector(`[data-action="${name}"]`));click('year-play');
    assert.equal(Number(host.querySelector('#tc-map-year').value),1975);assert.equal(timers.size,1);
    for(let i=0;i<67;i++)for(const fn of [...timers.values()])fn();
    assert.equal(Number(host.querySelector('#tc-map-year').value),2042);assert.equal(timers.size,0);
    click('year-play');c.PCApp.fx=()=> 'reduced';c.document.emit('pc:fx',c.document,undefined,{mode:'reduced'});
    assert.equal(timers.size,0);assert.equal(timeouts.size,0);click('year-play');assert.equal(Number(host.querySelector('#tc-map-year').value),2042);assert.equal(timers.size,0);
    c.PCApp.fx=()=> 'full';c.document.emit('pc:fx',c.document,undefined,{mode:'full'});click('year-play');
    c.document.hidden=true;c.document.emit('visibilitychange',c.document);assert.equal(timers.size,0);assert.equal(timeouts.size,0);
    c.document.hidden=false;screen.show([],c.PCApp);click('year-play');screen.hide();assert.equal(timers.size,0);assert.equal(timeouts.size,0);
  });
  check('affiliation-frames-and-visible-operational-key',()=>{
    const d=context.ProjectCurseMapRoom,fixture={...context,ProjectCurseMapRoom:{...d,markers:[
      {...d.markers[0],affiliation:'friendly'}, {...d.markers[1],affiliation:'hostile'}, {...d.markers[2],type:'settlement'}, {...d.markers[3],type:'facility'}]}};
    const {c,host,screen}=screenHarness(fixture,source,stateSource);screen.show([],c.PCApp);
    for(const [id,frame] of [['east-overview','friendly'],['europe-overview','hostile'],['north-overview','civilian'],['south-overview','unknown']])assert.equal(host.querySelector(`[data-contact="${id}"]`).dataset.affiliation,frame);
    const key=host.querySelector('.tc-map-frame-legend');for(const label of ['아군','적대','민간','미확인'])assert.ok(key.visibleText(true).includes(label));
    assert.ok(host.querySelectorAll('.tc-map-frame-word').every(n=>n.textContent.length<=2));
    assert.ok(decodeURIComponent(host.querySelector('.tc-map-frame-icon').attrs.src).includes('stroke-dasharray="3 3"'));screen.hide();
  });
  check('fog-confidence-order-and-symbol-layer',()=>{
    const {c,host,screen}=screenHarness(context,source,stateSource),values=[];
    for(const d of context.ProjectCurseMapRoom.drilldowns){screen.show(['region',d.id],c.PCApp);const fog=host.querySelector('.tc-map-fog');
      assert.equal(Number(fog.dataset.confidence),parseInt(d.confidence));const opacity=Number(fog.attrs.style.split(':')[1]);values.push({confidence:parseInt(d.confidence),opacity});
      assert.ok(decodeURIComponent(fog.attrs.src).includes('feTurbulence'));assert.ok(host.querySelectorAll('.tc-map-framed').length===d.sites.length);
    }
    values.sort((a,b)=>a.confidence-b.confidence);assert.equal(values[0].confidence,7);assert.equal(values.at(-1).confidence,84);
    for(let i=1;i<values.length;i++)assert.ok(values[i-1].opacity>values[i].opacity);
    const css=read('assets/app/css/screens/map.css');assert.match(css,/\.tc-map-fog\s*\{[^}]*z-index:1/);assert.match(css,/\.tc-map-points\s*\{[^}]*z-index:3/);screen.hide();
  });
  check('observation-signal-loss-silence-and-reduced',()=>{
    const {c,host,screen,timeouts,observers}=screenHarness(context,source,stateSource);screen.show(['synchrony','three-night-silence'],c.PCApp);
    const points=()=>context.ProjectCurseMapRoom.synchronyEvents[0].points.map(p=>host.querySelector(`[data-contact="${p.id}"]`));
    assert.equal(points().length,10);assert.ok(points().every(n=>n.querySelector('.tc-map-signal-line')));
    const fire=()=>{const [id,fn]=[...timeouts][0];timeouts.delete(id);fn();};assert.ok([...timeouts.values()][0].delay>=30000);fire();
    assert.equal(host.querySelectorAll('[data-signal-state="lost"]').length,1);assert.equal([...timeouts.values()][0].delay,3400);fire();assert.equal(host.querySelectorAll('[data-signal-state="lost"]').length,0);
    c.document.documentElement.dataset.silence='on';for(const observer of observers)observer.callback();
    assert.ok(points().every(n=>n.dataset.signalState==='silent'&&n.textContent.includes('무응답')));
    c.PCApp.fx=()=> 'reduced';c.document.emit('pc:fx',c.document,undefined,{mode:'reduced'});assert.equal(timeouts.size,0);assert.ok(points().every(n=>n.querySelector('.tc-map-signal-line')));
    c.document.documentElement.dataset.silence='off';for(const observer of observers)observer.callback();assert.ok(points().every(n=>n.dataset.signalState==='active'));
    assert.match(read('assets/app/css/screens/map.css'),/html\[data-fx="reduced"\] \.tc-map-signal-flow/);
    screen.hide();assert.equal(observers.size,0);assert.equal(timeouts.size,0);
  });
  check('preview-explicit-evidence-and-known-metadata-only',()=>{
    const {c,host,screen,navigations}=screenHarness(context,source,stateSource);screen.show(['region','eastasia-northern-front'],c.PCApp);
    const click=id=>host.emit('click',host.querySelector(`[data-contact="${id}"]`));click('north-distributed-nodes');
    const preview=host.querySelector('.tc-map-preview'),figure=preview.querySelector('figure'),visual=context.ProjectCurseMapRoom.drilldowns[0].visual;
    assert.equal(figure.dataset.record,visual.assetId);assert.equal(figure.dataset.dtg,undefined);assert.equal(figure.dataset.place,undefined);
    assert.equal(figure.attrs['data-record'],visual.assetId);assert.equal(figure.querySelector('.tc-evidence-media img').closest('a'),null);
    assert.ok(preview.textContent.includes('촬영 시각: 알 수 없음'));assert.equal(navigations.length,0);
    const slider=host.querySelector('#tc-map-year');slider.value=1985;host.emit('input',slider);assert.equal(preview.hidden,true);click('north-distributed-nodes');assert.equal(preview.hidden,true);
    slider.value=2042;host.emit('input',slider);
    click('north-lanzhou-perimeter');assert.ok(preview.textContent.includes('연결된 현장 사진 없음'));assert.equal(preview.querySelector('img'),null);
    host.emit('keydown',preview.querySelector('h3'),'Escape');assert.equal(preview.hidden,true);screen.hide();
    const d=context.ProjectCurseMapRoom,fixture={...context,ProjectCurseMapRoom:{...d,drilldowns:d.drilldowns.map((item,i)=>i===0?{...item,visual:{...item.visual,dtg:'시험 시각',place:'시험 위치',record:'시험 기록'}}:item)}};
    const next=screenHarness(fixture,source,stateSource);next.screen.show(['region',d.drilldowns[0].id],next.c.PCApp);next.host.emit('click',next.host.querySelector('[data-contact="north-distributed-nodes"]'));
    const f=next.host.querySelector('.tc-map-preview figure');assert.equal(f.attrs['data-dtg'],'시험 시각');assert.equal(f.attrs['data-place'],'시험 위치');assert.equal(f.attrs['data-record'],'시험 기록');next.screen.hide();
    screen.show(['region','eastasia-northern-front','site','north-distributed-nodes'],c.PCApp);host.emit('click',host.querySelector('[data-action="back"]'));equal(navigations.at(-1),['back','map-room','region','eastasia-northern-front']);screen.hide();
  });
  check('zoom-wheel-pinch-drag-keyboard-reset-and-disposal',()=>{
    const {c,host,screen}=screenHarness(context,source,stateSource);screen.show(['region','world'],c.PCApp);
    const canvas=host.querySelector('.tc-map-canvas[data-map-id]'),box=()=>canvas.dataset.viewbox.split(' ').map(Number),initial=box();
    const event=(type,extra)=>host.emit(type,canvas,undefined,{},extra),pointer=(type,id,x,y)=>event(type,{pointerId:id,clientX:x,clientY:y});
    assert.equal(event('wheel',{deltaY:-200,deltaMode:0,clientX:400,clientY:200}).defaultPrevented,true);assert.ok(box()[2]<initial[2]);
    assert.doesNotMatch(host.textContent,/\[object /);
    const before=box();pointer('pointerdown',1,400,200);pointer('pointermove',1,420,215);pointer('pointerup',1,420,215);assert.ok(box()[0]<before[0]);
    const oldWidth=box()[2];pointer('pointerdown',1,300,200);pointer('pointerdown',2,500,200);pointer('pointermove',2,600,200);assert.ok(box()[2]<oldWidth);pointer('pointerup',2,600,200);pointer('pointerup',1,300,200);
    host.emit('keydown',canvas,'0');equal(box(),initial);host.emit('keydown',canvas,'+');const left=box()[0];host.emit('keydown',canvas,'ArrowRight');assert.ok(box()[0]>left);
    host.emit('click',host.querySelector('[data-action="zoom-reset"]'));equal(box(),initial);
    for(let i=0;i<30;i++)host.emit('keydown',canvas,'+');assert.equal(box()[2],initial[2]/6);assert.equal(canvas.querySelector('.tc-map-frame-icon').attrs.style,undefined);
    screen.hide();for(const name of ['wheel','pointerdown','pointermove','pointerup','pointercancel'])assert.equal(host.events.get(name).size,0);
    screen.show(['region','world'],c.PCApp);assert.equal(host.events.get('wheel').size,1);screen.hide();
    const css=read('assets/app/css/screens/map.css');assert.match(css,/\.tc-map-canvas\[data-map-id\][^}]*touch-action:none/);assert.match(css,/\.tc-map-frame-icon\s*\{[^}]*width:36px/);
  });
}

// 실제 화면 함수를 실행하는 작은 DOM 대역. 배치·그림 검증을 대신하지 않는다.
// 두 화면의 필터·주소·이벤트 정리·선택적 셸 연동을 같은 조건에서 검사한다.
export function screenHarness(context,source,stateSource='') {
  let c,screen,nextTimer=0;
  class Target {
    constructor(){this.events=new Map();}
    addEventListener(type,fn,opts={}){if(!this.events.has(type))this.events.set(type,new Set());this.events.get(type).add(fn);opts.signal?.addEventListener('abort',()=>this.events.get(type).delete(fn),{once:true});}
    emit(type,target,key,detail={},extra={}){const event={type,target,key,detail,button:0,...extra,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;}};this.dispatchEvent(event);return event;}
    dispatchEvent(event){for(const fn of [...this.events.get(event.type)||[]])fn(event);}
  }
  const dataKey=key=>key.replace(/^data-/,'').replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());
  class Element extends Target {
    constructor(spec,props,...children){
      super();this.spec=spec;this.tag=spec.split(/[.#]/)[0];this.tagName=this.tag.toUpperCase();this.id=spec.match(/#([\w-]+)/)?.[1]||'';
      this.classes=new Set([...spec.matchAll(/\.([\w-]+)/g)].map(m=>m[1]));this.dataset={};this.attrs={};this.children=[];this.isConnected=true;
      this.classList={add:(...names)=>names.forEach(name=>this.classes.add(name)),remove:(...names)=>names.forEach(name=>this.classes.delete(name)),contains:name=>this.classes.has(name)};
      for(const [key,value] of Object.entries(props||{})){if(value==null||value===false)continue;if(key==='text')this.textContent=value;else if(key==='dataset')Object.assign(this.dataset,value);else this.setAttribute(key,value);}
      this.append(...children.flat(Infinity).filter(x=>x!=null&&x!==false));
    }
    append(...items){for(const child of items){if(child instanceof Element)child.parentElement=this;this.children.push(child instanceof Element?child:String(child));}}
    replaceChildren(...items){for(const child of this.children)if(child instanceof Element)child.isConnected=false;this.children=[];this.append(...items);}
    setAttribute(key,value){this.attrs[key]=value;if(key==='class')String(value).split(/\s+/).forEach(name=>this.classes.add(name));else if(key.startsWith('data-'))this.dataset[dataKey(key)]=value;else if(['value','disabled','hidden','id','open'].includes(key))this[key]=value;}
    getAttribute(key){return key==='class'?[...this.classes].join(' '):key.startsWith('data-')?this.dataset[dataKey(key)]:this.attrs[key];}
    get textContent(){return this.children.map(child=>child instanceof Element?child.textContent:String(child)).join('');}
    set textContent(value){this.children=[String(value)];}
    all(){return [this,...this.children.filter(child=>child instanceof Element).flatMap(child=>child.all())];}
    matches(selector){
      if(selector.includes(','))return selector.split(',').some(part=>this.matches(part.trim()));
      if(selector==='button:not([data-action="play"])')return this.tag==='button'&&this.dataset.action!=='play';
      const attr=[...selector.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)];
      const clean=selector.replace(/\[[^\]]*\]/g,'');
      const tag=clean.match(/^[\w-]+/)?.[0],id=clean.match(/#([\w-]+)/)?.[1];
      return (!tag||this.tag===tag)&&(!id||this.id===id)&&[...clean.matchAll(/\.([\w-]+)/g)].every(m=>this.classes.has(m[1]))&&attr.every(([,key,value])=>value===undefined?this.getAttribute(key)!=null:String(this.getAttribute(key))===value);
    }
    querySelectorAll(selector){return this.all().slice(1).filter(node=>selector.split(',').some(part=>{const pieces=part.trim().split(/\s+/);if(!node.matches(pieces.pop()))return false;let ancestor=node.parentElement;while(pieces.length){const wanted=pieces.pop();while(ancestor&&!ancestor.matches(wanted))ancestor=ancestor.parentElement;if(!ancestor)return false;ancestor=ancestor.parentElement;}return true;}));}
    querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
    contains(node){return this.all().includes(node);}
    closest(selector){return this.matches(selector)?this:this.parentElement?.closest(selector)||null;}
    focus(){c.document.activeElement=this;}
    getBoundingClientRect(){return {left:0,top:0,width:800,height:400};}
    setPointerCapture(id){this.captures||=new Set();this.captures.add(id);}
    hasPointerCapture(id){return this.captures?.has(id)||false;}
    releasePointerCapture(id){this.captures?.delete(id);}
    select(){}
    visibleText(brief=false){if(this.hidden||brief&&this.classes.has('tc-full-only'))return '';return this.children.map(child=>child instanceof Element?child.visibleText(brief):String(child)).join(' ');}
  }
  const h=(...args)=>new Element(...args),timers=new Map(),timeouts=new Map(),frames=new Map(),observers=new Set(),audio=[],threats=[],navigations=[];
  const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};
  c={...context,AbortController,document:new Target(),localStorage:storage(),sessionStorage:storage(),
    CustomEvent:class{constructor(type,props){this.type=type;Object.assign(this,props);}},
    getComputedStyle:()=>({getPropertyValue:()=> '#8d9c77'}),scrollY:0,scrollTo(_x,y){this.scrollY=y;},location:{href:'http://localhost/index.html#map-room'},navigator:{},
    setInterval:fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearInterval:id=>timers.delete(id),
    setTimeout:(fn,delay)=>{const id=++nextTimer;fn.delay=delay;timeouts.set(id,fn);return id;},clearTimeout:id=>timeouts.delete(id),
    requestAnimationFrame:fn=>{const id=++nextTimer;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)};
  const media=new Target();media.matches=false;c.matchMedia=()=>media;
  c.document.documentElement=h('html');
  c.MutationObserver=class{constructor(callback){this.callback=callback;}observe(){observers.add(this);}disconnect(){observers.delete(this);}};
  c.PCAudio={cue:name=>audio.push(name)};
  c.PCApp={h,screen:value=>{screen=value;},href:(...parts)=>'#'+parts.join('/'),go:(...parts)=>navigations.push(parts),back:id=>navigations.push(['back',id]),setTitle(){},append:(el,children)=>el.append(children),clear:el=>{el.replaceChildren();return el;},tag:text=>h('span.tc-tag',null,text),verdictTone:()=> 'info',missing:(code,key,text)=>h('div.tc-missing',null,code,key,text),
    screenHead:(_id,options={})=>h('header.tc-screenhead',null,h('p.tc-screenhead-code',null,'CH SCREEN'),h('h1',{text:options.title}),h('p',{text:options.desc}),h('dl.tc-screenhead-meta',null,options.meta?.map(([term,value])=>h('div',null,term,value)))),img:(src,props={})=>h('img',{alt:'',...props,src})};
  c.PCApp.append=(el,children)=>el.append(...children.flat(Infinity).filter(x=>x!=null&&x!==false&&x!==''));
  c.PCApp.back=(...parts)=>navigations.push(['back',...parts]);
  c.window=c;vm.createContext(c);if(stateSource)vm.runInContext(stateSource,c);vm.runInContext(source,c);
  const host=h(`main#${screen.id}`);screen.mount(host);
  return {c,host,screen,timers,timeouts,frames,media,observers,audio,threats,navigations};
}
