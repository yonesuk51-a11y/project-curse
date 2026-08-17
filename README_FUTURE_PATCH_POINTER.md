# Future Patch Pointer

Current baseline: `5.33.0 Readable Settings & Session Health`

Completed in this baseline:
`Readable Preference Hierarchy / Session Health / Collapsible Diagnostics / Mobile-safe Actions`

Primary scope:

- 설정 상단에 현재 운용 상태와 링크·미디어·환경음 상태를 한눈에 읽는 요약 카드 추가
- 전송·화면과 음향 설정을 목적별 섹션으로 분리하고 현재 품질 등급을 설정 버튼에도 표시
- 부팅·DOM·전송량·전환·세션 시간·힙 메모리를 접힌 고급 진단으로 이동
- 진단값을 즉시 다시 측정하는 새로고침 동작과 세션 가시·비가시 시간 계측 추가
- 모바일 설정 본문만 독립 스크롤하고 닫기·초기화 버튼은 화면 하단에 항상 유지
- 숨겨진 연결 복구 패널이 모바일 포인터 입력을 가로채던 충돌 제거
- 390px 저사양 환경에서 가로 넘침 0, 고급 진단 스크롤 후 하단 동작 유지, 브라우저 오류 0 확인

Next planned pass:

- 설정·기록·지도 화면의 키보드 이동 순서, 포커스 표시, 스크린리더 안내를 통합 점검
- 상태 변화 알림의 `aria-live` 빈도와 중복 발화를 실제 보조 기술 환경에서 조정
- 저대비 텍스트, 작은 터치 목표, 모션 감소 모드의 시각적 대체 표현을 전 채널에서 재검토
- 실제 중저가 Android 기기에서 배터리·발열·메모리 사용량을 장시간 측정
- 사용자 제공 원본이 추가되면 `RECONSTRUCTED`·`UNVERIFIED` 항목과 직접 비교해 기본 노출본 결정
- 각 채널 전용 배경음은 라이선스와 잔류 재생 검증이 끝난 자산부터 선택적으로 추가
- 공개 배포 전 음원·영상·이미지 라이선스와 GitHub Pages 배포 보안 최종 점검
