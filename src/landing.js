export function mountLanding(app, onEnter) {
  document.body.classList.remove('platform-mode');
  document.body.classList.add('marketing-mode');

  app.innerHTML = `
    <main class="marketing-site">
      <header class="marketing-nav">
        <a class="marketing-brand" href="#" aria-label="GABA home">
          <img src="assets/gaba-logo.svg" alt="GABA Water Intelligence" />
        </a>
        <nav class="marketing-links" aria-label="Primary">
          <a href="#research">Research</a>
          <a href="#system">System</a>
          <a href="#impact">Impact</a>
        </nav>
        <button class="marketing-enter small" data-enter-platform>Enter platform</button>
      </header>

      <section class="marketing-hero">
        <div class="hero-copy">
          <div class="hero-kicker">GABA / WATER INTELLIGENCE / EARTH FORWARD</div>
          <h1>Water is living infrastructure.</h1>
          <p class="hero-lead">GABA turns flow, pressure, reservoir and asset signals into evidence-backed water intelligence—helping teams detect loss earlier, understand risk and move from signal to verified action.</p>
          <div class="hero-actions">
            <button class="marketing-enter" data-enter-platform>Enter Water Intelligence <span>↗</span></button>
            <a class="text-link" href="#research">Explore the research ↓</a>
          </div>          <div class="hero-meta">
            <span>01 / Monitor</span><span>02 / Detect</span><span>03 / Explain</span><span>04 / Act</span>
          </div>
        </div>
        <figure class="hero-landscape">
          <img src="assets/maletsunyane-falls.jpg" alt="Maletsunyane Falls in Lesotho" />
          <figcaption>
            <span>Maletsunyane Falls / Lesotho</span>
            <span>Water as place, system and future.</span>
          </figcaption>
        </figure>
      </section>

      <section class="manifesto" id="research">
        <div class="section-number">01 — Research premise</div>
        <div class="manifesto-grid">
          <h2>Nature does not separate data from consequence.</h2>
          <div>
            <p>GABA is designed around the same principle. Telemetry becomes useful only when it can be traced to evidence, interpreted in context, reviewed by a person and connected to an accountable response.</p>
            <p>Instead of another decorative sustainability dashboard, GABA focuses on operational intelligence for water systems: source, storage, flow, pressure, assets, anomalies, interventions and outcomes.</p>
          </div>
        </div>
      </section>

      <section class="system-story" id="system">
        <div class="section-number">02 — The system</div>
        <div class="editorial-title-row">
          <h2>From water signal<br />to verified action.</h2>
          <p>One continuous evidence chain, with human approval kept at the consequential decision boundary.</p>
        </div>        <div class="capability-grid">
          <article><span>01</span><h3>Observe</h3><p>Flow, pressure, reservoir, pump and sensor health telemetry.</p></article>
          <article><span>02</span><h3>Detect</h3><p>Deterministic anomaly logic surfaces unusual water-system behaviour.</p></article>
          <article><span>03</span><h3>Explain</h3><p>Evidence-backed AI briefs make the signal understandable and reviewable.</p></article>
          <article><span>04</span><h3>Respond</h3><p>Approved recommendations become inspections, actions and audit records.</p></article>
        </div>

        <div class="flow-strip" aria-label="GABA architecture">
          <span>Sensors</span><b>→</b><span>Digital twin</span><b>→</b><span>Anomaly detection</span><b>→</b><span>Risk intelligence</span><b>→</b><span>Human decision</span><b>→</b><span>Evidence</span>
        </div>
      </section>

      <section class="impact-story" id="impact">
        <div class="impact-visual">
          <div class="monogram-panel"><img src="assets/gaba-monogram.svg" alt="" /></div>
          <div class="impact-quote">“A cleaner future starts with seeing water loss before it becomes a crisis.”</div>
        </div>
        <div class="impact-copy">
          <div class="section-number">03 — Why GABA</div>
          <h2>Environmental intelligence that can be acted on.</h2>
          <div class="impact-list">
            <div><strong>Earlier visibility</strong><span>Surface abnormal operating conditions before they become obvious failures.</span></div>
            <div><strong>Explainable evidence</strong><span>Show the sources, timestamps and reasoning behind every high-risk brief.</span></div>
            <div><strong>Human control</strong><span>AI recommends; authorised people approve consequential actions.</span></div>
            <div><strong>Traceable outcomes</strong><span>Connect alerts to inspections, decisions, evidence and environmental reporting.</span></div>
          </div>
        </div>
      </section>      <section class="enter-section">
        <div>
          <div class="section-number">04 — Working prototype</div>
          <h2>See the water network think.</h2>
        </div>
        <button class="marketing-enter inverse" data-enter-platform>Open the GABA command centre <span>↗</span></button>
      </section>

      <footer class="marketing-footer">
        <img src="assets/gaba-logo.svg" alt="GABA Water Intelligence" />
        <p>Inspired by nature. Driven by a cleaner future.</p>
        <p class="photo-credit">Landscape: Maletsunyane Falls, Lesotho — Tim Sandell / Wikimedia Commons, CC BY-SA.</p>
      </footer>
    </main>
  `;

  const enter = () => {
    document.body.classList.remove('marketing-mode');
    document.body.classList.add('platform-mode');
    history.replaceState(null, '', '#platform');
    onEnter();
  };

  app.querySelectorAll('[data-enter-platform]').forEach((button) => {
    button.addEventListener('click', enter);
  });
}
