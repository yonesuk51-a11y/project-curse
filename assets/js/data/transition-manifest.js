// Project Curse 5.32.0 — channel identity and transition presets.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const screens={
    'terminal-home':{
      code:'COMMAND',label:'단말 상태',accent:'#c84951',theme:'command',
      enter:'command-online',exit:'command-handoff',
      request:'COMMAND CHANNEL REQUESTED',status:'LOCAL CONTROL RESTORED',sound:'channel.command'
    },
    'map-room':{
      code:'CARTOGRAPHY',label:'상황 관제',accent:'#6e9b91',theme:'cartography',
      enter:'coordinate-acquire',exit:'signal-collapse',
      request:'CARTOGRAPHIC CHANNEL REQUESTED',status:'COORDINATE LAYER ACQUIRED',sound:'channel.cartography'
    },
    history:{
      code:'CHRONOLOGY',label:'세계 기록',accent:'#b29a68',theme:'chronology',
      enter:'chronology-rewind',exit:'timeline-park',
      request:'CHRONOLOGY INDEX REQUESTED',status:'DATE RANGE 1980–2030',sound:'channel.chronology'
    },
    'faction-info':{
      code:'INTELLIGENCE',label:'정보 분석',accent:'#7393a0',theme:'intelligence',
      enter:'dossier-assemble',exit:'file-seal',
      request:'INTELLIGENCE NODE REQUESTED',status:'CROSS-REFERENCE ACTIVE',sound:'channel.intelligence'
    },
    'archive-entry':{
      code:'ARCHIVE',label:'기록보관소',accent:'#a85a52',theme:'archive',
      enter:'vault-unseal',exit:'vault-lock',
      request:'ARCHIVE VAULT REQUESTED',status:'PUBLIC INDEX MOUNTED',sound:'channel.archive'
    }
  };

  root.ProjectCurseTransitions=freeze({
    version:'1.0.0',
    timings:{desktop:{exit:190,cover:170,enter:390},mobile:{exit:140,cover:130,enter:300},reduced:{exit:0,cover:45,enter:70}},
    screens,
    get(id){return screens[id]||screens['terminal-home'];}
  });
})(window);
