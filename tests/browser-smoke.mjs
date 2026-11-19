import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const browser=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].find(existsSync);
if(!browser) throw new Error('Chrome/Chromium is required for the visual smoke test.');
const port=4189;
const local='http://127.0.0.1:'+port+'/LuixArcade/';
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
let serverError='';
server.stderr.on('data',chunk=>{serverError+=chunk;});
let chrome,ws;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(check,tries=80,delay=150){
  for(let i=0;i<tries;i++){try{const v=await check();if(v)return v;}catch{}await sleep(delay);}
  throw new Error('Timed out: '+serverError.slice(-1000));
}
async function run(){
  await until(async()=>{const r=await fetch(local);return r.ok;});
  chrome=spawn(browser,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--hide-scrollbars','--remote-debugging-port=9237','--user-data-dir=/tmp/luix-browser-'+process.pid,'--window-size=1280,800','about:blank'],{stdio:'ignore'});
  const page=await until(async()=>{const r=await fetch('http://127.0.0.1:9237/json/list');const pages=await r.json();return pages.find(x=>x.type==='page'&&x.webSocketDebuggerUrl);});
  ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  let id=0;
  const pending=new Map();
  ws.addEventListener('message',event=>{
    const msg=JSON.parse(event.data);
    if(!msg.id || !pending.has(msg.id))return;
    const {resolve,reject}=pending.get(msg.id);pending.delete(msg.id);
    if(msg.error)reject(new Error(JSON.stringify(msg.error)));else resolve(msg.result);
  });
  async function send(method,params={}){
    return new Promise((resolve,reject)=>{
      const requestId=++id;pending.set(requestId,{resolve,reject});
      ws.send(JSON.stringify({id:requestId,method,params}));
      setTimeout(()=>{if(pending.has(requestId)){pending.delete(requestId);reject(new Error('CDP timeout: '+method));}},12000).unref();
    });
  }
  async function evaluate(expression){
    const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }
  async function visit(url){
    await send('Page.navigate',{url});
    await until(async()=>evaluate('document.readyState === "complete" && location.href.startsWith('+JSON.stringify(url)+')'));
    await sleep(200);
  }
  async function viewport(width,height,mobile){
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
    await sleep(160);
  }
  async function ensure(label,condition){
    if(!condition)throw new Error('Browser smoke failed: '+label);
    console.log('✓ '+label);
  }
  async function screenshot(name){
    const result=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
    await mkdir(path.join(root,'artifacts'),{recursive:true});
    await writeFile(path.join(root,'artifacts',name+'.png'),Buffer.from(result.data,'base64'));
  }
  await send('Page.enable');
  await send('Runtime.enable');
  await viewport(1280,800,false);
  await visit(local);
  await ensure('Portuguese storefront',await evaluate('document.documentElement.lang==="pt-BR" && document.querySelector("h1").textContent.includes("Ideias")'));
  await ensure('No placeholder project cards',await evaluate('document.querySelectorAll(".project-card").length===0'));
  await ensure('Desktop has no horizontal overflow',await evaluate('document.documentElement.scrollWidth <= innerWidth+2'));
  await screenshot('desktop-home');
  await viewport(390,844,true);
  await sleep(200);
  await ensure('Mobile has no horizontal overflow',await evaluate('document.documentElement.scrollWidth <= innerWidth+2'));
  await ensure('Mobile layout adapts',await evaluate('getComputedStyle(document.querySelector(".category-grid")).gridTemplateColumns.split(" ").length === 2'));
  await screenshot('mobile-home');
  await evaluate('document.querySelector("[data-theme-toggle]").click()');
  await ensure('Theme toggle changes theme',await evaluate('["dark","light"].includes(document.documentElement.dataset.theme)'));
  await visit(local+'catalogo/');
  await ensure('Catalog stays empty',await evaluate('document.querySelectorAll("[data-project-item]").length===0 && !document.querySelector("[data-empty-default]").hidden'));
  await evaluate('(()=>{const input=document.querySelector("#catalog-search");input.value="something";input.dispatchEvent(new Event("input",{bubbles:true}));})()');
  await ensure('Catalog search shows real zero-results state',await evaluate('!document.querySelector("[data-empty-search]").hidden && document.querySelector("[data-empty-default]").hidden'));
  await screenshot('mobile-catalog');
  await viewport(320,700,true);
  await ensure('Small phones have no horizontal overflow',await evaluate('document.documentElement.scrollWidth <= innerWidth+2'));
  await visit(local+'en/about/');
  await ensure('English about page',await evaluate('document.documentElement.lang==="en" && document.body.textContent.includes("Hey, I’m Luix.")'));
  await visit(local+'es/acerca/');
  await ensure('Spanish about page',await evaluate('document.documentElement.lang==="es" && document.body.textContent.includes("¡Hola! Soy Luix.")'));
  await viewport(768,900,true);
  await ensure('Tablet has no horizontal overflow',await evaluate('document.documentElement.scrollWidth <= innerWidth+2'));
  console.log('Browser smoke tests passed.');
}
try{await run();}finally{ws?.close();chrome?.kill('SIGTERM');server.kill('SIGTERM');}
