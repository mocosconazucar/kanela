/* Fondo vivo: estrellas, luciérnagas y agua estilo Minecraft (detrás del vidrio) + salpicaduras al hacer clic (encima) */
(() => {
  const small = innerWidth < 700, saved = localStorage.getItem('kk-fx');
  let on = saved !== null ? saved === '1' : !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mk = z => { const c = document.createElement('canvas'); Object.assign(c.style, {position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: z}); c.setAttribute('aria-hidden', 'true'); document.body.append(c); return c };
  const back = mk(0), front = mk(30), gb = back.getContext('2d'), gf = front.getContext('2d');
  const COL = ['#3f76e4', '#5b8def', '#8fb8ff', '#d4e6ff', '#ff9ccb', '#ffffff'];
  const R = (a, b) => a + Math.random() * (b - a), col = () => COL[Math.floor(Math.random() * COL.length)];
  let W, H, stars = [], flies = [], cols = [], B = [], F = [];
  const RC = 'ｱｲｳｴｵｶｷｸ01{}<>/;=+*kanela♡';
  const spr = document.createElement('canvas'); spr.width = spr.height = 40;
  { const g = spr.getContext('2d'), r = g.createRadialGradient(20, 20, 0, 20, 20, 20); r.addColorStop(0, 'rgba(255,248,190,1)'); r.addColorStop(.35, 'rgba(255,205,235,.55)'); r.addColorStop(1, 'rgba(255,205,235,0)'); g.fillStyle = r; g.fillRect(0, 0, 40, 40) }
  const size = () => { W = back.width = front.width = innerWidth; H = back.height = front.height = innerHeight;
    stars = Array.from({length: small ? 45 : 95}, () => ({x: R(0, W), y: R(0, H), s: Math.random() < .25 ? 3 : 2, ph: R(0, 6.3), sp: R(.02, .05), p: Math.random() < .3}));
    flies = Array.from({length: small ? 7 : 14}, () => ({x: R(0, W), y: R(0, H), a: R(0, 6.3), ph: R(0, 6.3), r: R(.5, 1)}));
    cols = Array.from({length: Math.floor(W / 20)}, (_, i) => ({x: i * 20 + 4, y: R(-H, 0), v: R(.8, 2), on: Math.random() < (small ? .15 : .26), len: Math.floor(R(8, 20))})) };
  addEventListener('resize', size); size();
  const addB = p => { if(B.length < 120) B.push(p) }, addF = p => { if(F.length < 200) F.push(p) };
  const splash = (x, y, n = 3) => { for(let i = 0; i < n; i++) addB({k: 's', x, y, vx: R(-1.2, 1.2), vy: R(-2.4, -.8), s: 3, life: R(18, 30), max: 30, c: col()}) };
  const burst = (x, y) => { for(let i = 0; i < 18; i++){ const a = R(-Math.PI, 0), v = R(1.5, 4.2); addF({k: 's', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: Math.random() < .5 ? 4 : 3, life: R(30, 55), max: 55, c: col()}) }
    addF({k: 'r', x, y, r: 4, life: 28, max: 28}) };
  addEventListener('pointerdown', e => { if(on) burst(e.clientX, e.clientY) });
  let lm = 0; addEventListener('pointermove', e => { if(!on || e.pointerType !== 'mouse' || e.timeStamp - lm < 60) return; lm = e.timeStamp;
    addF({k: 's', x: e.clientX, y: e.clientY, vx: R(-.3, .3), vy: R(-1, 0), s: 3, life: 34, max: 34, c: col()}) });
  const px = (g, p) => { g.globalAlpha = Math.min(1, p.life / p.max * 1.5); g.fillStyle = p.c; g.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s) };
  let last = performance.now(), tD = 0, tB = 0;
  function frame(now){
    requestAnimationFrame(frame);
    const dt = Math.min(now - last, 50) / 16.67; last = now;
    gb.clearRect(0, 0, W, H); gf.clearRect(0, 0, W, H);
    if(!on) return;
    gb.font = '14px "JetBrains Mono",monospace'; gb.fillStyle = '#fff0f8';
    for(let i = 0; i < cols.length; i++){ const c = cols[i]; if(!c.on) continue; c.y += c.v * dt; if(c.y - c.len * 16 > H){ c.y = R(-200, 0); c.v = R(.8, 2) }
      for(let k = 0; k < c.len; k++){ const y = c.y - k * 16; if(y < -16 || y > H) continue; gb.globalAlpha = (1 - k / c.len) * .24; gb.fillText(RC[(Math.floor(y / 16) * 7 + i * 3) % RC.length], c.x, y) } }
    for(const s of stars){ s.ph += s.sp * dt; const a = .25 + .75 * (.5 + .5 * Math.sin(s.ph)), x = Math.round(s.x), y = Math.round(s.y), n = s.s;
      gb.globalAlpha = a; gb.fillStyle = s.p ? '#ffd0ea' : '#fff'; gb.fillRect(x - n, y, 2 * n + 1, 1); gb.fillRect(x, y - n, 1, 2 * n + 1); gb.fillRect(x, y, 2, 2) }
    for(const f of flies){ f.a += R(-.06, .06) * dt; f.x += Math.cos(f.a) * .35 * dt; f.y += Math.sin(f.a) * .35 * dt; f.ph += .03 * dt;
      if(f.x < -20) f.x = W + 20; if(f.x > W + 20) f.x = -20; if(f.y < -20) f.y = H + 20; if(f.y > H + 20) f.y = -20;
      gb.globalAlpha = .35 + .65 * (.5 + .5 * Math.sin(f.ph)); const z = 40 * f.r; gb.drawImage(spr, f.x - z / 2, f.y - z / 2, z, z) }
    tD -= dt; if(tD <= 0){ tD = R(14, 34); addB({k: 'd', x: R(0, W), y: -6, vx: R(-.15, .15), vy: R(.8, 1.6), s: Math.random() < .5 ? 4 : 3, life: 9999, max: 9999, c: col()}) }
    tB -= dt; if(tB <= 0){ tB = R(70, 150); addB({k: 'b', x: R(0, W), y: H + 9, ph: R(0, 6), life: R(160, 360)}) }
    for(let i = B.length - 1; i >= 0; i--){ const p = B[i];
      if(p.k === 'b'){ p.y -= .55 * dt; p.ph += .05 * dt; p.x += Math.sin(p.ph) * .35 * dt; p.life -= dt;
        if(p.life <= 0 || p.y < -10){ if(p.y > 0) splash(p.x, p.y, 2); B.splice(i, 1); continue }
        gb.globalAlpha = .7; gb.fillStyle = '#fff'; const x = Math.round(p.x), y = Math.round(p.y); gb.fillRect(x + 3, y, 3, 3); gb.fillRect(x, y + 3, 3, 3); gb.fillRect(x + 6, y + 3, 3, 3); gb.fillRect(x + 3, y + 6, 3, 3); continue }
      p.vy += .09 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if(p.life <= 0){ B.splice(i, 1); continue } if(p.k === 'd' && p.y > H){ splash(p.x, H - 2); B.splice(i, 1); continue }
      px(gb, p); gb.globalAlpha = 1 }
    for(let i = F.length - 1; i >= 0; i--){ const p = F[i]; p.life -= dt; if(p.life <= 0){ F.splice(i, 1); continue }
      if(p.k === 'r'){ p.r += 1.3 * dt; gf.globalAlpha = p.life / p.max * .8; gf.fillStyle = '#fff'; for(let a = 0; a < 14; a++){ const t = a / 14 * Math.PI * 2; gf.fillRect(Math.round(p.x + Math.cos(t) * p.r), Math.round(p.y + Math.sin(t) * p.r), 3, 3) } continue }
      p.vy += .09 * dt; p.x += p.vx * dt; p.y += p.vy * dt; px(gf, p) }
    gb.globalAlpha = gf.globalAlpha = 1;
  }
  requestAnimationFrame(frame);
  const btn = $('#btnFx');
  const label = () => { btn.classList.toggle('off', !on); btn.setAttribute('aria-pressed', on) };
  btn.onclick = () => { on = !on; B = []; F = []; localStorage.setItem('kk-fx', on ? '1' : '0'); label() };
  label();
})();
