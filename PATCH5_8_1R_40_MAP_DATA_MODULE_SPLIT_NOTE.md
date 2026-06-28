# PATCH5_8_1R_40_MAP_DATA_MODULE_SPLIT_NOTE

## 목적

R39 FinalHotfix 기준 지역지도 기능은 유지하면서, 이후 콘텐츠 확장을 위해 지도 렌더러와 지도 데이터를 분리했다.

## 변경 사항

- `assets/js/r24_regional_map_rebuild.js`에서 권역/지도 요소/기록 연결 대형 데이터 블록을 제거했다.
- `assets/data/uac_region_map_data.js`를 추가했다.
  - 권역 정의
  - 세계 권역 버튼
  - 권역별 지도 요소 데이터
- `assets/data/uac_region_summaries.js`를 추가했다.
  - 세계/권역별 우측 패널 요약 데이터
- `assets/data/uac_region_record_links.js`를 추가했다.
  - 관련 기록 라이브러리
  - 문서 경로 허용 목록
  - 지도 요소 기록 키워드 규칙
- `index.html` 스크립트 로드 순서를 데이터 모듈 → 렌더러 순서로 정리했다.
- 지도 모듈 버전을 `5.8.1R-40 MapDataModuleSplit`로 갱신했다.

## 유지 사항

- R31 지도 → 문서 연결
- R32 겹친 요소 후보 선택
- R33 문서 → 지도 역방향 연결
- R34 LINK AUDIT
- R35 지도 ↔ 문서 복귀 흐름
- R36 RECORD INDEX
- R38 최종 점검 리포트
- R39 FinalHotfix 안정 상태

## 확장 원칙

앞으로 사건/존/시설/봉쇄선을 추가할 때는 렌더러를 수정하지 않고 `assets/data` 안의 데이터만 늘리는 것을 우선한다.

금지 사항은 유지한다. 새 존 체계 추가 금지, 세계지도 상시 데이터 마커 추가 금지, QA 폴더 복구 금지.
