import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { DUR, EASE, STAGGER, SCRUB, INTRO } from './tokens.js';
import { bus, bindPointer } from './bus.js';
import { splitWords, splitChars, revealHeadings } from './kinetic.js';

gsap.registerPlugin(ScrollTrigger, Flip);

const q = (s, r = document) => r.querySelector(s);
const qa = (s, r = document) => [...r.querySelectorAll(s)];
const endIntro = () => document.documentElement.classList.remove('is-intro');
const motionOK = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Devices that should not run the secondary WebGL scenes (hero + manifesto only).
const isLite = () => (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || /[?&]lite\b/.test(location.search);

/* ───────────────────────── CINEMATIC — opening sequence ───────────────────────── */
function intro() {
  const words = splitWords(q('.hero h1'));
  bus.hero.intro = 0;
  const tl = gsap.timeline({ defaults: { ease: EASE.out } });
  const [bg, gfx, obj, head, sec] = [INTRO.background[0], INTRO.graphics[0], INTRO.object[0], INTRO.headline[0], INTRO.secondary[0]];
  tl.from('.hero-grid', { opacity: 0, duration: 0.6, ease: EASE.soft }, bg)
    .from('.hero-glow', { opacity: 0, scale: 0.5, duration: 1.6, ease: EASE.soft }, bg + 0.15)
    .fromTo('.hero-lines path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, stagger: 0.12, ease: EASE.inOut }, gfx)
    .from('.hero-lines .hl-nodes circle', { scale: 0, transformOrigin: '50% 50%', duration: 0.5, stagger: STAGGER.nodes, ease: EASE.snap }, gfx + 0.45)
    .fromTo('.hero-rings .hr-ring, .hero-rings .hr-arc', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.08, ease: EASE.inOut }, gfx + 0.1)
    .from('.hero-rings .hr-ticks, .hero-rings .hr-nodes, .hero-hud, .coordinate, .art-caption, .hero-orbit', { opacity: 0, duration: 0.7, stagger: 0.06, ease: EASE.soft }, gfx + 0.35)
    .to(bus.hero, { intro: 1, duration: DUR.slow + 0.2, ease: 'power2.out' }, obj)
    .from('.hero .gx-fallback svg', { opacity: 0, scale: 0.8, rotationY: -70, transformPerspective: 900, duration: DUR.slow }, obj)
    .from('.hero .eyebrow', { opacity: 0, x: -24, duration: DUR.base }, head - 0.1)
    .from(words, { yPercent: 140, rotate: 5, duration: 1.05, stagger: STAGGER.words }, head)
    .from('.hero-services a', { opacity: 0, y: 14, duration: 0.55, stagger: 0.06, ease: EASE.soft }, sec)
    .from('.hero-bottom p', { opacity: 0, y: 18, duration: 0.7, ease: EASE.soft }, sec + 0.05)
    .from('.hero-actions > *', { opacity: 0, y: 18, duration: 0.7, stagger: 0.08, ease: EASE.soft }, sec + 0.12)
    .from('.hero-foot', { opacity: 0, duration: 0.6, ease: EASE.soft }, sec + 0.2);
  endIntro(); // initial states are set by GSAP now; the CSS guard is no longer needed
  // Never hold the user: any input fast-forwards the remaining choreography.
  const skip = () => { if (tl.progress() < 1) tl.timeScale(4); };
  const evts = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
  evts.forEach((e) => window.addEventListener(e, skip, { once: true, passive: true }));
  return () => { evts.forEach((e) => window.removeEventListener(e, skip)); bus.hero.intro = 1; };
}

/* ───────────────────────── SCROLL — hero exit / new composition ───────────────────────── */
function heroScroll() {
  const hud = q('.hud-progress b');
  const tl = gsap.timeline({
    defaults: { ease: EASE.scroll },
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: SCRUB.base,
      onUpdate: (s) => { if (hud) hud.textContent = String(Math.round(s.progress * 100)).padStart(3, '0'); },
    },
  });
  qa('.hero h1 > span').forEach((line, i) => tl.to(line, { xPercent: i % 2 ? 16 : -16, opacity: 0, duration: 0.8 }, i * 0.06));
  tl.to('.hero-services, .hero-bottom', { y: -70, opacity: 0, duration: 0.7 }, 0)
    .to(bus.hero, { rotX: 0.5, rotY: -0.9, x: -2.1, camZ: 3.4, glow: 1, duration: 1 }, 0)
    .to('.hero-rings', { rotate: 50, scale: 1.25, opacity: 0.25, duration: 1 }, 0)
    .to('.hero-glow', { xPercent: -30, scale: 1.4, duration: 1 }, 0)
    .to('.hero-lines', { opacity: 0, duration: 0.4 }, 0)
    .fromTo('.hero-marquee span', { xPercent: 25, opacity: 0 }, { xPercent: -40, opacity: 1, duration: 1 }, 0.05);
}

/* ───────────────────────── TRANSITIONS — each boundary is different ───────────────────────── */
function transitions() {
  // 1. Hero → Estúdio: a purple line crosses the screen and settles as a divider.
  const wipe = gsap.timeline({ defaults: { ease: EASE.scroll }, scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'top 35%', scrub: SCRUB.tight } });
  wipe.fromTo('.line-wipe', { xPercent: -100, scaleY: 3 }, { xPercent: 0, duration: 0.7 }).to('.line-wipe', { scaleY: 1, opacity: 0.55, duration: 0.3 });
  // 2. Serviços → Manifesto: a purple circle opens — see manifesto() (desktop only).
  // 3. Natureza → Diferença: dawn — see nature() (white light expands from the leaves).
  // 4. Diferença → Jornada: a technological grid dissolves cell by cell.
  gsap.to('.grid-dissolve i', { opacity: 0, ease: EASE.scroll, stagger: { each: 0.02, from: 'random' }, scrollTrigger: { trigger: '.process', start: 'top 90%', end: 'top 25%', scrub: SCRUB.base } });
  // 5. Network graph under services: see connect-graph.js (plays once on entering the viewport).
}

/* ───────────────────────── SCROLL — content choreography (all widths) ───────────────────────── */
function sections() {
  // Estúdio: paragraphs slide in sequence; the sphere turns with scroll.
  gsap.from('.about-bottom > *', { x: -40, opacity: 0, duration: DUR.base, ease: EASE.out, stagger: STAGGER.lines, scrollTrigger: { trigger: '.about-bottom', start: 'top 85%', toggleActions: 'play none none reverse' } });
  gsap.to('.data-sphere', { rotation: 35, scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: SCRUB.base } });
  // Serviços: cards are dealt in with depth when they enter — never a forced sequence.
  const cards = qa('.sc-card');
  gsap.set(cards, { opacity: 0, y: 40, rotateX: -10, transformPerspective: 900, transformOrigin: '50% 0%' });
  ScrollTrigger.batch(cards, {
    start: 'top 94%',
    onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, rotateX: 0, duration: DUR.base, ease: EASE.out, stagger: 0.06, overwrite: true }),
    onLeaveBack: (b) => gsap.to(b, { opacity: 0, y: 40, rotateX: -10, duration: DUR.fast, ease: EASE.soft, overwrite: true }),
  });
  gsap.from('.sc-stage', { opacity: 0, x: -30, duration: DUR.base, ease: EASE.out, scrollTrigger: { trigger: '.showcase', start: 'top 85%', toggleActions: 'play none none reverse' } });
  gsap.from('.service-extras .extra-card', { opacity: 0, y: 28, duration: DUR.base, ease: EASE.out, stagger: 0.1, scrollTrigger: { trigger: '.service-extras', start: 'top 92%', toggleActions: 'play none none reverse' } });
  // Typographic parallax: lines of these headings drift at different rates.
  // 7.0: typographic parallax removed — headings stay still while being read.
  // Diferença: numbers pop, copy slides.
  qa('.difference article').forEach((a) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: a, start: 'top 88%', toggleActions: 'play none none reverse' } });
    tl.from(a.querySelector('span'), { scale: 0, rotate: -90, duration: DUR.fast, ease: EASE.snap }).from(a.querySelector('div'), { x: 40, opacity: 0, duration: DUR.base, ease: EASE.out }, '<0.1');
  });
  // Jornada: progress line + cube.
  gsap.to('.process-line span', { scaleX: 1, ease: EASE.scroll, scrollTrigger: { trigger: '.process', start: 'top 70%', end: 'bottom 60%', scrub: true } });
  gsap.to('.tech-cube', { rotationY: 160, rotationX: -40, scrollTrigger: { trigger: '.process', start: 'top bottom', end: 'bottom top', scrub: SCRUB.base } });
  qa('.process li').forEach((li) => ScrollTrigger.create({ trigger: li, start: 'top 75%', end: 'bottom 35%', toggleClass: 'is-current' }));
  gsap.from('.process li', { y: 40, opacity: 0, duration: DUR.base, ease: EASE.out, stagger: STAGGER.cards, scrollTrigger: { trigger: '.process ol', start: 'top 88%', toggleActions: 'play none none reverse' } });
  // Contato: the form frame draws in.
  gsap.from('.contact form', { clipPath: 'inset(0 0 100% 0)', duration: DUR.slow, ease: EASE.inOut, scrollTrigger: { trigger: '.contact-grid', start: 'top 85%', toggleActions: 'play none none reverse' } });
  gsap.from('.footer-columns > div', { y: 30, opacity: 0, duration: DUR.base, ease: EASE.out, stagger: STAGGER.lines, scrollTrigger: { trigger: 'footer', start: 'top 90%', toggleActions: 'play none none reverse' } });
}

/* ───────────────────────── PORTFOLIO — coordinated mask reveal + parallax ───────────────────────── */
function portfolio() {
  const projects = qa('.project');
  const frames = projects.map((p) => q('.project-image', p));
  gsap.set(frames, { clipPath: 'inset(100% 0% 0% 0%)' });
  ScrollTrigger.batch(projects, {
    start: 'top 90%',
    onEnter: (b) => {
      gsap.to(b.map((p) => q('.project-image', p)), { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: EASE.inOut, stagger: 0.12, overwrite: true });
      gsap.fromTo(b.map((p) => q('.project-caption', p)), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, stagger: 0.12, delay: 0.35 });
    },
  });
  // Etapa C: logo cards stay centred (no image zoom/parallax); the clip reveal above is the entrance.
}

/* ───────────────────────── CINEMATIC — pinned manifesto (desktop) ─────────────────────────
   "IDEIAS EM MOVIMENTO." becomes "IDEIAS QUE TRANSFORMAM.": IDEIAS stays in place
   (both headings share line 1), EM/MOVIMENTO leave, QUE slides in, the letters of
   TRANSFORMAM. travel to their positions, the composition expands and reorganises. */
function manifesto() {
  const root = q('.manifesto');
  root.classList.add('has-pin');
  const next = q('.story-next h2');
  next.setAttribute('aria-label', 'Ideias que transformam.');
  splitWords(next);
  const chars = splitChars(q('.sn-3 .kw-i', next));
  Object.assign(bus.orbital, { x: 6.5, y: 0.4, rotX: 0.2, rotY: 0, scale: 0.75, spin: 0 });
  // Transition in: a purple circle opens while the section approaches the top.
  gsap.fromTo('.manifesto-light', { clipPath: 'circle(0% at 50% 55%)' }, { clipPath: 'circle(24% at 50% 55%)', ease: EASE.scroll, scrollTrigger: { trigger: root, start: 'top bottom', end: 'top top', scrub: SCRUB.tight } });
  const tl = gsap.timeline({
    defaults: { ease: EASE.scroll },
    scrollTrigger: { trigger: root, start: 'top top', end: '+=100%', scrub: SCRUB.base, pin: '.manifesto-inner', anticipatePin: 1, invalidateOnRefresh: true },
  });
  tl.fromTo('.manifesto-light', { clipPath: 'circle(24% at 50% 55%)' }, { clipPath: 'circle(90% at 50% 55%)', duration: 3 }, 0)
    .fromTo('.manifesto-lines ellipse, .manifesto-lines path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 3.5, stagger: 0.5 }, 0.2)
    .to('.story-track span', { scaleX: 1, duration: 9 }, 0)
    // 1. IDEIAS appears  2. EM travels  3. MOVIMENTO grows
    .from('.kp-1', { yPercent: 135, duration: 1 }, 0)
    .from('.kp-2', { xPercent: 420, opacity: 0, duration: 1.3 }, 0.6)
    .fromTo('.kp-3', { scale: 0.45, opacity: 0.15 }, { scale: 1.08, opacity: 1, duration: 1.7 }, 1.1)
    .from('.story-copy p', { opacity: 0, y: 24, duration: 0.6 }, 2.3)
    // 4. The GX + rings cross the composition
    .to(bus.orbital, { x: -6.5, y: -0.4, rotY: Math.PI * 1.6, spin: 1, scale: 1, duration: 3.2 }, 1.6)
    .to('.kinetic-phrase', { scale: 0.94, duration: 1.1 }, 3)
    // 5. The headline transforms: EM rises away, MOVIMENTO slides out, IDEIAS stays
    .to('.kp-2', { yPercent: -140, opacity: 0, duration: 0.9 }, 4.1)
    .to('.kp-3', { xPercent: 45, opacity: 0, scale: 0.9, duration: 1 }, 4.2)
    .to('.story-copy p', { opacity: 0, y: -16, duration: 0.6 }, 4.1)
    .to('.kinetic-phrase', { scale: 1, duration: 0.7 }, 4.3)
    .set('.story-next', { opacity: 1 }, 5)
    .set('.story-copy', { opacity: 0 }, 5)
    // 6. QUE enters horizontally; the letters of TRANSFORMAM. find their place
    .from('.sn-2', { xPercent: -170, opacity: 0, duration: 1 }, 5)
    .from(chars, { x: (i) => (i % 2 ? 1 : -1) * (60 + i * 16), y: (i) => (((i * 37) % 5) - 2) * 22, rotate: (i) => (i % 3 - 1) * 25, opacity: 0, duration: 1.5, stagger: 0.04 }, 5.1)
    .to(bus.orbital, { x: 0, y: 0, scale: 1.2, rotX: 0.7, rotY: Math.PI * 2.2, spin: 0, duration: 1.8 }, 4.6)
    // 7. The composition expands, then reorganises — and rests fully legible
    .to(next, { scale: 1.08, duration: 1 }, 6.8)
    .to('.sn-1', { xPercent: -9, duration: 0.8 }, 7.4)
    .from('.story-next p', { opacity: 0, y: 20, duration: 0.6 }, 7.7)
    .to({}, { duration: 0.25 }, 8.4); // short hold before release
  return () => root.classList.remove('has-pin');
}

/* ───────────────────────── KINETIC — "TECNOLOGIA. CRIATIVIDADE. RESULTADOS." ─────────────────────────
   Sticky band (CSS, no pin): the scroll moves the highlight word by word. */
function statement() {
  const root = q('.statement');
  if (!root) return undefined;
  root.classList.add('is-live');
  const words = qa('.sw', root), meters = qa('.statement-meter i', root);
  let current = -1;
  const set = (i) => {
    if (i === current) return; current = i;
    words.forEach((w, j) => { w.classList.toggle('is-active', j === i); w.classList.toggle('is-past', j < i); });
    meters.forEach((m, j) => m.classList.toggle('is-active', j <= i));
  };
  set(0);
  // Natural scroll (no sticky height): the band's own pass through the viewport drives the highlight.
  const tl = gsap.timeline({ defaults: { ease: EASE.scroll }, scrollTrigger: { trigger: root, start: 'top 70%', end: 'bottom 40%', scrub: SCRUB.tight, onUpdate: (st) => set(Math.min(words.length - 1, Math.floor(st.progress * words.length * 0.999))) } });
  tl.to({}, { duration: 1 }); // highlight only (7.0: no drift while reading)
  gsap.from(qa('.sw-i', root), { yPercent: 125, duration: DUR.slow, ease: EASE.out, stagger: 0.12, scrollTrigger: { trigger: root, start: 'top 72%', toggleActions: 'play none none reverse' } });
  gsap.from('.statement .eyebrow', { opacity: 0, x: -20, duration: DUR.base, ease: EASE.out, scrollTrigger: { trigger: root, start: 'top 72%', toggleActions: 'play none none reverse' } });
  return () => { root.classList.remove('is-live'); words.forEach((w) => w.classList.remove('is-active', 'is-past')); };
}

/* ───────────────────────── CINEMATIC — Natureza + tecnologia ─────────────────────────
   black → forest green → light → GX rises → reading pause → dawn: a white light
   expands from the leaves, green fades, type turns black, purple lines stay. */
function nature(desktop) {
  const root = q('.nature');
  if (!root) return undefined;
  root.classList.add('is-live');
  Object.assign(bus.nature, { rise: 0, turn: 0, exit: 0 });
  const lines = qa('.nt', root);
  const tl = gsap.timeline({ defaults: { ease: EASE.scroll }, scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: SCRUB.base } });
  tl.fromTo('.nature-green', { opacity: 0 }, { opacity: 1, duration: 2.2 }, 0)
    .fromTo('.nature-light', { opacity: 0 }, { opacity: 0.75, duration: 3 }, 2.4)
    .fromTo('.fl-back', { yPercent: 12, opacity: 0 }, { yPercent: -3, opacity: 1, duration: 4 }, 0.6)
    .fromTo('.fl-mid', { yPercent: 20, opacity: 0 }, { yPercent: -5, opacity: 1, duration: 4 }, 1)
    .fromTo('.fl-front', { yPercent: 30, scale: 1.1, opacity: 0 }, { yPercent: -7, scale: 1, opacity: 1, duration: 4 }, 1.4)
    .from('.nature .eyebrow', { opacity: 0, x: -20, duration: 0.8 }, 2.4)
    .from(lines, { yPercent: 125, duration: 1.2, stagger: 0.35 }, 2.6)
    .to(bus.nature, { rise: 1, duration: 2.2 }, 2.8)
    .fromTo('.nature-gx-fallback', { y: 140, opacity: 0 }, { y: 0, opacity: 1, duration: 2.2 }, 2.8)
    .fromTo('.fl-purple ellipse', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2 }, 3.4)
    .from('.fl-purple circle', { scale: 0, transformOrigin: '50% 50%', duration: 0.6, stagger: 0.2 }, 4)
    .from('.nature-copy > *', { opacity: 0, y: 30, duration: 1, stagger: 0.25 }, 4.2)
    // reading pause — short, slow parallax only
    .to('.fl-back', { yPercent: -9, duration: 1.6 }, 4.6)
    .to('.fl-mid', { yPercent: -14, duration: 1.6 }, 4.6)
    .to('.fl-front', { yPercent: -20, duration: 1.6 }, 4.6)
    .to(bus.nature, { turn: 0.9, duration: 2 }, 4.4);
  if (desktop) {
    tl.to('.nature-light', { opacity: 1, scale: 1.25, duration: 1 }, 5.6)
      .fromTo('.nature-dawn', { '--r': '0%' }, { '--r': '190%', duration: 2, ease: 'power1.in' }, 5.9)
      .to('.fl-back, .fl-mid, .fl-front', { opacity: 0, duration: 1.5 }, 6.4)
      .to(bus.nature, { exit: 1, duration: 1.6 }, 6.3)
      .to('.nature-title .nt, .nature-copy h3, .nature-copy .text-link', { color: '#050505', duration: 0.6 }, 6.3)
      .to('.nature-title em', { color: '#6a6a72', duration: 0.6 }, 6.3)
      .to('.nature-copy p, .nature-stamp, .nature .eyebrow', { color: '#4a4a52', duration: 0.6 }, 6.3)
      .to({}, { duration: 0.2 }, 7.9);
  }
  return () => root.classList.remove('is-live');
}

/* ───────────────────────── KINETIC — "CONEXÕES QUE MOVEM O FUTURO." ─────────────────────────
   Words revealed by masks; a purple line connects them; ends complete and legible. */
function connectPhrase() {
  const band = q('.connect-band');
  if (!band) return undefined;
  const words = qa('.cp', band);
  words.forEach((w) => { if (!w.querySelector('.cp-i')) w.innerHTML = `<span class="cp-i">${w.textContent}</span>`; });
  const svg = q('.connect-lines', band), path = q('path', svg);
  // Nodes sit just left of each word; the line runs down the gutter and turns into
  // the next word, so it never crosses the letters. A last node closes the phrase.
  const draw = () => {
    const b = band.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${Math.round(b.width)} ${Math.round(b.height)}`);
    const pts = words.map((w) => { const r = w.getBoundingClientRect(); return [r.left - b.left - 16, r.top - b.top + r.height * 0.5]; });
    const lastR = words[words.length - 1].getBoundingClientRect();
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      // Turn on the side that stays outside both words: down-then-right when the next
      // word is indented further, left-then-down when it starts further left.
      d += x1 >= x0 ? `C${x0} ${y1} ${x0} ${y1} ${x1} ${y1}` : `C${x1} ${y0} ${x1} ${y0} ${x1} ${y1}`;
    }
    // Close with an underline beneath the last words, ending on a filled node.
    const [lx] = pts[pts.length - 1], under = lastR.bottom - b.top + 6;
    const end = [lastR.right - b.left + 22, under];
    d += `C${lx} ${under} ${lx} ${under} ${lx + 24} ${under}L${end[0]} ${end[1]}`;
    path.setAttribute('d', d);
    svg.querySelectorAll('circle,line').forEach((c) => c.remove());
    [...pts, end].forEach(([x, y], i) => { const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', i === pts.length ? 7 : 5); if (i === pts.length) c.setAttribute('class', 'cp-end'); svg.append(c); });
  };
  draw();
  const tl = gsap.timeline({ defaults: { ease: EASE.scroll }, scrollTrigger: { trigger: band, start: 'top 88%', end: 'bottom 70%', scrub: SCRUB.base } });
  tl.from(qa('.cp-i', band), { yPercent: 125, duration: 1, stagger: 0.45 }, 0)
    .fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2 }, 0.3)
    .from(svg.querySelectorAll('circle'), { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.5 }, 0.3)
    .fromTo('.cp-accent .cp-i', { color: '#050505' }, { color: '#7809ac', duration: 0.6 }, 1.8);
  const onRefresh = () => draw();
  ScrollTrigger.addEventListener('refreshInit', onRefresh);
  return () => ScrollTrigger.removeEventListener('refreshInit', onRefresh);
}

/* ───────────────────────── SERVICES — showcase (6.0) ─────────────────────────
   Left: sticky 3D stage (bus.services.active). Right: rich cards. Selection only by
   click / tap / keyboard (the heading button) — scroll never changes the selection,
   so there is nothing to conflict with and no forced 10-step scroll. */
function servicesUI() {
  const root = q('.showcase');
  if (!root) return;
  root.classList.add('is-interactive');
  const cards = qa('.sc-card', root), buttons = qa('.sc-select', root);
  const groups = ['.svc-fallback-item', '.sc-titles strong', '.sc-tags i'].map((sel) => qa(sel, root));
  const counter = q('.sc-counter b', root), ring = q('.so-progress', root), n = cards.length;
  let active = -1;
  const select = (i) => {
    if (i === active) return;
    active = i;
    bus.services.active = i;
    cards.forEach((c, j) => c.classList.toggle('is-active', j === i));
    buttons.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    groups.forEach((g) => g.forEach((el, j) => el.classList.toggle('is-active', j === i)));
    counter.textContent = String(i + 1).padStart(2, '0');
    if (ring) ring.style.strokeDashoffset = String(1 - (i + 1) / n);
  };
  // State rule (Etapa B): hover previews (desktop mouse, 70ms intent / 160ms release, no flicker
  // between cards) > a pinned choice (click, tap or keyboard focus) > the card at the reading line.
  // A pin lasts until another selection, or until the pinned card has scrolled out of view.
  let pinned = -1, hovered = -1, scrolled = 0, timer = 0, lastScroll = -1;
  const view = () => select(hovered >= 0 ? hovered : pinned >= 0 ? pinned : scrolled);
  select(0);
  const hoverable = matchMedia('(hover: hover) and (pointer: fine)');
  cards.forEach((c, i) => {
    // The whole card selects (the heading button is the accessible control); the CTA link keeps its own job.
    c.addEventListener('click', (e) => { if (!e.target.closest('a')) { pinned = i; view(); } });
    c.addEventListener('focusin', () => { pinned = i; view(); });
    c.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'mouse' || !hoverable.matches) return; clearTimeout(timer); timer = setTimeout(() => { hovered = i; view(); }, 70); });
    c.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'mouse') return; clearTimeout(timer); timer = setTimeout(() => { hovered = -1; view(); }, 160); });
  });
  const line = () => {
    if (window.innerWidth >= 900) return window.innerHeight * 0.45;
    const stage = q('.sc-stage', root), bottom = parseFloat(getComputedStyle(stage).top) + stage.offsetHeight;
    return bottom + Math.max(0, window.innerHeight - bottom) * 0.35;
  };
  const onScroll = (self) => {
    const i = Math.min(n - 1, Math.floor(self.progress * n));
    if (i === lastScroll) return;
    lastScroll = scrolled = i;
    if (pinned >= 0) { const r = cards[pinned].getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) pinned = -1; }
    view();
  };
  ScrollTrigger.create({ trigger: q('.sc-cards', root), start: () => `top ${line()}px`, end: () => `bottom ${line()}px`, invalidateOnRefresh: true, onUpdate: onScroll, onRefresh: onScroll });
}

/* ───────────────────────── CINEMATIC — "SEU PRODUTO ESTÁ PARADO?" (5.0) ─────────────────────────
   1 product still · 2 first line · 3 product starts spinning · 4 purple graphics ·
   5 product travels a loop · 6 "A GENTE FAZ ELE GIRAR." · 7 CTA. */
function sales(desktop) {
  const root = q('.sales');
  if (!root) return undefined;
  root.classList.add('is-live');
  const wa = splitWords(q('.st-a', root)), wb = splitWords(q('.st-b', root));
  const spinWord = q('.st-spin .kw-i', root);
  Object.assign(bus.product, { spin: 0, path: 0, travel: 0, rings: 0 });
  const rest = [q('.sales-text', root), ...qa('.sales-channels li', root)];
  if (desktop) {
    // 7.0: the first line reads as the section enters; the pin only carries the product story.
    gsap.timeline({ defaults: { ease: EASE.out }, scrollTrigger: { trigger: root, start: 'top 75%', toggleActions: 'play none none reverse' } })
      .from('.sales .eyebrow', { opacity: 0, x: -20, duration: 0.5 }, 0)
      .from(wa, { yPercent: 130, duration: 0.9, stagger: 0.12 }, 0.1);
    const tl = gsap.timeline({ defaults: { ease: EASE.scroll }, scrollTrigger: { trigger: root, start: 'top top', end: '+=70%', scrub: SCRUB.base, pin: '.sales-inner', anticipatePin: 1, invalidateOnRefresh: true } });
    tl.to(bus.product, { spin: 1, duration: 1.6, ease: 'power2.in' }, 0.2)
      .fromTo('.sales-graphics .sg-ring, .sales-graphics .sg-arc', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, stagger: 0.15 }, 0.8)
      .from('.sales-graphics .sg-nodes circle', { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.1 }, 1.3)
      .to(bus.product, { rings: 1, duration: 1 }, 0.9)
      .to(bus.product, { travel: 1, duration: 0.6 }, 1.5)
      .to(bus.product, { path: 1, duration: 2.4, ease: 'power1.inOut' }, 1.5)
      .fromTo('.sales-graphics .sg-trail', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2 }, 1.6)
      .to(q('.st-a', root), { opacity: 0.4, duration: 0.6 }, 2.4)
      .from(wb, { yPercent: 130, duration: 1, stagger: 0.18 }, 2.5)
      .fromTo(spinWord, { rotationX: -100 }, { rotationX: 0, transformOrigin: '50% 50% -30px', duration: 1.1 }, 3)
      .to(bus.product, { travel: 0.15, duration: 0.8 }, 3.9)
      .from(rest, { opacity: 0, y: 24, duration: 0.6, stagger: 0.08 }, 3.6)
      .from('.sales-cta', { opacity: 0, y: 30, scale: 0.92, duration: 0.7 }, 4.1)
      .to({}, { duration: 0.2 }, 4.9);
    return () => root.classList.remove('is-live');
  }
  // Mobile: same order, played once on enter (no pin, no WebGL; CSS product spins).
  const tl = gsap.timeline({ defaults: { ease: EASE.out }, scrollTrigger: { trigger: root, start: 'top 70%', toggleActions: 'play none none reverse' } });
  tl.from(wa, { yPercent: 130, duration: 0.9, stagger: 0.12 })
    .add(() => root.classList.add('is-spinning'), 0.6)
    .fromTo('.sales-graphics .sg-ring, .sales-graphics .sg-arc', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.1, ease: EASE.inOut }, 0.7)
    .from(wb, { yPercent: 130, duration: 0.9, stagger: 0.12 }, 1.1)
    .fromTo(spinWord, { rotationX: -100 }, { rotationX: 0, transformOrigin: '50% 50% -30px', duration: 1 }, 1.4)
    .from(rest, { opacity: 0, y: 20, duration: 0.6, stagger: 0.06 }, 1.6)
    .from('.sales-cta', { opacity: 0, y: 24, duration: 0.6 }, 2);
  return () => root.classList.remove('is-live', 'is-spinning');
}

/* ───────────────────────── WebGL scenes, lazily mounted ───────────────────────── */
function scenes() {
  const cleanups = [];
  let cancelled = false;
  const lite = isLite();
  const whenNear = (watch, fn) => {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      import('../scene.js').then((mod) => { if (!cancelled) cleanups.push(fn(mod)); }).catch(() => {});
    }, { rootMargin: '300px' });
    (Array.isArray(watch) ? watch : [watch]).forEach((w) => { const el = q(w); if (el) io.observe(el); });
    cleanups.push(() => io.disconnect());
  };
  // One WebGL context carries the GX mark through hero, manifesto, natureza and CTA.
  const hosts = [
    { el: q('#scene'), preset: 'hero', fallback: '.hero .gx-fallback' },
    { el: q('#sales-scene'), preset: 'product', fallback: '.sales-fallback' },
    { el: q('#orbital-scene'), preset: 'orbital', fallback: '.orbital-fallback' },
    { el: q('#nature-scene'), preset: 'nature', fallback: '.nature-gx-fallback' },
    ...(lite ? [] : [{ el: q('#cta-scene'), preset: 'cta', fallback: null }]),
  ];
  whenNear(['#scene', '.sales', '.manifesto', '.nature', '.contact'], ({ mountBrand }) => mountBrand(hosts));
  // All ten services now use HTML compositions in the stage (components.js SCENES), so the services
  // WebGL module is no longer loaded. Kept behind a flag in case a WebGL scene is needed again.
  const SERVICES_WEBGL = false;
  if (!lite && SERVICES_WEBGL) {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      import('../services3d.js').then(({ mountServices }) => { if (!cancelled) cleanups.push(mountServices(q('#services-scene'), { fallback: '.svc-fallback' })); }).catch(() => {});
    }, { rootMargin: '400px' });
    const svc = q('#services-scene'); if (svc) io.observe(svc);
    cleanups.push(() => io.disconnect());
  }
  document.documentElement.classList.toggle('is-lite', Boolean(lite));
  return () => { cancelled = true; cleanups.forEach((c) => c()); };
}

/* ───────────────────────── INTERACTION — pointer-driven (fine pointers) ───────────────────────── */
function interactions() {
  const offs = [];
  const on = (el, type, fn, opts) => { el.addEventListener(type, fn, opts); offs.push(() => el.removeEventListener(type, fn, opts)); };
  // Cursor light: a soft purple glow trails the real cursor (never replaces it).
  const light = q('.cursor-light');
  const lx = gsap.quickTo(light, 'x', { duration: 0.6, ease: 'power3.out' });
  const ly = gsap.quickTo(light, 'y', { duration: 0.6, ease: 'power3.out' });
  on(window, 'pointermove', (e) => { lx(e.clientX); ly(e.clientY); light.classList.add('is-on'); }, { passive: true });
  on(document, 'pointerleave', () => light.classList.remove('is-on'));
  on(document, 'pointerover', (e) => light.classList.toggle('is-hot', Boolean(e.target.closest('a,button,input,select,textarea'))));
  // Magnetic elements (buttons, nav CTA, back-to-top).
  qa('.button,.nav-cta,.back-top').forEach((el) => {
    const s = el.classList.contains('back-top') ? 0.3 : 0.12;
    on(el, 'pointermove', (e) => { const r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * s, y: (e.clientY - r.top - r.height / 2) * s * 1.4, duration: 0.35, ease: EASE.soft, overwrite: true }); });
    const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.45)', overwrite: true });
    on(el, 'pointerleave', reset); on(el, 'blur', reset);
    offs.push(() => { gsap.killTweensOf(el); gsap.set(el, { clearProps: 'transform' }); });
  });
  // Service-card tilt drives the 3D illustration plane.
  qa('.service-card, .sc-stage').forEach((card) => { // the stage reuses the same tilt variables (Marketplace composition)
    on(card, 'pointermove', (e) => { const r = card.getBoundingClientRect(); card.style.setProperty('--tilt-x', `${((e.clientY - r.top - r.height / 2) / r.height) * -9}deg`); card.style.setProperty('--tilt-y', `${((e.clientX - r.left - r.width / 2) / r.width) * 12}deg`); card.style.setProperty('--mx', `${e.clientX - r.left}px`); card.style.setProperty('--my', `${e.clientY - r.top}px`); });
    on(card, 'pointerleave', () => { card.style.removeProperty('--tilt-x'); card.style.removeProperty('--tilt-y'); });
  });
  // Data sphere follows the cursor.
  const sphere = q('.data-sphere');
  if (sphere) {
    on(sphere, 'pointermove', (e) => { const r = sphere.getBoundingClientRect(); gsap.to(sphere, { rotationY: (e.clientX - r.left - r.width / 2) * 0.2, duration: 0.6, overwrite: 'auto' }); });
    on(sphere, 'pointerleave', () => gsap.to(sphere, { rotationY: 0, duration: 0.6 }));
  }
  // CTA object reacts to cursor proximity to the main button.
  const cta = q('.cta-button'), contact = q('.contact');
  if (cta && contact) {
    const prox = gsap.quickTo(bus.cta, 'proximity', { duration: 0.5, ease: 'power2.out' });
    on(contact, 'pointermove', (e) => { const r = cta.getBoundingClientRect(); const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)); const k = Math.max(0, 1 - d / 420); prox(k); contact.style.setProperty('--cta-k', k.toFixed(3)); });
    on(contact, 'pointerleave', () => { prox(0); contact.style.setProperty('--cta-k', '0'); });
    on(cta, 'pointerdown', () => gsap.fromTo(bus.cta, { press: 1 }, { press: 0, duration: 0.8, ease: 'power2.out' }));
  }
  return () => offs.forEach((off) => off());
}

/* ───────────────────────── AMBIENT — only animate what is on screen ───────────────────────── */
function ambientVisibility() {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-inview', e.isIntersecting)), { rootMargin: '80px' });
  qa('main > section, footer').forEach((s) => io.observe(s));
  return () => io.disconnect();
}

/* ───────────────────────── INDICATORS — chapter rail (all motion prefs) ───────────────────────── */
function rail() {
  const ticks = qa('.scroll-rail .rail-tick');
  const fill = q('.scroll-rail .rail-fill');
  ticks.forEach((t) => {
    const target = q(t.dataset.target);
    const light = t.dataset.target === '.difference';
    if (target) ScrollTrigger.create({ trigger: target, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => { t.classList.toggle('is-active', s.isActive); if (light) t.parentElement.classList.toggle('on-light', s.isActive); } });
  });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { fill.style.transform = `scaleY(${s.progress})`; } });
}

/* ───────────────────────── FEEDBACK — form states ───────────────────────── */
function formFeedback() {
  const form = q('#briefing');
  const status = q('.form-status', form);
  const mark = (field) => { const label = field.closest('label'); if (!label) return; const ok = field.validity.valid; label.classList.toggle('is-valid', field.value.trim() !== '' && ok); label.classList.toggle('is-invalid', !ok); };
  qa('input,textarea', form).forEach((f) => {
    f.addEventListener('blur', () => { f.dataset.touched = '1'; mark(f); });
    f.addEventListener('input', () => { if (f.dataset.touched) mark(f); });
  });
  form.addEventListener('invalid', (e) => { mark(e.target); status.textContent = 'Revise os campos destacados para continuar.'; status.dataset.state = 'error'; }, true);
  form.addEventListener('submit', () => {
    status.textContent = 'Pronto! O WhatsApp foi aberto em uma nova aba com a sua mensagem para revisar e enviar.';
    status.dataset.state = 'ok';
    form.classList.remove('is-sent'); void form.offsetWidth; form.classList.add('is-sent');
  });
}

/* ───────────────────────── Public API ───────────────────────── */
// Portfolio filter with Flip when motion is allowed; instant otherwise.
export function animateFilter(apply) {
  const items = qa('.project');
  if (!motionOK()) { apply(); return; }
  const state = Flip.getState(items, { props: 'opacity' });
  apply();
  Flip.from(state, {
    duration: 0.7, ease: EASE.inOut, absolute: true, nested: true, prune: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: EASE.out }),
    onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.35, ease: EASE.soft }),
    onComplete: () => ScrollTrigger.refresh(),
  });
}

export function initMotion() {
  bindPointer();
  rail();
  formFeedback();
  servicesUI();
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: reduce)', () => { endIntro(); bus.hero.intro = 1; });
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const offIntro = intro();
    heroScroll();
    revealHeadings();
    transitions();
    sections();
    portfolio();
    const offStatement = statement();
    const offConnect = connectPhrase();
    const offAmbient = ambientVisibility();
    return () => { offIntro(); offAmbient(); offStatement?.(); offConnect?.(); };
  });
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const offManifesto = manifesto();
    gsap.to('.project:nth-child(even) > a', { y: -70, ease: EASE.scroll, scrollTrigger: { trigger: '.project-grid', start: 'top bottom', end: 'bottom top', scrub: SCRUB.soft } });
    const offScenes = scenes();
    return () => { offManifesto(); offScenes(); };
  });
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => nature(true));
  mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => nature(false));
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => sales(true));
  mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => sales(false));
  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', interactions);
  // Safety net: the intro guard must never hide content for long.
  setTimeout(endIntro, 2500);
  return mm;
}
