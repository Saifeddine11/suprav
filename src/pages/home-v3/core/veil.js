/*
 * Voiles de lumière en vagues (rubans soyeux qui ondulent, se tordent et réagissent à la vitesse du pointeur).
 * Calculés pixel par pixel par la carte graphique (WebGL) : nets à toutes les tailles d'écran, sans filtre CSS.
 * `veil` : le canvas ; `heroEl` : la zone qui reçoit le pointeur et dont la visibilité met l'animation en pause.
 */
export default function initVeil(ctx, veil, heroEl) {
  if (!veil || !heroEl) return
  const { rAF, IO, onWin, onDispose, R } = ctx
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
}
