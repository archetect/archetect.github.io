---
sidebar_position: 3
---

# Casing

Archetect provides powerful case transformation capabilities that allow you to generate consistent naming conventions across different programming languages and contexts. This is essential for creating templates that follow language-specific conventions.

## Quick Reference

:::tip
For comprehensive details, see [Case Styles](../../../reference/scripting-engine/case-styles/) and [Case Strategies](../../../reference/scripting-engine/casing-strategies/) reference documentation.
:::

### Common Case Styles

| Style | Example | Use Case |
|-------|---------|----------|
| `CamelCase` | `userServiceName` | JavaScript variables, Java methods |
| `PascalCase` | `UserServiceName` | Class names, types |
| `SnakeCase` | `user_service_name` | Rust variables, Python functions |
| `KebabCase` | `user-service-name` | URLs, CSS classes, CLI flags |
| `ConstantCase` | `USER_SERVICE_NAME` | Constants, environment variables |

### Case Strategies Overview

| Strategy | Purpose |
|----------|---------|
| `CasedIdentityCasedValue` | Create multiple variants from original key |
| `CasedKeyCasedValue` | Create multiple variants with custom key |
| `FixedIdentityCasedValue` | Single transformation, keep original key |
| `FixedKeyCasedValue` | Single transformation, use custom key |

## Direct Case Functions

### Basic Transformations

```rhai
let input = "user service name";

// Direct transformations
let camel = camel_case(input);        // userServiceName
let pascal = pascal_case(input);      // UserServiceName
let snake = snake_case(input);        // user_service_name
let kebab = kebab_case(input);        // user-service-name
let constant = constant_case(input);  // USER_SERVICE_NAME
let title = title_case(input);        // User Service Name
```

### Pluralization and Ordinalization

```rhai
// Pluralization
let plural = pluralize("service");      // services
let singular = singularize("services"); // service

// Ordinalization  
let first = ordinalize(1);             // 1st
let second = ordinalize("2");          // 2nd
```

## Case Transformations in Prompts

### Simple Case Application

```rhai
// Automatic case conversion
context.services = prompt("Service names:", #{
    type: List,
    cased_as: KebabCase
});
```

### Set Function with Casing

```rhai
// Basic assignment with case conversion
set("service_name", "user service", #{
    cased_as: [PascalCase, SnakeCase, KebabCase]
});

// This creates multiple variables:
// service_name_pascal_case = "UserService"
// service_name_snake_case = "user_service"
// service_name_kebab_case = "user-service"
```

## Case Strategy Details

:::info
Case strategies determine how case transformations are applied to both variable names (keys) and their values during prompting and variable assignment.
:::

### CasedIdentityCasedValue

Applies case transformations to both the original key name and the value, creating multiple variables with the pattern `{key}_{case}_case`.

```rhai
context += prompt("Services:", "services", #{
    type: List,
    cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase])
});
// Creates variables:
// services = [...] (original)
// services_pascal_case = [...] (with PascalCase applied to values)
// services_snake_case = [...] (with SnakeCase applied to values)
```

**When to use**: When you need the same data in multiple case formats but want to keep the original variable name as the base.

### CasedKeyCasedValue

Applies case transformations using a custom key name instead of the original prompt key, creating variables with the pattern `{custom_key}_{case}_case`.

```rhai
context += prompt("Service name:", "service", #{
    cased_as: CasedKeyCasedValue("entity_name", [CamelCase, ConstantCase])
});
// Creates variables:
// entity_name_camel_case = "serviceName"
// entity_name_constant_case = "SERVICE_NAME"
// Note: No "service" variable is created
```

**When to use**: When you want to use a different variable naming scheme than the prompt key, or when generating semantic variable names.

### FixedIdentityCasedValue

Keeps the original key unchanged but applies a single case transformation to the value only.

```rhai
context += prompt("Component name:", "component", #{
    cased_as: FixedIdentityCasedValue(PascalCase)
});
// Creates variables:
// component = "ComponentName" (original key with cased value)
```

**When to use**: When you only need one case transformation and want to keep the original variable name simple.

### FixedKeyCasedValue

Uses a fixed custom key name with a single case transformation applied to the value.

```rhai
context += prompt("API name:", "api", #{
    cased_as: FixedKeyCasedValue("endpoint_name", KebabCase)
});
// Creates variables:
// endpoint_name = "api-name" (fixed key with cased value)
```

**When to use**: When you need a specific variable name with a specific case transformation, typically for targeted template usage.

### Complex Case Strategies

```rhai
// Multiple case strategies for comprehensive naming
context += prompt("Service info:", "service", #{
    type: Text,
    cased_as: [
        CasedKeyCasedValue("class_name", [PascalCase]),
        CasedKeyCasedValue("file_name", [SnakeCase]),
        FixedKeyCasedValue("constant_name", ConstantCase)
    ]
});
```

## Practical Examples

### Rust Project Naming

```rhai
let project_name = prompt("Project name:");

// Generate all Rust-appropriate cases
context.project_name = project_name;
context.project_snake = snake_case(project_name);     // For crate names
context.project_pascal = pascal_case(project_name);   // For struct names
context.project_kebab = kebab_case(project_name);     // For CLI commands
context.project_constant = constant_case(project_name); // For constants
```

### Multi-Language Service Generation

```rhai
let service_name = prompt("Service name:");

// Language-specific naming
context.rust_name = snake_case(service_name);         // user_service
context.rust_struct = pascal_case(service_name);      // UserService
context.rust_const = constant_case(service_name);     // USER_SERVICE

context.js_name = camel_case(service_name);           // userService
context.js_class = pascal_case(service_name);         // UserService
context.js_file = kebab_case(service_name);           // user-service

context.python_name = snake_case(service_name);       // user_service
context.python_class = pascal_case(service_name);     // UserService
context.python_const = constant_case(service_name);   // USER_SERVICE
```

### File and Directory Generation

```rhai
let component_name = prompt("Component name:");

// File naming patterns
context.component_file = snake_case(component_name) + ".rs";
context.component_test = snake_case(component_name) + "_test.rs";
context.component_mod = snake_case(component_name);

// Directory structure
context.component_dir = kebab_case(component_name);
context.package_name = package_case(component_name);  // com.example.component
```

### Template Integration

Use cased variables in your templates:

```jinja
// src/{{ component_file }}
pub struct {{ component_pascal }} {
    // fields
}

impl {{ component_pascal }} {
    pub fn new() -> Self {
        Self {}
    }
}

#[cfg(test)]
mod {{ component_snake }}_tests {
    use super::*;
    
    #[test]
    fn test_{{ component_snake }}_creation() {
        let {{ component_snake }} = {{ component_pascal }}::new();
        // test implementation
    }
}
```

## Best Practices

### Consistent Naming Patterns

```rhai
// Establish naming patterns early
let base_name = prompt("Service name:");

// Create a comprehensive naming context
context.names = #{
    // Original
    original: base_name,
    
    // Common patterns
    snake: snake_case(base_name),
    pascal: pascal_case(base_name),
    camel: camel_case(base_name),
    kebab: kebab_case(base_name),
    constant: constant_case(base_name),
    
    // Specialized
    filename: snake_case(base_name) + "_service",
    classname: pascal_case(base_name) + "Service",
    module: snake_case(base_name),
    package: package_case(base_name)
};
```

### Language-Aware Casing

```rhai
let language = prompt("Programming language:", #{
    type: Select(["rust", "javascript", "python", "java", "go"])
});

let entity_name = prompt("Entity name:");

// Apply language-appropriate casing
context.entity_name = entity_name;

switch language {
    "rust" => {
        context.struct_name = pascal_case(entity_name);
        context.field_name = snake_case(entity_name);
        context.const_name = constant_case(entity_name);
    },
    "javascript" => {
        context.class_name = pascal_case(entity_name);
        context.variable_name = camel_case(entity_name);
        context.file_name = kebab_case(entity_name);
    },
    "python" => {
        context.class_name = pascal_case(entity_name);
        context.function_name = snake_case(entity_name);
        context.constant_name = constant_case(entity_name);
    },
    "java" => {
        context.class_name = pascal_case(entity_name);
        context.method_name = camel_case(entity_name);
        context.constant_name = constant_case(entity_name);
    }
}
```

### Avoiding Case Conflicts

```rhai
// Check for potential conflicts
let name = prompt("Name:");
let snake_name = snake_case(name);
let kebab_name = kebab_case(name);

// Ensure uniqueness when needed
if snake_name == kebab_name {
    print("Warning: Snake and kebab cases are identical");
    // Handle accordingly
}

// Use prefixes/suffixes to avoid conflicts
context.db_table = snake_case(name) + "_table";
context.api_endpoint = kebab_case(name) + "-endpoint";
```

## Advanced Patterns

### Dynamic Case Selection

```rhai
// Select casing based on context
let output_format = prompt("Output format:", #{
    type: Select(["rust", "json", "yaml", "env"])
});

let key_name = prompt("Key name:");

let final_key = switch output_format {
    "rust" => snake_case(key_name),
    "json" => camel_case(key_name),
    "yaml" => kebab_case(key_name),
    "env" => constant_case(key_name),
    _ => key_name
};

context.key = final_key;
```

### Batch Case Processing

```rhai
// Process multiple names at once
let entity_names = prompt("Entity names:", #{
    type: List
});

context.entities = [];

for name in entity_names {
    let entity = #{
        original: name,
        snake: snake_case(name),
        pascal: pascal_case(name),
        kebab: kebab_case(name),
        plural_snake: snake_case(pluralize(name)),
        plural_pascal: pascal_case(pluralize(name))
    };
    
    context.entities.push(entity);
}
```

## Reference Documentation

For detailed information on case transformations:

- **[Case Styles](../../../reference/scripting-engine/case-styles/)** - Complete reference of all 14 case transformation types
- **[Case Strategies](../../../reference/scripting-engine/casing-strategies/)** - Detailed guide to applying multiple transformations in prompts and set functions

## Next Steps

- Explore [Prompting](../prompting/) for gathering user input with case transformations
- Learn [Rhai Basics](../rhai-basics/) for core language features
- Check template documentation for using cased variables in Jinja templates