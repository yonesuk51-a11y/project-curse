// Project Curse 5.43.0 — persistent OP-BROKEN-CROWN local verdict and canon-boundary owner.
(function(root){
  'use strict';

  const operationId='op-southern-coup';
  const storageKey='pc_operation_broken_crown_v1';
  const branchIds=['signal','witness','deadzone'];
  const canonBoundary=Object.freeze({
    status:'COMMON CANON UNCHANGED',
    scope:'이 브라우저에 저장되는 현장 지휘관의 가상 작전 판정이다. 세계 공통 정사와 후속 연표를 확정하지 않는다.',
    fixedFacts:Object.freeze([
      '2030년 1월 17일, 남방 쿠데타와 도시 집단 소환을 저지하기 위한 부서진 왕관 작전이 개시됐다.',
      '성위대 지휘망 침투와 복수 도시의 소환 반응이 같은 시간대에 관측됐다.',
      '성위대 지휘관이 남방 특수부대 출신이라는 기록과, 그가 생존해 있을 경우 처형하라는 명령문이 함께 회수됐다.',
      '처형 명령의 최종 발신자, 지휘관의 실제 충성, 작전의 최종 승패는 확정되지 않았다.'
    ]),
    pendingFacts:Object.freeze([
      '성위대 지휘관의 생존·처형·구금·협력 여부',
      '도시 소환진과 제3 발신자의 최종 상태',
      '남부 혈교 강경파의 전후 지휘권',
      '데드존 혈교와 남방 세력 사이의 장기 협력 또는 재편입 여부'
    ]),
    lineageGuard:'어느 선택도 남부 혈교를 우시노다 중앙 혈교의 확정 후계로 만들지 않으며, 데드존 혈교를 남부 지휘 아래 재편입시키지 않는다. 같은 표식·의식·일시적 교신은 동일한 지휘 계보의 증거가 아니다.'
  });
  const decisions={
    execute:{
      id:'execute',code:'LOCAL-EXECUTE',title:'지휘관 즉시 처형',status:'LOCAL EXECUTION LOGGED',tone:'failed',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 추가 검증을 중단하고 회수된 처형 명령을 집행했다. 이 기록은 해당 작전 분기의 판단이며 지휘관의 정사상 사망을 확정하지 않는다.',
      observed:'현장 부대가 지휘관 신호를 제거한 뒤 인증키와 내부 동조자 추적선이 끊겼다.',
      immediate:'이 작전 지도에서 성위대 지휘망은 붕괴 상태로, 도시 소환진 한 곳은 재활성 상태로 표시된다.',
      unresolved:'처형 명령의 원 발신자와 지휘관의 실제 충성은 확인되지 않았다. 남부 강경파가 전후 지휘권을 장악했다는 결론도 승인되지 않았다.',
      consequence:'로컬 지도에서 지휘망 붕괴와 소환진 재활성 위험을 추적한다. 남부 전체의 권력 승계는 미확정이다.',
      directive:'잔존 성위대의 무장을 해제하고 도시권 철수 회랑을 확보한다. 처형 명령의 진위는 별도 조사선으로 남긴다.',
      route:[[568,228],[414,292],[246,374]],siteStates:['secured','hostile','active','lost','active','unknown'],
      stepStates:['complete','complete','complete','altered','failed','complete']
    },
    detain:{
      id:'detain',code:'LOCAL-DETAIN',title:'지휘관 확보 및 심문',status:'LOCAL CUSTODY LOGGED',tone:'contained',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 지휘관을 격리하고 암호키를 보존하는 분기를 선택했다. 이 기록은 지휘관의 정사상 생존이나 구금을 확정하지 않는다.',
      observed:'현장 사본에는 지휘관 신호와 암호키, 내부 동조자 후보 명단이 호송 대상으로 등록됐다.',
      immediate:'이 작전 지도에서 심문 채널이 열리고 두 번째 소환진 차단은 불완전 상태로 표시된다.',
      unresolved:'지휘관이 남방 명령에 불복한 것인지, 더 깊은 침투를 위해 협조한 것인지는 판단할 수 없다.',
      consequence:'로컬 지도에서 제3 발신자 추적선과 호송 공격 위험을 함께 유지한다.',
      directive:'해안 감청소로 지휘관을 이송하고 데드존 교신 좌표와 암호키를 교차 검증한다.',
      route:[[568,228],[414,292],[94,426]],siteStates:['secured','contained','secured','contained','active','unknown'],
      stepStates:['complete','complete','complete','complete','altered','complete']
    },
    cooperate:{
      id:'cooperate',code:'LOCAL-COOPERATE',title:'처형 명령 무시·공동 대응',status:'LOCAL COOPERATION LOGGED',tone:'allied',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 처형 명령을 보류하고 지휘관과 한시적으로 도시 연결부를 차단했다. 이는 작전 단위의 협조이며 정식 동맹을 뜻하지 않는다.',
      observed:'현장 사본에서 성위대와 합동팀의 이동선이 겹쳤고, 데드존 경고 좌표와 일치하는 연결부가 차단됐다.',
      immediate:'이 작전 지도에서 소환진 두 곳이 정지하고 비인가 정보 교환로가 열린 것으로 표시된다.',
      unresolved:'남부 강경파의 공개 적대, 지휘관의 장기 충성, 데드존 혈교의 공식 가담 여부는 확정되지 않았다.',
      consequence:'로컬 지도에서 공동 차단선과 비인가 교신을 표시한다. 데드존 혈교가 남부 또는 U.A.C 지휘에 편입된 것은 아니다.',
      directive:'공동 대응 사실을 작전 한정 기록으로 봉인하고 데드존 경고 좌표를 독립 출처로 계속 검증한다.',
      route:[[568,228],[414,292],[735,170]],siteStates:['secured','hostile','secured','allied','secured','contested'],
      stepStates:['complete','complete','complete','complete','altered','complete']
    },
    defer:{
      id:'defer',code:'LOCAL-DEFERRED',title:'판단 보류',status:'LOCAL DECISION DEFERRED',tone:'pending',scope:'local-command-verdict',canonEffect:'none',lineageEffect:'none',
      summary:'현장 지휘부는 추가 교신이 도착할 때까지 처형·구금·협력을 모두 보류했다. 이 분기는 미확정 상태를 보존한다.',
      observed:'지휘관 신호와 인증키는 남아 있으나 현장 부대는 어느 명령도 최종 집행하지 않았다.',
      immediate:'이 작전 지도에서 지휘망과 소환 반응, 철수 회랑이 모두 진행 중 또는 경합 상태로 남는다.',
      unresolved:'지휘관의 운명, 제3 발신자, 쿠데타의 승패와 혈교 계보 변화가 모두 후대 승인 대상으로 남는다.',
      consequence:'로컬 지도에서 모든 핵심 신호를 미결 상태로 유지하며 공통 정사에는 변화를 주지 않는다.',
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
      verdict:state.verdict,decision,status:state.status,mapStep:state.mapStep,updatedAt:state.updatedAt,canonBoundary
    });
  }

  root.ProjectCurseOperationState=Object.freeze({
    version:'1.1.0',operationId,storageKey,branchIds:Object.freeze([...branchIds]),canonBoundary,decisions:Object.freeze(decisions),
    get:snapshot,getSummary,getDecision,visitBranch,chooseVerdict,setMapStep,reset
  });
})(window);
