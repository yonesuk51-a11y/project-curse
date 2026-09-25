# PROJECT CURSE 6 — 새 앱 명세

Status: `2026-09-24 / 표시층 재작성` · `2026-09-25 / 옛 5.54 분위기 복원, 화면 덜어내기, 채널 이름·단어·세력 이름 정리(사용자 결정)`

표시층(화면·셸·스타일)을 새로 만든다. 데이터(`assets/js/data/`)와 보호 기록은 그대로 둔다.
화면의 모양과 느낌은 `PROJECT_CURSE_ART_DIRECTION_GUIDE.md`가 정하고, 이 문서는 코드 구조와 화면별 요구를 정한다.

## 0. 진행 방식

- 새 단말은 `index.html`이다(2026-09-24 교체, 그 전까지는 `app.html`로 따로 열었다). `docs/`의 옛 문서 페이지는 `tools/build-docs-stubs.mjs`가 만든 안내 페이지로, 기록보관소의 같은 기록으로 보낸다.
- `index.html` 교체와 docs 페이지 스타일 교체는 모든 화면을 검증한 뒤 Claude가 한다.
- 새 앱은 옛 `assets/css/*.css`, `assets/js/main.js`, `assets/js/core/*`, `assets/js/pages/*`를 불러오지 않는다. 옛 모듈의 로직을 쓰려면 새 화면 파일로 옮겨 온다. 옛 파일은 2026-09-24 `tools/fixtures/legacy-app/`(원래 경로 유지)으로 옮겨 화면별 검사의 대조 기준으로만 쓴다.
  - 예외: 기록 영상 연출(`record-cinematic-*`, `cinematic-*.js`)은 기록보관소 화면이 재사용할 수 있다. 재사용하면 이 문서 5절의 기록보관소 항목에 적는다.

## 1. 파일

| 파일 | 역할 |
|---|---|
| `index.html` | 셸 마크업, 보호 기록 개정판(`#tc-vault`), 스크립트 순서 |
| `assets/app/css/tokens.css` | 색·글꼴·간격·모션 토큰, 화면별 강조색 |
| `assets/app/css/base.css` | 기본값, 포커스, 모션 감소 |
| `assets/app/css/shell.css` | 상단 명령 바, 채널 레일(모바일 하단 도크), 화면 머리 |
| `assets/app/css/components.css` | 공용 부품 |
| `assets/app/css/screens/<화면>.css` | 화면 전용 배치 |
| `assets/app/js/pc-core.js` | `PCApp` — DOM 도우미, 화면 등록, 주소 규칙, 셸 표시 |
| `assets/app/js/pc-prefs.js` | `PCPrefs` — `<head>`에서 먼저 불러 `html[data-fx="full\|reduced"]`(효과: 자동·전체·줄임)과 `html[data-density="brief\|full"]`(보기: 간략·전체)을 정한다. 열람자 호출부호 `PCPrefs.operator()`·`setOperator()`(2026-09-25, 기기에만 저장, 24자) |
| `assets/app/js/pc-audio.js` | `PCAudio` — 음향(기본 켜짐, 2026-09-25). 사건 이름으로 소리를 낸다(`cue`). 채널 이동·상세 열람·목록 복귀 소리는 `pc:route` 알림을 듣고 스스로 낸다. 이상 신호 잡음·심각 등급 울림은 Web Audio 합성 |
| `assets/app/js/pc-fx.js` · `assets/app/css/fx.css` | 연출 — 접속 확인·단말 기동·세션 복원·기록 언마운트, 채널 인계 막, 채널별 등장, 돌아오면 화면 켜짐, 증거 현상, 감식 보기·설정 창 스타일 |
| `assets/app/js/pc-anomaly.js` | 드문 이상 신호(`data-tc-anomaly`, 시계), 자리 비움 탭 제목, 삼야 무응답 기념일(`html[data-silence]`) |
| `assets/app/js/pc-inspect.js` | 증거 사진 감식 보기 |
| `assets/app/js/pc-updates.js` | 새 기록 알림 — 지난 방문 뒤 새 기록 링크에 '새 기록' 표지, 홈의 지난 방문 이후(`site-updates-data.js`) |
| `assets/app/js/pc-settings.js` | 상단 바 보기·링크·설정 단추와 설정 창(열람자·소리·효과·보기·링크) |
| `assets/app/js/pc-search.js` | 통합 검색(2026-09-25) — 상단 바 '검색' 단추·'/'·Ctrl(⌘)+K. 인물·세계 기록·세력·기록보관소·작전 지도·안내를 이름·별칭·약어·한글 역할·초성으로 찾는다. 목록은 올라온 데이터에서 처음 열 때 만든다 |
| `assets/js/data/terminal-fx-data.js` | 소리 이름→파일·음량, 화면 이동 사건, 작전·순례 소리, 새 채널 인계 문구, 기동 문구, 이상 신호·자리 비움·기념일 설정 |
| `assets/js/data/channel-hero-data.js` · `open-canon-data.js` · `community-guide-data.js` · `site-updates-data.js` · `share-index-data.js` | 채널 대표 그림, 자유 해석 목록, 입문 카드·자캐 설정 안내, 갱신 기록, 공유 주소 목록(생성) |
| `tools/build-share-stubs.mjs` | 인물·기록·세력·기록보관소 링크 미리보기 공유 페이지 `share/<p\|h\|f\|a>/<id>/` 생성 |
| `assets/app/js/pc-state.js` | 진행 상태 저장소 — `ProjectCurseOperationState`(부서진 왕관 판정), `ProjectCursePilgrimageState`(순례), `ProjectCurseVerdictArchiveState`(현장 판정 보관). 작전 지도가 쓰고 상황판·세계 기록이 읽는다. 옛 저장 키와 `projectcurse:*-change` 이벤트를 그대로 쓴다 |
| `assets/app/js/screens/<화면>.js` | 화면 모듈 |
| `assets/app/js/screens/manual-card.js` | `PCRegisterCard` — 현장 지침의 등록증 그림(1080×1350 PNG). 방문자 사진은 기기 메모리에서만 쓴다(네트워크 요청 없음) |
| `tools/verify-app.mjs` | 새 앱 검증 |

화면 파일 이름: `home`, `history`, `map`, `faction`, `archive`, `personnel`, `manual`.

### 여럿이 동시에 작업할 때

- `index.html`의 데이터 스크립트 목록에는 화면별 자리 표지가 있다: `<!-- slot:map-data -->`, `<!-- slot:faction-data -->`, `<!-- slot:archive-data -->`, `<!-- slot:personnel-data -->`, `<!-- slot:archive-modules -->`. 화면 전용 데이터 파일이나 모듈을 추가할 때는 **자기 표지 바로 아래에만** `<script>`/`<link>` 줄을 넣는다. 다른 곳은 고치지 않는다.
- 옛 화면 코드 안에 박혀 있던 설정 문장(세계관 내용)은 새 데이터 파일(`assets/js/data/<화면>-...-data.js`)로 옮긴다. 옮길 때 글자를 바꾸지 않고, 옛 화면이 보여주던 결과와 대조해 차이가 없음을 확인한다.
- 화면별 검사는 `tools/verify-app.d/<화면>.mjs`에 둔다. `default export` 함수가 `({add, read, context, app, historyIds, archiveIds, opIds})`를 받는다. `tools/verify-app.mjs` 본체는 고치지 않는다.

## 2. 화면 모듈 규약

```js
PCApp.screen({
  id: 'faction-info',            // 화면 id — 옛 주소와 같다
  mount(el, app) {},             // 처음 들어올 때 한 번. 정적 골격을 만든다
  show(parts, app, info) {},     // 들어올 때마다. parts는 주소의 세부 경로
  hide(app) {}                   // 떠날 때. 타이머·재생·리스너를 정리한다
});
```

- `info.reason`: `initial`(첫 로드), `push`(링크 이동), `pop`(뒤로·앞으로), `replace`, `same`.
- DOM은 `PCApp.h('div.tc-panel', {속성}, ...자식)`으로 만든다. 문자열 자식은 글자로만 들어간다. `innerHTML`은 쓰지 않는다. 데이터에 들어 있는 HTML 조각을 그대로 써야 하면 그 위치를 코드 주석에 적는다.
- 이동은 `<a href="${PCApp.href(화면, ...세부)}">` 링크로 만든다. 스크립트로 이동해야 하면 `PCApp.go()`. 목록으로 돌아가는 링크는 `PCApp.back(화면)`을 불러 스크롤 위치를 되살린다.
- 없는 id는 `PCApp.missing(코드, 키, 문장)`으로 알린다. 다른 항목으로 바꿔 열지 않는다.
- 제목은 `app.setTitle(글)`. 상세 화면의 제목 요소에 `data-tc-focus`를 달면 이동 뒤 초점이 간다.
- 화면 머리는 `PCApp.screenHead(id, {title, desc, meta})`. 채널 코드와 설명은 `channel-identity-data.js`에서 온다.
- 판정 태그는 `PCApp.tag(글, 톤, {latin, mark})`, 기록 판정 키의 톤은 `PCApp.verdictTone(키)`.
- 소리는 `window.PCAudio?.cue('사건')`. 사건 이름은 `audio-manifest.js`의 events(예: `operation.step`, `pilgrimage.danger`, `evidence.open`, `system.denied`)이고, 버스·게인·쿨다운·덕킹도 거기 있다. 음향은 기본 켜짐이고(2026-09-25) 꺼져 있으면 아무 일도 하지 않는다. 채널 이동·상세 열람·목록 복귀 소리는 `pc-audio.js`가 이미 낸다. 버튼에는 `data-tc-cue="사건"`을 달아 기본 접점음 대신 쓸 수 있다. 화면에서는 의미 있는 순간에만 부른다.
- 연출은 `pc-fx.js`와 `fx.css`가 맡는다. 화면이 따로 연출을 만들 때도 조작을 막지 않고 짧게 한다. 셸에는 글자를 가리는 손상 효과를 쓰지 않는다.

### 셸 공용 규칙 (2026-09-25) — 화면은 쓰기만 한다

- 효과 모드 `html[data-fx="full|reduced"]`: 움직임은 `html[data-fx="reduced"] …` 선택자로 멈춘다(`@media (prefers-reduced-motion)`를 쓰지 않는다 — 그러면 '효과: 전체'를 골라도 꺼진다). JS는 `PCApp.fx()`와 document의 `pc:fx` 이벤트. 줄임에서도 정보는 그대로다.
- 보기 밀도 `html[data-density="brief|full"]`(기본 brief): `.tc-full-only`는 간략 보기에서 숨는다. 겹친 영어 표지의 영어 쪽, 내부 식별 코드, 장식 수치에만 붙인다. 이름·소속·상태·날짜·본문·링크와 실제 운용 정보(DTG·좌표·호출부호·판정 태그·위협 등급)에는 붙이지 않는다.
- 위협 등급 `PCApp.threat(level)`: critical·high·elevated·guarded·low. 상세 화면 show()에서 데이터에 등급이 있을 때만 부른다. 셸이 이동마다 채널 기본값으로 되돌린다.
- 이상 신호 `data-tc-anomaly="name|count|text"`(+ `data-tc-anomaly-alt`): 화면당 1~4곳, 세계관상 판독이 흔들릴 만한 곳. 링크·버튼·제목·입력칸에는 붙이지 않는다.
- 몰입 재생 `html.tc-immersive`: 기록 영상 전체 화면 동안. 셸이 상단 바·레일을 숨긴다.
- 감식 보기: `.tc-evidence-media` 안의 그림(링크 밖)을 누르면 열린다. figure에 아는 값만 `data-dtg`·`data-place`·`data-coords`·`data-record`.
- 자유 해석 `PCApp.openCanon(목록)`: 자료는 `ProjectCurseOpenCanon`(정사 대장의 결정 대기만).
- 대표 그림: `PCApp.screenHead`가 `channel-hero-data.js`로 자동으로 그린다. 상세 화면은 `hero:false`.
- 링크 복사 `PCApp.copyLink()`, 알림 `PCApp.toast(글)`, 공유 주소 `PCApp.shareUrl()`.
- 열람자 호출부호(2026-09-25): 접속 확인 칸과 설정 창에서 정한다. 셸이 기동 줄(ACCESS)과 `PCApp.screenHead`의 `[data-tc-operator]` 줄에 글자로만 넣는다. 화면은 따로 그리지 않는다.
- 통합 검색(2026-09-25): 화면이 할 일은 없다. 데이터에 넣은 기록은 목록에 들어간다. 상세 주소로 이어지는 기록만 넣는다.

### 주소

| 주소 | 화면 |
|---|---|
| `#terminal-home`, `#terminal-home/intro`, `#terminal-home/guide` | 상황판(옛 이름 단말 상태), 입문 카드, 자캐 설정 안내 |
| `#history`, `#history/<기록 id>` | 세계 기록 |
| `#map-room`, `#map-room/op/<작전 id>`, `#map-room/incident/<사건 id>`, `#map-room/synchrony/<관측 id>`, `#map-room/pilgrimage/<id>`, `#map-room/region/<권역 id>` | 작전 지도(옛 이름 상황 관제) |
| `#faction-info`, `#faction-info/<세력 키>` | 세력 분석 |
| `#archive-entry`, `#archive-entry/<기록 id>` | 기록보관소 |
| `#personnel`, `#personnel/<인물 id>` | 인물 기록 |
| `#field-manual`, `#field-manual/register` | 현장 지침(옛 이름 교전 교범), 등록 양식·등록증으로 바로 가기 |
| `#media-audit` | 매체 검수 |

옛 주소 `#faction-relation`, `#region-map`, `#zone-map`, `#operation-map`은 셸이 새 화면으로 잇는다. 옛 딥링크 속성(`data-uac-route` + `data-uac-history-record` 등)도 셸이 새 주소로 바꾼다.

## 3. 공용 부품

| 부품 | 쓰임 |
|---|---|
| `.tc-panel` + `.tc-bracket`(`--evidence`, `--danger`, `--occult`) | 패널, 주 패널의 조준경 모서리 |
| `.tc-panel-head`, `.tc-panel-body`, `.tc-section`, `.tc-section-head` | 머리·본문·절 |
| `.tc-label`, `.tc-code` | 좁은 대문자 라벨, 고정폭 코드 |
| `.tc-tag--ok / info / evidence / caution / danger / occult / dim / dotted` | 판정·상태 태그 |
| `.tc-btn`(`--primary` 화면당 하나, `--caution`, `--danger`), `.tc-btnrow` | 버튼 |
| `.tc-seg` + `aria-pressed` | 필터 |
| `.tc-rows` / `.tc-row`(시각 · 본문 · 판정 · 이동) | 행 목록 |
| `.tc-kv` | 증거 파일 표지, 운용 수치 |
| `.tc-log`(`--occult`), `li.is-contact`, `li.is-loss` | 교신·현장 기입 |
| `.tc-phase` | 작전 경과(투입·접촉·교전·이탈) |
| `.tc-note--caution / danger / occult / evidence` | 주석·경고 |
| `.tc-redact` | 가림 막대 |
| `.tc-sensor` + `.is-mismatch` | 센서 불일치 판독 |
| `.tc-evidence` | 사진·영상 증거 틀(손상 연출은 여기서만) |
| `.tc-disclosure` | 펼침 |
| `.tc-missing` | 없는 키 알림 |

- 화면 CSS에서 공용 부품의 색·모양을 바꾸지 않는다. 필요하면 화면 전용 클래스를 만든다. 접두어는 `tc-home-`, `tc-hist-`, `tc-map-`, `tc-fac-`, `tc-arc-`, `tc-per-`.
- 칸 사이 1px 선은 칸의 `box-shadow: 0 0 0 1px var(--line)`으로 그린다. 부모 배경으로 칠하면 빈 칸이 회색 덩어리로 남는다.

## 4. 색과 모양

- 색은 `tokens.css`만 쓴다. 기본값(`--red`)은 선·면용, `-ink` 변형(`--red-ink`)은 글자용이다.
- 빨강은 단말 강조(포커스, 적색 채널)와 위험·봉인·상충에, 핏빛(`--blood`)은 교단·오컬트에만 쓴다. 셸의 강조는 화면 강조색 `--ch`(옛 5.54 채널색, 2026-09-25).
- 모서리 최대 2px, 번짐 있는 그림자·글자 그림자 금지(`verify-app`이 검사 — 번짐은 그라데이션으로), 작은 반응 150~250ms. 움직임은 `html[data-fx="reduced"]`에서 멈춘다.
- 글자를 가리는 손상 효과(스캔선·노이즈·가림)는 증거 층에만 쓴다. 셸의 붉은 분위기·바탕 결·위협 가장자리·신호 띠는 글자를 가리지 않는다.
- 가장 작은 글자는 11px, 한국어 본문은 15px 이상. 탭 영역 40px 이상.

## 5. 화면별 요구

### 상황판 `terminal-home` — 완료(Claude)
2026-09-25 재구성: 화면 머리 → 처음 온 사람 바로가기(입문 카드·자캐 설정 안내·자캐 등록증 만들기) → 보관함 쪽지와 키아트(신호 복구·레이더, 옛 5.54처럼 '이상한 것 하나'부터) → 긴급 경보(요약, 작전 정보는 접음)·최근 들어온 신호 → 지난 방문 이후 → 사건부터 읽기 → 접은 판(귀환 신호 접촉 보고, 민간 재난 방송, 작전 기록). 하위 쪽 입문 카드·자캐 설정 안내(`community-guide-data.js`).
- 현재 경보와 최근 수신은 진행 상태를 따른다. 우선순위: 미열람 판정 기록 → 저장된 작전 판정 → 정보 회수 진행 → 기본 경보. 수신 첫 네 행은 부서진 왕관·불빛 없는 성채·귀환 심사·전진 회수 채널이다. 봉인 작전은 필요한 판정 사본이 보관되면 풀린다.
- 민간 재난 방송은 이미 있는 민간 규칙(경보색·창문 봉인·기억 대조·배급·통행 서류·장례)만 방송 문안으로 쓴다. 경보색 뜻은 `Civil_Child_Drill` 표에서 읽는다.
- 문구와 기록선은 `home-screen-data.js`에 있다.

### 세계 기록 `history` — 완료(Claude)
목록(네 전환점, 참고 묶음 3종, 시대 필터, 판정 범례·미해결 설정, 시대별 기록)과 사건 기록(증거 파일 표지, 근거와 한계, 본문 조각, 교단 상충 기록, 관련 기록, 이전·다음).

### 현장 지침 `field-manual` — 완료(Claude, 옛 이름 교전 교범)
새 설정을 쓰지 않는다. N.H.C 현장 교범(`NHC_Manual_891219`)과 세계 기본 규칙을 투입 전 참조판으로 다시 배치한다: 첫 원칙, 철수 조건 판정기, 접촉과 교전, 표식 체계, 진입 전 준비·이동, 장비군, 능력과 대가, 현장 편성과 인계, 현장 인원 등록 양식(글 양식 복사 + 등록증 그림 PNG 저장. 2026-09-25 사용자 결정 — 사진은 기기 안에서만 쓰고, 그림에 '교류용·공식 기록 아님' 줄을 넣는다). 교범 문장은 절 제목으로 찾아 읽고, 절 제목은 `verify-app`이 검사한다.

### 상황 관제 `map-room` — Codex
- 데이터: `ProjectCurseMapRoom`(viewBox, geography, regions, zones, routes, synchronyEvents, markers, drilldowns, operations), `ProjectCurseRegionalDrilldown`, `ProjectCurseIncidentNetwork`, `map-signal-index-data.js`, `pilgrimage-scenario-data.js`.
- 전술 상황판이다. SVG 지도, 격자와 좌표, 설명은 측면 패널. 2026-09-25: 확대·이동, 연도 막대, 작전 부호 틀, 관측 불가 안개, 관측점 신호 흐름, 지점 사진 미리보기(아트 가이드 10절).
- 표식은 전술 지도 기호처럼 기하 도형으로 그린다. 아군 사각형, 적대 마름모, 미상 사엽형. 사건·시설 등 나머지 종류도 도형을 정하고 범례를 둔다.
- **작전 경과 재생**: `operation.steps`를 단계별로 보여준다. 단계마다 시각, 제목, 기입, 이동 경로(`route`), 부대 위치와 상태(`units[].status`: normal·unstable·split·unknown). 이전·다음 단계, 재생·정지, 키보드 조작. 자동 재생은 모션 감소 설정에서 끈다. 부대 상태는 모양과 색을 함께 바꾼다(unstable 앰버, split 적색, unknown 미상 사엽형).
- 측면 패널: 작전 표지(code, classification, status, directive, objectives), 현재 단계 기입, 관련 기록 링크.
- 사건 위치, 2042 동시 관측, 순례 경로, 권역 상세도 등 옛 화면의 기능은 기능 조사 보고서를 기준으로 빠짐없이 옮긴다.

### 세력 분석 `faction-info` — Codex
- 데이터: `ProjectCurseFactionAnalysis`(세력 문서 17개, 편제 묶음), `ProjectCurseFactionMarks`, `ProjectCurseFactionLineage`, `ProjectCurseCanon.factions`, `ProjectCurseIncidentNetwork`.
- 목록은 편제표다. 묶음별로 세력을 나열하고, 세력 문양은 증거판(증거 번호, 문양, 판정)에 올린다.
- 세력 문서: 표지(문양판, 분류, 위협·관계 태그) → 본문 절 → 연결 세력 → 관련 사건(연표·지도 링크).
- 없는 세력 키는 `PCApp.missing`으로 알린다. 다른 세력 문서로 열지 않는다.

### 기록보관소 `archive-entry` — Codex
- 데이터: `ProjectCurseArchive.publicRecords`(15건), `ProjectCurseArchiveDocuments.documents`, `visual-evidence-data.js`, `media-manifest.js`, `media-provenance-data.js`, `field-dossier-data.js`, 기록 영상 데이터(`immortality-storyboard.js`, `feral-cinematic-data.js`, `sakuma-cinematic-data.js`).
- 색인: 증거 목록(증거 코드, 형식, 분류, 날짜, 위험도, 출처 판정), 검색, 분류 필터.
- 뷰어는 증거 파일이다. 증거 번호, 보안 등급, 출처, 인계 기록, 관련 작전·세력, 첨부, 판정 주석을 표지에 둔다.
- **보호 기록 두 건**: `#tc-vault` 안의 `article` 노드를 뷰어로 옮겨 보여주고, 닫을 때 되돌린다. HTML을 고치지 않는다. 안의 `page-tab`·`sub-tab` 전환은 클래스·`hidden` 토글로 구현한다. 스타일은 뷰어 범위 선택자로만 입힌다.
- 영상 기록(Cults, Immortality, Ferals, Sakuma)은 옛 매체 손상 연출을 유지한다(증거 층). 2026-09-25: 화면 전체 몰입 재생(`html.tc-immersive`)과 옛 음량을 되살렸다.

### 인물 기록 `personnel` — Codex
- 데이터: `ProjectCursePersonnel`, `ProjectCursePersonnelProfiles`, `ProjectCursePersonnelRemake`.
- 명부는 편제표다. 이름·호출부호, 소속, 상태, 기준 연도(2006). 필터와 검색.
- 인물 파일: 사진판(있으면), 경력, 관련 사건, 관련 세력·기록 링크.

### 매체 검수 `media-audit` — 보조
`media-provenance-data.js`, `media-manifest.js`를 표로 보여준다. 채널 레일에는 넣지 않는다.

## 6. 검증

- `node tools/verify-app.mjs` 전부 통과. 새 화면을 만들면 그 화면의 데이터 무결성·이동 대상 검사를 추가한다.
- `node tools/verify-data.mjs`(데이터·정사·매체) 전부 통과. 옛 `verify-package.mjs`는 2026-09-24 교체와 함께 은퇴했다.
- 옛 문서 주소 안내 페이지는 `node tools/build-docs-stubs.mjs --check`로 생성 결과와 같은지 본다.
- 공유 페이지는 `node tools/build-share-stubs.mjs --check`로 생성 결과와 같은지 본다(verify-app의 share-stubs-current).
- 브라우저: `.claude/launch.json`의 `project-curse`(4173) → `http://localhost:4173/index.html#<화면>`. 기동 없이 보려면 `?boot=skip`.
  - 효과 모드 두 가지로 본다: 자동(기기 설정)과 설정 창의 '효과: 전체'. 이 작업 PC는 Windows 애니메이션 효과가 꺼져 있어 자동이면 줄임이다.
  - 데스크톱 1280px, 모바일 375px, 가로 넘침 없음
  - 목록 → 상세 → 뒤로 가기 왕복, 다른 화면으로 나갔다 돌아오기
  - 키보드 탭 이동과 초점 표시, 효과 줄임에서 움직임이 멈추는지, 간략·전체 보기, 콘솔 오류 0
  - 같은 페이지에서 해시만 바꾸면 스크립트가 다시 로드되지 않는다. 파일을 고친 뒤에는 새로고침한다.
