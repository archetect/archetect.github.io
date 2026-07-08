---
sidebar_position: 8
---

# Libraries

A **library** is an archetype whose job is to be *used by other archetypes*: shared Lua modules, shared template fragments, shared conventions. Where [composition](./composition) reuses behavior (prompts and rendered files), libraries reuse *code and partials*.

## Mounting a library

Declare the dependency in your manifest's `catalog:` with `library: true`:

```yaml
# archetype.yaml
catalog:
  editor-config:
    description: "EditorConfig + gitattributes partials"
    source: "https://github.com/archetect-common/editor-config-library.git"
    library: true
    show: false
```

At load time — before your script runs — Archetect resolves the library and stages two of its directories under the entry's name (its *mount key*, here `editor-config`):

- the library's **`lib/`** is added to the Lua `package.path`, so your script can `require` its modules;
- the library's **`includes/`** joins the template include search path, namespaced by mount key.

`library: true` and `show: false` are independent flags — a library can also appear in menus if that's useful; hiding it is just the common choice for plumbing.

## Using a library's Lua modules

```lua
local headers = require("license-headers.mit")
context:set("license_header", headers.for_language("rust"))
```

The exact module names are the library's documented API — check its README.

## Using a library's includes

From templates, include a library partial via its mount-key-prefixed path:

```jinja
{% include "editor-config/editorconfig-rust.atl" %}
```

## Writing a library

A library is an ordinary archetype that emphasizes `lib/` and `includes/`:

```text
editor-config-library/
├── archetype.yaml
├── archetype.lua        # optional — often minimal or absent behavior
├── lib/
│   └── editorconfig.lua
└── includes/
    ├── editorconfig-rust.atl
    └── editorconfig-web.atl
```

Because a library is an archetype, it can still be rendered directly — useful for a standalone mode (render *your* `.editorconfig`) alongside library duty.

### Library-aware scripts

The `archetype` global tells a script how it's running, so one archetype can behave correctly in both modes:

```lua
if archetype.is_library() then
  -- Mounted by a parent: publish data for the parent, render nothing
  log.debug("mounted as " .. archetype.mount_key())
else
  -- Standalone render
  directory.render("contents", context)
end
```

And `archetype.include_path(rel)` builds include paths that work in both modes — in library mode it returns `"<mount_key>/<rel>"`, standalone just `rel`:

```lua
context:set("editorconfig_partial", archetype.include_path("editorconfig-rust.atl"))
```

```jinja
{% include editorconfig_partial %}
```

## Versioning and distribution

Libraries are distributed like any archetype — git repositories. Consumers pin whatever ref their `source` URL expresses, and updates flow with `git push` + cache refresh (`-U`). Within an organization, a small set of shared libraries (prompt conventions, license headers, editor config) keeps a whole catalog of archetypes consistent.
