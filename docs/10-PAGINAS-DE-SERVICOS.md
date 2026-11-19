# 10 — Páginas individuais dos serviços

**Status:** primeira versão das 10 páginas, com **texto provisório** (baseado só no que a home já diz). A GX Smart vai detalhar o que faz em cada serviço; ajustar em `src/servicos/dados.js`.

## Como funciona
- Rotas: `/servicos/<slug>/` (ex.: `/servicos/marketplaces/`). `/servicos/` redireciona para `/#expertise`.
- Dados: `src/servicos/dados.js` (nomes e ordem = cards da home; `kind` = composição 3D existente).
- Gerador: `node scripts/gerar-servicos.mjs` → `dist/servicos/<slug>/index.html` (HTML estático, indexável). Copia cabeçalho e rodapé da home.
- Estilo e motion: `src/servicos/servico.css` e `servico.js` (copiar para `dist/assets/servicos/`). Sem GSAP: IntersectionObserver + CSS; respeita prefers-reduced-motion; sem JS o conteúdo aparece.
- Home: cada card tem "Conhecer o serviço →" (mapa `SERVICE_SLUGS` em `src/components.js` e no bundle).

## Estrutura de cada página
Abertura (arte 3D + motivo geométrico próprio) · O que é (seção branca) · Como a GX ajuda · Como funciona (etapas) · Por que a GX (branca) · Perguntas frequentes · Serviços que combinam · CTA final (WhatsApp com mensagem do serviço + formulário).
Projetos relacionados: omitidos (nenhum case confirmado por serviço).

## Provisório / a confirmar
- Benefícios ("Como a GX ajuda"), pontos do "O que é" e FAQ específica de cada serviço.
- Etapas genéricas (conversa, proposta, execução, próximos passos) — confirmar o processo real.
- Nomes: "Lives de Vendas" e "Gestão de Tráfego" seguem a home (o briefing citava "Live Commerce" e "Tráfego Pago — VESTAP").
- Sem canonical/sitemap até definir o domínio final.
