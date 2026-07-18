// Project Curse — Ferals_860722 cinematic ownership
(function(root){
  'use strict';
  root.ProjectCurseCinematicRegistry?.register({
    id:'Ferals_860722',
    key:'cult',
    sourceLabel:'U.A.C / FERAL CLASSIFICATION',
    bodyClass:'pc5152h-cult-source-sequence',
    introVideo:'assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4',
    transitionVideo:'assets/video/pc5152m_vhs_transition_18_21_sound.mp4',
    endingVideo:'',
    bgm:root.ProjectCurseFeralCinematic?.bgm||'assets/audio/pc5152cf_feral_dying_memories_bgm.mp3',
    bgmVolume:.34,
    introVolume:.18,
    transitionVolume:.24,
    introFallback:10450,
    transitionFallback:3750,
    mountTitle:'개체 분류 기록 불러오는 중',
    mountLines:['CLASSIFICATION MAP ....... RESTORED','ENTITY FRAME ............. 12 FILES','FIELD DOCTRINE ........... CURRENT','LOCAL ACCESS ............. ACCEPTED'],
    mountHint:'읽기 권한: 복구본 / FERAL SEQUENCE ATTACHED',
    pages:()=>root.ProjectCurseFeralCinematic?.pages||[]
  });
})(window);
