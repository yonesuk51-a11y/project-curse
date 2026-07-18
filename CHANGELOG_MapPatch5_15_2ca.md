# MapPatch 5.15.2ca

## EquipmentArchive_EditorialInteractionPass

- 장비 6계열을 일반 기록 묶음에서 분리해 `장비·봉쇄 기록` 전용 그룹으로 재배치했다.
- 구형 공개 문서 화이트리스트가 장비 6계열을 다시 `기밀 처리됨` 상태로 덮어쓰던 문제를 차단했다.
- 6개 카드의 기록 축을 고정했다.
  - 장비 기록 5개
  - 봉쇄 인프라 1개
- 카드 요약문, 담당 기관, 운용 권역과 열람 버튼을 통일하고 PC 화면의 카드 높이를 균등화했다.
- 각 상세 기록을 다음 5개 항목으로 재편했다.
  - 포함 항목
  - 운용 원칙
  - 성능 저하·사용 중지·철수 기준
  - 회수·폐기 절차
  - 현장 실패 기록
- 각 문서에 연결 장비 기록, 세력 파일, 지역 상황도 버튼을 추가했다. 총 연결 동작은 18개다.
- 관련 기록 이동 후에도 상세 기록 열람 상태가 구형 DOM 정규화 패스에 의해 닫히지 않도록 상태 보존 로직을 추가했다.
- 검색·열람 상태·기록 축 필터에 장비 6계열을 통합하고 `전체` 선택 시 기록 축 필터도 초기화하도록 정리했다.
- 상세 기록을 열어 둔 상태에서도 `checkEquipmentTaxonomy()`가 숨김 여부와 무관하게 6개 문서를 정상 판정하도록 수정했다.
- 구형 패치가 클릭 이후 QA 래퍼를 다시 덮어쓰는 문제를 방지하고 `5.15.2ca` 검사가 최종 적용되도록 보정했다.

## Added QA

```js
ProjectCurseQA.checkEquipmentArchiveUI()
```

검사 범위:

- 전용 그룹 존재
- 카드 6개 및 열람 버튼 6개
- 기록 축 6개 정합성
- 상세 문서 6개와 필수 항목 5개
- 연결 동작 18개
- 구형 봉인 문구 잔존 여부
- PC 카드 높이 편차

## Expected QA

```text
[ProjectCurseQA ScreenSweep] 5.15.2ca
ok=true errors=0 warnings=0 info=0
equipmentTaxonomy=ok categories=6/6 standalone=0 orphan=0 codex=removed-by-interface-reset
originalityAudit=ok legacyTerms=0 superWeaponLanguage=0
equipmentArchiveUI=ok cards=6/6 open=6/6 axis=6/6 details=6/6 related=18 heightSpread=0
```
