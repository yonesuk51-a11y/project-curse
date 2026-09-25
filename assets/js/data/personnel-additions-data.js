// Project Curse 6 — 2042년 단말에 따로 등록된 인물. 2006년 명부(personnel-data.js)와 섞지 않는다.
// 근거: 사용자 설정글(2026-09-13 ~ 2026-09-22). 2026-09-24 사용자가 인물 기록 반영을 승인했다.
// 설정글에 없는 사실은 적지 않는다. 확인되지 않은 연결과 연대는 limits에 남긴다.
// 2026-09-25 카카오스토리 설정글 대조 반영(사용자 추천안 승인): 우시노다교 사도 7명(그림 설명의 교단 명단), N.H.C 대원 5명,
// 히라에스의 제3사도 표기(같은 날 사용자가 커네빈과 같은 인물로 확인), 미카게 시오리의 어머니 구절.
(function (root) {
  'use strict';

  function freeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

  // 2026-09-25 사용자 채택 인물 사진 — 원작자 설정화의 외형을 따른 인물 재구성. id별로 records에 붙인다.
  const portraits = {
    'tachibana-isamu': {src:'assets/resources/derived/tachibana-isamu-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'폐쇄시설 입구에서 흰 머리의 타치바나 이사무가 두 자루 칼과 내려 든 권총을 지닌 채 보랏빛 틈이 난 그림자 망토 너머로 돌아본다.',caption:'대조용 인물 재구성 스케치다. 그림자의 발현 경위와 잃은 기억의 내용은 확정하지 않는다.'},
    'kagami-itsuki': {src:'assets/resources/derived/kagami-itsuki-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'카가미 이츠키가 어두운 자료실의 열린 문서함 곁에 앉아 민무늬 폴더를 든 채 안경 너머로 돌아본다.',caption:'대조용 인물 재구성 스케치다. 본명과 감사를 맡은 기관, 활동 연도는 확정하지 않는다.'},
    'enrilbani': {src:'assets/resources/derived/enrilbani-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'작은 흰 얼굴면만 드러낸 엔릴바니가 털 망토와 긴 로브를 두르고 보랏빛 연무의 숲에서 그림자 조각을 흩뜨린다.',caption:'대조용 인물 재구성 스케치다. 흰 얼굴면 너머의 실제 얼굴과 육체, 로드좌와의 관계는 확정하지 않는다.'},
    'epoptes': {src:'assets/resources/derived/epoptes-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'긴 머리와 여러 줄 눈을 지닌 에폽테스가 라벤더 창빛 아래 여섯 날개를 펼치고 뼈 손을 모아 앉아 있다.',caption:'「본 자의 서」 제1장의 묘사에 맞춘 인물 재구성 스케치다. 강림의 연대와 장소, 현재 생존은 확정하지 않는다.'},
    'kieran-hayward': {src:'assets/resources/derived/kieran-hayward-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'가시 머리와 빈 얼굴의 키어런 헤이워드가 대흑림의 나무 사이에서 긴 발톱 팔을 늘어뜨리고 찢긴 망토를 잡고 있다.',caption:'대조용 인물 재구성 스케치다. 교단 내 정확한 직위와 거점, 의식의 목적은 확정하지 않는다.'},
    'yanan-kes': {src:'assets/resources/derived/yanan-kes-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'투명한 곤충 날개 네 장과 메마른 팔다리를 지닌 야난 케스가 대흑림의 나무 사이에 붉은 장창을 세우고 서 있으며 멀리 성채 입구가 빛난다.',caption:'대조용 인물 재구성 스케치다. 천로교의 교리와 규모, 순회 경로는 확정하지 않는다.'},
    'kenevin': {src:'assets/resources/derived/kenevin-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'해진 녹회색 망토와 황갈색 겉옷의 커네빈이 순례 피난처 벤치에 앉아 긴 창과 어깨짐을 붙들고 어두운 숲 쪽을 본다.',caption:'대조용 인물 재구성 스케치다. 기사에서 이질적 존재로 바뀐 경위와 현재 소재는 확정하지 않는다.'},
    'alullim': {src:'assets/resources/derived/alullim-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'짙은 흑갈색 후드와 민무늬 원판 메달을 한 알룰림이 검붉은 등불이 비추는 계단에 서 있고 뒤 벽에는 두 뿔의 그림자가 드리워져 있다.',caption:'대조용 인물 재구성 스케치다. 얼굴과 정체, 한 존재인지 반복 현상이나 계승 좌석인지는 확정하지 않는다.'},
    'mikage-shiori': {src:'assets/resources/derived/mikage-shiori-portrait-concept-v1.png',className:'RECONSTRUCTED',label:'PORTRAIT RECONSTRUCTION / 인물 재구성',alt:'짙은 머리와 초커를 한 성인 미카게 시오리가 빈 신분증과 부적 카드·인형 장식을 지닌 채 복도에 서 있고, 뒤에는 붉은 눈 하나와 여러 발톱 손을 가진 검붉은 망령이 있다.',caption:'대조용 인물 재구성 스케치다. 아버지의 이름과 사망 경위, 저주의 내용은 확정하지 않는다.'}
  };
  const withPortraits = (list) => list.map((record) => (portraits[record.id] ? { ...record, visual: portraits[record.id] } : record));

  root.ProjectCursePersonnelAdditions = freeze({
    version: '6.0.0',
    label: '2042 추가 등록',
    intro: '2006년 명부 밖에서 2042년 단말에 따로 등록된 인물이다. 활동 연대가 기록마다 달라 기준 연도를 인물마다 적었다.',
    groups: [
      { id: 'nhc-additional', label: 'N.H.C 대괴이 전투요원', short: 'N.H.C 추가', code: 'NHC', tone: 'field', factionKeys: ['nhc'] },
      { id: 'fhc-education', label: 'F.H.C 교육기관 감사선', short: '교육기관', code: 'FED', tone: 'corporate', factionKeys: ['fhc'] },
      { id: 'ushinoda-figures', label: '우시노다교 수장·예외 존재', short: '우시노다 추가', code: 'USF', tone: 'cult', factionKeys: ['ushinoda'] },
      { id: 'independent-rites', label: '독립 교단·성채권', short: '독립 교단', code: 'IND', tone: 'cult', factionKeys: [] },
      { id: 'unaffiliated', label: '소속 불명·특수 존재', short: '소속 불명', code: 'UNK', tone: 'civilian', factionKeys: [] }
    ],
    records: withPortraits([
      {
        id: 'tachibana-isamu', name: '타치바나 이사무', aliases: ['아바야'], group: 'nhc-additional',
        role: 'N.H.C 대괴이 전투요원 / 코드명 아바야', status: 'active', certainty: 'listed', registerYear: '연대 미확정',
        unit: 'N.H.C 대괴이 전투요원',
        overview: '두려움이 있던 자리를 그림자가 채운 뒤로 어떤 괴이 앞에서도 물러서지 않는 것으로 기록된 N.H.C 전투요원이다.',
        affiliations: [{ key: 'nhc', label: 'N.H.C', role: '대괴이 전투요원 / 코드명 아바야', certainty: 'listed' }],
        abilitySource: '그림자 — 두려움이 있던 자리를 채움(발현 경로 미확인)',
        abilityCost: '그 대가로 무엇을 잃었는지 본인이 기억하지 못한다.',
        limits: ['그림자가 두려움을 채운 시점과 경위는 기록되지 않았다.', '잃은 기억의 범위와 소속 부대는 확인되지 않았다.']
      },
      {
        id: 'kagami-itsuki', name: '카가미 이츠키', group: 'fhc-education',
        role: 'F.H.C 교육기관 내부감사관', status: 'unknown', certainty: 'partial', registerYear: '연대 미확정',
        unit: 'F.H.C 교육기관 내부감사',
        overview: '교육기관 내부 감사를 담당하는 것으로 기록됐다. 어느 기관도 본명을 알지 못한다.',
        affiliations: [{ key: 'fhc', label: 'F.H.C', role: '교육기관 내부감사관', certainty: 'partial' }],
        limits: ['카가미 이츠키가 본명인지 확인되지 않았다.', '감사를 맡은 기관과 활동 연도는 기록되지 않았다.']
      },
      {
        id: 'enrilbani', name: '엔릴바니', group: 'ushinoda-figures',
        role: '그림자교 수장', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: '우시노다교 그림자 파벌',
        overview: '그림자의 힘에 처음 도달한 존재이자 어둠 속을 다스리는 왕으로 불리는 그림자교의 수장이다.',
        affiliations: [
          { key: 'shadow-cult', label: '그림자교', role: '수장', certainty: 'listed' },
          { key: 'ushinoda', label: '우시노다교', role: '그림자 파벌', certainty: 'listed' }
        ],
        limits: ['"그림자의 힘에 처음 도달했다"는 표현이 연대 기록인지 교단 칭호인지는 확인되지 않았다.', '수장 자리가 계보상 로드좌와 같은 자리인지는 확인되지 않았다.']
      },
      {
        id: 'alullim', name: '알룰림', group: 'ushinoda-figures',
        role: '우시노다교 제1사도', status: 'unknown', certainty: 'unresolved', registerYear: '교단 창설 이전부터',
        unit: '우시노다교 / 세 파벌의 사도 정원 밖',
        overview: '교단이 세워지기 전부터 기록에 나타나며, 세 파벌의 권능을 모두 쓰지만 어느 파벌의 사도 정원에도 들지 않는 존재로 기록됐다. 교단 기록은 첫 번째 사도를 이 이름으로 부른다.',
        affiliations: [
          { key: 'first-apostle', label: '첫 번째 사도', role: '기록명 알룰림', certainty: 'listed' },
          { key: 'ushinoda', label: '우시노다교', role: '제1사도 / 정원 밖', certainty: 'listed' }
        ],
        relationships: [{ target: 'apostle-luke-eugene', relation: '제1석 주장자로 기록된 인물이다. 알룰림과의 관계는 확인되지 않았다.', certainty: 'unresolved' }],
        limits: ['알룰림이 한 존재의 이름인지, 시대마다 되풀이되는 현상이나 계승 좌석의 이름인지는 결정 대기 상태다.']
      },
      {
        id: 'epoptes', name: '에폽테스', aliases: ['본 자'], group: 'independent-rites',
        role: "소규모 교단 '천사의 내장'의 숭배 대상", status: 'unknown', certainty: 'unresolved', registerYear: '암흑시대 전승',
        unit: '천사의 내장',
        overview: '먼 암흑시대에 천사의 강림을 보고도 살아남아, 그 대가로 날개와 눈을 얻었다고 전해지는 존재다. 교단 경전 「본 자의 서」는 에폽테스를 "본 자"라고 부른다.',
        notes: ['천사의 내장은 혈맹의 공통 서약을 거부한 소규모 교단 가운데 하나로 기록돼 있다.', '「본 자의 서」 필사본은 세계 기록 「천사 강림과 「본 자의 서」」에 실려 있다.'],
        limits: ['강림의 연대와 장소, 에폽테스가 지금도 존재하는지는 확인되지 않았다.', '날개와 눈에 관한 서술은 교단 경전과 전승에 근거한다.']
      },
      {
        id: 'kieran-hayward', name: '키어런 헤이워드', group: 'independent-rites',
        role: '삼림계 교단 관리자', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: '삼림계 교단',
        overview: '삼림계 교단의 관리자로 기록됐다. 삼림계 교단은 대흑림에서 식생 의식과 길 표식을 유지하는 집단 가운데 하나다.',
        limits: ['관리하는 거점의 위치와 교단 안의 정확한 직위는 기록되지 않았다.', '삼림계 교단의 의식 목적은 확인되지 않았다.']
      },
      {
        id: 'yanan-kes', name: '야난 케스', group: 'independent-rites',
        role: '천로교 도행자(道行者) / 대흑림 성채권 순회', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: '천로교',
        overview: '천로교의 도행자로, 대흑림 성채권을 순회하는 것으로 기록됐다.',
        limits: ['천로교의 교리와 규모, 순회 경로는 기록되지 않았다.', '천로교와 우시노다교 세 파벌의 관계는 확인되지 않았다.']
      },
      {
        id: 'mikage-shiori', name: '미카게 시오리', group: 'unaffiliated',
        role: '소속 불명의 특수 존재', status: 'unknown', certainty: 'partial', registerYear: '연대 미확정',
        overview: '추악한 망령이 곁에 머무는 것을 허락한 인물로 기록됐다. 망령은 여섯 살 때 세상을 떠난 아버지의 뒤틀린 영혼이며, 그 영혼에게 저주받은 것으로 전해진다.',
        // 2026-09-24 사용자 확인: 설정글 「사랑스런 아빠」의 화자가 미카게 시오리다.
        background: [
          '아버지는 S.I.D에서 인정받던 조사관이었다. 시오리가 여섯 살이 되던 해 세상을 떠났다.',
          '일곱 살 무렵, 떠난 아버지가 곁에 남아 있다는 것을 처음 알았다. 아버지는 아무 말 없이 다가왔고, 시오리가 울음을 터뜨리면 조용히 모습을 감췄다.',
          '어른이 된 뒤에도 아버지는 곁에 머문다. 손을 내밀 수도 말을 걸 수도 없지만, 지금도 가끔 아무 말 없이 다가온다.'
        ],
        notes: ['본인 구술: "그날 내가 울었던 이유는 두려움 때문만은 아니었다. 다시는 함께할 수 없다는 사실이 너무 슬펐던 것이다."', '생전의 아버지는 숨바꼭질을 좋아했고, 숨을 때마다 찾을 수 있도록 작은 힌트를 남겼다고 한다.', '본인 구술: "그래도 끝까지 나와 엄마를 지켜 주고 싶었던 게 아닐까."'],
        limits: ['아버지의 이름과 사망 경위, 영혼이 뒤틀린 이유는 기록되지 않았다.', '어머니의 이름과 지금의 소재는 기록되지 않았다.', '저주의 내용과 능력 여부, 현재 소속은 확인되지 않았다.']
      },
      {
        id: 'kenevin', name: '커네빈', aliases: ['히라에스', 'Hiraeth'], group: 'ushinoda-figures',
        role: '우시노다교 제3사도 / 암흑시대의 잊힌 기사', status: 'unknown', certainty: 'partial', registerYear: '암흑시대 전승',
        unit: '우시노다교 / 교단 명단의 제3사도',
        overview: '먼 암흑시대에 이신(異神)에 맞서 성벽에 섰던 기사로 전해진다. 지금은 히라에스라는 이름으로 불리는 이질적 존재가 됐다. 기사였던 시절을 기억하는 존재는 더 이상 남아 있지 않다.',
        notes: ['우시노다를 주군으로 부르는 화자의 구술은 히라에스를 우시노다에게 검을 겨눈 인간 전사로 기억한다. 고향에 아내와 어린 아들이 있었다고 전한다.', '히라에스는 돌아갈 수 없는 고향과 과거를 향한 그리움을 뜻하는 웨일스어다.', '구술 전문은 세계 기록 「외신 강림과 성벽의 저항」에 실려 있다.'],
        // 2026-09-25 사용자 확인("히라에스는 동일인물"): 교단 명단의 제3사도 히라에스가 커네빈이다. 제3사도가 된 경위는 기록되지 않았다.
        affiliations: [{ key: 'ushinoda', label: '우시노다교', role: '제3사도(교단 명단)', certainty: 'listed' }],
        relationships: [{ target: 'apostle-jade-jackson', relation: '2006년 명부에 같은 제3사도 번호로 기록된 인물이다. 같은 자리를 이은 것인지, 번호 체계가 다른 것인지 확인되지 않았다.', certainty: 'unresolved' }],
        limits: ['기사에서 이질적 존재로 바뀐 경위와 시점은 기록되지 않았다.', '우시노다에게 검을 겨눈 기사가 언제, 어떻게 우시노다교 제3사도가 됐는지는 기록되지 않았다.', '현재 소재와 적대 여부는 확인되지 않았다.']
      },
      // 2026-09-25 사용자 승인(추천안): 교단 명단의 우시노다교 사도 7명. 이름과 번호만 기록됐다.
      // 2006년 명부의 같은 번호 인물은 지우지 않고 상충 기록으로 둔다(정사 대장 '2026-09-25 카카오스토리 설정글 대조 반영').
      {
        id: 'apostle-camille-potier', name: '카미유 포티에', group: 'ushinoda-figures',
        role: '우시노다교 제2사도', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: '우시노다교 / 교단 명단의 제2사도',
        overview: '우시노다교 교단 명단에 제2사도로 적힌 이름이다. 능력·파벌·활동 시기는 명단에 적혀 있지 않다.',
        affiliations: [{ key: 'ushinoda', label: '우시노다교', role: '제2사도(교단 명단)', certainty: 'listed' }],
        relationships: [{ target: 'apostle-urzag', relation: '2006년 명부에 같은 제2사도 번호로 기록된 인물이다. 같은 자리를 이은 것인지, 번호 체계가 다른 것인지 확인되지 않았다.', certainty: 'unresolved' }],
        limits: ['교단 명단의 사도 번호가 2006년 명부의 사도 번호·사도석과 같은 체계인지 확인되지 않았다(상충 기록).', '능력과 대가, 파벌, 활동 시기는 기록되지 않았다.']
      },
      {
        id: 'apostle-viljar', name: '빌야르', group: 'ushinoda-figures',
        role: '우시노다교 제4사도', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: '우시노다교 / 교단 명단의 제4사도',
        overview: '우시노다교 교단 명단에 제4사도로 적힌 이름이다. 능력·파벌·활동 시기는 명단에 적혀 있지 않다.',
        affiliations: [{ key: 'ushinoda', label: '우시노다교', role: '제4사도(교단 명단)', certainty: 'listed' }],
        relationships: [{ target: 'apostle-shahin', relation: '2006년 명부에 같은 제4사도 번호로 기록된 인물이다. 같은 자리를 이은 것인지, 번호 체계가 다른 것인지 확인되지 않았다.', certainty: 'unresolved' }],
        limits: ['교단 명단의 사도 번호가 2006년 명부의 사도 번호·사도석과 같은 체계인지 확인되지 않았다(상충 기록).', '능력과 대가, 파벌, 활동 시기는 기록되지 않았다.']
      },
      {
        id: 'apostle-levente-hambas', name: '레벤테 함바스', group: 'ushinoda-figures',
        role: '우시노다교 제5사도', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: '우시노다교 / 교단 명단의 제5사도',
        overview: '우시노다교 교단 명단에 제5사도로 적힌 이름이다. 능력·파벌·활동 시기는 명단에 적혀 있지 않다.',
        affiliations: [{ key: 'ushinoda', label: '우시노다교', role: '제5사도(교단 명단)', certainty: 'listed' }],
        relationships: [{ target: 'apostle-moha', relation: '2006년 명부에 같은 제5사도 번호로 기록된 인물이다. 같은 자리를 이은 것인지, 번호 체계가 다른 것인지 확인되지 않았다.', certainty: 'unresolved' }],
        limits: ['교단 명단의 사도 번호가 2006년 명부의 사도 번호·사도석과 같은 체계인지 확인되지 않았다(상충 기록).', '능력과 대가, 파벌, 활동 시기는 기록되지 않았다.']
      },
      {
        id: 'apostle-robin', name: '로빈', group: 'ushinoda-figures',
        role: '우시노다교 제6사도', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: '우시노다교 / 교단 명단의 제6사도',
        overview: '우시노다교 교단 명단에 제6사도로 적힌 이름이다. 능력·파벌·활동 시기는 명단에 적혀 있지 않다.',
        affiliations: [{ key: 'ushinoda', label: '우시노다교', role: '제6사도(교단 명단)', certainty: 'listed' }],
        relationships: [{ target: 'apostle-siena-khan', relation: '2006년 명부에 같은 제6사도 번호로 기록된 인물이다. 같은 자리를 이은 것인지, 번호 체계가 다른 것인지 확인되지 않았다.', certainty: 'unresolved' }],
        limits: ['교단 명단의 사도 번호가 2006년 명부의 사도 번호·사도석과 같은 체계인지 확인되지 않았다(상충 기록).', '능력과 대가, 파벌, 활동 시기는 기록되지 않았다.']
      },
      {
        id: 'apostle-kendo', name: '켄도', group: 'ushinoda-figures',
        role: '우시노다교 제7사도', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: '우시노다교 / 교단 명단의 제7사도',
        overview: '우시노다교 교단 명단에 제7사도로 적힌 이름이다. 능력·파벌·활동 시기는 명단에 적혀 있지 않다.',
        affiliations: [{ key: 'ushinoda', label: '우시노다교', role: '제7사도(교단 명단)', certainty: 'listed' }],
        relationships: [{ target: 'apostle-alvarez', relation: '2006년 명부에 같은 제7사도 번호로 기록된 인물이다. 같은 자리를 이은 것인지, 번호 체계가 다른 것인지 확인되지 않았다.', certainty: 'unresolved' }],
        limits: ['교단 명단의 사도 번호가 2006년 명부의 사도 번호·사도석과 같은 체계인지 확인되지 않았다(상충 기록).', '능력과 대가, 파벌, 활동 시기는 기록되지 않았다.']
      },
      {
        id: 'apostle-lisbeth-van-doorn', name: '리스베트 반 도른', group: 'ushinoda-figures',
        role: '우시노다교 제8사도', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: '우시노다교 / 교단 명단의 제8사도',
        overview: '우시노다교 교단 명단에 제8사도로 적힌 이름이다. 능력·파벌·활동 시기는 명단에 적혀 있지 않다.',
        affiliations: [{ key: 'ushinoda', label: '우시노다교', role: '제8사도(교단 명단)', certainty: 'listed' }],
        relationships: [{ target: 'apostle-parthea-hill', relation: '2006년 명부에 같은 제8사도 번호로 기록된 인물이다. 같은 자리를 이은 것인지, 번호 체계가 다른 것인지 확인되지 않았다.', certainty: 'unresolved' }],
        limits: ['교단 명단의 사도 번호가 2006년 명부의 사도 번호·사도석과 같은 체계인지 확인되지 않았다(상충 기록).', '능력과 대가, 파벌, 활동 시기는 기록되지 않았다.']
      },
      {
        id: 'apostle-meguro-soichiro', name: '메구로 소이치로', group: 'ushinoda-figures',
        role: '우시노다교 제9사도', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: '우시노다교 / 교단 명단의 제9사도',
        overview: '우시노다교 교단 명단에 제9사도로 적힌 이름이다. 능력·파벌·활동 시기는 명단에 적혀 있지 않다.',
        affiliations: [{ key: 'ushinoda', label: '우시노다교', role: '제9사도(교단 명단)', certainty: 'listed' }],
        relationships: [{ target: 'apostle-sharma', relation: '2006년 명부에 같은 제9사도 번호로 기록된 인물이다. 같은 자리를 이은 것인지, 번호 체계가 다른 것인지 확인되지 않았다.', certainty: 'unresolved' }],
        limits: ['교단 명단의 사도 번호가 2006년 명부의 사도 번호·사도석과 같은 체계인지 확인되지 않았다(상충 기록).', '능력과 대가, 파벌, 활동 시기는 기록되지 않았다.']
      },
      // 2026-09-25 사용자 승인(추천안): N.H.C 대원 5명. 제1·제2타격부대와 카게무샤 프로젝트는 세력 분석 N.H.C에 적었다.
      {
        id: 'tonari-nakamura', name: '토나리 나카무라', group: 'nhc-additional',
        role: 'N.H.C 제2타격부대 지휘관', status: 'active', certainty: 'listed', registerYear: '연대 미확정',
        unit: 'N.H.C 제2타격부대',
        overview: '인공 리버스 현상으로 타락을 몸에 융합하고 신체를 강화하는 데 성공한 사례로 기록된 N.H.C 제2타격부대 지휘관이다.',
        affiliations: [{ key: 'nhc', label: 'N.H.C', role: '제2타격부대 지휘관', certainty: 'listed' }],
        abilitySource: '인공 리버스 현상을 통한 타락 융합·신체 강화',
        abilityCost: '대가의 내용은 기록되지 않았다.',
        limits: ['타락자와 능력자 가운데 어느 분류인지 판정되지 않았다.', '인공 리버스 현상을 일으킨 주체와 시기, 보호 기록 「종교」가 적은 융합성 타락과 같은 과정인지는 확인되지 않았다.']
      },
      {
        id: 'hayami', name: '하야미', group: 'nhc-additional',
        role: 'N.H.C 제2타격부대 부관', status: 'active', certainty: 'listed', registerYear: '연대 미확정',
        unit: 'N.H.C 제2타격부대',
        overview: 'N.H.C 제1타격부대 부관에서 제2타격부대 부관으로 옮겼다. 대괴이전에 특화된 정예 병사를 기르는 카게무샤 프로젝트에서 대괴이 전투부대 적합 판정을 받았다.',
        affiliations: [{ key: 'nhc', label: 'N.H.C', role: '제2타격부대 부관 / 전 제1타격부대 부관', certainty: 'listed' }],
        relationships: [{ target: 'tonari-nakamura', relation: '제2타격부대의 지휘관이다.', certainty: 'listed' }],
        limits: ['성과 이름 가운데 한쪽만 기록됐다.', '부대를 옮긴 시기와 이유, 카게무샤 프로젝트의 선발 기준과 운영 주체는 확인되지 않았다.']
      },
      {
        id: 'shinohara-chiharu', name: '시노하라 치하루', group: 'nhc-additional',
        role: 'N.H.C 제2타격부대 선행정찰병', status: 'active', certainty: 'listed', registerYear: '연대 미확정',
        unit: 'N.H.C 제2타격부대',
        overview: '괴이 출몰 지역을 먼저 정찰하고 진입로를 확보하는 N.H.C 대괴이 전투요원이다.',
        affiliations: [{ key: 'nhc', label: 'N.H.C', role: '제2타격부대 선행정찰병', certainty: 'listed' }],
        relationships: [{ target: 'tonari-nakamura', relation: '제2타격부대의 지휘관이다.', certainty: 'listed' }],
        limits: ['활동 시기와 교전 기록은 확인되지 않았다.']
      },
      {
        id: 'mizuno-shun', name: '미즈노 슌', group: 'nhc-additional',
        role: 'N.H.C 전선 대원', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: 'N.H.C 전선 대원',
        overview: '리버스가 발생하기 30분 전에 찍힌 사진에 오가와 나오와 함께 남은 N.H.C의 젊은 대원이다. 사진 당시 21세였다.',
        affiliations: [{ key: 'nhc', label: 'N.H.C', role: '전선 대원', certainty: 'listed' }],
        relationships: [{ target: 'ogawa-nao', relation: '같은 사진에 함께 찍힌 대원이다.', certainty: 'listed' }],
        limits: ['사진이 찍힌 장소와 날짜, 뒤이어 일어난 리버스가 어떤 사건인지는 기록되지 않았다.', '리버스 발생 뒤의 생사와 소재는 확인되지 않았다.']
      },
      {
        id: 'ogawa-nao', name: '오가와 나오', group: 'nhc-additional',
        role: 'N.H.C 전선 대원', status: 'unknown', certainty: 'listed', registerYear: '연대 미확정',
        unit: 'N.H.C 전선 대원',
        overview: '리버스가 발생하기 30분 전에 찍힌 사진에 미즈노 슌과 함께 남은 N.H.C의 젊은 대원이다. 사진 당시 22세였다.',
        affiliations: [{ key: 'nhc', label: 'N.H.C', role: '전선 대원', certainty: 'listed' }],
        relationships: [{ target: 'mizuno-shun', relation: '같은 사진에 함께 찍힌 대원이다.', certainty: 'listed' }],
        limits: ['사진이 찍힌 장소와 날짜, 뒤이어 일어난 리버스가 어떤 사건인지는 기록되지 않았다.', '리버스 발생 뒤의 생사와 소재는 확인되지 않았다.']
      }
    ])
  });
})(window);
