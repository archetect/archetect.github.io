---
sidebar_position: 2
---

# Organizing & Publishing

## Repository layout

A catalog repository can be as small as one file:

```text
platform-catalog/
├── archetype.yaml     # the catalog
└── README.md
```

Catalogs that present their own behavior (an `archetype.lua` offering an interactive flow, shared content) are possible — it's an archetype, after all — but most catalogs are pure manifest.

## One repo or many?

Two workable strategies, freely mixed:

**Monolithic** — one repository declares the whole tree inline. Simple, atomic updates, one place to review changes. Right for small-to-medium collections owned by one team.

**Federated by delegation** — the root catalog's entries point at *other catalog repositories*:

```yaml
catalog:
  rust:
    description: "Rust Archetypes"
    source: "git@github.com:acme/catalog-rust.git"
  frontend:
    description: "Frontend Archetypes"
    source: "git@github.com:acme/catalog-frontend.git"
```

Each sub-catalog evolves independently under its owning team, and the root just wires them together. Consumers see one seamless tree — resolution happens on demand as they navigate.

## Organize by decision path

Structure the tree the way a developer thinks, not the way your repos are named. Compare:

```text
📂 by-repo-name          📂 by-decision
  📦 svc-rs-grpc-tmpl      📂 services
  📦 svc-rs-rest-tmpl        📦 grpc — gRPC Service
  📦 fe-next-tmpl            📦 rest — REST Service
                           📂 frontends
                             📦 nextjs — Next.js App
```

Guidelines that hold up:

- **Two or three levels deep, rarely more.** Every level is a menu hop.
- **Group by what, not how** — `services/`, `frontends/`, `infrastructure/`, `docs/` beat language-first trees unless your org genuinely thinks language-first.
- **Name entries as nouns** (`grpc`, `nextjs`), and let `description` carry the sell.
- **Curate variants with pre-configured entries** rather than making users answer ten prompts to reach the common case.

## Publishing

A catalog is published the way any archetype is: push the repository somewhere your consumers can clone. Private git hosting works — Archetect fetches with your local git, so whatever authentication `git clone` uses (SSH keys, credential helpers) just works.

Updates are a `git push`. Consumers pick them up on their next fetch — immediately with `-U`, or when their cache update interval lapses.

## Wiring it into configuration

Consumers add your catalog to their `archetect.yaml` (or you ship a config snippet / an onboarding archetype that does it):

```yaml
# ~/.config/archetect/archetect.yaml
catalog:
  acme:
    description: "Acme Platform"
    source: "git@github.com:acme/platform-catalog.git"
```

The key (`acme`) becomes the path prefix: `archetect acme/services/grpc`.

### Project-local catalogs

A `.archetect.yaml` at a project root does the same thing scoped to that project — and *replaces* the global catalog while inside it (use `archetect global` to escape). Generated projects can ship their own `.archetect.yaml`, so a freshly-rendered service arrives with its own menu of follow-up generators — add an endpoint, add a migration:

```yaml
# .archetect.yaml (shipped by your project archetype)
catalog:
  default:
    description: "Billing Service Generators"
    catalog:
      endpoint:
        description: "Add a gRPC endpoint"
        source: "git@github.com:acme/grpc-endpoint-archetype.git"
```

## Versioning and stability

Consumers track whatever your `source` refs resolve to. Pragmatics:

- Treat catalog `main` as your stable channel — merge only what you'd let every developer render.
- Big restructures (renaming groups, moving entries) break muscle memory and scripts that dispatch by path; announce them.
- Testing changes: clone your catalog locally and point a scratch config at the local path (`source: /path/to/checkout`), or use the [locals mechanism](../user-guide/configuration) with `-l`.
