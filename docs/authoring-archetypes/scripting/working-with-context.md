---
sidebar_position: 2
---

# Working with Context

The **Context** is the beating heart of a render: a smart map holding every variable your templates will see. Prompts write into it, scripts compute with it, and every render call takes it as an argument.

## Creating one

```lua
local context = Context.new()
```

A new Context isn't empty in practice — answers supplied for this render (from `-a` flags, answer files, catalog entries, and configuration) resolve into it as prompts execute, and standing configuration answers (like `author_name`) are available to prompts immediately.

## Reading and writing

```lua
context:set("service_port", 8080)
local port = context:get("service_port")     --> 8080

context:has("service_port")                  --> true
context:contains("features", "docker")       --> true if the array at "features" contains "docker"
```

`set` accepts an options table for [case expansion](./casing), same as prompts:

```lua
context:set("module-name", "payment gateway", { cases = Cases.programming() })
-- module-name, module_name, moduleName, ModuleName, Module-Name, MODULE_NAME all set
```

:::warning Setting nil doesn't remove
`context:set(key, nil)` stores a nil *sentinel* — it does not delete the key. There is no removal; design your keys so you never need one.
:::

## Merging

`merge` deep-merges another Context or plain table: nested tables merge recursively, scalars overwrite.

```lua
-- Absorb a composed child archetype's contributions
context:merge(catalog.render("org-prompts", context))

-- Fold in a defaults table
context:merge({ features = { "logging" }, port = 8080 })
```

This is the idiom that makes [composition](./composition) work: children return a Context of what they produced; the parent merges it in.

## Inspecting — the debugging superpower

`tostring(context)` renders the full context as YAML:

```lua
output.print(tostring(context))       -- or format.to_yaml(context)
```

```yaml
PROJECT_NAME: ROCKET_LAUNCHER
Project-Name: Rocket-Launcher
ProjectName: RocketLauncher
project-name: rocket-launcher
projectName: rocketLauncher
project_name: rocket_launcher
license: MIT
```

Two uses:

1. **Debugging** — see exactly what your templates will receive, casing variants and all.
2. **Replay** — the output is a valid [answer file](../../reference/answer-files). Save it, and `archetect render <source> -A saved.yaml --headless` reproduces the render.

## Context vs. plain tables

Keep values *templates need* in the Context. Intermediate scratch values can live in ordinary Lua variables — no need to pollute the template namespace:

```lua
local parts = {}                      -- scratch: plain Lua
for _, e in ipairs(entities) do
  table.insert(parts, e.name)
end
context:set("entity_list", table.concat(parts, ", "))   -- result: into Context
```

## One context or several?

Most archetypes thread a single Context through everything. Occasionally you want isolation — for example, rendering a sub-template with a temporarily different value:

```lua
local sub = Context.new()
sub:merge(context)
sub:set("crate_name", "xtask")
file.render("templates/Cargo.toml", sub, { destination = "xtask/Cargo.toml" })
```

Full API: [Context reference](../../reference/lua-api/context).
