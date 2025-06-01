---
sidebar_position: 3
---

# Set

The `set` function enables programmatic variable assignment with powerful case transformation capabilities, allowing you to prepare template variables efficiently and consistently.

## Function Signatures

```rhai
// Two-parameter version: Basic assignment
set(key: String, value: Dynamic) -> Map

// Three-parameter version: Assignment with settings
set(key: String, value: Dynamic, settings: Map) -> Map
```

:::note
The `set` function returns a Map that must be merged into context using the `+=` operator.
:::

## Value Type Support

Case transformations are applied based on value type:

- **String values**: Transformed according to case strategy
- **Array values**: Each element converted to string and transformed
- **Other types**: Returned unchanged (numbers, booleans, maps, etc.)

## Compound Names for Effective Casing

:::warning Important: Use Compound Names
When using case transformations, always use compound names (with multiple words) for keys and values. Single words like "user" or "entity" will produce identical results for some case styles, making the transformations ineffective.

```rhai
// ❌ Bad: Single words produce identical results for some cases
set("entity", "user", #{
    cased_as: CasedIdentityCasedValue([SnakeCase, KebabCase])
});
// Results: entity_snake_case = "user", entity_kebab_case = "user" (identical!)

// ✅ Good: Compound names show clear case differences  
set("entity-name", "user account", #{
    cased_as: CasedIdentityCasedValue([SnakeCase, KebabCase])
});
// Results: entity_name_snake_case = "user_account", entity_name_kebab_case = "user-account" (different!)
```
:::

## Basic Set Operations

### Simple Variable Assignment

```rhai
// Basic assignment
set("service_name", "user-service");

// Set multiple variables
set("app_name", "my-application");
set("version", "1.0.0");
set("author", "Development Team");
```

### Direct Context Integration

```rhai
// Set function returns a map that can be merged with context
context += set("database_type", "postgresql");

// Chain multiple assignments
context += set("app_port", 8080);
context += set("debug_mode", true);
```

## Set with Configuration

### Using Settings Map

```rhai
// Set with configuration options
context += set("entity-name", "user account", #{
    cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase, KebabCase]),
    allow_answer: true,
    answer_source: custom_answers
});
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `cased_as` | CaseStrategy | Case transformation strategy to apply (CasedIdentityCasedValue, etc.) |
| `allow_answer` | Bool | Enable answer file integration (default: false) |
| `answer_source` | Map/Unit | Custom answer source instead of default render context answers |

## Case Transformations

### Identity-Based Case Strategies

```rhai
// Creates multiple variables with pattern: {key}_{case}_case
context += set("service-name", "user management", #{
    cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase, KebabCase])
});
// Results: service_name_pascal_case = "UserManagement", service_name_snake_case = "user_management", service_name_kebab_case = "user-management"
```

### Key-Based Case Strategies

```rhai
// Creates variables with custom key patterns
context += set("entity-name", "user profile", #{
    cased_as: CasedKeyCasedValue("model-class", [PascalCase, SnakeCase])
});
// Results: model_class_pascal_case = "UserProfile", model_class_snake_case = "user_profile"
```

### Fixed Transformations

```rhai
// Single transformation keeping original key
context += set("class-name", "user service", #{
    cased_as: FixedIdentityCasedValue(PascalCase)
});
// Results: class_name = "UserService"

// Single transformation with custom key
context += set("entity-type", "user service", #{
    cased_as: FixedKeyCasedValue("module-name", SnakeCase)
});
// Results: module_name = "user_service"
```

### Predefined Case Sets

```rhai
// Use predefined case sets for programming
context += set("component-name", "user dashboard", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)
});
// Creates: component_name_camel_case = "userDashboard", component_name_constant_case = "USER_DASHBOARD", etc.

context += set("widget-type", "user dashboard", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES_ALL)
});
// Creates: widget_type_camel_case = "userDashboard", widget_type_cobol_case = "USER-DASHBOARD", etc.
```

## Advanced Set Patterns

### Dynamic Case Selection

```rhai
// Select case transformations based on project configuration
let project_type = context.project_type;

let case_strategy = switch project_type {
    "rust" => CasedIdentityCasedValue([SnakeCase, PascalCase, ConstantCase]),
    "javascript" => CasedIdentityCasedValue([CamelCase, PascalCase]),
    "python" => CasedIdentityCasedValue([SnakeCase, PascalCase]),
    "go" => CasedIdentityCasedValue([CamelCase, PascalCase]),
    _ => CasedIdentityCasedValue(PROGRAMMING_CASES)
};

context += set("entity-name", "user service", #{
    cased_as: case_strategy
});
```

### Batch Variable Assignment

```rhai
// Set multiple related variables efficiently
let entities = ["user account", "order item", "product catalog", "category tree"];

for entity in entities {
    let key = kebab_case(entity) + "-entity";
    context += set(key, entity, #{
        cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase])
    });
}

// Creates: user_account_entity_pascal_case = "UserAccount", user_account_entity_snake_case = "user_account", etc.
```

### Feature Flag Management

```rhai
// Enable feature flags with consistent naming
let features = ["user authentication", "role authorization", "audit logging", "performance metrics"];

for feature in features {
    let feature_key = kebab_case(feature) + "-feature";
    
    // Enable flag with casing
    context += set(feature_key, feature, #{
        cased_as: CasedIdentityCasedValue([SnakeCase, ConstantCase])
    });
}
// Creates: user_authentication_feature_snake_case = "user_authentication", user_authentication_feature_constant_case = "USER_AUTHENTICATION", etc.
```

### Conditional Variable Assignment

```rhai
// Set variables based on conditions
let database_required = context.features.contains("database");
let auth_required = context.features.contains("authentication");

if database_required {
    context += set("db-config", "database configuration", #{
        cased_as: CasedIdentityCasedValue([SnakeCase, PascalCase])
    });
    
    // Set database-specific variables
    context += set("migration-path", "migrations");
    context += set("schema-file", "schema.sql");
}

if auth_required {
    context += set("auth-config", "authentication setup", #{
        cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase])
    });
    
    // Require database if auth is enabled
    if !database_required {
        context += set("db-config", "auth database", #{
            cased_as: CasedIdentityCasedValue([SnakeCase, PascalCase])
        });
    }
}
```

### Hierarchical Variable Structure

```rhai
// Build complex nested configuration
context.services = [];

let service_types = ["user-service", "order-service", "payment-service"];

for i in range(0, service_types.len()) {
    let service_key = service_types[i];
    
    // Set base service variables with casing
    context += set(service_key, service_types[i], #{
        cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase, KebabCase])
    });
    
    // Set service-specific configuration
    context += set(service_key + "-port", 8000 + i);
    context += set(service_key + "-env", "development");
    
    // Add to services array for iteration in templates
    context.services.push(#{
        name: service_key,
        port: 8000 + i,
        env: "development"
    });
}
// Creates: user_service_pascal_case = "UserService", user_service_snake_case = "user_service", user_service_kebab_case = "user-service", etc.
```

## Answer Sources and Context Integration

### Answer File Integration

```rhai
// Allow values from answer files to override defaults
context += set("app_name", "default-app", #{
    allow_answer: true
});

// Will use value from answers.toml if present:
// [answers]
// app_name = "my-custom-app"
```

:::note Answer Key Lookup
When `allow_answer: true`, the set function looks for answers using the `key` parameter (first argument). Unlike prompts, set does not support custom `answer_key` mapping.
:::

### Custom Answer Sources

```rhai
// Use custom answer source instead of default
let custom_config = #{
    service_port: 9090,
    database_type: "mongodb",
    enable_auth: true
};

context += set("service_port", 8080, #{
    allow_answer: true,
    answer_source: custom_config
});
// Uses 9090 from custom_config instead of default 8080
```


## Set vs Simple Assignment

### When to Use Set Function

Use the `set` function when you need:

- **Multiple case variants**: Generate several case transformations automatically
- **Answer file integration**: Override values from answer files with `allow_answer`
- **Custom answer sources**: Use alternative answer sources instead of default context
- **Batch case generation**: Efficiently create multiple related variables

```rhai
// Good use cases for set function
context += set("entity-name", "user service", #{
    cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase, KebabCase])
});
// Creates: entity_name_pascal_case = "UserService", entity_name_snake_case = "user_service", entity_name_kebab_case = "user-service"

context += set("service-name", "default-service", #{
    allow_answer: true  // Can be overridden from answer files
});
```

### When to Use Simple Assignment

For basic variable assignment without complex casing or answer integration, use simple assignment with individual casing functions:

```rhai
// Simple assignment with individual case transformations
context.class_name = pascal_case("user service");      // "UserService"
context.table_name = snake_case("user service");       // "user_service"  
context.route_path = kebab_case("user service");       // "user-service"
context.constant_name = constant_case("user service"); // "USER_SERVICE"

// Multiple assignments from same source
let entity_name = "user service";
context.entity_class = pascal_case(entity_name);
context.entity_table = snake_case(entity_name);
context.entity_route = kebab_case(entity_name);
```

:::tip Simple Assignment Benefits
Simple assignment is more efficient when you only need a few specific case transformations and don't require answer file integration.
:::

## Set vs Prompting

### When to Use Set

- **Programmatic assignment**: Values determined by logic, not user input
- **Batch operations**: Setting multiple related variables efficiently  
- **Case transformations**: Need multiple case variants of the same value
- **Derived values**: Calculate values from other context variables
- **Feature flags**: Enable/disable features based on configuration

```rhai
// Good use cases for set
context += set("api_version", "v" + context.version);
context += set("service_class", context.service_name, #{
    cased_as: FixedIdentityCasedValue(PascalCase)
});
```

### When to Use Prompt

- **User interaction**: Need user input or decisions
- **Configuration choices**: User selects from options
- **Optional settings**: User can provide custom values
- **Validation required**: Need to validate user input

```rhai
// Good use cases for prompt
let service_name = prompt("Service name:");
let database_type = prompt("Database:", #{
    type: Select(["postgresql", "mysql", "sqlite"])
});
```

### Combining Set and Prompt

```rhai
// Get user input with prompt
let entity_name = prompt("Entity name:");

// Use set to create variations for templates
context += set("entity-name", entity_name, #{
    cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase, KebabCase])
});

// Set derived values with compound keys
context += set("table-name", entity_name, #{
    cased_as: FixedIdentityCasedValue(SnakeCase)
});
context += set("class-name", entity_name, #{
    cased_as: FixedIdentityCasedValue(PascalCase)
});
```

## Best Practices

### Naming Conventions

```rhai
// Use consistent naming patterns with compound keys
context += set("entity-name", "user account", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)
});

// Prefix related variables with compound names
context += set("user-entity", "user account", #{
    cased_as: CasedKeyCasedValue("database-table", [SnakeCase, PascalCase])
});
// Results: database_table_snake_case = "user_account", database_table_pascal_case = "UserAccount"
```

### Performance Considerations

```rhai
// Batch related assignments using compound names
let entity_vars = #{
    "user-name": "user account",
    "table-name": "user accounts", 
    "id-field": "user identifier"
};

// More efficient than individual set calls
for (key, value) in entity_vars {
    context += set(key, value, #{
        cased_as: CasedIdentityCasedValue([SnakeCase, PascalCase])
    });
}
```

### Template Preparation

```rhai
// Prepare all necessary variables for templates using compound entity name
let entity_name = "user account";

context += set("model-name", entity_name, #{
    cased_as: FixedIdentityCasedValue(PascalCase)
});

context += set("table-name", entity_name, #{
    cased_as: FixedIdentityCasedValue(SnakeCase)
});

context += set("route-path", entity_name, #{
    cased_as: FixedIdentityCasedValue(KebabCase)
});

// Now templates have: model_name = "UserAccount", table_name = "user_account", route_path = "user-account"
```

## Case Transformations Reference

For comprehensive case transformation capabilities, see the detailed documentation:

- **[Case Styles](../case-styles/)** - All available case transformation types and usage patterns
- **[Case Strategies](../casing-strategies/)** - Complete reference for casing strategy application
- **[Prompting Case Integration](../prompts/casing-strategies/)** - How prompting and set share casing capabilities

### Quick Reference

```rhai
// Most common case transformation patterns using compound key
context += set("entity-name", "user service", #{
    cased_as: CasedIdentityCasedValue([
        PascalCase,    // entity_name_pascal_case = "UserService"  
        SnakeCase,     // entity_name_snake_case = "user_service"
        KebabCase,     // entity_name_kebab_case = "user-service"
        CamelCase,     // entity_name_camel_case = "userService"
        ConstantCase   // entity_name_constant_case = "USER_SERVICE"
    ])
});
```

## Next Steps

- Learn about [Case Styles](../case-styles/) for comprehensive casing patterns
- Explore [Case Strategies](../casing-strategies/) for complete casing strategy reference
- Check [Prompts](../prompts/) for interactive input collection
- Review [Scripting Engine](../) for complete scripting reference