# QA RESULTS — MapPatch 5.15.2cf

검증일: 2026-07-16  
대상: `Project_Curse_UAC_Server_5_15_2cf`

## 자동 검증

- 결과: `48/48 PASS`
- 실행: `node tools/verify-package.mjs`
- JavaScript 구문 검사: 기존 `main.js`와 5.15.2cf 신규 모듈 PASS
- 대표 기록철 4개, 세부 기록 18개 소속 확인, 잠금 기록 분리, 분산 카드 방지 검사 PASS
- 5.15.2ce 조직 정사·관계·오디오 자산 검사 회귀 PASS
- 잠금 기록 인라인·독립 문서 SHA-256 일치 PASS

## 잠금 기록 SHA-256

| 범위 | SHA-256 |
|---|---|
| 인라인 `Cults_871104` | `aefa15d45fd74b868223144455da4dae59b5545f61fd5687a3132d8cf27c3429` |
| 독립 `Cults_871104` | `71b052533c33f3c4d9838a55633be82bb64030d4028be2304a48154fa049a740` |
| 인라인 `Immortality_860201` | `38cd38c7db213c15517284155e7a70f98092cf9cae52e18d0be40b85fe73e993` |
| 독립 `Immortality_860201` | `1d6c0fb57135631deb7feed3c4f6845f4bd1337e3b7ad34db78f95b8d5855626` |

## 환경 제한

현재 환경에는 Playwright가 사용할 Chromium 실행 파일이 없어 자동 화면 캡처와 실브라우저 상호작용 검사는 실행하지 못했다. 목록·상세 전환, 검색, 모바일 배치, 잠금 기록 전용 연출은 `MANUAL_CHECK_MapPatch5_15_2cf.md` 절차로 최종 확인해야 한다.
