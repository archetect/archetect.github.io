# Prompt

Archetect provides two distinct families of prompt functions, each designed for different use cases in archetype development. Understanding the differences between these families is crucial for effective archetype creation.

## Prompt Families Overview

### [Single Value Prompts](./single-value)
Return a scalar value directly assigned to a variable. These prompts provide maximum flexibility for custom processing and conditional logic.

**Key Characteristics:**
- Return a single transformed value
- Require explicit `answer_key` for automatic answers
- Ideal for complex processing before adding to context
- Support all prompt types with custom casing

### [Cased Map Prompts](./cased-map) ⭐ **Recommended**
Return a map of cased key-value pairs that can be directly merged into context. These are the **workhorse** of Archetect development, providing automatic case transformations essential for multi-language projects.

**Key Characteristics:**
- Generate multiple case variants automatically (snake_case, camelCase, PascalCase, etc.)
- Built-in answer integration using the key parameter
- Direct context merging with `+=` operator
- Critical for projects requiring consistent naming across different conventions

### [Prompt Type Variants](./prompt-types)
Comprehensive reference for all prompt types (Text, Bool, Int, Select, MultiSelect, List, Editor) that work with both prompt families. Each type provides specialized input handling and validation.

**Key Features:**
- Detailed examples for both Single Value and Cased Map usage
- Complete settings and validation options reference
- Type selection guidelines and best practices
- Advanced usage patterns and conditional type selection

### [Casing Strategies](./casing-strategies)
Comprehensive reference for case transformations and strategies used by both prompt families. Learn about PROGRAMMING_CASES, individual case formats, and advanced casing patterns.

**Key Concepts:**
- Case formats (CamelCase, PascalCase, SnakeCase, etc.)
- PROGRAMMING_CASES constant for common programming scenarios
- Strategy types (CasedIdentityCasedValue, FixedKeyCasedValue, CasedKeyCasedValue)
- Template usage patterns and best practices

### [Prompt Settings](./settings)
Complete reference for all prompt configuration options shared across prompt families and types. Covers validation, display, answer integration, and behavior settings.

**Key Areas:**
- Universal settings (type, optional, help, defaults_with, etc.)
- Validation settings (min/max, min_items/max_items)
- Answer integration (answer_key, answer_source)
- Display settings (placeholder, page_size)
- Type-specific setting combinations and examples

## The Casing Distinction

The most important distinction between the families is how they handle casing for template variables:

```rhai
// Single Value - manual casing
context.projectName = prompt("Project Name:", #{
    cased_as: CamelCase,
});

// Cased Map - automatic multiple case variants
context += prompt("Project Name:", "project_name", #{
    cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES),
});
// Generates: project_name, projectName, ProjectName, PROJECT_NAME, etc.
```

## When Template Variables Suggest Case Format

Archetect follows the principle that variable names in templates suggest their expected case format:

- `{{ project_name }}` → Expects snake_case value like `user_service`
- `{{ project-name }}` → Expects kebab-case value like `user-service`  
- `{{ projectName }}` → Expects camelCase value like `userService`
- `{{ ProjectName }}` → Expects PascalCase value like `UserService`
- `{{ PROJECT_NAME }}` → Expects CONSTANT_CASE value like `USER_SERVICE`

Cased map prompts automatically generate all these variants, making them essential for sophisticated code generation across different programming language conventions.

## Answer Integration

### Single Value Prompts
```rhai
// Requires explicit answer_key
context.port = prompt("Port:", #{
    answer_key: "service_port",  // Enable --answer service_port=8080
});
```

### Cased Map Prompts  
```rhai
// Automatic answer support - key parameter becomes the answer key
context += prompt("Service Name:", "service_name");  // Enable --answer service_name="user-api"

// Convention: Use kebab-case for compound keys
context += prompt("Project Name:", "project-name");  // Enable --answer project-name="Example Service"
```

## Key Parameter Dual Role

In cased map prompts, the `key` parameter serves two critical functions:

1. **Default Case Shape**: Suggests the primary case format for the generated variables
2. **Answer Key**: Automatically becomes the command-line answer key

### Key Naming Convention
For compound names, use **kebab-case** for better command-line usability:

```rhai
// ✅ Recommended: kebab-case for compound keys
context += prompt("Project Name:", "project-name");    // -a project-name="Example Service"
context += prompt("Database Type:", "database-type");  // -a database-type="PostgreSQL"

// ❌ Avoid: PascalCase or other formats for compound keys  
context += prompt("Project Name:", "ProjectName");     // -a ProjectName="Example Service" (less intuitive)
```

## Choosing the Right Family

### Use **Cased Map Prompts** when:
- Building standard project structures
- Need consistent naming across multiple case formats
- Want automatic answer integration
- Creating templates for multiple programming languages
- Following established archetype patterns

### Use **Single Value Prompts** when:
- Need custom processing before adding to context
- Performing conditional logic on prompt results
- Combining multiple inputs into computed values
- Require non-standard variable naming
- Building complex generation workflows

## Getting Started

For most archetype development, start with [Cased Map Prompts](./cased-map) as they provide the most comprehensive functionality with minimal configuration. Use [Single Value Prompts](./single-value) for specialized cases requiring custom logic.

Both families support the same underlying prompt types (Text, Bool, Int, List, Select, MultiSelect, Editor) and settings, but differ in their return format and casing capabilities.