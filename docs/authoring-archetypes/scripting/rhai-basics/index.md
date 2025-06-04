---
sidebar_position: 1
---

# Rhai Basics

This guide covers the fundamental concepts of the Rhai scripting language as used within Archetect. Rhai is a simple, fast, and safe embedded scripting language for Rust applications.

## Introduction to Rhai in Archetect

Archetect integrates the [Rhai scripting language](https://rhai.rs/book/) to provide dynamic, interactive archetype generation. Rhai scripts (`archetype.rhai`) handle user interaction, data validation, and template control.

## Core Language Features

### Variables and Data Types

```rhai
// Variable declarations (dynamically typed)
let name = "service";           // String
let port = 8080;               // Integer  
let enabled = true;            // Boolean
let services = ["api", "web"]; // Array
let config = #{               // Object map
    host: "localhost",
    port: 3000
};

// Variable reassignment
name = "updated-service";
```

### Object Maps (Primary Data Structure)

Object maps are the primary data structure for passing context to templates:

```rhai
// Create and populate maps
let context = #{};
context.service_name = "UserService";
context.port = 8080;

// Nested maps
context.database = #{
    type: "postgresql",
    host: "localhost",
    port: 5432
};

// Merge maps with +=
context += #{
    features: ["auth", "logging"],
    debug: true
};
```

### Arrays and Iteration

```rhai
// Array operations
let services = ["user", "order", "payment"];
services.push("notification");
let first = services[0];
let length = services.len();

// Iteration
for service in services {
    print("Processing: " + service);
}

// Array with maps
let endpoints = [
    #{ path: "/users", method: "GET" },
    #{ path: "/orders", method: "POST" }
];
```

### Control Flow

```rhai
// Conditional statements
if switch_enabled("testing") {
    context.test_framework = "jest";
} else if context.language == "rust" {
    context.test_framework = "cargo test";
} else {
    context.test_framework = "none";
}

// Switch expressions (Rhai feature)
context.port = switch context.environment {
    "development" => 3000,
    "staging" => 4000,
    "production" => 80,
    _ => 8080
};

// Loops
let count = 0;
while count < 5 {
    print("Count: " + count);
    count += 1;
}

for i in range(0, 3) {
    print("Index: " + i);
}
```

## String and Data Operations

### String Manipulation

```rhai
// String operations (from Rhai)
let length = "hello".len();               // String length
let upper = "hello".to_upper();           // Convert to uppercase
let lower = "HELLO".to_lower();           // Convert to lowercase
let trimmed = "  hello  ".trim();         // Remove whitespace

// Array operations
let joined = ["a", "b", "c"].join(", ");  // "a, b, c"
```

### UUID Generation

```rhai
// UUID generation
let id = uuid();                          // Generate random UUID
```

## Utility Functions

### Format Conversion

```rhai
// Convert data to different formats
let yaml_str = as_yaml(context);          // Convert to YAML string
let json_str = as_json(context);          // Convert to JSON string  
let rhai_str = as_rhai(context);          // Convert to Rhai representation

// Parse from formats
let data = from_yaml(yaml_string);        // Parse YAML string
let data = from_json(json_string);        // Parse JSON string
```

### Environment and Switch Checking

```rhai
// Check if command-line switch is enabled
if switch_enabled("verbose") {
    debug("Verbose mode enabled");
}

if switch_enabled("production") {
    context.environment = "production";
    context.debug = false;
} else {
    context.environment = "development"; 
    context.debug = true;
}
```

### Debug and Output

```rhai
// Debug output (shows in verbose mode)
debug(context);                           // Debug entire context
debug("Processing service: " + service_name);

// Console output
print("Generating project...");           // Print to console
display("User message");                  // Display message to user
display();                               // Empty line
```

## Error Handling

```rhai
// Graceful error handling
try {
    context.port = prompt("Port:", #{type: Int});
    if context.port < 1024 {
        throw "Port too low";
    }
} catch (error) {
    print("Using default port due to error: " + error);
    context.port = 8080;
}
```

## Best Practices

### Script Organization

```rhai
// Organize scripts with clear sections
let context = #{};

//=== Project Configuration ===
context.project_name = prompt("Project name:");
context.description = prompt("Description:");

//=== Technology Stack ===
context.language = prompt("Programming language:", #{
    type: Select(["rust", "javascript", "python", "go"])
});

//=== Generate derived values ===
context.project_snake = snake_case(context.project_name);
context.project_pascal = pascal_case(context.project_name);
context.project_kebab = kebab_case(context.project_name);

//=== Output for debugging ===
if switch_enabled("debug") {
    debug(context);
}
```

### Performance Considerations

```rhai
// Cache expensive computations
let computed_values = #{};

if !("project_cases" in computed_values) {
    computed_values.project_cases = #{
        snake: snake_case(context.project_name),
        pascal: pascal_case(context.project_name),
        kebab: kebab_case(context.project_name),
        constant: constant_case(context.project_name)
    };
}

// Use cached values
context += computed_values.project_cases;
```

## Next Steps

- Learn about [Prompting](../prompting/) to gather user input
- Explore [Casing](../casing/) for name transformations
- Check the [Rhai language book](https://rhai.rs/book/) for advanced features