# Project Curse Structure — 5.23.2

## 활성 소유권

| 책임 | 단일 기준 파일 |
|---|---|
| 빌드 버전·화면 명칭과 순서 | `assets/js/data/build-info.js` |
| 잠금 기록·런타임 소유권 목록 | `assets/js/data/site-manifest.js` |
| 조직 정사·관계·우시노다 계층 | `assets/js/data/canon-registry.js` |
| 공개 기록 목록·영상/문서 분류 | `assets/js/data/archive-registry.js` |
| 대흑림·데드존·순례 규칙·부서진 왕관 문서 | `assets/js/data/field-dossier-data.js` |
| 홈 실시간 경보·최근 수신 구성 | `assets/js/data/home-intelligence-data.js` |
| 루트 상단바·단말 허브·화면 이동 | `assets/css/app-shell.css` + `assets/css/terminal-foundation.css` + `assets/js/core/app-shell.js` |
| 부팅 시퀀스 | `assets/js/core/loading-sequence.js` |
| 공통 오디오 자산과 기본 환경음 | `assets/js/core/base-runtime.js` |
| 의미 기반 재생·프로필·덕킹·중첩 제한 | `assets/js/core/audio-controller.js` |
| 화면별 음향 프로필·효과음 사건 목록 | `assets/js/data/audio-manifest.js` |
| 부서진 왕관 정보 회수·판단·지도 단계 저장 | `assets/js/core/operation-state.js` |
| 순례 시나리오·선택지·결말 데이터 | `assets/js/data/pilgrimage-scenario-data.js` |
| 순례 진행·공포·오염·신호·결말 저장 | `assets/js/core/pilgrimage-state.js` |
| 순례 진입·현장 판단·결과 화면 | `assets/js/pages/pilgrimage-scenario.js` + `assets/css/pilgrimage-scenario.css` |
| 채널별 전환 설정 | `assets/js/data/transition-manifest.js` |
| 공통 사건·권역·작전 연결 | `assets/js/data/incident-registry.js` |
| 화면 퇴장·채널 교체·진입 상태 머신 | `assets/js/core/transition-controller.js` |
| 공통 전환·화면별 정체성 스타일 | `assets/css/transition-system.css` |
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
| 관제지도 설정 자료 | `assets/js/data/map-room-data.js` |
| 대흑림·데드존 구역·지점·경로 위험·순례 규칙 | `assets/js/data/regional-drilldown-data.js` |
| 지역 상황도·경로 강조·전술 레이어·작전지도 | `assets/js/pages/map-room.js` + `assets/css/map-room.css` |
| 홈 통계·경보·직접 연결 | `assets/js/pages/terminal-home.js` + `assets/css/terminal-foundation.css` |
| 원본·보정·복원 이미지 정책 | `ASSET_POLICY.md` |
| 신규 복원 추정 이미지 출처 대장 | `assets/resources/ASSET_REGISTRY.md` |
| 5.15.2ce 범위 스타일 | `assets/css/stabilization.css` |
| 5.15.2cf 기록철 목록·상세 스타일 | `assets/css/archive-consolidation.css` |

## 데이터 흐름

`build-info.js`가 현재 빌드와 화면 명칭을 먼저 선언한다. 이후 `site-manifest.js`, `audio-manifest.js`, `transition-manifest.js`, `incident-registry.js`, 정사·화면 데이터가 로드된다. `archive-document-data.js` 뒤의 `field-dossier-data.js`가 네 개의 신규 공개 문서를 병합하고 `regional-drilldown-data.js`가 대흑림·데드존 6개 구역, 38개 지점과 18개 경로의 위험·신호·순례 규칙을 선언한다. `pilgrimage-scenario-data.js`는 불빛 없는 성채의 여섯 현장과 선택·결말을 선언하고 `map-room-data.js`가 모든 자료를 세계 지도에 결합한다. `map-room.js`는 선택 지점의 연결 경로와 전술 레이어를 렌더링하고, 순례 저장소의 결말을 성채 상태에 반영한다. 영상 설정 다음에 부팅·오디오·작전·순례 저장소와 공통 재생 엔진이 초기화된다. 오디오 컨트롤러는 화면 또는 문서 테마에 맞춰 환경·인터페이스·기록·경보 버스를 적용하고 영상 기록 종료와 화면 이동에서 전용 음원을 정리한다. 작전 및 순례 저장소 변경 이벤트는 문서, 지도, 홈 경보를 동시에 갱신한다. `transition-controller.js`와 `app-shell.js`는 화면 퇴장·교체·진입을 공동 관리한다. 이후 기록 색인, 세계 기록, 정보 분석, 상황 관제, 순례 오버레이와 홈 정보 피드가 각 화면을 소유한다.

활성 화면은 `terminal-home`, `map-room`, `history`, `faction-info`, `archive-entry` 다섯 개다. 폐기된 별도 지도 주소 `region-map`, `zone-map`, `operation-map`은 통합 관제도로 전환하고 `faction-relation`은 정보 분석으로 전환한다.

단말 상태의 대시보드와 상단 빠른 이동 메뉴가 화면 이동을 공유한다. PC와 모바일은 같은 DOM과 같은
`click` 경로를 사용하며 모바일에서는 상단 메뉴를 드롭다운으로 배치한다. 사이드 메뉴, 서랍,
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
- `assets/js/core/base-runtime.js`: 부팅과 메뉴 환경음·효과음 자산을 소유한다.
- `assets/js/core/loading-sequence.js`: 빌드별 첫 기동, 세션 복원, 기록 복귀와 모션 감소용 최소 노출 시간을 관리한다.
- `assets/js/core/audio-controller.js`: 화면·문서 음향 프로필, 의미 이벤트, 덕킹, 음소거 저장과 동시재생 제한을 담당한다.
- `assets/js/core/operation-state.js`: 부서진 왕관의 회수 정보, 지휘 판단, 현재 작전 단계와 초기화를 단독 소유한다.
- `assets/js/core/pilgrimage-state.js`: 불빛 없는 성채의 진행, 현장 판단, 계기 수치와 결말을 단독 소유한다.
- `assets/js/core/record-cinematic-runtime.js`: 루트 영상 기록 재생만 담당한다.
- `assets/js/main.js`: 보호된 독립 문서의 기존 동작을 위해 파일로만 유지하며 루트에서는 로드하지 않는다.

종교와 불멸을 향해의 페이지 원본은 보호 해시를 지키기 위해 공통 엔진 내부의 읽기 전용 소스로 유지한다. 기록별 영상·음향·마운트 설정과 페이지 공급 책임은 각각의 모듈이 소유한다.
