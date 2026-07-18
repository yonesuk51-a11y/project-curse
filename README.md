# Project Curse U.A.C Closed Server

Current build: `5.15.2cf Archive Consolidation and Screen Presentation Pass`

정적 PC·모바일 기록 단말 패키지다. 루트의 `index.html`을 열거나 폴더 전체를 GitHub Pages에 배포한다.

## 이번 기준 빌드

- 기록보관소 목록을 사건·회수, 세력·인물, 이상현상·개체, 작전·장비·규정의 대표 기록철 4개로 통합했다.
- 과거 패치에서 추가된 세부 문서는 삭제하지 않고 각 대표 기록철의 접히는 기록면으로 옮겼다.
- 목록에는 대표 기록철만 보이며, 태그·기록 수·일반 연결 패널은 보이지 않는다.
- `종교`, `불멸을 향해`는 통합 대상이 아니다. 각 기록철 안의 `원본 기록 열람`으로만 기존 원본을 연다.
- 목록→기록철 진입에 짧은 `기록 호출 중` 전환을 추가했다.

## 검증

```bash
node tools/verify-package.mjs
```

브라우저 콘솔:

```js
const result = ProjectCurseQA.organizationCanonSweep();
console.log(ProjectCurseQA.organizationCanonReportText(result));
```

자동 검증 결과는 `QA_RESULTS_MapPatch5_15_2cf.md`, 직접 확인 항목은 `MANUAL_CHECK_MapPatch5_15_2cf.md`에 기록했다.

## 공개 배포 전 확인

포함된 음원과 영상은 파일명만으로 공개 재배포 허가를 판단할 수 없다. GitHub Pages 공개 전 원본 출처, 라이선스, 출처 표기와 재배포 허용 범위를 확인한다.

