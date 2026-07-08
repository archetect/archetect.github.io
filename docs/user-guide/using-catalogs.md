---
sidebar_position: 2
---

# Using Catalogs

Catalogs turn a pile of archetype URLs into an organized, browsable menu. Archetect ships configured with the default [Archetect Catalog](https://github.com/archetect/archetect-catalog), and you can add your own.

## Browsing interactively

Run Archetect with no arguments to open your configured catalog as a menu:

```shell
archetect
```

Arrow keys navigate, Enter selects. Groups (📂) drill into submenus; archetypes (📦) start rendering.

## Listing the tree

```shell
archetect ls
```

```text
  📂 archetect — Archetect Catalog
    📂 rust — Rust Ecosystem
      📂 cli — Command-line Applications
        📦 clap-cli — Rust CLI application (clap derive, xtask workflow)
      📦 xtask — xtask crate
```

Three icons appear in listings:

| Icon | Kind | Meaning |
|---|---|---|
| 📂 | Catalog | A navigation node — drill deeper |
| 📦 | Archetype | Renderable |
| 🧩 | Component | A building block used by other archetypes (hidden unless `-a`) |

`ls` resolves the full tree, fetching any catalogs it hasn't seen yet (add `-o` before the subcommand — `archetect -o ls` — to stay on cache only). Pass a path to focus on a subtree (`archetect ls archetect/rust`), and `-a` to include hidden components.

## Searching

```shell
archetect search rust cli
```

Search is full-text across entry names, descriptions, paths, and metadata (languages, frameworks, tags), with AND semantics — every term must match. Use `-a` to include hidden entries.

## Dispatching by path

Every path segment `ls` prints is directly runnable — no menu required:

```shell
archetect archetect/rust/cli/clap-cli ~/projects
```

This is the fastest route once you know your catalog. All the render flags work here too (`-a`, `-A`, `-s`, `--dry-run`, …).

## Project catalogs

A project can carry its own catalog in a `.archetect.yaml` file at its root. When you run `archetect` inside such a project, the *project's* catalog takes over — teams use this to offer project-specific generators (add a module, add an endpoint, add a migration) right where they're needed.

To reach the global catalog from inside such a project, use `global`:

```shell
archetect global                       # global catalog menu
archetect global archetect/rust/xtask  # dispatch into the global catalog
```

## Adding catalogs to your configuration

Catalog entries live in your `archetect.yaml` (`~/.config/archetect/archetect.yaml` — edit with `archetect config edit`):

```yaml
catalog:
  archetect:
    description: "Archetect Catalog"
    source: "https://github.com/archetect/archetect-catalog.git"
  acme:
    description: "Acme Platform Catalog"
    source: "git@github.com:acme/platform-catalog.git"
```

Each top-level key becomes a root entry in your menu and a path prefix for dispatch (`archetect acme/services/grpc`). See [Configuration Files](../reference/configuration) for the full schema, and [Authoring Catalogs](../authoring-catalogs/) to build catalogs of your own.
