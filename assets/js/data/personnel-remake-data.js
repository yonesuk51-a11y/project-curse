// Project Curse 5.54.0 — canon-facing names, operational cells and ability costs for the 2006 register.
(function(root){
  'use strict';

  function freeze(value){
    if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const groupOverrides={
    alma:{label:'발렌 구호가문',short:'발렌',code:'VLN',tone:'family'},
    'fhc-union':{label:'F.H.C 유니온 잔존시설',short:'유니온 잔존',code:'FUN',tone:'corporate'},
    'fhc-ark':{label:'F.H.C 아크 회수구역',short:'아크 회수',code:'FAR',tone:'corporate'},
    nhc:{label:'N.H.C 제4봉쇄군',short:'제4봉쇄군',code:'N4C',tone:'field'},
    uac:{label:'U.A.C 중앙조정국',short:'중앙조정국',code:'UAC',tone:'institution'},
    syndicate:{label:'S.O.N 레드울프망',short:'레드울프망',code:'RWN',tone:'rogue'},
    ushinoda:{label:'우시노다 사도석 주장자',short:'사도석',code:'USH',tone:'cult'},
    haiman:{label:'P.O.H 하이문 회랑',short:'하이문 회랑',code:'HYM',tone:'rogue'}
  };

  const records={

    'alma-damian':{name:'데미안 발렌',unit:'발렌 가문 계약감사실',recordFunction:'구호기금이 F.H.C 시설 유지비로 전용된 흔적을 좇는 내부 감사자.',incident:'2005 유니온 산하 쉘터 장부 유출'},
    'alma-bennett':{name:'리아 발렌',unit:'발렌 이동외상진료소',recordFunction:'오염 상처를 치료한 의료인. 환자를 기관에 넘기지 않으려 했다.',incident:'2006 위버멘시 탈출자 2명 비공식 치료'},
    'alma-griffon':{name:'요나스 발렌',unit:'발렌 격리설비 정비반',recordFunction:'봉쇄 장치의 고장이 사고인지 의도된 개방인지 판정하는 기술자.',incident:'2003 C.A.P-17 민수형 결함 보고'},
    'alma-wade':{name:'엘리제 발렌',unit:'발렌 가문 의료관리실',recordFunction:'가문 구성원의 능력 발현과 후유증을 숨겨 온 의료 책임자.',incident:'1999 비인가 생기검사 기록 봉인'},
    'alma-kara':{name:'카라 발렌',unit:'유니온 잔존시설 원로회',recordFunction:'기업의 피난시설 운영권을 얻는 대신 구호가문이 무엇을 묵인했는지 보여 주는 원로.',incident:'2001 유니온 시설 독립채산 전환'},
    jake:{name:'제이크 로웰',unit:'유니온 원로회 경호계약',recordFunction:'기관 충성보다 보호 대상 한 사람에게 충성하는 민간 전투원.',incident:'2005 원로회 호송대 매복사건'},
    'alma-koenig':{name:'콘라트 발렌',unit:'유니온 제3잔존시설',recordFunction:'중앙 지휘가 끊긴 F.H.C 시설을 독립 피난소로 바꾸려 한 관리자.',incident:'2021 서브매서커 이전 지휘권 분리의 선행 사례'},

    'ezekiel-kalp':{name:'엘리아스 카르프',unit:'아크 제2회수구역',role:'아크 회수구역장',recordFunction:'연구 자산 회수와 생존자 구조를 같은 명령서에 넣은 지휘관.',incident:'2006 북해 회수선 실종사건'},
    // 2026-09-24 사용자 설정글 반영: 이름을 사쿠마 유타로 되돌리고 전직 형사·U.A.C 정보원 출신·현 하이문 리더로 적는다.
    'sakuma-yuta':{name:'사쿠마 유타',unit:'하이문 리더 / 전 U.A.C 정보원',role:'전향 정보원 / 레드 마우스',recordFunction:'전직 형사이자 U.A.C 정보원 출신. 우시노다교의 힘에 매료돼 조직을 등졌고, 교단에 사람과 물자를 대며 그 힘에 다가가려 한다.',incident:'1989 도쿄 기록 및 2006 오리진 실험체 탈출'},
    reiki:{name:'아마미야 레이',unit:'아크 공간감응 정찰조',recordFunction:'길을 찾을수록 자신의 공간 기억을 잃은 정찰원의 기록.',incident:'2005 아크 제7창고 선행정찰',abilitySource:'리버스 생존 후 공간감응',abilityCost:'감응한 경로 하나마다 개인 장소 기억 하나가 흐려짐'},

    baranto:{name:'마테오 오르테가',unit:'N.H.C 제4봉쇄군 사령부',role:'제4봉쇄군 사령관',recordFunction:'승리보다 봉쇄선 유지와 철수 결정을 책임지는 현장 지휘관.',incident:'2006 북부 차단선 재편',abilitySource:'선천 생기 / 태양계 활성',abilityCost:'회복을 앞당길수록 이후 체온·면역 기능이 급격히 저하됨'},
    yohan:{name:'요한 크루거',unit:'제4봉쇄군 지휘통신실',recordFunction:'명령을 전달하는 수행비서. 누가 그 명령을 승인했는지 확인한다.',incident:'2006 상충 철수명령 3건 보류',abilitySource:'선천 생기 / 전격 발현',abilityCost:'장거리 전도 뒤 청각과 단기기억이 순차적으로 끊김'},
    mason:{name:'마커스 콜',unit:'제4봉쇄군 원거리차단조',role:'지원 저격수 / 코드명 메이슨',recordFunction:'한 발의 성공보다 관측과 철수로를 설계하는 지원 저격수.',incident:'2005 레드울프 이탈 당시 민간 회랑 엄호',abilitySource:'선천 생기 / 투시·초감각',abilityCost:'장시간 투시 뒤 현재 시야와 예측상이 겹쳐 오인사격 위험 증가'},

    frux:{name:'알렉세이 프루신',unit:'U.A.C 중앙조정국',role:'중앙조정국장 / 프룩스',recordFunction:'관리자. 국가·기관·민간 회랑의 상충 권한을 봉인문 한 장으로 임시 조정한다.',incident:'2006 북미 시설 동시폐쇄 승인',abilitySource:'의식 유물 / 봉인부적',abilityCost:'효력이 강할수록 부적 작성자의 이름과 소속이 기록망에서 지워짐'},
    pierce:{name:'에드워드 애쉬포드',unit:'U.A.C 감독위원회',recordFunction:'기관의 비밀 작전과 공개 책임 사이에서 표결하는 위원회 대표.',incident:'2006 위버멘시 폐기 결의'},
    natalia:{name:'나탈리아 볼코바',unit:'U.A.C 정보조정실',recordFunction:'서로 모순되는 기관 보고를 지우지 않고 병기하는 정보조정관.',incident:'2006 구출자 10명 신원대조표 작성'},


    'alma-millen':{name:'웨이드 밀렌',unit:'S.O.N 레드울프망',role:'레드울프 이탈대 지휘관',recordFunction:'구조한 사람까지 처분하는 체제에 반기를 든 전직 N.H.C 지휘관.',incident:'2005 레드울프 이탈 / 2006 위버멘시 습격',abilitySource:'리버스 생존 / 무형 이계 접속',abilityCost:'이계에 머문 시간만큼 현실의 신체상과 타인의 얼굴 인식이 흐려짐'},

    'mizumi-yanami':{name:'야나미 미즈호',unit:'혈교 / 혈좌 주장자',role:'혈좌 주장자',recordFunction:'교주라는 호칭이 한 사람의 직책인지 계승 가능한 좌석인지 흔드는 인물.',incident:'2003 피의 강 결계 현장',abilitySource:'교단 계약 / 혈좌 의식',abilityCost:'타인의 피를 움직일수록 자신의 기억이 결계 참여자에게 분산'},
    'ramus-manson':{name:'엘리어스 맨슨',unit:'우시노다 타락교 / 부패좌 주장자',role:'부패좌 주장자',recordFunction:'능력을 드러내지 않고 집단의 죄책감을 의식으로 바꾸는 설교자.',incident:'2006 세 도시 동시 고백집회',abilitySource:'교단 계약 / 집단고백 의식',abilityCost:'청중의 죄책감을 받을수록 자신의 감정과 타인의 감정을 구분하지 못함'},
    'apostle-luke-eugene':{name:'루시앙 유진',unit:'우시노다 제1석 주장자',role:'제1석 주장자 / 삼권능 모방자',recordFunction:'첫 번째 사도가 한 인간인지 시대마다 되풀이되는 좌석인지 판정할 수 없게 만드는 존재.',incident:'1986 피의 호수 삼권능 흔적',abilitySource:'기원 불명 / 삼중 권능 모방',abilityCost:'복제한 기술마다 고유한 기억과 신체 특징 하나가 일시 소실'},
    'apostle-uro':{name:'우로 카인',unit:'우시노다 뇌영석 주장자',role:'뇌영석 주장자',recordFunction:'그림자와 기록선 자체를 전력 통로로 바꾸는 계승 경쟁자.',incident:'2006 시에나 계보문양 대조',abilitySource:'유물 계승 / 그림자뇌격',abilityCost:'전력을 흘린 지도·사진의 경로가 실제 기억 속 장소와 뒤섞임'},

  };

  // 2026-09-25 사용자 채택 인물 사진 — 2006년 명부 중 사쿠마 유타·마커스 콜만. 원작자 설정화의 외형을 따른 인물 재구성.
  records['sakuma-yuta'].visual={src:'assets/resources/derived/sakuma-yuta-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'검은 정장과 넥타이의 사쿠마 유타가 어두운 은신처 의자에 비스듬히 앉아 민무늬 동전 하나를 들고 옅게 웃는다.',caption:'대조용 인물 재구성 스케치다. 1989년 기록 표지의 인상을 따른다. 현재 거점과 하이문 안의 지휘 범위는 확정하지 않는다.'};
  records['mason'].visual={src:'assets/resources/derived/mason-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'긴 흑발과 전술 조끼의 메이슨이 도시 시설 창가에서 저격총을 세워 들고 있으며 얼굴 한쪽에서 여러 눈이 박힌 검붉은 잉크가 뒤로 퍼진다.',caption:'대조용 인물 재구성 스케치다. 투시의 작동 방식과 대가의 범위는 확정하지 않는다.'};
  // 2026-09-25 사용자 채택 — 인상착의 기록이 없는 네 사람의 기록 기반 인물 재구성(콘라트 발렌 A, 알렉세이 프루신 B, 루시앙 유진 A, 우로 카인 B).
  records['alma-koenig'].visual={src:'assets/resources/derived/alma-koenig-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'어두운 연구시설 회의실에서 긴 코트를 팔에 걸친 콘라트 발렌이 탁자 위 테이프 녹음기의 빠진 전원 플러그를 내려놓는다.',caption:'대조용 인물 재구성 스케치다. 인상착의 기록이 없어 기록된 나이·직책·습관으로 외형을 재구성했다. 실제 회의의 시각·참석자와 피난소 전환의 완료 여부는 확정하지 않는다.'};
  records['frux'].visual={src:'assets/resources/derived/frux-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'가는 콧수염과 높은 옷깃의 알렉세이 프루신이 책상등 아래에서 글자 없는 부적 종이를 실로 꿰매고 있다.',caption:'대조용 인물 재구성 스케치다. 인상착의 기록이 없어 기록된 나이·직책·습관(다 쓴 부적을 꿰매 보관)으로 외형을 재구성했다. 현재 신원과 재임, 부적 작성자의 정체는 확정하지 않는다.'};
  records['apostle-luke-eugene'].visual={src:'assets/resources/derived/apostle-luke-eugene-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'묶은 긴 머리와 모피 깃 망토의 루시앙 유진이 라벤더 불빛이 비치는 지하문 통로에서 바닥의 검붉은 얼룩을 돌아본다.',caption:'대조용 인물 재구성 스케치다. 인상착의 기록이 없어 기록된 나이·출신·권능으로 외형을 재구성했다. 제6안의 모양, 흔적을 남긴 행위와 알룰림과의 관계는 확정하지 않는다.'};
  records['apostle-uro'].visual={src:'assets/resources/derived/apostle-uro-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'파란 작업복 상의를 허리에 묶은 마른 우로 카인이 작업대에 기대 기계를 바라보고, 벽의 지도 선을 따라 어두운 번개가 흐른다.',caption:'대조용 인물 재구성 스케치다. 인상착의 기록이 없어 기록된 나이·출신·습관(남의 기계를 오래 관찰)으로 외형을 재구성했다. 지도의 실제 위치, 계보 문양과 시에나 칸과의 관계는 확정하지 않는다.'};
  // 2026-09-25 사용자 채택 — 지휘부 6명(웨이드 밀렌 A, 요한 크루거 A, 마테오 오르테가 A, 에드워드 애쉬포드 B, 엘리아스 카르프 B, 카라 발렌 A). 애쉬포드·카르프는 젊은 외모.
  records['alma-millen'].visual={src:'assets/resources/derived/alma-millen-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'밤의 컨테이너 항만에서 짧은 잿빛 금발의 웨이드 밀렌이 캔버스 가방을 옆구리에 끼고 앞을 살핀다.',caption:'대조용 인물 재구성 스케치다. 인상착의 기록이 없어 외형을 새로 재구성했다. 무형 이계를 지나는 방식과 알마 가문과의 관계는 확정하지 않는다.'};
  records['yohan'].visual={src:'assets/resources/derived/yohan-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'꺼진 모니터와 서류함이 있는 지휘통신실에서 안경을 쓴 요한 크루거가 한쪽 무릎을 대고 끈으로 묶은 종이 명령서 두 벌을 들고 있다.',caption:'대조용 인물 재구성 스케치다. 인상착의 기록이 없어 외형을 새로 재구성했다. 명령서의 내용과 승인자, 전격의 생기가 드러나는 모습은 확정하지 않는다.'};
  records['baranto'].visual={src:'assets/resources/derived/baranto-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'짧은 은회색 머리의 마테오 오르테가가 난로 불빛이 비치는 지휘소에서 유선 야전 전화의 수화기를 귀에 대고 있다.',caption:'대조용 인물 재구성 스케치다. 인상착의 기록이 없어 외형을 새로 재구성했다. 기록된 나이보다 늙어 보인다. 통화 내용과 철수 결정은 확정하지 않는다.'};
  records['pierce'].visual={src:'assets/resources/derived/pierce-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'책상등이 켜진 위원회 회의실에서 빗어 넘긴 밤색 머리의 에드워드 애쉬포드가 조끼 차림으로 앉아 표식 화살 하나를 살피고, 무릎에 낡은 나무 활을 올려 두었다.',caption:'대조용 인물 재구성 스케치다. 겉모습이 기록된 나이(52세)보다 훨씬 젊다. 젊음을 유지하는 힘의 정체와 대가는 확정하지 않는다.'};
  records['ezekiel-kalp'].visual={src:'assets/resources/derived/ezekiel-kalp-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'장비 창고의 선반 사이에서 짧은 적갈색 머리의 엘리아스 카르프가 무전 가방을 메고 작은 운반함을 든 채 돌아본다.',caption:'대조용 인물 재구성 스케치다. 겉모습이 기록된 나이(49세)보다 훨씬 젊다. 젊음을 유지하는 힘의 정체와 대가, 다른 능력의 유무는 확정하지 않는다.'};
  records['alma-kara'].visual={src:'assets/resources/derived/alma-kara-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'어두운 면담실에서 흰 쪽머리의 카라 발렌이 울 숄을 두르고 빈 문서 위에 만년필을 든 채 맞은편을 바라본다.',caption:'대조용 인물 재구성 스케치다. 인상착의 기록이 없어 외형을 새로 재구성했다. 서명하는 문서의 내용과 가문 안의 지위는 확정하지 않는다.'};

  root.ProjectCursePersonnelRemake=freeze({
    version:'5.54.0',schema:'project-curse-personnel-remake-v1',
    status:'CANON-FACING REVISION / LEGACY NAMES RETAINED',
    rule:'새 이름과 작전 분류는 2006년 복구 명부의 판독명이다. 구 명부명은 원본 기록·검색·별칭에서 삭제하지 않는다.',
    groupOverrides,records
  });
})(window);
