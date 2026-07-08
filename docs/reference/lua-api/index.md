---
sidebar_position: 2
sidebar_label: Lua API
---

# Lua API Reference

Archetype scripts are plain Lua. Archetect runs your script top-to-bottom — there is no framework lifecycle and no callbacks to register. You create a [Context](context), prompt for values, render templates, and optionally compose other archetypes. When the script ends (or calls `exit()`), the render is complete.

Two kinds of API surface exist:

- **Globals** — available in every script with no `require()`.
- **`archetect.*` modules** — loaded explicitly with `require()`, because they perform side effects beyond the render destination (subprocesses, network, archives) or pull in optional machinery (AML models).

## Globals

| Global | Purpose | Reference |
|---|---|---|
| `Context` | Smart map of template variables + all prompt methods | [Context](context) |
| `archetect` | Binary/process introspection: version, offline/headless flags, `archetect.env` platform info | [Globals](globals#archetect) |
| `archetype` | The currently-rendering archetype: manifest metadata, destination, `archetype.switches`, `answers()`, library helpers | [Globals](globals#archetype) |
| `Case`, `Cases` | Case-expansion styles, presets, and direct string transforms | [Globals](globals#case-cases-and-casestyle) |
| `Existing` | Policy enum for files that already exist at the destination | [Globals](globals#existing) |
| `Location` | Path-resolution scope enum for `file.*` operations | [Globals](globals#location) |
| `directory` | Render a whole template directory | [Rendering](rendering#directory) |
| `file` | Single-file exists / read / render helpers | [Rendering](rendering#file) |
| `template` | Inline template rendering | [Rendering](rendering#template) |
| `catalog` | Compose other archetypes declared in this archetype's `catalog:` map | [catalog](catalog) |
| `format` | JSON / YAML / TOML serialization and parsing | [format, log & output](format-log-output#format) |
| `log` | Structured logging (`info`, `debug`, `warn`, `error`, `trace`) | [format, log & output](format-log-output#log) |
| `output` | User-facing output (`print`, `banner`) | [format, log & output](format-log-output#output) |
| `exit` | Cleanly terminate the script early | [Globals](globals#exit) |
| `require` | Load `archetect.*` modules or your own `lib/` modules | below |

:::note
There are no top-level `switches` or `env` globals. Switches live at `archetype.switches`, platform info at `archetect.env`.
:::

## `require()` modules

| Module | Purpose | Reference |
|---|---|---|
| `archetect.shell` | Run subprocesses (gated by the shell-execution security policy) | [shell, git, github & archive](shell-git-github-archive#archetectshell) |
| `archetect.git` | Initialize repositories and drive `git` operations | [shell, git, github & archive](shell-git-github-archive#archetectgit) |
| `archetect.github` | Check for / create GitHub repositories | [shell, git, github & archive](shell-git-github-archive#archetectgithub) |
| `archetect.archive` | Produce zip / tar / tar.gz archives from rendered output | [shell, git, github & archive](shell-git-github-archive#archetectarchive) |
| `archetect.model` | Load, parse, or build AML domain models | [model (AML)](model) |
| `archetect.model.interactive` | Prompt-driven interactive AML model builder | [model (AML)](model#archetectmodelinteractive) |

`require()` also resolves Lua modules from the archetype itself: helpers in the archetype's `lib/` directory are requirable by name (`require("helpers")`), and archetypes mounted as libraries expose their `lib/` under the catalog mount key (`require("my-lib.casing")`). See [Libraries](../../authoring-archetypes/scripting/libraries).

## A minimal script

```lua
local context = Context.new()

context:prompt_text("Project Name:", "project-name", {
    cases = Cases.programming(),
})

directory.render("contents/base", context)
```

Everything above — `Context`, `Cases`, `directory` — is a global. No `require()` is needed until you reach for the `archetect.*` modules.
