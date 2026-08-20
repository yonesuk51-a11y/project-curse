#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=fileURLToPath(new URL('../',import.meta.url));
const OUTPUT=resolve(ROOT,'assets/audio/core');
const SAMPLE_RATE=48000;

export const sounds=Object.freeze([
  {id:'terminal.connect',file:'pc-core-terminal-connect.wav',label:'단말 연결',family:'TERMINAL',bus:'interface',duration:.64,recipe:'terminalConnect'},
  {id:'terminal.disconnect',file:'pc-core-terminal-disconnect.wav',label:'단말 분리',family:'TERMINAL',bus:'interface',duration:.46,recipe:'terminalDisconnect'},
  {id:'menu.open',file:'pc-core-menu-open.wav',label:'메뉴 열기',family:'NAVIGATION',bus:'interface',duration:.22,recipe:'menuOpen'},
  {id:'menu.close',file:'pc-core-menu-close.wav',label:'메뉴 닫기',family:'NAVIGATION',bus:'interface',duration:.20,recipe:'menuClose'},
  {id:'menu.select',file:'pc-core-menu-select.wav',label:'항목 선택',family:'NAVIGATION',bus:'interface',duration:.12,recipe:'menuSelect'},
  {id:'menu.back',file:'pc-core-menu-back.wav',label:'이전 단계',family:'NAVIGATION',bus:'interface',duration:.23,recipe:'menuBack'},
  {id:'access.denied',file:'pc-core-access-denied.wav',label:'접근 거부',family:'ALERT',bus:'alert',duration:.54,recipe:'accessDenied'},
  {id:'record.mount',file:'pc-core-record-mount.wav',label:'기록 마운트',family:'ARCHIVE',bus:'record',duration:.68,recipe:'recordMount'},
  {id:'record.unmount',file:'pc-core-record-unmount.wav',label:'기록 언마운트',family:'ARCHIVE',bus:'record',duration:.45,recipe:'recordUnmount'},
  {id:'evidence.open',file:'pc-core-evidence-open.wav',label:'증거 프레임',family:'ARCHIVE',bus:'record',duration:.38,recipe:'evidenceOpen'},
  {id:'comm.connect',file:'pc-core-comm-connect.wav',label:'통신 연결',family:'SIGNAL',bus:'interface',duration:.74,recipe:'commConnect'},
  {id:'operation.confirm',file:'pc-core-operation-confirm.wav',label:'작전 확인',family:'OPERATION',bus:'alert',duration:.56,recipe:'operationConfirm'}
]);

function seedFor(value){
  const digest=createHash('sha256').update(value).digest();
  return digest.readUInt32LE(0)||0x9e3779b9;
}

function synthesizer(definition){
  const length=Math.round(definition.duration*SAMPLE_RATE);
  const samples=new Float64Array(length);
  let seed=seedFor(`project-curse:${definition.id}:v1`);
  const random=()=>{
    seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;
    return ((seed>>>0)/4294967296)*2-1;
  };
  const at=seconds=>Math.max(0,Math.min(length-1,Math.round(seconds*SAMPLE_RATE)));
  const envelope=(time,duration,attack=.015,release=.08)=>Math.min(1,time/Math.max(.0001,attack),(duration-time)/Math.max(.0001,release));
  const wave=(phase,type)=>type==='square'?(Math.sin(phase)>=0?1:-1):type==='triangle'?2/Math.PI*Math.asin(Math.sin(phase)):Math.sin(phase);

  function tone(start,duration,from,to=from,amplitude=.2,type='sine',attack=.012,release=.08){
    const begin=at(start),end=Math.min(length,at(start+duration));
    let phase=0;
    for(let index=begin;index<end;index++){
      const time=(index-begin)/SAMPLE_RATE;
      const ratio=time/duration;
      const frequency=from+(to-from)*ratio;
      phase+=Math.PI*2*frequency/SAMPLE_RATE;
      samples[index]+=wave(phase,type)*amplitude*Math.max(0,envelope(time,duration,attack,release));
    }
  }

  function noise(start,duration,amplitude=.12,cutoff=2200,attack=.006,release=.08,highpass=false){
    const begin=at(start),end=Math.min(length,at(start+duration));
    const alpha=1-Math.exp(-Math.PI*2*cutoff/SAMPLE_RATE);
    let low=0,previousLow=0;
    for(let index=begin;index<end;index++){
      const time=(index-begin)/SAMPLE_RATE;
      low+=alpha*(random()-low);
      const value=highpass?low-previousLow:low;
      previousLow=low;
      samples[index]+=value*amplitude*Math.max(0,envelope(time,duration,attack,release));
    }
  }

  function relay(time,amplitude=.34,pitch=92){
    const begin=at(time),end=Math.min(length,at(time+.075));
    for(let index=begin;index<end;index++){
      const elapsed=(index-begin)/SAMPLE_RATE;
      const decay=Math.exp(-elapsed*58);
      const metal=Math.sin(Math.PI*2*pitch*elapsed)+.34*Math.sin(Math.PI*2*pitch*3.08*elapsed);
      samples[index]+=(metal*.55+random()*.45)*amplitude*decay;
    }
  }

  const recipes={
    terminalConnect(){
      noise(0,.11,.18,1800,.002,.07,true);relay(.035,.28,78);
      tone(.09,.24,286,344,.18,'triangle',.006,.09);tone(.16,.30,572,688,.11,'sine',.01,.13);
      tone(.34,.23,916,1032,.12,'sine',.008,.12);relay(.49,.13,112);
    },
    terminalDisconnect(){
      relay(.01,.25,105);tone(.035,.31,690,258,.18,'triangle',.006,.12);
      tone(.08,.26,345,129,.13,'sine',.004,.13);noise(.31,.12,.10,1050,.002,.1,false);
    },
    menuOpen(){
      relay(.006,.18,134);tone(.018,.17,420,720,.16,'triangle',.004,.065);tone(.08,.12,840,1110,.08,'sine',.003,.06);
    },
    menuClose(){
      tone(.004,.16,760,360,.15,'triangle',.003,.07);relay(.095,.17,88);noise(.11,.07,.06,1400,.002,.05,true);
    },
    menuSelect(){
      relay(.002,.23,164);tone(.008,.092,1040,930,.13,'sine',.001,.045);
    },
    menuBack(){
      tone(.004,.16,520,320,.14,'triangle',.003,.075);tone(.045,.14,260,210,.10,'sine',.004,.07);relay(.13,.14,70);
    },
    accessDenied(){
      relay(.006,.30,62);noise(.015,.46,.14,1250,.003,.08,true);
      tone(.035,.15,188,176,.21,'square',.003,.035);tone(.215,.17,154,143,.23,'square',.003,.055);
      tone(.08,.34,754,612,.055,'sine',.01,.1);
    },
    recordMount(){
      relay(.006,.32,71);relay(.105,.24,98);noise(.025,.23,.12,900,.003,.08,false);
      tone(.16,.37,112,126,.16,'triangle',.015,.16);tone(.23,.30,448,504,.09,'sine',.015,.14);
      relay(.49,.29,146);tone(.51,.12,980,1040,.08,'sine',.003,.07);
    },
    recordUnmount(){
      relay(.004,.22,142);tone(.018,.29,488,116,.14,'triangle',.006,.13);
      noise(.10,.30,.12,720,.004,.15,false);relay(.315,.26,66);
    },
    evidenceOpen(){
      relay(.005,.36,118);noise(.012,.15,.20,3200,.001,.09,true);
      tone(.055,.22,1380,740,.09,'sine',.004,.10);relay(.245,.22,82);
    },
    commConnect(){
      noise(0,.22,.24,2600,.003,.08,true);tone(.09,.11,620,760,.10,'square',.003,.04);
      tone(.24,.12,910,1030,.12,'sine',.004,.05);tone(.39,.12,1030,910,.12,'sine',.004,.05);
      noise(.49,.20,.16,1900,.003,.12,true);relay(.58,.20,104);
    },
    operationConfirm(){
      relay(.004,.22,84);tone(.035,.13,330,392,.14,'triangle',.004,.05);
      tone(.18,.13,440,524,.16,'triangle',.004,.05);tone(.325,.17,590,704,.19,'triangle',.004,.09);
      noise(.37,.12,.07,1700,.002,.09,true);
    }
  };

  recipes[definition.recipe]();

  const fade=Math.round(.004*SAMPLE_RATE);
  for(let index=0;index<fade;index++) samples[index]*=index/fade;
  for(let index=0;index<fade;index++) samples[length-1-index]*=index/fade;
  const mean=samples.reduce((sum,value)=>sum+value,0)/length;
  let peak=0;
  for(let index=0;index<length;index++){
    samples[index]=Math.tanh((samples[index]-mean)*1.18);
    peak=Math.max(peak,Math.abs(samples[index]));
  }
  const scale=peak?0.74/peak:1;
  for(let index=0;index<length;index++) samples[index]*=scale;
  return samples;
}

function wavBuffer(samples){
  const bytesPerSample=2;
  const dataBytes=samples.length*bytesPerSample;
  const output=Buffer.alloc(44+dataBytes);
  output.write('RIFF',0);output.writeUInt32LE(36+dataBytes,4);output.write('WAVE',8);
  output.write('fmt ',12);output.writeUInt32LE(16,16);output.writeUInt16LE(1,20);output.writeUInt16LE(1,22);
  output.writeUInt32LE(SAMPLE_RATE,24);output.writeUInt32LE(SAMPLE_RATE*bytesPerSample,28);
  output.writeUInt16LE(bytesPerSample,32);output.writeUInt16LE(16,34);output.write('data',36);output.writeUInt32LE(dataBytes,40);
  samples.forEach((value,index)=>output.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value))*32767),44+index*2));
  return output;
}

const writeMode=process.argv.includes('--write');
const report=[];
if(writeMode) mkdirSync(OUTPUT,{recursive:true});
for(const definition of sounds){
  const buffer=wavBuffer(synthesizer(definition));
  const target=resolve(OUTPUT,definition.file);
  const sha256=createHash('sha256').update(buffer).digest('hex');
  if(writeMode) writeFileSync(target,buffer);
  else if(!existsSync(target)||!readFileSync(target).equals(buffer)){
    console.error(`STALE assets/audio/core/${definition.file}; run node tools/build-core-sounds.mjs --write`);
    process.exitCode=1;
  }
  report.push({id:definition.id,file:definition.file,bus:definition.bus,durationMs:Math.round(definition.duration*1000),bytes:buffer.length,sha256});
}
console.log(JSON.stringify({version:'1.0.0',sampleRate:SAMPLE_RATE,format:'PCM_S16LE_MONO',sounds:report},null,2));
