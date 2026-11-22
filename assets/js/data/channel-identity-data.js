// Project Curse 5.54.0 — six reader-facing lore channels and adaptive density policy.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseChannelData=freeze({
    version:'1.1.0',
    storageKey:'project_curse_preferences_v1',
    density:{storageKey:'project_curse_channel_density_v1',autoCompactMs:1800,excluded:['terminal-home']},
    defaults:{quality:'auto',effects:'balanced',interfaceAudio:'full',ambient:'on',textReveal:'on'},
    channels:[
      {
        id:'terminal-home',index:'00',code:'PARTICIPANTS',label:'자캐',shortLabel:'자캐',theme:'command',glyph:'CN',
        description:'닫힌 서버에 지금 들어오는 신호와 모든 기록 채널을 한곳에서 지휘한다.',
        telemetry:[['NETWORK','ISOLATED'],['UPLINK','LOCAL'],['THREAT','ESCALATED']]
      },
      {
        id:'map-room',index:'01',code:'CARTOGRAPHY',label:'작전 지도',shortLabel:'지도',theme:'cartography',glyph:'MR',
        description:'지역과 현장, 작전이 벌어진 곳을 한 지도에 겹쳐 보고, 살아서 지나갈 수 있는 길을 찾는다.',
        telemetry:[['GRID','ACTIVE'],['LAYERS','SYNCHRONIZED'],['SIGNAL','UNSTABLE']]
      },
      {
        id:'history',index:'02',code:'CHRONOLOGY',label:'세계 기록',shortLabel:'연대기',theme:'chronology',glyph:'CH',
        description:'흩어진 사건 기록을 시간 순서로 다시 놓고, 세계가 꺾인 지점을 따라간다.',
        telemetry:[['SPAN','ORIGIN?–2042'],['INDEX','49 RECORDS'],['ERAS','10']]
      },
      {
        id:'faction-info',index:'03',code:'INTELLIGENCE',label:'세력 분석',shortLabel:'세력',theme:'intelligence',glyph:'IA',
        description:'기관과 교단, 독립 세력 사이의 관계와 부딪힐 가능성을 살핀다.',
        telemetry:[['DOSSIERS','ACTIVE'],['TRUST','VARIABLE'],['NETWORK','CONTESTED']]
      },
      {
        id:'archive-entry',index:'04',code:'ARCHIVE VAULT',label:'기록보관소',shortLabel:'보관소',theme:'archive',glyph:'AV',
        description:'거둬 온 영상과 되살린 문서를 나눠 두고, 봉인 상태와 출처를 확인한다.',
        telemetry:[['VAULT','MOUNTED'],['RECOVERY','PARTIAL'],['ACCESS','LIMITED']]
      },
      {
        id:'personnel',index:'05',code:'PERSONNEL REGISTER',label:'인물 기록',shortLabel:'인물',theme:'personnel',glyph:'PR',
        description:'2006년 명부와 2042년에 더 올린 인물의 소속과 사건을 한 사람씩 따라간다.',
        telemetry:[['BASIS','2006'],['REGISTER','56 FILES'],['STATUS','HISTORICAL']]
      }
    ],
    preferences:{
      quality:{label:'전송 품질',description:'연결 속도와 기기 성능에 맞춰 이미지·영상 준비와 지도 효과를 조절한다.',options:[['auto','AUTO'],['data','DATA SAVE'],['high','HIGH']]},
      effects:{label:'시각 효과',description:'화면 전환과 채널별 환경 연출의 강도를 조절한다.',options:[['full','FULL'],['balanced','BALANCED'],['reduced','REDUCED']]},
      interfaceAudio:{label:'인터페이스 음향',description:'버튼·기록·채널 전환 효과음의 강도를 조절한다.',options:[['full','FULL'],['minimal','MINIMAL'],['off','OFF']]},
      ambient:{label:'환경음',description:'단말 배경 루프만 별도로 켜거나 끈다.',options:[['on','ON'],['off','OFF']]},
      textReveal:{label:'텍스트 등장',description:'화면 진입 시 정보가 순차적으로 나타나는 연출을 제어한다.',options:[['on','ON'],['off','OFF']]}
    }
  });
})(window);
