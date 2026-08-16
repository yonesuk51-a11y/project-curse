// Project Curse 5.22.0 — live terminal-home intelligence and operation resume owner.
(function(root){
  'use strict';

  const ready=callback=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',callback,{once:true})
    : callback();
  const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[char]));

  ready(function(){
    const home=document.getElementById('terminal-home');
    const feed=root.ProjectCurseHomeIntelligence;
    const incidents=root.ProjectCurseIncidentNetwork;
    const archive=root.ProjectCurseArchive;
    const map=root.ProjectCurseMapRoom;
    const operationState=root.ProjectCurseOperationState;
    if(!home||!feed) return;

    const incident=incidents?.getIncident?.(feed.alert.incident);
    const records=archive?.publicRecords?.length||0;
    const operations=map?.operations?.length||0;
    const regions=Math.max(0,(map?.regions?.length||1)-1);
    const unresolved=incidents?.incidentList?.filter(item=>!['HISTORICAL','ARCHIVED'].includes(item.status)).length||0;

    function render(){
      const operation=operationState?.getSummary?.()||{recovered:0,total:3,mapStep:0,status:'analysis',decision:null};
      const decision=operation.decision;
      const strip=home.querySelector('.pc-terminal-system-strip');
      if(strip) strip.innerHTML=`
        <span><small>NETWORK</small><b>ISOLATED</b></span>
        <span><small>ARCHIVE</small><b>${records} OPEN</b></span>
        <span><small>OPERATIONS</small><b>${operations} ACTIVE</b></span>
        <span><small>UNRESOLVED</small><b>${unresolved} SIGNALS</b></span>`;

      const primary=home.querySelector('.pc-terminal-primary p');
      if(primary) primary.textContent=`${regions}개 관제 권역, ${operations}개 특수 작전과 ${records}개 공개 기록을 하나의 사건망에서 통합 열람한다.`;

      const alertTitle=decision?.title||feed.alert.title;
      const alertPriority=decision?(operation.status==='deferred'?'DECISION DEFERRED':'VERDICT RECORDED'):feed.alert.priority;
      const alertCopy=decision?.summary||(operation.recovered
        ? `부서진 왕관 정보 경로 ${operation.recovered}/${operation.total}개가 복구됐다. 지휘 판단은 아직 확정되지 않았다.`
        : incident?.summary||'남방 해안권에서 상충하는 지휘 신호가 감지됐다.');
      const alertAction=decision?'작전 결과 지도 열기':operation.recovered?'작전 분석 재개':feed.alert.action;
      const alert=home.querySelector('.pc-terminal-alert');
      if(alert){
        alert.dataset.operationStatus=operation.status;
        alert.innerHTML=`
          <header><small>CURRENT ALERT / ${escapeHTML(incident?.code||feed.alert.incident)}</small><b>${escapeHTML(alertTitle)}</b><span>${escapeHTML(alertPriority)}</span></header>
          <p>${escapeHTML(alertCopy)}</p>
          <dl>
            <div><dt>정보 회수</dt><dd>${operation.recovered} / ${operation.total}</dd></div>
            <div><dt>작전 단계</dt><dd>${operation.mapStep+1} / 6</dd></div>
            <div><dt>판단 상태</dt><dd>${escapeHTML(decision?.status||feed.alert.threat)}</dd></div>
          </dl>
          <a data-uac-route="map-room" data-uac-map-operation="${escapeHTML(feed.alert.operation)}" href="#map-room">${escapeHTML(alertAction)}&nbsp;›</a>`;
      }

      const signals=feed.signals.map((signal,index)=>index!==0?signal:{
        ...signal,
        label:decision?`부서진 왕관 · ${decision.title}`:operation.recovered?`부서진 왕관 정보 ${operation.recovered}/${operation.total} 복구`:signal.label,
        status:decision?(operation.status==='deferred'?'DEFERRED':'VERDICT SAVED'):operation.recovered?'ANALYSIS':signal.status,
        tone:decision?(operation.status==='deferred'?'unstable':'recovered'):signal.tone
      });
      const recent=home.querySelector('.pc-terminal-recent');
      if(recent){
        recent.innerHTML=`<header><small>LIVE INTELLIGENCE FEED</small><b>최근 수신</b><span>${signals.length} CHANNELS</span></header>${signals.map(signal=>{
        const attributes=[`data-uac-route="${escapeHTML(signal.route)}"`];
        if(signal.operation) attributes.push(`data-uac-map-operation="${escapeHTML(signal.operation)}"`);
        if(signal.record) attributes.push(`data-uac-archive-record="${escapeHTML(signal.record)}"`);
        return `<a ${attributes.join(' ')} data-signal-tone="${escapeHTML(signal.tone)}" href="#${escapeHTML(signal.route)}"><time>${escapeHTML(signal.time)}</time><span>${escapeHTML(signal.label)}</span><em>${escapeHTML(signal.status)}</em><i aria-hidden="true"></i></a>`;
      }).join('')}`;
      }
      home.dataset.operationProgress=`${operation.recovered}-${operation.verdict||'pending'}`;
    }

    render();
    document.addEventListener('projectcurse:operation-state-change',render);
    home.dataset.intelligenceReady='true';
    root.ProjectCurseHomeRuntime=Object.freeze({
      refresh:render,
      getSnapshot:()=>({records,operations,regions,unresolved,signals:feed.signals.length,operation:operationState?.getSummary?.()||null})
    });
  });
})(window);
