---
sidebar_position: 1
---

# Template Syntax

This page walks through ATL syntax the way you'll actually use it, building
from simple substitution up to loops, whitespace control, and includes. The
terse, complete version lives in the
[syntax reference](../../reference/templating/syntax).

## Variables

Wrap a context variable in `{{ }}` and it's replaced with its value:

```jinja
name = "{{ project_name }}"
authors = ["{{ author_full }}"]
```

Dotted access reaches into nested tables that scripts publish into the
context — for example, structured data contributed by composed components:

```jinja
version = "{{ components.xtask.version }}"
```

There's also optional chaining, `?.`, which yields nothing instead of raising
an error when an intermediate value is missing:

```jinja
{% if components?.license?.spdx %}
license = "{{ components.license.spdx }}"
{% endif %}
```

Keys that aren't valid identifiers work too — `{{ project-name }}` looks up the
kebab-cased key exactly as written.

## Filters

Filters transform a value. Chain them with `|`, left to right:

```jinja
{{ project_name | pascal_case }}
{{ description | trim | truncate(72) }}
```

Every filter is also callable as a plain function — same implementation, two
surface forms. Use whichever reads better:

```jinja
{{ pascal_case(project_name) }}
{{ description | default(project_name) }}
{{ default(description, project_name) }}
```

The pipe form tends to win when the input dominates
(`{{ items | join(", ") }}`); the function form when the arguments do. See
[Filters & Functions](filters-and-functions) for a tour of the built-ins.

## Conditionals

```jinja
{% if use_github %}
[badges]
github = { repository = "{{ github_slug }}" }
{% endif %}
```

With alternatives:

```jinja
{% if license == "MIT" %}
license = "MIT"
{% elseif license == "Apache-2.0" %}
license = "Apache-2.0"
{% else %}
license-file = "LICENSE"
{% endif %}
```

Conditions are ordinary boolean expressions. Comparison and logic operators
follow Lua conventions — the statement bodies of ATL compile to Lua:

| Operator | Meaning |
|---|---|
| `==` | equal |
| `~=` | not equal |
| `and`, `or`, `not` | boolean logic |
| `<`, `<=`, `>`, `>=` | comparison |

A bare variable is truthy when it is set and not `false`, so
`{% if use_docker %}` works exactly as you'd expect for a confirmation prompt.
For membership tests, use the `contains` builtin:

```jinja
{% if contains(features, "metrics") %}
metrics = { enabled = true }
{% endif %}
```

Blocks close with `{% endif %}` / `{% endfor %}`, or the shorter `{% end %}` —
both are accepted; pick one style and stay consistent.

## Loops

Iterate a list:

```jinja
[workspace]
members = [
    ".",
{% for m in workspace_members %}
    "{{ m }}",
{% endfor %}
]
```

Iterate with an index (1-based), or over a map's key/value pairs:

```jinja
{% for i, step in enumerate(steps) %}
{{ i }}. {{ step }}
{% endfor %}

{% for alias, cmd in cargo_aliases %}
{{ alias }} = "{{ cmd }}"
{% endfor %}
```

Numeric ranges use `range(n)` (0 to n−1, exclusive upper bound) or
`range(start, stop)`:

```jinja
{% for i in range(3) %}
worker-{{ i }}
{% endfor %}
```

## Comments

`{# ... #}` is stripped entirely from output — notes to future maintainers of
the archetype, invisible to its users:

```jinja
{# The trailing comma matters: workspace_members can be empty. #}
```

## Whitespace control

Block tags like `{% if %}` sit on their own lines, and by default those lines
leave residue: the newline after the tag and the indentation before it both
land in the output. For generated *code*, that residue matters.

Given this template:

```jinja
dependencies = [
    {% if use_serde %}
    "serde",
    {% endif %}
]
```

With default settings the rendered output keeps the tag lines' whitespace:

```text
dependencies = [
    
    "serde",
    
]
```

Two manifest settings fix this globally. In `archetype.yaml`:

```yaml
templating:
  trim_blocks: true      # strip the newline right after a block tag
  lstrip_blocks: true    # strip indentation before a tag on its own line
```

Now the same template renders cleanly:

```text
dependencies = [
    "serde",
]
```

This is why real-world code-generating archetypes enable both — see
[Templating Configuration](configuration) for the full rationale.

You can also control whitespace per-tag with a `-` just inside the delimiter:
`{{- value }}` eats whitespace before the expression, `{% if x -%}` eats
whitespace (through the newline) after the tag. These work regardless of the
manifest settings and are handy for one-off tight spots:

```jinja
Hello {{- " " -}} world
```

## Escaping literal delimiters

If a generated file must itself contain `{{` or `{%` (a CI config with its own
templating, or a meta-archetype that generates archetypes), you have two tools.
For a block of content, `{% raw %}`:

```jinja
{% raw %}
image: {{ .Values.image }}   # emitted verbatim, not rendered
{% endraw %}
```

For inline spots, the built-in escape constants `LEFT_EXPR`/`RIGHT_EXPR` and
`LEFT_STMT`/`RIGHT_STMT` (short aliases `LE`/`RE`/`LS`/`RS`) expand to the
literal delimiter text:

```jinja
{{ LE }} project_name {{ RE }}
```

renders as `{{ project_name }}`.

## Includes

`{% include "path.atl" %}` splices another template file's rendered body in
place. Paths resolve against your archetype's `includes/` directory (and, when
you compose libraries, against their shared partials — see
[Organizing Templates](organizing-templates)):

```jinja
{% include "license-header.atl" %}

pub struct {{ ProjectName }} {
    // ...
}
```

Included fragments see the same flat context as the including template, and
includes can nest (cycles are detected and reported as errors). Paths must stay
inside the includes tree — absolute paths and `..` segments are rejected.
