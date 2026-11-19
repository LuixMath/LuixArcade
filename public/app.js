/* Small, progressively enhanced interactions. No framework or user tracking. */
(() => {
  'use strict';
  const root = document.documentElement;
  const locale = document.body.dataset.locale || 'pt-BR';
  const base = root.dataset.siteBase || '/LuixArcade/';
  const safeStore = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Storage can be disabled. */ } }
  };

  const storedTheme = safeStore.get('luix-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') root.dataset.theme = storedTheme;
  const currentTheme = () => root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const syncThemeColor = () => document.querySelector('meta[name="theme-color"]')?.setAttribute('content', currentTheme() === 'dark' ? '#16191a' : '#f7f6f2');
  syncThemeColor();
  document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    safeStore.set('luix-theme', next);
    syncThemeColor();
  });

  // Optional interface tones. Generated in-browser: no sound files and no autoplay.
  const soundToggle = document.querySelector('[data-sound-toggle]');
  let soundEnabled = safeStore.get('luix-sound') === 'on';
  let soundContext;
  let lastTone = 0;
  function playTone(kind='tap') {
    if (!soundEnabled || performance.now() - lastTone < 70) return;
    lastTone = performance.now();
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      soundContext ||= new Audio();
      if (soundContext.state === 'suspended') void soundContext.resume().catch(() => {});
      const now = soundContext.currentTime;
      const note = (freq, delay, duration, volume) => {
        const oscillator = soundContext.createOscillator();
        const envelope = soundContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq,now+delay);
        oscillator.frequency.exponentialRampToValueAtTime(freq*.96,now+delay+duration);
        envelope.gain.setValueAtTime(.0001,now+delay);
        envelope.gain.exponentialRampToValueAtTime(volume,now+delay+.009);
        envelope.gain.exponentialRampToValueAtTime(.0001,now+delay+duration);
        oscillator.connect(envelope);
        envelope.connect(soundContext.destination);
        oscillator.start(now+delay);
        oscillator.stop(now+delay+duration+.015);
      };
      if (kind === 'change') {
        note(515,0,.083,.019);
        note(690,.063,.115,.016);
      } else note(590,0,.09,.017);
    } catch { /* Audio is optional, including when browser policy blocks it. */ }
  }
  function syncSoundToggle() {
    if (!soundToggle) return;
    soundToggle.setAttribute('aria-pressed',String(soundEnabled));
    const label=soundEnabled?soundToggle.dataset.soundOnLabel:soundToggle.dataset.soundOffLabel;
    soundToggle.setAttribute('aria-label',label);
    soundToggle.title=label;
  }
  syncSoundToggle();
  soundToggle?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    safeStore.set('luix-sound',soundEnabled?'on':'off');
    syncSoundToggle();
    if (soundEnabled) { lastTone = 0; playTone('change'); }
  });
  document.addEventListener('pointerdown', event => {
    if (!soundEnabled || !event.target.closest) return;
    if (!event.target.closest('a,button,summary')) return;
    if (event.target.closest('[data-sound-toggle]')) return;
    playTone();
  });
  document.addEventListener('keydown', event => {
    if (!soundEnabled || !['Enter',' '].includes(event.key)) return;
    if (!event.target.matches?.('a,button,summary')) return;
    if (event.target.matches('[data-sound-toggle]')) return;
    playTone();
  });

  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('#mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const shouldOpen = mobileNav.hidden;
      mobileNav.hidden = !shouldOpen;
      navToggle.setAttribute('aria-expanded', String(shouldOpen));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileNav.hidden) {
        mobileNav.hidden = true;
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  const languagePicker = document.querySelector('.language-switcher');
  document.addEventListener('pointerdown', (event) => {
    if (languagePicker?.open && !languagePicker.contains(event.target)) languagePicker.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && languagePicker?.open) {
      languagePicker.open = false;
      languagePicker.querySelector('summary')?.focus();
    }
  });
  document.querySelectorAll('[data-lang-link]').forEach((anchor) => {
    anchor.addEventListener('click', () => safeStore.set('luix-language', anchor.dataset.langLink));
  });

  // Honor the saved language when a visitor returns to the storefront root.
  if (location.pathname === base) {
    const saved = safeStore.get('luix-language');
    if (saved && saved !== 'pt-BR' && ['en','es'].includes(saved)) {
      location.replace(base + saved + '/' + location.search + location.hash);
    }
  }

  const search = document.querySelector('#catalog-search');
  const form = document.querySelector('[data-catalog-form]');
  if (form && search) {
    const items = [...document.querySelectorAll('[data-project-item]')];
    const grid = document.querySelector('[data-project-grid]');
    const count = document.querySelector('[data-result-count]');
    const defaultEmpty = document.querySelector('[data-empty-default]');
    const searchEmpty = document.querySelector('[data-empty-search]');
    const filters = Object.fromEntries([...form.querySelectorAll('[data-filter]')].map(el => [el.dataset.filter, el]));
    const normalize = text => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
    const params = new URLSearchParams(location.search);
    const filterDetails = document.querySelector('[data-filter-details]');
    if (filterDetails && ['category','platform','status','sort'].some(key => params.has(key))) filterDetails.open = true;
    search.value = params.get('q') || '';
    for (const key of ['category','platform','status','sort']) {
      const value = params.get(key);
      if (filters[key] && value && [...filters[key].options].some(opt => opt.value === value)) filters[key].value = value;
    }
    const update = () => {
      const q = normalize(search.value.trim());
      const category = filters.category.value;
      const platform = filters.platform.value;
      const status = filters.status.value;
      const sort = filters.sort.value;
      let shown = 0;
      for (const item of items) {
        const matches = (!q || normalize(item.dataset.title).includes(q))
          && (!category || item.dataset.category === category)
          && (!platform || item.dataset.platforms.split(' ').includes(platform))
          && (!status || item.dataset.status === status);
        item.hidden = !matches;
        if (matches) shown++;
      }
      items.sort((a,b) => {
        if (sort === 'name') return a.dataset.title.localeCompare(b.dataset.title,locale);
        return sort === 'oldest'
          ? a.dataset.updated.localeCompare(b.dataset.updated)
          : b.dataset.updated.localeCompare(a.dataset.updated);
      }).forEach(item=>grid.appendChild(item));
      const singular = { 'pt-BR':'projeto encontrado',en:'project found',es:'proyecto encontrado' };
      const plural = { 'pt-BR':'projetos encontrados',en:'projects found',es:'proyectos encontrados' };
      count.textContent = shown + ' ' + (shown === 1 ? singular[locale] : plural[locale]);
      const hasFilters = !!(q || category || platform || status);
      const filterActive = hasFilters || sort !== 'newest';
      count.hidden = items.length === 0 && !filterActive;
      document.querySelectorAll('.catalog-reset').forEach(button => { button.hidden = !filterActive; });
      if (defaultEmpty) defaultEmpty.hidden = !(items.length === 0 && !hasFilters);
      if (searchEmpty) searchEmpty.hidden = !(shown === 0 && (items.length > 0 || hasFilters));
      const next = new URL(location.href);
      for (const key of ['q','category','platform','status','sort']) next.searchParams.delete(key);
      if (search.value.trim()) next.searchParams.set('q', search.value.trim());
      if (category) next.searchParams.set('category', category);
      if (platform) next.searchParams.set('platform', platform);
      if (status) next.searchParams.set('status', status);
      if (sort !== 'newest') next.searchParams.set('sort',sort);
      history.replaceState(null,'',next.pathname+next.search+next.hash);
      document.querySelectorAll('[data-lang-link]').forEach(anchor => {
        const url = new URL(anchor.href);
        url.search = next.search;
        anchor.href = url.href;
      });
    };
    form.addEventListener('submit', event => event.preventDefault());
    search.addEventListener('input', update);
    Object.values(filters).forEach(input => input.addEventListener('change',update));
    document.querySelectorAll('[data-reset]').forEach(button => button.addEventListener('click', () => {
      search.value = '';
      for (const [key,input] of Object.entries(filters)) input.value = key === 'sort' ? 'newest' : '';
      search.focus();
      update();
    }));
    update();
  }

  const dialog = document.querySelector('[data-gallery-dialog]');
  if (dialog && typeof dialog.showModal === 'function') {
    const image = dialog.querySelector('img');
    document.querySelectorAll('[data-gallery-src]').forEach(button => button.addEventListener('click', () => {
      image.src = button.dataset.gallerySrc;
      image.alt = button.dataset.galleryAlt || '';
      dialog.showModal();
    }));
    dialog.querySelector('[data-gallery-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  }
})();
