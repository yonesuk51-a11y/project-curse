// Project Curse 5.15.2cv — terminal hub manifest and runtime ownership map
(function(root){
  'use strict';

  function freeze(value){
    if(!value || typeof value!=='object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseStructure=freeze({
    version:'5.15.2cv',
    schema:'project-curse-structure-v5',
    screens:[
      {id:'terminal-home',label:'단말 상태',index:'00'},
      {id:'history',label:'세계 사건 연표',index:'01'},
      {id:'faction-info',label:'세력 분석실',index:'02'},
      {id:'archive-entry',label:'기록보관소',index:'03'}
    ],
    lockedRecords:[
      {id:'Cults_871104',title:'종교'},
      {id:'Immortality_860201',title:'불멸을 향해'}
    ],
    archiveSections:[
      {id:'incident',label:'사건 기록'},
      {id:'faction-person',label:'세력·인물 기록'},
      {id:'anomaly-entity',label:'이상현상·개체 기록'},
      {id:'operation-equipment',label:'작전·장비·규정 기록'}
    ],
    archivePresentation:{mode:'single-shell-viewer',documentNavigation:'internal',transition:'record-mount-short',lockedRecords:'outside-consolidation'},
    audio:{
      ambient:'pc5152am_menu_old_computer.mp3',
      effects:{
        mount:'pc5152h_record_mount_clear.wav',
        projector:'pc5152p_internal_projector_vhs_step.wav',
        denied:'pc5152f_low_denied_oldpc.wav',
        boot:'pc5152f_boot_access_oldpc.wav'
      }
    },
    owners:{
      manifest:'assets/js/data/site-manifest.js',
      canon:'assets/js/data/canon-registry.js',
      archiveRegistry:'assets/js/data/archive-registry.js',
      baseRuntime:'assets/js/core/base-runtime.js',
      shellRuntime:'assets/js/core/app-shell.js',
      cinematicRuntime:'assets/js/core/record-cinematic-runtime.js',
      cinematicRegistry:'assets/js/core/record-cinematic-registry.js',
      cinematicRecords:[
        'assets/js/pages/cinematic-cults.js',
        'assets/js/pages/cinematic-immortality.js',
        'assets/js/pages/cinematic-ferals.js',
        'assets/js/pages/cinematic-sakuma.js'
      ],
      shellCSS:'assets/css/app-shell.css',
      declutter:'assets/js/pages/shared-declutter.js',
      reconciliation:'assets/js/pages/canon-reconciliation.js',
      archiveConsolidation:'assets/js/pages/archive-consolidation.js',
      archiveDocumentViewer:'assets/js/pages/archive-document.js',
      stabilizationCSS:'assets/css/stabilization.css',
      archiveCSS:'assets/css/archive-consolidation.css'
    }
  });
})(window);
