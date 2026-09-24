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
      assetId:'VEA-SYNC-10-01',className:'RECONSTRUCTED',source:'삼야 무응답 독립시계·종 장부·검문소 자동기록 기반 분석 재구성',date:'2026-08-31',integrity:'INTERPRETIVE RECONSTRUCTION',originalState:'missing',handling:'성채 여섯 곳과 검문소 네 곳의 독립 기록을 한 대조 화면에 배치했다. 권역 간 통로·중계망·동일 공간 또는 발신자의 신원을 확정하지 않는다.'
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
