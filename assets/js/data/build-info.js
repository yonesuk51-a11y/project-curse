// Project Curse 5.43.1 — single source of truth for the terminal build.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseBuild=freeze({
    version:'5.43.1',
    codename:'Aftermath Chronicle',
    schema:'project-curse-v36',
    released:'2026-08-21',
    screens:[
      {id:'terminal-home',index:'00',label:'단말 상태',shortLabel:'홈'},
      {id:'map-room',index:'01',label:'상황 관제',shortLabel:'관제'},
      {id:'history',index:'02',label:'세계 기록',shortLabel:'연표'},
      {id:'faction-info',index:'03',label:'정보 분석',shortLabel:'분석'},
      {id:'archive-entry',index:'04',label:'기록보관소',shortLabel:'기록'}
    ]
  });
})(window);
