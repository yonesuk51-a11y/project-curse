// Project Curse 5.43.0 — generated core-sound playback, persistent buses and route identities.
(function(root){
  'use strict';

  const manifest=root.ProjectCurseAudioManifest;
  const legacy=root.ProjectCurseAudio;
  if(!manifest||!legacy) return;

  const defaults={muted:false,master:1,ambient:1,interface:1,record:1,alert:1};
  const cueBus={ambient:'ambient',contact:'interface',analog:'interface',open:'record',load:'interface',video:'record',radio:'interface',page:'record',scan:'interface',marker:'interface',confirm:'interface',boot:'interface',alert:'alert',restricted:'alert',denied:'alert'};
  const baseVolumes={};
  const nodeGains=new WeakMap();
  const nodeBuses=new WeakMap();
  const activeByBus=new Map();
  const lastEvent=Object.create(null);
  const coreNodes=new Map();
  let profileId=document.body?.dataset.route||'terminal-home';
  let duckScale=1;
  let duckTimer=0;
  let pulseTimer=0;
  let blocked=false;
  let lastPlayed=null;
  let lastSound=null;

  const prefix=()=>{
    const path=location.pathname||'';
    if(path.includes('/docs/')) return '../../';
    if(path.includes('/archive/')) return '../';
    return '';
  };
  Object.entries(legacy.audio||{}).forEach(([name,node])=>{
    baseVolumes[name]=Number(node.volume)||0;
    nodeGains.set(node,1);
    nodeBuses.set(node,cueBus[name]||'interface');
  });
  Object.entries(manifest.sounds||{}).forEach(([id,definition])=>{
    const node=new Audio(prefix()+definition.src);
    node.preload='none';
    baseVolumes[id]=Number(definition.baseVolume)||.16;
    nodeGains.set(node,1);
    nodeBuses.set(node,definition.bus||'interface');
    coreNodes.set(id,node);
  });

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

  function profile(){return manifest.profiles?.[profileId]||manifest.profiles?.document||manifest.buses;}
  function volume(name,node){
    const bus=nodeBuses.get(node)||cueBus[name]||'interface';
    const profileGain=Number(profile()?.[bus]??1);
    const duck=bus==='ambient'?duckScale:1;
    return clamp((baseVolumes[name]??0)*clamp(state.master)*clamp(state[bus])*profileGain*(nodeGains.get(node)||1)*duck);
  }
  function applyNode(name,node){node.volume=state.muted?0:volume(name,node);}
  function allNodes(){return [...Object.entries(legacy.audio||{}),...Array.from(coreNodes.entries())];}
  function apply(){
    allNodes().forEach(([name,node])=>applyNode(name,node));
    document.documentElement.dataset.audio=state.muted?'muted':'on';
    document.documentElement.dataset.audioProfile=profileId;
    document.documentElement.dataset.audioIdentity=profile()?.identity||'LOCAL RELAY';
    document.documentElement.toggleAttribute('data-audio-blocked',blocked);
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
    else{
      legacy.audio?.ambient?.pause?.();
      activeByBus.forEach(node=>{try{node.pause();node.currentTime=0;}catch(_error){}});
      activeByBus.clear();
    }
    return {...state};
  }

  function pulse(bus){
    clearTimeout(pulseTimer);
    document.documentElement.dataset.audioPulse=bus;
    pulseTimer=root.setTimeout(()=>document.documentElement.removeAttribute('data-audio-pulse'),280);
  }

  function duckAmbient(target=1,duration=0){
    clearTimeout(duckTimer);
    duckScale=clamp(target);
    if(legacy.audio?.ambient) applyNode('ambient',legacy.audio.ambient);
    duckTimer=root.setTimeout(()=>{
      duckScale=1;
      if(legacy.audio?.ambient) applyNode('ambient',legacy.audio.ambient);
    },Math.max(0,Number(duration)||0));
  }

  function stopBus(bus){
    const node=activeByBus.get(bus);
    if(!node) return;
    try{node.pause();node.currentTime=0;}catch(_error){}
    activeByBus.delete(bus);
  }

  function playNode(node,{name,bus='interface',gain=1,rate=1,exclusive=true,priority=0,duck,duckMs,eventName=null}={}){
    if(!node||state.muted) return false;
    activeByBus.forEach((activeNode,activeBus)=>{if(activeNode===node) activeByBus.delete(activeBus);});
    if(priority>1){stopBus('interface');stopBus('record');}
    if(exclusive!==false) stopBus(bus);
    nodeBuses.set(node,bus);
    nodeGains.set(node,Number(gain)||1);
    node.playbackRate=Math.max(.72,Math.min(1.28,(Number(rate)||1)*(Number(profile()?.rate)||1)));
    applyNode(name,node);
    try{
      node.currentTime=0;
      const promise=node.play();
      if(promise?.then) promise.then(()=>{
        blocked=false;
        document.documentElement.removeAttribute('data-audio-blocked');
      }).catch(()=>{
        blocked=true;
        document.documentElement.setAttribute('data-audio-blocked','');
        document.dispatchEvent(new CustomEvent('projectcurse:audio-blocked',{detail:{event:eventName,sound:name}}));
      });
    }catch(_error){blocked=true;document.documentElement.setAttribute('data-audio-blocked','');}
    activeByBus.set(bus,node);
    node.onended=()=>{
      if(activeByBus.get(bus)===node) activeByBus.delete(bus);
      nodeGains.set(node,1);
      node.playbackRate=1;
      node.onended=null;
    };
    if(duck!==undefined) duckAmbient(duck,duckMs);
    pulse(bus);
    lastSound=name;
    return true;
  }

  function play(eventName){
    const event=manifest.events[eventName];
    if(!event||state.muted) return false;
    const now=performance.now();
    if(lastEvent[eventName]&&now-lastEvent[eventName]<event.cooldown) return false;
    const soundId=event.sound;
    const node=coreNodes.get(soundId)||legacy.audio?.[event.cue];
    const name=coreNodes.has(soundId)?soundId:event.cue;
    if(!node) return false;
    lastEvent[eventName]=now;
    const played=playNode(node,{name,bus:event.bus,gain:event.gain,rate:event.rate,exclusive:event.exclusive,priority:event.priority,duck:event.duck,duckMs:event.duckMs,eventName});
    if(played) lastPlayed=eventName;
    return played;
  }

  function preview(soundId){
    const definition=manifest.sounds?.[soundId];
    const node=coreNodes.get(soundId);
    if(!definition||!node) return false;
    const played=playNode(node,{name:soundId,bus:definition.bus,gain:.88,exclusive:true,eventName:'preview'});
    if(played) lastPlayed='preview';
    return played;
  }

  function setProfile(next){
    const resolved=manifest.profiles?.[next]?next:(manifest.profiles?.document?'document':'terminal-home');
    if(resolved!==profileId){
      stopBus('record');
      stopBus('interface');
      clearTimeout(duckTimer);
      duckScale=1;
    }
    profileId=resolved;
    apply();
    document.dispatchEvent(new CustomEvent('projectcurse:audio-profile-change',{detail:{profile:profileId,identity:profile()?.identity}}));
    return profileId;
  }

  document.addEventListener('click',event=>{
    const toggle=event.target.closest?.('[data-uac-audio-toggle]');
    if(!toggle) return;
    event.preventDefault();
    update({muted:!state.muted});
  });
  document.addEventListener('projectcurse:screen-committed',event=>setProfile(event.detail?.target||'terminal-home'));

  apply();
  root.ProjectCurseAudioControl=Object.freeze({
    play,
    preview,
    update,
    setProfile,
    toggle:()=>update({muted:!state.muted}),
    getCatalog:()=>Object.entries(manifest.sounds||{}).map(([id,definition])=>({id,...definition})),
    getState:()=>({...state}),
    getDiagnostics:()=>({profile:profileId,identity:profile()?.identity||'LOCAL RELAY',blocked,lastPlayed,lastSound,coreSounds:coreNodes.size,activeBuses:Array.from(activeByBus.keys()),duck:duckScale})
  });
})(window);
