# Design system

## Objetivo da etapa
Aplicar identidade preta, branca e roxa com hierarquia editorial.

## Implementações realizadas
Tokens CSS, tipografia Space Grotesk, títulos fluidos, botões, linhas, estados de foco e contraste. Logo oficial preservada sem edição.

## Arquivos modificados
src/style.css; public/assets/logo.png

## Tecnologias utilizadas
Vite 6, JavaScript ES Modules, CSS, GSAP 3 e Three.js 0.180. Versões exatas em package-lock.json após instalação.

## Decisões técnicas
Uma família tipográfica com fallback Arial. Roxo oficial #7809AC; textos de apoio #BDBDBD. Fonte externa funciona com fallback.

## Testes realizados
Lint sem erros; 2 testes passaram; build Vite aprovado. Inspeção visual desktop e mobile 390 × 844 realizada. Detalhes em docs/09-TESTES-E-CORRECOES.md.

## Pendências
Auto-hospedar fonte antes de produção para eliminar dependência externa.

## Instruções para outra IA
Leia AGENTS.md, estado atual e backlog. Inspecione os arquivos listados antes de alterar. Preserve identidade, fontes reais e fallback.

## Status
CONCLUÍDO no escopo local. Pendências de produção explicitadas acima.
