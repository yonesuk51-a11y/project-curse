// Project Curse 5.23.2 — immersive pilgrimage scenario presentation and interaction.
(function(root){
  'use strict';

  const ready=callback=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',callback,{once:true}):callback();
  const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  ready(function(){
    const data=root.ProjectCursePilgrimageData;
    const store=root.ProjectCursePilgrimageState;
    const scenario=data?.scenarios?.[store?.scenarioId];
    if(!scenario||!store) return;

    const overlay=document.createElement('section');
    overlay.className='pc-pilgrimage';
    overlay.hidden=true;
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-labelledby','pcPilgrimageTitle');
    document.body.append(overlay);
    let openState=false;
    let resetArmed=false;
    let previousFocus=null;

    const polyline=points=>(points||[]).map(point=>point.join(',')).join(' ');
    const severity=summary=>summary.corruption>=55||summary.signal<=35?'critical':summary.corruption>=28||summary.fear>=58?'unstable':'nominal';
    const meter=(label,value,tone)=>`<div class="pc-pilgrimage-meter is-${tone}"><span>${escapeHTML(label)}</span><b>${String(value).padStart(2,'0')}%</b><i><em style="--pilgrimage-meter:${value}%"></em></i></div>`;

    function renderMap(summary){
      const points=scenario.map.points;
      const activeCount=summary.status==='idle'?1:Math.max(1,Math.min(points.length,summary.completed+1));
      const travelled=points.slice(0,activeCount);
      return `<div class="pc-pilgrimage-map" aria-label="서부 순례 경로 진행도">
        <svg viewBox="${escapeHTML(scenario.map.viewBox)}" role="img" aria-label="외곽 관측소에서 불빛 없는 성채까지 이어지는 순례 경로">
          <defs><pattern id="pc-pilgrim-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30"></path></pattern><filter id="pc-pilgrim-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="blur"></feGaussianBlur><feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs>
          <rect class="pc-pilgrimage-map-grid" width="900" height="420"></rect>
          <path class="pc-pilgrimage-canopy" d="M0 71 C133 11 231 92 354 48 S583 88 699 37 828 62 900 30 L900 420 0 420Z"></path>
          <path class="pc-pilgrimage-river" d="M428 0 C392 98 507 145 459 222 S446 334 514 420"></path>
          <polyline class="pc-pilgrimage-route-ghost" points="${polyline(points)}"></polyline>
          ${travelled.length>1?`<polyline class="pc-pilgrimage-route-live" points="${polyline(travelled)}"></polyline>`:''}
          ${points.map((point,index)=>{const phase=index<summary.completed?'is-passed':index===summary.step&&summary.status==='active'?'is-current':summary.status==='complete'&&index===points.length-1?'is-current':'is-locked';return `<g class="pc-pilgrimage-map-point ${phase}" transform="translate(${point[0]} ${point[1]})"><circle r="${phase==='is-current'?10:7}"></circle><i></i><text x="${index<4?14:-14}" y="-13" text-anchor="${index<4?'start':'end'}">${String(index+1).padStart(2,'0')} · ${escapeHTML(scenario.map.labels[index])}</text></g>`;}).join('')}
        </svg>
        <div><span>ROUTE INTEGRITY</span><b>${summary.signal}%</b><i>${summary.completed}/${summary.total} TRACE</i></div>
      </div>`;
    }

    function renderIntro(summary){
      const resume=summary.status!=='idle';
      return `<article class="pc-pilgrimage-intro">
        <div class="pc-pilgrimage-intro-code"><i></i><span>${escapeHTML(scenario.code)}</span><b>VOLUNTARY ENTRY / NO RETURN GUARANTEE</b></div>
        <h1 id="pcPilgrimageTitle">${escapeHTML(scenario.title)}</h1>
        <p>${escapeHTML(scenario.summary)}</p>
        <dl><div><dt>권역</dt><dd>${escapeHTML(scenario.region)}</dd></div><div><dt>연결 사건</dt><dd>${escapeHTML(scenario.incident.toUpperCase())}</dd></div><div><dt>현재 상태</dt><dd>${resume?escapeHTML(summary.status.toUpperCase()):'NOT STARTED'}</dd></div><div><dt>진행도</dt><dd>${summary.progress}%</dd></div></dl>
        <div class="pc-pilgrimage-directive"><b>PILGRIM DIRECTIVE</b><p>${escapeHTML(scenario.directive)}</p></div>
        <div class="pc-pilgrimage-intro-actions"><button type="button" data-pilgrimage-start>${resume?'순례 기록 재개':'순례 개시'}</button><button type="button" data-pilgrimage-open-record="Pilgrim_Rules_GBF">순례자의 규칙 확인</button></div>
      </article>`;
    }

    function renderStage(state,summary){
      const stage=scenario.stages[state.step];
      return `<article class="pc-pilgrimage-stage" data-stage="${escapeHTML(stage.id)}">
        <header><div><small>${escapeHTML(stage.code)} / ${escapeHTML(stage.time)}</small><h1 id="pcPilgrimageTitle">${escapeHTML(stage.title)}</h1><p>${escapeHTML(stage.location)}</p></div><span>${state.step+1} / ${scenario.stages.length}</span></header>
        <div class="pc-pilgrimage-transmission"><i></i><span>${escapeHTML(stage.signal)}</span></div>
        <p class="pc-pilgrimage-narrative">${escapeHTML(stage.narrative)}</p>
        <aside class="pc-pilgrimage-rule"><small>${escapeHTML(stage.rule.code)}</small><b>${escapeHTML(stage.rule.text)}</b></aside>
        <div class="pc-pilgrimage-choices" aria-label="현장 판단 선택">${stage.choices.map((choice,index)=>`<button type="button" class="is-${escapeHTML(choice.tone)}" data-pilgrimage-choice="${escapeHTML(choice.id)}"><i>${String(index+1).padStart(2,'0')}</i><span><b>${escapeHTML(choice.label)}</b><small>${escapeHTML(choice.description)}</small></span><em>선택 ›</em></button>`).join('')}</div>
      </article>`;
    }

    function renderEnding(state,summary){
      const ending=store.getEnding();
      const kept=Math.max(0,summary.completed-summary.violations);
      return `<article class="pc-pilgrimage-ending is-${escapeHTML(ending.tone)}">
        <small>${escapeHTML(ending.code)}</small><h1 id="pcPilgrimageTitle">${escapeHTML(ending.title)}</h1><b>${escapeHTML(ending.status)}</b>
        <p>${escapeHTML(ending.summary)}</p>
        <div class="pc-pilgrimage-ending-consequence"><span>관제 결과</span><p>${escapeHTML(ending.consequence)}</p></div>
        <dl><div><dt>준수 규칙</dt><dd>${kept} / ${summary.total}</dd></div><div><dt>규칙 위반</dt><dd>${summary.violations}</dd></div><div><dt>오염도</dt><dd>${summary.corruption}%</dd></div><div><dt>최종 신호</dt><dd>${summary.signal}%</dd></div></dl>
        <div class="pc-pilgrimage-ending-actions"><button type="button" data-pilgrimage-open-map>결과가 반영된 관제도 보기</button><button type="button" data-pilgrimage-open-record="Great_Black_Forest_Region">대흑림 기록 열기</button><button type="button" class="is-reset" data-pilgrimage-reset>순례 기록 초기화</button></div>
      </article>`;
    }

    function render(){
      const state=store.get();
      const summary=store.getSummary();
      overlay.dataset.status=summary.status;
      overlay.dataset.severity=severity(summary);
      overlay.innerHTML=`
        <div class="pc-pilgrimage-noise" aria-hidden="true"></div>
        <header class="pc-pilgrimage-shell-head"><div><small>U.A.C FIELD PILGRIMAGE CHANNEL</small><b>${escapeHTML(scenario.code)}</b></div><span>${escapeHTML(summary.status.toUpperCase())} · ${summary.progress}%</span><button type="button" aria-label="순례 화면 닫기" data-pilgrimage-close>×</button></header>
        <div class="pc-pilgrimage-shell">
          <aside class="pc-pilgrimage-telemetry">${renderMap(summary)}<div class="pc-pilgrimage-meters">${meter('FEAR',summary.fear,'fear')}${meter('CORRUPTION',summary.corruption,'corruption')}${meter('SIGNAL',summary.signal,'signal')}</div><div class="pc-pilgrimage-log"><small>FIELD LOG</small>${state.choices.length?state.choices.map((entry,index)=>{const stage=scenario.stages.find(item=>item.id===entry.stage);const choice=stage?.choices.find(item=>item.id===entry.choice);return `<span class="is-${entry.ruleOutcome}"><i>${String(index+1).padStart(2,'0')}</i><b>${escapeHTML(stage?.title||entry.stage)}</b><em>${entry.ruleOutcome==='kept'?'RULE KEPT':'RULE BROKEN'}</em><small>${escapeHTML(choice?.label||entry.choice)}</small></span>`;}).join(''):'<p>아직 현장 판단이 기록되지 않았다.</p>'}</div></aside>
          <main class="pc-pilgrimage-content">${summary.status==='idle'?renderIntro(summary):summary.status==='complete'?renderEnding(state,summary):renderStage(state,summary)}</main>
        </div>`;
      resetArmed=false;
    }

    function open(){
      if(openState) return true;
      previousFocus=document.activeElement;
      openState=true;overlay.hidden=false;
      document.body.classList.add('pc-pilgrimage-open');
      document.getElementById('app')?.setAttribute('inert','');
      render();
      root.ProjectCurseAudioControl?.play?.('pilgrimage.enter');
      root.setTimeout(()=>overlay.querySelector('button,[tabindex]')?.focus({preventScroll:true}),40);
      return true;
    }
    function close(){
      if(!openState) return;
      openState=false;overlay.hidden=true;
      document.body.classList.remove('pc-pilgrimage-open');
      document.getElementById('app')?.removeAttribute('inert');
      root.ProjectCurseAudioControl?.play?.('pilgrimage.exit');
      try{previousFocus?.focus({preventScroll:true});}catch(_error){}
    }
    async function openRecord(recordId){
      close();
      await root.ProjectCurseShell?.navigate?.('archive-entry',{replace:false,historyMode:'push'});
      root.ProjectCurseRuntimeModules?.archiveIndex?.open?.(recordId);
    }

    overlay.addEventListener('click',event=>{
      const control=event.target.closest('button');
      if(!control) return;
      if(control.dataset.pilgrimageClose!==undefined){close();return;}
      if(control.dataset.pilgrimageStart!==undefined){store.start();root.ProjectCurseAudioControl?.play?.('pilgrimage.step');render();return;}
      if(control.dataset.pilgrimageChoice){
        const before=store.getSummary();
        const choice=scenario.stages[store.get().step]?.choices.find(item=>item.id===control.dataset.pilgrimageChoice);
        if(!store.choose(control.dataset.pilgrimageChoice)) return;
        root.ProjectCurseAudioControl?.play?.(choice?.tone==='danger'||choice?.tone==='risk'?'pilgrimage.danger':'pilgrimage.step');
        if(before.status!=='complete'&&store.getSummary().status==='complete') root.ProjectCurseAudioControl?.play?.('pilgrimage.complete');
        render();return;
      }
      if(control.dataset.pilgrimageOpenRecord){openRecord(control.dataset.pilgrimageOpenRecord);return;}
      if(control.dataset.pilgrimageOpenMap!==undefined){close();root.ProjectCurseShell?.navigate?.('map-room',{replace:false,historyMode:'push'}).then(()=>root.ProjectCurseMapRoomRuntime?.showDetail?.('gbf-western-marches','gbf-unlit-fortress'));return;}
      if(control.dataset.pilgrimageReset!==undefined){
        if(!resetArmed){resetArmed=true;control.dataset.confirmReset='1';control.textContent='한 번 더 눌러 초기화 확인';root.setTimeout(()=>{resetArmed=false;if(control.isConnected){delete control.dataset.confirmReset;control.textContent='순례 기록 초기화';}},2600);return;}
        store.reset();root.ProjectCurseAudioControl?.play?.('pilgrimage.exit');render();
      }
    });
    document.addEventListener('keydown',event=>{if(openState&&event.key==='Escape'){event.preventDefault();close();}});
    document.addEventListener('projectcurse:pilgrimage-state-change',()=>{if(openState) render();});

    root.ProjectCursePilgrimageRuntime=Object.freeze({open,close,isOpen:()=>openState,render,getScenario:()=>scenario});
  });
})(window);
