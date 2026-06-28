/* Project Curse / U.A.C Regional Map Data Module
   MapPatch5_8_1R-52 — tactical display decongestion on split data modules. */
(function(){
  'use strict';
  window.ProjectCurseRegionMapData={
  "REGIONS": [
    {
      "key": "world",
      "label": "세계",
      "sub": "권역 선택",
      "map": "assets/maps/world_actual_base.svg"
    },
    {
      "key": "east",
      "label": "동아시아",
      "sub": "란저우·홍콩·대한해협",
      "map": "assets/maps/continent_east_asia.svg",
      "extent": {
        "lonMin": 68,
        "lonMax": 158,
        "latMin": -8,
        "latMax": 60
      }
    },
    {
      "key": "europe",
      "label": "유럽",
      "sub": "피의 호수·북해",
      "map": "assets/maps/continent_europe.svg",
      "extent": {
        "lonMin": -28,
        "lonMax": 48,
        "latMin": 28,
        "latMax": 74
      }
    },
    {
      "key": "north",
      "label": "북미",
      "sub": "캐나다 북부·태평양 검역",
      "map": "assets/maps/continent_north_america.svg",
      "extent": {
        "lonMin": -175,
        "lonMax": -20,
        "latMin": 0,
        "latMax": 83
      }
    },
    {
      "key": "southasia",
      "label": "남아시아",
      "sub": "북인도·인도양 항로",
      "map": "assets/maps/continent_south_asia.svg",
      "extent": {
        "lonMin": 55,
        "lonMax": 105,
        "latMin": -3,
        "latMax": 40
      }
    },
    {
      "key": "seindian",
      "label": "동남아·인도양",
      "sub": "말라카·자바 해역",
      "map": "assets/maps/continent_se_asia_indian.svg",
      "extent": {
        "lonMin": 84,
        "lonMax": 136,
        "latMin": -16,
        "latMax": 28
      }
    },
    {
      "key": "oceania",
      "label": "오세아니아",
      "sub": "호주 중앙 심부권",
      "map": "assets/maps/continent_oceania.svg",
      "extent": {
        "lonMin": 106,
        "lonMax": 184,
        "latMin": -52,
        "latMax": -2
      }
    },
    {
      "key": "mideast",
      "label": "중동",
      "sub": "시리아·이라크·수에즈",
      "map": "assets/maps/continent_middle_east.svg",
      "extent": {
        "lonMin": 20,
        "lonMax": 70,
        "latMin": 6,
        "latMax": 45
      }
    },
    {
      "key": "africa",
      "label": "아프리카",
      "sub": "사헬·카이로·동아프리카",
      "map": "assets/maps/continent_africa.svg",
      "extent": {
        "lonMin": -25,
        "lonMax": 60,
        "latMin": -38,
        "latMax": 42
      }
    }
  ],
  "WORLD_BUTTONS": [
    {
      "region": "north",
      "label": "북미",
      "sub": "COMMS LOSS",
      "left": 23.2,
      "top": 35.6
    },
    {
      "region": "europe",
      "label": "유럽",
      "sub": "SEA LOCK",
      "left": 49.6,
      "top": 31.8
    },
    {
      "region": "mideast",
      "label": "중동",
      "sub": "ROUTE CHECK",
      "left": 58.6,
      "top": 44.3
    },
    {
      "region": "africa",
      "label": "아프리카",
      "sub": "FIELD WATCH",
      "left": 51.4,
      "top": 59.6
    },
    {
      "region": "southasia",
      "label": "남아시아",
      "sub": "ANCHOR WATCH",
      "left": 65.9,
      "top": 48.8
    },
    {
      "region": "east",
      "label": "동아시아",
      "sub": "RED WATCH",
      "left": 75.9,
      "top": 39
    },
    {
      "region": "seindian",
      "label": "동남아·인도양",
      "sub": "SEA HOLD",
      "left": 74.9,
      "top": 58.5
    },
    {
      "region": "oceania",
      "label": "오세아니아",
      "sub": "DEEP REACTION",
      "left": 81.6,
      "top": 72.1
    }
  ],
  "DATA": {
    "east": [
      {
        "id": "RZ-EA-01",
        "type": "zone",
        "zone": "red",
        "name": "란저우 내륙 레드존",
        "lon": 103.8,
        "lat": 36.1,
        "size": "xlarge",
        "variant": "spread-tail",
        "group": "lanzhou",
        "status": "중국 간쑤성 내륙 광역 오염권. 외곽 봉쇄와 황허 이상현상 관측이 연결된다.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "BZ-EA-01",
        "type": "zone",
        "zone": "black",
        "name": "란저우 심부 반응 후보지",
        "lon": 98.7,
        "lat": 40.2,
        "size": "small",
        "variant": "core-crack",
        "group": "lanzhou",
        "status": "레드존 서북 심부에서 확인되는 압축형 블랙존 후보 반응.",
        "records": "블랙 태그 기준 / 레드존 장기 방치 단계"
      },
      {
        "id": "RZ-EA-02",
        "type": "zone",
        "zone": "red",
        "name": "주강 하구 레드존",
        "lon": 112.1,
        "lat": 23.2,
        "size": "medium",
        "variant": "port-spread",
        "group": "hongkong",
        "status": "남중국 연안 항만권과 맞닿은 국지 레드존.",
        "records": "지역지도 / 현상 기록"
      },
      {
        "id": "WZ-EA-01",
        "type": "zone",
        "zone": "white",
        "name": "홍콩 격리 항만 관리권",
        "lon": 114.45,
        "lat": 22.35,
        "size": "small",
        "variant": "port-control",
        "group": "hongkong",
        "status": "홍콩·선전 항만의 귀환자 선별 및 선박 검문권.",
        "records": "구역 위험도 분류 문서"
      },
      {
        "id": "WZ-EA-02",
        "type": "zone",
        "zone": "white",
        "name": "부산 검문 관리권",
        "lon": 128.65,
        "lat": 35.35,
        "size": "small",
        "variant": "gate-control",
        "group": "busan",
        "status": "대한해협 진입 선박을 분리하는 항만 검문권.",
        "records": "지역지도"
      },
      {
        "id": "GZ-EA-01",
        "type": "zone",
        "zone": "green",
        "name": "일본 서남부 후방 운영권",
        "lon": 133.6,
        "lat": 34,
        "size": "medium",
        "variant": "rear-core",
        "group": "japan-rear",
        "status": "동아시아 후방 보급·기록 회수 운영권.",
        "records": "구역 위험도 분류 문서"
      },
      {
        "id": "OBS-EA-01",
        "type": "facility",
        "name": "N.H.C 란저우 전방 관측기지",
        "lon": 106.2,
        "lat": 34.8,
        "role": "관측기지",
        "scale": "mid",
        "group": "lanzhou",
        "status": "란저우 레드존 동남 외곽의 감시·봉쇄 지원기지.",
        "records": "N.H.C 현장 운용 절차"
      },
      {
        "id": "GATE-EA-01",
        "type": "blockade-node",
        "name": "란저우 동부 봉쇄 거점",
        "lon": 107.4,
        "lat": 34.2,
        "role": "봉쇄 거점",
        "scale": "mid",
        "group": "lanzhou",
        "status": "동부 1차 차단선의 끝단 검문·봉쇄 노드.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "GATE-EA-02",
        "type": "blockade-node",
        "name": "홍콩 항만 검문소",
        "lon": 114.75,
        "lat": 21.75,
        "role": "항만 검문소",
        "scale": "small",
        "group": "hongkong",
        "status": "화이트존과 항만 차단선 사이의 검문 지점.",
        "records": "C.P.D 대피·선별 절차"
      },
      {
        "id": "FAC-EA-03",
        "type": "facility",
        "name": "부산 해상 통제 허브",
        "lon": 130.35,
        "lat": 34.25,
        "role": "해상 통제",
        "scale": "small",
        "group": "busan",
        "status": "대한해협 남단 감시와 회수선 통제 허브.",
        "records": "지역지도"
      },
      {
        "id": "GATE-EA-03",
        "type": "blockade-node",
        "name": "동중국해 감시 부표 거점",
        "lon": 126.75,
        "lat": 26.65,
        "role": "해상 봉쇄 거점",
        "scale": "small",
        "group": "east-sea",
        "status": "동중국해 해상 감시선과 간헐 신호권을 묶는 부표형 봉쇄 노드.",
        "records": "지역지도"
      },
      {
        "id": "FAC-EA-04",
        "type": "facility",
        "name": "일본 서남부 후방 통신소",
        "lon": 132.25,
        "lat": 32.35,
        "role": "후방 통신",
        "scale": "small",
        "group": "japan-rear",
        "status": "후방 운영권의 피난 기록 회수와 동아시아 후방 통신을 담당하는 소규모 관제소.",
        "records": "Ghost Channel / 지역지도"
      },
      {
        "id": "INC-EA-01",
        "type": "incident",
        "name": "홍콩 항만 집단 실종 사건",
        "lon": 112.65,
        "lat": 21.55,
        "scale": "small",
        "group": "hongkong",
        "status": "주강 하구 서측 항만 실종 사건 좌표.",
        "records": "타락 개체 분류 추가 보고서"
      },
      {
        "id": "AN-EA-01",
        "type": "anomaly",
        "name": "황허 변류 이상현상",
        "lon": 101.2,
        "lat": 37.6,
        "scale": "medium",
        "group": "lanzhou",
        "status": "란저우 외곽 황허 지류의 비정상 변류 기록.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "COM-EA-01",
        "type": "comms",
        "name": "동중국해 간헐 신호권",
        "lon": 125.35,
        "lat": 28.65,
        "scale": "small",
        "group": "east-sea",
        "status": "해상 통제 허브와 감시선 사이에 발생하는 간헐 신호 오염.",
        "records": "Ghost Channel / 시간 오염 통신"
      },
      {
        "id": "BL-EA-01",
        "type": "blockade",
        "name": "란저우 동남 외곽 차단선",
        "variant": "land-contour",
        "scale": "large",
        "group": "lanzhou",
        "points": [
          [
            100.8,
            38.5
          ],
          [
            104.4,
            36.8
          ],
          [
            108.5,
            34
          ]
        ],
        "status": "레드존 외곽을 따라 휘는 육상 주 봉쇄선.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "BL-EA-02",
        "type": "blockade",
        "name": "홍콩 항만 차단선",
        "variant": "port-arc",
        "scale": "small",
        "group": "hongkong",
        "points": [
          [
            112.8,
            21.6
          ],
          [
            113.7,
            21.3
          ],
          [
            114.7,
            21.6
          ]
        ],
        "status": "항만 입구를 짧게 가로막는 국지 차단선.",
        "records": "C.P.D 항만 검문"
      },
      {
        "id": "BL-EA-03",
        "type": "blockade",
        "name": "동중국해 해상 감시선",
        "variant": "sea-watch",
        "scale": "xlarge",
        "group": "east-sea",
        "points": [
          [
            122,
            31
          ],
          [
            126.5,
            27.6
          ],
          [
            131,
            25
          ]
        ],
        "status": "항로 방향을 따라 완만하게 휘는 넓은 해상 감시선.",
        "records": "지역지도"
      },
      {
        "id": "YZ-EA-01",
        "type": "zone",
        "zone": "yellow",
        "name": "대한해협 완충 감시권",
        "lon": 130.55,
        "lat": 33.75,
        "size": "small",
        "variant": "sea-buffer",
        "group": "east-sea",
        "status": "부산 검문 관리권과 동중국해 해상 감시선 사이를 잇는 해협 완충 감시권.",
        "records": "구역 위험도 분류 문서 / 지역지도"
      },
      {
        "id": "INC-EA-02",
        "type": "incident",
        "name": "대한해협 심야 신호 단절 좌표",
        "lon": 129.65,
        "lat": 32.85,
        "scale": "small",
        "group": "east-sea",
        "status": "심야 항로 감시 중 선박 식별 신호와 음성 기록이 동시에 끊긴 사건 좌표.",
        "records": "Ghost Channel / 시간 오염 통신"
      },
      {
        "id": "AN-EA-02",
        "type": "anomaly",
        "name": "란저우 외곽 토양 맥동 기록",
        "lon": 109.25,
        "lat": 37.35,
        "scale": "small",
        "group": "lanzhou",
        "status": "란저우 동남 외곽 차단선 바깥에서 반복 확인된 지표 맥동형 현상 기록.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "FAC-EA-05",
        "type": "facility",
        "name": "오키나와 해상 기록 중계소",
        "lon": 128.15,
        "lat": 25.65,
        "role": "해상 기록 중계",
        "scale": "small",
        "group": "east-sea",
        "status": "동중국해 감시권과 대한해협 통제 허브 사이의 항로 기록을 중계하는 소규모 해상 관제소.",
        "records": "작전 실패 후 기록 회수 절차"
      },
      {
        "id": "FAC-EA-Z01",
        "type": "facility",
        "name": "오키나와 해상 기록 중계소",
        "lon": 127.6,
        "lat": 26.3,
        "scale": "small",
        "group": "japan-rear",
        "role": "줌4 이상 보조 통신 시설",
        "status": "일본 후방권과 대한해협 감시권 사이의 기록 중계소. 기본 작전도에서는 숨기고 줌4 이상에서 확인한다.",
        "records": "N.H.C 현장 작전·장비·봉쇄 규정 문서 / Ghost Channel",
        "zoomMin": 4
      },
      {
        "id": "COM-EA-Z01",
        "type": "comms",
        "name": "동중국해 야간 통신 지연권",
        "lon": 126.4,
        "lat": 30.1,
        "scale": "small",
        "group": "east-sea",
        "role": "줌4 이상 통신 보조권",
        "status": "동중국해 감시선과 부산 후방 통신망 사이에서 야간 지연이 반복되는 보조 통신권.",
        "records": "Ghost Channel / 레드존 이상현상 및 오염 기준 문서",
        "zoomMin": 4
      }
    ],
    "europe": [
      {
        "id": "RZ-EU-01",
        "type": "zone",
        "zone": "red",
        "name": "피의 호수 레드존",
        "lon": 9,
        "lat": 54.7,
        "size": "large",
        "variant": "coastal-spread",
        "group": "blood-lake",
        "status": "독일 북부와 덴마크 남단 사이의 대표 오염권.",
        "records": "피의 호수 부검 기록"
      },
      {
        "id": "BZ-EU-01",
        "type": "zone",
        "zone": "black",
        "name": "스카게라크 심부 후보지",
        "lon": 14.7,
        "lat": 57.7,
        "size": "small",
        "variant": "core-crack",
        "group": "blood-lake",
        "status": "북해권 잔류 반응이 압축되는 블랙존 후보지.",
        "records": "레드존 장기 방치 단계"
      },
      {
        "id": "YZ-EU-01",
        "type": "zone",
        "zone": "yellow",
        "name": "북독일 완충 감시권",
        "lon": 5.8,
        "lat": 52.5,
        "size": "medium",
        "variant": "buffer-band",
        "group": "blood-lake",
        "status": "피의 호수 서남 외곽 격상 후보 감시권.",
        "records": "구역 위험도 분류 문서"
      },
      {
        "id": "WZ-EU-01",
        "type": "zone",
        "zone": "white",
        "name": "코펜하겐 검문 관리권",
        "lon": 12.95,
        "lat": 55.25,
        "size": "small",
        "variant": "gate-control",
        "group": "copenhagen",
        "status": "덴마크 동부 연안의 귀환자 선별·검문권.",
        "records": "C.P.D 검문 기록"
      },
      {
        "id": "GZ-EU-01",
        "type": "zone",
        "zone": "green",
        "name": "서유럽 후방 기록권",
        "lon": 2.2,
        "lat": 48.8,
        "size": "medium",
        "variant": "rear-core",
        "group": "eu-rear",
        "status": "피의 호수권과 분리된 후방 기록·회수 운영권.",
        "records": "지역지도"
      },
      {
        "id": "FAC-EU-01",
        "type": "facility",
        "name": "함부르크 봉쇄사령 거점",
        "lon": 8.25,
        "lat": 53.3,
        "role": "봉쇄사령",
        "scale": "small",
        "group": "blood-lake",
        "status": "피의 호수 남서 외곽의 봉쇄 지휘 거점.",
        "records": "N.H.C 현장 운용 절차"
      },
      {
        "id": "GATE-EU-01",
        "type": "blockade-node",
        "name": "독일-덴마크 북문 검문소",
        "lon": 10.9,
        "lat": 54.05,
        "role": "봉쇄 거점",
        "scale": "small",
        "group": "blood-lake",
        "status": "이중 봉쇄선 중앙 검문 노드.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "GATE-EU-02",
        "type": "blockade-node",
        "name": "코펜하겐 대피 검문 허브",
        "lon": 12.05,
        "lat": 56.1,
        "role": "대피 검문",
        "scale": "small",
        "group": "copenhagen",
        "status": "화이트존과 연결된 대피 선별 허브.",
        "records": "C.P.D 대피 절차"
      },
      {
        "id": "GATE-EU-03",
        "type": "blockade-node",
        "name": "북해 감시 부표 거점",
        "lon": 3.25,
        "lat": 57.45,
        "role": "해상 봉쇄 거점",
        "scale": "small",
        "group": "north-sea",
        "status": "북해 해상 감시선 중간축에 고정된 부표형 감시·차단 노드.",
        "records": "지역지도"
      },
      {
        "id": "FAC-EU-02",
        "type": "facility",
        "name": "서유럽 후방 기록 관제소",
        "lon": 2.7,
        "lat": 49.2,
        "role": "후방 기록",
        "scale": "small",
        "group": "eu-rear",
        "status": "서유럽 후방 기록권의 회수 자료와 피난 기록을 정리하는 관제소.",
        "records": "작전 실패 후 기록 회수 절차"
      },
      {
        "id": "INC-EU-01",
        "type": "incident",
        "name": "피의 호수 사건 좌표",
        "lon": 10.55,
        "lat": 55.35,
        "scale": "small",
        "group": "blood-lake",
        "status": "1986년 북해권 혈액성 이상현상 최초 사건 좌표.",
        "records": "피의 호수 부검 기록"
      },
      {
        "id": "AN-EU-01",
        "type": "anomaly",
        "name": "북해 혈류 잔향 기록",
        "lon": 5.3,
        "lat": 56.25,
        "scale": "small",
        "group": "north-sea",
        "status": "해상 감시권에서 반복되는 혈류 잔향 관측 기록.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "BL-EU-01",
        "type": "blockade",
        "name": "독일-덴마크 이중 봉쇄선",
        "variant": "land-contour",
        "scale": "large",
        "group": "blood-lake",
        "points": [
          [
            6.5,
            53.9
          ],
          [
            9.4,
            54.7
          ],
          [
            12.4,
            54.2
          ]
        ],
        "status": "레드존 남측 접근축을 가로막는 주요 육상 봉쇄선.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "BL-EU-02",
        "type": "blockade",
        "name": "북해 해상 감시선",
        "variant": "sea-watch",
        "scale": "xlarge",
        "group": "north-sea",
        "points": [
          [
            -1.5,
            58
          ],
          [
            4.2,
            57.2
          ],
          [
            10.5,
            55.8
          ]
        ],
        "status": "북해 해상권을 넓게 감시하는 장거리 점선 감시선.",
        "records": "지역지도"
      },
      {
        "id": "BL-EU-03",
        "type": "blockade",
        "name": "코펜하겐 항만 검문 차단선",
        "variant": "port-arc",
        "scale": "small",
        "group": "copenhagen",
        "points": [
          [
            11.8,
            55.7
          ],
          [
            12.5,
            55.45
          ],
          [
            13.1,
            55.7
          ]
        ],
        "status": "화이트존 동측 항만 진입축을 짧게 끊는 대피 검문 차단선.",
        "records": "C.P.D 대피 절차"
      },
      {
        "id": "COM-EU-01",
        "type": "comms",
        "name": "스카게라크 무전 반복권",
        "lon": 14,
        "lat": 57.25,
        "scale": "small",
        "group": "north-sea",
        "status": "블랙존 후보지와 북해 감시선 사이에서 반복되는 무전 잔향.",
        "records": "Ghost Channel"
      },
      {
        "id": "INC-EU-02",
        "type": "incident",
        "name": "피의 호수 외곽 어획선 귀환 사건",
        "lon": 6.75,
        "lat": 55.85,
        "scale": "small",
        "group": "blood-lake",
        "status": "피의 호수 레드존 외곽에서 무인 어획선이 반복 귀환한 사건 좌표.",
        "records": "피의 호수 부검 기록 / 타락 개체 분류 추가 보고서"
      },
      {
        "id": "FAC-EU-03",
        "type": "facility",
        "name": "북해 봉쇄감시선 E-7",
        "lon": 1.45,
        "lat": 58.85,
        "role": "해상 봉쇄감시",
        "scale": "small",
        "group": "north-sea",
        "status": "북해 해상 감시선 북서측을 순환하는 기록 회수 및 봉쇄 감시선.",
        "records": "N.H.C 현장 운용 절차"
      },
      {
        "id": "FAC-EU-04",
        "type": "facility",
        "name": "동유럽 후방 기록 관제소",
        "lon": 19.5,
        "lat": 52.9,
        "role": "후방 기록",
        "scale": "small",
        "group": "eu-rear",
        "status": "피의 호수권과 북해권 기록을 후방에서 분리 보관하는 동유럽 관제소.",
        "records": "작전 실패 후 기록 회수 절차"
      },
      {
        "id": "COM-EU-02",
        "type": "comms",
        "name": "동유럽 기록 지연권",
        "lon": 21.6,
        "lat": 50.6,
        "scale": "small",
        "group": "eu-rear",
        "status": "서유럽 후방 기록권에서 동쪽 기록 보관소로 넘어가는 구간의 시간 지연성 통신 이상.",
        "records": "Ghost Channel / 시간 오염 통신"
      },
      {
        "id": "FAC-EU-Z01",
        "type": "facility",
        "name": "동유럽 철도 기록 관제소",
        "lon": 22.6,
        "lat": 50.2,
        "scale": "small",
        "group": "eu-rear",
        "role": "줌4 이상 후방 관제 시설",
        "status": "피의 호수권과 서유럽 후방 기록망 사이를 중계하는 철도축 관제소.",
        "records": "N.H.C 현장 운용 절차 / 작전 실패 후 기록 회수 절차",
        "zoomMin": 4
      },
      {
        "id": "COM-EU-Z01",
        "type": "comms",
        "name": "북해 감시선 최종 송신권",
        "lon": 4.3,
        "lat": 57.7,
        "scale": "small",
        "group": "north-sea",
        "role": "줌4 이상 해상 통신권",
        "status": "북해 봉쇄감시선의 최종 송신이 반복적으로 기록되는 해상 통신권.",
        "records": "Ghost Channel / 봉쇄선 붕괴 코드",
        "zoomMin": 4
      }
    ],
    "north": [
      {
        "id": "RZ-NA-01",
        "type": "zone",
        "zone": "red",
        "name": "캐나다 북서부 레드존",
        "lon": -126,
        "lat": 63,
        "size": "xlarge",
        "variant": "spread-tail",
        "group": "canada-north",
        "status": "북서 캐나다 광역 장기 봉쇄권.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "BZ-NA-01",
        "type": "zone",
        "zone": "black",
        "name": "유콘 심부 침묵 후보지",
        "lon": -145,
        "lat": 66,
        "size": "medium",
        "variant": "void-core",
        "group": "canada-north",
        "status": "북부 침묵 지대와 맞닿은 블랙존 후보 코어.",
        "records": "블랙 태그 기준"
      },
      {
        "id": "YZ-NA-01",
        "type": "zone",
        "zone": "yellow",
        "name": "오대호 완충 감시권",
        "lon": -84.2,
        "lat": 44.2,
        "size": "small",
        "variant": "buffer-band",
        "group": "great-lakes",
        "status": "오대호 주변의 후방 격상 감시권.",
        "records": "구역 위험도 분류 문서"
      },
      {
        "id": "WZ-NA-01",
        "type": "zone",
        "zone": "white",
        "name": "밴쿠버 연안 검역권",
        "lon": -123.75,
        "lat": 49.45,
        "size": "small",
        "variant": "port-control",
        "group": "vancouver",
        "status": "태평양 연안 선박 검역 및 피난민 선별권.",
        "records": "C.P.D 검문 기록"
      },
      {
        "id": "GZ-NA-01",
        "type": "zone",
        "zone": "green",
        "name": "에드먼턴 후방 운영권",
        "lon": -113.5,
        "lat": 53.5,
        "size": "medium",
        "variant": "rear-core",
        "group": "canada-north",
        "status": "북부 봉쇄선 뒤쪽 보급·회수 운영권.",
        "records": "지역지도"
      },
      {
        "id": "FAC-NA-01",
        "type": "facility",
        "name": "N.H.C 북부 관측기지",
        "lon": -116,
        "lat": 58,
        "role": "관측기지",
        "scale": "mid",
        "group": "canada-north",
        "status": "캐나다 북서부 레드존 남측 관측기지.",
        "records": "N.H.C 현장 운용 절차"
      },
      {
        "id": "GATE-NA-01",
        "type": "blockade-node",
        "name": "남하 차단 검문 거점",
        "lon": -123,
        "lat": 56,
        "role": "봉쇄 거점",
        "scale": "mid",
        "group": "canada-north",
        "status": "남하 경로 차단선의 서측 검문 노드.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "GATE-NA-02",
        "type": "blockade-node",
        "name": "밴쿠버 항만 선별소",
        "lon": -122.35,
        "lat": 49,
        "role": "항만 검문소",
        "scale": "small",
        "group": "vancouver",
        "status": "연안 화이트존과 연결된 선박·민간 선별소.",
        "records": "C.P.D 선별 절차"
      },
      {
        "id": "INC-NA-01",
        "type": "incident",
        "name": "북부 침묵 지대 사건",
        "lon": -132,
        "lat": 62,
        "scale": "large",
        "group": "canada-north",
        "status": "장거리 통신과 위치 기록이 동시에 소거된 사건 좌표.",
        "records": "Ghost Channel"
      },
      {
        "id": "AN-NA-01",
        "type": "anomaly",
        "name": "오로라 왜곡 관측권",
        "lon": -118,
        "lat": 60,
        "scale": "medium",
        "group": "canada-north",
        "status": "봉쇄선 외곽에서 반복되는 오로라 왜곡 기록.",
        "records": "현상 기록"
      },
      {
        "id": "COM-NA-01",
        "type": "comms",
        "name": "북태평양 통신 단절권",
        "lon": -136,
        "lat": 52,
        "scale": "large",
        "group": "vancouver",
        "status": "밴쿠버 검역권 외해에서 발생한 장거리 통신 단절권.",
        "records": "Ghost Channel"
      },
      {
        "id": "FAC-NA-02",
        "type": "facility",
        "name": "오대호 후방 감시소",
        "lon": -80.5,
        "lat": 42.4,
        "role": "후방 감시",
        "scale": "small",
        "group": "great-lakes",
        "status": "오대호 완충 감시권의 격상 징후와 민간 이동 기록을 확인하는 후방 감시소.",
        "records": "구역 위험도 분류 문서"
      },
      {
        "id": "BL-NA-01",
        "type": "blockade",
        "name": "캐나다 남하 차단선",
        "variant": "land-contour",
        "scale": "xlarge",
        "group": "canada-north",
        "points": [
          [
            -140,
            58
          ],
          [
            -123,
            56
          ],
          [
            -108,
            55
          ]
        ],
        "status": "북부 오염권의 남하 경로를 끊는 장거리 차단선.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "BL-NA-02",
        "type": "blockade",
        "name": "태평양 연안 감시선",
        "variant": "sea-watch",
        "scale": "large",
        "group": "vancouver",
        "points": [
          [
            -136,
            52
          ],
          [
            -128,
            48.5
          ],
          [
            -121,
            45
          ]
        ],
        "status": "태평양 연안 항로를 따라 휘는 해상 감시선.",
        "records": "지역지도"
      },
      {
        "id": "AN-NA-02",
        "type": "anomaly",
        "name": "캐나다 북부 백색광 관측선",
        "lon": -136.8,
        "lat": 62.4,
        "scale": "small",
        "group": "canada-north",
        "status": "캐나다 북서부 레드존 남서 외곽을 따라 이어지는 장거리 백색광 관측선.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "INC-NA-02",
        "type": "incident",
        "name": "오대호 야간 부유 기록",
        "lon": -85.6,
        "lat": 44.75,
        "scale": "small",
        "group": "great-lakes",
        "status": "오대호 완충 감시권 내부에서 야간 부유 물체와 음성 기록이 함께 남은 사건 좌표.",
        "records": "현상 기록 / Ghost Channel"
      },
      {
        "id": "FAC-NA-03",
        "type": "facility",
        "name": "밴쿠버 항만 검역 시설",
        "lon": -124.85,
        "lat": 48.2,
        "role": "항만 검역",
        "scale": "small",
        "group": "vancouver",
        "status": "태평양 연안 감시선 후방에서 선박·귀환자 검역 기록을 분리하는 항만 시설.",
        "records": "C.P.D 검문 기록"
      },
      {
        "id": "COM-NA-02",
        "type": "comms",
        "name": "오대호 통신 지연권",
        "lon": -88.4,
        "lat": 45.35,
        "scale": "small",
        "group": "great-lakes",
        "status": "오대호 완충 감시권 북측에서 반복 확인되는 짧은 통신 지연권.",
        "records": "Ghost Channel / 시간 오염 통신"
      },
      {
        "id": "FAC-NA-Z01",
        "type": "facility",
        "name": "알래스카 북부 관측선",
        "lon": -149.1,
        "lat": 64.8,
        "scale": "small",
        "group": "canada-north",
        "role": "줌4 이상 극지 관측 시설",
        "status": "캐나다 북부 오염권 외곽 신호를 추적하는 알래스카 측 보조 관측선.",
        "records": "국외 레드존 대응 기준 / N.H.C 현장 운용 절차",
        "zoomMin": 4
      },
      {
        "id": "COM-NA-Z01",
        "type": "comms",
        "name": "밴쿠버 항만 검역 통신점",
        "lon": -123.4,
        "lat": 49.1,
        "scale": "small",
        "group": "vancouver",
        "role": "줌4 이상 항만 통신점",
        "status": "밴쿠버 항만 검역 시설과 후방 관제망 사이의 단거리 통신점.",
        "records": "C.P.D 대피 / 봉쇄·사후 대응 절차",
        "zoomMin": 4
      }
    ],
    "southasia": [
      {
        "id": "RZ-SA-01",
        "type": "zone",
        "zone": "red",
        "name": "북인도 레드존 후보권",
        "lon": 78,
        "lat": 29,
        "size": "large",
        "variant": "inland-spread",
        "group": "north-india",
        "status": "히말라야 남측과 갠지스 상류 사이의 격상 오염권.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "BZ-SA-01",
        "type": "zone",
        "zone": "black",
        "name": "타르 심부 반응 후보지",
        "lon": 70,
        "lat": 27,
        "size": "small",
        "variant": "core-crack",
        "group": "north-india",
        "status": "북인도 감시권 서측에서 발견된 압축형 심부 반응.",
        "records": "블랙 태그 기준"
      },
      {
        "id": "YZ-SA-01",
        "type": "zone",
        "zone": "yellow",
        "name": "북인도 완충 감시권",
        "lon": 82,
        "lat": 25,
        "size": "xlarge",
        "variant": "buffer-band",
        "group": "north-india",
        "status": "레드존 후보권 외곽을 넓게 감시하는 격상 후보권.",
        "records": "구역 위험도 분류 문서"
      },
      {
        "id": "WZ-SA-01",
        "type": "zone",
        "zone": "white",
        "name": "뉴델리 외곽 검문권",
        "lon": 76.85,
        "lat": 28.05,
        "size": "small",
        "variant": "gate-control",
        "group": "delhi",
        "status": "북인도 진입축을 선별하는 도시 외곽 검문권.",
        "records": "C.P.D 검문 기록"
      },
      {
        "id": "GZ-SA-01",
        "type": "zone",
        "zone": "green",
        "name": "뭄바이 후방 운영권",
        "lon": 72.9,
        "lat": 19.1,
        "size": "medium",
        "variant": "rear-core",
        "group": "mumbai",
        "status": "서해안 후방 수송·회수 운영권.",
        "records": "지역지도"
      },
      {
        "id": "FAC-SA-01",
        "type": "facility",
        "name": "뉴델리 외곽 통제소",
        "lon": 75.85,
        "lat": 27.4,
        "role": "검문 통제",
        "scale": "small",
        "group": "delhi",
        "status": "화이트존과 북부 감시권 사이의 선별 통제소.",
        "records": "C.P.D 선별 절차"
      },
      {
        "id": "GATE-SA-01",
        "type": "blockade-node",
        "name": "북인도 차단 거점",
        "lon": 75.8,
        "lat": 29.6,
        "role": "봉쇄 거점",
        "scale": "small",
        "group": "north-india",
        "status": "북부 차단선의 서측 검문 거점.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "GATE-SA-02",
        "type": "blockade-node",
        "name": "뭄바이 항로 검문 부표",
        "lon": 71.8,
        "lat": 16.5,
        "role": "해상 봉쇄 거점",
        "scale": "small",
        "group": "mumbai",
        "status": "아라비아해 감시선과 뭄바이 후방 운영권 사이의 해상 검문 부표.",
        "records": "지역지도"
      },
      {
        "id": "INC-SA-01",
        "type": "incident",
        "name": "갠지스 상류 이상 사건",
        "lon": 82.4,
        "lat": 25.3,
        "scale": "medium",
        "group": "north-india",
        "status": "상류 방향 수면 기록이 반복 누락된 사건 좌표.",
        "records": "현상 기록"
      },
      {
        "id": "AN-SA-01",
        "type": "anomaly",
        "name": "크로노 앵커 오차권",
        "lon": 79,
        "lat": 28,
        "scale": "medium",
        "group": "north-india",
        "status": "북인도 감시권에서 관측되는 시차 오차 기록.",
        "records": "C.A.P-17 Chrono Anchor"
      },
      {
        "id": "COM-SA-01",
        "type": "comms",
        "name": "히말라야 남측 통신 왜곡권",
        "lon": 75,
        "lat": 31,
        "scale": "medium",
        "group": "north-india",
        "status": "산악 지형을 따라 발생하는 통신 지연·반복권.",
        "records": "Ghost Channel"
      },
      {
        "id": "BL-SA-01",
        "type": "blockade",
        "name": "북인도 산악 차단선",
        "variant": "land-contour",
        "scale": "large",
        "group": "north-india",
        "points": [
          [
            73,
            30
          ],
          [
            78,
            29
          ],
          [
            84,
            27
          ]
        ],
        "status": "산악 남측 진입축을 끊는 완만한 차단선.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "BL-SA-02",
        "type": "blockade",
        "name": "아라비아해 감시선",
        "variant": "sea-watch",
        "scale": "large",
        "group": "mumbai",
        "points": [
          [
            67,
            18
          ],
          [
            72,
            15
          ],
          [
            78,
            12
          ]
        ],
        "status": "서해안 후방 항로를 따라 휘는 해상 감시선.",
        "records": "지역지도"
      },
      {
        "id": "AN-SA-02",
        "type": "anomaly",
        "name": "히말라야 산악 에코 기록",
        "lon": 79.2,
        "lat": 31.6,
        "scale": "small",
        "group": "north-india",
        "status": "북인도 산악 차단선 상단에서 되돌아오는 비정상 음향·무전 에코 기록.",
        "records": "Ghost Channel / 레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "GATE-SA-03",
        "type": "blockade-node",
        "name": "뉴델리 북문 검문 거점",
        "lon": 78.25,
        "lat": 29.35,
        "role": "도시 검문 거점",
        "scale": "small",
        "group": "delhi",
        "status": "뉴델리 외곽 검문권 북측 진입로를 통제하는 도시형 봉쇄 노드.",
        "records": "C.P.D 검문 기록"
      },
      {
        "id": "BL-SA-03",
        "type": "blockade",
        "name": "뉴델리 외곽 짧은 차단선",
        "variant": "land-contour",
        "scale": "small",
        "group": "delhi",
        "points": [
          [
            76.5,
            28.75
          ],
          [
            77.75,
            29.35
          ],
          [
            79.05,
            28.75
          ]
        ],
        "status": "뉴델리 화이트존 북측 진입축을 짧게 끊는 도시 외곽 차단선.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "FAC-SA-02",
        "type": "facility",
        "name": "뭄바이 항만 후방 보급소",
        "lon": 71.7,
        "lat": 18.25,
        "role": "항만 보급",
        "scale": "small",
        "group": "mumbai",
        "status": "아라비아해 감시선 후방에서 회수선 연료와 선별 장비를 보급하는 항만 시설.",
        "records": "장비·시설·차량·특수탄약 운용"
      },
      {
        "id": "FAC-SA-Z01",
        "type": "facility",
        "name": "콜카타 후방 검역소",
        "lon": 88.2,
        "lat": 22.7,
        "scale": "small",
        "group": "delhi",
        "role": "줌4 이상 후방 검역 시설",
        "status": "뉴델리 검문권과 벵골만 후방 항로를 잇는 보조 검역소.",
        "records": "구역 위험도 분류 문서 / N.H.C 현장 운용 절차",
        "zoomMin": 4
      },
      {
        "id": "GATE-SA-Z01",
        "type": "blockade-node",
        "name": "히말라야 산악 봉쇄 초소",
        "lon": 80.2,
        "lat": 30.5,
        "scale": "small",
        "group": "north-india",
        "role": "줌4 이상 산악 봉쇄 초소",
        "status": "북인도 오염권 북측 산악 진입로에 설치된 보조 봉쇄 초소.",
        "records": "봉쇄·사후 대응 절차 / 국외 레드존 대응 기준",
        "zoomMin": 4
      }
    ],
    "seindian": [
      {
        "id": "YZ-SI-01",
        "type": "zone",
        "zone": "yellow",
        "name": "말라카 해협 감시권",
        "lon": 100.75,
        "lat": 4.15,
        "size": "small",
        "variant": "sea-buffer",
        "group": "malacca",
        "status": "항로 이동 기록을 장기 감시하는 해협 완충권.",
        "records": "지역지도"
      },
      {
        "id": "WZ-SI-01",
        "type": "zone",
        "zone": "white",
        "name": "싱가포르 검문 관리권",
        "lon": 104.1,
        "lat": 1.45,
        "size": "small",
        "variant": "port-control",
        "group": "singapore",
        "status": "민간 선박·귀환자 선별이 집중되는 항만 화이트존.",
        "records": "C.P.D 검문 기록"
      },
      {
        "id": "RZ-SI-01",
        "type": "zone",
        "zone": "red",
        "name": "자바 해역 레드존",
        "lon": 110,
        "lat": -6,
        "size": "medium",
        "variant": "coastal-spread",
        "group": "java-sea",
        "status": "자바 북방 해역 실종 사건과 연결되는 국지 오염권.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "BZ-SI-01",
        "type": "zone",
        "zone": "black",
        "name": "보르네오 신호 심부 후보",
        "lon": 115,
        "lat": 0.5,
        "size": "small",
        "variant": "void-core",
        "group": "borneo",
        "status": "보르네오 내륙 신호권에서 감지된 심부 반응 후보.",
        "records": "Ghost Channel"
      },
      {
        "id": "GZ-SI-01",
        "type": "zone",
        "zone": "green",
        "name": "자카르타 후방 운영권",
        "lon": 106.8,
        "lat": -6.2,
        "size": "medium",
        "variant": "rear-core",
        "group": "java-rear",
        "status": "자바 해역 사건권 뒤쪽의 후방 회수·대피 운영권.",
        "records": "지역지도"
      },
      {
        "id": "GATE-SI-01",
        "type": "blockade-node",
        "name": "싱가포르 해협 검문소",
        "lon": 103.05,
        "lat": 0.75,
        "role": "항만 검문소",
        "scale": "small",
        "group": "singapore",
        "status": "화이트존 남측 항로 검문 거점.",
        "records": "C.P.D 선박 검문"
      },
      {
        "id": "FAC-SI-01",
        "type": "facility",
        "name": "말라카 감시 부표망",
        "lon": 101.8,
        "lat": 2.35,
        "role": "해상 감시",
        "scale": "small",
        "group": "malacca",
        "status": "해협 감시선과 연결되는 해상 감시 노드.",
        "records": "지역지도"
      },
      {
        "id": "GATE-SI-02",
        "type": "blockade-node",
        "name": "말라카 해협 봉쇄 거점",
        "lon": 99.5,
        "lat": 3.1,
        "role": "해협 봉쇄 거점",
        "scale": "small",
        "group": "malacca",
        "status": "말라카 항로 검문선의 중앙 통과축을 통제하는 좁은 해협 봉쇄 노드.",
        "records": "지역지도"
      },
      {
        "id": "GATE-SI-03",
        "type": "blockade-node",
        "name": "자바 해역 감시 거점",
        "lon": 114.5,
        "lat": -5,
        "role": "해상 감시 거점",
        "scale": "small",
        "group": "java-sea",
        "status": "자바 북방 해상 감시선과 실종 사건권을 연결하는 감시 노드.",
        "records": "지역지도"
      },
      {
        "id": "FAC-SI-02",
        "type": "facility",
        "name": "자카르타 후방 회수소",
        "lon": 105.45,
        "lat": -6.9,
        "role": "후방 회수",
        "scale": "small",
        "group": "java-rear",
        "status": "자바 해역 사건 기록 회수와 후방 피난 집결을 담당하는 운영소.",
        "records": "작전 실패 후 기록 회수 절차"
      },
      {
        "id": "INC-SI-01",
        "type": "incident",
        "name": "자바 해역 실종 사건",
        "lon": 112,
        "lat": -5.5,
        "scale": "medium",
        "group": "java-sea",
        "status": "선박 기록과 승선자 기록이 동시에 누락된 사건 좌표.",
        "records": "타락 개체 분류 추가 보고서"
      },
      {
        "id": "AN-SI-01",
        "type": "anomaly",
        "name": "보르네오 단파 신호 기록",
        "lon": 116.1,
        "lat": 1.75,
        "scale": "small",
        "group": "borneo",
        "status": "내륙에서 외해 방향으로 반복 송신되는 단파 신호 기록.",
        "records": "Ghost Channel"
      },
      {
        "id": "BL-SI-01",
        "type": "blockade",
        "name": "말라카 해협 항로 검문선",
        "variant": "sea-route",
        "scale": "large",
        "group": "malacca",
        "points": [
          [
            96,
            6
          ],
          [
            101,
            3
          ],
          [
            105,
            1
          ]
        ],
        "status": "좁은 해협 통과축을 따라 휘는 항로 검문선.",
        "records": "지역지도"
      },
      {
        "id": "BL-SI-02",
        "type": "blockade",
        "name": "자바 북방 해상 감시선",
        "variant": "sea-watch",
        "scale": "large",
        "group": "java-sea",
        "points": [
          [
            108,
            -2
          ],
          [
            114,
            -5
          ],
          [
            121,
            -3
          ]
        ],
        "status": "자바 해역 사건권 외곽을 감싸는 해상 감시선.",
        "records": "지역지도"
      },
      {
        "id": "BL-SI-03",
        "type": "blockade",
        "name": "싱가포르 항만 차단선",
        "variant": "port-arc",
        "scale": "small",
        "group": "singapore",
        "points": [
          [
            102.9,
            1
          ],
          [
            103.7,
            0.8
          ],
          [
            104.7,
            1.1
          ]
        ],
        "status": "싱가포르 화이트존 남측 항만 진입축을 짧게 잠그는 검문 차단선.",
        "records": "C.P.D 선박 검문"
      },
      {
        "id": "COM-SI-01",
        "type": "comms",
        "name": "말라카 야간 단파 교란권",
        "lon": 98.25,
        "lat": 4.95,
        "scale": "small",
        "group": "malacca",
        "status": "말라카 해협 항로 검문선 야간 운용 중 확인되는 짧은 단파 교란권.",
        "records": "Ghost Channel / 시간 오염 통신"
      },
      {
        "id": "INC-SI-02",
        "type": "incident",
        "name": "자바 해역 부유 잔해 좌표",
        "lon": 118.2,
        "lat": -4.15,
        "scale": "small",
        "group": "java-sea",
        "status": "자바 북방 해상 감시선 안쪽에서 회수된 무표식 부유 잔해 사건 좌표.",
        "records": "타락 개체 분류 추가 보고서"
      },
      {
        "id": "FAC-SI-03",
        "type": "facility",
        "name": "보르네오 내륙 신호 관측소",
        "lon": 113.7,
        "lat": 2.65,
        "role": "신호 관측",
        "scale": "small",
        "group": "borneo",
        "status": "보르네오 신호 심부 후보권 외곽에서 단파 신호를 삼각 측량하는 관측소.",
        "records": "Ghost Channel / N.H.C 현장 운용 절차"
      },
      {
        "id": "WZ-SI-02",
        "type": "zone",
        "zone": "white",
        "name": "수마트라 북단 임시 검문권",
        "lon": 95.8,
        "lat": 5.4,
        "size": "small",
        "variant": "gate-control",
        "group": "malacca",
        "status": "말라카 해협 감시권 서측 출입축을 선별하기 위한 임시 화이트존 검문권.",
        "records": "구역 위험도 분류 문서 / C.P.D 선박 검문"
      },
      {
        "id": "GATE-SI-Z01",
        "type": "blockade-node",
        "name": "싱가포르 해상 통제 부표",
        "lon": 104.4,
        "lat": 1.05,
        "scale": "small",
        "group": "singapore",
        "role": "줌4 이상 해상 통제 부표",
        "status": "싱가포르 항만 차단선 외곽에 배치된 해상 통제 부표.",
        "records": "봉쇄·사후 대응 절차 / 항만 검문 기록",
        "zoomMin": 4
      },
      {
        "id": "COM-SI-Z01",
        "type": "comms",
        "name": "보르네오 신호 증폭점",
        "lon": 114.9,
        "lat": 1.4,
        "scale": "small",
        "group": "borneo",
        "role": "줌4 이상 신호 증폭점",
        "status": "보르네오 내륙 신호권 안에서 비정상 증폭이 확인되는 통신 보조점.",
        "records": "Ghost Channel / 현상 기록",
        "zoomMin": 4
      }
    ],
    "oceania": [
      {
        "id": "BZ-OC-01",
        "type": "zone",
        "zone": "black",
        "name": "호주 중앙 블랙존 후보지",
        "lon": 132.5,
        "lat": -25.5,
        "size": "medium",
        "variant": "void-core",
        "group": "central-aus",
        "status": "호주 중앙부 심부 반응 코어. 대형보다 압축된 밀도감이 우선된다.",
        "records": "블랙 태그 기준"
      },
      {
        "id": "RZ-OC-01",
        "type": "zone",
        "zone": "red",
        "name": "호주 남중부 레드존",
        "lon": 136,
        "lat": -32,
        "size": "large",
        "variant": "inland-spread",
        "group": "central-aus",
        "status": "중앙 심부권 남측의 내륙 레드존.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "YZ-OC-01",
        "type": "zone",
        "zone": "yellow",
        "name": "중앙 사막 감시권",
        "lon": 128.5,
        "lat": -23.5,
        "size": "xlarge",
        "variant": "desert-watch",
        "group": "central-aus",
        "status": "블랙존 후보와 레드존 사이를 넓게 감시하는 사막 감시권.",
        "records": "현상 기록"
      },
      {
        "id": "WZ-OC-01",
        "type": "zone",
        "zone": "white",
        "name": "애들레이드 검문 관리권",
        "lon": 139.6,
        "lat": -34.65,
        "size": "small",
        "variant": "gate-control",
        "group": "adelaide",
        "status": "남중부 봉쇄선 뒤쪽의 도시 외곽 검문권.",
        "records": "C.P.D 검문 기록"
      },
      {
        "id": "GZ-OC-01",
        "type": "zone",
        "zone": "green",
        "name": "호주 남동부 후방 운영권",
        "lon": 146,
        "lat": -36.5,
        "size": "medium",
        "variant": "rear-core",
        "group": "southeast-rear",
        "status": "남중부 레드존과 분리된 후방 보급·대피 운영권.",
        "records": "지역지도"
      },
      {
        "id": "FAC-OC-01",
        "type": "facility",
        "name": "애들레이드 남중부 통제소",
        "lon": 137.75,
        "lat": -35.7,
        "role": "봉쇄 통제",
        "scale": "small",
        "group": "adelaide",
        "status": "남중부 봉쇄선 뒤쪽 통제 시설.",
        "records": "N.H.C 현장 운용 절차"
      },
      {
        "id": "GATE-OC-01",
        "type": "blockade-node",
        "name": "남중부 레드라인 거점",
        "lon": 136.3,
        "lat": -34.1,
        "role": "봉쇄 거점",
        "scale": "small",
        "group": "central-aus",
        "status": "호주 방어선 중앙 검문·차단 거점.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "GATE-OC-02",
        "type": "blockade-node",
        "name": "태즈먼 감시 통제 부표",
        "lon": 158,
        "lat": -41,
        "role": "해상 봉쇄 거점",
        "scale": "small",
        "group": "southeast-rear",
        "status": "태즈먼 해상 감시선 중간축에 배치된 남동부 후방권 외해 감시 노드.",
        "records": "지역지도"
      },
      {
        "id": "INC-OC-01",
        "type": "incident",
        "name": "호주 중앙 심부 반응점",
        "lon": 134.2,
        "lat": -26.35,
        "scale": "small",
        "group": "central-aus",
        "status": "중앙 블랙존 후보와 같은 사건권의 심부 반응 좌표.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "AN-OC-01",
        "type": "anomaly",
        "name": "널 코팅 잔류 반응권",
        "lon": 128.5,
        "lat": -28,
        "scale": "medium",
        "group": "central-aus",
        "status": "중앙 사막 감시권에서 관측되는 잔류 코팅 반응.",
        "records": "Null Coating"
      },
      {
        "id": "COM-OC-01",
        "type": "comms",
        "name": "내륙 장거리 통신 손실권",
        "lon": 141,
        "lat": -30,
        "scale": "medium",
        "group": "central-aus",
        "status": "중앙 심부권과 남동부 후방권 사이의 통신 손실권.",
        "records": "Ghost Channel"
      },
      {
        "id": "BL-OC-01",
        "type": "blockade",
        "name": "호주 남중부 방어선",
        "variant": "land-contour",
        "scale": "xlarge",
        "group": "central-aus",
        "points": [
          [
            128,
            -33
          ],
          [
            137,
            -35
          ],
          [
            146,
            -34
          ]
        ],
        "status": "중앙 오염권의 남하와 남동부 후방권 접근을 막는 장거리 봉쇄선.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "BL-OC-02",
        "type": "blockade",
        "name": "태즈먼 해상 감시선",
        "variant": "sea-watch",
        "scale": "large",
        "group": "southeast-rear",
        "points": [
          [
            148,
            -38
          ],
          [
            158,
            -42
          ],
          [
            169,
            -39
          ]
        ],
        "status": "남동부 후방권 외해를 감시하는 완만한 점선 감시선.",
        "records": "지역지도"
      },
      {
        "id": "FAC-OC-02",
        "type": "facility",
        "name": "남동부 후방 보급소",
        "lon": 144.65,
        "lat": -38.15,
        "role": "후방 보급",
        "scale": "small",
        "group": "southeast-rear",
        "status": "호주 남동부 후방 운영권의 대피·보급 물자를 분리 보관하는 보급소.",
        "records": "N.H.C 현장 운용 절차"
      },
      {
        "id": "AN-OC-02",
        "type": "anomaly",
        "name": "중앙 사막 지표 압력 기록",
        "lon": 130.15,
        "lat": -27.65,
        "scale": "small",
        "group": "central-aus",
        "status": "중앙 사막 감시권 내부에서 반복되는 압력 편차와 지표 파열 전조 기록.",
        "records": "레드존 이상현상 및 오염 기준 문서 / Null Coating"
      },
      {
        "id": "INC-OC-02",
        "type": "incident",
        "name": "태즈먼 표류선 회수 좌표",
        "lon": 161.4,
        "lat": -39.2,
        "scale": "small",
        "group": "southeast-rear",
        "status": "태즈먼 해상 감시선 외곽에서 회수된 무응답 표류선의 최종 확인 좌표.",
        "records": "작전 실패 후 기록 회수 절차"
      },
      {
        "id": "COM-OC-02",
        "type": "comms",
        "name": "애들레이드 남측 통신 저하권",
        "lon": 140.65,
        "lat": -36.65,
        "scale": "small",
        "group": "adelaide",
        "status": "애들레이드 검문 관리권 남측에서 봉쇄 통제소와 레드라인 거점 사이에 발생하는 통신 저하.",
        "records": "Ghost Channel"
      },
      {
        "id": "FAC-OC-Z01",
        "type": "facility",
        "name": "남동부 후방 보급소 B-12",
        "lon": 146.7,
        "lat": -37.4,
        "scale": "small",
        "group": "southeast-rear",
        "role": "줌4 이상 후방 보급 시설",
        "status": "남동부 후방 운영권의 보급 거점. 태즈먼 감시선과 애들레이드 후방 통신망을 보조한다.",
        "records": "장비·시설·차량·특수탄약 운용 / 구역 위험도 분류 문서",
        "zoomMin": 4
      },
      {
        "id": "COM-OC-Z01",
        "type": "comms",
        "name": "태즈먼 해역 통신 부표",
        "lon": 153.2,
        "lat": -42.1,
        "scale": "small",
        "group": "southeast-rear",
        "role": "줌4 이상 해상 통신 부표",
        "status": "태즈먼 해역 감시권과 남동부 후방권 사이의 단거리 통신 부표.",
        "records": "Ghost Channel / 봉쇄·사후 대응 절차",
        "zoomMin": 4
      }
    ],
    "mideast": [
      {
        "id": "RZ-ME-01",
        "type": "zone",
        "zone": "red",
        "name": "시리아-이라크 발화권",
        "lon": 42,
        "lat": 34,
        "size": "large",
        "variant": "inland-spread",
        "group": "syraq",
        "status": "시리아·이라크 경계에 걸친 내륙 오염 발화권.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "BZ-ME-01",
        "type": "zone",
        "zone": "black",
        "name": "사막 심부 반응 후보지",
        "lon": 44,
        "lat": 30,
        "size": "small",
        "variant": "core-crack",
        "group": "desert",
        "status": "사막 감시권 내부의 압축형 심부 반응 후보.",
        "records": "블랙 태그 기준"
      },
      {
        "id": "YZ-ME-01",
        "type": "zone",
        "zone": "yellow",
        "name": "중동 사막 장기 감시권",
        "lon": 46,
        "lat": 25,
        "size": "xlarge",
        "variant": "desert-watch",
        "group": "desert",
        "status": "이라크·시리아·사우디 북부를 잇는 광역 장기 감시권.",
        "records": "지역지도"
      },
      {
        "id": "WZ-ME-01",
        "type": "zone",
        "zone": "white",
        "name": "수에즈 항로 검문권",
        "lon": 32,
        "lat": 30,
        "size": "small",
        "variant": "port-control",
        "group": "suez",
        "status": "수에즈와 홍해 항로를 선별하는 해상 검문권.",
        "records": "C.P.D 항로 검문"
      },
      {
        "id": "GZ-ME-01",
        "type": "zone",
        "zone": "green",
        "name": "바그다드 후방 운영권",
        "lon": 44.4,
        "lat": 33.3,
        "size": "medium",
        "variant": "rear-core",
        "group": "baghdad",
        "status": "내륙 봉쇄선 뒤쪽의 후방 운영권.",
        "records": "지역지도"
      },
      {
        "id": "FAC-ME-01",
        "type": "facility",
        "name": "바그다드 후방 통제소",
        "lon": 43.45,
        "lat": 32.45,
        "role": "후방 통제",
        "scale": "small",
        "group": "baghdad",
        "status": "오염권 외곽 후방 지휘·보급 통제소.",
        "records": "N.H.C 현장 운용 절차"
      },
      {
        "id": "GATE-ME-01",
        "type": "blockade-node",
        "name": "시리아-이라크 차단 거점",
        "lon": 40,
        "lat": 34,
        "role": "봉쇄 거점",
        "scale": "mid",
        "group": "syraq",
        "status": "시리아-이라크 차단선의 서측 검문 거점.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "GATE-ME-02",
        "type": "blockade-node",
        "name": "수에즈 항로 검문소",
        "lon": 33.25,
        "lat": 29,
        "role": "항로 검문",
        "scale": "small",
        "group": "suez",
        "status": "화이트존과 홍해 통제선 사이의 항로 검문 지점.",
        "records": "C.P.D 항로 검문"
      },
      {
        "id": "INC-ME-01",
        "type": "incident",
        "name": "사막 오염 무전 반복 구역",
        "lon": 43,
        "lat": 31,
        "scale": "medium",
        "group": "desert",
        "status": "사막 감시권 내부에서 반복되는 무전 오염 사건 좌표.",
        "records": "Ghost Channel"
      },
      {
        "id": "AN-ME-01",
        "type": "anomaly",
        "name": "홍해 방향 위치 오차 기록",
        "lon": 36,
        "lat": 23,
        "scale": "medium",
        "group": "suez",
        "status": "홍해 항로권에서 관측되는 위치 추적 오차 기록.",
        "records": "현상 기록"
      },
      {
        "id": "COM-ME-01",
        "type": "comms",
        "name": "사막 광역 신호 감쇄권",
        "lon": 40,
        "lat": 29,
        "scale": "large",
        "group": "desert",
        "status": "사막 감시권 외곽에 넓게 퍼지는 신호 감쇄권.",
        "records": "Ghost Channel"
      },
      {
        "id": "BL-ME-01",
        "type": "blockade",
        "name": "시리아-이라크 내륙 차단선",
        "variant": "land-contour",
        "scale": "large",
        "group": "syraq",
        "points": [
          [
            37,
            36
          ],
          [
            42,
            34
          ],
          [
            47,
            32
          ]
        ],
        "status": "내륙 발화권의 서동 진입축을 가르는 봉쇄선.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "BL-ME-02",
        "type": "blockade",
        "name": "수에즈-홍해 항로 통제선",
        "variant": "sea-route",
        "scale": "large",
        "group": "suez",
        "points": [
          [
            32,
            30
          ],
          [
            36,
            23
          ],
          [
            42,
            16
          ]
        ],
        "status": "북서-남동 항로를 따라 내려가는 장거리 항로 통제선.",
        "records": "지역지도"
      },
      {
        "id": "AN-ME-02",
        "type": "anomaly",
        "name": "시리아-이라크 외곽 열점 기록",
        "lon": 38.7,
        "lat": 35.75,
        "scale": "small",
        "group": "syraq",
        "status": "내륙 차단선 서측 외곽에서 야간에만 상승하는 열점성 현상 기록.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "GATE-ME-03",
        "type": "blockade-node",
        "name": "홍해 남단 보조 검문부표",
        "lon": 39.8,
        "lat": 18.2,
        "role": "항로 보조 검문",
        "scale": "small",
        "group": "suez",
        "status": "수에즈-홍해 항로 통제선 남단에 배치된 보조 검문 부표.",
        "records": "C.P.D 항로 검문"
      },
      {
        "id": "FAC-ME-02",
        "type": "facility",
        "name": "사막 장거리 감시초소",
        "lon": 49.2,
        "lat": 27.05,
        "role": "장거리 감시",
        "scale": "small",
        "group": "desert",
        "status": "중동 사막 장기 감시권 동측 외곽을 관측하는 저출력 전초 초소.",
        "records": "N.H.C 현장 운용 절차"
      },
      {
        "id": "INC-ME-02",
        "type": "incident",
        "name": "바그다드 북부 귀환자 교란 좌표",
        "lon": 45.7,
        "lat": 35.05,
        "scale": "small",
        "group": "baghdad",
        "status": "후방 운영권 북측 검문 과정에서 귀환자 선별 기록이 짧게 뒤섞인 사건 좌표.",
        "records": "귀환자 / 타락 개체 분류 추가 보고서"
      },
      {
        "id": "FAC-ME-Z01",
        "type": "facility",
        "name": "사막 관측기지 보조선",
        "lon": 42.9,
        "lat": 31.4,
        "scale": "small",
        "group": "desert",
        "role": "줌4 이상 사막 관측 보조선",
        "status": "장거리 사막 감시선의 보조 관측 초소. 정밀 감시 이전 단계에서 운용된다.",
        "records": "N.H.C 현장 운용 절차 / 국외 레드존 대응 기준",
        "zoomMin": 4
      },
      {
        "id": "GATE-ME-Z01",
        "type": "blockade-node",
        "name": "홍해 남단 보조 검문부표",
        "lon": 42.2,
        "lat": 16,
        "scale": "small",
        "group": "suez",
        "role": "줌4 이상 항로 보조 검문부표",
        "status": "수에즈-홍해 항로권 남단의 보조 검문 부표.",
        "records": "봉쇄·사후 대응 절차 / 항로 검문 기록",
        "zoomMin": 4
      }
    ],
    "africa": [
      {
        "id": "RZ-AF-01",
        "type": "zone",
        "zone": "red",
        "name": "사헬 장기 오염권",
        "lon": 15,
        "lat": 15,
        "size": "large",
        "variant": "desert-spread",
        "group": "sahel",
        "status": "사헬 감시권 내부의 장기 오염권.",
        "records": "레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "BZ-AF-01",
        "type": "zone",
        "zone": "black",
        "name": "북아프리카 심부 후보권",
        "lon": 22,
        "lat": 23,
        "size": "small",
        "variant": "void-core",
        "group": "north-africa",
        "status": "북아프리카 사막권의 심부 반응 후보.",
        "records": "블랙 태그 기준"
      },
      {
        "id": "YZ-AF-01",
        "type": "zone",
        "zone": "yellow",
        "name": "사하라-사헬 광역 감시권",
        "lon": 5,
        "lat": 17,
        "size": "xlarge",
        "variant": "desert-watch",
        "group": "sahel",
        "status": "사하라 남단과 사헬을 가로지르는 광역 감시권.",
        "records": "지역지도"
      },
      {
        "id": "WZ-AF-01",
        "type": "zone",
        "zone": "white",
        "name": "카이로 검문 관리권",
        "lon": 31.2,
        "lat": 30,
        "size": "small",
        "variant": "gate-control",
        "group": "cairo",
        "status": "북동 아프리카 진입축 검문·선별권.",
        "records": "C.P.D 검문 기록"
      },
      {
        "id": "GZ-AF-01",
        "type": "zone",
        "zone": "green",
        "name": "나이로비 후방 운영권",
        "lon": 36.8,
        "lat": -1.3,
        "size": "medium",
        "variant": "rear-core",
        "group": "east-africa",
        "status": "동아프리카 사건권 뒤쪽의 후방 운영권.",
        "records": "지역지도"
      },
      {
        "id": "FAC-AF-01",
        "type": "facility",
        "name": "카이로 북동 검문소",
        "lon": 30.55,
        "lat": 30.75,
        "role": "검문소",
        "scale": "small",
        "group": "cairo",
        "status": "화이트존 중심 검문 시설.",
        "records": "C.P.D 선별 절차"
      },
      {
        "id": "FAC-AF-02",
        "type": "facility",
        "name": "나이로비 후방 회수 허브",
        "lon": 36,
        "lat": -2,
        "role": "회수 허브",
        "scale": "small",
        "group": "east-africa",
        "status": "동아프리카 사건 기록 회수와 후방 보급 허브.",
        "records": "A.R.F 회수 절차"
      },
      {
        "id": "FAC-AF-03",
        "type": "facility",
        "name": "북아프리카 사막 관측소",
        "lon": 21.05,
        "lat": 20.85,
        "role": "심부 관측",
        "scale": "small",
        "group": "north-africa",
        "status": "북아프리카 블랙존 후보권 외곽에서 지표 균열과 심부 반응을 관측하는 전초 시설.",
        "records": "블랙 태그 기준"
      },
      {
        "id": "GATE-AF-01",
        "type": "blockade-node",
        "name": "사헬 중앙 차단 거점",
        "lon": 15,
        "lat": 13,
        "role": "봉쇄 거점",
        "scale": "mid",
        "group": "sahel",
        "status": "사헬 감시선과 육상 차단선의 중앙 노드.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "GATE-AF-02",
        "type": "blockade-node",
        "name": "동아프리카 해상 감시 거점",
        "lon": 43.3,
        "lat": -5.45,
        "role": "해상 봉쇄 거점",
        "scale": "small",
        "group": "east-africa",
        "status": "동아프리카 해상 감시선과 통신 공백권을 연결하는 외해 감시 노드.",
        "records": "지역지도"
      },
      {
        "id": "INC-AF-01",
        "type": "incident",
        "name": "동아프리카 현장 소실 사건",
        "lon": 40,
        "lat": 2,
        "scale": "medium",
        "group": "east-africa",
        "status": "현장 기록과 회수팀 위치가 함께 소실된 사건 좌표.",
        "records": "작전 실패 후 기록 회수 절차"
      },
      {
        "id": "AN-AF-01",
        "type": "anomaly",
        "name": "사헬 열왜곡 관측권",
        "lon": 10,
        "lat": 16,
        "scale": "large",
        "group": "sahel",
        "status": "지표 온도와 통신 지연이 동시에 상승한 현상 기록.",
        "records": "현상 기록"
      },
      {
        "id": "COM-AF-01",
        "type": "comms",
        "name": "동아프리카 통신 공백권",
        "lon": 39,
        "lat": -4,
        "scale": "medium",
        "group": "east-africa",
        "status": "동아프리카 사건권 남측으로 이어지는 통신 공백권.",
        "records": "Ghost Channel"
      },
      {
        "id": "BL-AF-01",
        "type": "blockade",
        "name": "사헬 장거리 감시선",
        "variant": "desert-arc",
        "scale": "xlarge",
        "group": "sahel",
        "points": [
          [
            -5,
            15
          ],
          [
            12,
            14
          ],
          [
            28,
            12
          ]
        ],
        "status": "사헬을 가로지르는 긴 사막 감시축.",
        "records": "지역지도"
      },
      {
        "id": "BL-AF-02",
        "type": "blockade",
        "name": "동아프리카 해상 감시선",
        "variant": "sea-watch",
        "scale": "large",
        "group": "east-africa",
        "points": [
          [
            39,
            4
          ],
          [
            43,
            -5
          ],
          [
            41,
            -14
          ]
        ],
        "status": "동아프리카 사건권 외해를 따라 휘는 해상 감시선.",
        "records": "지역지도"
      },
      {
        "id": "GATE-AF-03",
        "type": "blockade-node",
        "name": "카이로 동부 검문 거점",
        "lon": 32.75,
        "lat": 29.55,
        "role": "도시 검문 거점",
        "scale": "small",
        "group": "cairo",
        "status": "카이로 검문 관리권 동측 진입로를 잠그는 도시형 검문 노드.",
        "records": "C.P.D 검문 기록"
      },
      {
        "id": "BL-AF-03",
        "type": "blockade",
        "name": "카이로 동부 도시 차단선",
        "variant": "land-contour",
        "scale": "small",
        "group": "cairo",
        "points": [
          [
            31.8,
            30
          ],
          [
            32.5,
            30.1
          ],
          [
            33.1,
            29.8
          ]
        ],
        "status": "카이로 화이트존 동측 도로축을 짧게 끊는 도시 차단선.",
        "records": "봉쇄선 붕괴 코드"
      },
      {
        "id": "AN-AF-02",
        "type": "anomaly",
        "name": "북아프리카 지하 균열 기록",
        "lon": 25.75,
        "lat": 25.35,
        "scale": "small",
        "group": "north-africa",
        "status": "북아프리카 심부 후보권 외곽에서 관측되는 지하 균열성 반응 기록.",
        "records": "블랙 태그 기준 / 레드존 이상현상 및 오염 기준 문서"
      },
      {
        "id": "INC-AF-02",
        "type": "incident",
        "name": "동아프리카 해상 표류 사건",
        "lon": 45.3,
        "lat": -8.25,
        "scale": "small",
        "group": "east-africa",
        "status": "동아프리카 해상 감시선 남측에서 회수팀 호출 없이 표류한 선박 사건 좌표.",
        "records": "작전 실패 후 기록 회수 절차"
      },
      {
        "id": "FAC-AF-Z01",
        "type": "facility",
        "name": "사헬 이동식 감시소",
        "lon": 12.6,
        "lat": 16.3,
        "scale": "small",
        "group": "sahel",
        "role": "줌4 이상 이동식 감시소",
        "status": "사헬 감시권을 따라 이동 운용되는 보조 감시소.",
        "records": "N.H.C 현장 운용 절차 / 국외 레드존 대응 기준",
        "zoomMin": 4
      },
      {
        "id": "GATE-AF-Z01",
        "type": "blockade-node",
        "name": "동아프리카 항만 검문 기록점",
        "lon": 39.4,
        "lat": -5.8,
        "scale": "small",
        "group": "east-africa",
        "role": "줌4 이상 항만 검문 기록점",
        "status": "동아프리카 해상 사건권과 항만 검문망 사이의 보조 기록점.",
        "records": "봉쇄·사후 대응 절차 / 항만 검문 기록",
        "zoomMin": 4
      }
    ]
  },
  "VISUAL_HOTFIX": {
    "version": "5.8.1R-43 ExpandedMapVisualHotfix",
    "policy": "R41 확장 요소를 삭제하지 않고 위치·크기·선형만 조정한다.",
    "notes": [
      "확장 후 밀집된 항만/후방/해상 감시권 마커를 소폭 분리",
      "보조 사건·현상·시설 마커는 small scale로 축소",
      "정확히 겹치던 오세아니아 중앙 심부 좌표를 블랙존 내부 인접점으로 이동"
    ]
  },
  "TACTICAL_DISPLAY_POLISH": {
    "version": "5.8.1R-51 TacticalDisplayPolish",
    "policy": "디비전식 전술 지도 가독성을 참고하되 U.A.C 단말기 톤을 유지하며, 데이터 체계와 세계지도 권역 선택 구조는 변경하지 않는다.",
    "features": [
      "priority hierarchy classes for core/primary/support map items",
      "relation group tactical frame shown only on detail maps",
      "blockade endpoint and direction cues",
      "zoom-gated on-map selected item tactical card"
    ]
  },
  "TACTICAL_DISPLAY_DECONGESTION": {
    "version": "5.8.1R-52 TacticalDisplayDecongestionPass",
    "policy": "R51 시각 검토 결과에 따라 일반 화면의 전술 라벨·관계권 프레임·미니 카드·검수 패널 노출을 줄이고, 검수 정보는 검수 모드로 분리한다.",
    "features": [
      "hide BARRIER and OP-GROUP labels in normal operations view",
      "show selected mini card primarily at zoom 5 or review mode",
      "reduce marker and dot visual weight",
      "move SELF REVIEW, FINAL CHECK, and VISIBLE NODES to review mode"
    ]
  },
  "ZOOM_STAGE_LAYER": {
    "version": "5.8.1R-47 TacticalZoomStageReveal",
    "policy": "요약/정밀 보기와 정밀 전용 데이터를 제거하고, 상세지도는 줌1~줌5 단계에서 정보가 순차적으로 드러나도록 재구성한다.",
    "removedPrecisionItems": 16,
    "convertedZoomItems": 16,
    "rules": [
      "world selector remains non-zoomable",
      "zoom1 shows zones fully and non-zone nodes as dots",
      "zoom2 reveals major points and incidents",
      "zoom3 reveals blockades, blockade nodes, anomalies and normal tactical nodes",
      "zoom4 reveals support facilities and comms",
      "zoom5 adds maximum labels and review-level detail without restoring removed precision items"
    ]
  }
};

  window.ProjectCurseRegionMapData.MARKER_ICON_REBUILD = {
    version: '5.8.1R-54 ZoomFiveRestoreAndFinalAuditHotfix',
    zoomStages: 5,
    zonesKeepOriginalScale: true,
    markerVisualScaleSeparated: true,
    iconMapping: 'name/type inferred at runtime',
    note: 'R54 keeps zone geometry and R53 pictogram mapping, but restores tactical zoom to 1~5 while keeping non-zone scale compensation.'
  };

  window.ProjectCurseRegionMapData.ZOOM_FIVE_RESTORE_HOTFIX = {
    version: '5.8.1R-54 ZoomFiveRestoreAndFinalAuditHotfix',
    zoomStages: 5,
    keepsMarkerIconMapping: true,
    keepsZoneScale: true,
    note: 'Restores the prior zoom1~zoom5 control model; R53 icon mapping and non-zone scale compensation remain active.'
  };

  window.ProjectCurseRegionMapData.FINAL_RELEASE_AUDIT = {
    version: '5.8.1R-55 FinalReleaseAuditAndPackageCleanup',
    zoomStages: 5,
    worldSelectorLocked: true,
    mapElementCount: 165,
    precisionOnlyData: 0,
    keepsIconMapping: true,
    keepsNonZoneScaleCompensation: true,
    contentAdded: false,
    note: 'R55 is a release-readiness and package-cleanup pass. It preserves R54 zoom 1~5 and R53 icon/scale behavior.'
  };
})();
