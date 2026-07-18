# CHANGELOG — MapPatch 5.15.2ca1

## TerminalHome / AmbientScopeFix

- `단말 상태` 홈 화면 추가.
- 기본 진입 경로를 홈 화면으로 변경.
- 업로드된 `The Dread` 최적화 MP3를 기존 ambient 경로에 적용.
- 배경음 허용 범위를 홈 화면으로 제한.
- 세계 연표, 지역 상황도, 관계도, 세력 파일, 기록보관실 목록, 기록 상세에서는 기본 배경음 즉시 정지.
- 기록별 전용 음원과 효과음은 변경하지 않음.
- 구형 `startAmbient()` 이벤트가 설정 화면에서 재생을 시도해도 즉시 음소거·정지하도록 후단 상태관리 추가.
- `ProjectCurseQA.checkAudioScope()` 추가.

## 공개 배포 주의

음원 파일명 또는 영상 제목에 `Copyright Free`가 포함된 것만으로 이용허가가 보증되지는 않는다.
GitHub Pages 공개 배포 전 원본 게시자의 라이선스, 출처 표기, 재배포 허용 조건을 확인해야 한다.
