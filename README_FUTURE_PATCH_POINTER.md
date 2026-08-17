# Future Patch Pointer

Current baseline: `5.31.0 Live Status & Performance`

Completed in this baseline:
`Live Channel Counters / Session Telemetry / Deferred Ambient Audio / Measured Boot and Handoff`

Primary scope:

- 공개 5.30 첫 기동·전송량·LCP·CLS·다섯 채널 전환 시간을 실제 Chromium에서 기준 측정
- 부팅 화면 약 8.69초와 채널 전환 0.81–0.84초는 유지해 읽을 수 있는 연출 시간 보존
- 최초 세션 4.49MB 가운데 3.09MB를 차지하던 환경음을 첫 사용자 입력 뒤 요청하도록 변경
- 단말 수신 신호, 활성 작전·순례, 연결 사건, 분석 파일, 읽지 않은 판정 기록을 다섯 채널 배지에 연결
- 작전·순례·판정 저장 이벤트가 메뉴 배지와 화면 헤더 계기를 함께 갱신
- 부팅 노출, DOM 준비, 전송량, 마지막·평균 채널 전환과 CLS를 로컬 세션 진단 패널에 표시
- LCP·CLS·long task·리소스·부팅·전환 측정값을 로컬 진단 API로 제공
- 모바일 채널 배지와 2열 세션 계기판, 모션 감소 시 경보 점멸 제거 적용
- 공개 5.31 첫 입력 전 전송량 665KB, 환경음 요청 0회, 채널 전환 841ms, CLS 0 확인

Next planned pass:

- 저속 연결·데이터 절약·중저가 모바일 환경에서 실제 장면 전환과 이미지 준비 시간 추가 측정
- 사용자 제공 원본이 추가되면 `RECONSTRUCTED`·`UNVERIFIED` 항목과 직접 비교해 기본 노출본 결정
- 각 채널 전용 배경음은 라이선스와 잔류 재생 검증이 끝난 자산부터 선택적으로 추가
- 세션 진단을 개발자용 상세 패널과 일반 사용자용 간단 상태로 분리할지 사용성 확인
- 공개 배포 전 음원·영상·이미지 라이선스와 GitHub Pages 배포 보안 최종 점검
