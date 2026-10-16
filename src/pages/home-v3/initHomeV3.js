/*
 * Comportements de la page d'accueil v3 (carrousel vidéo, globe, comparateur, timeline, etc.).
 * Tout est rattaché à `root` et nettoyé au démontage (intervalles, rAF, observers, écouteurs window).
 */
import { ICON, BRAND as BR } from './data/icons.js'
import { LAND_DOTS } from './data/land.js'

export default function initHomeV3(root) {
  if (!root) return () => {}
  let alive = true
  const intervals = [], timeouts = [], rafs = new Set(), observers = [], winListeners = []
  const $id = (id) => root.querySelector('#' + id)
  const every = (fn, ms) => { const id = setInterval(fn, ms); intervals.push(id); return id }
  const later = (fn, ms) => { const id = setTimeout(fn, ms); timeouts.push(id); return id }
  const rAF = (fn) => { const id = requestAnimationFrame((t) => { rafs.delete(id); if (alive) fn(t) }); rafs.add(id); return id }
  const IO = (cb, opts) => { const o = new IntersectionObserver(cb, opts); observers.push(o); return o }
  const RO = (cb) => { const o = new ResizeObserver(cb); observers.push(o); return o }
  const onWin = (type, fn, opts) => { window.addEventListener(type, fn, opts); winListeners.push([type, fn, opts]) }

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

  /* hero : dégradé de couleurs animé, qui suit légèrement le pointeur */
  const mesh = $id('mesh')
  if (mesh && mesh.getContext) {
    const mx = mesh.getContext('2d', { alpha: false })
    const SC = 0.14
    const BL = [
      { c: '232,73,28', a: 0.95, r: 0.62, x: 0.16, y: 0.8, ax: 0.16, ay: 0.1, f: 0.00013, p: 0, m: 0.16 },
      { c: '255,150,58', a: 0.55, r: 0.46, x: 0.8, y: 0.84, ax: 0.14, ay: 0.09, f: 0.00017, p: 1.7, m: -0.12 },
      { c: '150,24,14', a: 0.9, r: 0.6, x: 0.64, y: 0.3, ax: 0.2, ay: 0.12, f: 0.00011, p: 3.1, m: 0.1 },
      { c: '255,86,104', a: 0.42, r: 0.42, x: 0.36, y: 0.52, ax: 0.22, ay: 0.14, f: 0.00015, p: 4.4, m: -0.18 },
      { c: '112,46,214', a: 0.34, r: 0.44, x: 0.94, y: 0.16, ax: 0.1, ay: 0.1, f: 0.00009, p: 2.2, m: 0.08 },
      { c: '255,200,150', a: 0.22, r: 0.28, x: 0.5, y: 0.98, ax: 0.26, ay: 0.05, f: 0.00021, p: 5.3, m: -0.1 },
    ]
    let MW = 0, MH = 0, px = 0, py = 0, tx = 0, ty = 0, mVis = true, mRaf = 0
    const msize = () => { const r = mesh.getBoundingClientRect(); MW = Math.max(2, Math.round(r.width * SC)); MH = Math.max(2, Math.round(r.height * SC)); mesh.width = MW; mesh.height = MH }
    const mdraw = (now) => {
      px += (tx - px) * 0.05; py += (ty - py) * 0.05
      mx.globalCompositeOperation = 'source-over'; mx.fillStyle = '#0B0706'; mx.fillRect(0, 0, MW, MH)
      mx.globalCompositeOperation = 'lighter'
      const D = Math.max(MW, MH)
      BL.forEach((b) => {
        const k = now * b.f + b.p
        const x = (b.x + Math.sin(k) * b.ax + px * b.m) * MW, y = (b.y + Math.cos(k * 1.3) * b.ay + py * b.m) * MH
        const rr = b.r * D * (1 + Math.sin(k * 0.7) * 0.12)
        const g = mx.createRadialGradient(x, y, 0, x, y, rr)
        g.addColorStop(0, `rgba(${b.c},${b.a})`); g.addColorStop(0.55, `rgba(${b.c},${(b.a * 0.35).toFixed(3)})`); g.addColorStop(1, `rgba(${b.c},0)`)
        mx.fillStyle = g; mx.fillRect(0, 0, MW, MH)
      })
      mx.globalCompositeOperation = 'source-over'
      mRaf = (mVis && !R) ? rAF(mdraw) : 0
    }
    msize(); mdraw(performance.now())
    onWin('resize', () => { msize(); if (!mRaf) mdraw(performance.now()) })
    const heroEl = $id('top')
    heroEl.addEventListener('pointermove', (e) => { const r = heroEl.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5 })
    if ('IntersectionObserver' in window) IO((es) => { mVis = es[0].isIntersecting; if (mVis && !mRaf && !R) mRaf = rAF(mdraw) }).observe(heroEl)
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
    root.querySelectorAll('video.rvid').forEach((v) => v.pause())
    $id('tiles')?.replaceChildren()
    $id('blk3')?.replaceChildren()
    root.querySelectorAll('#stg .num[data-to]').forEach((n) => { n.querySelector('.od').textContent = n.dataset.to })
    root.querySelector('#stg')?.classList.remove('in')
    root.classList.remove('anim')
  }
}
