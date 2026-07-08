---
sidebar_position: 3
---

# config

Manage Archetect's configuration.

## Synopsis

```text
archetect config <COMMAND>
```

| Command | Description |
|---|---|
| `merged` | Show the merged configuration after applying command line arguments, environment variables, and configuration files. |
| `defaults` | Show Archetect's default configuration, which may be used for re-creating a configuration file. |
| `edit` | Open Archetect's user config file in an editor. |

## config merged

Prints the fully merged configuration as YAML. Because `-c`, environment variables,
and flags participate in the merge, this is the way to debug "which value wins":

```shell
archetect config merged
archetect -c ./ci-overrides.yaml config merged
```

## config defaults

Prints the built-in default configuration as YAML — a useful starting point for a new
config file:

```shell
archetect config defaults > ~/.config/archetect/archetect.yaml
```

Example output:

```text
catalog:
  archetect:
    description: Archetect Catalog
    source: https://github.com/archetect/archetect-catalog.git
answers:
  author_email: you@example.com
  author_full: Your Name <you@example.com>
  author_name: Your Name
updates:
  interval: 604800
locals:
  paths:
  - ~/projects/archetypes/
security: {}
```

## config edit

Opens the user config file (`~/.config/archetect/archetect.yaml`) in your editor,
pre-populated with its current contents — or with the default configuration if the file
doesn't exist yet. The file is written only when you save and exit the editor;
cancelling leaves it untouched.

```shell
archetect config edit
```

## Configuration file locations

Configuration is layered, with later sources overriding earlier ones (field-level
merge; a project catalog *replaces* the global catalog rather than merging):

| Order | Source |
|---|---|
| 1 | Built-in defaults (`archetect config defaults`) |
| 2 | User config: `~/.config/archetect/archetect.yaml` |
| 3 | Drop-ins: `~/.config/archetect/etc.d/*.yaml`, loaded in sorted order |
| 4 | Project config in the current directory: one of `archetect.yaml`, `archetect.yml`, `.archetect.yaml`, `.archetect.yml` (an error is raised if more than one variant exists) |
| 5 | File supplied with `-c` / `--config-file` |
| 6 | Environment variables and CLI flags |

`archetect global` skips step 4 entirely — see
[Catalog Commands](catalog-commands#global).

See [Configuration Files](../configuration) for the full file format and
[system layout](cache-and-system#system-layout) for where these directories live on
your platform.
