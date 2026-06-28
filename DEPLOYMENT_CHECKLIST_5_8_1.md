# Deployment Checklist — 5.8.1

## 업로드 기준

- 최신 ZIP을 풀어낸 내용물만 GitHub Pages 루트에 올린다.
- 이전 패치 ZIP은 소스 폴더에 넣지 않는다.
- 원본 참고 이미지/영상/스타일 ZIP은 현재 UI 배포 소스에 넣지 않는다.

## 필수 파일

- `index.html`
- `archive/index.html`
- `assets/js/main.js`
- `assets/css/style.css`
- `assets/audio/`
- `assets/maps/`
- `assets/faction_marks/`
- `assets/resources/`
- `.nojekyll`

## 5.8.1 검수

- 세력관계도 기본 상태: 모든 노드 표시.
- 세력관계도 포커스 상태: 선택 노드 직접 연결선만 표시.
- 무관 노드: 낮은 명도/투명도 유지.
- 지역지도: 단계식 줌 유지.
- 기록보관서: 기록 탭/개별 기록 열람 유지.
- 특수 기록: F.H.C/영상/개체 연출 범위 유지.
