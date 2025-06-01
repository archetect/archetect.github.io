---
sidebar_position: 5
---

# Casing Strategies in Prompts

Casing strategies define how Archetect transforms user input into different case formats for use in templates within prompt functions specifically.

:::tip Complete Reference
For comprehensive casing strategy documentation including usage with `set` functions and advanced patterns, see [Casing Strategies](../../casing-strategies/).
:::

:::tip Alternative Setting Names
The casing setting supports multiple names that work identically: `cased_as`, `cased_with`, `casing`, or `cases`. All prompt functions accept any of these names.
:::

## Overview

Archetect provides powerful casing capabilities through the `cased_as` setting in prompt functions. The behavior differs between prompt families:

- **[Single Value Prompts](../single-value)**: Transform the returned value directly
- **[Cased Map Prompts](../cased-map)**: Generate multiple key-value pairs with different case formats

## Case Formats

### Available Case Styles

| Case Style     | Description                                          | Example           | Common Usage                     |
| -------------- | ---------------------------------------------------- | ----------------- | -------------------------------- |
| `CamelCase`    | First letter lowercase, subsequent words capitalized | `exampleService`  | Java variables, JavaScript       |
| `PascalCase`   | All words capitalized                                | `ExampleService`  | Java classes, C# types           |
| `SnakeCase`    | Lowercase with underscores                           | `example_service` | Rust, Python variables           |
| `KebabCase`    | Lowercase with hyphens                               | `example-service` | URLs, CSS classes, config files  |
| `ConstantCase` | Uppercase with underscores                           | `EXAMPLE_SERVICE` | Constants, environment variables |
| `TitleCase`    | Proper case with spaces                              | `Example Service` | Human-readable text              |

### PROGRAMMING_CASES Constant

The `PROGRAMMING_CASES` constant includes the most commonly used case formats for programming, excluding cases that cannot be used as template variable keys:

**Included in PROGRAMMING_CASES:**

- `CamelCase`
- `PascalCase`
- `SnakeCase`
- `KebabCase`
- `ConstantCase`

**Excluded from PROGRAMMING_CASES:**

- `TitleCase` (contains spaces, cannot be template variable key)

```rhai
// Use PROGRAMMING_CASES for automatic multi-case generation
cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)
```

## Casing Strategy Types

### CasedIdentityCasedValue

Applies case transformations to the identity key (the key parameter in cased map prompts, or the variable name).

#### Single Case Application

```rhai
cased_as: CasedIdentityCasedValue(CamelCase)
// Input: "user service" → Output: "userService"
```

#### Multiple Case Application

```rhai
cased_as: CasedIdentityCasedValue([CamelCase, PascalCase, SnakeCase])
// Input: "user service" → Outputs: "userService", "UserService", "user_service"
```

#### Programming Cases

```rhai
cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)
// Input: "user service" → Outputs all programming case variants
```

### CasedKeyCasedValue _(Cased Map Prompts Only)_

Creates additional keys by applying case transformation to the identity key name.

```rhai
cased_as: CasedKeyCasedValue("service_name", [KebabCase, CamelCase])
// For key "service_name", creates additional keys:
// - "service-name" (KebabCase applied to key)
// - "serviceName" (CamelCase applied to key)
// Both contain the user input transformed accordingly
```

### FixedKeyCasedValue _(Cased Map Prompts Only)_

Creates a fixed key name with case transformation applied to the value.

```rhai
cased_as: FixedKeyCasedValue("project-title", TitleCase)
// Creates key "project-title" with TitleCase value
// Input: "user service" → Key: "project-title", Value: "User Service"
```

## Usage in Single Value Prompts

Single value prompts apply casing to the returned value:

```rhai
// Simple case transformation
context.serviceName = prompt("Service Name:", #{
    cased_as: CamelCase,
});

// Only individual case styles are supported in single value prompts
context.serviceSnake = prompt("Service Name:", #{
    cased_as: SnakeCase,
});

// For multiple case variants, use cased map prompts instead
context.servicePascal = prompt("Service Name:", #{
    cased_as: PascalCase,
});
```

## Usage in Cased Map Prompts

Cased map prompts generate multiple key-value pairs:

### Basic Programming Cases

```rhai
context += prompt("Service Name:", "service_name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});
// Generates: service_name, serviceName, ServiceName, SERVICE_NAME, service-name
```

### Programming Cases + Title Case

```rhai
context += prompt("Project Name:", "project-name", #{
    cased_as: [
        CasedIdentityCasedValue(PROGRAMMING_CASES),
        FixedKeyCasedValue("project-title", TitleCase),
    ],
});
// Generates programming cases PLUS project-title with title case
```

### Complex Multi-Strategy

```rhai
context += prompt("API Name:", "api_name", #{
    cased_as: [
        CasedIdentityCasedValue(PROGRAMMING_CASES),
        FixedKeyCasedValue("api-display-name", TitleCase),
        CasedKeyCasedValue("endpoint", [KebabCase]),
        FixedKeyCasedValue("class-suffix", PascalCase),
    ],
});
```

## Template Usage Examples

### Generated Variables in Templates

After applying casing strategies, templates can use the generated variants:

```yaml
# config.yaml
service:
  name: "{{ service-name }}" # kebab-case
  class: "{{ ServiceName }}" # PascalCase
  constant: "{{ SERVICE_NAME }}" # CONSTANT_CASE
  display: "{{ service-title }}" # Title Case
```

```rust
// main.rs
struct {{ ServiceName }} {              // PascalCase
    {{ service_name }}_config: Config,  // snake_case
}

const {{ SERVICE_NAME }}_PORT: u16 = 8080;  // CONSTANT_CASE
```

```java
// Service.java
public class {{ ServiceName }}Service {     // PascalCase
    private static final String {{ SERVICE_NAME }}_ENDPOINT = "/{{ service-name }}";

    private {{ serviceName }}Repository repo;  // camelCase
}
```

## Best Practices

### 1. Use PROGRAMMING_CASES for Standard Projects

```rhai
// Recommended for most use cases
context += prompt("Service Name:", "service_name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});
```

### 2. Add Title Case for Human-Readable Text

```rhai
// Common pattern for documentation and display
context += prompt("Project Name:", "project_name", #{
    cased_as: [
        CasedIdentityCasedValue(PROGRAMMING_CASES),
        FixedKeyCasedValue("project-title", TitleCase),
    ],
});
```

### 3. Use Specific Cases for Special Requirements

```rhai
// When you need only specific case formats
context += prompt("Database Name:", "db_name", #{
    cased_as: CasedIdentityCasedValue([SnakeCase, ConstantCase]),
});
```

### 4. Match Key Names to Expected Case Format and Answer Key Convention

The key parameter serves dual purposes: case shape hint and answer key. Follow these conventions:

```rhai
// ✅ Recommended: kebab-case for compound keys (better CLI usability)
context += prompt("Service Name:", "service-name", #{  // -a service-name="User API"
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});

context += prompt("Database Type:", "database-type", #{  // -a database-type="PostgreSQL"
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});

// ✅ Acceptable: snake_case for compound keys
context += prompt("Service Name:", "service_name", #{  // -a service_name="user-api"
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});

// ❌ Avoid: Other case formats for compound keys (harder to type/guess)
context += prompt("Class Name:", "ClassName", #{  // -a ClassName="UserService" (less intuitive)
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});
```

### Key Parameter Dual Role

In cased map prompts, the key parameter:

1. **Suggests Primary Case Format**: The key's case style hints at the expected primary format
2. **Becomes Answer Key**: Users provide values via `--answer key="value"` or answer files

## Advanced Scenarios

### Conditional Casing

```rhai
let case_strategy = if switch_enabled("java") {
    [CamelCase, PascalCase, ConstantCase]
} else if switch_enabled("rust") {
    [SnakeCase, PascalCase, ConstantCase]
} else {
    PROGRAMMING_CASES
};

context += prompt("Service Name:", "service_name", #{
    cased_as: CasedIdentityCasedValue(case_strategy),
});
```

### Language-Specific Casing

```rhai
// Different strategies for different languages
if switch_enabled("java-project") {
    context += prompt("Package Name:", "package_name", #{
        cased_as: [
            CasedIdentityCasedValue([CamelCase, PascalCase]),
            FixedKeyCasedValue("package-title", TitleCase),
        ],
    });
}

if switch_enabled("rust-project") {
    context += prompt("Crate Name:", "crate_name", #{
        cased_as: [
            CasedIdentityCasedValue([SnakeCase, KebabCase, PascalCase]),
            FixedKeyCasedValue("crate-title", TitleCase),
        ],
    });
}
```

## When Casing Is Applied

### Single Value Prompts

- Casing is applied to the user input
- Returns the transformed value(s)
- Must assign to context manually

### Cased Map Prompts

- Casing creates multiple key-value pairs
- Automatically merges into context with `+=`
- Keys are generated based on strategy type

## See Also

- **[Casing Strategies](../../casing-strategies/)** - Complete reference for all casing strategies
- **[Case Styles](../../case-styles/)** - All available case transformation types
- **[Single Value Prompts](../single-value)** - Using casing with scalar values
- **[Cased Map Prompts](../cased-map)** - Using casing with map generation
- **Set Function** - Applying case transformations to variables (coming soon)
- **[Templating Fundamentals](../../../../authoring/templating/fundamentals/)** - Using cased variables in templates
