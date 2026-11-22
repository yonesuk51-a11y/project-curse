// Project Curse 5.42.0 — alternate Japan technology history and public-history boundaries.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const publicAnchors=[
    {
      id:'fgcs',range:'1982–1992',label:'제5세대 컴퓨터 프로젝트',
      fact:'일본 통상산업성은 1982년 지식정보처리와 병렬추론 기술을 목표로 제5세대 컴퓨터 프로젝트를 시작했다. 사업은 1992년도에 끝났다.',
      boundary:'제6계측계획은 이 공개 사업의 비밀 부문으로 확인되지 않았다. 공개된 병렬처리 연구와 같은 시대의 산업 기반을 빌려 쓴 별도의 비인가 계측 조직으로 분류한다.',
      source:'정보처리학회 컴퓨터박물관',url:'https://museum.ipsj.or.jp/en/computer/other/0002.html'
    },
    {
      id:'optical-network',range:'1982–1985',label:'일본 광간선망 상용화',
      fact:'일본의 상용 광섬유 간선 서비스는 1982년에 시작됐고 일본 종단 광섬유망은 1985년에 완성됐다.',
      boundary:'공개 통신망 자체가 이상현상을 위해 지어졌다는 설정은 쓰지 않는다. 가상 계측실은 독립된 시험 회선에서 되돌아온 신호의 오차만 연구했다.',
      source:'NTT Technical Review',url:'https://www.ntt-review.jp/archive/ntttechnical.php?contents=ntr201503fa10_s.html'
    },
    {
      id:'tron',range:'1984–1987',label:'TRON·ITRON 임베디드 제어',
      fact:'TRON 프로젝트는 1984년에 시작됐으며, 첫 ITRON 규격은 1987년에 개발됐다. 소형 실시간 운영체제는 다양한 임베디드 기기의 제어를 목표로 했다.',
      boundary:'JID-87은 공개된 TRON 규격과 일치하지 않는다. 같은 시대의 개방형 임베디드 제어 흐름을 초상현상 감시 장치에 가져다 쓴 비공개 내부 규격으로 분류한다.',
      source:'TRON Forum',url:'https://www.tron.org/tron-project/itron/'
    },
    {
      id:'bubble',range:'1980년대 후반–1990년대',label:'버블 확대와 붕괴',
      fact:'일본 경제는 1980년대 후반 자산가격 버블과 과열을 겪었고, 버블 붕괴 뒤 1990년대 성장률이 크게 낮아졌다.',
      boundary:'버블의 발생이나 붕괴를 리버스·교단·비밀 기술의 결과로 바꾸지 않는다. 가상 계획은 그때 늘어난 설비투자와 그 뒤 줄어든 예산의 영향을 받았을 뿐이다.',
      source:'일본은행 금융연구소',url:'https://www.imes.boj.or.jp/research/abstracts/english/me19-s1-14.html'
    }
  ];

  const records=[
    {
      id:'1982-04-06-sixth-instrumentation',date:'1982.04.06',sort:19820406,title:'제6계측계획 승인',
      summary:'공개된 컴퓨터 연구와 분리된 작은 보안계측실이, 서로 어긋나는 신호를 나란히 놓고 맞춰 보는 연구를 시작했다.',
      era:'origin',evidence:'corroborated',documentType:'official',author:'내각 기술보안회의 제6분과',recipient:'국가시차계측실 설립준비반',purpose:'비정합 신호 연구의 범위와 공개사업 분리 승인',
      basis:'서로 다른 부처의 장비 인계표와 설립 승인서에서 연구실 이름·인원·첫 시험일이 일치한다.',sourceState:'보안 승인서 / 공개사업 명단과 분리 확인',
      fragments:[
        {label:'공개사업 경계',kind:'document',text:'제5세대 컴퓨터 연구의 예산과 연구자, 성과물은 공개 산업정책에 속한다. 제6분과는 그 사업의 하위조직으로 활동하지 않으며 민간 연구자에게 비정합 현상 자료를 넘기지 않는다.'},
        {label:'설립 명령',kind:'directive',text:'같은 음성·같은 좌표를 주장하면서 도착 시간이 서로 다른 신호를 병렬로 맞춰 본다. 내용이 참인지 거짓인지 가리려 하지 말 것. 수신 경로, 기준시계, 광학 반환값의 차이만 기록할 것.'},
        {label:'조달 주석',kind:'annotation',text:'초기 장비는 시중에서 파는 계측기와 국산 프로세서를 짜 맞췄다. 아마리온이나 F.H.C의 공간 장치가 핵심부에 쓰였다는 증거는 없다. 공급업체 코드 두 건은 회사 승계대장과 형식이 비슷하다. 원본 송장은 남아 있지 않다.'}
      ]
    },
    {
      id:'1985-09-18-optical-return-test',date:'1985.09.18',sort:19850918,title:'광반환 지문 시험',
      summary:'독립된 광시험선에서, 메시지 내용 대신 신호가 지나온 공간의 반환 오차를 가려내는 데 성공했다.',
      era:'origin',evidence:'observed',documentType:'field',author:'제6계측실 광반환시험반',recipient:'기술보안회의 제6분과',purpose:'독립 광회선에서 되풀이한 비정합 시험 보고',
      basis:'보낸 원문은 같았다. 세 시험기의 반환 위상과 지연 배열은 경로마다 되풀이해 재현됐다.',sourceState:'시험 테이프 3본 / 원 송신장치 폐기',
      fragments:[
        {label:'시험 기록',kind:'log',text:'09:14  기준문 32자 송신 / A·B 회선 정상\n09:14  C 회선 0.7초 선행 수신\n09:16  기준문 재송신 / 문자열 동일\n09:16  C 회선 반환 위상만 이전 시험과 일치\n09:22  송신기 교체 뒤에도 C 지문 유지'},
        {label:'현장 결론',kind:'analysis',text:'조작된 메시지는 원문을 흉내 낼 수 있다. 경로 전체의 지연과 반환 위상은 한꺼번에 베끼지 못했다. 시험반은 이 배열을 광반환 지문이라 불렀다. 무엇이 C 회선을 지나갔는지는 보고하지 않았다.'},
        {label:'공개망 경계',kind:'annotation',text:'시험은 상용 종단망과 물리적으로 떨어진 회선에서 이뤄졌다. 일본의 공개 광통신망이 이상현상을 지켜보는 장치였다거나 대중 통신을 감시했다는 근거로 쓰지 않는다.'}
      ]
    },
    {
      id:'1987-11-04-jid87-standard',date:'1987.11.04',sort:19871104,title:'JID-87 분산계측 규격',
      summary:'공개하지 않는 규격이 정해졌다. 제조사가 달라도 작은 장치들이 시간 차이와 반환 지문을 같은 형식으로 보고하게 했다.',
      era:'exposure',evidence:'confirmed',documentType:'official',author:'국가시차계측실 규격과',recipient:'승인 제조사·도시 기반시설 시험소',purpose:'분산계측 노드의 기록 형식과, 중앙 없이 돌아가는 조건을 정함',
      basis:'규격 원본과 세 제조사의 적합성 시험표가 같은 필드 구조와 오류 코드를 사용한다.',sourceState:'JID-87 원본 / 제조사 시험기록 보존',
      fragments:[
        {label:'핵심 규격',kind:'document',text:'각 노드는 중앙망이 끊겨도 독립시계 세 개가 맞춘 값과 광반환 지문, 감지기 상태를 그대로 남긴다. 장비 제조사와 운영체제가 달라도 기록은 같은 48바이트 봉투에 담아 내보낸다.'},
        {label:'금지 조항',kind:'directive',text:'노드는 사람의 신원, 대화 내용, 영상 원본을 모으지 않는다. 비정합 판정은 경로와 시간축에만 적용한다. 현장기관이 따로 감청 기능을 덧붙이면 JID 적합 표식을 떼어 낼 것.'},
        {label:'후대 감사',kind:'annotation',text:'금지 조항은 모든 지역에서 지켜지지 않았다. 몇몇 공안 시험소는 출입기록과 계측값을 합쳤다. 그 목록은 1993년 S.I.D 초기 도시 감시망으로 넘어갔다.'}
      ]
    },
    {
      id:'1990-04-12-municipal-mesh-pilot',date:'1990.04.12',sort:19900412,title:'도시 비정합망 실증',
      summary:'교통·전력·방재 설비에 숨은 계측 노드 64개가, 중앙 회선이 끊긴 뒤에도 사건 순서를 하나로 되살려 냈다.',
      era:'exposure',evidence:'corroborated',documentType:'review',author:'동부권 도시기반망 실증위원회',recipient:'참여 지자체·제6계측실',purpose:'분산계측망이 민간에 주는 쓸모와 감시 위험 평가',
      basis:'교통신호기·변전설비·방재단말이 따로 남긴 로그에서 끊긴 시각과 복구 순서가 일치한다.',sourceState:'지자체 실증보고 / 위치 목록 일부 비공개',
      fragments:[
        {label:'실증 결과',kind:'analysis',text:'중앙 회선이 11분 동안 끊겼다. 각 노드는 지역 시계와 이웃 장치의 확인값을 그대로 남겼다. 복구 뒤 64개 기록을 합쳤다. 전력 저하, 신호기 정지, 비정합 파형의 순서를 초 단위로 되짚을 수 있었다.'},
        {label:'민간측 의견',kind:'quote',text:'“방재망이 끊겨도 기록이 남는다는 설명은 이해합니다. 어느 도로와 건물에 장치가 있는지 주민에게 말할 수 없다는 답은 이해하기 어렵습니다.”'},
        {label:'위원회 판정',kind:'annotation',text:'분산 구조는 재난복구와 산업제어에 쓸모가 있었다. 위치 비공개, 공안자료와의 결합, 잘못 탐지된 지역의 부동산 불이익은 해결되지 않았다. 실증망 주변에 투자가 갑자기 늘어난 일은 그때의 버블경제와 함께 다뤄야 한다. 계측계획이 자산가격 상승의 원인이었다고 기록하지 않는다.'}
      ]
    },
    {
      id:'1992-10-30-sixth-program-dispersal',date:'1992.10.30',sort:19921030,title:'제6계측계획 분산 보존',
      summary:'버블 붕괴 뒤 중앙 예산은 끊겼다. 그래도 규격과 노드는 철도·방재·산업 설비 곳곳에 흩어진 채 살아남았다.',
      era:'exposure',evidence:'corroborated',documentType:'contested',author:'제6계측실 해산위원회 / 후대 S.I.D 감사반',recipient:'내각 기술보안회의',purpose:'중앙계획 종료와 남은 장치의 소유권을 맞춰 봄',
      basis:'해산명령과 지자체 자산대장의 장치 수는 다르다. 중앙 인력을 해제한 날과 규격을 넘겨받은 곳은 일치한다.',sourceState:'해산명령 / 지역 자산대장 수량 상충',
      fragments:[
        {label:'해산 통보',kind:'document',text:'중앙 연구실과 전용 시험회선을 닫는다. JID-87 규격, 광반환 지문 라이브러리, 유지보수 권한은 승인된 지자체·철도·방재기관에 나눠 넘긴다. 공개 제5세대 컴퓨터 사업의 평가와 이 계획의 종료를 한 문서로 발표하지 않는다.'},
        {label:'수량 상충',kind:'analysis',text:'해산위원회는 돌아가던 노드 418개를 기록했다. 지역 자산대장에서는 603개가 확인된다. 차이 가운데 일부는 공장 자동화와 가정용 실증설비로 다시 분류됐다. 37개는 주소 자체가 검게 지워져 있다.'},
        {label:'1993년 이후',kind:'annotation',text:'U.A.C 공개 설립 뒤 일본은 원본 로그를 넘기지 않았다. 인터페이스 규격과 반환 지문 비교법만 내주었다. 이 기술은 훗날 C.I. 스캐너와 북부전선의 복제 신호 분리 절차에 들어갔다. 두 장비는 일본제 장치에서 이름만 바꾼 것이 아니다.'}
      ]
    }
  ];

  const technologies=[
    {id:'parallel-correlation',record:'1982-04-06-sixth-instrumentation',name:'병렬 비정합 대조',code:'J6-CORR',state:'classified',summary:'신호 내용 대신, 여러 수신기에 들어온 시간과 경로의 차이를 한꺼번에 비교한다.'},
    {id:'optical-fingerprint',record:'1985-09-18-optical-return-test',name:'광반환 지문',code:'ORP',state:'confirmed',summary:'신호가 지나온 길의 지연과 반환 위상 배열을 지문처럼 기록한다.'},
    {id:'distributed-node',record:'1987-11-04-jid87-standard',name:'JID-87 노드',code:'JID-87',state:'confirmed',summary:'중앙망이 끊겨도, 기준시계 셋과 주변 장치가 맞춘 값을 남겨 둔다.'},
    {id:'municipal-mesh',record:'1990-04-12-municipal-mesh-pilot',name:'도시 비정합망',code:'CIVIC-MESH',state:'corroborated',summary:'교통·전력·방재 설비에 흩어진 기록으로 사건 순서를 되살린다.'},
    {id:'dispersed-archive',record:'1992-10-30-sixth-program-dispersal',name:'분산 보존 규격',code:'J6-ARCHIVE',state:'contested',summary:'중앙계획이 해산된 뒤에도 지역 설비에는 규격과 노드가 남아 있다.'},
    {id:'ci-scanner',record:'2003-02-05-city-barrier',name:'C.I. 스캐너 계통',code:'DOWNSTREAM / 2003',state:'derived',summary:'광반환 지문과 독립시계 합의 개념이 도시 차단망의 일부 판정 절차로 이어진다.'},
    {id:'northern-protocol',record:'2026-08-20-northern-reversal',name:'북부 복제신호 분리',code:'DOWNSTREAM / 2026',state:'derived',summary:'보낸 사람의 목소리 대신 신호가 지나온 공간의 왜곡을 비교해 가짜 구조 신호를 가려낸다.'}
  ];

  const edges=[
    {from:'parallel-correlation',to:'optical-fingerprint',label:'경로 특징 추출'},
    {from:'optical-fingerprint',to:'distributed-node',label:'소형 노드 표준화'},
    {from:'distributed-node',to:'municipal-mesh',label:'도시 설비 실증'},
    {from:'municipal-mesh',to:'dispersed-archive',label:'중앙 해산 뒤 이관'},
    {from:'optical-fingerprint',to:'ci-scanner',label:'판정 개념 제공'},
    {from:'dispersed-archive',to:'northern-protocol',label:'장기 운용 계보'}
  ];

  root.ProjectCurseJapanTechnology=freeze({
    version:root.ProjectCurseBuild?.version||'5.42.0',schema:'project-curse-japan-technology-v1',
    program:{name:'제6계측계획',code:'J6 INSTRUMENTATION PROGRAM',period:'1982–1992 / DISTRIBUTED LEGACY',status:'CENTRAL OFFICE CLOSED',purpose:'흉내 낼 수 있는 메시지 대신, 흉내 내기 어려운 시간과 경로의 흔적을 잰다.'},
    publicAnchors,records,technologies,edges,
    socialOutcomes:[
      {label:'민간 기술',text:'분산 제어와, 고장 뒤 기록을 되살리는 기술이 철도·방재·공장 자동화에 일찍 퍼졌다.'},
      {label:'보이지 않는 비용',text:'폐쇄형 유지보수와 검게 지워진 주소, 잘못 탐지된 지역의 낙인이 오랜 빚으로 남았다.'},
      {label:'경제 기록 대조',text:'버블기의 설비투자는 이 기술이 퍼지는 속도를 높였다. 다만 버블이 생긴 원인과 꺼진 때는 공개된 경제 기록 그대로다.'},
      {label:'국제 계승',text:'일본은 원본 감시 자료는 넘기지 않았다. 인터페이스와 경로 비교법만 넘겨 독립 지휘권을 지켰다.'}
    ],
    openQuestions:[
      '1982년 구매 코드 두 건이 왜 아마리온 승계망과 닮았는지는 확인되지 않았다.',
      '1992년 해산대장보다 많은 노드 185개 가운데 37개는, 위치도 넘겨받은 기관도 지워져 있다.',
      '가정용 실증설비로 분류된 노드가 실제로 일반 가정에 설치됐는지는 확인할 자료가 부족하다.'
    ],
    getRecord:id=>records.find(record=>record.id===id)||null,
    getTechnology:id=>technologies.find(item=>item.id===id)||null
  });
})(window);
