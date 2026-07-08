---
sidebar_position: 1
---

# Introduction

**Archetect** is a flexible, powerful, and blazingly fast code generator. It renders single files, complete projects, or entire architectures from *archetypes* — templated project blueprints driven by interactive prompts and Lua scripts.

```shell
# Browse your configured catalog and pick from a menu
archetect

# Or render straight from a git-hosted archetype
archetect render https://github.com/your-org/your-archetype.git my-project
```

Archetect is written in Rust and distributed as a single native binary. It pulls archetypes directly from git repositories or local directories, prompts you for the values a project needs, and renders a ready-to-build codebase in milliseconds.

## Highlights

- **Interactive prompts** — text, select, multiselect, confirmation, and more, with defaults, help text, and validation. Every prompt can also be answered non-interactively for CI and automation.
- **Lua scripting** — archetypes are orchestrated with Lua, giving authors real IDE support (autocomplete, hover docs, and diagnostics via the Lua Language Server) and a language millions of developers already know.
- **ATL templating** — a Jinja2-style template engine purpose-built for code generation, with rich casing filters (`snake_case`, `PascalCase`, `kebab-case`, …) and smart pluralization (`soliloquy` → `soliloquies`, `calf` → `calves`).
- **Casing intelligence** — prompt once for `"My Project"`, and Archetect derives `my_project`, `MyProject`, `myProject`, `my-project`, `MY_PROJECT`, and more automatically.
- **Catalogs** — organize archetypes into browsable, searchable menus, distributed as plain git repositories.
- **Composition** — archetypes can render other archetypes and share Lua modules and template fragments through reusable libraries.
- **Automation-friendly** — headless mode, answer files, switches, and dry runs make Archetect a solid citizen in scripts and pipelines.

## Where to go next

| Section | What you'll find |
|---|---|
| [Getting Started](./getting-started/) | What Archetect is, how to install it, and your first generated project |
| [User Guide](./user-guide/) | Day-to-day usage: rendering, catalogs, answers, switches, and configuration |
| [Authoring Archetypes](./authoring-archetypes/) | Creating your own archetypes with Lua scripting and ATL templates |
| [Authoring Catalogs](./authoring-catalogs/) | Organizing archetypes into catalogs for your team or organization |
| [Reference](./reference/) | Exhaustive reference for the CLI, Lua API, ATL, manifests, and configuration |
