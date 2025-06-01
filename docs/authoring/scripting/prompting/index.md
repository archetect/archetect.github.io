---
sidebar_position: 2
---

# Prompting

The `prompt` function is the core of interactive archetype generation, enabling you to gather user input in various formats with validation and smart defaults.

## Basic Prompting

### Simple Text Input

```rhai
// Simple text input
let name = prompt("Project name:");

// Store in context
context.service_name = prompt("Service name:");
```

### Prompt with Configuration

```rhai
context.service_suffix = prompt("Service Suffix:", #{
    defaults_with: "Service",        // Default value
    min: 2,                         // Minimum length
    max: 50,                        // Maximum length
    placeholder: "Enter suffix",    // Placeholder text
    help: "Suffix for service class names",
    optional: false,                // Required field
    answer_key: "service_suffix"    // Key for answer lookup
});
```

## Prompt Types

### Integer Input

```rhai
context.port = prompt("Server port:", #{
    type: Int,
    defaults_with: 8080,
    min: 1024,
    max: 65535,
    help: "Port number between 1024-65535"
});

// Dynamic defaults based on other values
context.management_port = prompt("Management port:", #{
    type: Int,
    defaults_with: context.port + 1000,
    min: 1024,
    max: 65535
});
```

### Boolean Input

```rhai
context.enable_https = prompt("Enable HTTPS?", #{
    type: Bool,                     // or Confirm
    defaults_with: true
});
```

### List Input

```rhai
context.features = prompt("Features to include:", #{
    type: List,
    help: "Enter features one by one, empty to finish"
});
```

### Selection Input

```rhai
context.database = prompt("Database type:", #{
    type: Select([
        "postgresql",
        "mysql", 
        "sqlite",
        "mongodb"
    ]),
    defaults_with: "postgresql"
});
```

### MultiSelect Input

```rhai
context.languages = prompt("Programming languages:", #{
    type: MultiSelect([
        "Rust",
        "JavaScript", 
        "Python",
        "Go",
        "Java"
    ]),
    defaults_with: ["Rust", "JavaScript"]
});
```

### Editor Input

```rhai
context.description = prompt("Detailed description:", #{
    type: Editor,
    defaults_with: "# Project Description\n\nDescribe your project here...",
    help: "Opens your default editor for multi-line input"
});
```

## Advanced Prompting Patterns

### Conditional Prompting Logic

```rhai
// Progressive prompting based on choices
let project_type = prompt("Project type:", #{
    type: Select(["web", "cli", "library", "service"])
});

context.project_type = project_type;

// Type-specific prompts
if project_type == "web" {
    context.framework = prompt("Web framework:", #{
        type: Select(["react", "vue", "angular", "svelte"])
    });
    
    context.styling = prompt("Styling approach:", #{
        type: Select(["css", "scss", "styled-components", "tailwind"])
    });
    
} else if project_type == "cli" {
    context.cli_framework = prompt("CLI framework:", #{
        type: Select(["clap", "structopt", "argh"])
    });
    
    context.subcommands = prompt("Include subcommands?", #{
        type: Bool,
        defaults_with: true
    });
    
} else if project_type == "service" {
    context.api_type = prompt("API type:", #{
        type: Select(["rest", "graphql", "grpc"])
    });
    
    context.database_required = prompt("Requires database?", #{
        type: Bool
    });
    
    if context.database_required {
        context.database_type = prompt("Database type:", #{
            type: Select(["postgresql", "mysql", "mongodb", "sqlite"])
        });
    }
}
```

### Feature Flag Management

```rhai
// Collect features
let available_features = [
    "authentication",
    "authorization", 
    "logging",
    "metrics",
    "health-checks",
    "database",
    "caching",
    "rate-limiting"
];

context.features = prompt("Select features:", #{
    type: MultiSelect(available_features),
    help: "Choose features to include in your service"
});

// Process feature dependencies
let selected_features = context.features;

// Auto-include dependencies
if "authentication" in selected_features && !("database" in selected_features) {
    print("Authentication requires database - adding database feature");
    selected_features.push("database");
}

if "metrics" in selected_features && !("health-checks" in selected_features) {
    print("Metrics includes health checks - adding health-checks feature");
    selected_features.push("health-checks");
}

context.features = selected_features;

// Set feature flags for templates
for feature in selected_features {
    context["enable_" + snake_case(feature)] = true;
}
```

### Data Validation

```rhai
// Input validation
let validate_port = |port| {
    if port < 1024 {
        throw "Port must be >= 1024";
    }
    if port > 65535 {
        throw "Port must be <= 65535";
    }
    return true;
};

// Validation in prompts
context.port = prompt("Server port:", #{
    type: Int,
    min: 1024,
    max: 65535,
    help: "Valid port range: 1024-65535"
});

// Manual validation
try {
    validate_port(context.port);
    print("Port validation passed");
} catch (error) {
    print("Port validation failed: " + error);
    // Could re-prompt or use default
    context.port = 8080;
}
```

### Complex Data Structures

```rhai
// Build complex configuration
context.services = [];

let add_more = true;
while add_more {
    let service = #{};
    
    service.name = prompt("Service name:");
    service.port = prompt("Service port:", #{
        type: Int,
        defaults_with: 8000 + context.services.len()
    });
    
    service.database = prompt("Requires database?", #{
        type: Bool
    });
    
    if service.database {
        service.database_type = prompt("Database type:", #{
            type: Select(["postgresql", "mysql", "mongodb"])
        });
    }
    
    context.services.push(service);
    
    add_more = prompt("Add another service?", #{
        type: Bool,
        defaults_with: false
    });
}

// Process services for template variables
context.service_count = context.services.len();
context.total_ports = context.services.len();
context.requires_database = false;

for service in context.services {
    if service.database {
        context.requires_database = true;
        break;
    }
}
```

## Answer Sources and Pre-filled Data

### Custom Answer Sources

```rhai
// Custom answer source
let alternate_answers = #{
    service_port: 9090,
    database_type: "mongodb",
    enable_auth: true
};

// Use alternate answers
context.port = prompt("Service port:", #{
    type: Int,
    answer_key: "service_port",
    answer_source: alternate_answers
});

// Check for answers in render context
context.debug_enabled = prompt("Enable debug mode?", #{
    type: Bool,
    answer_key: "debug_mode",      // Looks in current answers
    defaults_with: false
});
```

## Best Practices

### Progressive Disclosure

Start with essential questions and progressively ask for more detailed configuration:

```rhai
// Essential questions first
context.project_name = prompt("Project name:");
context.project_type = prompt("Project type:", #{
    type: Select(["web", "api", "cli"])
});

// Then type-specific details
// ... conditional prompts based on project_type

// Finally, optional advanced configuration
let configure_advanced = prompt("Configure advanced options?", #{
    type: Bool,
    defaults_with: false
});

if configure_advanced {
    // Advanced configuration prompts
}
```

### Helpful Defaults and Context

```rhai
// Use contextual defaults
context.app_port = prompt("Application port:", #{
    type: Int,
    defaults_with: switch context.app_type {
        "web" => 3000,
        "api" => 8080,
        "development" => 3000,
        _ => 8000
    }
});
```

### Clear Help Text

```rhai
context.database_url = prompt("Database URL:", #{
    help: "Connection string like postgresql://user:pass@host:5432/dbname",
    placeholder: "postgresql://localhost:5432/myapp"
});
```

## Case Transformations in Prompts

For comprehensive case transformation capabilities, see the reference documentation:

- **[Case Styles](../../../reference/scripting-engine/case-styles/)** - All available case transformation types (CamelCase, SnakeCase, etc.)
- **[Case Strategies](../../../reference/scripting-engine/casing-strategies/)** - How to apply multiple case transformations in prompts and set functions
- **[Prompts/Casing Strategies](../../../reference/scripting-engine/prompts/casing-strategies/)** - Prompt-specific casing usage

### Quick Example

```rhai
// Apply case transformations to prompt input
context += prompt("Service name:", "service", #{
    cased_as: CasedKeyCasedValue("entity", [PascalCase, SnakeCase, KebabCase])
});

// Creates: entity_pascal_case, entity_snake_case, entity_kebab_case
```

## Next Steps

- Learn about [Case Styles](../../../reference/scripting-engine/case-styles/) for available transformation options
- Explore [Case Strategies](../../../reference/scripting-engine/casing-strategies/) for applying multiple transformations
- Check [Casing](../casing/) for comprehensive examples and patterns
- Explore [Rhai Basics](../rhai-basics/) for language fundamentals