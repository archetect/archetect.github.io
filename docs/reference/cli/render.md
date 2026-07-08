---
sidebar_position: 1
---

# render

Render an Archetype from an archetype directory or git URL.

## Synopsis

```text
archetect render [OPTIONS] <source> [destination-pos] [action]
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `<source>` | yes | The Archetype source: a local directory or a git URL. |
| `[destination-pos]` | no | Directory to render into. Overrides `--destination` when both are supplied. |
| `[action]` | no | A named action defined by the archetype. Defaults to the archetype's default entry point. |

The destination defaults to the current directory (`.`). Resolution order:
positional destination, then `--destination` / `--dest`, then `.`.

## Options

`render` accepts all [global render options](./#global-options) — answers, defaults,
switches, offline mode, dry-run, and more.

| Flag | Env | Default | Description |
|---|---|---|---|
| `--destination <dir>`, `--dest <dir>` | | `.` | Directory to render into. |
| `-a`, `--answer <key=value>` | | | Answer to a prompt (repeatable, YAML-typed values). |
| `-A`, `--answer-file <path>` | | | YAML/JSON answers file (repeatable). |
| `-d`, `--use-default <key>` | | | Use the configured default for a prompt key. Repeatable; `<key>=false` unsets an inherited one. |
| `-D`, `--use-defaults-all` | | off | Use defaults for all unanswered prompts. |
| `-s`, `--switch <name>` | | | Enable an archetype switch (repeatable). `<name>=false` disables one enabled by configuration. |
| `-o`, `--offline` | `ARCHETECT_OFFLINE` | off | Only use directories and already-cached remote git URLs. |
| `-e`, `--allow-exec [true\|false]` | `ARCHETECT_ALLOW_EXEC` | `false` | Allow archetypes to execute arbitrary commands. |
| `--headless` | `ARCHETECT_HEADLESS` | off | Never wait on interactive input. |
| `-l`, `--local` | `ARCHETECT_LOCAL` | off | Use local development checkouts where configured. |
| `-U`, `--force-update` | `ARCHETECT_FORCE_UPDATE` | off | Force catalog/archetype updates. |
| `-n`, `--dry-run` | `ARCHETECT_DRY_RUN` | off | Show what would be rendered without writing files. |

## Examples

Render from a git URL into the current directory:

```shell
archetect render https://github.com/archetect-rust/clap-cli-archetype.git
```

Render into a specific directory using the positional destination:

```shell
archetect render https://github.com/archetect-rust/clap-cli-archetype.git my-tool
```

Render from a local archetype directory (useful while authoring):

```shell
archetect render ~/projects/archetypes/my-archetype --dest ./out
```

Provide answers and skip remaining prompts with defaults:

```shell
archetect render https://github.com/archetect-rust/clap-cli-archetype.git \
  -a project_name='My Tool' \
  -a 'port=8080' \
  -D
```

Fully non-interactive (CI-friendly) with an answers file and a dry run first:

```shell
archetect render https://github.com/example/service-archetype.git \
  -A answers.yaml --headless -n
```

Enable a switch and force-update cached sources:

```shell
archetect render https://github.com/example/service-archetype.git -s database -U
```

## See also

- [Catalog Commands](catalog-commands) — render by catalog path instead of an explicit source
- [Answer Files](../answer-files) — answers file format
- [Rendering Archetypes](../../user-guide/rendering-archetypes) — user guide
