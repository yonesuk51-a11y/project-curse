// Project Curse 5.36.2 — terminal-home intelligence feed.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseHomeIntelligence=freeze({
    version:'5.39.0',
    alert:{
      incident:'evt-southern-mobilization',
      title:'남부 집단 소환·쿠데타 전조',
      priority:'PRIORITY 01',
      confidence:'추정·교차 확인',
      threat:'CRITICAL',
      action:'부서진 왕관 작전 열기',
      operation:'op-southern-coup'
    },
    signals:[
      {time:'03:17',status:'CRITICAL',tone:'critical',label:'남방권 동시 소환 신호 증가',route:'map-room',operation:'op-southern-coup'},
      {time:'02:52',status:'ROUTE LOST',tone:'unstable',label:'대흑림 서부 순례 경로 재중첩',route:'archive-entry',record:'Great_Black_Forest_Region'},
      {time:'02:08',status:'RETURNED',tone:'returned',label:'데드존 서부 귀환자 격리선 도착',route:'archive-entry',record:'Dead_Zone_Pilgrimage'},
      {time:'01:31',status:'RECOVERED',tone:'recovered',label:'순례자의 규칙 제1부 복구',route:'archive-entry',record:'Pilgrim_Rules_GBF'}
    ]
  });
})(window);
