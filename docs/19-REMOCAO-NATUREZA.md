# 19 — Remoção da natureza

## Objetivo
Retirar a quebra de natureza por solicitação do usuário.

## Status
EM ANDAMENTO

## Implementações realizadas
Removidos seção verde, folhagens SVG, timeline, estado bus, preset e luz verde do renderer, estilos e capítulo do trilho. Portfólio segue direto para diferenças. Instagram permanece no footer. Numeração ajustada.
## Arquivos modificados
src/render.js; src/components.js; src/motion/index.js; src/motion/bus.js; src/scene.js; src/motion.css; src/render.test.js; index.html gerado; AGENTS.md e documentação.
## Tecnologias e decisões
Stack existente, sem novas dependências. Remoção completa, sem seção substituta.
## Testes realizados
Lint e build passaram; 9 testes passaram após atualizar a contagem de usos do SVG para a remoção do segundo fallback. Aviso preexistente do chunk Three.js >500 kB permanece. Sem nova inspeção visual nesta sessão.
## Pendências
Nenhuma de implementação; QA visual adicional opcional.
## Instruções para outra IA
Não reintroduzir natureza; conteúdo atual está em render.js. Histórico anterior mantém referência à seção removida.
## Status final
CONCLUÍDO. Nada publicado.
