// Project Curse 5.23.2 — cold boot, session restore and archive return sequence.
(function(root){
  'use strict';

  const BUILD=()=>root.ProjectCurseBuild?.version||'5.23.2';
  const SESSION_KEY=()=>`pc_terminal_boot_${BUILD().replace(/[^a-z0-9]+/gi,'_')}`;
  const MODES={
    cold:{
      title:'로컬 단말기 기동',kicker:'U.A.C 폐쇄 기록 / PC-03',duration:7800,finishDelay:700,skippable:true,
      lines:[
        ['PC-03','로컬 커널 및 권한 검사','OK'],
        ['AUDIO','로컬 중계 채널 연결','LINKED'],
        ['ARCHIVE','폐쇄 기록 색인 복구','RECOVERED'],
        ['CARTO','관제 좌표 계층 동기화','PARTIAL'],
        ['RZ/881120','레드라인 흔적 검사','DETECTED']
      ],
      starts:[520,1650,2800,3950,5100],ends:[1300,2440,3590,4740,5890]
    },
    restore:{
      title:'세션 복원',kicker:'LOCAL SESSION / PC-03',duration:4800,finishDelay:520,skippable:false,
      lines:[
        ['SESSION','이전 로컬 세션 확인','FOUND'],
        ['CHANNEL','마지막 채널 상태 복구','RESTORED'],
        ['OPERATOR','현장 열람 권한 확인','LIMITED']
      ],
      starts:[500,1550,2600],ends:[1250,2300,3350]
    },
    returning:{
      title:'기록 언마운트',kicker:'ARCHIVE RETURN / PC-03',duration:1050,finishDelay:120,skippable:false,
      lines:[
        ['RECORD','활성 기록 채널 분리','UNMOUNTED'],
        ['ARCHIVE','공개 색인으로 복귀','READY']
      ],
      starts:[180,520],ends:[430,790]
    },
    reduced:{
      title:'세션 연결',kicker:'LOCAL ACCESS / PC-03',duration:3000,finishDelay:120,skippable:false,
      lines:[['ACCESS','로컬 단말 연결','READY']],starts:[360],ends:[1800]
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
    const finish=typeof options.finish==='function'?options.finish:()=>{};
    const mode=resolveMode();
    const config=MODES[mode];
    const startedAt=performance.now();
    const progressFloor=mode==='cold'?2:8;
    let completed=false;
    let timers=[];
    let progressValue=progressFloor;

    loader?.classList.add('pc-boot-mode-'+mode);
    loader?.setAttribute('data-boot-mode',mode);
    if(title) title.textContent=config.title;
    if(kicker) kicker.textContent=config.kicker;
    if(footer) footer.textContent=`BUILD ${BUILD()} / ${mode==='cold'?'COLD BOOT':mode==='restore'?'SESSION RESTORE':mode==='returning'?'ARCHIVE RETURN':'LOCAL ACCESS'}`;
    if(skip){
      skip.hidden=!config.skippable;
      skip.disabled=true;
    }

    function setProgress(value){
      const safe=Math.max(progressValue,Math.max(0,Math.min(100,Math.round(value))));
      progressValue=safe;
      if(progress) progress.style.setProperty('--boot-progress',safe+'%');
      if(percent) percent.textContent=String(safe).padStart(3,'0')+'%';
      loader?.setAttribute('aria-valuenow',String(safe));
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
      if(!skipped&&elapsed<config.duration-12){
        timers.push(root.setTimeout(()=>complete(),config.duration-elapsed));
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
      remember();
      if(skip) skip.disabled=true;
      if(footer) footer.textContent=`BUILD ${BUILD()} / ACCESS GRANTED`;
      document.dispatchEvent(new CustomEvent('projectcurse:boot-complete',{detail:{mode,skipped,duration:config.duration}}));
      root.setTimeout(finish,skipped?0:config.finishDelay);
    }

    if(mode==='cold') options.playCue?.('boot',2800);
    if(config.duration>0){
      const interval=root.setInterval(()=>{
        if(completed) return;
        const elapsed=Math.min(config.duration,performance.now()-startedAt);
        const ratio=elapsed/config.duration;
        const eased=1-Math.pow(1-ratio,1.45);
        setProgress(progressFloor+eased*(94-progressFloor));
      },80);
      timers.push(interval);
      const holdAt=Math.max(0,config.duration-1150);
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
    timers.push(root.setTimeout(()=>complete(),config.duration));

    if(config.skippable&&skip){
      timers.push(root.setTimeout(()=>{skip.disabled=false;},5600));
      skip.addEventListener('click',()=>complete({skipped:true}),{once:true});
    }

    return {mode,skip:()=>complete({skipped:true})};
  }

  root.ProjectCurseLoading=Object.freeze({start,resolveMode});
})(window);
