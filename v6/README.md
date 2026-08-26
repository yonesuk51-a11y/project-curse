# Project Curse V6 — Recovered Network Alpha

상태: `6.0.0-alpha.3 / DRAFT / REFOUNDATION`

이 폴더는 기존 공개 루트 5.52를 교체하지 않고 세계관·정보 구조·기록 연출을 다시 설계하는 독립 시제품이다. V6의 목적은 기존 설정을 자동으로 정사 승계하는 것이 아니라, 구판 자료를 출처가 붙은 레거시 자료로 봉인한 뒤 새 정사가 선택적으로 채택하도록 만드는 데 있다.

## 현재 구현 경로

- `#/briefing` — 2042년 현재와 손실 교리
- `#/world` — 핵심 용어, 지역 붕괴, 능력 접속, 1975–2042 여섯 시대
- `#/map` — 비항법 세계 상황도, 여섯 증거 레이어, 15개 접촉 목록, 다섯 사건·작전 증거 사본과 28개 상호작용 증거 표식
- `#/map/signal:blood-lake` — 실제 좌표를 복원하지 않는 1986 피의 호수 관측점
- `#/map/operation:immortality` — 보호 기록 시간에 정렬된 기록 순서 도면
- `#/map/operation:three-night` — 대륙 간 경로를 그리지 않는 6+4 독립 관측 군집 도면
- `#/archive` — 보호 원문과 V6 재구성의 분리 게이트
- `#/archive/Cults_871104` — 자동 재생 없는 조사형 기록 시제품
- `#/archive/Immortality_860201` — 보호 원문 시간에 맞춘 4막 사건 재구성
- `#/marks` — 17개 세력 체계, 51개 `seal / badge / map` 문맥, 계보·거래 분리 대장

## 설계 경계

1. `../index.html`과 기존 `../docs/` 보호 기록은 수정하지 않는다.
2. V6는 `../assets/js/main.js`와 `../assets/css/style.css`를 불러오지 않는다.
3. 보호 원문, 출처 계보, 현재 제시 방식을 서로 다른 상태로 표시한다.
4. `Cults_871104`와 `Immortality_860201`의 V6 화면은 원본이 아니라 `STAGED RECONSTRUCTION`이다.
5. 음향과 영상은 자동 재생하지 않는다.
6. 출처·공개 권리 검토 중인 후보 이미지는 V6에 넣지 않는다.
7. V6의 브라우저 상태는 `pc_v6_*` 네임스페이스만 사용한다.

## 세계관 문서

- [WORLD_BIBLE_V6.md](world/WORLD_BIBLE_V6.md)
- [CANON_RULES_V6.md](world/CANON_RULES_V6.md)
- [ANOMALY_SYSTEM_V6.md](world/ANOMALY_SYSTEM_V6.md)
- [TIMELINE_V6.md](world/TIMELINE_V6.md)
- [FACTIONS_V6.md](world/FACTIONS_V6.md)
- [FACTION_MARK_SYSTEM_V6.md](world/FACTION_MARK_SYSTEM_V6.md)
- [MAP_PROTOCOL_V6.md](world/MAP_PROTOCOL_V6.md)
- [LEGACY_MIGRATION_V6.md](world/LEGACY_MIGRATION_V6.md)

## 로컬 열람

저장소 루트에서 정적 HTTP 서버를 실행한 뒤 `/v6/`로 접속한다. 파일을 직접 열면 ES module 보안 정책 때문에 라우트 모듈이 로드되지 않을 수 있다.

## 아직 확정하지 않은 것

- A02 핵심 약어 명칭안에 대한 사용자 최종 정사 승인
- 우시노다 세 계통의 단일 중앙지휘 여부
- 남부 혈교와 데드 존 혈교의 정식 계승 관계
- 1986년 문서의 N.H.C가 당시 프로토 규격인지 후대 편집 라벨인지
- 보호 기록 연결 미디어의 공개 사용 권리
- A02 CSS 문맥 연구를 대체할 최종 벡터 `seal / badge / map` 마스터 파일

이 항목은 미완성이라서 숨겨 둔 것이 아니라, 정사 판정이 끝날 때까지 의도적으로 `UNRESOLVED` 상태로 유지한다.
