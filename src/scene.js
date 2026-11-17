import * as THREE from 'three';
import { bus } from './motion/bus.js';
import { GX_SHAPES } from './brand/gx-mark.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// GX 3D language (Refinamento 4.0)
// ─ mountBrand(): ONE WebGL context carries the 3D GX symbol between its hosts
//   (hero → manifesto → CTA). The canvas moves to whichever host has the
//   largest visible area, so the mark literally travels with the narrative and the
//   page never holds more than one brand context.
// ─ mountScene({kind:'services'}): the services stage keeps its own small context.
// Both share the procedural environment (black chrome + purple reflections),
// render only while visible, cap pixel ratio and dispose everything on cleanup.

const PURPLE = 0x7809ac;
const clamp01 = (t) => Math.min(Math.max(t, 0), 1);
const easeOut = (t) => 1 - Math.pow(1 - clamp01(t), 3);

export function createEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.BoxGeometry(12, 12, 12), new THREE.MeshBasicMaterial({ color: 0x030304, side: THREE.BackSide })));
  const panel = (w, h, color, k, pos, rot) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.rotation.set(...rot); env.add(m);
  };
  panel(7, 4, PURPLE, 4, [-5, 0.5, 0], [0, Math.PI / 2, 0]); // large purple softbox
  panel(5, 0.7, 0xffffff, 5, [0, 5, 0], [Math.PI / 2, 0, 0]); // white top strip
  panel(0.6, 6, PURPLE, 7, [5, 0, 1.5], [0, -Math.PI / 2, 0]); // hard purple rim
  panel(3, 0.35, 0xffffff, 2.5, [1.5, -1.2, 5], [0, Math.PI, 0]); // front kicker
  const texture = pmrem.fromScene(env, 0.035).texture;
  env.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
  pmrem.dispose();
  return texture;
}

export function createRenderer(maxDpr) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
  renderer.setClearColor(0x050505, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  return renderer;
}

// Extruded official symbol: polished dark-chrome sides catch the purple env,
// slightly satin front face keeps the silhouette readable; a purple contour line
// sits on the front face as the brand accent.
function buildGX(track) {
  const shapes = GX_SHAPES.map(({ outer, holes }) => {
    const shape = new THREE.Shape(outer.map(([x, y]) => new THREE.Vector2(x, y)));
    holes.forEach((h) => shape.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y)))));
    return shape;
  });
  const depth = 0.24, bevel = 0.035;
  const geo = track(new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: 0.022, bevelSegments: 5, curveSegments: 1 }));
  geo.center();
  const face = track(new THREE.MeshPhysicalMaterial({ color: 0x110d17, metalness: 1, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.18, envMapIntensity: 1.9 }));
  const side = track(new THREE.MeshPhysicalMaterial({ color: 0x0b0a0f, metalness: 1, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.14, envMapIntensity: 2 }));
  const mesh = new THREE.Mesh(geo, [face, side]);
  const group = new THREE.Group();
  group.add(mesh);
  const lineMat = track(new THREE.LineBasicMaterial({ color: 0xb04de0, transparent: true, opacity: 0.9 }));
  GX_SHAPES.forEach(({ outer, holes }) => [outer, ...holes].forEach((poly) => {
    const g = track(new THREE.BufferGeometry().setFromPoints(poly.map(([x, y]) => new THREE.Vector3(x, y, 0))));
    const line = new THREE.LineLoop(g, lineMat);
    line.position.z = depth / 2 + bevel + 0.003;
    group.add(line);
  }));
  return { group, lineMat };
}

export function lightRig(scene) {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a0624, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(-3, 5, 4); scene.add(key);
  const violet = new THREE.PointLight(PURPLE, 40, 20, 1.6); violet.position.set(4, -1, 3); scene.add(violet);
  const rim = new THREE.DirectionalLight(0xd9b3ff, 2.4); rim.position.set(1, 1, -4); scene.add(rim);
  return { key, violet, rim };
}

/* ───────────────────────── Brand: the travelling GX ───────────────────────── */
const PRESETS = {
  hero: { camZ: 10, size: 2.7 },
  product: { camZ: 8.5, size: 1 },
  orbital: { camZ: 10.5, size: 1.25 },
  cta: { camZ: 6, size: 1.55 },
};

export function mountBrand(hosts) {
  hosts = hosts.filter((h) => h.el);
  if (!hosts.length) return () => {};
  let renderer;
  try { renderer = createRenderer(1.75); } catch { return () => {}; }
  const scene = new THREE.Scene();
  const disposables = [];
  const track = (x) => { disposables.push(x); return x; };
  scene.environment = track(createEnvironment(renderer));
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  const { key, violet } = lightRig(scene);

  const root = new THREE.Group(); scene.add(root); // preset transforms
  const { group: gx, lineMat } = buildGX(track);
  root.add(gx);
  const purple = track(new THREE.MeshStandardMaterial({ color: PURPLE, emissive: PURPLE, emissiveIntensity: 0.9, metalness: 0.4, roughness: 0.3 }));
  const metal = track(new THREE.MeshPhysicalMaterial({ color: 0x0b0a0f, metalness: 1, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.7 }));
  const mesh = (geometry, material, parent) => { track(geometry); const m = new THREE.Mesh(geometry, material); parent.add(m); return m; };

  // Hero extras: orbit ring, satellite, depth dust.
  const heroExtras = new THREE.Group(); root.add(heroExtras);
  // Extras live inside `root`, which is scaled by the preset size (GX height = 1 unit).
  const orbit = mesh(new THREE.TorusGeometry(1.02, 0.0045, 8, 180), purple, heroExtras); orbit.rotation.set(1.2, 0.35, 0);
  const satellite = mesh(new THREE.IcosahedronGeometry(0.03, 0), purple, heroExtras);
  const count = 480, pos = new Float32Array(count * 3), col = new Float32Array(count * 3);
  const c1 = new THREE.Color(PURPLE), c2 = new THREE.Color(0xffffff);
  for (let i = 0; i < count; i++) {
    const r = 3.4 + Math.random() * 4, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t) * 0.7, r * Math.cos(p) - 1], i * 3);
    (Math.random() > 0.78 ? c2 : c1).toArray(col, i * 3);
  }
  const dustGeo = track(new THREE.BufferGeometry());
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dustGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const dustMat = track(new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending }));
  const dust = new THREE.Points(dustGeo, dustMat); scene.add(dust);

  // Manifesto extras: three metal rings orbiting the mark.
  const rings = new THREE.Group(); root.add(rings);
  const ringList = [0, 1, 2].map((i) => {
    const ring = new THREE.Group(); ring.rotation.set(i * 0.9, 0.6 + i * 0.65, i * 0.5); rings.add(ring);
    mesh(new THREE.TorusGeometry(2 - i * 0.22, 0.15, 24, 140), metal, ring);
    mesh(new THREE.TorusGeometry(2 - i * 0.22, 0.02, 8, 140), purple, ring).position.z = 0.15;
    return ring;
  });

  // CTA extras: two thin rings.
  const ctaRings = new THREE.Group(); root.add(ctaRings);
  const ringA = mesh(new THREE.TorusGeometry(0.95, 0.006, 6, 120), purple, ctaRings); ringA.rotation.x = 1.1;
  const ringB = mesh(new THREE.TorusGeometry(1.1, 0.005, 6, 120), purple, ctaRings); ringB.rotation.y = 1.2;

  // Nature: a soft green rim so the mark sits inside the forest light.

  // Commercial call (5.0): a generic premium package — never a client's product.
  const product = new THREE.Group(); scene.add(product); product.visible = false;
  const pBody = new THREE.Group(); product.add(pBody);
  const satin = track(new THREE.MeshPhysicalMaterial({ color: 0x17141c, metalness: 0.7, roughness: 0.36, clearcoat: 1, clearcoatRoughness: 0.25, envMapIntensity: 1.5 }));
  const label = track(new THREE.MeshStandardMaterial({ color: 0xf1ecf6, roughness: 0.5, emissive: 0x2a2530, emissiveIntensity: 0.4 }));
  mesh(track(new RoundedBoxGeometry(1.05, 1.5, 0.62, 5, 0.09)), satin, pBody);
  mesh(track(new RoundedBoxGeometry(1.07, 0.22, 0.64, 3, 0.04)), purple, pBody).position.y = -0.2;
  mesh(track(new RoundedBoxGeometry(1.08, 0.05, 0.65, 2, 0.02)), metal, pBody).position.y = 0.52;
  const lbl = mesh(track(new THREE.PlaneGeometry(0.5, 0.26)), label, pBody); lbl.position.set(0, 0.2, 0.312);
  const pRings = new THREE.Group(); product.add(pRings);
  const pr1 = mesh(new THREE.TorusGeometry(1.35, 0.01, 8, 160), purple, pRings); pr1.rotation.x = 1.25;
  const pr2 = mesh(new THREE.TorusGeometry(1.65, 0.006, 8, 160), purple, pRings); pr2.rotation.set(1.1, 0.5, 0);
  // Trajectory (closed loop) + a fading light trail behind the product.
  const path = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1.5, 0.9, 0.6), new THREE.Vector3(-0.2, 1.7, -0.5), new THREE.Vector3(1.6, 0.6, 0.3), new THREE.Vector3(0.8, -1.0, 0.8)], true, 'catmullrom', 0.5);
  const TRAIL = 70, trailPos = new Float32Array(TRAIL * 3);
  const trailGeo = track(new THREE.BufferGeometry()); trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  const trailMat = track(new THREE.LineBasicMaterial({ color: 0xb04de0, transparent: true, opacity: 0 }));
  const trail = new THREE.Line(trailGeo, trailMat); scene.add(trail);

  // ── Host management ──
  const areas = new Map(hosts.map((h) => [h.el, 0]));
  let active = null, arrive = 1, snap = false;
  const resize = () => {
    if (!active) return;
    const { width, height } = active.el.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const fallbackOf = (h) => (typeof h.fallback === 'string' ? document.querySelector(h.fallback) : h.fallback);
  const activate = (h) => {
    if (active === h) return;
    if (active) { const f = fallbackOf(active); if (f) f.style.opacity = '1'; active.el.classList.remove('is-live'); }
    active = h;
    h.el.appendChild(renderer.domElement);
    arrive = 0; // the mark "arrives" in every new host
    snap = true; // first frame jumps to the new preset's pose (no sweep from the old host)
    const p = PRESETS[h.preset];
    camera.position.set(0, 0, p.camZ);
    heroExtras.visible = h.preset === 'hero'; dust.visible = h.preset === 'hero';
    product.visible = trail.visible = h.preset === 'product'; root.visible = h.preset !== 'product';
    rings.visible = h.preset === 'orbital';
    ctaRings.visible = h.preset === 'cta';
    key.color.set(0xffffff);
    resize();
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => areas.set(e.target, e.isIntersecting ? e.intersectionRect.width * e.intersectionRect.height : 0));
    let best = null, bestArea = 0;
    hosts.forEach((h) => { const a = areas.get(h.el); if (a > bestArea) { bestArea = a; best = h; } });
    visible = bestArea > 0;
    if (best) activate(best);
    if (visible) resume(); else { cancelAnimationFrame(frame); frame = 0; }
  }, { threshold: [0, 0.05, 0.15, 0.3, 0.5, 0.7, 0.9, 1] });
  hosts.forEach((h) => io.observe(h.el));
  const ro = new ResizeObserver(resize); hosts.forEach((h) => ro.observe(h.el));

  let visible = false, alive = true, frame = 0, time = 0, last = 0;
  const p = bus.pointer;
  function render(now) {
    frame = 0;
    if (!alive || !visible || !active || document.hidden) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0; last = now; time += dt;
    arrive = Math.min(1, arrive + dt * 1.1);
    const a = easeOut(arrive), preset = active.preset, size = PRESETS[preset].size;
    // Frame-rate independent smoothing: t is the per-frame factor at 60 fps.
    const lerp = (x, y, t) => (snap ? y : x + (y - x) * (1 - Math.pow(1 - t, dt * 60)));
    key.position.x = lerp(key.position.x, -3 + p.x * 6, 0.05);
    violet.position.set(Math.cos(time * 0.5) * 4.5, Math.sin(time * 0.35) * 2.2, 3);
    const sway = Math.sin(time * 0.35) * 0.22; // the mark turns gently, never spins wildly

    if (preset === 'hero') {
      const h = bus.hero, e = easeOut(h.intro) * a;
      root.scale.setScalar(size * (0.55 + 0.45 * e));
      root.rotation.x = lerp(root.rotation.x, 0.08 + p.y * 0.35 + h.rotX, 0.06);
      root.rotation.y = lerp(root.rotation.y, -0.28 + sway + p.x * 0.55 + h.rotY - (1 - e) * 1.2, 0.06);
      root.rotation.z = lerp(root.rotation.z, -0.04 + p.x * 0.05, 0.05);
      root.position.x = lerp(root.position.x, h.x + 0.7, 0.1);
      root.position.y = lerp(root.position.y, 0, 0.1);
      camera.position.z = lerp(camera.position.z, PRESETS.hero.camZ - h.camZ, 0.1);
      orbit.rotation.z = time * 0.12;
      satellite.position.set(Math.cos(time * 0.6) * 1.02, Math.sin(time * 0.6) * 0.4, Math.sin(time * 0.6) * 0.85);
      dust.rotation.y = time * 0.02 + p.x * 0.15;
      dustMat.opacity = 0.75 * e;
      violet.intensity = 40 + h.glow * 60;
    } else if (preset === 'product') {
      // Stopped → spinning → travelling along the loop; rings and trail appear with it.
      const pr = bus.product;
      pBody.rotation.y += dt * (0.05 + pr.spin * 3.4);
      pBody.rotation.x = lerp(pBody.rotation.x, Math.sin(time * 1.3) * 0.12 * pr.spin + p.y * 0.2, 0.08);
      pBody.rotation.z = lerp(pBody.rotation.z, -p.x * 0.15, 0.08);
      const at = path.getPointAt(((pr.path % 1) + 1) % 1);
      product.position.set(lerp(product.position.x, at.x * pr.travel, 0.15), lerp(product.position.y, at.y * pr.travel, 0.15), lerp(product.position.z, at.z * pr.travel, 0.15));
      product.scale.setScalar(1.5 * (0.9 + 0.1 * a));
      pRings.scale.setScalar(Math.max(0.001, pr.rings)); pr1.rotation.z += dt * (0.4 + pr.spin * 2); pr2.rotation.z -= dt * (0.3 + pr.spin * 1.4);
      trailPos.copyWithin(3, 0, (TRAIL - 1) * 3); trailPos[0] = product.position.x; trailPos[1] = product.position.y; trailPos[2] = product.position.z;
      if (snap) for (let i = 1; i < TRAIL; i++) trailPos.set([product.position.x, product.position.y, product.position.z], i * 3);
      trailGeo.attributes.position.needsUpdate = true;
      trailMat.opacity = 0.85 * pr.travel;
      camera.position.z = lerp(camera.position.z, PRESETS.product.camZ - pr.spin * 0.6, 0.08);
      violet.intensity = 30 + pr.spin * 50;
    } else if (preset === 'orbital') {
      const o = bus.orbital;
      root.scale.setScalar(lerp(root.scale.x, o.scale * (0.8 + 0.2 * a), 0.12));
      root.position.set(lerp(root.position.x, o.x, 0.12), lerp(root.position.y, o.y, 0.12), 0);
      root.rotation.x = lerp(root.rotation.x, o.rotX * 0.4 + p.y * 0.3, 0.08);
      root.rotation.y = lerp(root.rotation.y, o.rotY + p.x * 0.4, 0.08);
      root.rotation.z = 0;
      gx.scale.setScalar(size);
      gx.rotation.y = Math.sin(time * 0.4) * 0.3 + o.spin * 2;
      ringList.forEach((r, i) => { r.rotation.z += dt * (0.08 + i * 0.05) * (1 + o.spin * 6); });
      camera.position.z = PRESETS.orbital.camZ;
      violet.intensity = 50;
    } else if (preset === 'cta') {
      const c = bus.cta, k = c.proximity;
      root.scale.setScalar(lerp(root.scale.x, size * (0.85 + 0.15 * a) * (1 + k * 0.22 + c.press * 0.15), 0.12));
      root.rotation.y = lerp(root.rotation.y, -0.3 + sway * 0.6 + p.x * 1.1 + k * Math.sin(time * 1.4) * 0.35, 0.08);
      root.rotation.x = lerp(root.rotation.x, p.y * 0.8, 0.08);
      root.rotation.z = 0; root.position.set(0, 0, 0);
      ringA.rotation.z += dt * (0.3 + k * 2) / 1.55;
      ringB.rotation.z -= dt * (0.25 + k * 1.6) / 1.55;
      purple.emissiveIntensity = 0.9 + k * 1.6;
      lineMat.opacity = 0.6 + k * 0.4;
      violet.intensity = 40 + k * 80;
      camera.position.z = PRESETS.cta.camZ;
    }
    if (preset !== 'orbital') { gx.scale.setScalar(1); gx.rotation.set(0, 0, 0); }
    if (preset !== 'cta') { purple.emissiveIntensity = 0.9; lineMat.opacity = 0.9; }
    snap = false;
    renderer.render(scene, camera);
    const f = fallbackOf(active); if (f) f.style.opacity = '0';
    active.el.classList.add('is-live');
    frame = requestAnimationFrame(render);
  }
  const resume = () => { last = 0; if (alive && visible && !document.hidden && !frame) frame = requestAnimationFrame(render); };
  const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else resume(); };
  document.addEventListener('visibilitychange', onVisibility);
  const lost = (e) => { e.preventDefault(); alive = false; cancelAnimationFrame(frame); hosts.forEach((h) => { const f = fallbackOf(h); if (f) f.style.opacity = '1'; h.el.classList.remove('is-live'); }); };
  renderer.domElement.addEventListener('webglcontextlost', lost);

  return () => {
    alive = false; cancelAnimationFrame(frame);
    io.disconnect(); ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    renderer.domElement.removeEventListener('webglcontextlost', lost);
    disposables.forEach((d) => d.dispose());
    renderer.dispose(); renderer.domElement.remove();
    hosts.forEach((h) => { const f = fallbackOf(h); if (f) f.style.opacity = '1'; h.el.classList.remove('is-live'); });
  };
}
