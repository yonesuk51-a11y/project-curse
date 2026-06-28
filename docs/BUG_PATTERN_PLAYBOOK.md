# Bug Pattern Playbook / U.A.C Patch QA

이 문서는 Project Curse / U.A.C 기록 단말기 패치에서 반복적으로 발생한 버그 유형과 수정 처방을 고정한다. QA는 문제를 발견하는 데서 끝나지 않고, 원인 후보와 제거해야 할 구버전 패턴까지 함께 제안한다.

## 1. Loader sync mismatch

- 증상: 게이지 바가 먼저 차고 퍼센트 숫자가 늦게 따라온다.
- 원인 후보: CSS transition, JS percentage timer, hide timeout이 서로 분리되어 있다.
- 수정: `ProjectCurseTerminalLoader` 단일 컨트롤러에서 percent 상태를 관리하고, bar width와 percent text를 같은 tick에서 갱신한다.
- 제거: 중복 `setInterval`, CSS animation-only progress, legacy `showDataAccess`, duplicated `runTerminalGauge`.

## 2. Black overlay stuck

- 증상: 로딩 종료 후 검은 화면 또는 투명 오버레이가 남아 조작이 늦게 가능하다.
- 원인 후보: opacity 0 오버레이가 pointer-events를 계속 가로챈다.
- 수정: 완료 시 `pointer-events:none`을 즉시 적용하고, 짧은 unfold 이후 overlay 상태를 reset한다.
- 제거: opacity만 낮추고 DOM에 남기는 방식, 복수 complete/hide timeout.

## 3. Side menu event duplication

- 증상: 메뉴가 열리자마자 닫히거나 클릭 한 번에 두 번 반응한다.
- 원인 후보: click/touchstart/pointerdown 중복 바인딩, document close handler의 같은 이벤트 처리.
- 수정: 이벤트 계열을 하나로 통일하고, open 직후 close handler가 같은 이벤트를 무시하게 한다.
- 제거: click+touchstart 동시 등록, 여러 DOMContentLoaded 블록의 중복 menu init.

## 4. Legacy popup resurrection

- 증상: 금지된 전환 팝업/토스트/스캔 문구가 다시 보인다.
- 수정: `UAC_CANON_RULES.json`의 forbiddenRuntimeTerms 기준으로 검사하고 구 호출부를 제거한다.
- 제거: legacy popup API, pc551-menu-loader 계열, 금지 문구가 포함된 runtime strings.

## 5. Audio double play

- 증상: 버튼 하나에 효과음이 두 번 이상 재생된다.
- 수정: 오디오 라우터를 단일화하고, 버튼 유형별 sound role 하나만 허용한다.
- 제거: inline onclick playSound, WebAudio beep fallback, menu/page sound 중복 바인딩.

## 6. Mobile radial relation break

- 증상: 모바일에서 360도 관계도가 좁게 겹쳐 보인다.
- 수정: 모바일에서는 관계 카드/포커스 뷰를 우선 표시한다.
- 제거: mobile radial renderer, 360 ring mobile fallback.

## 7. Legacy map reference

- 증상: 구버전 실제 지도 SVG나 좌표 기반 마커가 다시 연결된다.
- 수정: `assets/maps/ops_*.svg`만 허용하고 abstract ops map renderer만 사용한다.
- 제거: `world_actual_base.svg`, `global_zone_map.svg`, `continent_*.svg`, coordinate-based legacy marker renderer.

## 8. Record page loader regression

- 증상: 기록면/내부 페이지 클릭에 로딩화면이 뜬다.
- 수정: 기록면/내부 페이지는 기존 세력마크 철컥음만 재생하고 loader exclude list에 추가한다.
- 제거: record page button의 `showDataAccess` 호출, record tab의 archive loader role.
