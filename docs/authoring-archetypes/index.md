---
sidebar_position: 1
---

# Authoring Archetypes

This comprehensive guide covers everything you need to know about creating your own Archetect archetypes, from simple templates to sophisticated interactive generators with complex logic.

## What You'll Learn

In this section, you'll master:

- **[Templating](./templating)**: Creating dynamic templates with Jinja2-compatible syntax
- **[Scripting](./scripting)**: Complete guide to Rhai scripting with prompting, casing, and language fundamentals

## Quick Start for Authors

### 1. Basic Archetype Structure

Every archetype needs this minimal structure:

```
my-archetype/
├── archetype.yaml          # Archetype metadata
├── archetype.rhai          # Interactive script (optional)
└── content/                # Template files
    ├── src/
    │   └── main.rs
    ├── Cargo.toml
    └── README.md
```

### 2. Simple Template Example

```jinja
{# Cargo.toml #}
[package]
name = "{{ project_name }}"
version = "{{ version | default('0.1.0') }}"
description = "{{ description }}"
authors = ["{{ author_name }} <{{ author_email }}>"]
edition = "{{ rust_edition | default('2021') }}"

[dependencies]
{% for dep in dependencies %}
{{ dep.name }} = "{{ dep.version }}"
{% endfor %}
```

### 3. Basic Rhai Script

```rhai
let context = #{};

// Gather user input
context.project_name = prompt("Project name:");
context.description = prompt("Description:");
context.author_name = prompt("Author name:");

// Transform for templates
context.project_snake = snake_case(context.project_name);
context.project_pascal = pascal_case(context.project_name);

// Output for templates
debug(context);
```

## Authoring Workflow

### 1. Design Phase
- **Define purpose** - What will your archetype generate?
- **Identify variables** - What can users customize?
- **Plan structure** - How will files be organized?
- **Choose complexity** - Simple templates or interactive scripts?

### 2. Development Phase
- **Create archetype.yaml** - Define metadata and configuration
- **Build templates** - Create dynamic file templates  
- **Write scripts** - Add interactive logic (if needed)
- **Test locally** - Verify generation works correctly

### 3. Polish Phase
- **Add validation** - Ensure robust input handling
- **Write documentation** - Create clear usage instructions
- **Add examples** - Provide sample configurations
- **Performance tune** - Optimize for speed and resource usage

## Archetype Types

### Static Templates
Simple file generation with variable substitution:
- Configuration files
- Boilerplate code
- Documentation templates

### Interactive Generators  
Complex logic with user interaction:
- Multi-technology projects
- Feature-driven generation
- Conditional file inclusion

### Hybrid Approaches
Combination of static and dynamic elements:
- Base project + optional features
- Technology-specific variations
- Extensible architectures

## Key Concepts

### Variables and Context
- All template variables come from the script context
- Use meaningful, consistent naming conventions
- Provide sensible defaults for optional values

### Case Transformations
- Leverage Archetect's powerful case conversion
- Generate language-appropriate naming
- Maintain consistency across files

### Feature Flags
- Use boolean flags for optional features
- Enable/disable entire sections of templates
- Create modular, configurable archetypes

### User Experience
- Progressive prompting (basic → advanced)
- Helpful defaults and suggestions
- Clear error messages and validation

## Advanced Topics

### Module System
- Create reusable Rhai modules
- Share common logic across archetypes
- Build archetype libraries

### Template Inheritance
- Base templates with extensible blocks
- Shared components and layouts
- Consistent styling and structure

### External Integration
- Command execution and validation
- File system operations
- Network resources and APIs

### Testing and Quality
- Automated testing strategies
- Validation and linting
- Performance optimization

## Getting Help

### Resources
- **[Templating Reference](./templating)** - Complete templating guide
- **[Scripting Guide](./scripting)** - Comprehensive Rhai scripting reference

### Community
- **GitHub Discussions** - Ask questions and share examples
- **Example Repositories** - Browse community archetypes
- **Contribution Guidelines** - Help improve Archetect

Ready to start building? Begin with the [Templating Guide](./templating) for static generation, or jump to the [Scripting Guide](./scripting) for interactive archetypes.