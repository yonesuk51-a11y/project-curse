# MapPatch 5.15.2bz2

## OriginalityAuditContext_WithdrawalCriteriaHotfix

- `checkOriginalityAudit()`가 부정·배제 문맥까지 병기 찬양 표현으로 오판하던 문제를 수정했다.
- `결전 병기가 아니라`, `사용하지 않는다`, `분류하지 않는다` 같은 문맥은 독자성 오류로 집계하지 않는다.
- 실제 노출 문서에서 `결전 병기`, `초인적으로 강화` 문구를 제거해 감사 결과가 현재 문서 내용과 직접 일치하도록 정리했다.
- 오염 차폐 장비군 운용 항목에 `철수 기준`을 명시해 장비 체계 QA의 실패·철수·폐기 서술 검사를 충족시켰다.
- 화면 구성, 카드 수, 장비 6계열 분류, 세력·지도·현상 기록은 변경하지 않았다.

## Expected QA

```text
[ProjectCurseQA ScreenSweep] 5.15.2bz2
ok=true errors=0 warnings=0 info=0
equipmentTaxonomy=ok categories=6/6 standalone=0 orphan=0 codex=removed-by-interface-reset
originalityAudit=ok legacyTerms=0 superWeaponLanguage=0
```
