# Map Patch 5.31 — Live Status & Performance

## 공개 기준 측정

- 5.30 GitHub Pages 콜드 기동 화면: 약 8.69초
- DOMContentLoaded: 196ms 측정 회차 기준
- 채널 전환: 810–844ms
- CLS: 0
- 최초 세션 전송: 약 4.49MB
- 환경음 단일 요청: 약 3.09MB

## 변경 결과

- 메뉴 환경음을 첫 사용자 입력 전에는 요청하지 않도록 변경했다.
- 부팅 화면의 실제 종료 시점을 `projectcurse:boot-hidden` 사건으로 제공한다.
- 다섯 채널에 현재 수신 신호, 활성 작전, 사건, 세력 파일, 읽지 않은 기록 상태를 표시한다.
- 작전·순례·판정 저장 상태가 변하면 채널 배지와 헤더 계기를 즉시 다시 계산한다.
- 설정 패널에 부팅 노출, DOM 준비, 전송량, 채널 전환과 CLS 진단을 추가했다.
- LCP, CLS, long task, 리소스, 부팅과 전환을 `ProjectCurseTelemetry`에서 조회할 수 있다.
- 모바일에서는 진단 계기를 2열로 바꾸고 동작 줄이기 환경에서 배지 점멸을 제거한다.

## 5.31 로컬 검증

- 클릭 전 환경음 요청: 없음
- 콜드 부팅 실제 노출: 8.63초
- 클릭 전 로컬 전송량: 약 1.77MB
- 첫 채널 전환: 842ms
- 작전 확정 후 관제 배지: `1 ACTIVE`에서 `0 STANDBY`로 갱신
- 모바일 실시간 배지: 5개 모두 표시
- 모바일 가로 넘침: 0px
- CLS: 0
- 브라우저 오류: 0건

## 소유권

- 상태·성능 계측: `assets/js/core/performance-telemetry.js`
- 배지·진단 표시: `assets/js/core/channel-identity.js`
- 지연 음향 요청: `assets/js/core/base-runtime.js`
- 빌드: `5.31.0 / project-curse-v22`
