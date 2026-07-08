---
sidebar_position: 1
---

# Lua Basics

You don't need deep Lua to write archetypes — real-world scripts are configuration and orchestration, not algorithms. This page is the subset you'll actually use. (Already know Lua? Skip to [Working with Context](./working-with-context).)

## Variables and types

```lua
local name = "billing-service"   -- string
local count = 3                  -- number
local enabled = true             -- boolean
local nothing = nil              -- absence of a value
```

Declare with `local` — always. Bare assignments create globals, which invites collisions.

## Strings

```lua
local greeting = "Hello, " .. name          -- concatenation with ..
local shout = string.upper(name)            -- stdlib functions
local msg = string.format("%s (%d)", name, count)
```

## Tables

Lua's one data structure — it's both an array and a map:

```lua
-- As an array (lists of options, switches, …)
local licenses = { "MIT", "Apache-2.0", "GPL-3.0" }
print(licenses[1])          --> MIT   (1-indexed!)

-- As a map (options tables everywhere in the Archetect API)
local opts = {
  default = "MIT",
  help = "The license for generated code",
}
print(opts.default)         --> MIT
```

Almost every Archetect function takes an *options table* as its last argument — that's the `{ default = ..., cases = ... }` pattern you'll see throughout these docs.

## Conditionals

```lua
if context:get("use_docker") then
  directory.render("docker", context)
elseif context:get("use_podman") then
  directory.render("podman", context)
else
  log.info("No container support selected")
end
```

Only `false` and `nil` are falsy — `0` and `""` are truthy (unlike some languages).

Handy inline pattern:

```lua
local dir = context:get("subdir") or "src"    -- fallback when nil/false
```

## Loops

```lua
-- Over an array
for _, feature in ipairs(features) do
  log.info("Enabling " .. feature)
end

-- Over a map
for key, value in pairs(answers) do
  log.debug(key .. " = " .. tostring(value))
end
```

## Functions

```lua
local function full_name(first, last)
  return first .. " " .. last
end
```

## Methods vs. functions — `:` vs. `.`

This trips up newcomers, and the Archetect API uses both:

```lua
context:prompt_text(...)                     -- colon: METHOD on an object
archetype.switches.is_enabled("docker")      -- dot: plain function in a table
```

Rule of thumb: operations *on a Context* use `:`; everything else in the API uses `.`. The [reference](../../reference/lua-api/) shows the correct call style for every function — and if you run `archetect ide setup`, your editor will correct you in real time.

## Modules

```lua
local git = require("archetect.git")   -- built-in Archetect modules
local helpers = require("helpers")     -- your own, from the archetype's lib/
```

## Errors

Archetect API functions raise errors on failure (bad paths, failed commands), which stop the render with a stack trace — usually exactly what you want. To handle a failure gracefully instead:

```lua
local ok, err = pcall(function()
  shell.run("cargo", { "fmt" })
end)
if not ok then
  log.warn("cargo fmt failed: " .. tostring(err))
end
```

## That's genuinely most of it

Production archetype scripts rarely exceed ~150 lines and use nothing beyond what's on this page. Continue to [Working with Context](./working-with-context).
