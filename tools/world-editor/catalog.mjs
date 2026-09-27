import vm from 'node:vm';
import { hash, locate } from './core.mjs';

export function loadData(snap) {
  const sandbox = {};
  sandbox.window = sandbox;
  const context = vm.createContext(sandbox, { codeGeneration: { strings: false, wasm: false } });
  const files = [...snap.sources['index.html'].text.matchAll(/<script\s+src="(assets\/js\/data\/[^"?]+)/g)].map(match => match[1]);
  for (const file of files) {
    if (!/^assets\/js\/data\/[\w-]+\.js$/.test(file) || !snap.sources[file]) throw new Error(`허용되지 않거나 없는 데이터: ${file}`);
    // Repository-owned data only. No downloaded document is ever evaluated.
    new vm.Script(snap.sources[file].text, { filename: file }).runInContext(context, { timeout: 1500 });
  }
  return { context, files };
}

export function strings(value, out = [], depth = 0) {
  if (depth > 15 || out.length > 12000) return out;
  if (typeof value === 'string') out.push(value);
  else if (value && typeof value === 'object') Object.values(value).forEach(child => strings(child, out, depth + 1));
  return out;
}

export function buildCatalog(snap, context) {
  const records = [];
  const recordSource = (id, title, preferred) => {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const definition = new RegExp(`^\\s*(?:(?:['\"]?${escaped}['\"]?)\\s*:\\s*\\{|id\\s*:\\s*['\"]${escaped}['\"])`);
    for (const file of preferred) {
      const source = snap.sources[file];
      if (!source) continue;
      const lines = source.text.split(/\r?\n/);
      const index = lines.findIndex(line => definition.test(line));
      if (index >= 0) return { file, line: index + 1, quote: lines[index].trim().slice(0, 1200), fileHash: source.hash };
    }
    return locate(snap, id, preferred) || locate(snap, title, preferred);
  };
  const add = (kind, id, value, preferred = []) => {
    if (!value || typeof value !== 'object') return;
    const title = value.name || value.title || value.label || id;
    const text = strings(value).filter(part => !/^assets\/|^https?:\/\//.test(part)).join('\n');
    const source = recordSource(id, title, preferred);
    records.push({ key: `${kind}:${id}`, kind, id, title, text, hash: hash(text), source, value });
  };
  const datasets = [
    ['history', context.ProjectCurseWorldHistoryData?.records, ['assets/js/data/world-history-data.js', 'assets/js/data/world-history-core-data.js']],
    ['faction', context.ProjectCurseFactionAnalysis?.factions, ['assets/js/data/faction-analysis-data.js']],
    ['archive', context.ProjectCurseArchive?.publicRecords, ['assets/js/data/archive-registry.js']],
    ['document', context.ProjectCurseArchiveDocuments?.documents, ['assets/js/data/archive-document-data.js']],
    ['operation', context.ProjectCurseMapRoom?.operations, ['assets/js/data/map-room-data.js']],
    ['region', context.ProjectCurseMapRoom?.regions, ['assets/js/data/map-room-data.js']]
  ];
  for (const [kind, collection, preferred] of datasets) {
    if (Array.isArray(collection)) collection.forEach((value, index) => add(kind, value.id || String(index), value, preferred));
    else if (collection) Object.entries(collection).forEach(([id, value]) => add(kind, id, value, preferred));
  }
  for (const record of records.filter(item => item.kind === 'history')) {
    const supplement = context.ProjectCurseWorldHistoryProse?.records?.[record.id];
    if (supplement) {
      record.value = { ...record.value, prose: supplement };
      record.text = strings(record.value).join('\n');
      record.hash = hash(record.text);
    }
  }
  // Personnel adapters are resolved explicitly: retired raw entries must not be resurrected.
  const base = context.ProjectCursePersonnel?.records || [];
  const profiles = context.ProjectCursePersonnelProfiles?.profiles || {};
  const remake = context.ProjectCursePersonnelRemake?.records || {};
  for (const item of base) add('personnel', item.id, { ...item, ...profiles[item.id], ...remake[item.id] }, ['assets/js/data/personnel-remake-data.js', 'assets/js/data/personnel-data.js']);
  const additions = context.ProjectCursePersonnelAdditions?.records || [];
  for (const item of additions) add('personnel', item.id, item, ['assets/js/data/personnel-additions-data.js']);
  return records;
}

export function searchCatalog(records, query, limit = 40) {
  const tokens = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  return records.map(record => {
    const title = record.title.toLocaleLowerCase();
    const body = record.text.toLocaleLowerCase();
    const score = tokens.reduce((sum, token) => sum + (title.includes(token) ? 8 : body.includes(token) ? 1 : 0), 0);
    const matches = tokens.every(token => body.includes(token) || title.includes(token));
    const first = Math.max(0, body.indexOf(tokens[0]) - 60);
    return { key: record.key, kind: record.kind, id: record.id, title: record.title, source: record.source, score, excerpt: record.text.slice(first, first + 260), matches };
  }).filter(item => item.matches).sort((a, b) => b.score - a.score || a.key.localeCompare(b.key)).slice(0, limit);
}

export function buildRelations(records) {
  const known = new Map(records.map(record => [record.id, record.key]));
  const links = [];
  for (const record of records) {
    for (const relation of record.value.relationships || []) {
      links.push({ from: record.key, to: known.get(relation.target) || null, target: relation.target, kind: relation.relation || '관계', source: record.source });
    }
    for (const other of records) {
      if (other.key === record.key || other.title.length < 3 || !record.text.includes(other.title)) continue;
      links.push({ from: record.key, to: other.key, kind: '이름 언급 — 관계 확정 아님', source: record.source });
    }
  }
  return links;
}
