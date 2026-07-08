---
sidebar_position: 2
---

# Filters & Functions

Every entry below is registered once and reachable in two equivalent surface forms:

```jinja
{{ value | snake_case }}      {# pipe form #}
{{ snake_case(value) }}       {# function form #}
```

Pick whichever reads better. Zero-input generators (`now()`, `uuid()`, ...) are naturally used in function form. Filters take precedence over context keys of the same name, so setting a context variable named `now` cannot break `{{ now() }}`.

Case and inflection filters accept any scalar (string, integer, number, boolean — coerced to a string; `nil` becomes `""`). Passing a table to a scalar filter is a render error that names the filter.

## Casing Filters

All casing filters normalize from any input casing (snake, kebab, camel, Pascal, spaced, SCREAMING) before converting.

| Filter | Input → Output | Example |
|--------|----------------|---------|
| `camel_case` | any → `camelCase` | `{{ "FOO_BAR" \| camel_case }}` → `fooBar` |
| `pascal_case` | any → `PascalCase` | `{{ "foo-bar" \| pascal_case }}` → `FooBar` |
| `snake_case` | any → `snake_case` | `{{ "Foo Bar" \| snake_case }}` → `foo_bar` |
| `kebab_case` | any → `kebab-case` | `{{ "FOO_BAR" \| kebab_case }}` → `foo-bar` |
| `constant_case` | any → `SCREAMING_SNAKE` | `{{ "Foo bar" \| constant_case }}` → `FOO_BAR` |
| `train_case` | any → `Train-Case` | `{{ "foo_bar" \| train_case }}` → `Foo-Bar` |
| `title_case` | any → `Title Case` | `{{ "foo_bar" \| title_case }}` → `Foo Bar` |
| `sentence_case` | any → `Sentence case` | `{{ "FooBar" \| sentence_case }}` → `Foo bar` |
| `class_case` | any → singularized `PascalCase` | `{{ "foo_bars" \| class_case }}` → `FooBar` |
| `package_case` | any → `package.case` | `{{ "FooBar" \| package_case }}` → `foo.bar` |
| `directory_case` | any → `directory/case` | `{{ "FooBar" \| directory_case }}` → `foo/bar` |
| `cobol_case` | any → `COBOL-CASE` | `{{ "foo_bar" \| cobol_case }}` → `FOO-BAR` |
| `upper_case` | any → UPPERCASE (no word splitting) | `{{ "foo-bar" \| upper_case }}` → `FOO-BAR` |
| `lower_case` | any → lowercase (no word splitting) | `{{ "Foo-Bar" \| lower_case }}` → `foo-bar` |
| `upper` | alias for `upper_case` | `{{ name \| upper }}` |
| `lower` | alias for `lower_case` | `{{ name \| lower }}` |

`class_case` differs from `pascal_case` in that it also singularizes: `order_items` → `OrderItem`.

## Inflection Filters

Backed by the `archetect-inflections` crate — English pluralization rules with irregular and uncountable word handling.

| Filter | Input → Output | Example |
|--------|----------------|---------|
| `pluralize` | singular → plural | `{{ "entity" \| pluralize }}` → `entities` |
| `plural` | alias for `pluralize` | `{{ "ox" \| plural }}` → `oxen` |
| `singularize` | plural → singular | `{{ "crates" \| singularize }}` → `crate` |
| `singular` | alias for `singularize` | `{{ "oxen" \| singular }}` → `ox` |
| `ordinalize` | number string → ordinal | `{{ "1" \| ordinalize }}` → `1st` |
| `deordinalize` | ordinal → number string | `{{ "12th" \| deordinalize }}` → `12` |

## String Filters

| Filter | Signature | Example |
|--------|-----------|---------|
| `default` | `default(value, fallback)` — fallback when value is `nil` or `""` | `{{ nickname \| default(name) }}` |
| `truncate` | `truncate(s, n, suffix?)` — cut to `n` chars (Unicode-aware); appends `suffix` (default `…`) only if truncated | `{{ "abcdefghij" \| truncate(5, "...") }}` → `abcde...` |
| `replace` | `replace(s, from, to)` — replace all occurrences | `{{ "banana" \| replace("a", "o") }}` → `bonono` |
| `trim` | strip leading + trailing whitespace | `{{ "  hi  " \| trim }}` → `hi` |
| `trim_start` | strip leading whitespace | `{{ "  hi" \| trim_start }}` → `hi` |
| `trim_end` | strip trailing whitespace | `{{ "hi  " \| trim_end }}` → `hi` |
| `indent` | `indent(s, n)` — prefix every line with `n` spaces (empty trailing lines untouched) | `{{ body \| indent(4) }}` |
| `string_repeat` | `string_repeat(s, n)` — repeat `n` times | `{{ "ab" \| string_repeat(3) }}` → `ababab` |
| `split` | `split(s, sep)` — split into an array | `{% for part in split(path, "/") %}` |
| `length` | char count for strings, element count for arrays, `0` for `nil` | `{{ "héllo" \| length }}` → `5` |
| `concat` | `concat(a, b, c, ...)` — join scalar args | `{{ concat(org, ".", name) }}` |

`string_repeat` is deliberately not named `repeat` — that's a Lua reserved word, which would break the function form.

## Collection Filters

Operate on array-style tables (the kind produced by `split`, YAML/JSON lists, and Lua sequences).

| Filter | Behavior | Example |
|--------|----------|---------|
| `join` | `join(arr, sep)` — concatenate scalar elements | `{{ items \| join(", ") }}` → `a, b, c` |
| `first` | first element, or `nil` if empty | `{{ items \| first }}` |
| `last` | last element, or `nil` if empty | `{{ items \| last }}` |
| `sort` | sorted copy (original untouched); scalar ordering | `{{ names \| sort \| join(", ") }}` |
| `reverse` | reversed copy | `{{ items \| reverse }}` |
| `contains` | `contains(haystack, needle)` — membership for arrays, substring for strings, `false` for `nil` haystack | `{% if contains(features, "TOC") %}` |
| `unique` | deduplicated copy, first-occurrence order preserved | `{{ tags \| unique \| join(",") }}` |

`contains` is ATL's replacement for Jinja's `in` test: `{% if "TOC" in features %}` becomes `{% if contains(features, "TOC") %}`.

## Date & Time Functions

| Function | Returns | Example result |
|----------|---------|----------------|
| `now()` | current local datetime, RFC3339 | `2026-07-06T09:15:00-04:00` |
| `now_utc()` | current UTC datetime, RFC3339 | `2026-07-06T13:15:00+00:00` |
| `today()` | current local date | `2026-07-06` |
| `year()` | current local year (integer) | `2026` |
| `timestamp()` | current Unix timestamp (integer) | `1783430100` |
| `date` | `date(value, format)` — strftime-format an RFC3339 or `YYYY-MM-DD` input | `{{ today() \| date("%Y") }}` → `2026` |

```jinja
Copyright (c) {{ year() }} {{ org_name }}
```

## UUID Functions

| Function | Returns |
|----------|---------|
| `uuid()` | random v4 UUID (alias for `uuid_v4()`) |
| `uuid_v4()` | random v4 UUID |
| `uuid_v7()` | time-ordered v7 UUID (sortable) |
| `uuid_nil()` | `00000000-0000-0000-0000-000000000000` |

## Path Filters

Operate on POSIX-style forward-slash paths; purely string-based (never touch the filesystem).

| Filter | Behavior | Example |
|--------|----------|---------|
| `path_join` | `path_join(a, b, ...)` — join segments with `/`, collapsing duplicate separators; `nil` segments skipped | `{{ path_join("src", module, "mod.rs") }}` → `src/api/mod.rs` |
| `basename` | final path component | `{{ "a/b/c.txt" \| basename }}` → `c.txt` |
| `dirname` | everything before the final component | `{{ "a/b/c.txt" \| dirname }}` → `a/b` |
| `extname` | extension including the dot (`""` if none; leading dots as in `.gitignore` don't count) | `{{ "a/b.tar.gz" \| extname }}` → `.gz` |
| `path_normalize` | collapse `.` / `..` segments and duplicate separators | `{{ "a/./b/../c" \| path_normalize }}` → `a/c` |

## Serialization (the `format` global)

Not filters, but reachable from any expression via the read-only `format` global:

| Function | Behavior |
|----------|----------|
| `format.to_json(value)` | Lua value → pretty JSON string |
| `format.to_yaml(value)` | Lua value → YAML string |
| `format.to_toml(value)` | Lua value → pretty TOML string |
| `format.from_json(s)` | JSON string → Lua table |
| `format.from_yaml(s)` | YAML string → Lua table |
| `format.from_toml(s)` | TOML string → Lua table |

```jinja
{{ format.to_yaml(service_config) }}
```

`format.json` / `format.yaml` / `format.toml` are legacy aliases for the `to_*` forms.

## Custom Filters

Archetype scripts can register their own filters with `template.register_filters(table)`. Each entry becomes available in both pipe and function form, in file contents, file names, and inline `template.render` strings alike:

```lua
-- in the archetype script
template.register_filters({
    rust_type = function(field)
        local map = { String = "String", Integer = "i64", UUID = "Uuid", Boolean = "bool" }
        return map[field.type] or field.type
    end,
})
```

```jinja
pub {{ field.name | snake_case }}: {{ field | rust_type }},
```

Custom filters receive the piped value as their first argument, followed by any filter arguments. Registering a name that already exists replaces it — including built-ins, so choose distinct names.
