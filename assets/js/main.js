const DATA = window.UAC_DATA;
const PASS = 'Curse';
const boot = document.getElementById('boot');
const auth = document.getElementById('auth');
const app = document.getElementById('app');
const main = document.getElementById('main');
const tabs = document.querySelectorAll('[data-page]');
const soundBtn = document.getElementById('soundBtn');
const bootAudio = new Audio('assets/audio/uac_boot_relay_loop.mp3'); bootAudio.loop = true; bootAudio.volume = .18;
const humAudio = new Audio('assets/audio/uac_server_hum.wav'); humAudio.loop = true; humAudio.volume = .10;
const slideAudio = new Audio('assets/audio/analog_slide_projector.mp3'); slideAudio.volume = .54;
let sound = false;
function playSlide(){ if(!sound) return; slideAudio.pause(); slideAudio.currentTime=0; slideAudio.play().catch(()=>{}); }
function startHum(){ if(!sound) return; humAudio.play().catch(()=>{}); }
function stopBoot(){ bootAudio.pause(); bootAudio.currentTime=0; }
soundBtn.onclick=()=>{ sound=!sound; soundBtn.textContent=sound?'SOUND ON':'SOUND OFF'; if(sound){ if(!boot.classList.contains('hidden')) bootAudio.play().catch(()=>{}); else startHum(); } else { stopBoot(); humAudio.pause(); }};
function runBoot(){
  const lines = [
    'U.A.C FIELDNODE // SECURE BOOT REQUEST ACCEPTED',
    'MAGNETIC MEMORY BUS: SEEKING',
    'RELAY ARRAY: 11/11 CONTACTS CLOSED',
    'ARCHIVE CARTRIDGE: MOUNTED',
    'AUDIO LOG STREAM: DISABLED',
    'ZONE OVERLAY: CHINA / RUSSIA / NORTH AMERICA FLAGS LOADED',
    'BLACK FILE INDEX: SEALED',
    'ACCESS NODE: WAITING FOR HUMAN INPUT'
  ];
  const log=document.getElementById('bootLog'), bar=document.getElementById('bootBar'), pct=document.getElementById('bootPct');
  let i=0,p=0;
  const t=setInterval(()=>{
    if(i<lines.length){ log.innerHTML += '<div>&gt; '+lines[i++]+'</div>'; log.scrollTop=log.scrollHeight; }
    p += Math.floor(Math.random()*8)+6; if(p>100)p=100; bar.style.width=p+'%'; pct.textContent=String(p).padStart(3,'0')+'%';
    if(p>=100){ clearInterval(t); setTimeout(()=>{ boot.classList.add('hidden'); stopBoot(); auth.classList.add('show'); },680); }
  },330);
}
window.addEventListener('load',()=>{ setTimeout(runBoot,250); });

document.getElementById('submitPass').onclick=checkPass;
document.getElementById('password').addEventListener('keydown',e=>{ if(e.key==='Enter') checkPass(); });
function checkPass(){
 const v=document.getElementById('password').value;
 const msg=document.getElementById('authMsg');
 if(v===PASS){ msg.textContent='ACCESS GRANTED // SERVER ROOM UNLOCKED'; msg.style.color='#ff756c'; sessionStorage.setItem('uac_auth','1'); playSlide(); setTimeout(()=>{auth.classList.remove('show'); app.classList.remove('hide'); render('overview'); startHum();},620); }
 else { msg.textContent='ACCESS DENIED // PASSWORD MISMATCH'; msg.style.color='#ff514b'; }
}
if(sessionStorage.getItem('uac_auth')==='1'){ boot.classList.add('hidden'); auth.classList.remove('show'); app.classList.remove('hide'); setTimeout(()=>render('overview'),0); }

tabs.forEach(b=>b.addEventListener('click',()=>{ tabs.forEach(x=>x.classList.remove('active')); b.classList.add('active'); render(b.dataset.page); }));
function head(title,sub){ return `<div class="page-head"><div><h1>${title}</h1><div class="sub">${sub}</div></div><div class="sub">U.A.C SERVER // 2026</div></div>`; }
function panel(label,body){ return `<section class="panel" data-label="${label||''}">${body}</section>`; }
function render(page){ main.scrollTop=0; ({overview,factions,relations,map:zoneMap,records,entities,images:imageIndex}[page]||overview)(); }
function overview(){
 main.innerHTML=head('ARCHIVE FLOOR','COMPRESSED DATABASE / FIELD TERMINAL VIEW')+`
 <div class="grid two">
 ${panel('SERVER SUMMARY',`<h3>U.A.C Secure Archive</h3><p>Project Curse 관련 세력, 레드존, 블랙존, 괴이, 회수 기록을 긴 문서가 아닌 현장 서버용 압축 데이터로 열람한다.</p><p><span class="tag red">CLASSIFIED</span><span class="tag">FIELD OPS</span><span class="tag amber">2026 NODE</span></p>`)}
 ${panel('CURRENT MAP ALERT',`<h3>Global Red Zone Status</h3><p><b class="danger">중국, 러시아, 북미 일부</b>가 레드존 오버레이로 표시된다. 블랙존 데이터는 관측 오류가 많아 완전 공개되지 않는다.</p><p><span class="tag red">RED ZONE</span><span class="tag amber">CONTAINMENT BORDER</span><span class="tag cyan">RECOVERY ROUTE</span></p>`)}
 </div>
 <div class="grid three" style="margin-top:16px">
 ${panel('FACTIONS',`<h3>세력 / 역할</h3><p>U.A.C는 통제, N.H.C는 현장, S.I.D는 수사, A.R.F는 회수, C.P.D는 민간 보호, F.H.C는 기밀 연구를 담당한다.</p>`)}
 ${panel('ENTITY INDEX',`<h3>괴이 분류</h3><p>Feral, Superior-Type, Queen-Type, Artificial, Hybrid, Returned Civilian 기록을 압축 표시한다.</p>`)}
 ${panel('RECORD VAULT',`<h3>기록물 보관소</h3><p>Sakuma Tape, Unknown Records, Blood Lake, Redwolf Defection, N.H.C Manual 등은 별도 파일 카드로 분류된다.</p>`)}
 </div>
 <div class="grid three" style="margin-top:22px">`+DATA.records.slice(0,9).map((r,i)=>recordCard(r,i)).join('')+`</div>`;
}
function factions(){ main.innerHTML=head('FACTION DATABASE','세력 / 역할 / 통제 구조')+`<div class="grid three">`+DATA.factions.map(f=>`<div class="card" data-label="FACTION"><div class="card-title">${f.id}</div><div class="card-role">${f.type}</div><p>${f.role}</p></div>`).join('')+`</div>`; }
function relations(){ main.innerHTML=head('FACTION RELATIONS','세력간 협력 / 감시 / 적대 관계')+panel('RELATION MATRIX',`<table class="matrix"><thead><tr><th>FROM</th><th>TO</th><th>STATUS</th><th>NOTE</th></tr></thead><tbody>${DATA.relations.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><span class="status-chip ${r[2].includes('위협')||r[2].includes('이탈')?'red':r[2].includes('기밀')||r[2].includes('감시')?'amber':'cyan'}">${r[2]}</span></td><td>${r[3]}</td></tr>`).join('')}</tbody></table>`); }
function zoneMap(){ main.innerHTML=head('GLOBAL ZONE MAP','China / Russia / North America Red Zone Overlay')+`<div class="grid two"><div class="panel mapbox" data-label="WORLD SCAN">${worldMapSvg()}</div>${panel('ZONE LEGEND',`<h3>분류 기준</h3><p><span class="tag red">RED ZONE</span> 괴이 생태계와 군사 봉쇄가 동시에 발생한 지역.</p><p><span class="tag amber">BLACK ZONE</span> 현실 통제 상실. 관측 데이터 오류.</p><p><span class="tag cyan">CONTAINMENT NODE</span> U.A.C/N.H.C 봉쇄 및 회수 거점.</p><p>세계지도는 기본적으로 <b>중국, 러시아, 북미 일부 레드존화</b> 상태를 표시한다.</p>` )}</div>`; }
function worldMapSvg(){ return `<svg class="worldsvg" viewBox="0 0 1000 580" preserveAspectRatio="xMidYMid meet"><defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0 L0 0 0 30" fill="none" stroke="#24211e" stroke-width="1"/></pattern></defs><rect width="1000" height="580" fill="url(#grid)" opacity=".85"/><path class="securezone" d="M100,160 C160,90 250,110 285,170 C320,235 260,310 180,300 C100,292 65,220 100,160Z"/><path class="redzone" d="M120,170 C190,120 260,145 280,200 C300,255 252,290 185,285 C125,280 90,225 120,170Z"/><text class="maplabel" x="125" y="250" fill="#ff6b5b">NORTH AMERICA PARTIAL RED ZONE</text><path class="securezone" d="M455,230 C520,185 600,205 640,255 C680,315 625,370 555,360 C485,350 430,290 455,230Z"/><text class="maplabel" x="500" y="290">EUROPE / AFRICA MONITORING</text><path class="redzone" d="M590,125 C705,70 845,105 910,190 C960,270 930,365 815,380 C705,395 600,330 570,245 C550,190 560,150 590,125Z"/><text class="maplabel" x="690" y="235" fill="#ff6b5b">RUSSIA / CHINA RED ZONE</text><path class="securezone" d="M280,330 C340,300 390,335 380,410 C365,485 300,510 245,470 C205,430 225,365 280,330Z"/><text class="maplabel" x="278" y="410">SOUTH AMERICA</text><circle class="node" cx="205" cy="225" r="5"/><circle class="node" cx="735" cy="245" r="5"/><circle class="node" cx="510" cy="285" r="5"/><path class="route" d="M205 225 C370 185, 515 225, 735 245"/><path class="route" d="M510 285 C610 330, 705 385, 780 450"/><text class="maplabel" x="32" y="42">U.A.C TERRITORY SCAN // 2026</text><text class="maplabel" x="32" y="540">RED ZONE DATA PARTIAL // BLACK ZONE DATA UNSTABLE</text></svg>`; }
function recordCard(r,i){ const rot=[-1.5,.8,-.4,1.4,-.9,.6,-1.2,1.1,0][i%9]; return `<div class="card record-card" style="--r:${rot}deg" data-label="FILE" onclick="openRecord(${i})"><div class="record-code">${r.code}</div><div class="record-origin">ORIGIN: ${r.origin}</div><div class="record-meta"><span class="tag">${r.cat}</span><span class="tag ${r.risk.includes('BLACK')||r.risk.includes('OMEGA')?'red':r.risk.includes('SECRET')?'amber':''}">${r.risk}</span></div><p>${r.summary}</p></div>`; }
function records(){ main.innerHTML=head('ARCHIVE RECORDS','코드형 문서 보관소')+`<div class="grid three">`+DATA.records.map((r,i)=>recordCard(r,i)).join('')+`</div>`; }
function entities(){ main.innerHTML=head('ENTITY INDEX','Feral / Superior-Type / Queen-Type / Returned Civilian')+`<div class="grid two">`+DATA.entities.map(e=>`<div class="card" data-label="ENTITY"><div class="card-title">${e[0]}</div><p>${e[1]}</p></div>`).join('')+`</div>`; }
function imageIndex(){ main.innerHTML=head('RECOVERED FRAMES','이미지 첨부 / Audio Log 제거됨')+panel('FRAME INDEX',`<p>원본 Audio Log MP3는 제거되고, 이미지 자료만 WebP로 압축 보관된다.</p><div class="image-grid">${DATA.images.slice(0,83).map(src=>`<img src="${src}" loading="lazy">`).join('')}</div>`); }
let currentRecord=null,currentPage=0;
function openRecord(i){ currentRecord=DATA.records[i]; currentPage=0; playSlide(); document.getElementById('viewer').classList.add('show'); renderSlide(); }
window.openRecord=openRecord;
function renderSlide(){ const r=currentRecord,p=r.pages[currentPage]; document.getElementById('viewerCode').textContent=r.code; document.getElementById('viewerOrigin').textContent='ORIGIN: '+r.origin+' // '+r.cat; document.getElementById('slideArea').innerHTML=`<div class="slide active"><h2>${p[0]}</h2><p>${p[1]}</p><div style="margin-top:28px"><span class="tag ${r.risk.includes('BLACK')?'red':''}">${r.risk}</span><span class="tag">PAGE ${String(currentPage+1).padStart(2,'0')}</span></div></div>`; document.getElementById('pageCount').textContent=`PAGE ${String(currentPage+1).padStart(2,'0')} / ${String(r.pages.length).padStart(2,'0')}`; }
function turn(delta){ if(!currentRecord) return; const next=currentPage+delta; if(next<0||next>=currentRecord.pages.length) return; currentPage=next; const v=document.getElementById('viewer'); v.classList.add('turning'); playSlide(); setTimeout(()=>{renderSlide(); v.classList.remove('turning');},160); }
document.getElementById('nextPage').onclick=()=>turn(1); document.getElementById('prevPage').onclick=()=>turn(-1); document.getElementById('closeViewer').onclick=()=>{document.getElementById('viewer').classList.remove('show');};
document.addEventListener('keydown',e=>{ if(document.getElementById('viewer').classList.contains('show')){ if(e.key==='ArrowRight'||e.key.toLowerCase()==='d') turn(1); if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a') turn(-1); if(e.key==='Escape') document.getElementById('viewer').classList.remove('show'); }});
