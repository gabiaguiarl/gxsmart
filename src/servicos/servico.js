/* Páginas de serviço — motion leve (sem GSAP) e navegação.
   Revela conteúdo ao entrar na tela, desenha a linha das etapas, inclina a arte 3D com o mouse
   e controla o menu mobile. prefers-reduced-motion: CSS desliga os deslocamentos. */
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Títulos sobem palavra por palavra (o texto continua inteiro para leitores de tela).
if (!reduced) {
  document.querySelectorAll('.sv-hero h1, .sv-page h2.sv-rv').forEach((h) => {
    if (h.querySelector('.sv-w')) return;
    const words = h.textContent.trim().split(/\s+/);
    h.setAttribute('aria-label', h.textContent.trim());
    h.innerHTML = words.map((w, i) => `<span class="sv-w" aria-hidden="true"><span style="--w:${i}">${w.replace(/</g, '&lt;')}</span></span>`).join(' ');
    h.classList.add('sv-split');
  });
}

const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add('is-in');
  io.unobserve(e.target);
}), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.sv-rv, .sv-hero, .sv-steps, .sv-cta').forEach((el) => io.observe(el));
root.classList.add('sv-ready');

// Cabeçalho: fundo ao rolar (mesma classe da home).
const header = document.querySelector('.header');
const onScroll = () => header && header.classList.toggle('scrolled', scrollY > 60);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menu mobile.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
const close = () => { toggle?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('open'); };
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('open', open);
});
nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); } });

// Inclinação sutil da arte 3D (apenas mouse; a imagem é plana, então só alguns graus).
const art = document.querySelector('.sv-art');
const hero = document.querySelector('.sv-hero');
if (art && hero && !reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let raf = 0;
  hero.addEventListener('pointermove', (e) => {
    const r = art.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / r.width, y = (e.clientY - (r.top + r.height / 2)) / r.height;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { art.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`); art.style.setProperty('--rx', `${(-y * 5).toFixed(2)}deg`); });
  });
  hero.addEventListener('pointerleave', () => { art.style.setProperty('--ry', '0deg'); art.style.setProperty('--rx', '0deg'); });
}

// Barra de progresso de leitura.
const bar = document.querySelector('.sv-progress span');
if (bar) {
  let tick = 0;
  const upd = () => { tick = 0; const max = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`; };
  addEventListener('scroll', () => { if (!tick) tick = requestAnimationFrame(upd); }, { passive: true });
  upd();
}

// Cards: luz roxa que acompanha o mouse.
if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.sv-card, .sv-diff-grid > div, .sv-rel-list a').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// Demonstração interativa (abas acessíveis): o cenário muda de estado por data-step (CSS faz a animação).
document.querySelectorAll('[data-demo]').forEach((demo) => {
  const tabs = [...demo.querySelectorAll('[role="tab"]')];
  const panels = [...demo.querySelectorAll('[role="tabpanel"]')];
  const scene = demo.querySelector('.demo-scene');
  const dots = [...demo.querySelectorAll('.demo-dots i')];
  let cur = 0;
  const show = (i, focus) => {
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => { const on = k === cur; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    panels.forEach((p, k) => { p.hidden = k !== cur; });
    dots.forEach((d, k) => d.classList.toggle('on', k <= cur));
    scene.dataset.step = tabs[cur].dataset.step;
    scene.classList.remove('is-anim'); void scene.offsetWidth; scene.classList.add('is-anim');
    if (focus) tabs[cur].focus();
  };
  tabs.forEach((t, k) => {
    t.addEventListener('click', () => show(k));
    t.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (e.key in keys) { e.preventDefault(); show(cur + keys[e.key], true); }
      else if (e.key === 'Home') { e.preventDefault(); show(0, true); }
      else if (e.key === 'End') { e.preventDefault(); show(tabs.length - 1, true); }
    });
  });
  demo.querySelector('.demo-prev')?.addEventListener('click', () => show(cur - 1));
  demo.querySelector('.demo-next')?.addEventListener('click', () => show(cur + 1));
  // Selos da abertura levam direto a uma etapa.
  document.querySelectorAll('[data-goto]').forEach((a) => a.addEventListener('click', () => {
    const k = tabs.findIndex((t) => t.dataset.step === a.dataset.goto);
    if (k >= 0) show(k);
  }));
  demo.classList.add('is-ready');
  show(0);
});
