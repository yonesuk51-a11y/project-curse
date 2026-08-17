# Map Patch 5.32 — Adaptive Link & Recovery

## 목표

고화질 연출을 기본으로 유지하면서 데이터 절약, 저속 연결, 중저가 모바일과 오프라인 상황에서도 기록 열람과 진행 저장이 끊기지 않도록 사이트 전체의 전송 정책을 통합했다.

## 변경 사항

- `ProjectCurseQuality` 런타임을 추가했다.
  - `navigator.connection.saveData`
  - `effectiveType`, `downlink`, `rtt`
  - `deviceMemory`, `hardwareConcurrency`
  - 온라인·오프라인 상태
- 자동 판정은 `FULL`, `BALANCED`, `CONSTRAINED`, `OFFLINE` 네 등급을 사용한다.
- 표시·음향 설정에 `AUTO`, `DATA SAVE`, `HIGH` 전송 품질 선택을 추가했다.
- 설정 패널에 현재 연결, 지연, 메모리, CPU와 판정 근거를 표시한다.
- 제한 등급에서는 다음 채널의 이미지 사전 준비와 대용량 환경음 전송을 중단한다.
- 영상 기록의 공통 영상은 `metadata` 또는 `none` 선로딩으로 변경했다.
- 영상 기록 전용 라디오 정적음도 실제 기록 진입 전에는 요청하지 않도록 `none` 선로딩으로 고정했다.
- 지도 스캔·경로 흐름·SVG 글로우와 설정 배경 블러를 제한 등급에서 줄였다.
- 오프라인 진입 시 현재 기록과 로컬 진행을 보존한다는 복구 패널을 표시한다.
- 온라인 복귀 또는 수동 재확인 시 실패한 반응형 이미지를 다시 요청한다.
- 적응형 이미지 런타임이 품질 변경 이벤트를 받아 현재 후보를 다시 선택한다.
- 스키마를 `project-curse-v23`으로 올렸다.

## 검증

- 전체 JavaScript 구문 검사 통과
- 패키지 검사 `375/375`
- 내부 셸 검사 `179/179`
- 보호 인라인·독립 문서 해시 4개 유지
- 데스크톱 1440×1000
  - DATA SAVE 적용 시 `CONSTRAINED`
  - 지도 스캔 애니메이션 `none`
  - 첫 입력 전 환경음 요청 0회
  - 오프라인 감지와 온라인 복귀 정상
  - 브라우저 오류 0
- 모바일 390×844 / Save-Data / 2G / RTT 900ms / 2GB / 2스레드
  - 자동 `CONSTRAINED`, 점수 19
  - 이미지 사전 준비·환경음·영상 선로딩 억제
  - 설정 대화상자 384px, 가로 넘침 0
  - 브라우저 오류 0

## 빌드

- 버전: `5.32.0`
- 코드명: `Adaptive Link & Recovery`
- 스키마: `project-curse-v23`
