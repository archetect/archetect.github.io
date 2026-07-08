---
sidebar_position: 4
---

# Declarative Interfaces

Your Lua script defines what an archetype *does*. An **interface** declares what it *needs* — prompts and switches, as data — so external tooling (web portals, MCP-driven AI agents, documentation generators) can present proper input forms without executing the script.

Interfaces are optional and purely additive: the Lua script remains the engine; the interface describes it.

## Declaring an interface

Either inline in `archetype.yaml` under `interface:`, or in a sibling `interface.yaml` (which takes precedence if both exist):

```yaml
# interface.yaml
mode: batch

prompts:
  - key: project-name
    type: text
    label: "Project Name"
    help: "Lowercase letters, digits, and dashes"
    placeholder: "my-service"
    validation: "^[a-z][a-z0-9-]*$"

  - key: database
    type: select
    label: "Database"
    default: PostgreSQL
    options:
      - PostgreSQL
      - MySQL
      - { value: sqlite, label: "SQLite", help: "Embedded, zero-config" }

  - key: features
    type: multiselect
    label: "Features"
    required: false
    defaults: [logging]
    options: [logging, metrics, tracing]

switches:
  - key: docker
    label: "Docker support"
    help: "Adds Dockerfile and .dockerignore"

groups:
  - label: "Identity"
    keys: [project-name]
  - label: "Stack"
    keys: [database, features]
```

## The schema, briefly

**Prompts** mirror the scripting prompt types — `text`, `int`, `bool`, `select`, `multiselect`, `list`, `editor` — with declarative counterparts of the script options:

| Field | Notes |
|---|---|
| `key` | Must match what the script prompts for |
| `type` | One of the seven prompt types |
| `label` | Human-readable prompt label |
| `help`, `placeholder` | Optional guidance |
| `required` | Default `true` |
| `default` / `defaults` | Single value / list (multiselect, list) |
| `options` | For select/multiselect — strings, or `{ value, label, help }` |
| `min` / `max` | Value, length, or item-count bounds by type |
| `validation` | Regex, text prompts only |

**Switches** declare the flags your script checks with `archetype.switches.is_enabled` — finally giving them discoverability.

**Groups** are optional UI layout hints.

## Interaction modes

| Mode | Meaning |
|---|---|
| `interactive` (default) | The script may branch and ask conditional questions; clients should drive prompt-by-prompt. The declared prompts still aid discoverability. |
| `batch` | The interface declares *all* required inputs — a client can present one form and submit everything at once. |

Declare `batch` only when your prompt flow is flat: no prompts hidden behind confirms or conditionals. When in doubt, stay `interactive` — it always works.

## Keep it in sync

Archetect doesn't (currently) verify that your interface matches your script — the contract is yours to keep. A drift-catching habit: whenever you add or rename a prompt in `archetype.lua`, update the interface in the same commit, and exercise it headlessly:

```shell
archetect render . /tmp/check --headless -A test-answers.yaml
```

If the interface's declared keys can fully drive a headless render, it's telling the truth.

Full schema details: [Archetype Manifest reference](../reference/archetype-manifest).
