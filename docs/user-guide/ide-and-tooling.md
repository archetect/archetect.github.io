---
sidebar_position: 6
---

# IDE & Tooling

Quality-of-life tooling: editor support for archetype authors, shell completions, environment diagnostics, and cache management.

## IDE support for Lua archetypes

Archetect ships complete type annotations for its Lua API. With the [Lua Language Server](https://luals.github.io/) (available for VS Code, Neovim, JetBrains IDEs, and more), you get autocomplete, hover documentation, and error checking for every Archetect function.

One-time install:

```shell
archetect ide setup
```

This installs the annotation files into Archetect's data directory (`~/.local/share/archetect/lua/annotations`). Run it again from *inside an archetype directory* (one containing `archetype.yaml`) and it also writes a `.luarc.json` pointing the Lua Language Server at the annotations:

```shell
cd my-archetype
archetect ide setup
```

The command is safe to re-run: annotations are refreshed every time, and an existing `.luarc.json` is only rewritten when its content is out of date. Re-run it after upgrading Archetect to pick up new API annotations.

## Shell completions

```shell
# zsh
archetect completions zsh > ~/.zfunc/_archetect

# bash
archetect completions bash > /etc/bash_completion.d/archetect

# fish
archetect completions fish > ~/.config/fish/completions/archetect.fish
```

Supported shells: `bash`, `zsh`, `fish`, `powershell`, `elvish`.

## Environment diagnostics

```shell
archetect check
```

Checks git availability and identity, cache writability, the shell-execution policy, IDE annotations, and `GITHUB_TOKEN` (needed only by archetypes that use the GitHub module). Run it whenever something feels off — it's fast and specific.

## System paths

```shell
archetect system layout
```

Prints where Archetect reads and writes:

```text
Etc Directory:   ~/.config/archetect
Etc.d Directory: ~/.config/archetect/etc.d
Cache Directory: ~/.cache/archetect
Data Directory:  ~/.local/share/archetect
```

## Cache management

```shell
archetect cache pull           # pre-fetch everything reachable from your catalog
archetect cache pull <source>  # pre-fetch everything reachable from a source
archetect cache invalidate     # mark cached entries stale (re-fetch on next use)
archetect cache clear          # remove cached repositories (asks for confirmation)
```

`cache pull` is the "before the flight" command; `-U` on any render is the "just refresh this one" alternative.

## MCP server for AI agents

```shell
archetect mcp
```

Starts a stdio [Model Context Protocol](https://modelcontextprotocol.io/) server, letting AI coding agents browse your catalogs and render archetypes with structured inputs. Point your MCP-capable client at the command above.
