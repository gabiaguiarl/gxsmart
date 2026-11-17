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

test('commercial call: headline, support text and CTA to the real WhatsApp', () => {
  assert.ok(html.includes('SEU PRODUTO') && html.includes('ESTÁ PARADO?') && html.includes('A GENTE FAZ') && html.includes('GIRAR.'));
  assert.ok(html.includes('Da estratégia à venda: marketplaces, lojas virtuais, conteúdo, lives e tecnologia para levar seus produtos até novos clientes.'));
  const cta = html.match(/<a class="button sales-cta" href="([^"]+)"[^>]*>Quero vender mais/);
  assert.ok(cta, 'CTA');
  const url = new URL(cta[1].replace(/&amp;/g, '&'));
  assert.equal(url.hostname, 'wa.me'); assert.equal(url.pathname, '/5511977085852');
  assert.ok(html.indexOf('class="sales"') < html.indexOf('class="about section"'), 'right after the hero');
});

test('decorative motion layers are hidden from assistive tech', () => {
  ['hero-rings', 'hero-lines', 'manifesto-lines', 'grid-dissolve', 'scroll-rail', 'cursor-light', 'cta-stage', 'sc-stage', 'sales-art', 'line-wipe', 'hero-marquee', 'nature-bg', 'nature-gx', 'gx-fallback', 'statement-meter', 'connect-lines'].forEach((cls) => {
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
