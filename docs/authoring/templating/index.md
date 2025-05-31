---
sidebar_position: 2
sidebar_label: Templating
---

# Templating

The templating system is the core system that processes and transforms your template files during archetype generation. It provides powerful templating capabilities using Jinja2-compatible syntax, enabling you to create dynamic, flexible, and maintainable templates for your archetypes.

## Overview

The templating system processes all files in your archetype's template directories, replacing variables, executing template logic, and generating the final project structure. It supports everything from simple variable substitution to complex conditional logic and template inheritance.

## Key Features

- **Jinja2-Compatible Syntax**: Familiar templating syntax with variables, conditionals, loops, and filters
- **Dynamic File Names**: Use template syntax in file and directory names
- **Template Inheritance**: Create reusable base templates that can be extended
- **Conditional Rendering**: Include or exclude content based on user inputs
- **Advanced Filters**: Built-in case conversion and formatting filters
- **Performance Optimized**: Efficient template compilation and rendering

## Templating Components

### [Fundamentals](fundamentals/)

Learn the basics of template development, including file organization, processing rules, and core syntax patterns.

### [Organization](organization/)

Discover effective patterns for organizing your templates, from hierarchical structures to feature-based organization and shared components.

### [Advanced Techniques](advanced-techniques/)

Master advanced templating features including template inheritance, dynamic template selection, and working with complex data structures.

### [Testing & Validation](testing-validation/)

Ensure your templates are robust with comprehensive testing strategies, validation techniques, and debugging approaches.

### [Performance](performance/)

Optimize your templates for better performance with compilation strategies, efficient conditional rendering, and best practices.

## Getting Started

If you're new to templating, start with the [Fundamentals](fundamentals/) section to learn the core concepts and syntax. For experienced users looking to improve their template organization, jump to [Organization](organization/) or explore [Advanced Techniques](advanced-techniques/) for powerful templating patterns.

## Template Processing Flow

1. **Discovery**: Templating system scans template directories
2. **Variable Resolution**: Resolves variables from user inputs and scripts
3. **Template Compilation**: Compiles templates for efficient processing
4. **Rendering**: Processes templates and generates output files
5. **Post-Processing**: Applies any final transformations or validations

The templating system works seamlessly with the [Scripting](../scripting/) to provide a complete archetype development experience.
