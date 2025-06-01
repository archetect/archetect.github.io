---
sidebar_position: 3
---

# Casing Strategies

Casing strategies control how case transformations are applied to variable names and values in both `prompt` and `set` functions. They determine what variables are created and how the naming patterns are structured.

:::tip Alternative Setting Names
The casing setting supports multiple names that work identically in both Set and Prompt functions:
- `cased_as` (primary/recommended)
- `cased_with` (alternative)
- `casing` (alternative) 
- `cases` (alternative)

Use any of these names in your settings map - they all reference the same underlying functionality.
:::

## Quick Reference

| Strategy | Purpose | Variable Pattern | Supported In |
|----------|---------|------------------|--------------|
| `CasedIdentityCasedValue` | Apply cases to original key and value | `{key}_{case}_case` | `prompt` (cased map), `set` |
| `CasedKeyCasedValue` | Apply cases to custom key and value | `{custom_key}_{case}_case` | `prompt` (cased map), `set` |
| `FixedIdentityCasedValue` | Keep original key, case value only | `{key}` | `prompt` (cased map), `set` |
| `FixedKeyCasedValue` | Fixed custom key, case value only | `{custom_key}` | `prompt` (cased map), `set` |
| Individual Case Styles | Apply single case transformation | Returned value | `prompt` (single value), `set` |

## Strategy Behavior

:::info Casing Support by Function Type
**Single Value Prompts**: Support individual case styles only (e.g., `PascalCase`, `SnakeCase`) applied directly to the returned value.

**Cased Map Prompts**: Support complex casing strategies that generate multiple key-value pairs with different case transformations.

**Set Function**: Support both individual case styles and complex casing strategies for flexible variable assignment.
:::

## Individual Case Styles

Individual case styles apply a single case transformation and are supported by both single value prompts and set functions.

### Usage in Single Value Prompts

```rhai
// Single value prompt with individual case style
let service_name = prompt("Service name:", #{
    cased_as: PascalCase
});
// Returns: "UserService" (if user entered "user service")

let table_name = prompt("Table name:", #{
    cased_as: SnakeCase  
});
// Returns: "user_account" (if user entered "User Account")
```

### Usage in Set Function

```rhai
// Set function with individual case style
context += set("class-name", "user service", #{
    cased_as: PascalCase
});
// Creates: class_name = "UserService"

context += set("route-path", "user service", #{
    cased_as: KebabCase
});
// Creates: route_path = "user-service"
```

### Available Individual Case Styles

- `CamelCase` - `userService`
- `PascalCase` - `UserService`  
- `SnakeCase` - `user_service`
- `KebabCase` - `user-service`
- `ConstantCase` - `USER_SERVICE`
- `TitleCase` - `User Service`
- `SentenceCase` - `User service`
- `LowerCase` - `user service`
- `UpperCase` - `USER SERVICE`

:::note Single Value Limitation
Single value prompts cannot use complex strategies like `CasedIdentityCasedValue(PROGRAMMING_CASES)`. They only support individual case styles.
:::

## Complex Casing Strategies

Complex casing strategies generate multiple variables with different case transformations. These are supported by cased map prompts and set functions only.

### CasedIdentityCasedValue

Applies case transformations to both the original key name and the value, creating multiple variables with the pattern `{original_key}_{case}_case`.

```rhai
// In prompt (cased map)
context += prompt("Services:", "services", #{
    type: List,
    cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase, KebabCase])
});
// Creates:
// services = ["user auth", "data sync"] (original)
// services_pascal_case = ["UserAuth", "DataSync"]
// services_snake_case = ["user_auth", "data_sync"]  
// services_kebab_case = ["user-auth", "data-sync"]

// In set function
set("service_name", "user service", #{
    cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase])
});
// Creates:
// service_name_pascal_case = "UserService"
// service_name_snake_case = "user_service"
```

**Aliases**: 
- `CasedIdentityAndValue`
- `CasedIdentity` (deprecated)

**When to use**:
- Need multiple case formats of the same data
- Templates require different case conventions
- Want to preserve original variable naming

### CasedKeyCasedValue

Applies case transformations using a custom key name instead of the original key, creating variables with the pattern `{custom_key}_{case}_case`.

```rhai
// In prompt (cased map only)
context += prompt("Service name:", "service", #{
    cased_as: CasedKeyCasedValue("entity_name", [CamelCase, ConstantCase, PascalCase])
});
// Creates:
// entity_name_camel_case = "serviceName"
// entity_name_constant_case = "SERVICE_NAME"
// entity_name_pascal_case = "ServiceName"
// Note: No "service" variable is created

// In set function
set("temp", "user service", #{
    cased_as: CasedKeyCasedValue("component_name", [PascalCase, SnakeCase])
});
// Creates:
// component_name_pascal_case = "UserService"
// component_name_snake_case = "user_service"
```

**Aliases**:
- `CasedKeyAndValue`
- `CasedKeys` (deprecated)

**When to use**:
- Want semantic variable names different from the prompt
- Creating domain-specific naming conventions
- Need custom key patterns for template integration

### FixedIdentityCasedValue

Keeps the original key unchanged but applies a single case transformation to the value.

```rhai
// In prompt (single value or cased map)
context.component = prompt("Component name:", #{
    cased_as: FixedIdentityCasedValue(PascalCase)
});
// Creates:
// component = "ComponentName" (original key with transformed value)

// In set function
set("service_class", "user service", #{
    cased_as: FixedIdentityCasedValue(PascalCase)
});
// Creates:
// service_class = "UserService"
```

**Aliases**:
- `CasedValue`
- `FixedIdentity` (deprecated)

**When to use**:
- Only need one case transformation
- Want to keep variable names simple
- Original key name is already appropriate

### FixedKeyCasedValue

Uses a fixed custom key name with a single case transformation applied to the value.

```rhai
// In prompt (cased map only)
context += prompt("API name:", "api", #{
    cased_as: FixedKeyCasedValue("endpoint_name", KebabCase)
});
// Creates:
// endpoint_name = "api-name" (fixed key with transformed value)

// In set function
set("temp", "user service", #{
    cased_as: FixedKeyCasedValue("class_name", PascalCase)
});
// Creates:
// class_name = "UserService"
```

**Aliases**:
- `FixedKey` (deprecated)

**When to use**:
- Need specific variable name with specific casing
- Targeted template integration
- Creating focused, single-purpose variables

## Usage in Different Contexts

### Single Value Prompts

Single value prompts apply casing to the returned value and require manual assignment:

```rhai
// Only FixedIdentityCasedValue and individual case styles supported
context.service_name = prompt("Service Name:", #{
    cased_as: FixedIdentityCasedValue(PascalCase)
});
// Result: context.service_name = "ServiceName"

// Direct case style application
context.class_name = prompt("Class Name:", #{
    cased_as: PascalCase
});
// Result: context.class_name = "ClassName"
```

### Cased Map Prompts

Cased map prompts generate multiple key-value pairs automatically:

```rhai
// All strategies supported
context += prompt("Service Name:", "service_name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)
});
// Generates: service_name, serviceName, ServiceName, SERVICE_NAME, service-name

// Multiple strategies can be combined
context += prompt("Project Name:", "project_name", #{
    cased_as: [
        CasedIdentityCasedValue(PROGRAMMING_CASES),
        FixedKeyCasedValue("project_title", TitleCase)
    ]
});
```

### Set Function

The `set` function supports all casing strategies:

```rhai
// CasedIdentityCasedValue
set("service_name", "user service", #{
    cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase, KebabCase])
});

// CasedKeyCasedValue  
set("input", "user service", #{
    cased_as: CasedKeyCasedValue("entity", [PascalCase, SnakeCase])
});

// FixedIdentityCasedValue
set("component_name", "user service", #{
    cased_as: FixedIdentityCasedValue(PascalCase)
});

// FixedKeyCasedValue
set("temp", "user service", #{
    cased_as: FixedKeyCasedValue("final_name", PascalCase)
});
```

## Practical Examples

### Multi-Language Code Generation

```rhai
// Generate comprehensive naming for different languages
context += prompt("Service name:", "service", #{
    cased_as: [
        // Generate standard programming cases
        CasedIdentityCasedValue(PROGRAMMING_CASES),
        
        // Create language-specific variations
        CasedKeyCasedValue("rust_names", [SnakeCase, PascalCase, ConstantCase]),
        CasedKeyCasedValue("js_names", [CamelCase, PascalCase]),
        CasedKeyCasedValue("java_names", [CamelCase, PascalCase]),
        
        // Create specialized names
        FixedKeyCasedValue("file_name", KebabCase),
        FixedKeyCasedValue("display_name", TitleCase),
        FixedKeyCasedValue("env_prefix", ConstantCase)
    ]
});

// Results in variables like:
// service, serviceName, ServiceName, SERVICE_NAME, service-name (standard)
// rust_names_snake_case, rust_names_pascal_case, rust_names_constant_case
// js_names_camel_case, js_names_pascal_case
// java_names_camel_case, java_names_pascal_case
// file_name, display_name, env_prefix
```

### Complex Configuration Generation

```rhai
// Build comprehensive service configuration
context += prompt("Service name:", "service", #{
    cased_as: [
        // Programming identifiers
        CasedKeyCasedValue("class_names", [PascalCase]),
        CasedKeyCasedValue("var_names", [CamelCase, SnakeCase]),
        CasedKeyCasedValue("constants", [ConstantCase]),
        
        // File and directory names
        FixedKeyCasedValue("service_dir", KebabCase),
        FixedKeyCasedValue("config_file", SnakeCase),
        
        // API and network identifiers
        FixedKeyCasedValue("api_path", KebabCase),
        FixedKeyCasedValue("env_prefix", ConstantCase),
        
        // Human-readable names
        FixedKeyCasedValue("service_title", TitleCase)
    ]
});

// Use in templates:
// Class: {{ class_names_pascal_case }}
// Variable: {{ var_names_camel_case }}
// Constant: {{ constants_constant_case }}
// Directory: {{ service_dir }}/
// Config: {{ config_file }}.yaml
// API: /api/{{ api_path }}
// Env: {{ env_prefix }}_PORT
// Title: {{ service_title }}
```

### Dynamic Strategy Selection

```rhai
// Choose strategy based on project type
let project_type = prompt("Project type:", #{
    type: Select(["library", "application", "service"])
});

let strategy = switch project_type {
    "library" => [
        CasedKeyCasedValue("lib_component", [PascalCase, SnakeCase]),
        FixedKeyCasedValue("crate_name", KebabCase)
    ],
    "application" => [
        CasedKeyCasedValue("app_component", [CamelCase, KebabCase]),
        FixedKeyCasedValue("executable_name", KebabCase)
    ],
    "service" => [
        CasedKeyCasedValue("svc_component", [SnakeCase, ConstantCase, KebabCase]),
        FixedKeyCasedValue("service_name", KebabCase),
        FixedKeyCasedValue("api_prefix", KebabCase)
    ],
    _ => CasedIdentityCasedValue(PROGRAMMING_CASES)
};

context += prompt("Component name:", "component", #{
    cased_as: strategy
});
```

### Feature Flag Management

```rhai
// Generate feature flags with comprehensive naming
let features = prompt("Features to enable:", #{
    type: MultiSelect([
        "authentication",
        "authorization", 
        "database integration",
        "caching layer",
        "monitoring"
    ]),
    cased_as: [
        CasedIdentityCasedValue([SnakeCase, PascalCase, ConstantCase]),
        CasedKeyCasedValue("feature_flags", [SnakeCase]),
        CasedKeyCasedValue("feature_classes", [PascalCase]),
        CasedKeyCasedValue("feature_constants", [ConstantCase])
    ]
});

// Process for different contexts
for feature in features.feature_flags_snake_case {
    set("enable_" + feature, true);  // enable_authentication = true
}

for feature in features.feature_constants_constant_case {
    set(feature + "_ENABLED", true);  // AUTHENTICATION_ENABLED = true
}
```

## Advanced Patterns

### Combining Multiple Strategies

```rhai
// Apply multiple strategies to the same input for comprehensive coverage
context += prompt("Entity name:", "entity", #{
    cased_as: [
        // Keep original with multiple cases
        CasedIdentityCasedValue(PROGRAMMING_CASES),
        
        // Create specialized names for different contexts
        CasedKeyCasedValue("api_names", [KebabCase, PascalCase]),
        CasedKeyCasedValue("db_names", [SnakeCase, ConstantCase]),
        CasedKeyCasedValue("ui_names", [CamelCase, PascalCase]),
        
        // Single-purpose names
        FixedKeyCasedValue("docker_name", KebabCase),
        FixedKeyCasedValue("env_prefix", ConstantCase),
        FixedKeyCasedValue("display_title", TitleCase)
    ]
});
```

### Conditional Casing

```rhai
// Apply different strategies based on enabled features
let case_strategy = if switch_enabled("java") {
    [
        CasedKeyCasedValue("java_names", [CamelCase, PascalCase]),
        FixedKeyCasedValue("package_name", PackageCase)
    ]
} else if switch_enabled("rust") {
    [
        CasedKeyCasedValue("rust_names", [SnakeCase, PascalCase, ConstantCase]),
        FixedKeyCasedValue("crate_name", KebabCase)
    ]
} else {
    CasedIdentityCasedValue(PROGRAMMING_CASES)
};

context += prompt("Component name:", "component", #{
    cased_as: case_strategy
});
```

### Strategy Validation

```rhai
// Validate that required variables were created
let required_vars = [
    "service_pascal_case",
    "service_snake_case", 
    "api_names_kebab_case",
    "docker_name"
];

for var_name in required_vars {
    if !(var_name in context) {
        throw "Required variable not created: " + var_name;
    }
}
```

## Best Practices

### Choose the Right Strategy

```rhai
// For simple transformations - use FixedIdentityCasedValue
context.class_name = prompt("Class name:", #{
    cased_as: FixedIdentityCasedValue(PascalCase)
});

// For multiple related formats - use CasedIdentityCasedValue
context += prompt("Entity name:", "entity", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)
});

// For semantic naming - use CasedKeyCasedValue
context += prompt("Service name:", "service", #{
    cased_as: CasedKeyCasedValue("component", [PascalCase, SnakeCase])
});

// For targeted variables - use FixedKeyCasedValue
context += prompt("Configuration:", "config", #{
    cased_as: FixedKeyCasedValue("app_config", SnakeCase)
});
```

### Use Collections Effectively

```rhai
// Standard programming scenarios
cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)

// All programming cases including specialized
cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES_ALL)

// Custom selection for specific needs
cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase, ConstantCase])
```

### Consistent Naming Patterns

```rhai
// Establish consistent patterns across prompts
let entity_strategy = CasedKeyCasedValue("entity", PROGRAMMING_CASES);
let config_strategy = CasedKeyCasedValue("config", [SnakeCase, ConstantCase]);

context += prompt("User entity:", "user", #{
    cased_as: entity_strategy
});

context += prompt("Product entity:", "product", #{
    cased_as: entity_strategy  
});

context += prompt("Database config:", "db", #{
    cased_as: config_strategy
});
```

## Template Integration

Use the generated variables in templates:

```jinja
{# Rust template: src/{{ file_name }}.rs #}
pub struct {{ rust_names_pascal_case }} {
    {{ rust_names_snake_case }}_data: String,
}

impl {{ rust_names_pascal_case }} {
    pub const {{ rust_names_constant_case }}_VERSION: &str = "1.0.0";
    
    pub fn new_{{ rust_names_snake_case }}() -> Self {
        Self {
            {{ rust_names_snake_case }}_data: String::new(),
        }
    }
}

{# JavaScript template: {{ file_name }}.js #}
class {{ js_names_pascal_case }} {
    constructor() {
        this.{{ js_names_camel_case }}Data = null;
    }
    
    get{{ js_names_pascal_case }}Data() {
        return this.{{ js_names_camel_case }}Data;
    }
}

{# Configuration template: {{ file_name }}.yaml #}
service:
  name: "{{ display_name }}"
  class: "{{ rust_names_pascal_case }}"
  endpoint: "/{{ api_names_kebab_case }}"
environment:
  {{ env_prefix }}_ENABLED: true
  {{ env_prefix }}_PORT: 8080
```

## See Also

- **[Case Styles](../case-styles/)** - Available case transformation types
- **[Prompts/Casing Strategies](../prompts/casing-strategies/)** - Using strategies in prompt functions
- **Set Function** - Applying case transformations to variables (coming soon)
- **[Templating Fundamentals](../../../authoring/templating/fundamentals/)** - Using cased variables in templates