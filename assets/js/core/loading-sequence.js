// Project Curse 5.49.0 — one meaningful cold boot and lightweight return handoffs.
(function(root){
  'use strict';

  const BUILD=()=>root.ProjectCurseBuild?.version||'5.49.0';
  const SESSION_KEY=()=>`pc_terminal_boot_${BUILD().replace(/[^a-z0-9]+/gi,'_')}`;
  const MIN_VISIBLE_MS=0;
  const MODES={
    cold:{
      title:'로컬 단말기 기동',kicker:'U.A.C 폐쇄 기록 / PC-03',duration:3600,finishDelay:260,skippable:true,
      lines:[
        ['PC-03','로컬 커널 및 권한 검사','OK'],
        ['AUDIO','로컬 중계 채널 연결','LINKED'],
        ['ARCHIVE','폐쇄 기록 색인 복구','RECOVERED'],
        ['CARTO','관제 좌표 계층 동기화','PARTIAL'],
        ['RZ/881120','레드라인 흔적 검사','DETECTED'],
        ['ACCESS','현장 열람 권한 봉인','GRANTED']
      ],
      starts:[180,620,1080,1540,2100,2700],ends:[520,960,1420,1880,2460,3220]
    },
    restore:{
      title:'세션 복원',kicker:'LOCAL SESSION / PC-03',duration:700,finishDelay:80,skippable:false,
      lines:[
        ['SESSION','이전 로컬 세션 확인','FOUND'],
        ['CHANNEL','마지막 채널 상태 복구','RESTORED'],
        ['OPERATOR','현장 열람 권한 확인','LIMITED'],
        ['ACCESS','로컬 채널 재봉인','GRANTED']
      ],
      starts:[60,170,300,430],ends:[150,270,400,560]
    },
    returning:{
      title:'기록 언마운트',kicker:'ARCHIVE RETURN / PC-03',duration:420,finishDelay:40,skippable:false,
      lines:[
        ['RECORD','활성 기록 채널 분리','UNMOUNTED'],
        ['ARCHIVE','공개 색인으로 복귀','READY'],
        ['ACCESS','보관소 접근선 재연결','GRANTED']
      ],
      starts:[40,130,240],ends:[110,210,340]
    },
    reduced:{
      title:'세션 연결',kicker:'LOCAL ACCESS / PC-03',duration:280,finishDelay:30,skippable:false,
      lines:[['ACCESS','로컬 단말 연결','READY'],['CHANNEL','현재 채널 확인','RESTORED']],starts:[20,100],ends:[80,210]
    },
    skip:{title:'접근 승인',kicker:'LOCAL ACCESS / PC-03',duration:0,finishDelay:0,skippable:false,lines:[['ACCESS','로컬 단말 연결','READY']],starts:[0],ends:[0]}
  };

  function getQueryMode(){
    try{
      const mode=new URLSearchParams(location.search).get('boot');
      return ['full','restore','skip'].includes(mode)?mode:null;
    }catch(_error){return null;}
  }

  function hasSeen(){
    try{return sessionStorage.getItem(SESSION_KEY())==='seen';}catch(_error){return false;}
  }

  function remember(){
    try{sessionStorage.setItem(SESSION_KEY(),'seen');}catch(_error){}
  }

  function resolveMode(){
    const query=getQueryMode();
    if(query==='full') return 'cold';
    if(query==='restore') return 'restore';
    if(query==='skip') return 'skip';
    if(root.__pc5152SkipBoot) return 'returning';
    if(root.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'reduced';
    return hasSeen()?'restore':'cold';
  }

  function start(options={}){
    const loader=document.getElementById('loader');
    const title=document.querySelector('#loader .loader-title');
    const kicker=document.querySelector('#loader .sys-kicker');
    const lines=Array.from(document.querySelectorAll('#bootLines [data-boot-stage]'));
    const progress=document.querySelector('[data-boot-progress]');
    const percent=document.querySelector('[data-boot-percent]');
    const footer=document.querySelector('.pc-boot-footer > span');
    const skip=document.querySelector('[data-boot-skip]');
    const gates=Array.from(document.querySelectorAll('[data-boot-gate]'));
    const finish=typeof options.finish==='function'?options.finish:()=>{};
    const mode=resolveMode();
    const config=MODES[mode];
    const duration=mode==='skip'?0:(mode==='reduced'?config.duration:Math.max(config.duration,MIN_VISIBLE_MS));
    const startedAt=performance.now();
    const progressFloor=mode==='cold'?2:8;
    let completed=false;
    let timers=[];
    let progressValue=progressFloor;

    loader?.classList.add('pc-boot-mode-'+mode);
    loader?.classList.remove('is-authorized');
    loader?.setAttribute('data-boot-mode',mode);
    loader?.setAttribute('data-boot-phase','link');
    if(title) title.textContent=config.title;
    if(kicker) kicker.textContent=config.kicker;
    if(footer) footer.textContent=`BUILD ${BUILD()} / ${mode==='cold'?'COLD BOOT':mode==='restore'?'SESSION RESTORE':mode==='returning'?'ARCHIVE RETURN':'LOCAL ACCESS'}`;
    if(skip){
      skip.hidden=!config.skippable;
      skip.disabled=true;
    }

    function syncGates(value){
      const thresholds=[18,42,68,96];
      let activeIndex=thresholds.findIndex(threshold=>value<threshold);
      if(activeIndex<0) activeIndex=thresholds.length-1;
      gates.forEach((gate,index)=>{
        gate.classList.toggle('is-complete',value>=thresholds[index]);
        gate.classList.toggle('is-active',index===activeIndex&&value<100);
      });
      const phase=value<18?'link':value<42?'index':value<68?'verify':value<96?'access':'granted';
      loader?.setAttribute('data-boot-phase',phase);
    }

    function setProgress(value){
      const safe=Math.max(progressValue,Math.max(0,Math.min(100,Math.round(value))));
      progressValue=safe;
      if(progress) progress.style.setProperty('--boot-progress',safe+'%');
      if(percent) percent.textContent=String(safe).padStart(3,'0')+'%';
      loader?.setAttribute('aria-valuenow',String(safe));
      syncGates(safe);
    }

    function setLine(node,row,index){
      if(!row){node.classList.add('is-unused');return;}
      node.classList.remove('is-unused','show','is-complete','redline');
      const copy=node.querySelector('.pc-boot-line-copy');
      const state=node.querySelector('[data-boot-state]');
      const [code,text,final]=row;
      if(copy){
        copy.replaceChildren();
        const strong=document.createElement('b');
        strong.textContent=`[${code}]`;
        copy.append(strong,document.createTextNode(' '+text));
      }
      if(state) state.textContent='WAIT';
      node.dataset.bootFinal=final;
      node.dataset.bootStage=code.toLowerCase();
      if(code.includes('RZ')) node.classList.add('redline');
      node.style.setProperty('--boot-line-index',String(index));
    }

    lines.forEach((line,index)=>setLine(line,config.lines[index],index));
    setProgress(progressFloor);

    function complete({skipped=false}={}){
      if(completed) return;
      const elapsed=performance.now()-startedAt;
      if(!skipped&&elapsed<duration-12){
        timers.push(root.setTimeout(()=>complete(),duration-elapsed));
        return;
      }
      completed=true;
      timers.forEach(clearTimeout);
      timers=[];
      lines.filter(line=>!line.classList.contains('is-unused')).forEach(line=>{
        line.classList.add('show','is-complete');
        const state=line.querySelector('[data-boot-state]');
        if(state) state.textContent=line.dataset.bootFinal||'OK';
      });
      setProgress(100);
      loader?.classList.add('is-authorized');
      remember();
      if(skip) skip.disabled=true;
      if(footer) footer.textContent=`BUILD ${BUILD()} / ACCESS GRANTED / CHANNEL STABLE`;
      document.dispatchEvent(new CustomEvent('projectcurse:boot-complete',{detail:{mode,skipped,duration}}));
      root.setTimeout(finish,skipped?0:config.finishDelay);
    }

    if(mode==='cold') options.playCue?.('boot',2800);
    if(config.duration>0){
      const interval=root.setInterval(()=>{
        if(completed) return;
        const elapsed=Math.min(duration,performance.now()-startedAt);
        const ratio=elapsed/duration;
        const eased=1-Math.pow(1-ratio,1.45);
        setProgress(progressFloor+eased*(94-progressFloor));
      },80);
      timers.push(interval);
      const holdAt=Math.max(0,duration-1150);
      timers.push(root.setTimeout(()=>{
        if(footer&&!completed) footer.textContent=`BUILD ${BUILD()} / FINAL ACCESS HOLD`;
        setProgress(94);
      },holdAt));
    }
    config.lines.forEach((row,index)=>{
      const line=lines[index];
      if(!line) return;
      timers.push(root.setTimeout(()=>{
        line.classList.add('show');
        const state=line.querySelector('[data-boot-state]');
        if(state) state.textContent='CHECK';
        if(line.classList.contains('redline')) loader?.classList.add('has-redline');
        setProgress(8+((index+1)/config.lines.length)*76);
      },config.starts[index]||0));
      timers.push(root.setTimeout(()=>{
        line.classList.add('is-complete');
        const state=line.querySelector('[data-boot-state]');
        if(state) state.textContent=row[2];
      },config.ends[index]||0));
    });
    timers.push(root.setTimeout(()=>complete(),duration));

    if(config.skippable&&skip){
      timers.push(root.setTimeout(()=>{skip.disabled=false;},1200));
      skip.addEventListener('click',()=>complete({skipped:true}),{once:true});
    }

    return {mode,skip:()=>complete({skipped:true})};
  }

  root.ProjectCurseLoading=Object.freeze({start,resolveMode});
})(window);
