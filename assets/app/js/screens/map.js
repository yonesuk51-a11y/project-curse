// Project Curse 6 — map. 상태 저장소는 pc-state.js에 있다.
(function(root){
'use strict';

function detailTerrain(detail){
      if(detail.terrain==='front') return `
        <path class="pc-detail-terrain pc-detail-terrain--front" d="M0 84 C142 38 238 104 365 62 S614 98 728 47 884 76 1000 32 L1000 540 0 540 Z"></path>
        <g class="pc-detail-front-grid"><path d="M40 463 L198 381 344 408 501 334 646 286 788 183 958 84"></path><path d="M119 510 L263 420 431 449 566 366 731 321 903 202"></path><path d="M176 78 V475 M356 42 V458 M538 68 V407 M716 31 V338 M875 56 V246"></path></g>
        <path class="pc-detail-front-barrier" d="M598 430 C666 365 702 297 764 248 S858 161 954 104"></path>`;
      if(detail.terrain==='northsea') return `
        <path class="pc-detail-terrain pc-detail-terrain--northsea" d="M0 0 H1000 V540 H0 Z"></path>
        <path class="pc-detail-northsea-coast" d="M0 438 C128 391 213 417 316 354 S503 322 609 253 824 224 1000 128 L1000 540 0 540 Z"></path>
        <g class="pc-detail-northsea-current"><path d="M41 104 C196 52 289 143 432 97 S702 75 954 31"></path><path d="M32 214 C194 168 304 232 452 189 S737 173 972 92"></path><path d="M167 312 C302 260 397 311 536 270 S778 252 955 181"></path></g>
        <path class="pc-detail-northsea-blockade" d="M526 83 C626 45 765 62 856 126 S917 277 847 349"></path>`;
      if(detail.terrain==='coast') return `
        <path class="pc-detail-terrain pc-detail-terrain--forest" d="M0 40 C165 102 253 38 393 92 S664 72 1000 128 L1000 540 0 540 Z"></path>
        <path class="pc-detail-terrain pc-detail-terrain--water" d="M0 454 C146 404 244 470 365 419 S590 392 712 326 863 292 1000 226 L1000 540 0 540 Z"></path>
        <path class="pc-detail-river" d="M312 0 C354 106 326 190 419 272 S507 410 548 540"></path>`;
      if(detail.terrain==='forest'||detail.terrain==='deep-forest') return `
        <path class="pc-detail-terrain pc-detail-terrain--forest" d="M0 65 C113 22 218 96 345 52 S586 90 704 39 884 81 1000 24 L1000 540 0 540 Z"></path>
        ${detail.terrain==='deep-forest'?'<path class="pc-detail-canopy" d="M0 178 C131 98 250 183 372 115 S612 154 745 91 905 125 1000 82"></path><path class="pc-detail-canopy" d="M0 330 C148 257 267 348 411 272 S667 313 805 248 932 278 1000 237"></path>':''}`;
      if(detail.terrain==='ruins') return `
        <path class="pc-detail-terrain pc-detail-terrain--dead" d="M0 72 C174 117 294 35 447 111 S745 56 1000 119 L1000 540 0 540 Z"></path>
        <g class="pc-detail-ruins"><path d="M93 135h118v72H93z M296 79h93v124h-93z M694 96h151v82H694z M781 361h118v91H781z"></path></g>`;
      return `
        <path class="pc-detail-terrain pc-detail-terrain--dead" d="M0 74 C177 130 301 37 448 113 S732 61 1000 126 L1000 540 0 540 Z"></path>
        <path class="pc-detail-silence" d="M555 0 L1000 0 1000 540 716 540 C665 420 607 367 555 248 Z"></path>`;
    }
function operationTerrain(operation){
      if(operation.id==='op-deadzone-recovery'){
        return `
          <path class="pc-op-terrain pc-op-terrain--dead" d="M0 28 C153 72 286 17 426 73 S704 28 1000 86 L1000 540 0 540 Z"></path>
          <path class="pc-op-contested-line" d="M0 108H1000 M0 216H1000 M0 324H1000 M0 432H1000"></path>
          <path class="pc-op-river" d="M12 74 C174 139 281 169 421 238 S718 328 1000 405"></path>
          <circle class="pc-op-blood" cx="668" cy="326" r="48"></circle>`;
      }
      if(operation.id==='op-deadzone-return'){
        return `
          <path class="pc-op-terrain pc-op-terrain--dead" d="M0 72 C174 117 294 35 447 111 S745 56 1000 119 L1000 540 0 540 Z"></path>
          <path class="pc-op-contested-line" d="M126 0V540 M304 0V540 M482 0V540 M660 0V540 M838 0V540"></path>
          <path class="pc-op-river" d="M0 64 C173 133 287 189 421 242 S707 353 1000 438"></path>
          <circle class="pc-op-blood" cx="704" cy="348" r="54"></circle>`;
      }
      if(operation.id==='op-unlit-fortress'){
        return `
          <path class="pc-op-terrain pc-op-terrain--forest" d="M0 90 C130 40 230 112 352 67 S590 81 714 45 905 73 1000 22 L1000 540 0 540 Z"></path>
          <path class="pc-op-river" d="M526 0 C485 114 615 171 552 257 S530 412 620 540"></path>
          <path class="pc-op-blood" d="M664 215 C704 178 776 183 806 223 C770 263 702 274 662 246 Z"></path>`;
      }
      if(operation.id==='op-southern-coup'){
        return `
          <path class="pc-op-terrain pc-op-terrain--forest" d="M0 84 C121 52 224 122 337 84 S557 62 690 38 869 84 1000 47 L1000 540 0 540 Z"></path>
          <path class="pc-op-terrain pc-op-terrain--coast" d="M0 458 C150 411 232 474 350 424 S575 396 690 333 858 294 1000 232 L1000 540 0 540 Z"></path>
          <path class="pc-op-river" d="M308 0 C355 107 325 197 420 275 S511 404 548 540"></path>
          <circle class="pc-op-blood" cx="414" cy="292" r="48"></circle>
          <circle class="pc-op-blood" cx="735" cy="170" r="55"></circle>
          <path class="pc-op-contested-line" d="M518 250 L622 188 701 205 814 126"></path>`;
      }
      return `
        <path class="pc-op-terrain pc-op-terrain--coast" d="M0 73 C168 128 294 36 435 112 S712 58 1000 128 L1000 540 0 540 Z"></path>
        <path class="pc-op-river" d="M371 0 C434 114 442 208 533 260 S712 287 1000 334"></path>
        <path class="pc-op-blood" d="M682 142 C744 105 830 125 849 181 C808 229 719 238 666 196 Z"></path>`;
    }
  const PC=root.PCApp, {h}=PC;
  const D=root.ProjectCurseMapRoom, X=root.ProjectCurseMapScreenData;
  const P=root.ProjectCursePilgrimageState, V=root.ProjectCurseVerdictArchiveState, O=root.ProjectCurseOperationState;
  // 효과음 — 사건 이름은 terminal-fx-data.js(stepCues·scenarioCues·verdictCue). 음향이 꺼져 있으면 아무 일도 없다.
  const fxData=root.ProjectCurseTerminalFx||{}, sfx=name=>{if(name)root.PCAudio?.cue(name);};
  const unitRank={normal:0,unstable:1,unknown:2,split:3,lost:4};
  const worstUnit=s=>(s?.units||[]).reduce((w,u)=>(unitRank[u.status]??0)>(unitRank[w]??0)?u.status:w,'normal');
  const scenarios=root.ProjectCursePilgrimageData.scenarios;
  const signals=root.ProjectCurseMapSignalIndex;
  const sessionKey='project_curse_map_session_v1', recentKey='project_curse_map_recent_v1';
  const confidence={confirmed:'확인 자료',corroborated:'교차 확인 자료',observed:'관측 자료',estimated:'추정 좌표',disputed:'상충 진술',testimony:'순례자 증언',historical:'과거 기록'};
  const risks={critical:'치명',high:'높음',medium:'주의',low:'낮음'};
  const statusLabels={normal:'정상',unstable:'불안정',split:'신호 분열',unknown:'미상',lost:'신호 소실'};
  const uncertain=c=>['estimated','testimony','disputed'].includes(c);
  const traceTone=c=>['broken','compromised'].includes(c)?'hostile':c==='contained'?'contained':['kept','verified','secured'].includes(c)?'secured':'unknown';
  const readStorage=(storage,key,empty)=>{try{return JSON.parse(root[storage].getItem(key)||'null')||empty;}catch(_){return empty;}};
  const writeStorage=(storage,key,value)=>{try{root[storage].setItem(key,JSON.stringify(value));}catch(_){storageFailed=true;}};
  let storageFailed=false;
  const saved=readStorage('sessionStorage',sessionKey,{});
  const state={...saved,indexQuery:typeof saved.indexQuery==='string'?saved.indexQuery.slice(0,80):'',indexFilter:signals.filters.some(f=>f.id===saved.indexFilter)?saved.indexFilter:'all',indexOpen:!!saved.indexOpen,
    layers:{confirmed:true,estimated:true,zones:true,routes:true,synchrony:true},detailLayers:{routes:true,threats:true,comms:false,distortion:true}};
  for(const group of ['layers','detailLayers'])for(const key of Object.keys(state[group]))if(typeof saved[group]?.[key]==='boolean')state[group][key]=saved[group][key];
  let recent=readStorage('sessionStorage',recentKey,[]);
  recent=(Array.isArray(recent)?recent:[]).map(item=>Array.isArray(item)?item:item?.path).filter(path=>Array.isArray(path)&&path.length).slice(0,4);
  let host,parts=[],active=false,controller=null,timer=0,playing=false,resetArm='',branchOpen=null;
  let operationId=null,step=0,view=null,feedback=null;
  const rememberedSteps=new Map();
  const reduced=root.matchMedia('(prefers-reduced-motion: reduce)');
  const region=id=>D.regions.find(r=>r.id===id);
  const detail=id=>D.drilldowns.find(d=>d.id===id);
  const operation=id=>D.operations.find(o=>o.id===id);
  const marker=id=>D.markers.find(m=>m.id===id);
  const incident=id=>root.ProjectCurseIncidentNetwork.getIncident(id);
  const scenarioForOperation=o=>o.scenario||Object.values(scenarios).find(s=>s.operation===o.id)?.id;
  const allowedScenario=id=>!!scenarios[id]&&(!scenarios[id].unlock||(scenarios[id].unlock.type==='verdict'&&V.isUnlocked(scenarios[id].unlock.id)));
  const lockedOperation=o=>!!o.unlockVerdict&&!V.isUnlocked(o.unlockVerdict);
  const txt=t=>h('p.tc-map-copy',{text:t});
  const note=(title,text,tone='caution')=>h('div.tc-note.tc-map-note',{class:`tc-note--${tone}`},h('b',{text:title}),txt(text));
  const tag=(text,tone='info')=>PC.tag(text,tone);
  const link=(label,...path)=>h('a.tc-btn.tc-map-link',{href:PC.href(...path)},label);
  const action=(label,name,key='',props={})=>h('button.tc-btn',{type:'button',dataset:{action:name,key,control:`${name}:${key}`},...props},label);
  const kv=rows=>h('dl.tc-kv.tc-map-kv',null,rows.filter(([,v])=>v!=null&&v!=='').map(([k,v])=>h('div',null,h('dt',{text:k}),h('dd',{text:v}))));
  const panel=(code,title,...children)=>h('section.tc-panel.tc-map-panel',null,h('header.tc-panel-head',null,h('div',null,h('span.tc-label',{text:code}),h('h2',{text:title}))),h('div.tc-panel-body.tc-map-stack',null,...children));
  const disclosure=(code,title,children,props={})=>h('details.tc-disclosure.tc-map-disclosure',props,h('summary',null,h('span',null,h('span.tc-label',{text:code}),h('b',{text:title}))),h('div.tc-disclosure-body.tc-map-stack',null,children));
  const intelPanel=(...children)=>h('aside.tc-map-stack',null,disclosure('SELECTED INFORMATION','선택 정보',children,{open:!state.intelCollapsed,dataset:{disclosure:'intel'}}));
  const missing=(key)=>PC.missing('MAP RECORD NOT FOUND',key,'요청한 관제 자료가 없습니다. 주소와 기록 키를 확인하십시오.');
  const list=items=>h('ul.tc-map-bullets',null,items.map(t=>h('li',{text:t})));
  const bodyTitle=(code,title,description)=>h('header.tc-map-title',null,h('span.tc-label',{text:code}),h('h2',{'data-tc-focus':true,text:title}),description?txt(description):null);
  const row=(code,title,summary,path,status,tone='info')=>h('a.tc-row.tc-map-row',{href:PC.href('map-room',...path)},h('span.tc-row-time',{text:code}),h('span.tc-row-main',null,h('b',{text:title}),h('span.tc-map-copy',{text:summary})),h('span.tc-row-meta',null,status?tag(status,tone):null),h('span.tc-row-go',{'aria-hidden':'true',text:'›'}));
  const unique=items=>[...new Set(items.filter(Boolean))];
  function references(item,extra={}){
    const inc=incident(item.incident)||extra;
    const archives=unique([...(item.records||[]),...(inc.records||[])]);
    const links=archives.map(id=>link(id,'archive-entry',id));
    const historyId=item.history||inc.history;
    if(historyId)links.push(link('세계 기록에서 사건 열기','history',historyId));
    for(const id of inc.factions||[])links.push(link(root.ProjectCurseCanon.factions[id]?.name||id,'faction-info',id));
    if(item.operation)links.push(link('연결 작전 경과','map-room','op',item.operation));
    return links.length?h('nav.tc-btnrow',{'aria-label':'관련 기록'},links):null;
  }
  function canonical(path){
    if(!Array.isArray(path))return [];
    if(path[0]==='operation')return ['op',path[1]];
    if(path[0]==='detail')return ['region',path[1],...(path[2]?['site',path[2]]:[])];
    if(path[0]==='region'&&path[2]==='marker')return ['marker',path[3]];
    if(path[0]==='region'&&path[2]==='synchrony'){
      const e=D.synchronyEvents.find(e=>e.points.some(p=>p.id===path[3]));return e?['synchrony',e.id,path[3]]:path;
    }
    return path;
  }
  function resolve(raw){
    const p=canonical(raw),[kind,id,sub,site]=p;
    if(!p.length)return {kind:'index',title:'상황 관제'};
    if(kind==='op'&&p.length===2&&operation(id))return {kind:'op',item:operation(id),title:operation(id).label};
    if(kind==='region'){
      const d=detail(id),r=region(id);
      if(d&&(p.length===2||(p.length===4&&sub==='site'&&d.sites.some(s=>s.id===site))))return {kind:'detail',item:d,site:d.sites.find(s=>s.id===site),title:d.sites.find(s=>s.id===site)?.label||d.label};
      if(r&&p.length===2)return {kind:'region',item:r,title:r.label};
    }
    if(kind==='marker'&&p.length===2&&marker(id))return {kind:'marker',item:marker(id),region:region(marker(id).region),title:marker(id).title};
    if(kind==='incident'&&p.length===2){
      const m=D.markers.find(m=>m.incident===id);const inc=incident(id);
      if(m&&inc)return {kind:'marker',item:m,region:region(m.region),title:m.title};
      const index=signals.items.find(s=>s.target.kind==='withheld'&&s.target.id===id);
      if(inc&&index)return {kind:'withheld',item:index,title:index.title};
    }
    if(kind==='synchrony'&&(p.length===2||p.length===3)){
      if(p.length===2){const event=D.synchronyEvents.find(e=>e.points.some(pt=>pt.id===id));if(event)return {kind:'synchrony',item:event,point:event.points.find(pt=>pt.id===id),title:event.title};}
      const e=D.synchronyEvents.find(e=>e.id===id),point=e?.points.find(p=>p.id===sub);
      if(e&&(!sub||point))return {kind:'synchrony',item:e,point,title:e.title};
    }
    if(kind==='pilgrimage'&&p.length===2&&scenarios[id])return {kind:'pilgrimage',item:scenarios[id],title:scenarios[id].title};
    if(kind==='verdict'&&p.length===1)return {kind:'verdicts',title:'현장 판정 보관'};
    if(kind==='verdict'&&p.length===2&&V.getEntry(id))return {kind:'verdict',item:V.getEntry(id),title:V.getEntry(id).unlocked?V.getEntry(id).title:V.getEntry(id).lockedTitle};
    return {kind:'missing',title:'관제 자료 없음',key:raw.join('/')};
  }
  function legacyPath(v){
    if(v.kind==='op')return ['operation',v.item.id];
    if(v.kind==='detail')return ['detail',v.item.id,...(v.site?[v.site.id]:[])];
    if(v.kind==='region')return ['region',v.item.id];
    if(v.kind==='marker')return ['region',v.item.region,'marker',v.item.id];
    if(v.kind==='synchrony')return v.point?['region',v.point.region,'synchrony',v.point.id]:['synchrony',v.item.id];
    return parts;
  }
  function saveSession(){
    Object.assign(state,{entryVersion:2,mode:view.kind==='index'?'landing':view.kind==='op'?'operation':view.kind==='detail'?'detail':['region','marker','synchrony'].includes(view.kind)?'region':state.mode||'landing',operation:operationId||state.operation,step,region:view.kind==='region'?view.item.id:view.kind==='synchrony'?view.point?.region||'world':view.item?.region||state.region,detail:view.kind==='detail'?view.item.id:state.detail,detailSite:view.site?.id||null,marker:view.kind==='marker'?view.item.id:null,synchronyPoint:view.point?.id||null});
    writeStorage('sessionStorage',sessionKey,state);
  }
  function remember(){
    if(['missing','index','verdicts'].includes(view.kind))return;
    const p=legacyPath(view);recent=[p,...recent.filter(x=>JSON.stringify(x)!==JSON.stringify(p))].filter(x=>resolve(x).kind!=='missing').slice(0,4);
    writeStorage('sessionStorage',recentKey,recent);
  }

  // PCApp.h creates HTML only. SVG is a serialized image, never injected markup.
  // Both the SVG image and its 40px location controls are created with PCApp.h.
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const svg=(name,attrs={},children='')=>`<${name}${Object.entries(attrs).map(([k,v])=>` ${k}="${esc(v)}"`).join('')}>${children}</${name}>`;
  const points=ps=>(ps||[]).map(p=>p.join(',')).join(' ');
  const shapes={normal:'M-9 -7H9V7H-9Z',friendly:'M-9 -7H9V7H-9Z',hostile:'M0 -11L10 0 0 11-10 0Z',unknown:'M0-7C-10-17-17-4-7 0C-17 10-4 17 0 7C10 17 17 4 7 0C17-10 4-17 0-7Z',unstable:'M-9-7H9V7H-9ZM-5-4L5 4M5-4L-5 4',split:'M-5-9H-13V6H-5M5-6H13V9H5M-2-11L2-4-2 4 2 11',lost:'M-9-7H9V7H-9ZM-12-11L12 11M12-11L-12 11',facility:'M-9-9H9V9H-9ZM-5-5H5V5H-5Z',incident:'M0-11L11 9H-11ZM0-4V2M0 5V6',anomaly:'M-5-10H5L11 0 5 10H-5L-11 0Z',cult:'M-8-9H8V9H-8ZM0-6V6M-5-1H5',fortress:'M-10 9V-9H-4V-4H4V-9H10V9Z',returned:'M0-10L10 0 0 10-10 0ZM-5 0H5M1-4L5 0 1 4',line:'M-11-8H11V8H-11ZM-7 4L7-4',zone:'M-10-10H10V10H-10ZM-7 7L7-7',signal:'M-8-8H8V8H-8ZM-12 0H12M0-12V12',ruin:'M-10 9V-8H-3V1H3V-4H10V9Z',settlement:'M-10 0L0-10 10 0V9H-10Z'};
  function palette(){const c=root.getComputedStyle(host);return Object.fromEntries(['bg','panel','panel-2','line','line-2','text','text-2','ir','ir-ink','od','od-ink','amber','amber-ink','red','red-ink','blood','blood-ink','coyote','coyote-ink'].map(k=>[k,c.getPropertyValue('--'+k).trim()]));}
  function color(kind,p){return ['hostile','split','lost','incident','zone'].includes(kind)?p['red-ink']:kind==='cult'?p['blood-ink']:['unstable','anomaly'].includes(kind)?p['amber-ink']:['normal','friendly','secured','allied'].includes(kind)?p['od-ink']:p['ir-ink'];}
  function symbol(kind,x,y,label='',p=palette(),tone=kind){
    return svg('g',{transform:`translate(${x} ${y})`,fill:p.bg,stroke:color(tone,p),'stroke-width':2},svg('path',{d:shapes[kind]||shapes.unknown,'vector-effect':'non-scaling-stroke'})+(label?svg('text',{x:17,y:5,fill:p.text,stroke:'none','font-family':'monospace','font-size':18},esc(label)):''));
  }
  function uri(body,box,p){
    const styles=`path{vector-effect:non-scaling-stroke}.pc-detail-terrain,.pc-op-terrain{fill:${p['panel-2']};stroke:${p['line-2']}}.pc-detail-terrain--water,.pc-detail-terrain--northsea,.pc-op-terrain--coast{fill:${p.bg}}.pc-detail-river,.pc-op-river{fill:none;stroke:${p.ir};stroke-width:3}.pc-op-blood{fill:${p.blood};stroke:${p['blood-ink']};opacity:.5}.pc-detail-canopy,.pc-detail-front-grid,.pc-detail-front-barrier,.pc-detail-northsea-current,.pc-detail-northsea-blockade,.pc-op-contested-line{fill:none;stroke:${p['line-2']};stroke-width:1}.pc-detail-northsea-coast,.pc-detail-ruins,.pc-detail-silence{fill:${p.panel};stroke:${p['line-2']}}`;
    const [, ,width,height]=box.split(/\s+/);
    return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:box,width,height},svg('style',{},styles)+body));
  }
  function grid(box,p,geo=false){
    const [x,y,w,ht]=box.split(/\s+/).map(Number);const spacing=geo?100:50;
    let body=svg('rect',{x,y,width:w,height:ht,fill:p.bg});
    for(let gx=Math.ceil(x/spacing)*spacing;gx<x+w;gx+=spacing)body+=svg('path',{d:`M${gx} ${y}v${ht}`,stroke:p.line,fill:'none'});
    for(let gy=Math.ceil(y/spacing)*spacing;gy<y+ht;gy+=spacing)body+=svg('path',{d:`M${x} ${gy}h${w}`,stroke:p.line,fill:'none'});
    if(geo){
      for(const lon of [-120,-60,0,60,120]){const gx=(lon+180)/360*1200;if(gx>=x&&gx<x+w)body+=svg('text',{x:gx+5,y:y+ht-10,fill:p['text-2'],'font-size':Math.max(14,w/32),'font-family':'monospace'},`${Math.abs(lon)}°${lon<0?'W':lon>0?'E':''}`);}
    }else body+=svg('text',{x:x+12,y:y+ht-12,fill:p['text-2'],'font-size':24,'font-family':'monospace'},`GRID 0 / 0 — ${w} / ${ht}`);
    return body;
  }
  const routeSVG=(ps,p,kind='normal',alternate=false)=>svg('polyline',{points:points(ps),fill:'none',stroke:color(kind,p),'stroke-width':alternate?1.5:2,'stroke-dasharray':alternate?'3 7':'9 6','vector-effect':'non-scaling-stroke'});
  function mapGraphic(title,box,body,contacts=[],p=palette()){
    const [x,y,w,ht]=box.split(/\s+/).map(Number);
    return h('div.tc-map-canvas',{style:`aspect-ratio:${w}/${ht}`},h('img.tc-map-svg',{src:uri(body,box,p),alt:title,width:w,height:ht,draggable:'false'}),contacts.filter(c=>c.x>=x&&c.x<=x+w&&c.y>=y&&c.y<=y+ht).map(c=>h('a.tc-map-point',{href:PC.href('map-room',...c.path),'aria-label':`${c.title} · ${c.status||''} · X ${c.x} Y ${c.y}`,title:c.title,style:`left:${(c.x-x)/w*100}%;top:${(c.y-y)/ht*100}%`,class:c.selected?'is-selected':null},h('span.tc-sr',{text:c.title}))));
  }
  function legend(){
    const p=palette();return h('ul.tc-map-legend',{'aria-label':'지도 기호 범례'},[['normal','아군 / 정상'],['hostile','적대'],['unknown','미상 / 상충'],['unstable','불안정'],['split','신호 분열'],['lost','신호 소실'],['facility','시설'],['incident','사건'],['cult','교단'],['fortress','성채'],['anomaly','이상현상'],['returned','귀환'],['line','관측선'],['zone','권역'],['signal','동시 관측'],['ruin','폐허'],['settlement','정착지']].map(([k,t])=>h('li',null,h('img',{src:uri(symbol(k,20,20,'',p),'0 0 40 40',p),alt:'',width:26,height:26}),h('span',{text:t}))));
  }
  function layers(group,labels){return h('div.tc-seg.tc-map-layers',{role:'group','aria-label':group==='layers'?'지도 레이어':'상세 지도 레이어'},labels.map(([key,label])=>action(label,'layer',`${group}:${key}`,{'aria-pressed':String(state[group][key])})));}
  const mapFrame=(code,status,graphic,...tail)=>h('section.tc-panel.tc-bracket.tc-map-board',null,h('header.tc-map-board-head',null,h('span.tc-code',{text:code}),h('span',{text:status})),graphic,h('p.tc-map-coordinates',{text:'RECONSTRUCTED COORDINATES / NOT FOR NAVIGATION'}),...tail);
  function resolveSite(item){
    let out={...item};const [id,idx]=X.scenarioStageByItem[item.id]||[];
    if(id){const s=P.get(id),end=P.getEnding(id),scenario=scenarios[id];const choice=s.choices.find(c=>c.stage===scenario.stages[idx].id);
      if(end&&idx===scenario.stages.length-1)out={...out,status:end.status,tone:end.tone};
      else if(choice)out={...out,status:scenario.outcomeLabels[choice.ruleOutcome]||choice.ruleOutcome,tone:traceTone(choice.ruleOutcome)};
    }
    const change=item.verdictStates?.[O.get().verdict];return change?{...out,...change}:out;
  }
  function riskFor(site){const s=resolveSite(site);return ['failed','hostile'].includes(s.tone)?'critical':['allied','secured'].includes(s.tone)?'low':s.tone==='contained'?'medium':['unknown','incident','zone','anomaly'].includes(site.type)||site.confidence==='disputed'?'high':['cult','fortress','ruin'].includes(site.type)?'medium':'low';}
  function commFor(site){const s=resolveSite(site);return ['allied','secured'].includes(s.tone)?'open':['failed','hostile'].includes(s.tone)||['unknown','anomaly','zone','incident'].includes(site.type)?'lost':['facility','signal','settlement','returned','cult'].includes(site.type)?'partial':'none';}
  function worldMap(r,selected=null,syncEvent=null,syncPoint=null){
    const p=palette();let body=grid(r.viewBox,p,true);
    body+=D.geography.map(g=>svg('path',{d:g.d,fill:p['panel-2'],stroke:p['line-2'],'stroke-width':1})).join('');
    if(state.layers.zones)body+=D.zones.filter(z=>r.id==='world'||z.region===r.id).map(z=>svg('path',{d:z.d,fill:p.red,opacity:.18,stroke:p['red-ink'],'stroke-width':1})).join('');
    if(state.layers.routes&&!syncEvent)body+=D.routes.filter(z=>r.id==='world'||z.region===r.id).map(z=>routeSVG(z.points,p,z.className==='hostile'?'hostile':'normal')).join('');
    const markers=D.markers.filter(m=>(r.id==='world'?m.overview:m.region===r.id&&!m.overview)&&(uncertain(m.confidence)?state.layers.estimated:state.layers.confirmed));
    if(selected&&!markers.some(m=>m.id===selected.id))markers.push(selected);
    const contacts=markers.map((m,i)=>{const resolved=resolveSite(m);body+=symbol(m.type,m.x,m.y,String(i+1).padStart(2,'0'),p,resolved.tone||m.type);return {...resolved,title:m.title,path:m.overview?['region',m.region]:['marker',m.id],selected:selected?.id===m.id};});
    if(state.layers.synchrony)for(const e of syncEvent?[syncEvent]:D.synchronyEvents)for(const point of e.points.filter(pt=>r.id==='world'||pt.region===r.id)){
      body+=symbol('signal',point.x,point.y,'',p);contacts.push({...point,title:point.label,path:['synchrony',e.id,point.id],selected:point.id===syncPoint?.id});
    }
    return {board:mapFrame(r.code,r.status,mapGraphic(r.label,r.viewBox,body,contacts,p),layers('layers',[['confirmed','확인'],['estimated','추정·증언'],['zones','오염 권역'],['routes','이동 경로'],['synchrony','2042 동시 관측']]),disclosure('SYMBOL KEY','지도 기호 범례',legend())),contacts};
  }
  function directory(contacts){return panel('CONTACT DIRECTORY','지점 판독 목록',h('div.tc-rows',null,contacts.map((c,i)=>row(String(i+1).padStart(2,'0'),c.title,`X ${c.x} / Y ${c.y}`,c.path,c.status||'관측점'))));}
  function regionIntel(r){
    const n=r.nomenclature;return panel(r.code,r.label,txt(r.description),kv([['관제 상태',r.status],['자료 상태',r.confidence],...(n?[['기록 표제',`${n.primary} / ${n.short}`],['지리 범위',n.scope],['현지·구어',n.aliases.map(a=>a.label).join(' · ')],['폐기 표기',n.legacy.map(a=>a.label).join(' · ')]]:[])]),note('판독 한계',n?.boundary||X.copy.navigation),h('div.tc-btnrow',null,D.drilldowns.filter(d=>d.region===r.id).map(d=>link(d.label,'map-room','region',d.id))));
  }
  function markerIntel(m){
    const s=resolveSite(m),inc=incident(m.incident);const near=detail(X.markerDetails[m.id]);const scenario=X.scenarioStageByItem[m.id]?.[0];
    return panel('SELECTED CONTACT',m.title,txt(m.meta),kv([['좌표',`X ${m.x} / Y ${m.y}`],['상태',s.status],['판정',confidence[m.confidence]],['사건 코드',inc?.code]]),inc?txt(inc.summary):null,references(m),h('div.tc-btnrow',null,link('권역 개요','map-room','region',m.region),near?link(near.label,'map-room','region',near.id):null,scenario?link(scenarios[scenario].title,'map-room','pilgrimage',scenario):null));
  }
  function synchronyIntel(e,point){return panel(e.code,e.title,txt(e.summary),kv([['관측 시각',e.date],['무응답',e.duration],['판정',confidence[e.confidence]],['관측점',`${e.points.length} SIGNALS`],['성채 종 장부',String(e.points.filter(pt=>pt.region==='southamerica').length)],['검문소 무응답 기록',String(e.points.filter(pt=>pt.region==='northamerica').length)],...(point?[['현장',point.site],['수신 호출',point.callsign],['복구 장부',point.log]]:[])]),note('NO ROUTE / NO GEOGRAPHIC LINK',e.boundary),link('세계 기록에서 삼야 무응답 열기','history',e.history),h('div.tc-rows',null,e.points.map(pt=>row(pt.code,pt.label,pt.site,['synchrony',e.id,pt.id],pt.log))));}
  function regionView(v){
    const r=v.kind==='region'?v.item:v.kind==='synchrony'?region(v.point?.region||'world'):v.region;
    const m=worldMap(r,v.kind==='marker'?v.item:null,v.kind==='synchrony'?v.item:null,v.point);
    return h('div.tc-map-stack',null,h('nav.tc-btnrow',{'aria-label':'관제 권역'},D.regions.map(x=>link(x.label,'map-room','region',x.id))),h('div.tc-map-layout.tc-map-contact-layout',null,h('div.tc-map-stack',null,m.board,directory(m.contacts)),intelPanel(v.kind==='marker'?markerIntel(v.item):v.kind==='synchrony'?synchronyIntel(v.item,v.point):regionIntel(r))));
  }
  function briefing(d,site){
    const visible=b=>b&&(!site||!b.siteIds?.length||b.siteIds.includes(site.id));const b=d.signalBrief;
    const blocks=[];
    // 권역 대표 그림(visual)과, 지점을 골랐을 때만 붙는 지점 그림(visuals). 이어 볼 세계 기록이 없으면 링크를 달지 않는다.
    const figure=visual=>{const target=visual.history||site?.history,img=PC.img(visual.src,{alt:visual.alt||'',sizes:'(max-width: 760px) 94vw, 480px'});
      return h('figure.tc-evidence',null,target?h('a.tc-evidence-media',{href:PC.href('history',target)},img):h('div.tc-evidence-media',null,img),h('figcaption',null,h('b',{text:visual.label}),h('strong',{text:visual.title}),h('span.tc-map-copy',{text:visual.caption}),h('span.tc-code',{text:visual.assetId})),target?link('확대·세계 기록 열기','history',target):null);};
    if(visible(d.visual))blocks.push(figure(d.visual));
    (d.visuals||[]).filter(v=>site&&v.siteIds?.includes(site.id)).forEach(v=>blocks.push(figure(v)));
    if(visible(b)){
      const lanes=h('div.tc-map-signal-lanes',null,b.lanes.map(l=>h('div.tc-map-signal-lane',null,
        h('b.tc-code',{text:l.code}),tag(l.state),
        h('div.tc-map-wave',{'aria-hidden':'true'},l.pattern.map(n=>h('i',{style:`height:${Math.max(1,Math.min(9,n))*10}%`}))),
        h('span.tc-code',{text:l.fingerprint})
      )));
      const log=h('ol.tc-log.tc-map-log',null,b.log.map(l=>h('li',null,h('time',{text:l.time}),h('span.tc-map-copy',{text:l.text}))));
      blocks.push(panel(b.label,b.title,txt(b.summary),lanes,kv(b.checks.map(c=>[c.label,c.value])),log));
    }
    return blocks;
  }
  function routeSequence(d,site){
    const routes=d.routes.filter(r=>r.siteIds?.includes(site.id));
    return routes.length?routes.map(r=>{
      const index=r.siteIds.indexOf(site.id),neighbor=offset=>{const id=r.siteIds[index+offset];return id?link(offset<0?'← 이전 지점':'다음 지점 →','map-room','region',d.id,'site',id):null;};
      return panel(r.label,`${risks[r.risk]} 위험 · ${String(r.signal).toUpperCase()}`,txt(r.rule),h('div.tc-btnrow',null,neighbor(-1),neighbor(1)),h('ol.tc-map-route-sequence',null,r.siteIds.map((id,i)=>{const s=d.sites.find(s=>s.id===id);return h('li',null,s?link(`${String(i+1).padStart(2,'0')} · ${s.label}`,'map-room','region',d.id,'site',id):missing(id));})));
    }):note('CONNECTED ROUTE','연결 경로가 복원되지 않았다.');
  }
  function detailView(v){
    const d=v.item,site=v.site,p=palette(),box='0 0 1000 540';let body=grid(box,p)+detailTerrain(d);
    if(state.detailLayers.threats)for(const s of d.sites)body+=svg('circle',{cx:s.x,cy:s.y,r:{critical:78,high:62,medium:48,low:34}[riskFor(s)],fill:'none',stroke:riskFor(s)==='critical'?p['red-ink']:p.amber,'stroke-width':1,'stroke-dasharray':'3 5','vector-effect':'non-scaling-stroke'});
    if(state.detailLayers.comms)for(const s of d.sites){const comm=commFor(s);if(['open','partial'].includes(comm))body+=svg('circle',{cx:s.x,cy:s.y,r:comm==='open'?88:66,fill:'none',stroke:p.ir,'stroke-width':1,'stroke-dasharray':comm==='open'?'none':'8 6','vector-effect':'non-scaling-stroke'});}
    if(state.detailLayers.distortion)for(const [i,s] of d.sites.entries())if(['anomaly','unknown'].includes(s.type)||s.confidence==='disputed')body+=svg('ellipse',{cx:s.x,cy:s.y,rx:74+i%2*15,ry:42+i%3*8,fill:'none',stroke:p.coyote,'stroke-dasharray':'2 6','vector-effect':'non-scaling-stroke'});
    if(state.detailLayers.routes)for(const r of d.routes)body+=svg('g',{opacity:site&&!r.siteIds.includes(site.id)?0.4:1},routeSVG(r.points,p,r.className==='hostile'?'hostile':'normal'));
    const contacts=d.sites.map((s,i)=>{const resolved=resolveSite(s);body+=symbol(s.type,s.x,s.y,String(i+1).padStart(2,'0'),p,resolved.tone||s.type);return {...resolved,title:s.label,path:['region',d.id,'site',s.id],selected:site?.id===s.id};});
    const info=site?resolveSite(site):d,inc=site?incident(site.incident):null;
    const scenario=site?X.scenarioStageByItem[site.id]?.[0]:null;
    return h('div.tc-map-stack',null,h('nav.tc-btnrow',{'aria-label':'권역 경로'},link('세계','map-room','region','world'),link(region(d.region).label,'map-room','region',d.region),site?link('구역 개요','map-room','region',d.id):null),h('div.tc-map-layout.tc-map-contact-layout',null,
      h('div.tc-map-stack',null,mapFrame(d.code,d.status,mapGraphic(d.label,box,body,contacts,p),layers('detailLayers',[['routes','경로'],['threats','위험 반경'],['comms','통신권'],['distortion','공간 왜곡']]),disclosure('SYMBOL KEY','지도 기호 범례',legend())),directory(contacts)),
      intelPanel(panel(site?'SELECTED SITE':'REGIONAL DRILLDOWN',site?.label||d.label,txt(site?.meta||d.description),kv([['현재 상태',info.status],['사건 지점',`${d.sites.length} SIGNALS`],['복원 신뢰도',site?confidence[site.confidence]:d.confidence],...(site?[['좌표',`X ${site.x} / Y ${site.y}`],['위험도',risks[riskFor(site)]],['통신',commFor(site).toUpperCase()],['연결 경로',String(d.routes.filter(r=>r.siteIds.includes(site.id)).length)],['사건 코드',inc?.code]]:[])]),note('판독 한계',d.warning),inc?txt(inc.summary):null,references(site||d),scenario?link(scenarios[scenario].title,'map-room','pilgrimage',scenario):null),...briefing(d,site),site?routeSequence(d,site):null)),
      disclosure('REGIONAL INDEX','다른 권역 상세도',h('div.tc-rows',null,D.drilldowns.map(x=>row(x.code,x.label,x.description,['region',x.id],x.confidence)))));
  }
  function initStep(o){
    const id=scenarioForOperation(o);const summary=id?P.getSummary(id):null;
    if(summary)return summary.status==='complete'?o.steps.length-1:summary.status==='active'?summary.step:0;
    return Math.max(0,Math.min(o.steps.length-1,rememberedSteps.has(o.id)?rememberedSteps.get(o.id):o.id===O.operationId?O.get().mapStep:state.operation===o.id&&Number.isFinite(state.step)?state.step:summary?.status==='complete'?o.steps.length-1:summary?.status==='active'?summary.step:0));
  }
  function stepPhase(o,index){
    const decision=o.id===O.operationId?O.getDecision():null;
    if(decision)return decision.stepStates[index]||'available';
    const id=scenarioForOperation(o),ss=id?P.get(id):null;
    return ss?(ss.choices[index]?.ruleOutcome||(ss.status==='active'&&index===ss.step?'active':'locked')):'available';
  }
  function reachable(o,index){return index===step||stepPhase(o,index)!=='locked';}
  function adjacent(o,direction){for(let i=step+direction;i>=0&&i<o.steps.length;i+=direction)if(reachable(o,i))return i;return step;}
  function stop(){root.clearInterval(timer);timer=0;playing=false;}
  function setStep(index){
    if(view?.kind!=='op'||lockedOperation(view.item)||!reachable(view.item,index))return;
    step=Math.max(0,Math.min(view.item.steps.length-1,index));rememberedSteps.set(view.item.id,step);
    if(view.item.id===O.operationId)O.setMapStep(step);
    renderOperationFrame();saveSession();
    sfx(fxData.stepCues?.[worstUnit(view.item.steps[step])]);
  }
  function play(){
    if(playing){stop();renderOperationFrame();return;}
    if(reduced.matches||view?.kind!=='op'||lockedOperation(view.item))return;
    if(adjacent(view.item,1)===step){const first=view.item.steps.findIndex((_,i)=>stepPhase(view.item,i)!=='locked');if(first<0||first===step)return;setStep(first);}
    playing=true;
    timer=root.setInterval(()=>{if(!active||reduced.matches||root.document.hidden||view.kind!=='op'){stop();return;}if(adjacent(view.item,1)===step){stop();renderOperationFrame();return;}setStep(adjacent(view.item,1));if(adjacent(view.item,1)===step){stop();renderOperationFrame();}},2200);
    renderOperationFrame();
  }
  function operationBoard(o){
    const s=o.steps[step],p=palette(),box='0 0 1000 540';let body=grid(box,p)+operationTerrain(o);
    const decision=o.id===O.operationId?O.getDecision():null;
    const scenarioId=scenarioForOperation(o),ss=scenarioId?P.get(scenarioId):null;
    for(const [i,site] of o.sites.entries())body+=symbol(decision?.siteStates[i]==='hostile'?'hostile':site.kind,site.x,site.y,String(i+1).padStart(2,'0'),p);
    if(s.alternate)body+=routeSVG(s.alternate,p,'unstable',true);
    body+=routeSVG(s.route,p);
    if(decision?.route)body+=routeSVG(decision.route,p,decision.id==='execute'?'hostile':'normal',true);
    for(const u of s.units)body+=symbol(u.status,u.x,u.y,u.id,p);
    const control=h('div.tc-map-playback',{role:'group','aria-label':'작전 경과 재생'},action('← 이전 단계','previous','',{disabled:adjacent(o,-1)===step}),action(playing?'정지':'재생','play','',{disabled:reduced.matches||o.steps.filter((_,i)=>reachable(o,i)).length<2,'aria-pressed':String(playing)}),action('다음 단계 →','next','',{disabled:adjacent(o,1)===step}),h('span.tc-code',{'aria-live':'polite',text:`${s.time} · ${step+1} / ${o.steps.length}`}),h('p.tc-map-help',{text:reduced.matches?'모션 감소 설정: 자동 재생 중지 · 이전·다음 단계로 열람':'← / → 단계 이동 · 스페이스 재생·정지'}));
    const steps=h('ol.tc-phase.tc-map-phases',null,o.steps.map((item,i)=>h('li',{class:i<step?'is-done':i===step?'is-contact':null},action(`${item.time} · ${item.title}`,'step',String(i),{'aria-current':i===step?'step':null,disabled:!reachable(o,i)}),ss?.choices[i]?tag(ss.choices[i].ruleOutcome,'evidence'):stepPhase(o,i)==='locked'?tag('기입 대기'):null)));
    return h('div.tc-map-stack',null,mapFrame(o.code,s.time,mapGraphic(o.label,box,body,[],p),control),steps,
      panel('UNIT STATUS','부대 상태',h('ul.tc-map-units',null,s.units.map(u=>h('li',null,h('img',{src:uri(symbol(u.status,20,20,'',p),'0 0 40 40',p),width:40,height:40,alt:''}),h('b.tc-code',{text:u.id}),h('span',{text:statusLabels[u.status]||u.status}),h('span.tc-code',{text:`X ${u.x} / Y ${u.y}`}))))),disclosure('SYMBOL KEY','지도 기호 범례',legend()),
      panel('SITE INDEX','작전 지점',h('ol.tc-map-bullets',null,o.sites.map((s,i)=>h('li',{text:`${String(i+1).padStart(2,'0')} · ${s.label} · X ${s.x} / Y ${s.y}${decision?.siteStates[i]?' · '+decision.siteStates[i]:''}`})))));
  }
  function operationIntel(o){
    const decision=o.id===O.operationId?O.getDecision():null,id=scenarioForOperation(o),ending=id?P.getEnding(id):null;
    const inc=incident(o.incident)||root.ProjectCurseIncidentNetwork.incidentList.find(i=>i.operation===o.id);
    return intelPanel(panel(o.code,o.label,txt(o.summary),kv([['분류',o.classification],['기록 상태',o.status],['현장 판정',decision?.status||ending?.status],['권역',o.region]]),o.directive?note('COMMAND DIRECTIVE',o.directive):null,o.objectives?list(o.objectives):null,references(o,inc),id?link(scenarios[id].title,'map-room','pilgrimage',id):null,inc?.region?link('해당 권역에서 보기','map-room','region',inc.region):null,o.id===O.operationId?link('작전 판단 원문','archive-entry','Operation_Broken_Crown'):null),
      panel('COMMUNICATION LOG','현재까지의 교신 기록',h('ol.tc-log.tc-map-log',{'aria-label':'단계별 교신 기록'},o.steps.slice(0,step+1).map((s,i)=>h('li',{class:s.units.some(u=>['lost','split'].includes(u.status))?'is-loss':s.units.some(u=>u.status==='unstable')?'is-contact':null,'aria-current':i===step?'step':null},h('time',{text:s.time}),h('div',null,h('b',{text:s.title}),h('p.tc-map-copy',{text:s.note})))))),
      decision?panel(decision.code,decision.title,txt(decision.summary),txt(decision.observed),txt(decision.immediate),note('승인 대기',decision.unresolved),note('작전 영향',decision.consequence),note('후속 지침',decision.directive),note(O.canonBoundary.status,O.canonBoundary.scope)):null,
      ending?panel(ending.code,ending.title,txt(ending.summary),txt(ending.consequence),note('FIELD VERDICT',scenarios[id].canonBoundary)):null);
  }
  function sealed(requirement){
    const entry=V.getEntry(requirement);return panel('SEALED / VERDICT REQUIRED','접근 제한',kv([['필요 판정',requirement]]),entry?txt(entry.requirement):missing(requirement),entry?link(entry.lockedTitle,'map-room','verdict',entry.id):null,entry?link(scenarios[entry.scenarioId].title,'map-room','pilgrimage',entry.scenarioId):null);
  }
  function commandDecision(){
    const d=root.ProjectCurseArchiveDocuments.documents.Operation_Broken_Crown;
    const section=d.sections.find(s=>s.branches),branches=section.branches,s=O.get();
    return disclosure('LOCAL COMMAND VERDICT','부서진 왕관 현장 판정',[
      kv([['회수 정보',`${s.visited.length} / ${O.branchIds.length}`],['판정 상태',s.status]]),...section.paragraphs.map(txt),
      h('div.tc-map-stack',null,branches.entries.map(b=>h('section.tc-map-branch',null,action(`${b.label} · ${s.visited.includes(b.id)?'회수됨':b.status}`,'branch',b.id,{'aria-expanded':String(branchOpen===b.id)}),branchOpen===b.id?h('div.tc-map-stack',null,txt(b.summary),txt(b.reveal),kv([['출처',b.source],['근거',b.evidence],['판정 한계',b.limit]])):null))),
      s.visited.length===O.branchIds.length?note(branches.label,branches.complete,'evidence'):null,
      note(O.canonBoundary.status,O.canonBoundary.scope),list(O.canonBoundary.fixedFacts),disclosure('PENDING REVIEW','후대 승인 대기',list(O.canonBoundary.pendingFacts)),txt(O.canonBoundary.lineageGuard),
      h('div.tc-map-choices',null,Object.values(O.decisions).map(d=>h('button.tc-btn.tc-map-choice',{type:'button',disabled:s.visited.length!==O.branchIds.length,dataset:{action:'command',key:d.id,control:`command:${d.id}`},'aria-pressed':String(s.verdict===d.id)},h('span.tc-code',{text:d.code}),h('b',{text:d.title}),h('span',{text:d.immediate})))),
      action(resetArm==='operation'?'한 번 더 눌러 초기화 확인':'작전 진행 초기화','reset-operation','',{class:'tc-btn--danger'})
    ],{open:branchOpen!==null||!!s.verdict,dataset:{disclosure:'command'}});
  }
  function operationView(o){
    return h('div.tc-map-stack',null,h('nav.tc-btnrow',{'aria-label':'작전 기록'},D.operations.map(op=>link(op.label,'map-room','op',op.id))),lockedOperation(o)?h('div.tc-map-stack',null,bodyTitle(o.code,o.label,o.summary),tag(o.status,'danger'),sealed(o.unlockVerdict)):h('div.tc-map-stack',null,h('div.tc-map-layout#tc-map-operation-frame',null,operationBoard(o),operationIntel(o)),o.id===O.operationId?commandDecision():null));
  }
  function preserveFocus(callback){const el=root.document.activeElement,control=el?.dataset.control;const y=root.scrollY;callback();if(control){const next=[...host.querySelectorAll('[data-control]')].find(n=>n.dataset.control===control);next?.focus({preventScroll:true});}root.scrollTo(0,y);}
  function renderOperationFrame(){const frame=host.querySelector('#tc-map-operation-frame');if(!frame||view.kind!=='op')return;preserveFocus(()=>PC.clear(frame).append(operationBoard(view.item),operationIntel(view.item)));}

  function severity(s,st){
    const m=st.metrics;
    if(s.id==='deadzone-return')return m.exposure>=60||m.identity<=35?'critical':m.exposure>=34||m.coherence<=50?'unstable':'nominal';
    if(s.id==='deadzone-recovery')return m.echo>=58||m.team<=45||m.tether<=30?'critical':m.echo>=30||m.team<=70||m.tether<=55?'unstable':'nominal';
    return m.corruption>=55||m.signal<=35?'critical':m.corruption>=28||m.fear>=58?'unstable':'nominal';
  }
  function metricPanel(s,st){return panel('FIELD MEASUREMENT','현장 측정값',h('div.tc-map-meters',null,s.metrics.map(m=>h('label',null,h('span',{text:m.label}),h('b',{text:`${st.metrics[m.key]}%`}),h('meter',{min:0,max:100,value:st.metrics[m.key],'aria-label':m.label})))),kv([['채널',s.channel],['기입',`${st.choices.length} / ${s.stages.length}`],['규칙 위반',String(st.violations)],['상태',st.status.toUpperCase()],['현장 신호',severity(s,st).toUpperCase()],['진행도',`${P.getSummary(s.id).progress}%`]]));}
  function decisionFeedback(s){
    if(feedback?.scenarioId!==s.id)return null;
    const changes=s.metrics.filter(m=>feedback.deltas[m.key]).map(m=>[m.label,`${feedback.deltas[m.key]>0?'+':''}${feedback.deltas[m.key]} · ${feedback.after[m.key]}%`]);
    return panel(`FIELD DECISION SEALED / ${feedback.code}`,feedback.label,tag(feedback.outcome,'evidence'),txt(feedback.description),note('LOCAL VERDICT',s.canonBoundary),changes.length?kv(changes):txt('±0 · 기록 유지'));
  }
  function choiceLog(s,st){return panel('FIELD DECISION LOG','현장 판단 기록',st.choices.length?h('ol.tc-log.tc-map-log',null,st.choices.map((entry,i)=>{const si=s.stages.findIndex(x=>x.id===entry.stage),stage=P.getStage(s.id,si,st),choice=stage?.choices.find(c=>c.id===entry.choice);return h('li',null,h('time',{text:stage?.time||String(i+1)}),h('div',null,h('b',{text:stage?.title||entry.stage}),txt(choice?.label||entry.choice),tag(s.outcomeLabels[entry.ruleOutcome]||entry.ruleOutcome,'evidence')));})):txt('아직 현장 판단이 기록되지 않았다.'));}
  function pilgrimageMap(s,st){
    const p=palette();let body=grid(s.map.viewBox,p);body+=routeSVG(s.map.points,p,'unknown',true);const n=Math.max(1,Math.min(s.map.points.length,st.choices.length+1));body+=routeSVG(s.map.points.slice(0,n),p);
    s.map.points.forEach(([x,y],i)=>{body+=symbol(i<st.choices.length?'normal':i===st.step?'unstable':'unknown',x,y,String(i+1).padStart(2,'0'),p);});
    return mapFrame(s.code,st.status.toUpperCase(),mapGraphic(s.title,s.map.viewBox,body,[],p),h('ol.tc-map-maplabels',null,s.map.labels.map((label,i)=>h('li',{text:`${String(i+1).padStart(2,'0')} · ${label}`}))));
  }
  function pilgrimageView(s){
    if(!allowedScenario(s.id))return h('div.tc-map-stack',null,bodyTitle(s.code,s.title),sealed(s.unlock.id));
    const st=P.get(s.id),summary=P.getSummary(s.id);let content;
    if(st.status==='idle')content=panel(s.entryLabel,s.title,txt(s.summary),kv([['권역',s.region],['연결 사건',s.incident],['상태','NOT STARTED']]),note(s.directiveLabel,s.directive),list(s.fixedFacts),note('RECORD AUTHORITY',s.canonBoundary),action('현장 기록 진입','start',s.id),recordLink('관련 기록 먼저 확인',s.guideRecord));
    else if(st.status==='complete'){
      const e=P.getEnding(s.id),v=V.list().find(v=>v.scenarioId===s.id&&v.endingId===st.ending&&v.unlocked);
      content=panel(e.code,e.title,tag(e.status,'evidence'),txt(e.summary),note('관제 결과',e.consequence),note('FIELD VERDICT / CENTRAL ARCHIVE UNAPPROVED',s.canonBoundary),v?link('보관된 판정 기록 열기','map-room','verdict',v.id):null,link('관제도에서 결과 확인','map-room','region',s.mapTarget.detail,'site',s.mapTarget.site),recordLink('관련 지역 기록 열기',s.primaryRecord),action(resetArm===s.id?'한 번 더 누르면 현재 진행이 초기화됩니다':'현재 진행 초기화','reset-pilgrimage',s.id,{class:'tc-btn--danger'}));
    }else{
      const stage=P.getStage(s.id);
      content=panel(`${stage.code} / ${stage.time}`,stage.title,txt(stage.location),stage!==s.stages[st.step]?note('EARLIER DECISION DETECTED','이전 현장 판단이 현재 신호를 변경했습니다.','evidence'):null,note('TRANSMISSION',stage.signal,'evidence'),txt(stage.narrative),note(stage.rule.code,stage.rule.text),note('DECISION STANDARD',s.decisionStandard),h('div.tc-map-choices',null,stage.choices.map((c,i)=>h('button.tc-btn.tc-map-choice',{type:'button',dataset:{action:'choice',key:c.id,control:`choice:${c.id}`}},h('span.tc-code',{text:String(i+1).padStart(2,'0')}),h('b',{text:c.label}),h('span',{text:c.description}),tag(({safe:'접촉 최소화',neutral:'통제된 손실',risk:'규칙 이탈 가능',danger:'직접 노출'})[c.tone]||'현장 판단',['risk','danger'].includes(c.tone)?'caution':'info')))));
    }
    return h('div.tc-map-stack',null,bodyTitle(s.code,s.title),h('div.tc-btnrow',null,link('작전 경과 열람','map-room','op',s.operation),...s.records.map(id=>recordLink(id,id)),link('현장 판정 보관','map-room','verdict')),decisionFeedback(s),h('div.tc-map-layout',null,h('div.tc-map-stack',null,pilgrimageMap(s,st),metricPanel(s,st),choiceLog(s,st)),h('div.tc-map-stack',null,content)));
  }
  function recordLink(label,id){return V.getEntry(id)?link(label,'map-room','verdict',id):link(label,'archive-entry',id);}
  function verdictsView(){
    const sum=V.getSummary();return h('div.tc-map-stack',null,bodyTitle('FIELD VERDICT ARCHIVE','현장 판정 보관',X.copy.archive),kv([['열린 기록',`${sum.unlocked} / ${sum.total}`],['읽지 않음',String(sum.unread)]]),Object.values(scenarios).map(s=>panel(s.code,s.title,h('div.tc-rows',null,V.list().filter(v=>v.scenarioId===s.id).map(v=>row(v.id,v.unlocked?v.title:v.lockedTitle,v.unlocked?v.summary:v.requirement,['verdict',v.id],v.unlocked?(v.unread?'새 기록':'확인함'):'접근 제한',v.unlocked?'evidence':'danger'))),link('현장 기록 열람','map-room','pilgrimage',s.id))),disclosure('LOCAL STORAGE','판정 기록 관리',[txt(X.copy.archiveManage),action('모든 기록을 읽지 않음으로 표시','reset-read'),...Object.values(scenarios).map(s=>action(resetArm===`clear:${s.id}`?'한 번 더 눌러 판정 삭제 확인':`${s.title} 판정 삭제`,'clear-verdicts',s.id)),action(resetArm==='clear:all'?'한 번 더 눌러 전체 판정 삭제 확인':'모든 판정 기록 삭제','clear-verdicts','all',{class:'tc-btn--danger'})],{open:resetArm.startsWith('clear:')}));
  }
  function verdictView(entry){
    if(!entry.unlocked)return h('div.tc-map-stack',null,bodyTitle(entry.id,entry.lockedTitle,entry.requirement),link('필요한 현장 기록 열람','map-room','pilgrimage',entry.scenarioId),link('판정 보관 목록','map-room','verdict'));
    const d=V.getDocument(entry.id);
    return h('article.tc-map-stack',null,bodyTitle(d.code,d.title,d.summary),kv([['보관 시각',d.date],['작성',d.owner],['분류',d.classification],...d.telemetry]),d.sections.map(s=>panel('FIELD VERDICT',s.title,s.record?kv(Object.entries(s.record)):null,...(s.paragraphs||[]).map(txt),s.warning?note('판정 한계',s.warning):null,s.table?h('div.tc-map-table-wrap',null,h('table.tc-map-table',null,h('thead',null,h('tr',null,s.table.headers.map(t=>h('th',{scope:'col',text:t})))),h('tbody',null,s.table.rows.map(row=>h('tr',null,row.map(t=>h('td',{text:t}))))))):null,s.quote?h('blockquote.tc-map-quote',{text:s.quote}):null)),h('div.tc-btnrow',null,link('판정 보관 목록','map-room','verdict'),link('현재 현장 기록','map-room','pilgrimage',entry.scenarioId),d.unlockScenario?link('후속 현장 기록','map-room','pilgrimage',d.unlockScenario):null));
  }
  function indexTarget(item){
    const t=item.target;
    if(t.kind==='operation')return ['op',t.id];
    if(t.kind==='marker')return ['marker',t.id];
    if(t.kind==='synchrony'){const e=D.synchronyEvents.find(e=>e.points.some(p=>p.id===t.id));return ['synchrony',e?.id,t.id];}
    return ['incident',t.id];
  }
  function matchesFilter(item){
    const f=state.indexFilter;
    if(['event','site','operation','synchrony'].includes(f))return item.category===f;
    if(f==='confirmed')return !item.uncertain&&item.category!=='withheld';
    if(f==='estimated')return item.uncertain;
    if(f==='unresolved')return item.unresolved;
    if(f==='linked')return item.linked;
    return true;
  }
  const filtered=()=>signals.items.filter(s=>matchesFilter(s)&&(!state.indexQuery.trim()||s.search.includes(state.indexQuery.trim().toLocaleLowerCase('ko-KR'))));
  function indexRows(){const rows=filtered();return rows.length?rows.map(s=>row(s.code,s.title,s.meta,indexTarget(s),signals.confidenceLabels[s.confidence]||confidence[s.confidence],PC.verdictTone(s.confidence))):[missing(state.indexQuery||state.indexFilter)];}
  function signalIndex(){return disclosure('SIGNAL INDEX',`신호 색인 · ${signals.items.length}개`,[
    txt(X.copy.index),h('div.tc-map-search',null,h('label',{for:'tc-map-search',text:'사건·권역·세력·호출부호 검색'}),h('input#tc-map-search',{type:'search',value:state.indexQuery,maxlength:80,autocomplete:'off',dataset:{control:'search'}}),action('검색 초기화','clear-search')),
    h('div.tc-seg',{role:'group','aria-label':'신호 색인 필터'},signals.filters.map(f=>action(f.label,'filter',f.id,{'aria-pressed':String(f.id===state.indexFilter)}))),h('p.tc-code#tc-map-count',{'aria-live':'polite',text:`${filtered().length}개 접촉 정보`}),h('div.tc-rows#tc-map-search-results',null,indexRows()),note('POSITION WITHHELD',X.copy.withheld,'evidence')
  ],{open:state.indexOpen,dataset:{disclosure:'index'}});}
  function updateIndex(){const results=host.querySelector('#tc-map-search-results');if(results)PC.clear(results).append(...indexRows());const count=host.querySelector('#tc-map-count');if(count)count.textContent=`${filtered().length}개 접촉 정보`;host.querySelectorAll('[data-action="filter"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.key===state.indexFilter)));saveSession();}
  function overview(){
    const map=worldMap(region('world'));const locations=recent.map(p=>({p:canonical(p),v:resolve(p)})).filter(x=>x.v.kind!=='missing');
    return h('div.tc-map-stack',null,h('div.tc-map-layout',null,h('div.tc-map-stack',null,map.board,panel('OPERATIONS INDEX','작전 경과',h('div.tc-rows',null,D.operations.map(o=>row(o.code,o.label,o.region,['op',o.id],o.status||`${o.steps.length} STEPS`,lockedOperation(o)?'danger':'info'))))),h('aside.tc-map-stack',null,panel('OPERATIONAL THEATERS','전구 관제',txt(X.copy.intro),h('div.tc-rows',null,X.theaters.map(t=>h('a.tc-map-theater',{href:PC.href('map-room',t.target.kind==='operation'?'op':'region',t.target.id)},h('span.tc-code',{text:t.number+' / '+t.eyebrow}),h('b',{text:t.title}),txt(t.summary),h('span.tc-map-copy',{text:t.note}),h('span.tc-btnrow',null,tag(t.status,t.id==='south'?'danger':'info'),tag(t.confidence)))))),panel('REGIONAL CONTROL','관제 권역',h('div.tc-btnrow',null,D.regions.map(r=>link(r.label,'map-room','region',r.id))),h('div.tc-btnrow',null,D.synchronyEvents.map(e=>link(e.title,'map-room','synchrony',e.id)))),locations.length?panel('RECENT COORDINATES','최근 열람한 좌표',h('div.tc-rows',null,locations.map(({p,v},i)=>row(String(i+1).padStart(2,'0'),v.title,v.item?.code||'',p)))):null)),
      panel('REGIONAL DRILLDOWN','권역 상세도',h('div.tc-rows',null,D.drilldowns.map(d=>row(d.code,d.label,d.description,['region',d.id],d.confidence)))),
      panel('FIELD RECORDS','순례·검문·회수',h('div.tc-rows',null,Object.values(scenarios).map(s=>row(s.code,s.title,s.summary,['pilgrimage',s.id],allowedScenario(s.id)?P.get(s.id).status.toUpperCase():s.unlock.label,allowedScenario(s.id)?'info':'danger'))),link('현장 판정 보관','map-room','verdict')));
  }
  function render(){
    view=resolve(parts);PC.clear(host);PC.setTitle(view.title);
    host.append(PC.screenHead('map-room',{title:view.title,meta:[['MAP',D.version],['OPERATIONS',String(D.operations.length)],['SIGNALS',String(signals.items.length)]]}));
    host.append(h('nav.tc-map-toolbar',{'aria-label':'상황 관제 탐색'},action('← 뒤로','back'),link('관제 목록','map-room'),link('세계 지도','map-room','region','world'),link('판정 보관','map-room','verdict'),action('좌표 링크 복사','copy')));
    if(view.kind!=='missing')host.append(signalIndex());
    const content=view.kind==='index'?overview():['region','marker','synchrony'].includes(view.kind)?regionView(view):view.kind==='detail'?detailView(view):view.kind==='op'?operationView(view.item):view.kind==='pilgrimage'?pilgrimageView(view.item):view.kind==='verdicts'?verdictsView():view.kind==='verdict'?verdictView(view.item):view.kind==='withheld'?panel('POSITION WITHHELD',view.item.title,txt(view.item.meta),note('위치 보류',X.copy.withheld),references(view.item,{history:view.item.history,factions:view.item.factionKeys}),link('관측 권역','map-room','region',view.item.regionId)):missing(view.key);
    host.append(h('div.tc-map-content',null,content));
    if(storageFailed)host.append(note('LOCAL STORAGE','저장소에 접근할 수 없습니다. 현재 탭의 열람 상태만 유지됩니다.'));
    saveSession();
  }
  function focusContent(){const el=host.querySelector('.tc-map-content [data-tc-focus], .tc-map-content h2');if(el){el.setAttribute('tabindex','-1');el.focus({preventScroll:true});}}
  function confirmAction(key,fn){if(resetArm!==key){resetArm=key;preserveFocus(render);return;}resetArm='';fn();preserveFocus(render);}
  let handling=false;
  function onClick(event){
    const b=event.target.closest('[data-action]');if(!b||!host.contains(b)||b.disabled)return;
    const a=b.dataset.action,key=b.dataset.key;event.preventDefault();handling=true;
    try{
      if(a==='back'){PC.back('map-room');return;}
      if(a==='layer'){const [group,k]=key.split(':');state[group][k]=!state[group][k];preserveFocus(render);return;}
      if(a==='filter'){state.indexFilter=key;updateIndex();return;}
      if(a==='clear-search'){state.indexQuery='';host.querySelector('#tc-map-search').value='';updateIndex();host.querySelector('#tc-map-search').focus();return;}
      if(a==='copy'){
        const text=root.location.href;
        const manual=()=>{if(!active||!b.isConnected)return;const input=h('input.tc-map-copy-address',{value:text,readonly:true,'aria-label':'현재 지도 주소'});b.parentElement.append(input);input.focus();input.select();};
        if(root.navigator.clipboard?.writeText)root.navigator.clipboard.writeText(text).then(()=>{if(active&&b.isConnected)b.textContent='좌표 링크 복사됨';},manual);else manual();return;
      }
      if(a==='previous'||a==='next'||a==='step'){stop();setStep(a==='step'?Number(key):adjacent(view.item,a==='next'?1:-1));return;}
      if(a==='play'){play();return;}
      if(a==='branch'){branchOpen=branchOpen===key?null:key;if(branchOpen)O.visitBranch(key);preserveFocus(render);return;}
      if(a==='command'){stop();if(O.chooseVerdict(key)){step=O.get().mapStep;rememberedSteps.set(O.operationId,step);sfx(fxData.verdictCue);}preserveFocus(render);return;}
      if(a==='reset-operation'){confirmAction('operation',()=>{O.reset();step=0;branchOpen=null;rememberedSteps.delete(O.operationId);});return;}
      if(a==='start'){if(allowedScenario(key)){P.start(key);sfx(fxData.scenarioCues?.[key]?.start);render();focusContent();}return;}
      if(a==='choice'&&view.kind==='pilgrimage'&&allowedScenario(view.item.id)){
        const id=view.item.id,before=P.getStage(id),choice=before?.choices.find(c=>c.id===key);
        if(choice&&P.choose(key,id)){const cueSet=fxData.scenarioCues?.[id]||{};sfx(P.get(id).status==='complete'?cueSet.complete:['broken','compromised'].includes(choice.ruleOutcome)?cueSet.danger:cueSet.step);feedback={scenarioId:id,code:before.code,label:choice.label,description:choice.description,outcome:scenarios[id].outcomeLabels[choice.ruleOutcome],deltas:choice.deltas||{},after:P.get(id).metrics};render();focusContent();}return;
      }
      if(a==='reset-pilgrimage'){confirmAction(key,()=>{feedback=null;P.reset(key);});return;}
      if(a==='reset-read'){V.resetRead();preserveFocus(render);return;}
      if(a==='clear-verdicts'){confirmAction('clear:'+key,()=>{if(key==='all')V.clearAll();else V.clearScenario(key);});return;}
    }finally{handling=false;}
  }
  function onKey(event){
    if(event.key===' '&&event.target.closest('a.tc-map-point')){event.preventDefault();event.target.closest('a.tc-map-point').click();return;}
    if(event.key==='Escape'&&state.indexOpen){event.preventDefault();state.indexOpen=false;preserveFocus(render);host.querySelector('[data-disclosure="index"] summary')?.focus();return;}
    if(event.key==='Escape'&&['pilgrimage','verdict'].includes(view.kind)){event.preventDefault();PC.back('map-room');return;}
    if(view.kind!=='op'||lockedOperation(view.item)||event.altKey||event.ctrlKey||event.metaKey||event.repeat)return;
    if(event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();stop();setStep(adjacent(view.item,event.key==='ArrowRight'?1:-1));}
    if(event.key===' '&&!event.target.closest('a,summary,button:not([data-action="play"])')){event.preventDefault();play();}
  }
  function onInput(event){if(event.target.id==='tc-map-search'){state.indexQuery=event.target.value.slice(0,80);updateIndex();}}
  function onToggle(event){const key=event.target.dataset.disclosure;if(key==='index')state.indexOpen=event.target.open;else if(key==='intel')state.intelCollapsed=!event.target.open;else return;saveSession();}
  function onStore(event){
    if(event.type==='projectcurse:operation-state-change'&&event.detail.reason==='map-step'){if(view?.kind==='op'&&view.item.id===O.operationId)step=O.get().mapStep;return;}
    if(active&&!handling)preserveFocus(render);
  }
  function onMotion(){if(reduced.matches)stop();if(active&&view.kind==='op')renderOperationFrame();}
  function onVisibility(){if(root.document.hidden){stop();if(active&&view.kind==='op')renderOperationFrame();}}
  function bind(){
    controller?.abort();controller=new AbortController();const options={signal:controller.signal};
    host.addEventListener('click',onClick,options);host.addEventListener('input',onInput,options);host.addEventListener('keydown',onKey,options);host.addEventListener('toggle',onToggle,{...options,capture:true});
    for(const name of ['projectcurse:operation-state-change','projectcurse:pilgrimage-state-change','projectcurse:verdict-archive-change'])root.document.addEventListener(name,onStore,options);
    root.document.addEventListener('visibilitychange',onVisibility,options);reduced.addEventListener('change',onMotion,options);
  }
  function mount(el){host=el;}
  function show(next,app){
    stop();controller?.abort();active=true;parts=canonical(next);view=resolve(parts);handling=true;
    try{Object.keys(scenarios).forEach(id=>V.capture(id,{silent:true}));if(view.kind==='verdict'&&view.item.unlocked)V.markRead(view.item.id);}finally{handling=false;}
    if(view.kind==='pilgrimage')P.select(view.item.id);
    if(view.kind==='op'){operationId=view.item.id;step=initStep(view.item);}else operationId=null;
    if(['op','marker','synchrony'].includes(view.kind)||view.site)state.intelCollapsed=false;
    resetArm='';remember();render();app.setTitle(view.title);bind();
  }
  function hide(){active=false;stop();controller?.abort();controller=null;resetArm='';feedback=null;}
  PC.screen({id:'map-room',mount,show,hide});
})(window);
