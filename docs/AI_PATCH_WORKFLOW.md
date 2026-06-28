# AI Patch Workflow / U.A.C 제작 루프

1. `config/UAC_CANON_RULES.json`을 먼저 확인한다.
2. 기능 수정 전에 구버전 문구, 지도 참조, 오디오 역할을 검색한다.
3. 수정 후 `python tools/qa/run_all_qa.py`를 실행한다.
4. `index.html?uac_qa=1` 런타임 QA로 PC/모바일 메뉴, 로딩, 지도, 기록 열람을 확인한다.
5. 실패 항목이 있으면 즉시 수정하고 QA를 다시 실행한다.
6. PASS 범위와 미검증 범위를 QA 리포트에 명시한 뒤 ZIP을 제출한다.

고정 원칙: 기능만 되는지 보지 말고, 영상 분위기와 설정 연결성까지 함께 검사한다.
