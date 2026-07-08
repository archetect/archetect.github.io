---
sidebar_position: 4
---

# Casing

Code generation lives and dies by naming: the same concept must appear as `payment_gateway` in one file, `PaymentGateway` in another, `payment-gateway` in a third. Archetect's case expansion means the user types the name **once**.

## Case expansion

Pass `cases` to a prompt (or `context:set`), and the answer expands into multiple context entries — the *key* is transformed to match each case, and the *value* likewise:

```lua
context:prompt_text("Project Name:", "project-name", {
  cases = Cases.programming(),
})
```

For the input `rocket launcher`:

| Context key | Value |
|---|---|
| `project-name` | `rocket-launcher` |
| `project_name` | `rocket_launcher` |
| `projectName` | `rocketLauncher` |
| `ProjectName` | `RocketLauncher` |
| `Project-Name` | `Rocket-Launcher` |
| `PROJECT_NAME` | `ROCKET_LAUNCHER` |

Templates then read whichever spelling fits the spot:

```jinja
pub struct {{ ProjectName }}Config {}     // PascalCase where Rust wants it
const {{ PROJECT_NAME }}_VERSION: …       // CONSTANT_CASE where that fits
[package] name = "{{ project-name }}"     // kebab-case for the package
```

:::tip Use a canonical key form
Name the prompt key in kebab-case or snake_case (`project-name`, not `projectName`). The original key is also written as one of the case variants, so a canonical form avoids colliding with a derived key.
:::

## The presets

```lua
Cases.programming()   -- Snake, Pascal, Camel, Kebab, Train, Constant — the everyday set
Cases.all()           -- every style, including Title, Sentence, Package, Directory, Cobol
```

## Custom sets

```lua
-- Exactly the styles you want
Cases.set(Case.Snake, Case.Pascal)

-- A fixed key with a specific style — for keys whose shape can't mirror the case
Cases.fixed("project-title", Case.Title)

-- Preserve the raw, untransformed input under a fixed key
Cases.input("project-raw")
```

These combine — pass a list:

```lua
context:prompt_text("Project Name:", "project-name", {
  cases = { Cases.programming(), Cases.fixed("project-title", Case.Title) },
})
-- programming variants + project-title = "Rocket Launcher"
```

## Available styles

`Case.Snake`, `Case.Pascal`, `Case.Camel`, `Case.Kebab`, `Case.Train`, `Case.Constant`, `Case.Title`, `Case.Lower`, `Case.Upper`, `Case.Sentence`, `Case.Package` (`package.case`), `Case.Directory` (`directory/case`), `Case.Cobol` (`COBOL-CASE`), plus `Case.Plural` and `Case.Singular` for inflection.

## Direct transformation

Case styles also work as plain functions, for when you need a transformation mid-script rather than an expansion:

```lua
local module_dir = Case.Directory:apply(context:get("package"))   -- "com.acme.billing" → "com/acme/billing"
```

## Casing in templates instead

Templates have matching filters (`{{ name | pascal_case }}`, `{{ name | snake_case }}`, …) — see [Filters & Functions](../templating/filters-and-functions). Rule of thumb: **case expansion** when a value is used in many places (it keeps templates clean); **filters** for one-off transformations.
