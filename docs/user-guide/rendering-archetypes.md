---
sidebar_position: 1
---

# Rendering Archetypes

*Rendering* is Archetect's core act: take an archetype, gather input, write a project.

## Sources

`archetect render` accepts an archetype from:

```shell
# A git repository (https or ssh)
archetect render https://github.com/your-org/rust-cli-archetype.git
archetect render git@github.com:your-org/rust-cli-archetype.git

# A local directory
archetect render ../archetypes/rust-cli-archetype
```

Git sources are cloned into Archetect's cache on first use and reused afterwards. Local directories are always used as-is — ideal while developing an archetype.

## Destinations

The destination defaults to the current directory. Set it with a second positional argument or the `--destination` / `--dest` flag:

```shell
archetect render https://github.com/your-org/rust-cli-archetype.git ~/projects
archetect render https://github.com/your-org/rust-cli-archetype.git --dest ~/projects
```

Most archetypes create a project directory *inside* the destination (named after your project name answer), so pointing at `~/projects` yields `~/projects/my-service/`.

### Existing files

By default Archetect **preserves** files that already exist at the destination — re-rendering over a project won't clobber your edits. Archetype authors can choose different policies per render step (overwrite, prompt, or hard-error); see [Existing-file policies](../reference/lua-api/rendering) if you need the details.

## Previewing with dry runs

See what an archetype *would* do without writing a single file:

```shell
archetect render <source> --dry-run
```

You'll still be prompted (prompts are how archetypes decide what to render); combine with answers or `-D` to make it fully non-interactive.

## Caching and updates

Remote archetypes and catalogs live in `~/.cache/archetect`. Archetect works from the cache aggressively, which is what makes repeat renders instant.

```shell
# Force-refresh all sources involved in this render
archetect render <source> -U

# Never touch the network — cache and local dirs only
archetect render <source> --offline
```

`cache pull` pre-downloads everything reachable from a source or your configured catalog (useful before a flight), and `cache invalidate` marks entries stale without deleting them. See [Cache & System](../reference/cli/cache-and-system).

## Shell execution safety

Some archetypes run commands as part of generation — initializing git repositories, installing dependencies. Archetect's default policy is to **prompt for approval per command**. To pre-approve for a render you trust:

```shell
archetect render <source> --allow-exec
```

Set the policy permanently in [configuration](./configuration).

## Verbosity

Add `-v` (repeatable) to see what Archetect is doing under the hood — source resolution, cache decisions, configuration merging:

```shell
archetect render <source> -v
```

## Next

- [Using Catalogs](./using-catalogs) — when you'd rather browse than paste URLs.
- [Answers & Automation](./answers-and-automation) — taking the prompts out of rendering.
