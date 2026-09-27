import { evidence, locate, hash } from './core.mjs';

export const categories = ['confirmed-error', 'suspected-conflict', 'missing-explanation', 'intentional-gap', 'creative-proposal'];
export const categoryLabels = { 'confirmed-error': '확인된 오류', 'suspected-conflict': '충돌 의심', 'missing-explanation': '설명 부족', 'intentional-gap': '의도된 공백', 'creative-proposal': '창작 제안' };

export function finding(rule, subject, fields) {
  const id = `${rule}-${hash(subject).slice(0, 12)}`;
  return { id, rule, subject, category: 'suspected-conflict', severity: 'review', origin: 'deterministic', ...fields, evidenceHash: hash(JSON.stringify(fields.evidence || [])) };
}

export function ageRange(birth, referenceYear) {
  const year = /^([12]\d{3})(?:[.\-/]|$)/.exec(birth || '')?.[1];
  if (!year || !Number.isInteger(referenceYear)) return null;
  const difference = referenceYear - Number(year);
  return [difference - 1, difference];
}

export function checkRules(snap, records, context, decisions) {
  const findings = [];
  const decisionIndex = decisions.map(decision => ({ ...decision, evidence: evidence(snap, decision.file, decision.needle) }));
  const questionFile = 'assets/js/data/open-canon-data.js';
  for (const decision of decisionIndex) {
    if (!decision.openQuestion || !snap.sources[questionFile]?.text.includes(decision.openQuestion)) continue;
    findings.push(finding('open-decision-drift', decision.id, {
      title: `${decision.label}: 자유 해석 안내 확인`,
      explanation: decision.status === 'intentionally-unspecified' ? '정하지 않기로 한 내용이 자유롭게 정할 수 있는 질문으로 읽힐 수 있습니다.' : '이미 정한 내용과 열린 질문의 범위가 맞는지 확인이 필요합니다.',
      recommendation: decision.advice,
      counterEvidence: '공개 질문이 더 넓은 미확정 영역을 뜻할 수 있으므로 정사 모순으로 확정하지 않습니다.',
      evidence: [decision.evidence, evidence(snap, questionFile, decision.openQuestion)],
      owner: 'Claude — 공용 안내·정사 정합성', affected: [questionFile]
    }));
  }

  const seen = new Set();
  const personnel = records.filter(record => record.kind === 'personnel');
  const peopleIds = new Set(personnel.map(record => record.id));
  for (const record of records) {
    if (seen.has(record.key)) findings.push(finding('duplicate-id', record.key, { title: `중복 식별자: ${record.key}`, category: 'confirmed-error', severity: 'error', explanation: '동일 종류에 같은 식별자가 두 번 있습니다.', recommendation: '원본을 확인하고 식별자 중복을 해소합니다.', evidence: record.source ? [record.source] : [] }));
    seen.add(record.key);
    if (record.kind !== 'personnel') continue;
    const identity = record.value.identity || {};
    const age = /^(\d+)세\s*\/\s*(\d{4})년/.exec(identity.age || '');
    if (age) {
      const bounds = ageRange(identity.birth, Number(age[2]));
      // A year-only reference cannot determine whether the birthday has passed.
      if (bounds && (Number(age[1]) < bounds[0] || Number(age[1]) > bounds[1])) findings.push(finding('age-year', record.key, {
        title: `${record.title}: 나이와 기준 연도 확인`, explanation: `${identity.birth} / ${identity.age}. 생일 전후의 만 나이 범위는 ${bounds.join('~')}세입니다. 나이 계산 관습은 별도 확인이 필요합니다.`,
        recommendation: '작성 기준일과 나이 계산 방식을 확인합니다. 자동으로 숫자를 고치지 않습니다.', evidence: [locate(snap, identity.age, ['assets/js/data/personnel-profile-data.js']) || record.source].filter(Boolean), affected: [record.source?.file].filter(Boolean)
      }));
    }
    for (const relation of record.value.relationships || []) {
      if (!relation.target || peopleIds.has(relation.target)) continue;
      findings.push(finding('relationship-target', `${record.key}:${relation.target}`, { title: `${record.title}: 연결 대상 확인`, explanation: `관계 대상 ${relation.target}의 현재 인물 파일이 없습니다. 과거 이름의 단순 언급과 실제 연결 오류는 구분해야 합니다.`, recommendation: '폐기된 인물을 되살리지 말고 현재 명부와 연결의 필요성을 확인합니다.', evidence: [record.source].filter(Boolean) }));
    }
  }
  const mediaFile = 'assets/js/data/media-provenance-data.js';
  if ((snap.sources[mediaFile]?.bytes || 0) > 300000 && snap.sources['index.html'].text.includes(mediaFile)) findings.push(finding('initial-audit-payload', mediaFile, {
    title: '첫 화면에 상세 매체 출처 데이터가 함께 적재됨', category: 'missing-explanation', severity: 'opportunity',
    explanation: `${Math.round(snap.sources[mediaFile].bytes / 1024)} KiB의 원본 파일입니다. 압축 전송량이나 로딩 시간 실측값은 아닙니다.`, recommendation: '공개 표시용 최소 데이터와 감사용 상세 데이터를 나누는 방안을 검토합니다. 기동 연출은 유지합니다.',
    evidence: [evidence(snap, 'index.html', mediaFile)], owner: 'Claude — 셸·공용 데이터 적재'
  }));
  return { findings, decisions: decisionIndex };
}

export function opportunities(records, relations) {
  const incoming = new Map();
  relations.filter(link => link.to).forEach(link => incoming.set(link.to, (incoming.get(link.to) || 0) + 1));
  return records.filter(record => ['region', 'personnel', 'faction'].includes(record.kind)).map(record => ({
    id: `reuse-${hash(record.key).slice(0, 12)}`, key: record.key, title: record.title, kind: record.kind,
    references: incoming.get(record.key) || 0, evidence: [record.source].filter(Boolean),
    note: '이름 언급과 명시적 관계 수에 따른 조사 후보입니다. 서사적 중요도나 인기의 측정값이 아닙니다.'
  })).sort((a, b) => a.references - b.references || a.key.localeCompare(b.key)).slice(0, 20);
}
