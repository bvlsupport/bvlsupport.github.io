<script>
  import { createEventDispatcher } from 'svelte';
  export let feature = {
    id: '', name: '', description: '', tags: [],
    status: 'coming-soon', repo: '', icon: 'activity'
  };
  export let showGif = false;
  const dispatch = createEventDispatcher();

  const icons = {
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    brain: 'M12 2C8 2 4 5 4 9c0 2.5 1.5 4.5 3 6l2 3h6l2-3c1.5-1.5 3-3.5 3-6 0-4-4-7-8-7z M12 2v20 M8 12h8',
    zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
    chart: 'M18 20V10 M12 20V4 M6 20v-6'
  };

  $: iconPath = icons[feature.icon] || icons.activity;
  $: isPublished = feature.status === 'published';
  $: previewSrc = feature.id === 'trigger2marker' ? '/trigger-wave.svg' : '/EEG_line.gif';
  $: bgStyle = isPublished
    ? 'background: linear-gradient(135deg, rgba(58,123,213,0.15), rgba(13,31,45,0.5))'
    : '';

  function handleClick() {
    if (isPublished) {
      dispatch('navigate', feature);
    }
  }
</script>

<button
  class="feature-card"
  class:published={isPublished}
  class:coming-soon={!isPublished}
  style={bgStyle}
  on:click={handleClick}
  disabled={!isPublished}
  aria-label="{feature.name} — {feature.description}"
>
  {#if showGif}
  <div class="card-preview">
    <img src={previewSrc} alt="" class="card-preview-img" aria-hidden="true" />
  </div>
  {/if}

  <div class="card-header">
    <div class="card-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d={iconPath}/>
      </svg>
    </div>
    <span class="status-badge" class:published={isPublished} class:coming={!isPublished}>
      {isPublished ? 'Live' : 'Coming Soon'}
    </span>
  </div>

  <h3 class="card-title">{feature.name}</h3>
  <p class="card-desc">{feature.description}</p>

  {#if feature.tags?.length}
    <div class="card-tags">
      {#each feature.tags.slice(0, 4) as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
  {/if}
</button>

<style>
  .card-preview {
    width: 100%; height: 80px;
    border-radius: calc(var(--radius) - 4px);
    overflow: hidden;
    margin-bottom: 4px;
  }
  .card-preview-img {
    width: 100%; height: 100%;
    object-fit: cover;
    opacity: 0.7;
  }

  .feature-card {
    display: flex; flex-direction: column; gap: 12px;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-card);
    text-align: left;
    transition: all var(--transition);
    width: 100%;
  }
  .feature-card.published:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 24px var(--accent-glow);
    transform: translateY(-2px);
    background: var(--bg-hover);
  }
  .feature-card.published:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .feature-card.coming-soon {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .card-header {
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px;
  }
  .card-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: rgba(58,123,213,0.15);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    flex-shrink: 0;
  }
  .card-icon svg { width: 22px; height: 22px; }

  .card-title {
    font-size: 1.05rem; font-weight: 600;
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

  .status-badge {
    font-size: 0.72rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid transparent;
    white-space: nowrap;
  }
  .status-badge.published {
    color: #14532d;
    background: rgba(34, 197, 94, 0.15);
    border-color: rgba(34, 197, 94, 0.25);
  }
  .status-badge.coming {
    color: #8a5b00;
    background: rgba(234, 179, 8, 0.15);
    border-color: rgba(234, 179, 8, 0.25);
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 2px;
  }
  .tag {
    font-size: 0.74rem;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 3px 9px;
    line-height: 1.2;
  }
</style>
