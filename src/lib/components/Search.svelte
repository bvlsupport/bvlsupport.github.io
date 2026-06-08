<script>
  import { createEventDispatcher } from 'svelte';
  export let value = '';
  export let placeholder = 'Search tools and features...';
  const dispatch = createEventDispatcher();

  function handleInput(e) {
    value = e.target.value;
    dispatch('search', value);
  }

  function handleClear() {
    value = '';
    dispatch('search', '');
  }
</script>

<div class="search-wrapper">
  <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21 L16.65 16.65"/>
  </svg>
  <input
    type="search"
    class="search-input"
    {placeholder}
    {value}
    on:input={handleInput}
    aria-label="Search features"
  />
  {#if value}
    <button class="clear-btn" on:click={handleClear} aria-label="Clear search">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6 L6 18 M6 6 L18 18"/>
      </svg>
    </button>
  {/if}
</div>

<style>
  .search-wrapper {
    position: relative;
    width: 100%;
    max-width: 600px;
  }
  .search-icon {
    position: absolute; left: 16px; top: 50%;
    transform: translateY(-50%);
    width: 20px; height: 20px;
    color: var(--text-secondary);
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    padding: 14px 44px 14px 46px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 1rem;
    transition: all var(--transition);
    -webkit-appearance: none;
  }
  .search-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }
  .search-input::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
  }
  .clear-btn {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    color: var(--text-secondary);
    padding: 6px; border-radius: 4px;
    display: flex; align-items: center;
    transition: color var(--transition);
  }
  .clear-btn:hover { color: var(--text-primary); }

  @media (max-width: 640px) {
    .search-input {
      padding: 12px 40px 12px 42px;
      font-size: 0.9rem;
    }
    .search-icon { left: 12px; width: 18px; height: 18px; }
  }
</style>
