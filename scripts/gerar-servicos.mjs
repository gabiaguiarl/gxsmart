#!/usr/bin/env node
/**
 * Gera as páginas individuais dos serviços (HTML estático, indexável) a partir de src/servicos/dados.js.
 *   node scripts/gerar-servicos.mjs
 * Saída: dist/servicos/<slug>/index.html (+ dist/servicos/index.html redirecionando para /#expertise).
 * Cabeçalho e rodapé são copiados da homepage (dist/index.html), com âncoras convertidas para "/#...".
 * Estilos: CSS base da home + layout-refined.css + servicos/servico.css. Motion: servicos/servico.js (sem GSAP).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const { SERVICOS, ETAPAS, DIFERENCIAIS, WHATSAPP } = await import(pathToFileURL(path.join(ROOT, 'src/servicos/dados.js')).href);

const home = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const slice = (open, close) => { const a = home.indexOf(open); const b = home.indexOf(close, a); if (a < 0 || b < 0) throw new Error('Trecho não encontrado: ' + open); return home.slice(a, b + close.length); };
const toHome = (html) => html.replace(/href="#inicio"/g, 'href="/"').replace(/href="#([\w-]+)"/g, 'href="/#$1"');
const header = toHome(slice('<header class="header">', '</header>')).replace('<span class="header-current" aria-hidden="true"></span>', '');
const footer = toHome(slice('<footer', '</footer>'));
const baseCss = (home.match(/href="(\/assets\/index-[\w-]+\.css)"/) || [])[1];
if (!baseCss) throw new Error('CSS base da home não encontrado');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (nome) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá, GX Smart! Quero saber mais sobre ${nome}.`)}`;
const bySlug = Object.fromEntries(SERVICOS.map((s) => [s.slug, s]));
const ART = {
  marketplace: ['/assets/marketplaces/marketplace-composition.webp', 676], commerce: ['/assets/commerce/commerce-composition.webp', 640],
  live: ['/assets/live/live-composition.webp', 678], marketing: ['/assets/marketing/marketing-composition.webp', 640],
  website: ['/assets/website/website-composition.webp', 640], social: ['/assets/social/social-composition.webp', 640],
  video: ['/assets/video/video-composition.webp', 640], design: ['/assets/design/design-composition.webp', 640],
  traffic: ['/assets/traffic/traffic-composition.webp', 640], landing: ['/assets/landing/landing-composition.webp', 640],
};

// Ícones de traço (24px), currentColor.
const P = {
  store: '<path d="M4 10h16l-1-5H5z"/><path d="M5 10v9h14v-9"/><path d="M10 19v-5h4v5"/>',
  bag: '<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  tag: '<path d="M3 12V4h8l9 9-8 8z"/><circle cx="7.5" cy="8" r="1.4"/>',
  chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  loop: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  live: '<rect x="3" y="6" width="14" height="12" rx="2"/><path d="m17 10 4-2v8l-4-2"/><circle cx="7" cy="10" r="1.3" fill="currentColor"/>',
  megaphone: '<path d="M3 10v4h4l8 5V5L7 10z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
  camera: '<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 1.5-2 .5-3s0-3 2-3H18a3 3 0 0 0 3-3c0-5-4-9-9-9z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
  panels: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
};
const icon = (k) => `<svg class="sv-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[k] || P.spark}</svg>`;

// Motivo geométrico de cada serviço (decorativo, animado em CSS).
const MOTIF = {
  vitrines: '<rect class="m-a" x="40" y="70" width="90" height="64" rx="10"/><rect class="m-b" x="300" y="40" width="80" height="58" rx="10"/><rect class="m-c" x="320" y="250" width="96" height="66" rx="10"/><path class="m-line" d="M130 102 300 70M130 102l190 180"/>',
  carrinho: '<path class="m-line" d="M40 300c80-40 120-180 220-190s110 80 160 60"/><circle class="m-a" cx="40" cy="300" r="7"/><circle class="m-b" cx="260" cy="110" r="7"/><circle class="m-c" cx="420" cy="170" r="7"/>',
  aovivo: '<circle class="m-ring" cx="230" cy="200" r="120"/><circle class="m-ring m-ring2" cx="230" cy="200" r="170"/><circle class="m-a" cx="352" cy="120" r="8"/>',
  crescimento: '<path class="m-line" d="M40 320 140 250l70 30 90-110 120-80"/><rect class="m-a" x="60" y="290" width="18" height="40"/><rect class="m-b" x="110" y="260" width="18" height="70"/><rect class="m-c" x="160" y="230" width="18" height="100"/>',
  interface: '<rect class="m-a" x="30" y="50" width="150" height="90" rx="8"/><rect class="m-b" x="300" y="70" width="120" height="70" rx="8"/><rect class="m-c" x="280" y="260" width="150" height="70" rx="8"/><path class="m-line" d="M30 70h150M300 88h120M280 278h150"/>',
  publicacoes: '<rect class="m-a" x="40" y="60" width="80" height="80" rx="14"/><rect class="m-b" x="330" y="50" width="80" height="80" rx="14"/><rect class="m-c" x="340" y="260" width="80" height="80" rx="14"/><circle class="m-line" cx="80" cy="300" r="20"/>',
  edicao: '<path class="m-line" d="M20 330h420"/><rect class="m-a" x="40" y="314" width="70" height="32" rx="5"/><rect class="m-b" x="130" y="314" width="110" height="32" rx="5"/><rect class="m-c" x="260" y="314" width="60" height="32" rx="5"/><path class="m-ring" d="M360 60h70v50h-70z"/>',
  geometria: '<circle class="m-a" cx="80" cy="90" r="40"/><rect class="m-b" x="330" y="50" width="70" height="70" transform="rotate(18 365 85)"/><path class="m-c" d="M360 260 420 340H300z"/><path class="m-line" d="M80 90 365 85 360 300"/>',
  fluxos: '<path class="m-line" d="M20 90c120 0 160 110 280 110s100-90 140-90M20 310c120 0 160-110 280-110"/><circle class="m-a" cx="20" cy="90" r="6"/><circle class="m-b" cx="20" cy="310" r="6"/><circle class="m-c" cx="440" cy="110" r="6"/>',
  jornada: '<path class="m-line" d="M50 70h360L320 170H140zM140 190h180l-50 70h-80z"/><circle class="m-a" cx="230" cy="320" r="10"/>',
};

const pageFor = (s, i) => {
  const [art, artH] = ART[s.kind];
  const n = String(i + 1).padStart(2, '0');
  const url = `/servicos/${s.slug}/`;
  const jsonld = { '@context': 'https://schema.org', '@type': 'Service', name: s.nome, serviceType: s.tag, description: s.seo,
    provider: { '@type': 'Organization', name: 'GX Smart', email: 'sac@gxsmart.com.br', telephone: '+55 11 97708-5852',
      address: { '@type': 'PostalAddress', streetAddress: 'R. Dr. Oscar Egydio de Araújo, 526', addressLocality: 'São Paulo', addressRegion: 'SP', postalCode: '08160-620', addressCountry: 'BR' } } };
  const rel = s.relacionados.map((r) => bySlug[r]).filter(Boolean);
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#050505" />
  <title>${esc(s.nome)} | GX Smart</title>
  <meta name="description" content="${esc(s.seo)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(s.nome)} | GX Smart" />
  <meta property="og:description" content="${esc(s.seo)}" />
  <meta property="og:image" content="${art}" />
  <meta property="og:locale" content="pt_BR" />
  <link rel="icon" href="/assets/favicon.png" />
  <link rel="preload" as="image" href="${art}" />
  <link rel="stylesheet" href="${baseCss}">
  <link rel="stylesheet" href="/assets/layout-refined.css">
  <link rel="stylesheet" href="/assets/servicos/servico.css">
  <script>/* revela conteúdo com animação; se o JS falhar, tudo aparece em 3s */document.documentElement.classList.add("sv-js");setTimeout(function(){document.documentElement.classList.add("sv-done")},3000)</script>
  <script type="module" src="/assets/servicos/servico.js"></script>
  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="sv-page sv-${s.kind}">
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
${header}
<main id="conteudo">
  <section class="sv-hero" aria-labelledby="sv-title">
    <svg class="sv-motif motif-${s.motif}" viewBox="0 0 460 400" fill="none" aria-hidden="true">${MOTIF[s.motif] || ''}</svg>
    <div class="sv-hero-copy">
      <nav class="sv-crumbs" aria-label="Você está em"><a href="/">Início</a><span aria-hidden="true">/</span><a href="/#expertise">Serviços</a><span aria-hidden="true">/</span><span aria-current="page">${esc(s.nome)}</span></nav>
      <p class="eyebrow sv-rv"><span class="dot"></span> ${n} / ${esc(s.tag)}</p>
      <h1 id="sv-title" class="sv-rv">${esc(s.titulo)}</h1>
      <p class="sv-lead sv-rv">${esc(s.descricao)}</p>
      <div class="sv-actions sv-rv">
        <a class="button" href="${wa(s.nome)}" target="_blank" rel="noopener noreferrer">Solicitar orçamento <span aria-hidden="true">↗</span></a>
        <a class="text-link" href="#como-funciona">Ver como funciona <span aria-hidden="true">↓</span></a>
      </div>
    </div>
    <div class="sv-art" aria-hidden="true">
      <svg class="sv-orbits" viewBox="0 0 600 600" fill="none"><circle cx="300" cy="300" r="200"/><circle class="o2" cx="300" cy="300" r="270"/><path class="o3" d="M100 300a200 200 0 0 1 200-200"/></svg>
      <div class="sv-float"><img src="${art}" width="640" height="${artH}" alt="" fetchpriority="high" decoding="async" /></div>
    </div>
  </section>

  <section class="sv-what sv-light" aria-labelledby="sv-what-t">
    <div class="sv-wrap">
      <p class="sv-kicker">O que é ${esc(s.nome)}?</p>
      <h2 id="sv-what-t" class="sv-rv">${esc(s.oQueE)}</h2>
      <ul class="sv-points">
        ${s.pontos.map(([ic, t, d]) => `<li class="sv-rv">${icon(ic)}<strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join('\n        ')}
      </ul>
    </div>
  </section>

  <section class="sv-help" aria-labelledby="sv-help-t">
    <div class="sv-wrap">
      <p class="eyebrow"><span class="dot"></span> Como a GX Smart ajuda</p>
      <h2 id="sv-help-t" class="sv-rv">O que podemos construir juntos em ${esc(s.nome)}.</h2>
      <div class="sv-cards">
        ${s.ajuda.map(([ic, t, d], k) => `<article class="sv-card sv-rv" style="--d:${k}"><span class="sv-card-ico">${icon(ic)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="sv-steps" id="como-funciona" aria-labelledby="sv-steps-t">
    <div class="sv-wrap">
      <p class="eyebrow"><span class="dot"></span> Como funciona</p>
      <h2 id="sv-steps-t" class="sv-rv">Do primeiro contato ao próximo passo.</h2>
      <ol class="sv-timeline">
        ${ETAPAS.map(([ic, t, d], k) => `<li class="sv-rv" style="--d:${k}"><span class="sv-step-ico">${icon(ic)}</span><span class="sv-step-n">ETAPA ${String(k + 1).padStart(2, '0')}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('\n        ')}
      </ol>
    </div>
  </section>

  <section class="sv-diff sv-light" aria-labelledby="sv-diff-t">
    <div class="sv-wrap">
      <p class="sv-kicker">Por que a GX Smart</p>
      <h2 id="sv-diff-t" class="sv-rv">Um estúdio, várias conexões para a sua marca.</h2>
      <div class="sv-diff-grid">
        ${DIFERENCIAIS.map(([ic, t, d]) => `<div class="sv-rv">${icon(ic)}<h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="sv-faq" aria-labelledby="sv-faq-t">
    <div class="sv-wrap">
      <p class="eyebrow"><span class="dot"></span> Perguntas frequentes</p>
      <h2 id="sv-faq-t" class="sv-rv">Dúvidas sobre ${esc(s.nome)}.</h2>
      <div class="sv-faq-list">
        ${s.faq.map(([q, a]) => `<details class="sv-rv"><summary>${esc(q)}<span aria-hidden="true"></span></summary><p>${esc(a)}</p></details>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="sv-related" aria-labelledby="sv-rel-t">
    <div class="sv-wrap">
      <h2 id="sv-rel-t" class="sv-kicker">Serviços que combinam</h2>
      <div class="sv-rel-list">
        ${rel.map((r) => `<a href="/servicos/${r.slug}/"><span>${esc(r.tag)}</span><strong>${esc(r.nome)}</strong><b aria-hidden="true">→</b></a>`).join('\n        ')}
        <a class="sv-rel-all" href="/#expertise"><span>Ver todos</span><strong>Todos os serviços</strong><b aria-hidden="true">→</b></a>
      </div>
    </div>
  </section>

  <section class="sv-cta" aria-labelledby="sv-cta-t">
    <svg class="sv-cta-rings" viewBox="0 0 600 600" fill="none" aria-hidden="true"><circle cx="300" cy="300" r="150"/><circle cx="300" cy="300" r="230"/><circle cx="300" cy="300" r="300"/></svg>
    <div class="sv-wrap">
      <h2 id="sv-cta-t" class="sv-rv">Pronto para levar sua marca mais longe?</h2>
      <p class="sv-rv">Conte para a equipe o que você precisa em ${esc(s.nome)}.</p>
      <div class="sv-actions sv-rv">
        <a class="button" href="${wa(s.nome)}" target="_blank" rel="noopener noreferrer">Conversar com a GX Smart <span aria-hidden="true">↗</span></a>
        <a class="text-link" href="/#contato">Usar o formulário <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>
</main>
${footer}
</body>
</html>
`;
};

const outDir = path.join(DIST, 'servicos');
fs.mkdirSync(outDir, { recursive: true });
SERVICOS.forEach((s, i) => {
  const dir = path.join(outDir, s.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pageFor(s, i));
});
fs.writeFileSync(path.join(outDir, 'index.html'), '<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Serviços | GX Smart</title><meta http-equiv="refresh" content="0;url=/#expertise"><link rel="canonical" href="/#expertise"></head><body><a href="/#expertise">Ver serviços da GX Smart</a></body></html>\n');
console.log(`${SERVICOS.length} páginas geradas em dist/servicos/`);
