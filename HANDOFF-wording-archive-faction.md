# 기록보관소·세력 분석 화면 말 정리 인계

- 작업일: 2026-09-25
- 작업 브랜치: `codex/wording-archive-faction`
- 시작 커밋: `856cf8e` — 작업 B의 영상 몰입 재생·간략 보기 복원 위에서 이어서 작업했다.
- 작업 버전: `화면 말 정리 B-2 / 2026-09-25`
- 적용 기준: 사용자가 승인한 2026-09-25 화면 말 용어표, `AGENTS.md`, `WRITING_STYLE_GUIDE.md`의 공개 문구 기준.
- 사이트 반영 범위: 기록보관소 목록·상세·감식 안내·현장 판정 보관 안내·영상 조작 안내·보조 매체 검수 안내, 세력 목록·상세의 제목·분류·이동 안내. 주소와 저장 키는 그대로다.

## 바꾼 파일과 위치

| 파일·줄 | 바꾼 것 |
|---|---|
| `assets/app/js/screens/archive.js:14` | 지역 필터와 목록·표지의 분류 이름, 새 분류 이름으로 검색. 기존 분류 이름으로 찾는 기능도 유지한다. |
| `assets/app/js/screens/archive.js:16` | 출처 판정의 화면 표지와 관련 범례. |
| `assets/app/js/screens/archive.js:41` | 목록 이동, 저장 실패, 그림 받기, 표 머리, 현장 판정·영상·빈 상태 안내. 아래 표에 각 변경을 기록했다. |
| `assets/app/js/screens/faction.js:61` | 문양 대체 텍스트, 조직·갈래 제목, 접근성 이름, 작전 진행 링크. |
| `assets/app/css/screens/archive.css:144` | 현장 판정 행의 단추·상태 태그에 줄바꿈을 허용했다. 마지막 칸은 120px이고 공용 태그는 `white-space: nowrap`이라 길어진 문구가 넘칠 수 있는 구조였다. 이 행의 두 요소에만 적용한다. |
| `assets/js/data/archive-viewer-data.js:231` | 읽음 표 머리·제출 유형·저장 설명, 판정·감식 안내. |
| `assets/js/data/archive-viewer-data.js:242` | 공용 출처 데이터 자체를 바꾸지 않고 기록보관소 범례에 쓸 쉬운 설명 두 개를 추가했다. 다른 출처 설명은 원래 자료를 표시한다. |
| `assets/js/data/faction-display-data.js:9` | 세력 목록의 `우시노다 갈래` 표지. |
| `assets/js/data/archive-cinematic-data.js:230` | 교단 영상 마지막 쪽의 닫기 제목과 안내 두 문장. 영상 속 보고·대사는 건드리지 않았다. |
| `tools/verify-app.d/archive.mjs:13` | 새 대본 단추 이름을 요구한다. 효과 모드·재생·소리 검사는 그대로다. |
| `tools/verify-app.d/archive.mjs:24` | 마지막 쪽의 화면 안내만 승인된 문구로 대조하고, 나머지 영상 배열 전체를 옛 원문과 대조한다. |
| `tools/verify-app.d/archive.mjs:31` | 표시용 안내 다섯 개는 변경 전 문장의 출처와 변경 후 문장을 모두 확인한다. 나머지 문구의 원문 대조는 유지한다. |
| `tools/verify-app.d/archive.mjs:67` | 보고서 생성 결과 중 화면 안내 세 필드만 새 표현으로 비교한다. 보고 내용·판정·측정값·선택·날짜 등 다른 필드는 모두 일치해야 한다. |
| `tools/verify-app.d/archive.mjs:231` | 실제 화면의 격리 실행으로 지역 필터·검색·표지, 출처 범례, 원래 기록 제목·데이터 보존과 정리를 확인한다. |
| `tools/verify-app.d/faction.mjs:31` | `우시노다 계통 → 우시노다 갈래` 한 곳을 새 기준으로 대조한다. 도입문과 다른 묶음의 옛 문구 대조는 유지한다. |
| `index.html:36`, `:103`, `:113`, `:114`, `:144`, `:145` | `stamp-assets.mjs`로 갱신한 자산 주소 해시 6개만 변경했다. |
| `HANDOFF-wording-archive-faction.md` | 이 인계 메모를 새로 작성했다. |

`faction.css`는 수정하지 않았다. 셸·다른 화면·공용 데이터·상위 검증기·기존 문서·옛 앱 대조 자료도 수정하지 않았다.

## 문구 변경 목록 — 지금 → 바꾼 말

### `assets/app/js/screens/archive.js`

아래 위치는 변경 후 줄 번호다. `{수}`는 기존 계산값, `{이름}`은 기존 데이터 값이며 값 자체는 바꾸지 않았다.

| 파일·줄 | 지금 → 바꾼 말 |
|---|---|
| `archive.js:14`, `:15`, `:68`, `:229` | 권역 → 지역. 필터·목록 분류 표지·상세 표지에 적용한다. |
| `archive.js:16` | 열람 보정본 → 읽기 보정본 |
| `archive.js:16` | 출처 대조 대기 → 출처 확인 중 |
| `archive.js:41` | ← 기록 색인 → ← 기록 목록 |
| `archive.js:58` | 이 브라우저에서 저장할 수 없습니다. 현재 열람 중인 사본에만 반영됩니다. → 이 브라우저에서 저장할 수 없습니다. 현재 보고 있는 기록에만 반영됩니다. |
| `archive.js:78` | 색인 범위 → 목록 범위 |
| `archive.js:202` | {수}개 원본 크기 자료 수신 → {수}개 원본 크기 자료 받음 |
| `archive.js:202` | 자료 수신 대기 · 실패한 자료는 다시 요청할 수 있습니다. → 자료 받는 중 · 불러오지 못한 자료는 다시 받을 수 있습니다. |
| `archive.js:205` | 추가 대조 필요 → 추가 확인 필요 |
| `archive.js:206` | 대조 주석 → 맞춰 보기 안내 |
| `archive.js:232`, `:248` | 수신자 → 받는 곳 |
| `archive.js:234` | 판정 주석과 자료의 출처·한계는 각 기록면에 함께 표시됩니다. → 판정 주석과 자료의 출처·한계는 각 쪽에 함께 표시됩니다. |
| `archive.js:276` | 판정 좌표를 관제도에서 확인 → 판정 좌표를 작전 지도에서 확인 |
| `archive.js:289` | 하위 기록면 / 보호 원문 기록면 → 하위 쪽 / 보호 원문 쪽. 화면이 임시로 붙이는 접근성 이름이며 보호 본문은 바꾸지 않는다. |
| `archive.js:356` | {수}개 출처 열람 → {수}개 출처 읽음 |
| `archive.js:356` | 열람 시각 미등록 → 읽은 시각 미등록 |
| `archive.js:357` | 열람 기록 있음 / 열람 전 → 읽음 / 읽기 전 |
| `archive.js:364` | 지도 사본 반영 → 지도 기록 반영 |
| `archive.js:375` | 현장 작전 사본 판정 → 현장 작전 기록 판정 |
| `archive.js:376` | 작전지도에서 현재 결과 보기 → 작전 지도에서 현재 결과 보기 |
| `archive.js:417` | 현장 사본 범위 → 현장 기록 범위 |
| `archive.js:420` | {수}건 수신 · 현재 단말에 저장된 현장 판정 → {수}건 받음 · 현재 단말에 저장된 현장 판정 |
| `archive.js:422` | 사본 열람 / 미열람 사본 → 기록 보기 / 아직 읽지 않은 기록 |
| `archive.js:422` | 현장 사본 미수신 → 아직 받지 않은 현장 기록 |
| `archive.js:425` | 선택 범위의 사본 삭제 → 선택 범위의 기록 삭제 |
| `archive.js:430` | 현장 판정 사본 → 현장 판정 기록 |
| `archive.js:437` | 이 영상의 기록면이 없습니다. → 이 영상에 표시할 쪽이 없습니다. |
| `archive.js:442` | 영상 기록면 → 영상 쪽 |
| `archive.js:445` | 기록면 선택 → 쪽 선택 |
| `archive.js:458` | 소리나 영상을 재생하지 못했습니다. 일시정지 후 다시 재생하거나 다음 장을 눌러 주세요. → 소리나 영상을 재생하지 못했습니다. 일시정지 후 다시 재생하거나 다음 쪽을 눌러 주세요. |
| `archive.js:503` | 동일 기록면의 보정 후 문장 → 같은 쪽에서 보정된 문장 |
| `archive.js:509`, `:510`, `:515` | ← 이전 장 / 다음 장 → → ← 이전 쪽 / 다음 쪽 → |
| `archive.js:572` | 영상 구간을 읽지 못해 다음 기록면을 엽니다. → 영상 구간을 읽지 못해 다음 쪽을 엽니다. |
| `archive.js:609` | 다음 기록면 읽는 중 → 다음 쪽 읽는 중 |
| `archive.js:644` | 영상 대본 전체 열람 → 영상 대본 전체 읽기 |
| `archive.js:644` | 같은 기록면의 변조본 → 같은 쪽의 변조본 |
| `archive.js:648` | Tab 조작 이동 · P 재생·정지 · ← → 기록면 이동 · R 처음부터 · Esc 닫기 → Tab 조작 이동 · P 재생·정지 · ← → 쪽 이동 · R 처음부터 · Esc 닫기 |
| `archive.js:668` | 기록 색인 › → 기록 목록 › |
| `archive.js:685` | 목록에서 열람할 자산을 선택하십시오. → 목록에서 볼 자료를 고르십시오. |
| `archive.js:723`, `:730` | 기록 색인 → 기록 목록 |
| `archive.js:730` | 이 주소에 해당하는 기록이나 수신된 현장 사본이 없습니다. → 이 주소에 해당하는 기록이나 받은 현장 기록이 없습니다. |
| `archive.js:735` | 색인은 있으나 본문이 등록되지 않았습니다. → 목록에 있으나 본문이 등록되지 않았습니다. |

### `assets/app/js/screens/faction.js`, `assets/js/data/faction-display-data.js`

| 파일·줄 | 지금 → 바꾼 말 |
|---|---|
| `faction.js:61` | {이름} 표식 → {이름} 문양 |
| `faction.js:69` | 편제표에 연결된 세력 문서가 없습니다. → 목록에 연결된 세력 문서가 없습니다. |
| `faction.js:118` | 교단 계통 → 교단 갈래 |
| `faction.js:121` | 우시노다 계보 노드 → 우시노다 갈래 목록 |
| `faction.js:138` | 계통에 연결된 세계 기록이 없습니다. → 이 갈래에 연결된 세계 기록이 없습니다. |
| `faction.js:180` | 작전 경과 ↗ → 작전 진행 ↗ |
| `faction.js:234` | 세력 목록 복귀 → 세력 목록으로 돌아가기 |
| `faction.js:257` | 분석 대상 편제 → 분석 대상 조직 |
| `faction-display-data.js:9` | 우시노다 계통 → 우시노다 갈래 |

### `assets/js/data/archive-viewer-data.js`

| 파일·줄 | 지금 → 바꾼 말 |
|---|---|
| `archive-viewer-data.js:231` | 열람 상태 → 읽음 상태 |
| `archive-viewer-data.js:233` | 현장 판정자 제출 사본 → 현장 판정자 제출 기록 |
| `archive-viewer-data.js:234` | 아래 내용은 최종 판정이 내려진 순간의 선택 기록이다. 이후 작전을 다시 시작해도 이 사본은 바뀌지 않는다. → 아래 내용은 최종 판정이 내려진 순간의 선택 기록이다. 이후 작전을 다시 시작해도 이 기록은 바뀌지 않는다. |
| `archive-viewer-data.js:243`, 표시 `archive.js:121` | 원본을 보존한 채 열람을 위해 보정한 파생본 → 원본을 보존한 채 읽기 편하게 보정한 그림 |
| `archive-viewer-data.js:244`, 표시 `archive.js:121` | 기존 기록 자산이지만 원본 계보가 아직 대조되지 않은 이미지 → 기존 기록에 쓰였지만 원본의 출처가 아직 확인되지 않은 그림 |
| `archive-viewer-data.js:247` | 직접 확인한 결과만 열린다. 최종 판정 순간의 선택과 측정값은 원본 기록과 분리한 판정 사본으로 보존된다. → 직접 확인한 결과만 열린다. 최종 판정 순간의 선택과 측정값은 원본 기록과 분리한 판정 기록으로 보존된다. |
| `archive-viewer-data.js:250` | 모든 정보가 복구됐다. 중앙 기록을 바꾸지 않는 현장 판정을 선택하라. → 모든 정보가 복구됐습니다. 중앙 기록을 바꾸지 않는 현장 판정을 고르십시오. |
| `archive-viewer-data.js:251` | / 현재 단말 사본에만 저장됨 · 중앙 기록 변화 없음. → / 현재 단말 기록에만 저장됨 · 중앙 기록 변화 없음. |
| `archive-viewer-data.js:258` | 현재 문서에 사용된 이미지의 출처 등급과 원본 대조 가능 여부를 표시한다. 복원 추정본은 원본 기록을 대신하지 않는다. → 현재 문서에 사용된 이미지의 출처 등급을 표시하고, 원본과 맞춰 볼 수 있는지 알려 준다. 복원 추정본은 원본 기록을 대신하지 않는다. |
| `archive-viewer-data.js:260` | 비교 경계를 움직여 두 사본의 크롭·색상·정보 손실을 직접 대조할 수 있다. → 비교 경계를 움직여 두 그림의 잘린 부분·색상·빠진 정보를 직접 맞춰 볼 수 있다. |

범례의 변경 전 문구는 `assets/js/data/visual-evidence-data.js:7`, `:9`에서 읽던 화면 설명이다. 그 공용 파일은 수정하지 않았다. 첫 줄의 기존 영어 개발 주석은 한국어로 옮겼다.

### `assets/js/data/archive-cinematic-data.js`

| 파일·줄 | 지금 → 바꾼 말 |
|---|---|
| `archive-cinematic-data.js:230` | 기록보관소 복귀 → 기록으로 돌아가기 |
| `archive-cinematic-data.js:236` | 손상 영상 첨부 확인이 끝났습니다. → 손상된 첨부 영상 확인이 끝났습니다. |
| `archive-cinematic-data.js:237` | 화면 선택 시 기록보관소 목록으로 복귀합니다. → 화면을 누르면 보고 있던 기록으로 돌아갑니다. |

마지막 줄은 작업 B의 모달 닫기가 보고 있던 상세 기록으로 돌아오는 실제 동작을 설명한다. 이동 동작을 바꾸지는 않았다. 이 세 문구는 `group: return`의 화면 안내이며 교단의 보고·대사가 아니다.

## 옛 화면·연출과 대응

아래 옛 경로는 모두 `tools/fixtures/legacy-app/` 아래다. 대조 자료는 읽기만 했다. 작업 B가 복원한 연출·효과음·재생 시간·이벤트 정리는 이어받았다.

| 옛 파일·줄 → 새 파일·줄 | 대응 |
|---|---|
| `assets/css/archive-consolidation.css:63`, `:69` → `assets/app/css/screens/archive.css:184`, `assets/app/js/screens/archive.js:71` | 카드 순차 표시와 기록 열기 띠를 유지했다. 새 열기 연출은 추가하지 않았다. |
| `assets/css/archive-document.css:8` → `assets/app/css/screens/archive.css:188`, `assets/app/js/screens/archive.js:741` | 문서의 짧은 해독 표시를 유지했다. |
| `assets/css/adaptive-media.css:8`, `:16` → `assets/app/js/screens/archive.js:125`, `assets/app/css/screens/archive.css:192`, `:246` | 그림 받기 표면과 줄임 모드의 정지 표면을 유지하고, 감식 화면의 상태 문구만 쉬운 말로 바꿨다. |
| `assets/js/core/record-cinematic-runtime.js:284`, `:290`, `:291` → `assets/js/data/archive-cinematic-data.js:230`, `:236`, `:237` | 영상 끝 안내를 쉬운 말과 현재 닫기 동작에 맞췄다. 다른 장면·대사·시각은 동일하다. |
| `assets/js/pages/archive-consolidation.js:86` → `assets/js/data/archive-viewer-data.js:247`, `assets/app/js/screens/archive.js:430` | 현장 판정 보관 안내의 사본을 기록으로 표시한다. 저장 결과는 동일하다. |
| `assets/js/core/verdict-archive-state.js:110`, `:112`, `:113` → `assets/js/data/archive-viewer-data.js:231`, `:233`, `:234` | 읽음 표 머리·제출 유형·저장 설명을 정리했다. 보고 결과 전체 비교에서 이 세 필드만 정확히 치환한다. |
| `assets/js/pages/archive-document.js:95`, `:164` → `assets/js/data/archive-viewer-data.js:258`, `:260` | 출처 표시와 두 그림 맞춰 보기 안내. |
| `assets/js/pages/archive-document.js:365`, `:366` → `assets/js/data/archive-viewer-data.js:251`, `:250` | 저장·판정 선택 안내. |
| `assets/js/pages/faction-analysis.js:31`, `:50`, `:173` → `assets/app/js/screens/faction.js:61`, `assets/js/data/faction-display-data.js:9`, `assets/app/js/screens/faction.js:118` | 문양 대체 텍스트와 우시노다·교단 갈래 표지. 세력 계보의 사실 내용은 유지했다. |

## 간략 보기에서 숨긴 것과 남긴 것

이번 B-2에서 새로 숨긴 정보는 없다. 작업 B의 `.tc-full-only`와 효과 모드 규칙을 유지했다.

- 간략 보기에서 계속 숨김: 기록 내부 코드, 장식용 첨부·쪽 수, 중복 영문 표지, 채널 영문 코드와 장식 통계, 영상의 중복 영문 부제·이미지 코드, `MARK / 01`, `04 FILES`, 세력 묶음·절의 영문 표지.
- 계속 표시: 기록·세력·인물 이름, 소속·상태·날짜·본문·링크, 판정·보안·위험 등급, DTG·좌표·호출부호·교전 규칙 등 실제 운용 정보, 영상 조작 단추와 자막.
- 전체 보기에서 원래 영문 코드가 다시 보이는 동작은 바꾸지 않았다.

## 기록과 화면 문구의 경계

- `archive-viewer-data.js`의 `chapters`, `operation.canonBoundary`, `operation.decisions`는 옛 자료와 동일하다. 발신자·교신·지도 사본 등 그 안의 사실 문장은 용어표를 기계적으로 적용하지 않았다.
- 생성되는 판정 문서의 보고·증언·판정 결과는 유지했다. 바꾼 세 필드는 읽음 상태, 제출 유형, 작전을 다시 시작해도 보관 기록이 유지된다는 화면 설명이다.
- 교단 영상의 `group: return` 안내 외 모든 장면의 보고·대사·문장 순서·재생 시각은 동일하다. `열람할 것`, `기록면 자체를 2차 오염원으로 취급해야 한다`는 영상 원문이므로 유지했다.
- `대흑림 권역 보고서` 등 기록 제목·세계관 고유명사는 유지했다. `region`의 분류 표지만 지역으로 표시하며 등록부 객체를 바꾸지 않는다.
- 보호 기록의 원본·인라인 본문은 수정하지 않았다. 화면이 붙이는 접근성 쪽 이름은 나갈 때 기존 속성으로 복구한다.

## 검증 결과

- 작업 전: `verify-app` 129/129, `verify-data` 356/356 통과.
- 작업 후: `node tools/verify-app.mjs` 130/130 통과. 지역 표시·검색과 원래 제목·자료 보존을 검사하는 한 항목을 추가했다.
- `node tools/verify-data.mjs` 356/356 통과.
- `node tools/stamp-assets.mjs` 실행. 최종적으로 바뀐 자산 주소 해시는 화면 스크립트 2개, 표시용 데이터 3개, 기록보관소 스타일 1개다.
- `git diff --check` 통과. 허용된 파일 범위와 `index.html`의 해시 외 동일 여부를 별도로 확인했다.
- 보호 원문 해시·보호 기록 사실·작전 경계·저장 판정 결과 비교가 통과했다.
- 기존 격리 실행 검사도 통과했다: 네 영상 시작·정지·재개·종료, 소리·줄임 효과, Tab·Esc·포커스 복귀, 반복 진입·정리, 보호 그림 노드 복원, 세력 17개 상세와 선택적인 셸 함수 연결.
- 화면 CSS의 줄임 검사는 이미 `html[data-fx="reduced"]`를 요구한다. 미디어 쿼리 기준으로 되돌리지 않았다.
- 검사 조건을 빼거나 사실·대사 대조를 느슨하게 하지 않았다. 바뀐 화면 문구만 정확한 위치·문장으로 비교한다.

옛 문구 검사의 이름 변경:

- `archive:cults-storyboard-verbatim` → `archive:cults-storyboard-preserved-with-approved-return-copy`
- `archive:viewer-copy-verbatim` → `archive:viewer-copy-approved-wording`
- `faction:legacy-display-copy-exact` → `faction:display-copy-approved-wording`

`archive:saved-verdict-render-data-parity`, `archive:independent-verdict-adapter-parity`는 이름을 유지하고 위 세 화면 필드만 새 표현으로 비교한다. 그 외 전체 객체 비교는 유지한다.

## 확인하지 못한 것

- 브라우저 목록은 `apps: []`, `browsers: []`였다. 로컬 `index.html#archive-entry`를 인앱 브라우저로 열려 했으나 `Browser is not available: iab`로 실패했다.
- 따라서 실제 1280px·375px 표시, 가로 넘침, 키보드 포커스 테두리, 브라우저 뒤로 가기·다른 채널 왕복, 콘솔 오류 수, 영상·음향 디코딩과 실제 청취는 확인하지 못했다.
- CSS 줄바꿈은 코드로 확인한 보완이다. 실제 화면에서 넘침이 없다는 확인으로 간주하지 않는다.
- Claude의 새 셸과 병합한 결과는 아직 확인하지 못했다. 현재 작업 트리에는 새 `PCApp.fx`, `PCApp.openCanon` 등의 셸 구현이 없으며 선택 호출과 기존 대체 동작으로 검사했다. 셸 미구현 때문에 실패한 검사 항목은 없다.

## 셸·병합 담당에게 제안

1. 공용 채널 이름은 Claude 담당 `channel-identity-data.js`, `pc-core.js`에서 상황판·작전 지도·현장 지침으로 맞춘다. 이번 화면의 직접 링크 문구는 작전 지도로 정리했다.
2. `visual-evidence-data.js:7`, `:9`의 공용 표지·설명도 다른 화면을 정리할 때 맞춘다. 기록보관소는 이번 표시용 데이터로 읽기 보정본·출처 확인 중을 보여 준다. 기록별 감식 내용과 원본 설명은 그대로다.
3. `archive-registry.js`의 `region` 분류 표지는 화면에서 지역으로 표시한다. 공용 자료를 나중에 정리하더라도 `대흑림 권역 보고서`라는 기록 제목은 고유명사로 보존한다.
4. 병합 후 `stamp-assets.mjs`를 다시 실행한다. 이번 `index.html`의 해시로 다른 작업이 바꾼 셸·화면 해시를 되돌리지 않는다.
5. 실제 브라우저에서 두 화면의 간략·전체 보기, 전체·줄임 효과, 목록·상세 왕복과 긴 판정 상태 문구의 줄바꿈을 확인한다. 기록 영상의 마지막 안내가 닫힌 뒤 보이는 상세 기록과 맞는지도 확인한다.

## 커밋 처리

허용된 수정 파일 9개와 이 새 인계 메모를 명시하여 `git add`를 실행했지만 아래 오류로 실패했다.

```text
fatal: Unable to create 'C:/Users/FORYOUCOM/OneDrive/문서/GitHub/project-curse/.git/worktrees/codex-atm-b/index.lock': Permission denied
```

Git 관리 폴더가 이 작업 트리 밖에 있어 현재 실행 환경에서 쓸 수 없다. 스테이징·커밋은 이루어지지 않았고 변경 파일은 `codex/wording-archive-faction`의 작업 폴더에 남아 있다. 이 권한 제한은 코드나 검사 실패가 아니다.

권한이 있는 환경에서 현재 브랜치가 `codex/wording-archive-faction`인지 확인한 뒤 실행할 명령:

```powershell
git add -- assets/app/css/screens/archive.css assets/app/js/screens/archive.js assets/app/js/screens/faction.js assets/js/data/archive-cinematic-data.js assets/js/data/archive-viewer-data.js assets/js/data/faction-display-data.js index.html tools/verify-app.d/archive.mjs tools/verify-app.d/faction.mjs HANDOFF-wording-archive-faction.md
git commit -m "기록보관소와 세력 분석의 화면 말을 쉬운 표현으로 정리"
```

커밋 메시지:

```text
기록보관소와 세력 분석의 화면 말을 쉬운 표현으로 정리
```
