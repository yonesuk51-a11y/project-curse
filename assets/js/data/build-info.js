// Project Curse 5.54.0 — deep-world and personnel revision build manifest.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseBuild=freeze({
    version:'5.54.0',
    codename:'The World Before Institutions',
    schema:'project-curse-v44',
    released:'2026-08-27',
    screens:[
      {id:'terminal-home',index:'00',label:'단말 상태',shortLabel:'홈'},
      {id:'map-room',index:'01',label:'상황 관제',shortLabel:'관제'},
      {id:'history',index:'02',label:'세계 기록',shortLabel:'연표'},
      {id:'faction-info',index:'03',label:'세력 분석',shortLabel:'세력'},
      {id:'archive-entry',index:'04',label:'기록보관소',shortLabel:'기록'},
      {id:'personnel',index:'05',label:'인물 기록',shortLabel:'인물'},
      {id:'media-audit',index:'U1',label:'미디어 감사',shortLabel:'감사',navTier:'utility'}
    ]
  });
})(window);
