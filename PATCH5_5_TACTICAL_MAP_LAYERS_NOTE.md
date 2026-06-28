# PATCH 5.5 — Tactical Map Layers

## 기준
- 기준 ZIP: `Project_Curse_UAC_Server_ScopeLocked_MapPatch5_4_FactionRelationTrace_GitHub.zip`
- 5.4까지 복구된 기록보관서 / F.H.C / 영상 / 개체 / 세력 관계도 연출은 건드리지 않는다.
- 이번 패치는 지역지도 전술 레이어 고급화만 담당한다.

## 적용 범위

### 1. 줌 단계별 상세 레이어
기존 ZOOM 1~5 표시를 실제 시각 레이어와 연결했다.

- ZOOM 1 / 권역 보기: 기본 지도, 대형 존, 주요 봉쇄망 중심
- ZOOM 2 / 작전권 보기: 대표 경로, 감시선, 권역 섹터 라벨
- ZOOM 3 / 전술 상세: 사건 좌표, 현상 기록점, 봉쇄 게이트, 제한 경로
- ZOOM 4 / 시설 구조: 시설 블록, 내부 노드, 방어선 분할
- ZOOM 5 / 기록 분석: 사건 로그 연결선, 오염 확산 추정선, 경고 라벨

### 2. 지도 필터 상태 표시
- 현재 필터와 줌 단계를 지도 상단 필터 아래에 표시한다.
- `전체 존` 버튼명은 `오염 구역`으로 정리했다.

### 3. 지도 조작 연출
- 줌인/줌아웃/FIT/WIDE/필터/권역 전환 시 짧은 중앙 HUD를 표시한다.
- 문구는 `TACTICAL LAYER SYNC`, `ZONE GEOMETRY RECALIBRATED`, `FILTER MATRIX UPDATED` 등 지도 전용으로 분리했다.

### 4. 지도 효과음
- 기존 오디오 파일 추가 없이 WebAudio 기반으로만 처리했다.
- 줌인: 상승음
- 줌아웃: 하강음
- WIDE/FIT: 낮은 펄스
- 필터: 짧은 토글음
- 검수 모드: 짧은 비프음

## 유지한 것
- 지도 좌표계 대규모 변경 없음
- 마커 데이터 재배치 없음
- 대륙/권역 전환 함수 유지
- 드래그 / 휠 줌 / 확대축소 버튼 유지
- 기록보관서 / 세력 / F.H.C / 영상 / 개체 효과 변경 없음

## 수정 파일
- `index.html`
- `assets/js/main.js`
- `assets/css/style.css`
- `README.md`
- `PATCH5_5_TACTICAL_MAP_LAYERS_NOTE.md`
