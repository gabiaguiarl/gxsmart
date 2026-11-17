import fs from 'node:fs';
const root='G:/Meu Drive/site-reformulando-gx/GX Smart';
const css=`
/* Keep the card illustration above its copy; reserve the sticky stage title area. */
.sc-cards .visual-marketplace .visual-plane{height:145px;display:block}
.sc-cards .market-premium{transform:scale(.59);transform-origin:top center}
@media(max-width:899px){.sc-stage .market-premium{transform:translateY(-14px)}.sc-stage .market-brand.shopee,.sc-stage .market-brand.tiktok-shop{top:16px}.sc-stage .market-brand b{display:none}}
@keyframes marketplace-float{from{translate:0 -4px}to{translate:0 4px}}
@media(prefers-reduced-motion:no-preference){.market-brand{animation:marketplace-float 3.2s ease-in-out infinite alternate;animation-play-state:paused}.market-brand.shopee{animation-delay:-1.4s}.market-brand.tiktok-shop{animation-delay:-2.3s}.market-premium.is-visible .market-brand{animation-play-state:running}}
`;
for(const p of ['src/marketplace-premium.css','dist/assets/marketplace-premium.css'])fs.appendFileSync(root+'/'+p,css);
const motion=`function init(){const nodes=[...document.querySelectorAll('.market-premium')];const visible=new Set();const sync=()=>nodes.forEach(n=>n.classList.toggle('is-visible',!document.hidden&&visible.has(n)));const io=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));sync();});nodes.forEach(n=>io.observe(n));document.addEventListener('visibilitychange',sync);addEventListener('pagehide',()=>{io.disconnect();document.removeEventListener('visibilitychange',sync);nodes.forEach(n=>n.classList.remove('is-visible'));},{once:true});}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else requestAnimationFrame(init);`;
for(const p of ['src/marketplace-fallback-motion.js','dist/assets/marketplace-fallback-motion.js'])fs.writeFileSync(root+'/'+p,motion);
for(const p of ['src/main.js','dist/assets/index-CBogC_Xj.js']){const path=root+'/'+p;fs.writeFileSync(path,"import './marketplace-fallback-motion.js';\n"+fs.readFileSync(path,'utf8'));}
let s=fs.readFileSync(root+'/src/services3d.js','utf8');s=s.replace("import { MARKETPLACE_LOGOS } from './data.js';",'');const a=s.indexOf('  const canvasTexLazy'),b=s.indexOf('  // Canvas UI textures',a);if(a>=0&&b>a)s=s.slice(0,a)+s.slice(b);fs.writeFileSync(root+'/src/services3d.js',s);
console.log('Card spacing and lightweight fallback motion corrected.');

