import fs from 'node:fs';
const root='G:/Meu Drive/site-reformulando-gx/GX Smart';
const tabs=await (await fetch('http://127.0.0.1:9223/json/list')).json();
const ws=new WebSocket(tabs[0].webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let seq=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const cb=pending.get(m.id);pending.delete(m.id);m.error?cb.reject(m.error):cb.resolve(m.result);}};
const send=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++seq,{resolve,reject});ws.send(JSON.stringify({id:seq,method,params}));});
await send('Page.enable');await send('Runtime.enable');
await send('Page.navigate',{url:'http://127.0.0.1:5173/'});
await new Promise(r=>setTimeout(r,1500));
const expression=`(async()=>{const result={};for(const id of ['shopee','mercado-livre','tiktok-shop']){
 const img=new Image();img.src='/assets/marketplaces/'+id+'-reference.png';await img.decode();
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d');
 // UV framing: omit the white studio backdrop and preserve a square, undistorted face.
 ctx.beginPath();ctx.roundRect(0,0,512,512,76);ctx.clip();
 const crop=id==='shopee'?[.13,.09,.73]:id==='mercado-livre'?[.125,.12,.75]:[.13,.13,.74];
 const size=Math.min(img.width,img.height),side=size*crop[2];
 ctx.drawImage(img,size*crop[0],size*crop[1],side,side,0,0,512,512);
 result[id]=canvas.toDataURL('image/webp',.86).split(',')[1];
 }return result;})()`;
const asset=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(asset.exceptionDetails)throw Error(JSON.stringify(asset.exceptionDetails));
for(const[id,data]of Object.entries(asset.result.value)){const buffer=Buffer.from(data,'base64');for(const folder of ['public','dist'])fs.writeFileSync(root+'/'+folder+'/assets/marketplaces/'+id+'.webp',buffer);console.log(id,buffer.length+' bytes');}
await send('Emulation.setDeviceMetricsOverride',{width:1365,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.reload',{ignoreCache:true});await new Promise(r=>setTimeout(r,2500));
console.log(await send('Runtime.evaluate',{expression:"document.querySelector('.showcase')?.scrollIntoView(); JSON.stringify({showcase:!!document.querySelector('.showcase'),stage:!!document.querySelector('.sc-stage')})",returnByValue:true}));
await new Promise(r=>setTimeout(r,2500));
fs.writeFileSync(root+'/docs/screenshots/marketplace-premium-desktop.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
console.log(await send('Runtime.evaluate',{expression:"JSON.stringify({overflow:document.documentElement.scrollWidth>innerWidth,canvases:document.querySelectorAll('canvas').length,images:[...document.querySelectorAll('.market-premium img')].map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0}))})",returnByValue:true}));
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await send('Page.reload',{ignoreCache:true});await new Promise(r=>setTimeout(r,2000));await send('Runtime.evaluate',{expression:"document.querySelector('.showcase')?.scrollIntoView()"});await new Promise(r=>setTimeout(r,1500));
fs.writeFileSync(root+'/docs/screenshots/marketplace-premium-mobile.png',Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
console.log(await send('Runtime.evaluate',{expression:"JSON.stringify({mobileOverflow:document.documentElement.scrollWidth>innerWidth,width:innerWidth})",returnByValue:true}));
ws.close();

