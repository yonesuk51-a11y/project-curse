# QA RESULTS — MapPatch 5.15.2ce

검증일: 2026-07-16  
대상: `Project_Curse_UAC_Server_5_15_2ce`

## 자동 검증

- 결과: `38/38 PASS`
- 실행: `node tools/verify-package.mjs`
- JavaScript 구문 검사: `assets/js/main.js`와 5.15.2ce 신규 모듈 전체 PASS
- 공통 구조/정사 파일 로드 순서 PASS
- 실행형 정사 레지스트리 검증 PASS
- 관계 12개와 A.R.F 미확정 관계선 부재 PASS
- 메뉴·효과음 파일 7개 존재 확인 PASS
- 잠금 기록 네 범위 SHA-256 일치 PASS

## 잠금 기록 SHA-256

| 범위 | SHA-256 |
|---|---|
| 인라인 `Cults_871104` | `aefa15d45fd74b868223144455da4dae59b5545f61fd5687a3132d8cf27c3429` |
| 독립 `Cults_871104` | `71b052533c33f3c4d9838a55633be82bb64030d4028be2304a48154fa049a740` |
| 인라인 `Immortality_860201` | `38cd38c7db213c15517284155e7a70f98092cf9cae52e18d0be40b85fe73e993` |
| 독립 `Immortality_860201` | `1d6c0fb57135631deb7feed3c4f6845f4bd1337e3b7ad34db78f95b8d5855626` |

## 환경 제한

현재 작업 환경에는 Playwright가 사용할 Chromium 실행 파일이 없어 자동 화면 캡처와 실브라우저 상호작용 검사는 실행하지 못했다. 따라서 화면 크기별 배치, 실제 오디오 중복 여부, 잠금 기록의 전용 연출은 `MANUAL_CHECK_MapPatch5_15_2ce.md` 절차로 최종 확인해야 한다.

