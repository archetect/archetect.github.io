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

Unknown fields are silently ignored by the parser — a typo'd section will not raise an error, so double-check field names.

## `requires`

| Field | Type | Default | Description |
|---|---|---|---|
| `archetect` | semver version requirement | the running Archetect's own version | Archetect version this archetype needs: major must match; minor/patch is a minimum. |

The value is parsed as a semver version requirement (e.g. `"3.0.0"`) and enforced in two parts:

- **The major version must match exactly.** Major versions of Archetect are strictly separated — an archetype requiring `2.x` renders only with Archetect 2, and one requiring `3.x` only with Archetect 3. Rendering a `2.x` archetype under Archetect 3 fails with an error directing you to the `archetect2` binary.
- **Within the major, the requirement is a minimum.** Archetect 3.1 renders an archetype requiring `"3.0.0"`; Archetect 3.0 fails a `"3.1.0"` requirement with a clear error.

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
  archetect: "3.0.0"                      # major must match; minimum within the major

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

```
