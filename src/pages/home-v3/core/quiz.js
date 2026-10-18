/* Quiz de contact : 4 questions en un clic, puis les coordonnées ; envoi au formulaire du site, sinon WhatsApp. */
const QZ_API = '/api/contact.php'

export default function initQuiz(ctx) {
  const { $id, later, onDispose, R } = ctx
  const qz = $id('qz')
  if (!qz) return
  const qT0 = Date.now();
  const qAC = new AbortController(), qOpt = { signal: qAC.signal };
  onDispose(() => qAC.abort());
  const qQs = [...qz.querySelectorAll('.qz-q')], qForm = $id('qzform'), qDone = $id('qzdone'), qBar = $id('qzbar'), qStep = $id('qzstep');
  const qBack = $id('qzback'), qErr = $id('qzerr'), qGo = $id('qzgo'), qWa = $id('qzwa'), qSum = $id('qzsum'), qDt = $id('qzdt'), qDp = $id('qzdp');
  const LABELS = ['Besoin', 'Secteur', 'Situation', 'Budget'], N = qQs.length - 1, ans = [];
  const MSG = { name: 'Indiquez votre prénom et votre nom (lettres uniquement).', phone: 'Indiquez un numéro WhatsApp valide.', email: 'Indiquez une adresse e-mail valide.' };
  let qCur = 0, qStarted = false;
  const show = i => {
    qCur = i;
    qQs.forEach((q, k) => { const on = k === i; q.classList.toggle('on', on); q.disabled = !on; });
    qBar.style.transform = `scaleX(${(i + 1) / (N + 1)})`;
    qStep.textContent = i < N ? `Question ${i + 1} sur ${N}` : 'Dernière étape';
    qBack.hidden = i === 0;
    if (qStarted) { const f = qQs[i].querySelector('.qz-o.sel') || qQs[i].querySelector('.qz-o, input:not(.qz-hp)'); if (f) f.focus({ preventScroll: true }); }
  };
  qz.querySelectorAll('.qz-o').forEach(b => b.addEventListener('click', () => {
    const q = b.closest('.qz-q'), i = qQs.indexOf(q);
    q.querySelectorAll('.qz-o').forEach(o => { const s = o === b; o.classList.toggle('sel', s); o.setAttribute('aria-pressed', String(s)); });
    ans[i] = b.dataset.v; qStarted = true;
    later(() => show(Math.min(i + 1, N)), R ? 0 : 280);
  }, qOpt));
  qBack.addEventListener('click', () => { qStarted = true; show(Math.max(0, qCur - 1)); }, qOpt);
  const summary = () => LABELS.map((l, i) => `${l} : ${ans[i] || 'non précisé'}`);
  const finish = (name, sent) => {
    const first = (name || '').split(' ')[0];
    qForm.hidden = true; qDone.hidden = false; qz.classList.add('fin'); qStep.textContent = sent ? 'Envoyé' : 'Presque fini'; qBack.hidden = true; qBar.style.transform = 'scaleX(1)';
    qDt.textContent = sent ? `C'est noté${first ? ', ' + first : ''} !` : `Plus qu'un clic${first ? ', ' + first : ''} !`;
    qDp.textContent = sent ? 'On revient vers vous sous 24 h avec votre plan. Pour aller plus vite, écrivez-nous sur WhatsApp.' : 'Envoyez vos réponses sur WhatsApp et on vous répond rapidement avec votre plan.';
    qSum.replaceChildren(...ans.filter(Boolean).map(a => { const li = document.createElement('li'); li.textContent = a; return li; }));
    qWa.href = 'https://wa.me/212786449572?text=' + encodeURIComponent(`Bonjour Supra v3, je suis ${name || 'intéressé(e)'}. ${summary().join(' · ')}.`);
  };
  qForm.addEventListener('submit', async e => {
    e.preventDefault(); qErr.textContent = '';
    const fd = new FormData(qForm), name = String(fd.get('name') || '').trim().replace(/\s+/g, ' '), phone = String(fd.get('phone') || '').trim(), email = String(fd.get('email') || '').trim();
    if (fd.get('website')) { finish(name, true); return; }
    const digits = phone.replace(/\D/g, '');
    const bad = !/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+){0,5}$/.test(name) ? 'name' : (digits.length < 8 || digits.length > 15 || !/^\+?[0-9()[\]\s.-]{8,24}$/.test(phone)) ? 'phone' : !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email) ? 'email' : '';
    if (bad) { qErr.textContent = MSG[bad]; const f = qForm.querySelector(`[name="${bad}"]`); if (f) f.focus(); return; }
    if (!QZ_API) { finish(name, false); return; }
    qGo.disabled = true;
    let sent = false;
    try {
      const r = await fetch(QZ_API, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name, email, phone, website: '', startedAt: qT0, date: 'Demande via le quiz du site', time: 'À rappeler sous 24 h', message: `Demande via le quiz du site. ${summary().join(' · ')}.` }) });
      const j = await r.json().catch(() => ({}));
      sent = r.ok && j.ok === true;
      if (!sent && j.errors && typeof j.errors === 'object') { const k = Object.keys(j.errors)[0]; qErr.textContent = j.errors[k]; qGo.disabled = false; return; }
    } catch { sent = false; }
    qGo.disabled = false;
    finish(name, sent);
  }, qOpt);
  show(0);
}
