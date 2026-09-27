import { hash } from './core.mjs';

const surfaces = {
  personnel: ['인물 기록', '세력 소속·관계 링크', '통합 검색', '공유 미리보기'],
  faction: ['세력 분석', '인물 소속·작전 연결', '통합 검색', '공유 미리보기'],
  history: ['세계 기록', '지도·기록 교차 링크', '통합 검색', '공유 미리보기'],
  archive: ['기록보관소', '관련 사건·인물 링크', '통합 검색', '공유 미리보기'],
  document: ['기록보관소 문서', '현장 지침·지도 증거 연결', '통합 검색'],
  operation: ['작전 지도', '시나리오·판정 링크', '통합 검색'],
  region: ['작전 지도', '지역·사건 링크', '통합 검색']
};

export const catalogHash = records => hash(JSON.stringify(records.map(record => [record.key, record.hash, record.title]).sort((a, b) => a[0].localeCompare(b[0]))));

export function traceImpact(records, relations, key) {
  const byKey = new Map(records.map(record => [record.key, record]));
  const subject = byKey.get(key);
  if (!subject) return null;
  const explicit = [];
  const mentions = [];
  const unresolved = [];
  const seen = new Set();
  for (const link of relations) {
    if (link.from !== key && link.to !== key) continue;
    const direction = link.from === key ? 'outgoing' : 'incoming';
    const otherKey = direction === 'outgoing' ? link.to : link.from;
    const other = byKey.get(otherKey);
    const item = { direction, kind: link.kind, key: other?.key || null, title: other?.title || null,
      source: other?.source || null, target: link.target || null, resolution: link.resolution || (link.to ? 'resolved' : 'missing') };
    const identity = `${direction}|${link.kind}|${otherKey || link.target || ''}`;
    if (seen.has(identity)) continue;
    seen.add(identity);
    if (link.kind === '이름 언급 — 관계 확정 아님') mentions.push(item);
    else if (!link.to) unresolved.push(item);
    else explicit.push(item);
  }
  const order = (a, b) => (a.title || a.target || '').localeCompare(b.title || b.target || '', 'ko');
  explicit.sort(order); mentions.sort(order); unresolved.sort(order);
  const relatedFiles = [...new Set([subject.source?.file, ...explicit.map(item => item.source?.file), ...mentions.map(item => item.source?.file)].filter(Boolean))].sort();
  return { schema: 1, key, title: subject.title, kind: subject.kind, source: subject.source,
    explicit, mentions: mentions.slice(0, 40), mentionCount: mentions.length, unresolved,
    relatedFiles, checkSurfaces: surfaces[subject.kind] || ['해당 화면', '통합 검색'],
    note: '확인 범위의 후보입니다. 이름 언급은 관계·동맹·인과의 증거가 아니며, 화면 목록은 자동 수정 지시가 아닙니다.' };
}

export function changedImpact(previous, records, relations) {
  if (!previous) return null;
  if (previous.schema !== 1 || !Array.isArray(previous.records)) throw new Error('이전 설정 색인 형식 오류. 원본을 보존합니다.');
  const before = new Map(previous.records.map(record => [record.key, record]));
  const after = new Map(records.map(record => [record.key, record]));
  const entries = [];
  for (const key of [...new Set([...before.keys(), ...after.keys()])].sort()) {
    const oldRecord = before.get(key);
    const newRecord = after.get(key);
    if (oldRecord && newRecord && oldRecord.hash === newRecord.hash && oldRecord.title === newRecord.title) continue;
    const removed = !newRecord;
    const preview = traceImpact(removed ? previous.records : records, removed ? previous.relations || [] : relations, key);
    entries.push({ key, status: removed ? 'removed' : oldRecord ? 'modified' : 'added',
      beforeTitle: oldRecord?.title || null, afterTitle: newRecord?.title || null,
      beforeSource: oldRecord?.source || null, afterSource: newRecord?.source || null, preview });
  }
  return { schema: 1, fromCatalogHash: catalogHash(previous.records), toCatalogHash: catalogHash(records), entries,
    note: '이전 성공 검사와 현재 설정 색인의 텍스트 차이입니다. 원인·의미·정사 변경을 자동 판정하지 않습니다.' };
}
