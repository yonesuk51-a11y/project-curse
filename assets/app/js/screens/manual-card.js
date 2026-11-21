// Project Curse 6 — 현장 인원 등록증 그림(PNG). 2026-09-25 사용자 결정("자캐 등록증 그림"). (담당: Claude)
// 현장 지침의 '현장 인원 등록 양식'(manual.js)을 채우면 단말풍 등록증을 1080×1350 그림으로 그린다. 카카오스토리에 바로 올리는 용도다.
// 방문자가 넣은 사진은 이 기기의 메모리에서만 쓰고 어디로도 보내지 않는다(네트워크 요청 없음). 저장도 하지 않는다.
// 등록증은 교류용이다. 공식 기록이 아니라는 줄을 그림 아래에 넣는다.
(function (root) {
  'use strict';

  const doc = root.document;
  const WIDTH = 1080;
  const HEIGHT = 1350;
  const PHOTO_MAX_BYTES = 20 * 1024 * 1024;
  const EMBLEM = 'assets/brand/project-curse-emblem-128.png';
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const SANS = '"IBM Plex Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  const MONO = '"IBM Plex Mono", "IBM Plex Sans KR", "Malgun Gothic", monospace';
  const COND = '"Barlow Condensed", "IBM Plex Sans KR", sans-serif';
  const INK = {
    bg: '#0c0909', panel: '#140e0f', text: '#e2dcd6', text2: '#aca29c', text3: '#8a7f78',
    line: 'rgba(226, 220, 214, 0.14)', red: '#b33c45', redBright: '#e05a63', redInk: '#e0706f'
  };
  // 교범 Black Tag Protocol의 다섯 표식 — 표식 칸의 색
  const TAG_COLORS = {
    'White Tag': ['#e2dcd6', '#0c0909'],
    'Gray Tag': ['#8a7f78', '#0c0909'],
    'Red Tag': ['#b33c45', '#f4ecea'],
    'Black Tag': ['#050404', '#e2dcd6'],
    'Null Tag': ['#140e0f', '#aca29c']
  };

  /* ---------- 번호와 시각 ---------- */

  // 이름·호출부호·소속이 같으면 같은 번호(FNV-1a 32비트) — 다시 저장해도 번호가 바뀌지 않는다
  function hash(text) {
    let value = 0x811c9dc5;
    for (const ch of String(text)) {
      value ^= ch.codePointAt(0);
      value = Math.imul(value, 0x01000193) >>> 0;
    }
    return value >>> 0;
  }
  function regNo(card) {
    const code = hash(`${card.name || ''}|${card.callsign || ''}|${card.faction || ''}`).toString(36).toUpperCase().padStart(7, '0').slice(-6);
    return `PC03-${code}`;
  }
  // 단말의 시계는 2042년에 멈춰 있다 — 날짜·시각은 지금(UTC), 해는 42. 예: 251034ZSEP42
  function dtg(date = new Date()) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}Z${MONTHS[date.getUTCMonth()]}42`;
  }

  /* ---------- 글 배치 ---------- */

  const font = (weight, size, family) => `${weight} ${size}px ${family}`;

  // 낱말 단위로 줄을 나누고, 한 낱말이 너무 길면 글자 단위로 자른다. 줄 수를 넘으면 마지막 줄 끝을 '…'로.
  function lines(g, text, maxWidth, maxLines) {
    const out = [];
    let line = '';
    const push = () => {
      if (line.trim()) out.push(line.trim());
      line = '';
    };
    for (const token of String(text || '').split(/(\s+)/)) {
      if (!token) continue;
      const test = line + token;
      if (g.measureText(test).width <= maxWidth) {
        line = test;
        continue;
      }
      if (line.trim()) push();
      if (/^\s+$/.test(token)) continue;
      if (g.measureText(token).width <= maxWidth) {
        line = token;
        continue;
      }
      for (const ch of Array.from(token)) {
        if (g.measureText(line + ch).width > maxWidth && line) push();
        line += ch;
      }
    }
    push();
    if (out.length > maxLines) {
      const kept = out.slice(0, maxLines);
      let last = kept[maxLines - 1];
      while (last && g.measureText(`${last}…`).width > maxWidth) last = Array.from(last).slice(0, -1).join('');
      kept[maxLines - 1] = `${last}…`;
      return kept;
    }
    return out;
  }

  function text(g, value, x, y, options = {}) {
    g.font = font(options.weight || 400, options.size || 28, options.family || SANS);
    g.fillStyle = options.color || INK.text;
    const rows = lines(g, value, options.width || 600, options.max || 1);
    const step = options.lineHeight || Math.round((options.size || 28) * 1.3);
    rows.forEach((row, index) => g.fillText(row, x, y + index * step));
    return y + Math.max(rows.length, 1) * step;
  }

  function spaced(g, spacing) {
    if ('letterSpacing' in g) g.letterSpacing = spacing;
  }

  /* ---------- 부분 ---------- */

  function background(g) {
    g.fillStyle = INK.bg;
    g.fillRect(0, 0, WIDTH, HEIGHT);
    const glow = g.createRadialGradient(WIDTH * 0.78, 0, 40, WIDTH * 0.78, 0, 960);
    glow.addColorStop(0, 'rgba(179, 60, 69, 0.20)');
    glow.addColorStop(1, 'rgba(179, 60, 69, 0)');
    g.fillStyle = glow;
    g.fillRect(0, 0, WIDTH, HEIGHT);
    const vignette = g.createRadialGradient(WIDTH / 2, HEIGHT / 2, HEIGHT * 0.32, WIDTH / 2, HEIGHT / 2, HEIGHT * 0.82);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    g.fillStyle = vignette;
    g.fillRect(0, 0, WIDTH, HEIGHT);
    g.fillStyle = INK.red;
    g.fillRect(0, 0, WIDTH, 8);
    g.strokeStyle = INK.line;
    g.lineWidth = 2;
    g.strokeRect(24, 32, WIDTH - 48, HEIGHT - 56);
  }

  function header(g, card, emblem, titles = {}) {
    if (emblem?.complete && emblem.naturalWidth) g.drawImage(emblem, 56, 62, 80, 80);
    spaced(g, '0px');
    text(g, 'U.A.C 합동작전 단말 · PC-03', 156, 86, { family: MONO, size: 22, color: INK.text3, width: 480 });
    text(g, titles.title || '현장 인원 등록증', 156, 140, { weight: 600, size: 52, width: 480 });
    spaced(g, '4px');
    text(g, titles.code || 'FIELD PERSONNEL REGISTER', 158, 174, { family: COND, weight: 600, size: 22, color: INK.redBright, width: 480 });
    spaced(g, '0px');
    g.textAlign = 'right';
    text(g, card.regNo, WIDTH - 56, 90, { family: MONO, weight: 500, size: 26, width: 380 });
    text(g, `발급 ${card.issued}`, WIDTH - 56, 124, { family: MONO, size: 22, color: INK.text2, width: 380 });
    g.textAlign = 'left';
    if (card.tag) {
      const [fill, ink] = TAG_COLORS[card.tag] || [INK.panel, INK.text];
      g.font = font(600, 22, COND);
      spaced(g, '3px');
      const label = card.tag.toUpperCase();
      const w = g.measureText(label).width + 36;
      g.fillStyle = fill;
      g.fillRect(WIDTH - 56 - w, 144, w, 38);
      g.strokeStyle = card.tag === 'Null Tag' ? INK.text3 : 'rgba(226, 220, 214, 0.35)';
      g.setLineDash(card.tag === 'Null Tag' ? [6, 5] : []);
      g.lineWidth = 2;
      g.strokeRect(WIDTH - 56 - w, 144, w, 38);
      g.setLineDash([]);
      g.fillStyle = ink;
      g.fillText(label, WIDTH - 56 - w + 18, 171);
      spaced(g, '0px');
    }
    g.fillStyle = 'rgba(226, 220, 214, 0.12)';
    g.fillRect(56, 206, WIDTH - 112, 2);
    g.fillStyle = INK.red;
    g.fillRect(56, 204, 120, 6);
  }

  function photoBox(g, photo) {
    const x = 56;
    const y = 240;
    const w = 360;
    const h = 480;
    g.fillStyle = INK.panel;
    g.fillRect(x, y, w, h);
    if (photo) {
      const scale = Math.max(w / photo.width, h / photo.height);
      const sw = w / scale;
      const sh = h / scale;
      const sx = (photo.width - sw) / 2;
      const sy = Math.max(0, (photo.height - sh) * 0.3);
      g.drawImage(photo, sx, sy, sw, sh, x, y, w, h);
      const shade = g.createLinearGradient(0, y + h * 0.6, 0, y + h);
      shade.addColorStop(0, 'rgba(12, 9, 9, 0)');
      shade.addColorStop(1, 'rgba(12, 9, 9, 0.55)');
      g.fillStyle = shade;
      g.fillRect(x, y, w, h);
    } else {
      g.strokeStyle = 'rgba(226, 220, 214, 0.16)';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(x + w / 2, y + 60);
      g.lineTo(x + w / 2, y + h - 60);
      g.moveTo(x + 60, y + h / 2);
      g.lineTo(x + w - 60, y + h / 2);
      g.stroke();
      g.beginPath();
      g.arc(x + w / 2, y + h / 2, 64, 0, Math.PI * 2);
      g.stroke();
      g.textAlign = 'center';
      text(g, '사진 없음', x + w / 2, y + h / 2 + 118, { size: 26, color: INK.text3, width: w - 40 });
      g.textAlign = 'left';
    }
    g.strokeStyle = 'rgba(226, 220, 214, 0.22)';
    g.lineWidth = 2;
    g.strokeRect(x, y, w, h);
    // 붉은 모서리 괄호
    g.strokeStyle = INK.redBright;
    g.lineWidth = 4;
    const c = 28;
    [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]].forEach(([px, py, dx, dy]) => {
      g.beginPath();
      g.moveTo(px + dx * c, py);
      g.lineTo(px, py);
      g.lineTo(px, py + dy * c);
      g.stroke();
    });
  }

  function label(g, value, x, y) {
    spaced(g, '3px');
    text(g, value, x, y, { family: COND, weight: 600, size: 20, color: INK.text3, width: 300 });
    spaced(g, '0px');
  }

  // 현장 적합성 평가 막대(2026-11-21 사용자 결정) — 오른쪽 칸 아래, 분류 줄과 아래 칸 사이에 여섯 칸. 고른 경우만
  function fitness(g, card) {
    if (!card.fitness?.length) return;
    const x0 = 452;
    const cell = Math.floor((WIDTH - 56 - x0) / card.fitness.length);
    const y = 740;
    g.strokeStyle = INK.line;
    g.lineWidth = 2;
    card.fitness.forEach((item, index) => {
      const x = x0 + index * cell;
      g.strokeRect(x, y - 30, cell - 6, 40);
      spaced(g, '1px');
      text(g, item.label, x + 8, y, { family: COND, weight: 600, size: 20, color: INK.text3, width: 60 });
      spaced(g, '0px');
      text(g, item.grade || '—', x + cell - 38, y + 1, { family: MONO, weight: 500, size: 24, color: item.grade ? INK.redInk : INK.text3, width: 30 });
    });
  }

  function identity(g, card) {
    const x = 452;
    const width = WIDTH - 56 - x;
    let y = 262;
    label(g, '이름', x, y);
    y = text(g, card.name || '이름 미기재', x, y + 50, { weight: 600, size: 48, width, max: 2, lineHeight: 56, color: card.name ? INK.text : INK.text3 }) + 8;
    label(g, '호출부호', x, y);
    y = text(g, card.callsign || '—', x, y + 40, { family: MONO, weight: 500, size: 30, width, color: card.callsign ? INK.redInk : INK.text3 }) + 14;
    label(g, '소속', x, y);
    y = text(g, card.faction ? `${card.faction}${card.role ? ` · ${card.role}` : ''}` : '—', x, y + 40, { weight: 500, size: 32, width, max: 2, lineHeight: 40, color: card.faction ? INK.text : INK.text3 }) + 14;
    label(g, '배치선', x, y);
    y = text(g, card.line || '—', x, y + 38, { size: 28, width, color: card.line ? INK.text : INK.text3 }) + 14;
    // 능력 등급(2026-11-21 사용자 결정) — 분류 칸에 함께 적는다(아래 칸과 겹치지 않게). 예: 능력자 · L2
    label(g, card.grade ? '분류 · 능력 등급' : '분류', x, y);
    const cls = [card.cls, card.grade].filter(Boolean).join(' · ');
    text(g, cls || '—', x, y + 38, { size: 28, width, max: card.fitness?.length ? 1 : 2, color: cls ? INK.text : INK.text3 });
  }

  function details(g, card) {
    const lx = 56;
    const vx = 236;
    const width = WIDTH - 56 - vx;
    let y = 772;
    const row = (name, value, max = 1) => {
      label(g, name, lx, y);
      y = text(g, value || '—', vx, y + 2, { size: 27, width, max, lineHeight: 36, color: value ? INK.text : INK.text3 }) + 16;
    };
    if (card.source) {
      row(card.sourceLabel || '발현 경로', card.source);
      row('대가', card.cost, 2);
    } else {
      row('능력', card.cls ? '해당 없음' : '');
    }
    // 출신·소능력·보조 장비(2026-11-21 사용자 결정) — 고른 경우만 한 줄씩. 칸이 늘면 표식·장비군·한 줄 기록을 한 줄로 줄여 아래 띠를 넘지 않게 한다.
    const extra = [card.origin || card.unit, card.minor, card.augment].filter(Boolean).length;
    // 전 소속(2026-11-21 사용자 결정)은 출신 줄에 붙인다. 자세한 복무 기록은 뒷면 그림(drawService)에 들어간다
    if (card.origin) row('출신', card.unit ? `${card.origin} · 전 ${card.unit}` : card.origin);
    else if (card.unit) row('전 소속', card.unit);
    if (card.minor) row('소능력', `${card.minor}${card.minorCost ? ` — ${card.minorCost}` : ''}`, extra >= 2 ? 1 : 2);
    if (card.augment) row('보조 장비', card.augment);
    row('표식', card.tag ? `${card.tag} — ${card.tagNote || ''}` : '', extra ? 1 : 2);
    row('장비군', (card.gear || []).join(' · '), extra ? 1 : 2);
    if (extra < 3) row('기준점', card.anchor);
    if (card.note) row('한 줄 기록', card.note, extra ? 1 : 2);
  }

  function footer(g, card) {
    // 장식용 줄무늬 — 번호에서 만든 무늬일 뿐 읽을 수 있는 정보는 없다
    let seed = hash(card.regNo);
    let x = 56;
    const top = HEIGHT - 150;
    g.fillStyle = 'rgba(226, 220, 214, 0.62)';
    for (let i = 0; i < 56 && x < 404; i += 1) {
      seed = Math.imul(seed ^ (seed >>> 15), 0x2c1b3c6d) >>> 0;
      const bar = 2 + (seed % 4);
      if (i % 2 === 0) g.fillRect(x, top, bar, 58);
      x += bar + 2;
    }
    text(g, '교류용 등록증 · 공식 기록이 아닙니다 · Project Curse', 56, HEIGHT - 58, { family: MONO, size: 20, color: INK.text3, width: 660 });
    // 등록 인장
    const cx = WIDTH - 196;
    const cy = HEIGHT - 196;
    g.save();
    g.translate(cx, cy);
    g.rotate(-0.18);
    g.globalAlpha = 0.9;
    g.strokeStyle = INK.red;
    g.lineWidth = 6;
    g.beginPath();
    g.arc(0, 0, 96, 0, Math.PI * 2);
    g.stroke();
    g.lineWidth = 2;
    g.beginPath();
    g.arc(0, 0, 82, 0, Math.PI * 2);
    g.stroke();
    g.textAlign = 'center';
    g.fillStyle = INK.red;
    spaced(g, '2px');
    text(g, 'PC-03', 0, -34, { family: MONO, weight: 500, size: 20, color: INK.red, width: 160 });
    spaced(g, '0px');
    text(g, card.stamp?.[0] || '등록', 0, 20, { weight: 700, size: 52, color: INK.red, width: 170 });
    text(g, card.stamp?.[1] || '현장 인원', 0, 56, { weight: 600, size: 20, color: INK.red, width: 160 });
    g.restore();
  }

  /* ---------- 공개 함수 ---------- */

  function draw(canvas, card, assets = {}) {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const g = canvas.getContext('2d');
    if (!g) return false;
    g.textBaseline = 'alphabetic';
    background(g);
    header(g, card, assets.emblem);
    photoBox(g, assets.photo || null);
    identity(g, card);
    fitness(g, card);
    details(g, card);
    footer(g, card);
    return true;
  }

  /* ---------- 복무 기록(뒷면) — 2026-11-21 사용자 결정 ----------
     등록증과 같은 판형·번호로 그린다. 교범 '복무 기록과 계측값'의 경계값(일치율 70·90, 노출 한 해 30분)을 그대로 표시한다. 고른 칸만 그린다. */
  function serviceRow(g, name, value, y, options = {}) {
    label(g, name, 56, y);
    return text(g, value, 300, y + 2, { size: options.size || 30, width: options.width || WIDTH - 356, max: options.max || 1, lineHeight: 40, color: options.color || INK.text }) + 18;
  }

  function serviceBar(g, y, ratio, marks, over) {
    const x = 56;
    const w = WIDTH - 112;
    g.fillStyle = 'rgba(226, 220, 214, 0.08)';
    g.fillRect(x, y, w, 14);
    g.fillStyle = over ? INK.red : 'rgba(226, 220, 214, 0.72)';
    g.fillRect(x, y, Math.round(w * Math.max(0, Math.min(1, ratio))), 14);
    g.fillStyle = INK.redBright;
    marks.forEach((mark) => g.fillRect(x + Math.round(w * mark) - 1, y - 8, 3, 30));
  }

  function drawService(canvas, card, assets = {}) {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const g = canvas.getContext('2d');
    if (!g) return false;
    g.textBaseline = 'alphabetic';
    const sv = card.service || {};
    background(g);
    header(g, card, assets.emblem, { title: '복무 기록', code: 'SERVICE RECORD / 등록증 뒷면' });
    let y = 262;
    text(g, card.name || '이름 미기재', 56, y + 40, { weight: 600, size: 44, width: 620, color: card.name ? INK.text : INK.text3 });
    g.textAlign = 'right';
    text(g, card.callsign || '—', WIDTH - 56, y + 40, { family: MONO, weight: 500, size: 30, width: 360, color: card.callsign ? INK.redInk : INK.text3 });
    g.textAlign = 'left';
    y += 84;
    g.fillStyle = INK.line;
    g.fillRect(56, y, WIDTH - 112, 2);
    y += 44;

    if (sv.unit) y = serviceRow(g, '전 소속', sv.unit, y, { max: 2 });
    if (sv.period) y = serviceRow(g, '복무 기간', sv.period, y, { size: 28 });
    if (sv.discharge) y = serviceRow(g, '퇴역 사유', sv.discharge, y, { size: 28, color: /대가|말소|수배/.test(sv.discharge) ? INK.redInk : INK.text });

    // 자격 칩
    if (sv.skills?.length) {
      label(g, '자격·특기', 56, y);
      let x = 300;
      g.font = font(500, 26, SANS);
      sv.skills.forEach((skill) => {
        const w = g.measureText(skill).width + 32;
        g.strokeStyle = 'rgba(226, 220, 214, 0.35)';
        g.lineWidth = 2;
        g.strokeRect(x, y - 30, w, 42);
        text(g, skill, x + 16, y + 1, { weight: 500, size: 26, width: w });
        x += w + 12;
      });
      y += 52;
    }

    // 기억 대조 일치율
    if (sv.memory !== '' && sv.memory != null) {
      y += 10;
      label(g, '기억 대조 일치율', 56, y);
      g.textAlign = 'right';
      text(g, sv.memoryNote || '', WIDTH - 56, y, { weight: 600, size: 24, width: 300, color: Number(sv.memory) >= 90 ? INK.text2 : INK.redInk });
      g.textAlign = 'left';
      text(g, `${sv.memory}%`, 56, y + 62, { family: MONO, weight: 500, size: 54, width: 260, color: Number(sv.memory) >= 70 ? INK.text : INK.redInk });
      serviceBar(g, y + 84, Number(sv.memory) / 100, [0.7, 0.9], Number(sv.memory) < 70);
      y += 122;
    }

    // 진입·귀환·목격
    const counts = [['존 진입', sv.entries], ['귀환', sv.returns], ['리버스 목격', sv.sightings]];
    if (counts.some(([, value]) => value !== '' && value != null)) {
      y += 6;
      const cell = Math.floor((WIDTH - 112) / 3);
      counts.forEach(([name, value], index) => {
        const x = 56 + index * cell;
        g.strokeStyle = INK.line;
        g.lineWidth = 2;
        g.strokeRect(x, y - 30, cell - 10, 112);
        spaced(g, '2px');
        text(g, name, x + 18, y + 2, { family: COND, weight: 600, size: 20, color: INK.text3, width: cell - 40 });
        spaced(g, '0px');
        text(g, value === '' || value == null ? '—' : String(value), x + 18, y + 62, { family: MONO, weight: 500, size: 46, width: cell - 40, color: value === '' ? INK.text3 : INK.text });
      });
      y += 98;
      if (sv.countNote) {
        text(g, `진입과 귀환이 맞지 않는다 — ${sv.countNote}`, 56, y + 14, { weight: 600, size: 24, color: INK.redInk, width: WIDTH - 112 });
        y += 34;
      }
      y += 16;
    }

    // 누적 노출 — 막대는 한도(30분)를 1/3 지점에 둔다
    if (sv.exposure !== '' && sv.exposure != null) {
      label(g, '누적 노출', 56, y);
      g.textAlign = 'right';
      text(g, sv.exposureOver ? '한 해 한도 30분 기준 초과 기록' : '한도 안', WIDTH - 56, y, { weight: 600, size: 24, width: 420, color: sv.exposureOver ? INK.redInk : INK.text2 });
      g.textAlign = 'left';
      text(g, `${sv.exposure}분`, 56, y + 56, { family: MONO, weight: 500, size: 44, width: 260, color: sv.exposureOver ? INK.redInk : INK.text });
      serviceBar(g, y + 76, Number(sv.exposure) / 90, [1 / 3], sv.exposureOver);
      y += 116;
    }

    // 잃은 것·남은 것 — 한 줄씩(길면 말줄임). 아래 검사 칸보다 먼저 그려 등록 인장과 겹치지 않게 한다
    if (sv.lost) y = serviceRow(g, '잃은 것', sv.lost, y, { size: 28, width: 480, color: INK.text2 });
    if (sv.kept) y = serviceRow(g, '남은 것', sv.kept, y, { size: 28, width: 480 });

    // 체력 검정·웃음 반응
    const tests = [['체력 검정', sv.physical], ['웃음 반응 검사', sv.laugh]].filter(([, value]) => value);
    if (tests.length) {
      const cell = Math.floor((WIDTH - 112) / 2);
      tests.forEach(([name, value], index) => {
        const x = 56 + index * cell;
        spaced(g, '2px');
        text(g, name, x, y, { family: COND, weight: 600, size: 20, color: INK.text3, width: cell - 20 });
        spaced(g, '0px');
        text(g, value, x, y + 40, { weight: 600, size: 30, width: 220, color: /불합격|부적합|격리/.test(value) ? INK.redInk : INK.text });
      });
      y += 76;
    }

    footer(g, card);
    return true;
  }

  function serviceFilename(card) {
    return filename(card).replace('등록증', '복무기록');
  }

  /* ---------- 교전 보고서·분대 편성표 — 2026-11-21 사용자 추천안 승인 ----------
     자캐 글에 붙이는 교류용 그림. 같은 판형(1080×1350), 같은 머리·바닥. 번호는 값에서 만든다. */
  function sheetNo(prefix, text) {
    return `${prefix}-${hash(text).toString(36).toUpperCase().padStart(7, '0').slice(-6)}`;
  }

  function drawReport(canvas, rep, assets = {}) {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const g = canvas.getContext('2d');
    if (!g) return false;
    g.textBaseline = 'alphabetic';
    const head = { regNo: rep.regNo, issued: rep.issued, stamp: ['보고', '교전 기록'] };
    background(g);
    header(g, head, assets.emblem, { title: '교전 보고', code: 'AFTER-ACTION REPORT' });
    let y = 262;
    text(g, rep.op || '작전명 미기재', 56, y + 40, { weight: 600, size: 44, width: 640, color: rep.op ? INK.text : INK.text3 });
    g.textAlign = 'right';
    text(g, rep.date || '—', WIDTH - 56, y + 38, { family: MONO, weight: 500, size: 28, width: 320, color: INK.text2 });
    g.textAlign = 'left';
    y += 76;
    const row = (name, value, color) => {
      label(g, name, 56, y);
      text(g, value || '—', 236, y + 2, { size: 28, width: WIDTH - 292, color: color || (value ? INK.text : INK.text3) });
      y += 46;
    };
    row('장소', rep.place);
    row('분대', rep.squad);
    const counted = rep.out !== '' && rep.back !== '';
    const mismatch = counted && rep.out !== rep.back;
    row('인원', counted ? `출발 ${rep.out} / 귀환 ${rep.back}${mismatch ? ' — 계수 불일치' : ''}` : '', mismatch ? INK.redInk : null);
    g.fillStyle = INK.line;
    g.fillRect(56, y, WIDTH - 112, 2);
    y += 46;

    // 현장 시각 — 줄마다 시각·종류·내용
    spaced(g, '3px');
    text(g, 'FIELD TIMELINE / 현장 시각', 56, y, { family: COND, weight: 600, size: 20, color: INK.text3, width: 600 });
    spaced(g, '0px');
    y += 44;
    (rep.lines || []).slice(0, 8).forEach((line) => {
      if (y > HEIGHT - 400) return;
      text(g, line.time || '--:--', 56, y, { family: MONO, weight: 500, size: 28, color: INK.redInk, width: 110 });
      if (line.kind) {
        g.font = font(600, 20, SANS);
        const w = Math.min(150, g.measureText(line.kind).width + 20);
        g.strokeStyle = 'rgba(226, 220, 214, 0.35)';
        g.lineWidth = 2;
        g.strokeRect(176, y - 26, w, 34);
        text(g, line.kind, 186, y - 2, { weight: 600, size: 20, color: INK.text2, width: w - 16 });
      }
      y = text(g, line.text || '', 344, y, { size: 26, width: WIDTH - 400, max: 2, lineHeight: 34 }) + 14;
    });
    y = Math.max(y, HEIGHT - 390);
    g.fillStyle = INK.line;
    g.fillRect(56, y, WIDTH - 112, 2);
    y += 44;
    row('탄약', rep.ammo);
    row('피해', rep.damage, rep.damage ? INK.redInk : null);
    label(g, '남은 것', 56, y);
    text(g, rep.result || '—', 236, y + 2, { size: 28, width: 480, max: 2, lineHeight: 36, color: rep.result ? INK.text : INK.text3 });
    y += 84;
    if (rep.grade) {
      label(g, '기록 등급', 56, y);
      text(g, rep.grade, 236, y + 2, { weight: 600, size: 26, width: 460, color: INK.text2 });
    }
    footer(g, head);
    return true;
  }

  function drawSquad(canvas, sq, assets = {}) {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const g = canvas.getContext('2d');
    if (!g) return false;
    g.textBaseline = 'alphabetic';
    const head = { regNo: sq.regNo, issued: sq.issued, stamp: ['편성', '현장조'] };
    background(g);
    header(g, head, assets.emblem, { title: '분대 편성표', code: 'SQUAD ROSTER' });
    let y = 262;
    text(g, sq.name || '분대 호출부호 미기재', 56, y + 44, { family: MONO, weight: 500, size: 46, width: 600, color: sq.name ? INK.redInk : INK.text3 });
    g.textAlign = 'right';
    text(g, sq.line || '—', WIDTH - 56, y + 30, { size: 26, width: 380, color: INK.text2 });
    text(g, sq.zone || '', WIDTH - 56, y + 64, { size: 24, width: 380, color: INK.text3 });
    g.textAlign = 'left';
    y += 110;
    const seats = (sq.seats || []).filter((seat, index) => index < 5 || seat.callsign || seat.name);
    const colW = Math.floor((WIDTH - 112 - 16) / 2);
    const cellH = 196;
    seats.forEach((seat, index) => {
      const x = 56 + (index % 2) * (colW + 16);
      const top = y + Math.floor(index / 2) * (cellH + 14);
      g.strokeStyle = seat.extra ? 'rgba(224, 112, 111, 0.55)' : INK.line;
      g.lineWidth = 2;
      g.setLineDash(seat.extra ? [8, 6] : []);
      g.strokeRect(x, top, colW, cellH);
      g.setLineDash([]);
      spaced(g, '3px');
      text(g, seat.seat, x + 22, top + 38, { family: COND, weight: 600, size: 22, color: seat.extra ? INK.redInk : INK.text3, width: colW - 44 });
      spaced(g, '0px');
      text(g, seat.callsign || '—', x + 22, top + 84, { family: MONO, weight: 500, size: 30, color: seat.callsign ? INK.redInk : INK.text3, width: colW - 44 });
      text(g, seat.name || '비어 있음', x + 22, top + 130, { weight: 600, size: 34, color: seat.name ? INK.text : INK.text3, width: colW - 44 });
      if (seat.note) text(g, seat.note, x + 22, top + 170, { size: 22, color: INK.text2, width: colW - 44 });
    });
    const rows = Math.ceil(seats.length / 2);
    y += rows * (cellH + 14) + 30;
    const filled = seats.filter((seat) => !seat.extra && (seat.callsign || seat.name)).length;
    const extra = seats.some((seat) => seat.extra && (seat.callsign || seat.name));
    text(g, `계수 — ${['영', '하나', '둘', '셋', '넷', '다섯'][filled] || filled}${extra ? (filled === 1 ? '와 하나' : '과 하나') : ''}. 들어갈 때, 나올 때, 인계할 때 따로 센다.`, 56, y, { size: 24, color: INK.text2, width: WIDTH - 112 });
    footer(g, head);
    return true;
  }

  function sheetFilename(kind, name) {
    const base = String(name || '무명').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '').replace(/\s+/g, '-').slice(0, 40) || '무명';
    return `project-curse-${kind}-${base}.png`;
  }

  // 기록 카드(2026-11-21 사용자 결정) — 상황판 '오늘의 기록 한 장'을 같은 판형(1080×1350)으로 그린다. 교류용 사본 줄을 넣는다.
  // record = { kind, text, source, title }
  function drawRecord(canvas, record, assets = {}) {
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const g = canvas.getContext('2d');
    if (!g) return false;
    g.textBaseline = 'alphabetic';
    background(g);
    if (assets.emblem?.complete && assets.emblem.naturalWidth) g.drawImage(assets.emblem, 56, 62, 80, 80);
    spaced(g, '2px');
    text(g, 'U.A.C JOINT OPS · PC-03', 156, 98, { family: COND, weight: 600, size: 26, color: INK.text3, width: 520 });
    text(g, dtg(), WIDTH - 360, 98, { family: MONO, weight: 500, size: 26, color: INK.text3, width: 300 });
    spaced(g, '0px');
    text(g, record.title || '오늘의 기록 한 장', 156, 136, { weight: 600, size: 28, color: INK.text2, width: 760 });
    g.fillStyle = INK.redInk;
    g.fillRect(72, 220, 6, 80);
    text(g, record.kind || '', 100, 248, { weight: 600, size: 30, color: INK.redInk, width: 880 });
    text(g, record.source || '', 100, 292, { weight: 400, size: 26, color: INK.text3, width: 880, max: 2, lineHeight: 34 });
    text(g, record.text || '', 72, 420, { weight: 600, size: 58, color: INK.text, width: 936, max: 11, lineHeight: 84 });
    g.strokeStyle = INK.line;
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(72, HEIGHT - 170);
    g.lineTo(WIDTH - 72, HEIGHT - 170);
    g.stroke();
    text(g, 'PROJECT CURSE — 단말 기록 사본', 72, HEIGHT - 116, { family: MONO, weight: 500, size: 26, color: INK.text2, width: 900 });
    text(g, '교류용 사본이며 공식 기록이 아니다.', 72, HEIGHT - 76, { weight: 400, size: 24, color: INK.text3, width: 900 });
    return true;
  }

  function recordFilename(record) {
    const base = String(record.kind || '기록').replace(/[\\/:*?"<>|\u0000-\u001f·]/g, '').replace(/\s+/g, '-').slice(0, 30) || '기록';
    const now = new Date();
    const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    return `project-curse-오늘의기록-${base}-${stamp}.png`;
  }

  // 글꼴이 늦게 오면 대체 글꼴로 그려지므로, 쓰는 글꼴을 먼저 불러 둔다(실패해도 그린다)
  function fontsReady() {
    const set = doc.fonts;
    if (!set?.load) return Promise.resolve();
    return Promise.all([
      set.load(font(400, 28, SANS), '가'), set.load(font(600, 48, SANS), '가'), set.load(font(700, 52, SANS), '가'),
      set.load(font(500, 26, MONO), 'A'), set.load(font(600, 22, COND), 'A')
    ]).then(() => undefined, () => undefined);
  }

  function emblem(onload) {
    const image = new root.Image();
    image.decoding = 'async';
    image.addEventListener('load', onload, { once: true });
    image.src = EMBLEM;
    return image;
  }

  // 방문자가 고른 그림 파일 → 그리기용 그림. 파일은 기기 밖으로 나가지 않는다.
  function loadPhoto(file) {
    if (!file || !/^image\//.test(file.type || '')) return Promise.reject(new Error('type'));
    if (file.size > PHOTO_MAX_BYTES) return Promise.reject(new Error('size'));
    if (root.createImageBitmap) return root.createImageBitmap(file);
    return new Promise((resolve, reject) => {
      const url = root.URL.createObjectURL(file);
      const image = new root.Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('decode'));
      image.src = url;
    });
  }

  // PNG로 저장 — toBlob이 멈추는 환경을 위해 3초 뒤에는 dataURL로 받는다
  function save(canvas, filename) {
    const download = (href, revoke) => {
      const link = doc.createElement('a');
      link.href = href;
      link.download = filename;
      link.rel = 'noopener';
      doc.body.append(link);
      link.click();
      link.remove();
      if (revoke) root.setTimeout(() => root.URL.revokeObjectURL(href), 4000);
      return true;
    };
    const viaDataUrl = () => {
      try {
        return download(canvas.toDataURL('image/png'), false);
      } catch (_error) {
        return false;
      }
    };
    if (!canvas.toBlob) return Promise.resolve(viaDataUrl());
    return new Promise((resolve) => {
      let settled = false;
      const timer = root.setTimeout(() => {
        if (settled) return;
        settled = true;
        resolve(viaDataUrl());
      }, 3000);
      canvas.toBlob((blob) => {
        if (settled) return;
        settled = true;
        root.clearTimeout(timer);
        resolve(blob ? download(root.URL.createObjectURL(blob), true) : viaDataUrl());
      }, 'image/png');
    });
  }

  // 파일 이름 — 이름이나 호출부호에서 파일에 못 쓰는 글자를 뺀다
  function filename(card) {
    const base = String(card.name || card.callsign || '무명').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '').replace(/\s+/g, '-').slice(0, 40) || '무명';
    return `project-curse-등록증-${base}.png`;
  }

  root.PCRegisterCard = Object.freeze({ WIDTH, HEIGHT, regNo, dtg, draw, drawService, serviceFilename, drawReport, drawSquad, sheetNo, sheetFilename, drawRecord, recordFilename, save, loadPhoto, fontsReady, emblem, filename });
})(window);
