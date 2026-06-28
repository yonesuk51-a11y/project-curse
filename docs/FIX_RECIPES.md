# Fix Recipes / U.A.C Patch QA

## 패치 수정 루프

1. 실패 항목을 `QA_FINDINGS.json`에서 확인한다.
2. 같은 유형이 `config/UAC_REMEDIATION_RULES.json`에 있는지 확인한다.
3. 해당 bug pattern의 `fix` 항목을 우선 적용한다.
4. `remove` 항목에 해당하는 구버전 코드/패턴을 검색해 제거한다.
5. `python tools/qa/run_all_qa.py`를 다시 실행한다.
6. 가능하면 `index.html?uac_qa=1`로 런타임 QA를 확인한다.

## 중요 원칙

- 새 로딩 시스템과 구 팝업 시스템을 섞지 않는다.
- 기록면/내부 페이지/세력마크에는 로딩을 넣지 않는다.
- 세계지도는 권역 선택 전용이다.
- 모바일 세력관계는 360도 원형이 아니라 카드/포커스 뷰를 우선한다.
- 효과음은 역할별 하나만 허용한다.
