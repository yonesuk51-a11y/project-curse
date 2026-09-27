const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let token = '';
let revision = 0;
let review = { findings: [], suggestions: [], opportunities: [] };
let filter = 'all';

function node(tag, text = '', className = '') {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = String(text);
  if (className) element.className = className;
  return element;
}
function append(parent, ...children) { children.forEach(child => parent.append(child)); return parent; }
function clear(element) { element.replaceChildren(); return element; }
function message(text, error = false) { const target = $('#message'); target.textContent = text; target.dataset.error = String(error); }
function date(value) { return value ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '아직 없음'; }
function label(status) { return ({ selected: '선택', deferred: '보류', rejected: '제외', resolved: '해결', pending: '미검토' })[status] || '미검토'; }
function category(value) { return ({ 'confirmed-error': '확인된 오류', 'suspected-conflict': '충돌 의심', 'missing-explanation': '설명 부족', 'intentional-gap': '의도된 공백', 'creative-proposal': '창작 제안' })[value] || value; }

async function api(path, options = {}) {
  const headers = options.body ? { 'Content-Type': 'application/json', 'X-PC-Token': token } : {};
  const response = await fetch(path, { ...options, headers, cache: 'no-store' });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  return data;
}
async function action(button, path, input, success) {
  button.disabled = true;
  message('작업 중입니다. 원본 파일은 변경하지 않습니다.');
  try {
    const result = await api(path, { method: 'POST', body: JSON.stringify(input) });
    message(success(result));
    await refresh();
  } catch (error) { message(error.message, true); }
  finally { button.disabled = false; }
}

function metric(title, value, note) {
  const item = node('div', '', 'metric');
  append(item, node('span', title), node('strong', value), node('small', note));
  return item;
}
function renderOverview(data) {
  const report = data.report;
  const grid = clear($('#overview-grid'));
  append(grid,
    metric('정리된 설정', report?.recordCount ?? '—', '인물·세력·역사·지역 외'),
    metric('검토 후보', report?.findings ?? '—', '오류 확정과 구별'),
    metric('이야기 제안', report?.suggestions ?? '—', '채택 전에는 제안'),
    metric('상시 감시', data.worker?.status === 'running' ? '실행 중' : '꺼짐', data.worker?.updatedAt ? date(data.worker.updatedAt) : '현재 상태 미기록')
  );
  const checks = clear($('#check-list'));
  append(checks, node('h3', '검사·운영 기록'));
  append(checks, node('p', `최근 보고서: ${date(report?.createdAt)} / 브랜치: ${report?.branch || '미확인'}`));
  if (report?.checks?.length) report.checks.forEach(check => {
    const line = node('p', `${check.status === 'passed' ? '통과' : '실패'} · ${check.command}`, check.status === 'passed' ? 'status-good' : 'status-error');
    checks.append(line);
  });
  else checks.append(node('p', '기존 검증 명령은 아직 실행하지 않았습니다.'));
  if (data.worker?.lastError) checks.append(node('p', `감시 작업 오류: ${data.worker.lastError}`, 'status-error'));
  if (data.research) checks.append(node('p', `출처 접근 확인: ${date(data.research.updatedAt)} / 실패 ${data.research.sources.filter(item => item.status === 'failed').length}곳`));
  checks.append(node('p', '입력 해시: ' + (report?.fingerprint?.slice(0, 18) || '아직 없음')));
}

function textRow(parent, prefix, value) {
  if (!value) return;
  const row = node('p');
  const bold = node('strong', `${prefix} `);
  append(row, bold, document.createTextNode(value));
  parent.append(row);
}
function evidence(parent, references) {
  if (!references?.length) return;
  const group = node('div', '', 'evidence');
  group.append(node('span', '원문 위치', 'meta'));
  references.forEach(ref => {
    append(group, node('code', `${ref.file}:${ref.line}`), node('blockquote', ref.quote));
  });
  parent.append(group);
}
function reviewCard(item) {
  const card = node('article', '', `record-card ${item.category === 'creative-proposal' ? 'is-creative' : ''}`);
  const origin = ({ 'ai-review': 'AI 검토', 'editorial-seed': '제작 후보', deterministic: '정형 검사' })[item.origin] || '검토';
  append(card, node('span', `${category(item.category)} · ${origin}`, 'meta'), node('h3', item.title), node('p', item.explanation));
  textRow(card, '권장:', item.recommendation);
  const details = node('details', '', 'review-detail');
  details.append(node('summary', '장면·근거·주의점 보기'));
  textRow(details, '한 장면:', item.scene);
  textRow(details, '지옥 분위기 연결:', item.atmosphere);
  textRow(details, '최소 적용:', item.smallestChange);
  textRow(details, '부담·주의:', item.tradeoff);
  textRow(details, '반대 근거:', item.counterEvidence);
  if (item.externalSources?.length) item.externalSources.forEach(source => {
    const row = node('p');
    const link = node('a', source.title);
    try { if (new URL(source.url).protocol === 'https:') { link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; row.append(link); } }
    catch { /* Never turn malformed source text into a link. */ }
    row.append(document.createTextNode(` — 확인한 사실: ${source.verifiedFact} (${source.checkedAt})`));
    details.append(row);
  });
  evidence(details, item.evidence);
  card.append(details);
  const state = item.decision;
  card.append(node('p', `${state ? label(state.status) : '미검토'}${state?.reason ? ` — ${state.reason}` : ''}${state?.stale ? ' / 근거 변경됨, 재검토 필요' : ''}`, `state ${state?.stale ? 'stale' : ''}`));
  const controls = node('div', '', 'decision');
  const select = node('select');
  select.setAttribute('aria-label', `${item.title} 결정`);
  ['pending', 'selected', 'deferred', 'rejected', 'resolved'].forEach(value => {
    const option = node('option', label(value)); option.value = value; option.selected = (state?.status || 'pending') === value; select.append(option);
  });
  const reason = node('input');
  reason.type = 'text'; reason.maxLength = 2000; reason.placeholder = '짧은 이유를 남기면 반복 추천을 줄일 수 있습니다'; reason.value = state?.reason || '';
  reason.setAttribute('aria-label', `${item.title} 결정 사유`);
  const save = node('button', '기록'); save.type = 'button';
  save.addEventListener('click', async () => action(save, '/api/feedback', { id: item.id, status: select.value, reason: reason.value, revision }, result => {
    revision = result.revision;
    return `${item.title}: ${label(result.decision.status)}으로 기록했습니다. 정사·사이트는 바뀌지 않았습니다.`;
  }));
  append(controls, select, reason, save);
  card.append(controls);
  return card;
}
function renderReview() {
  const list = clear($('#review-list'));
  const entries = [...review.findings, ...review.suggestions].filter(item => {
    const status = item.decision?.status || 'pending';
    return filter === 'all' || filter === 'unreviewed' && (status === 'pending' || item.decision?.stale) || status === filter;
  });
  if (!entries.length) list.append(node('p', filter === 'all' ? '현재 보고서에 표시할 항목이 없습니다. 검사나 AI 검토 자료 가져오기를 실행하세요.' : '이 필터에 해당하는 항목이 없습니다.', 'empty'));
  entries.forEach(item => list.append(reviewCard(item)));
  const reuse = clear($('#opportunity-list'));
  review.opportunities.forEach(item => reuse.append(node('p', `${item.title} / ${item.kind} / 이름 언급 ${item.references}건 — ${item.note}`)));
  if (!review.opportunities.length) reuse.append(node('p', '후보 없음'));
}
function renderResearch(data) {
  const list = clear($('#research-list'));
  if (!data.sources.length) { list.append(node('p', '아직 접근한 출처가 없습니다. 현황에서 자료 출처 점검을 실행하세요.', 'empty')); return; }
  data.sources.forEach(source => {
    const card = node('article', '', 'record-card');
    append(card, node('span', `${source.status} / ${date(source.checkedAt)}`, 'meta'), node('h3', source.name));
    textRow(card, '주제:', source.topics?.join(' · '));
    textRow(card, '활용 기준:', source.use);
    textRow(card, '권리:', source.rights);
    if (source.error) card.append(node('p', `접근 실패: ${source.error}`, 'status-error'));
    card.append(node('p', source.note || '링크 발견만 기록했습니다. 실제 사실 확인은 별도입니다.', 'reason'));
    if (source.candidates?.length) {
      const details = node('details'); details.append(node('summary', `발견한 링크 ${source.candidates.length}건`));
      source.candidates.forEach(candidate => {
        const paragraph = node('p');
        const link = node('a', candidate.title); link.href = candidate.url; link.rel = 'noopener noreferrer'; link.target = '_blank';
        paragraph.append(link); details.append(paragraph);
      });
      card.append(details);
    }
    list.append(card);
  });
}
async function search(event) {
  event.preventDefault();
  const query = $('#search-input').value.trim();
  const list = clear($('#search-list'));
  if (!query) return;
  try {
    const data = await api(`/api/search?q=${encodeURIComponent(query)}`);
    if (!data.results.length) list.append(node('p', '해당 표현을 찾지 못했습니다.', 'empty'));
    data.results.forEach(result => {
      const card = node('article', '', 'record-card');
      append(card, node('span', `${result.kind} / ${result.key} / ${result.source?.file || '원문 위치 미확인'}`, 'meta'), node('h3', result.title), node('p', result.excerpt));
      list.append(card);
    });
  } catch (error) { message(error.message, true); }
}
async function refresh() {
  const [status, items, research] = await Promise.all([api('/api/status'), api('/api/review'), api('/api/research')]);
  revision = items.revision; review = items;
  renderOverview(status); renderReview(); renderResearch(research);
}
function setTab(tab) {
  $$('.tabs button').forEach(button => { if (button.dataset.tab === tab) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current'); });
  $$('.view').forEach(view => { view.hidden = view.dataset.view !== tab; });
}
async function init() {
  token = (await api('/api/meta')).token;
  $$('.tabs button').forEach(button => button.addEventListener('click', () => setTab(button.dataset.tab)));
  $$('.filters button').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    $$('.filters button').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    renderReview();
  }));
  $('#run-audit').addEventListener('click', event => action(event.currentTarget, '/api/audit', {}, result => `검사 완료: 후보 ${result.findings}건, 기존 검사 ${result.checks.map(item => item.status).join('/')}.`));
  $('#run-research').addEventListener('click', event => action(event.currentTarget, '/api/research-run', { force: true }, result => `출처 점검 완료: ${result.sources.filter(item => item.status === 'failed').length}곳 접근 실패. 사실 검증은 별도입니다.`));
  $('#make-backup').addEventListener('click', event => action(event.currentTarget, '/api/backup', {}, result => `복사본 ${result.id}: ${result.verification.valid ? '해시 검증 통과' : '검증 실패'}. 같은 PC 안에 보관했습니다.`));
  $('#stop-worker').addEventListener('click', event => action(event.currentTarget, '/api/stop-worker', {}, result => result.note || result.reason));
  $('#search-form').addEventListener('submit', search);
  await refresh();
}
init().catch(error => message(error.message, true));
