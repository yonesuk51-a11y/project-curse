// Project Curse 5.43.0 — readable settings, core-sound laboratory and adaptive local preferences.
(function(root){
  'use strict';

  const preferenceFocusable='a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]), [role="button"], [contenteditable="true"]';

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
    let telemetryFrame=0;

    if(!channels.length) return;

    function loadPreferences(){
      try{
        const stored=JSON.parse(localStorage.getItem(data.storageKey)||'{}');
        const loaded=Object.assign({},data.defaults,stored&&typeof stored==='object'?stored:{});
        loaded.audioVolumes=Object.assign({},data.defaults.audioVolumes,stored?.audioVolumes||{});
        return loaded;
      }catch(_error){
        return Object.assign({},data.defaults,{audioVolumes:{...data.defaults.audioVolumes}});
      }
    }

    function safeFocus(target){
      if(!target||typeof target.focus!=='function') return false;
      try{target.focus({preventScroll:true});}
      catch(_error){
        try{target.focus();}
        catch(__error){return false;}
      }
      return true;
    }

    function focusablesForPanel(){
      if(!panel) return [];
      return Array.from(panel.querySelectorAll(preferenceFocusable)).filter(node=>{
        if(node.closest?.('[hidden]')) return false;
        return node.offsetParent!==null || node===document.activeElement || node.getClientRects().length>0 || node.tabIndex>=0;
      });
    }

    function focusInitialPreference(){
      if(!panel) return;
      const dialog=panel.querySelector('.pc-preference-dialog');
      const active=panel.querySelector('[data-pc-preference].is-active');
      const firstGroup=panel.querySelector('[data-pc-preference]');
      if(active) return safeFocus(active);
      if(firstGroup) return safeFocus(firstGroup);
      if(dialog) return safeFocus(dialog);
    }

    function savePreferences(){
      try{localStorage.setItem(data.storageKey,JSON.stringify(preferences));}catch(_error){}
    }

    function audioLevels(){
      const interfaceLevels={full:{interface:1,record:1},minimal:{interface:.34,record:.58},off:{interface:0,record:0}};
      const mode=interfaceLevels[preferences.interfaceAudio]||interfaceLevels.full;
      const mix=preferences.audioVolumes||data.defaults.audioVolumes;
      return {
        master:Number(mix.master),ambient:preferences.ambient==='on'?Number(mix.ambient):0,
        interface:Number(mix.interface)*mode.interface,record:Number(mix.record)*mode.record,alert:Number(mix.alert)
      };
    }

    function applyPreferences({persist=false}={}){
      const effectiveEffects=reduceMotion.matches?'reduced':preferences.effects;
      rootElement.dataset.pcEffects=effectiveEffects;
      rootElement.dataset.pcEffectsPreference=preferences.effects;
      rootElement.dataset.pcInterfaceAudio=preferences.interfaceAudio;
      rootElement.dataset.pcAmbient=preferences.ambient;
      rootElement.dataset.pcTextReveal=preferences.textReveal;
      root.ProjectCurseQuality?.setPreference?.(preferences.quality);
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
      renderAudioLab();
    }

    function setPreference(key,value){
      const definition=data.preferences?.[key];
      if(!definition?.options?.some(option=>option[0]===value)) return false;
      preferences=Object.assign({},preferences,{[key]:value});
      applyPreferences({persist:true});
      renderOverview();
      root.ProjectCurseAudioControl?.play?.('menu.select');
      return true;
    }

    function setAudioVolume(bus,value){
      if(!['master','ambient','interface','record','alert'].includes(bus)) return false;
      const safe=Math.max(0,Math.min(1,Number(value)));
      preferences=Object.assign({},preferences,{audioVolumes:Object.assign({},preferences.audioVolumes,{[bus]:safe})});
      applyPreferences({persist:true});
      return true;
    }

    function liveStatus(id){
      return root.ProjectCurseTelemetry?.getChannelStatus?.(id)||{value:'--',label:'LOCAL',tone:'stable',description:'로컬 채널'};
    }

    function navMarkup(channel){
      const status=liveStatus(channel.id);
      return `<i>${channel.index}</i><span><b>${channel.label}</b><small>${channel.code}</small></span><em class="pc-channel-live pc-channel-live--${status.tone}" aria-label="${status.description}"><b>${status.value}</b><small>${status.label}</small></em>`;
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
        settings.innerHTML='<i aria-hidden="true">◇</i><span><b>표시·음향 설정</b><small>DISPLAY / FX</small></span><em data-pc-mobile-quality aria-hidden="true">AUTO</em>';
        quickNav.appendChild(settings);
      }
    }

    function identityMarkup(channel){
      const status=liveStatus(channel.id);
      const rows=channel.telemetry.map(row=>[...row]);
      if(rows.length) rows[rows.length-1]=[status.label,status.value];
      const metrics=rows.map(([label,value],index)=>`<div${index===rows.length-1?' data-channel-live-metric':''}><dt>${label}</dt><dd>${value}</dd></div>`).join('');
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
      const group=key=>{
        const definition=data.preferences[key];
        if(!definition) return '';
        const options=definition.options.map(([value,label])=>`<button type="button" data-pc-preference="${key}" data-pc-value="${value}" aria-pressed="false"><span>${label}</span></button>`).join('');
        return `<section class="pc-preference-group" data-preference-group="${key}"><div><strong>${definition.label}</strong><p>${definition.description}</p></div><div class="pc-preference-options" role="group" aria-label="${definition.label}">${options}</div></section>`;
      };
      const visual=['quality','effects','textReveal'].map(group).join('');
      const audio=['interfaceAudio','ambient'].map(group).join('');
      const soundCatalog=(root.ProjectCurseAudioControl?.getCatalog?.()||Object.entries(root.ProjectCurseAudioManifest?.sounds||{}).map(([id,item])=>({id,...item})))
        .map((sound,index)=>`<button type="button" data-pc-sound-preview="${sound.id}" aria-label="${sound.label} 효과음 미리듣기"><i>${String(index+1).padStart(2,'0')}</i><span><b>${sound.label}</b><small>${sound.family} · ${sound.durationMs} MS</small></span><em aria-hidden="true">▶</em></button>`).join('');
      const mixLabels={master:'MASTER',ambient:'AMBIENT',interface:'INTERFACE',record:'RECORD',alert:'ALERT'};
      const mixers=Object.entries(mixLabels).map(([bus,label])=>`<label><span>${label}<b data-pc-audio-level="${bus}">100</b></span><input type="range" min="0" max="100" step="1" value="100" data-pc-audio-bus="${bus}" aria-label="${label} 음량"/></label>`).join('');
      const soundLab=`<details class="pc-sound-lab"><summary><span><small>CORE SOUND IDENTITY / PC-CORE-01</small><strong>효과음 실험실</strong><em>12종 공통 조작음을 듣고 버스별 음량을 조절한다.</em></span><b>열기</b></summary><div class="pc-sound-lab-body"><header><div><small>ACTIVE ACOUSTIC PROFILE</small><strong data-pc-sound-profile>LOCAL RELAY</strong><p data-pc-sound-status>12 CORE SIGNALS / PROJECT GENERATED</p></div><span data-pc-sound-pack>PCM · 48 KHZ</span></header><div class="pc-sound-mixer">${mixers}</div><div class="pc-sound-grid" role="group" aria-label="핵심 효과음 미리듣기">${soundCatalog}</div><p class="pc-sound-note">미리듣기는 현재 채널의 음색·재생 속도 프로필을 그대로 사용한다. 기록 영상과 기록글 전용 배경음은 이 패널에서 변경하지 않는다.</p></div></details>`;
      return `<div class="pc-preference-backdrop" data-pc-preferences-close></div><div class="pc-preference-dialog" role="dialog" aria-modal="true" aria-labelledby="pcPreferenceTitle"><header><div><small>PC-03 / LOCAL CONFIGURATION</small><h2 id="pcPreferenceTitle">표시·음향 설정</h2></div><button type="button" data-pc-preferences-close aria-label="설정 닫기">×</button></header><section class="pc-preference-overview" aria-live="polite"><i data-pc-overview-icon aria-hidden="true">◇</i><div><small>현재 적용 상태</small><strong data-pc-overview-title>환경 판독 중</strong><p data-pc-overview-copy>브라우저와 연결 상태에 맞는 설정을 확인하고 있다.</p></div><span data-pc-overview-health>CHECK</span><ul><li data-pc-overview-link>연결 확인</li><li data-pc-overview-media>미디어 확인</li><li data-pc-overview-audio>음향 확인</li></ul></section><div class="pc-preference-section"><header><small>01 / VISUAL & DELIVERY</small><strong>화면·전송</strong><p>화면의 움직임과 자료 전송량을 조절한다.</p></header>${visual}</div><div class="pc-preference-section"><header><small>02 / ACOUSTIC CHANNEL</small><strong>음향</strong><p>버튼·기록 효과음과 배경 환경음을 따로 제어한다.</p></header>${audio}${soundLab}</div><details class="pc-advanced-diagnostics"><summary><span><small>03 / ADVANCED DIAGNOSTICS</small><strong>고급 세션 진단</strong><em>문제가 있을 때 연결·성능 원자료를 확인한다.</em></span><b>열기</b></summary><div class="pc-advanced-diagnostics-body"><section class="pc-quality-diagnostics" aria-label="적응형 전송 품질"><header><div><small>ADAPTIVE DELIVERY POLICY</small><strong>전송·기기 판독</strong></div><span data-pc-quality-tier>SCANNING</span></header><dl><div><dt>LINK</dt><dd data-pc-quality="link">--</dd></div><div><dt>LATENCY</dt><dd data-pc-quality="rtt">--</dd></div><div><dt>MEMORY</dt><dd data-pc-quality="memory">--</dd></div><div><dt>CPU</dt><dd data-pc-quality="cores">--</dd></div></dl><p data-pc-quality-summary>현재 환경에 맞는 전송 정책을 계산하고 있다.</p></section><section class="pc-live-diagnostics" aria-label="현재 세션 성능"><header><div><small>LIVE SESSION TELEMETRY</small><strong>현재 세션 진단</strong></div><span>LOCAL ONLY</span></header><dl><div><dt>BOOT VISIBLE</dt><dd data-pc-telemetry="boot">WAIT</dd></div><div><dt>DOM READY</dt><dd data-pc-telemetry="dom">WAIT</dd></div><div><dt>TRANSFER</dt><dd data-pc-telemetry="transfer">WAIT</dd></div><div><dt>HANDOFF</dt><dd data-pc-telemetry="transition">STANDBY</dd></div><div><dt>SESSION</dt><dd data-pc-telemetry="session">0 S</dd></div><div><dt>JS HEAP</dt><dd data-pc-telemetry="heap">N/A</dd></div></dl><p data-pc-telemetry-summary>브라우저 내부 측정값을 수신하는 중이다.</p></section><button type="button" class="pc-diagnostics-refresh" data-pc-diagnostics-refresh>측정값 다시 읽기</button></div></details><footer><span data-pc-effective-effects></span><button type="button" data-pc-preferences-close>설정 완료</button></footer></div>`;
    }

    function renderAudioLab(){
      if(!panel) return;
      const state=root.ProjectCurseAudioControl?.getState?.()||audioLevels();
      const diagnostics=root.ProjectCurseAudioControl?.getDiagnostics?.()||{};
      panel.querySelectorAll('[data-pc-audio-bus]').forEach(input=>{
        const value=Math.round(Number(preferences.audioVolumes?.[input.dataset.pcAudioBus]??state[input.dataset.pcAudioBus]??1)*100);
        if(document.activeElement!==input) input.value=String(value);
        const label=panel.querySelector(`[data-pc-audio-level="${input.dataset.pcAudioBus}"]`);
        if(label) label.textContent=String(value).padStart(3,'0');
      });
      const profile=panel.querySelector('[data-pc-sound-profile]');
      if(profile) profile.textContent=`${String(diagnostics.identity||'LOCAL RELAY')} / ${String(diagnostics.profile||'terminal-home').toUpperCase()}`;
      const status=panel.querySelector('[data-pc-sound-status]');
      if(status) status.textContent=state.muted?'AUDIO MUTED — 상단 AUDIO LOCAL을 켜면 미리들을 수 있다.':`${diagnostics.coreSounds||12} CORE SIGNALS / ${diagnostics.lastSound?`LAST ${String(diagnostics.lastSound).toUpperCase()}`:'READY'}`;
    }

    function overviewCopy(quality,snapshot){
      const preference=quality?.preference||preferences.quality;
      const tier=quality?.tier||'balanced';
      const stressed=(snapshot?.vitals?.longTaskTime||0)>500;
      if(tier==='offline') return {title:'오프라인 열람 중',copy:'열린 기록과 저장된 진행은 유지된다. 연결 복구 후 시각 자료를 다시 요청할 수 있다.',health:'OFFLINE',tone:'offline'};
      if(preference==='data') return {title:'데이터 절약 고정',copy:'작은 이미지 후보를 우선하고 환경음·영상·다음 화면 선로딩을 억제한다.',health:stressed?'WATCH':'SAVING',tone:'constrained'};
      if(preference==='high') return {title:'고화질 고정',copy:'현재 연결에서 전체 시각 품질과 미디어 준비를 유지한다.',health:stressed?'WATCH':'FULL',tone:'full'};
      if(tier==='constrained') return {title:'데이터 절약 중',copy:'느린 연결 또는 제한된 기기를 감지해 무거운 전송과 효과를 자동으로 줄였다.',health:stressed?'WATCH':'AUTO SAVE',tone:'constrained'};
      if(tier==='balanced') return {title:'균형 모드 적용됨',copy:'연출의 흐름은 유지하면서 현재 환경에 맞춰 일부 전송 비용을 조절한다.',health:stressed?'WATCH':'BALANCED',tone:'balanced'};
      return {title:'자동 최적화됨',copy:'현재 연결과 기기 상태가 안정적이다. 전체 품질을 유지한다.',health:stressed?'WATCH':'STABLE',tone:'full'};
    }

    function formatDuration(ms){
      const seconds=Math.max(0,Math.round((Number(ms)||0)/1000));
      if(seconds<60) return `${seconds} S`;
      const minutes=Math.floor(seconds/60);return `${minutes} M ${seconds%60} S`;
    }

    function renderOverview(){
      if(!panel) return;
      const quality=root.ProjectCurseQuality?.getDiagnostics?.();
      const snapshot=root.ProjectCurseTelemetry?.getSnapshot?.();
      if(!quality) return;
      const copy=overviewCopy(quality,snapshot);
      const overview=panel.querySelector('.pc-preference-overview');
      if(overview) overview.dataset.tone=copy.tone;
      const title=panel.querySelector('[data-pc-overview-title]');if(title) title.textContent=copy.title;
      const description=panel.querySelector('[data-pc-overview-copy]');if(description) description.textContent=copy.copy;
      const health=panel.querySelector('[data-pc-overview-health]');if(health) health.textContent=copy.health;
      const link=panel.querySelector('[data-pc-overview-link]');if(link) link.textContent=quality.online?`${quality.effectiveType.toUpperCase()} 연결`:'연결 없음';
      const media=panel.querySelector('[data-pc-overview-media]');if(media) media.textContent=quality.allows.routeWarmup?'미디어 준비 허용':'미디어 준비 절약';
      const audio=panel.querySelector('[data-pc-overview-audio]');if(audio) audio.textContent=quality.allows.ambient&&preferences.ambient==='on'?'환경음 허용':'환경음 억제';
      const trigger=document.querySelector('[data-pc-trigger-quality]');if(trigger) trigger.textContent=String(quality.tier).toUpperCase();
      document.querySelectorAll('[data-pc-mobile-quality]').forEach(node=>{node.textContent=copy.health;});
    }

    function renderQuality(){
      if(!panel) return;
      const quality=root.ProjectCurseQuality?.getDiagnostics?.();
      if(!quality) return;
      const tier=panel.querySelector('[data-pc-quality-tier]');
      if(tier){tier.textContent=String(quality.tier).toUpperCase();tier.dataset.tier=quality.tier;}
      const values={
        link:quality.online?(quality.saveData?'SAVE DATA':quality.effectiveType.toUpperCase()):'OFFLINE',
        rtt:quality.rtt===null?'UNKNOWN':`${quality.rtt} MS`,
        memory:quality.memory===null?'UNKNOWN':`${quality.memory} GB`,
        cores:quality.cores===null?'UNKNOWN':`${quality.cores} THREADS`
      };
      Object.entries(values).forEach(([key,value])=>{const node=panel.querySelector(`[data-pc-quality="${key}"]`);if(node) node.textContent=value;});
      const summary=panel.querySelector('[data-pc-quality-summary]');
      if(summary) summary.textContent=`${quality.reason} / 이미지 사전 준비 ${quality.allows.routeWarmup?'허용':'억제'} / 환경음 전송 ${quality.allows.ambient?'허용':'억제'}`;
    }

    function formatBytes(bytes){
      const value=Number(bytes)||0;
      return value>=1048576?`${(value/1048576).toFixed(2)} MB`:`${Math.round(value/1024)} KB`;
    }

    function renderTelemetry(){
      if(!panel) return;
      const snapshot=root.ProjectCurseTelemetry?.getSnapshot?.();
      if(!snapshot) return;
      const values={
        boot:snapshot.boot.visible?`${(snapshot.boot.visible/1000).toFixed(2)} S`:(snapshot.boot.complete?`${(snapshot.boot.complete/1000).toFixed(2)} S`:'WAIT'),
        dom:snapshot.navigation.dom?`${snapshot.navigation.dom} MS`:'WAIT',
        transfer:formatBytes(snapshot.resources.transfer),
        transition:snapshot.transitions.last?`${snapshot.transitions.last} MS`:'STANDBY',
        session:formatDuration(snapshot.session?.visible),
        heap:snapshot.session?.usedHeap?formatBytes(snapshot.session.usedHeap):'N/A'
      };
      Object.entries(values).forEach(([key,value])=>{const node=panel.querySelector(`[data-pc-telemetry="${key}"]`);if(node) node.textContent=value;});
      const summary=panel.querySelector('[data-pc-telemetry-summary]');
      if(summary){
        const bootMode=String(snapshot.boot.mode||'pending').toUpperCase();
        const count=snapshot.transitions.count;
        summary.textContent=`${bootMode} / ${snapshot.resources.count} RESOURCES / CLS ${snapshot.vitals.cls.toFixed(3)}${count?` / 평균 전환 ${snapshot.transitions.average}ms`:''}`;
      }
    }

    function refreshLiveStatus(){
      cancelAnimationFrame(telemetryFrame);
      telemetryFrame=requestAnimationFrame(()=>{
        channels.forEach(channel=>{
          const control=quickNav?.querySelector(`[data-channel-route="${channel.id}"]`);
          if(control) control.innerHTML=navMarkup(channel);
          ensureIdentity(channel.id);
        });
        renderTelemetry();
        renderOverview();
      });
    }

    function buildPreferences(){
      if(!shellStatus||panel) return;
      const trigger=document.createElement('button');
      trigger.type='button';
      trigger.className='pc-preference-trigger';
      trigger.dataset.pcPreferencesOpen='';
      trigger.setAttribute('aria-haspopup','dialog');
      trigger.innerHTML='<i aria-hidden="true">◇</i><span>DISPLAY / FX</span><em data-pc-trigger-quality>AUTO</em>';
      shellStatus.insertBefore(trigger,shellStatus.lastElementChild||null);
      panel=document.createElement('section');
      panel.className='pc-preference-panel';
      panel.dataset.pcPreferencesPanel='';
      panel.hidden=true;
      panel.innerHTML=preferencePanelMarkup();
      const dialog=panel.querySelector('.pc-preference-dialog');
      const footer=dialog?.querySelector(':scope > footer');
      if(dialog&&footer){
        const scroll=document.createElement('div');scroll.className='pc-preference-scroll';
        Array.from(dialog.children).filter(node=>node!==dialog.firstElementChild&&node!==footer).forEach(node=>scroll.appendChild(node));
        dialog.insertBefore(scroll,footer);
        dialog.setAttribute('tabindex','-1');
      }
      document.body.appendChild(panel);
      panel.setAttribute('tabindex','-1');
      panel.addEventListener('click',event=>{
        const preference=event.target.closest?.('[data-pc-preference]');
        if(preference) setPreference(preference.dataset.pcPreference,preference.dataset.pcValue);
        const preview=event.target.closest?.('[data-pc-sound-preview]');
        if(preview){
          const played=root.ProjectCurseAudioControl?.preview?.(preview.dataset.pcSoundPreview);
          preview.classList.toggle('is-playing',Boolean(played));
          root.setTimeout(()=>preview.classList.remove('is-playing'),420);
          renderAudioLab();
        }
        if(event.target.closest?.('[data-pc-diagnostics-refresh]')){root.ProjectCurseQuality?.refresh?.();root.ProjectCurseTelemetry?.refresh?.();renderQuality();renderTelemetry();renderOverview();}
        if(event.target.closest?.('[data-pc-preferences-close]')) closePreferences();
      });
      panel.addEventListener('input',event=>{
        const mixer=event.target.closest?.('[data-pc-audio-bus]');
        if(mixer) setAudioVolume(mixer.dataset.pcAudioBus,Number(mixer.value)/100);
      });
      panel.querySelector('.pc-advanced-diagnostics')?.addEventListener('toggle',event=>{if(event.target.open){renderQuality();renderTelemetry();renderOverview();}});
      panel.querySelector('.pc-sound-lab')?.addEventListener('toggle',event=>{if(event.target.open) renderAudioLab();});
      document.querySelectorAll('[data-pc-preferences-open]').forEach(control=>control.addEventListener('click',()=>openPreferences(control)));
      renderTelemetry();
      renderQuality();
      renderOverview();
      renderAudioLab();

      document.addEventListener('mousedown',event=>{
        if(!panel||panel.hidden) return;
        if(event.target.closest?.('[data-pc-preferences-open]')) return;
        if(event.target.closest?.('.pc-preference-panel')) return;
        if(panel.hidden) return;
        closePreferences();
      },true);
    }

    function openPreferences(trigger){
      if(!panel) return;
      lastTrigger=trigger||document.activeElement;
      panel.hidden=false;
      document.body.classList.add('pc-preferences-open');
      applyPreferences();
      root.ProjectCurseTelemetry?.refresh?.();
      renderTelemetry();
      renderQuality();
      renderOverview();
      renderAudioLab();
      requestAnimationFrame(()=>panel.classList.add('is-open'));
      requestAnimationFrame(()=>{focusInitialPreference();});
      root.ProjectCurseAudioControl?.play?.('menu.open');
    }

    function closePreferences(){
      if(!panel||panel.hidden) return;
      panel.classList.remove('is-open');
      document.body.classList.remove('pc-preferences-open');
      root.ProjectCurseAudioControl?.play?.('menu.close');
      setTimeout(()=>{panel.hidden=true;safeFocus(lastTrigger);},180);
    }

    function diagnostics(){
      return {
        version:'5.43.0',channel:rootElement.dataset.pcChannel,
        identities:document.querySelectorAll(':scope body > .app [data-channel-identity="header"]').length,
        preferences:{...preferences},effectiveEffects:rootElement.dataset.pcEffects,
        navigation:quickNav?.querySelectorAll('[data-channel-route]').length||0,
        telemetry:root.ProjectCurseTelemetry?.getSnapshot?.()||null,
        quality:root.ProjectCurseQuality?.getDiagnostics?.()||null,
        audio:root.ProjectCurseAudioControl?.getDiagnostics?.()||null
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
    document.addEventListener('projectcurse:telemetry-update',refreshLiveStatus);
    document.addEventListener('projectcurse:quality-change',renderQuality);
    document.addEventListener('projectcurse:quality-change',renderOverview);
    document.addEventListener('projectcurse:audio-change',renderAudioLab);
    document.addEventListener('projectcurse:audio-profile-change',renderAudioLab);
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&!panel?.hidden) closePreferences();
      if(event.key==='Tab'&&!panel?.hidden){
        const focusable=focusablesForPanel();
        if(!focusable.length){ event.preventDefault(); return; }
        const first=focusable[0],last=focusable.at(-1);
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();safeFocus(last);}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();safeFocus(first);}
        else if(!focusable.includes(document.activeElement)){event.preventDefault();safeFocus(first);}
      }
    });
    reduceMotion.addEventListener?.('change',()=>applyPreferences());

    root.ProjectCurseChannelIdentity=Object.freeze({
      version:'5.43.0',getChannel:id=>byId.get(id)||null,getPreferences:()=>({...preferences,audioVolumes:{...preferences.audioVolumes}}),
      setPreference,setAudioVolume,openPreferences,closePreferences,refresh:()=>activateChannel(root.ProjectCurseShell?.getRoute?.()||'terminal-home',{animate:false}),
      getDiagnostics:diagnostics
    });
  });
})(window);
