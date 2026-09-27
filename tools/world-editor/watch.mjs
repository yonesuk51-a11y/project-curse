import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { WORK, ROOT, snapshot, readJson, writeAtomic, withLock, now, sleep } from './core.mjs';
import { audit } from './engine.mjs';
import { collectResearch } from './research.mjs';
import { createBackup } from './backup.mjs';

const DAY = 24 * 60 * 60 * 1000;
const nextDue = (date, interval) => !date || !Number.isFinite(Date.parse(date)) || Date.now() - Date.parse(date) >= interval;

export async function stopWatch(work = WORK) {
  const state = await readJson(path.join(work, 'worker-state.json'), null);
  if (!state || state.status !== 'running') return { requested: false, reason: '실행 중인 감시 작업 기록이 없습니다.' };
  await writeAtomic('stop-worker.json', { runId: state.runId, requestedAt: now() }, work);
  return { requested: true, runId: state.runId, note: '다음 폴링에서 안전하게 종료합니다.' };
}

export async function watch({ work = WORK, root = ROOT, intervalMs = 60000 } = {}) {
  if (!Number.isInteger(intervalMs) || intervalMs < 15000 || intervalMs > 3600000) throw new Error('감시 간격은 15초~1시간이어야 합니다.');
  return withLock('watch', async () => {
    const previous = await readJson(path.join(work, 'worker-state.json'), null);
    const state = { schema: 1, runId: randomUUID(), pid: process.pid, status: 'running', startedAt: now(), updatedAt: now(), intervalMs,
      lastAudit: previous?.lastAudit || null, lastAuditFingerprint: previous?.lastAuditFingerprint || null,
      lastResearch: previous?.lastResearch || null, lastBackup: previous?.lastBackup || null,
      lastBackupAttempt: previous?.lastBackupAttempt || null, lastError: null, events: [] };
    const update = async (kind, detail) => {
      state.updatedAt = now();
      if (kind) state.events = [{ at: state.updatedAt, kind, detail }, ...state.events].slice(0, 30);
      await writeAtomic('worker-state.json', state, work);
      if (kind) console.log(`${state.updatedAt} ${kind}: ${detail}`);
    };
    let stopped = false;
    const requestStop = () => { stopped = true; };
    process.once('SIGINT', requestStop);
    process.once('SIGTERM', requestStop);
    await update('start', '로컬 변경 감시 시작 — AI 호출·정사 수정·게시는 하지 않습니다.');
    let candidate = null;
    let stableSince = 0;
    try {
      while (!stopped) {
        try {
          const stop = await readJson(path.join(work, 'stop-worker.json'), null);
          if (stop?.runId === state.runId) { stopped = true; break; }
          const snap = await snapshot(root);
          if (snap.fingerprint !== candidate) { candidate = snap.fingerprint; stableSince = Date.now(); }
          if (candidate !== state.lastAuditFingerprint && Date.now() - stableSince >= intervalMs) {
            const result = await audit({ force: true, checks: true, work });
            state.lastAudit = now();
            state.lastAuditFingerprint = result.fingerprint;
            state.lastError = result.checks.some(item => item.status !== 'passed') ? '기존 앱/데이터 검사 실패. 보고서를 확인하세요.' : null;
            await update('audit', `${result.findings.length}개 검토 후보, 검사 ${result.checks.map(item => item.status).join('/')}`);
          }
          if (nextDue(state.lastResearch, DAY)) {
            const result = await collectResearch({ work });
            state.lastResearch = now();
            await update('research', `${result.sources.filter(item => item.status === 'failed').length}/${result.sources.length} 출처 접근 실패. 링크 발견은 사실 검증이 아닙니다.`);
          }
          if (nextDue(state.lastBackup, 7 * DAY) && nextDue(state.lastBackupAttempt, DAY)) {
            state.lastBackupAttempt = now();
            await update(null);
            const result = await createBackup({ work, root });
            state.lastBackup = now();
            await update('backup', `${result.files}개 텍스트·설정 파일의 로컬 복사본 생성. 외부 디스크 백업은 별도입니다.`);
          }
        } catch (error) {
          state.lastError = error.message;
          await update('error', error.message);
        }
        await sleep(intervalMs);
      }
    } finally {
      process.off('SIGINT', requestStop);
      process.off('SIGTERM', requestStop);
      state.status = 'stopped';
      await update('stop', '로컬 변경 감시 종료');
    }
  }, work);
}
