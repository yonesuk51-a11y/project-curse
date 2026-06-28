# Remediation QA Report / MapPatch6.2.8

버그 패턴별 원인 후보, 권장 수정, 제거 대상 패턴을 함께 기록한다.

## Detected pattern risks

### loader-sync-mismatch
- Risk: low
- Evidence: shared loader controller signature present
- Likely cause:
  - CSS transition, JS percentage timer, hide timeout이 서로 분리됨
  - 구버전 showDataAccess/runTerminalGauge가 중복 존재함
- Fix recipe:
  - ProjectCurseTerminalLoader 단일 컨트롤러에서 percent 상태를 관리
  - bar width와 percent text를 같은 tick/frame에서 갱신
  - complete/unfold/remove 순서를 하나의 promise 흐름으로 묶기
- Remove / avoid:
  - CSS animation-only progress 증가
  - 중복 setInterval/setTimeout percentage updater
  - legacy showDataAccess
  - duplicated runTerminalGauge

### black-overlay-stuck
- Risk: low
- Evidence: loader black residue guard found
- Likely cause:
  - opacity 0 오버레이가 pointer-events를 계속 가로챔
  - complete/hide/remove 타이머가 중복 실행됨
- Fix recipe:
  - 완료 시 pointer-events:none을 즉시 적용
  - 짧은 unfold 이후 overlay class/state를 reset
  - QA에서 overlay가 화면 입력을 막지 않는지 검사
- Remove / avoid:
  - opacity만 0으로 만들고 DOM에 남기는 방식
  - 복수 complete/hide timeout
  - loader is-active class 잔류

### side-menu-event-duplication
- Risk: medium
- Evidence: uacMenuToggle references: 6
- Likely cause:
  - click/touchstart/pointerdown 중복 바인딩
  - document close handler가 같은 이벤트에서 실행됨
  - DOMContentLoaded 블록별 중복 이벤트 등록
- Fix recipe:
  - click 또는 pointer 계열 하나로 통일
  - open 직후 close handler에서 같은 이벤트를 무시
  - 전환 전 메뉴/오버레이 상태 초기화
- Remove / avoid:
  - click+touchstart 동시 등록
  - 중복 DOMContentLoaded menu init
  - open button 내부 중복 close 호출

### legacy-popup-resurrection
- Risk: low
- Evidence: forbidden terms in main.js: []
- Likely cause:
  - 구버전 호출부나 문자열 데이터가 런타임 파일에 남음
  - 새 로딩 시스템과 구 팝업 시스템이 분리되지 않음
- Fix recipe:
  - UAC_CANON_RULES forbiddenRuntimeTerms 기준으로 검사
  - 구 호출부 제거 또는 no-op 처리
  - 새 로더만 허용하고 legacy popup API 차단
- Remove / avoid:
  - showToastLegacy
  - showSurfaceRemap
  - pc551-menu-loader 계열
  - legacy popup dataset
  - 금지 문구가 포함된 runtime strings

### audio-double-play
- Risk: low
- Evidence: audio play call signatures: 0
- Likely cause:
  - onclick과 addEventListener 양쪽에서 playSound 호출
  - menu/page/faction sound role이 한 요소에 중복 부여됨
- Fix recipe:
  - 오디오 라우터를 단일화
  - 버튼 유형별 sound role 하나만 허용
  - 같은 tick 내 중복 play를 debounce
- Remove / avoid:
  - 임의 WebAudio beep fallback
  - inline onclick playSound
  - 중복 menu+page sound 바인딩

### mobile-radial-relation-break
- Risk: low
- Evidence: mobile cards forced visible
- Likely cause:
  - PC용 radial/tree layout을 모바일에도 그대로 적용
  - 미디어쿼리 우선순위 충돌
- Fix recipe:
  - max-width 700px 이하 관계 카드/포커스 뷰 강제
  - 방사형 패널은 모바일에서 display:none
  - 모바일 QA에서 radial class visibility 검사
- Remove / avoid:
  - mobile radial renderer
  - 360 ring mobile fallback
  - 좁은 화면의 absolute-position relation nodes

### legacy-map-reference
- Risk: low
- Evidence: legacy map terms in js/css: []
- Likely cause:
  - old map asset path가 HTML/JS/CSS 중 하나에 잔존
  - coordinate renderer와 abstract renderer가 공존
- Fix recipe:
  - assets/maps/ops_*.svg만 허용
  - abstract ops map renderer만 지도 진입점으로 사용
  - 세계지도는 권역 선택 전용으로 유지
- Remove / avoid:
  - world_actual_base.svg
  - global_zone_map.svg
  - continent_*.svg
  - coordinate-based legacy marker renderer

### record-page-loader-regression
- Risk: low
- Evidence: locked rule maintained: recordPageLoading=false in UAC_CANON_RULES.json
- Likely cause:
  - record tab/page button이 일반 menu transition handler에 섞임
  - record page click sound와 archive open loader role이 구분되지 않음
- Fix recipe:
  - 기록면/내부 페이지는 faction_click.mp3만 재생
  - record tab/page selector를 loader exclude list에 추가
  - QA에서 recordPageLoading=false 규칙 검사
- Remove / avoid:
  - record page button의 showDataAccess 호출
  - record tab의 archive loader role
  - page click의 record_read.wav 재생
