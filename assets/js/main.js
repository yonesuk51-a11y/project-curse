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

// === Legacy 2000s PC audio layer ===
// === Legacy 2000s PC audio layer / fixed no-password build ===
(function(){
  function rootPrefix(){
    const path = location.pathname.replace(/\\/g,'/');
    if (path.includes('/docs/')) return '../../';
    if (path.includes('/archive/')) return '../';
    return '';
  }
  const prefix = rootPrefix();
  const ambience = new Audio(prefix + 'assets/audio/legacy_ambient.mp3');
  ambience.loop = true; ambience.volume = 0.10;
  const menuTick = new Audio(prefix + 'assets/audio/menu_tick.mp3'); menuTick.volume = 0.28;
  const recordOpen = new Audio(prefix + 'assets/audio/record_open.mp3'); recordOpen.volume = 0.34;
  const pageTurn = new Audio(prefix + 'assets/audio/page_turn.mp3'); pageTurn.volume = 0.36;
  const bootLegacy = new Audio(prefix + 'assets/audio/boot_legacy.mp3'); bootLegacy.volume = 0.34;
  let enabled = localStorage.getItem('pc_audio') === 'on';
  const btn = document.getElementById('audioToggle');
  const loaderBtn = document.getElementById('loaderAudio');
  function setBtn(){ if(btn) btn.textContent = enabled ? 'AUDIO: ON / PC-03' : 'AUDIO: OFF'; }
  function safePlay(a, reset=true){
    if(!enabled) return;
    try{ if(reset) a.currentTime=0; a.play().catch(()=>{}); }catch(e){}
  }
  function startAmbience(){ if(enabled){ try{ ambience.play().catch(()=>{}); }catch(e){} } }
  function enableAudio(playBoot){
    enabled = true;
    localStorage.setItem('pc_audio','on');
    setBtn();
    if(playBoot) safePlay(bootLegacy);
    startAmbience();
  }
  setBtn();
  if(enabled){ setTimeout(()=>{ safePlay(bootLegacy); startAmbience(); }, 120); }
  if(loaderBtn){ loaderBtn.addEventListener('click',()=>enableAudio(true)); }
  if(btn){
    btn.addEventListener('click',()=>{
      enabled=!enabled; localStorage.setItem('pc_audio', enabled?'on':'off'); setBtn();
      if(enabled){ safePlay(bootLegacy); startAmbience(); }
      else { ambience.pause(); ambience.currentTime=0; }
    });
  }
  document.addEventListener('pointerdown',()=>{ if(enabled) startAmbience(); }, {once:true});
  document.querySelectorAll('.nav a,.side-nav a').forEach(a=>a.addEventListener('click',()=>safePlay(menuTick)));
  document.querySelectorAll('.record-shortcut a,.doc-card a,.archive-list a,.backline a,.btn').forEach(a=>a.addEventListener('click',()=>safePlay(recordOpen)));
  document.querySelectorAll('details > summary,.image-grid figure,.record-figure').forEach(el=>el.addEventListener('click',()=>safePlay(pageTurn)));
  document.addEventListener('keydown',(e)=>{ if(['PageDown','PageUp','ArrowLeft','ArrowRight',' '].includes(e.key)) safePlay(pageTurn); });
})();
