<svelte:head>
  <title>About — BVL Support</title>
</svelte:head>

<div class="container">
  <section class="about">
    <h1 class="about-title">About</h1>
    <p class="about-text">
      The Brain Vision Support Portal provides interactive tools, documentation, and
      resources for EEG researchers using Brain Products hardware and software.
    </p>
    <p class="about-text">
      Designed and developed by Biraj Shrestha.
    </p>
    <p class="about-text">
      For support inquiries: <a href="mailto:support@brainvision.com">support@brainvision.com</a>
    </p>

    <div class="about-links">
      <h2>Related Resources</h2>
      <ul>
        <li><a href="https://www.brainproducts.com/support-resources/" target="_blank" rel="noopener">Brain Products Support Resources</a></li>
        <li><a href="https://pressrelease.brainproducts.com/trigger-code-design/" target="_blank" rel="noopener">How to design trigger codes</a></li>
      </ul>
    </div>
  </section>
</div>

<style>
  .about {
    max-width: 680px; margin: 0 auto;
    padding: 32px 0;
  }
  .about-title {
    font-size: 2rem; font-weight: 800;
    margin-bottom: 24px;
  }
  .about-text {
    color: var(--text-secondary);
    font-size: 1rem; line-height: 1.7;
    margin-bottom: 16px;
  }
  .about-links {
    margin-top: 40px; padding-top: 24px;
    border-top: 1px solid var(--border);
  }
  .about-links h2 {
    font-size: 1.2rem; margin-bottom: 16px;
  }
  .about-links ul {
    list-style: none; display: flex; flex-direction: column; gap: 8px;
  }
  .about-links a { font-size: 0.95rem; }

  @media (max-width: 640px) {
    .about-title { font-size: 1.5rem; }
  }
</style>
