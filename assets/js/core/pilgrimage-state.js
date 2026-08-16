// Project Curse 5.26.0 — persistent multi-scenario pilgrimage and screening state owner.
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
  const ensure=id=>{
    const resolved=scenarioFor(id)?id:defaultScenarioId;
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
    const stage=scenario.stages[state.step];
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
    return scenarioFor(resolved)?.endings?.[states[resolved].ending]||null;
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
    version:'2.0.0',scenarioId:defaultScenarioId,storageKey,legacyKey,
    getActiveScenarioId:()=>activeScenarioId,getScenario:id=>scenarioFor(id||activeScenarioId),select,
    get:id=>snapshot(id),getSummary,getAllSummaries,getEnding,start,choose,reset
  });
})(window);
