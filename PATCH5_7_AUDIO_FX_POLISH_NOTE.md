# PATCH 5.7 — AudioFXPolish + Faction Relation Node Visibility Fix

## 기준 버전
MapPatch5_6_4_1_FactionRelationLayoutRelationHotfix

## 포함 범위
- 짧은 UI 효과음의 중복 재생을 억제하는 오디오 게이트 추가
- 세력관계도 연결 노드 가시성 복구
- 기본 상태에서 모든 세력 노드가 선명하게 보이도록 재렌더링
- U.A.C 선택/기본 진입 시 직접 연결 노드가 사라지는 문제 방지
- 선택 상태에서도 무관 노드는 완전 숨김이 아니라 낮은 명도로만 후퇴
- 관계선보다 노드가 우선 보이도록 z-index 및 opacity 조정
- 세력관계도 분석 패널은 기존 관계 설명을 유지하되 5.7 전용 패널로 통합

## 검수 포인트
- 세력관계도 기본 진입 시 N.H.C, S.I.D, F.H.C, C.P.D, A.R.F, Ash Crew, Syndicate, Amarion, Ushnoda Cult, Haimun이 모두 보이는지
- U.A.C 선택 시 직접 연결 노드가 사라지지 않는지
- 노드 클릭음이 과하게 겹치지 않는지
- 관계표 클릭/노드 클릭 연동이 유지되는지
