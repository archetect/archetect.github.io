---
sidebar_position: 7
---

# Composition

Big archetypes aren't written — they're *composed*. A project archetype delegates its organization prompts to a shared component, mounts an `xtask` crate from another, and wraps it all in its own content. Composition is how archetype ecosystems stay DRY.

## Declaring composable archetypes

Children are declared in the manifest's `catalog:` section:

```yaml
# archetype.yaml
catalog:
  org-prompts:
    description: "Organization + solution name prompts"
    source: "https://github.com/archetect-common/org-prompts-component.git"
    show: false
  xtask:
    description: "xtask workspace crate"
    source: "https://github.com/archetect-rust/rust-xtask-component.git"
    show: false
    answers:
      xtask_embedded: true
```

- `source` is any archetype source — git URL or local path.
- `show: false` hides the entry from interactive menus; it stays callable from the script. Use it for private building blocks.
- `answers` and `switches` pre-configure the child for this parent's purposes.

## Rendering a child

```lua
context:merge(catalog.render("org-prompts", context))
```

`catalog.render(path, context, opts)` runs the child archetype — its prompts, its script, its content — and returns a **Context containing only the keys the child wrote**. Merging that back in is how the child's answers become available to your templates.

The parent's context is passed *through*, so anything already answered (by the user or by you) is visible to the child's prompts — a child won't re-ask what's already known.

## Aiming children at subdirectories

By default a child renders into the same destination as the parent. Point it elsewhere with `destination`:

```lua
local project_dir = context:get("project_name")
context:merge(catalog.render("xtask", context, { destination = project_dir }))
```

This is the standard pattern for components that "work standalone but compose inward": standalone, the xtask component renders at the destination root; composed, the parent aims it inside the project directory.

Other options mirror the CLI:

```lua
catalog.render("ci", context, {
  switches = { "github-actions" },
  use_defaults = { "workflow_name" },
  use_defaults_all = false,
})
```

## Steering children with context

Because children see the parent's context, you can shape their behavior by setting agreed-upon keys before the call — a lightweight contract between parent and child:

```lua
-- The project-prompts component honors suffix_options / suffix_default
context:set("suffix_options", { "cli" })
context:set("suffix_default", "cli")
context:merge(catalog.render("project-prompts", context))
```

Document such keys in the component's README; they're its real API.

## A composed archetype, end to end

The pattern in a production Rust CLI archetype:

```lua
local context = Context.new()

-- 1. Shared identity prompts (org, project name, author) — composed components
context:merge(catalog.render("org-prompts", context))
context:merge(catalog.render("project-prompts", context))
context:merge(catalog.render("author-prompts", context))

-- 2. Optional GitHub integration
context:prompt_confirm("Publish to GitHub?", "use_github", { default = false })
if context:get("use_github") then
  context:merge(catalog.render("github-prompts", context))
end

-- 3. Composed xtask crate, aimed inside the project directory
local project_dir = context:get("project_name")
context:merge(catalog.render("xtask", context, { destination = project_dir }))

-- 4. The parent's own content
directory.render("contents", context)
```

Users see one seamless flow of prompts; behind it, four archetypes cooperated.

## Menus from scripts

`catalog.render` can also target *group* entries (ones with nested `catalog:` rather than `source:`), presenting that submenu interactively — useful for archetypes that are themselves interactive hubs. Paths are slash-separated: `catalog.render("services/grpc", context)`.

## Composition vs. libraries

Composition **renders** another archetype — prompts run, files appear. A [library](./libraries) **mounts** another archetype's Lua modules and template fragments into yours without rendering anything. Reach for composition to reuse *behavior and content*; reach for libraries to reuse *code and partials*.
