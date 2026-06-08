<script>
  import features from '../lib/data/features.json';
  import Search from '../lib/components/Search.svelte';
  import FeatureCard from '../lib/components/FeatureCard.svelte';

  let searchQuery = '';
  const visibleFeatures = features;

  $: filteredFeatures = searchQuery.trim()
    ? visibleFeatures.filter(f =>
        f.name.toLowerCase().includes(searchQuery) ||
        f.description.toLowerCase().includes(searchQuery) ||
        f.tags.some(t => t.toLowerCase().includes(searchQuery))
      )
    : visibleFeatures;

  function handleSearch(e) { searchQuery = e.detail.toLowerCase(); }
  function handleNavigate(e) {
    window.location.href = '/' + e.detail.id + '/';
  }
</script>

<svelte:head>
  <title>BVL Support</title>
  <meta name="description" content="Brain Vision Support Portal — tools for EEG researchers." />
</svelte:head>

<div class="container">
  <section class="hero">
    <Search on:search={handleSearch} />
  </section>

  <section class="features-section">
    {#if filteredFeatures.length === 0}
      <p class="empty">No tools match your search.</p>
    {:else}
      <div class="feature-grid">
        {#each filteredFeatures as feature, i (feature.id)}
          <FeatureCard {feature} showGif={i === 0} on:navigate={handleNavigate} />
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .hero {
    display: flex; justify-content: center;
    padding: 48px 0 28px;
  }

  .features-section { padding: 0 0 48px; }
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
  }

  .empty {
    text-align: center; color: var(--text-secondary); padding: 60px 0;
  }

  @media (max-width: 768px) {
    .hero { padding: 24px 0 32px; }
    .feature-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
