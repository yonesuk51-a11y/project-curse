// Project Curse 5.23.1 — boot and persistent shell audio asset owner.
(function(){
  'use strict';

  const prefix=()=>{
    const path=location.pathname||'';
    if(path.includes('/docs/')) return '../../';
    if(path.includes('/archive/')) return '../';
    return '';
  };
  const asset=(name)=>prefix()+'assets/audio/'+name;
  const audio={
    ambient:new Audio(asset('pc5152am_menu_old_computer.mp3')),
    contact:new Audio(asset('pc5152h_terminal_contact_clear.wav')),
    analog:new Audio(asset('pc5152f_analog_contact_soft.wav')),
    open:new Audio(asset('pc5152h_record_mount_clear.wav')),
    load:new Audio(asset('pc5152h_frame_pop.wav')),
    video:new Audio(asset('pc5152cf_sakuma_projector_advance.mp3')),
    radio:new Audio(asset('pc5152v_comm_line_cue_73_74.mp3')),
    page:new Audio(asset('pc5152p_internal_projector_vhs_step.wav')),
    scan:new Audio(asset('pc5152x_late_log_beep_195s.mp3')),
    marker:new Audio(asset('pc5152v_field_photo_click_42s.mp3')),
    confirm:new Audio(asset('pc5152h_frame_pop.wav')),
    boot:new Audio(asset('pc5152f_boot_access_oldpc.wav')),
    alert:new Audio(asset('pc5152f_low_denied_oldpc.wav')),
    restricted:new Audio(asset('pc5152f_low_denied_oldpc.wav')),
    denied:new Audio(asset('pc5152f_low_denied_oldpc.wav'))
  };
  audio.ambient.loop=true;
  audio.ambient.volume=.088;
  const volumes={contact:.055,analog:.048,open:.078,load:.055,video:.058,radio:.052,page:.058,scan:.05,marker:.054,confirm:.05,boot:.06,alert:.058,restricted:.064,denied:.06};
  Object.entries(volumes).forEach(([name,volume])=>{audio[name].volume=volume;});

  let ambientStarted=false;
  let ambientAllowed=true;
  let audioContext='shell';
  const lastCue=Object.create(null);

  function isOn(){
    try{return localStorage.getItem('pc_audio_legacy2003_fixed')!=='off';}catch(_e){return true;}
  }

  function playCue(name,cooldown=160){
    if(!isOn()) return;
    const key=String(name||'');
    if(['menu','drawer','command'].includes(key)) return;
    const target=audio[key];
    if(!target) return;
    const now=performance.now();
    if(lastCue[key]&&now-lastCue[key]<cooldown) return;
    lastCue[key]=now;
    try{target.currentTime=0;target.play().catch(()=>{});}catch(_e){}
  }

  function startAmbient(){
    if(!isOn()||!ambientAllowed||audioContext==='cinematic'||document.hidden) return;
    if(!audio.ambient.paused){ambientStarted=true;return;}
    ambientStarted=true;
    try{audio.ambient.play().catch(()=>{ambientStarted=false;});}catch(_e){ambientStarted=false;}
  }

  function stopMenuAmbient(){
    audioContext='cinematic';
    ambientAllowed=false;
    ambientStarted=false;
    try{audio.ambient.pause();}catch(_e){}
  }

  function resumeMenuAmbient(){
    audioContext='shell';
    ambientAllowed=true;
    startAmbient();
  }

  function setContext(next){
    audioContext=next==='cinematic'?'cinematic':next==='document'?'document':'shell';
    ambientAllowed=audioContext!=='cinematic';
    if(ambientAllowed) startAmbient();
    else{
      ambientStarted=false;
      try{audio.ambient.pause();}catch(_e){}
    }
    return audioContext;
  }

  function syncAudioState(){
    const inRecord=['pc5152h-sequence-open','pc5152i-sequence-intro-playing','pc5152q-immortality-sequence','pc5152h-cult-source-sequence']
      .some(name=>document.body?.classList.contains(name));
    if(inRecord) setContext('cinematic');
    else setContext(document.body?.classList.contains('pc-internal-document-open')?'document':'shell');
  }

  window.ProjectCurseAudio={audio,playCue,play:playCue,startAmbient,stopMenuAmbient,resumeMenuAmbient,setContext,syncAudioState,isOn,getContext:()=>audioContext};

  function finishBoot(){
    const loader=document.getElementById('loader');
    const app=document.getElementById('app');
    loader?.classList.add('hide');
    app?.classList.add('ready');
    document.body.classList.add('pc5121-boot-complete');
  }

  function boot(){
    const lines=Array.from(document.querySelectorAll('#bootLines p'));
    if(window.ProjectCurseLoading?.start){
      window.ProjectCurseLoading.start({playCue,finish:finishBoot});
      return;
    }
    if(window.__pc5152SkipBoot){
      lines.forEach(line=>line.classList.add('show'));
      finishBoot();
      return;
    }
    playCue('boot',1600);
    lines.forEach((line,index)=>setTimeout(()=>line.classList.add('show'),130+index*125));
    setTimeout(finishBoot,Math.max(1150,220+lines.length*125));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  const unlock=()=>{startAmbient();document.removeEventListener('pointerdown',unlock);document.removeEventListener('keydown',unlock);};
  document.addEventListener('pointerdown',unlock,{passive:true});
  document.addEventListener('keydown',unlock);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      try{audio.ambient.pause();}catch(_e){}
      ambientStarted=false;
    }else if(ambientAllowed&&audioContext!=='cinematic') startAmbient();
  });
})();
