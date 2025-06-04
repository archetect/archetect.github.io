---
sidebar_position: 1
sidebar_label: "Archetype Layout"
---

# Archetype Layout

This section provides a comprehensive reference for the structure and organization of Archetect archetypes.

## Overview

An archetype defines the structure, configuration, and logic for generating code projects. Understanding the archetype layout is essential for both using existing archetypes and creating your own.

## Basic Archetype Structure

Modern archetypes follow this standard directory structure, with examples from real-world archetypes:

```
github-action.archetype/
├── archetype.yaml          # Archetype metadata and configuration
├── archetype.rhai          # Interactive script for user input
├── .gitignore             # Standard Git ignore patterns
├── .version-line          # Version tracking
├── README.md              # Usage documentation
└── contents/              # Template files and directories
    └── {{ action-name }}/  # Parameterized project structure
        ├── .github/
        │   └── workflows/
        ├── src/
        └── README.md
```

```
java-spring-boot-graphql-domain-gateway.archetype/
├── archetype.yaml          # Complex archetype with components
├── archetype.rhai          # Multi-stage rendering script
├── README.md              # Documentation with usage examples
├── .gitignore
├── contents/              # Multi-directory template structure
│   ├── base/
│   │   └── {{ artifact-id }}/
│   └── entity/
│       └── {{ artifact-id }}/
└── templates/
    └── macros/            # Reusable template components
```

## Core Files

### archetype.yaml

Real-world archetype configuration examples:

#### Simple Archetype (github-action.archetype)

```yaml
description: "Github Action"
authors:
  - "Jimmie Fulton <jimmie@ybor.ai>"
languages: []
frameworks: []
tags: []
archetect: "2.0.0"
```

#### Complex Modular Archetype (java-spring-boot-graphql-domain-gateway.archetype)

```yaml
description: "Java Spring Boot GraphQL Domain Gateway"
authors:
  - "Jimmie Fulton <jimmie@ybor.ai>"
languages:
  - "Java"
frameworks:
  - "Spring"
  - "SpringBoot"
  - "GraphQL"
tags:
  - "Modular"
  - "Service"
  - "Microservice"
  - "GraphQL"
archetect: "2.0.0-ALPHA.15"

components:
  org-prompts:
    source: "git@github.com:p6m-archetypes/org-prompts.archetype.git"
  java-project-attributes:
    source: "git@github.com:p6m-archetypes/java-project-attributes.archetype.git"
  manifests:
    source: "git@github.com:p6m-archetypes/platform-application-manifests.archetype.git"
  gitignore:
    source: "https://github.com/archetect/dot-gitignore.archetype.git"
  grpc-services-integration:
    source: "git@github.com:p6m-archetypes/grpc-services-integration.archetype.git"
```

#### Gateway Archetype (rust-graphql-federated-gateway.archetype)

```yaml
description: "GraphQL Federated Gateway Archetype"
authors:
  - "Jimmie Fulton <jimmie@ybor.ai>"
languages:
  - "YAML"
frameworks:
  - "Apollo Router"
tags:
  - "GraphQL"
  - "Apollo"
  - "Federation"
archetect: "2.0.0-ALPHA.8"

components:
  org-prompts:
    source: "git@github.com:p6m-archetypes/org-prompts.archetype.git"
  gitignore:
    source: "https://github.com/archetect/dot-gitignore.archetype.git"
```

### archetype.rhai

Real interactive scripts for gathering user input and processing:

#### Simple GitHub Action Script

```rhai
let context = #{};

// Gather user input
context.author_email = prompt("Author Email:");
context.author_name = prompt("Author Name:");
context.github_org = prompt("Github Org:");
context.action_name = prompt("Action Name:");

// Dynamic transformations
context.action_name_kebab = kebab_case(context.action_name);
context.action_name_snake = snake_case(context.action_name);

// Display commands for user
print("Create the repository:");
print(`gh repo create ${context.github_org}/${context.action_name_kebab} --public`);

// Render content
render("org-prompts", destination, #{}, debug);
render("gitignore", destination, context, debug);
render("contents", destination, context, debug);
```

#### Complex Multi-Stage Script (Spring Boot Gateway)

```rhai
let context = #{};
let debug = false;

// Initial component rendering
render("org-prompts", destination, context, debug);
render("java-project-attributes", destination, context, debug);
render("grpc-services-integration", destination, context, debug);

// Dynamic port assignment
for i in range(0, context.services.len()) {
    context.services[i].service_port = 8080 + i;
}

// Additional configuration
context.artifactory_host = prompt("Artifactory Host:");

// Process entities iteratively  
for entity in context.entities {
    let entity_context = context.clone();
    entity_context.current_entity = entity;
    render("entity", destination, entity_context, debug);
}

// Final rendering
render("base", destination, context, debug);
render("manifests", destination, context, debug);
render("gitignore", destination, context, debug);
```

### Naming Conventions

Real archetypes use consistent naming patterns:

```
<language>-<framework>-<purpose>.archetype
```

Examples from p6m-archetypes:
- `java-spring-boot-graphql-domain-gateway.archetype`
- `rust-graphql-federated-gateway.archetype`
- `github-action.archetype`
- `dotnet-grpc-service.archetype`
- `typescript-angular-app.archetype`

## Contents Directory

The `contents/` directory contains all template files that will be processed and copied to the destination. Modern archetypes use parameterized directory structures.

### Parameterized Directory Structure

Modern archetypes use template variables in directory names:

```
contents/
└── {{ action-name }}/          # GitHub Action archetype
    ├── .github/
    │   └── workflows/
    ├── action.yml
    ├── src/
    └── README.md

contents/
├── base/
│   └── {{ artifact-id }}/      # Java Spring Boot archetype  
│       ├── src/
│       ├── pom.xml
│       └── README.md
└── entity/
    └── {{ artifact-id }}/
        └── {{ artifact-id }}-server/
            └── src/main/

contents/
└── {{ project-name }}/         # Rust Gateway archetype
    ├── Cargo.toml
    ├── src/
    └── router.yaml
```

### Template Processing

- **All files** are processed as templates, regardless of extension
- Variables from the Rhai script context are available in templates  
- Use `{{variable}}` for substitution and `{% %}` for logic
- Directory names can be parameterized with variables

## Advanced Layout Patterns

### Component-Based Archetypes

Modern enterprise archetypes use modular components:

```yaml
# In archetype.yaml
components:
  org-prompts:
    source: "git@github.com:p6m-archetypes/org-prompts.archetype.git"
  java-project-attributes:
    source: "git@github.com:p6m-archetypes/java-project-attributes.archetype.git"
  manifests:
    source: "git@github.com:p6m-archetypes/platform-application-manifests.archetype.git"
  gitignore:
    source: "https://github.com/archetect/dot-gitignore.archetype.git"
```

### Multi-Stage Rendering

Complex archetypes render components in sequence:

```rhai
// Stage 1: Gather organizational info
render("org-prompts", destination, context, debug);

// Stage 2: Configure project attributes  
render("java-project-attributes", destination, context, debug);

// Stage 3: Setup service integration
render("grpc-services-integration", destination, context, debug);

// Stage 4: Process entities iteratively
for entity in context.entities {
    let entity_context = context.clone();
    entity_context.current_entity = entity;
    render("entity", destination, entity_context, debug);
}

// Stage 5: Final project structure
render("base", destination, context, debug);
render("manifests", destination, context, debug);
```

### Template Macros

Organize reusable components:

```
archetype/
├── archetype.yaml
├── archetype.rhai
├── contents/
│   └── {{ artifact-id }}/
└── templates/
    └── macros/               # Reusable template components
        ├── service-config.yaml
        ├── dockerfile.j2
        └── kubernetes.yaml
```

## Best Practices

### File Organization

- Keep the root clean with only essential files
- Use descriptive directory names in `contents/`
- Use parameterized directory structures (`{{ variable-name }}/`)
- Organize components and templates in separate directories

### Naming Conventions

- Use `.archetype` suffix for archetype repositories
- Follow pattern: `<language>-<framework>-<purpose>.archetype`
- Use kebab-case for archetype names and variables
- Use descriptive file and directory names
- Maintain consistency across similar archetypes

### Component Design

- Use modular components for reusability
- Reference external archetypes for common functionality
- Implement multi-stage rendering for complex workflows
- Design for iterative processing of collections

### Documentation

- Include clear usage instructions with `archetect render` commands
- Document the technology stack and frameworks used
- Provide examples of generated project structures
- Explain component dependencies and rendering stages

## Archetype Validation

Archetect validates archetype structure during usage:

- `archetype.yaml` must be valid YAML with required fields
- Rhai scripts must be syntactically correct
- Template syntax must be valid Jinja2
- File paths must not contain invalid characters

## Performance Considerations

- Use Git-based component references instead of bundling everything
- Implement efficient Rhai scripts with minimal external calls
- Cache component renders where possible
- Design modular archetypes for faster individual updates

## Real-World Examples

### Simple Interactive Archetype (github-action.archetype)

```
github-action.archetype/
├── archetype.yaml           # Basic metadata and version requirement
├── archetype.rhai          # Interactive prompts and rendering
├── README.md               # Usage documentation  
├── .gitignore
├── .version-line           # Version tracking
└── contents/
    └── {{ action-name }}/  # Parameterized project directory
        ├── .github/
        │   └── workflows/
        ├── action.yml
        ├── src/
        └── README.md
```

### Complex Enterprise Archetype (java-spring-boot-graphql-domain-gateway.archetype)

```
java-spring-boot-graphql-domain-gateway.archetype/
├── archetype.yaml          # Complex configuration with components
├── archetype.rhai          # Multi-stage rendering script
├── README.md              # Comprehensive documentation
├── .gitignore
├── contents/              # Multi-directory template structure
│   ├── base/
│   │   └── {{ artifact-id }}/
│   │       ├── src/main/java/
│   │       ├── pom.xml
│   │       └── README.md
│   └── entity/
│       └── {{ artifact-id }}/
│           └── {{ artifact-id }}-server/
│               └── src/main/
└── templates/
    └── macros/            # Reusable components
```

### Federated Gateway Archetype (rust-graphql-federated-gateway.archetype)

```
rust-graphql-federated-gateway.archetype/
├── archetype.yaml         # Apollo Router configuration
├── archetype.rhai         # Component-based rendering
├── README.md              # Technology-specific documentation
├── .gitignore
└── contents/
    └── {{ project-name }}/
        ├── Cargo.toml
        ├── src/
        │   └── main.rs
        ├── router.yaml    # Apollo Router config
        └── schemas/       # GraphQL schemas
```

This reference provides the foundation for understanding how archetypes are structured and organized. For more details on specific components, see the related documentation sections.