---
sidebar_position: 4
---

# Archetype Manifest

Every archetype and catalog is described by a single manifest file at its root. Archetect v3 uses one unified manifest schema for both: the presence of a `catalog:` section and/or an `archetype.lua` script determines behavior at runtime (see [Archetype Layout](./archetype-layout)).

## Manifest File Names

When loading an archetype directory, Archetect searches for a manifest file in this priority order — the first match wins:

| Priority | File | Notes |
|---|---|---|
| 1 | `archetype.yaml` | **Canonical v3 name.** Use this for new archetypes. |
| 2 | `archetype.yml` | Accepted alias. |
| 3 | `archetect.yaml` | Backwards-compatibility alias — avoid for new archetypes. |
| 4 | `archetect.yml` | Backwards-compatibility alias — avoid for new archetypes. |

:::note
`archetype.yaml` describes the *archetype*. Don't confuse it with `archetect.yaml`, the *tool's* configuration file found in `~/.config/archetect/` and as project-level overrides — see [Configuration Files](./configuration).
:::

## Top-Level Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `description` | string | `""` | Human-readable name/description. Shown in menus and search. Every manifest should set this. |
| `summary` | string | — | Optional longer summary, used by indexing and search. |
| `authors` | list of strings | `[]` | Author names/emails. |
| `languages` | list of strings | `[]` | Languages this archetype generates (e.g. `["Rust"]`). Metadata for search. |
| `frameworks` | list of strings | `[]` | Frameworks used (e.g. `["Tonic"]`). Metadata for search. |
| `tags` | list of strings | `[]` | Free-form tags. Metadata for search. |
| `requires` | map | running version | Runtime requirements — see [`requires`](#requires). |
| `catalog` | map of [CatalogEntry](./catalog-manifest) | — | Named catalog entries: submenus, renderable archetypes, and library dependencies. |
| `templating` | map | see below | Template-engine behavior — see [`templating`](#templating). |
| `interface` | map | — | Declarative input contract — see [`interface`](#interface). |

Unknown fields are silently ignored by the parser — a typo'd section will not raise an error, so double-check field names.

## `requires`

| Field | Type | Default | Description |
|---|---|---|---|
| `archetect` | semver version requirement | the running Archetect's own version | Minimum Archetect version this archetype needs. |

The value is parsed as a semver version requirement (e.g. `"3.0.0"`) and treated as a **minimum version**: the running Archetect must be at least that version. A newer major version satisfies an older requirement (Archetect 3.x renders archetypes that require 2.x), while an older binary fails with a clear error.

```yaml
requires:
  archetect: "3.0.0"
```

Although the section is optional in parsing, every archetype should declare it explicitly.

## `templating`

Controls template-engine behavior for [ATL](./templating/) rendering. All fields are optional.

| Field | Type | Default | Description |
|---|---|---|---|
| `undefined` | `lenient` \| `strict` | `lenient` | Resolution policy for undefined context variables. `lenient` renders them as empty; `strict` raises an error at render time. |
| `trim_blocks` | boolean | `false` | Strip the first newline after a `{% ... %}` block tag. |
| `lstrip_blocks` | boolean | `false` | Strip leading whitespace on lines that contain only a block tag. |

```yaml
templating:
  undefined: strict
  trim_blocks: true
  lstrip_blocks: true
```

There is no `content` or `includes` setting: content directories are addressed by root-relative paths in `directory.render(path, context)`, and the archetype's own `includes/` directory is automatically on the include search path — see [Archetype Layout](./archetype-layout).

## `catalog`

An inline map of named catalog entries. Each entry is either a **leaf** (renderable archetype, via `source`), a **group** (submenu, via nested `catalog`), or a **server** (federated remote, via `server`). Entries can also declare `library: true` to be staged as Lua/include dependencies.

The full `CatalogEntry` schema is documented in the [Catalog Manifest](./catalog-manifest) reference.

```yaml
catalog:
  shared-types:
    description: "Shared Types"
    source: "git@github.com:org/shared-types.git"
    library: true
```

## `interface`

A declarative input contract describing what prompts and switches the archetype expects. It does not replace the Lua script — it lets external tooling (web portals, MCP agents, documentation generators) build input forms without running the script. See also [Authoring Archetypes: Interface](../authoring-archetypes/interface).

The interface may live inline under `interface:` in the manifest, or in a sibling file. The file is searched in priority order:

| Priority | File |
|---|---|
| 1 | `interface.yaml` |
| 2 | `interface.yml` |

**If an interface file exists, it takes precedence over an inline `interface:` section.**

### Top-Level Interface Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `mode` | `batch` \| `interactive` | `interactive` | How clients should interact. `batch`: all required inputs are declared, clients may submit all answers at once. `interactive`: the script may branch or prompt dynamically; clients should use the prompt-by-prompt protocol. |
| `prompts` | list of Prompt | `[]` | Declared prompts, in display order. |
| `switches` | list of Switch | `[]` | Declared switches (boolean flags, never prompted for). |
| `groups` | list of Group | — | Optional grouping of prompts for UI layout. |

### Prompt

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | string | yes | Answer key — must match what the Lua script prompts for. |
| `type` | enum | yes | One of `text`, `int`, `bool`, `select`, `multiselect`, `list`, `editor`. |
| `label` | string | yes | Human-readable label. |
| `help` | string | no | Help text / description. |
| `placeholder` | string | no | Placeholder hint for text-like inputs. |
| `required` | boolean | no (default `true`) | Whether the input is required. |
| `default` | any | no | Default value (type depends on `type`). |
| `defaults` | list of strings | no | Default selections for `multiselect`/`list` prompts. |
| `options` | list of Option | no | Options for `select`/`multiselect` prompts. |
| `min` | integer | no | Minimum value/length/items (meaning depends on `type`). |
| `max` | integer | no | Maximum value/length/items (meaning depends on `type`). |
| `validation` | string | no | Regex validation pattern (`text` prompts only). |

### Option

Options support two YAML forms:

- **Short form** — a plain string; value and label are identical: `- sqlite`
- **Long form** — a map:

| Field | Type | Required | Description |
|---|---|---|---|
| `value` | string | yes | The value submitted when chosen. |
| `label` | string | yes | Display label. |
| `help` | string | no | Per-option help text. |

### Switch

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | string | yes | Switch name — passed to `archetype.switches.is_enabled()`. |
| `label` | string | yes | Human-readable label. |
| `help` | string | no | Description of what the switch enables. |
| `default` | boolean | no (default `false`) | Default state. |

### Group

| Field | Type | Required | Description |
|---|---|---|---|
| `label` | string | yes | Display label for the group. |
| `keys` | list of strings | yes | Prompt keys belonging to this group, in display order. |

## Full Annotated Example

```yaml
# archetype.yaml — canonical v3 manifest name
description: "Rust gRPC Service"          # shown in menus and search
summary: "Production-ready Tonic service" # longer text for search/indexing
authors: ["Platform Team"]
languages: ["Rust"]
frameworks: ["Tonic"]
tags: ["service", "grpc"]

requires:
  archetect: "3.0.0"                      # minimum Archetect version

templating:
  undefined: strict                       # error on undefined variables
  trim_blocks: true                       # Jinja-style whitespace control
  lstrip_blocks: true

# Dependencies and sub-archetypes — see the Catalog Manifest reference
catalog:
  inflect-helpers:
    description: "Casing helpers"
    source: "git@github.com:org/inflect-helpers.git"
    library: true                         # staged for require() and {% include %}
    show: false                           # hidden from interactive menus

# Declarative input contract for external tooling
interface:
  mode: batch                             # flat prompt flow, form-friendly
  prompts:
    - key: project_name
      type: text
      label: "Project Name"
      help: "Used for directory and package name"
      placeholder: "my-project"
      validation: "^[a-z][a-z0-9-]*$"
    - key: database
      type: select
      label: "Database"
      options:
        - value: postgres
          label: "PostgreSQL"
          help: "Recommended for production"
        - sqlite                          # short form: value == label
      default: postgres
    - key: port
      type: int
      label: "Server Port"
      default: 8080
      min: 1024
      max: 65535
  switches:
    - key: with_ci
      label: "Include CI/CD"
      help: "Generates GitHub Actions workflows"
  groups:
    - label: "Project"
      keys: [project_name, port]
    - label: "Database"
      keys: [database]
```
