
let audioEnabled = true;
let ambientStarted = false;
function audio(name){ return document.getElementById(name); }
function playSound(name, vol=0.45){ if(!audioEnabled) return; const a=audio(name); if(!a) return; try{ a.volume=vol; a.currentTime=0; a.play().catch(()=>{}); }catch(e){} }
function startAmbient(){ if(!audioEnabled || ambientStarted) return; const a=audio('ambient'); if(!a) return; try{ a.volume=.12; a.loop=true; a.play().then(()=>{ambientStarted=true}).catch(()=>{}); }catch(e){} }
function toggleAudio(){ audioEnabled=!audioEnabled; document.querySelectorAll('[data-audio-toggle]').forEach(b=>b.textContent=audioEnabled?'AUDIO: SERVER MODE':'AUDIO: OFF'); if(!audioEnabled){ const a=audio('ambient'); if(a) a.pause(); ambientStarted=false;} else {startAmbient(); playSound('menu',.35);} }
document.addEventListener('click',e=>{ const link=e.target.closest('a,button'); if(link && !link.matches('[data-auth-button]') && !link.matches('[data-audio-toggle]')) playSound('menu',.28); });
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-audio-toggle]').forEach(b=>b.addEventListener('click',toggleAudio));
 const gate=document.getElementById('gate'); const app=document.getElementById('app'); const input=document.getElementById('password'); const msg=document.getElementById('gateMsg'); const btn=document.getElementById('authBtn');
 function auth(){ if(!input) return; const v=input.value.trim(); if(v==='Curse'){ msg.textContent='ACCESS GRANTED // U.A.C 내부 서버 접속 승인'; playSound('auth',.45); setTimeout(()=>{ gate.style.display='none'; app.classList.add('ready'); startAmbient();},650); } else { msg.textContent='ACCESS DENIED // ATTEMPT LOGGED'; if(input){input.classList.remove('shake'); void input.offsetWidth; input.classList.add('shake');} } }
 if(btn) btn.addEventListener('click',auth); if(input) input.addEventListener('keydown',e=>{ if(e.key==='Enter') auth(); });
 const log=document.getElementById('liveLog'); if(log){ const lines=['구역 지도 레이어 갱신 완료','원본 기록 인덱스 대조 완료','세력 관계 기록 재정렬','귀환자 분류표 접근 대기','배경 서버음 출력 상태 확인']; let i=0; setInterval(()=>{ const d=document.createElement('div'); const t=new Date().toLocaleTimeString('ko-KR',{hour12:false}); d.textContent=`[${t}] ${lines[i++%lines.length]}`; log.prepend(d); while(log.children.length>12) log.removeChild(log.lastChild);},4200); }
});
