/* Páginas individuais dos serviços — dados (Fase 5).
   TEXTO PROVISÓRIO: baseado apenas no que o site já comunica (cards da home). Sem preços, prazos,
   métricas ou entregas não confirmadas. A GX Smart vai detalhar o que faz em cada serviço; ajustar aqui.
   Nomes e ordem = cards da homepage. kind = composição 3D existente em /assets/<pasta>/. */

export const WHATSAPP = '5511977085852';

// Etapas genéricas (provisórias): descrevem a conversa comercial, não compromissos de execução.
export const ETAPAS = [
  ['chat', 'Conversa inicial', 'Você conta sobre sua empresa, seus produtos e o que deseja alcançar.'],
  ['map', 'Proposta', 'A equipe apresenta um caminho possível e o orçamento para o seu caso.'],
  ['spark', 'Execução', 'Com tudo alinhado, o trabalho começa conforme o que foi combinado.'],
  ['loop', 'Próximos passos', 'Você acompanha o andamento e decide com a equipe como seguir.'],
];

// Diferenciais verificáveis no próprio site (serviços integrados, design + tecnologia, atendimento direto).
export const DIFERENCIAIS = [
  ['grid', 'Serviços que se conectam', 'Marketplaces, loja virtual, lives, conteúdo, design e anúncios no mesmo estúdio.'],
  ['spark', 'Design e tecnologia juntos', 'Identidade visual e desenvolvimento pensados em conjunto, do primeiro esboço à entrega.'],
  ['chat', 'Atendimento direto', 'Fale com a equipe pelo WhatsApp, por e-mail ou pessoalmente em São Paulo.'],
];

const faqBase = (nome) => [
  [`Posso contratar apenas ${nome}?`, 'Fale com a equipe: ela explica as opções e ajuda a entender o que faz mais sentido para sua empresa.'],
  [`Quanto custa ${nome}?`, 'O valor depende das necessidades de cada empresa. Solicite um orçamento pelo WhatsApp ou pelo formulário de contato.'],
  ['Como solicitar um orçamento?', 'Clique em "Solicitar orçamento" nesta página ou use o formulário de contato. A equipe da GX Smart retorna para entender o seu projeto.'],
];

export const SERVICOS = [
  {
    slug: 'marketplaces', nome: 'Marketplaces', kind: 'marketplace', tag: 'Vendas em marketplaces', motif: 'vitrines',
    titulo: 'Seus produtos nas maiores vitrines digitais.',
    descricao: 'A GX Smart ajuda sua marca a vender em marketplaces como Mercado Livre, Shopee e TikTok Shop.',
    seo: 'Venda em marketplaces como Mercado Livre, Shopee e TikTok Shop com estratégia e operação da GX Smart.',
    oQueE: 'Marketplaces são grandes lojas online onde muitas marcas vendem no mesmo lugar. Estar nelas é chegar a clientes que já estão procurando para comprar.',
    pontos: [['store', 'Grandes vitrines', 'Seus produtos onde milhões de pessoas já compram.'], ['tag', 'Anúncios que vendem', 'Apresentação clara de cada produto.'], ['chart', 'Estratégia', 'Um plano para crescer com consistência.']],
    ajuda: [['map', 'Escolha dos canais', 'Entender em quais marketplaces sua marca tem mais oportunidades.'], ['tag', 'Presença dos produtos', 'Organizar a forma como seus produtos aparecem para o cliente.'], ['loop', 'Operação', 'Apoio no dia a dia de quem vende nesses canais.'], ['chart', 'Evolução', 'Olhar para os resultados e decidir os próximos passos.']],
    faq: [['Preciso ter uma loja virtual para vender em marketplaces?', 'Não necessariamente. Os marketplaces funcionam como vitrines próprias. A equipe pode avaliar se uma loja virtual também faz sentido para o seu caso.']],
    relacionados: ['e-commerce', 'lives-de-vendas', 'gestao-de-trafego'],
  },
  {
    slug: 'e-commerce', nome: 'E-commerce', kind: 'commerce', tag: 'Loja virtual', motif: 'carrinho',
    titulo: 'Sua loja online, do primeiro olhar ao próximo pedido.',
    descricao: 'Uma loja virtual para vender diretamente aos seus clientes, com produtos e experiência no mesmo lugar.',
    seo: 'Loja virtual para vender diretamente aos seus clientes: e-commerce com design e tecnologia da GX Smart.',
    oQueE: 'E-commerce é a sua própria loja na internet. Nela, a marca é sua, a vitrine é sua e o relacionamento com o cliente também.',
    pontos: [['bag', 'Loja própria', 'Um endereço da sua marca para vender online.'], ['spark', 'Experiência', 'Navegação simples do produto ao pedido.'], ['loop', 'Relacionamento', 'Clientes que voltam a comprar com você.']],
    ajuda: [['bag', 'Vitrine organizada', 'Produtos apresentados de forma clara e atraente.'], ['panels', 'Jornada de compra', 'Caminho simples para o cliente encontrar e comprar.'], ['spark', 'Identidade da marca', 'Uma loja com a cara da sua empresa.'], ['chart', 'Crescimento', 'Base para evoluir a loja junto com o negócio.']],
    faq: [['Vale a pena ter loja virtual além dos marketplaces?', 'Depende do momento da sua empresa. A loja própria fortalece a marca e o relacionamento; a equipe ajuda a avaliar o melhor caminho.']],
    relacionados: ['marketplaces', 'design-digital', 'gestao-de-trafego'],
  },
  {
    slug: 'lives-de-vendas', nome: 'Lives de Vendas', kind: 'live', tag: 'Vendas ao vivo', motif: 'aovivo',
    titulo: 'Apresente e venda ao vivo.',
    descricao: 'Transmissões ao vivo para apresentar produtos, responder dúvidas em tempo real e aproximar sua marca de quem quer comprar.',
    seo: 'Lives de vendas para apresentar produtos ao vivo, tirar dúvidas em tempo real e aproximar sua marca dos clientes.',
    oQueE: 'Na live de vendas, seus produtos são apresentados em uma transmissão ao vivo. O cliente vê, pergunta e decide na hora.',
    pontos: [['live', 'Ao vivo', 'Produto em destaque, em tempo real.'], ['chat', 'Interação', 'Dúvidas respondidas durante a transmissão.'], ['bag', 'Venda', 'Do interesse à compra em poucos cliques.']],
    ajuda: [['live', 'Transmissões', 'Lives pensadas para mostrar o melhor dos seus produtos.'], ['camera', 'Apresentação', 'Produtos mostrados de perto, com clareza.'], ['chat', 'Proximidade', 'Conversa direta entre sua marca e o público.'], ['loop', 'Continuidade', 'Lives que podem fazer parte da rotina de vendas.']],
    faq: [['Em quais plataformas as lives acontecem?', 'Isso é definido junto com a equipe, de acordo com os canais em que sua marca vende. Fale com a GX Smart para entender as opções.']],
    relacionados: ['marketplaces', 'producao-audiovisual', 'social-media'],
  },
  {
    slug: 'marketing-digital', nome: 'Marketing Digital', kind: 'marketing', tag: 'Estratégia & campanhas', motif: 'crescimento',
    titulo: 'Sua marca comunicada com estratégia.',
    descricao: 'Direção estratégica para comunicar sua marca, divulgar seus produtos e fortalecer sua presença no digital.',
    seo: 'Marketing digital com direção estratégica para comunicar sua marca, divulgar produtos e fortalecer sua presença online.',
    oQueE: 'Marketing digital é o conjunto de ações para que as pessoas certas conheçam, lembrem e escolham a sua marca na internet.',
    pontos: [['megaphone', 'Comunicação', 'Mensagens claras sobre o que sua marca oferece.'], ['map', 'Estratégia', 'Ações com objetivo e direção.'], ['chart', 'Presença', 'Uma marca mais lembrada no digital.']],
    ajuda: [['map', 'Direção', 'Definir prioridades e caminhos para a comunicação.'], ['megaphone', 'Campanhas', 'Divulgação dos seus produtos e da sua marca.'], ['grid', 'Integração', 'Ações conectadas aos outros canais da empresa.'], ['chart', 'Análise', 'Acompanhar o que funciona e ajustar o rumo.']],
    faq: [['Marketing digital é o mesmo que anúncios pagos?', 'Não. Anúncios são uma parte; o marketing digital envolve também estratégia, conteúdo e presença da marca. Veja também Gestão de Tráfego.']],
    relacionados: ['gestao-de-trafego', 'social-media', 'design-digital'],
  },
  {
    slug: 'desenvolvimento-de-sites', nome: 'Desenvolvimento de Sites', kind: 'website', tag: 'Presença digital', motif: 'interface',
    titulo: 'Um site com a cara da sua empresa.',
    descricao: 'Uma presença própria para apresentar sua empresa e conectar sua marca às pessoas.',
    seo: 'Desenvolvimento de sites modernos e profissionais para apresentar sua empresa e conectar sua marca às pessoas.',
    oQueE: 'O site é o endereço oficial da sua empresa na internet: onde as pessoas conhecem seu trabalho e encontram como falar com você.',
    pontos: [['globe', 'Endereço próprio', 'Sua empresa encontrada na internet.'], ['spark', 'Visual profissional', 'Design alinhado à sua marca.'], ['chat', 'Contato fácil', 'Caminhos claros para falar com você.']],
    ajuda: [['spark', 'Design sob medida', 'Um site que traduz a identidade da sua marca.'], ['panels', 'Navegação clara', 'Informações organizadas para quem visita.'], ['globe', 'Todas as telas', 'Pensado para computador, tablet e celular.'], ['chat', 'Conversão em contato', 'Botões e chamadas que levam ao atendimento.']],
    faq: [['O site funciona no celular?', 'Os projetos da GX Smart são pensados para diferentes telas. Converse com a equipe sobre as necessidades do seu site.']],
    relacionados: ['landing-pages', 'design-digital', 'e-commerce'],
  },
  {
    slug: 'social-media', nome: 'Social Media', kind: 'social', tag: 'Conteúdo & conexão', motif: 'publicacoes',
    titulo: 'Conexões reais nas redes sociais.',
    descricao: 'Conteúdo e relacionamento para criar conexões entre sua marca e sua comunidade.',
    seo: 'Social media: conteúdo e relacionamento para conectar sua marca à sua comunidade nas redes sociais.',
    oQueE: 'Social media é cuidar da presença da sua marca nas redes sociais: o que publicar, como falar e como se relacionar com o público.',
    pontos: [['share', 'Presença', 'Sua marca ativa onde o público está.'], ['spark', 'Conteúdo', 'Publicações com a identidade da marca.'], ['chat', 'Relacionamento', 'Proximidade com a sua comunidade.']],
    ajuda: [['map', 'Planejamento', 'Organizar o que e quando publicar.'], ['spark', 'Criação', 'Conteúdo visual e textos alinhados à marca.'], ['chat', 'Comunidade', 'Uma marca mais próxima das pessoas.'], ['chart', 'Leitura dos resultados', 'Entender o que o público mais gosta.']],
    faq: [['Quais redes sociais vocês atendem?', 'Isso é definido com a equipe, conforme o público e os objetivos da sua marca.']],
    relacionados: ['producao-audiovisual', 'design-digital', 'marketing-digital'],
  },
  {
    slug: 'producao-audiovisual', nome: 'Produção Audiovisual', kind: 'video', tag: 'Vídeo & conteúdo', motif: 'edicao',
    titulo: 'Sua marca contada em vídeo.',
    descricao: 'Vídeos e conteúdo visual para apresentar seus produtos e contar a história da sua marca.',
    seo: 'Produção audiovisual: vídeos e conteúdo visual para apresentar produtos e contar a história da sua marca.',
    oQueE: 'Produção audiovisual é transformar sua marca e seus produtos em vídeos e imagens que chamam atenção e explicam com clareza.',
    pontos: [['camera', 'Vídeos', 'Produtos e marca em movimento.'], ['spark', 'Visual', 'Imagens com qualidade e identidade.'], ['share', 'Para vários canais', 'Conteúdo para redes, site e lojas.']],
    ajuda: [['camera', 'Apresentação de produtos', 'Mostrar detalhes e usos de forma clara.'], ['spark', 'História da marca', 'Vídeos que aproximam as pessoas da sua empresa.'], ['panels', 'Edição', 'Conteúdo finalizado para cada formato.'], ['share', 'Uso no digital', 'Material pronto para redes sociais, site e marketplaces.']],
    faq: [['Os vídeos podem ser usados nas redes sociais e nas lojas online?', 'Os formatos são combinados com a equipe conforme os canais em que você pretende usar o conteúdo.']],
    relacionados: ['social-media', 'lives-de-vendas', 'design-digital'],
  },
  {
    slug: 'design-digital', nome: 'Design Digital', kind: 'design', tag: 'Design & experiência', motif: 'geometria',
    titulo: 'Design que traduz a sua marca.',
    descricao: 'Interfaces e composições visuais que traduzem a personalidade da sua marca.',
    seo: 'Design digital: interfaces, artes e composições visuais que traduzem a personalidade da sua marca.',
    oQueE: 'Design digital é a parte visual da sua marca na internet: artes, layouts e interfaces que comunicam quem você é.',
    pontos: [['palette', 'Identidade', 'Cores, formas e estilo consistentes.'], ['panels', 'Layouts', 'Peças organizadas e fáceis de entender.'], ['spark', 'Personalidade', 'Uma marca que se destaca.']],
    ajuda: [['palette', 'Artes para o digital', 'Peças visuais para seus canais.'], ['panels', 'Interfaces', 'Telas pensadas para quem usa.'], ['grid', 'Consistência', 'A mesma identidade em todos os pontos de contato.'], ['spark', 'Destaque', 'Visual que valoriza produtos e mensagens.']],
    faq: [['Vocês criam a identidade visual da marca?', 'Converse com a equipe sobre o seu momento: ela orienta o que faz sentido para a sua marca.']],
    relacionados: ['desenvolvimento-de-sites', 'social-media', 'landing-pages'],
  },
  {
    slug: 'gestao-de-trafego', nome: 'Gestão de Tráfego', kind: 'traffic', tag: 'Mídia & performance', motif: 'fluxos',
    titulo: 'Anúncios que levam pessoas até você.',
    descricao: 'Campanhas direcionadas para aproximar sua empresa de quem procura o que você oferece.',
    seo: 'Gestão de tráfego: anúncios pagos e campanhas direcionadas para levar mais pessoas até seus produtos.',
    oQueE: 'Gestão de tráfego é cuidar dos anúncios pagos da sua empresa para que eles apareçam para as pessoas certas.',
    pontos: [['chart', 'Anúncios', 'Sua marca aparecendo para quem procura.'], ['map', 'Direcionamento', 'Campanhas para o público certo.'], ['loop', 'Ajustes', 'Acompanhamento e melhorias contínuas.']],
    ajuda: [['map', 'Planejamento de campanhas', 'Definir objetivos, público e mensagens.'], ['megaphone', 'Anúncios', 'Campanhas para divulgar produtos e serviços.'], ['loop', 'Otimização', 'Ajustes a partir do que os dados mostram.'], ['chart', 'Clareza', 'Entender para onde o investimento está indo.']],
    faq: [['O investimento em anúncios está incluso?', 'Isso é tratado com a equipe na proposta. Fale com a GX Smart para entender como funciona no seu caso.']],
    relacionados: ['marketing-digital', 'landing-pages', 'marketplaces'],
    // Página piloto experiencial: demonstração conceitual (sem métricas reais nem resultados prometidos).
    demo: {
      tipo: 'campanha',
      fluxo: [['users', 'Quem procura', 'Pessoas buscando o que você oferece.'], ['megaphone', 'Seu anúncio', 'A mensagem certa no lugar certo.'], ['chat', 'Seu contato', 'Um novo cliente falando com você.']],
      titulo: 'Veja como uma campanha ganha vida.',
      intro: 'Uma demonstração ilustrativa das fases da gestão de tráfego. Escolha uma etapa para ver o que acontece.',
      etapas: [
        { id: 'plan', ic: 'map', t: 'Planejamento', d: 'Antes de investir, definimos objetivo, público e mensagem da campanha.', ganho: 'Campanhas com direção clara desde o início.' },
        { id: 'ads', ic: 'megaphone', t: 'Anúncios', d: 'Os anúncios são criados e publicados nos canais escolhidos para a sua marca.', ganho: 'Sua marca aparecendo para quem procura o que você oferece.' },
        { id: 'opt', ic: 'loop', t: 'Otimização', d: 'Variações são comparadas e a campanha é ajustada a partir do que os dados mostram.', ganho: 'Investimento direcionado ao que funciona melhor.' },
        { id: 'track', ic: 'chart', t: 'Acompanhamento', d: 'Você acompanha o andamento e decide os próximos passos junto com a equipe.', ganho: 'Clareza sobre para onde o investimento está indo.' },
      ],
      chips: [1, 0, 2], // selos da abertura → etapa da demonstração (Anúncios, Direcionamento, Ajustes)
    },
  },
  {
    slug: 'landing-pages', nome: 'Landing Pages', kind: 'landing', tag: 'Páginas de conversão', motif: 'jornada',
    titulo: 'Uma página. Um objetivo.',
    descricao: 'Páginas focadas em transformar visitantes em contatos e conduzir cada pessoa ao próximo passo.',
    seo: 'Landing pages focadas em conversão: páginas com um objetivo claro para transformar visitantes em clientes.',
    oQueE: 'Landing page é uma página criada para uma ação específica, como pedir um orçamento ou conhecer uma oferta.',
    pontos: [['panels', 'Foco', 'Uma página para um único objetivo.'], ['chat', 'Contato', 'Visitantes que viram conversas.'], ['spark', 'Clareza', 'Mensagem direta, sem distrações.']],
    ajuda: [['map', 'Objetivo definido', 'Cada página pensada para uma ação.'], ['panels', 'Estrutura', 'Informações na ordem certa para decidir.'], ['spark', 'Design', 'Visual alinhado à campanha e à marca.'], ['chat', 'Chamada para ação', 'Botões claros para o próximo passo.']],
    faq: [['Qual a diferença entre landing page e site?', 'O site apresenta a empresa como um todo; a landing page tem um único objetivo, como uma campanha ou um pedido de orçamento.']],
    relacionados: ['gestao-de-trafego', 'desenvolvimento-de-sites', 'design-digital'],
  },
].map((s) => ({ ...s, faq: [...s.faq, ...faqBase(s.nome)] }));
