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
    mountTitle:'기록 불러오는 중',
    mountLines:['F.H.C SOURCE ....... 감지','VIDEO MARK ......... CONFIRMED','TEXT BLOCK ......... 부분','LOCAL ACCESS ....... ACCEPTED'],
    mountHint:'READ PERMISSION: ORIGINAL RECORD / IMMORTALITY ATTACHED',
    pages:()=>root.ProjectCurseLegacyCinematicSources?.immortality||[]
  });
})(window);
