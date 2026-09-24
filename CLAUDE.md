@AGENTS.md

## Claude 전용

- 미리보기는 `.claude/launch.json`의 `project-curse` 설정을 쓴다(포트 4173).
- Codex는 `codex exec -m gpt-6-astra -c model_reasoning_effort="max"`로 실행한다. 코드 작업은 git worktree와 `codex/<주제>` 브랜치에서, 이미지 작업은 `output/imagegen/`에서 하게 한다.
- Codex가 만든 이미지는 Read로 직접 보고 AGENTS.md 5절 기준으로 판단한다.
