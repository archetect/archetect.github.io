---
sidebar_position: 5
---

# Configuration

Archetect works with zero configuration — the default catalog and sensible defaults cover the basics. Configuration is how you make it *yours*: your catalogs, your standing answers, your policies.

## Where configuration lives

| Scope | Location | Purpose |
|---|---|---|
| User | `~/.config/archetect/archetect.yaml` | Your catalogs, answers, switches, policies |
| Project | `.archetect.yaml` in a project root | Project-local catalog and settings (auto-detected) |
| Ad hoc | `-c <file>` on any command | Supplement/override for one invocation |

Inspect and edit with the `config` command:

```shell
archetect config defaults   # the built-in defaults, as a starting point
archetect config merged     # everything merged: defaults + files + env + flags
archetect config edit       # open your user config in $EDITOR
```

`config merged` is the first thing to reach for when Archetect isn't behaving as expected — it shows exactly what settings won.

## A representative configuration

```yaml
# ~/.config/archetect/archetect.yaml

catalog:
  archetect:
    description: "Archetect Catalog"
    source: "https://github.com/archetect/archetect-catalog.git"
  acme:
    description: "Acme Platform"
    source: "git@github.com:acme/platform-catalog.git"

answers:
  author_name: "Jane Developer"
  author_email: "jane@example.com"

switches:
  - github-actions
```

See [Configuration Files](../reference/configuration) for the complete schema.

## Project configuration

Drop a `.archetect.yaml` in a project root and Archetect picks it up automatically when run inside that project. The most common use is a project-local catalog of generators:

```yaml
# .archetect.yaml
catalog:
  default:
    description: "Project Generators"
    catalog:
      module:
        description: "Add a module"
        source: "git@github.com:acme/module-archetype.git"
```

Now `archetect` inside the project offers project-specific scaffolding. (Reach the global catalog with `archetect global`.)

## Offline mode

```shell
archetect --offline render <source>     # or ARCHETECT_OFFLINE=true
```

Offline mode uses only local directories and already-cached sources — nothing is fetched. Pre-warm the cache with `archetect cache pull` before going offline; see [Cache & System](../reference/cli/cache-and-system).

## Local development checkouts

When you're developing archetypes or catalogs, you don't want renders pulling from git — you want your working copy. Configure `locals` and enable with `-l` / `--local`:

```shell
archetect -l render <source>            # or ARCHETECT_LOCAL=true
```

With locals enabled, configured local checkouts are used in place of their remote counterparts wherever they appear — even deep inside catalog trees. See [Configuration Files](../reference/configuration) for the `locals` schema, and [Testing & Debugging](../authoring-archetypes/testing-and-debugging) for the authoring workflow.

## Shell execution policy

Archetypes may execute commands (git init, dependency installs). Three policies govern this:

- **prompt** (default) — each command asks for approval interactively
- **allowed** — commands run without asking (`--allow-exec` per invocation, or configured)
- **forbidden** — command execution always fails

Set per-invocation with `-e`/`--allow-exec` or `ARCHETECT_ALLOW_EXEC=true`, or permanently in configuration. In `--headless` runs there is no one to approve prompts, so CI pipelines that render exec-using archetypes need `--allow-exec` explicitly — an intentional speed bump.

## Environment variables

Most mode flags have environment equivalents, useful in CI:

| Variable | Equivalent |
|---|---|
| `ARCHETECT_OFFLINE` | `-o` / `--offline` |
| `ARCHETECT_HEADLESS` | `--headless` |
| `ARCHETECT_DRY_RUN` | `-n` / `--dry-run` |
| `ARCHETECT_ALLOW_EXEC` | `-e` / `--allow-exec` |
| `ARCHETECT_LOCAL` | `-l` / `--local` |
| `ARCHETECT_FORCE_UPDATE` | `-U` / `--force-update` |
