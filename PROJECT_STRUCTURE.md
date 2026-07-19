# Project Curse Structure — 5.15.2cs

## 활성 소유권

| 책임 | 단일 기준 파일 |
|---|---|
| 화면·잠금 기록·오디오 자산 목록 | `assets/js/data/site-manifest.js` |
| 조직 정사·관계·우시노다 계층 | `assets/js/data/canon-registry.js` |
| 공개 기록 목록·영상/문서 분류 | `assets/js/data/archive-registry.js` |
| 루트 상단바·단말 허브·화면 이동 | `assets/css/app-shell.css` + `assets/js/core/app-shell.js` |
| 부팅·공통 오디오 버스 | `assets/js/core/base-runtime.js` |
| 영상 기록 공통 재생 엔진과 보호 본문 | `assets/js/core/record-cinematic-runtime.js` |
| 영상 기록 등록·조회 | `assets/js/core/record-cinematic-registry.js` |
| 종교 영상 설정 | `assets/js/pages/cinematic-cults.js` |
| 불멸을 향해 영상 설정 | `assets/js/pages/cinematic-immortality.js` |
| 괴이 영상 설정 | `assets/js/pages/cinematic-ferals.js` |
| 사쿠마의 테이프 영상 설정 | `assets/js/pages/cinematic-sakuma.js` |
| 공통 중복 연결 정리 | `assets/js/pages/shared-declutter.js` |
| 비보호 화면 명칭 정합화 | `assets/js/pages/canon-reconciliation.js` |
| 영상/문서 기록 색인 | `assets/js/pages/archive-consolidation.js` |
| 세계 사건 연표 | `assets/js/pages/world-history.js` |
| 세력 분석실 | `assets/js/pages/faction-analysis.js` |
| 5.15.2ce 범위 스타일 | `assets/css/stabilization.css` |
| 5.15.2cf 기록철 목록·상세 스타일 | `assets/css/archive-consolidation.css` |

## 데이터 흐름

`site-manifest.js`, `canon-registry.js`, `faction-analysis-data.js`, `archive-registry.js`가 먼저 로드된다. 영상 데이터 다음에 `record-cinematic-registry.js`와 기록별 설정 네 개가 등록되고, 공통 재생 엔진과 단일 앱 셸이 차례로 초기화된다. 이후 기록 색인, 세계 연표와 세력 분석실이 각 화면을 소유한다.

활성 화면은 `terminal-home`, `history`, `faction-info`, `archive-entry` 네 개다. 폐기된 `region-map`과 `faction-relation`은 DOM을 만들지 않으며 옛 주소만 현행 화면으로 전환한다.

단말 상태의 허브 버튼 세 개가 화면 이동을 소유한다. PC와 모바일은 같은 DOM과 같은
`click` 경로를 사용하며 모바일에서는 버튼만 한 열로 배치한다. 사이드 메뉴, 서랍,
배경막과 본문 이동용 `margin`·`transform`은 존재하지 않는다.

화면 전환 시 선택 화면의 `inert`와 `aria-hidden`을 같은 이벤트 안에서 해제한다.
비활성 화면에는 두 속성을 함께 적용하고, 각 하위 화면에는 단말 상태 복귀 버튼을 붙인다.

## 잠금 범위

- 인라인: `index.html` 안의 `Cults_871104`, `Immortality_860201` article
- 독립: `docs/Cults_871104/index.html`, `docs/Immortality_860201/index.html`
- 정합화 모듈은 두 인라인 article의 DOM을 명시적으로 제외한다.
- 패키지 검증기는 인라인·독립 네 범위의 SHA-256을 비교한다.

## 런타임 소유권

- `assets/js/core/app-shell.js`: 단말 허브와 화면 이동의 유일한 소유자다.
- `assets/js/core/base-runtime.js`: 부팅과 메뉴 환경음·기록 효과음 버스만 담당한다.
- `assets/js/core/record-cinematic-runtime.js`: 루트 영상 기록 재생만 담당한다.
- `assets/js/main.js`: 보호된 독립 문서의 기존 동작을 위해 파일로만 유지하며 루트에서는 로드하지 않는다.

종교와 불멸을 향해의 페이지 원본은 보호 해시를 지키기 위해 공통 엔진 내부의 읽기 전용 소스로 유지한다. 기록별 영상·음향·마운트 설정과 페이지 공급 책임은 각각의 모듈이 소유한다.
