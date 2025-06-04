---
sidebar_position: 4
sidebar_label: Authoring Catalogs
---

# Authoring Catalogs

This guide covers everything you need to know about creating and managing Archetect catalogs - organized collections of archetypes that make it easy for users to discover and use your templates.

## What is a Catalog?

A catalog is a curated collection of archetypes organized in a hierarchical structure. Catalogs provide:

- **Organization**: Group related archetypes by language, framework, or purpose
- **Discoverability**: Help users find the right archetype quickly
- **Consistency**: Maintain quality standards across your archetype collection
- **Versioning**: Manage releases and updates centrally

## Catalog Structure

### Basic Catalog Layout

```
my-catalog/
├── catalog.yaml              # Catalog metadata (required)
├── README.md                 # Catalog documentation
├── rust/                     # Language category
│   ├── cli/                  # Archetype directory
│   │   ├── archetype.yaml    # Archetype manifest
│   │   ├── archetype.rhai    # Optional script
│   │   └── content/          # Template files
│   ├── web-service/
│   └── library/
├── python/
│   ├── django-app/
│   └── fastapi-service/
└── javascript/
    ├── react-app/
    └── node-api/
```

### Catalog Manifest

The `catalog.yaml` file defines your catalog's metadata:

```yaml
# catalog.yaml
name: my-awesome-catalog
description: A collection of modern application archetypes
version: 1.0.0
author: Your Name
repository: https://github.com/yourusername/my-catalog

# Optional metadata
tags:
  - web-development
  - microservices
  - cloud-native
license: MIT
homepage: https://my-catalog.example.com
```

## Creating Your First Catalog

### Step 1: Initialize the Catalog

Create a new directory and add the required `catalog.yaml`:

```bash
mkdir my-catalog
cd my-catalog

cat > catalog.yaml << EOF
name: my-catalog
description: My first Archetect catalog
version: 0.1.0
author: Your Name
EOF
```

### Step 2: Organize Your Archetypes

Create a logical directory structure for your archetypes:

```bash
# Create language/framework categories
mkdir -p rust/cli
mkdir -p rust/web
mkdir -p python/api
mkdir -p javascript/frontend
```

### Step 3: Add Archetypes

Each archetype lives in its own directory with its manifest:

```bash
# Create a Rust CLI archetype
cd rust/cli
cat > archetype.yaml << EOF
description: A modern Rust CLI application
authors:
  - Your Name
EOF

# Add template content
mkdir content
# ... add your template files ...
```

## Catalog Organization Strategies

### By Language

Organize archetypes by programming language:

```
catalog/
├── rust/
├── python/
├── javascript/
├── typescript/
├── go/
└── java/
```

### By Framework

Group archetypes by technology stack:

```
catalog/
├── react/
├── angular/
├── vue/
├── django/
├── spring-boot/
└── express/
```

### By Purpose

Categorize by application type:

```
catalog/
├── web-apps/
├── microservices/
├── cli-tools/
├── libraries/
├── mobile-apps/
└── data-pipelines/
```

### Hybrid Approach

Combine multiple organization strategies:

```
catalog/
├── web/
│   ├── frontend/
│   │   ├── react/
│   │   └── vue/
│   └── backend/
│       ├── node/
│       └── python/
├── mobile/
│   ├── ios/
│   └── android/
└── cli/
    ├── rust/
    └── go/
```

## Catalog Features

### Metadata and Discovery

Enhance discoverability with rich metadata:

```yaml
# In each archetype.yaml
description: Full-stack React application with TypeScript
tags:
  - react
  - typescript
  - full-stack
  - postgresql
keywords:
  - web-app
  - spa
  - rest-api
```

### Archetype Dependencies

Some archetypes might depend on others:

```yaml
# archetype.yaml
dependencies:
  - ../shared/base-config
  - ../shared/common-components
```

### Conditional Archetypes

Show archetypes based on user context:

```yaml
# archetype.yaml
requirements:
  - platform: linux,macos # Not available on Windows
  - min_version: 2.0.0 # Requires Archetect 2.0+
```

## Publishing Your Catalog

### GitHub Repository

The most common way to share catalogs:

1. Create a GitHub repository
2. Name it with `.catalog` suffix (e.g., `awesome-archetypes.catalog`)
3. Push your catalog structure
4. Users can reference it directly:

```bash
archetect catalog https://github.com/yourusername/awesome-archetypes.catalog
```

### Catalog Registry

Register your catalog for easier discovery:

```yaml
# catalog.yaml
registry:
  name: awesome-archetypes
  namespace: yourusername
  categories:
    - web-development
    - cloud-native
```

## Best Practices

### Catalog Design

1. **Clear Organization**: Use intuitive categories
2. **Consistent Naming**: Follow naming conventions
3. **Good Documentation**: Include README files
4. **Version Control**: Tag releases properly
5. **Quality Control**: Test all archetypes regularly

### Archetype Guidelines

1. **Single Purpose**: Each archetype should do one thing well
2. **Sensible Defaults**: Provide good default values
3. **Clear Prompts**: Write helpful prompt descriptions
4. **Examples**: Include usage examples
5. **Maintenance**: Keep archetypes up-to-date

### Documentation

Include comprehensive documentation:

```markdown
# README.md

# My Awesome Catalog

## Available Archetypes

### Rust

- **cli**: Command-line application with clap
- **web-service**: Async web service with actix-web

### Python

- **fastapi-service**: Modern API with FastAPI
- **django-app**: Full-featured web application

## Usage

archetect render https://github.com/user/catalog rust/cli
```

## Advanced Features

### Dynamic Catalog Generation

Generate catalog structure from external sources:

```rhai
// catalog-generator.rhai
let frameworks = fetch_popular_frameworks();
for framework in frameworks {
    create_archetype_directory(framework);
    generate_archetype_manifest(framework);
}
```

### Catalog Validation

Implement automated testing:

```bash
#!/bin/bash
# validate-catalog.sh

for archetype in $(find . -name "archetype.yaml"); do
    dir=$(dirname $archetype)
    echo "Testing $dir..."
    archetect render $dir --answer-file test-answers.yaml
done
```

### Catalog Metrics

Track usage and popularity:

```yaml
# catalog.yaml
analytics:
  enabled: true
  endpoint: https://analytics.example.com
  track:
    - renders
    - errors
    - completion_rate
```

## Maintaining Your Catalog

### Version Management

Use semantic versioning for your catalog:

```yaml
# catalog.yaml
version: 2.1.0 # Major.Minor.Patch
```

### Update Strategy

1. **Patch Updates** (2.1.0 → 2.1.1): Bug fixes only
2. **Minor Updates** (2.1.0 → 2.2.0): New archetypes, backward compatible
3. **Major Updates** (2.1.0 → 3.0.0): Breaking changes

### Deprecation Process

Handle archetype deprecation gracefully:

```yaml
# archetype.yaml
deprecated: true
deprecation_message: |
  This archetype is deprecated. Please use 'rust/async-cli' instead.
replacement: ../async-cli
```

## Examples

### Example: Web Development Catalog

```
web-dev.catalog/
├── catalog.yaml
├── frontend/
│   ├── react/
│   │   ├── spa/           # Single Page App
│   │   ├── ssr/           # Server-Side Rendering
│   │   └── static/        # Static Site
│   ├── vue/
│   └── angular/
├── backend/
│   ├── node/
│   │   ├── express/
│   │   └── fastify/
│   ├── python/
│   │   ├── django/
│   │   └── fastapi/
│   └── go/
│       ├── gin/
│       └── echo/
└── fullstack/
    ├── mern/              # MongoDB, Express, React, Node
    ├── mean/              # MongoDB, Express, Angular, Node
    └── t3-stack/          # TypeScript, tRPC, Tailwind
```

### Example: Microservices Catalog

```
microservices.catalog/
├── catalog.yaml
├── services/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── user-service/
│   └── notification-service/
├── infrastructure/
│   ├── docker-compose/
│   ├── kubernetes/
│   └── terraform/
└── shared/
    ├── proto-definitions/
    ├── common-libs/
    └── ci-cd-templates/
```

## Next Steps

Now that you understand catalog authoring:

1. **Plan Your Catalog**: Define scope and organization
2. **Create Archetypes**: Build your template collection
3. **Test Thoroughly**: Ensure quality and consistency
4. **Document Well**: Help users understand your catalog
5. **Share and Iterate**: Publish and improve based on feedback

For more details on creating individual archetypes, see the [Authoring Archetypes](../authoring-archetypes/) guide.
