---
sidebar_position: 4
---

# Prompt Settings

Prompt settings provide configuration options that control behavior, validation, and user experience across all [prompt families](../) and [prompt types](../prompt-types). These settings are passed as a map parameter to prompt functions.

## Overview

Settings are provided as the second parameter (single value prompts) or third parameter (cased map prompts):

```rhai
// Single value prompt with settings
context.value = prompt("Message:", #{
    type: Text,
    help: "Help text",
    placeholder: "example",
});

// Cased map prompt with settings
context += prompt("Message:", "key", #{
    type: Text,
    help: "Help text",
    placeholder: "example",
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});
```

## Universal Settings

These settings work with all prompt types and families:

### `type`

**Type:** `PromptType`  
**Default:** `Text`  
**Description:** Specifies the prompt type and behavior

```rhai
type: Text           // String input (default)
type: Bool           // Boolean confirmation
type: Int            // Integer input
type: List           // Dynamic list input
type: Editor         // Multi-line editor
type: Select([...])  // Single selection from options
type: MultiSelect([...])  // Multiple selection from options
```

### `optional`

**Type:** `bool`  
**Default:** `false`  
**Description:** Makes the prompt optional, allowing empty responses

```rhai
optional: true   // Allow empty input
optional: false  // Require input (default)
```

### `defaults_with`

**Type:** `Dynamic` (varies by prompt type)  
**Description:** Provides default value(s) when user doesn't provide input

```rhai
// Text/Editor
defaults_with: "default-value"

// Bool
defaults_with: true

// Int
defaults_with: 8080

// Select
defaults_with: "PostgreSQL"

// MultiSelect/List
defaults_with: ["option1", "option2"]
```

### `placeholder`

**Type:** `String`  
**Description:** Placeholder text shown in input fields

```rhai
placeholder: "Enter service name"
placeholder: "my-service"
placeholder: "8080"
```

### `help`

**Type:** `String`  
**Description:** Help text displayed to guide the user

```rhai
help: "Enter a unique service identifier"
help: "Choose your preferred database engine"
help: "Port number (1024-65535)"
```

## Answer Integration Settings

### `answer_key`

**Type:** `String`  
**Description:** Key for automatic answer lookup

**Single Value Prompts:** Required for automatic answers

```rhai
context.port = prompt("Port:", #{
    answer_key: "service_port",  // Enable --answer service_port=8080
});
```

**Cased Map Prompts:** Optional override (uses function `key` parameter by default)

```rhai
context += prompt("Service:", "service-name", #{
    answer_key: "custom_key",  // Override default "service-name"
});
```

### `answer_source`

**Type:** `Map`  
**Description:** External map to search for answers before prompting

```rhai
let external_config = #{
    database_port: 5432,
    cache_enabled: true,
};

context.port = prompt("Database Port:", #{
    answer_key: "database_port",
    answer_source: external_config,  // Look here first
});
```

## Validation Settings

### Length/Range Validation

#### `min`

**Type:** `usize` (Text/Editor) or `i64` (Int)  
**Description:** Minimum length or value constraint

```rhai
// Text: minimum character count
min: 2

// Editor: minimum content length
min: 10

// Int: minimum numeric value
min: 1024
```

#### `max`

**Type:** `usize` (Text/Editor) or `i64` (Int)  
**Description:** Maximum length or value constraint

```rhai
// Text: maximum character count
max: 50

// Editor: maximum content length
max: 1000

// Int: maximum numeric value
max: 65535
```

### Collection Validation

#### `min_items`

**Type:** `usize`  
**Applies to:** List, MultiSelect  
**Description:** Minimum number of items required

```rhai
min_items: 1   // At least one item required
min_items: 0   // No minimum (default)
```

#### `max_items`

**Type:** `usize`  
**Applies to:** List, MultiSelect  
**Description:** Maximum number of items allowed

```rhai
max_items: 5   // Up to 5 items
max_items: 10  // Up to 10 items
```

## Display Settings

### `page_size`

**Type:** `usize`  
**Applies to:** Select, MultiSelect  
**Description:** Number of options displayed per page for long lists

```rhai
page_size: 5   // Show 5 options at a time
page_size: 10  // Show 10 options at a time (default)
```

## Casing Settings

### `cased_as`

**Type:** `CaseStrategy` or `Array<CaseStrategy>`  
**Description:** Case transformation strategies to apply

**Single Value Prompts:** Transforms the returned value (only individual CaseStyle values supported)

```rhai
cased_as: CamelCase    // Single case transformation
cased_as: PascalCase   // Another single case transformation
```

**Cased Map Prompts:** Generates multiple key-value pairs

```rhai
// Single strategy
cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)

// Multiple strategies
cased_as: [
    CasedIdentityCasedValue(PROGRAMMING_CASES),
    FixedKeyCasedValue("project-title", TitleCase),
]
```

See **[Casing Strategies](../casing-strategies)** for complete documentation.

## Settings by Prompt Type

### Text Prompt Settings

```rhai
#{
    type: Text,              // Optional (default)
    min: 2,                  // Minimum length
    max: 50,                 // Maximum length
    placeholder: "example",  // Placeholder text
    help: "Enter text",      // Help message
    optional: false,         // Require input
    defaults_with: "default", // Default value
    answer_key: "text_key",  // Answer key
    cased_as: CamelCase,     // Case transformation
}
```

### Boolean Prompt Settings

```rhai
#{
    type: Bool,
    help: "Enable feature?",
    defaults_with: true,
    answer_key: "enabled",
}
```

### Integer Prompt Settings

```rhai
#{
    type: Int,
    min: 1024,                    // Minimum value
    max: 65535,                   // Maximum value
    placeholder: "8080",          // Placeholder
    help: "Port (1024-65535)",    // Help text
    defaults_with: 8080,          // Default value
    answer_key: "port",           // Answer key
}
```

### Select Prompt Settings

```rhai
#{
    type: Select(["Option1", "Option2", "Option3"]),
    defaults_with: "Option1",     // Default selection
    page_size: 5,                 // Items per page
    help: "Choose option",        // Help text
    answer_key: "selection",      // Answer key
}
```

### MultiSelect Prompt Settings

```rhai
#{
    type: MultiSelect(["Auth", "Logging", "Metrics"]),
    defaults_with: ["Auth"],      // Default selections
    min_items: 1,                 // Minimum selections
    max_items: 3,                 // Maximum selections
    page_size: 5,                 // Items per page
    help: "Select features",      // Help text
    answer_key: "features",       // Answer key
}
```

### List Prompt Settings

```rhai
#{
    type: List,
    min_items: 0,                 // Minimum items
    max_items: 10,                // Maximum items
    help: "Add items",            // Help text
    answer_key: "items",          // Answer key
    cased_as: PROGRAMMING_CASES,  // Case transformation
}
```

### Editor Prompt Settings

```rhai
#{
    type: Editor,
    min: 10,                      // Minimum content length
    max: 1000,                    // Maximum content length
    placeholder: "Enter text...", // Initial content
    help: "Multi-line input",     // Help text
    optional: true,               // Allow empty
    answer_key: "content",        // Answer key
}
```

## Complete Example

```rhai
let context = #{};

// Single value with comprehensive settings
context.service_port = prompt("Service Port:", #{
    type: Int,
    min: 1024,
    max: 65535,
    defaults_with: 8080,
    placeholder: "Port number",
    help: "HTTP service port (1024-65535)",
    answer_key: "service_port",
    optional: false,
});

// Cased map with comprehensive settings
context += prompt("Service Name:", "service-name", #{
    type: Text,
    min: 2,
    max: 50,
    placeholder: "my-service",
    help: "Unique service identifier",
    defaults_with: "default-service",
    optional: false,
    cased_as: [
        CasedIdentityCasedValue(PROGRAMMING_CASES),
        FixedKeyCasedValue("service-title", TitleCase),
    ],
});

// MultiSelect with validation
context += prompt("Features:", "enabled-features", #{
    type: MultiSelect([
        "Authentication",
        "Logging",
        "Metrics",
        "Rate Limiting"
    ]),
    defaults_with: ["Authentication"],
    min_items: 1,
    max_items: 3,
    page_size: 4,
    help: "Select up to 3 features to enable",
});
```

## Settings Validation

### Required Settings

- None (all settings have sensible defaults)

### Type-Specific Requirements

- **Select/MultiSelect:** Must provide options array in type specification
- **Cased Map Prompts:** Must provide `cased_as` for automatic case generation

### Invalid Combinations

- `min > max` (validation/range settings)
- `min_items > max_items` (collection settings)
- `optional: false` with empty `defaults_with` (may cause validation issues)

## See Also

- **[Single Value Prompts](../single-value)** - Using settings with scalar returns
- **[Cased Map Prompts](../cased-map)** - Using settings with map generation
- **[Prompt Type Variants](../prompt-types)** - Type-specific behavior and examples
- **[Casing Strategies](../casing-strategies)** - Case transformation options
