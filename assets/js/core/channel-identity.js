// Project Curse 5.30.0 — channel navigation, identity headers and local presentation preferences.
(function(root){
  'use strict';

  const ready=callback=>document.readyState==='loading'
    ? document.addEventListener('DOMContentLoaded',callback,{once:true})
    : callback();

  ready(function(){
    const data=root.ProjectCurseChannelData;
    const channels=data?.channels||[];
    const byId=new Map(channels.map(channel=>[channel.id,channel]));
    const rootElement=document.documentElement;
    const quickNav=document.getElementById('uacQuickNav');
    const shellStatus=document.querySelector('.uac-shell-status');
    const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
    let preferences=loadPreferences();
    let panel=null;
    let lastTrigger=null;
    let arrivalTimer=0;

    if(!channels.length) return;

    function loadPreferences(){
      try{
        const stored=JSON.parse(localStorage.getItem(data.storageKey)||'{}');
        return Object.assign({},data.defaults,stored&&typeof stored==='object'?stored:{});
      }catch(_error){
        return Object.assign({},data.defaults);
      }
    }

    function savePreferences(){
      try{localStorage.setItem(data.storageKey,JSON.stringify(preferences));}catch(_error){}
    }

    function audioLevels(){
      const interfaceLevels={full:{interface:1,record:1},minimal:{interface:.34,record:.58},off:{interface:0,record:0}};
      return Object.assign({ambient:preferences.ambient==='on'?1:0},interfaceLevels[preferences.interfaceAudio]||interfaceLevels.full);
    }

    function applyPreferences({persist=false}={}){
      const effectiveEffects=reduceMotion.matches?'reduced':preferences.effects;
      rootElement.dataset.pcEffects=effectiveEffects;
      rootElement.dataset.pcEffectsPreference=preferences.effects;
      rootElement.dataset.pcInterfaceAudio=preferences.interfaceAudio;
      rootElement.dataset.pcAmbient=preferences.ambient;
      rootElement.dataset.pcTextReveal=preferences.textReveal;
      root.ProjectCurseAudioControl?.update?.(audioLevels());
      if(persist) savePreferences();
      panel?.querySelectorAll('[data-pc-preference]').forEach(button=>{
        const selected=preferences[button.dataset.pcPreference]===button.dataset.pcValue;
        button.classList.toggle('is-active',selected);
        button.setAttribute('aria-pressed',selected?'true':'false');
      });
      const effective=panel?.querySelector('[data-pc-effective-effects]');
      if(effective) effective.textContent=reduceMotion.matches&&preferences.effects!=='reduced'
        ? '운영체제의 동작 줄이기 설정으로 REDUCED가 우선 적용 중이다.'
        : `현재 적용: ${String(effectiveEffects).toUpperCase()}`;
      document.dispatchEvent(new CustomEvent('projectcurse:preferences-change',{detail:{...preferences,effectiveEffects}}));
    }

    function setPreference(key,value){
      const definition=data.preferences?.[key];
      if(!definition?.options?.some(option=>option[0]===value)) return false;
      preferences=Object.assign({},preferences,{[key]:value});
      applyPreferences({persist:true});
      root.ProjectCurseAudioControl?.play?.('contact',{volume:.55});
      return true;
    }

    function navMarkup(channel){
      return `<i>${channel.index}</i><span><b>${channel.label}</b><small>${channel.code}</small></span><em aria-hidden="true">${channel.glyph}</em>`;
    }

    function enhanceNavigation(){
      if(!quickNav) return;
      channels.forEach((channel,index)=>{
        let link=quickNav.querySelector(`[data-uac-route="${channel.id}"]`);
        if(!link){
          link=document.createElement('a');
          link.href=`#${channel.id}`;
          link.dataset.uacRoute=channel.id;
          quickNav.insertBefore(link,quickNav.children[index]||null);
        }
        link.dataset.channelRoute=channel.id;
        link.dataset.channelTheme=channel.theme;
        link.setAttribute('aria-label',`${channel.index} ${channel.label}, ${channel.code}`);
        link.innerHTML=navMarkup(channel);
      });
      if(!quickNav.querySelector('.pc-mobile-preference-link')){
        const settings=document.createElement('button');
        settings.type='button';
        settings.className='pc-mobile-preference-link';
        settings.dataset.pcPreferencesOpen='';
        settings.setAttribute('aria-haspopup','dialog');
        settings.innerHTML='<i aria-hidden="true">◇</i><span><b>표시·음향 설정</b><small>DISPLAY / FX</small></span><em aria-hidden="true">CFG</em>';
        quickNav.appendChild(settings);
      }
    }

    function identityMarkup(channel){
      const metrics=channel.telemetry.map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
      return `<div class="pc-channel-identity-copy"><small><i>${channel.index}</i> / ${channel.code}</small><strong data-screen-heading>${channel.label}</strong><p>${channel.description}</p></div><dl>${metrics}</dl><div class="pc-channel-sigil" aria-hidden="true"><i></i><i></i><span>${channel.glyph}</span><b>${channel.index}</b></div>`;
    }

    function ensureIdentity(id){
      const channel=byId.get(id);
      const page=document.getElementById(id);
      if(!channel||!page) return null;
      page.dataset.channelIdentity=channel.id;
      page.dataset.channelTheme=channel.theme;
      let identity=page.querySelector(':scope > [data-channel-identity]');
      if(!identity){
        identity=document.createElement('header');
        identity.className='pc-channel-identity';
        identity.dataset.channelIdentity='header';
        identity.setAttribute('aria-label',`${channel.label} 채널 상태`);
        page.insertBefore(identity,page.firstElementChild||null);
      }
      identity.innerHTML=identityMarkup(channel);
      return identity;
    }

    function activateChannel(id,{animate=true}={}){
      const channel=byId.get(id)||channels[0];
      channels.forEach(item=>ensureIdentity(item.id));
      rootElement.dataset.pcChannel=channel.id;
      rootElement.dataset.pcChannelTheme=channel.theme;
      quickNav?.querySelectorAll('[data-channel-route]').forEach(control=>{
        if(control.dataset.channelRoute===channel.id) control.setAttribute('aria-current','page');
        else control.removeAttribute('aria-current');
      });
      const page=document.getElementById(channel.id);
      if(!page||!animate) return;
      clearTimeout(arrivalTimer);
      page.classList.remove('pc-channel-arrival');
      void page.offsetWidth;
      page.classList.add('pc-channel-arrival');
      arrivalTimer=setTimeout(()=>page.classList.remove('pc-channel-arrival'),1450);
    }

    function preferencePanelMarkup(){
      const groups=Object.entries(data.preferences).map(([key,definition])=>{
        const options=definition.options.map(([value,label])=>`<button type="button" data-pc-preference="${key}" data-pc-value="${value}" aria-pressed="false"><span>${label}</span></button>`).join('');
        return `<section class="pc-preference-group"><div><strong>${definition.label}</strong><p>${definition.description}</p></div><div class="pc-preference-options" role="group" aria-label="${definition.label}">${options}</div></section>`;
      }).join('');
      return `<div class="pc-preference-backdrop" data-pc-preferences-close></div><div class="pc-preference-dialog" role="dialog" aria-modal="true" aria-labelledby="pcPreferenceTitle"><header><div><small>PC-03 / LOCAL CONFIGURATION</small><h2 id="pcPreferenceTitle">표시·음향 설정</h2></div><button type="button" data-pc-preferences-close aria-label="설정 닫기">×</button></header><p class="pc-preference-intro">이 설정은 현재 브라우저에만 저장된다. 상단의 AUDIO LOCAL은 모든 음향을 즉시 끄는 전체 음소거다.</p>${groups}<footer><span data-pc-effective-effects></span><button type="button" data-pc-preferences-close>설정 완료</button></footer></div>`;
    }

    function buildPreferences(){
      if(!shellStatus||panel) return;
      const trigger=document.createElement('button');
      trigger.type='button';
      trigger.className='pc-preference-trigger';
      trigger.dataset.pcPreferencesOpen='';
      trigger.setAttribute('aria-haspopup','dialog');
      trigger.innerHTML='<i aria-hidden="true">◇</i><span>DISPLAY / FX</span>';
      shellStatus.insertBefore(trigger,shellStatus.lastElementChild||null);
      panel=document.createElement('section');
      panel.className='pc-preference-panel';
      panel.dataset.pcPreferencesPanel='';
      panel.hidden=true;
      panel.innerHTML=preferencePanelMarkup();
      document.body.appendChild(panel);
      panel.addEventListener('click',event=>{
        const preference=event.target.closest?.('[data-pc-preference]');
        if(preference) setPreference(preference.dataset.pcPreference,preference.dataset.pcValue);
        if(event.target.closest?.('[data-pc-preferences-close]')) closePreferences();
      });
      document.querySelectorAll('[data-pc-preferences-open]').forEach(control=>control.addEventListener('click',()=>openPreferences(control)));
    }

    function openPreferences(trigger){
      if(!panel) return;
      lastTrigger=trigger||document.activeElement;
      panel.hidden=false;
      document.body.classList.add('pc-preferences-open');
      applyPreferences();
      requestAnimationFrame(()=>panel.classList.add('is-open'));
      panel.querySelector('button')?.focus({preventScroll:true});
      root.ProjectCurseAudioControl?.play?.('open',{volume:.55});
    }

    function closePreferences(){
      if(!panel||panel.hidden) return;
      panel.classList.remove('is-open');
      document.body.classList.remove('pc-preferences-open');
      setTimeout(()=>{panel.hidden=true;lastTrigger?.focus?.({preventScroll:true});},180);
    }

    function diagnostics(){
      return {
        version:'5.30.0',channel:rootElement.dataset.pcChannel,
        identities:document.querySelectorAll(':scope body > .app [data-channel-identity="header"]').length,
        preferences:{...preferences},effectiveEffects:rootElement.dataset.pcEffects,
        navigation:quickNav?.querySelectorAll('[data-channel-route]').length||0
      };
    }

    enhanceNavigation();
    buildPreferences();
    applyPreferences();
    const initial=root.ProjectCurseShell?.getRoute?.()||document.body.dataset.route||'terminal-home';
    activateChannel(initial,{animate:false});

    document.addEventListener('projectcurse:screen-committed',event=>{
      requestAnimationFrame(()=>activateChannel(event.detail?.target||'terminal-home'));
    });
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&!panel?.hidden) closePreferences();
      if(event.key==='Tab'&&!panel?.hidden){
        const focusable=Array.from(panel.querySelectorAll('button:not([disabled])'));
        const first=focusable[0],last=focusable.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }
    });
    reduceMotion.addEventListener?.('change',()=>applyPreferences());

    root.ProjectCurseChannelIdentity=Object.freeze({
      version:'5.30.0',getChannel:id=>byId.get(id)||null,getPreferences:()=>({...preferences}),
      setPreference,openPreferences,closePreferences,refresh:()=>activateChannel(root.ProjectCurseShell?.getRoute?.()||'terminal-home',{animate:false}),
      getDiagnostics:diagnostics
    });
  });
})(window);
