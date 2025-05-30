---
sidebar_position: 3
---

# Basic Concepts

Understanding these core concepts will help you work effectively with Archetect and make the most of its powerful features.

## Archetypes

An **archetype** is a template project or code generator that defines:
- File and directory structure
- Template files with placeholders
- Interactive prompts for gathering user input
- Scripts for complex generation logic
- Configuration for customizing behavior

Think of an archetype as a "project template on steroids" - it can generate anything from simple file templates to complex, multi-language project structures.

### Example Archetypes
- **Rust CLI Project**: Generates a complete Rust command-line application with dependencies, tests, and CI configuration
- **React Component**: Creates a React component with TypeScript, tests, and documentation
- **API Endpoint**: Generates REST API endpoints with validation, database models, and tests

## Templates

**Templates** are files within an archetype that contain placeholders for dynamic content. Archetect uses a Jinja2-compatible templating engine with enhanced features.

### Template Syntax
```jinja
// {{ project_name }}/src/main.rs
use clap::Parser;

#[derive(Parser)]
#[command(name = "{{ project_name }}")]
#[command(about = "{{ description }}")]
struct Cli {
    // CLI implementation
}

fn main() {
    let cli = Cli::parse();
    println!("Hello from {{ project_name | title_case }}!");
}
```

### Template Features
- **Variables**: `{{ variable_name }}`
- **Filters**: `{{ name | snake_case }}`
- **Conditionals**: `{% if condition %}...{% endif %}`
- **Loops**: `{% for item in items %}...{% endfor %}`
- **Inheritance**: `{% extends "base.template" %}`

## Prompts

**Prompts** gather information from users during generation. Archetect supports various prompt types:

- **Text**: Free-form text input
- **Select**: Choose from predefined options
- **Multiselect**: Choose multiple options
- **Boolean**: Yes/no questions
- **Integer**: Numeric input with validation
- **List**: Build dynamic lists

### Example Prompts
```rhai
let project_name = prompt("Project name:", #{
    validation: "required|alpha_dash",
    help: "Use lowercase letters, numbers, and dashes only"
});

let features = prompt_multiselect("Select features:", [
    "cli", "web", "database", "auth"
], #{
    help: "Choose the features to include in your project"
});
```

## Scripting with Rhai

**Rhai scripts** provide programmatic control over the generation process. The main script (`archetype.rhai`) orchestrates:
- User prompts and input validation
- Conditional logic for different project types
- File operations and transformations
- Integration with external tools

### Script Capabilities
```rhai
// Gather user input
let project_type = prompt_select("Project type:", ["library", "binary"]);

// Conditional logic
if project_type == "binary" {
    let cli_framework = prompt_select("CLI framework:", ["clap", "structopt"]);
}

// String transformations
let class_name = project_name.pascal_case();
let snake_name = project_name.snake_case();

// File operations
if project_type == "library" {
    // Skip CLI-specific templates
    skip_template("src/cli/");
}
```

## Configuration

### Archetype Manifest
Each archetype has a `archetype.yaml` file that defines metadata and configuration:

```yaml
description: "Modern Rust CLI application"
authors: ["Your Name"]
languages: ["Rust"]
tags: ["cli", "command-line", "clap"]

requires:
  archetect: "^2.0.0"

scripting:
  main: "archetype.rhai"
  modules: "modules"

templating:
  content: "template"
  templates: "includes"
  undefined_behavior: "Strict"
```

### User Configuration
Global user preferences in `~/.archetect/config.yaml`:

```yaml
actions:
  rust-cli: "https://github.com/archetect/rust-cli-archetype.git"
  
defaults:
  author: "Your Name"
  email: "your.email@example.com"
  
settings:
  offline_mode: false
  auto_update: true
```

## String Transformations

Archetect includes powerful string transformation utilities for generating properly-formatted code:

- **Case Conversions**: `snake_case`, `camelCase`, `PascalCase`, `kebab-case`
- **Pluralization**: `user` → `users`, `child` → `children`
- **Code Formatting**: Package names, class names, file names

### Transformation Examples
```rhai
let input = "user account";

// Case transformations
let snake = input.snake_case();      // "user_account"
let camel = input.camel_case();      // "userAccount"
let pascal = input.pascal_case();    // "UserAccount"
let kebab = input.kebab_case();      // "user-account"

// Pluralization
let plural = "user".pluralize();     // "users"
let singular = "children".singularize(); // "child"
```

## Catalogs

**Catalogs** are collections of related archetypes organized for easy browsing:

```bash
# Browse a catalog interactively
archetect catalog https://github.com/archetect/catalog.git

# Direct generation from catalog
archetect render rust-cli my-project
```

## Generation Workflow

The typical Archetect workflow:

1. **Discovery**: Find or create an archetype
2. **Execution**: Run `archetect render <archetype> <destination>`
3. **Interaction**: Answer prompts for project configuration
4. **Generation**: Archetect processes templates and creates files
5. **Customization**: Modify generated files as needed

## Next Steps

Now that you understand the core concepts, let's put them into practice with our [Quick Start Tutorial](./quick-start), where you'll generate your first project using Archetect.