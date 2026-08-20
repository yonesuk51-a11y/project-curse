// Project Curse 5.43.0 — authored decisions, canon boundaries, and conditional recovery access.
(function(root){
  'use strict';

  const ready=callback=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',callback,{once:true}):callback();
  const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  ready(function(){
    const data=root.ProjectCursePilgrimageData;
    const store=root.ProjectCursePilgrimageState;
    if(!data||!store) return;

    const overlay=document.createElement('section');
    overlay.className='pc-pilgrimage';overlay.hidden=true;
    overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','pcPilgrimageTitle');
    document.body.append(overlay);
    let activeScenarioId=store.getActiveScenarioId?.()||store.scenarioId;
    let openState=false;let resetArmed=false;let previousFocus=null;let pendingFeedback=null;let feedbackTimer=0;

    const scenario=()=>data.scenarios?.[activeScenarioId]||null;
    const accessFor=id=>{
      const target=data.scenarios?.[id];
      if(!target) return {allowed:false,requirement:null};
      const requirement=target.unlock;
      if(!requirement) return {allowed:true,requirement:null};
      const allowed=requirement.type==='verdict'&&root.ProjectCurseVerdictArchiveState?.isUnlocked?.(requirement.id);
      return {allowed:Boolean(allowed),requirement};
    };
    const polyline=points=>(points||[]).map(point=>point.join(',')).join(' ');
    const severity=summary=>{
      if(activeScenarioId==='deadzone-return') return summary.exposure>=60||summary.identity<=35?'critical':summary.exposure>=34||summary.coherence<=50?'unstable':'nominal';
      if(activeScenarioId==='deadzone-recovery') return summary.echo>=58||summary.team<=45||summary.tether<=30?'critical':summary.echo>=30||summary.team<=70||summary.tether<=55?'unstable':'nominal';
      return summary.corruption>=55||summary.signal<=35?'critical':summary.corruption>=28||summary.fear>=58?'unstable':'nominal';
    };
    const meter=(metric,value)=>`<div class="pc-pilgrimage-meter is-${escapeHTML(metric.tone||metric.key)}"><span>${escapeHTML(metric.label)}</span><b>${String(value).padStart(2,'0')}%</b><i><em style="--pilgrimage-meter:${value}%"></em></i></div>`;
    const exposureLabel=tone=>({safe:'접촉 최소화',neutral:'통제된 손실',risk:'규칙 이탈 가능',danger:'직접 노출'}[tone]||'현장 판단');

    function renderTerrain(current){
      if(current.theme==='deadzone') return `<path class="pc-pilgrimage-wasteland" d="M0 62 C131 105 228 31 347 91 S566 43 695 103 817 58 900 97 L900 420 0 420Z"></path><path class="pc-pilgrimage-quarantine" d="M126 0V420M278 0V420M432 0V420M590 0V420M746 0V420"></path><path class="pc-pilgrimage-dead-road" d="M0 48 C173 126 257 191 398 231 S651 310 900 392"></path>`;
      if(current.theme==='recovery') return `<path class="pc-pilgrimage-wasteland" d="M0 34 C155 76 241 11 391 69 S659 20 900 82 L900 420 0 420Z"></path><path class="pc-pilgrimage-quarantine" d="M0 101H900M0 196H900M0 291H900M0 386H900"></path><path class="pc-pilgrimage-dead-road" d="M12 74 C167 137 278 174 405 232 S650 306 900 388"></path><path class="pc-pilgrimage-recovery-shaft" d="M82 0V92M818 362V420"></path>`;
      return `<path class="pc-pilgrimage-canopy" d="M0 71 C133 11 231 92 354 48 S583 88 699 37 828 62 900 30 L900 420 0 420Z"></path><path class="pc-pilgrimage-river" d="M428 0 C392 98 507 145 459 222 S446 334 514 420"></path>`;
    }

    function renderMap(summary){
      const current=scenario();const points=current.map.points;
      const activeCount=summary.status==='idle'?1:Math.max(1,Math.min(points.length,summary.completed+1));
      const travelled=points.slice(0,activeCount);
      const integrity=current.theme==='deadzone'?summary.coherence:current.theme==='recovery'?summary.tether:summary.signal;
      const integrityLabel=current.theme==='deadzone'?'IDENTITY TRACE':current.theme==='recovery'?'PHYSICAL TETHER':'ROUTE INTEGRITY';
      return `<div class="pc-pilgrimage-map" aria-label="${escapeHTML(current.title)} 진행도">
        <svg viewBox="${escapeHTML(current.map.viewBox)}" role="img" aria-label="${escapeHTML(current.map.labels.join('에서 '))}까지 이어지는 현장 경로">
          <defs><pattern id="pc-pilgrim-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30"></path></pattern><filter id="pc-pilgrim-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="blur"></feGaussianBlur><feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs>
          <rect class="pc-pilgrimage-map-grid" width="900" height="420"></rect>${renderTerrain(current)}
          <polyline class="pc-pilgrimage-route-ghost" points="${polyline(points)}"></polyline>
          ${travelled.length>1?`<polyline class="pc-pilgrimage-route-live" points="${polyline(travelled)}"></polyline>`:''}
          ${points.map((point,index)=>{const phase=index<summary.completed?'is-passed':index===summary.step&&summary.status==='active'?'is-current':summary.status==='complete'&&index===points.length-1?'is-current':'is-locked';return `<g class="pc-pilgrimage-map-point ${phase}" transform="translate(${point[0]} ${point[1]})"><circle r="${phase==='is-current'?10:7}"></circle><text x="${index<4?14:-14}" y="-13" text-anchor="${index<4?'start':'end'}">${String(index+1).padStart(2,'0')} · ${escapeHTML(current.map.labels[index])}</text></g>`;}).join('')}
        </svg><div><span>${integrityLabel}</span><b>${integrity}%</b><i>${summary.completed}/${summary.total} TRACE</i></div>
      </div>`;
    }

    function renderIntro(summary){
      const current=scenario();const resume=summary.status!=='idle';
      return `<article class="pc-pilgrimage-intro">
        <div class="pc-pilgrimage-intro-code"><i></i><span>${escapeHTML(current.code)}</span><b>${escapeHTML(current.entryLabel)}</b></div>
        <h1 id="pcPilgrimageTitle">${escapeHTML(current.title)}</h1><p>${escapeHTML(current.summary)}</p>
        <dl><div><dt>권역</dt><dd>${escapeHTML(current.region)}</dd></div><div><dt>연결 사건</dt><dd>${escapeHTML(current.incident.toUpperCase())}</dd></div><div><dt>현재 상태</dt><dd>${resume?escapeHTML(summary.status.toUpperCase()):'NOT STARTED'}</dd></div><div><dt>진행도</dt><dd>${summary.progress}%</dd></div></dl>
        <div class="pc-pilgrimage-directive"><b>${escapeHTML(current.directiveLabel)}</b><p>${escapeHTML(current.directive)}</p></div>
        <section class="pc-pilgrimage-canon-boundary" aria-label="고정 정사와 선택 분기 경계"><header><small>CANON BOUNDARY</small><b>확정된 관측과 단말 판정을 분리한다</b></header><ul>${(current.fixedFacts||[]).map(fact=>`<li>${escapeHTML(fact)}</li>`).join('')}</ul><p>${escapeHTML(current.canonBoundary)}</p></section>
        <div class="pc-pilgrimage-intro-actions"><button type="button" data-pilgrimage-start>${resume?'현장 기록 이어 보기':current.theme==='deadzone'?'귀환자 검문 시작':current.theme==='recovery'?'전진 회수 작전 시작':'순례 시작'}</button><button type="button" data-pilgrimage-open-record="${escapeHTML(current.guideRecord)}">관련 기록 먼저 확인</button></div>
      </article>`;
    }

    function renderStage(state){
      const current=scenario();const base=current.stages[state.step];const stage=store.getStage?.(activeScenarioId,state.step,state)||base;const reactive=stage!==base;
      return `<article class="pc-pilgrimage-stage${reactive?' is-reactive':''}" data-stage="${escapeHTML(stage.id)}">
        <header><div><small>${escapeHTML(stage.code)} / ${escapeHTML(stage.time)}</small><h1 id="pcPilgrimageTitle">${escapeHTML(stage.title)}</h1><p>${escapeHTML(stage.location)}</p></div><span>${state.step+1} / ${current.stages.length}</span></header>
        ${reactive?'<div class="pc-pilgrimage-reactive-flag"><i></i><span>EARLIER DECISION DETECTED</span><b>이전 현장 판단이 현재 신호를 변경했습니다.</b></div>':''}
        <div class="pc-pilgrimage-transmission"><i></i><span>${escapeHTML(stage.signal)}</span></div><p class="pc-pilgrimage-narrative">${escapeHTML(stage.narrative)}</p>
        <aside class="pc-pilgrimage-rule"><small>${escapeHTML(stage.rule.code)}</small><b>${escapeHTML(stage.rule.text)}</b></aside>
        <aside class="pc-pilgrimage-decision-standard"><small>DECISION STANDARD</small><p>${escapeHTML(current.decisionStandard)}</p></aside>
        <div class="pc-pilgrimage-choices" aria-label="현장에서 할 행동 선택">${stage.choices.map((choice,index)=>`<button type="button" class="is-${escapeHTML(choice.tone)}" data-pilgrimage-choice="${escapeHTML(choice.id)}"><i>${String(index+1).padStart(2,'0')}</i><span class="pc-pilgrimage-choice-copy"><b>${escapeHTML(choice.label)}</b><small>${escapeHTML(choice.description)}</small><span class="pc-pilgrimage-choice-meta"><span>행동 의도 기록</span><span>${escapeHTML(exposureLabel(choice.tone))}</span></span></span><em>판정 봉인&nbsp;›</em></button>`).join('')}</div>
      </article>`;
    }

    function renderFeedback(){
      const current=scenario();const feedback=pendingFeedback;if(!feedback) return '';
      const outcome=current.outcomeLabels?.[feedback.choice.ruleOutcome]||feedback.choice.ruleOutcome.toUpperCase();
      const deltas=current.metrics.map(metric=>{
        const delta=Number(feedback.choice.deltas?.[metric.key]||0);if(!delta) return '';
        return `<span class="is-${delta>0?'up':'down'}"><small>${escapeHTML(metric.label)}</small><b>${delta>0?'+':''}${delta}</b><em>${feedback.after.metrics[metric.key]}%</em></span>`;
      }).join('');
      return `<article class="pc-pilgrimage-feedback is-${escapeHTML(feedback.choice.ruleOutcome)}" role="status" aria-live="assertive">
        <div class="pc-pilgrimage-feedback-scan" aria-hidden="true"></div><small>FIELD DECISION SEALED / ${escapeHTML(feedback.stage.code)}</small>
        <h1 id="pcPilgrimageTitle">${escapeHTML(feedback.choice.label)}</h1><b>${escapeHTML(outcome)}</b><p>${escapeHTML(feedback.choice.description)}</p><aside class="pc-pilgrimage-feedback-boundary"><small>LOCAL VERDICT</small><span>${escapeHTML(current.canonBoundary)}</span></aside>
        <div class="pc-pilgrimage-feedback-metrics">${deltas||'<span><small>TRACE</small><b>±0</b><em>기록 유지</em></span>'}</div>
        <footer><i></i><span>선택 결과를 지도와 후속 현장 신호에 기록하는 중</span><em>${feedback.after.status==='complete'?'FINAL VERDICT':'NEXT TRACE'}</em></footer>
      </article>`;
    }

    function renderEnding(summary){
      const current=scenario();const ending=store.getEnding(activeScenarioId);
      const verdict=window.ProjectCurseVerdictArchiveState?.list?.().find(entry=>entry.scenarioId===activeScenarioId&&entry.endingId===ending?.id&&entry.unlocked);
      const metricStats=current.metrics.map(metric=>`<div><dt>${escapeHTML(metric.label)}</dt><dd>${summary.metrics[metric.key]}%</dd></div>`).join('');
      return `<article class="pc-pilgrimage-ending is-${escapeHTML(ending.tone)}">
        <small>${escapeHTML(ending.code)}</small><h1 id="pcPilgrimageTitle">${escapeHTML(ending.title)}</h1><b>${escapeHTML(ending.status)}</b><p>${escapeHTML(ending.summary)}</p>
        <div class="pc-pilgrimage-ending-consequence"><span>관제 결과</span><p>${escapeHTML(ending.consequence)}</p></div><aside class="pc-pilgrimage-ending-boundary"><small>PLAYER VERDICT / NON-CANON BRANCH</small><p>${escapeHTML(current.canonBoundary)}</p></aside><dl>${metricStats}</dl>
        <div class="pc-pilgrimage-ending-actions">${verdict?`<button type="button" data-pilgrimage-open-verdict="${escapeHTML(verdict.id)}">복호화된 판정 기록 열기</button>`:''}<button type="button" data-pilgrimage-open-map>관제도에서 결과 확인</button><button type="button" data-pilgrimage-open-record="${escapeHTML(current.primaryRecord)}">관련 지역 기록 열기</button><button type="button" class="is-reset" data-pilgrimage-reset>${current.theme==='deadzone'?'현재 검문 진행 초기화':current.theme==='recovery'?'현재 회수 작전 초기화':'현재 순례 진행 초기화'}</button></div>
      </article>`;
    }

    function render(){
      const current=scenario();if(!current) return;
      const state=store.get(activeScenarioId);const summary=store.getSummary(activeScenarioId);
      overlay.dataset.scenario=activeScenarioId;overlay.dataset.theme=current.theme;overlay.dataset.status=summary.status;overlay.dataset.severity=severity(summary);
      overlay.innerHTML=`<div class="pc-pilgrimage-noise" aria-hidden="true"></div>
        <header class="pc-pilgrimage-shell-head"><div><small>${escapeHTML(current.channel)}</small><b>${escapeHTML(current.code)}</b></div><span>${escapeHTML(summary.status.toUpperCase())} · ${summary.progress}%</span><button type="button" aria-label="현장 화면 닫기" data-pilgrimage-close>×</button></header>
        <div class="pc-pilgrimage-shell"><aside class="pc-pilgrimage-telemetry">${renderMap(summary)}<div class="pc-pilgrimage-meters" style="--metric-count:${current.metrics.length}">${current.metrics.map(metric=>meter(metric,summary.metrics[metric.key])).join('')}</div><div class="pc-pilgrimage-log"><small>FIELD DECISION LOG</small>${state.choices.length?state.choices.map((entry,index)=>{const stageIndex=current.stages.findIndex(item=>item.id===entry.stage);const stage=store.getStage?.(activeScenarioId,stageIndex,state)||current.stages[stageIndex];const choice=stage?.choices.find(item=>item.id===entry.choice);const outcome=current.outcomeLabels?.[entry.ruleOutcome]||entry.ruleOutcome.toUpperCase();return `<span class="is-${escapeHTML(entry.ruleOutcome)}"><i>${String(index+1).padStart(2,'0')}</i><b>${escapeHTML(stage?.title||entry.stage)}</b><em>${escapeHTML(outcome)}</em><small>${escapeHTML(choice?.label||entry.choice)}</small></span>`;}).join(''):'<p>아직 현장 판단이 기록되지 않았다.</p>'}</div></aside>
        <main class="pc-pilgrimage-content">${pendingFeedback?renderFeedback():summary.status==='idle'?renderIntro(summary):summary.status==='complete'?renderEnding(summary):renderStage(state)}</main></div>`;
      resetArmed=false;
    }

    function open(id=activeScenarioId){
      if(!data.scenarios?.[id]) return false;
      const access=accessFor(id);
      if(!access.allowed){
        root.ProjectCurseAudioControl?.play?.('screening.mismatch');
        document.dispatchEvent(new CustomEvent('projectcurse:pilgrimage-access-denied',{detail:{scenarioId:id,requirement:access.requirement}}));
        return false;
      }
      activeScenarioId=id;store.select(id);
      root.ProjectCurseAudioControl?.setProfile?.(id==='deadzone-recovery'?'recovery-scenario':'scenario');
      if(!openState){previousFocus=document.activeElement;openState=true;overlay.hidden=false;document.body.classList.add('pc-pilgrimage-open');document.getElementById('app')?.setAttribute('inert','');root.ProjectCurseAudioControl?.play?.(id==='deadzone-recovery'?'recovery.enter':id==='deadzone-return'?'screening.enter':'pilgrimage.enter');}
      render();root.setTimeout(()=>overlay.querySelector('button,[tabindex]')?.focus({preventScroll:true}),40);return true;
    }
    function close(){
      if(!openState) return;
      openState=false;pendingFeedback=null;root.clearTimeout(feedbackTimer);overlay.hidden=true;document.body.classList.remove('pc-pilgrimage-open');document.getElementById('app')?.removeAttribute('inert');
      root.ProjectCurseAudioControl?.play?.(activeScenarioId==='deadzone-recovery'?'recovery.exit':activeScenarioId==='deadzone-return'?'screening.exit':'pilgrimage.exit');
      root.ProjectCurseAudioControl?.setProfile?.(document.body?.dataset?.route||'map-room');
      try{previousFocus?.focus({preventScroll:true});}catch(_error){}
    }
    async function openRecord(recordId){close();await root.ProjectCurseShell?.navigate?.('archive-entry',{replace:false,historyMode:'push'});root.ProjectCurseRuntimeModules?.archiveIndex?.open?.(recordId);}
    function openMap(){
      const target=scenario()?.mapTarget;close();
      root.ProjectCurseShell?.navigate?.('map-room',{replace:false,historyMode:'push'}).then(()=>root.ProjectCurseMapRoomRuntime?.showDetail?.(target.detail,target.site));
    }

    overlay.addEventListener('click',event=>{
      const control=event.target.closest('button');if(!control) return;
      if(control.dataset.pilgrimageClose!==undefined){close();return;}
      if(control.dataset.pilgrimageStart!==undefined){store.start(activeScenarioId);root.ProjectCurseAudioControl?.play?.(activeScenarioId==='deadzone-recovery'?'recovery.tether':activeScenarioId==='deadzone-return'?'screening.step':'pilgrimage.step');render();return;}
      if(control.dataset.pilgrimageChoice){
        const current=scenario();const before=store.get(activeScenarioId);const stage=store.getStage?.(activeScenarioId,before.step,before)||current.stages[before.step];const choice=stage?.choices.find(item=>item.id===control.dataset.pilgrimageChoice);
        if(!choice||!store.choose(control.dataset.pilgrimageChoice,activeScenarioId)) return;
        const after=store.getSummary(activeScenarioId);
        const danger=choice?.tone==='danger'||choice?.tone==='risk';
        const cue=activeScenarioId==='deadzone-recovery'?(danger?'recovery.echo':choice.ruleOutcome==='contained'?'recovery.contain':'recovery.tether'):activeScenarioId==='deadzone-return'?(danger?'screening.mismatch':'screening.step'):(danger?'pilgrimage.danger':'pilgrimage.step');
        root.ProjectCurseAudioControl?.play?.(cue);
        pendingFeedback={stage,choice,before,after};render();
        root.clearTimeout(feedbackTimer);feedbackTimer=root.setTimeout(()=>{pendingFeedback=null;if(openState){if(after.status==='complete') root.ProjectCurseAudioControl?.play?.(activeScenarioId==='deadzone-recovery'?'recovery.complete':activeScenarioId==='deadzone-return'?'screening.complete':'pilgrimage.complete');render();}},after.status==='complete'?1350:1050);return;
      }
      if(control.dataset.pilgrimageOpenRecord){openRecord(control.dataset.pilgrimageOpenRecord);return;}
      if(control.dataset.pilgrimageOpenVerdict){openRecord(control.dataset.pilgrimageOpenVerdict);return;}
      if(control.dataset.pilgrimageOpenMap!==undefined){openMap();return;}
      if(control.dataset.pilgrimageReset!==undefined){
        const resetLabel=scenario().theme==='deadzone'?'현재 검문 진행 초기화':scenario().theme==='recovery'?'현재 회수 작전 초기화':'현재 순례 진행 초기화';
        if(!resetArmed){resetArmed=true;control.dataset.confirmReset='1';control.textContent='한 번 더 누르면 현재 진행이 초기화됩니다';root.setTimeout(()=>{resetArmed=false;if(control.isConnected){delete control.dataset.confirmReset;control.textContent=resetLabel;}},3200);return;}
        pendingFeedback=null;root.clearTimeout(feedbackTimer);store.reset(activeScenarioId);root.ProjectCurseAudioControl?.play?.('pilgrimage.exit');render();
      }
    });
    document.addEventListener('keydown',event=>{if(openState&&event.key==='Escape'){event.preventDefault();close();}});
    document.addEventListener('projectcurse:pilgrimage-state-change',event=>{if(openState&&event.detail?.scenarioId===activeScenarioId) render();});

    root.ProjectCursePilgrimageRuntime=Object.freeze({open,close,isOpen:()=>openState,render,accessFor,getScenario:()=>scenario(),getActiveScenarioId:()=>activeScenarioId});
  });
})(window);
