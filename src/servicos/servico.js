/* Páginas de serviço — motion leve (sem GSAP) e navegação.
   Revela conteúdo ao entrar na tela, desenha a linha das etapas, inclina a arte 3D com o mouse
   e controla o menu mobile. prefers-reduced-motion: CSS desliga os deslocamentos. */
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
