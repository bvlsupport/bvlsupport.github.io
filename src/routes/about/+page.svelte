<svelte:head>
  <title>About — BVL Support</title>
</svelte:head>

<div class="container">
  <section class="about">
    <h1 class="about-title">About</h1>

    <p class="about-text">
      A growing collection of tools for EEG researchers and neuroscientists.
    </p>

    <p class="about-text">
      Made by <strong>Biraj Shrestha</strong> — support@brainvision.com
    </p>
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
  @media (max-width: 640px) {
    .about-title { font-size: 1.5rem; }
  }
</style>
