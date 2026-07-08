---
sidebar_position: 6
---

# Server Modes

Archetect can run as a gRPC server (`server`) that renders archetypes for remote
clients, and as the matching client (`connect`). Federated catalogs (`server:` entries
in a catalog manifest) use the same protocol.

## server

```text
archetect server [OPTIONS]
```

Starts an Archetect gRPC server. Ctrl-C triggers a graceful shutdown that drains
in-flight render streams before exiting.

### Options

| Flag | Env | Default | Description |
|---|---|---|---|
| `--host <host>` | `ARCHETECT_SERVER_HOST` | `0.0.0.0` | The interface to bind to. |
| `-p`, `--port <port>` | `ARCHETECT_SERVER_PORT` | `8080` | The port to listen on. |
| `--tls-cert <path>` | `ARCHETECT_SERVER_TLS_CERT` | | PEM-encoded TLS server certificate. Enables TLS when supplied with `--tls-key`. |
| `--tls-key <path>` | `ARCHETECT_SERVER_TLS_KEY` | | PEM-encoded TLS server private key. Required with `--tls-cert`. |
| `--tls-client-ca <path>` | `ARCHETECT_SERVER_TLS_CLIENT_CA` | | PEM-encoded CA cert for verifying client certificates (enables mutual TLS). |

Values may also be set in configuration under the `server` section (`server.host`,
`server.port`, `server.tls`); explicit CLI flags and environment variables override
config values.

TLS rules: `--tls-cert` and `--tls-key` must be supplied together (via CLI or config);
supplying `--tls-client-ca` without a cert/key pair is an error.

### Examples

```shell
# Plain server on the defaults (0.0.0.0:8080)
archetect server

# Custom bind + port
archetect server --host 127.0.0.1 -p 9090

# TLS
archetect server --tls-cert server.pem --tls-key server-key.pem

# Mutual TLS
archetect server \
  --tls-cert server.pem --tls-key server-key.pem \
  --tls-client-ca client-ca.pem
```

## connect

```text
archetect connect [OPTIONS] [endpoint]
```

Connects to an Archetect server and drives a render interactively from your terminal —
prompts are answered locally, output is rendered into your local destination. All
[global render options](./#global-options) (answers, answer files, defaults, switches,
`--destination`, `--dry-run`, ...) apply.

### Arguments

| Argument | Description |
|---|---|
| `[endpoint]` | The server endpoint, e.g. `http://localhost:8080`. Falls back to `client.endpoint` in configuration if omitted; it is an error if neither is set. |

### Options

| Flag | Env | Default | Description |
|---|---|---|---|
| `--connect-timeout <secs>` | `ARCHETECT_CONNECT_TIMEOUT` | `5` | TCP connect timeout in seconds (applied per attempt). |
| `--connect-retries <n>` | `ARCHETECT_CONNECT_RETRIES` | `5` | Maximum number of connect retry attempts before giving up. |
| `--tls` | `ARCHETECT_CLIENT_TLS` | off | Enable TLS for the client connection. Implied when any other `--tls-*` flag is supplied. |
| `--tls-ca <path>` | `ARCHETECT_CLIENT_TLS_CA` | | PEM-encoded CA cert to trust (in addition to the system trust store). |
| `--tls-client-cert <path>` | `ARCHETECT_CLIENT_TLS_CERT` | | PEM-encoded client certificate for mutual TLS. |
| `--tls-client-key <path>` | `ARCHETECT_CLIENT_TLS_KEY` | | PEM-encoded client private key for mutual TLS. Required with `--tls-client-cert`. |
| `--tls-domain <name>` | `ARCHETECT_CLIENT_TLS_DOMAIN` | | Override the domain name used for TLS SNI and cert verification. |

Plus all [global render options](./#global-options).

Configuration under the `client` section supplies defaults per field
(`client.endpoint`, `client.connect.*`, `client.keepalive.*`, `client.tls.*`);
explicit CLI flags and environment variables win. TLS is enabled when any `--tls-*`
flag is passed *or* a `client.tls` section is present in configuration.

### Examples

```shell
# Connect to a local server (endpoint from the command line)
archetect connect http://localhost:8080

# Endpoint from client.endpoint in configuration
archetect connect

# Render non-interactively into a specific directory
archetect connect http://archetect.example.com:8080 \
  --destination ./my-service -A answers.yaml --headless

# TLS with a private CA and SNI override
archetect connect https://archetect.internal:8443 \
  --tls-ca ca.pem --tls-domain archetect.example.com

# Mutual TLS
archetect connect https://archetect.internal:8443 \
  --tls-client-cert client.pem --tls-client-key client-key.pem
```

## See also

- [Configuration Files](../configuration) — `server` and `client` config sections
- [Catalog Manifest](../catalog-manifest) — federating a remote server into a catalog
