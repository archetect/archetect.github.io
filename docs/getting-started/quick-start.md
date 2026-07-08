---
sidebar_position: 4
---

# Quick Start

Let's generate a real project. Out of the box, Archetect is configured with a default catalog — the [Archetect Catalog](https://github.com/archetect/archetect-catalog) — containing ready-to-use archetypes.

## Browse the catalog

See what's available with `ls`:

```shell
archetect ls
```

```text
  📂 archetect — Archetect Catalog
    📂 rust — Rust Ecosystem
      📂 cli — Command-line Applications
        📦 clap-cli — Rust CLI application (clap derive, xtask workflow)
      📂 ai — AI/ML Applications
        📦 rust-agentic — Rust Agentic (MCP/Agent)
      📦 xtask — xtask crate
    📂 common — Common / Utility
```

Two entry kinds matter here: 📂 **catalogs** are navigation nodes, and 📦 **archetypes** are renderable. Every indented path is dispatchable — more on that below.

You can also search across names, descriptions, and tags:

```shell
archetect search rust cli
```

## Generate interactively

Run `archetect` with no arguments to open the catalog as an interactive menu:

```shell
archetect
```

Navigate with the arrow keys, select with Enter, and drill down until you reach an archetype. From there, Archetect starts asking questions. A session for the Rust CLI archetype looks something like this:

```text
Organization Name: acme
Project Name: hello
Author: Jane Developer <jane@example.com>
Publish to GitHub? no
```

Each prompt may offer a default (press Enter to accept), help text, and validation. When the prompts finish, the archetype renders — and typically does more than write files: this one also initializes a git repository and makes an initial commit.

## Explore what was generated

```shell
cd hello
cargo run
```

Take a moment to look around: the project name you entered appears — correctly cased — in directory names, `Cargo.toml`, module declarations, and documentation. That's Archetect's case expansion at work: you typed the name once.

## Generate by path

Menus are for discovery. Once you know where an archetype lives, dispatch to it directly using its catalog path, with an optional destination directory:

```shell
archetect archetect/rust/cli/clap-cli ~/projects
```

This is the same path structure `archetect ls` prints.

## Generate from a git URL

Archetypes don't need to be in a catalog at all. `archetect render` takes any archetype source — a git URL or a local directory:

```shell
archetect render https://github.com/your-org/your-archetype.git my-project
```

The first render clones the source into Archetect's cache (`~/.cache/archetect`); later renders reuse the cache. Force a refresh with `-U` / `--force-update`, or run entirely from cache with `-o` / `--offline`.

## Generate without prompts

Every prompt can be answered from the command line — essential for scripts and CI:

```shell
archetect render https://github.com/your-org/your-archetype.git my-project \
  -a project_name=hello \
  -a "description=A friendly greeting service" \
  --headless
```

- `-a key=value` answers a single prompt.
- `-A answers.yaml` supplies many answers from a YAML or JSON file.
- `-D` accepts the configured default for every unanswered prompt.
- `--headless` guarantees Archetect never blocks waiting for input — any prompt that can't be resolved from answers or defaults becomes an error instead.

See [Answers & Automation](../user-guide/answers-and-automation) for the full story.

## Try a dry run

Not sure what an archetype will do? Preview it without writing anything:

```shell
archetect render https://github.com/your-org/your-archetype.git my-project --dry-run
```

## Next step

You've generated projects from existing archetypes. Now [build one of your own](./your-first-archetype) — it takes about fifteen minutes.
