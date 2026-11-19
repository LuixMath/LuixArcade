import {editorial, previewProjects} from '../content/editorial.mjs';

const imagePath=(base,file)=>base+'media/previews/'+file;
const groups=['games','mods','homebrew','tools','experiments'];
const symbols={games:'game',mods:'puzzle',homebrew:'chip',tools:'apps',experiments:'flask'};
const platforms=['3ds','pc','ps2','xbox360','web'];

export function renderCategoryShelf(lang,t,{esc,icon,link}){
  return '<nav class="category-shelf" aria-label="'+esc(t.nav.categories)+'">'+
    groups.map((id,i)=>'<a class="category-shortcut" href="'+esc(link(lang,'catalog'))+'?category='+id+'">'+
      '<span class="category-shortcut-icon" aria-hidden="true">'+icon(symbols[id])+'</span>'+
      '<span class="category-shortcut-label">'+esc(t.categories[id])+'</span>'+
      '<span class="category-shortcut-count" aria-hidden="true">'+String(i+1).padStart(2,'0')+'</span></a>').join('')+'</nav>';
}
export function renderPlatformBar(lang,t,{esc,link}){
  const e=editorial[lang];
  return '<nav class="platform-strip" aria-label="'+esc(e.platforms)+'"><span>'+esc(e.platforms)+'</span>'+
    '<div>'+platforms.map(id=>'<a href="'+esc(link(lang,'catalog'))+'?platform='+id+'">'+esc(t.platforms[id])+'</a>').join('')+'</div></nav>';
}
function featuredCard(lang,p,i,{esc,icon,link,base}){
  const e=editorial[lang],c=e[p.type],primary=i===0,href=esc(link(lang,'project',p.slug));
  return '<article class="feature-cover feature-cover-'+p.type+(primary?' feature-cover-lead':' feature-cover-side')+'">'+
    '<div class="feature-cover-art" aria-hidden="true"><img src="'+esc(imagePath(base,p.cover))+'" alt="" width="920" height="620" decoding="async" '+(primary?'fetchpriority="high"':'loading="lazy"')+'></div>'+
    '<div class="feature-cover-overlay" aria-hidden="true"></div>'+
    '<div class="feature-cover-inner">'+
      '<span class="feature-issue">'+esc(e.featureTag)+' <span aria-hidden="true">·</span> '+esc(p.platform)+'</span>'+
      '<div class="feature-cover-bottom">'+
        '<span class="feature-cover-kind">'+esc(c.type)+'</span>'+
        '<h3>'+esc(c.title)+'</h3><p>'+esc(c.subtitle)+'</p>'+
        '<a class="feature-cover-cta" href="'+href+'">'+esc(e.openStory)+' '+icon('arrow')+'</a>'+
      '</div></div>'+
    '<a href="'+href+'" class="feature-cover-full" tabindex="-1" aria-hidden="true"></a>'+
    '</article>';
}
export function renderHome(lang,projects,t,helpers){
  const e=editorial[lang],{esc,icon,link,card}=helpers;
  const ready=projects.filter(p=>p.featured).slice(0,6);
  const recent=[...projects].sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,6);
  return '<main id="main" class="arcade-home"><div class="site-shell">'+
    '<header class="store-heading"><div><span class="eyebrow">'+esc(e.storeLabel)+'</span>'+
      '<h1>'+esc(e.homeTitle)+'</h1><p>'+esc(e.homeIntro)+'</p></div>'+
      '<a class="store-heading-link" href="'+esc(link(lang,'about'))+'">'+esc(e.aboutAction)+' '+icon('arrow')+'</a></header>'+
    '<section class="home-feature" aria-labelledby="home-feature-title">'+
      '<div class="section-heading"><div><span class="eyebrow">'+esc(e.featureTag)+'</span><h2 id="home-feature-title">'+esc(e.editorialStories)+'</h2></div>'+
      '<p>'+esc(e.editorialDeck)+'</p></div>'+
      '<div class="feature-layout">'+previewProjects.map((p,i)=>featuredCard(lang,p,i,helpers)).join('')+'</div>'+
      '<div class="feature-footnote"><span class="footnote-marker" aria-hidden="true"></span>'+esc(e.previewNotice)+'</div>'+
    '</section>'+
    '<section class="home-browse" aria-labelledby="home-browse-title"><div class="section-heading"><div>'+
      '<span class="eyebrow">'+esc(e.categoryLabel)+'</span><h2 id="home-browse-title">'+esc(e.browseTitle)+'</h2></div>'+
      '<a class="text-link" href="'+esc(link(lang,'catalog'))+'">'+esc(e.exploreAll)+' '+icon('arrow')+'</a></div>'+
      renderCategoryShelf(lang,t,helpers)+renderPlatformBar(lang,t,helpers)+'</section>'+
    (ready.length?'<section class="home-releases"><div class="section-heading"><h2>'+esc(t.home.featuredTitle)+'</h2></div><div class="project-grid">'+ready.map(p=>card(p,lang,t)).join('')+'</div></section>':'')+
    (recent.length?'<section class="home-releases"><div class="section-heading"><h2>'+esc(t.home.recentTitle)+'</h2></div><div class="project-grid">'+recent.map(p=>card(p,lang,t)).join('')+'</div></section>':'')+
    '<footer class="home-note"><div><span class="eyebrow">'+esc(e.introLabel)+'</span><h2>'+esc(e.introTitle)+'</h2><p>'+esc(e.introBody)+'</p></div>'+
      '<a class="text-link" href="'+esc(link(lang,'about'))+'">'+esc(e.introLink)+' '+icon('arrow')+'</a></footer>'+
    '</div></main>';
}
function chapterSection(num,tag,title,description,{esc}){
  return '<section class="edition-chapter"><div class="chapter-number" aria-hidden="true">'+num+'</div><div class="chapter-body">'+
    '<span class="chapter-tag">'+esc(tag)+'</span><h2>'+esc(title)+'</h2><p>'+esc(description)+'</p></div></section>';
}
function chapters(c,e,helpers){
  return chapterSection('01',e.projectConcept,c.conceptTitle,c.concept,helpers)+
    chapterSection('02',e.projectNow,c.nowTitle,c.now,helpers)+
    chapterSection('03',e.projectNext,c.nextTitle,c.next,helpers);
}
function commonBottom(lang,e,{esc,icon,link}){
  return '<div class="project-return"><a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(e.projectBack)+'</a>'+
    '<p>'+esc(e.legal)+'</p></div>';
}
function editionFact(label,value,{esc}){
  return '<div class="edition-fact"><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>';
}
function renderCrystal(lang,p,t,helpers){
  const {esc,icon,link,base}=helpers,e=editorial[lang],c=e.crystal,img=esc(imagePath(base,p.cover));
  return '<main id="main" class="project-edition crystal-edition"><div class="site-shell">'+
    '<nav class="edition-back"><a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(e.projectBack)+'</a></nav>'+
    '<article class="crystal-paper">'+
      '<div class="crystal-topline"><span>Luix Arcade <span aria-hidden="true">/</span> Crystal3DS</span><span>'+esc(c.theme)+'</span></div>'+
      '<header class="crystal-head"><div class="crystal-copy"><span class="edition-small-label">'+esc(c.kicker)+'</span>'+
        '<h1>'+esc(c.title)+'</h1><p class="crystal-standfirst">'+esc(c.subtitle)+'</p>'+
        '<div class="edition-state"><span class="edition-state-dot" aria-hidden="true"></span>'+esc(e.draftStage)+'</div></div>'+
      '<figure class="crystal-art"><img src="'+img+'" alt="" width="920" height="620" decoding="async" fetchpriority="high"/>'+
        '<figcaption>'+esc(e.artLabel)+'</figcaption></figure></header>'+
      '<dl class="crystal-facts">'+editionFact(e.platformLabel,p.platform,helpers)+editionFact(e.kindLabel,c.type,helpers)+editionFact(e.stageLabel,e.draftStage,helpers)+'</dl>'+
      '<div class="crystal-article"><div class="crystal-article-head"><span class="edition-small-label">'+esc(e.projectConcept)+'</span>'+
        '<p>'+esc(c.summary)+'</p></div>'+
      '<div class="crystal-article-grid"><div class="chapter-list">'+chapters(c,e,helpers)+'</div>'+
      '<aside class="crystal-sidebar"><div class="sidebar-rule"><span class="edition-small-label">'+esc(e.availability)+'</span>'+
        '<h3>'+esc(e.downloadPending)+'</h3><p>'+esc(e.editorialNote)+'</p></div>'+
        '<div class="sidebar-rule"><span class="edition-small-label">'+esc(e.projectMedia)+'</span>'+
        '<p>'+esc(e.mediaPending)+'</p></div></aside></div></div></article>'+
    commonBottom(lang,e,helpers)+'</div></main>';
}
function renderEchoes(lang,p,t,helpers){
  const {esc,icon,link,base}=helpers,e=editorial[lang],c=e.echoes,img=esc(imagePath(base,p.cover));
  return '<main id="main" class="project-edition echoes-edition"><div class="site-shell">'+
    '<nav class="edition-back"><a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(e.projectBack)+'</a></nav>'+
    '<article class="echoes-magazine"><div class="echoes-masthead"><span>Luix Arcade</span><span>'+esc(c.theme)+'</span></div>'+
      '<header class="echoes-cover"><img src="'+img+'" alt="" width="920" height="620" decoding="async" fetchpriority="high"/>'+
        '<div class="echoes-cover-veil" aria-hidden="true"></div>'+
        '<div class="echoes-cover-copy"><span class="echoes-edition-label">'+esc(c.kicker)+'</span>'+
          '<h1>'+esc(c.title)+'</h1><p>'+esc(c.subtitle)+'</p>'+
          '<span class="echoes-cover-status">'+esc(e.draftStage)+'</span></div>'+
        '<span class="echoes-art-note">'+esc(e.artLabel)+'</span></header>'+
      '<dl class="echoes-facts">'+editionFact(e.platformLabel,p.platform,helpers)+editionFact(e.kindLabel,c.type,helpers)+editionFact(e.stageLabel,e.draftStage,helpers)+'</dl>'+
      '<div class="echoes-story"><div class="echoes-intro"><span class="echoes-drop-mark" aria-hidden="true">E.</span>'+
        '<div><span class="edition-small-label">'+esc(e.projectConcept)+'</span><p>'+esc(c.summary)+'</p></div></div>'+
        '<div class="echoes-content"><div class="echoes-chapters">'+chapters(c,e,helpers)+'</div>'+
        '<aside class="echoes-colophon"><span class="edition-small-label">'+esc(e.availability)+'</span>'+
          '<h3>'+esc(e.downloadPending)+'</h3><p>'+esc(e.editorialNote)+'</p>'+
          '<div class="echoes-colophon-rule"></div><span class="edition-small-label">'+esc(e.projectMedia)+'</span>'+
          '<p>'+esc(e.mediaPending)+'</p></aside></div></div></article>'+
    commonBottom(lang,e,helpers)+'</div></main>';
}
export function renderPreview(lang,p,t,helpers){
  return p.type==='echoes'?renderEchoes(lang,p,t,helpers):renderCrystal(lang,p,t,helpers);
}
