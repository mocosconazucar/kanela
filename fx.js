/* Efectos de partículas: agua estilo Minecraft (gotas, burbujas, salpicaduras y ondas al hacer clic) */
(() => {
  const saved = localStorage.getItem('kk-fx');
  let on = saved !== null ? saved === '1' : !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.createElement('canvas');
  Object.assign(cv.style, {position:'fixed', inset:'0', width:'100%', height:'100%', pointerEvents:'none', zIndex:8});
  cv.setAttribute('aria-hidden', 'true');
  document.body.append(cv);
  const g = cv.getContext('2d');
  const COL = ['#3f76e4', '#5b8def', '#8fb8ff', '#d4e6ff'];
  let W, H, P = [];
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight };
  addEventListener('resize', size); size();
  const R = (a, b) => a + Math.random() * (b - a);
  const col = () => COL[Math.floor(Math.random() * COL.length)];
  const add = p => { if(P.length < 240) P.push(p) };
  const drop = (x, y, vx, vy, s, life, k = 's') => add({k, x, y, vx, vy, s, life, max: life, c: col()});

  function splash(x, y, n = 3){ for(let i = 0; i < n; i++) drop(x, y, R(-1.2, 1.2), R(-2.4, -.8), 3, R(18, 30)) }
  function burst(x, y){
    for(let i = 0; i < 18; i++){ const a = R(-Math.PI, 0), v = R(1.5, 4.2);
      drop(x, y, Math.cos(a) * v, Math.sin(a) * v, Math.random() < .5 ? 4 : 3, R(30, 55)) }
    add({k: 'r', x, y, r: 4, life: 28, max: 28});
  }

  addEventListener('pointerdown', e => { if(on) burst(e.clientX, e.clientY) });
  let lastMove = 0;
  addEventListener('pointermove', e => {
    if(!on || e.pointerType !== 'mouse' || e.timeStamp - lastMove < 60) return;
    lastMove = e.timeStamp; drop(e.clientX, e.clientY, R(-.3, .3), R(-1, 0), 3, 34);
  });

  let last = performance.now(), tDrip = 0, tBub = 0;
  function frame(now){
    requestAnimationFrame(frame);
    const dt = Math.min(now - last, 50) / 16.67; last = now;
    g.clearRect(0, 0, W, H);
    if(!on) return;
    tDrip -= dt; if(tDrip <= 0){ tDrip = R(10, 26); drop(R(0, W), -6, R(-.15, .15), R(.8, 1.6), Math.random() < .5 ? 4 : 3, 9999, 'd') }
    tBub -= dt; if(tBub <= 0){ tBub = R(50, 110); add({k: 'b', x: R(0, W), y: H + 9, ph: R(0, 6), life: R(160, 360)}) }
    for(let i = P.length - 1; i >= 0; i--){
      const p = P[i];
      if(p.k === 'b'){
        p.y -= .55 * dt; p.ph += .05 * dt; p.x += Math.sin(p.ph) * .35 * dt; p.life -= dt;
        if(p.life <= 0 || p.y < -10){ if(p.y > 0) splash(p.x, p.y, 2); P.splice(i, 1); continue }
        g.globalAlpha = .85; g.fillStyle = '#d4e6ff';
        const x = Math.round(p.x), y = Math.round(p.y);
        g.fillRect(x + 3, y, 3, 3); g.fillRect(x, y + 3, 3, 3); g.fillRect(x + 6, y + 3, 3, 3); g.fillRect(x + 3, y + 6, 3, 3);
        continue;
      }
      if(p.k === 'r'){
        p.r += 1.3 * dt; p.life -= dt;
        if(p.life <= 0){ P.splice(i, 1); continue }
        g.globalAlpha = p.life / p.max * .8; g.fillStyle = '#8fb8ff';
        for(let a = 0; a < 14; a++){ const t = a / 14 * Math.PI * 2; g.fillRect(Math.round(p.x + Math.cos(t) * p.r), Math.round(p.y + Math.sin(t) * p.r), 3, 3) }
        continue;
      }
      p.vy += .09 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if(p.life <= 0){ P.splice(i, 1); continue }
      if(p.k === 'd' && p.y > H){ splash(p.x, H - 2); P.splice(i, 1); continue }
      g.globalAlpha = p.k === 's' ? Math.min(1, p.life / p.max * 1.5) : .85;
      g.fillStyle = p.c; g.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
    }
    g.globalAlpha = 1;
  }
  requestAnimationFrame(frame);

  const btn = document.createElement('button');
  btn.className = 'link small'; btn.type = 'button';
  const label = () => btn.textContent = on ? '💧 efectos: sí' : '💧 efectos: no';
  btn.onclick = () => { on = !on; P = []; localStorage.setItem('kk-fx', on ? '1' : '0'); label() };
  label();
  (document.querySelector('footer') || document.body).append(btn);
})();
