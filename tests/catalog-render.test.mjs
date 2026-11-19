import test from 'node:test';
import assert from 'node:assert/strict';
import {projectValidate} from '../scripts/build.mjs';
import {card, projectPage, catalog} from '../scripts/build.mjs';
import {copy, locales} from '../content/i18n.mjs';

const localized = Object.fromEntries(locales.map(l => [l, {
  title:l==='pt-BR'?'Ferramenta de teste':l==='en'?'Test utility':'Herramienta de prueba',
  summary:l==='pt-BR'?'Texto de teste':l==='en'?'Test summary':'Resumen de prueba',
  description:l==='pt-BR'?'Conteúdo de teste':l==='en'?'Test description':'Descripción de prueba',
  features:[l==='pt-BR'?'Exemplo':l==='en'?'Example':'Ejemplo'],
  compatibility:['Nintendo 3DS'],
  installation:[l==='pt-BR'?'Leia as instruções':l==='en'?'Read the instructions':'Lee las instrucciones'],
  knownIssues:[]
}]));
const project={
  slug:'catalog-test',
  category:'tools',
  status:'released',
  platforms:['3ds'],
  updated:'2026-11-19',
  version:'v1.0.0',
  repository:'https://github.com/LuixMath/catalog-test',
  downloadUrl:'https://github.com/LuixMath/catalog-test/releases/download/v1.0.0/catalog-test.zip',
  gallery:[{src:'/media/catalog-test/image.webp',alt:{'pt-BR':'Tela de teste','en':'Test screen','es':'Pantalla de prueba'}}],
  translations:localized
};

test('real project data renders catalog cards, localization, and valid download links',()=>{
  projectValidate([project]);
  for(const lang of locales){
    const cardHtml=card(project,lang,copy[lang]);
    const catalogHtml=catalog(lang,[project],copy[lang]);
    const detail=projectPage(lang,project,copy[lang]);
    assert.ok(cardHtml.includes(localized[lang].title));
    assert.ok(catalogHtml.includes('data-project-item'));
    assert.ok(catalogHtml.includes('data-catalog-form'));
    assert.ok(catalogHtml.includes('data-filter="category"'));
    assert.ok(detail.includes(localized[lang].description));
    assert.ok(detail.includes('releases/download/v1.0.0/catalog-test.zip'));
    assert.ok(detail.includes('rel="noopener noreferrer"'));
    assert.ok(detail.includes(localized[lang].features[0]));
    assert.ok(detail.includes('image.webp'));
  }
});

test('projects with no releases have no download action',()=>{
  const projectWithoutRelease={...project,downloadUrl:undefined};
  projectValidate([projectWithoutRelease]);
  for(const lang of locales){
    const detail=projectPage(lang,projectWithoutRelease,copy[lang]);
    assert.ok(detail.includes(copy[lang].project.missingDownload));
    assert.ok(!detail.includes('releases/download/'));
    assert.ok(detail.includes('github.com/LuixMath/catalog-test'));
  }
});
