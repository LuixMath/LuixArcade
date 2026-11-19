import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const browser=[process.env.CHROME_PATH,'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe','/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].filter(Boolean).find(existsSync);
if(!browser) throw new Error('Chrome/Chromium is required for the visual smoke test.');
const port=4189;
const debugPort=23000 + (process.pid % 15000);
const local='http://127.0.0.1:'+port+'/LuixArcade/';
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
let serverError='';
server.stderr.on('data',chunk=>{serverError+=chunk;});
let chrome,ws,chromeError='';
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(check,tries=80,delay=150){
  for(let i=0;i<tries;i++){try{const v=await check();if(v)return v;}catch{}await sleep(delay);}
  throw new Error('Timed out: server='+serverError.slice(-1000)+' browser='+chromeError.slice(-1800));
}
async function run(){
  await until(async()=>{const r=await fetch(local);return r.ok;});
  chrome=spawn(browser,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--hide-scrollbars','--remote-debugging-port='+debugPort,'--user-data-dir='+path.join(process.env.TEMP || '/tmp','luix-browser-'+process.pid),'--window-size=1280,800','about:blank'],{stdio:['ignore','ignore','pipe']});
  chrome.stderr?.on('data',chunk=>{chromeError+=chunk.toString().slice(-5000);});
  chrome.on('error',error=>{chromeError+=error.message;});
  const page=await until(async()=>{const r=await fetch('http://127.0.0.1:'+debugPort+'/json/list');const pages=await r.json();return pages.find(x=>x.type==='page'&&x.webSocketDebuggerUrl);});
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
  await ensure('Portuguese storefront',await evaluate('document.documentElement.lang==="pt-BR" && document.querySelector("h1").textContent.trim()==="Luix Arcade"'));
  await ensure('No placeholder project cards',await evaluate('document.querySelectorAll(".project-card").length===0'));
  await ensure('Desktop has no horizontal overflow',await evaluate('document.documentElement.scrollWidth <= innerWidth+2'));
  await ensure('Storefront uses an image-led spotlight',await evaluate('document.querySelectorAll("[data-feature-slide]").length === 2 && getComputedStyle(document.querySelector(".spotlight-stage")).position === "relative"'));
  await ensure('Only the selected slide is interactive',await evaluate('document.querySelector("[data-feature-slide=\\\"0\\\"]").classList.contains("is-active") && document.querySelector("[data-feature-slide=\\\"1\\\"]").inert'));
  await evaluate('document.querySelector("[data-feature-next]").click()');
  await ensure('Next project changes the spotlight',await evaluate('document.querySelectorAll("[data-feature-slide]")[1].classList.contains("is-active") && !document.querySelectorAll("[data-feature-slide]")[1].inert'));
  await evaluate('document.querySelector("[data-feature-prev]").click()');
  await ensure('Previous project works',await evaluate('document.querySelectorAll("[data-feature-slide]")[0].classList.contains("is-active")'));
  await evaluate('document.querySelectorAll("[data-feature-tab]")[0].dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true}))');
  await ensure('Spotlight has keyboard navigation',await evaluate('document.querySelectorAll("[data-feature-tab]")[1]===document.activeElement'));
  await evaluate('document.querySelectorAll("[data-feature-tab]")[0].click()');
  await ensure('No duplicated project shelf',await evaluate('!document.querySelector(".journal-section") && document.querySelectorAll("[data-feature-tab]").length===2'));
  await ensure('Sound is opt-in',await evaluate('document.querySelector("[data-sound-toggle]").getAttribute("aria-pressed")==="false"'));
  await evaluate('document.querySelector("[data-sound-toggle]").click()');
  await ensure('Sound preference is saved after opt-in',await evaluate('document.querySelector("[data-sound-toggle]").getAttribute("aria-pressed")==="true" && localStorage.getItem("luix-sound")==="on"'));
  await evaluate('document.querySelector("[data-sound-toggle]").click()');
  await ensure('Sound can be disabled',await evaluate('document.querySelector("[data-sound-toggle]").getAttribute("aria-pressed")==="false" && localStorage.getItem("luix-sound")==="off"'));
  await screenshot('wide-home');
  await evaluate('document.documentElement.dataset.theme="light"');
  await sleep(250);
  await ensure('Light theme contrast tokens available',await evaluate('getComputedStyle(document.documentElement).getPropertyValue("--canvas").trim()==="#f6f7f5"'));
  await ensure('Light theme spotlight tabs use light surfaces',await evaluate('getComputedStyle(document.querySelector(".spotlight-tab")).backgroundColor==="rgb(225, 238, 240)" && getComputedStyle(document.querySelectorAll(".spotlight-tab")[1]).backgroundColor==="rgb(255, 255, 255)"'));
  await screenshot('wide-home-light');
  await visit(local+'projeto/crystal3ds/');
  await ensure('Crystal3DS editorial is a draft',await evaluate('document.querySelector(".crystal-edition") && !document.querySelector("[href*=releases]")'));
  await screenshot('wide-crystal');
  await visit(local+'projeto/ocarina-of-time-3d-echoes/');
  await ensure('Echoes editorial is a draft',await evaluate('document.querySelector(".echoes-edition") && !document.querySelector("[href*=releases]")'));
  await screenshot('wide-echoes');
  await evaluate('document.documentElement.dataset.theme="light"');
  await screenshot('wide-echoes-light');
  await visit(local);
  await visit(local+'catalogo/');
  await ensure('Catalog refinements start collapsed',await evaluate('!document.querySelector("[data-filter-details]").open'));
  await evaluate('document.querySelector("[data-filter-details] summary").click()');
  await ensure('Catalog refinements expand on demand',await evaluate('document.querySelector("[data-filter-details]").open && !!document.querySelector("#filter-platform")'));
  await evaluate('document.querySelector("[data-filter-details] summary").click()');
  await screenshot('wide-catalog-empty');
  await visit(local);
  await viewport(390,844,true);
  await sleep(200);
  await ensure('Mobile has no horizontal overflow',await evaluate('document.documentElement.scrollWidth <= innerWidth+2'));
  await ensure('Mobile layout adapts',await evaluate('getComputedStyle(document.querySelector(".category-shelf")).gridAutoFlow === "column" && getComputedStyle(document.querySelector(".mobile-dock")).display !== "none"'));
  await screenshot('phone-home');
  await visit(local+'projeto/crystal3ds/');
  await ensure('Crystal3DS responsive layout',await evaluate('document.documentElement.scrollWidth <= innerWidth+2'));
  await screenshot('phone-crystal');
  await visit(local+'projeto/ocarina-of-time-3d-echoes/');
  await ensure('Echoes responsive layout',await evaluate('document.documentElement.scrollWidth <= innerWidth+2'));
  await screenshot('phone-echoes');
  await ensure('Project language links preserve slug',await evaluate('!!document.querySelector("a[data-lang-link=en][href*=ocarina-of-time-3d-echoes]")'));
  await visit(local);
  await ensure('Mobile dock visible',await evaluate('getComputedStyle(document.querySelector(".mobile-dock")).display !== "none"'));
  await evaluate('document.querySelector("[data-theme-toggle]").click()');
  await screenshot('phone-home-alternate-theme');
  await ensure('Theme toggle changes theme',await evaluate('["dark","light"].includes(document.documentElement.dataset.theme)'));
  await visit(local+'catalogo/');
  await ensure('Catalog stays empty',await evaluate('document.querySelectorAll("[data-project-item]").length===0 && !document.querySelector("[data-empty-default]").hidden'));
  await screenshot('phone-catalog-empty');
  await evaluate('(()=>{const input=document.querySelector("#catalog-search");input.value="something";input.dispatchEvent(new Event("input",{bubbles:true}));})()');
  await ensure('Catalog search shows real zero-results state',await evaluate('!document.querySelector("[data-empty-search]").hidden && document.querySelector("[data-empty-default]").hidden'));
  await screenshot('phone-catalog-filtered');
  await viewport(320,700,true);
  await ensure('Small phones have no horizontal overflow',await evaluate('document.documentElement.scrollWidth <= innerWidth+2'));
  await visit(local+'en/about/');
  await ensure('English about page',await evaluate('document.documentElement.lang==="en" && document.body.textContent.includes("Hey, I’m Luix.")'));
  await visit(local+'es/acerca/');
  await ensure('Spanish about page',await evaluate('document.documentElement.lang==="es" && document.body.textContent.includes("¡Hola! Soy Luix.")'));
  await viewport(390,844,true);
  await visit(local+'en/project/crystal3ds/');
  await ensure('English Crystal3DS page stays localized and responsive',await evaluate('document.documentElement.lang==="en" && !!document.querySelector(".crystal-edition") && !document.body.textContent.includes("Em desenvolvimento") && document.documentElement.scrollWidth<=innerWidth+2'));
  await visit(local+'es/proyecto/ocarina-of-time-3d-echoes/');
  await ensure('Spanish Echoes page stays localized and responsive',await evaluate('document.documentElement.lang==="es" && !!document.querySelector(".echoes-edition") && !document.body.textContent.includes("Em desenvolvimento") && document.documentElement.scrollWidth<=innerWidth+2'));
  await viewport(768,900,true);
  await ensure('Tablet has no horizontal overflow',await evaluate('document.documentElement.scrollWidth <= innerWidth+2'));
  console.log('Browser smoke tests passed.');
}
try{await run();}finally{ws?.close();chrome?.kill('SIGTERM');server.kill('SIGTERM');}
