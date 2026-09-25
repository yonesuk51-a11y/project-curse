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

  function header(g, card, emblem) {
    if (emblem?.complete && emblem.naturalWidth) g.drawImage(emblem, 56, 62, 80, 80);
    spaced(g, '0px');
    text(g, 'U.A.C 합동작전 단말 · PC-03', 156, 86, { family: MONO, size: 22, color: INK.text3, width: 480 });
    text(g, '현장 인원 등록증', 156, 140, { weight: 600, size: 52, width: 480 });
    spaced(g, '4px');
    text(g, 'FIELD PERSONNEL REGISTER', 158, 174, { family: COND, weight: 600, size: 22, color: INK.redBright, width: 480 });
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
    label(g, '분류', x, y);
    text(g, card.cls || '—', x, y + 38, { size: 28, width, max: 2, color: card.cls ? INK.text : INK.text3 });
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
      row('발현 경로', card.source);
      row('대가', card.cost, 2);
    } else {
      row('능력', card.cls ? '해당 없음' : '');
    }
    row('표식', card.tag ? `${card.tag} — ${card.tagNote || ''}` : '', 2);
    row('장비군', (card.gear || []).join(' · '), 2);
    row('기준점', card.anchor);
    if (card.note) row('한 줄 기록', card.note, 2);
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
    text(g, '등록', 0, 20, { weight: 700, size: 52, color: INK.red, width: 170 });
    text(g, '현장 인원', 0, 56, { weight: 600, size: 20, color: INK.red, width: 160 });
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
    details(g, card);
    footer(g, card);
    return true;
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

  root.PCRegisterCard = Object.freeze({ WIDTH, HEIGHT, regNo, dtg, draw, save, loadPhoto, fontsReady, emblem, filename });
})(window);
