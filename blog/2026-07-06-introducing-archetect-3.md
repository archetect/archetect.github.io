---
slug: introducing-archetect-3
title: Introducing Archetect 3
authors: [jfulton]
tags: [announcements, archetect]
---

Archetect 3 is the biggest release in the project's history: a ground-up refinement of how archetypes are scripted, templated, and composed — while staying true to what Archetect has always been: a flexible, powerful, and blazingly fast code generator.

{/* truncate */}

## Lua is the new scripting engine

Archetype scripts are now written in **Lua**, one of the most widely known and battle-tested embedded languages in the world. Compared to Archetect 2's scripting engine, this brings:

- **Real IDE support** — full autocomplete, hover docs, and error detection through the Lua Language Server. Archetect ships type annotations for its entire scripting API; a single `archetect ide setup` wires up your editor.
- **A language you may already know** — Lua powers Neovim, Redis, game engines, and countless embedded systems. There's a good chance you've written some, and if you haven't, it's famously easy to pick up.
- **Loud failures instead of silent ones** — typos in scripts produce clear errors with stack traces, rather than silently generating the wrong thing.

A minimal archetype script looks like this:

```lua
local ctx = Context.new()

ctx:prompt_text("Project Name:", "project-name", {
  cases = Cases.programming(),
})

directory.render("templates", ctx)
```

## ATL: a purpose-built template engine

Templates are rendered with the **Archetect Template Language (ATL)** — a Jinja2-style engine with first-class support for the things code generators actually need: a full suite of casing filters (`snake_case`, `PascalCase`, `kebab-case`, and friends), smart pluralization and singularization, and filters and functions that can be used interchangeably.

## Composable catalogs and libraries

Catalogs — Archetect's distributed menu system for organizing archetypes — are now declarative and composable. Archetypes can be mounted as **libraries**, sharing Lua modules and template fragments across an entire organization's archetype ecosystem, and catalog entries can carry pre-configured answers and switches.

## And more

- Interactive full-text catalog search (`archetect search`)
- First-class headless/CI operation with typed answers and answer files
- An MCP server (`archetect mcp`) so AI tools can drive generation
- Client/server modes for running Archetect across a network

Head over to [Getting Started](/docs/getting-started/) to install Archetect 3 and generate your first project, or dive into the [Reference](/docs/reference/) for the full CLI and Lua API documentation.
