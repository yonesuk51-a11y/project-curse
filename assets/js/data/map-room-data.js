// Project Curse 5.25.0 — geographic control map, routes, drilldowns, and shared incident traces.
(function(root){
  'use strict';

  function freeze(value){
    if(!value || typeof value!=='object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  const network=root.ProjectCurseIncidentNetwork;

  root.ProjectCurseMapRoom=freeze({
    version:'map-room-v8',
    viewBox:'0 0 1200 620',
    geography:[
      {id:'greenland',d:'M319 53 L360 39 394 70 378 121 341 132 311 95 Z'},
      {id:'north-america',d:'M78 112 L133 73 219 62 290 88 335 127 319 165 350 194 322 225 285 228 260 266 222 286 178 268 150 231 106 218 72 176 Z'},
      {id:'central-america',d:'M270 269 L305 279 328 305 314 326 286 307 Z'},
      {id:'south-america',d:'M318 319 L370 300 426 326 452 373 447 426 421 477 402 538 363 577 337 534 329 477 304 431 295 373 Z'},
      {id:'europe',d:'M521 116 L567 92 621 101 653 126 633 153 655 178 615 195 576 178 548 194 514 166 Z'},
      {id:'africa',d:'M531 205 L608 190 672 227 684 302 654 378 611 430 566 391 548 327 511 276 Z'},
      {id:'asia',d:'M645 118 L724 78 828 68 932 92 1040 126 1092 178 1061 225 1004 237 961 280 887 270 842 235 776 249 724 211 664 196 628 158 Z'},
      {id:'india',d:'M773 244 L836 252 849 301 813 353 783 315 Z'},
      {id:'se-asia',d:'M854 270 L909 281 939 315 917 340 879 321 Z'},
      {id:'australia',d:'M920 397 L985 374 1054 402 1067 455 1021 493 948 482 906 442 Z'},
      {id:'japan',d:'M1021 204 L1033 221 1025 248 1014 238 Z'}
    ],
    regions:[
      {
        id:'world',label:'세계',code:'WORLD CONTROL',viewBox:'0 0 1200 620',
        status:'권역 선택',confidence:'관측망 63%',
        description:'폐쇄 서버에 남은 권역 신호를 표시한다. 세부 좌표는 권역 진입 후 확인한다.'
      },
      {
        id:'eastasia',label:'동아시아',code:'EAST ASIA WATCH',viewBox:'665 45 520 290',
        status:'북부 전선 / 도시 감시',confidence:'관측 신뢰도 78%',
        description:'도쿄 감시권, 란저우 레드존과 북부 전쟁 신호가 동시에 유지되는 권역.'
      },
      {
        id:'europe',label:'유럽',code:'EUROPE SEA LOCK',viewBox:'390 55 500 280',
        status:'북해 봉쇄 유지',confidence:'관측 신뢰도 84%',
        description:'피의 호수와 F.H.C 유럽 분석권을 중심으로 한 북해 봉쇄축.'
      },
      {
        id:'northamerica',label:'북미 데드존',code:'DEAD ZONE / NORTH',viewBox:'15 35 520 290',
        status:'내륙 응답 없음',confidence:'지도 신뢰도 22%',
        description:'과거 국가 지도와 현재 순례자 귀환 기록이 일치하지 않는 대륙.'
      },
      {
        id:'southamerica',label:'남미 대흑림',code:'GREAT BLACK FOREST',viewBox:'190 275 570 320',
        status:'공간 측량 불가',confidence:'지도 신뢰도 31%',
        description:'외부 해안선은 유지되지만 내부 거리와 정착지 좌표가 반복적으로 어긋나는 권역.'
      }
    ],
    zones:[
      {id:'north-dead',region:'northamerica',className:'dead',d:'M112 112 C174 78 284 84 330 126 C354 166 322 227 269 252 C206 273 126 236 94 180 Z'},
      {id:'gbf',region:'southamerica',className:'forest',d:'M317 327 C374 304 433 337 446 388 C453 443 412 536 365 571 C328 530 310 457 299 390 C296 359 302 341 317 327 Z'},
      {id:'blood-lake',region:'europe',className:'red',d:'M555 141 C571 129 594 132 607 146 C598 163 576 171 558 161 Z'},
      {id:'lanzhou-zone',region:'eastasia',className:'red',d:'M805 180 C836 157 872 168 884 193 C870 220 833 229 807 211 Z'}
    ],
    routes:[
      {id:'deadzone-pilgrimage',region:'northamerica',className:'pilgrimage',points:[[151,226],[177,202],[203,181],[236,164],[273,151]],label:'RETURN PATH / TESTIMONY ONLY'},
      {id:'gbf-western',region:'southamerica',className:'pilgrimage',points:[[425,397],[391,414],[351,442],[371,477],[408,489]],label:'WESTERN PILGRIM TRACE'},
      {id:'southern-mobilization',region:'southamerica',className:'hostile',points:[[427,398],[406,372],[379,354],[350,340]],label:'COASTAL MOBILIZATION'},
      {id:'northern-pressure',region:'eastasia',className:'front',points:[[841,197],[887,166],[934,120],[980,148]],label:'NORTHERN FRONT'}
    ],
    markers:[
      {id:'east-overview',region:'eastasia',overview:true,x:913,y:170,type:'signal',title:'동아시아 감시권',meta:'도쿄·란저우·북부 전선',status:'감시 강화',confidence:'confirmed'},
      {id:'europe-overview',region:'europe',overview:true,x:579,y:139,type:'incident',title:'북해 봉쇄축',meta:'피의 호수 잔류 반응',status:'봉쇄 유지',confidence:'confirmed'},
      {id:'north-overview',region:'northamerica',overview:true,x:220,y:157,type:'unknown',title:'북미 데드존',meta:'내륙 관측 신호 소실',status:'응답 없음',confidence:'disputed'},
      {id:'south-overview',region:'southamerica',overview:true,x:374,y:408,type:'anomaly',title:'대흑림',meta:'내부 거리 불일치',status:'통제권 없음',confidence:'estimated'},

      {id:'tokyo',region:'eastasia',x:1019,y:223,type:'facility',title:'S.I.D 도쿄 지부',meta:'도시 감시·오컬트 수사',status:'가동',confidence:'confirmed',records:['Sakuma_Tape_991028'],incident:'evt-tokyo-record'},
      {id:'lanzhou',region:'eastasia',x:841,y:197,type:'zone',title:'란저우 레드존',meta:'내륙 광역 오염권',status:'외곽 봉쇄',confidence:'observed',records:['Zone_870815']},
      {id:'northern-front',region:'eastasia',x:934,y:120,type:'line',title:'북부 전쟁 관측선',meta:'일본 동맹권 / 짐승의 길',status:'전선 신호 증가',confidence:'estimated',incident:'evt-northern-front'},

      {id:'blood-lake-site',region:'europe',x:579,y:151,type:'incident',title:'피의 호수 사건권',meta:'독일·덴마크 사이 북해권',status:'잔류 반응',confidence:'confirmed',records:['Immortality_860201','Unknown_Record2_860205'],operation:'op-immortality',incident:'evt-blood-lake'},
      {id:'fhc-europe',region:'europe',x:611,y:181,type:'facility',title:'F.H.C 유럽 분석권',meta:'회수 샘플·기술 분석',status:'부분 가동',confidence:'observed'},

      {id:'dead-interior',region:'northamerica',x:236,y:164,type:'unknown',title:'내륙 무응답권',meta:'국가·도시 신호 소실',status:'NO CARTOGRAPHIC RESPONSE',confidence:'disputed'},
      {id:'returned-coast',region:'northamerica',x:151,y:226,type:'returned',title:'서부 귀환 지점',meta:'순례자 귀환 기록 7건',status:'격리선 유지',confidence:'observed',records:['Dead_Zone_Pilgrimage'],operation:'op-deadzone-return',incident:'evt-deadzone-return'},
      {id:'former-us-branch',region:'northamerica',x:304,y:223,type:'facility',title:'위버멘시 미국 지부',meta:'2006년 습격 이후 폐쇄',status:'좌표 재확인 불가',confidence:'historical',incident:'evt-deadzone-raid'},

      {id:'gbf-core',region:'southamerica',x:368,y:405,labelX:-13,labelAnchor:'end',type:'anomaly',title:'대흑림 내부권',meta:'외부 면적과 내부 거리 불일치',status:'측량 불가',confidence:'estimated',records:['Great_Black_Forest_Region']},
      {id:'monsur-church',region:'southamerica',x:351,y:442,labelX:-13,labelAnchor:'end',type:'cult',title:'몬수르 서부 교회',meta:'순례자 보호·종 운반 요청',status:'불완전 교신',confidence:'testimony',operation:'op-unlit-fortress'},
      {id:'unlit-fortress',region:'southamerica',x:408,y:489,type:'fortress',title:'불빛 없는 성채',meta:'외부 폐허 / 내부 거주 진술',status:'좌표 중첩',confidence:'disputed',operation:'op-unlit-fortress',incident:'evt-gbf-unlit'},
      {id:'black-river',region:'southamerica',x:371,y:517,labelX:-13,labelAnchor:'end',type:'anomaly',title:'검은 강 제4관측점',meta:'관측 시각마다 위치 변경',status:'접근 금지',confidence:'observed',records:['Pilgrim_Rules_GBF'],operation:'op-unlit-fortress'},
      {id:'southern-coast',region:'southamerica',x:425,y:397,type:'line',title:'남방 해안 동원 신호',meta:'집단 소환·성위대 침투 징후',status:'CRITICAL / PARTIAL',confidence:'estimated',records:['Operation_Broken_Crown'],operation:'op-southern-coup',incident:'evt-southern-mobilization'}
    ],
    drilldowns:root.ProjectCurseRegionalDrilldown?.districts||[],
    operations:[
      ...(network?.operations||[]),
      {
        id:'op-deadzone-return',label:'돌아온 자의 이름',code:'DZ-RETURN-SCREEN-07',region:'북미 데드존',
        summary:'서부 귀환 신호에서 검문소 07 내측문까지 네 귀환자와 다섯 번째 생체 반응을 분리한 검문 경로.',
        sites:[
          {x:92,y:112,label:'서부 귀환 신호',kind:'unknown'},
          {x:244,y:168,label:'백색 재 검문소',kind:'facility'},
          {x:397,y:231,label:'진술 분리실',kind:'facility'},
          {x:548,y:282,label:'기억 체크섬',kind:'anomaly'},
          {x:704,y:348,label:'격리 회랑',kind:'incident'},
          {x:874,y:402,label:'최종 귀환 판정',kind:'facility'}
        ],
        steps:[
          {time:'04:12',title:'서부 귀환 신호',note:'육안 인원은 4명, 열원과 출입 요청은 5개로 확인됐다.',route:[[92,112]],units:[{id:'R-01',x:92,y:112,status:'normal'},{id:'X-05',x:112,y:126,status:'unknown'}]},
          {time:'04:26',title:'백색 재 분리',note:'귀환 물질이 출발 기록 사진의 얼굴을 순차적으로 지웠다.',route:[[92,112],[244,168]],units:[{id:'R-01',x:244,y:168,status:'normal'},{id:'X-05',x:226,y:184,status:'unknown'}]},
          {time:'04:51',title:'진술 대조',note:'격리된 네 사람이 같은 왕국의 기억을 한 문장으로 진술했다.',route:[[92,112],[244,168],[397,231]],units:[{id:'R-01',x:397,y:231,status:'unstable'},{id:'R-02',x:418,y:246,status:'unstable'}]},
          {time:'05:17',title:'기억 체크섬',note:'네 번째 귀환자가 개봉하지 않은 다섯 번째 봉인의 문장을 읽었다.',route:[[92,112],[244,168],[397,231],[548,282]],alternate:[[397,231],[548,240]],units:[{id:'R-04',x:548,y:282,status:'split'},{id:'X-05',x:548,y:240,status:'unknown'}]},
          {time:'05:44',title:'격리 회랑 봉쇄',note:'검문소 밖에서 내부 인원과 동일한 네 호출 부호가 구조 신호를 보냈다.',route:[[92,112],[244,168],[397,231],[548,282],[704,348]],alternate:[[92,112],[704,310]],units:[{id:'R-01/04',x:704,y:348,status:'unstable'},{id:'EXT-05',x:704,y:310,status:'unknown'}]},
          {time:'06:03',title:'최종 귀환 판정',note:'네 명을 통과시키기 위해 시스템이 다섯 번째 운영자 승인을 요구했다.',route:[[92,112],[244,168],[397,231],[548,282],[704,348],[874,402]],units:[{id:'R-01/04',x:874,y:402,status:'split'},{id:'OP-05',x:850,y:379,status:'unknown'}]}
        ]
      },
      {
        id:'op-unlit-fortress',label:'불빛 없는 성채',code:'GBF-WESTERN-ROUTE',region:'남미 대흑림',
        summary:'S.I.D 기록 담당자와 귀환 순례자가 몬수르 교회의 부탁을 받아 불빛 없는 성채로 향한 경로.',
        sites:[
          {x:88,y:420,label:'외곽 관측소',kind:'facility'},
          {x:248,y:337,label:'몬수르 교회',kind:'cult'},
          {x:409,y:278,label:'결투 지점',kind:'incident'},
          {x:575,y:344,label:'검은 강',kind:'anomaly'},
          {x:716,y:244,label:'피의 호수',kind:'incident'},
          {x:876,y:132,label:'불빛 없는 성채',kind:'fortress'}
        ],
        steps:[
          {time:'16:10',title:'외곽 진입',note:'조사팀 4명. 통신과 경로 측정은 정상 범위였다.',route:[[88,420]],units:[{id:'T-01',x:88,y:420,status:'normal'}]},
          {time:'16:43',title:'몬수르 교회',note:'교회에서 작은 종을 인계받았다. 생체신호는 잠시 5명으로 표시됐다.',route:[[88,420],[248,337]],units:[{id:'T-01',x:248,y:337,status:'normal'},{id:'X-05',x:231,y:352,status:'unknown'}]},
          {time:'17:18',title:'귀환자의 결투',note:'결투 영상 프레임마다 참가 인원이 달라진다.',route:[[88,420],[248,337],[409,278]],units:[{id:'T-01',x:409,y:278,status:'unstable'},{id:'R-02',x:431,y:264,status:'normal'}]},
          {time:'17:41',title:'비현실감 구역',note:'같은 경로가 교회와 검은 강 양쪽으로 이어진다.',route:[[88,420],[248,337],[409,278],[505,318]],alternate:[[409,278],[248,337]],units:[{id:'T-01',x:505,y:318,status:'unstable'},{id:'X-05',x:486,y:301,status:'unknown'}]},
          {time:'18:06',title:'검은 강',note:'현재 조사팀과 동일한 일련번호의 장비가 강둑에서 회수됐다.',route:[[88,420],[248,337],[409,278],[505,318],[575,344]],units:[{id:'T-01',x:575,y:344,status:'unstable'},{id:'X-05',x:596,y:331,status:'unknown'}]},
          {time:'18:29',title:'피의 호수',note:'북부 전쟁 사망자 장비와 남방 특수부대 표식이 함께 발견됐다.',route:[[88,420],[248,337],[409,278],[505,318],[575,344],[716,244]],units:[{id:'T-01',x:716,y:244,status:'unstable'}]},
          {time:'18:51',title:'성채 진입',note:'외부에서는 불이 꺼졌으나 내부 주민들은 정상적으로 생활하고 있었다.',route:[[88,420],[248,337],[409,278],[505,318],[575,344],[716,244],[876,132]],units:[{id:'T-01',x:876,y:132,status:'split'},{id:'X-05',x:854,y:149,status:'unknown'}]},
          {time:'19:00',title:'처형 명령',note:'철수 경로가 사라지고 등록 인원은 4명에서 5명으로 변경됐다.',route:[[88,420],[248,337],[409,278],[505,318],[575,344],[716,244],[876,132]],alternate:[[876,132],[575,344],[248,337]],units:[{id:'T-01',x:876,y:132,status:'split'},{id:'X-05',x:876,y:132,status:'unknown'}]}
        ]
      },
      {
        id:'op-immortality',label:'불멸을 향해',code:'OP-IMMORTALITY',region:'유럽 북해권',
        summary:'유닛2의 진입부터 피의 호수 발견과 마지막 통신까지 복구한 작전 경로.',
        sites:[
          {x:104,y:410,label:'진입 지점',kind:'facility'},
          {x:302,y:330,label:'버려진 텐트',kind:'incident'},
          {x:533,y:260,label:'강변',kind:'anomaly'},
          {x:748,y:192,label:'피의 호수',kind:'incident'},
          {x:895,y:286,label:'마지막 신호',kind:'unknown'}
        ],
        steps:[
          {time:'16:10',title:'유닛2 도착',note:'예거트와 밀로가 현장에 진입했다.',route:[[104,410]],units:[{id:'U2-A',x:104,y:410,status:'normal'},{id:'U2-B',x:117,y:425,status:'normal'}]},
          {time:'17:02',title:'버려진 텐트',note:'민간인 체류 흔적과 다량의 혈흔을 확인했다.',route:[[104,410],[302,330]],units:[{id:'U2-A',x:302,y:330,status:'normal'},{id:'U2-B',x:286,y:343,status:'normal'}]},
          {time:'17:41',title:'강변 접근',note:'강물에서 혈액과 유사한 점도와 응고 반응이 관측됐다.',route:[[104,410],[302,330],[533,260]],units:[{id:'U2-A',x:533,y:260,status:'unstable'},{id:'U2-B',x:511,y:276,status:'normal'}]},
          {time:'17:58',title:'피의 호수',note:'대규모 혈액성 웅덩이와 거대한 개체의 실루엣이 포착됐다.',route:[[104,410],[302,330],[533,260],[748,192]],units:[{id:'U2-A',x:748,y:192,status:'unstable'},{id:'U2-B',x:718,y:213,status:'unstable'}]},
          {time:'18:37',title:'밀로 신호 활성',note:'밀로가 예거트 후방 약 300m에서 비정상적인 이동을 시작했다.',route:[[104,410],[302,330],[533,260],[748,192],[824,236]],units:[{id:'U2-A',x:824,y:236,status:'unstable'},{id:'U2-B',x:747,y:293,status:'split'}]},
          {time:'18:42',title:'이상 이동',note:'밀로의 신호가 짧은 시간에 복수 좌표로 나타났다.',route:[[104,410],[302,330],[533,260],[748,192],[824,236],[895,286]],units:[{id:'U2-A',x:895,y:286,status:'unstable'},{id:'U2-B',x:842,y:312,status:'split'},{id:'U2-B',x:881,y:331,status:'split'}]},
          {time:'19:00',title:'임무 완료 처리',note:'통신이 끝났음에도 시스템은 임무를 완료로 기록했다.',route:[[104,410],[302,330],[533,260],[748,192],[824,236],[895,286]],units:[{id:'U2-A',x:895,y:286,status:'lost'},{id:'U2-B',x:895,y:286,status:'unknown'}]}
        ]
      }
    ]
  });
})(window);
