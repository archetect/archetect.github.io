---
sidebar_position: 2
sidebar_label: "Catalog Layout"
---

# Catalog Layout

This section provides a comprehensive reference for the structure and organization of Archetect catalogs.

## Overview

A catalog is a collection of related archetypes organized for easy discovery and distribution. Catalogs provide a way to group, version, and share multiple archetypes as a cohesive package.

## Basic Catalog Structure

Modern Archetect catalogs use Git repositories as archetype sources:

```
rust.catalog/
├── catalog.yaml            # Catalog configuration with Git sources
├── README.md              # Usage documentation
├── .version-line          # Version tracking
├── .gitignore
└── .github/
    └── workflows/         # CI/CD automation
```

## Core Files

### catalog.yaml

The main configuration file that defines catalog metadata. Here are real examples from active catalogs:

#### Direct Archetype Catalog (rust.catalog)

```yaml
description: "Rust Root Catalog"
author: "Jimmie Fulton <jimmie.fulton@gmail.com>"
archetect: "2.0.0"

groups:
  - name: "Scaffolding"
    entries:
      - archetype: "Rust Workspace Scaffolding"
        source: "git@github.com:archetect-rust/workspace-scaffolding.git#v1"

  - name: "Services"
    entries:
      - archetype: "Rust gRPC Service"
        source: "git@github.com:archetect-rust/grpc-service.git#v1"
      - archetype: "Rust GraphQL Service"
        source: "git@github.com:archetect-rust/graphql-service.git#v1"
      - archetype: "Rust Axum Server (Modular with CLI and Config)"
        source: "git@github.com:archetect-rust/axum-server.git#v1"
```

#### Federated Catalog (archetect.catalog)

```yaml
archetect: "2.0.0"

entries:
  - catalog: "Rust"
    source: "git@github.com:archetect-rust/rust.catalog.git"
  - catalog: "Writing and Documentation"
    source: "git@github.com:archetect-writing/writing.catalog.git"
  - catalog: "Archetype Starters"
    source: "git@github.com:archetect-common/archetype-starters.catalog.git#v1"
  - catalog: "General Utilities"
    source: "git@github.com:archetect/utils.catalog.git"
```

#### Multi-Technology Catalog (p6m.catalog)

```yaml
archetect: "2.0.0"

groups:
  - name: "JavaScript"
    entries:
      - archetype: "Node.js Express API"
        source: "git@github.com:p6m-archetypes/node-express-api.git"
      - archetype: "React Application"
        source: "git@github.com:p6m-archetypes/react-app.git"

  - name: "Java"
    entries:
      - archetype: "Spring Boot Microservice"
        source: "git@github.com:p6m-archetypes/spring-boot-microservice.git"
      - archetype: "Spring Boot gRPC Service"
        source: "git@github.com:p6m-archetypes/spring-boot-grpc.git"

  - name: "Rust"
    entries:
      - archetype: "Rust CLI Tool"
        source: "git@github.com:p6m-archetypes/rust-cli.git"

  - name: "Architecture"
    entries:
      - archetype: "Transactional Architecture Builder"
        source: "git@github.com:p6m-archetypes/transactional-arch.git"
      - archetype: "Domain Architecture Builder"
        source: "git@github.com:p6m-archetypes/domain-arch.git"
```

### README.md

Real-world catalog documentation patterns:

#### Rust Catalog README

```markdown
# Archetect Catalog

![GitHub release (latest by date)](https://img.shields.io/github/v/release/archetect-rust/rust.catalog)

An Archetect Catalog.

## Rendering an Archetype

```sh
archetect render git@github.com:archetect-rust/rust.catalog.git#v1
```
```

#### P6M Catalog README

```markdown
# p6m.catalog

A Federated Archetect Catalog for Archetect 2.

## Usage

Generate an Archetype:

```sh
archetect catalog git@github.com:p6m-archetypes/p6m.catalog.git
```
```

#### Enterprise Catalog README Template

```markdown
# Enterprise Development Catalog

A comprehensive collection of archetypes for enterprise application development.

## Available Groups

- **Frontend**: React, Vue.js, and Angular applications
- **Backend Services**: Spring Boot, Node.js, and .NET APIs
- **Architecture**: Domain-driven and transactional patterns
- **CI/CD**: Pipeline templates and deployment configurations

## Usage

```bash
# Browse the catalog
archetect catalog git@github.com:company/enterprise.catalog.git

# Use a specific archetype
archetect render git@github.com:company/enterprise.catalog.git#spring-boot-api
```

## Requirements

- Archetect 2.0+
- Git access to private repositories
```

## Configuration Patterns from Real Catalogs

### Version Requirements

All examined catalogs standardize on Archetect 2.0.0:

```yaml
archetect: "2.0.0"
```

### Git-Based Source References

Modern pattern using Git repositories with version tags:

```yaml
# Direct archetype reference
- archetype: "Rust gRPC Service"
  source: "git@github.com:archetect-rust/grpc-service.git#v1"

# Catalog reference
- catalog: "Archetype Starters"
  source: "git@github.com:archetect-common/archetype-starters.catalog.git#v1"
```

### Group-Based Organization

Logical grouping for better discovery (rust.catalog pattern):

```yaml
groups:
  - name: "Scaffolding"
    entries:
      - archetype: "Rust Workspace Scaffolding"
        source: "git@github.com:archetect-rust/workspace-scaffolding.git#v1"
  - name: "Services"
    entries:
      - archetype: "Rust gRPC Service"
        source: "git@github.com:archetect-rust/grpc-service.git#v1"
```

### Flat Entry Lists

Simple list structure for federated catalogs (archetect.catalog pattern):

```yaml
entries:
  - catalog: "Rust"
    source: "git@github.com:archetect-rust/rust.catalog.git"
  - catalog: "Writing and Documentation"
    source: "git@github.com:archetect-writing/writing.catalog.git"
```

### Technology-Centric Groups

Enterprise pattern organizing by technology stack (p6m.catalog pattern):

```yaml
groups:
  - name: "JavaScript"
    entries:
      - archetype: "Node.js Express API"
        source: "git@github.com:p6m-archetypes/node-express-api.git"
  - name: "Java"
    entries:
      - archetype: "Spring Boot Microservice"
        source: "git@github.com:p6m-archetypes/spring-boot-microservice.git"
  - name: "Architecture"
    entries:
      - archetype: "Transactional Architecture Builder"
        source: "git@github.com:p6m-archetypes/transactional-arch.git"
```

## Git-Based Archetype References

Modern catalogs reference archetypes via Git repositories rather than local directories:

```yaml
# Direct Git repository references
groups:
  - name: "Services"
    entries:
      - archetype: "Rust gRPC Service"
        source: "git@github.com:archetect-rust/grpc-service.git#v1"
      - archetype: "Rust GraphQL Service"
        source: "git@github.com:archetect-rust/graphql-service.git#v1"

# Catalog aggregation
entries:
  - catalog: "Rust"
    source: "git@github.com:archetect-rust/rust.catalog.git"
  - catalog: "Writing and Documentation"
    source: "git@github.com:archetect-writing/writing.catalog.git"
```

## Catalog Types

### Direct Archetype Catalogs

Catalogs that contain actual archetypes organized by groups:

```yaml
# Based on rust.catalog pattern
description: "Rust Root Catalog"
author: "Jimmie Fulton <jimmie.fulton@gmail.com>"
archetect: "2.0.0"

groups:
  - name: "Scaffolding"
    entries:
      - archetype: "Rust Workspace Scaffolding"
        source: "git@github.com:archetect-rust/workspace-scaffolding.git#v1"
  - name: "Services"
    entries:
      - archetype: "Rust gRPC Service"
        source: "git@github.com:archetect-rust/grpc-service.git#v1"
```

### Federated Catalogs

Meta-catalogs that aggregate other catalogs:

```yaml
# Based on archetect.catalog pattern
archetect: "2.0.0"

entries:
  - catalog: "Rust"
    source: "git@github.com:archetect-rust/rust.catalog.git"
  - catalog: "Writing and Documentation"
    source: "git@github.com:archetect-writing/writing.catalog.git"
  - catalog: "Archetype Starters"
    source: "git@github.com:archetect-common/archetype-starters.catalog.git#v1"
```

### Enterprise Multi-Technology Catalogs

Comprehensive catalogs covering multiple languages and architectures:

```yaml
# Based on p6m.catalog pattern
archetect: "2.0.0"

groups:
  - name: "Frontend"
    entries:
      - archetype: "React Application"
        source: "git@github.com:p6m-archetypes/react-app.git"
      - archetype: "Vue.js Application"
        source: "git@github.com:p6m-archetypes/vue-app.git"

  - name: "Backend Services"
    entries:
      - archetype: "Spring Boot Microservice"
        source: "git@github.com:p6m-archetypes/spring-boot-microservice.git"
      - archetype: "Node.js Express API"
        source: "git@github.com:p6m-archetypes/node-express-api.git"

  - name: "Architecture"
    entries:
      - archetype: "Transactional Architecture Builder"
        source: "git@github.com:p6m-archetypes/transactional-arch.git"
      - archetype: "Domain Architecture Builder" 
        source: "git@github.com:p6m-archetypes/domain-arch.git"
```

## Advanced Features

### Version Tagging

Git-based catalogs use tags for version management:

```yaml
# Reference specific versions
entries:
  - archetype: "Rust Workspace Scaffolding"
    source: "git@github.com:archetect-rust/workspace-scaffolding.git#v1"
  - catalog: "Archetype Starters"
    source: "git@github.com:archetect-common/archetype-starters.catalog.git#v1"

# Latest version (no tag)
entries:
  - catalog: "Rust"
    source: "git@github.com:archetect-rust/rust.catalog.git"
```

## Catalog Distribution

### Git-Based Distribution (Standard Pattern)

Modern Archetect catalogs use Git repositories for distribution:

```bash
# Direct Git URL usage (most common)
archetect catalog git@github.com:archetect-rust/rust.catalog.git
archetect catalog git@github.com:p6m-archetypes/p6m.catalog.git

# With version tags for stability
archetect render git@github.com:archetect-rust/rust.catalog.git#v1
archetect render git@github.com:archetect-common/archetype-starters.catalog.git#v1

# HTTPS URLs for public repositories
archetect catalog https://github.com/archetect/archetect.catalog.git
```



## Best Practices

### Organization

- Group related archetypes logically using the `groups` structure
- Use consistent Git repository naming conventions
- Reference stable versions with Git tags
- Organize repositories by domain or technology

### Documentation

- Provide comprehensive README files
- Document each archetype's purpose
- Include usage examples
- Maintain changelog for versions

### Versioning

- Use Git tags for archetype and catalog versions
- Follow semantic versioning (v1, v2.1.0, etc.)
- Test compatibility between Git tag versions
- Tag stable releases for production use

### Quality Assurance

- Test all referenced Git repositories are accessible
- Validate catalog.yaml structure and Git sources
- Ensure archetypes work across different environments
- Use CI/CD workflows for automated validation

## Catalog Validation

Archetect validates catalog structure:

- `catalog.yaml` must contain required metadata
- All referenced Git repositories must be accessible
- Git source URLs must be valid
- Version tags must exist in referenced repositories

## Performance Considerations

- Use version tags to ensure reproducible builds
- Git repositories are cached automatically
- Keep catalog.yaml lightweight with external Git references
- Organize repositories for efficient discovery

## Real-World Examples

### Language-Specific Catalog (rust.catalog)

```
rust.catalog/
├── catalog.yaml           # Groups: Scaffolding, Services
├── README.md             # Version badge, usage instructions
├── .version-line         # Version tracking
├── .gitignore
└── .github/
    └── workflows/        # CI/CD automation
```

**Key Features:**
- Git-based archetype sources with version tags
- Organized by functional groups (Scaffolding, Services)
- Minimal structure focused on metadata

### Federated Catalog (archetect.catalog)

```
archetect.catalog/
├── catalog.yaml          # References to other catalogs
├── README.md            # Aggregation documentation
├── .version-line        # Version tracking
└── .github/
    └── workflows/       # Release automation
```

**Key Features:**
- Meta-catalog aggregating specialized catalogs
- Clean separation of concerns
- Centralized discovery point

### Enterprise Multi-Technology Catalog (p6m.catalog)

```
p6m.catalog/
├── catalog.yaml         # Multiple technology groups
├── README.md           # Federated catalog documentation
└── .gitignore
```

**Key Features:**
- Comprehensive technology coverage
- Architecture-focused archetypes
- Enterprise development patterns
- Git-based distributed architecture sources

This reference provides the foundation for understanding how catalogs are structured and managed. For implementation details, see the [Configuration Reference](../configuration) and [User Guide](../../user-guide/catalogs).