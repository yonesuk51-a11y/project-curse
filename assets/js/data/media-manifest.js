// Project Curse 5.33.0 — responsive derivative registry; originals remain immutable evidence sources.
(function(root){
  'use strict';

  const entries={
    'assets/resources/derived/great-black-forest_reconstructed-v1.png':{width:1536,height:1024,widths:[480,960]},
    'assets/resources/derived/dead-zone-pilgrimage_reconstructed-v1.png':{width:1538,height:1023,widths:[480,960]},
    'assets/resources/derived/project-curse-world-keyart-concept-v1.png':{width:1672,height:941,widths:[480,960]},
    'assets/resources/derived/northern-front-duplicate-signal-reconstruction-concept-v1.png':{width:1672,height:941,widths:[480,960]},
    'assets/resources/derived/north-sea-blood-lake-blockade-reconstruction-concept-v1.png':{width:1672,height:941,widths:[480,960]},
    'assets/resources/derived/dead-zone-silent-interior-map-termination-concept-v1.png':{width:1672,height:941,widths:[480,960]},
    'assets/resources/derived/2005-01-21-ash-crew_001_reconstructed.png':{width:1672,height:941,widths:[480,960]},
    'assets/resources/derived/2036-12-12-central-callsign-loss_001_reconstructed.png':{width:1672,height:941,widths:[480,960]},
    'assets/resources/derived/2038-06-29-sixth-northern-line_001_reconstructed.png':{width:1672,height:941,widths:[480,960]},
    'assets/resources/derived/2042-10-31-three-night-silence_001_reconstructed.png':{width:1672,height:941,widths:[480,960]},
    'assets/resources/archive-enex/feral-classification/video-1092c1f2-shadow-victim.png':{width:1383,height:1137,widths:[480,960]},
    'assets/resources/archive-enex/feral-classification/image-241hs-angel-presence.png':{width:810,height:748,widths:[480,810]},
    'assets/resources/archive-enex/feral-classification/image-782cf-underground-occult-club.png':{width:819,height:748,widths:[480,819]},
    'assets/resources/archive-enex/feral-classification/image-499cf-automaton-testing.png':{width:802,height:750,widths:[480,802]},
    'assets/resources/archive-enex/cults/image-57-corrupted-cult.png':{width:499,height:739,widths:[480,499]},
    'assets/resources/pc5152ay_hybrid_corruption.png':{width:744,height:682,widths:[480,744]},
    'assets/resources/pc5152ay_silent_corruption.png':{width:742,height:681,widths:[480,742]},
    'assets/resources/archive-enex/source-records/376bae421e3febc2585d99b27a65e0ea.jpg':{width:1760,height:2636,widths:[480,960]},
    'assets/resources/archive-enex/source-records/39d2854de98c700cd055b89eaed3a169.jpg':{width:1172,height:1056,widths:[480,960]},
    'assets/resources/archive-enex/source-records/422b416d660766cd0d31da5cb5b3bc24.jpg':{width:3280,height:3420,widths:[480,960]},
    'assets/resources/archive-enex/source-records/662fb6a54c038230ca310f8af407a2cd.jpg':{width:1165,height:1037,widths:[480,960]},
    'assets/resources/archive-enex/source-records/7e0841b0aa3a24e0fb01fd2611665460.jpg':{width:765,height:662,widths:[480,765]},
    'assets/resources/archive-enex/source-records/811ebd2879e69f6174932925ac0a3bad.jpg':{width:1152,height:1032,widths:[480,960]},
    'assets/resources/archive-enex/source-records/885ee44769a96ffb78b85332f5e0bb29.jpg':{width:1180,height:1030,widths:[480,960]},
    'assets/resources/archive-enex/source-records/930edd1fbafe7b54506b445174e73987.jpg':{width:2380,height:2476,widths:[480,960]},
    'assets/resources/archive-enex/source-records/a0574079b4d9dfe7d5ed810e28c2e7c5.jpg':{width:2928,height:3104,widths:[480,960]},
    'assets/resources/archive-enex/source-records/b2fb8ea921916789c0f39989d106b670.jpg':{width:768,height:713,widths:[480,768]},
    'assets/resources/archive-enex/source-records/daa52fcde14e129a569b7c1703bf0c5c.jpg':{width:791,height:765,widths:[480,791]},
    // 2026-09-24 사용자 채택 — 리메이크 이미지 5장(지옥 그림체 재작업).
    // tone:'low-key' — 이미 저조도로 칠한 그림이라 증거 틀의 보정 필터(회색조·명도 낮춤)를 걸지 않는다.
    'assets/resources/derived/remake-keyart-checkpoint-07-concept-v2.png':{width:1672,height:941,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/blood-lake-rite-1986-concept-v2.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/ash-crew-aftermath-concept-v2.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/cpd-screening-line-concept-v2.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/civil-child-drill-empty-classroom-concept-v2.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    // 2026-09-24 사용자 채택 — 장르 증거 그림 6장(지옥 그림체)
    'assets/resources/derived/blood-lake-autopsy-1986-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/checkpoint-07-night-queue-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/sid-memory-check-booth-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/nhc-close-quarters-stairwell-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/black-forest-citadel-night-refuge-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/corrupted-isolation-observation-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    // 2026-09-24 사용자 채택 — 1차 묶음 6장(세계 기록 전환점 3, 세력 3)
    'assets/resources/derived/amarion-1975-test-hall-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/ubermensch-1999-shared-cell-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/deadzone-2008-broken-line-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/uac-coordination-office-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/fhc-split-command-lab-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/ushinoda-basement-rite-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    // 2026-09-25 사용자 채택 — 2차 묶음 10장(세력 9, 세계 기록 1)과 인물 사진 9장(세로 2:3)
    'assets/resources/derived/corruption-cult-drain-room-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/blood-cult-reservoir-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/shadow-cult-mismatched-reflection-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/southern-blood-coastal-command-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/deadzone-blood-pilgrim-aid-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/son-hidden-depot-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/haimun-night-transfer-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/arf-sealed-recovery-hoist-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/amarion-abandoned-facility-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/angel-descent-red-sky-concept-v1.png':{width:1536,height:1024,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/tachibana-isamu-portrait-concept-v1.png':{width:1024,height:1536,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/kagami-itsuki-portrait-concept-v1.png':{width:1024,height:1536,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/enrilbani-portrait-concept-v1.png':{width:1024,height:1536,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/epoptes-portrait-concept-v1.png':{width:1024,height:1536,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/kieran-hayward-portrait-concept-v1.png':{width:1024,height:1536,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/yanan-kes-portrait-concept-v1.png':{width:1024,height:1536,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/kenevin-portrait-concept-v1.png':{width:1024,height:1536,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/sakuma-yuta-portrait-concept-v1.png':{width:1024,height:1536,widths:[480,960],tone:'low-key'},
    'assets/resources/derived/mason-portrait-concept-v1.png':{width:1024,height:1536,widths:[480,960],tone:'low-key'}
  };

  const normalize=src=>{
    const clean=String(src||'').replace(/\\/g,'/').split(/[?#]/)[0];
    const marker=clean.indexOf('assets/');
    return marker>=0?clean.slice(marker):clean.replace(/^(?:\.\.\/)+/,'').replace(/^\//,'');
  };
  const variantPath=(source,width)=>source
    .replace(/^assets\/resources\//,'assets/resources/responsive/')
    .replace(/\.[a-z0-9]+$/i,`-w${width}.webp`);
  const assets=Object.freeze(Object.fromEntries(Object.entries(entries).map(([source,value])=>[
    source,
    Object.freeze({...value,source,variants:Object.freeze(value.widths.map(width=>Object.freeze({width,src:variantPath(source,width)})))})
  ])));
  const resolve=src=>assets[normalize(src)]||null;

  root.ProjectCurseMediaManifest=Object.freeze({version:'1.0.0',assets,normalize,resolve,variantPath});
})(window);
