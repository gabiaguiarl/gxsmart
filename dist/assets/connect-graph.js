/* "Ideias conectadas" — geometric connection graph (Etapa B).
   Points start on a golden-angle (sunflower) distribution, travel to a symmetric lattice around the
   label, then edges draw outward from the label ("the solution") to the edges ("expansion").
   Plain SVG + requestAnimationFrame; plays once on entering the viewport; layout is recomputed from the
   real box size, so desktop is horizontal and narrow screens switch to a vertical arrangement.
   prefers-reduced-motion: final state rendered immediately. Fine pointer: nodes lean gently to the cursor. */
const NS = 'http://www.w3.org/2000/svg';
const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeBack = (t) => { const c = 1.15; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

// One side of the lattice in a local frame: u = distance from the label edge, v = offset from the axis.
// Nodes: 0,1 inner pair · 2,3 outer pair · 4 tip. Edges carry a depth (0 = touches the label).
const SIDE_NODES = [[0.26, -0.5], [0.26, 0.5], [0.6, -1], [0.6, 1], [0.92, 0]];
const SIDE_EDGES = [['P', 0, 0], ['P', 1, 0], [0, 1, 1], [0, 2, 1], [1, 3, 1], [0, 3, 2], [1, 2, 2], [2, 4, 3], [3, 4, 3], [4, 'E', 4]];

export function initConnectGraph() {
  const host = document.querySelector('.network-transition');
  const svg = host && host.querySelector('.net-graph');
  const label = host && host.querySelector(':scope > span');
  if (!svg || !label) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const mk = (tag, cls) => { const el = document.createElementNS(NS, tag); el.setAttribute('class', cls); return el; };
  const edgesG = mk('g', 'ng-edges'), nodesG = mk('g', 'ng-nodes');
  svg.append(edgesG, nodesG);
  const nodes = []; // {el, sx, sy, ex, ey, x, y, ox, oy, port}
  const edges = []; // {el, a, b, depth}
  for (let side = 0; side < 2; side++) {
    const base = nodes.length;
    const port = { el: mk('circle', 'ng-port'), port: true };
    port.el.setAttribute('r', '3');
    nodes.push(port);
    SIDE_NODES.forEach(() => { const n = { el: mk('circle', 'ng-node') }; n.el.setAttribute('r', '4'); nodes.push(n); });
    const end = { el: null, end: true };
    nodes.push(end);
    const id = (k) => (k === 'P' ? base : k === 'E' ? base + 6 : base + 1 + k);
    SIDE_EDGES.forEach(([a, b, depth]) => edges.push({ el: mk('line', 'ng-edge'), a: id(a), b: id(b), depth }));
  }
  edges.forEach((e) => edgesG.append(e.el));
  nodes.forEach((n) => n.el && nodesG.append(n.el));

  let W = 0, H = 0;
  const layout = () => {
    const box = svg.getBoundingClientRect(), lb = label.getBoundingClientRect();
    W = Math.max(1, box.width); H = Math.max(1, box.height);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const cx = lb.left + lb.width / 2 - box.left, cy = lb.top + lb.height / 2 - box.top;
    // Horizontal when there is room beside the label, otherwise above/below it.
    const horizontal = W / 2 - lb.width / 2 > 150;
    const half = horizontal ? lb.width / 2 : lb.height / 2;
    const reach = (horizontal ? W / 2 : H / 2) - half - 6;
    const spread = horizontal ? Math.min(H * 0.38, 74) : Math.min(W * 0.36, 120);
    const N = nodes.length;
    nodes.forEach((n, i) => {
      const side = i < 7 ? -1 : 1, k = i % 7;
      let u, v;
      if (n.port) { u = 0; v = 0; } else if (n.end) { u = reach + 6; v = 0; } else { [u, v] = SIDE_NODES[k - 1]; u *= reach; v *= spread; }
      const a = side * (half + u);
      n.ex = Math.round(horizontal ? cx + a : cx + v) + 0.5; n.ey = Math.round(horizontal ? cy + v : cy + a) + 0.5;
      // Sunflower start: deterministic, evenly spread, never random.
      const r = Math.sqrt((i + 0.5) / N), th = i * GOLDEN + 0.6;
      n.sx = cx + Math.cos(th) * r * W * 0.46; n.sy = cy + Math.sin(th) * r * H * 0.44;
      n.ox = n.ox || 0; n.oy = n.oy || 0;
    });
  };

  const draw = (t) => { // t in seconds from intro start; Infinity = final
    nodes.forEach((n, i) => {
      const p = n.port || n.end ? 1 : easeBack(clamp((t - 0.04 * i) / 1.25));
      const q = n.port || n.end ? 1 : easeInOut(clamp((t - 0.04 * i) / 1.25));
      n.x = n.sx + (n.ex - n.sx) * (n.port || n.end ? 1 : p) + n.ox;
      n.y = n.sy + (n.ey - n.sy) * (n.port || n.end ? 1 : p) + n.oy;
      if (n.el) {
        n.el.setAttribute('cx', n.x.toFixed(1)); n.el.setAttribute('cy', n.y.toFixed(1));
        n.el.style.opacity = n.port ? clamp((t - 1.0) / 0.4) : 0.35 + 0.65 * q;
      }
    });
    edges.forEach((e) => {
      const f = easeOut(clamp((t - 0.95 - e.depth * 0.18) / 0.55));
      const a = nodes[e.a], b = nodes[e.b];
      e.el.setAttribute('x1', a.x.toFixed(1)); e.el.setAttribute('y1', a.y.toFixed(1));
      e.el.setAttribute('x2', (a.x + (b.x - a.x) * f).toFixed(1)); e.el.setAttribute('y2', (a.y + (b.y - a.y) * f).toFixed(1));
      e.el.style.opacity = f ? 1 : 0;
    });
  };

  layout();
  draw(reduced ? Infinity : 0);
  let done = reduced;
  if (reduced) host.classList.add('is-linked');
  else {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((en) => en.isIntersecting)) return;
      io.disconnect();
      layout();
      const t0 = performance.now();
      const step = (now) => {
        const t = (now - t0) / 1000;
        draw(t);
        if (t > 1.9) host.classList.add('is-linked');
        if (t < 2.4) requestAnimationFrame(step); else { done = true; draw(Infinity); }
      };
      requestAnimationFrame(step);
    }, { threshold: 0.45 });
    io.observe(host);
  }

  // Keep the structure true to the box on resize (after the intro it is simply redrawn).
  new ResizeObserver(() => { layout(); if (done) draw(Infinity); }).observe(host);

  // Micro-interaction: nearby nodes lean toward the pointer (max ~6px), easing back on leave.
  if (fine && !reduced) {
    let mx = null, my = null, raf = 0;
    const tick = () => {
      let moving = false;
      nodes.forEach((n) => {
        if (n.port || n.end) return;
        let tx = 0, ty = 0;
        if (mx !== null) {
          const dx = mx - n.ex, dy = my - n.ey, d = Math.hypot(dx, dy), pull = Math.max(0, 1 - d / 140);
          if (d > 0) { tx = (dx / d) * 6 * pull; ty = (dy / d) * 6 * pull; }
        }
        n.ox += (tx - n.ox) * 0.15; n.oy += (ty - n.oy) * 0.15;
        if (Math.abs(tx - n.ox) > 0.05 || Math.abs(ty - n.oy) > 0.05) moving = true;
      });
      draw(Infinity);
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (done && !raf) raf = requestAnimationFrame(tick); };
    host.addEventListener('pointermove', (ev) => { const b = svg.getBoundingClientRect(); mx = ev.clientX - b.left; my = ev.clientY - b.top; kick(); });
    host.addEventListener('pointerleave', () => { mx = my = null; kick(); });
  }
}
