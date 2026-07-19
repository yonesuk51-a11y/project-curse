// Project Curse 5.15.2dd — canonical Immortality_860201 playback storyboard.
(function(root){
  'use strict';
  const pages=[
    {
      group:'imm_brief',code:'IMMORTALITY / FIELD BRIEFING',title:'',subtitle:'',hideTitle:true,
      image:'assets/resources/b1f6105c9de718ff230e00b702ada13b.webp',frame:'BLI-006 / PRE-ENTRY STILL',
      firstLineDelay:1400,lineDelay:2200,
      lines:[
        '독일 연방 [검열] 본토에서 제 4 FHC 정찰대 마나데타 시헤이와 비키르 켐벨에 의해 이상현상이 발견되었다.',
        '이 이상 현상은 성분을 알 수 없는 붉은 액체로 채워진 호수이다. 이것은 [검열됨]으로 이어지는 아서의 문으로 의심된다.'
      ],
      postFlashDelay:900,postFlashHold:950,
      postFlashLines:[
        '신은 우리에게 축복이시다',
        '신은 우리에게 수천 개의 손을 뻗으신다',
        '신은 우리를 사랑하신다',
        '신은 우리를 떠나지 않으실 것이다',
        '신은 너무나 외로워 보이신다',
        '신은 우리를 필요로 하신다',
        '신이 우리를 데리러 오신다',
        '신은 우리에게 축복이시다',
        '신은 우리에게 수천 개의 손을 뻗으신다',
        '신은 우리를 사랑하신다',
        '신은 우리를 떠나지 않으실 것이다',
        '신은 너무나 외로워 보이신다',
        '신은 우리를 필요로 하신다',
        '신이 우리를 데리러 오신다',
        '신은 우리에게 축복이시다',
        '신은 우리에게 수천 개의 손을 뻗으신다',
        '신은 우리를 사랑하신다',
        '신은 우리를 떠나지 않으실 것이다',
        '신은 너무나 외로워 보이신다',
        '신은 우리를 필요로 하신다',
        '신이 우리를 데리러 오신다',
        '신은 우리에게 축복이시다',
        '신은 우리에게 수천 개의 손을 뻗으신다',
        '신은 우리를 사랑하신다',
        '신은 우리를 떠나지 않으실 것이다',
        '신은 너무나 외로워 보이신다'
      ]
    },
    {
      group:'imm_brief',code:'IMMORTALITY / UNIT 2',title:'',subtitle:'',hideTitle:true,
      layout:'peoplePair',frame:'UNIT 2 / PERSONNEL',firstLineDelay:500,lineDelay:1800,
      people:[
        {name:'마렌 예거트',role:'통신·영상 담당관',image:'assets/resources/9b4094a85c1863367b1b86cc915ec814.webp'},
        {name:'요나스 밀로',role:'기술 지원 요원',image:'assets/resources/9eb253063ee6ca8cc712efd4f22b7498.webp'}
      ],lines:[]
    },
    {
      group:'imm_brief',code:'IMMORTALITY / UNIT 2 DEPLOYMENT',title:'',subtitle:'',hideTitle:true,
      layout:'redLog',hideLogHeader:true,frame:'UNIT 2 / DEPLOYMENT',firstLineDelay:500,lineDelay:1900,
      lines:[
        '2분대가 목적지에 도착했다.',
        '숲속에서 호수로 이어지는 길이 발견되었고 이상한 현상들이 관찰되고 있다.',
        '해당 분대는 주의를 기울일 것을 권고받고 2분대는 표준 FHC 무기, 손전등, 그리고 4일 치의 보급품을 갖춘다.',
        '2분대로부터 이미지 전송 요청을 수신받았다.'
      ]
    },
    {
      group:'imm_log',code:'TIME LOG / 16:10',title:'',subtitle:'',hideTitle:true,
      layout:'redLog',hideLogHeader:true,logTime:'16:10',frame:'FIELD LOG / 16:10',firstLineDelay:500,lineDelay:1800,
      lines:['2분대가 아무런 문제 없이 S지점에 도달했다.']
    },
    {
      group:'imm_log',code:'TIME LOG / 16:31',title:'',subtitle:'IMG001',hideTitle:true,
      layout:'photoLarge',imageCode:'IMG001',logTime:'16:31',photoCaption:'현장 시야 확보',
      image:'assets/resources/f59b02e8f859bfc95d683636bcf39500.webp',frame:'FIELD LOG / 16:31',firstLineDelay:320,lineDelay:2000,photoSfx:true,
      lines:['현장이 시야에 포착되었다. 계속 이동하라.']
    },
    {
      group:'imm_log',code:'TIME LOG / 16:46',title:'',subtitle:'IMG002',hideTitle:true,
      layout:'photoLarge',imageCode:'IMG002',logTime:'16:46',photoCaption:'나무 사이 미확인 물체',
      image:'assets/resources/dec4cbe943147076943a62681048ad35.webp',frame:'FIELD LOG / 16:46',firstLineDelay:320,lineDelay:2000,photoSfx:true,
      lines:['나무들 사이에서 알 수 없는 물체가 포착되었다.','2분대에는 통보되지 않았다.']
    },
    {
      group:'imm_log',code:'TIME LOG / 17:02',title:'',subtitle:'',hideTitle:true,
      layout:'redLog',hideLogHeader:true,logTime:'17:02',frame:'FIELD LOG / 17:02',firstLineDelay:500,lineDelay:1800,
      lines:['언덕 너머에서 텐트가 발견되었다.','2분대가 I.D.T.의 활성화를 요청하였다.']
    },
    {
      group:'imm_log',code:'TIME LOG / 17:04',title:'',subtitle:'',hideTitle:true,
      layout:'redLog',hideLogHeader:true,logTime:'17:04',frame:'RECOVERED DIALOGUE / 17:04',firstLineDelay:700,lineDelay:2200,
      lines:[
        '〔예거트〕: 텐트는 비어 있는 것 같아...',
        '〔밀로〕: 저기... 난 안 가는 게 좋다고 봐.',
        '〔예거트〕: 아직 작전지의 절반도 오지 않았어. 겁쟁이처럼 굴지 마. 본부, 텐트 내부를 수색해도 될지 승인 여부 바람.',
        '〔밀로〕: 하지만...',
        '〔본부〕: 승인한다.'
      ]
    },
    {
      group:'imm_log',code:'TIME LOG / 17:09',title:'',subtitle:'IMG003',hideTitle:true,
      layout:'photoLarge',imageCode:'IMG003',logTime:'17:09',photoCaption:'텐트 외부 확인',
      image:'assets/resources/11f2f935e0339690ace785966d7e436f.webp',frame:'FIELD LOG / 17:09',firstLineDelay:320,lineDelay:2000,photoSfx:true,
      lines:['[데이터 손상]이 시야에 포착되었다. 계속 이동하라.','주변이 점점 어두워지고 있다.'],
      lineMutation:{index:0,delay:720,to:'텐트가 시야에 포착되었다. 계속 이동하라.'}
    },
    {
      group:'imm_log',code:'TIME LOG / 17:16',title:'',subtitle:'IMG004',hideTitle:true,
      layout:'photoLarge',imageCode:'IMG004',logTime:'17:16',photoCaption:'텐트 내부 수색',
      image:'assets/resources/fa10a34b64ccc7605b0966af4c017d99.webp',frame:'FIELD LOG / 17:16',firstLineDelay:320,lineDelay:2000,photoSfx:true,
      lines:[
        '텐트 안에는 아무도 없다.'
      ],
      lineMutation:{index:0,delay:5200,to:'우리와 함께 웃고 있는 사람은 아무도 없다.'}
    },
    {
      group:'imm_log',code:'TIME LOG / 17:18',title:'',subtitle:'',hideTitle:true,
      layout:'redLog',hideLogHeader:true,logTime:'17:18',frame:'RECOVERED DIALOGUE / 17:18',firstLineDelay:650,lineDelay:2200,
      lines:[
        '〔예거트〕: 이상하네...',
        '〔밀로〕: 대체 누구지?',
        '〔예거트〕: 본부, 들립니까?',
        '〔본부〕: 알 수 없는 문제다. 그냥 계속 전진하라.'
      ]
    },
    {
      group:'imm_log',code:'TIME LOG / 17:41',title:'',subtitle:'IMG005',hideTitle:true,
      layout:'photoLarge',imageCode:'IMG005',logTime:'17:41',photoCaption:'목적지점 접근',
      image:'assets/resources/d537338b8d854ef34d0e3638d436cb01.webp',frame:'FIELD LOG / 17:41',firstLineDelay:320,lineDelay:2000,photoSfx:true,
      lines:['목적지점에 근접해 있다. 1차 분석을 실시하라.']
    },
    {
      group:'imm_log',code:'TIME LOG / 17:58',title:'',subtitle:'',hideTitle:true,
      layout:'redLog',hideLogHeader:true,logTime:'17:58',frame:'RECOVERED DIALOGUE / 17:58',firstLineDelay:650,lineDelay:2200,
      lines:['〔예거트〕: 무서워...','〔본부〕: 이유는?','〔예거트〕: 여기 뭔가가 잘못됐어...']
    },
    {
      group:'imm_log',code:'TIME LOG / 18:06',title:'',subtitle:'',hideTitle:true,
      layout:'redLog',hideLogHeader:true,logTime:'18:06',frame:'FIELD LOG / 18:06',firstLineDelay:550,lineDelay:1900,
      lines:['요나스 밀로가 실종되었다.','2분대가 두 번째 루프에 진입한다.','보고 중...'],reportAudio:true
    },
    {
      group:'imm_log',code:'TIME LOG / 18:10',title:'',subtitle:'',hideTitle:true,
      layout:'redLog',hideLogHeader:true,logTime:'18:10',frame:'FIELD LOG / 18:10',firstLineDelay:550,lineDelay:2000,
      lines:['마렌 예거트가 두려워하고 있다.','요나스 밀로...']
    },
    {
      group:'imm_log',code:'TIME LOG / 18:14',title:'',subtitle:'',hideTitle:true,
      layout:'redLog',hideLogHeader:true,logTime:'18:14',frame:'I.P.D LINK / 18:14',firstLineDelay:550,lineDelay:2000,
      lines:['2분대 I.P.D 위치 추적 시스템에 연결 중.','보고 중...'],reportAudio:true
    },
    {
      group:'imm_log',code:'TIME LOG / 18:22',title:'',subtitle:'IPD-041',hideTitle:true,
      layout:'photoLarge',imageCode:'IPD-041',logTime:'18:22',photoCaption:'원격 통신 복구',
      image:'assets/resources/b5f9b2c2ddea9084ff8f6e8dfdc6549b.webp',frame:'FIELD LOG / 18:22',firstLineDelay:320,lineDelay:2100,
      rangeAudio:'latePursuit',rangeAudioStart:true,
      lines:['〔본부〕: 강을 따라 이동하라.','〔본부〕: 7분대가 그쪽으로 이동 중이다. 걱정하지 마라.','〔예거트〕: 무서워.']
    },
    {
      group:'imm_log',code:'TIME LOG / 18:29',title:'',subtitle:'IPD-029',hideTitle:true,
      layout:'photoLarge',imageCode:'IPD-029',logTime:'18:29',photoCaption:'예거트 심리 상태 악화',
      image:'assets/resources/ea33a51515476e2946267ea56b453760.webp',frame:'FIELD LOG / 18:29',firstLineDelay:320,lineDelay:1800,
      rangeAudio:'latePursuit',
      lines:[
        'I.P.D. 연결 실패.','원격 송신기 연결됨.','마렌 예거트가 극심한 공포를 느끼고 있다.',
        '1차 심리 안정 조치 제공됨.','마렌 예거트의 정신 상태가 극도로 악화됨.','거동이 불가능한 상태.','무언가 다가오고 있다.'
      ]
    },
    {
      group:'imm_log',code:'TIME LOG / 18:37',title:'',subtitle:'IPD-037',hideTitle:true,
      layout:'photoLarge',imageCode:'IPD-037',logTime:'18:37',photoCaption:'밀로 I.P.D 장치 활성화',
      image:'assets/resources/c5b5c946c876fbf1bd5fc2f0f1616478.webp',frame:'FIELD LOG / 18:37',firstLineDelay:320,lineDelay:1900,
      rangeAudio:'latePursuit',
      lines:['밀로 I.P.D 장치 활성화','밀로에게 부착된 I.P.D 장치 활성화 확인.','원격 송신기 연결됨.']
    },
    {
      group:'imm_log',code:'TIME LOG / 18:42',title:'',subtitle:'IMG-MOVE',hideTitle:true,
      layout:'photoLarge',imageCode:'IMG-MOVE',logTime:'18:42',photoCaption:'이상 이동 패턴 감지',
      image:'assets/resources/8da1d79fd90b59063f33aa00f1eb742a.webp',frame:'FIELD LOG / 18:42',firstLineDelay:320,lineDelay:1900,
      rangeAudio:'latePursuit',
      lines:['밀로의 움직임이 비정상적이다.','무기를 확보할 것을 권장함.','마렌 예거트는 극심한 공포를 느끼고 있다.']
    },
    {
      group:'imm_log',code:'TIME LOG / 18:44',title:'',subtitle:'IMG-COMM',hideTitle:true,
      layout:'photoLarge',imageCode:'IMG-COMM',logTime:'18:44',photoCaption:'비인가 통신 기록',
      image:'assets/resources/4af91e95281c83ead7c52b06dfbdca38.webp',frame:'FIELD LOG / 18:44',firstLineDelay:320,lineDelay:2200,
      lines:['우리가 전부 미안해, 예거트']
    },
    {
      group:'imm_log',code:'TIME LOG / 18:51',title:'',subtitle:'',hideTitle:true,
      layout:'redLog',hideLogHeader:true,logTime:'18:51',frame:'FIELD LOG / 18:51',firstLineDelay:550,lineDelay:2000,
      lines:['7분대가 이동을 계속하고 있다.','보고 중...'],reportAudio:true
    },
    {
      group:'imm_log',code:'TIME LOG / 18:56',title:'',subtitle:'IMG006',hideTitle:true,
      layout:'photoLarge',imageCode:'IMG006',logTime:'18:56',photoCaption:'마지막 이미지 전송',
      image:'assets/resources/05cdc0276694d090f3829c4dc6e5a30b.webp',frame:'FIELD LOG / 18:56',firstLineDelay:320,lineDelay:2300,
      lines:['호수가 너를 기다린다.','너를 향해 수천 개의 손을 뻗으며...']
    },
    {
      group:'imm_end',code:'MISSION STATUS / COMPLETE',title:'',subtitle:'',hideTitle:true,
      layout:'redLog',hideLogHeader:true,logTime:'19:00',frame:'MISSION COMPLETE / 19:00',firstLineDelay:600,lineDelay:2200,
      lines:['임무 상태: 완료','기록 열람이 종료되었습니다. 다음 입력 시 기록보관소로 복귀합니다.']
    }
  ];
  root.ProjectCurseImmortalityStoryboard=Object.freeze(pages.map(page=>Object.freeze(page)));
})(window);
