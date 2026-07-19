// Project Curse — Immortality_860201 cinematic ownership
(function(root){
  'use strict';
  root.ProjectCurseCinematicRegistry?.register({
    id:'Immortality_860201',
    key:'immortality',
    sourceLabel:'U.A.C / ORIGINAL RECORD',
    bodyClass:'pc5152q-immortality-sequence',
    introVideo:'assets/video/pc5152r_immortality_recordopen_static_13_27.mp4',
    transitionVideo:'assets/video/pc5152q_immortality_fhc_transition_204_209.mp4',
    endingVideo:'',
    bgm:'assets/audio/pc5152am_immortality_scp087_theme.mp3',
    bgmVolume:.52,
    introVolume:.09,
    transitionVolume:.72,
    introFallback:14650,
    transitionFallback:5650,
    pages:()=>root.ProjectCurseLegacyCinematicSources?.immortality||[]
  });
})(window);
