# 18 — Seleção de serviços pela rolagem
## Objetivo
Trocar automaticamente o card destacado e a cena ao descer/subir pela grade existente, conforme solicitação do usuário.
## Status
EM ANDAMENTO
## Decisão
Preservar layout, ordem, cliques e rolagem natural; nenhuma altura artificial ou pin adicional. A solicitação atual substitui a regra de seleção exclusiva por clique da etapa 6.0.

## Implementações realizadas
ScrollTrigger acompanha o percurso natural da grade e o divide pelo número de cards. Sincroniza destaque, aria-pressed, título, contador, fallback e cena via bus existente. Reversível ao subir. No mobile a linha de leitura fica abaixo do palco sticky. Clique mantém seleção até cruzar outro intervalo. Cleanup de gatilho e eventos no matchMedia. Hint atualizado.
## Arquivos modificados
src/motion/index.js; src/components.js; index.html (gerado); AGENTS.md; docs/10-ESTADO-ATUAL.md; docs/11-PROXIMOS-PASSOS.md; docs/CHANGELOG.md.
## Tecnologias
GSAP/ScrollTrigger existentes; sem dependências novas.
## Testes realizados
Lint aprovado; 9/9 testes passaram; build aprovado. Navegador desktop 1440px: descida 01 → 04 → 06, subida → 04; clique em Lives → 03, scroll seguinte → 05. Card, contador e título sincronizados; cena visual conferida. Screenshot em docs/screenshots/servicos-scroll.jpg. Altura após mudança: 18.228px na viewport de teste (1440×1000); nenhuma alteração de CSS/altura/pin neste patch.
## Pendências
Não repetidos nesta sessão: dispositivos físicos, QA mobile e reduced-motion. Preferências e fallbacks existentes preservados.
## Instruções para outra IA
A regra antiga de seleção exclusiva por clique (etapa 17) foi substituída por pedido explícito do usuário. Não adicionar pin para percorrer os serviços. Ajustar foco de leitura em servicesUI se necessário.
## Status final
CONCLUÍDO no escopo local; nada publicado.
