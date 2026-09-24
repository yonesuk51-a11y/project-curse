import vm from 'node:vm';
import assert from 'node:assert/strict';

// Replay the original state owners as an independent oracle, including reactive variants.
export default function verifyMap({add,read,context,app,historyIds,archiveIds,opIds}) {
  const source=read('assets/app/js/screens/map.js').replace(/\r\n/g,'\n');
  const stateSource=read('assets/app/js/pc-state.js').replace(/\r\n/g,'\n');
  const legacyMap=read('tools/fixtures/legacy-app/assets/js/pages/map-room.js').replace(/\r\n/g,'\n');
  const stateSources=['operation-state','pilgrimage-state','verdict-archive-state'].map(n=>read(`tools/fixtures/legacy-app/assets/js/core/${n}.js`));
  const equal=(a,b)=>assert.equal(JSON.stringify(a),JSON.stringify(b));
  const check=(name,run)=>{try{const result=run();add(name,true,result||'');}catch(error){add(name,false,error.message);}};
  function runtime(modern,seed={}) {
    const storage=new Map(Object.entries(seed));
    const listeners=new Map();
    const c={...context,Date:class extends Date{constructor(...args){super(...(args.length?args:['2042-01-02T03:04:05Z']));}static now(){return 2272244645000;}},
      localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
      document:{addEventListener:(n,f)=>{if(!listeners.has(n))listeners.set(n,[]);listeners.get(n).push(f);},dispatchEvent:e=>{for(const f of listeners.get(e.type)||[])f(e);}},
      CustomEvent:class {constructor(type,options){this.type=type;Object.assign(this,options);}}
    };
    c.window=c;vm.createContext(c);
    if(modern)vm.runInContext(stateSource,c);
    else stateSources.forEach(s=>vm.runInContext(s,c));
    return {P:c.ProjectCursePilgrimageState,V:c.ProjectCurseVerdictArchiveState,O:c.ProjectCurseOperationState,storage};
  }
  check('copied-operation-text-verbatim',()=>{
    const old=runtime(false);equal(old.O.canonBoundary,context.ProjectCurseMapScreenData.canonBoundary);equal(old.O.decisions,context.ProjectCurseMapScreenData.decisions);
  });
  check('copied-theaters-and-site-mappings-verbatim',()=>{
    const c={};vm.createContext(c);
    for(const key of ['theaters','scenarioStageByItem']){
      const pattern=key==='theaters'?/const theaters=\[[\s\S]*?\n    \];/:/const scenarioStageByItem=\{[\s\S]*?\n    \};/;
      const match=legacyMap.match(pattern);assert.ok(match,key);vm.runInContext(match[0]+`;this.result=${key};`,c);equal(c.result,context.ProjectCurseMapScreenData[key]);
    }
  });
  check('operation-four-decisions-and-reload-parity',()=>{
    for(const decision of Object.keys(context.ProjectCurseMapScreenData.decisions)){
      const old=runtime(false),next=runtime(true);
      assert.equal(next.O.chooseVerdict(decision),false);
      for(const id of old.O.branchIds){old.O.visitBranch(id);next.O.visitBranch(id);equal(old.O.get(),next.O.get());}
      old.O.chooseVerdict(decision);next.O.chooseVerdict(decision);equal(old.O.getSummary(),next.O.getSummary());
      for(const step of [-1,2,99]){old.O.setMapStep(step);next.O.setMapStep(step);equal(old.O.get(),next.O.get());}
      equal(runtime(true,Object.fromEntries(old.storage)).O.getSummary(),old.O.getSummary());
    }
  });
  check('all-reactive-pilgrimage-paths-and-verdict-documents',()=>{
    const old=runtime(false),next=runtime(true);let states=0,ends=0;const reached=new Set();
    for(const id of Object.keys(context.ProjectCursePilgrimageData.scenarios)){
      const queue=[[]];
      while(queue.length){
        const path=queue.pop();old.P.reset(id);next.P.reset(id);old.P.start(id);next.P.start(id);
        for(const choice of path){assert.ok(old.P.choose(choice,id));assert.ok(next.P.choose(choice,id));}
        equal(old.P.get(id),next.P.get(id));equal(old.P.getSummary(id),next.P.getSummary(id));equal(old.P.getStage(id),next.P.getStage(id));states++;
        if(old.P.get(id).status==='complete'){
          ends++;reached.add(`${id}/${old.P.get(id).ending}`);equal(old.V.list(),next.V.list());
          for(const entry of old.V.list().filter(e=>e.unlocked))equal(old.V.getDocument(entry.id),next.V.getDocument(entry.id));
        }else{
          assert.ok(path.length<8,'scenario failed to terminate');
          for(const choice of old.P.getStage(id).choices)queue.push([...path,choice.id]);
        }
      }
    }
    assert.equal(reached.size,10);return `${states} states / ${ends} terminal paths / ${reached.size} endings`;
  });
  check('legacy-v1-and-corrupt-save-migration',()=>{
    const seeds=[{pc_pilgrimage_state_v1:JSON.stringify({status:'active',step:2,signal:42,fear:33,corruption:22})},
      {pc_pilgrimage_states_v2:'broken-json',pc_operation_broken_crown_v1:'broken-json',pc_verdict_archive_state_v1:'broken-json'},
      {pc_operation_broken_crown_v1:JSON.stringify({visited:['signal','bad','signal'],mapStep:999,verdict:'bad'}),pc_pilgrimage_states_v2:JSON.stringify({states:{'deadzone-return':{status:'oops',step:999,metrics:{exposure:999,identity:-10}}}})}];
    for(const seed of seeds){const a=runtime(false,seed),b=runtime(true,seed);equal(a.P.getAllSummaries(),b.P.getAllSummaries());equal(a.O.get(),b.O.get());equal(a.V.list(),b.V.list());}
    assert.throws(()=>runtime(true).P.get('absent-scenario'),/Unknown/);
  });
  check('verdict-read-reset-delete-and-snapshot-parity',()=>{
    const a=runtime(false),b=runtime(true),id='deadzone-return';
    for(const r of [a,b]){r.P.start(id);while(r.P.get(id).status==='active')r.P.choose(r.P.getStage(id).choices[0].id,id);}
    const entry=a.V.list().find(e=>e.unlocked),record=b.V.getDocument(entry.id);
    for(const r of [a,b])r.V.markRead(entry.id);equal(a.V.list(),b.V.list());
    for(const r of [a,b])r.V.resetRead();equal(a.V.list(),b.V.list());
    for(const r of [a,b])r.P.reset(id);equal(a.V.list(),b.V.list());equal(record,b.V.getDocument(entry.id));
    for(const r of [a,b]){r.P.start(id);while(r.P.get(id).status==='active')r.P.choose(r.P.getStage(id).choices[0].id,id);r.V.clearScenario(id);r.V.capture(id);}
    equal(a.V.list(),b.V.list());assert.equal(b.V.isUnlocked(entry.id),false);
    equal(runtime(true,Object.fromEntries(b.storage)).V.list(),b.V.list());
    for(const r of [a,b])r.V.clearAll();equal(a.V.list(),b.V.list());
  });
  check('slot-and-new-runtime-only',()=>{
    assert.match(app,/<!-- slot:map-data -->\s*<script src="assets\/js\/data\/map-screen-data\.js\?v=6\.0\.0(?:-[0-9a-f]{8})?"><\/script>/);
    assert.doesNotMatch(app,/<script src="assets\/js\/(?:pages\/map-room|pages\/pilgrimage-scenario|core\/(?:pilgrimage|operation|verdict-archive)-state)/);
    assert.doesNotMatch(source,/innerHTML|insertAdjacentHTML|createElement\(/);
  });
  check('map-geometry-and-complete-catalog',()=>{
    const d=context.ProjectCurseMapRoom;assert.equal(d.operations.length,5);assert.equal(d.drilldowns.length,8);
    assert.equal(d.synchronyEvents[0].points.length,10);assert.equal(context.ProjectCurseMapSignalIndex.items.length,29);
    for(const op of d.operations)for(const s of op.steps){assert.ok(s.time&&s.title&&s.note&&s.route.length);for(const u of s.units)assert.ok(['normal','unstable','split','unknown','lost'].includes(u.status));}
    for(const d of context.ProjectCurseMapRoom.drilldowns)for(const r of d.routes)for(const id of r.siteIds)assert.ok(d.sites.some(s=>s.id===id),id);
    for(const e of d.synchronyEvents)assert.ok(historyIds.has(e.history));
    for(const s of Object.values(context.ProjectCursePilgrimageData.scenarios)){assert.ok(opIds.has(s.operation));for(const id of s.records)assert.ok(archiveIds.has(id)||context.ProjectCurseVerdictArchiveData.records?.some(e=>e.id===id),id);}
  });
  check('playback-lifecycle-and-motion-guard',()=>{
    for(const token of ['PC.missing(',"PC.screen({id:'map-room'",'root.clearInterval(timer)','controller?.abort()',"reduced.matches||view?.kind!=='op'",'root.document.hidden',"event.key===' '","['ArrowLeft','ArrowRight']","if(state.layers.routes&&!syncEvent)","if(state.layers.synchrony)"] )assert.ok(source.includes(token),token);
    assert.match(read('assets/app/css/screens/map.css'),/@media \(prefers-reduced-motion: reduce\)/);
  });
  check('screen-routes-search-and-playback-execution',()=>{
    class Target {
      constructor(){this.events=new Map();}
      addEventListener(type,fn,opts={}){if(!this.events.has(type))this.events.set(type,new Set());this.events.get(type).add(fn);opts.signal?.addEventListener('abort',()=>this.events.get(type).delete(fn),{once:true});}
      emit(type,target,key){for(const fn of [...this.events.get(type)||[]])fn({type,target,key,preventDefault(){},detail:{}});}
      dispatchEvent(e){for(const fn of [...this.events.get(e.type)||[]])fn(e);}
    }
    class Element extends Target {
      constructor(spec,props,...children){super();this.spec=spec;this.tag=spec.split(/[.#]/)[0];this.id=spec.match(/#([\w-]+)/)?.[1]||'';this.dataset={};this.attrs={};this.children=[];this.isConnected=true;Object.assign(this,props?.dataset?{dataset:props.dataset}:{});for(const [k,v] of Object.entries(props||{})){if(k==='text')this.textContent=v;else if(k!=='dataset')this.setAttribute(k,v);}this.append(...children);}
      append(...items){this.children.push(...items.flat(Infinity).filter(x=>x!=null&&x!==false));}
      replaceChildren(...items){this.children=[];this.append(...items);}
      setAttribute(k,v){this.attrs[k]=v;if(k==='value'||k==='disabled')this[k]=v;}
      get textContent(){return this.children.map(c=>typeof c==='object'?c.textContent:String(c)).join('');}
      set textContent(value){this.children=[String(value)];}
      all(){return [this,...this.children.filter(c=>c instanceof Element).flatMap(c=>c.all())];}
      querySelectorAll(selector){return this.all().filter(n=>selector[0]==='#'?n.id===selector.slice(1):selector==='[data-control]'?!!n.dataset.control:selector==='[data-action="filter"]'?n.dataset.action==='filter':selector.includes('data-tc-focus')?n.tag==='h2':false);}
      querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
      contains(node){return this.all().includes(node);}
      focus(){c.document.activeElement=this;}
      closest(selector){if(selector==='[data-action]')return this.dataset.action?this:null;if(selector.startsWith('input'))return this.tag==='input'?this:null;if(selector.startsWith('a,summary'))return this.tag==='a'||this.tag==='summary'||this.tag==='button'&&this.dataset.action!=='play'?this:null;return null;}
    }
    const h=(...args)=>new Element(...args),timers=new Map();let nextTimer=0,screen;
    const c={...context,AbortController,document:new Target(),localStorage:{getItem:()=>null,setItem(){},removeItem(){}},sessionStorage:{getItem:()=>null,setItem(){}},
      CustomEvent:class{constructor(type,props){this.type=type;Object.assign(this,props);}},
      getComputedStyle:()=>({getPropertyValue:()=> '#8d9c77'}),scrollY:0,scrollTo(){},location:{href:'http://localhost/index.html#map-room'},navigator:{},
      setInterval:fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearInterval:id=>timers.delete(id)};
    const media=new Target();media.matches=false;c.matchMedia=()=>media;
    c.PCApp={h,screen:s=>{screen=s;},href:(...p)=>'#'+p.join('/'),go(){},back(){},setTitle(){},clear:el=>{el.replaceChildren();return el;},tag:t=>h('span',null,t),verdictTone:()=> 'info',missing:(code,key,text)=>h('div',null,code,key,text),screenHead:()=>h('header'),img:(src,props={})=>h('img',{alt:'',...props,src})};
    c.window=c;vm.createContext(c);vm.runInContext(stateSource,c);vm.runInContext(source,c);const host=h('main');screen.mount(host);
    const show=p=>screen.show(p,c.PCApp),button=name=>host.all().find(n=>n.dataset.action===name),click=(name,key)=>{const b=host.all().find(n=>n.dataset.action===name&&(key===undefined||n.dataset.key===key));assert.ok(b,name);host.emit('click',b);};
    show([]);assert.ok(host.textContent.includes('북부전선'));
    const search=host.querySelector('#tc-map-search');search.value='no-such-map-record';host.emit('input',search);assert.ok(host.textContent.includes('MAP RECORD NOT FOUND'));click('clear-search');assert.ok(host.querySelector('#tc-map-count').textContent.includes('29'));click('filter','synchrony');assert.ok(host.querySelector('#tc-map-count').textContent.includes('10'));
    for(const p of [['op','no-such-op'],['region','no-such-region'],['incident','missing'],['synchrony','missing'],['pilgrimage','missing'],['verdict','missing']]){show(p);assert.ok(host.textContent.includes('MAP RECORD NOT FOUND'),p.join('/'));}
    const d=context.ProjectCurseMapRoom;
    for(const r of d.regions)show(['region',r.id]);
    for(const d of context.ProjectCurseMapRoom.drilldowns){show(['region',d.id]);for(const s of d.sites)show(['region',d.id,'site',s.id]);}
    for(const m of d.markers)show(['marker',m.id]);
    for(const e of d.synchronyEvents){show(['synchrony',e.id]);for(const pt of e.points){show(['synchrony',e.id,pt.id]);show(['synchrony',pt.id]);}}
    for(const s of Object.keys(context.ProjectCursePilgrimageData.scenarios))show(['pilgrimage',s]);
    show(['op','op-deadzone-recovery']);assert.ok(host.textContent.includes('DZ-VR-04'));assert.equal(button('play'),undefined);
    show(['op','op-immortality']);click('next');let current=host.all().find(n=>n.dataset.action==='step'&&n.attrs['aria-current']==='step');assert.equal(current.dataset.key,'1');
    host.emit('keydown',button('play'),'ArrowRight');current=host.all().find(n=>n.dataset.action==='step'&&n.attrs['aria-current']==='step');assert.equal(current.dataset.key,'2');
    host.emit('keydown',button('play'),' ');assert.equal(timers.size,1);for(const fn of [...timers.values()])fn();current=host.all().find(n=>n.dataset.action==='step'&&n.attrs['aria-current']==='step');assert.equal(current.dataset.key,'3');
    click('play');assert.equal(timers.size,0);click('play');media.matches=true;media.emit('change',media);assert.equal(timers.size,0);assert.equal(button('play').disabled,true);click('play');assert.equal(timers.size,0);
    media.matches=false;media.emit('change',media);click('play');assert.equal(timers.size,1);screen.hide();assert.equal(timers.size,0);assert.equal(host.events.get('click').size,0);
    show(['op','op-immortality']);assert.equal(host.events.get('click').size,1);click('play');assert.equal(timers.size,1);screen.hide();assert.equal(timers.size,0);
  });

}
