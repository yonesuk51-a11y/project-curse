document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const app = document.getElementById('app');
  if (loader && app) {
    setTimeout(() => {
      loader.classList.add('hide');
      app.classList.add('ready');
      const first = document.getElementById('history');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1850);
  }

  const log = document.getElementById('liveLog');
  if (log) {
    const lines = [
      '세계 개요 기록 인덱스 확인',
      '지역지도 레이어 갱신 완료',
      '세력 관계 데이터 재정렬',
      '기록보관소 원본 문서 연결 확인',
      'U.A.C 좌측 메뉴 인터페이스 대기 중'
    ];
    let i = 0;
    setInterval(() => {
      const d = document.createElement('div');
      const t = new Date().toLocaleTimeString('ko-KR', { hour12:false });
      d.textContent = `[${t}] ${lines[i++ % lines.length]}`;
      log.prepend(d);
      while (log.children.length > 10) log.removeChild(log.lastChild);
    }, 4500);
  }
});

// === Legacy 2000s PC event-sound layer / no ambient build ===
(function(){
  function rootPrefix(){
    const path = location.pathname.replace(/\\/g,'/');
    if (path.includes('/docs/')) return '../../';
    if (path.includes('/archive/')) return '../';
    return '';
  }
  const prefix = rootPrefix();

  // 배경음은 제거. 버튼을 켜도 이벤트 효과음만 재생됩니다.
  const menuTick = new Audio(prefix + 'assets/audio/menu_tick.mp3');
  menuTick.volume = 0.18;
  const recordOpen = new Audio(prefix + 'assets/audio/record_open.mp3');
  recordOpen.volume = 0.26;
  const pageTurn = new Audio(prefix + 'assets/audio/page_turn.mp3');
  pageTurn.volume = 0.30;
  const bootLegacy = new Audio(prefix + 'assets/audio/boot_legacy.mp3');
  bootLegacy.volume = 0.30;

  let enabled = localStorage.getItem('pc_audio') === 'on';
  const btn = document.getElementById('audioToggle');
  const loaderBtn = document.getElementById('loaderAudio');

  function setBtn(){
    if (btn) btn.textContent = enabled ? '효과음: ON' : '효과음: OFF';
    if (loaderBtn) loaderBtn.textContent = enabled ? '[SOUND] 효과음 켜짐' : '[SOUND] 부팅/클릭 효과음 켜기';
  }
  function safePlay(a, reset=true){
    if(!enabled) return;
    try{ if(reset) a.currentTime=0; a.play().catch(()=>{}); }catch(e){}
  }
  function enableAudio(playBoot){
    enabled = true;
    localStorage.setItem('pc_audio','on');
    setBtn();
    if(playBoot) safePlay(bootLegacy);
  }

  setBtn();
  if(enabled){ setTimeout(()=>safePlay(bootLegacy), 120); }
  if(loaderBtn){ loaderBtn.addEventListener('click',()=>enableAudio(true)); }
  if(btn){
    btn.addEventListener('click',()=>{
      enabled=!enabled;
      localStorage.setItem('pc_audio', enabled?'on':'off');
      setBtn();
      if(enabled) safePlay(bootLegacy);
    });
  }

  document.querySelectorAll('.nav a,.side-nav a').forEach(a=>a.addEventListener('click',()=>safePlay(menuTick)));
  document.querySelectorAll('.record-shortcut a,.doc-card a,.archive-list a,.backline a,.btn').forEach(a=>a.addEventListener('click',()=>safePlay(recordOpen)));
  document.querySelectorAll('details > summary,.image-grid figure,.record-figure').forEach(el=>el.addEventListener('click',()=>safePlay(pageTurn)));
  document.addEventListener('keydown',(e)=>{ if(['PageDown','PageUp','ArrowLeft','ArrowRight',' '].includes(e.key)) safePlay(pageTurn); });
})();


// === Final navigation/paging/faction behavior ===
document.addEventListener('DOMContentLoaded', () => {
  const pages = Array.from(document.querySelectorAll('.content-page'));
  const sideLinks = Array.from(document.querySelectorAll('.side-menu a[data-target]'));
  function showPage(id){
    if(!pages.length) return;
    pages.forEach(p=>p.classList.toggle('active', p.id===id));
    sideLinks.forEach(a=>a.classList.toggle('active', a.dataset.target===id));
    window.scrollTo({top:0, behavior:'smooth'});
  }
  sideLinks.forEach(a=>a.addEventListener('click', e=>{ e.preventDefault(); showPage(a.dataset.target); }));
  if(pages.length){ const initial=(location.hash||'#history').replace('#',''); showPage(document.getElementById(initial)?initial:'history'); }

  document.querySelectorAll('.paged-record').forEach(box => {
    const pages = Array.from(box.querySelectorAll('.record-page'));
    const prev = box.querySelector('.page-prev');
    const next = box.querySelector('.page-next');
    const counter = box.querySelector('.page-counter');
    let i = 0;
    function render(){
      pages.forEach((p,idx)=>p.classList.toggle('active', idx===i));
      if(counter) counter.textContent = `PAGE ${String(i+1).padStart(2,'0')} / ${String(pages.length).padStart(2,'0')}`;
      if(prev) prev.disabled = i===0;
      if(next) next.disabled = i===pages.length-1;
    }
    if(prev) prev.addEventListener('click',()=>{ if(i>0){i--; render(); window.dispatchEvent(new Event('pc-page-turn')); }});
    if(next) next.addEventListener('click',()=>{ if(i<pages.length-1){i++; render(); window.dispatchEvent(new Event('pc-page-turn')); }});
    render();
  });

  const factionDesc = document.querySelector('.faction-desc');
  const factionBtns = Array.from(document.querySelectorAll('.faction-mark-btn'));
  factionBtns.forEach(btn=>btn.addEventListener('click',()=>{
    factionBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    if(factionDesc){
      factionDesc.innerHTML = `<h3>${btn.dataset.name}</h3><div class="meta">${btn.dataset.meta}</div><p>${btn.dataset.desc}</p>`;
      window.dispatchEvent(new Event('pc-record-open'));
    }
  }));
});

// event-sound hooks added after final requested sound combination
window.addEventListener('pc-page-turn',()=>{ try{ const ev=new KeyboardEvent('keydown',{key:'PageDown'}); document.dispatchEvent(ev); }catch(e){} });
window.addEventListener('pc-record-open',()=>{ const a=document.querySelector('.btn'); if(a) a.dispatchEvent(new Event('click')); });

// === Final explicit sound mapping for left menu / record open / page turn ===
(function(){
  function rootPrefix(){
    const path = location.pathname.replace(/\\/g,'/');
    if (path.includes('/docs/')) return '../../';
    if (path.includes('/archive/')) return '../';
    return '';
  }
  const prefix=rootPrefix();
  const menu=new Audio(prefix+'assets/audio/menu_tick.mp3'); menu.volume=0.16;
  const open=new Audio(prefix+'assets/audio/record_open.mp3'); open.volume=0.22;
  const page=new Audio(prefix+'assets/audio/page_turn.mp3'); page.volume=0.25;
  function enabled(){return localStorage.getItem('pc_audio')==='on'}
  function play(a){if(!enabled())return; try{a.currentTime=0; a.play().catch(()=>{});}catch(e){}}
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('.side-menu a[data-target], .side-menu a[href]').forEach(el=>el.addEventListener('click',()=>play(menu)));
    document.querySelectorAll('a.btn, .doc-card a, .archive-list a').forEach(el=>el.addEventListener('click',()=>play(open)));
    document.querySelectorAll('.page-prev,.page-next,.faction-mark-btn,details>summary').forEach(el=>el.addEventListener('click',()=>play(page)));
  });
})();
