/* ===== EDITA AQUÍ TUS DATOS ===== */
const CONFIG = {
  nombre: "Draxie",
  bio: "Escribo notas, guardo informes y colecciono cosas bonitas. Aquí hay bibliografía corta de mí: (aquí tu texto).",
  bienvenida: "Este es mi kinder de notas. Pasa, mira, deja un comentario.",
  banner: "",            // ej: "img/banner.gif"
  avatar: "img/img/yo.gif",  // ej: "img/yo.png", "img/yo.jpg"
  redes: [
    {n: "Instagram", u: "https://instagram.com/tuusuario"},
    {n: "TikTok", u: "https://tiktok.com/@tuusuario"},
    {n: "Discord", u: "#"}
  ],
  notas: [
    {t: "Primera nota", d: "2026-10-22", x: "Cambia este texto en script.js. Puedes agregar tantas notas como quieras."}
  ],
  fotos: [],             // ej: ["img/foto1.jpg","img/foto2.gif"]
  informes: [
    {t: "Informe de ejemplo", d: "2026-10", u: "#"}
  ],
  privado: {
    drive: "https://drive.google.com/",  // tu carpeta de Drive
    codigo: "kanela",                    // código que tú das a quien quieras
    correo: "tucorreo@gmail.com"
  },
  adminPin: "1234",      // solo se usa si NO configuras Firebase
  firebase: {            // pega aquí tu firebaseConfig (ver pasos)
    apiKey: "AIzaSyAryABcorWHI3RabO5ubkXjYganSFbAK8s",
    authDomain: "kanela-15235.firebaseapp.com",
    databaseURL: "https://kanela-15235-default-rtdb.firebaseio.com",
    projectId: "kanela-15235",
    storageBucket: "kanela-15235.firebasestorage.app",
    messagingSenderId: "869165059331",
    appId: "1:869165059331:web:f373e91c99d1141f5e6d36"
  }
};
/* ================================= */

const $ = s => document.querySelector(s);
const ls = {
  get(k, d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch{ return d } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true }catch{ return false } }
};
const say = t => $('#panelMsg').textContent = t;

/* ---- almacén de imágenes (IndexedDB: aguanta GIFs pesados) ---- */
const dbp = new Promise((ok, no) => { try{ const r = indexedDB.open('kk', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('f'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error) }catch(e){ no(e) } });
const idb = (mode, fn) => dbp.then(d => new Promise((ok, no) => { const t = d.transaction('f', mode), q = fn(t.objectStore('f'));
  t.oncomplete = () => ok(q && q.result); t.onerror = () => no(t.error) }));
const put = (k, v) => idb('readwrite', s => s.put(v, k));
const get = k => idb('readonly', s => s.get(k)).catch(() => null);
const del = k => idb('readwrite', s => s.delete(k));
const keys = () => idb('readonly', s => s.getAllKeys()).catch(() => []);
const urlOf = async k => { const b = await get(k); return b ? URL.createObjectURL(b) : null };
const probe = src => new Promise(ok => { const i = new Image(); i.onload = () => ok(true); i.onerror = () => ok(false); i.src = src });

/* ---- contenido ---- */
$('#nombre').textContent = CONFIG.nombre;
$('#bio').textContent = CONFIG.bio;
$('#welcome').textContent = CONFIG.bienvenida;
$('#redes').innerHTML = CONFIG.redes.map(r => `<li><a href="${r.u}" target="_blank" rel="noopener">✧ ${r.n}</a></li>`).join('');
const fillNotas = (el, arr) => {
  el.innerHTML = arr.map(n => `<article class="nota box"><time>${n.d}</time><h4></h4><p></p></article>`).join('');
  el.querySelectorAll('article').forEach((a, i) => { a.querySelector('h4').textContent = arr[i].t; a.querySelector('p').textContent = arr[i].x });
};
fillNotas($('#notas'), CONFIG.notas);
fillNotas($('#ultimas'), CONFIG.notas.slice(0, 2));
$('#informes').innerHTML = CONFIG.informes.map(i => `<li><a href="${i.u}" target="_blank" rel="noopener">${i.t} <small>${i.d}</small></a></li>`).join('');

/* ---- fotos: las de CONFIG + las que subas tú ---- */
async function renderFotos(){
  const g = $('#fotos'); g.innerHTML = '';
  const add = (src, key) => {
    const f = document.createElement('figure'), i = new Image();
    i.src = src; i.alt = 'foto'; i.loading = 'lazy'; i.onclick = () => { $('#lbImg').src = src; $('#lb').showModal() };
    f.append(i);
    if(key){ const x = document.createElement('button'); x.className = 'x only-admin'; x.textContent = '✕'; x.title = 'quitar foto';
      x.onclick = async () => { await del(key); renderFotos() }; f.append(x) }
    g.append(f);
  };
  CONFIG.fotos.forEach(s => add(s));
  for(const k of (await keys()).filter(k => String(k).startsWith('foto:'))) add(await urlOf(k), k);
  if(!g.children.length) g.innerHTML = Array(6).fill('<div>tu foto<br>aquí ✧</div>').join('');
}
$('#fotoFile').onchange = async e => {
  for(const f of e.target.files) await put('foto:' + Date.now() + Math.random().toString(36).slice(2, 5), f);
  e.target.value = ''; renderFotos();
};
$('#lb').onclick = () => $('#lb').close();

/* ---- pestañas ---- */
function go(tab){
  document.querySelectorAll('.pane').forEach(p => p.hidden = p.id !== 's-' + tab);
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  $('#urlTab').textContent = tab;
}
$('#tabs').onclick = e => { if(e.target.dataset.tab) go(e.target.dataset.tab) };
const kaos = ['(˶ᵔ ᵕ ᵔ˶)','(｡•̀ᴗ-)✧','(≧◡≦)','(っ˘ω˘ς)','ᕙ(˵ ಠ ਊ ಠ ˵)ᕗ','(｡T ω T｡)'];
let k = 0; $('#mood').onclick = () => $('#mood').textContent = kaos[++k % kaos.length];

/* ---- zona privada ---- */
const P = CONFIG.privado;
$('#driveLink').href = P.drive;
$('#pedir').href = `mailto:${P.correo}?subject=${encodeURIComponent('Acceso a la zona privada')}&body=${encodeURIComponent('Hola Draxie, me das acceso? Mi correo de Google es: ')}`;
const unlock = () => { $('#lock').hidden = true; $('#unlocked').hidden = false };
if(sessionStorage.getItem('kk-ok')) unlock();
$('#btnUnlock').onclick = () => {
  if($('#code').value.trim() === P.codigo){ sessionStorage.setItem('kk-ok', 1); unlock() }
  else $('#codeErr').hidden = false;
};

/* ---- apariencia: fondo, banner, perfil ---- */
const BG = {
  'rosa cuadros': 'conic-gradient(#fbeaf2 25%,#f3c9dd 0 50%,#fbeaf2 0 75%,#f3c9dd 0) 0 0/36px 36px',
  'rosa liso': 'linear-gradient(160deg,#fbe3ee,#f3c9dd)',
  'lila con cruces': '#e6dfee repeating-linear-gradient(45deg,#ffffff55 0 2px,transparent 2px 14px)',
  'gris tinta': 'radial-gradient(circle at 30% 20%,#fff,#d9d9de 60%,#b9b9c2)',
  'puntitos': 'radial-gradient(#9a6c9855 2px,transparent 2px) 0 0/22px 22px,#f4eef8',
  'noche': 'linear-gradient(160deg,#2f2a35,#5a4a68)'
};
$('#bgPreset').innerHTML = Object.keys(BG).map(n => `<option>${n}</option>`).join('');
const S = ls.get('kk-set', {});
async function apply(){
  const bg = await urlOf('bg'), ba = (await urlOf('banner')) || CONFIG.banner, av = (await urlOf('avatar')) || CONFIG.avatar;
  document.body.style.background = bg ? `url("${bg}") center/cover fixed` : S.bgColor || BG[S.bg] || BG['rosa cuadros'];
  const r = document.documentElement.style;
  r.setProperty('--banner', ba && await probe(ba) ? `url("${ba}")` : 'none');
  if(S.accent) r.setProperty('--acento', S.accent);
  const img = $('#avImg'), err = $('#avErr');
  if(av && await probe(av)){ img.src = av; img.hidden = false; err.hidden = true }
  else { img.hidden = true; err.hidden = !av; err.textContent = `No encuentro «${av}». Revisa que esté en la carpeta img/ y que el nombre y la extensión coincidan.` }
}
const setS = (key, val) => { if(val === null) delete S[key]; else S[key] = val; ls.set('kk-set', S); apply() };
const upload = (id, key) => $(id).onchange = async e => { const f = e.target.files[0]; if(!f) return;
  try{ await put(key, f); if(key === 'bg'){ delete S.bgColor; delete S.bg; ls.set('kk-set', S) } say('listo ✧'); apply() }
  catch{ say('no se pudo guardar en este navegador') } e.target.value = '' };
upload('#bgFile', 'bg'); upload('#bannerFile', 'banner'); upload('#avatarFile', 'avatar');
$('#panel').onclick = async e => { const d = e.target.dataset.del; if(d){ await del(d); say('quitado'); apply() } };
$('#bgPreset').onchange = async e => { await del('bg'); delete S.bgColor; setS('bg', e.target.value) };
$('#bgColor').oninput = async e => { await del('bg'); setS('bgColor', e.target.value) };
$('#accent').oninput = e => setS('accent', e.target.value);
$('#reset').onclick = async () => { localStorage.removeItem('kk-set'); for(const k of await keys()) await del(k); location.reload() };
$('#btnCustom').onclick = () => $('#panel').hidden = !$('#panel').hidden;
$('#closePanel').onclick = () => $('#panel').hidden = true;

/* ---- comentarios ----
   Con Firebase configurado: compartidos entre todos. Sin él: solo en este navegador. */
const FB = CONFIG.firebase;
const online = !!(FB && FB.apiKey && window.firebase);
let msgs = [], me = null, admin = false, rdb = null, auth = null;
const mine = new Set(ls.get('kk-mine', []));
const local = { load: () => ls.get('kk-chat', []), push: m => ls.set('kk-chat', [...local.load(), m].slice(-100)),
  del: id => ls.set('kk-chat', local.load().filter(m => m.id !== id)) };
const color = n => `hsl(${[...n].reduce((h, c) => h * 31 + c.charCodeAt(0), 7) % 360} 70% 75%)`;
const isMine = m => online ? m.uid === me : mine.has(m.id);
function draw(){
  document.body.classList.toggle('admin', admin);
  const ul = $('#msgs'); ul.innerHTML = '';
  const all = online ? msgs : local.load();
  if(!all.length) ul.innerHTML = '<li>aún no hay comentarios. ¡sé el primero! ✧</li>';
  all.forEach(m => {
    const li = document.createElement('li'), b = document.createElement('b'), t = document.createElement('time');
    b.textContent = m.n + ': '; b.style.color = color(m.n);
    t.textContent = new Date(m.t).toLocaleTimeString('es', {hour:'2-digit', minute:'2-digit'});
    li.append(b, document.createTextNode(m.x), t);
    if(admin || isMine(m)){ const x = document.createElement('button'); x.textContent = '✕'; x.title = 'eliminar';
      x.onclick = () => { online ? rdb.child(m.id).remove().catch(() => alert('No se pudo eliminar')) : (local.del(m.id), draw()) }; li.prepend(x) }
    ul.append(li);
  });
  ul.scrollTop = ul.scrollHeight;
}
if(online){
  firebase.initializeApp(FB);
  auth = firebase.auth(); rdb = firebase.database().ref('comentarios');
  auth.onAuthStateChanged(u => {
    if(!u){ auth.signInAnonymously().catch(() => {}); return }
    me = u.uid; admin = !u.isAnonymous; if(!admin) $('#panel').hidden = true; draw();
  });
  rdb.orderByChild('t').limitToLast(100).on('value', s => {
    msgs = []; s.forEach(c => { msgs.push({id: c.key, ...c.val()}) }); draw();
  });
} else admin = sessionStorage.getItem('kk-admin') === '1';

$('#nick').value = ls.get('kk-nick', '');
$('#chatForm').onsubmit = e => { e.preventDefault();
  const n = $('#nick').value.trim(), x = $('#msg').value.trim(); if(!n || !x) return;
  ls.set('kk-nick', n);
  if(online){
    if(!me) return alert('Conectando… intenta de nuevo en un segundo.');
    rdb.push({n, x, t: firebase.database.ServerValue.TIMESTAMP, uid: me}).catch(() => alert('No se pudo enviar el comentario'));
  } else {
    const id = Date.now() + '' + Math.random().toString(36).slice(2, 6);
    mine.add(id); ls.set('kk-mine', [...mine]); local.push({id, n, x, t: Date.now()}); draw();
  }
  $('#msg').value = '';
};
$('#btnAdmin').onclick = () => {
  if(online){ admin ? auth.signOut() : $('#login').showModal(); return }
  if(admin) admin = false; else if(prompt('PIN de Draxie') === CONFIG.adminPin) admin = true;
  sessionStorage.setItem('kk-admin', admin ? '1' : '0'); if(!admin) $('#panel').hidden = true; draw();
};
$('#loginForm').onsubmit = async e => { e.preventDefault();
  try{ await auth.signInWithEmailAndPassword($('#lEmail').value.trim(), $('#lPass').value); $('#login').close(); $('#lPass').value = '' }
  catch{ $('#lErr').hidden = false } };
$('#lCancel').onclick = () => $('#login').close();
draw(); apply(); renderFotos();
