// Project Curse 5.32.0 — live channel state and local performance telemetry.
(function(root){
  'use strict';

  const startedAt=Number(root.__pc5152BootStart)||performance.now();
  const metrics={
    navigation:{response:0,dom:0,load:0},resources:{count:0,transfer:0,decoded:0},
    vitals:{lcp:0,cls:0,longTasks:0,longTaskTime:0},boot:{mode:'pending',declared:0,complete:0,visible:0,skipped:false},
    transitions:{count:0,last:0,average:0,max:0,route:null}
  };
  const transitionStarts=new Map();
  let updateTimer=0;

  function finite(value){return Number.isFinite(Number(value))?Number(value):0;}
  function round(value){return Math.round(finite(value));}
  function emit(reason){
    clearTimeout(updateTimer);
    updateTimer=root.setTimeout(()=>document.dispatchEvent(new CustomEvent('projectcurse:telemetry-update',{detail:{reason,snapshot:getSnapshot()}})),16);
  }

  function collectNavigation(){
    const navigation=performance.getEntriesByType?.('navigation')?.[0];
    if(navigation){
      metrics.navigation.response=round(navigation.responseEnd);
      metrics.navigation.dom=round(navigation.domContentLoadedEventEnd);
      metrics.navigation.load=round(navigation.loadEventEnd);
    }
  }

  function collectResources(){
    const resources=performance.getEntriesByType?.('resource')||[];
    metrics.resources.count=resources.length;
    metrics.resources.transfer=round(resources.reduce((sum,item)=>sum+finite(item.transferSize),0));
    metrics.resources.decoded=round(resources.reduce((sum,item)=>sum+finite(item.decodedBodySize),0));
  }

  function observe(type,callback){
    try{
      const observer=new PerformanceObserver(list=>callback(list.getEntries()));
      observer.observe({type,buffered:true});
      return observer;
    }catch(_error){return null;}
  }

  observe('largest-contentful-paint',entries=>{
    entries.forEach(entry=>{metrics.vitals.lcp=Math.max(metrics.vitals.lcp,round(entry.startTime));});
  });
  observe('layout-shift',entries=>{
    entries.forEach(entry=>{if(!entry.hadRecentInput) metrics.vitals.cls+=finite(entry.value);});
  });
  observe('longtask',entries=>{
    metrics.vitals.longTasks+=entries.length;
    metrics.vitals.longTaskTime+=entries.reduce((sum,entry)=>sum+finite(entry.duration),0);
  });

  function stateSnapshot(){
    const operation=root.ProjectCurseOperationState?.getSummary?.()||null;
    const pilgrimages=Object.values(root.ProjectCursePilgrimageState?.getAllSummaries?.()||{});
    const verdicts=root.ProjectCurseVerdictArchiveState?.getSummary?.()||{unread:0,unlocked:0,total:0};
    const records=root.ProjectCurseArchive?.publicRecords?.length||0;
    const incidents=root.ProjectCurseIncidentNetwork?.incidentList?.length||0;
    const dossiers=root.ProjectCurseFactionAnalysis?.order?.length||0;
    const signals=root.ProjectCurseHomeIntelligence?.signals?.length||0;
    const activePilgrimages=pilgrimages.filter(item=>item.status==='active').length;
    const completePilgrimages=pilgrimages.filter(item=>item.status==='complete').length;
    const operationActive=operation&&!['resolved'].includes(operation.status)?1:0;
    return {operation,pilgrimages,verdicts,records,incidents,dossiers,signals,activePilgrimages,completePilgrimages,activeOperations:operationActive+activePilgrimages};
  }

  function getChannelStatus(id){
    const state=stateSnapshot();
    if(id==='terminal-home') return Object.freeze({value:String(state.signals),label:'SIGNALS',tone:state.signals?'warning':'stable',description:`현재 수신 신호 ${state.signals}건`});
    if(id==='map-room'){
      const value=state.activeOperations;
      return Object.freeze({value:String(value),label:value?'ACTIVE':'STANDBY',tone:value?'live':'stable',description:`활성 작전·순례 ${value}건`});
    }
    if(id==='history') return Object.freeze({value:String(state.incidents),label:'EVENTS',tone:'indexed',description:`연결 사건 ${state.incidents}건`});
    if(id==='faction-info') return Object.freeze({value:String(state.dossiers),label:'DOSSIERS',tone:'indexed',description:`분석 파일 ${state.dossiers}건`});
    if(id==='archive-entry'){
      const unread=state.verdicts.unread||0;
      return Object.freeze({value:String(unread||state.records),label:unread?'UNREAD':'OPEN',tone:unread?'alert':'stable',description:unread?`읽지 않은 판정 기록 ${unread}건`:`공개 기록 ${state.records}건`});
    }
    return Object.freeze({value:'--',label:'LOCAL',tone:'stable',description:'로컬 채널'});
  }

  function getSnapshot(){
    collectNavigation();
    collectResources();
    return Object.freeze({
      version:'1.0.0',navigation:Object.freeze({...metrics.navigation}),resources:Object.freeze({...metrics.resources}),
      vitals:Object.freeze({...metrics.vitals,cls:Number(metrics.vitals.cls.toFixed(4)),longTaskTime:round(metrics.vitals.longTaskTime)}),
      boot:Object.freeze({...metrics.boot}),transitions:Object.freeze({...metrics.transitions}),state:Object.freeze(stateSnapshot())
    });
  }

  document.addEventListener('projectcurse:boot-complete',event=>{
    metrics.boot.mode=event.detail?.mode||'unknown';
    metrics.boot.declared=round(event.detail?.duration);
    metrics.boot.complete=round(performance.now()-startedAt);
    metrics.boot.skipped=Boolean(event.detail?.skipped);
    collectResources();
    emit('boot-complete');
  });
  document.addEventListener('projectcurse:boot-hidden',event=>{
    metrics.boot.visible=round(event.detail?.elapsed||performance.now()-startedAt);
    collectResources();
    emit('boot-hidden');
  });
  document.addEventListener('projectcurse:route-will-change',event=>{
    transitionStarts.set(event.detail?.target||'unknown',performance.now());
  });
  document.addEventListener('projectcurse:transition-complete',event=>{
    const route=event.detail?.to||'unknown';
    const start=transitionStarts.get(route);
    if(!start) return;
    const duration=round(performance.now()-start);
    transitionStarts.delete(route);
    const total=metrics.transitions.average*metrics.transitions.count+duration;
    metrics.transitions.count+=1;
    metrics.transitions.last=duration;
    metrics.transitions.average=round(total/metrics.transitions.count);
    metrics.transitions.max=Math.max(metrics.transitions.max,duration);
    metrics.transitions.route=route;
    emit('transition');
  });
  ['projectcurse:operation-state-change','projectcurse:pilgrimage-state-change','projectcurse:verdict-archive-change'].forEach(name=>document.addEventListener(name,()=>emit(name)));
  root.addEventListener('load',()=>root.setTimeout(()=>{collectNavigation();collectResources();emit('load');},0),{once:true});

  root.ProjectCurseTelemetry=Object.freeze({version:'1.0.0',getSnapshot,getChannelStatus,refresh:()=>{collectNavigation();collectResources();emit('manual');return getSnapshot();}});
})(window);
