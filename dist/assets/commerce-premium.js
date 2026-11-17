// E-commerce: a recognizable storefront, physical product, cart and purchase receipt.
export function createCommerce({Group,Physical,Basic,mesh,rbox,plane,torus,cyl,track,canvasTex}){
 const group=new Group(),parts=[];
 const material=(color,roughness=.3)=>track(new Physical({color,roughness,metalness:.12,clearcoat:1,clearcoatRoughness:.15,envMapIntensity:.7}));
 const pearl=material('#ede5f5'),purple=material('#7809ac'),dark=material('#211829'),silver=material('#bcb2c9');
 const make=(x,y,z)=>{const g=new Group();g.position.set(x,y,z);group.add(g);parts.push(g);return g;};
 const rounded=(ctx,x,y,w,h,r,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();};
 const text=(ctx,value,x,y,size,color='#211829',weight=600)=>{ctx.fillStyle=color;ctx.font=weight+' '+size+'px Arial';ctx.fillText(value,x,y);};
 const panel=(parent,w,h,draw)=>{const tex=canvasTex(960,640,draw);mesh(plane(w,h),track(new Basic({map:tex,toneMapped:false})),parent,[0,0,.092]);};
 const storefront=make(-.35,.35,-.2);storefront.rotation.y=.08;
 mesh(rbox(3.05,2.08,.18,.11),pearl,storefront);
 panel(storefront,2.9,1.93,(ctx)=>{
 rounded(ctx,0,0,960,640,24,'#faf7fd');rounded(ctx,0,0,960,72,14,'#e9e1f0');
 ['#a689bc','#bda6cd','#d4c1df'].forEach((c,i)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(34+i*32,35,8,0,Math.PI*2);ctx.fill();});
 rounded(ctx,170,20,620,32,12,'#fff');text(ctx,'sualoja.com.br',355,43,22,'#64546f',400);
 text(ctx,'SUA LOJA',42,130,38);text(ctx,'Produtos',624,124,26,'#62536c',400);
 rounded(ctx,42,168,410,398,24,'#e9ddf4');text(ctx,'Fone sem fio',490,235,39);
 text(ctx,'Seu próximo favorito.',490,282,27,'#71627c',400);
 text(ctx,'R$ 199,90',490,365,48);
 rounded(ctx,490,407,420,79,17,'#7809ac');text(ctx,'ADICIONAR AO CARRINHO',515,455,25,'#fff');
 text(ctx,'Compra segura  ·  Entrega rápida',490,538,21,'#71627c',400);
 });
 // Headphones stand in front of the product photo area, with genuine curved geometry.
 const headphones=make(-1.02,.23,.27);headphones.rotation.z=-.09;headphones.rotation.y=-.14;
 mesh(torus(.40,.065,Math.PI),purple,headphones,[0,.16,0]);
 mesh(torus(.40,.028,Math.PI),pearl,headphones,[0,.16,.065]);
 [-1,1].forEach(side=>{
 mesh(rbox(.08,.37,.12,.025),silver,headphones,[side*.39,-.01,0]);
 mesh(rbox(.23,.46,.28,.1),purple,headphones,[side*.39,-.23,0]);
 mesh(rbox(.11,.35,.29,.045),dark,headphones,[side*.25,-.23,.025]);
 });
 // Shopping cart: open basket, handle, chassis and two wheels.
 // Fase 3: cart a bit smaller and lower so it no longer covers the storefront copy ("Entrega rápida").
 const cart=make(1.04,-.8,.7);cart.scale.setScalar(.9);cart.rotation.y=-.28;cart.rotation.z=-.025;
 mesh(rbox(.94,.055,.62,.02),pearl,cart,[0,-.13,0]);
 [-.46,.46].forEach(x=>mesh(rbox(.045,.5,.62,.018),purple,cart,[x,.09,0]));
 [-.3,.3].forEach(z=>{
 mesh(rbox(.96,.055,.045,.02),purple,cart,[0,.34,z]);
 [-.30,-.1,.1,.3].forEach(x=>mesh(rbox(.025,.44,.025,.01),silver,cart,[x,.09,z]));
 mesh(rbox(.94,.035,.04,.01),purple,cart,[0,.1,z]);
 });
 mesh(rbox(.055,.78,.055,.02),silver,cart,[-.57,.12,.22],[0,0,.16]);
 mesh(rbox(.29,.085,.085,.035),purple,cart,[-.68,.51,.22]);
 mesh(rbox(.98,.06,.08,.02),silver,cart,[0,-.38,.1]);
 [-.34,.34].forEach(x=>mesh(cyl(.115,.115,.09,24),dark,cart,[x,-.46,.12],[Math.PI/2,0,0]));
 const parcel=mesh(rbox(.48,.43,.39,.045),material('#d9af84'),cart,[.03,.12,0]);
 mesh(rbox(.09,.44,.4,.01),pearl,parcel);
 const receipt=make(.36,-1.17,1.0);
 mesh(rbox(1.68,.39,.12,.09),pearl,receipt);
 const badge=canvasTex(840,180,ctx=>{
 rounded(ctx,0,0,840,180,30,'#f7f0fc');rounded(ctx,25,31,112,112,56,'#7809ac');
 ctx.strokeStyle='#fff';ctx.lineWidth=12;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(55,85);ctx.lineTo(76,106);ctx.lineTo(110,65);ctx.stroke();
 text(ctx,'COMPRA CONFIRMADA',165,107,43,'#392149');
 });
 mesh(plane(1.58,.34),track(new Basic({map:badge,toneMapped:false})),receipt,[0,0,.065]);
 parts.forEach(p=>{p.userData.home=p.position.clone();p.userData.rot=p.rotation.clone();});
 // Keep the familiar entrance, but do not spin the individual UI panels.
 parts.forEach(p=>{delete p.userData.rot;});
 return {group,parts,camZ:8.1,accent:.8,update(t){
 storefront.position.y=.35+Math.sin(t*.55)*.025;
 headphones.position.y=.23+Math.sin(t*.7+.5)*.07;
 headphones.rotation.y=-.14+Math.sin(t*.4)*.12;
 cart.position.y=-.8+Math.sin(t*.65+2)*.045;
 cart.rotation.y=-.28+Math.sin(t*.35)*.1;
 receipt.position.y=-1.17+Math.sin(t*.6+1)*.025;
 }};
}

