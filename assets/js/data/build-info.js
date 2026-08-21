// Project Curse 5.49.0 — public archive refocus build manifest.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseBuild=freeze({
    version:'5.49.0',
    codename:'Public Archive Refocus',
    schema:'project-curse-v42',
    released:'2026-08-21',
    screens:[
      {id:'terminal-home',index:'00',label:'단말',shortLabel:'홈'},
      {id:'map-room',index:'01',label:'전장·권역',shortLabel:'지도'},
      {id:'history',index:'02',label:'세계 역사',shortLabel:'연표'},
      {id:'faction-info',index:'03',label:'세력 정보',shortLabel:'세력'},
      {id:'archive-entry',index:'04',label:'기록보관소',shortLabel:'기록'}
    ],
    internalScreens:[
      {id:'media-audit',index:'OP',label:'미디어 감사',shortLabel:'감사',access:'operator=media'}
    ]
  });
})(window);
