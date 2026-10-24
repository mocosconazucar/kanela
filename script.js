/* Web de Draxie · lógica. Tus datos están en config.js */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const ls = {
  get(k, d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch{ return d } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true }catch{ return false } }
};
const say = t => { $('#panelMsg').textContent = t };
const bioLine = CONFIG.bio && !CONFIG.bio.includes('aquí tu texto') ? CONFIG.bio : 'escribo notas, guardo informes y colecciono cosas bonitas';
const DEF_CODE = ['$ whoami', CONFIG.nombre.toLowerCase() + ' ✧', '$ cat sobre-mi.txt', bioLine, '$ ./kanela --start', '[ok] interfaz de vidrio ...... listo', '[ok] estrellas y luciérnagas . listo', '[ok] gotitas de agua ......... listo', '$ echo "tengo sueño"', 'tengo sueño'];
const CF = {fondo: '', cancion: 'kanela.fm', stats: null, codigo: DEF_CODE, neofetch: null, estado: '✧ bienvenid@ a mi kinder', usuario: '', desde: '', stickers: [], notas: [], fotos: [], informes: [], redes: [], ...CONFIG};

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
$('#estado').textContent = CF.estado + ' ';
const ICO = {
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.2" cy="6.8" r=".5"/>',
  tiktok: '<path d="M14 4v10.5a3.4 3.4 0 1 1-3.4-3.4"/><path d="M14 4c.4 2.4 1.9 3.9 4.2 4.2"/>',
  discord: '<path d="M7.5 7C10 6 14 6 16.5 7c1.7 2.8 2.4 5.6 2.2 8.7-1.7 1.3-3.2 1.9-4.7 2.3l-.9-1.7M7.5 7C5 9.8 4.3 12.6 4.5 15.7c1.7 1.3 3.2 1.9 4.7 2.3l.9-1.7"/><circle cx="9.6" cy="12.4" r="1.1"/><circle cx="14.4" cy="12.4" r="1.1"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="M10.5 9.6v4.8l4.2-2.4z"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'
};
const icon = r => { const k = Object.keys(ICO).find(k => (r.i || r.n).toLowerCase().includes(k)); return `<svg viewBox="0 0 24 24">${ICO[k || 'link']}</svg>` };
$('#redes').innerHTML = CF.redes.map(r => `<a class="chip" href="${r.u}" target="_blank" rel="noopener"><b>${icon(r)}</b>${r.n}</a>`).join('');
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
let photos = [], pi = 0;
const fmeta = ls.get('kk-fmeta', {});
async function renderFotos(){
  const g = $('#fotos'); g.innerHTML = ''; photos = [];
  CF.fotos.forEach(f => photos.push(typeof f === 'string' ? {src: f} : {...f}));
  for(const k of (await keys()).filter(k => String(k).startsWith('foto:'))) photos.push({src: await urlOf(k), key: k, ...(fmeta[k] || {})});
  photos.forEach((p, i) => {
    const f = document.createElement('figure'), im = new Image();
    im.src = p.src; im.alt = p.t || 'foto'; im.loading = 'lazy'; im.onclick = () => openPhoto(i); f.append(im);
    if(p.key){ const x = document.createElement('button'); x.className = 'x only-admin'; x.textContent = '✕'; x.title = 'quitar foto';
      x.onclick = async () => { await del(p.key); delete fmeta[p.key]; ls.set('kk-fmeta', fmeta); renderFotos() }; f.append(x) }
    g.append(f);
  });
  if(!photos.length) g.innerHTML = Array(6).fill('<div>tu foto<br>aquí ✧</div>').join('');
}
function openPhoto(i){
  pi = (i + photos.length) % photos.length; const p = photos[pi];
  $('#lbImg').src = p.src; $('#lbN').textContent = String(pi + 1).padStart(2, '0') + '/' + String(photos.length).padStart(2, '0');
  $('#lbTitle').textContent = p.t || 'sin título'; $('#lbDesc').textContent = p.d || '— sin descripción —';
  $('#lbSrc').textContent = p.key ? 'subida (tu navegador)' : p.src.split('/').pop();
  const ed = $('#lbEdit'); ed.hidden = !(admin && p.key); $('#lbT').value = p.t || ''; $('#lbD').value = p.d || '';
  if(!$('#lb').open) $('#lb').showModal();
}
$('#lbEdit').onsubmit = e => { e.preventDefault(); const p = photos[pi]; p.t = $('#lbT').value.trim(); p.d = $('#lbD').value.trim();
  fmeta[p.key] = {t: p.t, d: p.d}; ls.set('kk-fmeta', fmeta); openPhoto(pi) };
$('#lbPrev').onclick = () => openPhoto(pi - 1); $('#lbNext').onclick = () => openPhoto(pi + 1); $('#lbClose').onclick = () => $('#lb').close();
$('#lb').addEventListener('click', e => { if(e.target === $('#lb')) $('#lb').close() });
$('#lb').addEventListener('keydown', e => { if(e.key === 'ArrowLeft') openPhoto(pi - 1); if(e.key === 'ArrowRight') openPhoto(pi + 1) });
$('#fotoFile').onchange = async e => { for(const f of e.target.files) await put('foto:' + Date.now() + Math.random().toString(36).slice(2, 5), f); e.target.value = ''; renderFotos() };

/* ---- zona privada ---- */
const P = CF.privado || {};
$('#driveLink').href = P.drive || '#';
$('#pedir').href = `mailto:${P.correo}?subject=${encodeURIComponent('Acceso a la zona privada')}&body=${encodeURIComponent('Hola Draxie, me das acceso? Mi correo de Google es: ')}`;
const unlock = () => { $('#lock').hidden = true; $('#unlocked').hidden = false };
if(sessionStorage.getItem('kk-ok')) unlock();
$('#btnUnlock').onclick = () => { if($('#code').value.trim() === P.codigo){ sessionStorage.setItem('kk-ok', 1); unlock() } else $('#codeErr').hidden = false };

/* ---- apariencia: fondo, banner, perfil ---- */
const BG = {
  'grafito': '',
  'bosque': 'linear-gradient(160deg,#0d1f1b,#163129 60%,#0f1a1a)',
  'medianoche': 'linear-gradient(160deg,#0c1118,#16202c 60%,#0d141a)',
  'niebla': 'linear-gradient(160deg,#252c2c,#3a4545 60%,#2a3333)',
  'rosa tenue': 'linear-gradient(160deg,#2a1f27,#3d2b38 60%,#241b22)'
};
$('#bgPreset').innerHTML = Object.keys(BG).map(n => `<option>${n}</option>`).join('');
const S = ls.get('kk-set', {});
async function apply(){
  const bg = (await urlOf('bg')) || (CF.fondo && await probe(CF.fondo) ? CF.fondo : null), ba = (await urlOf('banner')) || CF.banner, av = (await urlOf('avatar')) || CF.avatar;
  $('#bgimg').style.backgroundImage = bg ? `url("${bg}")` : 'none'; $('#bgimg').style.opacity = (S.bgOp ?? 50) / 100;
  $('#bgfill').style.background = S.bgColor || BG[S.bg] || '';
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
$('#bgOp').value = S.bgOp ?? 50; $('#bgOp').oninput = e => setS('bgOp', +e.target.value);
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
const color = (n, l = 72) => `hsl(${[...n].reduce((h, c) => h * 31 + c.charCodeAt(0), 7) % 360} 65% ${l}%)`;
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
      if(m.r){ const q = document.createElement('a'); q.className = 'quote'; const qn = document.createElement('b'); qn.textContent = m.r.n; q.append('↪ ', qn, ': ' + m.r.x);
        q.onclick = () => { const s = ul.querySelector(`[data-id="${CSS.escape(String(m.r.i))}"]`); if(s){ s.scrollIntoView({block: 'center', behavior: 'smooth'}); s.classList.add('flash'); setTimeout(() => s.classList.remove('flash'), 1300) } };
        box.append(q) }
      b.textContent = m.n; b.style.color = color(m.n || '?'); t.textContent = new Date(m.t).toLocaleTimeString('es', {hour: '2-digit', minute: '2-digit'});
      box.append(b, t, document.createElement('br'));
      if(m.s && CF.stickers.includes(m.s)){ const s = new Image(); s.src = m.s; s.alt = 'sticker'; s.className = 'stk'; box.append(s) }
      else m.x.split(/(@[^\s@]+)/).forEach(p => {
        if(p.length > 1 && p[0] === '@'){ const s = document.createElement('strong'); const norm = t => t.replace(/\s+/g, '').toLowerCase();
          s.className = 'mention' + (prof.n && norm(p.slice(1)) === norm(prof.n) ? ' me' : ''); s.textContent = p; box.append(s) }
        else box.append(document.createTextNode(p)) });
      const rb = document.createElement('button'); rb.textContent = '↩'; rb.title = 'responder';
      rb.onclick = () => { setReply({i: m.id, n: m.n, x: (m.s ? 'sticker' : m.x).slice(0, 60)}); const tag = '@' + m.n.replace(/\s+/g, ''); if(!msg.value.startsWith(tag)) msg.value = tag + ' ' + msg.value; msg.focus() }; acts.append(rb);
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
let gRef = null; const pubKnown = new Set(), gKnown = new Set(); let pubLoaded = false, gLoaded = false;
const subG = on => { if(gRef){ gRef.off(); gRef = null } gKnown.clear(); gLoaded = false;
  if(on){ gRef = db.ref('guarderia/mensajes').orderByChild('t').limitToLast(100);
    gRef.on('value', s => { gMsgs = []; s.forEach(c => { gMsgs.push({id: c.key, ...c.val()}) }); const fresh = gLoaded ? gMsgs.filter(m => !gKnown.has(m.id)) : []; gMsgs.forEach(m => gKnown.add(m.id)); gLoaded = true; fresh.forEach(m => notify('guarderia', m)); gc.draw() }, () => {}) } };
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
    const fresh = pubLoaded ? pubMsgs.filter(m => !pubKnown.has(m.id)) : []; pubMsgs.forEach(m => pubKnown.add(m.id)); pubLoaded = true; fresh.forEach(m => notify('comentarios', m));
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
  const nb = $('#navbar'); nb.classList.remove('go'); void nb.offsetWidth; nb.classList.add('go');
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
const NF = CF.neofetch || [['os', 'kanela linux'], ['host', CF.nombre], ['shell', 'cute.sh'], ['wm', 'glass-wm'], ['tema', 'pastel · vidrio'], ['mood', '(˶ᵔ ᵕ ᵔ˶)'], ...(CF.desde ? [['desde', CF.desde]] : [])];
$('#nf').innerHTML = `<b>${CF.nombre.toLowerCase()}@kanela</b><hr>` + NF.map(([a, v]) => `<div><span>${a}</span>${v}</div>`).join('') +
  '<div class="pal">' + ['#ff7eb6', '#b79ce6', '#a9cdf5', '#a8e6cf', '#ffd3a5', '#ffffff'].map(c => `<i style="background:${c}"></i>`).join('') + '</div>';
(async function typeLoop(){
  const el = $('#term'), L = CF.codigo, sl = ms => new Promise(r => setTimeout(r, ms)), cls = l => l[0] === '$' ? 'cmd' : l.startsWith('[ok]') ? 'ok' : '';
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){ el.innerHTML = ''; L.forEach(l => { const d = document.createElement('div'); d.className = cls(l); d.textContent = l; el.append(d) }); return }
  for(;;){ el.innerHTML = '';
    for(const l of L){ while(document.hidden) await sl(1000);
      const d = document.createElement('div'); d.className = cls(l); el.append(d);
      if(l[0] === '$'){ for(const c of l){ d.textContent += c; await sl(35 + Math.random() * 45) } await sl(300) } else { d.textContent = l; await sl(260) } }
    await sl(4500) }
})();

/* ---- telemetría, avisos, carga y app instalable ---- */
const ST = CF.stats || [['sueño', 98], ['café', 42], ['creatividad', 77], ['batería social', 31]];
const stVals = ST.map(s => s[1]);
const drawSt = () => { $('#stats').innerHTML = ST.map((s, i) => `<div class="st"><span>${s[0]}</span><i><u style="width:${stVals[i]}%"></u></i><b>${Math.round(stVals[i])}%</b></div>`).join('') };
drawSt(); setInterval(() => { if(document.hidden) return; stVals.forEach((v, i) => { stVals[i] = Math.max(5, Math.min(100, v + (Math.random() - .5) * 8)) }); drawSt() }, 3000);

let nOn = ls.get('kk-notif', false), unread = 0; const baseTitle = document.title;
const bellUI = () => $('#btnBell').classList.toggle('on', nOn && 'Notification' in window && Notification.permission === 'granted');
$('#btnBell').onclick = async () => {
  if(!('Notification' in window)) return alert('Tu navegador no permite avisos del sistema, pero verás avisos dentro de la página.');
  if(nOn){ nOn = false } else { const p = await Notification.requestPermission(); nOn = p === 'granted'; if(!nOn) alert('Para activar los avisos, permite las notificaciones de este sitio en tu navegador.') }
  ls.set('kk-notif', nOn); bellUI() };
bellUI();
function toast(t, x, ch){ const d = document.createElement('div'); d.className = 'toast'; const b = document.createElement('b'), s = document.createElement('span'); b.textContent = t; s.textContent = x; d.append(b, s);
  d.onclick = () => { go(ch); d.remove() }; $('#toasts').append(d); setTimeout(() => d.remove(), 5500) }
function notify(ch, m){
  if(m.uid === me) return;
  const where = ch === 'comentarios' ? 'comentarios' : 'guardería', txt = m.s ? 'envió un sticker' : (m.x || '');
  if(document.hidden){ unread++; document.title = `(${unread}) ${baseTitle}`; if(navigator.setAppBadge) navigator.setAppBadge(unread).catch(() => {});
    if(nOn && 'Notification' in window && Notification.permission === 'granted'){ try{ new Notification(`${m.n} · ${where}`, {body: txt, icon: 'icon-192.png'}) }catch{} } }
  else if(cur !== ch) toast(`${m.n} · ${where}`, txt, ch);
}
document.addEventListener('visibilitychange', () => { if(!document.hidden){ unread = 0; document.title = baseTitle; if(navigator.clearAppBadge) navigator.clearAppBadge().catch(() => {}) } });
if(sessionStorage.getItem('kk-boot')) $('#boot').remove();
else { sessionStorage.setItem('kk-boot', '1'); const hide = () => { const b = $('#boot'); if(b){ b.classList.add('done'); setTimeout(() => b.remove(), 900) } };
  addEventListener('load', () => setTimeout(hide, 1500)); setTimeout(hide, 4500) }
if('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

/* ---- mascota: terminal con carita animada ---- */
(() => {
  const face = $('#face'), log = $('#plog'), name = (CF.mascota || 'kanela').toLowerCase();
  $('#pname').textContent = name.toUpperCase() + ' // TALKING';
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches, sl = ms => new Promise(r => setTimeout(r, ms));
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(), pick = a => a[Math.floor(Math.random() * a.length)];
  let tok = 0;
  const line = (cls, txt) => { const d = document.createElement('div'); d.className = cls; d.textContent = txt; log.append(d); while(log.children.length > 40) log.firstChild.remove(); log.scrollTop = log.scrollHeight; return d };
  async function say(txt, mood = 'happy'){
    const my = ++tok; face.dataset.m = mood; const d = line('k', name.toUpperCase() + ' > '), t = document.createElement('span'); t.className = 't'; d.append(t);
    if(rm){ t.textContent = txt; return }
    face.classList.add('talk');
    for(const c of txt){ if(my !== tok) return; t.textContent += c; log.scrollTop = log.scrollHeight; await sl(22) }
    face.classList.remove('talk'); await sl(4500); if(my === tok) face.dataset.m = 'happy';
  }
  const GO = {notas: 'notas', fotos: 'fotos', informes: 'informes', comentarios: 'comentarios', guarderia: 'guarderia', privado: 'privado', inicio: 'inicio'};
  const R = {
    help: () => say('comandos: hola · quien · sueno · cafe · abrazo · chiste · notas · fotos · comentarios · guarderia · limpiar'),
    hola: () => say('holaaa, bienvenid@ al kinder (˶ᵔ ᵕ ᵔ˶)'),
    quien: () => say(`soy ${name}, la mascota de ${CF.nombre}. vivo dentro de este terminal`),
    sueno: () => say('zzz... yo también tengo sueñoooo', 'sleepy'),
    cafe: () => say('nivel de café: bajo. necesito un cafecito urgente', 'wow'),
    abrazo: () => say('(づ｡◕‿‿◕｡)づ abrazo enviado'),
    chiste: () => say(pick(['¿por qué los programadores confunden halloween con navidad? porque oct 31 = dec 25', 'me dijeron que usara arch... btw ya lo uso', 'un commit sin mensaje es un abrazo sin cariño'])),
    sudo: () => say('buen intento, pero aquí mando yo ✧', 'wow'),
    limpiar: () => { log.innerHTML = ''; tok++; face.classList.remove('talk') }
  };
  R.whoami = R.quien; R.clear = R.limpiar; R.sueño = R.sueno; R.hi = R.hola;
  $('#pform').onsubmit = e => { e.preventDefault(); const raw = $('#pcmd').value.trim(); if(!raw) return; $('#pcmd').value = ''; line('u', '> tú: ' + raw);
    const c = norm(raw);
    if(GO[c]){ say(`abriendo #${c}...`); setTimeout(() => go(GO[c]), 800) } else if(R[c]) R[c](); else say(`no entiendo '${raw.slice(0, 24)}'. escribe help`, 'wow') };
  face.onclick = () => say(pick(['hehe, me haces cosquillas', '(˶ᵔ ᵕ ᵔ˶)', 'más cafecito por favor']), 'wow');
  setTimeout(() => say('hola, soy ' + name + '. escribe help para ver comandos'), 900);
})();

paintMe(); renderFotos(); apply(); go(location.hash.slice(1) || 'inicio', false);
