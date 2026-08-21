// Project Curse 5.49.0 — public channel identity and restrained transition presets.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const screens={
    'terminal-home':{
      code:'COMMAND',label:'단말',accent:'#c84951',theme:'command',
      enter:'command-online',exit:'command-handoff',
      request:'COMMAND CHANNEL REQUESTED',status:'LOCAL CONTROL RESTORED',sound:'channel.command',
      symbol:'00',signal:'LOCAL COMMAND BUS',phases:['CONTROL RELEASE','KERNEL HANDOFF','COMMAND RESTORE']
    },
    'map-room':{
      code:'CARTOGRAPHY',label:'전장·권역',accent:'#6e9b91',theme:'cartography',
      enter:'coordinate-acquire',exit:'signal-collapse',
      request:'CARTOGRAPHIC CHANNEL REQUESTED',status:'COORDINATE LAYER ACQUIRED',sound:'channel.cartography',
      symbol:'01',signal:'CARTOGRAPHIC ARRAY',phases:['SIGNAL COLLAPSE','COORDINATE LOCK','LAYER ASSEMBLY']
    },
    history:{
      code:'CHRONOLOGY',label:'세계 역사',accent:'#b29a68',theme:'chronology',
      enter:'chronology-rewind',exit:'timeline-park',
      request:'CHRONOLOGY INDEX REQUESTED',status:'DATE RANGE 1980–2030',sound:'channel.chronology',
      symbol:'02',signal:'CHRONOLOGY INDEX',phases:['TIMELINE PARK','INDEX REWIND','DATE RANGE LOCK']
    },
    'faction-info':{
      code:'INTELLIGENCE',label:'세력 정보',accent:'#7393a0',theme:'intelligence',
      enter:'dossier-assemble',exit:'file-seal',
      request:'INTELLIGENCE NODE REQUESTED',status:'CROSS-REFERENCE ACTIVE',sound:'channel.intelligence',
      symbol:'03',signal:'INTELLIGENCE MESH',phases:['FILE SEAL','NODE CROSS-CHECK','DOSSIER ASSEMBLY']
    },
    'archive-entry':{
      code:'ARCHIVE',label:'기록보관소',accent:'#a85a52',theme:'archive',
      enter:'vault-unseal',exit:'vault-lock',
      request:'ARCHIVE VAULT REQUESTED',status:'PUBLIC INDEX MOUNTED',sound:'channel.archive',
      symbol:'04',signal:'DOUBLE-SEALED VAULT',phases:['VAULT LOCK','RECORD MOUNT','SEAL RELEASE']
    },
    'media-audit':{
      code:'CLEARANCE',label:'미디어 감사',accent:'#65aaa3',theme:'clearance',
      enter:'evidence-index',exit:'review-seal',
      request:'CLEARANCE LEDGER REQUESTED',status:'EVIDENCE QUEUE MOUNTED',sound:'channel.archive',
      symbol:'05',signal:'RELEASE CONTROL LEDGER',phases:['REVIEW SEAL','EVIDENCE CHECK','LEDGER MOUNT']
    }
  };

  root.ProjectCurseTransitions=freeze({
    version:'1.2.0',
    timings:{
      desktop:{exit:120,cover:120,settle:60,enter:240},
      mobile:{exit:100,cover:100,settle:50,enter:200},
      reduced:{exit:0,cover:30,settle:20,enter:80}
    },
    screens,
    get(id){return screens[id]||screens['terminal-home'];}
  });
})(window);
