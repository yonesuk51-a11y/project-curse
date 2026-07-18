# 5.15.2bz Manual Check

1. 장비 코덱스의 필터가 `전체 + 6개 장비 체계`로만 표시되는지 확인.
2. 각 장비 체계 선택 시 상세 패널의 기관·오염 상태·취급 경고·현장 메모가 정상 표시되는지 확인.
3. 기록보관실 장비·봉쇄 축에 6개 통합 문서만 표시되고 W-Coat/W-Fiber/Null Coating/파동기 독립 카드가 없는지 확인.
4. N.H.C 세력 기록에 위버맨시, 신경계 가속, 정신 격벽, 독점 병기 설명이 남지 않았는지 확인.
5. `ProjectCurseQA.checkEquipmentTaxonomy()` 실행 결과 `equipmentCategoryCount=6`, `standaloneEquipmentCards=0`인지 확인.
6. `ProjectCurseQA.checkOriginalityAudit()` 실행 결과 `legacyReferenceTerms=[]`, `superWeaponDescriptions=[]`인지 확인.
7. `ProjectCurseQA.screenSweep().then(r => console.log(ProjectCurseQA.sweepReportText(r)))` 실행 후 오류·경고를 확인.
