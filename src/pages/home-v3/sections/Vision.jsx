import { Link } from 'react-router-dom'
import { ICON, BRAND } from '../data/icons.js'

/* Conviction : de la vue au rendez-vous, en 4 étapes animées (comportement dans initHomeV3, bloc « vision »),
   puis les preuves concrètes de l'engagement (studio, avis Google, équipe). */
const TITLE = 'Une vidéo qui fait des vues ne suffit pas.'.split(' ')
const TITLE_IT = 'Elle doit mener quelque part.'.split(' ')
const TEAM = ['Y', 'F', 'M', 'A', 'S']

const Li = ({ k }) => (
  <svg className="li" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path pathLength="1" d={ICON[k]} /></svg>
)
const Bi = ({ k }) => <svg className="bi" viewBox="0 0 24 24" aria-hidden="true"><path d={BRAND[k].d} /></svg>

const STEPS = [
  { n: '01', t: 'La vidéo arrête le pouce', p: 'Tournée et montée par notre équipe, pensée pour Instagram, TikTok et Snapchat.' },
  { n: '02', t: 'Le site rassure', p: 'Il reçoit le trafic des vidéos et montre en un coup d’œil ce que vous proposez.' },
  { n: '03', t: 'L’agent IA répond', p: 'Sur WhatsApp et sur le site, à toute heure : il qualifie la demande à votre place.' },
  { n: '04', t: 'Le rendez-vous est pris', p: 'La demande arrive chez vous, prête à être traitée. Rien ne s’est perdu en route.' },
]

export default function Vision() {
  return (
    <section className="sec light wrap vj" id="vision">
      <div className="c">
        <div className="vj-top">
          <div className="vj-h" data-r>
            <span className="nb"><b>Notre conviction</b>De la vue au rendez-vous</span>
            <h2 className="h2">
              {TITLE.map((w, i) => <span className="wd" style={{ '--i': i }} key={`a${i}`}>{w} </span>)}
              <span className="it">{TITLE_IT.map((w, i) => <span className="wd" style={{ '--i': i + TITLE.length }} key={`b${i}`}>{w}{i < TITLE_IT.length - 1 ? ' ' : ''}</span>)}</span>
            </h2>
          </div>
          <p className="lede vj-lede" data-r={120}>On produit au même endroit le contenu, le site qui le reçoit et l’agent IA qui répond aux demandes. Rien ne se perd entre la vue et le rendez-vous.</p>
        </div>

        {/* Le parcours : une étape s'allume après l'autre */}
        <div className="vj-path" id="vjpath" data-r={60}>
          <div className="vj-track" aria-hidden="true"><i className="vj-fill" />{STEPS.map((s) => <b key={s.n}>{s.n}</b>)}</div>
          <ol className="vj-steps">
            <li className="vj-s">
              <div className="vj-v vj-reel" aria-hidden="true">
                <span className="ph a-vid-yasmine-ads" />
                <span className="vj-plat"><Bi k="instagram" /></span>
                <span className="vj-play"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" /></svg></span>
                <span className="vj-hearts"><i>♥</i><i>♥</i><i>♥</i></span>
              </div>
              <h3>{STEPS[0].t}</h3><p>{STEPS[0].p}</p>
            </li>
            <li className="vj-s">
              <div className="vj-v vj-site" aria-hidden="true">
                <span className="vj-chrome"><i /><i /><i /></span>
                <span className="vj-shot a-site-homevia" />
                <span className="vj-cta">Réserver une visite</span>
                <svg className="vj-cursor" viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6z" /></svg>
              </div>
              <h3>{STEPS[1].t}</h3><p>{STEPS[1].p}</p>
            </li>
            <li className="vj-s">
              <div className="vj-v vj-chat" aria-hidden="true">
                <span className="vj-who"><span className="vj-av a-logo" /><b>Agent IA</b><small>en ligne</small><Bi k="whatsapp" /></span>
                <span className="vj-b in">Bonjour, une visite samedi&nbsp;?</span>
                <span className="vj-typing"><i /><i /><i /></span>
                <span className="vj-b out">Oui&nbsp;! 10&nbsp;h ou 15&nbsp;h&nbsp;?</span>
                <span className="vj-tag"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>Demande qualifiée : visite, samedi</span>
              </div>
              <h3>{STEPS[2].t}</h3><p>{STEPS[2].p}</p>
            </li>
            <li className="vj-s">
              <div className="vj-v vj-cal" aria-hidden="true">
                <span className="vj-day"><b>Samedi</b><small>Rendez-vous</small></span>
                <span className="vj-slot pick"><b>10:00</b><em>Réservé</em><i className="vj-ok"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg></i></span>
                <span className="vj-slot"><b>15:00</b><em>Libre</em></span>
                <span className="vj-toast">Nouveau rendez-vous</span>
              </div>
              <h3>{STEPS[3].t}</h3><p>{STEPS[3].p}</p>
            </li>
          </ol>
        </div>

        {/* L'engagement, en preuves vérifiables */}
        <div className="vj-proof" data-r>
          <h3>Vous savez qui travaille sur votre marque, <span className="it">et où.</span></h3>
          <ul>
            <li><span className="vj-ib"><Li k="pin" /></span><span><b>Un vrai studio</b>Business Center Paul, Marrakech</span></li>
            <li><span className="vj-ib g"><Bi k="google" /></span><span><b>5,0 sur Google</b>Des avis publics et vérifiables</span></li>
            <li><span className="vj-faces">{TEAM.map((l) => <i key={l}>{l}</i>)}</span><span><b>Une équipe interne</b>Youli, Fali, Mymy, Abdel et Saif Eddine</span></li>
          </ul>
          <Link className="tlink" to="/agence">Rencontrer l’équipe<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></Link>
        </div>
      </div>
    </section>
  )
}
