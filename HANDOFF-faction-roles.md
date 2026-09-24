# 세력 약어의 한글 역할 표시 인계

- 작업: B-3, 2026-09-25.
- 작업 트리: `C:\Users\FORYOUCOM\.pcwt\codex-atm-b`.
- 현재 브랜치: `codex/faction-roles`.
- 기준 커밋: `237937ffa0015d7fa4e42bb45f62ecb158aa3805` — 사용자 승인 세력·장소 이름 정리.
- 반영 대상: `#faction-info` 목록과 `#faction-info/<세력 키>` 상세의 이름 표시.
- 커밋 상태: 미커밋. 현재 세션에서 Git 메타데이터가 읽기 전용이다. 자세한 경로는 아래에 적었다.

## 바꾼 파일과 위치

| 파일·줄 | 바꾼 내용 |
|---|---|
| `assets/app/js/screens/faction.js:36–39` | `factionName()`이 세력 데이터의 `roleLabel`을 읽어 이름 뒤에 작은 역할 요소를 만든다. 역할 값이 없으면 이름만 남긴다. |
| `assets/app/js/screens/faction.js:77` | 목록 카드의 이름과 역할을 같은 제목 요소 안에 표시한다. |
| `assets/app/js/screens/faction.js:127–132` | 교단 갈래와 연결선 양끝의 세력 이름에도 같은 표시 규칙을 쓴다. 현재 이 갈래의 세력에는 역할 값이 없어 표시 결과는 기존과 같다. |
| `assets/app/js/screens/faction.js:207` | 상세 머리의 이름 뒤에 역할을 표시한다. |
| `assets/app/js/screens/faction.js:216` | 주요 관계 바로가기의 링크 글자에 대상 세력의 이름·역할·관계명을 함께 넣는다. 문구 전체를 한 요소에 넣어 단추 안에서 문장처럼 줄바꿈할 수 있게 한다. |
| `assets/app/js/screens/faction.js:235` | 다른 세력과의 관계 목록에도 링크 안에 이름과 역할을 함께 표시한다. |
| `assets/app/css/screens/faction.css:12` | `.tc-fac-role`에 기존 본문 글꼴, 작은 글자 크기, 보조 글자색을 적용한다. 한글 단어 중간의 줄바꿈을 막는다. |
| `tools/verify-app.d/faction.mjs:46–97` | 승인된 역할 아홉 개, 목록·상세 표시, 역할이 없는 세력, 관계 링크의 낭독 문구를 검사한다. |
| `index.html:39`, `index.html:160` | `stamp-assets.mjs`가 세력 CSS·JS 두 주소의 내용 해시만 갱신했다. |
| `HANDOFF-faction-roles.md` | 이 인계 메모. |

## 표시하는 역할

화면에 역할 문구를 따로 하드코딩하지 않고 `assets/js/data/faction-analysis-data.js`의 값을 읽는다. 검사에서는 사용자 승인 값과 대조한다.

| 키 | 이름 | 역할 |
|---|---|---|
| `uac` | U.A.C | 조정 기관 |
| `nhc` | N.H.C | 현장 전투군 |
| `sid` | S.I.D | 도시 추적대 |
| `fhc` | F.H.C | 기업권 |
| `syndicate` | S.O.N | 이용파 연합 |
| `haimun` | P.O.H | 범죄조직 |
| `ashcrew` | Ash Crew | 사후 대응조 |
| `arf` | A.R.F | 회수조 |
| `cpd` | C.P.D | 민간 분리조 |

우시노다교·혈교 등 나머지 여덟 세력에는 역할이나 빈 역할 요소를 만들지 않는다. 데이터와 기록 본문은 수정하지 않았다.

## 옛 화면과 대응

아래 옛 파일은 모두 `tools/fixtures/legacy-app/assets/js/pages/faction-analysis.js`다. 이 작업은 세력 이름 표시를 보완한다. 새 등장 효과나 효과음은 추가하지 않았다.

| 옛 파일·줄 | 새 파일·줄 | 대응 |
|---|---|---|
| `tools/fixtures/legacy-app/assets/js/pages/faction-analysis.js:61` | `assets/app/js/screens/faction.js:77` | 목록의 이름과 요약. 이름에 등록된 역할을 덧붙인다. |
| `tools/fixtures/legacy-app/assets/js/pages/faction-analysis.js:214` | `assets/app/js/screens/faction.js:207` | 상세 머리의 세력 이름. 이름과 역할을 함께 읽는다. |
| `tools/fixtures/legacy-app/assets/js/pages/faction-analysis.js:190` | `assets/app/js/screens/faction.js:216` | 주요 관계 바로가기. 링크 문구에 역할도 포함한다. |
| `tools/fixtures/legacy-app/assets/js/pages/faction-analysis.js:78` | `assets/app/js/screens/faction.js:235` | 다른 세력과의 관계. 대상 이름 뒤에 역할을 붙인다. |
| `tools/fixtures/legacy-app/assets/js/pages/faction-analysis.js:159` | `assets/app/js/screens/faction.js:127` | 교단 갈래의 세력 이름. 역할이 있는 경우에만 추가한다. |
| `tools/fixtures/legacy-app/assets/js/pages/faction-analysis.js:164` | `assets/app/js/screens/faction.js:130–132` | 갈래 연결선 양끝의 이름. 기존 연결과 판정을 유지한다. |

## 간략 보기와 움직임 줄이기

- 이번 작업에서 간략 보기에 새로 숨긴 요소는 없다. 역할 요소와 그 상위 이름 요소에 `.tc-full-only`를 붙이지 않았다.
- 이름·한글 역할·분류·상태·날짜·본문·관계·링크·판정 등급은 기존 화면에서 계속 읽을 수 있다.
- 기존에 전체 보기로 제한한 영문 절 표지, 문양 표시 순번, 묶음별 문서 수, 상세 내부 키, 채널 부가 수치는 그대로다.
- 역할은 실제 DOM 글자이며 관계 링크 안에 들어간다. 별도 `aria-label`이나 `aria-hidden`으로 이름과 역할을 가리지 않는다.
- CSS와 기존 움직임 검사는 이미 `html[data-fx="reduced"]`를 사용한다. 역할 표시에는 움직임이나 새 이벤트·타이머가 없다.

## 확인한 것

- 최종 코드에서 `node tools/verify-app.mjs`: **149/149 통과**, 종료 코드 0.
- 최종 코드에서 `node tools/verify-data.mjs`: **356/356 통과**, 종료 코드 0.
- `git diff --check`: 통과. Git의 LF→CRLF 정규화 안내 외에 공백 오류는 없다.
- 새 검사 `faction:nine-approved-role-labels`: 역할을 가진 세력이 정확히 아홉이고 승인된 값과 일치한다.
- 새 검사 `faction:role-labels-list-and-detail-execution`: 실제 `PCApp.h()`를 쓰는 격리 실행 환경에서 간략·전체 속성을 각각 지정하고, 목록과 상세의 17개 세력 이름을 검사한다. 아홉 역할의 존재와 나머지 여덟 세력의 역할 요소 부재, 숨김 속성·클래스 부재, 원문 데이터 불변, 이벤트·타이머 정리를 확인했다.
- 새 검사 `faction:role-labels-in-related-links-execution`: 17개 상세에 있는 모든 세력 링크가 실제 문서로 이어지고, 링크 글자의 처음에 대상 이름과 등록된 역할이 함께 있는지 확인했다. 아홉 역할 모두 관계 링크에서 검사됐다.
- 기존 보호 원문·세력 본문·없는 키 표시·선택적 셸 기능 검사도 통과했다. 셸 구현 누락에 따른 실패 항목은 없다.
- `index.html` 차이는 CSS·JS 주소 해시 두 곳뿐이다. 최종 주소는 `faction.css?v=6.0.0-8b65af6c`, `faction.js?v=6.0.0-c9ffcd7f`다.

## 확인하지 못한 것과 커밋 상태

- 실제 브라우저의 1280px·375px 배치, 가로 넘침, 목록→상세→뒤로 가기와 다른 화면 왕복, 키보드 포커스 표시, 효과 모드 전환, 콘솔 오류 수는 확인하지 못했다.
- 브라우저 도구의 현재 목록은 `apps: []`, `browsers: []`였고, 로컬 `index.html#faction-info`를 인앱 브라우저로 열려 하자 `Browser is not available: iab`가 반환됐다. 로컬 Playwright 모듈 불러오기도 모듈 내보내기 오류로 실패했다.
- 화면 낭독기의 실제 음성 출력도 미확인이다. 링크 DOM 글자와 숨김 속성 검증을 실제 낭독·브라우저 표시 검증으로 간주하지 않는다.
- 현재 브랜치는 `codex/faction-roles`다. `.git` 파일은 `C:/Users/FORYOUCOM/OneDrive/문서/GitHub/project-curse/.git/worktrees/codex-atm-b`를 가리킨다. Git 메타데이터는 현재 세션에서 읽기 전용이고 쓰기 허용 작업 트리 밖에 있다. 요청의 예외에 따라 스테이징·커밋을 수행하지 않고 다섯 변경 파일을 작업 트리에 남겼다.

## 셸 담당자에게

- 이 역할 표시에 필요한 셸 변경이나 새 API는 없다. 기존 밀도·효과 규칙을 그대로 쓴다.
- 병합 뒤 브라우저에서 간략·전체 보기의 목록 및 상세 머리, 긴 관계 바로가기의 모바일 줄바꿈, 링크 포커스와 낭독을 확인한다.
- 여러 화면 변경을 병합한 최종 트리에서는 `node tools/stamp-assets.mjs`를 실행해 주소 해시를 합치고 두 검증 명령을 실행한다. 이 작업의 사이트 반영 범위는 세력 화면 JS·CSS와 그 주소 해시다.
