// Project Curse 5.42.0 — Ushinoda cult lineage, command boundaries and evidence states.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const states={
    confirmed:{label:'계보 확정',tone:'confirmed',line:'solid'},
    disputed:{label:'계승 주장 / 미확정',tone:'disputed',line:'dashed'},
    split:{label:'지휘 이탈 확인',tone:'split',line:'broken'},
    exception:{label:'예외개체',tone:'exception',line:'double'}
  };

  const nodes={
    ushinoda:{
      name:'우시노다교',short:'공통 교단',kind:'근원 교단',state:'confirmed',command:'단일 중앙지휘 미확인',
      summary:'타락교·혈교·그림자교 세 종파를 한 이름 아래 묶는 교단 계통. 세 종파가 있다는 것과 자리 수는 확정됐다. 그러나 모든 현장 명령이 한 중앙에서 나오는지는 확인되지 않았다.',
      history:['1986-02-01-immortality','1989-08-23-tokyo','2024-03-17-ushinoda-fabrication']
    },
    'corruption-cult':{
      name:'타락교',short:'신체 계통',kind:'정식 종파',state:'confirmed',command:'교리상 로드좌 1 / 사도석 4',
      summary:'몸과 몸속 구조가 타락하는 것을 권능과 의식의 중심에 두는 우시노다의 정식 종파.',
      history:['1989-08-23-tokyo','2024-03-17-ushinoda-fabrication']
    },
    'blood-cult':{
      name:'혈교',short:'혈액 계통',kind:'정식 종파',state:'confirmed',command:'교리상 로드좌 1 / 사도석 4',
      summary:'피와 희생, 생명을 매개로 움직이는 우시노다의 정식 종파. 남방 혈맹이 이어받았다는 주장은 따로 판정한다.',
      history:['1986-02-01-immortality','2024-03-17-ushinoda-fabrication']
    },
    'shadow-cult':{
      name:'그림자교',short:'빙의 계통',kind:'정식 종파',state:'confirmed',command:'교리상 로드좌 1 / 사도석 4',
      summary:'그림자와 빙의, 사람으로 꾸민 개체를 권능과 숨어드는 수단으로 쓰는 우시노다의 정식 종파.',
      history:['1989-08-23-tokyo','2024-03-17-ushinoda-fabrication']
    },
    'first-apostle':{
      name:'첫 번째 사도',short:'삼권능 예외',kind:'예외개체 / 세력 아님',state:'exception',command:'교단 정원 밖 별도 판정',
      summary:'교단이 세워지기 전부터 있었다고 기록된다. 타락·혈액·그림자 세 권능을 모두 쓰는 단 하나의 사도다. 종파나 지역 지부로 분류하지 않는다.',
      history:['1975-09-12-amarion','2024-03-17-ushinoda-fabrication']
    },
    'southern-blood':{
      name:'남방 혈맹',short:'남방권 전시망',kind:'지역 전시 연합',state:'disputed',command:'혈맹 지휘부 / 계승 관계 미확정',
      summary:'남방권 해안의 교단과 무장세력을 충성으로 묶은 전쟁 때의 지휘 체계. 혈교의 후계라고 주장한다. 동맹인지, 계승인지, 흡수인지는 확정되지 않았다.',
      history:['2016-02-21-blood-cult-atlantic-schism','2026-08-20-northern-reversal','2027-11-02-southern-allegiance','2028-07-25-mass-summoning-rehearsal','2030-01-17-broken-crown']
    },
    'deadzone-blood':{
      name:'데드존 혈교',short:'순례자 보호파',kind:'지역 자치 분파',state:'split',command:'2016년 이후 혈맹 명령 불인정',
      summary:'중립국 순례자를 돕고 함께 살자고 주장하는 데드존 계통. 2016년 혈맹 지휘부와 공개적으로 갈라섰다. 문양과 의례가 같다고 해서 같은 명령망이라고 볼 수는 없다.',
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
    '1986-02-01-immortality':{date:'1986.02.01',title:'「불멸을 향하여」 작전'},
    '1989-08-23-tokyo':{date:'1989.08.23',title:'도쿄 지부 기록'}
  };

  root.ProjectCurseFactionLineage=freeze({
    version:root.ProjectCurseBuild?.version||'5.42.0',
    schema:'project-curse-faction-lineage-v1',
    root:'ushinoda',
    order:['ushinoda','corruption-cult','blood-cult','shadow-cult','first-apostle','southern-blood','deadzone-blood'],
    sects:['corruption-cult','blood-cult','shadow-cult'],
    states,nodes,edges,historyMeta,
    rules:[
      '우시노다의 정식 종파는 타락교·혈교·그림자교 세 곳뿐이다.',
      '각 종파는 교리상 로드좌 1석과 사도석 4석을 주장한다. 자리가 비거나 한 자리를 여럿이 주장하기도 해서, 실제 인원수와는 다를 수 있다.',
      '센티넬은 계급이 아니라, 로드좌를 주장하는 자에게 딸린 호위·전투·처형 전력이다.',
      '첫 번째 사도는 교단이 세워지기 전부터 있던 예외개체다. 세 권능을 모두 쓴다.',
      '남방 혈맹이 혈교를 이어받았다는 주장은 아직 확정되지 않았다. 데드존 혈교는 2016년 이후 혈맹의 지휘와 따로 본다.'
    ],
    unresolved:[
      {id:'cult-lineage',label:'남방 혈맹의 정통 계승 여부',text:'기록마다 동맹, 계승, 흡수라고 쓰는 말이 다르다. 그래서 계보선은 주장으로만 둔다.'},
      {id:'deadzone-origin',label:'데드존 혈교의 최초 설립 계통',text:'혈맹의 지휘에서 떨어져 나온 날짜는 확인됐다. 그 전에 누가 세웠는지, 혈교가 직접 명령했는지는 확인되지 않았다.'}
    ],
    getNode:id=>nodes[id]||null,
    getEdges:id=>edges.filter(edge=>edge.from===id||edge.to===id)
  });
})(window);
