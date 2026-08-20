// Project Curse 5.38.0 — canonical faction mark and cult-derivative registry.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const common={
    source:'U.A.C 문양 감식 등록부',
    assetState:'벡터 마스터 / 2차 통일',
    confidence:'B',
    usage:'조직 문서와 현장 장비에서 반복 확인',
    symbols:[]
  };

  const marks={
    uac:{
      ...common,name:'U.A.C',asset:'assets/faction_marks/uac.svg',legacyAsset:'assets/faction_marks/uac.webp',type:'공식 기관 휘장',
      firstSeen:'1993.11.02',confidence:'A',usage:'국제 협정문·격리 명령·출입 인증',accent:'#9b3037',
      symbols:[
        {label:'중앙 흑원',text:'분류되지 않은 이상영역과 그 주위를 감시하는 통제망을 뜻한다.'},
        {label:'이중 격리환',text:'공개 행정권과 봉인된 비공개 대응권이 겹쳐 작동하는 구조를 나타낸다.'},
        {label:'네 접근축',text:'국경과 관할을 넘어 정보·인력·자산과 통행권을 연결한다는 의미다.'}
      ],
      note:'구형 날개·용 장식형 문장은 초기 국제 홍보물의 확대형으로 보존되며 현재 단말에서는 간소화 등록본을 사용한다.'
    },
    nhc:{
      ...common,name:'N.H.C',asset:'assets/faction_marks/nhc.svg',legacyAsset:'assets/faction_marks/nhc.webp',type:'현장 부대 패치',
      firstSeen:'1993.11.02',confidence:'A',usage:'전투복·차량·봉쇄선 식별',accent:'#a92f37',
      symbols:[
        {label:'중앙 방어축',text:'현장을 관통해 방어선과 철수로를 유지하는 임무를 뜻한다.'},
        {label:'좌우 회랑',text:'교전선 양쪽에서 진입로와 철수로를 동시에 확보하는 현장 원칙을 표현한다.'},
        {label:'네 임무점',text:'전투·구조·봉쇄·철수의 네 현장 판단을 표시한다.'}
      ],
      note:'구형 원형 패치의 중앙 창과 네 별을 유지하면서 작은 장비 표식에서 뭉개지던 내부 선을 정리했다.'
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
      ...common,name:'F.H.C',asset:'assets/faction_marks/fhc.svg',legacyAsset:'assets/faction_marks/fhc.webp',type:'기업 연구부문 문장',
      firstSeen:'1982.03.22',confidence:'A',usage:'연구시설·보안구역·TAD 내부 장비',accent:'#b43139',
      symbols:[
        {label:'붉은 렌즈',text:'관측과 소유를 동시에 의미하는 연구부문의 핵심 상징이다.'},
        {label:'육각 연구틀',text:'현상을 분해·측정하고 재현 가능한 공정 안에 가두려는 기업 원칙을 뜻한다.'},
        {label:'세 자산점',text:'표본·기술·계약을 하나의 연구축에 등록하는 내부 분류를 나타낸다.'}
      ],
      note:'이 문장은 내부 연구부문 등록본이다. 민간 사업장에서는 붉은 렌즈와 외곽 계측선을 제거한 공개형이 사용될 수 있다.'
    },
    syndicate:{
      name:'S.O.N',asset:'assets/faction_marks/syndicate.svg',legacyAsset:'assets/faction_marks/syndicate.webp',
      type:'분산 연합 공통 표식',source:'압수 장비·은닉 거점 공통형 재구성',assetState:'벡터 마스터 / 통합 등록',
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
    'corruption-cult':{
      name:'타락교',asset:'assets/faction_marks/corruption-cult.svg',type:'종파 의식문양 / 감식 재구성',source:'생체 의식지·Flesh Path 교재 반복획',assetState:'파생 벡터 / 현장형 통합',
      firstSeen:'1989.08.23 이전',confidence:'B',usage:'신체 의식진·교재·피부 각인',accent:'#a62c36',
      symbols:[
        {label:'비대칭 생체 가지',text:'같은 몸에서도 통제되지 않는 타락과 증식을 뜻한다.'},
        {label:'세 갈래 공통축',text:'우시노다 공통문양에서 파생된 정식 종파임을 표시한다.'},
        {label:'열린 성장점',text:'완성된 신체보다 계속 재작성되는 육체를 신앙 대상으로 삼는다는 해석이다.'}
      ],note:'지역 의식마다 가지 수가 다르다. 이 등록본은 반복 빈도가 높은 세 성장점을 남긴 감식용 통합형이다.'
    },
    'blood-cult':{
      name:'혈교',asset:'assets/faction_marks/blood-cult.svg',type:'종파 의식문양 / 감식 재구성',source:'피의 호수·Blood Path 교재·의식 저장소',assetState:'파생 벡터 / 중앙 종파 추정형',
      firstSeen:'1986.07.25 이전',confidence:'B',usage:'혈액 의식진·저장용기·교재',accent:'#ac2431',
      symbols:[
        {label:'닫힌 혈액 방울',text:'피를 소모품이 아니라 기억과 통로를 보존하는 그릇으로 본다.'},
        {label:'좌우 유입축',text:'희생자와 의식자가 같은 혈액 좌표에 묶이는 구조를 나타낸다.'},
        {label:'하부 결속점',text:'의식이 끝난 뒤에도 혈연과 기억의 연결이 남는다는 표시다.'}
      ],note:'남부·데드존 변형과 구분하기 위한 중앙 종파 감식형이다. 실제 교단 승인본 여부는 확인되지 않았다.'
    },
    'shadow-cult':{
      name:'그림자교',asset:'assets/faction_marks/shadow-cult.svg',type:'종파 의식문양 / 감식 재구성',source:'빙의 현장·반사면 기록·조작 영상 원본 대조',assetState:'파생 벡터 / 이중 노출형',
      firstSeen:'1989.08.23 이전',confidence:'C',usage:'잠복 거점·무광 봉인문·빙의 표식',accent:'#6e7883',
      symbols:[
        {label:'어긋난 두 축',text:'몸과 그 몸을 대신하는 그림자가 완전히 일치하지 않는 상태를 뜻한다.'},
        {label:'끊긴 외곽환',text:'관측자의 시선이 이어지지 않는 순간에 잠복 경로가 열린다는 해석이다.'},
        {label:'공유 하부점',text:'서로 다른 신원 기록이 하나의 개체로 수렴하는 감식 흔적을 나타낸다.'}
      ],note:'그림자교가 의도적으로 틀린 획을 유포한 사례가 있어 신뢰도 C를 유지한다.'
    },
    'first-apostle':{
      name:'첫 번째 사도',asset:'assets/faction_marks/first-apostle.svg',type:'예외개체 감식 표상',source:'교단 기원 기록·세 권능 출현 보고의 교차 재구성',assetState:'분석용 벡터 / 공식 문양 아님',
      firstSeen:'교단 창설 이전 기록',confidence:'D',usage:'예외개체 문서·세 권능 동시 출현 경고',accent:'#af2633',
      symbols:[
        {label:'닫힌 이중환',text:'세 종파의 현재 정원 밖에서 독립적으로 판정해야 하는 존재임을 뜻한다.'},
        {label:'삼권능 중첩',text:'신체 가지·혈액 방울·그림자 절단선이 한 중심을 공유한다.'},
        {label:'상부 선행점',text:'현존 교단보다 먼저 존재했다는 기록을 연대축 위에 표시한다.'}
      ],note:'이 표상은 현장 식별을 위한 U.A.C 분석 기호다. 첫 번째 사도가 직접 사용한 휘장으로 제시하지 않는다.'
    },
    'southern-blood':{
      name:'남부 혈교',asset:'assets/faction_marks/southern-blood.svg',type:'지역 전시지휘 문양',source:'남부 감청문·소환 앵커·성위대 침투 장비',assetState:'파생 벡터 / 작전형 통합',
      firstSeen:'2016.02.21 이전',confidence:'B',usage:'충성 서약·작전표·도시 소환 앵커',accent:'#ae2330',
      symbols:[
        {label:'뒤집힌 전시 왕관',text:'교회와 성채를 종교국가가 아닌 임시 전시 지휘망 아래 묶는다는 뜻이다.'},
        {label:'폐쇄된 혈액핵',text:'자원과 의식 재료를 남부 지휘부가 통제하는 구조를 나타낸다.'},
        {label:'세 작전축',text:'해안 보급·도시 소환·성위대 침투를 하나의 일정표로 연결한다.'}
      ],note:'우시노다 혈교의 정통 휘장으로 판정되지 않았다. 계승 주장을 시각화한 지역 작전형이다.'
    },
    'deadzone-blood':{
      name:'데드존 혈교',asset:'assets/faction_marks/deadzone-blood.svg',type:'지역 자치분파 문양',source:'순례자 숙영지·구호표식·2016년 결별문',assetState:'파생 벡터 / 열린 회랑형',
      firstSeen:'2016.02.21 이전',confidence:'B',usage:'순례로·응급 숙영지·남부 명령 거부문',accent:'#9f3340',
      symbols:[
        {label:'열린 혈액 방울',text:'혈액 의례를 유지하면서도 남부의 폐쇄 지휘를 거부한다는 표시다.'},
        {label:'관통 순례로',text:'중립 순례자에게 이동과 귀환의 가능성을 남겨두는 현장 원칙을 뜻한다.'},
        {label:'두 피난 거점',text:'교단 구성원과 외부 생존자가 제한적으로 같은 보호선을 쓸 수 있음을 나타낸다.'}
      ],note:'구조 행위가 확인된 거점의 공통형이다. 이 표식만으로 안전이나 우호를 보증할 수 없다.'
    },
    haimun:{
      name:'P.O.H',asset:'assets/faction_marks/haimun.svg',legacyAsset:'assets/faction_marks/haimun.webp',
      type:'비공식 운송 코드',source:'압수 송장·냉동차량·위장 진료소 공통형',assetState:'벡터 마스터 / 통합 등록',
      firstSeen:'창설 시점 불명',confidence:'B',usage:'화물표·위조 신분 묶음·비인가 의료시설',accent:'#b37a45',
      symbols:[
        {label:'빈 화물칸',text:'운송 대상의 이름과 출발지를 기록하지 않는 거래 방식을 뜻한다.'},
        {label:'세 개의 유입로',text:'합법 사업체·하부 범죄조직·비인가 의료망이 하나의 경로로 합쳐지는 구조다.'},
        {label:'절취선',text:'인계가 끝나면 거래의 앞뒤를 분리해 추적을 어렵게 만드는 관행을 표시한다.'}
      ],
      note:'조직원은 이를 세력 문장으로 부르지 않는다. 합법 운송업체가 쓰는 유사 표식도 있어 단독 증거로 사용할 수 없다.'
    },
    ashcrew:{
      ...common,name:'Ash Crew',asset:'assets/faction_marks/ashcrew.svg',legacyAsset:'assets/faction_marks/ashcrew.webp',type:'현장 수습 패치',
      firstSeen:'2005.01.21',confidence:'A',usage:'회수복·유해 수습함·대피차량',accent:'#a93438',
      symbols:[
        {label:'인식표',text:'전투가 끝난 뒤에도 이름과 인계 기록을 남긴다는 조직의 원칙을 뜻한다.'},
        {label:'잔불',text:'완전히 끝나지 않은 오염과 아직 살아 있을 가능성을 동시에 나타낸다.'},
        {label:'교차 회수구',text:'시신·생존자·유품을 전투선 밖으로 옮기는 사후 대응 임무를 표현한다.'}
      ],
      note:'구형 관과 불꽃의 핵심은 유지하되 자수 패치에서 식별되지 않던 집게와 배경 질감을 단순화했다.'
    },
    arf:{
      ...common,name:'A.R.F',asset:'assets/faction_marks/arf.svg',legacyAsset:'assets/faction_marks/arf.webp',type:'회수조직 패치',
      firstSeen:'2005.01.21',confidence:'A',usage:'회수 장비·오염물 봉인함',accent:'#a82f36',
      symbols:[
        {label:'삼각 회수틀',text:'오염 구역 안의 대상을 세 지점에서 고정한 뒤 반출하는 절차를 뜻한다.'},
        {label:'균열 핵',text:'회수물이 자체적으로 파손·변형·오염될 수 있다는 경고 표시다.'},
        {label:'상부 견인고리',text:'현장 판단보다 안전한 인계와 봉인 상태 유지가 우선임을 나타낸다.'}
      ],
      note:'헬기·화물·대원 도상을 함께 사용하던 구형 패치를 회수 대상과 견인 절차 중심으로 재구성했다.'
    },
    cpd:{
      ...common,name:'C.P.D',asset:'assets/faction_marks/cpd.svg',legacyAsset:'assets/faction_marks/cpd.webp',type:'민간선 식별 패치',
      firstSeen:'2005.01.21',confidence:'A',usage:'대피 회랑·선별소·인계 기록',accent:'#6f858e',
      symbols:[
        {label:'열린 방패',text:'민간인을 수용하지만 통과 여부는 선별 절차 뒤에 결정된다는 의미다.'},
        {label:'세 인원점',text:'일반 피난민·노출 의심자·귀환자를 같은 선에서 구분하는 초기 분류를 뜻한다.'},
        {label:'분기 통로',text:'승인·격리·전문기관 인계로 갈라지는 세 결과를 표시한다.'}
      ],
      note:'구형 검문소 풍경을 제거하고 대피선에서 멀리서도 확인할 수 있는 방패·게이트·분기 구조만 남겼다.'
    },
    amarion:{
      ...common,name:'Amarion',asset:'assets/faction_marks/amarion.svg',legacyAsset:'assets/faction_marks/amarion.webp',type:'폐업 기업 문장',
      firstSeen:'1975.09.12',confidence:'A',usage:'공간 연구자료·구형 설비·승계 문서',accent:'#6c7f87',
      symbols:[
        {label:'삼각 좌표',text:'세 기준점으로 새로운 공간의 입구를 계산한다는 초기 연구 개념을 뜻한다.'},
        {label:'어긋난 중심축',text:'두 공간이 완전히 일치하지 않은 채 겹치는 저근접 자기 왜곡 상태를 나타낸다.'},
        {label:'세 관측점',text:'실험 장치·관측자·목표 공간을 분리해 기록하던 구형 연구 표기다.'}
      ],
      note:'1970년대 연구기업의 원형을 유지했다. F.H.C 문장은 이 삼각 좌표와 중심 계측축을 간접적으로 계승한다.'
    }
  };

  root.ProjectCurseFactionMarks=freeze({
    version:root.ProjectCurseBuild?.version||'5.38.0',
    schema:'project-curse-faction-marks-v1',
    redesigned:['uac','nhc','sid','fhc','syndicate','ushinoda','haimun','ashcrew','arf','cpd','amarion'],
    lineageMarks:['corruption-cult','blood-cult','shadow-cult','first-apostle','southern-blood','deadzone-blood'],
    marks
  });
})(window);
