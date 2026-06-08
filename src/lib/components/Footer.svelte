<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <p class="footer-title">BVL Support</p>
      <p class="footer-desc">Brain Vision Support Portal — tools and resources for EEG researchers.</p>
    </div>
    <div class="footer-links">
      <a href="https://www.brainproducts.com/support-resources/" target="_blank" rel="noopener">Support Resources</a>
      <a href="/about">About</a>
    </div>
    <p class="footer-copy">&copy; {new Date().getFullYear()} BVL Support. All rights reserved.</p>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--border);
    padding: 40px 0 24px;
    margin-top: 60px;
  }
  .footer-inner {
    display: flex; flex-direction: column; gap: 20px;
  }
  .footer-title {
    font-weight: 600; font-size: 1.1rem; margin-bottom: 4px;
  }
  .footer-desc {
    color: var(--text-secondary); font-size: 0.85rem; max-width: 400px;
  }
  .footer-links {
    display: flex; gap: 24px;
  }
  .footer-links a {
    color: var(--text-secondary); font-size: 0.85rem; transition: color var(--transition);
  }
  .footer-links a:hover { color: var(--accent); }
  .footer-copy {
    color: var(--text-secondary); font-size: 0.8rem;
    padding-top: 16px; border-top: 1px solid var(--border);
  }
</style>
