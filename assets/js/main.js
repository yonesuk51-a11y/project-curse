
const DATA = window.UAC_DATA;
const PASS = 'Curse';
const boot = document.getElementById('boot');
const auth = document.getElementById('auth');
const app = document.getElementById('app');
const main = document.getElementById('main');
const tabs = document.querySelectorAll('[data-page]');
const soundBtn = document.getElementById('soundBtn');
const bootAudio = new Audio('assets/audio/uac_boot_relay_loop.mp3'); bootAudio.loop = true; bootAudio.volume = .14;
const slideAudio = new Audio('assets/audio/analog_slide_projector.mp3'); slideAudio.volume = .50;
let sound = false;
function playSlide(){ if(!sound) return; slideAudio.pause(); slideAudio.currentTime=0; slideAudio.play().catch(()=>{}); }
function stopBoot(){ bootAudio.pause(); bootAudio.currentTime=0; }
soundBtn.onclick=()=>{ sound=!sound; soundBtn.textContent=sound?'AUDIO OUTPUT: EVENT SIGNAL ONLY':'AUDIO OUTPUT: DISABLED'; if(sound){ if(!boot.classList.contains('hidden')) bootAudio.play().catch(()=>{}); } else { stopBoot(); }};
function runBoot(){
  const lines = [
    'UAC-NODE-07 // boot sequence initialized',
    'ARCHIVE BUS: damaged record index detected',
    'MAGNETIC MEMORY: [RETRY] / [RECOVERED]',
    'ZONE MAP: green-white-yellow-red-black layers restored',
    'REDZONE FLAGS: china / russia / north america confirmed',
    'CONTAINMENT WALL DATA: partial recovery complete',
    'BLACK FILE VAULT: locked / proceed logging enabled',
    'RELATED FILE GRAPH: rebuilt from damaged index',
    'AUDIO POLICY: ambient loop disabled / event signal only',
    'AUTH GATE: waiting for password input'
  ];
  const log=document.getElementById('bootLog'), bar=document.getElementById('bootBar'), pct=document.getElementById('bootPct');
  let i=0,p=0;
  const t=setInterval(()=>{
    if(i<lines.length){ log.innerHTML += '<div>&gt; '+lines[i++]+'</div>'; log.scrollTop=log.scrollHeight; }
    p += Math.floor(Math.random()*7)+5; if(p>100)p=100; bar.style.width=p+'%'; pct.textContent=String(p).padStart(3,'0')+'%';
    if(p>=100){ clearInterval(t); setTimeout(()=>{ boot.classList.add('hidden'); stopBoot(); auth.classList.add('show'); },650); }
  },300);
}
window.addEventListener('load',()=>{ setTimeout(runBoot,250); });

document.getElementById('submitPass').onclick=checkPass;
document.getElementById('password').addEventListener('keydown',e=>{ if(e.key==='Enter') checkPass(); });
function flashAuth(text){
 const f=document.getElementById('authFlash'); if(!f) return;
 f.textContent=text; f.classList.remove('show'); void f.offsetWidth; f.classList.add('show');
}
function checkPass(){
 const v=document.getElementById('password').value;
 const msg=document.getElementById('authMsg');
 auth.classList.remove('auth-granted','auth-denied');
 if(v===PASS){
   auth.classList.add('auth-granted');
   msg.innerHTML='PASSWORD ACCEPTED // CLEARANCE LEVEL: U.A.C INTERNAL // SESSION TYPE: READ ONLY // ARCHIVE ACCESS: GRANTED';
   msg.style.color='#ff756c';
   sessionStorage.setItem('uac_auth','1');
   flashAuth('ACCESS GRANTED // ARCHIVE ACCESS OPEN');
   playSlide();
   setTimeout(()=>{auth.classList.remove('show'); app.classList.remove('hide'); render('start'); tabs.forEach(x=>x.classList.toggle('active',x.dataset.page==='start'));},880);
 }
 else {
   auth.classList.add('auth-denied');
   msg.innerHTML='ACCESS DENIED // PASSWORD MISMATCH // ATTEMPT LOGGED';
   msg.style.color='#ff514b';
   flashAuth('ACCESS DENIED // ATTEMPT LOGGED');
   setTimeout(()=>auth.classList.remove('auth-denied'),420);
 }
}
if(sessionStorage.getItem('uac_auth')==='1'){ boot.classList.add('hidden'); auth.classList.remove('show'); app.classList.remove('hide'); setTimeout(()=>{render('start'); tabs.forEach(x=>x.classList.toggle('active',x.dataset.page==='start'));},0); }

tabs.forEach(b=>b.addEventListener('click',()=>{ tabs.forEach(x=>x.classList.remove('active')); b.classList.add('active'); render(b.dataset.page); }));
function head(title,sub){ return `<div class="page-head"><div><h1>${title}</h1><div class="sub">${sub}</div></div><div class="sub">U.A.C SERVER // 2026</div></div>`; }
function panel(label,body){ return `<section class="panel" data-label="${label||''}">${body}</section>`; }
function tag(t,cls=''){ return `<span class="tag ${cls}">${t}</span>`; }
function render(page){ if(page!=='serverlog' && typeof logTimer!=='undefined' && logTimer){clearInterval(logTimer); logTimer=null;} main.scrollTop=0; ({start,overview,zones,relations,map:zoneMap,records,search:searchRecords,entities,images:imageIndex,factions,research,manuals,blackfiles,glossary,serverlog,chain:caseChain}[page]||overview)(); }
function overview(){
 main.innerHTML=head('ARCHIVE FLOOR','COMPRESSED DATABASE / FIELD TERMINAL VIEW')+`
 <div class="quick-start-line">
  <button onclick="render('start')">START HERE</button>
  <button onclick="render('search')">SEARCH / TAGS</button>
  <button onclick="render('chain')">CASE CHAIN</button>
  <button onclick="render('glossary')">GLOSSARY</button>
 </div>
 <div class="grid two">
 ${panel('SERVER SUMMARY',`<h3>U.A.C Secure Archive</h3><p>Project Curse 관련 세력, 레드존, 블랙존, 괴이, 회수 기록을 긴 원문 대신 현장 서버용 압축 데이터로 우선 열람한다.</p><p>${tag('CLASSIFIED','red')}${tag('FIELD OPS')}${tag('2026 NODE','amber')}${tag('NO AMBIENT AUDIO')}</p>`)}
 ${panel('CURRENT MAP ALERT',`<h3>Global Red Zone Status</h3><p><b class="danger">중국, 러시아, 북미 일부</b>가 레드존 오버레이로 표시된다. Black Core 좌표는 관측 실패율이 높아 완전 공개되지 않는다.</p><div class="stat-grid">${DATA.mapStats.slice(3,9).map(s=>`<div class="statbox"><b>${s[1]}</b><span>${s[0]}</span></div>`).join('')}</div>`)}
 </div>
 <div class="grid three" style="margin-top:16px">
 ${panel('ZONE SYSTEM',`<h3>Zone Classification</h3><p>Green, White, Yellow, Red, Black을 기본으로 Gray Zone, Blue Node, Crimson Core, Black Core를 보조 레이어로 사용한다.</p>`)}
 ${panel('DATABASE STRUCTURE',`<h3>Recommended Sort</h3><p>WORLD STATUS → FACTION DATABASE → RELATION MATRIX → GLOBAL MAP → ENTITY INDEX → ARCHIVE RECORDS → FIELD MANUALS 순서로 압축 정리.</p>`)}
 ${panel('AUDIO POLICY',`<h3>Sound Design</h3><p>지속적인 지직 배경음은 제거했다. 남는 소리는 짧은 부트음과 문서 클릭/페이지 넘김 효과음뿐이다.</p>`)}
 </div>
 ${panel('CATEGORY INDEX',`<div class="category-list">${DATA.recordCategories.map(c=>`<div class="category-row"><b>${c[0]}</b><p>${c[1]}</p><code>${c[2]}</code></div>`).join('')}</div>`)}
 `;
}

function start(){ main.innerHTML=head('START HERE','입문용 서버 안내 / 추천 열람 순서')+`
 <div class="grid two">
 ${panel('WHAT THIS SERVER IS',`<h3>Project Curse 입문 노드</h3><p>이 서버는 Project Curse 세계관을 처음 보는 사람이 <b>세계 현황 → 구역 체계 → 세력 → 괴이 → 기록물</b> 순서로 이해할 수 있게 압축한 U.A.C 정보 서버다.</p><p>${tag('READ FIRST','red')}${tag('NO AMBIENT AUDIO')}${tag('2026 NODE','amber')}</p>`)}
 ${panel('FIRST FILES',`<h3>먼저 열람할 기록</h3><p>처음에는 <b>Timeline_860101</b>, <b>Zone_870815</b>, <b>Faction_860403</b>, <b>Ferals_860722</b>, <b>NHC Manual_891219</b> 순서를 추천한다.</p><p>사건 기록과 Black Files는 기본 구조를 본 뒤 열람하는 편이 이해하기 쉽다.</p>`)}
 </div>
 <div class="grid three" style="margin-top:16px">${DATA.startHere.map(x=>`<div class="card" data-label="START"><div class="card-role">${x[0]}</div><div class="card-title">${x[1]}</div><p>${x[2]}</p></div>`).join('')}</div>
 ${panel('RECOMMENDED ACCESS ORDER',`<div class="access-order">${DATA.recommendedOrder.map(o=>`<div class="order-row"><b>${o[0]}</b><button onclick="render('${o[3]}')">${o[1]}</button><p>${o[2]}</p></div>`).join('')}</div>`)}
 <div class="grid two" style="margin-top:16px">
 ${panel('CLEARANCE LEVELS',`<div class="mini-table">${DATA.clearanceLevels.map(l=>`<div><b>${l[0]}</b><span>${l[1]}</span><p>${l[2]}</p></div>`).join('')}</div>`)}
 ${panel('INCIDENT CLASSES',`<div class="mini-table">${DATA.incidentClasses.map(c=>`<div><b>${c[0]}</b><span>${c[1]}</span><p>${c[2]}</p></div>`).join('')}</div>`)}
 </div>
 ${panel('CIVILIAN / INFORMATION CONTROL',`<div class="grid two">${DATA.civilianSystems.map(c=>`<div class="micro-card"><b>${c[0]}</b><p>${c[1]}</p></div>`).join('')}</div>`)}
 `; }

function searchRecords(){ main.innerHTML=head('SEARCH / TAGS','기록물 검색 / 태그 필터')+`
 ${panel('SEARCH NODE',`<div class="searchbar"><input id="fileSearch" placeholder="Search code, origin, tag, summary..." autocomplete="off"><button id="clearSearch">CLEAR</button></div><div class="tagcloud"><button class="tag-filter active" data-tag="">ALL</button>${DATA.allTags.map(t=>`<button class="tag-filter" data-tag="${t.replace(/"/g,'&quot;')}">${t}</button>`).join('')}</div>`)}
 <div id="searchResults" class="grid three" style="margin-top:16px"></div>`;
 window.activeTag='';
 const input=document.getElementById('fileSearch');
 const clear=document.getElementById('clearSearch');
 input.oninput=()=>renderSearchResults();
 clear.onclick=()=>{input.value=''; window.activeTag=''; document.querySelectorAll('.tag-filter').forEach(b=>b.classList.toggle('active',!b.dataset.tag)); renderSearchResults();};
 document.querySelectorAll('.tag-filter').forEach(btn=>btn.onclick=()=>{window.activeTag=btn.dataset.tag||''; document.querySelectorAll('.tag-filter').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); renderSearchResults();});
 renderSearchResults();
}
function renderSearchResults(){ const q=(document.getElementById('fileSearch')?.value||'').toLowerCase().trim(); const tg=window.activeTag||''; const list=DATA.records.filter(r=>{ const blob=[r.code,r.origin,r.cat,r.risk,r.status,r.access,r.summary,(r.tags||[]).join(' '),r.extended||''].join(' ').toLowerCase(); const okq=!q||blob.includes(q); const okt=!tg||[r.cat,r.risk,r.status,r.access,...(r.tags||[])].includes(tg); return okq&&okt; }); const box=document.getElementById('searchResults'); if(box) box.innerHTML=list.length?list.map((r)=>recordCard(r, DATA.records.indexOf(r))).join(''):`<div class="panel" data-label="NO MATCH"><h3>NO RECORD FOUND</h3><p>검색어 또는 태그를 줄여서 다시 확인.</p></div>`; }

function glossary(){ main.innerHTML=head('GLOSSARY','U.A.C 서버 용어집')+`
 <div class="glossary-grid">${DATA.glossary.map(g=>`<div class="glossary-item"><b>${g[0]}</b><p>${g[1]}</p></div>`).join('')}</div>`; }

function serverlog(){ main.innerHTML=head('SERVER LOG','복구 / 검열 / 접근 로그')+`
 ${panel('LIVE LOG SNAPSHOT',`<div id="liveLogTable" class="log-table">${DATA.serverLogs.map(l=>`<div class="log-row"><span>${l[0]}</span><b>${l[1]}</b><p>${l[2]}</p></div>`).join('')}</div><p class="soft-note">로그는 서버 화면 안에서만 천천히 갱신된다. 지속 배경음은 없고, 이벤트 효과음만 선택적으로 사용된다.</p>`)}
 `; startLogFeed(); }


let logTimer=null;
function startLogFeed(){
 if(logTimer) clearInterval(logTimer);
 const lines=[
  ['2026-06-21 02:17:04','ARCHIVE','index loaded / no ambient audio'],
  ['2026-06-21 02:17:08','ZONE MAP','red layer checked / signal loss areas stable'],
  ['2026-06-21 02:17:12','BLACK FILE','vault remains sealed / proceed logging enabled'],
  ['2026-06-21 02:17:16','RELATED','file graph recovered from damaged index'],
  ['2026-06-21 02:17:20','AUDIO','event signal only / hover muted']
 ];
 let n=0;
 logTimer=setInterval(()=>{
  const box=document.getElementById('liveLogTable');
  if(!box){clearInterval(logTimer); logTimer=null; return;}
  const l=lines[n++%lines.length];
  const div=document.createElement('div');
  div.className='log-row live-log-add';
  div.innerHTML=`<span>${l[0]}</span><b>${l[1]}</b><p>${l[2]}</p>`;
  box.insertBefore(div, box.firstChild);
  while(box.children.length>12) box.removeChild(box.lastChild);
 },2600);
}

function caseChain(){ main.innerHTML=head('CASE CHAIN','사건 원인-결과 연결도')+`
 <div class="chain-wrap">${DATA.caseChain.map((c,i)=>`<div class="chain-node"><div class="chain-index">${String(i+1).padStart(2,'0')}</div><div><h3>${c[0]}</h3><button onclick="openRecordByCode('${c[1].replace(/'/g,"\\'")}')">OPEN ${c[1]}</button><p>${c[2]}</p></div></div>`).join('')}</div>`; }

function zones(){ main.innerHTML=head('ZONE SYSTEM','Green / White / Yellow / Red / Black + optional layers')+`<div class="zone-grid">`+DATA.zones.map(z=>`<div class="panel zone-card ${z[4]}" data-label="ZONE"><div class="zone-name">${z[0]}</div><div class="zone-class"><span class="zone-pill ${z[4]}">${z[3]}</span> ${z[1]}</div><p>${z[2]}</p></div>`).join('')+`</div>`; }
function factions(){ main.innerHTML=head('FACTION DATABASE','세력 / 역할 / 작전 권한 압축표')+`<div class="grid three">`+DATA.factions.map(f=>`<div class="card" data-label="FACTION"><div class="card-title">${f.id}</div><div class="card-role">${f.type}</div><p>${f.role}</p></div>`).join('')+`</div>`; }
function relations(){ main.innerHTML=head('FACTION RELATIONS','세력간 협력 / 감시 / 적대 관계')+panel('RELATION MATRIX',`<table class="matrix"><thead><tr><th>FROM</th><th>TO</th><th>STATUS</th><th>NOTE</th></tr></thead><tbody>${DATA.relations.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><span class="status-chip ${r[2].includes('위협')||r[2].includes('이탈')||r[2].includes('적대')?'red':r[2].includes('기밀')||r[2].includes('감시')?'amber':'cyan'}">${r[2]}</span></td><td>${r[3]}</td></tr>`).join('')}</tbody></table>`)+`<div class="grid two" style="margin-top:16px">${panel('LEGEND',`<p>${tag('ALLIED / COOPERATION','cyan')} 작전 협력 또는 자료 공유.</p><p>${tag('RESTRICTED TRUST','amber')} 협력하지만 감시 또는 검열 충돌이 있음.</p><p>${tag('HOSTILE / DEFECTOR','red')} 적대, 이탈, 추적, 회수 위험.</p>`)}${panel('RELATION NOTE',`<p>관계도는 세력 서열표가 아니라 <b>작전 현장에서 실제 충돌하는 권한</b>을 기준으로 정리한다.</p>`)}</div>`; }
function zoneMap(){ main.innerHTML=head('GLOBAL ZONE MAP','World overlay / Red Zone sectors / incident and facility layers')+`<div class="grid two"><div class="panel mapbox" data-label="WORLD SCAN">${worldMapSvg()}</div>${panel('GLOBAL STATUS',`<div class="stat-grid">${DATA.mapStats.map(s=>`<div class="statbox"><b>${s[1]}</b><span>${s[0]}</span></div>`).join('')}</div><hr style="border-color:rgba(255,255,255,.08);margin:16px 0"><h3>분류 요약</h3><p>${tag('GREEN','cyan')} 안정 민간권역 ${tag('WHITE')} 정화/통제권역 ${tag('YELLOW','amber')} 감시권역 ${tag('RED','red')} 활성 재난권역 ${tag('BLACK','red')} 회수 금지권역</p>` )}</div>
 <div class="grid two" style="margin-top:16px">
 ${panel('MAP LAYERS',`<div class="layer-list">${DATA.mapLayers.map(l=>`<div class="layer-item"><b>${l[0]}</b><p>${l[1]}</p></div>`).join('')}</div>`)}
 ${panel('INCIDENT MARKERS',`<div class="incident-list">${DATA.incidents.map(i=>`<div class="incident-row"><b>${i[0]}</b><span>${i[1]} // ${i[2]}</span><p>${i[3]}</p></div>`).join('')}</div><div class="map-marker-actions">${DATA.incidents.map(i=>`<button class="incident-open" onclick="openIncidentFiles('${i[0].replace(/'/g,"\\'")}')"><b>${i[0]}</b><span>OPEN RELATED FILES</span></button>`).join('')}</div>`)}
 </div>
 ${panel('FACILITY NODES',`<div class="facility-list">${DATA.facilities.map(f=>`<div class="facility-row"><b>${f[0]}</b><span>${f[1]}</span><p>${f[2]}</p></div>`).join('')}</div>`)}
 `; }
function worldMapSvg(){ return `<svg class="worldsvg" viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid meet"><defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0 L0 0 0 30" fill="none" stroke="#24211e" stroke-width="1"/></pattern><pattern id="noiseh" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 5H10" stroke="#6c5e57" stroke-width="1" opacity=".35"/><path d="M5 0V10" stroke="#6c5e57" stroke-width=".7" opacity=".22"/></pattern></defs><rect width="1000" height="580" fill="url(#grid)" opacity=".85"/>
<text class="maplabel" x="32" y="42">U.A.C TERRITORY SCAN // 2026 // FICTIONAL WORLD STATUS</text>
<path class="greenzone" d="M65,185 C110,105 205,92 270,135 C330,176 334,256 270,303 C215,344 118,326 80,270 C58,238 48,215 65,185Z"/><path class="redzone2" d="M118,170 C185,126 262,150 285,202 C310,260 252,296 186,286 C127,279 88,225 118,170Z"/><path class="yellowzone" d="M92,145 C170,78 290,105 327,184 C367,268 288,342 184,334 C91,326 38,235 92,145Z"/><text class="maplabel" x="122" y="247" fill="#ff6b5b">NORTH AMERICA // FRAGMENTED RED</text>
<path class="whitezone" d="M430,230 C488,185 575,200 624,252 C678,310 620,365 550,358 C484,351 408,291 430,230Z"/><text class="maplabel" x="497" y="286">EUROPE / AFRICA // WHITE-GREEN MONITOR</text>
<path class="redzone2" d="M585,118 C705,58 856,98 923,188 C973,272 927,377 806,386 C696,395 598,328 570,244 C552,190 555,144 585,118Z"/><path class="blackzone" d="M690,142 C770,110 858,139 894,198 C925,252 890,313 814,324 C735,336 669,290 651,226 C641,186 654,158 690,142Z"/><path class="yellowzone" d="M555,98 C700,35 890,75 962,178 C1030,275 960,420 802,421 C655,422 532,326 514,222 C506,168 522,126 555,98Z"/><text class="maplabel" x="680" y="238" fill="#ff6b5b">RUSSIA / CHINA // RED-BLACK BELT</text>
<path class="greenzone" d="M270,325 C337,292 391,331 382,407 C372,487 302,513 243,471 C200,433 219,362 270,325Z"/><text class="maplabel" x="270" y="410">SOUTH AMERICA // GREEN/GRAY</text>
<path class="grayzone" d="M520,360 C595,350 670,390 688,458 C706,528 612,552 548,516 C496,487 472,400 520,360Z"/><text class="maplabel" x="545" y="455">AFRICA / INLAND GRAY</text>
<path class="loss" fill="url(#noiseh)" d="M742,160 C800,135 868,160 888,220 C900,270 860,302 805,300 C756,298 714,260 711,214 C709,188 721,170 742,160Z"/><circle class="core" cx="740" cy="246" r="7"/><circle class="blackcore-dot" cx="812" cy="218" r="8"/><circle class="core" cx="205" cy="225" r="6"/><circle class="node" cx="510" cy="285" r="5"/><circle class="node" cx="735" cy="245" r="5"/><circle class="node" cx="280" cy="405" r="4"/><circle class="node" cx="602" cy="440" r="4"/>
<path class="route" d="M205 225 C370 185, 515 225, 735 245"/><path class="route" d="M510 285 C610 330, 705 385, 780 450"/><path class="wallline" d="M90 325 C210 385, 315 330, 342 242"/><path class="wallline" d="M545 95 C640 55, 805 60, 930 150"/><text class="maplabel" x="35" y="505">LEGEND: GREEN CIVIL / WHITE CONTROL / YELLOW BORDER / RED HOSTILE / BLACK NO RECOVERY / GRAY FRAGMENTED</text><text class="map-note" x="35" y="530">MARKERS: BLOOD LAKE / BLACK WALL COLLAPSE / U.A.C NODE / A.R.F ROUTE / SIGNAL LOSS</text></svg>`; }
function recordCard(r,i){ const rot=[-1.5,.8,-.4,1.4,-.9,.6,-1.2,1.1,0][i%9]; const severe=r.status==='CORRUPTED'||r.status==='SEALED'||r.access.includes('BLACK')||r.access.includes('OMEGA'); return `<div class="card record-card status-${r.status} ${severe?'access-black':''}" style="--r:${rot}deg" data-label="FILE" onclick="openRecord(${i})"><div class="record-code">${r.code}</div><div class="record-origin">ORIGIN: ${r.origin}</div><div class="record-meta">${tag(r.cat)}${tag(r.risk,severe?'red':r.risk.includes('SECRET')?'amber':'')}${tag(r.status,severe?'red':r.status==='PARTIAL'||r.status==='REDACTED'?'amber':'cyan')}</div><div class="meta-grid"><div class="meta-cell"><span class="meta-k">ACCESS</span><span class="meta-v">${r.access}</span></div><div class="meta-cell"><span class="meta-k">DAMAGE</span><span class="meta-v">${r.damage}%</span></div><div class="meta-cell"><span class="meta-k">PAGES</span><span class="meta-v">${String(r.pages.length).padStart(2,'0')}</span></div></div><div class="damagebar"><span style="width:${r.damage}%"></span></div><p>${r.summary}</p></div>`; }
function records(){ main.innerHTML=head('ARCHIVE RECORDS','코드형 문서 보관소 / status-access-damage labels')+`<div class="grid three">`+DATA.records.map((r,i)=>recordCard(r,i)).join('')+`</div>`; }
function entities(){ main.innerHTML=head('ENTITY INDEX','Feral / Superior-Type / Queen-Type / Returned Civilian')+`<div class="grid two">`+DATA.entities.map(e=>`<div class="card" data-label="ENTITY"><div class="card-title">${e[0]}</div><p>${e[1]}</p></div>`).join('')+`</div>`; }
function research(){ main.innerHTML=head('WEAPON / RESEARCH FILES','혈무 / Wave Frame / Wivermensi / genetic and bio-weapon files')+`<div class="grid three">`+DATA.researchFiles.map(f=>`<div class="card research-card" data-label="RESEARCH"><div class="card-title">${f[0]}</div><div class="card-role">${f[1]}</div><p>${f[2]}</p></div>`).join('')+`</div>`; }
function manuals(){ main.innerHTML=head('FIELD MANUALS','N.H.C / C.P.D / A.R.F / Ash Crew operational protocol')+`<div class="grid two">`+DATA.fieldManuals.map(m=>`<div class="card manual-card" data-label="MANUAL"><div class="card-title">${m[0]}</div><p>${m[1]}</p></div>`).join('')+`</div>`; }
function blackfiles(){ main.innerHTML=head('BLACK FILES','열람 제한 / 손상도 높은 기록')+`<div class="grid two">`+DATA.blackFiles.map(b=>`<div class="card blackfile" data-label="BLACK FILE"><div class="card-title">${b[0]}</div><div class="card-role">${b[1]}</div><p>${b[2]}</p></div>`).join('')+`</div>`; }
function imageIndex(){ main.innerHTML=head('RECOVERED FRAMES','이미지 첨부 / Audio Log 제거됨')+panel('FRAME CATEGORIES',`<div class="frame-cat-grid">${DATA.frameCategories.map(c=>`<div class="frame-cat"><b>${c[0]}</b><p>${c[1]}</p></div>`).join('')}</div><p>원본 Audio Log MP3와 지속 배경음은 제거했다. 이미지 자료만 WebP 압축본으로 보관된다.</p><div class="image-grid">${DATA.images.slice(0,83).map((src,i)=>`<img src="${src}" loading="lazy" title="FRAME_${String(i+1).padStart(3,'0')}">`).join('')}</div>`); }

const INCIDENT_LINKS = {
  'BLOOD LAKE':['Unknown Record2_860205','Immortality_860201','FCR Archive_890402'],
  'BLACK WALL COLLAPSE':['Timeline_860101','Zone_870815','Redzone_881120'],
  'SAKUMA INCIDENT':['Sakuma Tape_991028','Redzone_881120','FCR Archive_890402'],
  'AMARION RECOVERY':['Unknown Record1_860204','Unknown Record5_940626','Cults_871104'],
  'REDWOLF DEFECTION':['Unknown Record3_920711','Faction_860403','NHC Manual_891219']
};
function openIncidentFiles(name){
 const codes=INCIDENT_LINKS[name]||[];
 main.innerHTML=head(name,'INCIDENT MARKER // RELATED FILES')+panel('MAP MARKER LINK',`<h3>${name}</h3><p>지도 사건 마커에서 연결된 관련 기록이다. 기록물은 손상도와 권한 등급에 따라 Black File 경고를 먼저 표시할 수 있다.</p><div class="related-list">${codes.map(code=>{const r=getRecordByCode(code);return `<button onclick="openRecordByCode('${code.replace(/'/g,"\\'")}')"><b>${code}</b><span>${r?r.origin:''}</span></button>`}).join('')}</div>`);
}
window.openIncidentFiles=openIncidentFiles;
let pendingRecordIndex=null;
function isBlackRecord(r){return r && (r.status==='CORRUPTED'||r.status==='SEALED'||r.access.includes('BLACK')||r.access.includes('OMEGA')||r.access.includes('COMMAND ONLY'));}
function showMountThen(cb){
 const m=document.getElementById('mountOverlay');
 if(!m){ cb(); return; }
 m.classList.add('show');
 setTimeout(()=>{m.classList.remove('show'); cb();},620);
}
function showBlackGate(i){
 pendingRecordIndex=i;
 const r=DATA.records[i];
 const gate=document.getElementById('blackGate');
 const code=document.getElementById('blackGateCode');
 if(code) code.textContent='TARGET: '+r.code+' // '+r.access+' // DAMAGE '+r.damage+'%';
 if(gate) gate.classList.add('show');
}
function continueOpenRecord(i){
 currentRecord=DATA.records[i]; currentPage=0; playSlide();
 showMountThen(()=>{document.getElementById('viewer').classList.add('show'); renderSlide();});
}

let currentRecord=null,currentPage=0;
function openRecord(i){ const r=DATA.records[i]; if(isBlackRecord(r)){ showBlackGate(i); return; } continueOpenRecord(i); }
window.openRecord=openRecord;
function getRecordByCode(code){ return DATA.records.find(x=>x.code===code); }
function openRecordByCode(code){ const idx=DATA.records.findIndex(x=>x.code===code); if(idx>=0) openRecord(idx); }
window.openRecordByCode=openRecordByCode;
function relatedBlock(r){ if(!r.related||!r.related.length) return ''; return `<div class="related-block"><h3>RELATED FILES</h3><div class="related-list">${r.related.map(code=>{const rr=getRecordByCode(code); return `<button onclick="openRecordByCode('${code.replace(/'/g,"\\'")}')"><b>${code}</b><span>${rr?rr.origin:''}</span></button>`}).join('')}</div></div>`; }
function extendedBlock(r){ return `<details class="extended-record"><summary>OPEN EXTENDED RECORD</summary><p>${(r.extended||'No extended recovery text.').replace(/\n/g,'<br>')}</p></details>`; }

const blackProceedBtn=document.getElementById('blackProceed');
const blackCancelBtn=document.getElementById('blackCancel');
if(blackProceedBtn) blackProceedBtn.onclick=()=>{document.getElementById('blackGate').classList.remove('show'); if(pendingRecordIndex!==null) continueOpenRecord(pendingRecordIndex);};
if(blackCancelBtn) blackCancelBtn.onclick=()=>{document.getElementById('blackGate').classList.remove('show'); pendingRecordIndex=null;};

function renderSlide(){ const r=currentRecord,p=r.pages[currentPage]; const severe=r.status==='CORRUPTED'||r.status==='SEALED'||r.access.includes('BLACK')||r.access.includes('OMEGA'); document.getElementById('viewerCode').textContent=r.code; document.getElementById('viewerOrigin').textContent='ORIGIN: '+r.origin+' // '+r.cat; document.getElementById('slideArea').innerHTML=`<div class="viewer-metadata"><div class="meta-cell"><span class="meta-k">STATUS</span><span class="meta-v">${r.status}</span></div><div class="meta-cell"><span class="meta-k">ACCESS</span><span class="meta-v">${r.access}</span></div><div class="meta-cell"><span class="meta-k">DAMAGE</span><span class="meta-v">${r.damage}%</span></div><div class="meta-cell"><span class="meta-k">RISK</span><span class="meta-v">${r.risk}</span></div></div><div class="slide active"><h2>${p[0]}</h2><p>${p[1]}</p><div class="viewer-tags">${tag(r.risk,severe?'red':'')}${tag('PAGE '+String(currentPage+1).padStart(2,'0'))}${(r.tags||[]).map(t=>tag(t)).join('')}</div>${currentPage===r.pages.length-1?relatedBlock(r)+extendedBlock(r):''}</div>`; document.getElementById('pageCount').textContent=`PAGE ${String(currentPage+1).padStart(2,'0')} / ${String(r.pages.length).padStart(2,'0')}`; }
function turn(delta){ if(!currentRecord) return; const next=currentPage+delta; if(next<0||next>=currentRecord.pages.length) return; currentPage=next; const v=document.getElementById('viewer'); v.classList.add('turning'); playSlide(); setTimeout(()=>{renderSlide(); v.classList.remove('turning');},160); }
document.getElementById('nextPage').onclick=()=>turn(1); document.getElementById('prevPage').onclick=()=>turn(-1); document.getElementById('closeViewer').onclick=()=>{document.getElementById('viewer').classList.remove('show');};
document.addEventListener('keydown',e=>{ if(document.getElementById('viewer').classList.contains('show')){ if(e.key==='ArrowRight'||e.key.toLowerCase()==='d') turn(1); if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a') turn(-1); if(e.key==='Escape') document.getElementById('viewer').classList.remove('show'); }});


/* === GITHUB READY FINAL: visual integration + document readability === */
const UAC_VISUALS = {
  auth:'assets/visuals/uac_auth_gate.webp',
  map:'assets/visuals/global_redzone_map.webp',
  relations:'assets/visuals/faction_relation_matrix.webp',
  archive:'assets/visuals/recovered_archives_floor.webp'
};
function visualPanel(label,src,caption){
 return panel(label,`<div class="visual-panel"><img class="visual-img" src="${src}" loading="lazy" alt="${label}"><div class="visual-caption"><b>${label}</b><span>${caption}</span></div></div>`);
}
function overview(){
 main.innerHTML=head('ARCHIVE FLOOR','COMPRESSED DATABASE / FIELD TERMINAL VIEW')+`
 <div class="quick-start-line">
  <button onclick="render('start')">START HERE</button>
  <button onclick="render('map')">GLOBAL MAP</button>
  <button onclick="render('relations')">RELATION MATRIX</button>
  <button onclick="render('records')">ARCHIVE RECORDS</button>
  <button onclick="render('search')">SEARCH / TAGS</button>
 </div>
 ${visualPanel('RECOVERED ARCHIVES VISUAL',UAC_VISUALS.archive,'문서 카드, 상태 라벨, 손상도, 관련 파일 구조를 한 화면에 보여주는 Archive Floor 기준 이미지.')}
 <div class="grid two" style="margin-top:16px">
 ${panel('SERVER SUMMARY',`<h3>U.A.C Secure Archive</h3><p>Project Curse 관련 세력, 레드존, 블랙존, 괴이, 회수 기록을 긴 원문 대신 현장 서버용 압축 데이터로 우선 열람한다. 원문은 각 문서의 <b>OPEN EXTENDED RECORD</b>에서 접기/펼치기 방식으로 확인한다.</p><p>${tag('CLASSIFIED','red')}${tag('FIELD OPS')}${tag('2026 NODE','amber')}${tag('NO AMBIENT AUDIO')}</p>`)}
 ${panel('CURRENT MAP ALERT',`<h3>Global Red Zone Status</h3><p><b class="danger">중국, 러시아, 북미 일부</b>가 레드존 오버레이로 표시된다. Black Core 좌표는 관측 실패율이 높아 완전 공개되지 않는다.</p><div class="stat-grid">${DATA.mapStats.slice(3,9).map(s=>`<div class="statbox"><b>${s[1]}</b><span>${s[0]}</span></div>`).join('')}</div>`)}
 </div>
 <div class="grid three" style="margin-top:16px">
 ${panel('READABILITY PASS',`<h3>Document Styling</h3><p>본문은 회백색, 경고와 Black File만 어두운 붉은색으로 제한했다. 초록 CRT 느낌은 제외하고 U.A.C 기밀 서버의 검정/회색/붉은 기록물 톤으로 통일했다.</p>`)}
 ${panel('IMAGE POLICY',`<h3>Recovered Frame Format</h3><p>이미지는 회수 프레임처럼 보이도록 어둡게 보정하고, 과도한 밝기와 채도를 줄였다. 각 이미지에는 SOURCE / STATUS / DAMAGE 캡션을 붙인다.</p>`)}
 ${panel('AUDIO POLICY',`<h3>Event Signal Only</h3><p>지속적인 지직 배경음과 hover 사운드는 제거했다. 남는 소리는 짧은 부트음과 문서 클릭/페이지 넘김 효과음뿐이다.</p>`)}
 </div>
 ${panel('CATEGORY INDEX',`<div class="category-list">${DATA.recordCategories.map(c=>`<div class="category-row"><b>${c[0]}</b><p>${c[1]}</p><code>${c[2]}</code></div>`).join('')}</div>`)}
 `;
}
function start(){ main.innerHTML=head('START HERE','입문용 서버 안내 / 추천 열람 순서')+`
 ${visualPanel('AUTHORIZATION VISUAL CACHE',UAC_VISUALS.auth,'메인 접속 화면은 Project Curse 로고가 아니라 U.A.C 정보 서버 인증 게이트로 정리된다.')}
 <div class="grid two" style="margin-top:16px">
 ${panel('WHAT THIS SERVER IS',`<h3>Project Curse 입문 노드</h3><p>이 서버는 Project Curse 세계관을 처음 보는 사람이 <b>세계 현황 → 구역 체계 → 세력 → 괴이 → 기록물</b> 순서로 이해할 수 있게 압축한 U.A.C 정보 서버다.</p><p>${tag('READ FIRST','red')}${tag('NO AMBIENT AUDIO')}${tag('2026 NODE','amber')}</p>`)}
 ${panel('FIRST FILES',`<h3>먼저 열람할 기록</h3><p>처음에는 <b>Timeline_860101</b>, <b>Zone_870815</b>, <b>Faction_860403</b>, <b>Ferals_860722</b>, <b>NHC Manual_891219</b> 순서를 추천한다.</p><p>사건 기록과 Black Files는 기본 구조를 본 뒤 열람하는 편이 이해하기 쉽다.</p>`)}
 </div>
 <div class="grid three" style="margin-top:16px">${DATA.startHere.map(x=>`<div class="card" data-label="START"><div class="card-role">${x[0]}</div><div class="card-title">${x[1]}</div><p>${x[2]}</p></div>`).join('')}</div>
 ${panel('RECOMMENDED ACCESS ORDER',`<div class="access-order">${DATA.recommendedOrder.map(o=>`<div class="order-row"><b>${o[0]}</b><button onclick="render('${o[3]}')">${o[1]}</button><p>${o[2]}</p></div>`).join('')}</div>`)}
 <div class="grid two" style="margin-top:16px">
 ${panel('CLEARANCE LEVELS',`<div class="mini-table">${DATA.clearanceLevels.map(l=>`<div><b>${l[0]}</b><span>${l[1]}</span><p>${l[2]}</p></div>`).join('')}</div>`)}
 ${panel('INCIDENT CLASSES',`<div class="mini-table">${DATA.incidentClasses.map(c=>`<div><b>${c[0]}</b><span>${c[1]}</span><p>${c[2]}</p></div>`).join('')}</div>`)}
 </div>
 ${panel('CIVILIAN / INFORMATION CONTROL',`<div class="grid two">${DATA.civilianSystems.map(c=>`<div class="micro-card"><b>${c[0]}</b><p>${c[1]}</p></div>`).join('')}</div>`)}
 `; }
function relations(){ main.innerHTML=head('FACTION RELATIONS','세력간 협력 / 감시 / 적대 관계')+
 visualPanel('RELATION MATRIX VISUAL',UAC_VISUALS.relations,'세력 간 협력, 감시, 불신, 적대 관계를 한 화면에 압축한 U.A.C 분석 이미지.')+
 panel('RELATION MATRIX DATA',`<table class="matrix"><thead><tr><th>FROM</th><th>TO</th><th>STATUS</th><th>NOTE</th></tr></thead><tbody>${DATA.relations.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><span class="status-chip ${r[2].includes('위협')||r[2].includes('이탈')||r[2].includes('적대')?'red':r[2].includes('기밀')||r[2].includes('감시')?'amber':'cyan'}">${r[2]}</span></td><td>${r[3]}</td></tr>`).join('')}</tbody></table>`)+
 `<div class="grid two" style="margin-top:16px">${panel('LEGEND',`<p>${tag('ALLIED / COOPERATION','cyan')} 작전 협력 또는 자료 공유.</p><p>${tag('RESTRICTED TRUST','amber')} 협력하지만 감시 또는 검열 충돌이 있음.</p><p>${tag('HOSTILE / DEFECTOR','red')} 적대, 이탈, 추적, 회수 위험.</p>`)}${panel('RELATION NOTE',`<p>관계도는 세력 서열표가 아니라 <b>작전 현장에서 실제 충돌하는 권한</b>을 기준으로 정리한다.</p>`)}</div>`; }
function zoneMap(){ main.innerHTML=head('GLOBAL ZONE MAP','World overlay / Red Zone sectors / incident and facility layers')+
 visualPanel('GLOBAL REDZONE MAP VISUAL',UAC_VISUALS.map,'중국, 러시아, 북미 일부 Red Zone / Crimson Core / Black Core와 회수 루트, 봉쇄선을 반영한 세계지도 이미지.')+
 `<div class="grid two" style="margin-top:16px"><div class="panel mapbox" data-label="WORLD SCAN">${worldMapSvg()}</div>${panel('GLOBAL STATUS',`<div class="stat-grid">${DATA.mapStats.map(s=>`<div class="statbox"><b>${s[1]}</b><span>${s[0]}</span></div>`).join('')}</div><hr style="border-color:rgba(255,255,255,.08);margin:16px 0"><h3>분류 요약</h3><p>${tag('GREEN','cyan')} 안정 민간권역 ${tag('WHITE')} 정화/통제권역 ${tag('YELLOW','amber')} 감시권역 ${tag('RED','red')} 활성 재난권역 ${tag('BLACK','red')} 회수 금지권역</p>` )}</div>
 <div class="grid two" style="margin-top:16px">
 ${panel('MAP LAYERS',`<div class="layer-list">${DATA.mapLayers.map(l=>`<div class="layer-item"><b>${l[0]}</b><p>${l[1]}</p></div>`).join('')}</div>`)}
 ${panel('INCIDENT MARKERS',`<div class="incident-list">${DATA.incidents.map(i=>`<div class="incident-row"><b>${i[0]}</b><span>${i[1]} // ${i[2]}</span><p>${i[3]}</p></div>`).join('')}</div><div class="map-marker-actions">${DATA.incidents.map(i=>`<button class="incident-open" onclick="openIncidentFiles('${i[0].replace(/'/g,"\\'")}')"><b>${i[0]}</b><span>OPEN RELATED FILES</span></button>`).join('')}</div>`)}
 </div>
 ${panel('FACILITY NODES',`<div class="facility-list">${DATA.facilities.map(f=>`<div class="facility-row"><b>${f[0]}</b><span>${f[1]}</span><p>${f[2]}</p></div>`).join('')}</div>`)}
 `; }
function records(){ main.innerHTML=head('ARCHIVE RECORDS','코드형 문서 보관소 / status-access-damage labels')+
 visualPanel('ARCHIVE FLOOR VISUAL',UAC_VISUALS.archive,'설정글이 단순 글 목록이 아니라 회수된 기밀 기록물처럼 보이도록 정리한 기준 이미지.')+
 `<div class="grid three" style="margin-top:16px">`+DATA.records.map((r,i)=>recordCard(r,i)).join('')+`</div>`; }
function imageIndex(){ main.innerHTML=head('RECOVERED FRAMES','이미지 첨부 / Audio Log 제거됨')+
 visualPanel('RECOVERED ARCHIVE VISUAL',UAC_VISUALS.archive,'각 이미지는 U.A.C 회수 프레임처럼 어둡게 보정하고 캡션으로 출처와 손상도를 표시한다.')+
 panel('FRAME CATEGORIES',`<div class="frame-cat-grid">${DATA.frameCategories.map(c=>`<div class="frame-cat"><b>${c[0]}</b><p>${c[1]}</p></div>`).join('')}</div><p>원본 Audio Log MP3와 지속 배경음은 제거했다. 이미지 자료만 WebP 압축본으로 보관된다.</p><div class="image-grid">${DATA.images.slice(0,83).map((src,i)=>`<figure><img src="${src}" loading="lazy" title="FRAME_${String(i+1).padStart(3,'0')}"><figcaption>FRAME_${String(i+1).padStart(3,'0')} // SOURCE: RECOVERED ARCHIVE // STATUS: DEGRADED // DAMAGE: ${18+(i*7%61)}%</figcaption></figure>`).join('')}</div>`); }
function recordCard(r,i){ const rot=[-1.5,.8,-.4,1.4,-.9,.6,-1.2,1.1,0][i%9]; const severe=r.status==='CORRUPTED'||r.status==='SEALED'||r.access.includes('BLACK')||r.access.includes('OMEGA'); return `<div class="card record-card status-${r.status} ${severe?'access-black':''}" style="--r:${rot}deg" data-label="FILE" onclick="openRecord(${i})"><div class="record-code">${r.code}</div><div class="record-origin">ORIGIN: ${r.origin}</div><div class="record-meta">${tag(r.cat)}${tag(r.risk,severe?'red':r.risk.includes('SECRET')?'amber':'')}${tag(r.status,severe?'red':r.status==='PARTIAL'||r.status==='REDACTED'?'amber':'cyan')}</div><div class="meta-grid"><div class="meta-cell"><span class="meta-k">ACCESS</span><span class="meta-v">${r.access}</span></div><div class="meta-cell"><span class="meta-k">DAMAGE</span><span class="meta-v">${r.damage}%</span></div><div class="meta-cell"><span class="meta-k">INTEGRITY</span><span class="meta-v">${Math.max(8,100-r.damage)}%</span></div></div><div class="damagebar"><span style="width:${r.damage}%"></span></div><p>${r.summary}</p><div class="viewer-tags">${(r.tags||[]).slice(0,4).map(t=>tag(t)).join('')}</div></div>`; }
function renderSlide(){ const r=currentRecord,p=r.pages[currentPage]; const severe=r.status==='CORRUPTED'||r.status==='SEALED'||r.access.includes('BLACK')||r.access.includes('OMEGA'); document.getElementById('viewerCode').textContent=r.code; document.getElementById('viewerOrigin').textContent='ORIGIN: '+r.origin+' // '+r.cat; document.getElementById('slideArea').innerHTML=`<div class="viewer-metadata"><div class="meta-cell"><span class="meta-k">STATUS</span><span class="meta-v">${r.status}</span></div><div class="meta-cell"><span class="meta-k">ACCESS</span><span class="meta-v">${r.access}</span></div><div class="meta-cell"><span class="meta-k">DAMAGE</span><span class="meta-v">${r.damage}%</span></div><div class="meta-cell"><span class="meta-k">INTEGRITY</span><span class="meta-v">${Math.max(8,100-r.damage)}%</span></div></div><div class="damagebar"><span style="width:${r.damage}%"></span></div><div class="slide active"><h2>${p[0]}</h2><p>${p[1]}</p><div class="viewer-tags">${tag(r.risk,severe?'red':'')}${tag('PAGE '+String(currentPage+1).padStart(2,'0'))}${(r.tags||[]).map(t=>tag(t)).join('')}</div>${currentPage===0?relatedBlock(r):''}${currentPage===r.pages.length-1?extendedBlock(r):''}</div>`; document.getElementById('pageCount').textContent=`PAGE ${String(currentPage+1).padStart(2,'0')} / ${String(r.pages.length).padStart(2,'0')}`; }
