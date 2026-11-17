# 20 — Serviços 3D mais claros
## Objetivo
Identificar seis marketplaces no 3D e tornar as cenas fáceis de compreender, com objetos familiares e textos curtos.
## Status
EM ANDAMENTO
## Decisão
Nomes tipográficos das plataformas, sem simular logos oficiais ou parceria. Manter fallback com a mesma informação, carregamento sob demanda e seleção por scroll.

## Implementações realizadas
Marketplace: seis vitrines 3D com nomes legíveis e cores identificadoras (Amazon, Shopee, Mercado Livre, TikTok Shop, Kwai e Magalu) + pacote Seu produto. Mesma informação nos cards e fallback mobile. Tráfego: funil abstrato substituído por anúncio, botão e três pessoas. E-commerce: Sua loja online em vez de Checkout, sacola com rotação limitada. Sites e redes sociais com termos simples; landing com botão legível. Todas as cenas têm explicação curta no painel, sincronizada ao scroll/clique. Inclinação do palco reduzida para leitura. Nomes são tipográficos, não logos oficiais ou declaração de parceria.
## Arquivos modificados
src/service-labels.js (dados compartilhados); src/services3d.js; src/components.js; src/motion/index.js; src/motion.css; index.html gerado; docs de estado, backlog e changelog.
## Tecnologias e decisões
Three.js/CanvasTexture e CSS existentes; texturas dos nomes com MeshBasicMaterial para cores e contraste independentes da iluminação. Construção sob demanda e descarte preservados.
## Testes realizados
Lint, 9 testes e build passaram. QA visual desktop 1280px: nomes e cena de tráfego legíveis; mobile 390px sem overflow e zero canvas de serviços, seis nomes visíveis no fallback. Corrigida sobreposição inicial de legenda 3D: explicação ficou em HTML abaixo do título. Screenshot: docs/screenshots/marketplaces-identificados.jpg. Aviso preexistente de chunk Three.js >500kB permanece.
## Pendências
Compreensão por diferentes faixas etárias precisa de teste com pessoas reais; não é possível garantir universalmente.
## Instruções para outra IA
Nomes e descrições simples em service-labels.js. Preserve nomes tanto no WebGL como no fallback. Não reintroduza rotação que esconda textos.
## Status final
CONCLUÍDO no escopo local. Nada publicado.
