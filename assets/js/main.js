(function(){
  const audioRoot='assets/audio/';
  const click=new Audio(audioRoot+'ui_click_relay.mp3');
  const openFx=new Audio(audioRoot+'ui_file_open.mp3');
  const ambience=document.getElementById('archive-ambience');
  const bootTape=document.getElementById('boot-cassette');
  if(ambience){ambience.volume=.12}
  if(bootTape){bootTape.volume=.34; bootTape.loop=true;}
  function play(a,vol){try{a.currentTime=0;a.volume=vol;a.play().catch(()=>{});}catch(e){}}
  function startAmbience(){ if(!ambience) return; ambience.volume=.12; ambience.play().catch(()=>{}); }
  function startBootTape(){
    if(!bootTape) return;
    try{
      bootTape.volume=.34;
      bootTape.play().catch(()=>{});
    }catch(e){}
  }
  function fadeBootTape(){
    if(!bootTape) return;
    let v=bootTape.volume || .34;
    const fade=setInterval(()=>{
      v=Math.max(0,v-.045);
      bootTape.volume=v;
      if(v<=0){ clearInterval(fade); try{ bootTape.pause(); bootTape.currentTime=0; bootTape.volume=.34; }catch(e){} }
    },70);
  }

  const boot=document.querySelector('[data-boot]');
  if(boot){
    const cassetteStatus=boot.querySelector('[data-cassette-status] .tape-label');
    const lines=[
      '> ANALOG TAPE DRIVE: MOTOR SPIN-UP...',
      '> U.A.C ANALOG ARCHIVE NODE BOOTING...',
      '> MAGNETIC FEED DETECTED / RED CHANNEL OPEN',
      '> RELAY BANK: WARMING CONTACTS',
      '> VACUUM MEMORY ARRAY: UNSTABLE',
      '> PHOSPHOR DISPLAY: RED CHANNEL LOCKED',
      '> RED ZONE RECORDS DETECTED',
      '> BLACK FILE INDEX CORRUPTED',
      '> N.H.C FIELD LOGS RECOVERED',
      '> RETURNED CIVILIAN DATA CONFLICT',
      '> BLOOD LAKE RECORD: PARTIAL RESTORE',
      '> WARNING: HOSTILE INFORMATION TRACE FOUND',
      '> ACCESS LEVEL: RESTRICTED',
      '> CURSE TRACE RESPONSE FOUND',
      '> ███████ RECORD DAMAGED',
      '> LOADING DOCUMENT FLOOR...',
      '> ANALOG INDEX READY'
    
    ];
    const log=boot.querySelector('.boot-log');
    const fill=boot.querySelector('.loading-fill');
    const pct=boot.querySelector('[data-progress]');
    let i=0, p=0, done=false;
    const addLine=()=>{ const div=document.createElement('div'); div.className='boot-line'+(Math.random()>.72?' dim':''); div.textContent=lines[i%lines.length]; log.appendChild(div); log.scrollTop=log.scrollHeight; i++; };
    const unlock=()=>{
      if(done || boot.classList.contains('off') || document.body.dataset.bootComplete==='1') return;
      startBootTape();
      if(cassetteStatus) cassetteStatus.textContent='TAPE FEED: ACTIVE';
    };
    const endBoot=()=>{
      if(done) return;
      done=true;
      document.body.dataset.bootComplete='1';
      boot.removeEventListener('pointerdown', unlock);
      boot.removeEventListener('keydown', unlock);
      if(cassetteStatus) cassetteStatus.textContent='TAPE FEED: DISCONNECTED';
      fadeBootTape();
      setTimeout(()=>boot.classList.add('off'),520);
    };
    // Browsers often block sound before a gesture. Try once, then unlock only while the boot screen itself is active.
    startBootTape();
    boot.addEventListener('pointerdown', unlock);
    boot.addEventListener('keydown', unlock);
    if(cassetteStatus) cassetteStatus.textContent='TAPE FEED: ACTIVE';

    const timer=setInterval(()=>{
      if(Math.random()>.14) addLine();
      p=Math.min(100,p+Math.floor(Math.random()*5)+2);
      fill.style.width=p+'%';
      pct.textContent=String(p).padStart(3,'0')+'%';
      if(p>=100){clearInterval(timer);setTimeout(endBoot,820)}
    },210);
    const skip=boot.querySelector('.skip-boot');
    if(skip) skip.addEventListener('click',()=>{play(click,.28); startBootTape(); clearInterval(timer); endBoot();});
  }
  function openArchive(){
    const target='archive/index.html';
    sessionStorage.setItem('pc_archive_access','granted');
    localStorage.setItem('pc_sound_requested','1');
    play(openFx,.36); startAmbience();
    let flash=document.querySelector('.access-flash');
    if(!flash){flash=document.createElement('div');flash.className='access-flash';flash.textContent='ACCESS GRANTED // OPENING ARCHIVE FLOOR';document.body.appendChild(flash)}
    flash.textContent='ACCESS GRANTED // OPENING ARCHIVE FLOOR';
    flash.classList.add('on');
    setTimeout(()=>{window.location.href=target},850);
  }

  const passwordForm=document.querySelector('[data-password-form]');
  if(passwordForm){
    const input=passwordForm.querySelector('[data-password-input]');
    const status=passwordForm.querySelector('[data-password-status]');
    const correct='Curse';
    const deny=()=>{
      play(click,.22);
      passwordForm.classList.remove('denied');
      void passwordForm.offsetWidth;
      passwordForm.classList.add('denied');
      if(status) status.textContent='ACCESS DENIED // PASSWORD MISMATCH';
      if(input){ input.value=''; input.focus(); }
      setTimeout(()=>{ if(status) status.textContent='RESTRICTED ARCHIVE // PASSWORD REQUIRED'; },1800);
    };
    passwordForm.addEventListener('submit',e=>{
      e.preventDefault();
      const value=(input?.value||'').trim();
      if(value===correct){
        if(status) status.textContent='ACCESS GRANTED // CURSE TRACE VERIFIED';
        passwordForm.classList.add('granted');
        openArchive();
      }else{
        deny();
      }
    });
    if(input){
      input.addEventListener('input',()=>{ if(status) status.textContent='VERIFYING INPUT STREAM...'; });
      // Do not auto-focus the password box; this prevents accidental audio unlock/retrigger on some browsers.
    }
  }

})();
