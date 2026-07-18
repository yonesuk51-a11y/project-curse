# Manual Check — 5.15.2bz2

1. 브라우저 강력 새로고침 후 현재 버전이 `5.15.2bz2`인지 확인한다.
2. `ProjectCurseQA.checkEquipmentTaxonomy()` 실행:
   - `ok: true`
   - `equipmentCategoryCount: 6`
   - `categoryMissing: []`
   - `missingFailureTerms: []`
3. `ProjectCurseQA.checkOriginalityAudit()` 실행:
   - `ok: true`
   - `legacyReferenceTerms: []`
   - `superWeaponDescriptions: []`
4. `ProjectCurseQA.screenSweep()` 실행:
   - errors 0
   - warnings 0
   - info 0
