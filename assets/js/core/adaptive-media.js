// Project Curse 5.33.0 — quality-aware image selection, recovery, route warmup, and diagnostics.
(function(root){
  'use strict';

  const manifest=root.ProjectCurseMediaManifest;
  if(!manifest) return;

  const stats={applied:0,responsive:0,original:0,ready:0,failed:0,warmups:0,warmHits:0};
  const reduceMotion=()=>root.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const policy=()=>{
    const tier=root.ProjectCurseQuality?.getState?.().tier;
    if(tier==='offline'||tier==='constrained') return 'conserve';
    if(tier==='balanced'||reduceMotion()) return 'reduced';
    return 'full';
  };
  const contextual=(requested,assetPath)=>{
    const raw=String(requested||'').replace(/\\/g,'/');
    const marker=raw.indexOf('assets/');
    return marker>=0?raw.slice(0,marker)+assetPath:assetPath;
  };
  const frameFor=image=>image.closest?.('figure,.pc-evidence-single,.pc-evidence-compare>div,[data-pc-media-frame]')||image.parentElement;

  function recoveryLayer(frame){
    if(!frame||frame.querySelector(':scope > .pc-media-recovery')) return frame?.querySelector(':scope > .pc-media-recovery')||null;
    const layer=document.createElement('span');layer.className='pc-media-recovery';layer.setAttribute('aria-hidden','true');
    const code=document.createElement('b');code.textContent='VISUAL SIGNAL';
    const status=document.createElement('small');status.textContent='ACQUISITION REQUESTED';status.dataset.pcMediaStatus='1';
    const scan=document.createElement('i');
    layer.append(code,status,scan);frame.append(layer);return layer;
  }

  function setState(image,state,copy){
    const frame=frameFor(image);if(!frame) return;
    frame.classList.remove('pc-media-idle','pc-media-loading','pc-media-decoding','pc-media-ready','pc-media-error');
    frame.classList.add(`pc-media-${state}`);frame.dataset.pcMediaState=state;
    const status=recoveryLayer(frame)?.querySelector('[data-pc-media-status]');if(status&&copy) status.textContent=copy;
  }

  function apply(image,requested,{mode='display',eager=false,sizes,decorate=true}={}){
    if(!(image instanceof HTMLImageElement)||!requested) return image;
    const descriptor=manifest.resolve(requested);const original=contextual(requested,manifest.normalize(requested));
    image.dataset.pcMedia='1';image.dataset.pcMediaMode=mode;image.dataset.pcMediaSource=manifest.normalize(requested);
    image.decoding='async';image.loading=eager?'eager':'lazy';image.fetchPriority=eager?'high':'auto';
    if(descriptor){image.width=descriptor.width;image.height=descriptor.height;}
    if(decorate) setState(image,'loading',mode==='original'?'ORIGINAL FRAME REQUESTED':'SIGNAL ACQUISITION');

    const token=String((Number(image.dataset.pcMediaToken)||0)+1);image.dataset.pcMediaToken=token;let loadHandled=false;
    const ready=()=>{
      if(image.dataset.pcMediaToken!==token||loadHandled) return;loadHandled=true;
      setState(image,'decoding','FRAME DECODING');
      const decoded=typeof image.decode==='function'?image.decode().catch(()=>{}):Promise.resolve();
      decoded.finally(()=>{
        if(image.dataset.pcMediaToken!==token) return;
        stats.ready++;setState(image,'ready','VISUAL RECORD RESTORED');
        image.dispatchEvent(new CustomEvent('projectcurse:media-ready',{bubbles:true,detail:{source:image.dataset.pcMediaSource,mode}}));
      });
    };
    const failed=()=>{if(image.dataset.pcMediaToken===token&&!loadHandled){loadHandled=true;stats.failed++;setState(image,'error',navigator.onLine===false?'OFFLINE / LOCAL FRAME UNAVAILABLE':'VISUAL DATA LOST');image.dispatchEvent(new CustomEvent('projectcurse:media-error',{bubbles:true,detail:{source:image.dataset.pcMediaSource,mode}}));}};
    image.addEventListener('load',ready,{once:true});image.addEventListener('error',failed,{once:true});

    image.removeAttribute('srcset');image.removeAttribute('sizes');stats.applied++;
    if(descriptor&&mode!=='original'){
      const variants=mode==='thumbnail'||policy()==='conserve'?descriptor.variants.slice(0,1):descriptor.variants;
      image.srcset=variants.map(item=>`${contextual(requested,item.src)} ${item.width}w`).join(', ');
      image.sizes=sizes||(mode==='thumbnail'?'(max-width: 760px) 78px, 92px':mode==='cinematic'?'(max-width: 760px) 94vw, 72vw':'(max-width: 760px) 94vw, 960px');
      image.src=contextual(requested,variants[0].src);stats.responsive++;
    }else{
      image.src=original;stats.original++;
    }
    if(image.complete&&image.naturalWidth) queueMicrotask(ready);
    return image;
  }

  function enhance(scope=document,{mode='display',eager=false}={}){
    const rootNode=scope?.querySelectorAll?scope:document;
    const nodes=[];
    if(rootNode instanceof HTMLImageElement) nodes.push(rootNode);
    nodes.push(...rootNode.querySelectorAll('img[data-pc-source],img:not([data-pc-media])'));
    nodes.forEach(image=>{
      const source=image.dataset.pcSource||image.getAttribute('src');
      if(source&&manifest.resolve(source)) apply(image,source,{mode:image.dataset.pcMediaMode||mode,eager:image.dataset.pcMediaEager==='1'||eager});
      else if(image.dataset.pcSource&&!image.getAttribute('src')) apply(image,source,{mode:image.dataset.pcMediaMode||mode,eager});
    });
    return nodes.length;
  }

  function preload(requested,{mode='display',timeout=520}={}){
    if(navigator.onLine===false||root.ProjectCurseQuality&&!root.ProjectCurseQuality.allows('routeWarmup')) return Promise.resolve(false);
    const descriptor=manifest.resolve(requested);if(!descriptor) return Promise.resolve(false);
    const conserve=policy()==='conserve';const target=mode==='thumbnail'||conserve?descriptor.variants[0]:descriptor.variants.at(-1);
    const src=contextual(requested,target.src);
    return new Promise(resolve=>{
      let settled=false;const image=new Image();const finish=value=>{if(settled)return;settled=true;clearTimeout(timer);resolve(value);};
      const timer=root.setTimeout(()=>finish(false),timeout);image.onload=()=>finish(true);image.onerror=()=>finish(false);image.decoding='async';image.src=src;
      if(image.complete&&image.naturalWidth) finish(true);
    });
  }

  async function prepareRoute(route,{timeout=520}={}){
    stats.warmups++;const page=document.getElementById(route);if(!page) return {route,requested:0,ready:0};
    if(root.ProjectCurseQuality&&!root.ProjectCurseQuality.allows('routeWarmup')) return {route,requested:0,ready:0,skipped:true,policy:policy()};
    const sources=Array.from(page.querySelectorAll('img[data-pc-source],img[src]')).map(image=>image.dataset.pcSource||image.getAttribute('src')).filter(source=>manifest.resolve(source));
    const unique=[...new Set(sources)].slice(0,2);if(!unique.length) return {route,requested:0,ready:0};
    const results=await Promise.all(unique.map(source=>preload(source,{timeout})));const ready=results.filter(Boolean).length;stats.warmHits+=ready;
    return {route,requested:unique.length,ready};
  }

  function getDiagnostics(){
    const resources=performance.getEntriesByType?.('resource')||[];
    const media=resources.filter(item=>/\/assets\/resources\//.test(item.name));
    return Object.freeze({...stats,policy:policy(),registered:Object.keys(manifest.assets).length,resourceRequests:media.length,transferBytes:media.reduce((sum,item)=>sum+(item.transferSize||0),0),decodedBytes:media.reduce((sum,item)=>sum+(item.decodedBodySize||0),0)});
  }

  function retryFailed(scope=document){
    const failed=Array.from(scope.querySelectorAll?.('.pc-media-error>img[data-pc-media]')||[]);
    failed.forEach(image=>apply(image,image.dataset.pcMediaSource,{mode:image.dataset.pcMediaMode||'display',eager:true}));
    return failed.length;
  }

  const boot=()=>enhance(document);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  document.addEventListener('projectcurse:quality-change',()=>enhance(document));
  root.addEventListener('online',()=>retryFailed());
  root.ProjectCurseMedia=Object.freeze({version:'1.1.0',apply,enhance,preload,prepareRoute,retryFailed,getDiagnostics,getPolicy:policy});
})(window);
