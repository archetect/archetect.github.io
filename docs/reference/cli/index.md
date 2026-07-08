---
sidebar_position: 1
sidebar_label: CLI
---

# CLI Reference

Complete reference for the `archetect` command-line interface (v3.0.0).

## Usage

```text
archetect [OPTIONS] [action] [destination-pos] [COMMAND]
```

Archetect's first positional argument is an **action** — either a slash-separated
catalog path (e.g. `archetect/rust/cli/clap-cli`) or a named action defined in your
global or project-local `.archetect.yaml`. It defaults to `default`. If you supply no
action and `default` isn't a catalog entry, Archetect presents the resolved catalog as
an interactive menu.

The optional second positional (`destination-pos`) is the directory to render into. It
overrides the `--destination` / `--dest` flag when both are supplied; when neither is
given, output goes to the current directory (`.`).

```shell
# Present the catalog menu, render into the current directory
archetect

# Render a specific catalog entry into ./my-tool
archetect archetect/rust/cli/clap-cli my-tool
```

See [Catalog Commands](catalog-commands) for details on the action form, and
[render](render) for rendering an archetype from an explicit source.

## Commands

| Command | Description |
|---|---|
| [`render`](render) | Render an Archetype from a directory or git URL |
| [`global`](catalog-commands#global) | Run a catalog action from the global config, bypassing any project `.archetect.yaml` |
| [`ls`, `list`](catalog-commands#ls) | List the resolved catalog tree |
| [`search`, `find`](catalog-commands#search) | Search the resolved catalog by keyword |
| [`config`](config) | Manage Archetect's configuration (`merged`, `defaults`, `edit`) |
| [`cache`](cache-and-system#cache) | Manage the archetype/catalog cache (`clear`, `pull`, `invalidate`) |
| [`system`](cache-and-system#system-layout) | Show Archetect system information (`layout`) |
| [`check`](cache-and-system#check) | Check Archetect's environment for problems |
| [`ide`](tooling#ide-setup) | IDE integration tools (`setup`) |
| [`completions`](tooling#completions) | Generate shell completions |
| [`mcp`](tooling#mcp) | Start an MCP stdio server for AI agent integration |
| [`server`](server-modes#server) | Start an Archetect gRPC server |
| [`connect`](server-modes#connect) | Connect to an Archetect server |
| `help` | Print help for archetect or a subcommand |

## Global options

These options are available at the top level and on the rendering subcommands
(`render`, `global`, `connect`, `config`). Informational subcommands (`ls`, `search`,
`check`, `ide`, `system`, `completions`) accept only `-v` and `-c` directly; place other
flags before the subcommand (e.g. `archetect -o ls`) or set the corresponding
environment variable.

| Flag | Env | Default | Description |
|---|---|---|---|
| `--destination <dir>`, `--dest <dir>` | | `.` | The directory to render the Archetype into. An explicit destination positional wins over this flag. |
| `-a`, `--answer <key=value>` | | | Supply a key=value answer to a prompt. Repeatable. |
| `-A`, `--answer-file <path>` | | | Supply an answers file in YAML or JSON format. Repeatable. |
| `-d`, `--use-default <key>` | | | Use the configured default value for a prompt key. Repeatable; accepts comma-delimited lists. `<key>=false` unsets an inherited one. |
| `-D`, `--use-defaults-all` | | off | Use configured defaults for all prompts without explicit answers. |
| `-s`, `--switch <name>` | | | Enable a switch that may trigger functionality within archetypes. Repeatable. `<name>=false` disables a switch enabled by configuration. |
| `-o`, `--offline` | `ARCHETECT_OFFLINE` | off | Only use directories and already-cached remote git URLs. |
| `-e`, `--allow-exec [true\|false]` | `ARCHETECT_ALLOW_EXEC` | `false` | Allow archetypes to execute arbitrary commands. Bare `-e` means `true`. Prints a prominent warning when enabled. |
| `--headless` | `ARCHETECT_HEADLESS` | off | Expect all inputs to be resolved by answers, defaults, and optional values; never wait on interactive input. |
| `-l`, `--local` | `ARCHETECT_LOCAL` | off | Use local development checkouts where available and configured. |
| `-U`, `--force-update` | `ARCHETECT_FORCE_UPDATE` | off | Force updates for all catalogs and archetypes when rendering. |
| `-n`, `--dry-run` | `ARCHETECT_DRY_RUN` | off | Show what would be rendered without writing files to disk. |
| `-v`, `--verbose` | | | Increase verbosity. Repeatable (`-vv`, `-vvv`). |
| `-c`, `--config-file <config>` | | | Supply an additional configuration file to supplement or override user/default configuration. |
| `-h`, `--help` | | | Print help. |
| `-V`, `--version` | | | Print version. |

## Answer value syntax

Answers supplied with `-a` are parsed as YAML, giving them the same type semantics as
[answer files](../answer-files):

```shell
archetect -a count=42 ...                    # Integer
archetect -a price=1.5 ...                   # Float
archetect -a active=true ...                 # Boolean
archetect -a name=hello ...                  # String
archetect -a 'phone="5551234"' ...           # String (YAML-quoted to prevent Integer)
archetect -a 'tags=[a, b]' ...               # Array
archetect -a 'db={host: localhost}' ...      # Map
archetect -a db.host=localhost ...           # Nested Map via dotted key
```

Multi-word values need shell quoting:

```shell
archetect -a description='A multi-word value' ...
```

## Configuration

Archetect merges configuration from built-in defaults, the user config file, `etc.d`
drop-ins, a project-local config, `-c` files, environment variables, and CLI flags.
See [Configuration Files](../configuration) for the file format and
[config](config) for inspecting the merged result.
