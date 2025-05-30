---
sidebar_position: 3
---

# Casing

Archetect provides powerful case transformation capabilities that allow you to generate consistent naming conventions across different programming languages and contexts. This is essential for creating templates that follow language-specific conventions.

## Available Case Constants

```rhai
// Case style constants
CamelCase        // userServiceName
PascalCase       // UserServiceName  
SnakeCase        // user_service_name
KebabCase        // user-service-name
ConstantCase     // USER_SERVICE_NAME
TitleCase        // User Service Name
SentenceCase     // User service name
TrainCase        // User-Service-Name
DirectoryCase    // user/service/name
PackageCase      // user.service.name
ClassCase        // UserServiceName (alias for PascalCase)
CobolCase        // USER-SERVICE-NAME
LowerCase        // user service name
UpperCase        // USER SERVICE NAME
```

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

## Advanced Case Strategies

### CasedIdentityCasedValue

Apply cases to both the key name and value:

```rhai
context += prompt("Services:", "services", #{
    type: List,
    cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase])
});
// Result: 
// services: [...] (original)
// Services: [...] (PascalCase key)
// services: [...] (SnakeCase key, same as original)
```

### CasedKeyCasedValue

Apply cases to a custom key:

```rhai
context += prompt("Service name:", "service", #{
    cased_as: CasedKeyCasedValue("service_name", [CamelCase, ConstantCase])
});
// Result:
// service_name_camel_case = "serviceName"
// service_name_constant_case = "SERVICE_NAME"
```

### FixedKeyCasedValue

Fixed key with cased value:

```rhai
context += prompt("API name:", "api", #{
    cased_as: FixedKeyCasedValue("api_endpoint", KebabCase)
});
// Result:
// api_endpoint = "api-name" (in kebab-case)
```

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

## Next Steps

- Explore [Prompting](../prompting/) for gathering user input
- Learn [Rhai Basics](../rhai-basics/) for core language features
- Check the template documentation for using cased variables in Jinja templates