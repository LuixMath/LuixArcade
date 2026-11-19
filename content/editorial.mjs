// Editorial copy and pre-release project pages. These are intentionally
// separate from content/projects.json: previews are NOT catalog releases.
export const previewProjects = [
  {slug:'crystal3ds',type:'crystal',cover:'crystal3ds-cover.svg',platform:'Nintendo 3DS'},
  {slug:'ocarina-of-time-3d-echoes',type:'echoes',cover:'echoes-cover.svg',platform:'Nintendo 3DS'}
];
export const editorial = {
  'pt-BR': {
    storeLabel:'Uma pequena biblioteca independente', featureTag:'DO MEU CADERNO DE PROJETOS',
    homeTitle:'Jogos e ideias que resolvi criar.', homeIntro:'Mods, homebrews, ferramentas e experiências feitas nas horas vagas. Tudo reunido por aqui.',
    editorialStories:'Na bancada', editorialDeck:'Dois projetos que estou desenvolvendo para Nintendo 3DS. Estas páginas mostram a proposta de cada um — ainda não são lançamentos.',
    openStory:'Ver página do projeto', browseTitle:'Explore a biblioteca', browseDeck:'Escolha uma categoria ou plataforma, como nas antigas lojas de console.',
    categoryLabel:'CATEGORIAS', exploreAll:'Ver todas', latestLabel:'CATÁLOGO',
    emptyTitle:'Ainda não há lançamentos para baixar.', emptyBody:'Quando uma versão estiver pronta para compartilhar, ela aparecerá aqui com as informações e o download correto.',
    introLabel:'UM POUCO SOBRE ESTE LUGAR', introTitle:'Feito no tempo livre.', introBody:'Não é uma loja comercial. É onde guardo e apresento o que venho criando, testando e aprendendo.',
    introLink:'Quem faz isso', mobileExplore:'Biblioteca', categorySubtitle:'Escolha o tipo de projeto', platforms:'Plataformas', previewsTag:'PÁGINAS EM PREPARAÇÃO',
    availability:'Disponibilidade', pending:'Ainda não há versão pública', previewNotice:'Página em desenvolvimento. As artes desta apresentação são ilustrações editoriais originais, não capturas do jogo.',
    projectBack:'Voltar à vitrine', projectConcept:'Sobre a ideia', projectNow:'Estado atual', projectNext:'Próximos passos', projectMedia:'Imagens do projeto', mediaPending:'Capturas reais serão adicionadas quando estiverem disponíveis.', platformLabel:'Plataforma', kindLabel:'Tipo', stageLabel:'Etapa', draftStage:'Em desenvolvimento', downloadPending:'Download ainda não disponível', editorialNote:'Esta página reúne a proposta do projeto. Ela não representa um lançamento nem uma versão pronta para uso.',
    legal:'Projetos independentes e não oficiais. Nintendo, Pokémon e The Legend of Zelda pertencem aos respectivos titulares. Nenhuma ROM ou arquivo comercial é distribuído aqui.',
    crystal:{
      title:'Crystal3DS',kicker:'EXPERIMENTO · NINTENDO 3DS',subtitle:'Um mundo em blocos, feito para caber no 3DS.',
      summary:'Um motor voxel 3D que estou desenvolvendo para experimentar cenários tridimensionais no Nintendo 3DS, com a ideia de um universo inspirado em Pokémon.',
      conceptTitle:'Primeiro, construir o mundo.',concept:'O Crystal3DS começou como uma ideia de motor voxel: explorar como ambientes construídos por blocos podem ganhar forma em um portátil como o Nintendo 3DS. É uma base experimental, e não estou apresentando isso como um jogo completo.',
      nowTitle:'Ainda é um experimento.',now:'O projeto segue em desenvolvimento. Não há uma versão pública nem uma lista de recursos finalizados e verificados para divulgar aqui.',
      nextTitle:'O que esta página vai receber.',next:'Quando houver materiais prontos para publicação, vou adicionar capturas reais, explicações sobre compatibilidade e informações de instalação.',
      type:'Motor voxel 3D',theme:'VOLUME 01 / UMA IDEIA EM CONSTRUÇÃO'
    },
    echoes:{
      title:'Ocarina of Time 3D Echoes',kicker:'PATCH & MOD · NINTENDO 3DS',subtitle:'Uma nova forma de revisitar uma aventura conhecida.',
      summary:'Um projeto pessoal de patch/mod para Ocarina of Time 3D no Nintendo 3DS, com experimentos de câmera, movimentação e recursos técnicos.',
      conceptTitle:'Revisitar, ajustar, experimentar.',concept:'Echoes reúne modificações que venho estudando para Ocarina of Time 3D. A ideia é experimentar novos comportamentos de câmera e movimentação, além de opções técnicas, sem perder o jeito de jogar do original.',
      nowTitle:'Mudanças em teste.',now:'Os ajustes estão em desenvolvimento e precisam ser validados no hardware. Recursos discutidos ou prototipados não devem ser considerados finalizados até serem testados.',
      nextTitle:'Antes de disponibilizar.',next:'Quero documentar as alterações confirmadas, os limites de compatibilidade e o processo de instalação antes de publicar um patch.',
      type:'Patch e mod',theme:'CADERNO DE PROJETO / EDIÇÃO 3DS'
    }
  },
  en:{
    storeLabel:'A small independent game library',featureTag:'FROM MY PROJECT NOTEBOOK',
    homeTitle:'Games and ideas I wanted to make.',homeIntro:'Mods, homebrew, tools, and experiments built in my spare time. A place to keep everything together.',
    editorialStories:'On the workbench',editorialDeck:'Two Nintendo 3DS projects I’m working on. These pages introduce the ideas behind them; they aren’t releases yet.',
    openStory:'Explore the project',browseTitle:'Browse the library',browseDeck:'Pick a category or platform, like browsing an old console store.',
    categoryLabel:'CATEGORIES',exploreAll:'See all',latestLabel:'LIBRARY',
    emptyTitle:'Nothing available to download yet.',emptyBody:'When a release is ready to share, it’ll appear here with accurate details and a working download link.',
    introLabel:'A LITTLE ABOUT THIS PLACE',introTitle:'Made in my spare time.',introBody:'This isn’t a commercial storefront. It’s where I keep and share what I’ve been building, testing, and learning.',
    introLink:'About the creator',mobileExplore:'Library',categorySubtitle:'Choose what you want to explore',platforms:'Platforms',previewsTag:'PAGES IN PROGRESS',
    availability:'Availability',pending:'No public build yet',previewNotice:'Work-in-progress page. The artwork here is original editorial illustration, not in-game screenshots.',
    projectBack:'Back to the storefront',projectConcept:'The idea',projectNow:'Where things stand',projectNext:'What comes next',projectMedia:'Project images',mediaPending:'Real screenshots will be added when they’re available.',platformLabel:'Platform',kindLabel:'Type',stageLabel:'Stage',draftStage:'In development',downloadPending:'No download available yet',editorialNote:'This page introduces a work in progress. It is not a release or a ready-to-use build.',
    legal:'Independent, unofficial fan projects. Nintendo, Pokémon, and The Legend of Zelda belong to their respective rights holders. No ROMs or commercial game files are distributed here.',
    crystal:{
      title:'Crystal3DS',kicker:'EXPERIMENT · NINTENDO 3DS',subtitle:'A world made of blocks, built for the 3DS.',
      summary:'A 3D voxel engine I’m developing to experiment with three-dimensional environments on Nintendo 3DS, with ideas inspired by the world of Pokémon.',
      conceptTitle:'First, build the world.',concept:'Crystal3DS began as a voxel-engine idea: exploring how block-based environments might take shape on a handheld like the Nintendo 3DS. It’s an experiment, not a complete game.',
      nowTitle:'Still experimental.',now:'Development is ongoing. There’s no public build or verified list of finished features to share here yet.',
      nextTitle:'What this page will gain.',next:'Once I have materials ready to publish, I’ll add actual screenshots, compatibility notes, and installation details.',
      type:'3D voxel engine',theme:'VOLUME 01 / A WORK IN PROGRESS'
    },
    echoes:{
      title:'Ocarina of Time 3D Echoes',kicker:'PATCH & MOD · NINTENDO 3DS',subtitle:'A different way to revisit a familiar adventure.',
      summary:'A personal Ocarina of Time 3D patch/mod project for Nintendo 3DS, exploring camera controls, movement, and technical options.',
      conceptTitle:'Revisit, adjust, experiment.',concept:'Echoes brings together modifications I’ve been exploring for Ocarina of Time 3D. The aim is to experiment with camera and movement behavior, plus technical settings, while keeping the spirit of the original gameplay.',
      nowTitle:'Changes under test.',now:'The changes are still in development and need verification on real hardware. Discussed or prototyped features aren’t considered finished until tested.',
      nextTitle:'Before a public patch.',next:'I want to document confirmed changes, compatibility limitations, and installation steps before releasing a patch.',
      type:'Patch and mod',theme:'PROJECT JOURNAL / 3DS EDITION'
    }
  },
  es:{
    storeLabel:'Una pequeña biblioteca independiente',featureTag:'DE MI CUADERNO DE PROYECTOS',
    homeTitle:'Juegos e ideas que quería crear.',homeIntro:'Mods, homebrew, herramientas y experimentos que hago en mis ratos libres. Todo reunido en un mismo lugar.',
    editorialStories:'En desarrollo',editorialDeck:'Dos proyectos para Nintendo 3DS en los que estoy trabajando. Estas páginas cuentan de qué tratan; todavía no son lanzamientos.',
    openStory:'Conocer el proyecto',browseTitle:'Explora la biblioteca',browseDeck:'Elige una categoría o una plataforma, como en las tiendas de las consolas de antes.',
    categoryLabel:'CATEGORÍAS',exploreAll:'Ver todas',latestLabel:'CATÁLOGO',
    emptyTitle:'Todavía no hay versiones para descargar.',emptyBody:'Cuando tenga una versión lista para compartir, aparecerá aquí con información real y un enlace de descarga.',
    introLabel:'SOBRE ESTE ESPACIO',introTitle:'Hecho en mis ratos libres.',introBody:'No es una tienda comercial. Es mi rincón para reunir y compartir lo que voy creando, probando y aprendiendo.',
    introLink:'Quién está detrás',mobileExplore:'Biblioteca',categorySubtitle:'Elige qué quieres explorar',platforms:'Plataformas',previewsTag:'PÁGINAS EN PREPARACIÓN',
    availability:'Disponibilidad',pending:'Aún no hay una versión pública',previewNotice:'Página en desarrollo. Las imágenes son ilustraciones editoriales originales, no capturas del juego.',
    projectBack:'Volver al inicio',projectConcept:'La idea',projectNow:'Estado actual',projectNext:'Qué viene después',projectMedia:'Imágenes del proyecto',mediaPending:'Añadiré capturas reales cuando estén disponibles.',platformLabel:'Plataforma',kindLabel:'Tipo',stageLabel:'Etapa',draftStage:'En desarrollo',downloadPending:'Descarga todavía no disponible',editorialNote:'Esta página presenta un proyecto en desarrollo. No anuncia un lanzamiento ni una versión terminada.',
    legal:'Proyectos independientes y no oficiales. Nintendo, Pokémon y The Legend of Zelda pertenecen a sus respectivos titulares. Aquí no se distribuyen ROM ni archivos comerciales.',
    crystal:{
      title:'Crystal3DS',kicker:'EXPERIMENTO · NINTENDO 3DS',subtitle:'Un mundo de bloques, pensado para la 3DS.',
      summary:'Un motor voxel 3D que estoy desarrollando para experimentar con escenarios tridimensionales en Nintendo 3DS, con ideas inspiradas en el universo de Pokémon.',
      conceptTitle:'Primero, construir el mundo.',concept:'Crystal3DS nació como una idea de motor voxel: explorar cómo dar forma a escenarios de bloques en una portátil como Nintendo 3DS. Es una base experimental, no un juego completo.',
      nowTitle:'Todavía es un experimento.',now:'El desarrollo continúa. Aún no hay una versión pública ni una lista comprobada de funciones terminadas que pueda mostrar.',
      nextTitle:'Lo que añadiré aquí.',next:'Cuando tenga material listo para publicar, incorporaré capturas reales, información de compatibilidad e instrucciones de instalación.',
      type:'Motor voxel 3D',theme:'VOLUMEN 01 / UNA IDEA EN CONSTRUCCIÓN'
    },
    echoes:{
      title:'Ocarina of Time 3D Echoes',kicker:'PARCHE Y MOD · NINTENDO 3DS',subtitle:'Otra forma de volver a una aventura conocida.',
      summary:'Un proyecto personal de parche/mod para Ocarina of Time 3D en Nintendo 3DS, con pruebas de cámara, movimiento y opciones técnicas.',
      conceptTitle:'Volver, ajustar, experimentar.',concept:'Echoes reúne modificaciones que estoy explorando para Ocarina of Time 3D. La idea es probar ajustes de cámara y movimiento, además de opciones técnicas, sin perder la esencia de la jugabilidad original.',
      nowTitle:'Cambios en pruebas.',now:'Los ajustes siguen en desarrollo y deben verificarse en la consola. Las funciones estudiadas o prototipadas no se consideran terminadas sin pruebas.',
      nextTitle:'Antes de publicar un parche.',next:'Quiero documentar los cambios confirmados, las limitaciones de compatibilidad y los pasos de instalación antes de compartirlo.',
      type:'Parche y mod',theme:'CUADERNO DE PROYECTO / EDICIÓN 3DS'
    }
  }
};
