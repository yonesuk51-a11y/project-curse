// Project Curse 5.54.0 — channel identity and compact repeat-navigation transitions.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const screens={
    'terminal-home':{
      code:'COMMAND',label:'상황판',accent:'#c98a2e',theme:'command',
      enter:'command-online',exit:'command-handoff',
      request:'COMMAND CHANNEL REQUESTED',status:'LOCAL CONTROL RESTORED',sound:'channel.command',
      symbol:'00',signal:'LOCAL COMMAND BUS',phases:['CONTROL RELEASE','KERNEL HANDOFF','COMMAND RESTORE']
    },
    'map-room':{
      code:'CARTOGRAPHY',label:'작전 지도',accent:'#7fa39a',theme:'cartography',
      enter:'coordinate-acquire',exit:'signal-collapse',
      request:'CARTOGRAPHIC CHANNEL REQUESTED',status:'COORDINATE LAYER ACQUIRED',sound:'channel.cartography',
      symbol:'01',signal:'CARTOGRAPHIC ARRAY',phases:['SIGNAL COLLAPSE','COORDINATE LOCK','LAYER ASSEMBLY']
    },
    history:{
      code:'CHRONOLOGY',label:'세계 기록',accent:'#a8875a',theme:'chronology',
      enter:'chronology-rewind',exit:'timeline-park',
      request:'CHRONOLOGY INDEX REQUESTED',status:'DATE RANGE ORIGIN?–2042',sound:'channel.chronology',
      symbol:'02',signal:'CHRONOLOGY INDEX',phases:['TIMELINE PARK','INDEX REWIND','DATE RANGE LOCK']
    },
    'faction-info':{
      code:'INTELLIGENCE',label:'세력 분석',accent:'#8b9a66',theme:'intelligence',
      enter:'dossier-assemble',exit:'file-seal',
      request:'INTELLIGENCE NODE REQUESTED',status:'CROSS-REFERENCE ACTIVE',sound:'channel.intelligence',
      symbol:'03',signal:'INTELLIGENCE MESH',phases:['FILE SEAL','NODE CROSS-CHECK','DOSSIER ASSEMBLY']
    },
    'archive-entry':{
      code:'ARCHIVE',label:'기록보관소',accent:'#b7a98a',theme:'archive',
      enter:'vault-unseal',exit:'vault-lock',
      request:'ARCHIVE VAULT REQUESTED',status:'PUBLIC INDEX MOUNTED',sound:'channel.archive',
      symbol:'04',signal:'DOUBLE-SEALED VAULT',phases:['VAULT LOCK','RECORD MOUNT','SEAL RELEASE']
    },
    'media-audit':{
      code:'CLEARANCE',label:'미디어 감사',accent:'#7fa39a',theme:'clearance',
      enter:'evidence-index',exit:'review-seal',
      request:'CLEARANCE LEDGER REQUESTED',status:'EVIDENCE QUEUE MOUNTED',sound:'channel.archive',
      symbol:'U1',signal:'RELEASE CONTROL LEDGER',phases:['REVIEW SEAL','EVIDENCE CHECK','LEDGER MOUNT']
    },
    personnel:{
      code:'PERSONNEL',label:'인물 기록',accent:'#b29466',theme:'personnel',
      enter:'register-index',exit:'identity-seal',
      request:'PERSONNEL REGISTER REQUESTED',status:'PARTIAL IDENTITIES INDEXED',sound:'channel.intelligence',
      symbol:'05',signal:'PERSONNEL RELATION GRID',phases:['IDENTITY SEAL','RELATION CROSS-CHECK','DOSSIER INDEX']
    }
  };

  root.ProjectCurseTransitions=freeze({
    version:'1.3.0',
    timings:{
      desktop:{exit:220,cover:210,settle:90,enter:480},
      mobile:{exit:180,cover:180,settle:70,enter:400},
      reduced:{exit:0,cover:20,settle:0,enter:60}
    },
    screens,
    get(id){return screens[id]||screens['terminal-home'];}
  });
})(window);
