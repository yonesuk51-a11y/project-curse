// Project Curse 5.41.0 — Ushinoda cult lineage, command boundaries and evidence states.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const states={
    confirmed:{label:'정사 확정',tone:'confirmed',line:'solid'},
    disputed:{label:'계승 주장 / 미확정',tone:'disputed',line:'dashed'},
    split:{label:'지휘 이탈 확인',tone:'split',line:'broken'},
    exception:{label:'예외개체',tone:'exception',line:'double'}
  };

  const nodes={
    ushinoda:{
      name:'우시노다교',short:'공통 교단',kind:'근원 교단',state:'confirmed',command:'단일 중앙지휘 미확인',
      summary:'타락교·혈교·그림자교라는 세 종파를 공유 명칭 아래 묶는 교단 계통. 세 종파의 존재와 정원은 확정됐지만 모든 현장 명령이 하나의 중앙에서 나오는지는 확인되지 않았다.',
      history:['1986-07-25-immortality','1989-08-23-tokyo','2024-03-17-ushinoda-fabrication']
    },
    'corruption-cult':{
      name:'타락교',short:'신체 계통',kind:'정식 종파',state:'confirmed',command:'로드 1 / 사도 4',
      summary:'신체와 생체 구조의 타락을 권능과 의식의 중심에 두는 우시노다의 정식 종파.',
      history:['1989-08-23-tokyo','2024-03-17-ushinoda-fabrication']
    },
    'blood-cult':{
      name:'혈교',short:'혈액 계통',kind:'정식 종파',state:'confirmed',command:'로드 1 / 사도 4',
      summary:'혈액·희생·생명 매개를 중심으로 움직이는 우시노다의 정식 종파. 남부권의 계승 주장은 별도 판정 대상이다.',
      history:['1986-07-25-immortality','2024-03-17-ushinoda-fabrication']
    },
    'shadow-cult':{
      name:'그림자교',short:'빙의 계통',kind:'정식 종파',state:'confirmed',command:'로드 1 / 사도 4',
      summary:'그림자·빙의·인간 위장형 개체를 권능과 잠복 수단으로 사용하는 우시노다의 정식 종파.',
      history:['1989-08-23-tokyo','2024-03-17-ushinoda-fabrication']
    },
    'first-apostle':{
      name:'첫 번째 사도',short:'삼권능 예외',kind:'예외개체 / 세력 아님',state:'exception',command:'교단 정원 밖 별도 판정',
      summary:'교단 창설 이전부터 존재했다고 기록되며 타락·혈액·그림자 세 권능을 모두 사용하는 유일 사도. 종파나 지역 지부로 분류하지 않는다.',
      history:['1975-09-12-amarion','2024-03-17-ushinoda-fabrication']
    },
    'southern-blood':{
      name:'남부 혈교',short:'남부 전시망',kind:'지역 전시 연합',state:'disputed',command:'남부 지휘부 / 계승 관계 미확정',
      summary:'남부 해안권 교단과 무장세력을 충성망으로 묶은 전시 지휘체계. 우시노다 혈교의 후계임을 주장하지만 동맹·계승·흡수 중 어느 관계인지는 확정되지 않았다.',
      history:['2016-02-21-blood-cult-atlantic-schism','2026-08-20-northern-reversal','2027-11-02-southern-allegiance','2028-07-25-mass-summoning-rehearsal','2030-01-17-broken-crown']
    },
    'deadzone-blood':{
      name:'데드존 혈교',short:'순례자 보호파',kind:'지역 자치 분파',state:'split',command:'2016년 이후 남부 명령 불인정',
      summary:'중립국 순례자를 돕고 공존을 주장하는 데드존 계통. 2016년 남부 혈교 지휘부와 공개 결별했으며 같은 문양과 의례만으로 동일 명령망이라 판단할 수 없다.',
      history:['2016-02-21-blood-cult-atlantic-schism','2029-04-12-checkpoint-07']
    }
  };

  const edges=[
    {from:'ushinoda',to:'corruption-cult',state:'confirmed',label:'정식 종파'},
    {from:'ushinoda',to:'blood-cult',state:'confirmed',label:'정식 종파'},
    {from:'ushinoda',to:'shadow-cult',state:'confirmed',label:'정식 종파'},
    {from:'ushinoda',to:'first-apostle',state:'exception',label:'창설 이전 존재 기록'},
    {from:'blood-cult',to:'southern-blood',state:'disputed',label:'계승 주장 / 기록 상충'},
    {from:'southern-blood',to:'deadzone-blood',state:'split',label:'2016.02.21 공개 결별'}
  ];

  const historyMeta={
    '1975-09-12-amarion':{date:'1975.09.12',title:'아마리온 설립'},
    '1986-07-25-immortality':{date:'1986.07.25',title:'「불멸을 향하여」 작전'},
    '1989-08-23-tokyo':{date:'1989.08.23',title:'도쿄 지부 기록'}
  };

  root.ProjectCurseFactionLineage=freeze({
    version:root.ProjectCurseBuild?.version||'5.41.0',
    schema:'project-curse-faction-lineage-v1',
    root:'ushinoda',
    order:['ushinoda','corruption-cult','blood-cult','shadow-cult','first-apostle','southern-blood','deadzone-blood'],
    sects:['corruption-cult','blood-cult','shadow-cult'],
    states,nodes,edges,historyMeta,
    rules:[
      '우시노다의 정식 종파는 타락교·혈교·그림자교 세 곳뿐이다.',
      '각 종파는 로드 1명과 사도 4명을 둔다. 센티넬은 계급이 아니라 로드 귀속 자산이다.',
      '첫 번째 사도는 교단 창설 이전 예외개체이며 세 권능을 모두 사용한다.',
      '남부 혈교의 우시노다 혈교 계승 주장은 미확정이다. 데드존 혈교는 2016년 이후 남부 지휘와 분리한다.'
    ],
    unresolved:[
      {id:'cult-lineage',label:'혈교 남부권의 정통 계승 여부',text:'동맹·계승·흡수라는 세 표현이 기록마다 달라 계보선은 주장 상태로 유지한다.'},
      {id:'deadzone-origin',label:'데드존 혈교의 최초 설립 계통',text:'남부 지휘에서 이탈한 날짜는 확인됐지만, 그 이전의 설립 주체와 우시노다 중앙 혈교의 직접 명령 여부는 확인되지 않았다.'}
    ],
    getNode:id=>nodes[id]||null,
    getEdges:id=>edges.filter(edge=>edge.from===id||edge.to===id)
  });
})(window);
