// Project Curse 5.36.2 — authored prose, document voices and archival fragments.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const documentTypes={
    official:{code:'OFFICIAL CHRONOLOGY',label:'공식 연표'},
    field:{code:'FIELD REPORT',label:'현장 보고'},
    review:{code:'AFTER-ACTION REVIEW',label:'사후 검토'},
    interview:{code:'INTERVIEW EXTRACT',label:'증언 발췌'},
    intercept:{code:'SIGNAL INTERCEPT',label:'감청 기록'},
    forensic:{code:'FORENSIC REVIEW',label:'감식 보고'},
    analysis:{code:'LATER ANALYSIS',label:'후대 분석'},
    contested:{code:'CONTESTED RECORD',label:'상충 기록'}
  };

  const records={
    '1975-09-12-amarion':{
      documentType:'official',author:'아마리온 법인기록실',recipient:'미국 연방 계약심사국',purpose:'법인 설립 및 연구 목적 등록',
      fragments:[
        {label:'설립 신고',kind:'document',text:'아마리온은 1975년 9월 12일 법인 등록을 마쳤다. 신고된 사업은 인구 증가와 자원 부족에 대비한 공간 개척 연구였다. 저근접 자기 왜곡 시스템은 신규 공간에 대한 접근 수단으로 기재됐고, 그 공간에서 얻는 자원과 통행권은 회사 자산으로 처리됐다.'},
        {label:'후대 대조',kind:'annotation',text:'F.H.C 승계 감사에서 아마리온 장비의 폐기 증빙은 발견되지 않았다. 연구 책임자와 핵심 기술진 대부분은 1982년 F.H.C 명부에서 다시 확인된다. 두 회사 사이의 자금 이동 내역은 공개 대상에서 빠져 있다.'}
      ]
    },
    '1975-distortion-system':{
      documentType:'analysis',author:'U.A.C 초기현상 재검토반',recipient:'연대기 편찬실',purpose:'왜곡 실험과 초기 이상신고의 시간 관계 검토',
      fragments:[
        {label:'대조 결과',kind:'analysis',text:'아마리온의 첫 가동일 이후 실종, 통신 장애와 생체 변질 신고가 늘어난 것은 맞다. 신고지는 서로 떨어져 있었고 당시 수사기관은 산업재해, 가출과 종교 집회로 각각 종결했다. 같은 원인에서 나왔다는 물증은 남지 않았다.'},
        {label:'편찬 주의',kind:'annotation',text:'우시노다교 활동이 실험 뒤 시작됐다고 적은 문서는 모두 1993년 이후에 작성됐다. 실험이 통로를 만들었는지, 이미 존재하던 현상을 측정했는지는 현재 자료로 구분할 수 없다.'}
      ]
    },
    '1982-03-22-fhc':{
      documentType:'official',author:'F.H.C 대외협력실',recipient:'정부 연구계약 담당기관',purpose:'신설 법인과 승계 연구시설 등록',
      fragments:[
        {label:'등록 내용',kind:'document',text:'F.H.C는 1982년 3월 22일 기술·연구 기업으로 등록됐다. 정부 계약서에는 아마리온 출신 연구진과 장비를 인수한다는 조항이 있으나, 공간 연구라는 명칭은 사용되지 않았다.'},
        {label:'감사 메모',kind:'annotation',text:'설립 첫해 계약 가운데 일부는 연구 결과가 아니라 시설 접근권을 납품 대상으로 삼았다. 계약 담당자는 해당 조항을 표준 보안 조건으로 처리했으며 별도 검토를 요청하지 않았다.'}
      ]
    },
    '1982-uac-watch':{
      documentType:'contested',author:'U.A.C 설립사 조사관',recipient:'초대 기록위원회',purpose:'아이반 레스작의 비인가 감시망 복원',
      fragments:[
        {label:'남은 기록',kind:'analysis',text:'레스작의 이름이 적힌 정식 창설 문서는 없다. 같은 시기 F.H.C 시설을 추적한 소규모 인원과 비인가 예산이 있었다는 사실만 여러 부처의 결손 장부에서 반복된다.'},
        {label:'관계자 진술 04',kind:'quote',text:'“사진 속에는 분명 같이 서 있습니다. 그런데 얼굴을 봐도 누구였는지 생각이 안 납니다. 숲에서 검은 것이 나무 밑동을 타고 올라가던 건 기억합니다. 그 사람이 거기 있었는지는 모르겠습니다.”'},
        {label:'판정',kind:'annotation',text:'기억 개입과 검은 타르 현상은 증언에서만 확인된다. 레스작의 능력, 교단 개입과 별개의 리버스 가운데 어느 설명도 우선하지 않는다.'}
      ]
    },
    '1986-07-25-immortality':{
      documentType:'field',author:'F.H.C 북해 조사팀 현장서기',recipient:'본사 생체재료부',purpose:'피의 호수 진입 및 회수 결과 보고',
      fragments:[
        {label:'회수 지시',kind:'directive',text:'생존자 수색보다 수면 표본과 의식 잔류물 확보가 먼저 배정됐다. 연락이 끊긴 조사원의 장비와 사체도 오염 상태를 유지한 채 반출하라는 지시가 내려왔다.'},
        {label:'현장 기입',kind:'log',text:'18:40  수면 가장자리에서 인식표 2개 회수\n19:05  회수대원 1명, 물이 자신의 이름을 불렀다고 보고\n19:11  본사에서 사체 훼손 금지 재통보\n19:26  구조 요청 중단. 표본 상자 우선 이송'},
        {label:'U.A.C 주석',kind:'annotation',text:'이 작전 뒤 작성된 감시 문서는 F.H.C가 교단의 힘을 위협이 아니라 사용 가능한 재료로 보았다고 적었다. 판단 근거는 구조 순서와 회수 품목이다.'}
      ]
    },
    '1989-08-23-tokyo':{
      documentType:'forensic',author:'U.A.C 도쿄 자료회수반',recipient:'교육기관 침투 조사팀',purpose:'F.H.C 도쿄 지부 교재와 피해 기록 대조',
      fragments:[
        {label:'회수물',kind:'finding',text:'학생용 교재에서 「Basic Of Blood Path」와 「Basic Of Flesh Path」가 발견됐다. 인쇄 형식은 일반 실습서와 같았고 배포대장에는 생명공학 기초과목으로 등록돼 있었다.'},
        {label:'사쿠마 기록',kind:'quote',text:'“선생은 다친 학생을 보건실로 보내지 않았다. 옆 교실에 앉혀 놓고 수업을 계속했다. 그날 이후 그 아이 이름을 출석부에서 찾을 수 없었다.”'},
        {label:'대조 결과',kind:'analysis',text:'교재, 실종과 인간 위장형 괴이의 목격 시점은 겹친다. F.H.C 본사의 지시였는지 도쿄 지부가 독자적으로 운영했는지는 확인하지 못했다.'}
      ]
    },
    '1993-11-02-uac':{
      documentType:'official',author:'U.A.C 창설사무국',recipient:'협력국 정부 및 현장기관',purpose:'기관의 법적 지위와 업무 범위 공표',
      fragments:[
        {label:'창설 공고',kind:'document',text:'U.A.C는 1993년 11월 2일 공개 기관으로 전환됐다. 명칭에 국제연합을 사용하지만 UN 산하기관은 아니다. 협력국의 통행·정보 접근권과 자체 지휘망을 바탕으로 리버스 관련 국제 조정을 맡는다.'},
        {label:'당시 회의록',kind:'annotation',text:'여러 정부가 주권 침해를 이유로 창설안에 반대했다. 표결 직전 입장을 바꾼 인사들과 레스작의 접촉 여부는 조사되지 않았다. N.H.C와 S.I.D의 설치안은 같은 회의에서 통과됐다.'}
      ]
    },
    '1993-syndicate':{
      documentType:'analysis',author:'S.I.D 국제연결망 분석과',recipient:'U.A.C 조정위원회',purpose:'S.O.N 초기 지원망의 형성 경로 분석',
      fragments:[
        {label:'공통점',kind:'analysis',text:'압수 장부와 이탈자 명단에서 같은 회사, 항만과 비인가 외교계좌가 반복됐다. 참여자들이 공유한 것은 우시노다 신앙이 아니라 U.A.C 중심 질서에 대한 반감이었다.'},
        {label:'분석관 의견',kind:'annotation',text:'S.O.N을 교단의 하위조직으로 분류하면 자금 흐름을 설명할 수 없다. 이들은 필요할 때 교단과 거래했고, 같은 필요가 사라지면 공격했다. F.H.C가 시설과 운송로를 제공했다는 기록은 있으나 단일 지휘부의 존재는 입증되지 않았다.'}
      ]
    },
    '1995-03-20-tokyo-subway':{
      documentType:'analysis',author:'S.I.D 도쿄 사후검토반',recipient:'도시권 사건 재분류위원회',purpose:'공개 역사와 별도 비공개 작전의 경계 확인',
      fragments:[
        {label:'공개 기록과의 경계',kind:'document',text:'1995년 3월 20일 도쿄 지하철에서 발생한 실제 공격의 실행 주체와 피해 사실은 공개 수사·재판 기록을 따른다. 해당 사건을 리버스나 우시노다교가 일으켰다는 근거는 Project Curse 기록에 없다.'},
        {label:'비공개 작전',kind:'field',text:'같은 날 N.H.C 도쿄 지부는 본사역과 떨어진 폐쇄 환기구역에서 이상 신호를 추적했다. 현장에서는 S.O.N 인원과 짧은 교전이 있었으나 의식 흔적은 발견되지 않았다. 투입 명령에 적힌 최초 신고자는 존재하지 않는 신분이었다.'},
        {label:'후대 검토',kind:'annotation',text:'검토반은 실제 공격으로 생긴 혼란을 이용해 대응 인력을 다른 구역으로 유인했을 가능성을 제시했다. 두 사건 사이에 확인된 것은 시간의 중첩뿐이다. 직접적인 인과관계는 등록하지 않는다.'}
      ]
    },
    '1997-01-27-classification':{
      documentType:'official',author:'U.A.C 현상분류위원회',recipient:'협력기관 전 부서',purpose:'리버스와 괴이의 공통 용어 제정',
      fragments:[
        {label:'분류 고시',kind:'document',text:'공간·생체·정신 또는 혈성 변화가 연속적으로 발생하는 현상을 리버스(Rebirth)로, 그 과정에서 출현하거나 인간 사회에 위장한 비인간 개체를 괴이(Feral)로 표기한다. 현상과 개체의 대응 절차는 별도로 작성한다.'},
        {label:'키무라 쿄 부속 의견',kind:'annotation',text:'관찰된 사례를 한 기원으로 묶을 근거는 없다. 인간 위장형, 타락형과 빙의형은 현장에서 구분할 필요가 있어 임시 분류표에 함께 실었다. 분류명이 혈통이나 종을 뜻한다고 해석하지 말 것.'}
      ]
    },
    '1999-07-12-ubermensch':{
      documentType:'contested',author:'U.A.C 특수연구 승인위원회 / 후대 윤리감사실',recipient:'제한 배포',purpose:'위버멘시 프로젝트 승인과 피해 범위 대조',
      fragments:[
        {label:'승인문 발췌',kind:'document',text:'방랑자의 감각, 부분 타락 내성과 빙의 생존 사례를 전력화 연구 대상으로 지정한다. 대상 확보와 기억 처리는 별도 보안 절차에 따른다. 실패 사례도 장비 개발 자료로 보존한다.'},
        {label:'감사실 대조',kind:'analysis',text:'승인문에는 자발적 참여라는 표현이 없다. 수감자 외에 신원 불명자와 납치 신고 대상이 실험 명부에서 확인됐고, 포획한 그림자를 사람과 같은 격리실에 투입한 기록도 남아 있다.'},
        {label:'결손',kind:'annotation',text:'전체 대상자 수와 사망자 수는 복원하지 못했다. 시설별 식별번호가 달라 같은 사람을 중복 집계했을 가능성이 있다.'}
      ]
    },
    '2001-07-21-independence':{
      documentType:'official',author:'U.A.C 조직개편위원회',recipient:'N.H.C·S.I.D 및 협력국 연락실',purpose:'독립 지휘체계와 지원 범위 확정',
      fragments:[
        {label:'개편 통보',kind:'document',text:'N.H.C와 S.I.D는 2001년 7월 21일부터 독립된 지휘체계를 사용한다. 군사 대응은 N.H.C, 도시 수사와 P.O.H 추적은 S.I.D가 맡는다. 국제 통행권, 정보 접근과 자산 지원은 U.A.C가 계속 제공한다.'},
        {label:'비공개 부속서',kind:'annotation',text:'개편은 단절이 아니라 지휘권 분산을 위한 조치였다. U.A.C 지도부가 정부 개입으로 정지하더라도 두 현장기관이 동시에 멈추지 않도록 승인 경로를 나눴다. 정화 작전에 대한 외부 심사 절차는 부속서에서 제외됐다.'}
      ]
    },
    '2002-02-20-ground-forces':{
      documentType:'review',author:'N.H.C 합동교리검토실',recipient:'협력국 지상군 연락장교',purpose:'리버스 대응 장비와 합동 절차 검토',
      fragments:[
        {label:'운용 결과',kind:'analysis',text:'협력국 부대는 N.H.C 탄약과 방어장비, S.I.D 현장정보를 같은 작전망에서 받았다. 외교 승인 대기 없이 초기 봉쇄에 들어갈 수 있었지만 장비 사용권과 민간인 통제권은 국가마다 달랐다.'},
        {label:'비협력권',kind:'annotation',text:'협약을 거부한 지역에서는 모방 장비와 F.H.C TAD 부대가 확인됐다. TAD 현장 인원 다수는 회사의 교단 관련 조사 내용을 공유받지 못한 채 일반 재난 대응 계약으로 투입됐다.'}
      ]
    },
    '2003-02-05-city-barrier':{
      documentType:'official',author:'U.A.C 도시차단망 사업단',recipient:'협력도시 공안·군사기관',purpose:'C.A.P-17 및 C.I. 스캐너 배치 승인',
      fragments:[
        {label:'배치 목적',kind:'document',text:'C.A.P-17은 리버스 발생 구역의 확장을 늦추고, C.I. 스캐너는 초기 이상 신호를 공안·군사기관에 전달한다. 두 장비는 현상을 예방하는 설비가 아니며 민간 대피와 현장 봉쇄가 뒤따르지 않으면 단독 운용 효과를 보증하지 않는다.'},
        {label:'현장 주의',kind:'directive',text:'차단선 밖의 신호를 장비 오류로 종결하지 말 것. 외곽 지역은 탐지기 수보다 보고 지연이 더 큰 위험으로 확인됐다.'}
      ]
    },
    '2005-01-21-ash-crew':{
      documentType:'official',author:'N.H.C 현장지원국',recipient:'애시 크루 임시지휘부',purpose:'민간 현장조직 편입 및 임무 인계',
      fragments:[
        {label:'편제 기록',kind:'document',text:'비비안 산체스가 이끄는 애시 크루를 N.H.C 산하 현장조직으로 편입한다. A.R.F와 C.P.D는 애시 크루의 하위 편제로 등록한다.'},
        {label:'첫 임무 인계',kind:'field',text:'군사작전이 끝난 구역에는 시신, 회수하지 못한 장비와 대피 명단에서 빠진 사람이 남는다. 애시 크루의 임무는 승리 여부를 다시 판정하는 것이 아니라 그 잔여물을 처리하고 살아 있는 사람을 찾는 것이다.'}
      ]
    },
    '2005-09-01-red-wolf':{
      documentType:'review',author:'N.H.C 인사감찰실',recipient:'지휘위원회',purpose:'레드울프 부대 이탈 원인과 손실 보고',
      fragments:[
        {label:'발생',kind:'field',text:'웨이드 밀렌과 레드울프 잔여 인원은 작전 복귀 명령을 거부하고 S.O.N 접촉선으로 이동했다. 추격조는 교전하지 않았다. 현장 지휘관은 “누가 적인지 다시 확인할 시간이 필요했다”고 보고했다.'},
        {label:'감찰 기록',kind:'analysis',text:'밀렌의 불만은 이탈 당일 생긴 것이 아니다. 민간 구역 제거, 도시 전력 차단과 구조 인원의 재분류에 대한 이의 제기가 이전 작전일지에서 반복된다. 당시 답변은 모두 임무 범위 밖이라는 한 문장으로 종결됐다.'},
        {label:'미회수 항목',kind:'annotation',text:'부대가 가져간 내부 전술자료의 범위는 확인하지 못했다. S.O.N 명부에는 이탈 인원 전부가 등록돼 있지 않다.'}
      ]
    },
    '2006-08-20-ubermensch-raid':{
      documentType:'review',author:'U.A.C 위버멘시 비상감사단',recipient:'조정위원회 제한회의',purpose:'미국 지부 습격과 실험대상 회수 확인',
      fragments:[
        {label:'확인 사항',kind:'document',text:'S.O.N 전력과 레드울프 인원이 미국 지부에 진입했다. 방랑자 10명이 시설 밖으로 이동했고 연구자료 일부가 반출됐다. 시설 보안영상은 진입 직전부터 같은 구간을 반복 재생했다.'},
        {label:'공개 결정',kind:'analysis',text:'유출본에 실제 신원과 납치 경로가 포함돼 있어 프로젝트를 보호 연구로 설명할 수 없었다. U.A.C는 위버멘시의 폐기를 발표했다. 피해 명부와 책임자 명단은 공개 항목에서 제외됐다.'},
        {label:'현재 상태',kind:'annotation',text:'구출된 10명의 행선지는 서로 다른 기록으로 남아 있다. 어느 기록도 전원을 끝까지 추적하지 못한다.'}
      ]
    },
    '2006-12-31-aftermath':{
      documentType:'review',author:'U.A.C 북미 대응망 감사실',recipient:'연속정부 연락위원회',purpose:'위버멘시 폐기 뒤 명령권 충돌 점검',
      fragments:[
        {label:'감사 결과',kind:'analysis',text:'시설 폐쇄와 자료 소각은 동시에 진행됐다. 실험 책임자를 숨기는 과정에서 구조 대상 식별번호와 격리 절차도 사라졌다. 같은 사람을 두고 지역군은 구조 대상으로, N.H.C는 오염 의심자로 분류한 사례가 확인됐다.'},
        {label:'연말 상황',kind:'log',text:'12.09  내륙 지휘소, 실험체 명부 재전송 요청\n12.17  U.A.C 본부, 관할 기관 확인 중이라고 회신\n12.26  지역군이 자체 출입증 사용 통보\n12.31  다섯 지휘소 중 세 곳 응답 없음'},
        {label:'감사관 메모',kind:'quote',text:'“피해 규모를 세기 전에 누가 명령할 수 있는지부터 다시 정해야 한다. 지금은 같은 봉쇄선에 세 종류의 출입 허가가 있다.”'}
      ]
    },
    '2007-03-11-continuity-withdrawal':{
      documentType:'review',author:'북미 연속정부 자산인계반',recipient:'해안 격리선 지휘소',purpose:'내륙 지휘기능 중단과 자산 철수 인계',
      fragments:[
        {label:'철수명령 11-C',kind:'directive',text:'내륙 구조 우선순위표 사용을 중지한다. 이동 가능한 인원, 기록 매체와 차단 장비는 해안 격리선으로 이송한다. 대체 지휘관을 확인할 수 없는 시설은 장비를 봉인하고 자체 판단으로 폐쇄한다.'},
        {label:'인계반 기입',kind:'log',text:'동부 목록은 도착했다. 서부 목록은 빈 양식만 수신됐다. 내륙 관제소는 마지막 교신에서 철수 차량의 번호를 물었으나, 해당 차량은 배차 기록에 없다.'},
        {label:'후대 주석',kind:'annotation',text:'명령문은 국가 해체를 선언하지 않았다. 다만 이 문서 뒤로 내륙에 공통 명령을 보낸 기관은 확인되지 않는다.'}
      ]
    },
    '2008-09-06-dead-zone-designation':{
      documentType:'official',author:'U.A.C 대륙통제 재분류위원회',recipient:'협력기관 및 해안 검문소',purpose:'북미 내륙의 작전등급 변경',
      fragments:[
        {label:'회람 44-DZ',kind:'document',text:'북미 내륙에 적용하던 일반 구조, 영토 회복과 행정구역별 지휘 절차를 중지한다. 지도 표기는 DEAD ZONE으로 통일한다. 이 분류는 내부 경계가 확정됐다는 뜻이 아니다.'},
        {label:'검문소 부속 통보',kind:'directive',text:'외부인의 진입을 보장하거나 회수하지 않는다. 귀환자가 도착한 경우 신원, 기억과 생체 신호를 별도로 대조한다. 통과 여부는 현장 책임자가 기록과 함께 결정한다.'},
        {label:'편찬 주석',kind:'annotation',text:'회람 어디에도 출입 금지라는 문장은 없다. 그 시점에는 이미 순례자를 막을 연속된 경계선이 남아 있지 않았다.'}
      ]
    },
    '2010-04-12-returner-compact':{
      documentType:'interview',author:'서부 귀환 회랑 구술채록자',recipient:'검문소 공동보관함',purpose:'첫 귀환자 협정의 소실 조항 복원',
      fragments:[
        {label:'검문소 안내인 증언',kind:'quote',text:'“그전에는 돌아오면 둘 중 하나였습니다. 총을 맞거나, 연구소 차를 타거나. 그래서 사람들은 검문소를 피해 북쪽으로 돌았어요. 우리가 요구한 건 간단했습니다. 질문이 끝나기 전에는 아무도 데려가지 말 것.”'},
        {label:'남은 합의',kind:'document',text:'귀환자는 무기를 내려놓고 동행자의 이름을 말한다. 검문소는 답변이 서로 다르다는 이유만으로 인계를 중단하지 않는다. 기억 대조가 끝나기 전에는 순례자 공동체와 기관 어느 쪽도 귀환자를 이동시키지 않는다.'},
        {label:'자료 상태',kind:'annotation',text:'서명 원본은 없다. 이후 발급된 통과증과 배급표에 같은 문장이 반복돼 협정 날짜와 사용 범위만 복원했다.'}
      ]
    },
    '2012-11-19-great-black-forest-survey':{
      documentType:'field',author:'대흑림 공동측량대 기록원',recipient:'남미 해안 관측소·독립 마을 연합',purpose:'내륙 회랑 측량과 귀환 경로 보고',
      fragments:[
        {label:'측량일지 말미',kind:'log',text:'11.17  서쪽 표식을 다시 발견. 표식의 칼자국은 오늘 아침 우리가 냈다.\n11.18  출발지의 연기 확인. 대원들은 계속 서쪽으로 걸었다고 주장.\n11.19  해안 관측소가 대열을 동쪽 숲에서 발견. 장비 시계가 서로 다른 날짜를 표시.'},
        {label:'기록원 진술',kind:'quote',text:'“길을 잃은 게 아닙니다. 강도 별도 그대로였습니다. 그런데 종이에만 강이 하나 더 생겼습니다. 마지막에는 아무도 지도를 접으려 하지 않았어요. 접으면 안쪽에 우리가 남을 것 같다고 했습니다.”'},
        {label:'관측소 조치',kind:'document',text:'고정 경계선 작성은 중단됐다. 이후 지도는 행정구역 대신 통과가 확인된 회랑, 불이 켜진 성채와 마지막 교신 지점을 표시한다.'}
      ]
    },
    '2014-06-08-castle-asylum-right':{
      documentType:'contested',author:'대흑림 성채 공동서기 / 순례자 구전 채록',recipient:'가맹 성채와 회랑 안내인',purpose:'야간 피난 관습의 공통 조항 확인',
      fragments:[
        {label:'성문 조항',kind:'directive',text:'해가 진 뒤 문을 두드린 자에게 소속을 묻지 않는다. 무기는 문지기 앞에서 봉인한다. 안으로 들어온 자의 복수와 추방은 해가 뜰 때까지 미룬다. 성벽이 공격받으면 피난자도 방어에 참여한다.'},
        {label:'북문지기 증언',kind:'quote',text:'“일곱 성이 한날 모여 약속했다는 말은 믿지 않습니다. 여기서 일곱은 많다는 뜻으로도 씁니다. 다만 그해부터 다른 성의 봉인표를 우리도 받기 시작한 것은 맞습니다.”'},
        {label:'후대 대조',kind:'annotation',text:'공동 선언 원본은 발견되지 않았다. 서로 왕래가 없던 성채 장부에 같은 피난 조항이 적혀 있어 관습의 존재만 복수 기록 일치로 판정한다.'}
      ]
    },
    '2016-02-21-blood-cult-atlantic-schism':{
      documentType:'intercept',author:'S.I.D 대서양 감청실',recipient:'교단관계 분석과',purpose:'혈교 남부권과 데드 존 지부의 결별 확인',
      fragments:[
        {label:'데드 존 송신',kind:'quote',text:'“길을 묻는 자에게 피를 요구하지 않는다. 돌아오는 자의 이름은 검문소와 함께 지킨다. 남쪽의 명령은 이 회랑에서 효력이 없다.”'},
        {label:'남부권 응답',kind:'quote',text:'“표식과 사도의 이름을 반납하라. 문을 열어 둔 자는 문밖의 것과 같은 편이다.”'},
        {label:'분석관 주석',kind:'analysis',text:'양측은 같은 의식어를 사용했지만 이후 보급로와 인명 명부를 공유하지 않았다. 교리 분쟁이라는 설명만으로는 부족하다. 데드 존 지부는 검문소·중립 마을과의 교환 없이는 회랑을 유지할 수 없었다.'}
      ]
    },
    '2018-09-12-northern-front':{
      documentType:'field',author:'일본 북부 공동지휘소 상황반',recipient:'동맹권 전투지휘부',purpose:'차단선 공격과 초동 대응 보고',
      fragments:[
        {label:'상황일지',kind:'log',text:'02:14  제2 거점에서 구조 요청 수신\n02:19  같은 음성의 요청이 제4 거점에서 반복\n02:31  예비대가 제4 거점으로 이동\n03:02  제2 거점 통신 두절\n03:20  구조 요청 발신자가 전날 사망한 통신병으로 확인'},
        {label:'초동 평가',kind:'analysis',text:'짐승의 길 전력은 통신을 끊지 않았다. 신뢰할 수 있는 구조 신호를 복제해 예비대를 비웠다. 일본 공동지휘소는 도시 침투 추적을 S.I.D에, 차단선 복구를 N.H.C에 배정했다. 교전 규칙이 달라 첫 반격은 승인 단계에서 멈췄다.'},
        {label:'전선 등록',kind:'annotation',text:'이날의 공격 이후 북동아시아 차단선은 임시 사건지가 아니라 북부전선으로 기록됐다.'}
      ]
    },
    '2021-05-04-fhc-submassacres':{
      documentType:'contested',author:'S.I.D 기업시설 합동감식반',recipient:'F.H.C 사건 검토위원회',purpose:'동시 폐쇄·학살 명령의 최초 발신자 확인',
      fragments:[
        {label:'시설 로그 A',kind:'log',text:'05:04 01:08  북부 연구동에서 정화명령 수신\n05:04 01:11  서명키 확인: F.H.C 내부\n05:04 01:26  남부 교육동을 오염 지부로 지정\n05:04 01:32  남부 교육동에서 동일 명령 수신 보고'},
        {label:'TAD 발표',kind:'document',text:'외부 침입 세력이 회사 암호키를 탈취해 복수 시설을 공격했다. 현재 모든 지부는 중앙 통제 아래 있다.'},
        {label:'감식반 의견',kind:'analysis',text:'생존 로그는 마지막 문장을 지지하지 않는다. 시설들은 서로를 공격했고 중앙 통제 요청에는 답이 없었다. 우시노다 잔존망의 개입 흔적은 있으나 어느 시설도 전체 명령을 보낼 위치에 있지 않았다.'},
        {label:'현장 명칭',kind:'annotation',text:'생존자들은 각각의 폐쇄 구역을 하나의 대형 학살과 구분해 서브매서커라고 불렀다. 공식 사건명은 끝내 합의되지 않았다.'}
      ]
    },
    '2024-03-17-ushinoda-fabrication':{
      documentType:'forensic',author:'S.I.D 영상감식 3반',recipient:'우시노다 기록 재분류위원회',purpose:'교단 기원 영상의 편집·합성 여부 판정',
      fragments:[
        {label:'감식 소견',kind:'finding',text:'지도부 연설로 알려진 장면의 입 모양과 음성이 맞지 않는다. 배경 종소리는 서로 다른 지역에서 채록된 두 음원을 겹친 것이며, 화면 오른쪽 인물은 다른 필름에도 같은 자세로 나타난다.'},
        {label:'판정 범위',kind:'analysis',text:'영상이 조작됐다는 사실만 확인한다. 우시노다교가 존재하지 않았다는 결론은 내릴 수 없다. 타락교·혈교·그림자교와 지역 잔존 세력이 어느 시점에 하나의 중앙교단을 공유했는지도 이 자료로는 판단하지 않는다.'},
        {label:'재분류',kind:'directive',text:'해당 영상은 역사 원본이 아니라 선전·유도 자료로 등록한다. 영상에만 근거한 설립 연도와 지도자 계보는 정사 대장에서 해제한다.'}
      ]
    },
    '2026-08-20-northern-reversal':{
      documentType:'review',author:'일본 북부 공동지휘소 전황검토반',recipient:'동맹권 작전회의',purpose:'차단선 탈환과 적 후퇴 범위 확인',
      fragments:[
        {label:'변경된 절차',kind:'analysis',text:'새 식별 절차는 구조 요청자의 목소리보다 신호가 통과한 공간 왜곡 흔적을 비교했다. 복제 신호가 분리되자 잘못 배치돼 있던 예비대가 본래 구역으로 돌아왔다.'},
        {label:'전황 통보',kind:'document',text:'동맹군은 의식 거점과 보급 회랑을 탈환했고 짐승의 길 주력은 세 번째 차단선 밖으로 물러났다. N.H.C는 국면 전환, 일본 지휘부는 제한적 승리로 각각 표기했다. 적 전력의 소멸은 확인하지 않았다.'},
        {label:'S.I.D 부속 의견',kind:'annotation',text:'후퇴 부대 일부가 남부권 통신 경로를 사용했다. 지원, 통행 허용 또는 탈취 가운데 어느 관계였는지는 감청만으로 구분되지 않는다.'}
      ]
    },
    '2027-11-02-southern-allegiance':{
      documentType:'intercept',author:'S.I.D 남부 해안 감청반',recipient:'OP-BROKEN-CROWN 사전분석실',purpose:'남부 교단·무장분파의 공동 지휘 여부 판단',
      fragments:[
        {label:'감청 요약',kind:'analysis',text:'서로 다른 분파의 보급 날짜와 통신 암호가 같은 주기에 맞춰졌다. 깃발, 교리와 지역 지휘관은 그대로였다. 감청반은 이를 합병이 아니라 한 번의 작전을 위한 충성망으로 임시 분류했다.'},
        {label:'서약 거부 확인',kind:'document',text:'천사의 내장, 몬수르 교회 한 곳과 일부 성채권은 공통 암호를 사용하지 않았다. 이들은 혈교에 대한 선전포고 대신 피난권과 교역로의 중립을 통보했다.'},
        {label:'남은 공백',kind:'annotation',text:'우시노다 잔존 인원이 혈교 지휘부에 들어갔다는 명단은 있으나 본인 확인이 되지 않았다. F.H.C 내부전에서 사망한 사람의 이름이 다시 사용됐을 가능성이 있다.'}
      ]
    },
    '2028-07-25-mass-summoning-rehearsal':{
      documentType:'forensic',author:'S.I.D 도시신호 분석실',recipient:'남부권 합동대응반',purpose:'동시 리버스의 작전 목적과 대응 지연 분석',
      fragments:[
        {label:'발생 기록',kind:'log',text:'도시 A  경계등급 2 / 자력 복구\n도시 B  피해규모 과장 신호 수신 / 예비대 출동\n도시 C  동일한 소환 앵커 잔류물 회수\n해안 감청소  출동시각을 묻는 암호통신 포착'},
        {label:'분석',kind:'analysis',text:'각 현상은 해당 도시 전력으로 봉쇄할 수 있었다. 과장된 구조 요청 때문에 예비대가 갈라졌고, 남부 특수부대 통신에는 출동과 차단망 재가동 시간이 기록됐다. 대응 절차를 측정한 예행이라는 판정은 이 통신에 근거한다.'},
        {label:'후속 조치',kind:'directive',text:'대규모 소환 앵커 반입 여부를 감시한다. 성위대 지휘부에서 발견된 남부 암호키는 사용자 신원 확인 전까지 침투 증거로 단정하지 않는다.'}
      ]
    },
    '2029-04-12-checkpoint-07':{
      documentType:'interview',author:'검문소 07 기억정합성 담당관',recipient:'서부 귀환 회랑 공동심사실',purpose:'귀환자 네 명과 추가 생체 신호의 신원 심사',
      fragments:[
        {label:'초기 스캔',kind:'log',text:'귀환 인원  4\n제출된 이름  4\n확인된 심박  5\n출입요청 음성  5명분\n다섯 번째 이름  귀환자 전원 기억 없음'},
        {label:'면담 발췌',kind:'quote',text:'담당관: 마지막 야영지에서 불침번은 누가 섰습니까?\n귀환자 2: 제가 첫 순서였습니다. 다음은— 잠깐만요.\n담당관: 다음은 누구였습니까?\n귀환자 2: 네 명이었다면 순서가 맞지 않습니다.'},
        {label:'현장 판정',kind:'analysis',text:'네 사람의 기억은 다섯 번째 자리를 비워 두었을 때만 하나의 경로로 이어졌다. 신호를 귀환자로 인정한 기록에서는 검문소 아래에서 구조 요청이 돌아왔다. 거부한 기록에서는 귀환자 한 명의 과거 자료가 조회되지 않는다. 어느 결과가 원본인지는 시나리오 판정에 남긴다.'}
      ]
    },
    '2030-01-17-broken-crown':{
      documentType:'field',author:'OP-BROKEN-CROWN 합동상황실',recipient:'U.A.C 조정위원회·현장지휘관',purpose:'남부 동시 소환과 지휘부 침투 대응',
      fragments:[
        {label:'작전일지',kind:'log',text:'T-06:00  해안 분파 집결 확인\nT-04:20  소환 앵커가 두 도시와 성위대 보급선으로 분산\nT-02:10  성위대 지휘관 서명과 남부 암호키 일치\nT-00:40  도시권 동시 소환 전조\nT+00:18  해안 통신 두절'},
        {label:'명령 상충',kind:'document',text:'지휘관을 공작원으로 지목한 보고와 생존 시 처형하라는 명령은 서로 다른 발신 계통에서 들어왔다. 두 문서 모두 정상 승인 기록이 없다. 신원 확인 전 처형 명령을 집행하지 않는다.'},
        {label:'현재 기록',kind:'annotation',text:'도시 소환 차단, 해안 이동로 봉쇄와 민간 성채 철수가 동시에 진행 중이다. 쿠데타가 시작됐는지, 그렇게 믿게 만드는 것이 작전의 목적이었는지는 아직 보고할 수 없다.'}
      ]
    }
  };

  Object.values(records).forEach(record=>{
    const type=documentTypes[record.documentType]||documentTypes.analysis;
    record.documentLabel=type.label;
    record.documentCode=type.code;
    record.paragraphs=record.fragments.map(fragment=>fragment.text);
  });

  root.ProjectCurseWorldHistoryProse=freeze({
    version:root.ProjectCurseBuild?.version||'5.37.0',
    documentTypes,records,
    getRecord:id=>records[id]||null,
    getDocumentType:id=>documentTypes[id]||documentTypes.analysis
  });
})(window);
