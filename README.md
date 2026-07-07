# MapPatch 5.9.4 — RealTraceMapBase_StaticSVG

이 빌드는 **실제 지도 실루엣 기반 정적 SVG 베이스맵** 버전이다.

핵심:
- 5.9.3의 단일 런타임을 유지했다.
- JS 라우터 / 이벤트 / 기록보관서 본문은 수정하지 않았다.
- 실제 지도 스크린샷을 삽입하지 않고, 실제 지형·해안·하천 실루엣을 참고한 자체 제작 SVG로 재구성했다.
- 서울 / 부산 / 홍콩 / 란저우 4개 주요 작전권을 우선 Real Trace 스타일로 재작성했다.
- 오버레이 면색을 더 약화해 도시 베이스맵이 먼저 읽히게 했다.

---

# MapPatch 5.9.3 — SemiRealMapBase_LandmarkSilhouette

이 빌드는 **실제 지도풍 준실제 베이스맵 강화 버전**이다.

핵심:
- 5.9.2c의 단일 지도 런타임을 유지했다.
- JS 라우터 / 사이드 메뉴 이벤트 / 지도 메뉴 이벤트는 변경하지 않았다.
- `assets/maps/dedicated_base/`의 도시별 SVG 베이스맵을 준실제 지도풍으로 재작성했다.
- 서울은 한강·교량·남북 도심 차이를 강화했다.
- 부산은 항만·부두·컨테이너 야드·선박 실루엣을 강화했다.
- 홍콩은 고밀도 도심·복잡한 해안·항만 진입축을 강화했다.
- 란저우는 내륙 하천·협곡축·공업 차단구·심부 반응권을 강화했다.
- 기타 국외 봉쇄권도 각 지역 실루엣을 더 구분되게 보강했다.
- 오버레이 면색을 약화해 베이스맵이 먼저 읽히도록 조정했다.

---

# MapPatch 5.9.2c — RecordSurfaceBannerRemoval

이 빌드는 **5.9.2b SourceCleanup_DocPrune 기준의 기록면 배너 제거 버전**이다.

핵심:
- 기록 보관서에서 기록면/하위 기록면 버튼을 누를 때 뜨던 `RECORD SURFACE:` 배너를 제거했다.
- 실제 기록 본문, 탭 구조, 이미지, 기록 데이터는 변경하지 않았다.
- 기존 Record Surface 전환 런타임 함수와 바인딩 호출을 제거했다.
- 관련 CSS 규칙도 제거했다.
- 5.9.2b의 소스 정리 상태와 5.9.2a의 사이드 Drawer 복구 상태는 유지했다.

---

# Project Curse — U.A.C Server

## Current Build

**MapPatch5.9.2b — SourceCleanup_DocPrune**

이 빌드는 5.9.2a 기능 상태를 유지하면서, 실행에 필요 없는 구형 자료와 오래된 패치 문서를 정리한 버전이다.

## 핵심 상태

- 5.8.9 CleanMapRuntime 기반 단일 지도 런타임 유지
- 5.9.1 지도 Viewport / Telemetry Log 확장 유지
- 5.9.2 도시별 베이스맵 고유성 강화 유지
- 5.9.2a 사이드 메뉴 Drawer 복구 유지
- 5.9.2b 소스 정리 / 문서 정리 적용

## 주요 기능

- 왼쪽 사이드 메뉴 Accordion Drawer
- 지역지도 내부 지도 Drawer
- 도시별 Dedicated BaseMap SVG
- 하단 OPERATION TELEMETRY 패널
- 마커 클릭 시 우측 정보 패널 / 하단 선택 좌표 동시 갱신
- U.A.C 중심 단일 DOM 세력관계도
- 기록보관서 본문 유지
- 확대 / 드래그 없는 고정 작전지도

## 현재 지도 자산

`assets/maps/dedicated_base/`

- `world_base_dark.svg`
- `seoul_base_dark.svg`
- `busan_base_dark.svg`
- `hongkong_base_dark.svg`
- `lanzhou_base_dark.svg`
- `northsea_base_dark.svg`
- `pacificnw_base_dark.svg`
- `delhi_base_dark.svg`
- `australia_base_dark.svg`
- `sahel_base_dark.svg`

## 정리된 항목

- 더 이상 참조되지 않는 `legacy_assets/`
- 구형 continent map 생성 스크립트
- 루트에 누적되어 있던 오래된 PATCH / CHANGELOG / MANUAL_CHECK 문서

제거 상세 목록은 `dev_notes/SOURCE_CLEANUP_REMOVAL_REPORT_5_9_2B.txt` 참고.

## 수동 확인

`MANUAL_CHECK_MapPatch5_9_2b.md` 참고.


## Current patch note

Current working patch: MapPatch5.15.2ad_PCSidebarRestore_UIDiet_AudioSync_NoVHS. This build is PC-first; mobile drawer behavior is intentionally not included.
