---
sidebar_position: 5
---

# Rendering

Archetect's rendering system provides three distinct ways to generate content during archetype execution. Understanding these rendering methods is crucial for building sophisticated archetypes that can compose multiple templates, directories, and components.

## Overview

Archetect offers three primary rendering mechanisms:

1. **[String Rendering](./strings/)** - Process individual template strings with context variables
2. **[Directory Rendering](./directories/)** - Render entire directory structures with templates
3. **[Component Rendering](./components/)** - Compose archetypes as reusable components

Each method serves different use cases and can be combined to create powerful, modular archetype systems.

## When to Use Each Method

### String Rendering
Use string rendering when you need to:
- Generate dynamic content inline within scripts
- Process small templates without file I/O
- Create configuration strings or code snippets
- Transform user input into formatted output

### Directory Rendering
Use directory rendering when you need to:
- Process entire folder structures
- Maintain file organization and hierarchy
- Apply consistent context across multiple files
- Handle complex template structures

### Component Rendering
Use component rendering when you need to:
- Compose multiple archetypes together
- Create modular, reusable archetype components
- Enable optional feature inclusion
- Build archetype libraries and ecosystems

## Rendering in Context

All rendering methods work with the same context system established through prompting and variable assignment:

```rhai
// Establish context
let context = #{};
context.project_name = prompt("Project name:");
context.author = prompt("Author name:");

// Use context with any rendering method
let readme = render("# {{ project_name }}\nBy {{ author }}", context);
Directory("content/").render(context);
Archetype("database").render(context);
```

## Getting Started

1. **[Start with String Rendering](./strings/)** to understand template processing basics
2. **[Learn Directory Rendering](./directories/)** for file system operations
3. **[Master Component Rendering](./components/)** for archetype composition
4. **Combine methods** to build sophisticated generation workflows

The rendering system is designed to be composable, allowing you to mix and match these approaches based on your archetype's specific needs.