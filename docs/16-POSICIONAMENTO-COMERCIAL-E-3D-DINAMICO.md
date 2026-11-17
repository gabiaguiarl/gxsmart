# Refinamento 5.0 — Posicionamento comercial + Motion Design 3D dinâmico — 12/11/2026

## Objetivo da etapa
Apresentar a GX Smart como parceira para **vender produtos online** (não só criação de sites) e transformar a seção de serviços em uma experiência 3D interativa, preservando tudo das etapas 3.0 (docs/14) e 4.0 (docs/15).

## 1. Novo posicionamento
Mensagem principal aplicada: **"A GX ajuda empresas a transformar produtos, presença digital e estratégias em oportunidades de venda."** Sem garantias, números ou resultados inventados.
- Hero: parágrafo → "Soluções digitais para vender mais: marketplaces, e-commerce, sites, conteúdo, lives e marketing para transformar produtos e presença digital em oportunidades de venda."; chips → MARKETPLACES & E-COMMERCE · LIVES & AUDIOVISUAL · SITES, CONTEÚDO & MARKETING. (A headline do hero foi preservada.)
- Estúdio: 1º parágrafo traz a mensagem principal.
- Serviços: introdução → "Soluções complementares para vender online: dos canais de venda ao conteúdo e à tecnologia que levam clientes até eles."
- `<meta name="description">` atualizada.
- **Serviços (src/data.js), em ordem de prioridade comercial:** Marketplaces, E-commerce, Lives de Vendas, Marketing Digital, Desenvolvimento de Sites, Social Media, Produção Audiovisual, Design Digital, Gestão de Tráfego, Landing Pages (+ complementares: Catálogos no WhatsApp, Google Meu Negócio).
- **Atenção:** Marketplaces, Lives de Vendas e Produção Audiovisual entraram porque o responsável os informou nesta etapa (antes eram "não confirmados" em docs/13). Suas descrições são novas e sóbrias — **revisar com a GX** (GX-16).

## 2. Chamada comercial — "SEU PRODUTO ESTÁ PARADO?"
Seção `.sales` (`#vender`) logo após o hero, fundo preto com luz roxa. Texto integral: "SEU PRODUTO ESTÁ PARADO?" / "A GENTE FAZ ELE GIRAR." / "Da estratégia à venda: marketplaces, lojas virtuais, conteúdo, lives e tecnologia para levar seus produtos até novos clientes." + chips de canais + CTA **"QUERO VENDER MAIS"** → WhatsApp comercial real (`SALES_URL` em data.js: wa.me/5511977085852 com mensagem pré-preenchida, nova aba).
Sequência (desktop, pin de 240%, `sales(true)` em src/motion/index.js):
1. Produto 3D parado no centro da área visual.
2. "SEU PRODUTO ESTÁ PARADO?" revelada por máscaras (palavra a palavra).
3. O produto começa a girar (`bus.product.spin` 0→1, aceleração).
4. Elementos roxos surgem: anéis e arcos SVG desenhados, nós, anéis 3D em volta do produto (`rings`).
5. O produto percorre uma trajetória fechada (CatmullRom) deixando um rastro de luz roxa (`travel`, `path`).
6. A primeira frase recua (opacidade) e "A GENTE FAZ ELE GIRAR." entra; a palavra GIRAR. gira sobre o eixo X até assentar.
7. Texto de apoio, canais e o CTA são revelados; o produto volta para perto do centro.
Mobile: mesma ordem tocada uma vez ao entrar na seção (sem pin, sem WebGL); produto em CSS 3D (caixa de 6 faces) girando. Reduced-motion: tudo visível e estático.
O produto é uma **embalagem genérica premium** (caixa acetinada preta, faixa roxa, etiqueta) — nenhum produto real de cliente.

## 3. Componentes criados/alterados
- `components.js`: `salesSection(url)`, `servicesInteractive(services)` (tabs ARIA: `tablist`/`tab`/`tabpanel`, um painel por serviço com título, descrição e CTA "CONVERSAR SOBRE …" que preenche o formulário), `serviceVisual` exportado, ícones `store`, `live`, `camera`, ilustrações CSS de fallback `marketplace`, `live`, `video`. Removido o palco sticky da 3.0 (`servicesStage`).
- `render.js`: seção comercial após o hero; serviços interativos no lugar do palco + cards; trilho de capítulos com "Vendas".
- `data.js`: novos serviços e `SALES_URL`.

## 4. Objetos 3D (src/services3d.js → `mountServices`)
Contexto WebGL próprio da seção (o da marca continua único para GX + produto). Objetos **procedurais** (sem GLB): kit de geometrias cacheadas (`RoundedBoxGeometry`, esferas, cilindros, toros, extrusões) e 6 materiais compartilhados — cromo preto, cetim escuro, roxo emissivo, roxo metálico, claro (UI), vidro. Interfaces desenhadas em `CanvasTexture` (uma vez cada). Cada objeto é construído **só quando selecionado pela primeira vez**.
| Serviço | Objeto | Animação própria |
|---|---|---|
| Marketplaces | pilha de caixas de envio com fita roxa e etiqueta sobre palete | caixas chegam do alto e se organizam; um "pedido" entra, pousa na pilha e sai à direita em ciclo |
| E-commerce | sacola premium com alças cromadas, painel de checkout, cartão, moeda | sacola gira; checkout e cartão flutuam |
| Lives de Vendas | smartphone com interface "AO VIVO", ring light com câmera, produto | ponto ao vivo pulsa, indicadores sobem, produto gira |
| Marketing Digital | gráfico de barras 3D + linha de tendência + alvo | barras crescem, linha se desenha (`setDrawRange`), nós pulsam |
| Desenvolvimento de Sites | navegador 3D com interface + componentes em camadas | camadas chegam em profundidade e flutuam |
| Social Media | smartphone com feed + publicações | publicações entram pela direita, passam à frente e saem pela esquerda |
| Produção Audiovisual | câmera com lente, anel de foco roxo, monitor, quadros "play" | foco gira, REC pulsa, quadros descem |
| Design Digital | composição: card "Aa", esfera, toro, cone, cubo, anel | peças vêm de longe e se reorganizam na composição |
| Gestão de Tráfego | funil de anéis + partículas + alvo + seta | partículas (visitantes) descem e convergem no alvo |
| Landing Pages | página vertical + botão CTA + cursor | cursor vai ao botão e "clica" (botão afunda e acende) |

## 5. Animações e transição entre objetos
Ao mudar de serviço (`show(index)`): 1) o objeto atual encolhe e gira; 2) suas peças se afastam; 3) o próximo entra girando (rotY −1,1 → 0) e escalando, com as peças montando a partir de deslocamentos (em camadas de profundidade no navegador); 4) a câmera se ajusta ao enquadramento do objeto e a luz roxa "respira" conforme o acento do serviço; 5) no DOM, título revelado por recorte, 6) descrição e CTA aparecem; meta (número, ícone, tag) desliza. O laço próprio do objeto só começa depois da montagem (`ready`), em tempo local. Suavizações independentes de FPS.

## 6. Interações
- **Clique/toque** em qualquer serviço: atualiza imediatamente aba, painel, ilustração/objeto 3D, contador e anel de progresso.
- **Teclado:** setas, Home e End no `tablist` (padrão ARIA de abas, foco gerenciado com `tabindex`).
- **Scroll (desktop ≥1024 com movimento):** seção sticky (`.svc.is-scroll`, 100svh + 10×26vh); o progresso escolhe o serviço. **Sem conflito:** o clique também move a rolagem para a "faixa" daquele serviço dentro do trecho sticky (salto instantâneo, invisível porque o palco está fixo) e um bloqueio de dois frames ignora o update causado pelo salto — scroll e seleção sempre concordam.
- **Mobile (<1024):** sem sticky e sem scroll-driven; chips de serviço em grade 2×5 acima do palco ilustrado (toque).
- Sem JS: todos os serviços aparecem como cards legíveis com descrição e CTA.

## 7. Arquivos modificados
Novos: `src/services3d.js`, `docs/16-POSICIONAMENTO-COMERCIAL-E-3D-DINAMICO.md`.
Alterados: `src/data.js`, `src/components.js`, `src/render.js`, `src/scene.js` (helpers exportados, preset `product` com trajetória e rastro, remoção do antigo `mountScene`), `src/motion/index.js` (`servicesUI`, `servicesScroll`, `sales`, cenas), `src/motion/bus.js` (`product`), `src/motion.css` (bloco 5.0; remoção do CSS do palco 3.0), `src/render.test.js`, `index.html` (meta + HTML regenerado), `AGENTS.md`, `README.md`, docs 09/10/11/CHANGELOG.

## 8. Tecnologias
GSAP 3.13 (ScrollTrigger) e Three.js 0.180 já instalados; `RoundedBoxGeometry` vem do próprio pacote three (examples/jsm). Nenhuma dependência nova; nenhum modelo GLB.

## 9. Performance
Contextos WebGL no desktop: 2 (marca/produto + serviços). Serviços: lazy import ao se aproximar (400px), objetos construídos sob demanda, geometrias e materiais compartilhados, render só visível e com aba ativa, descarte completo (geometrias, materiais, texturas, tweens) no cleanup, fallback CSS em modo lite (≤4 núcleos/≤4 GB), mobile e reduced-motion.

## 10. Testes realizados (reais)
- `npm run lint` aprovado; `npm test` 9/9 (novos: cada serviço tem aba + painel com título, descrição e CTA; canais de venda primeiro; chamada comercial com texto integral, CTA para o WhatsApp real e posição logo após o hero); `npm run build` aprovado.
- Playwright/Chrome headless (WebGL por software): sequência da seção comercial quadro a quadro; clique nos 10 serviços com captura de cada objeto (todos distintos e renderizados) e verificação de que a rolagem acompanha a seleção; seleção por rolagem (25% → "Lives de Vendas"); quadros da transição (Marketing Digital); mobile 390×844 (sem overflow, 0 canvases, toque em "Lives de Vendas" troca painel e ilustração); teclado (ArrowDown/End → Landing Pages, 9 painéis ocultos); reduced-motion; script de interações das etapas anteriores sem regressões; console sem erros.
- Correção durante a QA: a palavra "GIRAR." ficava presa no ângulo inicial (origem 3D em `em`); trocada por `fromTo` com origem em px.
- **Não executados:** GPU real, Safari/Firefox, dispositivos físicos, FPS, Lighthouse, leitores de tela.

## 11. Pendências
1. GX-16 — validar com a GX os serviços novos (Marketplaces, Lives, Audiovisual), suas descrições e a ordem.
2. A imagem de referência citada no pedido não foi recebida; a seção foi reformulada a partir do palco existente.
3. Medir em hardware real o custo do palco de serviços (GX-10/GX-15) e ajustar a heurística lite.
4. Se a GX tiver fotos/vídeos próprios de lives e audiovisual, considerar usá-los na seção (com autorização).

## Status
CONCLUÍDO no escopo local. Nada publicado.

## Atualização 6.0
As abas e a seleção por scroll desta etapa foram substituídas pelo layout de cards + palco 3D sticky com seleção por clique (docs/17). Os objetos 3D, o posicionamento e a chamada comercial continuam; a chamada ficou com pin mais curto (+=110%).
