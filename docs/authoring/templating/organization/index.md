---
sidebar_position: 2
---

# Template Organization

Effective template organization is crucial for creating maintainable, scalable, and reusable archetypes. This section covers proven patterns and strategies for structuring your templates.

## Organization Patterns

### 1. Hierarchical Organization

Mirror your target project structure in your templates. This approach makes it easy to understand the relationship between templates and the generated output.

```
content/
└── {{ project_name }}/          # Root project directory with variable name
    ├── src/
    │   ├── main.rs
    │   ├── lib.rs
    │   ├── models/
    │   │   ├── mod.rs
    │   │   └── {{model_name}}.rs
    │   └── api/
    │       ├── mod.rs
    │       └── {{endpoint_name}}.rs
    ├── tests/
    │   ├── integration/
    │   │   └── {{test_name}}.rs
    │   └── unit/
    │       └── {{module_name}}_test.rs
    └── docs/
        ├── README.md
        └── {{guide_name}}.md
```

**Benefits:**
- Clear mapping between templates and output
- Easy to navigate and understand
- Minimal cognitive overhead for developers

**Best for:**
- Simple to medium complexity projects
- Single-purpose archetypes
- Teams new to Archetect

### 2. Feature-Based Organization

Organize templates by features that can be enabled or disabled. This modular approach allows for flexible project generation.

```
content/
└── {{ project_name }}/          # Root project directory with variable name
    ├── core/                       # Always included
    │   ├── src/main.rs
    │   └── Cargo.toml
    ├── features/
    │   ├── database/              # Database feature
    │   │   ├── src/db/
    │   │   │   ├── mod.rs
    │   │   │   └── connection.rs
    │   │   └── migrations/
    │   ├── auth/                  # Authentication feature
    │   │   ├── src/auth/
    │   │   └── middleware/
    │   └── api/                   # API feature
    │       ├── src/routes/
    │       └── src/handlers/
    └── optional/                  # Optional components
        ├── docker/
        │   ├── Dockerfile
        │   └── docker-compose.yml
        └── ci/
            └── .github/workflows/
```

**Benefits:**
- Highly modular and flexible
- Easy to add/remove features
- Reusable feature components
- Clear separation of concerns

**Best for:**
- Complex projects with many optional features
- Framework archetypes
- Multi-purpose archetypes

### 3. Shared Components

Create reusable template fragments that can be included across multiple templates. This promotes consistency and reduces duplication.

```
content/
├── includes/                  # Shared template components
│   ├── license_header
│   ├── rust_imports
│   ├── error_types
│   └── test_helpers
└── {{ project_name }}/          # Root project directory with variable name
    ├── src/
    │   ├── main.rs
    │   └── lib.rs
    └── tests/
        └── integration.rs
```

Use shared components in your templates:

```jinja
{# src/main.rs #}
{% include "includes/license_header" %}
{% include "includes/rust_imports" %}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Application logic
    Ok(())
}

{% include "includes/error_types" %}
```

**Benefits:**
- Reduces code duplication
- Ensures consistency across templates
- Easier maintenance and updates
- Promotes reusable patterns

**Best for:**
- Large archetypes with repeated patterns
- Organizations with coding standards
- Multi-archetype projects

## Advanced Organization Strategies

### 1. Layered Organization

Combine multiple organization patterns for maximum flexibility:

```
content/
├── shared/                    # Shared across all configurations
│   ├── includes/
│   └── base_templates/
├── core/                      # Core functionality
│   └── {{ project_name }}/
│       ├── src/
│       └── Cargo.toml
├── features/                  # Optional features
│   ├── web/
│   ├── cli/
│   └── library/
└── platforms/                 # Platform-specific templates
    ├── linux/
    ├── windows/
    └── macos/
```

### 2. Template Variants

Create multiple variants of templates for different use cases:

```
content/
└── {{ project_name }}/
    ├── src/
    │   ├── main.rs.simple      # Simple version
    │   ├── main.rs.advanced    # Advanced version
    │   └── main.rs.minimal     # Minimal version
    └── configs/
        ├── development/
        ├── production/
        └── testing/
```

Use scripting to select the appropriate variant:

```rhai
// Select template variant based on complexity level
let template_suffix = if complexity == "advanced" {
    ".advanced"
} else if complexity == "minimal" {
    ".minimal"
} else {
    ".simple"
};

// Configure template selection
configure_templates("src/main.rs" + template_suffix, "src/main.rs");
```

### 3. Environment-Based Organization

Organize templates by deployment environment or configuration:

```
content/
└── {{ project_name }}/
    ├── src/                   # Common source code
    ├── configs/
    │   ├── local/
    │   │   └── config.toml
    │   ├── development/
    │   │   └── config.toml
    │   ├── staging/
    │   │   └── config.toml
    │   └── production/
    │       └── config.toml
    └── deployment/
        ├── docker/
        ├── kubernetes/
        └── terraform/
```

## File Naming Conventions

### 1. Template File Naming

Use clear, descriptive names that indicate the file's purpose:

```
# Good: Descriptive and clear
database_connection.rs
user_authentication_middleware.rs
api_error_responses.rs

# Avoid: Generic or unclear
db.rs
auth.rs
errors.rs
```

### 2. Dynamic File Names

Use template variables in file names for dynamic generation:

```
# Dynamic module names
{{module_name}}_handler.rs
{{service_name}}_client.rs

# Dynamic configuration files
{{environment}}_config.toml
{{database_type}}_schema.sql

# Dynamic test files
test_{{feature_name}}.rs
{{component_name}}_integration_test.rs
```

### 3. Template Extensions

Consider using file extensions to indicate template types:

```
main.rs.jinja           # Jinja template
config.toml.template    # Configuration template
Dockerfile.tmpl         # Docker template
README.md.mustache      # Documentation template
```

## Directory Structure Best Practices

### 1. Logical Grouping

Group related templates together:

```
content/
└── {{ project_name }}/
    ├── backend/           # Backend-specific templates
    │   ├── api/
    │   ├── models/
    │   └── services/
    ├── frontend/          # Frontend-specific templates
    │   ├── components/
    │   ├── pages/
    │   └── styles/
    └── shared/            # Shared between frontend/backend
        ├── types/
        └── utils/
```

### 2. Depth Management

Keep directory depth reasonable (typically 3-4 levels max):

```
# Good: Reasonable depth
content/project/src/models/user.rs

# Consider refactoring: Too deep
content/project/backend/api/v1/handlers/users/crud/create.rs
```

### 3. Parallel Structure

Maintain parallel structure across similar components:

```
features/
├── auth/
│   ├── src/
│   ├── tests/
│   └── docs/
├── database/
│   ├── src/
│   ├── tests/
│   └── docs/
└── logging/
    ├── src/
    ├── tests/
    └── docs/
```

## Template Documentation

### 1. README Files

Include README files to document template structure:

```markdown
# Authentication Feature Templates

This directory contains templates for user authentication functionality.

## Structure

- `src/auth/` - Core authentication logic
- `middleware/` - Authentication middleware components
- `tests/` - Authentication-related tests
- `migrations/` - Database migrations for user management

## Variables

- `auth_method` - Authentication method (jwt, session, oauth)
- `include_registration` - Include user registration endpoints
- `password_policy` - Password complexity requirements
```

### 2. Template Comments

Use comments to document complex template logic:

```jinja
{# 
Authentication module template
Supports multiple authentication methods based on auth_method variable
#}

{% if auth_method == "jwt" %}
  {# JWT-based authentication #}
  {% include "auth/jwt_handler.rs" %}
{% elif auth_method == "session" %}
  {# Session-based authentication #}
  {% include "auth/session_handler.rs" %}
{% endif %}
```

### 3. Variable Documentation

Document expected variables and their purposes:

```jinja
{#
Required Variables:
- project_name: Name of the project (used for crate name)
- database_type: Type of database (postgresql, mysql, sqlite)
- include_migrations: Whether to include database migrations

Optional Variables:
- description: Project description (default: "A generated project")
- license: Project license (default: "MIT")
#}
```

This comprehensive approach to template organization will help you create maintainable, scalable, and reusable archetype templates.