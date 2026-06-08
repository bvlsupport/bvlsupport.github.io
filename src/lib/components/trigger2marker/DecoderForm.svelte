<script>
  import { createEventDispatcher } from 'svelte';
  import { DEFAULT_TYPES, DEFAULT_PRESET } from '../../decoder.js';

  const dispatch = createEventDispatcher();
  let bitTypes = [...DEFAULT_TYPES];
  let enabled = Array(8).fill(true);
  let eventType = 'All Event';
  let useFullType = false;

  function handlePresetChange(e) {
    eventType = e.target.value;
    if (eventType === 'Default') {
      bitTypes = [...DEFAULT_PRESET];
    } else {
      bitTypes = Array(8).fill('Event');
    }
  }

  function handleTypeChange(index, value) {
    bitTypes[index] = value;
    bitTypes = [...bitTypes];
    eventType = 'Custom';
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch('update', { enabled: [...enabled], types: [...bitTypes], useFullType });
  }

  function toggleEnabled(index) {
    enabled[index] = !enabled[index];
    enabled = [...enabled];
  }
</script>

<form on:submit={handleSubmit}>
  <div class="table-wrap">
    <table class="bit-table">
      <thead>
        <tr>
          <th>Bit</th>
          <th>Enabled</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {#each Array(8) as _, i}
          <tr>
            <td class="bit-label">{i}</td>
            <td class="chk-cell">
              <input type="checkbox" checked={enabled[i]} on:change={() => toggleEnabled(i)} />
            </td>
            <td>
              <input
                type="text"
                class="type-input"
                value={bitTypes[i]}
                on:input={(e) => handleTypeChange(i, e.target.value)}
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="opt-row">
    <label class="fulltype-label">
      <input type="checkbox" bind:checked={useFullType} />
      <span>Use full type name as marker label</span>
    </label>
  </div>

  <div class="action-row">
    <button type="submit" class="btn-primary">Update</button>
    <select value={eventType} on:change={handlePresetChange} class="preset-select">
      <option value="All Event">All Event</option>
      <option value="Default">Default</option>
    </select>
  </div>
</form>

<style>
  .table-wrap {
    overflow-x: auto;
    margin-bottom: 0.75rem;
  }
  .bit-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  .bit-table th, .bit-table td {
    border: 1px solid var(--border);
    padding: 8px 12px;
    text-align: left;
  }
  .bit-table th {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .bit-label {
    font-weight: 600;
    color: var(--text-primary);
  }
  .chk-cell {
    text-align: center;
  }
  .type-input {
    width: 100%;
    padding: 6px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.85rem;
    outline: none;
    transition: border-color 0.15s ease;
  }
  .type-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent-glow);
  }
  .opt-row {
    margin-bottom: 0.75rem;
  }
  .fulltype-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: var(--text-secondary);
    cursor: pointer;
    user-select: none;
  }
  .action-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .btn-primary {
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .btn-primary:hover {
    background: var(--accent-light);
  }
  .preset-select {
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.85rem;
    outline: none;
    cursor: pointer;
  }
  .preset-select:focus {
    border-color: var(--accent);
  }
</style>
