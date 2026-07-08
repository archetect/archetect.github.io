---
sidebar_position: 4
---

# catalog

The `catalog` global composes other archetypes from within a script. It dispatches to entries declared in this archetype's `catalog:` map (see the [Archetype Manifest](../archetype-manifest)) — prompting, rendering, and returning the child's resulting context to the parent. For composition patterns, see [Composition](../../authoring-archetypes/scripting/composition).

## `catalog.render`

```lua
catalog.render(context)                 --> Context  -- present root catalog as a menu
catalog.render(context, opts)           --> Context
catalog.render(path, context)           --> Context  -- dispatch to a named entry
catalog.render(path, context, opts)     --> Context
```

| Parameter | Type | Description |
|---|---|---|
| `path` | `string?` | Catalog entry path. Omit to present the root catalog entries as an interactive menu. Slash-separated for nested navigation (`"services/grpc"`): groups present a menu, leaves render directly. |
| `context` | `Context` | Parent context — its values pass through to the child as answers. The parent's own Context object is **not mutated**. |
| `opts` | `table?` | Options (below) |

### Options

| Option | Type | Description |
|---|---|---|
| `destination` | `string?` | Subdirectory to render into, relative to the current render destination (sandboxed: relative, no `..`/`~`) |
| `switches` | `string[]?` | Overlaid onto the switches the child inherits from the parent — `"name"` enables, `"name=false"` disables; unmentioned switches pass through |
| `use_defaults` | `string[]?` | Keys the child should use prompt defaults for. Overlaid onto the inherited set like `switches` (`"key=false"` removes) |
| `use_defaults_all` | `boolean?` | Use defaults for **all** of the child's prompts (overrides the inherited value in either direction) |

The child inherits the parent's switches, use-defaults, and use-defaults-all automatically; these options refine that inherited state rather than replacing it. A catalog entry's own pre-configured flags are applied after these options — the leaf entry is the most specific layer.

**Returns:** a fresh `Context` containing **only the keys the child wrote**. Parent answers the child merely read are not echoed back.

## Return-context semantics

`catalog.render` has value semantics: the parent's `context` argument is passed through as answers but never modified. The child gets a context seeded with the parent's data; whatever the child's script stores comes back as the returned Context. To absorb the child's contributions, merge explicitly:

```lua
context:merge(catalog.render("components/xtask", context))
```

Without the `merge`, the child still renders — you just discard its context output.

## Parent / child example

Parent `archetype.yaml`:

```yaml
catalog:
  rust-service:
    source: git@github.com:example/rust-service.archetype.git
```

Parent script:

```lua
local context = Context.new()

context:prompt_text("Project Name:", "project-name", {
    cases = Cases.programming(),
})

-- Render the child into a subdirectory, forcing one of its prompts
-- to take its default, then absorb what the child produced.
local child = catalog.render("rust-service", context, {
    destination = context:get("project-name"),
    switches = { "ci" },
    use_defaults = { "rust-edition" },
})
context:merge(child)

-- Keys the child wrote are now readable in the parent:
log.info("child produced service port: " .. tostring(context:get("service-port")))
```

Child script (inside the `rust-service` archetype):

```lua
local context = Context.new()

-- Already answered: "project-name" arrived from the parent's context.
context:prompt_text("Project Name:", "project-name", { cases = Cases.programming() })

-- New key: this is what flows back to the parent.
context:prompt_int("Service Port:", "service-port", { default = 8080 })

directory.render("contents", context)
```

## Menus and errors

- `catalog.render(context)` with no path presents the root catalog entries as an interactive menu — the user picks what to render.
- A path pointing at a group presents that group as a menu; a path pointing at a leaf renders it directly.
- Calling `catalog.render` when the manifest declares no `catalog:` map is an error.
- If the user aborts a prompt inside the child, the abort propagates and the render terminates cleanly.
