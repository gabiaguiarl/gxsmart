import fs from 'node:fs';
const root='G:/Meu Drive/site-reformulando-gx/GX Smart';
const path=root+'/dist/assets/index-CBogC_Xj.js';let code=fs.readFileSync(path,'utf8');
fs.copyFileSync(path,path+'.before-marketplace');
const html=fs.readFileSync(root+'/dist/index.html','utf8'),start=html.indexOf('<div class="market-premium"'),end=html.indexOf('</div>',start)+6,markup=html.slice(start,end);
const a=code.indexOf('marketplace:`<div class="market-shops">'),b=code.indexOf(',live:',a);
if(a<0||b<a)throw Error('Missing template');code=code.slice(0,a)+'marketplace:'+JSON.stringify(markup)+code.slice(b);fs.writeFileSync(path,code);
console.log('Compiled fallback updated.');

