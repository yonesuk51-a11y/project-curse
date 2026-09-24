// Project Curse 6 — 진행 상태 저장소. 부서진 왕관 판정·순례 진행·현장 판정 보관.
// 상황 관제가 쓰고 단말 상태(홈)가 읽는다. 옛 저장 키와 변경 이벤트를 그대로 쓴다.
// 화면 코드가 아니므로 DOM을 만들지 않는다.
// Project Curse 5.42.0 — persistent OP-BROKEN-CROWN local verdict and canon-boundary owner.
(function(root){
  'use strict';

  const operationId='op-southern-coup';
  const storageKey='pc_operation_broken_crown_v1';
  const branchIds=['signal','witness','deadzone'];
  const {canonBoundary,decisions}=root.ProjectCurseMapScreenData;

  const fresh=()=>({
    schema:1,operationId,visited:[],verdict:null,mapStep:0,status:'analysis',updatedAt:null
  });
  const safeStep=value=>Math.max(0,Math.min(5,Number(value)||0));
  const normalize=value=>{
    const next={...fresh(),...(value&&typeof value==='object'?value:{})};
    next.operationId=operationId;
    next.visited=[...new Set((Array.isArray(next.visited)?next.visited:[]).filter(id=>branchIds.includes(id)))];
    next.verdict=decisions[next.verdict]?next.verdict:null;
    next.mapStep=safeStep(next.mapStep);
    next.status=next.verdict?(next.verdict==='defer'?'deferred':'resolved'):(next.visited.length===branchIds.length?'decision-ready':'analysis');
    next.updatedAt=typeof next.updatedAt==='string'?next.updatedAt:null;
    return next;
  };
  const load=()=>{
    try{return normalize(JSON.parse(localStorage.getItem(storageKey)||'null'));}
    catch(_error){return fresh();}
  };
  let state=load();

  const snapshot=()=>Object.freeze({...state,visited:Object.freeze([...state.visited])});
  const emit=(reason)=>document.dispatchEvent(new CustomEvent('projectcurse:operation-state-change',{detail:{reason,state:snapshot()}}));
  const persist=(reason)=>{
    state.updatedAt=new Date().toISOString();
    try{localStorage.setItem(storageKey,JSON.stringify(state));}catch(_error){}
    emit(reason);
    return snapshot();
  };

  function visitBranch(id){
    if(!branchIds.includes(id)) return snapshot();
    if(!state.visited.includes(id)) state.visited.push(id);
    state.status=state.visited.length===branchIds.length?'decision-ready':'analysis';
    return persist('branch');
  }
  function chooseVerdict(id){
    if(!decisions[id]||state.visited.length!==branchIds.length) return false;
    state.verdict=id;
    state.status=id==='defer'?'deferred':'resolved';
    state.mapStep=id==='defer'?4:5;
    persist('verdict');
    return snapshot();
  }
  function setMapStep(index){
    const step=safeStep(index);
    if(step===state.mapStep) return snapshot();
    state.mapStep=step;
    return persist('map-step');
  }
  function reset(){
    state=fresh();
    try{localStorage.removeItem(storageKey);}catch(_error){}
    emit('reset');
    return snapshot();
  }
  function getDecision(id=state.verdict){return decisions[id]||null;}
  function getSummary(){
    const decision=getDecision();
    return Object.freeze({
      recovered:state.visited.length,total:branchIds.length,ready:state.visited.length===branchIds.length,
      verdict:state.verdict,decision,status:state.status,mapStep:state.mapStep,updatedAt:state.updatedAt,canonBoundary
    });
  }

  root.ProjectCurseOperationState=Object.freeze({
    version:'1.1.0',operationId,storageKey,branchIds:Object.freeze([...branchIds]),canonBoundary,decisions:Object.freeze(decisions),
    get:snapshot,getSummary,getDecision,visitBranch,chooseVerdict,setMapStep,reset
  });
})(window);

// Project Curse 5.42.0 — persistent reactive-scenario state, content variants, and consequence owner.
(function(root){
  'use strict';

  const data=root.ProjectCursePilgrimageData;
  const scenarios=data?.scenarios||{};
  const defaultScenarioId='unlit-fortress';
  const storageKey='pc_pilgrimage_states_v2';
  const legacyKey='pc_pilgrimage_state_v1';
  const clamp=(value,min=0,max=100)=>Math.max(min,Math.min(max,Number(value)||0));
  const scenarioFor=id=>scenarios[id]||null;
  const metricDefinitions=id=>scenarioFor(id)?.metrics||[];
  let activeScenarioId=defaultScenarioId;

  function fresh(id){
    const metrics=Object.fromEntries(metricDefinitions(id).map(metric=>[metric.key,clamp(metric.initial)]));
    return {schema:2,scenarioId:id,status:'idle',step:0,metrics,violations:0,choices:[],ending:null,startedAt:null,updatedAt:null};
  }

  function normalize(id,value){
    const scenario=scenarioFor(id);
    const base=fresh(id);
    const source=value&&typeof value==='object'?value:{};
    const metrics={...base.metrics};
    metricDefinitions(id).forEach(metric=>{
      const raw=source.metrics?.[metric.key]??source[metric.key]??metric.initial;
      metrics[metric.key]=clamp(raw);
    });
    const next={...base,...source,schema:2,scenarioId:id,metrics};
    next.status=['idle','active','complete'].includes(next.status)?next.status:'idle';
    next.step=clamp(next.step,0,Math.max(0,(scenario?.stages?.length||1)-1));
    next.violations=clamp(next.violations,0,99);
    next.choices=Array.isArray(next.choices)?next.choices.filter(entry=>entry&&typeof entry.stage==='string'&&typeof entry.choice==='string').map(entry=>({stage:entry.stage,choice:entry.choice,ruleOutcome:entry.ruleOutcome||'unknown'})):[];
    next.ending=scenario?.endings?.[next.ending]?next.ending:null;
    if(next.ending) next.status='complete';
    next.startedAt=typeof next.startedAt==='string'?next.startedAt:null;
    next.updatedAt=typeof next.updatedAt==='string'?next.updatedAt:null;
    return next;
  }

  function loadAll(){
    let saved={};
    try{
      const parsed=JSON.parse(localStorage.getItem(storageKey)||'null');
      if(parsed?.states&&typeof parsed.states==='object') saved=parsed.states;
    }catch(_error){}
    if(!saved[defaultScenarioId]){
      try{
        const legacy=JSON.parse(localStorage.getItem(legacyKey)||'null');
        if(legacy&&typeof legacy==='object') saved[defaultScenarioId]=legacy;
      }catch(_error){}
    }
    return Object.fromEntries(Object.keys(scenarios).map(id=>[id,normalize(id,saved[id])]));
  }

  let states=loadAll();
  const chosenIds=state=>new Set((state?.choices||[]).map(entry=>entry.choice));
  function matchesCondition(condition,state){
    if(!condition) return true;
    const chosen=chosenIds(state);
    if(condition.choice&&!chosen.has(condition.choice)) return false;
    if(condition.all&&!condition.all.every(id=>chosen.has(id))) return false;
    if(condition.any&&!condition.any.some(id=>chosen.has(id))) return false;
    if(condition.not&&condition.not.some(id=>chosen.has(id))) return false;
    if(condition.metrics&&Object.entries(condition.metrics).some(([key,range])=>{
      const value=Number(state?.metrics?.[key]??state?.[key]??0);
      return (range.min!==undefined&&value<range.min)||(range.max!==undefined&&value>range.max);
    })) return false;
    return true;
  }
  function resolveContent(base,state){
    if(!base) return null;
    const variant=(base.variants||[]).find(item=>matchesCondition(item.when,state));
    if(!variant) return base;
    const patches=variant.choicePatches||{};
    const choices=(variant.choices||base.choices)?.map(choice=>patches[choice.id]?{...choice,...patches[choice.id]}:choice);
    const resolved={...base,...variant,...(choices?{choices}:{})};
    delete resolved.when;delete resolved.variants;delete resolved.choicePatches;
    return resolved;
  }
  const ensure=id=>{
    if(!scenarioFor(id)) throw new RangeError('Unknown pilgrimage: '+id);
    const resolved=id;
    if(!states[resolved]) states[resolved]=fresh(resolved);
    return resolved;
  };
  const snapshot=id=>{
    const resolved=ensure(id||activeScenarioId);
    const state=states[resolved];
    return Object.freeze({...state,...state.metrics,metrics:Object.freeze({...state.metrics}),choices:Object.freeze(state.choices.map(entry=>Object.freeze({...entry})))});
  };
  const write=()=>{try{localStorage.setItem(storageKey,JSON.stringify({schema:2,states}));}catch(_error){}};
  const emit=(reason,id)=>document.dispatchEvent(new CustomEvent('projectcurse:pilgrimage-state-change',{detail:{reason,scenarioId:id,state:snapshot(id),summary:getSummary(id),summaries:getAllSummaries()}}));
  const persist=(reason,id)=>{
    states[id].updatedAt=new Date().toISOString();
    write();emit(reason,id);return snapshot(id);
  };

  function select(id){
    if(!scenarioFor(id)) return false;
    activeScenarioId=id;ensure(id);return snapshot(id);
  }

  function start(id=activeScenarioId){
    const resolved=ensure(id);
    if(states[resolved].status==='idle'){
      states[resolved]={...fresh(resolved),status:'active',startedAt:new Date().toISOString()};
      return persist('start',resolved);
    }
    return snapshot(resolved);
  }

  function choose(choiceId,id=activeScenarioId){
    const resolved=ensure(id);
    const state=states[resolved];
    const scenario=scenarioFor(resolved);
    if(state.status!=='active'||!scenario) return false;
    const stage=resolveContent(scenario.stages[state.step],state);
    if(!stage||state.choices.some(entry=>entry.stage===stage.id)) return false;
    const choice=stage.choices.find(entry=>entry.id===choiceId);
    if(!choice) return false;
    metricDefinitions(resolved).forEach(metric=>{
      state.metrics[metric.key]=clamp(state.metrics[metric.key]+(choice.deltas?.[metric.key]||0));
    });
    if((scenario.negativeOutcomes||['broken']).includes(choice.ruleOutcome)) state.violations+=1;
    state.choices.push({stage:stage.id,choice:choice.id,ruleOutcome:choice.ruleOutcome||'unknown'});
    if(choice.ending&&scenario.endings[choice.ending]){
      state.ending=choice.ending;state.status='complete';
    }else state.step=clamp(state.step+1,0,scenario.stages.length-1);
    return persist(choice.ending?'complete':'choice',resolved);
  }

  function reset(id=activeScenarioId){
    const resolved=ensure(id);
    states[resolved]=fresh(resolved);write();emit('reset',resolved);return snapshot(resolved);
  }

  function getEnding(id=activeScenarioId){
    const resolved=ensure(id);
    return resolveEnding(resolved,states[resolved].ending,states[resolved]);
  }

  function getStage(id=activeScenarioId,index=null,stateLike=null){
    const resolved=ensure(id);
    const state=stateLike||states[resolved];
    const step=index===null?state.step:Number(index);
    return resolveContent(scenarioFor(resolved)?.stages?.[step],state);
  }

  function resolveEnding(id,endingId,stateLike=null){
    const resolved=ensure(id);
    return resolveContent(scenarioFor(resolved)?.endings?.[endingId],stateLike||states[resolved]);
  }

  function getSummary(id=activeScenarioId){
    const resolved=ensure(id);
    const scenario=scenarioFor(resolved);
    const state=states[resolved];
    const total=scenario?.stages?.length||0;
    const metrics=Object.freeze({...state.metrics});
    return Object.freeze({scenarioId:resolved,status:state.status,step:state.step,completed:state.choices.length,total,progress:total?Math.round((state.choices.length/total)*100):0,metrics,...state.metrics,violations:state.violations,ending:state.ending,endingData:getEnding(resolved),updatedAt:state.updatedAt});
  }

  function getAllSummaries(){
    return Object.freeze(Object.fromEntries(Object.keys(scenarios).map(id=>[id,getSummary(id)])));
  }

  root.ProjectCursePilgrimageState=Object.freeze({
    version:'2.2.0',scenarioId:defaultScenarioId,storageKey,legacyKey,
    getActiveScenarioId:()=>activeScenarioId,getScenario:id=>scenarioFor(id||activeScenarioId),select,
    get:id=>snapshot(id),getSummary,getAllSummaries,getStage,getEnding,resolveEnding,matchesCondition,start,choose,reset
  });
})(window);

// Project Curse 5.42.0 — persistent local-verdict archive, reactive snapshots, and scenario-unlock owner.
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
    return root.ProjectCurseMapScreenData.verdictDocument(entry,scenario,ending,snapshot,choiceRows,metricRows);
  }

  Object.keys(scenarios).forEach(id=>capture(id,{silent:true}));
  function onPilgrimageChange(event){
    if(event.detail?.reason==='reset'){
      delete state.dismissed[event.detail.scenarioId];write();
    }
    if(event.detail?.state?.status==='complete') capture(event.detail.scenarioId);
  }
  // 옛 모듈처럼 불러올 때 한 번 붙인다. 어느 화면에서 순례가 끝나도 판정 사본이 바로 보관된다(홈 경보가 이 값을 읽는다).
  document.addEventListener('projectcurse:pilgrimage-state-change',onPilgrimageChange);

  root.ProjectCurseVerdictArchiveState=Object.freeze({
    version:'1.0.0',storageKey,onPilgrimageChange,list,getEntry,getSummary,getDocument,capture,markRead,resetRead,clearScenario,clearAll,isUnlocked:id=>Boolean(state.records[id])
  });
})(window);
