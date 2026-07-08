---
sidebar_position: 3
---

# Rendering Modules

Three globals turn context data into output: `directory` for whole template trees, `file` for single files, and `template` for inline strings. All three share the same option conventions:

- `destination` — where to write, **relative to the render destination** (the directory being generated into, tracking `-d`).
- `if_exists` — an [`Existing`](globals#existing) policy for files already present. Default: `Existing.Preserve`.

## Path sandbox

Every path handed to these modules is sandboxed:

- **No absolute paths.**
- **No `..` traversal.**
- **No `~` home expansion.**

Violations raise an error. Source paths resolve against the archetype root; destination paths resolve against the render destination.

## `directory`

### `directory.render(path, context, opts)`

```lua
directory.render(path, context, opts?)
```

Renders an entire content directory: every file is treated as a template, and file/directory *names* are templated too (e.g. a directory named `{{ project_name }}`). See [Rendering](../../authoring-archetypes/scripting/rendering) and [Organizing Templates](../../authoring-archetypes/templating/organizing-templates).

| Parameter | Type | Description |
|---|---|---|
| `path` | `string` | Directory path relative to the archetype root (e.g. `"contents/base"`) |
| `context` | `Context` | Template context |
| `opts.destination` | `string?` | Subdirectory to render into, relative to the render destination |
| `opts.if_exists` | `ExistingPolicy?` | Policy for existing files (default `Existing.Preserve`) |

**Returns:** nothing.

```lua
directory.render("contents/base", context)

directory.render("contents/docs", context, {
    destination = "docs",
    if_exists = Existing.Overwrite,
})
```

When called from a module inside a staged library, `path` resolves against the *library's* own root — a library can render its own `contents/` without knowing where it was mounted.

## `file`

Single-file helpers. `exists` and `read` resolve against the archetype root by default; pass `within` to resolve elsewhere. `render` sources **always** resolve against the archetype root.

### `file.exists(path, opts)`

```lua
file.exists(path, opts?) --> boolean
```

| Parameter | Type | Description |
|---|---|---|
| `path` | `string` | Relative path |
| `opts.within` | `LocationPolicy?` | [`Location.Archetype`](globals#location) (default), `Location.Destination`, or `Location.Cwd` |

**Returns:** `boolean`.

```lua
if file.exists("Cargo.toml", { within = Location.Destination }) then
    log.info("already rendered")
end
```

### `file.read(path, opts)`

```lua
file.read(path, opts?) --> string
```

Reads a file's contents as a string. **Errors** if the path does not exist or is not a regular file.

| Parameter | Type | Description |
|---|---|---|
| `path` | `string` | Relative path |
| `opts.within` | `LocationPolicy?` | Same as `file.exists` (default `Location.Archetype`) |

**Returns:** `string`.

Combine with `format.from_yaml` / `from_json` / `from_toml` to deserialize, then `context:merge` to fold into the context:

```lua
local defaults = format.from_yaml(file.read("defaults.yaml"))
context:merge(defaults)
```

### `file.render(path, context, opts)`

```lua
file.render(path, context, opts?) --> string | nil
```

Renders a single template file. By default it **returns the rendered string**; pass `opts.destination` to write to disk instead (in which case it returns `nil`). Symmetric with `template.render`.

| Parameter | Type | Description |
|---|---|---|
| `path` | `string` | Source path, relative to the **archetype root** (no `within` option — the source is always archetype content) |
| `context` | `Context` | Template context |
| `opts.destination` | `string?` | Destination path, relative to the render destination. When present, write instead of returning. |
| `opts.if_exists` | `ExistingPolicy?` | Policy for existing files (default `Existing.Preserve`) |

**Returns:** rendered `string` when no destination is given; `nil` after writing to disk.

```lua
-- Render to a string:
local banner = file.render("snippets/banner.atl", context)

-- Render straight to the destination:
file.render("templates/README.md", context, { destination = "README.md" })
```

If the source is not found under the archetype root, the include search path is consulted as a fallback — this lets library code render its own staged includes via `file.render(archetype.include_path("frag.atl"), context)`.

## `template`

### `template.render(tmpl, context, opts)`

```lua
template.render(tmpl, context, opts?) --> string | nil
```

Renders an inline template string using the context's variables. Same return semantics as `file.render`: returns the string by default, writes and returns `nil` when `destination` is supplied.

| Parameter | Type | Description |
|---|---|---|
| `tmpl` | `string` | Template source (e.g. `"{{ project_name \| title_case }}"`) |
| `context` | `Context` | Template context |
| `opts.destination` | `string?` | Destination path, relative to the render destination. When present, write instead of returning. |
| `opts.if_exists` | `ExistingPolicy?` | Policy for existing files (default `Existing.Preserve`) |

**Returns:** rendered `string` when no destination is given; `nil` after writing to disk.

```lua
local artifact = template.render("{{ org }}-{{ project_name | kebab_case }}", context)

template.render("# {{ ProjectName }}\n", context, {
    destination = "NOTES.md",
    if_exists = Existing.Overwrite,
})
```

### `template.register_filters(filters)`

```lua
template.register_filters(filters)
```

Registers custom filters, callable from any subsequently rendered template (inline, file, or directory) as `{{ value | my_filter }}`.

| Parameter | Type | Description |
|---|---|---|
| `filters` | `table<string, function>` | Map of filter name to `function(value) -> value` |

```lua
template.register_filters({
    shout = function(value) return string.upper(value) .. "!" end,
})

template.render("{{ project_name | shout }}", context)
```

See [Filters & Functions](../../authoring-archetypes/templating/filters-and-functions) for the built-in filter catalog.
