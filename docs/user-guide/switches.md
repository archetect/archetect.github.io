---
sidebar_position: 4
---

# Switches

Switches are named on/off flags that archetypes use to gate optional behavior — extra files, alternative configurations, whole feature sets. Where *answers* carry values, *switches* carry intent: "include Docker support", "wire up GitHub Actions".

## Enabling switches

On the command line, with `-s` / `--switch` (repeatable):

```shell
archetect render <source> -s docker -s github-actions
```

In your configuration, for switches you always want:

```yaml
# ~/.config/archetect/archetect.yaml
switches:
  - github-actions
```

Catalog entries can pre-enable switches too, so a catalog can offer the same archetype in different configurations:

```yaml
catalog:
  grpc-service:
    description: "gRPC Service (with Docker)"
    source: "git@github.com:acme/grpc-service.git"
    switches: ["docker"]
```

## Layers and opting out

Switches accumulate across layers, applied in this order — each layer *overlays* the previous ones, item by item:

1. User configuration (`~/.config/archetect/archetect.yaml`)
2. `etc.d/*.yaml` drop-ins (sorted)
3. Project configuration (`.archetect.yaml`)
4. `--config-file`
5. Command line (`-s`)
6. A parent archetype's `catalog.render(..., { switches = ... })` options
7. The catalog entry being rendered

A layer never clears switches it doesn't mention. To *disable* a switch enabled by an earlier layer, use `name=false`:

```shell
# github-actions is on in your user config, but not for this render:
archetect render <source> -s github-actions=false
```

The same syntax works in every layer — config files, catalog entries, and `catalog.render` options:

```yaml
catalog:
  grpc-service-slim:
    description: "gRPC Service (no Docker)"
    source: "git@github.com:acme/grpc-service.git"
    switches: ["docker=false"]    # suppress an inherited switch
```

`name` and `name=true` are equivalent; any other value is an error. Child renders inherit the parent's switches automatically.

## What switches do

That's up to the archetype. Inside its script, an archetype checks:

```lua
if archetype.switches.is_enabled("docker") then
  directory.render("docker", context)
end
```

Which switches an archetype understands should be part of its README or description — Archetect doesn't validate switch names, so an unrecognized switch is silently inert.

## Switches vs. answers vs. prompts

| Mechanism | Shape | Best for |
|---|---|---|
| Prompt + answer | key = value | Information the project needs (names, choices, counts) |
| Switch | on/off | Opt-in behavior the *caller* decides (CI flavor, extras) |
| Confirm prompt | yes/no question | Opt-in behavior the *user* should be asked about |

Authors: see [Switches & Conditionals](../authoring-archetypes/scripting/switches-and-conditionals) for the scripting side.
