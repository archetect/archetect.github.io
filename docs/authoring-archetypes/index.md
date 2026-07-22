---
sidebar_position: 4
sidebar_label: Authoring Archetypes
---

# Authoring Archetypes

An archetype is a directory with a manifest, a Lua script, and templated content. This section teaches you to build them — from a three-file hello-world to composed, library-sharing generators that scaffold entire platforms.

If you haven't yet, do the [Your First Archetype](../getting-started/your-first-archetype) tutorial — it's fifteen minutes and gives everything here context.

## The authoring loop

```shell
mkdir my-archetype && cd my-archetype
archetect ide setup          # editor autocomplete for the Lua API
# … write archetype.yaml, archetype.lua, content …
archetect render . ../scratch   # render from the local directory
```

Local directories render directly (no cache, no git), so iteration is instant: edit, render, inspect, repeat. See [Testing & Debugging](./testing-and-debugging) for the full workflow, including dry runs and replayable answer files.

## In this section

- **[Anatomy of an Archetype](./anatomy)** — every file and directory and what it's for.
- **[Scripting with Lua](./scripting/)** — prompts, context, rendering, composition, libraries, and the utility modules.
- **[Templating with ATL](./templating/)** — template syntax, filters, and organization.
- **[Derived Interfaces](./interface)** — how archetect derives your archetype's inputs by probing it, so portals and AI agents can drive it.
- **[Testing & Debugging](./testing-and-debugging)** — tight feedback loops and troubleshooting.

## Kinds of archetypes

The same machinery covers a spectrum of uses:

| Kind | Description | Typical trait |
|---|---|---|
| **Project archetype** | Generates a standalone project | Wraps output in a `{{ project_name }}/` directory |
| **Component** | A building block composed by other archetypes (prompt sets, sub-trees like an `xtask/` crate) | Marked `show: false` in catalogs; renders into the parent's destination |
| **Library** | Shares Lua modules and template includes with consumers | Mounted with `library: true`; often renders nothing itself |
| **Catalog** | Presents a menu of other archetypes | Has a `catalog:` section; may have no content at all |

These compose: a project archetype might mount two libraries, render three components, and be published inside a catalog. [Composition](./scripting/composition) and [Libraries](./scripting/libraries) cover the mechanics.
