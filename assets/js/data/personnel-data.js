// Project Curse 5.54.0 — world-first personnel registry with canon-facing revision overlays.
(function(root){
  'use strict';

  const profileSource=root.ProjectCursePersonnelProfiles;
  const remakeSource=root.ProjectCursePersonnelRemake;

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const legacyGroups=[
    {id:'personal',label:'개인·민간 관계자',short:'개인',code:'CIV',tone:'civilian',factionKeys:[]},
    {id:'alma',label:'알마 가문',short:'알마',code:'ALM',tone:'family',factionKeys:[]},
    {id:'fhc-union',label:'F.H.C-유니온',short:'유니온',code:'FUN',tone:'corporate',factionKeys:['fhc']},
    {id:'fhc-ark',label:'F.H.C-아크',short:'아크',code:'FAR',tone:'corporate',factionKeys:['fhc']},
    {id:'nhc',label:'N.H.C',short:'N.H.C',code:'NHC',tone:'field',factionKeys:['nhc']},
    {id:'uac',label:'U.A.C',short:'U.A.C',code:'UAC',tone:'institution',factionKeys:['uac']},
    {id:'sid-us',label:'S.I.D 미국 지부',short:'S.I.D',code:'SID',tone:'institution',factionKeys:['sid']},
    {id:'syndicate',label:'신디케이트',short:'신디케이트',code:'SYN',tone:'rogue',factionKeys:['syndicate']},
    {id:'ushinoda',label:'우시노다교',short:'우시노다',code:'USH',tone:'cult',factionKeys:['ushinoda']},
    {id:'haiman',label:'하이문',short:'하이문',code:'HYM',tone:'rogue',factionKeys:['haimun']}
  ];
  const groups=legacyGroups.map(group=>({...group,...(remakeSource?.groupOverrides?.[group.id]||{})}));

  const statuses={
    active:{label:'활동 기록',tone:'active'},
    deceased:{label:'사망 기재',tone:'deceased'},
    unknown:{label:'상태 미확인',tone:'unknown'}
  };

  const certainties={
    listed:{label:'명단 기재',tone:'listed'},
    partial:{label:'부분 확인',tone:'partial'},
    unresolved:{label:'해석 보류',tone:'unresolved'}
  };

  const legacyRecords=[
    {
      id:'tanaka-chihiro',name:'타나카 치히로',group:'personal',role:'시립 기록 복원관',status:'active',certainty:'partial',
      overview:'타나카 가문의 기록을 보존해 온 문서 기술자다.',
      relationships:[{target:'tanaka-yui',relation:'어머니',certainty:'partial'}],
      limits:['모녀 관계와 세부 경력은 보완 신원 기록에서 잠정 재구성됐다.']
    },
    {
      id:'tanaka-yui',name:'타나카 유이',group:'personal',role:'재난통신 정비사',status:'active',certainty:'partial',
      overview:'비상방송 장비를 수리하고 미등록 호출부호를 추적하는 기술자다.',
      relationships:[{target:'tanaka-chihiro',relation:'딸',certainty:'partial'},{target:'maya',relation:'현장 기록 협조',certainty:'partial'}],
      limits:['모녀 관계와 마야와의 협조 이력은 보완 신원 기록의 잠정 배치다.']
    },
    {
      id:'maya',name:'마야',group:'personal',role:'현장사진 기록원',status:'active',certainty:'partial',
      overview:'통제선 외곽의 첫 장면과 삭제 전 원본을 보존하는 독립 기록원이다.',
      relationships:[{target:'tanaka-yui',relation:'현장 기록 협조',certainty:'partial'}],
      limits:['전체 이름과 경력은 보완 신원 기록에서 확장됐다.']
    },
    {
      id:'jeong-ria',name:'정리아',group:'personal',role:'개인 관계자',status:'unknown',certainty:'partial',
      overview:'초기 명부에서 남매 관계 표기와 함께 남은 인물이다.',
      relationships:[{target:'ryu-youngho',relation:'남매 표기',certainty:'partial'}],
      limits:['류영호 외 다른 인물까지 남매 관계에 포함되는지는 불명이다.']
    },
    {
      id:'ryu-youngho',name:'류영호',group:'personal',role:'개인 관계자',status:'unknown',certainty:'partial',
      overview:'초기 명부에서 정리아와 인접한 남매 관계자로 기록된 인물이다.',
      relationships:[{target:'jeong-ria',relation:'남매 표기',certainty:'partial'}],
      limits:['관계의 정확한 범위와 소속·능력은 확인되지 않았다.']
    },
    {id:'sato-hajime',name:'사토 하지메',group:'personal',role:'전직 화재조사관',status:'active',certainty:'partial',overview:'비정상 화재와 의식 흔적을 감식하는 퇴직 조사관이다.',limits:['세부 경력은 보완 신원 기록에서 잠정 확장됐다.']},
    {id:'sasaki',name:'사사키',group:'personal',role:'의료표본 운송원',status:'active',certainty:'partial',overview:'봉인된 의료표본을 분석실로 운송하는 민간 계약자다.',limits:['전체 이름과 경력은 보완 신원 기록에서 잠정 확장됐다.']},
    {
      id:'nina-gregory',name:'니나 그레고리',group:'personal',role:'기생생물학 고문',status:'active',certainty:'listed',
      overview:'예셀 그레고리의 어머니로 기재된 인물이다.',
      relationships:[{target:'yesel-gregory',relation:'어머니',certainty:'listed'}],
      limits:['소속, 능력과 현재 상태가 제공되지 않았다.']
    },
    {
      id:'yesel-gregory',name:'예셀 그레고리',group:'personal',role:'이상언어학 연구자',status:'active',certainty:'listed',
      overview:'니나 그레고리의 딸이며 의식문과 숙주 언어를 연구한다.',
      relationships:[{target:'nina-gregory',relation:'딸',certainty:'listed'}],
      limits:['연구 경력과 활동 이력은 보완 신원 기록에서 확장됐다.']
    },
    {id:'alma-damian',name:'알마 데미안',group:'alma',role:'가문 기록·재정 감사관',status:'active',certainty:'partial',overview:'알마 가문의 계약과 자금 이동을 추적하는 감사관이다.',relationships:[{target:'alma-wade',relation:'아들',certainty:'partial'},{target:'alma-koenig',relation:'형제',certainty:'partial'},{target:'alma-bennett',relation:'형제',certainty:'partial'},{target:'alma-griffon',relation:'형제',certainty:'partial'}],limits:['가족 구조와 직책은 보완 신원 기록에서 잠정 재구성됐다.']},
    {
      id:'alma-bennett',name:'알마 베넷',group:'alma',role:'격리구역 외상간호사',status:'active',certainty:'partial',
      overview:'격리구역에서 오염 상처를 치료하는 알마 가문의 의료인이다.',
      relationships:[{target:'alma-wade',relation:'딸',certainty:'partial'},{target:'alma-koenig',relation:'남매',certainty:'partial'},{target:'alma-damian',relation:'남매',certainty:'partial'},{target:'alma-griffon',relation:'남매',certainty:'partial'}],
      limits:['가족 구조와 의료 경력은 보완 신원 기록에서 잠정 재구성됐다.']
    },
    {
      id:'alma-griffon',name:'알마 그리폰',group:'alma',role:'격리설비 기술자',status:'active',certainty:'partial',
      overview:'격리문과 음압설비를 수리하는 알마 가문의 기술자다.',
      relationships:[{target:'alma-wade',relation:'아들',certainty:'partial'},{target:'alma-koenig',relation:'형제',certainty:'partial'},{target:'alma-damian',relation:'형제',certainty:'partial'},{target:'alma-bennett',relation:'남매',certainty:'partial'}],
      limits:['가족 구조와 기술 경력은 보완 신원 기록에서 잠정 재구성됐다.']
    },
    {
      id:'alma-wade',name:'알마 웨이드',group:'alma',role:'가문 의료관리자',status:'active',certainty:'partial',
      overview:'알마 가문의 의료기록과 노출 이력을 관리하는 의사다.',
      relationships:[{target:'alma-kara',relation:'딸',certainty:'partial'},{target:'alma-koenig',relation:'어머니',certainty:'partial'},{target:'alma-damian',relation:'어머니',certainty:'partial'},{target:'alma-bennett',relation:'어머니',certainty:'partial'},{target:'alma-griffon',relation:'어머니',certainty:'partial'}],
      limits:['가족 구조와 과거 계약은 보완 신원 기록에서 잠정 재구성됐다.']
    },
    {
      id:'alma-kara',name:'알마 카라',group:'fhc-union',secondaryGroups:['alma'],role:'유니온 원로고문',status:'active',certainty:'partial',
      overview:'F.H.C-유니온 초기 계약구조를 설계한 알마 가문의 원로다.',
      affiliations:[{key:'fhc',label:'F.H.C-유니온',role:'소속 인물',certainty:'listed'}],
      relationships:[{target:'alma-wade',relation:'어머니',certainty:'partial'},{target:'jake',relation:'경호 대상',certainty:'partial'}],
      limits:['가족 구조와 제이크의 전속계약은 보완 신원 기록에서 잠정 재구성됐다.']
    },
    {
      id:'jake',name:'제이크',group:'fhc-union',role:'경호원',status:'unknown',certainty:'listed',
      overview:'F.H.C-유니온 인물군에 경호원으로 기재된 인물이다.',
      affiliations:[{key:'fhc',label:'F.H.C-유니온',role:'경호원',certainty:'listed'}],
      relationships:[{target:'alma-kara',relation:'전담 경호',certainty:'partial'}],
      limits:['전체 이름과 경호 이력은 보완 신원 기록에서 확장됐다.']
    },
    {
      id:'alma-koenig',name:'알마 코니그',group:'fhc-union',secondaryGroups:['alma'],role:'본부장',status:'active',certainty:'listed',
      overview:'F.H.C-유니온 본부장이자 알마 가문의 장남으로 재정리된 인물이다.',
      affiliations:[{key:'fhc',label:'F.H.C-유니온',role:'본부장',certainty:'listed'}],
      relationships:[{target:'alma-wade',relation:'아들',certainty:'partial'},{target:'alma-kara',relation:'손자',certainty:'partial'},{target:'alma-damian',relation:'형제',certainty:'partial'},{target:'alma-bennett',relation:'남매',certainty:'partial'},{target:'alma-griffon',relation:'형제',certainty:'partial'}],
      limits:['가족 구조와 현시점 재임 여부는 보완 신원 기록에서 잠정 재구성됐다.']
    },
    {
      id:'ezekiel-kalp',name:'에제키엘 칼프',group:'fhc-ark',role:'아크의 보스',status:'active',certainty:'listed',
      overview:'F.H.C-아크의 보스로 기재된 인물이다.',
      affiliations:[{key:'fhc',label:'F.H.C-아크',role:'보스',certainty:'listed'}],
      limits:['능력, 지휘 범위와 유니온과의 관계는 제공되지 않았다.']
    },
    {
      id:'sakuma-yuta',name:'사쿠마 유타',aliases:['레드 마우스'],group:'fhc-ark',secondaryGroups:['haiman'],role:'U.A.C 정보원 / 하이문 리더',status:'active',certainty:'partial',
      overview:'F.H.C-아크 구간에서는 U.A.C 정보원으로, 하이문 구간에서는 “레드 마우스”라는 이름의 리더이자 오리진 실험체로 기재된다. 두 기록은 동일 인물을 가리키는 것으로 직접 연결되어 있다.',
      affiliations:[
        {key:'uac',label:'U.A.C',role:'정보원',certainty:'listed'},
        {key:'fhc',label:'F.H.C-아크',role:'잠입·전향 경위 미확인',certainty:'partial'},
        {key:'haimun',label:'하이문',role:'리더 / 레드 마우스',certainty:'listed'}
      ],
      capabilities:['겜블러 표기','오리진 실험체'],
      notes:['조국에 충성했으나 일종의 배신을 당해 돌아선 것으로 기재된다.','“진정한 힘을 목도한 주군을 모시기로 한다”는 동기 문구가 남아 있다.'],
      limits:['각 소속의 정확한 시간 순서와 “주군”의 신원은 확정되지 않았다.','겜블러 표기가 성향·전투 방식·능력 가운데 무엇을 뜻하는지 불명이다.']
    },
    {
      id:'karl-maxwell',name:'칼 맥스웰',group:'fhc-ark',role:'사냥꾼',status:'active',certainty:'listed',
      overview:'F.H.C-아크 소속 사냥꾼으로 기재된 인물이다.',
      affiliations:[{key:'fhc',label:'F.H.C-아크',role:'사냥꾼',certainty:'listed'}],equipment:['봉'],
      limits:['“봉”의 규격과 별도 능력은 제공되지 않았다.']
    },
    {
      id:'brian-alberoz',name:'브리안 알베로즈',group:'fhc-ark',role:'사냥꾼',status:'active',certainty:'listed',
      overview:'F.H.C-아크 소속 사냥꾼으로 기재된 인물이다.',
      affiliations:[{key:'fhc',label:'F.H.C-아크',role:'사냥꾼',certainty:'listed'}],equipment:['카드'],
      limits:['카드의 용도와 별도 능력은 제공되지 않았다.','제7사도 알베레즈와의 이름 유사성만으로 관계를 확정하지 않는다.']
    },
    {
      id:'yanami-shinka',name:'야나미 신카',group:'fhc-ark',role:'소속 인물',status:'deceased',certainty:'listed',
      overview:'F.H.C-아크 인물군에 사망자로 기재된 염동력 사용자다.',
      affiliations:[{key:'fhc',label:'F.H.C-아크',role:'소속 인물',certainty:'listed'}],capabilities:['염동력'],
      limits:['사망 시점·원인과 미즈미 야나미와의 관계는 확인되지 않았다.']
    },
    {id:'duka',name:'두카',group:'fhc-ark',role:'소속 인물',status:'deceased',certainty:'listed',overview:'F.H.C-아크 인물군에 사망자로 기재되어 있다.',affiliations:[{key:'fhc',label:'F.H.C-아크',role:'소속 인물',certainty:'listed'}],limits:['전체 이름, 역할, 능력과 사망 경위가 제공되지 않았다.']},
    {id:'reiki',name:'레이키',group:'fhc-ark',role:'소속 인물',status:'deceased',certainty:'listed',overview:'F.H.C-아크 인물군에 사망자로 기재되어 있다.',affiliations:[{key:'fhc',label:'F.H.C-아크',role:'소속 인물',certainty:'listed'}],limits:['전체 이름, 역할, 능력과 사망 경위가 제공되지 않았다.']},
    {id:'sebastian-clark',name:'세바스찬 클라크',group:'fhc-ark',role:'소속 인물',status:'unknown',certainty:'listed',overview:'F.H.C-아크 인물군에 이름이 남아 있는 인물이다.',affiliations:[{key:'fhc',label:'F.H.C-아크',role:'소속 인물',certainty:'listed'}],limits:['직책, 능력과 현재 상태가 제공되지 않았다.']},
    {
      id:'baranto',name:'바란토',group:'nhc',role:'국장',status:'active',certainty:'listed',
      overview:'N.H.C 국장으로 기재된 생기 사용자다.',
      affiliations:[{key:'nhc',label:'N.H.C',role:'국장',certainty:'listed'}],capabilities:['태양의 생기'],
      relationships:[{target:'yohan',relation:'수행비서',certainty:'listed'}],
      limits:['태양의 생기의 구체적인 발현·한계는 제공되지 않았다.']
    },
    {
      id:'yohan',name:'요한',group:'nhc',role:'국장의 수행비서',status:'active',certainty:'listed',
      overview:'N.H.C 국장 바란토의 수행비서로 기재된 생기 사용자다.',
      affiliations:[{key:'nhc',label:'N.H.C',role:'국장 수행비서',certainty:'listed'}],capabilities:['전격의 생기'],
      relationships:[{target:'baranto',relation:'수행 대상 / 국장',certainty:'listed'}],
      limits:['전격의 생기의 구체적인 발현·한계는 제공되지 않았다.']
    },
    {
      id:'roden',name:'로덴',group:'nhc',role:'현장요원',status:'active',certainty:'listed',
      overview:'괴이 기생수를 매개로 감각과 신체 성능을 확장하고 다른 생기를 모방하는 N.H.C 인물이다.',
      affiliations:[{key:'nhc',label:'N.H.C',role:'현장요원',certainty:'listed'}],
      capabilities:['괴이 기생수를 통한 초감각','가속화','약점 파악','생기 모방'],
      limits:['기생수의 기원, 통제 관계와 능력 모방 범위는 제공되지 않았다.']
    },
    {
      id:'mason',name:'메이슨',group:'nhc',role:'저격·암살·지원',status:'active',certainty:'listed',
      overview:'원거리 관측과 근접 암살, 전장 지원을 함께 수행하는 것으로 기재된 N.H.C 인물이다.',
      affiliations:[{key:'nhc',label:'N.H.C',role:'저격수 / 암살 및 지원',certainty:'listed'}],
      capabilities:['투시','초감각'],equipment:['저격 장비','쌍단검','와이어'],
      limits:['투시와 초감각의 범위 및 제약은 제공되지 않았다.']
    },
    {
      id:'kate',name:'케이트',group:'nhc',role:'돌격요원',status:'active',certainty:'listed',
      overview:'괴력과 빠른 이동을 기반으로 중장비 돌격을 수행하는 것으로 기재된 N.H.C 인물이다.',
      affiliations:[{key:'nhc',label:'N.H.C',role:'돌격요원',certainty:'listed'}],
      capabilities:['괴력','빠른 이동 속도'],equipment:['산탄총','방패','도끼'],
      limits:['능력의 발동 조건과 지속 한계는 제공되지 않았다.']
    },
    {
      id:'frux',name:'프룩스',group:'uac',role:'국장',status:'active',certainty:'listed',
      overview:'U.A.C 국장으로 기재된 부적 사용자다.',
      affiliations:[{key:'uac',label:'U.A.C',role:'국장',certainty:'listed'}],capabilities:['부적'],
      limits:['부적의 종류와 효과, 현시점 재임 여부는 제공되지 않았다.']
    },
    {
      id:'pierce',name:'피어스',group:'uac',role:'위원회 대표',status:'active',certainty:'listed',
      overview:'U.A.C 위원회 대표로 기재된 궁술 사용자다.',
      affiliations:[{key:'uac',label:'U.A.C',role:'위원회 대표',certainty:'listed'}],capabilities:['궁술'],
      relationships:[{target:'natalia',relation:'위원회 비서',certainty:'listed'}],
      limits:['위원회의 정확한 명칭과 궁술의 초자연적 성질 여부는 제공되지 않았다.']
    },
    {
      id:'natalia',name:'나탈리아',group:'uac',role:'위원회 비서 / 정보원',status:'active',certainty:'listed',
      overview:'U.A.C 위원회 비서이자 정보원으로 기재된 인물이다.',
      affiliations:[{key:'uac',label:'U.A.C',role:'위원회 비서 / 정보원',certainty:'listed'}],
      relationships:[{target:'pierce',relation:'보좌 대상 / 위원회 대표',certainty:'listed'}],
      limits:['정보 활동의 대상과 별도 능력은 제공되지 않았다.']
    },
    {
      id:'aaron-uac',name:'아론',group:'uac',role:'소속 전투원',status:'active',certainty:'listed',
      overview:'U.A.C 인물군에 쌍창 사용자로 기재된 인물이다.',
      affiliations:[{key:'uac',label:'U.A.C',role:'소속 전투원',certainty:'listed'}],capabilities:['쌍창'],
      relationships:[{target:'aaron-syndicate',relation:'동명이인 또는 동일 인물 여부 미확인',certainty:'unresolved'}],
      limits:['신디케이트의 아론과 동일 인물인지 확인되지 않았다.']
    },
    {id:'grinch',name:'그린치',group:'uac',role:'소속 인물',status:'unknown',certainty:'listed',overview:'U.A.C 인물군에 이름이 남아 있다.',affiliations:[{key:'uac',label:'U.A.C',role:'소속 인물',certainty:'listed'}],limits:['직책, 능력과 현재 상태가 제공되지 않았다.']},
    {id:'frost',name:'프로스트',group:'uac',role:'소속 인물',status:'unknown',certainty:'listed',overview:'U.A.C 인물군에 이름이 남아 있다.',affiliations:[{key:'uac',label:'U.A.C',role:'소속 인물',certainty:'listed'}],limits:['직책, 능력과 현재 상태가 제공되지 않았다.']},
    {
      id:'casper',name:'캐스퍼',group:'sid-us',role:'타이런트',status:'active',certainty:'listed',
      overview:'S.I.D 미국 지부의 타이런트로 기재된 채찍검 사용자다.',
      affiliations:[{key:'sid',label:'S.I.D 미국 지부',role:'타이런트',certainty:'listed'}],capabilities:['후속타 트리거'],equipment:['채찍검'],
      limits:['타이런트의 계급·규격과 후속타 트리거의 작동 조건은 제공되지 않았다.']
    },
    {
      id:'natsume',name:'나츠메',group:'sid-us',role:'타이런트',status:'active',certainty:'listed',
      overview:'S.I.D 미국 지부의 타이런트로 기재된 부적 사용자다.',
      affiliations:[{key:'sid',label:'S.I.D 미국 지부',role:'타이런트',certainty:'listed'}],capabilities:['부적을 통한 이동 제한','부적 부비트랩'],
      limits:['부적의 설치 조건과 이동 제한 범위는 제공되지 않았다.']
    },
    {
      id:'dennis',name:'데니스',group:'sid-us',role:'타이런트',status:'active',certainty:'partial',
      overview:'S.I.D 미국 지부의 타이런트로 기재되었으나 능력 메모가 미완성 상태다.',
      affiliations:[{key:'sid',label:'S.I.D 미국 지부',role:'타이런트',certainty:'listed'}],capabilities:['초감각 더미 — 표기 미완'],
      limits:['“초감각더미/” 이후의 원문이 누락되어 능력 기능을 확정할 수 없다.']
    },
    {
      id:'alma-millen',name:'알마 밀렌',group:'syndicate',role:'요원',status:'active',certainty:'listed',
      overview:'신디케이트 요원으로 기재된 알마 성씨의 인물이다.',
      affiliations:[{key:'syndicate',label:'신디케이트',role:'요원',certainty:'listed'}],capabilities:['무형 이계'],
      limits:['알마 가문과의 혈연 여부, 무형 이계의 작동 방식은 제공되지 않았다.']
    },
    {
      id:'violet',name:'바이올렛',group:'syndicate',role:'정보원',status:'active',certainty:'listed',
      overview:'신디케이트 정보원으로 기재된 인물이다.',
      affiliations:[{key:'syndicate',label:'신디케이트',role:'정보원',certainty:'listed'}],
      limits:['전체 이름, 능력과 정보 활동 범위가 제공되지 않았다.']
    },
    {
      id:'aaron-syndicate',name:'아론',group:'syndicate',role:'소속 전투원',status:'active',certainty:'listed',
      overview:'신디케이트 인물군에 창술 사용자로 기재된 인물이다.',
      affiliations:[{key:'syndicate',label:'신디케이트',role:'소속 전투원',certainty:'listed'}],capabilities:['창술'],
      relationships:[{target:'aaron-uac',relation:'동명이인 또는 동일 인물 여부 미확인',certainty:'unresolved'}],
      limits:['U.A.C의 아론과 동일 인물인지 확인되지 않았다.']
    },
    {
      id:'saxon',name:'작센',group:'syndicate',role:'소속 인물',status:'active',certainty:'listed',
      overview:'신디케이트 인물군에 투시 사용자로 기재된 인물이다.',
      affiliations:[{key:'syndicate',label:'신디케이트',role:'소속 인물',certainty:'listed'}],capabilities:['투시'],
      limits:['투시의 범위와 역할이 제공되지 않았다.']
    },
    {
      id:'isaac',name:'아이작',group:'syndicate',role:'소속 인물',status:'active',certainty:'listed',
      overview:'신디케이트 인물군에 괴력 사용자로 기재된 인물이다.',
      affiliations:[{key:'syndicate',label:'신디케이트',role:'소속 인물',certainty:'listed'}],capabilities:['괴력'],
      limits:['괴력의 발현 조건과 역할이 제공되지 않았다.']
    },
    {
      id:'mizumi-yanami',name:'미즈미 야나미',group:'ushinoda',role:'혈교 교주',status:'active',certainty:'listed',
      overview:'우시노다교 인물군에서 혈교 교주로 기재된 혈술 사용자다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'소속 기록',certainty:'listed'},{key:'blood-cult',label:'혈교',role:'교주',certainty:'listed'}],
      capabilities:['혈술 이동기','혈술 탄도 발사','혈술 강화','피의 강 — 결계'],
      limits:['야나미 신카와의 관계는 성씨만으로 확정하지 않는다.','피의 강의 범위와 대가는 제공되지 않았다.']
    },
    {
      id:'ramus-manson',name:'라무스 맨슨',group:'ushinoda',role:'타락교 교주',status:'active',certainty:'partial',
      overview:'우시노다교 인물군에서 타락교 교주로 기재된 인물이다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'소속 기록',certainty:'listed'},{key:'corruption-cult',label:'타락교',role:'교주',certainty:'listed'}],capabilities:['미확인'],
      limits:['능력과 세부 활동이 물음표로 남아 있다.']
    },
    {
      id:'apostle-luke-eugene',name:'루크 유진',group:'ushinoda',role:'제1석 주장자',status:'active',certainty:'listed',
      overview:'우시노다교 제1석 주장자로 기재된 복합 능력 사용자다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'제1석 주장자',certainty:'listed'}],
      capabilities:['기술 모방 — 그림자·타락·혈액','제6안','예지'],
      limits:['사도 번호가 강함의 순위를 뜻하는지는 확인되지 않았다.','각 모방 능력의 범위와 제6안의 기능은 제공되지 않았다.']
    },
    {
      id:'apostle-urzag',name:'우르자그',group:'ushinoda',role:'제2사도',status:'active',certainty:'listed',
      overview:'우시노다교 제2사도로 기재된 육체 강탈·변형 계열 능력자다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'제2사도',certainty:'listed'}],
      capabilities:['육체 강탈','괴력','초재생','신체 변형'],
      limits:['육체 강탈의 조건과 현재 육체의 신원이 제공되지 않았다.']
    },
    {
      id:'apostle-jade-jackson',name:'제이드 잭슨',group:'ushinoda',role:'제3사도',status:'active',certainty:'listed',
      overview:'우시노다교 제3사도로 기재된 그림자·공간·침투 계열 능력자다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'제3사도',certainty:'listed'}],
      capabilities:['그림자를 통한 공간술','염력','물질화 공격','육체 침투','정신 침투','어둠 영혼 조종'],
      limits:['각 능력의 공통 원리와 동시 사용 가능 여부는 제공되지 않았다.']
    },
    {
      id:'apostle-shahin',name:'샤힌',group:'ushinoda',role:'제4사도',status:'active',certainty:'listed',
      overview:'우시노다교 제4사도로 기재된 쌍날검 사용자다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'제4사도',certainty:'listed'}],capabilities:['최면','의지 증폭'],equipment:['쌍날검'],
      limits:['최면과 의지 증폭의 대상·조건은 제공되지 않았다.']
    },
    {
      id:'apostle-moha',name:'모하',group:'ushinoda',role:'제5사도',status:'active',certainty:'listed',
      overview:'우시노다교 제5사도로 기재된 신체 변형·혈열 계열 능력자다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'제5사도',certainty:'listed'}],capabilities:['신체 변형','혈열'],
      limits:['혈열의 정확한 효과와 신체 변형 범위는 제공되지 않았다.']
    },
    {
      id:'apostle-siena-khan',name:'시에나 칸',group:'ushinoda',role:'제6사도',status:'active',certainty:'listed',
      overview:'우시노다교 제6사도로 기재된 현자의 후손이다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'제6사도',certainty:'listed'}],capabilities:['재생','괴력','오토마톤','현자의 후손'],
      limits:['오토마톤의 수량·기원과 현자 계보의 의미는 제공되지 않았다.']
    },
    {
      id:'apostle-alvarez',name:'알베레즈',group:'ushinoda',role:'제7사도',status:'active',certainty:'listed',
      overview:'우시노다교 제7사도로 기재된 모방·분신 계열 능력자다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'제7사도',certainty:'listed'}],capabilities:['모방','미믹','그림자 분신 소환'],
      limits:['브리안 알베로즈와의 이름 유사성만으로 관계를 확정하지 않는다.','모방과 미믹의 차이는 제공되지 않았다.']
    },
    {
      id:'apostle-parthea-hill',name:'파르테아 힐',group:'ushinoda',role:'제8사도',status:'active',certainty:'listed',
      overview:'우시노다교 제8사도로 기재된 혈액 계열 검사다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'제8사도',certainty:'listed'}],capabilities:['혈액 경화','출혈'],equipment:['레이피어'],
      limits:['출혈 능력의 발동 조건과 혈액 경화의 적용 범위는 제공되지 않았다.']
    },
    {
      id:'apostle-sharma',name:'샤르마',group:'ushinoda',role:'제9사도',status:'active',certainty:'listed',
      overview:'우시노다교 제9사도로 기재된 중대검 사용자다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'제9사도',certainty:'listed'}],capabilities:['촉수','초재생'],equipment:['중대검'],
      limits:['촉수의 기원과 재생 한계는 제공되지 않았다.']
    },
    {
      id:'apostle-uro',name:'우로',group:'ushinoda',role:'제10사도',status:'active',certainty:'listed',
      overview:'우시노다교 제10사도로 기재된 현자의 후손이다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'제10사도',certainty:'listed'}],capabilities:['그림자 번개','현자의 후손'],
      limits:['시에나 칸과의 계보 관계와 그림자 번개의 발현 조건은 제공되지 않았다.']
    },
    {
      id:'semyon-reyes',name:'세묜 레예스',group:'haiman',role:'소속 인물',status:'unknown',certainty:'partial',
      overview:'하이문 인물군에서 이름만 남아 있는 인물이다.',
      affiliations:[{key:'haimun',label:'하이문',role:'소속 인물',certainty:'partial'}],
      limits:['직책, 능력, 사쿠마 유타와의 관계 및 현재 상태가 제공되지 않았다.']
    }
  ];

  const profiles=profileSource?.profiles||{};
  const records=legacyRecords.map(record=>{
    const profile=profiles[record.id]||{};
    const revision=remakeSource?.records?.[record.id]||{};
    const resolvedName=revision.name||profile.name||record.name;
    const renamed=resolvedName!==record.name;
    const aliases=new Set([...(record.aliases||[]),...(profile.aliases||[])]);
    if(profile.name&&profile.name!==resolvedName) aliases.add(profile.name);
    if(renamed) aliases.add(record.name);
    return {
      ...record,...profile,...revision,
      affiliationSummary:revision.affiliationSummary||revision.unit||profile.affiliationSummary||record.affiliationSummary,
      sourceName:renamed?record.name:record.sourceName,
      aliases:Array.from(aliases)
    };
  });

  const byId=Object.fromEntries(records.map(record=>[record.id,record]));
  const groupById=Object.fromEntries(groups.map(group=>[group.id,group]));
  const factionIndex={};
  records.forEach(record=>{
    const keys=new Set(record.affiliations?.map(item=>item.key)||[]);
    const relatedGroups=[record.group,...(record.secondaryGroups||[])];
    relatedGroups.forEach(groupId=>groupById[groupId]?.factionKeys?.forEach(key=>keys.add(key)));
    keys.forEach(key=>{
      if(!factionIndex[key]) factionIndex[key]=[];
      factionIndex[key].push(record.id);
    });
  });

  const stats={
    total:records.length,
    groups:groups.length,
    deceased:records.filter(record=>record.status==='deceased').length,
    unresolved:records.filter(record=>record.certainty!=='listed'||record.limits?.length).length,
    abilityUsers:records.filter(record=>record.capabilities?.length&&record.capabilities.some(item=>item!=='미확인')).length,
    profiled:records.filter(record=>record.identity&&record.history?.length).length,
    renamed:records.filter(record=>record.sourceName).length
  };

  root.ProjectCursePersonnel=freeze({
    version:'5.54.0',schema:'project-curse-personnel-v3',sourceClass:'LEGACY REGISTER + SUPPLEMENTAL IDENTITY + CANON REVISION',
    editorialRule:'개편 정본명·작전 분류와 2006년 원 명부명을 함께 보존하며, 능력은 발현 경로와 대가를 분리해 판독한다.',
    groups,statuses,certainties,records,byId,groupById,factionIndex,stats
  });
})(window);
