# 5.15.2bz1 Manual Check

1. 새로고침 후 `ProjectCurseQA.checkEquipmentTaxonomy()`를 실행합니다.
2. 결과가 `ok=true`, `equipmentCategoryCount=6`, `requiredEquipmentCategoryCount=6`인지 확인합니다.
3. `categoryMissing=[]`, `standaloneEquipmentCards=0`, `missingFailureTerms=[]`인지 확인합니다.
4. 현재 InterfaceReset 구조에서는 `codexState="removed-by-interface-reset"`가 정상입니다.
5. `ProjectCurseQA.checkOriginalityAudit()`가 `ok=true`인지 확인합니다.
6. `ProjectCurseQA.screenSweep().then(r => console.log(ProjectCurseQA.sweepReportText(r)))`를 실행합니다.
7. 상단의 `ok/errors/warnings/info`와 아래 `equipmentTaxonomy`, `originalityAudit` 상태가 서로 일치하는지 확인합니다.
