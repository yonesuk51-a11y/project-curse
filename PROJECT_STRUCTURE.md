# Project Curse Structure — 5.48.0

## 활성 소유권

| 책임 | 단일 기준 파일 |
|---|---|
| 빌드 버전·화면 명칭과 순서 | `assets/js/data/build-info.js` |
| 잠금 기록·런타임 소유권 목록 | `assets/js/data/site-manifest.js` |
| 조직 정사·관계·우시노다 계층 | `assets/js/data/canon-registry.js` |
| 세력 문양 자산·출처·감식 신뢰도·상징 해석 | `assets/js/data/faction-mark-registry.js` |
| 우시노다 종파·지역 혈교 계보·지휘 상태·세계사 연결 | `assets/js/data/faction-lineage-data.js` |
| 세력 분석·문양 감식 화면 | `assets/js/pages/faction-analysis.js` + `assets/css/faction-analysis.css` |
| 세계사 시대·사건 판정·근거·결정 대기 | `assets/js/data/world-history-data.js` + `WORLD_CANON_LEDGER.md` |
| 일본 제6계측계획·실제 역사 경계·기술 계보 | `assets/js/data/japan-technology-data.js` |
| 세계사 작성자·수신자·문서 형식·본문 조각 | `assets/js/data/world-history-prose-data.js` + `WRITING_STYLE_GUIDE.md` |
| 공개 기록 목록·형식·분류·위험도·출처 상태 | `assets/js/data/archive-registry.js` |
| 시각 증거 등급·출처·원본 비교 관계 | `assets/js/data/visual-evidence-data.js` |
| 반응형 이미지 원본 치수·파생본 후보 | `assets/js/data/media-manifest.js` |
| 전체 이미지·음원·영상 출처·권리·해시·사용처 생성 대장 | `assets/js/data/media-provenance-data.js` |
| 검색 가능한 미디어 감사 화면과 우선 검토 대기열 | `assets/js/pages/media-clearance.js` + `assets/css/media-clearance.css` |
| 사람이 승인하는 자산별 출처·권리 예외 | `assets/resources/MEDIA_PROVENANCE_OVERRIDES.json` |
| 미디어 대장 생성·최신 상태 검사 | `tools/build-media-provenance.mjs` |
| 반응형 선택·현상 상태·사전 준비·진단 | `assets/js/core/adaptive-media.js` + `assets/css/adaptive-media.css` |
| 연결·기기 기반 품질 판정과 오프라인 복구 | `assets/js/core/quality-policy.js` + `assets/css/quality-policy.css` |
| 대흑림·데드존·순례 규칙·부서진 왕관 문서와 단락별 출처 층 | `assets/js/data/field-dossier-data.js` |
| 홈 실시간 경보·최근 수신 구성 | `assets/js/data/home-intelligence-data.js` |
| 루트 상단바·단말 허브·화면 이동 | `assets/css/app-shell.css` + `assets/css/terminal-foundation.css` + `assets/js/core/app-shell.js` |
| 부팅 시퀀스 | `assets/js/core/loading-sequence.js` |
| 공통 오디오 자산과 기본 환경음 | `assets/js/core/base-runtime.js` |
| 의미 기반 재생·프로필·덕킹·중첩 제한 | `assets/js/core/audio-controller.js` |
| 화면별 음향 프로필·효과음 사건 목록 | `assets/js/data/audio-manifest.js` |
| 부서진 왕관 정보 회수·로컬 판정·정사 및 계보 경계·지도 단계 저장 | `assets/js/core/operation-state.js` |
| 세 현장 시나리오·고정 관측·로컬 판정 경계·반응형 결말 데이터 | `assets/js/data/pilgrimage-scenario-data.js` |
| 다중 시나리오 진행·계기·판정 저장과 선택 조건 해석 | `assets/js/core/pilgrimage-state.js` |
| 순례·귀환 검문·회수 진입, 판단 봉인 연출과 결과 화면 | `assets/js/pages/pilgrimage-scenario.js` + `assets/css/pilgrimage-scenario.css` |
| 결말별 판정 기록 정의·윤문된 후속 분석 | `assets/js/data/verdict-archive-data.js` |
| 판정 해금·선택 스냅샷·읽음 상태 저장 | `assets/js/core/verdict-archive-state.js` |
| 분류형 기록 라이브러리·검색·조건부 판정 색인 | `assets/js/pages/archive-consolidation.js` + `assets/css/archive-consolidation.css` + `assets/css/verdict-archive.css` |
| 문서·영상 이미지의 출처 패널·확대·비교 화면 | `assets/js/pages/archive-document.js` + `assets/css/visual-evidence.css` |
| 채널별 전환 설정 | `assets/js/data/transition-manifest.js` |
| 여섯 채널 명칭·색상·계기·표식·표시 및 자동 압축 정책 | `assets/js/data/channel-identity-data.js` |
| 채널 헤더 복원·상단 탐색·세션별 접기 상태·표시 및 음향 설정 저장 | `assets/js/core/channel-identity.js` + `assets/css/channel-identity.css` |
| 채널 실시간 상태·부팅·전송량·CLS·전환 계측 | `assets/js/core/performance-telemetry.js` |
| 설정 상태 요약·그룹·접이식 세션 진단 | `assets/js/core/channel-identity.js` + `assets/css/channel-identity.css` |
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
| 영상·문서·권역·작전 기록 카드 색인 | `assets/js/pages/archive-consolidation.js` |
| 시대별 세계 사건 연표·필터·정사 판정·실제 표식 기반 지도 역방향 연결 | `assets/js/pages/world-history.js` + `assets/css/world-history.css` |
| 세력 분석실 | `assets/js/pages/faction-analysis.js` |
| 관제지도 설정 자료·2042 독립 동시관측점 | `assets/js/data/map-room-data.js` |
| 렌더링 표식·작전·독립 관측·위치 보류 사건의 파생 검색 색인 | `assets/js/data/map-signal-index-data.js` |
| 대흑림·데드존 구역·지점·경로 위험·순례 규칙 | `assets/js/data/regional-drilldown-data.js` |
| 지역 상황도·검색 색인·경로 강조·독립 신호층·세션 복원·모바일 하단 시트 및 접이식 정보 패널·작전지도 | `assets/js/pages/map-room.js` + `assets/css/map-room.css` |
| 홈 통계·경보·직접 연결 | `assets/js/pages/terminal-home.js` + `assets/css/terminal-foundation.css` |
| 원본·보정·복원 이미지 정책 | `ASSET_POLICY.md` |
| 신규 복원 추정 이미지 출처 대장 | `assets/resources/ASSET_REGISTRY.md` |
| 5.15.2ce 범위 스타일 | `assets/css/stabilization.css` |
| 5.35 분류형 기록 카드·검색·출처 상태 스타일 | `assets/css/archive-consolidation.css` |

## 데이터 흐름

성능 계측 다음에 품질 정책이 연결·기기 신호와 사용자의 전송 품질 설정을 판독하고, 적응형 미디어·오디오·영상·전환 런타임이 같은 판정 결과를 공유한다. 오프라인 전환과 시각 자료 재요청도 이 정책에서 단일하게 전달한다.

`build-info.js`가 현재 빌드와 화면 명칭을 먼저 선언한다. 이후 `site-manifest.js`, 오디오·전환·채널 데이터, 조직 정사와 `world-history-data.js`의 시대·판정 대장이 로드된다. `japan-technology-data.js`가 제6계측계획 다섯 사건, 실제 역사 기준과 2003·2026년까지 이어지는 기술 계보를 제공하고 `world-history-prose-data.js`가 기존 기록과 2031–2042 후속 사건의 작성자·수신자·목적과 기록 조각을 결합한다. 세계 기록 런타임은 세 대장을 함께 읽어 아홉 시대·43개 사건을 표시한다. 이어서 사건·화면 데이터와 기록·시각 증거·반응형 미디어 데이터가 로드된다. `field-dossier-data.js`가 네 개의 공개 문서를 병합하고 `regional-drilldown-data.js`가 대흑림·데드존 6개 구역, 42개 지점과 19개 경로의 위험·신호·순례 규칙을 선언한다. `pilgrimage-scenario-data.js`는 불빛 없는 성채, 돌아온 자의 이름, 검문소 아래의 구조 신호에 쓰이는 열여덟 현장과 열 결말, 그리고 앞선 선택에 반응하는 후속 변형을 선언한다. 이어서 `verdict-archive-data.js`가 결말별 후속 판정 문구와 DZ-VR-04 작전 해금을 제공하고 `map-room-data.js`가 모든 자료를 세계 지도에 결합한다. `map-signal-index-data.js`는 이 지도 자료와 공통 사건 등록부를 읽어 29개 검색 항목을 파생하며 별도의 위치나 사건을 만들지 않는다. 영상 설정 다음에는 부팅·오디오·적응형 미디어·작전·순례 저장소와 판정 보관소, 공통 재생 엔진이 차례로 초기화된다. 작전·순례·판정 저장소의 변경 이벤트는 문서, 단계별 작전지도와 홈 수신 신호를 동시에 갱신한다. `transition-controller.js`와 `app-shell.js`는 화면 퇴장·미디어 준비·교체·진입을 공동 관리한다. 이후 기록 색인, 세계 기록, 정보 분석, 상황 관제, 순례 오버레이와 홈 정보 피드가 각 화면을 소유한다.

2042년 삼야 무응답은 `map-room-data.js`에서 대흑림 성채 여섯 곳과 데드 존 검문소 네 곳의 독립 관측점으로 등록한다. 이 사건은 연결 경로를 소유하지 않으며, 지도 런타임도 두 권역 사이 선을 생성하지 않는다.

5.45.0의 연표→지도 이동은 `synchronyEvents[].history`를 기준으로 생성한다. 지도 선택과 채널 밀도는 `sessionStorage`에만 저장하고 공통 정사 데이터나 영구 로컬 판정 저장소를 변경하지 않는다.

5.46.0부터 일반 사건의 연표→지도 위치 버튼은 `map-room-data.js`의 실제 렌더링 표식이 해당 사건 ID를 참조할 때만 생성한다. 사건 등록부의 위·경도만으로는 공개 지도 위치를 소유하지 않는다. 모바일 지역·세부·작전 정보 패널의 접힘 상태도 지도 세션에만 저장한다.

5.47.0의 `SIGNAL INDEX`는 렌더링 표식 13개, 작전 5개, 독립 동시관측점 10개와 좌표는 있으나 표식이 없는 사건 1개를 실행 시점에 파생한다. 마지막 항목은 `POSITION WITHHELD`로 분리하며 선택 시 이전 표식을 지우고 권역 개요만 연다. 검색어·필터·색인 선택·하단 시트 열림 상태는 기존 지도 `sessionStorage`에 함께 저장하며 공통 사건·지도·정사 자료를 수정하지 않는다.

`media-provenance-data.js`는 `MEDIA_PROVENANCE_OVERRIDES.json`과 실제 `assets` 파일 집합에서 생성되는 공개 감사 스냅샷이다. 기록보관소는 이 스냅샷의 총자산·검토 대기·미디어 종류·참고 전용 노출 상태를 표시한다. 파일별 승인 근거는 오버라이드에서만 수정하고 생성 대장은 직접 편집하지 않는다.

5.48.0의 `media-clearance.js`는 이 생성 대장을 수정하지 않고 읽기 전용 감사 채널로 표시한다. 최우선 30개는 음원 23개와 영상 7개이며, 순위는 재생 가능 종류·보호 기록 연결·실제 사용 위치를 근거로 생성 시점에 계산한다. 전체 174개 자산 검색, 종류·검토 상태 필터, SHA-256·용량·파생 원본·사용처 상세를 제공하지만 미디어 자체는 로드하거나 재생하지 않는다. `지옥.zip`, `Pictures.zip`, `Pictures2.zip`은 이름과 차단 규칙만 표시하고 내부 파일은 공개 미리보기로 가져오지 않는다.

활성 화면은 `terminal-home`, `map-room`, `history`, `faction-info`, `archive-entry`, `media-audit` 여섯 개다. 폐기된 별도 지도 주소 `region-map`, `zone-map`, `operation-map`은 통합 관제도로 전환하고 `faction-relation`은 정보 분석으로 전환한다.

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
- `assets/js/core/operation-state.js`: 부서진 왕관의 회수 정보, 네 로컬 지휘 판정, 고정·미확정 사실과 계보 보호 경계, 현재 작전 단계와 초기화를 단독 소유한다. 선택 결과는 지도 사본만 바꾸며 세계 공통 정사를 수정하지 않는다.
- `assets/js/core/pilgrimage-state.js`: 세 시나리오의 진행, 현장 판단, 계기 수치와 결말을 저장하고 앞선 선택 조건으로 후속 장면과 결말을 해석한다.
- `assets/js/core/verdict-archive-state.js`: 확인한 결말의 선택·측정값 사본과 판정 문서 읽음 상태를 별도로 저장한다.
- `assets/js/core/quality-policy.js`: 자동·데이터 절약·고화질 설정을 실제 연결과 기기 신호에 결합하고 오프라인 복구 상태를 소유한다.
- `assets/js/core/record-cinematic-runtime.js`: 루트 영상 기록 재생만 담당한다.
- `assets/js/main.js`: 보호된 독립 문서의 기존 동작을 위해 파일로만 유지하며 루트에서는 로드하지 않는다.

종교와 불멸을 향해의 페이지 원본은 보호 해시를 지키기 위해 공통 엔진 내부의 읽기 전용 소스로 유지한다. 기록별 영상·음향·마운트 설정과 페이지 공급 책임은 각각의 모듈이 소유한다.
