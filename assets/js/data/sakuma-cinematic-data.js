// MapPatch 5.15.2cf — cinematic opening sequence for Sakuma's Tapes.
(function(root){
  'use strict';
  root.ProjectCurseSakumaCinematic=Object.freeze({
    record:'Sakuma_Tape_991028',
    pages:Object.freeze([
      {
        group:'warning', code:'S.I.D OCCULT ARCHIVE / WARNING NOTICE', title:'Warning Notice',
        subtitle:'열람 경고', frame:'S.I.D TOKYO BRANCH / RESTRICTED MATERIAL',
        layout:'warningNotice', lineDelay:900, lines:[
          '본 자료는 S.I.D 오컬트 부서의 기밀 기록이다. 담당자 입회 없는 단독 열람은 금지한다.',
          'S.I.D 일본 도쿄 지부가 보관하던 사건 기록으로, 토센 고등학교 일대의 연쇄 피해와 조사관 사쿠마 유타의 실종 경위를 담고 있다.'
        ]
      },
      {
        group:'personnel', code:'PERSONNEL FILE 01 / SAKUMA YUTA', title:'사쿠마 유타',
        subtitle:'S.I.D 일본 도쿄 지부 · 오컬트 사건 조사관', frame:'TOKYO BRANCH / INVESTIGATOR PROFILE',
        layout:'victimSlide', lineDelay:900, photoSfx:false,
        image:'assets/resources/archive-enex/source-records/376bae421e3febc2585d99b27a65e0ea.jpg',
        lines:[
          '전직 형사 출신의 사설 탐정. 경찰을 떠난 뒤 건강 문제로 쉬고 있던 중 S.I.D 일본 도쿄 지부의 의뢰를 받았다.',
          '토센 고등학교 사건에서 피해자 주변 인물의 진술과 현장 기록을 대조하고, 우시노다교의 흔적과 공식 명단에 없는 피해 자료를 추적했다.'
        ]
      },
      {
        group:'personnel', code:'PERSONNEL FILE 02 / KIMURA KYO', title:'키무라 쿄',
        subtitle:'S.I.D 일본 도쿄 지부 · 오컬트 분석팀장', frame:'TOKYO BRANCH / ANALYSIS PROFILE',
        layout:'briefText', lineDelay:900, lines:[
          '키무라 쿄는 S.I.D 일본 도쿄 지부에서 현장 특수효과와 이상현상 흔적을 분석해 왔다. 현재는 중대 범죄와 오컬트 사건을 다루는 분석팀을 이끈다.',
          '토센 고등학교 사건에서는 의식 흔적을 판독하고 피해자 관계 기록과 사쿠마의 조사 자료를 검토했다.',
          '사쿠마의 상태 악화와 연락 두절을 처음 내부에 보고한 인물이기도 하다.'
        ]
      },
      {
        group:'victim', code:'VICTIM 01-A / YOKIAWA KANA', title:'요키아와 카나',
        subtitle:'토센 고등학교 2학년', frame:'S.I.D TOKYO / VICTIM FILE 01-A',
        layout:'victimSlide', photoSfx:false,
        image:'assets/resources/archive-enex/source-records/daa52fcde14e129a569b7c1703bf0c5c.jpg',
        lines:[]
      },
      {
        group:'victim', code:'VICTIM 01-B / YOKIAWA KANA', title:'요키아와 카나',
        subtitle:'토센 고등학교 2학년', frame:'S.I.D TOKYO / VICTIM FILE 01-B',
        layout:'victimSlide', photoSfx:true, hideIdentity:true,
        image:'assets/resources/archive-enex/source-records/885ee44769a96ffb78b85332f5e0bb29.jpg',
        lines:[
          '방과 후 동아리 활동을 마치고 교실을 정리하던 것으로 보인다.',
          '피해자는 정체불명의 습격을 받아 전신이 찢기고 뜯긴 상태로 발견됐다.',
          '현장에는 방어 흔적이 남아 있었지만 공격 개체나 가해자를 특정할 단서는 발견되지 않았다.',
          '시신의 훼손 양상은 흉기 범죄나 야생 동물의 습격과 일치하지 않는다.'
        ]
      },
      {
        group:'victim', code:'VICTIM 02-A / MASATO KOMA', title:'마사토 코마',
        subtitle:'토센 고등학교 1학년', frame:'S.I.D TOKYO / VICTIM FILE 02-A',
        layout:'victimSlide', photoSfx:false,
        image:'assets/resources/archive-enex/source-records/422b416d660766cd0d31da5cb5b3bc24.jpg',
        lines:[]
      },
      {
        group:'victim', code:'VICTIM 02-B / MASATO KOMA', title:'마사토 코마',
        subtitle:'토센 고등학교 1학년', frame:'S.I.D TOKYO / VICTIM FILE 02-B',
        layout:'victimSlide', photoSfx:true, hideIdentity:true,
        image:'assets/resources/archive-enex/source-records/39d2854de98c700cd055b89eaed3a169.jpg',
        lines:[
          '피해자의 몸 안에서 무언가가 빠져나와 바닥을 기어간 듯한 혈흔이 확인됐다.',
          '혈흔은 교실에서 복도까지 이어졌다. 시신에는 장기 손상과 비정상적인 파열 흔적이 남아 있었다.',
          '학생과 교직원, 임시 고용 인력 및 피해자 주변 인물에 대한 추가 조사가 필요하다.',
          '피해자 관계인에 대한 추가 조사 요청은 승인됐다.'
        ]
      },
      {
        group:'victim', code:'VICTIM 03-A / KAITO REN', title:'카이토 렌',
        subtitle:'유시마 대학교 학생 · 토센 고등학교 졸업생', frame:'S.I.D TOKYO / VICTIM FILE 03-A',
        layout:'victimSlide', photoSfx:false,
        image:'assets/resources/archive-enex/source-records/a0574079b4d9dfe7d5ed810e28c2e7c5.jpg',
        lines:[]
      },
      {
        group:'victim', code:'VICTIM 03-B / KAITO REN', title:'카이토 렌',
        subtitle:'유시마 대학교 학생 · 토센 고등학교 졸업생', frame:'S.I.D TOKYO / VICTIM FILE 03-B',
        layout:'victimSlide', photoSfx:true, hideIdentity:true,
        image:'assets/resources/archive-enex/source-records/662fb6a54c038230ca310f8af407a2cd.jpg',
        lines:[
          '피해자는 자택에서 엽총에 의한 자살로 추정되는 상태로 발견됐다.',
          '자택 책장에서는 우시노다교 신자에게 배포된 것으로 보이는 서적 한 권이 나왔다.',
          '벽 곳곳에는 알아보기 힘든 문자가 휘갈겨져 있었다. 일부는 앞선 사건 현장의 의식 문자와 형태가 유사했다.',
          '피해자가 사망 전 정신 오염이나 의식성 암시에 노출됐을 가능성이 있다.'
        ]
      },
      {
        group:'victim', code:'VICTIM 04-A / TAKEMI YUI', title:'타케미 유이',
        subtitle:'토센 고등학교 교사 · 휴직 중', frame:'S.I.D TOKYO / VICTIM FILE 04-A',
        layout:'victimSlide', photoSfx:false,
        image:'assets/resources/archive-enex/source-records/930edd1fbafe7b54506b445174e73987.jpg',
        lines:[]
      },
      {
        group:'victim', code:'VICTIM 04-B / TAKEMI YUI', title:'타케미 유이',
        subtitle:'토센 고등학교 교사 · 휴직 중', frame:'S.I.D TOKYO / VICTIM FILE 04-B',
        layout:'victimSlide', photoSfx:true, hideIdentity:true,
        image:'assets/resources/archive-enex/source-records/811ebd2879e69f6174932925ac0a3bad.jpg',
        lines:[
          '피해자는 자택 침대 위에서 몸통이 비스듬히 절단된 상태로 발견됐다.',
          '바닥에는 앞선 현장에서 회수된 것과 같은 우시노다교 서적이 놓여 있었다.',
          '동물의 피와 살점이 바닥에 흩어져 있었고, 그 주위에는 문자가 원형으로 그려져 있었다.',
          '현장 배치로 보아 피해자가 소환 의식을 준비하고 스스로를 제물로 삼았을 가능성이 있다.'
        ]
      },
      {
        group:'closing', code:'VICTIM INDEX / RECOVERED CAMERA', title:'', hideTitle:true,
        subtitle:'', frame:'S.I.D TOKYO / RECOVERED CAMERA',
        layout:'warningNotice', lineDelay:850, lines:[
          '이외 52명의 피해자에 관한 내용은 동일 분류의 세부 피해자 기록에서 확인해야 한다.',
          '공통적으로 다음 요소가 확인되었다.',
          '수많은 시신과 범죄 현장 사진 외에도, 유난히 이상한 사진들이 함께 발견되었다.',
          '다음 기록은 이 카메라로 촬영된 마지막 사진들이다.'
        ]
      },
      {
        group:'ending', code:'RECOVERED CAMERA / FRAME 01', title:'사쿠마 유타 개인 메모',
        subtitle:'', frame:'S.I.D TOKYO / LAST CAMERA FRAME 01',
        layout:'victimSlide', photoSfx:true, hideIdentity:true,
        image:'assets/resources/archive-enex/source-records/7e0841b0aa3a24e0fb01fd2611665460.jpg',
        lines:['그것을 이곳에 소환했다… 이제 4단계로 넘어가야 한다.']
      },
      {
        group:'ending', code:'RECOVERED CAMERA / FRAME 02', title:'생일 축하해, 여보',
        subtitle:'', frame:'S.I.D TOKYO / LAST CAMERA FRAME',
        layout:'victimSlide', specialSequence:'sakumaBirthday', photoSfx:true, hideIdentity:true,
        image:'assets/resources/archive-enex/source-records/b2fb8ea921916789c0f39989d106b670.jpg',
        lines:['생일 축하해, 여보.']
      },
      {
        group:'ending', code:'SEARCH STATUS / ACTIVE', title:'', hideTitle:true,
        subtitle:'', frame:'S.I.D TOKYO / CASE REMAINS OPEN',
        layout:'warningNotice', lineDelay:900, hold:9000, lines:[
          '사쿠마 유타에 대한 수색은 지금도 계속되고 있다.'
        ]
      }
    ])
  });
})(window);
