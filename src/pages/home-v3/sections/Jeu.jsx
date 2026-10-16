/* Jeu du serpent : la marque (serpent orange) attrape les clients qui passent et grossit.
   Démo automatique, jouable au clavier, au doigt ou avec les flèches à l'écran (initHomeV3). */
export default function Jeu() {
  return (
    <section className="sec mist wrap" id="jeu">
      <div className="c">
        <div className="snk">
          <div className="snk-tx" data-r>
            <span className="nb"><b>Le jeu</b>Votre marque, version arcade</span>
            <h2 className="h2">Attrapez tous les clients <span className="it">qui passent devant vous</span>.</h2>
            <p className="lede">Chaque jour, des clients potentiels passent devant votre marque sur Instagram, TikTok, Google et WhatsApp. Avec des vidéos qui arrêtent le scroll, des publicités bien ciblées et un agent IA qui répond tout de suite, vous les attrapez un par un. Et votre marque grossit.</p>
            <ul className="checks snk-ck"><li>Des vidéos qui arrêtent le scroll.</li><li>Des publicités qui visent les bons profils.</li><li>Une réponse immédiate, jour et nuit.</li></ul>
            <div className="snk-ctas"><a className="vbtn b-ac" href="#contact"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>Réserver un appel</a></div>
          </div>
          <div className="snk-game" data-r="120">
            <div className="snk-box" id="snkbox" tabIndex="-1">
              <div className="snk-hud"><span className="snk-mode" id="snkmode">Démo automatique</span><span className="snk-sc"><b id="snkscore">0</b> <span id="snklab">client attrapé</span><i>·</i>Record <b id="snkbest">0</b></span></div>
              <canvas id="snk" role="img" aria-label="Jeu du serpent : le serpent orange représente votre marque. Il attrape des icônes de clients venant d'Instagram, TikTok, Google, WhatsApp, Facebook et Snapchat, et grandit à chaque client attrapé."></canvas>
              <div className="snk-over" id="snkover" hidden>
                <p className="snk-ot"><b id="snkovern">0</b> <span id="snkoverl">client attrapé</span></p>
                <p className="snk-os">Avec Supra v3, ils ne vous échappent plus.</p>
                <div className="snk-ob"><button type="button" className="vbtn b-dk snk-again" id="snkagain"><span className="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l10.5-6.5z" /></svg></span>Rejouer</button><a className="vbtn b-ac" href="#contact"><span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>Réserver un appel</a></div>
              </div>
            </div>
            <div className="snk-bar">
              <button type="button" className="vbtn b-dk snk-play" id="snkplay"><span className="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l10.5-6.5z" /></svg></span>Jouer</button>
              <span className="snk-hint">Flèches du clavier ou glissez sur le jeu</span>
              <div className="snk-pad" aria-label="Commandes du serpent"><button type="button" className="pd pd-u" data-d="u" aria-label="Haut"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg></button><button type="button" className="pd pd-d" data-d="d" aria-label="Bas"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg></button><button type="button" className="pd pd-l" data-d="l" aria-label="Gauche"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></button><button type="button" className="pd pd-r" data-d="r" aria-label="Droite"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
