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
      ]
    },
    {
      "code": "Personnel_890617",
      "origin": "인물 프로필 기록",
      "cat": "PERSONNEL",
      "risk": "CLASSIFIED",
      "summary": "요원, 생존자, 귀환자, Young Soldier, Wivermensi의 상태와 사건 연계 기록.",
      "pages": [
        [
          "인물 판정",
          "인물 기록은 생존/사망/실종/귀환자/격리 대상으로 나뉜다. 신체 상태보다 기억 오류와 의식 반응이 더 중요한 판정 근거가 된다."
        ],
        [
          "현장 인력",
          "Young Soldier는 정규 Wivermensi와 구분되며, 장비와 훈련이 부족한 상태로 고위험 작전에 투입되는 경우가 많다."
        ]
      ]
    },
    {
      "code": "Ferals_860722",
      "origin": "타락 개체 분류 보고서",
      "cat": "ENTITY",
      "risk": "BLACK",
      "summary": "Feral, Queen-Type, Superior-Type, Artificial, Hybrid 등 괴이 생태계 분류.",
      "pages": [
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
      ]
    },
    {
      "code": "Cults_871104",
      "origin": "F.H.C 극비 보안 문서",
      "cat": "BLACK FILE",
      "risk": "TOP SECRET",
      "summary": "F.H.C, 우시노다교, Blood Cult, 비인가 실험과 기밀 보안 체계.",
      "pages": [
        [
          "기밀 연구",
          "F.H.C는 괴이 유전자, 생체 병기, 강제 진화, 인공 조직 복원 기술을 연구한다. 공식 기록과 실험 로그가 서로 다를 수 있다."
        ],
        [
          "의식성 위협",
          "우시노다교와 Blood Cult는 피, 축복, 불멸, 귀환자 신성화 언어를 통해 변이와 괴이 발생을 의식화한다."
        ]
      ]
    },
    {
      "code": "Sakuma Tape_991028",
      "origin": "사쿠마 유타 실종 사건 보고서",
      "cat": "MISSING",
      "risk": "RESTRICTED",
      "summary": "실종 기록, 최종 목격, 복구된 테이프, 귀환자 판정 가능성.",
      "pages": [
        [
          "실종 기록",
          "사쿠마 유타의 실종은 단순 사건이 아니라 Cold File 재활성화와 유사한 기록 왜곡 흔적을 남긴다."
        ],
        [
          "회수 매체",
          "테이프와 영상 로그는 끊김, 반복 프레임, 시간 불일치가 발견되며 원본성 검증이 필요하다."
        ]
      ]
    },
    {
      "code": "Unknown Record1_860204",
      "origin": "아마리온 회수 영상 기록",
      "cat": "RECOVERY",
      "risk": "CLASSIFIED",
      "summary": "아마리온 관련 회수 영상, 생체 복원, 기업 연구 흔적.",
      "pages": [
        [
          "회수 영상",
          "아마리온 회수 기록은 의료 기업 문서처럼 보이지만, 생명 연장·세포 재구성·괴이 유래 물질 연구 흔적을 포함한다."
        ],
        [
          "기업 연결",
          "공식 제약 연구와 비인가 생체 병기 연구의 경계가 흐려진다."
        ]
      ]
    },
    {
      "code": "Unknown Record2_860205",
      "origin": "피의 호수 부검 기록",
      "cat": "AUTOPSY",
      "risk": "BLACK",
      "summary": "피의 호수, 부검 소견, 비정상 조직, 불멸 연구 실패의 원점.",
      "pages": [
        [
          "부검 소견",
          "피의 호수 기록은 정상 의학 문서로 처리할 수 없는 조직 변성, 혈액 반응, 기억성 오염을 동반한다."
        ],
        [
          "기원 사건",
          "1986년 불멸 연구 실패 이후 U.A.C 설립과 괴이 유전자 보존 프로젝트가 시작된다."
        ]
      ]
    },
    {
      "code": "Unknown Record3_920711",
      "origin": "레드울프 이탈 기록",
      "cat": "DEFECTION",
      "risk": "RESTRICTED",
      "summary": "Redwolf 이탈, 탈취 장비, 신디케이트 연계, 추적 대상 기록.",
      "pages": [
        [
          "이탈 경위",
          "Redwolf는 정규 명령 체계에서 벗어난 전투 집단이며 일부 특수 장비와 레드존 작전 지식을 보유한다."
        ],
        [
          "위험성",
          "이들의 존재는 N.H.C 교리 실패와 내부 신뢰 붕괴를 증명한다."
        ]
      ]
    },
    {
      "code": "Unknown Record4_930314",
      "origin": "축복으로 위장된 병기",
      "cat": "WEAPON",
      "risk": "CLASSIFIED",
      "summary": "축복·구원 언어로 위장된 저주성 병기와 의식 장비.",
      "pages": [
        [
          "위장 병기",
          "일부 병기는 종교적 축복, 치료, 구원의 형태로 포장되지만 실제로는 저주성 변이와 동기화 장치로 작동한다."
        ],
        [
          "식별법",
          "반복 문장, 혈액 반응, 귀환자 공명, 기도문 형태의 조작 명령을 확인해야 한다."
        ]
      ]
    },
    {
      "code": "Immortality_860201",
      "origin": "불멸을 향해",
      "cat": "ORIGIN",
      "risk": "OMEGA",
      "summary": "불멸 연구, 피의 호수 작전, U.A.C 설립으로 이어지는 기원 기록.",
      "pages": [
        [
          "불멸 연구",
          "불멸 프로젝트는 생명 연장 연구가 아니라 인간·괴이·저주성 조직의 경계를 붕괴시키는 실패한 실험으로 남았다."
        ],
        [
          "후속 영향",
          "이 사건 이후 도시형 이상현상을 격리하기 위한 U.A.C 체계가 만들어졌다."
        ]
      ]
    },
    {
      "code": "Zone_870815",
      "origin": "구역 위험도 분류 문서",
      "cat": "ZONE",
      "risk": "ACTIVE",
      "summary": "Yellow Zone, Red Zone, Black Zone, 격리선과 진입 권한 기준.",
      "pages": [
        [
          "구역 단계",
          "Yellow Zone은 초기 이상 징후, Red Zone은 군사 봉쇄, Black Zone은 현실 통제 상실 상태를 의미한다."
        ],
        [
          "진입 권한",
          "Red Zone은 N.H.C 승인 작전, Black Zone은 상위 Wivermensi 또는 특수 회수 명령 없이는 진입 금지다."
        ]
      ]
    },
    {
      "code": "Unknown Record5_940626",
      "origin": "새로운 세계를 위한 유전자 기록",
      "cat": "GENETIC",
      "risk": "TOP SECRET",
      "summary": "괴이 유전자 디지털화, 생체 프린팅, 강제 진화, 인공 괴이 설계.",
      "pages": [
        [
          "유전자 기록",
          "괴이 생체 정보는 분석·보존·복제 가능한 데이터로 전환되며, 인공 조직 제작과 생체 병기 설계에 쓰인다."
        ],
        [
          "위험성",
          "실험 실패는 단순 탈주가 아니라 연구 시설 자체의 레드존화로 이어질 수 있다."
        ]
      ]
    },
    {
      "code": "Timeline_860101",
      "origin": "Project Curse 연표 기록",
      "cat": "TIMELINE",
      "risk": "ARCHIVE",
      "summary": "1986 기원 사건부터 First Red Zone War, Black Wall Collapse, 2026 현황까지.",
      "pages": [
        [
          "주요 연표",
          "1986 피의 호수, First Red Zone War, Black Wall Collapse, Cold File Reactivation, Queen-Type Emergence가 핵심 분기점이다."
        ],
        [
          "2026 상태",
          "현재 U.A.C 정보 서버는 레드존 확산과 블랙존 관측 오류를 지속 갱신 중이다."
        ]
      ]
    },
    {
      "code": "Redzone_881120",
      "origin": "레드존 이상현상 및 오염 기준 문서",
      "cat": "CONTAMINATION",
      "risk": "ACTIVE",
      "summary": "오염 단계, 정신 감염, 기록 오류, 현장 검사 기준.",
      "pages": [
        [
          "오염 기준",
          "레드존 오염은 신체 반응뿐 아니라 기억 오류, 반복 언어, 감각 왜곡, 영상 기록 불일치로 판정한다."
        ],
        [
          "정신 감염",
          "노출자는 특정 숫자, 노래, 문장, 검은 액체 이미지에 반응할 수 있다."
        ]
      ]
    },
    {
      "code": "FCR Archive_890402",
      "origin": "괴이·우시노다교·귀환자 분류 문서",
      "cat": "CLASSIFICATION",
      "risk": "RESTRICTED",
      "summary": "괴이, 우시노다교, 귀환자/Returned Civilian의 교차 분류 체계.",
      "pages": [
        [
          "복합 분류",
          "괴이, 종교 의식, 귀환자는 별도 항목처럼 보이지만 실제 사건에서는 서로 얽혀 나타난다."
        ],
        [
          "귀환자 판정",
          "Returned Civilian은 Safe, Watch, Restricted, Hostile, Unknown 등급으로 관리된다."
        ]
      ]
    },
    {
      "code": "NHC Manual_891219",
      "origin": "N.H.C 현장 작전·장비·봉쇄 규정 문서",
      "cat": "FIELD MANUAL",
      "risk": "OPERATIONAL",
      "summary": "N.H.C 장비, 봉쇄 절차, 진입/철수 규정, 혈무·W-Coat 운용 기준.",
      "pages": [
        [
          "현장 절차",
          "진입 전 오염도 확인, 민간인 분리, 봉쇄선 고정, 회수 루트 확보가 우선된다."
        ],
        [
          "장비 기준",
          "혈무, W-Coat, Null Coating, 방독 장비, 오염 검사 키트, 바디캠 로그가 표준 작전 장비에 포함된다."
        ]
      ]
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
  ]
};