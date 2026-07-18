// Project Curse — Sakuma_Tape_991028 cinematic ownership
(function(root){
  'use strict';
  root.ProjectCurseCinematicRegistry?.register({
    id:'Sakuma_Tape_991028',
    key:'sakuma',
    sourceLabel:'S.I.D / TOKYO OCCULT ARCHIVE',
    bodyClass:'pc5152h-cult-source-sequence',
    introVideo:'assets/video/pc5152cf_sakuma_vhs_intro.mp4',
    introDuration:5000,
    transitionVideo:'assets/video/pc5152m_vhs_transition_18_21_sound.mp4',
    endingVideo:'',
    bgm:'assets/audio/pc5152cf_sakuma_vcr_hiss_bgm.mp3',
    bgmVolume:.36,
    birthdayAudio:'assets/audio/pc5152cf_sakuma_birthday_cue.mp3',
    birthdayVideo:'assets/video/pc5152cf_sakuma_end_transition.mp4',
    introVolume:.42,
    transitionVolume:.24,
    transitionFallback:3750,
    mountTitle:'사쿠마의 테이프 불러오는 중',
    mountLines:['S.I.D TOKYO ............ 연결','OCCULT CASE ............ 복구','VIDEO SIGNAL ........... 확인','LOCAL ACCESS ........... 허가'],
    mountHint:'읽기 권한: S.I.D 오컬트 부서 / VIDEO RECORD ATTACHED',
    pages:()=>root.ProjectCurseSakumaCinematic?.pages||[]
  });
})(window);
