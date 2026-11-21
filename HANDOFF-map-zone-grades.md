# 인계 — 작전 지도 구역 판정과 선간 지대

- 작업일: 2026-11-21
- 브랜치: `codex/map-zone-grades`
- 상태: 검토 대기, 커밋하지 않음

## 바꾼 파일

- `assets/js/data/regional-drilldown-data.js`
  - 8개 지역 상세에 `zoneGradeCode`를 기록했다. 북부 차단선 `CORDON`, 피의 호수 봉쇄선 `SEALED`, 서부 귀환 회랑 `QUARANTINE`, 무응답 내륙·고대 왕국 묘역 `SILENT`, 대흑림 서부 순례 회랑·피난 성채 지대 `UNMEASURED`.
  - 남방권 해안 동원선은 `zoneGradeCode: null`, `zoneGradeStatus: 'not-applicable'`과 사유를 기록했다.
  - 북부 차단선에 선간 지대의 층 이름, 제3·제6차 차단선 ID, 사건 표지 ID와 지도 띠 좌표를 추가했다. 지역 데이터 버전을 v5로 올렸다.
- `assets/app/js/screens/map.js`
  - 판정 이름·설명은 `ProjectCurseWorldHistoryData.worldFramework.zoneGrading.grades`에서 코드로 조회한다. 미등록 코드는 `PCApp.missing()`으로 표시한다.
  - 지역 상세 패널 위쪽에 `구역 판정 — <판정 이름>`과 안내 문장을 붙였다. 영문 코드는 전체 보기에서만 표시한다. 남방권 동원선은 판정 대상 아님으로 표시한다.
  - 북부 상세 지도에 낮은 대비의 선간 지대 띠와 데이터의 층 설명 범례를 표시한다. 사건 표지 3곳에 같은 층의 각진 점선 테두리를 더했다.
- `assets/app/css/screens/map.css`
  - 선간 지대 표식과 범례의 배치를 추가했다. 신규 움직임 효과는 넣지 않았다.
- `tools/verify-data.mjs`
  - 각 지역의 판정 코드·기대 매핑, 남방권의 판정 없음, 북부 선간 지대 층·표지 연결을 검사한다.
- `tools/verify-app.d/map.mjs`
  - 판정 이름·설명·간략/전체 보기·미등록 코드 처리, 선간 지대와 표지 연결, 효과 줄임 상태를 검사한다.
- `index.html`
  - `node tools/stamp-assets.mjs`가 지도 코드·스타일·지역 데이터의 자산 해시를 갱신했다.

## 확인한 것

- `node tools/verify-app.mjs` — 165/165 통과. `asset-stamps-current` 포함.
- `node tools/verify-data.mjs` — 361/361 통과.
- `node --check assets/app/js/screens/map.js`와 `node --check assets/js/data/regional-drilldown-data.js` 통과.
- 화면 검증 대역에서 모든 지역 상세의 판정 표시, 전체 보기의 영문 코드, 간략 보기의 코드 숨김, 잘못된 코드의 명시적 없음 표시를 확인했다.
- 축소 동작 설정 대역에서 선간 지대 표시가 남고 타이머가 만들어지지 않는 것을 확인했다.
- 새 구역 베스카·오르비나·공석 구역 표식은 추가하지 않았다.

## 확인하지 못한 것

- 이 실행 환경에서 브라우저 목록이 비어 있었고 IAB를 사용할 수 없어 브라우저에서 직접 확인하지 못했다. 따라서 1280px·375px 배치, 실제 간략·전체 보기 전환, 콘솔 오류와 효과 줄임 렌더링은 미확인이다. 검증 대역과 CSS 규칙으로 확인한 상태다.

## 화면에 보이는 위치

- `작전 지도`의 각 지역 상세: 오른쪽 정보 칸 맨 위에 구역 판정과 짧은 안내가 보인다. 전체 보기에서만 영문 코드가 붙는다.
- `남방권 해안 동원선`: 같은 자리에 `구역 판정 — 판정 대상 아님`과 데이터 사유가 보인다.
- `북부 차단선`: 상세 지도 바탕에 옅은 선간 지대 띠와 이름 표기가 보인다. 복제 구조신호 발생권, 탈환 의식 거점군, 짐승의 길 잔존 회랑 표식은 각진 점선 둘레로 같은 층에 속함을 나타낸다.
