# PATCH 5.2 — Damaged Video Feed

기준: `MapPatch5_1_1_FHCTuned`

## 목적

영상 기록 / 회수 영상 / 현장 촬영 계열 기록에만 손상된 영상 피드 효과를 좁게 적용한다.

## 적용 범위

- `Immortality_860201` — 현장 촬영 / 통신 임무 원점 파일
- `Sakuma_Tape_991028` — 사쿠마 유타 실종 사건 테이프
- `불명_Record1_860204` — 아마리온 회수 영상 기록

## 반영 내용

- 기록 열람 로딩의 `video` 모드 추가
  - DAMAGED VIDEO FEED
  - SIGNAL RECOVERY
  - FRAME INDEX REBUILD
  - AUDIO CHANNEL DEGRADED
- 영상 기록 카드 전용 뱃지 추가
  - VIDEO LOG
  - SIGNAL DAMAGED
  - FRAME LOSS
- 영상 기록 내부 상단에 신호 복구 패널 추가
- 기록 이미지 주변에 약한 프레임 손상 / 신호 찢김 표시 추가
- 상단 서버 상태바에서 영상 기록 열람 중 `VIDEO FEED: DAMAGED` 상태 표시

## 안전 제한

- F.H.C 검열 효과는 변경하지 않음
- 지도 / 세력 / 배경음 / 왼쪽 메뉴 / 기록 열람 기본 함수는 유지
- 영상 계열 기록 외 문서에는 영상 패널을 삽입하지 않음
- 새 이미지 생성 없음
