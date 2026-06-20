(function(){
  const audioRoot='../../assets/audio/';
  const click=new Audio(audioRoot+'ui_click_relay.mp3');
  const openFx=new Audio(audioRoot+'ui_file_open.mp3');
  const slideFx=new Audio(audioRoot+'ui_slide_machine.mp3');
  const pageGlitch=new Audio(audioRoot+'ui_page_glitch.mp3');
  const ambience=document.getElementById('archive-ambience');
  let soundOn=false;
  if(ambience){
    if(document.body.classList.contains('document-page')) ambience.src=audioRoot+'doc_static_bed.mp3';
    ambience.volume=.12;
  }
  function play(a,vol){ if(!soundOn) return; try{a.currentTime=0;a.volume=vol;a.play().catch(()=>{});}catch(e){} }
  function updateToggle(){document.querySelectorAll('[data-sound-toggle]').forEach(b=>{b.textContent=soundOn?'SOUND ON':'SOUND OFF';b.classList.toggle('on',soundOn);});}
  function startSound(){soundOn=true;localStorage.setItem('pc_sound_requested','1');if(ambience){ambience.volume=.12;ambience.play().catch(()=>{});}updateToggle();}
  function stopSound(){soundOn=false;localStorage.setItem('pc_sound_requested','0');if(ambience)ambience.pause();updateToggle();}
  document.querySelectorAll('[data-sound-toggle]').forEach(b=>b.addEventListener('click',()=>{soundOn?stopSound():startSound();play(click,.25);}));
  if(localStorage.getItem('pc_sound_requested')==='1') startSound(); else updateToggle();
  document.querySelectorAll('.back-button').forEach(el=>el.addEventListener('click',e=>{ if(soundOn){e.preventDefault(); play(openFx,.18); setTimeout(()=>{window.location.href=el.href},240);} }));

  function initPageViewer(){
    const content=document.querySelector('.doc-content');
    const file=document.querySelector('.doc-file');
    if(!content || content.dataset.paged==='1') return;
    content.dataset.paged='1';

    const rawNodes=Array.from(content.childNodes).filter(node=>!(node.nodeType===3 && !node.textContent.trim()));
    if(rawNodes.length<2) return;

    const toolbar=document.createElement('div');
    toolbar.className='page-toolbar';
    toolbar.innerHTML=`
      <div class="page-readout">
        <span class="page-readout-label">ANALOG PAGE FEED</span>
        <strong><span data-current-page>01</span> / <span data-total-page>01</span></strong>
      </div>
      <div class="page-controls">
        <button class="page-btn" type="button" data-page-prev>◂ PREV FILE PAGE</button>
        <button class="page-btn" type="button" data-page-next>NEXT FILE PAGE ▸</button>
      </div>
      <div class="page-hint">RELAY PAGE TURN // A/D 또는 ←/→</div>
    `;

    const stage=document.createElement('div');
    stage.className='page-stage';
    const stack=document.createElement('div');
    stack.className='page-stack-mark';

    const makePage=()=>{
      const page=document.createElement('section');
      page.className='record-page';
      page.setAttribute('aria-hidden','true');
      stage.appendChild(page);
      return page;
    };

    const pages=[];
    let page=makePage();
    pages.push(page);
    let chars=0;
    let count=0;
    const measure=(node)=>{
      if(node.nodeType===3) return node.textContent.trim().length;
      const tag=(node.tagName||'').toUpperCase();
      if(tag==='FIGURE') return 760;
      if(tag==='IMG') return 760;
      if(tag==='TABLE') return 900;
      if(tag==='UL' || tag==='OL') return 950;
      if(tag==='H1') return 800;
      if(tag==='H2') return 520;
      if(tag==='H3' || tag==='H4') return 360;
      if(node.querySelector && node.querySelector('audio')) return 500;
      return (node.textContent||'').trim().length + 120;
    };
    const isHeading=(node)=> node.nodeType===1 && ['H1','H2','H3'].includes(node.tagName.toUpperCase());
    const isHardBreak=(node)=> node.nodeType===1 && node.tagName.toUpperCase()==='HR';

    rawNodes.forEach(node=>{
      const weight=measure(node);
      const needsNewPage = page.childNodes.length>0 && (
        (isHeading(node) && chars>950) ||
        (isHardBreak(node) && chars>780) ||
        (chars+weight>1800 && count>=3) ||
        (count>=7 && chars>1200)
      );
      if(needsNewPage){
        page=makePage();
        pages.push(page);
        chars=0;
        count=0;
      }
      page.appendChild(node);
      chars+=weight;
      count+=1;
    });

    if(pages.length<=1){
      content.appendChild(pages[0]);
      return;
    }

    content.innerHTML='';
    content.appendChild(toolbar);
    content.appendChild(stage);
    content.appendChild(stack);

    let current=0;
    let busy=false;
    const currentEl=toolbar.querySelector('[data-current-page]');
    const totalEl=toolbar.querySelector('[data-total-page]');
    const prevBtn=toolbar.querySelector('[data-page-prev]');
    const nextBtn=toolbar.querySelector('[data-page-next]');
    totalEl.textContent=String(pages.length).padStart(2,'0');

    pages.forEach((p,i)=>{
      p.dataset.pageNumber=String(i+1).padStart(2,'0');
      const marker=document.createElement('div');
      marker.className='record-page-number';
      marker.textContent=`PAGE ${String(i+1).padStart(2,'0')} / ${String(pages.length).padStart(2,'0')}`;
      p.appendChild(marker);
    });

    function render(index, direction){
      if(index<0 || index>=pages.length || busy) return;
      if(index===current && pages[current].classList.contains('active')) return;
      busy=true;
      const old=pages[current];
      current=index;
      const next=pages[current];
      pages.forEach(p=>{
        p.classList.remove('active','exit-left','exit-right','enter-left','enter-right');
        p.setAttribute('aria-hidden','true');
      });
      if(old && old!==next){
        old.classList.add(direction>0?'exit-left':'exit-right');
      }
      next.classList.add('active',direction>0?'enter-right':'enter-left');
      next.setAttribute('aria-hidden','false');
      currentEl.textContent=String(current+1).padStart(2,'0');
      prevBtn.disabled=current===0;
      nextBtn.disabled=current===pages.length-1;
      if(direction!==0){
        play(slideFx,.34);
        setTimeout(()=>play(pageGlitch,.10),140);
        file.classList.add('page-feed-flicker');
        setTimeout(()=>file.classList.remove('page-feed-flicker'),380);
        if(window.matchMedia('(prefers-reduced-motion: no-preference)').matches){
          file.scrollIntoView({behavior:'smooth',block:'start'});
        }
      }
      setTimeout(()=>{busy=false;next.classList.remove('enter-left','enter-right');},460);
    }

    prevBtn.addEventListener('click',()=>render(current-1,-1));
    nextBtn.addEventListener('click',()=>render(current+1,1));
    document.addEventListener('keydown',e=>{
      const tag=(document.activeElement&&document.activeElement.tagName||'').toLowerCase();
      if(['input','textarea','select'].includes(tag)) return;
      if(e.key==='ArrowRight'||e.key.toLowerCase()==='d'){render(current+1,1);}
      if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a'){render(current-1,-1);}
    });
    render(0,0);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initPageViewer); else initPageViewer();
})();
