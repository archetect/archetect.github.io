---
sidebar_position: 3
---

# Organizing Templates

A template tree is only half the story — how you *arrange* your templates
determines how flexible your archetype is. This page covers the patterns that
show up in well-structured archetypes: multiple content roots, shared
fragments, library partials, dynamic names, and binary assets.

## Content roots

Nothing about the directory name `contents/` is magic. Your script renders any
directory in the archetype by path:

```lua
directory.render("contents", context)
```

That means you can keep *several* content roots and render each one
conditionally. This is far cleaner than threading `{% if %}` guards through
dozens of files:

```text
my-archetype/
├── contents/          # always rendered
│   └── {{ project_name }}/...
├── docker/            # only when requested
│   └── {{ project_name }}/
│       ├── Dockerfile
│       └── .dockerignore
└── ci/                # only when requested
    └── {{ project_name }}/.github/workflows/ci.yml
```

```lua
directory.render("contents", context)

if archetype.switches.is_enabled("docker") or context:get("use_docker") then
    directory.render("docker", context)
end

if context:get("use_ci") then
    directory.render("ci", context)
end
```

Gating on a [switch](../scripting/switches-and-conditionals) lets power users
opt in from the command line; gating on a prompt answer keeps the interactive
flow friendly. Many archetypes do both, as above.

`directory.render` also accepts a destination subdirectory, useful when a root
shouldn't wrap itself in the project directory:

```lua
directory.render("extras/monitoring", context, {
    destination = context:get("project_name"),
})
```

## Shared fragments: `includes/`

Anything you'd otherwise copy-paste across templates — license headers,
config sections, boilerplate blocks — belongs in your archetype's `includes/`
directory, spliced in with `{% include %}`:

```text
my-archetype/
├── includes/
│   └── license-header.atl
└── contents/
    └── {{ project_name }}/src/main.rs
```

```jinja
{% include "license-header.atl" %}

fn main() {
    println!("{{ project_name }}");
}
```

The `includes/` location is fixed by convention — it's automatically on the
include search path, no configuration needed. Included fragments share the
including template's flat context, so a fragment can freely use
`{{ project_name }}`, loops, conditions, and even further includes.

The `.atl` extension is conventional for fragments (it signals "this is a
partial, not a file to be emitted"), but any text file works.

## Library includes

When your archetype [composes a library](../scripting/rendering) — a catalog
entry marked `library: true` — that library's `includes/` directory joins the
include search path too, namespaced under the catalog key you mounted it with:

```yaml
catalog:
  editor-config:
    source: "https://github.com/archetect-common/editor-config-library.git"
    library: true
    show: false
```

Your templates can now reference the library's partials with the mount key as
a prefix:

```jinja
{% include "editor-config/editorconfig-root.atl" %}
{% include "editor-config/editorconfig-rust.atl" %}
```

Your own `includes/` is searched first, so you can shadow a library partial by
shipping a file at the same relative path (e.g.
`includes/editor-config/editorconfig-rust.atl`) — handy for overriding one
fragment while keeping the rest of the library.

### Publishing include paths from a library

If you *author* libraries, there's a wrinkle: the library doesn't know what
mount key consumers will pick. `archetype.include_path(rel)` solves this — in
library mode it returns `"<mount_key>/<rel>"`, and standalone it returns `rel`
unchanged. Libraries use it to publish ready-to-use include paths into the
consumer's context:

```lua
-- In the library's module, during its prompt phase:
if archetype.is_library() then
    local components = context:get("components") or {}
    components.editor_config = {
        section_includes = {
            rust = archetype.include_path("editorconfig-rust.atl"),
        },
    }
    context:set("components", components)
end
```

Consumers (and the library itself) can then use those published paths from
Lua — for example with `file.render`, which resolves sources against the
include search path:

```lua
local sections = context:get("components").editor_config.section_includes
file.render(sections.rust, context, { destination = ".editorconfig" })
```

Note that `{% include %}` inside a *template* takes a quoted literal path
only — it is resolved when the template is compiled, so it cannot accept a
context expression. When a template needs a library partial, spell out the
mount-key-prefixed path as shown above.

## Dynamic file and directory names

File and directory names are templates, subject to the same rendering as
contents. The canonical use is wrapping the whole output in the project
directory:

```text
contents/
└── {{ project_name }}/
    ├── Cargo.toml
    └── src/main.rs
```

Names can use filters and any context key — including the kebab-cased and
other case-expanded spellings:

```text
contents/
└── {{ project-name }}/
    └── src/main/java/
        └── {{ package | directory_case }}/
            └── {{ ProjectName }}Application.java
```

Because the flat context carries every case spelling, picking the right key
(`{{ project_name }}` vs `{{ ProjectName }}`) is usually all the "logic" a
name needs.

## Binary and asset files

You don't need to do anything special for images, fonts, archives, or other
non-text assets dropped into a content root. Before rendering each file,
Archetect inspects its content: files detected as binary are **copied through
byte-for-byte**, never parsed as templates. Text files are rendered.

Two things to note:

- The binary file's **name** is still rendered — `{{ project_name }}-logo.png`
  works as expected.
- Detection is content-based, not extension-based. A text file full of
  `{{ ... }}`-looking sequences that you *don't* want rendered isn't a binary —
  protect it with `{% raw %}` blocks instead (see
  [Template Syntax](syntax#escaping-literal-delimiters)).
