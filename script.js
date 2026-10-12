(() => {
  const pages = ['home','beauty','social','contact'];
  const navButtons = [...document.querySelectorAll('.nav-item')];
  const pageCount = document.getElementById('page-count');
  let currentPage = 'home';
  function showPage(name) {
    if (!pages.includes(name)) return;
    currentPage = name;
    document.querySelectorAll('.page').forEach(page => page.classList.toggle('active', page.id === `page-${name}`));
    navButtons.forEach(button => {
      const active = button.dataset.page === name;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
    pageCount.textContent = String(pages.indexOf(name) + 1).padStart(2, '0');
    history.replaceState(null, '', `#${name}`);
  }
  navButtons.forEach(button => button.addEventListener('click', () => showPage(button.dataset.page)));

  const sets = {
    beauty: Array.from({length:7}, (_,i) => ({src:`assets/beauty/${String(i+1).padStart(2,'0')}-beauty.mp4`, poster:`assets/posters/beauty/${String(i+1).padStart(2,'0')}-beauty.jpg`, title:`Beauty / Product ${String(i+1).padStart(2,'0')}`})),
    social: Array.from({length:8}, (_,i) => ({src:`assets/social/${String(i+1).padStart(2,'0')}-social.mp4`, poster:`assets/posters/social/${String(i+1).padStart(2,'0')}-social.jpg`, title:`Social Content ${String(i+1).padStart(2,'0')}`}))
  };
  const state = {beauty:0,social:0};
  const modulo = (n,m) => ((n % m) + m) % m;
  function renderCarousel(type) {
    const root = document.querySelector(`[data-carousel="${type}"]`);
    if (!root) return;
    const list = sets[type], index = state[type], prev = modulo(index-1,list.length), next = modulo(index+1,list.length);
    const slides = root.querySelector('.slides');
    slides.innerHTML = '';
    const createCard = (idx, position) => {
      const item = list[idx], card = document.createElement('button');
      card.className = `video-card ${position}`;
      card.type = 'button';
      card.setAttribute('aria-label', position === 'center' ? `Play ${item.title}` : `View ${item.title}`);
      if (position === 'center') {
        const video = document.createElement('video');
        video.src = item.src; video.poster = item.poster; video.controls = true; video.playsInline = true; video.preload = 'metadata';
        video.setAttribute('aria-label', item.title);
        video.addEventListener('play', () => { slides.querySelectorAll('video').forEach(other => { if(other !== video) other.pause(); }); });
        const badge = document.createElement('span'); badge.className='play-badge'; badge.setAttribute('aria-hidden','true'); badge.textContent='▶';
        card.append(video,badge);
        card.addEventListener('click', e => { if (e.target === card || e.target === badge) video.play().catch(()=>{}); });
      } else {
        const img = document.createElement('img'); img.src = item.poster; img.alt = item.title; img.loading = 'lazy'; card.append(img);
        card.addEventListener('click', () => { state[type] = idx; renderCarousel(type); });
      }
      return card;
    };
    slides.append(createCard(prev,'side-left'),createCard(index,'center'),createCard(next,'side-right'));
    const dots = root.parentElement.querySelector('.dots'); dots.innerHTML='';
    list.forEach((item,i) => { const dot=document.createElement('button'); dot.className=`dot${i===index?' active':''}`; dot.type='button'; dot.setAttribute('aria-label',`Go to ${item.title}`); dot.setAttribute('aria-current',i===index?'true':'false'); dot.addEventListener('click',()=>{state[type]=i;renderCarousel(type)}); dots.append(dot); });
    root.querySelector('.arrow-left').onclick = () => { state[type]=modulo(state[type]-1,list.length); renderCarousel(type); };
    root.querySelector('.arrow-right').onclick = () => { state[type]=modulo(state[type]+1,list.length); renderCarousel(type); };
  }
  renderCarousel('beauty'); renderCarousel('social');
  const initial = location.hash.slice(1); if (pages.includes(initial)) showPage(initial);
  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && ['beauty','social'].includes(currentPage)) { state[currentPage]=modulo(state[currentPage]-1,sets[currentPage].length); renderCarousel(currentPage); }
    if (event.key === 'ArrowRight' && ['beauty','social'].includes(currentPage)) { state[currentPage]=modulo(state[currentPage]+1,sets[currentPage].length); renderCarousel(currentPage); }
    if (event.key === 'Escape') showPage('home');
  });
})();
