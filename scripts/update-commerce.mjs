import fs from 'node:fs';
const root='G:/Meu Drive/site-reformulando-gx/GX Smart';
const modify=(file,fn)=>{const p=root+'/'+file,s=fs.readFileSync(p,'utf8');if(!fs.existsSync(p+'.before-commerce'))fs.writeFileSync(p+'.before-commerce',s);fs.writeFileSync(p,fn(s));};
modify('dist/assets/services3d-C0txMUkZ.js',s=>{const a=s.indexOf('commerce(){'),b=s.indexOf('live(){',a);if(a<0||b<a)throw Error('boundary');return 'import {createCommerce} from "./commerce-premium.js";\n'+s.slice(0,a)+'commerce(){return createCommerce({Group:m,Physical:H,Basic:J,mesh:c,rbox:y,plane:b,torus:Z,cyl:G,track:v,canvasTex:E})},'+s.slice(b);});
modify('src/services3d.js',s=>{const a=s.indexOf('    commerce() {'),b=s.indexOf('    live() {',a);if(a<0||b<a)throw Error('boundary');return "import {createCommerce} from './commerce-premium.js';\n"+s.slice(0,a)+'    commerce() { return createCommerce({Group:THREE.Group,Physical:THREE.MeshPhysicalMaterial,Basic:THREE.MeshBasicMaterial,mesh,rbox,plane,torus,cyl,track,canvasTex}); },\n'+s.slice(b);});
const markup='<div class="commerce-store"><div class="commerce-browser"><i></i><span>sualoja.com.br</span></div><strong>SUA LOJA ONLINE</strong><div class="commerce-product"><svg viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M20 60V44a30 30 0 0 1 60 0v16" stroke="#7809ac" stroke-width="10"/><rect x="12" y="47" width="20" height="38" rx="8" fill="#7809ac"/><rect x="68" y="47" width="20" height="38" rx="8" fill="#7809ac"/></svg><div><b>Fone sem fio</b><span>R$ 199,90</span><em>ADICIONAR AO CARRINHO</em></div></div><div class="commerce-confirmed">✓ COMPRA CONFIRMADA</div></div>';
modify('src/components.js',s=>{const a=s.indexOf('    commerce:'),b=s.indexOf('    landing:',a);return s.slice(0,a)+'    commerce: '+JSON.stringify(markup)+',\n'+s.slice(b);});
modify('dist/assets/index-CBogC_Xj.js',s=>{const a=s.indexOf('commerce:`<div class="shopping-object">'),b=s.indexOf(',landing:',a);if(a<0||b<a)throw Error('fallback');return s.slice(0,a)+'commerce:'+JSON.stringify(markup)+s.slice(b);});
const css=`
.visual-commerce .visual-plane{transform:none!important}
.commerce-store{position:relative;width:255px;height:150px;margin:0 auto;background:#faf7fd;border:5px solid #ded3e8;border-radius:13px;color:#211829;box-shadow:5px 7px 0 #4c315e,0 15px 25px #0004;transform:perspective(650px) rotateY(-9deg) rotateX(4deg);text-align:left}
.commerce-browser{height:21px;background:#e9e1f0;display:flex;align-items:center;gap:20px;padding:0 12px;border-radius:7px 7px 0 0;font:8px Arial}.commerce-browser i{width:5px;height:5px;background:#a37abb;border-radius:50%;box-shadow:8px 0 #bfa8cc,16px 0 #d7c8df}
.commerce-store>strong{display:block;font:700 12px Arial;margin:10px 12px}
.commerce-product{display:flex;gap:12px;margin:0 12px;align-items:center}
.commerce-product svg{width:78px;height:78px;background:#eadff4;border-radius:8px;flex-shrink:0}
.commerce-product div{display:grid;gap:9px;font:11px Arial}.commerce-product b{font-size:12px}.commerce-product em{font:700 7px Arial;color:#fff;background:#7809ac;padding:8px 5px;border-radius:4px;white-space:nowrap}
.commerce-confirmed{position:absolute;bottom:-13px;right:-12px;padding:9px 12px;border-radius:7px;color:#7809ac;background:#f4ebfb;box-shadow:0 3px 0 #bba1cd;font:700 10px Arial}
.sc-stage .commerce-store{transform:perspective(650px) rotateY(-9deg) scale(1.25)}
@media(max-width:899px){.sc-stage .commerce-store{transform:scale(.72);transform-origin:center center;margin-top:-18px}.sc-stage .visual-commerce{padding-bottom:22px}}
`;
fs.writeFileSync(root+'/src/commerce-premium.css',css);fs.writeFileSync(root+'/dist/assets/commerce-premium.css',css);
modify('src/main.js',s=>"import './commerce-premium.css';\n"+s);
modify('dist/index.html',s=>s.replace('</head>','<link rel="stylesheet" href="/assets/commerce-premium.css">\n</head>'));
let qa=fs.readFileSync(root+'/scripts/verify-marketplace.mjs','utf8');qa=qa.replaceAll("document.querySelector('.sc-card').click()","document.querySelectorAll('.sc-card')[1].click()").replaceAll('marketplace-premium-','commerce-premium-').replaceAll('.market-premium img','.commerce-store svg');fs.writeFileSync(root+'/scripts/verify-commerce.mjs',qa);
let check=fs.readFileSync(root+'/scripts/check-marketplace.mjs','utf8').replace("'src/marketplace-premium.js'","'src/commerce-premium.js'");fs.writeFileSync(root+'/scripts/check-commerce.mjs',check);
console.log('Commerce integration complete.');

