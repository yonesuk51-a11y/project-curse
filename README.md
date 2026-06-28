# MapPatch6.2.8 ContentSuggestion / Remediation QA

- Content Opportunity QA를 추가해 메뉴별로 “추가하면 좋은 컨텐츠 후보”를 제안합니다.
- Bug Pattern Playbook / Remediation Rules를 추가해 반복 버그별 원인 후보, 권장 수정, 제거 대상 패턴을 기록합니다.
- `config/UAC_CANON_RULES.json`와 `config/UAC_REMEDIATION_RULES.json`를 기준으로 제작/검수 규칙을 고정합니다.
- `CONTENT_SUGGESTION_REPORT.md`, `REMEDIATION_QA_REPORT.md`를 생성합니다.
- 6.2.7의 동기화 게이지 런타임과 시각/설정/지도/오디오 QA 구조를 유지합니다.

---

# MapPatch6.2.6 QA Runtime / Gauge Fix

# PATCH6.2.6 QA Runtime / Gauge Fix

- `runTerminalGauge`를 전역 공통 컨트롤러로 승격해 사이드 메뉴 게이지 로딩 스코프 오류를 수정했다.
- 일반 메뉴 / 지역지도 / 기록보관서 진입 로딩을 동일한 게이지 시스템으로 통합했다.
- 기록면 / 내부 페이지 / 세력마크 버튼은 로딩 없이 기존 철컥음만 유지한다.
- 구버전 팝업/스캔/토스트 노드 제거 루틴을 클릭 시점 중심으로 유지한다.
- `index.html?uac_qa=1` 런타임 QA 모드를 추가했다.
- QA 모드는 메뉴 클릭, 게이지 표시, 100% 후 숨김, 구버전 팝업 잔존, 기록 열람 로더를 자동 점검한다.
- `QA_REPORT.md`, `QA_FINDINGS.json`, `BROWSER_QA_RESULT.json`을 패키지에 포함한다.

---

# Project Curse U.A.C 기록 단말기

## Patch 6.2.5 VisibleGauge AbstractOpsMap

- 주요 로딩은 게이지가 차오른 뒤 100%에서 화면이 펼쳐지는 방식입니다.
- 지역지도는 실제 지도 재현보다 반추상 U.A.C 작전구역도 기준으로 재구성되었습니다.
- 세계지도는 권역 선택 전용이며, 세부 마커는 대륙 상세지도에서만 표시됩니다.
- 구버전 지도 SVG와 좌표 기반 렌더러는 제거되었습니다.

- 낡은 2000~2010년대 기록 단말기 분위기를 유지하면서 메뉴 반응 속도를 단축했습니다.
- 기록보관서 기록 열람 전용 로딩만 유지하고, 기존 전환 팝업/스캔/리맵 계열은 정리했습니다.
- PC/모바일 공통 오프캔버스 메뉴, 개별 문서 페이지 메뉴명, 모바일 세력관계 카드 뷰를 보강했습니다.

# Patch6 모바일 기록 시스템 구조 개편본

이 압축본은 기존 ScopeLocked 소스를 직접 개조한 버전입니다.

핵심 변경:
- 사이드 메뉴를 `세계 개요 / 세력 / 지역지도 / 기록보관서`로 재구성
- 모바일 상단 `☰` 오프캔버스 메뉴 추가
- 지역지도 권역 바로가기 추가
- 세계지도는 권역 선택 전용 화면으로 정리
- 기록보관서 개별 설정글에 문서 내부 목차 추가
- 모바일 카드/지도/기록 탭 가독성 보정

자세한 내용은 `PATCH6_MOBILE_RECORD_SYSTEM_RESTRUCTURE_NOTE.md`를 확인하십시오.

---

# Project Curse U.A.C Server — MapPatch5_2_2_VideoFeedLayoutFix

5.2.1 영상 피드 튜닝 이후 발견된 라벨 반복/이미지 정렬 문제를 정리한 안정 패치입니다.

- 영상 손상 라벨 순차 반복 제거
- 첫 회수 이미지에만 작은 상태 라벨 표시
- 나머지 이미지는 약한 스캔라인만 유지
- 이미지 중앙 고립 배치를 줄이고 본문 폭 기준 정렬
- 5.1.1 F.H.C 튜닝 및 5.2 영상 기록 범위 유지

# Project Curse U.A.C Server - MapPatch4.9 Function Restore

## 기준
- 4.8 모듈 분리 버전은 기능 연결이 많이 끊긴 상태라 폐기했습니다.
- 마지막으로 주요 기능이 살아 있던 `MapPatch3_1_ZoomFixed` 기준으로 복구했습니다.

## 복구 목표
- 왼쪽 메뉴 이동
- 기록보관서 기록 열람 로딩
- 세력정보 카드 클릭 및 상세 표시
- 세력 관계도 상호작용
- 지역지도 권역 버튼 전환
- 지도 확대 / 축소 / FIT / WIDE
- 마우스 드래그 이동
- Ctrl + 마우스휠 줌
- 배경음 및 UI 효과음
- 9개 권역 지도
- 레드존 / 옐로우존 / 그린존 / 화이트존 / 블랙존
- 봉쇄선 / 봉쇄 거점 분리
- 검수 모드

## 제한 적용
- 4.8에서 문제를 만든 무거운 분리 모듈 구조는 포함하지 않았습니다.
- 일반 기록 본문에 의미 없이 들어가던 검열 사각형/검붉은 사선 장식은 반영하지 않았습니다.
- F.H.C/영상/개체/세력 고급 효과는 기능 안정화 후 다시 단계적으로 적용하는 것을 권장합니다.

## 다음 권장 단계
- 이 버전에서 기본 기능이 다시 정상 작동하는지 먼저 확인합니다.
- 정상 확인 후 F.H.C, 영상 기록, 개체 스캔, 세력 관계도 효과를 한 메뉴씩 따로 재적용합니다.

---

# Project Curse UAC Server — Reference Tactical Map System

- 9-region coordinate-locked map retained.
- PC 16:9 map canvas retained.
- Zone / marker / blockade visual system revised with modern tactical-map references.
- Blockade lines and blockade nodes are separated.
- No new generated images were added.

## Patch: Region Map Code Loading Overlay
- 지역지도 진입 시 U.A.C 코드 로딩 오버레이를 표시합니다.
- 각 대륙/권역 탭 선택 시 짧은 코드 스캔 로딩 화면을 표시합니다.
- 외부 이미지 생성 없이 CSS/DOM 기반으로 구현했습니다.
- 기존 9개 권역, 존 복구, PC 16:9 지도 구조는 유지했습니다.



## 1차 지도 안정화 패치
- 1600×900 SVG viewBox 기반 지도 오버레이 적용
- 존/마커/봉쇄선/봉쇄 거점 같은 좌표계 렌더링
- 레드존 해칭, 블랙존 노이즈, 옐로우/해상 점선권 강화
- 마커 코드 규칙 적용: RZ/BZ/YZ/WZ/GZ, FAC/GATE/INC/ANM/BLK/SEA
- 검수 모드 버튼 추가: 코드, 위도/경도, SVG 좌표, 표면 판정 표시


## Map Patch 2 — Readability / Debug Cleanup

- 지도 위 긴 검수 좌표문 제거: 검수 모드는 십자점과 짧은 코드만 표시.
- 좌표/위도/경도/육상·해상 판정은 우측 상세 카드 및 관제 목록에서 확인.
- 세계 지도는 요약판으로 축소: 존과 해상 감시권 중심 표시, 세부 사건/전역 봉쇄선은 권역별 지도에서 확인.
- 봉쇄선 기본 두께와 밝기 감쇠: 봉쇄선이 지도를 압도하지 않도록 조정.
- 지도 코드 라벨 크기와 투명도 조정으로 겹침 완화.
- 기존 9개 권역, PC 16:9 SVG viewBox, 존/마커/봉쇄 거점 분리 구조 유지.


## Map Patch 3 — Server UI / Layer Boot / Zoom
- 상단 U.A.C 서버 상태 바 추가
- 지역지도 레이어 부팅 연출 추가
- 지도 확대/축소, 드래그 이동, WIDE 보기 추가
- 마커 상세 패널 강화
- 문서 카드 상태 뱃지 추가
- 9개 권역 / PC 16:9 / 존·마커·봉쇄선 구조 유지


## Patch 3.1 Zoom Fix
- 지도 확대/축소 표시값만 변하고 실제 지도/오버레이가 스케일되지 않던 문제 수정.
- 기존 CSS의 `transform:none!important` 충돌을 피하기 위해 지도 프레임 CSS 변수(`--map-scale`, `--map-x`, `--map-y`) 기반으로 수정.
- 지도 베이스 이미지와 SVG 오버레이가 같은 transform을 공유하도록 유지.


## MapPatch5 Safe UI Reapply
기본 기능 복구 상태를 유지하면서 상단 상태바, 문서 뱃지, 기록/지도 로딩 표시, 줌 단계 라벨을 안전하게 보강한 버전입니다.


## Patch 5.1 — F.H.C Restricted Redaction

- 5차 Safe UI 기준 유지.
- F.H.C 극비 보안 문서 전용 접근 경고, 보안 패널, 카드 칩, 인라인 검열 표시 추가.
- 검열 표시는 실제 문장 내부에만 삽입되며, 빈 여백/문단 끝 장식은 사용하지 않음.
- 지도, 세력 관계도, 배경음, 기록 열람 기본 동작은 변경하지 않음.


## PATCH 5.2 — Damaged Video Feed

- 영상 기록 / 회수 영상 / 현장 촬영 계열 기록에 손상된 영상 피드 효과를 좁게 적용.
- 적용 기록: `Immortality_860201`, `Sakuma_Tape_991028`, `불명_Record1_860204`.
- 기록 열람 로딩에 `DAMAGED VIDEO FEED` 모드 추가.
- 영상 기록 카드 뱃지, 상단 영상 피드 패널, 프레임 손상 표시 추가.
- F.H.C 검열, 지도, 세력, 배경음, 기본 기록 열람 기능은 변경하지 않음.


## PATCH 5.2.1 — Video Feed Layout Tuning

- 영상 기록 이미지 옆에 빈 공간처럼 보이던 frame-status 영역을 제거했습니다.
- `FRAME DROP · 프레임 누락`, `SIGNAL TEAR · 신호 손상` 문구는 이미지 위 작은 오버레이로 표시됩니다.
- 기존 5.2 영상 기록 손상 피드 효과는 유지합니다.


## PATCH 5.2.3 — Video Image Scale Fix

- 영상 기록 이미지가 본문 전체 폭으로 과하게 확대되던 문제 수정.
- `VIDEO DAMAGE / FRAME LOSS / SIGNAL CORRUPTED` 라벨은 이미지 위 오버레이로 유지.
- 이미지는 문서 이미지 크기 기준으로 표시하고, 본문 텍스트 라인에 맞춰 왼쪽 정렬.
- 지도 / 세력 / 배경음 / 기록 열람 / F.H.C 효과는 변경하지 않음.


## PATCH 5.3 — Entity Bio Scan Report
- 개체/부검/유전자 기록군 전용 BIOLOGICAL TRACE SCAN 로딩 추가
- 개체 보고서 카드 뱃지 추가
- 문서 상단 생체 스캔 패널 추가
- 이미지 크기 변경 없이 첫 이미지 분석 프레임만 적용
- 영상 피드 패널 우측 문구 겹침 수정
## Patch 5.4 — Faction Relation Trace

- 세력 관계도 노드 클릭 강조 / 관련 경로 / 관계표 행 강조 추가.
- 우측/상단 분석 패널 대신 관계도 상단의 가벼운 FACTION TRACE 패널로 적용.
- 세력기록 카드 클릭 시 짧은 파일 재정렬 연출 추가.
- 기록면 탭 전환 시 RECORD PAGE 보조 연출 추가.
- 기존 오디오 파일은 유지하고, 클릭 시 짧은 WebAudio 펄스 효과만 추가.



## PATCH 5.5 — Tactical Map Layers

- 기준 버전: `MapPatch5_4_FactionRelationTrace`.
- 지역지도에만 적용되는 줌 단계별 상세 레이어를 추가했습니다.
- 기존 ZOOM 1~5 표시를 유지하면서 단계별로 다음 정보가 순차 노출됩니다.
  - ZOOM 1: 권역 요약 / 대형 오염권 / 주요 봉쇄선 중심
  - ZOOM 2: 작전권 / 감시선 / 외곽 경로 / 대표 섹터 라벨
  - ZOOM 3: 사건 좌표 / 현상 기록점 / 봉쇄 게이트 / 제한 경로
  - ZOOM 4: 시설 코드 / 방어선 분할 / 내부 작전 노드
  - ZOOM 5: 사건 로그 연결선 / 오염 확산 추정선 / 경고 라벨
- 지도 필터 상태 표시줄을 추가해 현재 필터와 줌 단계를 함께 확인할 수 있게 했습니다.
- 줌인, 줌아웃, WIDE, FIT, 필터, 권역 전환에 짧은 전술 레이어 동기화 HUD와 낮은 볼륨의 WebAudio 효과음을 추가했습니다.
- 지도 좌표계, 권역 전환 함수, 기존 기록보관서/F.H.C/영상/개체/세력관계도 연출은 변경하지 않았습니다.

## Patch 5.5.1 — TacticalMapQA

`MapPatch5_5_TacticalMapLayers` 기준 보정 패치입니다. 지도 뷰포트 클램프, WIDE/FIT 빈공간 방지, 줌 시 마커/라벨 역스케일, 지역지도 로딩 연출 교체, 지도 설명문 정리, 마커 클릭 상세 패널 복구, 기록면 스캔라인 중복 제거, 메뉴별 진입 연출 분리를 적용했습니다.

주요 수정 파일:

- `index.html`
- `assets/js/main.js`
- `assets/css/style.css`
- `PATCH5_5_1_TACTICAL_MAP_QA_NOTE.md`

## Patch 5.5.2 — MapCoordinateViewportQA

- 전체 권역 베이스맵을 고정 16:9 관제면으로 재생성했습니다.
- 동아시아뿐 아니라 세계 / 유럽 / 북미 / 남아시아 / 동남아·인도양 / 오세아니아 / 중동 / 아프리카 권역의 좌표면을 함께 검수했습니다.
- 부산 해상 통제 허브 좌표를 한반도 남동부 연안으로 보정했습니다.
- 마커 상세 패널에 권역, 표면, 위치 판정, 좌표 상태를 추가했습니다.
- 검수 모드에 MARKER QA 패널을 추가했습니다.
- 세력관계도, 기록보관서, F.H.C, 영상, 개체 스캔 연출은 건드리지 않았습니다.



## PATCH 5.5.3 — MapProjectionMarkerRebuild

- 전체 권역 지도 표면을 동일한 위도·경도 지오 프레임 기준으로 재생성했습니다.
- 지도 이미지와 SVG 마커 레이어가 같은 projection rectangle을 사용하도록 `xy()` 변환식을 재구성했습니다.
- 세계/동아시아/유럽/북미/남아시아/동남아·인도양/오세아니아/중동/아프리카 지도에 외곽 여백을 추가하여 대륙이 프레임 끝에서 잘려 보이는 현상을 완화했습니다.
- 부산 동아시아 해상 통제 허브 좌표를 한반도 남동부 연안 쪽으로 재보정했습니다.
- 마커 상세 패널에 위경도, 투영좌표, 좌표 상태를 추가했습니다.
- 검수 모드에 `GEO PROJECTION QA` 패널을 추가해 권역/위경도/투영좌표/표면/좌표상태를 확인할 수 있게 했습니다.
- 세력관계도, 기록보관서, F.H.C 검열, 영상 피드, 개체 스캔, 전체 오디오 믹싱은 변경하지 않았습니다.

## PATCH 5.5.4 — MapViewportMarkerStackQA

- 기준 버전: `MapPatch5_5_3_MapProjectionMarkerRebuild`.
- 남은 대륙 절단 체감을 줄이기 위해 연장 대륙 배경 overscan 범위를 넓혔습니다.
- 중첩된 지도 마커를 자동 감지하여 `+N` 클러스터 배지로 표시합니다.
- 같은 좌표권의 마커를 클릭하면 `MARKER STACK DETECTED` 선택 목록이 먼저 열리고, 선택한 항목의 기존 오른쪽 아래 상세 패널로 연결됩니다.
- 보이는 마커와 클릭 판정 범위를 분리하기 위해 투명 hit-area를 추가했습니다.
- 마커 상세 패널에 `중첩 상태`를 추가했습니다.
- 검수 모드에 `MARKER STACK QA` 패널을 추가해 현재 권역, 줌 단계, 중첩 그룹 수, 선택 모드를 확인할 수 있게 했습니다.
- ZOOM 4~5에서 가벼운 도로/시설 블록형 LOD 레이어를 추가했습니다.
- 세력관계도, 기록보관서, F.H.C, 영상 피드, 개체 스캔, 전체 오디오 믹싱은 변경하지 않았습니다.

### 제작 중 추천 큐

이번 패치에서 바로 넣지 않고 이후 패치로 빼는 것이 안전한 항목입니다.

- 세력관계도: U.A.C 중심 360도 방사형 관계도와 관계선 의미 재정리.
- 기록보관서: 기록면 탭 / 개별 기록 열람 / 메뉴 전환 연출의 완전 분리 QA.
- F.H.C 문서: 일반 기록과 섞이지 않는 검열 접근 연출 재검수.
- 영상 기록: 손상 피드와 프레임 라벨이 다른 메뉴 연출과 겹치지 않는지 검수.
- 개체 기록: BIOLOGICAL TRACE SCAN이 개체/부검/유전자 기록군에만 적용되는지 검수.
- 전체 오디오: 지도 조작음과 메뉴/기록/세력관계 효과음을 별도 믹싱.

## PATCH 5.5.5 — MapVisualLayerCleanupQA

- 기준 버전: `MapPatch5_5_4_MapViewportMarkerStackQA`.
- 세계/권역 기본 보기에서 하얀 네모 상자처럼 보이던 보조 시설/섹터 블록을 정리했습니다.
- ZOOM 1~2에서는 시설/섹터 보조 블록과 도시형 LOD를 숨기고, ZOOM 4~5에서만 낮은 명도 보조 관제 레이어로 표시합니다.
- `작전 시설` 필터에서는 시설 블록을 약간 더 강조하지만, 실제 마커와 헷갈리지 않도록 `HELPER LAYER` 성격을 유지합니다.
- 보조 레이어는 클릭/포커스 대상에서 제외해 마커 선택을 방해하지 않게 했습니다.
- 중첩 마커 선택 패널이 우측 상단 줌 설명 카드와 겹치지 않도록 위치와 높이를 조정했습니다.
- 검수 모드에 `VISUAL LAYER QA` 패널을 추가해 권역, 줌 단계, 필터, 보조 레이어 상태를 확인할 수 있게 했습니다.
- 세력관계도, 기록보관서, F.H.C, 영상 피드, 개체 스캔, 전체 오디오 믹싱은 변경하지 않았습니다.

## PATCH 5.5.6 — MapPerformanceMarkerFineTuneQA

- 기준 버전: `MapPatch5_5_5_MapVisualLayerCleanupQA`.
- 줌인/줌아웃 시 반복적으로 뜨던 지도 동기화 HUD를 축소하고, 줌 조작 중에는 큰 로딩 오버레이 체감을 줄였습니다.
- 지도 드래그 중 transform 반영을 `requestAnimationFrame` 기준으로 조정해 포인터 이동마다 과도한 재계산이 발생하지 않게 했습니다.
- 마커 클러스터/중첩 목록 재계산이 `style` 변화마다 반복되던 문제를 줄이고, 줌 단계 또는 class 변화 중심으로 디바운스했습니다.
- 드래그/휠 줌 중에는 전술 LOD, 도시형 LOD, 클러스터 배지, 보조 시설 레이어를 일시 정지하여 조작 체감을 우선합니다.
- 연장 대륙 배경은 유지하되, 조작 중에는 필터 부담을 낮춰 렌더링 비용을 줄였습니다.
- 검수 모드에 `MAP PERFORMANCE QA` 패널과 중앙 `GEO QA` 크로스헤어를 추가했습니다.
- 기존 마커 상세 패널, 중첩 마커 선택 목록, 좌표 상태 정보는 유지했습니다.
- 세력관계도, 기록보관서, F.H.C, 영상 피드, 개체 스캔, 전체 효과음 믹싱은 변경하지 않았습니다.


## PATCH 5.5.7 — MapTacticalVisualUpgrade

기준 버전: `MapPatch5_5_6_MapPerformanceMarkerFineTuneQA`  
폐기 기준: `MapPatch5_5_6_1_MapPerformanceHotfix`는 렉 체감이 더 커져 이번 라인에 포함하지 않음.

### 적용 범위
- 지역지도 전술 시각 업그레이드
- 오염권 해칭 보강
- 레드존/블랙존/옐로우존 감시 반경 표시
- 봉쇄 거점/현상 기록/사건 좌표 주변 관측 반경 표시
- 우측 `ACTIVE FEEDS` 보조 패널 추가
- 위성/드론/현장 감시선 보강
- 줌 단계별 미니 라벨/세부 관제 레이어 차등 표시

### 건드리지 않은 것
- 지도 조작 로직 대수정 없음
- 세력관계도 변경 없음
- 기록보관서 변경 없음
- F.H.C / 영상 / 개체 특수 연출 변경 없음
- 전체 오디오 믹싱 변경 없음


## PATCH 5.5.8 — MapLayerDeclutterQA

- 5.5.7 전술 시각 레이어가 ZOOM 5에서 과도하게 겹치는 문제를 정리했습니다.
- 줌 단계별 표시/숨김 규칙을 적용했습니다.
- 선택 마커 중심 포커스 모드를 추가했습니다.
- 비선택 반경/링크/라벨은 숨기거나 배경 수준으로 낮췄습니다.
- `HELPER LAYER`, `FAC-A/FAC-B` 같은 보조/검수 문구는 일반 모드에서 숨겼습니다.
- 검수 모드 전용 `LAYER VISIBILITY QA` 패널을 추가했습니다.

## Patch 5.5.8.1 — MapLayerVisibilityHotfix

5.5.8 이후에도 ZOOM 4~5에서 전술 레이어가 과하게 겹쳐 보이는 문제를 좁은 범위로 완화했습니다.

- 선택 마커가 없을 때 ZOOM 5 상세 레이어 강제 축소
- 선택 마커 중심 포커스 모드 강화
- 비선택 링크/반경/미니 카드/시설 셀 숨김 강화
- 일반 모드에서 `HELPER LAYER`, `FAC-*` 보조 라벨 잔류 차단
- FEEDS 패널 축소 및 작은 화면 숨김
- 지도 조작/좌표/기록보관서/세력관계도 로직은 변경하지 않음


## PATCH 5.5.9 — MapRuntimeCleanup

기준 버전: `MapPatch5_5_8_1_MapLayerVisibilityHotfix`

지도 줌/드래그 입력 때 여러 패치의 이벤트 리스너와 관측자가 동시에 반응해 렉이 누적되는 문제를 줄이기 위한 런타임 정리 패치입니다.

- 지도 줌 버튼, 휠 줌, 드래그 입력을 document capture 단계의 단일 경로로 우선 처리합니다.
- 줌 중에는 transform/readout만 즉시 갱신하고, `data-zoom-stage` 계열 상태는 조작 종료 후 한 번만 커밋합니다.
- 클러스터/LOD/FEEDS/QA 패널이 줌 입력마다 반복 갱신되는 것을 완화합니다.
- 5.5.6.1에서 문제가 되었던 `display:none` 반복 숨김/복구 방식은 사용하지 않습니다.
- 조작 중에는 전술 장식 레이어의 transition/animation만 낮춰 렌더링 부담을 줄입니다.
- 일반 모드에서는 누적된 지도 QA 패널을 숨기고, 검수 모드에서만 확인하게 정리했습니다.
- 마커 데이터, 좌표 투영, 세력관계도, 기록보관서, F.H.C/영상/개체 연출은 변경하지 않았습니다.

## MapPatch5.6 — RecordLinkCodebook + MapReadabilityCleanup

- 기준: `MapPatch5_5_9_MapRuntimeCleanup`
- 마커 상세 패널의 연결 기록을 클릭 가능한 버튼으로 변경
- 기록보관서 문서에 관련 지도 좌표 패널 추가
- 지도 좌표 버튼에서 권역 지도/마커로 복귀 가능
- `MAP CODEBOOK` 패널 추가
- 배경 연장 지도 실루엣 노출 완화
- 기본 지도 화면의 정보량 축소, 패널 동시 표시 제한
- FEEDS 패널 기본 축소


## MapPatch5.6.1 — MapZoomStepReadabilityCleanup

- 기준: `MapPatch5_6_RecordLinkCodebook`
- 지도 줌을 1% 단위 자유 배율에서 `ZOOM 1~5` 고정 단계식으로 변경
- 단계 배율: ZOOM 1 100% / ZOOM 2 140% / ZOOM 3 185% / ZOOM 4 240% / ZOOM 5 300%
- `+ / -` 버튼과 휠 줌을 단계 이동 방식으로 변경
- 최대 줌을 300%로 제한
- 일반 모드에서 배경 실루엣처럼 보이던 연장 대륙 배경을 숨김
- `HELPER LAYER`, `FAC-*`, 보조 QA 라벨 잔류를 일반 모드에서 숨김
- 선택 마커가 없을 때 해칭/반경/링크선/미니 카드/시설 셀 표시를 더 강하게 축소
- FEEDS 패널을 기본 상태에서 작게 축소
- 지도 좌표, 마커 데이터, 기록 연결, 세력관계도, F.H.C/영상/개체 연출은 변경하지 않음

## Patch 5.6.2 — ArchiveTransitionCleanup + MapResidualOverlayFix

기준 버전: `MapPatch5_6_1_MapZoomStepReadabilityCleanup`

### 포함 내용
- 기록보관서 진입 / 기록면 탭 / 개별 기록 열람 / 목록 복귀 연출 분리
- 기록면 중복 스캔라인 제거 상태 유지
- 일반 지도 모드에서 연장 배경 실루엣과 보조/디버그 라벨 숨김 강화
- 선택과 무관한 대각선 링크선, 분석선, 투명 사각 프레임, 비선택 사건 표식 억제
- ZOOM 5에서 선택 마커 관련 라벨/반경/링크만 표시
- 검수 모드에서는 보조 레이어 확인 가능

### 검수 포인트
- 기록보관서 메뉴 진입과 기록 열람 연출이 서로 다르게 보이는지
- 기록면 탭 클릭 시 선이 두 개 겹치지 않는지
- 일반 지도 모드에서 `HELPER LAYER`, `FAC-*`, `INC-*`, `GATE-*` 같은 잔류 라벨이 보이지 않는지
- 선택하지 않은 대각선 링크선/빨간 삼각형/투명 사각 프레임이 줄었는지
- 검수 모드에서는 필요한 QA 정보가 유지되는지


## Patch 5.6.3 — FactionRelationVisualUpgrade

기준 버전: `MapPatch5_6_2_ArchiveTransitionCleanup`

### 포함 내용

- 세력관계도를 U.A.C 중심 360도 방사형 `RELATION TRACE MATRIX`로 재구성
- 관계선 유형 구분: 통제/작전, 감시, 적대, 비공식 접촉, 의식 침투
- 노드 선택 시 선택 세력과 직접 연결된 세력만 강조하는 포커스 모드 추가
- 관계 분석 패널 강화: 선택 세력, 상태 태그, 직접 연결, 분석 문구, 관계선 설명 표시
- 관계표와 노드 선택 연동 보강
- 세력별 상태 태그 추가: 통제, 감시, 적대, 불명, 비공식 접촉
- 세력관계도 진입 시 `RELATION TRACE MATRIX` 상태 문구 적용
- 노드 클릭 효과음은 임시 유지하고 전체 오디오 믹싱은 후속 5.7로 보류
- C.P.D 대피버스, 차량, 장비, 지도 마커는 관계도 노드에서 제외

### 비포함

- 지역지도 줌/좌표/레이어 로직 변경 없음
- 기록보관서 구조 변경 없음
- F.H.C / 영상 / 개체 특수 연출 변경 없음
- 전체 효과음 재믹싱 없음

## MapPatch5_6_4_MenuEntryFXPolish

기준 버전: `MapPatch5_6_3_FactionRelationVisualUpgrade`

이번 패치는 원래 다음 순서였던 메뉴 진입 연출 정리와, 5.6.3 검수 중 확인된 세력관계도 레이아웃 보정을 함께 포함한다.

- 왼쪽 메뉴별 진입 HUD 문구 분리
- `RELATION TRACE MATRIX` 진입 연출 강화
- U.A.C 중심 방사형 링 구조 재배치
- 관계선 교차 완화 및 곡선화
- 선택 노드 중심 포커스 강화
- 세력 상태 태그 가독성 보강
- 관계 분석 패널 항목 추가
- C.P.D는 민간 통제국 조직 노드로 유지하되, C.P.D 대피버스·차량 단위는 관계도에서 제외 명시

수정 파일:
- `assets/js/main.js`
- `assets/css/style.css`
- `README.md`
- `PATCH5_6_4_MENU_ENTRY_FX_POLISH_NOTE.md`

## MapPatch 5.6.4.1 — FactionRelationLayoutRelationHotfix

- 5.6.4 기준 세력관계도 레이아웃 보정 핫픽스.
- 기본 상태에서 모든 세력 노드 가시성 복구.
- U.A.C 중심 3단 링 구조 재배치.
- 세력 간 관계선과 설명 추가.
- 관계 분석 패널 항목 보강.
- C.P.D는 민간 통제국 조직 노드만 유지, 대피버스/차량/장비는 제외.


## MapPatch5_7_AudioFXPolish

- 기준: MapPatch5_6_4_1_FactionRelationLayoutRelationHotfix
- 짧은 UI 효과음 중복 재생 억제 오디오 게이트 추가
- 세력관계도 연결 노드 가시성 복구
- 기본 상태에서 모든 세력 노드가 선명하게 보이도록 재구성
- U.A.C 선택 시 직접 연결 노드가 사라지지 않게 보정
- 선택 상태에서도 무관 노드는 완전 숨김이 아니라 낮은 명도로 후퇴
- 관계선보다 노드가 우선 보이게 z-index/opacity 조정

---

## PATCH 5.7.1 — RestrictedRecordFXAudit + FactionFocusFix

- 기준 버전: `MapPatch5_7_AudioFXPolish`
- F.H.C / 영상 기록 / 개체 기록 특수 연출의 적용 범위를 회귀 검수했다.
- 세력관계도에서 U.A.C 선택 시 직접 연결 노드가 사라져 보이는 문제를 수정했다.
- U.A.C 선택 시 N.H.C, S.I.D, F.H.C, C.P.D, A.R.F, Ushnoda Cult, Haimun이 직접 연결 노드로 강조된다.
- Ash Crew, Syndicate, Amarion은 2차 또는 외곽 관계로 중간 명도 유지된다.
- 무관 노드는 완전 숨김 처리하지 않고 최소 윤곽과 상태 태그를 유지한다.
- 관계 분석 패널에 직접 연결과 2차 연결 항목을 분리 표시한다.


## PATCH 5.8 — FinalUIPerformanceQA + Faction Focus Polish

- 기준 버전: `MapPatch5_7_1_RestrictedRecordFXAudit_FactionFocusFix`
- 최종 UI/성능/회귀 검수 단계
- 세력관계도 포커스 가독성 보정 포함
- 선택 노드 / 직접 연결 / 2차 연결 / 무관 노드 명도 단계 재정리
- 연결 안 된 노드끼리의 관계선은 포커스 상태에서 숨김
- 메뉴, 기록보관서, 지역지도, 특수 기록 연출 회귀 검수 기준 유지

---

## PATCH 5.8.1 — FinalHotfix SourceCleanup

- 기준 버전: `MapPatch5_8_FinalUIPerformanceQA_FactionFocusPolish`
- 5.8 이후 최종 핫픽스 및 배포 소스 정리 단계.
- 세력관계도에서 무관 노드를 5.8보다 더 투명하게 후퇴시켰다.
- 포커스 상태에서는 선택 노드에 직접 연결된 관계선만 표시한다.
- 직접 연결 노드끼리의 보조선, 2차 연결선, 무관 노드끼리의 선은 숨긴다.
- 관계표도 선택 세력 기준으로 직접/주변/무관 행의 명도를 분리했다.
- GitHub 업로드 기준으로 최신 ZIP만 풀어서 올리면 되는 구조를 유지한다.
- 이전 패치 ZIP, 원본 참고 이미지 ZIP, 대용량 영상 원본은 현재 배포 소스에 포함하지 않는 것을 권장한다.

수정 파일:
- `assets/js/main.js`
- `assets/css/style.css`
- `README.md`
- `PATCH5_8_1_FINAL_HOTFIX_SOURCE_CLEANUP_NOTE.md`

## PATCH 6.1 — Menu Effect / Audio Cleanup

- 사이드 메뉴 항목 클릭 시 표시되던 `REGION MAP ACCESS`, `WORLD OVERVIEW ACCESS` 계열 팝업을 제거했다.
- 기록 열람 후 기록면/페이지 전환 시 표시되던 `RECORD PAGE` 팝업과 토스트를 제거했다.
- 세력 마크 클릭 시 세력 설명칸에 표시되던 `FACTION FILE` 효과를 제거했다.
- 세력 마크 버튼은 기본 버튼 클릭음만 남도록 정리했다.
- 사이드 메뉴의 기록보관서 하위 메뉴를 제거하고 `기록보관서` 단일 항목으로 유지했다.
- 효과음은 새로 제공된 프로젝터 버튼, 구형 컴퓨터, VHS, 아날로그 계열 파일을 기존 오디오 슬롯에 맞춰 교체했다.


## PATCH6.2 NAV / AUDIO / STATUSBAR FINAL

- 좌측 메뉴는 기본 숨김 상태이며, 좌측 상단 ☰ 버튼으로 열린다.
- 상단 바는 현재 위치와 짧은 상태값만 표시한다.
- 사이드 메뉴는 `세계 개요 / 세력 / 지역지도 / 기록보관서` 구조를 사용한다.
- 기록보관서 기록 열람음은 `403566__lamamakesmusic__computer_startup_boot.wav`의 0~4초 구간만 사용한다.
- 지정되지 않은 오디오와 팝업/스캔 효과는 제거되었다.


## Patch6.2.1 NavFix LightAudio Hotfix

- 좌측 상단 ☰ 버튼 오프캔버스 메뉴 동작 복구
- PC/모바일 공통 메뉴 열림 처리
- `assets/audio/source_inputs/` 원본 오디오 폴더 제거
- 지정된 오디오만 유지
- `403566__lamamakesmusic__computer_startup_boot.wav`는 0초~4초 컷본만 기록 열람음으로 사용


## Patch 6.2.2 — No Transition Popups + Record Page Click

- 남아 있던 REGIONAL / TERMINAL / CHRONICLE / ARCHIVE / RECORD / FACTION FILE 계열 중앙 팝업을 완전히 비활성화했습니다.
- `pc551-menu-loader` 계열이 여전히 표시되던 문제를 JS 호출부와 CSS에서 함께 차단했습니다.
- 기록보관서의 기록면과 기록면 내부 페이지 클릭음은 세력마크 버튼의 기존 철컥음과 동일하게 통일했습니다.


## Patch 6.2.3

- Responsive stability and archive access loading overlay.
- Mobile faction relation cards replace cramped radial relation view.
- Region maps styled as semi-abstract U.A.C operational surfaces.
- Legacy transition popups remain disabled.


## MapPatch6.2.7 SyncedGaugeRuntime VisualQA

이 버전은 로딩 게이지/퍼센트 싱크, 검은 화면 잔상 제거, 반추상 작전구역도 유지, 자동 QA 제작 시스템을 포함합니다.

- 정적 QA: `python tools/qa/run_all_qa.py`
- 런타임 QA: `index.html?uac_qa=1`
- 기준 규칙: `config/UAC_CANON_RULES.json`
