<script>
  export let groups = {};
  $: typeNames = Object.keys(groups);
  $: numBits = groups[typeNames[0]]?.value.length || 8;
</script>

<div class="mask-section">
  <h5 class="mask-title">Bit Mask Table</h5>
  <div class="table-wrap">
    <table class="mask-table">
      <thead>
        <tr>
          <th>Bit</th>
          {#each typeNames as type}
            <th>{type}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each Array(numBits) as _, bit}
          <tr>
            <td class="bit-col">{bit}</td>
            {#each typeNames as type}
              <td>{groups[type].value[bit] ?? ''}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .mask-section {
    margin-bottom: 1rem;
  }
  .mask-title {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
  .table-wrap {
    overflow-x: auto;
  }
  .mask-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }
  .mask-table th, .mask-table td {
    border: 1px solid var(--border);
    padding: 6px 10px;
    text-align: center;
  }
  .mask-table th {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .bit-col {
    font-weight: 600;
    color: var(--text-primary);
  }
</style>
