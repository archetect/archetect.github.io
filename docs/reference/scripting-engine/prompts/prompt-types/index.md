---
sidebar_position: 3
---

# Prompt Type Variants

Archetect supports multiple prompt types that work with both [Single Value Prompts](../single-value) and [Cased Map Prompts](../cased-map). Each type provides specialized input handling, validation, and user experience optimized for different data collection scenarios.

## Overview

All prompt types share common settings but provide specialized behavior:

- **Text**: General string input with length validation
- **Bool**: Boolean confirmation prompts
- **Int**: Integer input with range validation
- **Select**: Single choice from predefined options
- **MultiSelect**: Multiple choices from predefined options
- **List**: Dynamic list input where users add items
- **Editor**: Multi-line text input using system editor

## Text Prompt (Default)

**Return Type:** `String`  
**Description:** General purpose text input with optional length validation

### Single Value Usage
```rhai
context.service_name = prompt("Service Name:", #{
    placeholder: "my-service",
    help: "Enter the service name",
    min: 2,
    max: 50,
    optional: false,
});
```

### Cased Map Usage
```rhai
context += prompt("Service Name:", "service-name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
    placeholder: "my-service",
    help: "Enter the service name",
    min: 2,
    max: 50,
});
```

### Key Settings
See **[Prompt Settings](../settings)** for complete documentation.
- **`min`/`max`** - Length validation
- **`placeholder`** - Input placeholder
- **`help`** - User guidance
- **`optional`** - Allow empty input

## Boolean Prompt

**Return Type:** `bool`  
**Description:** Yes/No confirmation prompts

### Single Value Usage
```rhai
context.enable_metrics = prompt("Enable metrics collection?", #{
    type: Bool,
    defaults_with: true,
    help: "Enable application monitoring",
});
```

### Cased Map Usage
```rhai
context += prompt("Enable monitoring?", "enable-monitoring", #{
    type: Bool,
    defaults_with: true,
    help: "Enable application monitoring",
});
```

### Key Settings
See **[Prompt Settings](../settings)** for complete documentation.
- **`defaults_with`** - Default boolean value
- **`help`** - Help text explaining the choice

## Integer Prompt

**Return Type:** `i64`  
**Description:** Numeric input with range validation

### Single Value Usage
```rhai
context.port = prompt("Port Number:", #{
    type: Int,
    min: 1024,
    max: 65535,
    defaults_with: 8080,
    placeholder: "Port number",
    help: "Service port (1024-65535)",
});
```

### Cased Map Usage
```rhai
context += prompt("Port number:", "service-port", #{
    type: Int,
    min: 1024,
    max: 65535,
    defaults_with: 8080,
    placeholder: "Port number",
    help: "Service port (1024-65535)",
});
```

### Key Settings
See **[Prompt Settings](../settings)** for complete documentation.
- **`min`/`max`** - Value range validation
- **`defaults_with`** - Default integer value
- **`placeholder`** - Input placeholder
- **`help`** - Range guidance

## Select Prompt

**Return Type:** `String`  
**Description:** Single selection from predefined options

### Single Value Usage
```rhai
context.database = prompt("Database Engine:", #{
    type: Select([
        "PostgreSQL",
        "MySQL",
        "SQLite",
        "MongoDB"
    ]),
    defaults_with: "PostgreSQL",
    help: "Choose database engine",
    page_size: 4,
});
```

### Cased Map Usage
```rhai
context += prompt("Database type:", "database-type", #{
    type: Select([
        "PostgreSQL",
        "MySQL",
        "SQLite",
        "MongoDB"
    ]),
    defaults_with: "PostgreSQL",
    help: "Choose database engine",
    page_size: 4,
});
```

### Key Settings
See **[Prompt Settings](../settings)** for complete documentation.
- **`defaults_with`** - Default selected option
- **`page_size`** - Items per page
- **`help`** - Choice guidance

## MultiSelect Prompt

**Return Type:** `Array<String>`  
**Description:** Multiple selections from predefined options

### Single Value Usage
```rhai
context.features = prompt("Select features to enable:", #{
    type: MultiSelect([
        "Authentication",
        "Logging",
        "Metrics",
        "Rate Limiting",
        "Caching"
    ]),
    defaults_with: ["Authentication", "Logging"],
    min_items: 1,
    max_items: 3,
    help: "Select features to enable",
    page_size: 5,
});
```

### Cased Map Usage
```rhai
context += prompt("Features:", "enabled-features", #{
    type: MultiSelect([
        "Authentication",
        "Logging",
        "Metrics", 
        "Rate Limiting",
        "Caching"
    ]),
    defaults_with: ["Authentication", "Logging"],
    min_items: 1,
    max_items: 3,
    help: "Select features to enable",
    page_size: 5,
});
```

### Key Settings
See **[Prompt Settings](../settings)** for complete documentation.
- **`defaults_with`** - Default selections array
- **`min_items`/`max_items`** - Selection count limits
- **`page_size`** - Items per page
- **`help`** - Selection guidance

## List Prompt

**Return Type:** `Array<String>`  
**Description:** Dynamic list where users add items one by one

### Single Value Usage
```rhai
context.dependencies = prompt("Additional dependencies:", #{
    type: List,
    help: "Enter dependencies one by one (empty line to finish)",
    min_items: 0,
    max_items: 10,
});
```

### Cased Map Usage
```rhai
context += prompt("Services:", "services", #{
    type: List,
    help: "Enter service names (empty line to finish)",
    min_items: 1,
    max_items: 10,
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});
```

### Key Settings
See **[Prompt Settings](../settings)** for complete documentation.
- **`min_items`/`max_items`** - Item count limits
- **`help`** - Input process guidance
- **`cased_as`** - Case transformations (cased map prompts only)

## Editor Prompt

**Return Type:** `String`  
**Description:** Multi-line text input using the system's default editor

### Single Value Usage
```rhai
context.readme_content = prompt("README content:", #{
    type: Editor,
    placeholder: "Enter the README content...",
    help: "This will open your default editor",
    optional: true,
});
```

### Cased Map Usage
```rhai
context += prompt("Description:", "project-description", #{
    type: Editor,
    placeholder: "Enter project description...",
    help: "Multi-line project description",
    optional: true,
});
```

### Key Settings
See **[Prompt Settings](../settings)** for complete documentation.
- **`placeholder`** - Initial editor content
- **`help`** - Editor usage guidance
- **`optional`** - Allow empty content
- **`min`/`max`** - Content length validation

## Settings

All prompt types share common settings for validation, display, and behavior. For comprehensive documentation of all available settings including detailed examples and type specifications, see **[Prompt Settings](../settings)**.

### Universal Settings Summary
- **`type`** - Prompt type specification
- **`optional`** - Allow empty input
- **`help`** - User guidance text
- **`defaults_with`** - Default values
- **`answer_key`** - Answer integration (single value prompts)
- **`cased_as`** - Case transformations (cased map prompts)
- **`min`/`max`** - Validation constraints
- **`placeholder`** - Input placeholders

## Type Selection Guidelines

### Use **Text** when:
- Collecting general string input
- User provides free-form text
- Need basic length validation

### Use **Bool** when:
- Simple yes/no decisions
- Feature enable/disable flags
- Binary configuration options

### Use **Int** when:
- Numeric configuration (ports, sizes, counts)
- Need range validation
- Mathematical inputs

### Use **Select** when:
- Predefined options only
- Single choice required
- Want to prevent typos

### Use **MultiSelect** when:
- Multiple predefined options
- Known set of choices
- Want consistent option names

### Use **List** when:
- Dynamic number of items
- User-defined content
- Flexible input requirements

### Use **Editor** when:
- Multi-line text needed
- Complex text formatting
- Large text content

## Advanced Usage

### Conditional Type Selection
```rhai
let prompt_type = if switch_enabled("simple") {
    Text
} else {
    Select(["Option1", "Option2", "Option3"])
};

context += prompt("Choose option:", "option", #{
    type: prompt_type,
});
```

### Dynamic Option Lists
```rhai
let database_options = if switch_enabled("enterprise") {
    ["PostgreSQL", "Oracle", "SQL Server"]
} else {
    ["PostgreSQL", "MySQL", "SQLite"]
};

context += prompt("Database:", "database", #{
    type: Select(database_options),
});
```

## See Also

- **[Single Value Prompts](../single-value)** - Using prompt types with scalar returns
- **[Cased Map Prompts](../cased-map)** - Using prompt types with map generation
- **[Casing Strategies](../casing-strategies)** - Case transformations for prompt values