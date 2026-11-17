export function createMarketplace({Group,Physical,Basic,mesh,rbox,plane,track,canvasTex,container,camera,isAlive}){
 const group=new Group(),parts=[],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(hover: hover) and (pointer: fine)');
 const pointer={x:0,y:0,inside:false}; const target=container.closest('.sc-stage')||container;
 const move=e=>{if(!fine.matches||reduced)return;const r=container.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width*2-1;pointer.y=1-(e.clientY-r.top)/r.height*2;pointer.inside=true;};
 const leave=()=>{pointer.inside=false;pointer.x=pointer.y=0;};
 target.addEventListener('pointermove',move,{passive:true});target.addEventListener('pointerleave',leave);
 track({dispose(){target.removeEventListener('pointermove',move);target.removeEventListener('pointerleave',leave);}});
 [{id:'mercado-livre',name:'Mercado Livre',color:'#ffe600',x:0,y:.84,z:-.1},{id:'shopee',name:'Shopee',color:'#f4511e',x:-.99,y:-.58,z:.18},{id:'tiktok-shop',name:'TikTok Shop',color:'#111116',x:.99,y:-.58,z:.32}].forEach((brand,index)=>{
 const tile=new Group();tile.name=brand.name;tile.position.set(brand.x,brand.y,brand.z);group.add(tile);
 const body=track(new Physical({color:brand.color,roughness:.25,metalness:.08,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:.65}));
 mesh(rbox(1.36,1.36,.28,.19),body,tile);
 const texture=canvasTex(512,512,ctx=>{ctx.fillStyle=brand.color;ctx.fillRect(0,0,512,512);ctx.fillStyle=index===0?'#12205a':'#fff';ctx.textAlign='center';ctx.font='bold 44px Arial';ctx.fillText(brand.name,256,270);});
 mesh(plane(1.25,1.25),track(new Basic({map:texture,transparent:true,toneMapped:false})),tile,[0,0,.147]);
 const image=new Image();image.onload=()=>{if(!isAlive())return;const ctx=texture.image.getContext('2d');ctx.clearRect(0,0,512,512);ctx.drawImage(image,0,0,512,512);texture.needsUpdate=true;};image.src='/assets/marketplaces/'+brand.id+'.webp';
 tile.userData.home=tile.position.clone();tile.userData.hover=0;tile.userData.body=body;parts.push(tile);
 });
 return {group,parts,camZ:8.3,accent:.65,update(time,dt=.016){
 const damp=1-Math.exp(-dt*7),height=2*camera.position.z*Math.tan(camera.fov*Math.PI/360),amplitude=Math.min(.11,10*height/Math.max(container.clientHeight,1));
 parts.forEach((tile,index)=>{const home=tile.userData.home;
 const hover=pointer.inside&&Math.hypot((pointer.x-home.x/(height*camera.aspect/2))*camera.aspect,pointer.y-home.y/(height/2))<1/(height/2)?1:0;
 tile.userData.hover+=(hover-tile.userData.hover)*damp;const h=tile.userData.hover,phase=index*2.1;
 tile.position.y=home.y+(reduced?0:Math.sin(time*.72+phase)*amplitude);tile.position.z=home.z+h*.12;
 tile.rotation.x+=((reduced?0:Math.sin(time*.42+phase)*.045-pointer.y*.025)-tile.rotation.x)*damp;
 tile.rotation.y+=((reduced?0:Math.sin(time*.38+phase)*.15+pointer.x*.04)-tile.rotation.y)*damp;
 tile.rotation.z=reduced?0:Math.sin(time*.3+phase)*.025;tile.scale.setScalar(1+h*.035);tile.userData.body.envMapIntensity=.65+h*.2;
 });}};
}
