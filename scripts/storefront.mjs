import {editorial,previewProjects} from '../content/editorial.mjs';

const icons={games:'game',mods:'puzzle',homebrew:'chip',tools:'apps',experiments:'flask'};
const groups=Object.keys(icons);
const featuredImage=(base,p)=>base+'media/previews/'+p.cover;

export function renderCategoryShelf(lang,t,{esc,icon,link}){
  return '<nav class="directory-grid" aria-label="'+esc(t.nav.categories)+'">'+
    groups.map((id,i)=>'<a class="directory-link directory-'+id+'" href="'+esc(link(lang,'catalog'))+'?category='+id+'">'+
      '<span class="directory-icon" aria-hidden="true">'+icon(icons[id])+'</span>'+
      '<span class="directory-name">'+esc(t.categories[id])+'</span>'+
      '<span class="directory-next" aria-hidden="true">'+icon('arrow')+'</span></a>').join('')+'</nav>';
}
function previewCard(lang,p,i,{esc,icon,link,base}){
  const c=editorial[lang][p.type],e=editorial[lang];
  return '<article class="cover-card cover-'+p.type+'" data-preview="'+esc(p.type)+'">'+
     '<a class="cover-art" href="'+esc(link(lang,'preview',p.slug))+'" aria-label="'+esc(c.title)+' — '+esc(e.openStory)+'">'+
       '<img src="'+esc(featuredImage(base,p))+'" alt="" width="1440" height="900" decoding="async" '+(i===0?'fetchpriority="high"':'loading="lazy"')+'>'+
       '<span class="cover-art-corner" aria-hidden="true">'+icon('arrow')+'</span></a>'+
     '<div class="cover-under"><div class="cover-name"><span class="cover-kind">'+esc(c.type)+'</span>'+
       '<h3><a href="'+esc(link(lang,'preview',p.slug))+'">'+esc(c.title)+'</a></h3>'+
       '<p>'+esc(c.subtitle)+'</p></div><span class="cover-status">'+esc(e.draftStage)+'</span></div>'+
    '</article>';
}
export function renderHome(lang,projects,t,helpers){
  const e=editorial[lang],u=e.shop,{esc,icon,link,card}=helpers;
  const ready=projects.filter(p=>p.featured).slice(0,4);
  const recent=[...projects].sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,4);
  return '<main id="main" class="arcade-home"><div class="site-shell">'+
    '<header class="home-heading"><div><span class="section-kicker">'+esc(u.masthead)+'</span>'+
      '<h1>'+esc(u.homeTitle)+'</h1><p>'+esc(u.homeSubtitle)+'</p></div>'+
      '<div class="home-stamp" aria-hidden="true"><span>LU<span>IX</span></span><small>ARCADE</small></div></header>'+
    '<section class="featured-gallery" aria-labelledby="gallery-title">'+
      '<div class="section-line"><div><span class="section-kicker">'+esc(u.issueTag)+'</span><h2 id="gallery-title">'+esc(u.featureTitle)+'</h2></div>'+
      '<span class="section-aside">'+esc(u.featureNote)+'</span></div>'+
      '<div class="cover-gallery">'+previewProjects.map((p,i)=>previewCard(lang,p,i,helpers)).join('')+'</div>'+
      '<p class="art-disclaimer">'+icon('info')+esc(e.previewNotice)+'</p></section>'+
    '<section class="shop-directory" aria-labelledby="directory-title"><div class="section-line"><div>'+
      '<span class="section-kicker">'+esc(u.browseTag)+'</span><h2 id="directory-title">'+esc(u.browseTitle)+'</h2></div>'+
      '<a class="section-all" href="'+esc(link(lang,'catalog'))+'">'+esc(e.exploreAll)+' '+icon('arrow')+'</a></div>'+
      renderCategoryShelf(lang,t,helpers)+'</section>'+
    (ready.length?'<section class="release-shelf"><div class="section-line"><h2>'+esc(t.home.featuredTitle)+'</h2></div><div class="project-grid">'+ready.map(p=>card(p,lang,t)).join('')+'</div></section>':'')+
    (recent.length?'<section class="release-shelf"><div class="section-line"><h2>'+esc(t.home.recentTitle)+'</h2></div><div class="project-grid">'+recent.map(p=>card(p,lang,t)).join('')+'</div></section>':'')+
    '<section class="empty-library-link"><div class="empty-library-symbol" aria-hidden="true">'+icon('box')+'</div>'+
       '<div><span class="section-kicker">'+esc(u.libraryTag)+'</span><h2>'+esc(u.libraryTitle)+'</h2>'+
       '<p>'+esc(u.libraryNote)+'</p></div>'+
       '<a href="'+esc(link(lang,'catalog'))+'">'+esc(u.libraryAction)+' '+icon('arrow')+'</a></section>'+
    '<div class="home-signoff"><p>'+esc(e.introBody)+'</p><a href="'+esc(link(lang,'about'))+'">'+esc(e.introLink)+' '+icon('arrow')+'</a></div>'+
    '</div></main>';
}
function editionFact(label,value,{esc}) {
  return '<div><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>';
}
function chapter(c,e,n,key,{esc}){
  const title=c[key+'Title'],body=c[key];
  const label=key==='concept'?e.projectConcept:key==='now'?e.projectNow:e.projectNext;
  return '<section class="story-section"><span class="story-num">'+n+'</span><div><span class="story-caption">'+esc(label)+'</span>'+
    '<h2>'+esc(title)+'</h2><p>'+esc(body)+'</p></div></section>';
}
function contentChapters(c,e,helpers){return chapter(c,e,'01','concept',helpers)+chapter(c,e,'02','now',helpers)+chapter(c,e,'03','next',helpers);}
function projectReturn(lang,e,{esc,icon,link}) {
  return '<div class="edition-exit"><a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(e.projectBack)+'</a><small>'+esc(e.legal)+'</small></div>';
}
function renderCrystal(lang,p,t,helpers){
 const {esc,icon,link,base}=helpers,e=editorial[lang],c=e.crystal,u=e.shop,src=featuredImage(base,p);
 return '<main id="main" class="preview-page crystal-page"><div class="site-shell">'+
    '<nav class="edition-path"><a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(e.projectBack)+'</a><span>'+esc(u.workInProgress)+'</span></nav>'+
    '<article class="crystal-feature">'+
      '<div class="crystal-device"><div class="crystal-device-top"><span>LU<span>IX</span> / 3DS</span><span>01—03</span></div>'+
        '<div class="crystal-screen"><img src="'+esc(src)+'" alt="" width="1440" height="900" fetchpriority="high"></div>'+
        '<div class="crystal-device-bottom"><span class="crystal-dpad" aria-hidden="true">✛</span>'+
           '<span class="crystal-system" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="crystal-led" aria-hidden="true"></span></div>'+
       '</div>'+
      '<header class="crystal-opening"><span class="section-kicker">'+esc(c.kicker)+'</span><h1>'+esc(c.title)+'</h1>'+
        '<p class="crystal-pitch">'+esc(c.subtitle)+'</p>'+
        '<div class="crystal-platform-pill">'+icon('chip')+' '+esc(e.draftStage)+'</div>'+
        '<p class="crystal-credit">'+esc(e.artLabel)+'</p></header>'+
      '<dl class="edition-specs">'+editionFact(e.platformLabel,p.platform,helpers)+editionFact(e.kindLabel,c.type,helpers)+editionFact(e.stageLabel,e.draftStage,helpers)+'</dl>'+
      '<div class="crystal-lower"><div class="crystal-prose"><div class="crystal-lead"><span class="section-kicker">'+esc(e.projectConcept)+'</span>'+
        '<p>'+esc(c.summary)+'</p></div>'+contentChapters(c,e,helpers)+'</div>'+
       '<aside class="crystal-availability"><span class="section-kicker">'+esc(e.availability)+'</span><h2>'+esc(e.downloadPending)+'</h2>'+
       '<p>'+esc(e.editorialNote)+'</p><div class="crystal-aside-rule"></div>'+
       '<span class="section-kicker">'+esc(e.projectMedia)+'</span><p>'+esc(e.mediaPending)+'</p></aside></div>'+
    '</article>'+projectReturn(lang,e,helpers)+'</div></main>';
}
function renderEchoes(lang,p,t,helpers){
  const {esc,icon,link,base}=helpers,e=editorial[lang],c=e.echoes,u=e.shop,src=featuredImage(base,p);
  return '<main id="main" class="preview-page echoes-page"><div class="site-shell">'+
    '<nav class="edition-path"><a href="'+esc(link(lang,'home'))+'">'+icon('back')+' '+esc(e.projectBack)+'</a><span>'+esc(u.workInProgress)+'</span></nav>'+
    '<article class="echoes-feature"><div class="echoes-issue-line"><strong>Luix Arcade</strong><span>'+esc(c.theme)+'</span></div>'+
      '<div class="echoes-mag-cover"><img src="'+esc(src)+'" alt="" width="1440" height="900" fetchpriority="high">'+
      '<div class="echoes-mag-overlay"></div><div class="echoes-mag-title"><span>'+esc(c.kicker)+'</span>'+
      '<h1>'+esc(c.title)+'</h1><p>'+esc(c.subtitle)+'</p></div>'+
      '<small class="echoes-cover-note">'+esc(e.artLabel)+'</small></div>'+
      '<div class="echoes-mag-columns"><div><span class="echoes-page-number">01 / '+esc(u.editorial)+'</span>'+
      '<p class="echoes-opening-text">'+esc(c.summary)+'</p>'+
      '<div class="echoes-story-sections">'+contentChapters(c,e,helpers)+'</div></div>'+
      '<aside class="echoes-side-note"><div><span class="section-kicker">'+esc(e.availability)+'</span><h2>'+esc(e.downloadPending)+'</h2>'+
      '<p>'+esc(e.editorialNote)+'</p></div><dl>'+editionFact(e.platformLabel,p.platform,helpers)+editionFact(e.kindLabel,c.type,helpers)+editionFact(e.stageLabel,e.draftStage,helpers)+'</dl>'+
      '<div><span class="section-kicker">'+esc(e.projectMedia)+'</span><p>'+esc(e.mediaPending)+'</p></div></aside></div>'+
    '</article>'+projectReturn(lang,e,helpers)+'</div></main>';
}
export function renderPreview(lang,p,t,helpers){return p.type==='echoes'?renderEchoes(lang,p,t,helpers):renderCrystal(lang,p,t,helpers);}
