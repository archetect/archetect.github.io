---
sidebar_position: 4
---

# Derived Interfaces

Your Lua script defines what an archetype *does* — and because every input flows through a
`ctx:prompt_*` call, it also defines what it *needs*. Archetect derives the interface by
**probing the script**: running it against a recording driver that answers prompts instead
of asking anyone, discards writes, forbids shell execution, and captures every prompt's
full envelope along the way.

There is nothing to declare and nothing to keep in sync. The prompts are the interface.

```
archetect interface <source | catalog-path>
```

```
# Derived interface — services/grpc
mode: Interactive · coverage: DefaultPath · 1 run(s)

Prompts (answer with -a <key>=<value> / -A <file> / MCP answers):
  project_name         text  ·  required  ·  pattern: ^[a-z][a-z0-9-]*$
                         "Project Name:"
  database             select  ·  default: "postgres"  ·  options: [postgres, sqlite]
                         "Database:"

Switches (enable with -s <name>; never prompted):
  ci, docker
```

Everything a form needs rides each prompt: type, key, label, help, placeholder, default,
options (with display labels), constraints, `pattern`, and any `group`/`ui` metadata the
author attached — the same envelope the interactive terminal and MCP session render from.
Switch discovery comes free: the probe records every `archetype.switches.is_enabled(name)`
the script consults, which prompts alone could never reveal.

## Modes and coverage — computed, not promised

A single probe pass answers every prompt with its default, so conditional sections behind
non-default choices stay hidden. The result says so honestly: `coverage: default-path`,
`mode: interactive`.

Pass `--explore` and the probe forks at each select/confirm decision, mapping the branches:

- Conditional prompts appear with `appears_when: { key, equals }` — enough for a form to
  show and hide sections dynamically.
- If every branch is mapped within budget, the interface classifies **`mode: batch`**: a
  proven claim that all inputs can be supplied up front and the render will ask nothing
  else. Anything the probe cannot fully map — unbounded prompt loops, answer-computed
  keys — classifies `interactive`, and the prompt-by-prompt session protocol remains the
  ground truth.

Batch always degrades safely: a render given batch answers that hits an unmapped prompt
simply asks it through the normal session flow.

## Headless instructions, all at once

```shell
archetect interface <source> --answers-template > answers.yaml
archetect render <source> --destination out --headless -A answers.yaml
```

The template lists every key with its default, constraints, options, and conditions —
required keys without defaults arrive commented, so an incomplete render fails with the
error that names exactly what to fill in.

`--json` emits the full derived interface for tooling. The MCP `describe` tool and the
`DescribeArchetype` gRPC method return the same shape, so an AI agent or a web portal asks
the binary (or the server) for the form instead of trusting a file.

## What happened to `interface.yaml`?

It was removed. A declared interface was a second copy of what the prompts already say,
kept honest only by hand — and in practice it drifted. A manifest still carrying an
`interface:` block or a sibling `interface.yaml` fails to load with an error pointing
here: derive the contract with `archetect interface`, then delete the declaration.

Everything the declaration could express now lives on the prompts themselves, where it is
*enforced* rather than advertised: `pattern` validates on every input path, rich options
(`{ value, label, help }`) carry display labels, and `group`/`ui` metadata pass through to
clients untouched. See [Prompting](./scripting/prompting) for the full option surface.
