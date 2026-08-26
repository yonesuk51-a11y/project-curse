export const MAP_DISCLOSURE=Object.freeze({
  title:'비항법 작전 투영',
  coordinateType:'DISPLAY_PLOT',
  navigation:'PROHIBITED',
  statement:'이 화면의 위치는 통제권·관측 군집·기록 관계를 읽기 위한 도식이다. 실제 거리, 국경, 이동 시간이나 안전 경로를 제공하지 않는다.',
  warnings:[
    '검열된 위치는 공개 좌표로 복원하지 않는다.',
    '동시에 관측된 신호를 하나의 이동 경로나 동일 원인으로 연결하지 않는다.',
    '적대 세력의 문서와 귀환자 증언은 확인된 현장 기록과 분리한다.'
  ]
});

const claimSet=(occurrence,time,location,cause,relation,outcome)=>Object.freeze({occurrence,time,location,cause,relation,outcome});
const plotPosition=(x,y,basis)=>Object.freeze({plot:Object.freeze({x,y}),geo:null,basis,navigation:'PROHIBITED'});

export const MAP_CLAIMS=Object.freeze({
  signals:Object.freeze({
    'jp-control':claimSet('CORROBORATED','CURRENT OBSERVATION','ESTIMATED','NOT APPLICABLE','CORROBORATED','UNRESOLVED'),
    'north-line':claimSet('CORROBORATED','MIXED','ESTIMATED','NOT APPLICABLE','CORROBORATED','UNRESOLVED'),
    'blood-lake':claimSet('OBSERVED','DISPUTED','REDACTED','UNRESOLVED','UNRESOLVED','UNRESOLVED'),
    'southern-muster':claimSet('CLAIMED','UNRESOLVED','ESTIMATED','HOSTILE CLAIM','UNRESOLVED','PROJECTED'),
    'dz-return':claimSet('CORROBORATED','MIXED','DISPUTED','UNRESOLVED','TESTIMONY','MIXED'),
    'three-night-gbf':claimSet('OBSERVED','CORROBORATED','ESTIMATED','UNRESOLVED','UNRESOLVED','UNRESOLVED'),
    'three-night-dz':claimSet('OBSERVED','CORROBORATED','DISPUTED','UNRESOLVED','UNRESOLVED','UNRESOLVED')
  }),
  operations:Object.freeze({
    immortality:claimSet('OBSERVED','DISPUTED','REDACTED','UNRESOLVED','UNRESOLVED','UNRESOLVED'),
    'three-night':claimSet('CORROBORATED','CORROBORATED','MIXED','UNRESOLVED','UNRESOLVED','UNRESOLVED'),
    'sixth-line':claimSet('CORROBORATED','MIXED','ESTIMATED','NOT APPLICABLE','CORROBORATED','UNRESOLVED'),
    'broken-crown':claimSet('CLAIMED','UNRESOLVED','ESTIMATED','HOSTILE CLAIM','UNRESOLVED','PROJECTED'),
    'deadzone-return':claimSet('CORROBORATED','MIXED','DISPUTED','UNRESOLVED','TESTIMONY','MIXED')
  })
});

export const MAP_REGIONS=Object.freeze([
  {id:'deadzone',code:'DZ-00',name:'데드 존',x:7,y:20,w:27,h:34,shape:'deadzone',status:'국가 소실 / 귀환 판정 불가',basis:'복수 기록 일치',copy:'국가 경계 대신 검문소와 귀환자의 동일성 판정으로 구획된다.'},
  {id:'great-black-forest',code:'GBF-∞',name:'대흑림',x:21,y:56,w:19,h:35,shape:'forest',status:'거리·방향 비고정',basis:'현장 증언 / 지도 불일치',copy:'성채와 마을은 존재하지만 같은 길이 같은 장소로 되돌아간다는 보장은 없다.'},
  {id:'central-europe',code:'EU-R',name:'유럽 검열권',x:45,y:25,w:17,h:23,shape:'europe',status:'1986 작전 위치 검열',basis:'보호 원문',copy:'피의 호수 작전은 독일 본토의 [검열] 지역만 명시한다. 기호는 실제 좌표가 아니다.'},
  {id:'northern-front',code:'NF-06',name:'북부전선',x:67,y:13,w:21,h:23,shape:'north',status:'제6차 차단선 교전',basis:'복수 감청 / 재구성',copy:'점유지가 아니라 소모되는 완충지로 관리되는 전선권.'},
  {id:'japan',code:'JP-06',name:'일본 계측권',x:78,y:34,w:13,h:23,shape:'japan',status:'도시 회랑 유지',basis:'기관 기록',copy:'측정과 복구 회랑이 유지되는 동안 바깥 주민은 행정상 사망자로 처리된다.'},
  {id:'southern-coast',code:'SC-B',name:'남부 해안 동원권',x:33,y:75,w:14,h:14,shape:'coast',status:'동시 소환 준비 주장',basis:'적대 세력 정보 / 미확정',copy:'남부 혈교와 해안 세력이 도시 교란부대를 준비했다는 문서가 있으나 지휘 계통은 확인되지 않았다.'}
].map(item=>Object.freeze({...item,position:plotPosition(item.x,item.y,item.basis)})));

export const MAP_SIGNALS=Object.freeze([
  {id:'jp-control',code:'JP-06',name:'제6계측 회랑',x:84,y:45,kind:'control',status:'관측 지속',basis:'기관 기록',certainty:'높음',summary:'도시 회랑과 장애 복구망의 현재 관측 중심.',factions:['uac','sid'],operationId:'sixth-line'},
  {id:'north-line',code:'NF-L6',name:'북부 제6차 차단선',x:77,y:23,kind:'front',status:'교전 지속',basis:'복수 감청',certainty:'중간',summary:'2026년 이후 전황이 뒤집혔다는 보고가 겹치지만 회복된 영토의 상태는 확인되지 않았다.',factions:['nhc'],operationId:'sixth-line'},
  {id:'blood-lake',code:'OP-860201',name:'피의 호수 검열구역',x:53,y:36,kind:'incident',status:'공개 좌표 없음',basis:'Immortality_860201 보호 원문 / N.H.C.-86 표기 판정 보류',certainty:'위치 검열 / 조직 관여 미확정',summary:'독일 본토 [검열] 지역. N.H.C 표기는 장비 규격·현장대 호출명·후대 편집 라벨 가설이 상충하며, 지도 기호는 실제 좌표가 아니다.',factions:[],operationId:'immortality'},
  {id:'southern-muster',code:'SC-MASS',name:'남부 동시 소환 주장',x:39,y:82,kind:'hostile',status:'실행 시점 미확정',basis:'적대 세력 정보',certainty:'낮음',summary:'도시별 특수부대와 소환 시도가 계획되었다는 문서. 실제 지휘권과 규모는 판정되지 않았다.',factions:['southern-blood'],operationId:'broken-crown'},
  {id:'dz-return',code:'DZ-GATE',name:'귀환 검문 군집',x:18,y:38,kind:'passage',status:'귀환자 동일성 심사',basis:'검문 기록 / 귀환자 증언',certainty:'중간',summary:'검문소마다 출발·귀환 시간이 다르게 기록된다. 연결선은 실제 안전 경로가 아니다.',factions:['deadzone-blood','cpd'],operationId:'deadzone-return'},
  {id:'gbf-fort-01',code:'GBF-F01',name:'대흑림 성채 관측 01',x:27,y:65,kind:'silence',status:'삼야 무응답',basis:'현장 관측',certainty:'군집만 확인',summary:'이름과 실제 좌표가 공개되지 않은 성채 관측점.',factions:[],operationId:'three-night'},
  {id:'gbf-fort-02',code:'GBF-F02',name:'대흑림 성채 관측 02',x:32,y:63,kind:'silence',status:'삼야 무응답',basis:'현장 관측',certainty:'군집만 확인',summary:'동시 관측은 확인되지만 다른 성채와의 물리 연결은 확인되지 않았다.',factions:[],operationId:'three-night'},
  {id:'gbf-fort-03',code:'GBF-F03',name:'대흑림 성채 관측 03',x:35,y:69,kind:'silence',status:'삼야 무응답',basis:'현장 관측',certainty:'군집만 확인',summary:'61시간 1분 동안 응답이 끊긴 여섯 성채 중 하나.',factions:[],operationId:'three-night'},
  {id:'gbf-fort-04',code:'GBF-F04',name:'대흑림 성채 관측 04',x:29,y:75,kind:'silence',status:'삼야 무응답',basis:'현장 관측',certainty:'군집만 확인',summary:'후속대 귀환 기록 없음. 실종과 사망은 구분되지 않았다.',factions:[],operationId:'three-night'},
  {id:'gbf-fort-05',code:'GBF-F05',name:'대흑림 성채 관측 05',x:34,y:80,kind:'silence',status:'삼야 무응답',basis:'현장 관측',certainty:'군집만 확인',summary:'대흑림의 거리 비정합 때문에 인접 여부를 확정할 수 없다.',factions:[],operationId:'three-night'},
  {id:'gbf-fort-06',code:'GBF-F06',name:'대흑림 성채 관측 06',x:26,y:84,kind:'silence',status:'삼야 무응답',basis:'현장 관측',certainty:'군집만 확인',summary:'여섯 번째 성채 관측점. 화면상 배열은 실제 지리 순서가 아니다.',factions:[],operationId:'three-night'},
  {id:'dz-post-01',code:'DZ-P01',name:'데드 존 검문 관측 01',x:12,y:29,kind:'silence',status:'삼야 무응답',basis:'현장 관측',certainty:'군집만 확인',summary:'동일 시간대 무응답 네 검문소 중 하나.',factions:[],operationId:'three-night'},
  {id:'dz-post-02',code:'DZ-P02',name:'데드 존 검문 관측 02',x:20,y:27,kind:'silence',status:'삼야 무응답',basis:'현장 관측',certainty:'군집만 확인',summary:'대흑림 성채와의 인과관계는 확인되지 않았다.',factions:[],operationId:'three-night'},
  {id:'dz-post-03',code:'DZ-P03',name:'데드 존 검문 관측 03',x:27,y:34,kind:'silence',status:'삼야 무응답',basis:'현장 관측',certainty:'군집만 확인',summary:'같은 호출명을 사용했다는 기록만 남아 있다.',factions:[],operationId:'three-night'},
  {id:'dz-post-04',code:'DZ-P04',name:'데드 존 검문 관측 04',x:15,y:47,kind:'silence',status:'삼야 무응답',basis:'현장 관측',certainty:'군집만 확인',summary:'네 번째 검문 관측점. 후속대의 이동 경로는 공개되지 않았다.',factions:[],operationId:'three-night'}
].map(item=>Object.freeze({...item,position:plotPosition(item.x,item.y,item.certainty||item.basis)})));

export const MAP_CONNECTIONS=Object.freeze([
  {id:'north-pressure',label:'북부 차단선 보급·감청 관계',from:[84,45],to:[77,23],kind:'observed',basis:'복수 감청',warning:'실제 이동 경로 아님'},
  {id:'deadzone-testimony',label:'검문 장부 간 귀환 증언 대조',from:[12,46],to:[27,29],kind:'testimony',basis:'귀환자 증언',warning:'실제 순례길·안전 통행로 아님'},
  {id:'southern-pressure',label:'남부 문서가 주장한 북부 전력 분산',from:[39,82],to:[77,23],kind:'hostile',basis:'적대 세력 정보',warning:'실행 여부·규모·지휘권 미확정'}
]);

export const MAP_OPERATIONS=Object.freeze([
  {
    id:'immortality',code:'OP-IMMORTALITY / 860201',title:'피의 호수 투입 기록',presentation:'OPERATION COPY',openLabel:'보호 기록 작전 사본 열기',date:'1986.02.01 / 1986.07.25',state:'PROTECTED-SOURCE ALIGNED / DATE DISPUTED',basis:'Immortality_860201 보호 원문 / N.H.C.-86 표기 판정 보류',confidence:'시간 기록 직접 확인 / 날짜 관계·위치·N.H.C 표기 성격·조직 관여 미확정',theatre:'독일 본토 [검열] 지역',lossLabel:'RECORD GAP',loss:'생환·구조 결과가 기록되지 않은 채 COMPLETE 처리',factionLabel:'RELATED MARKS / NONE CONFIRMED',warning:'기호 위치와 단계 간격은 실제 거리나 이동 시간을 뜻하지 않는다.',factions:[],
    steps:[
      {time:'16:10–16:46',title:'투입과 전진',copy:'3일치 보급, 지원팀 대기, 안개·입자·미확인 물체 보고.',basis:'직접 기록'},
      {time:'17:02–17:58',title:'텐트와 붉은 수역',copy:'민간 흔적과 혈액성 수역을 확인했지만 철수 명령은 남지 않았다.',basis:'직접 기록'},
      {time:'18:06–18:42',title:'지원선 소실',copy:'예거트 이상, 유닛4 통신 두절, 밀로 추적 신호 충돌이 이어진다.',basis:'직접 기록'},
      {time:'18:44–19:00',title:'마지막 송신',copy:'출처 불명 통신과 이미지 뒤 시스템이 임무를 완료로 바꾼다.',basis:'직접 기록'}
    ]
  },
  {
    id:'three-night',code:'OBS-2042 / 61:01',title:'삼야 무응답 동시 관측',presentation:'SYNCHRONY EVIDENCE COPY',openLabel:'동시성 증거 대조 열기',date:'2042.10.28–10.31',state:'SIMULTANEOUS / CAUSE UNRESOLVED',basis:'대흑림 성채 6·데드 존 검문 4 현장 관측',confidence:'동시성 확인 / 시간대 보정·연결 관계 미확정',theatre:'대흑림·데드 존 독립 관측 군집',lossLabel:'RECOVERY STATUS',loss:'후속대 귀환 기록 없음 / 실종과 사망 판정 보류',factionLabel:'RELATED MARKS / NONE CONFIRMED',warning:'열 점 사이에 물리 경로·포털·단일 주체가 있었다고 해석하지 않는다.',factions:[],
    steps:[
      {time:'START / TZ UNRESOLVED',title:'독립 신호 손실',copy:'서로 먼 열 관측점이 같은 시간창 안에서 응답을 멈춘다.',basis:'현장 관측'},
      {time:'WITHIN WINDOW / ORDER UNRESOLVED',title:'지역 규칙 충돌',copy:'성채와 검문소의 시계·호출명이 서로 다르게 남는다.',basis:'복수 기록'},
      {time:'FOLLOW-UP / TIME UNRECORDED',title:'후속대 투입',copy:'각 지역에서 별도로 파견된 후속대의 귀환 기록이 사라진다.',basis:'회수 기록 부재'},
      {time:'61H 01M / WINDOW CLOSED',title:'삼야 무응답 분류',copy:'동일 사건명이 부여되지만 원인은 끝내 합쳐지지 않는다.',basis:'후대 분류'}
    ]
  },
  {
    id:'sixth-line',code:'NF-06 / LINE STATE',title:'북부 제6차 차단선',presentation:'FRONTLINE ANALYSIS COPY',openLabel:'전선 분석 사본 열기',date:'2026–2042',state:'ACTIVE FRONT / RECOVERY UNPROVEN',basis:'복수 감청과 전선 보고의 재구성',confidence:'교전 추세 중간 / 점유지 상태 낮음',theatre:'북부전선·일본 계측권',lossLabel:'OPERATING COST / RECONSTRUCTED',loss:'회복 불가능 구역을 유지하기 위해 손실 인원 집계를 중단',factionLabel:'ANALYTICALLY ASSOCIATED MARKS',warning:'전진은 영토 회복이나 민간 생환을 뜻하지 않는다.',factions:[{id:'nhc',relation:'FIELD-ATTESTED'},{id:'uac',relation:'COMPACT SUPPORT'},{id:'sid',relation:'SIGNAL ASSESSMENT'}],
    steps:[
      {time:'MEASURE',title:'계측',copy:'S.I.D가 경로·신호 정합성을 판정한다.',basis:'기관 교리'},
      {time:'HOLD',title:'차단',copy:'N.H.C가 짧은 회수 회랑을 열고 병력을 소모한다.',basis:'전선 보고'},
      {time:'SEAL',title:'봉쇄',copy:'U.A.C가 통제 가능한 기록과 물자만 공통망에 등록한다.',basis:'협약 절차'},
      {time:'ABANDON',title:'철수',copy:'유지 비용이 기준을 넘으면 거주민과 차단선을 함께 폐기한다.',basis:'재구성 / 판정 대기'}
    ]
  },
  {
    id:'broken-crown',code:'SC-B / BROKEN CROWN',title:'남부 동원 문서',presentation:'HOSTILE DOCUMENT RECONSTRUCTION',openLabel:'적대 문서 재구성 열기',date:'시점 미확정',state:'HOSTILE INTELLIGENCE',basis:'남부 세력 내부 문서로 주장되는 파편',confidence:'낮음 / 실행 증거 부족',theatre:'대흑림 해안·복수 도시 주장',lossLabel:'CLAIMED OBJECTIVE / PROJECTED LOSS',loss:'도시 교란으로 적 전력과 구조 자원을 분산시키려는 계획',factionLabel:'MARKS NAMED IN HOSTILE DOCUMENT',warning:'계획의 존재·규모·지휘권 모두 V6 정사 확정 사항이 아니다.',factions:[{id:'southern-blood',relation:'NAMED'},{id:'blood',relation:'RELATION UNRESOLVED'},{id:'ushinoda',relation:'RELATION UNRESOLVED'}],
    steps:[
      {time:'CELL',title:'특수부대 침투',copy:'성직자·경비 조직에 공작원이 들어간다는 주장.',basis:'적대 세력 정보'},
      {time:'SIGNAL',title:'소환 신호',copy:'복수 도시에서 비슷한 의식 신호를 동시에 발생시킨다는 계획.',basis:'적대 세력 정보'},
      {time:'DIVERT',title:'전력 분산',copy:'북부전선의 병력과 구조 자원을 남쪽으로 돌리려 한다.',basis:'분석 추정'},
      {time:'PURGE',title:'내부 제거',copy:'작전 뒤 살아남은 공작원까지 처형 대상으로 분류한다.',basis:'문서 주장'}
    ]
  },
  {
    id:'deadzone-return',code:'DZ-R / RETURN LEDGER',title:'데드 존 귀환 대조',presentation:'TESTIMONY COMPARISON',openLabel:'귀환 증언 대조 열기',date:'2008–2042',state:'TESTIMONY-BASED ROUTE',basis:'검문 기록·귀환자 증언·혈교 지부 문서',confidence:'귀환 사례 확인 / 동일성 판정 불가',theatre:'데드 존 검문 군집',lossLabel:'RETURN COST / TESTIMONY',loss:'귀환자는 피·관계 기록·장기 채무를 남기고도 같은 사람임을 보증받지 못함',factionLabel:'ASSOCIATED MARKS / MIXED EVIDENCE',warning:'화면의 연결은 증언 대조 순서이며 실제 순례길이 아니다.',factions:[{id:'deadzone-blood',relation:'FIELD-ATTESTED'},{id:'cpd',relation:'ANALYTICAL'}],
    steps:[
      {time:'ENTRY',title:'출발 등록',copy:'출발 시각과 동행 관계를 여러 장부에 중복 기록한다.',basis:'검문 절차'},
      {time:'SILENCE',title:'대륙 내 무응답',copy:'내부 이동은 관측되지 않고 서로 다른 시간 기록만 돌아온다.',basis:'기록 공백'},
      {time:'RETURN',title:'귀환 신호',copy:'몸·장비·기억의 기준상이 서로 일치하지 않을 수 있다.',basis:'귀환자 증언'},
      {time:'JUDGMENT',title:'동일성 판정',copy:'심사를 통과하지 못한 귀환자는 구조 대상이 아니라 격리 자산이 된다.',basis:'검문 기록'}
    ]
  }
]);
