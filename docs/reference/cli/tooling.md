---
sidebar_position: 5
---

# Tooling Commands

Developer tooling: IDE integration, shell completions, and AI agent integration.

## ide setup

```text
archetect ide setup
```

Sets up IDE support for authoring Lua archetypes:

1. **Installs Lua type annotations** (`archetect.lua` and `archetect_modules.lua`)
   into the Archetect data directory:
   `~/.local/share/archetect/lua/annotations`. These give lua-language-server
   (LuaLS) autocompletion and type checking for the `archetect.*` API.

2. **Creates a `.luarc.json`** in the current directory *if* it looks like a Lua
   archetype — i.e. it contains both an archetype manifest (`archetype.yaml`,
   `archetype.yml`, `archetect.yaml`, or `archetect.yml`) and an `archetype.lua`.
   The generated file sets the Lua runtime to 5.4 and points `workspace.library` at
   the installed annotations:

   ```text
   {
     "runtime.version": "Lua 5.4",
     "workspace.library": [
       "/home/jane/.local/share/archetect/lua/annotations"
     ]
   }
   ```

   The write is idempotent: if an existing `.luarc.json` is byte-identical, nothing
   happens; if it is missing or differs (for example, the annotations directory
   moved), it is rewritten. A manifest without an `archetype.lua` skips the
   `.luarc.json` step with a notice.

Run it once per machine to install annotations, and again inside each archetype
directory you author. [`archetect check`](cache-and-system#check) reports whether the
annotations are installed.

## completions

```text
archetect completions <shell>
```

Generates a shell completion script on stdout.

| Argument | Values |
|---|---|
| `<shell>` | `bash`, `elvish`, `fish`, `powershell`, `zsh` |

```shell
# bash
archetect completions bash > ~/.local/share/bash-completion/completions/archetect

# zsh (put on your fpath)
archetect completions zsh > "${fpath[1]}/_archetect"

# fish
archetect completions fish > ~/.config/fish/completions/archetect.fish
```

## mcp

```text
archetect mcp
```

Starts an MCP (Model Context Protocol) server on **stdio**, exposing Archetect to AI
agents such as Claude Code. This is not meant to be run interactively — configure it
in your agent's MCP server settings:

```text
{
  "mcpServers": {
    "archetect": {
      "command": "archetect",
      "args": ["mcp"]
    }
  }
}
```

In MCP mode, the shell execution policy is forced to **Forbidden** — archetypes cannot
execute commands, and there is no flag or environment variable to override this.
