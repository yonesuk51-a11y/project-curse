// Project Curse 6 — 2042년 단말에 따로 등록된 인물. 2006년 명부(personnel-data.js)와 섞지 않는다.
// 근거: 사용자 설정글(2026-09-13 ~ 2026-09-22). 2026-09-24 사용자가 인물 기록 반영을 승인했다.
// 설정글에 없는 사실은 적지 않는다. 확인되지 않은 연결과 연대는 limits에 남긴다.
(function (root) {
  'use strict';

  function freeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }

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
    records: [
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
        notes: ['천사의 내장은 혈교의 공통 서약을 거부한 소규모 교단 가운데 하나로 기록돼 있다.', '「본 자의 서」 필사본은 세계 기록 「천사 강림과 「본 자의 서」」에 실려 있다.'],
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
        overview: '추악한 망령이 곁에 머무는 것을 허락한 인물로 기록됐다. 망령은 한때 소중했던 사람의 뒤틀린 영혼이며, 그 영혼에게 저주받은 것으로 전해진다.',
        limits: ['망령이 누구의 영혼인지, 저주의 내용과 시작 시점은 기록되지 않았다.', '소속과 능력 여부는 확인되지 않았다.']
      },
      {
        id: 'kenevin', name: '커네빈', aliases: ['히라에스', 'Hiraeth'], group: 'unaffiliated',
        role: '암흑시대의 잊힌 기사 / 지금은 히라에스라 불리는 이질적 존재', status: 'unknown', certainty: 'unresolved', registerYear: '암흑시대 전승',
        overview: '먼 암흑시대에 이신(異神)에 맞서 성벽에 섰던 기사로 전해진다. 지금은 히라에스라는 이름으로 불리는 이질적 존재가 됐다. 기사였던 시절을 기억하는 존재는 더 이상 남아 있지 않다.',
        notes: ['우시노다를 주군으로 부르는 화자의 구술은 히라에스를 우시노다에게 검을 겨눈 인간 전사로 기억한다. 고향에 아내와 어린 아들이 있었다고 전한다.', '히라에스는 돌아갈 수 없는 고향과 과거를 향한 그리움을 뜻하는 웨일스어다.', '구술 전문은 세계 기록 「외신 강림과 성벽의 저항」에 실려 있다.'],
        limits: ['기사에서 이질적 존재로 바뀐 경위와 시점은 기록되지 않았다.', '현재 소재와 적대 여부는 확인되지 않았다.']
      }
    ]
  });
})(window);
