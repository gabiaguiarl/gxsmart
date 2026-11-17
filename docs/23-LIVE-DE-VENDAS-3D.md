# Live de vendas 3D — 15/11/2026
- Faixa vermelha AO VIVO, apresentadora ilustrada demonstrando o produto, comentários e botão COMPRAR AGORA.
- Celular, ring light com suporte, produto em pedestal e placa OFERTA DA LIVE com geometria real. Ilustração da tela em textura canvas. Sem dependências ou downloads adicionais.
- Movimento suave sem flashes; mantém pausa fora da tela e fallback estático mobile/reduced-motion da infraestrutura existente.
- Arquivos: src/live-premium.js e .css; services3d.js, components.js, main.js; integração pontual nos módulos correspondentes em dist. Backups .before-live.
- Lint, bundle de verificação e sintaxe passaram; QA visual desktop 1365px/mobile 390px sem overflow ou sobreposição com títulos. Capturas em docs/screenshots/live-premium-*.png.
- Fontes ainda anteriores ao dist, conforme etapa 21. Não reconstruir a página inteira antes da reconciliação. Sem publicação.
