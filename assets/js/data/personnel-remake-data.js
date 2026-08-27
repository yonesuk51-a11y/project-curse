// Project Curse 5.54.0 — canon-facing names, operational cells and ability costs for the 2006 register.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const groupOverrides={
    personal:{label:'민간 증언망·실종자 기록',short:'민간망',code:'CIV',tone:'civilian'},
    alma:{label:'발렌 구호가문',short:'발렌',code:'VLN',tone:'family'},
    'fhc-union':{label:'F.H.C 유니온 잔존시설',short:'유니온 잔존',code:'FUN',tone:'corporate'},
    'fhc-ark':{label:'F.H.C 아크 회수구역',short:'아크 회수',code:'FAR',tone:'corporate'},
    nhc:{label:'N.H.C 제4봉쇄군',short:'제4봉쇄군',code:'N4C',tone:'field'},
    uac:{label:'U.A.C 중앙조정국',short:'중앙조정국',code:'UAC',tone:'institution'},
    'sid-us':{label:'S.I.D 서부 귀환선',short:'서부 귀환선',code:'SWR',tone:'institution'},
    syndicate:{label:'S.O.N 레드울프망',short:'레드울프망',code:'RWN',tone:'rogue'},
    ushinoda:{label:'우시노다 사도석 주장자',short:'사도석',code:'USH',tone:'cult'},
    haiman:{label:'P.O.H 하이먼 회랑',short:'하이먼 회랑',code:'HYM',tone:'rogue'}
  };

  const records={
    'tanaka-chihiro':{name:'미나세 치히로',unit:'도쿄 민간기록 복원망',recordFunction:'사건 뒤 지워진 주민 명부와 가족관계를 복구하는 민간인의 시점.',incident:'1989 도쿄 교육기관 실종자 명부 재구성'},
    'tanaka-yui':{name:'미나세 유이',unit:'수도권 재난통신 협동조합',recordFunction:'비상방송이 구조 명령과 검열 명령 사이에서 어떻게 바뀌는지 보여 주는 기술자.',incident:'1995 도쿄 지하철 비공개 개입 당시 중계기 수리'},
    maya:{name:'이시카와 마야',unit:'독립 현장사진 보존망',recordFunction:'기관이 회수하기 전의 첫 장면을 남기는 기록자.',incident:'2003 도심 차단망 시범구역 원본 사진 보존'},
    'jeong-ria':{name:'류하린',unit:'부산항 특수사건 통역망',recordFunction:'피난민의 방언과 의식 언어를 동시에 번역해야 했던 민간 협조자.',incident:'2006 북미 철수선 승선자 심문 통역'},
    'ryu-youngho':{name:'류영준',unit:'동북아 위험화물 철도망',recordFunction:'봉인 화물과 피난 열차가 같은 선로를 공유한 현실을 드러내는 배차관.',incident:'2006 소각시설행 표본차량의 우회 운행'},
    'sato-hajime':{name:'사토 겐지',unit:'니가타 비정상 화재 감식반',recordFunction:'의식 흔적이 산업재해로 종결되는 과정을 추적한 퇴직 조사관.',incident:'1998 혈열 화재 연쇄사건 재감식'},
    sasaki:{name:'사사키 토오루',unit:'민간 의료표본 운송계약',recordFunction:'연구소와 병원 사이의 가장 취약한 오염 이동선을 맡은 운송원.',incident:'2001 봉인표본 04-B 분실사건 생존'},
    'nina-gregory':{name:'에블린 그레고리',unit:'케임브리지 기생생물 자문망',recordFunction:'괴이를 질병으로만 보려는 기관 분류의 한계를 지적한 연구자.',incident:'1999 위버멘시 공생체 자문 거부'},
    'yesel-gregory':{name:'에셀 그레고리',unit:'이상언어·숙주발화 연구실',recordFunction:'숙주의 말과 침입한 존재의 문장을 분리해 읽는 언어학자.',incident:'2004 귀환자 합창 증언 분석'},

    'alma-damian':{name:'데미안 발렌',unit:'발렌 가문 계약감사실',recordFunction:'구호기금이 F.H.C 시설 유지비로 전용된 흔적을 좇는 내부 감사자.',incident:'2005 유니온 산하 쉘터 장부 유출'},
    'alma-bennett':{name:'리아 발렌',unit:'발렌 이동외상진료소',recordFunction:'오염 상처를 치료하면서도 환자를 기관에 넘기지 않으려 한 의료인.',incident:'2006 위버멘시 탈출자 2명 비공식 치료'},
    'alma-griffon':{name:'요나스 발렌',unit:'발렌 격리설비 정비반',recordFunction:'봉쇄 장치의 고장이 사고인지 의도된 개방인지 판정하는 기술자.',incident:'2003 C.A.P-17 민수형 결함 보고'},
    'alma-wade':{name:'엘리제 발렌',unit:'발렌 가문 의료관리실',recordFunction:'가문 구성원의 능력 발현과 후유증을 숨겨 온 의료 책임자.',incident:'1999 비인가 생기검사 기록 봉인'},
    'alma-kara':{name:'카라 발렌',unit:'유니온 잔존시설 원로회',recordFunction:'구호가문이 기업의 피난시설 운영권을 얻는 대신 무엇을 묵인했는지 보여 주는 원로.',incident:'2001 유니온 시설 독립채산 전환'},
    jake:{name:'제이크 로웰',unit:'유니온 원로회 경호계약',recordFunction:'기관 충성보다 보호 대상 한 사람에게 충성하는 민간 전투원.',incident:'2005 원로회 호송대 매복사건'},
    'alma-koenig':{name:'콘라트 발렌',unit:'유니온 제3잔존시설',recordFunction:'중앙 지휘가 끊긴 F.H.C 시설을 독립 피난소로 바꾸려 한 관리자.',incident:'2021 서브매서커 이전 지휘권 분리의 선행 사례'},

    'ezekiel-kalp':{name:'엘리아스 카르프',unit:'아크 제2회수구역',role:'아크 회수구역장',recordFunction:'연구 자산 회수와 생존자 구조를 같은 명령서에 넣은 지휘관.',incident:'2006 북해 회수선 실종사건'},
    'sakuma-yuta':{name:'사쿠마 진',unit:'아크 내부정보선 / 하이먼 이탈망',role:'전향 정보원 / 레드 마우스',recordFunction:'조국·기관·교단 사이에서 이름을 바꾸며 살아남은 이중 정보원.',incident:'1989 도쿄 기록 및 2006 오리진 실험체 탈출'},
    'karl-maxwell':{name:'케일럽 맥스웰',unit:'아크 야외회수조',recordFunction:'괴이보다 먼저 굶주림과 추위에 무너지는 회수대의 현실을 보여 주는 사냥꾼.',incident:'2004 유콘 백색회랑 19일 생환'},
    'brian-alberoz':{name:'브루노 알바레스',unit:'아크 표식추적조',recordFunction:'카드 표식을 이용해 실종자의 마지막 이동을 재구성하는 사냥꾼.',incident:'2005 남대서양 의식선 추적'},
    'yanami-shinka':{name:'야나기 신카',unit:'아크 중량회수조',recordFunction:'강한 능력이 구조 성공과 생존을 보장하지 않는다는 사망 기록.',incident:'2005 아크 제7창고 붕괴',abilitySource:'선천 생기 / 염동 발현',abilityCost:'사용량에 비례한 미세혈관 파열과 방향감각 소실'},
    duka:{name:'두샨 바실리예프',unit:'아크 중량회수조',recordFunction:'능력자 없이도 봉인물을 운반하던 현장 인력의 소모를 보여 주는 사망자.',incident:'2005 아크 제7창고 붕괴'},
    reiki:{name:'아마미야 레이',unit:'아크 공간감응 정찰조',recordFunction:'길을 찾을수록 자신의 공간 기억을 잃은 정찰원의 기록.',incident:'2005 아크 제7창고 선행정찰',abilitySource:'리버스 생존 후 공간감응',abilityCost:'감응한 경로 하나마다 개인 장소 기억 하나가 흐려짐'},
    'sebastian-clark':{name:'세바스찬 클라크',unit:'아크 병참·사망대장실',recordFunction:'회수 성공보다 돌아오지 못한 사람의 이름을 먼저 기록한 병참 책임자.',incident:'2006 아크 독립운용 전환 문서 작성'},

    baranto:{name:'마테오 오르테가',unit:'N.H.C 제4봉쇄군 사령부',role:'제4봉쇄군 사령관',recordFunction:'승리보다 봉쇄선 유지와 철수 결정을 책임지는 현장 지휘관.',incident:'2006 북부 차단선 재편',abilitySource:'선천 생기 / 태양계 활성',abilityCost:'회복을 앞당길수록 이후 체온·면역 기능이 급격히 저하됨'},
    yohan:{name:'요한 크루거',unit:'제4봉쇄군 지휘통신실',recordFunction:'명령을 전달하면서도 누가 그 명령을 승인했는지 확인하는 수행비서.',incident:'2006 상충 철수명령 3건 보류',abilitySource:'선천 생기 / 전격 발현',abilityCost:'장거리 전도 뒤 청각과 단기기억이 순차적으로 끊김'},
    roden:{name:'라자르 마르코프',unit:'제4봉쇄군 공생정찰조',recordFunction:'괴이 기생체를 제거하지 않고 협상 가능한 전력으로 운용한 위험한 선례.',incident:'2004 검은 강변 약점지도 작성',abilitySource:'기생체 공생',abilityCost:'모방한 생기마다 숙주의 감각 우선권을 기생체에 일시 양도'},
    mason:{name:'마커스 콜',unit:'제4봉쇄군 원거리차단조',recordFunction:'한 발의 성공보다 관측과 철수로를 설계하는 지원 저격수.',incident:'2005 레드울프 이탈 당시 민간 회랑 엄호',abilitySource:'선천 생기 / 투시·초감각',abilityCost:'장시간 투시 뒤 현재 시야와 예측상이 겹쳐 오인사격 위험 증가'},
    kate:{name:'카트린 모로',unit:'제4봉쇄군 중장돌격조',recordFunction:'방패 뒤의 생존자를 지키기 위해 자신의 회복 가능성을 소모하는 돌격요원.',incident:'2006 위버멘시 외곽 격벽 돌파',abilitySource:'F.H.C 계열 강화시술 생존',abilityCost:'근력 가속 때마다 관절 석회화와 심근 손상이 누적'},

    frux:{name:'알렉세이 프루신',unit:'U.A.C 중앙조정국',role:'중앙조정국장 / 프룩스',recordFunction:'국가·기관·민간 회랑의 상충 권한을 봉인문 한 장으로 임시 조정하는 관리자.',incident:'2006 북미 시설 동시폐쇄 승인',abilitySource:'의식 유물 / 봉인부적',abilityCost:'효력이 강할수록 부적 작성자의 이름과 소속이 기록망에서 지워짐'},
    pierce:{name:'에드워드 애쉬포드',unit:'U.A.C 감독위원회',recordFunction:'기관의 비밀 작전과 공개 책임 사이에서 표결하는 위원회 대표.',incident:'2006 위버멘시 폐기 결의'},
    natalia:{name:'나탈리아 볼코바',unit:'U.A.C 정보조정실',recordFunction:'서로 모순되는 기관 보고를 지우지 않고 병기하는 정보조정관.',incident:'2006 구출자 10명 신원대조표 작성'},
    'aaron-uac':{name:'에런 벡',unit:'U.A.C 기동연락대',recordFunction:'교전보다 문서와 사람을 다음 관할선까지 운반하는 쌍창 기동요원.',incident:'2005 레드울프 이탈문서 회수',abilitySource:'선천 생기 / 운동가속',abilityCost:'가속 종료 뒤 양팔의 고유감각과 균형감각이 저하'},
    grinch:{name:'그랜트 리치먼',unit:'U.A.C 현장협상실',recordFunction:'괴물보다 겁먹은 지휘관과 더 자주 협상해야 했던 심문관.',incident:'2006 내륙 지휘소 항명 협상'},
    frost:{name:'잉그리드 프로스트',unit:'U.A.C 저온봉쇄실',recordFunction:'표본을 보존할수록 주변 생존자의 체온을 빼앗는 장비를 감독한 기술관.',incident:'2006 BL-088 표본 이송',abilitySource:'의식 이식 / 저온 매개체',abilityCost:'봉쇄 온도를 낮출수록 말초 조직의 감각과 색채시력이 영구 저하'},

    casper:{name:'캐스퍼 리드',unit:'S.I.D 서부 귀환선 타이런트조',recordFunction:'귀환자의 진술이 무너질 때 강제 제압을 맡는 칼날 담당자.',incident:'2006 오리진 실험체 신원심사',abilitySource:'F.H.C 계열 후속타 트리거 이식',abilityCost:'연속 발동 시 통증 신호가 지연돼 치명상을 인지하지 못함'},
    natsume:{name:'쿠로세 나츠키',unit:'S.I.D 서부 귀환선 봉쇄조',recordFunction:'부적을 통로가 아니라 이동제한과 퇴로 표시로 사용하는 조사요원.',incident:'2006 귀환자 격리동 집단이탈 차단',abilitySource:'의식 유물 / 좌표부적',abilityCost:'봉쇄한 공간만큼 자신의 이동 반경도 같은 시간 제한됨'},
    dennis:{name:'데니스 홀트',unit:'S.I.D 서부 귀환선 감각대조조',recordFunction:'가짜 감각 신호를 만들어 귀환자의 반응과 기생체의 반응을 분리하는 요원.',incident:'2006 무응답 생존자 4명 대조',abilitySource:'위버멘시 감각더미 시술',abilityCost:'더미가 파괴될 때 본인의 통증·공포 기억으로 역류'},

    'alma-millen':{name:'웨이드 밀렌',unit:'S.O.N 레드울프망',role:'레드울프 이탈대 지휘관',recordFunction:'구조한 사람까지 처분하는 체제에 반기를 든 전직 N.H.C 지휘관.',incident:'2005 레드울프 이탈 / 2006 위버멘시 습격',abilitySource:'리버스 생존 / 무형 이계 접속',abilityCost:'이계에 머문 시간만큼 현실의 신체상과 타인의 얼굴 인식이 흐려짐'},
    violet:{name:'비올라 살비',unit:'레드울프 민간연락망',recordFunction:'이탈 전력과 피난민 사이에서 거래와 구조를 구분하려 한 정보상.',incident:'2006 실험체 탈출경로 매입'},
    'aaron-syndicate':{name:'이드리스 케이지',unit:'레드울프 돌파조',recordFunction:'U.A.C의 아론과 같은 이름으로 오인되던 별개의 창술가.',incident:'2006 위버멘시 서문 돌파',abilitySource:'선천 생기 / 관통 가속',abilityCost:'가속할수록 손목·견갑의 감각이 끊겨 무기 회수가 어려워짐'},
    saxon:{name:'콘라트 작센',unit:'레드울프 감시망',recordFunction:'벽 너머를 보는 능력 때문에 동료의 마지막 순간까지 목격한 감시자.',incident:'2006 시설 내부 구금실 위치 확인',abilitySource:'선천 생기 / 투시',abilityCost:'투시 대상의 감각 잔향이 남아 수면 중 타인의 죽음을 반복 체험'},
    isaac:{name:'아이작 벨',unit:'레드울프 회수조',recordFunction:'실험체를 짐이 아니라 사람으로 운반하라는 명령을 고집한 회수요원.',incident:'2006 방랑자 10명 탈출 호송',abilitySource:'오리진 실험 강화',abilityCost:'괴력 사용 뒤 근육이 회복될 때 타인의 음성이 환청으로 재생'},

    'mizumi-yanami':{name:'야나미 미즈호',unit:'우시노다 혈교 / 혈좌 주장자',role:'혈좌 주장자',recordFunction:'교주라는 호칭이 한 사람의 직책인지 계승 가능한 좌석인지 흔드는 인물.',incident:'2003 피의 강 결계 현장',abilitySource:'교단 계약 / 혈좌 의식',abilityCost:'타인의 피를 움직일수록 자신의 기억이 결계 참여자에게 분산'},
    'ramus-manson':{name:'엘리어스 맨슨',unit:'우시노다 타락교 / 부패좌 주장자',role:'부패좌 주장자',recordFunction:'능력을 드러내지 않고 집단의 죄책감을 의식으로 바꾸는 설교자.',incident:'2006 세 도시 동시 고백집회',abilitySource:'교단 계약 / 집단고백 의식',abilityCost:'청중의 죄책감을 받을수록 자신의 감정과 타인의 감정을 구분하지 못함'},
    'apostle-luke-eugene':{name:'루시앙 유진',unit:'우시노다 제1석 주장자',role:'제1석 주장자 / 삼권능 모방자',recordFunction:'제1사도가 한 인간인지 시대마다 되풀이되는 좌석인지 판정할 수 없게 만드는 존재.',incident:'1986 피의 호수 삼권능 흔적',abilitySource:'기원 불명 / 삼중 권능 모방',abilityCost:'복제한 기술마다 고유한 기억과 신체 특징 하나가 일시 소실'},
    'apostle-urzag':{name:'우르자그',unit:'우시노다 육체석 주장자',role:'육체석 주장자',recordFunction:'이름이 인격이 아니라 여러 육체를 건너는 명령일 가능성을 보여 주는 존재.',incident:'2004 육체이전 23분 공백',abilitySource:'의식 이식 / 육체강탈',abilityCost:'이전할 때마다 이전 숙주의 욕망과 공포가 새 육체에 잔류'},
    'apostle-jade-jackson':{name:'제이드 잭슨',unit:'우시노다 그림자석 주장자',role:'그림자석 주장자',recordFunction:'조직을 죽이지 않고 내부 기억과 그림자를 갈라 장기 붕괴시키는 침투자.',incident:'2005 S.I.D 그림자 자율행동 사건',abilitySource:'교단 계약 / 그림자 빙의',abilityCost:'침투한 정신마다 자신의 그림자가 독립 의지를 얻음'},
    'apostle-shahin':{name:'샤힌 아자르',unit:'우시노다 의지석 주장자',role:'의지석 주장자',recordFunction:'명령하지 않고 이미 가진 결심을 극단으로 밀어 자멸시키는 검사.',incident:'2006 북부전선 탈영·돌격 동시발생',abilitySource:'교단 계약 / 의지증폭',abilityCost:'타인의 결심을 증폭할수록 본인의 선택 능력이 일시 마비'},
    'apostle-moha':{name:'무사 라힘',unit:'우시노다 혈열석 주장자',role:'혈열석 주장자',recordFunction:'자신의 변형을 유지하기 위해 같은 편의 체온까지 빼앗는 전투자.',incident:'2005 신도 14명 저체온 사망',abilitySource:'의식 이식 / 혈열 변형',abilityCost:'냉각 시 신체가 이전 변형 상태로 굳고 주변인의 체온을 강제 흡수'},
    'apostle-siena-khan':{name:'시에나 칸',unit:'우시노다 자동인형석 주장자',role:'자동인형석 주장자',recordFunction:'인간과 기계의 경계를 지우다가 스스로 부품이 되어 가는 계승자.',incident:'2006 오토마톤 군집 최초 영상',abilitySource:'유물 계승 / 오토마톤 접속',abilityCost:'재생할수록 손상 부위가 생체가 아닌 기계 구조로 대체'},
    'apostle-alvarez':{name:'마테오 알바레스',unit:'우시노다 미믹석 주장자',role:'미믹석 주장자',recordFunction:'원본보다 오래 신뢰받는 복제품을 만들어 신원체계를 무너뜨리는 자.',incident:'2005 분신 명령거부 장면',abilitySource:'교단 계약 / 그림자 미믹',abilityCost:'복제한 신원이 늘수록 원래 얼굴과 목소리를 재현하지 못함'},
    'apostle-parthea-hill':{name:'파르테아 힐',unit:'우시노다 결투석 주장자',role:'결투석 주장자',recordFunction:'학살을 통제된 의식으로 포장해 혈교 내부에서도 독자행동한 검사.',incident:'2004 남부 집단처형 명령 거부',abilitySource:'교단 계약 / 혈액경화',abilityCost:'상대의 출혈을 유지하는 동안 자신의 혈액도 같은 비율로 응고'},
    'apostle-sharma':{name:'라비 샤르마',unit:'우시노다 재생석 주장자',role:'재생석 주장자',recordFunction:'재생할수록 인간의 좌우대칭과 원래 형태를 잃는 공성 전력.',incident:'2006 북부 차단벽 19시간 압박',abilitySource:'의식 이식 / 초재생',abilityCost:'큰 손상을 복구할수록 비인간 조직과 촉수가 영구 잔류'},
    'apostle-uro':{name:'우로 카인',unit:'우시노다 뇌영석 주장자',role:'뇌영석 주장자',recordFunction:'그림자와 기록선 자체를 전력 통로로 바꾸는 계승 경쟁자.',incident:'2006 시에나 계보문양 대조',abilitySource:'유물 계승 / 그림자뇌격',abilityCost:'전력을 흘린 지도·사진의 경로가 실제 기억 속 장소와 뒤섞임'},

    'semyon-reyes':{name:'세묜 레예스',unit:'P.O.H 하이먼 회랑',role:'인력·장비 운송책',recordFunction:'실험 대상으로 팔릴 사람을 운송명부의 빈자리로 빼돌리는 내부 배신자.',incident:'2005–2006 오리진 대상 6명 경로 이탈'}
  };

  root.ProjectCursePersonnelRemake=freeze({
    version:'5.54.0',schema:'project-curse-personnel-remake-v1',
    status:'CANON-FACING REVISION / LEGACY NAMES RETAINED',
    rule:'새 이름과 작전 분류는 2006년 복구 명부의 판독명이다. 구 명부명은 원본 기록·검색·별칭에서 삭제하지 않는다.',
    groupOverrides,records
  });
})(window);
