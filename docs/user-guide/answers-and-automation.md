---
sidebar_position: 3
---

# Answers & Automation

Every Archetect prompt can be answered before it's ever asked. That's what makes archetypes equally usable by a developer at a terminal, a shell script, a CI pipeline, or an AI agent.

## Answering from the command line

Supply individual answers with `-a` / `--answer`:

```shell
archetect render <source> \
  -a project_name=billing-service \
  -a "description=Billing and invoicing" \
  -a use_github=false
```

Quoting follows normal shell rules; Archetect accepts `key=value`, `key='multi word'`, and quoted whole pairs alike.

## Answer files

For more than a couple of values, put answers in a YAML or JSON file and pass it with `-A` / `--answer-file` (repeatable — later files layer over earlier ones):

```yaml
# billing-answers.yaml
project_name: billing-service
description: "Billing and invoicing"
use_github: false
```

```shell
archetect render <source> -A billing-answers.yaml
```

:::tip Generate answer files from real runs
Inside a script, `tostring(context)` / `format.to_yaml(context)` print the full context as valid answer-file YAML. Archetype authors often log this, letting you capture a real interactive session and replay it forever.
:::

## Accepting defaults

Prompts usually carry sensible defaults. Accept them without interaction:

```shell
# Accept the default for specific prompts
archetect render <source> -d license -d author_name

# Accept defaults for every prompt that has one
archetect render <source> -D
```

## Standing answers in configuration

Values that are always the same for you — name, email, organization — belong in your [configuration file](./configuration) instead of on every command line:

```yaml
# ~/.config/archetect/archetect.yaml
answers:
  author_name: "Jane Developer"
  author_email: "jane@example.com"
```

Catalog entries can also carry pre-configured answers, so a catalog author can publish "the gRPC service, preconfigured for team X" as a single menu item — see [Catalog Manifest](../reference/catalog-manifest).

## Headless mode

`--headless` (or `ARCHETECT_HEADLESS=true`) turns every unresolved prompt into an error instead of a question — Archetect will never block waiting for a human:

```shell
archetect render <source> my-service \
  -A ci-answers.yaml \
  -D \
  --headless
```

This is the backbone of CI usage: answers cover the required values, `-D` mops up anything with a default, and headless guarantees the job can't hang.

## How a prompt resolves

Answers layer up before the render starts — later sources overwrite earlier ones:

1. Answers from configuration files (lowest)
2. Answer files (`-A`), in the order given
3. Command-line answers (`-a`)
4. Answers configured on the catalog entry being rendered (highest — the catalog author's pre-configuration is authoritative for that entry)

At prompt time, each prompt then resolves: matching answer → the prompt's default (when `-d`/`-D` accept it) → interactive input — unless `--headless`, in which case an unresolved prompt is an error.

A worked CI example:

```shell
ARCHETECT_HEADLESS=true archetect render \
  https://github.com/acme/rust-grpc-service.git ./generated \
  -A service-answers.yaml \
  -s docker -s github-actions \
  -D -U
```

`-U` force-refreshes sources so the pipeline always uses the latest archetype; `-s` enables optional behavior — see [Switches](./switches).
