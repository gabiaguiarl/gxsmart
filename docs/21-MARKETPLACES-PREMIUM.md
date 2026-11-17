# Marketplaces premium — 15/11/2026

- Shopee, Mercado Livre e TikTok Shop: composição triangular, corpos arredondados com espessura real; logos das referências em texturas WebP (~67 KB total). Os símbolos nas faces são texturas, não geometria extrudada.
- Three.js e renderer existentes; flutuação senoidal, rotação limitada, hover com suavização; fallback CSS mobile. Pausa fora da tela e respeito a movimento reduzido.
- Arquivos: src/marketplace-premium.js, marketplace-premium.css, marketplace-fallback-motion.js; integração em services3d.js, components.js, main.js. Assets em public/assets/marketplaces e dist/assets/marketplaces.
- A cópia recebida está sem package.json/index.html raiz e tem fontes anteriores ao dist. Por isso os dois módulos compilados de serviços/template foram ajustados pontualmente, sem reconstruir outras seções. Backups .before-marketplace preservados. Não executar rebuild completo antes de reconciliar fontes e dist.
- Validação: lint dos módulos alterados; bundle de verificação em memória via esbuild; sintaxe dos módulos compilados; 9 testes existentes; capturas desktop 1365px/mobile 390px; nenhum overflow horizontal; reduced-motion sem animação.
- Capturas: docs/screenshots/marketplace-premium-desktop.png e marketplace-premium-mobile.png.
- Localhost: http://127.0.0.1:5173/. Sem publicação.
