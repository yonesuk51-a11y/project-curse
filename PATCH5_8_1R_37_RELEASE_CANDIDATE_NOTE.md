# PATCH 5.8.1R-37 — ReleaseCandidate

## 목적

R37은 R24~R36에서 안정화한 새 지역지도 시스템을 릴리즈 후보 상태로 정리하는 패치다. 새 기능을 크게 추가하기보다, 기존 기능들의 연결 상태와 최종 검수 기준을 명확히 정리한다.

## 유지 범위

- R24 새 지역지도 모듈
- R25 시각 검수 보정
- R26 SELF REVIEW
- R27 관계권/봉쇄선-거점 보정
- R28 구형 지도 코드 정리
- R29 시각 마감
- R30 패키지 정리
- R31 지도 → 문서 연결
- R32 겹친 요소 선택 보정
- R33 문서 → 지도 연결
- R34 LINK AUDIT
- R35 터미널 이동 흐름
- R36 RECORD INDEX

## 추가 사항

### 1. 버전 갱신

지도 모듈 버전을 `5.8.1R-37 ReleaseCandidate`로 갱신했다.

### 2. 릴리즈 후보 검수 API 추가

추가 API:

- `ProjectCurseRegionalMap.auditReleaseCandidate()`
- `ProjectCurseRegionalMap.makeReleaseCandidateReport()`

점검 대상:

- 권역 버튼 8개
- 상세 권역 8개
- 필터 순서
- 권역별 데이터 존재 여부
- 권역별 기본 QA 경고
- LINK AUDIT 상태
- RECORD INDEX 구성
- 구형 지도 DOM 잔재 여부

### 3. SELF REVIEW 리포트 보강

SELF REVIEW 리포트에 `릴리즈 후보 점검` 항목을 추가했다.

### 4. README 최종 후보 기준 재작성

README를 R37 기준으로 다시 정리했다.

## 금지/유지 원칙

- 새 존 체계 추가 없음
- QA 폴더 복구 없음
- 세계지도 데이터 레이어 추가 없음
- 구형 줌/FIT/WIDE 조작 복구 없음
- R24 이전 지도 DOM 구조 복구 없음

## 검수

- `assets/js/main.js` 문법 체크
- `assets/js/r24_regional_map_rebuild.js` 문법 체크
- zip 무결성 테스트
