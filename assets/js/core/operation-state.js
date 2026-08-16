// Project Curse 5.24.0 — persistent OP-BROKEN-CROWN decision and progress owner.
(function(root){
  'use strict';

  const operationId='op-southern-coup';
  const storageKey='pc_operation_broken_crown_v1';
  const branchIds=['signal','witness','deadzone'];
  const decisions={
    execute:{
      id:'execute',code:'VERDICT-EXECUTE',title:'지휘관 즉시 처형',status:'COMMAND NETWORK COLLAPSED',tone:'failed',
      summary:'처형 명령을 집행했다. 성위대 지휘망은 붕괴했고 인증키와 제3 발신자 추적선이 함께 소실됐다.',
      consequence:'도시 소환진 한 곳이 다시 활성화되고 남부 강경파의 지휘권이 확대된다.',
      directive:'잔존 성위대의 무장을 해제하고 도시권 철수 회랑을 우선 확보한다.',
      route:[[568,228],[414,292],[246,374]],siteStates:['secured','hostile','active','lost','active','unknown'],
      stepStates:['complete','complete','complete','altered','failed','complete']
    },
    detain:{
      id:'detain',code:'VERDICT-DETAIN',title:'지휘관 확보 및 심문',status:'TARGET IN CUSTODY',tone:'contained',
      summary:'지휘관을 생포해 암호키와 내부 동조자 명단을 보존했다. 호송 지연으로 두 번째 소환진 차단은 불완전하다.',
      consequence:'제3 발신자의 서명 배열을 추적할 수 있지만 호송 경로가 새로운 공격 표적이 된다.',
      directive:'해안 감청소로 지휘관을 이송하고 데드존 교신 좌표와 암호키를 교차 검증한다.',
      route:[[568,228],[414,292],[94,426]],siteStates:['secured','contained','secured','contained','active','unknown'],
      stepStates:['complete','complete','complete','complete','altered','complete']
    },
    cooperate:{
      id:'cooperate',code:'VERDICT-COOPERATE',title:'처형 명령 무시·공동 대응',status:'UNAUTHORIZED ALLIANCE',tone:'allied',
      summary:'지휘관과 공동으로 도시 연결부를 파괴했다. 성위대는 유지됐지만 남부 혈교 강경파가 공개 적대로 전환했다.',
      consequence:'소환진 두 곳이 정지하고 데드존 혈교 지부와 비인가 정보 교환로가 열린다.',
      directive:'공동 대응 사실을 봉인하고 데드존 경고 좌표를 후속 작전의 우선 표적으로 지정한다.',
      route:[[568,228],[414,292],[735,170]],siteStates:['secured','hostile','secured','allied','secured','contested'],
      stepStates:['complete','complete','complete','complete','altered','complete']
    },
    defer:{
      id:'defer',code:'VERDICT-DEFERRED',title:'판단 보류',status:'DECISION DEFERRED',tone:'pending',
      summary:'추가 교신이 도착할 때까지 처형과 협력을 모두 보류했다. 지휘망은 유지되지만 도시권 차단 시간이 줄어든다.',
      consequence:'현재 정보는 보존되지만 소환진과 철수 회랑의 최종 상태는 확정되지 않는다.',
      directive:'북부 교란선과 데드존 교신을 추가 회수한 뒤 지휘 판단을 재개한다.',
      route:[[568,228],[880,118]],siteStates:['secured','hostile','active','unknown','active','contested'],
      stepStates:['complete','complete','complete','complete','active','locked']
    }
  };

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
      verdict:state.verdict,decision,status:state.status,mapStep:state.mapStep,updatedAt:state.updatedAt
    });
  }

  root.ProjectCurseOperationState=Object.freeze({
    version:'1.0.0',operationId,storageKey,branchIds:Object.freeze([...branchIds]),decisions:Object.freeze(decisions),
    get:snapshot,getSummary,getDecision,visitBranch,chooseVerdict,setMapStep,reset
  });
})(window);
