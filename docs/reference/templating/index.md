---
sidebar_position: 3
sidebar_label: Templating (ATL)
---

# ATL Reference

ATL (Archetect Template Language) is Archetect's template engine. It uses the familiar `{{ expr }}` / `{% ... %}` / `{# ... #}` delimiter family, but under the hood every template is compiled to a Lua function and executed in the same Lua VM as your archetype script. Logic blocks are real Lua (with ergonomic shorthands), and the data your script puts in the context flows into templates with zero conversion — nested tables, arrays, and all.

This section is the formal reference. For a guided introduction, see [Templating with ATL](../../authoring-archetypes/templating/).

| Page | Contents |
|------|----------|
| [Syntax](syntax) | Expressions, logic blocks, loops, conditionals, includes, comments, raw blocks, whitespace control |
| [Filters & Functions](filters) | Every built-in filter/function, grouped by category, with examples |

## Where ATL Applies

| Surface | Entry point | Notes |
|---------|-------------|-------|
| File contents | `directory.render(src, context)` | Every non-binary file in the tree is rendered. Binary files (detected by content inspection, not extension) are copied through untouched. |
| Single files | `file.render(src, context, opts)` | Same engine, one file. |
| Inline strings | `template.render(str, context, opts?)` | Returns the rendered string, or writes to `opts.destination`. `{% include %}` is not available in inline strings. |
| File and directory names | automatic during `directory.render` | A path segment is rendered only if it contains `{{`. A directory named `{{ project-name }}` becomes `my-project`. Names support the same expressions and filters as contents; `{% include %}` is not available in names. |
| Include partials | `{% include "partial.atl" %}` | Resolved at compile time against `includes/` directories. See [Syntax → Includes](syntax#includes). |

There is no special "template extension": the engine does not strip or require `.atl` on rendered files, and it never renames output files based on extension. By convention, `.atl` is used for partials that live in `includes/` directories.

## The Context Is Flat

Templates receive the context as a flat table. Variables are referenced bare — `{{ project_name }}`, never `context.project_name`:

```jinja
{{ project-name }} is owned by {{ org_name }}.
```

Kebab-case keys like `project-name` work directly in expressions — the compiler recognizes them and resolves them against the context, so they don't collide with Lua's subtraction operator.

When a prompt or `ctx:set` declares cases (via the `cases` option), the value is stored under multiple casings at once — e.g. `project-name`, `project_name`, `projectName`, `ProjectName`, `PROJECT_NAME` — so templates can pick whichever casing the target file needs. See [Templating with ATL](../../authoring-archetypes/templating/) for how case expansion is declared.

Nested data works too: your script can set entire model tables into the context and templates iterate them directly:

```jinja
{% for field in entity.fields %}
    pub {{ field.name | snake_case }}: {{ field.type }},
{% endfor %}
```

## Read-Only Globals in Templates

Besides context variables and filters, templates can read three globals:

| Global | Contents |
|--------|----------|
| `archetect` | Binary/process info: `version`, `version_major/minor/patch`, `is_offline`, `is_headless`, `locals_enabled`, `env` (platform table) |
| `archetype` | Current archetype: `description`, `directory`, `destination`, `authors`, `switches`, `answers()`, `mount_key()`, `is_library()`, `is_standalone()`, `include_path(rel)` |
| `format` | Pure (de)serialization helpers: `to_json`, `to_yaml`, `to_toml`, `from_json`, `from_yaml`, `from_toml` |

Effectful script APIs (`directory.render`, `git.*`, `shell.*`, ...) are deliberately not reachable from templates — templates are pure.

## Configuration

The `templating:` block in `archetype.yaml` controls engine behavior:

```yaml
templating:
  undefined: strict     # lenient (default) | strict
  trim_blocks: true     # default: false
  lstrip_blocks: true   # default: false
```

| Option | Values | Default | Effect |
|--------|--------|---------|--------|
| `undefined` | `lenient`, `strict` | `lenient` | `lenient`: undefined variables render as empty. `strict`: any access to an undefined context variable raises a render-time error naming the missing key. |
| `trim_blocks` | `true`, `false` | `false` | Strip the first newline after a `{% ... %}` block tag. |
| `lstrip_blocks` | `true`, `false` | `false` | Strip leading whitespace on lines that contain only a block tag. |

These options apply to file contents rendered via `directory.render` and `file.render`. Inline `template.render` strings and file/directory names always compile with the defaults (lenient, no block trimming).

Whitespace can also be controlled per-tag with `-` markers regardless of these settings — see [Syntax → Whitespace Control](syntax#whitespace-control).

## Error Behavior

- Malformed tags (`{{` without `}}`, invalid filter names, unquoted include paths) are compile-time errors that name the template.
- Malformed Lua inside `{% ... %}` blocks is caught at compile time, before any file is written.
- In lenient mode, an undefined variable (or explicit `nil`) renders as an empty string — the literal text `nil` is never emitted.
- A filter that raises an error fails the render with a message naming the template file.
