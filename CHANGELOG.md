# Changelog — GX Smart

Histórico das fases de refinamento publicadas no GitHub. O histórico anterior (12 a 15/11/2026) está em [docs/CHANGELOG.md](docs/CHANGELOG.md).

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
