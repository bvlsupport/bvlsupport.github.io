<svelte:head>
  <title>About — BVL Support</title>
  <meta name="description" content="About BVL Support — tools for EEG researchers and neuroscientists." />
</svelte:head>

<div class="container">
  <section class="about">
    <h1 class="about-title">About</h1>

    <p class="about-text">
      BVL Support is a collection of interactive tools built for neuroscientists and EEG researchers.
      Whether you're working with Brain Products hardware or just need reliable utilities for
      your lab, this is a growing hub of practical resources.
    </p>

    <p class="about-text">
      Made by <strong>Biraj Shrestha</strong> — a Technical Support Engineer at Brain Vision
      who works with these systems every day. These tools come from real problems encountered
      in the field: trigger decoding, signal testing, calibration, and quality control.
    </p>

    <p class="about-text">
      Have a suggestion or found something useful? Reach out at
      <a href="mailto:support@brainvision.com">support@brainvision.com</a>.
    </p>

    <div class="about-links">
      <h2>Resources</h2>
      <ul>
        <li><a href="https://www.brainproducts.com/support-resources/" target="_blank" rel="noopener">Brain Products Support Resources</a></li>
        <li><a href="https://pressrelease.brainproducts.com/trigger-code-design/" target="_blank" rel="noopener">How to design trigger codes</a></li>
      </ul>
    </div>
  </section>
</div>

<style>
  .about {
    max-width: 680px;
    margin: 0 auto;
    padding: 32px 0;
  }
  .about-title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 24px;
    color: var(--text-primary);
  }
  .about-text {
    color: var(--text-secondary);
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 16px;
  }
  .about-text strong {
    color: var(--text-primary);
  }
  .about-links {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
  }
  .about-links h2 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: var(--text-primary);
  }
  .about-links ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .about-links a {
    font-size: 0.95rem;
  }

  @media (max-width: 640px) {
    .about-title { font-size: 1.5rem; }
  }
</style>
