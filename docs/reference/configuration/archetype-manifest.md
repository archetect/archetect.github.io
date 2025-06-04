# Archetype Manifest

The archetype manifest (`archetype.yaml` or `archetype.yml`) is the configuration file that defines an archetype's metadata, requirements, and behavior. This file must be present in the root directory of every archetype.

## File Location and Naming

Archetect looks for the manifest file in the archetype root directory with these names (in order):
- `archetype.yml` 
- `archetype.yaml`

:::note
If no manifest file is found, Archetect will return an error.
:::

## Complete Manifest Example

```yaml title="archetype.yaml"
# Required: Description of what this archetype generates
description: "Modern Web Application with TypeScript and React"

# Optional: Archetype authors
authors:
  - "John Doe <john@example.com>"
  - "Jane Smith <jane@example.com>"

# Optional: Programming languages this archetype targets
languages:
  - "TypeScript"
  - "JavaScript"
  - "CSS"

# Optional: Frameworks and libraries this archetype uses
frameworks:
  - "React"
  - "Vite"
  - "TailwindCSS"

# Optional: Tags for categorization
tags:
  - "web"
  - "frontend"
  - "spa"

# Required: Runtime requirements
requires:
  archetect: ">=2.0.0"

# Optional: Child archetype components
components:
  auth-module: "https://github.com/example/auth.git"
  api-client: "./local/api-client"

# Optional: Scripting configuration
scripting:
  main: "archetype.rhai"      # Main orchestration script
  modules: "modules"          # Directory containing script modules

# Optional: Templating configuration  
templating:
  content: "."                # Content directory (default: ".")
  templates: "templates"      # Templates directory (default: "templates")
  undefined_behavior: "Strict" # How to handle undefined variables
```

## Required Fields

### Description

Every archetype must have a description explaining what it generates:

```yaml
description: "REST API service with authentication and database integration"
```

### Requirements

Specifies the minimum Archetect version required to run this archetype:

```yaml
requires:
  archetect: ">=2.0.0"    # Semantic version requirement
```

Common version patterns:
- `"2.0.0"` - Exact version
- `">=2.0.0"` - Minimum version
- `"^2.0.0"` - Compatible version (2.x.x)
- `"~2.0.0"` - Patch-level changes (2.0.x)

## Optional Metadata Fields

### Authors

List of archetype maintainers:

```yaml
authors:
  - "John Doe <john@example.com>"
  - "Team Name"
```

### Languages

Programming languages this archetype targets:

```yaml
languages:
  - "Rust"
  - "TOML"
  - "Markdown"
```

### Frameworks

Frameworks and libraries used by the generated code:

```yaml
frameworks:
  - "Axum"
  - "Tokio"
  - "SQLx"
```

### Tags

Categorization tags for discovery and organization:

```yaml
tags:
  - "backend"
  - "microservice"
  - "database"
```

## Components

Components allow an archetype to include other archetypes as reusable modules:

```yaml
components:
  # Local relative path
  database: "./database-module"
  
  # Git repository (latest)
  auth: "https://github.com/example/auth-archetype.git"
  
  # Git repository with branch/tag
  logging: "https://github.com/example/logging.git#v1.2.0"
  
  # Git repository with specific commit
  utils: "https://github.com/example/utils.git@abc123"
```

:::info
Components are rendered in the order they are defined and can access variables set by earlier components.
:::

## Scripting Configuration

Controls the Rhai scripting engine behavior:

```yaml
scripting:
  main: "archetype.rhai"      # Main orchestration script
  modules: "modules"          # Directory for script modules
```

### Default Values

- `main`: `"archetype.rhai"`
- `modules`: `"modules"`

:::tip
The main script is executed during archetype rendering and can orchestrate complex generation logic, prompts, and file operations.
:::

## Templating Configuration

Controls the Jinja2-like templating engine:

```yaml
templating:
  content: "."                # Content directory
  templates: "templates"      # Templates directory  
  undefined_behavior: "Strict" # Variable handling
```

### Content Directory

The `content` directory contains files that will be processed as templates and copied to the destination:

- `"."` - Root of archetype (default)
- `"src"` - Only process files in `src/` directory
- `"content"` - Process files in `content/` directory

### Templates Directory

The `templates` directory contains shared template files that can be included or extended:

- `"templates"` - Templates in `templates/` directory (default)
- `"shared"` - Templates in `shared/` directory

### Undefined Behavior

Controls how the templating engine handles undefined variables:

```yaml
templating:
  undefined_behavior: "Strict"    # Fail on undefined variables (default)
  # undefined_behavior: "Lenient"  # Ignore undefined variables  
  # undefined_behavior: "Chainable" # Allow chaining through undefined
```

**Options:**
- `Strict` (default): Throws an error when encountering undefined variables
- `Lenient`: Undefined variables render as empty strings
- `Chainable`: Allows property access on undefined variables (useful for optional objects)

:::warning
Use `Lenient` or `Chainable` carefully as they can hide template errors and make debugging difficult.
:::

## File Processing

:::note
Archetect treats **all files** as templates regardless of their extension. Files are processed through the templating engine unless explicitly excluded by scripting logic.
:::

## Validation

The manifest is validated for:
- **YAML syntax**: Must be valid YAML
- **Required fields**: `description` and `requires` must be present  
- **Version format**: `requires.archetect` must be a valid semantic version requirement
- **Path format**: All path fields must be valid relative paths
- **Component sources**: Must be valid Git URLs or relative paths

Invalid manifests will cause archetype loading to fail with descriptive error messages.