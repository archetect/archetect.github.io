---
sidebar_position: 1
---

# Cased Map Prompts

Cased map prompts are the **workhorse** of Archetect archetype development. They return a map of cased key-value pairs that can be directly merged into your context, providing automatic case transformations for consistent naming across different programming language conventions.

This family is essential for projects that require multiple case formats (like Java projects with CamelCase, PascalCase, and CONSTANT_CASE variants throughout the codebase).

## Function Signatures

### Basic Cased Map Prompt

```rhai
prompt(message: String, key: String) -> Map
```

### Cased Map Prompt with Settings

```rhai
prompt(message: String, key: String, settings: Map) -> Map
```

## The Casing Magic

When you provide a `key` parameter with `cased_as` settings, Archetect generates multiple cased variations. **Note: Without `cased_as`, no automatic casing is performed.**

```rhai
// Key suggests snake_case format with automatic programming cases
context += prompt("Project Name:", "project_name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});
// Generates: project_name, projectName, ProjectName, PROJECT_NAME, etc.

// Key suggests kebab-case format with programming cases
context += prompt("Service Name:", "service-name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});
// Generates: service-name, serviceName, ServiceName, SERVICE_NAME, etc.

// Common pattern: Programming cases + title case
context += prompt("Organization Name:", "org-name", #{
    cased_as: [
        CasedIdentityCasedValue(PROGRAMMING_CASES),
        FixedKeyCasedValue("org-title", TitleCase),
    ],
});
// Generates programming cases PLUS org-title: "My Organization"
```

## PROGRAMMING_CASES Constant

The `PROGRAMMING_CASES` constant provides automatic multi-case generation for common programming scenarios. See **[Casing Strategies](../casing-strategies)** for complete documentation of all available case formats and strategies.

```rhai
// Most common pattern
cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)
```

## Automatic Answer Integration

Unlike single value prompts, cased map prompts automatically support answers because the `key` parameter becomes the answer key:

```rhai
// Key parameter becomes the answer key automatically
context += prompt("Project Name:", "project_name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});
// Command line: --answer project_name="my-service"

// Convention: Use kebab-case for compound keys
context += prompt("Service Name:", "service-name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});
// Command line: --answer service-name="User API"
```

## Key Parameter Dual Role

The `key` parameter in cased map prompts serves two essential functions:

1. **Default Case Shape**: Indicates the expected case format for the primary variable
2. **Answer Key**: Automatically becomes the command-line answer identifier

### Key Naming Best Practices

**Use kebab-case for compound keys** to improve command-line usability and guessability:

```rhai
// ✅ Recommended: kebab-case for compound names
context += prompt("Database Type:", "database-type");     // -a database-type="PostgreSQL"
context += prompt("Auth Provider:", "auth-provider");     // -a auth-provider="OAuth2"
context += prompt("API Version:", "api-version");         // -a api-version="v2"

// ✅ Acceptable: snake_case for single compound
context += prompt("Service Name:", "service_name");       // -a service_name="user-api"

// ❌ Avoid for compound keys
context += prompt("Database Type:", "DatabaseType");      // -a DatabaseType="PostgreSQL" (less intuitive)
context += prompt("API Version:", "apiVersion");          // -a apiVersion="v2" (harder to type)
```

## Prompt Types

Cased map prompts support all prompt types with automatic case generation. For comprehensive documentation of each type including settings, validation options, and examples, see **[Prompt Type Variants](../prompt-types)**.

### Quick Type Reference
```rhai
// Text (default) with casing
context += prompt("Service Name:", "service-name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});

// Boolean
context += prompt("Enable monitoring?", "enable-monitoring", #{
    type: Bool,
    defaults_with: true,
});

// Integer
context += prompt("Port:", "service-port", #{
    type: Int,
    min: 1024,
    max: 65535,
});

// Select
context += prompt("Database:", "database-type", #{
    type: Select(["PostgreSQL", "MySQL", "SQLite"]),
});

// MultiSelect
context += prompt("Features:", "enabled-features", #{
    type: MultiSelect(["Auth", "Logging", "Metrics"]),
});

// List with casing
context += prompt("Services:", "services", #{
    type: List,
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});

// Editor
context += prompt("Description:", "project-description", #{
    type: Editor,
    optional: true,
});
```

## Settings

Cased map prompts support all prompt settings with special emphasis on casing strategies. For comprehensive documentation of all available settings including validation, display options, and detailed examples, see **[Prompt Settings](../settings)**.

### Key Settings for Cased Map Prompts
```rhai
#{  
    type: Text,                           // Prompt type
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),  // Case strategies
    optional: false,                      // Require input
    placeholder: "my-service",            // Placeholder text
    help: "Enter service name",           // User guidance
    defaults_with: "default-service",     // Default value
    min: 2,                               // Validation
    max: 50,                              // Validation
    // Note: answer_key automatically uses function key parameter
}
```

### Casing-Specific Settings
See **[Casing Strategies](../casing-strategies)** for complete `cased_as` documentation:

```rhai
// Common patterns
cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)
cased_as: [CasedIdentityCasedValue(PROGRAMMING_CASES), FixedKeyCasedValue("title", TitleCase)]
```

## Casing Strategies

Cased map prompts support sophisticated casing strategies for generating multiple key-value pairs. For complete documentation of all casing strategies, case formats, and advanced patterns, see **[Casing Strategies](../casing-strategies)**.

### Quick Reference

```rhai
// Most common: Programming cases + title case
cased_as: [
    CasedIdentityCasedValue(PROGRAMMING_CASES),
    FixedKeyCasedValue("project-title", TitleCase),
]

// Identity transformations
cased_as: CasedIdentityCasedValue([CamelCase, PascalCase])

// Fixed key with case transformation
cased_as: FixedKeyCasedValue("display-name", TitleCase)

// Key transformation
cased_as: CasedKeyCasedValue("endpoint", [KebabCase])
```

## Template Usage Examples

After using cased map prompts, your templates can reference the generated variants:

### File Names

```
src/main/java/com/example/{{ ProjectName }}.java
src/{{ project_name }}/{{ service_name }}.rs
config/{{ service-name }}-config.yaml
templates/{{ project-title | replace(" ", "-") | lower }}.html
```

### Code Content

```java
// Java class using multiple case variants
public class {{ ServiceName }}Controller {
    private static final String {{ SERVICE_NAME }}_ENDPOINT = "/{{ service-name }}";

    private {{ serviceName }}Service service;

    /**
     * {{ service-title }} REST Controller
     */
    public {{ ServiceName }}Controller() {
        // ...
    }
}
```

## Map Merging Patterns

### Basic Merging

```rhai
let context = #{};

// Each prompt adds to the same context map
context += prompt("Project Name:", "project_name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});

context += prompt("Author Name:", "author_name", #{
    cased_as: [
        CasedIdentityCasedValue(PROGRAMMING_CASES),
        FixedKeyCasedValue("author-display", TitleCase),
    ],
});

debug(context);  // Shows all generated key-value pairs
```

### Conditional Merging

```rhai
let context = #{};

context += prompt("Project Name:", "project_name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});

if switch_enabled("database") {
    context += prompt("Database Type:", "database_type", #{
        type: Select(["PostgreSQL", "MySQL", "SQLite"]),
        cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
    });
}
```

## When to Use Cased Map Prompts

Choose cased map prompts when you need:

- **Consistent naming** across multiple case formats in templates
- **Automatic answer integration** without explicit answer_key configuration
- **Direct context merging** with `+=` operator
- **Multi-language projects** that require different naming conventions
- **Standard archetype patterns** where naming consistency is critical

Cased map prompts are the recommended approach for most archetype development scenarios because they provide comprehensive and consistent naming support with minimal configuration.
