# Auditoria inicial — 12/11/2026
## Objetivo da etapa
Inspecionar arquitetura e preservar conteúdo verdadeiro antes do redesign.
## Implementações realizadas
Pasta local contém apenas .git, sem commits ou arquivos. Site público é WordPress/Elementor. HTML de referência salvo em docs/original-home.html, apenas para auditoria, fora do build.
Inventário: Home, /quemsomos/, /home/#contato, /cartao-virtual/. Serviços: institucional, landing page, e-commerce, design, tráfego, marketing, social media, catálogo WhatsApp e Google Meu Negócio. Projetos: Samsara Essence, Fênix Services, MDG Automação, Área Monitorada, Loja Fênix, VDM3D e quatro cartões virtuais. Formulário Elementor com nome, email, telefone e mensagem; endpoint depende do WordPress, não transplantável sem backend. Contatos: sac@gxsmart.com.br; WhatsApp 5511988663489 e 5511977085852; Instagram gxsmartofc. Endereço: R. Dr. Oscar Egydio de Araújo, 526, Jardim Silva Teles, São Paulo/SP, 08160-620.
## Arquivos modificados
AGENTS.md; package.json; docs/original-home.html; docs/01-AUDITORIA-INICIAL.md.
## Tecnologias utilizadas
Origem: WordPress/Elementor; destino local: Vite/JS, GSAP e Three.js. Não existe arquitetura local a migrar.
## Decisões técnicas
Referência Fênix analisada: hierarquia clara, serviços numerados, CTAs e jornada objetiva, sem copiar identidade. Origem GX repete blocos de serviços, diferenciais e citações. Reduzir duplicações e manter inventário. Não prometer suporte 24h sem validação: descrição original é inconsistente. Não inventar métricas. Processo de cinco etapas será identificado como proposta a alinhar.
## Testes realizados
Leitura do repositório e dos sites públicos. Download da home bem-sucedido. URL /quem-somos/ retorna 404; usar /quemsomos/ conforme link real.
## Pendências
Preservar imagens e investigar vídeos; backend de formulário não fornecido.
## Instruções para outra IA
Consulte HTML de referência para origem de assets e links. Não publique este HTML como nova home.
## Status
CONCLUÍDO

## Correção da coleta
A URL oficial /quemsomos/ também retornou 404 no download. O capítulo institucional foi implementado na home; não se afirma que a rota antiga funciona. Vídeos não encontrados no HTML coletado. Logo e seis imagens de projetos baixados com sucesso.
