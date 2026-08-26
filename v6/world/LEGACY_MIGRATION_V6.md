# Project Curse 5.52 → V6 이관 대장

문서 상태: `ACTIVE MIGRATION POLICY`

## 1. 이관 철학

V6는 구판을 삭제하거나 전부 정사로 복사하지 않는다. 구판 자료를 `Legacy Source`로 봉인하고, 새 정사가 항목별로 채택 여부를 판정한다.

```text
ADOPTED     그대로 채택
REVISED     핵심만 채택하고 재작성
DISPUTED    다른 자료와 충돌
UNRESOLVED  판단 보류
REJECTED    V6 정사에서 폐기
```

각 이관 항목은 가능하면 아래 필드를 가진다.

```text
legacyId
legacySourcePath
legacyBuild
migrationStatus
v6ReplacementId
changedFields
changeReason
approvedBy
```

## 2. 보호 대상

다음 자료는 V6 리메이크가 원문을 바꾸지 않는다.

- 루트 인라인 `Cults_871104`
- 루트 인라인 `Immortality_860201`
- `docs/Cults_871104/index.html`
- `docs/Immortality_860201/index.html`
- 보호 문서의 기존 이미지 경로
- `ASSET_POLICY.md`
- `MEDIA_CREDITS.md`
- `assets/resources/ASSET_REGISTRY.md`
- `assets/resources/MEDIA_PROVENANCE_OVERRIDES.json`
- `assets/resources/archive-enex/**`
- 구판 변경 기록과 Git 이력

보호 원문 해시 기준:

```text
Cults_871104 inline
aefa15d45fd74b868223144455da4dae59b5545f61fd5687a3132d8cf27c3429

Cults_871104 standalone
71b052533c33f3c4d9838a55633be82bb64030d4028be2304a48154fa049a740

Immortality_860201 inline
38cd38c7db213c15517284155e7a70f98092cf9cae52e18d0be40b85fe73e993

Immortality_860201 standalone
1d6c0fb57135631deb7feed3c4f6845f4bd1337e3b7ad34db78f95b8d5855626
```

## 3. V6가 직접 불러오지 않는 레거시 런타임

- `assets/js/main.js`
- `assets/css/style.css`
- `assets/js/core/record-cinematic-runtime.js`
- `assets/js/pages/cinematic-cults.js`
- `assets/js/pages/cinematic-immortality.js`
- `assets/js/data/immortality-storyboard.js`
- 구판 시네마틱 CSS

이 파일은 보호 독립문서 호환 때문에 즉시 삭제하지 않는다. `legacy-only` 섬으로 유지하되 V6 기능을 추가하지 않는다.

## 4. 어댑터 이관 대상

### 정사·세계사

- `canon-registry.js`
- `world-history-data.js`
- `world-history-prose-data.js`
- `japan-technology-data.js`
- `incident-registry.js`
- `WORLD_CANON_LEDGER.md`

자동 import하지 않고 사건별 채택 판정을 거친다.

### 세력

- `faction-lineage-data.js`
- `faction-analysis-data.js`
- `faction-mark-registry.js`

명칭, 창설연도, 분파, 관계와 문양을 각각 독립 판정한다. 조직 개념을 채택해도 약자·설립일·지휘 구조·문양은 수정될 수 있다.

### 인물

- `personnel-data.js`
- `personnel-profile-data.js`
- `PERSONNEL_SOURCE_NOTES.md`

원 명부, 후대 보완 초안과 V6 확정 정보를 섞지 않는다.

`6.0.0-alpha.4`의 인물 채널은 56명 자료를 명시적 스냅샷으로 동결한 `LEGACY INTAKE` 단계다. 각 파일은 `v6Adoption:'UNREVIEWED'`, `current2042:'UNRESOLVED'`, `v6IncidentLinks:[]`로 시작한다. 이는 자동 import나 정사 승계가 아니라 이후 인물별 채택 심사를 위한 입력 대장이다.

### 지도·시나리오

- `map-room-data.js`
- `map-signal-index-data.js`
- `regional-drilldown-data.js`
- `pilgrimage-scenario-data.js`
- `verdict-archive-data.js`

좌표는 승인 위치, 비항법 추정, 관측점, 작전 사본과 구판 시나리오 위치로 구분한다. 사용자 로컬 결말을 공통 정사로 승격하지 않는다.

## 5. 확인된 충돌과 V6 판정

| 항목 | 구판 충돌 | V6 상태 |
|---|---|---|
| 피의 호수 날짜 | 1986.02.01 / 1986.07.25 | 현장 사건과 회수·등록일 분리 가설 |
| 1986 N.H.C | 장비 표기 / 후대 조직사 | 프로토 규격 또는 편집 라벨 `DISPUTED` |
| Immortality 보급 | 원문 3일 / 시네마틱 4일 | 원문 3일 채택 |
| Immortality 18:06 | 원문 예거트 이상 / 시네마틱 밀로 실종 | 원문 채택, 구판 연출 주장 격리 |
| Immortality 18:14 | 원문 유닛4 통신 두절 / 시네마틱 유닛2 위치 | 원문 채택, 구판 연출 주장 격리 |
| 1995 실제 사건 | 일부 UI의 교단 직접 인과 | `REJECTED`, 별도 가상 사건만 `ADJACENT` |
| U.A.C 명칭 | United Nations 연상 / 독립기관 설명 | 약자 유지, 풀네임 `UNRESOLVED` |

## 6. 미디어 경계

- 미디어 출처의 기준은 `MEDIA_PROVENANCE_OVERRIDES.json + 실제 파일 집합 + 생성 대장`이다.
- 생성 파일 `media-provenance-data.js`를 사람이 직접 고치지 않는다.
- `LICENSE_REVIEW` 오디오·영상은 V6 기본 재생 목록에서 제외한다.
- 참고 ZIP은 공개 트리에 넣지 않는다.
- 후보 이미지와 내부 시안은 사용자 채택 전 추적·게시하지 않는다.
- 원본 이미지 위에 파생본을 덮어쓰지 않는다.

## 7. 브라우저 상태

다음 구판 상태를 V6로 자동 이관하지 않는다.

- `pc_operation_broken_crown_v1`
- `pc_pilgrimage_states_v2`
- `pc_verdict_archive_state_v1`
- 기존 지도 세션 키
- 구판 음향·채널 설정

V6는 `pc_v6_*` 네임스페이스만 사용하고, 향후 사용자가 선택하는 마이그레이션 도구가 생길 때만 가져온다.

## 8. 배포 경계

- 기존 공개 루트 5.52는 유지한다.
- 첫 V6는 `/v6/`에 독립 배포한다.
- `/archive/`와 `#archive-entry` 레거시 복귀 경로를 깨지 않는다.
- Project Pages 하위 경로를 고려해 사이트 루트 절대경로를 사용하지 않는다.
- 커밋할 때 후보 이미지를 포함하지 않도록 V6 파일을 명시적으로 스테이징한다.

## 9. 배포 전 회귀 검사

- [ ] V6에서 구판 `main.js`를 로드하지 않음
- [ ] V6에서 구판 `style.css`를 로드하지 않음
- [ ] 보호 해시 네 개 일치
- [ ] 보호 독립문서 직접 접근 가능
- [ ] V6 연출에 `STAGED RECONSTRUCTION` 표시
- [ ] 원문·출처·제시 방식 3축 표시
- [ ] 라이선스 검토 미디어 자동 재생 없음
- [ ] 후보 이미지 V6 참조 0건
- [ ] V6 ES module 문법 검사 통과
- [ ] 모든 로컬 링크·이미지 파일 존재
- [ ] 360px 설계에서 필수 UI가 단일열 또는 수평 선택 구조로 전환
- [ ] 기존 패키지 검증 통과

## 10. 완료 정의

V6 이관은 구판의 모든 페이지를 새 CSS로 보이게 만드는 일이 아니다. 각 설정과 자료가 어디에서 왔고, 무엇이 바뀌었으며, 무엇이 아직 확정되지 않았는지 추적할 수 있을 때 완료된다.
