
(function(){
  const audioRoot='../assets/audio/';
  const click=new Audio(audioRoot+'ui_click_relay.mp3');
  const hover=new Audio(audioRoot+'ui_hover_static.mp3');
  const openFx=new Audio(audioRoot+'ui_file_open.mp3');
  const ambience=document.getElementById('archive-ambience');
  let soundOn=false;
  if(ambience){ambience.volume=.14}
  function play(a,vol){ if(!soundOn) return; try{a.currentTime=0;a.volume=vol;a.play().catch(()=>{});}catch(e){} }
  function startSound(){ soundOn=true; localStorage.setItem('pc_sound_requested','1'); if(ambience){ambience.volume=.14; ambience.play().catch(()=>{});} updateToggle(); }
  function stopSound(){ soundOn=false; localStorage.setItem('pc_sound_requested','0'); if(ambience) ambience.pause(); updateToggle(); }
  function updateToggle(){ document.querySelectorAll('[data-sound-toggle]').forEach(b=>{b.textContent=soundOn?'SOUND ON':'SOUND OFF'; b.classList.toggle('on',soundOn);}); }
  document.querySelectorAll('[data-sound-toggle]').forEach(b=>b.addEventListener('click',()=>{ soundOn?stopSound():startSound(); play(click,.28); }));
  if(localStorage.getItem('pc_sound_requested')==='1') startSound(); else updateToggle();

  const search=document.querySelector('[data-search]');
  const filter=document.querySelector('[data-filter]');
  const cards=[...document.querySelectorAll('.doc-card')];
  function apply(){
    const q=(search?.value||'').toLowerCase().trim();
    const f=filter?.value||'all';
    cards.forEach(c=>{
      const text=(c.dataset.title+' '+c.dataset.cat+' '+(c.dataset.code||'')+' '+c.textContent).toLowerCase();
      const okQ=!q||text.includes(q); const okF=f==='all'||c.dataset.catkey===f;
      c.classList.toggle('hidden',!(okQ&&okF));
    });
  }
  search&&search.addEventListener('input',()=>{play(click,.16);apply();});
  filter&&filter.addEventListener('change',()=>{play(click,.24);apply();});
  cards.forEach(card=>{
    card.addEventListener('mouseenter',()=>play(hover,.16));
    card.addEventListener('click',e=>{
      e.preventDefault();
      startSound();
      play(openFx,.38);
      const href=card.getAttribute('href');
      card.classList.add('opening');
      setTimeout(()=>{window.location.href=href},420);
    });
  });
  const status=document.querySelector('[data-archive-status]');
  const msg=['RECOVERED DOCUMENT FLOOR','SIGNAL UNSTABLE','DOCUMENT SCATTER INDEX ACTIVE','BLACK FILES PARTIALLY RESTORED','FILE CODE INDEX READY'];
  let i=0; setInterval(()=>{ if(status){status.textContent=msg[i++%msg.length]} },2600);
})();
