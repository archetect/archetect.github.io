---
sidebar_position: 2
sidebar_label: Scripting
---

# Scripting with Lua

Every archetype is driven by a Lua script — `archetype.lua` — that runs top-to-bottom when the archetype renders. The script's job: gather input, make decisions, and emit content.

```lua
local context = Context.new()

context:prompt_text("Project Name:", "project-name", {
  cases = Cases.programming(),
})

context:prompt_confirm("Include Docker support?", "use_docker", { default = false })

directory.render("contents", context)
if context:get("use_docker") then
  directory.render("docker", context)
end
```

## Why Lua

Lua is one of the most widely embedded languages in the world — you may already know it from Neovim, Redis, or game modding, and if not, it's famously small and learnable in an afternoon. For archetype authors this brings something scripting engines rarely have: **first-class IDE support**. Run `archetect ide setup` and the Lua Language Server gives you autocomplete, hover documentation, and typo-catching diagnostics for the entire Archetect API.

## The execution model

- The script runs **once, top-to-bottom**. No callbacks, no lifecycle — reading a script tells you exactly what happens, in order.
- **Globals are pre-loaded.** `Context`, `Cases`, `directory`, `file`, `template`, `catalog`, `format`, `log`, `output`, `archetype`, `archetect`, and the enums (`Case`, `Location`, `Existing`) are available without any `require`.
- **Extended capabilities are modules**: `require("archetect.git")`, `require("archetect.shell")`, `require("archetect.github")`, `require("archetect.archive")`, `require("archetect.model")`.
- **Prompts resolve, not just ask.** Every prompt first consults answers and defaults; interactivity is the fallback. Your script doesn't need to know whether it's running in a terminal or a CI job.

## In this section

| Page | Covers |
|---|---|
| [Lua Basics](./lua-basics) | Just enough Lua, if it's new to you |
| [Working with Context](./working-with-context) | The variable map at the heart of every render |
| [Prompting](./prompting) | All seven prompt types and their options |
| [Casing](./casing) | Case expansion — one answer, every spelling |
| [Switches & Conditionals](./switches-and-conditionals) | Gating optional behavior |
| [Rendering](./rendering) | Emitting directories, files, and strings |
| [Composition](./composition) | Rendering archetypes from archetypes |
| [Libraries](./libraries) | Sharing Lua modules and template fragments |
| [Utility Modules](./utility-modules) | format, log, output, shell, git, github, archive |
| [Modeling with AML](./modeling-with-aml) | Model-driven generation |

For exact signatures and option tables, the [Lua API Reference](../../reference/lua-api/) is the lookup companion to these guides.
