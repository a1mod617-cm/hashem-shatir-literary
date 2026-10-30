/* Hashem Shatir official library — independent, static GitHub Pages reader. */
'use strict';
const BOOKS = [
  {slug:'la-tuhaddiq-kathiran',title:'لا تحدّق كثيرًا',type:'رواية',genre:'رعب وغموض',year:'2025',pages:153,cover:'la-tuhaddiq.jpg',desc:'رواية تصحب القارئ إلى أجواء الرعب والغموض، حيث تتقاطع الأسئلة المخيفة مع خبايا النفس الإنسانية.',skip:[4,6,8,30,40,66,98,104,138]},
  {slug:'haribini-bisharaf',title:'حاربيني بشرف',type:'كتاب',genre:'الحياة والإنسان',year:'2023',pages:173,cover:'haribini.jpg',desc:'كتاب عن الحياة، يتأمل التجارب والمواقف الإنسانية وما تتركه في النفس من أثر ومعرفة ونضج.',skip:[]},
  {slug:'12-12',title:'12:12',subtitle:'كل شيء جميل عندما ننظر إليه بحب',type:'كتاب خواطر',genre:'خواطر وتأملات',year:'2024',pages:112,cover:'12-12.jpg',desc:'خواطر تتأمل جمال الحياة حين ننظر إليها بمحبة، وتمنح المشاعر الصغيرة صوتًا بين السطور.',skip:[4]},
  {slug:'warith-al-ahd',title:'وريث العهد',type:'رواية',genre:'فانتازيا',year:'2026',pages:218,cover:'warith.jpg',desc:'عالم من الفانتازيا والصراعات والأسرار، تتشابك فيه الأقدار مع العهود وتُختبر إرادة الإنسان أمام ما كُتب له وما يختار أن يكونه.',skip:[4,6,10]}
];
const $ = (id)=>document.getElementById(id);
const state = {book:null,page:1,zoom:1,filter:'all',query:'',loadToken:0,touchX:0,touchY:0,touchTime:0};
const media = (name)=>`./media/${name}`;
const pdf = (book)=>`./books/${book.slug}.pdf`;
const pageImage = (book,page)=>`./pages/${book.slug}/${String(page).padStart(3,'0')}.webp`;
const progressKey = (book)=>`hashem-reader-progress-v1:${book.slug}`;
const clamp = (n,min,max)=>Math.min(max,Math.max(min,n));
function getSaved(book){try{let v=Number(localStorage.getItem(progressKey(book)));return Number.isInteger(v)&&v>=1&&v<=book.pages?v:1}catch{return 1}}
function savePage(book,page){try{localStorage.setItem(progressKey(book),String(page))}catch{/* Private browsing / storage disabled. */}}
function normalizePage(book,page,step=1){let candidate=clamp(Math.round(page)||1,1,book.pages);while(book.skip.includes(candidate)&&candidate>=1&&candidate<=book.pages){const next=candidate+step;if(next<1||next>book.pages)break;candidate=next}return candidate}

function renderBooks(){
  const books=BOOKS.filter(book=>{
    const matchesFilter=state.filter==='all'||(state.filter==='رواية'?book.type==='رواية':book.type!=='رواية');
    return matchesFilter&&`${book.title} ${book.genre} ${book.desc}`.toLocaleLowerCase('ar').includes(state.query.toLocaleLowerCase('ar'));
  });
  $('book-grid').replaceChildren();
  $('no-results').hidden=books.length!==0;
  for(const book of books){
    const card=document.createElement('article');card.className='book-card';
    const saved=getSaved(book);
    card.innerHTML=`<button type="button" class="cover-click" aria-label="قراءة كتاب ${book.title}"><span class="book-3d"><span class="book-spine" aria-hidden="true"></span><img src="${media(book.cover)}" alt="غلاف كتاب ${book.title}" loading="lazy"></span></button><div class="book-card-content"><span class="genre-badge">${book.genre}</span><h3>${book.title}</h3><p class="book-card-description">${book.desc}</p><div class="book-meta"><span>${book.year}</span><span>•</span><span>${book.pages} صفحة</span></div><div class="book-actions"><button type="button" class="read-button">${saved>1?'متابعة القراءة':'اقرأ الآن'} ←</button><a class="pdf-link" href="${pdf(book)}" download="${book.slug}.pdf" aria-label="تحميل كتاب ${book.title}">PDF ↓</a></div>${saved>1?`<small class="continue-label">تابع من الصفحة ${saved}</small>`:''}</div>`;
    card.querySelector('.cover-click').addEventListener('click',()=>openBook(book));
    card.querySelector('.read-button').addEventListener('click',()=>openBook(book));
    $('book-grid').append(card);
    enhanceBookCard(card);
  }
}
function openBook(book){location.hash=`read/${book.slug}/${normalizePage(book,getSaved(book))}`}
function renderRoute(){
  const parts=location.hash.slice(1).split('/');
  if(parts[0]==='read'){
    const book=BOOKS.find(item=>item.slug===parts[1]);
    if(book){const page=normalizePage(book,Number(parts[2])||getSaved(book));showReader(book,page);return}
  }
  hideReader();
  if(location.hash&&location.hash!=='#home'){
    const target=document.querySelector(location.hash);
    if(target)setTimeout(()=>target.scrollIntoView({block:'start'}),0);
  }
}
function showReader(book,page){
  if(!state.book||state.book.slug!==book.slug){state.zoom=1;state.book=book}
  state.page=page;
  $('reader').hidden=false;document.body.classList.add('reader-open');
  $('reader-title').textContent=book.title;
  $('reader-subtitle').textContent=book.subtitle||book.genre;
  $('total-pages').textContent=book.pages;
  $('current-page').textContent=page;
  $('jump-page').max=book.pages;
  $('jump-page').value=page;
  $('download-book').href=pdf(book);
  $('download-book').download=`${book.slug}.pdf`;
  $('reader-pdf-fallback').href=pdf(book);
  $('prev-page').disabled=$('prev-tap').disabled=page<=1;
  $('next-page').disabled=$('next-tap').disabled=page>=book.pages;
  savePage(book,page);
  updateZoom();loadPage(book,page);
}
function hideReader(){
  if(!$('reader').hidden){$('reader').hidden=true;document.body.classList.remove('reader-open');state.book=null;renderBooks()}
}
function loadPage(book,page){
  const token=++state.loadToken;
  const img=$('page-image');const loader=$('page-loader');
  $('page-error').hidden=true;loader.hidden=false;img.classList.add('loading');
  const temp=new Image();temp.decoding='async';
  temp.onload=()=>{
    if(token!==state.loadToken)return;
    img.src=temp.src;img.alt=`${book.title} — صفحة ${page} من ${book.pages}`;
    img.classList.remove('loading');loader.hidden=true;
    img.classList.remove('page-turn');void img.offsetWidth;img.classList.add('page-turn');
    $('reader-stage').scrollTo({top:0,left:0,behavior:'instant'});
    prefetchNearby(book,page);
  };
  temp.onerror=()=>{if(token!==state.loadToken)return;loader.hidden=true;$('page-error').hidden=false};
  temp.src=pageImage(book,page);
}
function prefetchNearby(book,page){
  for(const step of [-1,1]){
    const next=normalizePage(book,page+step,step);
    if(next===page||next<1||next>book.pages)continue;
    const preload=new Image();preload.src=pageImage(book,next);
  }
}
function goPage(step){
  if(!state.book)return;
  const page=normalizePage(state.book,state.page+step,step);
  if(page===state.page)return;
  state.zoom=1;
  history.replaceState(null,'',`#read/${state.book.slug}/${page}`);
  showReader(state.book,page);
}
function jumpTo(page){if(!state.book)return;const next=normalizePage(state.book,Number(page),1);if(next!==state.page){state.zoom=1;history.replaceState(null,'',`#read/${state.book.slug}/${next}`);showReader(state.book,next)}}
function updateZoom(){
  const stage=$('reader-stage'),img=$('page-image');
  const zoom=state.zoom;
  stage.style.display=zoom>1?'block':'';
  img.style.height=zoom>1?`${Math.floor(stage.clientHeight*zoom)}px`:'';
  img.style.maxWidth=zoom>1?'none':'';
  img.style.maxHeight=zoom>1?'none':'';
  $('zoom-label').textContent=`${Math.round(zoom*100)}%`;
  $('zoom-out').disabled=zoom<=1;
  $('zoom-in').disabled=zoom>=2.5;
}
function adjustZoom(delta){state.zoom=clamp(Math.round((state.zoom+delta)*10)/10,1,2.5);updateZoom()}
function closeMenu(){$('mobile-menu').hidden=true;$('menu-toggle').setAttribute('aria-expanded','false')}

document.addEventListener('DOMContentLoaded',()=>{
  $('year').textContent=new Date().getFullYear();renderBooks();
  $('book-search').addEventListener('input',event=>{state.query=event.target.value.trim();renderBooks()});
  for(const button of $('filters').querySelectorAll('[data-filter]'))button.addEventListener('click',()=>{
    state.filter=button.dataset.filter;
    $('filters').querySelectorAll('[data-filter]').forEach(filter=>filter.classList.toggle('active',filter===button));
    renderBooks();
  });
  $('menu-toggle').addEventListener('click',()=>{const opened=$('mobile-menu').hidden;$('mobile-menu').hidden=!opened;$('menu-toggle').setAttribute('aria-expanded',String(opened))});
  $('mobile-menu').querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  window.addEventListener('hashchange',()=>{closeMenu();renderRoute()});
  $('close-reader').addEventListener('click',()=>{location.hash='books'});
  $('next-page').addEventListener('click',()=>goPage(1));$('next-tap').addEventListener('click',()=>goPage(1));
  $('prev-page').addEventListener('click',()=>goPage(-1));$('prev-tap').addEventListener('click',()=>goPage(-1));
  $('jump-page').addEventListener('change',event=>jumpTo(event.target.value));
  $('zoom-in').addEventListener('click',()=>adjustZoom(.25));
  $('zoom-out').addEventListener('click',()=>adjustZoom(-.25));
  $('zoom-reset').addEventListener('click',()=>{state.zoom=1;updateZoom()});
  $('fullscreen-reader').addEventListener('click',()=>{
    if(!document.fullscreenElement&&$('reader').requestFullscreen)$('reader').requestFullscreen().catch(()=>{});
    else if(document.exitFullscreen)document.exitFullscreen().catch(()=>{});
  });
  $('retry-page').addEventListener('click',()=>{if(state.book)loadPage(state.book,state.page)});
  $('reader-stage').addEventListener('touchstart',event=>{if(event.touches.length!==1)return;state.touchX=event.touches[0].clientX;state.touchY=event.touches[0].clientY;state.touchTime=Date.now()},{passive:true});
  $('reader-stage').addEventListener('touchend',event=>{
    if(!state.book||state.zoom>1||event.changedTouches.length!==1)return;
    const dx=event.changedTouches[0].clientX-state.touchX;
    const dy=event.changedTouches[0].clientY-state.touchY;
    if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.3&&Date.now()-state.touchTime<950)goPage(dx>0?1:-1);
  },{passive:true});
  window.addEventListener('keydown',event=>{
    if(!state.book||event.target instanceof HTMLInputElement)return;
    if(event.key==='Escape'){location.hash='books';return}
    if(event.key==='ArrowRight'){event.preventDefault();goPage(1)}
    if(event.key==='ArrowLeft'){event.preventDefault();goPage(-1)}
    if(event.key==='+'||event.key==='=')adjustZoom(.25);
    if(event.key==='-')adjustZoom(-.25);
  });
  window.addEventListener('resize',()=>{if(state.book)updateZoom()});
  renderRoute();
});

/* Book-object depth and subtle reader interactions — lightweight, no external dependencies. */
function enhanceBookCard(card){
  const button=card.querySelector('.cover-click');
  const object=card.querySelector('.book-3d');
  if(!button||!object||!window.matchMedia('(hover: hover) and (pointer: fine)').matches)return;
  button.addEventListener('pointermove',event=>{
    const rect=button.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    object.style.setProperty('--tilt-y',(x*20).toFixed(1)+'deg');
    object.style.setProperty('--tilt-x',(-y*11).toFixed(1)+'deg');
  },{passive:true});
  button.addEventListener('pointerleave',()=>{
    object.style.removeProperty('--tilt-y');
    object.style.removeProperty('--tilt-x');
  });
}
(function initScrollAccent(){
  const bar=document.getElementById('scroll-progress');
  if(!bar)return;
  let pending=false;
  function update(){
    const max=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.transform='scaleX('+(max>0?Math.min(1,Math.max(0,window.scrollY/max)):0)+')';
    pending=false;
  }
  window.addEventListener('scroll',()=>{
    if(!pending){pending=true;requestAnimationFrame(update)}
  },{passive:true});
  window.addEventListener('resize',update,{passive:true});
  update();
})();
