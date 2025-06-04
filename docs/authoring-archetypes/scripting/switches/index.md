---
sidebar_position: 4
---

# Switches

Switches in Archetect provide a powerful mechanism for conditional content generation, allowing users to enable or disable features through command-line flags. This enables flexible archetype behavior without requiring complex prompts.

## Overview

Switches are boolean flags that can be:
- Enabled via command-line arguments
- Checked in Rhai scripts using `switch_enabled()`
- Used in templates for conditional content
- Inherited by child archetypes
- Pre-configured in configuration files

## Basic Switch Usage

### Checking Switches in Rhai

```rhai
// Basic switch checking
if switch_enabled("build") {
    context.enable_build = true;
    context.optimization_level = "release";
}

if switch_enabled("test") {
    context.test_framework = "junit";
    context.enable_coverage = true;
}

// Debug output of switch status
print("Build enabled: " + switch_enabled("build"));
print("Test enabled: " + switch_enabled("test"));
```

### Accessing All Switches

```rhai
// The SWITCHES global variable contains all active switches
debug(SWITCHES);  // Prints array of all enabled switches

// Check if any switches are enabled
if SWITCHES.len() > 0 {
    print("Active switches: " + SWITCHES.join(", "));
}
```

## Command Line Usage

### Basic Switch Syntax

```bash
# Enable a single switch
archetect render --switch build <source>

# Enable multiple switches
archetect render --switch build --switch test <source>

# Short form
archetect render -s build -s test <source>
```

### Real-world Examples

```bash
# Generate a Rust microservice with build optimizations
archetect render https://github.com/archetect/rust-service.git \
  --switch build \
  --switch optimize \
  --destination ./my-service

# Development mode with debugging and testing
archetect render . \
  --switch development \
  --switch debug \
  --switch test

# Production deployment with monitoring
archetect render https://github.com/example/web-app.git \
  -s production \
  -s monitoring \
  -s logging \
  --destination ./production-app
```

### Integration with Other Options

```bash
# Combine switches with answers and configuration
archetect render https://github.com/example/archetype.git \
  --answer project_name=my-app \
  --answer version=1.0.0 \
  --switch production \
  --switch monitoring \
  --destination ./output \
  --offline
```

## Switch Patterns and Conventions

### Environment Switches

```rhai
// Environment-specific configuration
if switch_enabled("development") {
    context.environment = "dev";
    context.debug_mode = true;
    context.log_level = "debug";
    context.database_url = "postgresql://localhost:5432/myapp_dev";
    
} else if switch_enabled("staging") {
    context.environment = "staging";
    context.debug_mode = false;
    context.log_level = "info";
    context.database_url = "postgresql://staging.example.com:5432/myapp";
    
} else if switch_enabled("production") {
    context.environment = "prod";
    context.debug_mode = false;
    context.log_level = "warn";
    context.enable_metrics = true;
    context.enable_monitoring = true;
}
```

### Feature Switches

```rhai
// Optional feature enablement
let features = [];

if switch_enabled("auth") {
    features.push("authentication");
    context.auth_provider = "oauth2";
    context.enable_jwt = true;
}

if switch_enabled("api") {
    features.push("rest_api");
    context.api_version = "v1";
    context.enable_swagger = true;
}

if switch_enabled("monitoring") {
    features.push("metrics");
    features.push("health_checks");
    context.metrics_endpoint = "/metrics";
    context.health_endpoint = "/health";
}

if switch_enabled("logging") {
    features.push("structured_logging");
    context.log_format = "json";
    context.enable_request_logging = true;
}

context.enabled_features = features;
```

### Build and Deployment Switches

```rhai
// Build configuration
if switch_enabled("build") {
    context.enable_build_scripts = true;
    
    if switch_enabled("optimize") {
        context.optimization_level = "release";
        context.enable_lto = true;
        context.strip_debug = true;
    } else {
        context.optimization_level = "debug";
        context.enable_debug_symbols = true;
    }
}

// Testing configuration
if switch_enabled("test") {
    context.enable_unit_tests = true;
    context.test_coverage = true;
    
    if switch_enabled("integration") {
        context.enable_integration_tests = true;
        context.test_database = "postgresql://localhost:5432/test_db";
    }
}
```

## Advanced Switch Patterns

### Switch Combinations and Dependencies

```rhai
// Handle switch dependencies and conflicts
if switch_enabled("production") && switch_enabled("debug") {
    print("Warning: Debug mode enabled in production");
    // Could throw error or auto-disable debug
}

// Auto-enable dependent switches
if switch_enabled("monitoring") && !switch_enabled("logging") {
    print("Monitoring requires logging - enabling logging features");
    context.enable_logging = true;
}

// Feature combinations
let has_database = switch_enabled("postgres") || switch_enabled("mysql") || switch_enabled("sqlite");
if switch_enabled("auth") && !has_database {
    print("Authentication requires database - please enable a database switch");
}
```

### Progressive Feature Selection

```rhai
// Use switches for progressive enhancement
context.features = #{
    basic: true  // Always enabled
};

// Add features based on switches
if switch_enabled("enhanced") {
    context.features.caching = true;
    context.features.rate_limiting = true;
}

if switch_enabled("enterprise") {
    context.features.sso = true;
    context.features.audit_logging = true;
    context.features.multi_tenancy = true;
}

if switch_enabled("cloud") {
    context.features.auto_scaling = true;
    context.features.load_balancing = true;
    context.features.container_deployment = true;
}
```

### Conditional File Generation

```rhai
// Generate different sets of files based on switches
context.generate_files = #{
    core: true,  // Always generate core files
    docker: switch_enabled("docker"),
    kubernetes: switch_enabled("k8s") || switch_enabled("kubernetes"),
    ci_cd: switch_enabled("github") || switch_enabled("gitlab"),
    docs: switch_enabled("docs") || switch_enabled("documentation"),
    tests: switch_enabled("test") || switch_enabled("testing")
};

// Language-specific files
if switch_enabled("rust") {
    context.generate_files.cargo_toml = true;
    context.generate_files.rust_src = true;
} else if switch_enabled("node") {
    context.generate_files.package_json = true;
    context.generate_files.js_src = true;
}
```

## Switch Inheritance and Propagation

### Parent-Child Archetype Switches

```rhai
// In parent archetype
debug("Parent switches:", SWITCHES);

// Child inherits all parent switches
Archetype("components/database").render(context);

// Child inherits parent switches plus additional ones
Archetype("components/api").render(context, #{
    switches: SWITCHES + ["api_docs", "swagger"]
});

// Child with completely different switches (not recommended)
Archetype("standalone/utility").render(context, #{
    switches: ["utility", "minimal"]
});
```

### Switch Context Passing

```rhai
// Pass switch information through context
context.switches = #{
    development: switch_enabled("development"),
    production: switch_enabled("production"),
    testing: switch_enabled("test"),
    debugging: switch_enabled("debug")
};

// Use in templates or child archetypes
if context.switches.development {
    context.cors_enabled = true;
    context.dev_tools = true;
}
```

## Template Integration

Switches are also available in templates for conditional content generation:

```jinja
{# Dockerfile #}
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

{% if switch_enabled("development") %}
# Development dependencies
RUN npm ci
{% endif %}

COPY . .

{% if switch_enabled("build") %}
RUN npm run build
{% endif %}

{% if switch_enabled("production") %}
ENV NODE_ENV=production
{% else %}
ENV NODE_ENV=development
{% endif %}

EXPOSE {{ port | default(3000) }}

{% if switch_enabled("monitoring") %}
# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:{{ port | default(3000) }}/health || exit 1
{% endif %}

CMD ["npm", "start"]
```

## Configuration File Support

### Pre-configured Switches

Switches can be defined in configuration files:

```yaml
# ~/.archetect/config.yaml
switches:
  - development
  - debug
  - logging

# Project-specific archetect.yaml
default_switches:
  - build
  - test
```

### Switch Profiles

```yaml
# ~/.archetect/config.yaml
switch_profiles:
  dev:
    - development
    - debug
    - test
    - logging
  
  prod:
    - production
    - optimize
    - monitoring
    - logging
  
  minimal:
    - build
```

```bash
# Use switch profiles
archetect render . --profile dev
archetect render . --profile prod
```

## Best Practices

### Naming Conventions

```rhai
// Use clear, descriptive switch names
if switch_enabled("enable_authentication") {  // Clear intent
if switch_enabled("auth") {                   // Concise alternative

// Group related switches with prefixes
if switch_enabled("feature_caching") {
if switch_enabled("feature_monitoring") {
if switch_enabled("feature_logging") {

// Environment switches
if switch_enabled("env_development") {
if switch_enabled("env_production") {
```

### Switch Documentation

```rhai
// Document switch behavior in scripts
// Available switches:
// - build: Enable build scripts and optimizations
// - test: Include testing frameworks and utilities  
// - docker: Generate Docker configuration files
// - k8s: Generate Kubernetes deployment manifests
// - monitoring: Add monitoring and metrics endpoints
// - auth: Enable authentication and authorization

let context = #{};

if switch_enabled("build") {
    // Build configuration logic
    context.enable_build = true;
}
```

### Default Behavior

```rhai
// Provide sensible defaults when no switches are enabled
if SWITCHES.len() == 0 {
    print("No switches enabled - using default configuration");
    context.environment = "development";
    context.features = ["core"];
} else {
    print("Active switches: " + SWITCHES.join(", "));
}

// Graceful fallbacks
context.log_level = if switch_enabled("debug") {
    "debug"
} else if switch_enabled("production") {
    "warn"
} else {
    "info"  // Default
};
```

## Testing Switch Behavior

```rhai
// Test switch scenarios in development
if switch_enabled("test_switches") {
    print("Testing switch combinations:");
    
    print("Build: " + switch_enabled("build"));
    print("Test: " + switch_enabled("test"));
    print("Production: " + switch_enabled("production"));
    print("Debug: " + switch_enabled("debug"));
    
    debug("All switches:", SWITCHES);
}
```

Switches provide a clean, user-friendly way to customize archetype behavior without complex prompting, making your archetypes more flexible and easier to use in different scenarios.

## Next Steps

- Learn about [Prompting](../prompting/) for interactive input
- Explore [Casing](../casing/) for name transformations
- Check [Rhai Basics](../rhai-basics/) for core language features