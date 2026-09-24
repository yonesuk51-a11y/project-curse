# 옛 앱 파일 (대조용 보관)

2026-09-24 표시층을 새 단말(`index.html`, `assets/app/`)로 교체한 뒤, 사이트가 더 이상 부르지 않는 옛 앱 파일을 여기로 옮겼다. 원래 경로를 그대로 유지한다(`assets/css/`, `assets/js/core/`, `assets/js/pages/`, `assets/js/main.js`).

- 사이트에서 부르지 않는다. GitHub Pages로 공개되지만 어떤 페이지도 링크하지 않는다.
- 화면별 검사(`tools/verify-app.d/*.mjs`)가 옛 기능·문구·상태 저장 방식과 새 단말이 같은지 대조할 때 읽는다. 대조 기준이므로 고치지 않는다.
- `assets/js/data/site-manifest.js`의 `owners`에 남은 옛 경로는 옛 앱 구조 기록이다. 실제 파일은 이 폴더에 있다.
- 봉인 원본(`canon/originals/*.docs.html`)이 부르는 `assets/css/style.css`·`assets/js/main.js`도 여기 있다. 봉인 원본은 사이트에 표시하지 않고 해시 대조에만 쓴다.
