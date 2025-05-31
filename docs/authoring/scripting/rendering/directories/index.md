---
sidebar_position: 2
---

# Rendering Directories

Directory rendering processes entire folder structures, applying template context to all files within a directory hierarchy. This is the primary method for generating complete project structures while maintaining file organization and relationships.

## Basic Directory Rendering

### The Directory() Function

The `Directory()` function creates a directory renderer that processes all templates within a specified path:

```rhai
// Create a Directory object
let content_dir = Directory("content/");

// Basic directory rendering
content_dir.render(context);
```

### Simple Directory Structure

Given this archetype structure:

```
my-archetype/
├── archetype.rhai
└── content/
    └── {{ project_name }}/     # Root project directory with variable name
        ├── src/
        │   ├── main.rs
        │   └── lib.rs
        ├── Cargo.toml
        └── README.md
```

Basic rendering example:

```rhai
let context = #{
    project_name: "my-project",
    version: "0.1.0",
    author: "John Doe"
};

// Render all templates in the content/ directory
// This creates the entire project structure including the root directory
Directory("content").render(context);
```

## Directory Rendering with Destinations

### Custom Output Locations

```rhai
// Render to a custom destination
Directory("content/backend/").render("src/backend/", context);

// Render with Path enum for type safety
let output_path = Path("generated/frontend/");
Directory("content/frontend/").render(output_path, context);

// Multiple destinations for different components
Directory("content/common/").render("shared/", context);
Directory("content/server/").render("backend/", context);
Directory("content/client/").render("frontend/", context);
```

### Conditional Directory Rendering

```rhai
// Render directories based on user choices
if context.include_tests {
    Directory("content/tests/").render("tests/", context);
}

if switch_enabled("docker") {
    Directory("content/docker/").render(".", context);
}

// Feature-based directory rendering
for feature in context.selected_features {
    switch feature {
        "auth" => Directory("content/features/auth/").render("src/auth/", context),
        "database" => Directory("content/features/database/").render("src/db/", context),
        "api" => Directory("content/features/api/").render("src/api/", context)
    }
}
```

## Directory Rendering Options

### Overwrite Policies

```rhai
// Available overwrite policies
Directory("content/").render(context, #{
    if_exists: Overwrite   // Overwrite existing files
});

Directory("content/").render(context, #{
    if_exists: Preserve    // Keep existing files, skip conflicts
});

Directory("content/").render(context, #{
    if_exists: Prompt      // Ask user what to do for each conflict
});
```

### Advanced Rendering Settings

```rhai
// Comprehensive settings example
Directory("content/complex/").render("output/", context, #{
    if_exists: Preserve,
    use_defaults_all: true,
    switches: ["development", "debug"]
});
```

## Practical Examples

### Multi-Language Project Structure

```rhai
let context = #{
    project_name: "web-app",
    author: "Developer",
    version: "1.0.0",
    database_type: "postgresql"
};

// Base project structure
Directory("content/base/").render(context);

// Language-specific components
if context.backend_language == "rust" {
    Directory("content/backend/rust/").render("backend/", context);
} else if context.backend_language == "node" {
    Directory("content/backend/node/").render("backend/", context);
}

if context.frontend_framework == "react" {
    Directory("content/frontend/react/").render("frontend/", context);
} else if context.frontend_framework == "vue" {
    Directory("content/frontend/vue/").render("frontend/", context);
}

// Database-specific migrations
Directory("content/database/" + context.database_type + "/").render("migrations/", context);
```

### Microservices Architecture

```rhai
// Generate multiple services
let services = ["user", "order", "payment", "notification"];

for service in services {
    let service_context = context + #{
        service_name: service,
        service_port: 8000 + services.find_index(service),
        service_pascal: pascal_case(service),
        service_snake: snake_case(service)
    };

    // Each service gets its own directory
    Directory("content/service/").render("services/" + service + "/", service_context);
}

// Shared infrastructure
Directory("content/infrastructure/").render("infrastructure/", context);
Directory("content/common/").render("shared/", context);
```

### Environment-Specific Configurations

```rhai
// Base configuration for all environments
Directory("content/config/base/").render("config/", context);

// Environment-specific overrides
let environments = ["development", "staging", "production"];

for env in environments {
    let env_context = context + #{
        environment: env,
        debug_mode: env == "development",
        optimization: env == "production"
    };

    Directory("content/config/" + env + "/").render("config/" + env + "/", env_context);
}
```

## Advanced Directory Patterns

### Conditional File Inclusion

Organize templates to support conditional inclusion:

```
archetype/
├── content/
│   ├── core/           # Always included
│   │   ├── src/
│   │   └── Cargo.toml
│   ├── optional/
│   │   ├── docker/     # Only if Docker enabled
│   │   ├── k8s/        # Only if Kubernetes enabled
│   │   └── docs/       # Only if documentation enabled
│   └── features/
│       ├── auth/       # Authentication feature
│       ├── database/   # Database feature
│       └── api/        # API feature
```

```rhai
// Always render core files
Directory("content/core/").render(context);

// Conditional optional components
if switch_enabled("docker") {
    Directory("content/optional/docker/").render(context);
}

if switch_enabled("k8s") {
    Directory("content/optional/k8s/").render("k8s/", context);
}

if context.include_docs {
    Directory("content/optional/docs/").render("docs/", context);
}

// Feature-based rendering
for feature in context.features {
    if file_exists("content/features/" + feature + "/") {
        Directory("content/features/" + feature + "/").render("src/" + feature + "/", context);
    }
}
```

### Nested Directory Rendering

```rhai
// Render nested structures with different contexts
let app_context = context + #{
    component_type: "application"
};

let lib_context = context + #{
    component_type: "library"
};

// Application components
Directory("content/app/").render("src/app/", app_context);

// Library components
Directory("content/lib/").render("src/lib/", lib_context);

// Shared utilities
Directory("content/shared/").render("src/shared/", context);
```

### Dynamic Directory Paths

```rhai
// Build directory paths dynamically
let base_path = "generated/" + kebab_case(context.project_name);

// Render to dynamically constructed paths
Directory("content/api/").render(base_path + "/api/", context);
Directory("content/ui/").render(base_path + "/ui/", context);
Directory("content/docs/").render(base_path + "/docs/", context);

// Path construction with validation
let output_dir = if context.output_directory.len() > 0 {
    context.output_directory
} else {
    "output/" + snake_case(context.project_name)
};

Directory("content/").render(output_dir, context);
```

## Integration with Other Features

### Combining with Switches

```rhai
// Switch-driven directory selection
let template_base = if switch_enabled("minimal") {
    "content/minimal/"
} else if switch_enabled("full") {
    "content/full/"
} else {
    "content/standard/"
};

Directory(template_base).render(context);

// Multiple switches affecting directory rendering
if switch_enabled("testing") {
    Directory("content/tests/").render("tests/", context);
}

if switch_enabled("benchmarks") {
    Directory("content/benches/").render("benches/", context);
}

if switch_enabled("examples") {
    Directory("content/examples/").render("examples/", context);
}
```

### Using with Case Transformations

```rhai
// Generate directories with proper naming
let module_name = snake_case(context.service_name);
let class_name = pascal_case(context.service_name);

let service_context = context + #{
    module_name: module_name,
    class_name: class_name,
    file_prefix: module_name,
    namespace: pascal_case(context.project_name)
};

Directory("content/service/").render("src/" + module_name + "/", service_context);
```

## Best Practices

### Template Organization

```rhai
// Organize templates logically
Directory("content/base/").render(context);           // Core structure
Directory("content/features/").render("src/", context); // Feature modules
Directory("content/config/").render("config/", context); // Configuration
Directory("content/scripts/").render("scripts/", context); // Build scripts
```

### Error Handling

```rhai
// Validate paths before rendering
let template_dirs = ["content/core/", "content/features/"];

for dir in template_dirs {
    if !directory_exists(dir) {
        print("Warning: Template directory not found: " + dir);
        continue;
    }

    try {
        Directory(dir).render(context);
    } catch (error) {
        print("Error rendering " + dir + ": " + error);
    }
}
```

### Performance Optimization

```rhai
// Batch related directory operations
let ui_context = context + #{ component_type: "ui" };
let api_context = context + #{ component_type: "api" };

// Render all UI components together
Directory("content/ui/").render("src/ui/", ui_context);

// Render all API components together
Directory("content/api/").render("src/api/", api_context);

// Avoid redundant context creation
let shared_context = context + #{
    timestamp: current_timestamp(),
    version: "1.0.0"
};

Directory("content/").render(shared_context);
```

### Template Path Management

```rhai
// Use consistent path conventions
let paths = #{
    content: "content/",
    output: "generated/",
    docs: "documentation/",
    tests: "test_output/"
};

Directory(paths.content + "src/").render(paths.output + "src/", context);
Directory(paths.content + "docs/").render(paths.docs, context);
Directory(paths.content + "tests/").render(paths.tests, context);
```

Directory rendering is the foundation of most archetype generation workflows, enabling you to process complete project structures while maintaining organization and applying consistent context across all generated files.

## Next Steps

- Learn [Component Rendering](../components/) for archetype composition
- Explore [String Rendering](../strings/) for inline template processing
- Check the Template documentation for advanced file template syntax
