# PATCH 5.8.1R-44 — DetailMapZoomAndFocusPass

## 목적

R43의 확장 지도 시각 핫픽스와 149개 지도 요소를 유지하면서, 상세 권역지도에만 제한형 확대/초점 보기 기능을 추가한다.

세계지도는 계속 권역 선택 전용 화면으로 유지하며, 줌/드래그/FIT/WIDE 기능을 복구하지 않는다.

## 적용 내용

### 1. 상세지도 전용 보기 배율 추가

상세 권역지도 우측 패널에 `DETAIL VIEW` 컨트롤을 추가했다.

- 기본
- 확대
- 정밀

세계지도에서는 해당 컨트롤을 숨긴다.

### 2. 선택 요소 중심 보기

지도 요소를 선택한 상태에서 `선택 중심`을 누르면 선택 요소 주변을 기준으로 확대 표시한다.

### 3. 관계권 중심 보기

선택 요소가 관계권을 가진 경우 `관계권 중심`을 누르면 같은 관계권 요소 묶음을 기준으로 확대 표시한다.

예:

- lanzhou
- hongkong
- north-sea
- blood-lake
- central-aus

### 4. 확대/정밀 상태 라벨 강화

확대 상태에서는 선택 요소명이 표시되고, 정밀 + 관계권 중심 상태에서는 같은 관계권 요소명의 일부가 함께 표시된다.

검수 모드에서는 내부 ID와 관계권 코드도 함께 표시한다.

### 5. SELF REVIEW / 최종 점검 반영

검수 리포트와 SELF REVIEW 지표에 현재 상세 보기 상태를 추가했다.

- 보기 배율
- 초점 상태
- 선택 중심/관계권 중심 여부

### 6. API 추가

내부 검수 및 외부 호출용 API를 추가했다.

```text
ProjectCurseRegionalMap.setZoomMode(mode)
ProjectCurseRegionalMap.setZoomFocus(mode)
ProjectCurseRegionalMap.clearZoomFocus()
ProjectCurseRegionalMap.makeZoomFocusReport()
```

## 유지 사항

- 세계지도는 권역 선택 전용 / 줌 없음 유지
- 자유 드래그/휠 줌/FIT/WIDE 복구 없음
- R41 확장 데이터 149개 유지
- R43 시각 보정 유지
- RECORD INDEX / LINK AUDIT / SELF REVIEW 유지
- 일반 화면 내부 ID 비노출 유지
- 검수 모드 내부 ID 표시 유지

## 검수 기준

- 세계지도에서 상세 보기 컨트롤이 숨겨지는지 확인
- 상세지도에서 기본/확대/정밀 전환 확인
- 선택 중심/관계권 중심이 선택 요소 기준으로 작동하는지 확인
- 확대 상태에서도 필터/색인/겹친 요소 후보 메뉴가 유지되는지 확인
- 검수 리포트에 상세 보기 상태가 표시되는지 확인
