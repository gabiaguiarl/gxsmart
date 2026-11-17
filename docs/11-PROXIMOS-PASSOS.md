# Backlog priorizado

## Objetivo da etapa
Registrar trabalho remanescente e dependências.
## Implementações realizadas
GX-01 home e assets; GX-02 animações e fallbacks; GX-03 lint/test/build/QA: CONCLUÍDOS no escopo local.
## Arquivos modificados
docs/11-PROXIMOS-PASSOS.md.
## Tecnologias utilizadas
Stack descrita no README; nenhum serviço externo configurado.
## Decisões técnicas
Não substituir produção sem validação de funcionalidades e autorização explícita.
## Testes realizados
Resultados em docs/09-TESTES-E-CORRECOES.md.
## Pendências
| ID | Prioridade | Tarefa | Dependências | Aceite | Status |
|---|---|---|---|---|---|
| GX-04 | P0 | Validar paridade com WordPress, rotas e formulário | Export/código e responsável GX | Inventário funcional validado e envio real testado | BLOQUEADO por insumos |
| GX-05 | P1 | Otimizar imagens e auto-hospedar fonte | Assets locais | WebP responsivo e fonte local sem perda visual | NÃO INICIADO |
| GX-06 | P1 | Medir Lighthouse e CWV | Ambiente de hospedagem definido | Relatório real e correções pertinentes | NÃO INICIADO |
| GX-07 | P1 | Vídeos e processo comercial | Arquivos e confirmação GX | Conteúdo autêntico integrado | BLOQUEADO por insumos |
| GX-08 | P1 | QA ampliado | Dispositivos e ferramentas | Redução de movimento, teclado completo e leitores de tela verificados | NÃO INICIADO |
| GX-10 | P1 | Validar Motion 3.0 em hardware real | Dispositivos/GPUs reais, Safari e Firefox | FPS estável, heurística lite ajustada, sem regressões visuais | NÃO INICIADO |
| GX-11 | P2 | Composição do hero entre 900–1100 px | — | Escultura sem sobrepor a headline | NÃO INICIADO |
| GX-12 | P2 | Avaliar renderer WebGL único | Medição de GX-10 | Decisão registrada em docs/12 | PARCIAL — 4.0 já unificou a marca em um contexto; resta o palco de serviços |
| GX-13 | P1 | Revisar com a GX textos novos (O que nos guia, Conexões que movem o futuro, conceito natureza) e traduções | Responsável GX | Textos aprovados | NÃO INICIADO |
| GX-14 | P2 | Substituir traçado pelo vetor oficial do símbolo, se fornecido | SVG oficial | gx-mark.js regenerado, 3D e fallback atualizados | BLOQUEADO por insumo |
| GX-15 | P1 | Medir custo da máscara do amanhecer e do renderer itinerante em hardware real | GX-10 | Sem quedas perceptíveis de FPS | NÃO INICIADO |
| GX-16 | P0 | Validar com a GX serviços novos (Marketplaces, Lives, Audiovisual), descrições, ordem e textos comerciais | Responsável GX | Textos aprovados | NÃO INICIADO |
| GX-17 | P2 | Usar fotos/vídeos próprios de lives e audiovisual, se autorizados | Material da GX | Conteúdo autêntico integrado | BLOQUEADO por insumo |
| GX-18 | P1 | Conferir o layout de serviços com as capturas de referência (não recebidas na 6.0) | Capturas | Composição aprovada | BLOQUEADO por insumo |
| GX-19 | P0 | SVGs oficiais Shopee e Mercado Livre para o 3D de Marketplaces | Press kit das marcas | Arquivos em public/assets/marketplaces/ e `MARKETPLACE_LOGOS.enabled = true` | BLOQUEADO por insumo |
| GX-20 | P2 | Avaliar título do hero mais direto | Decisão da GX | Título aprovado | NÃO INICIADO |
| GX-09 | P2 | Publicar e definir canonical/metadados sociais | Autorização explícita e GX-04 | Deploy validado | NÃO INICIADO |
## Instruções para outra IA
Motion Design 3.0 (docs/14), Refinamento 4.0 (docs/15) 5.0 (docs/16) 6.0 (docs/17) e 7.0 (docs/18) concluídos localmente. Próxima tarefa: GX-19 (ativar logos oficiais), depois GX-16. Próxima tarefa independente: GX-05; depois GX-10. Preserve trabalho concluído e documente cada alteração.
## Status
EM ANDAMENTO — backlog pós-implementação.
