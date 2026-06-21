window.UAC_DATA = {
  "factions": [
    {
      "id": "U.A.C",
      "type": "통제/격리",
      "role": "도시 이상현상 격리·기록 검열·레드존/블랙존 판정권을 가진 중앙 서버 권한 기관."
    },
    {
      "id": "N.H.C",
      "type": "현장 전투",
      "role": "레드존 진입, 봉쇄선 유지, 민간인 대피, 페럴 제압을 담당하는 재난 전투 조직."
    },
    {
      "id": "S.I.D",
      "type": "수사/오컬트",
      "role": "실종, 의식, 우시노다교, Cold File을 추적하는 특수수사 부서."
    },
    {
      "id": "A.R.F",
      "type": "회수/복구",
      "role": "생존자, 시체, 장비, 오염 샘플, 바디캠·녹취 자료를 회수."
    },
    {
      "id": "C.P.D",
      "type": "민간 보호",
      "role": "대피소, 검문소, 귀환자 선별, Returned Civilian 판정과 격리를 담당."
    },
    {
      "id": "Ash Crew",
      "type": "오염 회수",
      "role": "사망자·파손 혈무·오염 장비를 회수하는 작전 종료 이후 투입 부대."
    },
    {
      "id": "Wivermensi",
      "type": "강화 요원",
      "role": "저주성 힘, Wave Frame, W-Coat, 혈무를 운용하는 인간형 특수 병기."
    },
    {
      "id": "F.H.C",
      "type": "기밀 연구",
      "role": "괴이 유전자, 생체 병기, 강제 진화, 비인가 실험체 관리를 수행."
    },
    {
      "id": "Redwolf",
      "type": "이탈자",
      "role": "정규 명령 체계를 이탈한 레드존 전투 경험자 집단."
    },
    {
      "id": "Ushinoda Cult",
      "type": "의식 집단",
      "role": "피의 길, 축복, 불멸, 변이 의식과 연계된 종교성 위험 세력."
    },
    {
      "id": "Blood Cult",
      "type": "적대 숭배",
      "role": "피, 희생, 타락 개체 숭배, 혈무·저주 병기 의식을 수행."
    },
    {
      "id": "Syndicate",
      "type": "지하 거래",
      "role": "괴이 부산물, 회수품, 실험체, 탈취 장비를 거래하는 비공식 네트워크."
    }
  ],
  "relations": [
    [
      "U.A.C",
      "N.H.C",
      "지휘/승인",
      "N.H.C 작전 승인권과 기록 검열 권한을 보유"
    ],
    [
      "U.A.C",
      "S.I.D",
      "협력/감시",
      "오컬트 사건 자료를 공유하지만 검열 충돌 발생"
    ],
    [
      "N.H.C",
      "A.R.F",
      "현장 연계",
      "작전 실패 지역에서 회수 루트 공유"
    ],
    [
      "C.P.D",
      "S.I.D",
      "귀환자 판정",
      "심문·격리·가족 통보를 둘러싼 권한 충돌"
    ],
    [
      "F.H.C",
      "U.A.C",
      "기밀 협력",
      "연구 승인과 은폐 책임이 모호하게 연결"
    ],
    [
      "Redwolf",
      "N.H.C",
      "이탈/추적",
      "전직 현장 전투원의 장비·전술 유출 위험"
    ],
    [
      "Ushinoda Cult",
      "Blood Cult",
      "의식 공명",
      "혈액·축복·불멸 의식에서 교차 흔적 발생"
    ],
    [
      "Syndicate",
      "Redwolf",
      "거래 가능",
      "탈취 장비와 오염 부산물 시장으로 연결"
    ],
    [
      "Wivermensi",
      "Queen-Type",
      "최고위험 교전",
      "상위 계급만 제한적으로 교전 가능"
    ]
  ],
  "records": [
    {
      "code": "Faction_860403",
      "origin": "주요 세력 기록서",
      "cat": "DATABASE",
      "risk": "RESTRICTED",
      "summary": "U.A.C, N.H.C, S.I.D, A.R.F, C.P.D, F.H.C, Redwolf, cult networks의 역할과 충돌 구조.",
      "pages": [
        [
          "압축 분류",
          "STATUS: VERIFIED / ACCESS: INTERNAL / DAMAGE: 12%. 관련 태그는 FACTION, U.A.C, N.H.C, S.I.D로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "세력 요약",
          "U.A.C는 통제하고, N.H.C는 현장에 진입하며, S.I.D는 사건의 원인을 추적한다. A.R.F는 회수, C.P.D는 민간인 선별, F.H.C는 기밀 연구를 담당한다."
        ],
        [
          "운영 권한",
          "레드존 선포와 블랙존 폐쇄는 U.A.C 승인망을 거치며, 현장 작전은 N.H.C가 수행한다. 실패 지역의 자료는 A.R.F가 회수하고 S.I.D가 오컬트 흔적을 분석한다."
        ],
        [
          "불안정 관계",
          "F.H.C의 연구, 기업 장비 납품, 신디케이트 거래, Redwolf 이탈은 공식 봉쇄 체계를 계속 약화시킨다."
        ]
      ],
      "status": "VERIFIED",
      "access": "INTERNAL",
      "damage": 12,
      "tags": [
        "FACTION",
        "U.A.C",
        "N.H.C",
        "S.I.D"
      ],
      "related": [
        "Personnel_890617",
        "Cults_871104",
        "Unknown Record3_920711",
        "NHC Manual_891219"
      ],
      "extended": "Faction_860403는 주요 세력 기록서에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 VERIFIED, 접근 권한은 INTERNAL, 기록 손상도는 12%로 표시된다. 핵심 태그는 FACTION, U.A.C, N.H.C, S.I.D이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: VERIFIED / ACCESS: INTERNAL / DAMAGE: 12%. 관련 태그는 FACTION, U.A.C, N.H.C, S.I.D로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 세력 요약: U.A.C는 통제하고, N.H.C는 현장에 진입하며, S.I.D는 사건의 원인을 추적한다. A.R.F는 회수, C.P.D는 민간인 선별, F.H.C는 기밀 연구를 담당한다.\n- 운영 권한: 레드존 선포와 블랙존 폐쇄는 U.A.C 승인망을 거치며, 현장 작전은 N.H.C가 수행한다. 실패 지역의 자료는 A.R.F가 회수하고 S.I.D가 오컬트 흔적을 분석한다.\n- 불안정 관계: F.H.C의 연구, 기업 장비 납품, 신디케이트 거래, Redwolf 이탈은 공식 봉쇄 체계를 계속 약화시킨다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Personnel_890617",
      "origin": "인물 프로필 기록",
      "cat": "PERSONNEL",
      "risk": "CLASSIFIED",
      "summary": "요원, 생존자, 귀환자, Young Soldier, Wivermensi의 상태와 사건 연계 기록.",
      "pages": [
        [
          "압축 분류",
          "STATUS: PARTIAL / ACCESS: CLASSIFIED / DAMAGE: 29%. 관련 태그는 PERSONNEL, YOUNG SOLDIER, WIVERMENSI로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "인물 판정",
          "인물 기록은 생존/사망/실종/귀환자/격리 대상으로 나뉜다. 신체 상태보다 기억 오류와 의식 반응이 더 중요한 판정 근거가 된다."
        ],
        [
          "현장 인력",
          "Young Soldier는 정규 Wivermensi와 구분되며, 장비와 훈련이 부족한 상태로 고위험 작전에 투입되는 경우가 많다."
        ]
      ],
      "status": "PARTIAL",
      "access": "CLASSIFIED",
      "damage": 29,
      "tags": [
        "PERSONNEL",
        "YOUNG SOLDIER",
        "WIVERMENSI"
      ],
      "related": [
        "Faction_860403",
        "NHC Manual_891219",
        "Sakuma Tape_991028",
        "FCR Archive_890402"
      ],
      "extended": "Personnel_890617는 인물 프로필 기록에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 PARTIAL, 접근 권한은 CLASSIFIED, 기록 손상도는 29%로 표시된다. 핵심 태그는 PERSONNEL, YOUNG SOLDIER, WIVERMENSI이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: PARTIAL / ACCESS: CLASSIFIED / DAMAGE: 29%. 관련 태그는 PERSONNEL, YOUNG SOLDIER, WIVERMENSI로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 인물 판정: 인물 기록은 생존/사망/실종/귀환자/격리 대상으로 나뉜다. 신체 상태보다 기억 오류와 의식 반응이 더 중요한 판정 근거가 된다.\n- 현장 인력: Young Soldier는 정규 Wivermensi와 구분되며, 장비와 훈련이 부족한 상태로 고위험 작전에 투입되는 경우가 많다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Ferals_860722",
      "origin": "타락 개체 분류 보고서",
      "cat": "ENTITY",
      "risk": "BLACK",
      "summary": "Feral, Queen-Type, Superior-Type, Artificial, Hybrid 등 괴이 생태계 분류.",
      "pages": [
        [
          "압축 분류",
          "STATUS: CORRUPTED / ACCESS: BLACK FILE / DAMAGE: 67%. 관련 태그는 ENTITY, FERAL, QUEEN-TYPE, SUPERIOR-TYPE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "개체 생태계",
          "Feral은 집단형 하위 개체이며, Superior-Type은 지능과 전투력이 높은 정예형 위협이다. Queen-Type은 도시 단위 생태계를 형성한다."
        ],
        [
          "위험 기준",
          "괴이의 위험도는 크기가 아니라 지휘 신호, 오염 확산력, 장벽 관통성, 귀환자와의 연계 반응으로 판정한다."
        ],
        [
          "인공 흔적",
          "Artificial과 Hybrid는 실험 장치, 구속구, 기계 접합, 명령어 반응을 동반하며 F.H.C 또는 기업 시설과 연결될 가능성이 있다."
        ]
      ],
      "status": "CORRUPTED",
      "access": "BLACK FILE",
      "damage": 67,
      "tags": [
        "ENTITY",
        "FERAL",
        "QUEEN-TYPE",
        "SUPERIOR-TYPE"
      ],
      "related": [
        "FCR Archive_890402",
        "Redzone_881120",
        "Unknown Record2_860205",
        "NHC Manual_891219"
      ],
      "extended": "Ferals_860722는 타락 개체 분류 보고서에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 CORRUPTED, 접근 권한은 BLACK FILE, 기록 손상도는 67%로 표시된다. 핵심 태그는 ENTITY, FERAL, QUEEN-TYPE, SUPERIOR-TYPE이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: CORRUPTED / ACCESS: BLACK FILE / DAMAGE: 67%. 관련 태그는 ENTITY, FERAL, QUEEN-TYPE, SUPERIOR-TYPE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 개체 생태계: Feral은 집단형 하위 개체이며, Superior-Type은 지능과 전투력이 높은 정예형 위협이다. Queen-Type은 도시 단위 생태계를 형성한다.\n- 위험 기준: 괴이의 위험도는 크기가 아니라 지휘 신호, 오염 확산력, 장벽 관통성, 귀환자와의 연계 반응으로 판정한다.\n- 인공 흔적: Artificial과 Hybrid는 실험 장치, 구속구, 기계 접합, 명령어 반응을 동반하며 F.H.C 또는 기업 시설과 연결될 가능성이 있다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Cults_871104",
      "origin": "F.H.C 극비 보안 문서",
      "cat": "BLACK FILE",
      "risk": "TOP SECRET",
      "summary": "F.H.C, 우시노다교, Blood Cult, 비인가 실험과 기밀 보안 체계.",
      "pages": [
        [
          "압축 분류",
          "STATUS: SEALED / ACCESS: COMMAND ONLY / DAMAGE: 53%. 관련 태그는 F.H.C, USHINODA CULT, BLOOD CULT로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "기밀 연구",
          "F.H.C는 괴이 유전자, 생체 병기, 강제 진화, 인공 조직 복원 기술을 연구한다. 공식 기록과 실험 로그가 서로 다를 수 있다."
        ],
        [
          "의식성 위협",
          "우시노다교와 Blood Cult는 피, 축복, 불멸, 귀환자 신성화 언어를 통해 변이와 괴이 발생을 의식화한다."
        ]
      ],
      "status": "SEALED",
      "access": "COMMAND ONLY",
      "damage": 53,
      "tags": [
        "F.H.C",
        "USHINODA CULT",
        "BLOOD CULT"
      ],
      "related": [
        "Faction_860403",
        "FCR Archive_890402",
        "Unknown Record4_930314",
        "Unknown Record5_940626"
      ],
      "extended": "Cults_871104는 F.H.C 극비 보안 문서에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 SEALED, 접근 권한은 COMMAND ONLY, 기록 손상도는 53%로 표시된다. 핵심 태그는 F.H.C, USHINODA CULT, BLOOD CULT이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: SEALED / ACCESS: COMMAND ONLY / DAMAGE: 53%. 관련 태그는 F.H.C, USHINODA CULT, BLOOD CULT로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 기밀 연구: F.H.C는 괴이 유전자, 생체 병기, 강제 진화, 인공 조직 복원 기술을 연구한다. 공식 기록과 실험 로그가 서로 다를 수 있다.\n- 의식성 위협: 우시노다교와 Blood Cult는 피, 축복, 불멸, 귀환자 신성화 언어를 통해 변이와 괴이 발생을 의식화한다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Sakuma Tape_991028",
      "origin": "사쿠마 유타 실종 사건 보고서",
      "cat": "MISSING",
      "risk": "RESTRICTED",
      "summary": "실종 기록, 최종 목격, 복구된 테이프, 귀환자 판정 가능성.",
      "pages": [
        [
          "압축 분류",
          "STATUS: PARTIAL / ACCESS: RESTRICTED / DAMAGE: 48%. 관련 태그는 MISSING, S.I.D, COLD FILE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "실종 기록",
          "사쿠마 유타의 실종은 단순 사건이 아니라 Cold File 재활성화와 유사한 기록 왜곡 흔적을 남긴다."
        ],
        [
          "회수 매체",
          "테이프와 영상 로그는 끊김, 반복 프레임, 시간 불일치가 발견되며 원본성 검증이 필요하다."
        ]
      ],
      "status": "PARTIAL",
      "access": "RESTRICTED",
      "damage": 48,
      "tags": [
        "MISSING",
        "S.I.D",
        "COLD FILE"
      ],
      "related": [
        "Personnel_890617",
        "Redzone_881120",
        "FCR Archive_890402",
        "Unknown Record1_860204"
      ],
      "extended": "Sakuma Tape_991028는 사쿠마 유타 실종 사건 보고서에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 PARTIAL, 접근 권한은 RESTRICTED, 기록 손상도는 48%로 표시된다. 핵심 태그는 MISSING, S.I.D, COLD FILE이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: PARTIAL / ACCESS: RESTRICTED / DAMAGE: 48%. 관련 태그는 MISSING, S.I.D, COLD FILE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 실종 기록: 사쿠마 유타의 실종은 단순 사건이 아니라 Cold File 재활성화와 유사한 기록 왜곡 흔적을 남긴다.\n- 회수 매체: 테이프와 영상 로그는 끊김, 반복 프레임, 시간 불일치가 발견되며 원본성 검증이 필요하다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Unknown Record1_860204",
      "origin": "아마리온 회수 영상 기록",
      "cat": "RECOVERY",
      "risk": "CLASSIFIED",
      "summary": "아마리온 관련 회수 영상, 생체 복원, 기업 연구 흔적.",
      "pages": [
        [
          "압축 분류",
          "STATUS: PARTIAL / ACCESS: CLASSIFIED / DAMAGE: 41%. 관련 태그는 RECOVERY, AMARION, BIO-RESEARCH로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "회수 영상",
          "아마리온 회수 기록은 의료 기업 문서처럼 보이지만, 생명 연장·세포 재구성·괴이 유래 물질 연구 흔적을 포함한다."
        ],
        [
          "기업 연결",
          "공식 제약 연구와 비인가 생체 병기 연구의 경계가 흐려진다."
        ]
      ],
      "status": "PARTIAL",
      "access": "CLASSIFIED",
      "damage": 41,
      "tags": [
        "RECOVERY",
        "AMARION",
        "BIO-RESEARCH"
      ],
      "related": [
        "Unknown Record5_940626",
        "Cults_871104",
        "NHC Manual_891219",
        "Timeline_860101"
      ],
      "extended": "Unknown Record1_860204는 아마리온 회수 영상 기록에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 PARTIAL, 접근 권한은 CLASSIFIED, 기록 손상도는 41%로 표시된다. 핵심 태그는 RECOVERY, AMARION, BIO-RESEARCH이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: PARTIAL / ACCESS: CLASSIFIED / DAMAGE: 41%. 관련 태그는 RECOVERY, AMARION, BIO-RESEARCH로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 회수 영상: 아마리온 회수 기록은 의료 기업 문서처럼 보이지만, 생명 연장·세포 재구성·괴이 유래 물질 연구 흔적을 포함한다.\n- 기업 연결: 공식 제약 연구와 비인가 생체 병기 연구의 경계가 흐려진다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Unknown Record2_860205",
      "origin": "피의 호수 부검 기록",
      "cat": "AUTOPSY",
      "risk": "BLACK",
      "summary": "피의 호수, 부검 소견, 비정상 조직, 불멸 연구 실패의 원점.",
      "pages": [
        [
          "압축 분류",
          "STATUS: CORRUPTED / ACCESS: BLACK FILE / DAMAGE: 71%. 관련 태그는 AUTOPSY, BLOOD LAKE, ORIGIN로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "부검 소견",
          "피의 호수 기록은 정상 의학 문서로 처리할 수 없는 조직 변성, 혈액 반응, 기억성 오염을 동반한다."
        ],
        [
          "기원 사건",
          "1986년 불멸 연구 실패 이후 U.A.C 설립과 괴이 유전자 보존 프로젝트가 시작된다."
        ]
      ],
      "status": "CORRUPTED",
      "access": "BLACK FILE",
      "damage": 71,
      "tags": [
        "AUTOPSY",
        "BLOOD LAKE",
        "ORIGIN"
      ],
      "related": [
        "Immortality_860201",
        "Ferals_860722",
        "Redzone_881120",
        "Timeline_860101"
      ],
      "extended": "Unknown Record2_860205는 피의 호수 부검 기록에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 CORRUPTED, 접근 권한은 BLACK FILE, 기록 손상도는 71%로 표시된다. 핵심 태그는 AUTOPSY, BLOOD LAKE, ORIGIN이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: CORRUPTED / ACCESS: BLACK FILE / DAMAGE: 71%. 관련 태그는 AUTOPSY, BLOOD LAKE, ORIGIN로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 부검 소견: 피의 호수 기록은 정상 의학 문서로 처리할 수 없는 조직 변성, 혈액 반응, 기억성 오염을 동반한다.\n- 기원 사건: 1986년 불멸 연구 실패 이후 U.A.C 설립과 괴이 유전자 보존 프로젝트가 시작된다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Unknown Record3_920711",
      "origin": "레드울프 이탈 기록",
      "cat": "DEFECTION",
      "risk": "RESTRICTED",
      "summary": "Redwolf 이탈, 탈취 장비, 신디케이트 연계, 추적 대상 기록.",
      "pages": [
        [
          "압축 분류",
          "STATUS: VERIFIED / ACCESS: RESTRICTED / DAMAGE: 22%. 관련 태그는 REDWOLF, DEFECTION, SYNDICATE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "이탈 경위",
          "Redwolf는 정규 명령 체계에서 벗어난 전투 집단이며 일부 특수 장비와 레드존 작전 지식을 보유한다."
        ],
        [
          "위험성",
          "이들의 존재는 N.H.C 교리 실패와 내부 신뢰 붕괴를 증명한다."
        ]
      ],
      "status": "VERIFIED",
      "access": "RESTRICTED",
      "damage": 22,
      "tags": [
        "REDWOLF",
        "DEFECTION",
        "SYNDICATE"
      ],
      "related": [
        "Faction_860403",
        "NHC Manual_891219",
        "Cults_871104",
        "Timeline_860101"
      ],
      "extended": "Unknown Record3_920711는 레드울프 이탈 기록에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 VERIFIED, 접근 권한은 RESTRICTED, 기록 손상도는 22%로 표시된다. 핵심 태그는 REDWOLF, DEFECTION, SYNDICATE이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: VERIFIED / ACCESS: RESTRICTED / DAMAGE: 22%. 관련 태그는 REDWOLF, DEFECTION, SYNDICATE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 이탈 경위: Redwolf는 정규 명령 체계에서 벗어난 전투 집단이며 일부 특수 장비와 레드존 작전 지식을 보유한다.\n- 위험성: 이들의 존재는 N.H.C 교리 실패와 내부 신뢰 붕괴를 증명한다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Unknown Record4_930314",
      "origin": "축복으로 위장된 병기",
      "cat": "WEAPON",
      "risk": "CLASSIFIED",
      "summary": "축복·구원 언어로 위장된 저주성 병기와 의식 장비.",
      "pages": [
        [
          "압축 분류",
          "STATUS: REDACTED / ACCESS: CLASSIFIED / DAMAGE: 39%. 관련 태그는 WEAPON, BLOOD WEAPON, CURSE-ARMAMENT로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "위장 병기",
          "일부 병기는 종교적 축복, 치료, 구원의 형태로 포장되지만 실제로는 저주성 변이와 동기화 장치로 작동한다."
        ],
        [
          "식별법",
          "반복 문장, 혈액 반응, 귀환자 공명, 기도문 형태의 조작 명령을 확인해야 한다."
        ]
      ],
      "status": "REDACTED",
      "access": "CLASSIFIED",
      "damage": 39,
      "tags": [
        "WEAPON",
        "BLOOD WEAPON",
        "CURSE-ARMAMENT"
      ],
      "related": [
        "Cults_871104",
        "Unknown Record5_940626",
        "Personnel_890617",
        "NHC Manual_891219"
      ],
      "extended": "Unknown Record4_930314는 축복으로 위장된 병기에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 REDACTED, 접근 권한은 CLASSIFIED, 기록 손상도는 39%로 표시된다. 핵심 태그는 WEAPON, BLOOD WEAPON, CURSE-ARMAMENT이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: REDACTED / ACCESS: CLASSIFIED / DAMAGE: 39%. 관련 태그는 WEAPON, BLOOD WEAPON, CURSE-ARMAMENT로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 위장 병기: 일부 병기는 종교적 축복, 치료, 구원의 형태로 포장되지만 실제로는 저주성 변이와 동기화 장치로 작동한다.\n- 식별법: 반복 문장, 혈액 반응, 귀환자 공명, 기도문 형태의 조작 명령을 확인해야 한다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Immortality_860201",
      "origin": "불멸을 향해",
      "cat": "ORIGIN",
      "risk": "OMEGA",
      "summary": "불멸 연구, 피의 호수 작전, U.A.C 설립으로 이어지는 기원 기록.",
      "pages": [
        [
          "압축 분류",
          "STATUS: SEALED / ACCESS: OMEGA / DAMAGE: 82%. 관련 태그는 ORIGIN, IMMORTALITY, BLOOD LAKE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "불멸 연구",
          "불멸 프로젝트는 생명 연장 연구가 아니라 인간·괴이·저주성 조직의 경계를 붕괴시키는 실패한 실험으로 남았다."
        ],
        [
          "후속 영향",
          "이 사건 이후 도시형 이상현상을 격리하기 위한 U.A.C 체계가 만들어졌다."
        ]
      ],
      "status": "SEALED",
      "access": "OMEGA",
      "damage": 82,
      "tags": [
        "ORIGIN",
        "IMMORTALITY",
        "BLOOD LAKE"
      ],
      "related": [
        "Unknown Record2_860205",
        "Timeline_860101",
        "Cults_871104",
        "Redzone_881120"
      ],
      "extended": "Immortality_860201는 불멸을 향해에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 SEALED, 접근 권한은 OMEGA, 기록 손상도는 82%로 표시된다. 핵심 태그는 ORIGIN, IMMORTALITY, BLOOD LAKE이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: SEALED / ACCESS: OMEGA / DAMAGE: 82%. 관련 태그는 ORIGIN, IMMORTALITY, BLOOD LAKE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 불멸 연구: 불멸 프로젝트는 생명 연장 연구가 아니라 인간·괴이·저주성 조직의 경계를 붕괴시키는 실패한 실험으로 남았다.\n- 후속 영향: 이 사건 이후 도시형 이상현상을 격리하기 위한 U.A.C 체계가 만들어졌다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Zone_870815",
      "origin": "구역 위험도 분류 문서",
      "cat": "ZONE",
      "risk": "ACTIVE",
      "summary": "Yellow Zone, Red Zone, Black Zone, 격리선과 진입 권한 기준.",
      "pages": [
        [
          "압축 분류",
          "STATUS: ACTIVE / ACCESS: INTERNAL / DAMAGE: 8%. 관련 태그는 ZONE SYSTEM, REDZONE, BLACKZONE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "구역 단계",
          "Yellow Zone은 초기 이상 징후, Red Zone은 군사 봉쇄, Black Zone은 현실 통제 상실 상태를 의미한다."
        ],
        [
          "진입 권한",
          "Red Zone은 N.H.C 승인 작전, Black Zone은 상위 Wivermensi 또는 특수 회수 명령 없이는 진입 금지다."
        ]
      ],
      "status": "ACTIVE",
      "access": "INTERNAL",
      "damage": 8,
      "tags": [
        "ZONE SYSTEM",
        "REDZONE",
        "BLACKZONE"
      ],
      "related": [
        "Redzone_881120",
        "Timeline_860101",
        "NHC Manual_891219",
        "Faction_860403"
      ],
      "extended": "Zone_870815는 구역 위험도 분류 문서에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 ACTIVE, 접근 권한은 INTERNAL, 기록 손상도는 8%로 표시된다. 핵심 태그는 ZONE SYSTEM, REDZONE, BLACKZONE이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: ACTIVE / ACCESS: INTERNAL / DAMAGE: 8%. 관련 태그는 ZONE SYSTEM, REDZONE, BLACKZONE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 구역 단계: Yellow Zone은 초기 이상 징후, Red Zone은 군사 봉쇄, Black Zone은 현실 통제 상실 상태를 의미한다.\n- 진입 권한: Red Zone은 N.H.C 승인 작전, Black Zone은 상위 Wivermensi 또는 특수 회수 명령 없이는 진입 금지다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Unknown Record5_940626",
      "origin": "새로운 세계를 위한 유전자 기록",
      "cat": "GENETIC",
      "risk": "TOP SECRET",
      "summary": "괴이 유전자 디지털화, 생체 프린팅, 강제 진화, 인공 괴이 설계.",
      "pages": [
        [
          "압축 분류",
          "STATUS: SEALED / ACCESS: COMMAND ONLY / DAMAGE: 64%. 관련 태그는 GENETIC, BIO-WEAPON, ARTIFICIAL로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "유전자 기록",
          "괴이 생체 정보는 분석·보존·복제 가능한 데이터로 전환되며, 인공 조직 제작과 생체 병기 설계에 쓰인다."
        ],
        [
          "위험성",
          "실험 실패는 단순 탈주가 아니라 연구 시설 자체의 레드존화로 이어질 수 있다."
        ]
      ],
      "status": "SEALED",
      "access": "COMMAND ONLY",
      "damage": 64,
      "tags": [
        "GENETIC",
        "BIO-WEAPON",
        "ARTIFICIAL"
      ],
      "related": [
        "Cults_871104",
        "Unknown Record4_930314",
        "Ferals_860722",
        "Unknown Record1_860204"
      ],
      "extended": "Unknown Record5_940626는 새로운 세계를 위한 유전자 기록에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 SEALED, 접근 권한은 COMMAND ONLY, 기록 손상도는 64%로 표시된다. 핵심 태그는 GENETIC, BIO-WEAPON, ARTIFICIAL이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: SEALED / ACCESS: COMMAND ONLY / DAMAGE: 64%. 관련 태그는 GENETIC, BIO-WEAPON, ARTIFICIAL로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 유전자 기록: 괴이 생체 정보는 분석·보존·복제 가능한 데이터로 전환되며, 인공 조직 제작과 생체 병기 설계에 쓰인다.\n- 위험성: 실험 실패는 단순 탈주가 아니라 연구 시설 자체의 레드존화로 이어질 수 있다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Timeline_860101",
      "origin": "Project Curse 연표 기록",
      "cat": "TIMELINE",
      "risk": "ARCHIVE",
      "summary": "1986 기원 사건부터 First Red Zone War, Black Wall Collapse, 2026 현황까지.",
      "pages": [
        [
          "압축 분류",
          "STATUS: VERIFIED / ACCESS: ARCHIVE / DAMAGE: 15%. 관련 태그는 TIMELINE, WAR, COLLAPSE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "주요 연표",
          "1986 피의 호수, First Red Zone War, Black Wall Collapse, Cold File Reactivation, Queen-Type Emergence가 핵심 분기점이다."
        ],
        [
          "2026 상태",
          "현재 U.A.C 정보 서버는 레드존 확산과 블랙존 관측 오류를 지속 갱신 중이다."
        ]
      ],
      "status": "VERIFIED",
      "access": "ARCHIVE",
      "damage": 15,
      "tags": [
        "TIMELINE",
        "WAR",
        "COLLAPSE"
      ],
      "related": [
        "Immortality_860201",
        "Zone_870815",
        "Unknown Record2_860205",
        "Unknown Record3_920711"
      ],
      "extended": "Timeline_860101는 Project Curse 연표 기록에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 VERIFIED, 접근 권한은 ARCHIVE, 기록 손상도는 15%로 표시된다. 핵심 태그는 TIMELINE, WAR, COLLAPSE이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: VERIFIED / ACCESS: ARCHIVE / DAMAGE: 15%. 관련 태그는 TIMELINE, WAR, COLLAPSE로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 주요 연표: 1986 피의 호수, First Red Zone War, Black Wall Collapse, Cold File Reactivation, Queen-Type Emergence가 핵심 분기점이다.\n- 2026 상태: 현재 U.A.C 정보 서버는 레드존 확산과 블랙존 관측 오류를 지속 갱신 중이다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "Redzone_881120",
      "origin": "레드존 이상현상 및 오염 기준 문서",
      "cat": "CONTAMINATION",
      "risk": "ACTIVE",
      "summary": "오염 단계, 정신 감염, 기록 오류, 현장 검사 기준.",
      "pages": [
        [
          "압축 분류",
          "STATUS: ACTIVE / ACCESS: RESTRICTED / DAMAGE: 24%. 관련 태그는 CONTAMINATION, REDZONE, RETURNED CIVILIAN로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "오염 기준",
          "레드존 오염은 신체 반응뿐 아니라 기억 오류, 반복 언어, 감각 왜곡, 영상 기록 불일치로 판정한다."
        ],
        [
          "정신 감염",
          "노출자는 특정 숫자, 노래, 문장, 검은 액체 이미지에 반응할 수 있다."
        ]
      ],
      "status": "ACTIVE",
      "access": "RESTRICTED",
      "damage": 24,
      "tags": [
        "CONTAMINATION",
        "REDZONE",
        "RETURNED CIVILIAN"
      ],
      "related": [
        "Zone_870815",
        "Ferals_860722",
        "FCR Archive_890402",
        "NHC Manual_891219"
      ],
      "extended": "Redzone_881120는 레드존 이상현상 및 오염 기준 문서에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 ACTIVE, 접근 권한은 RESTRICTED, 기록 손상도는 24%로 표시된다. 핵심 태그는 CONTAMINATION, REDZONE, RETURNED CIVILIAN이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: ACTIVE / ACCESS: RESTRICTED / DAMAGE: 24%. 관련 태그는 CONTAMINATION, REDZONE, RETURNED CIVILIAN로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 오염 기준: 레드존 오염은 신체 반응뿐 아니라 기억 오류, 반복 언어, 감각 왜곡, 영상 기록 불일치로 판정한다.\n- 정신 감염: 노출자는 특정 숫자, 노래, 문장, 검은 액체 이미지에 반응할 수 있다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "FCR Archive_890402",
      "origin": "괴이·우시노다교·귀환자 분류 문서",
      "cat": "CLASSIFICATION",
      "risk": "RESTRICTED",
      "summary": "괴이, 우시노다교, 귀환자/Returned Civilian의 교차 분류 체계.",
      "pages": [
        [
          "압축 분류",
          "STATUS: PARTIAL / ACCESS: RESTRICTED / DAMAGE: 36%. 관련 태그는 ENTITY, CULT, RETURNED CIVILIAN로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "복합 분류",
          "괴이, 종교 의식, 귀환자는 별도 항목처럼 보이지만 실제 사건에서는 서로 얽혀 나타난다."
        ],
        [
          "귀환자 판정",
          "Returned Civilian은 Safe, Watch, Restricted, Hostile, Unknown 등급으로 관리된다."
        ]
      ],
      "status": "PARTIAL",
      "access": "RESTRICTED",
      "damage": 36,
      "tags": [
        "ENTITY",
        "CULT",
        "RETURNED CIVILIAN"
      ],
      "related": [
        "Ferals_860722",
        "Cults_871104",
        "Redzone_881120",
        "Sakuma Tape_991028"
      ],
      "extended": "FCR Archive_890402는 괴이·우시노다교·귀환자 분류 문서에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 PARTIAL, 접근 권한은 RESTRICTED, 기록 손상도는 36%로 표시된다. 핵심 태그는 ENTITY, CULT, RETURNED CIVILIAN이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: PARTIAL / ACCESS: RESTRICTED / DAMAGE: 36%. 관련 태그는 ENTITY, CULT, RETURNED CIVILIAN로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 복합 분류: 괴이, 종교 의식, 귀환자는 별도 항목처럼 보이지만 실제 사건에서는 서로 얽혀 나타난다.\n- 귀환자 판정: Returned Civilian은 Safe, Watch, Restricted, Hostile, Unknown 등급으로 관리된다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    },
    {
      "code": "NHC Manual_891219",
      "origin": "N.H.C 현장 작전·장비·봉쇄 규정 문서",
      "cat": "FIELD MANUAL",
      "risk": "OPERATIONAL",
      "summary": "N.H.C 장비, 봉쇄 절차, 진입/철수 규정, 혈무·W-Coat 운용 기준.",
      "pages": [
        [
          "압축 분류",
          "STATUS: ACTIVE / ACCESS: OPERATIONAL / DAMAGE: 11%. 관련 태그는 FIELD MANUAL, N.H.C, ASH CREW로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다."
        ],
        [
          "현장 절차",
          "진입 전 오염도 확인, 민간인 분리, 봉쇄선 고정, 회수 루트 확보가 우선된다."
        ],
        [
          "장비 기준",
          "혈무, W-Coat, Null Coating, 방독 장비, 오염 검사 키트, 바디캠 로그가 표준 작전 장비에 포함된다."
        ]
      ],
      "status": "ACTIVE",
      "access": "OPERATIONAL",
      "damage": 11,
      "tags": [
        "FIELD MANUAL",
        "N.H.C",
        "ASH CREW"
      ],
      "related": [
        "Zone_870815",
        "Redzone_881120",
        "Faction_860403",
        "Unknown Record3_920711"
      ],
      "extended": "NHC Manual_891219는 N.H.C 현장 작전·장비·봉쇄 규정 문서에서 파생된 서버 열람용 확장 기록이다. 현재 상태는 ACTIVE, 접근 권한은 OPERATIONAL, 기록 손상도는 11%로 표시된다. 핵심 태그는 FIELD MANUAL, N.H.C, ASH CREW이며, 이 기록은 요약본을 먼저 보여준 뒤 필요한 경우 상세 블록을 펼쳐 읽는 구조로 정리되었다.\n\n[압축 페이지]\n- 압축 분류: STATUS: ACTIVE / ACCESS: OPERATIONAL / DAMAGE: 11%. 관련 태그는 FIELD MANUAL, N.H.C, ASH CREW로 묶이며, 이 기록은 U.A.C 정보 서버에서 긴 원문 대신 현장 열람용 요약 파일로 우선 표시된다.\n- 현장 절차: 진입 전 오염도 확인, 민간인 분리, 봉쇄선 고정, 회수 루트 확보가 우선된다.\n- 장비 기준: 혈무, W-Coat, Null Coating, 방독 장비, 오염 검사 키트, 바디캠 로그가 표준 작전 장비에 포함된다.\n\n[서버 해석]\n이 문서는 독립된 설정글이 아니라 세계 현황, 세력 관계, 구역 위험도, 회수 기록과 연결되는 노드로 취급된다. 관련 기록을 함께 열람하면 사건의 원인, 현장 대응, 오염 확산, 기록 손상 여부를 더 쉽게 추적할 수 있다."
    }
  ],
  "entities": [
    [
      "Feral",
      "하위 집단형 괴이. 빠른 확산, 단순 지휘 반응, 둥지 주변 배회."
    ],
    [
      "Queen-Type",
      "도시 단위 괴이 생태계의 생산·지휘 핵. 통신 교란과 기록 왜곡을 유발."
    ],
    [
      "Superior-Type",
      "고지능·고출력 정예 개체. Wivermensi와 직접 교전 가능."
    ],
    [
      "Artificial",
      "인공 장치, 주입 장치, 구속구가 확인되는 실험성 괴이."
    ],
    [
      "Hybrid",
      "인간성 잔존과 괴이화가 혼합된 중간 판정 개체."
    ],
    [
      "Returned Civilian",
      "실종 후 귀환한 민간인 또는 병력. 정상 복귀 여부가 불명확."
    ]
  ],
  "roles": [
    [
      "U.A.C",
      "판정/검열/서버 관리",
      "레드존 선포, 블랙존 폐쇄, 작전 승인, 기록 검열."
    ],
    [
      "N.H.C",
      "전투/봉쇄",
      "현장 진입, 민간인 대피, 페럴 제압, 봉쇄선 유지."
    ],
    [
      "S.I.D",
      "조사/심문",
      "의식 흔적, 실종, 귀환자 반응, Cold File 조사."
    ],
    [
      "A.R.F",
      "회수/복구",
      "시체, 장비, 샘플, 테이프, 바디캠, 오염 자료 회수."
    ],
    [
      "C.P.D",
      "민간 통제",
      "대피소, 검문, 격리, 귀환자 판정, 가족 통보."
    ],
    [
      "Ash Crew",
      "사후 회수",
      "작전 실패 지역의 오염 장비와 사망자 처리."
    ],
    [
      "Wivermensi",
      "특수 교전",
      "Superior-Type 대응, 혈무·Wave Frame 운용, 블랙존 제한 진입."
    ]
  ],
  "images": [
    "assets/resources/images/recovered_frame_001.webp",
    "assets/resources/images/recovered_frame_002.webp",
    "assets/resources/images/recovered_frame_003.webp",
    "assets/resources/images/recovered_frame_004.webp",
    "assets/resources/images/recovered_frame_005.webp",
    "assets/resources/images/recovered_frame_006.webp",
    "assets/resources/images/recovered_frame_007.webp",
    "assets/resources/images/recovered_frame_008.webp",
    "assets/resources/images/recovered_frame_009.webp",
    "assets/resources/images/recovered_frame_010.webp",
    "assets/resources/images/recovered_frame_011.webp",
    "assets/resources/images/recovered_frame_012.webp",
    "assets/resources/images/recovered_frame_013.webp",
    "assets/resources/images/recovered_frame_014.webp",
    "assets/resources/images/recovered_frame_015.webp",
    "assets/resources/images/recovered_frame_016.webp",
    "assets/resources/images/recovered_frame_017.webp",
    "assets/resources/images/recovered_frame_018.webp",
    "assets/resources/images/recovered_frame_019.webp",
    "assets/resources/images/recovered_frame_020.webp",
    "assets/resources/images/recovered_frame_021.webp",
    "assets/resources/images/recovered_frame_022.webp",
    "assets/resources/images/recovered_frame_023.webp",
    "assets/resources/images/recovered_frame_024.webp",
    "assets/resources/images/recovered_frame_025.webp",
    "assets/resources/images/recovered_frame_026.webp",
    "assets/resources/images/recovered_frame_027.webp",
    "assets/resources/images/recovered_frame_028.webp",
    "assets/resources/images/recovered_frame_029.webp",
    "assets/resources/images/recovered_frame_030.webp",
    "assets/resources/images/recovered_frame_031.webp",
    "assets/resources/images/recovered_frame_032.webp",
    "assets/resources/images/recovered_frame_033.webp",
    "assets/resources/images/recovered_frame_034.webp",
    "assets/resources/images/recovered_frame_035.webp",
    "assets/resources/images/recovered_frame_036.webp",
    "assets/resources/images/recovered_frame_037.webp",
    "assets/resources/images/recovered_frame_038.webp",
    "assets/resources/images/recovered_frame_039.webp",
    "assets/resources/images/recovered_frame_040.webp",
    "assets/resources/images/recovered_frame_041.webp",
    "assets/resources/images/recovered_frame_042.webp",
    "assets/resources/images/recovered_frame_043.webp",
    "assets/resources/images/recovered_frame_044.webp",
    "assets/resources/images/recovered_frame_045.webp",
    "assets/resources/images/recovered_frame_046.webp",
    "assets/resources/images/recovered_frame_047.webp",
    "assets/resources/images/recovered_frame_048.webp",
    "assets/resources/images/recovered_frame_049.webp",
    "assets/resources/images/recovered_frame_050.webp",
    "assets/resources/images/recovered_frame_051.webp",
    "assets/resources/images/recovered_frame_052.webp",
    "assets/resources/images/recovered_frame_053.webp",
    "assets/resources/images/recovered_frame_054.webp",
    "assets/resources/images/recovered_frame_055.webp",
    "assets/resources/images/recovered_frame_056.webp",
    "assets/resources/images/recovered_frame_057.webp",
    "assets/resources/images/recovered_frame_058.webp",
    "assets/resources/images/recovered_frame_059.webp",
    "assets/resources/images/recovered_frame_060.webp",
    "assets/resources/images/recovered_frame_061.webp",
    "assets/resources/images/recovered_frame_062.webp",
    "assets/resources/images/recovered_frame_063.webp",
    "assets/resources/images/recovered_frame_064.webp",
    "assets/resources/images/recovered_frame_065.webp",
    "assets/resources/images/recovered_frame_066.webp",
    "assets/resources/images/recovered_frame_067.webp",
    "assets/resources/images/recovered_frame_068.webp",
    "assets/resources/images/recovered_frame_069.webp",
    "assets/resources/images/recovered_frame_070.webp",
    "assets/resources/images/recovered_frame_071.webp",
    "assets/resources/images/recovered_frame_072.webp",
    "assets/resources/images/recovered_frame_073.webp",
    "assets/resources/images/recovered_frame_074.webp",
    "assets/resources/images/recovered_frame_075.webp",
    "assets/resources/images/recovered_frame_076.webp",
    "assets/resources/images/recovered_frame_077.webp",
    "assets/resources/images/recovered_frame_078.webp",
    "assets/resources/images/recovered_frame_079.webp",
    "assets/resources/images/recovered_frame_080.webp",
    "assets/resources/images/recovered_frame_081.webp",
    "assets/resources/images/recovered_frame_082.webp",
    "assets/resources/images/recovered_frame_083.webp"
  ],
  "zones": [
    [
      "GREEN ZONE",
      "안정 민간 구역",
      "민간 거주와 공급망이 유지되는 구역. 완전 무감시가 아니라 U.A.C 관측망 아래의 저위험 보호권역이다.",
      "LOW",
      "green"
    ],
    [
      "WHITE ZONE",
      "정화/통제 구역",
      "피난민 수용, 감염 검사, 귀환자 선별, 기록 검열이 시행되는 안전권역. 안전하지만 행정·군사 통제가 강하다.",
      "SCREENING",
      "white"
    ],
    [
      "YELLOW ZONE",
      "감시/완충 구역",
      "레드존 주변 봉쇄선과 겹치는 경계권역. 검문 강화, 간헐적 이상현상, N.H.C/C.P.D 활동이 많다.",
      "MONITORED",
      "yellow"
    ],
    [
      "RED ZONE",
      "활성 재난 구역",
      "괴이 생태계, 오염, 통신 교란, 군사 봉쇄가 동시에 발생하는 적대 구역. 회수·정찰·전투 작전만 허가된다.",
      "ACTIVE HOSTILE",
      "red"
    ],
    [
      "BLACK ZONE",
      "회수 금지 심층 구역",
      "진입 자체가 금기시되는 심층 재난 구역. 지도 정보가 불완전하고 통신이 붕괴되며 회수 작전 실패율이 극단적으로 높다.",
      "NO RECOVERY",
      "black"
    ],
    [
      "GRAY ZONE",
      "통제 붕괴/애매한 구역",
      "정부 통제와 민간 질서가 동시에 약화된 구역. 밀수, Redwolf 잔당, 피난민 정착지, 비공식 시장이 나타난다.",
      "FRAGMENTED",
      "gray"
    ],
    [
      "BLUE NODE",
      "연구/회수 지원 구역",
      "U.A.C 연구기지, A.R.F 회수 허브, 의료 재조립 센터, 데이터 보존소 같은 특수 시설 마커.",
      "SUPPORT",
      "blue"
    ],
    [
      "CRIMSON CORE",
      "레드존 심장부",
      "Queen-Type 둥지, 피의 호수 중심부, 불멸 실험 기원지처럼 저주 방출이 집중되는 핵심 지점.",
      "PRIMARY EMISSION",
      "crimson"
    ],
    [
      "BLACK CORE",
      "정보 붕괴 중심부",
      "관측, 기록, 통신, 기억이 동시에 붕괴되는 블랙존 중심부. 서버 지도에는 추정 좌표만 표시된다.",
      "TOTAL COLLAPSE",
      "blackcore"
    ]
  ],
  "mapStats": [
    [
      "GREEN CIVIL REGIONS",
      "68"
    ],
    [
      "WHITE CONTROL DISTRICTS",
      "42"
    ],
    [
      "YELLOW CONTAINMENT BELTS",
      "19"
    ],
    [
      "RED ZONE REGIONS",
      "37"
    ],
    [
      "BLACK ZONE REGIONS",
      "05"
    ],
    [
      "CRIMSON / BLACK CORES",
      "08"
    ],
    [
      "CONTAINMENT WALLS",
      "112"
    ],
    [
      "ACTIVE RECOVERY OPS",
      "12"
    ],
    [
      "SIGNAL DEAD AREAS",
      "09"
    ]
  ],
  "mapLayers": [
    [
      "ZONE OVERLAY",
      "Green / White / Yellow / Red / Black / Gray 구역색을 지도 위에 표시한다."
    ],
    [
      "CONTAINMENT WALLS",
      "WALL-03, LINE-K12 같은 봉쇄선과 격리 벨트를 점선으로 표시한다."
    ],
    [
      "RECOVERY ROUTES",
      "A.R.F 회수 루트와 피난민 철수로를 얇은 선으로 표시한다."
    ],
    [
      "SIGNAL LOSS",
      "블랙존 주변 통신 두절, 기록 왜곡, 영상 손실 지역을 노이즈 패턴으로 표시한다."
    ],
    [
      "INCIDENT MARKERS",
      "Blood Lake, Black Wall Collapse, Sakuma Incident, Amarion Recovery 같은 사건 지점을 연결한다."
    ],
    [
      "FACILITY NODES",
      "U.A.C, N.H.C, A.R.F, C.P.D, Ash Crew의 전초기지와 데이터 노드를 표시한다."
    ]
  ],
  "incidents": [
    [
      "BLOOD LAKE",
      "1986",
      "Crimson Core / Origin Incident",
      "피의 호수와 불멸 연구 실패의 원점."
    ],
    [
      "BLACK WALL COLLAPSE",
      "1990s",
      "Black Zone Expansion",
      "블랙월 붕괴 이후 봉쇄선과 관측 기준이 재정의됨."
    ],
    [
      "SAKUMA INCIDENT",
      "1999",
      "Missing Person / Cold File",
      "실종 사건과 기록 왜곡이 동시에 발생한 Cold File."
    ],
    [
      "AMARION RECOVERY",
      "1986",
      "Bio-Research / Recovery",
      "아마리온 관련 회수 영상과 생체복원 연구 흔적."
    ],
    [
      "REDWOLF DEFECTION",
      "1992",
      "Defection / Equipment Leak",
      "N.H.C 작전 지식과 장비가 외부로 유출된 사건."
    ]
  ],
  "facilities": [
    [
      "U.A.C NODE-07",
      "KOR-EAST",
      "Secure information server / archive relay node"
    ],
    [
      "N.H.C BASE K-12",
      "East Asia Border",
      "Red/Yellow border entry and blockade base"
    ],
    [
      "A.R.F RECOVERY HUB",
      "Mobile Route",
      "Survivor/sample/recovered frame processing hub"
    ],
    [
      "C.P.D SCREENING SECTOR",
      "White Zone",
      "Returned Civilian inspection and evacuation control"
    ],
    [
      "ASH CREW DISPOSAL LINE",
      "Red Zone Edge",
      "Contaminated corpse/gear/blood weapon recovery route"
    ]
  ],
  "recordCategories": [
    [
      "WORLD STATUS",
      "세계 현황, 타임라인, 구역 위험도, 레드존 오염 기준을 묶는 첫 진입 화면.",
      "Timeline_860101 / Zone_870815 / Redzone_881120"
    ],
    [
      "FACTION DATABASE",
      "U.A.C, N.H.C, S.I.D, F.H.C, Redwolf, 우시노다교, Blood Cult 관계를 압축 표시.",
      "Faction_860403 / Cults_871104 / Unknown Record3_920711"
    ],
    [
      "ENTITY INDEX",
      "Feral, Queen-Type, Superior-Type, Returned Civilian, Artificial, Hybrid 분류.",
      "Ferals_860722 / FCR Archive_890402"
    ],
    [
      "WEAPON / RESEARCH FILES",
      "혈무, Wave Frame, W-Coat, 유전자 기록, 생체 병기, 금지 기술.",
      "Unknown Record4_930314 / Unknown Record5_940626"
    ],
    [
      "ARCHIVE RECORDS",
      "실종, 회수, 부검, 기원 기록 같은 사건성 문서 보관소.",
      "Sakuma Tape_991028 / Unknown Record1_860204 / Unknown Record2_860205"
    ],
    [
      "FIELD MANUALS",
      "N.H.C 현장 규정, 봉쇄 절차, 회수 프로토콜, Ash Crew 처리 절차.",
      "NHC Manual_891219"
    ],
    [
      "RECOVERED FRAMES",
      "회수 이미지 자료실. 오디오 로그는 제거하고 이미지 증거만 압축 보관.",
      "83 image frames"
    ],
    [
      "BLACK FILES",
      "손상도와 위험도가 높은 열람 제한 기록. 원문은 서버 전문보기로 분리.",
      "Immortality_860201 / Unknown Record2_860205 / Cults_871104"
    ]
  ],
  "researchFiles": [
    [
      "Wivermensi",
      "강화 요원",
      "저주성 힘, Wave Frame, W-Coat, 혈무를 운용하는 인간형 특수 병기."
    ],
    [
      "Blood Weapon / 혈무",
      "대괴이 무장",
      "금속 검체가 혈액 접촉 시 붉게 반응하는 대괴이 근접 무기 체계."
    ],
    [
      "Wave Frame / 파동기",
      "강화 기술",
      "신체 강화, 장벽 파쇄, 혈무 동기화, 저주장 침투에 쓰이는 압력/파동 운용법."
    ],
    [
      "W-Coat / W-Fiber",
      "방호 장비",
      "오염 방지, 기동 보조, 파동 안정화, 레드존 장시간 생존을 위한 특수 소재."
    ],
    [
      "Genetic Records",
      "금지 연구",
      "괴이 유전자 디지털화, 생체 프린팅, 강제 진화, 인공 괴이 설계."
    ],
    [
      "Bio-Weapons",
      "비인간 병기",
      "명령 의존성, 법적 비인격화, 통제 실패 시 페럴화 위험을 가진 양산형 생체 병기."
    ]
  ],
  "fieldManuals": [
    [
      "ENTRY PROTOCOL",
      "레드존 진입 전 장비 동기화, 귀환자 반응 검사, 혈액 샘플 봉인 절차를 완료한다."
    ],
    [
      "BLOCKADE RULES",
      "Yellow/Red 경계선은 C.P.D 검문과 N.H.C 무장 봉쇄를 동시에 유지한다."
    ],
    [
      "RECOVERY PROTOCOL",
      "생존자보다 기록 매체가 위험할 수 있으므로 테이프, 바디캠, 혈액 묻은 장비는 A.R.F 봉인 규격으로 운반한다."
    ],
    [
      "ASH CREW PROCEDURE",
      "작전 종료 후 오염 시체, 파손 혈무, 장비 잔해, 미확인 조직은 Ash Crew가 별도 회수한다."
    ],
    [
      "BLACK ZONE RULE",
      "Black Zone과 Black Core 진입은 원칙적으로 금지. 승인 없는 회수 작전은 서버에서 자동 기각된다."
    ]
  ],
  "blackFiles": [
    [
      "Immortality_860201",
      "OMEGA",
      "불멸 연구와 U.A.C 설립의 기원. 손상도 82%."
    ],
    [
      "Unknown Record2_860205",
      "BLACK",
      "피의 호수 부검 기록. 기억성 오염 및 비정상 혈액 반응 포함."
    ],
    [
      "Cults_871104",
      "TOP SECRET",
      "F.H.C, 우시노다교, Blood Cult의 비인가 연구/의식 교차 기록."
    ],
    [
      "Unknown Record5_940626",
      "COMMAND ONLY",
      "괴이 유전자 기록, 강제 진화, 인공 설계 흔적."
    ],
    [
      "Ferals_860722",
      "BLACK",
      "Queen-Type, Superior-Type, Artificial/Hybrid 분류 기준."
    ]
  ],
  "frameCategories": [
    [
      "FIELD PHOTOS",
      "N.H.C/Young Soldier 현장 사진, 작전 중 회수된 저화질 프레임."
    ],
    [
      "RED ZONE INTERIOR",
      "복도, 지하 시설, 병원, 연구실, 봉쇄선 내부 이미지."
    ],
    [
      "ENTITY EVIDENCE",
      "괴이, 타락 개체, 오염 조직, 비정상 실루엣 자료."
    ],
    [
      "CIVILIAN RECOVERY",
      "귀환자, 생존자, 대피소, C.P.D 선별 관련 시각 자료."
    ],
    [
      "UNKNOWN FRAMES",
      "출처가 불명확하거나 기록 손상이 심한 프레임."
    ]
  ],
  "startHere": [
    [
      "01",
      "PROJECT CURSE",
      "오컬트 군사 재난 이후 U.A.C 정보 서버에 남은 세력, 구역, 괴이, 회수 기록을 열람하는 아카이브다. 처음에는 WORLD STATUS와 ZONE SYSTEM을 먼저 보면 전체 규모를 이해하기 쉽다."
    ],
    [
      "02",
      "CURRENT YEAR: 2026",
      "2026년 기준으로 중국, 러시아, 북미 일부는 Red Zone으로 표시되고, 일부 심부는 Black Core / Crimson Core로 제한된다. 안전권역도 완전한 평화가 아니라 감시와 검문이 유지되는 통제 사회다."
    ],
    [
      "03",
      "READING RULE",
      "긴 원문을 바로 펼치지 않고 요약 카드, 위험도, 태그, 관련 문서, 확장 기록 순서로 읽도록 설계했다. 기록물은 서로 연결된 조사 노드로 취급한다."
    ],
    [
      "04",
      "SOUND POLICY",
      "지속 배경음은 넣지 않는다. 분위기는 화면 연출과 짧은 부트음, 파일 클릭, 페이지 넘김 효과음만으로 유지한다."
    ],
    [
      "05",
      "FIRST FILES",
      "처음 열람할 추천 기록은 Timeline_860101, Zone_870815, Faction_860403, Ferals_860722, NHC Manual_891219 순서다. 이후 사건 기록과 Black Files로 넘어간다."
    ]
  ],
  "recommendedOrder": [
    [
      "01",
      "START HERE",
      "세계관과 사이트 열람법을 먼저 확인한다.",
      "start"
    ],
    [
      "02",
      "WORLD STATUS",
      "2026년 현재 상황과 서버 전체 요약을 확인한다.",
      "overview"
    ],
    [
      "03",
      "ZONE SYSTEM",
      "Green / White / Yellow / Red / Black 존 체계를 확인한다.",
      "zones"
    ],
    [
      "04",
      "GLOBAL MAP",
      "중국, 러시아, 북미 일부 Red Zone과 사건 마커를 확인한다.",
      "map"
    ],
    [
      "05",
      "FACTION DATABASE",
      "U.A.C, N.H.C, S.I.D, F.H.C, Redwolf, cult 네트워크를 확인한다.",
      "factions"
    ],
    [
      "06",
      "RELATION MATRIX",
      "세력간 협력, 불신, 감시, 적대 구조를 확인한다.",
      "relations"
    ],
    [
      "07",
      "ENTITY INDEX",
      "Feral, Queen-Type, Superior-Type, Returned Civilian 분류를 확인한다.",
      "entities"
    ],
    [
      "08",
      "ARCHIVE RECORDS",
      "실종, 회수, 부검, 이탈, 기원 기록을 코드명으로 열람한다.",
      "records"
    ],
    [
      "09",
      "BLACK FILES",
      "손상도와 접근 제한이 높은 기록을 마지막에 확인한다.",
      "blackfiles"
    ]
  ],
  "glossary": [
    [
      "U.A.C",
      "Urban Anomaly Containment. 도시 이상현상 격리, 서버 기록 검열, 구역 판정 권한을 가진 중앙 통제 기관."
    ],
    [
      "N.H.C",
      "National Hazard Control. 레드존 진입, 봉쇄선 유지, 괴이 제압, 현장 작전을 담당하는 전투 조직."
    ],
    [
      "S.I.D",
      "Special Investigation Department. 실종, 오컬트 사건, 우시노다교, Cold File을 추적하는 특수수사 부서."
    ],
    [
      "A.R.F",
      "Anomaly Recovery Force. 생존자, 시체, 오염 장비, 바디캠, 테이프, 샘플을 회수하는 부서."
    ],
    [
      "C.P.D",
      "Civilian Protection Division. 피난민 대피, 검문소 운영, 귀환자 선별, 민간인 격리를 담당."
    ],
    [
      "Ash Crew",
      "작전 종료 후 사망자, 오염 장비, 파손 혈무, 미확인 조직을 회수하는 후처리 부대."
    ],
    [
      "Wivermensi",
      "저주성 힘, Wave Frame, W-Coat, 혈무를 운용하는 인간형 특수 요원/병기 체계."
    ],
    [
      "Blood Weapon / 혈무",
      "혈액 접촉 시 붉게 반응하는 대괴이 근접 무장. Wivermensi와 일부 현장 요원이 운용한다."
    ],
    [
      "Wave Frame / 파동기",
      "신체 강화, 장벽 파쇄, 저주장 침투, 혈무 동기화에 쓰이는 파동/압력 운용 기술."
    ],
    [
      "Returned Civilian",
      "레드존 또는 블랙존에서 귀환했으나 기억 오류, 오염 반응, 의식성 흔적을 보이는 민간인 분류."
    ],
    [
      "Green Zone",
      "상대적으로 안정된 민간 거주권역. 공개적으로 안전해 보이지만 감시망은 유지된다."
    ],
    [
      "White Zone",
      "정화·검문·피난민 관리가 이루어지는 강한 행정 통제 구역."
    ],
    [
      "Yellow Zone",
      "레드존 주변의 감시/완충 구역. 검문과 출입 제한이 강화된다."
    ],
    [
      "Red Zone",
      "괴이 활동과 오염이 만성화된 활성 재난 구역. 작전과 회수 중심으로 접근한다."
    ],
    [
      "Black Zone",
      "진입과 회수가 원칙적으로 금지되는 심층 재난 구역. 통신, 지도, 기억 기록이 불안정하다."
    ],
    [
      "Crimson Core",
      "레드존 내부의 주요 저주 방출점 또는 Queen-Type 둥지 후보 지점."
    ],
    [
      "Black Core",
      "정보 붕괴와 신호 무효화가 발생하는 블랙존 중심부."
    ]
  ],
  "serverLogs": [
    [
      "2026-06-21 02:17",
      "AUTH GATE",
      "Unauthenticated query blocked. Password phrase required."
    ],
    [
      "2026-06-21 02:19",
      "ARCHIVE INDEX",
      "Recovered document categories rebuilt: WORLD / FACTION / ENTITY / RECORD / BLACK FILE."
    ],
    [
      "2026-06-21 02:23",
      "ZONE MAP",
      "China, Russia, and fragmented North America Red Zone overlays confirmed."
    ],
    [
      "2026-06-21 02:31",
      "AUDIO POLICY",
      "Continuous static ambience removed. Short SFX only."
    ],
    [
      "2026-06-21 02:37",
      "BLACK FILE",
      "OMEGA-class records remain summarized. Full recovery uncertain."
    ],
    [
      "2026-06-21 02:42",
      "GLOSSARY",
      "Terminology node added to reduce field-reader confusion."
    ],
    [
      "2026-06-21 02:48",
      "CASE CHAIN",
      "Blood Lake origin chain linked to U.A.C foundation and Red Zone expansion."
    ]
  ],
  "caseChain": [
    [
      "BLOOD LAKE INCIDENT",
      "Unknown Record2_860205",
      "비정상 혈액 반응과 불멸 연구 실패의 원점으로 기록된다."
    ],
    [
      "TOWARDS IMMORTALITY",
      "Immortality_860201",
      "불멸을 향한 작전과 연구가 U.A.C 설립의 명분으로 전환된다."
    ],
    [
      "U.A.C FOUNDATION",
      "Faction_860403",
      "통제권, 검열권, 구역 판정권이 중앙 서버 체계로 정리된다."
    ],
    [
      "FIRST RED ZONE EXPANSION",
      "Timeline_860101",
      "격리 실패와 지역 붕괴가 Red Zone 체계를 고정시킨다."
    ],
    [
      "ENTITY CLASSIFICATION",
      "Ferals_860722",
      "Feral, Superior-Type, Queen-Type 분류가 전장 대응 기준이 된다."
    ],
    [
      "SAKUMA DISAPPEARANCE",
      "Sakuma Tape_991028",
      "실종 기록과 귀환자 판정 문제가 Cold File로 재분류된다."
    ],
    [
      "REDWOLF DEFECTION",
      "Unknown Record3_920711",
      "정규 현장 병력 이탈과 장비 유출이 세력 관계를 흔든다."
    ],
    [
      "BLACK WALL COLLAPSE",
      "Redzone_881120",
      "블랙존 심부와 통신 두절 구역이 확대되며 회수 금지 규정이 강화된다."
    ]
  ],
  "clearanceLevels": [
    [
      "LEVEL 0",
      "PUBLIC MASKED DATA",
      "일반 발표 자료. 자연재해나 산업 사고로 위장된 정보."
    ],
    [
      "LEVEL 1",
      "CIVIL RESPONSE",
      "C.P.D 대피소, 피난민 안내, 공개 가능한 민간 통제 정보."
    ],
    [
      "LEVEL 2",
      "FIELD OPERATION",
      "N.H.C 작전 배치, 봉쇄선, 진입/철수 루트."
    ],
    [
      "LEVEL 3",
      "CONTAINMENT STAFF",
      "U.A.C 내부 분석, 샘플 회수, 오염 판정 문서."
    ],
    [
      "LEVEL 4",
      "U.A.C INTERNAL",
      "세력 관계, 연구 협력, 검열된 현장 보고."
    ],
    [
      "LEVEL 5",
      "BLACK FILE ACCESS",
      "피의 호수, 불멸 연구, Queen-Type 관련 손상 기록."
    ],
    [
      "LEVEL 6",
      "COMMAND ONLY",
      "대형 작전 승인, 블랙존 폐쇄, 비인가 실험 은폐 문서."
    ],
    [
      "LEVEL 7",
      "NULL AUTHORITY",
      "서버가 존재 여부를 부정하는 기록. 원문 열람 불가."
    ]
  ],
  "incidentClasses": [
    [
      "CLASS C",
      "LOCAL ANOMALY",
      "지역 단위 이상현상. 민간 피해 제한적."
    ],
    [
      "CLASS B",
      "MULTIPLE CASUALTY",
      "복수 사상자 또는 기억/기록 손상 동반."
    ],
    [
      "CLASS A",
      "RED ZONE RISK",
      "오염 확산 또는 봉쇄선 붕괴 위험."
    ],
    [
      "CLASS S",
      "MASS COLLAPSE",
      "Queen-Type, 대규모 페럴화, 도시 기능 붕괴."
    ],
    [
      "CLASS BLACK",
      "NO RECOVERY",
      "진입 금지. 회수 작전은 지휘권자 승인 없이 자동 기각."
    ]
  ],
  "civilianSystems": [
    [
      "WHITE ZONE SHELTER DISTRICT",
      "피난민 임시 수용 구역. 귀환자 판정, 오염 검사, 신원 재등록, 야간 통행 제한이 적용된다."
    ],
    [
      "RETURNED CIVILIAN SCREENING",
      "기억 오류, 감각 왜곡, 혈액 반응, 의식성 언어 사용 여부를 확인하는 C.P.D 선별 절차."
    ],
    [
      "INFORMATION QUARANTINE",
      "공개 정보와 실제 서버 기록을 분리하는 검열 체계. 일반 시민에게는 자연재해/테러/산업 사고로 위장될 수 있다."
    ],
    [
      "UNREGISTERED SETTLEMENT",
      "그레이존 또는 블랙존 주변에 형성된 비공식 생존자 거주지. 구조 대상이자 오염 위험지로 취급된다."
    ]
  ],
  "allTags": [
    "FACTION",
    "U.A.C",
    "N.H.C",
    "S.I.D",
    "DATABASE",
    "VERIFIED",
    "INTERNAL",
    "RESTRICTED",
    "PERSONNEL",
    "YOUNG SOLDIER",
    "WIVERMENSI",
    "PARTIAL",
    "CLASSIFIED",
    "ENTITY",
    "FERAL",
    "QUEEN-TYPE",
    "SUPERIOR-TYPE",
    "CORRUPTED",
    "BLACK FILE",
    "BLACK",
    "F.H.C",
    "USHINODA CULT",
    "BLOOD CULT",
    "SEALED",
    "COMMAND ONLY",
    "TOP SECRET",
    "MISSING",
    "COLD FILE",
    "RECOVERY",
    "AMARION",
    "BIO-RESEARCH",
    "AUTOPSY",
    "BLOOD LAKE",
    "ORIGIN",
    "REDWOLF",
    "DEFECTION",
    "SYNDICATE",
    "WEAPON",
    "BLOOD WEAPON",
    "CURSE-ARMAMENT",
    "REDACTED",
    "IMMORTALITY",
    "OMEGA",
    "ZONE SYSTEM",
    "REDZONE",
    "BLACKZONE",
    "ZONE",
    "ACTIVE",
    "GENETIC",
    "BIO-WEAPON",
    "ARTIFICIAL",
    "TIMELINE",
    "WAR",
    "COLLAPSE",
    "ARCHIVE",
    "CONTAMINATION",
    "RETURNED CIVILIAN",
    "CULT",
    "CLASSIFICATION",
    "FIELD MANUAL",
    "ASH CREW",
    "OPERATIONAL"
  ]
};
