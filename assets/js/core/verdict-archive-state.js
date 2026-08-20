// Project Curse 5.40.0 — persistent local-verdict archive, reactive snapshots, and scenario-unlock owner.
(function(root){
  'use strict';

  const data=root.ProjectCurseVerdictArchiveData;
  const pilgrimage=root.ProjectCursePilgrimageState;
  const scenarios=root.ProjectCursePilgrimageData?.scenarios||{};
  if(!data||!pilgrimage) return;

  const storageKey='pc_verdict_archive_state_v1';
  const definitions=Object.fromEntries(data.records.map(record=>[record.id,record]));
  const reportFor=(scenarioId,endingId)=>data.records.find(record=>record.scenarioId===scenarioId&&record.endingId===endingId)||null;

  function load(){
    try{
      const parsed=JSON.parse(localStorage.getItem(storageKey)||'null');
      if(parsed?.records&&typeof parsed.records==='object') return {schema:1,records:parsed.records,dismissed:parsed.dismissed&&typeof parsed.dismissed==='object'?parsed.dismissed:{}};
    }catch(_error){}
    return {schema:1,records:{},dismissed:{}};
  }

  let state=load();
  const write=()=>{try{localStorage.setItem(storageKey,JSON.stringify(state));}catch(_error){}};
  const clone=value=>value?JSON.parse(JSON.stringify(value)):null;
  const emit=(reason,id)=>document.dispatchEvent(new CustomEvent('projectcurse:verdict-archive-change',{detail:{reason,id,summary:getSummary(),entry:id?getEntry(id):null}}));

  function capture(scenarioId,{silent=false}={}){
    const summary=pilgrimage.getSummary?.(scenarioId);
    if(summary?.status!=='complete'||!summary.ending) return false;
    const definition=reportFor(scenarioId,summary.ending);
    if(!definition) return false;
    const fingerprint=`${summary.ending}:${summary.updatedAt||''}`;
    if(state.dismissed?.[scenarioId]===fingerprint) return false;
    const current=pilgrimage.get?.(scenarioId);
    const existing=state.records[definition.id];
    const now=new Date().toISOString();
    state.records[definition.id]={
      id:definition.id,scenarioId,endingId:summary.ending,
      unlockedAt:existing?.unlockedAt||summary.updatedAt||now,
      updatedAt:summary.updatedAt||now,readAt:existing?.readAt||null,
      metrics:{...summary.metrics},violations:summary.violations||0,
      choices:(current?.choices||[]).map(choice=>({...choice}))
    };
    delete state.dismissed[scenarioId];
    write();
    if(!silent) emit(existing?'refresh':'unlock',definition.id);
    return definition.id;
  }

  function getEntry(id){
    const definition=definitions[id];
    if(!definition) return null;
    const snapshot=state.records[id]||null;
    return Object.freeze({...definition,unlocked:Boolean(snapshot),unread:Boolean(snapshot&&!snapshot.readAt),snapshot:clone(snapshot)});
  }

  function list(){return Object.freeze(data.records.map(record=>getEntry(record.id)));}
  function getSummary(){
    const entries=list();
    const unlocked=entries.filter(entry=>entry.unlocked);
    return Object.freeze({total:entries.length,unlocked:unlocked.length,locked:entries.length-unlocked.length,read:unlocked.filter(entry=>!entry.unread).length,unread:unlocked.filter(entry=>entry.unread).length,latest:unlocked.sort((a,b)=>String(b.snapshot?.unlockedAt||'').localeCompare(String(a.snapshot?.unlockedAt||'')))[0]||null});
  }

  function markRead(id){
    if(!state.records[id]||state.records[id].readAt) return false;
    state.records[id].readAt=new Date().toISOString();write();emit('read',id);return true;
  }

  function resetRead(){
    let changed=false;
    Object.values(state.records).forEach(record=>{if(record.readAt){record.readAt=null;changed=true;}});
    if(changed){write();emit('reset-read',null);}return changed;
  }

  function clearScenario(scenarioId){
    let changed=false;
    Object.keys(state.records).forEach(id=>{if(state.records[id]?.scenarioId===scenarioId){delete state.records[id];changed=true;}});
    const summary=pilgrimage.getSummary?.(scenarioId);
    if(summary?.status==='complete') state.dismissed[scenarioId]=`${summary.ending}:${summary.updatedAt||''}`;
    if(changed||summary?.status==='complete'){write();emit('clear-scenario',null);}return changed;
  }

  function clearAll(){
    if(!Object.keys(state.records).length) return false;
    const dismissed={};
    Object.keys(scenarios).forEach(scenarioId=>{
      const summary=pilgrimage.getSummary?.(scenarioId);
      if(summary?.status==='complete') dismissed[scenarioId]=`${summary.ending}:${summary.updatedAt||''}`;
    });
    state={schema:1,records:{},dismissed};write();emit('clear-all',null);return true;
  }

  function getDocument(id){
    const entry=getEntry(id);
    if(!entry?.unlocked) return null;
    const scenario=scenarios[entry.scenarioId];
    const snapshot=entry.snapshot;
    const ending=pilgrimage.resolveEnding?.(entry.scenarioId,entry.endingId,snapshot)||scenario?.endings?.[entry.endingId];
    if(!scenario||!ending||!snapshot) return null;
    const choiceRows=snapshot.choices.map((saved,index)=>{
      const stageIndex=scenario.stages.findIndex(item=>item.id===saved.stage);
      const stage=pilgrimage.getStage?.(entry.scenarioId,stageIndex,snapshot)||scenario.stages[stageIndex];
      const choice=stage?.choices.find(item=>item.id===saved.choice);
      return [String(index+1).padStart(2,'0'),stage?.title||saved.stage,choice?.label||saved.choice,scenario.outcomeLabels?.[saved.ruleOutcome]||saved.ruleOutcome];
    });
    const metricRows=scenario.metrics.map(metric=>[metric.label,`${snapshot.metrics?.[metric.key]??0}%`]);
    return {
      sourceId:id,scenarioId:entry.scenarioId,unlockScenario:entry.unlockScenario||null,presentation:'verdict',theme:entry.theme,code:entry.code,title:entry.title,
      summary:entry.summary,date:new Date(snapshot.unlockedAt).toLocaleString('ko-KR'),owner:'U.A.C 현장 판정 보관소',classification:'로컬 현장 판정·공통 정사 미확정',
      telemetry:[['판정 상태',ending.status],['선택 기록',`${choiceRows.length} / ${scenario.stages.length}`],['규칙 위반',`${snapshot.violations}회`],['열람 상태',entry.unread?'새 기록':'확인함']],
      sections:[
        {title:'판정 요약',record:{code:'LOCAL VERDICT',type:'플레이어 선택 사본',author:'현재 단말 현장 판정 저장소',recipient:'로컬 관제 기록',evidence:'저장된 선택·측정값',limit:scenario.canonBoundary},paragraphs:[entry.summary,ending.summary],warning:`로컬 관제 결과: ${ending.consequence} ${scenario.canonBoundary}`},
        {title:'현장 선택 기록',paragraphs:['아래 내용은 결말이 확정된 순간의 선택 기록이다. 이후 시나리오를 다시 시작해도 이 사본은 바뀌지 않는다.'],table:{headers:['단계','현장','선택한 행동','규칙 판정'],rows:choiceRows}},
        {title:'최종 측정값',paragraphs:['수치는 현장 판정이 끝난 시점의 값이다. 서로 다른 시점의 결과를 직접 비교할 때는 선택 기록도 함께 확인한다.'],table:{headers:['항목','최종 값'],rows:metricRows}},
        {title:'분석과 후속 조치',paragraphs:[entry.finding,entry.directive],quote:entry.hidden}
      ]
    };
  }

  Object.keys(scenarios).forEach(id=>capture(id,{silent:true}));
  document.addEventListener('projectcurse:pilgrimage-state-change',event=>{
    if(event.detail?.reason==='reset'){
      delete state.dismissed[event.detail.scenarioId];write();
    }
    if(event.detail?.state?.status==='complete') capture(event.detail.scenarioId);
  });

  root.ProjectCurseVerdictArchiveState=Object.freeze({
    version:'1.0.0',storageKey,list,getEntry,getSummary,getDocument,capture,markRead,resetRead,clearScenario,clearAll,isUnlocked:id=>Boolean(state.records[id])
  });
})(window);
