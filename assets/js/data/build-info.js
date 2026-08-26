// Project Curse 5.51.0 — supplemental identity dossier build manifest.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseBuild=freeze({
    version:'5.51.0',
    codename:'Supplemental Identity Dossiers',
    schema:'project-curse-v43',
    released:'2026-08-26',
    screens:[
      {id:'terminal-home',index:'00',label:'단말 상태',shortLabel:'홈'},
      {id:'map-room',index:'01',label:'상황 관제',shortLabel:'관제'},
      {id:'history',index:'02',label:'세계 기록',shortLabel:'연표'},
      {id:'faction-info',index:'03',label:'정보 분석',shortLabel:'분석'},
      {id:'archive-entry',index:'04',label:'기록보관소',shortLabel:'기록'},
      {id:'media-audit',index:'05',label:'미디어 감사',shortLabel:'감사'},
      {id:'personnel',index:'06',label:'인물 기록',shortLabel:'인물'}
    ]
  });
})(window);
