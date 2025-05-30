---
sidebar_position: 6
---

# Scripting Engine

Archetect's scripting engine is powered by [Rhai](https://rhai.rs/book/), providing dynamic and interactive archetype generation capabilities. The scripting engine allows you to create sophisticated logic for user interaction, data validation, and template control.

## Overview

The Rhai scripting engine in Archetect enables:

- **Complex prompting logic** with conditional questions
- **Data validation and transformation** 
- **Dynamic feature selection** based on user choices
- **External command execution** and integration
- **Advanced case transformations** and string manipulation

## Architecture

```rhai
// Basic script structure
let context = #{};              // Create context map

// Gather user input
context.service_name = prompt("Service Name:");

// Process and transform data
context.service_snake = snake_case(context.service_name);

// Output context for templates
debug(context);
```

## Scripting Guide Structure

### [Rhai Basics](./rhai-basics/)
Learn the core Rhai language features, data types, control flow, and fundamental concepts needed for archetype scripting.

### [Prompting](./prompting/)
Master the art of interactive user input with various prompt types, validation, and advanced prompting patterns.

### [Casing](./casing/)
Explore Archetect's powerful case transformation system for generating consistent naming across different programming languages and conventions.

### [Switches](./switches/)
Learn how to use command-line switches for conditional content generation, enabling flexible archetype behavior without complex prompts.

### [Rendering](./rendering/)
Master the three rendering methods: string rendering for inline templates, directory rendering for file structures, and component rendering for archetype composition.

### [Logging and Debugging](./logging-debugging/)
Learn how to use logging, debugging, and output functions to create informative and debuggable archetypes with proper output stream management.

## When to Use Scripts

Use Rhai scripts in your archetypes when you need:

- **Progressive prompting** - Ask follow-up questions based on previous answers
- **Input validation** - Ensure user input meets specific requirements
- **Feature dependencies** - Automatically include related features
- **Complex transformations** - Generate derived values from user input
- **Conditional logic** - Include/exclude files based on user choices

## Getting Started

1. **Start with [Rhai Basics](./rhai-basics/)** to understand the language fundamentals
2. **Learn [Prompting](./prompting/)** to gather user input effectively
3. **Master [Casing](./casing/)** to generate proper naming conventions
4. **Explore [Switches](./switches/)** for command-line driven conditional logic
5. **Understand [Rendering](./rendering/)** to output templates, directories, and components
6. **Learn [Logging and Debugging](./logging-debugging/)** for proper output and debugging techniques
7. **Build complex scenarios** by combining these concepts

The scripting engine transforms static templates into dynamic, interactive generators that can adapt to your users' specific needs.