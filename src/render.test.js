import test from 'node:test';
import assert from 'node:assert/strict';
import { renderHome } from './render.js';
import { services, projects } from './data.js';
import { techIcon } from './components.js';
import { GX_SHAPES, GX_ASPECT } from './brand/gx-mark.js';

const html = renderHome();

test('every service is a rich card: icon, selectable title, description, illustration and CTA', () => {
  const cards = html.split('<article class="service-card sc-card').slice(1).map((c) => c.slice(0, c.indexOf('</article>')));
  assert.equal(cards.length, services.length);
  services.forEach(([title, description, , , kind], i) => {
    const c = cards[i];
    assert.ok(c.includes(`card-${kind}`) && c.includes('class="icon-box"') && c.includes(`visual-${kind}`), `${title}: icon + illustration`);
    assert.ok(c.includes(`<button class="sc-select" type="button" aria-pressed="${i === 0}">${title}</button>`), `${title}: selectable heading`);
    assert.ok(c.includes(description) && c.includes(`data-service="${title}"`), `${title}: description + CTA`);
  });
  ['Marketplaces', 'E-commerce', 'Lives de Vendas'].forEach((t, i) => assert.equal(services[i][0], t)); // sales channels first
  assert.ok(html.indexOf('class="sc-stage"') < html.indexOf('class="sc-cards"'), '3D stage on the left of the cards');
});

test('hero: objective description, two CTAs and no removed blocks', () => {
  assert.ok(html.includes('Transformamos produtos e marcas em oportunidades de venda com marketplaces, lojas virtuais, marketing e produção digital.'));
  assert.match(html, /<a class="button" href="#contato">INICIAR UM PROJETO/);
  assert.match(html, /<a class="text-link" href="#expertise">CONHECER SERVIÇOS/);
  ['class="sales"', 'SEU PRODUTO', 'hero-services', 'hero-marquee', 'hero-foot', 'hero-hud'].forEach((t) => assert.ok(!html.includes(t), t));
});

test('decorative motion layers are hidden from assistive tech', () => {
  ['hero-rings', 'hero-lines', 'manifesto-lines', 'grid-dissolve', 'scroll-rail', 'cursor-light', 'cta-stage', 'sc-stage', 'line-wipe', 'nature-bg', 'nature-gx', 'gx-fallback', 'statement-meter', 'connect-lines'].forEach((cls) => {
    const re = new RegExp(`class="${cls}[^"]*"[^>]*aria-hidden="true"|aria-hidden="true"[^>]*class="${cls}`);
    assert.match(html, re, cls);
  });
});

test('ids are unique and projects keep their real links', () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  projects.forEach((p) => assert.ok(html.includes(`href="${p.url}"`)));
});

test('icons can be drawn: every shape carries pathLength=1', () => {
  const svg = techIcon('palette');
  const shapes = svg.match(/<(path|circle|ellipse|rect)\b[^>]*>/g);
  assert.ok(shapes.length > 0);
  shapes.forEach((s) => assert.match(s, /pathLength="1"/));
});

test('visible copy is in Portuguese (no leftover English UI phrases)', () => {
  const text = html.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ');
  ['DIGITAL IN MOTION', 'THE FUTURE IS BUILT HERE', 'RENDER / LIVE', 'YOUR NEXT', 'LET’S', 'ADD TO BAG', 'FORM + FUNCTION', 'CODE × CONNECTION', 'EXPLORAR NOSSO TRABALHO'].forEach((en) => assert.ok(!text.includes(en), en));
});

test('the GX mark is the traced official symbol, emitted once and reused', () => {
  assert.equal(GX_SHAPES.length, 1);
  assert.ok(GX_SHAPES[0].outer.length > 200 && GX_SHAPES[0].holes.length === 1);
  assert.ok(GX_ASPECT > 1.5 && GX_ASPECT < 1.6);
  assert.equal((html.match(/id="gx-path"/g) || []).length, 1);
  assert.ok((html.match(/href="#gx-path"/g) || []).length >= 8);
});
