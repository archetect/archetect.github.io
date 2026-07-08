---
sidebar_position: 3
sidebar_label: User Guide
---

# User Guide

Everything about *using* Archetect day to day — rendering archetypes, navigating catalogs, automating input, and tuning your configuration. (Creating archetypes is covered separately in [Authoring Archetypes](../authoring-archetypes/).)

## In this section

- **[Rendering Archetypes](./rendering-archetypes)** — sources, destinations, caching, previews.
- **[Using Catalogs](./using-catalogs)** — browsing, searching, and dispatching by path.
- **[Answers & Automation](./answers-and-automation)** — pre-answering prompts, answer files, defaults, and headless operation.
- **[Switches](./switches)** — toggling optional archetype behavior.
- **[Configuration](./configuration)** — global and project configuration, offline mode, security.
- **[IDE & Tooling](./ide-and-tooling)** — editor support, shell completions, cache management, diagnostics.

## The commands you'll actually use

| Command | Purpose |
|---|---|
| `archetect` | Browse your configured catalog interactively |
| `archetect <path> [dest]` | Dispatch straight to a catalog entry (e.g. `archetect archetect/rust/cli/clap-cli`) |
| `archetect render <source> [dest]` | Render an archetype from a git URL or local directory |
| `archetect ls` | Print the resolved catalog tree |
| `archetect search <terms>` | Full-text search across the catalog |
| `archetect check` | Diagnose your environment |

For every command and flag in detail, see the [CLI Reference](../reference/cli/).
