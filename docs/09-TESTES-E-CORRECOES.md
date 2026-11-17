# Testes e correções

## Objetivo da etapa
Verificar build, sintaxe, comportamento e layout.

## Implementações realizadas
Testes de URL WhatsApp e integridade do portfólio adicionados. ESLint configurado. QA em andamento.

## Arquivos modificados
src/data.test.js; eslint.config.js; package.json

## Tecnologias utilizadas
Vite 6, JavaScript ES Modules, CSS, GSAP 3 e Three.js 0.180. Versões exatas em package-lock.json após instalação.

## Decisões técnicas
Não testar apenas aparência por snapshots; verificar fluxo e fontes.

## Testes realizados
Lint sem erros; 2 testes passaram; build Vite aprovado. Inspeção visual desktop e mobile 390 × 844 realizada. Detalhes em docs/09-TESTES-E-CORRECOES.md.

## Pendências
Executar lint, testes, build e inspeção visual.

## Instruções para outra IA
Leia AGENTS.md, estado atual e backlog. Inspecione os arquivos listados antes de alterar. Preserve identidade, fontes reais e fallback.

## Status
CONCLUÍDO no escopo local. Pendências de produção explicitadas acima.

## Resultado da sessão — 12/11/2026
- npm install: 102 pacotes, auditoria sem vulnerabilidades; aviso de suporte da versão ESLint 9, avaliar atualização futura.
- npm run lint: aprovado.
- npm test: 2/2 aprovados (codificação de texto WhatsApp e inventário único).
- npm run build: aprovado; chunks separados para cena Three.js.
- Navegador: logo e hero 3D renderizados no desktop; navegação até projetos; filtro Institucional removeu quatro projetos e manteve Fênix/Área Monitorada; menu mobile abriu e fechou após navegação.
- Mobile 390 × 844: largura do documento 375px dentro da viewport, zero canvas, fallback visível. Console sem erros ou avisos capturados.
- Prévia inicialmente falhou por restrição de rede; servidor reiniciado com autorização e acesso resolvido.
- Formulário não enviado para evitar comunicação real; URL de destino e codificação testadas automaticamente.
- Não executados: Lighthouse, métricas de campo, leitores de tela, redução de movimento em emulação, hardware físico, teste completo de links externos.
- HTML pré-renderizado adicionado após QA para manter texto e links no documento de produção; lint/test/build repetidos.

## Resultado da sessão Motion 3.0 — 12/11/2026
- lint aprovado; npm test 6/6 (novo src/render.test.js: serviços no palco e nos cards, camadas decorativas com aria-hidden, ids únicos, ícones desenháveis); build aprovado.
- Playwright/Chrome headless com WebGL por software: 1440×900, 1024×768, 390×844 e reduced-motion; abertura quadro a quadro; script de interações (serviço ativo, CTA, formulário sem envio real, filtro, resize, teclado). Console sem erros após correções.
- Não executados: GPU real, Safari/Firefox, dispositivos físicos, FPS, Lighthouse, leitores de tela. Detalhes em docs/14.

## Resultado da sessão 4.0 — 12/11/2026
lint aprovado; npm test 8/8 (novos: idioma sem frases em inglês; traçado do GX emitido uma vez); build aprovado. Playwright/Chrome headless com WebGL por software em 1440×900, 390×844 e reduced-motion; sequências do hero, manifesto, natureza e frase conectada; script de interações; 2 canvases no desktop, 0 no mobile/reduced, sem overflow, console sem erros. Não executados: GPU real, Safari/Firefox, dispositivos físicos, FPS, Lighthouse, leitores de tela. Detalhes em docs/15.

## Resultado da sessão 5.0 — 12/11/2026
lint aprovado; npm test 9/9; build aprovado. Playwright: sequência da chamada comercial, os 10 objetos de serviço por clique, sincronia clique↔scroll, seleção por scroll, transição, mobile (toque), teclado, reduced-motion e regressão das interações anteriores; console sem erros. Não executados: GPU real, Safari/Firefox, dispositivos físicos, FPS, Lighthouse, leitores de tela. Detalhes em docs/16.

## Resultado da sessão 6.0 — 12/11/2026
lint aprovado; npm test 9/9; build aprovado. Auditoria de alturas antes/depois (desktop 27,3 → 19,4 telas; mobile 19,6 → 18,7), rolagem completa com roda ida e volta, sequências encurtadas, troca de serviços por clique/corpo do card/CTA, mobile por toque com e sem redução de movimento, regressão das interações e verificação de âncoras. Não executados: GPU real, Safari/Firefox, dispositivos físicos, FPS, Lighthouse, leitores de tela. Detalhes em docs/17.
