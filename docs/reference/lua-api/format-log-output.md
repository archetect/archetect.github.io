---
sidebar_position: 5
---

# format, log & output

Utility globals for serialization, logging, and user-facing output.

## `format`

Serialize values to — and parse values from — structured text formats. The `to_*` functions accept a `Context` or a plain Lua table; the `from_*` functions return plain Lua tables.

| Function | Signature | Returns |
|---|---|---|
| `format.to_json(value)` | `Context \| table → string` | Pretty-printed JSON |
| `format.to_yaml(value)` | `Context \| table → string` | YAML |
| `format.to_toml(value)` | `Context \| table → string` | TOML (top-level value must be a table/map) |
| `format.from_json(s)` | `string → table` | Parsed Lua table |
| `format.from_yaml(s)` | `string → table` | Parsed Lua table |
| `format.from_toml(s)` | `string → table` | Parsed Lua table |

Parse errors and serialization errors (e.g. TOML with a non-table top level) raise Lua errors.

```lua
-- Read structured data shipped with the archetype and fold it in:
local defaults = format.from_yaml(file.read("defaults.yaml"))
context:merge(defaults)

-- Serialize context data for logging or templating:
local as_json = format.to_json({
    name = context:get("project-name"),
    port = context:get("service-port"),
})
log.debug(as_json)
```

:::caution Deprecated aliases
`format.json`, `format.yaml`, and `format.toml` are deprecated aliases for `format.to_json` / `to_yaml` / `to_toml`, kept for older archetypes. Prefer the `to_*` names; the aliases may be removed.
:::

### The answer-file round-trip

`tostring(ctx)` on a Context emits YAML equivalent to `format.to_yaml(ctx)` — and that YAML is a valid [answer file](../answer-files). Dumping a context therefore doubles as "the answers that would reproduce this render":

```lua
-- Debug what's in the context:
log.debug(tostring(context))

-- Persist an answer file alongside the render for repeatability:
template.render(tostring(context), context, {
    destination = ".archetect-answers.yaml",
    if_exists = Existing.Overwrite,
})
```

## `log`

Structured logging. Messages go to Archetect's logging system (filtered by the current log level), not directly to the user's terminal output stream.

| Function | Level |
|---|---|
| `log.trace(message)` | Trace |
| `log.debug(message)` | Debug |
| `log.info(message)` | Info |
| `log.warn(message)` | Warn |
| `log.error(message)` | Error |

```lua
log.info("rendering service " .. context:get("project-name"))
log.debug(tostring(context))
```

Use `log.*` for diagnostics an author or troubleshooting user might want; use `output.*` for messages every user should see.

## `output`

User-facing output — always displayed regardless of log level.

| Function | Stream | Purpose |
|---|---|---|
| `output.print(message)` | stdout | Plain message to the user |
| `output.banner(message)` | stderr | Prominent banner / display message |

```lua
output.banner("Next steps")
output.print("cd " .. context:get("project-name") .. " && cargo run")
```

Because `output.print` writes to stdout and `output.banner` to stderr, `print` is the right choice when the rendered output may be piped, and `banner` for attention-grabbing status that shouldn't pollute a pipeline.

## `exit()`

```lua
exit()
```

Cleanly terminates the script, signaling successful completion — not an error. Anything already rendered stays rendered; nothing after the call runs.

```lua
if file.exists("Cargo.toml", { within = Location.Destination }) then
    output.print("Project already exists — nothing to do.")
    exit()
end
```
