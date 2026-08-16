// Project Curse 5.26.0 — shared archive document, verdict renderer, and recovery handoff.
(function(){
  'use strict';

  const documents=window.ProjectCurseArchiveDocuments?.documents||{};
  const documentFor=id=>documents[id]||window.ProjectCurseVerdictArchiveState?.getDocument?.(id)||null;
  const originalTitle=document.title;
  let currentId=null;
  let currentTrigger=null;
  let sectionObserver=null;

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

  function appendFigure(target,figureData,embedded,className=''){
    if(!figureData?.src) return;
    const figure=el('figure',`archive-doc-figure ${className}`.trim());
    const image=el('img');
    image.src=imagePath(figureData.src,embedded);
    image.alt=figureData.alt||'';
    const isHero=className.split(/\s+/).includes('archive-doc-hero');
    image.loading=isHero?'eager':'lazy';
    if(isHero) image.fetchPriority='high';
    image.decoding='async';
    figure.append(image);
    if(figureData.caption) figure.append(rich('figcaption','',figureData.caption));
    target.append(figure);
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
      controls.append(button);
      panels.append(panel);
    });

    const decisionShell=operation?el('section','archive-scenario-decision'):null;
    const decisionGrid=operation?el('div','archive-scenario-verdicts'):null;
    const report=operation?el('article','archive-scenario-report'):null;
    const decisionStatus=operation?el('p','archive-scenario-decision-status','세 정보 경로를 모두 회수해야 지휘 판단을 기록할 수 있다.'):null;
    if(operation){
      const decisionHead=el('header','archive-scenario-decision-head');
      decisionHead.append(el('small','','COMMAND VERDICT'),el('h3','','임시 지휘 판단'),decisionStatus);
      Object.values(operation.decisions).forEach(decision=>{
        const button=el('button','archive-scenario-verdict');
        button.type='button';
        button.dataset.scenarioVerdict=decision.id;
        button.append(el('small','',decision.code),rich('strong','',decision.title),rich('span','',decision.consequence));
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
      decisionShell.append(decisionHead,decisionGrid,report,actions);
    }

    function renderReport(state){
      if(!report) return;
      const decision=operation.getDecision(state.verdict);
      report.replaceChildren();
      report.hidden=!decision;
      if(!decision) return;
      const header=el('header');
      header.append(el('small','',`${decision.code} / ${decision.status}`),rich('h3','',decision.title));
      const facts=el('dl','archive-scenario-report-facts');
      [
        ['회수 정보',`${state.visited.length} / ${entries.length}`],
        ['현재 작전 단계',`${state.mapStep+1} / 6`],
        ['판단 상태',decision.status],
        ['최종 갱신',state.updatedAt?new Date(state.updatedAt).toLocaleString('ko-KR'):'기록 없음']
      ].forEach(([term,value])=>{
        const row=el('div');row.append(el('dt','',term),el('dd','',value));facts.append(row);
      });
      const summary=rich('p','archive-scenario-report-summary',decision.summary);
      const consequence=el('div','archive-scenario-report-consequence');
      consequence.append(el('b','','예상 영향'),rich('p','',decision.consequence));
      const directive=el('div','archive-scenario-report-directive');
      directive.append(el('b','','후속 지침'),rich('p','',decision.directive));
      report.append(header,facts,summary,consequence,directive);
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
          ? `${operation.getDecision(state.verdict).status} / 저장된 판단을 다시 선택해 변경할 수 있다.`
          : ready?'모든 정보가 복구됐다. 임시 지휘 판단을 선택하라.':'세 정보 경로를 모두 회수해야 지휘 판단을 기록할 수 있다.';
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

    const body=el('div','archive-doc-body');
    doc.sections.forEach((section,index)=>{
      const part=el('section','archive-doc-section');
      part.id=`${embedded?'internal-':'archive-'}section-${index+1}`;
      part.dataset.documentSection=String(index+1);
      const heading=el('h2');
      heading.append(el('span','',String(index+1).padStart(2,'0')),document.createTextNode(section.title));
      part.append(heading);
      if(section.image?.placement!=='after') appendFigure(part,section.image,embedded);
      appendParagraphs(part,section.paragraphs);
      appendTranscript(part,section.transcript);
      appendTable(part,section.table);
      appendItems(part,section.items);
      appendBranches(part,section.branches,doc.sourceId==='Operation_Broken_Crown');
      (section.groups||[]).forEach(group=>{
        const block=el('div','archive-doc-group');
        block.append(rich('h3','',group.title));
        appendFigure(block,group.image,embedded,'archive-doc-group-figure');
        appendParagraphs(block,group.paragraphs);
        appendTranscript(block,group.transcript);
        appendTable(block,group.table);
        appendItems(block,group.items);
        part.append(block);
      });
      if(section.quote) part.append(rich('blockquote','archive-doc-quote',section.quote));
      if(section.image?.placement==='after') appendFigure(part,section.image,embedded);
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
    appendFigure(root,doc.hero,embedded,'archive-doc-hero');
    root.append(readingGrid,footer);
    bindToc(toc,body,embedded);
    return true;
  }

  function open(id,trigger=null){
    const doc=documentFor(id);
    const host=document.getElementById('archiveInternalDocument');
    const root=document.getElementById('archiveInternalDocumentBody');
    if(!doc||!host||!root) return false;
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
    return true;
  }

  document.addEventListener('click',event=>{
    const closeButton=event.target.closest?.('[data-internal-document-close]');
    if(!closeButton) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    close();
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&currentId){event.preventDefault();close();}
  });

  document.addEventListener('projectcurse:route-will-change',event=>{
    if(currentId&&event.detail?.target!=='archive-entry') close({restoreFocus:false});
  });

  window.ProjectCurseInternalDocumentViewer=Object.freeze({
    open,
    close,
    render:(id,root,options)=>render(root,documentFor(id),options),
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
