---
sidebar_position: 1
---

# Syntax

ATL templates are plain text with three kinds of tags:

| Tag | Purpose |
|-----|---------|
| `{{ expr }}` | Expression — evaluate and write into the output |
| `{% code %}` | Logic block — control flow and statements (Lua, with shorthands) |
| `{# comment #}` | Comment — stripped from output |

Anything outside a tag is emitted verbatim. A lone `{` that isn't followed by `{`, `%`, or `#` is plain text.

## Expressions

`{{ expr }}` evaluates an expression and writes the result. Bare names resolve against the context; dotted access walks nested tables:

```jinja
{{ project_name }}
{{ entity.name.pascal }}
{{ org_name }}.{{ solution_name }}.{{ project_name }}
```

If the expression evaluates to `nil` (e.g. an undefined variable in lenient mode), nothing is written — the literal text `nil` never appears in output.

### Kebab-case keys

Context keys that aren't valid Lua identifiers — most commonly kebab-case keys like `project-name` — can be used bare. The compiler rewrites them to safe context lookups, including in dotted paths:

```jinja
{{ project-name }}
{{ entity.field-name }}
```

This rewriting only applies to simple (possibly dotted) names. Inside a larger expression (operators, function calls, string literals), use ordinary Lua syntax; a kebab-case key must then be accessed explicitly as `__ctx["project-name"]`.

### Full Lua expressions

The body of `{{ }}` is a Lua expression, so literals and operators work:

```jinja
{{ "fixed text" }}
{{ 1 + 2 }}
{{ #entity.fields }}
{{ count > 0 and "some" or "none" }}
{{ name .. "-suffix" }}
```

Available operators are Lua's: arithmetic (`+ - * / % ^`), comparison (`== ~= < <= > >=`), logical (`and or not`), string concatenation (`..`), and length (`#`). There is no Jinja-style `in` operator or `is` tests — use the [`contains`](filters#collection-filters) filter for membership checks.

### Optional chaining

`?.` short-circuits to `nil` when an intermediate value is missing, instead of raising an error:

```jinja
{{ components?.license?.spdx }}
{% if components?.license?.spdx %}...{% endif %}
```

`a?.b?.c` compiles to `(a and a.b and a.b.c)`. It works both in expressions and in logic blocks, and mixes with plain `.` access (`a.b?.c.d`).

### Filters

Filters transform the value to their left via `|`, and chain left-to-right:

```jinja
{{ name | snake_case }}
{{ name | snake_case | upper_case }}
{{ description | truncate(40, "...") }}
{{ items | join(", ") }}
```

A filter with arguments receives the piped value first, then the arguments. Arguments are themselves expressions and resolve against the context: `{{ x | default(other_var) }}`.

Every filter is also callable as a function — the two forms are equivalent:

```jinja
{{ name | snake_case }}
{{ snake_case(name) }}
{{ upper_case(snake_case(name)) }}
```

Filters take precedence over context keys of the same name, so a context variable named `now` cannot shadow the `now()` builtin.

See [Filters & Functions](filters) for the complete list.

## Logic Blocks

`{% ... %}` contains statements. The vocabulary is Lua — `if x then`, `elseif`, `else`, `end`, `local x = ...` — plus a small set of shorthands that make the common forms terser. Both the sugared and the raw Lua forms are always valid.

### Conditionals

```jinja
{% if field.required %}
    @NotNull
{% elseif field.unique %}
    @Column(unique = true)
{% else %}
    // optional
{% endif %}
```

- `{% if expr %}` and `{% elseif expr %}` auto-append Lua's `then`; writing `{% if expr then %}` explicitly also works.
- `{% endif %}` and `{% endfor %}` are aliases for Lua's `{% end %}` — all three close any block.
- Conditions are Lua expressions: `and`, `or`, `not`, `==`, `~=` (not-equals), `<`, `>`, `#list > 0`, `?.` chains, function/filter calls.

### Loops

```jinja
{% for item in items %}
- {{ item }}
{% endfor %}
```

Shorthand forms and what they expand to:

| Shorthand | Expands to | Iterates |
|-----------|-----------|----------|
| `{% for x in items %}` | `for _, x in ipairs(items) do` | array values, in order |
| `{% for i, x in enumerate(items) %}` | `for i, x in ipairs(items) do` | index + value (1-based) |
| `{% for k, v in map %}` | `for k, v in pairs(map) do` | map keys + values |
| `{% for i in range(10) %}` | numeric loop | `0` through `9` (exclusive upper bound) |
| `{% for i in range(2, 6) %}` | numeric loop | `2` through `5` |
| `{% for i in range(0, 10, 2) %}` | numeric loop | `0, 2, 4, 6, 8` |

Notes:

- `enumerate` is 1-indexed (Lua convention); `range` has an exclusive upper bound (Python/Rust convention).
- Raw Lua loops pass through unchanged: `{% for i = 1, 10 do %}`, `{% for i, x in ipairs(items) do %}`, `{% for k, v in pairs(map) do %}` — use these when you need inclusive numeric bounds or explicit iterator control.
- There is no Jinja `loop` object (`loop.index`, `loop.first`); use `enumerate` and compare the index yourself.

Loops nest freely:

```jinja
{% for entity in entities %}
{% for field in entity.fields %}
    {{ entity.name }}.{{ field.name }}
{% endfor %}
{% endfor %}
```

### Variables

There is no `{% set %}`. Declare locals with Lua's `local`:

```jinja
{% local greeting = "Hello" %}
{{ greeting }}, {{ name }}!
```

A local declared in a logic block stays in scope for the rest of the template and shadows context keys of the same name.

### Raw Lua

Anything Lua-statement-shaped that doesn't match a shorthand passes through verbatim, so the full language is available:

```jinja
{% local parts = {} %}
{% for m in modules %}
{% table.insert(parts, m.name) %}
{% endfor %}
{{ table.concat(parts, ", ") }}
```

Templates have access to a curated set of Lua stdlib entries (`ipairs`, `pairs`, `tostring`, `tonumber`, `type`, `table`, `string`, `math`, `require`, `print`, `error`, `pcall`, `select`, `unpack`, `next`, `rawget`, `rawset`, `setmetatable`, `getmetatable`) plus the read-only `archetect`, `archetype`, and `format` globals.

Malformed Lua in a logic block is a compile-time error — it is caught before any file is written.

## Comments

```jinja
{# This never appears in the output #}
```

Comments are stripped entirely and may span multiple lines.

## Includes

`{% include "path" %}` splices another template in at compile time. The included body shares the outer template's context and locals, so it behaves exactly as if its text were pasted in place — including inside loops:

```jinja
{% for entity in entities %}
{% include "entity-header.atl" %}
{% endfor %}
```

Rules (all verified against the resolver):

- The path must be a quoted string literal (single or double quotes). `{% include header.atl %}` is a compile error.
- Paths resolve against the include search list, in order, first match wins:
  1. the archetype's own `includes/` directory,
  2. each staged library's includes, addressed under the library's mount key: `{% include "my-lib/header.atl" %}`.
- For `file.render` sources that were themselves resolved from a library, the source file's own directory is searched first, so sibling partials can be included without a prefix.
- `..` traversal outside the includes sandbox is rejected.
- Include cycles (`a.atl` → `b.atl` → `a.atl`) are detected at compile time.
- Includes are unavailable where there is no includes directory to resolve against: inline `template.render(...)` strings and file/directory names.

The `.atl` extension on partials is a convention, not a requirement — the path is matched literally.

There is no template inheritance (`{% block %}` / `{% extends %}`) and no `{% macro %}`. Composition is done with includes and Lua locals/functions.

## Raw Blocks

Use `{% raw %}` ... `{% endraw %}` to emit text containing ATL-like delimiters without interpretation — e.g. GitHub Actions expressions:

```jinja
{% raw %}
steps:
  - run: echo "${{ github.ref }}"
{% endraw %}
```

Nothing between the markers is tokenized — `{{ }}`, `{% %}`, and `{# #}` all pass through verbatim.

### Escape constants

For emitting individual delimiters (common in meta-archetypes that generate templates), built-in constants expand to the literal delimiter strings:

| Constant | Alias | Emits |
|----------|-------|-------|
| `LEFT_EXPR` | `LE` | `{{` |
| `RIGHT_EXPR` | `RE` | `}}` |
| `LEFT_STMT` | `LS` | `{%` |
| `RIGHT_STMT` | `RS` | `%}` |

```jinja
{{ LE }} project_name {{ RE }}
```

renders as `{{ project_name }}`.

Delimiters inside Lua string literals are also safe without escaping — the tokenizer is Lua-string-aware, so `{{ "{{ var }}" }}` renders the literal text `{{ var }}`.

## Whitespace Control

A `-` immediately inside a delimiter trims whitespace on that side of the tag:

| Marker | Effect |
|--------|--------|
| `{{- expr }}` / `{%- code %}` | Trim trailing whitespace (up to and including the last newline) of the preceding text |
| `{{ expr -}}` / `{% code -%}` | Trim leading whitespace (up to and including the first newline) of the following text |

```jinja
{% for item in items -%}
    {{ item }}
{%- endfor %}
```

Two engine-wide options in the manifest apply the trimming automatically around `{% ... %}` block tags (never around `{{ }}` expressions):

- `trim_blocks: true` — strip the first newline after every block tag.
- `lstrip_blocks: true` — strip indentation on lines that contain only a block tag.

See the [configuration summary](./#configuration) for defaults.

## Strict vs Lenient Undefined Variables

By default (`undefined: lenient`), referencing an undefined variable renders as empty — both in expressions and when iterated/tested in logic blocks (where it is `nil`). With `undefined: strict` in the manifest's `templating:` block, any lookup of a missing context key raises a render error:

```
undefined template variable: name
```

Strict mode does not affect filter lookups, locals, or explicit `nil` handling via `?.` and `default(...)`.
