/* Web de Draxie · lógica. Tus datos están en config.js */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const ls = {
  get(k, d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch{ return d } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true }catch{ return false } }
};
const say = t => { $('#panelMsg').textContent = t };
const DEF_CODE = ['$ whoami', 'draxie ✧', '$ cat sobre-mi.txt', 'escribo notas, guardo informes y colecciono cosas bonitas', '$ ./kanela --start', '[ok] interfaz de vidrio ...... listo', '[ok] estrellas y luciérnagas . listo', '[ok] gotitas de agua ......... listo', '$ echo "tengo sueño"', 'tengo sueño'];
const CF = {fondo: '', cancion: 'kanela fm · lo-fi', codigo: DEF_CODE, neofetch: null, estado: '✧ bienvenid@ a mi kinder', usuario: '', desde: '', stickers: [], notas: [], fotos: [], informes: [], redes: [], ...CONFIG};

/* ---- imágenes guardadas en el navegador (IndexedDB) ---- */
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
$('#nombre').textContent = CF.nombre; $('#usuario').textContent = CF.usuario;
$('#bio').textContent = CF.bio; $('#estado').textContent = CF.estado + ' ';
$('#desde').textContent = CF.desde ? 'miembro desde ' + CF.desde : '';
$('#redes').innerHTML = CF.redes.map(r => `<a class="chip" href="${r.u}" target="_blank" rel="noopener"><b>${(r.i || r.n.slice(0, 2)).toUpperCase()}</b>${r.n}</a>`).join('');
const fillNotas = (el, arr) => {
  el.innerHTML = arr.map(n => `<article class="nota"><time>${n.d}</time><h4></h4><p></p></article>`).join('');
  el.querySelectorAll('article').forEach((a, i) => { a.querySelector('h4').textContent = arr[i].t; a.querySelector('p').textContent = arr[i].x });
};
fillNotas($('#notas'), CF.notas); fillNotas($('#ultimas'), CF.notas.slice(0, 2));
$('#informes').innerHTML = CF.informes.map(i => `<a class="irow" href="${i.u}" target="_blank" rel="noopener">◇ ${i.t} <small>${i.d}</small></a>`).join('');
const kaos = ['(˶ᵔ ᵕ ᵔ˶)', '(｡•̀ᴗ-)✧', '(≧◡≦)', '(っ˘ω˘ς)', 'ᕙ(˵ ಠ ਊ ಠ ˵)ᕗ', '(｡T ω T｡)'];
let k = 0; $('#mood').onclick = () => { $('#mood').textContent = kaos[++k % kaos.length] };
const tick = () => { const d = new Date(); $('#hora').textContent = d.toLocaleTimeString('es', {hour: '2-digit', minute: '2-digit'});
  $('#fecha').textContent = d.toLocaleDateString('es', {weekday: 'long', day: 'numeric', month: 'long'}) };
tick(); setInterval(tick, 20000);
const tickTop = () => { $('#topClock').textContent = new Date().toLocaleTimeString('es', {hour: '2-digit', minute: '2-digit'}) };
tickTop(); setInterval(tickTop, 20000);

/* ---- fotos (las de config.js + las que subas en modo Draxie) ---- */
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
  CF.fotos.forEach(s => add(s));
  for(const k of (await keys()).filter(k => String(k).startsWith('foto:'))) add(await urlOf(k), k);
  if(!g.children.length) g.innerHTML = Array(6).fill('<div>tu foto<br>aquí ✧</div>').join('');
}
$('#fotoFile').onchange = async e => { for(const f of e.target.files) await put('foto:' + Date.now() + Math.random().toString(36).slice(2, 5), f); e.target.value = ''; renderFotos() };
$('#lb').onclick = () => $('#lb').close();

/* ---- zona privada ---- */
const P = CF.privado || {};
$('#driveLink').href = P.drive || '#';
$('#pedir').href = `mailto:${P.correo}?subject=${encodeURIComponent('Acceso a la zona privada')}&body=${encodeURIComponent('Hola Draxie, me das acceso? Mi correo de Google es: ')}`;
const unlock = () => { $('#lock').hidden = true; $('#unlocked').hidden = false };
if(sessionStorage.getItem('kk-ok')) unlock();
$('#btnUnlock').onclick = () => { if($('#code').value.trim() === P.codigo){ sessionStorage.setItem('kk-ok', 1); unlock() } else $('#codeErr').hidden = false };

/* ---- apariencia: fondo, banner, perfil ---- */
const BG = {
  'aurora rosa': '',
  'lila nube': 'linear-gradient(160deg,#e6d9ff,#cdb8f5 60%,#b8c9f5)',
  'cielo': 'linear-gradient(160deg,#d7ecff,#b9d6f7 60%,#d9c6f5)',
  'durazno': 'linear-gradient(160deg,#ffe3d1,#ffc7dc 60%,#e2c4f2)',
  'noche': 'linear-gradient(160deg,#2f2a4a,#4b3b73 60%,#6a4a8f)'
};
$('#bgPreset').innerHTML = Object.keys(BG).map(n => `<option>${n}</option>`).join('');
const S = ls.get('kk-set', {});
async function apply(){
  const bg = (await urlOf('bg')) || (CF.fondo && await probe(CF.fondo) ? CF.fondo : null), ba = (await urlOf('banner')) || CF.banner, av = (await urlOf('avatar')) || CF.avatar;
  $('#bgfill').style.background = bg ? `url("${bg}") center/cover` : S.bgColor || BG[S.bg] || '';
  $('#banner').style.setProperty('--banner', ba && await probe(ba) ? `url("${ba}")` : 'none');
  if(S.accent) document.documentElement.style.setProperty('--pink', S.accent);
  const img = $('#avImg'), err = $('#avErr');
  if(av && await probe(av)){ img.src = av; img.hidden = false; err.hidden = true }
  else { img.hidden = true; err.hidden = !av; err.textContent = `No encuentro «${av}». Revisa que esté en la carpeta img/ y que el nombre y la extensión coincidan.` }
}
const setS = (key, val) => { if(val === null) delete S[key]; else S[key] = val; ls.set('kk-set', S); apply() };
const upload = (id, key) => $(id).onchange = async e => { const f = e.target.files[0]; if(!f) return;
  try{ await put(key, f); if(key === 'bg'){ delete S.bgColor; delete S.bg; ls.set('kk-set', S) } say('listo ✧'); apply() } catch{ say('no se pudo guardar en este navegador') } e.target.value = '' };
upload('#bgFile', 'bg'); upload('#bannerFile', 'banner'); upload('#avatarFile', 'avatar');
$('#panel').onclick = async e => { const d = e.target.dataset.del; if(d){ await del(d); say('quitado'); apply() } };
$('#bgPreset').onchange = async e => { await del('bg'); delete S.bgColor; setS('bg', e.target.value) };
$('#bgColor').oninput = async e => { await del('bg'); setS('bgColor', e.target.value) };
$('#accent').oninput = e => setS('accent', e.target.value);
$('#reset').onclick = async () => { localStorage.removeItem('kk-set'); for(const k of await keys()) await del(k); location.reload() };
$('#btnCustom').onclick = () => { $('#panel').hidden = !$('#panel').hidden };
$('#closePanel').onclick = () => { $('#panel').hidden = true };

/* ---- perfil del chat (apodo + foto) ---- */
let prof = ls.get('kk-prof', null) || {n: ls.get('kk-nick', ''), a: ls.get('kk-av', '')}, draftAv = '';
const shrink = f => new Promise((ok, no) => { const img = new Image(), u = URL.createObjectURL(f);
  img.onload = () => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, 64, 64); const s = Math.min(img.width, img.height);
    g.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 64, 64); URL.revokeObjectURL(u); ok(c.toDataURL('image/jpeg', .8)) };
  img.onerror = no; img.src = u });
const paintMe = () => $$('.myav.me').forEach(e => { e.style.backgroundImage = prof.a ? `url("${prof.a}")` : ''; e.textContent = prof.a ? '' : (prof.n ? prof.n[0].toUpperCase() : '+') });
const paintP = () => { const e = $('#pAv'); e.style.backgroundImage = draftAv ? `url("${draftAv}")` : ''; e.childNodes[0].textContent = draftAv ? '' : '+' };
function openProfile(){ draftAv = prof.a; $('#pNick').value = prof.n; $('#pErr').hidden = true; paintP(); $('#profDlg').showModal() }
$('#pFile').onchange = async e => { const f = e.target.files[0]; if(!f) return; try{ draftAv = await shrink(f); paintP() }catch{ alert('No pude leer esa imagen') } e.target.value = '' };
$('#profForm').onsubmit = e => { e.preventDefault(); const n = $('#pNick').value.trim();
  if(n.toLowerCase() === 'draxie'){ $('#pErr').textContent = 'Ese apodo está reservado ✧ (prueba "Draxie ✧")'; $('#pErr').hidden = false; return }
  prof = {n, a: draftAv}; ls.set('kk-prof', prof); $('#profDlg').close(); paintMe() };
$('#pCancel').onclick = () => $('#profDlg').close();
$$('.myav.me').forEach(b => b.onclick = openProfile);

/* ---- chats ---- */
const FB = CF.firebase, online = !!(FB && FB.apiKey && window.firebase);
let me = null, admin = false, member = false, db = null, auth = null, pubMsgs = [], gMsgs = [], cur = '';
const mine = new Set(ls.get('kk-mine', []));
const color = (n, l = 55) => `hsl(${[...n].reduce((h, c) => h * 31 + c.charCodeAt(0), 7) % 360} 65% ${l}%)`;
const local = {load: () => ls.get('kk-chat', []), push: m => ls.set('kk-chat', [...local.load(), m].slice(-100)), del: id => ls.set('kk-chat', local.load().filter(m => m.id !== id))};
const push = (path, d) => { if(!me) return Promise.reject(); const key = db.ref(path).push().key, T = firebase.database.ServerValue.TIMESTAMP;
  return db.ref().update({[path + '/' + key]: {...d, t: T, uid: me}, ['limites/' + me]: T}) };

function makeChat(o){
  const bar = o.form.querySelector('.rbar'), msg = o.form.querySelector('.msgin'), tray = o.form.querySelector('.tray'), sb = o.form.querySelector('.stk-btn');
  let reply = null, cool = 0;
  const setReply = r => { reply = r; bar.hidden = !r; if(r) bar.querySelector('span').textContent = '↪ ' + r.n + ': ' + r.x };
  bar.querySelector('button').onclick = () => setReply(null);
  if(!CF.stickers.length) sb.hidden = true;
  else { tray.innerHTML = CF.stickers.map(s => `<button type="button" data-s="${s}"><img src="${s}" alt="sticker"></button>`).join(''); sb.onclick = () => { tray.hidden = !tray.hidden } }
  function post(extra){
    if(!prof.n) return openProfile();
    if(Date.now() < cool) return alert('Espera un momentito antes de enviar otro ✧');
    const d = {n: prof.n, x: '', ...(prof.a ? {a: prof.a} : {}), ...(reply ? {r: reply} : {}), ...extra};
    Promise.resolve(o.send(d)).then(() => { cool = Date.now() + 2500; setReply(null); draw() }).catch(() => alert('No se pudo enviar. Espera unos segundos e intenta de nuevo.'));
  }
  tray.onclick = e => { const b = e.target.closest('button'); if(b){ tray.hidden = true; post({x: 'sticker', s: b.dataset.s}) } };
  o.form.onsubmit = e => { e.preventDefault(); const x = msg.value.trim(); if(!x) return; msg.value = ''; post({x}) };
  function draw(){
    const ul = o.ul, all = o.list(); ul.innerHTML = '';
    if(!all.length) ul.innerHTML = `<li class="empty">${o.empty}</li>`;
    all.forEach(m => {
      const own = o.isMine(m), li = document.createElement('li'), box = document.createElement('div'), b = document.createElement('b'), t = document.createElement('time'), acts = document.createElement('span');
      li.className = 'c' + (o.wa && own ? ' mine' : ''); li.dataset.id = m.id; box.className = 'tx'; acts.className = 'acts';
      let av;
      if(m.a && /^data:image\/jpeg;base64,/.test(m.a)){ av = new Image(); av.src = m.a; av.alt = '' }
      else { av = document.createElement('span'); av.textContent = (m.n || '?')[0].toUpperCase(); av.style.background = color(m.n || '?', 70) }
      av.className = 'av';
      if(m.r){ const q = document.createElement('a'); q.className = 'quote'; q.textContent = '↪ ' + m.r.n + ': ' + m.r.x;
        q.onclick = () => { const s = ul.querySelector(`[data-id="${CSS.escape(String(m.r.i))}"]`); if(s){ s.scrollIntoView({block: 'center', behavior: 'smooth'}); s.classList.add('flash'); setTimeout(() => s.classList.remove('flash'), 1300) } };
        box.append(q) }
      b.textContent = m.n; b.style.color = color(m.n || '?'); t.textContent = new Date(m.t).toLocaleTimeString('es', {hour: '2-digit', minute: '2-digit'});
      box.append(b, t, document.createElement('br'));
      if(m.s && CF.stickers.includes(m.s)){ const s = new Image(); s.src = m.s; s.alt = 'sticker'; s.className = 'stk'; box.append(s) }
      else box.append(document.createTextNode(m.x));
      const rb = document.createElement('button'); rb.textContent = '↩'; rb.title = 'responder';
      rb.onclick = () => { setReply({i: m.id, n: m.n, x: (m.s ? 'sticker' : m.x).slice(0, 60)}); msg.focus() }; acts.append(rb);
      if(admin || own){ const x = document.createElement('button'); x.textContent = '✕'; x.title = 'eliminar';
        x.onclick = () => Promise.resolve(o.remove(m.id)).then(draw).catch(() => alert('No se pudo eliminar')); acts.append(x) }
      li.append(av, box, acts); ul.append(li);
    });
    ul.scrollTop = ul.scrollHeight;
  }
  return {draw};
}
const pub = makeChat({form: $('#chatForm'), ul: $('#msgs'), empty: 'aún no hay comentarios. ¡sé el primero! ✧',
  list: () => online ? pubMsgs : local.load(), isMine: m => online ? m.uid === me : mine.has(m.id),
  send: d => online ? push('comentarios', d) : (() => { const id = Date.now() + Math.random().toString(36).slice(2, 6); mine.add(id); ls.set('kk-mine', [...mine]); local.push({id, t: Date.now(), ...d}) })(),
  remove: id => online ? db.ref('comentarios/' + id).remove() : local.del(id)});
const gc = makeChat({form: $('#gForm'), ul: $('#gMsgs'), wa: true, empty: 'Nadie ha escrito todavía. ¡Rompe el hielo! ♡',
  list: () => gMsgs, isMine: m => m.uid === me, send: d => push('guarderia/mensajes', d), remove: id => db.ref('guarderia/mensajes/' + id).remove()});

/* ---- avisos de comentarios nuevos ---- */
let seen = ls.get('kk-seen', 0);
const badge = () => { const n = cur === 'comentarios' ? 0 : pubMsgs.filter(m => m.t > seen && m.uid !== me).length; const b = $('#bComent'); b.hidden = !n; b.textContent = n > 9 ? '9+' : n };
const markSeen = () => { const t = Math.max(0, ...pubMsgs.map(m => m.t || 0)); if(t){ seen = t; ls.set('kk-seen', t) } badge() };

/* ---- botones de modo Draxie ---- */
function ui(){
  document.body.classList.toggle('admin', admin);
  const b = $('#btnAdmin'); b.classList.toggle('on', admin); b.title = admin ? 'salir del modo Draxie' : 'modo Draxie';
  if(!admin) $('#panel').hidden = true;
}
let gRef = null;
const subG = on => { if(gRef){ gRef.off(); gRef = null }
  if(on){ gRef = db.ref('guarderia/mensajes').orderByChild('t').limitToLast(100);
    gRef.on('value', s => { gMsgs = []; s.forEach(c => { gMsgs.push({id: c.key, ...c.val()}) }); gc.draw() }, () => {}) } };
function sync(u){
  me = u.uid; const real = !u.isAnonymous;
  admin = real && (CF.adminEmail ? (u.email || '').toLowerCase() === CF.adminEmail.toLowerCase() : localStorage.getItem('kk-adm') === u.uid);
  member = real && u.emailVerified;
  $('#gOff').hidden = true; $('#gAuth').hidden = real; $('#gVerify').hidden = !real || member; $('#gChat').hidden = !member;
  if(real){ $('#gMailShow').textContent = u.email; if(!prof.n && u.displayName){ prof.n = u.displayName; ls.set('kk-prof', prof); paintMe() } }
  subG(member); ui(); pub.draw(); gc.draw(); badge();
}
if(online){
  firebase.initializeApp(FB); auth = firebase.auth(); db = firebase.database();
  auth.onAuthStateChanged(u => u ? sync(u) : auth.signInAnonymously().catch(() => {}));
  db.ref('comentarios').orderByChild('t').limitToLast(100).on('value', s => {
    pubMsgs = []; s.forEach(c => { pubMsgs.push({id: c.key, ...c.val()}) });
    if(!ls.get('kk-seen', 0) || cur === 'comentarios') markSeen(); else badge();
    pub.draw();
  });
} else { $('#gOff').hidden = false; admin = sessionStorage.getItem('kk-adm') === '1'; ui() }

let reg = false;
const ERR = {'auth/email-already-in-use': 'Ese correo ya tiene cuenta.', 'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.', 'auth/invalid-email': 'Correo no válido.',
  'auth/too-many-requests': 'Demasiados intentos, espera un rato.', nick: 'Elige un apodo de 2 a 16 letras.', reservado: 'Ese apodo está reservado ✧'};
$('#gSwap').onclick = () => { reg = !reg; $('#gNickRow').hidden = !reg; $('#gGo').textContent = reg ? 'crear cuenta' : 'entrar'; $('#gSwap').textContent = reg ? 'ya tengo cuenta' : 'crear cuenta'; $('#gPass').autocomplete = reg ? 'new-password' : 'current-password' };
$('#gAuth').onsubmit = async e => { e.preventDefault(); const er = $('#gErr'); er.hidden = true;
  try{
    const mail = $('#gMail').value.trim(), pass = $('#gPass').value;
    if(reg){ const nk = $('#gNick').value.trim();
      if(nk.length < 2) throw {code: 'nick'}; if(nk.toLowerCase() === 'draxie') throw {code: 'reservado'};
      const c = await auth.createUserWithEmailAndPassword(mail, pass);
      await c.user.updateProfile({displayName: nk}).catch(() => {}); await c.user.sendEmailVerification().catch(() => {});
      prof.n = nk; ls.set('kk-prof', prof); paintMe(); sync(auth.currentUser);
    } else await auth.signInWithEmailAndPassword(mail, pass);
  }catch(x){ er.textContent = ERR[x.code] || 'Correo o contraseña incorrectos.'; er.hidden = false } };
$('#gDone').onclick = async () => { const u = auth.currentUser;
  try{ await u.reload(); await u.getIdToken(true) }catch{}
  if(auth.currentUser.emailVerified) sync(auth.currentUser); else { $('#gVErr').textContent = 'Todavía no aparece verificado. Toca el enlace del correo y prueba otra vez.'; $('#gVErr').hidden = false } };
$('#gResend').onclick = () => auth.currentUser.sendEmailVerification().then(() => alert('Correo reenviado ✧')).catch(() => alert('Espera un poco antes de reenviar.'));
$$('[data-out]').forEach(b => b.onclick = () => auth.signOut());

$('#btnAdmin').onclick = () => {
  if(online){ admin ? auth.signOut() : $('#login').showModal(); return }
  if(admin) admin = false; else if(prompt('PIN de Draxie') === CF.adminPin) admin = true;
  sessionStorage.setItem('kk-adm', admin ? '1' : '0'); ui(); pub.draw();
};
$('#loginForm').onsubmit = async e => { e.preventDefault();
  try{ const c = await auth.signInWithEmailAndPassword($('#lEmail').value.trim(), $('#lPass').value);
    localStorage.setItem('kk-adm', c.user.uid); $('#login').close(); $('#lPass').value = ''; sync(auth.currentUser) }
  catch{ $('#lErr').hidden = false } };
$('#lCancel').onclick = () => $('#login').close();

/* ---- canales (navegación) ---- */
const CH = {inicio: ['inicio', 'bienvenid@ a mi rinconcito ✧'], notas: ['notas', 'mis notas y pensamientos'], fotos: ['fotos', 'cositas bonitas'],
  informes: ['informes', 'mis informes'], comentarios: ['comentarios', 'deja tu comentario con tu apodo'], guarderia: ['guardería', 'chat para miembros ♡'], privado: ['privado', 'solo con mi permiso']};
function go(ch, save = true){
  if(!CH[ch]) ch = 'inicio'; cur = ch;
  $$('.view').forEach(v => { const on = v.id === 'v-' + ch; v.hidden = !on; v.classList.remove('in'); if(on){ void v.offsetWidth; v.classList.add('in') } });
  $$('.ch').forEach(b => b.classList.toggle('on', b.dataset.ch === ch));
  $$('#ws button').forEach(b => b.classList.toggle('on', b.dataset.ch === ch));
  $('#chName').textContent = '# ' + CH[ch][0]; $('#chDesc').textContent = CH[ch][1];
  $('#app').classList.remove('open');
  if(save) history.replaceState(null, '', '#' + ch);
  scrollTo({top: 0, behavior: 'smooth'});
  if(ch === 'comentarios'){ markSeen(); pub.draw(); if(!prof.n) openProfile() }
  if(ch === 'guarderia') gc.draw();
}
$('#chs').onclick = e => { const b = e.target.closest('.ch'); if(b) go(b.dataset.ch) };
$('#btnMenu').onclick = () => $('#app').classList.toggle('open');
$('#scrim').onclick = () => $('#app').classList.remove('open');
/* ---- decoración estilo terminal / Linux ---- */
$('#ws').innerHTML = Object.keys(CH).map(k => `<button data-ch="${k}" title="${CH[k][0]}" aria-label="${CH[k][0]}"></button>`).join('');
$('#ws').onclick = e => { const b = e.target.closest('button'); if(b) go(b.dataset.ch) };
const NF = CF.neofetch || [['os', 'kanela linux'], ['host', CF.nombre], ['shell', 'cute.sh'], ['wm', 'glass-wm'], ['tema', 'pastel · vidrio'], ['mood', '(˶ᵔ ᵕ ᵔ˶)']];
$('#nf').innerHTML = `<b>${CF.nombre.toLowerCase()}@kanela</b><hr>` + NF.map(([a, v]) => `<div><span>${a}</span>${v}</div>`).join('') +
  '<div class="pal">' + ['#ff7eb6', '#b79ce6', '#a9cdf5', '#a8e6cf', '#ffd3a5', '#ffffff'].map(c => `<i style="background:${c}"></i>`).join('') + '</div>';
$('#bars').innerHTML = Array.from({length: 22}, () => `<span style="animation-duration:${(.6 + Math.random() * 1).toFixed(2)}s;animation-delay:-${(Math.random() * 2).toFixed(2)}s"></span>`).join('');
$('#song').textContent = '♪ ' + CF.cancion;
(async function typeLoop(){
  const el = $('#term'), L = CF.codigo, sl = ms => new Promise(r => setTimeout(r, ms)), cls = l => l[0] === '$' ? 'cmd' : l.startsWith('[ok]') ? 'ok' : '';
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ el.innerHTML = ''; L.forEach(l => { const d = document.createElement('div'); d.className = cls(l); d.textContent = l; el.append(d) }); return }
  for(;;){ el.innerHTML = '';
    for(const l of L){ while(document.hidden) await sl(1000);
      const d = document.createElement('div'); d.className = cls(l); el.append(d);
      if(l[0] === '$'){ for(const c of l){ d.textContent += c; await sl(35 + Math.random() * 45) } await sl(300) } else { d.textContent = l; await sl(260) } }
    await sl(4500) }
})();

paintMe(); renderFotos(); apply(); go(location.hash.slice(1) || 'inicio', false);
