// MapPatch 5.15.2ce — visible terminology and organization reconciliation
(function(){
  'use strict';
  const canon=window.ProjectCurseCanon;
  if(!canon) return;
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const ready=(fn)=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',fn,{once:true})
    : fn();
  const LOCKED='[data-record="Cults_871104"],[data-record="Immortality_860201"]';
  const replacements=[
    [/Urban Anomaly Control/g,'United Nations Anomaly Containment'],
    [/Urban Anomaly Containment/g,'United Nations Anomaly Containment'],
    [/Urban Anomaly 봉쇄/g,'United Nations Anomaly Containment'],
    [/Ushnoda Cult/g,'우시노다교'],
    [/\bAmarion\b/g,'아마리온'],
    [/신디케이트는/g,'S.O.N은'],[/신디케이트가/g,'S.O.N이'],[/신디케이트를/g,'S.O.N을'],
    [/신디케이트와/g,'S.O.N과'],[/신디케이트의/g,'S.O.N의'],[/신디케이트에/g,'S.O.N에'],[/신디케이트/g,'S.O.N'],
    [/하이문은/g,'P.O.H는'],[/하이문이/g,'P.O.H가'],[/하이문을/g,'P.O.H를'],
    [/하이문과/g,'P.O.H와'],[/하이문의/g,'P.O.H의'],[/하이문에/g,'P.O.H에'],[/하이문/g,'P.O.H'],
    [/불멸을 향하여/g,'불멸을 향해']
  ];

  function replaceText(root){
    if(!root || root.matches?.(LOCKED) || root.closest?.(LOCKED)) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const parent=node.parentElement;
      if(!parent || parent.closest(LOCKED) || parent.closest('[data-pc-faction-owner="1"]') || ['SCRIPT','STYLE'].includes(parent.tagName)) return;
      let value=node.nodeValue||'';
      replacements.forEach(([pattern,next])=>{value=value.replace(pattern,next);});
      if(value!==node.nodeValue) node.nodeValue=value;
    });
  }

  const tileMeta={
    uac:['U.A.C','초국가 격리기구','institution'],
    nhc:['N.H.C','독립 현장 대응','field'],
    sid:['S.I.D','특수 조사·감청','institution'],
    fhc:['F.H.C','정부 계약 기반 연구·기술 복합기업','corporate'],
    amarion:['아마리온','F.H.C의 전신 기업','corporate'],
    syndicate:['S.O.N','Shadow Of Nemesis','rogue'],
    ushinoda:['우시노다교','세 파벌 교단','cult'],
    haimun:['P.O.H','Power Of Haimun','rogue'],
    ashcrew:['Ash Crew','N.H.C 산하 사후 대응조직','field'],
    arf:['A.R.F','Ash Crew 산하 회수조직','field'],
    cpd:['C.P.D','Ash Crew 산하 민간 분리·대피조직','field']
  };

  function reconcileTiles(){
    Object.entries(tileMeta).forEach(([key,[name,sub,cat]])=>{
      const tile=q(`#faction-info .faction-tile[data-key="${key}"]`);
      if(!tile) return;
      tile.dataset.pc5152bcFactionCat=cat;
      tile.dataset.pc5152bxTags=(canon.factionTags[key]||[cat]).join(' ');
      const img=q('img',tile), title=q('span',tile), small=q('small',tile), tag=q('.pc5152bx-tagline',tile);
      if(img && img.alt!==name) img.alt=name;
      if(title && title.textContent!==name) title.textContent=name;
      if(small && small.textContent!==sub) small.textContent=sub;
      if(tag && tag.textContent) tag.textContent='';
    });
  }

  function reconcileHeaders(){
    const factionTitle=q('#faction-info>h2');
    if(factionTitle && factionTitle.textContent!=='세력 파일 / 조직 기록') factionTitle.textContent='세력 파일 / 조직 기록';
    const archiveTitle=q('#archive-entry>h2');
    if(archiveTitle && archiveTitle.textContent!=='기록보관소 / 원본 기록 색인') archiveTitle.textContent='기록보관소 / 원본 기록 색인';
    const factionSmall=q('#faction-info .pc5152bc-hub-head small');
    if(factionSmall && factionSmall.textContent!=='권한 승인된 조직 기록.') factionSmall.textContent='권한 승인된 조직 기록.';
    const archiveSmall=q('#archive-entry .pc5152bc-hub-head small');
    if(archiveSmall && archiveSmall.textContent!=='사건·세력·현상·작전 원본 색인.') archiveSmall.textContent='사건·세력·현상·작전 원본 색인.';
  }

  function apply(){
    document.body?.classList.add('pc5152ce-canon-reconciled');
    reconcileTiles();
    reconcileHeaders();
    ['history','faction-info','archiveListWrap']
      .map(id=>document.getElementById(id)).filter(Boolean).forEach(replaceText);
  }

  function check(){
    const issues=[];
    const uac=canon.factions.uac;
    const haimun=canon.factions.haimun;
    if(canon.official.uacEnglish!=='United Nations Anomaly Containment') issues.push({level:'error',code:'UAC_NAME',message:'U.A.C 영문 공식명 불일치'});
    if(haimun.name!=='P.O.H' || haimun.cat==='교단') issues.push({level:'error',code:'HAIMUN_CLASS',message:'P.O.H 표기 또는 분류 불일치'});
    const hierarchy=canon.ushinodaHierarchy;
    if(!hierarchy || hierarchy.factions.join('·')!=='타락교·혈교·그림자교' || hierarchy.lordsPerFaction!==1 || hierarchy.apostlesPerFaction!==4 || hierarchy.apostlesTotal!==12){
      issues.push({level:'error',code:'USHINODA_HIERARCHY',message:'우시노다교 세 파벌·로드·사도 구조 불일치'});
    }
    const badRelations=canon.relations.filter(r=>
      (r.a==='uac'&&r.b==='nhc'&&/지휘|통제/.test(r.label)) ||
      ([r.a,r.b].includes('haimun')&&[r.a,r.b].includes('ushinoda')&&/하위/.test(r.label))
    );
    badRelations.forEach(r=>issues.push({level:'error',code:'RELATION_CANON',message:`${r.a}-${r.b}: ${r.label}`}));
    const tile=q('#faction-info .faction-tile[data-key="haimun"]');
    if(tile && /cult/.test(tile.dataset.pc5152bxTags||'')) issues.push({level:'error',code:'HAIMUN_TILE_CULT',message:'하이문 타일이 교단 필터에 남음'});
    return {name:'canonReconciliation',patch:'5.15.2ce',ok:issues.length===0,entities:Object.keys(canon.factions).length,relations:canon.relations.length,unresolved:canon.unresolved,issues};
  }

  ready(()=>{
    apply();
    let queued=false;
    const schedule=()=>{
      if(queued) return;
      queued=true;
      requestAnimationFrame(()=>{queued=false;apply();});
    };
    ['faction-info','archive-entry'].map(id=>document.getElementById(id)).filter(Boolean)
      .forEach(root=>{try{new MutationObserver(schedule).observe(root,{childList:true,subtree:true});}catch(_e){}});
    window.ProjectCurseRuntimeModules=window.ProjectCurseRuntimeModules||{};
    window.ProjectCurseRuntimeModules.canonReconciliation={owner:'assets/js/pages/canon-reconciliation.js',apply,check};
  });
})();
