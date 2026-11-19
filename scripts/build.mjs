import {readFile, mkdir, writeFile, cp} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {copy, locales} from '../content/i18n.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const BASE = '/' + (process.env.SITE_BASE ?? 'LuixArcade').replace(/^\/+|\/+$/g, '') + '/';
const ORIGIN = 'https://luixmath.github.io';
const SITE = ORIGIN + BASE;
const categories = ['games', 'mods', 'homebrew', 'tools', 'experiments'];
const stages = ['released', 'development', 'paused', 'archived'];
const platforms = ['3ds', 'pc', 'ps2', 'xbox360', 'web', 'android', 'other'];
const iconPaths = {
  sparkle: '<path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3Z"/><path d="M19 18v4M17 20h4"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  back: '<path d="M19 12H5m6 6-6-6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
  moon: '<path d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5 8.7 8.7 0 1 0 20.5 14.1Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  game: '<path d="M6 9h12a4 4 0 0 1 3.7 3l1 5a2.8 2.8 0 0 1-4.5 2.5l-2.3-2H8.1l-2.3 2A2.8 2.8 0 0 1 1.3 17l1-5A4 4 0 0 1 6 9Z"/><path d="M7 11v5m-2.5-2.5h5M16 12h.01M19 14h.01"/>',
  puzzle: '<path d="M3 4h6a2 2 0 1 1 4 0h7v6a2 2 0 1 0 0 4v6h-7a2 2 0 1 0-4 0H3v-6a2 2 0 1 0 0-4V4Z"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 9h6v6H9zM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/>',
  apps: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  flask: '<path d="M9 2h6m-5 0v7l-6.5 10A2 2 0 0 0 5.2 22h13.6a2 2 0 0 0 1.7-3L14 9V2M7 16h10"/>',
  box: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18m-12 5h6"/>',
  heart: '<path d="M20.8 8.6c0 4.8-8.8 10.6-8.8 10.6S3.2 13.4 3.2 8.6a4.5 4.5 0 0 1 8.8-1.2 4.5 4.5 0 0 1 8.8 1.2Z"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-1-2.6c3.4-.4 7-1.6 7-7.6A5.9 5.9 0 0 0 19.4 4a5.5 5.5 0 0 0-.1-3S17.8.5 15 3a13.2 13.2 0 0 0-6 0C6.2.5 4.7 1 4.7 1a5.5 5.5 0 0 0-.1 3A5.9 5.9 0 0 0 3 7.9c0 6 3.6 7.2 7 7.6a3.4 3.4 0 0 0-1 2.6V22"/>',
  external: '<path d="M14 4h6v6m0-6-9 9"/><path d="M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
  reset: '<path d="M3 11a9 9 0 1 1 2 6m-2 4v-6h6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>'
};

function icon(id, cls='') {return '<svg class="icon ' + cls + '" viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + iconPaths[id] + '</svg>';}
function esc(v='') {return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');}
function assert(ok, msg) {if(!ok) throw new Error('Invalid catalog: ' + msg);}
function validHttps(v, kind='external') {
  assert(typeof v === 'string', 'URL must be a string');
  let u; try {u=new URL(v);} catch {throw new Error('Invalid URL: '+v);}
  assert(u.protocol === 'https:' && !u.username && !u.password, 'Only safe HTTPS URLs allowed: '+v);
  if(kind==='github') assert(u.hostname.toLowerCase()==='github.com' && /^\/[a-z\d_.-]+\/[a-z\d_.-]+(?:\/.*)?$/i.test(u.pathname), 'Expected a GitHub repository URL: '+v);
  if(kind==='release') assert(u.hostname.toLowerCase()==='github.com' && /^\/[a-z\d_.-]+\/[a-z\d_.-]+\/releases\/(?:download|tag)\/[^/]+/i.test(u.pathname), 'Expected a GitHub release URL: '+v);
  return u.href;
}
function mediaUrl(v) {
  assert(typeof v==='string' && v.length>0, 'Missing image path');
  if(v.startsWith('https://')) return validHttps(v);
  assert(/^\/media\/[a-z\d/_\-.]+\.(?:avif|webp|png|jpg|jpeg|svg)$/i.test(v) && !v.includes('..'), 'Images must use /media/ paths or HTTPS');
  return BASE + v.substring(1);
}
function projectValidate(projects){
  assert(Array.isArray(projects),'projects.json must contain an array');
  const seen = new Set();
  for(const [i,p] of projects.entries()){
    assert(p && typeof p==='object' && !Array.isArray(p), 'project '+i+' must be an object');
    assert(typeof p.slug==='string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) && !seen.has(p.slug),'invalid or duplicate slug');
    seen.add(p.slug);
    assert(categories.includes(p.category),'invalid category in '+p.slug);
    assert(stages.includes(p.status),'invalid status in '+p.slug);
    assert(Array.isArray(p.platforms) && p.platforms.length>0 && p.platforms.every(x=>platforms.includes(x)),'invalid platforms in '+p.slug);
    assert(typeof p.updated==='string' && /^\d{4}-\d{2}-\d{2}$/.test(p.updated) && !Number.isNaN(Date.parse(p.updated)) && new Date(p.updated).toISOString().slice(0,10)===p.updated,'invalid date in '+p.slug);
    if(p.version!==undefined) assert(typeof p.version==='string' && p.version.length<=60,'invalid version in '+p.slug);
    if(p.featured!==undefined) assert(typeof p.featured==='boolean','featured must be a boolean');
    if(p.cover!==undefined) mediaUrl(p.cover);
    if(p.repository!==undefined) validHttps(p.repository,'github');
    if(p.website!==undefined) validHttps(p.website);
    if(p.downloadUrl!==undefined) validHttps(p.downloadUrl,'release');
    if(p.releaseUrl!==undefined) validHttps(p.releaseUrl,'release');
    if(p.gallery!==undefined){
      assert(Array.isArray(p.gallery) && p.gallery.length<=20,'invalid gallery in '+p.slug);
      for(const g of p.gallery){mediaUrl(g.src);for(const lang of locales) assert(typeof g.alt?.[lang]==='string' && !!g.alt[lang].trim(),'missing gallery alt in '+p.slug+'/'+lang);}
    }
    for(const lang of locales){
      const tr=p.translations?.[lang];
      assert(tr && ['title','summary','description'].every(k=>typeof tr[k]==='string' && !!tr[k].trim()), 'missing '+lang+' translation in '+p.slug);
      for(const field of ['features','compatibility','installation','knownIssues']){
        if(tr[field]!==undefined) assert(Array.isArray(tr[field])&&tr[field].every(x=>typeof x==='string'),'invalid '+field+' in '+p.slug);
      }
      if(tr.changelog!==undefined) assert(Array.isArray(tr.changelog) && tr.changelog.every(c=>typeof c.version==='string'&&typeof c.text==='string'),'invalid changelog in '+p.slug);
    }
  }
  return projects;
}
export {projectValidate, esc};

function route(lang,page,slug=''){
  const prefix = lang==='pt-BR' ? '' : lang+'/';
  const fragment = page==='home'?'':page==='catalog'?(lang==='en'?'catalog/':'catalogo/'):page==='about'?(lang==='en'?'about/':lang==='es'?'acerca/':'sobre/'):page==='project'?(lang==='en'?'project/':lang==='es'?'proyecto/':'projeto/')+slug+'/':'';
  return BASE+prefix+fragment;
}
function link(lang,page,slug='') {return route(lang,page,slug);}
function localeSelector(lang,page,slug,t) {
  return '<details class="language-switcher"><summary class="icon-action language-summary" aria-label="'+esc(t.ui.language)+'" title="'+esc(t.ui.language)+'">'+icon('globe')+'<span class="language-code">'+esc(t.localeShort)+'</span><span class="mini-chevron">⌄</span></summary><div class="language-list" role="group" aria-label="'+esc(t.ui.language)+'">'+locales.map(x=>'<a data-lang-link="'+esc(x)+'" lang="'+esc(x)+'" href="'+esc(link(x,page,slug))+'" '+(x===lang?'aria-current="page"':'')+'><span class="flag">'+copy[x].flag+'</span><span>'+esc(copy[x].localeLabel)+'</span>'+(x===lang?'<span class="check-symbol" aria-hidden="true">✓</span>':'')+'</a>').join('')+'</div></details>';
}
function header(lang,page,slug,t){
  return '<header class="site-header"><div class="site-shell header-inner">'+
    '<a class="wordmark" href="'+esc(link(lang,'home'))+'" aria-label="Luix Arcade — '+esc(t.nav.home)+'"><span class="logo-symbol" aria-hidden="true">LA</span><span class="brand-words">Luix<span>Arcade</span></span></a>'+
    '<nav class="desktop-nav" aria-label="'+esc(t.nav.categories)+'">'+['home','catalog','about'].map(id=>'<a class="nav-item '+(page===id?'is-current':'')+'" href="'+esc(link(lang,id))+'" '+(page===id?'aria-current="page"':'')+'>'+esc(t.nav[id])+'</a>').join('')+'</nav>'+
    '<div class="header-tools"><a class="header-search" href="'+esc(link(lang,'catalog'))+'" aria-label="'+esc(t.ui.searchLabel)+'">'+icon('search')+'<span>'+esc(t.ui.searchPlaceholder)+'</span></a>'+
    '<button class="icon-action theme-switch" type="button" data-theme-toggle aria-label="'+esc(t.ui.theme)+'" title="'+esc(t.ui.theme)+'"><span class="theme-sun">'+icon('sun')+'</span><span class="theme-moon">'+icon('moon')+'</span></button>'+
    localeSelector(lang,page,slug,t)+'<button class="icon-action nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="mobile-nav" aria-label="'+esc(t.ui.menu)+'">'+icon('menu')+'</button></div></div>'+
    '<nav id="mobile-nav" class="mobile-nav" aria-label="'+esc(t.nav.categories)+'" hidden><div class="site-shell"><a href="'+esc(link(lang,'catalog'))+'">'+icon('search')+' '+esc(t.ui.searchLabel)+'</a>'+
    ['home','catalog','about'].map(id=>'<a href="'+esc(link(lang,id))+'" '+(page===id?'aria-current="page"':'')+'>'+esc(t.nav[id])+'</a>').join('')+'</div></nav></header>';
}
function footer(lang,t){
  return '<footer class="site-footer"><div class="site-shell"><div class="footer-upper"><div class="footer-brand"><span class="footer-mark">'+icon('sparkle')+'</span><div><strong>Luix Arcade</strong><p>'+esc(t.footer.tagline)+'</p></div></div><nav aria-label="'+esc(t.nav.categories)+'"><a href="'+esc(link(lang,'catalog'))+'">'+esc(t.footer.browse)+'</a><a href="'+esc(link(lang,'about'))+'">'+esc(t.footer.about)+'</a><a href="https://github.com/LuixMath" target="_blank" rel="noopener noreferrer">'+esc(t.footer.github)+icon('external')+'</a></nav></div><div class="footer-bottom"><span>© '+new Date().getUTCFullYear()+' Luix Arcade · '+esc(t.footer.rights)+'</span><span>'+esc(t.footer.notice)+'</span></div></div></footer>';
}
function card(p,lang,t){
  const tr=p.translations[lang];
  const cover=p.cover?'<img src="'+esc(mediaUrl(p.cover))+'" alt="'+esc(tr.title)+'" width="640" height="400" loading="lazy" decoding="async">':'<div class="cover-fallback">'+icon(p.category==='games'?'game':p.category==='mods'?'puzzle':p.category==='homebrew'?'chip':p.category==='tools'?'apps':'flask')+'</div>';
  return '<article class="project-card"><a class="card-cover" href="'+esc(link(lang,'project',p.slug))+'">'+cover+'<span class="card-overlay">'+esc(t.ui.readMore)+' '+icon('arrow')+'</span></a><div class="card-info"><div class="card-kicker">'+esc(t.categories[p.category])+' <span aria-hidden="true">·</span> '+esc(t.stages[p.status])+'</div><h3><a href="'+esc(link(lang,'project',p.slug))+'">'+esc(tr.title)+'</a></h3><p>'+esc(tr.summary)+'</p><div class="card-foot">'+p.platforms.map(x=>'<span class="platform-tag">'+esc(t.platforms[x])+'</span>').join('')+'</div></div></article>';
}
function categoryGrid(lang,t,items){
  const icons={games:'game',mods:'puzzle',homebrew:'chip',tools:'apps',experiments:'flask'};
  return '<div class="category-grid">'+categories.map((c,i)=>'<a class="category-tile category-'+c+'" href="'+esc(link(lang,'catalog'))+'?category='+encodeURIComponent(c)+'"><span class="category-illustration">'+icon(icons[c])+'</span><span class="category-content"><strong>'+esc(t.categories[c])+'</strong><small>'+esc(t.categoryDescriptions[c])+'</small></span><span class="category-arrow">'+icon('arrow')+'</span></a>').join('')+'</div>';
}
function emptyBanner(lang,t,kind='home'){
  const home=kind==='home', p=home?t.home:t.catalog;
  return '<div class="empty-banner"><div class="empty-art" aria-hidden="true"><span class="empty-art-monogram">LA</span><span class="empty-art-line"></span></div>'+
    '<div class="empty-copy"><span class="eyebrow">'+esc(home?t.home.featuredKicker:t.catalog.eyebrow)+'</span><h3>'+esc(home?p.featuredEmptyTitle:p.nothingTitle)+'</h3>'+
    '<p>'+esc(home?p.featuredEmptyText:p.nothingText)+'</p>'+(home?'<a class="inline-link" href="'+esc(link(lang,'about'))+'">'+esc(t.home.emptyCta)+' '+icon('arrow')+'</a>':'')+'</div></div>';
}
function home(lang,projects,t){
  const featured=projects.filter(p=>p.featured).slice(0,4);
  const recent=[...projects].sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,4);
  return '<main id="main"><div class="site-shell"><section class="store-hero">'+
    '<div class="store-copy"><div class="store-hero-label"><span class="label-glyph" aria-hidden="true">✳</span>'+esc(t.home.eyebrow)+'</div>'+
    '<h1>'+esc(t.home.heading)+' <em>'+esc(t.home.accent)+'</em></h1><p>'+esc(t.home.description)+'</p>'+
    '<div class="store-actions"><a class="button store-main-cta" href="'+esc(link(lang,'catalog'))+'">'+esc(t.home.heroCta)+' '+icon('arrow')+'</a>'+
    '<a class="button store-secondary-cta" href="'+esc(link(lang,'about'))+'">'+esc(t.home.heroSecondary)+'</a></div>'+
    '<div class="store-byline">'+icon('heart')+' '+esc(t.home.sideNote)+'</div></div>'+
    '<div class="store-visual" aria-hidden="true"><div class="store-art-top"><span>LA / 001</span><span>EST. 2026</span></div>'+
    '<div class="store-disc"><span class="store-disc-letter">L<span>A</span></span><span class="store-disc-ring"></span></div>'+
    '<div class="store-art-bottom"><span>Luix Arcade</span><span class="art-stars">✳ &nbsp; ✳ &nbsp; ✳</span></div></div></section>'+
    '<section class="section categories-section" id="categories"><div class="section-heading"><div><span class="eyebrow">'+esc(t.home.sectionKicker)+'</span>'+
    '<h2>'+esc(t.home.categoriesTitle)+'</h2><p>'+esc(t.home.categoriesDescription)+'</p></div>'+
    '<a class="text-link" href="'+esc(link(lang,'catalog'))+'">'+esc(t.ui.viewAll)+' '+icon('arrow')+'</a></div>'+categoryGrid(lang,t,projects)+'</section>'+
    '<section class="section spotlight-section"><div class="section-heading"><div><span class="eyebrow">'+esc(t.home.featuredKicker)+'</span>'+
    '<h2>'+esc(t.home.featuredTitle)+'</h2></div>'+(featured.length?'<a class="text-link" href="'+esc(link(lang,'catalog'))+'">'+esc(t.ui.viewAll)+' '+icon('arrow')+'</a>':'')+'</div>'+
    (featured.length?'<div class="project-grid">'+featured.map(p=>card(p,lang,t)).join('')+'</div>':emptyBanner(lang,t))+'</section>'+
    (recent.length?'<section class="section"><div class="section-heading"><h2>'+esc(t.home.recentTitle)+'</h2></div><div class="project-grid">'+recent.map(p=>card(p,lang,t)).join('')+'</div></section>':'')+
    '<section class="about-strip"><div class="about-strip-icon" aria-hidden="true">LA</div><div><span class="eyebrow">'+esc(t.home.aboutKicker)+'</span>'+
    '<h2>'+esc(t.home.aboutTitle)+'</h2><p>'+esc(t.home.aboutText)+'</p><a class="text-link" href="'+esc(link(lang,'about'))+'">'+esc(t.home.aboutLink)+' '+icon('arrow')+'</a></div></section></div></main>';
}
function selectFilter(label,id,values,t) {
  return '<label class="filter-field" for="filter-'+id+'"><span>'+esc(label)+'</span><select id="filter-'+id+'" data-filter="'+id+'"><option value="">'+esc(t.ui.all)+'</option>'+values.map(v=>'<option value="'+esc(v)+'">'+esc(id==='category'?t.categories[v]:id==='platform'?t.platforms[v]:t.stages[v])+'</option>').join('')+'</select></label>';
}
function catalog(lang,projects,t){
  return '<main id="main"><div class="site-shell"><div class="catalog-intro"><div><span class="eyebrow">'+esc(t.catalog.eyebrow)+'</span><h1>'+esc(t.catalog.title)+'</h1><p>'+esc(t.catalog.description)+'</p></div><div class="catalog-decoration" aria-hidden="true">'+icon('game')+'</div></div><div class="catalog-layout"><aside class="filters-panel"><div class="filters-heading"><h2>'+icon('apps')+' '+esc(t.catalog.filterTitle)+'</h2><button type="button" class="filter-clear" data-reset>'+esc(t.ui.clear)+'</button></div><form data-catalog-form><label class="filter-field" for="catalog-search"><span>'+esc(t.ui.searchLabel)+'</span><span class="search-field">'+icon('search')+'<input id="catalog-search" name="q" type="search" autocomplete="off" placeholder="'+esc(t.ui.searchPlaceholder)+'"></span></label>'+selectFilter(t.catalog.category,'category',categories,t)+selectFilter(t.catalog.platform,'platform',platforms,t)+selectFilter(t.catalog.status,'status',stages,t)+'<label class="filter-field" for="filter-sort"><span>'+esc(t.catalog.sort)+'</span><select id="filter-sort" data-filter="sort"><option value="newest">'+esc(t.catalog.newest)+'</option><option value="oldest">'+esc(t.catalog.oldest)+'</option><option value="name">'+esc(t.catalog.alphabetical)+'</option></select></label></form></aside><section class="catalog-results" aria-live="polite"><div class="catalog-results-header"><span class="results-number" data-result-count>'+projects.length+' '+esc(projects.length===1?t.ui.result:t.ui.results)+'</span></div><div class="project-grid catalog-grid" data-project-grid>'+projects.map(p=>'<div data-project-item data-title="'+esc(p.translations[lang].title+' '+p.translations[lang].summary)+'" data-category="'+esc(p.category)+'" data-status="'+esc(p.status)+'" data-platforms="'+esc(p.platforms.join(' '))+'" data-updated="'+esc(p.updated)+'">'+card(p,lang,t)+'</div>').join('')+'</div><div data-empty-default '+(projects.length?'hidden':'')+'>'+emptyBanner(lang,t,'catalog')+'</div><div class="empty-search" data-empty-search hidden><div class="empty-art">'+icon('search')+'</div><h2>'+esc(t.catalog.noMatchTitle)+'</h2><p>'+esc(t.catalog.noMatchText)+'</p><button class="button button-primary" type="button" data-reset>'+esc(t.catalog.reset)+'</button></div></section></div></div></main>';
}
function about(lang,t){
  const a=t.about;
  return '<main id="main"><div class="site-shell"><section class="about-hero"><div class="about-hero-content"><span class="eyebrow eyebrow-light">'+esc(a.eyebrow)+'</span><h1>'+esc(a.title)+'</h1><p>'+esc(a.lead)+'</p></div><div class="about-hero-shape" aria-hidden="true">'+icon('sparkle')+'</div></section><div class="about-body"><article class="about-story"><section><h2>'+esc(a.heading1)+'</h2><p>'+esc(a.para1)+'</p></section><section><h2>'+esc(a.heading2)+'</h2><p>'+esc(a.para2)+'</p></section><section><h2>'+esc(a.heading3)+'</h2><p>'+esc(a.para3)+'</p></section><p class="about-closing">'+esc(a.ending)+'</p><a class="button button-primary" href="'+esc(link(lang,'catalog'))+'">'+esc(t.home.heroCta)+' '+icon('arrow')+'</a></article><aside class="about-aside"><div class="aside-icon">'+icon('heart')+'</div><h2>'+esc(a.asideTitle)+'</h2><p>'+esc(a.asideText)+'</p></aside></div></div></main>';
}
function listBlock(title,items){return items?.length?'<section class="detail-block"><h2>'+esc(title)+'</h2><ul class="detail-list">'+items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></section>':'';}
function projectPage(lang,p,t){
  const tr=p.translations[lang];
  const paragraphs=tr.description.split(/\n\s*\n/).map(x=>'<p>'+esc(x)+'</p>').join('');
  const options=[];
  if(p.downloadUrl)options.push('<a class="button button-primary" href="'+esc(validHttps(p.downloadUrl,'release'))+'" target="_blank" rel="noopener noreferrer">'+icon('download')+' '+esc(t.ui.download)+'</a>');
  if(p.releaseUrl)options.push('<a class="button button-outline" href="'+esc(validHttps(p.releaseUrl,'release'))+'" target="_blank" rel="noopener noreferrer">'+esc(t.ui.releases)+' '+icon('external')+'</a>');
  if(p.website)options.push('<a class="button button-outline" href="'+esc(validHttps(p.website))+'" target="_blank" rel="noopener noreferrer">'+esc(t.ui.website)+' '+icon('external')+'</a>');
  if(p.repository)options.push('<a class="button button-outline" href="'+esc(validHttps(p.repository,'github'))+'" target="_blank" rel="noopener noreferrer">'+icon('github')+' '+esc(t.ui.source)+'</a>');
  const cover=p.cover?'<img class="detail-cover" src="'+esc(mediaUrl(p.cover))+'" alt="'+esc(tr.title)+'" width="1200" height="750">':'<div class="detail-cover detail-cover-fallback">'+icon('game')+'</div>';
  const gallery=(p.gallery?.length?'<section class="detail-block"><h2>'+esc(t.project.gallery)+'</h2><div class="gallery-grid">'+p.gallery.map((g,i)=>'<button type="button" class="gallery-tile" data-gallery-src="'+esc(mediaUrl(g.src))+'" data-gallery-alt="'+esc(g.alt[lang])+'" aria-label="'+esc(t.project.galleryOpen)+': '+esc(g.alt[lang])+'"><img src="'+esc(mediaUrl(g.src))+'" alt="'+esc(g.alt[lang])+'" loading="lazy" decoding="async" width="720" height="405"></button>').join('')+'</div></section>':'');
  const changelog=tr.changelog?.length?'<section class="detail-block"><h2>'+esc(t.project.updates)+'</h2><ol class="changelog">'+tr.changelog.map(c=>'<li><strong>'+esc(c.version)+'</strong><p>'+esc(c.text)+'</p></li>').join('')+'</ol></section>':'';
  return '<main id="main"><div class="site-shell"><a class="breadcrumb" href="'+esc(link(lang,'catalog'))+'">'+icon('back')+' '+esc(t.project.backToCatalog)+'</a><section class="detail-header"><div><div class="eyebrow">'+esc(t.categories[p.category])+' · '+esc(t.stages[p.status])+'</div><h1>'+esc(tr.title)+'</h1><p>'+esc(tr.summary)+'</p><div class="detail-actions">'+options.join('')+'</div>'+(!p.downloadUrl&&!p.releaseUrl?'<p class="detail-notice">'+esc(t.project.missingDownload)+'</p>':'')+'</div><div class="detail-media">'+cover+'</div></section><div class="detail-columns"><div class="detail-content"><section class="detail-block"><h2>'+esc(t.project.overview)+'</h2>'+paragraphs+'</section>'+listBlock(t.project.features,tr.features)+gallery+listBlock(t.project.compatibility,tr.compatibility)+listBlock(t.project.install,tr.installation)+changelog+listBlock(t.project.issues,tr.knownIssues)+'</div><aside class="details-aside"><h2>'+esc(t.project.details)+'</h2><dl><div><dt>'+esc(t.project.category)+'</dt><dd>'+esc(t.categories[p.category])+'</dd></div><div><dt>'+esc(t.project.status)+'</dt><dd>'+esc(t.stages[p.status])+'</dd></div><div><dt>'+esc(t.project.platform)+'</dt><dd>'+p.platforms.map(x=>esc(t.platforms[x])).join(', ')+'</dd></div>'+(p.version?'<div><dt>'+esc(t.ui.version)+'</dt><dd>'+esc(p.version)+'</dd></div>':'')+'<div><dt>'+esc(t.ui.updated)+'</dt><dd>'+esc(dateText(p.updated,lang))+'</dd></div></dl>'+(!p.downloadUrl&&!p.releaseUrl?'<p>'+esc(t.project.sourceNote)+'</p>':'')+'</aside></div></div><dialog class="gallery-dialog" data-gallery-dialog aria-label="'+esc(t.project.gallery)+'"><button class="dialog-close" type="button" data-gallery-close aria-label="'+esc(t.ui.closeMenu)+'">×</button><img alt="" width="1200" height="675"></dialog></main>';
}
function dateText(date,lang){return new Intl.DateTimeFormat(lang,{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));}
function html(lang,page,body,projects,slug=''){
  const t=copy[lang], p=page==='project'?projects.find(x=>x.slug===slug):null;
  const title=page==='home'?t.meta.homeTitle:page==='catalog'?t.meta.catalogTitle:page==='about'?t.meta.aboutTitle:page==='project'?p.translations[lang].title+' — Luix Arcade':t.meta.notFoundTitle+' — Luix Arcade';
  const desc=page==='home'?t.meta.homeDescription:page==='catalog'?t.meta.catalogDescription:page==='about'?t.meta.aboutDescription:page==='project'?p.translations[lang].summary:t.notFound.description;
  const canon=ORIGIN+route(lang,page,slug);
  const alternates=page!=='notFound'?locales.map(l=>'<link rel="alternate" hreflang="'+esc(l)+'" href="'+esc(ORIGIN+route(l,page,slug))+'">').join('')+'<link rel="alternate" hreflang="x-default" href="'+esc(ORIGIN+route('pt-BR',page,slug))+'">':'';
  return '<!doctype html><html lang="'+esc(t.htmlLang)+'" data-site-base="'+esc(BASE)+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="color-scheme" content="light dark"><meta name="theme-color" content="#f6f8fc"><meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\'; img-src \'self\' https: data:; connect-src \'self\' https://api.github.com; font-src \'self\'; object-src \'none\'; base-uri \'self\'; form-action \'self\'; upgrade-insecure-requests"><title>'+esc(title)+'</title><meta name="description" content="'+esc(desc)+'"><meta name="robots" content="'+(page==='notFound'?'noindex,follow':'index,follow')+'"><link rel="canonical" href="'+esc(canon)+'">'+alternates+'<meta property="og:type" content="website"><meta property="og:site_name" content="Luix Arcade"><meta property="og:locale" content="'+esc(lang==='pt-BR'?'pt_BR':lang==='en'?'en_US':'es_ES')+'"><meta property="og:title" content="'+esc(title)+'"><meta property="og:description" content="'+esc(desc)+'"><meta property="og:url" content="'+esc(canon)+'"><meta property="og:image" content="'+esc(SITE+'og-preview.svg')+'"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="'+esc(BASE+'favicon.svg')+'" type="image/svg+xml"><link rel="stylesheet" href="'+esc(BASE+'styles.css')+'"><link rel="stylesheet" href="'+esc(BASE+'storefront.css')+'"><script defer src="'+esc(BASE+'app.js')+'"></script></head><body data-locale="'+esc(lang)+'" data-page="'+esc(page)+'"><a class="skip-link" href="#main">'+esc(t.ui.skip)+'</a>'+header(lang,page,slug,t)+body+footer(lang,t)+'</body></html>';
}
async function write(relative,contents){
  const destination=path.join(out,relative);
  await mkdir(path.dirname(destination),{recursive:true});
  await writeFile(destination,contents,'utf8');
}
async function build(){
  const projects=projectValidate(JSON.parse(await readFile(path.join(root,'content/projects.json'),'utf8')));
  await mkdir(out,{recursive:true});
  for(const file of ['styles.css','storefront.css','app.js','favicon.svg','hero-art.svg','og-preview.svg']){
    await cp(path.join(root,'public',file),path.join(out,file));
  }
  await write('.nojekyll','');
  for(const lang of locales){
    const homePath=route(lang,'home').slice(BASE.length)+'index.html';
    const catalogPath=route(lang,'catalog').slice(BASE.length)+'index.html';
    const aboutPath=route(lang,'about').slice(BASE.length)+'index.html';
    await write(homePath,html(lang,'home',home(lang,projects,copy[lang]),projects));
    await write(catalogPath,html(lang,'catalog',catalog(lang,projects,copy[lang]),projects));
    await write(aboutPath,html(lang,'about',about(lang,copy[lang]),projects));
    for(const p of projects)await write(route(lang,'project',p.slug).slice(BASE.length)+'index.html',html(lang,'project',projectPage(lang,p,copy[lang]),projects,p.slug));
  }
  const t=copy['pt-BR'];
  await write('404.html',html('pt-BR','notFound','<main id="main"><div class="site-shell not-found"><div class="not-found-art">404</div><h1>'+esc(t.notFound.title)+'</h1><p>'+esc(t.notFound.description)+'</p><a class="button button-primary" href="'+esc(link('pt-BR','home'))+'">'+esc(t.notFound.action)+' '+icon('arrow')+'</a></div></main>',projects));
  const routes=locales.flatMap(lang=>[route(lang,'home'),route(lang,'catalog'),route(lang,'about'),...projects.map(p=>route(lang,'project',p.slug))]);
  await write('robots.txt','User-agent: *\nAllow: /\nSitemap: '+SITE+'sitemap.xml\n');
  await write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(u=>'<url><loc>'+esc(ORIGIN+u)+'</loc></url>').join('')+'</urlset>\n');
  console.log('Built '+routes.length+' localized routes ('+projects.length+' projects) at '+BASE);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))build().catch(error=>{console.error(error);process.exitCode=1;});
export {build,route};
