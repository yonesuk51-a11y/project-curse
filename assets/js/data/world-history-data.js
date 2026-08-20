// Project Curse 5.36.0 — chronology eras, evidence grades and canon-gap registry.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const evidenceLevels={
    confirmed:{label:'확정 기록',code:'CONFIRMED',description:'공식 문서와 현재 정사 대장이 일치한다.'},
    corroborated:{label:'복수 기록 일치',code:'CORROBORATED',description:'서로 독립된 기록 둘 이상이 핵심 사실에 일치한다.'},
    observed:{label:'현장 관측',code:'OBSERVED',description:'현장 자료가 남아 있으나 원인과 책임 주체는 완전히 확정되지 않았다.'},
    testimony:{label:'증언 기반',code:'TESTIMONY',description:'생존자·관계자 증언이 중심이며 물증이 제한적이다.'},
    disputed:{label:'상충 기록',code:'DISPUTED',description:'기관·세력별 기록이 서로 충돌해 단일 결론을 내릴 수 없다.'},
    estimated:{label:'정보 추정',code:'ESTIMATED',description:'현재 수신 신호와 부분 자료로 재구성한 임시 판단이다.'}
  };

  const eras=[
    {id:'origin',index:'01',range:'1975–1982',title:'공간 개척과 전조',summary:'아마리온의 공간 연구가 F.H.C로 승계되고 비공개 감시가 시작된 시기.'},
    {id:'exposure',index:'02',range:'1986–1989',title:'교단 노출과 회수 작전',summary:'피의 호수와 도쿄 지부 기록을 통해 교단 침투가 개별 사고가 아님이 드러난 시기.'},
    {id:'institution',index:'03',range:'1993–1999',title:'공식 대응 체계와 모방',summary:'U.A.C가 공개되고 분류·봉쇄 체계가 만들어졌지만 대응기관도 적의 방식을 모방하기 시작한 시기.'},
    {id:'separation',index:'04',range:'2001–2003',title:'지휘권 분산과 도시 차단망',summary:'N.H.C와 S.I.D가 독립하고 국가별 현장 대응과 도시 봉쇄 인프라가 확장된 시기.'},
    {id:'fracture',index:'05',range:'2005–현재',title:'이탈·폭로·종결되지 않은 전쟁',summary:'현장조직의 재편, 레드울프 이탈과 위버멘시 폭로 뒤에도 전쟁이 끝나지 않은 시기.'}
  ];

  const records={
    '1975-09-12-amarion':{era:'origin',evidence:'confirmed',basis:'법인 설립 자료와 F.H.C 승계 기록이 일치한다.',sourceState:'기관 연혁 / 후대 대조 완료'},
    '1975-distortion-system':{era:'origin',evidence:'disputed',basis:'시스템 실행과 교단 활동 증가의 시점은 겹치지만 인과관계는 입증되지 않았다.',sourceState:'후대 분석 / 원 실험기록 결손'},
    '1982-03-22-fhc':{era:'origin',evidence:'confirmed',basis:'설립일과 아마리온 인력·연구자료의 이동이 현재 정사에 등록돼 있다.',sourceState:'기관 연혁 / 승계 기록'},
    '1982-uac-watch':{era:'origin',evidence:'testimony',basis:'레스작의 비인가 감시망은 관계자 기억 누락과 제한된 현장 증언으로만 복원된다.',sourceState:'비공개 증언 / 지휘기록 결손'},
    '1986-07-25-immortality':{era:'exposure',evidence:'observed',basis:'보호 기록에 작전 흔적이 남아 있으나 현장 위치와 일부 인원 정보가 검열돼 있다.',sourceState:'보호 원문 / 현장 회수본'},
    '1989-08-23-tokyo':{era:'exposure',evidence:'observed',basis:'교육자료와 피해 기록이 남아 있지만 F.H.C와 교단의 지휘 관계는 확정되지 않았다.',sourceState:'개인 기록 / 기관 대조'},
    '1993-11-02-uac':{era:'institution',evidence:'confirmed',basis:'공식 설립일과 독립기관 지위가 조직 정사 대장에 고정돼 있다.',sourceState:'공식 연혁 / 정사 고정'},
    '1993-syndicate':{era:'institution',evidence:'corroborated',basis:'국가·기업·이탈 인력 기록이 S.O.N의 분산 형성에 공통으로 나타난다.',sourceState:'다기관 정보 / 일부 지원망 검열'},
    '1995-03-20-tokyo-subway':{era:'institution',evidence:'corroborated',basis:'현장 교전은 복수 내부기록에 일치하지만 공식 조사에서는 삭제됐다.',sourceState:'비공개 작전기록 / 공개기록 불일치'},
    '1997-01-27-classification':{era:'institution',evidence:'confirmed',basis:'리버스와 괴이의 분류일 및 기준 문서가 현재 용어 체계에 연결된다.',sourceState:'분류 기준서 / 정사 고정'},
    '1999-07-12-ubermensch':{era:'institution',evidence:'corroborated',basis:'시설 자료와 이후 유출본이 불법 실험의 존재에 일치하나 전체 규모는 봉인됐다.',sourceState:'내부 승인자료 / 유출본'},
    '2001-07-21-independence':{era:'separation',evidence:'confirmed',basis:'N.H.C·S.I.D의 독립일과 U.A.C 지원 관계가 조직 정사에 고정돼 있다.',sourceState:'조직 개편 문서 / 정사 고정'},
    '2002-02-20-ground-forces':{era:'separation',evidence:'corroborated',basis:'협력국 장비 보급과 비협력권의 독자 대응 기록이 여러 기관에 남아 있다.',sourceState:'협력 협정 / 배치 기록'},
    '2003-02-05-city-barrier':{era:'separation',evidence:'confirmed',basis:'C.A.P-17과 C.I. 스캐너의 도시 배치 목적과 운용 주체가 확인된다.',sourceState:'장비 교범 / 도시 배치대장'},
    '2005-01-21-ash-crew':{era:'fracture',evidence:'confirmed',basis:'Ash Crew 편성과 A.R.F·C.P.D의 하위 배치가 현재 조직 정사에 고정돼 있다.',sourceState:'편제 기록 / 정사 고정'},
    '2005-09-01-red-wolf':{era:'fracture',evidence:'corroborated',basis:'N.H.C 손실기록과 S.O.N 인력자료가 레드울프 이탈에 일치한다.',sourceState:'양측 기록 대조 / 동기 일부 추정'},
    '2006-08-20-ubermensch-raid':{era:'fracture',evidence:'corroborated',basis:'실험체 회수와 자료 유출은 일치하지만 시설 좌표와 책임자 기록은 소실됐다.',sourceState:'습격 보고 / 회수자료 일부'},
    '2006-ongoing':{era:'fracture',evidence:'estimated',basis:'2006년 이후 사건은 분산된 전선 신호와 현재 작전자료를 통해 계속 갱신된다.',sourceState:'진행 중 정보 / 종결 기록 없음'}
  };

  const unresolved=[
    {id:'alt-japan-technology',scope:'세계사',label:'일본의 1980~90년대 기술 도약',reason:'도약의 시작 연도·핵심 기술·초상기술과의 인과가 아직 정사 데이터에 없다.'},
    {id:'post-2006-chronology',scope:'세계사',label:'2006년 이후 현재까지의 절대연도',reason:'북부 전선·남부 동원·데드존 사건의 상대 순서는 있으나 공통 달력이 확정되지 않았다.'},
    {id:'southern-geography',scope:'지리',label:'대흑림과 남방 데드존의 공식 경계',reason:'문화권과 작전권은 분리되지만 지도상의 행정·자연 경계가 고정되지 않았다.'},
    {id:'cult-lineage',scope:'세력',label:'혈교 남부권과 우시노다 세 파벌의 관계',reason:'동맹·계승·흡수 중 어느 관계인지 기록별 표현이 다르다.'},
    {id:'feral-origin',scope:'현상',label:'괴이·타락체·Corrupted Ferals의 기원 관계',reason:'동일 현상의 단계인지 서로 다른 계통인지 최종 분류가 없다.'}
  ];

  root.ProjectCurseWorldHistoryData=freeze({
    version:root.ProjectCurseBuild?.version||'5.36.0',
    eras,evidenceLevels,records,unresolved,
    getEra:id=>eras.find(era=>era.id===id)||null,
    getRecord:id=>records[id]||null,
    getEvidence:id=>evidenceLevels[id]||evidenceLevels.estimated
  });
})(window);
