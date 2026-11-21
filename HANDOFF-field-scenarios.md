# 현장 시나리오 3편 추가 — 인계 메모

## 변경 내용

- `assets/js/data/pilgrimage-scenario-data.js`에 `선간 지대 야간 순찰`, `붉은 해자 협상`, `빈 의자 귀환자 심사`를 추가했다. 각 편은 6단계, 단계별 규정과 선택지 2개 이상, 결말 3개, 고정 사실 3개, 판정 기준, 중앙 연표 경계를 갖는다. 결과는 기존 현장 판정 저장소에만 남는다.
- `assets/js/data/verdict-archive-data.js`에 세 편의 결말과 짝을 이루는 판정 기록 9건을 추가했다.
- `assets/js/data/map-room-data.js`에 작전 3건과 작전별 6단계를 추가했다. 지명 위치가 정해지지 않은 구역이므로 지도 좌표는 작전도 안의 상대 위치다.
- `assets/app/js/screens/map.js`는 위치가 미확정인 작전의 결과 링크를 해당 작전도로 연결하고, 지형을 특정하는 배경을 표시하지 않게 했다.
- `index.html`의 데이터와 지도 화면 주소 해시를 갱신했다.
- 검증은 새 시나리오 구조, 판정 기록, 작전 단계 연결을 검사하도록 확장했다.

## 개수 단언 변경과 이유

- 현장 시나리오 3편 → 6편: 추가한 현장 기록 3편을 포함한다.
- 판정 결과 10건 → 19건, 도달 가능한 결말 10개 → 19개: 새 시나리오 결말마다 판정 기록 한 건씩, 총 9건을 더했다.
- 작전 5건 → 8건: 지도 작전 3건을 추가했다.
- 작전 신호 29건 → 32건: 지도 신호 목록이 작전 1건당 항목 하나를 만들기 때문에 3건 늘었다. 작전 범주도 5건에서 8건으로 바뀌었다.
- 완료 상태 판정 렌더 검사 3건 → 6건: 검사에서 시나리오별로 첫 결말을 완료 처리하므로 기록 수가 시나리오 수와 같이 늘었다.

## 파일

- `assets/js/data/pilgrimage-scenario-data.js`
- `assets/js/data/verdict-archive-data.js`
- `assets/js/data/map-room-data.js`
- `assets/app/js/screens/map.js`
- `index.html`
- `tools/verify-data.mjs`
- `tools/verify-app.d/archive.mjs`
- `tools/verify-app.d/map.mjs`
- `HANDOFF-field-scenarios.md`

## 확인

- `node tools/stamp-assets.mjs` — 통과, 4개 주소 해시 갱신.
- `node tools/build-share-stubs.mjs` — 실행 완료. 이 작업은 공유 미리보기 대상의 이름·요약·그림을 바꾸지 않았다.
- `node tools/verify-app.mjs` — 168/168 통과.
- `node tools/verify-data.mjs` — 366/366 통과.
- 변경한 JavaScript 파일의 `node --check`와 `git diff --check` 통과.
- 브라우저의 1280px·375px 시각 확인은 미실행. 브라우저 도구가 `file://` URL을 보안 정책으로 거부했고, 같은 페이지를 우회해 여는 방법도 금지한다고 반환했다. 화면 경로·상태·목록 렌더 검사는 `verify-app`에서 통과했다.

## 적용 범위

- 이 작업은 새 현장 판정, 판정 보관 기록, 작전 지도 경로에 한정된다. 공통 연표와 정사 원장은 수정하지 않았다.
- 세 구역의 지리적 좌표나 관할을 새로 확정하지 않았다.
- 브랜치 `codex/field-scenarios-1121`에서 작업했다. 커밋은 만들지 않았다.
