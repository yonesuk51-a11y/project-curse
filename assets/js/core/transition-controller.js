// Project Curse 5.32.0 — exit, quality-aware channel handoff and staged screen entry owner.
(function(root){
  'use strict';

  const manifest=root.ProjectCurseTransitions;
  if(!manifest) return;

  const wait=(ms)=>new Promise(resolve=>root.setTimeout(resolve,Math.max(0,ms)));
  const nextFrame=()=>new Promise(resolve=>root.requestAnimationFrame(()=>root.requestAnimationFrame(resolve)));
  const reduceMotion=()=>root.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const mobile=()=>root.matchMedia?.('(max-width: 760px)').matches;
  let running=false;

  function fields(){
    return {
      layer:document.getElementById('uacTransitionLayer'),
      from:document.querySelector('[data-transition-from]'),
      to:document.querySelector('[data-transition-to]'),
      code:document.querySelector('[data-transition-code]'),
      label:document.querySelector('[data-transition-label]'),
      status:document.querySelector('[data-transition-status]'),
      progress:document.querySelector('[data-transition-progress]')
    };
  }

  function cleanup(layer,outgoing,incoming){
    outgoing?.classList.remove('pc-screen-exiting');
    outgoing?.removeAttribute('data-pc-exit');
    incoming?.classList.remove('pc-screen-entering');
    incoming?.removeAttribute('data-pc-enter');
    if(layer){
      layer.classList.remove('is-visible','is-covering','is-revealing');
      layer.setAttribute('aria-hidden','true');
      layer.removeAttribute('data-transition-theme');
      layer.style.removeProperty('--pc-transition-accent');
    }
    document.documentElement.classList.remove('pc-channel-transition-active');
    document.documentElement.removeAttribute('data-transition-state');
  }

  async function run({from,to,commit,instant=false}={}){
    if(typeof commit!=='function') return null;
    const fromPreset=manifest.get(from);
    const toPreset=manifest.get(to);
    const nodes=fields();
    const timings=reduceMotion()?manifest.timings.reduced:(mobile()?manifest.timings.mobile:manifest.timings.desktop);
    if(instant||!nodes.layer){
      const result=commit();
      document.documentElement.dataset.channelTheme=toPreset.theme;
      return result;
    }

    running=true;
    let outgoing=document.getElementById(from);
    let incoming=null;
    const layer=nodes.layer;
    try{
      document.documentElement.classList.add('pc-channel-transition-active');
      document.documentElement.dataset.transitionState='exiting';
      layer.dataset.transitionTheme=toPreset.theme;
      layer.style.setProperty('--pc-transition-accent',toPreset.accent);
      layer.setAttribute('aria-hidden','false');
      if(nodes.from) nodes.from.textContent=fromPreset.code;
      if(nodes.to) nodes.to.textContent=toPreset.code;
      if(nodes.code) nodes.code.textContent=toPreset.request;
      if(nodes.label) nodes.label.textContent=toPreset.label;
      if(nodes.status) nodes.status.textContent='CHANNEL HANDOFF / LOCAL ONLY';
      if(nodes.progress) nodes.progress.style.setProperty('--pc-transition-progress','12%');

      outgoing?.setAttribute('data-pc-exit',fromPreset.exit);
      outgoing?.classList.add('pc-screen-exiting');
      layer.classList.add('is-visible');
      root.ProjectCurseAudioControl?.play?.('channel.request');
      await nextFrame();
      await wait(timings.exit);

      document.documentElement.dataset.transitionState='switching';
      layer.classList.add('is-covering');
      if(nodes.status) nodes.status.textContent=root.ProjectCurseMedia?'VISUAL CHANNEL ACQUISITION':'CHANNEL BUFFER ACQUISITION';
      if(nodes.progress) nodes.progress.style.setProperty('--pc-transition-progress','54%');
      await wait(timings.cover);

      if(root.ProjectCurseMedia&&!reduceMotion()&&(!root.ProjectCurseQuality||root.ProjectCurseQuality.allows('routeWarmup'))){
        const mediaHold=mobile()?360:520;
        const prepared=await root.ProjectCurseMedia.prepareRoute(to,{timeout:mediaHold});
        if(nodes.status) nodes.status.textContent=prepared.requested?`${prepared.ready} / ${prepared.requested} VISUAL FRAMES READY`:toPreset.status;
      }else if(nodes.status) nodes.status.textContent=root.ProjectCurseQuality&&!root.ProjectCurseQuality.allows('routeWarmup')?'CONSERVATION HANDOFF / PRELOAD BYPASSED':toPreset.status;
      if(nodes.progress) nodes.progress.style.setProperty('--pc-transition-progress','76%');

      const result=commit();
      incoming=document.getElementById(to);
      document.documentElement.dataset.channelTheme=toPreset.theme;
      incoming?.setAttribute('data-pc-enter',toPreset.enter);
      incoming?.classList.add('pc-screen-entering');
      outgoing?.classList.remove('pc-screen-exiting');
      outgoing?.removeAttribute('data-pc-exit');
      await nextFrame();

      document.documentElement.dataset.transitionState='entering';
      layer.classList.remove('is-covering');
      layer.classList.add('is-revealing');
      if(nodes.progress) nodes.progress.style.setProperty('--pc-transition-progress','100%');
      root.ProjectCurseAudioControl?.play?.(toPreset.sound);
      await wait(timings.enter);
      cleanup(layer,outgoing,incoming);
      document.dispatchEvent(new CustomEvent('projectcurse:transition-complete',{detail:{from,to,theme:toPreset.theme}}));
      return result;
    }catch(error){
      try{commit();}catch(_commitError){}
      cleanup(layer,outgoing,incoming);
      document.dispatchEvent(new CustomEvent('projectcurse:transition-error',{detail:{from,to,error}}));
      return document.getElementById(to);
    }finally{
      running=false;
    }
  }

  root.ProjectCurseTransition=Object.freeze({run,isRunning:()=>running,getPreset:id=>manifest.get(id)});
})(window);
