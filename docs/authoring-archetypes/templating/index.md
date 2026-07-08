---
sidebar_position: 3
sidebar_label: Templating
---

# Templating with ATL

ATL — the Archetect Template Language — is the engine that turns your archetype's
template files into a rendered project. If you have used Jinja2, Liquid, or any
`{{ mustache }}`-flavored template language, ATL will feel immediately familiar:

```jinja
[package]
name = "{{ project_name }}"
description = "{{ description | default(project_name) }}"
```

This section is a practical guide to writing templates. For the complete,
exhaustive syntax and filter listings, see the
[ATL reference](../../reference/templating/).

## Where templates live

Templates are just ordinary files inside your archetype. There is no special
extension requirement and no registration step — any directory in your archetype
can be rendered as a template tree by calling
[`directory.render`](../scripting/rendering) from your `archetype.lua`:

```lua
directory.render("contents", context)
```

By convention, most archetypes keep their main template tree under `contents/`,
with shared fragments under `includes/`:

```text
my-archetype/
├── archetype.yaml
├── archetype.lua
├── contents/                     # rendered by directory.render("contents", ctx)
│   └── {{ project_name }}/       # directory NAMES are templates too
│       ├── Cargo.toml            # file contents are templates
│       └── src/
│           └── main.rs
└── includes/                     # partials reachable via {% include %}
    └── license-header.atl
```

## Everything is a template

When Archetect renders a directory tree, **both file contents and file/directory
names** pass through ATL:

- A directory literally named `{{ project_name }}` renders to `my_tool` (or
  however the user's answer is cased under that key).
- Every text file's contents are rendered with the same context.
- Binary files (images, jars, archives...) are detected automatically and copied
  through untouched — though their *names* are still rendered. See
  [Organizing Templates](organizing-templates) for details.

## The context is flat

Templates receive a flat set of variables — you write `{{ project_name }}`,
never `context.project_name`. Whatever your script puts into the
[Context](../scripting/working-with-context) is available by name.

Better still, [case expansion](../scripting/casing) means a single prompt
typically lands in the context under several spellings, each key cased like its
value:

| Key | Value |
|---|---|
| `project-name` | `my-tool` |
| `project_name` | `my_tool` |
| `projectName` | `myTool` |
| `ProjectName` | `MyTool` |
| `Project-Name` | `My-Tool` |
| `PROJECT_NAME` | `MY_TOOL` |

So instead of applying case filters everywhere, you usually just pick the key
whose casing matches the spot you're writing:

```jinja
pub struct {{ ProjectName }}Config {
    // lives in {{ project_name }}/src/config.rs
}
```

## A quick taste

```jinja
{# Comments never appear in output #}
[workspace]
members = [
    ".",
{% for m in workspace_members %}
    "{{ m }}",
{% endfor %}
]

{% if use_docker %}
# See docker/README.md for container workflow
{% endif %}

authors = ["{{ author_full }}"]
description = "{{ description | default(project_name) }}"
```

Three delimiters do all the work:

- `{{ ... }}` — expressions: variables, filters, function calls
- `{% ... %}` — statements: conditionals, loops, includes
- `{# ... #}` — comments, stripped from output

## Where to go next

- [Template Syntax](syntax) — variables, filters, conditionals, loops,
  whitespace control, includes
- [Filters & Functions](filters-and-functions) — a guided tour of the built-ins
  you'll reach for most
- [Organizing Templates](organizing-templates) — content roots, shared
  fragments, dynamic names, binary assets
- [Templating Configuration](configuration) — the `templating:` block in
  `archetype.yaml`
- [ATL Reference](../../reference/templating/) — the complete syntax and
  filter reference
