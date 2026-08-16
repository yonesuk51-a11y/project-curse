// Project Curse 5.16.0 — compact, skippable terminal boot sequence.
(function(root){
  'use strict';

  const SESSION_KEY='pc_terminal_boot_5_16';

  function start(options={}){
    const loader=document.getElementById('loader');
    const lines=Array.from(document.querySelectorAll('#bootLines [data-boot-stage]'));
    const progress=document.querySelector('[data-boot-progress]');
    const percent=document.querySelector('[data-boot-percent]');
    const skip=document.querySelector('[data-boot-skip]');
    const finish=typeof options.finish==='function'?options.finish:()=>{};
    let completed=false;
    let timers=[];

    function remember(){
      try{sessionStorage.setItem(SESSION_KEY,'seen');}catch(_error){}
    }

    function hasSeen(){
      try{return sessionStorage.getItem(SESSION_KEY)==='seen';}catch(_error){return false;}
    }

    function setProgress(value){
      const safe=Math.max(0,Math.min(100,Math.round(value)));
      if(progress) progress.style.setProperty('--boot-progress',safe+'%');
      if(percent) percent.textContent=String(safe).padStart(3,'0')+'%';
      loader?.setAttribute('aria-valuenow',String(safe));
    }

    function complete({instant=false}={}){
      if(completed) return;
      completed=true;
      timers.forEach(clearTimeout);
      timers=[];
      lines.forEach(line=>{
        line.classList.add('show','is-complete');
        const state=line.querySelector('[data-boot-state]');
        if(state) state.textContent=line.dataset.bootFinal||'OK';
      });
      setProgress(100);
      remember();
      if(skip) skip.disabled=true;
      root.setTimeout(finish,instant?0:180);
      document.dispatchEvent(new CustomEvent('projectcurse:boot-complete'));
    }

    const reduceMotion=root.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const returning=Boolean(root.__pc5152SkipBoot);
    if(returning||reduceMotion||hasSeen()){
      complete({instant:true});
      return {skip:()=>complete({instant:true})};
    }

    options.playCue?.('boot',1600);
    setProgress(4);
    lines.forEach((line,index)=>{
      timers.push(root.setTimeout(()=>{
        line.classList.add('show');
        const state=line.querySelector('[data-boot-state]');
        if(state) state.textContent='CHECK';
        setProgress(12+((index+1)/Math.max(lines.length,1))*74);
      },110+index*145));
      timers.push(root.setTimeout(()=>{
        line.classList.add('is-complete');
        const state=line.querySelector('[data-boot-state]');
        if(state) state.textContent=line.dataset.bootFinal||'OK';
      },205+index*145));
    });
    timers.push(root.setTimeout(()=>complete(),Math.max(1120,330+lines.length*145)));
    skip?.addEventListener('click',()=>complete({instant:true}),{once:true});
    return {skip:()=>complete({instant:true})};
  }

  root.ProjectCurseLoading=Object.freeze({start});
})(window);
