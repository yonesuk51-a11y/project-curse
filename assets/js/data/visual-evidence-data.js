// Project Curse 5.32.0 — visual evidence provenance, comparison pairs, and source-status resolver.
(function(root){
  'use strict';

  const classes=Object.freeze({
    ORIGINAL:Object.freeze({label:'원본 보존',tone:'original',description:'원본 출처 계열에서 회수된 기록 자산'}),
    STABILIZED:Object.freeze({label:'열람 보정본',tone:'stabilized',description:'원본을 보존한 채 열람을 위해 보정한 파생본'}),
    RECONSTRUCTED:Object.freeze({label:'복원 추정본',tone:'reconstructed',description:'소실 장면을 설정과 증언을 바탕으로 재구성한 이미지'}),
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

  root.ProjectCurseVisualEvidence=Object.freeze({version:'1.0.0',classes,known,normalize,resolve});
})(window);
