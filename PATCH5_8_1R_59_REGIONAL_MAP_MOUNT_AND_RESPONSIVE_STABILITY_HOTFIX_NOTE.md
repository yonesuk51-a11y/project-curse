# PATCH 5.8.1R-59 — RegionalMapMountAndResponsiveStabilityHotfix

## 목적
R57/R58에서 모바일 반응형과 성능 최적화를 추가하는 과정에서 PC 지역지도 렌더링이 비어 보이던 회귀 문제를 수정한다.

## 핵심 수정
- 안정적인 R55 지역지도 렌더러 기준으로 복구
- R57/R58의 함수 오버라이드형 모바일 패치 제거
- 지도 모듈 build/render 흐름은 지연하거나 스킵하지 않음
- PC/태블릿/모바일 대응은 CSS 반응형으로 처리
- PC 넓은 화면에서는 기존 지도+우측 패널 구조 유지
- 중간 폭에서는 지도 우선 단일 열 배치
- 모바일에서는 지도 우선, 정보 패널 압축/스크롤 처리

## 유지
- 세계지도 권역 선택 전용
- 상세지도 줌 1~5
- 마우스 휠 줌
- 줌 2~5 드래그
- 선택 시 자동 중심 복귀 없음
- 기능별 아이콘 매핑
- 존 제외 마커/선/링 스케일 보정

## 검수 API
- ProjectCurseRegionalMap.auditResponsiveStabilityHotfix()
- ProjectCurseRegionalMap.makeResponsiveStabilityReport()
