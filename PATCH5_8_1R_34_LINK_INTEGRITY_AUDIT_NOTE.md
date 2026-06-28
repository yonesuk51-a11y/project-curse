# PATCH 5.8.1R-34 — LinkIntegrityAudit

## 목적

R31~R33에서 추가된 지도 → 문서 / 문서 → 지도 연결이 깨지지 않았는지 SELF REVIEW에서 자동 점검한다.

## 핵심 변경

- 지도 모듈 버전 갱신: `5.8.1R-34 LinkIntegrityAudit`
- SELF REVIEW 패널에 `LINK AUDIT` 상태 표시 추가
- 검수 리포트에 `링크 무결성` 항목 추가
- 링크 오류가 있을 경우 `링크 경고` 항목으로 상세 출력
- 지도 요소의 관련 기록 키가 실제 기록 라이브러리에 존재하는지 점검
- 내부 기록 보관서의 `data-record` 대상이 실제 DOM에 존재하는지 점검
- 별도 문서 경로가 허용된 문서 경로인지 점검
- 문서 내부 `관련 지도 기록` 버튼이 실제 권역과 지도 요소 ID를 가리키는지 점검
- 역방향 브리지의 권역/마커 ID 불일치를 점검

## 추가 API

`window.ProjectCurseRegionalMap`에 아래 메서드를 추가했다.

- `auditLinkIntegrity()`
- `makeLinkAuditReport()`

## 유지 사항

- R24 새 지도 모듈 구조 유지
- R31 지도 → 문서 연결 유지
- R32 겹친 요소 후보 선택 메뉴 유지
- R33 문서 → 지도 역방향 연결 유지
- 일반 화면 내부 코드 비노출 유지
- 검수 모드에서만 연결 ID 표시 유지
- 새 존 체계 추가 없음
- QA 폴더 복구 없음

## 수정 파일

- `assets/js/r24_regional_map_rebuild.js`
- `assets/css/style.css`
- `README.md`
- `PATCH5_8_1R_34_LINK_INTEGRITY_AUDIT_NOTE.md`
