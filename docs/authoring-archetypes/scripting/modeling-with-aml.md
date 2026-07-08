---
sidebar_position: 10
---

# Modeling with AML

Prompts are great for a handful of values. But some generation is shaped by a *domain*: entities, fields, relationships, service boundaries. For that, Archetect provides **AML** — the Archetect Modeling Language — a YAML-based, technology-agnostic way to describe *what* a system is, which archetypes then turn into code.

## A model

```yaml
# model.yaml
organization: acme
solution: commerce
description: "E-commerce platform"

types:
  Money:
    base: Decimal
    precision: 2
  OrderStatus:
    enum: [Draft, Submitted, Confirmed, Shipped, Delivered, Cancelled]

entities:
  Customer:
    fields:
      id: UUID
      name: { type: String, required: true }
      email: { type: String, required: true, unique: true }

  Order:
    fields:
      id: UUID
      customer: { entity: Customer, relation: many-to-one, required: true }
      status: { type: OrderStatus, default: Draft }
      total: Money
    events: [OrderCreated, OrderSubmitted, OrderCancelled]
```

Entities declare fields (with types, requiredness, uniqueness), relations to other entities (`entity` + `relation`), and domain events. An `id` field is implied when omitted.

## Loading a model in a script

```lua
local model = require("archetect.model")

-- From a file shipped with (or supplied to) the archetype
local m = model.parse(file.read("model.yaml"))

-- Or from the render's answers: looks for `model_path`, then `model_yaml`
local m = model.from_context(context)
```

The `from_context` form is the automation-friendly one — callers supply the model as an answer:

```shell
archetect render <source> -a model_path=./commerce-model.yaml
```

## Generating from the model

A model-aware archetype iterates the model instead of prompting per entity:

```lua
for _, entity in ipairs(m:entities()) do
  local ectx = Context.new()
  ectx:merge(context)
  ectx:set("entity", entity)
  file.render("templates/entity.rs", ectx, {
    destination = "src/entities/" .. entity.name.snake .. ".rs",
  })
end
```

Entity and field names come **pre-expanded into case variants** (`entity.name.snake`, `entity.name.pascal`, …) — the same casing discipline as prompts, applied to the whole domain. Fields carry their types, flags, and relations, so templates can emit struct definitions, migrations, DTOs, and APIs from one source of truth.

## Building models interactively

For a human-driven flow, the interactive builder walks the user through defining organization, solution, entities, and boundaries with prompts:

```lua
local interactive = require("archetect.model.interactive")
local m = interactive.build(context)
```

You can also construct models programmatically with `model.builder()`.

## Boundaries and slices

Larger models group entities into **boundaries** (services) with declared interfaces between them. An archetype generating one service asks for its *slice* — the boundary plus its owned entities, inbound/outbound interfaces, and dependencies — and generates just that piece. This is the foundation of Archetect's model-driven, multi-service generation story, which is actively evolving; expect this area to grow.

## When to reach for AML

| Signal | Approach |
|---|---|
| A few scalar inputs | Plain [prompts](./prompting) |
| A repeating structure (N entities × M fields) | AML model |
| The same domain drives several archetypes (service + API + UI) | AML model shared across renders |
| Architecture spans multiple services | AML boundaries + slices |

Full API: [model reference](../../reference/lua-api/model).
