# Changelog — GX Smart

Histórico das fases de refinamento publicadas no GitHub. O histórico anterior (12 a 15/11/2026) está em [docs/CHANGELOG.md](docs/CHANGELOG.md).

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
