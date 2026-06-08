<script>
  import { onMount } from 'svelte';

  let mobileOpen = false;
  let theme = 'dark';

  onMount(() => {
    theme = document.documentElement.getAttribute('data-theme') || 'dark';
  });

  function toggleMenu() { mobileOpen = !mobileOpen; }
  function closeMenu() { mobileOpen = false; }

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
</script>

<header class="header">
  <div class="container header-inner">
    <a href="/" class="logo" on:click={closeMenu}>
      <img src="/BV-Logo.png" alt="BVL Support" class="logo-icon" />
    </a>

    <nav class="nav-desktop">
      <a href="/" class="nav-link active">Home</a>
      <a href="/about" class="nav-link">About</a>
    </nav>

    <div class="header-actions">
      <button
        class="theme-icon-btn"
        type="button"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        on:click={toggleTheme}
      >
        {#if theme === 'dark'}
          <svg viewBox="0 0 24 24" class="theme-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" class="theme-icon" fill="currentColor" aria-hidden="true">
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9 9 0 1012 21a8.96 8.96 0 008.354-5.646z"></path>
          </svg>
        {/if}
      </button>

      <button class="menu-btn" on:click={toggleMenu} aria-label="Menu" aria-expanded={mobileOpen}>
        <span class="menu-bar" class:open={mobileOpen}></span>
        <span class="menu-bar" class:open={mobileOpen}></span>
        <span class="menu-bar" class:open={mobileOpen}></span>
      </button>
    </div>
  </div>
</header>

<!-- Mobile overlay -->
{#if mobileOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="mobile-overlay" on:click={closeMenu} role="dialog" aria-modal="true">
    <nav class="mobile-nav" on:click|stopPropagation>
      <a href="/" class="mobile-link" on:click={closeMenu}>Home</a>
      <a href="/about" class="mobile-link" on:click={closeMenu}>About</a>
    </nav>
  </div>
{/if}

<style>
  .header {
    position: sticky; top: 0; z-index: 100;
    background: var(--header-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .header-inner {
    display: flex; align-items: center;
    justify-content: space-between;
    height: 60px;
  }
  .logo {
    display: flex; align-items: center; gap: 10px;
    color: var(--text-primary); font-weight: 600; font-size: 1.2rem;
  }
  .logo-icon { width: 120px; height: 48px; flex-shrink: 0; object-fit: contain; }
  .nav-desktop { display: flex; gap: 8px; align-items: center; }
  .header-actions { display: flex; align-items: center; gap: 8px; }
  .nav-link {
    padding: 8px 16px; border-radius: var(--radius-sm);
    color: var(--text-secondary); font-weight: 500; font-size: 0.9rem;
    transition: all var(--transition);
  }
  .nav-link:hover, .nav-link.active {
    color: var(--text-primary); background: var(--bg-secondary);
  }

  .menu-btn {
    display: none; flex-direction: column; gap: 5px;
    padding: 8px; background: none; border: none;
  }

  .theme-icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg-secondary);
    color: var(--text-primary);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition);
  }
  .theme-icon-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent);
  }
  .theme-icon {
    width: 18px;
    height: 18px;
  }

  .menu-bar {
    display: block; width: 24px; height: 2px;
    background: var(--text-secondary); border-radius: 2px;
    transition: all 0.3s ease;
  }
  .menu-bar.open:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
  .menu-bar.open:nth-child(2) { opacity: 0; }
  .menu-bar.open:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

  .mobile-overlay {
    position: fixed; inset: 0; z-index: 99;
    background: rgba(0,0,0,0.5);
    display: flex; justify-content: center; padding-top: 80px;
  }
  .mobile-nav {
    background: var(--bg-secondary);
    border-radius: var(--radius);
    padding: 16px;
    width: 90%; max-width: 320px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .mobile-link {
    display: block; padding: 14px 16px;
    border-radius: var(--radius-sm);
    color: var(--text-primary); font-weight: 500;
    transition: background var(--transition);
  }
  .mobile-link:hover { background: var(--bg-hover); }
  @media (max-width: 640px) {
    .nav-desktop { display: none; }
    .menu-btn { display: flex; }
  }
</style>
