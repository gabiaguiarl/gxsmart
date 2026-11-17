# Motion Design Experience 3.0 — 12/11/2026

## Objetivo da etapa
Transformar a home em uma experiência de Motion Design interativo ("GX Smart — an interactive motion experience"): rolagem conduzindo uma narrativa visual, 3D procedural com linguagem própria, tipografia cinética, transições distintas entre seções e microinterações — sem refazer a arquitetura, sem trocar bibliotecas e sem esconder conteúdo.

## 1. Conceito de Motion Design
A página é dirigida como uma sequência: **abertura** (hero monta-se em camadas) → **saída do hero** (objeto gira em outro eixo, câmera aproxima, headline se desfaz em direções opostas, um letreiro novo cruza a tela) → **linha roxa vira divisor** → **serviços com palco fixo** (o objeto muda a cada serviço) → **círculo roxo abre o manifesto** → **frase cinética pinada** (o objeto 3D atravessa a frase) → **portfólio revelado por máscaras** → **painel escuro revela a seção branca** → **grid se dissolve na jornada** → **objeto do CTA reage ao cursor**.

Categorias (definidas em `src/motion/tokens.js` e espelhadas em `:root` de `src/motion.css`):

| Categoria | Uso | Regras |
|---|---|---|
| Ambient | brilho do hero, arcos girando, nós pulsando, glow do palco, anel do CTA | CSS; só roda em seções com `.is-inview`; nunca em todos os cards ao mesmo tempo |
| Interaction | magnetic, sublinhados, spotlight dos cards, desenho dos ícones, luz do cursor, feedback do formulário | 240–800 ms, `expo.out`/`elastic` no retorno |
| Scroll | saída do hero, parallax, sphere, cubo, linha da jornada, offset das colunas do portfólio | `ease:none` + `scrub` (0.6 / 1 / 1.6) |
| Transition | linha → divisor, círculo, painel, grid, rede de conexões | um efeito diferente por fronteira |
| Cinematic | abertura do hero, manifesto pinado | timelines GSAP dedicadas |

Tokens: `DUR` micro .24 · fast .45 · base .8 · slow 1.2 · cinematic 1.8 s; `EASE` out `expo.out`, soft `power3.out`, inOut `power3.inOut`, snap `back.out(1.7)`; `STAGGER` palavras .055, linhas .1, cards .09.

## 2. Bibliotecas utilizadas
Nenhuma nova dependência. GSAP 3.13 (`ScrollTrigger`, `Flip` — plugin incluído no pacote `gsap`) e Three.js 0.180 já instalados. Sem React/R3F/Motion (a stack é JS puro). Sem Lenis (scroll nativo mantido).

## 3. Componentes animados
`src/components.js` (todos decorativos, `aria-hidden="true"`):
- `heroRings()` — círculos concêntricos, 48 ticks, arcos orbitais e nós em volta da escultura.
- `heroLines()` — linhas de circuito que ligam a headline ao objeto.
- `scrollRail()` — trilho fixo de capítulos 00–08 (≥1360 px).
- `servicesStage()` — palco fixo: canvas, ícones fallback, contador, tag, título, anel de progresso, indicador de 7 passos.
- `manifestoLines()` — elipses/curvas desenhadas durante o pin.
- `gridDissolve()` — células que se dissolvem na entrada da jornada.
- `techIcon()` agora adiciona `pathLength="1"` a cada forma (permite "desenhar" qualquer ícone via CSS).

Marcação adicional em `src/render.js`: `.hero-glow`, `.hero-hud` (contador `SCROLL 000%`), `.hero-marquee`, `.line-wipe`, `.services-layout`, `.manifesto-light`, frase `.kinetic-phrase` (`.kp-1/2/3`), `.panel-wipe`, `.cta-stage`, `.form-status` (`role=status`), `.cursor-light`, atributos `data-reveal`.

## 4. Timelines GSAP (`src/motion/index.js`)
- `intro()` — abertura: grid 0 s → glow .15 s → linhas .45 s → anéis .55 s → objeto (`bus.hero.intro`) .7–1.9 s → eyebrow/palavras 1.05–2.15 s → chips, parágrafo, botões, rodapé 1.7–2.5 s. Qualquer wheel/touch/tecla/clique acelera a timeline ×4 (não bloqueia interação).
- `heroScroll()` — linhas da headline saem alternando esquerda/direita; `bus.hero` (rotX 1.35, x −2.1, camZ 2.8, glow) gira o objeto em outro eixo, aproxima a câmera e desloca lateralmente; anéis giram/escalam; letreiro "THE FUTURE IS BUILT HERE — DESIGN × CODE × CONNECTION" cruza a tela.
- `manifesto()` (≥900 px) — pin de 280%: círculo roxo cresce de 24% a 90%, linhas desenham, 1) IDEIAS sobe da máscara, 2) EM viaja da direita, 3) MOVIMENTO cresce, 4) anéis 3D atravessam a composição (`bus.orbital.x` 6.5 → −6.5), 5) a frase se reorganiza e sai, 6) "CONEXÕES QUE TRANSFORMAM." é revelada palavra a palavra; pausa antes de liberar o scroll.
- `servicesStage()` (≥1024 px) — `ScrollTrigger` por card define o serviço ativo (palco, card, indicador, `bus.services.active`) e o progresso do anel.
- `transitions()`, `sections()`, `portfolio()` — ver item 6.
- `reveals` em `src/motion/kinetic.js`: `rise` (palavras sobem de máscaras), `clip` (wipe horizontal + ênfase), `slide` (linhas de lados opostos, scrub), `scale` (palavras sobem + ênfase cresce). Uso: estúdio/bastidores/jornada `rise`, serviços/diferença `clip`, portfólio `slide`, contato `scale`.

## 5. Cenas 3D (`src/scene.js`)
Um módulo, quatro tipos, materiais compartilhados: metal preto físico (`MeshPhysicalMaterial`, metalness 1, clearcoat) refletindo um **ambiente procedural** (PMREM de uma caixa escura com painéis emissivos roxos e brancos) — é isso que produz "preto com reflexos roxos". Luz-chave segue o cursor; luz roxa orbita. Tone mapping ACES.
- `hero` — TorusKnot (conceito preservado) com ondulação orgânica no vertex shader (`onBeforeCompile`, custo de CPU zero), fio roxo, órbita, satélite e 520 partículas de profundidade. Lê `bus.hero` + `bus.pointer`.
- `orbital` (manifesto) — três anéis metálicos com fio roxo + núcleo facetado. Lê `bus.orbital` (posição, escala, rotação, spin) — totalmente coreografado pela timeline pinada.
- `services` — sete geometrias (uma por serviço, ordem de `data.js`), escala/rotação interpoladas na troca + anel. Lê `bus.services`.
- `cta` — octaedro facetado + dois anéis; escala, giro e brilho seguem `bus.cta.proximity` (distância do cursor ao botão principal) e `press`.
`src/motion/bus.js` é o estado compartilhado: GSAP escreve, WebGL lê a cada frame.

## 6. Gatilhos de scroll
| Gatilho | Efeito |
|---|---|
| `.hero` top top → bottom top | saída do hero + HUD de % |
| `.about` top bottom → top 35% | linha roxa atravessa e vira divisor |
| `.manifesto` top bottom → top top | círculo roxo abre (desktop) |
| `.manifesto` pin +=280% | história cinética (desktop) |
| cards de serviço top 58% | serviço ativo / palco (≥1024) |
| `ScrollTrigger.batch` cards | entrada com profundidade (rotateX) |
| `ScrollTrigger.batch` projetos | máscara de baixo para cima + zoom-out da imagem + legenda |
| projetos | parallax de imagem; colunas pares deslocam −70px (desktop) |
| `.difference` top 85% → 20% | painel escuro sobe e revela a seção branca |
| `.process` top 90% → 25% | grid se dissolve em ordem aleatória |
| `.network-transition` | rede de conexões desenhada |
| `[data-reveal]` top 82% | tipografia cinética (reversível) |
Todos os gatilhos não scrubados usam `toggleActions: play none none reverse` (reversíveis). Após criar tudo, `ScrollTrigger.sort()` + `refresh()` em `main.js` garantem que o pin do manifesto seja considerado pelos gatilhos abaixo dele.

## 7. Interações
Magnetic (`.button`, `.nav-cta`, `.back-top`) com retorno elástico; sublinhado animado em `.text-link` e na navegação (inclusive `aria-current`); spotlight que segue o cursor nos cards + tilt 3D da ilustração; ícones desenhados + transformação própria por serviço no hover/ativo; brilho de cursor (não substitui o cursor; só com ponteiro fino); dados da esfera seguem o cursor; menu mobile abre com máscara; trilho de capítulos + barra de leitura; formulário com linha roxa no foco, estados válido/inválido e mensagem `role=status`; filtro do portfólio com `Flip`. Sem áudio.

## 8. Arquivos modificados
Novos: `src/motion/tokens.js`, `src/motion/bus.js`, `src/motion/kinetic.js`, `src/motion/index.js`, `src/motion.css`, `src/render.test.js`, este documento.
Alterados: `src/main.js` (delegação para o módulo de motion, filtro via `animateFilter`), `src/render.js`, `src/components.js`, `src/scene.js` (reescrito), `index.html` (script de guarda da abertura no `<head>` + HTML regenerado pelo prerender), `AGENTS.md`, `README.md`, `docs/10`, `docs/11`, `docs/13`, `docs/09`, `docs/CHANGELOG.md`.
Não alterados: `style.css`, `premium.css`, `data.js`, assets.

## 9. Otimizações
Animações de DOM só em `transform`, `opacity` e `clip-path`; máscaras de palavra (não letras). WebGL: pixel ratio limitado (1.75 hero, 1.5 demais), render só quando visível (`IntersectionObserver`) e com aba ativa, carregamento sob demanda (`import()` + IO com 300 px de margem), descarte completo de geometrias/materiais/env no cleanup, fallback em `webglcontextlost`. Modo **lite** (≤4 núcleos ou ≤4 GB, ou `?lite`): só hero + manifesto em WebGL; palco de serviços e CTA usam fallback CSS. Mobile (<900 px): sem WebGL e sem pin (regra do AGENTS). Ambient CSS pausado fora da viewport (`.is-inview`). `gsap.matchMedia` reverte tudo ao mudar breakpoint/preferência. `prefers-reduced-motion`: abertura pulada, nenhum scrub/pin/WebGL, manifesto empilhado e legível, animações CSS desligadas pela regra global existente.

## 10. Problemas conhecidos
- Entre 900 e 1100 px a escultura sobrepõe parcialmente a headline (composição herdada; amenizada pelo gradiente). Avaliar em tela real.
- Até 4 contextos WebGL no desktop (cada um pausado fora da tela). Em GPUs fracas que não sejam detectadas pela heurística lite, considerar unificar em um renderer.
- O filtro do portfólio passou a usar `style.display` (exigência do Flip) em vez do atributo `hidden`.
- O chunk da cena tem ~498 kB (126 kB gzip), carregado apenas no desktop.
- A guarda da abertura (`is-intro`) depende de um script inline; se o JS principal falhar, o hero reaparece em até 2,5 s.
- Fonte ainda externa (GX-05).

## 11. Testes executados (reais)
- `npm run lint`: aprovado. `npm test`: 6/6 (2 anteriores + 4 novos em `src/render.test.js`). `npm run build`: aprovado.
- Playwright + Google Chrome headless, WebGL por software (SwiftShader), `hardwareConcurrency` forçado a 8 para não acionar o modo lite. Capturas por rolagem em 1440×900, 1024×768, 390×844 (mobile/touch) e 1440×900 com `reduced-motion`; sequência da abertura capturada em 0,3/0,7/1,1/1,5/1,9/2,4/3,2 s.
- Resultados: 4 canvases no desktop (hero, palco, manifesto, CTA), 0 no mobile e em reduced-motion; sem rolagem horizontal (390 px); console sem erros.
- Script de interação: serviço ativo correto ao rolar até "Landing Pages"; proximidade do CTA (`--cta-k` 0,905 perto do botão); formulário mostra erro ao enviar vazio e confirmação com campos válidos (`window.open` interceptado, nenhuma mensagem real enviada); filtro Institucional → Fênix Services e Área Monitorada, contador "2 PROJETOS"; Todos → 6; redimensionar 1440→390→1440 remove e recria pin e WebGL sem erros; foco por teclado funcional.
- Correções durante a QA: palavras da headline quebrando linha (regra antiga `span{display:block}`), topo dos glifos aparecendo sob a máscara, overflow horizontal de 7 px no mobile, recursão `invalid`→`checkValidity()` no formulário.
- **Não executados:** GPU real, Safari/Firefox, dispositivos físicos, medição de FPS/Lighthouse/CWV, leitores de tela.

## 12. Próximos passos
1. Validar fluidez em hardware real (notebook com GPU integrada, iPhone/Android médio) e ajustar a heurística lite.
2. Medir Lighthouse/CWV (GX-06) e otimizar imagens/fonte (GX-05).
3. Refinar a composição do hero entre 900–1100 px.
4. Avaliar unificar as cenas em um único renderer com viewports/scissor se a medição indicar custo.
5. QA com leitores de tela e teclado completo (GX-08).

## Status
CONCLUÍDO no escopo local. Nada publicado.

## Atualização 4.0
Partes deste documento foram substituídas pelo Refinamento 4.0 (docs/15): objetos 3D abstratos do hero, manifesto e CTA → GX 3D em renderer único; seção "Por trás das telas" → seção natureza; painel escuro da seção branca → amanhecer; segunda manchete do manifesto → "IDEIAS QUE TRANSFORMAM.".
