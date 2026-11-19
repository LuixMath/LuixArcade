import {editorial, previewProjects} from '../content/editorial.mjs';

const imagePath = (base, name) => base + 'media/previews/' + name;
const categoryOrder = ['games','mods','homebrew','tools','experiments'];
const platformLinks = ['3ds','pc','ps2','xbox360','web'];
const artIcons = {games:'game',mods:'puzzle',homebrew:'chip',tools:'apps',experiments:'flask'};

export function renderCategoryShelf(lang,t,{esc,icon,link}) {
  return '<nav class="browse-shelf" aria-label="'+esc(t.nav.categories)+'">'+categoryOrder.map(id=>
    '<a class="browse-tile browse-'+id+'" href="'+esc(link(lang,'catalog'))+'?category='+id+'">'+
    '<span class="browse-tile-art" aria-hidden="true">'+icon(artIcons[id])+'</span>'+
    '<span class="browse-tile-info"><strong>'+esc(t.categories[id])+'</strong></span></a>'
  ).join('')+'</nav>';
}

export function renderPlatformBar(lang,t,{esc,link}) {
  const u=editorial[lang];
  return '<nav class="platform-bar" aria-label="'+esc(u.platforms)+'"><span class="platform-bar-label">'+esc(u.platforms)+'</span>'+
    '<div class="platform-list">'+platformLinks.map(id=>
      '<a href="'+esc(link(lang,'catalog'))+'?platform='+id+'">'+esc(t.platforms[id])+'</a>'
    ).join('')+'</div></nav>';
}

function heroSlide(lang,p,index,u,{esc,icon,link,base}) {
  const c=u[p.type];
  const active=index===0;
  return '<article class="feature-slide feature-'+p.type+(active?' is-active':'')+'" data-feature-slide="'+index+'" '+(!active?'inert aria-hidden="true"':'')+'>'+
    '<div class="feature-image"><img src="'+esc(imagePath(base,p.cover))+'" alt="" width="920" height="620" decoding="async" '+(active?'fetchpriority="high"':'loading="lazy"')+'></div>'+
    '<div class="feature-gradient" aria-hidden="true"></div>'+
    '<div class="feature-content"><span class="feature-eyebrow">'+esc(u.featureTag)+' <span aria-hidden="true">/</span> '+esc(p.platform)+'</span>'+
    '<h3>'+esc(c.title)+'</h3><p>'+esc(c.subtitle)+'</p>'+
    '<div class="feature-actions"><a class="feature-cta" href="'+esc(link(lang,'project',p.slug))+'">'+esc(u.openStory)+' '+icon('arrow')+'</a>'+
    '<span class="feature-work">'+esc(u.draftStage)+'</span></div></div></article>';
}

function heroTab(p,i,u,{esc,base}) {
  const c=u[p.type];
  return '<button class="feature-tab '+(i===0?'is-selected':'')+'" type="button" data-feature-tab="'+i+'" aria-pressed="'+(i===0?'true':'false')+'">'+
    '<span class="feature-tab-image"><img src="'+esc(imagePath(base,p.cover))+'" alt="" width="96" height="72" loading="lazy" decoding="async"></span>'+
    '<span class="feature-tab-text"><small>'+esc(c.type)+'</small><strong>'+esc(c.title)+'</strong></span>'+
    '<span class="feature-tab-number" aria-hidden="true">0'+(i+1)+'</span></button>';
}

function journalItem(lang,p,u,{esc,link,base,icon}) {
  const c=u[p.type];
  return '<a class="journal-item" href="'+esc(link(lang,'project',p.slug))+'">'+
    '<span class="journal-cover journal-'+p.type+'"><img src="'+esc(imagePath(base,p.cover))+'" alt="" width="300" height="220" loading="lazy" decoding="async"></span>'+
    '<span class="journal-copy"><small>'+esc(c.kicker)+'</small><strong>'+esc(c.title)+'</strong><span>'+esc(c.summary)+'</span></span>'+
    '<span class="journal-arrow" aria-hidden="true">'+icon('chevron')+'</span></a>';
}

export function renderHome(lang,projects,t,helpers) {
  const u=editorial[lang],{esc,icon,link,card}=helpers;
  const featured=projects.filter(p=>p.featured).slice(0,6);
  const latest=[...projects].sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,6);
  return '<main id="main" class="storefront-main"><div class="site-shell">'+
    '<div class="home-intro"><div><span class="home-signature">Luix Arcade</span><h1 class="sr-only">Luix Arcade</h1>'+
    '<span class="home-intro-divider" aria-hidden="true"></span><p>'+esc(u.homeIntro)+'</p></div>'+
    '<a href="'+esc(link(lang,'about'))+'">'+esc(u.aboutAction)+' '+icon('arrow')+'</a></div>'+
    '<section class="feature-section" aria-label="'+esc(u.editorialStories)+'">'+
      '<div class="feature-heading"><div><span class="micro-eyebrow">'+esc(u.featureTag)+'</span><h2>'+esc(u.editorialStories)+'</h2></div>'+
      '<span class="feature-heading-note">'+esc(u.editorialDeck)+'</span></div>'+
      '<div class="feature-stage" data-feature-carousel>'+
      previewProjects.map((p,i)=>heroSlide(lang,p,i,u,helpers)).join('')+
      '<div class="feature-arrows"><button type="button" class="feature-nav" data-feature-prev aria-label="'+esc(u.previous)+'">'+icon('back')+'</button>'+
      '<button type="button" class="feature-nav" data-feature-next aria-label="'+esc(u.next)+'">'+icon('arrow')+'</button></div>'+
      '</div><div class="feature-tabs" role="group" aria-label="'+esc(u.featureNav)+'">'+previewProjects.map((p,i)=>heroTab(p,i,u,helpers)).join('')+'</div>'+
    '</section>'+
    '<section class="catalog-shelf"><div class="shelf-top"><div><span class="micro-eyebrow">'+esc(u.categoryLabel)+'</span>'+
    '<h2>'+esc(u.browseTitle)+'</h2></div><a class="shelf-view-all" href="'+esc(link(lang,'catalog'))+'">'+esc(u.exploreAll)+' '+icon('arrow')+'</a></div>'+
    renderCategoryShelf(lang,t,helpers)+renderPlatformBar(lang,t,helpers)+'</section>'+
    '<section class="journal-section"><div class="shelf-top"><div><span class="micro-eyebrow">'+esc(u.journalLabel)+'</span><h2>'+esc(u.journalTitle)+'</h2></div></div>'+
    '<div class="journal-list">'+previewProjects.map(p=>journalItem(lang,p,u,helpers)).join('')+'</div></section>'+
    (featured.length?'<section class="catalog-shelf"><div class="shelf-top"><h2>'+esc(t.home.featuredTitle)+'</h2></div><div class="project-grid">'+featured.map(p=>card(p,lang,t)).join('')+'</div></section>':'')+
    (latest.length?'<section class="catalog-shelf"><div class="shelf-top"><h2>'+esc(t.home.recentTitle)+'</h2></div><div class="project-grid">'+latest.map(p=>card(p,lang,t)).join('')+'</div></section>':'')+
    '<aside class="about-band"><div><h2>'+esc(u.introTitle)+'</h2><p>'+esc(u.introBody)+'</p></div>'+
    '<a href="'+esc(link(lang,'about'))+'">'+esc(u.introLink)+' '+icon('arrow')+'</a></aside>'+
    '</div></main>';
}

export function renderPreview(lang,project,t,{esc,icon,link,base}) {
  const u=editorial[lang],c=u[project.type],isEchoes=project.type==='echoes';
  const image=imagePath(base,project.cover);
  const index=isEchoes?'02':'01';
  return '<main id="main" class="edition edition-'+project.type+'"><div class="site-shell">'+
    '<nav class="edition-breadcrumb"><a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(u.projectBack)+'</a></nav>'+
    '<article class="edition-sheet">'+
    '<div class="edition-masthead"><span>Luix Arcade</span>'+
    '<span>'+esc(c.theme)+'</span></div>'+
    '<header class="edition-hero">'+
    '<div class="edition-visual"><img src="'+esc(image)+'" alt="" width="920" height="620" decoding="async" fetchpriority="high"></div>'+
    '<div class="edition-hero-text"><span class="edition-project-kicker">'+esc(c.kicker)+'</span>'+
    '<h1>'+esc(c.title)+'</h1><p class="edition-tagline">'+esc(c.subtitle)+'</p>'+
    '<div class="edition-hero-foot"><span class="edition-status"><span class="status-dot" aria-hidden="true"></span>'+esc(u.draftStage)+'</span>'+
    '<span>'+esc(u.pending)+'</span></div></div><span class="edition-visual-caption">'+esc(u.artLabel)+'</span></header>'+
    '<div class="edition-bylines"><div><span>'+esc(u.platformLabel)+'</span><b>Nintendo 3DS</b></div>'+
    '<div><span>'+esc(u.kindLabel)+'</span><b>'+esc(c.type)+'</b></div>'+
    '<div><span>'+esc(u.stageLabel)+'</span><b>'+esc(u.draftStage)+'</b></div></div>'+
    '<div class="edition-body"><div class="edition-lead"><span class="edition-issue-number" aria-hidden="true">VOL. '+index+'</span><p>'+esc(c.summary)+'</p></div>'+
    '<div class="edition-content"><div class="edition-chapters">'+
    '<section><span class="chapter-index">01</span><div><small>'+esc(u.projectConcept)+'</small><h2>'+esc(c.conceptTitle)+'</h2><p>'+esc(c.concept)+'</p></div></section>'+
    '<section><span class="chapter-index">02</span><div><small>'+esc(u.projectNow)+'</small><h2>'+esc(c.nowTitle)+'</h2><p>'+esc(c.now)+'</p></div></section>'+
    '<section><span class="chapter-index">03</span><div><small>'+esc(u.projectNext)+'</small><h2>'+esc(c.nextTitle)+'</h2><p>'+esc(c.next)+'</p></div></section>'+
    '</div><aside class="edition-aside"><div class="edition-aside-card"><span class="micro-eyebrow">'+esc(u.availability)+'</span>'+
    '<h3>'+esc(u.downloadPending)+'</h3><p>'+esc(u.editorialNote)+'</p>'+
    '<span class="edition-aside-bottom">'+icon('game')+' Nintendo 3DS</span></div>'+
    '<div class="edition-image-note"><span class="micro-eyebrow">'+esc(u.projectMedia)+'</span>'+
    '<p>'+esc(u.mediaPending)+'</p><small>'+esc(u.previewNotice)+'</small></div></aside></div>'+
    '</div></article><div class="edition-bottom"><a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(u.projectBack)+'</a>'+
    '<p class="edition-legal">'+esc(u.legal)+'</p></div></div></main>';
}
