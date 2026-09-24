import vm from 'node:vm';
import assert from 'node:assert/strict';

// 옛 상태 저장소와 반응형 분기를 독립 기준으로 실행해 대조한다.
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
    for(const token of ['PC.missing(',"PC.screen({id:'map-room'",'root.clearInterval(timer)','controller?.abort()',"reducedFx()||view?.kind!=='op'",'root.document.hidden',"event.key===' '","['ArrowLeft','ArrowRight']","if(state.layers.routes&&!syncEvent)","if(state.layers.synchrony)","addEventListener('pc:fx',onMotion",'clearReaction()'] )assert.ok(source.includes(token),token);
    const css=read('assets/app/css/screens/map.css');
    assert.match(css,/html\[data-fx="reduced"\]/);
    assert.doesNotMatch(css,/@media\s*\(prefers-reduced-motion/);
    for(const effect of ['tc-map-scan','tc-map-breathe','tc-map-ring','tc-map-route-flow','tc-map-denied'])assert.ok(css.includes(`@keyframes ${effect}`),effect);
    assert.match(css,/tc-map-scan 7s linear infinite/);
    assert.match(css,/tc-map-denied \.28s ease-out 1/);
    assert.ok([...css.matchAll(/translateX\((-?[\d.]+)px\)/g)].every(match=>Math.abs(Number(match[1]))<=4));
  });
  check('screen-routes-search-and-playback-execution',()=>{
    const {c,host,screen,timers,media,timeouts,audio}=screenHarness(context,source,stateSource);
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

  check('brief-labels-and-operational-information',()=>{
    const {c,host,screen}=screenHarness(context,source,stateSource);
    screen.show([],c.PCApp);
    const english=text=>(text.match(/\b[A-Z][A-Z0-9_./-]{2,}\b/g)||[]).length;
    const full=english(host.visibleText()),brief=english(host.visibleText(true));
    assert.ok(brief<=full/2,`${brief} / ${full}`);
    for(const item of context.ProjectCurseMapRoom.operations)assert.ok(host.visibleText(true).includes(item.label));
    assert.ok(host.visibleText(true).includes('CRITICAL / PARTIAL'));
    screen.show(['op','op-immortality'],c.PCApp);
    const op=context.ProjectCurseMapRoom.operations.find(item=>item.id==='op-immortality');
    assert.ok(host.visibleText(true).includes(op.steps[0].time));
    assert.ok(host.visibleText(true).includes(op.steps[0].units[0].id));
    assert.ok(host.visibleText(true).includes(`X ${op.steps[0].units[0].x}`));
    screen.hide();return `전체 ${full}개 / 간략 ${brief}개 영문 토큰 · DOM 대역 기준`;
  });
  check('fx-override-static-layers-and-listener-cleanup',()=>{
    const {c,host,screen,timers,timeouts,media}=screenHarness(context,source,stateSource);
    const show=parts=>screen.show(parts,c.PCApp),click=action=>host.emit('click',host.all().find(n=>n.dataset.action===action));
    media.matches=true;c.PCApp.fx=()=> 'full';
    show(['op','op-immortality']);click('next');click('play');assert.equal(timers.size,1);
    assert.equal(host.dataset.mapFx,'full');
    const routes=host.querySelectorAll('.tc-map-route-segment').length;
    assert.ok(routes>0);assert.ok(host.querySelector('.tc-map-ring'));assert.ok(host.querySelector('.tc-map-scan'));
    c.PCApp.fx=()=> 'reduced';c.document.emit('pc:fx',c.document,undefined,{mode:'reduced'});
    assert.equal(timers.size,0);assert.equal(host.dataset.mapFx,'reduced');assert.equal(host.querySelectorAll('.tc-map-route-segment').length,routes);
    assert.ok(host.querySelector('.tc-map-ring'));assert.ok(host.querySelector('.tc-map-scan'));
    c.PCApp.fx=()=> 'full';c.document.emit('pc:fx',c.document,undefined,{mode:'full'});click('play');assert.equal(timers.size,1);
    media.emit('change',media);assert.equal(timers.size,1);
    show(['synchrony',context.ProjectCurseMapRoom.synchronyEvents[0].id]);
    assert.equal(host.querySelectorAll('.tc-map-ring').length,10);assert.equal(host.querySelectorAll('.tc-map-route-segment').length,0);
    show(['marker','black-river']);assert.ok(host.querySelector('.tc-map-ring.is-selected'));
    show(['op','op-deadzone-recovery']);assert.equal(host.dataset.mapReaction,'denied');assert.equal(timeouts.size,1);
    screen.hide();assert.equal(timeouts.size,0);assert.equal(timers.size,0);assert.equal(c.document.events.get('pc:fx').size,0);assert.equal(media.events.get('change').size,0);
    show([]);show([]);assert.equal(c.document.events.get('pc:fx').size,1);screen.hide();
  });
  check('evidence-inspection-count-hooks-and-optional-threat',()=>{
    const {c,host,screen,threats}=screenHarness(context,source,stateSource);c.PCApp.threat=level=>threats.push(level);
    for(const op of context.ProjectCurseMapRoom.operations)screen.show(['op',op.id],c.PCApp);
    // 현재 다섯 작전에는 허용된 명시 등급이 없다. 보안 BLACK을 치명으로 해석하지 않는다.
    assert.equal(threats.length,0);
    for(const detail of context.ProjectCurseMapRoom.drilldowns){
      screen.show(['region',detail.id],c.PCApp);
      for(const img of host.querySelectorAll('.tc-evidence-media img')){assert.equal(img.closest('a'),null);assert.ok(img.closest('figure'));}
      const hooks=host.querySelectorAll('[data-tc-anomaly]');assert.ok(hooks.length<=2);
      for(const hook of hooks){assert.equal(hook.dataset.tcAnomaly,'count');assert.equal(hook.closest('a,button,h1,h2,h3,input'),null);}
    }
    screen.show(['region','deadzone-return-corridor'],c.PCApp);assert.equal(host.querySelector('[data-tc-anomaly="count"]').textContent,'5개 검출');
    screen.hide();
    const data=context.ProjectCurseMapRoom;
    const fixture={...context,ProjectCurseMapRoom:{...data,operations:data.operations.map((op,i)=>i===0?{...op,threatLevel:'critical'}:op)}};
    const next=screenHarness(fixture,source,stateSource);next.c.PCApp.threat=level=>next.threats.push(level);next.screen.show(['op',data.operations[0].id],next.c.PCApp);assert.deepEqual(next.threats,['critical']);next.screen.hide();
  });
  check('critical-choice-unread-verdict-and-sound-in-reduced',()=>{
    const {c,host,screen,timeouts,audio}=screenHarness(context,source,stateSource);
    const show=parts=>screen.show(parts,c.PCApp),click=(action,key)=>{const button=host.all().find(n=>n.dataset.action===action&&(key===undefined||n.dataset.key===key));assert.ok(button,action);host.emit('click',button);};
    show(['pilgrimage','deadzone-return']);click('start','deadzone-return');
    const stage=c.ProjectCursePilgrimageState.getStage('deadzone-return'),choice=stage.choices.find(item=>item.tone==='danger'||['broken','compromised'].includes(item.ruleOutcome));assert.ok(choice);
    click('choice',choice.id);assert.ok(['critical','denied'].includes(host.dataset.mapReaction));assert.equal(timeouts.size,1);
    c.PCApp.fx=()=> 'reduced';c.document.emit('pc:fx',c.document,undefined,{mode:'reduced'});assert.equal(timeouts.size,0);assert.equal(host.dataset.mapReaction,undefined);
    const count=audio.length;
    while(c.ProjectCursePilgrimageState.get('deadzone-return').status==='active')click('choice',c.ProjectCursePilgrimageState.getStage('deadzone-return').choices[0].id);
    assert.ok(audio.length>count);assert.equal(timeouts.size,0);show(['verdict']);assert.ok(host.querySelector('.tc-map-new'));
    const entry=c.ProjectCurseVerdictArchiveState.list().find(item=>item.unlocked&&item.unread);assert.ok(entry);show(['verdict',entry.id]);show(['verdict']);assert.equal(host.querySelector('.tc-map-new'),null);
    for(const name of audio)assert.ok(context.ProjectCurseAudioManifest.events[name],name);
    screen.hide();
  });

}

// 실제 화면 함수를 실행하는 작은 DOM 대역. 배치·그림 검증을 대신하지 않는다.
// 두 화면의 필터·주소·이벤트 정리·선택적 셸 연동을 같은 조건에서 검사한다.
export function screenHarness(context,source,stateSource='') {
  let c,screen,nextTimer=0;
  class Target {
    constructor(){this.events=new Map();}
    addEventListener(type,fn,opts={}){if(!this.events.has(type))this.events.set(type,new Set());this.events.get(type).add(fn);opts.signal?.addEventListener('abort',()=>this.events.get(type).delete(fn),{once:true});}
    emit(type,target,key,detail={}){const event={type,target,key,detail,button:0,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;}};this.dispatchEvent(event);return event;}
    dispatchEvent(event){for(const fn of [...this.events.get(event.type)||[]])fn(event);}
  }
  const dataKey=key=>key.replace(/^data-/,'').replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());
  class Element extends Target {
    constructor(spec,props,...children){
      super();this.spec=spec;this.tag=spec.split(/[.#]/)[0];this.tagName=this.tag.toUpperCase();this.id=spec.match(/#([\w-]+)/)?.[1]||'';
      this.classes=new Set([...spec.matchAll(/\.([\w-]+)/g)].map(m=>m[1]));this.dataset={};this.attrs={};this.children=[];this.isConnected=true;
      this.classList={add:(...names)=>names.forEach(name=>this.classes.add(name)),remove:(...names)=>names.forEach(name=>this.classes.delete(name)),contains:name=>this.classes.has(name)};
      for(const [key,value] of Object.entries(props||{})){if(value==null||value===false)continue;if(key==='text')this.textContent=value;else if(key==='dataset')Object.assign(this.dataset,value);else this.setAttribute(key,value);}
      this.append(...children);
    }
    append(...items){for(const child of items.flat(Infinity).filter(x=>x!=null&&x!==false)){if(child instanceof Element)child.parentElement=this;this.children.push(child);}}
    replaceChildren(...items){for(const child of this.children)if(child instanceof Element)child.isConnected=false;this.children=[];this.append(...items);}
    setAttribute(key,value){this.attrs[key]=value;if(key==='class')String(value).split(/\s+/).forEach(name=>this.classes.add(name));else if(key.startsWith('data-'))this.dataset[dataKey(key)]=value;else if(['value','disabled','hidden','id','open'].includes(key))this[key]=value;}
    getAttribute(key){return key==='class'?[...this.classes].join(' '):key.startsWith('data-')?this.dataset[dataKey(key)]:this.attrs[key];}
    get textContent(){return this.children.map(child=>child instanceof Element?child.textContent:String(child)).join('');}
    set textContent(value){this.children=[String(value)];}
    all(){return [this,...this.children.filter(child=>child instanceof Element).flatMap(child=>child.all())];}
    matches(selector){
      if(selector.includes(','))return selector.split(',').some(part=>this.matches(part.trim()));
      if(selector==='button:not([data-action="play"])')return this.tag==='button'&&this.dataset.action!=='play';
      const attr=[...selector.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)];
      const clean=selector.replace(/\[[^\]]*\]/g,'');
      const tag=clean.match(/^[\w-]+/)?.[0],id=clean.match(/#([\w-]+)/)?.[1];
      return (!tag||this.tag===tag)&&(!id||this.id===id)&&[...clean.matchAll(/\.([\w-]+)/g)].every(m=>this.classes.has(m[1]))&&attr.every(([,key,value])=>value===undefined?this.getAttribute(key)!=null:String(this.getAttribute(key))===value);
    }
    querySelectorAll(selector){return this.all().slice(1).filter(node=>selector.split(',').some(part=>{const pieces=part.trim().split(/\s+/);if(!node.matches(pieces.pop()))return false;let ancestor=node.parentElement;while(pieces.length){const wanted=pieces.pop();while(ancestor&&!ancestor.matches(wanted))ancestor=ancestor.parentElement;if(!ancestor)return false;ancestor=ancestor.parentElement;}return true;}));}
    querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
    contains(node){return this.all().includes(node);}
    closest(selector){return this.matches(selector)?this:this.parentElement?.closest(selector)||null;}
    focus(){c.document.activeElement=this;}
    select(){}
    visibleText(brief=false){if(this.hidden||brief&&this.classes.has('tc-full-only'))return '';return this.children.map(child=>child instanceof Element?child.visibleText(brief):String(child)).join(' ');}
  }
  const h=(...args)=>new Element(...args),timers=new Map(),timeouts=new Map(),frames=new Map(),audio=[],threats=[],navigations=[];
  const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};
  c={...context,AbortController,document:new Target(),localStorage:storage(),sessionStorage:storage(),
    CustomEvent:class{constructor(type,props){this.type=type;Object.assign(this,props);}},
    getComputedStyle:()=>({getPropertyValue:()=> '#8d9c77'}),scrollY:0,scrollTo(_x,y){this.scrollY=y;},location:{href:'http://localhost/index.html#map-room'},navigator:{},
    setInterval:fn=>{const id=++nextTimer;timers.set(id,fn);return id;},clearInterval:id=>timers.delete(id),
    setTimeout:fn=>{const id=++nextTimer;timeouts.set(id,fn);return id;},clearTimeout:id=>timeouts.delete(id),
    requestAnimationFrame:fn=>{const id=++nextTimer;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)};
  const media=new Target();media.matches=false;c.matchMedia=()=>media;
  c.PCAudio={cue:name=>audio.push(name)};
  c.PCApp={h,screen:value=>{screen=value;},href:(...parts)=>'#'+parts.join('/'),go:(...parts)=>navigations.push(parts),back:id=>navigations.push(['back',id]),setTitle(){},append:(el,children)=>el.append(children),clear:el=>{el.replaceChildren();return el;},tag:text=>h('span.tc-tag',null,text),verdictTone:()=> 'info',missing:(code,key,text)=>h('div.tc-missing',null,code,key,text),
    screenHead:(_id,options={})=>h('header.tc-screenhead',null,h('p.tc-screenhead-code',null,'CH SCREEN'),h('h1',{text:options.title}),h('p',{text:options.desc}),h('dl.tc-screenhead-meta',null,options.meta?.map(([term,value])=>h('div',null,term,value)))),img:(src,props={})=>h('img',{alt:'',...props,src})};
  c.window=c;vm.createContext(c);if(stateSource)vm.runInContext(stateSource,c);vm.runInContext(source,c);
  const host=h(`main#${screen.id}`);screen.mount(host);
  return {c,host,screen,timers,timeouts,frames,media,audio,threats,navigations};
}
