---
sidebar_position: 1
---

# Archetype

Archetype composition enables rendering other archetypes from within an archetype, creating powerful modular code generation capabilities. This sophisticated feature allows complex archetypes to be built from smaller, focused components while maintaining proper isolation and configuration inheritance.

## Overview

Archetype composition works by:
1. **Component Registration**: Defining component archetypes in the parent's `archetype.yaml`
2. **Script Rendering**: Using the `Archetype()` function in scripts to render components
3. **Context Passing**: Sharing variables, settings, and switches between parent and child archetypes
4. **Destination Control**: Specifying where component content is generated

:::tip Core Concept
Every archetype that renders other archetypes must register those components in its `archetype.yaml` manifest. This ensures security and predictable behavior.
:::

:::important No Automatic Inheritance
Component archetypes do **not** automatically inherit switches, answers, or settings from the parent archetype. All data must be explicitly passed down through the render method parameters. This gives you full control over what information component archetypes can access.
:::

## Component Registration

### Defining Components in archetype.yaml

Components must be declared in the `components` section of the parent archetype's manifest:

```yaml
# archetype.yaml
name: "enterprise-java-service"
description: "Complete Java service with common components"

components:
  # Local component archetypes
  rest-api: "components/rest-api"
  database-layer: "components/database"
  
  # GitHub-hosted components
  security-config: "git@github.com:company/security-archetype.git"
  monitoring: "https://github.com/company/monitoring-archetype.git"
  
  # Version-specific components
  ci-pipeline: "git@github.com:company/ci-archetype.git#v2.1.0"
```

### Component Path Types

| Path Type | Example | Description |
|-----------|---------|-------------|
| **Relative** | `"components/api"` | Local directory relative to parent archetype |
| **Absolute** | `"/path/to/archetype"` | Absolute filesystem path |
| **Git SSH** | `"git@github.com:org/repo.git"` | SSH-based Git repository |
| **Git HTTPS** | `"https://github.com/org/repo.git"` | HTTPS-based Git repository |
| **Git Tagged** | `"git@github.com:org/repo.git#v1.0.0"` | Specific Git tag or branch |

:::note Security
Component paths are validated to prevent directory traversal attacks. All paths must resolve to safe, accessible locations.
:::

## The Archetype() Function

### Basic Usage

The `Archetype()` function creates a reference to a registered component:

```rhai
// Basic component rendering
Archetype("rest-api").render(#{});

// Rendering with context variables
Archetype("database-layer").render(#{
    database_type: "postgresql",
    schema_name: "app_schema"
});
```

### Function Signature

```rhai
Archetype(component_key)
```

**Parameters:**
- `component_key` - String identifier matching a key in the `components` section

**Returns:** Archetype object with render methods

**Error Conditions:**
- Component key not found in manifest: `"Archetypes must be registered in archetype.yaml, and 'unknown-key' archetype has not been listed there"`
- Invalid component path or inaccessible archetype

## Render Methods

The Archetype object provides flexible rendering options:

| Call Signature | Description |
|----------------|-------------|
| `render(context)` | Basic rendering with default settings and destination |
| `render(context, settings)` | Rendering with custom configuration options |
| `render(destination, context)` | Rendering to specific destination (string or Path) |
| `render(destination, context, settings)` | Complete control with destination and settings |

### render(context)

Basic rendering with default settings and destination.

```rhai
// Simple component rendering
Archetype("api-layer").render(#{
    service_name: "user-service",
    port: 8080
});
```

### render(context, settings)

Rendering with custom configuration options.

```rhai
// Rendering with switches and settings
Archetype("security-layer").render(#{
    auth_provider: "oauth2",
    enable_rbac: true
}, #{
    switches: ["security", "audit-logging"],
    use_defaults: ["auth_method", "encryption_key"]
});
```

### render(destination, context)

Rendering to a specific destination directory.

```rhai
// Render to custom destination
Archetype("frontend-app").render("./web-client", #{
    app_name: "user-dashboard",
    api_base_url: "https://api.example.com"
});

// Using Path object for destination
let dest_path = Path("./services/auth");
Archetype("auth-service").render(dest_path, #{
    database_url: "postgresql://localhost/auth_db"
});
```

### render(destination, context, settings)

Complete control with destination, context, and settings.

```rhai
// Full configuration rendering
Archetype("microservice-template").render(
    "./services/payment",
    #{
        service_name: "payment-service",
        database_type: "postgresql",
        message_queue: "rabbitmq"
    },
    #{
        switches: ["database", "messaging", "monitoring"],
        use_defaults_all: false
    }
);
```

## Practical Examples

### Enterprise Java Service Composition

```yaml
# archetype.yaml
name: "enterprise-java-service"
description: "Complete Java microservice with enterprise patterns"

components:
  spring-boot-base: "components/spring-boot"
  rest-controllers: "components/rest-api"
  jpa-entities: "components/database"
  security-config: "components/security"
  docker-setup: "components/containerization"
  ci-pipeline: "git@github.com:company/java-ci.git"
```

```rhai
// archetype.rhai - Service composition script

// Core Spring Boot application
Archetype("spring-boot-base").render(#{
    group_id: context.group_id,
    artifact_id: context.service_name,
    java_version: context.java_version,
    spring_boot_version: "3.2.0"
});

// REST API layer
Archetype("rest-controllers").render("./src/main/java", #{
    package_name: context.package_name,
    service_name: context.service_name,
    api_version: "v1"
});

// Database layer with JPA
if switch_enabled("database") {
    Archetype("jpa-entities").render("./src/main/java", #{
        package_name: context.package_name + ".model",
        database_type: context.database_type,
        schema_name: context.service_name
    });
}

// Security configuration
if switch_enabled("security") {
    Archetype("security-config").render(#{
        auth_method: context.auth_method,
        enable_rbac: true,
        jwt_secret_key: context.jwt_secret
    });
}

// Docker and deployment
Archetype("docker-setup").render(#{
    base_image: "openjdk:21-jre-slim",
    service_port: context.server_port,
    health_check_path: "/actuator/health"
});

// CI/CD pipeline
if switch_enabled("ci-cd") {
    Archetype("ci-pipeline").render("./ci", #{
        service_name: context.service_name,
        docker_registry: context.docker_registry,
        deployment_env: ["dev", "staging", "prod"]
    }, #{
        switches: ["docker", "kubernetes", "sonarqube"]
    });
}
```

### Multi-Language Project Structure

```yaml
# archetype.yaml
name: "full-stack-application"
description: "Complete web application with frontend and backend"

components:
  backend-api: "components/node-api"
  frontend-app: "components/react-app"
  database-schema: "components/postgresql"
  deployment-config: "git@github.com:company/k8s-deploy.git"
```

```rhai
// Multi-component application setup

// Backend API service
Archetype("backend-api").render("./backend", #{
    app_name: context.app_name,
    database_url: context.database_url,
    cors_origins: [context.frontend_url]
}, #{
    switches: ["typescript", "graphql", "testing"]
});

// Frontend application
Archetype("frontend-app").render("./frontend", #{
    app_name: context.app_name + "-client",
    api_base_url: context.api_url,
    theme: context.ui_theme
}, #{
    switches: ["typescript", "pwa", "testing"],
    use_defaults: true
});

// Database schema and migrations
Archetype("database-schema").render("./database", #{
    schema_name: context.app_name,
    initial_data: context.seed_data
});

// Kubernetes deployment manifests
if switch_enabled("kubernetes") {
    Archetype("deployment-config").render("./k8s", #{
        app_name: context.app_name,
        namespace: context.environment,
        replicas: context.replica_count,
        ingress_host: context.domain_name
    });
}
```

### Conditional Component Rendering

```rhai
// Conditional archetype composition based on project type

let project_type = context.project_type;

// Base application structure (always rendered)
Archetype("base-structure").render(#{
    project_name: context.project_name,
    author: context.author
});

// Conditional component rendering
switch project_type {
    "web-api" => {
        Archetype("rest-api").render("./src", context);
        Archetype("database").render("./src", context);
        
        if context.enable_auth {
            Archetype("authentication").render("./src", #{
                auth_provider: context.auth_provider
            });
        }
    },
    
    "cli-tool" => {
        Archetype("command-parser").render("./src", context);
        Archetype("config-management").render("./src", context);
    },
    
    "library" => {
        Archetype("lib-structure").render("./src", context);
        
        if switch_enabled("examples") {
            Archetype("example-code").render("./examples", context);
        }
    }
}

// Common development tools (conditional)
if switch_enabled("testing") {
    Archetype("test-framework").render("./tests", #{
        test_type: context.test_framework,
        coverage_threshold: 80
    });
}

if switch_enabled("ci-cd") {
    Archetype("github-actions").render("./.github", #{
        workflow_name: context.project_name + "-ci",
        node_version: context.node_version
    });
}
```

## Settings Reference

Archetype rendering supports the following settings in the settings map:

| Setting | Type | Description |
|---------|------|-------------|
| `switches` | Array of strings | Feature switches to enable in the child archetype |
| `use_defaults` | Array of strings | Specific prompt keys to use default values for |
| `use_defaults_all` | Boolean | Use default values for all prompts without asking |

**Example settings map:**
```rhai
let settings = #{
    switches: ["feature1", "feature2"],
    use_defaults: ["prompt_name1", "prompt_name2"],
    use_defaults_all: false
};
```

## Settings and Configuration

:::note File Handling Policies
Archetype rendering does not support file overwrite policies (`if_exists`). Individual files rendered by child archetypes will follow their default behavior. For fine-grained file handling control, use [Directory rendering](../directories) instead.
:::

### Switch Passing

Switches must be **explicitly passed down** to child archetypes. They are not automatically inherited from the parent or command line:

```rhai
// Command line switches: --switch database --switch api
// These are NOT automatically available to components

// Explicitly pass current switches to child archetype
Archetype("backend-service").render(context, #{
    switches: SWITCHES  // Pass current switches from parent
});

// Extend switches for specific components
Archetype("enhanced-service").render(context, #{
    switches: SWITCHES + ["authentication", "logging"]
});

// Use only specific switches (ignore parent switches)
Archetype("minimal-component").render(context, #{
    switches: ["essential-only"]
});

// Component gets no switches (even if parent has them)
Archetype("isolated-component").render(context);
```

### Default Handling

Control how child archetypes handle default values:

```rhai
// Use all defaults in child archetype
Archetype("quick-setup").render(context, #{
    use_defaults_all: true
});

// Use defaults for specific prompts
Archetype("guided-setup").render(context, #{
    use_defaults: ["database_type", "auth_method"]
});

// No defaults, prompt for everything
Archetype("custom-setup").render(context, #{
    use_defaults_all: false
});
```

### Switch and Default Configuration

Control archetype behavior with switches and default handling:

```rhai
// Force all prompts to use default values
Archetype("quick-setup").render(context, #{
    use_defaults_all: true,
    switches: ["production", "optimized"]
});

// Use defaults for specific prompts only
Archetype("guided-setup").render(context, #{
    use_defaults: ["database_type", "auth_method"],
    switches: ["security", "monitoring"]
});

// No defaults, prompt for everything
Archetype("interactive-setup").render(context, #{
    use_defaults_all: false,
    switches: ["development", "debug"]
});
```

## Advanced Patterns

### Dynamic Component Selection

```rhai
// Select components based on runtime conditions
let database_component = switch context.database_type {
    "postgresql" => "postgresql-setup",
    "mysql" => "mysql-setup", 
    "mongodb" => "mongodb-setup",
    _ => "sqlite-setup"
};

Archetype(database_component).render("./database", context);

// Platform-specific components
let platform_components = #{
    "aws": ["aws-lambda", "rds-config", "s3-storage"],
    "azure": ["azure-functions", "cosmos-db", "blob-storage"],
    "gcp": ["cloud-functions", "firestore", "cloud-storage"]
};

for component in platform_components[context.cloud_platform] {
    Archetype(component).render("./cloud", context);
}
```

### Iterative Component Rendering

```rhai
// Render multiple instances of the same component
for service in context.microservices {
    let service_context = context.clone();
    service_context.service_name = service.name;
    service_context.service_port = service.port;
    
    Archetype("microservice-template").render(
        `./services/${service.name}`,
        service_context
    );
}

// Generate multiple environments
let environments = ["development", "staging", "production"];
for env in environments {
    Archetype("environment-config").render(`./config/${env}`, #{
        environment: env,
        debug_enabled: env == "development",
        replicas: if env == "production" { 3 } else { 1 }
    });
}
```

### Hierarchical Composition

```rhai
// Multi-level archetype composition
// Level 1: Application structure
Archetype("app-foundation").render(context);

// Level 2: Domain modules (each may compose further)
for domain in context.domains {
    Archetype("domain-module").render(`./src/${domain}`, #{
        domain_name: domain,
        entities: context.domain_entities[domain]
    });
}

// Level 3: Cross-cutting concerns
Archetype("logging-setup").render("./src/infrastructure", context);
Archetype("monitoring-setup").render("./src/infrastructure", context);
```

## Error Handling and Validation

### Component Validation

```rhai
// Validate required components before rendering
let required_components = ["base-app", "database"];
for component in required_components {
    if !component_exists(component) {
        throw `Required component '${component}' not found in archetype.yaml`;
    }
}

// Conditional rendering with error handling
try {
    Archetype("external-service").render(context);
} catch (error) {
    print(`Warning: External service setup failed: ${error}`);
    print("Continuing with local development setup...");
    
    Archetype("local-development").render(context);
}
```

### Context Validation

```rhai
// Validate context before component rendering
let validate_context = |ctx| {
    let required_fields = ["project_name", "author", "version"];
    for field in required_fields {
        if !(field in ctx) {
            throw `Missing required field: ${field}`;
        }
    }
    
    if ctx.project_name.len() < 3 {
        throw "Project name must be at least 3 characters";
    }
};

validate_context(context);

// Safe rendering with validated context
Archetype("validated-setup").render(context);
```

## Integration with Manifest Components

:::note Cross-Reference
Archetype components must be properly registered in the manifest. For detailed information about archetype configuration, see [Working with Archetypes](../../../../user-guide/archetypes).
:::

### Component Manifest Structure

Components in `archetype.yaml` use a simple key-value mapping format:

```yaml
# archetype.yaml
components:
  # Local component references
  web-server: "components/nginx"
  database: "components/postgresql"
  
  # Git repository components
  security-module: "git@github.com:company/security-archetype.git"
  ci-pipeline: "https://github.com/company/ci-archetype.git"
  
  # Git components with specific tags/branches
  monitoring: "git@github.com:company/monitoring.git#v2.1.0"
```

:::note Simple Format
Components are defined as simple key-value pairs where the key is the component name used in scripts and the value is the path or URI to the component archetype. Metadata like description or version is not supported in the components section.
:::

## Inheritance and Isolation

### Explicit Data Flow

Archetype composition uses **explicit data flow** rather than automatic inheritance:

```rhai
// Command line: archetect render --switch production --switch database myapp

// In parent archetype script:
// SWITCHES = ["production", "database"]  // Available from command line
// context = { app_name: "myapp", version: "1.0" }  // From prompts

// Component sees NOTHING unless explicitly passed
Archetype("isolated").render(#{});  // No switches, no context

// Component sees only what you give it
Archetype("partial").render(#{
    name: context.app_name  // Only app_name, not version
}, #{
    switches: ["database"]  // Only database switch, not production
});

// Component sees everything you choose to pass
Archetype("full-access").render(context, #{
    switches: SWITCHES
});
```

### Benefits of Explicit Control

- **Security**: Components can't access sensitive data unless explicitly provided
- **Isolation**: Components remain independent and testable
- **Flexibility**: Different components can receive different data subsets
- **Clarity**: Data flow is explicit and visible in the script

## Best Practices

### Component Design

:::tip Modular Design
Design components to be focused, reusable, and loosely coupled. Each component should handle a specific concern or technology.
:::

```rhai
// Good: Focused, single-responsibility components
Archetype("database-layer").render("./src/data", context);
Archetype("api-controllers").render("./src/api", context);
Archetype("business-logic").render("./src/business", context);

// Avoid: Monolithic components that do everything
// Archetype("entire-application").render(context);  // Too broad
```

### Context Management

Component archetypes only receive the context you explicitly pass to them:

```rhai
// Parent archetype has full context
// context = { project_name: "myapp", database_type: "postgres", api_version: "v1" }

// Create specific context for each component
let database_context = #{
    database_type: context.database_type,    // Explicitly select what to pass
    schema_name: context.project_name,
    migration_strategy: context.migration_strategy
};

let api_context = #{
    service_name: context.project_name,      // Control what each component sees
    version: context.api_version,
    authentication: context.auth_enabled
};

// Each component only gets the context you provide
Archetype("database-setup").render("./database", database_context);
Archetype("api-layer").render("./api", api_context);

// This component gets NO context variables
Archetype("static-component").render("./static", #{});
```

### Performance Optimization

```rhai
// Render components in parallel when possible
// (Archetect automatically handles concurrency safety)

let components = [
    ["frontend-app", "./frontend"],
    ["backend-api", "./backend"], 
    ["database-schema", "./database"]
];

for [component, destination] in components {
    Archetype(component).render(destination, context);
}
```

### Testing Component Composition

```rhai
// Include testing components conditionally
if switch_enabled("testing") {
    // Unit tests for each layer
    Archetype("unit-tests").render("./tests/unit", context);
    
    // Integration tests
    Archetype("integration-tests").render("./tests/integration", context);
    
    // End-to-end tests
    if switch_enabled("e2e-tests") {
        Archetype("e2e-tests").render("./tests/e2e", context);
    }
}
```

## Common Patterns

| Pattern | Use Case | Key Features |
|---------|----------|--------------|
| **Service Mesh** | Multiple microservices with shared infrastructure | Service iteration, shared context, infrastructure components |
| **Layered Architecture** | Clean architecture with separated concerns | Layer-specific components, structured organization |
| **Conditional Composition** | Feature-based project generation | Switch-based rendering, dynamic component selection |
| **Environment-Specific** | Multi-environment deployments | Configuration per environment, deployment variations |

### Service Mesh Architecture

```rhai
// Service mesh with multiple services
let services = context.services;
let shared_context = #{
    namespace: context.namespace,
    service_mesh: "istio",
    monitoring_enabled: true
};

// Generate each service
for service in services {
    let service_context = shared_context.clone();
    service_context.service_name = service.name;
    service_context.service_type = service.type;
    
    Archetype("microservice").render(
        `./services/${service.name}`,
        service_context
    );
}

// Shared infrastructure
Archetype("service-mesh-config").render("./infrastructure", shared_context);
Archetype("monitoring-stack").render("./monitoring", shared_context);
```

### Layered Architecture

```rhai
// Generate layered application architecture
let layers = [
    ["presentation", "./src/presentation"],
    ["application", "./src/application"],
    ["domain", "./src/domain"],
    ["infrastructure", "./src/infrastructure"]
];

for [layer, path] in layers {
    Archetype(`${layer}-layer`).render(path, #{
        layer_name: layer,
        project_name: context.project_name
    });
}
```

Archetype composition provides unprecedented flexibility in code generation, enabling the creation of sophisticated, modular archetypes that can adapt to diverse project requirements while maintaining consistency and best practices.

## Next Steps

- Learn about [Working with Archetypes](../../../../user-guide/archetypes) for archetype usage and configuration
- Explore [String Rendering](../string) for dynamic content generation within components
- Check [Directory Rendering](../directories) for file-based template processing