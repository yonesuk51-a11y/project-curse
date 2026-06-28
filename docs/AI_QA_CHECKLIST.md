# AI QA Checklist

## 기능 QA
- 사이드 메뉴 열기/닫기
- 모든 사이드 메뉴 항목 게이지 로딩
- 게이지 바와 퍼센트 동기화
- 100% 후 검은 화면 잔상 없음
- 기록 열람은 ARCHIVE ACCESS 로딩
- 기록면/내부 페이지/세력마크는 로딩 없이 철컥음만

## 시각 QA
- 2000~2010년대 낡은 기관 단말기 분위기 유지
- 현대식 앱/네온 HUD/과한 파란색 금지
- 모바일 한 화면 한 정보 단위 원칙

## 설정 QA
- 세계지도는 권역 선택만
- 대륙 지도는 반추상 작전구역도
- 모바일 세력관계 360도 원형 금지
- 기록보관서는 사이드 메뉴 단일 버튼


## Content Opportunity QA

- 세계 개요, 세력, 지역지도, 기록보관서에서 비어 보이는 연결 컨텐츠 후보를 제안한다.
- 제안은 `CONTENT_SUGGESTION_REPORT.md`에 남기고, 사용자 승인 전에는 핵심 설정을 확정 추가하지 않는다.

## Remediation QA

- 반복 버그는 `docs/BUG_PATTERN_PLAYBOOK.md`와 `config/UAC_REMEDIATION_RULES.json` 기준으로 원인 후보와 수정 처방을 함께 출력한다.
