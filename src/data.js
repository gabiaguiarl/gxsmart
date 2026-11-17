export const projects = [
  { name: 'Samsara Essence', category: 'E-commerce', image: 'samsara.png', url: 'https://samsaraessence.com.br/' },
  { name: 'Fênix Services', category: 'Institucional', image: 'fenix.png', url: 'https://fenixservices.com.br/' },
  { name: 'MDG Automação', category: 'E-commerce', image: 'mdg.png', url: 'https://mdgautomacao.com.br/' },
  { name: 'Área Monitorada', category: 'Institucional', image: 'area.png', url: 'https://areamonitorada.com.br/' },
  { name: 'Loja Fênix', category: 'E-commerce', image: 'loja-fenix.png', url: 'https://loja.fenixservices.com.br/' },
  { name: 'VDM3D', category: 'E-commerce', image: 'vdm.png', url: 'https://vdm3d.com.br/' },
];
// Order = commercial priority (sales channels first). [title, description, tag, icon, kind]
export const services = [
  ['Marketplaces', 'Colocamos seus produtos para vender em marketplaces como Shopee e Mercado Livre.', 'Shopee, Mercado Livre e outros', 'store', 'marketplace'],
  ['E-commerce', 'Criamos sua loja virtual para você vender diretamente aos seus clientes.', 'Loja virtual', 'bag', 'commerce'],
  ['Lives de Vendas', 'Apresentamos e vendemos seus produtos em transmissões ao vivo.', 'Vendas ao vivo', 'live', 'live'],
  ['Marketing Digital', 'Criamos campanhas para divulgar seus produtos e atrair novos clientes.', 'Campanhas', 'megaphone', 'marketing'],
  ['Desenvolvimento de Sites', 'Criamos sites modernos e profissionais para sua empresa.', 'Site profissional', 'globe', 'website'],
  ['Social Media', 'Cuidamos da presença da sua marca nas redes sociais.', 'Redes sociais', 'share', 'social'],
  ['Produção Audiovisual', 'Produzimos vídeos para mostrar seus produtos e sua marca.', 'Vídeos', 'camera', 'video'],
  ['Design Digital', 'Criamos artes e layouts que deixam sua marca mais profissional.', 'Artes e layouts', 'palette', 'design'],
  ['Gestão de Tráfego', 'Anúncios pagos para levar mais pessoas até seus produtos.', 'Anúncios', 'chart', 'traffic'],
  ['Landing Pages', 'Páginas criadas para transformar visitantes em clientes.', 'Páginas de venda', 'panels', 'landing'],
];
export const complementaryServices = ['Catálogos no WhatsApp', 'Google Meu Negócio'];
export function buildContactUrl({name, email, phone, service, message}) {
  const text = `Olá, GX! Sou ${name}.\nE-mail: ${email}\nTelefone: ${phone}\nInteresse: ${service}\n${message}`;
  return `https://wa.me/5511977085852?text=${encodeURIComponent(text)}`;
}

// Commercial CTA: the real WhatsApp contact, with a short prefilled message.
export const SALES_URL = `https://wa.me/5511977085852?text=${encodeURIComponent('Olá, GX! Quero vender mais. Podemos conversar?')}`;

// Official marketplace symbols for the 3D Marketplaces scene (src/services3d.js), shown
// as glossy app-icon tiles (brand-colour tile + symbol in relief). Only official SVG
// files from the brands' press/brand kits may be used — never redrawn or AI-generated.
// Missing files are skipped. Keep `enabled: false` until at least one file exists in
// public/assets/marketplaces/. Confirm with GX which marketplaces it actually operates. See docs/18.
export const MARKETPLACE_LOGOS = {
  enabled: false,
  items: [
    { name: 'Shopee', file: '/assets/marketplaces/shopee.svg', tile: '#EE4D2D' },
    { name: 'Mercado Livre', file: '/assets/marketplaces/mercado-livre.svg', tile: '#FFE600' },
    { name: 'Amazon', file: '/assets/marketplaces/amazon.svg', tile: '#FFFFFF' },
    { name: 'Magalu', file: '/assets/marketplaces/magalu.svg', tile: '#0086FF' },
  ],
};
