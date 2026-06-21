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
(function(){
  function rootPrefix(){
    const path = location.pathname.replace(/\\/g,'/');
    const parts = path.split('/').filter(Boolean);
    // If inside docs/<name>/ or archive/, use relative search by testing script path not possible; infer by current path.
    if (path.includes('/docs/')) return '../../';
    if (path.includes('/archive/')) return '../';
    return '';
  }
  const prefix = rootPrefix();
  const ambience = new Audio(prefix + 'assets/audio/legacy_ambient.mp3');
  ambience.loop = true; ambience.volume = 0.18;
  const menuTick = new Audio(prefix + 'assets/audio/menu_tick.mp3'); menuTick.volume = 0.38;
  const recordOpen = new Audio(prefix + 'assets/audio/record_open.mp3'); recordOpen.volume = 0.46;
  const bootLegacy = new Audio(prefix + 'assets/audio/boot_legacy.mp3'); bootLegacy.volume = 0.32;
  let enabled = localStorage.getItem('pc_audio') === 'on';
  const btn = document.getElementById('audioToggle');
  function setBtn(){ if(btn) btn.textContent = enabled ? 'AUDIO: ON / 구형 PC' : 'AUDIO: OFF'; }
  function play(a){ if(!enabled) return; try{ a.currentTime=0; a.play().catch(()=>{}); }catch(e){} }
  function start(){ if(!enabled) return; ambience.play().catch(()=>{}); }
  setBtn();
  if(btn){
    btn.addEventListener('click',()=>{
      enabled=!enabled; localStorage.setItem('pc_audio', enabled?'on':'off'); setBtn();
      if(enabled){ bootLegacy.play().catch(()=>{}); ambience.play().catch(()=>{}); }
      else { ambience.pause(); ambience.currentTime=0; }
    });
  }
  document.addEventListener('pointerdown',()=>{ if(enabled) start(); }, {once:true});
  document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>play(menuTick)));
  document.querySelectorAll('.record-shortcut a,.doc-card a,.archive-list a,.backline a,.btn').forEach(a=>a.addEventListener('click',()=>play(recordOpen)));
})();
