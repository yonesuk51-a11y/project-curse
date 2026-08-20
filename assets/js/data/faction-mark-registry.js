// Project Curse 5.37.0 — canonical faction mark registry.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const common={
    source:'U.A.C 문양 감식 등록부',
    assetState:'기존 표식 / 재정비 예정',
    confidence:'B',
    usage:'조직 문서와 현장 장비에서 반복 확인',
    symbols:[]
  };

  const marks={
    uac:{
      ...common,name:'U.A.C',asset:'assets/faction_marks/uac.webp',type:'공식 기관 휘장',
      firstSeen:'1993.11.02',confidence:'A',usage:'국제 협정문·격리 명령·출입 인증',
      symbols:[
        {label:'중앙 흑원',text:'분류되지 않은 이상영역과 그 주위를 감시하는 통제망을 뜻한다.'},
        {label:'방사축',text:'국경과 관할을 넘어 뻗는 접근권을 표현한다.'}
      ]
    },
    nhc:{
      ...common,name:'N.H.C',asset:'assets/faction_marks/nhc.webp',type:'현장 부대 패치',
      firstSeen:'1993.11.02',confidence:'A',usage:'전투복·차량·봉쇄선 식별',
      symbols:[
        {label:'중앙 방어축',text:'현장을 관통해 방어선과 철수로를 유지하는 임무를 뜻한다.'},
        {label:'외곽환',text:'폐쇄된 작전권과 책임 구역을 표시한다.'}
      ]
    },
    sid:{
      name:'S.I.D',asset:'assets/faction_marks/sid.svg',legacyAsset:'assets/faction_marks/sid.webp',
      type:'공식 수사기관 휘장',source:'S.I.D 1993년 공식 등록본',assetState:'벡터 마스터 / 1차 재설계',
      firstSeen:'1993.11.02',confidence:'A',usage:'감식보고·증거봉투·도시 감청본부',accent:'#b8a16a',
      symbols:[
        {label:'이중 렌즈',text:'현장 증거와 변조 가능 기록을 따로 본 뒤 교차 검증하는 절차를 뜻한다.'},
        {label:'분할 프레임',text:'한 장면을 그대로 믿지 않고 출처와 시점을 나누어 조사한다는 표시다.'},
        {label:'중앙 증거점',text:'두 관측이 일치할 때만 사실로 등록되는 핵심 지점을 나타낸다.'}
      ],
      note:'구형 쌍두독수리 문장은 지역 본부가 사용한 비표준 변형으로 재분류됐다.'
    },
    fhc:{
      ...common,name:'F.H.C',asset:'assets/faction_marks/fhc.webp',type:'기업·연구부문 문장',
      firstSeen:'1982.03.22',confidence:'A',usage:'연구시설·보안구역·TAD 장비',
      symbols:[
        {label:'붉은 렌즈',text:'관측과 소유를 동시에 의미하는 연구부문의 핵심 상징이다.'},
        {label:'수직축',text:'현상을 기술과 자산으로 변환하는 연구 단계를 표현한다.'}
      ]
    },
    syndicate:{
      name:'S.O.N',asset:'assets/faction_marks/syndicate.svg',legacyAsset:'assets/faction_marks/syndicate.webp',
      type:'분산 연합 공통 표식',source:'압수 장비·은닉 거점 공통형 재구성',assetState:'벡터 마스터 / 1차 재설계',
      firstSeen:'1993년 이후',confidence:'B',usage:'스텐실·장비 인계표·비인가 방송',accent:'#bd383d',
      symbols:[
        {label:'파손된 외곽환',text:'U.A.C의 폐쇄된 통제권을 끊는다는 공통 목표를 뜻한다.'},
        {label:'절단축',text:'중앙 지휘와 단일 명령 체계를 거부한다는 표시다.'},
        {label:'외향 화살',text:'이탈자·정보·장비를 통제망 밖으로 이동시키는 분산 경로를 나타낸다.'}
      ],
      note:'중앙조직의 정식 휘장이 아니다. 계파마다 절단선과 외향 화살의 수가 다르다.'
    },
    ushinoda:{
      name:'우시노다교',asset:'assets/faction_marks/ushinoda.svg',legacyAsset:'assets/faction_marks/ushinoda.webp',
      type:'의식 공통문양',source:'다수 의식지의 반복 획을 대조한 감식 재구성',assetState:'벡터 마스터 / 종파 파생 준비',
      firstSeen:'기원 불명 / 1975년 이후 반복 확인',confidence:'C',usage:'의식진·피부 각인·봉인문·교재 여백',accent:'#b51f2e',
      symbols:[
        {label:'세 갈래 획',text:'타락교·혈교·그림자교로 갈라진 세 권능을 나타내는 것으로 추정된다.'},
        {label:'빈 중심',text:'신체·피·그림자 가운데 무엇이 그 자리를 채우는지에 따라 종파 변형이 생긴다.'},
        {label:'열린 하단',text:'리버스를 통해 인간과 공간의 경계를 바깥으로 흘려보내는 구조로 해석된다.'}
      ],
      note:'교단이 직접 승인한 공식 문양인지는 확인되지 않았다. 잘못된 획을 포함한 영상 자료도 존재한다.'
    },
    haimun:{
      name:'P.O.H',asset:'assets/faction_marks/haimun.svg',legacyAsset:'assets/faction_marks/haimun.webp',
      type:'비공식 운송 코드',source:'압수 송장·냉동차량·위장 진료소 공통형',assetState:'벡터 마스터 / 1차 재설계',
      firstSeen:'창설 시점 불명',confidence:'B',usage:'화물표·위조 신분 묶음·비인가 의료시설',accent:'#b37a45',
      symbols:[
        {label:'빈 화물칸',text:'운송 대상의 이름과 출발지를 기록하지 않는 거래 방식을 뜻한다.'},
        {label:'세 개의 유입로',text:'합법 사업체·하부 범죄조직·비인가 의료망이 하나의 경로로 합쳐지는 구조다.'},
        {label:'절취선',text:'인계가 끝나면 거래의 앞뒤를 분리해 추적을 어렵게 만드는 관행을 표시한다.'}
      ],
      note:'조직원은 이를 세력 문장으로 부르지 않는다. 합법 운송업체가 쓰는 유사 표식도 있어 단독 증거로 사용할 수 없다.'
    },
    ashcrew:{
      ...common,name:'Ash Crew',asset:'assets/faction_marks/ashcrew.webp',type:'현장 수습 패치',
      firstSeen:'2005.01.21',confidence:'A',usage:'회수복·유해 수습함·대피차량'
    },
    arf:{
      ...common,name:'A.R.F',asset:'assets/faction_marks/arf.webp',type:'회수조직 패치',
      firstSeen:'2005.01.21',confidence:'A',usage:'회수 장비·오염물 봉인함'
    },
    cpd:{
      ...common,name:'C.P.D',asset:'assets/faction_marks/cpd.webp',type:'민간선 식별 패치',
      firstSeen:'2005.01.21',confidence:'A',usage:'대피 회랑·선별소·인계 기록'
    },
    amarion:{
      ...common,name:'Amarion',asset:'assets/faction_marks/amarion.webp',type:'폐업 기업 문장',
      firstSeen:'1975.09.12',confidence:'A',usage:'공간 연구자료·구형 설비·승계 문서'
    }
  };

  root.ProjectCurseFactionMarks=freeze({
    version:'5.37.0',
    schema:'project-curse-faction-marks-v1',
    redesigned:['sid','syndicate','ushinoda','haimun'],
    marks
  });
})(window);
