# PATCH 5.8.1R-30 — FinalMapPackageCleanup

## 목적

R24~R29에서 안정화한 새 지역지도 모듈을 기준으로 배포용 패키지 상태를 정리한다. 이번 패치는 새 지도 기능을 추가하지 않고, README/패치노트/구형 잔재/런타임 연결 상태를 정돈하는 마감 패치다.

## 유지 기준

- 세계지도는 권역 선택 전용 화면으로 유지한다.
- 세계지도에는 데이터 레이어, 존, 시설, 사건, 봉쇄선, 봉쇄 거점, 통신권을 표시하지 않는다.
- 상세지도는 R24 이후 새 단일 모듈(`assets/js/r24_regional_map_rebuild.js`)만 사용한다.
- 필터 목록과 순서는 유지한다.
- 검수 모드는 일반 필터가 아니라 내부 코드 라벨 표시 상태로 유지한다.
- 일반 화면에서는 내부 코드 라벨을 생성하지 않는다.
- R27 관계권 보정 데이터와 R29 시각 마감 스타일을 유지한다.

## 정리 내용

### 1. README 최종 기준 재작성

README를 R30 기준으로 다시 정리했다.

- 현재 버전 표기 갱신
- R24~R30 변경 흐름 요약
- 지역지도 사용법 정리
- 필터 목록 정리
- 검수 모드/SELF REVIEW 사용법 정리
- 유지/제거된 구조 명시

### 2. 구형 지도 런타임 잔재 추가 제거

R28에서 큰 구조는 제거했지만, `main.js` 안에 더 이상 실제 DOM과 연결되지 않는 구형 지도 보조 런타임 일부가 남아 있었다. R30에서 추가로 정리했다.

- 5.5~5.6.1 계열 구형 줌/드래그 런타임 제거 상태 유지
- 5.6 계열 구형 지도 코드북/마커-기록 연결 런타임 제거
- 5.6.2 계열 구형 지도 잔상 정리 루틴 제거
- R6 회귀 검수 루틴 내부의 구형 `.continental-map-shell` 대상 정리 제거
- 오디오 컨텍스트 감지 대상을 새 R24 지도 클래스 기준으로 갱신

### 3. 새 지도 모듈 API 정리

R24 모듈에 최소 API를 노출했다.

- `window.ProjectCurseRegionalMap.resetToWorld()`
- `window.ProjectCurseRegionalMap.getState()`
- `window.ProjectCurseRegionalMap.makeSelfReviewReport()`

이로써 사이드 메뉴에서 지역지도에 다시 진입할 때 구형 지도 셸이 아니라 새 R24 모듈 기준으로 세계 권역 선택 화면을 복구할 수 있다.

### 4. CSS 잔재 정리

더 이상 사용하지 않는 구형 지역지도 CSS 라인을 추가 정리했다.

- 구형 `.continent-*` 지도 스타일
- 구형 `.continental-map-shell` 스타일
- 구형 데이터맵/줌/마커 후처리 스타일
- R28 임시 마운트 노트 스타일

R24~R29의 `uac-r24-regional-map` / `r24-*` 스타일은 유지했다.

### 5. 패키지 검수

- `assets/js/main.js` 문법 체크 완료
- `assets/js/r24_regional_map_rebuild.js` 문법 체크 완료
- zip 무결성 테스트 완료

## 수정 파일

- `assets/js/main.js`
- `assets/js/r24_regional_map_rebuild.js`
- `assets/css/style.css`
- `README.md`
- `PATCH5_8_1R_30_FINAL_MAP_PACKAGE_CLEANUP_NOTE.md`
