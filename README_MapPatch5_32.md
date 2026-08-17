# Project Curse 5.32.0

`Adaptive Link & Recovery`는 기존의 채널별 연출을 삭제하지 않고, 실제 환경에 맞춰 전송 비용이 큰 부분만 단계적으로 조절한다.

## 사용자 설정

- `AUTO`: 연결·기기 신호를 자동 판독한다.
- `DATA SAVE`: 반응형 이미지의 작은 후보를 우선하고 사전 준비, 환경음, 영상 선로딩과 고비용 지도 효과를 억제한다.
- `HIGH`: 온라인 상태에서 전체 품질을 유지한다.

기존의 시각 효과, 인터페이스 음향, 환경음, 텍스트 등장 설정은 그대로 유지된다. 전송 품질은 이 설정들을 대체하지 않고 네트워크 요청과 렌더링 비용의 상한만 정한다.

## 오프라인 동작

연결이 끊겨도 이미 열린 문서, 로컬에 저장된 작전·순례·판정 상태와 메뉴 구조는 유지된다. 화면 하단의 `PC-04 / CONNECTION RECOVERY` 패널에서 상태를 확인하고, 연결이 복구된 뒤 실패한 시각 자료를 다시 요청할 수 있다.

## 개발자 진단

```js
ProjectCurseQuality.getDiagnostics()
ProjectCurseQuality.refresh()
ProjectCurseQuality.allows('routeWarmup')
ProjectCurseMedia.getDiagnostics()
ProjectCurseMedia.retryFailed()
```

품질 변경은 `projectcurse:quality-change`, 시각 자료 실패는 `projectcurse:media-error` 이벤트로 전달된다.
