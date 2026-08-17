// Project Curse 5.32.0 — public single-shell record index
(function(root){
  'use strict';

  function freeze(value){
    if(!value || typeof value!=='object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseArchive=freeze({
    version:'5.32.0',
    publicRecords:[
      {
        id:'Cults_871104', code:'CULT-ARCHIVE', access:'open', format:'video',
        title:'종교',
        summary:'타락교와 혈교, 그리고 그 주변에서 확인된 오염과 의식의 기록.'
      },
      {
        id:'Immortality_860201', code:'OP-IMMORTALITY', access:'open', format:'video',
        title:'불멸을 향해',
        summary:'피의 호수에서 회수된 현장 통신과 촬영 기록으로 구성된 작전 파일.'
      },
      {
        id:'Ferals_860722', code:'FERAL-CLASSIFICATION', access:'open', format:'video',
        presentation:'cinematic',
        title:'괴이',
        summary:'Ferals·Superiors·Unusuals 계열과 확인 개체 15종의 특징을 정리한 통합 분류 기록.'
      },
      {
        id:'Zone_870815', code:'ZONE-CLASSIFICATION', access:'open', format:'document',
        title:'구역 위험도 분류 문서',
        summary:'그린·옐로우·레드·화이트·블랙존의 의미와 전환 조건을 정리한 기본 판정 문서.'
      },
      {
        id:'Sakuma_Tape_991028', code:'SID-SAKUMA', access:'open', format:'video', presentation:'cinematic',
        title:'사쿠마의 테이프',
        summary:'도쿄 지부 조사관 사쿠마 유타의 마지막 조사와 실종 경위를 묶은 사건 기록.'
      },
      {
        id:'Unknown_Record1_860204', code:'AMARION-FOOTAGE', access:'open', format:'document',
        title:'아마리온 회수 영상 기록',
        summary:'저근접 자기 왜곡 시스템과 공간 개척 사업을 소개하는 기업 교육 영상의 회수본.'
      },
      {
        id:'Unknown_Record2_860205', code:'BLOOD-LAKE-AUTOPSY', access:'open', format:'document',
        title:'피의 호수 부검 기록',
        summary:'피의 호수 회수 사체를 부검하는 동안 기록된 영상·음성 로그.'
      },
      {
        id:'Unknown_Record3_920711', code:'REDWOLF-DEFECTION', access:'open', format:'document',
        title:'레드울프 이탈 기록',
        summary:'웨이드 밀렌과 제임스 애셔가 이탈 직전 나눈 대화가 담긴 암호화 CCTV 기록.'
      },
      {
        id:'Unknown_Record4_930314', code:'SON-ILLEGAL-ARMS', access:'open', format:'document',
        title:'S.O.N 비인가 장비 유통 기록',
        summary:'축복으로 위장한 병기 계획을 논의한 웨이드 밀렌·윌리엄 카터의 감청 음성.'
      },
      {
        id:'Great_Black_Forest_Region', code:'REGION-GBF-SOUTH', access:'open', format:'document',
        title:'대흑림 권역 보고서',
        summary:'대흑림의 정착지와 성채, 교단 사이의 관계, 타락 야생체의 생태를 정리한 불완전한 지역 기록.'
      },
      {
        id:'Dead_Zone_Pilgrimage', code:'REGION-DEADZONE-NORTH', access:'open', format:'document',
        title:'데드존 순례 및 귀환자 기록',
        summary:'국가도 귀환 보장도 사라진 북아메리카의 현황과 순례 경로, 귀환자 검문 기록.'
      },
      {
        id:'Pilgrim_Rules_GBF', code:'FIELD-RULES-PILGRIM-I', access:'open', format:'document',
        title:'순례자의 규칙 — 제1부',
        summary:'대흑림 순례로에서 전승되는 열한 가지 불완전 생존 규칙과 현장 해석.'
      },
      {
        id:'Operation_Broken_Crown', code:'OP-BROKEN-CROWN', access:'open', format:'document',
        title:'부서진 왕관 작전 시나리오',
        summary:'남방 집단 소환을 차단하며 처형 명령의 진위를 판별하는 상호작용형 정보 기록.'
      }
    ]
  });
})(window);
