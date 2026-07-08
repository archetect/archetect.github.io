---
sidebar_position: 7
---

# Answer Files

Answers pre-resolve prompts so renders can run partially or fully unattended. For a guide, see [Answers and Automation](../user-guide/answers-and-automation).

## File Formats

Answer files (`-A/--answer-file <path>`, repeatable) are flat-to-nested maps of answer keys to values. The format is chosen by file extension:

| Extension | Format |
|---|---|
| `.yaml`, `.yml` | YAML |
| `.json` | JSON |

Any other extension is rejected with an error. (TOML is not supported.)

```yaml
# answers.yaml
project_name: billing-service
port: 8080
enable_telemetry: true
features: [auth, metrics]
db:
  host: localhost
  port: 5432
```

## `-a key=value` Syntax

Individual answers are supplied with `-a/--answer key=value` (repeatable). The pair splits on the **first** `=`; the key must be non-empty, the value may be empty.

### Typed Values

The value is parsed as **YAML**, giving CLI answers the same type semantics as answer files. If YAML parsing fails, the value falls back to a plain string.

| Input | Parsed as |
|---|---|
| `-a count=42` | Integer `42` |
| `-a ratio=1.5` | Float `1.5` |
| `-a active=true` | Boolean `true` |
| `-a value=null` | Nil |
| `-a tags=[a, b, c]` | Array of strings |
| `-a "db={host: localhost, port: 5432}"` | Map |
| `-a name=hello world` | String `"hello world"` |
| `-a zip='"01234"'` | String `"01234"` (YAML-quoted — stays a string) |
| `-a key=` | Empty string (not null) |

:::tip
Unquoted all-digit values become integers — standard YAML behavior. If you need a string (ZIP codes, phone numbers), YAML-quote it: `-a zip='"01234"'`.
:::

### Dotted Keys

Keys may contain dots for nested map access. Intermediate maps are created as needed, and siblings are preserved:

```bash
archetect render <source> -a db.host=localhost -a db.port=5432
# → { db: { host: "localhost", port: 5432 } }
```

## Precedence

Answers are assembled in layers; **later layers overwrite earlier ones** for the same key:

| Order | Source |
|---|---|
| 1 (lowest) | `answers:` from the merged [configuration](./configuration) (defaults, user config, project config) — includes the git-seeded `author_*` answers |
| 2 | `-A/--answer-file` files, in the order given (later files win) |
| 3 | `-a/--answer` key=value pairs |
| 4 (highest) | `answers:` on the [catalog entry](./catalog-manifest) being rendered |

At prompt time, resolution for each key proceeds:

1. If an **answer** exists for the key, it is used — the prompt is skipped.
2. Otherwise, if the key is covered by `-d/--use-default <key>` or `-D/--use-defaults-all` (or the catalog entry's `use_defaults`/`use_defaults_all`), the prompt's **default value** is used.
3. Otherwise, the user is **prompted interactively**. In `--headless` mode, an unresolved required prompt is a hard error.

## Round-Tripping a Context

Inside a script, `tostring(ctx)` yields the context's data as YAML — equivalent to `format.to_yaml(ctx)` — and the output is a **valid Archetect answer file**. This makes captured contexts replayable:

```lua
-- archetype.lua
log.debug(tostring(ctx))   -- print the fully-resolved context as YAML
```

Save that output to a file and re-run non-interactively:

```bash
archetect render <source> -A captured-context.yaml --headless
```

See [Testing and Debugging](../authoring-archetypes/testing-and-debugging) for how to use this in archetype development.
