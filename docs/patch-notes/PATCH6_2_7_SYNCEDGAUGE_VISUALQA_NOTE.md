# Patch 6.2.7 — Synced Gauge Runtime / Visual QA

- 게이지 바와 퍼센트 숫자를 단일 JS 컨트롤러에서 같은 프레임으로 갱신하도록 통합했다.
- 로딩 완료 후 검은 화면 잔상 방지를 위해 완료 상태에서 배경 오버레이를 즉시 투명화하고 짧은 unfold 후 제거한다.
- `config/UAC_CANON_RULES.json` 기준 규칙 파일을 추가했다.
- `tools/qa/run_all_qa.py` 자동 QA 스크립트와 기능/시각/설정/지도/오디오 QA 리포트를 추가했다.
- 구버전 실제 지도 생성 스크립트와 오래된 패치노트 잔존 데이터를 최종 ZIP에서 제외했다.
