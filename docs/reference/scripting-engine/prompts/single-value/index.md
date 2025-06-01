---
sidebar_position: 2
---

# Single Value Prompts

Single value prompts return a scalar value directly assigned to a variable. These are ideal when you need a single transformed value or when you plan to perform additional operations on the result before adding it to your context.

## Function Signatures

### Basic Single Value Prompt

```rhai
prompt(message: String) -> Dynamic
```

### Single Value Prompt with Settings

```rhai
prompt(message: String, settings: Map) -> Dynamic
```

## Return Types by Prompt Type

| Prompt Type      | Return Type     | Description                      |
| ---------------- | --------------- | -------------------------------- |
| `Text` (default) | `String`        | Plain text input                 |
| `Bool`           | `bool`          | Boolean confirmation             |
| `Int`            | `i64`           | Integer input with validation    |
| `Select`         | `String`        | Single selection from options    |
| `MultiSelect`    | `Array<String>` | Multiple selections from options |
| `List`           | `Array<String>` | Dynamic list input               |
| `Editor`         | `String`        | Multi-line text from editor      |

## Basic Usage

### Simple Text Input
```rhai
// Basic string input
context.service_name = prompt("Service Name:");
context.description = prompt("Description:");
```

### With Settings
```rhai
// Text input with validation and help
context.service_name = prompt("Service Name:", #{
    min: 2,
    max: 50,
    placeholder: "my-service",
    help: "Enter a unique service identifier",
    answer_key: "service_name",
});
```

## Prompt Types

Single value prompts support all prompt types. For comprehensive documentation of each type including examples, settings, and validation options, see **[Prompt Type Variants](../prompt-types)**.

### Quick Type Reference
```rhai
// Text (default)
context.name = prompt("Name:");

// Boolean
context.enabled = prompt("Enable feature?", #{ type: Bool });

// Integer
context.port = prompt("Port:", #{ type: Int, min: 1024, max: 65535 });

// Select
context.db = prompt("Database:", #{ type: Select(["PostgreSQL", "MySQL"]) });

// MultiSelect
context.features = prompt("Features:", #{ type: MultiSelect(["Auth", "Logging"]) });

// List
context.deps = prompt("Dependencies:", #{ type: List });

// Editor
context.content = prompt("Content:", #{ type: Editor });
```

## Casing with Single Value Prompts

Single value prompts support the `cased_as` setting to transform the returned value. For comprehensive information about casing strategies, see **[Casing Strategies](../casing-strategies)**.

```rhai
// Apply case transformation to the returned value
context["service-name"] = prompt("Service Name:", #{
    cased_as: KebabCase,  // Use bracket notation for kebab-case
});

// Transform to snake_case
context.service_name = prompt("Service Name:", #{
    cased_as: SnakeCase,
});

// Transform to PascalCase
context.ClassName = prompt("Class Name:", #{
    cased_as: PascalCase,
});
```

:::tip Bracket Notation for Variable Names

For `KebabCase` transformations, you must use bracket notation (`context["kebab-case"]`) since hyphens are not valid in JavaScript property names. Bracket notation can also be used for any case format if you prefer consistent syntax across all your variable assignments.

:::

See **[Casing Strategies](../casing-strategies)** for complete documentation of available case formats, the PROGRAMMING_CASES constant, and advanced casing patterns.

## Settings

Single value prompts support all universal prompt settings. For comprehensive documentation of all available settings including validation, display options, and type-specific configurations, see **[Prompt Settings](../settings)**.

### Key Settings for Single Value Prompts
```rhai
#{  
    type: Text,                    // Prompt type
    optional: false,               // Require input
    placeholder: "example",         // Placeholder text
    help: "Help message",          // User guidance
    defaults_with: "default",      // Default value
    answer_key: "custom_key",      // Answer integration
    cased_as: CamelCase,           // Case transformation
    min: 2,                        // Validation
    max: 50,                       // Validation
}
```

## Answer Keys

Single value prompts require explicit `answer_key` configuration for automatic answers since the variable name is not part of the function signature:

```rhai
// With answer key - can be provided via command line or answer files
context.port = prompt("Port:", #{
    type: Int,
    answer_key: "service_port",  // Users can provide --answer service_port=8080
    defaults_with: 8080,
});

// Without answer key - always prompts interactively
context.description = prompt("Description:");  // No automatic answer support
```

### External Answer Sources

```rhai
let external_config = #{
    database_port: 5432,
    cache_enabled: true,
};

context.db_port = prompt("Database Port:", #{
    type: Int,
    answer_key: "database_port",
    answer_source: external_config,  // Look in external_config first
});
```

## When to Use Single Value Prompts

Choose single value prompts when you need to:

- Perform additional processing on the value before adding to context
- Use the value in conditional logic before templating
- Apply complex transformations or validations
- Store the value in a specific variable name that doesn't follow casing patterns
- Combine multiple prompt results into computed values

Single value prompts give you maximum control over how the data flows through your archetype script, making them ideal for complex generation logic.
