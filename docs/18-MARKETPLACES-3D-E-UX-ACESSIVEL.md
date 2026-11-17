# 18 — Marketplaces 3D + UX acessível (Refinamento 7.0) — 12/11/2026

## Objetivo
Logos reais de marketplaces no 3D de "Marketplaces"; textos simples e comerciais; legibilidade para todas as idades; CTAs claros; motion que não atrapalha a leitura. Layout 6.0 preservado.

## Alterações
- **Logos (Shopee, Mercado Livre):** nenhum arquivo oficial no projeto. A única fonte acessível daqui (pacote `simple-icons`) tem só a Shopee, monocromática e redesenhada pela comunidade, e não tem Mercado Livre — **não usada** (viola "oficial / cores originais / sem redesenho"). Implementado o carregamento 3D a partir de SVG oficial: `MARKETPLACE_LOGOS` em `src/data.js` (`enabled:false`) + `loadLogos()` em `src/services3d.js` (SVGLoader → extrusão com chanfro, cor de cada path preservada, escala uniforme, eixo Y corrigido). Ao selecionar Marketplaces: objeto anterior sai, Shopee entra pela esquerda, Mercado Livre pela direita, oscilação 3D lenta e independente (frente visível), arco/nó roxos; reação ao mouse via inclinação do palco; mobile usa a ilustração CSS (sem WebGL). Enquanto `enabled:false`, permanecem as caixas de envio.
- **Para ativar:** salvar os SVGs oficiais em `public/assets/marketplaces/shopee.svg` e `mercado-livre.svg` e mudar `enabled` para `true`. Mecânica validada com arquivos de teste coloridos (não versionados).
- **Aviso de marca** na chamada comercial: marcas dos titulares, sem parceria oficial.
- **Textos:** descrições/tags dos 10 serviços reescritas em linguagem simples (sem garantias); hero: eyebrow "Soluções para vender online" + parágrafo direto; chamada comercial com lista "Como a GX ajuda você a vender" (4 itens com ✓).
- **CTAs:** "Quero vender mais" (hero e chamada → WhatsApp), "Conhecer os serviços", "Solicitar orçamento" (cards, serviços, formulário), "Falar com a GX no WhatsApp" (contato). Texto em caixa normal, 15px.
- **Menu:** Início · Serviços · Projetos · Sobre a GX · Contato (15px).
- **Legibilidade:** bloco 7.0 em `src/motion.css` — corpo 16–18px, secundários 14–16px, botões 15px, rótulos informativos ≥12px, cinzas ≥ #bdbdbd; palavras inativas da faixa statement #77737d (antes #2c2c33); 1ª frase da chamada fica a 75% (antes 40%).
- **Motion:** removido o parallax de linhas de títulos e a deriva da faixa statement (texto não se move durante a leitura). Demais animações mantidas.

## Arquivos
`src/data.js`, `src/services3d.js`, `src/render.js`, `src/components.js`, `src/motion/index.js`, `src/motion.css`, `src/render.test.js`, `index.html` (gerado), `AGENTS.md`, docs 10/11/18/CHANGELOG.

## Testes (reais)
lint ok; `npm test` 9/9; build ok. Playwright: loader de logos com SVGs de teste (cores, entrada lateral, oscilação; sem erros); capturas desktop/mobile de hero e chamada; regressão de interações (seleção, formulário, filtro); 50 links, 0 âncoras quebradas; mobile com/sem redução de movimento ok.
Revisão heurística (sem usuários reais): o que a GX faz fica claro no eyebrow + parágrafo do hero e na chamada logo abaixo; serviços com nomes conhecidos e frases simples; botões com texto; contato acessível pelo menu e pelos CTAs; conteúdo completo sem animação. Ponto de atenção: o título do hero continua abstrato ("Tecnologia que transforma ideias em experiências") — mantido por ser aprovado.

## Pendências
1. GX-19: fornecer SVGs oficiais Shopee/Mercado Livre (press kit) e ativar `enabled`.
2. Avaliar título do hero mais direto (decisão da GX).
3. Teste com usuários reais (não realizado).

## 7.1 — Estilo "ícone de app" (referências enviadas: Shopee/Amazon)
- As imagens enviadas são renders de terceiros (possivelmente gerados por IA) e foram usadas **só como referência de estilo**, não como textura.
- Cada marca vira um bloco arredondado brilhante na cor da marca (`tile` em `MARKETPLACE_LOGOS`) com o símbolo oficial extrudado em relevo (~66% da face), clearcoat, reflexo do ambiente reduzido para manter as cores fiéis, sombra de contato suave. Composição automática para 1–4 marcas (2×2 com quatro), entrada pelas laterais, oscilação lenta independente.
- Itens configurados: Shopee (#EE4D2D), Mercado Livre (#FFE600), Amazon (#FFFFFF), Magalu (#0086FF). Arquivos ausentes são ignorados. **Confirmar com a GX em quais marketplaces ela atua** antes de exibir Amazon/Magalu.
- Mobile/sem WebGL: os mesmos ícones em versão plana (`.market-tiles`) quando `enabled`.
- Arquivos esperados: `public/assets/marketplaces/{shopee,mercado-livre,amazon,magalu}.svg` (SVG oficial do brand/press kit; atenção às regras de uso de marca de cada empresa, em especial Amazon).
- Testado com SVGs provisórios (não versionados): 4 blocos renderizados, cores preservadas, sem erros. Lint, 9/9, build ok.
