# PATCH 5.6.2 — ArchiveTransitionCleanup + MapResidualOverlayFix

## 기준 버전
- `MapPatch5_6_1_MapZoomStepReadabilityCleanup`

## 목적
기록보관서 쪽 연출을 다시 분리하고, 지역지도 일반 모드에 남아 있던 잔상/보조선/투명 라벨을 함께 정리한다.

## 기록보관서 연출 정리

### 메뉴 진입 / 기록면 / 기록 열람 분리
- 왼쪽 메뉴에서 기록보관서 진입: `ARCHIVE SURFACE OPEN`
- 기록면 탭 전환: `RECORD SURFACE REMAP`
- 개별 기록 열람: `RECORD FILE OPEN`
- 기록 목록 복귀: `ARCHIVE INDEX RESTORED`

각 연출은 같은 로딩처럼 보이지 않도록 짧은 상단 알림으로 분리했다.
기록면 탭 전환 시 중앙을 지나가는 중복 스캔라인은 계속 제거 상태를 유지한다.

## 지도 잔상 / 보조선 정리

### 일반 모드에서 숨김 강화
- 연장 대륙 배경 실루엣
- `HELPER LAYER`, `FAC-*`, `INC-*`, `GATE-*`, `ANM-*` 계열 비선택 보조 라벨
- 선택과 무관한 대각선 링크선
- 보조 시설/분석/관제 프레임
- 해상에 남는 비선택 사건 표식
- 디버그/QA 라벨

### 남기는 요소
- 기본 가로/세로 관제 격자
- 선택 마커의 기본 표식
- 선택 마커와 관련된 반경/링크/미니카드
- 마커 상세 패널
- 검수 모드의 좌표/분석 정보

## 선택 중심 표시
- 마커를 선택하면 해당 코드와 관련된 전술 레이어만 표시한다.
- 비선택 라벨은 ZOOM 5에서도 숨김 처리한다.
- 비선택 사건/현상 마커는 매우 낮은 명도로 줄인다.

## 검수 모드
- 보조 레이어와 QA 라벨은 검수 모드에서만 확인 가능하게 유지한다.

## 수정 파일
- `assets/js/main.js`
- `assets/css/style.css`
- `README.md`
- `PATCH5_6_2_ARCHIVE_TRANSITION_CLEANUP_NOTE.md`
