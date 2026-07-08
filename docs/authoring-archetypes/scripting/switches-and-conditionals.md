---
sidebar_position: 5
---

# Switches & Conditionals

Real archetypes generate *variations*: with or without Docker, gRPC or REST, minimal or batteries-included. Two mechanisms drive the branching: **switches** (caller-supplied flags) and **prompted values**.

## Checking switches

Switches arrive from the command line (`-s docker`), configuration, or the catalog entry that launched the render. Check them with:

```lua
if archetype.switches.is_enabled("docker") then
  directory.render("docker", context)
end
```

That's the entire switch API — `is_enabled` returns `true` or `false`, and unknown switch names are simply `false`.

## Switch or prompt?

| Use a **switch** when… | Use a **prompt** when… |
|---|---|
| The *caller* decides (CI profile, catalog flavor) | The *user* should be asked |
| Silent default-off is right | A visible question with a default is right |
| Enabling is an opt-in extra | The value shapes the project's identity |

They combine well — a switch can preempt a question:

```lua
local with_ci = archetype.switches.is_enabled("github-actions")
    or context:prompt_confirm("Include GitHub Actions workflows?", "use_ci", { default = true })

if with_ci then
  directory.render("ci", context)
end
```

:::tip Document your switches
Archetect doesn't validate switch names — a typo'd `-s dokcer` is silently inert. List supported switches in your archetype's README and description, and consider declaring them in the [interface](../interface) so tooling can discover them.
:::

## Conditional rendering patterns

**Separate content roots per feature** (the cleanest structure — no template logic needed):

```lua
directory.render("contents", context)                       -- always
if context:get("use_docker") then
  directory.render("docker", context)                       -- adds Dockerfile, .dockerignore, …
end
```

**Conditionals inside templates** for small, localized variation:

```jinja
{% if use_docker %}
docker-build:
	docker build -t {{ project-name }} .
{% endif %}
```

**Conditional composition** for whole sub-archetypes:

```lua
if context:get("use_github") then
  context:merge(catalog.render("github-prompts", context))
end
```

Rule of thumb: branch in the *script* for whole files and directories, in the *template* for lines and blocks. Scripts branching keeps templates readable; template branching avoids exploding one file into many near-duplicates.

## Feature flags via multiselect

For many independent features, a multiselect prompt often beats a pile of switches:

```lua
context:prompt_multiselect("Features:", "features",
  { "docker", "github-actions", "telemetry" },
  { default = { "docker" } })

for _, feature in ipairs(context:get("features")) do
  directory.render("features/" .. feature, context)
end
```

Templates can test membership too: `{% if contains(features, "telemetry") %}`.

## Platform conditionals

The `archetect.env` global describes the *host* running the render — occasionally useful for generated tooling scripts:

```lua
if archetect.env.is_windows then
  file.render("scripts/build.ps1", context, { destination = "build.ps1" })
else
  file.render("scripts/build.sh", context, { destination = "build.sh" })
end
```
