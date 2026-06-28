# PATCH 5.8.1R-33 — RecordContentBridgePass

## 목적

R31에서 추가한 `지도 → 문서` 연결을 반대 방향으로 확장한다. 이제 내부 기록 보관서 문서에서도 관련 지도 요소로 돌아갈 수 있다.

## 적용 내용

- 내부 기록 문서에 `관련 지도 기록` 섹션을 동적으로 추가했다.
- 문서 안의 지도 기록 버튼을 누르면 지역지도 화면으로 이동하고, 해당 권역과 지도 요소를 선택한다.
- 세계지도로 리셋하지 않고 관련 권역 상세지도에서 선택 요소를 바로 강조한다.
- 검수 모드가 켜져 있을 때는 문서 브리지 버튼에 지도 요소 ID를 표시한다.
- SELF REVIEW 리포트에 선택 요소의 역방향 지도 링크 정보를 추가했다.
- `ProjectCurseRegionalMap.openMapItem(region, id)` API를 추가했다.
- `ProjectCurseRegionalMap.getRecordMapLinks(recordId)` API를 추가했다.

## 유지 사항

- R24 새 지역지도 모듈 구조 유지
- R31 지도 → 문서 연결 유지
- R32 겹친 요소 후보 선택 메뉴 유지
- 일반 화면 내부 코드 라벨 비노출 유지
- 검수 모드 코드 표시 기준 유지
- 기존 문서 내용과 설정 추가 없음

## 수정 파일

- `assets/js/r24_regional_map_rebuild.js`
- `assets/css/style.css`
- `README.md`
- `PATCH5_8_1R_33_RECORD_CONTENT_BRIDGE_PASS_NOTE.md`
