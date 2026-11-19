import {editorial, previewProjects} from '../content/editorial.mjs';

const imagePath = (base, name) => base + 'media/previews/' + name;
const platformLinks = ['3ds','pc','ps2','xbox360','web'];
const categoryOrder = ['games','mods','homebrew','tools','experiments'];
const artIcons = {games:'game',mods:'puzzle',homebrew:'chip',tools:'apps',experiments:'flask'};

export function renderCategoryShelf(lang,t,{esc,icon,link}) {
  return '<div class="browse-shelf">'+categoryOrder.map((id,i)=>
    '<a class="browse-tile browse-'+id+'" href="'+esc(link(lang,'catalog'))+'?category='+id+'">'+
      '<span class="browse-tile-art" aria-hidden="true">'+icon(artIcons[id])+'<small>0'+(i+1)+'</small></span>'+
      '<span class="browse-tile-info"><strong>'+esc(t.categories[id])+'</strong><span>'+esc(t.categoryDescriptions[id])+'</span></span>'+
    '</a>'
  ).join('')+'</div>';
}

export function renderPlatformBar(lang,t,{esc,link}) {
  const u=editorial[lang];
  return '<nav class="platform-bar" aria-label="'+esc(u.platforms)+'"><span class="platform-bar-label">'+esc(u.platforms)+'</span>'+
    '<div class="platform-list">'+platformLinks.map(id=>
      '<a href="'+esc(link(lang,'catalog'))+'?platform='+id+'">'+esc(t.platforms[id])+'</a>'
    ).join('')+'</div></nav>';
}

function previewCard(lang,p,u,{esc,icon,link,base}) {
  const c=u[p.type];
  return '<a class="showcase-card showcase-'+p.type+'" href="'+esc(link(lang,'project',p.slug))+'">'+
    '<div class="showcase-media"><img class="showcase-art" src="'+esc(imagePath(base,p.cover))+'" alt="" width="920" height="620" decoding="async">'+
    '<span class="showcase-state">'+esc(u.draftStage)+'</span></div>'+
    '<div class="showcase-copy"><span class="showcase-overline">'+esc(c.kicker)+'</span><h3>'+esc(c.title)+'</h3>'+
    '<p>'+esc(c.subtitle)+'</p><span class="showcase-view">'+esc(u.openStory)+' '+icon('arrow')+'</span></div></a>';
}

export function renderHome(lang,projects,t,helpers) {
  const {esc,icon,link,card}=helpers;
  const u=editorial[lang];
  const featured=projects.filter(p=>p.featured).slice(0,6);
  const latest=[...projects].sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,6);

  return '<main id="main" class="storefront-main"><div class="site-shell">'+
    '<section class="home-hero"><div class="home-hero-copy"><span class="micro-eyebrow">'+esc(u.storeLabel)+'</span>'+
      '<h1>'+esc(u.homeTitle)+'</h1><p>'+esc(u.homeIntro)+'</p>'+
      '<div class="home-actions"><a class="home-primary" href="'+esc(link(lang,'catalog'))+'">'+esc(u.browseAction)+' '+icon('arrow')+'</a>'+
      '<a class="home-secondary" href="'+esc(link(lang,'about'))+'">'+esc(u.aboutAction)+'</a></div></div>'+
      '<aside class="home-status"><span class="status-label">'+esc(u.statusLabel)+'</span><strong>'+esc(u.statusTitle)+'</strong>'+
      '<div class="status-grid"><div><b>'+esc(u.statusPlatform)+'</b><small>'+esc(u.statusPlatformNote)+'</small></div>'+
      '<div><b>'+esc(u.statusFree)+'</b><small>'+esc(u.statusFreeNote)+'</small></div></div></aside></section>'+

    '<section class="editorial-section"><div class="section-identity"><div><span class="micro-eyebrow">'+esc(u.featureTag)+'</span>'+
      '<h2>'+esc(u.editorialStories)+'</h2><p>'+esc(u.editorialDeck)+'</p></div></div>'+
      '<div class="showcase-grid">'+previewProjects.map(p=>previewCard(lang,p,u,helpers)).join('')+'</div></section>'+

    '<section class="catalog-shelf"><div class="shelf-top"><div><span class="micro-eyebrow">'+esc(u.categoryLabel)+'</span>'+
      '<h2>'+esc(u.browseTitle)+'</h2><p>'+esc(u.browseDeck)+'</p></div>'+
      '<a class="shelf-view-all" href="'+esc(link(lang,'catalog'))+'">'+esc(u.exploreAll)+' '+icon('arrow')+'</a></div>'+
      renderCategoryShelf(lang,t,helpers)+renderPlatformBar(lang,t,helpers)+'</section>'+

    (featured.length?'<section class="catalog-shelf"><div class="shelf-top"><div><span class="micro-eyebrow">'+esc(u.latestLabel)+'</span><h2>'+esc(t.home.featuredTitle)+'</h2></div></div>'+
      '<div class="project-grid">'+featured.map(p=>card(p,lang,t)).join('')+'</div></section>':'')+
    (latest.length?'<section class="catalog-shelf"><div class="shelf-top"><h2>'+esc(t.home.recentTitle)+'</h2></div><div class="project-grid">'+
      latest.map(p=>card(p,lang,t)).join('')+'</div></section>':'')+

    '<aside class="about-band"><div><span class="micro-eyebrow">'+esc(u.introLabel)+'</span><h2>'+esc(u.introTitle)+'</h2>'+
      '<p>'+esc(u.introBody)+'</p></div><a href="'+esc(link(lang,'about'))+'">'+esc(u.introLink)+' '+icon('arrow')+'</a></aside>'+
    '</div></main>';
}

export function renderPreview(lang,project,t,{esc,icon,link,base}) {
  const u=editorial[lang], c=u[project.type], isEchoes=project.type==='echoes';
  const image=imagePath(base,project.cover);
  const masthead='LUIX ARCADE';

  return '<main id="main" class="edition edition-'+project.type+'"><div class="site-shell">'+
    '<nav class="edition-breadcrumb" aria-label="'+esc(u.projectBack)+'"><a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(u.projectBack)+'</a></nav>'+
    '<article class="edition-sheet">'+
      '<header class="edition-masthead"><span>'+esc(masthead)+'</span><span>'+esc(c.theme)+'</span></header>'+
      '<section class="edition-hero"><div class="edition-hero-text"><span class="edition-project-kicker">'+esc(c.kicker)+'</span>'+
        '<h1>'+esc(c.title)+'</h1><p class="edition-tagline">'+esc(c.subtitle)+'</p><p class="edition-deck">'+esc(c.summary)+'</p>'+
        '<div class="edition-hero-foot"><span class="edition-status"><span class="status-dot" aria-hidden="true"></span>'+esc(u.draftStage)+'</span>'+
        '<span>'+esc(u.pending)+'</span></div></div>'+
        '<figure class="edition-cover"><img src="'+esc(image)+'" width="920" height="620" alt="" decoding="async"><figcaption>'+esc(u.previewNotice)+'</figcaption></figure>'+
      '</section>'+
      '<div class="edition-bylines"><span>'+esc(u.platformLabel)+' <b>'+esc(project.platform)+'</b></span>'+
        '<span>'+esc(u.kindLabel)+' <b>'+esc(c.type)+'</b></span><span>'+esc(u.stageLabel)+' <b>'+esc(u.draftStage)+'</b></span></div>'+
      '<div class="edition-content"><div class="edition-chapters">'+
        '<section><span class="chapter-index">01</span><div><small>'+esc(u.projectConcept)+'</small><h2>'+esc(c.conceptTitle)+'</h2><p>'+esc(c.concept)+'</p></div></section>'+
        '<section><span class="chapter-index">02</span><div><small>'+esc(u.projectNow)+'</small><h2>'+esc(c.nowTitle)+'</h2><p>'+esc(c.now)+'</p></div></section>'+
        '<section><span class="chapter-index">03</span><div><small>'+esc(u.projectNext)+'</small><h2>'+esc(c.nextTitle)+'</h2><p>'+esc(c.next)+'</p></div></section>'+
      '</div>'+
      '<aside class="edition-aside"><div class="edition-aside-card"><div class="edition-aside-stamp" aria-hidden="true">'+(isEchoes?'E':'C')+'</div>'+
        '<span class="micro-eyebrow">'+esc(u.availability)+'</span><h3>'+esc(u.downloadPending)+'</h3><p>'+esc(u.editorialNote)+'</p>'+
        '<div class="edition-aside-bottom">'+icon('game')+' <span>Nintendo 3DS</span></div></div>'+
        '<section class="edition-image-note"><span class="micro-eyebrow">'+esc(u.projectMedia)+'</span><p>'+esc(u.mediaPending)+'</p></section>'+
      '</aside></div>'+
    '</article>'+
    '<div class="edition-bottom"><a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(u.projectBack)+'</a><p class="edition-legal">'+esc(u.legal)+'</p></div>'+
  '</div></main>';
}
