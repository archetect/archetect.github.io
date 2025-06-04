---
sidebar_position: 7
---

# Logging and Debugging

Archetect provides several output functions for logging, debugging, and displaying information during archetype execution. Each function serves a specific purpose and outputs to different streams for proper separation of concerns.

## Output Functions Overview

| Function | Output Stream | Purpose | Verbosity Control |
|----------|---------------|---------|-------------------|
| `log()` | stderr | Structured logging with levels | Yes (CLI `-v` flags) |
| `print()` | stdout | Capturable output | No |
| `display()` | stderr | User messages and instructions | No |
| `debug()` | stderr | Script debugging with position info | No |

## Logging with `log()`

The `log()` function provides structured logging with different severity levels. All log output goes to **stderr** and respects CLI verbosity settings.

### Log Levels

```rhai
log(Trace, "Detailed trace information");
log(Debug, "Debug information");
log(Info, "General information");
log(Warn, "Warning messages"); 
log(Error, "Error messages");
```

### Verbosity Control

Log output is controlled by CLI verbosity flags:

- **Default**: `Info`, `Warn`, and `Error` messages
- **`-v`**: Adds `Debug` messages
- **`-vv`**: Adds `Trace` messages

```bash
# Default verbosity (Info and above)
archetect render my-archetype

# Debug verbosity (Debug and above)  
archetect render my-archetype -v

# Trace verbosity (all messages)
archetect render my-archetype -vv
```

## User Output with `display()`

The `display()` function outputs messages to **stderr** for user communication that should not be captured by shell redirection.

### Basic Usage

```rhai
display("Setting up project structure...");
display(); // Empty line for spacing
```

### Common Patterns

**Post-generation instructions:**
```rhai
display();
display("Next steps:");
display(render("cd {{ project_name }}", context));
display("git init -b main");
display("git add .");
display("git commit -m 'initial commit'");
```

**Conditional debugging:**
```rhai
if switch_enabled("debug-context") {
    display("Current context:");
    display(as_yaml(context));
}
```

## Capturable Output with `print()`

The `print()` function outputs to **stdout**, making it suitable for data that should be captured by shell redirection or piping.

```rhai
// Output that can be captured
print("Generated project at: " + project_path);
print(as_json(summary_data));

// Command usage
// archetect render my-archetype > output.txt
```

## Script Debugging with `debug()`

The `debug()` function provides detailed debugging information including script position and context.

```rhai
let config = #{ name: "test", version: "1.0" };
debug(config); // Shows value with position info

debug("Processing user input");
debug(SWITCHES); // Debug built-in variables
```

Output includes position information:
```
[Line 15, Column 5] | #{name: "test", version: "1.0"}: config
```

## Practical Examples

### Progressive Logging During Generation

```rhai
log(Info, "Starting archetype generation");

let context = #{};
log(Debug, "Created empty context");

context.project_name = prompt("Project name:");
log(Debug, "Collected project name: " + context.project_name);

if !is_valid_identifier(context.project_name) {
    log(Error, "Invalid project name format");
    exit(1);
}

log(Info, "Project name validated successfully");
display("Generating project: " + context.project_name);
```

### Debugging Context and Variables

```rhai
// Debug switch for development
if switch_enabled("debug") {
    log(Debug, "Debug mode enabled");
    debug(context);
    debug(SWITCHES);
    display("Current working directory: " + pwd());
}
```

### Error Handling and Logging

```rhai
if !file_exists("required-config.toml") {
    log(Error, "Missing required configuration file");
    display("Error: Please ensure required-config.toml exists");
    exit(1);
}

log(Info, "Configuration file found");
```

### Mixing Output Types

```rhai
// User-facing message (stderr)
display("Collecting project information...");

// Structured logging (stderr, respects verbosity)
log(Info, "Starting user input collection");

// Process user input
let name = prompt("Project name:");
log(Debug, "User entered: " + name);

// Capturable output (stdout) 
print("PROJECT_NAME=" + name);
```

## Best Practices

### When to Use Each Function

- **`log()`**: For structured application logging that respects verbosity levels
- **`display()`**: For user messages, instructions, and non-capturable output
- **`print()`**: For data that should be capturable by shell redirection
- **`debug()`**: For development debugging with position context

### Output Stream Considerations

**stderr functions** (`log`, `display`, `debug`):
- User messages and instructions
- Status updates and progress
- Error messages and warnings
- Debug information

**stdout functions** (`print`):
- Data that users might want to capture
- Structured output (JSON, YAML)
- Values for shell scripting

### Development Workflow

1. Use `log(Debug, ...)` during development
2. Add conditional debugging with switches
3. Use `display()` for user instructions
4. Reserve `print()` for capturable data
5. Remove or reduce logging verbosity for production

The logging and debugging system in Archetect provides comprehensive output control while maintaining proper separation between user messaging and capturable data output.