// Project Curse 5.54.0 — deep-world and reader-focus build manifest.
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
      {id:'terminal-home',index:'00',label:'상황판',shortLabel:'상황'},
      {id:'map-room',index:'01',label:'작전 지도',shortLabel:'지도'},
      {id:'history',index:'02',label:'세계 기록',shortLabel:'연표'},
      {id:'faction-info',index:'03',label:'세력 분석',shortLabel:'세력'},
      {id:'archive-entry',index:'04',label:'기록보관소',shortLabel:'기록'},
      {id:'personnel',index:'05',label:'인물 기록',shortLabel:'인물'}
    ]
  });
})(window);
