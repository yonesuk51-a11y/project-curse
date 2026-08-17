# Map Patch 5.30 — Menu Identity Overhaul

## 변경 결과

- 상단 빠른 이동을 홈 포함 다섯 채널 구조로 확장했다.
- 각 채널에 고유한 색상, 영문 코드, 계기, 기하 표식과 배경 문법을 부여했다.
- 화면 내부 런타임이 DOM을 다시 만든 뒤에도 채널 헤더가 복원되도록 했다.
- 지도 레이더, 연대기 눈금, 정보 분석망, 보관소 봉인 형태를 화면 진입 연출에 반영했다.
- 모바일 빠른 메뉴를 스크롤 가능한 한 열 채널 패널로 바꿨다.
- 시각 효과, 인터페이스 음향, 환경음, 텍스트 등장 설정 패널을 추가했다.
- 설정을 로컬에 저장하고 `prefers-reduced-motion`을 우선 적용한다.
- `ProjectCurseChannelIdentity.getDiagnostics()`로 채널·설정·탐색 연결 상태를 확인할 수 있다.

## 소유권

- 데이터: `assets/js/data/channel-identity-data.js`
- 런타임: `assets/js/core/channel-identity.js`
- 스타일: `assets/css/channel-identity.css`
- 빌드: `5.30.0 / project-curse-v21`

## 검증 범위

- 전체 JavaScript 구문 검사
- 패키지 및 내부 문서 셸 정적 검증
- 데스크톱·모바일 채널 전환, 설정 저장, 모션 감소, 음향 버스 연결 브라우저 검사
