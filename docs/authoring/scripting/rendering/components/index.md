---
sidebar_position: 3
---

# Rendering Components

Component rendering enables archetype composition by allowing you to include other archetypes as reusable components. This powerful feature supports modular design, archetype libraries, and complex multi-part generation workflows.

## Overview

Component rendering works through two key elements:
1. **Component Registration** in `archetype.yaml`
2. **Component Invocation** using the `Archetype()` function in Rhai scripts

This system enables you to break complex archetypes into smaller, focused components that can be mixed and matched as needed.

## Component Registration

### Basic archetype.yaml Configuration

Components must be registered in your `archetype.yaml` file:

```yaml
---
description: "Full-stack web application archetype"

requires:
  archetect: "2.0.0"

# Component registration
components:
  database: "components/database"
  auth: "components/auth"
  api: "components/api"
  frontend: "components/frontend"
  docs: "components/documentation"
```

### Component Directory Structure

```
my-archetype/
├── archetype.yaml              # Main archetype configuration
├── archetype.rhai              # Main script
├── templates/                  # Main templates
└── components/                 # Component archetypes
    ├── database/
    │   ├── archetype.yaml      # Database component config
    │   ├── archetype.rhai      # Database component script
    │   └── templates/          # Database templates
    ├── auth/
    │   ├── archetype.yaml
    │   ├── archetype.rhai
    │   └── templates/
    └── api/
        ├── archetype.yaml
        ├── archetype.rhai
        └── templates/
```

## Basic Component Rendering

### The Archetype() Function

```rhai
// Create an Archetype component reference
let db_component = Archetype("database");

// Basic component rendering
db_component.render(context);

// Or directly in one line
Archetype("database").render(context);
```

### Simple Component Usage

```rhai
let context = #{
    project_name: "web-app",
    author: "Developer"
};

// Render database component
Archetype("database").render(#{
    db_type: "postgresql",
    db_name: snake_case(context.project_name) + "_db"
});

// Render authentication component
Archetype("auth").render(#{
    auth_provider: "oauth2",
    enable_jwt: true
});

// Render API component
Archetype("api").render(#{
    api_version: "v1",
    enable_swagger: true
});
```

## Component Rendering with Settings

### Adding Switches to Components

```rhai
// Render component with additional switches
Archetype("database").render(context, #{
    switches: ["migrations", "testing"]
});

// Inherit parent switches and add more
Archetype("frontend").render(context, #{
    switches: SWITCHES + ["dev_server", "hot_reload"]
});

// Component-specific switch combinations
Archetype("api").render(context, #{
    switches: ["swagger", "cors", "rate_limiting"]
});
```

### Using Default Settings

```rhai
// Enable all defaults for streamlined setup
Archetype("docs").render(context, #{
    use_defaults_all: true
});

// Use defaults for specific fields
Archetype("auth").render(context, #{
    use_defaults: ["auth_provider", "session_timeout"]
});
```

### Destination Override

```rhai
// Render component to custom destination
Archetype("database").render("backend/database/", context);

// Render with Path for type safety
let api_path = Path("backend/api/");
Archetype("api").render(api_path, context);

// Multiple components to different destinations
Archetype("frontend").render("client/", context);
Archetype("backend").render("server/", context);
Archetype("shared").render("common/", context);
```

## Advanced Component Patterns

### Conditional Component Inclusion

```rhai
// Feature-based component rendering
if "authentication" in context.features {
    Archetype("auth").render(#{
        provider: context.auth_provider,
        enable_2fa: "two_factor" in context.features
    });
}

if "database" in context.features {
    Archetype("database").render(#{
        db_type: context.database_type,
        enable_migrations: true
    });
}

if "api" in context.features {
    Archetype("api").render(#{
        api_style: context.api_style,
        enable_docs: "documentation" in context.features
    });
}

// Switch-based component rendering
if switch_enabled("full_stack") {
    Archetype("frontend").render(context);
    Archetype("backend").render(context);
    Archetype("database").render(context);
} else if switch_enabled("api_only") {
    Archetype("backend").render(context);
    Archetype("database").render(context);
}
```

### Component Dependencies

```rhai
// Handle component dependencies
let selected_features = context.features;

// Always include core components
Archetype("core").render(context);

// Database is required for auth
if "auth" in selected_features {
    if !("database" in selected_features) {
        print("Authentication requires database - including database component");
        Archetype("database").render(context);
    }
    Archetype("auth").render(context);
}

// API requires auth for protected endpoints
if "api" in selected_features {
    let api_context = context + #{
        protected_endpoints: "auth" in selected_features
    };
    Archetype("api").render(api_context);
}
```

### Component Context Customization

```rhai
// Customize context for each component
let base_context = #{
    project_name: context.project_name,
    author: context.author,
    version: "1.0.0"
};

// Database-specific context
let db_context = base_context + #{
    db_type: context.database_type,
    db_host: "localhost",
    db_port: 5432,
    enable_ssl: switch_enabled("production")
};

Archetype("database").render(db_context);

// API-specific context
let api_context = base_context + #{
    api_port: context.api_port,
    cors_origins: context.cors_origins,
    rate_limit: switch_enabled("production") ? 100 : 1000
};

Archetype("api").render(api_context);

// Frontend-specific context
let frontend_context = base_context + #{
    framework: context.frontend_framework,
    api_url: "http://localhost:" + context.api_port,
    enable_pwa: switch_enabled("pwa")
};

Archetype("frontend").render(frontend_context);
```

## Component Libraries and Ecosystems

### Reusable Component Sets

```rhai
// Define component groups for different architectures
let microservices_components = [
    "service_template",
    "api_gateway", 
    "service_discovery",
    "monitoring"
];

let monolith_components = [
    "web_server",
    "database",
    "auth",
    "frontend"
];

// Render architecture-specific components
let components = if context.architecture == "microservices" {
    microservices_components
} else {
    monolith_components
};

for component in components {
    Archetype(component).render(context, #{
        switches: SWITCHES + [context.architecture]
    });
}
```

### Component Configuration Patterns

```rhai
// Use configuration maps for complex component setups
let component_configs = #{
    database: #{
        context: #{
            db_type: "postgresql",
            enable_migrations: true,
            pool_size: 10
        },
        switches: ["migrations", "testing"],
        destination: "backend/database/"
    },
    
    api: #{
        context: #{
            version: "v1",
            enable_swagger: true,
            enable_cors: true
        },
        switches: ["swagger", "validation"],
        destination: "backend/api/"
    },
    
    frontend: #{
        context: #{
            framework: "react",
            styling: "tailwind",
            state_management: "redux"
        },
        switches: ["dev_tools", "hot_reload"],
        destination: "frontend/"
    }
};

// Render components using configuration
for (name, config) in component_configs {
    if name in context.selected_components {
        Archetype(name).render(
            config.destination,
            context + config.context,
            #{
                switches: SWITCHES + config.switches
            }
        );
    }
}
```

## Error Handling and Validation

### Component Availability Checking

```rhai
// Validate components before rendering
let required_components = ["core", "database", "api"];

for component in required_components {
    if !component_exists(component) {
        throw "Required component not found: " + component;
    }
}

// Safe component rendering with error handling
let optional_components = ["docs", "monitoring", "testing"];

for component in optional_components {
    if component in context.features {
        try {
            Archetype(component).render(context);
        } catch (error) {
            print("Warning: Failed to render " + component + ": " + error);
        }
    }
}
```

### Context Validation

```rhai
// Validate context before component rendering
fn validate_component_context(component_name, context) {
    let required_fields = switch component_name {
        "database" => ["db_type", "db_name"],
        "auth" => ["auth_provider"],
        "api" => ["api_version", "api_port"],
        _ => []
    };
    
    for field in required_fields {
        if !(field in context) {
            throw component_name + " component requires field: " + field;
        }
    }
}

// Use validation before rendering
validate_component_context("database", db_context);
Archetype("database").render(db_context);
```

## Integration Patterns

### Multi-Stage Component Rendering

```rhai
// Stage 1: Core infrastructure
Archetype("infrastructure").render(context);
Archetype("database").render(context);

// Stage 2: Application layer
Archetype("backend").render(context);
Archetype("api").render(context);

// Stage 3: Frontend and documentation
if context.include_frontend {
    Archetype("frontend").render(context);
}

if context.include_docs {
    Archetype("documentation").render(context);
}

// Stage 4: Development tools
if switch_enabled("development") {
    Archetype("dev_tools").render(context, #{
        switches: ["hot_reload", "debug_mode"]
    });
}
```

### Component Communication

```rhai
// Share data between components using context
let shared_config = #{
    database_url: "postgresql://localhost:5432/" + context.db_name,
    api_base_url: "http://localhost:" + context.api_port,
    frontend_url: "http://localhost:" + context.frontend_port
};

// Each component gets shared configuration
Archetype("database").render(context + shared_config);
Archetype("api").render(context + shared_config);
Archetype("frontend").render(context + shared_config);
```

### Component Inheritance

```rhai
// Parent archetype renders base structure
Directory("base_templates/").render(context);

// Child components extend the base
Archetype("auth").render(context, #{
    switches: SWITCHES + ["extend_base"]
});

Archetype("api").render(context, #{
    switches: SWITCHES + ["extend_base", "openapi"]
});
```

## Best Practices

### Component Design

```rhai
// Design components to be self-contained
Archetype("database").render(#{
    // All database-related configuration
    db_type: context.database_type,
    db_name: context.project_name + "_db",
    enable_migrations: true,
    enable_seeding: switch_enabled("development")
});

// Use consistent naming conventions
let component_prefix = snake_case(context.project_name);

Archetype("api").render(#{
    service_name: component_prefix + "_api",
    namespace: pascal_case(context.project_name)
});
```

### Component Testing

```rhai
// Include testing components conditionally
if switch_enabled("testing") {
    // Unit tests for each component
    Archetype("database_tests").render(context);
    Archetype("api_tests").render(context);
    
    // Integration tests
    if switch_enabled("integration") {
        Archetype("integration_tests").render(context);
    }
}
```

### Documentation and Maintenance

```rhai
// Document component usage
print("Rendering application components:");
print("- Database: " + context.database_type);
print("- API: " + context.api_version);
print("- Frontend: " + context.frontend_framework);

// Track rendered components
context.rendered_components = [];

let components = ["database", "api", "frontend"];
for component in components {
    if component in context.features {
        Archetype(component).render(context);
        context.rendered_components.push(component);
    }
}

print("Successfully rendered: " + context.rendered_components.join(", "));
```

Component rendering enables sophisticated archetype composition, allowing you to build modular, reusable archetype systems that can adapt to different project requirements and architectural patterns.

## Next Steps

- Learn [String Rendering](../strings/) for inline template processing
- Explore [Directory Rendering](../directories/) for file system operations
- Check the main [Rendering overview](../) for combining all rendering methods