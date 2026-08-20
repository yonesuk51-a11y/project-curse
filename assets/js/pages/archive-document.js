// Project Curse 5.43.0 — adaptive archive document, source provenance, local-verdict boundary, and verdict renderer.
(function(){
  'use strict';

  const documents=window.ProjectCurseArchiveDocuments?.documents||{};
  const documentFor=id=>documents[id]||window.ProjectCurseVerdictArchiveState?.getDocument?.(id)||null;
  const originalTitle=document.title;
  let currentId=null;
  let currentTrigger=null;
  let sectionObserver=null;
  let currentEvidenceItems=[];
  let evidenceViewer=null;
  let evidenceIndex=0;
  let evidenceTrigger=null;
  let evidenceRenderToken=0;

  const el=(tag,className,text)=>{
    const node=document.createElement(tag);
    if(className) node.className=className;
    if(text!==undefined) node.textContent=text;
    return node;
  };
  const markedTerms={
    'C.A.P-17':'cap','Ghost Channel':'ghost','Blood Gate':'blood','Dead Hour':'dead-hour',
    'Anchor Relay Node':'cap','Chrono Marker Flare':'cap','Field Sync Tablet':'cap','Ghost Channel Jammer':'ghost',
    'Gate Suppression Charge':'blood','Anti-Blood Cartridge':'blood','Anchor Flare':'cap',
    'White Salt Round':'white','Incendiary Containment Round':'ashcrew',
    'Green Zone':'green','White Zone':'white','Yellow Zone':'yellow','Red Zone':'red','Black Zone':'black',
    '그린존':'green','화이트존':'white','옐로우존':'yellow','레드존':'red','블랙존':'black',
    'U.A.C':'uac','N.H.C':'nhc','S.I.D':'sid','F.H.C':'fhc','A.R.F':'arf','C.P.D':'cpd','S.O.N':'son','P.O.H':'poh','Ash Crew':'ashcrew',
    '우시노다교':'cult','타락교':'cult','혈교':'blood','피의 호수':'blood','리버스':'rebirth','괴이':'feral',
    '대흑림':'feral','데드존':'black','몬수르 교회':'cult','짐승의 길':'odious','순례자':'wanderer','성위대':'cap',
    '아마리온':'amarion','레드울프':'redwolf','웨이드 밀렌':'redwolf','방랑자':'wanderer',
    'Mimic':'mimic','미믹':'mimic','Automaton':'automaton','오토마톤':'automaton','Cursed Gear':'cursed',
    'Ferals':'feral','Superiors':'superior','Unusuals':'unusual',
    'Pure':'pure','Unpure':'unpure','Artificial':'artificial','Hybrid':'hybrid','Celestials':'celestial','Odious':'odious',
    'White Tag':'white','Gray Tag':'gray','Red Tag':'red','Black Tag':'black','Null Tag':'black',
    'Breach-0':'breach','Breach-1':'breach','Breach-2':'breach','Breach-3':'breach','Breach-4':'breach','Breach-5':'breach','Breach-6':'breach','Breach-7':'breach',
    'CI-H':'ci','CI-Z':'ci','CI-E':'ci','CI-O':'ci','CI-S':'ci',
    'CI-0':'ci','CI-1':'ci','CI-2':'ci','CI-3':'ci','CI-4':'ci','CI-5':'ci','CI-6':'ci','CI-7':'ci'
  };
  const markedPattern=new RegExp(`(${Object.keys(markedTerms).sort((a,b)=>b.length-a.length).map(term=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`,'g');

  function appendMarkedText(node,text){
    String(text??'').split(markedPattern).forEach(part=>{
      const tone=markedTerms[part];
      node.append(tone?el('strong',`archive-term archive-term-${tone}`,part):document.createTextNode(part));
    });
    return node;
  }

  const rich=(tag,className,text)=>appendMarkedText(el(tag,className),text);
  const imagePath=(src,embedded)=>embedded?String(src||'').replace(/^(?:\.\.\/)+/,''):src;
  const appendParagraphs=(target,paragraphs=[])=>paragraphs.forEach((paragraph,index)=>target.append(rich('p',`archive-doc-paragraph${index===0?' is-lead':''}`,paragraph)));
  const appendItems=(target,items=[])=>{
    if(!items.length) return;
    const list=el('ul');
    items.forEach(item=>list.append(rich('li','',item)));
    target.append(list);
  };

  function appendFigure(target,figureData,embedded,className='',evidenceContext=null){
    if(!figureData?.src) return;
    const figure=el('figure',`archive-doc-figure ${className}`.trim());
    const image=el('img');
    const requested=imagePath(figureData.src,embedded);
    image.alt=figureData.alt||'';
    const isHero=className.split(/\s+/).includes('archive-doc-hero');
    image.loading=isHero?'eager':'lazy';
    if(isHero) image.fetchPriority='high';
    image.decoding='async';
    const resolver=window.ProjectCurseVisualEvidence;
    if(resolver&&evidenceContext?.items){
      const evidence=resolver.resolve(figureData.src,{recordId:evidenceContext.recordId,sequence:evidenceContext.items.length+1,caption:figureData.caption,alt:figureData.alt});
      const item={...evidence,displaySrc:requested,comparison:evidence.comparison?{...evidence.comparison,displaySrc:imagePath(evidence.comparison.src,embedded)}:null};
      const index=evidenceContext.items.push(item)-1;
      figure.dataset.evidenceClass=item.className;
      figure.dataset.evidenceIndex=String(index);
      const strip=el('div','archive-evidence-strip');
      const open=el('button','','증거 확대');open.type='button';open.dataset.visualEvidenceOpen=String(index);
      strip.append(el('i'),el('b','',item.className),el('small','',`${item.assetId} / ${item.classInfo.label}`),open);
      figure.append(strip);
    }
    figure.append(image);
    if(figureData.caption) figure.append(rich('figcaption','',figureData.caption));
    target.append(figure);
    if(window.ProjectCurseMedia) window.ProjectCurseMedia.apply(image,requested,{mode:isHero?'hero':'display',eager:isHero,sizes:isHero?'(max-width: 760px) 94vw, 1100px':'(max-width: 760px) 94vw, 760px'});
    else image.src=requested;
  }

  function evidenceConsole(items){
    if(!items.length) return null;
    const shell=el('section','archive-evidence-console');
    const head=el('header');
    head.append(el('small','','VISUAL EVIDENCE ARCHIVE / SOURCE INTEGRITY'),el('h2','','시각 증거 보존 상태'),el('p','','현재 문서에 사용된 이미지의 출처 등급과 원본 대조 가능 여부를 표시한다. 복원 추정본은 원본 기록을 대신하지 않는다.'));
    const stats=el('div','archive-evidence-stats');
    const counts=Object.fromEntries(Object.keys(window.ProjectCurseVisualEvidence?.classes||{}).map(key=>[key,items.filter(item=>item.className===key).length]));
    [['ORIGINAL','원본'],['STABILIZED','보정본'],['RECONSTRUCTED','복원본'],['UNVERIFIED','대조 대기']].forEach(([key,label])=>{const cell=el('span');cell.append(el('small','',label),el('b','',String(counts[key]||0).padStart(2,'0')));stats.append(cell);});
    const filters=el('div','archive-evidence-filters');
    [['ALL','전체'],['ORIGINAL','원본'],['STABILIZED','보정본'],['RECONSTRUCTED','복원 추정'],['UNVERIFIED','대조 대기']].forEach(([key,label],index)=>{const button=el('button',index===0?'is-active':'',label);button.type='button';button.dataset.evidenceFilter=key;button.setAttribute('aria-pressed',index===0?'true':'false');filters.append(button);});
    const list=el('div','archive-evidence-list');
    items.forEach((item,index)=>{
      const card=el('button',`archive-evidence-card is-${item.classInfo.tone}`);card.type='button';card.dataset.visualEvidenceOpen=String(index);card.dataset.evidenceClass=item.className;
      const thumb=el('img');thumb.alt='';thumb.loading='lazy';
      const copy=el('span');copy.append(el('small','',`${String(index+1).padStart(2,'0')} / ${item.assetId}`),el('b','',item.caption||item.alt||'캡션 없는 시각 기록'),el('em','',item.comparison?'SOURCE COMPARISON AVAILABLE':item.originalState==='missing'?'ORIGINAL NOT REGISTERED':item.classInfo.label));
      card.append(thumb,copy);list.append(card);
      if(window.ProjectCurseMedia) window.ProjectCurseMedia.apply(thumb,item.displaySrc,{mode:'thumbnail',sizes:'(max-width: 760px) 78px, 92px'});
      else thumb.src=item.displaySrc;
    });
    filters.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-evidence-filter]');if(!button) return;
      const filter=button.dataset.evidenceFilter;
      Array.from(filters.children).forEach(control=>{const active=control===button;control.classList.toggle('is-active',active);control.setAttribute('aria-pressed',active?'true':'false');});
      Array.from(list.children).forEach(card=>{card.hidden=filter!=='ALL'&&card.dataset.evidenceClass!==filter;});
      window.ProjectCurseAudioControl?.play?.('evidence.filter');
    });
    shell.append(head,stats,filters,list);return shell;
  }

  function ensureEvidenceViewer(){
    if(evidenceViewer) return evidenceViewer;
    const viewer=el('section','pc-evidence-viewer');viewer.hidden=true;viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');viewer.setAttribute('aria-labelledby','pcEvidenceTitle');
    const head=el('header','pc-evidence-viewer-head');head.append(el('i'),el('span'),Object.assign(el('button','','×'),{type:'button'}));head.lastElementChild.dataset.evidenceClose='1';head.lastElementChild.setAttribute('aria-label','시각 증거 닫기');
    const body=el('div','pc-evidence-viewer-body');body.append(el('div','pc-evidence-stage'),el('aside','pc-evidence-meta'));
    viewer.append(head,body);document.body.append(viewer);evidenceViewer=viewer;return viewer;
  }

  function loadEvidenceImage(image,src,alt){
    image.alt=alt||'';
    return new Promise(resolve=>{
      let settled=false;const finish=value=>{if(settled)return;settled=true;resolve(value);};
      image.addEventListener('projectcurse:media-ready',()=>finish(true),{once:true});
      image.addEventListener('load',()=>{if(!window.ProjectCurseMedia)finish(true);},{once:true});
      image.addEventListener('error',()=>finish(false),{once:true});
      if(window.ProjectCurseMedia) window.ProjectCurseMedia.apply(image,src,{mode:'original',eager:true,sizes:'100vw'});
      else image.src=src;
    });
  }

  function renderEvidenceViewer(){
    const item=currentEvidenceItems[evidenceIndex];if(!item) return;
    const renderToken=++evidenceRenderToken;
    const viewer=ensureEvidenceViewer();const headCopy=viewer.querySelector('.pc-evidence-viewer-head>span');const stage=viewer.querySelector('.pc-evidence-stage');const meta=viewer.querySelector('.pc-evidence-meta');
    headCopy.replaceChildren(el('small','',`${item.recordId} / EVIDENCE ${String(evidenceIndex+1).padStart(2,'0')}`),el('b','',`${item.className} · ${item.assetId}`));
    stage.replaceChildren();stage.dataset.mediaState='loading';
    const loadState=el('div','pc-evidence-load-state','FRAME REQUEST / WAITING');loadState.setAttribute('role','status');loadState.setAttribute('aria-live','polite');
    const pending=[];
    if(item.comparison){
      const compare=el('div','pc-evidence-compare');compare.style.setProperty('--evidence-split','50%');
      const base=el('div');const baseImage=el('img');base.append(baseImage);
      const current=el('div');const currentImage=el('img');current.append(currentImage);
      const leftLabel=el('label','is-left',item.className);const rightLabel=el('label','is-right',item.comparison.label);
      const range=el('input','pc-evidence-range');range.type='range';range.min='0';range.max='100';range.value='50';range.disabled=true;range.setAttribute('aria-label','두 이미지 비교 경계');range.addEventListener('input',()=>compare.style.setProperty('--evidence-split',`${range.value}%`));
      compare.append(base,current,leftLabel,rightLabel,range);stage.append(compare);
      pending.push(loadEvidenceImage(baseImage,item.comparison.displaySrc,`${item.comparison.label} 비교 이미지`),loadEvidenceImage(currentImage,item.displaySrc,item.alt||item.caption));
      Promise.all(pending).then(results=>{if(renderToken!==evidenceRenderToken)return;const complete=results.every(Boolean);stage.dataset.mediaState=complete?'ready':'error';range.disabled=!complete;loadState.textContent=complete?'2 / 2 FRAMES STABILIZED':'COMPARISON FRAME LOST';if(!complete){loadState.classList.add('is-error');const retry=el('button','','다시 요청');retry.type='button';retry.addEventListener('click',event=>{event.stopPropagation();renderEvidenceViewer();});loadState.append(retry);}});
    }else{
      const single=el('div','pc-evidence-single');const image=el('img');single.append(image);stage.append(single);
      loadEvidenceImage(image,item.displaySrc,item.alt||item.caption).then(complete=>{if(renderToken!==evidenceRenderToken)return;stage.dataset.mediaState=complete?'ready':'error';loadState.textContent=complete?'1 / 1 FRAME STABILIZED':'VISUAL DATA LOST';if(!complete){loadState.classList.add('is-error');const retry=el('button','','다시 요청');retry.type='button';retry.addEventListener('click',event=>{event.stopPropagation();renderEvidenceViewer();});loadState.append(retry);}});
    }
    stage.append(loadState);
    meta.replaceChildren(el('small','',item.classInfo.description),el('h2','',item.caption||item.alt||'시각 기록'),el('p','',item.handling));
    const facts=el('dl');[['자산 ID',item.assetId],['분류',`${item.className} / ${item.classInfo.label}`],['출처',item.source],['시점',item.date],['무결성',item.integrity],['원본 상태',item.comparison?'비교 자료 연결됨':item.originalState==='missing'?'원본 미등록':item.originalState==='available'?'원본 계열 확인':'추가 대조 필요'],['관계',item.comparison?.relationship||'단일 자산']].forEach(([term,value])=>{const row=el('div');row.append(el('dt','',term),el('dd','',value));facts.append(row);});
    const warning=el('div',`pc-evidence-warning${item.comparison||item.className==='ORIGINAL'?' is-available':''}`,item.className==='RECONSTRUCTED'&&!item.comparison?'이 이미지는 현존 원본이 아니다. 실제 원본이 확보되기 전까지 기록의 시각적 참고 자료로만 사용한다.':item.comparison?'비교 경계를 움직여 두 사본의 크롭·색상·정보 손실을 직접 대조할 수 있다.':'원본 계보가 완전히 확인되기 전에는 이 이미지를 재구성이나 보정의 기준본으로 사용하지 않는다.');
    const nav=el('div','pc-evidence-nav');const previous=el('button','','← 이전 증거');previous.type='button';previous.dataset.evidencePrevious='1';const next=el('button','','다음 증거 →');next.type='button';next.dataset.evidenceNext='1';nav.append(previous,next);
    meta.append(facts,warning,nav);
  }

  function openEvidence(index,trigger){
    if(!currentEvidenceItems.length) return false;
    evidenceIndex=Math.max(0,Math.min(currentEvidenceItems.length-1,Number(index)||0));evidenceTrigger=trigger||document.activeElement;
    const viewer=ensureEvidenceViewer();renderEvidenceViewer();viewer.hidden=false;document.body.classList.add('pc-evidence-open');document.querySelector('.pc-internal-document-shell:not([hidden])')?.setAttribute('aria-hidden','true');
    window.ProjectCurseAudioControl?.play?.(currentEvidenceItems[evidenceIndex].comparison?'evidence.compare':'evidence.open');viewer.querySelector('[data-evidence-close]')?.focus({preventScroll:true});return true;
  }

  function closeEvidence({restoreFocus=true}={}){
    if(!evidenceViewer||evidenceViewer.hidden) return false;
    evidenceRenderToken++;evidenceViewer.hidden=true;document.body.classList.remove('pc-evidence-open');document.querySelector('.pc-internal-document-shell[aria-hidden="true"]')?.removeAttribute('aria-hidden');window.ProjectCurseAudioControl?.play?.('evidence.close');
    if(restoreFocus&&evidenceTrigger instanceof HTMLElement&&document.contains(evidenceTrigger)) evidenceTrigger.focus({preventScroll:true});evidenceTrigger=null;return true;
  }

  function appendTable(target,tableData){
    if(!tableData?.rows?.length) return;
    const wrap=el('div','archive-doc-table-wrap');
    const table=el('table','archive-doc-table');
    if(tableData.headers?.length){
      const head=el('thead');
      const row=el('tr');
      tableData.headers.forEach(header=>row.append(rich('th','',header)));
      head.append(row);
      table.append(head);
    }
    const body=el('tbody');
    tableData.rows.forEach(values=>{
      const row=el('tr');
      values.forEach(value=>row.append(rich('td','',value)));
      body.append(row);
    });
    table.append(body);
    wrap.append(table);
    target.append(wrap);
  }

  function appendTranscript(target,entries=[]){
    if(!entries.length) return;
    const transcript=el('div','archive-doc-transcript');
    transcript.setAttribute('role','log');
    entries.forEach(entry=>{
      if(entry.cue){transcript.append(rich('div','archive-doc-transcript-cue',entry.cue));return;}
      const line=el('div','archive-doc-transcript-line');
      if(entry.time) line.append(el('time','archive-doc-transcript-time',entry.time));
      if(entry.speaker) line.append(rich('strong',`archive-doc-transcript-speaker${entry.tone?` is-${entry.tone}`:''}`,entry.speaker));
      line.append(rich('p','archive-doc-transcript-text',entry.text||''));
      transcript.append(line);
    });
    target.append(transcript);
  }

  function appendRecordContext(target,record){
    if(!record) return;
    const context=el('aside','archive-doc-record-context');
    const head=el('header');
    head.append(el('small','',record.code||'SOURCE LAYER'),rich('b','',record.type||'편집 기록'),el('span','',record.evidence||'판정 미등록'));
    const facts=el('dl');
    [
      ['작성',record.author],
      ['수신',record.recipient],
      ['한계',record.limit]
    ].filter(([,value])=>value).forEach(([term,value])=>{
      const row=el('div');row.append(el('dt','',term),rich('dd','',value));facts.append(row);
    });
    context.append(head,facts);target.append(context);
  }

  function appendBranches(target,branchData,operationScenario=false){
    const entries=branchData?.entries||[];
    if(!entries.length) return;
    const operation=operationScenario?window.ProjectCurseOperationState:null;
    const visited=new Set(operation?.get?.().visited||[]);
    const shell=el('div','archive-scenario');
    if(operation) shell.dataset.operationPersistence='active';
    const header=el('div','archive-scenario-head');
    const label=el('span','',branchData.label||'INTELLIGENCE RECOVERY');
    const progress=el('b','','0 / '+entries.length+' RECOVERED');
    header.append(label,progress);
    const controls=el('div','archive-scenario-branches');
    const panels=el('div','archive-scenario-panels');
    const complete=rich('aside','archive-scenario-complete',branchData.complete||'정보 경로 회수 완료.');
    complete.hidden=true;

    entries.forEach((entry,index)=>{
      const id=`archive-scenario-${entry.id||index}`;
      const button=el('button','archive-scenario-branch');
      button.type='button';
      button.dataset.scenarioBranch=entry.id||String(index);
      button.dataset.scenarioIndex=String(index);
      button.setAttribute('aria-controls',id);
      button.setAttribute('aria-expanded','false');
      button.append(el('small','',entry.status||`PATH ${index+1}`),rich('strong','',entry.label),rich('span','',entry.summary));
      const panel=el('article','archive-scenario-panel');
      panel.id=id;
      panel.hidden=true;
      panel.append(el('small','','RECOVERED FRAGMENT'),rich('h3','',entry.label),rich('p','',entry.reveal));
      if(entry.source||entry.evidence||entry.limit){
        const source=el('dl','archive-scenario-source');
        [['출처',entry.source],['근거',entry.evidence],['판정 한계',entry.limit]].filter(([,value])=>value).forEach(([term,value])=>{
          const row=el('div');row.append(el('dt','',term),rich('dd','',value));source.append(row);
        });
        panel.append(source);
      }
      controls.append(button);
      panels.append(panel);
    });

    const decisionShell=operation?el('section','archive-scenario-decision'):null;
    const decisionGrid=operation?el('div','archive-scenario-verdicts'):null;
    const report=operation?el('article','archive-scenario-report'):null;
    const decisionStatus=operation?el('p','archive-scenario-decision-status','세 정보 경로를 모두 회수해야 지휘 판단을 기록할 수 있다.'):null;
    if(operation){
      const boundary=operation.canonBoundary;
      const decisionHead=el('header','archive-scenario-decision-head');
      decisionHead.append(el('small','','LOCAL COMMAND VERDICT'),el('h3','','현장 작전 사본 판정'),decisionStatus);
      const boundaryShell=el('aside','archive-scenario-canon-boundary');
      const boundaryHead=el('header');
      boundaryHead.append(el('small','',boundary.status),el('b','','정사 승인 경계'),rich('p','',boundary.scope));
      const boundaryColumns=el('div','archive-scenario-canon-columns');
      [['FIXED CANON','2030년에 확정된 사실',boundary.fixedFacts],['PENDING REVIEW','후대 승인 대기',boundary.pendingFacts]].forEach(([code,title,items])=>{
        const column=el('section');
        column.append(el('small','',code),el('h4','',title));
        const list=el('ul');
        items.forEach(item=>list.append(rich('li','',item)));
        column.append(list);boundaryColumns.append(column);
      });
      const lineage=el('div','archive-scenario-lineage-guard');
      lineage.append(el('b','','LINEAGE GUARD'),rich('p','',boundary.lineageGuard));
      boundaryShell.append(boundaryHead,boundaryColumns,lineage);
      Object.values(operation.decisions).forEach(decision=>{
        const button=el('button','archive-scenario-verdict');
        button.type='button';
        button.dataset.scenarioVerdict=decision.id;
        button.append(el('small','',`${decision.code} / LOCAL ONLY`),rich('strong','',decision.title),rich('span','',decision.immediate));
        decisionGrid.append(button);
      });
      report.hidden=true;
      const actions=el('div','archive-scenario-actions');
      const mapButton=el('button','','작전지도에서 현재 결과 보기');
      mapButton.type='button';
      mapButton.dataset.scenarioOpenMap='1';
      const resetButton=el('button','is-reset','작전 진행 초기화');
      resetButton.type='button';
      resetButton.dataset.scenarioReset='1';
      actions.append(mapButton,resetButton);
      decisionShell.append(decisionHead,boundaryShell,decisionGrid,report,actions);
    }

    function renderReport(state){
      if(!report) return;
      const decision=operation.getDecision(state.verdict);
      const boundary=operation.canonBoundary;
      report.replaceChildren();
      report.hidden=!decision;
      if(!decision) return;
      const header=el('header');
      header.append(el('small','',`${decision.code} / LOCAL COMMAND VERDICT`),rich('h3','',decision.title),el('span','archive-scenario-canon-status',boundary.status));
      const facts=el('dl','archive-scenario-report-facts');
      [
        ['회수 정보',`${state.visited.length} / ${entries.length}`],
        ['현재 작전 단계',`${state.mapStep+1} / 6`],
        ['로컬 판정',decision.status],
        ['공통 정사',boundary.status],
        ['최종 갱신',state.updatedAt?new Date(state.updatedAt).toLocaleString('ko-KR'):'기록 없음']
      ].forEach(([term,value])=>{
        const row=el('div');row.append(el('dt','',term),el('dd','',value));facts.append(row);
      });
      const summary=rich('p','archive-scenario-report-summary',decision.summary);
      const layers=el('div','archive-scenario-report-layers');
      [
        ['현장 관측',decision.observed],
        ['로컬 지도 효과',decision.immediate],
        ['승인 대기',decision.unresolved],
        ['정사 효력','없음. 이 판정은 공통 연표와 혈교 지휘 계보를 변경하지 않는다.']
      ].forEach(([label,value])=>{
        const item=el('div');item.append(el('b','',label),rich('p','',value));layers.append(item);
      });
      const consequence=el('div','archive-scenario-report-consequence');
      consequence.append(el('b','','작전 영향'),rich('p','',decision.consequence));
      const directive=el('div','archive-scenario-report-directive');
      directive.append(el('b','','후속 지침'),rich('p','',decision.directive));
      report.append(header,facts,summary,layers,consequence,directive);
    }

    function sync(){
      const state=operation?.get?.();
      if(state){visited.clear();state.visited.forEach(id=>visited.add(id));}
      Array.from(controls.children).forEach((control,index)=>{
        const id=entries[index].id||String(index);
        control.classList.toggle('is-recovered',visited.has(id)||visited.has(index));
      });
      progress.textContent=`${visited.size} / ${entries.length} RECOVERED`;
      const ready=visited.size===entries.length;
      complete.hidden=!ready;
      complete.classList.toggle('is-visible',ready);
      if(operation){
        decisionStatus.textContent=state.verdict
          ? `${operation.getDecision(state.verdict).status} / 로컬 사본에만 저장됨 · 공통 정사 변화 없음.`
          : ready?'모든 정보가 복구됐다. 공통 정사를 바꾸지 않는 현장 판정을 선택하라.':'세 정보 경로를 모두 회수해야 로컬 지휘 판정을 기록할 수 있다.';
        Array.from(decisionGrid.children).forEach(button=>{
          button.disabled=!ready;
          button.classList.toggle('is-selected',button.dataset.scenarioVerdict===state.verdict);
          button.setAttribute('aria-pressed',button.dataset.scenarioVerdict===state.verdict?'true':'false');
        });
        renderReport(state);
      }
    }

    controls.addEventListener('click',event=>{
      const button=event.target.closest?.('[data-scenario-branch]');
      if(!button) return;
      const index=Number(button.dataset.scenarioIndex);
      const panel=panels.children[index];
      const willOpen=panel.hidden;
      Array.from(controls.children).forEach(control=>{control.classList.remove('is-active');control.setAttribute('aria-expanded','false');});
      Array.from(panels.children).forEach(item=>{item.hidden=true;});
      if(willOpen){
        button.classList.add('is-active','is-recovered');
        button.setAttribute('aria-expanded','true');
        panel.hidden=false;
        const id=entries[index].id||String(index);
        const wasComplete=visited.size===entries.length;
        visited.add(id);
        operation?.visitBranch?.(id);
        window.ProjectCurseAudioControl?.play?.('scenario.reveal');
        sync();
        if(!wasComplete&&visited.size===entries.length) window.ProjectCurseAudioControl?.play?.('scenario.complete');
      }
    });

    decisionShell?.addEventListener('click',event=>{
      const verdict=event.target.closest?.('[data-scenario-verdict]');
      if(verdict&&!verdict.disabled){
        operation.chooseVerdict(verdict.dataset.scenarioVerdict);
        window.ProjectCurseAudioControl?.play?.('scenario.complete');
        sync();
        report?.scrollIntoView({block:'nearest',behavior:'smooth'});
        return;
      }
      const map=event.target.closest?.('[data-scenario-open-map]');
      if(map){
        close({restoreFocus:false});
        window.ProjectCurseShell?.navigate?.('map-room',{replace:false,historyMode:'push'}).then(()=>window.ProjectCurseMapRoomRuntime?.showOperation?.('op-southern-coup'));
        return;
      }
      const reset=event.target.closest?.('[data-scenario-reset]');
      if(!reset) return;
      if(reset.dataset.confirmReset!=='1'){
        reset.dataset.confirmReset='1';
        reset.textContent='한 번 더 눌러 초기화 확인';
        window.ProjectCurseAudioControl?.play?.('system.denied');
        window.setTimeout(()=>{if(reset.isConnected){delete reset.dataset.confirmReset;reset.textContent='작전 진행 초기화';}},4200);
        return;
      }
      operation.reset();
      Array.from(panels.children).forEach(panel=>{panel.hidden=true;});
      Array.from(controls.children).forEach(control=>{control.classList.remove('is-active','is-recovered');control.setAttribute('aria-expanded','false');});
      delete reset.dataset.confirmReset;
      reset.textContent='작전 진행 초기화';
      window.ProjectCurseAudioControl?.play?.('system.alert');
      sync();
    });

    shell.append(header,controls,panels,complete);
    if(decisionShell) shell.append(decisionShell);
    target.append(shell);
    sync();
  }

  function closeControl(embedded,label){
    if(embedded){
      const button=el('button','archive-doc-back',label);
      button.type='button';
      button.dataset.internalDocumentClose='1';
      return button;
    }
    const anchor=el('a','archive-doc-back',label);
    anchor.href='../../index.html#archive-entry';
    return anchor;
  }

  function bindToc(toc,body,embedded){
    sectionObserver?.disconnect();
    const buttons=Array.from(toc.querySelectorAll('.archive-doc-toc-link'));
    toc.addEventListener('click',event=>{
      const control=event.target.closest?.('[data-section-index]');
      if(!control) return;
      event.preventDefault();
      const section=body.querySelector(`[data-document-section="${control.dataset.sectionIndex}"]`);
      section?.scrollIntoView({block:'start',behavior:'smooth'});
      window.ProjectCurseAudioControl?.play?.('record.page');
    });
    if(!('IntersectionObserver' in window)) return;
    sectionObserver=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
      if(!visible) return;
      buttons.forEach(item=>item.classList.toggle('active',item.dataset.sectionIndex===visible.target.dataset.documentSection));
    },{root:embedded?document.querySelector('.uac-shell-content'):null,rootMargin:'-12% 0px -68% 0px',threshold:0});
    body.querySelectorAll('.archive-doc-section').forEach(section=>sectionObserver.observe(section));
  }

  function render(root,doc,{embedded=false}={}){
    root.replaceChildren();
    if(!doc){
      root.append(el('h1','archive-doc-missing','기록을 복구할 수 없습니다.'),closeControl(embedded,'기록보관소로 돌아가기'));
      return false;
    }
    const evidenceItems=[];
    const evidenceContext={recordId:doc.sourceId||doc.code||'UNKNOWN',items:evidenceItems};

    const top=el('div','archive-doc-top');
    const verdictDocument=doc.presentation==='verdict';
    top.append(closeControl(embedded,'← 기록보관소'),el('span','archive-doc-access',verdictDocument?'FIELD VERDICT / DECRYPTED':'PUBLIC RECOVERY / READABLE'));

    const header=el('header','archive-doc-header');
    header.append(el('div','archive-doc-kicker',verdictDocument?'GENERATED FROM LOCAL VERDICT':'U.A.C RECOVERED ARCHIVE'),el('code','archive-doc-code',doc.code),el('h1','',doc.title),rich('p','archive-doc-summary',doc.summary));

    const scenarioId=doc.scenarioId||(doc.sourceId==='Dead_Zone_Pilgrimage'?'deadzone-return':doc.sourceId==='Great_Black_Forest_Region'?'unlit-fortress':null);
    const fieldAction=scenarioId?el('div','archive-doc-field-action'):null;
    if(fieldAction){
      const summary=window.ProjectCursePilgrimageState?.getSummary?.(scenarioId);
      const button=el('button','',verdictDocument?'해당 현장 결과 다시 열기':summary?.status==='complete'?'저장된 현장 결과 열기':summary?.status==='active'?'저장된 현장 기록 재개':scenarioId==='deadzone-return'?'검문소 07 귀환 심사 시작':scenarioId==='deadzone-recovery'?'데드존 전진 회수 작전 시작':'불빛 없는 성채 순례 시작');
      button.type='button';button.dataset.archiveOpenPilgrimage=scenarioId;
      const copy=el('span','',scenarioId==='deadzone-return'?'RETURN SCREENING / CHECKPOINT 07':scenarioId==='deadzone-recovery'?'OUTBOUND RECOVERY / DZ-R05':'FIELD PILGRIMAGE / GBF WESTERN ROUTE');
      button.addEventListener('click',()=>{
        close({restoreFocus:false});
        window.ProjectCurseShell?.navigate?.('map-room',{replace:false,historyMode:'push'}).then(()=>window.ProjectCursePilgrimageRuntime?.open?.(scenarioId));
      });
      fieldAction.append(copy,button);
      if(verdictDocument){
        if(doc.unlockScenario){
          const unlockScenario=doc.unlockScenario;
          const unlockButton=el('button','is-recovery-unlock','해금된 전진 회수 작전 시작');
          unlockButton.type='button';
          unlockButton.addEventListener('click',()=>{
            close({restoreFocus:false});
            window.ProjectCurseShell?.navigate?.('map-room',{replace:false,historyMode:'push'}).then(()=>window.ProjectCursePilgrimageRuntime?.open?.(unlockScenario));
          });
          fieldAction.append(unlockButton);
        }
        const mapButton=el('button','is-secondary','판정 좌표를 관제도에서 확인');
        mapButton.type='button';
        mapButton.addEventListener('click',()=>{
          const target=window.ProjectCursePilgrimageData?.scenarios?.[scenarioId]?.mapTarget;
          close({restoreFocus:false});
          window.ProjectCurseShell?.navigate?.('map-room',{replace:false,historyMode:'push'}).then(()=>window.ProjectCurseMapRoomRuntime?.showDetail?.(target?.detail,target?.site));
        });
        fieldAction.append(mapButton);
      }
    }

    const telemetry=doc.telemetry?.length?el('div','archive-region-telemetry'):null;
    doc.telemetry?.forEach(([label,value])=>{
      const item=el('span');
      item.append(el('small','',label),rich('b','',value));
      telemetry.append(item);
    });

    const meta=el('dl','archive-doc-meta');
    [['문서 일자',doc.date],['기록 주체',doc.owner],['열람 상태',doc.classification]].forEach(([term,value])=>{
      const item=el('div');
      item.append(el('dt','',term),el('dd','',value));
      meta.append(item);
    });

    const toc=el('nav','archive-doc-toc');
    toc.setAttribute('aria-label','문서 항목');
    doc.sections.forEach((section,index)=>{
      const item=el('button','archive-doc-toc-link',`${String(index+1).padStart(2,'0')} ${section.title}`);
      item.type='button';
      item.dataset.sectionIndex=String(index+1);
      toc.append(item);
    });

    const heroFragment=document.createDocumentFragment();
    appendFigure(heroFragment,doc.hero,embedded,'archive-doc-hero',evidenceContext);

    const body=el('div','archive-doc-body');
    doc.sections.forEach((section,index)=>{
      const part=el('section','archive-doc-section');
      part.id=`${embedded?'internal-':'archive-'}section-${index+1}`;
      part.dataset.documentSection=String(index+1);
      const heading=el('h2');
      heading.append(el('span','',String(index+1).padStart(2,'0')),document.createTextNode(section.title));
      part.append(heading);
      appendRecordContext(part,section.record);
      if(section.image?.placement!=='after') appendFigure(part,section.image,embedded,'',evidenceContext);
      appendParagraphs(part,section.paragraphs);
      appendTranscript(part,section.transcript);
      appendTable(part,section.table);
      appendItems(part,section.items);
      appendBranches(part,section.branches,doc.sourceId==='Operation_Broken_Crown');
      (section.groups||[]).forEach(group=>{
        const block=el('div','archive-doc-group');
        block.append(rich('h3','',group.title));
        appendFigure(block,group.image,embedded,'archive-doc-group-figure',evidenceContext);
        appendParagraphs(block,group.paragraphs);
        appendTranscript(block,group.transcript);
        appendTable(block,group.table);
        appendItems(block,group.items);
        part.append(block);
      });
      if(section.quote) part.append(rich('blockquote','archive-doc-quote',section.quote));
      if(section.image?.placement==='after') appendFigure(part,section.image,embedded,'',evidenceContext);
      if(section.warning) part.append(rich('aside','archive-doc-warning',section.warning));
      body.append(part);
    });

    const footer=el('footer','archive-doc-footer');
    footer.append(el('span','',`END OF RECORD / ${doc.code}`),closeControl(embedded,'기록 파일 색인으로 돌아가기'));
    const readingGrid=el('div','archive-doc-reading-grid');
    readingGrid.append(toc,body);
    root.append(top,header);
    if(fieldAction) root.append(fieldAction);
    if(telemetry) root.append(telemetry);
    root.append(meta);
    root.append(heroFragment);
    const provenance=evidenceConsole(evidenceItems);
    if(provenance) root.append(provenance);
    root.append(readingGrid,footer);
    currentEvidenceItems=evidenceItems;
    bindToc(toc,body,embedded);
    return true;
  }

  function open(id,trigger=null){
    const doc=documentFor(id);
    const host=document.getElementById('archiveInternalDocument');
    const root=document.getElementById('archiveInternalDocumentBody');
    if(!doc||!host||!root) return false;
    closeEvidence({restoreFocus:false});
    if(window.ProjectCurseShell?.getRoute()!=='archive-entry') window.ProjectCurseShell?.navigate('archive-entry');

    currentId=id;
    currentTrigger=trigger||document.activeElement;
    document.getElementById('archiveListWrap')?.classList.add('is-hidden');
    const legacyViewer=document.getElementById('archiveRecordViewer');
    if(legacyViewer) legacyViewer.hidden=true;
    host.dataset.presentation=doc.presentation||'document';
    host.dataset.documentTheme=doc.theme||'default';
    host.hidden=false;
    host.classList.remove('is-entering');
    render(root,doc,{embedded:true});
    void host.offsetWidth;
    host.classList.add('is-entering');
    document.body.classList.add('pc-internal-document-open');
    document.body.dataset.internalDocument=id;
    document.title=`${doc.title} | U.A.C 기록보관소`;
    window.ProjectCurseAudio?.setContext?.('document');
    window.ProjectCurseAudioControl?.setProfile?.(doc.theme||doc.presentation||'document');
    window.ProjectCurseAudioControl?.play?.('record.mount');
    if(doc.presentation==='verdict') window.ProjectCurseVerdictArchiveState?.markRead?.(id);
    const regionalCue={
      'great-black-forest':'region.forest',
      'dead-zone':'region.deadzone',
      guide:'document.guide',
      scenario:'scenario.arm'
    }[doc.theme]||({guide:'document.guide',scenario:'scenario.arm'}[doc.presentation]);
    if(regionalCue) window.setTimeout(()=>{if(currentId===id) window.ProjectCurseAudioControl?.play?.(regionalCue);},280);
    const scrollRoot=document.querySelector('.uac-shell-content');
    if(scrollRoot){scrollRoot.scrollTop=0;scrollRoot.scrollLeft=0;}
    root.querySelector('[data-internal-document-close]')?.focus({preventScroll:true});
    return true;
  }

  function close({restoreFocus=true}={}){
    const host=document.getElementById('archiveInternalDocument');
    const root=document.getElementById('archiveInternalDocumentBody');
    if(!host||host.hidden) return false;
    closeEvidence({restoreFocus:false});
    sectionObserver?.disconnect();
    sectionObserver=null;
    host.hidden=true;
    host.classList.remove('is-entering');
    delete host.dataset.documentTheme;
    root?.replaceChildren();
    document.getElementById('archiveListWrap')?.classList.remove('is-hidden');
    document.body.classList.remove('pc-internal-document-open');
    delete document.body.dataset.internalDocument;
    document.title=originalTitle;
    window.ProjectCurseAudio?.setContext?.('shell');
    window.ProjectCurseAudioControl?.setProfile?.(window.ProjectCurseShell?.getRoute?.()||'archive-entry');
    window.ProjectCurseAudioControl?.play?.('record.unmount');
    const scrollRoot=document.querySelector('.uac-shell-content');
    if(scrollRoot) scrollRoot.scrollTop=0;
    if(restoreFocus){
      const triggerVisible=currentTrigger instanceof HTMLElement
        &&document.contains(currentTrigger)
        &&currentTrigger.getClientRects().length>0;
      if(triggerVisible) currentTrigger.focus({preventScroll:true});
      else{
        const matchingIndexControl=Array.from(document.querySelectorAll('#archiveListWrap [data-pc-archive-open]'))
          .find(control=>control.dataset.pcArchiveOpen===currentId);
        const fallback=matchingIndexControl||document.querySelector('#archiveListWrap [data-pc-archive-open]');
        if(fallback instanceof HTMLElement) fallback.focus({preventScroll:true});
      }
    }
    currentId=null;
    currentTrigger=null;
    currentEvidenceItems=[];
    return true;
  }

  document.addEventListener('click',event=>{
    const evidenceOpen=event.target.closest?.('[data-visual-evidence-open]');
    if(evidenceOpen){event.preventDefault();event.stopImmediatePropagation();openEvidence(evidenceOpen.dataset.visualEvidenceOpen,evidenceOpen);return;}
    const evidenceControl=event.target.closest?.('[data-evidence-close],[data-evidence-previous],[data-evidence-next]');
    if(evidenceControl){
      event.preventDefault();event.stopImmediatePropagation();
      if(evidenceControl.dataset.evidenceClose!==undefined){closeEvidence();return;}
      evidenceIndex=(evidenceIndex+(evidenceControl.dataset.evidencePrevious!==undefined?-1:1)+currentEvidenceItems.length)%currentEvidenceItems.length;renderEvidenceViewer();window.ProjectCurseAudioControl?.play?.('record.page');return;
    }
    const closeButton=event.target.closest?.('[data-internal-document-close]');
    if(!closeButton) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    close();
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&evidenceViewer&&!evidenceViewer.hidden){event.preventDefault();event.stopImmediatePropagation();closeEvidence();return;}
    if(event.key==='Escape'&&currentId){event.preventDefault();close();}
  });

  document.addEventListener('projectcurse:route-will-change',event=>{
    if(currentId&&event.detail?.target!=='archive-entry') close({restoreFocus:false});
  });

  window.ProjectCurseInternalDocumentViewer=Object.freeze({
    open,
    close,
    render:(id,root,options)=>render(root,documentFor(id),options),
    openEvidenceAsset(src,context={},trigger=null){
      const resolver=window.ProjectCurseVisualEvidence;if(!resolver||!src) return false;
      const evidence=resolver.resolve(src,{recordId:context.recordId||'CINEMATIC',sequence:context.sequence||1,caption:context.caption||'',alt:context.alt||''});
      currentEvidenceItems=[{...evidence,displaySrc:imagePath(src,true),comparison:evidence.comparison?{...evidence.comparison,displaySrc:imagePath(evidence.comparison.src,true)}:null}];
      return openEvidence(0,trigger);
    },
    closeEvidence,
    isOpen:()=>Boolean(currentId),
    getCurrentId:()=>currentId
  });

  const standaloneId=document.body?.dataset.archiveDocument;
  const standaloneRoot=document.getElementById('archiveDocument');
  if(standaloneId&&standaloneRoot){
    const doc=documentFor(standaloneId);
    if(doc){
      document.title=`${doc.title} | U.A.C 기록보관소`;
      document.body.dataset.presentation=doc.presentation||'document';
      document.body.dataset.documentTheme=doc.theme||'default';
    }
    render(standaloneRoot,doc,{embedded:false});
  }
})();
