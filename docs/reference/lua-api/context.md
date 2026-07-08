---
sidebar_position: 1
---

# Context

`Context` is the heart of an archetype script: a smart map that holds template variables and provides every prompt method. Values placed in a Context become the variables your templates render against.

```lua
local context = Context.new()
context:prompt_text("Project Name:", "project-name", { cases = Cases.programming() })
directory.render("contents", context)
```

## Constructor

### `Context.new()`

```lua
local context = Context.new()
```

Creates a new Context. Answers pre-supplied to this invocation — from `-a key=value`, an [answer file](../answer-files), or a parent archetype — are loaded into it immediately, which is how prompts get auto-answered.

**Returns:** `Context`

## Core methods

| Method | Returns | Description |
|---|---|---|
| `ctx:get(key)` | `any` | The stored value, or `nil` if absent |
| `ctx:has(key)` | `boolean` | Whether the key exists |
| `ctx:contains(key, value)` | `boolean` | Whether the array at `key` contains `value` |
| `ctx:set(key, value, opts?)` | — | Store a value directly (with optional case expansion) |
| `ctx:merge(other)` | — | Deep-merge another Context or table into this one |
| `tostring(ctx)` | `string` | YAML of the context's data (a valid answer file) |

### `ctx:get(key)`

```lua
local name = context:get("project_name")
```

Returns the value stored under `key`, or `nil` when the key is not present. This is how you read case-expanded variants produced by `cases` options — prompt methods return only the raw value.

### `ctx:has(key)`

```lua
if context:has("project-suffix") then ... end
```

Returns `true` when the key exists in the context.

### `ctx:contains(key, value)`

```lua
if context:contains("features", "GitHub Actions") then ... end
```

Returns `true` when the value stored at `key` is an array containing `value` (string comparison). Returns `false` when the key is missing or is not an array. Handy for checking `prompt_multiselect` results.

### `ctx:set(key, value, opts)`

```lua
context:set("author", "Jane Doe")
context:set("service-name", "order api", { cases = Cases.programming() })
```

| Parameter | Type | Description |
|---|---|---|
| `key` | `string` | Key to store under |
| `value` | `any` | String, integer, boolean, table (map or array), or nil |
| `opts.cases` | `CaseSpec` \| `CaseSpec[]` | Case expansion — applies to string values only |

Notes:

- Setting `nil` stores a **Nil sentinel** — it does **not** remove the key. There is no `context:remove()`; avoid setting `nil` if you need the key to be absent.
- When `opts.cases` is supplied, the original key is written **alongside** the case variants. Use a canonical key form (kebab or snake) so the input key doesn't collide with a derived variant.

### `ctx:merge(other)`

```lua
context:merge(catalog.render("components/xtask", context))
context:merge(format.from_yaml(file.read("defaults.yaml")))
```

Deep-merges another Context or a map-shaped Lua table into this one. Map-into-map merges recursively; scalar and array values are overwritten by the incoming value. Merging `nil` is a no-op; merging an array-shaped table is an error.

This is the standard way to absorb a child archetype's contributions — see [catalog](catalog).

### `tostring(ctx)`

```lua
log.debug(tostring(context))
```

Serializes the context's data as YAML — equivalent to `format.to_yaml(ctx)`. The output round-trips as a valid [answer file](../answer-files), so dumping a context doubles as "what answers would reproduce this render". See [format, log & output](format-log-output#the-answer-file-round-trip).

## Prompt methods

All seven prompt methods follow the same contract:

1. **Answer lookup first.** If an answer already exists in the context (from `-a`, an answer file, or a parent), the prompt is skipped and the answer is used.
2. **Defaults in headless / `--use-defaults` modes.** When running headless, or when the key is covered by `use_defaults` / `use_defaults_all`, the `default` option is used without prompting. If there is no default and the prompt is not `optional`, the render fails with an error.
3. **Storage.** The result is stored in the context under `key` (with case expansion where supported).
4. **Return value is the raw user value.** Each method returns exactly what the user entered — `nil` when an `optional` prompt is skipped. Case-expanded variants are stored in the context only; read them with `ctx:get`.

```lua
-- Returns the raw input; case variants are context side effects.
local raw = context:prompt_text("Project Name:", "project-name", {
    cases = Cases.programming(),
})
-- raw == "My Project"
-- context:get("project-name") == "My Project"
-- context:get("project_name") == "my_project"
-- context:get("ProjectName")  == "MyProject"
```

### Common options

| Option | Type | Applies to | Description |
|---|---|---|---|
| `default` | varies | all except `prompt_list` | Value used when the user accepts the default, and in headless/use-defaults modes |
| `help` | `string` | all | Help text shown alongside the prompt |
| `placeholder` | `string` | all | Placeholder text in the input field |
| `optional` | `boolean` | all except `prompt_editor` | Allow skipping; a skipped prompt returns `nil` and stores nothing |
| `cases` | `CaseSpec` \| `CaseSpec[]` | `prompt_text`, `prompt_select` | Case expansion — see [Casing](../../authoring-archetypes/scripting/casing) |
| `answer_key` | `string` | all | Pre-answer lookup alias (see below) |

#### `answer_key` semantics

`answer_key` is a **lookup alias only**. When checking for a pre-supplied answer, the prompt looks under `answer_key` instead of the prompt's own `key`. The result is always **stored under the prompt's own `key`** regardless. Use it when the CLI or a parent archetype supplies a value under a different name than your storage key:

```lua
-- `archetect render -a artifact_id=widget ...` answers this prompt,
-- but the value is stored (and case-expanded) under "project-name".
context:prompt_text("Project Name:", "project-name", {
    answer_key = "artifact_id",
    cases = Cases.programming(),
})
```

### `prompt_text`

```lua
context:prompt_text(message, key, opts?) --> string | nil
```

| Option | Type | Description |
|---|---|---|
| `default` | `string` | Default value |
| `help` | `string` | Help text |
| `placeholder` | `string` | Placeholder text |
| `min` | `integer` | Minimum input length |
| `max` | `integer` | Maximum input length |
| `optional` | `boolean` | Whether the prompt can be skipped |
| `cases` | `CaseSpec` \| `CaseSpec[]` | Case expansion rules |
| `answer_key` | `string` | Pre-answer lookup alias |

```lua
local desc = context:prompt_text("Description:", "description", {
    default = "A new project",
    min = 3,
    max = 80,
})
```

### `prompt_int`

```lua
context:prompt_int(message, key, opts?) --> integer | nil
```

| Option | Type | Description |
|---|---|---|
| `default` | `integer` | Default value |
| `help` | `string` | Help text |
| `placeholder` | `string` | Placeholder text |
| `min` | `integer` | Minimum value |
| `max` | `integer` | Maximum value |
| `optional` | `boolean` | Whether the prompt can be skipped |
| `answer_key` | `string` | Pre-answer lookup alias |

```lua
local port = context:prompt_int("Service Port:", "port", {
    default = 8080,
    min = 1024,
    max = 65535,
})
```

### `prompt_confirm`

```lua
context:prompt_confirm(message, key, opts?) --> boolean | nil
```

| Option | Type | Description |
|---|---|---|
| `default` | `boolean` | Default value |
| `help` | `string` | Help text |
| `placeholder` | `string` | Placeholder text |
| `optional` | `boolean` | Whether the prompt can be skipped |
| `answer_key` | `string` | Pre-answer lookup alias |

```lua
if context:prompt_confirm("Initialize a git repository?", "git-init", { default = true }) then
    local git = require("archetect.git")
    git.init()
end
```

### `prompt_select`

```lua
context:prompt_select(message, key, options, opts?) --> string | nil
```

| Parameter | Type | Description |
|---|---|---|
| `options` | `string[]` | The choices presented to the user |

| Option | Type | Description |
|---|---|---|
| `default` | `string` | Default selection (may be an off-list value when `allow_other = true`) |
| `help` | `string` | Help text |
| `placeholder` | `string` | Placeholder text |
| `optional` | `boolean` | Whether the prompt can be skipped |
| `allow_other` | `boolean` | Append an "Other..." entry that opens a free-text prompt |
| `other_label` | `string` | Label for the "other" entry (default: `"Other..."`) |
| `cases` | `CaseSpec` \| `CaseSpec[]` | Case expansion rules |
| `answer_key` | `string` | Pre-answer lookup alias |

```lua
local lang = context:prompt_select("Language:", "language",
    { "Rust", "Java", "Python" },
    { default = "Rust", allow_other = true })
```

### `prompt_multiselect`

```lua
context:prompt_multiselect(message, key, options, opts?) --> string[] | nil
```

| Parameter | Type | Description |
|---|---|---|
| `options` | `string[]` | The choices presented to the user |

| Option | Type | Description |
|---|---|---|
| `default` | `string[]` | Default selections |
| `help` | `string` | Help text |
| `placeholder` | `string` | Placeholder text |
| `min` | `integer` | Minimum number of selections |
| `max` | `integer` | Maximum number of selections |
| `optional` | `boolean` | Whether the prompt can be skipped |
| `answer_key` | `string` | Pre-answer lookup alias |

```lua
context:prompt_multiselect("Features:", "features",
    { "Dockerfile", "GitHub Actions", "Helm Chart" },
    { default = { "Dockerfile" } })

if context:contains("features", "Helm Chart") then
    directory.render("contents/helm", context)
end
```

A pre-supplied answer may be an array or a comma-separated string (`-a features="Dockerfile, Helm Chart"`); a string is split on commas and stored as an array.

:::caution Deprecated alias
`prompt_multi_select` is a deprecated alias of `prompt_multiselect`. It behaves identically but logs a deprecation warning; migrate to `prompt_multiselect`.
:::

### `prompt_list`

```lua
context:prompt_list(message, key, opts?) --> string[] | nil
```

Prompts for a free-form list of strings (the user enters items one at a time).

| Option | Type | Description |
|---|---|---|
| `default` | `string[]` | Default items (used in headless / use-defaults modes) |
| `help` | `string` | Help text |
| `placeholder` | `string` | Placeholder text |
| `min` | `integer` | Minimum number of items |
| `max` | `integer` | Maximum number of items |
| `optional` | `boolean` | Whether the prompt can be skipped |
| `answer_key` | `string` | Pre-answer lookup alias |

```lua
local modules = context:prompt_list("Module names:", "modules", { min = 1 })
```

As with `prompt_multiselect`, a pre-supplied string answer is split on commas into an array.

### `prompt_editor`

```lua
context:prompt_editor(message, key, opts?) --> string | nil
```

Opens the user's editor to capture multi-line text.

| Option | Type | Description |
|---|---|---|
| `default` | `string` | Initial text in the editor |
| `help` | `string` | Help text |
| `placeholder` | `string` | Placeholder text |
| `answer_key` | `string` | Pre-answer lookup alias |

```lua
local body = context:prompt_editor("Long description:", "long-description", {
    default = "# " .. context:get("project-name"),
})
```

## See also

- [Prompting guide](../../authoring-archetypes/scripting/prompting) — patterns and walkthroughs
- [Casing](../../authoring-archetypes/scripting/casing) — how `cases` expansion works
- [Answer Files](../answer-files) — supplying answers up front
