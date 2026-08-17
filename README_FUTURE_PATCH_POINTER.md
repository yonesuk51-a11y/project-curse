# Future Patch Pointer

Current baseline: `5.30.0 Menu Identity Overhaul`

Completed in this baseline:
`Five Channel Identity / Purpose-specific Entry Motion / Local FX and Audio Preferences / Mobile Channel Panel`

Primary scope:

- 단말·지도·연대기·정보 분석·기록보관소에 서로 다른 색상, 계기, 표식과 배경 문법 부여
- 런타임 재렌더링 뒤에도 유지되는 공통 채널 정체성 헤더와 다섯 채널 탐색 구조 추가
- 홈을 포함한 채널 번호·명칭·영문 코드를 데스크톱 상단 메뉴와 모바일 선택 패널에 통합
- 지도 레이더, 연대기 시간 눈금, 정보망 노드, 보관소 봉인 체계에 맞춘 화면별 진입 동작 추가
- 시각 효과 FULL/BALANCED/REDUCED, 인터페이스 음향, 환경음, 텍스트 등장 설정을 로컬 저장
- 운영체제 동작 줄이기 설정을 자동 우선하며 저장된 사용자 선택은 보존
- 기존 전체 음소거와 세부 음향 버스 설정의 역할을 분리
- 키보드 포커스 순환, Escape 닫기, 모바일 전체 높이 설정 패널과 진단 API 추가

Next planned pass:

- 초기 화면과 각 채널의 LCP·CLS·전송량을 실제 공개 배포 환경에서 재측정
- 사용자 제공 원본이 추가되면 `RECONSTRUCTED`·`UNVERIFIED` 항목과 직접 비교해 기본 노출본 결정
- 각 채널 전용 배경음은 라이선스와 잔류 재생 검증이 끝난 자산부터 선택적으로 추가
- 기록·지도 데이터가 늘어날 때 상단 채널 상태를 실제 미확인 건수와 동기화
- 공개 배포 전 음원·영상·이미지 라이선스와 GitHub Pages 배포 보안 최종 점검
