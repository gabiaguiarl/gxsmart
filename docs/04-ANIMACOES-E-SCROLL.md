# Animações e scroll

## Objetivo da etapa
Criar narrativa coordenada e reversível.

## Implementações realizadas
GSAP ScrollTrigger: saída do hero, deslocamento tipográfico, manifesto pinned com troca de mensagem e rotação, parallax do portfólio, transição branca e progresso do processo.

## Arquivos modificados
src/main.js; src/scene.js; src/style.css

## Tecnologias utilizadas
Vite 6, JavaScript ES Modules, CSS, GSAP 3 e Three.js 0.180. Versões exatas em package-lock.json após instalação.

## Decisões técnicas
Scroll nativo; sem Lenis. GSAP matchMedia limpa timelines ao mudar breakpoint. WebGL pausa fora da viewport e em aba oculta; geometria e materiais descartados. Context loss revela fallback.

## Testes realizados
Lint sem erros; 2 testes passaram; build Vite aprovado. Inspeção visual desktop e mobile 390 × 844 realizada. Detalhes em docs/09-TESTES-E-CORRECOES.md.

## Pendências
Medir fluidez em hardware de entrada.

## Instruções para outra IA
Leia AGENTS.md, estado atual e backlog. Inspecione os arquivos listados antes de alterar. Preserve identidade, fontes reais e fallback.

## Status
CONCLUÍDO no escopo local. Pendências de produção explicitadas acima.

## Atualização 3.0
As timelines deste documento foram migradas para src/motion/index.js e expandidas (abertura, palco de serviços, manifesto cinético, transições). Referência atual: docs/14-MOTION-DESIGN-EXPERIENCE.md.
