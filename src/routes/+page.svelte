<script>
  import features from '../lib/data/features.json';

  const sections = [
    { id: 'tools', label: 'Tools', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
    { id: 'tests', label: 'Tests', icon: 'M18 20V10M12 20V4M6 20v-6' },
    { id: 'texts', label: 'Texts', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
  ];

  let activeSection = 'tools';

  $: sectionItems = features.filter(f => f.section === activeSection);
</script>

<svelte:head>
  <title>BVL Support</title>
  <meta name="description" content="Brain Vision Support Portal — tools, tests, and resources for EEG researchers." />
</svelte:head>

<section class="hero">
  <div class="container">
    <h1 class="hero-title">BVL Support</h1>
    <p class="hero-desc">
      Tools, tests, and resources for EEG researchers and neuroscientists.
    </p>
  </div>
</section>

<section class="tabs-section">
  <div class="container">
    <nav class="tabs">
      {#each sections as sec}
        <button
          class="tab"
          class:active={activeSection === sec.id}
          on:click={() => activeSection = sec.id}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d={sec.icon}/>
          </svg>
          {sec.label}
        </button>
      {/each}
    </nav>
  </div>
</section>

<section class="cards-section">
  <div class="container">
    {#if sectionItems.length === 0}
      <div class="empty-state">
        <p>No items in this section yet.</p>
      </div>
    {:else}
      <div class="card-grid">
        {#each sectionItems as item (item.id)}
          <a
            href={item.url || '#'}
            target={item.url && item.url.startsWith('http') ? '_blank' : '_self'}
            rel={item.url && item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            class="card"
            class:disabled={item.status !== 'published'}
            tabindex={item.status === 'published' ? 0 : -1}
            on:click={(e) => { if (item.status !== 'published') e.preventDefault(); }}
          >
            <div class="card-header-row">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d={item.icon === 'activity' ? 'M22 12h-4l-3 9L9 3l-3 9H2' : item.icon === 'brain' ? 'M12 2C8 2 4 5 4 9c0 2.5 1.5 4.5 3 6l2 3h6l2-3c1.5-1.5 3-3.5 3-6 0-4-4-7-8-7z M12 2v20 M8 12h8' : item.icon === 'zap' ? 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' : item.icon === 'tool' ? 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' : item.icon === 'chart' ? 'M18 20V10M12 20V4M6 20v-6' : ''}/>
                </svg>
              </div>
              {#if item.status !== 'published'}
                <span class="badge-coming">Soon</span>
              {:else if item.url && item.url.startsWith('http')}
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="external-icon">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              {/if}
            </div>

            <h3 class="card-title">{item.name}</h3>
            <p class="card-desc">{item.description}</p>

            {#if item.tags?.length}
              <div class="card-tags">
                {#each item.tags.slice(0, 3) as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            {/if}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .hero {
    padding: 48px 0 32px;
    text-align: center;
  }

  .hero-title {
    font-size: 2.8rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 12px;
    color: var(--text-primary);
  }

  .hero-desc {
    font-size: 1.1rem;
    color: var(--text-secondary);
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.5;
  }

  .tabs-section {
    padding-bottom: 24px;
  }

  .tabs {
    display: flex;
    gap: 4px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .tab:hover {
    color: var(--text-primary);
    border-color: var(--accent);
    background: var(--bg-secondary);
  }

  .tab.active {
    color: #fff;
    background: var(--accent);
    border-color: var(--accent);
  }

  .cards-section {
    padding-bottom: 64px;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
    text-decoration: none;
    color: inherit;
    transition: all var(--transition);
  }

  .card:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 24px var(--accent-glow);
    transform: translateY(-2px);
    background: var(--bg-hover);
  }

  .card.disabled {
    opacity: 0.55;
    cursor: default;
    pointer-events: none;
  }

  .card-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(58, 123, 213, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    flex-shrink: 0;
  }

  .badge-coming {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 999px;
    color: #8a5b00;
    background: rgba(234, 179, 8, 0.12);
    border: 1px solid rgba(234, 179, 8, 0.2);
    white-space: nowrap;
  }

  .external-icon {
    color: var(--text-secondary);
    flex-shrink: 0;
  }

  .card-title {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .card-desc {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 2px;
  }

  .tag {
    font-size: 0.72rem;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 2px 8px;
    line-height: 1.3;
  }

  .empty-state {
    text-align: center;
    padding: 60px 0;
    color: var(--text-secondary);
  }

  @media (max-width: 640px) {
    .hero { padding: 32px 0 24px; }
    .hero-title { font-size: 2rem; }
    .card-grid { grid-template-columns: 1fr; }
    .tabs { gap: 8px; }
    .tab { padding: 8px 16px; font-size: 0.85rem; }
  }
</style>