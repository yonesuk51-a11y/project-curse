// Project Curse 5.48.1 — visual evidence provenance, Korean status labels, comparison pairs and resolver.
(function(root){
  'use strict';

  const classes=Object.freeze({
    ORIGINAL:Object.freeze({label:'원본 보존',tone:'original',description:'원본 출처 계열에서 회수된 기록 자산'}),
    STABILIZED:Object.freeze({label:'열람 보정본',tone:'stabilized',description:'원본을 보존한 채 열람을 위해 보정한 파생본'}),
    RECONSTRUCTED:Object.freeze({label:'복원 추정',tone:'reconstructed',description:'소실 장면을 설정과 증언을 바탕으로 재구성한 이미지'}),
    UNVERIFIED:Object.freeze({label:'출처 대조 대기',tone:'unverified',description:'기존 기록 자산이지만 원본 계보가 아직 대조되지 않은 이미지'})
  });

  const normalize=src=>String(src||'').replace(/\\/g,'/').replace(/^(?:\.\.\/)+/,'').replace(/^\//,'').split(/[?#]/)[0];
  const known=Object.freeze({
    'assets/resources/derived/great-black-forest_reconstructed-v1.png':Object.freeze({
      assetId:'VEA-GBF-R01',className:'RECONSTRUCTED',source:'Project Curse 설정 브리프 기반 시각 재구성',date:'2026-08-16',integrity:'SYNTHETIC REFERENCE',originalState:'missing',handling:'원본 촬영 기록은 현재 등록되지 않았다. 실제 원본이 제공되면 삭제하지 않고 비교 대상으로 연결한다.'
    }),
    'assets/resources/derived/dead-zone-pilgrimage_reconstructed-v1.png':Object.freeze({
      assetId:'VEA-DZ-R01',className:'RECONSTRUCTED',source:'Project Curse 데드존 순례 브리프 기반 시각 재구성',date:'2026-08-16',integrity:'SYNTHETIC REFERENCE',originalState:'missing',handling:'현존 원본이 아닌 재구성 이미지다. 원본이 확보되면 이 항목의 comparison에 추가한다.'
    }),
    'assets/resources/derived/project-curse-world-keyart-concept-v1.png':Object.freeze({
      assetId:'VEA-PC-KEY-01',className:'RECONSTRUCTED',source:'Project Curse 세계관·권역 브리프 기반 편집 키아트',date:'2026-08-23',integrity:'EDITORIAL SYNTHETIC',originalState:'missing',handling:'단말 방향을 소개하는 편집 이미지다. 사건 원본, 감시 화면 또는 지리 증거로 사용하지 않는다.'
    }),
    'assets/resources/derived/great-black-forest-unlit-fortress-bell-concept-v1.png':Object.freeze({
      assetId:'VEA-GBF-BELL-01',className:'RECONSTRUCTED',source:'대흑림 성채 귀환자 증언 기반 분석 재구성',date:'2026-08-23',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'복수 증언의 종 운반 장면을 합성했다. 특정 성채나 순례단의 원본 기록으로 취급하지 않는다.'
    }),
    'assets/resources/derived/checkpoint-07-five-thermal-concept-v1.png':Object.freeze({
      assetId:'VEA-DZ-CP07-01',className:'RECONSTRUCTED',source:'검문소 07 열상 기록·심사 증언 기반 분석 재구성',date:'2026-08-23',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'열 신호 수의 불일치를 시각화한 도식이다. 다섯 번째 신호의 신원과 적대 여부를 확정하지 않는다.'
    }),
    'assets/resources/derived/broken-crown-erased-commander-concept-v1.png':Object.freeze({
      assetId:'VEA-BC-CMD-01',className:'RECONSTRUCTED',source:'부서진 왕관 상충 명령 브리프 기반 분석 재구성',date:'2026-08-23',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'지휘관 신원 공백과 명령 사본을 상징화했다. 실제 인물 외형이나 명령 진위를 입증하지 않는다.'
    }),
    'assets/resources/derived/first-apostle-three-traces-reconstruction-concept-v1.png':Object.freeze({
      assetId:'VEA-AP1-TRACE-01',className:'RECONSTRUCTED',source:'첫 번째 사도 상충 증언·세 권능 흔적 기반 분석 재구성',date:'2026-08-23',integrity:'UNVERIFIED SUBJECT RECONSTRUCTION',originalState:'missing',handling:'타락·혈액·그림자 흔적을 한 형상에 겹친 분석 도식이다. 외형, 신원과 단일 개체 여부는 미확정이다.'
    }),
    'assets/resources/derived/joint-response-unit-unlisted-eleventh-group-concept-v1.png':Object.freeze({
      assetId:'VEA-JRU-11-01',className:'RECONSTRUCTED',source:'2006년 연말 인원표·회수물 불일치 기반 분석 재구성',date:'2026-08-23',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'열 명의 명부와 빈 열한 번째 자리라는 기록 불일치를 시각화했다. 실제 단체사진이나 추가 인원 증거가 아니다.'
    }),
    'assets/resources/derived/nhc-young-soldiers-forward-base-group-photo-concept-v1.png':Object.freeze({
      assetId:'VEA-NHC-FB-01',className:'RECONSTRUCTED',source:'N.H.C 전진기지 생활기록·인원 명부 기반 분석 재구성',date:'2026-08-23',integrity:'UNVERIFIED PERSONNEL COMPOSITE',originalState:'missing',handling:'서로 다른 시점의 인원 기록을 한 장면으로 병합했다. 실제 단체사진, 개인 외형, 부대 편제와 소매 표식을 확정하지 않는다.'
    }),
    'assets/resources/derived/2005-01-21-ash-crew_001_reconstructed.png':Object.freeze({
      assetId:'VEA-AC-HANDOFF-01',className:'RECONSTRUCTED',source:'2005년 애시 크루 편제·첫 임무 인계 기록 기반 분석 재구성',date:'2026-08-31',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'생존자 대피와 봉인 회수물 인계를 분리해 시각화했다. 실제 출동 장면, 인원 외형·소매 표식 또는 특정 사상자의 신원을 확정하지 않는다.'
    }),
    'assets/resources/derived/2036-12-12-central-callsign-loss_001_reconstructed.png':Object.freeze({
      assetId:'VEA-UCS-CALL-01',className:'RECONSTRUCTED',source:'2036년 우시노다 중앙호출명 소실 감청 기록 기반 분석 재구성',date:'2026-08-31',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'아홉 중계지의 무응답과 분리 재개된 두 수신을 시각화했다. 우시노다교 전체 제거, 지휘부 사망 또는 발신자의 신원을 확정하지 않는다.'
    }),
    'assets/resources/derived/2038-06-29-sixth-northern-line_001_reconstructed.png':Object.freeze({
      assetId:'VEA-NF-NODE-01',className:'RECONSTRUCTED',source:'2038년 북부 제6차 차단선 전황검토·감시노드 기록 기반 분석 재구성',date:'2026-08-31',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'폐쇄역의 분산 감시노드 운용을 재구성했다. 정확한 전선 위치, 대원 외형, 적 전력 총량 또는 전쟁 종료를 확정하지 않는다.'
    }),
    'assets/resources/derived/2042-10-31-three-night-silence_001_reconstructed.png':Object.freeze({
      assetId:'VEA-SYNC-10-01',className:'RECONSTRUCTED',source:'삼야 무응답 독립시계·타종 장부·검문소 자동기록 기반 분석 재구성',date:'2026-08-31',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'성채 여섯 곳과 검문소 네 곳의 독립 기록을 한 대조 화면에 배치했다. 권역 간 통로·중계망·동일 공간 또는 발신자의 신원을 확정하지 않는다.'
    }),
    'assets/resources/derived/northern-front-duplicate-signal-reconstruction-concept-v1.png':Object.freeze({
      assetId:'VEA-NF-DUP-01',className:'RECONSTRUCTED',source:'2026년 북부전선 전황검토·복제 구조신호 보고 기반 분석 재구성',date:'2026-08-28',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'복제 구조신호, 분산 계측 노드와 제3 차단선의 관계를 한 장면에 합성했다. 실제 전황 사진, 대원 외형이나 구조 요청자의 신원을 확정하지 않는다.'
    }),
    'assets/resources/derived/north-sea-blood-lake-blockade-reconstruction-concept-v1.png':Object.freeze({
      assetId:'VEA-NS-BL-01',className:'RECONSTRUCTED',source:'북해 피의 호수 사건·후대 봉쇄 감시 기록 기반 분석 재구성',date:'2026-08-28',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'유닛2 원기록과 후대 봉쇄 감시선을 한 장면에 합성했다. 실제 현장 사진, 인원 외형이나 호수의 기원을 확정하지 않는다.'
    }),
    'assets/resources/derived/dead-zone-silent-interior-map-termination-concept-v1.png':Object.freeze({
      assetId:'VEA-DZ-SI-01',className:'RECONSTRUCTED',source:'데드존 최후 지도국·검은 고속도로·지도 종결선 진술 기반 분석 재구성',date:'2026-08-28',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'서로 다른 무응답 내륙 진술을 한 시야에 합성했다. 실제 항법 사진, 유효 경로 또는 내륙 세력의 위치로 사용하지 않는다.'
    }),
    'assets/resources/8bb53a89c3baf48d8e3ac2b180f80d0b.webp':Object.freeze({
      assetId:'VEA-FER-CLS-A',className:'UNVERIFIED',source:'기존 공개 기록 자산 묶음',date:'UNKNOWN',integrity:'LEGACY COPY',originalState:'available',handling:'동일한 분류 도식의 Archive ENEX 사본과 픽셀 구성을 대조할 수 있다.',comparison:Object.freeze({src:'assets/resources/archive-enex/feral-classification/114223e8cf8c8ea96c6d4ffca6cae2ce.webp',label:'ARCHIVE ENEX SOURCE',className:'ORIGINAL',relationship:'DUPLICATE SOURCE CHECK'})
    }),
    'assets/resources/archive-enex/feral-classification/114223e8cf8c8ea96c6d4ffca6cae2ce.webp':Object.freeze({
      assetId:'VEA-FER-CLS-B',className:'ORIGINAL',source:'Archive ENEX / Feral Classification',date:'UNKNOWN',integrity:'SOURCE COPY',originalState:'available',handling:'기존 공개 기록에 포함된 동일 분류도 사본과 대조 가능한 원본 계열 자료다.',comparison:Object.freeze({src:'assets/resources/8bb53a89c3baf48d8e3ac2b180f80d0b.webp',label:'LEGACY ARCHIVE COPY',className:'UNVERIFIED',relationship:'DUPLICATE SOURCE CHECK'})
    }),
    'assets/resources/archive-enex/feral-classification/image-241hs-angel-presence.png':Object.freeze({
      assetId:'VEA-FER-241HS',className:'ORIGINAL',source:'Archive ENEX / IMAGE-241HS',date:'암흑시대 기록 / 정확한 제작 시점 불명',integrity:'SOURCE FRAME',originalState:'available',handling:'보호 기록에 남아 있는 구형 크롭 사본과 나란히 대조할 수 있다.',comparison:Object.freeze({src:'assets/resources/83d311da1ab7310a567c6023f6151e6c.webp',label:'LEGACY CROPPED COPY',className:'UNVERIFIED',relationship:'SOURCE TO LEGACY CROP'})
    }),
    'assets/resources/83d311da1ab7310a567c6023f6151e6c.webp':Object.freeze({
      assetId:'VEA-CULT-LEGACY-01',className:'UNVERIFIED',source:'Cults_871104 보호 기록 내 구형 사본',date:'UNKNOWN',integrity:'LEGACY CROP',originalState:'available',handling:'원본을 덮어쓰지 않고 IMAGE-241HS Archive ENEX 사본과 비교한다.',comparison:Object.freeze({src:'assets/resources/archive-enex/feral-classification/image-241hs-angel-presence.png',label:'IMAGE-241HS SOURCE',className:'ORIGINAL',relationship:'LEGACY CROP TO SOURCE'})
    }),
    'assets/resources/derived/remake-keyart-checkpoint-07-concept-v2.png':Object.freeze({
      assetId:'VEA-PC-KEY-02',className:'RECONSTRUCTED',source:'검문소 07 귀환 심사 장면을 바탕으로 한 리메이크 편집 키아트',date:'2026-09-24',integrity:'EDITORIAL SYNTHETIC',originalState:'missing',handling:'단말 방향을 소개하는 편집 이미지다. 사건 원본이나 감시 화면으로 사용하지 않으며, 다섯 번째 열원의 신원과 적대 여부를 확정하지 않는다.'
    }),
    'assets/resources/derived/blood-lake-rite-1986-concept-v2.png':Object.freeze({
      assetId:'VEA-BL-1986-02',className:'RECONSTRUCTED',source:'1986 피의 호수 교단 측 상충 기록 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'교단 측 기록의 부름 장면을 해석한 이미지다. 의식의 원본 장면, 참가자 신원, 호수 위치의 증거로 취급하지 않는다.'
    }),
    'assets/resources/derived/ash-crew-aftermath-concept-v2.png':Object.freeze({
      assetId:'VEA-ASH-02',className:'RECONSTRUCTED',source:'애시 크루 회수·소각 절차 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'N.H.C 현장 교범의 회수·소각 절차를 한 장면으로 묶었다. 특정 현장, 사망자, 대원 신원을 확정하지 않는다.'
    }),
    'assets/resources/derived/cpd-screening-line-concept-v2.png':Object.freeze({
      assetId:'VEA-CPD-01',className:'RECONSTRUCTED',source:'C.P.D 민간 분리·선별 절차 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'선별 통로의 절차를 재구성한 장면이다. 특정 검문소, 피난민 신원, 개별 표식 판정을 확정하지 않는다.'
    }),
    'assets/resources/derived/civil-child-drill-empty-classroom-concept-v2.png':Object.freeze({
      assetId:'VEA-DRILL-01',className:'RECONSTRUCTED',source:'민간 아동 대피 훈련 기록 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'인물이 없는 교실 장면이다. 특정 학교, 학생, 훈련 결과의 기록으로 취급하지 않는다.'
    }),
    'assets/resources/derived/blood-lake-autopsy-1986-concept-v1.png':Object.freeze({
      assetId:'VEA-BL-AUT-01',className:'RECONSTRUCTED',source:'피의 호수 부검 기록(Unknown_Record2_860205) 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'부검 기록에 서술된 절차와 비정상 조직 소견을 한 장면으로 옮겼다. 회수 영상의 프레임이 아니며, 연구원의 외모와 사체의 신원, 시설 배치를 확정하지 않는다.'
    }),
    'assets/resources/derived/checkpoint-07-night-queue-concept-v1.png':Object.freeze({
      assetId:'VEA-DZ-CP07-02',className:'RECONSTRUCTED',source:'검문소 07 야간 통행 기록 확인 절차 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'통행 심사 절차를 상정한 장면이다. 2029년 검문소 07 귀환자 상충 사건의 장면이 아니며, 줄 가운데 형체의 신원과 분류, 통과 여부를 확정하지 않는다.'
    }),
    'assets/resources/derived/sid-memory-check-booth-concept-v1.png':Object.freeze({
      assetId:'VEA-SID-MEM-01',className:'RECONSTRUCTED',source:'S.I.D 귀환자 분리 심사·가족 기억 대조문 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'신원·기억·생체 신호의 분리 심사를 재구성했다. 화면과 실물의 자세 차이는 계측 불일치의 예시이며, 특정 귀환자와 가족의 신원, 실제 질문과 답을 확정하지 않는다.'
    }),
    'assets/resources/derived/nhc-close-quarters-stairwell-concept-v1.png':Object.freeze({
      assetId:'VEA-NHC-CQB-01',className:'RECONSTRUCTED',source:'N.H.C 현장 교범 접촉·교전 원칙 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'교범의 접촉·교전 원칙(추격보다 접근 방향 제한, 철수로 유지)을 근거리 대응 장면으로 옮겼다. 특정 작전의 교전, 대원 신원, 괴이의 종류와 철수 결과를 확정하지 않는다.'
    }),
    'assets/resources/derived/black-forest-citadel-night-refuge-concept-v1.png':Object.freeze({
      assetId:'VEA-GBF-REFUGE-01',className:'RECONSTRUCTED',source:'성채 피난헌장·대흑림 성채 야간 피난 관습 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'야간 피난 관습이 2040년대 대흑림 성채에서 이어지는 모습을 상정했다. 헌장 작성 당시의 장면이 아니며, 특정 성채의 모습과 위치, 피난민의 신원을 확정하지 않는다.'
    }),
    'assets/resources/derived/corrupted-isolation-observation-concept-v1.png':Object.freeze({
      assetId:'VEA-COR-ISO-01',className:'RECONSTRUCTED',source:'세계 기본 규칙의 타락자 정의 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'타락자 분류를 격리 관찰 장면으로 옮겼다. 특정 피격리자의 신원, 변질 원인과 경과, 실제 관찰 기록을 확정하지 않으며 괴이와 같은 범주로 다루지 않는다.'
    }),
    'assets/resources/derived/amarion-1975-test-hall-concept-v1.png':Object.freeze({
      assetId:'VEA-AMR-1975-01',className:'RECONSTRUCTED',source:'아마리온 설립 기록(1975-09-12-amarion) 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'1975년 등록 서류의 연구 목적을 바탕으로 상정한 시험동이다. 장치 원리, 실험 인원, 신규 공간 개방의 성공 여부를 확정하지 않는다.'
    }),
    'assets/resources/derived/ubermensch-1999-shared-cell-concept-v1.png':Object.freeze({
      assetId:'VEA-UBM-1999-01',className:'RECONSTRUCTED',source:'위버멘시 프로젝트 기록(1999-07-12-ubermensch) 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'그림자 형체와 사람을 같은 격리실에 넣은 기록을 옮겼다. 대상자 신원, 전체 대상자·사망자 수, 실험 결과를 확정하지 않는다.'
    }),
    'assets/resources/derived/deadzone-2008-broken-line-concept-v1.png':Object.freeze({
      assetId:'VEA-DZ-2008-01',className:'RECONSTRUCTED',source:'대륙 무응답 선언 기록(2008-09-06-dead-zone-designation) 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'끊긴 경계선과 내륙으로 향하는 순례자를 상정했다. 검문소 위치, 마지막 순찰 여부, 순례자의 신원과 생환을 확정하지 않는다.'
    }),
    'assets/resources/derived/uac-coordination-office-concept-v1.png':Object.freeze({
      assetId:'VEA-UAC-OPS-01',className:'RECONSTRUCTED',source:'U.A.C 격리 명령·출입 인증 조정 업무 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'관제 행정실의 서류 인계와 감시 화면으로 조정 업무를 옮겼다. 특정 명령의 승인, 직원 신원, 협력 기관에 대한 직접 지휘권을 확정하지 않는다.'
    }),
    'assets/resources/derived/fhc-split-command-lab-concept-v1.png':Object.freeze({
      assetId:'VEA-FHC-SPLIT-01',className:'RECONSTRUCTED',source:'F.H.C 중앙 지휘 상실·시설별 통제권 상충 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'연구원과 TAD 무장 인원의 대치로 상충 명령을 상정했다. 특정 사건의 실재, 명령의 정당성, 시설 통제자와 충돌 결과를 확정하지 않는다.'
    }),
    'assets/resources/derived/ushinoda-basement-rite-concept-v1.png':Object.freeze({
      assetId:'VEA-USH-RITE-01',className:'RECONSTRUCTED',source:'우시노다교 기관 침투·의식 활동 기반 분석 재구성',date:'2026-09-24',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'사무 건물 지하의 의식으로 잠복 활동을 상정했다. 참가자의 신원과 파벌, 특정 기관의 공모, 의식의 결과를 확정하지 않는다.'
    }),
    'assets/resources/derived/corruption-cult-drain-room-concept-v1.png':Object.freeze({
      assetId:'VEA-CRC-RITE-01',className:'RECONSTRUCTED',source:'타락교 신체 타락 의식·생체 구조 재작성 기록 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'타락교의 신체 타락 의식과 생체 구조 재작성을 폐쇄 설비실의 장면으로 상정했다. 대상자의 신원과 생사, 실제 시술 형태, 지휘자와 의식의 성공 여부를 확정하지 않는다.'
    }),
    'assets/resources/derived/blood-cult-reservoir-concept-v1.png':Object.freeze({
      assetId:'VEA-BLC-RES-01',className:'RECONSTRUCTED',source:'혈교 혈액 의식 좌표·저장소 기록 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'혈교가 혈액의 저장소와 수로를 의식의 좌표로 삼는다는 기록을 지하 저장소로 옮겼다. 혈액의 출처, 통로의 개통과 행선지, 다른 혈교 계통과의 지휘 공유를 확정하지 않는다.'
    }),
    'assets/resources/derived/shadow-cult-mismatched-reflection-concept-v1.png':Object.freeze({
      assetId:'VEA-SHC-REF-01',className:'RECONSTRUCTED',source:'그림자교 반사면·인식 불일치 기록 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'그림자교 기록에 반복되는 반사면과 인식의 불일치를 복도의 한순간으로 상정했다. 사람과 반사 형체의 신원, 엔릴바니의 외형과 개입, 빙의의 성립 여부를 확정하지 않는다.'
    }),
    'assets/resources/derived/southern-blood-coastal-command-concept-v1.png':Object.freeze({
      assetId:'VEA-SBC-CMD-01',className:'RECONSTRUCTED',source:'남방 혈맹 해안 전시 지휘망 기록 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'남방 혈맹의 해안 교단과 무장세력이 함께 쓰는 전시 지휘·보급 공간을 상정했다. 지휘관의 신원, 실제 명령 내용, 혈교와의 직계 관계와 작전 결과를 확정하지 않는다.'
    }),
    'assets/resources/derived/deadzone-blood-pilgrim-aid-concept-v1.png':Object.freeze({
      assetId:'VEA-DZB-AID-01',className:'RECONSTRUCTED',source:'데드존 혈교 순례자 구호 기록 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'데드존 혈교 거점에서 반복 보고된 순례자 응급처치와 임시 숙영 지원을 옮겼다. 구조 활동의 목적과 개별 거점의 규칙, 치료 결과, 데드존 전역의 안전을 확정하지 않는다.'
    }),
    'assets/resources/derived/son-hidden-depot-concept-v1.png':Object.freeze({
      assetId:'VEA-SON-DEP-01',className:'RECONSTRUCTED',source:'S.O.N 분산 지원망·은닉 거점 기록 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'S.O.N의 분산 지원망이 오염 대응 장비를 은닉하고 재배치하는 활동을 상정했다. 인원의 신원과 소속국, 실제 지휘 관계, 장비의 출처와 특정 작전의 성과를 확정하지 않는다.'
    }),
    'assets/resources/derived/haimun-night-transfer-concept-v1.png':Object.freeze({
      assetId:'VEA-POH-TRN-01',className:'RECONSTRUCTED',source:'P.O.H 위장 진료소·운송망 기록 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'P.O.H의 위장 진료소와 운송망을 통한 등록 밖의 인력 이동을 야간 하역 장면으로 상정했다. 이동하는 사람의 신원과 전체 수, 최종 목적지, 특정 거래의 성립과 결과를 확정하지 않는다.'
    }),
    'assets/resources/derived/arf-sealed-recovery-hoist-concept-v1.png':Object.freeze({
      assetId:'VEA-ARF-HST-01',className:'RECONSTRUCTED',source:'A.R.F 밀봉·분리 회수 절차 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'A.R.F의 밀봉·분리 회수 절차를 오염 구역의 견인 작업으로 옮겼다. 운반함의 내용과 실제 사체 수, 반출·폐기 판정, 오염 제거의 성공을 확정하지 않는다.'
    }),
    'assets/resources/derived/amarion-abandoned-facility-concept-v1.png':Object.freeze({
      assetId:'VEA-AMR-SITE-01',className:'RECONSTRUCTED',source:'아마리온 활동 중단·승계 기록 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'아마리온의 활동 중단과 승계 기록 뒤 수십 년이 흐른 폐시설을 상정했다. 시설의 실제 위치와 상태, 장비의 행방, 왜곡 시스템의 결과와 이상현상과의 인과를 확정하지 않는다.'
    }),
    'assets/resources/derived/angel-descent-red-sky-concept-v1.png':Object.freeze({
      assetId:'VEA-ANG-DSC-01',className:'RECONSTRUCTED',source:'천사 강림과 「본 자의 서」(deep-angel-descent) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'「본 자의 서」가 전하는 천사 강림과 얼굴을 든 한 사람을 지상에서 바라본 전승 장면이다. 강림의 실제 연대·장소·규모, 생존자의 신원과 현재 존재, IMAGE-241HS 증언과의 독립성을 확정하지 않는다.'
    }),
    'assets/resources/derived/tachibana-isamu-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-TCH-01',className:'RECONSTRUCTED',source:'인물 기록(tachibana-isamu)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 그림자의 발현 경위와 잃은 기억의 내용은 확정하지 않는다.'
    }),
    'assets/resources/derived/kagami-itsuki-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-KGM-01',className:'RECONSTRUCTED',source:'인물 기록(kagami-itsuki)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 본명과 감사를 맡은 기관, 활동 연도는 확정하지 않는다.'
    }),
    'assets/resources/derived/enrilbani-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-ENR-01',className:'RECONSTRUCTED',source:'인물 기록(enrilbani)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 흰 얼굴면 너머의 실제 얼굴과 육체, 로드좌와의 관계는 확정하지 않는다.'
    }),
    'assets/resources/derived/epoptes-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-EPO-01',className:'RECONSTRUCTED',source:'인물 기록(epoptes)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'「본 자의 서」 제1장의 묘사에 맞춘 인물 재구성 스케치다. 강림의 연대와 장소, 현재 생존은 확정하지 않는다.'
    }),
    'assets/resources/derived/kieran-hayward-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-KRN-01',className:'RECONSTRUCTED',source:'인물 기록(kieran-hayward)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 교단 내 정확한 직위와 거점, 의식의 목적은 확정하지 않는다.'
    }),
    'assets/resources/derived/yanan-kes-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-YNK-01',className:'RECONSTRUCTED',source:'인물 기록(yanan-kes)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 천로교의 교리와 규모, 순회 경로는 확정하지 않는다.'
    }),
    'assets/resources/derived/kenevin-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-KNV-01',className:'RECONSTRUCTED',source:'인물 기록(kenevin)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 기사에서 이질적 존재로 바뀐 경위와 현재 소재는 확정하지 않는다.'
    }),
    'assets/resources/derived/sakuma-yuta-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-SKM-01',className:'RECONSTRUCTED',source:'인물 기록(sakuma-yuta)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 1989년 기록 표지의 인상을 따른다. 현재 거점과 하이문 안의 지휘 범위는 확정하지 않는다.'
    }),
    'assets/resources/derived/mason-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-MSN-01',className:'RECONSTRUCTED',source:'인물 기록(mason)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 투시의 작동 방식과 대가의 범위는 확정하지 않는다.'
    }),
    'assets/resources/derived/alma-koenig-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-VLN-01',className:'RECONSTRUCTED',source:'인물 기록(alma-koenig) 기반 인물 재구성 — 인상착의 기록 없음',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'인상착의 기록이 없어 기록된 나이·직책·습관(회의 전 녹음기 전원 분리)으로 외형을 재구성한 인물 재구성이다. 실제 회의의 시각·참석자와 피난소 전환의 완료 여부는 확정하지 않는다.'
    }),
    'assets/resources/derived/frux-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-FRX-01',className:'RECONSTRUCTED',source:'인물 기록(frux) 기반 인물 재구성 — 인상착의 기록 없음',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'인상착의 기록이 없어 기록된 나이·직책·습관(다 쓴 부적을 꿰매 보관)으로 외형을 재구성한 인물 재구성이다. 현재 신원과 재임, 부적 작성자의 정체는 확정하지 않는다.'
    }),
    'assets/resources/derived/apostle-luke-eugene-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-LCN-01',className:'RECONSTRUCTED',source:'인물 기록(apostle-luke-eugene) 기반 인물 재구성 — 인상착의 기록 없음',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'인상착의 기록이 없어 기록된 나이·출신·권능으로 외형을 재구성한 인물 재구성이다. 제6안의 모양, 흔적을 남긴 행위와 알룰림과의 관계는 확정하지 않는다.'
    }),
    'assets/resources/derived/apostle-uro-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-URO-01',className:'RECONSTRUCTED',source:'인물 기록(apostle-uro) 기반 인물 재구성 — 인상착의 기록 없음',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'인상착의 기록이 없어 기록된 나이·출신·습관(남의 기계를 오래 관찰)으로 외형을 재구성한 인물 재구성이다. 지도의 실제 위치, 계보 문양과 시에나 칸과의 관계는 확정하지 않는다.'
    }),
    'assets/resources/derived/apostle-camille-potier-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-CMP-01',className:'RECONSTRUCTED',source:'인물 기록(apostle-camille-potier)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 능력과 대가, 활동 시기는 확정하지 않는다.'
    }),
    'assets/resources/derived/apostle-viljar-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-VLJ-01',className:'RECONSTRUCTED',source:'인물 기록(apostle-viljar)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 날개의 정체와 능력, 활동 시기는 확정하지 않는다.'
    }),
    'assets/resources/derived/apostle-levente-hambas-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-LVH-01',className:'RECONSTRUCTED',source:'인물 기록(apostle-levente-hambas)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 눈과 손이 변한 경위, 활동 시기는 확정하지 않는다.'
    }),
    'assets/resources/derived/apostle-robin-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-RBN-01',className:'RECONSTRUCTED',source:'인물 기록(apostle-robin)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 가시의 정체와 능력, 활동 시기는 확정하지 않는다.'
    }),
    'assets/resources/derived/apostle-kendo-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-KND-01',className:'RECONSTRUCTED',source:'인물 기록(apostle-kendo)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 후드 속 얼굴과 능력, 활동 시기는 확정하지 않는다.'
    }),
    'assets/resources/derived/apostle-lisbeth-van-doorn-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-LSB-01',className:'RECONSTRUCTED',source:'인물 기록(apostle-lisbeth-van-doorn)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 팔을 덮은 가시와 창의 정체, 활동 시기는 확정하지 않는다.'
    }),
    'assets/resources/derived/apostle-meguro-soichiro-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-MGR-01',className:'RECONSTRUCTED',source:'인물 기록(apostle-meguro-soichiro)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 여러 눈의 기능과 능력, 활동 시기는 확정하지 않는다.'
    }),
    'assets/resources/derived/tonari-nakamura-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-TNR-01',className:'RECONSTRUCTED',source:'인물 기록(tonari-nakamura)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 대가의 내용과 타락자·능력자 분류는 확정하지 않는다.'
    }),
    'assets/resources/derived/hayami-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-HYM-01',className:'RECONSTRUCTED',source:'인물 기록(hayami)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 피의 원인과 부대를 옮긴 이유는 확정하지 않는다.'
    }),
    'assets/resources/derived/shinohara-chiharu-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-SNH-01',className:'RECONSTRUCTED',source:'인물 기록(shinohara-chiharu)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 피의 원인과 교전 기록은 확정하지 않는다.'
    }),
    'assets/resources/derived/mizuno-shun-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-MZN-01',className:'RECONSTRUCTED',source:'인물 기록(mizuno-shun)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 그림 속 장소와 시각, 리버스 발생 뒤의 생사는 확정하지 않는다.'
    }),
    'assets/resources/derived/ogawa-nao-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-OGW-01',className:'RECONSTRUCTED',source:'인물 기록(ogawa-nao)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 그림 속 장소와 시각, 리버스 발생 뒤의 생사는 확정하지 않는다.'
    }),
    'assets/resources/derived/kamishiro-shuichi-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-KMS-01',className:'RECONSTRUCTED',source:'인물 기록(kamishiro-shuichi)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 다시 세우려는 교단의 이름과 소환 사건은 확정하지 않는다.'
    }),
    'assets/resources/derived/kenevin-hiraeth-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-KNV-02',className:'RECONSTRUCTED',source:'인물 기록(kenevin)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화(교단 명단의 히라에스)의 외형을 따른 지금 모습의 인물 재구성이다. 제3사도가 된 경위와 시점, 현재 소재는 확정하지 않는다.'
    }),
    'assets/resources/derived/outer-god-war-wall-host-concept-v1.png':Object.freeze({
      assetId:'VEA-OGW-WALL-01',className:'RECONSTRUCTED',source:'외신 강림과 성벽의 저항(deep-outer-god-war)·커네빈 인물 기록 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'교단 측 구술과 커네빈 전승에 남은 성벽의 저항을 옮긴 전승 장면이다. 전쟁의 연대·장소·규모와 경과, 우시노다의 모습은 확정하지 않는다.'
    }),
    'assets/resources/derived/sakuma-tape-institution-entry-concept-v1.png':Object.freeze({
      assetId:'VEA-SKM-ENTRY-01',className:'RECONSTRUCTED',source:'사쿠마의 테이프(Sakuma_Tape_991028) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'1989년 도쿄의 교육기관으로 들어가는 조사관의 뒷모습. 건물의 실제 외관과 조사관의 얼굴, 마지막 이동 경로와 실종 이후의 생존 여부는 확정하지 않는다.'
    }),
    'assets/resources/derived/amarion-training-screening-concept-v1.png':Object.freeze({
      assetId:'VEA-AMR-FILM-01',className:'RECONSTRUCTED',source:'아마리온 회수 영상 기록(Unknown_Record1_860204) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'1970년대 사내 상영실에서 교육 영상을 보는 직원들. 회수 영상의 프레임이 아니며, 상영 시기·장소·참석 인원과 장치의 작동 성공은 확정하지 않는다.'
    }),
    'assets/resources/derived/redwolf-waiting-room-concept-v1.png':Object.freeze({
      assetId:'VEA-RWF-ROOM-01',className:'RECONSTRUCTED',source:'레드울프 이탈 기록(Unknown_Record3_920711) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'2005년 9월 1일 이탈 직전 임시 대기실의 두 사람. 실제 CCTV 원본이 아니며, 얼굴과 인물별 위치, 대기실의 구조와 도시의 위치는 확정하지 않는다.'
    }),
    'assets/resources/derived/son-quarantine-shelf-concept-v1.png':Object.freeze({
      assetId:'VEA-SON-QRT-01',className:'RECONSTRUCTED',source:'S.O.N 비인가 장비 유통 기록(Unknown_Record4_930314) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'회수품을 오염 매개체로 우선 격리한다는 경고를 옮긴 보관 장면. 봉투 속 물건의 제품명·효능·회수 수량과 S.O.N의 제조·유통 사실은 확정하지 않는다.'
    }),
    'assets/resources/derived/returner-note-locker-concept-v1.png':Object.freeze({
      assetId:'VEA-RTN-NOTE-01',className:'RECONSTRUCTED',source:'보관함에 남긴 쪽지(Returner_Note_West) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'서부 귀환 회랑 검문소의 열린 보관함과 접힌 개인 문서. 보관함의 실제 형태, 문서가 목록에서 빠진 경위, 위탁자·수취인의 신원과 이후 행방은 확정하지 않는다.'
    }),
    'assets/resources/derived/pilgrim-rule-05-forest-path-concept-v1.png':Object.freeze({
      assetId:'VEA-PLG-R05-01',className:'RECONSTRUCTED',source:'순례자의 규칙 제1부(Pilgrim_Rules_GBF) 규칙 05 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'가진 것 하나를 남기고 소리가 없는 쪽으로 떠나라는 규칙 05의 장면. 속삭임의 주체, 실제 순례 인원과 규칙의 효력·생환 결과는 확정하지 않는다.'
    }),
    'assets/resources/derived/alullim-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-ALL-01',className:'RECONSTRUCTED',source:'인물 기록(alullim)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 얼굴과 정체, 한 존재인지 반복 현상이나 계승 좌석인지는 확정하지 않는다.'
    }),
    'assets/resources/derived/mikage-shiori-portrait-concept-v1.png':Object.freeze({
      assetId:'VEA-PER-MKS-01',className:'RECONSTRUCTED',source:'인물 기록(mikage-shiori)과 원작자 인물 설정화 기반 인물 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'원작자 인물 설정화의 외형을 따른 인물 재구성이다. 아버지의 이름과 사망 경위, 저주의 내용은 확정하지 않는다.'
    }),
    'assets/resources/derived/pitalja-roe-concept-v2.png':Object.freeze({
      assetId:'VEA-PTJ-ROE-01',className:'RECONSTRUCTED',source:'N.H.C 교범 피탈자 교전 규칙(NHC_Manual_891219) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'피탈자 교전 규칙의 경고와 구속 단계를 한 장면으로 옮긴 분석 재구성이다. 특정 작전 기록이 아니며, 피탈자의 신원과 빙의 해제 여부를 확정하지 않는다.'
    }),
    'assets/resources/derived/pitalja-blood-exit-concept-v2.png':Object.freeze({
      assetId:'VEA-PTJ-BLD-01',className:'RECONSTRUCTED',source:'세계 기본 규칙 리버스 지점의 피탈자(worldFramework.reverseSiteCivilians) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'피탈자의 몸이 죽은 뒤 괴이가 핏덩이로 빠져나오는 과정과 A.R.F의 배수구 차단 절차를 한 장면으로 옮긴 분석 재구성이다. 특정 현장과 피탈자의 신원, 핏덩이가 향한 곳은 확정하지 않는다.'
    }),
    'assets/resources/derived/first-breach-sealed-gate-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-BREACH-01',className:'RECONSTRUCTED',source:'세계 기록(deep-first-breach) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'닫는 법을 잊었다는 전승을 지하문 앞의 반복된 봉인 시도로 옮겼다. 전승들이 같은 사건을 가리키는지, 문 너머에 무엇이 있었는지, 봉인이 작동했는지는 확정하지 않는다.'
    }),
    'assets/resources/derived/city-barrier-2003-checkpoint-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-BARRIER-01',className:'RECONSTRUCTED',source:'세계 기록(2003-02-05-city-barrier) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'2003년 도심 차단 장비와 초기 이상 탐지를 위한 검색 지점을 그렸다. 장비의 상세 구조와 이 검색 지점의 실제 위치, 이후 봉쇄 결과는 확정하지 않는다.'
    }),
    'assets/resources/derived/ubermensch-raid-2006-extraction-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-RAID-01',className:'RECONSTRUCTED',source:'세계 기록(2006-08-20-ubermensch-raid) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'위버멘시 미국 지부에서 성인 방랑자들과 연구자료를 옮기는 대열 일부를 그렸다. 화면 속 인물의 신원, 구출된 열 명의 전체 모습과 이후 행선지는 확정하지 않는다.'
    }),
    'assets/resources/derived/continuity-withdrawal-2007-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-WITHDRAW-01',className:'RECONSTRUCTED',source:'세계 기록(2007-03-11-continuity-withdrawal) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'내륙 지휘기능을 비우고 대응 자산을 해안권으로 철수시키던 과정을 그렸다. 차량의 최종 도착지와 이동 결과, 국가의 법적 해체 여부는 이 장면으로 확정하지 않는다.'
    }),
    'assets/resources/derived/gbf-survey-2012-return-marker-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-SURVEY-01',className:'RECONSTRUCTED',source:'세계 기록(2012-11-19-great-black-forest-survey) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'출발 표식을 다시 마주친 공동 측량대의 귀환 한 순간을 그렸다. 발자국의 실제 경로, 숲 내부의 거리와 귀환 현상의 원인은 확정하지 않는다.'
    }),
    'assets/resources/derived/northern-front-2018-breach-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-NFRONT-01',className:'RECONSTRUCTED',source:'세계 기록(2018-09-12-northern-front) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'북부전선 개전 당시 차단선 돌파를 방어하는 한 국면을 그렸다. 짐승의 길의 전체 전력과 괴이의 확정 외형, 화면 밖 전투의 승패는 확정하지 않는다.'
    }),
    'assets/resources/derived/fhc-submassacres-2021-corridor-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-SUBMAS-01',className:'RECONSTRUCTED',source:'세계 기록(2021-05-04-fhc-submassacres) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'F.H.C 내부 시설의 상호 공격 뒤 남았을 격리 복도를 한 가능성으로 그렸다. 최초 명령자와 가해 주체, 피해자의 신원·오염 여부와 전체 사망자 수는 확정하지 않는다.'
    }),
    'assets/resources/derived/ushinoda-fabrication-2024-review-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-FABRIC-01',className:'RECONSTRUCTED',source:'세계 기록(2024-03-17-ushinoda-fabrication) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'서로 다른 사건을 합성한 영상의 인물 윤곽과 배경을 대조하는 감식 과정을 그렸다. 화면 속 인물의 신원과 실제 회수 프레임의 형태, 교단의 존재 여부는 이 그림으로 확정하지 않는다.'
    }),
    'assets/resources/derived/mass-summoning-2028-rehearsal-site-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-SUMMON-01',className:'RECONSTRUCTED',source:'세계 기록(2028-07-25-mass-summoning-rehearsal) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'도시권 집단소환 예행 가운데 한 장소의 잔류 흔적과 접근하는 대응 차량을 그렸다. 실제 잔류물의 구조와 소환 규모, 다른 도시와의 지리적 연결 및 다음 목표는 확정하지 않는다.'
    }),
    'assets/resources/derived/inland-beacon-31-relay-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-BEACON-01',className:'RECONSTRUCTED',source:'세계 기록(2034-04-22-inland-beacon-31) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'폐쇄된 해안 중계기의 정비 시험 중 응답열을 듣는 운용자 한 명을 그렸다. 응답의 발신자와 실제 위치, 구조 요청의 진위 또는 구조 승인은 확정하지 않는다.'
    }),
    'assets/resources/derived/plague-copies-margin-seals-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-PLAGUE-01',className:'RECONSTRUCTED',source:'세계 기록(deep-plague-copies) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'14세기 장부 여백에 남은 봉인 절차와 기억 대조문의 재필사를 촛불 아래의 작업으로 옮겼다. 필사자의 신원·장소·기호의 정확한 형태를 확정하지 않는다. 대역병은 사본이 쓰인 시대 배경이며, 역병의 원인과 봉인 기록은 관계가 없다.'
    }),
    'assets/resources/derived/sealing-wars-lead-box-convoy-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-SEALWAR-01',className:'RECONSTRUCTED',source:'세계 기록(deep-sealing-wars) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'삼십년전쟁기 보급망을 따라 이동한 봉인 상자를 평범한 수레 행렬 안의 경계 장면으로 옮겼다. 전쟁은 이동의 배경일 뿐이며 전쟁의 원인과 봉인 상자는 관계가 없다. 이동 경로·총수량·상자 내용물과 인계 성공은 확정하지 않는다.'
    }),
    'assets/resources/derived/industrial-occult-plate-lab-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-INDUST-01',className:'RECONSTRUCTED',source:'세계 기록(deep-industrial-occult) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'전신 장치와 사진 건판이 설명되지 않은 흔적을 함께 기록하기 시작한 산업 계측기의 장면이다. 전력이 현상을 만들었다는 인과, 손상 속 존재의 신원과 실험의 정확한 장소·배치를 확정하지 않는다.'
    }),
    'assets/resources/derived/cold-war-divided-labs-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-COLDWAR-01',className:'RECONSTRUCTED',source:'세계 기록(deep-cold-war-programs) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'같은 현상을 서로 다른 위협으로 분류한 세 연구 갈래를 나뉜 작업 칸으로 병치했다. 실제 기관·연구원 신원·총원을 확정하지 않으며, 냉전의 원인과 변칙 현상은 관계가 없다.'
    }),
    'assets/resources/derived/distortion-system-1975-field-trace-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-DISTORT-01',className:'RECONSTRUCTED',source:'세계 기록(1975-distortion-system) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'왜곡 시스템 실행 뒤 흩어져 접수된 이상 신고를 연구 단지 외곽의 불명확한 흔적 조사로 가정했다. 이 장소·인원·흔적의 실재와 실험·교단 활동 사이의 인과를 확정하지 않는다.'
    }),
    'assets/resources/derived/fhc-founding-1982-loading-dock-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-FHC82-01',className:'RECONSTRUCTED',source:'세계 기록(1982-03-22-fhc) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'아마리온의 인력·자료·장비가 F.H.C 기반으로 이어진 과정을 야간 하역 작업으로 옮겼다. 창설자와 작업자의 신원, 실제 사옥·운송 날짜·총수량과 개별 상자 내용물을 확정하지 않는다.'
    }),
    'assets/resources/derived/uac-watch-1982-listening-room-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-UACW-01',className:'RECONSTRUCTED',source:'세계 기록(1982-uac-watch) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'비인가 감시망의 기록 기능을 1980년대의 작은 아날로그 감시실로 가정했다. 방의 실재, 인물이 레스작인지 여부와 감시망 구성·자금·권한을 확정하지 않는다.'
    }),
    'assets/resources/derived/uac-founding-1993-assembly-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-UAC93-01',className:'RECONSTRUCTED',source:'세계 기록(1993-11-02-uac) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'비밀 감시망이 독립적인 초국가 대응 기관으로 공개된 전환을 차분한 대표 회의로 옮겼다. 실제 행사장·참가국·대표 신원·총원·표결 결과를 확정하지 않는다.'
    }),
    'assets/resources/derived/son-formation-1993-backroom-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-SON93-01',className:'RECONSTRUCTED',source:'세계 기록(1993-syndicate) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'반 U.A.C 국가 인맥과 기업·연구 지원 경로의 결집을 익명 연락 회합으로 옮겼다. 단일 창설 회의·지휘부의 존재, 참석자 신원·실제 인원·국가·장소·날짜를 확정하지 않는다.'
    }),
    'assets/resources/derived/classification-1997-sorting-room-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-CLASS-01',className:'RECONSTRUCTED',source:'세계 기록(1997-01-27-classification) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'리버스와 괴이의 대응 용어를 정리하며 사례 자료를 비교하는 분류실이다. 분류에 참여한 인원과 자료의 실제 내용, 분류 회의의 장소는 확정하지 않는다.'
    }),
    'assets/resources/derived/nhc-sid-independence-2001-two-convoys-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-INDEP-01',className:'RECONSTRUCTED',source:'세계 기록(2001-07-21-independence) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'공통 지원 아래 두 갈래로 이관되는 기록으로 독립 지휘체계 개편을 표현했다. 실제 이관 장소와 날짜, 차량과 인원의 수는 확정하지 않는다.'
    }),
    'assets/resources/derived/ground-forces-2002-handover-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-GROUND-01',className:'RECONSTRUCTED',source:'세계 기록(2002-02-20-ground-forces) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'협력 지상군에 현장 대응 장비와 절차를 인계하는 합동 훈련장이다. 참여 국가와 부대, 장비의 실제 기종은 확정하지 않는다.'
    }),
    'assets/resources/derived/returner-compact-2010-tent-table-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-COMPACT-01',className:'RECONSTRUCTED',source:'세계 기록(2010-04-12-returner-compact) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'남아 있는 증언을 바탕으로 상상한 첫 귀환자 협정의 절차 협의다. 협의 장소와 참석자, 합의 문안의 원본은 확정하지 않는다.'
    }),
    'assets/resources/derived/castle-asylum-2014-seven-lights-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-ASYLUM-01',className:'RECONSTRUCTED',source:'세계 기록(2014-06-08-castle-asylum-right) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'일곱 성채로 전하는 야간 피난 관습을 숲속에 흩어진 불빛으로 표현한 원경이다. 성채의 실제 위치와 거리, 동시 점등 여부는 확정하지 않는다.'
    }),
    'assets/resources/derived/atlantic-schism-2016-cut-line-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-SCHISM-01',className:'RECONSTRUCTED',source:'세계 기록(2016-02-21-blood-cult-atlantic-schism) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'데드존 지부의 순례자 보호 노선과 혈맹 지휘부와의 결별을 통신선 분리로 표현했다. 결별의 실제 방식과 인물의 신원, 거점의 위치는 확정하지 않는다.'
    }),
    'assets/resources/derived/southern-allegiance-2027-vessel-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-OATH-01',className:'RECONSTRUCTED',source:'세계 기록(2027-11-02-southern-allegiance) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'감청으로 추정된 혈맹 임시 충성망을 서로 거리를 둔 대표자들의 모임으로 표현했다. 서약의 실제 방식과 참석 분파, 모임의 장소는 확정하지 않는다.'
    }),
    'assets/resources/derived/branch-seal-2031-four-files-concept-v1.png':Object.freeze({
      assetId:'VEA-HIS-BRANCH-01',className:'RECONSTRUCTED',source:'세계 기록(2031-02-03-branch-seal) 기반 분석 재구성',date:'2026-09-25',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'같은 인계 절차를 통과한 네 결과철을 어느 하나도 원본으로 고르지 않고 봉인하는 기록보관실이다. 네 결과철의 내용과 어느 결말이 실제였는지는 확정하지 않는다.'
    })
  });

  function fallback(path){
    if(path.includes('/archive-enex/')) return {className:'ORIGINAL',source:'Archive ENEX 원본 계열 가져오기',date:'UNKNOWN',integrity:'SOURCE COPY',originalState:'available',handling:'가져온 원본 파일을 수정하지 않고 공개 기록에서 참조한다.'};
    if(path.includes('/derived/')) return {className:'RECONSTRUCTED',source:'Project Curse 파생 자산',date:'UNKNOWN',integrity:'DERIVED COPY',originalState:'unknown',handling:'파생 경로의 자산이다. 개별 출처 대장이 추가되기 전까지 원본으로 취급하지 않는다.'};
    return {className:'UNVERIFIED',source:'기존 기록 자산 묶음',date:'UNKNOWN',integrity:'LEGACY COPY',originalState:'unknown',handling:'화면에 사용 중인 기존 이미지다. 원본 계보와 변환 이력을 추가로 대조해야 한다.'};
  }

  function resolve(src,context={}){
    const path=normalize(src);const entry=known[path]||fallback(path);const className=classes[entry.className]?entry.className:'UNVERIFIED';
    const sequence=String(Number(context.sequence||1)).padStart(2,'0');
    return Object.freeze({...entry,path,className,classInfo:classes[className],assetId:entry.assetId||`VEA-${String(context.recordId||'UNKNOWN').replace(/[^a-z0-9]+/gi,'-').toUpperCase()}-${sequence}`,recordId:context.recordId||'UNKNOWN',sequence:Number(context.sequence||1),caption:context.caption||'',alt:context.alt||'',comparison:entry.comparison?Object.freeze({...entry.comparison,path:normalize(entry.comparison.src),classInfo:classes[entry.comparison.className]||classes.UNVERIFIED}):null});
  }

  root.ProjectCurseVisualEvidence=Object.freeze({version:'1.1.0',classes,known,normalize,resolve});
})(window);
