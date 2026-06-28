# PATCH6.2.8 — ContentSuggestion / Remediation QA

- `CONTENT_SUGGESTION_REPORT.md`를 추가해 세계 개요, 세력, 지역지도, 기록보관서별 컨텐츠 보강 후보를 제안한다.
- 새 설정을 임의 확정하지 않고, “제안/후보” 단계로 분리한다.
- `docs/BUG_PATTERN_PLAYBOOK.md`와 `docs/FIX_RECIPES.md`를 추가해 반복 버그별 원인 후보, 수정 방식, 제거해야 할 구버전 패턴을 문서화했다.
- `config/UAC_REMEDIATION_RULES.json`을 추가해 QA가 버그 패턴별 처방을 기계적으로 읽을 수 있게 했다.
- `tools/qa/run_all_qa.py`에 Content Opportunity / Remediation QA 결과 생성을 추가했다.
- 6.2.7의 SyncedGaugeRuntime / VisualQA / 반추상 작전구역도 / 지정 오디오 5종 규칙은 유지한다.
