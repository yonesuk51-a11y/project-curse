# CHANGELOG — MapPatch 5.15.2ax

## Added
- `evidenceCenter` 전용 시퀀스 레이아웃.
- `buildEvidenceCenterBlock()` 빌더.
- 시퀀스 재진입 보호용 `hardResetSequenceRuntime()`.
- 런타임 타이머 충돌 방지를 위한 `runId` 상태값.

## Changed
- 증거성 사진 기록을 중앙 이미지 + 하단 캡션 + 보고문 구조로 변경.
- 종교 시퀀스 줄 단위 reveal을 블록 단위 reveal로 변경.
- `타락의 과정 및 형태` 기존 이미지 복구.
- `타락 징후 / Signs of Corruption` 페이지 추가.
- 정적 문서와 인덱스 내 Cults_871104 본문을 새 문장 톤에 맞게 동기화.

## Fixed
- `돌아가기` 이후 같은 기록을 다시 열 때 인트로/페이지/타이머/class 상태가 꼬일 수 있는 문제.
- 기록을 끝까지 본 뒤 같은 기록을 다시 열 때 이전 실행 상태가 남을 수 있는 문제.
- 증거 이미지가 좌우 분할형으로 남아 참고 이미지식 중앙 배치와 어긋나던 문제.
