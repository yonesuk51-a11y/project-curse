// Project Curse 5.45.0 — terminal hub manifest and runtime ownership map
(function(root){
  'use strict';

  function freeze(value){
    if(!value || typeof value!=='object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  root.ProjectCurseStructure=freeze({
    version:root.ProjectCurseBuild?.version||'5.45.0',
    schema:root.ProjectCurseBuild?.schema||'project-curse-v38',
    screens:root.ProjectCurseBuild?.screens||[
      {id:'terminal-home',label:'단말 상태',index:'00'},
      {id:'map-room',label:'상황 관제',index:'01'},
      {id:'history',label:'세계 기록',index:'02'},
      {id:'faction-info',label:'정보 분석',index:'03'},
      {id:'archive-entry',label:'기록보관소',index:'04'}
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
        contact:'pc5152h_terminal_contact_clear.wav',
        analog:'pc5152f_analog_contact_soft.wav',
        mount:'pc5152h_record_mount_clear.wav',
        projector:'pc5152p_internal_projector_vhs_step.wav',
        scan:'pc5152x_late_log_beep_195s.mp3',
        marker:'pc5152v_field_photo_click_42s.mp3',
        radio:'pc5152v_comm_line_cue_73_74.mp3',
        denied:'pc5152f_low_denied_oldpc.wav',
        boot:'pc5152f_boot_access_oldpc.wav'
      }
    },
    owners:{
      buildInfo:'assets/js/data/build-info.js',
      manifest:'assets/js/data/site-manifest.js',
      audioManifest:'assets/js/data/audio-manifest.js',
      transitionManifest:'assets/js/data/transition-manifest.js',
      channelIdentityData:'assets/js/data/channel-identity-data.js',
      worldHistoryData:'assets/js/data/world-history-data.js',
      japanTechnologyData:'assets/js/data/japan-technology-data.js',
      worldHistoryProse:'assets/js/data/world-history-prose-data.js',
      canon:'assets/js/data/canon-registry.js',
      factionMarks:'assets/js/data/faction-mark-registry.js',
      factionLineage:'assets/js/data/faction-lineage-data.js',
      incidentRegistry:'assets/js/data/incident-registry.js',
      archiveRegistry:'assets/js/data/archive-registry.js',
      visualEvidenceData:'assets/js/data/visual-evidence-data.js',
      mediaManifest:'assets/js/data/media-manifest.js',
      mediaProvenance:'assets/js/data/media-provenance-data.js',
      fieldDossiers:'assets/js/data/field-dossier-data.js',
      homeIntelligence:'assets/js/data/home-intelligence-data.js',
      baseRuntime:'assets/js/core/base-runtime.js',
      adaptiveMediaRuntime:'assets/js/core/adaptive-media.js',
      loadingRuntime:'assets/js/core/loading-sequence.js',
      audioController:'assets/js/core/audio-controller.js',
      operationState:'assets/js/core/operation-state.js',
      pilgrimageData:'assets/js/data/pilgrimage-scenario-data.js',
      pilgrimageState:'assets/js/core/pilgrimage-state.js',
      verdictArchiveData:'assets/js/data/verdict-archive-data.js',
      verdictArchiveState:'assets/js/core/verdict-archive-state.js',
      performanceTelemetry:'assets/js/core/performance-telemetry.js',
      qualityPolicy:'assets/js/core/quality-policy.js',
      verdictArchiveCSS:'assets/css/verdict-archive.css',
      pilgrimageRuntime:'assets/js/pages/pilgrimage-scenario.js',
      pilgrimageCSS:'assets/css/pilgrimage-scenario.css',
      transitionController:'assets/js/core/transition-controller.js',
      shellRuntime:'assets/js/core/app-shell.js',
      channelIdentityRuntime:'assets/js/core/channel-identity.js',
      cinematicRuntime:'assets/js/core/record-cinematic-runtime.js',
      cinematicRegistry:'assets/js/core/record-cinematic-registry.js',
      cinematicRecords:[
        'assets/js/pages/cinematic-cults.js',
        'assets/js/pages/cinematic-immortality.js',
        'assets/js/pages/cinematic-ferals.js',
        'assets/js/pages/cinematic-sakuma.js'
      ],
      shellCSS:'assets/css/app-shell.css',
      foundationCSS:'assets/css/terminal-foundation.css',
      transitionCSS:'assets/css/transition-system.css',
      channelIdentityCSS:'assets/css/channel-identity.css',
      declutter:'assets/js/pages/shared-declutter.js',
      reconciliation:'assets/js/pages/canon-reconciliation.js',
      archiveConsolidation:'assets/js/pages/archive-consolidation.js',
      archiveConsolidationCSS:'assets/css/archive-consolidation.css',
      archiveDocumentViewer:'assets/js/pages/archive-document.js',
      visualEvidenceCSS:'assets/css/visual-evidence.css',
      adaptiveMediaCSS:'assets/css/adaptive-media.css',
      qualityPolicyCSS:'assets/css/quality-policy.css',
      mapRoomData:'assets/js/data/map-room-data.js',
      regionalDrilldownData:'assets/js/data/regional-drilldown-data.js',
      mapRoomRuntime:'assets/js/pages/map-room.js',
      terminalHomeRuntime:'assets/js/pages/terminal-home.js',
      mapRoomCSS:'assets/css/map-room.css',
      stabilizationCSS:'assets/css/stabilization.css',
      archiveCSS:'assets/css/archive-consolidation.css'
    }
  });
})(window);
