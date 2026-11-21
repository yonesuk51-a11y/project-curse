@AGENTS.md

## Claude 전용

- 미리보기는 `.claude/launch.json`의 `project-curse` 설정을 쓴다(포트 4173).
- Codex는 `codex exec -m gpt-6-luna -c model_reasoning_effort="max"`로 실행한다. 2026-11-21 사용자 결정: 전에 쓰던 `gpt-6-astra`와 Codex 기본 설정의 `gpt-6.1-sol`은 ChatGPT 계정으로 쓰는 Codex에서 지원되지 않는다. 쓸 수 있는 모델은 `codex debug models`의 목록(visibility `list`)에서 확인한다. 코드 작업은 git worktree와 `codex/<주제>` 브랜치에서, 이미지 작업은 `output/imagegen/`에서 하게 한다.
- 지시문은 파일로 쓰고 `codex exec ... - < 지시문 파일`로 넘긴다. 백그라운드로 돌려도 표준 입력 대기로 멈추지 않는다.
- Codex가 만든 이미지는 Read로 직접 보고 AGENTS.md 5절 기준으로 판단한다.
