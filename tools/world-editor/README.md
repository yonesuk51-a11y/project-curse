# Project Curse 제작자 검토함

공개 사이트와 분리된 로컬 제작 도구다. 사이트 데이터를 읽어 검색 목록·상충 후보·이야기 소재 후보를 만들고, 기존 `verify-app`·`verify-data`를 실행한다. 결과와 제작자 피드백은 Git에 올리지 않는 `output/world-editor/`에 둔다. 제안은 정사, 이미지 채택, 공개 게시 승인이 아니다.

## 현재 자동화

| 주기 | 실행 | 경계 |
|---|---|---|
| 변경 뒤 약 1분 | 소스 해시가 안정되면 목록·검토 보고서 갱신과 두 기존 검사 실행 | 원본을 고치지 않음. 검사 실패도 보고서에 남김 |
| 매일 | `sources.json`의 허용된 공식 기관 5곳에서 참고 링크 발견 | 링크 제목은 사실 검증이 아님. 접근 실패를 우회하지 않음 |
| 매주 | 텍스트·설정 파일의 로컬 해시 백업 | 같은 PC·동기화 폴더의 복사본. 독립 백업 아님 |
| 매주 월요일 오전 10시(앱 자동화) | 이 스레드에 세계관·사이트 근거 검토 | 모델 사용량이 들며 정사·사이트·GitHub를 자동 변경하지 않음 |

Windows 작업 스케줄러의 `ProjectCurse-WorldEditor-ReadOnly-v1`은 현재 사용자 로그인 시 시작하고 매일 09:00에 꺼진 감시를 다시 시작한다. 중복 인스턴스는 시작하지 않는다. 로그인하지 않은 상태에서의 실행은 보장하지 않는다. `install-task.ps1`은 같은 이름의 다른 작업을 덮어쓰지 않으며 관리자 권한이나 계정 비밀번호를 요구하지 않는다. 설치는 실제 Windows 사용자 세션에서 다음처럼 실행한다. 시스템에서 PowerShell 스크립트를 막는 경우에만 두 번째 명령을 사용하며 그 호출 한 번에만 실행 정책을 바꾼다.

```powershell
powershell.exe -NoProfile -File tools/world-editor/install-task.ps1
powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/world-editor/install-task.ps1
```

작업을 멈출 때는 먼저 `node tools/world-editor/cli.mjs watch stop`으로 안전 종료를 요청하고, 자동 재시작까지 막으려면 Windows 작업 스케줄러에서 해당 작업을 사용 안 함으로 바꾼다. 다시 시작할 때는 작업을 사용으로 돌리고 실행한다. 다른 작업은 건드리지 않는다.

## 수동 실행

저장소 루트에서 Node.js로 실행한다.

```powershell
node tools/world-editor/cli.mjs audit
node tools/world-editor/cli.mjs status
node tools/world-editor/cli.mjs search 리버스
node tools/world-editor/cli.mjs research
node tools/world-editor/cli.mjs backup create
node tools/world-editor/cli.mjs backup verify <백업-ID>
node tools/world-editor/cli.mjs backup preview <백업-ID>
node tools/world-editor/cli.mjs serve
```

`serve`는 `http://127.0.0.1:8787`의 이 PC 전용 검토 화면을 연다. 현황, 근거가 달린 허점·소재 후보, 출처 접근 결과, 145건 규모의 설정 색인 검색을 볼 수 있다. 후보를 선택·보류·제외하는 것은 제작자의 메모이며 곧바로 원문을 수정하지 않는다. `serve`는 명령 창을 닫으면 종료된다. 포트를 다른 장치에 공개하거나 프록시로 연결하지 않는다.

`backup preview`는 `output/world-editor/restore-preview/`에 고유한 새 폴더를 만들어 모든 파일의 해시를 다시 확인한다. 사이트 파일 위로 복원하지 않는다. 백업은 52개에 이르면 자동 삭제 없이 생성을 멈춘다. `output/imagegen/`의 대용량 후보 이미지, Git 이력, 시스템 설정은 기본 복사본에 포함되지 않는다. 별도 물리 저장소 백업은 사용자가 마련해야 한다.

AI 검토를 별도 JSON으로 가져올 때에는 최신 `review-packet.json`의 입력 지문과 실제 파일·줄·해시가 일치해야 한다. 형식이 틀리거나 근거가 낡은 입력은 거부한다. `node tools/world-editor/cli.mjs review import <저장소 안 JSON 경로>`를 사용한다. 주간 앱 자동화는 우선 읽기·제안만 하므로 자동으로 이 가져오기를 실행하지 않는다.

## 결과와 품질 경계

- `latest.md` / `latest.json`: 최신 검사와 근거·제안. `reports/`: 실행별 기록.
- `catalog.json`: 기록 색인과 이름 언급 관계. 언급만으로 인과·동맹을 증명하지 않는다.
- `research.json`: 공식 기관 페이지 접근 상태와 발견 링크. 개별 사실과 저작권은 별도 확인한다.
- `feedback.json`: 제작자 선택과 이유. 변경된 근거는 낡은 선택으로 표시한다.
- `worker-state.json`: 감시 생존·오류·최근 작업. 실패는 조용히 성공으로 바꾸지 않는다.
- `backups/`, `restore-preview/`: 검증 가능한 로컬 복사본과 격리 복원 연습.

근거 있는 후보라도 자동으로 세계관의 진위를 확정할 수 없다. 특히 보호 원문 `Cults_871104`·`Immortality_860201`, `WORLD_CANON_LEDGER.md`의 판정, 이미지 채택은 기존 사용자 결정과 저장소 지침이 우선한다. `참고용/지옥`은 선·칠·저조도·연무 같은 분위기의 기준이며 인물, 구도, 문양, 영상/음원을 가져오지 않는다.

검증: `node --test tools/world-editor/world-editor.test.mjs`, `node tools/verify-app.mjs`, `node tools/verify-data.mjs`. 공개 지도 파일을 고친 경우 `node tools/stamp-assets.mjs`와 데스크톱·모바일 브라우저 확인도 필요하다. `.github/workflows/site-quality.yml`은 GitHub에 올라간 뒤에야 실행된다.
