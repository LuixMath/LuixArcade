import {editorial, previewProjects} from '../content/editorial.mjs';

const imagePath = (base, name) => base + 'media/previews/' + name;
const platformLinks = ['3ds','pc','ps2','xbox360','web'];
const categoryOrder = ['games','mods','homebrew','tools','experiments'];
const artIcons = {games:'game',mods:'puzzle',homebrew:'chip',tools:'apps',experiments:'flask'};

export function renderCategoryShelf(lang,t,{esc,icon,link}) {
  return '<div class="browse-shelf">'+categoryOrder.map((id,i)=>
    '<a class="browse-tile browse-'+id+'" href="'+esc(link(lang,'catalog'))+'?category='+id+'">'+
      '<div class="browse-tile-art"><span class="browse-orbit" aria-hidden="true"></span>'+
      '<span class="browse-tile-icon" aria-hidden="true">'+icon(artIcons[id])+'</span>'+
      '<span class="browse-num" aria-hidden="true">0'+(i+1)+'</span></div>'+
      '<div class="browse-tile-info"><strong>'+esc(t.categories[id])+'</strong>'+
      '<span>'+esc(t.categoryDescriptions[id])+'</span></div></a>'
  ).join('')+'</div>';
}
export function renderPlatformBar(lang,t,{esc,link,icon}){
  const u=editorial[lang];
  return '<nav class="platform-bar" aria-label="'+esc(u.platforms)+'">'+
    '<div class="platform-bar-inner"><span class="platform-bar-label">'+esc(u.platforms)+'</span>'+
    '<div class="platform-list">'+platformLinks.map((id)=>
      '<a href="'+esc(link(lang,'catalog'))+'?platform='+id+'">'+esc(t.platforms[id])+
      '<span aria-hidden="true">'+icon('arrow')+'</span></a>').join('')+'</div></div></nav>';
}
function previewCard(lang,p,u,{esc,icon,link,base}){
  const c=u[p.type];
  return '<a class="showcase-card showcase-'+p.type+'" href="'+esc(link(lang,'project',p.slug))+'" aria-label="'+esc(c.title+' — '+u.openStory)+'">'+
    '<img class="showcase-art" src="'+esc(imagePath(base,p.cover))+'" alt="" width="920" height="620" decoding="async">'+
    '<div class="showcase-shade"></div>'+
    '<span class="showcase-overline">'+esc(c.kicker)+'</span>'+
    '<div class="showcase-copy"><span class="showcase-state">'+esc(u.draftStage)+'</span>'+
    '<h3>'+esc(c.title)+'</h3><p>'+esc(c.subtitle)+'</p>'+
    '<span class="showcase-view">'+esc(u.openStory)+' '+icon('arrow')+'</span></div></a>';
}
export function renderHome(lang,projects,t,helpers){
  const {esc,icon,link,card,base}=helpers;
  const u=editorial[lang];
  const featured=projects.filter(p=>p.featured).slice(0,6);
  const latest=[...projects].sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,6);
  return '<main id="main" class="storefront-main"><div class="site-shell">'+
    '<div class="storefront-intro"><div><span class="micro-eyebrow">'+esc(u.storeLabel)+'</span>'+
    '<h1>'+esc(u.homeTitle)+'</h1><p>'+esc(u.homeIntro)+'</p></div></div>'+
    '<section class="editorial-section"><div class="section-identity"><div>'+
    '<span class="micro-eyebrow">'+esc(u.featureTag)+'</span><h2>'+esc(u.editorialStories)+'</h2>'+
    '<p>'+esc(u.editorialDeck)+'</p></div></div>'+
    '<div class="showcase-grid">'+previewProjects.map(p=>previewCard(lang,p,u,helpers)).join('')+'</div></section>'+
    '<div class="home-platforms">'+renderPlatformBar(lang,t,helpers)+'</div>'+
    '<section class="catalog-shelf"><div class="shelf-top"><div><span class="micro-eyebrow">'+esc(u.categoryLabel)+'</span>'+
    '<h2>'+esc(u.browseTitle)+'</h2><p>'+esc(u.browseDeck)+'</p></div>'+
    '<a class="shelf-view-all" href="'+esc(link(lang,'catalog'))+'">'+esc(u.exploreAll)+' '+icon('arrow')+'</a></div>'+
    renderCategoryShelf(lang,t,helpers)+'</section>'+
    '<section class="catalog-shelf catalog-releases"><div class="shelf-top"><div>'+
    '<span class="micro-eyebrow">'+esc(u.latestLabel)+'</span><h2>'+esc(t.home.featuredTitle)+'</h2></div></div>'+
    (featured.length?'<div class="project-grid">'+featured.map(p=>card(p,lang,t)).join('')+'</div>':
    '<div class="release-empty"><div class="release-empty-label">'+icon('box')+' '+esc(u.pending)+'</div>'+
    '<div><h3>'+esc(u.emptyTitle)+'</h3><p>'+esc(u.emptyBody)+'</p></div></div>')+'</section>'+
    (latest.length?'<section class="catalog-shelf"><div class="shelf-top"><h2>'+esc(t.home.recentTitle)+'</h2></div><div class="project-grid">'+
      latest.map(p=>card(p,lang,t)).join('')+'</div></section>':'')+
    '<aside class="about-band"><div><span class="micro-eyebrow">'+esc(u.introLabel)+'</span>'+
      '<h2>'+esc(u.introTitle)+'</h2><p>'+esc(u.introBody)+'</p></div>'+
      '<a href="'+esc(link(lang,'about'))+'">'+esc(u.introLink)+' '+icon('arrow')+'</a></aside>'+
    '</div></main>';
}
export function renderPreview(lang,project,t,{esc,icon,link,base}){
  const u=editorial[lang],c=u[project.type],isEchoes=project.type==='echoes';
  const image=imagePath(base,project.cover);
  return '<main id="main" class="edition edition-'+project.type+'"><div class="site-shell">'+
    '<nav class="edition-breadcrumb" aria-label="'+esc(u.projectBack)+'">'+
    '<a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(u.projectBack)+'</a>'+
    '<span aria-hidden="true">/</span><span>'+esc(c.title)+'</span></nav>'+
    '<article class="edition-sheet"><section class="edition-hero">'+
    '<div class="edition-hero-text"><div class="edition-serial">'+esc(c.theme)+'</div>'+
    '<div class="edition-project-kicker">'+esc(c.kicker)+'</div>'+
    '<h1>'+esc(c.title)+'</h1><p class="edition-tagline">'+esc(c.subtitle)+'</p>'+
    '<p class="edition-deck">'+esc(c.summary)+'</p>'+
    '<div class="edition-hero-foot"><span class="edition-status"><span aria-hidden="true" class="status-dot"></span>'+esc(u.draftStage)+'</span>'+
    '<span>'+esc(u.pending)+'</span></div></div>'+
    '<figure class="edition-cover"><img src="'+esc(image)+'" width="920" height="620" alt="" decoding="async">'+
    '<figcaption>'+esc(u.previewNotice)+'</figcaption></figure></section>'+
    '<div class="edition-bylines"><span>'+esc(u.platformLabel)+': '+esc(project.platform)+'</span>'+
    '<span>'+esc(u.kindLabel)+': '+esc(c.type)+'</span><span>'+esc(u.stageLabel)+': '+esc(u.draftStage)+'</span></div>'+
    '<div class="edition-content"><div class="edition-chapters"><section><span class="chapter-index">01 / '+esc(u.projectConcept)+'</span>'+
    '<h2>'+esc(c.conceptTitle)+'</h2><p>'+esc(c.concept)+'</p></section>'+
    '<section><span class="chapter-index">02 / '+esc(u.projectNow)+'</span><h2>'+esc(c.nowTitle)+'</h2><p>'+esc(c.now)+'</p></section>'+
    '<section><span class="chapter-index">03 / '+esc(u.projectNext)+'</span><h2>'+esc(c.nextTitle)+'</h2><p>'+esc(c.next)+'</p></section></div>'+
    '<aside class="edition-aside"><div class="edition-aside-card"><div class="edition-aside-stamp" aria-hidden="true">'+(isEchoes?'E':'C')+'</div>'+
    '<span class="micro-eyebrow">'+esc(u.availability)+'</span>'+
    '<h3>'+esc(u.downloadPending)+'</h3><p>'+esc(u.editorialNote)+'</p>'+
    '<div class="edition-aside-bottom">'+icon('game')+' <span>Nintendo 3DS</span></div></div>'+
    '<section class="edition-image-note"><span class="micro-eyebrow">'+esc(u.projectMedia)+'</span>'+
    '<p>'+esc(u.mediaPending)+'</p></section></aside></div></article>'+
    '<div class="edition-bottom"><a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(u.projectBack)+'</a><p class="edition-legal">'+esc(u.legal)+'</p></div>'+
    '</div></main>';
}
