---
sidebar_position: 2
---

# Case Styles

Case styles define the 14 different text transformation formats available in Archetect for consistent naming conventions across programming languages and contexts.

## Quick Reference

| Style | Example Result | Primary Use Cases |
|-------|----------------|-------------------|
| `CamelCase` | `userServiceName` | JavaScript variables, Java methods |
| `PascalCase` | `UserServiceName` | Class names, types, React components |
| `SnakeCase` | `user_service_name` | Rust variables, Python functions |
| `KebabCase` | `user-service-name` | URLs, CSS classes, CLI flags |
| `ConstantCase` | `USER_SERVICE_NAME` | Constants, environment variables |
| `TitleCase` | `User Service Name` | Human-readable titles, documentation |
| `SentenceCase` | `User service name` | Descriptions, natural text |
| `TrainCase` | `User-Service-Name` | HTTP headers, special identifiers |
| `DirectoryCase` | `user/service/name` | File paths, namespaces |
| `PackageCase` | `user.service.name` | Java packages, dotted identifiers |
| `ClassCase` | `UserServiceName` | Alias for PascalCase |
| `CobolCase` | `USER-SERVICE-NAME` | COBOL identifiers, legacy systems |
| `LowerCase` | `user service name` | Plain text, search terms |
| `UpperCase` | `USER SERVICE NAME` | Emphasis, headers |

## Case Style Constants

In Rhai scripts, case styles are available as constants:

```rhai
// Individual case style constants
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

## Case Style Collections

Archetect provides predefined collections for common use cases:

### PROGRAMMING_CASES

The most commonly used case formats for programming (excludes cases with spaces):

```rhai
PROGRAMMING_CASES = [CamelCase, ConstantCase, KebabCase, PascalCase, SnakeCase]
```

**Included**: `CamelCase`, `ConstantCase`, `KebabCase`, `PascalCase`, `SnakeCase`

**Excluded**: `TitleCase`, `SentenceCase`, `LowerCase`, `UpperCase` (contain spaces, cannot be template variable keys)

### PROGRAMMING_CASES_ALL

All programming-related case styles including specialized formats:

```rhai
PROGRAMMING_CASES_ALL = [CamelCase, CobolCase, ConstantCase, KebabCase, PascalCase, SnakeCase, TrainCase]
```

## Direct Case Functions

Apply case transformations directly using dedicated functions:

```rhai
let input = "user service name";

// Basic transformations
let camel = camel_case(input);        // userServiceName
let pascal = pascal_case(input);      // UserServiceName
let snake = snake_case(input);        // user_service_name
let kebab = kebab_case(input);        // user-service-name
let constant = constant_case(input);  // USER_SERVICE_NAME
let title = title_case(input);        // User Service Name
let sentence = sentence_case(input);  // User service name
let train = train_case(input);        // User-Service-Name
let directory = directory_case(input); // user/service/name
let package = package_case(input);    // user.service.name
let class = class_case(input);        // UserServiceName
let cobol = cobol_case(input);        // USER-SERVICE-NAME
let lower = lower_case(input);        // user service name
let upper = upper_case(input);        // USER SERVICE NAME
```

## Detailed Case Style Descriptions

### CamelCase
**Pattern**: First word lowercase, subsequent words capitalized, no separators  
**Example**: `user service name` → `userServiceName`  
**Use Cases**: JavaScript variables, Java methods, object properties

### PascalCase  
**Pattern**: All words capitalized, no separators  
**Example**: `user service name` → `UserServiceName`  
**Use Cases**: Class names, type definitions, React components, constructors

### SnakeCase
**Pattern**: All lowercase with underscores between words  
**Example**: `user service name` → `user_service_name`  
**Use Cases**: Rust variables, Python functions, database columns, configuration keys

### KebabCase
**Pattern**: All lowercase with hyphens between words  
**Example**: `user service name` → `user-service-name`  
**Use Cases**: URLs, CSS classes, CLI flags, configuration files, HTML attributes

### ConstantCase
**Pattern**: All uppercase with underscores between words  
**Example**: `user service name` → `USER_SERVICE_NAME`  
**Use Cases**: Constants, environment variables, global settings

### TitleCase
**Pattern**: Each word capitalized with spaces preserved  
**Example**: `user service name` → `User Service Name`  
**Use Cases**: Human-readable titles, documentation headers, display names

### SentenceCase
**Pattern**: First word capitalized, rest lowercase with spaces  
**Example**: `user service name` → `User service name`  
**Use Cases**: Natural text, descriptions, documentation content

### TrainCase
**Pattern**: Each word capitalized with hyphens between words  
**Example**: `user service name` → `User-Service-Name`  
**Use Cases**: HTTP headers, special identifiers, legacy system conventions

### DirectoryCase
**Pattern**: All lowercase with forward slashes between words  
**Example**: `user service name` → `user/service/name`  
**Use Cases**: File paths, directory structures, namespace paths

### PackageCase
**Pattern**: All lowercase with dots between words  
**Example**: `user service name` → `user.service.name`  
**Use Cases**: Java packages, namespace identifiers, configuration paths

### ClassCase
**Pattern**: Alias for PascalCase  
**Example**: `user service name` → `UserServiceName`  
**Use Cases**: Same as PascalCase - provided for semantic clarity

### CobolCase
**Pattern**: All uppercase with hyphens between words  
**Example**: `user service name` → `USER-SERVICE-NAME`  
**Use Cases**: COBOL identifiers, legacy systems, specialized conventions

### LowerCase
**Pattern**: All lowercase with spaces preserved  
**Example**: `user service name` → `user service name`  
**Use Cases**: Plain text processing, search terms, normalization

### UpperCase
**Pattern**: All uppercase with spaces preserved  
**Example**: `user service name` → `USER SERVICE NAME`  
**Use Cases**: Emphasis text, headers, alert messages

## Language-Specific Conventions

### Rust
```rhai
let entity_name = "user service";

context.struct_name = pascal_case(entity_name);     // UserService
context.field_name = snake_case(entity_name);       // user_service
context.const_name = constant_case(entity_name);    // USER_SERVICE
context.module_name = snake_case(entity_name);      // user_service
context.crate_name = kebab_case(entity_name);       // user-service
```

### JavaScript/TypeScript
```rhai
let entity_name = "user service";

context.class_name = pascal_case(entity_name);      // UserService
context.variable_name = camel_case(entity_name);    // userService
context.file_name = kebab_case(entity_name);        // user-service
context.constant_name = constant_case(entity_name); // USER_SERVICE
```

### Python
```rhai
let entity_name = "user service";

context.class_name = pascal_case(entity_name);      // UserService
context.function_name = snake_case(entity_name);    // user_service
context.constant_name = constant_case(entity_name); // USER_SERVICE
context.module_name = snake_case(entity_name);      // user_service
```

### Java
```rhai
let entity_name = "user service";

context.class_name = pascal_case(entity_name);      // UserService
context.method_name = camel_case(entity_name);      // userService
context.package_name = package_case(entity_name);   // user.service.name
context.constant_name = constant_case(entity_name); // USER_SERVICE
```

## Usage in Casing Strategies

Case styles are used with [Casing Strategies](../casing-strategies/) to apply transformations:

```rhai
// Single case application
cased_as: CasedIdentityCasedValue(PascalCase)

// Multiple case application
cased_as: CasedIdentityCasedValue([CamelCase, PascalCase, SnakeCase])

// Programming cases collection
cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)
```

## Text Processing Functions

Additional text transformation functions complement case styles:

```rhai
// Pluralization
let plural = pluralize("service");        // services
let singular = singularize("services");   // service

// Ordinalization  
let first = ordinalize(1);               // 1st
let second = ordinalize("2");            // 2nd
let third = ordinalize(3);               // 3rd
```

## Best Practices

### Choose Appropriate Styles for Context

```rhai
// File naming
context.rust_file = snake_case(name) + ".rs";           // user_service.rs
context.js_file = kebab_case(name) + ".js";             // user-service.js
context.py_file = snake_case(name) + ".py";             // user_service.py

// API endpoints
context.rest_endpoint = "/" + kebab_case(name);         // /user-service
context.graphql_type = pascal_case(name);               // UserService

// Configuration
context.env_var = constant_case(name) + "_PORT";        // USER_SERVICE_PORT
context.config_key = snake_case(name) + "_config";      // user_service_config
```

### Use Collections for Comprehensive Coverage

```rhai
// Most programming scenarios
cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES)

// All programming cases including specialized
cased_as: CasedIdentityCasedValue(PROGRAMMING_CASES_ALL)

// Custom selection for specific needs
cased_as: CasedIdentityCasedValue([PascalCase, SnakeCase, ConstantCase])
```

### Handle Special Characters

```rhai
// Case functions handle various input formats
let messy_input = "user@service-name_v2";
context.clean_pascal = pascal_case(messy_input);    // UserServiceNameV2
context.clean_snake = snake_case(messy_input);      // user_service_name_v2
context.clean_kebab = kebab_case(messy_input);      // user-service-name-v2
```

## See Also

- **[Casing Strategies](../casing-strategies/)** - How to apply multiple case transformations
- **[Prompts/Casing Strategies](../prompts/casing-strategies/)** - Using case styles in prompts
- **Set Function** - Applying case transformations to variables (coming soon)