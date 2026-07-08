---
sidebar_position: 5
sidebar_label: Authoring Catalogs
---

# Authoring Catalogs

A catalog turns your organization's archetypes into a product: a browsable, searchable menu that developers reach with a single command. This section covers building, organizing, and publishing them.

## Why catalogs

Without a catalog, using an archetype means knowing its git URL. With one:

```shell
archetect                      # browse everything
archetect acme/services/grpc   # or jump straight there
archetect search grpc          # or find it
```

Catalogs also carry *policy*: an entry can pre-answer prompts, pre-enable switches, and pin defaults — so "the way our team creates a gRPC service" is encoded, not tribal.

## A catalog is an archetype

There is no separate catalog format. A catalog is an archetype whose manifest has a `catalog:` section:

```yaml
# archetype.yaml
description: "Acme Platform Catalog"
authors: ["Platform Team"]

requires:
  archetect: "3.0.0"

catalog:
  services:
    description: "Backend Services"
    catalog:
      grpc:
        description: "gRPC Service (Rust)"
        source: "git@github.com:acme/rust-grpc-archetype.git"
      rest:
        description: "REST Service (Rust)"
        source: "git@github.com:acme/rust-rest-archetype.git"
  frontends:
    description: "Frontend Applications"
    source: "git@github.com:acme/catalog-frontends.git"
```

Push that to a git repository and it's a published catalog. Because catalogs are archetypes, they nest naturally — the `frontends` entry above delegates to *another* catalog repository — and it's archetypes all the way down.

## In this section

- **[Catalog Structure](./catalog-structure)** — entries, groups, sources, and all their properties.
- **[Organizing & Publishing](./organizing-and-publishing)** — repository layout, distribution, and wiring catalogs into user and project configuration.
- **[Advanced Composition](./advanced-composition)** — pre-configured entries, hidden components, libraries, and federated remote catalogs.
