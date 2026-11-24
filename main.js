/* ---------- Lista de vídeos (para añadir un trabajo: copia una línea y súmalo a ORDER) ---------- */
const WORKS = {
  ed:          {t:'Teatro Real — FOOH', es:'3D · VFX · IA', en:'3D · VFX · AI'},
  orvane:      {t:'Orvane 1822', es:'3D de producto', en:'3D product'},
  reel3d:      {t:'Showreel 3D & Motion', es:'Showreel', en:'Showreel', f:'3d', big:1, dur:'0:45',
                des:'Blender, Unreal, Character Creator, motion graphics e iluminación.', den:'Blender, Unreal, Character Creator, motion graphics and lighting.'},
  reelav:      {t:'Showreel Audiovisual', es:'Showreel', en:'Showreel', f:'dir', big:1, dur:'0:39',
                des:'Dirección, edición y postproducción: spots, corto y contenido de marca.', den:'Directing, editing and post: commercials, short film and branded content.'},
  boticario:   {t:'Boticario Mágico', es:'Entorno 3D', en:'3D environment', f:'3d', big:1, dur:'0:43',
                des:'Escenario modelado y texturizado combinando 3D con Grease Pencil.', den:'Environment modelled and textured, blending 3D with Grease Pencil.'},
  prisma:      {t:'Prisma', es:'Cortometraje', en:'Short film', f:'dir', big:1, dur:'12:38',
                des:'Cortometraje de ficción: creación, dirección, producción y montaje.', den:'Fiction short film: created, directed, produced and edited.'},
  rafy:        {t:'Rafy', es:'Personaje 3D', en:'3D character', f:'3d', big:1, dur:'0:10',
                des:'Personaje esculpido, texturizado y presentado de principio a fin.', den:'Character sculpted, textured and presented end to end.'},
  hygeia:      {t:'Premios Hygeia', es:'Spot · Edición', en:'Spot · Edit', f:'dir', q:1, dur:'0:50',
                des:'Spot para FUDEN: edición de vídeo.', den:'Spot for FUDEN: video editing.'},
  fukuroshiki: {t:'Fukuroshiki', es:'Spot de producto', en:'Product spot', f:'dir', q:1, dur:'1:25',
                des:'Spot de producto: dirección, fotografía y montaje.', den:'Product commercial: directing, cinematography and edit.'}
};
const ORDER = ['reel3d','reelav','boticario','prisma','rafy','hygeia','fukuroshiki'];

/* ---------- Idioma ---------- */
function setLang(l){
  document.documentElement.classList.toggle('lang-en', l==='en');
  document.documentElement.lang = l;
  document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('on', b.dataset.lang===l));
  try{ localStorage.setItem('lang', l); }catch(e){}
}
let saved=null; try{ saved=localStorage.getItem('lang'); }catch(e){}
setLang(saved || ((navigator.language||'es').toLowerCase().startsWith('es') ? 'es' : 'en'));
document.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
const L = () => document.documentElement.classList.contains('lang-en') ? 'en' : 'es';

/* ---------- Pintar la rejilla ---------- */
const grid = document.getElementById('grid');
if (grid) ORDER.forEach(id=>{
  const w = WORKS[id];
  const el = document.createElement('article');
  el.className = 'card rv' + (w.big ? ' big' : '') + (w.q ? ' q' : '');
  el.dataset.f = w.f; el.dataset.open = id;
  el.innerHTML = `
    <div class="thumb">
      <img src="media/${id}.jpg" alt="${w.t}" loading="lazy">
      <video muted loop playsinline preload="none" data-src="media/${id}_loop.mp4"></video>
      <span class="dur">${w.dur||''}</span>
    </div>
    <div class="c-meta"><p class="c-title">${w.t}</p><p class="c-tag"><span class="es">${w.es}</span><span class="en">${w.en}</span></p></div>
    <p class="c-desc"><span class="es">${w.des||''}</span><span class="en">${w.den||''}</span></p>`;
  grid.appendChild(el);
});

/* Bucle al pasar el ratón (en móvil: al entrar en pantalla) */
const touch = matchMedia('(hover: none)').matches;
function play(card){ const v=card.querySelector('video'); if(!v) return; if(!v.src) v.src=v.dataset.src; v.play().then(()=>card.classList.add('playing')).catch(()=>{}); }
function stop(card){ const v=card.querySelector('video'); if(!v) return; card.classList.remove('playing'); if(v.src) v.pause(); }
/* .card = rejilla de trabajos · .proj = tarjetas de proyectos destacados de la portada */
document.querySelectorAll('.card, .proj').forEach(c=>{
  if(!touch){ c.addEventListener('mouseenter',()=>play(c)); c.addEventListener('mouseleave',()=>stop(c)); }
});
if(touch){
  const io = new IntersectionObserver(es=>es.forEach(e=> e.intersectionRatio>.6 ? play(e.target) : stop(e.target)), {threshold:[0,.6]});
  document.querySelectorAll('.card, .proj').forEach(c=>io.observe(c));
}

/* Filtros */
document.querySelectorAll('#filters button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('#filters button').forEach(x=>x.classList.toggle('on', x===b));
  document.querySelectorAll('.card').forEach(c=>c.classList.toggle('hide', b.dataset.f!=='all' && c.dataset.f!==b.dataset.f));
});

/* ---------- Visor a pantalla completa ---------- */
const lb=document.getElementById('lb'), lbv=document.getElementById('lbv'), lbt=document.getElementById('lbt');
document.addEventListener('click', e=>{
  const o = e.target.closest('[data-open]'); if(!o) return;
  const id=o.dataset.open, w=WORKS[id];
  lbv.src=`media/${id}.mp4`; lbv.poster=`media/${id}.jpg`;
  lbt.textContent = w.t + ' — ' + w[L()];
  lb.showModal(); lbv.play().catch(()=>{});
});
function closeLb(){ lbv.pause(); lbv.removeAttribute('src'); lbv.load(); lb.close(); }
lb.querySelector('.x').onclick=closeLb;
lb.addEventListener('click', e=>{ if(e.target===lb || e.target.classList.contains('lb')) closeLb(); });
lb.addEventListener('cancel', e=>{ e.preventDefault(); closeLb(); });

/* ---------- Comparadores antes/después ---------- */
document.querySelectorAll('.compare').forEach(c=>{
  c.querySelector('input').addEventListener('input', e=>c.style.setProperty('--x', e.target.value+'%'));
});

/* ---------- Menú opaco al bajar + aparición suave ---------- */
const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('solid', scrollY>40), {passive:true});
const rio = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); rio.unobserve(e.target);} }), {threshold:.12});
document.querySelectorAll('.rv').forEach(el=>rio.observe(el));
