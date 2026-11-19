/* "Ideias conectadas" — rede neural de conexões (canvas 2D, sem dependências).
   Narrativa, uma vez ao entrar na tela:
     1. organização: pontos partem de uma espiral de ângulo áureo e se encaixam em 4 camadas simétricas
        de cada lado do rótulo (das externas para as internas);
     2. conexão: as ligações se acendem de fora para dentro, com uma cabeça de luz, até chegar ao rótulo;
     3. solução: o rótulo acende (.is-linked) e as portas piscam;
     4. expansão: antenas crescem das camadas externas para as bordas.
   Depois: pulsos de luz percorrem caminhos até o rótulo ("dados chegando à solução"), os nós respiram e,
   com mouse, os nós próximos se ligam ao cursor. Pausa fora da tela; com prefers-reduced-motion,
   desenha só o estado final, estático. Layout calculado pelo tamanho real (horizontal / vertical). */
const TAU = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeBack = (t) => { const c = 1.25; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const PURPLE = [120, 9, 172], HI = [180, 75, 225];
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
// PRNG determinístico (mulberry32): pulsos variados, mas sem "aleatoriedade solta".
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

const LAYERS = [2, 3, 4, 5]; // nós por camada, da interna (junto ao rótulo) para a externa

function sprite(size, stops) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), r = size / 2, grd = g.createRadialGradient(r, r, 0, r, r, r);
  stops.forEach(([o, col]) => grd.addColorStop(o, col));
  g.fillStyle = grd; g.fillRect(0, 0, size, size);
  return c;
}

export function initConnectGraph() {
  const host = document.querySelector('.network-transition');
  const canvas = host && host.querySelector('.net-canvas');
  const label = host && host.querySelector(':scope > span');
  if (!canvas || !label || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const glow = sprite(64, [[0, 'rgba(214,150,255,.9)'], [0.25, 'rgba(169,62,224,.45)'], [1, 'rgba(120,9,172,0)']]);
  const spark = sprite(32, [[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(225,180,255,.85)'], [1, 'rgba(169,62,224,0)']]);

  // ---------- grafo (topologia fixa; posições calculadas no layout)
  const nodes = [], edges = [], antennas = [];
  for (let side = 0; side < 2; side++) {
    const port = { side, layer: -1, idx: 0, port: true, flash: 0 };
    nodes.push(port);
    const layerIds = [];
    LAYERS.forEach((n, k) => {
      layerIds[k] = [];
      for (let j = 0; j < n; j++) { layerIds[k].push(nodes.length); nodes.push({ side, layer: k, idx: j, n, phase: (side * 7 + k * 3 + j) * 1.7 }); }
    });
    const portId = nodes.indexOf(port);
    layerIds[0].forEach((id) => edges.push({ a: id, b: portId, order: 3 }));
    for (let k = 0; k < LAYERS.length - 1; k++) {
      layerIds[k + 1].forEach((outer) => layerIds[k].forEach((inner) => {
        const to = (x) => (nodes[x].n > 1 ? (nodes[x].idx / (nodes[x].n - 1)) * 2 - 1 : 0);
        if (Math.abs(to(outer) - to(inner)) <= 0.75) edges.push({ a: outer, b: inner, order: LAYERS.length - 2 - k });
      }));
      // todo nó precisa de um caminho até o rótulo: sem ligação para dentro, liga ao interno mais próximo
      const to = (x) => (nodes[x].n > 1 ? (nodes[x].idx / (nodes[x].n - 1)) * 2 - 1 : 0);
      layerIds[k + 1].forEach((outer) => {
        if (edges.some((e) => e.a === outer)) return;
        const near = layerIds[k].slice().sort((p, q) => Math.abs(to(p) - to(outer)) - Math.abs(to(q) - to(outer)));
        near.slice(0, 2).forEach((inner) => edges.push({ a: outer, b: inner, order: LAYERS.length - 2 - k }));
      });
    }
    layerIds[LAYERS.length - 1].forEach((id, j) => { if (j % 2 === 0) antennas.push({ a: id }); });
  }
  const outerIds = nodes.map((n, i) => (n.layer === LAYERS.length - 1 ? i : -1)).filter((i) => i >= 0);
  // caminho para dentro: de cada nó, as ligações que levam à camada mais interna
  const inward = nodes.map((_, i) => edges.filter((e) => e.a === i));
  edges.forEach((e, i) => { e.id = i; e.glow = 0; e.t0 = 0; });

  // ---------- layout
  let W = 0, H = 0, dpr = 1, horizontal = true;
  const layout = () => {
    const box = canvas.getBoundingClientRect(), lb = label.getBoundingClientRect();
    W = Math.max(1, box.width); H = Math.max(1, box.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = lb.left + lb.width / 2 - box.left, cy = lb.top + lb.height / 2 - box.top;
    horizontal = W / 2 - lb.width / 2 > 230;
    const half = (horizontal ? lb.width : lb.height) / 2 + 2;
    const reach = (horizontal ? W / 2 : H / 2) - half - (horizontal ? 70 : 34);
    const spread = horizontal ? Math.min(H * 0.4, 118) : Math.min(W * 0.42, 150);
    const us = [0.16, 0.42, 0.7, 1];
    const N = nodes.length;
    nodes.forEach((n, i) => {
      const s = n.side ? 1 : -1;
      let u = 0, v = 0;
      if (!n.port) {
        const t = n.n > 1 ? (n.idx / (n.n - 1)) * 2 - 1 : 0;
        v = t * spread * (0.42 + 0.58 * (n.layer / (LAYERS.length - 1)));
        u = us[n.layer] * reach - Math.abs(t) * 18 * (n.layer + 1) / LAYERS.length; // camadas levemente curvas (lente)
      }
      const a = s * (half + u);
      n.ex = horizontal ? cx + a : cx + v; n.ey = horizontal ? cy + v : cy + a;
      const r = Math.sqrt((i + 0.5) / N), th = i * GOLDEN + 0.4;
      n.sx = cx + Math.cos(th) * r * W * 0.47; n.sy = cy + Math.sin(th) * r * H * 0.46;
      n.ox = n.ox || 0; n.oy = n.oy || 0;
    });
    antennas.forEach((an) => {
      const n = nodes[an.a], s = n.side ? 1 : -1;
      const len = horizontal ? Math.min(90, (W / 2) - Math.abs(n.ex - cx) - 4) : Math.min(60, (H / 2) - Math.abs(n.ey - cy) - 4);
      const tilt = (n.n > 1 ? (n.idx / (n.n - 1)) * 2 - 1 : 0) * 0.35;
      an.dx = horizontal ? s * len : tilt * len; an.dy = horizontal ? tilt * len : s * len;
    });
  };

  // ---------- estado de animação
  const T_LINK = 2.35, T_END = 3.4;
  let t0 = 0, started = reduced, introDone = reduced, visible = false, raf = 0, last = 0;
  let mx = null, my = null;
  const pulses = []; const rand = rng(1979); let nextPulse = 0;
  if (reduced) host.classList.add('is-linked');

  const nodeAt = (n, t) => {
    if (n.port) return [n.ex, n.ey, 1];
    const d = 0.09 * (LAYERS.length - 1 - n.layer) + 0.03 * n.idx;
    const p = clamp((t - d) / 1.15);
    const e = easeBack(p);
    return [n.sx + (n.ex - n.sx) * e + n.ox, n.sy + (n.ey - n.sy) * e + n.oy, easeOut(p)];
  };
  const edgeT0 = (e) => 1.05 + e.order * 0.28 + ((e.a * 37 + e.b * 11) % 7) * 0.025;

  function spawnPulse(now) {
    let id = outerIds[Math.floor(rand() * outerIds.length)];
    const path = [];
    while (inward[id].length) { const opts = inward[id]; const e = opts[Math.floor(rand() * opts.length)]; path.push(e); id = e.b; }
    pulses.push({ path, seg: 0, f: 0, speed: 210 + rand() * 120 });
  }

  function frame(now) {
    raf = 0;
    const t = reduced ? Infinity : started ? (now - t0) / 1000 : 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now;
    if (!reduced && started && !introDone && t > T_LINK) host.classList.add('is-linked');
    if (!introDone && t > T_END) introDone = true;

    // inclinação suave em direção ao cursor
    nodes.forEach((n) => {
      if (n.port) return;
      let tx = 0, ty = 0;
      if (mx !== null && introDone) { const dx = mx - n.ex, dy = my - n.ey, d = Math.hypot(dx, dy), pull = Math.max(0, 1 - d / 150); if (d > 0) { tx = dx / d * 7 * pull; ty = dy / d * 7 * pull; } }
      n.ox += (tx - n.ox) * 0.12; n.oy += (ty - n.oy) * 0.12;
    });
    const P = nodes.map((n) => nodeAt(n, t));

    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';

    // ligações
    edges.forEach((e) => {
      const f = easeOut(clamp((t - edgeT0(e)) / 0.5));
      if (!f) return;
      const [ax, ay] = P[e.a], [bx, by] = P[e.b];
      const hx = ax + (bx - ax) * f, hy = ay + (by - ay) * f;
      e.glow = Math.max(0, e.glow - dt * 1.6);
      ctx.strokeStyle = rgba(e.glow > 0 ? HI : PURPLE, 0.46 + 0.5 * e.glow);
      ctx.lineWidth = 1 + e.glow * 0.8;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(hx, hy); ctx.stroke();
      if (f < 1) ctx.drawImage(spark, hx - 9, hy - 9, 18, 18);
    });

    // antenas (expansão para as bordas, depois que o rótulo acende)
    antennas.forEach((an) => {
      const g = easeOut(clamp((t - (T_LINK + 0.15)) / 0.8));
      if (!g) return;
      const [ax, ay] = P[an.a];
      const bx = ax + an.dx * g, by = ay + an.dy * g;
      const grd = ctx.createLinearGradient(ax, ay, bx, by);
      grd.addColorStop(0, rgba(PURPLE, 0.45)); grd.addColorStop(1, rgba(PURPLE, 0));
      ctx.strokeStyle = grd; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
    });

    // cursor: ligações temporárias com os nós próximos
    if (mx !== null && introDone) {
      nodes.forEach((n, i) => {
        if (n.port) return;
        const d = Math.hypot(P[i][0] - mx, P[i][1] - my);
        if (d < 150) { ctx.strokeStyle = rgba(HI, (1 - d / 150) * 0.55); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(P[i][0], P[i][1]); ctx.stroke(); }
      });
      ctx.drawImage(glow, mx - 14, my - 14, 28, 28);
    }

    // pulsos de dados até o rótulo
    if (introDone && !reduced) {
      if (now >= nextPulse && pulses.length < (horizontal ? 9 : 5)) { spawnPulse(now); nextPulse = now + (mx !== null ? 160 : 420) + rand() * 260; }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k], e = p.path[p.seg];
        const [ax, ay] = P[e.a], [bx, by] = P[e.b];
        const len = Math.max(1, Math.hypot(bx - ax, by - ay));
        p.f += (p.speed * dt) / len;
        if (p.f >= 1) {
          e.glow = 1; p.seg++; p.f = 0;
          if (p.seg >= p.path.length) { nodes[e.b].flash = 1; pulses.splice(k, 1); continue; }
          continue;
        }
        const x = ax + (bx - ax) * p.f, y = ay + (by - ay) * p.f;
        // rastro de luz atrás do pulso
        const back = Math.min(p.f * len, 34) / len, tx = ax + (bx - ax) * (p.f - back), ty = ay + (by - ay) * (p.f - back);
        const tr = ctx.createLinearGradient(tx, ty, x, y);
        tr.addColorStop(0, rgba(HI, 0)); tr.addColorStop(1, 'rgba(235,205,255,.9)');
        ctx.strokeStyle = tr; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        ctx.drawImage(spark, x - 8, y - 8, 16, 16);
      }
    }

    // nós
    const time = now / 1000;
    nodes.forEach((n, i) => {
      const [x, y, a] = P[i];
      if (n.port) {
        const on = clamp((t - (T_LINK - 0.1)) / 0.3);
        if (!on) return;
        n.flash = Math.max(0, (n.flash || 0) - dt * 1.8);
        if (n.flash > 0) { ctx.strokeStyle = rgba(HI, n.flash * 0.8); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, 4 + (1 - n.flash) * 14, 0, TAU); ctx.stroke(); }
        ctx.globalAlpha = on; ctx.drawImage(glow, x - 12, y - 12, 24, 24);
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
        return;
      }
      if (!a) return;
      const breathe = introDone && !reduced ? 1 + 0.14 * Math.sin(time * 1.7 + n.phase) : 1;
      const near = mx !== null && introDone ? Math.max(0, 1 - Math.hypot(x - mx, y - my) / 150) : 0;
      const r = (n.layer === LAYERS.length - 1 ? 3.2 : 3.8) * breathe * (1 + near * 0.35);
      ctx.globalAlpha = a * (0.55 + near * 0.45);
      ctx.drawImage(glow, x - r * 4, y - r * 4, r * 8, r * 8);
      ctx.globalAlpha = a;
      ctx.fillStyle = near > 0.2 ? rgba(HI, 1) : rgba(PURPLE, 1);
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.globalAlpha = 1;
    });

    schedule();
  }

  const schedule = () => { if (!raf && visible && !reduced && started) raf = requestAnimationFrame(frame); };
  const drawStatic = () => { if (!raf) raf = requestAnimationFrame(frame); };

  layout();
  if (reduced) drawStatic();

  new IntersectionObserver((entries) => {
    visible = entries.some((en) => en.isIntersecting);
    if (visible && !started && entries.some((en) => en.intersectionRatio >= 0.35)) { layout(); started = true; t0 = performance.now(); }
    schedule();
  }, { threshold: [0, 0.35] }).observe(host);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; } else schedule(); });
  new ResizeObserver(() => { layout(); if (reduced) drawStatic(); }).observe(host);

  if (fine && !reduced) {
    host.addEventListener('pointermove', (ev) => { const b = canvas.getBoundingClientRect(); mx = ev.clientX - b.left; my = ev.clientY - b.top; });
    host.addEventListener('pointerleave', () => { mx = my = null; });
  }
}
