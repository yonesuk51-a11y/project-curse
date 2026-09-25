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
    {id:'alma',label:'알마 가문',short:'알마',code:'ALM',tone:'family',factionKeys:[]},
    {id:'fhc-union',label:'F.H.C-유니온',short:'유니온',code:'FUN',tone:'corporate',factionKeys:['fhc']},
    {id:'fhc-ark',label:'F.H.C-아크',short:'아크',code:'FAR',tone:'corporate',factionKeys:['fhc']},
    {id:'nhc',label:'N.H.C',short:'N.H.C',code:'NHC',tone:'field',factionKeys:['nhc']},
    {id:'uac',label:'U.A.C',short:'U.A.C',code:'UAC',tone:'institution',factionKeys:['uac']},
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
      overview:'F.H.C-유니온 인물군에 경호원으로 기재됐다.',
      affiliations:[{key:'fhc',label:'F.H.C-유니온',role:'경호원',certainty:'listed'}],
      relationships:[{target:'alma-kara',relation:'전담 경호',certainty:'partial'}],
      limits:['전체 이름과 경호 이력은 보완 신원 기록에서 확장됐다.']
    },
    {
      id:'alma-koenig',name:'알마 코니그',group:'fhc-union',secondaryGroups:['alma'],role:'본부장',status:'active',certainty:'listed',
      overview:'F.H.C-유니온 본부장이자 알마 가문의 장남으로 재정리됐다.',
      affiliations:[{key:'fhc',label:'F.H.C-유니온',role:'본부장',certainty:'listed'}],
      relationships:[{target:'alma-wade',relation:'아들',certainty:'partial'},{target:'alma-kara',relation:'손자',certainty:'partial'},{target:'alma-damian',relation:'형제',certainty:'partial'},{target:'alma-bennett',relation:'남매',certainty:'partial'},{target:'alma-griffon',relation:'형제',certainty:'partial'}],
      limits:['가족 구조와 현시점 재임 여부는 보완 신원 기록에서 잠정 재구성됐다.']
    },
    {
      id:'ezekiel-kalp',name:'에제키엘 칼프',group:'fhc-ark',role:'아크의 보스',status:'active',certainty:'listed',
      overview:'F.H.C-아크의 보스로 기재됐다.',
      affiliations:[{key:'fhc',label:'F.H.C-아크',role:'보스',certainty:'listed'}],
      limits:['능력, 지휘 범위와 유니온과의 관계는 제공되지 않았다.','젊은 외모를 유지하는 힘의 정체와 대가는 기록되지 않았다.']
    },
    {
      id:'sakuma-yuta',name:'사쿠마 유타',aliases:['레드 마우스'],group:'fhc-ark',secondaryGroups:['haiman'],role:'U.A.C 정보원 / 하이문 리더',status:'active',certainty:'partial',
      overview:'F.H.C-아크 구간에서는 U.A.C 정보원으로 기재된다. 하이문 구간에서는 “레드 마우스”라는 이름의 리더이자 오리진 실험체로 기재된다. 두 기록은 동일 인물을 가리키는 것으로 직접 연결돼 있다.',
      affiliations:[
        {key:'uac',label:'U.A.C',role:'정보원',certainty:'listed'},
        {key:'fhc',label:'F.H.C-아크',role:'잠입·전향 경위 미확인',certainty:'partial'},
        {key:'haimun',label:'하이문',role:'리더 / 레드 마우스',certainty:'listed'}
      ],
      capabilities:['겜블러 표기','오리진 실험체'],
      notes:['조국에 충성했으나 일종의 배신을 당해 돌아선 것으로 기재된다.','“진정한 힘을 목도한 주군을 모시기로 한다”는 동기 문구가 남아 있다.'],
      limits:['각 소속의 정확한 시간 순서와 “주군”의 신원은 확정되지 않았다.','겜블러 표기가 성향·전투 방식·능력 가운데 무엇을 뜻하는지 불명이다.']
    },
    {id:'reiki',name:'레이키',group:'fhc-ark',role:'소속 인물',status:'deceased',certainty:'listed',overview:'F.H.C-아크 인물군에 사망자로 기재됐다.',affiliations:[{key:'fhc',label:'F.H.C-아크',role:'소속 인물',certainty:'listed'}],limits:['전체 이름, 역할, 능력과 사망 경위가 제공되지 않았다.']},
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
      id:'mason',name:'메이슨',group:'nhc',role:'저격·암살·지원',status:'active',certainty:'listed',
      overview:'원거리 관측과 근접 암살, 전장 지원을 함께 수행하는 것으로 기재된 N.H.C 인물이다.',
      affiliations:[{key:'nhc',label:'N.H.C',role:'저격수 / 암살 및 지원',certainty:'listed'}],
      capabilities:['투시','초감각'],equipment:['저격 장비','쌍단검','와이어'],
      limits:['투시와 초감각의 범위 및 제약은 제공되지 않았다.']
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
      limits:['위원회의 정확한 명칭과 궁술의 초자연적 성질 여부는 제공되지 않았다.','젊은 외모를 유지하는 힘의 정체와 대가는 기록되지 않았다.']
    },
    {
      id:'natalia',name:'나탈리아',group:'uac',role:'위원회 비서 / 정보원',status:'active',certainty:'listed',
      overview:'U.A.C 위원회 비서이자 정보원으로 기재됐다.',
      affiliations:[{key:'uac',label:'U.A.C',role:'위원회 비서 / 정보원',certainty:'listed'}],
      relationships:[{target:'pierce',relation:'보좌 대상 / 위원회 대표',certainty:'listed'}],
      limits:['정보 활동의 대상과 별도 능력은 제공되지 않았다.']
    },
    {
      id:'alma-millen',name:'알마 밀렌',group:'syndicate',role:'요원',status:'active',certainty:'listed',
      overview:'신디케이트 요원으로 기재된 알마 성씨의 인물이다.',
      affiliations:[{key:'syndicate',label:'신디케이트',role:'요원',certainty:'listed'}],capabilities:['무형 이계'],
      limits:['알마 가문과의 혈연 여부, 무형 이계의 작동 방식은 제공되지 않았다.']
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
      overview:'우시노다교 인물군에서 타락교 교주로 기재됐다.',
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
      id:'apostle-uro',name:'우로',group:'ushinoda',role:'제10사도',status:'active',certainty:'listed',
      overview:'우시노다교 제10사도로 기재된 현자의 후손이다.',
      affiliations:[{key:'ushinoda',label:'우시노다교',role:'제10사도',certainty:'listed'}],capabilities:['그림자 번개','현자의 후손'],
      limits:['시에나 칸과의 계보 관계와 그림자 번개의 발현 조건은 제공되지 않았다.']
    },
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

  // 2042년 단말 추가 등록(personnel-additions-data.js) — 2006년 명부(records)에 섞지 않고 additions로 따로 싣는다.
  const additionSource=root.ProjectCursePersonnelAdditions;
  const additionGroups=additionSource?.groups||[];
  const additions=(additionSource?.records||[]).map(record=>({...record,register:'addition',affiliationSummary:record.affiliationSummary||record.unit,aliases:[...(record.aliases||[])]}));

  const byId=Object.fromEntries([...records,...additions].map(record=>[record.id,record]));
  const groupById=Object.fromEntries([...groups,...additionGroups].map(group=>[group.id,group]));
  const indexByFaction=list=>{
    const index={};
    list.forEach(record=>{
      const keys=new Set(record.affiliations?.map(item=>item.key)||[]);
      const relatedGroups=[record.group,...(record.secondaryGroups||[])];
      relatedGroups.forEach(groupId=>groupById[groupId]?.factionKeys?.forEach(key=>keys.add(key)));
      keys.forEach(key=>{
        if(!index[key]) index[key]=[];
        index[key].push(record.id);
      });
    });
    return index;
  };
  const factionIndex=indexByFaction(records);
  const additionIndex=indexByFaction(additions);

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
    editorialRule:'개편 정본명·작전 분류와 2006년 원 명부명을 함께 보존한다. 능력은 발현 경로와 대가를 분리해 판독한다.',
    groups,statuses,certainties,records,byId,groupById,factionIndex,stats,
    additions,additionGroups,additionIndex,additionLabel:additionSource?.label||'',additionIntro:additionSource?.intro||''
  });
})(window);
