# PATCH 5.8.1R-46 — PrecisionLayerAuditHotfix

## 목적

R45에서 추가된 확대/정밀 보기 전용 콘텐츠가 보기 단계별로 정확히 표시되는지 점검하고, SELF REVIEW / FINAL CHECK / RECORD INDEX에서 정밀 레이어 상태를 더 명확히 확인할 수 있게 정리한다.

## 적용 사항

- 지도 모듈 버전: `5.8.1R-46 PrecisionLayerAuditHotfix`
- 정밀 레이어 검수 API 추가
  - `ProjectCurseRegionalMap.auditPrecisionLayer()`
  - `ProjectCurseRegionalMap.makePrecisionLayerAuditReport()`
- 요약/기본 보기에서 확대·정밀 전용 요소가 새는지 자동 점검
- 확대 전용 요소가 확대 보기에서 표시되는지 자동 점검
- 정밀 전용 요소가 정밀 보기에서 표시되는지 자동 점검
- FINAL CHECK / SELF REVIEW 리포트에 `PRECISION LAYER` 항목 추가
- RECORD INDEX에서 확대/정밀 전용 항목의 자동 전환 안내를 보강
- 데이터 모듈에 R46 정밀 검수 메타데이터 추가

## 유지 사항

- 세계지도 권역 선택 전용 구조 유지
- 상세지도 전용 요약/기본/확대/정밀 보기 유지
- R45 전체 지도 요소 181개 유지
- 새 존 체계 추가 없음
- 블랙존 추가 없음
- LINK AUDIT / RECORD INDEX / SELF REVIEW 유지
- 일반 화면 내부 ID 비노출 유지
- 검수 모드 내부 ID 표시 유지
