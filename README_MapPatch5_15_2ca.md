# Project Curse — MapPatch 5.15.2ca

`5.15.2bz2`를 기준으로 장비 6계열의 실제 기록보관실 화면과 상호작용을 정리한 편집 패스다.

이번 패치는 장비 분류 자체를 다시 바꾸지 않는다. 기존 6계열을 전용 `장비·봉쇄 기록` 그룹에 배치하고, 카드와 상세 기록을 현장 운용·철수·회수·실패 기록 중심으로 재구성한다.

주요 변경:

- 장비 6계열 전용 카드 그룹
- 구형 기밀 처리 덮어쓰기 차단
- 카드 높이와 기록 축 정렬
- 상세 기록 5단 구조
- 연결 기록·세력 파일·지역 상황도 이동 버튼
- 열람 상태 보존
- 검색·필터 통합
- `checkEquipmentArchiveUI()` 추가

검증 명령:

```js
ProjectCurseQA.checkEquipmentTaxonomy()
ProjectCurseQA.checkOriginalityAudit()
ProjectCurseQA.checkEquipmentArchiveUI()
ProjectCurseQA.screenSweep().then(r =>
  console.log(ProjectCurseQA.sweepReportText(r))
)
```
