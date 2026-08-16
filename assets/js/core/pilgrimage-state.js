// Project Curse 5.23.1 — persistent pilgrimage progress owner.
(function(root){
  'use strict';

  const data=root.ProjectCursePilgrimageData;
  const storageKey='pc_pilgrimage_state_v1';
  const scenarioId='unlit-fortress';
  const scenario=data?.scenarios?.[scenarioId];
  const clamp=(value,min=0,max=100)=>Math.max(min,Math.min(max,Number(value)||0));
  const fresh=()=>({schema:1,scenarioId,status:'idle',step:0,fear:8,corruption:0,signal:86,violations:0,choices:[],ending:null,startedAt:null,updatedAt:null});
  const normalize=value=>{
    const next={...fresh(),...(value&&typeof value==='object'?value:{})};
    next.scenarioId=scenarioId;
    next.status=['idle','active','complete'].includes(next.status)?next.status:'idle';
    next.step=clamp(next.step,0,Math.max(0,(scenario?.stages?.length||1)-1));
    next.fear=clamp(next.fear);next.corruption=clamp(next.corruption);next.signal=clamp(next.signal);
    next.violations=clamp(next.violations,0,99);
    next.choices=Array.isArray(next.choices)?next.choices.filter(entry=>entry&&typeof entry.stage==='string'&&typeof entry.choice==='string'):[];
    next.ending=scenario?.endings?.[next.ending]?next.ending:null;
    if(next.ending) next.status='complete';
    next.startedAt=typeof next.startedAt==='string'?next.startedAt:null;
    next.updatedAt=typeof next.updatedAt==='string'?next.updatedAt:null;
    return next;
  };
  const load=()=>{try{return normalize(JSON.parse(localStorage.getItem(storageKey)||'null'));}catch(_error){return fresh();}};
  let state=load();
  const snapshot=()=>Object.freeze({...state,choices:Object.freeze(state.choices.map(entry=>Object.freeze({...entry})))});
  const emit=reason=>document.dispatchEvent(new CustomEvent('projectcurse:pilgrimage-state-change',{detail:{reason,state:snapshot(),summary:getSummary()}}));
  const persist=reason=>{
    state.updatedAt=new Date().toISOString();
    try{localStorage.setItem(storageKey,JSON.stringify(state));}catch(_error){}
    emit(reason);return snapshot();
  };

  function start(){
    if(!scenario) return false;
    if(state.status==='idle'){
      state={...fresh(),status:'active',startedAt:new Date().toISOString()};
      return persist('start');
    }
    return snapshot();
  }
  function choose(choiceId){
    if(state.status!=='active'||!scenario) return false;
    const stage=scenario.stages[state.step];
    if(!stage||state.choices.some(entry=>entry.stage===stage.id)) return false;
    const choice=stage.choices.find(entry=>entry.id===choiceId);
    if(!choice) return false;
    state.fear=clamp(state.fear+(choice.deltas?.fear||0));
    state.corruption=clamp(state.corruption+(choice.deltas?.corruption||0));
    state.signal=clamp(state.signal+(choice.deltas?.signal||0));
    if(choice.ruleOutcome==='broken') state.violations+=1;
    state.choices.push({stage:stage.id,choice:choice.id,ruleOutcome:choice.ruleOutcome||'unknown'});
    if(choice.ending&&scenario.endings[choice.ending]){
      state.ending=choice.ending;state.status='complete';
    }else{
      state.step=clamp(state.step+1,0,scenario.stages.length-1);
    }
    return persist(choice.ending?'complete':'choice');
  }
  function reset(){
    state=fresh();
    try{localStorage.removeItem(storageKey);}catch(_error){}
    emit('reset');return snapshot();
  }
  function getEnding(){return scenario?.endings?.[state.ending]||null;}
  function getSummary(){
    const total=scenario?.stages?.length||0;
    return Object.freeze({scenarioId,status:state.status,step:state.step,completed:state.choices.length,total,progress:total?Math.round((state.choices.length/total)*100):0,fear:state.fear,corruption:state.corruption,signal:state.signal,violations:state.violations,ending:state.ending,endingData:getEnding(),updatedAt:state.updatedAt});
  }

  root.ProjectCursePilgrimageState=Object.freeze({version:'1.0.0',scenarioId,storageKey,get:snapshot,getSummary,getEnding,start,choose,reset});
})(window);
