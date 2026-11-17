# Portfólio e serviços

## Objetivo da etapa
Preservar projetos e serviços verificáveis.

## Implementações realizadas
Seis projetos, imagens locais originais, filtros acessíveis, quatro links de cartões virtuais; cinco grupos cobrem nove ofertas originais. Formulário prepara texto no WhatsApp real, não simula recebimento.

## Arquivos modificados
src/data.js; src/main.js; public/assets

## Tecnologias utilizadas
Vite 6, JavaScript ES Modules, CSS, GSAP 3 e Three.js 0.180. Versões exatas em package-lock.json após instalação.

## Decisões técnicas
Sem backend Elementor disponível: manter acesso ao contato original, email e ambos WhatsApps públicos. Não transplantar nonces, analytics ou credenciais.

## Testes realizados
Lint sem erros; 2 testes passaram; build Vite aprovado. Inspeção visual desktop e mobile 390 × 844 realizada. Detalhes em docs/09-TESTES-E-CORRECOES.md.

## Pendências
Validar links externos e integrar formulário servidor apenas com acesso autorizado.

## Instruções para outra IA
Leia AGENTS.md, estado atual e backlog. Inspecione os arquivos listados antes de alterar. Preserve identidade, fontes reais e fallback.

## Status
CONCLUÍDO no escopo local. Pendências de produção explicitadas acima.
