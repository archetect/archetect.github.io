---
sidebar_position: 3
---

# Prompting

Prompts are how archetypes gather input. Archetect provides seven prompt types, all methods on a Context, all following the same shape:

```lua
context:prompt_<type>(message, key, opts)
```

The answer is stored in the context under `key` *and* returned, so you can use it inline:

```lua
local name = context:prompt_text("Project Name:", "project_name")
```

## The seven types

```lua
-- Free text
context:prompt_text("Project Name:", "project_name", {
  default = "my-service",
  help = "Lowercase letters, digits, and dashes",
  min = 3, max = 40,
})

-- Integer (min/max are numeric bounds)
context:prompt_int("Service Port:", "port", { default = 8080, min = 1024, max = 65535 })

-- Yes/no
context:prompt_confirm("Publish to GitHub?", "use_github", { default = false })

-- Single choice
context:prompt_select("Database:", "database",
  { "PostgreSQL", "MySQL", "SQLite" },
  { default = "PostgreSQL" })

-- Multiple choice (min/max bound the selection count)
context:prompt_multiselect("Features:", "features",
  { "logging", "metrics", "tracing" },
  { default = { "logging" } })

-- Free-form list, entered item by item (min/max bound the item count)
context:prompt_list("Team Members:", "team", { min = 1 })

-- Long-form text in $EDITOR
context:prompt_editor("Project Description:", "description")
```

## Options

All prompts accept:

| Option | Effect |
|---|---|
| `default` | Pre-filled value; what `-d`/`-D` accept |
| `help` | Explanatory text shown with the prompt |
| `placeholder` | Hint text in the input field |
| `optional` | Allow skipping — the prompt returns `nil` and stores nothing |
| `answer_key` | Alternate key for *looking up* pre-supplied answers (see below) |

Type-specific extras:

| Option | Applies to | Effect |
|---|---|---|
| `min` / `max` | text (length), int (value), multiselect & list (count) | Validation bounds |
| `cases` | text, select | [Case expansion](./casing) of the answer |
| `allow_other` | select | Append an "Other…" entry that opens free-text input |
| `other_label` | select | Custom label for that entry |

## Return values are the raw input

A prompt returns exactly what the user supplied (string, integer, boolean, or list) — `nil` if an optional prompt was skipped. Case-expanded variants live in the *context* only:

```lua
local answer = context:prompt_text("Project Name:", "project-name", {
  cases = Cases.programming(),
})
-- answer                        --> "rocket launcher"  (raw input)
-- context:get("ProjectName")    --> "RocketLauncher"   (case-expanded)
```

## How prompts resolve

Interactive input is the *last resort*, not the default. Each prompt tries, in order:

1. An explicit answer (`-a`, answer file, catalog entry, configuration)
2. The `default`, when the user passed `-d <key>` or `-D`
3. Asking interactively — or **failing**, in `--headless` mode

Design consequence: **give every prompt a sensible default when one exists.** It's what makes your archetype pleasant interactively (Enter-through) *and* automatable (`-D` in CI).

### `answer_key` — decoupling answer names from storage keys

Sometimes the natural storage key differs from the name automation supplies. `answer_key` changes only the *lookup*: the value is still stored under the prompt's own key.

```lua
-- CI passes -a service_name=billing; templates use {{ project-name }} etc.
context:prompt_text("Project Name:", "project-name", {
  answer_key = "service_name",
  cases = Cases.programming(),
})
```

## Optional prompts

```lua
local db = context:prompt_select("Database:", "database",
  { "PostgreSQL", "MySQL", "SQLite" },
  { optional = true })

if db then
  directory.render("database", context)
end
```

Skipped optional prompts return `nil` and leave the context untouched — pair them with an `if` on the return value.

## Prompt design tips

- **Order prompts from identity outward**: name and organization first, features later — early answers often shape later defaults.
- **Prefer select over text** whenever the answers are enumerable; you get validation for free.
- **Use `help`** for anything a first-time user could get wrong; it's cheap and appears only when relevant.
- **Reuse shared prompt sets** across archetypes by extracting them into a component and composing it — see [Composition](./composition).

Full option tables per type: [Context reference](../../reference/lua-api/context).
