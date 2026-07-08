---
sidebar_position: 2
---

# Filters & Functions

ATL ships a set of built-in filters for the transformations archetype authors
need constantly: case conversion, pluralization, string cleanup, list handling,
and a few generators (dates, UUIDs). This page is a guided tour of the ones
you'll reach for most — the complete list with signatures lives in the
[filter reference](../../reference/templating/filters).

One thing to internalize first: **every filter is also a function**. These are
equivalent:

```jinja
{{ project_name | pascal_case }}
{{ pascal_case(project_name) }}
```

There is one implementation per name; the two spellings are purely stylistic.

## Case filters

The workhorses. Each takes a string in any casing and re-cases it:

| Filter | `"transaction log"` becomes |
|---|---|
| `snake_case` | `transaction_log` |
| `pascal_case` | `TransactionLog` |
| `camel_case` | `transactionLog` |
| `kebab_case` | `transaction-log` |
| `train_case` | `Transaction-Log` |
| `constant_case` | `TRANSACTION_LOG` |
| `title_case` | `Transaction Log` |

Plus `class_case`, `cobol_case`, `sentence_case`, `package_case` (dotted, for
Java-style packages), `directory_case` (slashed, for package directories), and
plain `lower` / `upper`.

Remember that [case expansion](../scripting/casing) usually saves you from
needing these for *prompted* values — `{{ ProjectName }}` is already in the
context. Case filters earn their keep when you derive new identifiers from
existing ones. Here's a realistic slice of a generated service file, where one
`entity` loop variable fans out into every casing a language needs:

```jinja
{% for entity in entities %}
mod {{ entity | snake_case }};
pub use {{ entity | snake_case }}::{{ entity | pascal_case }};

pub const {{ entity | constant_case }}_TABLE: &str = "{{ entity | snake_case | pluralize }}";
{% endfor %}
```

With `entities = ["order item", "customer"]` this renders:

```rust
mod order_item;
pub use order_item::OrderItem;

pub const ORDER_ITEM_TABLE: &str = "order_items";
mod customer;
pub use customer::Customer;

pub const CUSTOMER_TABLE: &str = "customers";
```

## Pluralization

Entity-driven generation constantly needs both grammatical numbers: a model is
singular, its table/collection/endpoint is plural. `pluralize` and
`singularize` (aliases: `plural`, `singular`) handle English inflection
including irregular forms:

```jinja
// REST resource for {{ entity | pascal_case }}
GET /api/{{ entity | kebab_case | pluralize }}
GET /api/{{ entity | kebab_case | pluralize }}/:id
```

They compose naturally with case filters, and they also work in reverse when
your input list is plural:

```jinja
struct {{ table_name | singularize | pascal_case }} { /* ... */ }
```

`ordinalize` / `deordinalize` round out the inflection set (`"1"` → `"1st"`).

## String helpers

- **`default(value, fallback)`** — the fallback when a value is unset *or an
  empty string*. Ubiquitous with optional prompts:

  ```jinja
  description = "{{ description | default(project_name) }}"
  ```

- **`trim`**, **`trim_start`**, **`trim_end`** — strip whitespace.
- **`truncate(n, suffix?)`** — cap length, appending `…` (or your suffix) when
  something was cut.
- **`replace(from, to)`** — replace all occurrences.
- **`indent(n)`** — prefix every line with `n` spaces; ideal for splicing a
  multi-line fragment into an indented position:

  ```jinja
  services:
    app:
  {{ service_config | indent(4) }}
  ```

- **`split(sep)`** — string to list; **`length`** — character count for
  strings, element count for lists; **`concat(a, b, ...)`** — join scalars
  into one string; **`string_repeat(n)`** — repeat a string.

## Collection helpers

```jinja
tags = [{{ tags | join(", ") }}]
primary = "{{ regions | first }}"
```

- **`join(sep)`** — concatenate elements with a separator.
- **`first`** / **`last`** — endpoints of a list (nothing if empty).
- **`sort`**, **`reverse`**, **`unique`** — return transformed *copies*.
- **`contains(needle)`** — membership test for lists, substring test for
  strings; safe on unset values (returns false). Reads best in function form
  inside conditions:

  ```jinja
  {% if contains(languages, "Rust") %}
  {% include "editor-config/editorconfig-rust.atl" %}
  {% endif %}
  ```

## Dates, years, UUIDs

A few zero-argument generators are handy in headers and license files:

```jinja
// Copyright {{ year() }} {{ author_full }}
// Generated on {{ today() }}
```

- **`now()`** / **`now_utc()`** — RFC3339 timestamp; **`today()`** —
  `YYYY-MM-DD`; **`year()`** — current year; **`timestamp()`** — Unix seconds.
- **`date(format)`** — reformat an RFC3339 or `YYYY-MM-DD` string with
  strftime patterns: `{{ today() | date("%B %Y") }}`.
- **`uuid()`** (alias `uuid_v4()`), **`uuid_v7()`**, **`uuid_nil()`** — fresh
  identifiers for config files that need them.

## Path helpers

For assembling paths inside generated config:

- **`path_join(a, b, ...)`** — join segments, collapsing duplicate slashes.
- **`basename`** / **`dirname`** / **`extname`** — decompose a path.
- **`path_normalize`** — collapse `.` and `..` segments (string-only; never
  touches the filesystem).

```jinja
config-dir = "{{ path_join(project_name, "config") }}"
```

## When you need something custom

Scripts can register their own filters with `template.register_filters`,
making project-specific transformations available to every template in the
render — see [Rendering](../scripting/rendering). And because `{% %}` blocks
accept ordinary Lua expressions, a one-off transformation can often live
inline without a filter at all.

For the exhaustive list — every filter, alias, argument, and edge case — see
the [filter reference](../../reference/templating/filters).
