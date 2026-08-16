# Future Patch Pointer

Current baseline: `5.28.0 Visual Evidence Archive`

Completed in this baseline:
`Provenance Console / Honest Reconstruction Labels / Source Comparison Viewer / Cinematic Evidence Handoff`

Primary scope:

- 내부 문서의 모든 대표·본문·그룹 이미지에 시각 증거 ID와 공개 등급 표시
- ORIGINAL, STABILIZED, RECONSTRUCTED, UNVERIFIED 네 가지 출처 상태 구분
- 문서별 원본·보정본·복원본·대조 대기 수량과 필터 가능한 증거 카드 패널 추가
- 증거 카드와 본문 이미지에서 전체 화면 확대·출처 메타데이터·이전/다음 탐색 지원
- 실제 사본 관계가 등록된 이미지에만 경계 슬라이더 기반 원본 비교 화면 제공
- 대흑림·데드존 복원 추정본에 `원본 미등록` 상태와 사용 제한 경고 표시
- 괴이 분류도 두 사본과 IMAGE-241HS 원본 계열·보호 기록 크롭을 실제 비교 관계로 연결
- 영상형 기록의 이미지 장면에서 재생을 일시정지하고 같은 시각 증거 화면으로 진입
- 기존 보호 본문을 수정하지 않고 런타임 진입점만 추가해 보호 해시 유지
- 독립 문서 다섯 개에도 동일한 시각 증거 데이터와 스타일 로드
- 확대·비교·필터·닫기용 의미 기반 효과음과 모바일 단일 열 비교 화면 추가
- 새 원본 제공 시 기존 복원본을 덮어쓰지 않고 comparison 항목으로 연결하는 정책 문서화

Next planned pass:

- 신규 PNG의 WebP 파생본과 데스크톱·모바일 해상도별 `srcset` 최적화
- 사용 빈도가 높은 기록 이미지의 실제 파일 크기·디코딩 비용·LCP 영향 측정
- 사용자 제공 원본이 추가되면 `RECONSTRUCTED`·`UNVERIFIED` 항목과 직접 비교해 기본 노출본 결정
- 메뉴별 음향 정체성 확대와 긴 배경음의 중복·잔류 여부 재점검
- 공개 배포 전 음원·영상·이미지 라이선스와 GitHub Pages 배포 보안 최종 점검
