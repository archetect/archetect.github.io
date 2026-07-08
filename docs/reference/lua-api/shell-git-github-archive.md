---
sidebar_position: 6
---

# shell, git, github & archive

Four `require()` modules cover side effects beyond template rendering: subprocesses, git repositories, GitHub, and archives. See also the [Utility Modules guide](../../authoring-archetypes/scripting/utility-modules).

```lua
local shell   = require("archetect.shell")
local git     = require("archetect.git")
local github  = require("archetect.github")
local archive = require("archetect.archive")
```

:::note Dry-run behavior
Under `--dry-run`, all of these modules log a `[dry-run] <action>` message and skip the actual side effect. `shell.capture` returns an empty string; `github.create_repo` synthesizes a success result so scripts follow their happy path.
:::

## `archetect.shell`

Run arbitrary subprocesses. Both functions are gated by the [shell-execution security policy](#shell-execution-security-model).

### `shell.run(program, args, opts)`

```lua
shell.run(program, args?, opts?)
```

Runs a command, streaming its stdout and stderr through Archetect's logging as info-level lines. **Raises an error** if the command cannot be started or exits non-zero.

| Parameter | Type | Description |
|---|---|---|
| `program` | `string` | The program to run |
| `args` | `string[]?` | Command arguments |
| `opts.cwd` | `string?` | Working directory (default: the render destination) |

**Returns:** nothing.

```lua
shell.run("cargo", { "fmt" })
shell.run("npm", { "install" }, { cwd = context:get("project-name") })
```

### `shell.capture(program, args, opts)`

```lua
shell.capture(program, args?, opts?) --> string
```

Runs a command and captures its stdout. **Raises an error** (including the command's stderr) on failure.

| Parameter | Type | Description |
|---|---|---|
| `program` | `string` | The program to run |
| `args` | `string[]?` | Command arguments |
| `opts.cwd` | `string?` | Working directory (default: the render destination) |

**Returns:** captured stdout, trimmed of surrounding whitespace.

```lua
local user = shell.capture("git", { "config", "user.name" })
context:set("author", user)
```

### Shell-execution security model

Archetype scripts come from the internet; letting them run arbitrary commands is a real risk. `shell.run` and `shell.capture` are therefore gated by a configurable policy:

| Policy | Behavior |
|---|---|
| `prompt` | **Default.** Every call displays the exact command and working directory, then asks the user for approval (defaulting to *No*). Denial fails the call. In headless mode the prompt cannot be answered, so the call fails. |
| `allowed` | Calls run unconditionally, without prompting. |
| `forbidden` | Calls always fail immediately (used by MCP server mode). |

How to set it:

- **CLI flag:** `--allow-exec` sets the policy to `allowed` for that invocation.
- **Environment:** `ARCHETECT_ALLOW_EXEC` does the same.
- **Configuration:** in the `security` section of your [configuration](../configuration) — `security.shell_exec_policy: prompt | allowed | forbidden`, or the legacy boolean `security.allow_exec: true | false` (true → allowed, false → prompt).

`archetect check` reports the resolved policy, e.g. `Shell execution policy: Prompt — scripts must request approval per command (default)`.

## `archetect.git`

### `git.init(path, opts)`

```lua
git.init(path?, opts?) --> GitRepo
```

Initializes a git repository and returns a handle for further operations.

| Parameter | Type | Description |
|---|---|---|
| `path` | `string?` | Path relative to the render destination. Defaults to the destination root. |
| `opts.branch` | `string?` | Initial branch name. Defaults to `"main"` (passed as `git init -b main`, so results are deterministic regardless of the machine's `init.defaultBranch`). |

**Returns:** `GitRepo`. Raises on failure.

### `GitRepo` methods

All methods run the corresponding `git` command in the repository directory, raise on non-zero exit, and return nothing. Per-file chatter is logged at debug level; stderr surfaces as warnings.

| Method | Git equivalent | Description |
|---|---|---|
| `repo:add(patterns)` | `git add <patterns...>` | Stage files. Accepts a single string or an array of strings; an array fans into one `git add` invocation. An empty array is an error. |
| `repo:add_all()` | `git add -A` | Stage all changes |
| `repo:commit(message)` | `git commit -m <message>` | Commit staged changes |
| `repo:branch(name)` | `git branch <name>` | Create a branch |
| `repo:checkout(name)` | `git checkout <name>` | Check out a branch |
| `repo:remote_add(name, url)` | `git remote add <name> <url>` | Add a remote |
| `repo:push(remote, branch)` | `git push <remote> <branch>` | Push to a remote |

```lua
local git = require("archetect.git")

local repo = git.init(context:get("project-name"))
repo:add_all()
repo:commit("Initial commit from archetype")
repo:remote_add("origin", "git@github.com:example/" .. context:get("project-name") .. ".git")
repo:push("origin", "main")
```

## `archetect.github`

Talks to the GitHub API. Credentials are resolved in order:

1. The `GITHUB_TOKEN` environment variable, if set and non-empty.
2. The GitHub CLI: the output of `gh auth token` (i.e. whatever `gh auth login` configured).

If neither yields a token, calls fail with guidance to set `GITHUB_TOKEN` or run `gh auth login`.

### `github.repo_exists(repo)`

```lua
github.repo_exists(repo) --> boolean
```

| Parameter | Type | Description |
|---|---|---|
| `repo` | `string` | Repository in `"owner/repo"` format |

**Returns:** `true` / `false`. Raises on malformed slugs, auth failure, or other API errors.

### `github.create_repo(repo, opts)`

```lua
github.create_repo(repo, opts?) --> { created: boolean, empty: boolean }
```

Creates a repository — or reports on an existing one. Creates under the authenticated user when `owner` is that user, otherwise under the `owner` organization.

| Parameter | Type | Description |
|---|---|---|
| `repo` | `string` | Repository in `"owner/repo"` format |
| `opts.visibility` | `string?` | `"public"`, `"private"` (default), or `"internal"` |

**Returns:** a table where `created` is `true` iff this call newly created the repo, and `empty` is `true` iff the repo has no content — the signal that it's safe to push without clobbering anything. Raises on auth/network failure, malformed slug, or GitHub-side rejection.

```lua
local git = require("archetect.git")
local github = require("archetect.github")

local slug = "example/" .. context:get("project-name")
local result = github.create_repo(slug, { visibility = "private" })

if result.empty then
    local repo = git.init()
    repo:add_all()
    repo:commit("Initial commit from archetype")
    repo:remote_add("origin", "git@github.com:" .. slug .. ".git")
    repo:push("origin", "main")
else
    log.warn("remote repository already has content; skipping push")
end
```

## `archetect.archive`

Creates archives from rendered output. Both `source` and `destination` are **relative to the render destination**. All functions return nothing and raise on failure.

| Function | Signature | Produces |
|---|---|---|
| `archive.zip(source, destination)` | `(string, string)` | ZIP archive |
| `archive.tar_gz(source, destination)` | `(string, string)` | gzipped tar archive |
| `archive.tar(source, destination)` | `(string, string)` | uncompressed tar archive |

```lua
local archive = require("archetect.archive")

archive.zip("dist", "dist.zip")
archive.tar_gz(context:get("project-name"), context:get("project-name") .. ".tar.gz")
```
