# Future Patch Pointer

Current baseline: `5.29.0 Adaptive Media Pipeline`

Completed in this baseline:
`Responsive WebP / Original-on-demand / Media Recovery States / Route and Cinematic Warmup`

Primary scope:

- 이미지 86개·16.57MiB를 측정하고 용량 집중도가 높은 PNG·JPEG 원본 20개를 최적화 대상으로 한정
- 원본 파일은 변경하지 않고 480px·최대 960px WebP 파생본 40개를 별도 `responsive/` 계층에 추가
- 일반 문서·증거 카드·영상 기록에서 `srcset`과 `sizes`로 화면 폭에 맞는 파생본 선택
- 증거 확대와 원본 비교 화면에서만 보존 원본을 요청하는 original-on-demand 경로 적용
- 이미지 요청, 디코딩, 복구 완료, 손실 상태를 실제 load/decode 사건과 연결
- 원본 비교 슬라이더를 두 프레임이 모두 준비될 때까지 비활성화하고 실패 시 재요청 제공
- 다음 영상 이미지 사전 준비와 화면 전환 중 대표 프레임 준비를 공통 미디어 런타임으로 연결
- 데이터 절약·2G·모션 감소 환경에서 가벼운 후보와 연출을 사용하는 적응 정책 추가
- 적용 수, 준비 성공, 실패, 전송·디코딩 바이트를 확인할 수 있는 로컬 진단 API 추가
- 독립 문서 다섯 개에도 동일한 미디어 매니페스트·런타임·복구 스타일 적용

Next planned pass:

- 메뉴별 색상·레이아웃·진입 동작을 지도·연표·분석·기록 용도에 맞게 더 분리
- 초기 화면과 각 채널의 LCP·CLS·전송량을 실제 공개 배포 환경에서 재측정
- 사용자 제공 원본이 추가되면 `RECONSTRUCTED`·`UNVERIFIED` 항목과 직접 비교해 기본 노출본 결정
- 메뉴별 음향 정체성 확대와 긴 배경음의 중복·잔류 여부 재점검
- 공개 배포 전 음원·영상·이미지 라이선스와 GitHub Pages 배포 보안 최종 점검
