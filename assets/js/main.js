
const DATA = window.UAC_DATA;
const PASS = 'Curse';
const boot = document.getElementById('boot');
const auth = document.getElementById('auth');
const app = document.getElementById('app');
const main = document.getElementById('main');
const nav = document.querySelectorAll('[data-page]');
const soundBtn = document.getElementById('soundBtn');
const bootAudio = new Audio('assets/audio/uac_boot_relay_loop.mp3'); bootAudio.loop = true; bootAudio.volume = .22;
const humAudio = new Audio('assets/audio/uac_server_hum.wav'); humAudio.loop = true; humAudio.volume = .16;
const slideAudio = new Audio('assets/audio/analog_slide_projector.mp3'); slideAudio.volume = .55;
let sound = false;
function playSlide(){ if(!sound) return; slideAudio.currentTime=0; slideAudio.play().catch(()=>{}); }
function startHum(){ if(!sound) return; humAudio.play().catch(()=>{}); }
function stopBoot(){ bootAudio.pause(); bootAudio.currentTime=0; }
soundBtn.onclick=()=>{ sound=!sound; soundBtn.textContent=sound?'SOUND ON':'SOUND OFF'; if(sound){ if(!boot.classList.contains('hidden')) bootAudio.play().catch(()=>{}); else startHum(); } else { stopBoot(); humAudio.pause(); }};
function runBoot(){
  const lines = [
    'U.A.C SECURE INFORMATION SERVER // 2026 NODE INITIALIZATION',
    'ANALOG RELAY BUS: ACTIVE', 'TAPE INPUT BUFFER: CHECKSUM PENDING',
    'RED PHOSPHOR OUTPUT: STABLE', 'ARCHIVE INTEGRITY: VERIFYING',
    'BLACK FILE INDEX: PARTIAL LOCK', 'GLOBAL ZONE MAP: SYNC REQUESTED',
    'CHINA SECTOR: RED ZONE FLAG DETECTED', 'RUSSIA SECTOR: RED ZONE FLAG DETECTED',
    'NORTH AMERICA: PARTIAL RED ZONE FLAG DETECTED', 'AUTHORIZATION GATE: STANDBY'
  ];
  const log = document.getElementById('bootLog'); const bar = document.getElementById('bootBar'); const pct = document.getElementById('bootPct');
  let i=0, p=0;
  const t=setInterval(()=>{ 
    if(i<lines.length){ log.innerHTML += '<div>&gt; '+lines[i++]+'</div>'; log.scrollTop=log.scrollHeight; }
    p += Math.floor(Math.random()*9)+5; if(p>100)p=100; bar.style.width=p+'%'; pct.textContent=String(p).padStart(3,'0')+'%';
    if(p>=100){ clearInterval(t); setTimeout(()=>{ boot.classList.add('hidden'); stopBoot(); auth.classList.add('show'); },700); }
  },330);
}
window.addEventListener('load',()=>{ setTimeout(runBoot,250); });

document.getElementById('submitPass').onclick=checkPass;
document.getElementById('password').addEventListener('keydown',e=>{ if(e.key==='Enter') checkPass(); });
function checkPass(){
 const v=document.getElementById('password').value;
 const msg=document.getElementById('authMsg');
 if(v===PASS){ msg.textContent='ACCESS GRANTED // OPENING U.A.C INFORMATION SERVER'; msg.style.color='#69ff8d'; sessionStorage.setItem('uac_auth','1'); playSlide(); setTimeout(()=>{auth.classList.remove('show'); app.classList.remove('hide'); render('overview'); startHum();},650); }
 else { msg.textContent='ACCESS DENIED // PASSWORD MISMATCH'; msg.style.color='#ff514b'; }
}
if(sessionStorage.getItem('uac_auth')==='1'){ boot.classList.add('hidden'); auth.classList.remove('show'); app.classList.remove('hide'); setTimeout(()=>render('overview'),0); }

nav.forEach(b=>b.addEventListener('click',()=>{ nav.forEach(x=>x.classList.remove('active')); b.classList.add('active'); render(b.dataset.page); }));
function setTitle(crumb,title,sub){ return `<div class="crumb">// U.A.C / ${crumb} /</div><h1 class="page-title">${title}</h1><div class="page-sub">${sub}</div><div class="divider"></div>`; }
function panel(label,body){ return `<section class="panel" data-label="${label||''}">${body}</section>`; }
function render(page){
  main.scrollTop=0;
  if(page==='overview') return overview();
  if(page==='factions') return factions();
  if(page==='roles') return roles();
  if(page==='relations') return relations();
  if(page==='map') return zoneMap();
  if(page==='records') return records();
  if(page==='entities') return entities();
  if(page==='images') return imageIndex();
  if(page==='logs') return logs();
}
function overview(){
 main.innerHTML = setTitle('OVERVIEW','WORLD OVERVIEW','CLASSIFIED RECORD // INTERNAL USE ONLY') + `
 <div class="grid two">
 ${panel('CORP RECORD 0001',`<h3>U.A.C INFORMATION SERVER</h3><p>Project Curse 관련 도시 이상현상, 오염 구역, 괴이 생태계, 회수 기록을 압축 열람하는 2026년형 내부 정보 서버.</p><p><span class="tag">U.A.C</span><span class="tag">SECURE NODE</span><span class="tag red">RESTRICTED</span></p>`)}
 ${panel('ACTIVE STATUS',`<h3>GLOBAL ALERT</h3><p><span class="danger">China / Russia / North America 일부 레드존화</span>가 지도에 표시됨. 블랙존 관측 오류와 Cold File 재활성화 가능성 있음.</p><p><span class="tag red">RED ZONE</span><span class="tag amber">CONTAINMENT BORDER</span><span class="tag cyan">RECOVERY ROUTE</span></p>`)}
 </div>
 <div class="grid two" style="margin-top:16px">
 ${panel('TIMELINE',`<h3>// TIMELINE</h3><div class="timeline"><div class="time-row"><div><div class="year">1986</div><div class="era">ORIGIN</div></div><p>피의 호수 / 불멸 연구 실패. U.A.C 체계의 기원.</p></div><div class="time-row"><div><div class="year">1st RZW</div><div class="era">WAR</div></div><p>First Red Zone War. N.H.C 대규모 투입과 Young Soldier 손실.</p></div><div class="time-row"><div><div class="year">BWC</div><div class="era">COLLAPSE</div></div><p>Black Wall Collapse. 구조 작전 실패와 기록 왜곡 증가.</p></div><div class="time-row"><div><div class="year">2026</div><div class="era">CURRENT</div></div><p>U.A.C 정보 서버가 전역 레드존, 블랙존, 회수 문서를 동기화 중.</p></div></div>`)}
 ${panel('STRUCTURE',`<h3>// CORE STRUCTURE</h3><p><b>U.A.C</b> 통제 / <b>N.H.C</b> 현장 / <b>S.I.D</b> 수사 / <b>A.R.F</b> 회수 / <b>C.P.D</b> 민간보호 / <b>F.H.C</b> 기밀연구.</p><p>위버멘시는 인간형 특수 병기로, 혈무와 Wave Frame을 통해 상위 괴이와 제한 교전한다.</p>`)}
 </div>`;
}
function factions(){
 main.innerHTML=setTitle('FACTIONS','FACTION DATABASE','12 RECORDS // COMPRESSED VIEW') + `<div class="grid two">`+DATA.factions.map(f=>`<div class="card"><div class="card-title">${f.id}</div><div class="card-role">${f.type}</div><p>${f.role}</p></div>`).join('')+`</div>`;
}
function roles(){
 main.innerHTML=setTitle('ROLES','OPERATION ROLES','FIELD FUNCTION SUMMARY') + `<div class="grid two">`+DATA.roles.map(r=>`<div class="card"><div class="card-title">${r[0]}</div><div class="card-role">${r[1]}</div><p>${r[2]}</p></div>`).join('')+`</div>`;
}
function relations(){
 main.innerHTML=setTitle('RELATIONS','FACTION RELATIONS','CONFLICT / TRUST / AUTHORITY MATRIX') + panel('RELATION MATRIX',`<table class="matrix"><thead><tr><th>FROM</th><th>TO</th><th>STATUS</th><th>NOTE</th></tr></thead><tbody>${DATA.relations.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><span class="status-chip ${r[2].includes('위협')||r[2].includes('이탈')?'red':r[2].includes('기밀')||r[2].includes('감시')?'amber':'cyan'}">${r[2]}</span></td><td>${r[3]}</td></tr>`).join('')}</tbody></table>`);
}
function zoneMap(){
 main.innerHTML=setTitle('ZONE MAP','GLOBAL ZONE MAP','WORLD SCAN // RED ZONE OVERLAY') + `<div class="grid two"><div class="panel mapbox" data-label="GLOBAL SCAN">${worldMapSvg()}</div>${panel('ZONE LEGEND',`<h3>// ZONE CLASSIFICATION</h3><p><span class="tag red">RED ZONE</span> 괴이 생태계와 군사 봉쇄가 동시에 발생한 지역.</p><p><span class="tag amber">BLACK ZONE</span> 현실 통제 상실. 관측 데이터 오류.</p><p><span class="tag cyan">CONTAINMENT NODE</span> U.A.C/N.H.C 봉쇄 및 회수 거점.</p><p><b class="danger">중국, 러시아, 북미 일부</b>가 현재 대형 레드존으로 표시된다.</p>` )}</div>`;
}
function worldMapSvg(){ return `<svg class="worldsvg" viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid meet">
 <defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="#064a1b" stroke-width="1"/></pattern></defs><rect width="1000" height="580" fill="url(#grid)" opacity=".7"/>
 <path class="securezone" d="M100,160 C160,90 250,110 285,170 C320,235 260,310 180,300 C100,292 65,220 100,160Z"/><text class="maplabel" x="130" y="210">NORTH AMERICA</text>
 <path class="redzone" d="M120,170 C190,120 260,145 280,200 C300,255 252,290 185,285 C125,280 90,225 120,170Z"/><text class="maplabel" x="125" y="250" fill="#ff6b5b">PARTIAL RED ZONE</text>
 <path class="securezone" d="M280,330 C340,300 390,335 380,410 C365,485 300,510 245,470 C205,430 225,365 280,330Z"/><text class="maplabel" x="278" y="410">SOUTH AMERICA</text>
 <path class="securezone" d="M455,230 C520,185 600,205 640,255 C680,315 625,370 555,360 C485,350 430,290 455,230Z"/><text class="maplabel" x="485" y="290">EUROPE / AFRICA</text>
 <path class="redzone" d="M590,125 C705,70 845,105 910,190 C960,270 930,365 815,380 C705,395 600,330 570,245 C550,190 560,150 590,125Z"/><text class="maplabel" x="690" y="235" fill="#ff6b5b">RUSSIA / CHINA RED ZONE</text>
 <path class="securezone" d="M725,400 C790,380 860,410 875,470 C830,520 750,510 700,465 C680,440 695,412 725,400Z"/><text class="maplabel" x="750" y="455">PACIFIC NODE</text>
 <circle class="node" cx="205" cy="225" r="5"/><circle class="node" cx="735" cy="245" r="5"/><circle class="node" cx="510" cy="285" r="5"/><circle class="node" cx="780" cy="450" r="5"/>
 <path class="route" d="M205 225 C370 185, 515 225, 735 245"/><path class="route" d="M510 285 C610 330, 705 385, 780 450"/>
 <text class="maplabel" x="32" y="42">TERRITORY SCAN ACTIVE // 2026</text><text class="maplabel" x="32" y="540">RED ZONE DATA: PARTIAL // BLACK ZONE DATA: UNSTABLE</text>
 </svg>`; }
function records(){
 main.innerHTML=setTitle('ARCHIVE','ARCHIVE RECORDS','COMPRESSED DOCUMENT INDEX') + `<div class="grid three">`+DATA.records.map((r,i)=>`<div class="card record-card" onclick="openRecord(${i})"><div class="record-code">${r.code}</div><div class="record-origin">ORIGIN: ${r.origin}</div><div class="record-meta"><span class="tag">${r.cat}</span><span class="tag ${r.risk.includes('BLACK')||r.risk.includes('OMEGA')?'red':r.risk.includes('SECRET')?'amber':''}">${r.risk}</span></div><p>${r.summary}</p></div>`).join('')+`</div>`;
}
function entities(){ main.innerHTML=setTitle('ENTITY','ENTITY INDEX','FERAL / SUPERIOR / QUEEN-TYPE') + `<div class="grid two">`+DATA.entities.map(e=>`<div class="card"><div class="card-title">${e[0]}</div><p>${e[1]}</p></div>`).join('')+`</div>`; }
function imageIndex(){ main.innerHTML=setTitle('RECOVERED','IMAGE INDEX','OPTIMIZED VISUAL ATTACHMENTS // AUDIO LOGS REMOVED') + panel('FRAME INDEX',`<p>원본 Audio Log MP3는 제거됨. 이미지는 용량 절감을 위해 WebP로 압축되어 보관됨.</p><div class="image-grid">${DATA.images.slice(0,83).map(src=>`<img src="${src}" loading="lazy">`).join('')}</div>`); }
function logs(){ main.innerHTML=setTitle('LOG','ACCESS LOG','SESSION TRACE // 2026') + panel('AUDIT LOG',`<table class="matrix"><tbody><tr><td>19:42:18</td><td>BOOT RELAY SEQUENCE</td><td><span class="status-chip cyan">OK</span></td></tr><tr><td>19:42:31</td><td>AUTHORIZATION GATE OPENED</td><td><span class="status-chip amber">WAITING</span></td></tr><tr><td>19:43:02</td><td>ARCHIVE RECORD INDEX VERIFIED</td><td><span class="status-chip cyan">12/12</span></td></tr><tr><td>19:43:19</td><td>AUDIO LOG RESOURCES REMOVED</td><td><span class="status-chip">CLEAN</span></td></tr><tr><td>19:44:08</td><td>GLOBAL MAP RED ZONE OVERLAY LOADED</td><td><span class="status-chip red">ACTIVE</span></td></tr></tbody></table>`); }
let currentRecord=null,currentPage=0;
function openRecord(i){ currentRecord=DATA.records[i]; currentPage=0; playSlide(); document.getElementById('viewer').classList.add('show'); renderSlide(); }
window.openRecord=openRecord;
function renderSlide(){
 const r=currentRecord; const p=r.pages[currentPage];
 document.getElementById('viewerCode').textContent=r.code; document.getElementById('viewerOrigin').textContent='ORIGIN: '+r.origin+' // '+r.cat;
 document.getElementById('slideArea').innerHTML=`<div class="slide active"><h2>${p[0]}</h2><p>${p[1]}</p><div style="margin-top:30px"><span class="tag">${r.risk}</span><span class="tag">PAGE ${String(currentPage+1).padStart(2,'0')}</span></div></div>`;
 document.getElementById('pageCount').textContent=`PAGE ${String(currentPage+1).padStart(2,'0')} / ${String(r.pages.length).padStart(2,'0')}`;
}
function turn(delta){ if(!currentRecord) return; const next=currentPage+delta; if(next<0||next>=currentRecord.pages.length) return; currentPage=next; const v=document.getElementById('viewer'); v.classList.add('turning'); playSlide(); setTimeout(()=>{renderSlide(); v.classList.remove('turning');},160); }
document.getElementById('nextPage').onclick=()=>turn(1); document.getElementById('prevPage').onclick=()=>turn(-1); document.getElementById('closeViewer').onclick=()=>{document.getElementById('viewer').classList.remove('show');};
document.addEventListener('keydown',e=>{ if(document.getElementById('viewer').classList.contains('show')){ if(e.key==='ArrowRight'||e.key.toLowerCase()==='d') turn(1); if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a') turn(-1); if(e.key==='Escape') document.getElementById('viewer').classList.remove('show'); }});
