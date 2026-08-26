export const V6_BUILD=Object.freeze({
  version:'6.0.0-alpha.3',
  label:'Recovered World',
  date:'2026-08-27',
  canonState:'DRAFT / REFOUNDATION'
});

export const WORLD_FOUNDATION=Object.freeze({
  statement:'세상은 살아남지 못했다. 사람과 기관은 죽음·타락·망각이 도착하는 순서를 조금 늦추고 있을 뿐이다.',
  present:{date:'2042.11.01',signal:'삼야 무응답 이후 01일',status:'중앙 구조 없음 / 생존률 집계 중지 / 구역별 선별 수용'},
  entrances:[
    {
      year:'1986',code:'BLOOD LAKE / FIRST EXPOSURE',title:'불멸을 향해',
      copy:'독일 본토의 [검열] 지역에 투입된 현장팀이 붉은 호수로 향했다. 공개 좌표와 구조 투입 기록은 남아 있지 않으며, 시스템은 생환 확인 없이 작전을 완료로 기록했다.',
      route:'archive',record:'Immortality_860201',state:'보호 원문 / 현장 관측'
    },
    {
      year:'2008',code:'CONTINENTAL SILENCE',title:'대륙 무응답 선언',
      copy:'북아메리카의 연속정부는 구조 정원을 채우기도 전에 철수했다. 남은 지도와 귀환자의 시간은 서로 다른 사망자 명단을 기록했다.',
      route:'map',detail:'operation:deadzone-return',state:'복수 기록 일치 / 원인 미확정'
    },
    {
      year:'2042',code:'THREE NIGHT SILENCE',title:'삼야 무응답',
      copy:'대흑림 성채 여섯 곳과 데드 존 검문소 네 곳이 61시간 1분 동안 동시에 침묵했다. 실종자를 찾으러 간 후속대도 돌아오지 않았다.',
      route:'map',detail:'operation:three-night',state:'현장 관측 / 연결 관계 미확정'
    }
  ],
  limits:[
    '실제 역사 사건의 원인과 책임 주체를 초자연 설정으로 대체하지 않는다.',
    '기관 문서는 모든 진실을 알지 못하며, 서로 충돌하는 기록은 충돌한 채 보존한다.',
    '능력은 발동 조건·거리·지속 시간·대가·대응 수단을 가지며, 대가는 수명·기억·신체·관계 가운데 하나를 실제로 소모한다.',
    '신과 이계 존재의 본질은 최종 판정으로 확정하지 않는다.',
    '이름 있는 인물과 주인공에게 생존 보정은 없다. 승리는 국지적이고, 구조는 늘 정원보다 늦다.',
    '재생과 귀환은 육체의 복원일 수 있으나 동일한 인격의 귀환을 보증하지 않는다.'
  ],
  lossDoctrine:[
    {code:'CAPACITY',title:'대피 정원은 항상 부족하다.',copy:'기관은 모두를 구하는 계획을 세우지 않는다. 누구를 버릴지 결정하는 표가 먼저 배포된다.'},
    {code:'RETURN',title:'생환은 작전 성공 조건이 아니다.',copy:'표본·좌표·송신이 회수되면 현장팀이 전멸해도 임무는 완료로 종결될 수 있다.'},
    {code:'COST',title:'힘은 생존 시간을 앞당겨 쓴다.',copy:'강한 능력일수록 사용자의 수명, 기억, 신체 또는 인간관계를 되돌릴 수 없게 소모한다.'},
    {code:'VICTORY',title:'되찾은 땅은 회복되지 않는다.',copy:'괴이를 밀어낸 뒤에도 토양·출생·기록의 오염은 남는다. 승리는 다음 철수까지의 임시 점유다.'},
    {code:'MERCY',title:'선의는 있어도 보상은 없다.',copy:'누군가는 끝까지 타인을 구하려 한다. 세계는 그 선택을 기적이나 생존으로 갚아 주지 않는다.'}
  ]
});

export const CORE_TERMS=Object.freeze([
  {code:'REFERENCE STATE',name:'기준상',copy:'사람·장소·사물이 자기 자신으로 유지되기 위해 반복하는 상태. 이름표, 혈연, 시계, 도로 표식도 기준상이 될 수 있다.'},
  {code:'INCONGRUITY',name:'비정합',copy:'서로 양립할 수 없는 기준상 둘 이상이 한 장소에서 동시에 성립하려는 현상. 대부분의 재난은 이 충돌의 흔적이다.'},
  {code:'REBIRTH',name:'리버스',copy:'이미 끝난 상태가 다른 순서와 형상으로 다시 나타나는 사건 또는 과정. 에너지나 종족의 이름이 아니다.'},
  {code:'ANCHOR',name:'앵커',copy:'하나의 기준상을 반복 유지하는 매개. 장비뿐 아니라 성채의 종, 장부, 의식, 사람의 기억도 포함한다.'},
  {code:'VITAL ASSERTION',name:'생기',copy:'살아 있는 존재가 자기 기준상을 유지하거나 주변에 강요하는 힘. 사용할수록 생물학적 손상이 사용자에게 집중된다.'},
  {code:'CORRUPTION',name:'타락',copy:'대상의 기준상이 다른 형상에 의해 지속적으로 덮어써지는 과정. 교단 소속이나 하나의 종족을 뜻하지 않는다.'}
]);

export const WORLD_THEATRES=Object.freeze([
  {
    id:'japan',index:'JP-06',name:'일본 계측권',call:'MEASUREMENT STATE',accent:'paper',
    state:'도시 회랑 유지 / 오탐지 구역 폐쇄',
    summary:'1982년 제6계측계획 이후 일본은 시간과 경로의 불일치를 측정해 도시 회랑을 붙들었다. 회랑 밖 주민은 행정상 이미 사망자로 처리된다.',
    truth:'기술 도약은 분산 계측·장애 복구·경로 감식에 집중된다.',
    unknown:'초기 민간 연구와 이계 접속 기술의 직접 관계는 확정되지 않았다.'
  },
  {
    id:'deadzone',index:'DZ-00',name:'데드 존',call:'CONTINENTAL SILENCE',accent:'oxide',
    state:'국가 소실 / 귀환자 동일성 불보장',
    summary:'2008년 대륙 무응답 선언 이후 북아메리카는 서로 다른 시간과 역사가 겹친 순례권이 되었다. 돌아온 몸이 떠났던 사람과 같은지는 보증되지 않는다.',
    truth:'연속정부 철수, 검문 기록 불일치, 귀환자 협정은 복수 기록에 남아 있다.',
    unknown:'대륙을 통제하는 주체와 통행로를 여는 의도는 확인되지 않았다.'
  },
  {
    id:'forest',index:'GBF-∞',name:'대흑림',call:'SOUTHERN NON-EUCLIDEAN REGION',accent:'rust',
    state:'거리 불명 / 피난권 만료제',
    summary:'대흑림은 남아메리카 내부에서 거리·방향·생태가 고정되지 않는 권역이다. 성채는 피난민을 받지만 식량이 줄면 체류권부터 회수한다.',
    truth:'마을·성채·교단은 생존과 순례로 유지를 위해 불편한 공존을 지속한다.',
    unknown:'남부 혈교와 우시노다 중앙 혈교의 지휘 관계는 아직 판정되지 않았다.'
  },
  {
    id:'north',index:'NF-06',name:'북부전선',call:'SIXTH LINE',accent:'steel',
    state:'교전 지속 / 손실 인원 집계 중지',
    summary:'일본과 동맹기관은 제6차 차단선을 조금씩 전진시킨다. 되찾은 구역은 정착지가 아니라 다음 병력을 소모시키는 완충지가 된다.',
    truth:'2026년 이후 전황 역전과 2038년 차단선 재설정은 복수 감청에 남아 있다.',
    unknown:'승전이 세계의 회복으로 이어지는지, 남부 동원을 가속했는지는 미확정이다.'
  }
]);

export const ABILITY_PATHS=Object.freeze([
  {id:'resonance',index:'A',name:'선천 공명형',condition:'특정 현상과의 선천적 동조',cost:'감각 과부하·가족력 추적',counter:'주파수 교란·환경 차단'},
  {id:'covenant',index:'B',name:'의식 계약형',condition:'존재·성물·교리와의 계약',cost:'기억·수명·감정·관계의 손실',counter:'계약 조건 파기·매개체 봉인'},
  {id:'adaptation',index:'C',name:'오염 적응형',condition:'타락 노출 후 불완전한 생존',cost:'신체 변형·정체성 판정 저하',counter:'재생 차단·오염 단계 고정'},
  {id:'interface',index:'D',name:'인공 접속형',condition:'장치·이식물·부적 규격을 통한 접속',cost:'장비 의존·역류·보급 제한',counter:'동기 신호 파괴·장치 격리'}
]);

export const V6_ERAS=Object.freeze([
  {range:'1975–1985',title:'측정의 시대',copy:'아마리온과 제6계측계획은 현상을 이해하지 못한 채 반복 측정하는 방법부터 만들었다.'},
  {range:'1986–1992',title:'노출과 분산',copy:'피의 호수와 교단 기록이 현장 문서에 나타났다. 대응 지식은 기업·정부·도시 설비로 흩어졌다.'},
  {range:'1993–2000',title:'봉쇄와 모방',copy:'보호기관은 교단의 수단을 모방해 봉쇄를 제도화했고, 살아남은 접속자는 전력과 표본으로 분류됐다.'},
  {range:'2001–2012',title:'분리와 대단절',copy:'지휘권이 갈라진 뒤 북미는 국가의 연속성을, 남미는 지도와 정착지의 연속성을 잃었다.'},
  {range:'2013–2030',title:'순례와 전선',copy:'국가는 안전 회랑을, 성채와 교단은 이동로를 독점했다. 순례자의 귀환은 산업이자 실험이 됐다.'},
  {range:'2031–2042',title:'분기와 무응답',copy:'중앙 명령은 사라지고 지역 규칙만 남았다. 삼야 무응답 이후 서로 먼 붕괴권이 같은 호출명을 사용하기 시작했다.'}
]);

export const ARCHIVE_RECORDS=Object.freeze({
  Cults_871104:{
    id:'Cults_871104',code:'CULT-ARCHIVE',date:'1987.11.04',title:'종교',risk:'HIGH',
    source:'PROTECTED SOURCE',integrity:'보호 원문 무변경',provenance:'출처 대조 대기',presentation:'V6 조사형 재구성',duration:'사용자 주도',audio:'기본 무음',
    cover:'../assets/resources/83d311da1ab7310a567c6023f6151e6c.webp',original:'../docs/Cults_871104/',
    summary:'타락교와 혈교를 영상처럼 흘려보내지 않고, 분류·증거·대응 기록으로 직접 대조한다.'
  },
  Immortality_860201:{
    id:'Immortality_860201',code:'OP-IMMORTALITY',date:'1986.02.01 / 07.25',title:'불멸을 향해',risk:'CRITICAL',
    source:'PROTECTED SOURCE',integrity:'보호 원문 무변경',provenance:'출처 대조 대기',presentation:'V6 4막 재구성',duration:'4막 / 사용자 주도',audio:'시제품 무음',
    cover:'../assets/resources/05cdc0276694d090f3829c4dc6e5a30b.webp',original:'../docs/Immortality_860201/',
    summary:'현장 투입부터 시스템의 임무 완료 판정까지, 사건의 시간과 지휘 실패를 네 막으로 재구성한다.'
  }
});

export const CULT_INDEX=Object.freeze([
  {id:'corruption',group:'타락교',code:'CULT / 01',title:'타락교',image:'../assets/resources/83d311da1ab7310a567c6023f6151e6c.webp',state:'출처 대조 대기',sourceRef:'보호 원문 / 타락교 기록면',finding:'불멸을 축복으로 해석하고 신체 자체를 다시 쓰려는 오염 신앙 계열.',response:'개별 신자의 외형보다 행동 반복과 의식 흔적을 먼저 판정한다.'},
  {id:'silent',group:'타락교',code:'CULT / 05',title:'침묵성 타락',image:'../assets/resources/pc5152ay_silent_corruption.png',state:'현장 분류 / 원인 미확정',sourceRef:'보호 원문 / 침묵성 타락 기록면',finding:'빙의 없이 피해자 내부에서 이상 조직과 행동 통제가 성장하는 잠복형.',response:'통증·무기력·반복 문장을 분리 기록하고 접촉자를 함께 격리한다.'},
  {id:'hybrid',group:'타락교',code:'CULT / 06',title:'융합성 타락',image:'../assets/resources/pc5152ay_hybrid_corruption.png',state:'정보 오염 주의',sourceRef:'보호 원문 / 융합성 타락 기록면',finding:'인간 자아와 타락 조직이 동시에 남을 수 있어 외형 판정이 늦어진다.',response:'정상 안내문으로 위장한 교단식 행동 지시를 2차 오염원으로 취급한다.'},
  {id:'blood',group:'혈교',code:'BLOOD / 01',title:'혈교',image:'../assets/resources/8668a15590e2ae00b18d68db57a85c95.webp',state:'계보 미확정',sourceRef:'보호 원문 / 혈교 기록면',finding:'피를 생명 유지 물질이 아니라 기억·무기·통로·저장소의 매개로 본다.',response:'혈흔과 웅덩이를 이동 경로로 가정하고 고열 장비 없이 접근하지 않는다.'},
  {id:'reservoir',group:'혈교',code:'BLOOD / 05',title:'혈액 저장소',image:'../assets/resources/458cf4194ba894dce7e907244d2fd1f0.webp',state:'현장 회수본',sourceRef:'보호 원문 / 혈액 저장소 기록면',finding:'대량 혈액을 전투 회복과 의식 보급원으로 운용한 흔적.',response:'개봉 전에 오염 수치와 외부 혈류 경로를 먼저 봉쇄한다.'}
]);

export const IMMORTALITY_ACTS=Object.freeze([
  {id:'brief',act:'ACT I',time:'16:10–16:46',title:'현장 투입',image:'../assets/resources/b1f6105c9de718ff230e00b702ada13b.webp',state:'3일치 보급 / 지원팀 대기',sourceRef:'보호 원문 16:10·16:27·16:31·16:46',summary:'유닛2가 현장에 도착해 사진을 전송한다. 안개와 혈액성 입자, 나무 위 미확인 물체가 확인되지만 본부는 거리 유지 후 전진을 명령한다.',signal:'COMMAND LINK / STABLE'},
  {id:'route',act:'ACT II',time:'17:02–17:58',title:'피의 호수',image:'../assets/resources/11f2f935e0339690ace785966d7e436f.webp',state:'민간 흔적 회수 / 철수 명령 없음',sourceRef:'보호 원문 17:02·17:09·17:16·17:41·17:58',summary:'버려진 텐트에서 혈흔과 두 사람의 흔적이 발견된다. 유닛2는 계속 전진해 혈액성 수역과 거대 개체를 확인하고, 예거트는 이유를 설명하지 못한 공포를 보고한다.',signal:'FIELD ROUTE / CONTINUE'},
  {id:'loss',act:'ACT III',time:'18:06–18:42',title:'지원선 소실',image:'../assets/resources/8da1d79fd90b59063f33aa00f1eb742a.webp',state:'예거트 정신 이상 / 유닛4 통신 두절',sourceRef:'보호 원문 18:06·18:14·18:22·18:29·18:37·18:42',summary:'예거트의 I.P.D가 정신 간섭 가능성을 기록한다. 유닛4와 통신이 끊기고, 뒤이어 밀로의 추적 신호가 인간 보행과 맞지 않는 속도로 접근한다.',signal:'I.P.D NETWORK / CONFLICT'},
  {id:'last',act:'ACT IV',time:'18:44–19:00',title:'완료 판정',image:'../assets/resources/05cdc0276694d090f3829c4dc6e5a30b.webp',state:'생존자 확인 없음 / 구조 투입 기록 없음',sourceRef:'보호 원문 18:44·18:51·18:56·19:00',summary:'출처를 확인할 수 없는 사과 문장과 마지막 이미지가 수신된다. 19시, 구조와 생환을 확인하지 않은 시스템은 임무 상태를 완료로 바꾼다.',signal:'MISSION STATUS / COMPLETE'}
]);

export const FACTION_MARKS=Object.freeze([
  {id:'uac',group:'기관',family:'institution',code:'U.A.C',fullName:'Unified Anomaly Compact',name:'통합 이상현상 협약체',nameStatus:'A02 ADOPTED NAME / V6 DRAFT',motif:'이중 격리환과 네 접근문',status:'official',markStatus:'OFFICIAL DRAFT',confidence:'1993 공개 협약명',doctrine:'공통 기록 형식과 접근권을 지키기 위해 등록 밖의 사람을 버린다.',cost:'회랑 밖 민간인과 승인되지 않은 귀환자',nameLedger:[{name:'United Nations Anomaly Containment',role:'DEPRECATED'},{name:'Urban Anomaly Containment',role:'LEGACY SEARCH TERM'},{name:'Urban Anomaly 봉쇄',role:'LEGACY SEARCH TERM'}],variants:['seal','badge','map']},
  {id:'nhc',group:'기관',family:'institution',code:'N.H.C',fullName:'Nonlinear Hazard Command',name:'비선형 위난사령부',nameStatus:'A02 ADOPTED NAME / V6 DRAFT',motif:'수직 방어축과 열린 철수 회랑',status:'official',markStatus:'OFFICIAL DRAFT',confidence:'1993 정식화 / 2001 독립',doctrine:'차단선 뒤의 인구와 작전 병력을 지키기 위해 회수 비용이 큰 팀을 포기한다.',cost:'현장대와 등록되지 않은 잔류민',earlyLabel:{fullName:'Nonlinear Hazard Classification',name:'비선형 위난 분류규격',period:'1984–1986',kind:'PROVISIONAL EXPANSION / EQUIPMENT STANDARD OR LATER EDITORIAL LABEL',confidence:'DISPUTED'},nameLedger:[{name:'National Hazard Control',role:'LEGACY / DEPRECATED'}],variants:['seal','badge','map']},
  {id:'sid',group:'기관',family:'institution',code:'S.I.D',fullName:'Signal Integrity Directorate',name:'신호무결성국',nameStatus:'A02 ADOPTED NAME / V6 DRAFT',motif:'어긋난 이중 렌즈와 단일 증거점',status:'official',markStatus:'OFFICIAL DRAFT',confidence:'1993 설치 / 2001 독립',doctrine:'도시 기록의 정합성을 지키기 위해 기억과 관계가 어긋난 시민을 조사한다.',cost:'오탐지 대상과 내부 정보원',nameLedger:[{name:'Special Investigation Department',role:'1993–2001 HISTORICAL OR REGIONAL COVER'}],variants:['seal','badge','map']},
  {id:'fhc',group:'기업',family:'institution',code:'F.H.C',fullName:'Frontier Habitat Consortium',name:'개척거주권 컨소시엄',nameStatus:'A02 ADOPTED NAME / V6 DRAFT',motif:'육각 공정틀과 표본 조리개',status:'official',markStatus:'OFFICIAL DRAFT',confidence:'1982 아마리온 계보 승계',doctrine:'생존 가능한 거주 규격을 독점하기 위해 접속자와 시설도시를 소유한다.',cost:'실험체·하청 현장대·시설 주변 주민',nameLedger:[{name:'Foremost Hitech Cooperation',role:'LEGACY PROMOTIONAL TRANSLATION'}],variants:['seal','badge','map']},
  {id:'amarion',group:'기업',family:'network',code:'AMARION',fullName:'Amarion',name:'아마리온',nameStatus:'FIELD-ATTESTED NAME / LEGAL NAME UNRESOLVED',motif:'불가능 삼각 좌표와 어긋난 중심축',status:'reconstructed',markStatus:'HISTORICAL RECONSTRUCTION',confidence:'1975–1982 파편 기록',doctrine:'불가능 좌표를 산업 규격으로 만들었고 책임 자료보다 연구 계보를 오래 남겼다.',cost:'초기 시설 인원과 후대 연구자',descriptor:'초기 공간 연구기업',nameLedger:[],variants:['seal','badge','map']},
  {id:'son',group:'이탈',family:'network',code:'S.O.N',fullName:'Severed Order Network',name:'단절명령망',nameStatus:'FIELD-ATTESTED NAME / V6 DRAFT',motif:'끊어진 통제환과 세 이탈로',status:'field-attested',markStatus:'FIELD-ATTESTED DRAFT',confidence:'복수 현장 호출 일치',doctrine:'중앙 명령에서 탈주한 경로를 지키지만 말단 보호 의무는 보장하지 않는다.',cost:'은닉망 말단과 정보가 팔린 피난민',nameLedger:[{name:'Syndicate',role:'FIELD CALLSIGN'},{name:'Shadow Of Nemesis',role:'LEGACY PROPAGANDA NAME'}],variants:['seal','badge','map']},
  {id:'poh',group:'이탈',family:'network',code:'P.O.H',fullName:'Persons on Hold',name:'인계보류망',nameStatus:'ANALYST-ASSIGNED NAME / V6 DRAFT',motif:'빈 화물칸과 절취선',status:'field-attested',markStatus:'CRIMINAL STENCIL / FIELD-ATTESTED',confidence:'압수 송장 표식 반복 확인 / 명칭은 분석관 지정',doctrine:'사람과 오염물을 인계 전 상태로 묶어 이름 대신 화물번호로 거래한다.',cost:'피난민·납치자·채무 현장대',nameLedger:[{name:'Power Of Haimun',role:'DISPUTED LEGACY EXPANSION'}],variants:['seal','badge','map']},
  {id:'ashcrew',group:'현장',family:'field',code:'ASH',fullName:'Ash Crew',name:'애시 크루',nameStatus:'FIELD-ATTESTED NAME',motif:'인식표와 꺼지지 않은 잔불',status:'field-attested',markStatus:'FIELD PATCH',confidence:'반복 회수 패치 확인',doctrine:'죽은 사람의 이름과 다음 작전의 증거를 회수한다.',cost:'회수대와 신원 확인을 기다리는 유족',nameLedger:[{name:'리버스 사후 대응조직',role:'LEGACY DESCRIPTOR'}],variants:['seal','badge','map']},
  {id:'arf',group:'현장',family:'field',code:'A.R.F',fullName:'Asset Recovery Force',name:'자산회수대',nameStatus:'A02 ADOPTED SUBUNIT NAME / V6 DRAFT',motif:'삼점 회수틀과 상부 견인점',status:'official',markStatus:'OFFICIAL SUBUNIT DRAFT',confidence:'2005 애시 크루 산하 편제',doctrine:'희귀 표본과 장비를 사람보다 먼저 회수한다.',cost:'견인대와 회수 경로 주민',nameLedger:[{name:'Anomaly Recovery Force',role:'LEGACY ROLE TRANSLATION'}],variants:['seal','badge','map']},
  {id:'cpd',group:'현장',family:'field',code:'C.P.D',fullName:'Civilian Processing Division',name:'민간인 선별처리부',nameStatus:'A02 ADOPTED INTERNAL NAME / V6 DRAFT',motif:'열린 방패와 세 분기',status:'official',markStatus:'OFFICIAL INTERNAL DRAFT',confidence:'2005 애시 크루 산하 편제',doctrine:'제한된 피난 정원을 유지하기 위해 가족과 동행자를 승인·격리·인계로 나눈다.',cost:'분리된 가족과 검문 인력',publicName:{fullName:'Civilian Protection Division',name:'민간 보호부',role:'PUBLIC COVER'},precursor:{fullName:'Civilian Protection Directive',name:'민간 보호·분리 지침',period:'1989–2004',kind:'FIELD PROCEDURE / NOT AN ORGANIZATION'},nameLedger:[],variants:['seal','badge','map']},
  {id:'ushinoda',group:'교단',family:'cult',code:'USHINODA',fullName:'Ushinoda Common Lineage',fullNameStatus:'ANALYST TRANSLATION',name:'우시노다 공통계통',nameStatus:'RECONSTRUCTED COLLECTIVE NAME',motif:'빈 중심을 공유하는 세 획',status:'reconstructed',markStatus:'RECONSTRUCTED',confidence:'종파 존재 확정 / 중앙지휘 미확정',doctrine:'타락·혈액·그림자 의식을 서로 호환되는 구원으로 가르친다.',cost:'신자의 몸·이름·관계',nameLedger:[{name:'우시노다교',role:'LEGACY COLLECTIVE NAME'}],variants:['seal','badge','map']},
  {id:'corruption',group:'교단',family:'cult',code:'CORRUPTION',fullName:'Corruption Path',fullNameStatus:'ANALYST TRANSLATION',name:'타락교',nameStatus:'FIELD-RECONSTRUCTED NAME',motif:'비대칭 생체 가지와 성장점',status:'reconstructed',markStatus:'FIELD RECONSTRUCTION',confidence:'지역 변형 다수',doctrine:'고정된 몸과 자아를 결함으로 보고 계속 덮어쓴다.',cost:'원래 몸과 행동의 자율성',nameLedger:[{name:'Corruption Cult',role:'LEGACY TRANSLATION'}],variants:['seal','badge','map']},
  {id:'blood',group:'교단',family:'cult',code:'BLOOD',fullName:'Blood Lineage',fullNameStatus:'ANALYST TRANSLATION',name:'혈교 중앙 계통',nameStatus:'RECONSTRUCTED COLLECTIVE NAME',motif:'닫힌 혈액핵과 유입축',status:'reconstructed',markStatus:'RECONSTRUCTED',confidence:'중앙 계보 판정 대기',doctrine:'피를 기억·통로·소유를 저장하는 그릇으로 운용한다.',cost:'몸의 소유권과 혈연 기억',nameLedger:[{name:'Blood Cult',role:'LEGACY TRANSLATION'}],variants:['seal','badge','map']},
  {id:'shadow',group:'교단',family:'cult',code:'SHADOW',fullName:'Shadow Path',fullNameStatus:'ANALYST TRANSLATION',name:'그림자교',nameStatus:'RECONSTRUCTED COLLECTIVE NAME',motif:'어긋난 이중 그림자와 끊긴 관측환',status:'reconstructed',markStatus:'RECONSTRUCTED',confidence:'오인 표식 다수',doctrine:'관측되지 않은 빈자리를 침투와 생존의 통로로 만든다.',cost:'기억에서의 자리와 인격 경계',nameLedger:[{name:'Shadow Cult',role:'LEGACY TRANSLATION'}],variants:['seal','badge','map']},
  {id:'apostle',group:'예외',family:'analysis',code:'APOSTLE I',fullName:'First Apostle Analysis Glyph',fullNameStatus:'ANALYST TRANSLATION',name:'제1사도 분석 표상',nameStatus:'ANALYST-ASSIGNED GLYPH',motif:'삼권능 중첩과 선행점',status:'analyst',markStatus:'ANALYST GLYPH',confidence:'세력 아님 / 공식 문양 아님',doctrine:'세 권능 흔적이 한 개체에 겹친 사례를 표시하는 분석 기호다.',cost:'세력 통제권 표기로 사용 금지',nameLedger:[{name:'첫 번째 사도',role:'LEGACY SUBJECT LABEL'}],variants:['seal','badge','map']},
  {id:'southern-blood',group:'지역',family:'cult',code:'SOUTH BLOOD',fullName:'Southern Blood Lineage',fullNameStatus:'ANALYST TRANSLATION',name:'남부 혈교',nameStatus:'FIELD-ATTESTED REGIONAL NAME',motif:'뒤집힌 전시 왕관과 폐쇄 혈액핵',status:'field-attested',markStatus:'FIELD-ATTESTED DRAFT',confidence:'계승·동맹·도용 판정 대기',doctrine:'해안 이동과 전시 소환망으로 성채의 자율성을 흡수한다.',cost:'피난민의 몸과 성채의 충성',nameLedger:[{name:'Southern Blood Cult',role:'LEGACY TRANSLATION'}],variants:['seal','badge','map']},
  {id:'deadzone-blood',group:'지역',family:'cult',code:'DZ BLOOD',fullName:'Dead Zone Blood Lineage',fullNameStatus:'ANALYST TRANSLATION',name:'데드 존 혈교',nameStatus:'FIELD-ATTESTED REGIONAL NAME',motif:'열린 혈액 방울과 관통 순례로',status:'field-attested',markStatus:'FIELD-ATTESTED DRAFT',confidence:'2016 공개 결별 / 실제 단절 미확정',doctrine:'귀환 좌표를 유지하는 대가로 피와 관계 기록을 장기 채무로 묶는다.',cost:'귀환자의 피·관계 기록·소유권',nameLedger:[{name:'Dead Zone Blood Cult',role:'LEGACY TRANSLATION'}],variants:['seal','badge','map']}
]);

export const FACTION_BRANCHES=Object.freeze([
  {id:'fhc-union',parentId:'fhc',code:'F.H.C-UNION',name:'유니온 지부',cartouche:'UNION',commandStatus:'DISPUTED',note:'독립 세력이 아니라 F.H.C 부모 표식의 카르투슈 변형이다.'},
  {id:'fhc-ark',parentId:'fhc',code:'F.H.C-ARK',name:'아크 지부',cartouche:'ARK',commandStatus:'DISPUTED',note:'2021년 이후 실제 명령권은 판정 보류 상태다.'},
  {id:'tad',parentId:'fhc',code:'T.A.D',name:'T.A.D 지부',cartouche:'T.A.D',commandStatus:'DISPUTED',note:'별도 독립 마크를 부여하지 않고 F.H.C 계보 아래 둔다.'}
]);

export const FACTION_ENTITIES=Object.freeze([
  {id:'nhc-early-label',entityType:'DISPUTED EARLY LABEL',name:'N.H.C 초기 표기',hasMark:false},
  {id:'redwolf',entityType:'FIELD UNIT',name:'레드울프',hasMark:false},
  {id:'haimun-cell',entityType:'DISPUTED CELL',name:'하이먼 세포',hasMark:false}
]);

export const FACTION_LINEAGE=Object.freeze([
  {from:'amarion',fromName:'아마리온',to:'fhc',toName:'개척거주권 컨소시엄',relationType:'SUCCESSION',direction:'forward',label:'연구·자산 계보 승계',period:'1982.03.22',confidence:'CONFIRMED'},
  {from:'nhc-early-label',fromName:'N.H.C 초기 표기',to:'nhc',toName:'비선형 위난사령부',relationType:'DISPUTED ACRONYM REFERENCE',direction:'none',label:'장비 규격·현장대 호출명·후대 편집 라벨 가설 / 조직 연속성 미확정',period:'1984 기록 / 1993 사령부',confidence:'DISPUTED'},
  {from:'uac',fromName:'통합 이상현상 협약체',to:'nhc',toName:'비선형 위난사령부',relationType:'FORMER COMMAND',direction:'forward',label:'2001년 별도 지휘권 확보 전 조정체계',period:'1993–2001',confidence:'CONFIRMED'},
  {from:'uac',fromName:'통합 이상현상 협약체',to:'nhc',toName:'비선형 위난사령부',relationType:'COMPACT SUPPORT',direction:'bidirectional',label:'상급·하급이 아닌 접근권·현장지원 협약',period:'2001–',confidence:'CONFIRMED'},
  {from:'uac',fromName:'통합 이상현상 협약체',to:'sid',toName:'신호무결성국',relationType:'FORMER DEPARTMENT',direction:'forward',label:'2001년 별도 지휘권 확보 전 조사부 편제',period:'1993–2001',confidence:'CONFIRMED'},
  {from:'uac',fromName:'통합 이상현상 협약체',to:'sid',toName:'신호무결성국',relationType:'COOPERATION',direction:'bidirectional',label:'증거 판정과 접근기록 교환',period:'2001–',confidence:'CONFIRMED'},
  {from:'nhc',fromName:'비선형 위난사령부',to:'ashcrew',toName:'애시 크루',relationType:'FORMER COMMAND / SPLIT',direction:'forward',label:'사후처리 갈등 뒤 이탈한 현장팀 계보',period:'–2005',confidence:'CORROBORATED'},
  {from:'nhc',fromName:'비선형 위난사령부',to:'redwolf',toName:'레드울프',relationType:'FORMER COMMAND / SPLIT',direction:'forward',label:'실험체 운용 갈등 뒤 이탈한 현장팀 계보',period:'–2005',confidence:'CORROBORATED'},
  {from:'redwolf',fromName:'레드울프',to:'son',toName:'단절명령망',relationType:'DEFECTION / JOINING',direction:'forward',label:'이탈 인력 일부가 기존 단절명령망에 합류 / 조직 전체 승계 아님',period:'2005–',confidence:'CORROBORATED'},
  {from:'ashcrew',fromName:'애시 크루',to:'arf',toName:'자산회수대',relationType:'COMMAND',direction:'forward',label:'회수 편제',period:'2005.01.21–',confidence:'CONFIRMED'},
  {from:'ashcrew',fromName:'애시 크루',to:'cpd',toName:'민간인 선별처리부',relationType:'COMMAND',direction:'forward',label:'민간 처리 편제',period:'2005.01.21–',confidence:'CONFIRMED'},
  {from:'fhc',fromName:'개척거주권 컨소시엄',to:'son',toName:'단절명령망',relationType:'TRANSACTION',direction:'bidirectional',label:'지원·운송·임시 거래이며 계보가 아님',period:'복수 시기',confidence:'CORROBORATED'},
  {from:'fhc',fromName:'개척거주권 컨소시엄',to:'poh',toName:'인계보류망',relationType:'TRADE',direction:'bidirectional',label:'사람·표본·시설 통행 거래',period:'복수 시기',confidence:'CORROBORATED'},
  {from:'ushinoda',fromName:'우시노다 공통계통',to:'poh',toName:'인계보류망',relationType:'BROKERAGE',direction:'bidirectional',label:'의식 대상·은신처·운송 경로 중개',period:'복수 시기',confidence:'CORROBORATED'},
  {from:'poh',fromName:'인계보류망',to:'haimun-cell',toName:'하이먼 세포',relationType:'DISPUTED ROUTE USE',direction:'none',label:'같은 운송로 사용 주장만 남음 / 두 조직을 합치지 않음',period:'미확정',confidence:'DISPUTED'}
]);
