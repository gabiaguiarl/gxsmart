# Refinamento criativo 4.0 — Brand Motion, Kinetic Typography & Visual Storytelling — 12/11/2026

## Objetivo da etapa
Refinar a experiência 3.0 (docs/14) sem refazê-la: tornar a marca GX a protagonista do 3D, deixar todo o conteúdo em português, dar protagonismo à tipografia em movimento, criar contraste entre as seções (incluindo uma seção natureza) e transições cinematográficas — com menos WebGL e sem perder a clareza dos serviços.

## 1. Análise inicial
Leitura de AGENTS.md, docs/10, docs/11, docs/14 e do código. Diagnóstico:
- **3D genérico:** TorusKnot no hero, icosaedro no núcleo do manifesto e octaedro no CTA não tinham relação com a marca. As 7 formas do palco de serviços foram mantidas (representam serviços, não a marca).
- **WebGL:** 4 contextos no desktop (hero, serviços, manifesto, CTA).
- **Inglês visível:** "DIGITAL IN MOTION" (eyebrow e `content:` do CSS no mobile), "FORM / 01", "DESIGN × CODE × CONNECTION", "RENDER / LIVE", "SCROLL 000%", "THE FUTURE IS BUILT HERE" (rótulo, letreiro e rodapé), nas mini-ilustrações "YOUR NEXT BIG THING", "LET’S CREATE", "ADD TO BAG", "LET’S GO", "FORM + FUNCTION".
- **Fundos:** sequência quase toda preta/cinza (#050505, #0d0d10, #101014, #0b0b0e), com só o manifesto roxo e a diferença clara.
- **Tipografia:** movimento concentrado em revelações de títulos; nenhuma frase controlada pelo scroll além do manifesto.
- **Seção "Por trás das telas" (bastidores):** visualmente parecida com a do estúdio (escura, com rede/"gx." decorativo).
- **Arquivo da marca:** só existe raster (`public/assets/logo.png`, 512×307, símbolo roxo + "SMART" branco). Nenhum vetor.

## 2. Alterações realizadas (resumo)
1. GX 3D fiel, extrudado a partir do traçado do símbolo oficial; **um único contexto WebGL** que leva a marca por hero → manifesto → natureza → CTA. Total de contextos no desktop: **2** (antes 4).
2. Todo o texto visível em português.
3. Três novas composições tipográficas + parallax tipográfico + manchete que se transforma.
4. Nova hierarquia de fundos com seção natureza (verde exclusivo) e transição verde → branco.
5. Refinos: suavização das cenas independente da taxa de quadros, remoção do painel escuro (substituído pelo "amanhecer"), ajustes de contraste.

## 3. Implementação do GX 3D
- **Traçado:** `scripts/trace-logo.py` (Pillow + NumPy + OpenCV) isola apenas os pixels roxos do `logo.png` (ignora "SMART"), amplia 6×, suaviza levemente e extrai o contorno (1 forma com 1 furo, 772 pontos, proporção 1,5648). Saída gerada em `src/brand/gx-mark.js` (não editar à mão). A geometria **não foi redesenhada nem aproximada por fonte**; foi validada sobrepondo o traçado ao PNG original.
- **3D (`src/scene.js` → `mountBrand`)**: `ExtrudeGeometry` com chanfro; frente em metal preto acetinado, laterais em cromo escuro polido; ambiente PMREM procedural com painéis roxos (#7809AC) gera os reflexos roxos; contorno roxo (`LineLoop`) sobre a face frontal; tone mapping ACES.
- **Um renderer itinerante:** o canvas é movido para o host com maior área visível (`IntersectionObserver`). Ao trocar de host há um "snap" para a pose do novo preset e uma chegada suave (escala/rotação). Presets:
  | Host | Preset | Comportamento |
  |---|---|---|
  | `#scene` (hero) | `hero` | entra girando no intro (`bus.hero.intro`), gira suavemente, segue o cursor; no scroll muda de perspectiva (rotX/rotY), aproxima a câmera e desloca para o lado; órbita roxa, satélite e partículas |
  | `#orbital-scene` (manifesto) | `orbital` | GX no centro de três anéis metálicos; atravessa a frase e volta (`bus.orbital`) |
  | `#nature-scene` | `nature` | surge de baixo (`bus.nature.rise`), gira devagar, luz quente + contraluz verde; sobe e sai no amanhecer (`exit`) |
  | `#cta-scene` | `cta` | reage à proximidade do cursor ao botão principal e ao clique (`bus.cta`) |
- **Suavização independente de FPS:** `lerp` usa `1 - (1 - t)^(dt·60)`, para que a pose final não dependa do desempenho do aparelho.
- **Fallback sem WebGL** (mobile, redução de movimento, modo lite, perda de contexto): SVG com o **mesmo traçado** (`gxDefs()` emite o path uma vez; `gxMarkSvg()` reutiliza via `<use>` em camadas para dar profundidade, gradiente cromado e contorno roxo). Inclinação ambiente leve só quando a seção está visível.

## 4. Novas animações tipográficas (`src/motion/index.js`, `src/motion/kinetic.js`)
- **Ex. 02 — `statement()` "TECNOLOGIA. CRIATIVIDADE. RESULTADOS."** (nova faixa após o estúdio): bloco sticky de 300vh; o scroll muda a palavra ativa (roxa, escala 1), as já lidas ficam brancas e as próximas, cinza; deriva horizontal (parallax) por palavra; medidor de progresso de 3 traços.
- **Ex. 01 — manifesto "IDEIAS EM MOVIMENTO." → "IDEIAS QUE TRANSFORMAM."** (pin de 320%): IDEIAS permanece no mesmo lugar (as duas manchetes têm IDEIAS sozinha na linha 1), EM sobe e sai, MOVIMENTO desliza para fora, QUE entra na horizontal, **as letras de TRANSFORMAM. viajam até suas posições** (`splitChars`, único uso de letras), a composição se expande e se reorganiza, terminando legível. O `h2` final recebe `aria-label`.
- **Ex. 03 — `connectPhrase()` "CONEXÕES QUE MOVEM O FUTURO."** (início da seção branca): palavras escalonadas em quatro linhas, reveladas por máscaras; uma linha roxa percorre a calha à esquerda ligando nós de cada palavra (sem cruzar as letras) e termina sublinhando "O FUTURO." com um nó cheio; MOVEM fica roxo. O traçado é recalculado no `refreshInit` do ScrollTrigger.
- **Natureza:** linhas do título reveladas por máscaras; cor do texto passa de branco a preto durante o amanhecer.
- **Parallax tipográfico:** `parallaxLines()` nas manchetes do estúdio, da jornada e do contato (cada linha em velocidade diferente).
- **Ritmo:** parágrafos, cards de serviço e dados de contato continuam sem animações complexas (momentos de leitura).

## 5. Traduções realizadas
| Antes | Depois |
|---|---|
| GX SMART — DIGITAL IN MOTION / DIGITAL IN MOTION (CSS mobile) | GX SMART — TECNOLOGIA EM MOVIMENTO / TECNOLOGIA EM MOVIMENTO |
| FORM / 01 | FORMA / 01 |
| DESIGN × CODE × CONNECTION | DESIGN × CÓDIGO × CONEXÃO |
| RENDER / LIVE · SCROLL 000% | CENA 3D / AO VIVO · PERCURSO 000% |
| THE FUTURE IS BUILT HERE (rótulo, letreiro, rodapé) | O FUTURO SE CONSTRÓI AQUI |
| EXPLORAR NOSSO TRABALHO | CONHEÇA NOSSOS PROJETOS |
| YOUR NEXT BIG THING. · LET’S CREATE | SEU PRÓXIMO GRANDE PASSO. · VAMOS CRIAR |
| ADD TO BAG · LET’S GO · FORM + FUNCTION | ADICIONAR · VAMOS LÁ · FORMA + FUNÇÃO |
Mantidos por serem termos consagrados ou nomes de serviço: E-commerce, Landing Pages, Social Media, Design, WhatsApp, Google Meu Negócio, Menu. Teste automatizado impede o retorno dessas frases.

## 6. Seção natureza (substitui o bloco visual de "Por trás das telas")
- Conceito: "A TECNOLOGIA EVOLUI. AS CONEXÕES PERMANECEM HUMANAS." Mantém o conteúdo real dos bastidores (âncora `#bastidores`, "Entre códigos, cafés e boas ideias.", "Tecnologia é o que fazemos. Conexão é o que nos move.", link do Instagram, selo "Pessoas + ideias — o lado humano do digital").
- Arte: verde floresta #10291F e verde profundo #071A14 **apenas nesta seção** (variáveis locais `--forest`, `--forest-deep`; nunca em botões, navbar ou identidade). Folhagem **procedural em SVG** (`natureFoliage()`: frondes e folhas largas determinísticas, três camadas com desfoque/gradiente para profundidade), feixes de luz suaves, elipse e nós roxos discretos. Sem fotos, sem folhas caindo.
- Movimento (desktop, seção de 340vh com fundo e conteúdo sticky): fundo preto → verde → luz cresce → folhagens entram com parallax em três velocidades → título por máscaras → GX surge → pausa de leitura → **amanhecer**. Folhas da frente oscilam muito levemente (CSS, só com a seção visível).
- Mobile: mesma sequência sem sticky, sem WebGL (GX em SVG) e com degradê estático para o branco.

## 7. Transições de fundo
Hierarquia final: 01 hero preto · 02 estúdio preto com brilho roxo + faixa "Tecnologia. Criatividade. Resultados." · 03 serviços em superfície escura (#0e0e13) com cards destacados (#15151b) · 04 manifesto roxo · 05 portfólio preto · 06 natureza verde · 07 diferença branca (#f6f5f8) · 08 jornada preta · 09 contato preto com luz roxa.
- Hero → estúdio: linha roxa vira divisor (3.0).
- Serviços → manifesto: círculo roxo que se abre (3.0).
- Portfólio → natureza: preto → verde por opacidade, luz e folhagem com parallax.
- **Natureza → branco:** a luz se intensifica; um painel branco (`.nature-dawn`) se expande a partir da fonte de luz via máscara radial animada (`--r`, borda de 40% para não ter flash); as folhas somem; o texto vai a preto; os detalhes roxos permanecem; o GX sobe e sai. A seção seguinte começa na mesma cor (#f6f5f8), sem corte.
- Diferença → jornada: grid que se dissolve (3.0).
- O antigo painel escuro que revelava a seção branca (`panel-wipe`) foi removido.

## 8. Componentes modificados
- Novos: `scripts/trace-logo.py`, `src/brand/gx-mark.js` (gerado), `docs/15-BRAND-MOTION-E-NARRATIVA-VISUAL.md`.
- `src/components.js`: `gxPath`, `gxDefs`, `gxMarkSvg`, `natureFoliage`, `kineticStatement`; traduções das mini-ilustrações.
- `src/render.js`: sprite do GX, fallback do hero, faixa statement, manchetes do manifesto, seção natureza, frase conectada, traduções, trilho de capítulos (`.nature`).
- `src/scene.js`: reescrito — `mountBrand` (GX itinerante) + `mountScene` (somente palco de serviços).
- `src/motion/index.js`: `manifesto()` reescrito, `statement()`, `nature(desktop)`, `connectPhrase()`, `scenes()` com host único; remoção dos tweens do estúdio antigo e do `panel-wipe`.
- `src/motion/kinetic.js`: `splitChars`, `parallaxLines`. `src/motion/bus.js`: `hero.rotY`, `nature`.
- `src/motion.css`: bloco "REFINAMENTO 4.0". `src/premium.css`: tradução do `content:` mobile.
- `src/render.test.js`: testes de idioma e do traçado.
- Não alterados: `data.js` (serviços e projetos reais), `style.css`, assets.

## 9. Bibliotecas utilizadas
Nenhuma dependência nova no site: GSAP 3.13 (ScrollTrigger, Flip) e Three.js 0.180 já existentes. O script de traçado usa Pillow, NumPy e OpenCV apenas para gerar `gx-mark.js` (ferramenta de desenvolvimento, não vai para o bundle).

## 10. Testes executados (reais)
- `npm run lint`: aprovado. `npm test`: 8/8 (inclui "conteúdo sem frases em inglês" e "GX é o símbolo traçado, emitido uma vez"). `npm run build`: aprovado (aviso do Vite sobre o chunk da cena com 530 kB / 137 kB gzip — já carregado sob demanda, só no desktop).
- Playwright + Chrome headless, WebGL por software (SwiftShader), `hardwareConcurrency` forçado a 8: capturas por rolagem em 1440×900, 390×844 e 1440×900 com reduced-motion; sequências quadro a quadro do hero, manifesto, natureza e frase conectada.
- Resultados: desktop com **2 canvases** (GX + palco de serviços); o canvas do GX foi verificado nos hosts hero, natureza e CTA; mobile e reduced-motion com 0 canvases; sem rolagem horizontal em 390 px; console sem erros.
- Script de interação (repetido da 3.0): serviço ativo correto, proximidade do CTA, validação/confirmação do formulário (sem envio real), filtro Institucional (2) / Todos (6), resize 1440→390→1440 sem erros, foco por teclado.
- Correções feitas durante a QA: fundo da natureza não ficava sticky (`inset:auto` sobrescrevia `top`), máscara do amanhecer vazando como mancha clara, linha da frase conectada cruzando o texto, espaço entre EM e MOVIMENTO, corte de "RESULTADOS" pelo parallax, suavização dependente de FPS no GX.
- **Não executados:** GPU real, Safari/Firefox, dispositivos físicos, FPS, Lighthouse/CWV, leitores de tela.

## 11. Pendências e próximos passos
1. Validar em hardware real (GX-10), especialmente a máscara animada do amanhecer (custo de repintura em tela cheia) e o renderer itinerante.
2. Revisão da composição da natureza em telas muito altas/estreitas e entre 900–1100 px.
3. Se a GX fornecer o **vetor oficial** do símbolo, substituir o traçado: basta gerar `gx-mark.js` a partir do SVG (mesmo formato) — o 3D e o fallback se atualizam sozinhos.
4. Revisar com a GX os textos novos (faixa "O que nos guia", frase conectada, conceito da natureza) e as traduções.
5. Otimizar imagens/fonte (GX-05) e medir Lighthouse (GX-06).

## Status
CONCLUÍDO no escopo local. Nada publicado.
