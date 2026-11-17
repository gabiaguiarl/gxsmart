# Estado atual — 12/11/2026 (resumo principal, manter ≤150 linhas)

## Projeto
Home da GX Smart em Vite + JS (sem framework), GSAP 3.13 (ScrollTrigger, Flip) e Three.js 0.180. Markup em `src/render.js` (pré-renderizado em `index.html` por `scripts/prerender.mjs`). Nada publicado; sem backend (formulário abre WhatsApp).

## Estrutura essencial
- `src/data.js` — projetos, 10 serviços (ordem comercial), `SALES_URL`, `MARKETPLACE_LOGOS`.
- `src/components.js` / `src/render.js` — HTML (hero, chamada comercial, estúdio, statement, serviços showcase, manifesto, portfólio, natureza, diferença, jornada, contato).
- `src/motion/` — tokens, bus (estado lido pelo WebGL), tipografia cinética, timelines.
- `src/scene.js` — GX 3D + produto da chamada em um único contexto itinerante. `src/services3d.js` — palco 3D dos serviços (objetos procedurais; logos oficiais via SVG quando ativadas).
- CSS: `style.css` → `premium.css` → `motion.css` (blocos por versão; 7.0 = legibilidade).

## Histórico de etapas (detalhes nos docs)
- 00–13: base, design system, seções, testes (docs/00–13).
- 3.0 Motion design (docs/14) · 4.0 Marca GX 3D, PT-BR, natureza (docs/15) · 5.0 Posicionamento comercial e 3D por serviço (docs/16) · 6.0 Layout de serviços restaurado e scroll ~19 telas (docs/17) · **7.0 Marketplaces 3D (pronto para logos oficiais), textos simples, legibilidade e CTAs (docs/18)**.

## Última tarefa concluída
7.0 — arquivos: `src/data.js`, `src/services3d.js`, `src/render.js`, `src/components.js`, `src/motion/index.js`, `src/motion.css`, `src/render.test.js`, `index.html`, `AGENTS.md` (+ Modo econômico), docs 10/11/18/CHANGELOG.
Testes: lint ok, 9/9, build ok, QA Playwright desktop/mobile/reduced, links ok.

## Pendências principais
- GX-19: SVGs oficiais (Shopee, Mercado Livre e, se a GX atuar, Amazon/Magalu) → `public/assets/marketplaces/` + `MARKETPLACE_LOGOS.enabled = true`. Cena em estilo ícone de app (7.1) já pronta.
- GX-16: validar textos dos serviços (inclui Marketplaces, Lives, Audiovisual).
- GX-18: comparar layout de serviços com capturas de referência (não recebidas).
- GX-10/15: validar em hardware real (GPU, Safari/Firefox, celulares).
- GX-05/06: otimizar imagens/fonte; medir Lighthouse.

## Próxima tarefa exata
Receber os SVGs oficiais dos marketplaces e ativar `MARKETPLACE_LOGOS`; conferir a cena Marketplaces no navegador.

## Regras
Ler `AGENTS.md` (inclui Modo econômico, orçamento de rolagem e regras de marca). Editar `render.js`, nunca o HTML gerado. Não publicar sem autorização.

## 15/11/2026 — Marketplaces premium
Três ícones 3D implementados e validados. Ver 21-MARKETPLACES-PREMIUM.md. Atenção: fontes transferidas mais antigas que dist; preservar dist até reconciliar.

E-commerce atualizado: vitrine, fone, carrinho e confirmação 3D. Ver 22-ECOMMERCE-3D.md.

Live de vendas reformulada: AO VIVO, apresentadora, comentários, produto e compra. Ver 23-LIVE-DE-VENDAS-3D.md.

Revisão da live: direção cartoon substituída por imagem fotográfica gerada e celular grafite. Ver 24-LIVE-PHOTO-REVISAO.md.

Portfólio compacto e alinhado: ver 25-PORTFOLIO-COMPACTO.md.
