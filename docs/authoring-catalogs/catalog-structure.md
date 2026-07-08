---
sidebar_position: 1
---

# Catalog Structure

A catalog is a tree of named entries under the manifest's `catalog:` key. Each entry is one of three kinds, determined by which field it carries — the kinds are mutually exclusive:

| Kind | Field | Behavior |
|---|---|---|
| **Leaf** | `source` | Renders an archetype (or delegates to another catalog repo) |
| **Group** | `catalog` | A submenu of nested entries |
| **Remote** | `server` | A federated subtree served by a remote Archetect server |

```yaml
catalog:
  services:                    # group
    description: "Backend Services"
    catalog:
      grpc:                    # leaf
        description: "gRPC Service"
        source: "git@github.com:acme/rust-grpc-archetype.git"
  partner:                     # remote (federated)
    description: "Partner Platform"
    server:
      endpoint: "https://archetect.partner.example:8443"
```

Entry names become path segments: the `grpc` leaf above is `services/grpc`, dispatched as `archetect acme/services/grpc` (prefixed by the catalog's name in the user's configuration).

## Entry properties

| Property | Type | Default | Purpose |
|---|---|---|---|
| `description` | string | entry name | Menu and search text |
| `source` | string | — | Archetype source: git URL or local path (leaf) |
| `catalog` | map | — | Nested entries (group) |
| `server` | map | — | `endpoint` + optional `tls` (federated remote) |
| `answers` | map | — | Pre-configured answers passed to the archetype |
| `switches` | list | — | Pre-enabled switches, overlaid onto the inherited set (`name=false` disables one) |
| `use_defaults` | list | — | Prompt keys that silently accept their defaults |
| `use_defaults_all` | bool | — | Accept defaults for all unanswered prompts |
| `library` | bool | `false` | Stage this entry's `lib/` and `includes/` at load time (see [Libraries](../authoring-archetypes/scripting/libraries)) |
| `show` | bool | `true` | Visibility in interactive menus |

## Pre-configuring entries

`answers`, `switches`, and `use_defaults*` let one archetype serve many menu items:

```yaml
catalog:
  grpc-service:
    description: "gRPC Service"
    source: "git@github.com:acme/rust-grpc-archetype.git"
  grpc-service-lite:
    description: "gRPC Service (minimal, no extras)"
    source: "git@github.com:acme/rust-grpc-archetype.git"
    answers:
      features: []
    use_defaults_all: true
```

Entry answers are authoritative — they override even `-a` flags — so a pre-configured entry always means what its curator intended.

## Hidden entries

`show: false` removes an entry from menus while keeping it script-addressable — the standard marking for components and libraries that other archetypes compose but humans shouldn't render directly:

```yaml
catalog:
  org-prompts:
    description: "Organization prompt component"
    source: "git@github.com:acme/org-prompts-component.git"
    show: false
```

Hidden entries still appear in `archetect ls -a` / `search -a` (that's what the flag is for).

## Descriptions and metadata matter

Catalog manifests carry the same metadata as any archetype — `description`, `summary`, `languages`, `frameworks`, `tags` — and `archetect search` indexes all of it, along with each entry's description. Well-described entries are the difference between a searchable catalog and a junk drawer.

Full schema: [Catalog Manifest reference](../reference/catalog-manifest).
