---
sidebar_position: 9
---

# Utility Modules

Beyond prompting and rendering, archetypes lean on a toolbox of utilities — some global, some loaded with `require("archetect.*")`.

## Serialization: `format`

Convert between Lua tables (or Contexts) and JSON/YAML/TOML:

```lua
-- Serialize
local yaml = format.to_yaml(context)
local json = format.to_json({ name = "billing", port = 8080 })

-- Parse
local config = format.from_toml(file.read("data/defaults.toml"))
context:merge(config)
```

The load-defaults pattern — ship structured data with your archetype instead of hardcoding it in Lua:

```lua
if file.exists("data/defaults.yaml") then
  context:merge(format.from_yaml(file.read("data/defaults.yaml")))
end
```

## Messaging: `log` and `output`

```lua
log.info("Rendering service module")     -- to the log stream (verbosity-controlled)
log.debug(tostring(context))             -- diagnostic detail

output.print("Created " .. name)         -- always shown to the user
output.banner("Next steps")              -- prominent banner
```

Use `log` for *what the archetype is doing* (debuggability) and `output` for *what the user should read* (next steps, important notices).

## Early exit

```lua
if not context:get("proceed") then
  output.print("Nothing to do.")
  exit()                                 -- clean termination, not an error
end
```

## Shell commands: `archetect.shell`

```lua
local shell = require("archetect.shell")

shell.run("cargo", { "fmt" }, { cwd = project_dir })
local rustc = shell.capture("rustc", { "--version" })
```

`run` streams output and raises on failure; `capture` returns trimmed stdout. Both accept `cwd` and `env` options.

:::warning Execution is gated
Shell execution is governed by the user's security policy — **prompt** for approval per command by default, with `--allow-exec` / configuration to pre-approve and `forbidden` to block. Design archetypes so command execution is a finishing touch, not a requirement; and remember headless CI runs need `--allow-exec` explicitly.
:::

## Git: `archetect.git`

The classic finishing move — leave the generated project as a ready git repository:

```lua
local git = require("archetect.git")

local repo = git.init(project_dir, { branch = "main" })
repo:add_all()
repo:commit("initial commit")
```

`git.init` defaults the initial branch to `main` (deterministic across machines, whatever the host's git config says). The returned handle also offers `add(patterns)` (string or list), `branch(name)`, `checkout(name)`, `remote_add(name, url)`, and `push(remote, branch)`.

## GitHub: `archetect.github`

```lua
local github = require("archetect.github")

if not github.repo_exists("acme/billing-service") then
  local result = github.create_repo("acme/billing-service", { visibility = "private" })
  if result.empty then
    repo:remote_add("origin", "git@github.com:acme/billing-service.git")
    repo:push("origin", "main")
  end
end
```

Authentication uses the `GITHUB_TOKEN` environment variable, falling back to `gh auth token` if the GitHub CLI is logged in. `create_repo` reports `{ created, empty }` so scripts can decide whether pushing is safe.

## Archives: `archetect.archive`

```lua
local archive = require("archetect.archive")

archive.zip("dist", "release.zip")        -- also: tar_gz, tar
```

Paths resolve relative to the render destination.

## Your own modules

Anything in the archetype's `lib/` directory is `require`-able:

```lua
-- lib/naming.lua
local M = {}
function M.artifact_id(org, name) return org .. "-" .. name end
return M
```

```lua
-- archetype.lua
local naming = require("naming")
context:set("artifact_id", naming.artifact_id(org, name))
```

Shared across archetypes, this same mechanism becomes [Libraries](./libraries).

Full signatures for everything here: [format, log & output](../../reference/lua-api/format-log-output) and [shell, git, github & archive](../../reference/lua-api/shell-git-github-archive).
