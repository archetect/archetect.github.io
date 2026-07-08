---
sidebar_position: 7
---

# model (AML)

AML (Archetect Modeling Language) is a YAML-shaped DSL for describing a domain — entities, fields, relationships, boundaries, and interfaces — that an archetype can iterate over to generate code. The `archetect.model` module loads, parses, or programmatically builds AML models; `archetect.model.interactive` builds one by prompting the user. For the language itself, see [Modeling with AML](../../authoring-archetypes/scripting/modeling-with-aml).

```lua
local model = require("archetect.model")
```

## Loading and building

| Function | Signature | Returns |
|---|---|---|
| `model.load(path)` | `string → Model` | Load and parse a model from a YAML file |
| `model.parse(yaml)` | `string → Model` | Parse a model from a YAML string |
| `model.builder()` | `() → ModelBuilder` | Fresh programmatic builder |
| `model.from_context(context)` | `Context → Model` | Load from pre-supplied answers |

### `model.load(path)`

```lua
local m = model.load("model.yaml")
```

Loads and parses an AML file. Raises on read or parse errors. For paths sandboxed to the archetype or destination, prefer reading with [`file.read`](rendering#filereadpath-opts) and parsing:

```lua
local m = model.parse(file.read("model.yaml"))
```

### `model.parse(yaml)`

```lua
local m = model.parse([[
organization: acme
solution: commerce
entities:
  Customer:
    fields:
      name: { type: String, required: true }
]])
```

Parses AML source from a string. Raises on parse errors.

### `model.from_context(context)`

```lua
local m = model.from_context(context)
```

Loads a model from the context's answers: it looks for `model_path` (a file to load) first, then `model_yaml` (an inline YAML string). Raises an error when neither key is set. This lets callers supply the model via answer file or `-a model_path=...`.

## `Model`

A loaded model is a userdata handle with query methods (all called with `:`). Query results are plain Lua tables, safe to store in a Context for templates.

| Method | Returns | Description |
|---|---|---|
| `m:organization()` | `string` | Organization name |
| `m:solution()` | `string` | Solution name |
| `m:org_solution()` | cases table | Case variants of `"<organization>-<solution>"` |
| `m:entity(name)` | entity table \| `nil` | A single expanded entity, or `nil` if unknown |
| `m:boundary(name)` | boundary table \| `nil` | A single boundary, or `nil` if unknown |
| `m:all_boundaries()` | boundary table[] | Every boundary in the model |
| `m:boundaries_of_type(type)` | boundary table[] | Boundaries with the given `type` (e.g. `"service"`) |
| `m:entities_for(boundary)` | entity table[] | Expanded entities owned by a boundary (empty for unknown boundaries) |
| `m:outbound_interfaces(boundary)` | interface table[] | Interfaces originating from a boundary |
| `m:inbound_interfaces(boundary)` | interface table[] | Interfaces targeting a boundary |
| `m:dependencies(boundary)` | `string[]` | Deduplicated names of boundaries this one calls (from its outbound interfaces) |
| `m:remote_references(boundary)` | remote-reference table[] | Entity relations that cross out of the boundary |
| `m:slice(boundary)` | slice table | Everything one boundary's archetype needs. **Raises** on an unknown boundary. |

### Table shapes

**Cases table** — every name is delivered pre-expanded:

| Key | Example |
|---|---|
| `raw` | `order item` |
| `snake` | `order_item` |
| `pascal` | `OrderItem` |
| `camel` | `orderItem` |
| `kebab` | `order-item` |
| `train` | `Order-Item` |
| `constant` | `ORDER_ITEM` |
| `title` | `Order Item` |

**Entity table:**

| Key | Type | Description |
|---|---|---|
| `name` | cases table | Entity name in all case variants |
| `fields` | field table[] | All fields |
| `local_fields` | field table[] | Fields that are not relations |
| `relations` | field table[] | Fields that are relations |
| `events` | `string[]` | Declared events |
| `operations` | `string[]` | Declared operations |

**Field table:**

| Key | Type | Description |
|---|---|---|
| `name` | cases table | Field name in all case variants |
| `type` | `string?` | Field type (absent for pure relations) |
| `required` | `boolean` | Required flag |
| `unique` | `boolean` | Unique flag |
| `key` | `boolean` | Primary-key flag |
| `default` | `string?` | Default value, if declared |
| `is_relation` | `boolean` | Whether this field is a relation |
| `relation` | `string?` | Relation kind (e.g. `"many-to-one"`) |
| `target_entity` | `string?` | Raw target entity name |
| `target` | cases table? | Target entity name in all case variants |

**Boundary table:** `name` (string), `type` (string), `owns` (string[]), plus optional `language` and `description`.

**Interface table:** `from`, `to`, `style` (all strings).

**Remote-reference table:** `source_entity`, `field_name`, `target_entity`, `target_boundary`, `relation` (all strings).

**Slice table:** `organization`, `solution` (strings), `boundary` (boundary table), `entities` (entity table[]), `remote_references`, `outbound`, `inbound` (interface tables), `dependencies` (string[]).

### Example

```lua
local model = require("archetect.model")
local m = model.parse(file.read("model.yaml"))

for _, boundary in ipairs(m:boundaries_of_type("service")) do
    local slice = m:slice(boundary.name)
    context:set("slice", slice)
    directory.render("contents/service", context, {
        destination = slice.boundary.name,
    })
end
```

## `ModelBuilder`

Construct a model programmatically. All methods are called with `:` and return nothing until `build()`.

| Method | Description |
|---|---|
| `b:set_organization(org)` | Set the organization name |
| `b:set_solution(solution)` | Set the solution name |
| `b:set_description(desc)` | Set the description |
| `b:add_entity(name)` | Add an entity |
| `b:add_field(entity, field_name, field_type)` | Add a simple typed field to an entity |
| `b:add_relation(entity, field_name, target_entity, relation, required)` | Add a relation field (`relation` e.g. `"many-to-one"`, `required` boolean) |
| `b:add_boundary(name, type, owns)` | Add a boundary (`owns` is a string array of entity names) |
| `b:add_interface(from, to, style)` | Add an interface between boundaries |
| `b:build()` | Resolve and return a `Model` |

`build()` consumes the builder's accumulated state — after calling it, the builder is reset to empty.

```lua
local model = require("archetect.model")

local b = model.builder()
b:set_organization("acme")
b:set_solution("commerce")
b:add_entity("Customer")
b:add_field("Customer", "name", "String")
b:add_entity("Order")
b:add_relation("Order", "customer", "Customer", "many-to-one", true)
b:add_boundary("customer-service", "service", { "Customer" })
b:add_boundary("order-service", "service", { "Order" })
b:add_interface("order-service", "customer-service", "sync")

local m = b:build()
```

## `archetect.model.interactive`

```lua
local interactive = require("archetect.model.interactive")
```

A prompt-driven wrapper around the builder, for archetypes that want the user to author the model interactively instead of supplying it via answer file.

### `interactive.build(context)`

```lua
interactive.build(context) --> Model
```

Runs an interactive session against the given Context and returns the resulting `Model` (same type as `model.load` / `model.parse` produce). The session prompts for:

1. **Identity** — organization, solution, optional description.
2. **Entities** — a repeat-until-done loop; each entity gets a field loop with types selected from `String`, `Integer`, `Long`, `Decimal`, `Boolean`, `UUID`, `Date`, `Timestamp`, `Bytes`.
3. **Boundaries** — name, type (`service`, `gateway`, `library`, `orchestrator`, `adapter`), and comma-separated owned entities.
4. **Interfaces** — from/to boundaries with style `sync`, `async`, or `stream`.

The prompts store their working values in the passed Context (`organization`, `solution`, `description`, plus transient keys prefixed with `__`), so `organization` and `solution` remain available to your templates afterward.

```lua
local interactive = require("archetect.model.interactive")

local m = interactive.build(context)
context:set("org_solution", m:org_solution())
```
