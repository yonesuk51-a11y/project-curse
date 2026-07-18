# Project Curse Structure — 5.15.2ck

## 활성 소유권

| 책임 | 단일 기준 파일 |
|---|---|
| 화면·잠금 기록·오디오 자산 목록 | `assets/js/data/site-manifest.js` |
| 조직 정사·관계·우시노다 계층 | `assets/js/data/canon-registry.js` |
| 공개 기록 목록·영상/문서 분류 | `assets/js/data/archive-registry.js` |
| 기존 영상 기록 렌더러와 보호 본문 | `assets/js/main.js` |
| 메뉴·기록 오디오 상태 | `assets/js/core/menu-audio-runtime.js` |
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

`site-manifest.js`, `canon-registry.js`, `faction-analysis-data.js`, `archive-registry.js`가 먼저 로드된다. `main.js`가 보호된 영상 기록 런타임을 준비한 뒤 오디오 관리자, 기록 색인, 세계 연표, 세력 분석실과 QA 모듈이 각 화면을 소유한다.

활성 화면은 `terminal-home`, `history`, `faction-info`, `archive-entry` 네 개다. 폐기된 `region-map`과 `faction-relation`은 DOM을 만들지 않으며 옛 주소만 현행 화면으로 전환한다.

## 잠금 범위

- 인라인: `index.html` 안의 `Cults_871104`, `Immortality_860201` article
- 독립: `docs/Cults_871104/index.html`, `docs/Immortality_860201/index.html`
- 정합화 모듈은 두 인라인 article의 DOM을 명시적으로 제외한다.
- 패키지 검증기는 인라인·독립 네 범위의 SHA-256을 비교한다.

## 남은 구조 부채

`assets/js/main.js`에는 보호 기록과 얽힌 과거 fallback 코드가 남아 있다. 화면에 다시 나타나는 경로는 차단했지만, 일괄 삭제는 영상 기록 회귀 가능성이 있어 후속 분리 작업으로 남긴다.
