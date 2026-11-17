# Refinamento 6.0 — Layout de serviços restaurado + scroll e motion mais rápidos — 12/11/2026

## Objetivo
Restaurar a composição preferida da seção de serviços (3D grande à esquerda, cards ricos à direita) mantendo a troca dinâmica de objetos 3D da 5.0, e eliminar a sensação de rolagem longa causada por pins, alturas artificiais e scrub lento — sem remover o Motion Design.

As duas capturas citadas no pedido **não foram recebidas** (apenas o texto). A composição restaurada segue a descrição do pedido e o layout das versões 3.0/4.0 (palco 3D sticky à esquerda + cards com ilustração à direita), que estava no histórico do projeto.

## 1. Problemas encontrados (auditoria, medida real em 1440×900)
Altura total da home: **24.605 px = 27,3 telas**. Trechos com distância artificial:
| Seção | Mecanismo | Telas |
|---|---|---|
| Vendas ("Seu produto está parado?") | pin `end: '+=240%'` | 3,4 |
| Faixa "Tecnologia. Criatividade. Resultados." | `height: 300vh` sticky (também no mobile) | 3,0 |
| Serviços | `height: 100svh + 10×26vh` sticky, um serviço por faixa de scroll | 4,4 |
| Manifesto | pin `end: '+=320%'` | 4,2 |
| Natureza | `height: 340vh` sticky | 3,4 |
Agravantes: quatro trechos fixos quase consecutivos (vendas → faixa → serviços → manifesto), scrub com 1–1,6 s de atraso e animações de entrada de 1,2–1,8 s. Mobile: 19,6 telas (a faixa sticky somava 3 telas).

## 2. Layout restaurado
`servicesShowcase()` (src/components.js) substitui as abas da 5.0:
- **Esquerda (~42%)**: painel sticky (`.sc-stage`, top 96px, altura da viewport) com fundo preto profundo, brilho roxo, grid em perspectiva, órbitas, cantos técnicos, contador "01 / 10", tag e título do serviço ativo e o canvas 3D. Não prende o scroll: acompanha naturalmente enquanto os cards passam.
- **Direita (~58%)**: grade de **cards grandes** em 2 colunas (1 coluna abaixo de 1200px) reaproveitando a linguagem dos cards 3.0: ícone, número/tag, ilustração do serviço, nome, descrição, CTA "VAMOS CONVERSAR", hover (elevação, borda roxa, spotlight seguindo o cursor, ícone desenhado, tilt da ilustração) e **destaque roxo no card ativo**.
- Acessibilidade: o nome do serviço é um `<button aria-pressed>` dentro do `<h3>`, esticado sobre o card (todo o card é clicável), e o CTA é um link separado acima dele. O palco é `aria-hidden` (duplica informação visível nos cards).
- Mobile (<900px): palco compacto sticky (190px) no topo da seção mostrando o serviço tocado; cards em linhas compactas (ícone + nome + descrição + CTA, sem a ilustração, que aparece no palco).

## 3. Componentes modificados
`src/components.js` (`servicesShowcase`, remoção de `servicesInteractive`), `src/render.js`, `src/motion/index.js` (`servicesUI` por clique; remoção de `servicesScroll`; entrada dos cards em lote; distâncias e timelines), `src/motion/tokens.js` (durações e scrub), `src/services3d.js` (troca rápida e enquadramento), `src/motion.css` (bloco 6.0; remoção do CSS das abas; statement e natureza mais curtos), `src/render.test.js`.

## 4. Alterações nos objetos 3D
Os 10 objetos procedurais da 5.0 foram mantidos. Mudanças:
- **Troca em ~0,6 s** (antes ~1,6 s): saída 0,28 s (encolhe, gira, peças se afastam) → entrada após 0,12 s com escala/rotação em 0,55–0,6 s, peças montando em 0,45 s com intervalo de 25 ms → laço próprio inicia em 0,5 s. Barras/linha do Marketing em 0,45/0,55 s. Câmera e luz ajustam em 0,6 s.
- **Enquadramento:** o palco agora é alto e estreito; `fitZ()` afasta a câmera conforme a proporção (`camZ · 0,84 · max(1, (1,25/aspect)^0,85)`) para o objeto ocupar uma área generosa sem cortar.
- Seleção **somente por clique/toque/teclado** — o scroll não altera mais o serviço, então não há conflito entre ScrollTrigger e seleção manual.

## 5. Timelines ajustadas e distâncias de scroll
| Trecho | Antes | Depois |
|---|---|---|
| Vendas (pin) | `+=240%` | `+=110%` (pausa final 0,6 → 0,2) |
| Faixa statement | 300vh sticky | sem altura extra; o destaque acompanha a passagem natural (`top 70%` → `bottom 40%`) |
| Serviços | 100svh + 260vh, 10 etapas | sem altura artificial; seleção por clique |
| Manifesto (pin) | `+=320%` | `+=140%` (pausa final 0,8 → 0,25) |
| Natureza (sticky) | 340vh | 200vh; pausa de leitura 2,6 → 1,6 unidades; amanhecer 2,8 → 2,0 |
| Scrub | tight 0,6 / base 1 / soft 1,6 s | 0,3 / 0,5 / 0,8 s |
| Durações (tokens) | micro .24 · fast .45 · base .8 · slow 1.2 · cinematic 1.8 | .2 · .35 · .6 · .8 · 1.2 |
Resultado medido (seções em telas, 1440×900): vendas 3,4 → 2,1 · statement 3,0 → 0,8 · serviços 4,4 → 3,4 (agora só conteúdo) · manifesto 4,2 → 2,4 · natureza 3,4 → 2,0. **Home: 27,3 → 19,4 telas (24.605 → 17.430 px)**. Mobile 390×844: 19,6 → 18,7 telas (statement 3,0 → 0,5).
Ritmo: só restam dois trechos fixos com animação longa (vendas e manifesto) separados por seções de leitura, e a natureza (sticky curto) separada do manifesto pelo portfólio.

## 6. Animações preservadas
Abertura do hero, GX 3D itinerante, saída do hero, sequência completa de "Seu produto está parado?", tipografia cinética (rise/clip/slide/scale, statement, manifesto que se transforma, "Conexões que movem o futuro"), parallax tipográfico, seção natureza com amanhecer, transições entre seções, objetos 3D por serviço, microinterações (magnetic, sublinhados, spotlight, luz do cursor, CTA 3D), feedback do formulário, filtro Flip do portfólio, trilho de capítulos. Nada foi removido; apenas encurtado ou acelerado.

## 7. Testes realizados (reais)
- `npm run lint` aprovado; `npm test` 9/9 (teste de serviços reescrito: cada card tem ícone, título selecionável com `aria-pressed`, ilustração, descrição e CTA; palco antes dos cards); `npm run build` aprovado.
- Auditoria automatizada de alturas (antes/depois) em 1440×900 e 390×844.
- Rolagem completa com roda do mouse (passos de 240 px): 70 passos até o fim (antes ≈ 99 pela altura); estados finais corretos; **volta ao topo** com os pins revertidos (manifesto mostra a 1ª frase, frase 2 de vendas volta a esconder), sem erros.
- Sequências encurtadas capturadas quadro a quadro (vendas, manifesto, natureza): completas.
- Serviços (desktop, WebGL por software): clique em 4 cards → título do palco, card ativo e `aria-pressed` corretos; clique no corpo do card seleciona; CTA leva a `#contato` com o serviço pré-selecionado; objetos enquadrados no palco.
- Mobile (toque) com e sem redução de movimento: palco sticky mostra o serviço tocado, 0 canvases, sem overflow horizontal.
- Regressão das interações anteriores (formulário, filtro, resize, CTA 3D, teclado): sem erros.
- Links: 27 âncoras internas válidas, externos preservados (não abertos).
- **Não executados:** GPU real, Safari/Firefox, dispositivos físicos, FPS, Lighthouse, leitores de tela, botão "voltar" do navegador entre páginas (a home é página única; testada a navegação para cima/baixo e por âncoras).

## 8. Pendências
1. Comparar visualmente com as capturas de referência quando forem enviadas (GX-18).
2. Validar em hardware real a fluidez do palco sticky + troca 3D (GX-10).
3. GX-16 (textos dos serviços novos) continua pendente.

## Status
CONCLUÍDO no escopo local. Nada publicado.
