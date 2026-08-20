# Future Patch Pointer

Current baseline: `5.43.0 Core Sound Identity`

Completed in this baseline:
`12 Generated Core Signals / 5 Audio Buses / 11 Acoustic Profiles / 186 Registered Media`

Primary scope:

- 외부 샘플을 쓰지 않은 48 kHz 모노 PCM 핵심 효과음 12개 생성
- 단말·메뉴·기록·증거·통신·작전·접근 거부 의미 이벤트를 새 음향 팩에 연결
- 다섯 주 화면, 내부 문서, 대흑림·데드존과 시나리오용 11개 음향 프로필 적용
- MASTER·AMBIENT·INTERFACE·RECORD·ALERT 저장형 믹서와 12종 미리듣기 제공
- 기존 기록 영상·배경음·보호 기록 음향 경로를 유지하고 공통 UI 신호만 분리
- 미디어 186개 중 자체 합성 음향 12개를 `PROJECT_SYNTHESIS / PROJECT_GENERATED`로 등록
- 기존 음원 23개와 영상 7개의 `LICENSE_REVIEW` 상태 및 참고 ZIP 공개 노출 0건 유지
- 생성기 재현성, WAV 헤더·채널·샘플레이트, 의미 이벤트 연결과 모바일 설정 UI 검증

Next planned pass:

- 실제 청취 기준으로 12개 신호의 주파수 피로도·작은 스피커 가독성·상대 음량 미세 조정
- 기존 음원 23개와 영상 7개의 출처 증빙 확보 또는 기록별 자체 제작 대체안 수립
- 기록 영상용 장시간 배경음은 공통 UI 팩과 분리한 별도 음향 교체 계획 작성
- Archive ENEX 원본 계열의 공개 재배포 범위를 파일 단위로 검토
- GitHub Pages 관리형 Actions 경고와 정적 배포 보안 범위를 분리해 점검
