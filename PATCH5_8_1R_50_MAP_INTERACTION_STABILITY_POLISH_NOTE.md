# PATCH 5.8.1R-50 — MapInteractionStabilityPolish

R50은 R47의 줌 1~5 단계형 표시, R48의 마우스 휠/드래그, R49의 선택 시 자동 중심 복귀 제거를 유지하면서 실제 조작감을 안정화한 패치다.

## 변경 사항

- 줌 2~5 드래그 이동 범위를 단계별로 제한
- 지도 바깥으로 과하게 밀려 빈 공간만 보이는 문제 완화
- 마우스 휠 줌 쿨다운 적용
- 마우스 위치를 기준으로 자연스럽게 줌되는 보정 추가
- 선택 요소/관계권 요소 강조 보강
- 겹친 요소 후보 메뉴 위치를 지도 내부로 클램프
- 현재 조작 상태 표시 추가
- SELF REVIEW/외부 API용 조작 안정화 검수 함수 추가

## 유지 사항

- 세계지도는 권역 선택 전용
- 세계지도 줌/드래그/FIT/WIDE 없음
- 상세지도 줌 1~5 단계 유지
- 일반 선택 시 자동 중심 복귀 없음
- 색인/문서 직접 이동 시 필요한 명시 초점 이동 유지

## 검수 API

```text
ProjectCurseRegionalMap.auditMapInteractionStability()
ProjectCurseRegionalMap.makeInteractionStabilityReport()
```
