// Project Curse — 문장 개정 사실 대조 공용 모듈.
// tools/check-prose.mjs(데이터 개정 대조)와 tools/verify-app.mjs(보호 기록 개정판 대조)가 함께 쓴다.

// 판정 표현 — 원문에 있던 것이 개정문에서 빠지면 확인되지 않은 것이 확정문으로 바뀐 것일 수 있다.
export const MARKERS = ['확인되지', '확인하지', '확인된 적', '미확인', '추정', '가능성', '정황', '주장', '알려지지', '알 수 없', '불명', '판정되지', '공개되지', '밝혀지지', '의혹', '의심', '보인다', '보였다', '보이는', '듯', '모른다', '미상', '결정 대기', '상충'];
export const NEGATION = /않|없|못|아니/g;

// 숫자는 종류만 대조한다. 겹친 문단을 합치면 같은 숫자의 등장 횟수는 줄어들 수 있다.
export const numbers = (s) => [...new Set(s.match(/\d+(?:[.,:·]\d+)*/g) || [])].sort();
export const latin = (s) => [...new Set(s.match(/[A-Za-z][A-Za-z0-9.\-']*[A-Za-z0-9]|[A-Za-z]/g) || [])];
export const quoted = (s) => [...new Set(s.match(/「[^」]*」|『[^』]*』|“[^”]*”|‘[^’]*’|"[^"]*"/g) || [])];
export const count = (s, re) => (s.match(re) || []).length;

// 내용어 — 형태소 분석 없이 조사를 떼어 낸 명사 줄기만 비교한다. 동사·어미로 끝나는 말은 건너뛴다.
const PARTICLES = ['에서부터', '으로부터', '에게서', '에서는', '에서도', '으로는', '으로도', '까지는', '부터는', '에서', '으로', '에게', '한테', '처럼', '보다', '까지', '부터', '마다', '조차', '이나', '이며', '이고', '에는', '에도', '와', '과', '은', '는', '이', '가', '을', '를', '의', '에', '로', '도', '만', '나'];
const VERBISH = /(다|고|며|면|서|지|게|니|어|아|했|였|된|한|는|은|을|던|할|될|인|적|록|듯|자|요)$/;
export function stems(s) {
  const out = new Set();
  for (const word of s.match(/[가-힣]{2,}/g) || []) {
    let stem = word;
    for (const particle of PARTICLES) {
      if (stem.length > particle.length + 1 && stem.endsWith(particle)) {
        stem = stem.slice(0, -particle.length);
        break;
      }
    }
    if (stem.length >= 2 && !VERBISH.test(stem)) out.add(stem);
  }
  return [...out];
}

// 고유명사 사전 — 기본 지명·용어에 세력 이름과 인물 이름을 더한다.
export function dictionary(ctx) {
  const words = new Set(['대흑림', '데드존', '피의 호수', '순례 회랑', '북해', '검문소', '성채', '리버스', '괴이', '타락자', '능력자', '방랑자', '위버멘시', '레드울프', '우시노다교', '아마리온', '제6계측계획']);
  Object.values(ctx?.ProjectCurseCanon?.factions || {}).forEach((f) => f?.name && words.add(f.name));
  const walk = (value, depth) => {
    if (!value || depth > 6) return;
    if (Array.isArray(value)) return value.forEach((item) => walk(item, depth + 1));
    if (typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) {
        if ((key === 'name' || key === 'koreanName' || key === 'nameKo') && typeof item === 'string' && item.length >= 2 && item.length <= 16) words.add(item.trim());
        else walk(item, depth + 1);
      }
    }
  };
  walk(ctx?.ProjectCursePersonnel, 0);
  walk(ctx?.ProjectCursePersonnelProfiles, 0);
  return [...words].filter((w) => w.length >= 2);
}

// 원문과 개정문을 대조한다. fails는 사실 누락, warns는 사람이 확인할 변화.
export function compareFacts(oldText, newText, dict = []) {
  const fails = [];
  const warns = [];
  const n0 = numbers(oldText).join(' ');
  const n1 = numbers(newText).join(' ');
  if (n0 !== n1) fails.push(`숫자가 다르다: [${n0}] → [${n1}]`);
  const lostLatin = latin(oldText).filter((t) => !newText.includes(t));
  if (lostLatin.length) fails.push(`영문 약어·이름이 빠졌다: ${lostLatin.join(', ')}`);
  const lostQuoted = quoted(oldText).filter((q) => !newText.includes(q));
  if (lostQuoted.length) fails.push(`괄호 인용이 빠졌다: ${lostQuoted.join(', ')}`);
  const lostMarkers = MARKERS.filter((m) => oldText.includes(m) && !newText.includes(m));
  if (lostMarkers.length) fails.push(`판정 표현이 빠졌다: ${lostMarkers.join(', ')}`);
  const lostNames = dict.filter((w) => oldText.includes(w) && !newText.includes(w));
  if (lostNames.length) fails.push(`고유명사가 빠졌다: ${lostNames.join(', ')}`);
  const lostStems = stems(oldText).filter((stem) => !newText.includes(stem));
  if (lostStems.length) warns.push(`빠졌을 수 있는 말: ${lostStems.join(', ')}`);
  const neg0 = count(oldText, NEGATION);
  const neg1 = count(newText, NEGATION);
  if (neg1 < neg0) warns.push(`부정 표현이 ${neg0} → ${neg1}개로 줄었다`);
  const ratio = oldText.length ? newText.length / oldText.length : 1;
  if (oldText.length > 40 && (ratio < 0.7 || ratio > 1.3)) warns.push(`길이가 ${Math.round(ratio * 100)}%로 달라졌다`);
  return { fails, warns };
}

// HTML 조각의 글자만 뽑는다. 보호 기록 개정판 대조에 쓴다.
export function htmlText(html) {
  return String(html || '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|section|article|header|figcaption|blockquote)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s+/g, '\n')
    .trim();
}
