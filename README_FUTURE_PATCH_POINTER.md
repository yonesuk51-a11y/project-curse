# Future Patch Pointer

Current baseline: `5.32.0 Adaptive Link & Recovery`

Completed in this baseline:
`Adaptive Quality Tiers / Data Saver / Offline Recovery / Shared Media Policy`

Primary scope:

- 데이터 절약, 2G·3G, 지연·대역폭, 메모리, CPU 신호를 통합한 자동 품질 등급 추가
- AUTO·DATA SAVE·HIGH 전송 품질을 로컬 설정에 저장하고 적용 근거를 진단 패널에 표시
- 제한 환경에서 화면 이미지 사전 준비, 대용량 환경음, 영상 선로딩과 지도 애니메이션·필터 억제
- 채널 전환 시간은 유지하면서 사전 준비만 건너뛰는 보존형 전환 적용
- 온라인·오프라인 변화를 감지하는 연결 복구 패널과 실패 이미지 재요청 경로 추가
- 데스크톱 자동·수동 절약, 오프라인 왕복, 390px 데이터 절약·2G·저사양 환경 검증
- 모바일 설정 패널 폭 384px, 가로 넘침 0, 제한 환경 브라우저 오류 0 확인

Next planned pass:

- 실제 중저가 Android 기기에서 배터리·발열·메모리 사용량을 장시간 측정
- 사용자 제공 원본이 추가되면 `RECONSTRUCTED`·`UNVERIFIED` 항목과 직접 비교해 기본 노출본 결정
- 각 채널 전용 배경음은 라이선스와 잔류 재생 검증이 끝난 자산부터 선택적으로 추가
- 설정 패널의 상세 진단을 일반 상태와 개발자 계측으로 분리할지 사용성 확인
- 공개 배포 전 음원·영상·이미지 라이선스와 GitHub Pages 배포 보안 최종 점검
