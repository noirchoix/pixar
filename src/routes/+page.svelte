<script lang="ts">
  import type { ExportResponse, FlowResponse, ScriptResponse } from '$lib/types';
  import { RUNTIME_PRESETS } from '$lib/config/runtime';

  let topic = '';
  let runtimeSeconds = 60;
  let audience = 'general';
  let customNotes = '';
  let customRuleInput = 'Use active verbs rather than nouns and cut clutter between subject and main verb.';
  let flow: FlowResponse | null = null;
  let scriptResult: ScriptResponse | null = null;
  let exportResult: ExportResponse | null = null;
  let loadingFlow = false;
  let loadingScript = false;
  let loadingExport = false;
  let errorMessage = '';
  let voiceStyle = 'warm cinematic narration';
  let extraDirection = '';

  $: refinementNotes = Array.isArray(scriptResult?.refinementNotes)
    ? scriptResult.refinementNotes
    : typeof scriptResult?.refinementNotes === 'string'
      ? [scriptResult.refinementNotes]
      : [];

  const customRules = () =>
    customRuleInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

  async function generateFlow() {
    errorMessage = '';
    scriptResult = null;
    exportResult = null;
    loadingFlow = true;
    try {
      const res = await fetch('/api/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, runtimeSeconds, audience, customNotes, customRules: customRules() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to generate flow.');
      flow = data;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to generate flow.';
    } finally {
      loadingFlow = false;
    }
  }

  async function generateScript() {
    if (!flow) return;
    errorMessage = '';
    exportResult = null;
    loadingScript = true;
    try {
      const res = await fetch('/api/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flow, voiceStyle, extraDirection })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to generate script.');
      scriptResult = data;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to generate script.';
    } finally {
      loadingScript = false;
    }
  }

  async function exportTxt() {
    if (!scriptResult || !flow) return;
    loadingExport = true;
    errorMessage = '';
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: flow.topic, script: scriptResult.script })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to export script.');
      exportResult = data;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Failed to export script.';
    } finally {
      loadingExport = false;
    }
  }
</script>

<svelte:head>
  <title>Pixar Script Studio</title>
  <meta name="description" content="Structured Pixar-style script generation with flow confirmation, scoring, and text export." />
</svelte:head>

<div class="page">
  <section class="hero">
    <div>
      <p class="eyebrow">Structured Story Generation</p>
      <h1>Pixar Script Studio</h1>
      <p class="lede">Build short animated scripts through a disciplined pipeline: topic, contradiction, beat flow, confirmation, script, scoring, and text export.</p>
    </div>
    <div class="hero-card">
      <h2>System principles</h2>
      <ul>
        <li>Favor structure over unconstrained prompting</li>
        <li>Use bounded variability instead of randomness</li>
        <li>Drive story with discomfort and causal escalation</li>
        <li>Refine for active verbs and spoken clarity</li>
      </ul>
    </div>
  </section>

  <section class="panel form-panel">
    <h2>1. Generate flow</h2>
    <label>
      Topic
      <textarea bind:value={topic} rows="3" placeholder="Example: a tiny cloud afraid of raining on the town it loves"></textarea>
    </label>

    <div class="grid">
      <label>
        Video length
        <select bind:value={runtimeSeconds}>
          {#each RUNTIME_PRESETS as preset}
            <option value={preset.seconds}>{preset.label}</option>
          {/each}
          <option value={240}>4 minutes</option>
          <option value={300}>5 minutes</option>
        </select>
      </label>
      <label>
        Audience
        <input bind:value={audience} placeholder="general, kids, family, teen" />
      </label>
    </div>

    <label>
      Story notes
      <textarea bind:value={customNotes} rows="3" placeholder="Optional direction such as more visual, gentler ending, stronger humor"></textarea>
    </label>

    <label>
      Custom rules
      <textarea bind:value={customRuleInput} rows="5"></textarea>
    </label>

    <button class="primary" onclick={generateFlow} disabled={loadingFlow || !topic.trim()}>
      {loadingFlow ? 'Generating flow...' : 'Generate Flow'}
    </button>
  </section>

  {#if errorMessage}
    <section class="panel error">
      <strong>Issue:</strong> {errorMessage}
    </section>
  {/if}

  {#if flow}
    <section class="panel">
      <h2>2. Confirm flow</h2>
      <div class="stats">
        <div><span class="label">Category</span><strong>{flow.inferredCategory}</strong></div>
        <div><span class="label">Runtime</span><strong>{flow.runtimeSeconds}s</strong></div>
        <div><span class="label">Target words</span><strong>{flow.targetWordRange[0]} - {flow.targetWordRange[1]}</strong></div>
      </div>

      <div class="two-col">
        <div class="card">
          <h3>Core contradiction</h3>
          <dl>
            <dt>Protagonist</dt><dd>{flow.contradiction.protagonist}</dd>
            <dt>Desire</dt><dd>{flow.contradiction.desire}</dd>
            <dt>Flaw</dt><dd>{flow.contradiction.flaw}</dd>
            <dt>Comfort zone</dt><dd>{flow.contradiction.comfortZone}</dd>
            <dt>Opposite pressure</dt><dd>{flow.contradiction.oppositePressure}</dd>
            <dt>Emotional question</dt><dd>{flow.contradiction.emotionalQuestion}</dd>
            <dt>Theme hypothesis</dt><dd>{flow.themeHypothesis}</dd>
          </dl>
        </div>

        <div class="card">
          <h3>Applied rules</h3>
          <ul class="tight">
            {#each flow.appliedRules.slice(0, 8) as rule}
              <li>{rule}</li>
            {/each}
          </ul>
        </div>
      </div>

      <div class="card">
        <h3>Beat flow</h3>
        <div class="beats">
          {#each flow.beats as beat}
            <article class="beat">
              <div class="beat-head">
                <strong>{beat.title}</strong>
                <span>{beat.targetWords} words</span>
              </div>
              <p><strong>Purpose:</strong> {beat.purpose}</p>
              <p><strong>Visible action:</strong> {beat.visibleAction}</p>
              <p><strong>Emotional turn:</strong> {beat.emotionalTurn}</p>
            </article>
          {/each}
        </div>
      </div>

      <div class="card">
        <h3>Script generation controls</h3>
        <div class="grid">
          <label>
            Voice style
            <input bind:value={voiceStyle} />
          </label>
          <label>
            Extra direction
            <input bind:value={extraDirection} placeholder="make the ending gentler, add more wonder, reduce dialogue" />
          </label>
        </div>
        <button class="primary" onclick={generateScript} disabled={loadingScript}>
          {loadingScript ? 'Generating script...' : 'Generate Script'}
        </button>
      </div>
    </section>
  {/if}

  {#if scriptResult}
    <section class="panel">
      <h2>3. Final script</h2>
      <div class="stats">
        <div><span class="label">Score</span><strong>{scriptResult.score.overall}/100</strong></div>
        <div><span class="label">Word count</span><strong>{scriptResult.estimatedWordCount}</strong></div>
        <div><span class="label">Runtime</span><strong>{scriptResult.runtimeSeconds}s</strong></div>
      </div>

      <div class="score-grid">
        <div class="mini-card"><span>Emotional clarity</span><strong>{scriptResult.score.emotionalClarity}</strong></div>
        <div class="mini-card"><span>Causal coherence</span><strong>{scriptResult.score.causalCoherence}</strong></div>
        <div class="mini-card"><span>Visualizability</span><strong>{scriptResult.score.visualizability}</strong></div>
        <div class="mini-card"><span>Character agency</span><strong>{scriptResult.score.characterAgency}</strong></div>
        <div class="mini-card"><span>Dialogue</span><strong>{scriptResult.score.dialogueNaturalness}</strong></div>
        <div class="mini-card"><span>Rule compliance</span><strong>{scriptResult.score.ruleCompliance}</strong></div>
      </div>

      <div class="card">
        <h3>Refinement notes</h3>
        <ul class="tight">
          {#each refinementNotes as note}
            <li>{note}</li>
          {/each}
        </ul>
      </div>

      <div class="script-box">
        <pre>{scriptResult.script}</pre>
      </div>

      <button class="primary" onclick={exportTxt} disabled={loadingExport}>
        {loadingExport ? 'Exporting...' : 'Export as .txt'}
      </button>

      {#if exportResult}
        <p class="download">Export ready: <a href={exportResult.downloadUrl}>{exportResult.fileName}</a></p>
      {/if}
    </section>
  {/if}
</div>

<style>
  :global(body) { margin: 0; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #07111f; color: #e5eefb; }
  .page { max-width: 1180px; margin: 0 auto; padding: 32px 20px 80px; }
  .hero { display: grid; gap: 20px; grid-template-columns: 1.3fr 0.9fr; margin-bottom: 24px; }
  .eyebrow { color: #8ab4ff; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.76rem; margin-bottom: 8px; }
  h1 { font-size: clamp(2rem, 4vw, 4rem); line-height: 1.02; margin: 0 0 12px; }
  .lede { color: #b8c8e0; max-width: 68ch; }
  .hero-card, .panel, .card, .mini-card, .beat { background: rgba(15, 23, 42, 0.88); border: 1px solid rgba(138, 180, 255, 0.18); border-radius: 18px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25); }
  .hero-card, .panel, .card { padding: 20px; }
  .panel { margin-top: 18px; }
  .form-panel textarea, .form-panel input, .form-panel select, .card input, .card textarea { width: 100%; }
  label { display: grid; gap: 8px; margin-bottom: 16px; font-weight: 600; }
  input, textarea, select { background: #091425; color: #e5eefb; border: 1px solid rgba(148, 163, 184, 0.35); border-radius: 12px; padding: 12px 14px; font: inherit; }
  .grid { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .two-col { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 16px 0; }
  .stats { display: grid; gap: 14px; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-bottom: 18px; }
  .stats > div, .mini-card { padding: 14px; }
  .label, .mini-card span { display: block; color: #9bb0ca; font-size: 0.84rem; margin-bottom: 6px; }
  .beats { display: grid; gap: 12px; }
  .beat-head { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
  .beat p { margin: 8px 0; color: #cfdaea; }
  .primary { background: linear-gradient(135deg, #60a5fa, #2563eb); color: white; border: 0; border-radius: 12px; padding: 12px 18px; font: inherit; font-weight: 700; cursor: pointer; }
  .primary:disabled { opacity: 0.65; cursor: not-allowed; }
  .tight { margin: 0; padding-left: 18px; }
  .score-grid { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); margin-bottom: 18px; }
  .script-box { background: #04101c; border: 1px solid rgba(148, 163, 184, 0.22); border-radius: 16px; padding: 18px; margin: 16px 0; }
  pre { margin: 0; white-space: pre-wrap; word-break: break-word; font-family: "IBM Plex Mono", ui-monospace, monospace; line-height: 1.6; color: #eff6ff; }
  .error { border-color: rgba(248, 113, 113, 0.42); color: #ffd5d5; }
  .download a { color: #93c5fd; }
  dl { display: grid; grid-template-columns: 140px 1fr; gap: 10px 14px; margin: 0; }
  dt { color: #9bb0ca; font-weight: 700; }
  dd { margin: 0; }
  @media (max-width: 860px) { .hero, .grid, .two-col, .stats, .score-grid { grid-template-columns: 1fr; } dl { grid-template-columns: 1fr; } }
</style>
