---
sidebar_position: 5
---

# Catalog Manifest

A catalog is a manifest with a `catalog:` section — a map of named entries. Catalog entries appear in three places, all with identical schema:

- the `catalog:` section of an [archetype manifest](./archetype-manifest) (`archetype.yaml`)
- the `catalog:` section of the [tool configuration](./configuration) (`archetect.yaml` / project `.archetect.yaml`)
- nested inside other catalog entries (groups)

See [Using Catalogs](../user-guide/using-catalogs) for usage and [Authoring Catalogs](../authoring-catalogs/) for a guide.

## Entry Kinds

Each entry is exactly **one** of three kinds, determined by which field it sets. The three kind fields are **mutually exclusive** — setting more than one is a validation error.

| Kind | Discriminating field | Behavior |
|---|---|---|
| **Leaf** | `source` | A renderable archetype (or a delegate pointing at another catalog repo). Selecting it resolves the source and renders it. |
| **Group** | `catalog` | A submenu of nested entries. Selecting it recurses. |
| **Server** | `server` | A federated remote — the entry behaves as a group whose children are fetched on demand from a remote archetect server, and renders are dispatched over gRPC. |

## Entry Properties

| Field | Type | Default | Description |
|---|---|---|---|
| `description` | string | entry name | Display text in menus. Falls back to the entry's map key when omitted. |
| `source` | string | — | Source reference (git URL or local path) — makes this a **leaf**. |
| `catalog` | map of CatalogEntry | — | Nested entries — makes this a **group**. |
| `server` | map | — | Remote server pointer — makes this a **server** entry. See [Server Entries](#server-entries). |
| `answers` | map | — | Pre-configured answers passed to the rendered archetype. |
| `switches` | list of strings | — | Pre-configured [switches](../user-guide/switches) overlaid onto the inherited set — `name` enables, `name=false` disables; unmentioned switches pass through. |
| `use_defaults` | list of strings | — | Prompt keys that should use their default values without prompting. Overlaid onto the inherited set like `switches` (`key=false` removes). |
| `use_defaults_all` | boolean | — | Use defaults for all prompts that have them. `true` and `false` both apply, overriding the inherited value. |
| `library` | boolean | `false` | Eagerly resolve at archetype load time and stage the entry's `lib/` and `includes/` — see [`library: true`](#library-true). |
| `show` | boolean | `true` | Whether the entry appears in interactive menus — see [`show: false`](#show-false). |

`library` and `show` are **completely independent** flags: `library: true` does *not* imply `show: false`. A library can also appear in menus, and a hidden entry does not have to be a library.

## `library: true`

Declares the entry as a **dependency** of the consuming archetype:

- The entry is **eagerly resolved** when the consuming archetype loads (before any script runs), rather than lazily on use.
- The resolved archetype's `lib/` directory is staged under the entry's local name and prepended to the Lua `package.path`, so `require("<entry-name>.module")` resolves to the library's `lib/module.lua`.
- The resolved archetype's `includes/` directory is staged the same way and added to the ATL include search list, so `{% include "<entry-name>/header.atl" %}` works in templates.
- Library dependencies are resolved **transitively** — a library's own `library: true` entries are staged too.

Staging lives under the Archetect cache directory and is cleared and rebuilt at the start of every render, so a freshly updated library source is automatically picked up. See [Archetype Layout](./archetype-layout) for the `lib/` and `includes/` conventions.

```yaml
catalog:
  inflect-helpers:
    source: "git@github.com:org/inflect-helpers.git"
    library: true
```

```lua
-- archetype.lua of the consumer
local casing = require("inflect-helpers.casing")
```

## `show: false`

Hides the entry from interactive `catalog.render()` menus. The entry remains **fully resolvable by name** from scripts — e.g. `catalog.render("name")` — making it useful for private sub-archetypes and dependencies that a script invokes explicitly but that should not clutter user-facing menus.

## Server Entries

A server entry points at a remote archetect server. Only `endpoint` is required; TLS settings fall back to the top-level `client.tls` section of [`archetect.yaml`](./configuration) when omitted here.

| Field | Type | Required | Description |
|---|---|---|---|
| `server.endpoint` | string | yes | Server URL, e.g. `https://archetect.acme.corp:8443`. |
| `server.tls` | map | no | Per-entry TLS overrides. |
| `server.tls.ca` | path | no | CA certificate to trust for the server. |
| `server.tls.client_cert` | path | no | Client certificate (mTLS). |
| `server.tls.client_key` | path | no | Client private key (mTLS). |
| `server.tls.domain` | string | no | Expected TLS server name, when it differs from the endpoint host. |

## Example

A catalog manifest combining groups, leaves, a hidden library, and a federated server:

```yaml
description: "Acme Platform"
summary: "Service archetypes for Acme"
authors: ["Platform Team"]

requires:
  archetect: "3.0.0"

catalog:
  services:                                    # group — submenu
    description: "Backend Services"
    catalog:
      grpc:                                    # leaf — renders an archetype
        description: "gRPC Service"
        source: "git@github.com:org/rust-grpc.git"
        answers:
          framework: Tonic                     # pre-configured answer
        switches: ["with-health-check"]        # pre-enabled switch
      rest:
        description: "REST Service"
        source: "git@github.com:org/rust-rest.git"
        use_defaults_all: true                 # accept all prompt defaults

  frontends:                                   # leaf delegating to another catalog repo
    description: "Frontend Applications"
    source: "git@github.com:org/catalog-frontends.git"

  shared-types:                                # library dependency, hidden from menus
    description: "Shared Types"
    source: "git@github.com:org/shared-types.git"
    library: true
    show: false

  internal:                                    # federated remote catalog
    description: "Acme Internal (remote)"
    server:
      endpoint: "https://archetect.acme.corp:8443"
      tls:
        ca: "/etc/archetect/acme-ca.crt"
        domain: archetect.acme.corp
```
