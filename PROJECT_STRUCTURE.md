# Project Curse Structure — 5.15.2cm

## 활성 소유권

| 책임 | 단일 기준 파일 |
|---|---|
| 화면·잠금 기록·오디오 자산 목록 | `assets/js/data/site-manifest.js` |
| 조직 정사·관계·우시노다 계층 | `assets/js/data/canon-registry.js` |
| 공개 기록 목록·영상/문서 분류 | `assets/js/data/archive-registry.js` |
| 영상 기록 공통 재생 엔진과 보호 본문 | `assets/js/main.js` |
| 영상 기록 등록·조회 | `assets/js/core/record-cinematic-registry.js` |
| 종교 영상 설정 | `assets/js/pages/cinematic-cults.js` |
| 불멸을 향해 영상 설정 | `assets/js/pages/cinematic-immortality.js` |
| 괴이 영상 설정 | `assets/js/pages/cinematic-ferals.js` |
| 사쿠마의 테이프 영상 설정 | `assets/js/pages/cinematic-sakuma.js` |
| 메뉴·기록 오디오 상태 | `assets/js/core/menu-audio-runtime.js` |
| 모바일 메뉴 단일 경로 처리·초기 단말 화면 | `assets/js/main.js` + `assets/js/core/menu-audio-runtime.js` |
| 공통 중복 연결 정리 | `assets/js/pages/shared-declutter.js` |
| 비보호 화면 명칭 정합화 | `assets/js/pages/canon-reconciliation.js` |
| 영상/문서 기록 색인 | `assets/js/pages/archive-consolidation.js` |
| 세계 사건 연표 | `assets/js/pages/world-history.js` |
| 세력 분석실 | `assets/js/pages/faction-analysis.js` |
| 구조·정사·보호 범위 브라우저 검사 | `assets/js/qa/structure-qa.js` |
| 5.15.2ce 범위 스타일 | `assets/css/stabilization.css` |
| 5.15.2cf 기록철 목록·상세 스타일 | `assets/css/archive-consolidation.css` |
| 배포 전 정적 패키지 검사 | `tools/verify-package.mjs` |

## 데이터 흐름

`site-manifest.js`, `canon-registry.js`, `faction-analysis-data.js`, `archive-registry.js`가 먼저 로드된다. 영상 데이터 다음에 `record-cinematic-registry.js`와 기록별 설정 네 개가 등록되고, `main.js`의 공통 재생 엔진이 해당 등록 정보만 조회한다. 이후 오디오 관리자, 기록 색인, 세계 연표, 세력 분석실과 QA 모듈이 각 화면을 소유한다.

활성 화면은 `terminal-home`, `history`, `faction-info`, `archive-entry` 네 개다. 폐기된 `region-map`과 `faction-relation`은 DOM을 만들지 않으며 옛 주소만 현행 화면으로 전환한다.

모바일 메뉴 링크는 `pointerdown`에서 현재 화면과 주소를 먼저 갱신하고, 같은 터치에서 발생하는 후속 `pointerup`·`click`은 중복 경로 전환으로 처리하지 않는다. v3 이전 모바일 라우터는 레이아웃 클래스만 유지하고 입력 이벤트는 소유하지 않는다.

## 잠금 범위

- 인라인: `index.html` 안의 `Cults_871104`, `Immortality_860201` article
- 독립: `docs/Cults_871104/index.html`, `docs/Immortality_860201/index.html`
- 정합화 모듈은 두 인라인 article의 DOM을 명시적으로 제외한다.
- 패키지 검증기는 인라인·독립 네 범위의 SHA-256을 비교한다.

## 격리한 구조 부채

`assets/js/main.js`에 남은 5.15.2bw~5.15.2ca 지도·관계도·장비 확장 블록은 현행 v3 구조에서 즉시 종료된다. 현재 화면이나 데이터에 개입하지 않으며, 보호 기록 회귀 없이 물리 삭제할 수 있도록 경계를 명시해 두었다.

종교와 불멸을 향해의 페이지 원본은 보호 해시를 지키기 위해 공통 엔진 내부의 읽기 전용 소스로 유지한다. 기록별 영상·음향·마운트 설정과 페이지 공급 책임은 각각의 모듈이 소유한다.
