---
sidebar_position: 4
---

# Cache & System

Commands for managing Archetect's local cache and inspecting your environment.

## cache

```text
archetect cache <COMMAND>
```

Archetect caches remote archetypes and catalogs (cloned git repositories) in its cache
directory so subsequent renders are fast and work offline.

| Command | Description |
|---|---|
| `clear` | Remove Archetect's entire repository cache. |
| `pull [source]` | Recursively pull all archetypes/catalogs reachable from a source, or from the configured catalog. |
| `invalidate [source]` | Recursively invalidate cached archetypes/catalogs, forcing a re-fetch on next render. |

### cache clear

```shell
archetect cache clear
```

Asks for confirmation (defaulting to *No*), then removes each entry inside the cache
directory. In `--headless` mode the confirmation prompt is skipped and the clear
proceeds.

```text
? Are you sure you want to remove all cached Archetypes and Catalogs? (y/N)
```

### cache pull

```shell
archetect cache pull
archetect cache pull https://github.com/archetect/archetect-catalog.git
```

Resolves the source (or, when omitted, each top-level entry of the configured catalog),
walks its catalog tree, and pulls every reachable archetype. Following the "archetypes
all the way down" model, if a leaf archetype itself declares a catalog, those entries
are pulled too. Sources are deduplicated within a run. Prints a summary:

```text
archetect: Pre-cache complete: 12 pulled, 3 skipped, 0 failed, 5 child manifests walked
```

Use this to warm the cache before going offline (`-o` / `ARCHETECT_OFFLINE`).

### cache invalidate

```shell
archetect cache invalidate
archetect cache invalidate https://github.com/archetect/archetect-catalog.git
```

Walks the catalog tree and invalidates the cache timestamp for each reachable
archetype, forcing a re-fetch on the next render — without deleting anything. When no
source is given, invalidates the configured catalog.

## system layout

```text
archetect system layout
```

Prints the directories Archetect uses. (Bare `archetect system` shows the same
output.) Archetect follows the XDG base directory conventions:

```text
Etc Directory:   ~/.config/archetect
Etc.d Directory: ~/.config/archetect/etc.d
Cache Directory: ~/.cache/archetect
Data Directory:  ~/.local/share/archetect
```

| Directory | Purpose |
|---|---|
| Etc | User configuration (`archetect.yaml`) — see [config](config) |
| Etc.d | Drop-in configuration fragments, merged in sorted order |
| Cache | Cached remote archetypes and catalogs |
| Data | Installed data such as Lua IDE annotations — see [ide setup](tooling#ide-setup) |

## check

```text
archetect check
```

Runs environment diagnostics and prints each result with a status icon
(🟢 pass, 🟡 warning, 🔴 error, ℹ informational). Checks include:

- Git installation (optional)
- Git `user.name` and `user.email`
- Cache directory existence and writability
- Shell execution policy (see `--allow-exec`)
- Lua IDE annotations installation
- `GITHUB_TOKEN` environment variable (required only if archetype scripts use the
  `archetect.github` module)

On Windows, additional checks for git long path name support are performed.

Example output:

```text
🔍 Git installation (optional)
	🟢 git version 2.54.0

🔍 Git user.name and user.email
	🟢 Jane Doe <jane@example.com>

🔍 Cache directory
	🟢 /home/jane/.cache/archetect (writable)

🔍 Shell execution policy
	ℹ  Prompt — scripts must request approval per command (default)

🔍 Lua IDE annotations
	ℹ  Not installed
	   Run `archetect ide setup` to install Lua type annotations for IDE autocomplete.

🔍 GITHUB_TOKEN environment variable
	ℹ  Not set
	   Required only if archetype scripts use the archetect.github module.
```
