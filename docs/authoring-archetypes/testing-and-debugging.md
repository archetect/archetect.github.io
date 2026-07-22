---
sidebar_position: 5
---

# Testing & Debugging

Archetype development is a feedback loop: edit, render, inspect. This page is about making that loop fast and about seeing inside a render when something's wrong.

## The basic loop

Local directories render directly — no git, no cache — so develop against your working copy:

```shell
archetect render ./my-archetype /tmp/scratch \
  -a "project-name=test project" -D --headless
```

- A **throwaway destination** (`/tmp/scratch`) you can delete between runs.
- **Pinned answers** (`-a`, or better, an answer file) so renders are reproducible and non-interactive.
- `-D` accepts remaining defaults; `--headless` fails fast if you add a prompt and forget to answer it — which is exactly what you want while iterating.

Keep an `answers-dev.yaml` next to your archetype (git-ignored, or committed as a fixture) and run:

```shell
rm -rf /tmp/scratch && archetect render . /tmp/scratch -A answers-dev.yaml --headless
```

## Capturing answers from a real session

Run interactively once, print the context, and save it as your fixture:

```lua
output.print(tostring(context))    -- valid answer-file YAML
```

Delete the line when you're done — or better, keep it as `log.debug(tostring(context))`, visible only at `-vv`.

## Dry runs

`--dry-run` (`-n`) exercises the whole script — prompts, logic, template rendering — without writing files. Great for a quick "does it still run" check and safe against a non-empty destination.

## Seeing inside a render

**Log by level.** `log.debug`/`log.info`/`log.warn` route through Archetect's logger; raise verbosity with `-v` (info), `-vv` (debug):

```lua
log.debug("features = " .. format.to_json(context:get("features")))
```

**Print the context** whenever templates render something unexpected — nine times out of ten the context doesn't contain what you think it does:

```lua
output.print(tostring(context))
```

**Render a template inline** to test an expression in isolation:

```lua
output.print(template.render("{{ ProjectName }} / {{ project_name }}", context))
```

## Common failure modes

| Symptom | Likely cause |
|---|---|
| `{{ something }}` appears literally in output | Variable name doesn't match a context key (check casing variant!) — with `undefined: lenient` it renders empty, but an unmatched `{{ … }}` in a *file name* stays literal |
| Empty string where a value should be | `undefined: lenient` swallowing a typo — set `templating.undefined: strict` while developing to turn these into errors |
| Prompt answered with the wrong value in CI | Answer precedence — catalog-entry answers override `-a`; check with `-vv` |
| Script error mentioning `nil` | An optional prompt was skipped, or `context:get` on a missing key — guard with `if value then` |
| Render fails on existing files | The default policy is `Preserve`, but a composed child may set `Existing.Error` — inspect the `if_exists` options in play |
| Shell command never runs in CI | Execution policy — headless runs need `--allow-exec` |

:::tip Develop in strict mode
`templating: { undefined: strict }` in your manifest makes missing-variable typos loud during development. Decide consciously whether to ship strict (safer) or lenient (more forgiving of optional keys).
:::

## Testing composed archetypes

When your archetype composes others from git, iterate against **local checkouts** with the `locals` mechanism: configure paths in your [configuration](../user-guide/configuration), then render with `-l/--local`. Configured local checkouts substitute for their remote URLs everywhere in the tree — so you can change a component and test the parent without pushing.

```yaml
# ~/.config/archetect/archetect.yaml
locals:
  enabled: false
  paths:
    - /Users/jane/dev/archetypes/
```

```shell
archetect -l render . /tmp/scratch -A answers-dev.yaml --headless
```

When not using locals, remember composed children are *cached*: after pushing component changes, re-render the parent with `-U` to pick them up.

## A pre-publish checklist

- [ ] `archetect render . /tmp/x -A fixture.yaml --headless` succeeds end to end
- [ ] Interactive run reads well: prompt order, defaults, help text
- [ ] Re-render over the same destination behaves sanely (Preserve semantics)
- [ ] `--dry-run` is clean
- [ ] `archetect interface --explore` derives the contract you expect (prompts, switches, batch/interactive)
- [ ] No stray `output.print` debugging left behind
