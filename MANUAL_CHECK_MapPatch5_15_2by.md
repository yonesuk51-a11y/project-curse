# Manual Check — 5.15.2by

1. 기록보관실에서 기록 축 개수가 현상/장비/봉쇄/세력까지 채워졌는지 확인.
2. 레드존 이상현상과 장비·봉쇄 기록 카드의 [기록 열람]이 단말기 내부에서 열리는지 확인.
3. 관계도에서 Haimun, Amarion, Syndicate 등 외곽 노드 선택 시 전체 그래프가 과도하게 사라지지 않는지 확인.
4. 지역 상황도에서 마커 선택 시 관련 세력, 현상, 연결 기록, 봉쇄 판단이 보이는지 확인.
5. 콘솔 QA 실행:
   - ProjectCurseQA.screenSweep().then(r => console.log(ProjectCurseQA.sweepReportText(r)))
   - ProjectCurseQA.checkArchiveAxes()
   - ProjectCurseQA.checkAnomalyDocs()
   - ProjectCurseQA.checkInfrastructureDocs()
   - ProjectCurseQA.contentGapReportText()
