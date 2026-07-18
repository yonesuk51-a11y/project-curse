# Project Curse U.A.C Closed Server

Current build: `5.15.2cp Site Shell Pass`

The current shell has one navigation owner. `runtime-ownership.js` removes
direct legacy listeners from live menu controls, and `menu-audio-runtime.js`
alone commits screens, drawer state, button state, and navigation audio.
`site-shell.css` fixes the system bar, drawer and backdrop into one explicit
layer order so the mobile drawer begins below the bar and keeps its own touch
targets above the dimmed content.

정적 PC·모바일 기록 단말 패키지다. 루트의 `index.html`을 열거나 폴더 전체를 GitHub Pages에 배포한다.

## 현재 화면

- 단말 상태
- 세계 사건 연표
- 세력 분석실
- 기록보관소

폐기된 지역 상황도와 독립 관계도 화면은 루트 구조에서 제거했다. 예전 주소 `#region-map`은 세계 사건 연표로, `#faction-relation`은 세력 분석실로 연결된다.

기록보관소는 `종교`, `불멸을 향해`, `괴이`, `사쿠마의 테이프`를 영상 기록으로, 나머지 공개 기록을 문서 파일로 분리한다. 메뉴를 열고 닫거나 화면을 선택할 때의 효과음은 재생하지 않는다.

이번 정리에서 참조되지 않는 원본 음원 2개와 이미지 5개, 폐기 화면 전용 안내 문서를 제거했다. 보호 기록인 `종교`와 `불멸을 향해`의 인라인·독립 페이지는 해시로 보존한다.

영상 기록은 공통 재생 엔진 하나와 기록별 설정 모듈 네 개로 분리했다. 종교·불멸을 향해·괴이·사쿠마의 테이프는 각자 영상, 배경음, 전환음과 페이지 공급 정보를 소유하며 `main.js`는 등록된 설정을 조회해 재생만 담당한다. 현행 구조에서 사용하지 않는 과거 지도·관계도 확장 블록은 실행되지 않는다.

PC·모바일 사이드 메뉴는 항목을 누르는 즉시 화면 경로와 입력 상태를 확정한 다음 서랍을 닫는다. 과거 터치 라우터는 현행 v3 구조에서 비활성화했으며, 첫 부팅은 이전 주소의 해시와 관계없이 `단말 상태`로 진입한다. 문서 페이지에서 돌아오는 `?return=archive`만 기록보관소를 복원한다.

## 검증

```bash
node tools/verify-package.mjs
```

브라우저 콘솔:

```js
const result = ProjectCurseQA.organizationCanonSweep();
console.log(ProjectCurseQA.organizationCanonReportText(result));
```

현재 정적 검증 기준은 `tools/verify-package.mjs`다.

## 공개 배포 전 확인

포함된 음원과 영상은 파일명만으로 공개 재배포 허가를 판단할 수 없다. GitHub Pages 공개 전 원본 출처, 라이선스, 출처 표기와 재배포 허용 범위를 확인한다.
