// Project Curse 5.16.0 — persistent audio preference and semantic event bridge.
(function(root){
  'use strict';

  const manifest=root.ProjectCurseAudioManifest;
  const legacy=root.ProjectCurseAudio;
  if(!manifest||!legacy) return;

  const defaults={muted:false,master:1,ambient:1,interface:1,record:1,alert:1};
  const cueBus={ambient:'ambient',open:'record',load:'record',video:'record',radio:'record',page:'record',boot:'interface',alert:'alert',restricted:'alert',denied:'alert'};
  const baseVolumes={};
  Object.entries(legacy.audio||{}).forEach(([name,node])=>{baseVolumes[name]=Number(node.volume)||0;});

  function clamp(value){return Math.max(0,Math.min(1,Number(value)));}
  function load(){
    try{
      const saved=localStorage.getItem(manifest.storageKey);
      if(saved) return {...defaults,...JSON.parse(saved)};
      return {...defaults,muted:localStorage.getItem('pc_audio_legacy2003_fixed')==='off'};
    }
    catch(_error){return {...defaults};}
  }
  let state=load();

  function save(){
    try{
      localStorage.setItem(manifest.storageKey,JSON.stringify(state));
      localStorage.setItem('pc_audio_legacy2003_fixed',state.muted?'off':'on');
    }catch(_error){}
  }

  function apply(){
    Object.entries(legacy.audio||{}).forEach(([name,node])=>{
      const bus=cueBus[name]||'interface';
      node.volume=state.muted?0:clamp((baseVolumes[name]||0)*clamp(state.master)*clamp(state[bus]));
    });
    document.documentElement.dataset.audio=state.muted?'muted':'on';
    document.querySelectorAll('[data-uac-audio-toggle]').forEach(button=>{
      button.setAttribute('aria-pressed',state.muted?'true':'false');
      button.setAttribute('aria-label',state.muted?'로컬 오디오 켜기':'로컬 오디오 끄기');
      const label=button.querySelector('[data-audio-label]');
      if(label) label.textContent=state.muted?'AUDIO MUTED':'AUDIO LOCAL';
    });
  }

  function update(patch){
    state={...state,...patch};
    ['master','ambient','interface','record','alert'].forEach(key=>{state[key]=clamp(state[key]);});
    state.muted=Boolean(state.muted);
    save();
    apply();
    document.dispatchEvent(new CustomEvent('projectcurse:audio-change',{detail:{...state}}));
    if(!state.muted) legacy.startAmbient?.();
    else legacy.audio?.ambient?.pause?.();
    return {...state};
  }

  function play(eventName){
    const event=manifest.events[eventName];
    if(!event||state.muted) return false;
    legacy.playCue(event.cue,event.cooldown);
    return true;
  }

  document.addEventListener('click',event=>{
    const toggle=event.target.closest?.('[data-uac-audio-toggle]');
    if(!toggle) return;
    event.preventDefault();
    update({muted:!state.muted});
  });

  apply();
  root.ProjectCurseAudioControl=Object.freeze({
    play,
    update,
    toggle:()=>update({muted:!state.muted}),
    getState:()=>({...state})
  });
})(window);
