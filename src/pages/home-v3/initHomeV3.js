/*
 * Comportements de la page d'accueil v3 (carrousel vidéo, globe, comparateur, timeline, etc.).
 * Tout est rattaché à `root` et nettoyé au démontage (intervalles, rAF, observers, écouteurs window).
 */
import { ICON, BRAND as BR } from './data/icons.js'
import { LAND_DOTS } from './data/land.js'

export default function initHomeV3(root) {
  if (!root) return () => {}
  let alive = true
  const intervals = [], timeouts = [], rafs = new Set(), observers = [], winListeners = [], disposers = []
  const $id = (id) => root.querySelector('#' + id)
  const every = (fn, ms) => { const id = setInterval(fn, ms); intervals.push(id); return id }
  const later = (fn, ms) => { const id = setTimeout(fn, ms); timeouts.push(id); return id }
  const rAF = (fn) => { const id = requestAnimationFrame((t) => { rafs.delete(id); if (alive) fn(t) }); rafs.add(id); return id }
  const IO = (cb, opts) => { const o = new IntersectionObserver(cb, opts); observers.push(o); return o }
  const RO = (cb) => { const o = new ResizeObserver(cb); observers.push(o); return o }
  const onWin = (type, fn, opts) => { window.addEventListener(type, fn, opts); winListeners.push([type, fn, opts]) }
  const onDispose = (fn) => { disposers.push(fn) }

  const R = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const svg = (k, s = 1.7) => `<svg class="li" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path pathLength="1" d="${ICON[k]}"/></svg>`;
  const bsvg = k => `<svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="${BR[k].d}"/></svg>`;
  if (!R) root.classList.add('anim');


  /* menu + anchors */
  const mbtn = $id('mbtn'), mnav = $id('mnav');
  let open = false;
  const setMenu = o => { open = o; mnav.hidden = !o; mbtn.setAttribute('aria-expanded', String(o)); mbtn.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu'); };
  mbtn.addEventListener('click', () => setMenu(!open));
  root.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return; const t = root.querySelector(id); if (!t) return;
    e.preventDefault(); setMenu(false);
    t.scrollIntoView({ behavior: R ? 'auto' : 'smooth' });
  }));

  /* hero : voiles de lumière en vagues (rubans soyeux qui ondulent, se tordent et réagissent à la vitesse du pointeur).
     Calculés pixel par pixel par la carte graphique (WebGL) : nets à toutes les tailles d'écran, sans filtre CSS. */
  const veil = $id('mesh');
  const gl = veil && veil.getContext && (veil.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' }) || veil.getContext('experimental-webgl'));
  const veilProg = gl && (() => {
    /* y0/sl: position et pente, amp/k: houle, s: vitesse, w: demi-largeur, tw/ts: torsion, a: intensité */
    const RB = [
      { c: [176, 32, 12], a: .125, y0: .13, sl: .26, amp: .05, k: .55, s: .00016, p: 3.6, w: .165, tw: .38, ts: .00015 },
      { c: [232, 73, 28], a: .17, y0: .42, sl: -.56, amp: .05, k: .7, s: .00021, p: 0, w: .12, tw: .46, ts: .00023 },
      { c: [255, 112, 40], a: .115, y0: .63, sl: -.30, amp: .045, k: .8, s: .00026, p: 1.9, w: .07, tw: .62, ts: .00028 },
      { c: [255, 168, 112], a: .05, y0: .37, sl: -.64, amp: .045, k: .75, s: .00024, p: 2.4, w: .032, tw: .8, ts: .00034 },
      { c: [210, 52, 16], a: .08, y0: .88, sl: .18, amp: .04, k: .6, s: .00019, p: 4.7, w: .09, tw: .5, ts: .0002 },
    ];
    const N = RB.length, WR = 40 * Math.PI; /* phases ramenées sur une période commune : précision GPU conservée */
    const FS = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uR;uniform vec4 uP;uniform float uA,uT;
uniform vec4 uG[${N}],uH[${N}],uI[${N}];uniform vec3 uC[${N}];
const float TAU=6.2831853;
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){
  vec2 f=gl_FragCoord.xy/uR;float x=f.x,y=1.-f.y,bl=.011*uA;
  vec3 c=vec3(0.);
  for(int i=0;i<${N};i++){
    vec4 g=uG[i],h=uH[i],m=uI[i];
    float yc=g.x+g.y*uP.w*(x-.5)+g.z*uA*(sin(x*g.w*TAU+h.x)+.5*sin(x*g.w*2.3*TAU-h.x*1.35+h.y));
    float d=x-uP.x,k=exp(-d*d*14.);
    yc+=(uP.y-yc)*k*(.06+uP.z*.32);
    float hw0=h.z*uA,hw=hw0*cos(x*h.w*TAU+m.x)*(1.+k*uP.z*.5);
    float ah=abs(hw),dy=abs(y-yc),o=min(dy/max(ah,1e-4),1.);
    float edge=1.-smoothstep(ah-bl*.7,ah+bl*1.3,dy);
    float dens=(hw0+bl*.6)/(ah+bl*.6);
    float silk=1.+.08*sin((y-yc)/max(ah,1e-4)*17.)*smoothstep(.012,.05,ah);
    float hal=exp(-dy*dy/((ah+bl*5.)*(ah+bl*5.)));
    c+=uC[i]*m.y*(1.9*dens*(1.-.62*o*o)*edge*silk+.32*hal);
  }
  c=vec3(.039)+(1.-exp(-c*1.1))*.961;
  c+=(hash(gl_FragCoord.xy+fract(uT*.001)*91.)-.5)/255.;
  gl_FragColor=vec4(c,1.);
}`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const vs = sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return null;
    const pg = gl.createProgram(); gl.attachShader(pg, vs); gl.attachShader(pg, fs); gl.linkProgram(pg);
    if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) return null;
    gl.useProgram(pg);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pg, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = n => gl.getUniformLocation(pg, n);
    const uR = u('uR'), uP = u('uP'), uA = u('uA'), uT = u('uT'), uG = u('uG'), uH = u('uH'), uI = u('uI'), uC = u('uC');
    const G = new Float32Array(N * 4), H = new Float32Array(N * 4), I = new Float32Array(N * 4), C = new Float32Array(N * 3);
    RB.forEach((b, i) => { G.set([b.y0, b.sl, b.amp, b.k], i * 4); C.set(b.c.map(v => v / 255), i * 3); });
    gl.uniform4fv(uG, G); gl.uniform3fv(uC, C);
    return { pg, buf, draw(t, px, py, ef, asp, A) {
      RB.forEach((b, i) => { H.set([(t * b.s + b.p) % WR, b.p, b.w, b.tw], i * 4); I.set([(t * b.ts + b.p) % WR, b.a, 0, 0], i * 4); });
      gl.uniform2f(uR, veil.width, veil.height); gl.uniform4f(uP, px, py, ef, asp); gl.uniform1f(uA, A); gl.uniform1f(uT, t);
      gl.uniform4fv(uH, H); gl.uniform4fv(uI, I);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } };
  })();
  if (veil && !veilProg) veil.classList.add('flat');
  if (veilProg) {
    let VW = 1, VH = 1, vVis = true, vRaf = 0, vT = 0, vLast = performance.now(), vDead = false;
    let px = .5, py = .5, tx = .5, ty = .5, lx = -1, ly = -1, lt = 0, en = 0, ef = 0;
    const vsize = () => {
      const r = veil.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      let w = r.width * dpr, h = r.height * dpr; const k = Math.sqrt(Math.min(1, 2.6e6 / Math.max(1, w * h)));
      veil.width = Math.max(2, Math.round(w * k)); veil.height = Math.max(2, Math.round(h * k));
      gl.viewport(0, 0, veil.width, veil.height); VW = Math.max(1, r.width); VH = Math.max(1, r.height);
    };
    const vdraw = now => {
      if (vDead) { vRaf = 0; return; }
      const dt = Math.min(64, Math.max(0, now - vLast)); vLast = now;
      en *= .95; ef += (en - ef) * .07;
      vT += dt * 1.25 * (1 + ef * 2.4);
      px += (tx - px) * .05; py += (ty - py) * .05;
      /* sur écran vertical : pentes adoucies et rubans proportionnés à la largeur */
      veilProg.draw(vT, px, py, ef, Math.min(1, Math.sqrt(VW / VH / 1.05)), Math.min(VH, VW * 1.6) / VH);
      vRaf = (vVis && !R) ? rAF(vdraw) : 0;
    };
    vsize(); vdraw(performance.now());
    onWin('resize', () => { vsize(); if (!vRaf) vdraw(performance.now()); });
    veil.addEventListener('webglcontextlost', e => { e.preventDefault(); vDead = true; veil.classList.add('flat'); });
    const heroEl = $id('top');
    const vMove = e => {
      const r = heroEl.getBoundingClientRect(), now = performance.now();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height;
      if (lx >= 0 && now > lt) { const sp = Math.hypot(e.clientX - lx, e.clientY - ly) / r.width / (now - lt) * 16; en = Math.min(1.4, en + sp * 1.6); }
      lx = e.clientX; ly = e.clientY; lt = now;
    };
    const vLeave = () => { tx = .5; ty = .5; lx = -1; };
    heroEl.addEventListener('pointermove', vMove); heroEl.addEventListener('pointerleave', vLeave);
    onDispose(() => { heroEl.removeEventListener('pointermove', vMove); heroEl.removeEventListener('pointerleave', vLeave); gl.deleteProgram(veilProg.pg); gl.deleteBuffer(veilProg.buf); });
    if ('IntersectionObserver' in window) IO(es => { vVis = es[0].isIntersecting; if (vVis && !vRaf && !R) { vLast = performance.now(); vRaf = rAF(vdraw); } }).observe(heroEl);
  }

  /* hero swash + marker */
  later(() => { $id('sw1').classList.add('on'); $id('mk1').classList.add('on'); }, R ? 0 : 900);

  /* hero reels: 3D arc carousel, auto-scroll, drag, slows on hover */
  const reels = $id('reels'), rcs = [...reels.querySelectorAll('.reel')];
  let rOff = 0, rSpd = 0, rHover = false, rDrag = null, rLast = performance.now(), rW = 0, rStep = 0, rTot = 1, rRef = 1;
  const rLayout = () => { rW = reels.clientWidth; const cw = rcs[0].offsetWidth; rStep = cw * 1.14; rTot = rStep * rcs.length; rRef = Math.max(rW / 2, rStep * 1.5); };
  rLayout(); onWin('resize', rLayout);
  reels.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') rHover = true; });
  reels.addEventListener('pointerleave', () => { rHover = false; });
  reels.addEventListener('pointerdown', e => { rDrag = { x: e.clientX, o: rOff, t: performance.now(), v: 0, p: rOff }; try { reels.setPointerCapture(e.pointerId); } catch { /* pointer capture refusé : sans conséquence */ } reels.classList.add('grab'); });
  reels.addEventListener('pointermove', e => { if (!rDrag) return; const now = performance.now(), nx = rDrag.o - (e.clientX - rDrag.x); rDrag.v = (nx - rDrag.p) / Math.max(8, now - rDrag.t) * 1000; rDrag.p = nx; rDrag.t = now; rOff = nx; });
  const rEnd = () => { if (!rDrag) return; rSpd = clamp(rDrag.v, -1800, 1800); rDrag = null; reels.classList.remove('grab'); };
  reels.addEventListener('pointerup', rEnd); reels.addEventListener('pointercancel', rEnd);
  /* hero reels: the centred card plays its real video (desktop, data saver off) */
  const canPlay = !R && !(navigator.connection && navigator.connection.saveData) && matchMedia('(min-width: 768px)').matches;
  const vids = rcs.map(c => c.querySelector('video.rvid'));
  let rCur = null, heroSeen = true;
  const playReel = card => {
    vids.forEach(v => { if (v && v.parentElement !== card && !v.paused) v.pause(); });
    if (!canPlay || !heroSeen || !card) return;
    const v = card.querySelector('video.rvid'); if (!v) return;
    if (!v.getAttribute('src')) v.setAttribute('src', v.dataset.src);
    const p = v.play(); if (p && p.catch) p.catch(() => {});
  };
  vids.forEach(v => { if (v) v.addEventListener('playing', () => v.classList.add('ready')); });
  if ('IntersectionObserver' in window) IO(es => { heroSeen = es[0].isIntersecting; if (heroSeen) playReel(rCur); else vids.forEach(v => v && v.pause()); }, { threshold: .2 }).observe(reels);
  const rPlace = () => {
    let best = null, bd = 1e9;
    rcs.forEach((c, i) => {
      let x = ((i * rStep - rOff) % rTot + rTot) % rTot; if (x > rTot / 2) x -= rTot;
      const d = x / rRef, ad = Math.abs(d), m = Math.min(ad, 1.6);
      c.style.transform = `translate3d(${x.toFixed(1)}px,${(m * m * 20).toFixed(1)}px,${(-m * 230).toFixed(1)}px) rotateY(${(clamp(-d, -1.5, 1.5) * 24).toFixed(2)}deg) scale(${(1.04 - m * .09).toFixed(3)})`;
      c.style.zIndex = String(1000 - Math.round(ad * 100));
      c.style.opacity = clamp(1.8 - ad, 0, 1).toFixed(3);
      if (Math.abs(x) < bd) { bd = Math.abs(x); best = c; }
    });
    rcs.forEach(c => c.classList.toggle('on', c === best));
    if (best !== rCur) { rCur = best; playReel(best); }
  };
  const rFrame = now => {
    const dt = Math.min(.05, (now - rLast) / 1000); rLast = now;
    if (!rDrag) { const tgt = R ? 0 : (rHover ? 8 : 44); rSpd += (tgt - rSpd) * Math.min(1, dt * (Math.abs(rSpd) > 60 ? 1.6 : 2.4)); rOff += rSpd * dt; }
    if (reels.getBoundingClientRect().bottom > -50) rPlace();
    rAF(rFrame);
  };
  rPlace(); rAF(rFrame);

  /* présence: dotted globe (orthographic canvas, land dots from Natural Earth 50m) */
  (() => {
    const cv = $id('globe'); if (!cv || !cv.getContext) return; const RM = R;
    const ctx = cv.getContext('2d'), D = Math.PI / 180;
    const raw = atob(LAND_DOTS), n16 = raw.length >> 1, q = new Int16Array(n16);
    for (let i = 0; i < n16; i++) q[i] = raw.charCodeAt(2 * i) | (raw.charCodeAt(2 * i + 1) << 8);
    const xyz = (la, lo) => [Math.cos(la * D) * Math.sin(lo * D), Math.sin(la * D), Math.cos(la * D) * Math.cos(lo * D)];
    const C = [
      { la: 31.63, lo: -8.01, lab: 'Marrakech · Studio' }, { la: 33.57, lo: -7.59 }, { la: 34.02, lo: -6.84 },
      { la: 25.20, lo: 55.27, lab: 'Dubaï' }, { la: 48.86, lo: 2.35, lab: 'Paris' }, { la: 25.76, lo: -80.19, lab: 'Miami · à distance', rm: 1 }];
    const NAMES = ['Marrakech · Studio', 'Casablanca', 'Rabat', 'Dubaï', 'Paris', 'Miami · à distance'];
    C.forEach(c => c.v = xyz(c.la, c.lo));
    const N = n16 >> 1, P = new Float32Array(N * 3), near = new Uint8Array(N);
    for (let k = 0; k < N; k++) {
      const v = xyz(q[2 * k] / 100, q[2 * k + 1] / 100); P[3 * k] = v[0]; P[3 * k + 1] = v[1]; P[3 * k + 2] = v[2];
      let best = -1; C.forEach(c => { const d = v[0] * c.v[0] + v[1] * c.v[1] + v[2] * c.v[2]; if (d > best) best = d; });
      near[k] = best > Math.cos(2.6 * D) ? 2 : best > Math.cos(7 * D) ? 1 : 0;
    }
    const arc = (a, b) => { const d = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]), s = Math.sin(d), out = [];
      for (let i = 0; i <= 60; i++) { const t = i / 60, k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s, h = 1 + Math.sin(Math.PI * t) * d * .2;
        out.push([(a[0] * k1 + b[0] * k2) * h, (a[1] * k1 + b[1] * k2) * h, (a[2] * k1 + b[2] * k2) * h]); } return out; };
    const ARCS = [3, 4, 5].map(j => arc(C[0].v, C[j].v));
    const HOME = { a: -14 * D, b: 24 * D };
    let A = HOME.a, B = HOME.b, tA = A, tB = B, drag = null, focus = -1, lastUser = -1e9, W = 0, H = 0, dpr = 1, vis = true, raf = 0;
    const size = () => { const r = cv.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr)); cv.width = W; cv.height = H; };
    const proj = (v, ca, sa, cb, sb, R, cx, cy) => { const x1 = v[0] * ca - v[2] * sa, z1 = v[0] * sa + v[2] * ca, y2 = v[1] * cb - z1 * sb, z2 = v[1] * sb + z1 * cb; return [cx + x1 * R, cy - y2 * R, z2, x1, y2]; };
    const pill = (txt, x, y, on, side) => {
      const k = Math.max(.82, Math.min(1, W / dpr / 520)); ctx.font = `600 ${12 * k * dpr}px Poppins, system-ui, sans-serif`; const w = ctx.measureText(txt).width + 16 * k * dpr, h = 24 * k * dpr, m = 4 * dpr;
      let px = side < 0 ? x - w - 12 * dpr : x + 12 * dpr, py = y - h / 2;
      if (px < m) px = x + 12 * dpr; if (px + w > W - m) px = x - w - 12 * dpr; px = Math.max(m, Math.min(W - w - m, px));
      ctx.fillStyle = on ? '#E8491C' : 'rgba(255,255,255,.94)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(px, py, w, h, h / 2) : ctx.rect(px, py, w, h); ctx.fill();
      ctx.fillStyle = on ? '#150A05' : '#0b0b0b'; ctx.textBaseline = 'middle'; ctx.fillText(txt, px + 8 * k * dpr, y + .5 * dpr);
    };
    const draw = now => {
      if (!W) size();
      const idle = now - lastUser > 2600 && !drag;
      if (idle && focus < 0) { tA = HOME.a + (RM ? 0 : Math.sin(now * .00022) * 16 * D); tB = HOME.b; }
      if (!drag) { A += (tA - A) * .06; B += (tB - B) * .06; }
      const ca = Math.cos(A), sa = Math.sin(A), cb = Math.cos(B), sb = Math.sin(B);
      const R = Math.min(W, H) * .43, cx = W / 2, cy = H * .48;
      ctx.clearRect(0, 0, W, H);
      let g = ctx.createRadialGradient(cx, cy, R * .9, cx, cy, R * 1.22); g.addColorStop(0, 'rgba(232,73,28,.22)'); g.addColorStop(1, 'rgba(232,73,28,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.22, 0, 7); ctx.fill();
      g = ctx.createRadialGradient(cx - R * .35, cy - R * .4, R * .1, cx, cy, R); g.addColorStop(0, '#1f1d1b'); g.addColorStop(1, '#0d0c0c');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(255,170,130,.22)'; ctx.lineWidth = 1 * dpr; ctx.stroke();
      const s = 1.15 * dpr;
      for (let pass = 0; pass < 3; pass++) {
        ctx.fillStyle = pass === 0 ? '#F6F4F1' : pass === 1 ? '#F3B39C' : '#FF6B3D';
        for (let k = 0; k < N; k++) {
          if (near[k] !== pass) continue;
          const x = P[3 * k], y = P[3 * k + 1], z = P[3 * k + 2];
          const x1 = x * ca - z * sa, z1 = x * sa + z * ca, y2 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
          if (z2 <= 0) continue;
          ctx.globalAlpha = pass ? .55 + z2 * .45 : .12 + z2 * .5;
          const r = s * (.7 + z2 * .7) * (pass === 2 ? 1.35 : 1);
          ctx.fillRect(cx + x1 * R - r / 2, cy - y2 * R - r / 2, r, r);
        }
      }
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.6 * dpr; ctx.setLineDash([5 * dpr, 7 * dpr]); ctx.lineDashOffset = RM ? 0 : -now * .02 * dpr;
      ARCS.forEach((pts, ai) => {
        ctx.strokeStyle = 'rgba(255,122,77,.9)'; ctx.beginPath(); let pen = false;
        pts.forEach(v => { const p = proj(v, ca, sa, cb, sb, R, cx, cy); const ok = p[2] > 0 || p[3] * p[3] + p[4] * p[4] > 1;
          if (ok) { pen ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); pen = true; } else pen = false; });
        ctx.stroke();
        const ph = ((now * .00028 + ai * .33) % 1), v = pts[Math.floor(ph * (pts.length - 1))], p = proj(v, ca, sa, cb, sb, R, cx, cy);
        if (p[2] > 0 || p[3] * p[3] + p[4] * p[4] > 1) { ctx.setLineDash([]); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p[0], p[1], 2.4 * dpr, 0, 7); ctx.fill(); ctx.setLineDash([5 * dpr, 7 * dpr]); }
      });
      ctx.setLineDash([]);
      const pulse = (now % 2200) / 2200;
      C.forEach((c, i) => {
        const p = proj(c.v, ca, sa, cb, sb, R, cx, cy); if (p[2] <= .02) return;
        const on = focus === i;
        { ctx.strokeStyle = `rgba(232,73,28,${(1 - pulse) * .8})`; ctx.lineWidth = 1.5 * dpr; ctx.beginPath(); ctx.arc(p[0], p[1], (4 + pulse * 14) * dpr, 0, 7); ctx.stroke(); }
        ctx.fillStyle = c.rm ? '#0b0b0b' : '#E8491C'; ctx.beginPath(); ctx.arc(p[0], p[1], (on ? 5.5 : 4) * dpr, 0, 7); ctx.fill();
        if (c.rm) { ctx.strokeStyle = '#E8491C'; ctx.lineWidth = 2 * dpr; ctx.stroke(); }
        const lab = on ? NAMES[i] : c.lab;
        if (lab) pill(lab, p[0], p[1], on, i === 5 || i === 0 ? -1 : 1);
      });
      if (vis && !(RM && !drag)) raf = rAF(draw); else raf = 0;
    };
    const kick = () => { if (!raf) raf = rAF(draw); };
    if ('ResizeObserver' in window) RO(() => { size(); kick(); }).observe(cv); else onWin('resize', () => { size(); kick(); });
    if ('IntersectionObserver' in window) IO(es => { vis = es[0].isIntersecting; if (vis) kick(); }).observe(cv);
    cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, a: A, b: B }; try { cv.setPointerCapture(e.pointerId); } catch { /* pointer capture refusé : sans conséquence */ } cv.classList.add('grab'); focus = -1; setOn(-1); kick(); });
    cv.addEventListener('pointermove', e => { if (!drag) return; A = drag.a - (e.clientX - drag.x) * .006; B = Math.max(-60 * D, Math.min(65 * D, drag.b + (e.clientY - drag.y) * .006)); tA = A; tB = B; lastUser = performance.now(); kick(); });
    const end = () => { if (!drag) return; drag = null; cv.classList.remove('grab'); lastUser = performance.now(); kick(); };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
    const lis = [...root.querySelectorAll('#cl2 li')];
    const setOn = i => lis.forEach((l, j) => l.classList.toggle('on', j === i));
    const go = i => { focus = i; setOn(i); const c = C[i]; tA = c.lo * D; tB = Math.max(-10 * D, Math.min(45 * D, c.la * D)); lastUser = performance.now(); kick(); };
    const leave = () => { focus = -1; setOn(-1); lastUser = performance.now() - 1500; kick(); };
    lis.forEach(l => { const i = +l.dataset.c; l.addEventListener('mouseenter', () => go(i)); l.addEventListener('focus', () => go(i)); l.addEventListener('click', () => go(i)); l.addEventListener('mouseleave', leave); l.addEventListener('blur', leave); });
    size(); kick();
  })();

  /* présence: live local times */
  const tzEls = [...root.querySelectorAll('[data-tz]')];
  const fmts = {};
  const tickTz = () => tzEls.forEach(el => { const z = el.dataset.tz; try { fmts[z] = fmts[z] || new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: z }); el.textContent = fmts[z].format(new Date()); } catch { el.textContent = ''; } });
  tickTz(); every(tickTz, 20000);

  /* écosystème tiles */
  const tiles = $id('tiles'), blk3 = $id('blk3');
  const bg = [['Logo','spark'],['Charte','palette'],['Brand book','doc'],['Naming','spark'],['Typo','doc'],['Landing page','globe'],['E-commerce','bag'],['Réservation','cal'],['Shooting','camera'],['Reels','b:instagram'],['Motion','video'],['Montage','video'],['Meta Ads','b:meta'],['TikTok Ads','b:tiktok'],['Snapchat Ads','b:snapchat'],['Calendrier','b:googlecalendar'],['Community','chat'],['Search Console','b:googlesearchconsole'],['Google Business','b:googlemaps'],['Netlinking','link'],['Contenus SEO','doc'],['iOS','b:apple'],['Android','b:android'],['PWA','phone'],['Dashboard','chart'],['CRM','db'],['WhatsApp','b:whatsapp'],['Chatbot','bot'],['Workflows','flow'],['Analytics','b:googleanalytics'],['Rapports','doc'],['Formulaires','doc'],['Devis','doc'],['E-mailing','mail'],['Notifications','chat'],['Espace client','user'],['Paiement','coin'],['Hébergement','globe'],['Maintenance','shield'],['Vitesse','trend'],['Tracking','target'],['Pixel','target'],['Lookbook','camera'],['Google Ads','b:googleads'],['YouTube','b:youtube'],['Facebook','b:facebook'],['Instagram','b:instagram'],['Brief','doc'],['Stratégie','target'],['Positionnement','target']];
  const poles = [['Branding','spark'],['Site web','globe'],['Vidéo','video'],['Publicité','mega'],['hub',''],['Social media','chat'],['SEO','search'],['Applications','phone'],['Agents IA','bot']];
  const COLS = 11, ROWS = 5, cx = 6, cy = 3; let bi = 0; const tileEls = [];
  for (let r = 1; r <= ROWS; r++) for (let c = 1; c <= COLS; c++) {
    const t = document.createElement('div'); t.className = 'tl';
    const inCore = c >= 5 && c <= 7 && r >= 2 && r <= 4;
    if (!inCore) { const [lab, ic] = bg[bi++ % bg.length]; if (ic.startsWith('b:')) { const k = ic.slice(2); t.innerHTML = bsvg(k) + lab; t.style.setProperty('--bc', BR[k].c); t.dataset.b = k; } else t.innerHTML = svg(ic, 1.5) + lab; }
    const d = Math.hypot(c - cx, (r - cy) * 1.2);
    t.style.setProperty('--d', Math.round(d * 90) + 'ms');
    t.style.setProperty('--o', (0.62 - d * 0.07).toFixed(2));
    tiles.appendChild(t); if (!inCore) tileEls.push(t);
  }
  poles.forEach(([lab, ic], i) => {
    const p = document.createElement('div');
    p.style.setProperty('--d', (i === 4 ? 0 : 160 + i * 70) + 'ms');
    if (lab === 'hub') { p.className = 'pt hub'; p.innerHTML = '<span class="a-globe-dark" role="img" aria-label="Supra v3"></span>'; }
    else { p.className = 'pt'; p.style.setProperty('--bd', (-i * .45).toFixed(2) + 's'); p.innerHTML = `<span class="ib">${svg(ic)}</span>${lab}`; }
    blk3.appendChild(p);
  });
  const eco = $id('ecosysteme');
  let pingT = null;
  const startPing = () => { if (R || pingT) return; pingT = every(() => {
    const t = tileEls[Math.floor(Math.random() * tileEls.length)]; t.classList.add('ping'); later(() => t.classList.remove('ping'), 1400);
  }, 520); };
  if ('IntersectionObserver' in window) {
    IO(es => es.forEach(e => { if (e.isIntersecting) { eco.classList.add('lit'); startPing(); } }), { threshold: .2 }).observe($id('eco'));
  } else eco.classList.add('lit');
  if (R) eco.classList.add('lit');

  /* bénéfices spotlight */
  root.querySelectorAll('.bc').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* reveals, swashes, case cards */
  const io = 'IntersectionObserver' in window ? IO(es => es.forEach(e => {
    if (!e.isIntersecting) return; const t = e.target; t.classList.add('in');
    t.querySelectorAll('[data-sw]').forEach(s => s.classList.add('on')); if (t.matches('[data-sw]')) t.classList.add('on');
    io.unobserve(t);
  }), { rootMargin: '0px 0px -10% 0px' }) : null;
  root.querySelectorAll('[data-r]').forEach(el => {
    if (R || !io) { el.querySelectorAll('[data-sw]').forEach(s => s.classList.add('on')); return; }
    if (el.getBoundingClientRect().top > innerHeight * .9) { el.style.transitionDelay = (+el.dataset.r || 0) + 'ms'; el.classList.add('pre'); }
    io.observe(el);
  });
  root.querySelectorAll('.case .card').forEach(el => { if (R || !io) el.classList.add('in'); else io.observe(el); });

  /* icons: draw on sight, replay on hover; check lists pop */
  const drawIO = 'IntersectionObserver' in window && !R ? IO(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('dr'); drawIO.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' }) : null;
  const watchIcons = root => root.querySelectorAll('.li').forEach((s, i) => { s.style.setProperty('--ld', (i % 4) * 90 + 'ms'); if (drawIO) drawIO.observe(s); else s.classList.add('dr'); });
  watchIcons(document);
  root.querySelectorAll('.bc,.scd,.pt,.row,.stp').forEach(c => c.addEventListener('pointerenter', () => c.querySelectorAll('.li').forEach(s => { s.classList.remove('dr'); void s.getBoundingClientRect(); s.style.setProperty('--ld', '0ms'); s.classList.add('dr'); })));
  root.querySelectorAll('.checks').forEach(l => { [...l.children].forEach((li, i) => li.style.setProperty('--i', i)); if (drawIO) IO((es, o) => es.forEach(e => { if (e.isIntersecting) { l.classList.add('go'); o.disconnect(); } }), { threshold: .4 }).observe(l); else l.classList.add('go'); });

  /* before/after: wipe the "après" in when the card is on screen */
  root.querySelectorAll('.ba').forEach(el => { if (R || !('IntersectionObserver' in window)) { el.classList.add('go'); return; } IO((es, o) => es.forEach(e => { if (e.isIntersecting) { el.classList.add('go'); o.disconnect(); } }), { threshold: .5 }).observe(el); });

  /* branding: drag / hover to compare before and after */
  const cmp = $id('cmp');
  if (cmp) {
    const stage = cmp.querySelector('.stage'), hdl = cmp.querySelector('.hdl');
    let pos = 50, user = -1e9, dragging = false, seen = false;
    const set = v => { pos = clamp(v, 0, 100); cmp.style.setProperty('--p', pos.toFixed(2)); hdl.setAttribute('aria-valuenow', String(Math.round(pos))); };
    const fromX = x => { const r = stage.getBoundingClientRect(); set((x - r.left) / r.width * 100); };
    stage.addEventListener('pointerdown', e => { dragging = true; user = performance.now(); try { stage.setPointerCapture(e.pointerId); } catch { /* pointer capture refusé : sans conséquence */ } fromX(e.clientX); });
    stage.addEventListener('pointermove', e => { if (dragging || e.pointerType === 'mouse') { user = performance.now(); fromX(e.clientX); } });
    const stop = () => { dragging = false; };
    stage.addEventListener('pointerup', stop); stage.addEventListener('pointercancel', stop);
    hdl.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); user = performance.now(); set(pos + (e.key === 'ArrowLeft' ? -5 : 5)); } });
    if ('IntersectionObserver' in window) IO(es => { seen = es[0].isIntersecting; }, { threshold: .3 }).observe(cmp); else seen = true;
    let t0 = 0;
    const sweep = now => { if (!R && seen && now - user > 2600) { if (!t0) t0 = now; const tg = 50 + Math.sin((now - t0) * .0009 + Math.PI / 2) * 40; set(pos + (tg - pos) * Math.min(1, (now - t0) / 1500) * .12 + (now - t0 > 1500 ? (tg - pos) * .88 : 0)); } else t0 = 0; rAF(sweep); };
    if (!R) rAF(sweep);
  }

  /* comparatif: reveal + tabs (phones) */
  const vs = $id('vs');
  if (vs) {
    if (R || !('IntersectionObserver' in window)) vs.classList.add('in');
    else IO((es, o) => es.forEach(e => { if (e.isIntersecting) { vs.classList.add('in'); o.disconnect(); } }), { threshold: .15 }).observe(vs.querySelector('.vs-t'));
    vs.querySelectorAll('.vs-tabs button').forEach(b => b.addEventListener('click', () => {
      vs.dataset.v = b.dataset.v;
      vs.querySelectorAll('.vs-tabs button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    }));
  }

  /* chiffres : compteurs qui défilent, mini animations, relance au survol */
  const stg = $id('stg')
  if (stg) {
    stg.querySelectorAll('.num[data-to]').forEach((n) => {
      let ci = 0
      n.querySelector('.od').innerHTML = [...n.dataset.to].map((ch) => {
        if (!/[0-9]/.test(ch)) return `<span class="ch">${ch}</span>`
        const cells = Array.from({ length: 20 }, (_, k) => `<span>${k % 10}</span>`).join('')
        return `<span class="dg" style="--c:${ci++};--t:${10 + Number(ch)}"><span class="strip">${cells}</span></span>`
      }).join('')
    })
    const goS = () => stg.classList.add('in')
    if (R || !('IntersectionObserver' in window)) goS()
    else IO((es, o) => es.forEach((e) => { if (e.isIntersecting) { goS(); o.disconnect() } }), { threshold: 0.3 }).observe(stg)
    stg.querySelectorAll('.sc4').forEach((c) => {
      c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px') })
      c.addEventListener('pointerenter', () => { if (R || !stg.classList.contains('in')) return; c.classList.remove('rp'); void c.offsetWidth; c.classList.add('rp') })
    })
  }

  /* réalisations : déplie les sites floutés */
  const wmore = $id('wmore'), wbtn = $id('wbtn');
  if (wmore && wbtn) wbtn.addEventListener('click', () => {
    wmore.style.height = wmore.scrollHeight + 'px'; wmore.classList.add('open'); wbtn.setAttribute('aria-expanded', 'true');
    later(() => { wmore.style.height = 'auto'; }, R ? 0 : 950);
  });

  /* agent steps */
  const steps = [...root.querySelectorAll('#agent .st')]; let si = 0;
  const tick = () => { steps.forEach((s, i) => s.classList.toggle('on', i <= si)); si = (si + 1) % (steps.length + 2); };
  if (R) steps.forEach(s => s.classList.add('on')); else { tick(); every(tick, 900); }

  /* reviews */
  const qs = [...root.querySelectorAll('#qs .q')]; let qi = 0;
  const showQ = n => { qi = (n + qs.length) % qs.length; qs.forEach((q, i) => q.classList.toggle('on', i === qi)); };
  $id('qn').addEventListener('click', () => showQ(qi + 1));
  $id('qp').addEventListener('click', () => showQ(qi - 1));
  if (!R) every(() => showQ(qi + 1), 7000);

  /* scroll-linked: stacked rows, parallax, timeline, dock */
  const rows = [...root.querySelectorAll('.row')], pars = [...root.querySelectorAll('.par')];
  const tlw = $id('tlw'), tfill = $id('tfill'), stps = [...tlw.querySelectorAll('.stp')];
  const dock = $id('dock'), hero = $id('top'), fin = $id('contact');
  const frame = () => {
    const vh = innerHeight;
    if (!R && innerWidth > 900) rows.forEach((r, i) => {
      const nx = rows[i + 1]; if (!nx) { r.style.transform = ''; return; }
      const a = r.getBoundingClientRect(), b = nx.getBoundingClientRect();
      const p = clamp((a.bottom - b.top) / a.height);
      r.style.transform = `scale(${(1 - p * .06).toFixed(4)})`; r.style.filter = `brightness(${(1 - p * .12).toFixed(3)})`;
    });
    if (!R) pars.forEach(el => { const r = el.closest('.vis').getBoundingClientRect(); const k = +el.dataset.par || 0; el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * k).toFixed(1)}px`; });
    const tr = tlw.getBoundingClientRect(); const tp = R ? 1 : clamp((vh * .55 - tr.top) / tr.height);
    tfill.style.setProperty('--p', tp.toFixed(4));
    stps.forEach(s => { const n = s.querySelector('.node').getBoundingClientRect(); s.classList.toggle('on', R || n.top < vh * .55); });
    const hb = hero.getBoundingClientRect().bottom, ft = fin.getBoundingClientRect().top;
    dock.classList.toggle('show', hb < vh * .35 && ft > vh * .7);
    rAF(frame);
  };
  rAF(frame);

  return () => {
    alive = false
    intervals.forEach(clearInterval)
    timeouts.forEach(clearTimeout)
    rafs.forEach(cancelAnimationFrame)
    observers.forEach((o) => o.disconnect())
    winListeners.forEach(([type, fn, opts]) => window.removeEventListener(type, fn, opts))
    disposers.forEach((fn) => fn())
    root.querySelectorAll('video.rvid').forEach((v) => v.pause())
    $id('tiles')?.replaceChildren()
    $id('blk3')?.replaceChildren()
    root.querySelectorAll('#stg .num[data-to]').forEach((n) => { n.querySelector('.od').textContent = n.dataset.to })
    root.querySelector('#stg')?.classList.remove('in')
    root.classList.remove('anim')
  }
}
