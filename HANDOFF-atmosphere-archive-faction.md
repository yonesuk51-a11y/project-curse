# 기록보관소·세력 분석 분위기 복원 인계

- 작업일: 2026-09-25
- 작업 브랜치: `codex/atmosphere-archive-faction`
- 작업 기준: `0893c36`
- 작업 버전: `분위기 복원 B / 2026-09-25`
- 반영 범위: 기록보관소 목록·상세·기록 영상 네 편, 세력 목록·상세, 해당 화면 검사. 셸 파일은 자산 주소 해시 외에 바꾸지 않았다.

## 바꾼 것

| 파일·위치 | 변경 내용 |
|---|---|
| `assets/app/js/screens/archive.js:70` | 목록 카드의 0.4초 열기 띠. 다음 클릭이나 아무 키로 즉시 이동하며, 화면 이탈 때 대기 작업을 취소한다. 효과 줄임에서는 지연 없이 이동한다. |
| `assets/app/js/screens/archive.js:124` | 그림 수신 표시, 정지·이동 스캔선, 실패 안내와 재요청. 일반 문서·감식 대화상자·영상·보호 기록 그림에 적용한다. 보호 기록 그림의 임시 감싸는 요소는 나갈 때 제거한다. |
| `assets/app/js/screens/archive.js:150` | 일반 증거 사진에 감식 보기용 `.tc-evidence-media`와 알려진 `data-record`, 선택적인 DTG·장소·좌표를 연결한다. 없는 값은 만들지 않는다. 기존 원본 비교 단추도 유지한다. |
| `assets/app/js/screens/archive.js:221` | 기록 코드와 장식 수치를 간략 보기에서 숨기고 표지의 출처 판정에 이상 신호 표지를 붙인다. 문서 목차의 영문과 한글을 나눈다. |
| `assets/app/js/screens/archive.js:434` | 작은 플레이어를 ‘영상 재생’ 단추로 여는 전체 화면 대화상자로 바꿨다. `tc-immersive`, 소리 설정 상속, 뷰어 음소거, 재생·정지·이전·다음·처음부터, 기록면 선택, 전체 대본을 제공한다. |
| `assets/app/js/screens/archive.js:521` | `PCApp.fx()`와 `pc:fx`를 사용한다. 셸 함수가 없으면 시스템 설정을 읽는다. 줄임에서도 재생 시계·자막·음향을 유지하며, 영상 손상 구간은 별도의 멈춘 영상 프레임으로 보인다. |
| `assets/app/js/screens/archive.js:559` | VHS 인트로와 장 전환, 불멸 작전의 검은 화면·비프, 사쿠마 마지막 사진의 영사기·생일 음원·전환 영상 순서를 연결한다. 매체 종료 이벤트가 없어도 기존 시간 설정에 따라 진행한다. |
| `assets/app/js/screens/archive.js:588` | 열 때 `PCAudio.isOn()`을 읽고, 닫기·Esc·자연 종료 때 몰입 상태를 해제하고 원래 재생 단추에 초점을 돌린다. Tab은 대화상자 안에서 순환한다. |
| `assets/app/js/screens/archive.js:714` | 화면 이탈 때 영상·음원·타이머·리스너·임시 그림 요소를 정리한다. 기록 등급 전달과 0.6초 이내 문서 해독 표시를 적용한다. |
| `assets/app/css/screens/archive.css:183` | 카드 순차 표시, 열기 띠, 문서 해독, 그림 수신 표면. |
| `assets/app/css/screens/archive.css:198` | 검은 영상 표면, 붉은 진행 막대, 약한 VHS 흔들림·스캔선·자막 번짐. 조작부는 손상 표면 밖에 두고, 좁은 화면에서는 재배치하며 본문 영역을 따로 스크롤한다. |
| `assets/app/css/screens/archive.css:245` | `html[data-fx="reduced"]`에서 움직임만 정지한다. 기존 화면 전용 움직임 줄이기 미디어 쿼리는 제거했다. |
| `assets/app/js/cinematic/cinematic-cults.js:13`, `cinematic-immortality.js:13`, `cinematic-ferals.js:13`, `cinematic-sakuma.js:14` | 재생 음량 설정. 대본 공급 함수·장면 데이터·등록 순서는 그대로다. |
| `assets/js/data/archive-cinematic-data.js:242` | 기존 미디어 네 파일의 경로만 재생 설정으로 추가했다. 교단 대본 배열은 변경하지 않았다. |
| `assets/app/js/screens/faction.js:19`, `:46`, `:142`, `:183` | 명시된 등급만 셸에 전달한다. 영한 겹표지를 분리한다. 신원 불명 근거가 있는 인물 이름을 최대 두 곳 표시하며 링크 밖에 둔다. 자유 해석 자료와 셸 표시 함수가 모두 있으면 표시한다. |
| `assets/app/css/screens/faction.css:93` | 간략 보기, 신원 불명 인물의 별도 링크 배치, 효과 줄임 선택자. |
| `tools/verify-app.d/archive.mjs:13`, `:87`, `:208`, `:276` | 효과 모드 규칙과 매체 존재·음량·몰입 조작 검사를 추가했다. 실제 화면 코드를 격리 실행하여 네 편의 재생 수명, 정지·재개 시점, 종료·정리, 보호 노드 복원을 검사한다. |
| `tools/verify-app.d/faction.mjs:41` | 효과 선택자, 간략 보기, 선택적인 셸 함수, 17개 상세 실행, 신원 표시 제한, 자유 해석, 없는 키와 정리를 검사한다. |
| `index.html` | `node tools/stamp-assets.mjs`가 만든 9개 자산 주소의 내용 해시만 변경했다. |

## 옛 연출과 대응

아래 옛 경로는 모두 `tools/fixtures/legacy-app/` 아래의 읽기 전용 대조 자료다.

| 옛 파일·줄 | 새 파일·줄 | 대응 |
|---|---|---|
| `assets/js/pages/archive-consolidation.js:222` | `assets/app/js/screens/archive.js:434`, `:588` | 옛 영상 직접 진입을 상세의 명시적인 재생 단추와 전체 화면 몰입 재생으로 잇는다. |
| `assets/js/core/record-cinematic-runtime.js:631`, `:1253` | `assets/app/js/screens/archive.js:434`, `:559` | 전체 화면 영상·VHS 인트로·장 전환·닫기. |
| `assets/css/record-cinematic.css:5`, `assets/css/style.css:8022` | `assets/app/css/screens/archive.css:198` | 화면 전체의 검은 증거 표면, 스캔선, 붉은 진행 표시. 셸에는 손상을 입히지 않는다. |
| `assets/js/core/record-cinematic-runtime.js:336`, `:1295`, `:1326`, `:1336` | `assets/app/js/screens/archive.js:434`, 네 `cinematic-*.js`의 음량 설정 | 배경음·효과음·인트로를 요청한 음량 범위로 복원한다. |
| `assets/js/core/record-cinematic-runtime.js:641`, `:1725` | `assets/js/data/archive-cinematic-data.js:242`, `assets/app/js/screens/archive.js:434` | VHS 잡음 영상과 라디오 잡음층. 옛 교단형 표면을 쓰던 교단·타락자·사쿠마에 연결한다. |
| `assets/js/core/record-cinematic-runtime.js:341`, `:714` | `assets/app/js/screens/archive.js:603` | 불멸 작전의 같은 장 안 이동에 950ms 검은 화면과 비프. 장이 바뀌면 등록된 전환 영상을 쓴다. |
| `assets/js/main.js:9` | `assets/js/data/archive-cinematic-data.js:245`, `assets/app/js/screens/archive.js:588` | 부드러운 기록 장착음을 몰입 재생 시작에 연결한다. |
| `assets/css/archive-consolidation.css:63`, `:69` | `assets/app/js/screens/archive.js:70`, `assets/app/css/screens/archive.css:183` | 카드 순차 표시와 카드 안의 열기 띠. |
| `assets/css/archive-document.css:8`, `:220` | `assets/app/js/screens/archive.js:740`, `assets/app/css/screens/archive.css:187` | 본문 단락을 짧게 해독하듯 표시한다. 0.6초 안에 끝난다. |
| `assets/css/adaptive-media.css:8`, `:16` | `assets/app/js/screens/archive.js:124`, `assets/app/css/screens/archive.css:190` | 그림을 받는 동안 수신 문구와 스캔선, 수신 뒤 제거, 줄임에서 정지한 표면. |

## 재생 설정과 데이터 경계

- 인트로: 네 편 모두 `0.68`. 장 전환: `0.78`.
- 배경음: 교단 `0.78`, 불멸 작전 `0.54`, 타락자 `0.68`, 사쿠마 `0.54`.
- 효과음: 기록 장착·장 이동·사진 `0.58`, 사쿠마 영사기 `0.40`, 생일 음원 `0.72`, 교신 `0.42`, 간섭·보고 `0.78`, 추적 `0.76`, 불멸 작전 검은 화면 비프 `0.40`.
- 라디오 잡음층: `0.17`. 사쿠마 생일 구간의 배경음 감쇄 `0.025`는 옛 특수 장면 동작을 유지한다.
- 위협 변환표: `CRITICAL → critical`, `HIGH → high`, `ELEVATED → elevated`, `GUARDED → guarded`, `LOW → low`. 그 외 값은 전달하지 않는다.
- 현재 기록 색인에는 `CRITICAL`, `HIGH`, `GUARDED`가 있다. 현재 세력 자료의 위험값은 ‘기억 오염’ 같은 설명이며 다섯 단계 등급이 아니다. 세력 등급을 새로 부여하지 않았다.
- 신원 이상 표지는 `certainty: unresolved` 또는 본명·현재 육체의 신원이 확인되지 않았다는 기존 정보 한계가 있을 때만 쓴다. 인물의 단순한 행방 불명은 근거로 쓰지 않는다.
- 사실 데이터·보호 원문·영상 대사 배열·원래 시각·장면 순서는 변경하지 않았다. 보호 그림의 임시 감싸는 요소·속성·위치는 화면 이탈 때 원상 복구한다.
- 상세 화면은 기존 자체 표지를 사용하므로 `screenHead()`의 채널 대표 그림을 추가하지 않는다.

## 간략 보기

- 숨김: 기록의 내부 코드 표지, 표지의 장식용 첨부·기록면 수, `READING INDEX`, `SOURCE STATE`, `CONTENTS` 영문 부분, 채널 영문 코드와 장식 통계, 영상의 중복 영문 부제·이미지 코드, `MARK / 01`, `04 FILES`, `PRIMARY INSTITUTIONS` 등 편제 영문 표지, 분석 문서 내부 키와 절별 영문 표지.
- 유지: 기록·세력 이름, 날짜, 본문, 소속·상태·관계, 출처 판정, 위험도, 보안 등급, 실제 운용 정보, 시각·교신·판정, 링크와 조작 단추. 관련 인물의 `2006년 명부` 표시는 영문 절 표지와 분리해 유지했다.
- `data-density`가 아직 없는 작업 트리에서도 두 화면 범위 안에서 간략 보기를 기본으로 한다. `full`이면 숨긴 표지가 다시 보인다.

## 확인한 것

- 작업 전 `verify-app`: 116/116, `verify-data`: 356/356 통과.
- 최종 `node tools/verify-app.mjs`: **129/129 통과**.
- 최종 `node tools/verify-data.mjs`: **356/356 통과**.
- `node tools/stamp-assets.mjs` 실행. `asset-stamps-current` 통과.
- `git diff --check` 통과. 변경 파일 허용 범위 대조 통과. `index.html`은 해시를 제외하면 기준 커밋과 같다.
- 원문 봉인 해시·보호 기록 사실 대조·교단 영상 대본 대조·기존 현장 판정 사본 대조가 통과했다.
- 격리 실행: 네 영상 시작·음향 상속·인트로 음량·정지·재개·Esc·포커스 복귀·반복 진입·화면 이탈 정리. 매체의 `ended` 이벤트 없이도 네 편을 마지막까지 진행하고 모두 종료한다.
- 격리 실행: 줄임에서도 900ms 간격 자막·소리 유지, 정지한 시간은 제외하고 재개, 효과·음소거 변경 시 기록면 유지, Tab 순환, 0.4초 인계 건너뛰기와 이탈 취소, 그림 수신 표시 종료.
- 격리 실행: 보호 그림 원래 노드·부모·속성 복원. 세력 17개 본문, 자유 해석 연결, 신원 표지 최대 두 곳과 링크 밖 배치, 미등록 세력 처리.

## 확인하지 못한 것

- 실제 브라우저의 1280px·375px 화면, 가로 넘침, 모바일 세로 화면의 자막·조작부 가시성, 실제 포커스 테두리, 뒤로 가기·다른 채널 왕복, 브라우저 콘솔 오류 수, 영상 디코딩·자동재생 정책·실제 청취 음량은 확인하지 못했다.
- 브라우저 도구의 앱·브라우저 목록이 비어 있었고, 인앱 브라우저는 `Browser is not available: iab`를 반환했다.
- 대안으로 시도한 로컬 검증 서버도 `listen EACCES: permission denied 127.0.0.1:4175`로 시작되지 않았다. 격리 실행 검사를 브라우저 표시 검증으로 간주하지 않는다.
- Claude의 새 셸과 병합한 상태의 대표 그림·전체/간략 전환 UI·위협 반응·드문 이상 신호·공용 감식 화면은 아직 확인하지 못했다. 이 작업 트리에는 해당 셸 구현이 없다. 셸 미구현으로 실패한 검사 항목은 없다.

## 셸에 대한 인계

1. `pc:fx` 이벤트의 `detail.mode`와 `PCApp.fx()` 값을 함께 갱신한다. 이 화면은 설정을 바꿔도 자막 타이머를 다시 만들지 않는다.
2. 현재 `base.css`에는 시스템 움직임 줄이기 미디어 쿼리가 남아 있다. 사용자가 ‘효과: 전체’를 고를 수 있도록 공용 파일도 새 속성 기준으로 옮겨야 한다. 이 작업에서는 공용 파일을 수정하지 않았다.
3. `tc-immersive` 동안 상단 바·채널 레일과 셸 환경음의 중첩을 확인한다. 기록 영상의 음원·잡음은 뷰어가 직접 관리하고 종료 시 모두 멈춘다.
4. 이상 표지는 기록 표지의 출처 상태 한 곳, 신원 근거가 있는 관련 인물 최대 두 곳이다. 영구적인 텍스트 변경 없이 표시하고 링크·제목에는 적용하지 않는다.
5. `ProjectCurseOpenCanon.faction[id]`와 `PCApp.openCanon(text)`를 함께 제공하면 자유 해석 표시가 나온다. 자료만 있고 함수가 없는 동안에는 빈 상자를 만들지 않는다.
6. 병합 때 다른 화면이 갱신한 `index.html`을 유지한 채 `stamp-assets.mjs`를 다시 돌린다. 이 커밋의 주소 해시 9줄로 다른 작업의 해시를 되돌리지 않는다.
7. 새 공용 음향 사건 이름을 추가하지 않았다. 요청한 기존 파일은 기록 영상 전용 트랙으로 연결했다.

## 병합 전 남은 확인

Claude의 셸과 병합한 뒤 네 영상 각각을 1280px·375px에서 소리 켜짐·꺼짐, 효과 전체·줄임으로 열어 실제 표시와 소리를 확인한다. 재생 중 Esc, 닫기, 정지·재개, 장 이동, 감식 확대, 마지막 자연 종료, 목록·다른 채널 왕복을 확인하고 콘솔 오류와 가로 넘침을 점검한다.

## 커밋 상태

파일 저장과 검증은 끝났지만 커밋은 만들지 못했다. 허용된 13개 파일을 명시한 `git add`에서 아래 오류가 발생했다.

```text
fatal: Unable to create 'C:/Users/FORYOUCOM/OneDrive/문서/GitHub/project-curse/.git/worktrees/codex-atm-b/index.lock': Permission denied
```

Git 관리 폴더는 현재 작업 트리 밖에 있으며 이 실행 환경은 그곳에 쓸 수 없다. 권한을 우회하지 않았다. 변경 사항은 `codex/atmosphere-archive-faction`의 작업 파일에 남아 있고, 스테이징·커밋·푸시는 이루어지지 않았다.

권한이 있는 환경에서 같은 브랜치에 포함할 파일은 위 표의 12개 변경 파일과 이 인계 메모다. 사용할 한국어 커밋 메시지:

```text
기록 영상 몰입 재생과 음향을 복원하고 기록보관소·세력 분석의 간략 보기를 정리
```
