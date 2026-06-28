# PATCH 5.8.1R-38 — FinalHotfixReadinessPass

## 목적

R37 릴리즈 후보를 기준으로 실제 최종 핫픽스 직전 검수에 필요한 리포트 가독성, 점검 흐름, 색인 빈 결과 안내를 정리한다.

이번 패치는 새 지도 체계를 다시 확장하는 패치가 아니라, 기존 R24~R37 기능을 유지하면서 검수 결과를 더 빠르게 읽고 문제 항목을 바로 복사할 수 있게 만드는 준비 패치다.

## 주요 변경

### 1. 버전 갱신

지도 모듈 버전을 다음으로 갱신했다.

`5.8.1R-38 FinalHotfixReadinessPass`

### 2. SELF REVIEW 최종 점검 버튼 추가

SELF REVIEW 버튼 흐름을 다음처럼 정리했다.

- 검수 리포트 생성
- 최종 점검
- 리포트 복사

`최종 점검`은 일반 전체 리포트보다 짧고 문제 항목을 상단에 모은 최종 핫픽스 준비 리포트를 출력한다.

### 3. 최종 핫픽스 준비 API 추가

추가 API:

- `ProjectCurseRegionalMap.auditFinalHotfixReadiness()`
- `ProjectCurseRegionalMap.makeFinalHotfixReadinessReport()`

점검 항목:

- 자동 점검 경고
- LINK AUDIT 경고
- RELEASE CANDIDATE 경고
- RECORD INDEX 항목 수
- 현재 권역/필터의 표시 요소 수
- 구형 지도 DOM 잔재

### 4. 자체 검수 리포트 요약 보강

기존 SELF REVIEW 리포트 상단에 `[요약]`을 추가했다.

정상 상태 예시:

```text
[요약]
상태: 정상 / 경고 0건
LINK AUDIT: 정상 / RECORD INDEX: 12개 / RELEASE CANDIDATE: 정상
```

문제가 있으면 `문제 목록`이 상단에 먼저 표시된다.

### 5. RECORD INDEX 빈 결과 안내 개선

검색 결과가 없을 때 단순히 비어 있다고만 표시하지 않고, 현재 색인 종류와 검색어 상태를 함께 보여준다.

검수자가 필터 연동/전체 색인으로 전환해 다시 확인할 수 있도록 안내 문구를 추가했다.

## 유지 사항

- R31 지도 → 문서 연결 유지
- R32 겹친 요소 후보 선택 유지
- R33 문서 → 지도 역방향 연결 유지
- R34 링크 무결성 검수 유지
- R35 지도 ↔ 문서 복귀 흐름 유지
- R36 RECORD INDEX 유지
- R37 릴리즈 후보 점검 유지
- 일반 화면 내부 코드 비노출 유지
- 검수 모드 내부 코드 표시 유지
- QA 폴더 미복구
- 새 존 체계 추가 없음

## 검수 기준

- `main.js` 문법 체크
- `r24_regional_map_rebuild.js` 문법 체크
- `ProjectCurseRegionalMap.makeFinalHotfixReadinessReport()` API 노출
- zip 무결성 확인
