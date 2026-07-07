# Site archetect.github.io

Documentation built with Docusaurus

Built with [Docusaurus](https://docusaurus.io/).

## Install

```bash
npm install
```

## Local Development

```bash
npm start
```

Starts a local dev server at http://localhost:3000 with hot reload.

## Build

```bash
npm run build
```

Generates static content into the `build/` directory.

## Typecheck

```bash
npm run typecheck
```

## Using pnpm?

Docusaurus is package-manager-agnostic. Substitute `pnpm` for `npm`:

```bash
pnpm install
pnpm start
pnpm build
pnpm typecheck
```

(If you use pnpm, commit `pnpm-lock.yaml` and delete `package-lock.json`.
The included `pnpm-workspace.yaml` pre-approves the install scripts
Docusaurus needs — pnpm 10+ blocks dependency build scripts by default.)

## Deploy

Configured for GitHub Pages at `https://archetect.github.io/` (root domain).
Push to `main` — the Actions workflow builds and publishes automatically.
