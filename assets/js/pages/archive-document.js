// Project Curse 5.15.2cv — shared archive document renderer and internal viewer.
(function(){
  'use strict';

  const documents=window.ProjectCurseArchiveDocuments?.documents||{};
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
    image.loading='lazy';
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
    top.append(closeControl(embedded,'← 기록보관소'),el('span','archive-doc-access','PUBLIC RECOVERY / READABLE'));

    const header=el('header','archive-doc-header');
    header.append(el('div','archive-doc-kicker','U.A.C RECOVERED ARCHIVE'),el('code','archive-doc-code',doc.code),el('h1','',doc.title),rich('p','archive-doc-summary',doc.summary));

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
    root.append(top,header,meta);
    appendFigure(root,doc.hero,embedded,'archive-doc-hero');
    root.append(readingGrid,footer);
    bindToc(toc,body,embedded);
    return true;
  }

  function open(id,trigger=null){
    const doc=documents[id];
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
    host.hidden=false;
    host.classList.remove('is-entering');
    render(root,doc,{embedded:true});
    void host.offsetWidth;
    host.classList.add('is-entering');
    document.body.classList.add('pc-internal-document-open');
    document.body.dataset.internalDocument=id;
    document.title=`${doc.title} | U.A.C 기록보관소`;
    window.ProjectCurseAudio?.setContext?.('document');
    window.ProjectCurseAudio?.playCue?.('open',220);
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
    root?.replaceChildren();
    document.getElementById('archiveListWrap')?.classList.remove('is-hidden');
    document.body.classList.remove('pc-internal-document-open');
    delete document.body.dataset.internalDocument;
    document.title=originalTitle;
    window.ProjectCurseAudio?.setContext?.('shell');
    const scrollRoot=document.querySelector('.uac-shell-content');
    if(scrollRoot) scrollRoot.scrollTop=0;
    if(restoreFocus&&currentTrigger instanceof HTMLElement&&document.contains(currentTrigger)) currentTrigger.focus({preventScroll:true});
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
    render:(id,root,options)=>render(root,documents[id],options),
    isOpen:()=>Boolean(currentId),
    getCurrentId:()=>currentId
  });

  const standaloneId=document.body?.dataset.archiveDocument;
  const standaloneRoot=document.getElementById('archiveDocument');
  if(standaloneId&&standaloneRoot){
    const doc=documents[standaloneId];
    if(doc){
      document.title=`${doc.title} | U.A.C 기록보관소`;
      document.body.dataset.presentation=doc.presentation||'document';
    }
    render(standaloneRoot,doc,{embedded:false});
  }
})();
