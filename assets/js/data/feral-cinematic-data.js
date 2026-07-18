// MapPatch 5.15.2cf — cinematic page adapter for the restored Feral report.
(function(root){
  'use strict';
  const documentData=root.ProjectCurseArchiveDocuments?.documents?.Ferals_860722;
  if(!documentData) return;

  const asset=src=>String(src||'').replace(/^\.\.\/\.\.\//,'');
  const compact=value=>String(value||'').replace(/\s+/g,' ').trim();
  const sectionByTitle=title=>documentData.sections.find(section=>section.title===title);
  const entityPage=(group,groupKey,index)=>{
    const values=group.table?.rows?.[0]||[];
    const titleParts=group.title.split('/').map(compact);
    const descriptions=(group.paragraphs||[]).map(compact).filter(Boolean);
    const responses=(group.items||[]).map(compact).filter(Boolean);
    const report=group.sourceOnly?descriptions:[
      values[0]?`분류 — ${values[0]}`:'',
      values[1]?`위험 및 주요 구역 — ${values[1]} / ${values[2]||'기록 없음'}`:'',
      descriptions[0]?`개체 개요 — ${descriptions[0]}`:'',
      descriptions[1]?`식별 단서 — ${descriptions[1]}`:'',
      responses.length?`현장 대응 — ${responses.join(' / ')}`:''
    ].filter(Boolean);
    return {
      group:groupKey,
      code:`ENTITY FRAME / ${String(index+1).padStart(2,'0')}`,
      title:titleParts[0],
      subtitle:titleParts.slice(1).join(' / '),
      image:asset(group.image?.src),
      frame:group.image?.caption||`RECOVERED ENTITY FRAME / ${String(index+1).padStart(2,'0')}`,
      imageCode:(group.image?.caption||'ENTITY TRACE').split('/').pop().trim(),
      layout:'evidenceCenter',
      caption:group.image?.caption||'',
      lineDelay:900,
      report
    };
  };
  const chapterPage=(section,groupKey,code,title,subtitle,count)=>({
    group:groupKey,code,title,subtitle,
    frame:`FERAL CLASSIFICATION / ${String(count).padStart(2,'0')} CONFIRMED FILES`,
    image:asset(section?.image?.src),layout:section?.image?'twoColumn':'briefText',lineDelay:900,
    lines:(section?.paragraphs||[]).map(compact).filter(Boolean)
  });

  const classification=sectionByTitle('단순화 분류 구조');
  const ferals=sectionByTitle('Ferals / 괴이');
  const superiors=sectionByTitle('Superiors / 상위체');
  const artificial=sectionByTitle('Unusuals / Artificial');
  const hybrid=sectionByTitle('Unusuals / Hybrid');
  const entityPages=[
    ...(ferals?.groups||[]).map((group,index)=>entityPage(group,'ferals',index)),
    ...(artificial?.groups||[]).map((group,index)=>entityPage(group,'artificial',index+11)),
    ...(hybrid?.groups||[]).map((group,index)=>entityPage(group,'hybrid',index+13)),
    ...(superiors?.groups||[]).map((group,index)=>entityPage(group,'superiors',index+15))
  ];

  root.ProjectCurseFeralCinematic=Object.freeze({
    record:'Ferals_860722',
    bgm:'assets/audio/pc5152cf_feral_dying_memories_bgm.mp3',
    pages:Object.freeze([
      {
        group:'warning',code:'CLASSIFIED MATERIAL / NOTICE',title:'WARNING',
        subtitle:'열람 경고',frame:'U.A.C CLASSIFICATION OFFICE / RESTRICTED COPY',
        layout:'warningNotice',lineDelay:900,lines:[
          '본 괴이 목록은 현장 자료가 부족하거나 분류가 잘못되었을 가능성이 있다. 모든 항목은 잠정 기록으로 취급한다.',
          '이 문서는 기밀 정보를 포함한다. 단독 열람 또는 승인된 인원의 동석하에 열람할 것.',
          '분류 내용에 의문이 있을 경우 키무라 쿄 또는 U.A.C 개체 분류실에 직접 보고한다.'
        ]
      },
      {
        group:'feral_system',code:'CLASSIFICATION MAP / RESTORED',title:'단순화 분류 구조',hideTitle:true,
        image:asset(classification?.image?.src),frame:'SIMPLIFIED CLASSIFICATION / 1997.01.27',
        layout:'classificationChart',caption:'괴이 단순화 분류도',
        credit:'작성자 — 키무라 쿄',lineDelay:900,lines:[]
      },
      chapterPage(ferals,'ferals','CHAPTER 01 / FERALS','괴이','본능·섭식·추적 반응을 우선하는 개체군',10),
      ...entityPages.filter(page=>page.group==='ferals'),
      ...entityPages.filter(page=>page.group==='artificial'),
      ...entityPages.filter(page=>page.group==='hybrid'),
      ...entityPages.filter(page=>page.group==='superiors'),
      {
        group:'return',code:'END OF RECORD / FERAL-CLASSIFICATION',title:'기록보관소로 복귀',
        subtitle:'분류 보고서 열람 종료',frame:'U.A.C RECOVERED ARCHIVE / END',layout:'endCard',lineDelay:900,
        lines:['확인 개체 15종의 기록면을 모두 재생했습니다.','판정이 끝나지 않은 개체는 후속 회수 기록에서 계속 추적합니다.','입력 시 기록보관소 목록으로 복귀합니다.']
      }
    ])
  });
})(window);
