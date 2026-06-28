# PATCH 5.8.1R-39 — FinalHotfix

## 목적

R38 `FinalHotfixReadinessPass`에서 전 권역 최종 점검 결과가 정상으로 확인된 상태를 기준으로, 지역지도 시스템을 `5.8.1R-39 FinalHotfix` 안정본으로 고정합니다.

이번 패치는 새 기능 추가가 아니라 최종 핫픽스 기준 확정 패치입니다.

## 반영 내용

- 지도 모듈 버전을 `5.8.1R-39 FinalHotfix`로 갱신
- 최종 핫픽스 리포트 표기 정리
- README에 R38 전 권역 정상 검수 결과 반영
- R24~R38 기능 유지
- 구형 지도 구조/QA 폴더 미복구

## R38 기준 정상 검수 결과

- 상태: 정상
- 경고: 0건
- 문제 목록: 없음
- 권역: 8개
- 필터: 13개
- 색인: 10개
- 전체 색인 항목: 117개
- 지도 링크: 149개
- LINK AUDIT: 정상
- RECORD INDEX: 정상
- RELEASE CANDIDATE: 정상

## 유지 사항

- 세계지도 권역 선택 전용 구조
- 대륙 상세지도 필터
- 검수 모드
- SELF REVIEW
- LINK AUDIT
- RECORD INDEX
- 지도 ↔ 문서 양방향 연결
- 겹친 요소 후보 선택 메뉴
- 일반 화면 내부 코드 비노출

## 수정 파일

- `assets/js/r24_regional_map_rebuild.js`
- `assets/css/style.css`
- `README.md`
- `PATCH5_8_1R_39_FINAL_HOTFIX_NOTE.md`
