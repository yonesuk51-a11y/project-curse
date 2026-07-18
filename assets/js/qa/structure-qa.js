// MapPatch 5.15.2ce — structure, canon and protected-scope QA
(function(){
  'use strict';
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const ready=(fn)=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',fn,{once:true})
    : fn();

  function issue(level,code,message,evidence){return {level,code,message,evidence:evidence??null};}
  function checkStructureOwnership(){
    const structure=window.ProjectCurseStructure;
    const modules=window.ProjectCurseRuntimeModules||{};
    const issues=[];
    if(!structure) issues.push(issue('error','MANIFEST_MISSING','공통 구조 매니페스트 누락'));
    if(!window.ProjectCurseCanon) issues.push(issue('error','CANON_REGISTRY_MISSING','공식 설정 레지스트리 누락'));
    ['menuAudio','sharedDeclutter','canonReconciliation','archiveConsolidation'].forEach(name=>{
      if(!modules[name]) issues.push(issue('error','MODULE_MISSING',`${name} 소유 모듈 누락`));
    });
    return {name:'structureOwnership',patch:'5.15.2cf',ok:issues.length===0,version:structure?.version||null,owners:structure?.owners||null,issues};
  }

  function checkCanonReconciliation(){
    const runtime=window.ProjectCurseRuntimeModules?.canonReconciliation;
    if(runtime?.check) return runtime.check();
    return {name:'canonReconciliation',patch:'5.15.2ce',ok:false,issues:[issue('error','CANON_CHECK_MISSING','설정 정합화 검사 누락')]};
  }
  function checkDeclutterUI(){
    const runtime=window.ProjectCurseRuntimeModules?.sharedDeclutter;
    if(runtime?.check) return runtime.check();
    return {name:'sharedDeclutter',patch:'5.15.2ce',ok:false,issues:[issue('error','DECLUTTER_CHECK_MISSING','정리 UI 검사 누락')]};
  }
  function checkMenuStateAudio(){
    const runtime=window.ProjectCurseRuntimeModules?.menuAudio;
    const current=runtime?.check?.()||null;
    const issues=[];
    if(!runtime) issues.push(issue('error','AUDIO_OWNER_MISSING','중앙 오디오 관리자 누락'));
    if(current?.mode==='RECORD' && !current.paused && current.volume>.005) issues.push(issue('error','RECORD_AMBIENT_LEAK','기록 열람 중 메뉴 환경음 재생'));
    return {name:'menuStateAudio',patch:'5.15.2cf',ok:issues.length===0,current,issues};
  }
  function checkArchiveConsolidation(){
    const runtime=window.ProjectCurseRuntimeModules?.archiveConsolidation;
    if(runtime?.check) return runtime.check();
    return {name:'archiveConsolidation',patch:'5.15.2cf',ok:false,issues:[issue('error','ARCHIVE_CONSOLIDATION_MISSING','대표 기록철 통합 모듈 누락')]};
  }

  function checkVisibleTerminology(){
    const issues=[];
    const roots=['history','faction-info','archiveListWrap'].map(id=>document.getElementById(id)).filter(Boolean);
    const text=roots.map(root=>root.innerText||'').join('\n');
    [
      ['OLD_UAC_CONTROL','Urban Anomaly Control'],
      ['OLD_UAC_MIXED','Urban Anomaly 봉쇄'],
      ['OLD_USHNODA','Ushnoda Cult'],
      ['OLD_HAIMUN','Haimun'],
      ['OLD_IMMORTALITY_TITLE','불멸을 향하여']
    ].forEach(([code,term])=>{if(text.includes(term)) issues.push(issue('error',code,`비잠금 화면에 이전 표기 잔존: ${term}`));});
    const haimun=q('#faction-info .faction-tile[data-key="haimun"]');
    if(haimun && (haimun.dataset.pc5152bcFactionCat==='cult'||/cult/.test(haimun.dataset.pc5152bxTags||''))) issues.push(issue('error','HAIMUN_CULT_FILTER','하이문이 교단 필터에 포함됨'));
    return {name:'visibleTerminology',ok:issues.length===0,roots:roots.length,issues};
  }

  function protectedRecordPresence(){
    const ids=(window.ProjectCurseStructure?.lockedRecords||[]).map(r=>r.id);
    const rows=ids.map(id=>({id,inline:!!q(`.record-detail[data-record="${id}"]`)}));
    const issues=rows.filter(row=>!row.inline).map(row=>issue('error','LOCKED_RECORD_MISSING',`${row.id} 인라인 기록 누락`));
    return {name:'protectedRecordPresence',ok:issues.length===0,rows,issues};
  }

  function organizationCanonSweep(){
    const checks=[checkStructureOwnership(),checkCanonReconciliation(),checkDeclutterUI(),checkArchiveConsolidation(),checkMenuStateAudio(),checkVisibleTerminology(),protectedRecordPresence()];
    const issues=checks.flatMap(check=>check.issues||[]);
    return {patch:'5.15.2cf',time:new Date().toISOString(),ok:issues.every(row=>row.level!=='error'),errors:issues.filter(row=>row.level==='error').length,warnings:issues.filter(row=>row.level==='warn').length,checks,issues};
  }
  function reportText(result=organizationCanonSweep()){
    const lines=[`[ProjectCurseQA OrganizationCanonSweep] ${result.patch} / ${result.time}`,`ok=${result.ok} errors=${result.errors} warnings=${result.warnings}`];
    result.checks.forEach(check=>lines.push(`${check.ok?'PASS':'FAIL'} ${check.name}`));
    result.issues.forEach(row=>lines.push(`${row.level.toUpperCase()} ${row.code}: ${row.message}`));
    return lines.join('\n');
  }

  ready(()=>{
    const old=window.ProjectCurseQA||{};
    window.ProjectCurseQA=Object.assign(old,{
      checkStructureOwnership,
      checkCanonReconciliation,
      checkDeclutterUI,
      checkArchiveConsolidation,
      checkMenuStateAudio,
      checkVisibleTerminology,
      organizationCanonSweep,
      organizationCanonReportText:reportText
    });
  });
})();
