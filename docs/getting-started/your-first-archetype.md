---
sidebar_position: 5
---

# Your First Archetype

In about fifteen minutes, you'll build a working archetype from scratch and render it. The result: a project generator that prompts for a name and a license, then produces a correctly-cased project tree.

## 1. Create the skeleton

```shell
mkdir -p hello-archetype/contents
cd hello-archetype
```

An archetype needs three things: a **manifest**, a **script**, and **content** to render.

## 2. Write the manifest

Create `archetype.yaml`:

```yaml
description: "Hello Archetype"
authors: ["Jane Developer"]

requires:
  archetect: "3.0.0"
```

The `description` tells users what this archetype does; `requires.archetect` declares the minimum Archetect version it needs.

## 3. Write the script

Create `archetype.lua`:

```lua
local context = Context.new()

context:prompt_text("Project Name:", "project-name", {
  default = "hello-world",
  cases = Cases.programming(),
})

context:prompt_select("License:", "license", { "MIT", "Apache-2.0", "None" }, {
  default = "MIT",
})

directory.render("contents", context)
```

Three things happen here:

1. `Context.new()` creates the **context** — the variable map that templates will read.
2. Two **prompts** gather input. The `cases = Cases.programming()` option is the interesting part: a single answer expands into every casing a codebase needs (you'll see this pay off in a moment).
3. `directory.render("contents", context)` renders everything under `contents/` into the destination.

## 4. Add templated content

File *names* are templates too. Create this structure — the `{{ project-name }}` directory name is literal, curly braces and all:

```text
contents/
└── {{ project-name }}/
    ├── README.md
    └── src/
        └── main.rs
```

`contents/{{ project-name }}/README.md`:

```jinja
# {{ Project-Name }}

Licensed under {{ license }}.
```

`contents/{{ project-name }}/src/main.rs`:

```jinja
fn main() {
    println!("Hello from {{ ProjectName }}!");
}
```

Notice the different variable spellings. Because the prompt used `cases = Cases.programming()`, answering one prompt populated all of these:

| Key | Value (for input `rocket launcher`) |
|---|---|
| `project-name` | `rocket-launcher` |
| `project_name` | `rocket_launcher` |
| `projectName` | `rocketLauncher` |
| `ProjectName` | `RocketLauncher` |
| `Project-Name` | `Rocket-Launcher` |
| `PROJECT_NAME` | `ROCKET_LAUNCHER` |

The *key itself* is written in the casing it delivers — so templates read naturally: `{{ ProjectName }}` where PascalCase belongs, `{{ project_name }}` where snake_case belongs.

## 5. Render it

Render from a sibling directory, answering interactively:

```shell
cd ..
archetect render hello-archetype
```

```text
Project Name: rocket launcher
License: MIT
```

Or non-interactively:

```shell
archetect render hello-archetype -a "project-name=rocket launcher" -a license=MIT --headless
```

Either way, the result:

```text
rocket-launcher/
├── README.md
└── src/
    └── main.rs
```

`rocket-launcher/README.md`:

```markdown
# Rocket-Launcher

Licensed under MIT.
```

`rocket-launcher/src/main.rs`:

```rust
fn main() {
    println!("Hello from RocketLauncher!");
}
```

You typed `rocket launcher` once; every file and directory got the right casing.

:::tip Debugging trick
Add `output.print(format.to_yaml(context))` to your script to print the full context — every key and value — during a render. The output is valid answer-file YAML, so you can save it and replay the render with `-A`.
:::

## 6. Publish it (optional)

An archetype is just a directory — push it to a git repository and it's published:

```shell
cd hello-archetype
git init && git add . && git commit -m "Hello Archetype"
git remote add origin git@github.com:your-org/hello-archetype.git
git push -u origin main
```

Anyone can now render it:

```shell
archetect render https://github.com/your-org/hello-archetype.git
```

## Where to go from here

This archetype only scratches the surface. Real archetypes add conditional content, composed sub-archetypes, switches, git automation, and more:

- [Authoring Archetypes](../authoring-archetypes/) — the complete authoring guide.
- [Scripting with Lua](../authoring-archetypes/scripting/) — prompts, context, rendering, and composition in depth.
- [Templating with ATL](../authoring-archetypes/templating/) — syntax, filters, and template organization.
- Run `archetect ide setup` to get full autocomplete for the Archetect Lua API in your editor — see [IDE & Tooling](../user-guide/ide-and-tooling).
