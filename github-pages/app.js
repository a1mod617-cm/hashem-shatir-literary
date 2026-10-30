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



const QUOTE_ITEMS=[{"category":"عن الإنسان والحياة","text":"ليس كل ما نفقده يستحق أن نحزن عليه، وليس كل ما نحتفظ به يستحق أن يبقى."},{"category":"عن الإنسان والحياة","text":"أحيانًا، لا نحتاج إلى إجابة بقدر ما نحتاج إلى أن نفهم السؤال الذي يؤلمنا."},{"category":"عن الإنسان والحياة","text":"أشدّ ما يرهق الإنسان أن يظلّ وفيًّا لشيءٍ يستنزفه، فقط لأنه أحبّه يومًا."},{"category":"عن الكتابة والحكايات","text":"بعض الحكايات لا تُكتب لتُروى، بل لتجد روحًا أخرى تشبهها."},{"category":"عن الكتابة والحكايات","text":"في الكتب، نعيش حيواتٍ لم نُمنح فرصة عيشها، ونفهم أشياء عجزت تجاربنا وحدها عن تفسيرها."},{"category":"عن الكتابة والحكايات","text":"الكاتب لا يخلق الشخصيات من العدم دائمًا؛ أحيانًا يمنح مخاوفه أسماءً، ويتركها تتحدّث."},{"category":"عن الحب والفقد","text":"ليس الفقد أن يرحل أحدهم عن حياتك، بل أن تبقى الأشياء كما هي، ولا تعود أنت كما كنت."},{"category":"عن الحب والفقد","text":"بعض الأشخاص لا يتركون فراغًا في حياتنا فحسب، بل يغيّرون الطريقة التي نفهم بها الأشياء من حولنا."},{"category":"عن الحب والفقد","text":"أن تحبّ أحدهم يعني أن ترى إنسانيته كاملة، لا أن تحبّ فقط ما يمنحك إياه."},{"category":"عن الألم والنضج","text":"ننضج حين نتوقف عن مطالبة الحياة بأن تكون عادلة، ونبدأ في تعلّم كيف نعيش رغم ذلك."},{"category":"عن الألم والنضج","text":"هناك معارك لا ننتصر فيها، لكننا نخرج منها أكثر معرفةً بأنفسنا."},{"category":"عن الألم والنضج","text":"ليس كل صمتٍ عجزًا عن الكلام؛ بعض الصمت محاولة أخيرة للحفاظ على ما تبقّى فينا."},{"category":"عن الأمل والإيمان","text":"قد لا تفهم حكمة الطريق وأنت تسير فيه، لكن ذلك لا يعني أن كل خطوةٍ تخطوها بلا معنى."},{"category":"عن الأمل والإيمان","text":"ليس عليك أن ترى نهاية الطريق كي تواصل السير؛ يكفي أحيانًا أن تعرف أن الوقوف لن يغيّر شيئًا."},{"category":"عن الأمل والإيمان","text":"حين تضيق بنا الحياة، نتعلّم أن الطمأنينة ليست في امتلاك كل الإجابات، بل في القدرة على مواصلة الطريق دونها."}];

const BIOGRAPHY=["حيث تتجاور الحكايات مع الوجع، وتحتفظ الجدران بذاكرة لا تشيخ، جاءت حكاية هاشم خالد شطير، الكاتب والروائي اليمني الذي وجد في الكتابة مساحةً أوسع للتعبير عن الأشياء التي لا تتّسع لها الحياة اليومية.","تخرّج في كلية الصيدلة، لكن شغفه بالقراءة والأدب ظلّ رفيقًا له، يفتح أمامه أبوابًا أخرى لفهم الإنسان، ويمنحه القدرة على الاقتراب من عوالمه الخفية؛ من مخاوفه التي لا يعترف بها، إلى مشاعره التي يعجز عن تسميتها، والأسئلة التي يحملها معه ولا يجد لها إجابات نهائية.","لا ينظر هاشم إلى الكتابة باعتبارها مجرّد حكايات تُروى، بل بوصفها محاولةً لفهم الحياة من زوايا مختلفة، والاقتراب من الإنسان في لحظات ضعفه وتناقضه، حين يكون أكثر صدقًا مع نفسه، وأقل قدرةً على الاختباء خلف ما يُظهره للعالم.","في أعماله، تتنوّع المسارات بين الغموض والرعب، والفانتازيا، والتأملات الإنسانية، والحكايات التي تتقاطع فيها المشاعر مع التجارب والأسئلة الوجودية. ولكل عملٍ عالمه الخاص، وشخصياته التي تمضي في طرقها، تاركةً للقارئ مساحةً ليجد شيئًا من نفسه بين السطور.","صدرت له عدة أعمال أدبية، من بينها رواية «لا تحدّق كثيرًا»، التي يخوض فيها القارئ تجربةً من الرعب والغموض، وكتاب «حاربيني بشرف»، إلى جانب «12:12 — كل شيء جميل عندما ننظر إليه بحب». كما كتب روايته «وريث العهد»، التي تأخذ القارئ إلى عالم من الفانتازيا والصراعات والأسرار، حيث تتشابك الأقدار مع العهود، وتُختبر إرادة الإنسان أمام ما كُتب له وما يختار أن يكونه.","يواصل هاشم رحلته مع الكتابة، مؤمنًا بأن بعض الحكايات لا تنتهي حين نصل إلى آخر صفحاتها، وأن بعض الكلمات تظلّ حيّةً فينا طويلًا، لأنها لمست مكانًا لم نكن نعرف كيف نصل إليه.","فربما لا يكتب الإنسان ليقول كل ما في داخله، بل ليقترب، ولو قليلًا، من الأشياء التي عجز عن قولها."];

function make3DBook(book,variant="card",back=null){
 const backs={"la-tuhaddiq-kathiran":"la-tuhaddiq-back.jpg","haribini-bisharaf":"haribini-back.jpg","12-12":"12-12-photo.jpg","warith-al-ahd":"warith-back.jpg"};
 const colors={"la-tuhaddiq-kathiran":"#7d302c","haribini-bisharaf":"#8d816b","12-12":"#c59baa","warith-al-ahd":"#6d6255"};
 return `<div class="book3d book3d--${variant}" style="--book-edge:${colors[book.slug]||"#9f805b"}" aria-label="كتاب ${book.title} بمظهر ثلاثي الأبعاد"><div class="book3d-volume"><span class="book3d-edge book3d-edge--spine" aria-hidden="true"></span><span class="book3d-edge book3d-edge--pages" aria-hidden="true"></span><span class="book3d-edge book3d-edge--top" aria-hidden="true"></span><span class="book3d-edge book3d-edge--bottom" aria-hidden="true"></span><div class="book3d-back" aria-hidden="true"><img src="${media(back||backs[book.slug]||book.cover)}" alt="" loading="lazy"></div><img class="book3d-front" src="${media(book.cover)}" alt="غلاف ${book.title}" loading="lazy"><span class="book3d-light" aria-hidden="true"></span></div><span class="book3d-floor" aria-hidden="true"></span></div>`;
}

function renderBooks(){
 const books=BOOKS.filter(book=>{
  const matches=state.filter==='all'||(state.filter==='رواية'?book.type==='رواية':book.type!=='رواية');
  return matches&&`${book.title} ${book.genre} ${book.desc}`.toLocaleLowerCase('ar').includes(state.query.toLocaleLowerCase('ar'));
 });
 $('book-grid').replaceChildren();$('no-results').hidden=books.length!==0;
 for(const book of books){
  const index=BOOKS.findIndex(item=>item.slug===book.slug),saved=getSaved(book);
  const card=document.createElement('article');card.className='book-card';
  card.innerHTML=`<div class="book-image"><a href="#read/${book.slug}/${saved}" class="book-cover-link" aria-label="افتح كتاب ${book.title} للقراءة مباشرة">${make3DBook(book)}<span class="book-category">${book.genre}</span><span class="book-hover">▣ افتح الكتاب واقرأ ←</span></a><div class="book-reflection" aria-hidden="true"></div></div><div class="book-info"><span class="book-index">${String(index+1).padStart(2,"0")} / ${book.year}</span><h3><a href="#read/${book.slug}/${saved}">${book.title}</a></h3><p>${book.subtitle||book.type} · ${book.pages} صفحة</p><a class="book-read-direct" href="#read/${book.slug}/${saved}">▣ ${saved>1?'متابعة القراءة':'افتح الكتاب للقراءة'} ←</a><button class="book-arrow" type="button" aria-label="نبذة عن ${book.title}" title="نبذة وتفاصيل">◉</button></div>`;
  card.querySelector('.book-arrow').addEventListener('click',()=>openPreview(book));
  card.querySelector('.book-cover-link').addEventListener('pointermove',event=>{
   if(event.pointerType==='touch'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
   const r=event.currentTarget.getBoundingClientRect(),x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;
   card.style.setProperty('--rx',`${(0.5-y)*5}deg`);card.style.setProperty('--ry',`${(x-0.5)*5}deg`);card.style.setProperty('--mx',`${x*100}%`);card.style.setProperty('--my',`${y*100}%`);
  },{passive:true});
  card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg')});
  $('book-grid').append(card);
 }
}

let currentPreview=null;
function openPreview(book){
 currentPreview=book;
 $('preview-title').textContent=book.title;
 $('preview-subtitle').textContent=book.subtitle||'';
 $('preview-meta').innerHTML=`<span>${book.type}</span><span>${book.genre}</span><span>${book.year}</span>`;
 $('preview-desc').textContent=book.desc;
 $('preview-pages').textContent=`${book.pages} صفحة تنتظرك بين دفّتي الكتاب.`;
 $('preview-book').innerHTML=make3DBook(book,'modal');
 $('preview-art').style.setProperty('--book-accent',({"la-tuhaddiq-kathiran":"#7d302c","haribini-bisharaf":"#8d816b","12-12":"#c59baa","warith-al-ahd":"#6d6255"})[book.slug]);
 $('preview-download').href=pdf(book);
 $('preview-download').download=`${book.slug}.pdf`;
 $('flip-preview').textContent='⟲ اقلب الكتاب واكتشف خلفه';
 $('book-preview').hidden=false;document.body.classList.add('preview-open');$('preview-close').focus();
}

function closePreview(){$('book-preview').hidden=true;document.body.classList.remove('preview-open');currentPreview=null}

function renderQuotes(){
 const categories=[...new Set(QUOTE_ITEMS.map(q=>q.category))];
 let category=categories[1],index=0;
 function paint(){
  const items=QUOTE_ITEMS.filter(q=>q.category===category);
  $('quote-text').textContent=`«${items[index].text}»`;
  $('quote-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;
  $('quote-categories').querySelectorAll('button').forEach(btn=>{btn.classList.toggle('active',btn.dataset.category===category);btn.setAttribute('aria-pressed',String(btn.dataset.category===category))});
 }
 for(const name of categories){
  const btn=document.createElement('button');btn.type='button';btn.textContent=name;btn.dataset.category=name;
  btn.addEventListener('click',()=>{category=name;index=0;paint()});$('quote-categories').append(btn);
 }
 $('next-quote').addEventListener('click',()=>{index=(index+1)%QUOTE_ITEMS.filter(q=>q.category===category).length;paint()});
 $('prev-quote').addEventListener('click',()=>{index=(index-1+QUOTE_ITEMS.filter(q=>q.category===category).length)%QUOTE_ITEMS.filter(q=>q.category===category).length;paint()});
 $('copy-quote').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(`${$('quote-text').textContent} — هاشم خالد شطير`);$('copy-quote').textContent='✓';setTimeout(()=>{$('copy-quote').textContent='▣'},1200)}catch{$('copy-quote').textContent='حدد النص لنسخه'}});
 paint();
}

function renderShelf(){
 const read=BOOKS.filter(b=>getSaved(b)>1),completed=read.filter(b=>getSaved(b)>=b.pages);
 $('shelf-books').className='shelf-books';
 $('shelf-books').innerHTML=read.length?read.map(b=>{const saved=getSaved(b),pr=Math.round((saved/b.pages)*100);return `<article class="shelf-book"><a href="#read/${b.slug}/${saved}" class="shelf-cover">${make3DBook(b,'shelf')}</a><div class="shelf-copy"><span class="eyebrow">${b.genre}</span><h2>${b.title}</h2><p>واصل رحلتك بين الصفحات من حيث توقفت.</p><div class="shelf-progress-track"><span style="width:${pr}%"></span></div><span class="shelf-progress-caption">الصفحة ${saved} من ${b.pages} · ${pr}%</span><a href="#read/${b.slug}/${saved}" class="btn btn-gold">متابعة القراءة ←</a></div></article>`}).join(''):`<div class="journal-empty" style="grid-column:1/-1"><span class="eyebrow">مكتبتك تنتظرك</span><h2>كل حكايةٍ <em>تبدأ بصفحة.</em></h2><p>اختر كتابًا من المؤلفات، وسيُحفظ تقدمك تلقائيًا على جهازك.</p><a href="#works" class="btn btn-gold">اختر كتابك الأول ←</a></div>`;
 $('shelf-books').insertAdjacentHTML('beforebegin','');
}

function renderBio(){
 const anchor=$('bio-prose').querySelector('a');
 for(const paragraph of BIOGRAPHY){const el=document.createElement('p');el.textContent=paragraph;$('bio-prose').insertBefore(el,anchor)}
}

function openBook(book){location.hash=`read/${book.slug}/${normalizePage(book,getSaved(book))}`}
function renderRoute(){
 const parts=location.hash.slice(1).split('/');
 if(parts[0]==='read'){
  const book=BOOKS.find(item=>item.slug===parts[1]);
  if(book){const page=normalizePage(book,Number(parts[2])||getSaved(book));showReader(book,page);return}
 }
 hideReader();
 const panels={shelf:'shelf-panel',journal:'journal-panel',bio:'bio-panel'};
 const route=parts[0],isPage=Object.hasOwn(panels,route);
 $('site-content').hidden=isPage;
 for(const id of Object.values(panels))$(id).hidden=!isPage||panels[route]!==id;
 if(route==='shelf')renderShelf();
 if(isPage){window.scrollTo({top:0,behavior:'instant'});return}
 if(location.hash&&location.hash!=='#home'){
  const target=document.getElementById(route);
  if(target)setTimeout(()=>target.scrollIntoView({block:'start'}),0);
 }else if(location.hash==='#home'){window.scrollTo({top:0,behavior:'smooth'})}
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
function closeMenu(){$('mobile-menu').classList.remove('open');$('menu-toggle').setAttribute('aria-expanded','false');$('menu-toggle').textContent='☰'}



document.addEventListener('DOMContentLoaded',()=>{
 $('year').textContent=new Date().getFullYear();renderBooks();renderQuotes();renderBio();
 $('book-search').addEventListener('input',event=>{state.query=event.target.value.trim();renderBooks()});
 for(const button of $('filters').querySelectorAll('[data-filter]'))button.addEventListener('click',()=>{
  state.filter=button.dataset.filter;
  $('filters').querySelectorAll('[data-filter]').forEach(filter=>filter.classList.toggle('active',filter===button));
  renderBooks();
 });
 $('menu-toggle').addEventListener('click',()=>{const menu=$('mobile-menu'),open=!menu.classList.contains('open');menu.classList.toggle('open',open);$('menu-toggle').setAttribute('aria-expanded',String(open));$('menu-toggle').textContent=open?'✕':'☰'});
 $('mobile-menu').querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
 window.addEventListener('hashchange',()=>{closeMenu();renderRoute()});
 $('preview-close').addEventListener('click',closePreview);
 $('book-preview').addEventListener('click',event=>{if(event.target===$('book-preview'))closePreview()});
 $('flip-preview').addEventListener('click',()=>{const volume=$('preview-book').querySelector('.book3d');const flipped=volume.classList.toggle('book3d--flipped');$('flip-preview').textContent=flipped?'⟲ شاهد الغلاف الأمامي':'⟲ اقلب الكتاب واكتشف خلفه'});
 $('preview-read').addEventListener('click',()=>{if(currentPreview){const book=currentPreview;closePreview();openBook(book)}});
 window.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('book-preview').hidden)closePreview()});
   $('close-reader').addEventListener('click',()=>{location.hash='works'});
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
    if(event.key==='Escape'){location.hash='works';return}
    if(event.key==='ArrowRight'){event.preventDefault();goPage(1)}
    if(event.key==='ArrowLeft'){event.preventDefault();goPage(-1)}
    if(event.key==='+'||event.key==='=')adjustZoom(.25);
    if(event.key==='-')adjustZoom(-.25);
  });
  window.addEventListener('resize',()=>{if(state.book)updateZoom()});
 renderRoute();
});

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
