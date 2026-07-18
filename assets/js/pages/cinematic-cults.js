// Project Curse — Cults_871104 cinematic ownership
(function(root){
  'use strict';
  root.ProjectCurseCinematicRegistry?.register({
    id:'Cults_871104',
    key:'cult',
    sourceLabel:'F.H.C / LOCAL COPY',
    bodyClass:'pc5152h-cult-source-sequence',
    introVideo:'assets/video/pc5152k_damaged_signal_intro_sound_10s.mp4',
    transitionVideo:'assets/video/pc5152m_vhs_transition_18_21_sound.mp4',
    endingVideo:'',
    bgm:'assets/audio/pc5152y_cults_banalities_radio_static_bgm.mp3',
    bgmVolume:.30,
    introVolume:.18,
    transitionVolume:.24,
    introFallback:10450,
    transitionFallback:3750,
    mountTitle:'기록 불러오는 중',
    mountLines:['VIDEO FRAME ....... DAMAGED','본문 블록 ........ 부분 복구','로컬 접근 ........ 허가'],
    mountHint:'읽기 권한: 로컬 / SEQUENCE ATTACHED',
    pages:()=>root.ProjectCurseLegacyCinematicSources?.cults||[]
  });
})(window);
