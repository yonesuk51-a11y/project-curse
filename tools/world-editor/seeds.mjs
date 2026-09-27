import path from 'node:path';
import { ROOT, readJson, evidence, hash } from './core.mjs';

export async function editorialSeeds(snap) {
  const definitions = await readJson(path.join(ROOT, 'tools/world-editor/editorial-seeds.json'));
  if (definitions.schema !== 1 || !Array.isArray(definitions.ideas)) throw new Error('편집 제안 자료 형식 오류');
  return definitions.ideas.map(idea => {
    if (!/^seed-[a-z0-9-]+$/.test(idea.id) || !idea.evidence?.length) throw new Error(`편집 제안 ID·근거 오류: ${idea.id}`);
    const references = [...new Map(idea.evidence.map(ref => {
      const source = evidence(snap, ref.file, ref.needle);
      return [`${source.file}:${source.line}`, source];
    })).values()];
    for (const source of idea.externalSources || []) {
      const url = new URL(source.url);
      if (url.protocol !== 'https:' || !source.checkedAt || !source.verifiedFact) throw new Error(`외부 출처 설명 오류: ${idea.id}`);
    }
    return { ...idea, category: 'creative-proposal', origin: 'editorial-seed', evidence: references, evidenceHash: hash(JSON.stringify(references)), status: 'proposal-only' };
  });
}
