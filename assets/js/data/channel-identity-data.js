// Project Curse 5.49.0 — visual identity and adaptive density policy for five public lore channels.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseChannelData=freeze({
    version:'1.0.0',
    storageKey:'project_curse_preferences_v1',
    density:{storageKey:'project_curse_channel_density_v1',autoCompactMs:1800,excluded:['terminal-home']},
    defaults:{quality:'auto',effects:'balanced',interfaceAudio:'minimal',ambient:'off',textReveal:'on'},
    channels:[
      {
        id:'terminal-home',index:'00',code:'ARCHIVE ENTRY',label:'단말',shortLabel:'단말',theme:'command',glyph:'CN',
        description:'금기를 무기로 삼은 세계의 역사와 전장, 세력과 회수 기록으로 진입한다.',
        telemetry:[['NETWORK','ISOLATED'],['UPLINK','LOCAL'],['THREAT','ESCALATED']]
      },
      {
        id:'map-room',index:'01',code:'CARTOGRAPHY',label:'전장·권역',shortLabel:'지도',theme:'cartography',glyph:'MR',
        description:'권역·현장·작전 좌표를 겹쳐 보고 생존 가능한 이동 경로를 판독한다.',
        telemetry:[['GRID','ACTIVE'],['LAYERS','SYNCHRONIZED'],['SIGNAL','UNSTABLE']]
      },
      {
        id:'history',index:'02',code:'CHRONOLOGY',label:'세계 역사',shortLabel:'연대기',theme:'chronology',glyph:'CH',
        description:'분절된 사건 기록을 시간축에 재배열해 세계의 변곡점을 추적한다.',
        telemetry:[['SPAN','1975–2042'],['INDEX','43 RECORDS'],['EVENTS','9']]
      },
      {
        id:'faction-info',index:'03',code:'INTELLIGENCE',label:'세력 정보',shortLabel:'세력',theme:'intelligence',glyph:'IA',
        description:'기관·교단·독립 세력의 관계와 충돌 가능성을 분석한다.',
        telemetry:[['DOSSIERS','ACTIVE'],['TRUST','VARIABLE'],['NETWORK','CONTESTED']]
      },
      {
        id:'archive-entry',index:'04',code:'ARCHIVE VAULT',label:'기록보관소',shortLabel:'보관소',theme:'archive',glyph:'AV',
        description:'회수 영상과 복구 문서를 분류하고 봉인 상태와 출처를 검증한다.',
        telemetry:[['VAULT','MOUNTED'],['RECOVERY','PARTIAL'],['ACCESS','LIMITED']]
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
