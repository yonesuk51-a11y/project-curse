# Project Curse Structure — 5.15.2cf

## 활성 소유권

| 책임 | 단일 기준 파일 |
|---|---|
| 화면·잠금 기록·오디오 자산 목록 | `assets/js/data/site-manifest.js` |
| 조직 정사·관계·우시노다 계층 | `assets/js/data/canon-registry.js` |
| 대표 기록철·세부 문서 소속 | `assets/js/data/archive-registry.js` |
| 기존 화면 렌더러와 기록 본문 | `assets/js/main.js` |
| 메뉴·기록 오디오 상태 | `assets/js/core/menu-audio-runtime.js` |
| 공통 태그·중복 연결 정리 | `assets/js/pages/shared-declutter.js` |
| 비잠금 화면 명칭·타일 정합화 | `assets/js/pages/canon-reconciliation.js` |
| 기록보관소 대표 기록철 통합·전환 | `assets/js/pages/archive-consolidation.js` |
| 구조·정사·보호 범위 브라우저 검사 | `assets/js/qa/structure-qa.js` |
| 5.15.2ce 범위 스타일 | `assets/css/stabilization.css` |
| 5.15.2cf 기록철 목록·상세 스타일 | `assets/css/archive-consolidation.css` |
| 배포 전 정적 패키지 검사 | `tools/verify-package.mjs` |

## 데이터 흐름

`site-manifest.js`, `canon-registry.js`, `archive-registry.js`가 먼저 로드되고, 기존 `main.js`의 활성 세력·관계 렌더러가 해당 데이터를 읽는다. 이후 오디오, 공통 정리, 표기 정합화, 기록철 통합, QA 모듈이 순서대로 붙는다.

## 잠금 범위

- 인라인: `index.html` 안의 `Cults_871104`, `Immortality_860201` article
- 독립: `docs/Cults_871104/index.html`, `docs/Immortality_860201/index.html`
- 정합화 모듈은 두 인라인 article의 DOM을 명시적으로 제외한다.
- 패키지 검증기는 인라인·독립 네 범위의 SHA-256을 비교한다.

## 남은 구조 부채

`assets/js/main.js`에는 과거 패치의 fallback 데이터와 렌더러가 누적되어 있다. 5.15.2cf에서는 대표 기록철이 구형 카드 렌더러보다 우선하도록 정리했지만, 잠금 기록 보호와 회귀 위험 때문에 구형 코드를 일괄 삭제하지 않았다. 다음 패스에서 관계도·세계지도 렌더러를 단계적으로 분리한다.
