---
sidebar_position: 6
---

# Rendering

Rendering turns templates plus context into files. Three functions cover the spectrum — whole directories, single files, and inline strings.

## `directory.render` — the workhorse

```lua
directory.render("contents", context)
```

Renders everything under the named directory (relative to the archetype root) into the destination — file contents and file/directory names both pass through ATL.

Options:

```lua
directory.render("docker", context, {
  destination = "deploy",              -- subdirectory of the render destination
  if_exists = Existing.Overwrite,      -- existing-file policy (see below)
})
```

Multiple content roots, rendered conditionally, are the backbone of [feature-gated archetypes](./switches-and-conditionals).

## `file.render` — single files

```lua
-- Write a single template to the destination
file.render("templates/gitignore", context, { destination = ".gitignore" })

-- Or return the rendered text (no destination = no file written)
local banner = file.render("templates/banner.txt", context)
```

The source path always resolves against the archetype root. When `destination` is present the file is written and the call returns `nil`; without it, the rendered string is returned for further use.

## `template.render` — inline strings

```lua
local artifact = template.render("{{ org }}-{{ project-name }}.jar", context)

-- Or write an inline template straight to a file
template.render("# {{ Project-Name }}\n", context, { destination = "NOTES.md" })
```

Handy for computing derived values with template syntax instead of Lua string plumbing.

## Existing-file policies

What happens when a target file already exists? The `if_exists` option (on all three functions) takes an `Existing` policy:

| Policy | Behavior |
|---|---|
| `Existing.Preserve` | Keep the existing file (**default**) |
| `Existing.Overwrite` | Replace it |
| `Existing.Prompt` | Ask the user, per file |
| `Existing.Error` | Fail the render — for CI and idempotent pipelines |

The `Preserve` default makes re-rendering safe: users can re-run an archetype over an existing project without losing local edits. Reach for `Overwrite` only for files the archetype truly owns.

## Reading and probing files

`file.exists` and `file.read` complete the toolkit:

```lua
-- Read a data file shipped inside the archetype
local defaults = format.from_yaml(file.read("data/defaults.yaml"))
context:merge(defaults)

-- Probe the destination to adapt to an existing project
if file.exists("Cargo.toml", { within = Location.Destination }) then
  log.info("Existing Cargo project detected")
end
```

The `within` option picks the resolution root:

| Location | Resolves against |
|---|---|
| `Location.Archetype` | The archetype's own directory (**default**) |
| `Location.Destination` | The render destination (honors `--destination`) |
| `Location.Cwd` | The process working directory |

:::warning Sandboxed paths
All file paths are sandboxed: absolute paths, `..` traversal, and `~` expansion are rejected, in every location. Archetypes read and write only where they're supposed to.
:::

## Where files land

All output paths are relative to the **render destination** (the positional/`--destination` argument, default `.`). Composed child archetypes can be aimed at subdirectories via `catalog.render`'s `destination` option — see [Composition](./composition).

Full signatures: [Rendering Modules reference](../../reference/lua-api/rendering).
