# Changelog — GX Smart

Histórico das fases de refinamento publicadas no GitHub. O histórico anterior (12 a 15/11/2026) está em [docs/CHANGELOG.md](docs/CHANGELOG.md).

## 17/11/2026 — UX Etapa 1: legibilidade

**Resumo:** primeira etapa do plano de experiência universal. Textos pequenos (rótulos, links, botões e legendas) agora têm tamanho mínimo legível, sem mudar cores, layout ou animações.

**Melhorias**
- Desktop/tablet: mínimo de 11px (antes 8–10px) para rótulos de seção, atalhos do hero, "Iniciar um projeto", "Vamos conversar", categorias dos serviços, legendas dos projetos, rótulos do formulário, rodapé e legenda e categoria do card principal dos serviços.
- Celular: mínimo de 12px para os mesmos textos (antes alguns tinham 7px, como os atalhos do hero).
- Textos decorativos (barras de navegador dos mockups, legendas de arte): mínimo de 10px.
- Etiquetas em caixa alta com espaçamento entre letras um pouco menor ao crescer.

**Observações técnicas**
- Contraste já atendia WCAG AA: todos os textos pequenos medidos tinham pelo menos 5,6:1.
- Sem rolagem lateral em 390 e 1440px; a página do celular ficou 128px mais alta (atalhos do hero em três linhas).

## 17/11/2026 — Serviços: direção de arte harmonizada com a homepage

**Resumo:** com as dez composições integradas, a seção de serviços parecia uma vitrine à parte (fundos roxos, dez ícones roxos preenchidos e brilhando, palco com grade, brilho e anel roxos fortes). O refinamento aproxima a seção da linguagem do restante do site: preto predominante, linhas finas e roxo só como acento. Estrutura, textos, imagens e interações preservados; apenas CSS.

**Card principal (palco)**
- Fundo preto com leve tom roxo no centro (antes um radial roxo forte); grade e brilho roxos mais discretos; anel de progresso sem brilho; cantos roxos mantidos.
- Nova linha fina separando a imagem do título, como nas outras seções.
- Imagem do palco um pouco menor (até 420px, antes 470px), mais alta e levemente mais escura, deixando espaço negativo para a tipografia.

**Cards secundários**
- Superfície preta (#0B0B0E) com borda fina neutra; roxo apenas no card selecionado (borda e uma linha roxa no topo), sem brilho roxo.
- Ícones com contorno roxo fino; o preenchimento roxo ficou só no serviço selecionado, sem brilho.
- Hover: borda clara e sombra preta, elevação de 3px (antes 4px com brilho roxo).
- Ilustração com 120px de altura (antes 132px), para o texto voltar a ser o centro do card. Nos cards não selecionados a imagem fica mais escura (só brilho, sem alterar as cores das marcas).

**Motion**
- Mais discreto e igual em todos os serviços: flutuação menor, inclinação menor (50% nos cards, 60% no palco) e avanço no hover de 14px nos cards e 16px no palco.

**Usabilidade**
- Serviço selecionado identificável pela borda roxa, pela linha no topo e pelo ícone preenchido; títulos e descrições com o mesmo contraste.

## 17/11/2026 — Design Digital: nova composição visual (10 de 10 serviços)

**Resumo:** o serviço Design Digital (08 / Design & experiência) passou a usar a composição fornecida (notebook com interface de design e "Aa", paletas de cores, mesa digitalizadora com caneta, ferramenta vetorial, ícone de imagem, lâmpada, segundo "Aa" e caneca GX Smart), no card pequeno e no card grande. Mesmo componente dos serviços anteriores; nome, descrição, numeração e CTA preservados. Com isso, os dez serviços usam as novas composições.

**Melhorias**
- Imagem otimizada: 1254×1254 (134 KB) → 640×640 WebP (47 KB), carregada sob demanda.
- Card grande (desktop): composição com ~447×416px, centralizada acima de "Design Digital"; a mesa digitalizadora fica inteira e só o reflexo do piso se dissolve.
- Card pequeno: imagem ~30% maior, centrada no notebook, na tipografia e nas paletas.
- Tablet: 150px centralizado no palco. Celular: 112px à direita, sem sobrepor o título e o subtítulo.
- Movimento: flutuação, inclinação, avanço no hover e transição ao selecionar, reaproveitados; parado com movimento reduzido.

**Desempenho**
- Como nenhum serviço usa mais a cena WebGL do palco, o módulo `services3d` deixou de ser carregado (flag `SERVICES_WEBGL = false` em `src/motion/index.js`). Isso elimina o segundo contexto WebGL e o laço de animação dessa cena. As cenas 3D do hero, do manifesto e do contato continuam iguais.
- As regras de CSS compartilhadas passaram a usar `.sc-card:has(.market-scene)` no lugar da lista dos dez serviços, com o mesmo resultado.

## 17/11/2026 — Landing Pages: nova composição visual

**Resumo:** o serviço Landing Pages (10 / Páginas de conversão) passou a usar a composição fornecida (página de conversão "Uma página. Um objetivo." com botão e cursor, foguete, alvo e seta, gráfico de crescimento, ícone de público e pedestal), no card pequeno e no card grande. Mesmo componente dos serviços anteriores; nome, descrição e CTA preservados.

**Melhorias**
- Imagem otimizada: 1254×1254 (144 KB) → 640×640 WebP (50 KB), carregada sob demanda.
- Card grande (desktop): composição com ~447×416px, centralizada acima de "Landing Pages"; o pedestal fica e só o reflexo do piso se dissolve. Cena WebGL antiga oculta e não desenhada com o serviço ativo.
- Card pequeno: imagem ~30% maior, centrada na página de conversão e no foguete, com máscara mais fechada e fade no topo para integrar ao card.
- Tablet: 150px centralizado no palco. Celular: 112px à direita, sem sobrepor o título e o subtítulo.
- Movimento: flutuação, inclinação, avanço no hover e transição ao selecionar, reaproveitados; parado com movimento reduzido.

**Observações técnicas**
- A cena WebGL do palco agora só é desenhada para Design Digital (08), o único serviço que ainda usa o visual 3D antigo.

## 17/11/2026 — Gestão de Tráfego (Tráfego Pago): nova composição visual

**Resumo:** o serviço Gestão de Tráfego (09 / Mídia & performance), solicitado como "Tráfego Pago", passou a usar a composição fornecida (painel de anúncio "Seu produto" com fone, gráficos de crescimento, alvo e seta, megafone e ícones de público, desempenho e meta sobre o pedestal), no card pequeno e no card grande. Mesmo componente dos serviços anteriores; nome, descrição, numeração e CTA preservados.

**Melhorias**
- Imagem otimizada: 1254×1254 (152 KB) → 640×640 WebP (52 KB), carregada sob demanda.
- Card grande (desktop): composição com ~447×416px, centralizada acima de "Gestão de Tráfego"; o pedestal com os três ícones fica e só o reflexo do piso se dissolve. Cena WebGL antiga oculta e não desenhada com o serviço ativo.
- Card pequeno: imagem ~30% maior, centrada no painel do anúncio e no gráfico, com máscara mais fechada e fade no topo para integrar ao card.
- Tablet: 150px centralizado no palco. Celular: 112px à direita, sem sobrepor o título e o subtítulo.
- Movimento: flutuação, inclinação, avanço no hover e transição ao selecionar, reaproveitados; parado com movimento reduzido.

**Observações técnicas**
- A cena WebGL agora só é desenhada para Design Digital (08) e Landing Pages (10); conferido que Design Digital continua renderizando.

## 17/11/2026 — Produção Audiovisual: nova composição visual

**Resumo:** o serviço Produção Audiovisual (07 / Vídeo & conteúdo) passou a usar a composição fornecida (câmera GX Smart com lente em destaque, notebook com software de edição, claquete, película, onda de áudio, fones e pedestal), no card pequeno e no card grande. Mesmo componente dos serviços anteriores; nome, descrição e CTA preservados.

**Melhorias**
- Imagem otimizada: 1254×1254 (145 KB) → 640×640 WebP (50 KB), carregada sob demanda.
- Card grande (desktop): composição com ~447×416px, centralizada acima de "Produção Audiovisual", com a câmera como protagonista; o pedestal fica e só o reflexo do piso se dissolve. Cena WebGL antiga oculta e não desenhada com o serviço ativo.
- Card pequeno: imagem ~35% maior, centrada na câmera e na lente, com notebook, claquete, fones e ícones ainda visíveis. Como o fundo desta imagem é um pouco mais claro, a máscara é mais fechada nas laterais e há fade no topo, para não aparecer um retângulo.
- Tablet: 150px centralizado no palco. Celular: 112px à direita, sem sobrepor o título e o subtítulo.
- Movimento: flutuação, inclinação, avanço no hover e transição ao selecionar, reaproveitados; parado com movimento reduzido.

**Observações técnicas**
- Os serviços 01 a 07 usam composições em HTML; a cena WebGL só é desenhada para os serviços 08 a 10.

## 17/11/2026 — Social Media: nova composição visual

**Resumo:** o serviço Social Media (06 / Conteúdo & conexão) passou a usar a composição fornecida (smartphone com publicação GX Smart, Instagram, Facebook, TikTok, YouTube, curtidas, seguidores, gráfico, megafone, alvo e pedestal), no card pequeno e no card grande. Mesmo componente dos serviços anteriores; nome, descrição e CTA preservados.

**Melhorias**
- Imagem otimizada: 1254×1254 (166 KB) → 640×640 WebP (56 KB), carregada sob demanda.
- Card grande (desktop): composição com ~447×416px, centralizada acima de "Social Media"; o pedestal fica visível e só o reflexo do piso se dissolve. Logos das redes com as cores originais. Cena WebGL antiga oculta e não desenhada com o serviço ativo.
- Card pequeno: imagem ~25% maior, centrada no smartphone e nos ícones das redes.
- Tablet: 150px centralizado no palco. Celular: 112px à direita, sem sobrepor o título e o subtítulo.
- Movimento: flutuação, inclinação, avanço no hover e transição ao selecionar, reaproveitados; parado com movimento reduzido.

**Observações técnicas**
- Os serviços 01 a 06 usam composições em HTML; a cena WebGL só é desenhada para os serviços 07 a 10.

## 17/11/2026 — Desenvolvimento de Sites: nova composição visual

**Resumo:** o serviço Desenvolvimento de Sites (05 / Presença digital) passou a usar a composição fornecida (notebook com o site GX Smart, ícones de código, imagem, "Aa", paleta, WordPress e globo), no card pequeno e no card grande. Mesmo componente dos serviços anteriores; nome, descrição e CTA preservados.

**Melhorias**
- Imagem otimizada: 1254×1254 (165 KB) → 640×640 WebP (52 KB), carregada sob demanda.
- Card grande (desktop): composição com ~447×407px, centralizada acima de "Desenvolvimento de Sites"; a base se dissolve logo abaixo dos ícones WordPress e globo. Cena WebGL antiga oculta e não desenhada com o serviço ativo.
- Card pequeno: imagem ~25% maior, centrada no notebook.
- Tablet: 150px centralizado no palco. Celular: 100px à direita, menor que nos outros serviços para deixar folga para o título longo.
- Movimento: flutuação, inclinação, avanço no hover e transição ao selecionar, reaproveitados; parado com movimento reduzido.

**Observações técnicas**
- Os serviços 01 a 05 usam composições em HTML; a cena WebGL só é desenhada para os serviços 06 a 10.

## 17/11/2026 — E-commerce: nova composição visual

**Resumo:** o serviço E-commerce (02 / Loja virtual) passou a usar a composição fornecida (notebook com a loja, fone, carrinho com sacola e caixa, ícones de sacola e %, selo "Compra confirmada" e escudo), no card pequeno e no card grande. Mesmo componente dos serviços anteriores; nome, descrição e CTA preservados.

**Melhorias**
- Imagem otimizada: 1254×1254 (158 KB) → 640×640 WebP (52 KB), carregada sob demanda.
- Card grande (desktop): composição com ~447×402px, centralizada acima de "E-commerce"; a base se dissolve abaixo do selo e do escudo. A cena WebGL antiga (incluindo o carrinho ajustado na Fase 3) fica oculta e não é desenhada com o serviço ativo.
- Card pequeno: imagem ~25% maior, centrada no notebook e no carrinho.
- Tablet: 150px centralizado no palco. Celular: 112px à direita, com folga para o título e o subtítulo.
- Movimento: flutuação, inclinação, avanço no hover e transição ao selecionar, reaproveitados; parado com movimento reduzido.

**Observações técnicas**
- Com isso, os serviços 01 a 04 usam composições em HTML; a cena WebGL só é desenhada para os serviços 05 a 10.

## 17/11/2026 — Marketing Digital: nova composição visual

**Resumo:** o serviço Marketing Digital (04 / Estratégia & campanhas) passou a usar a composição fornecida (notebook com gráficos, alvo e seta, megafone, cards flutuantes de métricas, anúncio e calendário), no card pequeno e no card grande. Mesmo componente de Marketplaces e Lives; nome, descrição e CTA preservados. Gestão de Tráfego (09) não foi alterado.

**Melhorias**
- Imagem otimizada: 1254×1254 (136 KB) → 640×640 WebP (44 KB), carregada sob demanda.
- Card grande (desktop): composição com ~447×393px, centralizada acima de "Marketing Digital"; o reflexo do piso se dissolve abaixo do notebook. Cena WebGL antiga oculta e não desenhada com o serviço ativo.
- Card pequeno: imagem ~25% maior, centrada no notebook e nos gráficos.
- Tablet: 150px centralizado no palco. Celular: 112px à direita, com folga para o título e o subtítulo.
- Movimento: flutuação, inclinação, avanço no hover e transição ao selecionar, reaproveitados; parado com movimento reduzido.

## 17/11/2026 — Lives de Vendas: nova composição visual

**Resumo:** o serviço Lives de Vendas passou a usar a composição fornecida (celular com live, apresentadora, produto, ring light, sacola GX Smart, selo LIVE e carrinho), no card pequeno e no card grande. Mesmo componente e animações de Marketplaces; nenhuma imagem ou modelo novo gerado.

**Melhorias**
- Imagem otimizada: 1218×1291 (158 KB) → 640×678 WebP (55 KB), carregada sob demanda.
- Card grande (desktop): composição em destaque (~447×439px), centralizada acima de "Lives de Vendas"; o pedestal se dissolve no fundo, sem corte reto. Quando Lives está ativo, a cena WebGL antiga fica oculta e não é desenhada.
- Card pequeno: imagem cerca de 30% maior e centrada no celular, para a apresentadora ficar reconhecível; o pedestal fica de fora.
- Tablet e celular: mesmo posicionamento já usado em Marketplaces (150px centralizado no tablet; 128px à direita no celular, sem sobrepor o título).
- Movimento: flutuação, inclinação com o mouse, avanço no hover e transição ao selecionar o serviço, reaproveitados; parado com movimento reduzido.

**Observações técnicas**
- O componente virou compartilhado: `cardVisual()` usa uma tabela `SCENES` (Marketplaces e Lives) e o CSS usa variáveis por cena (`--scene-mask`, `--scene-fade`, `--crop-px`, `--frame-ratio`, `--art-h`, `--art-shift`). Marketplaces continua com os mesmos valores.
- As classes CSS mantêm o prefixo `market-` da primeira implementação.

## 17/11/2026 — Card Marketplace: composição também no card grande

**Resumo:** o card grande à esquerda (palco dos serviços) passou a mostrar a mesma composição de marketplaces do card pequeno, no lugar dos três ícones 3D antigos. Asset reutilizado; nenhuma imagem ou modelo novo.

**Melhorias**
- Desktop: com Marketplaces ativo, a cena WebGL dos três ícones fica oculta (e deixa de ser desenhada) e a composição aparece em destaque, com cerca de 447×416px num palco de 534×780px. Fica centralizada acima do título "Marketplaces" e do subtítulo, sem encostar no texto. Ao trocar de serviço, as duas camadas fazem um cross-fade e as outras cenas 3D voltam normalmente.
- Movimento: as mesmas animações do card pequeno, um pouco mais perceptíveis no palco (flutuação 2×, inclinação 100% em vez de 70%, avanço de 30px no hover). A inclinação reaproveita o código de ponteiro que já existia para os cards, agora aplicado também ao palco.
- Tablet (até 899px): composição com 150px de altura no palco fixo, centralizada.
- Celular (até 599px): composição com 128px no canto superior direito do palco, acima do título e do subtítulo, sem sobreposição e sem rolagem lateral.
- Card pequeno: sem mudança de tamanho; as animações passaram a usar variáveis (`--float-amp`, `--tilt-k`, `--hover-z`) compartilhadas com o palco.

**Observações técnicas**
- O palco usava a versão HTML dos três ícones só como reserva para celular e movimento reduzido; agora essa versão também é a composição, então celular e movimento reduzido mostram a imagem nova, parada no modo reduzido.

## 17/11/2026 — Card Marketplace: visual 3D animado

**Resumo:** o card "Marketplaces" da lista de serviços passou a usar a composição de referência (Mercado Livre, Shopee, TikTok Shop, celular, caixa, pino e órbitas roxas), com movimento 2.5D. Os outros cards e o palco 3D grande não mudaram.

**Melhorias**
- Imagem de referência otimizada: 1220×1289 (140 KB) → 640×676 WebP (50 KB), carregada sob demanda.
- Integração com o fundo: máscara radial nas bordas e `mix-blend-mode: lighten`, que dissolve o fundo escuro da imagem sem alterar as cores dos logos. Logos sempre com as cores originais, mesmo com o card inativo.
- Movimento: flutuação vertical suave (6,5 s, ±3 px) com sombra que acompanha; inclinação pelo ponteiro reaproveitando as variáveis `--tilt-x`/`--tilt-y` que os cards já recebem; no hover ou foco a composição avança levemente (`translateZ`) e volta ao estado inicial ao sair. Tudo em CSS, sem novo laço JavaScript.
- Mesma altura de ilustração dos outros cards; a imagem ocupa o quadro + 18 px, e só o reflexo do piso fica de fora.

**Limitações**
- A imagem é uma camada única: o conjunto inclina e flutua junto, mas os objetos não se movem de forma independente. Isso exigiria cada objeto em arquivo separado (logos, celular, caixa, pino).
- Celular e tablet (até 899px) não mostram ilustrações nos cards de serviço, então a composição aparece a partir de 900px. A versão estática do palco no celular continua com os três logos.
- Com movimento reduzido: sem flutuação, sem inclinação e sem transição.

## 17/11/2026 — Fase 5: acabamento final

**Resumo:** auditoria de acessibilidade, verificação de rolagem lateral em 4 tamanhos de tela e correção de três problemas de layout no tablet.

**Correções (tablet, 600–899px)**
- "Cada marca. Um universo." ficava preso à direita, com a coluna esquerda vazia; agora fica alinhado à esquerda, como no celular.
- A legenda "DO CONCEITO À CONSTRUÇÃO" do cubo da seção de processo saía cortada pela borda direita; agora fica oculta, como já acontecia no celular.
- A descrição dos cards de serviço ocupava só metade dos cards largos; agora usa a largura disponível (até 62 caracteres por linha).

**Auditoria (sem problemas encontrados)**
- Navegação por Tab passa pelos 66 elementos clicáveis em ordem lógica e todos mostram contorno de foco de 2px.
- Todas as imagens têm texto alternativo, todos os campos do formulário têm rótulo, não há IDs duplicados e o idioma da página é `pt-BR`.
- Contraste: só o "EXPERIÊNCIAS." vazado do título principal ficou abaixo do mínimo, e isso é intencional (texto só com contorno).
- Sem rolagem lateral em 1440, 1024, 768, 390 e 360px de largura.

**Observações técnicas**
- O texto escuro atrás da loja 3D (anotado na Fase 3) era um quadro capturado no meio da transição entre duas cenas de serviço. Com a cena parada ele não aparece.
- A seção branca "A conexão faz a diferença" usa fundo claro (#f6f5f8), fora da paleta oficial. Não foi alterada; depende de aprovação.

## 17/11/2026 — Fase 4: serviços e área comercial

**Resumo:** cards de serviço mais legíveis e com mais profundidade, efeito de hover consertado, mesmo destaque para quem navega pelo teclado e botão de conversão "QUERO VENDER MAIS" com mais presença. Conteúdo, links e logos dos marketplaces preservados.

**Melhorias**
- Cards de serviço: descrição de 13px para 14px, fundo com gradiente roxo bem sutil e ilustrações dos cards inativos menos apagadas (opacidade de 0,55 para 0,7).
- Teclado: quando um card recebe foco, ele sobe, a borda fica roxa e a ilustração aparece por inteiro, como no hover.
- "Seu produto está parado?": botão maior (texto de 12px para 13px, mais espaço interno), brilho roxo suave em volta e seta que se move no hover. Canais (Marketplaces, Lojas virtuais...) de 10px para 11px.

**Correções**
- O leve levantar dos cards no hover não funcionava: a animação de entrada deixava `translate: none` inline em cada card. Agora funciona e é desligado no modo de movimento reduzido.

**Observações técnicas**
- Tudo em `src/layout-refined.css` (cópia em `dist/assets/`); nenhum JavaScript alterado.
- O texto um pouco maior deixou a página 37px mais alta no desktop e 82px no celular.

## 17/11/2026 — Fase 3: refinamento 3D

**Resumo:** a cena 3D faz menos trabalho a cada quadro, reduz a resolução sozinha em computadores lentos e o carrinho do e-commerce não cobre mais o texto da loja. Nenhum modelo 3D foi criado ou trocado.

**Melhorias**
- Resolução adaptável nas duas cenas 3D (principal e serviços): se a animação ficar abaixo de cerca de 40 quadros por segundo, a resolução cai em passos de 0,25 até o mínimo de 1×. Com a animação a 60 quadros, nada muda.
- Cena principal e cena de serviços: a imagem estática de reserva é escondida uma única vez quando o 3D aparece, em vez de ser alterada a cada quadro.
- E-commerce: o carrinho ficou 10% menor e um pouco mais baixo, e "Compra segura · Entrega rápida" ficou legível.

**Observações técnicas**
- Teste com processador 8× mais lento e tela 2×: a resolução caiu de 1,75 para 1,50 e depois 1,25. Sem lentidão, ficou em 1,75 e a 60 quadros por segundo.
- Celular e modo de movimento reduzido continuam usando as imagens estáticas, sem WebGL.
- Ainda aparece um texto escuro e fraco atrás da loja 3D no card de e-commerce. A imagem de reserva está escondida, então ele vem da própria cena; fica para investigar depois.

## 17/11/2026 — Fase 2: motion design

**Resumo:** menos rolagem presa nas duas seções fixas da home e título de vendas visível desde a entrada da seção. A sequência das animações, o 3D e o visual continuam iguais.

**Melhorias**
- "Seu produto está parado?": "VENDAS ONLINE" e a primeira linha do título aparecem enquanto a seção entra na tela. Antes a área de texto ficava vazia até a seção travar no topo.
- "Seu produto está parado?": o trecho fixo caiu de 110% para 70% da altura da tela, e a sequência do produto girando foi reorganizada para caber nesse espaço.
- Manifesto "Ideias em movimento → Ideias que transformam": o trecho fixo caiu de 140% para 100% da altura da tela.
- No desktop (1440×900), a página ficou 720px mais curta (de 14.357 para 13.637px).

**Observações técnicas**
- Celular e modo de movimento reduzido não usam esses trechos fixos e não mudaram.
- A suspeita de "I" e "D" colados em "IDEIAS" (anotada na Fase 1) era efeito de captura em baixa resolução; em 2× as letras estão separadas. Nada foi alterado ali.

## 17/11/2026 — Fase 1: layout e tipografia

**Resumo:** correção de títulos cortados e redução de espaços vazios entre seções, sem mudar o design, as cores, o conteúdo ou os elementos 3D.

**Melhorias**
- Menos espaço vazio entre "O estúdio" e "O que nos guia" (cerca de 60px a menos no desktop; a faixa "Tecnologia. Criatividade. Resultados." ficou 100px mais curta no celular).
- Menos espaço no fim da seção "A conexão faz a diferença".

**Correções**
- Acentos de letras maiúsculas (Í, Ã, Õ, Ê) não são mais cortados pelas máscaras de revelação dos títulos (ex.: "CONSTRUÍ-LO.").
- "O FUTURO." em "Conexões que movem o futuro" agora aparece inteiro quando a frase chega ao meio da tela; antes só terminava de aparecer perto do topo.

**Observações técnicas**
- Os arquivos da raiz (package.json, index.html, vite.config) não estão no projeto, então não é possível gerar a build. A pasta `dist/` continua sendo a versão publicada: as mudanças foram aplicadas em `src/` e espelhadas em `dist/`, como nas fases anteriores.
- Novo arquivo `src/layout-refined.css` (cópia em `dist/assets/`), carregado depois dos outros estilos.
