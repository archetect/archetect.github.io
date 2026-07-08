---
sidebar_position: 6
---

# Configuration Files

`archetect.yaml` configures the Archetect *tool* — catalogs, default answers, security policy, mode flags, and server/client settings. (Not to be confused with `archetype.yaml`, which describes an [archetype](./archetype-manifest).)

For a task-oriented walkthrough, see [User Guide: Configuration](../user-guide/configuration).

## File Locations and Merge Order

Configuration is layered from multiple sources. Later sources **override** earlier ones (field-level merge, with one exception for `catalog` noted below):

| Order | Source | Notes |
|---|---|---|
| 1 | Built-in defaults | See [Default Configuration](#default-configuration). |
| 2 | User config: `~/.config/archetect/archetect.yaml` | Optional. |
| 3 | Drop-in fragments: `~/.config/archetect/etc.d/*.yaml` (and `*.yml`) | Loaded in lexicographically sorted filename order; later files override earlier ones. Ideal for machine-managed fragments (e.g. `10-corp.yaml`, `20-team.yaml`). |
| 4 | Project config in the current directory | One of `archetect.yaml`, `archetect.yml`, `.archetect.yaml`, `.archetect.yml`. It is an **error** for more than one variant to exist. |
| 5 | `-c/--config-file <path>` | An additional config file supplied on the command line. |
| 6 | CLI flags and environment variables | `--offline`, `--headless`, `--dry-run`, `--local`, `--force-update`, `--allow-exec` and their `ARCHETECT_*` equivalents. |

Three special rules:

- **Project `catalog` replaces, not merges.** If the project config declares a `catalog:` section, it fully *replaces* the global catalog rather than being field-merged into it. All other sections (e.g. `answers`) merge field-by-field as usual. Use `archetect global ...` to bypass a project config and use the global catalog.
- **`switches` folds per item, not per list.** Each layer's `switches` list overlays the accumulated set item by item: `name` (or `name=true`) enables, `name=false` disables, and switches a layer doesn't mention are untouched. See [Switches](../user-guide/switches#layers-and-opting-out).
- **CLI flags only override when explicitly set.** A flag's built-in default does not clobber a value from a config file.

Directory locations follow the XDG Base Directory Specification (verify yours with `archetect system layout`):

| Purpose | Linux/macOS default | Env override |
|---|---|---|
| Config (`archetect.yaml`, `etc.d/`) | `~/.config/archetect` | `XDG_CONFIG_HOME` |
| Cache (git clones, downloads, library staging) | `~/.cache/archetect` | `XDG_CACHE_HOME` |
| Data (persistent, e.g. Lua type annotations) | `~/.local/share/archetect` | `XDG_DATA_HOME` |

On Windows, native conventions are used: `%APPDATA%\archetect\config`, `%LOCALAPPDATA%\archetect\cache`, `%APPDATA%\archetect\data`.

## Schema

### `catalog`

A map of named [catalog entries](./catalog-manifest) — the entries shown when running `archetect` with no arguments, and addressable as actions (e.g. `archetect render archetect ...`).

```yaml
catalog:
  archetect:
    description: Archetect Catalog
    source: https://github.com/archetect/archetect-catalog.git
```

The default configuration ships with exactly this single entry, pointing at the official Archetect catalog.

### `answers`

A map of default answers supplied to every render (lowest-precedence answer source — see [Answer Files](./answer-files)). By default, Archetect seeds this from your git configuration:

| Key | Seeded from |
|---|---|
| `author_name` | git `user.name` |
| `author_email` | git `user.email` |
| `author_full` | `"<name> <email>"` |

```yaml
answers:
  author_name: Jane Doe
  company: Acme
```

### `switches`

A list of [switch](../user-guide/switches) names enabled for every render. Folded per item across config layers: a later layer can disable an inherited switch with `name=false` without affecting the rest.

```yaml
switches:
  - debug
```

### `security`

| Field | Type | Default | Description |
|---|---|---|---|
| `allow_exec` | boolean | — | Legacy form: `true` maps to the `allowed` policy, `false` to `prompt`. |
| `shell_exec_policy` | `forbidden` \| `prompt` \| `allowed` | `prompt` | Gates `archetect.shell.run` / `archetect.shell.capture` in scripts. Takes precedence over `allow_exec` when both are set. |

Policies:

| Policy | Behavior |
|---|---|
| `forbidden` | Shell exec attempts always fail. (Forced in MCP mode.) |
| `prompt` | Every shell exec call prompts the user with the exact command. In headless mode this is a hard failure. |
| `allowed` | Shell exec is allowed unconditionally. (Set by `--allow-exec` / `ARCHETECT_ALLOW_EXEC`.) |

### Mode Flags

| Field | Type | Default | CLI / Env | Description |
|---|---|---|---|---|
| `offline` | boolean | `false` | `-o/--offline` / `ARCHETECT_OFFLINE` | Only use local directories and already-cached remote sources. |
| `headless` | boolean | `false` | `--headless` / `ARCHETECT_HEADLESS` | Expect all inputs to be resolved by answers, defaults, and optional values — never wait for interactive input. |
| `dry_run` | boolean | `false` | `-n/--dry-run` / `ARCHETECT_DRY_RUN` | Show what would be rendered without writing files. |

### `updates`

| Field | Type | Default | Description |
|---|---|---|---|
| `force` | boolean | `false` | Force-update all cached catalogs and archetypes on every render (`-U/--force-update` / `ARCHETECT_FORCE_UPDATE`). |
| `interval` | integer (seconds) | `604800` (7 days) | How often cached remote sources are checked for updates. |

### `locals`

Local development checkouts: when enabled, sources that match a checkout under one of the configured paths use the local copy instead of the remote.

| Field | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `false` | Enable local checkout resolution (`-l/--local` / `ARCHETECT_LOCAL`). |
| `paths` | list of paths | `["~/projects/archetypes/"]` | Directories scanned for local checkouts. |

### `server`

Applies to `archetect server`. Every field is optional — CLI flags and environment variables override this section, and anything left unset falls through to hardcoded defaults.

| Field | Type | Description |
|---|---|---|
| `host` | string | Bind address. |
| `port` | integer | Bind port. |
| `tls.cert` | path | Server certificate (required if `tls:` is present). |
| `tls.key` | path | Server private key (required if `tls:` is present). |
| `tls.client_ca` | path | CA for verifying client certificates (enables mTLS). |

### `client`

Applies to `archetect connect` (and as the fallback for [server catalog entries](./catalog-manifest#server-entries)). Every field is optional — CLI flags override.

| Field | Type | Description |
|---|---|---|
| `endpoint` | string | Default server endpoint used when none is given on the command line. |
| `connect.timeout_secs` | integer | Initial gRPC connect timeout. |
| `connect.retries` | integer | Connect retry count. |
| `connect.backoff_base_ms` | integer | Base backoff between retries. |
| `connect.max_backoff_secs` | integer | Backoff ceiling. |
| `keepalive.interval_secs` | integer | HTTP/2 keepalive interval. `0` disables keepalive. |
| `keepalive.timeout_secs` | integer | Keepalive timeout. |
| `tls` | map | Presence of this section (even empty) enables TLS — equivalent to `--tls`. |
| `tls.ca` | path | CA certificate to trust. |
| `tls.client_cert` | path | Client certificate (mTLS). |
| `tls.client_key` | path | Client private key (mTLS). |
| `tls.domain` | string | Expected TLS server name. |

## Environment Variables

| Variable | Equivalent | Section/Field |
|---|---|---|
| `ARCHETECT_OFFLINE` | `-o/--offline` | `offline` |
| `ARCHETECT_HEADLESS` | `--headless` | `headless` |
| `ARCHETECT_DRY_RUN` | `-n/--dry-run` | `dry_run` |
| `ARCHETECT_ALLOW_EXEC` | `-e/--allow-exec` | `security.allow_exec` |
| `ARCHETECT_LOCAL` | `-l/--local` | `locals.enabled` |
| `ARCHETECT_FORCE_UPDATE` | `-U/--force-update` | `updates.force` |
| `ARCHETECT_SERVER_HOST` | `archetect server --host` | `server.host` |
| `ARCHETECT_SERVER_PORT` | `archetect server --port` | `server.port` |
| `ARCHETECT_SERVER_TLS_CERT` | `archetect server --tls-cert` | `server.tls.cert` |
| `ARCHETECT_SERVER_TLS_KEY` | `archetect server --tls-key` | `server.tls.key` |
| `ARCHETECT_SERVER_TLS_CLIENT_CA` | `archetect server --tls-client-ca` | `server.tls.client_ca` |
| `ARCHETECT_CONNECT_TIMEOUT` | `archetect connect` timeout flag | `client.connect.timeout_secs` |
| `ARCHETECT_CONNECT_RETRIES` | `archetect connect` retries flag | `client.connect.retries` |
| `ARCHETECT_CLIENT_TLS` | `--tls` | `client.tls` (enable) |
| `ARCHETECT_CLIENT_TLS_CA` | `--tls-ca` | `client.tls.ca` |
| `ARCHETECT_CLIENT_TLS_CERT` | `--tls-cert` | `client.tls.client_cert` |
| `ARCHETECT_CLIENT_TLS_KEY` | `--tls-key` | `client.tls.client_key` |
| `ARCHETECT_CLIENT_TLS_DOMAIN` | `--tls-domain` | `client.tls.domain` |

See the [CLI Reference](./cli/) for the full flag list.

## Default Configuration

Print the resolved defaults on your machine with `archetect config defaults` (see [CLI: config](./cli/config)):

```yaml
catalog:
  archetect:
    description: Archetect Catalog
    source: https://github.com/archetect/archetect-catalog.git
answers:
  author_email: jane@example.com          # seeded from git user.email
  author_full: Jane Doe <jane@example.com>
  author_name: Jane Doe                   # seeded from git user.name
updates:
  interval: 604800
locals:
  paths:
  - ~/projects/archetypes/
security: {}
```
