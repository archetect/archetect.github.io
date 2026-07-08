---
sidebar_position: 2
---

# Catalog Commands

Commands for browsing, searching, and dispatching entries from your resolved catalog —
the project's catalog if a project config is detected in the current directory,
otherwise the global one.

## The action form

```text
archetect [OPTIONS] [action] [destination-pos]
```

The bare `archetect` command dispatches against the catalog directly — there is no
separate subcommand for it.

| Argument | Default | Description |
|---|---|---|
| `[action]` | `default` | A slash-separated catalog path (e.g. `archetect/rust/cli/clap-cli`) or a named action defined in global or project-local `.archetect.yaml`. |
| `[destination-pos]` | | Directory to render into. Overrides `--destination` when both are supplied. |

Behavior:

- **No action**: if `default` isn't a catalog entry, the resolved catalog is presented
  as an interactive menu.
- **Path to a catalog group**: presents that group as a submenu.
- **Path to an archetype**: resolves and renders it.

All [global render options](./#global-options) apply.

```shell
# Interactive menu
archetect

# Render a catalog entry into ./my-tool with an answer
archetect archetect/rust/cli/clap-cli my-tool -a project_name='My Tool'

# Drill into a subtree menu
archetect archetect/rust
```

## global

```text
archetect global [OPTIONS] [path] [destination-pos]
```

Runs a catalog action from the **global** configuration, bypassing project config
detection entirely. Useful when you're inside a generated project — whose
`.archetect.yaml` replaces the global catalog — but want to access the global catalog,
for example to bootstrap a sub-project.

| Argument | Default | Description |
|---|---|---|
| `[path]` | `""` | Catalog path to render (slash-separated). Empty presents the global catalog menu. |
| `[destination-pos]` | | Directory to render into. Overrides `--destination`. |

All [global render options](./#global-options) apply.

```shell
# From inside a project: browse the global catalog
archetect global

# Render a global catalog entry into a subdirectory
archetect global archetect/rust/cli/clap-cli tools/my-cli
```

## ls

```text
archetect ls [OPTIONS] [ls-path]        (alias: list)
```

Recursively resolves and prints the catalog tree. Resolving may fetch remote sources
(git clone/fetch, or gRPC for federated `server:` entries); entries that fail to
resolve are logged to stderr and shown as leaves. Run with `archetect -o ls` (or
`ARCHETECT_OFFLINE=1`) to use only cached sources.

Three entry kinds:

- 📦 **Archetype** — renderable (the resolved source has an `archetype.lua`).
- 📂 **Catalog** — navigation node.
- 🧩 **Component** — declared inside an archetype, or marked `show: false` in YAML.
  Hidden by default.

| Argument / Flag | Description |
|---|---|
| `[ls-path]` | Catalog path to drill into (optional). Filters the tree while preserving ancestor context, so every visible indent is a dispatchable path. |
| `-a`, `--all` | Include components, libraries, and entries with `show: false`. |

```shell
archetect ls                         # archetypes + catalogs only
archetect ls -a                      # include components / hidden entries
archetect ls archetect/rust/cli      # filtered to a subtree
```

Example output:

```text
  📂 archetect — Archetect Catalog
    📂 rust — Rust Ecosystem
      📂 cli — Command-line Applications
        📦 clap-cli — Rust CLI application (clap derive, xtask workflow)
      📦 xtask — xtask crate
    📂 common — Common / Utility
      📦 gitignore — Generate a .gitignore file
      📂 starters — Archetype, catalog, library, and component starters
        📦 archetype-starter — Scaffold a new Archetect archetype
```

Federation roots (entries served from a remote Archetect server) are flagged with a
🛰️ icon.

## search

```text
archetect search [OPTIONS] <terms>...   (alias: find)
```

Full-text search across the resolved catalog tree. All terms must match
(**AND semantics**). Matches entry names, descriptions, paths, and metadata fields
such as languages, frameworks, and tags.

| Argument / Flag | Description |
|---|---|
| `<terms>...` | One or more search terms (matched as AND). |
| `-a`, `--all` | Include entries with `show: false`. |

```shell
archetect search rust                # all rust-related entries
archetect search rust cli            # entries matching both terms
archetect search starter -a          # include hidden entries
```

Example output:

```text
  📂 archetect/rust/cli — Command-line Applications
  📦 archetect/rust/cli/clap-cli — Rust CLI application (clap derive, xtask workflow)

2 match(es) for 'rust cli'
```

Result paths are dispatchable directly: `archetect archetect/rust/cli/clap-cli`.

## See also

- [render](render) — render from an explicit source instead of a catalog path
- [Catalog Manifest](../catalog-manifest) — catalog file format
- [Authoring Catalogs](../../authoring-catalogs/) — building your own catalog
