import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {copy,locales} from '../content/i18n.mjs';
import {projectValidate,esc,route,build} from '../scripts/build.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const load=async name=>readFile(path.join(root,'dist',name),'utf8');
const catalog=JSON.parse(await readFile(path.join(root,'content/projects.json'),'utf8'));

test('Catalog starts empty and only approved entries become visible',()=>{
  assert.deepEqual(catalog,[]);
  assert.deepEqual(projectValidate(catalog),[]);
});
test('Translation dictionaries have matching keys and no blank copy',()=>{
  function walk(value,other,where){
    assert.equal(typeof value,typeof other,where);
    if(value && typeof value==='object'){
      assert.deepEqual(Object.keys(value).sort(),Object.keys(other).sort(),where);
      for(const key of Object.keys(value)) walk(value[key],other[key],where+'.'+key);
    } else if(typeof value==='string') assert.ok(other.trim().length>0,'Missing translation: '+where);
  }
  for(const locale of locales){assert.ok(copy[locale]);walk(copy['pt-BR'],copy[locale],locale);}
});
test('Project fields reject invalid links, missing translations and scripts',()=>{
  const sample={slug:'sample',category:'tools',status:'development',platforms:['3ds'],updated:'2026-11-19',repository:'https://github.com/LuixMath/sample',translations:Object.fromEntries(locales.map(locale=>[locale,{title:'Title',summary:'Summary',description:'Description'}]))};
  assert.equal(projectValidate([sample]).length,1);
  assert.throws(()=>projectValidate([{...sample,downloadUrl:'javascript:alert(1)'}]),/HTTPS/);
  assert.throws(()=>projectValidate([{...sample,slug:'../../oops'}]),/slug/);
  assert.throws(()=>projectValidate([{...sample,translations:{en:{title:'x',summary:'y',description:'z'}}}]),/translation/);
  assert.throws(()=>projectValidate([{...sample,repository:'https://example.com/other/repo'}]),/GitHub/);
  assert.equal(esc('<img src=x onerror=alert(1)>'),'&lt;img src=x onerror=alert(1)&gt;');
});
test('Localized paths are stable and work under GitHub Pages subdirectory',()=>{
  assert.equal(route('pt-BR','home'),'/LuixArcade/');
  assert.equal(route('en','catalog'),'/LuixArcade/en/catalog/');
  assert.equal(route('es','about'),'/LuixArcade/es/acerca/');
  assert.equal(route('en','project','test'),'/LuixArcade/en/project/test/');
});
test('Static build renders all three languages without mock projects',async()=>{
  await build();
  const pages=['index.html','catalogo/index.html','sobre/index.html','en/index.html','en/catalog/index.html','en/about/index.html','es/index.html','es/catalogo/index.html','es/acerca/index.html','404.html'];
  for(const page of pages){
    const html=await load(page);
    assert.match(html,/<main id="main"/);
    assert.match(html,/Content-Security-Policy/);
    assert.match(html,/Luix Arcade/);
    assert.match(html,/href="\/LuixArcade\/styles.css"/);
    assert.doesNotMatch(html,/data-project-item/);
    assert.doesNotMatch(html,/project-card/);
  }
  assert.match(await load('en/index.html'),/Nothing available to download yet/);
  assert.match(await load('es/index.html'),/Todavía no hay versiones para descargar/);
  assert.match(await load('index.html'),/Ainda não há lançamentos para baixar/);
  assert.match(await load('en/about/index.html'),/AI has been a big help/);
  assert.match(await load('es/acerca/index.html'),/inteligencia artificial/);
  assert.match(await load('sitemap.xml'),/LuixArcade\/es\/acerca/);
  assert.match(await load('robots.txt'),/sitemap.xml/);
});

test('Preview project editions remain separate from empty public catalog', async()=>{
  await build();
  for(const [locale,prefix] of [['pt-BR',''],['en','en/'],['es','es/']]){
    const type=locale==='en'?'project':locale==='es'?'proyecto':'projeto';
    for(const slug of ['crystal3ds','ocarina-of-time-3d-echoes']){
      const html=await load(prefix+type+'/'+slug+'/index.html');
      assert.match(html,/noindex,follow/);
      assert.match(html,/class="edition edition-/);
      assert.match(html,/media\/previews\//);
      assert.match(html,/Nintendo 3DS/);
      assert.doesNotMatch(html,/releases\/download/);
      assert.doesNotMatch(html,/data-project-item/);
    }
  }
  const catalog=await load('catalogo/index.html');
  assert.doesNotMatch(catalog,/data-project-item/);
  assert.match(catalog,/data-catalog-form/);
});
