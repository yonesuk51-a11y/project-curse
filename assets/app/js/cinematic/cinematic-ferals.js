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
    pages:()=>root.ProjectCurseFeralCinematic?.pages||[]
  });
})(window);
