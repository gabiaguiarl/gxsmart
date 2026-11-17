# Performance e SEO

## Objetivo da etapa
Reduzir custo visual e manter semântica.

## Implementações realizadas
Import dinâmico de Three.js, DPR máximo 1.5, imagens lazy, dimensões reservadas, HTML pt-BR, título, descrição, favicon, landmarks, h1 único, skip link.

## Arquivos modificados
index.html; src/main.js; src/scene.js

## Tecnologias utilizadas
Vite 6, JavaScript ES Modules, CSS, GSAP 3 e Three.js 0.180. Versões exatas em package-lock.json após instalação.

## Decisões técnicas
Sem métricas inventadas: Core Web Vitals dependem de hospedagem e tráfego. Fonte Google com display swap. Imagens originais ainda PNG.

## Testes realizados
Lint sem erros; 2 testes passaram; build Vite aprovado. Inspeção visual desktop e mobile 390 × 844 realizada. Detalhes em docs/09-TESTES-E-CORRECOES.md.

## Pendências
Otimizar PNG grandes para WebP; medir LCP/CLS/INP em ambiente final. Metadados sociais e canonical após definição da URL.

## Instruções para outra IA
Leia AGENTS.md, estado atual e backlog. Inspecione os arquivos listados antes de alterar. Preserve identidade, fontes reais e fallback.

## Status
CONCLUÍDO no escopo local. Pendências de produção explicitadas acima.

## HTML inicial
O conteúdo é pré-renderizado por scripts/prerender.mjs antes de dev/build. src/render.js concentra o markup; main.js conecta interações sem substituir DOM existente. O documento de produção contém o conteúdo e links mesmo sem JavaScript. Não duplicar edições em index.html: editar render.js e regenerar.
