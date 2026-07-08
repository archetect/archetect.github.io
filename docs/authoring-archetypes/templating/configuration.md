---
sidebar_position: 4
---

# Templating Configuration

Engine-wide template behavior is configured in the `templating:` block of
`archetype.yaml`. The block is small — three settings — and entirely optional,
but for code-generating archetypes you'll almost always want to set it.

```yaml
templating:
  undefined: strict      # default: lenient
  trim_blocks: true      # default: false
  lstrip_blocks: true    # default: false
```

These settings apply to every template the archetype renders — file contents,
file and directory names, and includes.

## `undefined` — missing-variable policy

What happens when a template references a variable that isn't in the context?

- **`lenient`** (the default) — the expression renders as *nothing*. The render
  succeeds; you get an empty spot where the value would have been.
- **`strict`** — the render fails with an error naming the undefined variable.

```yaml
templating:
  undefined: strict
```

Lenient mode is forgiving during early development, but it has a failure mode
you should take seriously: a typo like `{{ projcet_name }}` silently produces
a broken file that may not be noticed until the generated project fails to
compile — or worse, doesn't fail. Strict mode turns that typo into an
immediate, clearly-attributed render error.

**Recommendation:** turn on `strict` once your archetype's prompts and context
keys have settled. Strict is strict everywhere — it fires inside `{% if %}`
conditions and loops too, not just in `{{ }}` output — so it pairs with a
simple discipline: every key a template mentions should be *defined* by your
script, even when its value is intentionally empty or false.

```lua
-- archetype.lua: define optional keys explicitly...
context:set("description", context:get("description") or "")
```

```jinja
{# ...then templates can still express fallbacks: default() treats an
   empty string as unset. #}
description = "{{ description | default(project_name) }}"
```

For nested data, [optional chaining](syntax#variables) guards missing *inner*
fields once the root key exists:

```jinja
{% if components?.license?.spdx %}
license = "{{ components.license.spdx }}"
{% endif %}
```

## `trim_blocks` and `lstrip_blocks` — whitespace hygiene

Block tags (`{% if %}`, `{% for %}`, `{% include %}`...) usually sit on their
own lines. By default the engine treats those lines like any other text: the
newline after the tag and the indentation before it both survive into the
output, littering generated files with blank lines and stray indentation.

- **`trim_blocks: true`** — strips the first newline after a block tag.
- **`lstrip_blocks: true`** — strips leading whitespace on lines that contain
  only a block tag.

Together they make block tags whitespace-neutral: a `{% for %}` line vanishes
from the output entirely, leaving only the loop body. See the
[before/after example](syntax#whitespace-control) in the syntax guide.

## Recommended settings for code generation

```yaml
templating:
  undefined: strict
  trim_blocks: true
  lstrip_blocks: true
```

Rationale:

- Generated code is read, reviewed, and committed — output should be exactly
  what a human would have written, with no blank-line residue from template
  logic. `trim_blocks` + `lstrip_blocks` achieve that without peppering every
  tag with manual `{%- -%}` markers.
- Generated code must be *correct* — `strict` converts context typos into
  render-time errors instead of subtly broken output.

Real-world archetypes follow this pattern; for example, the
`rust-clap-cli` archetype ships:

```yaml
templating:
  trim_blocks: true
  lstrip_blocks: true
```

which lets its `Cargo.toml` template read naturally —

```jinja
[workspace]
members = [
    ".",
{% for m in components.xtask.workspace_members %}
    "{{ m }}",
{% endfor %}
]
```

— while rendering a perfectly clean manifest with no gaps where the `{% for %}`
lines were.

Even with both settings enabled, per-tag whitespace markers (`{{- ... -}}`,
`{%- ... -%}`) remain available for the occasional spot that needs tighter
control.

For the full manifest schema, see the
[archetype manifest reference](../../reference/archetype-manifest).
