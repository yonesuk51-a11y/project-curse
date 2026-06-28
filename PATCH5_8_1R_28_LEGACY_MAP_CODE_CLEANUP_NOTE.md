# PATCH 5.8.1R-28 — LegacyMapCodeCleanup

## 목적

R24 이후 안정화된 새 지역지도 모듈을 기준으로, R24 이전 구형 지역지도 DOM/런타임/에셋 잔재를 정리한다.

## 정리 기준

- R24~R27 새 지도 모듈 유지
- 구형 `.continental-map-shell` 기반 지도 DOM 제거
- 구형 대륙 패널/필터/마커 DOM 제거
- 구형 지도 줌/FIT/WIDE/드래그 런타임 제거
- 구형 지역지도 데이터 렌더러 제거
- R16~R23 누적 후처리 패치 제거
- R24 이전 오래된 패치노트 제거
- 사용하지 않는 과거 지도 생성 스크립트 제거
- 사용하지 않는 구형 지도 SVG 제거
- 서버 상태바/문서 뱃지처럼 지도 외 UI에 필요한 부분은 R28 기준으로 별도 유지

## 유지된 것

- 세계지도 권역 선택 화면
- R24 단일 지도 렌더러
- R25 시각 보정
- R26 자체 검수 리포트
- R27 관계권 보정 데이터
- 검수 모드
- 내부 코드 일반 화면 비노출
- 필터 목록과 필터 동작
- 현재 사용 중인 지도 SVG 9개

## 제거된 대표 잔재

- `.continent-panel` 기반 상세지도 HTML
- `.continent-filter` 기반 구형 필터 레일
- `[data-map-item]` 기반 구형 마커 런타임
- `.map-viewport-tools` 기반 줌/드래그 도구
- R17~R23 필터/라벨 후처리 MutationObserver
- R16 계열 세계지도/마커/존 덮어쓰기 루틴
- `global_zone_map.svg`, `global_zone_map_clean.svg`
- `continent_me_africa.svg`, `continent_south.svg`
- `rebuild_actual_world_map.py`, `regenerate_fixed_16x9_maps.py`

## 검수

- `assets/js/main.js` 문법 체크 완료
- `assets/js/r24_regional_map_rebuild.js` 문법 체크 완료
- zip 무결성 테스트 완료
