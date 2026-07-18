(function(){
  'use strict';
  const id=document.body?.dataset.archiveDocument;
  const doc=window.ProjectCurseArchiveDocuments?.documents?.[id];
  const sourceHtml=window.ProjectCurseArchiveSourceContent?.[id]||'';
  const root=document.getElementById('archiveDocument');
  if(!root) return;

  const el=(tag,className,text)=>{
    const node=document.createElement(tag);
    if(className) node.className=className;
    if(text!==undefined) node.textContent=text;
    return node;
  };
  const link=(text,href,className)=>{
    const node=el('a',className,text);
    node.href=href;
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
  const appendMarkedText=(node,text)=>{
    String(text??'').split(markedPattern).forEach(part=>{
      const tone=markedTerms[part];
      if(!tone) node.append(document.createTextNode(part));
      else node.append(el('strong',`archive-term archive-term-${tone}`,part));
    });
    return node;
  };
  const rich=(tag,className,text)=>appendMarkedText(el(tag,className),text);
  const appendParagraphs=(target,paragraphs=[])=>paragraphs.forEach((paragraph,index)=>target.append(rich('p',`archive-doc-paragraph${index===0?' is-lead':''}`,paragraph)));
  const appendItems=(target,items=[])=>{
    if(!items.length) return;
    const list=el('ul');
    items.forEach(item=>list.append(rich('li','',item)));
    target.append(list);
  };
  const appendFigure=(target,figureData,className='')=>{
    if(!figureData?.src) return;
    const figure=el('figure',`archive-doc-figure ${className}`.trim());
    const image=el('img');
    image.src=figureData.src;
    image.alt=figureData.alt||'';
    image.loading='lazy';
    image.decoding='async';
    figure.append(image);
    if(figureData.caption) figure.append(rich('figcaption','',figureData.caption));
    target.append(figure);
  };
  const appendTable=(target,tableData)=>{
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
  };
  const appendTranscript=(target,entries=[])=>{
    if(!entries.length) return;
    const transcript=el('div','archive-doc-transcript');
    transcript.setAttribute('role','log');
    entries.forEach(entry=>{
      if(entry.cue){
        transcript.append(rich('div','archive-doc-transcript-cue',entry.cue));
        return;
      }
      const line=el('div','archive-doc-transcript-line');
      if(entry.time) line.append(el('time','archive-doc-transcript-time',entry.time));
      if(entry.speaker) line.append(rich('strong',`archive-doc-transcript-speaker${entry.tone?` is-${entry.tone}`:''}`,entry.speaker));
      line.append(rich('p','archive-doc-transcript-text',entry.text||''));
      transcript.append(line);
    });
    target.append(transcript);
  };

  if(!doc){
    root.append(el('h1','archive-doc-missing','기록을 복구할 수 없습니다.'),link('기록보관소로 돌아가기','../../index.html?return=archive#archive-entry','archive-doc-back'));
    return;
  }

  document.title=`${doc.title} | U.A.C 기록보관소`;
  document.body.dataset.presentation=doc.presentation||'document';
  const top=el('div','archive-doc-top');
  top.append(link('← 기록보관소','../../index.html?return=archive#archive-entry','archive-doc-back'),el('span','archive-doc-access','PUBLIC RECOVERY / READABLE'));

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
  if(!sourceHtml) doc.sections.forEach((section,index)=>{
      const item=link(`${String(index+1).padStart(2,'0')} ${section.title}`,`#section-${index+1}`,'archive-doc-toc-link');
      item.dataset.sectionIndex=String(index+1);
      toc.append(item);
    });

  const body=el('div','archive-doc-body');
  if(sourceHtml){
    body.classList.add('is-source');
    body.innerHTML=sourceHtml;
  }else doc.sections.forEach((section,index)=>{
    const part=el('section','archive-doc-section');
    part.id=`section-${index+1}`;
    const heading=el('h2');
    heading.append(el('span','',String(index+1).padStart(2,'0')),document.createTextNode(section.title));
    part.append(heading);
    if(section.image?.placement!=='after') appendFigure(part,section.image);
    appendParagraphs(part,section.paragraphs);
    appendTranscript(part,section.transcript);
    appendTable(part,section.table);
    appendItems(part,section.items);
    (section.groups||[]).forEach(group=>{
      const block=el('div','archive-doc-group');
      block.append(rich('h3','',group.title));
      appendFigure(block,group.image,'archive-doc-group-figure');
      appendParagraphs(block,group.paragraphs);
      appendTranscript(block,group.transcript);
      appendTable(block,group.table);
      appendItems(block,group.items);
      part.append(block);
    });
    if(section.quote) part.append(rich('blockquote','archive-doc-quote',section.quote));
    if(section.image?.placement==='after') appendFigure(part,section.image);
    if(section.warning) part.append(rich('aside','archive-doc-warning',section.warning));
    body.append(part);
  });

  const footer=el('footer','archive-doc-footer');
  footer.append(el('span','',`END OF RECORD / ${doc.code}`),link('기록 파일 색인으로 돌아가기','../../index.html?return=archive#archive-entry','archive-doc-back'));
  const readingGrid=el('div','archive-doc-reading-grid');
  if(sourceHtml){
    readingGrid.classList.add('is-source');
    readingGrid.append(body);
  }else readingGrid.append(toc,body);
  root.append(top,header,meta);
  appendFigure(root,doc.hero,'archive-doc-hero');
  root.append(readingGrid,footer);

  if(!sourceHtml&&'IntersectionObserver' in window){
    const links=Array.from(toc.querySelectorAll('.archive-doc-toc-link'));
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
      if(!visible) return;
      links.forEach(item=>item.classList.toggle('active',item.getAttribute('href')===`#${visible.target.id}`));
    },{rootMargin:'-12% 0px -68% 0px',threshold:0});
    body.querySelectorAll('.archive-doc-section').forEach(section=>observer.observe(section));
  }
})();
