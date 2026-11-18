<script>
  const TEST_TYPES = [
    { id: 'ach-plus', name: 'ACH Plus', cutoff: 5.5 },
    { id: 'la', name: 'LA', cutoff: 3.3 },
    { id: 'brainamp-family', name: 'BrainAmp Family', cutoff: 5.2 }
  ];
  const COLORS = ['#38bdf8', '#f59e0b', '#a78bfa', '#34d399', '#fb7185', '#facc15'];

  let testType = 'brainamp-family';
  let fileName = '';
  let records = [];
  let channels = [];
  let visibleChannels = {};
  let errorMessage = '';
  let fileInput;
  let rangeStart = 0;
  let rangeEnd = 100;

  $: selectedTest = TEST_TYPES.find((test) => test.id === testType) || TEST_TYPES[2];
  $: cutoff = selectedTest.cutoff;
  $: visibleRecords = records.length
    ? records.slice(Math.floor((records.length - 1) * rangeStart / 100), Math.max(Math.floor((records.length - 1) * rangeStart / 100) + 1, Math.ceil((records.length - 1) * rangeEnd / 100) + 1))
    : [];
  $: visibleNames = channels.filter((name) => visibleChannels[name]);
  $: graphValues = visibleRecords.flatMap((record) => visibleNames.map((name) => record.values[name]).filter((value) => Number.isFinite(value)));
  $: yMin = graphValues.length ? Math.min(cutoff, ...graphValues) : cutoff - 0.1;
  $: yMax = graphValues.length ? Math.max(cutoff, ...graphValues) : cutoff + 0.1;
  $: yPad = Math.max((yMax - yMin) * 0.12, 0.03);
  $: scaleMin = yMin - yPad;
  $: scaleMax = yMax + yPad;
  $: chartPoints = visibleRecords.map((record, index) => ({
    ...record,
    x: visibleRecords.length < 2 ? 50 : 64 + index * (720 / (visibleRecords.length - 1))
  }));
  $: yFor = (value) => 245 - ((value - scaleMin) / (scaleMax - scaleMin || 1)) * 205;
  $: cutoffY = yFor(cutoff);

  function parseLog(text) {
    const parsed = [];
    const foundChannels = new Set();
    const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber += 1) {
      const line = lines[lineNumber].trim();
      if (!line) continue;
      const fields = line.split(';').map((field) => field.trim());
      if (fields.length < 6) continue;

      const timestamp = new Date(fields[0].replace(' ', 'T'));
      if (Number.isNaN(timestamp.getTime())) continue;

      const rawValues = fields[5].split(',').map((value) => Number.parseFloat(value.trim()));
      const labels = (fields[6] || '').split(',').map((label) => label.trim()).filter(Boolean);
      if (!labels.length || !rawValues.some(Number.isFinite)) continue;

      const values = {};
      labels.forEach((label, index) => {
        const value = rawValues[index];
        if (!Number.isFinite(value)) return;
        values[label] = value;
        foundChannels.add(label);
      });
      if (Object.keys(values).length) {
        parsed.push({ timestamp, values, status: fields[1] || '', sourceLine: lineNumber + 1 });
      }
    }

    parsed.sort((a, b) => a.timestamp - b.timestamp);
    if (!parsed.length) throw new Error('No voltage readings were found. Check that this is a supported semicolon-delimited log file.');
    return { records: parsed, channels: [...foundChannels] };
  }

  async function handleFile(event) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    errorMessage = '';
    try {
      const result = parseLog(await file.text());
      records = result.records;
      channels = result.channels;
      visibleChannels = Object.fromEntries(channels.map((channel) => [channel, true]));
      fileName = file.name;
      rangeStart = 0;
      rangeEnd = 100;
    } catch (error) {
      records = [];
      channels = [];
      fileName = '';
      errorMessage = error.message || 'Unable to read this file.';
    }
  }

  function formatTimestamp(date) {
    return date.toLocaleString([], { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function elapsedLabel(date) {
    if (!records.length) return '00:00:00';
    const seconds = Math.max(0, Math.floor((date - records[0].timestamp) / 1000));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainder = seconds % 60;
    return [hours, minutes, remainder].map((value) => String(value).padStart(2, '0')).join(':');
  }

  function channelStats(channel) {
    const values = records.map((record) => record.values[channel]).filter(Number.isFinite);
    if (!values.length) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const average = values.reduce((sum, value) => sum + value, 0) / values.length;
    const reached = records.find((record) => Number.isFinite(record.values[channel]) && record.values[channel] <= cutoff);
    return { min, max, average, reached };
  }

  function downloadCsv() {
    if (!records.length) return;
    const headers = ['Timestamp', 'Elapsed Time', ...channels];
    const rows = records.map((record) => [
      record.timestamp.toISOString(), elapsedLabel(record.timestamp),
      ...channels.map((channel) => Number.isFinite(record.values[channel]) ? record.values[channel] : '')
    ]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.replace(/\.[^.]+$/, '') || 'battery-voltage'}-readings.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetFile() {
    records = [];
    channels = [];
    visibleChannels = {};
    fileName = '';
    errorMessage = '';
    if (fileInput) fileInput.value = '';
  }
</script>

<svelte:head>
  <title>Battery Voltage Plotter — BVL Support</title>
  <meta name="description" content="Plot battery voltage log files for ACH Plus, LA, and BrainAmp Family tests." />
</svelte:head>

<div class="container plotter-page">
  <a class="back-link" href="/">← Back to Support Tools</a>
  <header class="page-heading">
    <p class="eyebrow">BATTERY TESTING</p>
    <h1>Battery Voltage Plotter</h1>
    <p>Upload a log file to visualize voltage readings over time and compare each channel with its test cutoff.</p>
  </header>

  <section class="panel setup-panel">
    <div class="section-heading">
      <div><span class="step">01</span><h2>Select battery test</h2></div>
      <p>The selected test determines the reference cutoff voltage.</p>
    </div>
    <div class="test-options">
      {#each TEST_TYPES as test}
        <label class="test-option" class:selected={testType === test.id}>
          <input type="radio" name="testType" value={test.id} bind:group={testType} />
          <span class="test-name">{test.name}</span>
          <strong>{test.cutoff.toFixed(1)} V</strong>
          <span class="test-caption">Cutoff reference</span>
        </label>
      {/each}
    </div>
    <div class="cutoff-note">Reference line: <strong>{cutoff.toFixed(1)} V</strong>. Reaching this voltage is a normal part of the battery test, not a pass/fail result.</div>
  </section>

  <section class="panel upload-panel">
    <div class="section-heading">
      <div><span class="step">02</span><h2>Upload log file</h2></div>
      <p>Supported formats: .txt and .log</p>
    </div>
    <label class="drop-zone">
      <input bind:this={fileInput} type="file" accept=".txt,.log,text/plain" on:change={handleFile} />
      <span class="upload-icon">↑</span>
      <strong>Choose a log file</strong>
      <span>or drag a file here using your browser's file picker</span>
      <small>File is read locally in your browser; it is not uploaded to a server.</small>
    </label>
    {#if errorMessage}<p class="error-message" role="alert">{errorMessage}</p>{/if}
    {#if fileName}
      <div class="file-loaded"><span>Loaded: <strong>{fileName}</strong> · {records.length.toLocaleString()} readings</span><button class="text-button" on:click={resetFile}>Remove file</button></div>
    {/if}
  </section>

  {#if records.length}
    <section class="panel results-panel">
      <div class="section-heading results-heading">
        <div><span class="step">03</span><h2>Voltage graph</h2></div>
        <button class="secondary-button" on:click={downloadCsv}>↓ Download CSV</button>
      </div>
      <div class="chart-meta"><span>Voltage (V)</span><span>Cutoff reference: {cutoff.toFixed(1)} V</span></div>
      <div class="chart-wrap">
        <svg viewBox="0 0 800 290" role="img" aria-label="Voltage readings over time with cutoff reference line">
          {#each [0, 1, 2, 3, 4] as tick}
            {@const value = scaleMin + (scaleMax - scaleMin) * (4 - tick) / 4}
            <line x1="64" x2="784" y1={40 + tick * 51.25} y2={40 + tick * 51.25} class="grid-line" />
            <text x="54" y={44 + tick * 51.25} class="axis-label" text-anchor="end">{value.toFixed(2)}</text>
          {/each}
          <line x1="64" x2="784" y1={cutoffY} y2={cutoffY} class="cutoff-line" />
          <text x="780" y={Math.max(14, cutoffY - 7)} class="cutoff-label" text-anchor="end">Cutoff {cutoff.toFixed(1)} V</text>
          {#each visibleNames as channel, channelIndex}
            <polyline
              fill="none"
              stroke={COLORS[channels.indexOf(channel) % COLORS.length]}
              stroke-width="2.5"
              stroke-linejoin="round"
              stroke-linecap="round"
              points={chartPoints.filter((point) => Number.isFinite(point.values[channel])).map((point) => `${point.x},${yFor(point.values[channel])}`).join(' ')}
            />
          {/each}
          <line x1="64" x2="784" y1="245" y2="245" class="axis-line" />
          <text x="64" y="265" class="axis-label">{visibleRecords.length ? formatTimestamp(visibleRecords[0].timestamp) : ''}</text>
          <text x="424" y="265" class="axis-label" text-anchor="middle">Elapsed: {visibleRecords.length ? elapsedLabel(visibleRecords[0].timestamp) : '00:00:00'} – {visibleRecords.length ? elapsedLabel(visibleRecords[visibleRecords.length - 1].timestamp) : '00:00:00'}</text>
          <text x="784" y="282" class="axis-label" text-anchor="end">{visibleRecords.length ? formatTimestamp(visibleRecords[visibleRecords.length - 1].timestamp) : ''}</text>
        </svg>
      </div>
      <div class="channel-toggles"><strong>Channels</strong>
        {#each channels as channel, index}
          <label class="channel-toggle"><input type="checkbox" bind:checked={visibleChannels[channel]} /><span class="channel-dot" style={`--channel-color:${COLORS[index % COLORS.length]}`}></span>{channel}</label>
        {/each}
      </div>
      <div class="range-controls">
        <label>Start of displayed range <input type="range" min="0" max="95" step="1" bind:value={rangeStart} on:input={() => { if (Number(rangeEnd) <= Number(rangeStart)) rangeEnd = Math.min(100, Number(rangeStart) + 5); }} /></label>
        <label>End of displayed range <input type="range" min="5" max="100" step="1" bind:value={rangeEnd} on:input={() => { if (Number(rangeStart) >= Number(rangeEnd)) rangeStart = Math.max(0, Number(rangeEnd) - 5); }} /></label>
        <button class="text-button" on:click={() => { rangeStart = 0; rangeEnd = 100; }}>Reset zoom</button>
      </div>
    </section>

    <section class="panel stats-panel">
      <div class="section-heading"><div><span class="step">04</span><h2>Channel statistics</h2></div><p>Statistics use all readings in the file.</p></div>
      <div class="stats-grid">
        {#each channels as channel, index}
          {@const stats = channelStats(channel)}
          <article class="stat-card">
            <div class="stat-title"><span class="channel-dot" style={`--channel-color:${COLORS[index % COLORS.length]}`}></span><strong>{channel}</strong></div>
            {#if stats}
              <div class="stat-values"><div><small>Minimum</small><strong>{stats.min.toFixed(3)} V</strong></div><div><small>Maximum</small><strong>{stats.max.toFixed(3)} V</strong></div><div><small>Average</small><strong>{stats.average.toFixed(3)} V</strong></div></div>
              <div class="cutoff-time">{#if stats.reached}First reached cutoff: <strong>{formatTimestamp(stats.reached.timestamp)}</strong> · Elapsed <strong>{elapsedLabel(stats.reached.timestamp)}</strong>{:else}Cutoff not reached in this log{/if}</div>
            {/if}
          </article>
        {/each}
      </div>
    </section>
    <p class="data-note">No pass/fail determination is made. The cutoff is shown only as a reference. Readings after reaching the cutoff remain part of the graph and exported data.</p>
  {/if}
</div>

<style>
  .plotter-page{max-width:1050px;padding-bottom:64px}.back-link{display:inline-block;margin-bottom:22px;font-size:.9rem;color:var(--text-secondary)}.back-link:hover{color:var(--accent-light)}
  .page-heading{margin-bottom:28px}.eyebrow{font-size:.72rem;font-weight:800;letter-spacing:.13em;color:var(--accent-light);margin-bottom:7px}.page-heading h1{font-size:clamp(1.8rem,4vw,2.5rem);font-weight:800;letter-spacing:-.03em;color:var(--text-primary)}.page-heading>p:last-child{color:var(--text-secondary);max-width:690px;margin-top:8px}
  .panel{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;margin-bottom:18px;box-shadow:var(--shadow)}.section-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:18px}.section-heading>div{display:flex;align-items:center;gap:10px}.section-heading h2{font-size:1.12rem;font-weight:700}.section-heading p{font-size:.82rem;color:var(--text-secondary);text-align:right}.step{display:grid;place-items:center;width:27px;height:27px;border-radius:8px;background:rgba(58,123,213,.15);color:var(--accent-light);font-size:.75rem;font-weight:800}
  .test-options{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.test-option{position:relative;display:flex;flex-direction:column;gap:4px;padding:16px;border:1px solid var(--border);border-radius:10px;cursor:pointer;background:var(--bg-secondary)}.test-option.selected{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}.test-option input{position:absolute;right:14px;top:16px;accent-color:var(--accent)}.test-name{font-weight:650;padding-right:18px}.test-option strong{font-size:1.45rem;color:var(--accent-light)}.test-caption{font-size:.75rem;color:var(--text-secondary)}.cutoff-note{margin-top:14px;padding:11px 13px;background:var(--bg-secondary);border-radius:8px;color:var(--text-secondary);font-size:.85rem}.cutoff-note strong{color:var(--text-primary)}
  .drop-zone{min-height:170px;border:1.5px dashed var(--border);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;text-align:center;cursor:pointer;background:var(--bg-secondary);padding:20px}.drop-zone:hover{border-color:var(--accent)}.drop-zone input{position:absolute;width:1px;height:1px;opacity:0}.upload-icon{font-size:1.7rem;color:var(--accent-light);font-weight:700}.drop-zone strong{font-size:1rem}.drop-zone span:not(.upload-icon){font-size:.82rem;color:var(--text-secondary)}.drop-zone small{font-size:.72rem;color:var(--text-secondary);margin-top:7px}.error-message{color:var(--danger);margin-top:12px;font-size:.9rem}.file-loaded{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:13px;font-size:.84rem;color:var(--text-secondary)}.file-loaded strong{color:var(--text-primary)}
  .results-heading{align-items:center}.secondary-button{border:1px solid var(--border);background:var(--bg-secondary);color:var(--text-primary);border-radius:8px;padding:9px 13px;font-weight:650}.secondary-button:hover{border-color:var(--accent)}.chart-meta{display:flex;justify-content:space-between;color:var(--text-secondary);font-size:.78rem;margin-bottom:6px}.chart-wrap{width:100%;overflow-x:auto}.chart-wrap svg{display:block;width:100%;min-width:560px;height:auto;overflow:visible}.grid-line{stroke:var(--border);stroke-width:1}.axis-line{stroke:var(--text-secondary);stroke-width:1}.axis-label{fill:var(--text-secondary);font-size:10px}.cutoff-line{stroke:var(--warning);stroke-width:1.8;stroke-dasharray:7 5}.cutoff-label{fill:var(--warning);font-size:11px;font-weight:700}
  .channel-toggles{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:14px;padding-top:14px;border-top:1px solid var(--border);font-size:.85rem}.channel-toggle{display:flex;align-items:center;gap:6px;color:var(--text-secondary)}.channel-toggle input{accent-color:var(--accent)}.channel-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--channel-color);flex:none}.range-controls{display:grid;grid-template-columns:1fr 1fr auto;gap:16px;align-items:end;margin-top:20px}.range-controls label{display:grid;gap:5px;font-size:.78rem;color:var(--text-secondary)}.range-controls input{width:100%;accent-color:var(--accent)}.text-button{border:0;background:none;color:var(--accent-light);font:inherit;font-size:.82rem;cursor:pointer}.text-button:hover{text-decoration:underline}
  .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}.stat-card{padding:15px;border:1px solid var(--border);border-radius:9px;background:var(--bg-secondary)}.stat-title{display:flex;align-items:center;gap:8px;margin-bottom:13px}.stat-values{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.stat-values div{display:grid;gap:3px}.stat-values small{font-size:.7rem;color:var(--text-secondary)}.stat-values strong{font-size:.95rem}.cutoff-time{font-size:.76rem;color:var(--text-secondary);margin-top:13px;line-height:1.5}.cutoff-time strong{color:var(--text-primary)}.data-note{font-size:.8rem;color:var(--text-secondary);text-align:center;padding:4px 10px}
  @media(max-width:680px){.panel{padding:17px}.test-options{grid-template-columns:1fr}.test-option{padding:12px}.section-heading{flex-direction:column}.section-heading p{text-align:left}.range-controls{grid-template-columns:1fr}.file-loaded{align-items:flex-start;flex-direction:column}.stat-values strong{font-size:.86rem}}
</style>
