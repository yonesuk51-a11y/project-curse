# Project Curse — MapPatch 5.15.2bz2

`5.15.2bz1` 위에 적용된 QA·문구 정합성 핫픽스다.

변경 범위는 독자성 감사 문맥 판정과 장비 철수 기준 문구에 한정된다. 장비 6계열 병합 구조와 기존 ScopeLocked 화면은 유지한다.

검증 명령:

```js
ProjectCurseQA.checkEquipmentTaxonomy()
ProjectCurseQA.checkOriginalityAudit()
ProjectCurseQA.screenSweep().then(r => console.log(ProjectCurseQA.sweepReportText(r)))
```
