// Restrained live-shopping composition. Generated photo is illustrative, not a real broadcast.
export function createLive({Group,Physical,Basic,mesh,rbox,plane,torus,cyl,track,canvasTex}){
 const group=new Group(),parts=[];let alive=true;track({dispose(){alive=false;}});
 const mat=(color,roughness=.3,metalness=.2)=>track(new Physical({color,roughness,metalness,clearcoat:1,clearcoatRoughness:.18,envMapIntensity:.55}));
 const graphite=mat('#141216',.26,.65),edge=mat('#6c6275',.23,.8),black=mat('#161318',.4),lavender=mat('#bda9d1',.48,.05);
 const make=(x,y,z)=>{const g=new Group();g.position.set(x,y,z);group.add(g);parts.push(g);return g;};
 const rr=(c,x,y,w,h,r,color)=>{c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
 const text=(c,t,x,y,size,color='#fff',weight=500)=>{c.fillStyle=color;c.font=weight+' '+size+'px Arial';c.fillText(t,x,y);};
 const phone=make(-.05,.04,.12);phone.rotation.y=-.11;phone.rotation.z=-.035;
 mesh(rbox(1.79,2.94,.19,.14),edge,phone);
 mesh(rbox(1.75,2.9,.2,.13),graphite,phone,[0,0,.012]);
 const draw=(c,image)=>{
 c.clearRect(0,0,640,1060);c.save();c.beginPath();c.roundRect(0,0,640,1060,38);c.clip();
 c.fillStyle='#19151e';c.fillRect(0,0,640,1060);
 if(image){const scale=Math.max(640/image.width,1060/image.height),w=image.width*scale,h=image.height*scale;c.drawImage(image,(640-w)/2,(1060-h)/2,w,h);}
 let gradient=c.createLinearGradient(0,0,0,260);gradient.addColorStop(0,'#08070be6');gradient.addColorStop(1,'#08070b00');c.fillStyle=gradient;c.fillRect(0,0,640,260);
 gradient=c.createLinearGradient(0,710,0,1060);gradient.addColorStop(0,'#100b1800');gradient.addColorStop(.45,'#100b18c9');gradient.addColorStop(1,'#100b18');c.fillStyle=gradient;c.fillRect(0,710,640,350);
 rr(c,28,65,191,53,17,'#151217c9');c.fillStyle='#f44f68';c.beginPath();c.arc(52,91,7,0,Math.PI*2);c.fill();text(c,'AO VIVO',73,101,29,'#fff',700);
 text(c,'GX • LIVE SHOP',28,166,24,'#eee5f2',600);
 text(c,'Conheça o produto.',30,870,32,'#fff',600);
 text(c,'Pergunte. Veja os detalhes. Compre.',30,913,22,'#d5c9df');
 rr(c,26,949,588,78,22,'#7809ac');text(c,'COMPRAR NA LIVE',145,998,31,'#fff',700);
 c.restore();
 };
 const texture=canvasTex(640,1060,c=>draw(c));
 mesh(plane(1.61,2.69),track(new Basic({map:texture,transparent:true,toneMapped:false})),phone,[0,0,.119]);
 mesh(rbox(.38,.065,.015,.03),black,phone,[0,1.288,.133]);
 mesh(rbox(.025,.29,.06,.01),edge,phone,[-.89,.66,0]);
 const image=new Image();image.onload=()=>{if(!alive)return;draw(texture.image.getContext('2d'),image);texture.needsUpdate=true;};image.src='/assets/live/presenter.webp';
 // Studio ring sits behind the device; light is warm and controlled.
 const ring=make(-1.04,.38,-.48);ring.rotation.y=.3;
 mesh(torus(.63,.047),graphite,ring);
 mesh(torus(.63,.014),track(new Basic({color:'#eadfcf',toneMapped:false})),ring,[0,0,.044]);
 mesh(rbox(.028,1.28,.035,.01),edge,ring,[0,-1.25,0]);
 mesh(rbox(.49,.045,.3,.02),graphite,ring,[0,-1.89,0]);
 const product=make(1.02,-.71,.58);product.rotation.y=-.25;product.rotation.z=.06;
 mesh(rbox(.48,.83,.32,.10),lavender,product);
 mesh(cyl(.157,.157,.31,40),black,product,[0,.56,0]);
 mesh(cyl(.159,.159,.022,40),edge,product,[0,.415,0]);
 const label=canvasTex(256,256,c=>{c.fillStyle='#eee5f1';c.fillRect(0,0,256,256);text(c,'GX',88,124,64,'#4e3b5e',500);text(c,'ESSENTIAL',52,170,25,'#6b5b78',400);});
 mesh(plane(.3,.3),track(new Basic({map:label,toneMapped:false})),product,[0,-.03,.162]);
 parts.forEach(p=>{p.userData.home=p.position.clone();});
 return {group,parts,camZ:8.6,accent:.65,update(t){
 phone.rotation.y=-.11+Math.sin(t*.32)*.055;phone.position.y=.04+Math.sin(t*.58)*.035;
 product.position.y=-.71+Math.sin(t*.62+1)*.045;product.rotation.y=-.25+Math.sin(t*.36)*.1;
 }};
}

