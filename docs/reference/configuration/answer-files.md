---
sidebar_position: 3
---

# Answer Files

Answer files allow you to pre-populate answers to archetype prompts, enabling automated and repeatable archetype generation. This is particularly useful for CI/CD pipelines, batch operations, or when you have standard configurations that you want to reuse.

## Purpose

Answer files serve several key purposes:

- **Automation**: Enable non-interactive archetype rendering
- **Consistency**: Ensure the same answers are used across multiple generations
- **Templates**: Create reusable answer sets for common scenarios
- **CI/CD Integration**: Allow archetype generation in automated pipelines
- **Batch Operations**: Generate multiple projects with similar configurations

## Supported Formats

Archetect supports three answer file formats:

### YAML Format

The most human-readable format, ideal for version control and manual editing:

```yaml title="answers.yaml"
# Project metadata
project_name: "my-awesome-project"
description: "A modern web application"
author_name: "John Doe"
author_email: "john@example.com"

# Technology choices
language: "TypeScript"
framework: "React"
database: "PostgreSQL"

# Features
enable_auth: true
enable_testing: true
enable_docker: false

# Configuration
port: 3000
api_version: "v1"
license: "MIT"

# Arrays/Lists
features:
  - "authentication"
  - "api"
  - "frontend"

# Nested objects
database_config:
  host: "localhost"
  port: 5432
  name: "myapp"
```

### JSON Format

Compact format, useful for programmatic generation:

```json title="answers.json"
{
  "project_name": "my-awesome-project",
  "description": "A modern web application",
  "author_name": "John Doe",
  "author_email": "john@example.com",
  "language": "TypeScript",
  "framework": "React",
  "database": "PostgreSQL",
  "enable_auth": true,
  "enable_testing": true,
  "enable_docker": false,
  "port": 3000,
  "api_version": "v1",
  "license": "MIT",
  "features": ["authentication", "api", "frontend"],
  "database_config": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp"
  }
}
```

### Rhai Format

Dynamic format using Rhai scripting, allows computed values:

```rust title="answers.rhai"
#{
  // Basic values
  project_name: "my-awesome-project",
  description: "A modern web application",
  author_name: "John Doe",
  author_email: "john@example.com",

  // Technology choices
  language: "TypeScript",
  framework: "React",
  database: "PostgreSQL",

  // Computed values
  project_slug: "my-awesome-project".to_lower().replace(" ", "-"),
  timestamp: timestamp(),
  year: parse_int(format_time(timestamp(), "%Y")),

  // Conditional logic
  enable_auth: true,
  enable_testing: true,
  enable_docker: false,

  // Configuration
  port: 3000,
  api_version: "v1",
  license: "MIT",

  // Arrays
  features: ["authentication", "api", "frontend"],

  // Nested objects
  database_config: #{
    host: "localhost",
    port: 5432,
    name: "myapp"
  }
}
```

:::tip
Rhai format is powerful for dynamic answer generation, allowing you to compute values, use timestamps, perform string manipulations, and implement conditional logic.
:::

## Usage

### Command Line Interface

Answer files can be specified using the `--answer-file` or `-A` flag:

```bash
# Single answer file
archetect render my-archetype --answer-file answers.yaml

# Multiple answer files (later files override earlier ones)
archetect render my-archetype \
  --answer-file base-answers.yaml \
  --answer-file environment-specific.yaml

# Combine with individual answers (individual answers take precedence)
archetect render my-archetype \
  --answer-file answers.yaml \
  --answer "port=8080" \
  --answer "debug=true"
```

## Answer Precedence

When multiple answer sources are provided, they are applied in this order (later sources override earlier ones):

1. **Configuration file answers** - From `answers` section in configuration files
2. **Answer files** - Files specified via `--answer-file` flags (processed in order)
3. **Individual command-line answers** - Via `--answer key=value` flags
4. **Interactive prompts** - For any remaining unanswered questions

:::info
Each later source can override answers from earlier sources, allowing for flexible answer layering and customization.
:::

## Data Types

Answer files support all JSON/YAML data types:

### Strings

```yaml
project_name: "My Project"
description: "Single quoted string"
unquoted_string: Simple value
```

### Numbers

```yaml
port: 3000
version_major: 1
price: 29.99
```

### Booleans

```yaml
enable_auth: true
debug_mode: false
```

### Arrays/Lists

```yaml
languages:
  - "JavaScript"
  - "TypeScript"
  - "Python"

# Or inline format
frameworks: ["React", "Vue", "Angular"]
```

### Objects/Maps

```yaml
database:
  type: "PostgreSQL"
  host: "localhost"
  port: 5432
  credentials:
    username: "admin"
    password: "secret"
```

### Null Values

```yaml
optional_field: null
empty_field: ~
```

## Best Practices

### Organization

```yaml
# Group related answers together
# Project metadata
project_name: "my-project"
description: "Project description"
version: "1.0.0"

# Author information
author_name: "John Doe"
author_email: "john@example.com"
organization: "ACME Corp"

# Technology stack
language: "TypeScript"
framework: "React"
database: "PostgreSQL"

# Feature flags
features:
  auth: true
  testing: true
  docker: false
```

### Environment-Specific Files

Create separate answer files for different environments:

```bash
# Base configuration
answers-base.yaml

# Environment-specific overrides
answers-development.yaml
answers-staging.yaml
answers-production.yaml
```

### Version Control

- **Include**: Template answer files, base configurations
- **Exclude**: Files with sensitive data (passwords, API keys)
- **Use**: Environment variables or separate secure files for secrets

### Documentation

Add comments to YAML answer files for clarity:

```yaml
# Core project settings
project_name: "my-project" # Used for directory name and package.json
description: "Web application" # Used in README and package.json

# Database configuration
database_host: "localhost" # Development: localhost, Production: db.example.com
database_port: 5432 # Standard PostgreSQL port
```

## Error Handling

Common error scenarios and solutions:

### Invalid File Format

```
Error: Provided answer file is not a supported answer file format
```

**Solution**: Ensure file has `.yaml`, `.yml`, `.json`, or `.rhai` extension.

### Invalid Structure

```
Error: Provided answer file must be structured as a YAML Object
```

**Solution**: Ensure the root level is an object/map, not an array or scalar value.

### Missing File

```
Error: Answer file does not exist
```

**Solution**: Verify the file path is correct and the file exists.

### Parse Errors

```
Error parsing answer config: found character '%' that cannot start any token
```

**Solution**: Fix YAML/JSON syntax errors in the answer file.

## Integration Examples

### CI/CD Pipeline

```yaml title=".github/workflows/generate.yml"
name: Generate Project
on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        required: true
        default: "development"

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate project
        run: |
          archetect render my-archetype \
            --answer-file "answers-base.yaml" \
            --answer-file "answers-${{ github.event.inputs.environment }}.yaml" \
            --destination "./generated"
```

### Batch Generation

```bash
#!/bin/bash
# Generate multiple projects with variations

for service in auth api frontend; do
  archetect render microservice-template \
    --answer-file base-microservice.yaml \
    --answer "service_name=$service" \
    --destination "./services/$service"
done
```
