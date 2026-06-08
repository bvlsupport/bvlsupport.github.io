<script>
  import { computeBitGroups, computeMarkerValues, validateMarkers, countValidOneToOne } from '$lib/decoder.js';
  import DecoderForm from '$lib/components/trigger2marker/DecoderForm.svelte';
  import BitMaskTable from '$lib/components/trigger2marker/BitMaskTable.svelte';
  import TriggerGrid from '$lib/components/trigger2marker/TriggerGrid.svelte';
  import MarkerGrid from '$lib/components/trigger2marker/MarkerGrid.svelte';
  import DetailPanel from '$lib/components/trigger2marker/DetailPanel.svelte';

  let groups = {};
  let showComputed = false;
  let markerValues = {};
  let validated = {};
  let hoveredTrigger = null;
  let detailTrigger = null;
  let showCopyright = false;
  let useFullType = false;

  function handleUpdate(e) {
    const { enabled, types, useFullType: uf } = e.detail;
    useFullType = uf;
    groups = computeBitGroups(enabled, types);
    markerValues = computeMarkerValues(groups);
    validated = validateMarkers(markerValues);
    showComputed = true;
    hoveredTrigger = null;
    detailTrigger = null;
  }

  function handleHover(e) { hoveredTrigger = e.detail; }
  function handleLeave() { hoveredTrigger = null; }
  function handleSelect(e) { detailTrigger = e.detail; }
  function toggleCopyright() { showCopyright = !showCopyright; }

  $: oneToOneCount = countValidOneToOne(validated);
  $: duplicateCount = Object.values(validated).filter((v) => v.duplicate === 1).length;
</script>

<svelte:head>
  <title>TRIGGER2MARKER — BVL Support</title>
  <meta name="description" content="Interactive tool to decode 8-bit trigger codes to markers for actiCHamp amplifiers." />
</svelte:head>

<div class="page">
  <div class="page-header">
    <h1 class="page-title">TRIGGER2MARKER</h1>
    <p class="page-desc">
      Interactive tool to display the mapping between 8-bit trigger codes and markers
      for different Digital Port Settings (actiCHamp amplifier family).
    </p>
  </div>

  <div class="info-box">
    <p>
      TRIGGER2MARKER simulates the decoding behavior of the Digital Port Settings to identify
      the set of trigger codes/markers that have a one-to-one mapping. To learn more, see our Support Tip
      <a href="https://pressrelease.brainproducts.com/trigger-code-design/" target="_blank" rel="noopener">"How to design trigger codes to obtain accurate markers"</a>
      and related resources at
      <a href="https://www.brainproducts.com/support-resources/" target="_blank" rel="noopener">Brain Products Support Resources</a>.
    </p>
  </div>

  <div class="decoder-layout">
    <div class="decoder-sidebar">
      <h5 class="section-label">Digital Port Settings</h5>
      <DecoderForm on:update={handleUpdate} />
    </div>

    <div class="decoder-main">
      {#if showComputed}
        <BitMaskTable groups={groups} />
      {/if}
    </div>
  </div>

  {#if showComputed}
    <div class="results-section">
      {#if detailTrigger !== null}
        <div class="detail-sticky">
          <DetailPanel
            triggerIndex={detailTrigger}
            markerValues={markerValues}
            validated={validated}
            oneToOneCount={oneToOneCount}
            duplicateCount={duplicateCount}
            useFullType={useFullType}
          />
        </div>
      {/if}

      <div class="grids-layout">
        <div class="grid-col">
          <h2 class="grid-heading">Trigger Values</h2>
          <p class="grid-subtitle">Click a cell to select a trigger</p>
          <TriggerGrid
            validated={validated}
            activeTrigger={hoveredTrigger}
            on:hover={handleHover}
            on:leave={handleLeave}
            on:select={handleSelect}
          />
        </div>
        <div class="grid-col">
          <h2 class="grid-heading">Corresponding Markers</h2>
          <MarkerGrid
            markerValues={markerValues}
            validated={validated}
            activeTrigger={hoveredTrigger}
            useFullType={useFullType}
            on:hover={handleHover}
            on:leave={handleLeave}
            on:select={handleSelect}
          />
        </div>
      </div>

      <div class="footer-section">
        <button class="copyright-btn" on:click={toggleCopyright}>
          {showCopyright ? 'Hide' : 'Show'} Copyright Information
        </button>
        {#if showCopyright}
          <pre class="copyright-text">Copyright 2024 Brain Products GmbH

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.</pre>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .page-header {
    padding: 24px 0 16px;
  }

  .page-title {
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 8px;
    color: var(--text-primary);
  }

  .page-desc {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.5;
    max-width: 720px;
  }

  .info-box {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    margin-bottom: 24px;
    font-size: 0.85rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }
  .info-box a {
    color: var(--accent-light);
    text-decoration: underline;
  }

  .decoder-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
  }

  .section-label {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: var(--text-primary);
  }

  .results-section {
    margin-top: 8px;
  }

  .detail-sticky {
    position: sticky;
    top: 76px;
    z-index: 20;
    margin-bottom: 24px;
  }

  .grids-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .grid-heading {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 4px;
    color: var(--text-primary);
  }

  .grid-subtitle {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .footer-section {
    text-align: center;
    padding: 32px 0 16px;
  }

  .copyright-btn {
    padding: 8px 20px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .copyright-btn:hover {
    border-color: var(--accent);
    color: var(--text-primary);
  }

  .copyright-text {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 16px;
    margin-top: 12px;
    font-size: 0.72rem;
    color: var(--text-secondary);
    text-align: left;
    white-space: pre-wrap;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .decoder-layout {
      grid-template-columns: 1fr;
    }
    .grids-layout {
      grid-template-columns: 1fr;
    }
    .page-title {
      font-size: 1.4rem;
    }
  }
</style>
