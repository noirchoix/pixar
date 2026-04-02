# Pixar Script Studio

A production-oriented SvelteKit application for generating Pixar-style short-form scripts through a constrained story pipeline rather than a single unconstrained prompt.

## Why this architecture

This app is built around a staged creative pipeline inspired by:
- predictable creative system design
- Pixar process stages
- Pixar-style rule extraction
- cross-script structural analysis

The app treats script creation as:

1. Topic normalization
2. Category inference
3. Core contradiction generation
4. Beat-flow generation
5. User confirmation
6. Script drafting
7. Refinement
8. Scoring
9. `.txt` export

## Stack

- SvelteKit
- Svelte 5
- TypeScript
- Adapter Node
- DeepSeek Chat API
- JSON-file local persistence

## Features

- Topic-to-story conversion
- Runtime-aware script sizing
- Category-based pacing
- Pixar-derived hard and soft rules
- Flow confirmation before full script generation
- Script scoring
- Downloadable `.txt` export
- Local history persistence

## Core model contract

The system converts:

`topic -> premise -> protagonist contradiction -> beat flow -> approved script`

Instead of trying to mimic style at the surface level, it operationalizes these ideas:

- a protagonist wants something concrete
- the story attacks their comfort zone
- each beat causes the next
- emotional movement is embodied in action
- language is refined toward active verbs and spoken clarity

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Required environment variable:

```bash
DEEPSEEK_API_KEY=...
```

Optional:

```bash
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
APP_STORAGE_DIR=.local
```

## App flow

### 1. Generate Flow
The UI posts topic, runtime, and optional constraints to:

`POST /api/flow`

This returns:
- inferred category
- word budget
- theme hypothesis
- protagonist contradiction
- beat flow
- applied rules

### 2. Generate Script
The UI posts the approved flow to:

`POST /api/script`

This returns:
- final script text
- refinement notes
- quality score
- story metadata

### 3. Export
The UI posts script text to:

`POST /api/export`

This writes a `.txt` file and returns a download URL.

## Directory layout

```text
src/
  lib/
    config/
    server/
      export/
      llm/
      pipeline/
      storage/
  routes/
    api/
      flow/
      script/
      export/
    download/[name]/
```

## Prompting strategy

The app uses small, specialized prompt contracts:
- category classification
- contradiction builder
- beat-flow generator
- script generator
- refinement pass

This makes generation observable and repairable.

## Production notes

This implementation is intentionally self-contained. For a full deployment, the next upgrades would be:

- database-backed persistence
- auth
- rate limiting
- audit logging
- admin rule management
- source-document ingestion UI
- model fallback chain
- request tracing
- queue-based export and batch generation

## DeepSeek API notes

This app uses DeepSeek through its OpenAI-compatible chat-completions surface and configurable base URL.

## License

For your internal/product development use.
