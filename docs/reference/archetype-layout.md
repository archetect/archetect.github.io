---
sidebar_position: 8
---

# Archetype Layout

The normative directory and file layout of an archetype on disk. For a guided tour, see [Anatomy of an Archetype](../authoring-archetypes/anatomy).

## Files and Directories

| Path | Required | Purpose |
|---|---|---|
| `archetype.yaml` | **Yes** | The [manifest](./archetype-manifest). Loading a directory without one fails. (`archetype.yml`, `archetect.yaml`, `archetect.yml` are accepted aliases, in that priority order.) |
| `archetype.lua` | No | The Lua entry-point script. The filename is **fixed** — Archetect looks for exactly `archetype.lua` at the archetype root. |
| `interface.yaml` | No | Declarative [input contract](./archetype-manifest#interface). Takes precedence over an inline `interface:` section in the manifest. (`interface.yml` also accepted.) |
| Content directories | No | Template trees rendered via `directory.render(path, context)`. Any name, any number — paths are root-relative. |
| `lib/` | No | Lua modules. Automatically on `package.path` — `require("helpers")` resolves `lib/helpers.lua`. Also what gets staged into consumers when this archetype is used as a [`library: true`](./catalog-manifest#library-true) dependency. |
| `includes/` | No | [ATL](./templating/) include templates. Automatically on the include search path — `{% include "header.atl" %}` resolves here. Also staged into consumers for library dependencies. |

## Runtime Behavior

What happens when an archetype is rendered depends on which pieces are present:

| Has `archetype.lua`? | Has `catalog:`? | Behavior |
|---|---|---|
| Yes | either | The script runs. Catalog entries are available to the script (`catalog.render(...)`), and `library: true` entries are staged before the script starts. |
| No | Yes | Pure catalog: entries are presented as an interactive menu (or dispatched directly when an action path is given, e.g. `archetect render <url> common/gitignore`). |
| No | No | Library archetype: a repo that exists purely to expose `lib/` and `includes/` to consumers. Rendering it directly prints a friendly explanation and exits cleanly. |

### Content Directories

There is no fixed "content" directory name and no content prefix configuration. The script addresses template trees by root-relative path:

```lua
directory.render("contents/base", ctx)          -- renders <root>/contents/base
if archetype.switches.is_enabled("with_ci") then
  directory.render("contents/ci", ctx)          -- conditionally render more
end
```

See [Lua API: Rendering](./lua-api/rendering).

### `lib/` and `package.path`

Before the script runs, Archetect prepends to Lua's `package.path`, in order:

1. The archetype root (`<root>/?.lua`, `<root>/?/init.lua`) — lets a library's own shim reach `lib/init.lua` via `require("lib")`.
2. The archetype's own `lib/` (`lib/?.lua`, `lib/?/init.lua`) — `require("helpers")` finds `lib/helpers.lua`.
3. The staging area for [`library: true`](./catalog-manifest#library-true) catalog entries — each library's `lib/` is mounted under its catalog map key, so `require("inflect-helpers.casing")` finds the `inflect-helpers` library's `lib/casing.lua`.

Because these are prepended, they take precedence over Lua's default search paths.

### `includes/` and the ATL Search Path

The include resolver searches, in order:

1. The archetype's own `includes/` — `{% include "header.atl" %}`.
2. Staged library `includes/` directories, namespaced by catalog map key — `{% include "inflect-helpers/header.atl" %}`.

## Example Tree

```text
rust-grpc-service/
├── archetype.yaml            # manifest (required)
├── interface.yaml            # declarative input contract (optional)
├── archetype.lua             # entry-point script (fixed name)
├── lib/                      # Lua modules → require("naming"), require("prompts")
│   ├── naming.lua
│   └── prompts.lua
├── includes/                 # ATL includes → {% include "license-header.atl" %}
│   └── license-header.atl
└── contents/                 # content trees (any names) → directory.render("contents/...")
    ├── base/
    │   ├── Cargo.toml.atl
    │   └── src/
    │       └── main.rs.atl
    └── ci/
        └── .github/
            └── workflows/
                └── ci.yaml.atl
```

With the matching manifest and script:

```yaml
# archetype.yaml
description: "Rust gRPC Service"
requires:
  archetect: "3.0.0"
catalog:
  inflect-helpers:
    source: "git@github.com:org/inflect-helpers.git"
    library: true            # lib/ and includes/ staged before the script runs
```

```lua
-- archetype.lua
local naming = require("naming")                    -- from lib/
local casing = require("inflect-helpers.casing")    -- from the staged library

local ctx = Context.new()
ctx:prompt_text("Project Name:", "project_name")

directory.render("contents/base", ctx)
if archetype.switches.is_enabled("with_ci") then
  directory.render("contents/ci", ctx)
end

return ctx
```
